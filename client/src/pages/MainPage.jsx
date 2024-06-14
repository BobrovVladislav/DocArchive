import { Link } from 'react-router-dom'

import IconOpportunities1 from "../assets/images/opportunities/1.svg?react";
import IconOpportunities2 from "../assets/images/opportunities/2.svg?react";
import IconOpportunities3 from "../assets/images/opportunities/3.svg?react";
import IconOpportunities4 from "../assets/images/opportunities/4.svg?react";
import IconOpportunities5 from "../assets/images/opportunities/5.svg?react";
import IconOpportunities6 from "../assets/images/opportunities/6.svg?react";
import IconOpportunities7 from "../assets/images/opportunities/7.svg?react";
import IconOpportunities8 from "../assets/images/opportunities/8.svg?react";

import "../assets/styles/style-pages/main-page.scss";

function MainPage() {
  return (
    <>
      <section className="welcome">
        <div className="container">
          <div className="welcome__inner">
            <div className="welcome__info">
              <h2 className="welcome__info-title">ЕДИНАЯ СИСТЕМА УПРАВЛЕНИЯ ЭЛЕКТРОННЫМИ ДОКУМЕНТАМИ И ДАННЫМИ</h2>
              <p className="welcome__info-text">Комплексные решения на базе DocArchive обеспечивают управление всеми документами и данными организации. Система предоставляет сервисы хранения, поиска, оперативного доступа к документам.</p>
              <Link to="/about" className="main-button main-button--2">Связатьcя с нами</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="opportunities">
        <div className="container">
          <h2>Возможности DocArchive</h2>
          <div className="opportunities__list">
            <div className="opportunities__list-item">
              <IconOpportunities1 className="opportunities__list-item-img" />
              <div className="opportunities__list-item-name">Управление документами</div>
            </div>
            <div className="opportunities__list-item">
              <IconOpportunities2 className="opportunities__list-item-img" />
              <div className="opportunities__list-item-name">Предпросмотр документов</div>
            </div>
            <div className="opportunities__list-item">
              <IconOpportunities3 className="opportunities__list-item-img" />
              <div className="opportunities__list-item-name">Версионность</div>
            </div>
            <div className="opportunities__list-item">
              <IconOpportunities4 className="opportunities__list-item-img" />
              <div className="opportunities__list-item-name">Совместная работа</div>
            </div>
            <div className="opportunities__list-item">
              <IconOpportunities5 className="opportunities__list-item-img" />
              <div className="opportunities__list-item-name">Безопасное хранение</div>
            </div>
            <div className="opportunities__list-item">
              <IconOpportunities6 className="opportunities__list-item-img" />
              <div className="opportunities__list-item-name">Поиск и фильтрация</div>
            </div>
            <div className="opportunities__list-item">
              <IconOpportunities7 className="opportunities__list-item-img" />
              <div className="opportunities__list-item-name">Поиск и фильтрация</div>
            </div>
            <div className="opportunities__list-item">
              <IconOpportunities8 className="opportunities__list-item-img" />
              <div className="opportunities__list-item-name">Резервное копирование</div>
            </div>
          </div>
        </div>
      </section>
      <section className="about">
        <div className="container">
          <h2>О веб-сервисе DocArchive</h2>
          <div className="about__inner">
            <div className="about__text">
              <p className="about__text-paragraph">DocArchive - это инновационный веб-сервис для управления документацией, разработанный с учетом потребностей экспертных организаций. Наш сервис позволяет вам легко организовать все ваши документы.</p>
              <p className="about__text-paragraph">DocArchive создан для того, чтобы помочь организациям справляться с растущим объемом документации, обеспечивая безопасность данных и простоту использования. Мы стремимся сделать вашу работу с документами максимально удобной и эффективной.</p>
            </div>
            <img className="about__image" src="/images/main-about.png" alt="image-about" />
          </div>
        </div>
      </section>
      <section className="advantages">
        <div className="container">
          <div className="advantages__inner">
            <h2>Преимущества сервиса</h2>
            <div className="advantages__list">
              <div className="advantages__list-item">
                <div className="advantages__list-item-img">
                  <img src="/images/advantages/advantages1.png" alt="advantages1" />
                </div>
                <div className="advantages__list-item-info">
                  <h4 className="advantages__list-item-info-title">Совместная работа</h4>
                  <p className="advantages__list-item-info-subtitle">Позволяет вашей команде работать над документами совместно, обеспечивая прозрачность и контроль на всех этапах работы с документами.</p>
                </div>
              </div>
              <div className="advantages__list-item">
                <div className="advantages__list-item-img">
                  <img src="/images/advantages/advantages2.png" alt="advantages2" />
                </div>
                <div className="advantages__list-item-info">
                  <h4 className="advantages__list-item-info-title">Простота использования</h4>
                  <p className="advantages__list-item-info-subtitle">Интуитивно понятный интерфейс, который легко освоить. Вам не потребуется долгое обучение или специальные навыки для работы с системой.</p>
                </div>
              </div>
              <div className="advantages__list-item">
                <div className="advantages__list-item-img">
                  <img src="/images/advantages/advantages3.png" alt="advantages3" />
                </div>
                <div className="advantages__list-item-info">
                  <h4 className="advantages__list-item-info-title">Мобильный доступ</h4>
                  <p className="advantages__list-item-info-subtitle">Доступ к документам и задачам с любых устройств в любое время. Работайте эффективно вне зависимости от вашего местоположения.</p>
                </div>
              </div>
            </div>
            <Link to="/about" className="main-button main-button--2">Связать с нами</Link>
          </div>
        </div>
      </section>
      <section className="banner">
        <div className="container">
          <div className="banner__inner">
            <h1 className="banner__title">ПОЧЕМУ ВЫБИРАЮТ НАС?</h1>
            <div className="banner__list">
              <div className="banner__list-item">
                <div className="banner__list-item-number">20+</div>
                <div className="banner__list-item-title">Видов экспертиз</div>
              </div>
              <div className="banner__list-item">
                <div className="banner__list-item-number">150</div>
                <div className="banner__list-item-title">Обратившихся клиентов</div>
              </div>
              <div className="banner__list-item">
                <div className="banner__list-item-number">2500+</div>
                <div className="banner__list-item-title">Проведённых экспертиз</div>
              </div>
              <div className="banner__list-item">
                <div className="banner__list-item-number">23</div>
                <div className="banner__list-item-title">Года работы</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MainPage;
