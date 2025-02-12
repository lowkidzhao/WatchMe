<script setup>
import { useCounterStore } from "@/stores/counter";
import { ref } from 'vue';

const store = useCounterStore();
const response = ref(false);

async function callMainProcessMethod() {
  try {
    const result = await window.electronAPI.callMainMethod('Hello from Vue!');
    response.value = result;
  } catch (error) {
    console.error('Error calling main process method:', error);
  }
}
callMainProcessMethod();
</script>

<template>
  <main>
    <v-btn @Click="store.increment">
      {{ store.count }}
    </v-btn>
    <v-progress-circular v-if="response == false" color="primary" indeterminate></v-progress-circular>
    <span>
      {{ response.system }}
    </span>
  </main>
</template>
