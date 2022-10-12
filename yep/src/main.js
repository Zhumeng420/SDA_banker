import vue, {createApp, VueElement} from 'vue'
import App from './App.vue'
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import axios from "axios";

import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import {Star} from '@element-plus/icons-vue'

import Vue from "vue";

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(MdEditor)
app.use(Star)
VueElement.prototype.axios=axios;

app.mount('#app')






