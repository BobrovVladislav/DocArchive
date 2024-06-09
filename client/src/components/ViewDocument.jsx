import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ViewDocument() {
    const { id } = useParams();
    const [document, setDocument] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${id}`);
                const data = await response.json();
                setDocument(data);
            } catch (error) {
                console.error('Ошибка при получении документа:', error);
            }
        };

        fetchDocument();
    }, [id]);

    if (!document) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="document-view">
            <h1>{document.name}</h1>
            <h1>{document.url}</h1>
        </div>
    );
}

export default ViewDocument;
