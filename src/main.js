import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'

import moment from 'moment-business-days'

import Vuetify, {
  VApp, // required
  VMenu,
  VSpacer,
  VDatePicker,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VIcon,
  VBtn,
  VList,
  VListTile,
  VListTileContent,
  VListTileTitle,
  VListTileAction,
  VDialog,
  VContainer,
  VLayout,
  VFlex
} from 'vuetify/lib'

import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

Vue.use(Vuetify, {
  components: {
    VApp, // required
    VMenu,
    VDatePicker,
    VSpacer,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VIcon,
    VBtn,
    VList,
    VListTile,
    VListTileContent,
    VListTileTitle,
    VListTileAction,
    VDialog,
    VContainer,
    VLayout,
    VFlex
  },
})


Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.prototype.$moment = moment

new Vue({
  render: h => h(App),
}).$mount('#app')
