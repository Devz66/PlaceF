document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp Button Configuration
    const whatsappButton = document.getElementById('whatsappButton');
    if (whatsappButton) {
        const phoneNumber = '5511999999999'; // Substitua pelo número real
        whatsappButton.href = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    }

    // Validação e envio do formulário
    const form = document.getElementById('formContratacao');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }

            const formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                plano: document.getElementById('plano').value,
                mensagem: document.getElementById('mensagem').value
            };

            // Criar mensagem para WhatsApp
            const message = `Novo pedido de contratação:\n
Nome: ${formData.nome}
Email: ${formData.email}
Telefone: ${formData.telefone}
Plano: ${formData.plano}
Mensagem: ${formData.mensagem}`;

            // Abrir WhatsApp com a mensagem
            const phoneNumber = '5511999999999'; // Substitua pelo número real
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, '_blank');
            
            this.reset();
            this.classList.remove('was-validated');
            alert('Mensagem enviada com sucesso! Redirecionando para o WhatsApp...');
        });
    }

    // AI Chat Support
    const chatWidget = document.querySelector('.ai-chat-widget');
    const toggleChat = document.getElementById('toggleChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const openChatButton = document.getElementById('openChat');
    
    if (openChatButton) {
        openChatButton.addEventListener('click', function() {
            chatWidget.classList.add('active');
            toggleChat.querySelector('i').className = 'fas fa-times';
        });
    }

    if (toggleChat && chatWidget) {
        toggleChat.addEventListener('click', function() {
            chatWidget.classList.remove('active');
            toggleChat.querySelector('i').className = 'fas fa-comments';
        });
    }

    if (chatInput && sendMessage) {
        // Enviar mensagem ao pressionar Enter
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendUserMessage();
            }
        });

        // Enviar mensagem ao clicar no botão
        sendMessage.addEventListener('click', sendUserMessage);
    }

    function sendUserMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Adicionar mensagem do usuário
        addMessage(message, 'user-message');
        chatInput.value = '';

        // Simular digitação do bot
        showTypingIndicator();

        // Simular resposta do bot após um breve delay
        setTimeout(() => {
            removeTypingIndicator();
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot-message');
        }, 1500);
    }

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator message bot-message';
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function getBotResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('preço') || message.includes('plano') || message.includes('valor')) {
            return 'Temos diversos planos para atender sua necessidade. Você pode conferir todos os detalhes na nossa página de planos ou posso te explicar cada um deles aqui mesmo.';
        }
        
        if (message.includes('contato') || message.includes('falar') || message.includes('atendente')) {
            return 'Você pode falar com um de nossos atendentes através do WhatsApp ou pelo telefone (11) 1234-5678. Qual você prefere?';
        }
        
        if (message.includes('rastreador') || message.includes('funciona') || message.includes('como')) {
            return 'Nosso sistema de rastreamento utiliza tecnologia GPS de última geração, permitindo localização em tempo real e histórico completo de rotas. Gostaria de saber mais detalhes?';
        }
        
        if (message.includes('instalação') || message.includes('instalar')) {
            return 'A instalação é realizada por nossa equipe técnica especializada. O processo é rápido e não danifica seu veículo. Podemos agendar uma instalação para você!';
        }

        return 'Entendi sua mensagem. Como posso te ajudar melhor com isso? Se preferir, posso te conectar com um de nossos atendentes.';
    }

    // Fecha o menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                menuToggle.click();
            }
        });
    });

    // Função para criar elementos de rastreamento
    function createTrackingElements() {
        const body = document.querySelector('body');
        const numberOfElements = 5;

        for (let i = 0; i < numberOfElements; i++) {
            const element = document.createElement('div');
            element.className = 'tracking-element';
            
            // Posição aleatória na tela
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            
            element.style.left = `${posX}px`;
            element.style.top = `${posY}px`;
            
            // Atraso na animação para cada elemento
            element.style.animationDelay = `${i * 0.5}s`;
            
            body.appendChild(element);
        }
    }

    // Criar elementos quando a página carregar
    createTrackingElements();

    // Recriar elementos quando a janela for redimensionada
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Remover elementos antigos
            document.querySelectorAll('.tracking-element').forEach(el => el.remove());
            // Criar novos elementos
            createTrackingElements();
        }, 250);
    });

    // Função para atualizar o menu ativo baseado na seção visível
    function updateActiveMenu() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Remover active de todos os links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Se estiver na página de contato, ativar o link de contato
        if (window.location.pathname.includes('contato.html')) {
            navLinks.forEach(link => {
                if (link.getAttribute('href').includes('contato.html')) {
                    link.classList.add('active');
                }
            });
            return;
        }
        
        // Para a página inicial, verificar qual seção está visível
        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        // Ativar o link correspondente
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentSection === '') {
                // Se estiver no topo da página, ativar Home
                if (href === 'index.html' && window.scrollY < 100) {
                    link.classList.add('active');
                }
            } else if (href.includes(currentSection)) {
                link.classList.add('active');
            }
        });
    }

    // Adicionar listener para scroll e carregamento da página
    document.addEventListener('scroll', updateActiveMenu);
    document.addEventListener('DOMContentLoaded', updateActiveMenu);
});
