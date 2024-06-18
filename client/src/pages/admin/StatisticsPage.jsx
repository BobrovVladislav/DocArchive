import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";

import IconUsers from "../../assets/images/statistics/users.svg?react";
import IconDocs from "../../assets/images/statistics/docs.svg?react";
import IconVersions from "../../assets/images/statistics/versions.svg?react";
import IconExpertise from "../../assets/images/statistics/expertise.svg?react";

import "../../assets/styles/style-pages/statistics-page.scss";
function StatisticsPage() {

    const { jwt } = useAuth();
    const [statistics, setStatistics] = useState({
        usersCount: 0,
        documentsCount: 0,
        versionsCount: 0,
        automotiveExpertiseCount: 0,
        documentaryExpertiseCount: 0,
        engineeringExpertiseCount: 0
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/statistics`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const data = await response.json();
                setStatistics({
                    usersCount: data.usersCount,
                    documentsCount: data.documentsCount,
                    versionsCount: data.versionsCount,
                    automotiveExpertiseCount: data.automotiveExpertiseCount,
                    documentaryExpertiseCount: data.documentaryExpertiseCount,
                    engineeringExpertiseCount: data.engineeringExpertiseCount
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div>
            <h2>Статистика</h2>
            <div className="statistics">
                <div className="statistics__item">
                    <IconUsers className="statistics__item-icon" />
                    <div className="statistics__item-name">
                        Зарегистрировано пользователей
                    </div>
                    <div className="statistics__item-value">
                        {statistics.usersCount}
                    </div>
                </div>
                <div className="statistics__item">
                    <IconDocs className="statistics__item-icon" />
                    <div className="statistics__item-name">
                        Всего загружено документов
                    </div>
                    <div className="statistics__item-value">
                        {statistics.documentsCount}
                    </div>
                </div>
                <div className="statistics__item">
                    <IconVersions className="statistics__item-icon" />
                    <div className="statistics__item-name">
                        Всего версий документов
                    </div>
                    <div className="statistics__item-value">
                        {statistics.versionsCount}
                    </div>
                </div>
                <div className="statistics__item">
                    <IconExpertise className="statistics__item-icon" />
                    <div className="statistics__item-name">
                        Автомобильные экспертизы
                    </div>
                    <div className="statistics__item-value">
                        {statistics.automotiveExpertiseCount}
                    </div>
                </div>
                <div className="statistics__item">
                    <IconExpertise className="statistics__item-icon" />
                    <div className="statistics__item-name">
                        Документальные экспертизы
                    </div>
                    <div className="statistics__item-value">
                        {statistics.documentaryExpertiseCount}
                    </div>
                </div>
                <div className="statistics__item">
                    <IconExpertise className="statistics__item-icon" />
                    <div className="statistics__item-name">
                        Инженерно-технические экспертизы
                    </div>
                    <div className="statistics__item-value">
                        {statistics.engineeringExpertiseCount}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatisticsPage;