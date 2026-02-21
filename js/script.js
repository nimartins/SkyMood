const apiKey = "SUA_API_KEY_AQUI";
let config = { lang: 'pt', unit: 'metric' };
let marker;

const countrySelect = document.getElementById("countrySelect");
const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const searchBtn = document.getElementById("searchBtn");
const myLocationBtn = document.getElementById("myLocationBtn");
const currentCard = document.getElementById("currentCard");
const forecastCards = document.getElementById("forecastCards");
const recentDiv = document.getElementById("recent");

const translations = {
    pt: {
        recent_title: "RECENTES", capitals_title: "CAPITAIS", settings_title: "CONFIGURAÇÕES",
        label_lang: "IDIOMA", label_unit: "UNIDADE", btn_save: "CONFIRMAR",
        welcome_msg: "SELECIONE UMA CIDADE", btn_location: "MINHA LOCALIZAÇÃO",
        btn_locating: "LOCALIZANDO...", select_country: "PAÍS", select_state: "UF/ESTADO",
        select_city: "CIDADE", error_location: "Erro ao obter localização."
    },
    en: {
        recent_title: "RECENT", capitals_title: "CAPITALS", settings_title: "SETTINGS",
        label_lang: "LANGUAGE", label_unit: "UNIT", btn_save: "CONFIRM",
        welcome_msg: "SELECT A CITY", btn_location: "MY LOCATION",
        btn_locating: "LOCATING...", select_country: "COUNTRY", select_state: "STATE",
        select_city: "CITY", error_location: "Error getting location."
    }
};

window.onload = () => {
    document.getElementById('configModal').classList.remove('hidden');
    loadCountries();
    renderRecent();
};

document.getElementById('saveConfig').onclick = () => {
    config.lang = document.getElementById('langSetting').value;
    config.unit = document.getElementById('unitSetting').value;
    updateTexts(); 
    document.getElementById('configModal').classList.add('hidden');
};

document.getElementById('configBtn').onclick = () => {
    document.getElementById('configModal').classList.remove('hidden');
};

function updateTexts() {
    const lang = config.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });
    countrySelect.options[0].textContent = translations[lang].select_country;
    stateSelect.options[0].textContent = translations[lang].select_state;
    myLocationBtn.textContent = translations[lang].btn_location;
    if (citySelect.disabled) citySelect.innerHTML = `<option>${translations[lang].select_city}</option>`;
}

async function loadCountries() {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");
    const data = await res.json();
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    countrySelect.innerHTML = `<option value="">${translations[config.lang].select_country}</option>`;
    data.forEach(c => {
        const option = document.createElement("option");
        option.value = c.cca2;
        option.textContent = c.name.common;
        countrySelect.appendChild(option);
    });
}

countrySelect.onchange = async () => {
    const code = countrySelect.value;
    const name = countrySelect.options[countrySelect.selectedIndex].text;
    if (!code) return;

    stateSelect.disabled = false;
    stateSelect.innerHTML = `<option value="">${translations[config.lang].select_state}</option>`;
    citySelect.disabled = true;

    if (code === "BR") {
        const res = await fetch("https://brasilapi.com.br/api/ibge/uf/v1");
        const states = await res.json();
        states.forEach(s => stateSelect.innerHTML += `<option value="${s.sigla}">${s.sigla}</option>`);
    } else {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ country: name })
        });
        const data = await res.json();
        if (!data.error) data.data.states.forEach(s => {
            stateSelect.innerHTML += `<option value="${s.name}">${s.name}</option>`;
        });
    }
};

