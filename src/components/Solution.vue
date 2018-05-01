<template>
    <table class="solution" v-if="solution.show">
        <tr><th>Range</th> <th>Speed</th><th>Path</th>  <th>Clicks</th> <th>Wind</th>  <th>Time</th><th>Energy</th></tr>
        <tr><th>m</th>     <th>fps</th><th>mm</th>    <th></th>       <th>mm</th>    <th>ms</th> <th>ft lbs</th> </tr>
        <tr v-for="p in solution.path"  :class="p.u">
            <td>{{ p.x }}</td>
            <td>{{ p.v.toFixed(0) }}</td>
            <td>{{ (p.y * 1000).toFixed(0) }}</td>
            <td>{{ (-p.c).toFixed(1)  }}</td>
            <td>{{ (p.z * 1000).toFixed(0) }}</td>
            <td>{{ (p.t * 1000).toFixed(0) }}</td>
            <td>{{ p.e.toFixed(0) }}</td>
        </tr>
    </table>
</template>


<script>
export default {
    name: "Solution",
    props: {
        solution: Object
    }
}
</script>


<style scoped>
    table.solution { 
        min-width : 379px; 
        max-width : 379px;
        width : 379px; 
        padding : 15px;
        margin-top : 10px;
        font-size : 12pt; 
        border-collapse : collapse; 
        /* display: inline-block; */ 
        vertical-align: top ; 
        
        margin-left : auto;
        margin-right : auto; 
    }
    table.solution td,th { font-size : 90%; padding-left : 4px; padding-right : 4px; column-width: 23px }
    table.solution td {text-align : right; font-size : 90%; padding-right : 4px;; }
    table.solution tr.X { background : rgba(0,0,0,0.1); font-weight : bold; }
    table.solution tr.o { background : rgba(0,0,0,0.05);   }
</style>
