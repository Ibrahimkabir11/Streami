export default function handler(req, res) {
    if (req.method === 'POST') {
        return res.json({ response: 'Hello from Streami! 🎉' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
}
