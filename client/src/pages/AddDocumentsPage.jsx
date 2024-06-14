import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify'
import { useAuth } from "../context/AuthContext";
import { storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import IconArrow from "../assets/images/IconArrow.svg?react";
import "../assets/styles/style-pages/add-documents-page.scss";

function AddDocumentsPage() {
    const { jwt } = useAuth();

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(async (file) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/add`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                    })
                });

                if (!response.ok) {
                    toast.error('Ошибка при сохранении документа');
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

            } catch (error) {
                console.error('Ошибка при загрузке и сохранении документа:', error);
            }
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="container">
            <div className="download">
                <div className="download__header">
                    <h1 className='download__header-title'>Загрузка файлов</h1>
                </div>
                <div className="download__content">


                    <div className="download__drag" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Перетащите файлы сюда ...</p> :
                                <>
                                    <div className="download__drag-img"></div>
                                    <p>Перетащите ваши файлы в область или  <span>выберите...</span></p>
                                </>
                        }
                    </div>
                    <p className="download__info">Допустимые типы файлов: .docx .doc .pptx .ppt .xlsx .xls .pdf .odt</p><div className="download__button">
                        <button className="main-button main-button--2 ">ЗАГРУЗИТЬ
                            <IconArrow className="icon-arrow" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AddDocumentsPage;
