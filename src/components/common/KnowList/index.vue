<script setup lang="ts">
import { computed, ref } from "vue"
import { NDrawer, NDrawerContent, NPagination, NInputGroup, NInput, NButton, NSpace } from "naive-ui"


interface Props {
	visible: boolean
}
interface Emit {
	(e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const list: any = ref([])
const pageCount = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchText = ref('')

const show = computed({
	get() {
		return props.visible
	},
	set(visible: boolean) {
		emit('update:visible', visible)
	},
})

async function getKnowledge(page: number, pageSize: number, searchText: string) {
	
}
getKnowledge(page.value, pageSize.value, searchText.value)

const updatePage = (value:number) => {
	page.value = value
  getKnowledge(page.value, pageSize.value, searchText.value)
}
const updatePageSize = (value:number) => {
	pageSize.value = value
	getKnowledge(page.value, pageSize.value, searchText.value)
}

const handleSearch = () => {
	getKnowledge(page.value, pageSize.value, searchText.value)

}
</script>

<template>
	<NDrawer v-model:show="show" :width="610">
		<NDrawerContent :native-scrollbar="false">
			<!-- 搜索框 -->
			<template #header>
				<NSpace justify='space-between' align='center'>
					<span class="w-32">知识库列表</span>
					<n-input-group>
						<n-input :style="{ width: '100%' }" v-model:value="searchText" />
						<n-button type="primary" ghost @click="handleSearch">
							搜索
						</n-button>
					</n-input-group>
				</NSpace>
			</template>
			<template v-for="item in list">
				<div class="w-full pt-5 overflow-hidden break-all text-ellipsis whitespace-nowrap border-b cursor-pointer mb-6"
					:title="item.name">{{ item.name }}</div>
			</template>
			<!-- 翻页 -->
			<template #footer>
				<NPagination v-model:page="page" v-model:page-size="pageSize" :item-count="pageCount" show-size-picker
					:page-sizes="[10, 20, 30, 40]" :on-update:page="updatePage" :on-update:page-size="updatePageSize">
					<template #prefix="{ itemCount }">
						共 {{ itemCount }} 条
					</template>
				</NPagination>
			</template>
		</NDrawerContent>
	</NDrawer>
</template>
