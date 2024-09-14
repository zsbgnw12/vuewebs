<script setup lang="ts">
import { onMounted, ref, h } from "vue"
import { RouterLink, useRoute } from 'vue-router'
import { NMenu } from "naive-ui"
import type { MenuOption } from 'naive-ui'

const route = useRoute()

const menuOptions: MenuOption[] = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/main/home',
					}
				},
				{ default: () => '首页' }
			),
		key: 'home',
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/main/chat'
					}
				},
				{ default: () => 'GPT' }
			),
		key: 'chat',
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						path: '/main/detail'
					}
				},
				{ default: () => '结果' }
			),
		key: 'detail',
	}
]

const activeKey = ref<any>(null)

onMounted(() => {
	activeKey.value = route.name
})
</script>

<template>
	<div class="w-full h-full">
		<n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
		<RouterView />
	</div>
</template>