stateSelect.onchange = async () => {
    const state = stateSelect.value;
    const countryCode = countrySelect.value;
    const countryName = countrySelect.options[countrySelect.selectedIndex].text;
    if (!state) return;

    citySelect.disabled = false;
    citySelect.innerHTML = `<option value="">${translations[config.lang].select_city}</option>`;

    if (countryCode === "BR") {
        const res = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${state}`);
        const cities = await res.json();
        cities.forEach(c => citySelect.innerHTML += `<option value="${c.nome}">${c.nome}</option>`);
    } else {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ country: countryName, state: state })
        });
        const data = await res.json();
        if (!data.error) data.data.forEach(c => citySelect.innerHTML += `<option value="${c}">${c}</option>`);
    }
};

function getSearchValue() {
    if (citySelect.value) {
        return citySelect.value;
    }
    if (stateSelect.value) {
        return stateSelect.value;
    }
    if (countrySelect.value) {
        return countrySelect.options[countrySelect.selectedIndex].text;
    }
    return null;
}

searchBtn.onclick = () => {

    if (!countrySelect.value) {
        alert("Selecione pelo menos um país.");
        return;
    }

    const query = getSearchValue();

    if (!query) {
        alert("Selecione uma cidade, estado ou país.");
        return;
    }

    fetchWeather(query, countrySelect.value);
};

async function fetchWeather(city, code) {
    const lupa = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
    const loader = `<svg class="spinning" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;

    searchBtn.innerHTML = loader;
    searchBtn.disabled = true;

    try {
        const langAPI = config.lang === 'pt' ? 'pt_br' : 'en';
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}${code ? ',' + code : ''}&appid=${apiKey}&units=${config.unit}&lang=${langAPI}`);
        const data = await res.json();
        
        if (data.cod === "200") {
            renderWeather(data);
            saveRecent(city);
        } else {
            handleError(data.message);
        }
    } catch (e) {
        console.error("Erro na busca:", e);
    } finally {
        searchBtn.innerHTML = lupa;
        searchBtn.disabled = false;
    }
}

function handleError(message) {

    let msg = "Erro ao buscar clima.";

    if (message) {
        if (message.includes("city not found")) {
            msg = "Local não encontrado.";
        }
        if (message.includes("Nothing to geocode")) {
            msg = "Selecione pelo menos um país.";
        }
        if (message.includes("Invalid API key")) {
            msg = "Chave da API inválida.";
        }
    }

    alert(msg);

    clearSelections();
}

function clearSelections() {

    countrySelect.value = "";
    stateSelect.innerHTML = `<option value="">${translations[config.lang].select_state}</option>`;
    citySelect.innerHTML = `<option value="">${translations[config.lang].select_city}</option>`;

    stateSelect.disabled = true;
    citySelect.disabled = true;

    searchBtn.disabled = true;
}

async function fetchWeatherCoords(lat, lon) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${config.unit}&lang=${config.lang === 'pt' ? 'pt_br' : 'en'}`);
        const data = await res.json();
        if (data.cod === "200") {
            renderWeather(data);
            saveRecent(data.city.name);
        }
    } catch (e) { 
        console.error("Erro na busca:", e);
        handleError(); 
    }
}

myLocationBtn.onclick = () => {
    const originalText = myLocationBtn.textContent;
    myLocationBtn.textContent = translations[config.lang].btn_locating;
    myLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            await fetchWeatherCoords(pos.coords.latitude, pos.coords.longitude);
            myLocationBtn.textContent = originalText;
            myLocationBtn.disabled = false;
        },
        () => {
            alert(translations[config.lang].error_location);
            myLocationBtn.textContent = originalText;
            myLocationBtn.disabled = false;
        }
    );
};

function renderWeather(data) {
    const current = data.list[0];
    const iconCode = current.weather[0].icon;
    const unitSymbol = config.unit === 'metric' ? '°C' : '°F';

    const favicon = document.getElementById("favicon");
    favicon.href = `https://openweathermap.org/img/wn/${iconCode}.png`;
    
    currentCard.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png" style="width:120px">
        <h2 style="font-size: 1.5rem;">${data.city.name}</h2>
        <h1 style="font-size: 4.5rem; font-weight: 800;">${Math.round(current.main.temp)}${unitSymbol}</h1>
        <p style="text-transform: capitalize; font-size: 1.1rem; opacity: 0.8;">${current.weather[0].description}</p>
    `;
    forecastCards.innerHTML = "";
    data.list.filter(i => i.dt_txt.includes("12:00:00")).forEach(d => {
        const date = new Date(d.dt_txt).toLocaleDateString(config.lang === 'pt' ? 'pt-BR' : 'en-US', {weekday: 'short'});
        forecastCards.innerHTML += `<div class="mini-card"><span>${date}</span><img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png"><p>${Math.round(d.main.temp)}${unitSymbol}</p></div>`;
    });
    const {lat, lon} = data.city.coord;
    map.setView([lat, lon], 11);
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon]).addTo(map);
}

function saveRecent(city) {
    let r = JSON.parse(localStorage.getItem("recent")) || [];
    if (!r.includes(city)) { r.unshift(city); if (r.length > 5) r.pop(); localStorage.setItem("recent", JSON.stringify(r)); }
    renderRecent();
}

function renderRecent() {
    recentDiv.innerHTML = "";
    (JSON.parse(localStorage.getItem("recent")) || []).forEach(c => {
        const btn = document.createElement("button");
        btn.className = "list-item"; btn.textContent = c.toUpperCase();
        btn.onclick = () => fetchWeather(c, "");
        recentDiv.appendChild(btn);
    });
}

function quickSearch(city, code) {
    fetchWeather(city, code);
}

const map = L.map('map', { zoomControl: false }).setView([-15, -47], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);