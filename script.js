// Core data variables
let voltage_output = 12.8
let power_consumption = 4.9
let horizontal_position = 142
let vertical_position = 38
let light_intensity = 927

let historyData = []
let liveChartInstance = null
let datasetVisible = [true, true, true]

let alerts = [
    { id: 1, type: "warning", title: "Suboptimal light capture", message: "Light intensity dropped 23% in last 4 minutes", time: "2 min ago" },
    { id: 2, type: "info", title: "Tracker movement completed", message: "Panel successfully repositioned to 142° azimuth", time: "7 min ago" },
    { id: 3, type: "critical", title: "High motor consumption detected", message: "power_consumption exceeded 8 W threshold", time: "14 min ago" }
]

let dailyEnergyData = [0.9, 1.4, 2.1, 3.2, 4.8, 6.1, 7.3, 8.4]

function updateLiveUI() {
    document.getElementById("dash-voltage").textContent = voltage_output.toFixed(1) + " V"
    document.getElementById("dash-power").textContent = power_consumption.toFixed(1) + " W"
    document.getElementById("dash-light").textContent = Math.round(light_intensity) + " W/m²"
    
    const efficiency = Math.min(100, Math.round((voltage_output * light_intensity) / 1200 * 100))
    document.getElementById("dash-efficiency").textContent = efficiency + "%"
    
    const circumference = 94.2
    const offset = circumference * (1 - efficiency / 100)
    document.getElementById("efficiency-circle").setAttribute("stroke-dashoffset", offset)
    
    document.getElementById("live-voltage").textContent = voltage_output.toFixed(1)
    document.getElementById("live-power").textContent = power_consumption.toFixed(1)
    document.getElementById("live-light").textContent = Math.round(light_intensity)
    
    document.getElementById("live-horiz").textContent = Math.round(horizontal_position) + "°"
    document.getElementById("live-vert").textContent = Math.round(vertical_position) + "°"
    document.getElementById("live-horiz-big").textContent = Math.round(horizontal_position)
    document.getElementById("live-vert-big").textContent = Math.round(vertical_position)
    
    const panel = document.getElementById("panel-visual")
    const rotation = (horizontal_position % 180) - 90
    panel.style.transform = `rotate(${rotation}deg) perspective(800px) rotateX(${-vertical_position + 20}deg)`
}

function simulateIoTData() {
    voltage_output = Math.max(10.5, Math.min(14.5, voltage_output + (Math.random() * 0.6 - 0.3)))
    power_consumption = Math.max(2.5, Math.min(9.5, power_consumption + (Math.random() * 1.2 - 0.6)))
    
    const hour = new Date().getHours()
    light_intensity = Math.max(120, Math.min(1150, light_intensity + (Math.random() * 80 - 40)))
    if (hour < 6 || hour > 19) light_intensity = Math.max(80, light_intensity - 120)
    
    horizontal_position = Math.max(0, Math.min(180, horizontal_position + (Math.random() * 8 - 4)))
    vertical_position = Math.max(15, Math.min(85, vertical_position + (Math.random() * 5 - 2.5)))
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    historyData.unshift({
        time: timestamp,
        voltage: voltage_output.toFixed(1),
        power: power_consumption.toFixed(1),
        horiz: Math.round(horizontal_position),
        vert: Math.round(vertical_position),
        light: Math.round(light_intensity),
        efficiency: Math.min(100, Math.round((voltage_output * light_intensity) / 1200 * 100))
    })
    
    if (historyData.length > 30) historyData.pop()
    
    updateLiveUI()
    updateLiveChart()
    renderHistoryTable()
    checkAndUpdateAlerts()
}

