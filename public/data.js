const contentData = {
    'Negócios & Treinamentos': [
        { id: 'marketingrede', title: 'Marketing de Rede', desc: 'Saiba mais sobre o modelo de negócio.', cmd: '/marketingrede', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.962 0zM12 6.375a3.375 3.375 0 013.375 3.375m-6.75 0a3.375 3.375 0 013.375-3.375m-3.375 0h6.75M12 21.75a9.094 9.094 0 01-3.741-.479 3 3 0 014.682-2.72m-7.5-2.962a3.75 3.75 0 00-5.962 0zM12 6.375a3.375 3.375 0 00-3.375 3.375m6.75 0a3.375 3.375 0 00-3.375-3.375m3.375 0h-6.75"></path>' },
        { id: 'recompensas2024', title: 'Plano de Recompensas', desc: 'Conheça o plano de recompensas de 2024.', cmd: '/recompensas2024', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9a9 9 0 100-12h9a9 9 0 000 12zM16.5 9.75l-9 0"></path>' },
        { id: 'bonus-construtor', title: 'Bônus Construtor', desc: 'Entenda o bônus construtor.', cmd: '/bonusconstrutor', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.913-.879 4.09 0l.904.679M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>' },
        { id: 'treinamento', title: 'Treinamento', desc: 'Acesse tutoriais e dicas para a equipe.', cmd: '/treinamento', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-1.07-1.07m15.482 0l1.07 1.07m-15.482 0l-1.07-1.07m15.482 0l1.07 1.07m-1.07-1.07l-2.14-2.14m2.14 2.14l-2.14-2.14"></path>' },
        { id: 'ranking', title: 'Ranking', desc: 'Veja o ranking de performance da equipe.', cmd: '/ranking', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.125-1.5M15 12l-1.125-1.5m0 0V3m0 12.75v3.75m0-3.75L12 15m5.25-3l-1.5-2.25m-1.5 2.25l-1.5-2.25M15 12l-1.5-2.25"></path>' },
        { id: 'apresentacao', title: 'Apresentação de Oportunidade', desc: 'Acesse o material de apresentação.', cmd: '/apresentacao', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V5.25A2.25 2.25 0 0018 3H6A2.25 2.25 0 003.75 3zM1.5 15h11.25"></path>' },
        { id: 'eventos', title: 'Eventos', desc: 'Veja os próximos eventos.', cmd: '/eventos', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18"></path>' },
    ],
    'Produtos & Benefícios': [
        { id: 'glossario', title: 'Glossário', desc: 'Consulte termos e conceitos importantes.', cmd: '/glossario', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>' },
        { id: 'tabelas', title: 'Tabelas', desc: 'Consulte tabelas de preços e pontos.', cmd: '/tabelas', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125A1.125 1.125 0 003 5.625v12.75c0 .621.504 1.125 1.125 1.125z"></path>' },
        { id: 'produtos', title: 'Benefícios dos Produtos', desc: 'Navegue pelos produtos e materiais.', cmd: '/produtos', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.099-.816l1.757-4.817a.75.75 0 00-.42-1.028l-4.096-1.44a.75.75 0 00-.868.42l-1.938 5.347m-1.938-5.347F5.636 5.683 5.12 4.569m-1.757 4.817l-3.239 8.16a.75.75 0 00.42 1.028l4.096 1.44a.75.75 0 00.868-.42l3.239-8.16m-4.096-1.44L5.12 4.569"></path>' },
        { id: 'fabrica-4life', title: 'Fábrica 4LIFE', desc: 'Conheça a nossa fábrica.', cmd: '/fabrica4life', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6"></path>' },
        { id: 'fatores-transferencia', title: 'Fatores de Transferência', desc: 'Saiba sobre a ciência por trás.', cmd: '/fatorestransferencia', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V8.25a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75v1.5m0 0V3.75c0-1.105.895-2 2-2h3c1.105 0 2 .895 2 2v1.5m-6 0h6"></path>' },
        { id: 'profissionais', title: 'Profissionais da Saúde', desc: 'Assista vídeos de profissionais.', cmd: '/profissionais', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>' },
        { id: 'fidelidade', title: 'Programa de Fidelidade', desc: 'Informações sobre o programa.', cmd: '/fidelidade', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>' },
        { id: 'loja', title: 'Sua Loja Personalizada', desc: 'Acesse e compartilhe sua loja.', cmd: '/loja', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5V21M6 10.5h12M6 10.5a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h12A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25M6 10.5h12v-2.25a2.25 2.25 0 00-2.25-2.25H8.25a2.25 2.25 0 00-2.25 2.25v2.25z"></path>' },
    ],
    'Materiais Promocionais & Outros': [
        { id: 'folheteria', title: 'Folheteria e Catálogo', desc: 'Acesse panfletos e o catálogo.', cmd: '/folheteria', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"></path>' },
        { id: 'artes', title: 'Artes e Molduras', desc: 'Crie artes e molduras para divulgar.', cmd: '/artes', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>' },
        { id: 'canais', title: 'Canais Oficiais', desc: 'Encontre nossos canais oficiais.', cmd: '/canais', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"></path>' },
        { id: 'convites', title: 'Modelos de Convites', desc: 'Copie textos prontos para convidar.', cmd: '/convite', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>' },
    ]
};

const productsData = {
    individuais: [
        { name: "🫐 RioVida Burst", key: 'riovidaburst' },
        { name: "🍷🍇 RioVida Stix", key: 'riovidastix' },
        { name: "🌿 Bioefa", key: 'bioefa' },
        { name: "⚡ Energy Go Stix", key: 'energygostix' },
        { name: "🐣 TF-Plus", key: 'tfplus' },
        { name: "💊 TF Plus 30 Cápsulas", key: 'tfplus30caps' },
        { name: "🐣 TF-Zinco", key: 'tfzinco' },
        { name: "🥤 Nutrastart", key: 'nutrastart' },
        { name: "🏋️‍♂️ PRO-TF", key: 'protf' },
        { name: "💧 Collagen", key: 'colageno' },
        { name: "🍊 TF-Boost", key: 'tfboost' },
        { name: "⛽ Glutamine Prime", key: 'glutamineprime' },
        { name: "🍊 TF Mastigável", key: 'tfmastigavel' },
    ],
    actions: [
        { label: "📜 Perfil", key: 'perfil_principal' },
        { label: "🎬 Vídeos", key: 'videos' },
        { label: "📱 Perfil Mobile", key: 'perfil_mobile' },
        { label: "🚀 Pitch Venda", key: 'pitch_venda' },
        { label: "✂️ Recorte PNG", key: 'recorte_png' },
        { label: "📷 Imagens Individuais", key: 'imagens_menu' },
        { label: "🎠 Carrosséis", key: 'carrossel_menu' }
    ]
};

const convitesData = {
    'convite_1': { title: "📈 Profissional", text: "Oi [Nome do Convidado], tudo bem? Estou trabalhando em um projeto que está dando super certo e lembrei de você. Acho que pode ser algo interessante para o seu perfil, com potencial de crescimento e ótimos resultados! Podemos marcar uma conversa rápida para eu te explicar direitinho? Será ótimo compartilhar essa oportunidade com você." },
    'convite_2': { title: "😊 Amigável", text: "Oi [Nome do Convidado]! Como você está? Descobri uma oportunidade incrível que está me ajudando muito financeiramente, e logo lembrei de você. Acho que poderia te interessar! É algo flexível, que encaixa bem na rotina e dá pra fazer no seu ritmo. Que tal marcarmos um papo para eu te explicar melhor? 😊" },
    'convite_3': { title: "🌍 Flexível", text: "Oi [Nome do Convidado]! Tudo bem? Sei que você valoriza a liberdade de horário e a flexibilidade. Por isso, pensei em te falar sobre um projeto que estou desenvolvendo: super flexível e com possibilidade de trabalhar de qualquer lugar. Podemos marcar uma conversa rápida para te explicar tudo. É uma ótima chance de gerar renda e ter mais liberdade! O que acha?" },
    'convite_4': { title: "💵 Renda Extra", text: "Oi [Nome do Convidado], como estão as coisas? Já pensou em conseguir uma renda extra? Tenho uma oportunidade que pode encaixar bem com seu ritmo, super flexível. Podemos marcar uma conversa rápida? Assim te explico direitinho como funciona e você vê se faz sentido para você. 😊" },
    'convite_5': { title: "🚀 Empreendedor", text: "Oi [Nome do Convidado]! Lembrei de você e do seu perfil empreendedor. Como estão as coisas? Estou desenvolvendo um projeto que tem transformado a vida de muita gente e achei que você poderia gostar de conhecer. É uma oportunidade com grande potencial e suporte para empreender. Posso te explicar tudo em uma conversa rápida, assim te mostro todos os detalhes! Será ótimo compartilhar isso com você." },
    'convite_6': { title: "👀 Curioso", text: "Oi [Nome do Convidado]! Lembrei de você, tudo bem? Tô envolvido em um projeto novo e muito bacana, e achei que você poderia se interessar. 😊 Te explico melhor quando tivermos um tempinho para conversar. Acho que vai te surpreender! 😉" },
    'convite_7': { title: "✨ Inspirador", text: "Oi [Nome do Convidado]! Como você está? Estou trabalhando em um projeto que realmente mudou minha visão sobre alcançar meus sonhos e objetivos. É uma oportunidade que não só aumenta a renda, mas também oferece desenvolvimento pessoal e crescimento. Quer que eu te conte mais?" },
    'convite_8': { title: "⏳ P/ Ocupados", text: "Oi [Nome do Convidado]! Como estão as coisas? Entendo sua rotina! Eu também estava com a agenda bem cheia quando descobri uma forma de aumentar minha renda, mesmo com a agenda apertada. Acho que poderia te interessar! É uma oportunidade flexível, que você pode fazer no seu próprio ritmo e sem comprometer muito tempo. Podemos bater um papo rápido sobre?" },
    'convite_9': { title: "📊 Estabilidade", text: "Oi [Nome do Convidado]! Tudo certo? Estou envolvido(a) em um projeto que oferece uma oportunidade de gerar uma renda extra de forma estável e segura. Acho que você poderia gostar! Podemos conversar rapidinho? Assim te conto tudo e você vê se se encaixa no que está buscando." },
    'convite_10': { title: "🕒 Autonomia", text: "Oi [Nome do Convidado]! Como estão as coisas? Estou com uma oportunidade que oferece mais autonomia e liberdade para você decidir seu ritmo e seu horário. Pensei que poderia ser algo que você gostaria! Posso te explicar melhor em uma conversa rápida. É uma oportunidade de ter controle sobre sua renda e seu tempo. Que tal?" },
    'convite_11': { title: "🧠 Inovador", text: "Oi [Nome do Convidado]! Tenho explorado novas ideias e queria compartilhar com você um projeto que pode ser revolucionário. Estou buscando pessoas com visão e queiram inovar. Posso te contar mais?" },
    'convite_12': { title: "🤝 Networking", text: "Oi [Nome do Convidado]! Admiro sua habilidade de fazer conexões! Estou envolvido em um projeto com um grande potencial de networking, abrindo portas para novas oportunidades. Posso te mostrar como você pode usar sua rede para prosperar?" },
    'convite_13': { title: "🌱 Crescimento", text: "Oi [Nome do Convidado]! Seu espírito de crescimento me inspira! Estou desenvolvendo um projeto que além de resultados financeiros oferece muito crescimento pessoal e profissional. Quer saber mais sobre essa jornada?" },
    'convite_14': { title: "🎁 Oportunidade", text: "Oi [Nome do Convidado]! Tenho uma oportunidade exclusiva que acho que você vai adorar! Estou abrindo as portas de um projeto que está transformando a vida de muitas pessoas. Que tal dar uma olhada de perto?" },
    'convite_15': { title: "💡 Solução", text: "Oi [Nome do Convidado]! Sabendo que você sempre está procurando soluções, tenho uma ideia que pode otimizar algo em sua vida! Acredito que vai se encaixar com seus objetivos! Podemos marcar um horário para te explicar melhor?" }
};
