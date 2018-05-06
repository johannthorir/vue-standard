'use strict';

<template>
<div>
    <h1>{{ projectile.name }}</h1>
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
                <label class="field"><span class="label">Name</span><input type="text" v-model="projectile.name" size="20"></label>
                <number-input v-model.number="projectile.weight"   name="Bullet Weight"  :units="units.bulletWeight"         @input="refresh()"></number-input>
                <number-input v-model.number="projectile.bc"       name="G7 BC        "  :units="units.ballisticCoefficient" @input="refresh()"></number-input>
                <number-input v-model.number="projectile.tempSens" name="Temp. sens.  "  :units="units.tempSens"             @input="refresh()"></number-input>
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
                <number-input v-model.number="zeroInfo.speed"       name="Speed"       :units="units.fps"          @input="refresh()"></number-input>
                <number-input v-model.number="zeroInfo.range"       name="Range"       :units="units.range"        @input="refresh()"></number-input>
                <number-input v-model.number="zeroInfo.offset"      name="Offset"      :units="units.offset"       @input="refresh()"></number-input>
                <number-input v-model.number="zeroInfo.click"       name="Click"       :units="units.scopeClick"   @input="refresh()"></number-input>
                <number-input v-model.number="zeroInfo.temperature" name="Temperature" :units="units.temperature"  @input="refresh()"></number-input>
                <number-input v-model.number="zeroInfo.pressure"    name="Pressure"    :units="units.pressure"     @input="refresh()"></number-input>
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
            <Scope :zero-info="zeroInfo" :scope-info="scopeInfo" :solution="solution" @clickity="refresh()" ref="scope" v-if="scopeInfo.showScopeAdjust"></Scope>
        </div>
        <div class="s">
            <h3 v-on:click="solution.show = !solution.show" v-bind:class="{ active : solution.show }">{{ solution.title }}</h3>
            <Solution :solution="solution" v-if="solution.show"></Solution>
        </div>
        <div class="info">
            <div>Crosswind is {{ crossWindStrength.toFixed(1) }} m/s from {{ crossWindDirection < 0 ? "left to right" : "right to left "}}</div>
            <div><i>Current zero at {{solution.envelope.zeros.far.toFixed(1)}} m for click {{ scopeInfo.currentClick - zeroInfo.click }}</i></div>
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
    display: inline-block;
    margin: 0 10px;
}

