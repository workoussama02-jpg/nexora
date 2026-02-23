// Live preview pane — renders widget inside a browser mockup iframe
// Reflects all advanced config settings in real time
'use client';

import { useEffect, useRef } from 'react';
import type { WidgetAdvancedConfig } from '@/lib/types';

interface PreviewConfig {
  logoUrl: string;
  companyName: string;
  welcomeText: string;
  responseTimeText: string;
  poweredByText: string;
  poweredByLink: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontColor: string;
  position: 'left' | 'right';
  advancedConfig: WidgetAdvancedConfig;
}

interface PreviewPaneProps {
  config: PreviewConfig;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function buildPreviewHtml(config: PreviewConfig): string {
  const ac = config.advancedConfig;
  const bubble = ac.bubble;
  const tooltip = ac.tooltip;
  const win = ac.window;
  const bot = ac.botMessage;
  const usr = ac.userMessage;
  const inp = ac.inputField;
  const footer = ac.footer;
  const adv = ac.advanced;
  const wp = ac.welcomePage;

  const logoSrc = config.logoUrl || '';
  const logoHtml = logoSrc
    ? `<img src="${escapeHtml(logoSrc)}" alt="Logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />`
    : '';
  const placeholderIcon = `<div class="logo-placeholder" style="${logoSrc ? 'display:none' : 'display:flex'}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>`;

  const bubbleRadius = bubble.borderRadiusStyle === 'circle' ? '50%' : bubble.borderRadiusStyle === 'rounded' ? '12px' : '0';
  const windowRadius = win.borderRadiusStyle === 'rounded' ? '12px' : '0';
  const positionSide = config.position === 'left' ? 'left' : 'right';
  const positionPx = bubble.rightPosition;

  // Title avatar
  const titleAvSrc = win.titleAvatarUrl || '';
  const titleAvatarHtml = win.showTitle && titleAvSrc
    ? `<img class="title-avatar" src="${escapeHtml(titleAvSrc)}" alt="" style="width:${win.avatarSize}px;height:${win.avatarSize}px;border-radius:${win.avatarBorderRadius}px;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />`
    : '';
  const titleAvatarPlaceholder = win.showTitle
    ? `<div class="logo-placeholder title-placeholder" style="${titleAvSrc ? 'display:none;' : 'display:flex;'}width:${win.avatarSize}px;height:${win.avatarSize}px;border-radius:${win.avatarBorderRadius}px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>`
    : '';

  const displayTitle = win.title || config.companyName || '';

  // Tooltip
  const tooltipHtml = tooltip.display
    ? `<div class="tooltip" onclick="toggleChat()" style="background:${escapeHtml(tooltip.backgroundColor)};color:${escapeHtml(tooltip.textColor)};font-size:${tooltip.fontSize}px;">${escapeHtml(tooltip.message)}<span class="tooltip-close" onclick="event.stopPropagation();document.querySelector('.tooltip').style.display='none'">&times;</span></div>`
    : '';

  // Starter prompts
  const promptsHtml = win.starterPrompts
    .filter((p) => p.trim())
    .map((p) => `<button class="starter-prompt" style="font-size:${win.starterPromptFontSize}px;">${escapeHtml(p)}</button>`)
    .join('');

  // Custom bubble icon
  const bubbleIconSrc = bubble.customIconUrl;
  const bubbleIconHtml = bubbleIconSrc
    ? `<img src="${escapeHtml(bubbleIconSrc)}" alt="" style="width:${bubble.customIconSize}%;height:${bubble.customIconSize}%;object-fit:contain;border-radius:${bubble.customIconBorderRadius}px;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'" /><svg style="display:none" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${escapeHtml(bubble.internalIconsColor)}" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${escapeHtml(bubble.internalIconsColor)}" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

  // Footer content
  let footerLogoHtml = '';
  if (footer.showLogo) {
    const fLogoSrc = footer.logoSource === 'custom' && footer.customLogoUrl ? footer.customLogoUrl : logoSrc;
    if (fLogoSrc) {
      footerLogoHtml = `<img src="${escapeHtml(fLogoSrc)}" alt="" style="width:${footer.logoSize}px;height:${footer.logoSize}px;object-fit:contain;" onerror="this.style.display='none'" />`;
    }
  }

  let footerContent = '';
  if (footer.mode === 'html' && footer.customHtml) {
    footerContent = `<div class="powered-by" style="color:${escapeHtml(footer.textColor)};">${footer.customHtml}</div>`;
  } else {
    const footerText = footer.text || config.poweredByText;
    const footerLink = footer.companyLink || config.poweredByLink;
    const footerCompany = footer.companyName || '';
    const leftLogo = footer.showLogo && (footer.logoPosition === 'left' || footer.logoPosition === 'both') ? footerLogoHtml : '';
    const rightLogo = footer.showLogo && (footer.logoPosition === 'right' || footer.logoPosition === 'both') ? footerLogoHtml : '';
    footerContent = `<div class="powered-by" style="color:${escapeHtml(footer.textColor)};display:flex;align-items:center;justify-content:center;gap:6px;">${leftLogo}<a href="${escapeHtml(footerLink)}" target="_blank" rel="noopener noreferrer" style="color:${escapeHtml(footer.textColor)};">${escapeHtml(footerText)}${footerCompany ? ' ' + escapeHtml(footerCompany) : ''}</a>${rightLogo}</div>`;
  }

  // Sample messages for preview
  const botAvatarHtml = bot.showAvatar
    ? `<div class="msg-avatar" style="background:${escapeHtml(bot.backgroundColor)};border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:12px;">${bot.avatarUrl ? `<img src="${escapeHtml(bot.avatarUrl)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.parentElement.textContent='B'" />` : 'B'}</div>`
    : '';
  const userAvatarHtml = usr.showAvatar
    ? `<div class="msg-avatar" style="background:${escapeHtml(usr.backgroundColor)};border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${escapeHtml(usr.textColor)};font-size:12px;">${usr.avatarUrl ? `<img src="${escapeHtml(usr.avatarUrl)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.parentElement.textContent='U'" />` : 'U'}</div>`
    : '';

  // Timestamps
  function formatPreviewTimestamp(format: string): string {
    const now = new Date();
    if (format === '24-hour') {
      return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    } else if (format === 'full') {
      return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (format === 'relative') {
      return 'just now';
    } else {
      return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  }

  const timestampHtml = win.showTimestamps
    ? `<div class="msg-timestamp" style="color:${escapeHtml(win.timestampColor)};font-size:${win.timestampFontSize}px;">${escapeHtml(formatPreviewTimestamp(win.timestampFormat))}</div>`
    : '';

  // Typing indicator
  const typingHtml = bot.showTypingIndicator
    ? `<div class="msg-row"><${botAvatarHtml ? 'span' : 'span'}>${botAvatarHtml}<div class="typing-indicator" style="background:${escapeHtml(bot.backgroundColor)};"><span style="background:${escapeHtml(bot.typingIndicatorColor)};"></span><span style="background:${escapeHtml(bot.typingIndicatorColor)};"></span><span style="background:${escapeHtml(bot.typingIndicatorColor)};"></span></div></div>`
    : '';

  // Social icons row — rendered inline inside the header
  const socialIconsHtml = win.showSocialIcons && win.socialLinks.length > 0
    ? `<div class="social-icons">${win.socialLinks.map((l) => l.iconUrl ? `<a href="${escapeHtml(l.url)}" title="Social Link" style="color:${escapeHtml(win.socialIconColor)};display:inline-flex;align-items:center;" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(l.iconUrl)}" width="${win.socialIconSize}" height="${win.socialIconSize}" style="width:${win.socialIconSize}px;height:${win.socialIconSize}px;object-fit:contain;border-radius:2px;" onerror="this.parentElement.style.display='none'" /></a>` : '').join('')}</div>`
    : '';

  // Shadow/glow
  const shadowStyle = win.shadowEnabled
    ? `box-shadow: 0 0 ${win.shadowBlur}px ${win.shadowSpread}px ${escapeHtml(win.shadowColor1)}80, 0 0 ${win.shadowBlur * 2}px ${win.shadowSpread * 2}px ${escapeHtml(win.shadowColor2)}80;`
    : '';

  // Shadow animation CSS
  let shadowAnimCss = '';
  if (win.shadowEnabled && win.shadowAnimate) {
    shadowAnimCss = `@keyframes ncw-shadow-pulse{0%,100%{box-shadow:0 0 ${win.shadowBlur}px ${win.shadowSpread}px ${escapeHtml(win.shadowColor1)}80}50%{box-shadow:0 0 ${win.shadowBlur * 1.5}px ${win.shadowSpread * 1.5}px ${escapeHtml(win.shadowColor2)}80}}\n.chat-container{animation:ncw-shadow-pulse ${win.shadowAnimationSpeed}s ease-in-out infinite}`;
  }

  // Header action buttons
  const backBtnHtml = win.showBackToWelcome ? `<button class="header-action" title="Back" onclick="backToWelcome()">&#8592;</button>` : '';
  const refreshBtnHtml = win.showRefreshButton ? `<button class="header-action" title="Refresh" onclick="refreshChat()">&#8635;</button>` : '';

  // Send button icon
  let sendIconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  if (win.sendButtonIcon === 'arrow-up') {
    sendIconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
  } else if (win.sendButtonIcon === 'send') {
    sendIconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  }

  // Emoji button
  const emojiBtnHtml = inp.showEmojiPicker
    ? `<button class="emoji-btn" id="emojiToggleBtn" title="Emoji" style="background:none;border:none;font-size:18px;cursor:pointer;padding:4px;position:relative;flex-shrink:0;" onclick="toggleEmojiPicker(event)">😊</button>`
    : '';

  // Welcome logo
  let welcomeLogoHtml = '';
  if (wp.showWelcomeLogo) {
    const wLogoSrc = wp.welcomeLogoSource === 'custom' && wp.welcomeCustomLogoUrl ? wp.welcomeCustomLogoUrl : logoSrc;
    if (wLogoSrc) {
      let posStyle = '';
      if (wp.welcomeLogoPosition === 'top-left') posStyle = 'align-self:flex-start;';
      else if (wp.welcomeLogoPosition === 'top-right') posStyle = 'align-self:flex-end;';
      welcomeLogoHtml = `<img class="welcome-logo" src="${escapeHtml(wLogoSrc)}" alt="" style="width:${wp.welcomeLogoSize}px;height:${wp.welcomeLogoSize}px;object-fit:contain;${posStyle}" onerror="this.style.display='none'" />`;
    } else {
      let posStyle = '';
      if (wp.welcomeLogoPosition === 'top-left') posStyle = 'align-self:flex-start;';
      else if (wp.welcomeLogoPosition === 'top-right') posStyle = 'align-self:flex-end;';
      welcomeLogoHtml = `<div class="welcome-logo-placeholder" style="width:${wp.welcomeLogoSize}px;height:${wp.welcomeLogoSize}px;border-radius:12px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;${posStyle}"><svg width="${Math.round(wp.welcomeLogoSize * 0.5)}" height="${Math.round(wp.welcomeLogoSize * 0.5)}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>`;
    }
  }

  // Bubble animation CSS
  let bubbleAnimCss = '';
  if (bubble.animation !== 'none') {
    const speedMap: Record<string, string> = { slow: '2s', normal: '1s', fast: '0.5s' };
    const dur = speedMap[bubble.animationSpeed] || '1s';
    const animMap: Record<string, string> = {
      bounce: `@keyframes bubbleAnim { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`,
      float: `@keyframes bubbleAnim { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`,
      pulse: `@keyframes bubbleAnim { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }`,
      shake: `@keyframes bubbleAnim { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }`,
      wiggle: `@keyframes bubbleAnim { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }`,
    };
    bubbleAnimCss = `${animMap[bubble.animation] || ''}\n.toggle-btn { animation: bubbleAnim ${dur} ease-in-out ${bubble.animateOnlyOnLoad ? '1' : 'infinite'}; }`;
  }

  // Welcome page animation CSS
  let welcomeAnimCss = '';
  if (wp.welcomeButtonAnimation !== 'none') {
    const animMap: Record<string, string> = {
      bounce: `@keyframes wp-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`,
      float: `@keyframes wp-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`,
      pulse: `@keyframes wp-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }`,
      spin: `@keyframes wp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
      glow: `@keyframes wp-glow { 0%,100% { box-shadow: 0 0 5px rgba(0,0,0,0.2); } 50% { box-shadow: 0 0 20px ${escapeHtml(config.primaryColor)}80; } }`,
    };
    const animRef = wp.welcomeButtonAnimation === 'glow' ? `wp-glow 2s ease-in-out infinite` : `wp-${wp.welcomeButtonAnimation} ${wp.welcomeButtonAnimationSpeed}s ease-in-out infinite`;
    welcomeAnimCss = `${animMap[wp.welcomeButtonAnimation] || ''}\n.start-btn, .starter-prompt { animation: ${animRef}; }`;
  }

  if (wp.welcomeLogoAnimation !== 'none') {
    const logoAnimMap: Record<string, string> = {
      bounce: `@keyframes logo-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`,
      float: `@keyframes logo-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`,
      pulse: `@keyframes logo-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }`,
      spin: `@keyframes logo-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
      glow: `@keyframes logo-glow { 0%,100% { box-shadow: 0 0 5px rgba(0,0,0,0.2); } 50% { box-shadow: 0 0 20px ${escapeHtml(config.primaryColor)}80; } }`,
    };
    const logoAnimRef = wp.welcomeLogoAnimation === 'glow' ? `logo-glow 2s ease-in-out infinite` : `logo-${wp.welcomeLogoAnimation} 2s ease-in-out infinite`;
    welcomeAnimCss += `\n${logoAnimMap[wp.welcomeLogoAnimation] || ''}\n.welcome-logo, .welcome-logo-placeholder { animation: ${logoAnimRef}; }`;
  }

