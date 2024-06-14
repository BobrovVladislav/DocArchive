import { useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useAuth } from "../context/AuthContext";
import { useDocument } from '../context/DocumentContext';
import { Loader } from "../components/Loader";

import IconAvatar from "../assets/images/icon-union.svg?react";
import "../assets/styles/style-pages/document-details-page.scss";

function DocumentDetailsPage() {
    const { getDocument, document, loading } = useDocument();
    const { jwt } = useAuth();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        status: '',
        description: '',
        tags: [],
        histories: {
            version: ''
        }
    });
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        getDocument(id, jwt);
    }, [id]);

    useEffect(() => {
        if (document) {
            const latestVersion = document.histories[0];
            setFormData({
                name: document.name,
                status: getStatusLabel(latestVersion.status),
                description: document.description || '',
                tags: document.tags || [],
                histories: {
                    version: document.version
                }
            });
        }
    }, [document]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddTag = (e) => {
        e.preventDefault();
        const trimmedTag = newTag.trim();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Обновляем документ после успешного обновления
                getDocument(id, jwt);
                toast.success('Документ успешно обновлен');
            } else {
                toast.error('Ошибка при обновлении документа');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'new':
                return 'Новое';
            case 'progress':
                return 'В процессе';
            case 'review':
                return 'На рассмотрении';
            case 'correction':
                return 'Исправления';
            case 'rejected':
                return 'Отклонено';
            case 'approved':
                return 'Утверждено';
            default:
                return status;
        }
    };

    const statusClass = document
        ? `status-${document.histories[0].status.replace('_', '-')} status`
        : '';

    if (loading) {
        return <Loader />
    }

    if (!document && !loading) {
        return <p>Ничего не найдено</p>;
    }

    return (
        <div className="container">
            <div className="document-details">
                <div className="document-details__side">
                    <form onSubmit={handleSubmit}>
                        <input className='document-details__side-name' type="text" name="name" value={formData.name} onChange={handleInputChange} />
                        <input className={`document-details__side-status ${statusClass}`} type="text" name="status" value={formData.status} onChange={handleInputChange} />
                        <div className="document-details__side-block">
                            <div className='document-details__side-item'>
                                <div className="document-details__side-item-label">Кем создан</div>
                                <div type='text' className="document-details__side-user">
                                    <div className="document-details__side-user-img">
                                        {document.histories[0].author.photo ? (
                                            <img src={document.histories[0].author.photo} alt="User Photo" className="document-details__side-user-img" />
                                        ) : (
                                            <IconAvatar className="document-details__side-user-img" />
                                        )}
                                    </div>
                                    <div className="document-details__side-user-info">
                                        <div className="document-details__side-user-name">
                                            {document.histories[0].author.middleName} {document.histories[0].author.firstName}
                                        </div>
                                        <div className="document-details__side-user-email">
                                            {document.histories[0].author.contactInfo.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='document-details__side-item'>
                                <div className="document-details__side-item-label">Дата создания</div>
                                <input type='text' className="document-details__side-item-value" value={new Date(document.createdAt).toLocaleDateString()} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="document-details__side-divider"></div>
                        <div className="document-details__side-block">
                            <div className="document-details__side-block-title">Основная информация</div>
                            <div className='document-details__side-item'>
                                <div className="document-details__side-item-label">UUID</div>
                                <input type='text' className="document-details__side-item-value" value={document.uuid} />
                            </div>
                            <div className='document-details__side-item'>
                                <div className="document-details__side-item-label">Версия</div>
                                <input type='text' className="document-details__side-item-value" value={document.histories[0].version} />
                            </div>
                            <div className='document-details__side-item'>
                                <div className="document-details__side-item-label">Описание</div>
                                <textarea className="document-details__side-item-value" value={formData.description} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="document-details__side-divider"></div>
                        <div className="document-details__side-block">
                            <div className="document-details__side-block-title">Метаданные</div>
                            {formData.tags.length > 0 ? (
                                <ul className='document-details__side-tags'>
                                    {formData.tags.map(tag => (
                                        <li className='document-details__side-tag' key={tag}>
                                            {tag} <button type="button" onClick={() => handleRemoveTag(tag)}>X</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Тегов нет</p>
                            )}
                            <div className='document-details__side-add-tag'>
                                <input className='document-details__side-input'
                                    type="text"
                                    name="tag"
                                    placeholder="Добавить тег"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                />
                                <button className='document-details__side-btn' type="button" onClick={handleAddTag}>Добавить</button>
                            </div>
                        </div>
                        <div className="document-details__side-update">
                            <button type="submit" className='main-button'>Обновить документ</button>
                        </div>
                    </form>
                </div>


                <div className="document-details__content">
                    <div className="document-details__content-tabs">
                        <div className={`document-details__content-tab ${location.pathname === `/archive/${document.id}/view` ? 'document-details__content-tab--active' : ''}`}>
                            <Link to={`/archive/${document.id}/view`} className="document__tab-text">ПРОСМОТР</Link>
                        </div>
                        <div className={`document-details__content-tab ${location.pathname === `/archive/${document.id}/history` ? 'document-details__content-tab--active' : ''}`}>
                            <Link to={`/archive/${document.id}/history`} className="document__tab-text">ИСТОРИЯ ИЗМЕНЕНИЙ</Link>
                        </div>
                        <div className={`document-details__content-tab ${location.pathname === `/archive/${document.id}/discussion` ? 'document-details__content-tab--active' : ''}`}>
                            <Link to={`/archive/${document.id}/discussion`} className="document__tab-text">ОБСУЖДЕНИЕ ({document.messages.length})</Link>
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>

        </div>
    );
}

export default DocumentDetailsPage;
