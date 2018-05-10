
// Todo: make the interface in/out of this class in metric.
function StandardModel(maxRange, dragFunction) {
    const GRAVITY = -32.194;
    const PSTD = 29.53; // this is standard pressure

    // todo do proper changing of functions

    /* Specialty angular conversion functions */
    function MOAtoDeg(moa) {
        return moa / 60.0;
    }

    function DegtoMOA(deg) {
        return deg * 60.0;
    }

    function DegtoRad(deg) {
        return deg * Math.PI / 180.0;
    }

    function MOAtoRad(moa) {
        return moa / 60.0 * Math.PI / 180.0;
    }

    function RadtoDeg(rad) {
        return rad * 180.0 / Math.PI;
    }

    function RadtoMOA(rad) {
        return rad * 60.0 * 180.0 / Math.PI;
    }

    function RadtoMIL(rad) {
        return rad * 1000.0;
    }

    /* Environmental value conversion */
    function hPatoinHg(pressure) {
        return pressure * 0.0295299802
    }

    function CelsiustoFahrenheit(temp) {
        return temp * 9 / 5 + 32;
    }

    function DF(model) {
        var _functions = {
            'G1': [
                { vp: 4230, A: 1.477404177730177e-04, M: 1.9565 }, // for speeds v above vp, drag is Av^M
                { vp: 4230, A: 1.477404177730177e-04, M: 1.9565 },
                { vp: 3680, A: 1.920339268755614e-04, M: 1.925 },
                { vp: 3450, A: 2.894751026819746e-04, M: 1.875 },
                { vp: 3295, A: 4.349905111115636e-04, M: 1.825 },
                { vp: 3130, A: 6.520421871892662e-04, M: 1.775 },
                { vp: 2960, A: 9.748073694078696e-04, M: 1.725 },
                { vp: 2830, A: 1.453721560187286e-03, M: 1.675 },
                { vp: 2680, A: 2.162887202930376e-03, M: 1.625 },
                { vp: 2460, A: 3.209559783129881e-03, M: 1.575 },
                { vp: 2225, A: 3.904368218691249e-03, M: 1.550 },
                { vp: 2015, A: 3.222942271262336e-03, M: 1.575 },
                { vp: 1890, A: 2.203329542297809e-03, M: 1.625 },
                { vp: 1810, A: 1.511001028891904e-03, M: 1.675 },
                { vp: 1730, A: 8.609957592468259e-04, M: 1.750 },
                { vp: 1595, A: 4.086146797305117e-04, M: 1.850 },
                { vp: 1520, A: 1.954473210037398e-04, M: 1.950 },
                { vp: 1420, A: 5.431896266462351e-05, M: 2.125 },
                { vp: 1360, A: 8.847742581674416e-06, M: 2.375 },
                { vp: 1315, A: 1.456922328720298e-06, M: 2.625 },
                { vp: 1280, A: 2.419485191895565e-07, M: 2.875 },
                { vp: 1220, A: 1.657956321067612e-08, M: 3.250 },
                { vp: 1185, A: 4.745469537157371e-10, M: 3.750 },
                { vp: 1150, A: 1.379746590025088e-11, M: 4.250 },
                { vp: 1100, A: 4.070157961147882e-13, M: 4.750 },
                { vp: 1060, A: 2.938236954847331e-14, M: 5.125 },
                { vp: 1025, A: 1.228597370774746e-14, M: 5.250 },
                { vp: 980, A: 2.916938264100495e-14, M: 5.125 },
                { vp: 945, A: 3.855099424807451e-13, M: 4.750 },
                { vp: 905, A: 1.185097045689854e-11, M: 4.250 },
                { vp: 860, A: 3.566129470974951e-10, M: 3.750 },
                { vp: 810, A: 1.045513263966272e-08, M: 3.250 },
                { vp: 780, A: 1.291159200846216e-07, M: 2.875 },
                { vp: 750, A: 6.824429329105383e-07, M: 2.625 },
                { vp: 700, A: 3.569169672385163e-06, M: 2.375 },
                { vp: 640, A: 1.839015095899579e-05, M: 2.125 },
                { vp: 600, A: 5.711174688734240e-05, M: 1.950 },
                { vp: 550, A: 9.226557091973427e-05, M: 1.875 },
                { vp: 250, A: 9.337991957131389e-05, M: 1.875 },
                { vp: 100, A: 7.225247327590413e-05, M: 1.925 },
                { vp: 65, A: 5.792684957074546e-05, M: 1.975 },
                { vp: 0, A: 5.206214107320588e-05, M: 2.000 }
            ],
            'G2': [
                { vp: 1674, A: 0.0079470052136733, M: 1.36999902851493 },
                { vp: 1172, A: 1.00419763721974e-03, M: 1.65392237010294 },
                { vp: 1060, A: 7.15571228255369e-23, M: 7.91913562392361 },
                { vp: 949, A: 1.39589807205091e-10, M: 3.81439537623717 },
                { vp: 670, A: 2.34364342818625e-04, M: 1.71869536324748 },
                { vp: 335, A: 1.77962438921838e-04, M: 1.76877550388679 },
                { vp: 0, A: 5.18033561289704e-05, M: 1.98160270524632 }
            ],
            'G5': [
                { vp: 1730, A: 7.24854775171929e-03, M: 1.41538574492812 },
                { vp: 1228, A: 3.50563361516117e-05, M: 2.13077307854948 },
                { vp: 1116, A: 1.84029481181151e-13, M: 4.81927320350395 },
                { vp: 1004, A: 1.34713064017409e-22, M: 7.8100555281422 },
                { vp: 837, A: 1.03965974081168e-07, M: 2.84204791809926 },
                { vp: 335, A: 1.09301593869823e-04, M: 1.81096361579504 },
                { vp: 0, A: 3.51963178524273e-05, M: 2.00477856801111 }
            ],
            'G6': [
                { vp: 3236, A: 0.0455384883480781, M: 1.15997674041274 },
                { vp: 2065, A: 7.167261849653769e-02, M: 1.10704436538885 },
                { vp: 1311, A: 1.66676386084348e-03, M: 1.60085100195952 },
                { vp: 1144, A: 1.01482730119215e-07, M: 2.9569674731838 },
                { vp: 1004, A: 4.31542773103552e-18, M: 6.34106317069757 },
                { vp: 670, A: 2.04835650496866e-05, M: 2.11688446325998 },
                { vp: 0, A: 7.50912466084823e-05, M: 1.92031057847052 }
            ],
            'G7': [ // this above 4200 is suspect...
                { vp: 4200, A: 1.29081656775919e-09, M: 3.24121295355962 },
                { vp: 3000, A: 0.0171422231434847, M: 1.27907168025204 },
                { vp: 1470, A: 2.33355948302505e-03, M: 1.52693913274526 },
                { vp: 1260, A: 7.97592111627665e-04, M: 1.67688974440324 },
                { vp: 1110, A: 5.49174006025278e-20, M: 6.88983788792443 },
                { vp: 960, A: 3.02865108244904e-17, M: 5.99074203776707 },
                { vp: 670, A: 7.52285155782535e-06, M: 2.1738019851075 },
                { vp: 540, A: 1.31766281225189e-05, M: 2.08774690257991 },
                { vp: 0, A: 1.34504843776525e-05, M: 2.08702306738884 }
            ]
        };
        // todo use proper model index.
        var dragFunction = _functions[model];
        var idx = 0;
        var current = dragFunction[idx];
        // this is called with diminishing speed - i.e. v never goes up.
        return function (v) {
            if(v <= current.vp) {
                while(v <= dragFunction[idx].vp) {
                    idx++;
                }
                current = dragFunction[idx];
            }
            return current.A * Math.pow(v, current.M);
        }
    }

    // Adjust a drag coefficient to environmentals.
    function AtmCorrect(DragCoefficient, Altitude, Barometer, Temperature, RelativeHumidity) {
        function calcFR(Temperature, Pressure, RelativeHumidity) {
            let VPw = Temperature * (Temperature * (Temperature * 4e-6 - 4e-4) + 0.0234) - 0.2517;
            let FRH = 0.995 * (Pressure / (Pressure - 0.3783 * RelativeHumidity * VPw));
            return FRH;
        }

        function calcFP(Pressure) {
            return (Pressure - PSTD) / (PSTD);
        }

        function calcFT(Temperature, Altitude) {
            var Tstd = -0.0036 * Altitude + 59;
            return (Temperature - Tstd) / (459.6 + Tstd);
        }

        function calcFA(Altitude) {
            const a = -4e-15;
            const b = 4e-10;
            const c = -3e-5;
            const d = 1;
            return 1 / (Altitude * (Altitude * (Altitude * a + b) + c) + d);
        }

        let FA = calcFA(Altitude);
        let FT = calcFT(Temperature, Altitude);
        let FR = calcFR(Temperature, Barometer, RelativeHumidity);
        let FP = calcFP(Barometer);

        // Calculate the atmospheric correction factor
        var CD = (FA * (1 + FT - FP) * FR);

        return DragCoefficient * CD;
    }
    // i.e total time elapsed minus the time it would have taken with no decelation) i.e. total time lost multiplied by the wind speed and some factor.
    function Windage(WindSpeed, Vi, xx, t) {
        return ((WindSpeed * 17.60) * (t - xx / Vi));
    }

    function HeadWind(WindSpeed, WindAngle) {
        return (Math.cos(DegtoRad(WindAngle)) * WindSpeed);
    }

    function CrossWind(WindSpeed, WindAngle) {
        return (Math.sin(DegtoRad(WindAngle)) * WindSpeed);
    }

    function ZeroAngle(DragCoefficient, Vi, SightHeight, ZeroRange, yIntercept) {
        let riflemans = Math.atan((yIntercept - DropAtZero(DragCoefficient, Vi, SightHeight, ZeroRange)) / (ZeroRange * 36));
        if(ZeroRange < 600) return RadtoDeg(riflemans);

        let angle = 1.5 * riflemans;
        let step = angle / 2;
        let minstep = MOAtoRad(0.001);
        while(true) {
            let drop = DropAtZeroAngled(DragCoefficient, Vi, SightHeight, ZeroRange, angle - step);
            let diff = Math.abs(drop - yIntercept);

            if(step < minstep || diff < 0.005) return RadtoDeg(angle - step);
            if(drop > yIntercept) angle = angle - step;
            step = step / 2;
        }
    }

    function FindZero(DragCoefficient, Weight, Vi, SightHeight, ShootingAngle, ZAngle, WindSpeed, WindAngle) {
        let dt = 0.5 / Vi;

        let headwind = HeadWind(WindSpeed, WindAngle);
        // var crosswind = CrossWind(WindSpeed, WindAngle);

        let Gy = GRAVITY * Math.cos(DegtoRad((ShootingAngle + ZAngle)));
        let Gx = GRAVITY * Math.sin(DegtoRad((ShootingAngle + ZAngle)));

        let vx = Vi * Math.cos(DegtoRad(ShootingAngle + ZAngle));
        let vy = Vi * Math.sin(DegtoRad(ShootingAngle + ZAngle));

        let x = 0;
        let y = -SightHeight / 12;
        let drag = DF(dragFunction);
        for(let t = 0; ;t = t + dt) {
            let vx1 = vx;
            let vy1 = vy;

            let v = Math.pow(Math.pow(vx, 2) + Math.pow(vy, 2), 0.5);
            dt = 0.5 / v;

            let dv = drag(v + headwind) / DragCoefficient;
            let dvx = -(vx / v) * dv + Gx;
            let dvy = -(vy / v) * dv + Gy;

            vx += dt * dvx;
            vy += dt * dvy;

            let meters = x / 3.280839895;

            let diffx = dt * (vx + vx1) / 2;
            let diffy = dt * (vy + vy1) / 2;

            // detect zero
            if((y > 0) && ((y + diffy) < 0)) return meters;

            x += diffx;
            y += diffy;

            if(Math.abs(vy) > Math.abs(3 * vx)) break;
            if(meters > maxRange) break;
        }

        return 0.0;
    }

    // note that the values are in imperial
    function SolveAll(DragCoefficient, Weight, Vi, SightHeight, ShootingAngle, ZAngle, WindSpeed, WindAngle) {
        let result = {
            'yardsolutions': [],
            'solutions': [],
            'maxpath': -10000000,
            'maxpathrange': 0,
            'zeroat': 0
        };

        let dt = 0.25 / Vi;

        let headwind = HeadWind(WindSpeed, WindAngle);
        let crosswind = CrossWind(WindSpeed, WindAngle);

        let Gy = GRAVITY * Math.cos(DegtoRad((ShootingAngle + ZAngle)));
        let Gx = GRAVITY * Math.sin(DegtoRad((ShootingAngle + ZAngle)));

        let vx = Vi * Math.cos(DegtoRad(ShootingAngle + ZAngle));
        let vy = Vi * Math.sin(DegtoRad(ShootingAngle + ZAngle));

        let x = 0; //  ft
        let y = -SightHeight / 12; //  ft

        let n = 0;
        let m = 0;
        let drag = DF(dragFunction);

        for(let t = 0; ;t = t + dt) {
            let vx1 = vx;
            let vy1 = vy;

            let v = Math.pow(Math.pow(vx, 2) + Math.pow(vy, 2), 0.5);
            dt = 0.5 / v;

            let dv = drag(v + headwind) / DragCoefficient;
            let dvx = -(vx / v) * dv + Gx;
            let dvy = -(vy / v) * dv + Gy;

            vx += dt * dvx;
            vy += dt * dvy;
            let yards = x / 3;
            let meters = x / 3.280839895;
            let path = y * 12; // in inches
            if(meters >= n) {
                // console.log(`${v}\t${dv}`)
                let solution = {};
                solution.range = x / 3; // Range in yds ( 3 ft pr yard)
                solution.path = path; // Path in inches
                solution.time = t + dt; // Time in s
                solution.windage = Windage(crosswind, Vi, x, t + dt); // Windage in inches
                solution.velocity = v; // Velocity (combined)
                solution.energy = Math.pow(v, 2) / 450380.0 * Weight;
                solution.vel_x = vx; // Velocity (x)
                solution.vel_y = vy; // Velocity (y)
                solution.x = n;
                solution.y = path * 0.0254; // meters
                solution.t = solution.time;
                solution.z = solution.windage * 0.0254; // meters.
                solution.v = vx; // horizontal velocity

                result.solutions[n] = solution;
                n++;
            }

            if(yards >= m) {
                let solution = {};
                solution.range = x / 3; // Range in yds ( 3 ft pr yard)
                solution.path = path; // Path in inches
                solution.time = t + dt; // Time in s
                solution.windage = Windage(crosswind, Vi, x, t + dt); // Windage in inches
                solution.velocity = v; // Velocity (combined)
                solution.energy = Math.pow(v, 2) / 450380.0 * Weight;
                solution.vel_x = vx; // Velocity (x)
                solution.vel_y = vy; // Velocity (y)
                result.yardsolutions[m] = solution;
                m++;
            }

            if(path > result.maxpath) {
                result.maxpath = path;
                result.maxpathrange = x / 3; // in yards
            }
            else if(path > -result.maxpath) {
                result.outerpath = path;
                result.outerpathrange = x / 3;
            }

            let diffx = dt * (vx + vx1) / 2;
            let diffy = dt * (vy + vy1) / 2;

            // detect zero
            if((y > 0) && ((y + diffy) < 0)) result.zeroat = yards;

            x += diffx;
            y += diffy;

            if(Math.abs(vy) > Math.abs(3 * vx)) break;
            if(n > maxRange) break;
        }
        //  console.log(zzz.toString() + ' datapoints');
        return result;
    }

    // angle in radians
    function DropAtZeroAngled(DragCoefficient, Vi, SightHeight, ZeroRange, Angle) {
        let dt = 0.5 / Vi;

        let Gy = GRAVITY * Math.cos(Angle);
        let Gx = GRAVITY * Math.sin(Angle);

        let vx = Vi * Math.cos(Angle);
        let vy = Vi * Math.sin(Angle);

        let x = 0;
        let y = -SightHeight / 12;
        let drag = DF(dragFunction);

        // track x (feet) out to zeroRange (yards)
        for(let t = 0; x < (ZeroRange * 3); t = t + dt) {
            let vy1 = vy;
            let vx1 = vx;
            let v = Math.pow((Math.pow(vx, 2) + Math.pow(vy, 2)), 0.5);
            dt = 0.5 / v;

            let dv = drag(v) / DragCoefficient;
            let dvy = -dv * vy / v;
            let dvx = -dv * vx / v;

            vx += dt * (dvx + Gx);
            vy += dt * (dvy + Gy);

            x = x + dt * (vx + vx1) / 2;
            y = y + dt * (vy + vy1) / 2;
        }
        return y * 12; // inches
    }

    // this is only used to base a riflemans rule estimate of the zero angle.
    // note that this is inaccurate for very slow bullets or extreme ranges, but
    // good enough for hunting distances by normal humans using normal ammunition.
    function DropAtZero(DragCoefficient, Vi, SightHeight, ZeroRange) {
        let dt = 0.5 / Vi;
        let Angle = 0.0; // pointed level
        let Gy = GRAVITY * Math.cos(Angle);
        let Gx = GRAVITY * Math.sin(Angle);

        let vx = Vi;
        let vy = 0;

        let x = 0;
        let y = -SightHeight / 12;
        let maxRange = ZeroRange * 3; // max range in feet.
        let drag = DF(dragFunction);
        for(let t = 0; (x < maxRange) && (Math.abs(vy) < Math.abs(3 * vx)); t = t + dt) {
            let vx1 = vx;
            let vy1 = vy;
            let v = Math.pow(Math.pow(vx, 2) + Math.pow(vy, 2), 0.5);
            dt = 0.5 / v;

            let dv = drag(v) / DragCoefficient;
            let dvy = -dv * vy / v;
            let dvx = -dv * vx / v;

            vx += dt * (dvx + Gx);
            vy += dt * (dvy + Gy);

            x += dt * (vx + vx1) / 2;
            y += dt * (vy + vy1) / 2;
        }
        return y * 12;
    }

    function PointBlankSolution(DragCoefficient, Vi, SightHeight, VitalSize) {
        let solution = [];
        let dt = 0.1 / Vi;

        let vx = Vi;
        let vy = 0;

        let x = 0;
        let y = -SightHeight / 12; // feet.

        solution[0] = { x: x, y: y, slope: vy / vx, high: 0 };

        let lastHigh = 0; // index of the last high point.
        let drag = DF(dragFunction);
        for(let t = 0, n = 1; ;t += dt, n++) {
            let vx1 = vx;
            let vy1 = vy;
            let v = Math.pow(Math.pow(vx, 2) + Math.pow(vy, 2), 0.5);
            dt = 0.25 / v;

            let dv = drag(v) / DragCoefficient;
            let dvx = -(vx / v) * dv;
            let dvy = -(vy / v) * dv + GRAVITY;

            vx += dt * dvx;
            vy += dt * dvy;

            x += dt * (vx + vx1) / 2;
            y += dt * (vy + vy1) / 2;

            let a = y / x;

            // search from the last index for a point a velocity vector with the same slope.
            while(lastHigh < n && solution[lastHigh].slope > a) {
                lastHigh++;
            }
            solution[n] = { x: x, y: y, slope: vy / vx, high: 0 }

            if(lastHigh < n) {
                // the high point is half the vital zone size away.
                let zonesize = 2 * Math.abs(solution[lastHigh].y - a * solution[lastHigh].x) * 12;
                if(zonesize >= VitalSize) {
                    return x / 3;
                }
            }
        }
        // return 0;
    }

    function PBR(DragCoefficient, Vi, SightHeight, VitalSize) {
        // search results.
        let zero = -1; // returned
        let farzero = 0; // returned
        let minPbrRange = 0; // returned
        let maxPbrRange = 0; // returned
        let tin100 = 0; // returned

        // initial control values for the search.
        let ZAngle = 0;
        let Step = 10;
        let quit = false;

        while(!quit) {
            let keep = false;
            let keep2 = false;
            let tinkeep = false;
            let minPbrKeep = false;
            let maxPbrKeep = false;
            let vertexKeep = false;

            let Gy = GRAVITY * Math.cos(DegtoRad((ZAngle)));
            let Gx = GRAVITY * Math.sin(DegtoRad((ZAngle)));

            let vx = Vi * Math.cos(DegtoRad(ZAngle));
            let vy = Vi * Math.sin(DegtoRad(ZAngle));

            let x = 0;
            let y = -SightHeight / 12;

            tin100 = 0;
            var yVertex = 0;

            let drag = DF(dragFunction);
            let dt = 0.25 / Vi;

            for(let t = 0; ;t = t + dt) {
                let vx1 = vx;
                let vy1 = vy;
                let v = Math.sqrt(vx * vx + vy * vy);
                dt = 0.25 / v;

                // dv = retard(DragFunction, DragCoefficient, v);
                let dv = drag(v) / DragCoefficient;
                let dvx = -(vx / v) * dv;
                let dvy = -(vy / v) * dv;

                // Compute velocity, including the resolved gravity vectors.
                vx = vx + dt * (dvx + Gx);
                vy = vy + dt * (dvy + Gy);

                // Compute position based on average velocity.
                x = x + dt * (vx + vx1) / 2;
                y = y + dt * (vy + vy1) / 2;

                if(y > 0 && !keep && vy >= 0) {
                    zero = x;
                    keep = true;
                }

                if(y < 0 && !keep2 && vy <= 0) {
                    farzero = x;
                    keep2 = true;
                }

                if((12 * y) > -(VitalSize / 2) && !minPbrKeep) {
                    minPbrRange = x;
                    minPbrKeep = true;
                }

                if((12 * y) < -(VitalSize / 2) && minPbrKeep && !maxPbrKeep) {
                    maxPbrRange = x;
                    maxPbrKeep = true;
                }

                if(x >= 300 && !tinkeep) {
                    tin100 = (100 * y * 12);
                    tinkeep = true;
                }

                if(Math.abs(vy) > Math.abs(3 * vx)) {
                    break;
                }

                // The PBR will be maximum at the point where the vertex is 1/2 vital zone size.
                // this is recording the highest point....

                if(vy < 0 && !vertexKeep) {
                    yVertex = y;
                    vertexKeep = true;
                }

                if(keep && keep2 && minPbrKeep && maxPbrKeep && vertexKeep && tinkeep) {
                    break;
                }
            }

            if((yVertex * 12) > (VitalSize / 2)) {
                if(Step > 0) {
                    Step = -Step / 2;
                }
            }
            else if((yVertex * 12) <= (VitalSize / 2)) {
                // Vertex too low.  Go upwards.
                if(Step < 0) {
                    Step = -Step / 2;
                }
            }

            ZAngle += Step;

            if(Math.abs(Step) < (0.01 / 60)) {
                quit = true;
            }
        }

        return {
            near_zero: zero / 3,
            far_zero: farzero / 3,
            min_range: minPbrRange / 3,
            max_range: maxPbrRange / 3,
            vitals: VitalSize,
            tin100: tin100
        };
    }

    // Public methods and constants.

    this.MOAtoDeg = MOAtoDeg;
    this.DegtoMOA = DegtoMOA;
    this.DegtoRad = DegtoRad;
    this.MOAtoRad = MOAtoRad;
    this.RadtoDeg = RadtoDeg;
    this.RadtoMOA = RadtoMOA;
    this.RadtoMIL = RadtoMIL;

    this.hPa_to_inHg = hPatoinHg;
    this.celsius_to_fahrenheit = CelsiustoFahrenheit;

    this.ZeroAngle = ZeroAngle;
    this.SolveAll = SolveAll;
    this.AtmCorrect = AtmCorrect;
    this.PointBlankSolution = PointBlankSolution;
    this.FindZero = FindZero;
    this.PBR = PBR;
    this.CrossWind = CrossWind;
}

module.exports = StandardModel;