  // Custom cursor CSS
  let cursorCss = '';
  if (adv.enableCustomCursor) {
    if (adv.cursorType === 'custom' && adv.customCursorUrl) {
      cursorCss = `.widget-root,.widget-root *{cursor:url('${escapeHtml(adv.customCursorUrl)}'),auto}`;
    } else {
      cursorCss = `.widget-root,.widget-root *{cursor:${adv.presetCursor || 'pointer'}}`;
    }
  }

  // Color transitions CSS (using preview class names)
  let colorTransitionCss = '';
  if (adv.enableColorTransitions) {
    const ct = adv.colorTransitions;
    const ctSpd = `${ct.transitionSpeed}s`;
    const cp = escapeHtml(config.primaryColor);
    const cs = escapeHtml(config.secondaryColor);
    if (ct.headerTransition) {
      colorTransitionCss += `@keyframes ct-header{0%,100%{background:${ct.headerColor1 || cp}}50%{background:${ct.headerColor2 || cs}}}\n.brand-header{animation:ct-header ${ctSpd} ease-in-out infinite}\n`;
    }
    if (ct.toggleTransition) {
      colorTransitionCss += `@keyframes ct-toggle{0%,100%{background:${ct.toggleColor1 || cp}}50%{background:${ct.toggleColor2 || cs}}}\n`;
      if (bubble.animation !== 'none') {
        const bSpeedMap: Record<string, string> = { slow: '2s', normal: '1s', fast: '0.5s' };
        const bDur = bSpeedMap[bubble.animationSpeed] || '1s';
        const bIter = bubble.animateOnlyOnLoad ? '1' : 'infinite';
        colorTransitionCss += `.toggle-btn{animation:ct-toggle ${ctSpd} ease-in-out infinite,bubbleAnim ${bDur} ease-in-out ${bIter}}\n`;
      } else {
        colorTransitionCss += `.toggle-btn{animation:ct-toggle ${ctSpd} ease-in-out infinite}\n`;
      }
    }
    if (ct.userMessageTransition) {
      colorTransitionCss += `@keyframes ct-umsg{0%,100%{background:${ct.userMessageColor1 || cp}}50%{background:${ct.userMessageColor2 || cs}}}\n.msg-bubble.user{animation:ct-umsg ${ctSpd} ease-in-out infinite}\n`;
    }
    if (ct.botMessageTransition) {
      colorTransitionCss += `@keyframes ct-bmsg{0%,100%{background:${ct.botMessageColor1 || escapeHtml(bot.backgroundColor)}}50%{background:${ct.botMessageColor2 || cs}}}\n.msg-bubble.bot{animation:ct-bmsg ${ctSpd} ease-in-out infinite}\n`;
    }
  }

