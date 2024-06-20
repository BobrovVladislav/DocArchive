import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import IconFileDownload from "../assets/images/users/download.svg?react";
import IconEye from "../assets/images/icon-eye.svg?react";
import IconFileDelete from "../assets/images/users/basket.svg?react";
import IconDots from "../assets/images/dots.svg?react";
// import IconSearch from "../assets/images/icon-search.svg?react";
import IconUpload from "../assets/images/icon-upload.svg?react";
import "../assets/styles/style-pages/archive-page.scss";

import IconDocx from "../assets/images/files/docx.svg?react";
import IconDoc from "../assets/images/files/doc.svg?react";
import IconPptx from "../assets/images/files/pptx.svg?react";
import IconPpt from "../assets/images/files/ppt.svg?react";
import IconXlsx from "../assets/images/files/xlsx.svg?react";
import IconXls from "../assets/images/files/xls.svg?react";
import IconPdf from "../assets/images/files/pdf.svg?react";
import IconOdt from "../assets/images/files/odt.svg?react";

const fileIcons = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": <IconDocx />,
    "application/msword": <IconDoc />,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": <IconPptx />,
    "application/vnd.ms-powerpoint": <IconPpt />,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <IconXlsx />,
    "application/vnd.ms-excel": <IconXls />,
    "application/pdf": <IconPdf />,
    "application/vnd.oasis.opendocument.text": <IconOdt />
};

