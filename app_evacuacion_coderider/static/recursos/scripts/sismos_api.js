document.addEventListener("DOMContentLoaded", () => {
    const btnSismos = document.getElementById("btn-sismos");
    const listaSismos = document.getElementById("lista-sismos");
    const buscarSismos = document.getElementById("buscar-sismos");
    const magnitudMinima = document.getElementById("magnitud-minima");
    const fechaSismos = document.getElementById("fecha-sismos");
    const estadoSismos = document.getElementById("estado-sismos");
    let todosLosSismos = [];

    const getColorByMagnitude = (mag) => {
        if (mag === null || mag === undefined || Number.isNaN(Number(mag))) return "#4b5563";
        const value = Number(mag);
        if (value >= 6) return "#dc2626";
        if (value >= 4) return "#f59e0b";
        if (value >= 2) return "#3b82f6";
        return "#22c55e";
    };

    const renderSismos = (sismos) => {
        if (!listaSismos) return;
        listaSismos.innerHTML = "";

        const mapState = window.evacuationMap;
        const map = mapState?.map;

        if (map && typeof L !== "undefined") {
            mapState.clearSismoMarkers();
        }

        if (estadoSismos) {
            estadoSismos.textContent = `${sismos.length} evento${sismos.length === 1 ? "" : "s"} encontrado${sismos.length === 1 ? "" : "s"}`;
        }

        if (!sismos.length) {
            listaSismos.innerHTML = "<div class='punto-item'>No se encontraron resultados para tu búsqueda.</div>";
            return;
        }

        const bounds = [];

        sismos.slice(0, 10).forEach((sismo) => {
            const lugar = sismo?.properties?.place || "Ubicación no disponible";
            const magnitud = sismo?.properties?.mag ?? "N/A";
            const fecha = new Date(sismo?.properties?.time || Date.now()).toLocaleString("es-CO", {
                dateStyle: "medium",
                timeStyle: "short"
            });
            const coords = sismo?.geometry?.coordinates || [];
            const lat = Number(coords[1]);
            const lng = Number(coords[0]);

            const item = document.createElement("div");
            item.className = "punto-item";
            item.innerHTML = `
                <strong>Magnitud: ${magnitud}</strong><br>
                <span>${lugar}</span><br>
                <small>${fecha}</small>
            `;
            listaSismos.appendChild(item);

            if (map && typeof L !== "undefined" && Number.isFinite(lat) && Number.isFinite(lng)) {
                const marker = L.circleMarker([lat, lng], {
                    radius: 8 + Number(magnitud || 0),
                    color: getColorByMagnitude(magnitud),
                    fillColor: getColorByMagnitude(magnitud),
                    fillOpacity: 0.8,
                    weight: 2
                }).addTo(map);

                marker.bindPopup(`
                    <strong>Magnitud: ${magnitud}</strong><br>
                    ${lugar}<br>
                    ${fecha}
                `);
                mapState.sismoMarkers.push(marker);
                bounds.push([lat, lng]);
            }
        });

        if (map && bounds.length > 0 && sismos.length === todosLosSismos.length) {
            map.fitBounds(bounds, { padding: [35, 35], maxZoom: 7 });
        }

        document.querySelectorAll("#lista-sismos .punto-item").forEach((item, index) => {
            item.addEventListener("click", () => {
                const sismo = sismos[index];
                const coords = sismo?.geometry?.coordinates || [];
                if (map && Number.isFinite(Number(coords[1])) && Number.isFinite(Number(coords[0]))) {
                    map.flyTo([Number(coords[1]), Number(coords[0])], 8, { duration: 0.8 });
                }
            });
        });
    };

    const filtrarSismos = () => {
        const texto = (buscarSismos?.value || "").trim().toLowerCase();
        const minimo = Number(magnitudMinima?.value);
        const fechaDesde = fechaSismos?.value ? new Date(`${fechaSismos.value}T00:00:00`).getTime() : null;

        const filtrados = todosLosSismos.filter((sismo) => {
            const lugar = (sismo?.properties?.place || "").toLowerCase();
            const magnitud = Number(sismo?.properties?.mag);
            const fechaEvento = Number(sismo?.properties?.time || 0);
            return (!texto || lugar.includes(texto))
                && (!magnitudMinima?.value || (Number.isFinite(magnitud) && magnitud >= minimo))
                && (!fechaDesde || fechaEvento >= fechaDesde);
        });

        renderSismos(filtrados);
    };

    async function cargarSismos() {
        if (!listaSismos) return;
        listaSismos.innerHTML = "<div class='punto-item'>Cargando sismos recientes en Colombia…</div>";

        try {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 30);

            const params = new URLSearchParams({
                format: "geojson",
                starttime: start.toISOString().slice(0, 10),
                endtime: end.toISOString().slice(0, 10),
                minmagnitude: "1",
                limit: "20",
                minlatitude: "-4.2",
                maxlatitude: "13.5",
                minlongitude: "-81.9",
                maxlongitude: "-66.9"
            });

            const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            todosLosSismos = Array.isArray(data?.features) ? data.features : [];
            renderSismos(todosLosSismos);
        } catch (error) {
            console.error("Error cargando sismos:", error);
            listaSismos.innerHTML = "<div class='punto-item'>No se pudieron cargar los sismos de Colombia en este momento.</div>";
        }
    }

    btnSismos?.addEventListener("click", cargarSismos);
    buscarSismos?.addEventListener("input", filtrarSismos);
    magnitudMinima?.addEventListener("input", filtrarSismos);
    fechaSismos?.addEventListener("change", filtrarSismos);
    cargarSismos();
});