<script setup lang='ts'>
import { computed, ref, defineProps, defineEmits } from 'vue'
import { NDropdown } from 'naive-ui'
import AvatarComponent from './Avatar.vue'
import TextComponent from './Text.vue'
import { copyText } from '@/utils/format'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'

interface Props {
	dateTime?: string
	text?: any
	prompt?: any
	inversion?: boolean
	error?: boolean
	loading?: boolean
	uuid?: any
	index?: any,
}

interface Emit {
	(ev: 'regenerate'): void
	(ev: 'delete'): void
}


const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()

const textRef = ref<HTMLElement>()

const asRawText = ref(props.inversion)

const messageRef = ref<HTMLElement>()

const options = computed(() => {
	const common = [
		{
			label: t('chat.copy'),
			key: 'copyText',
		},
		{
			label: t('common.delete'),
			key: 'delete',
		},
	]
	return common
})


function handleSelect(key: 'copyText' | 'delete' | 'toggleRenderType') {
	switch (key) {
		case 'copyText':
			copyText({ text: props.text ?? '' })
			return
		case 'toggleRenderType':
			asRawText.value = !asRawText.value
			return
		case 'delete':
			emit('delete')
	}
}

</script>

<template>
	<div ref="messageRef" class="flex w-full mb-6 overflow-hidden" :class="[{ 'flex-row-reverse': inversion }]">
		<div class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
			:class="[inversion ? 'ml-2' : 'mr-2']">
			<AvatarComponent :image="inversion" />
		</div>
		<div class="overflow-hidden text-sm " :class="[inversion ? 'items-end' : 'items-start']">
			<p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
				{{ dateTime }}
			</p>
			<div class="flex items-end gap-1 mt-2" :class="[inversion ? 'flex-row-reverse' : 'flex-row']">
				<TextComponent ref="textRef" :inversion="inversion" :error="error" :text="text" :loading="loading"
					:as-raw-text="asRawText" />
				<div class="flex flex-col">
					<NDropdown v-if="true" :trigger="isMobile ? 'click' : 'hover'" :placement="!inversion ? 'right' : 'left'"
						:options="options" @select="handleSelect">
						<button class="transition text-neutral-300 gap-2 hover:text-neutral-800 dark:hover:text-neutral-200">
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
								<path fill="#c7c7c7"
									d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 14c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0-7c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2" />
							</svg>
						</button>
					</NDropdown>
				</div>
			</div>
		</div>
	</div>
</template>
