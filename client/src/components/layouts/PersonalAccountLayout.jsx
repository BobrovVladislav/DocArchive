import { useEffect } from 'react';
import { Link, Outlet, useParams, useLocation } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext"
import { toast } from 'react-toastify'

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebase";

import IconAvatar from "../../assets/images/icon-avatar.svg?react";
import IconExit from "../../assets/images/icon-exit.svg?react"
import "../../assets/styles/style-components/PersonalAccountLayout.scss";

function PersonalAccountLayout() {
    const { jwt, user, logout, setUser, personalAccountData, getUserById } = useAuth();
    const { id } = useParams();
    const location = useLocation();
    const path = location.pathname;

    const handleLogout = async () => {
        try {
            toast.success("Вы вышли из системы.");
            logout(); // Обновляем статус авторизации
        } catch (error) {
            console.error("Ошибка при выходе из системы:", error);
            toast.error("Произошла ошибка при выходе из системы.");
        }
    };

    const handlePhotoClick = () => {
        document.getElementById("photoInput").click(); // Имитируем клик по скрытому input
    };

    const handlePhotoChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(storage, `users/${id}/profile.jpg`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error("Ошибка при загрузке изображения:", error);
                    toast.error("Произошла ошибка при загрузке изображения.");
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        updateUserPhoto(downloadURL);
                    });
                }
            );
        }
    };

    const updateUserPhoto = async (photoURL) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${id}/update-photo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ photo: photoURL }),
            });
            const result = await response.json();
            if (response.ok) {
                if (user.role !== "admin") {
                    setUser(prevUser => ({
                        ...prevUser,
                        photo: result.user.photo,
                    }));
                } else {
                    getUserById(id)
                }
                toast.success("Фото успешно обновлено.");
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Ошибка при обновлении фото в базе данных:", error);
            toast.error("Произошла ошибка при обновлении фото.");
        }
    };

    useEffect(() => {
        // Если текущий пользователь администратор, загружаем данные другого пользователя
        if (user.role === 'admin' && id !== user.id) {
            getUserById(id);
        }
    }, [id]);

    if (user.id !== parseInt(id) && user.role !== 'admin') {
        return (
            <h1>У вас нет доступа к этой странице</h1>
        )
    }

    const userData = user.role === 'admin' ? personalAccountData : user;

    if (userData) {
        return (
            <div className='personal__container'>
                <div className="container">
                    <h1>Мой профиль </h1>
                    <div className="personal__inner">
                        <div className="personal__nav">
                            <div className="personal__nav-user">
                                <div className="personal__nav-user-containerImg" onClick={handlePhotoClick} >
                                    {userData.photo ? (
                                        <img src={userData.photo} alt="User Photo" className="personal__nav-user-photo" />
                                    ) : (
                                        <IconAvatar className="personal__nav-user-avatar" />
                                    )}
                                    <input
                                        type="file"
                                        id="photoInput"
                                        style={{ display: 'none' }}
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                                <div className="personal__nav-user-name">
                                    {userData.middleName + ` ` + userData.firstName}
                                </div>
                            </div>
                            <ul className="personal__nav-items">
                                <li>
                                    <Link to={`/user/${id}/personalAccount`} className={`personal__nav-item ${path.includes('personalAccount') ? 'active' : ''
                                        }`}
                                    >
                                        <div className="personal__nav-item-text">Личный кабинет</div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/user/${id}/documents`} className={`personal__nav-item ${path.includes('documents') ? 'active' : ''
                                        }`}
                                    >
                                        <div className="personal__nav-item-text">Мои документы</div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/user/${id}/settings`} className={`personal__nav-item ${path.includes('settings') ? 'active' : ''
                                        }`}
                                    >
                                        <div className="personal__nav-item-text">Настройки</div>
                                    </Link>
                                </li>
                                {id == user.id && (
                                    <li className="personal__nav-item personal__nav-item--exit" onClick={handleLogout}>
                                        <div className="personal__nav-item-text">Выйти</div>
                                        <IconExit className="personal__nav-item-icon" />
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="personal__content">
                            <Outlet />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default PersonalAccountLayout;
