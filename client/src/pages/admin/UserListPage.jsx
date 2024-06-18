import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from "../../context/AuthContext";

import IconSearch from "../../assets/images/icon-search.svg?react";
import IconAdd from "../../assets/images/icon-add.svg?react";
import IconFileDownload from "../../assets/images/users/download.svg?react";
import IconRedact from "../../assets/images/users/redact.svg?react";
import IconFileDelete from "../../assets/images/users/basket.svg?react";
import IconDots from "../../assets/images/dots.svg?react";
import IconUserDelete from "../../assets/images/delete.svg?react";

import "../../assets/styles/style-pages/user-list-page.scss";

function UserListPage() {
    const { jwt } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    const getSelectClassName = () => {
        return departmentFilter !== '' && departmentFilter !== 'Все отделы' ? 'user-list__controls-bottom-select valid-selected' : 'user-list__controls-bottom-select';
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/all`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
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
                    Authorization: `Bearer ${jwt}`,
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

    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDepartmentFilterChange = (e) => {
        setDepartmentFilter(e.target.value);
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.middleName} ${user.firstName} ${user.lastName}`;
        return (
            (fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!departmentFilter || user.department === departmentFilter)
        );
    });

    return (
        <>
            <h2>Список пользователей</h2>
            <div className="user-list">
                <div className="user-list__controls">
                    <div className="user-list__controls-top">
                        <div className="user-list__controls-top-pagination">
                            <label>ПОКАЗАТЬ</label>
                            <input className='user-list__controls-top-input'
                                type="number"
                                value={perPage}
                                onChange={handlePerPageChange}
                                min={1}
                                step={1}
                            />
                            <label>ЗАПИСЕЙ</label>
                        </div>
                        <Link to="/admin/users/register" className="user-list__controls-btn"><IconAdd /> Зарегистрировать пользователя</Link>
                    </div>
                    <div className="user-list__controls-bottom">
                        <div className='user-list__controls-bottom-search-wrapper'>
                            <IconSearch className="user-list__controls-bottom-search-icon" />
                            <input className='user-list__controls-bottom-search'
                                type="text"
                                placeholder="Введите ФИО..."
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                            />
                        </div>
                        <select className={getSelectClassName()}
                            name='department'
                            value={departmentFilter}
                            onChange={handleDepartmentFilterChange}>

                            <option value="" disabled>Выберите отдел</option>
                            <option value="">Все отделы</option>
                            <option value="Отдел по организации работы с документами и обращениями граждан">Отдел по организации работы с документами и обращениями граждан</option>
                            <option value="Информационно-аналитический отдел">Информационно-аналитический отдел</option>
                            <option value="Организационно-методический отдел">Организационно-методический отдел</option>
                            <option value="Отдел реабилитационно-экспертной диагностики">Отдел реабилитационно-экспертной диагностики</option>
                            <option value="Экспертные составы">Экспертные составы</option>
                            <option value="Отдел кадров">Отдел кадров</option>
                            <option value="Юридический отдел">Юридический отдел</option>
                            <option value="Отдел по снабжению и закупкам">Отдел по снабжению и закупкам</option>
                            <option value="Отдел по общим вопросам">Отдел по общим вопросам</option>
                            <option value="Планово-финансовый отдел">Планово-финансовый отдел</option>
                        </select>
                    </div>
                </div>

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
                            <th><IconFileDownload /></th>
                            <th><IconRedact /></th>
                            <th><IconFileDelete /></th>
                            <th><IconDots /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.slice(0, perPage).map(user => (
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
                                    <Link to={`/user/${user.id}/settings`} className="edit-button"> <IconRedact /></Link>
                                    <button className="delete-button" onClick={() => handleDeleteUser(user.id)} ><IconUserDelete /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Информация о количестве записей */}
                <div className="user-list__records">
                    Показано 1-{Math.min(perPage, users.length)} из {users.length} записей
                </div>
            </div>
        </>
    );
}

export default UserListPage;
