import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";


function ArchivePage() {
    const [documents, setDocuments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/all`);
                const data = await response.json();
                setDocuments(data);
            } catch (error) {
                console.error('Ошибка при получении документов:', error);
            }
        };

        fetchDocuments();
    }, []);

    const handleView = (id) => {
        navigate(`/archive/${id}/view`);
    };

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = true;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setDocuments(documents.filter(doc => doc.id !== id));
            } else {
                console.error('Ошибка при удалении документа');
            }
        } catch (error) {
            console.error('Ошибка при удалении документа:', error);
        }
    };

    const handleSelect = (id) => {
        setSelectedDocuments(prev =>
            prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedDocuments.length === documents.length) {
            setSelectedDocuments([]);
        } else {
            setSelectedDocuments(documents.map(doc => doc.id));
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterStatus = (event) => {
        setFilterStatus(event.target.value);
    };


    const fileTypeMap = {
        'application/pdf': 'PDF',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
        'application/msword': 'DOC',
        'image/jpeg': 'JPEG',
        'image/png': 'PNG'
        // Добавьте другие типы файлов при необходимости
    };

    const formatFileType = (mimeType) => {
        return fileTypeMap[mimeType] || mimeType;
    };

    const formatFileSize = (size) => {
        if (size >= 1048576) {
            return (size / 1048576).toFixed(2) + ' MB';
        } else if (size >= 1024) {
            return (size / 1024).toFixed(2) + ' KB';
        } else {
            return size + ' bytes';
        }
    };

    const filteredDocuments = documents.filter(doc => {
        return (
            (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.author.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.author.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterStatus ? doc.status === filterStatus : true)
        );
    });

    return (
        <div className="container">
            <h1>Список документов</h1>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={filterStatus} onChange={handleFilterStatus}>
                    <option value="">Все</option>
                    <option value="новое">Новые</option>
                    <option value="processing">Исправления</option>
                    <option value="completed">Завершен</option>
                </select>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedDocuments.length === documents.length}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th>Тип файла</th>
                        <th>Название</th>
                        <th>Автор</th>
                        <th>Дата обновления</th>
                        <th>Размер</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDocuments.map(doc => (
                        <tr key={doc.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedDocuments.includes(doc.id)}
                                    onChange={() => handleSelect(doc.id)}
                                />
                            </td>
                            <td>{formatFileType(doc.type)}</td>
                            <td>{doc.name}</td>
                            <td>{doc.author.middleName} {doc.author.firstName[0]}. {doc.author.lastName[0]}.</td>
                            <td>{new Date(doc.updatedAt).toLocaleDateString()}</td>
                            <td>{formatFileSize(doc.size)}</td>
                            <td>{doc.status}</td>
                            <td>
                                <button onClick={() => handleView(doc.id)}>Просмотр</button>
                                <button onClick={() => handleDownload(doc.url)}>Скачать</button>
                                <button onClick={() => handleDelete(doc.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
                .controls {
                    margin-bottom: 20px;
                }
                .controls input,
                .controls select {
                    margin-right: 10px;
                    padding: 5px;
                }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .table th, .table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                .table th {
                    padding-top: 12px;
                    padding-bottom: 12px;
                    text-align: left;
                    background-color: #f2f2f2;
                }
                .table button {
                    margin-right: 5px;
                }
            `}</style>
        </div>
    );
}

export default ArchivePage;
