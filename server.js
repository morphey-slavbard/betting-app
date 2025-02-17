const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/banner', async (req, res) => {
    const API_KEY = '4a48a96cc322c57a1f0125e209879ade5c484443d7d6cea75e1aecbc32fef9b3';
    const ENDPOINT = 'https://dy-api.com/v2/serve/user/choose';

    const requestBody = {
        user: { id: "" },
        session: { custom: "" },
        selector: { names: ["Advert_1"] },
        context: {
            page: {
                type: "HOMEPAGE",
                data: [""],
                location: "https://my-site.com",
                locale: "en_US"
            },
            pageAttributes: { is_night: "true" }
        },
        options: { isImplicitPageview: true }
    };

    try {
        const fetch = (await import('node-fetch')).default; // Dynamically import node-fetch
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'DY-API-Key': API_KEY,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Error details:', errorDetails);
            throw new Error('Failed to fetch banner data');
        }

        const data = await response.json();
        const bannerVariation = data.choices.find(choice => choice.name === 'Advert_1');
        const payload = bannerVariation?.variations?.[0]?.payload?.data || {
            image: "https://via.placeholder.com/400x200", // Default image if missing
        };

        console.log('Returning fresh content:', payload);
        res.json(payload);
        
    } catch (error) {
        console.error('Error in /api/banner route:', error.message);
        res.status(500).json({ error: 'Failed to fetch banner data' });
    }
});

// Serve the main HTML file for root (/) requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
