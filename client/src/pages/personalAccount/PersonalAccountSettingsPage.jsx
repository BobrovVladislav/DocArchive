import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from "../../context/AuthContext";

import "../../assets/styles/style-pages/personal-account-settings-page.scss";

function PersonalAccountSettingsPage() {
    const { user, personalAccountData, jwt } = useAuth();

    const userData = user.role === 'admin' ? personalAccountData : user;

    const [formData, setFormData] = useState({
        firstName: userData.firstName || '', // Добавляем данные пользователя в форму
        lastName: userData.lastName || '',
        middleName: userData.middleName || '',
        gender: userData.gender || '',
        birthDate: userData.birthDate !== 'Не указано' ? new Date(userData.birthDate).toISOString().substring(0, 10) : 'Не указан', // Форматируем дату в YYYY-MM-DD
        department: userData.department || '',
        manager: userData.manager || '',
        position: userData.position || ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Обработка для даты
        if (type === 'date') {
            const dateValue = new Date(value).toISOString().substring(0, 10);
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: dateValue
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userData.id}`, {
                method: 'PATCH',
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
            <h2 className='settings-title'>Настройки пользователя</h2>

            <form className="settings__form" onSubmit={handleUpdate}>
                <div className="settings__form-section">
                    <div className="settings__form-section-title">Личная информация</div>
                    <div className="settings__form-personal-info">
                        <div className='settings__form-personal-info-row'>
                            <div className="settings__form-Icontainer">
                                <label className="settings__form-label" htmlFor='middleName'>Фамилия*</label>
                                <input className="settings__form-input" type="text" id="middleName" name='middleName' value={formData.middleName} onChange={handleChange} placeholder='Иванов' required />
                            </div>
                            <div className="settings__form-Icontainer">
                                <label className="settings__form-label" htmlFor='firstName'>Имя*</label>
                                <input className="settings__form-input" type="text" id="firstName" name='firstName' value={formData.firstName} onChange={handleChange} placeholder='Иван' required />
                            </div>
                            <div className="settings__form-Icontainer">
                                <label className="settings__form-label" htmlFor='lastName'>Отчество</label>
                                <input className="settings__form-input" type="text" id="lastName" name='lastName' value={formData.lastName} onChange={handleChange} placeholder='Иванович' />
                            </div>
                        </div>
                        <div className='settings__form-personal-info-row'>
                            <div className="settings__form-Icontainer">
                                <label className="settings__form-label" htmlFor='birthDate'>Дата рождения</label>
                                <input className="settings__form-input" type="date" id="birthDate" name='birthDate' value={formData.birthDate} onChange={handleChange} />
                            </div>
                            <div className="settings__form-gender">
                                <div className="settings__form-gender-title">Пол:</div>
                                <div className="settings__form-gender-values">
                                    <div className="settings__form-gender-checkbox">
                                        <input
                                            type="radio"
                                            id="genderMale"
                                            name="gender"
                                            value="Мужской"
                                            checked={formData.gender === "Мужской"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="genderMale">Мужской</label>
                                    </div>
                                    <div className="settings__form-gender-checkbox">
                                        <input
                                            type="radio"
                                            id="genderFemale"
                                            name="gender"
                                            value="Женский"
                                            checked={formData.gender === "Женский"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="genderFemale">Женский</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="settings__form-section">
                    <div className="settings__form-section-title">Служебная информация</div>
                    <div className="settings__form-official-information">
                        <div className="settings__form-Icontainer">
                            <label className="settings__form-label" htmlFor='department'>Отдел*</label>
                            <select className="settings__form-input settings__form-select" id="department" name='department' value={formData.department} onChange={handleChange} required>
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
                        <div className="settings__form-Icontainer">
                            <label className="settings__form-label" htmlFor='manager'>Руководитель*</label>
                            <input className="settings__form-input" type="text" id="manager" name='manager' value={formData.manager} onChange={handleChange} placeholder='Иванов И.И.' required />
                        </div>
                        <div className="settings__form-Icontainer">
                            <label className="settings__form-label" htmlFor='position'>Должность*</label>
                            <input className="settings__form-input" type="text" id="position" name='position' value={formData.position} onChange={handleChange} placeholder='Должность' required />
                        </div>
                    </div>
                </div>
                <div className="settings__form-buttons">
                    <button className="main-button" type='submit'>Обновить данные</button>
                </div>
            </form>
        </div>
    );
}

export default PersonalAccountSettingsPage;
