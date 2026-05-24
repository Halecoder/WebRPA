<template>
  <div class="app-root">
    <!-- 顶部品牌横幅 -->
    <header class="brand-bar" data-tauri-drag-region>
      <div class="brand-bar-bg"></div>
      <div class="brand-content">
        <div class="brand-left">
          <div class="brand-logo">
            <span class="brand-letter brand-letter-1">W</span>
            <span class="brand-letter brand-letter-2">e</span>
            <span class="brand-letter brand-letter-3">b</span>
            <span class="brand-pill">
              <span class="brand-letter">R</span>
              <span class="brand-letter">P</span>
              <span class="brand-letter">A</span>
            </span>
          </div>
          <div class="brand-meta">
            <div class="brand-title">控制中心</div>
            <div class="brand-version">
              <span class="version-dot"></span>
              <span>v{{ version }}</span>
              <span class="version-sep">·</span>
              <span class="version-tag">网页机器人流程自动化平台</span>
            </div>
          </div>
        </div>
        <div class="window-controls">
          <button class="win-btn" @click="minimize" title="最小化">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
            </svg>
          </button>
          <button class="win-btn win-btn-close" @click="closeApp" title="关闭">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- 主体 -->
    <main class="page">
      <!-- 状态条 -->
      <section class="status-strip">
        <div class="status-strip-left">
          <div class="big-status" :class="bigStatusClass">
            <span class="big-status-icon">
              <svg v-if="backendRunning && frontendRunning" viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="backendRunning || frontendRunning" viewBox="0 0 24 24" width="18" height="18" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5"/>
                <path d="M8 12h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </span>
            <div class="big-status-text">
              <span class="big-status-title">{{ overallStatusText }}</span>
              <span class="big-status-sub">{{ overallStatusSub }}</span>
            </div>
          </div>
        </div>
        <div class="status-strip-right">
          <button class="chip-btn" @click="checkUpdate" :disabled="checking">
            <svg :class="{ rotating: checking }" viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ checking ? '检查中…' : '检查更新' }}</span>
          </button>
          <button class="chip-btn" @click="showConfigModal = true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2v3M12 19v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>设置</span>
          </button>
          <button class="chip-btn" @click="openGithub">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>
          <button class="chip-btn chip-btn-pink" @click="showSponsor">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>支持作者</span>
          </button>
        </div>
      </section>


      <!-- 更新通知 -->
      <transition name="fade-slide">
        <section v-if="updateInfo && updateInfo.has_update" class="update-banner">
          <div class="update-banner-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="update-banner-text">
            <div class="update-banner-title">发现新版本 <strong>v{{ updateInfo.latest_version }}</strong></div>
            <div class="update-banner-sub">{{ updateInfo.release_date }} · 点击下载查看更新内容</div>
          </div>
          <div class="update-banner-actions">
            <button class="link-btn" @click="downloadWithMirror">加速下载</button>
            <button class="cta-btn" @click="downloadUpdate">
              <span>立即更新</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </section>
      </transition>

      <!-- 主控制卡 -->
      <section class="hero-card">
        <div class="hero-deco"></div>
        <div class="hero-row">
          <div class="hero-info">
            <div class="hero-tag-row">
              <span class="hero-tag">
                <span class="hero-tag-dot"></span>
                <span>本地运行</span>
              </span>
              <span class="hero-tag hero-tag-warm">免费 · 开源 · 无广告</span>
            </div>
            <h1 class="hero-title">
              一键启动你的<span class="hero-highlight">自动化工作站</span>
            </h1>
            <p class="hero-sub">点击启动后将自动拉起后端 API 服务和前端 Web 编辑器，并在浏览器中打开</p>
          </div>
          <div class="hero-cta">
            <button
              v-if="!backendRunning || !frontendRunning"
              class="cta-primary"
              @click="startServices"
              :disabled="starting"
            >
              <span class="cta-glow"></span>
              <svg v-if="!starting" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else class="rotating" viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                  stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ starting ? '启动中…' : '启动 WebRPA' }}</span>
            </button>
            <button v-else class="cta-success" @click="openBrowser">
              <span class="cta-glow"></span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                  stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>打开 WebRPA 编辑器</span>
            </button>
            <button
              class="cta-stop"
              @click="stopServices"
              :disabled="!backendRunning && !frontendRunning"
              title="停止所有服务"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1"/>
              </svg>
              <span>停止</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 服务卡片网格 -->
      <section class="service-grid">
        <div class="service-card" :class="{ active: backendRunning }">
          <div class="service-card-inner">
            <div class="service-icon service-icon-blue">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="2"/>
                <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"
                  stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="service-text">
              <div class="service-name">后端 API 服务</div>
              <div class="service-meta">
                <span class="service-state-dot" :class="{ on: backendRunning }"></span>
                <span class="service-state-text">{{ backendRunning ? '运行中' : '未启动' }}</span>
                <span class="service-divider">·</span>
                <code class="service-port">{{ configForm.backend.host }}:{{ configForm.backend.port }}</code>
              </div>
            </div>
            <button class="service-action" @click="openBackendLog">查看日志</button>
          </div>
          <div class="service-progress" v-if="backendRunning"></div>
        </div>

        <div class="service-card" :class="{ active: frontendRunning }">
          <div class="service-card-inner">
            <div class="service-icon service-icon-purple">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="service-text">
              <div class="service-name">前端 Web 编辑器</div>
              <div class="service-meta">
                <span class="service-state-dot" :class="{ on: frontendRunning }"></span>
                <span class="service-state-text">{{ frontendRunning ? '运行中' : '未启动' }}</span>
                <span class="service-divider">·</span>
                <code class="service-port">{{ configForm.frontend.host }}:{{ configForm.frontend.port }}</code>
              </div>
            </div>
            <button class="service-action" @click="openFrontendLog">查看日志</button>
          </div>
          <div class="service-progress" v-if="frontendRunning"></div>
        </div>
      </section>

      <!-- 信息卡（隐私 + 提示） -->
      <section class="info-row">
        <div class="info-card info-card-green">
          <div class="info-icon-wrap">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="info-content">
            <div class="info-title">数据安全</div>
            <div class="info-text">API Key、密码、Token 等敏感配置仅保存在浏览器本地，不写入项目目录</div>
          </div>
        </div>
        <div class="info-card info-card-blue">
          <div class="info-icon-wrap">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="info-content">
            <div class="info-title">默认端口</div>
            <div class="info-text">后端 8000、前端 5173；可通过设置修改实现多开</div>
          </div>
        </div>
        <div class="info-card info-card-pink" @click="showSponsor" style="cursor: pointer">
          <div class="info-icon-wrap">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div class="info-content">
            <div class="info-title">独立开发 · 为爱发电</div>
            <div class="info-text">如果它帮到了你，欢迎扫码请作者喝杯咖啡 ☕</div>
          </div>
        </div>
      </section>

      <!-- 底部 -->
      <footer class="footer-bar">
        <span class="footer-copyright">© 2026 青云制作 · 彭明航</span>
        <span class="footer-separator"></span>
        <a class="footer-link" @click="openGithub">GitHub 仓库</a>
        <span class="footer-dot">·</span>
        <a class="footer-link" @click="showLicense">开源协议</a>
        <span class="footer-dot">·</span>
        <a class="footer-link footer-heart" @click="showSponsor">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" style="vertical-align: -1px; margin-right: 3px">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          支持作者
        </a>
      </footer>
    </main>


    <!-- 赞助弹窗 -->
    <transition name="modal">
      <div v-if="showSponsorModal" class="modal-mask" @click="showSponsorModal = false">
        <div class="modal-shell" @click.stop>
          <div class="modal-banner sponsor-banner">
            <div class="modal-banner-pattern"></div>
            <div class="modal-banner-content">
              <div class="modal-banner-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div class="modal-banner-text">
                <div class="modal-banner-title">支持 WebRPA 持续开发</div>
                <div class="modal-banner-sub">独立开发者 · 业余维护 · 为爱发电</div>
              </div>
            </div>
            <button class="modal-close" @click="showSponsorModal = false">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="sponsor-msg">
              <p>嗨 <span class="emoji">👋</span>，能看到这里说明 WebRPA 已经为你解决了一些问题。</p>
              <p>这个项目由一名独立开发者业余时间维护，<strong>没有任何商业模式、广告、付费墙</strong>，完全免费且开源。</p>
              <div class="sponsor-highlight">
                <span class="sponsor-highlight-bar"></span>
                <span>如果它真的让你的工作变得轻松了一点点，希望你能请作者喝杯咖啡，让这个项目能继续走下去。</span>
              </div>
              <p class="sponsor-thanks">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align: -2px; margin-right: 4px">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <strong>无论金额多少</strong>，每一位赞助者的名字都会被收录到下个版本的 README，作为永久的感谢。
              </p>
            </div>

            <div class="qr-wrap">
              <div class="qr-card qr-card-wechat">
                <div class="qr-frame">
                  <img :src="wechatQr" alt="微信" />
                </div>
                <div class="qr-foot">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M8.69 2C4.31 2 .75 4.94.75 8.57c0 2.05 1.13 3.87 2.91 5.07-.13.5-.5 1.83-.57 2.11-.09.34.13.34.27.25.11-.07 1.79-1.16 2.5-1.62.69.15 1.41.23 2.16.23.4 0 .8-.02 1.19-.07-.25-.71-.39-1.46-.39-2.24 0-3.4 3.32-6.18 7.42-6.18.27 0 .54.02.81.04C16.18 3.65 12.74 2 8.69 2z"/>
                  </svg>
                  <span>微信赞赏</span>
                </div>
              </div>
              <div class="qr-card qr-card-alipay">
                <div class="qr-frame">
                  <img :src="alipayQr" alt="支付宝" />
                </div>
                <div class="qr-foot">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M22.97 17.66s-3.5-1.18-5.4-2.06c1.13-1.96 2-4.31 2.46-6.97h-5.16V7h6.32V5.92h-6.32V3.21h-2.58c-.45 0-.45.45-.45.45v2.26H5.5V7h6.34v1.63H6.61v1.07h10.39c-.36 1.61-.95 3.09-1.74 4.35-4.4-1.46-9.07-2.21-12.04-1.43-1.9.5-3.12 1.34-3.84 2.22-3.31 4.06-.92 10.23 6.13 10.23 4.17 0 8.19-2.34 11.32-6.21 4.65 2.25 14.35 6.05 14.35 6.05v-3.45c0-.97-.5-1.39-1.21-1.79z"/>
                  </svg>
                  <span>支付宝赞助</span>
                </div>
              </div>
            </div>

            <div class="sponsor-note">
              <div class="note-line">
                <span class="note-tag">备注</span>
                <span>填写你的昵称或 GitHub 用户名，将被收录到下个版本的 README 致谢名单</span>
              </div>
              <div class="note-line">
                <span class="note-tag">联系</span>
                <span>收到赞助后会通过爱发电私信联系你确认收录信息（可选）</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 设置弹窗 -->
    <transition name="modal">
      <div v-if="showConfigModal" class="modal-mask" @click="cancelConfig">
        <div class="modal-shell modal-shell-config" @click.stop>
          <div class="modal-banner config-banner">
            <div class="modal-banner-pattern"></div>
            <div class="modal-banner-content">
              <div class="modal-banner-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white">
                  <circle cx="12" cy="12" r="3" stroke-width="2"/>
                  <path d="M12 2v3M12 19v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="modal-banner-text">
                <div class="modal-banner-title">启动器设置</div>
                <div class="modal-banner-sub">服务监听地址和端口</div>
              </div>
            </div>
            <button class="modal-close" @click="cancelConfig">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="cfg-block">
              <div class="cfg-block-head">
                <span class="cfg-block-icon cfg-block-icon-blue">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                    <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="2"/>
                    <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </span>
                <span class="cfg-block-title">后端服务</span>
              </div>
              <div class="cfg-row">
                <label>监听地址</label>
                <select v-model="configForm.backend.host" class="cfg-input">
                  <option value="127.0.0.1">127.0.0.1（仅本机）</option>
                  <option value="0.0.0.0">0.0.0.0（允许局域网访问）</option>
                </select>
              </div>
              <div class="cfg-row">
                <label>端口号</label>
                <input type="number" v-model.number="configForm.backend.port" class="cfg-input" min="1024" max="65535" placeholder="8000"/>
              </div>
            </div>

            <div class="cfg-block">
              <div class="cfg-block-head">
                <span class="cfg-block-icon cfg-block-icon-purple">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="cfg-block-title">前端服务</span>
              </div>
              <div class="cfg-row">
                <label>监听地址</label>
                <select v-model="configForm.frontend.host" class="cfg-input">
                  <option value="127.0.0.1">127.0.0.1（仅本机）</option>
                  <option value="0.0.0.0">0.0.0.0（允许局域网访问）</option>
                </select>
              </div>
              <div class="cfg-row">
                <label>端口号</label>
                <input type="number" v-model.number="configForm.frontend.port" class="cfg-input" min="1024" max="65535" placeholder="5173"/>
              </div>
            </div>

            <div class="cfg-tips">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              修改端口后需要重启服务才能生效
            </div>

            <div class="cfg-actions">
              <button class="btn-ghost" @click="cancelConfig">取消</button>
              <button class="btn-primary" @click="saveConfiguration" :disabled="saving">
                <svg v-if="!saving" viewBox="0 0 24 24" width="13" height="13" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="rotating" viewBox="0 0 24 24" width="13" height="13" fill="none">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                    stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ saving ? '保存中…' : '保存配置' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast-${toast.type}`">
        <span class="toast-icon">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" width="14" height="14" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="toast-msg">{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import wechatQr from './assets/wechat-qr.png'
import alipayQr from './assets/alipay-qr.jpg'

const version = ref('')
const checking = ref(false)
const updateInfo = ref(null)
const starting = ref(false)
const backendRunning = ref(false)
const frontendRunning = ref(false)
const showSponsorModal = ref(false)
const showConfigModal = ref(false)
const saving = ref(false)
const statusCheckInterval = ref(null)

const configForm = ref({
  backend: { host: '0.0.0.0', port: 8000, reload: false },
  frontend: { host: '0.0.0.0', port: 5173 },
})

const toast = ref({ show: false, type: 'info', message: '' })
let toastTimer = null
const showToast = (message, type = 'info', duration = 2500) => {
  toast.value = { show: true, type, message }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, duration)
}

const overallStatusText = computed(() => {
  if (backendRunning.value && frontendRunning.value) return '全部就绪'
  if (backendRunning.value || frontendRunning.value) return '部分运行'
  return '未启动'
})
const overallStatusSub = computed(() => {
  if (backendRunning.value && frontendRunning.value) return '后端和前端服务均已运行'
  if (backendRunning.value && !frontendRunning.value) return '前端服务尚未运行'
  if (!backendRunning.value && frontendRunning.value) return '后端服务尚未运行'
  return '点击下方按钮启动 WebRPA'
})
const bigStatusClass = computed(() => {
  if (backendRunning.value && frontendRunning.value) return 'status-success'
  if (backendRunning.value || frontendRunning.value) return 'status-warn'
  return 'status-idle'
})

// 标题栏控制
const minimize = async () => {
  try { await getCurrentWindow().minimize() } catch (e) { console.error(e) }
}
const closeApp = async () => {
  try { await invoke('stop_services') } catch {}
  try { await getCurrentWindow().close() } catch (e) { console.error(e) }
}

// 服务状态轮询
const checkServiceStatus = async () => {
  try {
    const [backend, frontend] = await invoke('check_service_status')
    backendRunning.value = backend
    frontendRunning.value = frontend
  } catch (error) {
    console.error('检查服务状态失败:', error)
  }
}
const startStatusCheck = () => {
  if (statusCheckInterval.value) clearInterval(statusCheckInterval.value)
  statusCheckInterval.value = setInterval(checkServiceStatus, 3000)
}
const stopStatusCheck = () => {
  if (statusCheckInterval.value) {
    clearInterval(statusCheckInterval.value)
    statusCheckInterval.value = null
  }
}

const checkUpdate = async () => {
  if (checking.value) return
  checking.value = true
  try {
    const result = await invoke('check_update', { currentVersion: version.value })
    updateInfo.value = result
    if (!result.has_update) showToast('当前已是最新版本', 'success')
  } catch (error) {
    showToast(`检查更新失败: ${error}`, 'error')
  } finally {
    checking.value = false
  }
}

const downloadUpdate = () => {
  if (updateInfo.value?.update_url) invoke('open_browser', { url: updateInfo.value.update_url })
}
const downloadWithMirror = () => {
  if (updateInfo.value?.latest_version) {
    const v = updateInfo.value.latest_version
    const mirrorUrl = `https://ghfile.geekertao.top/github.com/pmh1314520/WebRPA/releases/download/v${v}/WebRPA-${v}-FullVersion.7z`
    invoke('open_browser', { url: mirrorUrl })
    showToast('已打开加速下载，下载后解压覆盖原目录', 'info', 3500)
  }
}

