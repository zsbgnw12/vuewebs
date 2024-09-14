<script setup lang='ts' name="chat">
import type { Ref } from 'vue'
import { computed, onMounted, onBeforeMount, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NAutoComplete, NButton, NInput, useDialog, useMessage } from 'naive-ui'
import html2canvas from 'html2canvas'
import { Message } from './components'
import { useScroll } from '@/hooks/useScroll'
import { useChat } from '@/hooks/useChat'
import { useCopyCode } from '@/hooks/useCopyCode'
import { HeaderComponent } from '@/components/common'
import { HoverButton } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useChatStore, useShareStore } from '@/store'

import { t } from '@/locales'


let url: string

const route = useRoute()
const dialog = useDialog()
const ms = useMessage()

const chatStore = useChatStore()
const shareStore = useShareStore()
useCopyCode()

const { isMobile } = useBasicLayout()
//getChatByUuidAndIndex
const { addChat, updateChat, updateChatSome } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()

// 路由地址的uuid，通过这个去本地找对应的聊天记录
const { uuid } = route.params as { uuid: string }

const dataSources = computed(() => chatStore.getChatByUuid(+uuid))

// 获取机器人的对话信息
const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !!item.conversationOptions)))
const prompt = ref<string>('')
const loading = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)

// 未知原因刷新页面，loading 状态不会重置，手动重置
dataSources.value.forEach((item, index) => {
	if (item.loading)
		updateChatSome(+uuid, index, { loading: false })
})

// socket初始化
let socket: WebSocket

let message: any

function webSocketInit(path: string) {
	let beforeText = ''
	socket = new WebSocket(path);

	// 打开事件
	socket.onopen = function (e) {
		console.log('连接打开')
	}
	socket.onclose = function (e) {
		console.log('连接关闭');
		updateChatSome(+uuid, dataSources.value.length - 1, { loading: false })
		loading.value = false
	};

	socket.onerror = function (e) {
		loading.value = false
	};

	// 接收消息事件
	socket.onmessage = function (msg) {
		// 过滤信息
		if (msg.data !== 'end') {
			//响应的实际消息
			const responseText = msg.data
			const msgs = message
			let options: Chat.ConversationRequest = {}
			try {
				const data = responseText //JSON.parse(chunk)
				updateChat(
					+uuid,
					dataSources.value.length - 1,
					{
						dateTime: new Date().toLocaleString(),
						text: beforeText + (responseText ?? ''),
						inversion: false,
						error: false,
						loading: true,
						conversationOptions: { conversationId: String(data.timeStamp), parentMessageId: String(data.timeStamp) },
						requestOptions: { prompt: msgs, options: { ...options } },
					},
				)
				// 保存这一次的机器人对话，用于下次对话时使用
				beforeText = conversationList.value[conversationList.value.length - 1].text

				scrollToBottomIfAtBottom()
			}
			catch (error) {
				//
			}
		} else {
			updateChatSome(+uuid, dataSources.value.length - 1, { loading: false })
			loading.value = false
			beforeText = ''

			const str = conversationList.value[conversationList.value.length - 1].text;

			const regex = /\[.*?\]/;
			const matc = regex.exec(str);
			if (matc) {
				shareStore.setNewList(JSON.parse(matc[0]))
			}
			// socket.close()
		}
	}


}

// webSocket方法
function sendData() {
	message = prompt.value
	if (loading.value)
		return

	if (!message || message.trim() === '')
		return

	addChat(
		+uuid,
		{
			dateTime: new Date().toLocaleString(),
			text: message,
			inversion: true,
			error: false,
			conversationOptions: null,
			requestOptions: { prompt: message, options: null },
		},
	)
	scrollToBottom()

	loading.value = true
	prompt.value = ''
	let options: Chat.ConversationRequest = {}

	//初始化机器人对话
	addChat(
		+uuid,
		{
			dateTime: new Date().toLocaleString(),
			text: '',
			loading: true,
			inversion: false,
			error: false,
			conversationOptions: null,
			requestOptions: { prompt: message, options: { ...options } },
		},
	)

	scrollToBottom()
	socket.send(message)
	socket.addEventListener('open', function () {
		console.log('发送消息')
		socket.send(message)


	})
}

// 提交时的方法
function handleSubmit() {
	// if(socket.readyState == 3)
	// 	webSocketInit(url)
	sendData()
}


// 导出为图片
function handleExport() {
	// 在响应或者聊天数据为空时，导出操作不可做
	if (loading.value || dataSources.value.length === 0)
		return

	const d = dialog.warning({
		title: t('chat.exportImage'),
		content: t('chat.exportImageConfirm'),
		positiveText: t('common.yes'),
		negativeText: t('common.no'),
		onPositiveClick: async () => {
			try {
				d.loading = true
				const ele = document.getElementById('image-wrapper')
				const canvas = await html2canvas(ele as HTMLDivElement, {
					useCORS: true,
				})
				const imgUrl = canvas.toDataURL('image/png')
				const tempLink = document.createElement('a')
				tempLink.style.display = 'none'
				tempLink.href = imgUrl
				tempLink.setAttribute('download', 'chat-shot.png')
				if (typeof tempLink.download === 'undefined')
					tempLink.setAttribute('target', '_blank')

				document.body.appendChild(tempLink)
				tempLink.click()
				document.body.removeChild(tempLink)
				window.URL.revokeObjectURL(imgUrl)
				d.loading = false
				ms.success(t('chat.exportSuccess'))
				Promise.resolve()
			}
			catch (error: any) {
				ms.error(t('chat.exportFailed'))
			}
			finally {
				d.loading = false
			}
		},
	})
}
// 删除某条聊天记录
function handleDelete(index: number) {
	if (loading.value)
		return

	dialog.warning({
		title: t('chat.deleteMessage'),
		content: t('chat.deleteMessageConfirm'),
		positiveText: t('common.yes'),
		negativeText: t('common.no'),
		onPositiveClick: () => {
			chatStore.deleteChatByUuid(+uuid, index)
		},
	})
}
// 清空聊天记录
function handleClear() {
	if (loading.value || dataSources.value.length === 0)
		return

	dialog.warning({
		title: t('chat.clearChat'),
		content: t('chat.clearChatConfirm'),
		positiveText: t('common.yes'),
		negativeText: t('common.no'),
		onPositiveClick: () => {
			chatStore.clearChatByUuid(+uuid)
		},
	})
}

