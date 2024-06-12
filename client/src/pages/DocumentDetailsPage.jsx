import { useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useDocument } from '../context/DocumentContext';
import { Loader } from "../components/Loader";

function DocumentDetailsPage() {
    const { getDocument, document, loading } = useDocument();
    const { jwt } = useAuth();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        status: '',
        tags: [],
    });
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        getDocument(id, jwt);
    }, [id]);

    useEffect(() => {
        if (document) {
            setFormData({
                name: document.name,
                type: document.type,
                description: document.description || '',
                status: document.status || '',
                tags: document.tags || [],
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
                console.log('Документ успешно обновлен');
            } else {
                console.error('Ошибка при обновлении документа');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    if (loading) {
        return <Loader />
    }

    if (!document && !loading) {
        return <p>Ничего не найдено</p>;
    }

    return (
        <div className="container">
            <h1>Детали документа</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Тип:</label>
                    <input type="text" name="type" value={formData.type} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Описание:</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Статус:</label>
                    <input type="text" name="status" value={formData.status} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Теги:</label>
                    {formData.tags.length > 0 ? (
                        <ul>
                            {formData.tags.map(tag => (
                                <li key={tag}>
                                    {tag} <button type="button" onClick={() => handleRemoveTag(tag)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Тегов нет</p>
                    )}
                    <div>
                        <input
                            type="text"
                            name="tag"
                            placeholder="Добавить тег"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                        />
                        <button type="button" onClick={handleAddTag}>Добавить</button>
                    </div>
                </div>
                <button type="submit">Обновить документ</button>
            </form>

            <div className="document__content">
                <div className="container">
                    <div className="document__inner">
                        <div className="document__tabs">
                            <div className={`document__tab ${location.pathname === `/archive/${document.id}/view` ? 'document__tab--active' : ''}`}>
                                <Link to={`/archive/${document.id}/view`} className="document__tab-text">ПРОСМОТР</Link>
                            </div>
                            <div className={`document__tab ${location.pathname === `/archive/${document.id}/history` ? 'document__tab--active' : ''}`}>
                                <Link to={`/archive/${document.id}/history`} className="document__tab-text">ИСТОРИЯ ИЗМЕНЕНИЙ</Link>
                            </div>
                            <div className={`document__tab ${location.pathname === `/archive/${document.id}/discussion` ? 'document__tab--active' : ''}`}>
                                <Link to={`/archive/${document.id}/discussion`} className="document__tab-text">ОБСУЖДЕНИЕ ({document.messages.length})</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default DocumentDetailsPage;
