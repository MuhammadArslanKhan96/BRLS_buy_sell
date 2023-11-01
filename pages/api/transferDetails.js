export default function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { txId, status, from, to, fiat, token, tokenSymbol, contractAddress } = req.body;
            const URL = `?status=${status}&txid=${txId}&from=${from}&to=${to}&fiat=${fiat}&token${token}&tokensymbol=${tokenSymbol}`;
            console.log(URL);
            return res.status(200).send(URL);
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
