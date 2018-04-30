<template>
  <div id="app" v-cloak>
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
      body {
        margin : 0px;
        padding : 0px;
      }
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;   
    color: #2c3e50;
    margin-top: 10px;
    max-width : 830px; 
    margin-left : auto; 
    margin-right : auto;        
}

</style>
