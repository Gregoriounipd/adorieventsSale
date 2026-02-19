import styles from './SideMenu.module.css'

const CATEGORIE = ['Tutte', 'Banchetti', 'Conferenze', 'Matrimoni', 'Congressi', 'Aperitivi']
const CITTA = ['Tutte', 'Padova', 'Venezia', 'Mestre', 'Treviso', 'Vicenza']

export default function SideMenu({ open, sale, filtroCategoria, filtroCitta, onFiltroCategoria, onFiltroCitta, onSalaClick }) {
  return (
    <aside className={`${styles.menu} ${open ? styles.open : ''}`}>

      {/* FILTRI CATEGORIA */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Tipo di spazio</p>
        <div className={styles.chips}>
          {CATEGORIE.map(cat => (
            <button
              key={cat}
              className={`${styles.chip} ${filtroCategoria === cat ? styles.chipActive : ''}`}
              onClick={() => onFiltroCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FILTRI CITTÀ */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Città</p>
        <div className={styles.chips}>
          {CITTA.map(città => (
            <button
              key={città}
              className={`${styles.chip} ${filtroCitta === città ? styles.chipActive : ''}`}
              onClick={() => onFiltroCitta(città)}
            >
              {città}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA SALE */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>{sale.length} risultati</p>
        <ul className={styles.list}>
          {sale.map(sala => (
            <li
              key={sala.id}
              className={styles.listItem}
              onClick={() => onSalaClick(sala)}
            >
              <span className={styles.dot} />
              <div className={styles.listInfo}>
                <p className={styles.listName}>{sala.nome}</p>
                <p className={styles.listCity}>{sala.citta} · {sala.categoria}</p>
              </div>
              <span className={styles.listPrice}>
                {sala.prezzo_ora ? `€${sala.prezzo_ora}/h` : 'Richiedi'}
              </span>
            </li>
          ))}
          {sale.length === 0 && (
            <li className={styles.empty}>Nessuna sala trovata</li>
          )}
        </ul>
      </div>

    </aside>
  )
}
