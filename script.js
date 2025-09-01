document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const loginOverlay = document.getElementById('login-overlay');
    const appContainer = document.getElementById('app-container');
    const loginButton = document.getElementById('login-btn');
    const loginRoleSelect = document.getElementById('login-role');
    const loginEmailInput = document.getElementById('login-email');
    
    const sidebar = document.getElementById('sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const pageContents = document.querySelectorAll('.page-content');
    const logContainer = document.getElementById('log-container');
    const pageTitle = document.getElementById('page-title');
    const subpageContentEl = document.getElementById('subpage-content');
    const logoutButton = document.getElementById('logout-btn');

    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    const adminPages = ['comunicacao', 'moderacao', 'configuracoes'];
    
    const callGemini = async (prompt, systemPrompt = "") => {
        const apiKey = ""; // API key is handled by the environment
        const model = "gemini-1.5-flash-preview-0514";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
        };
        
        if (systemPrompt) {
            payload.systemInstruction = { parts: [{ text: systemPrompt }] };
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                console.error("Gemini API Error:", errorBody);
                throw new Error(`API respondeu com o status: ${response.status}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                return candidate.content.parts[0].text;
            } else {
                console.error("Estrutura de resposta inesperada:", result);
                throw new Error("Não foi possível extrair o texto da resposta da IA.");
            }
        } catch (error) {
            console.error("Erro ao chamar a API Gemini:", error);
            throw error; // Re-throw to be caught by the caller
        }
    };
    
    function addLog(type, message) {
        const typeMap = { 'INFO': 'text-green-400', 'CMD': 'text-sky-400', 'WARN': 'text-yellow-400', 'ERROR': 'text-red-400', 'SUCCESS': 'text-green-300' };
        const p = document.createElement('p');
        p.className = 'border-l-2 pl-3';
        p.innerHTML = `<span class="font-mono text-xs ${typeMap[type] || 'text-gray-400'}">${type}</span><span class="ml-2 text-gray-300">${message}</span>`;
        p.style.borderColor = type === 'ERROR' ? '#ef4444' : type === 'WARN' ? '#f59e0b' : '#4b5563';
        if(logContainer) logContainer.insertBefore(p, logContainer.firstChild);
        if (logContainer && logContainer.children.length > 50) logContainer.removeChild(logContainer.lastChild);
    }

    function switchPage(targetId, title) {
        pageContents.forEach(page => page.classList.remove('active'));
        sidebarLinks.forEach(link => link.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        const activeLink = document.querySelector(`.sidebar-link[data-target="${targetId}"]`);
        if(activeLink) activeLink.classList.add('active');
        pageTitle.textContent = title;
    }

    function setRole(role) {
        body.className = `bg-[--background] role-${role}`;
        const currentPageId = document.querySelector('.page-content.active')?.id || 'dashboard';
        if (role === 'user' && (adminPages.includes(currentPageId))) {
            switchPage('dashboard', 'Painel de Controle');
        }
    }

    function renderContentPage() {
        const container = document.getElementById('content-sections');
        if (!container) return;
        container.innerHTML = '';
        for (const category in contentData) {
            const section = document.createElement('div');
            section.innerHTML = `<h3 class="text-2xl font-semibold text-white mt-8 mb-4">${category}</h3>`;
            const grid = document.createElement('div');
            grid.className = 'card-grid';
            contentData[category].forEach(item => {
                const card = document.createElement('div');
                card.className = 'bg-[--card] p-5 rounded-lg hover:bg-[--hover] transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col';
                card.dataset.triggerSubpage = item.id;
                card.innerHTML = `
                    <div class="flex-grow">
                        <div class="w-12 h-12 rounded-lg bg-[--sidebar] flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-[--accent]" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24">${item.icon}</svg>
                        </div>
                        <h4 class="font-bold text-lg text-white">${item.title}</h4>
                        <p class="text-[--text-secondary] mt-1 text-sm">${item.desc}</p>
                    </div>
                    <span class="inline-block bg-[--sidebar] text-[--accent] text-xs font-mono px-2 py-1 rounded mt-4 self-start">${item.cmd}</span>`;
                grid.appendChild(card);
            });
            section.appendChild(grid);
            container.appendChild(section);
        }
    }

    function showModal(title, content, actionsHTML = '') {
        document.getElementById('details-modal-title').textContent = title;
        document.getElementById('details-modal-content').innerHTML = content.replace(/\n/g, '<br>'); // Render newlines
        document.getElementById('details-modal-actions').innerHTML = actionsHTML;
        document.getElementById('details-modal-backdrop').style.display = 'block';
        document.getElementById('details-modal').style.display = 'block';
    }

    function hideModal() {
         document.getElementById('details-modal-backdrop').style.display = 'none';
        document.getElementById('details-modal').style.display = 'none';
    }

    function copyToClipboard(text, button) {
        // Temporary textarea to execute copy command
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            addLog('SUCCESS', 'Texto do convite copiado para a área de transferência.');
            const originalText = button.innerHTML;
            button.innerHTML = 'Copiado!';
            button.classList.add('bg-green-500');
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('bg-green-500');
            }, 2000);
        } catch (err) {
             addLog('ERROR', `Falha ao copiar texto: ${err}`);
        }
        document.body.removeChild(ta);
    }
    
    function renderSubPage(pageId) {
        const itemData = Object.values(contentData).flat().find(i => i.id === pageId);
        const title = itemData ? itemData.title : 'Detalhes';
        let contentHTML = '';

        if (pageId === 'produtos') {
            contentHTML = `
                <div class="space-y-4">
                    <div class="accordion-item bg-[--card] rounded-lg">
                        <button class="accordion-header w-full flex justify-between items-center text-left p-4">
                            <span class="text-lg font-semibold text-white">📦 Produtos Individuais</span>
                            <svg class="w-5 h-5 text-white transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path></svg>
                        </button>
                        <div class="accordion-content">
                            <div class="p-4 border-t border-[--border] space-y-2">
                                ${productsData.individuais.map(prod => `
                                    <div class="product-item bg-[--sidebar] rounded-lg">
                                        <button class="product-header w-full text-left p-3 hover:bg-[--hover] rounded-lg transition-colors" data-product-name="${prod.name}">
                                            ${prod.name}
                                        </button>
                                        <div class="product-details hidden p-3 border-t border-[--border] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            ${productsData.actions.map(action => `
                                                <button class="product-action-btn text-xs bg-[--card] hover:bg-[--accent] hover:text-white p-2 rounded-md transition-colors" data-action="${action.label}">
                                                    ${action.label}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="bg-[--card] rounded-lg p-4 text-white">🏆 Top Pack <span class="text-sm text-[--text-secondary] ml-2">(Em breve)</span></div>
                    <div class="bg-[--card] rounded-lg p-4 text-white">🚀 Fast Start <span class="text-sm text-[--text-secondary] ml-2">(Em breve)</span></div>
                    <div class="bg-[--card] rounded-lg p-4 text-white">🎁 Kits <span class="text-sm text-[--text-secondary] ml-2">(Em breve)</span></div>
                </div>
            `;
        } else if (pageId === 'bonus-construtor') {
             contentHTML = `
                <div class="bg-[--card] rounded-lg p-6 space-y-4">
                    <h3 class="text-xl font-bold text-white">Recursos do Bônus Construtor</h3>
                    <button data-action="bonus-video" class="w-full text-left p-4 bg-[--sidebar] hover:bg-[--hover] rounded-lg transition-colors">🎥 Ver Vídeo (Arquivo)</button>
                    <button data-action="bonus-doc" class="w-full text-left p-4 bg-[--sidebar] hover:bg-[--hover] rounded-lg transition-colors">📄 Ler Guia (PDF)</button>
                    <a href="https://youtu.be/iyMiw0VpQ0Q" target="_blank" data-action="bonus-youtube" class="block w-full text-left p-4 bg-[--sidebar] hover:bg-[--hover] rounded-lg transition-colors">▶️ Assistir no Youtube</a>
                </div>
            `;
        } else if (pageId === 'convites') {
            contentHTML = `
                <div class="bg-[--card] rounded-lg p-6 mb-8">
                    <h3 class="text-xl font-bold text-white mb-2">✨ Gerador de Convites com IA</h3>
                    <p class="text-sm text-[--text-secondary] mb-4">Descreva o perfil da pessoa que você quer convidar e a IA criará uma mensagem personalizada.</p>
                    <div class="space-y-3">
                        <textarea id="gemini-prompt-invite" class="w-full bg-[--sidebar] border border-[--border] rounded-lg p-3 h-24 text-white focus:ring-2 focus:ring-[--accent]" placeholder="Ex: amigo próximo que trabalha com vendas e está buscando uma renda extra, gosta de carros..."></textarea>
                        <button type="button" data-action="gemini-generate-invite" id="gemini-generate-invite-btn" class="w-full bg-[--accent] hover:bg-[--accent-hover] text-white font-semibold py-2 px-5 rounded-lg flex items-center justify-center">
                            <span id="gemini-invite-btn-text">Gerar Convite</span>
                            <svg id="gemini-invite-spinner" class="animate-spin h-5 w-5 text-white hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="gemini-invite-result-container" class="mt-4 hidden">
                        <h4 class="text-md font-semibold text-white mb-2">Convite Gerado:</h4>
                        <div id="gemini-invite-result" class="bg-[--sidebar] p-4 rounded-lg whitespace-pre-wrap text-[--text-secondary]"></div>
                        <button data-action="copy-gemini-invite" class="mt-3 w-full text-sm bg-[--hover] hover:bg-[--card] p-2 rounded-md transition-colors">Copiar Texto</button>
                    </div>
                </div>

                <h3 class="text-2xl font-semibold text-white mb-4">Ou use um de nossos modelos:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${Object.entries(convitesData).map(([key, convite]) => `
                        <div class="bg-[--card] p-5 rounded-lg flex flex-col">
                            <h4 class="font-bold text-lg text-white mb-2">${convite.title}</h4>
                            <p class="text-[--text-secondary] text-sm flex-grow mb-4">${convite.text.substring(0, 100)}...</p>
                            <div class="flex items-center space-x-2">
                                <button class="flex-1 text-sm bg-[--sidebar] hover:bg-[--hover] p-2 rounded-md transition-colors" data-action="view-invite" data-key="${key}">Visualizar</button>
                                <button class="flex-1 text-sm bg-[--accent] hover:bg-[--accent-hover] p-2 rounded-md transition-colors text-white" data-action="copy-invite" data-key="${key}">Copiar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (pageId === 'fabrica-4life') {
             contentHTML = `
                <div class="bg-[--card] rounded-lg p-6 space-y-4">
                    <h3 class="text-xl font-bold text-white">Vídeos da Fábrica 4Life</h3>
                    <button data-action="fabrica-armazem" class="w-full text-left p-4 bg-[--sidebar] hover:bg-[--hover] rounded-lg transition-colors">🏬 Vídeo do Armazém</button>
                    <button data-action="fabrica-envase" class="w-full text-left p-4 bg-[--sidebar] hover:bg-[--hover] rounded-lg transition-colors">🏭 Vídeo do Envase de Produtos</button>
                    <button data-action="fabrica-nova" class="w-full text-left p-4 bg-[--sidebar] hover:bg-[--hover] rounded-lg transition-colors">🏗️ Vídeo da Nova Fábrica</button>
                </div>
            `;
        }
        else {
            contentHTML = `<div class="bg-[--card] rounded-lg p-6">Conteúdo para ${title}...</div>`;
        }

        subpageContentEl.innerHTML = contentHTML;
        switchPage('subpage-container', title);
    }

    function addChatMessage(sender, text, role, isOwnMessage) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`;

        const messageBubble = document.createElement('div');
        messageBubble.className = `max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 chat-message-item`;
        messageBubble.dataset.sender = sender;
        messageBubble.dataset.text = text;
        
        if (role === 'admin' && isOwnMessage) {
            messageBubble.classList.add('bg-[--accent]', 'text-white');
        } else {
            messageBubble.classList.add('bg-[--sidebar]');
        }

        const senderName = document.createElement('p');
        senderName.className = `text-sm font-bold ${role === 'admin' && isOwnMessage ? 'text-white' : 'text-[--accent]'}`;
        senderName.textContent = sender;

        const messageText = document.createElement('p');
        messageText.className = 'text-white text-sm mt-1';
        messageText.textContent = text;
        
        const timestamp = document.createElement('p');
        timestamp.className = 'text-xs mt-2 text-right opacity-60';
        timestamp.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' });

        messageBubble.appendChild(senderName);
        messageBubble.appendChild(messageText);
        messageBubble.appendChild(timestamp);
        messageWrapper.appendChild(messageBubble);
        chatMessages.appendChild(messageWrapper);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChatSubmit(e) {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        const currentRole = body.classList.contains('role-admin') ? 'admin' : 'user';
        const senderName = currentRole === 'admin' ? 'Admin' : 'Usuário';

        addChatMessage(senderName, text, currentRole, true);
        chatInput.value = '';

        // Simular resposta de outro usuário para teste
        setTimeout(() => {
            if (currentRole === 'admin') {
                 addChatMessage('Usuário', 'Ok, entendido!', 'user', false);
            } else {
                 addChatMessage('Admin', 'Obrigado pelo seu feedback!', 'admin', false);
            }
        }, 1500);
    }
    
    // --- Event Listeners ---
    loginButton.addEventListener('click', () => {
        const role = loginRoleSelect.value;
        loginOverlay.style.display = 'none';
        appContainer.classList.remove('hidden');
        addLog('INFO', `Login bem-sucedido como ${role}.`);
        setRole(role);
        switchPage('dashboard', 'Painel de Controle');
    });
    
    logoutButton.addEventListener('click', () => {
        appContainer.classList.add('hidden');
        loginOverlay.style.display = 'flex';
        addLog('INFO', 'Usuário deslogado.');
        loginRoleSelect.value = 'admin';
        loginEmailInput.value = 'admin@example.com';
        document.getElementById('login-password').value = 'password';
    });

    sidebar.addEventListener('click', (e) => {
         if (!e.target.closest('a, button')) {
            appContainer.classList.toggle('sidebar-collapsed');
         }
    });

    loginRoleSelect.addEventListener('change', (e) => {
        if (e.target.value === 'admin') {
            loginEmailInput.value = 'admin@example.com';
        } else {
            loginEmailInput.value = 'user@example.com';
        }
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            const title = link.querySelector('.sidebar-text').textContent;
            if (targetId === 'conteudo') {
                 document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
                 document.getElementById('conteudo').classList.add('active');
                 pageTitle.textContent = title;
            } else {
                switchPage(targetId, title);
            }
        });
    });

    document.getElementById('content-sections').addEventListener('click', (e) => {
        const card = e.target.closest('[data-trigger-subpage]');
        if (card) {
            renderSubPage(card.dataset.triggerSubpage);
        }
    });
    
    document.querySelector('.back-to-content').addEventListener('click', () => {
        switchPage('conteudo', 'Conteúdo e Recursos');
    });
    
    document.querySelectorAll('[data-trigger-page]').forEach(trigger => {
         trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.dataset.triggerPage;
            const targetLink = document.querySelector(`.sidebar-link[data-target="${targetId}"]`);
            if(targetLink) {
                 switchPage(targetId, targetLink.querySelector('.sidebar-text').textContent);
            }
        });
    });
    
    subpageContentEl.addEventListener('click', async (e) => {
        const accordionHeader = e.target.closest('.accordion-header');
        if (accordionHeader) {
            const content = accordionHeader.nextElementSibling;
            const icon = accordionHeader.querySelector('svg');
            const isOpen = content.style.maxHeight;
            if(isOpen && isOpen !== '0px') {
                content.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        }

        const productHeader = e.target.closest('.product-header');
        if(productHeader) {
            const details = productHeader.nextElementSibling;
            details.classList.toggle('hidden');
        }

        const actionBtn = e.target.closest('.product-action-btn');
        if(actionBtn) {
            const productName = actionBtn.closest('.product-item').querySelector('.product-header').dataset.productName;
            const actionName = actionBtn.dataset.action;
            addLog('CMD', `Solicitado "${actionName}" para o produto ${productName}.`);
            return;
        }

        const subpageActionBtn = e.target.closest('[data-action]');
        if (subpageActionBtn) {
            const action = subpageActionBtn.dataset.action;
            if (action.startsWith('bonus-')) {
                addLog('CMD', `Solicitado recurso do Bônus Construtor: ${action.split('-')[1]}`);
            }
            if (action.startsWith('fabrica-')) {
                addLog('CMD', `Solicitado vídeo da Fábrica 4Life: ${action.split('-')[1]}`);
            }
            if (action === 'view-invite') {
                const key = subpageActionBtn.dataset.key;
                const convite = convitesData[key];
                const actionsHTML = `<button class="text-sm bg-[--accent] hover:bg-[--accent-hover] p-2 rounded-md transition-colors text-white" data-action="copy-invite-modal" data-key="${key}">Copiar Texto</button>`;
                showModal(convite.title, convite.text, actionsHTML);
            }
            if (action === 'copy-invite') {
                const key = subpageActionBtn.dataset.key;
                copyToClipboard(convitesData[key].text, subpageActionBtn);
            }
            if (action === 'gemini-generate-invite') {
                const promptInput = document.getElementById('gemini-prompt-invite');
                const description = promptInput.value.trim();
                if (!description) {
                    addLog('WARN', 'Por favor, descreva o perfil para gerar o convite.');
                    return;
                }

                const resultContainer = document.getElementById('gemini-invite-result-container');
                const resultDiv = document.getElementById('gemini-invite-result');
                const spinner = document.getElementById('gemini-invite-spinner');
                const btnText = document.getElementById('gemini-invite-btn-text');

                subpageActionBtn.disabled = true;
                spinner.classList.remove('hidden');
                btnText.textContent = 'Gerando...';
                resultContainer.classList.add('hidden');

                try {
                    const systemPrompt = "Você é um especialista em recrutamento para marketing de rede. Crie um texto de convite pessoal e persuasivo para o WhatsApp, convidando alguém para conhecer uma oportunidade de negócio. O texto deve ser amigável, mas profissional, e terminar com uma pergunta para iniciar uma conversa. Não use hashtags.";
                    const prompt = `Gere um convite para uma pessoa com o seguinte perfil: ${description}`;
                    const generatedText = await callGemini(prompt, systemPrompt);
                    resultDiv.textContent = generatedText;
                    resultContainer.classList.remove('hidden');
                    addLog('SUCCESS', 'Convite personalizado gerado com IA.');
                } catch (error) {
                    addLog('ERROR', 'Falha ao gerar convite: ' + error.message);
                    resultDiv.textContent = 'Ocorreu um erro ao gerar o convite. Tente novamente.';
                    resultContainer.classList.remove('hidden');
                } finally {
                    subpageActionBtn.disabled = false;
                    spinner.classList.add('hidden');
                    btnText.textContent = 'Gerar Convite';
                }
            }
            if (action === 'copy-gemini-invite') {
                const textToCopy = document.getElementById('gemini-invite-result').textContent;
                copyToClipboard(textToCopy, subpageActionBtn);
            }
        }
    });

    document.getElementById('details-modal-close').addEventListener('click', hideModal);
    document.getElementById('details-modal-backdrop').addEventListener('click', hideModal);
    document.getElementById('details-modal-actions').addEventListener('click', (e) => {
         const button = e.target.closest('[data-action="copy-invite-modal"]');
         if(button) {
             const key = button.dataset.key;
             copyToClipboard(convitesData[key].text, button);
         }
    });

    chatForm.addEventListener('submit', handleChatSubmit);

    const commsBtn = document.getElementById('gemini-generate-comms-btn');
    if (commsBtn) {
        commsBtn.addEventListener('click', async () => {
            const promptInput = document.getElementById('gemini-prompt-comms');
            const keywords = promptInput.value.trim();
            if (!keywords) {
                addLog('WARN', 'Por favor, insira palavras-chave para o anúncio.');
                return;
            }

            const spinner = document.getElementById('gemini-comms-spinner');
            const btnText = document.getElementById('gemini-comms-btn-text');
            const channelMessageTextarea = document.getElementById('channel-message');
            
            commsBtn.disabled = true;
            spinner.classList.remove('hidden');
            btnText.textContent = 'Gerando...';

            try {
                const systemPrompt = "Você é um especialista em comunicação para equipes de marketing de rede. Crie um anúncio de canal claro, profissional e engajador para o Telegram baseado nos seguintes pontos-chave. O anúncio deve ser formatado com emojis e markdown do Telegram (negrito com *asteriscos* e itálico com _underline_).";
                const generatedText = await callGemini(keywords, systemPrompt);
                channelMessageTextarea.value = generatedText;
                addLog('SUCCESS', 'Anúncio gerado com IA.');
            } catch (error) {
                addLog('ERROR', 'Falha ao gerar anúncio: ' + error.message);
                channelMessageTextarea.value = "Ocorreu um erro ao gerar o anúncio. Tente novamente.";
            } finally {
                commsBtn.disabled = false;
                spinner.classList.add('hidden');
                btnText.textContent = 'Gerar';
            }
        });
    }

    const summarizeBtn = document.getElementById('gemini-summarize-chat-btn');
    if (summarizeBtn) {
        summarizeBtn.addEventListener('click', async () => {
            const messages = Array.from(chatMessages.querySelectorAll('.chat-message-item')).map(msgEl => {
                const sender = msgEl.dataset.sender;
                const text = msgEl.dataset.text;
                return `${sender}: ${text}`;
            }).join('\n');

            if (messages.length < 20) { 
                addLog('WARN', 'Não há mensagens suficientes para resumir.');
                showModal('Resumo da Conversa', 'Não há mensagens suficientes para criar um resumo.');
                return;
            }

            const spinner = document.getElementById('gemini-chat-spinner');
            summarizeBtn.disabled = true;
            spinner.classList.remove('hidden');

            try {
                const systemPrompt = "Você é um assistente de equipe eficiente. Resuma a seguinte conversa de chat em português em alguns pontos principais (use marcadores como '-'). Foque em decisões tomadas, tarefas atribuídas e perguntas importantes que ainda não foram respondidas.";
                const summary = await callGemini(messages, systemPrompt);
                showModal('✨ Resumo da Conversa', summary);
                addLog('SUCCESS', 'Resumo do chat gerado com IA.');
            } catch (error) {
                addLog('ERROR', 'Falha ao resumir o chat: ' + error.message);
                showModal('Erro', 'Não foi possível gerar o resumo. Tente novamente.');
            } finally {
                summarizeBtn.disabled = false;
                spinner.classList.add('hidden');
            }
        });
    }

    // --- Inicialização da App ---
    renderContentPage();
});