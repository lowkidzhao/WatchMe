<script setup>
import { useCounterStore } from "@/stores/counter";
const store = useCounterStore();
</script>

<template>
  <main>
    <v-btn @Click="store.increment">
      {{ store.count }}
    </v-btn>
  </main>
</template>