async function waitFor(predicate, maxIter, intervalMs, beforeCheck) {
  for (let i = 0; i < maxIter; i++) {
    await new Promise(r => setTimeout(r, intervalMs))
    if (beforeCheck) await beforeCheck()
    if (predicate()) return true
  }
  return false
}

const startServices = async () => {
  starting.value = true
  try {
    await checkServiceStatus()
    const needBackend = !backendRunning.value
    const needFrontend = !frontendRunning.value
    if (!needBackend && !needFrontend) {
      showToast('所有服务都已在运行', 'info')
      return
    }
    if (needBackend) {
      await invoke('start_backend')
      const ok = await waitFor(() => backendRunning.value, 60, 500, checkServiceStatus)
      if (!ok) throw new Error('后端启动超时（30 秒），请检查后端日志')
    }
    if (needFrontend) {
      await invoke('start_frontend')
      const ok = await waitFor(() => frontendRunning.value, 40, 500, checkServiceStatus)
      if (!ok) throw new Error('前端启动超时（20 秒），请检查前端日志')
    }
    await checkServiceStatus()
    if (backendRunning.value && frontendRunning.value) {
      showToast('服务启动成功，正在打开浏览器…', 'success')
      setTimeout(openBrowser, 600)
    }
  } catch (error) {
    const msg = typeof error === 'string' ? error : String(error?.message || error)
    showToast(msg, 'error', 4500)
    await checkServiceStatus()
  } finally {
    starting.value = false
  }
}

