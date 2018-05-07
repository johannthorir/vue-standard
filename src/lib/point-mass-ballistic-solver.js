/* eslint-disable */ 
/*
    Note that this library uses metric units, mostly SI with some exceptions.

    all lengthss are in metres
    all angles are in radians
    pressure is in hPa instead of Pa.
    velocities are in metres pr. second.

    vertical lengths are positive up, negative down.
    bullet weights are in grains... 
*/
export default function () {
    // Some physical and converion constants.
    const POUNDS_PER_KG = 2.20462;
    const INCHES_PER_METRE = 39.3701;
    const GRAVITY = 9.81; // Gravitaiional accl, m/sec2
    const GRAINS_PER_KG = 15432;
    const STEP = 0.075; // m approximately - i.e. next time is how long it takes to fly this long with the current lateral velocity.
    //! G7 table, each element is
    //! [ x, y, slope to next point.]
    var CD_G7 = [
        [0, 0.1198, -0.002], [0.05, 0.1197, -0.002], [0.1, 0.1196, -0.004], [0.15, 0.1194, -0.002],
        [0.2, 0.1193, 0.002], [0.25, 0.1194, 0], [0.3, 0.1194, 0], [0.35, 0.1194, -0.002],
        [0.4, 0.1193, 0], [0.45, 0.1193, 0.002], [0.5, 0.1194, -0.002], [0.55, 0.1193, 0.002],
        [0.6, 0.1194, 0.006], [0.65, 0.1197, 0.01], [0.7, 0.1202, 0.02], [0.725, 0.1207, 0.032],
        [0.75, 0.1215, 0.044], [0.775, 0.1226, 0.064], [0.8, 0.1242, 0.096], [0.825, 0.1266, 0.16],
        [0.85, 0.1306, 0.248], [0.875, 0.1368, 0.384], [0.9, 0.1464, 0.784], [0.925, 0.166, 1.576],
        [0.95, 0.2054, 3.756], [0.975, 0.2993, 3.24], [1, 0.3803, 0.848], [1.025, 0.4015, 0.112],
        [1.05, 0.4043, -0.036], [1.075, 0.4034, -0.08], [1.1, 0.4014, -0.108], [1.125, 0.3987, -0.128],
        [1.15, 0.3955, -0.142], [1.2, 0.3884, -0.148], [1.25, 0.381, -0.156], [1.3, 0.3732, -0.15],
        [1.35, 0.3657, -0.154], [1.4, 0.358, -0.14], [1.5, 0.344, -0.128], [1.55, 0.3376, -0.122],
        [1.6, 0.3315, -0.11], [1.65, 0.326, -0.102], [1.7, 0.3209, -0.098], [1.75, 0.316, -0.086],
        [1.8, 0.3117, -0.078], [1.85, 0.3078, -0.072], [1.9, 0.3042, -0.064], [1.95, 0.301, -0.06],
        [2, 0.298, -0.058], [2.05, 0.2951, -0.058], [2.1, 0.2922, -0.06], [2.15, 0.2892, -0.056],
        [2.2, 0.2864, -0.058], [2.25, 0.2835, -0.056], [2.3, 0.2807, -0.056], [2.35, 0.2779, -0.054],
        [2.4, 0.2752, -0.054], [2.45, 0.2725, -0.056], [2.5, 0.2697, -0.054], [2.55, 0.267, -0.054],
        [2.6, 0.2643, -0.056], [2.65, 0.2615, -0.054], [2.7, 0.2588, -0.054], [2.75, 0.2561, -0.056],
        [2.8, 0.2533, -0.054], [2.85, 0.2506, -0.054], [2.9, 0.2479, -0.056], [2.95, 0.2451, -0.054],
        [3, 0.2424, -0.056], [3.1, 0.2368, -0.055], [3.2, 0.2313, -0.055], [3.3, 0.2258, -0.053],
        [3.4, 0.2205, -0.051], [3.5, 0.2154, -0.048], [3.6, 0.2106, -0.046], [3.7, 0.206, -0.043],
        [3.8, 0.2017, -0.042], [3.9, 0.1975, -0.04], [4, 0.1935, -0.037], [4.2, 0.1861, -0.034],
        [4.4, 0.1793, -0.0315], [4.6, 0.173, -0.029], [4.8, 0.1672, -0.027], [5, 0.1618, -0.026]
    ];
    //! Ballistic table G1. Coefficient of drag for a reference bullet of 1-inch diameter and 1-pound weight at various speeds, expressed
    //! as mach numbers. See  http://www.jbmballistics.com/ballistics/downloads/text/mcg1.txt
    //! x, y, slope to next point.
    var CD_G1 = [
        [0, 0.2629, -0.142], [0.05, 0.2558, -0.142], [0.1, 0.2487, -0.148], [0.15, 0.2413, -0.138],
        [0.2, 0.2344, -0.132], [0.25, 0.2278, -0.128], [0.3, 0.2214, -0.118], [0.35, 0.2155, -0.102],
        [0.4, 0.2104, -0.086], [0.45, 0.2061, -0.058], [0.5, 0.2032, -0.024], [0.55, 0.202, 0.028],
        [0.6, 0.2034, 0.131], [0.7, 0.2165, 0.26], [0.725, 0.223, 0.332], [0.75, 0.2313, 0.416],
        [0.775, 0.2417, 0.516], [0.8, 0.2546, 0.64], [0.825, 0.2706, 0.78], [0.85, 0.2901, 0.94],
        [0.875, 0.3136, 1.116], [0.9, 0.3415, 1.276], [0.925, 0.3734, 1.4], [0.95, 0.4084, 1.456],
        [0.975, 0.4448, 1.428], [1, 0.4805, 1.324], [1.025, 0.5136, 1.164], [1.05, 0.5427, 1],
        [1.075, 0.5677, 0.824], [1.1, 0.5883, 0.68], [1.125, 0.6053, 0.552], [1.15, 0.6191, 0.404],
        [1.2, 0.6393, 0.25], [1.25, 0.6518, 0.142], [1.3, 0.6589, 0.064], [1.35, 0.6621, 0.008],
        [1.4, 0.6625, -0.036], [1.45, 0.6607, -0.068], [1.5, 0.6573, -0.09], [1.55, 0.6528, -0.108],
        [1.6, 0.6474, -0.122], [1.65, 0.6413, -0.132], [1.7, 0.6347, -0.134], [1.75, 0.628, -0.14],
        [1.8, 0.621, -0.138], [1.85, 0.6141, -0.138], [1.9, 0.6072, -0.138], [1.95, 0.6003, -0.138],
        [2, 0.5934, -0.134], [2.05, 0.5867, -0.126], [2.1, 0.5804, -0.122], [2.15, 0.5743, -0.116],
        [2.2, 0.5685, -0.11], [2.25, 0.563, -0.106], [2.3, 0.5577, -0.1], [2.35, 0.5527, -0.092],
        [2.4, 0.5481, -0.086], [2.45, 0.5438, -0.082], [2.5, 0.5397, -0.072], [2.6, 0.5325, -0.061],
        [2.7, 0.5264, -0.053], [2.8, 0.5211, -0.043], [2.9, 0.5168, -0.035], [3, 0.5133, -0.028],
        [3.1, 0.5105, -0.021], [3.2, 0.5084, -0.017], [3.3, 0.5067, -0.013], [3.4, 0.5054, -0.014],
        [3.5, 0.504, -0.01], [3.6, 0.503, -0.008], [3.7, 0.5022, -0.006], [3.8, 0.5016, -0.006],
        [3.9, 0.501, -0.004], [4, 0.5006, -0.004], [4.2, 0.4998, -0.0015], [4.4, 0.4995, -0.0015],
        [4.6, 0.4992, -0.001], [4.8, 0.499, -0.001], [5, 0.4988, -0.001]
    ];

    //! Environmental factors.
    //!   @param temperature - the ambient temperature in Celsius.
    //!   @param pressure    - local barometric pressure in hPa.
    //!   @param humidity    - relative humidity [0..1]
    //!   @param windSpeed   - wind speed in m/s
    //!   @param windAngle   - wind angle from north in radians.
    //! Calculates the air density in kg / m³ and the speed of sound in m/s.
    //! These are available as members rho and mach1 respectively.
    //! The wind is broken down into headWind and crossWind.
    class EnvironmentalFactors {
        constructor(temperature, pressure, humidity, windSpeed, windAngle) {
            this.temperature = temperature;
            this.pressure = pressure;
            this.humidity = humidity;
            this.windSpeed = windSpeed;
            this.windAngle = windAngle;
            this.headWind = Math.cos(windAngle) * windSpeed;
            this.crossWind = Math.sin(windAngle) * windSpeed;
            const Kelvin = 273.15;
            let T = temperature;
            let TKel = Kelvin + T;
            let p = pressure * 100; // in Pascals
            const Md = 0.028964; // molar mass of dry air, kg/mol
            const Mv = 0.018016; // molar mass of water vapor kg/mol
            const R = 8.314; // universal gas constant J/(K Mol)
            // const Rv = 461.495;  // specific gas constant for water vapor J/(kg * K)
            // const Rd = 287.058;  // specific gas constant for dry air J(kg*K)
            let psat = 6107.8 * Math.exp(7.27 * T / TKel);
            let pv = humidity * psat;
            let pd = (p - pv);
            this.rho = (pd * Md + pv * Mv) / (R * TKel);
            let ENH = 3.141593e-8 * p + 1.00062 + T * T * 5.6e-7;
            let PSV1 = TKel * (TKel * 0.000012378847 - 0.019121316);
            let PSV2 = 33.93711047 - 6343.1645 / TKel;
            let PSV = Math.exp(PSV1) * Math.exp(PSV2);
            let Xw = humidity * ENH * PSV / p;
            let Xc = 400 * Math.pow(10, -6);
            let C1 = 331.5024 + (0.603055 - 0.000528 * T) * T + (51.471935 + (0.1495874 - 0.000782 * T) * T) * Xw;
            let C2 = (-1.82e-7 + (3.73e-8 - 2.93e-10 * T) * T) * p + (-85.20931 + (-0.228525 + 0.0000591 * T) * T) * Xc;
            let C3 = Xw * Xw * 2.835149 + p * p * 2.15e-13 - Xc * Xc * 29.179762 - 0.000486 * Xw * p * Xc;
            this.mach1 = C1 + C2 - C3;
        }
    }

    //! positive is in our backs.
    function headWind(speed, angle) {
        return (Math.cos(angle) * speed);
    }

    //! positive is from right to left.
    function crossWind(speed, angle) {
        return (Math.sin(angle) * speed);
    }

    //! Calculate the zero crossing given that sign(y0) != sign(y1).
    //! Linear interpolation for y = 0 on the line segment from (x0,y0) to (x1,y1)
    function getZeroCrossingLinear(x0, y0, x1, y1) {
        return x0 - y0 * (x1 - x0) / (y1 - y0);
    }

    //! Drag coefficient function
    //!   @param mach - the mach number
    //! @returns the drag coefficient in the current system corresponding to the given mach number.
    function getCD(mach) {
        let CDTable = CD_G7;
        let iBelow = 0;
        let iAbove = CDTable.length - 1;
        // console.log("Looking for " + mach + " initial range : " + i_below + " to " + i_above);
        while (iBelow < iAbove - 1) {
            let candidate = Math.trunc((iBelow + iAbove) / 2);
            if (CDTable[candidate][0] < mach) {
                iBelow = candidate;
            }
            else {
                iAbove = candidate;
            }
        }
        return CDTable[iBelow][1] + CDTable[iBelow][2] * (mach - CDTable[iBelow][0]);
    }
    
    //! Calculate the ballistic trajectory of a projectile.
    //!   @param range       - maximum range to calculate (in metres)
    //!   @param angle       - the launch angle relative to horizontal, positive up (in radians).
    //!   @param velocity    - initial velocity in metres / second.
    //!   @param mass        - mass of the projectile in kilogrammes.
    //!   @param bc          - the ballistic coefficient of the projectile in the selected system.
    //!   @param reference   - the height of the horizontal reference.
    //!   @param environment - the environmental factors to consider.
    //! The trajectory will be computed with variable time delta which will give trajectory
    //! points spaced approximately every STEP metres.
    //! @returns an array of point objects representing the trajectory containing x-value y-value,
    //! velocity, time and windage.
    function getTrajectory(range, angle, velocity, mass, bc, reference, environment) {
        let points = [];
        let v_x = velocity * Math.cos(angle);
        let v_y = velocity * Math.sin(angle);
        // s_x and s_y are the coordinates of the projectile_.
        // Positive is UP
        let s_x = 0;
        let s_y = -reference;
        let t = 0; // Time elapsed, in seconds
        let A = (Math.PI / 4) / (INCHES_PER_METRE * INCHES_PER_METRE) * mass * POUNDS_PER_KG / bc;
        while (s_x < range) {
            let dt = STEP / v_x;
            let v = Math.sqrt(v_x * v_x + v_y * v_y);
            let mach = v / environment.mach1;
            // Get the coefficient of drag from the table for this axial velocity.
            let F = 0.5 * environment.rho * v * v * getCD(mach) * A;
            // horizontal and vertical drag
            let F_x = F * v_x / v;
            let F_y = F * v_y / v;
            // accelleration is the result of the action of a force on mass
            let a_x = -F_x / mass;
            let a_y = -F_y / mass - GRAVITY; // gravity goes down
            let dv_x = a_x * dt;
            let dv_y = a_y * dt;
            points.push({
                x: s_x,
                y: s_y,
                v: v,
                t: t,
                e: 0.5 * mass * v * v,
                w: environment.crossWind * (t - s_x / velocity)
            });
            s_x += (v_x + dv_x / 2) * dt;
            s_y += (v_y + dv_y / 2) * dt;
            v_x += dv_x;
            v_y += dv_y;
            t += dt;
        }
        return points;
    }

    //! Find the near and far intersections of the trajectory with a horizontal reference with an offset.
    function getCrossings(trajectory, offset) {
        let crossings = { near: 0, far: 0 };
        for (let i = 0; i < trajectory.length - 2; i++) {
            if (trajectory[i].y >= offset && trajectory[i + 1].y < offset) {
                crossings.far = getZeroCrossingLinear(trajectory[i].x, trajectory[i].y - offset, trajectory[i + 1].x, trajectory[i + 1].y - offset);
                return crossings; // can't go back up.
            }
            if (trajectory[i].y <= offset && trajectory[i + 1].y > offset) {
                crossings.near = getZeroCrossingLinear(trajectory[i].x, trajectory[i].y - offset, trajectory[i + 1].x, trajectory[i + 1].y - offset);
            }
        }
        return crossings;
    }

    //! interpolate linearly from first to second returning the solution at the given range.
    function linearInterpolate(x, first, second) {
        let diff = (x - first.x) / (second.x - first.x);
        return {
            x: x,
            v: diff * (second.v - first.v) + first.v,
            y: diff * (second.y - first.y) + first.y,
            t: diff * (second.t - first.t) + first.t,
            e: diff * (second.e - first.e) + first.e,
            w: diff * (second.w - first.w) + first.w
        };
    }

    //! Calculate the angle to use to hit the offset at the given range.
    //! The angle is calculated with the riflemans rule from the ballistic trajectory with initial zero angle.
    //!   @param range       - the zero range in metres.
    //!   @param offset      - the desired vertical offset of the intersection of the trajectory at the zero range.
    //!   @param velocity    - initial projectile velocity in metres/second.
    //!   @param mass        - mass of the projectile in kg.
    //!   @param bc          - the ballistic coefficient in the active system.
    //!   @param reference   - the height of the horizontal reference.
    //!   @param environment - the environmental factors to consider.
    //! @returns the angle in radians.
    function getZeroingAngle(range, offset, velocity, mass, bc, reference, environment) {
        let path = getTrajectory(range, 0, velocity, mass, bc, reference, environment);
        return Math.atan2(-path[path.length - 1].y + offset, path[path.length - 1].x);
    }

    //! todo - add vertical angle (shooting angle).
    function getEnvelope(trajectory) {
        let maxIndex = 0;
        for (let i = 0; i < trajectory.length - 2 && maxIndex === 0; i++)
            if (trajectory[i + 1].y < trajectory[i].y)
                maxIndex = i;
        let maxPoint = trajectory[maxIndex];
        return {
            maxPoint: maxPoint,
            pbr: getCrossings(trajectory, -maxPoint.y),
            zeros: getCrossings(trajectory, 0)
        };
    }

    // finds a quadratic passing through the points and solves for zero first derivative.
    function findZeroDerivative(p0, p1, p2) {
        let A = ((p0.y - p2.y) * (p1.x - p2.x) - (p1.y - p2.y) * (p0.x - p2.x)) / ((p0.x * p0.x - p2.x * p2.x) * (p1.x - p2.x) - (p1.x * p1.x - p2.x * p2.x) * (p0.x - p2.x));
        let B = ((p1.y - p2.y) - A * (p1.x * p1.x - p2.x * p2.x)) / (p1.x - p2.x);
        let C = p0.y - B * p0.x - A * p0.x * p0.x;
        let x = -B / (2 * A);
        let y = A * x * x + B * x + C;
        return { x: x, y: y };
    }
    
    this.EnvironmentalFactors = EnvironmentalFactors;
    this.getZeroingAngle = getZeroingAngle;
    this.getTrajectory = getTrajectory;
    this.getEnvelope = getEnvelope;
    this.linearInterpolate = linearInterpolate;
    this.crossWind = crossWind;
    this.headWind  = headWind;
}
