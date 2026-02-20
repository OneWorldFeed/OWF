/**
 * OWF | One World Feed
 * modules/global/view-loader.js – Loads HTML view templates.
 */

export async function loadView(name) {
  try {
    const res = await fetch(`/components/views/${name}.html`, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });

    if (!res.ok) {
      console.error(`Failed to load view: ${name}`, res.status);
      return `<div class="error">Failed to load view: ${name}</div>`;
    }

    return await res.text();
  } catch (err) {
    console.error(`Error loading view "${name}":`, err);
    return `<div class="error">Error loading view: ${name}</div>`;
  }
}
