// 1. 填入你刚才申请的高德 Key
const API_KEY = '2c9a45cc08656d08428905b151b8529f'; 

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityNameDisplay = document.getElementById('city-name');
const tempDisplay = document.getElementById('temperature');
const weatherText = document.getElementById('weather-text');
const weatherIcon = document.getElementById('weather-icon');
const humidityDisplay = document.getElementById('humidity');
const windDisplay = document.getElementById('wind');
const feelsLikeDisplay = document.getElementById('feels-like');
const updateTimeDisplay = document.getElementById('update-time');
const forecastContainer = document.getElementById('forecast-container');

async function getWeather(cityName) {
    try {
        console.log(`📡 高德接口正在查询: ${cityName}`);
        
        // --- 第一步：获取实时天气 ---
        // 高德 API 允许直接传城市名（如：南京）
        const liveUrl = `https://restapi.amap.com/v3/weather/weatherInfo?city=${encodeURIComponent(cityName)}&key=${API_KEY}&extensions=base`;
        const liveRes = await fetch(liveUrl);
        const liveData = await liveRes.json();

        if (liveData.status !== "1" || liveData.lives.length === 0) {
            alert("找不到该城市，请尝试输入完整的城市名（如：南京市）");
            return;
        }

        const live = liveData.lives[0];

        // --- 第二步：获取预报天气 ---
        // 使用 live.adcode (城市行政代码) 再次查询，获取 4 天预报
        const forecastUrl = `https://restapi.amap.com/v3/weather/weatherInfo?city=${live.adcode}&key=${API_KEY}&extensions=all`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        // 渲染页面
        renderWeather(live);
        renderForecast(forecastData.forecasts[0].casts);

    } catch (error) {
        console.error("请求失败:", error);
        alert("网络请求失败，请检查 API Key 是否填写正确。");
    }
}

function renderWeather(data) {
    cityNameDisplay.textContent = data.city;
    tempDisplay.textContent = data.temperature;
    weatherText.textContent = data.weather;
    humidityDisplay.textContent = data.humidity + "%";
    // 高德不提供体感温度，我们用实时温度模拟一下，或者显示空气质量
    feelsLikeDisplay.textContent = (parseInt(data.temperature) - 1) + "°C"; 
    windDisplay.textContent = `${data.winddirection}风 ${data.windpower}级`;
    
    // 动态匹配天气图标
    updateWeatherIcon(data.weather);
    
    // 更新时间
    updateTimeDisplay.textContent = `更新时间：${data.reporttime.split(' ')[1]}`;
    
    // 动态切换背景
    changeBackground(data.weather);
}

function renderForecast(casts) {
    forecastContainer.innerHTML = "";
    // 高德返回未来 4 天，我们展示前 3 天
    casts.slice(1, 4).forEach(day => {
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <span>${day.date.slice(5)}</span>
            <span>${day.dayweather}</span>
            <span>${day.daytemp}° / ${day.nighttemp}°</span>
        `;
        forecastContainer.appendChild(item);
    });
}

// 简单的图标匹配逻辑
function updateWeatherIcon(condition) {
    // 根据文字包含的关键词切换 class
    if (condition.includes("雨")) weatherIcon.className = "qi-305-fill";
    else if (condition.includes("云")) weatherIcon.className = "qi-101-fill";
    else if (condition.includes("阴")) weatherIcon.className = "qi-104-fill";
    else weatherIcon.className = "qi-100-fill"; // 默认晴天
}

function changeBackground(condition) {
    document.body.className = "";
    if (condition.includes("雨")) document.body.classList.add("bg-rainy");
    else if (condition.includes("云") || condition.includes("阴")) document.body.classList.add("bg-cloudy");
    else document.body.classList.add("bg-clear");
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

// 初始加载默认显示南京（或者你的城市）
getWeather('南京市');