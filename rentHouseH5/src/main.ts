import { createApp } from 'vue'
import App from './App.vue'
import pinia from '@/store'
import router from '@/router'
import 'normalize.css'
import 'vant/lib/index.css'
import './styles/index.less'
import './styles/tailwind.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
