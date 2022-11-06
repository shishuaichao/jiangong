import { createApp } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
// import './mock'


const app = createApp(App)

app.use(router)
  .use(store)
  .use(ViewUIPlus)
  .mount('#zhuanliluru')


let tokenName = 'Admin-Token-V2'
function getToken() {
  let arr = document.cookie.split('; ')
  return arr.find(e => {
    return e.split('=')[0] === tokenName && e.split('=')[1]
  })
}

let pop = document.getElementById('zhuanliluru')
pop.style.display = 'none'
let timer = setInterval(() => {
  if (getToken()) {
    pop.style.display = 'block'
    // clearInterval(timer)    // 登录后是否需要清除定时器
  } else {
    pop.style.display = 'none'
  }
}, 1000)