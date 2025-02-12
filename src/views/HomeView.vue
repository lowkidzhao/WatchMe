<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';


const response = ref(false);

async function callMainProcessMethod() {
  try {
    const result = await window.electronAPI.callMainMethod('Hello from Vue!');
    response.value = result;
  } catch (error) {
    console.error('Error calling main process method:', error);
  }
}
console.log("挂载成功");

</script>

<template>
  <main>
    <v-btn @Click="callMainProcessMethod()">
      获取
    </v-btn>
    <v-progress-circular v-if="response == false" color="primary" indeterminate></v-progress-circular>
    <span>
      {{ response.system }}
    </span>
  </main>
</template>
