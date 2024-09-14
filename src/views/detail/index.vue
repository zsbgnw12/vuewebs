<script setup lang="ts" name="detail">
import { ref } from 'vue'
import { NDataTable, useMessage } from 'naive-ui'
import { fetchDownloadList } from '@/api'

interface News {
  title: string
  url: string
  content: any
	translate_content: any
}

const message = useMessage()

const pagination = {
	pageSize:24
}

const columns = ref([
	{
		title: '标题',
		key: 'title',
		width: 250,
		resizable: true,
		ellipsis: {
      tooltip: true
    }
	},
	{
		title: '链接',
		key: 'url',
		width: 250,
		resizable: true,
		ellipsis: {
      tooltip: true
    }
	},
	{
		title: '原文',
		key: 'content',
		resizable: true,
		ellipsis: {
      tooltip: true
    }
	},
	{
		title: '译文',
		key: 'translate_content',
		resizable: true,
		ellipsis: {
      tooltip: true
    }
	},
	// {
	// 	title: 'Action',
	// 	key: 'actions',
	// 	render() {
	// 		return h(
	// 			NButton,
	// 			{
	// 				strong: true,
	// 				tertiary: true,
	// 				size: 'small',
	// 				onClick: () => { }
	// 			},
	// 			{ default: () => 'Play' }
	// 		)
	// 	}
	// }
])


const data = ref<News[]>([
	// { title: '111', url: 'Wonderwall', content: '4:18', translate_content: '4:18' },
	// { title: '111', url: 'Wonderwall', content: '4:18', translate_content: '4:18' },
	// { title: '111', url: 'Wonderwall', content: '4:18', translate_content: '4:18' }
])

// 获取下载的数据
fetchDownloadList().then((res:any) => {
	if(res.length > 0) {
		data.value.push(...res)
	} else {
		message.warning('暂无下载数据！')
	}
}).catch((err) => {
	message.error('获取数据失败！')
})

</script>

<template>
	<div class="content">
		<n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="true" :single-line="false"/>
	</div>
</template>

<style lang="less" scoped>
.content {
	width: 98%;
	height: calc(100% - 50px);
	margin: 0 auto;
	border: 2px solid rgb(238, 234, 234);
	border-radius: 8px;
}
</style>