const stopServices = async () => {
  try {
    await invoke('stop_services')
    showToast('服务已停止', 'info')
    await new Promise(r => setTimeout(r, 800))
    await checkServiceStatus()
  } catch (error) {
    showToast(`停止失败: ${error}`, 'error')
    await checkServiceStatus()
  }
}

const openBrowser = async () => {
  try {
    const config = await invoke('read_config')
    const url = `http://localhost:${config.frontend.port}?backend_port=${config.backend.port}`
    await invoke('open_browser', { url })
  } catch (error) {
    showToast(`打开浏览器失败: ${error}`, 'error')
  }
}

const openGithub = () => invoke('open_browser', { url: 'https://github.com/pmh1314520/WebRPA' })
const showSponsor = () => { showSponsorModal.value = true }
const showLicense = () => invoke('open_browser', { url: 'https://github.com/pmh1314520/WebRPA/blob/main/LICENSE' })

const loadConfig = async () => {
  try {
    const config = await invoke('read_config')
    configForm.value = JSON.parse(JSON.stringify(config))
  } catch (error) { console.error('加载配置失败:', error) }
}

const saveConfiguration = async () => {
  saving.value = true
  try {
    if (configForm.value.backend.port < 1024 || configForm.value.backend.port > 65535) {
      showToast('后端端口必须在 1024-65535', 'error'); return
    }
    if (configForm.value.frontend.port < 1024 || configForm.value.frontend.port > 65535) {
      showToast('前端端口必须在 1024-65535', 'error'); return
    }
    if (configForm.value.backend.port === configForm.value.frontend.port) {
      showToast('后端和前端端口不能相同', 'error'); return
    }
    await invoke('save_config', { config: configForm.value })
    showToast('配置已保存', 'success')
    showConfigModal.value = false
    if (backendRunning.value || frontendRunning.value) {
      showToast('服务运行中，重启后才会应用新配置', 'info', 3500)
    }
  } catch (error) {
    showToast(`保存失败: ${error}`, 'error')
  } finally {
    saving.value = false
  }
}

