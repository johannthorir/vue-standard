<template>
    <div class="field"><span class="label" @click="toggleUnits">{{ name }}</span><input
            class="number"
            type="text"
            v-model="displayValue"
            @blur="isActive = false;"
            @focus="isActive = true"
            @keydown.up="inc"
            @keydown.down="dec"/> <span class="unit" @click="toggleUnits"> {{ unitString }} </span></div>
</template> 
   
<style scoped>
      .field { 
            font-size : 12pt;
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
         } 
        .label { 
            display : inline-block; 
            width : 170px; 
            height : 20px;
        }
        .number { 
            width : 5em; 
            text-align : right; 
            padding-right : 3px; 
            border : none; 
            font-size : 140%; 
            border-bottom : 1px solid rgba(0,0,0,0.2);
        }
</style>   

<script>
import _ from 'lodash';

export default {
    name: "number-input",
    props: {
        name: String, 
        value: Number, 
        step:Number, 
        precision:Number,
        unit:String,
        units : {
            type: Array,
            default : function() {
                return [ 
                    {
                        unit: "°C",
                        step: 0.1,
                        precision: 1,
                        a: 0,
                        b: 1
                    },
                    {
                        unit: "°F",
                        step: 0.1,
                        precision: 1,
                        a: 32,
                        b: 1.8,
                    }
                ];
            }
        } 
    },
   
    data : function() {
        return { 
            isActive : false,
            unitIndex : 0,
            displayed : 0,
        };

    },
    methods : {
        inc : function(){
            let step = this.toBase(this.units[this.unitIndex].step);
            this.$emit('input', this.value + step);				
        },
        dec : function() {
            let step = this.toBase(this.units[this.unitIndex].step);
            this.$emit('input', this.value - step);				
        },
        // from display to base
        toBase(value) { 
            // original value = ( u - a) / b
            return ( value - this.units[this.unitIndex].a) / this.units[this.unitIndex].b;
        },
        // from base to display
        toDisplay(value) {
            return this.units[this.unitIndex].a + value * this.units[this.unitIndex].b;
        },
        changed : _.debounce(function() { 
            // we must emit the value in the base unit - which is the first unit in the units array.
            this.$emit('input', parseFloat(this.value.toFixed(this.units[0].precision))); 
        }, 100, { leading : true, maxWait : 500 }),
        toggleUnits: function() {            
            console.log("toggling units")
            this.unitIndex = (this.unitIndex + 1) % this.units.length;
        }
    },
    computed: {
        unitString: {
            get() {
                return this.units[this.unitIndex].unit;
            }
        },
        displayValue: {
            get: function() {
                // console.log("getting")
                // u = a + original value * b
                return parseFloat(this.toDisplay(this.value).toFixed(this.units[this.unitIndex].precision));
            },
            set: function(modifiedValue) {
                // console.log(modifiedValue)
                var newValue = this.toBase(parseFloat(modifiedValue));
                if(isNaN(newValue))
                    newValue = 0;       
                this.$emit('input', newValue);
                
            }
        }
    }
}
</script>
