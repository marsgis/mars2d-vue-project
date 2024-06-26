<template>
  <mars-dialog :draggable="true" :width="340" :height="600" :position="{ top: 60, right: 10 }">
    <template #title>
      <div class="title">
        <img src="/img/icon/basemap.png" alt="" />
        底图
      </div>
    </template>

    <ul class="basemap">
      <li v-for="(item, i) in baseMaps" :key="i" class="basemap-card" :class="{ 'active-card': active === item.id }"
        @click="changeBaseMaps(item)">
        <img class="icon" :src="`${item.options.icon || 'img/basemaps/bingAerial.png'}`" />
        <div class="name">{{ item.name }}</div>
      </li>
    </ul>
  </mars-dialog>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted, onUnmounted } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import { useWidget } from "@mars/common/store/widget"
import * as mapWork from "./map"

// 启用map.ts生命周期
useLifecycle(mapWork)

const { updateWidget } = useWidget()

const baseMaps = ref<any[]>([])
const active = ref("")
const chkHasTerrain = ref(false)

mapWork.eventTarget.on("mapLoaded", initData)

onUnmounted(() => {
  mapWork.eventTarget.off("mapLoaded", initData)
  updateWidget("toolbar", "manage-basemap")
})

function initData(e: any) {
  baseMaps.value = e.baseMaps.map((m: any) => {
    if (m.isAdded && m.show) {
      active.value = m.id
    }

    return {
      name: m.name,
      id: m.id,
      options: markRaw(m.options)
    }
  })

  chkHasTerrain.value = e.hasTerrain || false
}

function changeBaseMaps(item: any) {
  mapWork.changeBaseMaps((active.value = item.id))
}
</script>

<style lang="less" scoped>
.title {
  width: 50%;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-family: var(--mars-font-family);
}

.basemap {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  justify-content: center;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, 94px);
}

.basemap-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  list-style-type: none;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  color: var(--mars-text-color);
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  padding: 3px 3px 0;
  background: var(--mars-collapse-title-bg);

  &:hover {
    .active-card();
  }

  .icon {
    width: 86px;
    height: 86px;
  }

  .name {
    width: 80px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 7px 0;
  }
}

.active-card {
  color: #337fe5 !important;
  border-color: #337fe5;
}
</style>
