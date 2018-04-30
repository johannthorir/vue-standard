<template>
    <div class="scopecontainer" >
        <canvas class="scope" ref="canvas" width="360" height="360" @mousemove="mmove" @mousedown="mdown" @mouseup="mup" @touchmove="touchmove" @touchstart="touchstart"></canvas>
    </div>
</template>

<script>

export default {
    name: "Scope",
    props: [
        'zeroInfo',
        'scopeInfo',
        'solution'
    ],
    mounted: function() {
        this.render();
    },
    data: function () {
        return({
            rotating: null,
            captured: false
        });
    },

    created: function () {
        console.log("created")
        this.rotating = new Image();
        this.rotating.src = require("../assets/rotating.png");
        this.rotating.onload = this.render;
    },
        
    methods: {
        mmove: function (event) {
            if(event) event.preventDefault();
            if(!this.captured) return;
            this.move(event, event.target.getBoundingClientRect());
        },
        mdown: function (event) {
            if (event) event.preventDefault;
            this.captured = true;
            if (event.target.setCapture)
                event.target.setCapture();
            this.start(event, event.target.getBoundingClientRect());

        },
        mup: function (event) {
            if (event) event.preventDefault;
            this.captured = false;
            if (document.releaseCapture)
                document.releaseCapture();
        },

        touchstart: function (event) {
            if (event) event.preventDefault;
            this.start(event.targetTouches[0], event.srcElement.getBoundingClientRect());
        },

        touchmove: function (event) {
            if(event) event.preventDefault();
            this.move(event.targetTouches[0], event.srcElement.getBoundingClientRect());
        },

        start: function (t, r) {
            var dx = (t.clientX - r.x) - this.scopeInfo.center.x;
            var dy = (t.clientY - r.y) - this.scopeInfo.center.y;
            this.scopeInfo.initial = Math.atan2(dx, dy);
            this.scopeInfo.accumulated = 0.0;
        },

        move: function (t, r) {
            var dx = (t.clientX - r.x) - this.scopeInfo.center.x;
            var dy = (t.clientY - r.y) - this.scopeInfo.center.y;
            var a = Math.atan2(dx,dy);
            var da = (a - this.scopeInfo.initial);
            if(da > Math.PI)
                da -= 2 * Math.PI;
            if(da < -Math.PI)
                da += 2 * Math.PI;
            var clicks = da * this.scopeInfo.clicksPrTurn / (2*Math.PI);
            this.scopeInfo.accumulated += clicks;
            if(Math.abs(this.scopeInfo.accumulated) > 1) {
                var c = Math.trunc(this.scopeInfo.accumulated);
                this.scopeInfo.accumulated -= c;
                this.scopeInfo.currentClick += c;
                this.$emit('clickity');
            }

            this.scopeInfo.initial = a;
        },
        // draws the scope click ring with solution overlaid.
        render: function() {           
            if(!this.scopeInfo.showScopeAdjust)
                return;
            var canvasElement = this.$refs.canvas;
            var ctx = canvasElement.getContext("2d");

            var rot_x = this.scopeInfo.center.x;
            var rot_y = this.scopeInfo.center.y;

            // draw the click ring
            ctx.clearRect(0,0,360,360);
            ctx.save();
            ctx.translate(rot_x, rot_y);
            ctx.rotate(-this.scopeInfo.currentClick * 360/this.scopeInfo.clicksPrTurn * Math.PI / 180);
            ctx.drawImage(this.rotating,-rot_x,-rot_y);
            ctx.restore();

            // draw the solution
            ctx.fillStyle    = "rgb(255,225,0)";
            ctx.textAlign    = "center";
            ctx.textBaseline = "bottom";

            var radius = 131;
            var ball = 5;
            var minClick = undefined;
            var x0  = this.solution.path[0].x;
            for(var k in this.solution.path) {
                var r = this.solution.path[k].x;
                let u = this.solution.path[k].u;

                if (u == 'X')  {
                    ctx.font = "bold 16px Sans-Serif";
                    ball = 4;
                }
                else if (u == 'o') {
                    ctx.font = "14px Sans-Serif";
                    ball = 2.5;
                }

                // var c =  this.zeroInfo.click - this.scopeInfo.click - this.solution.path[k].c;
                var c = -this.solution.path[k].c;
                minClick = (minClick === undefined ? c : (c < minClick ? c : minClick));
                if(c - minClick >= this.scopeInfo.clicksPrTurn) {
                    radius = 144;
                    ctx.fillStyle = "rgb(255,125,0)";
                }
                ctx.save();
                ctx.translate(rot_x, rot_y);
                ctx.rotate(c * 2 * Math.PI / this.scopeInfo.clicksPrTurn);

                if(u != 'z')
                    ctx.fillText(r, 0, -radius-6);
                else
                    ball = 2;

                ctx.beginPath();
                ctx.arc(0,-radius, ball,0,2*Math.PI, false);
                ctx.fill();
                ctx.restore();
            }

            // draw the current click.
            ctx.font = "bold 18px sans-serif";
            ctx.fillStyle = "rgb(240,240,255)";
            ctx.textBaseline = "middle";
            ctx.fillText(this.scopeInfo.currentClick - this.zeroInfo.click, rot_x, rot_y);
        }
    }
}; // end module exports
</script>

<style scoped>   
    div.scopecontainer { 
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
        text-align : center;
        vertical-align : top;
        display : inline-block;
    }
    canvas.scope { background-image : url('../assets/static.png'); border : 1px solid #358;}
</style>
  