<script setup>
import { useSnackdataStore } from '@/stores/snackdata';
import { defineProps, onMounted } from 'vue';

const store = useSnackdataStore();

onMounted(() => {
  if (props.data && props.data.text) {
    store.text = props.data.text;
    store.color1 = props.data.color1;
    store.color2 = props.data.color2;
  }
  if (props.data && props.data.timeout) {
    store.timeout = props.data.timeout;//默认2s
  }
})

// 获取传入的参数
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
});
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