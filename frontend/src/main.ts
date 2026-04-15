import { createApp } from 'vue'
import AppSTOP from './AppSTOP.vue'
import router from './router'

const app = createApp(AppSTOP)
app.use(router)
app.mount('#app')