
// =====================================
// PATO.exe - SISTEMA DE CONTROL
// =====================================

// CONFIGURACIÓ

// Desembre és el mes 11 en JavaScript
const dataInici = new Date(2026, 11, 1, 0, 0, 0);

// Canviar a false abans de publicar
const modeProva = false;

// =====================================
// BASE DE DADES D'INTRUSOS
// =====================================

const intrusos = {

    // DAY_01
    "865": { dia: 1, nivell: 1 },
    "939": { dia: 1, nivell: 2 },
    "010": { dia: 1, nivell: 3 },
    "323": { dia: 1, nivell: 0 },

    // DAY_02
    "464": { dia: 2, nivell: 1 },
    "575": { dia: 2, nivell: 2 },
    "251": { dia: 2, nivell: 1 },
    "965": { dia: 2, nivell: 3 },
    "038": { dia: 2, nivell: 0 },
    "534": { dia: 2, nivell: 2 },

    // DAY_03
    "407": { dia: 3, nivell: 0 },
    "186": { dia: 3, nivell: 3 },
    "685": { dia: 3, nivell: 1 },

    // DAY_04
    "492": { dia: 4, nivell: 2 },
    "784": { dia: 4, nivell: 0 },
    "999": { dia: 4, nivell: 3 },
    "127": { dia: 4, nivell: 1 },

    // DAY_05
    "305": { dia: 5, nivell: 1 },
    "640": { dia: 5, nivell: 2 },
    "863": { dia: 5, nivell: 0 },

    // DAY_06
    "770": { dia: 6, nivell: 3 },
    "056": { dia: 6, nivell: 1 },
    "892": { dia: 6, nivell: 2 },
    "627": { dia: 6, nivell: 0 },
    "924": { dia: 6, nivell: 1 },

    // DAY_07
    "872": { dia: 7, nivell: 2 },
    "650": { dia: 7, nivell: 3 },

    // DAY_08
    "775": { dia: 8, nivell: 0 },
    "319": { dia: 8, nivell: 1 }
};

// Noms dels nivells de classificació

const nomsNivells = {
    0: "PENDENT DE CLASSIFICAR",
    1: "QUARANTENA",
    2: "AÏLLAMENT",
    3: "ANOMALIA"
};

// =====================================
// EMMAGATZEMATGE DE DADES
// =====================================

// Separar les dades de prova de les dades reals

const clauCaptures = modeProva
    ? "capturesPATO_PROVA_V2"
    : "capturesPATO_REAL_V2";

const clauClassificacions = modeProva
    ? "classificacionsPATO_PROVA_V2"
    : "classificacionsPATO_REAL_V2";

const clauHistorial = modeProva
    ? "historialPATO_PROVA_V2"
    : "historialPATO_REAL_V2";

// Recuperar les dades guardades

let captures = JSON.parse(
    localStorage.getItem(clauCaptures)
) || [];

let classificacions = JSON.parse(
    localStorage.getItem(clauClassificacions)
) || {};

let historial = JSON.parse(
    localStorage.getItem(clauHistorial)
) || [];

// Pantalla que està oberta

let pantallaActual = "pantalla-inici";

// =====================================
// GUARDAR DADES
// =====================================

function guardarDades() {

    localStorage.setItem(
        clauCaptures,
        JSON.stringify(captures)
    );

    localStorage.setItem(
        clauClassificacions,
        JSON.stringify(classificacions)
    );

    localStorage.setItem(
        clauHistorial,
        JSON.stringify(historial)
    );
}

// =====================================
// CANVI DE PANTALLES
// =====================================

function mostrarPantalla(nomPantalla) {

    // Impedir l'accés abans de l'activació
    // quan el programa està en mode real

    if (!modeProva && new Date() < dataInici) {
        nomPantalla = "pantalla-inici";
    }

    // Ocultar totes les pantalles

    document.querySelectorAll("main > section").forEach(
        function(pantalla) {
            pantalla.classList.add("oculta");
        }
    );

    // Mostrar la pantalla seleccionada

    document.getElementById(nomPantalla)
        .classList.remove("oculta");

    pantallaActual = nomPantalla;

    actualitzarCaptures();
}