const cancelConfig = () => { loadConfig(); showConfigModal.value = false }
const openBackendLog = async () => {
  try { await invoke('open_backend_log') } catch (e) { showToast(`打开后端日志失败: ${e}`, 'error') }
}
const openFrontendLog = async () => {
  try { await invoke('open_frontend_log') } catch (e) { showToast(`打开前端日志失败: ${e}`, 'error') }
}

onMounted(async () => {
  try { version.value = await invoke('get_version') } catch { version.value = '?' }
  await loadConfig()
  await checkServiceStatus()
  startStatusCheck()
  setTimeout(checkUpdate, 1500)
  setTimeout(() => { showSponsorModal.value = true }, 800)
})

onUnmounted(() => {
  stopStatusCheck()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>


<style>
/* ============================================================
   WebRPA 启动器 v3 - 现代化彩色专业版
   非 scoped，确保所有样式无遮挡可控
   ============================================================ */
:root {
  --c-bg-base: #f4f6fb;
  --c-bg-deep: linear-gradient(140deg, #f7f8ff 0%, #f0f4fb 100%);
  --c-card: #ffffff;
  --c-border: #e5e8ef;
  --c-border-soft: #eef0f6;

  --c-text-1: #0b1426;
  --c-text-2: #2a3245;
  --c-text-3: #5b6478;
  --c-text-4: #8a93a6;
  --c-text-5: #b8bfd0;

  --c-blue-50:  #eff6ff;
  --c-blue-100: #dbeafe;
  --c-blue-200: #bfdbfe;
  --c-blue-500: #3b82f6;
  --c-blue-600: #2563eb;
  --c-blue-700: #1d4ed8;

  --c-purple-50:  #f5f3ff;
  --c-purple-100: #ede9fe;
  --c-purple-500: #8b5cf6;
  --c-purple-600: #7c3aed;
  --c-purple-700: #6d28d9;

  --c-green-50:  #ecfdf5;
  --c-green-100: #d1fae5;
  --c-green-500: #10b981;
  --c-green-600: #059669;
  --c-green-700: #047857;

  --c-orange-50: #fff7ed;
  --c-orange-500: #f97316;
  --c-orange-600: #ea580c;

  --c-pink-50:  #fdf2f8;
  --c-pink-100: #fce7f3;
  --c-pink-500: #ec4899;
  --c-pink-600: #db2777;
  --c-pink-700: #be185d;

  --c-red-50: #fef2f2;
  --c-red-500: #ef4444;
  --c-red-600: #dc2626;

  --c-yellow-50: #fefce8;
  --c-yellow-500: #eab308;

  --shadow-1: 0 1px 3px rgba(11, 20, 38, 0.06), 0 1px 2px rgba(11, 20, 38, 0.04);
  --shadow-2: 0 4px 14px rgba(11, 20, 38, 0.08), 0 1px 3px rgba(11, 20, 38, 0.04);
  --shadow-3: 0 10px 30px rgba(11, 20, 38, 0.12), 0 2px 6px rgba(11, 20, 38, 0.05);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: var(--c-text-2);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--c-bg-base);
  overflow: hidden;
  user-select: none;
}

/* ============================================================
   顶部品牌横幅
   ============================================================ */
.brand-bar {
  position: relative;
  height: 64px;
  flex-shrink: 0;
  overflow: hidden;
  z-index: 2;
}
.brand-bar-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 600px 200px at 20% 100%, rgba(139, 92, 246, 0.4), transparent 70%),
    radial-gradient(ellipse 500px 200px at 80% 100%, rgba(236, 72, 153, 0.3), transparent 70%),
    linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #7c3aed 100%);
}
.brand-bar-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='white' stroke-opacity='0.05' stroke-width='1'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.brand-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 20px;
  -webkit-app-region: drag;
}
.brand-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* WebRPA 艺术字 LOGO */
.brand-logo {
  display: inline-flex;
  align-items: baseline;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.02em;
  font-style: italic;
}
.brand-letter {
  display: inline-block;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.brand-letter-1, .brand-letter-2, .brand-letter-3 {
  background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.brand-pill {
  display: inline-flex;
  margin-left: 4px;
  padding: 1px 7px 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.brand-pill .brand-letter {
  background: linear-gradient(135deg, #1d4ed8, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  text-shadow: none;
  font-size: 18px;
}

.brand-meta {
  border-left: 1px solid rgba(255, 255, 255, 0.25);
  padding-left: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.brand-title {
  font-size: 13px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.02em;
}
.brand-version {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}
.version-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.25);
}
.version-sep { color: rgba(255, 255, 255, 0.4); }
.version-tag { font-weight: 400; }

.window-controls {
  display: flex;
  gap: 4px;
  -webkit-app-region: no-drag;
}
.win-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background 150ms, transform 100ms;
}
.win-btn:hover { background: rgba(255, 255, 255, 0.22); }
.win-btn:active { transform: scale(0.95); }
.win-btn-close:hover { background: #dc2626; border-color: #b91c1c; }

/* ============================================================
   主体页面
   ============================================================ */
.page {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--c-bg-deep);
}
.page::-webkit-scrollbar { width: 8px; }
.page::-webkit-scrollbar-track { background: transparent; }
.page::-webkit-scrollbar-thumb {
  background: rgba(11, 20, 38, 0.15);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.page::-webkit-scrollbar-thumb:hover { background: rgba(11, 20, 38, 0.25); background-clip: content-box; }

/* ============================================================
   状态条
   ============================================================ */
.status-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.status-strip-left { display: flex; align-items: center; gap: 12px; }
.status-strip-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.big-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 10px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  box-shadow: var(--shadow-1);
  transition: border-color 200ms, box-shadow 200ms;
}
.big-status-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.big-status-text { display: flex; flex-direction: column; gap: 2px; line-height: 1.2; }
.big-status-title { font-size: 13.5px; font-weight: 700; color: var(--c-text-1); }
.big-status-sub { font-size: 11px; color: var(--c-text-4); }

.status-idle .big-status-icon { background: var(--c-blue-50); color: var(--c-blue-600); }
.status-warn { border-color: #fed7aa; }
.status-warn .big-status-icon { background: var(--c-orange-50); color: var(--c-orange-600); }
.status-success { border-color: var(--c-green-100); background: linear-gradient(135deg, #ffffff, var(--c-green-50)); }
.status-success .big-status-icon {
  background: linear-gradient(135deg, var(--c-green-500), var(--c-green-600));
  color: white;
  box-shadow: 0 3px 8px rgba(16, 185, 129, 0.3);
}
.status-success .big-status-title { color: var(--c-green-700); }

/* chip 按钮 */
.chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-2);
  cursor: pointer;
  transition: border-color 150ms, color 150ms, background 150ms, transform 100ms;
}
.chip-btn:hover:not(:disabled) {
  border-color: var(--c-blue-500);
  color: var(--c-blue-600);
  background: var(--c-blue-50);
}
.chip-btn:active:not(:disabled) { transform: translateY(1px); }
.chip-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.chip-btn svg { color: currentColor; }

.chip-btn-pink {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(219, 39, 119, 0.35);
}
.chip-btn-pink:hover:not(:disabled) {
  background: linear-gradient(135deg, #db2777, #be185d);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(219, 39, 119, 0.5);
  transform: translateY(-1px);
}

.rotating { animation: rotate-360 1s linear infinite; }
@keyframes rotate-360 { to { transform: rotate(360deg); } }


/* ============================================================
   更新通知
   ============================================================ */
.update-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 1px solid #fed7aa;
  border-radius: 10px;
  box-shadow: var(--shadow-1);
}
.update-banner-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(249, 115, 22, 0.35);
}
.update-banner-text { flex: 1; min-width: 0; }
.update-banner-title { font-size: 13.5px; font-weight: 700; color: #7c2d12; line-height: 1.3; }
.update-banner-title strong { color: #c2410c; }
.update-banner-sub { font-size: 11.5px; color: #9a3412; margin-top: 2px; }
.update-banner-actions { display: flex; gap: 6px; flex-shrink: 0; }

.link-btn {
  background: transparent;
  border: none;
  color: var(--c-orange-600);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 120ms;
}
.link-btn:hover { background: rgba(234, 88, 12, 0.1); }

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(234, 88, 12, 0.4);
  transition: transform 120ms, box-shadow 120ms;
}
.cta-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(234, 88, 12, 0.5); }

/* ============================================================
   主控制卡
   ============================================================ */
.hero-card {
  position: relative;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: var(--shadow-2);
  overflow: hidden;
}
.hero-deco {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 60%);
  pointer-events: none;
}
.hero-deco::after {
  content: '';
  position: absolute;
  top: 100px;
  right: 100px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%);
}
.hero-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.hero-info { flex: 1; min-width: 0; }
.hero-tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  background: var(--c-blue-50);
  color: var(--c-blue-700);
  border-radius: 4px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  border: 1px solid var(--c-blue-100);
}
.hero-tag-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--c-blue-500);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  animation: hero-tag-pulse 2s ease-in-out infinite;
}
@keyframes hero-tag-pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
  50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05); }
}
.hero-tag-warm {
  background: var(--c-pink-50);
  color: var(--c-pink-700);
  border-color: var(--c-pink-100);
}
.hero-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--c-text-1);
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin-bottom: 6px;
}
.hero-highlight {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin-left: 4px;
}
.hero-sub {
  font-size: 12.5px;
  color: var(--c-text-3);
  line-height: 1.5;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* CTA 主按钮（启动） */
.cta-primary,
.cta-success {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 22px;
  border: none;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  overflow: hidden;
  transition: transform 150ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 200ms;
  letter-spacing: 0.01em;
}
.cta-primary {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  box-shadow:
    0 4px 12px rgba(37, 99, 235, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}
.cta-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 8px 22px rgba(37, 99, 235, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.cta-primary:active:not(:disabled) { transform: translateY(0); }
.cta-primary:disabled { opacity: 0.7; cursor: not-allowed; }

.cta-success {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  box-shadow:
    0 4px 12px rgba(16, 185, 129, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}
.cta-success:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 22px rgba(16, 185, 129, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.cta-success:active { transform: translateY(0); }

.cta-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
  animation: cta-glow-rotate 4s linear infinite;
  pointer-events: none;
}
@keyframes cta-glow-rotate { to { transform: rotate(360deg); } }

.cta-stop {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 11px 14px;
  background: var(--c-card);
  color: var(--c-red-600);
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms, border-color 150ms, transform 100ms;
}
.cta-stop:hover:not(:disabled) {
  background: var(--c-red-50);
  border-color: var(--c-red-500);
}
.cta-stop:active:not(:disabled) { transform: translateY(1px); }
.cta-stop:disabled { opacity: 0.4; cursor: not-allowed; }

/* ============================================================
   服务卡片
   ============================================================ */
.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.service-card {
  position: relative;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 200ms, box-shadow 200ms, transform 150ms;
}
.service-card:hover {
  border-color: var(--c-blue-200);
  box-shadow: var(--shadow-1);
  transform: translateY(-1px);
}
.service-card.active {
  background: linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%);
  border-color: var(--c-green-100);
}
.service-card-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}
.service-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}
.service-icon-blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.3);
}
.service-icon-purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 3px 8px rgba(124, 58, 237, 0.3);
}
.service-text { flex: 1; min-width: 0; }
.service-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--c-text-1);
  margin-bottom: 4px;
}
.service-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--c-text-4);
}
.service-state-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-text-5);
  flex-shrink: 0;
}
.service-state-dot.on {
  background: var(--c-green-500);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  animation: dot-pulse 1.6s ease-in-out infinite;
}
@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }
  50% { box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.05); }
}
.service-state-text { font-weight: 600; color: var(--c-text-3); }
.service-card.active .service-state-text { color: var(--c-green-700); }
.service-divider { color: var(--c-text-5); }
.service-port {
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
  font-size: 11px;
  color: var(--c-text-3);
}

