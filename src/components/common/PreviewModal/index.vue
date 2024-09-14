<script setup lang="ts">
import { computed } from 'vue'
import { NModal, useMessage, NButton } from 'naive-ui'
import { fetchDownload } from "@/api/index"
import { useFormatText } from "@/hooks/useFormatText"

interface Props {
  visible: boolean
  newTitle: string
  pid: string
  content: string
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()


const message = useMessage()

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const handleDownload = () => {
  fetchDownload('65bbf52c2970b2863c00e7ef48c7e857').then((res) => {
    show.value = false
    message.success('下载成功')
  }).catch((err) => {
    show.value = false
    message.error('下载失败')
  })
}

const text = computed(() =>{
	if(props.content){
		return useFormatText(props.content)
	} else {
		return ''
	}
})

</script>

<template>
  <n-modal v-model:show="show" preset="card" style="width: 70%; max-width: 640px; margin-top: 200px;">
    <template #header>
      <div>{{ props.newTitle }}</div>
    </template>
    <div v-html="text" class="max-h-96 overflow-y-scroll"/>
    <template #action>
      <n-button type="primary" @click="handleDownload">
        下载
      </n-button>
    </template>
  </n-modal>
</template>
