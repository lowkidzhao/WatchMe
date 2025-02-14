<script setup>
import { ref, watch } from 'vue';
import { useComputersStore } from '@/stores/mycomputers';
import { useSnackdataStore } from '@/stores/snackdata';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const store2 = useComputersStore();
const store3 = useSnackdataStore();

// 根据 uuid 获取对应的计算机信息
const uuid = ref(route.params.uuid);



onMounted(() => {
  store2.getCurrentComputer(uuid.value);
});
// 监听路由参数 uuid 的变化
watch(() => route.params.uuid, (newUuid) => {
  uuid.value = newUuid;
  store2.getCurrentComputer(uuid.value);
});
</script>

<template>
  <main>
    <v-skeleton-loader v-if="store2.showWaiting" elevation="12" type="paragraph"></v-skeleton-loader>
    <span v-if="!store2.showWaiting">
      {{ store2.computerNow }}
    </span>
  </main>
</template>
