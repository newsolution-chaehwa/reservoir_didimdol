<template>
  <div style="height: 100vh; display: flex; width: 100vw">
    <g-n-b-component></g-n-b-component>
    <router-view></router-view>
  </div>
</template>

<script>
import GNBComponent from "../common/GNBComponent.vue";

export default {
  name: "MainContainer",

  components: {
    GNBComponent,
  },

  data() {
    return {};
  },
};
</script>
