import { useLanguage } from '../contexts/LanguageContext.jsx';

function PlayIcon() {
  return (
    <div className="play-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    </div>
  );
}

export default function VideoFAQ() {
  const { t } = useLanguage();
  const faq = t.faq;

  return (
    <section className="faq-section" aria-labelledby="faq-title" data-testid="faq-section">
      <h2 className="section-title" id="faq-title">{faq.title}</h2>
      <div className="faq-grid">
        {faq.questions.map((question, i) => (
          <article className="faq-card" key={i} data-testid={`faq-card-${i}`}>
            <div className="faq-video-placeholder" aria-label={`Video for: ${question}`}>
              <PlayIcon />
              <span className="coming-soon-badge">{faq.comingSoon}</span>
            </div>
            <div className="faq-card-body">
              <p className="faq-question">{question}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
