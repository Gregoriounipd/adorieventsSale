import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Header from '../components/Header'
import SideMenu from '../components/SideMenu'
import SalaPopup from '../components/SalaPopup'

// MapView caricato solo lato client (Leaflet non supporta SSR)
const MapView = dynamic(() => import('../components/MapView'), { ssr: false })

// Dati demo — vengono sostituiti da Supabase in produzione
const SALE_DEMO = [
  {
    id: 1, nome: 'Villa Contarini', citta: 'Piazzola sul Brenta', categoria: 'Matrimoni',
    indirizzo: 'Via Contarini 1', lat: 45.530, lng: 11.837,
    capienza: 300, mq: 800, prezzo_ora: null, prezzo_giornata: 4500,
    descrizione: 'Splendida villa veneta del XVII secolo immersa in un parco secolare. Perfetta per matrimoni di lusso e grandi eventi.',
    servizi: ['Parcheggio', 'Catering esterno ok', 'Wi-Fi', 'Aria condizionata', 'Palco'],
    telefono: '+39 049 5599999', email: 'info@villacontarini.it', sito_web: 'https://villacontarini.it',
  },
  {
    id: 2, nome: 'Palazzo della Ragione', citta: 'Padova', categoria: 'Conferenze',
    indirizzo: 'Piazza delle Erbe, Padova', lat: 45.4075, lng: 11.8745,
    capienza: 200, mq: 450, prezzo_ora: 350, prezzo_giornata: 2200,
    descrizione: 'Spazio storico nel cuore di Padova, ideale per convegni, presentazioni e eventi corporate.',
    servizi: ['Proiettore HD', 'Microfoni', 'Wi-Fi', 'Servizio bar', 'Accesso disabili'],
    telefono: '+39 049 8752020', email: 'eventi@padovacultura.it',
  },
  {
    id: 3, nome: 'Lido Palace', citta: 'Venezia Lido', categoria: 'Banchetti',
    indirizzo: 'Via Sandro Gallo 42', lat: 45.4021, lng: 12.3562,
    capienza: 180, mq: 320, prezzo_ora: 280, prezzo_giornata: 1800,
    descrizione: 'Elegante sala affacciata sul Lido di Venezia. Atmosfera unica per cene di gala e ricevimenti esclusivi.',
    servizi: ['Vista mare', 'Cucina interna', 'Terrazza', 'Valet parking', 'Sommelier'],
    telefono: '+39 041 5260000', email: 'events@lidopalace.it',
  },
  {
    id: 4, nome: 'Centro Congressi Sheraton', citta: 'Padova', categoria: 'Congressi',
    indirizzo: 'Corso Argentina 5', lat: 45.3985, lng: 11.8690,
    capienza: 500, mq: 1200, prezzo_ora: 600, prezzo_giornata: 3800,
    descrizione: 'Centro congressi professionale con 8 sale modulabili, sala plenaria e tutti i servizi audiovisivi.',
    servizi: ['Sala plenaria', 'Traduzione simultanea', 'Business center', 'Ristorante', 'Hotel annesso'],
    telefono: '+39 049 8912000', email: 'congressi@sheratonpadova.it',
  },
  {
    id: 5, nome: 'Ca\' Sagredo', citta: 'Venezia', categoria: 'Matrimoni',
    indirizzo: 'Campo Santa Sofia, Cannaregio', lat: 45.4415, lng: 12.3362,
    capienza: 100, mq: 250, prezzo_ora: null, prezzo_giornata: 6000,
    descrizione: 'Palazzo storico affacciato sul Canal Grande. Un &apos; ambientazione indimenticabile per matrimoni da sogno a Venezia.',
    servizi: ['Canal Grande', 'Arrivo in gondola', 'Catering esclusivo', 'Fotografo convenzionato'],
    telefono: '+39 041 2413111', email: 'events@casagredo.it', sito_web: 'https://casagredo.it',
  },
  {
    id: 6, nome: 'Villa dei Cedri', citta: 'Mestre', categoria: 'Aperitivi',
    indirizzo: 'Via Miranese 10, Mestre', lat: 45.4914, lng: 12.2247,
    capienza: 80, mq: 150, prezzo_ora: 120, prezzo_giornata: 700,
    descrizione: 'Spazio moderno con giardino, perfetto per aperitivi aziendali, team building e eventi informali.',
    servizi: ['Giardino', 'Barbecue', 'Impianto audio', 'Parcheggio gratuito'],
    telefono: '+39 041 9870001', email: 'info@villacedri.it',
  },
  {
    id: 7, nome: 'Auditorium Pollini', citta: 'Padova', categoria: 'Conferenze',
    indirizzo: 'Via Carlo Cassan 17', lat: 45.4050, lng: 11.8800,
    capienza: 350, mq: 600, prezzo_ora: 400, prezzo_giornata: 2600,
    descrizione: 'Sala concerti e conferenze tra le più prestigiose del Veneto. Acustica professionale e palco attrezzato.',
    servizi: ['Palco professionale', 'Impianto luci teatrale', 'Sala prove', 'Foyer', 'Biglietteria'],
    telefono: '+39 049 8762525', email: 'info@auditoriumpadova.it',
  },
]

export default function Home() {
  const [sale, setSale] = useState(SALE_DEMO)
  const [menuOpen, setMenuOpen] = useState(false)
  const [salaAttiva, setSalaAttiva] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte')
  const [filtroCitta, setFiltroCitta] = useState('Tutte')

  // Carica sale da Supabase (se configurato)
  useEffect(() => {
    async function fetchSale() {
      try {
        const res = await fetch('/api/sale')
        if (!res.ok) throw new Error('Errore fetch')
        const data = await res.json()
        if (data && data.length > 0) setSale(data)
      } catch (e) {
        // Supabase non ancora configurato, usa i dati demo
        console.info('Usando dati demo. Configura Supabase in .env.local per usare il database.')
      }
    }
    fetchSale()
  }, [])

  // Sale filtrate
  const saleFiltrate = useMemo(() => {
    return sale.filter(s => {
      const matchCat = filtroCategoria === 'Tutte' || s.categoria === filtroCategoria
      const matchCitta = filtroCitta === 'Tutte' || s.citta === filtroCitta
      return matchCat && matchCitta
    })
  }, [sale, filtroCategoria, filtroCitta])

  function handleSalaClick(sala) {
    setSalaAttiva(sala)
    setMenuOpen(false) // chiudi menu quando apri popup
  }

  function handlePopupClose() {
    setSalaAttiva(null)
  }

  return (
    <>
      <Head>
        <title>Niadori Events — Sale & Spazi nel Veneto</title>
      </Head>

      <Header
        saleCount={saleFiltrate.length}
        onMenuToggle={() => setMenuOpen(prev => !prev)}
        menuOpen={menuOpen}
      />

      <MapView
        sale={saleFiltrate}
        onSalaClick={handleSalaClick}
        salaAttiva={salaAttiva}
      />

      <SideMenu
        open={menuOpen}
        sale={saleFiltrate}
        filtroCategoria={filtroCategoria}
        filtroCitta={filtroCitta}
        onFiltroCategoria={setFiltroCategoria}
        onFiltroCitta={setFiltroCitta}
        onSalaClick={handleSalaClick}
      />

      <SalaPopup
        sala={salaAttiva}
        onClose={handlePopupClose}
      />
    </>
  )
}
