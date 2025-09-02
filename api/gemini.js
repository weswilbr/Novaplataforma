// /api/gemini.js - Versão com fetch direto para contornar o problema da biblioteca

export default async function handler(req, res) {
  // Pega a chave de API diretamente das variáveis de ambiente
  const apiKey = process.env.GEMINI_API_KEY;

  // Nosso diagnóstico para ter certeza de que a chave está sendo lida
  console.log("Executando a versão com FETCH. Primeiros 5 caracteres da chave:", apiKey ? apiKey.substring(0, 5) : "CHAVE NÃO ENCONTRADA (UNDEFINED)");

  if (!apiKey) {
    // Se a chave não for encontrada, retorna um erro claro
    console.error("A variável de ambiente GEMINI_API_KEY não foi encontrada.");
    return res.status(500).json({ error: "A chave de API não está configurada no servidor." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { prompt, systemPrompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "O prompt é obrigatório." });
    }

    // Monta a URL da API, passando a chave como um parâmetro de busca
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Monta o corpo (payload) da requisição
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      ...(systemPrompt && { systemInstruction: { parts: [{ text: systemPrompt }] } })
    };

    // Faz a chamada para a API usando fetch
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // Converte a resposta em JSON
    const data = await response.json();

    // Se a resposta da API do Google for um erro, nós o registramos e o retornamos
    if (!response.ok || data.error) {
      console.error("Erro recebido da API do Google:", data.error);
      const errorMessage = data.error?.message || "Erro desconhecido da API do Google.";
      return res.status(data.error?.code || 500).json({ error: `Erro da API do Google: ${errorMessage}` });
    }

    // Extrai o texto da resposta bem-sucedida
    const text = data.candidates[0].content.parts[0].text;

    // Envia o texto de volta para o seu site
    res.status(200).json({ text });

  } catch (error) {
    // Captura qualquer outro erro de rede ou de processamento
    console.error("Erro inesperado na função do servidor:", error);
    res.status(500).json({ error: "Falha ao se comunicar com a IA." });
  }
}
