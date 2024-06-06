import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import Logo from "../../public/logo.svg?react";
import UnionIcon from "../assets/images/icon-union.svg?react";
import "../assets/styles/style-components/Header.scss";

export const Header = () => {
  const { jwt, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Применение стилей к body при изменении isMenuOpen
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    // Очистка эффекта
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      toast.success("Вы вышли из системы.");
      logout(); // Обновляем статус авторизации
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
      toast.error("Произошла ошибка при выходе из системы.");
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <Link to="/" className="logo">
            <div className="logo__icon">
              <Logo />
            </div>
            <div className="logo__title">
              <span className="logo__title-color">Doc</span>Archive
            </div>
          </Link>
          <nav>
            <ul className="header__nav">
              <div className="header__nav-items">
                <li>
                  <Link to="/" className="header__nav-item">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link to="/archive" className="header__nav-item">
                    Архив
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="header__nav-item">
                    О компании
                  </Link>
                </li>
                <li>
                  <Link to="/contacts" className="header__nav-item">
                    Контакты
                  </Link>
                </li>
              </div>
              {jwt && user ? (
                <li className="header__nav-user">
                  {user.photo ? (
                    <img src={user.photo} alt="User Photo" className="header__nav-user-photo" />
                  ) : (
                      <UnionIcon className="header__nav-user-avatar" />
                  )}
                  <span className="header__nav-item-text">{user.displayName}</span>
                  <div className="dropdown-menu">
                    <ul className="dropdown-menu__inner">
                      {user.role === "admin" && (
                        <Link to="/admin/statistics" className="dropdown-menu__item">
                          Панель администратора
                        </Link>
                      )}
                      <Link to="/user/personalAccount" className="dropdown-menu__item">
                        Личный кабинет
                      </Link>
                      <Link to="/user/documents" className="dropdown-menu__item">
                        Мои документы
                      </Link>
                      <Link to="/user/settings" className="dropdown-menu__item">
                        Настройки
                      </Link>
                      <li
                        className="dropdown-menu__item dropdown-menu__item--logout"
                        onClick={handleLogout}
                      >
                        Выйти
                      </li>
                    </ul>
                  </div>
                </li>
              ) : (
                <Link to="/login" className="header__nav-button">
                  <button className="main-button">
                    Войти
                  </button>
                </Link>
              )}
            </ul>
            <div className="header__mobile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                // Крестик для закрытого состояния
                <div className="header__mobile-close">
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              ) : (
                // Три полоски для открытого состояния
                <div className="header__mobile-burger">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              )}
              {isMenuOpen && (
                <ul className="header__mobile-menu">
                  {jwt && user ? (
                    <div className="header__mobile-inner">
                      <li className="header__mobile-item header__mobile-item--name">
                        {user.displayName}
                      </li>
                      <hr className="header__mobile-divider" />
                      {user.role === "admin" && (
                        <li className="header__mobile-item">
                          <Link to="/admin">Панель администратора</Link>
                        </li>
                      )}
                      <li className="header__mobile-item">
                        <Link to="/events/create">Создать</Link>
                      </li>
                      <li className="header__mobile-item">
                        <Link to="/events/all">Мероприятия</Link>
                      </li>
                      <li className="header__mobile-item" onClick={handleLogout}>
                        Выйти
                      </li>
                    </div>
                  ) : (
                    <li className="header__mobile-item">
                      <Link to="/login">Войти</Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header >
  );
};
