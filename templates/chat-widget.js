// Chat Widget Script — Nexora Customizable Widget
// Original template: https://github.com/juansebsol/n8n-chatbot-template (MIT License)
(function() {
    // Default configuration (overridden by window.ChatWidgetConfig)
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: { text: 'Powered by Nexora', link: 'https://nexora.app' }
        },
        style: {
            primaryColor: '#854fff',
            secondaryColor: '#6b3fd4',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        },
        bubble: {
            borderRadiusStyle: 'circle',
            backgroundColor: '',
            customIconUrl: '',
            customIconSize: 60,
            customIconBorderRadius: 15,
            internalIconsColor: '#373434',
            size: 50,
            rightPosition: 20,
            bottomPosition: 20,
            autoOpen: false,
            openDelay: 0
        },
        tooltip: {
            display: true,
            hideOnMobile: true,
            message: 'Hello 👋 How can I help you?',
            backgroundColor: '#fffff0',
            textColor: '#1c1c1c',
            fontSize: 15
        },
        window: {
            borderRadiusStyle: 'rounded',
            height: 600,
            width: 400,
            backgroundColor: '#f7f8fa',
            fontSize: 16,
            showScrollbar: true,
            showTitle: true,
            title: '',
            titleAvatarUrl: '',
            avatarSize: 40,
            avatarBorderRadius: 25,
            welcomeMessage: '',
            customErrorMessage: 'Something went wrong. Please try again.',
            starterPrompts: [],
            starterPromptFontSize: 13,
            messageBorderRadius: 8,
            renderHtml: false,
            clearOnReload: true
        },
        botMessage: {
            backgroundColor: '#f86839',
            textColor: '#fefefe',
            showAvatar: true,
            avatarUrl: '',
            showCopyIcon: false
        },
        userMessage: {
            backgroundColor: '#eeeeee',
            textColor: '#603005',
            showAvatar: true,
            avatarUrl: ''
        },
        inputField: {
            borderRadius: 5,
            placeholder: 'Type a message...',
            backgroundColor: '#ffffff',
            textColor: '#000000',
            sendButtonColor: '',
            sendButtonBorderRadius: 30,
            maxCharacters: 0,
            maxCharsWarning: 'You exceeded the character limit.',
            autoFocus: false
        },
        footer: {
            mode: 'content',
            text: 'Powered by',
            companyName: '',
            companyLink: '',
            textColor: '#303235',
            customHtml: ''
        },
        advanced: { customCss: '' }
    };

    // Deep merge helper
    function deepMerge(target, source) {
        var result = {};
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                if (source && source.hasOwnProperty(key) && typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
                    result[key] = deepMerge(target[key], source[key]);
                } else if (source && source.hasOwnProperty(key) && source[key] !== undefined) {
                    result[key] = source[key];
                } else {
                    result[key] = target[key];
                }
            }
        }
        return result;
    }

    var config = deepMerge(defaultConfig, window.ChatWidgetConfig || {});

    // Resolve dynamic defaults
    if (!config.bubble.backgroundColor) config.bubble.backgroundColor = config.style.primaryColor;
    if (!config.inputField.sendButtonColor) config.inputField.sendButtonColor = config.style.primaryColor;
    if (!config.window.title) config.window.title = config.branding.name;
    if (!config.window.welcomeMessage) config.window.welcomeMessage = config.branding.welcomeText;
    if (!config.footer.companyName) config.footer.companyName = config.branding.poweredBy.text;
    if (!config.footer.companyLink) config.footer.companyLink = config.branding.poweredBy.link;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    // --- Computed style values ---
    var bubbleRadius = config.bubble.borderRadiusStyle === 'circle' ? '50%' : config.bubble.borderRadiusStyle === 'rounded' ? '12px' : '0';
    var windowRadius = config.window.borderRadiusStyle === 'rounded' ? '12px' : '0';
    var pos = config.style.position;
    var bubbleSize = config.bubble.size + 'px';
    var bubbleBottom = config.bubble.bottomPosition + 'px';
    var bubbleHPos = pos === 'left' ? ('left:' + config.bubble.rightPosition + 'px;right:auto;') : ('right:' + config.bubble.rightPosition + 'px;');
    var windowHPos = pos === 'left' ? ('left:' + config.bubble.rightPosition + 'px;right:auto;') : ('right:' + config.bubble.rightPosition + 'px;');
    var windowBottom = (config.bubble.bottomPosition + config.bubble.size + 12) + 'px';

    // --- Build CSS ---
    var css = '\
.n8n-chat-widget{--chat-primary:' + config.style.primaryColor + ';--chat-secondary:' + config.style.secondaryColor + ';--chat-bg:' + config.style.backgroundColor + ';--chat-font:' + config.style.fontColor + ';font-family:"Geist Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}\
.ncw-toggle{position:fixed;bottom:' + bubbleBottom + ';' + bubbleHPos + 'width:' + bubbleSize + ';height:' + bubbleSize + ';border-radius:' + bubbleRadius + ';background:' + config.bubble.backgroundColor + ';border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.25);z-index:9999;display:flex;align-items:center;justify-content:center;transition:transform .2s;padding:0}\
.ncw-toggle:hover{transform:scale(1.05)}\
.ncw-toggle svg{width:60%;height:60%;fill:none;stroke:' + config.bubble.internalIconsColor + ';stroke-width:2}\
.ncw-toggle .ncw-custom-icon{width:' + config.bubble.customIconSize + '%;height:' + config.bubble.customIconSize + '%;border-radius:' + config.bubble.customIconBorderRadius + 'px;object-fit:cover}\
.ncw-tooltip{position:fixed;bottom:' + (config.bubble.bottomPosition + config.bubble.size + 10) + 'px;' + bubbleHPos + 'background:' + config.tooltip.backgroundColor + ';color:' + config.tooltip.textColor + ';font-size:' + config.tooltip.fontSize + 'px;padding:8px 14px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.12);z-index:9998;max-width:240px;font-family:inherit;cursor:pointer;white-space:nowrap;transition:opacity .3s}\
.ncw-tooltip.ncw-hidden{display:none}\
.ncw-container{position:fixed;bottom:' + windowBottom + ';' + windowHPos + 'z-index:10000;display:none;width:' + config.window.width + 'px;height:' + config.window.height + 'px;background:' + config.window.backgroundColor + ';border-radius:' + windowRadius + ';box-shadow:0 8px 32px rgba(0,0,0,.18);border:1px solid rgba(0,0,0,.1);overflow:hidden;font-family:inherit;flex-direction:column}\
.ncw-container.ncw-open{display:flex}\
.ncw-header{padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(0,0,0,.08);background:' + config.window.backgroundColor + '}\
.ncw-header-avatar{width:' + config.window.avatarSize + 'px;height:' + config.window.avatarSize + 'px;border-radius:' + config.window.avatarBorderRadius + 'px;object-fit:cover}\
.ncw-header-avatar-placeholder{width:' + config.window.avatarSize + 'px;height:' + config.window.avatarSize + 'px;border-radius:' + config.window.avatarBorderRadius + 'px;background:linear-gradient(135deg,var(--chat-primary),var(--chat-secondary));display:flex;align-items:center;justify-content:center;color:#fff}\
.ncw-header-title{font-size:16px;font-weight:600;color:' + config.style.fontColor + '}\
.ncw-close{margin-left:auto;background:none;border:none;color:' + config.style.fontColor + ';cursor:pointer;opacity:.5;font-size:20px;padding:4px}\
.ncw-close:hover{opacity:1}\
' + (config.window.showTitle ? '' : '.ncw-header{display:none}') + '\
.ncw-welcome{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}\
.ncw-welcome-text{font-size:22px;font-weight:600;color:' + config.style.fontColor + ';margin-bottom:20px;line-height:1.3}\
.ncw-start-btn{display:flex;align-items:center;gap:8px;padding:14px 24px;border:none;border-radius:8px;background:linear-gradient(135deg,var(--chat-primary),var(--chat-secondary));color:#fff;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;margin-bottom:8px;transition:opacity .2s}\
.ncw-start-btn:hover{opacity:.9}\
.ncw-response-time{font-size:13px;color:' + config.style.fontColor + ';opacity:.5;margin-top:8px}\
.ncw-prompts{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:14px}\
.ncw-prompt-chip{padding:6px 14px;border-radius:16px;border:1px solid rgba(0,0,0,.12);background:transparent;color:' + config.style.fontColor + ';font-size:' + config.window.starterPromptFontSize + 'px;cursor:pointer;font-family:inherit;transition:background .2s}\
.ncw-prompt-chip:hover{background:rgba(0,0,0,.05)}\
.ncw-chat{display:none;flex-direction:column;height:100%}\
.ncw-chat.ncw-active{display:flex}\
.ncw-messages{flex:1;overflow-y:' + (config.window.showScrollbar ? 'auto' : 'scroll') + ';padding:16px;display:flex;flex-direction:column;font-size:' + config.window.fontSize + 'px;background:' + config.window.backgroundColor + '}\
' + (config.window.showScrollbar ? '' : '.ncw-messages::-webkit-scrollbar{display:none}.ncw-messages{-ms-overflow-style:none;scrollbar-width:none}') + '\
.ncw-msg{padding:10px 14px;margin:4px 0;border-radius:' + config.window.messageBorderRadius + 'px;max-width:80%;word-wrap:break-word;font-size:inherit;line-height:1.5;position:relative}\
.ncw-msg-row{display:flex;gap:8px;align-items:flex-end;margin:4px 0}\
.ncw-msg-row.ncw-user-row{flex-direction:row-reverse}\
.ncw-msg-avatar{width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0}\
.ncw-msg-avatar-ph{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px}\
.ncw-msg.ncw-user{background:' + config.userMessage.backgroundColor + ';color:' + config.userMessage.textColor + ';align-self:flex-end}\
.ncw-msg.ncw-bot{background:' + config.botMessage.backgroundColor + ';color:' + config.botMessage.textColor + ';align-self:flex-start}\
.ncw-copy-btn{position:absolute;top:4px;right:4px;background:none;border:none;cursor:pointer;opacity:.4;padding:2px;color:inherit;display:none}\
.ncw-msg:hover .ncw-copy-btn{display:block}\
.ncw-copy-btn:hover{opacity:1}\
.ncw-input-area{padding:12px;background:' + config.window.backgroundColor + ';border-top:1px solid rgba(0,0,0,.08);display:flex;gap:8px;align-items:flex-end}\
.ncw-textarea{flex:1;padding:10px 12px;border:1px solid rgba(0,0,0,.15);border-radius:' + config.inputField.borderRadius + 'px;background:' + config.inputField.backgroundColor + ';color:' + config.inputField.textColor + ';resize:none;font-family:inherit;font-size:14px;max-height:100px;outline:none}\
.ncw-textarea::placeholder{color:' + config.inputField.textColor + ';opacity:.5}\
.ncw-send-btn{background:' + config.inputField.sendButtonColor + ';color:#fff;border:none;border-radius:' + config.inputField.sendButtonBorderRadius + 'px;width:36px;height:36px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s}\
.ncw-send-btn:hover{opacity:.85}\
.ncw-char-warn{font-size:11px;color:#e74c3c;padding:0 12px 6px;display:none}\
.ncw-footer{padding:8px;text-align:center;border-top:1px solid rgba(0,0,0,.06);background:' + config.window.backgroundColor + '}\
.ncw-footer a,.ncw-footer span{color:' + config.footer.textColor + ';text-decoration:none;font-size:12px;font-family:inherit}\
.ncw-footer a:hover{opacity:.8}\
';

    // Hide tooltip on mobile if configured
    if (config.tooltip.hideOnMobile) {
        css += '@media(max-width:767px){.ncw-tooltip{display:none!important}}';
    }

    // Custom CSS injection
    if (config.advanced.customCss) {
        css += config.advanced.customCss;
    }

    // Load Geist font
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // --- Build DOM ---
    var root = document.createElement('div');
    root.className = 'n8n-chat-widget';

    // Tooltip
    var tooltip = document.createElement('div');
    tooltip.className = 'ncw-tooltip' + (config.tooltip.display ? '' : ' ncw-hidden');
    tooltip.textContent = config.tooltip.message;
    tooltip.addEventListener('click', function() { toggleChat(); });

    // Toggle button
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'ncw-toggle';
    toggleBtn.setAttribute('aria-label', 'Open chat');
    if (config.bubble.customIconUrl) {
        var iconImg = document.createElement('img');
        iconImg.src = config.bubble.customIconUrl;
        iconImg.className = 'ncw-custom-icon';
        iconImg.alt = 'Chat';
        iconImg.onerror = function() {
            toggleBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
        };
        toggleBtn.appendChild(iconImg);
    } else {
        toggleBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    }

    // Chat container
    var container = document.createElement('div');
    container.className = 'ncw-container';

    // Header
    var headerHtml = '<div class="ncw-header">';
    if (config.window.titleAvatarUrl) {
        headerHtml += '<img class="ncw-header-avatar" src="' + escAttr(config.window.titleAvatarUrl) + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" />';
        headerHtml += '<div class="ncw-header-avatar-placeholder" style="display:none"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>';
    } else {
        headerHtml += '<div class="ncw-header-avatar-placeholder"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>';
    }
    headerHtml += '<span class="ncw-header-title">' + escHtml(config.window.title || config.branding.name) + '</span>';
    headerHtml += '<button class="ncw-close" aria-label="Close">&times;</button></div>';

    // Welcome screen
    var welcomeMsg = config.window.welcomeMessage || config.branding.welcomeText || 'Welcome!';
    var welcomeHtml = '<div class="ncw-welcome">';
    welcomeHtml += '<div class="ncw-welcome-text">' + escHtml(welcomeMsg) + '</div>';
    welcomeHtml += '<button class="ncw-start-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Send us a message</button>';
    if (config.branding.responseTimeText) {
        welcomeHtml += '<div class="ncw-response-time">' + escHtml(config.branding.responseTimeText) + '</div>';
    }
    // Starter prompts
    if (config.window.starterPrompts && config.window.starterPrompts.length > 0) {
        welcomeHtml += '<div class="ncw-prompts">';
        for (var i = 0; i < config.window.starterPrompts.length; i++) {
            welcomeHtml += '<button class="ncw-prompt-chip" data-prompt="' + escAttr(config.window.starterPrompts[i]) + '">' + escHtml(config.window.starterPrompts[i]) + '</button>';
        }
        welcomeHtml += '</div>';
    }
    welcomeHtml += '</div>';

    // Chat interface
    var chatHtml = '<div class="ncw-chat">';
    chatHtml += headerHtml;
    chatHtml += '<div class="ncw-messages"></div>';
    if (config.inputField.maxCharacters > 0) {
        chatHtml += '<div class="ncw-char-warn">' + escHtml(config.inputField.maxCharsWarning) + '</div>';
    }
    chatHtml += '<div class="ncw-input-area">';
    chatHtml += '<textarea class="ncw-textarea" placeholder="' + escAttr(config.inputField.placeholder) + '" rows="1"></textarea>';
    chatHtml += '<button class="ncw-send-btn" aria-label="Send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>';
    chatHtml += '</div></div>';

    // Footer
    var footerHtml = '<div class="ncw-footer">';
    if (config.footer.mode === 'html' && config.footer.customHtml) {
        footerHtml += config.footer.customHtml;
    } else {
        if (config.footer.companyLink) {
            footerHtml += '<a href="' + escAttr(config.footer.companyLink) + '" target="_blank" rel="noopener noreferrer">' + escHtml(config.footer.text) + ' ' + escHtml(config.footer.companyName) + '</a>';
        } else {
            footerHtml += '<span>' + escHtml(config.footer.text) + ' ' + escHtml(config.footer.companyName) + '</span>';
        }
    }
    footerHtml += '</div>';

    container.innerHTML = headerHtml + welcomeHtml + chatHtml + footerHtml;

    root.appendChild(container);
    root.appendChild(tooltip);
    root.appendChild(toggleBtn);
    document.body.appendChild(root);

    // --- Query elements ---
    var welcomeScreen = container.querySelector('.ncw-welcome');
    var chatEl = container.querySelector('.ncw-chat');
    var messagesEl = container.querySelector('.ncw-messages');
    var textarea = container.querySelector('.ncw-textarea');
    var sendBtn = container.querySelector('.ncw-send-btn');
    var charWarn = container.querySelector('.ncw-char-warn');
    var headers = container.querySelectorAll('.ncw-header');
    var chatHeader = chatEl ? chatEl.querySelector('.ncw-header') : null;

    var currentSessionId = '';
    var isOpen = false;

    // --- Event handlers ---
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            container.classList.add('ncw-open');
            tooltip.classList.add('ncw-hidden');
            if (config.inputField.autoFocus && textarea) textarea.focus();
        } else {
            container.classList.remove('ncw-open');
        }
    }

    toggleBtn.addEventListener('click', toggleChat);

    // Close buttons
    var closeBtns = container.querySelectorAll('.ncw-close');
    for (var c = 0; c < closeBtns.length; c++) {
        closeBtns[c].addEventListener('click', function() {
            isOpen = false;
            container.classList.remove('ncw-open');
        });
    }

    // Start conversation button
    var startBtn = container.querySelector('.ncw-start-btn');
    if (startBtn) startBtn.addEventListener('click', function() { startNewConversation(); });

    // Starter prompt chips
    var promptChips = container.querySelectorAll('.ncw-prompt-chip');
    for (var p = 0; p < promptChips.length; p++) {
        promptChips[p].addEventListener('click', function() {
            startNewConversation(this.getAttribute('data-prompt'));
        });
    }

    // Send
    if (sendBtn) sendBtn.addEventListener('click', function() { trySend(); });
    if (textarea) {
        textarea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); trySend(); }
        });
        // Character limit
        if (config.inputField.maxCharacters > 0) {
            textarea.addEventListener('input', function() {
                if (textarea.value.length > config.inputField.maxCharacters) {
                    if (charWarn) charWarn.style.display = 'block';
                } else {
                    if (charWarn) charWarn.style.display = 'none';
                }
            });
        }
    }

    // Auto open
    if (config.bubble.autoOpen) {
        var delay = (config.bubble.openDelay || 0) * 1000;
        setTimeout(function() { if (!isOpen) toggleChat(); }, delay);
    }

    // Clear on reload
    if (config.window.clearOnReload) {
        // Default behavior — each page load starts fresh (no action needed)
    }

    // --- Chat logic ---
    function generateUUID() { return crypto.randomUUID(); }

    function startNewConversation(initialMessage) {
        currentSessionId = generateUUID();
        var data = [{
            action: 'loadPreviousSession',
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: { userId: '' }
        }];

        // Show chat interface
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        // Hide non-chat header (the welcome screen header)
        if (headers.length > 0) headers[0].style.display = 'none';
        if (chatEl) chatEl.classList.add('ncw-active');
        if (config.inputField.autoFocus && textarea) textarea.focus();

        fetch(config.webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(function(r) { return r.json(); }).then(function(resp) {
            var output = Array.isArray(resp) ? resp[0].output : resp.output;
            appendMessage(output, 'bot');
            if (initialMessage) sendMessage(initialMessage);
        }).catch(function() {
            appendMessage(config.window.customErrorMessage, 'bot');
        });
    }

    function trySend() {
        if (!textarea) return;
        var msg = textarea.value.trim();
        if (!msg) return;
        if (config.inputField.maxCharacters > 0 && msg.length > config.inputField.maxCharacters) return;
        textarea.value = '';
        if (charWarn) charWarn.style.display = 'none';
        sendMessage(msg);
    }

    function sendMessage(message) {
        appendMessage(message, 'user');
        var payload = {
            action: 'sendMessage',
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: { userId: '' }
        };

        fetch(config.webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function(r) { return r.json(); }).then(function(resp) {
            var output = Array.isArray(resp) ? resp[0].output : resp.output;
            appendMessage(output, 'bot');
        }).catch(function() {
            appendMessage(config.window.customErrorMessage, 'bot');
        });
    }

    function appendMessage(text, type) {
        if (!messagesEl) return;
        var row = document.createElement('div');
        row.className = 'ncw-msg-row' + (type === 'user' ? ' ncw-user-row' : '');

        // Avatar
        var showAvatar = type === 'bot' ? config.botMessage.showAvatar : config.userMessage.showAvatar;
        var avatarUrl = type === 'bot' ? config.botMessage.avatarUrl : config.userMessage.avatarUrl;
        if (showAvatar) {
            if (avatarUrl) {
                var av = document.createElement('img');
                av.className = 'ncw-msg-avatar';
                av.src = avatarUrl;
                av.alt = '';
                av.onerror = function() { this.style.display = 'none'; };
                row.appendChild(av);
            } else {
                var ph = document.createElement('div');
                ph.className = 'ncw-msg-avatar-ph';
                ph.style.background = type === 'bot' ? config.botMessage.backgroundColor : config.userMessage.backgroundColor;
                ph.style.color = type === 'bot' ? config.botMessage.textColor : config.userMessage.textColor;
                ph.innerHTML = type === 'bot' ? '&#9679;' : '&#9679;';
                row.appendChild(ph);
            }
        }

        var msgEl = document.createElement('div');
        msgEl.className = 'ncw-msg ' + (type === 'user' ? 'ncw-user' : 'ncw-bot');
        if (config.window.renderHtml && type === 'bot') {
            msgEl.innerHTML = text;
        } else {
            msgEl.textContent = text;
        }

        // Copy button for bot messages
        if (type === 'bot' && config.botMessage.showCopyIcon) {
            var copyBtn = document.createElement('button');
            copyBtn.className = 'ncw-copy-btn';
            copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
            copyBtn.title = 'Copy';
            copyBtn.addEventListener('click', function() {
                var t = msgEl.textContent || '';
                if (navigator.clipboard) navigator.clipboard.writeText(t);
            });
            msgEl.appendChild(copyBtn);
        }

        row.appendChild(msgEl);
        messagesEl.appendChild(row);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // --- Helpers ---
    function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function escAttr(s) { return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})();