.service-action {
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  background: var(--c-bg-base);
  color: var(--c-text-3);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  cursor: pointer;
  transition: background 150ms, color 150ms, border-color 150ms;
}
.service-action:hover {
  background: var(--c-blue-50);
  color: var(--c-blue-600);
  border-color: var(--c-blue-200);
}

.service-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--c-green-500), transparent);
  background-size: 200% 100%;
  animation: progress-flow 2.5s ease-in-out infinite;
}
@keyframes progress-flow {
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}


/* ============================================================
   信息卡（隐私 / 端口 / 赞助）
   ============================================================ */
.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
.info-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid;
  transition: transform 150ms, box-shadow 200ms;
}
.info-card:hover { transform: translateY(-1px); box-shadow: var(--shadow-1); }
.info-card-green {
  background: linear-gradient(135deg, #ffffff, var(--c-green-50));
  border-color: var(--c-green-100);
}
.info-card-blue {
  background: linear-gradient(135deg, #ffffff, var(--c-blue-50));
  border-color: var(--c-blue-100);
}
.info-card-pink {
  background: linear-gradient(135deg, #ffffff, var(--c-pink-50));
  border-color: var(--c-pink-100);
}
.info-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}
.info-card-green .info-icon-wrap { background: linear-gradient(135deg, #10b981, #059669); }
.info-card-blue .info-icon-wrap { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.info-card-pink .info-icon-wrap { background: linear-gradient(135deg, #ec4899, #db2777); }
.info-content { flex: 1; min-width: 0; }
.info-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text-1);
  margin-bottom: 2px;
}
.info-text {
  font-size: 11px;
  color: var(--c-text-3);
  line-height: 1.4;
}


/* ============================================================
   底部
   ============================================================ */
.footer-bar {
  margin-top: auto;
  padding: 6px 4px 2px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--c-text-4);
}
.footer-copyright { font-weight: 500; }
.footer-separator {
  width: 1px;
  height: 12px;
  background: var(--c-border);
  margin: 0 2px;
}
.footer-link {
  color: var(--c-text-3);
  cursor: pointer;
  transition: color 150ms;
}
.footer-link:hover { color: var(--c-blue-600); }
.footer-dot { color: var(--c-text-5); }
.footer-heart {
  color: var(--c-pink-600);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}
.footer-heart:hover { color: var(--c-pink-700); }

/* ============================================================
   弹窗（mask 必须不透明）
   ============================================================ */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(11, 20, 38, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-shell {
  background: white;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 25px 60px rgba(11, 20, 38, 0.35),
    0 8px 20px rgba(11, 20, 38, 0.2);
}
.modal-shell-config { max-width: 480px; }


/* 弹窗顶部 banner */
.modal-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px;
  overflow: hidden;
}
.sponsor-banner {
  background:
    radial-gradient(ellipse 400px 200px at 0% 100%, rgba(245, 158, 11, 0.4), transparent 60%),
    radial-gradient(ellipse 400px 200px at 100% 0%, rgba(236, 72, 153, 0.5), transparent 60%),
    linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%);
}
.config-banner {
  background:
    radial-gradient(ellipse 400px 200px at 100% 100%, rgba(139, 92, 246, 0.5), transparent 60%),
    linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #7c3aed 100%);
}
.modal-banner-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='none' stroke='white' stroke-opacity='0.08' stroke-width='1'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}
.modal-banner-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}
.modal-banner-icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.modal-banner-text { color: white; }
.modal-banner-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.3;
}
.modal-banner-sub {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
}
.modal-close {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 7px;
  color: white;
  cursor: pointer;
  transition: background 150ms, transform 100ms;
}
.modal-close:hover { background: rgba(255, 255, 255, 0.28); }
.modal-close:active { transform: scale(0.95); }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px 20px 20px;
}
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 3px; }


