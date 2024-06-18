-- Проверка, занят ли email
DO $$
DECLARE
    new_user_id INT;
BEGIN
   -- Проверяем существует ли уже этот email в ContactInfo
   IF NOT EXISTS (SELECT 1 FROM "ContactInfo" WHERE "email" = 'admin@mail.ru') THEN
       -- Вставка нового администратора
       INSERT INTO "User" (
           "firstName", "middleName", "lastName", "password", "role", "department", "manager", "position"
       )
       VALUES (
           'Иван', 
           'Петров', 
           'Михайлович', 
           '$2b$05$4b9tSpPEKTTVUFe8jmvX5OcMYMDbzgwh3nEYbDB5oM/yNrQ8YRJIG', 
           'admin', 
           'Информационно-аналитический отдел', 
           'Заместитель директора по экспертной работе', 
           'Администратор'
       )
       RETURNING id INTO new_user_id;

       -- Вставка информации о контактах администратора
       INSERT INTO "ContactInfo" ("userId", "email")
       VALUES (new_user_id, 'admin@mail.ru');
   END IF;
END $$;
