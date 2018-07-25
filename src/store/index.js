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
                id: 48,
                date: '2014-06-13T12:00:00.000Z',
                name: 'Sierra 70gr HBPT MK',
                weight: 0.00454,
                system: 'G1',
                bc: 0.260,
                tempSens: 0.94,
                speed: 1045.1,
                range: 200.0,
                offset: 0,
                click: 20,
                temperature: 14.0,
                pressure: 1024,
                windspeed: 0.0,
                winddirection: 0
            },
            {
                id: 60,
                date: '2018-04-06T09:30:00.000Z',
                name: 'Nosler 95gr BT',
                weight: 0.006155,
                system: 'G1',
                bc: 0.379,
                tempSens: 0.32,
                speed: 940.3,
                range: 100.0,
                offset: 0.035,
                click: 0,
                temperature: 11,
                pressure: 998,
                windspeed: 4.0,
                winddirection: 320 / 180 * Math.PI
            },
            {
                id: 59,
                date: '2018-04-06T09:30:00.000Z',
                name: 'Nosler 95gr BT (magnetospeed)',
                weight: 0.006155,
                system: 'G1',
                bc: 0.379,
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
                offset: -106.0e-3,
                click: 0,
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
