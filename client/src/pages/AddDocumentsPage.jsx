import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AddDocumentsPage() {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(async (file) => {
            const storageRef = ref(storage, `documents/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const authorId = 7; // Замените на фактический ID автора
            const size = file.size;
            const status = 'новое'; // Установите необходимый статус

            // Сохраните информацию о файле в базе данных через ваш бэкенд
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: file.name,
                    type: file.type,
                    authorId,
                    size,
                    status,
                    url: downloadURL
                })
            });

            if (!response.ok) {
                console.error('Ошибка при сохранении документа');
            }
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="container">
            <h1>Добавление документа</h1>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Перетащите файлы сюда ...</p> :
                        <p>Перетащите файлы сюда или нажмите для выбора файлов</p>
                }
            </div>
        </div>
    );
}

export default AddDocumentsPage;
