import Image from "next/image";
import { BrainCircuit, Database, MapPinned, Route } from "lucide-react";

const process = [
  { number: "01", icon: Database, title: "Собираем историю", text: "Для каждой парковки учитываем вместимость, занятость, день недели и время суток. В будущем добавим регулярно обновляемые реальные наблюдения." },
  { number: "02", icon: BrainCircuit, title: "Оцениваем свободные места", text: "Сейчас алгоритм усредняет расчётную занятость для той же парковки, дня и часа. Следующий этап — отдельная прогнозная модель для каждой парковки." },
  { number: "03", icon: MapPinned, title: "Показываем результат", text: "На карте планируем показывать оценку свободных мест, время обновления и уровень уверенности, чтобы было понятно, насколько прогноз актуален." },
];

export default function Home() {
  return (
    <main className="landing" id="top">
      <header className="landing-header wrap">
        <a className="wordmark" href="#top" aria-label="Parkantir — наверх">parkantir<span>.</span></a>
        <nav aria-label="Навигация"><a href="#product">Продукт</a><a href="#technology">Технология</a><a href="#data">Данные</a><a href="#accuracy">Цель</a></nav>
      </header>

      <section className="landing-hero wrap" id="product">
        <div className="hero-content">
          <p className="overline">ИИ И LLM ДЛЯ ПАРКОВКИ В МОСКВЕ</p>
          <h1>Знайте, где<br />припарковаться.</h1>
          <p className="hero-lead">Parkantir создаёт карту парковок с ИИ-прогнозом свободных мест и LLM, который объясняет оценку простым языком.</p>
          <p className="hero-support">Вместо поисков на последних улицах маршрута водитель видит парковки рядом с адресом, прогноз свободных мест и время, к которому относится оценка.</p>
          <p className="hero-disclaimer">ИИ-модели и LLM находятся в разработке. Сейчас доступность рассчитывается алгоритмом по историческим сценариям; фактическая занятость в реальном времени ещё не подключена.</p>
        </div>
        <div className="hero-visual"><Image src="/parkantir-moscow-preview.png" alt="Иллюстрация Parkantir: автомобиль направляется к доступной парковке на карте Москвы" width={1767} height={890} priority sizes="(max-width: 850px) 100vw, 54vw" /></div>
      </section>

      <section className="value-band"><div className="wrap value-inner"><div><span className="value-icon"><MapPinned size={24} aria-hidden="true" /></span><strong>Парковки на карте</strong><p>Варианты рядом с вашим пунктом назначения.</p></div><div><span className="value-icon"><BrainCircuit size={24} aria-hidden="true" /></span><strong>ИИ-прогноз для каждой парковки</strong><p>Будущая модель учтёт историю и особенности места.</p></div><div><span className="value-icon"><Route size={24} aria-hidden="true" /></span><strong>Маршрут без кругов</strong><p>Выбирайте место до того, как подъедете.</p></div></div></section>

      <section className="story-section wrap"><div><p className="overline">ПРОБЛЕМА</p><h2>Последние минуты поездки часто самые непредсказуемые.</h2></div><div className="story-copy"><p>Даже когда маршрут до адреса известен, водитель не знает, будет ли рядом свободное место. Приходится объезжать квартал, сравнивать парковки на ходу и менять план уже у цели.</p><p>Parkantir должен перенести это решение на более ранний момент: показать варианты и вероятность свободного места до прибытия. Это особенно важно в плотных районах Москвы, где ситуация меняется в течение дня.</p></div></section>

      <section className="scenario-section"><div className="wrap"><p className="overline">КАК ЭТО БУДЕТ ВЫГЛЯДЕТЬ</p><h2>Один маршрут. Больше ясности.</h2><div className="scenario-grid"><div><span>01 / АДРЕС</span><h3>Вы задаёте пункт назначения.</h3><p>Карта собирает ближайшие парковки в одном месте и показывает расстояние до цели.</p></div><div><span>02 / ОЦЕНКА</span><h3>Сравниваете доступность.</h3><p>Для каждой парковки видите прогноз свободных мест на нужное время и степень уверенности модели.</p></div><div><span>03 / РЕШЕНИЕ</span><h3>Выбираете подходящий вариант.</h3><p>Ориентируетесь на расстояние, доступность и актуальность данных, прежде чем свернуть к парковке.</p></div></div></div></section>

      <section className="landing-technology wrap" id="technology">
        <div className="section-intro"><p className="overline">КАК УСТРОЕН PARKANTIR</p><h2>ИИ прогнозирует.<br />LLM объясняет.</h2><p>Парковки ведут себя по-разному: утром, вечером и в выходные свободных мест может быть разное количество. Мы разрабатываем отдельную прогнозную модель для каждой парковки, а LLM — как слой, который сможет объяснить водителю, почему оценка изменилась и насколько ей можно доверять.</p></div>
        <div className="process-list">{process.map(({number, icon: Icon, title, text}) => <article className="process-row" key={number}><span>{number}</span><Icon size={25} strokeWidth={1.6} aria-hidden="true"/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <section className="ai-detail wrap" aria-label="Роли ИИ и LLM"><article><span>01 / ПРОГНОЗНАЯ МОДЕЛЬ</span><h3>Сколько мест может быть свободно?</h3><p>Модель будет анализировать историю занятости конкретной парковки, время прибытия и новые подтверждённые наблюдения. Результат — численная оценка доступности, а не обещание свободного места.</p></article><article><span>02 / LLM</span><h3>Почему прогноз именно такой?</h3><p>Языковая модель будет превращать расчёт и его ограничения в короткое понятное объяснение: какие данные учтены, когда они обновлялись и почему уверенность выше или ниже. LLM не заменяет расчёт свободных мест.</p></article></section>

      <section className="data-note wrap" id="data" aria-label="Источники и обновление данных"><div><p className="overline">ПРОЗРАЧНО О ДАННЫХ</p><h2>Откуда берётся оценка?</h2></div><div><p>Сейчас оценка строится по расчётным профилям занятости для конкретной парковки, дня недели и часа. Система определяет ожидаемое число автомобилей и вычитает его из вместимости парковки.</p><p>Следующий этап — подключить подтверждённые наблюдения, регулярно обновлять прогноз и показывать время последнего обновления. Уровень уверенности будет зависеть от количества и качества данных.</p><p className="data-caveat">Пока карта не получает фактическую занятость в реальном времени и не гарантирует наличие места по прибытии.</p></div></section>

      <section className="accuracy-section" id="accuracy"><div className="wrap accuracy-inner"><div><p className="overline">НАША ЦЕЛЬ</p><h2>90<span>%</span></h2><p className="accuracy-label">ориентир для будущей проверки прогноза</p></div><div className="accuracy-copy"><h3>Точность нужно доказать на реальных поездках.</h3><p>Мы стремимся к точности около 90% при оценке доступности парковки. Чтобы проверить это честно, нужно заранее определить метрику, сравнить прогноз с фактической занятостью на независимых данных и отдельно показать результаты для разных районов и часов.</p><p>Сейчас такого подтверждения нет. Поэтому 90% — цель разработки, а не измеренный результат или обещание свободного места.</p></div></div></section>

      <section className="final-cta wrap"><div><p className="overline">PARKANTIR / МОСКВА</p><h2>Меньше поиска.<br />Больше уверенности в пути.</h2><p>Мы строим сервис, который соединит городскую карту, данные о занятости и понятный прогноз для каждой парковки. Цель — помочь водителям принимать решение до прибытия, а не искать место наугад.</p></div></section>
      <footer className="landing-footer wrap"><a className="wordmark" href="#top">parkantir<span>.</span></a><span>Прогноз парковки в Москве.</span><span>© {new Date().getFullYear()} Parkantir</span></footer>
    </main>
  );
}
