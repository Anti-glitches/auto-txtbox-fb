<template>
  <!-- <Textarea/> -->
  <!-- <ButtonTest/> -->
  <!-- <CardBox/> -->
  <Nav/>
  <router-view/>
</template>
<script>
import Textarea from './components/Textarea.vue';
import ButtonTest from './components/ButtonTest.vue';
import CardBox from './components/CardBox.vue';
import Auth from './components/Auth.vue';
import Nav from './components/Nav.vue';

  export default {
    name: 'App',
    components:{
    Textarea,
    ButtonTest,
    CardBox,
    Auth,
    Nav
}
  }
</script>

