<script lang="ts" setup>
import { computed, nextTick } from 'vue'
import { HoverButton } from '@/components/common'
import { useAppStore, useChatStore } from '@/store'

interface Emit {
	(ev: 'export'): void
}



const emit = defineEmits<Emit>()

const appStore = useAppStore()
const chatStore = useChatStore()

const collapsed = computed(() => appStore.siderCollapsed)
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

function handleUpdateCollapsed() {
	appStore.setSiderCollapsed(!collapsed.value)
}

function onScrollToTop() {
	const scrollRef = document.querySelector('#scrollRef')
	if (scrollRef)
		nextTick(() => scrollRef.scrollTop = 0)
}

function handleExport() {
	emit('export')
}


</script>

<template>
	<header
		class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur">
		<div class="relative flex items-center justify-between min-w-0 overflow-hidden h-14">
			<div class="flex items-center">
				<button class="flex items-center justify-center w-11 h-11" @click="handleUpdateCollapsed">
					<template v-if="collapsed">
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path fill="#616161" d="M3 4h18v2H3zm0 15h18v2H3zm0-5h18v2H3zm0-5h18v2H3z" />
						</svg>
					</template>
					<template v-else>
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path fill="#616161" d="M3 4h18v2H3zm4 15h14v2H7zm-4-5h18v2H3zm4-5h14v2H7z" />
						</svg>
					</template>
				</button>
			</div>
			<h1 class="flex-1 px-4 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap"
				@dblclick="onScrollToTop">
				{{ currentChatHistory?.title ?? '' }}
			</h1>
			<div class="flex items-center space-x-2">
				<HoverButton @click="handleExport">
					<span class="text-xl text-[#4f555e] dark:text-white">
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path fill="#616161" d="M13 10h5l-6 6l-6-6h5V3h2zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2z" />
						</svg>
					</span>
				</HoverButton>
			</div>
		</div>
	</header>
</template>
