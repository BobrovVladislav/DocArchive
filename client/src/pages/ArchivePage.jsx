import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom'

import IconFileDownload from "../assets/images/users/download.svg?react";
import IconEye from "../assets/images/icon-eye.svg?react";
import IconFileDelete from "../assets/images/users/basket.svg?react";
import IconDots from "../assets/images/dots.svg?react";
import IconSearch from "../assets/images/icon-search.svg?react";
import IconUpload from "../assets/images/icon-upload.svg?react";
import "../assets/styles/style-pages/archive-page.scss";

function ArchivePage() {
    const { jwt } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTags, setSearchTags] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/all`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
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

    const handleDownload = (url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        link.setAttribute('download', '');
        link.setAttribute('target', '_blank');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
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

    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTagSearch = (event) => {
        const tags = event.target.value.trim();
        setSearchTags(tags ? tags.split(',').map(tag => tag.trim()) : []);
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
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearchTerm = (
            doc.name.toLowerCase().includes(searchTermLower) ||
            doc.histories[0].author.firstName.toLowerCase().includes(searchTermLower) ||
            doc.histories[0].author.middleName.toLowerCase().includes(searchTermLower) ||
            doc.histories[0].author.lastName.toLowerCase().includes(searchTermLower)
        );

        const matchesTags = searchTags.length === 0 || // Если теги не выбраны, пропустить проверку
            searchTags.every(tag => doc.tags && doc.tags.includes(tag));

        return matchesSearchTerm && matchesTags && (filterStatus ? doc.histories[0].status === filterStatus : true);
    });

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

    return (
        <div className="container">
            <h1 className='archive__title'>Электронный архив</h1>
            <div className="archive">
                <div className="archive__controls">
                    <div className="archive__controls-top">
                        <div className="archive__controls-top-pagination">
                            <label>ПОКАЗАТЬ</label>
                            <input className='archive__controls-top-input'
                                type="number"
                                value={perPage}
                                onChange={handlePerPageChange}
                                min={1}
                                step={1}
                            />
                            <label>ДОКУМЕНТОВ</label>
                        </div>
                        <Link to="/archive/add-documents" className="archive__controls-btn"><IconUpload />Загрузить файл</Link>
                    </div>
                    <div className="archive__controls-bottom">
                        <div className='archive__controls-bottom-search-wrapper'>
                            <IconSearch className="archive__controls-bottom-search-icon" />
                            <input className='archive__controls-bottom-search'
                                type="text"
                                placeholder="Введите название файла"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <input
                            type="text"
                            className='archive__controls-bottom-tags'
                            placeholder="Поиск по тегам (разделите запятыми)"
                            value={searchTags.join(',')}
                            onChange={handleTagSearch}
                        />
                        <select value={filterStatus} onChange={handleFilterStatus}>
                            <option value="" disabled>Выберите статус</option>
                            <option value="">Все</option>
                            <option value="new">Новые</option>
                            <option value="progress">В работе</option>
                            <option value="review">На рассмотрении</option>
                            <option value="correction">Исправления</option>
                            <option value="rejected">Отклоненные</option>
                            <option value="approved">Утвержденные</option>
                        </select>
                    </div>
                </div>
                <table className="archive__table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedDocuments.length === documents.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className='archive__table-type'>Тип файла</th>
                            <th className='archive__table-name'>Название</th>
                            <th className='archive__table-author'>Автор</th>
                            <th className='archive__table-date'>Дата обновления</th>
                            <th className='archive__table-size'>Размер</th>
                            <th className='archive__table-status'>Статус</th>
                            <th className='archive__table-actions'><IconDots /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.slice(0, perPage).map(doc => {
                            const latestVersion = doc.histories[0];
                            const statusClass = `status-${latestVersion.status.replace('_', '-')} status`;
                            return (
                                <tr key={doc.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedDocuments.includes(doc.id)}
                                            onChange={() => handleSelect(doc.id)}
                                        />
                                    </td>
                                    <td className='archive__table-type'>{formatFileType(doc.type)}</td>
                                    <td className='archive__table-name'>{doc.name}</td>
                                    <td className='archive__table-author'>{latestVersion.author.middleName} {latestVersion.author.firstName[0]}. {latestVersion.author.lastName[0]}.</td>
                                    <td className='archive__table-date'>{new Date(latestVersion.createdAt).toLocaleDateString()}</td>
                                    <td className='archive__table-size'>{formatFileSize(latestVersion.size)}</td>
                                    <td className='archive__table-status'> <div className={statusClass}>{getStatusLabel(latestVersion.status)}</div> </td>
                                    <td className='archive__table-actions'>
                                        <button className="func-button" onClick={() => handleView(doc.id)}><IconEye /></button>
                                        <button className="func-button" onClick={() => handleDownload(latestVersion.url, doc.name)}><IconFileDownload /></button>
                                        <button className="func-button" onClick={() => handleDelete(doc.id)}><IconFileDelete /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Информация о количестве записей */}
                <div className="archive__records">
                    Показано 1-{Math.min(perPage, documents.length)} из {documents.length} записей
                </div>
            </div>
        </div>
    );
}

export default ArchivePage;
