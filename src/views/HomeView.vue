<script setup>
import { ref } from 'vue';
import { useComputersStore } from '@/stores/mycomputers';
import { useSnackdataStore } from '@/stores/snackdata';
import { onMounted, watch } from 'vue'

const store2 = useComputersStore();
const store3 = useSnackdataStore();



</script>

<template>
  <main>
    <v-skeleton-loader v-if="store2.showWaiting" color="info" type="paragraph"></v-skeleton-loader>
    <span v-if="!store2.showWaiting">
      {{ store2.computerNow }}
    </span>
  </main>
</template>
