const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");
const result = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

// API gratuita
const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

// Nombres de monedas
let currencyNames = {};

async function loadCurrencies() {

    // 1. Cargar nombres desde el JSON (RUTA CORRECTA)
    const namesRes = await fetch("./javaScript/divisas.json");
    currencyNames = await namesRes.json();

    // 2. Cargar tasas desde la API
    const res = await fetch(API_URL);
    const data = await res.json();
    const currencies = Object.keys(data.rates);

    // 3. Rellenar selects
    currencies.forEach(currency => {
const info = currencyNames[currency];
const label = info ? `${currency} – ${info.pais}` : `${currency} – País desconocido`;


        fromCurrency.innerHTML += `<option value="${currency}">${label}</option>`;
        toCurrency.innerHTML += `<option value="${currency}">${label}</option>`;
    });

    // Valores por defecto
    fromCurrency.value = "EUR";
    toCurrency.value = "USD";
}
loadCurrencies();
// Convertir divisas
convertBtn.addEventListener("click", async () => {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
    const data = await res.json();

    const rate = data.rates[toCurrency.value];
    const total = (amount.value * rate).toFixed(2);

    result.textContent = `${amount.value} ${fromCurrency.value} = ${total} ${toCurrency.value}`;
});
