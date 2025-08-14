<template>
  <main-container ></main-container>
</template>

<script>
// import  MainContainer  from '@/components/main/MainContainer.vue';
import  MainContainer  from '@/components/MainContainer.vue';

export default {
  name: "App",
  components: {
    MainContainer
  },
};
</script>

<style>
@font-face {
  font-family: "NotoSansKR-Bold";
  src: local("NotoSansKR-Bold"),
    url(./assets/fonts/NotoSansKR-Bold.otf) format("truetype");
}

@font-face {
  font-family: "NotoSansKR-Medium";
  src: local("NotoSansKR-Medium"),
    url(./assets/fonts/NotoSansKR-Medium.otf) format("truetype");
}

@font-face {
  font-family: "NotoSansKR-Regular";
  src: local("NotoSansKR-Regular"),
    url(./assets/fonts/NotoSansKR-Regular.otf) format("truetype");
}



body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}
</style>