function handleEnter(event: KeyboardEvent) {
	if (!isMobile.value) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			handleSubmit()
		}
	}
	else {
		if (event.key === 'Enter' && event.ctrlKey) {
			event.preventDefault()
			handleSubmit()
		}
	}
}
const handleFocus = () => {
	// webSocketInit(url)
}

// 手动停止查询操作
function handleStop() {
	if (loading.value && socket != null) {
		socket.close()
		loading.value = false

	}
}

const placeholder = computed(() => {
	if (isMobile.value)
		return t('chat.placeholderMobile')
	return t('chat.placeholder')
})

const buttonDisabled = computed(() => {
	return loading.value || !prompt.value || prompt.value.trim() === ''
})

const footerClass = computed(() => {
	let classes = ['p-4']
	if (isMobile.value)
		classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
	return classes
})

onBeforeMount(() => {
	url = `ws://${window.location.host}/ws/chat?code=123123`
}),

	onMounted(async () => {
		scrollToBottom()
		webSocketInit(url)
		const str = conversationList.value[conversationList.value.length - 1].text;

		const regex = /\[.*?\]/;
		const matc = regex.exec(str);
		if (matc) {
			shareStore.setNewList(JSON.parse(matc[0]))
		}
	})

onUnmounted(() => {
	if (socket != null)
		socket.close()
})
</script>

<template>
	<div class="flex flex-col w-full h-full">
		<HeaderComponent v-if="isMobile" @export="handleExport" />
		<main class="flex-1 overflow-hidden">
			<div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
				<div id="image-wrapper" class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
					:class="[isMobile ? 'p-2' : 'p-4']">
					<template v-if="!dataSources.length">
						<div class="flex items-center justify-center mt-4 text-center text-neutral-300">
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="mr-2 text-3xl">
								<path fill="#e5e7eb"
									d="M16 16a3 3 0 1 1 0 6a3 3 0 0 1 0-6M6 12a4 4 0 1 1 0 8a4 4 0 0 1 0-8m8.5-10a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11" />
							</svg>
							<span>Aha~</span>
						</div>
					</template>
					<template v-else>
						<div>
							<Message v-for="(item, index) of dataSources" :key="index" :date-time="item.dateTime" :text="item.text"
								:prompt="item" :uuid="uuid" :index="index" :inversion="item.inversion" :error="item.error"
								:loading="item.loading" @delete="handleDelete(index)" />
							<div class="sticky bottom-0 left-0 flex justify-center">
								<!-- 手动暂停 loading -->
								<NButton v-if="false" type="warning" @click="handleStop">
									<template #icon>
										<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
											<path fill="#fff"
												d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16M9 9h6v6H9z" />
										</svg>
									</template>
									Stop Responding
								</NButton>
							</div>
						</div>
					</template>
				</div>
			</div>
		</main>
		<footer :class="footerClass">
			<div class="w-full max-w-screen-xl m-auto">
				<div class="flex items-center justify-between space-x-2">
					<div class="flex flex-col">
						<div class="flex flex-row justify-end">
							<HoverButton @click="handleClear">
								<span class="text-xl text-[#4f555e] dark:text-white">
									<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
										<path fill="#707070"
											d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm1 2H6v12h12zm-9 3h2v6H9zm4 0h2v6h-2zM9 4v2h6V4z" />
									</svg>
								</span>
							</HoverButton>
							<HoverButton v-if="!isMobile" @click="handleExport">
								<span class="text-xl text-[#4f555e] dark:text-white">
									<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
										<path fill="#616161"
											d="M13 10h5l-6 6l-6-6h5V3h2zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2z" />
									</svg>
								</span>
							</HoverButton>
						</div>
					</div>
					<div class="w-4/5">
						<NAutoComplete v-model:value="prompt">
							<template #default="{ handleInput, handleBlur }">
								<NInput ref="inputRef" v-model:value="prompt" type="textarea" :placeholder="placeholder"
									:autosize="{ minRows: 4, maxRows: isMobile ? 4 : 8 }" @input="handleInput" @focus="handleFocus"
									@blur="handleBlur" @keypress="handleEnter" />
							</template>
						</NAutoComplete>
					</div>
					<NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
						<template #icon>
							<span class="dark:text-black">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<path fill="#fff"
										d="M1.946 9.315c-.522-.174-.527-.455.01-.634L21.044 2.32c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8l-8 6z" />
								</svg>
							</span>
						</template>
					</NButton>
				</div>
			</div>
		</footer>
	</div>
</template>
