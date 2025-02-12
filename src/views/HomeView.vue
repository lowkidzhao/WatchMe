<script setup>
import { useCounterStore } from "@/stores/counter";
import { ref } from 'vue';

const store = useCounterStore();
const response = ref('');

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
    <span>
      {{ response.system }}
    </span>
  </main>
</template>
