<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useFormatText } from "@/hooks/useFormatText"

interface Props {
	inversion?: boolean
	error?: boolean
	text?: string
	loading?: boolean
	asRawText?: boolean
}

const props = defineProps<Props>()

const { isMobile } = useBasicLayout()

const textRef = ref<HTMLElement>()

const wrapClass = computed(() => {
	return [
		'text-wrap',
		'min-w-[20px]',
		'rounded-md',
		isMobile.value ? 'p-2' : 'px-3 py-2',
		props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
		props.inversion ? 'dark:bg-[#a1dc95]' : 'dark:bg-[#1e1e20]',
		props.inversion ? 'message-request' : 'message-reply',
		{ 'text-red-500': props.error },
	]
})

const text = computed(() => {
	const value = props.text ?? ''
	if (!props.asRawText)
		return useFormatText(value)
	return value
})
const loading = computed(() => {
	return props.loading
})

defineExpose({ textRef })
</script>

<template>
	<div class="text-black" :class="wrapClass">
		<div ref="textRef" class="leading-relaxed break-words">
			<div v-if="!inversion">
				<div>
					<div v-if="!asRawText" class="markdown-body" v-html="text" />
					<div v-else class="whitespace-pre-wrap" v-html="text" />
				</div>
			</div>
			<div v-else class="whitespace-pre-wrap" v-html="text" />
			<template v-if="loading">
				<span class="dark:text-white w-[4px] h-[20px] block animate-blink" />
			</template>
		</div>
	</div>
</template>

<style lang="less">
@import url(./style.less);
</style>
