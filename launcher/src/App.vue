<template>
  <div class="launcher">
    <!-- 自定义标题栏 -->
    <div class="titlebar" data-tauri-drag-region>
      <div class="titlebar-brand">
        <img src="/webrpa-logo.png" alt="WebRPA" class="titlebar-logo" />
        <span class="titlebar-name">
          <span class="brand-web">Web</span><span class="brand-rpa">RPA</span>
          <span class="titlebar-sub">启动器</span>
        </span>
        <span class="titlebar-version">v{{ version }}</span>
      </div>
      <div class="titlebar-controls">
        <button class="tb-btn" @click="minimize" title="最小化">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="tb-btn tb-btn-close" @click="closeApp" title="关闭">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 主体 -->
    <div class="main">
      <!-- 顶部状态栏 -->
      <div class="topbar">
        <div class="topbar-left">
          <div class="status-pill" :class="{ active: backendRunning && frontendRunning, partial: backendRunning ^ frontendRunning }">
            <span class="status-dot"></span>
            <span class="status-text">{{ overallStatusText }}</span>
          </div>
          <div class="port-tags">
            <span class="port-tag" :class="{ active: backendRunning }">
              <span class="tag-label">后端</span>
              <span class="tag-port">:{{ configForm.backend.port }}</span>
            </span>
            <span class="port-tag" :class="{ active: frontendRunning }">
              <span class="tag-label">前端</span>
              <span class="tag-port">:{{ configForm.frontend.port }}</span>
            </span>
          </div>
        </div>
        <div class="topbar-right">
          <button class="ghost-btn" @click="checkUpdate" :disabled="checking">
            <svg :class="{ spinning: checking }" viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ checking ? '检查中' : '检查更新' }}
          </button>
          <button class="ghost-btn" @click="showConfigModal = true" title="设置">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/>
            </svg>
            设置
          </button>
          <button class="ghost-btn" @click="openGithub" title="GitHub">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
          <button class="primary-btn-sm sponsor-btn" @click="showSponsor">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="currentColor"/>
            </svg>
            支持作者
          </button>
        </div>
      </div>

      <!-- 更新通知 -->
      <transition name="fade-down">
        <div v-if="updateInfo && updateInfo.has_update" class="update-card">
          <div class="update-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="update-text">
            <div class="update-title">发现新版本 v{{ updateInfo.latest_version }}</div>
            <div class="update-meta">{{ updateInfo.release_date }} · {{ updateInfo.changelog || '点击下载查看更新内容' }}</div>
          </div>
          <div class="update-actions">
            <button class="text-btn" @click="downloadWithMirror" title="国内加速下载">加速下载</button>
            <button class="primary-btn-sm" @click="downloadUpdate">前往下载</button>
          </div>
        </div>
      </transition>

      <!-- 主控制卡片 -->
      <div class="main-card">
        <div class="hero">
          <div class="hero-left">
            <div class="hero-title">
              <span class="hero-title-text">服务控制中心</span>
              <span class="hero-title-tag">本地运行</span>
            </div>
            <div class="hero-desc">点击启动后将自动拉起后端 API 服务和前端 Web 编辑器，并打开浏览器</div>
          </div>
          <div class="hero-actions">
            <button
              v-if="!backendRunning || !frontendRunning"
              class="primary-btn"
              @click="startServices"
              :disabled="starting"
            >
              <svg v-if="!starting" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else class="spinning" viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ starting ? '启动中…' : '启动服务' }}
            </button>
            <button
              v-else
              class="success-btn"
              @click="openBrowser"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              打开浏览器
            </button>
            <button
              class="danger-btn"
              @click="stopServices"
              :disabled="!backendRunning && !frontendRunning"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <rect x="6" y="6" width="12" height="12"/>
              </svg>
              停止
            </button>
          </div>
        </div>

        <div class="service-grid">
          <div class="service-item" :class="{ active: backendRunning }">
            <div class="svc-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M2 9h20M2 15h20M5 4l-3 5v6l3 5h14l3-5V9l-3-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="svc-info">
              <div class="svc-name">后端 API 服务</div>
              <div class="svc-meta">
                <span class="svc-state">{{ backendRunning ? '运行中' : '未启动' }}</span>
                <span class="svc-divider">·</span>
                <code class="svc-port">{{ configForm.backend.host }}:{{ configForm.backend.port }}</code>
              </div>
            </div>
            <button class="micro-btn" @click="openBackendLog" title="查看日志">日志</button>
          </div>

          <div class="service-item" :class="{ active: frontendRunning }">
            <div class="svc-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="svc-info">
              <div class="svc-name">前端 Web 编辑器</div>
              <div class="svc-meta">
                <span class="svc-state">{{ frontendRunning ? '运行中' : '未启动' }}</span>
                <span class="svc-divider">·</span>
                <code class="svc-port">{{ configForm.frontend.host }}:{{ configForm.frontend.port }}</code>
              </div>
            </div>
            <button class="micro-btn" @click="openFrontendLog" title="查看日志">日志</button>
          </div>
        </div>
      </div>

      <!-- 提示卡片：隐私 / 数据存储 -->
      <div class="info-card">
        <div class="info-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="info-text">
          <strong>数据安全</strong>：API Key、密码、Token 等敏感配置仅保存在浏览器本地，不会写入项目文件夹，分享项目时不会泄露
        </div>
      </div>

      <!-- 底部 footer -->
      <div class="footer">
        <span class="copyright">© 2026 青云制作 · 彭明航</span>
        <span class="footer-divider">·</span>
        <a class="footer-link" @click="openGithub">GitHub</a>
        <span class="footer-divider">·</span>
        <a class="footer-link" @click="showLicense">开源协议</a>
        <span class="footer-divider">·</span>
        <a class="footer-link footer-heart" @click="showSponsor">为爱发电中</a>
      </div>
    </div>


    <!-- 赞助弹窗 -->
    <transition name="modal">
      <div v-if="showSponsorModal" class="modal-overlay" @click="showSponsorModal = false">
        <div class="modal-card sponsor-modal" @click.stop>
          <div class="modal-head">
            <div class="modal-head-icon sponsor-head-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div class="modal-head-text">
              <div class="modal-title">支持 WebRPA 持续开发</div>
              <div class="modal-subtitle">独立开发，为爱发电</div>
            </div>
            <button class="modal-close" @click="showSponsorModal = false">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="sponsor-message">
              <p>嘿，能看到这里说明 WebRPA 已经为你提供了一些帮助 <span class="emoji-fix">🌱</span></p>
              <p>这个项目由一名独立开发者业余时间维护，没有任何商业模式、没有广告、没有付费墙，完全免费且开源。</p>
              <p class="highlight">如果它真的让你的工作变得轻松了一点点，希望你能请作者喝杯咖啡，让这个项目能继续走下去。</p>
              <p class="thanks">无论金额多少，每一位赞助者的名字都会被收录到下个版本的 README，作为永久的感谢 <span class="emoji-fix">💌</span></p>
            </div>

            <div class="qr-grid">
              <div class="qr-item">
                <div class="qr-frame">
                  <img :src="wechatQr" alt="微信" />
                </div>
                <div class="qr-label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M8.69 2C4.31 2 .75 4.94.75 8.57c0 2.05 1.13 3.87 2.91 5.07-.13.5-.5 1.83-.57 2.11-.09.34.13.34.27.25.11-.07 1.79-1.16 2.5-1.62.69.15 1.41.23 2.16.23.4 0 .8-.02 1.19-.07-.25-.71-.39-1.46-.39-2.24 0-3.4 3.32-6.18 7.42-6.18.27 0 .54.02.81.04C16.18 3.65 12.74 2 8.69 2zM5.6 6.94c.55 0 1 .44 1 1s-.45 1-1 1c-.55 0-1-.44-1-1s.45-1 1-1zm6.13 0c.55 0 1 .44 1 1s-.45 1-1 1c-.55 0-1-.44-1-1s.45-1 1-1z"/>
                    <path d="M23.25 12.31c0-3.04-3.04-5.51-6.78-5.51-3.85 0-6.78 2.47-6.78 5.51 0 3.04 2.94 5.51 6.78 5.51.79 0 1.55-.1 2.27-.3.07-.02.14-.01.2.02.65.42 1.66 1.06 1.78 1.13.16.09.36.04.27-.27-.06-.22-.36-1.34-.46-1.74 1.66-1.05 2.72-2.59 2.72-4.35zm-9-1.34c-.46 0-.83-.37-.83-.83s.37-.83.83-.83.83.37.83.83-.37.83-.83.83zm4.43 0c-.46 0-.83-.37-.83-.83s.37-.83.83-.83.83.37.83.83-.37.83-.83.83z"/>
                  </svg>
                  <span>微信赞赏</span>
                </div>
              </div>
              <div class="qr-item">
                <div class="qr-frame">
                  <img :src="alipayQr" alt="支付宝" />
                </div>
                <div class="qr-label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M22.97 17.66s-3.5-1.18-5.4-2.06c1.13-1.96 2-4.31 2.46-6.97h-5.16V7h6.32V5.92h-6.32V3.21h-2.58c-.45 0-.45.45-.45.45v2.26H5.5V7h6.34v1.63H6.61v1.07h10.39c-.36 1.61-.95 3.09-1.74 4.35-4.4-1.46-9.07-2.21-12.04-1.43-1.9.5-3.12 1.34-3.84 2.22-3.31 4.06-.92 10.23 6.13 10.23 4.17 0 8.19-2.34 11.32-6.21 4.65 2.25 14.35 6.05 14.35 6.05v-3.45c0-.97-.5-1.39-1.21-1.79z"/>
                  </svg>
                  <span>支付宝</span>
                </div>
              </div>
            </div>

            <div class="sponsor-note">
              <div class="note-row">
                <span class="note-label">备注</span>
                <span class="note-value">填写你的昵称或 GitHub 用户名，会被收录到 README</span>
              </div>
              <div class="note-row">
                <span class="note-label">联系</span>
                <span class="note-value">收到赞助后会主动联系你确认收录信息（可选）</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 设置弹窗 -->
    <transition name="modal">
      <div v-if="showConfigModal" class="modal-overlay" @click="cancelConfig">
        <div class="modal-card config-modal" @click.stop>
          <div class="modal-head">
            <div class="modal-head-icon config-head-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="modal-head-text">
              <div class="modal-title">启动器设置</div>
              <div class="modal-subtitle">服务监听地址和端口</div>
            </div>
            <button class="modal-close" @click="cancelConfig">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="cfg-section">
              <div class="cfg-section-title">后端服务</div>
              <div class="cfg-row">
                <label class="cfg-label">监听地址</label>
                <select v-model="configForm.backend.host" class="cfg-input">
                  <option value="127.0.0.1">127.0.0.1（仅本机）</option>
                  <option value="0.0.0.0">0.0.0.0（允许局域网访问）</option>
                </select>
              </div>
              <div class="cfg-row">
                <label class="cfg-label">端口号</label>
                <input
                  type="number"
                  v-model.number="configForm.backend.port"
                  class="cfg-input"
                  min="1024"
                  max="65535"
                  placeholder="8000"
                />
              </div>
            </div>

            <div class="cfg-section">
              <div class="cfg-section-title">前端服务</div>
              <div class="cfg-row">
                <label class="cfg-label">监听地址</label>
                <select v-model="configForm.frontend.host" class="cfg-input">
                  <option value="127.0.0.1">127.0.0.1（仅本机）</option>
                  <option value="0.0.0.0">0.0.0.0（允许局域网访问）</option>
                </select>
              </div>
              <div class="cfg-row">
                <label class="cfg-label">端口号</label>
                <input
                  type="number"
                  v-model.number="configForm.frontend.port"
                  class="cfg-input"
                  min="1024"
                  max="65535"
                  placeholder="5173"
                />
              </div>
            </div>

            <div class="cfg-tip">
              <span class="tip-dot"></span>
              修改端口后需要重启服务才能生效
            </div>

            <div class="cfg-actions">
              <button class="ghost-btn" @click="cancelConfig">取消</button>
              <button class="primary-btn-sm" @click="saveConfiguration" :disabled="saving">
                {{ saving ? '保存中…' : '保存配置' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast 提示 -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast-${toast.type}`">
        <span class="toast-icon">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="toast-text">{{ toast.message }}</span>
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
const SPONSOR_HINT_KEY = 'webrpa-launcher-sponsor-shown'

const configForm = ref({
  backend: { host: '0.0.0.0', port: 8000, reload: false },
  frontend: { host: '0.0.0.0', port: 5173 },
})

const toast = ref({ show: false, type: 'info', message: '' })
let toastTimer = null
const showToast = (message, type = 'info', duration = 2400) => {
  toast.value = { show: true, type, message }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, duration)
}

const overallStatusText = computed(() => {
  if (backendRunning.value && frontendRunning.value) return '全部就绪'
  if (backendRunning.value || frontendRunning.value) return '部分运行'
  return '未启动'
})

// 标题栏控制
const minimize = async () => {
  try { await getCurrentWindow().minimize() } catch (e) { console.error(e) }
}
const closeApp = async () => {
  // 关闭前先尝试停止服务，避免端口残留
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
    if (!result.has_update) {
      showToast('当前已是最新版本', 'success')
    }
  } catch (error) {
    showToast(`检查更新失败: ${error}`, 'error')
  } finally {
    checking.value = false
  }
}

const downloadUpdate = () => {
  if (updateInfo.value?.update_url) {
    invoke('open_browser', { url: updateInfo.value.update_url })
  }
}
const downloadWithMirror = () => {
  if (updateInfo.value?.latest_version) {
    const v = updateInfo.value.latest_version
    const mirrorUrl = `https://ghfile.geekertao.top/github.com/pmh1314520/WebRPA/releases/download/v${v}/WebRPA-${v}-FullVersion.7z`
    invoke('open_browser', { url: mirrorUrl })
    showToast('已打开加速下载，下载后解压覆盖原目录', 'info', 3500)
  }
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

// 简单的轮询工具
async function waitFor(predicate, maxIter, intervalMs, beforeCheck) {
  for (let i = 0; i < maxIter; i++) {
    await new Promise(r => setTimeout(r, intervalMs))
    if (beforeCheck) await beforeCheck()
    if (predicate()) return true
  }
  return false
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
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

const saveConfiguration = async () => {
  saving.value = true
  try {
    if (configForm.value.backend.port < 1024 || configForm.value.backend.port > 65535) {
      showToast('后端端口必须在 1024-65535', 'error')
      return
    }
    if (configForm.value.frontend.port < 1024 || configForm.value.frontend.port > 65535) {
      showToast('前端端口必须在 1024-65535', 'error')
      return
    }
    if (configForm.value.backend.port === configForm.value.frontend.port) {
      showToast('后端和前端端口不能相同', 'error')
      return
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

const cancelConfig = () => {
  loadConfig()
  showConfigModal.value = false
}

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

  // 启动器每次打开时弹一次赞助提示（无强制，可关闭）
  // 不依赖 localStorage 是否曾经出现过：每次都展示一遍以"祈求"用户支持
  setTimeout(() => {
    showSponsorModal.value = true
  }, 800)
})

onUnmounted(() => {
  stopStatusCheck()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>


<style scoped>
/* ============================================================
   WebRPA 启动器 v2 - 现代简约风格（参考前端编辑器主题）
   ============================================================ */
:root {
  --brand-50:   #eff6ff;
  --brand-100:  #dbeafe;
  --brand-300:  #93c5fd;
  --brand-500:  #3b82f6;
  --brand-600:  #2563eb;
  --brand-700:  #1d4ed8;
  --slate-50:   #f8fafc;
  --slate-100:  #f1f5f9;
  --slate-200:  #e2e8f0;
  --slate-300:  #cbd5e1;
  --slate-400:  #94a3b8;
  --slate-500:  #64748b;
  --slate-600:  #475569;
  --slate-700:  #334155;
  --slate-800:  #1e293b;
  --slate-900:  #0f172a;
  --success-50:  #ecfdf5;
  --success-500: #10b981;
  --success-600: #059669;
  --warn-500:    #f59e0b;
  --danger-50:   #fef2f2;
  --danger-500:  #ef4444;
  --danger-600:  #dc2626;
  --bg:          #f7f8fb;
  --card:        #ffffff;
  --border:      #e5e7eb;
}

* { box-sizing: border-box; }

.launcher {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--slate-800);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  letter-spacing: 0.01em;
  user-select: none;
  overflow: hidden;
}

/* ---------- 标题栏 ---------- */
.titlebar {
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 12px;
  background: linear-gradient(180deg, #ffffff, #fafbfd);
  border-bottom: 1px solid var(--border);
}
.titlebar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  -webkit-app-region: drag;
}
.titlebar-logo {
  width: 18px;
  height: 18px;
  border-radius: 4px;
}
.titlebar-name {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: -0.01em;
}
.brand-web {
  background: linear-gradient(135deg, var(--brand-700), var(--brand-500));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-style: italic;
}
.brand-rpa {
  display: inline-block;
  padding: 1px 5px;
  margin-left: 1px;
  background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
  color: white;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 800;
  font-style: italic;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.35);
}
.titlebar-sub {
  color: var(--slate-500);
  font-weight: 500;
  font-size: 12px;
  margin-left: 4px;
}
.titlebar-version {
  color: var(--slate-400);
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
  font-size: 10.5px;
  margin-left: 4px;
}
.titlebar-controls { display: flex; gap: 2px; }
.tb-btn {
  width: 26px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--slate-500);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 120ms;
}
.tb-btn:hover { background: var(--slate-100); color: var(--slate-700); }
.tb-btn-close:hover { background: var(--danger-500); color: white; }

/* ---------- 主体 ---------- */
.main {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ---------- 顶部状态栏 ---------- */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}
.topbar-left { display: flex; align-items: center; gap: 10px; }
.topbar-right { display: flex; align-items: center; gap: 6px; }

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--slate-100);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--slate-600);
}
.status-pill .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--slate-400);
}
.status-pill.partial {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #c2410c;
}
.status-pill.partial .status-dot {
  background: var(--warn-500);
  animation: pulse 1.6s ease-in-out infinite;
}
.status-pill.active {
  background: var(--success-50);
  border-color: #a7f3d0;
  color: var(--success-600);
}
.status-pill.active .status-dot {
  background: var(--success-500);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pulse-dot 1.8s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes pulse-dot {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.port-tags { display: flex; gap: 6px; }
.port-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 11px;
  color: var(--slate-500);
}
.port-tag.active {
  border-color: var(--success-500);
  color: var(--success-600);
  background: var(--success-50);
}
.port-tag .tag-label { font-weight: 600; }
.port-tag .tag-port { font-family: ui-monospace, Consolas, monospace; font-size: 10.5px; }


/* ---------- 按钮系列 ---------- */
.ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  color: var(--slate-600);
  cursor: pointer;
  transition: background-color 120ms, border-color 120ms, color 120ms;
}
.ghost-btn:hover:not(:disabled) {
  background: var(--slate-50);
  border-color: var(--slate-300);
  color: var(--slate-800);
}
.ghost-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ghost-btn svg { display: block; }