// =====================================
// COMPTE ARRERE
// =====================================

function actualitzarCompteEnrere() {

    const ara = new Date();
    const diferencia = dataInici - ara;

    // Quan arriba l'1 de desembre

    if (diferencia <= 0) {

        if (pantallaActual === "pantalla-inici") {
            mostrarPantalla("pantalla-menu");
        }

        return;
    }

    const dies = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    );

    const hores = Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
    );

    const minuts = Math.floor(
        (diferencia / (1000 * 60)) % 60
    );

    const segons = Math.floor(
        (diferencia / 1000) % 60
    );

    document.getElementById("dies").textContent =
        String(dies).padStart(2, "0");

    document.getElementById("hores").textContent =
        String(hores).padStart(2, "0");

    document.getElementById("minuts").textContent =
        String(minuts).padStart(2, "0");

    document.getElementById("segons").textContent =
        String(segons).padStart(2, "0");
}

// =====================================
// COMPROVAR DATA D'ACTIVACIÓ
// =====================================

function intrusDisponible(codi) {

    // En mode de proves tots estan disponibles

    if (modeProva) {
        return true;
    }

    // Data d'activació de l'intrús

    const dataActivacio = new Date(
        2026,
        11,
        intrusos[codi].dia,
        0,
        0,
        0
    );

    return new Date() >= dataActivacio;
}

// =====================================
// CONSULTAR CLASSIFICACIÓ ACTUAL
// =====================================

function obtenirNivell(codi) {

    // Si l'intrús ha sigut classificat o reclassificat

    if (Object.prototype.hasOwnProperty.call(
        classificacions, codi
    )) {
        return classificacions[codi];
    }

    // Si encara conserva la classificació inicial

    return intrusos[codi].nivell;
}

// =====================================
// REGISTRE D'INTRUSOS
// =====================================

function verificarIntrus() {

    const camp = document.getElementById("codi-intrus");
    const codi = camp.value.trim();

    const resultat = document.getElementById(
        "resultat-registre"
    );

    // Comprovar que el sistema està actiu

    if (!modeProva && new Date() < dataInici) {

        resultat.textContent =
            "ERROR: SISTEMA ENCARA NO ACTIVAT";

        return;
    }

    // Comprovar que el codi té tres xifres

    if (!/^\d{3}$/.test(codi)) {

        resultat.textContent =
            "ERROR: INTRODUEIX UN IDENTIFICADOR DE 3 XIFRES";

        return;
    }

    // Comprovar si l'intrús existix

    if (!Object.prototype.hasOwnProperty.call(
        intrusos, codi
    )) {

        resultat.textContent =
            "ERROR: IDENTIFICADOR DESCONEGUT";

        return;
    }

    // Comprovar si pertany a una missió activa

    if (!intrusDisponible(codi)) {

        resultat.textContent =
            "WARNING: INTRÚS NO AUTORITZAT. " +
            "DEIXA'L EXACTAMENT ON L'HAS TROBAT.";

        return;
    }

    // Comprovar duplicats

    if (captures.includes(codi)) {

        resultat.textContent =
            "WARNING: INTRÚS JA REGISTRAT";

        return;
    }

    // Guardar la captura

    captures.push(codi);

    // Assignar classificació inicial

    const nivell = intrusos[codi].nivell;

    classificacions[codi] = nivell;

    // Registrar la captura en l'historial

    historial.push({
        codi: codi,
        accio: "CAPTURA",
        data: new Date().toISOString(),
        nivellAnterior: null,
        nivellNou: nivell
    });

    guardarDades();

    // Mostrar les instruccions de classificació

    if (nivell === 0) {

        resultat.textContent =
            "CAPTURA VALIDADA. " +
            "CLASSIFICACIÓ BLOQUEJADA. " +
            "CONSERVA L'INTRÚS PENDENT D'INSTRUCCIONS.";

    } else {

        resultat.textContent =
            "CAPTURA VALIDADA. DESTINACIÓ: " +
            nomsNivells[nivell] +
            " | NIVELL " + nivell;
    }

    actualitzarCaptures();

    camp.value = "";
}

