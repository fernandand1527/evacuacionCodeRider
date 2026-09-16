document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById("mapa");
    const btnRuta = document.getElementById("btn-ruta");

    if (!mapContainer) {
        console.error("No existe el contenedor #mapa");
        return;
    }

    if (typeof L === "undefined") {
        console.error("Leaflet no está cargado");
        return;
    }

    const map = L.map("mapa", {
        zoomControl: true,
        attributionControl: true
    }).setView([2.446, -76.614], 15);

    window.evacuationMap = {
        map,
        markers: [],
        sismoMarkers: []
    };

    window.evacuationMap.clearMarkers = function () {
        this.markers.forEach((marker) => {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        });
        this.markers = [];
    };

    window.evacuationMap.clearSismoMarkers = function () {
        this.sismoMarkers.forEach((marker) => {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        });
        this.sismoMarkers = [];
    };

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    setTimeout(() => {
        map.invalidateSize();
    }, 250);

    let capaRuta = null;
    let marcadores = [];
    let marcadorSeleccionado = null;

    window.evacuationMap.showRoute = () => {
        if (capaRuta) {
            map.fitBounds(capaRuta.getBounds(), { padding: [36, 36], maxZoom: 17 });
        }
    };

    const cargarRuta = async () => {
        try {
            const response = await fetch(URL_GEO);
            const data = await response.json();

            if (capaRuta) {
                map.removeLayer(capaRuta);
            }

            capaRuta = L.geoJSON(data, {
                style: {
                    color: "#e23b3b",
                    weight: 7,
                    opacity: 1,
                    lineCap: "round",
                    lineJoin: "round",
                    dashArray: "12 8"
                }
            }).addTo(map);

            capaRuta.bindPopup("<strong>Ruta principal de evacuacion</strong><br>Trayecto hacia el punto de encuentro.");

            map.fitBounds(capaRuta.getBounds(), { padding: [24, 24] });
        } catch (error) {
            try {
                const response = await fetch(URL_GPX);
                const gpxText = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(gpxText, "application/xml");
                const trackPoints = [...xml.querySelectorAll("trkpt")];

                const coords = trackPoints.map((pt) => [
                    Number(pt.getAttribute("lat")),
                    Number(pt.getAttribute("lon"))
                ]);

                if (coords.length) {
                    const gpxLayer = L.polyline(coords, {
                        color: "#e23b3b",
                        weight: 7,
                        opacity: 1,
                        lineCap: "round",
                        dashArray: "12 8"
                    }).addTo(map);
                    gpxLayer.bindPopup("<strong>Ruta principal de evacuacion</strong><br>Trayecto GPX cargado como respaldo.");
                    map.fitBounds(gpxLayer.getBounds(), { padding: [24, 24] });
                    capaRuta = gpxLayer;
                }
            } catch (gpxError) {
                console.error("Error cargando ruta GPX:", gpxError);
            }
        }
    };

    const cargarPuntos = async () => {
        try {
            const response = await fetch(URL_JSON);
            const data = await response.json();

            marcadores.forEach((marker) => map.removeLayer(marker));
            marcadores = [];

            data.forEach((punto) => {
                const marker = L.marker([punto.latitud, punto.longitud]).addTo(map);
                marker.bindPopup(`<strong>${punto.nombre}</strong><br>${punto.descripcion || ""}`);
                marcadores.push(marker);
            });
        } catch (error) {
            console.error("Error cargando puntos de encuentro:", error);
        }
    };

    const irAPunto = (lat, lng, label, descripcion = "") => {
        if (marcadorSeleccionado) {
            map.removeLayer(marcadorSeleccionado);
        }

        marcadorSeleccionado = L.marker([lat, lng]).addTo(map);
        marcadorSeleccionado.bindPopup(`
            <div style="min-width: 180px;">
                <strong>${label}</strong><br>
                <span>${descripcion || "Ubicación de referencia"}</span>
            </div>
        `);
        marcadorSeleccionado.openPopup();
        map.flyTo([lat, lng], 16, { duration: 1.2 });
    };

    document.querySelectorAll(".ubicacion-btn").forEach((boton) => {
        boton.addEventListener("click", () => {
            const lat = Number(boton.dataset.lat);
            const lng = Number(boton.dataset.lng);
            const label = boton.dataset.label || "Ubicación";
            const descripcion = boton.dataset.descripcion || "";
            irAPunto(lat, lng, label, descripcion);
        });
    });

    cargarRuta();
    cargarPuntos();

    btnRuta?.addEventListener("click", () => {
        cargarRuta();
    });

    document.getElementById("btn-todo-mapa")?.addEventListener("click", () => {
        window.evacuationMap.showRoute();
    });
});