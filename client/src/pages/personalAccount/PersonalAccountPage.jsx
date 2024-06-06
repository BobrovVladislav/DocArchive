import { useAuth } from "../../context/AuthContext"

import "../../assets/styles/style-pages/personal-account-page.scss";

function PersonalAccountPage() {
    const { user } = useAuth();
    return (
        <div>
            <h2 className='personal__content-title'>Личный кабинет</h2>

            <form className="personal__form">
                <div className="personal__form-fio">{`${user.middleName} ${user.firstName} ${user.lastName}`}</div>
                <div className="personal__form-divider"></div>
                <div className="personal__form-section">
                    <div className="personal__form-section-title">Основная информация</div>
                    <div className="personal__form-section-items">
                        <div className="personal__form-TContainer">
                            <div className="personal__form-label">Должность:</div>
                            <div className="personal__form-value">{user.position}</div>
                        </div>
                        <div className="personal__form-TContainer">
                            <div className="personal__form-label">Отдел:</div>
                            <div className="personal__form-value">{user.department}</div>
                        </div>
                        <div className="personal__form-TContainer">
                            <div className="personal__form-label">Руководитель:</div>
                            <div className="personal__form-value">{user.manager}</div>
                        </div>
                        <div className="personal__form-TContainer">
                            <div className="personal__form-label">Пол:</div>
                            <div className="personal__form-value">{user.gender}</div>
                        </div>
                        <div className="personal__form-TContainer">
                            <div className="personal__form-label">Дата рождения:</div>
                            <div className="personal__form-value">{user.birthDate}</div>
                        </div>
                    </div>
                </div>
                <div className="personal__form-divider"></div>
                <div className="personal__form-section">
                    <div className="personal__form-section-title">Контакты</div>
                    <div className="personal__form-section-items">
                        <div className="personal__form-TContainer">
                            <div className="personal__form-label">Телефон:</div>
                            <div className="personal__form-value">{user.phone}</div>
                        </div>
                        <div className="personal__form-TContainer">
                            <div className="personal__form-label">Email:</div>
                            <div className="personal__form-value">{user.email}</div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PersonalAccountPage;
