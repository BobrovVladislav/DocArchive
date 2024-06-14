import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(() => {
    // Попытка получить токен из localStorage при загрузке компонента
    return localStorage.getItem("jwt") || null;
  });
  const [user, setUser] = useState(null);
  const [personalAccountData, setPersonalAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получение данных пользователя
    const getUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!response.ok) {
          setJwt(null)
          setUser(null)
          throw new Error('Ошибка при получении данных пользователя');
        }

        const data = await response.json();
        await setJwt(data.jwt);
        await setUser({
          id: data.user.id,
          email: data.user.contactInfo.email,
          role: data.user.role,
          photo: data.user.photo,
          firstName: data.user.firstName,
          middleName: data.user.middleName,
          lastName: data.user.lastName,
          gender: data.user.gender,
          birthDate: data.user.birthDate,
          department: data.user.department,
          manager: data.user.manager,
          position: data.user.position,
          phone: data.user.contactInfo.phone,
          displayName: `${data.user.middleName} ${data.user.firstName[0]}. ${data.user.lastName[0]}.`,
          permissions: {
            canDownload: data.user.permissions.canDownload,
            canEdit: data.user.permissions.canEdit,
            canDelete: data.user.permissions.canDelete,
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    // Обновление localStorage при изменении токена
    if (jwt !== null) {
      localStorage.setItem("jwt", jwt);
      getUser();
    } else {
      localStorage.removeItem("jwt");
      setUser(null);
    }
  }, [jwt]);

  const login = async (token) => {
    setJwt(token);
  };

  const logout = () => {
    setJwt(null);
  };

  // Получение данных пользователя
  const getUserById = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении данных пользователя');
      }

      const data = await response.json();
      await setPersonalAccountData({
        id: data.user.id,
        email: data.user.contactInfo.email,
        role: data.user.role,
        photo: data.user.photo,
        firstName: data.user.firstName,
        middleName: data.user.middleName,
        lastName: data.user.lastName,
        gender: data.user.gender,
        birthDate: data.user.birthDate,
        department: data.user.department,
        manager: data.user.manager,
        position: data.user.position,
        phone: data.user.contactInfo.phone,
        displayName: `${data.user.middleName} ${data.user.firstName[0]}. ${data.user.lastName[0]}.`,
        permissions: {
          canDownload: data.user.permissions.canDownload,
          canEdit: data.user.permissions.canEdit,
          canDelete: data.user.permissions.canDelete,
        }
      });
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ jwt, user, login, logout, loading, setUser, personalAccountData, getUserById }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};