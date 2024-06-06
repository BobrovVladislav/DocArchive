import { Link } from 'react-router-dom'

import Logo from "../../public/logo.svg?react";
import "../assets/styles/style-components/Footer.scss";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__inner-top">
            <div className="footer__main">
              <Link to="/" className="logo">
                <div className="logo__icon">
                  <Logo />
                </div>
                <div className="logo__title">
                  <span className="logo__title-color">Doc</span>Archive
                </div>
              </Link>
              <div>
                <p className="footer__main-number">(473) 290-31-46</p>
                <p className="footer__main-number">(473) 202-58-32</p>
              </div>
              <p className="footer__main-address">
                г. Воронеж, Ленинский район, ул. Пирогова, д. 69
              </p>
              <div className="footer__main-email">
                VCE_VRN@mail.ru
              </div>
            </div>
            <div className="footer__categories">
              <div className="footer__title">Навигация по сайту</div>
              <Link to="/#type-events" className="footer__link">ГЛАВНАЯ</Link>
              <Link to="/#desc-functions" className="footer__link">О КОМПАНИИ</Link>
              <Link to="/#desc-functions" className="footer__link">КОНТАКТЫ</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__inner-bottom">
            <p>DocArchive © 2024. Все права защищены</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
