import { useEffect } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import { useDocument } from '../context/DocumentContext';
import { Loader } from "../components/Loader";

function DocumentDetailsPage() {
    const { getDocument, document, loading } = useDocument();
    const { jwt } = useAuth();
    const { id } = useParams();

    useEffect(() => {
        getDocument(id, jwt);
    }, [id]);

    if (loading) {
        return <Loader />
    }

    if (!document && !loading) {
        return <p>Ничего не найдено</p>;
    }

    return (
        <div className="container">
            <h1>Детали документа</h1>
            <div>
                <p><strong>Название:</strong> {document.name}</p>
                <p><strong>Автор:</strong> {document.author.middleName} {document.author.firstName} {document.author.lastName}</p>
                <p><strong>Тип:</strong> {document.type}</p>
                <p><strong>Размер:</strong> {document.size} bytes</p>
                <p><strong>Статус:</strong> {document.status}</p>
                <p><strong>Описание:</strong> {document.description}</p>
            </div>

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
