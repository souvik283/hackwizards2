// Simulated database data (in a real app, this would come from an API)
// const wasteReports = [
//     {
//         id: 1,
//         username: "Geeta Bhawan",
//         datetime: "2025-03-10T08:30:00",
//         location: "Central Park, NY",
//         coordinates: { lat: 22.473629, lng: 88.417500 },
//         imageUrl: "/api/placeholder/400/300",
//         description: "Large pile of plastic waste near the south entrance. Requires immediate attention."
//     },
//     {
//         id: 2,
//         username: "green_warrior",
//         datetime: "2025-03-10T10:15:00",
//         location: "Harbor Beach, CA",
//         coordinates: { lat: 34.0522, lng: -118.2437 },
//         imageUrl: "/api/placeholder/400/300",
//         description: "Scattered trash after weekend event. Several recyclable items mixed with general waste."
//     },
//     {
//         id: 3,
//         username: "planet_protector",
//         datetime: "2025-03-11T09:45:00",
//         location: "Riverside Park, TX",
//         coordinates: { lat: 29.7604, lng: -95.3698 },
//         imageUrl: "/api/placeholder/400/300",
//         description: "Overflow of community dumpster with hazardous waste. Needs specialized handling."
//     },
//     {
//         id: 4,
//         username: "earth_keeper",
//         datetime: "2025-03-11T11:20:00",
//         location: "Lake View Trail, WA",
//         coordinates: { lat: 47.6062, lng: -122.3321 },
//         imageUrl: "/api/placeholder/400/300",
//         description: "Construction debris dumped illegally. Large volume, requires heavy equipment."
//     },
//     {
//         id: 5,
//         username: "clean_city",
//         datetime: "2025-03-11T14:50:00",
//         location: "Downtown Metro, IL",
//         coordinates: { lat: 41.8781, lng: -87.6298 },
//         imageUrl: "/api/placeholder/400/300",
//         description: "Overflowing public trash bins in high-traffic area. Weekend rush caused buildup."
//     }
// ];

const SUPABASE_URL = "https://qitewsgbwhvayhhlcqud.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdGV3c2did2h2YXloaGxjcXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNTM2NTIsImV4cCI6MjA3MjYyOTY1Mn0.zeBbI8MENQTrkxzwG4GKXvHQ8SOUt4qBDxsSCw7iBEU";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const { data, error } = await supabaseClient
        .from("Argha")
        .select("*")

    if (error) {
        console.error("Failed to fetch:", error);
        return;
    }

    // Create an array from the rows
    const wasteReports = data.map((row) => ({
        id: row.id,
        description: row.des,
        location: row.loc,
        url: row.img_url,
        date: row.date
    }));

    console.log("Array created:", wasteReports);



    //   if (myArray.length > 0) {
    //     console.log("First item description:", myArray[0].description);
    //   }


    await renderTable(wasteReports);
    // initMap();
    // setupEventListeners();


});



// DOM Elements
const tableContainer = document.getElementById('table-container');
const mapElement = document.getElementById('map');
const imageContainer = document.querySelector('.image-container');
const descriptionContainer = document.querySelector('.description-container');
const dispatchButton = document.getElementById('dispatch-btn');

// Map and marker variables
let map;
let markers = [];
let selectedReportId = null;

// Initialize the page
// document.addEventListener('DOMContentLoaded', function () {
// Simulate loading data from database with a slight delay
//     setTimeout(() => {
//         renderTable();
//         initMap();
//         setupEventListeners();
//     }, 1000);
// });

// Render data table
function renderTable(wasteReports) {
    if (wasteReports.length === 0) {
        tableContainer.innerHTML = '<p class="no-data">No waste reports found</p>';
        return;
    }

    let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>UserId</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

    wasteReports.forEach(report => {
        const formattedDate = new Date(report.datetime).toLocaleString();
        tableHTML += `
                    <tr data-id="${report.id}" class="${report.id === selectedReportId ? 'selected' : ''}">
                        <td>${report.id}</td>
                        <td>${report.date}</td>
                        <td>${report.location}</td>
                        <td>${report.description}</td>
                    </tr>
                `;
    });

    tableHTML += `
                    </tbody>
                </table>
            `;

    tableContainer.innerHTML = tableHTML;

    // Add click event to table rows
    document.querySelectorAll('table tbody tr').forEach(row => {
        row.addEventListener('click', () => {
            const reportId = parseInt(row.getAttribute('data-id'));
            selectReport(reportId);
        });
    });
}

// Initialize the map (using OpenStreetMap with Leaflet)
function initMap() {
    // Create the map centered on a default location
    map = L.map('map').setView([39.8283, -98.5795], 4); // Center of US

    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add markers for all reports
    wasteReports.forEach(report => {
        addMarkerToMap(report);
    });
}

// Add a marker to the map
function addMarkerToMap(report) {
    const marker = L.marker([report.coordinates.lat, report.coordinates.lng])
        .addTo(map)
        .bindPopup(`<b>${report.location}</b><br>${report.id}`);

    // Store the marker with its report ID
    markers[report.id] = marker;

    // Add click event to marker
    marker.on('click', () => {
        selectReport(report.id);
    });
}