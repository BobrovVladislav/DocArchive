import { useState } from 'react';
import { toast } from 'react-toastify';

import "../../assets/styles/style-pages/register-user-page.scss";

function RegisterUserPage() {
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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
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
                    <div className="register__form-Icontainer">
                        <label className="register__form-label" htmlFor='email'>Email*</label>
                        <input className="register__form-input" type="email" id="email" name='email' value={formData.email} onChange={handleChange} placeholder='123@gmail.com' required />
                    </div>
                    <div className="register__form-Icontainer">
                        <label className="register__form-label" htmlFor='password'>Пароль*</label>
                        <input className="register__form-input" type="text" id="password" name='password' value={formData.password} onChange={handleChange} placeholder='8+ символов' required />
                    </div>
                </div>
                <div className="register__form-section">
                    <div className="register__form-section-title">Личная информация</div>
                    <div className="photo"></div>
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
                                <div>
                                    <input type="radio" id="genderMale" name="gender" value="Мужской" onChange={handleChange} />
                                    <label htmlFor="genderMale">Мужской</label>
                                </div>
                                <div>
                                    <input type="radio" id="genderFemale" name="gender" value="Женский" onChange={handleChange} />
                                    <label htmlFor="genderFemale">Женский</label>
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
                    <div className="register__form-Icontainer">
                        <label className="register__form-label" htmlFor='department'>Отдел*</label>
                        <select className="register__form-input" id="department" name='department' value={formData.department} onChange={handleChange} required>
                            <option value="" disabled>Выберите отдел</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Финансы</option>
                            {/* Добавьте другие отделы по мере необходимости */}
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
                <div className="register__form-buttons">
                    <button className="secondary-button">Отмена</button>
                    <button className="main-button" type='submit'>Зарегистрировать</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterUserPage;
