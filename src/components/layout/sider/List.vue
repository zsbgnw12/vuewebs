<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { NInput, NPopconfirm, NScrollbar } from 'naive-ui'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'

const { isMobile } = useBasicLayout()

const appStore = useAppStore()
const chatStore = useChatStore()

const dataSources = computed(() => chatStore.history)

async function handleSelect({ uuid }: Chat.History) {
	if (isActive(uuid))
		return

	if (chatStore.active)
		chatStore.updateHistory(chatStore.active, { isEdit: false })
	await chatStore.setActive(uuid)

	if (isMobile.value)
		appStore.setSiderCollapsed(true)
}

function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
	event?.stopPropagation()
	chatStore.updateHistory(uuid, { isEdit })
}

function handleDelete(index: number, event?: MouseEvent | TouchEvent) {
	event?.stopPropagation()
	chatStore.deleteHistory(index)
	if (isMobile.value)
		appStore.setSiderCollapsed(true)
}

const handleDeleteDebounce = debounce(handleDelete, 600)

function handleEnter({ uuid }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
	event?.stopPropagation()
	if (event.key === 'Enter')
		chatStore.updateHistory(uuid, { isEdit })
}

function isActive(uuid: number) {
	return chatStore.active === uuid
}

onMounted(() => {
	//默认选中一个
	const uuid = dataSources.value[0]?.uuid
	if(uuid) {
		chatStore.setActive(uuid)
	}
})
</script>

<template>
	<NScrollbar class="px-4">
		<div class="flex flex-col gap-2 text-sm">
			<template v-if="!dataSources.length">
				<div class="flex flex-col items-center mt-4 text-center text-neutral-300">
					<span>{{ $t('common.noData') }}</span>
				</div>
			</template>
			<template v-else>
				<div v-for="(item, index) of dataSources" :key="index">
					<a class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
						:class="isActive(item.uuid) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
						@click="handleSelect(item)">
						<span>
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
								<path fill="currentColor"
									d="M2 8.994A5.99 5.99 0 0 1 8 3h8c3.313 0 6 2.695 6 5.994V21H8c-3.313 0-6-2.695-6-5.994zM20 19V8.994A4.004 4.004 0 0 0 16 5H8a3.99 3.99 0 0 0-4 3.994v6.012A4.004 4.004 0 0 0 8 19zm-6-8h2v2h-2zm-6 0h2v2H8z" />
							</svg>
						</span>
						<div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
							<NInput v-if="item.isEdit" v-model:value="item.title" size="tiny"
								@keypress="handleEnter(item, false, $event)" />
							<span v-else>{{ item.title }}</span>
						</div>
						<div v-if="isActive(item.uuid)" class="absolute z-10 flex visible right-1">
							<template v-if="item.isEdit">
								<button class="p-1" @click="handleEdit(item, false, $event)">
									<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
										<path fill="currentColor"
											d="M7 19v-6h10v6h2V7.828L16.172 5H5v14zM4 3h13l4 4v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m5 12v4h6v-4z" />
									</svg>
								</button>
							</template>
							<template v-else>
								<button class="p-1">
									<svg @click="handleEdit(item, true, $event)" xmlns="http://www.w3.org/2000/svg" width="1em"
										height="1em" viewBox="0 0 24 24">
										<path fill="currentColor"
											d="M6.414 15.89L16.556 5.748l-1.414-1.414L5 14.476v1.414zm.829 2H3v-4.243L14.435 2.212a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414zM3 19.89h18v2H3z" />
									</svg>
								</button>
								<NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce(index, $event)">
									<template #trigger>
										<button class="p-1">
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
												<path fill="currentColor"
													d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm1 2H6v12h12zm-9 3h2v6H9zm4 0h2v6h-2zM9 4v2h6V4z" />
											</svg>
										</button>
									</template>
									{{ $t('chat.deleteHistoryConfirm') }}
								</NPopconfirm>
							</template>
						</div>
					</a>
				</div>
			</template>
		</div>
	</NScrollbar>
</template>
