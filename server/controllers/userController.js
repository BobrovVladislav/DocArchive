const prisma = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const generateJwt = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};

class UserController {
  async registration(req, res) {
    try {
      const { email, password, firstName, middleName, lastName, gender, birthDate, department, manager, position } = req.body;
      if (!email || !password || !firstName || !middleName || !department || !manager || !position) {
        return res.status(400).json({ error: 'Некорректные данные' });
      }

      const existingUser = await prisma.contactInfo.findFirst({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      }

      const hashPassword = await bcrypt.hash(password, 5);

      const newUser = await prisma.user.create({
        data: {
          password: hashPassword,
          firstName,
          middleName,
          lastName,
          gender,
          birthDate: birthDate ? new Date(birthDate) : undefined,
          department,
          manager,
          position,
          contactInfo: { create: { email: email } },
          permissions: { create: { canEdit: false, canDelete: false, canDownload: false } },
          // role: "admin"
        },
      });

      return res.json({ message: "Регистрация прошла успешно", newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const userData = await prisma.contactInfo.findFirst({
        where: { email },
        include: { user: true }
      });

      if (!userData) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      const user = userData.user;

      const comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({ error: 'Указан неверный пароль' });
      }

      const jwt = generateJwt(user.id, user.email, user.role);

      return res.json({ message: "Авторизация прошла успешно", jwt, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  async check(req, res) {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        contactInfo: true,
        permissions: true,
      },
    });

    const jwt = generateJwt(req.user.id, req.user.email, req.user.role);

    return res.json({ jwt, user });
  }

  async getUserById(req, res) {
    const { id } = req.params;

    try {
      // Проверяем, является ли пользователь администратором или запрашивает свой собственный профиль
      if (req.user.role === "admin" || parseInt(id, 10) === req.user.id) {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id, 10) },
          include: {
            contactInfo: true,
            permissions: true,
          },
        });
        // Регенерируем JWT
        const jwt = generateJwt(req.user.id, req.user.email, req.user.role);

        return res.json({ jwt, user });
      } else {
        // Если пользователь не администратор и пытается получить данные другого пользователя
        return res.status(403).json({ message: 'Отказано в доступе' });
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      return res.status(500).json({ message: "Ошибка сервера при получении данных пользователя" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        include: {
          permissions: true,
        },
        orderBy: {
          middleName: 'asc',
        },
      });

      return res.json({
        users
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  async updatePermission(req, res) {
    const { userId } = req.params;
    const { canEdit, canDelete, canDownload } = req.body;

    try {
      const permissions = await prisma.permission.upsert({
        where: { userId: parseInt(userId, 10) },
        update: { canEdit, canDelete, canDownload },
        create: {
          userId: parseInt(userId, 10),
          canEdit: canEdit ?? false,
          canDelete: canDelete ?? false,
          canDownload: canDownload ?? false,
        },
      });
      res.json({ permissions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка при обновлении прав' });
    }
  }

  async updatePhoto(req, res) {
    const { id } = req.params;
    const { photo } = req.body;

    try {
      // Обновление фото пользователя в базе данных
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: { photo },
      });

      // Возвращаем обновленного пользователя в ответе
      res.json({ user: updatedUser });
    } catch (error) {
      console.error("Ошибка при обновлении фото:", error);
      res.status(500).json({ message: "Ошибка при обновлении фото." });
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.id;

    try {
      const userToDelete = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
      });

      if (!userToDelete) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      // Проверяем, что у пользователя не роль "admin"
      if (userToDelete.role === "admin") {
        return res.status(403).json({ error: 'У вас нет разрешения на удаление админа' });
      }

      // Удаляем пользователя
      await prisma.user.delete({
        where: { id: parseInt(userId) },
        include: {
          contactInfo: true,
          permissions: true
        }
      });

      return res.json({ message: 'Пользователь успешно удален' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

}

module.exports = new UserController();