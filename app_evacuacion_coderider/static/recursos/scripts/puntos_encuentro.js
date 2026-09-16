document.addEventListener("DOMContentLoaded", () => {
    const btnPuntos = document.getElementById("btn-puntos");
    const listaPuntos = document.getElementById("lista-puntos");

    const dibujarPuntosEnMapa = (data) => {
        const mapState = window.evacuationMap;
        const map = mapState?.map;

        if (map && typeof L !== "undefined") {
            mapState.clearMarkers();

            const bounds = [];

            data.forEach((punto) => {
                const marker = L.marker([punto.latitud, punto.longitud]).addTo(map);
                marker.bindPopup(`
                    <strong>${punto.nombre}</strong><br>
                    ${punto.descripcion || "Punto de encuentro"}
                `);
                mapState.markers.push(marker);
                bounds.push([punto.latitud, punto.longitud]);
            });

            if (bounds.length) {
                map.fitBounds(bounds, { padding: [30, 30] });
            }
        }
    };

    const cargarPuntos = async () => {
        try {
            const response = await fetch(URL_JSON);
            const data = await response.json();

            if (!listaPuntos) return;
            listaPuntos.innerHTML = "";

            data.forEach((punto) => {
                const item = document.createElement("div");
                item.className = "punto-item";
                item.innerHTML = `
                    <strong>${punto.nombre}</strong><br>
                    ${punto.descripcion || ""}<br>
                    ${punto.latitud}, ${punto.longitud}
                `;
                listaPuntos.appendChild(item);
            });

            dibujarPuntosEnMapa(data);
        } catch (error) {
            console.error("Error cargando puntos:", error);
            if (listaPuntos) {
                listaPuntos.innerHTML = "<div class='punto-item'>No se pudieron cargar los puntos de encuentro.</div>";
            }
        }
    };

    btnPuntos?.addEventListener("click", cargarPuntos);
    cargarPuntos();
});