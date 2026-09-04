const formulario = document.getElementById("formIncidencia");
const lista = document.getElementById("listaIncidencias");

const contadorTotal = document.getElementById("contadorTotal");
const contadorPendientes = document.getElementById("contadorPendientes");
const contadorProceso = document.getElementById("contadorProceso");
const contadorResueltas = document.getElementById("contadorResueltas");

const botonBorrar = document.getElementById("botonBorrar");

let incidencias =
    JSON.parse(localStorage.getItem("incidenciasHotel")) || [];

function guardarIncidencias() {

    localStorage.setItem(
        "incidenciasHotel",
        JSON.stringify(incidencias)
    );

}

function crearFolio() {

    const numero =
        Date.now().toString().slice(-6);

    return "INC-" + numero;

}

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const area =
        document.getElementById("area").value.trim();

    const departamento =
        document.getElementById("departamento").value;

    const prioridad =
        document.getElementById("prioridad").value;

    const reportado =
        document.getElementById("reportado").value.trim();

    const problema =
        document.getElementById("problema").value.trim();

    const ahora = new Date();

    const nuevaIncidencia = {

        id: crearFolio(),

        area: area,

        departamento: departamento,

        prioridad: prioridad,

        reportado: reportado,

        problema: problema,

        estado: "Pendiente",

        fecha: ahora.toLocaleDateString(),

        hora: ahora.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })

    };

    incidencias.unshift(nuevaIncidencia);

    guardarIncidencias();

    mostrarIncidencias();

    formulario.reset();

});

function mostrarIncidencias() {

    lista.innerHTML = "";

    if (incidencias.length === 0) {

        lista.innerHTML = `
            <div class="sin-incidencias">
                <h3>No hay incidencias registradas</h3>
                <p>Los nuevos reportes aparecerán aquí.</p>
            </div>
        `;

        actualizarContadores();
        return;
    }

    incidencias.forEach(function(incidencia) {

        let iconoPrioridad = "🟢";

        if (incidencia.prioridad === "Alta") {
            iconoPrioridad = "🔴";
        }

        if (incidencia.prioridad === "Media") {
            iconoPrioridad = "🟡";
        }

        const tarjeta =
            document.createElement("div");

        tarjeta.className = "incidencia";

        tarjeta.innerHTML = `
            <div class="incidencia-superior">

                <div>
                    <span class="folio">
                        ${incidencia.id}
                    </span>

                    <h3>
                        ${incidencia.area}
                    </h3>
                </div>

                <strong>
                    ${iconoPrioridad}
                    ${incidencia.prioridad}
                </strong>

            </div>

            <div class="detalles">

                <p>
                    <strong>Problema:</strong>
                    ${incidencia.problema}
                </p>

                <p>
                    <strong>Departamento:</strong>
                    ${incidencia.departamento}
                </p>

                <p>
                    <strong>Reportado por:</strong>
                    ${incidencia.reportado}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    ${incidencia.fecha}
                    -
                    ${incidencia.hora}
                </p>

                <span class="estado">
                    ${incidencia.estado}
                </span>

            </div>

            <div class="acciones">

                <button
                    class="btn-proceso"
                    onclick="cambiarEstado('${incidencia.id}', 'En proceso')"
                >
                    En proceso
                </button>

                <button
                    class="btn-resolver"
                    onclick="cambiarEstado('${incidencia.id}', 'Resuelta')"
                >
                    Resolver
                </button>

                <button
                    class="btn-eliminar"
                    onclick="eliminarIncidencia('${incidencia.id}')"
                >
                    Eliminar
                </button>

            </div>
        `;

        lista.appendChild(tarjeta);

    });

    actualizarContadores();

}

function cambiarEstado(id, nuevoEstado) {

    const incidencia = incidencias.find(
        function(elemento) {
            return elemento.id === id;
        }
    );

    if (incidencia) {

        incidencia.estado = nuevoEstado;

        guardarIncidencias();

        mostrarIncidencias();

    }

}

function eliminarIncidencia(id) {

    const confirmar = confirm(
        "¿Deseas eliminar esta incidencia?"
    );

    if (!confirmar) {
        return;
    }

    incidencias = incidencias.filter(
        function(elemento) {
            return elemento.id !== id;
        }
    );

    guardarIncidencias();

    mostrarIncidencias();

}

botonBorrar.addEventListener("click", function() {

    if (incidencias.length === 0) {

        alert("No existen incidencias para borrar.");
        return;

    }

    const confirmar = confirm(
        "¿Seguro que deseas borrar todas las incidencias?"
    );

    if (!confirmar) {
        return;
    }

    incidencias = [];

    guardarIncidencias();

    mostrarIncidencias();

});

function actualizarContadores() {

    contadorTotal.textContent =
        incidencias.length;

    contadorPendientes.textContent =
        incidencias.filter(
            incidencia =>
                incidencia.estado === "Pendiente"
        ).length;

    contadorProceso.textContent =
        incidencias.filter(
            incidencia =>
                incidencia.estado === "En proceso"
        ).length;

    contadorResueltas.textContent =
        incidencias.filter(
            incidencia =>
                incidencia.estado === "Resuelta"
        ).length;

}

mostrarIncidencias();