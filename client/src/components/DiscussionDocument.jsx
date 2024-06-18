import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";

import IconAvatar from "../assets/images/icon-union.svg?react";
import "../assets/styles/style-components/DiscussionDocument.scss";

function DiscussionDocument() {
    const { jwt, user } = useAuth();
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
        <div className="discussion">
            <div className="discussion__messages-list">
                {document.messages.map((message) => (
                    <div key={message.id} className="discussion__message-item">
                        <div className="discussion__message-item-user">
                            <div className="discussion__message-item-user-img">
                                {message.user.photo ? (
                                    <img src={message.user.photo} alt="User Photo" className="discussion__message-item-user-img" />
                                ) : (
                                    <IconAvatar className="discussion__message-item-user-img" />
                                )}
                            </div>
                            <div className="discussion__message-item-user-info">
                                <div className='discussion__message-item-user-name'>{message.user.middleName} {message.user.firstName}</div>
                                <div className='discussion__message-item-user-date'>{new Date(message.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="discussion__message-item-content">
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleNewMessageSubmit} className="discussion__form">
                <div className="discussion__form-inner">
                    <div className="discussion__form-user">
                        {user.photo ? (
                            <img src={user.photo} alt="User Photo" className="discussion__message-item-user-img" />
                        ) : (
                            <IconAvatar className="discussion__message-item-user-img" />
                        )}
                        <div className='discussion__message-item-user-name'>{user.middleName} {user.firstName}</div>
                    </div>
                    <textarea
                        className='discussion__form-message'
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        placeholder="Ваше сообщение..."
                    ></textarea>
                </div>
                <div className="discussion__form-btn">
                    <button className='main-button main-button--2' type="submit">Отправить</button>
                </div>

            </form>
        </div>
    );
}

export default DiscussionDocument;
