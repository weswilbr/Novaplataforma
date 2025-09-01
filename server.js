// server.js
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Middleware para permitir que o servidor entenda JSON
app.use(express.json());

// Servir os arquivos estáticos (HTML, CSS, JS do front-end)
app.use(express.static('public')); // Assumindo que seus arquivos (index.html, etc) estão numa pasta 'public'

// Inicializa o cliente da API do Gemini com a chave do arquivo .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// O endpoint que o seu front-end vai chamar
app.post('/api/gemini', async (req, res) => {
    try {
        // Pega o prompt do corpo da requisição enviada pelo front-end
        const { prompt, systemPrompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'O prompt é obrigatório.' });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            systemInstruction: systemPrompt || "Você é um assistente útil.",
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Envia o texto gerado de volta para o front-end
        res.json({ text });

    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        res.status(500).json({ error: 'Falha ao se comunicar com a IA.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});