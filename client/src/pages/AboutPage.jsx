
import "../assets/styles/style-pages/about-page.scss";

function AboutPage() {
    return (
        <>
            <div className="container">
                <section className="about__main">
                    <h2 className="about__main-title">Негосударственное экспертное учреждение &quot;ГОС-Эксперт&quot;</h2>
                    <div className="about__main-inner">
                        <div className="about__main-inner-image">
                            <img src="/images/company.png" alt="" className="about__main-inner-img" />
                        </div>
                        <div className="about__main-inner-info">
                            <p className="about__main-inner-text">Экспертное учреждение «ГОС-Эксперт» было зарегистрировано в феврале 2003 года и, за прошедшие с момента основания годы, стало одним из ведущих в Центрально-Черноземном регионе.</p>
                            <p className="about__main-inner-text">На сегодняшний день «ГОС-Эксперт» размещается в собственном просторном здании, имеет в штате значительное количество высококвалифицированных экспертов, работающих на современном экспертно-криминалистическом оборудовании, позволяющим проводить практически все виды экспертиз и исследований. В здании экспертно-криминалистического комплекса имеется авторемонтная лаборатория, имеющая современное диагностическое оборудование, позволяющее проводить исследование всех видов транспортных средств.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="about__statistics">
                    <div className="about__statistics-item about__statistics-item--color">
                        <div className="about__statistics-item-number">&gt;20</div>
                        <div className="about__statistics-item-text">ВИДОВ ЭКСПЕРТИЗ И ИССЛЕДОВАНИЙ</div>
                    </div>
                    <div className="about__statistics-item">
                        <div className="about__statistics-item-text">ОБРАТИВШИХСЯ</div>
                        <div className="about__statistics-item-number">150</div>
                        <div className="about__statistics-item-text">КЛИЕНТОВ</div>
                    </div>
                    <div className="about__statistics-item about__statistics-item--color">
                        <div className="about__statistics-item-number">2500</div>
                        <div className="about__statistics-item-text">ПРОВЕДЁННЫХ ЭКСПЕРТИЗ</div>
                    </div>
                    <div className="about__statistics-item">
                        <div className="about__statistics-item-text">ОПЫТ РАБОТЫ</div>
                        <div className="about__statistics-item-number">23</div>
                        <div className="about__statistics-item-text">ГОДА</div>
                    </div>
                </section>
                <section className="about__details">
                    <h2 className="about__details-title">О компании</h2>
                    <div className="about__details-table">
                        <h3 className="about__details-table-title">Основные сведения</h3>

                        <div className="about__details-table-row">
                            <div className="about__details-table-row-name">Наименование:</div>
                            <div className="about__details-table-row-value">Общество с ограниченной ответственностью «ГОС-Эксперт»</div>
                        </div>
                        <div className="about__details-table-row">
                            <div className="about__details-table-row-name">Дата создания:</div>
                            <div className="about__details-table-row-value">Февраль 2003</div>
                        </div>
                        <div className="about__details-table-row">
                            <div className="about__details-table-row-name">Место нахождения:</div>
                            <div className="about__details-table-row-value">Воронежская область, г. Воронеж, ул. Пирогова, д.69. Филиалы отсутствуют</div>
                        </div>
                    </div>
                    <div className="about__details-table">
                        <h3 className="about__details-table-title">Органы управления</h3>

                        <div className="about__details-table-row">
                            <div className="about__details-table-row-name"> Руководитель:</div>
                            <div className="about__details-table-row-value">Директор - Свиридов Юрий Алексеевич</div>
                        </div>
                        <div className="about__details-table-row">
                            <div className="about__details-table-row-name">Структурные подразделения:</div>
                            <div className="about__details-table-row-value">Информационно-аналитический отдел, Организационно методический отдел, Отдел реабилитационно-экспертной диагностики, Экспертные составы</div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default AboutPage;