/* ============================================================
   赞助弹窗内容
   ============================================================ */
.sponsor-msg {
  font-size: 13px;
  color: var(--c-text-2);
  line-height: 1.7;
  margin-bottom: 16px;
}
.sponsor-msg p { margin-bottom: 8px; }
.sponsor-msg strong { color: var(--c-text-1); font-weight: 700; }
.emoji { font-family: 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif; }

.sponsor-highlight {
  position: relative;
  display: flex;
  gap: 10px;
  padding: 10px 12px 10px 14px;
  margin: 12px 0;
  background: linear-gradient(135deg, var(--c-pink-50), #fff1f2);
  border-radius: 8px;
  font-size: 12.5px;
  color: #9f1239;
  font-weight: 500;
  line-height: 1.6;
}
.sponsor-highlight-bar {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, #ec4899, #db2777);
  border-radius: 2px;
}
.sponsor-thanks {
  display: flex;
  align-items: flex-start;
  font-size: 11.5px;
  color: var(--c-text-3);
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--c-border);
  line-height: 1.5;
}
.sponsor-thanks svg { color: var(--c-pink-500); flex-shrink: 0; }

.qr-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 12px;
}
.qr-card {
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}
.qr-card-wechat {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #a7f3d0;
}
.qr-card-alipay {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
}
.qr-frame {
  background: white;
  border-radius: 7px;
  padding: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
}
.qr-frame img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  object-fit: contain;
}
.qr-foot {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
}
.qr-card-wechat .qr-foot { color: #07c160; }
.qr-card-alipay .qr-foot { color: #1677ff; }

.sponsor-note {
  background: var(--c-bg-base);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 11.5px;
}
.note-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.note-tag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 18px;
  background: white;
  border: 1px solid var(--c-border);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  color: var(--c-text-3);
}
.note-line span:last-child { color: var(--c-text-3); line-height: 1.5; }


/* ============================================================
   设置弹窗
   ============================================================ */
.cfg-block {
  background: var(--c-bg-base);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.cfg-block-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-border);
}
.cfg-block-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
.cfg-block-icon-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.cfg-block-icon-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.cfg-block-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--c-text-1);
}
.cfg-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.cfg-row:last-child { margin-bottom: 0; }
.cfg-row label {
  flex-shrink: 0;
  width: 64px;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text-3);
}
.cfg-input {
  flex: 1;
  height: 32px;
  padding: 0 10px;
  background: white;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  font-size: 12.5px;
  color: var(--c-text-1);
  font-family: inherit;
  transition: border-color 150ms, box-shadow 150ms;
}
.cfg-input:focus {
  outline: none;
  border-color: var(--c-blue-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.cfg-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  background: var(--c-blue-50);
  border: 1px solid var(--c-blue-100);
  border-radius: 7px;
  font-size: 11.5px;
  color: var(--c-blue-700);
  margin-top: 4px;
}
.cfg-tips svg { color: var(--c-blue-600); flex-shrink: 0; }

.cfg-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}

