import { useAuth } from "../../context/AuthContext"

import "../../assets/styles/style-pages/personal-account-page.scss";

function PersonalAccountPage() {
    const { user, personalAccountData } = useAuth();

    const userData = user.role === 'admin' ? personalAccountData : user;

    if (userData) {
        return (
            <div>
                <h2 className='personal__content-title'>Личный кабинет</h2>

                <form className="personal__form">
                    <div className="personal__form-fio">{`${userData.middleName} ${userData.firstName} ${userData.lastName}`}</div>
                    <div className="personal__form-divider"></div>
                    <div className="personal__form-section">
                        <div className="personal__form-section-title">Основная информация</div>
                        <div className="personal__form-section-items">
                            <div className="personal__form-TContainer">
                                <div className="personal__form-label">Должность:</div>
                                <div className="personal__form-value">{userData.position}</div>
                            </div>
                            <div className="personal__form-TContainer">
                                <div className="personal__form-label">Отдел:</div>
                                <div className="personal__form-value">{userData.department}</div>
                            </div>
                            <div className="personal__form-TContainer">
                                <div className="personal__form-label">Руководитель:</div>
                                <div className="personal__form-value">{userData.manager}</div>
                            </div>
                            <div className="personal__form-TContainer">
                                <div className="personal__form-label">Пол:</div>
                                <div className="personal__form-value">{userData.gender}</div>
                            </div>
                            <div className="personal__form-TContainer">
                                <div className="personal__form-label">Дата рождения:</div>
                                <div className="personal__form-value">{userData.birthDate}</div>
                            </div>
                        </div>
                    </div>
                    <div className="personal__form-divider"></div>
                    <div className="personal__form-section">
                        <div className="personal__form-section-title">Контакты</div>
                        <div className="personal__form-section-items">
                            <div className="personal__form-TContainer">
                                <div className="personal__form-label">Телефон:</div>
                                <div className="personal__form-value">{userData.phone}</div>
                            </div>
                            <div className="personal__form-TContainer">
                                <div className="personal__form-label">Email:</div>
                                <div className="personal__form-value">{userData.email}</div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default PersonalAccountPage;
