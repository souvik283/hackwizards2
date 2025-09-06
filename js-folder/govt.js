        // Simulated database data (in a real app, this would come from an API)
        const wasteReports = [
            {
                id: 1,
                username: "Geeta Bhawan",
                datetime: "2025-03-10T08:30:00",
                location: "Central Park, NY",
                coordinates: { lat: 22.473629, lng: 88.417500 },
                imageUrl: "/api/placeholder/400/300",
                description: "Large pile of plastic waste near the south entrance. Requires immediate attention."
            },
            {
                id: 2,
                username: "green_warrior",
                datetime: "2025-03-10T10:15:00",
                location: "Harbor Beach, CA",
                coordinates: { lat: 34.0522, lng: -118.2437 },
                imageUrl: "/api/placeholder/400/300",
                description: "Scattered trash after weekend event. Several recyclable items mixed with general waste."
            },
            {
                id: 3,
                username: "planet_protector",
                datetime: "2025-03-11T09:45:00",
                location: "Riverside Park, TX",
                coordinates: { lat: 29.7604, lng: -95.3698 },
                imageUrl: "/api/placeholder/400/300",
                description: "Overflow of community dumpster with hazardous waste. Needs specialized handling."
            },
            {
                id: 4,
                username: "earth_keeper",
                datetime: "2025-03-11T11:20:00",
                location: "Lake View Trail, WA",
                coordinates: { lat: 47.6062, lng: -122.3321 },
                imageUrl: "/api/placeholder/400/300",
                description: "Construction debris dumped illegally. Large volume, requires heavy equipment."
            },
            {
                id: 5,
                username: "clean_city",
                datetime: "2025-03-11T14:50:00",
                location: "Downtown Metro, IL",
                coordinates: { lat: 41.8781, lng: -87.6298 },
                imageUrl: "/api/placeholder/400/300",
                description: "Overflowing public trash bins in high-traffic area. Weekend rush caused buildup."
            }
        ];

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
        document.addEventListener('DOMContentLoaded', function () {
            // Simulate loading data from database with a slight delay
            setTimeout(() => {
                renderTable();
                initMap();
                setupEventListeners();
            }, 1000);
        });

        // Render data table
        function renderTable() {
            if (wasteReports.length === 0) {
                tableContainer.innerHTML = '<p class="no-data">No waste reports found</p>';
                return;
            }

            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            wasteReports.forEach(report => {
                const formattedDate = new Date(report.datetime).toLocaleString();
                tableHTML += `
                    <tr data-id="${report.id}" class="${report.id === selectedReportId ? 'selected' : ''}">
                        <td>${report.username}</td>
                        <td>${formattedDate}</td>
                        <td>${report.location}</td>
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
                .bindPopup(`<b>${report.location}</b><br>${report.username}`);

            // Store the marker with its report ID
            markers[report.id] = marker;

            // Add click event to marker
            marker.on('click', () => {
                selectReport(report.id);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            dispatchButton.addEventListener('click', () => {
                if (selectedReportId) {
                    alert('Message dispatched! Cleanup team is on the way.');
                }
            });
        }

        // Select a report and update the UI
        function selectReport(reportId) {
            selectedReportId = reportId;

            // Update table selection
            document.querySelectorAll('table tbody tr').forEach(row => {
                if (parseInt(row.getAttribute('data-id')) === reportId) {
                    row.classList.add('selected');
                } else {
                    row.classList.remove('selected');
                }
            });

            // Find the selected report
            const report = wasteReports.find(r => r.id === reportId);

            if (report) {
                // Update image and description
                imageContainer.innerHTML = `<img src="${report.imageUrl}" alt="Waste report image">`;
                descriptionContainer.innerHTML = `<p>${report.description}</p>`;

                // Enable dispatch button
                dispatchButton.disabled = false;

                // Highlight the marker on the map
                if (markers[reportId]) {
                    // Close any open popups
                    map.closePopup();

                    // Open the popup for this marker
                    markers[reportId].openPopup();

                    // Center the map on this marker with animation
                    map.flyTo([report.coordinates.lat, report.coordinates.lng], 13, {
                        animate: true,
                        duration: 1
                    });
                }
            }
        }


        // Function to simulate real-time updates (in a real app, this would use WebSockets or polling)
        /*
        function simulateNewReport() {
            const newReport = {
                id: wasteReports.length + 1,
                username: "new_reporter",
                datetime: new Date().toISOString(),
                location: "New Location, FL",
                coordinates: { lat: 25.7617, lng: -80.1918 },
                imageUrl: "/api/placeholder/400/300",
                description: "New waste report that just came in. Requires assessment."
            };
            
            wasteReports.push(newReport);
            renderTable();
            addMarkerToMap(newReport);
            
            // Show notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--primary-green);
                color: white;
                padding: 15px;
                border-radius: 4px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                z-index: 1000;
            `;
            notification.innerHTML = `<strong>New Report!</strong> ${newReport.username} reported waste at ${newReport.location}`;
            document.body.appendChild(notification);
            
            // Remove notification after 5 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 5000);
        }
        
        // Simulate a new report coming in after 20 seconds
        setTimeout(simulateNewReport, 20000);
        */