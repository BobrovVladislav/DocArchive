import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import "../../assets/styles/style-pages/user-list-page.scss";

function UserListPage() {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/all`, {
                    method: 'GET',
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error);
                }

                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Error fetching users');
            }
        };

        fetchUsers();
    }, []);

    const handlePermissionChange = async (userId, permissionType, value) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/permissions/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [permissionType]: value }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setUsers(users.map(user =>
                user.id === userId ?
                    { ...user, permissions: { ...user.permissions, [permissionType]: value } } :
                    user
            ));
        } catch (error) {
            console.error('Error updating permissions:', error);
            toast.error('Error updating permissions');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, {
                    method: 'DELETE',
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                setUsers(users.filter(user => user.id !== userId));
                toast.success(data.message);
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error(error);
            }
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(userId) ? prevSelected.filter(id => id !== userId) : [...prevSelected, userId]
        );
    };

    const handleSelectAllUsers = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    return (
        <div>
            <h1>Список пользователей</h1>
            <table className="user-list__table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={handleSelectAllUsers}
                                checked={selectedUsers.length === users.length}
                            />
                        </th>
                        <th>ID</th>
                        <th>ФИО</th>
                        <th>Должность</th>
                        <th>Скачивать</th>
                        <th>Редактировать</th>
                        <th>Удалять</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleSelectUser(user.id)}
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{`${user.middleName} ${user.firstName.charAt(0)}. ${user.lastName.charAt(0)}.`}</td>
                            <td>{user.position}</td>
                            <td>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={user.permissions?.canDownload}
                                        onChange={(e) => handlePermissionChange(user.id, 'canDownload', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </td>
                            <td>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={user.permissions?.canEdit}
                                        onChange={(e) => handlePermissionChange(user.id, 'canEdit', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </td>
                            <td>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={user.permissions?.canDelete}
                                        onChange={(e) => handlePermissionChange(user.id, 'canDelete', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </td>
                            <td>
                                <button className="edit-button">✏️</button>
                                <button className="delete-button" onClick={() => handleDeleteUser(user.id)} >🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserListPage;
