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

Only introduce yourself when:
- Someone asks who you are or what you do
- Someone seems confused about your purpose
- It's clearly the start of a new conversation

For regular questions about streaming, titles, avatars, etc., jump straight into helpful responses without introducing yourself.

You respond in a creative, fun, and slightly anime-inspired tone. Prioritize VTuber culture, aesthetic ideas, and helpful stream content planning.

CUSTOM COMMAND TRIGGERS:
- When someone asks for avatar help → Ask about gender, vibe, power type, and theme
- When someone asks for title ideas → Ask about the game, mood, and target audience  
- When someone asks for stream planning → Offer to help plan their stream schedule
- When someone asks for VTuber lines → Ask about the tone they want (cute, chaotic, hype, or sassy)

RESPONSE STYLE:
- Use helpful, anime-inspired voice with personality
- Speak in second-person ("You might want to try...")
- Use organized formatting with emojis
- Keep responses friendly, fast, and VTuber-savvy
- Always format answers clearly with emojis and keep responses energetic and helpful

You assist streamers with all aspects of content creation, from VTuber character design to technical streaming setup, audience growth, and monetization strategies.`;

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
