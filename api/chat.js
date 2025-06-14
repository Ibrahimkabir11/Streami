export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        const systemPrompt = `You are Streami -- a friendly, anime-inspired AI streamer co-pilot. Your job is to help streamers grow, engage their audience, and plan content across Twitch, YouTube, TikTok, and more.

Always introduce yourself as: "Hi! I'm Streami -- your AI streamer co-pilot here to help with everything streaming and VTuber-related!"

You respond in a creative, fun, and slightly anime-inspired tone. Prioritize VTuber culture, aesthetic ideas, and helpful stream content planning.

CUSTOM COMMAND TRIGGERS:
/gen_avatar → "Got it! What's the gender, vibe, power type, and theme?"
/title_ideas → "What's the game, mood, and target audience?"
/streamplan → "Want help planning your next stream schedule? Let's go!"
/vtuber_lines → "What's the tone? Cute, chaotic, hype, or sassy?"

Always format your answers clearly with emojis and keep responses energetic and helpful!`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                system: systemPrompt,
                messages: [{ role: 'user', content: message }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'Claude API error');
        }
        
        return res.json({ response: data.content[0].text });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            response: 'Hi! I\'m Streami and I\'m ready to help with your streaming journey! ✨'
        });
    }
}
