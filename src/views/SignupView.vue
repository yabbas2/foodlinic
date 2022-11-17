<template>
    <TopBar />
    <BottomBar />
    <div class="view-content">
      <Intro h1="Profile" h2="Sign Up" />
      <Signup />
    </div>
    
  </template>
  
  <style scoped>
  .view-content {
    margin-top: 64px;
    margin-bottom: 64px;
  }
  </style>
  
  <script setup>
  import BottomBar from '@/components/BottomBar.vue';
  import TopBar from '@/components/TopBar.vue';
  import Intro from '@/components/Intro.vue';
  import Signup from '@/components/Signup.vue';
  </script>
    