function initializeLiveChart() {
    const ctx = document.getElementById("liveChart")
    liveChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(15).fill('').map((_, i) => `${i + 1}m`),
            datasets: [
                { label: 'Voltage (V)', data: Array(15).fill(12.8), borderColor: '#f59e0b', borderWidth: 3, tension: 0.3, fill: false },
                { label: 'Power (W)', data: Array(15).fill(4.9), borderColor: '#10b981', borderWidth: 3, tension: 0.3, fill: false },
                { label: 'Light Intensity (W/m²)', data: Array(15).fill(927), borderColor: '#0ea5e9', borderWidth: 3, tension: 0.3, fill: false, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#334155' }, ticks: { color: '#64748b' } },
                y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#64748b' } },
                x: { grid: { color: '#334155' }, ticks: { color: '#64748b' } }
            }
        }
    })
}

function updateLiveChart() {
    if (!liveChartInstance) return
    liveChartInstance.data.datasets[0].data.shift()
    liveChartInstance.data.datasets[0].data.push(voltage_output)
    liveChartInstance.data.datasets[1].data.shift()
    liveChartInstance.data.datasets[1].data.push(power_consumption)
    liveChartInstance.data.datasets[2].data.shift()
    liveChartInstance.data.datasets[2].data.push(light_intensity)
    liveChartInstance.update('none')
}

function toggleDataset(index) {
    datasetVisible[index] = !datasetVisible[index]
    liveChartInstance.data.datasets[index].hidden = !datasetVisible[index]
    liveChartInstance.update()
    const legends = [
        document.getElementById('legend-voltage'),
        document.getElementById('legend-power'),
        document.getElementById('legend-light')
    ]
    legends[index].style.opacity = datasetVisible[index] ? '1' : '0.4'
}

function renderHistoryTable() {
    const tbody = document.getElementById("history-body")
    tbody.innerHTML = ""
    historyData.forEach(row => {
        const tr = document.createElement("tr")
        tr.className = "border-b border-slate-700 last:border-0"
        tr.innerHTML = `
            <td class="py-4 px-6">${row.time}</td>
            <td class="text-right py-4 px-6">${row.voltage}</td>
            <td class="text-right py-4 px-6">${row.power}</td>
            <td class="text-right py-4 px-6">${row.horiz}°</td>
            <td class="text-right py-4 px-6">${row.vert}°</td>
            <td class="text-right py-4 px-6">${row.light}</td>
            <td class="text-right py-4 px-6 text-emerald-400">${row.efficiency}%</td>
        `
        tbody.appendChild(tr)
    })
    
    if (historyData.length === 0) {
        for (let i = 14; i >= 0; i--) {
            historyData.push({
                time: `${i + 1}m ago`,
                voltage: (12 + Math.random() * 2).toFixed(1),
                power: (4 + Math.random() * 3).toFixed(1),
                horiz: Math.round(120 + Math.random() * 60),
                vert: Math.round(30 + Math.random() * 30),
                light: Math.round(800 + Math.random() * 300),
                efficiency: Math.round(75 + Math.random() * 20)
            })
        }
        renderHistoryTable()
    }
}

function renderAlerts() {
    const container = document.getElementById("alerts-list")
    container.innerHTML = ""
    alerts.forEach(alert => {
        const colorMap = { critical: 'red', warning: 'amber', info: 'sky' }
        const iconMap = { critical: 'triangle-exclamation', warning: 'triangle-exclamation', info: 'circle-info' }
        const color = colorMap[alert.type] || 'sky'
        const icon = iconMap[alert.type] || 'circle-info'
        const div = document.createElement("div")
        div.className = `flex items-start gap-x-4 bg-slate-800 border border-slate-700 rounded-3xl p-6`
        div.innerHTML = `
            <i class="fa-solid fa-${icon} text-${color}-400 mt-0.5"></i>
            <div class="flex-1">
                <div class="flex justify-between">
                    <span class="font-semibold">${alert.title}</span>
                    <span class="text-xs text-slate-400">${alert.time}</span>
                </div>
                <p class="text-slate-300 mt-1">${alert.message}</p>
            </div>
            <button onclick="acknowledgeAlert(${alert.id})" 
                    class="text-xs bg-slate-700 hover:bg-slate-600 px-6 rounded-3xl h-8 flex-shrink-0">ACK</button>
        `
        container.appendChild(div)
    })
    document.getElementById("alert-badge").textContent = alerts.length
    document.getElementById("alert-count-badge").textContent = `${alerts.length} active`
}

