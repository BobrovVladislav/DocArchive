import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import { storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import IconAdd from "../assets/images/icon-add.svg?react";
import IconArrow from "../assets/images/IconArrow.svg?react";
import IconFileDelete from "../assets/images/delete.svg?react";
import "../assets/styles/style-pages/add-documents-page.scss";

// Import icons for each file type
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

function AddDocumentsPage() {
    const { jwt } = useAuth();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [step, setStep] = useState(1);

    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            name: file.name,
            type: file.type,
            size: file.size,
        }));
        setUploadedFiles(prevFiles => {
            const updatedFiles = [...prevFiles, ...newFiles];
            if (updatedFiles.length === 0) {
                setStep(1);
            } else {
                setStep(2);
            }
            return updatedFiles;
        });
    }, []);

    const handleUpload = async () => {
        try {
            for (const { file, name, type, size } of uploadedFiles) {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/add`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, type, size })
                });

                if (!response.ok) {
                    toast.error('Ошибка при сохранении документа');
                    continue;
                }

                const document = await response.json();
                const storageRef = ref(storage, `documents/${document.uuid}/${document.histories[0].version}/${document.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                const update = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${document.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        histories: {
                            url: downloadURL,
                        }
                    })
                });

                if (update.ok) {
                    toast.success(`${document.name} загружен`);
                } else {
                    toast.error(`Ошибка при загрузке ${document.name}`);
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке и сохранении документа:', error);
        }
    };

    const handleDelete = (index) => {
        setUploadedFiles(prevFiles => {
            const updatedFiles = prevFiles.filter((_, i) => i !== index);
            if (updatedFiles.length === 0) {
                setStep(1);
            }
            return updatedFiles;
        });
    };

    const openFileDialog = () => {
        document.getElementById('fileInput').click();
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/pdf': ['.pdf'],
            'application/vnd.oasis.opendocument.text': ['.odt']
        }
    });

    const formatFileSize = (size) => {
        if (size >= 1048576) {
            return (size / 1048576).toFixed(2) + ' MB';
        } else if (size >= 1024) {
            return (size / 1024).toFixed(2) + ' KB';
        } else {
            return size + ' bytes';
        }
    };

    return (
        <div className="container">
            <div className="download">
                <div className="download__header">
                    <h1 className='download__header-title'>Загрузка файлов</h1>
                </div>

                {step === 1 ? (
                    <>
                        <div className="download__content">
                            <div className="download__drag" {...getRootProps()}>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Перетащите файлы сюда ...</p>
                                ) : (
                                    <>
                                        <div className="download__drag-img"></div>
                                        <p>Перетащите ваши файлы в область или <span>выберите...</span></p>
                                    </>
                                )}
                            </div>
                            <p className="download__info">Допустимые типы файлов: .docx .doc .pptx .ppt .xlsx .xls .pdf .odt</p>
                        </div>
                    </>
                ) : (
                    <>
                            <button className="download__button" onClick={openFileDialog}>
                            <IconAdd />
                            Добавить ещё файлы
                        </button>
                        <input
                            id="fileInput"
                            type="file"
                            multiple
                            accept=".docx,.doc,.pptx,.ppt,.xlsx,.xls,.pdf,.odt"
                            style={{ display: 'none' }}
                            onChange={(e) => onDrop(Array.from(e.target.files))}
                        />
                        <table className='download__table'>
                            <tbody>
                                {uploadedFiles.map((file, index) => (
                                    <tr key={index}>
                                        <td className='download__table-type'>
                                            <div className="type-file-icon">
                                                {fileIcons[file.type]}
                                            </div>
                                        </td>
                                        <td className='download__table-name'>{file.name}</td>
                                        <td className='download__table-size'>{formatFileSize(file.size)}</td>
                                        <td className='download__table-delete' onClick={() => handleDelete(index)}> <button className="func-button"> <IconFileDelete /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="download_btn main-button main-button--2" onClick={handleUpload}>
                            ЗАГРУЗИТЬ
                            <IconArrow className="icon-arrow" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default AddDocumentsPage;