a {    color: #42b983;}

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
import StandardModel from './standard-model-wc.js';
import Scope from './Scope.vue';
import Vue from 'vue';
import PointMassBallisticSolver from './bcd.js';


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

// units:
const Units = {
    Grain:               { unit: "gr",       step: 1,     precision: 0, a: 0,  b: 1                 },
    GrainAsGram:         { unit: "g",        step: 0.05,  precision: 2, a: 0,  b: 0.0647989         },
    NoneSmall:           { unit: "",         step: 0.001, precision: 3, a: 0,  b: 1                 },
    FPSprC:              { unit: "fps/°C",   step: 0.1,   precision: 1, a: 0,  b: 1                 },
    FPSprCasFPSprF:      { unit: "fps/°F",   step: 0.1,   precision: 1, a: 0,  b: 0.555555555555556 },
    FPSprCasMPSprC:      { unit: "m/s / °C", step: 0.01,  precision: 2, a: 0,  b: 0.3048            },
    FPSprCasMPSprF:      { unit: "m/s / °F", step: 0.01,  precision: 2, a: 0,  b: 0.169333333333333 },
    FPS:                 { unit: "fps",      step: 1,     precision: 0, a: 0,  b: 1                 },
    FPSasMPS:            { unit: "m/s",      step: 0.5,   precision: 1, a: 0,  b: 0.3048            },
    Meters:              { unit: "m",        step: 5,     precision: 0, a: 0,  b: 1                 },    
    MetersAsYards:       { unit: "yd",       step: 5,     precision: 0, a: 0,  b: 1.09361           },
    MetersAsFeet:        { unit: "ft",       step: 1,     precision: 0, a: 0,  b: 3.28084           },
    MPS:                 { unit: "m/s",      step: 0.1,   precision: 1, a: 0,  b: 1                 },
    MPSasKM:             { unit: "km/h",     step: 0.1,   precision: 1, a: 0,  b: 3.6               },
    MPSasMPH:            { unit: "Mph",      step: 0.1,   precision: 1, a: 0,  b: 2.23694           },
    MM:                  { unit: "mm",       step: 1,     precision: 0, a: 0,  b: 1                 },
    MMasCM:              { unit: "cm",       step: 0.5,   precision: 1, a: 0,  b: 0.1               },
    MMasIN:              { unit: "in",       step: 0.1,   precision: 1, a: 0,  b: 0.0393701         },
    NoneInteger:         { unit: "",         step: 1,     precision: 0, a: 0,  b: 1                 },
    Celsius:             { unit: "°C",       step: 0.1,   precision: 1, a: 0,  b: 1                 },
    CelsiusAsFahrenheit: { unit: "°F",       step: 0.1,   precision: 1, a: 32, b: 1.8               },                
    RADasDegrees:        { unit: "°",        step: 1,     precision: 0, a: 0,  b: 180.0/Math.PI     },
    RADasClock:          { unit: "o'clock",  step: 1,     precision: 0, a: 0,  b: 6/Math.PI         },
    RADAsMil:            { unit: "MIL",      step: 1,     precision: 0, a: 0,  b: 3200/Math.PI      },
    Degrees:             { unit: "°",        step: 1,     precision: 0, a: 0,  b: 1                 },
    DegreesAsClock:      { unit: "o'clock",  step: 1,     precision: 0, a: 0,  b: 12/360            },
    DegreesAsMil:        { unit: "MIL",      step: 1,     precision: 0, a: 0,  b: 6400/360          },
    MRAD:                { unit: "mrad",     step: 0.01,  precision: 2, a: 0,  b: 1                 },
    MRADasCM:            { unit: "cm/100m",  step: 0.10,  precision: 1, a: 0,  b: 10                },
    MRADasIN:            { unit: "in/100yd", step: 0.05,  precision: 2, a: 0,  b: 3.60000009259259  },
    MRADasMOA:           { unit: "MOA",      step: 0.01,  precision: 2, a: 0,  b: 3.43774677078494  },
    RADasMRAD:           { unit: "mrad",     step: 0.01,  precision: 2, a: 0,  b: 1000              },
    RADasCM:             { unit: "cm/100m",  step: 0.10,  precision: 1, a: 0,  b: 10000             },
    RADasIN:             { unit: "in/100yd", step: 0.05,  precision: 2, a: 0,  b: 3600.00009259259  },
    RADasMOA:            { unit: "MOA",      step: 0.01,  precision: 2, a: 0,  b: 3437.74677078494  },
    HPA:                 { unit: "hPa",      step:1,      precision: 0, a: 0,  b: 1                 },
    HPAasINHG:           { unit: "inHg",     step:0.1,    precision: 1, a: 0,  b: 0.029529983071445 }
};


import _ from 'lodash';

Vue.component('Scope', Scope);
Vue.component('number-input', NumberInput);
Vue.component('Solution', Solution);

/* eslint key-spacing: 'off' */
/* eslint no-multi-spaces : 'off' */
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
                        winddirection : d.wind.deg / 180 * Math.PI, // radians
                        temperature   : d.main.temp, // °C
                        pressure      : d.main.pressure,
                        shootdirection: this.environment.shootdirection
                    }

                    Vue.set(this, "environment", e);
                    this.refresh();
                });
        },
        refresh : function() {
            this.solve();
            if(this.$refs.scope)  this.$refs.scope.render();
        },

        bound : function(value, min, max) {
            return Math.max(min, Math.min(value, max));
        },
        solve : function() {
            var projectile_bc      = this.bound(this.projectile.bc, 0.1, 1.0);
            var projectile_mass    = this.bound(this.projectile.weight, 1, 1000) / 15432; // grain to kg.
            var reference          = this.bound(this.scopeInfo.height, 0.0,100) / 1000; // mm to metre.
            
            var zeroRange          = this.bound(this.zeroInfo.range, 50, 1000);
            var zeroSpeed          = this.bound(this.zeroInfo.speed, 500, 5000) / 3.28084; // fps to metre 
            var zeroPressure       = this.bound(this.zeroInfo.pressure,       910.0, 1100.0);
            var zeroTemperature    = this.bound(this.zeroInfo.temperature,     -30.0, 50.0);
            var zeroOffset         = this.zeroInfo.offset / 1000; // mm to metre
            
            var envTemperature    = this.bound(this.environment.temperature,  -30.0, 50.0);            
            var envPressure       = this.bound(this.environment.pressure,       910.0, 1100.0);            
            var envSpeed          = zeroSpeed + (envTemperature - zeroTemperature)*this.projectile.tempSens;
            var envWindspeed      = this.bound(this.environment.windspeed,     0.0,  40.0);
            var envWinddirection  = (this.environment.winddirection - this.environment.shootdirection);
            var zeroEnvironment    = new bcd.EnvironmentalFactors(zeroTemperature, zeroPressure, 0.5, 0.0, 0.0);
            var currentEnvironment = new bcd.EnvironmentalFactors(envTemperature, envPressure, 0.5, envWindspeed, envWinddirection);

            let angle =  bcd.getZeroingAngle(zeroRange, zeroOffset, zeroSpeed, projectile_mass, projectile_bc, reference, zeroEnvironment);
            let scopeClick = this.scopeInfo.verClick; // rad 
            let clicks = angle / scopeClick;
            // console.log('-----------------------------------------------------------------')
            // console.log(`Zero angle is ${(angleMrad).toFixed(2)} mrad or ${clicks.toFixed(1)} clicks`);
            angle += (this.scopeInfo.currentClick - this.zeroInfo.click) * scopeClick;
                
            let range = this.solution.path[this.solution.path.length - 1].x;
            let trajectory = bcd.getTrajectory(range + 0.1, angle , envSpeed, projectile_mass, projectile_bc, reference, currentEnvironment);
            let envelope = bcd.getEnvelope(trajectory);
            let rangeIndex = 0;
            let newPath = [];
            for (let i = 1; i < trajectory.length && rangeIndex < this.solution.path.length; i++) {
                let point = trajectory[i];
                if (point.x >  this.solution.path[rangeIndex].x) {
                    var r    = this.solution.path[rangeIndex].x; // meters.
                    var type = this.solution.path[rangeIndex].u;
                    var oneClick = Math.tan(this.scopeInfo.verClick) * r ;
                    // our path is in metric, so convert from imperial in the standard-model.
                    newPath[rangeIndex] = {
                        x : r,
                        y : point.y, // mm 
                        c : point.y / oneClick,
                        z : point.w,
                        v : point.v * 3.28084,  // leave in fps
                        e : this.projectile.weight * Math.pow(point.v * 3.28084, 2) / 450380.0, // foot lbs 
                        t : point.t,
                        u : type
                    }
                    let lastPoint = trajectory[i - 1];
                    let x =  this.solution.path[rangeIndex++].x;
                    let res = bcd.linearInterpolate(x, lastPoint, point);
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
        this.solve();
    },
    data : function () {
        return {
            /*
            unitIndices : {
                projectile:  { weight: 0,  bc: 0, tempSens: 0 },
                scopeInfo:   { currentClick: 0, height: 0, verClick: 0, horClick: 0 },
                zeroInfo:    { speed: 0, range: 0, offset: 0, click: 0, temperature: 0, pressure:0 },
                environment: { windspeed: 0, winddirection: 0,temperature: 0,pressure: 0,shootdirection: 0 }
            }, */
            units : {
                bulletWeight :  [ Units.Grain, Units.GrainAsGram ],
                ballisticCoefficient: [ Units.NoneSmall ],
                tempSens: [ Units.FPSprC, Units.FPSprCasFPSprF, Units.FPSprCasMPSprC, Units.FPSprCasMPSprF ],
                fps:  [ Units.FPS, Units.FPSasMPS ],
                range: [ Units.Meters, Units.MetersAsYards, Units.MetersAsFeet ],
                speed: [ Units.MPS, Units.MPSasKM, Units.MPSasMPH ],
                offset: [ Units.MM, Units.MMasCM, Units.MMasIN ],
                scopeClick: [ Units.NoneInteger ],
                temperature: [ Units.Celsius, Units.CelsiusAsFahrenheit ],
                //direction: [ Units.Degrees, Units.DegreesAsClock, Units.DegreesAsMil ],
                direction: [ Units.RADasDegrees, Units.RADasClock, Units.RADasMil ],
                clickSize: [Units.RADasMRAD, Units.RADasCM, Units.RADasIN, Units.RADasMOA ],
                pressure: [ Units.HPA, Units.HPAasINHG ],
            },                                                                                                                                                                                                                                                             
            msg: 'Bleh',
            sm: new StandardModel(1000, 'G7'),
            showScopeAdjust : true,
            projectile : {
                title         : 'Projectile',
                show          : false,
                name          : 'Nosler BT 95',
                weight        : 95,   // grain.
                // bc            : 0.379,    // G1 ballistic coefficient.
                bc : 0.190, // G7 ballistics coefficent
                tempSens      : 3.1,  // fps pr degree Celsius.
                adjustedSpeed : 3000,
                adjustedBC    : 0.379
            },
            zeroInfo  : {
                title       : 'Zeroing conditions',
                show        : false,
                speed       : 3060, // fps at the muzzle
                range       : 100,  // m horizontal
                offset      :  -32,   // mm impact offset from point of aim - negative is below, positive is above.
                click       :  0,   // click setting of scope when zeroing
                temperature : -1, // °c
                pressure    : 1017, // hPa
                zeroAngle   : 0

            },

            scopeInfo : {
                title    : 'Scope setup',
                show     : false,
                height   : 44, // mm height above boreline.
                verClick : 0.00007, // rad
                horClick : 0.00007, // rad
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
                    { x: 860, y: -4.000, c: -137.3, z: 1.000, v: 1000, t: 1.200, e: 0, u: 'o' }
                ]
            }
        }
    }
}
</script>