/* 弹窗按钮 */
.btn-ghost {
  padding: 8px 16px;
  background: white;
  color: var(--c-text-3);
  border: 1px solid var(--c-border);
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms, border-color 150ms;
}
.btn-ghost:hover {
  background: var(--c-bg-base);
  border-color: var(--c-text-5);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 18px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
  transition: transform 120ms, box-shadow 200ms;
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }


/* ============================================================
   Toast
   ============================================================ */
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border: 1px solid var(--c-border);
  border-radius: 9px;
  box-shadow: var(--shadow-3);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--c-text-2);
  z-index: 2000;
  pointer-events: none;
  max-width: 80%;
}
.toast-icon { display: flex; flex-shrink: 0; }
.toast-msg { line-height: 1.4; }
.toast-success {
  background: linear-gradient(135deg, #ffffff, var(--c-green-50));
  border-color: var(--c-green-100);
  color: var(--c-green-700);
}
.toast-success .toast-icon { color: var(--c-green-500); }
.toast-error {
  background: linear-gradient(135deg, #ffffff, var(--c-red-50));
  border-color: #fecaca;
  color: var(--c-red-600);
}
.toast-error .toast-icon { color: var(--c-red-500); }
.toast-info {
  background: linear-gradient(135deg, #ffffff, var(--c-blue-50));
  border-color: var(--c-blue-100);
  color: var(--c-blue-700);
}
.toast-info .toast-icon { color: var(--c-blue-500); }

/* ============================================================
   过渡动画
   ============================================================ */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 220ms, transform 220ms cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to { opacity: 0; transform: translateY(-8px); }

.modal-enter-active,
.modal-leave-active { transition: opacity 200ms ease; }
.modal-enter-active .modal-shell,
.modal-leave-active .modal-shell {
  transition: transform 240ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms;
}
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal-shell,
.modal-leave-to .modal-shell {
  transform: scale(0.94) translateY(8px);
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: transform 240ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-16px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
</style>
