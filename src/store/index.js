import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        click: 0
    },
    mutations: {
        clickUp(state) {
            state.click++;
        },
        clickDown(state) {
            state.click--;
        }
    }
})
