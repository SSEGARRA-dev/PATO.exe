
// =====================================
// PATO.exe - SISTEMA DE CONTROL
// =====================================

// CONFIGURACIÓ

// Desembre és el mes 11 en JavaScript
const dataInici = new Date(2026, 11, 1, 0, 0, 0);

// Canviar a false abans de publicar
const modeProva = true;

// Identificadors ficticis per a les proves
const intrusos = {
    "047": 1,
    "183": 3,
    "026": 0
};

// Recuperar captures guardades
let captures = JSON.parse(
    localStorage.getItem("capturesPATO")
) || [];

// Pantalla que està oberta
let pantallaActual = "pantalla-inici";


// =====================================
// CANVI DE PANTALLES
// =====================================

function mostrarPantalla(nomPantalla) {

    // Ocultar totes les pantalles
    document.querySelectorAll("main > section").forEach(
        function(pantalla) {
            pantalla.classList.add("oculta");
        }
    );

    // Mostrar la pantalla seleccionada
    document.getElementById(nomPantalla).classList.remove("oculta");

    pantallaActual = nomPantalla;

    // Actualitzar les dades visibles
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

        // Només canviar si està en la pantalla inicial
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
// REGISTRE D'INTRUSOS
// =====================================

function verificarIntrus() {

    const camp = document.getElementById("codi-intrus");
    const codi = camp.value.trim();
    const resultat = document.getElementById("resultat-registre");

    // Comprovar si existix
    if (!Object.prototype.hasOwnProperty.call(intrusos, codi)) {
        resultat.textContent =
            "ERROR: IDENTIFICADOR DESCONEGUT";
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

    localStorage.setItem(
        "capturesPATO",
        JSON.stringify(captures)
    );

    // Consultar el nivell
    const nivell = intrusos[codi];

    if (nivell === 0) {
        resultat.textContent =
            "CAPTURA VALIDADA. CLASSIFICACIÓ BLOQUEJADA. " +
            "CONSERVA L'INTRÚS PENDENT D'INSTRUCCIONS.";
    } else {
        resultat.textContent =
            "CAPTURA VALIDADA. DESTINACIÓ: NIVELL " + nivell;
    }

    // Actualitzar el comptador i els nivells
    actualitzarCaptures();

    // Buidar el camp
    camp.value = "";
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

        const nivell = intrusos[codi];

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
// INICI DEL PROGRAMA
// =====================================

// Connectar el formulari amb JavaScript
document.getElementById("formulari-registre").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
        verificarIntrus();
    }
);

// Ocultar els botons de prova en la versió definitiva
if (!modeProva) {
    document.getElementById("boto-prova").style.display = "none";
    document.getElementById("boto-tornar-inici").style.display = "none";
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
