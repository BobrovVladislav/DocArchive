import { Link, Outlet, useLocation } from 'react-router-dom'

import IconStatistics from "../../assets/images/icon-statistic.svg?react"
import IconUsers from "../../assets/images/icon-users.svg?react"
import "../../assets/styles/style-components/AdminLayout.scss";

function AdminLayout() {
    const location = useLocation();
    const path = location.pathname;
    return (
        <div className='admin__container'>
            <div className="container">
                <div className="admin__inner">
                    <div className="admin__nav">
                        <div className="admin__nav-title">Навигация</div>
                        <div className="admin__nav-border"></div>
                        <ul className="admin__nav-items">
                            <li>
                                <Link to="/admin/statistics" className={`admin__nav-item ${path.includes('statistics') ? 'active' : ''
                                    }`}
                                >
                                    <IconStatistics className="admin__nav-item-icon" />
                                    <div className="admin__nav-item-text">Статистика</div>
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/users" className={`admin__nav-item ${path.includes('users') ? 'active' : ''
                                    }`}
                                >
                                    <IconUsers className="admin__nav-item-icon" />
                                    <div className="admin__nav-item-text">Пользователи</div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="admin__content">
                        <Outlet />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminLayout;
