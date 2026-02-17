# 🌦️ SkyMood | Your Personal Weather Atmosphere

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-4cc9f0?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-JS--Vanilla-gold?style=for-the-badge)
![UI](https://img.shields.io/badge/Design-Glassmorphism-a29bfe?style=for-the-badge)

**SkyMood** é um dashboard meteorológico imersivo que combina dados precisos com uma interface elegante baseada em transparências e efeitos de desfoque. O projeto foi desenhado para que a interface reflita a atmosfera do clima através de um design fluido e responsivo.

---

## 🚀 Funcionalidades Principais

* **🌍 Seleção Global Inteligente:** Sistema de busca em cascata (País > Estado > Cidade) integrado para cobrir localidades de todos os continentes.
* **📍 Localização em Tempo Real:** Sincronização via Geolocalização nativa para entrega instantânea das condições locais.
* **🗺️ Mapa Interativo:** Visualização espacial integrada com **Leaflet.js** para acompanhamento geográfico preciso.
* **🌡️ Previsão de 5 Dias:** Cards detalhados com a evolução climática e ícones dinâmicos para a semana.
* **🎨 Favicon & Título Dinâmicos:** A aba do navegador (ícone e título) se adapta ao clima atual, mantendo a informação visível mesmo em segundo plano.
* **⚙️ Customização Total:** Suporte a idiomas (PT/EN) e unidades (Celsius/Fahrenheit) persistidos via LocalStorage.

---

## 🛠️ Tecnologias e Integrações

O **SkyMood** utiliza tecnologias modernas de desenvolvimento Web:

* **Lógica:** JavaScript ES6+ (Async/Await e Fetch API).
* **Estilo:** CSS3 moderno com variáveis nativas e filtros de **Glassmorphism**.
* **Mapas:** [Leaflet.js](https://leafletjs.com/).
* **Dados de Clima:** [OpenWeather API](https://openweathermap.org/api).
* **Dados Geográficos:** [Rest Countries](https://restcountries.com/) & [CountriesNow API](https://countriesnow.space/).

---

## 🎨 Estrutura de Design

* **Glassmorphism:** Uso estratégico de `backdrop-filter: blur(20px)` para criar profundidade e sofisticação.
* **Layout Fluido:** Controles de busca com largura percentual rígida, evitando que nomes longos de cidades quebrem a interface.
* **Experiência do Usuário:** Botões com feedback visual de carregamento e transições suaves.

---

## ⚙️ Como Instalar e Rodar

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/skymood.git](https://github.com/seu-usuario/skymood.git)
    ```
2.  **Configuração da API:**
    Abra o arquivo `js/script.js` e insira sua API Key do OpenWeather:
    ```javascript
    const apiKey = "SUA_API_KEY_AQUI";
    ```
3.  **Execução:**
    Basta abrir o `index.html` em seu navegador.

---

## 📁 Estrutura do Projeto

```text
SkyMood/
├── index.html          # Estrutura principal
├── css/
│   └── style.css       # Estilização e Glassmorphism
├── js/
│   └── script.js      # Lógica, APIs e Tradução
└── README.md           # Documentação