.text-btn {
  background: transparent;
  border: none;
  color: var(--brand-600);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 4px;
  transition: background-color 120ms;
}
.text-btn:hover { background: var(--brand-50); }

.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.2);
  transition: transform 120ms ease-[cubic-bezier(0.25,1,0.5,1)], box-shadow 120ms;
}
.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35), inset 0 1px 0 rgba(255,255,255,0.2);
}
.primary-btn:active:not(:disabled) { transform: translateY(0); }
.primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.primary-btn-sm {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.25);
  transition: transform 120ms, box-shadow 120ms;
}
.primary-btn-sm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.35);
}
.primary-btn-sm:disabled { opacity: 0.6; cursor: not-allowed; }

.success-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: linear-gradient(135deg, var(--success-500), var(--success-600));
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(16, 185, 129, 0.25);
  transition: transform 120ms, box-shadow 120ms;
}
.success-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.35);
}

.danger-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px 14px;
  background: var(--card);
  color: var(--danger-600);
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 120ms, border-color 120ms;
}
.danger-btn:hover:not(:disabled) {
  background: var(--danger-50);
  border-color: var(--danger-500);
}
.danger-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.sponsor-btn {
  background: linear-gradient(135deg, #ec4899, #db2777);
  box-shadow: 0 1px 2px rgba(219, 39, 119, 0.3);
}
.sponsor-btn:hover:not(:disabled) {
  box-shadow: 0 3px 8px rgba(219, 39, 119, 0.4);
}

.micro-btn {
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 500;
  background: var(--slate-100);
  color: var(--slate-600);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 120ms;
}
.micro-btn:hover { background: var(--slate-200); color: var(--slate-800); }

.spinning { animation: spin 1s linear infinite; }
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- 更新通知卡 ---------- */
.update-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #fff7ed, #fffbeb);
  border: 1px solid #fed7aa;
  border-radius: 8px;
}
.update-icon {
  width: 36px;
  height: 36px;
  background: white;
  color: #ea580c;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #fed7aa;
}
.update-text { flex: 1; min-width: 0; }
.update-title {
  font-size: 13px;
  font-weight: 700;
  color: #9a3412;
  margin-bottom: 2px;
}
.update-meta {
  font-size: 11.5px;
  color: #c2410c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.update-actions { display: flex; gap: 6px; flex-shrink: 0; }

/* ---------- 主控制卡 ---------- */
.main-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.hero-left { flex: 1; min-width: 0; }
.hero-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.hero-title-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--slate-800);
  letter-spacing: -0.01em;
}
.hero-title-tag {
  padding: 2px 7px;
  font-size: 10.5px;
  font-weight: 600;
  background: var(--brand-50);
  color: var(--brand-700);
  border: 1px solid var(--brand-100);
  border-radius: 3px;
}
.hero-desc {
  font-size: 12.5px;
  color: var(--slate-500);
  line-height: 1.5;
}
.hero-actions { display: flex; gap: 8px; flex-shrink: 0; }

