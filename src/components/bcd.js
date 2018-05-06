/* eslint key-spacing: 'off' */
/* eslint no-multi-spaces : 'off' */

/*

    Note that this library uses metric units, mostly SI with some exceptions.

    all lengthss are in metres
    all angles are in radians
    pressure is in hPa instead of Pa.
    velocities are in metres pr. second.

    vertical lengths are positive up, negative down.

*/

function PointMassBallisticSolver() {
    // Some physical and converion constants.
    const POUNDS_PER_KG    = 2.20462;
    const INCHES_PER_METRE = 39.3701;
    const GRAVITY          = 9.81; // Gravitaiional accl, m/sec2
    const GRAINS_PER_KG    = 15432;
    const STEP             = 0.075; // m approximately - i.e. next time is how long it takes to fly this long with the current lateral velocity.

    //! G7 table, each element is
    //! [ x, y, slope to next point.]
    var CD_G7 = [
        [ 0.000, 0.1198, -2.000E-03 ], [ 0.050, 0.1197, -2.000E-03 ], [ 0.100, 0.1196, -4.000E-03 ], [ 0.150, 0.1194, -2.000E-03 ],
        [ 0.200, 0.1193,  2.000E-03 ], [ 0.250, 0.1194,  0.000E+00 ], [ 0.300, 0.1194,  0.000E+00 ], [ 0.350, 0.1194, -2.000E-03 ],
        [ 0.400, 0.1193,  0.000E+00 ], [ 0.450, 0.1193,  2.000E-03 ], [ 0.500, 0.1194, -2.000E-03 ], [ 0.550, 0.1193,  2.000E-03 ],
        [ 0.600, 0.1194,  6.000E-03 ], [ 0.650, 0.1197,  1.000E-02 ], [ 0.700, 0.1202,  2.000E-02 ], [ 0.725, 0.1207,  3.200E-02 ],
        [ 0.750, 0.1215,  4.400E-02 ], [ 0.775, 0.1226,  6.400E-02 ], [ 0.800, 0.1242,  9.600E-02 ], [ 0.825, 0.1266,  1.600E-01 ],
        [ 0.850, 0.1306,  2.480E-01 ], [ 0.875, 0.1368,  3.840E-01 ], [ 0.900, 0.1464,  7.840E-01 ], [ 0.925, 0.1660,  1.576E+00 ],
        [ 0.950, 0.2054,  3.756E+00 ], [ 0.975, 0.2993,  3.240E+00 ], [ 1.000, 0.3803,  8.480E-01 ], [ 1.025, 0.4015,  1.120E-01 ],
        [ 1.050, 0.4043, -3.600E-02 ], [ 1.075, 0.4034, -8.000E-02 ], [ 1.100, 0.4014, -1.080E-01 ], [ 1.125, 0.3987, -1.280E-01 ],
        [ 1.150, 0.3955, -1.420E-01 ], [ 1.200, 0.3884, -1.480E-01 ], [ 1.250, 0.3810, -1.560E-01 ], [ 1.300, 0.3732, -1.500E-01 ],
        [ 1.350, 0.3657, -1.540E-01 ], [ 1.400, 0.3580, -1.400E-01 ], [ 1.500, 0.3440, -1.280E-01 ], [ 1.550, 0.3376, -1.220E-01 ],
        [ 1.600, 0.3315, -1.100E-01 ], [ 1.650, 0.3260, -1.020E-01 ], [ 1.700, 0.3209, -9.800E-02 ], [ 1.750, 0.3160, -8.600E-02 ],
        [ 1.800, 0.3117, -7.800E-02 ], [ 1.850, 0.3078, -7.200E-02 ], [ 1.900, 0.3042, -6.400E-02 ], [ 1.950, 0.3010, -6.000E-02 ],
        [ 2.000, 0.2980, -5.800E-02 ], [ 2.050, 0.2951, -5.800E-02 ], [ 2.100, 0.2922, -6.000E-02 ], [ 2.150, 0.2892, -5.600E-02 ],
        [ 2.200, 0.2864, -5.800E-02 ], [ 2.250, 0.2835, -5.600E-02 ], [ 2.300, 0.2807, -5.600E-02 ], [ 2.350, 0.2779, -5.400E-02 ],
        [ 2.400, 0.2752, -5.400E-02 ], [ 2.450, 0.2725, -5.600E-02 ], [ 2.500, 0.2697, -5.400E-02 ], [ 2.550, 0.2670, -5.400E-02 ],
        [ 2.600, 0.2643, -5.600E-02 ], [ 2.650, 0.2615, -5.400E-02 ], [ 2.700, 0.2588, -5.400E-02 ], [ 2.750, 0.2561, -5.600E-02 ],
        [ 2.800, 0.2533, -5.400E-02 ], [ 2.850, 0.2506, -5.400E-02 ], [ 2.900, 0.2479, -5.600E-02 ], [ 2.950, 0.2451, -5.400E-02 ],
        [ 3.000, 0.2424, -5.600E-02 ], [ 3.100, 0.2368, -5.500E-02 ], [ 3.200, 0.2313, -5.500E-02 ], [ 3.300, 0.2258, -5.300E-02 ],
        [ 3.400, 0.2205, -5.100E-02 ], [ 3.500, 0.2154, -4.800E-02 ], [ 3.600, 0.2106, -4.600E-02 ], [ 3.700, 0.2060, -4.300E-02 ],
        [ 3.800, 0.2017, -4.200E-02 ], [ 3.900, 0.1975, -4.000E-02 ], [ 4.000, 0.1935, -3.700E-02 ], [ 4.200, 0.1861, -3.400E-02 ],
        [ 4.400, 0.1793, -3.150E-02 ], [ 4.600, 0.1730, -2.900E-02 ], [ 4.800, 0.1672, -2.700E-02 ], [ 5.000, 0.1618, -2.600E-02 ]
    ];

    //! Ballistic table G1. Coefficient of drag for a reference bullet of 1-inch diameter and 1-pound weight at various speeds, expressed
    //! as mach numbers. See  http://www.jbmballistics.com/ballistics/downloads/text/mcg1.txt
    //! x, y, slope to next point.
    var CD_G1 = [
        [ 0.000, 0.2629, -1.420E-01 ], [ 0.050, 0.2558, -1.420E-01 ], [ 0.100, 0.2487, -1.480E-01 ], [ 0.150, 0.2413, -1.380E-01 ],
        [ 0.200, 0.2344, -1.320E-01 ], [ 0.250, 0.2278, -1.280E-01 ], [ 0.300, 0.2214, -1.180E-01 ], [ 0.350, 0.2155, -1.020E-01 ],
        [ 0.400, 0.2104, -8.600E-02 ], [ 0.450, 0.2061, -5.800E-02 ], [ 0.500, 0.2032, -2.400E-02 ], [ 0.550, 0.2020,  2.800E-02 ],
        [ 0.600, 0.2034,  1.310E-01 ], [ 0.700, 0.2165,  2.600E-01 ], [ 0.725, 0.2230,  3.320E-01 ], [ 0.750, 0.2313,  4.160E-01 ],
        [ 0.775, 0.2417,  5.160E-01 ], [ 0.800, 0.2546,  6.400E-01 ], [ 0.825, 0.2706,  7.800E-01 ], [ 0.850, 0.2901,  9.400E-01 ],
        [ 0.875, 0.3136,  1.116E+00 ], [ 0.900, 0.3415,  1.276E+00 ], [ 0.925, 0.3734,  1.400E+00 ], [ 0.950, 0.4084,  1.456E+00 ],
        [ 0.975, 0.4448,  1.428E+00 ], [ 1.000, 0.4805,  1.324E+00 ], [ 1.025, 0.5136,  1.164E+00 ], [ 1.050, 0.5427,  1.000E+00 ],
        [ 1.075, 0.5677,  8.240E-01 ], [ 1.100, 0.5883,  6.800E-01 ], [ 1.125, 0.6053,  5.520E-01 ], [ 1.150, 0.6191,  4.040E-01 ],
        [ 1.200, 0.6393,  2.500E-01 ], [ 1.250, 0.6518,  1.420E-01 ], [ 1.300, 0.6589,  6.400E-02 ], [ 1.350, 0.6621,  8.000E-03 ],
        [ 1.400, 0.6625, -3.600E-02 ], [ 1.450, 0.6607, -6.800E-02 ], [ 1.500, 0.6573, -9.000E-02 ], [ 1.550, 0.6528, -1.080E-01 ],
        [ 1.600, 0.6474, -1.220E-01 ], [ 1.650, 0.6413, -1.320E-01 ], [ 1.700, 0.6347, -1.340E-01 ], [ 1.750, 0.6280, -1.400E-01 ],
        [ 1.800, 0.6210, -1.380E-01 ], [ 1.850, 0.6141, -1.380E-01 ], [ 1.900, 0.6072, -1.380E-01 ], [ 1.950, 0.6003, -1.380E-01 ],
        [ 2.000, 0.5934, -1.340E-01 ], [ 2.050, 0.5867, -1.260E-01 ], [ 2.100, 0.5804, -1.220E-01 ], [ 2.150, 0.5743, -1.160E-01 ],
        [ 2.200, 0.5685, -1.100E-01 ], [ 2.250, 0.5630, -1.060E-01 ], [ 2.300, 0.5577, -1.000E-01 ], [ 2.350, 0.5527, -9.200E-02 ],
        [ 2.400, 0.5481, -8.600E-02 ], [ 2.450, 0.5438, -8.200E-02 ], [ 2.500, 0.5397, -7.200E-02 ], [ 2.600, 0.5325, -6.100E-02 ],
        [ 2.700, 0.5264, -5.300E-02 ], [ 2.800, 0.5211, -4.300E-02 ], [ 2.900, 0.5168, -3.500E-02 ], [ 3.000, 0.5133, -2.800E-02 ],
        [ 3.100, 0.5105, -2.100E-02 ], [ 3.200, 0.5084, -1.700E-02 ], [ 3.300, 0.5067, -1.300E-02 ], [ 3.400, 0.5054, -1.400E-02 ],
        [ 3.500, 0.5040, -1.000E-02 ], [ 3.600, 0.5030, -8.000E-03 ], [ 3.700, 0.5022, -6.000E-03 ], [ 3.800, 0.5016, -6.000E-03 ],
        [ 3.900, 0.5010, -4.000E-03 ], [ 4.000, 0.5006, -4.000E-03 ], [ 4.200, 0.4998, -1.500E-03 ], [ 4.400, 0.4995, -1.500E-03 ],
        [ 4.600, 0.4992, -1.000E-03 ], [ 4.800, 0.4990, -1.000E-03 ], [ 5.000, 0.4988, -1.000E-03 ]
    ];

    //! Environmental factors.
    //!   @param temperature - the ambient temperature in Celsius.
    //!   @param pressure    - local barometric pressure in hPa.
    //!   @param humidity    - relative humidity [0..1]
    //! Also calculates the air density in kg / m³ and the speed of sound in m/s.
    //! These are available as members rho and mach1 respectively.
    function EnvironmentalFactors(temperature, pressure, humidity, windSpeed, windAngle) {
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
        let psat = 6107.8 * Math.exp(7.27 * T / TKel)

        let pv = humidity * psat;
        let pd = (p - pv);

        this.rho = (pd * Md + pv * Mv) / (R * TKel);

        let ENH = 3.141593e-8 * p + 1.00062 + T * T * 5.6e-7;

        let PSV1 = TKel * ( TKel * 1.2378847e-5 - 1.9121316e-2);
        let PSV2 = 33.93711047 - 6.3431645e3 / TKel;
        let PSV = Math.exp(PSV1) * Math.exp(PSV2);
        let Xw = humidity * ENH * PSV / p;
        let Xc = 400.0 * Math.pow(10, -6);

        let C1 = 331.5024 + (0.603055 - 5.28e-4 * T) * T + (51.471935 + (0.1495874 - 7.82e-4 * T) * T) * Xw;
        let C2 = (-1.82e-7 + (3.73e-8 - 2.93e-10 * T) * T) * p + (-85.20931 + (-0.228525 + 5.91e-5 * T) * T) * Xc;
        let C3 = Xw * Xw * 2.835149 + p * p * 2.15e-13 - Xc * Xc * 29.179762 - 4.86e-4 * Xw * p * Xc;

        this.mach1 = C1 + C2 - C3;
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
    //!  @param mach - the mach number
    //! @returns the drag coefficient in the current system corresponding to the given mach number.
    function getCD(mach) {
        let CDTable = CD_G7;
        let iBelow = 0;
        let iAbove = CDTable.length - 1;

        // console.log("Looking for " + mach + " initial range : " + i_below + " to " + i_above);
        while(iBelow < iAbove - 1) {
            let candidate = Math.trunc((iBelow + iAbove) / 2);
            if(CDTable[candidate][0] < mach) {
                iBelow = candidate;
            }
            else {
                iAbove = candidate;
            }
        }

        return CDTable[iBelow][1] + CDTable[iBelow][2] * (mach - CDTable[iBelow][0]);
    }

    //! Calculate the ballistic trajectory of a projectile.
    //!  @param range       - maximum range to calculate (in metres)
    //!  @param angle       - the launch angle relative to horizontal, positive up (in radians).
    //!  @param velocity    - initial velocity in metres / second.
    //!  @param mass        - mass of the projectile in kilogrammes.
    //!  @param bc          - the ballistic coefficient of the projectile in the selected system.
    //!  @param reference   - the height of the horizontal reference.
    //!  @param environment - the environmental factors to consider.
    //! The trajectory will be computed by numerical differentiantion with variable time delta
    //! which will give trajectory point spaced approximately every STEP metres.
    //! @returns an array of point objects representing the trajectory containing x-value y-value,
    //! velocity, time and normalized windage (1m/s perpendicular).
    function getTrajectory(range, angle, velocity, mass, bc, reference, environment) {
        let points = [];

        let v_x = velocity * Math.cos(angle);
        let v_y = velocity * Math.sin(angle);

        // s_x and s_y are the coordinates of the projectile_.
        // Positive is UP
        let s_x = 0;
        let s_y = -reference;

        let  t = 0; // Time elapsed, in seconds

        let A =  (Math.PI / 4) / (INCHES_PER_METRE * INCHES_PER_METRE) * mass * POUNDS_PER_KG / bc;

        while(s_x < range) {
            let dt = STEP / v_x;
            let v = Math.sqrt(v_x * v_x + v_y * v_y);
            let mach = v/environment.mach1;

            // Get the coefficient of drag from the table for this axial velocity.
            let  F = 0.5 * environment.rho * v * v * getCD(mach)  * A;

            // horizontal and vertical drag
            let F_x = F * v_x / v;
            let F_y = F * v_y / v;

            // accelleration is the result of the action of a force on mass
            let a_x = -F_x / mass;
            let a_y = -F_y / mass - GRAVITY; // gravity goes down

            let dv_x = a_x * dt;
            let dv_y = a_y * dt;

            // windage is normalized for 1 m/s perpendicular - note that we are not calculating vertical offset due to the windage.
            points.push( {
                x: s_x, // horizontal position
                y: s_y, // vertical position, positive high,
                v: v ,  // velocity
                t: t,   // time
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

    //! Find the actual zero distance of the given trajectory.
    //! Locates the far horizontal crossing the trajectory.
    //!   @param trajectory - the trajectory as computed by getTrajectory()
    //! @returns the zero distance or 0.0 if the trajectory doesn't intersect the horizontal reference.
    function getZeroDistance(trajectory) {
        for(let i=0; i<trajectory.length - 2; i++) {
            if(trajectory[i].y >= 0 && trajectory[i + 1].y < 0) {
                return getZeroCrossingLinear(trajectory[i].x, trajectory[i].y, trajectory[i+1].x, trajectory[i+1].y);
            }
        }
        return 0.0; // no zero-crossing.
    }

    //! Find the near and far intersections of the trajectory with a horizontal reference with an offset.
    function getCrossings(trajectory, offset) {
        let crossings = { near: 0, far: 0 };
        for(let i = 0; i < trajectory.length - 2; i++) {
            if(trajectory[i].y >= offset && trajectory[i + 1].y < offset) {
                crossings.far = getZeroCrossingLinear(trajectory[i].x, trajectory[i].y - offset, trajectory[i+1].x, trajectory[i+1].y - offset);
                return crossings; // can't go back up.
            }

            if(trajectory[i].y <= offset && trajectory[i+1].y > offset) {
                crossings.near = getZeroCrossingLinear(trajectory[i].x, trajectory[i].y - offset, trajectory[i+1].x, trajectory[i+1].y - offset);
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
            w: diff * (second.w - first.w) + first.w
        }
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
    function getZeroingAngle(range, offset, velocity, mass, bc, reference, environment ) {
        let path = getTrajectory(range, 0.0, velocity, mass, bc, reference, environment);
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
            zeros: getCrossings(trajectory, 0.0)
        }
    }

    // finds a quadratic passing through the points and solves for zero first derivative.
    function findZeroDerivative(p0, p1, p2) {
        let A = ((p0.y - p2.y) * (p1.x - p2.x) - (p1.y - p2.y) * (p0.x - p2.x)) / ((p0.x * p0.x - p2.x * p2.x) * (p1.x - p2.x) - (p1.x * p1.x - p2.x * p2.x) * (p0.x - p2.x));
        let B = ((p1.y - p2.y) - A * (p1.x * p1.x - p2.x * p2.x)) / (p1.x - p2.x);
        let C = p0.y - B * p0.x - A * p0.x * p0.x;
        let x = -B / (2 * A)
        let y = A * x * x + B * x + C;
        return {x: x, y: y};
    }

    function main(ranges) {
        let range                 = ranges[ranges.length-1];    // Distance over which to plot results
        let muzzleVelocityMps     = 932.7;    // Metres per second
        let massGrains            = 95.0;   // Mass of the bullet in grains

        let bc                    = 0.190;  // G1 ballistic coefficient
        let sightHeightM          = 0.044;   // Height of the sight above the muzzle

        let zeroRange  =  100  ; // m
        let zeroImpact =  -0.032    ; // m

        let massKg = massGrains / GRAINS_PER_KG ;

        let temperature =  -1;    // °C
        let pressure    = 1017;   // hPa
        let humidity    = 0.5;    // yeah... well
        let windSpeed   = 0.0;
        let windAngle   = Math.PI / 2; //

        let env = new EnvironmentalFactors(temperature, pressure, humidity, windSpeed, windAngle);

        let angle      = getZeroingAngle(zeroRange, zeroImpact, muzzleVelocityMps, massKg, bc, sightHeightM, env);
        let angleMrad = angle * 1000;
        let clicks     = angleMrad / 0.07;
        console.log(`Zero angle is ${(angleMrad).toFixed(2)} mrad or ${clicks.toFixed(1)} clicks`);

        let trajectory = getTrajectory(range + 1, angle + 16 * 0.07 / 1000, muzzleVelocityMps, massKg, bc, sightHeightM, env);
        let envelope = getEnvelope(trajectory);

        // console.log("actual zero distance " + actualZero.toFixed(3))
        console.log(`near zero: ${envelope.zeros.near.toFixed(3)} m , far zero: ${envelope.zeros.far.toFixed(3)} m`);
        console.log(' x \t vel \t  y\t  t\twind\n');
        console.log(' Total number of points calculated:' + trajectory.length);

        let rangeIndex = 0;
        for(let i = 1; i < trajectory.length && rangeIndex < ranges.length; i++) {
            let point = trajectory[i];

            if(point.x > ranges[rangeIndex]) {
                let lastPoint = trajectory[i - 1];
                let x = ranges[rangeIndex++];
                let res = linearInterpolate(x, lastPoint, point);
                console.log(`${res.x}\t${res.v.toFixed(1)}\t${(res.y*1000).toFixed(0)}\t${res.t.toFixed(3)}\t${(res.w * 1000).toFixed(0)}`);
            }
        }

        console.log(`Highest point reached at ${envelope.maxPoint.x.toFixed(1)} m : ${(envelope.maxPoint.y * 1000).toFixed(1) } mm`)
        console.log(`Point blank range from  ${envelope.pbr.near.toFixed(0)} m to  ${envelope.pbr.far.toFixed(0)} m with a vital zone size of ${(envelope.maxPoint.y * 2000).toFixed(0) } mm`)
    }
    this.main = main;
    this.EnvironmentalFactors = EnvironmentalFactors;
    this.headWind = headWind;
    this.crossWind = crossWind;
}

module.exports = PointMassBallisticSolver;