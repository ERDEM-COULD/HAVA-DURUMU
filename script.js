const apiKey = '106633e8345d4ea884983221252501'; // API Anahtarınız
const baseUrl = 'https://api.weatherapi.com/v1/';

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherTemp = document.getElementById("weather-temp");
const weatherDescription = document.getElementById("weather-description");
const windSpeed = document.getElementById("wind-speed");
const windDirection = document.getElementById("wind-direction");
const humidity = document.getElementById("humidity");
const hourlyData = document.getElementById("hourly-data");
const dailyData = document.getElementById("daily-data");
const errorMessage = document.getElementById("error-message");

searchBtn.addEventListener("click", getWeather);

function getWeather() {
  const city = cityInput.value.trim(); // Şehir adını al ve boşlukları temizle

  if (!city) {
    errorMessage.textContent = "Lütfen geçerli bir şehir adı girin.";
    return;
  }

  fetch(`${baseUrl}forecast.json?key=${apiKey}&q=${city}&days=7&lang=tr`)
    .then(response => response.json())
    .then(data => {
      console.log(data); // API yanıtını kontrol et
      if (data.error) {
        errorMessage.textContent = "Hava durumu alınamadı. Şehri kontrol edin.";
      } else {
        // Veriye güvenle erişim
        const temp = data.current.temp_c; // Sıcaklık
        const description = data.current.condition.text; // Hava durumu
        const windSpeedVal = data.current.wind_kph; // Rüzgar hızı
        const windDir = data.current.wind_dir; // Rüzgar yönü
        const humidityVal = data.current.humidity; // Nem oranı

        // Hava durumu bilgilerini güncelle
        weatherTemp.textContent = `${temp}°C`;
        weatherDescription.textContent = description;
        windSpeed.textContent = `Rüzgar Hızı: ${windSpeedVal} km/saat`;
        windDirection.textContent = `Rüzgar Yönü: ${windDir}`;
        humidity.textContent = `Nem: ${humidityVal}%`;

        // Günlük hava durumu (7 gün)
        let dailyHtml = '';
        if (data.forecast && data.forecast.forecastday) {
          data.forecast.forecastday.forEach((day, index) => {
            const dayDate = new Date(day.date).toLocaleDateString(); // Günün tarihi
            const dayTempMax = day.day.maxtemp_c; // En yüksek sıcaklık
            const dayTempMin = day.day.mintemp_c; // En düşük sıcaklık
            const iconUrl = day.day.condition.icon; // Günün hava durumu simgesi
            const iconAlt = day.day.condition.text; // Simge açıklaması

            // Bugün için özel etiket
            const isToday = index === 0 ? 'Bugün' : dayDate; // Bugün etiketi

            // Kıyafet önerisi ve aktivite uygunluğu
            let clothing = '';
            if (dayTempMax < 10) {
              clothing = 'Kalın kıyafetler, mont ve eldiven almanızı öneririz.';
            } else if (dayTempMax >= 10 && dayTempMax <= 20) {
              clothing = 'Orta kalınlıkta kıyafetler ve rahat bir ceket uygun olacaktır.';
            } else {
              clothing = 'Sıcak hava için hafif kıyafetler tercih edebilirsiniz.';
            }

            // Koşu, bisiklet, yürüyüş, piknik ve diğer aktiviteler
            let activitySuitability = '';
            if (dayTempMax > 10) {
              activitySuitability = `
                <ul class="activity-list">
                  <li>Koşu yapmak için uygun</li>
                  <li>Bisiklet sürmek için uygun</li>
                  <li>Yürüyüş yapmak için uygun</li>
                  <li>Piknik yapmak için uygun</li>
                  <li>Dışarıda kitap okumak için uygun</li>
                  <li>Arkadaşlarla buluşmak için uygun</li>
                </ul>
              `;
            } else {
              activitySuitability = `
                <ul class="activity-list">
                  <li>Koşu yapmak için uygun değil</li>
                  <li>Bisiklet sürmek için uygun değil</li>
                  <li>Yürüyüş yapmak için uygun</li>
                  <li>Piknik yapmak için uygun değil</li>
                  <li>Dışarıda kitap okumak için uygun değil</li>
                  <li>Arkadaşlarla buluşmak için uygun değil</li>
                </ul>
              `;
            }

            // Günlük hava durumu verisi
            dailyHtml += `
              <div class="daily-item">
                <h3>${isToday}</h3>
                <p>En Yüksek: ${dayTempMax}°C / En Düşük: ${dayTempMin}°C</p>
                <img src="https:${iconUrl}" alt="${iconAlt}" class="weather-icon">
                <p>${iconAlt}</p>
                <p><strong>Bugünün Kıyafet Önerisi:</strong> ${clothing}</p>
                <p><strong>Bugünün Aktiviteleri:</strong> ${activitySuitability}</p>
                
                <!-- Saatlik veriler burada gösterilecek -->
                <div class="hourly-section">
                  <h4>Saatlik Hava Durumu</h4>
                  <div class="hourly-data">
                    ${getHourlyData(day)}
                  </div>
                </div>
              </div>
            `;
          });
          dailyData.innerHTML = dailyHtml;
        } else {
          console.log('Günlük veriler mevcut değil!');
          dailyData.innerHTML = '<p>Veri bulunamadı.</p>';
        }
      }
    })
    .catch(error => {
      console.error("Hata:", error);
      errorMessage.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
    });
}

// Saatlik hava durumu fonksiyonu
function getHourlyData(day) {
  let hourlyHtml = '';
  if (day && day.hour) {
    day.hour.forEach(hour => {
      const hourTime = new Date(hour.time).getHours(); // Saat
      const hourTemp = hour.temp_c; // Saatlik sıcaklık
      const iconUrl = hour.condition.icon; // Hava durumu simgesi
      const iconAlt = hour.condition.text; // Simge açıklaması (örneğin: 'parçalı bulutlu')

      hourlyHtml += `
        <div class="hourly-item">
          <h5>${hourTime}:00</h5>
          <p>${hourTemp}°C</p>
          <img src="https:${iconUrl}" alt="${iconAlt}" class="weather-icon">
          <p>${iconAlt}</p>
        </div>
      `;
    });
  }
  return hourlyHtml;
}
