import { useAuth } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";
import { storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function HistoryDocument() {
    const { jwt } = useAuth();
    const { document, getDocument } = useDocument();

    const handleAddVersion = async (file) => {
        try {
            const storageRef = ref(storage, `documents/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            const size = file.size;
            const status = 'новое'; // Установите необходимый статус

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
                console.log('Новая версия успешно добавлена');
                // После успешного добавления версии обновляем список версий
                await getDocument(document.id, jwt);
            } else {
                console.error('Ошибка при добавлении новой версии');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    return (
        <div className="history-document">
            <h1>История изменений</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                const fileInput = e.target.querySelector('input[type="file"]');
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    handleAddVersion(file);
                } else {
                    console.error('Файл не выбран');
                }
            }}>
                <input type="file" accept=".pdf,.doc,.docx" multiple={false} />
                <button type="submit">Добавить версию</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Версия</th>
                        <th>Автор</th>
                        <th>Дата создания</th>
                        <th>Размер</th>
                        <th>Статус</th>
                        <th>Скачать</th>
                    </tr>
                </thead>
                <tbody>
                    {document.histories.map(version => (
                        <tr key={version.id}>
                            <td>{version.version}</td>
                            <td>{version.author.firstName} {version.author.lastName}</td>
                            <td>{new Date(version.createdAt).toLocaleDateString()}</td>
                            <td>{version.size}</td>
                            <td>{version.status}</td>
                            <td><a href={version.url} download>Скачать</a></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
                .history-document {
                    padding: 20px;
                }
                form {
                    margin-bottom: 20px;
                }
                input {
                    margin-right: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: center;
                }
                th {
                    background-color: #f2f2f2;
                }
            `}</style>
        </div>
    );
}

export default HistoryDocument;
