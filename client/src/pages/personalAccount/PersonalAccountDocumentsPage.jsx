import { useState, useEffect } from 'react'
import { useAuth } from "../../context/AuthContext"
import { Link } from 'react-router-dom';

import "../../assets/styles/style-pages/personal-account-documents-page.scss";

// Import icons for each file type
import IconDocx from "../../assets/images/files/docx.svg?react";
import IconDoc from "../../assets/images/files/doc.svg?react";
import IconPptx from "../../assets/images/files/pptx.svg?react";
import IconPpt from "../../assets/images/files/ppt.svg?react";
import IconXlsx from "../../assets/images/files/xlsx.svg?react";
import IconXls from "../../assets/images/files/xls.svg?react";
import IconPdf from "../../assets/images/files/pdf.svg?react";
import IconOdt from "../../assets/images/files/odt.svg?react";

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

function PersonalAccountDocumentsPage() {
    const { jwt, user, personalAccountData } = useAuth();
    const [documents, setDocuments] = useState([]);

    const userData = user.role === 'admin' ? personalAccountData : user;

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userData.id}/documents`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error('Ошибка при загрузке документов пользователя');
                }


                setDocuments(data.documents);
            } catch (error) {
                console.error('Ошибка загрузки документов:', error.message);
            }
        };

        fetchDocuments();
    }, [user]);

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

    return (
        <div className='documents'>
            <h2 className='documents-title'>Мои документы</h2>

            <form className="documents__form">
                <table className="documents__table">
                    <tbody>
                        {documents.map((document, index) => (
                            <Link key={index} to={`/archive/${document.id}/view`}>
                                <tr>
                                    <td className='documents__table-type'>
                                        <div className="type-file-icon">
                                            {fileIcons[document.type] || <span>Unknown</span>}
                                        </div>
                                    </td>
                                    <td className='documents__table-name'>{document.name}</td>
                                    <td className='documents__table-size'>{formatFileSize(document.size)}</td>
                                    <td className='documents__table-status'>
                                        <div className={`status-${document.status.replace('_', '-')} status`}>
                                            {getStatusLabel(document.status)}
                                        </div>
                                    </td>
                                    <td className='documents__table-created-at'>{new Date(document.createdAt).toLocaleDateString('ru-RU')}</td>
                                </tr>
                            </Link>
                        ))}
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default PersonalAccountDocumentsPage;