function ArchivePage() {
    const { jwt, user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTags, setSearchTags] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [sizeRangeKB, setSizeRangeKB] = useState([0, 0]);
    const [searchAuthor, setSearchAuthor] = useState('');
    const [searchVersion, setSearchVersion] = useState('');
    const [allTags, setAllTags] = useState([]);
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

                // Собираем все уникальные теги
                const tags = new Set();
                data.forEach(doc => {
                    if (doc.tags) {
                        doc.tags.forEach(tag => tags.add(tag));
                    }
                });
                setAllTags([...tags]);
            } catch (error) {
                console.error('Ошибка при получении документов:', error);
            }
        };

        fetchDocuments();
    }, []);

    useEffect(() => {
        if (documents.length > 0) {
            const maxFileSizeKB = Math.ceil(Math.max(...documents.map(doc => doc.histories[0].size / 1024)) / 2) * 2;
            setSizeRangeKB([0, maxFileSizeKB]);
        } else {
            setSizeRangeKB([0, 0]);
        }
    }, [documents]);

    const handleView = (id) => {
        navigate(`/archive/${id}/view`);
    };

    const handleDownload = (url, fileName) => {
        if (user.permissions.canDownload == false) {
            toast.error('У вас нет разрешения на скачивание файлов');
            return;
        }

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id) => {
        if (user.permissions.canDelete == false) {
            toast.error('У вас нет разрешения на удаление файлов');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            if (response.ok) {
                setDocuments(documents.filter(doc => doc.id !== id));
                toast.success(`Документ удалён`);
            } else {
                console.error('Ошибка при удалении документа');
                toast.error('Ошибка при удалении документа');
            }
        } catch (error) {
            console.error('Ошибка при удалении документа:', error);
            toast.error('Ошибка при удалении документа');
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

    const handleTagToggle = (event) => {
        const tag = event.target.value;
        if (searchTags.includes(tag)) {
            setSearchTags(searchTags.filter(t => t !== tag));
        } else {
            setSearchTags([...searchTags, tag]);
        }
    };

    const handleFilterStatus = (event) => {
        setFilterStatus(event.target.value);
    };

    const handleFilterType = (event) => {
        setFilterType(event.target.value);
    };

    const handleDateRangeChange = (event, index) => {
        const newDateRange = [...dateRange];
        newDateRange[index] = event.target.value ? new Date(event.target.value) : null;
        setDateRange(newDateRange);
    };

    const handleSizeRangeChange = (values) => {
        setSizeRangeKB(values);
    };
    const handleMultipleDownload = () => {
        if (!user.permissions.canDownload) {
            toast.error('У вас нет разрешения на скачивание файлов');
            return;
        }

        let currentIndex = 0;

        const downloadInterval = setInterval(() => {
            if (currentIndex >= selectedDocuments.length) {
                clearInterval(downloadInterval);
                toast.success('Скачивание завершено');
                return;
            }

            const id = selectedDocuments[currentIndex];
            const doc = documents.find(d => d.id === id);

            const link = document.createElement('a');
            link.href = doc.histories[0].url;
            link.download = doc.name;
            link.target = '_blank';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            currentIndex++;
        }, 1000);
    };

    const handleMultipleDelete = () => {
        if (user.permissions.canDelete == false) {
            toast.error('У вас нет разрешения на удаление файлов');
            return;
        }

        selectedDocuments.forEach(id => handleDelete(id));
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
        const matchesSearchTerm = doc.name.toLowerCase().includes(searchTermLower);

        const matchesAuthor = searchAuthor ? (
            doc.histories[0].author.firstName.toLowerCase().includes(searchAuthor.toLowerCase()) ||
            doc.histories[0].author.middleName.toLowerCase().includes(searchAuthor.toLowerCase()) ||
            doc.histories[0].author.lastName.toLowerCase().includes(searchAuthor.toLowerCase())
        ) : true;

        const matchesTags = searchTags.length === 0 ||
            searchTags.every(tag => doc.tags && doc.tags.includes(tag));

        const matchesType = filterType ? doc.type === filterType : true;

        const matchesStatus = filterStatus ? doc.histories[0].status === filterStatus : true;

        const matchesDateRange = (
            (!dateRange[0] || new Date(doc.histories[0].createdAt) >= dateRange[0]) &&
            (!dateRange[1] || new Date(doc.histories[0].createdAt) <= dateRange[1])
        );


        const docSizeKB = doc.histories[0].size / 1024;
        const matchesSizeRange = (
            docSizeKB >= sizeRangeKB[0] &&
            docSizeKB <= sizeRangeKB[1]
        );

        const matchesVersion = searchVersion ? doc.histories[0].version == (searchVersion) : true;

        return matchesSearchTerm && matchesAuthor && matchesTags && matchesType && matchesStatus && matchesDateRange && matchesSizeRange && matchesVersion;
    });

    const getStatusLabel = (status) => {
        switch (status) {
            case 'new':
                return 'Новое';
            case 'progress':
                return 'В работе';
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

    const handleSearchReset = () => {
        setSearchTerm('');
        setSearchTags([]);
        setFilterStatus('');
        setFilterType('');
        setDateRange([null, null]);
        const maxFileSizeKB = Math.ceil(Math.max(...documents.map(doc => doc.histories[0].size / 1024)) / 2) * 2;
        setSizeRangeKB([0, maxFileSizeKB]);
        setSearchAuthor('');
        setSearchVersion('');
    };

    return (
        <div className="container">
            <h1 className='archive__title'>Электронный архив</h1>
            <div className="archive">
                <div className="archive__sidebar">
                    <h3>Фильтры</h3>
                    <div className="filter">
                        <label>Название</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="filter">
                        <label>Автор</label>
                        <input
                            type="text"
                            value={searchAuthor}
                            onChange={(e) => setSearchAuthor(e.target.value)}
                        />
                    </div>
                    <div className="filter">
                        <label>Теги</label>
                        <div className="filter__checkbox-list">
                            {allTags.map(tag => (
                                <div key={tag} className="filter__checkbox">
                                    <input
                                        type="checkbox"
                                        value={tag}
                                        checked={searchTags.includes(tag)}
                                        onChange={handleTagToggle}
                                    />
                                    <label className="checkbox-label">
                                        {tag}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="filter">
                        <label>Версия</label>
                        <input
                            type="text"
                            value={searchVersion}
                            onChange={(e) => setSearchVersion(e.target.value)}
                        />
                    </div>
                    <div className="filter">
                        <label>Статус</label>
                        <select value={filterStatus} onChange={handleFilterStatus}>
                            <option value="">Все</option>
                            <option value="new">Новые</option>
                            <option value="progress">В работе</option>
                            <option value="review">На рассмотрении</option>
                            <option value="correction">Исправления</option>
                            <option value="rejected">Отклоненные</option>
                            <option value="approved">Утвержденные</option>
                        </select>
                    </div>
                    <div className="filter">
                        <label>Тип</label>
                        <select value={filterType} onChange={handleFilterType}>
                            <option value="">Все</option>
                            <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">DOCX</option>
                            <option value="application/msword">DOC</option>
                            <option value="application/vnd.openxmlformats-officedocument.presentationml.presentation">PPTX</option>
                            <option value="application/vnd.ms-powerpoint">PPT</option>
                            <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">XLSX</option>
                            <option value="application/vnd.ms-excel">XLS</option>
                            <option value="application/pdf">PDF</option>
                            <option value="application/vnd.oasis.opendocument.text">ODT</option>
                        </select>
                    </div>
                    <div className="filter">
                        <label>Дата обновления</label>
                        <div className="filter__date">
                            <input className="filter__date-input"
                                type="date"
                                value={dateRange[0] ? dateRange[0].toISOString().split('T')[0] : ''}
                                onChange={(event) => handleDateRangeChange(event, 0)}
                            />
                            <label> - </label>
                            <input className="filter__date-input"
                                type="date"
                                value={dateRange[1] ? dateRange[1].toISOString().split('T')[0] : ''}
                                onChange={(event) => handleDateRangeChange(event, 1)}
                            />
                        </div>
                    </div>
                    <div className="filter">
                        <label>Размер (KB) {sizeRangeKB[1]}</label>

                        {sizeRangeKB[1] !== 0 && (
                            (() => {
                                const maxFileSizeKB = Math.ceil(Math.max(...documents.map(doc => doc.histories[0].size / 1024)) / 2) * 2;
                                return (
                                    <Slider
                                        range
                                        min={0}
                                        max={maxFileSizeKB}
                                        step={1}
                                        value={sizeRangeKB}
                                        onChange={handleSizeRangeChange}
                                        trackStyle={[{ backgroundColor: '#243FD6' }]}
                                        handleStyle={[
                                            { borderColor: '#243FD6', borderWidth: '2px' }, // Стиль границы для первого ползунка
                                            { borderColor: '#243FD6', borderWidth: '2px' }  // Стиль границы для второго ползунка
                                        ]}
                                    />
                                );
                            })()
                        )}
                        <div>{sizeRangeKB[0]} KB - {sizeRangeKB[1]} КВ</div>
                    </div>
                    <button className='main-button main-button--2' onClick={handleSearchReset}>Сбросить</button>
                </div>
                <div className="archive__content">
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
                        <div className="archive__controls-bulk">
                            <label>ОТМЕЧЕННЫЕ:</label>
                            <div className="archive__controls-bulk-actions">
                                <button className='archive__controls-bulk-btn' onClick={handleMultipleDownload} disabled={selectedDocuments.length === 0}>Скачать <IconFileDownload /></button>
                                <button className='archive__controls-bulk-btn' onClick={handleMultipleDelete} disabled={selectedDocuments.length === 0}>Удалить <IconFileDelete /></button>
                            </div>
                        </div>
                    </div>
                    <table className="archive__table">
                        <thead>
                            <tr>
                                <th>
                                    <input className='archive__table-select-input'
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
                                const isSelected = selectedDocuments.includes(doc.id);
                                const rowClass = isSelected ? 'selected' : '';

                                return (
                                    <tr key={doc.id} className={rowClass}>
                                        <td className='archive__table-select'>
                                            <input className='archive__table-select-input'
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelect(doc.id)}
                                            />
                                        </td>
                                        <td className='download__table-type'>
                                            <div className="type-file-icon">
                                                {fileIcons[doc.type]}
                                            </div>
                                        </td>
                                        <td className='archive__table-name'>{doc.name}</td>
                                        <td className='archive__table-author'>{latestVersion.author.middleName} {latestVersion.author.firstName[0]}. {latestVersion.author.lastName[0]}.</td>
                                        <td className='archive__table-date'>{new Date(latestVersion.createdAt).toLocaleDateString()}</td>
                                        <td className='archive__table-size'>{formatFileSize(latestVersion.size)}</td>
                                        <td className='archive__table-status'><div className={statusClass}>{getStatusLabel(latestVersion.status)}</div></td>
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

                    <div className="archive__records">
                        {filteredDocuments.length > 0 ? (
                            `Показано 1-${Math.min(perPage, filteredDocuments.length)} из ${filteredDocuments.length} записей`
                        ) : (
                            'Ничего не найдено'
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArchivePage;
