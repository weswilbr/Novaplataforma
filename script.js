// script.js

const App = {
    elements: {}, // Para guardar referências aos elementos do DOM
    
    // Ponto de entrada da aplicação
    init() {
        this.cacheSelectors();
        this.bindEvents();
        this.renderContentPage();
        this.addLog('INFO', 'Aplicação inicializada com sucesso.');
    },

    // Centraliza a busca por elementos do DOM
    cacheSelectors() {
        this.elements = {
            body: document.body,
            loginOverlay: document.getElementById('login-overlay'),
            appContainer: document.getElementById('app-container'),
            loginButton: document.getElementById('login-btn'),
            loginRoleSelect: document.getElementById('login-role'),
            loginEmailInput: document.getElementById('login-email'),
            loginPasswordInput: document.getElementById('login-password'),
            logoutButton: document.getElementById('logout-btn'),
            restartButton: document.getElementById('restart-btn'),
            
            sidebar: document.getElementById('sidebar'),
            sidebarLinks: document.querySelectorAll('.sidebar-link'),
            
            pageTitle: document.getElementById('page-title'),
            pageContents: document.querySelectorAll('.page-content'),
            
            logContainer: document.getElementById('log-container'),
            
            chatForm: document.getElementById('chat-form'),
            chatInput: document.getElementById('chat-input'),
            chatMessages: document.getElementById('chat-messages'),
            
            contentSections: document.getElementById('content-sections'),
            subpageContainer: document.getElementById('subpage-container'),
            subpageContent: document.getElementById('subpage-content'),
            backToContentButton: document.querySelector('.back-to-content'),
            
            geminiSummarizeBtn: document.getElementById('gemini-summarize-chat-btn'),
            commsGenerateBtn: document.getElementById('gemini-generate-comms-btn'),
            commsPromptInput: document.getElementById('gemini-prompt-comms'),
            commsTextarea: document.getElementById('channel-message'),
            
            modalBackdrop: document.getElementById('details-modal-backdrop'),
            modal: document.getElementById('details-modal'),
            modalTitle: document.getElementById('details-modal-title'),
            modalContent: document.getElementById('details-modal-content'),
            modalActions: document.getElementById('details-modal-actions'),
            modalCloseBtn: document.getElementById('details-modal-close'),
        };
    },

    // Adiciona todos os event listeners da aplicação
    bindEvents() {
        this.elements.loginButton.addEventListener('click', () => this.handleLogin());
        this.elements.logoutButton.addEventListener('click', () => this.handleLogout());
        this.elements.restartButton.addEventListener('click', () => this.addLog('CMD', 'Comando para reiniciar o bot enviado.'));
        this.elements.loginRoleSelect.addEventListener('change', (e) => this.updateLoginEmail(e.target.value));
        this.elements.sidebar.addEventListener('click', (e) => this.handleSidebarToggle(e));
        
        this.elements.sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });

        document.querySelectorAll('[data-trigger-page]').forEach(trigger => {
            trigger.addEventListener('click', (e) => this.handlePageTrigger(e.currentTarget));
        });

        this.elements.contentSections.addEventListener('click', (e) => this.handleContentClick(e));
        this.elements.backToContentButton.addEventListener('click', () => this.switchPage('conteudo', 'Conteúdo e Recursos'));
        
        this.elements.subpageContent.addEventListener('click', (e) => this.handleSubpageEvents(e));

        this.elements.chatForm.addEventListener('submit', (e) => this.handleChatSubmit(e));
        this.elements.geminiSummarizeBtn.addEventListener('click', () => this.handleSummarizeChat());
        this.elements.commsGenerateBtn.addEventListener('click', () => this.handleGenerateComms());
        
        this.elements.modalCloseBtn.addEventListener('click', () => this.hideModal());
        this.elements.modalBackdrop.addEventListener('click', () => this.hideModal());
        this.elements.modalActions.addEventListener('click', (e) => this.handleModalActions(e));
    },

    // --- FUNÇÕES DE LÓGICA E MANIPULAÇÃO ---

    handleLogin() {
        const role = this.elements.loginRoleSelect.value;
        this.elements.loginOverlay.style.display = 'none';
        this.elements.appContainer.classList.remove('hidden');
        this.addLog('INFO', `Login bem-sucedido como ${role}.`);
        this.setRole(role);
        this.switchPage('dashboard', 'Painel de Controle');
    },

    handleLogout() {
        this.elements.appContainer.classList.add('hidden');
        this.elements.loginOverlay.style.display = 'flex';
        this.addLog('INFO', 'Usuário deslogado.');
        this.elements.loginRoleSelect.value = 'admin';
        this.updateLoginEmail('admin');
        this.elements.loginPasswordInput.value = 'password';
    },
    
    updateLoginEmail(role) {
        this.elements.loginEmailInput.value = role === 'admin' ? 'admin@example.com' : 'user@example.com';
    },

    handleSidebarToggle(event) {
        if (!event.target.closest('a, button')) {
            this.elements.appContainer.classList.toggle('sidebar-collapsed');
        }
    },

    handleNavigation(linkElement) {
        const targetId = linkElement.dataset.target;
        const title = linkElement.querySelector('.sidebar-text').textContent;
        this.switchPage(targetId, title);
    },

    handlePageTrigger(triggerElement) {
        const targetId = triggerElement.dataset.triggerPage;
        const targetLink = document.querySelector(`.sidebar-link[data-target="${targetId}"]`);
        if (targetLink) {
            this.handleNavigation(targetLink);
        }
    },

    handleContentClick(event) {
        const card = event.target.closest('[data-trigger-subpage]');
        if (card) {
            this.renderSubPage(card.dataset.triggerSubpage);
        }
    },

    handleSubpageEvents(event) {
        const accordionHeader = event.target.closest('.accordion-header');
        if (accordionHeader) {
            this.toggleAccordion(accordionHeader);
            return;
        }

        const productHeader = event.target.closest('.product-header');
        if (productHeader) {
            productHeader.nextElementSibling.classList.toggle('hidden');
            return;
        }

        const actionTarget = event.target.closest('[data-action]');
        if (actionTarget) {
            const action = actionTarget.dataset.action;
            const key = actionTarget.dataset.key;
            
            switch (action) {
                case 'gemini-generate-invite':
                    this.handleGenerateInvite(actionTarget);
                    break;
                case 'copy-invite':
                case 'copy-gemini-invite':
                    this.handleCopyInvite(actionTarget);
                    break;
                case 'view-invite':
                    this.handleViewInvite(key);
                    break;
                default:
                    this.addLog('CMD', `Ação: ${action} para o item ${key || 'indefinido'}`);
                    break;
            }
        }
    },
    
    handleModalActions(event) {
        const button = event.target.closest('[data-action="copy-invite-modal"]');
        if (button) {
            const key = button.dataset.key;
            const text = convitesData[key].text;
            this.copyToClipboard(text, button, 'Copiado!', 'Copiar Texto');
        }
    },

    handleChatSubmit(event) {
        event.preventDefault();
        const text = this.elements.chatInput.value.trim();
        if (!text) return;
    
        const currentRole = this.elements.body.classList.contains('role-admin') ? 'admin' : 'user';
        const senderName = currentRole === 'admin' ? 'Admin' : 'Usuário';
    
        // Mostra mensagem enviada
        this.addChatMessage(senderName, text, currentRole, true);
        this.elements.chatInput.value = '';
    
        // Chama Gemini pela API
        this.callGemini(text)
            .then(replyText => {
                const replySender = currentRole === 'admin' ? 'Usuário' : 'Admin';
                const replyRole = currentRole === 'admin' ? 'user' : 'admin';
                this.addChatMessage(replySender, replyText, replyRole, false);
            })
            .catch(err => {
                this.addLog('ERROR', `Falha ao obter resposta da IA: ${err.message}`);
                this.addChatMessage('Sistema', '⚠️ Erro ao chamar a IA.', 'admin', false);
            });
    }
    
    async handleApiCall(button, prompt, systemPrompt, successLog, errorLog, resultHandler) {
        this.toggleLoadingState(button, true);
        try {
            const generatedText = await this.callGemini(prompt, systemPrompt);
            resultHandler(generatedText);
            this.addLog('SUCCESS', successLog);
        } catch (error) {
            this.addLog('ERROR', `${errorLog}: ${error.message}`);
            resultHandler("Ocorreu um erro ao chamar a IA. Verifique o console do servidor.");
        } finally {
            this.toggleLoadingState(button, false);
        }
    },

    async handleGenerateComms() {
        const keywords = this.elements.commsPromptInput.value.trim();
        if (!keywords) {
            this.addLog('WARN', 'Por favor, insira palavras-chave para o anúncio.');
            return;
        }
        const systemPrompt = "Você é um especialista em comunicação para equipes de marketing de rede. Crie um anúncio de canal claro, profissional e engajador para o Telegram baseado nos seguintes pontos-chave. O anúncio deve ser formatado com emojis e markdown do Telegram (negrito com *asteriscos* e itálico com _underline_).";
        
        await this.handleApiCall(
            this.elements.commsGenerateBtn,
            keywords,
            systemPrompt,
            'Anúncio gerado com IA.',
            'Falha ao gerar anúncio',
            (result) => { this.elements.commsTextarea.value = result; }
        );
    },

    async handleSummarizeChat() {
        const messages = Array.from(this.elements.chatMessages.querySelectorAll('.chat-message-item'))
            .map(msgEl => `${msgEl.dataset.sender}: ${msgEl.dataset.text}`)
            .join('\n');

        if (messages.length < 20) {
            this.addLog('WARN', 'Não há mensagens suficientes para resumir.');
            this.showModal('Resumo da Conversa', 'Não há mensagens suficientes para criar um resumo.');
            return;
        }
        
        const systemPrompt = "Você é um assistente de equipe eficiente. Resuma a seguinte conversa de chat em português em alguns pontos principais (use marcadores como '-'). Foque em decisões tomadas, tarefas atribuídas e perguntas importantes que ainda não foram respondidas.";
        
        await this.handleApiCall(
            this.elements.geminiSummarizeBtn,
            messages,
            systemPrompt,
            'Resumo do chat gerado com IA.',
            'Falha ao resumir o chat',
            (result) => { this.showModal('✨ Resumo da Conversa', result); }
        );
    },

    async handleGenerateInvite(button) {
        const promptInput = document.getElementById('gemini-prompt-invite');
        const description = promptInput.value.trim();
        if (!description) {
            this.addLog('WARN', 'Por favor, descreva o perfil para gerar o convite.');
            return;
        }
        
        const systemPrompt = "Você é um especialista em recrutamento para marketing de rede. Crie um texto de convite pessoal e persuasivo para o WhatsApp, convidando alguém para conhecer uma oportunidade de negócio. O texto deve ser amigável, mas profissional, e terminar com uma pergunta para iniciar uma conversa. Não use hashtags.";
        const prompt = `Gere um convite para uma pessoa com o seguinte perfil: ${description}`;

        const resultContainer = document.getElementById('gemini-invite-result-container');
        const resultDiv = document.getElementById('gemini-invite-result');
        
        await this.handleApiCall(
            button,
            prompt,
            systemPrompt,
            'Convite personalizado gerado com IA.',
            'Falha ao gerar convite',
            (result) => {
                resultDiv.textContent = result;
                resultContainer.classList.remove('hidden');
            }
        );
    },
    
    handleCopyInvite(button) {
        let textToCopy;
        const resultDiv = document.getElementById('gemini-invite-result');

        if (button.dataset.action === 'copy-gemini-invite' && resultDiv) {
            textToCopy = resultDiv.textContent;
        } else {
            textToCopy = convitesData[button.dataset.key].text;
        }
        
        this.copyToClipboard(textToCopy, button, 'Copiado!', button.textContent.trim());
    },
    
    handleViewInvite(key) {
        const convite = convitesData[key];
        const actionsHTML = `<button class="text-sm bg-[--accent] hover:bg-[--accent-hover] p-2 rounded-md transition-colors text-white" data-action="copy-invite-modal" data-key="${key}">Copiar Texto</button>`;
        this.showModal(convite.title, convite.text, actionsHTML);
    },

    // --- FUNÇÕES AUXILIARES E DE RENDERIZAÇÃO ---
    
    addLog(type, message) {
        if (!this.elements.logContainer) return;
        const typeMap = { 'INFO': 'text-green-400', 'CMD': 'text-sky-400', 'WARN': 'text-yellow-400', 'ERROR': 'text-red-400', 'SUCCESS': 'text-green-300' };
        const p = document.createElement('p');
        p.className = 'border-l-2 pl-3';
        p.innerHTML = `<span class="font-mono text-xs ${typeMap[type] || 'text-gray-400'}">${type}</span><span class="ml-2 text-gray-300">${message}</span>`;
        p.style.borderColor = type === 'ERROR' ? '#ef4444' : type === 'WARN' ? '#f59e0b' : '#4b5563';
        this.elements.logContainer.insertBefore(p, this.elements.logContainer.firstChild);
        if (this.elements.logContainer.children.length > 50) {
            this.elements.logContainer.removeChild(this.elements.logContainer.lastChild);
        }
    },

    switchPage(targetId, title) {
        this.elements.pageContents.forEach(page => page.classList.remove('active'));
        this.elements.sidebarLinks.forEach(link => link.classList.remove('active'));

        const targetPage = document.getElementById(targetId);
        if (targetPage) targetPage.classList.add('active');
        
        const activeLink = document.querySelector(`.sidebar-link[data-target="${targetId}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        this.elements.pageTitle.textContent = title;
    },

    setRole(role) {
        this.elements.body.className = `bg-[--background] role-${role}`;
        const currentPageId = document.querySelector('.page-content.active')?.id || 'dashboard';
        const adminPages = ['comunicacao', 'moderacao', 'configuracoes'];
        if (role === 'user' && adminPages.includes(currentPageId)) {
            this.switchPage('dashboard', 'Painel de Controle');
        }
    },
    
    copyToClipboard(text, button, successText, originalText) {
        navigator.clipboard.writeText(text).then(() => {
            this.addLog('SUCCESS', 'Texto copiado para a área de transferência.');
            const originalHTML = button.innerHTML;
            button.innerHTML = successText;
            button.classList.add('bg-green-500');
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('bg-green-500');
            }, 2000);
        }, (err) => {
            this.addLog('ERROR', `Falha ao copiar texto: ${err}`);
        });
    },

    toggleLoadingState(button, isLoading) {
        const spinner = button.querySelector('svg');
        const btnTextEl = button.querySelector('span');

        button.disabled = isLoading;
        if (spinner) spinner.classList.toggle('hidden', !isLoading);

        if (btnTextEl) {
            if (isLoading) {
                button.dataset.originalText = btnTextEl.textContent;
                btnTextEl.textContent = 'Gerando...';
            } else {
                btnTextEl.textContent = button.dataset.originalText || 'Gerar';
            }
        }
    },
    
    toggleAccordion(accordionHeader) {
        const content = accordionHeader.nextElementSibling;
        const icon = accordionHeader.querySelector('svg');
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        content.style.maxHeight = isOpen ? '0px' : `${content.scrollHeight}px`;
        if (icon) icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
    },
    
    showModal(title, content, actionsHTML = '') {
        this.elements.modalTitle.textContent = title;
        this.elements.modalContent.innerHTML = content.replace(/\n/g, '<br>');
        this.elements.modalActions.innerHTML = actionsHTML;
        this.elements.modalBackdrop.style.display = 'block';
        this.elements.modal.style.display = 'block';
    },

    hideModal() {
        this.elements.modalBackdrop.style.display = 'none';
        this.elements.modal.style.display = 'none';
    },

    // --- LÓGICA DE API (CORRIGIDO) ---
    async callGemini(prompt, systemPrompt = "") {
        // Agora, fazemos uma chamada para o nosso próprio backend no endpoint '/api/gemini'.
        const apiUrl = '/api/gemini';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemPrompt }) // Enviamos o prompt no corpo da requisição
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Erro do nosso servidor:", errorBody);
            throw new Error(`Ocorreu um erro ao chamar a IA. Verifique o console do servidor.`);
        }
        
        const result = await response.json();
        return result.text; // O backend retornará um JSON com a propriedade "text"
    },

    // --- FUNÇÕES DE TEMPLATE HTML ---
    
    createContentCardHTML(item) {
        return `
        <div class="bg-[--card] p-5 rounded-lg hover:bg-[--hover] transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col" data-trigger-subpage="${item.id}">
            <div class="flex-grow">
                <div class="w-12 h-12 rounded-lg bg-[--sidebar] flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-[--accent]" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24">${item.icon}</svg>
                </div>
                <h4 class="font-bold text-lg text-white">${item.title}</h4>
                <p class="text-[--text-secondary] mt-1 text-sm">${item.desc}</p>
            </div>
            <span class="inline-block bg-[--sidebar] text-[--accent] text-xs font-mono px-2 py-1 rounded mt-4 self-start">${item.cmd}</span>
        </div>`;
    },
    
    renderContentPage() {
        if (!this.elements.contentSections) return;
        let html = '';
        for (const category in contentData) {
            const cardsHTML = contentData[category]
                .map(item => this.createContentCardHTML(item))
                .join('');
            html += `
                <h3 class="text-2xl font-semibold text-white mt-8 mb-4">${category}</h3>
                <div class="card-grid">${cardsHTML}</div>
            `;
        }
        this.elements.contentSections.innerHTML = html;
    },

    renderSubPage(pageId) {
        const itemData = Object.values(contentData).flat().find(i => i.id === pageId);
        const title = itemData ? itemData.title : 'Detalhes';
        let contentHTML = `<div class="bg-[--card] rounded-lg p-6">Conteúdo para ${title} não encontrado.</div>`;

        if (pageId === 'convites') {
            const invitesHTML = Object.entries(convitesData).map(([key, convite]) => `
                <div class="flex items-center justify-between p-4 bg-[--sidebar] rounded-lg">
                    <p class="text-white">${convite.title}</p>
                    <div class="flex space-x-2">
                        <button class="text-sm bg-[--card] hover:bg-[--hover] p-2 rounded-md transition-colors" data-action="view-invite" data-key="${key}">Visualizar</button>
                        <button class="text-sm bg-[--accent] hover:bg-[--accent-hover] p-2 rounded-md transition-colors text-white" data-action="copy-invite" data-key="${key}">Copiar</button>
                    </div>
                </div>
            `).join('');
            
            contentHTML = `
                <div class="bg-[--card] rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-white mb-6">Modelos de Convite Prontos</h3>
                    <div class="space-y-4 mb-8">${invitesHTML}</div>
                    
                    <div class="border-t border-[--border] pt-6">
                        <h3 class="text-xl font-semibold text-white mb-2">✨ Gerar Convite com IA</h3>
                        <p class="text-sm text-[--text-secondary] mb-4">Descreva o perfil da pessoa que você quer convidar e a IA criará uma mensagem personalizada.</p>
                        <textarea id="gemini-prompt-invite" rows="3" class="w-full bg-[--sidebar] border border-[--border] rounded-lg p-3 text-white focus:ring-2 focus:ring-[--accent]" placeholder="Ex: 'jovem empreendedor que gosta de desafios e busca crescimento financeiro'"></textarea>
                        <button class="w-full mt-3 bg-[--accent] hover:bg-[--accent-hover] text-white font-semibold py-2 px-5 rounded-lg flex items-center justify-center" data-action="gemini-generate-invite">
                            <span>Gerar Convite</span>
                            <svg class="animate-spin ml-2 h-5 w-5 text-white hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </button>
                        <div id="gemini-invite-result-container" class="mt-4 hidden">
                            <h4 class="text-lg font-semibold text-white mb-2">Resultado Gerado:</h4>
                            <div class="bg-[--sidebar] p-4 rounded-lg relative">
                                <p id="gemini-invite-result" class="text-white whitespace-pre-wrap"></p>
                                <button class="absolute top-2 right-2 text-sm bg-[--card] hover:bg-[--hover] p-2 rounded-md transition-colors" data-action="copy-gemini-invite">Copiar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        this.elements.subpageContent.innerHTML = contentHTML;
        this.switchPage('subpage-container', title);
    },

    addChatMessage(sender, text, role, isOwnMessage) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`;
        
        let bubbleClass = 'bg-[--sidebar]';
        let senderClass = 'text-[--accent]';
        if (role === 'admin' && isOwnMessage) {
            bubbleClass = 'bg-[--accent] text-white';
            senderClass = 'text-white';
        }

        messageWrapper.innerHTML = `
            <div class="max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 chat-message-item ${bubbleClass}" data-sender="${sender}" data-text="${text}">
                <p class="text-sm font-bold ${senderClass}">${sender}</p>
                <p class="text-white text-sm mt-1">${text}</p>
                <p class="text-xs mt-2 text-right opacity-60">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}</p>
            </div>
        `;
        this.elements.chatMessages.appendChild(messageWrapper);
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());