  // Falling effect (pre-computed for template injection)
  const fallingEffectCss = adv.enableFallingEffect
    ? `.falling-overlay{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:hidden;z-index:5}.falling-particle{position:absolute;animation:particle-fall linear forwards}@keyframes particle-fall{0%{top:-30px;opacity:${adv.fallingEffect.particleOpacity ?? 1}}100%{top:100%;opacity:0}}`
    : '';
  const fallingHtml = adv.enableFallingEffect ? '<div class="falling-overlay" id="fallingOverlay"></div>' : '';
  const fallingEffectScript = adv.enableFallingEffect ? `
  (function() {
    var fallingOverlay = document.getElementById('fallingOverlay');
    if (!fallingOverlay) return;
    var fe = ${JSON.stringify(adv.fallingEffect)};
    var logoUrl = ${JSON.stringify(logoSrc)};
    function createFallingParticle() {
      var p = document.createElement('div');
      p.className = 'falling-particle';
      p.style.left = (Math.random() * 100) + '%';
      var speedMap = { slow: 6, medium: 4, fast: 2 };
      var dur = (speedMap[fe.fallSpeed] || 4) + (Math.random() * 2);
      p.style.animationDuration = dur + 's';
      p.style.width = fe.particleSize + 'px';
      p.style.height = fe.particleSize + 'px';
      p.style.opacity = fe.particleOpacity != null ? fe.particleOpacity : 1;
      if (fe.effectSource === 'emoji') {
        p.textContent = fe.emoji || '\u2728';
        p.style.fontSize = fe.particleSize + 'px';
        p.style.lineHeight = '1';
      } else {
        var src = fe.effectSource === 'custom' ? fe.customImageUrl : logoUrl;
        if (src) {
          p.innerHTML = '<img src="' + src + '" style="width:100%;height:100%;object-fit:contain" />';
        } else {
          p.textContent = '\u2728';
          p.style.fontSize = fe.particleSize + 'px';
        }
      }
      p.addEventListener('animationend', function() { p.remove(); });
      fallingOverlay.appendChild(p);
    }
    setInterval(function() {
      if (fallingOverlay.children.length < fe.particleCount) createFallingParticle();
    }, 300);
  })();` : '';

