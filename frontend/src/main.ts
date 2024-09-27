import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import  VueTheMask  from 'vue-the-mask';

const app = createApp(App)

app.use(createPinia())
app.use(VueTheMask as any);
app.mount('#app')
