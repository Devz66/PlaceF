// Initialize map
let map;
let marker;
let trackingInterval;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupSidebar();
});

function initMap() {
    // Default location (São Paulo, Brazil)
    const defaultLat = -23.550520;
    const defaultLng = -46.633308;

    map = L.map('map').setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add initial marker
    marker = L.marker([defaultLat, defaultLng]).addTo(map)
        .bindPopup('Veículo 1 - Parado')
        .openPopup();
}

function setupSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function startTracking() {
    const btn = document.querySelector('.stat-card');
    const icon = btn.querySelector('i');
    const text = btn.querySelector('.stat-details h6');
    const status = btn.querySelector('.stat-details small');
    
    if (trackingInterval) {
        // Stop tracking
        clearInterval(trackingInterval);
        trackingInterval = null;
        icon.className = 'fas fa-play';
        text.textContent = 'Novo Rastreio';
        status.textContent = 'Iniciar viagem';
        alert('Rastreamento finalizado!');
    } else {
        // Start tracking simulation
        icon.className = 'fas fa-stop';
        text.textContent = 'Parar Rastreio';
        status.textContent = 'Em movimento...';
        
        alert('Rastreamento iniciado! (Simulação)');
        
        // Simulate movement
        let lat = -23.550520;
        let lng = -46.633308;
        
        trackingInterval = setInterval(() => {
            lat += (Math.random() - 0.5) * 0.001;
            lng += (Math.random() - 0.5) * 0.001;
            
            const newPos = [lat, lng];
            marker.setLatLng(newPos);
            map.panTo(newPos);
            
            // Update speed randomly
            const speed = Math.floor(Math.random() * 60) + 20;
            document.querySelector('.bg-warning').parentElement.querySelector('.value').textContent = `${speed} km/h`;
            
            // Update distance (fake increment)
            const currentDist = parseFloat(document.querySelector('.bg-success').parentElement.querySelector('.value').textContent);
            document.querySelector('.bg-success').parentElement.querySelector('.value').textContent = `${(currentDist + 0.1).toFixed(1)} km`;
            
        }, 2000);
    }
}
