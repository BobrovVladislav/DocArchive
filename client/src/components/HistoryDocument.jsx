import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";
import { toast } from 'react-toastify'
import { storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import IconFileDownload from "../assets/images/users/download.svg?react";
import IconDots from "../assets/images/dots.svg?react";
import "../assets/styles/style-components/HistoryDocument.scss";

function HistoryDocument() {
    const { jwt } = useAuth();
    const { document, getDocument } = useDocument();
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        if (document) {
            setSelectedStatus(document.histories[0].status);
        }
    }, [document]);

    const handleAddVersion = async (file) => {
        try {
            const storageRef = ref(storage, `documents/${document.uuid}/${document.histories[0].version}/${document.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            const size = file.size;
            const status = selectedStatus;

            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${document.id}/versions`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json', /// !!!!!!!! из-за этого у меня не обрабатывался url
                },
                body: JSON.stringify({
                    status,
                    size,
                    url
                })
            });

            if (response.ok) {
                toast.success('Новая версия успешно добавлена');
                // После успешного добавления версии обновляем список версий
                await getDocument(document.id, jwt);
            } else {
                toast.error('Ошибка при добавлении новой версии');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
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

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    return (
        <div className="history">
            <form className="history__form" onSubmit={(e) => {
                e.preventDefault();
                const fileInput = e.target.querySelector('input[type="file"]');
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    handleAddVersion(file);
                } else {
                    console.error('Файл не выбран');
                }
            }}>
                <input className="history__form-input" type="file" accept=".pdf,.doc,.docx" multiple={false} />
                <select className={`history__form-select status-${selectedStatus}`} value={selectedStatus} onChange={handleStatusChange}>
                    <option value="" disabled>Выберите статус</option>
                    <option value="new">Новое</option>
                    <option value="progress">В процессе</option>
                    <option value="review">На рассмотрении</option>
                    <option value="correction">Исправления</option>
                    <option value="rejected">Отклонено</option>
                    <option value="approved">Утверждено</option>
                </select>
                <button className="main-button main-button--2" type="submit">Добавить версию</button>
            </form >
            <table className="history__table">
                <thead>
                    <tr>
                        <th>Версия</th>
                        <th>Автор</th>
                        <th>Дата создания</th>
                        <th>Размер</th>
                        <th>Статус</th>
                        <th><IconDots /></th>
                    </tr>
                </thead>
                <tbody>
                    {document.histories.map(version => (
                        <tr key={version.id}>
                            <td>{version.version}</td>
                            <td>{version.author.middleName} {version.author.firstName[0]}. {version.author.lastName[0]}.</td>
                            <td>{new Date(version.createdAt).toLocaleDateString()}</td>
                            <td>{formatFileSize(version.size)}</td>
                            <td> <div className={`status-${version.status.replace('_', '-')} status`}>{getStatusLabel(version.status)}</div></td>
                            <td><a href={version.url} download><IconFileDownload /></a></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}

export default HistoryDocument;
