<script setup>
import { ref } from 'vue';
import { useControllersStore } from '@/stores/controllers';

const store = useControllersStore();


</script>

<template>
  <v-speed-dial location="top center" transition="slide-y-reverse-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-fab v-bind="activatorProps" size="large" icon="$vuetify"></v-fab>
    </template>

    <v-btn key="1" icon="$info" @click="store.changedrawer"></v-btn>
    <v-btn key="2" icon="$success"></v-btn>
    <v-btn key="3" icon="$warning"></v-btn>
    <v-btn key="4" icon="$error"></v-btn>
  </v-speed-dial>
</template>

<style scoped>
.v-speed-dial {
  margin-top: 0px;
  margin-right: 5px;
}
</style>
