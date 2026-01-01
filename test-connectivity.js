const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Try to read .env.local manually
function getEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        const env = {};
        lines.forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim();
        });
        return env;
    } catch (e) {
        return null;
    }
}

async function testConnectivity() {
    const env = getEnv();
    if (!env) {
        console.error("Could not read .env.local");
        return;
    }

    const zoneId = env.CLOUDFLARE_ZONE_ID;
    const apiToken = env.CLOUDFLARE_API_TOKEN;

    console.log("--- Cloudflare Connectivity Test ---");
    console.log("Zone ID:", zoneId);
    console.log("Token:", apiToken ? "FOUND (check permissions in CF dashboard)" : "MISSING");

    const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${zoneId}" }) {
          httpRequests1dGroups(limit: 1, filter: { date: "2026-01-01" }) {
            dimensions { date }
          }
        }
      }
    }
  `;

    try {
        const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        if (data.errors) {
            console.error("GraphQL Errors:", JSON.stringify(data.errors, null, 2));
        } else {
            console.log("SUCCESS: Connection established and zone found.");
        }
    } catch (e) {
        console.error("Network Error:", e.message);
    }
}

testConnectivity();
