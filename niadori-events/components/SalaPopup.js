import styles from './SalaPopup.module.css'

const ICONE = {
  'Banchetti': '🍽️',
  'Conferenze': '🎤',
  'Matrimoni': '💍',
  'Congressi': '🏛️',
  'Aperitivi': '🥂',
}

export default function SalaPopup({ sala, onClose }) {
  if (!sala) return null

  const icona = ICONE[sala.categoria] || '🏢'

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={`${styles.overlay} ${sala ? styles.open : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={styles.card}>

        {/* HERO */}
        <div className={styles.hero}>
          {sala.immagine_url ? (
            <img src={sala.immagine_url} alt={sala.nome} className={styles.heroImg} />
          ) : (
            <div className={styles.heroPlaceholder}>
              <span className={styles.heroIcon}>{icona}</span>
            </div>
          )}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Chiudi">✕</button>
          <div className={styles.heroBadge}>{sala.categoria}</div>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          <p className={styles.city}>{sala.citta} — {sala.indirizzo}</p>
          <h2 className={styles.name}>{sala.nome}</h2>

          {/* STATS ROW */}
          <div className={styles.stats}>
            {sala.capienza && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>👥</span>
                <div>
                  <p className={styles.statValue}>{sala.capienza}</p>
                  <p className={styles.statLabel}>Posti</p>
                </div>
              </div>
            )}
            {sala.mq && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>📐</span>
                <div>
                  <p className={styles.statValue}>{sala.mq} m²</p>
                  <p className={styles.statLabel}>Superficie</p>
                </div>
              </div>
            )}
            {sala.prezzo_ora && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>💶</span>
                <div>
                  <p className={styles.statValue}>€{sala.prezzo_ora}</p>
                  <p className={styles.statLabel}>/ ora</p>
                </div>
              </div>
            )}
            {sala.prezzo_giornata && (
              <div className={styles.stat}>
                <span className={styles.statIcon}>📅</span>
                <div>
                  <p className={styles.statValue}>€{sala.prezzo_giornata}</p>
                  <p className={styles.statLabel}>/ giornata</p>
                </div>
              </div>
            )}
          </div>

          {/* DESCRIZIONE */}
          {sala.descrizione && (
            <p className={styles.description}>{sala.descrizione}</p>
          )}

          {/* SERVIZI */}
          {sala.servizi && sala.servizi.length > 0 && (
            <div className={styles.servizi}>
              <p className={styles.serviziTitle}>Servizi inclusi</p>
              <div className={styles.serviziList}>
                {sala.servizi.map((s, i) => (
                  <span key={i} className={styles.servizio}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className={styles.cta}>
            {sala.telefono && (
              <a href={`tel:${sala.telefono}`} className={styles.btnPrimary}>
                📞 Chiama ora
              </a>
            )}
            {sala.email && (
              <a href={`mailto:${sala.email}`} className={styles.btnSecondary}>
                ✉️ Email
              </a>
            )}
            {sala.sito_web && (
              <a href={sala.sito_web} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                🌐 Sito web
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
