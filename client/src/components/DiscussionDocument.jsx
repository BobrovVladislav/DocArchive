import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";

function DiscussionDocument() {
    const { jwt } = useAuth();
    const { document, getDocument } = useDocument();
    const [newMessage, setNewMessage] = useState('');


    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleNewMessageSubmit = async (event) => {
        event.preventDefault();

        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${document.id}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newMessage }),
            });

            if (response.ok) {
                await response.json();
                await getDocument(document.id, jwt);
                setNewMessage('');
            } else {
                console.error('Ошибка при отправке сообщения');
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        }
    };

    return (
        <div className="discussion-container">
            <h1>Обсуждение документа</h1>
            <div className="messages-list">
                {document.messages.map((message) => (
                    <div key={message.id} className="message-item">
                        <p><strong>{message.user.middleName} {message.user.firstName}</strong></p>
                        <p>{new Date(message.createdAt).toLocaleString()}</p>
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleNewMessageSubmit} className="new-message-form">
                <textarea
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Введите ваше сообщение"
                ></textarea>
                <button type="submit">Отправить</button>
            </form>
            <style jsx>{`
                .discussion-container {
                    width: 80%;
                    margin: 0 auto;
                    padding: 20px;
                }
                .messages-list {
                    margin-bottom: 20px;
                }
                .message-item {
                    border-bottom: 1px solid #ddd;
                    padding: 10px 0;
                }
                .message-item p {
                    margin: 5px 0;
                }
                .new-message-form {
                    display: flex;
                    flex-direction: column;
                }
                .new-message-form textarea {
                    padding: 10px;
                    margin-bottom: 10px;
                    resize: vertical;
                    height: 100px;
                }
                .new-message-form button {
                    align-self: flex-end;
                    padding: 10px 20px;
                }
            `}</style>
        </div>
    );
}

export default DiscussionDocument;
