import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../../context/AuthContext";

import "../../assets/styles/style-pages/register-user-page.scss";

function RegisterUserPage() {
    const { jwt } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        photo: '',
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        birthDate: '',
        department: '',
        manager: '',
        position: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            toast.success(data.message);
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            toast.error(error.message || "Произошла ошибка при регистрации");
        }
    };

    return (
        <div>
            <h2 className='admin__content-title'>Регистрация пользователя</h2>

            <form className="register__form" onSubmit={handleSignUp}>
                <div className="register__form-section">
                    <div className="register__form-section-title">Идентификация</div>
                    <div className="register__form-identification">
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='email'>Email*</label>
                            <input className="register__form-input" type="email" id="email" name='email' value={formData.email} onChange={handleChange} placeholder='mail@domain.ru' required />
                        </div>
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='password'>Пароль*</label>
                            <input className="register__form-input" type="password" id="password" name='password' value={formData.password} onChange={handleChange} placeholder='8+ символов' required />
                        </div>
                    </div>
                </div>
                <div className="register__form-section">
                    <div className="register__form-section-title">Личная информация</div>
                    <div className="register__form-personal-info">
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='middleName'>Фамилия*</label>
                            <input className="register__form-input" type="text" id="middleName" name='middleName' value={formData.middleName} onChange={handleChange} placeholder='Иванов' required />
                        </div>
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='firstName'>Имя*</label>
                            <input className="register__form-input" type="text" id="firstName" name='firstName' value={formData.firstName} onChange={handleChange} placeholder='Иван' required />
                        </div>
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='lastName'>Отчество</label>
                            <input className="register__form-input" type="text" id="lastName" name='lastName' value={formData.lastName} onChange={handleChange} placeholder='Иванович' />
                        </div>
                        <div className="register__form-gender">
                            <div className="register__form-gender-title">Пол:</div>
                            <div className="register__form-gender-values">
                                <div className="register__form-gender-checkbox">
                                    <input type="radio" id="genderMale" name="gender" value="Мужской" onChange={handleChange} />
                                    <label htmlFor="male">Мужской</label>
                                </div>
                                <div className="register__form-gender-checkbox">
                                    <input type="radio" id="genderFemale" name="gender" value="Женский" onChange={handleChange} />
                                    <label htmlFor="female">Женский</label>
                                </div>
                            </div>
                        </div>
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='birthDate'>Дата рождения</label>
                            <input className="register__form-input" type="date" id="birthDate" name='birthDate' value={formData.birthDate} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="register__form-section">
                    <div className="register__form-section-title">Служебная информация</div>
                    <div className="register__form-official-information">
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='department'>Отдел*</label>
                            <select className="register__form-input register__form-select" id="department" name='department' value={formData.department} onChange={handleChange} required>
                                <option value="" disabled>Выберите отдел</option>
                                <option value="Отдел по организации работы с документами и обращениями граждан">Отдел по организации работы с документами и обращениями граждан</option>
                                <option value="Информационно-аналитический отдел">Информационно-аналитический отдел</option>
                                <option value="Организационно-методический отдел">Организационно-методический отдел</option>
                                <option value="Отдел реабилитационно-экспертной диагностики">Отдел реабилитационно-экспертной диагностики</option>
                                <option value="Экспертные составы">Экспертные составы</option>
                                <option value="Отдел кадров">Отдел кадров</option>
                                <option value="Юридический отдел">Юридический отдел</option>
                                <option value="Отдел по снабжению и закупкам">Отдел по снабжению и закупкам</option>
                                <option value="Отдел по общим вопросам">Отдел по общим вопросам</option>
                                <option value="Планово-финансовый отдел">Планово-финансовый отдел</option>
                            </select>
                        </div>
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='manager'>Руководитель*</label>
                            <input className="register__form-input" type="text" id="manager" name='manager' value={formData.manager} onChange={handleChange} placeholder='Иванов И.И.' required />
                        </div>
                        <div className="register__form-Icontainer">
                            <label className="register__form-label" htmlFor='position'>Должность*</label>
                            <input className="register__form-input" type="text" id="position" name='position' value={formData.position} onChange={handleChange} placeholder='Должность' required />
                        </div>
                    </div>
                </div>
                <div className="register__form-buttons">
                    <Link to="/admin/users" className="secondary-button">Отмена</Link>
                    <button className="main-button" type='submit'>Зарегистрировать</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterUserPage;
