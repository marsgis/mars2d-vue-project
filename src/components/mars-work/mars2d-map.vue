<template>
  <div :id="withKeyId" class="mars2d-container"></div>
</template>
<script setup lang="ts">
/**
 * 地图渲染组件
 * @copyright 火星科技 mars2d.cn
 * @author 火星吴彦祖 2022-02-19
 */
import { computed, onBeforeUnmount, onMounted } from "vue"
import * as mars2d from "mars2d"

const props = withDefaults(
  defineProps<{
    url: string;
    mapKey?: string;
    options?: any;
  }>(),
  {
    url: "",
    mapKey: "default",
    options: () => ({})
  }
)

// 用于存放地球组件实例
let map: mars2d.Map // 地图对象

// 使用用户传入的 mapKey 拼接生成 withKeyId 作为当前显示容器的id
const withKeyId = computed(() => `mars2d-container-${props.mapKey}`)

onMounted(() => {
  // 获取配置
  mars2d.Util.fetchJson({ url: props.url }).then((data: any) => {
    initMars3d({
      // 合并配置项
      ...data.mars2d,
      ...props.options
    })
  })
})

// onload事件将在地图渲染后触发
const emit = defineEmits(["onload"])
const initMars3d = (option: any) => {
  map = new mars2d.Map(withKeyId.value, option)

  // map构造完成后的一些处理
  onMapLoad()
  emit("onload", map)
}

// map构造完成后的一些处理
function onMapLoad() {
  // 用于 config.json 中 西藏垭口 图层的详情按钮 演示
  // @ts-ignore
  // window.showPopupDetails = (item: any) => {
  //   alert(item.NAME);
  // };
}

// 组件卸载之前销毁mars2d实例
onBeforeUnmount(() => {
  if (map) {
    map.destroy()
    map = null
  }
  console.log("map销毁完成", map)
})
</script>

<style>
.mars2d-container {
  height: 100%;
  overflow: hidden;
}
.leaflet-tile-container img {
  width: 257px !important;
  height: 257px !important;
}
</style>
