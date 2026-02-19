# 🏛️ Niadori Events — Sale & Spazi nel Veneto

Sito web per trovare e prenotare sale eventi nella provincia di Padova, Venezia e Veneto.

**Stack:** Next.js 14 · JavaScript · Supabase · Leaflet · Vercel

---

## 🚀 Setup Completo

### 1. Clona e installa

```bash
git clone https://github.com/TUO-USERNAME/niadori-events.git
cd niadori-events
npm install
```

---

### 2. Configura Supabase (Database)

1. Vai su [supabase.com](https://supabase.com) e crea un progetto gratuito
2. Apri l'**SQL Editor** e incolla questo schema:

```sql
-- Tabella principale delle sale
CREATE TABLE sale (
  id            BIGSERIAL PRIMARY KEY,
  nome          TEXT NOT NULL,
  citta         TEXT NOT NULL,
  indirizzo     TEXT NOT NULL,
  categoria     TEXT NOT NULL,         -- Matrimoni, Conferenze, Banchetti, Congressi, Aperitivi
  lat           NUMERIC(10, 6),        -- Latitudine
  lng           NUMERIC(10, 6),        -- Longitudine
  capienza      INTEGER,               -- Numero massimo di persone
  mq            INTEGER,               -- Metri quadri
  prezzo_ora    NUMERIC(10, 2),        -- Prezzo per ora (null se non disponibile)
  prezzo_giornata NUMERIC(10, 2),      -- Prezzo per giornata
  descrizione   TEXT,
  servizi       TEXT[],                -- Array di servizi: ['Wi-Fi', 'Parking', ...]
  immagine_url  TEXT,                  -- URL immagine principale
  telefono      TEXT,
  email         TEXT,
  sito_web      TEXT,
  attiva        BOOLEAN DEFAULT true,  -- Per nascondere una sala senza cancellarla
  creato_il     TIMESTAMPTZ DEFAULT NOW()
);

-- Abilita Row Level Security
ALTER TABLE sale ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono leggere le sale attive
CREATE POLICY "sale_pubbliche" ON sale
  FOR SELECT USING (attiva = true);

-- Inserisci una sala di test
INSERT INTO sale (nome, citta, indirizzo, categoria, lat, lng, capienza, mq, prezzo_ora, prezzo_giornata, descrizione, servizi, telefono, email)
VALUES (
  'Villa di Test',
  'Padova',
  'Via Roma 1, Padova',
  'Matrimoni',
  45.4064,
  11.8768,
  150,
  400,
  NULL,
  2500.00,
  'Una bella sala di esempio nel centro di Padova.',
  ARRAY['Wi-Fi', 'Parcheggio', 'Catering'],
  '+39 049 0000000',
  'info@sallatest.it'
);
```

3. Vai su **Settings → API** e copia:
   - `Project URL`
   - `anon public key`

---

### 3. Configura le variabili d'ambiente

Crea il file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 4. Avvia in locale

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

### 5. Deploy su Vercel

#### Metodo A — Dashboard Vercel (consigliato)
1. Push del codice su GitHub
2. Vai su [vercel.com](https://vercel.com) → **New Project**
3. Importa il repo da GitHub
4. In **Environment Variables** aggiungi le stesse variabili di `.env.local`
5. Clicca **Deploy** → il sito è online!

#### Metodo B — CLI
```bash
npm i -g vercel
vercel
# segui le istruzioni, poi:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

---

## 📁 Struttura del progetto

```
niadori-events/
├── pages/
│   ├── _app.js          # Wrapper app con CSS globale
│   ├── _document.js     # Document HTML custom
│   ├── index.js         # Pagina principale (mappa + filtri)
│   └── api/
│       └── sale.js      # API route → Supabase
├── components/
│   ├── Header.js        # Navbar + hamburger menu
│   ├── Header.module.css
│   ├── SideMenu.js      # Menu laterale con filtri e lista
│   ├── SideMenu.module.css
│   ├── MapView.js       # Mappa Leaflet (dynamic, no SSR)
│   ├── SalaPopup.js     # Popup dettaglio sala
│   └── SalaPopup.module.css
├── lib/
│   └── supabase.js      # Client Supabase
├── styles/
│   └── globals.css      # Stili globali + design system
├── .env.local.example   # Template variabili d'ambiente
├── .gitignore
├── next.config.js
└── package.json
```

---

## ➕ Aggiungere una sala

### Via Supabase Dashboard
1. Vai su **Table Editor → sale**
2. Clicca **Insert row**
3. Compila i campi (minimo: nome, citta, indirizzo, categoria, lat, lng)

### Come trovare lat/lng
Vai su [maps.google.com](https://maps.google.com), clicca destro sulla posizione → copia le coordinate.

---

## 🎨 Personalizzazione

**Colori** — modifica le variabili CSS in `styles/globals.css`:
```css
:root {
  --oro: #c4943a;      /* colore principale */
  --nero: #0c0b0a;     /* sfondo */
  --crema: #f0ebe0;    /* testo chiaro */
}
```

**Categorie** — modifica l'array `CATEGORIE` in `components/SideMenu.js`

**Città** — modifica l'array `CITTA` in `components/SideMenu.js`

**Mappa** — per cambiare stile mappa, modifica `TILE_URL` in `components/MapView.js`:
- Dark (attuale): `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Light: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
- Satellite: richiede API key Mapbox

---

## 📞 Supporto

Per domande sul progetto, contatta il team Niadori Events.