/* ---------- 服务网格 ---------- */
.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.service-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--slate-50);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: background-color 120ms, border-color 120ms;
}
.service-item.active {
  background: linear-gradient(135deg, #ffffff, var(--success-50));
  border-color: #a7f3d0;
}
.svc-icon {
  width: 32px;
  height: 32px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--slate-500);
  flex-shrink: 0;
}
.service-item.active .svc-icon {
  color: var(--success-600);
  border-color: #a7f3d0;
}
.svc-info { flex: 1; min-width: 0; }
.svc-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--slate-800);
  margin-bottom: 2px;
}
.svc-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--slate-500);
}
.svc-state { font-weight: 600; }
.service-item.active .svc-state { color: var(--success-600); }
.svc-divider { color: var(--slate-300); }
.svc-port {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 10.5px;
}

/* ---------- 隐私提示卡 ---------- */
.info-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--brand-50);
  border: 1px solid var(--brand-100);
  border-radius: 6px;
  font-size: 12px;
  color: var(--brand-700);
}
.info-icon { color: var(--brand-600); flex-shrink: 0; }
.info-text { line-height: 1.5; }
.info-text strong { font-weight: 700; }

/* ---------- 底部 ---------- */
.footer {
  margin-top: auto;
  padding: 8px 4px 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--slate-400);
}
.copyright { font-weight: 500; }
.footer-divider { color: var(--slate-300); }
.footer-link {
  color: var(--slate-500);
  cursor: pointer;
  transition: color 120ms;
}
.footer-link:hover { color: var(--brand-600); }
.footer-heart {
  color: #ec4899;
  font-weight: 600;
}
.footer-heart:hover { color: #db2777; }


/* ---------- 弹窗 ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}
.modal-card {
  background: var(--card);
  border-radius: 10px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
  border: 1px solid var(--border);
}
.modal-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, #fcfcfd, #ffffff);
}
.modal-head-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}
.sponsor-head-icon {
  background: linear-gradient(135deg, #ec4899, #db2777);
  box-shadow: 0 2px 6px rgba(219, 39, 119, 0.3);
}
.config-head-icon {
  background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}
.modal-head-text { flex: 1; min-width: 0; }
.modal-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--slate-800);
  letter-spacing: -0.01em;
}
.modal-subtitle {
  font-size: 11.5px;
  color: var(--slate-500);
  margin-top: 1px;
}
.modal-close {
  width: 26px;
  height: 26px;
  background: transparent;
  border: none;
  color: var(--slate-500);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 120ms;
}
.modal-close:hover { background: var(--slate-100); color: var(--slate-800); }
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
}

/* 赞助弹窗 */
.sponsor-message {
  font-size: 13px;
  color: var(--slate-700);
  line-height: 1.7;
  margin-bottom: 16px;
}
.sponsor-message p { margin-bottom: 8px; }
.sponsor-message .highlight {
  padding: 9px 12px;
  background: linear-gradient(135deg, #fff1f2, #ffe4e6);
  border-left: 3px solid #ec4899;
  border-radius: 4px;
  color: #9f1239;
  font-weight: 500;
  margin: 12px 0;
}
.sponsor-message .thanks {
  font-size: 12px;
  color: var(--slate-500);
}
.emoji-fix {
  font-family: 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif;
  margin: 0 1px;
}

.qr-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}
.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.qr-frame {
  width: 100%;
  aspect-ratio: 1;
  background: var(--slate-50);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-frame img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
.qr-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--slate-700);
}
.qr-item:nth-child(1) .qr-label { color: #07c160; }
.qr-item:nth-child(2) .qr-label { color: #1677ff; }

.sponsor-note {
  margin-top: 10px;
  padding: 10px 12px;
  background: var(--slate-50);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 11.5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.note-row {
  display: flex;
  gap: 8px;
}
.note-label {
  flex-shrink: 0;
  width: 28px;
  font-weight: 600;
  color: var(--slate-700);
}
.note-value { color: var(--slate-500); }

/* 设置弹窗 */
.cfg-section {
  margin-bottom: 14px;
}
.cfg-section-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--slate-700);
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}
.cfg-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.cfg-label {
  flex-shrink: 0;
  width: 70px;
  font-size: 12px;
  color: var(--slate-600);
  font-weight: 500;
}
.cfg-input {
  flex: 1;
  height: 30px;
  padding: 0 10px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 5px;
  font-size: 12.5px;
  color: var(--slate-800);
  font-family: inherit;
  transition: border-color 120ms, box-shadow 120ms;
}
.cfg-input:hover { border-color: var(--slate-300); }
.cfg-input:focus {
  outline: none;
  border-color: var(--brand-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.cfg-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 8px 10px;
  background: var(--brand-50);
  border-radius: 5px;
  font-size: 11.5px;
  color: var(--brand-700);
}
.tip-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--brand-500);
}
.cfg-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