function checkAndUpdateAlerts() {
    if (Math.random() > 0.92 && alerts.length < 5) {
        if (voltage_output < 11) {
            alerts.unshift({ id: Date.now(), type: "critical", title: "Low panel voltage", message: `voltage_output = ${voltage_output.toFixed(1)} V (below threshold)`, time: "just now" })
        } else if (power_consumption > 8) {
            alerts.unshift({ id: Date.now(), type: "warning", title: "Excessive motor consumption", message: `power_consumption = ${power_consumption.toFixed(1)} W`, time: "just now" })
        }
        renderAlerts()
    }
}

function acknowledgeAlert(id) {
    alerts = alerts.filter(a => a.id !== id)
    renderAlerts()
}

function renderDailyBarChart() {
    const ctx = document.getElementById("dailyBarChart")
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', 'Now'],
            datasets: [{ label: 'Energy (kWh)', data: dailyEnergyData, backgroundColor: '#f59e0b', borderRadius: 8, barThickness: 18 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { grid: { color: '#334155' }, ticks: { color: '#64748b' } }, x: { grid: { color: '#334155' }, ticks: { color: '#64748b' } } }
        }
    })
}

function renderEfficiencyChart() {
    const ctx = document.getElementById("efficiencyChart")
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ label: 'Efficiency %', data: [78, 81, 83, 79, 86, 84, 85], borderColor: '#10b981', borderWidth: 4, tension: 0.4, fill: false }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { min: 70, max: 90, grid: { color: '#334155' }, ticks: { color: '#64748b' } }, x: { ticks: { color: '#64748b' } } }
        }
    })
}

function navigateToSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'))
    document.getElementById(`section-${section}`).classList.remove('hidden')
}

let simulationInterval = null

function toggleSimulation() {
    const statusEl = document.getElementById("connection-status")
    if (simulationInterval) {
        clearInterval(simulationInterval)
        simulationInterval = null
        statusEl.innerHTML = `<span>⭕ PAUSED</span>`
        statusEl.className = "flex items-center gap-x-2 bg-slate-700 text-slate-300 text-xs font-medium px-4 h-9 rounded-3xl border border-slate-600 cursor-pointer"
    } else {
        simulationInterval = setInterval(simulateIoTData, 2000)
        statusEl.innerHTML = `<div class="w-2 h-2 bg-emerald-400 rounded-full live-dot"></div> LIVE • IoT Connected`
        statusEl.className = "flex items-center gap-x-2 bg-emerald-400/10 text-emerald-400 text-xs font-medium px-4 h-9 rounded-3xl border border-emerald-400/30 cursor-pointer"
        simulateIoTData()
    }
}

function simulateMalfunction() {
    voltage_output = 9.2
    power_consumption = 12.4
    light_intensity = 210
    simulateIoTData()
    alerts.unshift({ id: Date.now(), type: "critical", title: "⚠️ SYSTEM MALFUNCTION SIMULATED", message: "Low voltage + high motor draw detected. Check connections.", time: "just now" })
    renderAlerts()
    navigateToSection('alerts')
    alert("Malfunction injected! Check Alerts tab.")
}

function logout() {
    if (confirm("End session and return to login?")) window.location.reload()
}

function showDocumentation() {
    const modal = document.getElementById("doc-modal")
    modal.classList.remove("hidden")
    modal.classList.add("flex")
}

function hideDocumentation() {
    const modal = document.getElementById("doc-modal")
    modal.classList.add("hidden")
    modal.classList.remove("flex")
}

function launchSolarTrack() {
    initializeLiveChart()
    renderHistoryTable()
    renderAlerts()
    renderDailyBarChart()
    renderEfficiencyChart()
    simulationInterval = setInterval(simulateIoTData, 2000)
    setInterval(() => {
        const timeEl = document.getElementById("current-time")
        const now = new Date()
        timeEl.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + 
                             ' • ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    }, 60000)
    updateLiveUI()
}

window.onload = launchSolarTrack
