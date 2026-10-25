const API_REFRESH_INTERVAL = 15000;

const elements = {
    apiHealth: document.getElementById("api-health"),
    healthIndicator: document.getElementById("health-indicator"),
    healthDetail: document.getElementById("health-detail"),
    sidebarStatus: document.getElementById("sidebar-status"),
    apiState: document.getElementById("api-state"),
    endpointState: document.getElementById("endpoint-state"),
    podCount: document.getElementById("pod-count"),
    cpuUsage: document.getElementById("cpu-usage"),
    memoryUsage: document.getElementById("memory-usage"),
};

function setStatus(element, message, healthy = null) {
    if (!element) return;

    element.textContent = message;
    element.classList.remove("good", "bad");

    if (healthy === true) element.classList.add("good");
    if (healthy === false) element.classList.add("bad");
}

async function checkApiHealth() {
    try {
        const response = await fetch("/health", {
            method: "GET",
            headers: { "Accept": "application/json" },
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== "healthy") {
            throw new Error("API reports an unhealthy status");
        }

        if (elements.apiHealth) {
            elements.apiHealth.replaceChildren();
            elements.apiHealth.append(document.createTextNode("Healthy"));
        }

        if (elements.healthIndicator) {
            elements.healthIndicator.classList.remove("bad");
            elements.healthIndicator.classList.add("good");
        }

        setStatus(elements.healthDetail, "API responding normally");
        setStatus(elements.sidebarStatus, "API operational", true);
        setStatus(elements.apiState, "Operational", true);
        setStatus(elements.endpointState, "Healthy", true);

    } catch (error) {
        if (elements.apiHealth) {
            elements.apiHealth.textContent = "Offline";
        }

        if (elements.healthIndicator) {
            elements.healthIndicator.classList.remove("good");
            elements.healthIndicator.classList.add("bad");
        }

        setStatus(elements.healthDetail, "Unable to reach API");
        setStatus(elements.sidebarStatus, "Connection unavailable", false);
        setStatus(elements.apiState, "Unavailable", false);
        setStatus(elements.endpointState, "Unreachable", false);

        console.error("SentinelOps health check failed:", error.message);
    }
}

async function checkApplicationInfo() {
    try {
        const response = await fetch("/api/v1/info", {
            headers: { "Accept": "application/json" },
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const info = await response.json();
        console.info("SentinelOps application info:", info);
    } catch (error) {
        console.warn("Application info unavailable:", error.message);
    }
}

function setupNavigation() {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("menu-toggle");

    if (toggle && sidebar) {
        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll(".nav-link").forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

            if (sidebar) sidebar.classList.remove("open");
        });
    });

    document.addEventListener("click", event => {
        if (
            sidebar &&
            toggle &&
            window.innerWidth <= 850 &&
            !sidebar.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            sidebar.classList.remove("open");
        }
    });
}

function setupMetricPlaceholders() {
    // Do not display invented infrastructure measurements.
    // Connect Prometheus metrics before filling these values.
    if (elements.podCount) elements.podCount.textContent = "— pods";
    if (elements.cpuUsage) elements.cpuUsage.textContent = "—%";
    if (elements.memoryUsage) elements.memoryUsage.textContent = "— MiB";
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupMetricPlaceholders();

    checkApiHealth();
    checkApplicationInfo();

    window.setInterval(checkApiHealth, API_REFRESH_INTERVAL);
});
