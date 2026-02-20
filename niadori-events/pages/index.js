import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Header from '../components/Header'
import SideMenu from '../components/SideMenu'
import SalaPopup from '../components/SalaPopup'

// MapView caricato solo lato client (Leaflet non supporta SSR)
const MapView = dynamic(() => import('../components/MapView'), { ssr: false })

export default function Home() {
  const [sale, setSale] = useState([])
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
        <title>Adori Events — Sale & Spazi nel Veneto</title>
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
