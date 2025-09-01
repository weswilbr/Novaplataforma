// server.js (VERSÃO DE TESTE PARA FORÇAR ATUALIZAÇÃO)
console.log("--- EXECUTANDO A VERSÃO MAIS RECENTE DO SERVER.JS ---"); // <-- ESTA É A LINHA DE TESTE

require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware para entender JSON e servir arquivos estáticos DA RAIZ
app.use(express.json());
app.use(express.static(__dirname));

// Inicializa o cliente da API do Gemini com a chave das variáveis de ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint que o front-end vai chamar
app.post('/api/gemini', async (req, res) => {
    try {
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

        res.json({ text });

    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        res.status(500).json({ error: 'Falha ao se comunicar com a IA.' });
    }
});

// Rota fallback para servir o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// EXPORTA O APP PARA O VERCEL
module.exports = app;
