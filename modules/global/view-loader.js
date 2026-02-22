/**
 * OWF | One World Feed
 * modules/global/view-loader.js
 * Canonical resilient loader for HTML view templates.
 */

export async function loadView(name, {
    containerId = "app",
    retries = 2,
    timeout = 5000,
    showLoader = true
} = {}) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`[OWF] Missing container #${containerId}`);
        return;
    }

    const viewPath = `/components/views/${name}.html`;

    // Optional loading state
    if (showLoader) {
        container.innerHTML = `
            <div class="owf-loading">
                <div class="spinner"></div>
                <p>Loading ${name}…</p>
            </div>
        `;
    }

    // Timeout wrapper
    const fetchWithTimeout = (url, ms) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);

        return fetch(url, { signal: controller.signal })
            .finally(() => clearTimeout(timer));
    };

    let attempt = 0;

    while (attempt <= retries) {
        try {
            const res = await fetchWithTimeout(viewPath, timeout);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const html = await res.text();
            container.innerHTML = html;

            console.info(`[OWF] Loaded view: ${name}`);
            return html;

        } catch (err) {
            attempt++;

            console.warn(
                `[OWF] View load failed (${name}) attempt ${attempt}/${retries + 1}:`,
                err.message
            );

            if (attempt > retries) {
                container.innerHTML = `
                    <div class="owf-error">
                        <h2>Page not available</h2>
                        <p>The '${name}' view could not be loaded.</p>
                        <p class="code">Error: ${err.message}</p>
                    </div>
                `;

                return null;
            }
        }
    }
}
