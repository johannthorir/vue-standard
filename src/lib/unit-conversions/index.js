'use strict';

/* eslint-disable */ 

// units:
const Units = {
    KGasGrain:           { unit: "gr",       step: 1,     precision: 0, a: 0,  b: 15432.4           },
    KGasGram:            { unit: "g",        step: 0.05,  precision: 2, a: 0,  b: 1000              },
    NoneSmall:           { unit: "",         step: 0.001, precision: 3, a: 0,  b: 1                 },

    MPSprC:              { unit: "m/s / °C", step: 0.01,  precision: 2, a: 0,  b: 1                 },
    MPSprCasFPSprF:      { unit: "fps / °F", step: 0.1,   precision: 1, a: 0,  b: 1.82268888888889  }, 
    MPSprCasFPSprC:      { unit: "fps/°C",   step: 0.1,   precision: 1, a: 0,  b: 3.28084           },
    MPSprCasMPSprF:      { unit: "m/s / °F", step: 0.01,  precision: 2, a: 0,  b:0.555555555555556  },
    MPSasFPS:            { unit: "fps",      step: 1,     precision: 0, a: 0,  b: 3.28084           },
 
    FPSasMPS:            { unit: "m/s",      step: 0.5,   precision: 1, a: 0,  b: 0.3048            },
    
    Meters:              { unit: "m",        step: 5,     precision: 0, a: 0,  b: 1                 },    
    MetersAsYards:       { unit: "yd",       step: 5,     precision: 0, a: 0,  b: 1.09361           },
    MetersAsFeet:        { unit: "ft",       step: 1,     precision: 0, a: 0,  b: 3.28084           },
    
    MPS:                 { unit: "m/s",      step: 0.1,   precision: 1, a: 0,  b: 1                 },
    MPSasKM:             { unit: "km/h",     step: 0.1,   precision: 1, a: 0,  b: 3.6               },
    MPSasMPH:            { unit: "Mph",      step: 0.1,   precision: 1, a: 0,  b: 2.23694           },
    
    MetersAsMM:          { unit: "mm",       step: 1,     precision: 0, a: 0,  b: 1000              },
    MetersAsCM:          { unit: "cm",       step: 0.5,   precision: 1, a: 0,  b: 100               },
    MetersAsIN:          { unit: "in",       step: 0.1,   precision: 1, a: 0,  b: 39.3701           },
    
    NoneInteger:         { unit: "",         step: 1,     precision: 0, a: 0,  b: 1                 },
    
    Celsius:             { unit: "°C",       step: 0.1,   precision: 1, a: 0,  b: 1                 },
    CelsiusAsFahrenheit: { unit: "°F",       step: 0.1,   precision: 1, a: 32, b: 1.8               },                
    
    RADasDegrees:        { unit: "°",        step: 1,     precision: 0, a: 0,  b: 180.0/Math.PI     },
    RADasClock:          { unit: "o'clock",  step: 1,     precision: 0, a: 0,  b: 6/Math.PI         },
    RADasMil:            { unit: "MIL",      step: 1,     precision: 0, a: 0,  b: 3200/Math.PI      },
    
    Degrees:             { unit: "°",        step: 1,     precision: 0, a: 0,  b: 1                 },
    DegreesAsClock:      { unit: "o'clock",  step: 1,     precision: 0, a: 0,  b: 12/360            },
    DegreesAsMil:        { unit: "MIL",      step: 1,     precision: 0, a: 0,  b: 6400/360          },
    
    MRAD:                { unit: "mrad",     step: 0.01,  precision: 2, a: 0,  b: 1                 },
    MRADasCM:            { unit: "cm/100m",  step: 0.10,  precision: 2, a: 0,  b: 10                },
    MRADasIN:            { unit: "in/100yd", step: 0.05,  precision: 3, a: 0,  b: 3.60000009259259  },
    MRADasMOA:           { unit: "MOA",      step: 0.01,  precision: 3, a: 0,  b: 3.43774677078494  },
    
    RADasMRAD:           { unit: "mrad",     step: 0.001,  precision: 3, a: 0,  b: 1000              },
    RADasCM:             { unit: "cm/100m",  step: 0.01,  precision: 2, a: 0,  b: 10000             },
    RADasIN:             { unit: "in/100yd", step: 0.005,  precision: 3, a: 0,  b: 3600.00009259259  },
    RADasMOA:            { unit: "MOA",      step: 0.01,  precision: 2, a: 0,  b: 3437.74677078494  },
    
    HPA:                 { unit: "hPa",      step:1,      precision: 0, a: 0,  b: 1                 },
    HPAasINHG:           { unit: "inHg",     step:0.1,    precision: 1, a: 0,  b: 0.029529983071445 }
};


export default Units;
