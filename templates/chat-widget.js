// Chat Widget Script — Nexora Customizable Widget
// Original template: https://github.com/juansebsol/n8n-chatbot-template (MIT License)
(function() {
    // Default configuration (overridden by window.ChatWidgetConfig)
    var defaultConfig = {
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
            openDelay: 0,
            animation: 'none',
            animationSpeed: 'normal',
            animateOnlyOnLoad: false
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
            clearOnReload: true,
            showBackToWelcome: true,
            showRefreshButton: true,
            showSendButton: true,
            sendButtonIcon: 'arrow-up',
            showTimestamps: false,
            timestampFormat: '12-hour',
            timestampColor: '#999999',
            timestampFontSize: 11,
            showSocialIcons: false,
            socialLinks: [],
            socialIconSize: 18,
            socialIconColor: '',
            shadowEnabled: false,
            shadowColor1: '',
            shadowColor2: '',
            shadowBlur: 20,
            shadowSpread: 5,
            shadowAnimate: false,
            shadowAnimationSpeed: 3
        },
        botMessage: {
            backgroundColor: '#f86839',
            textColor: '#fefefe',
            showAvatar: true,
            avatarUrl: '',
            showCopyIcon: false,
            showTypingIndicator: true,
            typingIndicatorColor: ''
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
            autoFocus: false,
            showEmojiPicker: false
        },
        footer: {
            mode: 'content',
            text: 'Powered by',
            companyName: '',
            companyLink: '',
            textColor: '#303235',
            customHtml: '',
            showLogo: false,
            logoSource: 'brand',
            customLogoUrl: '',
            logoPosition: 'left',
            logoSize: 16
        },
        advanced: {
            customCss: '',
            enableLanguageSelector: false,
            availableLanguages: ['en'],
            defaultLanguage: 'en',
            enableCustomCursor: false,
            cursorType: 'preset',
            presetCursor: 'pointer',
            customCursorUrl: '',
            enableColorTransitions: false,
            colorTransitions: {
                headerTransition: false, headerColor1: '', headerColor2: '',
                toggleTransition: false, toggleColor1: '', toggleColor2: '',
                userMessageTransition: false, userMessageColor1: '', userMessageColor2: '',
                botMessageTransition: false, botMessageColor1: '', botMessageColor2: '',
                transitionSpeed: 3
            },
            enableFallingEffect: false,
            fallingEffect: {
                effectSource: 'brand', customImageUrl: '', emoji: '✨',
                particleCount: 15, fallSpeed: 'medium', particleSize: 20,
                showOnDesktop: true, showOnMobile: false
            }
        },
        welcomePage: {
            welcomeButtonText: 'Send us a message',
            showWelcomeLogo: true,
            welcomeLogoSource: 'brand',
            welcomeCustomLogoUrl: '',
            welcomeLogoPosition: 'top-center',
            welcomeLogoSize: 60,
            welcomeLogoAnimation: 'none',
            welcomeButtonAnimation: 'none',
            welcomeBackgroundColor: ''
        }
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
    if (!config.window.shadowColor1) config.window.shadowColor1 = config.style.primaryColor;
    if (!config.window.shadowColor2) config.window.shadowColor2 = config.style.secondaryColor;
    if (!config.botMessage.typingIndicatorColor) config.botMessage.typingIndicatorColor = config.botMessage.backgroundColor;
    if (!config.window.socialIconColor) config.window.socialIconColor = config.style.fontColor;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    // --- i18n ---
    var translations = {
        en: { sendBtn: 'Send us a message', placeholder: 'Type a message...', poweredBy: 'Powered by', back: 'Back' },
        fr: { sendBtn: 'Envoyez-nous un message', placeholder: 'Écrivez un message...', poweredBy: 'Propulsé par', back: 'Retour' },
        ar: { sendBtn: 'أرسل لنا رسالة', placeholder: '...اكتب رسالة', poweredBy: 'مدعوم من', back: 'رجوع' }
    };
    var currentLang = config.advanced.defaultLanguage || 'en';
    if (config.advanced.enableLanguageSelector) {
        var storedLang = null;
        try { storedLang = localStorage.getItem('nexora-widget-lang'); } catch(e){}
        if (storedLang && translations[storedLang]) currentLang = storedLang;
    }
    function t(key) { return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key; }

    // --- Computed style values ---
    var bubbleRadius = config.bubble.borderRadiusStyle === 'circle' ? '50%' : config.bubble.borderRadiusStyle === 'rounded' ? '12px' : '0';
    var windowRadius = config.window.borderRadiusStyle === 'rounded' ? '12px' : '0';
    var pos = config.style.position;
    var bubbleSize = config.bubble.size + 'px';
    var bubbleBottom = config.bubble.bottomPosition + 'px';
    var bubbleHPos = pos === 'left' ? ('left:' + config.bubble.rightPosition + 'px;right:auto;') : ('right:' + config.bubble.rightPosition + 'px;');
    var windowHPos = pos === 'left' ? ('left:' + config.bubble.rightPosition + 'px;right:auto;') : ('right:' + config.bubble.rightPosition + 'px;');
    var windowBottom = (config.bubble.bottomPosition + config.bubble.size + 12) + 'px';

    // --- Bubble animation keyframes ---
    var animSpeedMap = { slow: '2s', normal: '1.2s', fast: '0.6s' };
    var animDuration = animSpeedMap[config.bubble.animationSpeed] || '1.2s';
    var bubbleAnimCSS = '';
    if (config.bubble.animation !== 'none') {
        var animName = 'ncw-anim-' + config.bubble.animation;
        var kf = '';
        switch (config.bubble.animation) {
            case 'bounce': kf = '@keyframes ' + animName + '{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}'; break;
            case 'float': kf = '@keyframes ' + animName + '{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}'; break;
            case 'pulse': kf = '@keyframes ' + animName + '{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}'; break;
            case 'shake': kf = '@keyframes ' + animName + '{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}'; break;
            case 'wiggle': kf = '@keyframes ' + animName + '{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}'; break;
        }
        bubbleAnimCSS = kf + '\n.ncw-toggle.ncw-animated{animation:' + animName + ' ' + animDuration + ' ease-in-out ' + (config.bubble.animateOnlyOnLoad ? '1' : 'infinite') + '}';
    }

    // --- Shadow animation ---
    var shadowCSS = '';
    if (config.window.shadowEnabled) {
        var sc1 = config.window.shadowColor1, sc2 = config.window.shadowColor2;
        var sBlur = config.window.shadowBlur, sSpread = config.window.shadowSpread;
        if (config.window.shadowAnimate) {
            shadowCSS = '@keyframes ncw-shadow-pulse{0%,100%{box-shadow:0 0 ' + sBlur + 'px ' + sSpread + 'px ' + sc1 + '80}50%{box-shadow:0 0 ' + sBlur + 'px ' + sSpread + 'px ' + sc2 + '80}}\n.ncw-container{animation:ncw-shadow-pulse ' + config.window.shadowAnimationSpeed + 's ease-in-out infinite}';
        } else {
            shadowCSS = '.ncw-container{box-shadow:0 0 ' + sBlur + 'px ' + sSpread + 'px ' + sc1 + '80}';
        }
    }

    // --- Color transition keyframes ---
    var ctCSS = '';
    if (config.advanced.enableColorTransitions) {
        var ct = config.advanced.colorTransitions;
        var ctSpeed = ct.transitionSpeed + 's';
        if (ct.headerTransition) ctCSS += '@keyframes ncw-ct-header{0%,100%{background:' + (ct.headerColor1||config.style.primaryColor) + '}50%{background:' + (ct.headerColor2||config.style.secondaryColor) + '}}\n.ncw-header{animation:ncw-ct-header ' + ctSpeed + ' ease-in-out infinite}\n';
        if (ct.toggleTransition) ctCSS += '@keyframes ncw-ct-toggle{0%,100%{background:' + (ct.toggleColor1||config.style.primaryColor) + '}50%{background:' + (ct.toggleColor2||config.style.secondaryColor) + '}}\n.ncw-toggle{animation:ncw-ct-toggle ' + ctSpeed + ' ease-in-out infinite}\n';
        if (ct.userMessageTransition) ctCSS += '@keyframes ncw-ct-umsg{0%,100%{background:' + (ct.userMessageColor1||config.style.primaryColor) + '}50%{background:' + (ct.userMessageColor2||config.style.secondaryColor) + '}}\n.ncw-msg.ncw-user{animation:ncw-ct-umsg ' + ctSpeed + ' ease-in-out infinite}\n';
        if (ct.botMessageTransition) ctCSS += '@keyframes ncw-ct-bmsg{0%,100%{background:' + (ct.botMessageColor1||config.botMessage.backgroundColor) + '}50%{background:' + (ct.botMessageColor2||config.style.secondaryColor) + '}}\n.ncw-msg.ncw-bot{animation:ncw-ct-bmsg ' + ctSpeed + ' ease-in-out infinite}\n';
    }

    // --- Custom cursor ---
    var cursorCSS = '';
    if (config.advanced.enableCustomCursor) {
        if (config.advanced.cursorType === 'custom' && config.advanced.customCursorUrl) {
            cursorCSS = '.ncw-container,.ncw-container *{cursor:url(' + config.advanced.customCursorUrl + '),auto}';
        } else {
            cursorCSS = '.ncw-container,.ncw-container *{cursor:' + (config.advanced.presetCursor || 'pointer') + '}';
        }
    }

    // --- Welcome page animation keyframes ---
    var wpAnimCSS = '';
    function addWpAnim(name) {
        switch(name) {
            case 'bounce': wpAnimCSS += '@keyframes ncw-wp-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}'; break;
            case 'float': wpAnimCSS += '@keyframes ncw-wp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}'; break;
            case 'pulse': wpAnimCSS += '@keyframes ncw-wp-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}'; break;
            case 'spin': wpAnimCSS += '@keyframes ncw-wp-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}'; break;
            case 'glow': wpAnimCSS += '@keyframes ncw-wp-glow{0%,100%{box-shadow:0 0 5px rgba(0,0,0,0.2)}50%{box-shadow:0 0 20px ' + config.style.primaryColor + '80}}'; break;
        }
    }
    if (config.welcomePage.welcomeLogoAnimation !== 'none') addWpAnim(config.welcomePage.welcomeLogoAnimation);
    if (config.welcomePage.welcomeButtonAnimation !== 'none') addWpAnim(config.welcomePage.welcomeButtonAnimation);

    // --- Send button icon SVGs ---
    var sendIconSVGs = {
        'arrow-up': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
        'paper-plane': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
        'send': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>'
    };
    var sendIconHtml = sendIconSVGs[config.window.sendButtonIcon] || sendIconSVGs['arrow-up'];

    // --- Social icon SVGs ---
    var socialIcons = {
        Website: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        Facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
        'Twitter/X': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
        LinkedIn: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
        YouTube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>',
        TikTok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.93 2.93 0 0 1 .88.13V9.01a6.31 6.31 0 0 0-1-.05 6.35 6.35 0 1 0 6.35 6.35v-6.9a8.19 8.19 0 0 0 4.87 1.36V6.69z"/></svg>',
        WhatsApp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
        Telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
        GitHub: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
    };

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
.ncw-header{padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(0,0,0,.08);background:' + config.window.backgroundColor + ';flex-shrink:0}\
.ncw-header-avatar{width:' + config.window.avatarSize + 'px;height:' + config.window.avatarSize + 'px;border-radius:' + config.window.avatarBorderRadius + 'px;object-fit:cover}\
.ncw-header-avatar-placeholder{width:' + config.window.avatarSize + 'px;height:' + config.window.avatarSize + 'px;border-radius:' + config.window.avatarBorderRadius + 'px;background:linear-gradient(135deg,var(--chat-primary),var(--chat-secondary));display:flex;align-items:center;justify-content:center;color:#fff}\
.ncw-header-title{font-size:16px;font-weight:600;color:' + config.style.fontColor + '}\
.ncw-header-actions{margin-left:auto;display:flex;align-items:center;gap:2px}\
.ncw-header-btn{background:none;border:none;color:' + config.style.fontColor + ';cursor:pointer;opacity:.5;padding:4px;display:flex;align-items:center;justify-content:center;border-radius:4px}\
.ncw-header-btn:hover{opacity:1;background:rgba(0,0,0,.05)}\
.ncw-lang-btn{font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;border:1px solid rgba(0,0,0,.15);background:none;cursor:pointer;color:' + config.style.fontColor + ';opacity:.6;margin-right:4px}\
.ncw-lang-btn.ncw-lang-active{opacity:1;background:var(--chat-primary);color:#fff;border-color:var(--chat-primary)}\
' + (config.window.showTitle ? '' : '.ncw-header{display:none}') + '\
.ncw-social-row{display:flex;gap:6px;padding:4px 16px 8px;border-bottom:1px solid rgba(0,0,0,.06)}\
.ncw-social-icon{display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.7;transition:opacity .2s}\
.ncw-social-icon:hover{opacity:1}\
.ncw-social-icon svg{width:' + config.window.socialIconSize + 'px;height:' + config.window.socialIconSize + 'px;color:' + config.window.socialIconColor + '}\
.ncw-welcome{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;background:' + (config.welcomePage.welcomeBackgroundColor || config.window.backgroundColor) + '}\
.ncw-welcome-logo{object-fit:contain;margin-bottom:12px}\
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
.ncw-timestamp{font-size:' + config.window.timestampFontSize + 'px;color:' + config.window.timestampColor + ';margin-top:2px;margin-bottom:2px}\
.ncw-msg-row.ncw-user-row .ncw-timestamp{text-align:right}\
.ncw-copy-btn{position:absolute;top:4px;right:4px;background:none;border:none;cursor:pointer;opacity:.4;padding:2px;color:inherit;display:none}\
.ncw-msg:hover .ncw-copy-btn{display:block}\
.ncw-copy-btn:hover{opacity:1}\
.ncw-typing{display:flex;gap:4px;padding:10px 14px;border-radius:' + config.window.messageBorderRadius + 'px;background:' + config.botMessage.backgroundColor + ';align-self:flex-start;max-width:60px}\
.ncw-typing-dot{width:8px;height:8px;border-radius:50%;background:' + config.botMessage.typingIndicatorColor + ';animation:ncw-typing-bounce 1.4s ease-in-out infinite}\
.ncw-typing-dot:nth-child(2){animation-delay:.2s}\
.ncw-typing-dot:nth-child(3){animation-delay:.4s}\
@keyframes ncw-typing-bounce{0%,80%,100%{transform:scale(0.6);opacity:.4}40%{transform:scale(1);opacity:1}}\
.ncw-input-area{padding:12px;background:' + config.window.backgroundColor + ';border-top:1px solid rgba(0,0,0,.08);display:flex;gap:8px;align-items:flex-end;flex-shrink:0;position:relative}\
.ncw-textarea{flex:1;padding:10px 12px;border:1px solid rgba(0,0,0,.15);border-radius:' + config.inputField.borderRadius + 'px;background:' + config.inputField.backgroundColor + ';color:' + config.inputField.textColor + ';resize:none;font-family:inherit;font-size:14px;max-height:100px;outline:none}\
.ncw-textarea::placeholder{color:' + config.inputField.textColor + ';opacity:.5}\
.ncw-send-btn{background:' + config.inputField.sendButtonColor + ';color:#fff;border:none;border-radius:' + config.inputField.sendButtonBorderRadius + 'px;width:36px;height:36px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s}\
.ncw-send-btn:hover{opacity:.85}\
.ncw-send-btn:disabled{opacity:.4;cursor:default}\
.ncw-emoji-btn{background:none;border:none;cursor:pointer;font-size:20px;padding:4px;opacity:.6;display:flex;align-items:center}\
.ncw-emoji-btn:hover{opacity:1}\
.ncw-emoji-picker{position:absolute;bottom:60px;left:12px;right:12px;background:#fff;border:1px solid rgba(0,0,0,.15);border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.15);z-index:10;max-height:250px;display:none;flex-direction:column}\
.ncw-emoji-picker.ncw-picker-open{display:flex}\
.ncw-emoji-tabs{display:flex;border-bottom:1px solid rgba(0,0,0,.1);padding:4px}\
.ncw-emoji-tab{flex:1;text-align:center;padding:4px;cursor:pointer;font-size:16px;border-radius:4px;border:none;background:none}\
.ncw-emoji-tab:hover,.ncw-emoji-tab.active{background:rgba(0,0,0,.08)}\
.ncw-emoji-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:2px;padding:8px;overflow-y:auto;max-height:200px}\
.ncw-emoji-item{text-align:center;font-size:20px;padding:4px;cursor:pointer;border-radius:4px;border:none;background:none}\
.ncw-emoji-item:hover{background:rgba(0,0,0,.08)}\
.ncw-char-warn{font-size:11px;color:#e74c3c;padding:0 12px 6px;display:none}\
.ncw-footer{padding:8px;text-align:center;border-top:1px solid rgba(0,0,0,.06);background:' + config.window.backgroundColor + ';flex-shrink:0;display:flex;align-items:center;justify-content:center;gap:6px}\
.ncw-footer a,.ncw-footer span{color:' + config.footer.textColor + ';text-decoration:none;font-size:12px;font-family:inherit}\
.ncw-footer a:hover{opacity:.8}\
.ncw-footer-logo{object-fit:contain}\
.ncw-falling-container{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:hidden;z-index:1}\
.ncw-falling-particle{position:absolute;animation:ncw-fall linear forwards}\
@keyframes ncw-fall{0%{top:-30px;opacity:1}100%{top:100%;opacity:0}}\
';

    // Welcome page animations
    if (config.welcomePage.welcomeLogoAnimation !== 'none') {
        var la = config.welcomePage.welcomeLogoAnimation;
        var animRef = la === 'spin' ? 'ncw-wp-spin 2s linear infinite' : 'ncw-wp-' + la + ' 1.5s ease-in-out infinite';
        css += '.ncw-welcome-logo{animation:' + animRef + '}\n';
    }
    if (config.welcomePage.welcomeButtonAnimation !== 'none') {
        var ba = config.welcomePage.welcomeButtonAnimation;
        var btnAnimRef = ba === 'glow' ? 'ncw-wp-glow 2s ease-in-out infinite' : 'ncw-wp-' + ba + ' 1.5s ease-in-out infinite';
        css += '.ncw-start-btn,.ncw-prompt-chip{animation:' + btnAnimRef + '}\n';
    }

    // Hide tooltip on mobile if configured
    if (config.tooltip.hideOnMobile) {
        css += '@media(max-width:767px){.ncw-tooltip{display:none!important}}';
    }

    // Append animation CSS
    css += bubbleAnimCSS + '\n' + shadowCSS + '\n' + ctCSS + '\n' + cursorCSS + '\n' + wpAnimCSS + '\n';

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
    toggleBtn.className = 'ncw-toggle' + (config.bubble.animation !== 'none' ? ' ncw-animated' : '');
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

    // --- Build header HTML ---
    var headerHtml = '<div class="ncw-header">';
    if (config.window.titleAvatarUrl) {
        headerHtml += '<img class="ncw-header-avatar" src="' + escAttr(config.window.titleAvatarUrl) + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" />';
        headerHtml += '<div class="ncw-header-avatar-placeholder" style="display:none"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>';
    } else {
        headerHtml += '<div class="ncw-header-avatar-placeholder"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>';
    }
    headerHtml += '<span class="ncw-header-title">' + escHtml(config.window.title || config.branding.name) + '</span>';

    // Language selector buttons
    if (config.advanced.enableLanguageSelector && config.advanced.availableLanguages.length > 1) {
        headerHtml += '<div class="ncw-lang-btns" style="margin-left:auto;display:flex;gap:3px">';
        var langs = config.advanced.availableLanguages;
        for (var li = 0; li < langs.length; li++) {
            headerHtml += '<button class="ncw-lang-btn' + (langs[li] === currentLang ? ' ncw-lang-active' : '') + '" data-lang="' + escAttr(langs[li]) + '">' + escHtml(langs[li].toUpperCase()) + '</button>';
        }
        headerHtml += '</div>';
    }

    // Header action buttons
    headerHtml += '<div class="ncw-header-actions"' + (config.advanced.enableLanguageSelector && config.advanced.availableLanguages.length > 1 ? '' : ' style="margin-left:auto"') + '>';
    if (config.window.showBackToWelcome) {
        headerHtml += '<button class="ncw-header-btn ncw-back-btn" aria-label="Back" title="' + t('back') + '" style="display:none"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>';
    }
    if (config.window.showRefreshButton) {
        headerHtml += '<button class="ncw-header-btn ncw-refresh-btn" aria-label="Refresh"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></button>';
    }
    headerHtml += '<button class="ncw-header-btn ncw-close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
    headerHtml += '</div></div>';

    // Social icons row
    var socialHtml = '';
    if (config.window.showSocialIcons && config.window.socialLinks && config.window.socialLinks.length > 0) {
        socialHtml = '<div class="ncw-social-row">';
        for (var si = 0; si < config.window.socialLinks.length && si < 5; si++) {
            var sl = config.window.socialLinks[si];
            var iconSvg = socialIcons[sl.platform] || socialIcons.Website;
            socialHtml += '<a class="ncw-social-icon" href="' + escAttr(sl.url) + '" target="_blank" rel="noopener noreferrer" title="' + escAttr(sl.platform) + '">' + iconSvg + '</a>';
        }
        socialHtml += '</div>';
    }

    // --- Welcome screen ---
    var welcomeMsg = config.window.welcomeMessage || config.branding.welcomeText || 'Welcome!';
    var welcomeLogoHtml = '';
    if (config.welcomePage.showWelcomeLogo) {
        var wLogoSrc = config.welcomePage.welcomeLogoSource === 'custom' ? config.welcomePage.welcomeCustomLogoUrl : config.branding.logo;
        if (wLogoSrc) {
            var wLogoPos = config.welcomePage.welcomeLogoPosition;
            var posStyle = '';
            if (wLogoPos === 'top-left') posStyle = 'align-self:flex-start;';
            else if (wLogoPos === 'top-right') posStyle = 'align-self:flex-end;';
            welcomeLogoHtml = '<img class="ncw-welcome-logo" src="' + escAttr(wLogoSrc) + '" alt="" style="width:' + config.welcomePage.welcomeLogoSize + 'px;height:' + config.welcomePage.welcomeLogoSize + 'px;' + posStyle + '" onerror="this.style.display=\'none\'" />';
        }
    }
    var welcomeHtml = '<div class="ncw-welcome">';
    var wLP = config.welcomePage.welcomeLogoPosition;
    if (wLP === 'top-center' || wLP === 'top-left' || wLP === 'top-right') welcomeHtml += welcomeLogoHtml;
    if (wLP === 'above-text') welcomeHtml += welcomeLogoHtml;
    welcomeHtml += '<div class="ncw-welcome-text">' + escHtml(welcomeMsg) + '</div>';
    if (wLP === 'below-text') welcomeHtml += welcomeLogoHtml;
    welcomeHtml += '<button class="ncw-start-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="ncw-start-btn-text">' + escHtml(config.welcomePage.welcomeButtonText || t('sendBtn')) + '</span></button>';
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

    // --- Chat interface ---
    var chatHtml = '<div class="ncw-chat">';
    chatHtml += '<div class="ncw-messages"></div>';
    if (config.inputField.maxCharacters > 0) {
        chatHtml += '<div class="ncw-char-warn">' + escHtml(config.inputField.maxCharsWarning) + '</div>';
    }
    chatHtml += '<div class="ncw-input-area">';
    if (config.inputField.showEmojiPicker) {
        chatHtml += '<button class="ncw-emoji-btn" type="button" aria-label="Emoji">😊</button>';
    }
    chatHtml += '<textarea class="ncw-textarea" placeholder="' + escAttr(config.inputField.placeholder) + '" rows="1"></textarea>';
    if (config.window.showSendButton) {
        chatHtml += '<button class="ncw-send-btn" aria-label="Send" disabled>' + sendIconHtml + '</button>';
    }
    chatHtml += '</div>';
    // Emoji picker
    if (config.inputField.showEmojiPicker) {
        chatHtml += '<div class="ncw-emoji-picker"></div>';
    }
    chatHtml += '</div>';

    // --- Footer ---
    var footerHtml = '<div class="ncw-footer">';
    if (config.footer.mode === 'html' && config.footer.customHtml) {
        footerHtml += config.footer.customHtml;
    } else {
        var footerLogoImg = '';
        if (config.footer.showLogo) {
            var fLogoSrc = config.footer.logoSource === 'custom' ? config.footer.customLogoUrl : config.branding.logo;
            if (fLogoSrc) {
                footerLogoImg = '<img class="ncw-footer-logo" src="' + escAttr(fLogoSrc) + '" alt="" style="width:' + config.footer.logoSize + 'px;height:' + config.footer.logoSize + 'px;" onerror="this.style.display=\'none\'" />';
            }
        }
        var footerTextContent = '';
        if (config.footer.companyLink) {
            footerTextContent = '<a href="' + escAttr(config.footer.companyLink) + '" target="_blank" rel="noopener noreferrer">' + escHtml(config.footer.text) + ' ' + escHtml(config.footer.companyName) + '</a>';
        } else {
            footerTextContent = '<span>' + escHtml(config.footer.text) + ' ' + escHtml(config.footer.companyName) + '</span>';
        }
        if (config.footer.showLogo && footerLogoImg) {
            if (config.footer.logoPosition === 'left') footerHtml += footerLogoImg + footerTextContent;
            else if (config.footer.logoPosition === 'right') footerHtml += footerTextContent + footerLogoImg;
            else footerHtml += footerLogoImg + footerTextContent;
        } else {
            footerHtml += footerTextContent;
        }
    }
    footerHtml += '</div>';

    // Assemble container
    container.innerHTML = headerHtml + socialHtml + welcomeHtml + chatHtml + footerHtml;

    // Apply RTL for Arabic
    if (currentLang === 'ar') container.setAttribute('dir', 'rtl');

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
    var backBtn = container.querySelector('.ncw-back-btn');
    var refreshBtn = container.querySelector('.ncw-refresh-btn');
    var emojiBtn = container.querySelector('.ncw-emoji-btn');
    var emojiPicker = container.querySelector('.ncw-emoji-picker');

    var currentSessionId = '';
    var isOpen = false;
    var inChatMode = false;

    // --- Enable/disable send button based on input ---
    if (textarea && sendBtn) {
        textarea.addEventListener('input', function() {
            sendBtn.disabled = !textarea.value.trim();
        });
    }

    // --- Event handlers ---
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            container.classList.add('ncw-open');
            tooltip.classList.add('ncw-hidden');
            toggleBtn.classList.remove('ncw-animated');
            if (config.inputField.autoFocus && textarea && inChatMode) textarea.focus();
        } else {
            container.classList.remove('ncw-open');
            if (config.bubble.animation !== 'none' && !config.bubble.animateOnlyOnLoad) {
                toggleBtn.classList.add('ncw-animated');
            }
        }
    }

    toggleBtn.addEventListener('click', toggleChat);

    // Close buttons
    var closeBtns = container.querySelectorAll('.ncw-close');
    for (var c = 0; c < closeBtns.length; c++) {
        closeBtns[c].addEventListener('click', function() {
            isOpen = false;
            container.classList.remove('ncw-open');
            if (config.bubble.animation !== 'none' && !config.bubble.animateOnlyOnLoad) {
                toggleBtn.classList.add('ncw-animated');
            }
        });
    }

    // Back to welcome button
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (chatEl) chatEl.classList.remove('ncw-active');
            if (welcomeScreen) welcomeScreen.style.display = '';
            if (backBtn) backBtn.style.display = 'none';
            inChatMode = false;
        });
    }

    // Refresh button
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            if (messagesEl) messagesEl.innerHTML = '';
            currentSessionId = '';
            if (chatEl) chatEl.classList.remove('ncw-active');
            if (welcomeScreen) welcomeScreen.style.display = '';
            if (backBtn) backBtn.style.display = 'none';
            inChatMode = false;
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

    // Language selector
    if (config.advanced.enableLanguageSelector) {
        var langBtns = container.querySelectorAll('.ncw-lang-btn');
        for (var lb = 0; lb < langBtns.length; lb++) {
            langBtns[lb].addEventListener('click', function() {
                var newLang = this.getAttribute('data-lang');
                if (!newLang || newLang === currentLang) return;
                currentLang = newLang;
                try { localStorage.setItem('nexora-widget-lang', newLang); } catch(e){}
                var allLb = container.querySelectorAll('.ncw-lang-btn');
                for (var x = 0; x < allLb.length; x++) allLb[x].classList.remove('ncw-lang-active');
                this.classList.add('ncw-lang-active');
                var startBtnText = container.querySelector('.ncw-start-btn-text');
                if (startBtnText && !config.welcomePage.welcomeButtonText) startBtnText.textContent = t('sendBtn');
                if (textarea) textarea.placeholder = t('placeholder');
                if (newLang === 'ar') container.setAttribute('dir', 'rtl');
                else container.removeAttribute('dir');
            });
        }
    }

    // --- Emoji picker ---
    if (emojiBtn && emojiPicker) {
        var emojiData = {
            'Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😗','😋','😛','😜','🤪','😝','🤑','🤗','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐'],
            'Gestures': ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏'],
            'Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💕','💞','💓','💗','💖','💘','💝','💔','❣️','💟','♥️','🫶'],
            'Objects': ['⭐','🌟','✨','💫','🎉','🎊','🎈','🎁','🏆','🔥','💯','📌','💡','📧','📱','💻','🎵','🎶','📷','🌈','☀️','🌙','⚡','💎','🔑','🛒']
        };
        var emojiCategories = Object.keys(emojiData);
        var currentEmojiCat = emojiCategories[0];

        function buildEmojiPicker() {
            var html = '<div class="ncw-emoji-tabs">';
            var catIcons = { Smileys: '😀', Gestures: '👋', Hearts: '❤️', Objects: '⭐' };
            for (var ec = 0; ec < emojiCategories.length; ec++) {
                var cat = emojiCategories[ec];
                html += '<button class="ncw-emoji-tab' + (cat === currentEmojiCat ? ' active' : '') + '" data-cat="' + cat + '">' + catIcons[cat] + '</button>';
            }
            html += '</div><div class="ncw-emoji-grid">';
            var emojis = emojiData[currentEmojiCat];
            for (var ei = 0; ei < emojis.length; ei++) {
                html += '<button class="ncw-emoji-item" data-emoji="' + emojis[ei] + '">' + emojis[ei] + '</button>';
            }
            html += '</div>';
            emojiPicker.innerHTML = html;

            var tabs = emojiPicker.querySelectorAll('.ncw-emoji-tab');
            for (var ti = 0; ti < tabs.length; ti++) {
                tabs[ti].addEventListener('click', function() {
                    currentEmojiCat = this.getAttribute('data-cat');
                    buildEmojiPicker();
                });
            }
            var items = emojiPicker.querySelectorAll('.ncw-emoji-item');
            for (var it = 0; it < items.length; it++) {
                items[it].addEventListener('click', function() {
                    var emoji = this.getAttribute('data-emoji');
                    if (textarea) {
                        var start = textarea.selectionStart;
                        var end = textarea.selectionEnd;
                        textarea.value = textarea.value.substring(0, start) + emoji + textarea.value.substring(end);
                        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
                        textarea.focus();
                        if (sendBtn) sendBtn.disabled = !textarea.value.trim();
                    }
                    emojiPicker.classList.remove('ncw-picker-open');
                });
            }
        }
        buildEmojiPicker();

        emojiBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            emojiPicker.classList.toggle('ncw-picker-open');
        });
        document.addEventListener('click', function() {
            if (emojiPicker) emojiPicker.classList.remove('ncw-picker-open');
        });
        container.addEventListener('click', function(e) {
            if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
                emojiPicker.classList.remove('ncw-picker-open');
            }
        });
    }

    // Auto open
    if (config.bubble.autoOpen) {
        var delay = (config.bubble.openDelay || 0) * 1000;
        setTimeout(function() { if (!isOpen) toggleChat(); }, delay);
    }

    // --- Falling effect ---
    if (config.advanced.enableFallingEffect) {
        var fe = config.advanced.fallingEffect;
        var isMobile = window.innerWidth < 768;
        if ((isMobile && fe.showOnMobile) || (!isMobile && fe.showOnDesktop)) {
            var fallingContainer = document.createElement('div');
            fallingContainer.className = 'ncw-falling-container';
            container.appendChild(fallingContainer);

            function createParticle() {
                var p = document.createElement('div');
                p.className = 'ncw-falling-particle';
                p.style.left = (Math.random() * 100) + '%';
                var speedMap = { slow: 6, medium: 4, fast: 2 };
                var duration = (speedMap[fe.fallSpeed] || 4) + Math.random() * 2;
                p.style.animationDuration = duration + 's';
                p.style.width = fe.particleSize + 'px';
                p.style.height = fe.particleSize + 'px';
                if (fe.effectSource === 'emoji') {
                    p.textContent = fe.emoji || '✨';
                    p.style.fontSize = fe.particleSize + 'px';
                    p.style.lineHeight = '1';
                } else {
                    var imgSrc = fe.effectSource === 'custom' ? fe.customImageUrl : config.branding.logo;
                    if (imgSrc) {
                        p.innerHTML = '<img src="' + escAttr(imgSrc) + '" style="width:100%;height:100%;object-fit:contain" onerror="this.parentElement.remove()" />';
                    } else {
                        p.textContent = '✨';
                        p.style.fontSize = fe.particleSize + 'px';
                    }
                }
                p.addEventListener('animationend', function() { p.remove(); });
                fallingContainer.appendChild(p);
            }
            var particleInterval = setInterval(function() {
                if (fallingContainer.children.length < fe.particleCount) createParticle();
            }, 300);
        }
    }

    // --- Timestamp formatting ---
    function formatTimestamp(date) {
        var fmt = config.window.timestampFormat;
        if (fmt === '24-hour') {
            return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        } else if (fmt === 'full') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (fmt === 'relative') {
            return 'just now';
        } else {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
    }

    function updateRelativeTimestamps() {
        if (config.window.timestampFormat !== 'relative') return;
        var stamps = messagesEl ? messagesEl.querySelectorAll('.ncw-timestamp[data-time]') : [];
        var now = Date.now();
        for (var ts = 0; ts < stamps.length; ts++) {
            var time = parseInt(stamps[ts].getAttribute('data-time'));
            var diff = Math.floor((now - time) / 1000);
            if (diff < 10) stamps[ts].textContent = 'just now';
            else if (diff < 60) stamps[ts].textContent = diff + 's ago';
            else if (diff < 3600) stamps[ts].textContent = Math.floor(diff / 60) + ' min ago';
            else stamps[ts].textContent = Math.floor(diff / 3600) + 'h ago';
        }
    }
    if (config.window.showTimestamps && config.window.timestampFormat === 'relative') {
        setInterval(updateRelativeTimestamps, 30000);
    }

    // --- Chat logic ---
    function generateUUID() { return crypto.randomUUID(); }

    function showTypingIndicator() {
        if (!config.botMessage.showTypingIndicator || !messagesEl) return;
        var typing = document.createElement('div');
        typing.className = 'ncw-typing';
        typing.id = 'ncw-typing-indicator';
        typing.innerHTML = '<div class="ncw-typing-dot"></div><div class="ncw-typing-dot"></div><div class="ncw-typing-dot"></div>';
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTypingIndicator() {
        var el = document.getElementById('ncw-typing-indicator');
        if (el) el.remove();
    }

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
        if (chatEl) chatEl.classList.add('ncw-active');
        if (backBtn) backBtn.style.display = '';
        inChatMode = true;
        if (config.inputField.autoFocus && textarea) textarea.focus();

        showTypingIndicator();

        fetch(config.webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(function(r) { return r.json(); }).then(function(resp) {
            removeTypingIndicator();
            var output = Array.isArray(resp) ? resp[0].output : resp.output;
            if (output && (typeof output === 'string' ? output.trim() : true)) {
                appendMessage(output, 'bot');
            }
            if (initialMessage) sendMessage(initialMessage);
        }).catch(function() {
            removeTypingIndicator();
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
        if (sendBtn) sendBtn.disabled = true;
        sendMessage(msg);
    }

    function sendMessage(message) {
        appendMessage(message, 'user');
        showTypingIndicator();
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
            removeTypingIndicator();
            var output = Array.isArray(resp) ? resp[0].output : resp.output;
            if (output && (typeof output === 'string' ? output.trim() : true)) {
                appendMessage(output, 'bot');
            }
        }).catch(function() {
            removeTypingIndicator();
            appendMessage(config.window.customErrorMessage, 'bot');
        });
    }

    function appendMessage(text, type) {
        if (!messagesEl || !text) return;
        if (typeof text === 'string' && !text.trim()) return;

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

        var msgCol = document.createElement('div');
        msgCol.style.display = 'flex';
        msgCol.style.flexDirection = 'column';
        msgCol.style.maxWidth = '80%';

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
                var ct = msgEl.textContent || '';
                if (navigator.clipboard) navigator.clipboard.writeText(ct);
            });
            msgEl.appendChild(copyBtn);
        }

        msgCol.appendChild(msgEl);

        // Timestamp
        if (config.window.showTimestamps) {
            var now = new Date();
            var tsEl = document.createElement('div');
            tsEl.className = 'ncw-timestamp';
            tsEl.textContent = formatTimestamp(now);
            if (config.window.timestampFormat === 'relative') {
                tsEl.setAttribute('data-time', Date.now().toString());
            }
            msgCol.appendChild(tsEl);
        }

        row.appendChild(msgCol);
        messagesEl.appendChild(row);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // --- Helpers ---
    function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function escAttr(s) { return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})();