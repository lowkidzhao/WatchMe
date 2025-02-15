<script setup>
import { useSnackdataStore } from '@/stores/snackdata';
// import { defineProps, onMounted } from 'vue';

const store = useSnackdataStore();

</script>
<template>
  <div class="text-center">
    <v-snackbar v-model="store.snackbar" :timeout="store.timeout" :color="store.color1">
      {{ store.text }}

      <!-- <template v-slot:actions>
        <v-btn :color="store.color2" variant="text" @click="store.snackbar = false">
          关闭
        </v-btn>
      </template> -->
    </v-snackbar>
  </div>
</template>