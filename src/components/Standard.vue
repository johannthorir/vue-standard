'use strict';

<template>
<div>
    <modal v-if="projectile.showLoadDialog" @close="projectile.showLoadDialog = false">
        <div slot="header">Select load</div>
        <div slot="body">
            <ul class="load-list">
                <li 
                    v-for="(ld, index) in this.$store.state.loads"
                    @click="selectLoad(index)"
                >(#{{ld.id}}) - {{ ld.name }}</li>
            </ul>
        </div>
        <div slot="footer"><a @click="projectile.showLoadDialog = false">Cancel</a></div>
    </modal>
    <h1>{{ load.name }}</h1>
    <div class="s" style="padding:0px 10px;"><p><a @click="projectile.showLoadDialog = true">Click to select from known loads </a></p></div>
    <div class="hello">        
        <ul>
            <li><a href="https://vuejs.org"                         target="_blank"> Core Docs               </a></li>
            <li><a href="https://forum.vuejs.org"                   target="_blank"> Forum                   </a></li>
            <li><a href="https://chat.vuejs.org"                    target="_blank"> Community Chat          </a></li>
            <li><a href="https://twitter.com/vuejs"                 target="_blank"> Twitter                 </a></li>
            <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank"> Docs for This Template  </a></li>
        </ul>

        <ul>
            <li><a href="http://router.vuejs.org/"             target="_blank"> vue-router    </a></li>
            <li><a href="http://vuex.vuejs.org/"               target="_blank"> vuex          </a></li>
            <li><a href="http://vue-loader.vuejs.org/"         target="_blank"> vue-loader    </a></li>
            <li><a href="https://github.com/vuejs/awesome-vue" target="_blank"> awesome-vue   </a></li>
        </ul>
    </div>
    <div style="display:block;  min-width : 24em; vertical-align : bottom">
        <div class="s">
            <h3 v-on:click="projectile.show = !projectile.show" v-bind:class="{ active : projectile.show }">{{projectile.title}}</h3>
            <div class="inputs" v-show="projectile.show">
                <label class="field"><span class="label">Name</span><input type="text" v-model="load.name" size="20"></label>
                <number-input v-model.number="load.weight"   name="Bullet Weight"  :units="units.bulletWeight"         @input="refresh()"></number-input>
                <number-input v-model.number="load.bc"       :name="load.system + ' BC'"  :units="units.ballisticCoefficient" @input="refresh()"></number-input>
                <number-input v-model.number="load.tempSens" name="Temp. sens.  "  :units="units.tempSens"             @input="refresh()"></number-input>
                
            </div>
        </div>
        <div class="s">
            <h3 v-on:click="scopeInfo.show = !scopeInfo.show" v-bind:class="{ active : scopeInfo.show }">{{scopeInfo.title}}</h3>
            <div class="inputs" v-show="scopeInfo.show">
                <number-input v-model.number="scopeInfo.currentClick"  name="Current Click"  :units="units.scopeClick" @input="refresh()"></number-input>
                <number-input v-model.number="scopeInfo.height      "  name="Scope Height "  :units="units.offset"     @input="refresh()"></number-input>
                <number-input v-model.number="scopeInfo.verClick    "  name="Vert. click  "  :units="units.clickSize"  @input="refresh()"></number-input>
                <number-input v-model.number="scopeInfo.horClick    "  name="Hor. click   "  :units="units.clickSize"  @input="refresh()"></number-input>
            </div>
        </div>
        <div class="s">
            <h3 v-on:click="zeroInfo.show = !zeroInfo.show" v-bind:class="{ active : zeroInfo.show }">{{zeroInfo.title}}</h3>
            <div class="inputs" v-show="zeroInfo.show">
                <number-input v-model.number="load.speed"       name="Speed"       :units="units.velocity"     @input="refresh()"></number-input>
                <number-input v-model.number="load.range"       name="Range"       :units="units.range"        @input="refresh()"></number-input>
                <number-input v-model.number="load.offset"      name="Offset"      :units="units.offset"       @input="refresh()"></number-input>
                <number-input v-model.number="load.click"       name="Click"       :units="units.scopeClick"   @input="refresh()"></number-input>
                <number-input v-model.number="load.temperature" name="Temperature" :units="units.temperature"  @input="refresh()"></number-input>
                <number-input v-model.number="load.pressure"    name="Pressure"    :units="units.pressure"     @input="refresh()"></number-input>
            </div>
        </div>
        <div class="s">
            <h3 v-on:click="environment.show = !environment.show" v-bind:class="{ active : environment.show }">{{environment.title}}</h3>
            <div class="inputs" v-show="environment.show">
                <number-input v-model.number="environment.windspeed     " name="Wind speed        "  :units="units.speed"        @input="refresh()"></number-input>
                <number-input v-model.number="environment.winddirection " name="Wind direction    "  :units="units.direction"    @input="refresh()"></number-input>
                <number-input v-model.number="environment.temperature   " name="Local temperature "  :units="units.temperature"  @input="refresh()"></number-input>
                <number-input v-model.number="environment.pressure      " name="Local pressure    "  :units="units.pressure"     @input="refresh()"></number-input>
                <number-input v-model.number="environment.shootdirection" name="Shooting direction"  :units="units.direction"    @input="refresh()"></number-input>
                <label class="field center"><button id="weatherbutton" v-on:click="fetchWeather">Get actual weather</button> </label>
            </div>
        </div>
        <div class="s">
            <h3 v-on:click="scopeInfo.showScopeAdjust = !scopeInfo.showScopeAdjust" v-bind:class="{ active : scopeInfo.showScopeAdjust }">Scope</h3>
            <Scope :load="load" :scope-info="scopeInfo" :solution="solution" @clickity="refresh()" ref="scope" v-if="scopeInfo.showScopeAdjust"></Scope>
        </div>
        <div class="s">
            <h3 v-on:click="solution.show = !solution.show" v-bind:class="{ active : solution.show }">{{ solution.title }}</h3>
            <Solution :solution="solution" v-if="solution.show"></Solution>
        </div>
        <div class="info">
            <div>Crosswind is {{ crossWindStrength.toFixed(1) }} m/s from {{ crossWindDirection < 0 ? "left to right" : "right to left "}}</div>
            <div><i>Current zero at {{solution.envelope.zeros.far.toFixed(1)}} m for click {{ scopeInfo.currentClick - load.click }}</i></div>
            <div>Pbr: {{ solution.envelope.pbr.near.toFixed(1) }} m - {{solution.envelope.pbr.far.toFixed(1) }} m
            <span v-if="solution.envelope.maxPoint.y > 0"> &mdash; Zone: {{ ((solution.envelope.maxPoint.y * 2)*1000).toFixed(0)}} mm.</span></div>
        </div>

    </div>
</div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.hello { display : none }
h1 {
    margin: 15px; 
    font-weight: bold;
    color : #457; 
}

ul {
    list-style-type: none;
    padding: 0;
}


li {
    display: block;
    line-height : 26px;
    border-bottom : 1px solid #eee;
    margin: 0 10px;
    padding: 10px;
}

ul.load-list li {
    cursor: pointer;  
}

a {    color: #457; cursor:pointer; }

h3 { 
    font-size : 15pt; 
    cursor : pointer; 
    color : white;
    font-style : italic;
    background-color : #457; 
    padding : 2px 2px 2px 10px; 
    margin: 0px 0px 1px 0px; 
    min-width : 384px;
    max-width : 781px;
    min-height : 40px;
    line-height : 35px;
    vertical-align:top;
    
}
h3:before {
    content : url("../assets/rightarrow.svg"); /*  "\2630\00FE0E " */;
}

h3.active:before {
    content : url("../assets/downarrow.svg"); /* "\2610\00fe0e ";*/
    font-style:normal;
}

label.field { 
    display : inline-block; 
    min-width : 379px; 
    max-width : 379px;
    width : 379px; 
    padding : 15px;
    margin : 0px; 
    margin-bottom : 1px;
    margin-right : 1px;
    min-height : 30px; 
    border : none; 
    background : #eee;
    font-size : 12pt;
}

.center {
    text-align : center;
}
span.label { 
    display : inline-block; 
    width : 70px; 
    height : 19px;
}
#weatherbutton {
    width : 214px;
    text-align : center;
    font-size : 120%;
    
}
.inputs:before {
    content: "";
    display: inline-block;
    vertical-align:top;
    height: 100%;
}
input {
    width : 214px; 
    text-align : left; 
    padding : 0px;
    padding-left : 3px; 
    border : none; 
    font-size : 140%; 
    border-bottom : 1px solid rgba(0,0,0,0.2);
    
}

.inputs {
    margin : 0ex; 
    padding : 0px; 
    font-size : 0px;
    vertical-align : top;
}

div.s {
    display : inline-block;
    vertical-align : top;
    min-width : 409px; 
    max-width : 409px;
    
    margin-right : 1px;
}
div.info {
    margin : 10px;
    text-align : center;
}
</style>

<script>

import Solution from './Solution.vue';
import NumberInput from './NumberInput.vue';
import Scope from './Scope.vue';
import Modal from './Modal.vue';
import Vue from 'vue';

Vue.component('Scope', Scope);
Vue.component('number-input', NumberInput);
Vue.component('Solution', Solution);
Vue.component('Modal', Modal);

import PointMassBallisticSolver from 'point-mass-ballistic-solver';
import Units from '../lib/unit-conversions';
import _ from 'lodash';

var bcd = new PointMassBallisticSolver();

/*
var state = {
  source : null,
  initial : { x : 0, y : 0 },
};

Vue.directive('rotator', { 
    bind: function(el, binding, vnode) {
      function emit(name, data) {
        var handlers = (vnode.data && vnode.data.on) ||
            (vnode.componentOptions && vnode.componentOptions.listeners);

        console.log(handlers);
        if (handlers && handlers[name]) return handlers[name].fn(data);
        else return none;
      }
      
      el.addEventListener('mousedown', function(e) {
          var r = el.getBoundingClientRect();
          state.initial.x = e.clientX - r.x;
          state.initial.y = e.clientY - r.y;
          state.source = el;
          emit('rotate-start');  
      });

      document.documentElement.addEventListener('mouseup', function(e) {
        if (state.source !== el) return;
        state.source = null;
        emit('rotate-done',el);
      });

      document.documentElement.addEventListener('mousemove', function(e) {
        if (state.source !== el) return;
        var r = el.getBoundingClientRect();
          
        var current = { 
          x : e.clientX - r.x,
          y : e.clientY - r.y
        };
        emit('rotating', el, current)
      });
    }
});

*/

/* eslint key-spacing: 'off' */
/* eslint no-multi-spaces : 'off' */

/* Mock weather service */
const localWeather = "https://vpn.kiesel.is/weather/keflavik.json"

export default {
    name: 'standard',
    methods : {
        fetchWeather: function() {
            Vue.axios.get(localWeather)
                .then(response => { 
                    // console.log(response.data);
                    let d = response.data;
                    let e = {
                        title : "KEF Environment at " + new Date(d.dt * 1000).toLocaleTimeString("IS-is"),
                        show : true,
                        windspeed     : d.wind.speed, // ms.
                        winddirection : d.wind.deg / 180 * Math.PI, // to radians
                        temperature   : d.main.temp, // °C
                        pressure      : d.main.pressure,
                        shootdirection: this.environment.shootdirection
                    }

                    Vue.set(this, "environment", e);
                    this.refresh();
                });
        },
        
        selectLoad: function(index) {
            Vue.set(this, 'load', this.$store.state.loads[index]);
            this.projectile.showLoadDialog = false;
            this.refresh();
        },
        
        refresh : function() {
            this.solve();
            if(this.$refs.scope)  this.$refs.scope.render();
        },

        persist: function() {
            this.$store.dispatch('persist');
        },

        bound : function(value, min, max) {
            return Math.max(min, Math.min(value, max));
        },
        
        solve : function() {
            var system             = this.load.system;
            var bc                 = this.bound(this.load.bc, 0.1, 1.0);
            var mass               = this.bound(this.load.weight, 0.001, 1); // kg.
            var reference          = this.bound(this.scopeInfo.height, 0.0,0.2); 
            
            var zeroRange          = this.bound(this.load.range, 50, 1000);
            var zeroSpeed          = this.bound(this.load.speed, 500, 5000); 
            var zeroPressure       = this.bound(this.load.pressure,       910.0, 1100.0);
            var zeroTemperature    = this.bound(this.load.temperature,     -30.0, 50.0);
            var zeroOffset         = this.load.offset; // mm to metre
            
            var envTemperature     = this.bound(this.environment.temperature,  -30.0, 50.0);            
            var envPressure        = this.bound(this.environment.pressure,       910.0, 1100.0);            
            var envSpeed           = zeroSpeed + (envTemperature - zeroTemperature)*this.load.tempSens;
            var envWindspeed       = this.bound(this.environment.windspeed,     0.0,  40.0);
            var envWinddirection   = (this.environment.winddirection - this.environment.shootdirection);
            var zeroEnv            = new bcd.EnvironmentalFactors(zeroTemperature, zeroPressure, 0.5, 0.0, 0.0);
            var currentEnv         = new bcd.EnvironmentalFactors(envTemperature, envPressure, 0.5, envWindspeed, envWinddirection);

            let angle      =  bcd.getZeroingAngle(zeroRange, zeroOffset, zeroSpeed, mass, bc, system, reference, zeroEnv);
            // let clicks     = angle / scopeClick;
            let scopeAngle = (this.scopeInfo.currentClick - this.load.click) * this.scopeInfo.verClick;                
            let range      = this.solution.path[this.solution.path.length - 1].x;
            let trajectory = bcd.getTrajectory(range + 0.1, angle + scopeAngle, envSpeed, mass, bc, system, reference, currentEnv);
            let envelope   = bcd.getEnvelope(trajectory);
            
            let rangeIndex = 0;
            let newPath = [];
            let tclick = Math.tan(this.scopeInfo.verClick);
            for (let i = 1; i < trajectory.length && rangeIndex < this.solution.path.length; i++) {
                let point = trajectory[i];
                if (point.x >  this.solution.path[rangeIndex].x) {
                    let x  = this.solution.path[rangeIndex].x; 
                    let res = bcd.linearInterpolate(x, trajectory[i - 1], point);
                    newPath[rangeIndex] = {
                        x : x,       // m
                        y : res.y, // m 
                        c : res.y / (tclick * x), // clicks
                        z : res.w, // m
                        v : res.v, 
                        e : res.e, // J this.projectile.weight * Math.pow(point.v * 3.28084, 2) / 450380.0, // foot lbs 
                        t : res.t, // s
                        u : this.solution.path[rangeIndex].u
                    };
                    rangeIndex++;
                }
            }
            Vue.set(this.solution, 'envelope', envelope);
            Vue.set(this.solution, 'path',     newPath);
        },
    }, 
    computed : {
        crossWindStrength: function() {
            return Math.abs(bcd.crossWind(this.environment.windspeed, (this.environment.winddirection - this.environment.shootdirection)))
        },
        crossWindDirection: function() {
            return Math.sign(bcd.crossWind(this.environment.windspeed, (this.environment.winddirection - this.environment.shootdirection)))
        }

    },
 
    created : function() {  
        Vue.set(this, 'load', this.$store.state.loads[0]);
        this.solve();

        console.log(bcd.pressureCorrection(10.0, 500.0, 1013.25))

    },

    data : function () {
        return {
            units : {
                bulletWeight :  [ Units.KGasGrain, Units.KGasGram ],
                ballisticCoefficient: [ Units.NoneSmall ],
                tempSens: [ Units.MPSprC, Units.MPSprCasFPSprF, Units.MPSprCasFPSprC, Units.MPSprCasMPSprF ], 
                velocity:  [ Units.MPSasFPS, Units.MPS ],
                range: [ Units.Meters, Units.MetersAsYards, Units.MetersAsFeet ],
                speed: [ Units.MPS, Units.MPSasKM, Units.MPSasMPH ],
                offset: [ Units.MetersAsMM, Units.MetersAsCM, Units.MetersAsIN ],
                scopeClick: [ Units.NoneInteger ],
                temperature: [ Units.Celsius, Units.CelsiusAsFahrenheit ],
                direction: [ Units.RADasDegrees, Units.RADasClock, Units.RADasMil ],
                clickSize: [Units.RADasMRAD, Units.RADasCM, Units.RADasIN, Units.RADasMOA ],
                pressure: [ Units.HPA, Units.HPAasINHG ],
            },                                                                                                                                                                                                                                                                                 
            showScopeAdjust : true,
            load: {
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
                winddirection : 320/180*Math.PI,
            },
            projectile : {
                title         : 'Projectile',
                show          : false,
                showLoadDialog: false,
                adjustedSpeed : 3000
            },
            zeroInfo  : {
                title       : 'Zeroing conditions',
                show        : false,
            },

            scopeInfo : {
                title    : 'Scope setup',
                show     : false,
                height   : 44.0e-3, // mm height above boreline.
                verClick : 6.7e-5, // rad
                horClick : 6.7e-5, // rad
                clicksPrTurn : 35,
                currentClick : 0, // current click on the scope.
                accumulated : 0.0, // accumulated clicks
                center : { x : 181, y : 179 }, // pixel center of the canvas.
                showScopeAdjust : true
            },

            environment : {
                title : 'Environmentals',
                show : false,
                windspeed     : 3.0, // ms.
                winddirection : 63/180*Math.PI, // radians
                temperature   : -1, // °C
                pressure      : 1017,
                shootdirection : 180/180*Math.PI // radians
            },
            // ballistic solution to the zero information.
            solution : {
                title: 'Solution',
                show: true,                
                envelope: {
                    maxPoint: { x:0.0, y:0.0, w:0.0, t:0.0 },
                    pbr: { near:0.0, far:0.0 },
                    zeros : {near:0.0, far:0.0 }
                },
                path: [
                    { x:  25, y: -0.032, c:   -5.7, z: 0.015, v: 2762, t: 0.113, e: 0, u: 'z' },
                    { x:  50, y: -0.077, c:   -7.3, z: 0.034, v: 2628, t: 0.174, e: 0, u: 'o' },
                    { x:  75, y: -0.160, c:   -9.2, z: 0.061, v: 2501, t: 0.238, e: 0, u: 'z' },
                    { x: 100, y: -0.032, c:   -4.6, z: 0.015, v: 2762, t: 0.113, e: 0, u: 'X' },
                    { x: 125, y: -0.032, c:   -5.7, z: 0.015, v: 2762, t: 0.113, e: 0, u: 'z' },
                    { x: 150, y: -0.077, c:   -7.3, z: 0.034, v: 2628, t: 0.174, e: 0, u: 'o' },
                    { x: 175, y: -0.160, c:   -9.2, z: 0.061, v: 2501, t: 0.238, e: 0, u: 'z' },
                    { x: 200, y: -0.160, c:  -11.4, z: 0.061, v: 2501, t: 0.238, e: 0, u: 'X' },
                    { x: 225, y: -0.160, c:  -13.7, z: 0.061, v: 2501, t: 0.238, e: 0, u: 'z' },
                    { x: 250, y: -0.285, c:  -16.3, z: 0.098, v: 2380, t: 0.305, e: 0, u: 'o' },
                    { x: 275, y: -0.457, c:  -19.0, z: 0.143, v: 2264, t: 0.376, e: 0, u: 'z' },
                    { x: 300, y: -0.457, c:  -21.8, z: 0.143, v: 2264, t: 0.376, e: 0, u: 'X' },
                    { x: 325, y: -0.680, c:  -24.8, z: 0.199, v: 2154, t: 0.450, e: 0, u: 'z' },
                    { x: 350, y: -0.680, c:  -28.0, z: 0.199, v: 2154, t: 0.450, e: 0, u: 'o' },
                    { x: 375, y: -0.961, c:  -31.3, z: 0.265, v: 2049, t: 0.528, e: 0, u: 'z' },
                    { x: 400, y: -0.961, c:  -34.7, z: 0.265, v: 2049, t: 0.528, e: 0, u: 'X' },
                    { x: 425, y: -1.305, c:  -38.3, z: 0.342, v: 1949, t: 0.610, e: 0, u: 'z' },
                    { x: 450, y: -1.305, c:  -42.1, z: 0.342, v: 1949, t: 0.610, e: 0, u: 'o' },
                    { x: 475, y: -1.719, c:  -46.1, z: 0.431, v: 1853, t: 0.697, e: 0, u: 'z' },
                    { x: 500, y: -1.719, c:  -50.2, z: 0.431, v: 1853, t: 0.697, e: 0, u: 'X' },
                   
                ]
            }
        }
    }
}
</script>
