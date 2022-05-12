import React, { useRef, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import mapboxgl from 'mapbox-gl'
import Graph from './Graph'

mapboxgl.accessToken = "pk.eyJ1IjoiamFzb25tdXJ5IiwiYSI6ImNrdXhxdGFkYTA0cmcycGxkNG56ZHJoaGkifQ.MJ7i_ZRoingkxpBgMacNkg"

function App() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(36.4) // eslint-disable-line
    const [lat, setLat] = useState(1.2) // eslint-disable-line
    const [zoom, setZoom] = useState(4) // eslint-disable-line
    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }))

    useEffect(() => {
        if (map.current) return
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'https://eahazardswatch.icpac.net/tileserver-gl/styles/droughtwatch/style.json',
            center: [lng, lat],
            zoom: zoom
        })
    })

    useEffect(() => {
        if (!map.current) return
        let year = parseInt(document.getElementById('year').value)
        map.current.on('load', () => {
            map.current.addSource('vector-test-source', {
                'type': 'vector',
                'tiles': [
                    'https://eahazardswatch.icpac.net/pg/tileserv/pgadapter.ea_gadm36_political_boundaries/{z}/{x}/{y}.pbf'
                ]
            })
            map.current.addLayer({
                'id': 'vector-test-layer',
                'type': 'fill',
                'source': 'vector-test-source',
                'source-layer': 'pgadapter.ea_gadm36_political_boundaries'
            })
            map.current.addSource('wms-test-source', {
                'type': 'raster',
                'tiles': [
                    `https://droughtwatch.icpac.net/mapserver/mukau/php/gis/mswms.php?map=mukau_w_mf&LAYERS=cdi_chirps&FORMAT=image/png&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:900913&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&STYLES=&SELECTED_YEAR=${year}&SELECTED_MONTH=04&SELECTED_TENDAYS=21`
                ],
                'tileSize': 256
            })
            map.current.addLayer({
                'id': 'wms-test-layer',
                'type': 'raster',
                'source': 'wms-test-source',
                'paint': {}
            })
        })
    })

    useEffect(() => {
        if (!map.current) return
        map.current.on('click', (e) => {
            let coordinates = e.lngLat;
            let year = parseInt(document.getElementById('year').value)
            fetch(`https://eahazardswatch.icpac.net/pg-gridapi/api/grid?x=${coordinates.lng}&y=${coordinates.lat}`)
                .then(resp => {
                    if (resp.ok) return resp.json();
                    else throw new Error('Network response was not ok.')
                })
                .then(data => {
                    fetch(`https://eahazardswatch.icpac.net/pg-gridapi/api/analysis/cdi_chirps?start_year=${year}&end_year=${year}&ts=true&aru_id=${data.aru_id}`)
                        .then(resp => {
                            if (resp.ok) return resp.json();
                            else throw new Error('Network response was not ok.');
                        })
                        .then(data => {
                            const el = createRoot(document.getElementById('graphic'));
                            el.render(<Graph data={data} />)
                        })
                    
                    tooltipRef.current
                        .setLngLat(e.lngLat)
                        .setHTML(`<div><h3>ARU ID: ${data.aru_id}</h3><h3>Check analysis graphic on the left side panel!</h3></div>`)
                        .addTo(map.current)
                })
        })
    })

    return (
        <div>
            <div ref={mapContainer} id="map" />
            <div className="map-overlay top">
                <div className="map-overlay-inner">
                    <fieldset>
                        <label>Select Year</label>
                        <select id="year">
                            <option value="2022">2022</option>
                        </select>
                    </fieldset>
                    <fieldset>
                        <div id="graphic"></div>
                    </fieldset>
                </div>
            </div>
        </div>
    )
}


export default App