/* ---------- Toast ---------- */
.toast {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--slate-700);
  z-index: 200;
  pointer-events: none;
}
.toast-icon { display: flex; flex-shrink: 0; }
.toast-success {
  border-color: #a7f3d0;
  background: var(--success-50);
  color: var(--success-600);
}
.toast-error {
  border-color: #fecaca;
  background: var(--danger-50);
  color: var(--danger-600);
}
.toast-info {
  border-color: var(--brand-100);
  background: var(--brand-50);
  color: var(--brand-700);
}

/* ---------- 过渡动画 ---------- */
.fade-down-enter-active,
.fade-down-leave-active {
  transition: transform 220ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms;
}
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 220ms cubic-bezier(0.25, 1, 0.5, 1);
}
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.96);
}

.toast-enter-active,
.toast-leave-active {
  transition: transform 220ms cubic-bezier(0.25, 1, 0.5, 1), opacity 180ms;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

/* ---------- 滚动条 ---------- */
.main::-webkit-scrollbar,
.modal-body::-webkit-scrollbar { width: 6px; }
.main::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track { background: transparent; }
.main::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb {
  background: var(--slate-300);
  border-radius: 3px;
}
.main::-webkit-scrollbar-thumb:hover,
.modal-body::-webkit-scrollbar-thumb:hover { background: var(--slate-400); }
</style>
