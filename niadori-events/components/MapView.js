import { useEffect, useRef } from 'react'

// Sample tile: CartoDB Dark Matter (perfetto per tema scuro)
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://carto.com/">CARTO</a>'

// Centro Padova
const CENTER = [45.4064, 11.8768]
const ZOOM = 10

export default function MapView({ sale, onSalaClick, salaAttiva }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (mapInstanceRef.current) return // già inizializzata

    const L = require('leaflet')

    // Fix icone di default leaflet
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    })

    const map = L.map(mapRef.current, {
      center: CENTER,
      zoom: ZOOM,
      zoomControl: false,
    })

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 19,
    }).addTo(map)

    // Zoom control personalizzato in basso a destra
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapInstanceRef.current = map
  }, [])

  // Aggiungi/aggiorna marker quando cambiano le sale
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mapInstanceRef.current) return

    const L = require('leaflet')
    const map = mapInstanceRef.current

    // Rimuovi vecchi marker
    Object.values(markersRef.current).forEach(m => map.removeLayer(m))
    markersRef.current = {}

    sale.forEach(sala => {
      if (!sala.lat || !sala.lng) return

      const isActive = salaAttiva?.id === sala.id

      const icon = L.divIcon({
        html: `
          <div class="map-pin ${isActive ? 'active' : ''}">
            <span class="dot"></span>
            ${sala.nome}
          </div>
        `,
        className: '',
        iconAnchor: [0, 0],
      })

      const marker = L.marker([sala.lat, sala.lng], { icon })
        .addTo(map)
        .on('click', () => onSalaClick(sala))

      markersRef.current[sala.id] = marker
    })
  }, [sale, salaAttiva, onSalaClick])

  // Fly to sala attiva
  useEffect(() => {
    if (!mapInstanceRef.current || !salaAttiva?.lat || !salaAttiva?.lng) return
    mapInstanceRef.current.flyTo([salaAttiva.lat, salaAttiva.lng], 15, {
      duration: 1.2,
    })
  }, [salaAttiva])

  return (
    <div
      ref={mapRef}
      style={{
        position: 'fixed',
        top: 62,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      }}
    />
  )
}