  // Language buttons HTML
  const langBtnSize = wp.languageButtonSize ?? 13;
  const langButtonsHtml = wp.enableLanguageButtons && wp.languageButtons && wp.languageButtons.length > 0
    ? `<div class="lang-btns-row">${wp.languageButtons.map((btn) => {
        const btnBg = wp.languageButtonColor
          ? `background:${escapeHtml(wp.languageButtonColor)};`
          : 'background:linear-gradient(135deg,var(--primary),var(--secondary));';
        const flagHtml = btn.flagUrl ? `<img src="${escapeHtml(btn.flagUrl)}" alt="" style="width:${langBtnSize + 2}px;height:${langBtnSize + 2}px;object-fit:contain;" onerror="this.style.display='none'" /> ` : '';
        return `<button class="lang-welcome-btn" onclick="startChat('${escapeHtml(btn.message).replace(/'/g, '&#039;')}')" style="${btnBg}font-size:${langBtnSize}px;">${flagHtml}${escapeHtml(btn.label)}</button>`;
      }).join('\n      ')}</div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; background: transparent !important; font-family: 'Segoe UI', system-ui, sans-serif; overflow: hidden; pointer-events: none; }

  .widget-root {
    --primary: ${escapeHtml(config.primaryColor)};
    --secondary: ${escapeHtml(config.secondaryColor)};
    --bg: ${escapeHtml(config.backgroundColor)};
    --font: ${escapeHtml(config.fontColor)};
    pointer-events: none;
  }

  .toggle-btn {
    position: fixed;
    bottom: ${bubble.bottomPosition}px;
    ${positionSide}: ${positionPx}px;
    width: ${bubble.size}px;
    height: ${bubble.size}px;
    border-radius: ${bubbleRadius};
    background: ${escapeHtml(bubble.backgroundColor)};
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: transform 0.2s;
    z-index: 10;
    overflow: hidden;
    pointer-events: auto;
  }
  .toggle-btn:hover { transform: scale(1.05); }
  ${bubbleAnimCss}
  ${shadowAnimCss}
  ${welcomeAnimCss}
  ${cursorCss}
  ${colorTransitionCss}
  ${fallingEffectCss}

  .tooltip {
    position: fixed;
    bottom: ${bubble.bottomPosition + bubble.size + 10}px;
    ${positionSide}: ${positionPx}px;
    padding: 8px 14px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    cursor: pointer;
    z-index: 10;
    max-width: 220px;
    white-space: pre-wrap;
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: auto;
  }
  .tooltip-close {
    font-size: 16px;
    opacity: 0.6;
    cursor: pointer;
    line-height: 1;
  }
  .tooltip-close:hover { opacity: 1; }

  .chat-container {
    position: fixed;
    bottom: ${bubble.bottomPosition + bubble.size + 12}px;
    ${positionSide}: ${positionPx}px;
    width: min(${win.width}px, calc(100vw - 32px));
    max-height: calc(100vh - ${bubble.bottomPosition + bubble.size + 24}px);
    height: ${win.height}px;
    background: ${escapeHtml(win.backgroundColor)};
    border-radius: ${windowRadius};
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    border: 1px solid rgba(0,0,0,0.1);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 10;
    font-size: ${win.fontSize}px;
    ${shadowStyle}
    pointer-events: auto;
  }
  .chat-container.open { display: flex; }
  .chat-container.mode-chat .welcome-screen { display: none; }
  .chat-container.mode-chat .messages-area { display: flex; }
  .chat-container.mode-chat .input-area { display: flex; }

  .brand-header {
    padding: 12px 16px;
    display: ${win.showTitle ? 'flex' : 'none'};
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
  }
  .brand-header img.brand-logo { width: 28px; height: 28px; border-radius: 4px; }
  .brand-header .name { font-size: 15px; font-weight: 600; color: var(--font); flex: 1; }
  .logo-placeholder {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; flex-shrink: 0;
  }
  .title-placeholder { width: 28px; height: 28px; border-radius: 4px; }
  .header-actions { display: flex; gap: 4px; align-items: center; }
  .header-action {
    background: none; border: none; cursor: pointer; color: var(--font); opacity: 0.5; font-size: 16px; padding: 4px; border-radius: 4px;
  }
  .header-action:hover { opacity: 1; background: rgba(0,0,0,0.05); }
  .close-btn {
    background: none; border: none; cursor: pointer; color: var(--font); opacity: 0.5; font-size: 18px; padding: 4px;
  }
  .close-btn:hover { opacity: 1; }

  .welcome-screen {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center;
    background: ${wp.welcomeBackgroundColor ? escapeHtml(wp.welcomeBackgroundColor) : 'transparent'};
  }
  .welcome-text { font-size: 20px; font-weight: 600; color: var(--font); margin-bottom: 20px; line-height: 1.3; }
  .start-btn {
    display: flex; align-items: center; gap: 8px; padding: 12px 24px; border: none; border-radius: 8px;
    background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #fff; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: opacity 0.2s; margin-bottom: 8px; width: 100%;
    justify-content: center;
  }
  .start-btn:hover { opacity: 0.9; }
  .response-time { font-size: 12px; color: var(--font); opacity: 0.5; margin-top: 12px; }

  .starter-prompts {
    display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 16px;
  }
  .starter-prompt {
    padding: 6px 12px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.15);
    background: transparent; cursor: pointer; color: var(--font); transition: background 0.2s;
  }
  .starter-prompt:hover { background: rgba(0,0,0,0.05); }

  .messages-area {
    flex: 1; display: none; flex-direction: column; padding: 12px; gap: 10px;
    overflow-y: ${win.showScrollbar ? 'auto' : 'hidden'};
  }
  .msg-row { display: flex; gap: 8px; align-items: flex-end; }
  .msg-row.user { flex-direction: row-reverse; }
  .msg-bubble {
    max-width: 75%; padding: 10px 14px; border-radius: ${win.messageBorderRadius}px; line-height: 1.4; font-size: inherit;
  }
  .msg-bubble.bot { background: ${escapeHtml(bot.backgroundColor)}; color: ${escapeHtml(bot.textColor)}; }
  .msg-bubble.user { background: ${escapeHtml(usr.backgroundColor)}; color: ${escapeHtml(usr.textColor)}; }
  .msg-timestamp { font-size: 10px; opacity: 0.6; margin-top: 2px; padding: 0 4px; }
  .msg-row.user .msg-timestamp { text-align: right; }

  .typing-indicator {
    display: inline-flex; gap: 4px; padding: 10px 14px; border-radius: ${win.messageBorderRadius}px;
  }
  .typing-indicator span {
    width: 6px; height: 6px; border-radius: 50%; animation: typingDots 1.4s infinite;
  }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingDots {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }

  .social-icons { display: inline-flex; gap: 6px; align-items: center; }
  .social-icons a { display: inline-flex; opacity: 0.7; }
  .social-icons a:hover { opacity: 1; }

  .input-area {
    display: none; padding: 8px 12px; border-top: 1px solid rgba(0,0,0,0.08); gap: 8px; align-items: center;
    background: ${escapeHtml(inp.backgroundColor)};
  }
  .input-area input {
    flex: 1; border: 1px solid rgba(0,0,0,0.1); border-radius: ${inp.borderRadius}px; padding: 8px 12px;
    font-size: 14px; outline: none; background: ${escapeHtml(inp.backgroundColor)}; color: ${escapeHtml(inp.textColor)};
  }
  .input-area input::placeholder { color: ${escapeHtml(inp.textColor)}; opacity: 0.5; }
  .lang-btns-row {
    display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 8px;
  }
  .lang-welcome-btn {
    display: inline-flex; align-items: center; gap: 5px; padding: 8px 16px; border: none;
    border-radius: 8px; color: #fff; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: opacity 0.2s;
  }
  .lang-welcome-btn:hover { opacity: 0.9; }
  .emoji-btn { flex-shrink: 0; }
  .send-btn {
    width: 36px; height: 36px; border: none; border-radius: ${inp.sendButtonBorderRadius}px;
    background: ${escapeHtml(inp.sendButtonColor)}; color: #fff; cursor: pointer; display: ${win.showSendButton ? 'flex' : 'none'};
    align-items: center; justify-content: center; flex-shrink: 0;
  }

  .powered-by {
    padding: 8px; text-align: center; border-top: 1px solid rgba(0,0,0,0.06);
  }
  .powered-by a {
    font-size: 11px; text-decoration: none; opacity: 0.5;
  }
  .powered-by a:hover { opacity: 0.7; }
  .powered-by img { vertical-align: middle; }

  .placeholder { opacity: 0.4; font-style: italic; }

  ${adv.customCss ? escapeHtml(adv.customCss) : ''}
</style>
</head>
<body>
<div class="widget-root">
  ${tooltipHtml}

  <button class="toggle-btn" onclick="toggleChat()">
    ${bubbleIconHtml}
  </button>

  <div class="chat-container" id="chatContainer">
    <div class="brand-header">
      ${titleAvatarHtml}
      ${titleAvatarPlaceholder}
      <span class="name">${displayTitle ? escapeHtml(displayTitle) : '<span class="placeholder">Company Name</span>'}</span>
      ${socialIconsHtml}
      <div class="header-actions">
        ${backBtnHtml}
        ${refreshBtnHtml}
        <button class="close-btn" onclick="toggleChat()">&times;</button>
      </div>
    </div>

    <div class="welcome-screen">
      ${wp.welcomeLogoPosition === 'below-text' ? '' : welcomeLogoHtml}
      <div class="welcome-text">${config.welcomeText ? escapeHtml(win.welcomeMessage || config.welcomeText) : '<span class="placeholder">Welcome! How can we help?</span>'}</div>
      ${wp.welcomeLogoPosition === 'below-text' ? welcomeLogoHtml : ''}
      ${wp.showWelcomeButton !== false ? `<button class="start-btn" onclick="startChat()" style="${wp.welcomeButtonColor ? `background:${escapeHtml(wp.welcomeButtonColor)};` : ''}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        ${escapeHtml(wp.welcomeButtonText || 'Send us a message')}
      </button>` : ''}
      ${langButtonsHtml}
      ${config.responseTimeText ? `<div class="response-time">${escapeHtml(config.responseTimeText)}</div>` : ''}
      ${promptsHtml ? `<div class="starter-prompts">${promptsHtml}</div>` : ''}
    </div>

    <div class="messages-area">
      <div class="msg-row">
        ${botAvatarHtml}
        <div>
          <div class="msg-bubble bot">Hello! How can I help you today?</div>
          ${timestampHtml}
        </div>
      </div>
      <div class="msg-row user">
        ${userAvatarHtml}
        <div>
          <div class="msg-bubble user">I have a question about your product.</div>
          ${timestampHtml}
        </div>
      </div>
      <div class="msg-row">
        ${botAvatarHtml}
        <div>
          <div class="msg-bubble bot">Sure! I'd be happy to help. What would you like to know?</div>
          ${timestampHtml}
        </div>
      </div>
      ${typingHtml}
    </div>

    <div class="input-area" style="position:relative;">
      ${emojiBtnHtml}
      ${inp.showEmojiPicker ? `<div id="emojiPicker" style="display:none;position:absolute;bottom:52px;left:4px;width:220px;max-height:160px;overflow-y:auto;background:#fff;border:1px solid rgba(0,0,0,0.12);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:6px;grid-template-columns:repeat(7,1fr);gap:2px;z-index:20;"></div>` : ''}
      <input type="text" placeholder="${escapeHtml(inp.placeholder)}" readonly />
      <button class="send-btn">
        ${sendIconSvg}
      </button>
    </div>

    ${footerContent}
    ${fallingHtml}
  </div>
</div>

<script>
  var chatOpen = false;
  var chatMode = 'welcome';
  function toggleChat() {
    var c = document.getElementById('chatContainer');
    chatOpen = !chatOpen;
    if (chatOpen) {
      c.classList.add('open');
    } else {
      c.classList.remove('open');
    }
    var tt = document.querySelector('.tooltip');
    if (tt && chatOpen) tt.style.display = 'none';
  }
  function startChat(initialMessage) {
    var c = document.getElementById('chatContainer');
    if (!chatOpen) {
      chatOpen = true;
      c.classList.add('open');
    }
    c.classList.add('mode-chat');
    chatMode = 'chat';
  }
  function backToWelcome() {
    var c = document.getElementById('chatContainer');
    c.classList.remove('mode-chat');
    chatMode = 'welcome';
  }
  function refreshChat() {
    var c = document.getElementById('chatContainer');
    c.classList.remove('mode-chat');
    chatMode = 'welcome';
  }
  // Emoji picker
  var emojiPickerOpen = false;
  var EMOJIS = ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','🤗','🤔','😐','😑','😶','🙄','😏','😒','🤨','😬','🤪','😜','😝','😛','🤑','😴','🥱','😪','🤤','😷','🤒','🤕','🤧','🥵','🥶','🤯','😵','🥴','🤠','🎉','👍','👎','❤️','🔥','✨','⭐','🎊','🙏','💯','🎁','🌟','💪','🚀','💡','⚡','🌈','🎵','🎶','💎','🌺','🌸','🌻','🌙','😸','😺','🦊','🐶','🐱','🐭','🦁','🐯','🐨','🐼','🐸','🦋','🌿','🍀','🍎','🍕','☕','🎂'];
  (function() {
    var picker = document.getElementById('emojiPicker');
    if (!picker) return;
    EMOJIS.forEach(function(em) {
      var btn = document.createElement('button');
      btn.textContent = em;
      btn.style.cssText = 'background:none;border:none;font-size:18px;cursor:pointer;padding:2px;width:28px;height:28px;border-radius:4px;';
      btn.onmouseover = function() { btn.style.background = 'rgba(0,0,0,0.06)'; };
      btn.onmouseout = function() { btn.style.background = 'none'; };
      btn.onclick = function(e) { e.stopPropagation(); };
      picker.appendChild(btn);
    });
  })();
  function toggleEmojiPicker(e) {
    e.stopPropagation();
    var picker = document.getElementById('emojiPicker');
    if (!picker) return;
    emojiPickerOpen = !emojiPickerOpen;
    picker.style.display = emojiPickerOpen ? 'grid' : 'none';
  }
  document.addEventListener('click', function(e) {
    var picker = document.getElementById('emojiPicker');
    if (picker && emojiPickerOpen) {
      var btn = document.getElementById('emojiToggleBtn');
      if (btn && !btn.contains(e.target) && !picker.contains(e.target)) {
        emojiPickerOpen = false;
        picker.style.display = 'none';
      }
    }
  });
  ${fallingEffectScript}
</script>
</body>
</html>`;
}

export default function PreviewPane({ config }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const html = buildPreviewHtml(config);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
    return () => URL.revokeObjectURL(url);
  }, [config]);

  const side = config.position === 'left' ? 'left-0' : 'right-0';

  return (
    <iframe
      ref={iframeRef}
      title="Widget Preview"
      className={`fixed bottom-0 ${side} border-0 z-50`}
      style={{ width: '520px', height: '740px', background: 'transparent' }}
      sandbox="allow-scripts"
    />
  );
}
