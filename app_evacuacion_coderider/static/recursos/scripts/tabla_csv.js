document.addEventListener("DOMContentLoaded", () => {
    const btnTabla = document.getElementById("btn-tabla");
    const contenedor = document.getElementById("tabla-container");

    btnTabla?.addEventListener("click", async () => {
        try {
            const response = await fetch(URL_CSV);
            const text = await response.text();

            const filas = text.trim().split("\n");
            if (!filas.length || !contenedor) return;

            const encabezados = filas[0].split(",");
            const filasDatos = filas.slice(1);

            const tabla = document.createElement("table");
            tabla.className = "tabla-csv";

            const thead = document.createElement("thead");
            thead.innerHTML = `<tr>${encabezados.map((h) => `<th>${h}</th>`).join("")}</tr>`;
            tabla.appendChild(thead);

            const tbody = document.createElement("tbody");
            filasDatos.forEach((fila) => {
                const celdas = fila.split(",");
                const tr = document.createElement("tr");
                tr.innerHTML = celdas.map((celda) => `<td>${celda}</td>`).join("");
                tbody.appendChild(tr);
            });
            tabla.appendChild(tbody);

            contenedor.innerHTML = "";
            contenedor.appendChild(tabla);
        } catch (error) {
            console.error("Error cargando CSV:", error);
        }
    });
});