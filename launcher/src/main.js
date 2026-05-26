import { createApp } from 'vue'

import App from './App.vue'
import './style.css'
import { TooltipDirective, installTitleInterceptor } from './directives/tooltip.js'

const app = createApp(App)
app.directive('tooltip', TooltipDirective)
app.mount('#app')

// 全局拦截所有 title 属性，统一替换为自定义 WebRPA 主题浮窗
installTitleInterceptor(app)
