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
        
        // Delegação de Eventos para conteúdo dinâmico
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

        this.addChatMessage(senderName, text, currentRole, true);
        this.elements.chatInput.value = '';

        // Simular resposta
        setTimeout(() => {
            const [replySender, replyText, replyRole] = currentRole === 'admin' 
                ? ['Usuário', 'Ok, entendido!', 'user'] 
                : ['Admin', 'Obrigado pelo seu feedback!', 'admin'];
            this.addChatMessage(replySender, replyText, replyRole, false);
        }, 1500);
    },
    
    async handleApiCall(button, prompt, systemPrompt, successLog, errorLog, resultHandler) {
        this.toggleLoadingState(button, true, 'Gerar');
        try {
            const generatedText = await this.callGemini(prompt, systemPrompt);
            resultHandler(generatedText);
            this.addLog('SUCCESS', successLog);
        } catch (error) {
            this.addLog('ERROR', `${errorLog}: ${error.message}`);
            resultHandler("Ocorreu um erro. Por favor, tente novamente.");
        } finally {
            this.toggleLoadingState(button, false, 'Gerar');
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
        
        this.copyToClipboard(textToCopy, button, 'Copiado!', button.textContent);
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
        const originalText = btnTextEl ? btnTextEl.textContent : '';

        button.disabled = isLoading;
        if (spinner) spinner.classList.toggle('hidden', !isLoading);

        if (isLoading) {
            button.dataset.originalText = originalText;
            if (btnTextEl) btnTextEl.textContent = 'Gerando...';
        } else {
            if (btnTextEl && button.dataset.originalText) {
                btnTextEl.textContent = button.dataset.originalText;
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

    // --- LÓGICA DE API ---
    async callGemini(prompt, systemPrompt = "") {
        const apiKey = "AIzaSyBzouuoBsoLZVTHHvOzcBXNZ7haOKsKJQc"; // Chave de API é tratada pelo ambiente
        const model = "gemini-1.5-flash-preview-0514";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        if (systemPrompt) {
            payload.systemInstruction = { parts: [{ text: systemPrompt }] };
        }
        
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
        }
        throw new Error("Não foi possível extrair o texto da resposta da IA.");
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
        let contentHTML = `<div class="bg-[--card] rounded-lg p-6">Conteúdo para ${title}...</div>`; // Padrão

        // Adicione aqui as lógicas específicas para cada sub-página, como antes
        if (pageId === 'produtos') { /* ...código para produtos... */ }
        if (pageId === 'convites') { /* ...código para convites... */ }
        // ...etc
        
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

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => App.init());