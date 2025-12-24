import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Olá! Como posso ajudar você hoje?', type: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const chatEndRef = useRef(null);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Background Tracking Elements Animation
    useEffect(() => {
        const createTrackingElements = () => {
            const container = document.querySelector('.landing-wrapper');
            if (!container) return;

            // Remove existing
            const existing = document.querySelectorAll('.tracking-element');
            existing.forEach(el => el.remove());

            const numberOfElements = 5;
            for (let i = 0; i < numberOfElements; i++) {
                const element = document.createElement('div');
                element.className = 'tracking-element';
                
                const posX = Math.random() * window.innerWidth;
                const posY = Math.random() * window.innerHeight;
                
                element.style.left = `${posX}px`;
                element.style.top = `${posY}px`;
                element.style.animationDelay = `${i * 0.5}s`;
                
                container.appendChild(element);
            }
        };

        createTrackingElements();
        window.addEventListener('resize', createTrackingElements);
        return () => window.removeEventListener('resize', createTrackingElements);
    }, []);

    // Chat Logic
    const handleSendMessage = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, type: 'user' }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const botResponse = getBotResponse(userMsg);
            setMessages(prev => [...prev, { text: botResponse, type: 'bot' }]);
        }, 1500);
    };

    const getBotResponse = (msg) => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('preço') || lowerMsg.includes('plano') || lowerMsg.includes('valor')) {
            return 'Temos diversos planos para atender sua necessidade. Você pode conferir todos os detalhes na nossa seção de planos logo abaixo.';
        }
        if (lowerMsg.includes('contato') || lowerMsg.includes('falar')) {
            return 'Você pode falar com um de nossos atendentes através do WhatsApp ou preenchendo o formulário de contato.';
        }
        if (lowerMsg.includes('rastreador') || lowerMsg.includes('funciona')) {
            return 'Nosso sistema utiliza tecnologia GPS de última geração com localização em tempo real e histórico completo.';
        }
        return 'Entendi. Se precisar de ajuda específica, pode me perguntar sobre planos, rastreamento ou contato!';
    };

    // Contact Form Logic
    const handleContactSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const message = `Novo pedido de contratação:\n
Nome: ${data.nome}
Email: ${data.email}
Telefone: ${data.telefone}
Plano: ${data.plano}
Mensagem: ${data.mensagem}`;

        const phoneNumber = '5511999999999'; // Configure real number here
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, '_blank');
        
        toast.success('Mensagem enviada com sucesso! Redirecionando para o WhatsApp...');
        e.target.reset();
    };

    return (
        <div className="landing-wrapper">
            {/* Background Composition */}
            <div className="background-composition">
                <div className="grid-lines"></div>
                <div className="radar"></div>
                <div className="floating-elements">
                    <div className="floating-element satellite"></div>
                    <div className="floating-element car"></div>
                    <div className="floating-element signal"></div>
                </div>
            </div>

            {/* Navbar */}
            <nav className="custom-navbar">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src="/images/rastreador.png" alt="Rastreador" />
                        PLACE RASTREIOS
                    </Link>
                    <button 
                        className="navbar-toggler-custom" 
                        type="button" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                    <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`} id="navbarNav">
                        <ul className="navbar-nav-custom">
                            <li className="nav-item-custom"><a className="nav-link-custom" href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
                            <li className="nav-item-custom"><a className="nav-link-custom" href="#planos" onClick={() => setMobileMenuOpen(false)}>Planos</a></li>
                            <li className="nav-item-custom"><a className="nav-link-custom" href="#contato" onClick={() => setMobileMenuOpen(false)}>Contato</a></li>
                            <li className="nav-item-custom">
                                <Link className="nav-link-custom btn-login-custom" to="/login">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero-section">
                <div className="hero-background">
                    <img src="/images/banner-rastreament-veicular-mapa.webp" alt="Background Map" />
                    <div className="hero-overlay"></div>
                </div>
                
                <div className="container position-relative z-2">
                    <div className="row justify-content-center min-vh-100 align-items-center">
                        <div className="col-lg-10 text-center">
                            
                            <div className="hero-badge-container mb-4">
                                <span className="hero-badge">
                                    <span className="dot-pulse"></span>
                                    Sistema Ativo 24h
                                </span>
                            </div>

                            <h1 className="hero-title">
                                RASTREAMENTO EM<br />
                                <span className="text-highlight">TEMPO REAL</span> PARA<br />
                                SUA SEGURANÇA
                            </h1>
                            
                            <p className="hero-subtitle">
                                Monitore seus veículos particulares ou sua frota empresarial e tenha a
                                tranquilidade que você merece, 24 horas por dia, na palma da sua mão.
                            </p>

                            <div className="hero-buttons d-flex justify-content-center gap-3 mb-5 flex-wrap">
                                <a href="#planos" className="btn btn-primary btn-lg btn-hero">
                                    Conhecer Planos <i className="fas fa-arrow-right ms-2"></i>
                                </a>
                                <button className="btn btn-outline-light btn-lg btn-hero" onClick={() => window.open('https://www.youtube.com/watch?v=placeholder', '_blank')}>
                                    <i className="fas fa-play-circle ms-2"></i> Ver Demonstração
                                </button>
                            </div>

                            <div className="hero-stats-row">
                                <div className="stat-item">
                                    <div className="stat-value">+5k</div>
                                    <div className="stat-label">VEÍCULOS</div>
                                </div>
                                <div className="stat-separator"></div>
                                <div className="stat-item">
                                    <div className="stat-value">24/7</div>
                                    <div className="stat-label">SUPORTE</div>
                                </div>
                                <div className="stat-separator"></div>
                                <div className="stat-item">
                                    <div className="stat-value">100%</div>
                                    <div className="stat-label">ONLINE</div>
                                </div>
                                <div className="stat-separator"></div>
                                <div className="stat-item">
                                    <div className="stat-value">APP</div>
                                    <div className="stat-label">IOS & ANDROID</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Soluções */}
            <section id="solucoes" className="tracking-solutions">
                <div className="container">
                    <h2 className="section-title">SOLUÇÕES EM RASTREAMENTO</h2>
                    <div className="solutions-content">
                        <div className="solutions-text">
                            <div className="solution-item">
                                <i className="fas fa-satellite"></i>
                                <div className="solution-info">
                                    <h3>MONITORAMENTO DE VEÍCULO VIA SATÉLITE</h3>
                                </div>
                            </div>
                            <div className="solution-item">
                                <i className="fas fa-shield-alt"></i>
                                <div className="solution-info">
                                    <h3>EQUIPAMENTOS BLINDADOS E HOMOLOGADOS PELA ANATEL</h3>
                                </div>
                            </div>
                            <div className="solution-item">
                                <i className="fas fa-mobile-alt"></i>
                                <div className="solution-info">
                                    <h3>ACESSO PELO APLICATIVO COM MONITORAMENTO EM TEMPO REAL</h3>
                                </div>
                            </div>
                        </div>
                        <div className="solutions-image">
                            <img src="/images/phones.png" alt="App de Rastreamento" className="phones-image" />
                        </div>
                        <div className="solutions-text right">
                            <div className="solution-item">
                                <i className="fas fa-headset"></i>
                                <div className="solution-info">
                                    <h3>SUPORTE 24H COM EQUIPE DE APOIO TÁTICO</h3>
                                </div>
                            </div>
                            <div className="solution-item">
                                <i className="fas fa-lock"></i>
                                <div className="solution-info">
                                    <h3>BLOQUEIO REMOTO DO VEÍCULO EM CASOS DE SINISTRO</h3>
                                </div>
                            </div>
                            <div className="solution-item">
                                <i className="fas fa-route"></i>
                                <div className="solution-info">
                                    <h3>HISTÓRICO DE TRAJETO E RELATÓRIO DE VELOCIDADE</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="vehicle-types">
                        <div className="vehicle-card">
                            <img src="/images/carro.png" alt="Carro" />
                            <h3>Rastreamento para carros</h3>
                            <p>Com esse serviço, você obtém informações em tempo real sobre seu veículo e tem a capacidade de localizá-lo</p>
                        </div>
                        <div className="vehicle-card">
                            <img src="/images/moto.png" alt="Moto" />
                            <h3>Rastreamento para motos</h3>
                            <p>Com nosso rastreador, você pode monitorar seu veículo em tempo real, 24 horas por dia.</p>
                        </div>
                        <div className="vehicle-card">
                            <img src="/images/Caminhao.png" alt="Caminhão" />
                            <h3>Rastreamento para Caminhões</h3>
                            <p>O sistema oferece proteção para caminhão e carga, garantindo controle total.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Planos Section */}
            <section id="planos" className="py-3">
                <div className="container">
                    <h2 className="text-center mb-5">PLANOS</h2>
                    <div className="row g-5 justify-content-center align-items-stretch">
                        {/* Basic */}
                        <div className="col-lg-4 col-md-6">
                            <div className="plan-card basic h-100">
                                <div className="plan-header">
                                    <h3>PLANO<br/>BASIC</h3>
                                    <p className="subtitle">mais economia</p>
                                    <div className="price-tag">
                                        <span className="label">SOMENTE</span>
                                        <div className="price">
                                            <span className="currency">R$</span>
                                            <span className="amount">64,90</span>
                                            <span className="period">/MÊS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="plan-features">
                                    <ul>
                                        <li><i className="fas fa-check"></i> Monitoramento</li>
                                        <li><i className="fas fa-check"></i> Aplicativo para celular</li>
                                        <li><i className="fas fa-check"></i> Central 0800</li>
                                        <li><i className="fas fa-check"></i> Cobertura Nacional</li>
                                    </ul>
                                </div>
                                <div className="price-per-day">
                                    <span className="label">SOMENTE</span>
                                    <div className="daily-price">
                                        <span className="currency">R$</span>
                                        <span className="amount">2,17</span>
                                        <span className="period">POR DIA</span>
                                    </div>
                                </div>
                                <a href="#contato" className="btn btn-outline-light btn-lg w-100">CONTRATAR AGORA</a>
                            </div>
                        </div>

                        {/* Plus */}
                        <div className="col-lg-4 col-md-6">
                            <div className="plan-card plus h-100">
                                <div className="plan-header">
                                    <h3>PLANO<br/>PLUS</h3>
                                    <p className="subtitle">mais completo</p>
                                    <div className="price-tag">
                                        <span className="label">SOMENTE</span>
                                        <div className="price">
                                            <span className="currency">R$</span>
                                            <span className="amount">82,90</span>
                                            <span className="period">/MÊS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="plan-features">
                                    <ul>
                                        <li><i className="fas fa-check"></i> Todos do Basic</li>
                                        <li><i className="fas fa-check"></i> Relatórios de Controle</li>
                                        <li><i className="fas fa-check"></i> Pronta Resposta</li>
                                        <li><i className="fas fa-check"></i> Reboque, Bateria, Pneu</li>
                                    </ul>
                                </div>
                                <div className="price-per-day">
                                    <span className="label">SOMENTE</span>
                                    <div className="daily-price">
                                        <span className="currency">R$</span>
                                        <span className="amount">2,76</span>
                                        <span className="period">POR DIA</span>
                                    </div>
                                </div>
                                <a href="#contato" className="btn btn-danger btn-lg w-100">CONTRATAR AGORA</a>
                            </div>
                        </div>

                        {/* Professional */}
                        <div className="col-lg-4 col-md-6">
                            <div className="plan-card professional h-100">
                                <div className="plan-header">
                                    <h3>PLANO<br/>PROFESSIONAL</h3>
                                    <p className="subtitle">mais proteção</p>
                                    <div className="price-tag">
                                        <span className="label">CONSULTE</span>
                                        <div className="price">
                                            <span>CONDIÇÕES</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="plan-features">
                                    <ul>
                                        <li><i className="fas fa-check"></i> Gestão de Frotas</li>
                                        <li><i className="fas fa-check"></i> Logística Avançada</li>
                                        <li><i className="fas fa-check"></i> Relatórios Gerenciais</li>
                                        <li><i className="fas fa-check"></i> Todos benefícios Plus</li>
                                    </ul>
                                </div>
                                <a href="#contato" className="btn btn-outline-light btn-lg w-100">SOLICITAR COTAÇÃO</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contato */}
            <section id="contato">
                <div className="container">
                    <h2 className="text-center mb-5 font-bold text-3xl">ENTRE EM CONTATO</h2>
                    <div className="row">
                        <div className="col-lg-5 mb-4">
                            <div className="contact-info p-4">
                                <h4 className="mb-3">Informações de Contato</h4>
                                <div className="d-flex mb-3">
                                    <i className="fab fa-whatsapp mt-1 me-3"></i>
                                    <div>
                                        <h5>WhatsApp</h5>
                                        <p>(11) 99999-9999</p>
                                    </div>
                                </div>
                                <div className="d-flex mb-3">
                                    <i className="fas fa-envelope mt-1 me-3"></i>
                                    <div>
                                        <h5>Email</h5>
                                        <p>contato@placerastreios.com.br</p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <i className="fas fa-map-marker-alt mt-1 me-3"></i>
                                    <div>
                                        <h5>Endereço</h5>
                                        <p>São Paulo, SP</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <form id="formContratacao" onSubmit={handleContactSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="nome" className="form-label">Nome Completo</label>
                                        <input type="text" className="form-control" id="nome" name="nome" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="telefone" className="form-label">Telefone/WhatsApp</label>
                                        <input type="tel" className="form-control" id="telefone" name="telefone" required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="plano" className="form-label">Plano de Interesse</label>
                                        <select className="form-select" id="plano" name="plano">
                                            <option value="Basic">Plano Basic</option>
                                            <option value="Plus" selected>Plano Plus</option>
                                            <option value="Professional">Plano Professional</option>
                                            <option value="Outro">Outro / Dúvida</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="mensagem" className="form-label">Mensagem</label>
                                        <textarea className="form-control" id="mensagem" name="mensagem" rows="3"></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary">Enviar Mensagem</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Widgets Flutuantes */}
            <a 
                href="https://api.whatsapp.com/send?phone=5511999999999" 
                target="_blank" 
                rel="noreferrer"
                className="whatsapp-button"
            >
                <i className="fab fa-whatsapp"></i>
            </a>

            <div className="chat-button" onClick={() => setChatOpen(!chatOpen)}>
                <i className={`fas ${chatOpen ? 'fa-times' : 'fa-comments'}`}></i>
            </div>

            <div className={`ai-chat-widget ${chatOpen ? 'active' : ''}`}>
                <div className="chat-header">
                    <h5>Suporte Online</h5>
                    <button className="toggle-chat" onClick={() => setChatOpen(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}>
                            {msg.text}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing-indicator message bot-message">
                            <span></span><span></span><span></span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <div className="chat-input">
                    <input 
                        type="text" 
                        placeholder="Digite sua mensagem..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
