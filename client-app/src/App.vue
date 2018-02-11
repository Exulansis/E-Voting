<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
    };
  },
};
</script>

<style>
html, body {
  width:100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Avenir', Helvetica, Arial, sans-serif;

  background-color: aquamarine;
  color: #2c3e50;
}
</style>
