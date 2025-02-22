<script setup>
import { useDataStore } from '@/stores/data';
import { useSnackdataStore } from '@/stores/snackdata';

const dataStore = useDataStore();
const store3 = useSnackdataStore();

// 新增复制功能
const copyToClipboard = async (text, type) => {
  try {
    await navigator.clipboard.writeText(text);
    store3.success(`${type}已复制到剪贴板`);
  } catch (err) {
    store3.error('复制失败，请手动选择文本');
  }
};
</script>

<template>
  <v-container>
    <v-row v-if="dataStore.server?.InstanceSet?.length" class="ma-n4">
      <v-col v-for="(instance, index) in dataStore.server.InstanceSet" :key="index" cols="12" md="6" lg="4">
        <v-card class="ma-4">
          <v-card-title class="d-flex align-center">
            <v-avatar size="40" class="mr-3">
              <v-img :src="instance.BlueprintImageUrl" alt="OS Image" cover>
                <template v-slot:error>
                  <v-icon>mdi-server</v-icon>
                </template>
              </v-img>
            </v-avatar>
            {{ instance.InstanceName }}
          </v-card-title>

          <v-card-text>
            <!-- 基本信息精简版 -->
            <div class="text-caption mb-2 d-flex justify-space-between">
              <div>
                <div>ID: {{ instance.InstanceId }}</div>
                <div>区域: {{ instance.Zone.split('-').slice(0, 2).join('-') }}</div>
                <div>配置: {{ instance.CPU }}核 / {{ instance.Memory }}GB</div>
              </div>
              <div class="d-flex flex-column">
                <v-chip small class="mb-1" color="primary">
                  {{ instance.PlatformType === 'LINUX_UNIX' ? 'Linux' : 'Windows' }}
                </v-chip>
                <v-chip small color="teal">
                  {{ instance.InstanceId.startsWith('lhins-') ? '轻量服务器' : '云服务器' }}
                </v-chip>
              </div>
            </div>

            <!-- 网络信息折叠面板 -->
            <v-expansion-panels variant="accordion">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  网络详情
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="d-flex align-center py-1">
                    <v-icon small class="mr-2">mdi-ip</v-icon>
                    <v-btn variant="text" density="compact"
                      @click.stop="copyToClipboard(instance.PublicAddresses?.[0], '公网IPv4')"
                      :disabled="!instance.PublicAddresses?.[0]">
                      {{ instance.PublicAddresses?.[0] || '无' }}
                    </v-btn>
                    <v-icon small class="ml-1" :color="instance.PublicAddresses?.[0] ? 'primary' : 'grey'"
                      @click.stop="copyToClipboard(instance.PublicAddresses?.[0], '公网IPv4')">
                      mdi-content-copy
                    </v-icon>
                  </div>

                  <div class="d-flex align-center py-1">
                    <v-icon small class="mr-2">mdi-ip-network</v-icon>
                    <v-btn variant="text" density="compact"
                      @click.stop="copyToClipboard(instance.PrivateAddresses?.[0], '内网IP')"
                      :disabled="!instance.PrivateAddresses?.[0]">
                      {{ instance.PrivateAddresses?.[0] || '无' }}
                    </v-btn>
                    <v-icon small class="ml-1" :color="instance.PrivateAddresses?.[0] ? 'primary' : 'grey'"
                      @click.stop="copyToClipboard(instance.PrivateAddresses?.[0], '内网IP')">
                      mdi-content-copy
                    </v-icon>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>

          <v-card-actions class="justify-space-between">
            <div class="d-flex align-center">
              <v-chip label small :color="instance.InstanceState === 'RUNNING' ? 'success' : 'error'" class="mr-2">
                <!-- 原代码中此处缺少闭合标签，添加闭合标签 -->
                {{ instance.InstanceState }}
              </v-chip>
              <span v-if="instance.InstanceState === 'RUNNING'" class="text-caption text-grey">
                到期: {{ instance.ExpiredTime ? new Date(instance.ExpiredTime).toLocaleDateString() : '未知' }}
              </span>
            </div>

            <div class="d-flex align-center">
              <RouterLink :key="instance.InstanceId" :to="`/server/motion/${instance.InstanceId}`">
                <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-chart-line">
                  监控详情
                </v-btn>
              </RouterLink>
              <!-- 原代码中此处缺少闭合标签，添加闭合标签 -->
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" class="mt-4">
      没有找到服务器实例
    </v-alert>
  </v-container>
</template>
<style scoped>
.v-tooltip__content.tooltip-top {
  position: fixed !important;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}
</style>