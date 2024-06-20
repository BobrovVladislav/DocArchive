
import IconMail from "../assets/images/contacts/icon-mail.svg?react";
import IconPhone from "../assets/images/contacts/icon-phone.svg?react";
import IconAdress from "../assets/images/contacts/icon-adress.svg?react";

import "../assets/styles/style-pages/contacts-page.scss";

function ContactsPage() {
    return (
        <>
            <div className="contacts">
                <div className="contacts__map">
                    <a href="https://yandex.ru/maps/?um=constructor%3Aa536a1ee8dc2c13ab25a324d4569047658a0afad21109adf88aa072b50872bfa" target="_blank" rel="noopener noreferrer">
                        <img
                            src="/images/map.png"
                            alt="Карта"
                            width="100%"
                            height="500"
                        />
                    </a>
                </div>
                <div className="container">
                    <div className="contacts__list">
                        <div className="contacts__list-item">
                            <IconMail className="contacts__list-item-img" />
                            <div className="contacts__list-item-title">Email</div>
                            <div className="contacts__list-item-value">VCE_VRN@mail.ru</div>
                        </div>
                        <div className="contacts__list-item">
                            <IconPhone className="contacts__list-item-img" />
                            <div className="contacts__list-item-title">Телефон</div>
                            <div className="contacts__list-item-value">(473) 290-31-46</div>
                            <div className="contacts__list-item-value">(473) 202-58-32</div>
                        </div>
                        <div className="contacts__list-item">
                            <IconAdress className="contacts__list-item-img" />
                            <div className="contacts__list-item-title">Адрес</div>
                            <div className="contacts__list-item-value">г. Воронеж, ул. Пирогова, д.69</div>
                            <div className="contacts__list-item-subtitle">Пн-Пт с 9:00 до 18:00 по мск</div>
                        </div>
                    </div>
                    <div className="contacts__feedback">
                        <div className="contacts__feedback-info">
                            <h2 className="contacts__feedback-info-title">Есть вопросы?</h2>
                            <p className="contacts__feedback-info-subtitle">Заполните форму и мы свяжемся с вами
                                в течение одного рабочего дня.</p>
                            <img src="/images/contacts.png" alt="contacts" className="contacts__feedback-info-image" />
                        </div>
                        <form className="contacts__feedback-form">
                            <div className="contacts__feedback-form-Icontainer">
                                <label className="contacts__feedback-form-label" htmlFor='name'>Имя*</label>
                                <input className="contacts__feedback-form-input" type="text" id="name" name='name' placeholder='Представьтесь,  пожалуйста' required />
                            </div>
                            <div className="contacts__feedback-form-Icontainer">
                                <label className="contacts__feedback-form-label" htmlFor='email'>Почта*</label>
                                <input className="contacts__feedback-form-input" type="email" id="email" name='email' placeholder='mail@domain.ru' required />
                            </div>
                            <div className="contacts__feedback-form-Icontainer">
                                <label className="contacts__feedback-form-label" htmlFor='phone'>Телефон</label>
                                <input className="contacts__feedback-form-input" type="tel" id="phone" name='phone' placeholder='+7 (000) 000-00-00' />
                            </div>
                            <div className="contacts__feedback-form-Icontainer">
                                <label className="contacts__feedback-form-label" htmlFor='name'>Вопрос</label>
                                <textarea name="question" id="question" className="contacts__feedback-form-textarea" rows={3}></textarea>
                            </div>
                            <button className="main-button">Отправить</button>
                            <p className="contacts__feedback-form-terms">Нажимая на кнопку «Отправить», я даю согласие на обработку персональных данных и соглашаюсь c политикой конфиденциальности</p>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ContactsPage;