// =====================================
// RECLASSIFICACIÓ D'INTRUSOS
// =====================================

function reclassificarIntrus(codi, nouNivell) {

    // Comprovar que l'intrús existix

    if (!Object.prototype.hasOwnProperty.call(
        intrusos, codi
    )) {
        return false;
    }

    // Comprovar que ja ha sigut capturat

    if (!captures.includes(codi)) {
        return false;
    }

    // Comprovar que el nivell és vàlid

    if (![0, 1, 2, 3].includes(nouNivell)) {
        return false;
    }

    const nivellAnterior = obtenirNivell(codi);

    // Evitar moviments innecessaris

    if (nivellAnterior === nouNivell) {
        return false;
    }

    // Assignar la nova classificació

    classificacions[codi] = nouNivell;

    // Registrar el moviment en l'historial

    historial.push({
        codi: codi,
        accio: "RECLASSIFICACIÓ",
        data: new Date().toISOString(),
        nivellAnterior: nivellAnterior,
        nivellNou: nouNivell
    });

    guardarDades();

    actualitzarCaptures();

    return true;
}

// =====================================
// CONTROL DE QUARANTENA
// =====================================

function actualitzarCaptures() {

    document.getElementById("total-registrats").textContent =
        "CAPTURES REGISTRADES: " + captures.length;

    let nivell1 = [];
    let nivell2 = [];
    let nivell3 = [];
    let pendents = [];

    captures.forEach(function(codi) {

        if (!Object.prototype.hasOwnProperty.call(
            intrusos, codi
        )) {
            return;
        }

        const nivell = obtenirNivell(codi);

        if (nivell === 1) {

            nivell1.push(codi);

        } else if (nivell === 2) {

            nivell2.push(codi);

        } else if (nivell === 3) {

            nivell3.push(codi);

        } else if (nivell === 0) {

            pendents.push(codi);
        }
    });

    document.getElementById("nivell-1").textContent =
        nivell1.length + " INTRUSOS | ID: " +
        (nivell1.join(", ") || "—");

    document.getElementById("nivell-2").textContent =
        nivell2.length + " INTRUSOS | ID: " +
        (nivell2.join(", ") || "—");

    document.getElementById("nivell-3").textContent =
        nivell3.length + " INTRUSOS | ID: " +
        (nivell3.join(", ") || "—");

    document.getElementById("nivell-0").textContent =
        pendents.length + " PENDENTS | ID: " +
        (pendents.join(", ") || "—");
}

// =====================================
// REINICIAR DADES DE PROVA
// =====================================

function reiniciarProves() {

    // No permetre reiniciar les captures reals

    if (!modeProva) {
        return;
    }

    captures = [];
    classificacions = {};
    historial = [];

    localStorage.removeItem(clauCaptures);
    localStorage.removeItem(clauClassificacions);
    localStorage.removeItem(clauHistorial);

    document.getElementById(
        "resultat-registre"
    ).textContent = "";

    document.getElementById(
        "codi-intrus"
    ).value = "";

    actualitzarCaptures();

    console.log("SYSTEM: DADES DE PROVA ELIMINADES");
}

// =====================================
// INICI DEL PROGRAMA
// =====================================

// Connectar el formulari amb JavaScript

document.getElementById("formulari-registre")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        verificarIntrus();
    });

// Ocultar els botons de prova en mode real

if (!modeProva) {

    const botoProva = document.getElementById("boto-prova");

    const botoTornar = document.getElementById(
        "boto-tornar-inici"
    );

    if (botoProva) {
        botoProva.style.display = "none";
    }

    if (botoTornar) {
        botoTornar.style.display = "none";
    }
}

// Mostrar la pantalla inicial adequada

if (new Date() >= dataInici) {

    mostrarPantalla("pantalla-menu");

} else {

    mostrarPantalla("pantalla-inici");
}

// Iniciar el rellotge

actualitzarCompteEnrere();

setInterval(actualitzarCompteEnrere, 1000);
