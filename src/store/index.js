// import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import { version } from '../../package.json'
Vue.use(Vuex)

/*
function storeObject(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    console.log('storing...');
}
*/
// const updateStorage = _.debounce(storeObject, 500)

const store = new Vuex.Store({
    state: {
        version: version,
        loads: [
            {
                id: 59,
                date: '2018-04-06T09:30:00.000Z',
                name: 'Nosler 95gr BT',
                weight: 0.006155,
                system: 'G7',
                bc: 0.190,
                tempSens: 0.94,
                speed: 932.6,
                range: 100.0,
                offset: -0.032,
                click: 0,
                temperature: -1,
                pressure: 1017,
                windspeed: 4.0,
                winddirection: 320 / 180 * Math.PI
            },
            {
                id: 58,
                date: '2017-07-27T09:00:00.000Z',
                name: 'Berger FB 88gr',
                weight: 0.0057,
                system: 'G1',
                bc: 0.380,
                tempSens: 0.94,
                speed: 987.6,
                range: 100,
                offset: 0.008,
                click: 0,
                temperature: 12.0,
                pressure: 999.0,
                windspeed: 4.0,
                winddirection: 220 / 180 * Math.PI
            },
            {
                id: 49,
                date: '2014-06-22T10:30.00.000Z',
                name: 'Lapua Scenar 90gr',
                weight: 0.0058,
                system: 'G7',
                bc: 0.216,
                tempSens: 0.94,
                speed: 938.8,
                range: 100.0,
                offset: 6.0e-3,
                click: -18,
                temperature: 10.0,
                pressure: 1020,
                windspeed: 0.0,
                winddirection: 0
            }
        ]
    }, /*
    mutations: {
        initializeFromLocalStorage(state) {
            let s = JSON.parse(localStorage.getItem('store'));
            if(s != null && s.version === state.version) {
                console.log('parsed json and now assigning...')
                this.replaceState(Object.assign(state, s));
            }
            else {
                console.log("didn't parse")
                state.version = version;
            }
        }
    }, */
    getters: {}
});

store.subscribe((mutation, state) => {
    console.log('store updated...');
    // updateStorage('store', state);
})

export default store;
