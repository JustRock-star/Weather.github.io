document.addEventListener('DOMContentLoaded', () => {
  // --- Firebase init ---
  let db = null;
  try {
    if (window.firebase && firebase.initializeApp) {
      const firebaseConfig = {};
      try { firebase.initializeApp(firebaseConfig); } catch(e){}
      if (firebase.database) db = firebase.database();
    }
  } catch (err) {
    console.warn('Firebase init error:', err);
  }

  // --- Helpers ---
  const getEl = id => document.getElementById(id);
  const safeOn = (id, ev, fn) => { const el = getEl(id); if (el) el.addEventListener(ev, fn); };
  const container = document.querySelector('.container') || document.createElement('div');

  // --- State ---
  let currentLanguage = 'en';
  let selectedRegion = 'Yerevan';

  // --- Regions with translations ---
  const regionsList = [
    { value: "Armavir", en: "Armavir", ru: "Армавирский", hy: "Արմավիրի" },
    { value: "Shirak", en: "Shirak", ru: "Ширакский", hy: "Շիրակի" },
    { value: "Aragatsotn", en: "Aragatsotn", ru: "Арагацотнский", hy: "Արագածոտնի" },
    { value: "Gegharkunik", en: "Gegharkunik", ru: "Гегаркуникский", hy: "Գեղարքունիքի" },
    { value: "Kotayk", en: "Kotayk", ru: "Котайкский", hy: "Կոտայքի" },
    { value: "Vayots Dzor", en: "Vayots Dzor", ru: "Вайоцдзорский", hy: "Վայոց Ձորի" },
    { value: "Ararat", en: "Ararat", ru: "Араратский", hy: "Արարատի" },
    { value: "Lori", en: "Lori", ru: "Лорийский", hy: "Լոռու" },
    { value: "Syunik", en: "Syunik", ru: "Сюникский", hy: "Սյունիքի" },
    { value: "Tavush", en: "Tavush", ru: "Тавушский", hy: "Տավուշի" },
    { value: "Yerevan", en: "Yerevan", ru: "Ереван", hy: "Երևան" }
  ];

  // --- Translations & weather codes ---
  const translations = {
    en: {
      countries: "Armenian Regions",
      language: "Language",
      account: "Account And Admin",
      footer: "ALL IS GOOD STUDIO ©",
      weatherTitle: "Hourly Weather Forecast",
      wind: "Wind Speed",
      humidity: "Humidity",
      rain: "Chance of Rain",
      selectRegion: "Select Armenian Region",
      selectLanguage: "Select Language",
      accountTitle: "Account",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      loginRegister: "Login / Register",
      cancel: "Cancel",
      apply: "Apply",
      registeredUsers: "Registered Users:",
      notAllRegions: "Not all regions are supported yet.",
      createdBy: "Created by Arman Grigoryan"
    },
    ru: {
      countries: "Регионы Армении",
      language: "Язык",
      account: "Аккаунт и Админ",
      footer: "ВСЁ ХОРОШО СТУДИЯ ©",
      weatherTitle: "Почасовой прогноз погоды",
      wind: "Скорость ветра",
      humidity: "Влажность",
      rain: "Вероятность дождя",
      selectRegion: "Выберите регион Армении",
      selectLanguage: "Выберите язык",
      accountTitle: "Аккаунт",
      emailPlaceholder: "Электронная почта",
      passwordPlaceholder: "Пароль",
      loginRegister: "Войти / Зарегистрироваться",
      cancel: "Отмена",
      apply: "Применить",
      registeredUsers: "Зарегистрированные пользователи:",
      notAllRegions: "Пока поддерживаются не все регионы.",
      createdBy: "Создано Арманом Григоряном"
    },
    hy: {
      countries: "Հայաստանի մարզեր",
      language: "Լեզու",
      account: "Հաշիվ և Ադմին",
      footer: "ԱՄԵՆ ԻՆՉ ԼԱՎ Է ՍՏՈՒԴԻԱ ©",
      weatherTitle: "Ժամային եղանակի կանխատեսում",
      wind: "Քամու արագություն",
      humidity: "Խոնավություն",
      rain: "Տեղումների հավանականություն",
      selectRegion: "Ընտրեք մարզը",
      selectLanguage: "Ընտրեք լեզուն",
      accountTitle: "Հաշիվ",
      emailPlaceholder: "Էլ. փոստ",
      passwordPlaceholder: "Գաղտնաբառ",
      loginRegister: "Մուտք / Գրանցում",
      cancel: "Չեղարկել",
      apply: "Կիրառել",
      registeredUsers: "Գրանցված օգտվողներ:",
      notAllRegions: "Դեռ բոլոր մարզերը չեն աջակցվում։",
      createdBy: "Ստեղծվել է Արման Գրիգորյանի կողմից"
    }
  };
  const weatherCodeTranslations = {
    1000: { en: "Clear", ru: "Ясно", hy: "Մաքուր" },
    1003: { en: "Partly cloudy", ru: "Переменная облачность", hy: "Մասամբ ամպամած" },
    1006: { en: "Cloudy", ru: "Облачно", hy: "Ամպամած" },
    1183: { en: "Light rain", ru: "Небольшой дождь", hy: "Թեթև անձրև" },
    1195: { en: "Heavy rain", ru: "Сильный дождь", hy: "Արագ անձրև" }
  };
  const translateConditionByCode = code => weatherCodeTranslations[code]?.[currentLanguage] || "Unknown";

  // --- Weather rendering ---
  function fetchWeather() {
    if (!container) return;
    const apiLang = (currentLanguage === 'hy') ? 'en' : currentLanguage;
    const regionApiMap = {
      Armavir: "Armavir",
      Shirak: "Gyumri",
      Aragatsotn: "Ashtarak",
      Gegharkunik: "Gavar",
      Kotayk: "Hrazdan",
      Vayots_Dzor: "Yeghegnadzor",
      Ararat: "Artashat",
      Lori: "Vanadzor",
      Syunik: "Kapan",
      Tavush: "Ijevan",
      Yerevan: "Yerevan"
    };
    const apiRegion = regionApiMap[selectedRegion.replace(' ', '_')] || selectedRegion;
    container.innerHTML = '<p>Loading weather...</p>';
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=bc2b6d561b0c4c919e1113322252904&q=${encodeURIComponent(apiRegion)}&days=1&aqi=no&alerts=no&lang=${apiLang}`)
      .then(r => r.json())
      .then(d => {
        if (!d || !d.forecast || !d.forecast.forecastday) {
          container.innerHTML = `<p>No weather data.</p>`;
          showRegionSupportNote();
          showCreatedBy();
          return;
        }
        renderHours(d.forecast.forecastday[0].hour);
        showRegionSupportNote();
        showCreatedBy();
      })
      .catch(err => { 
        console.error('Weather error', err); 
        container.innerHTML = `<p>Error loading weather data.</p>`;
        showRegionSupportNote();
        showCreatedBy();
      });
  }
  function renderHours(hours) {
    const t = translations[currentLanguage] || translations.en;
    const regionObj = regionsList.find(r => r.value === selectedRegion);
    const regionName = regionObj ? regionObj[currentLanguage] : selectedRegion;
    container.innerHTML = `<h2 class="title">${t.weatherTitle} (${regionName})</h2>`;
    const currentHour = new Date().getHours();
    hours.forEach(hour => {
      const timePart = (hour.time || '').split(' ')[1] || hour.time || '';
      const hourNum = parseInt((timePart.split(':')[0]) || -1, 10);
      const conditionText = translateConditionByCode(hour.condition?.code);
      const el = document.createElement('div');
      el.className = 'hour-forecast' + (hourNum === currentHour ? ' current-hour' : '');
      el.innerHTML = `
        <div class="forecast-time"><strong>${timePart}</strong></div>
        <div class="forecast-temp">${hour.temp_c}°C</div>
        <div class="forecast-condition">${conditionText}</div>
        <div class="forecast-details">
          <p>${t.wind}: ${hour.wind_kph} km/h</p>
          <p>${t.humidity}: ${hour.humidity}%</p>
          <p>${t.rain}: ${hour.chance_of_rain ?? hour.precip_mm ?? 0}%</p>
        </div>
        <img class="forecast-icon" src="${hour.condition?.icon || ''}" alt="${conditionText}">
      `;
      container.appendChild(el);
    });
  }

  // --- Regions select update ---
  function updateRegionsSelect() {
    const select = getEl('regionSelect');
    if (!select) return;
    select.innerHTML = '';
    regionsList.forEach(region => {
      const option = document.createElement('option');
      option.value = region.value;
      option.textContent = region[currentLanguage];
      select.appendChild(option);
    });
    select.value = selectedRegion;
  }

  // --- Placeholders and modal labels update ---
  function updatePlaceholders() {
    const t = translations[currentLanguage];
    const email = getEl('email');
    const password = getEl('password');
    const loginRegister = getEl('loginRegister');
    const accountTitle = getEl('accountTitle');
    const languageTitle = getEl('languageTitle');
    const regionTitle = getEl('regionTitle');
    const registeredUsers = getEl('registeredUsers');
    if (email) email.placeholder = t.emailPlaceholder;
    if (password) password.placeholder = t.passwordPlaceholder;
    if (loginRegister) loginRegister.textContent = t.loginRegister;
    document.querySelectorAll('.closeModal').forEach(btn => btn.textContent = t.cancel);
    document.querySelectorAll('.applyBtn').forEach(btn => btn.textContent = t.apply);
    if (accountTitle) accountTitle.textContent = t.accountTitle;
    if (languageTitle) languageTitle.textContent = t.selectLanguage;
    if (regionTitle) regionTitle.textContent = t.selectRegion;
    if (registeredUsers) registeredUsers.textContent = t.registeredUsers;
    showRegionSupportNote();
    showCreatedBy();
  }

  // --- Region support note ---
  function showRegionSupportNote() {
    let note = document.getElementById('regionSupportNote');
    if (!note) {
      note = document.createElement('div');
      note.id = 'regionSupportNote';
      note.style.fontSize = '12px';
      note.style.color = '#888';
      note.style.marginTop = '10px';
      note.style.textAlign = 'center';
      container.appendChild(note);
    }
    note.textContent = translations[currentLanguage].notAllRegions;
  }

  // --- Created by note ---
  function showCreatedBy() {
    let note = document.getElementById('createdByNote');
    if (!note) {
      note = document.createElement('div');
      note.id = 'createdByNote';
      note.style.fontSize = '12px';
      note.style.color = '#888';
      note.style.marginTop = '5px';
      note.style.textAlign = 'center';
      container.appendChild(note);
    }
    note.textContent = translations[currentLanguage].createdBy;
  }

  // --- Modal safe handlers ---
  document.querySelectorAll('.closeModal').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    const ul = getEl('usersList'); if (ul) ul.style.display = 'none';
  }));
  window.addEventListener('click', e => { if (e.target.classList?.contains('modal')) e.target.style.display = 'none'; });

  safeOn('languageBtn', 'click', e => { e?.preventDefault(); const m = getEl('languageModal'); if (m) m.style.display = 'block'; });
  safeOn('languageForm', 'submit', e => {
    e.preventDefault();
    const lang = e.target.language?.value;
    if (lang) currentLanguage = lang;
    applyLanguage(translations[currentLanguage] || translations.en);
    fetchWeather();
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  });

  safeOn('regionsBtn', 'click', e => { e?.preventDefault(); const m = getEl('regionsModal'); if (m) m.style.display = 'block'; });
  safeOn('applyRegion', 'click', () => {
    const sel = getEl('regionSelect'); if (sel) selectedRegion = sel.value;
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    fetchWeather();
  });

  safeOn('accountBtn', 'click', e => { e?.preventDefault(); const m = getEl('accountModal'); if (m) m.style.display = 'block'; const ul = getEl('usersList'); if (ul) ul.style.display = 'none'; });

  safeOn('accountForm', 'submit', async e => {
    e.preventDefault();
    const email = e.target.email?.value?.trim();
    const pass = e.target.password?.value;
    if (!email || !pass) { alert('Email and password required.'); return; }

    if (db) {
      try {
        await db.ref('users/' + encodeURIComponent(email)).set({ email, pass, createdAt: Date.now() });
      } catch (err) { console.error('Firebase write error', err); alert('Save error'); return; }
    } else {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const idx = users.findIndex(u => u.email === email);
      if (idx === -1) users.push({ email, pass, createdAt: Date.now() }); else users[idx].pass = pass;
      localStorage.setItem('users', JSON.stringify(users));
    }

    if (email === "arman.grigoryan.ithink@gmail.com" && pass === "Arman_2014") {
      showUsersList();
    } else {
      alert('Account saved (demo).');
      const am = getEl('accountModal'); if (am) am.style.display = 'none';
    }
  });

  async function showUsersList() {
    const usersUl = getEl('usersUl');
    if (!usersUl) { console.warn('#usersUl missing'); return; }
    usersUl.innerHTML = '';
    if (db) {
      try {
        const snapshot = await db.ref('users').once('value');
        const data = snapshot.val() || {};
        Object.values(data).forEach(u => {
          const li = document.createElement('li'); li.textContent = `Email: ${u.email}, Password: ${u.pass}`; usersUl.appendChild(li);
        });
      } catch (err) { console.error('Firebase read error', err); }
    } else {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.forEach(u => { const li = document.createElement('li'); li.textContent = `Email: ${u.email}, Password: ${u.pass}`; usersUl.appendChild(li); });
    }
    const ul = getEl('usersList'); if (ul) ul.style.display = 'block';
    const am = getEl('accountModal'); if (am) am.style.display = 'block';
  }

  function applyLanguage(labels) {
    const navLinks = document.querySelectorAll('nav ul li a');
    if (navLinks.length >= 3) {
      navLinks[0].textContent = labels.countries;
      navLinks[1].textContent = labels.language;
      navLinks[2].textContent = labels.account;
    }
    const fp = getEl('fp'); if (fp) fp.textContent = labels.footer;
    updateRegionsSelect();
    updatePlaceholders();
  }

  applyLanguage(translations[currentLanguage]);
  fetchWeather();
});
