<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NLayout, NLayoutContent, useLoadingBar, useMessage } from 'naive-ui'
import Sider from './sider/index.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PreviewModal } from '@/components/common/'
import { useAppStore, useShareStore } from '@/store'
import { fetchDetailData } from "@/api/index"

const message = useMessage()
const loadingBar = useLoadingBar()
const newTitle = ref<string>("")
const pid = ref<string>("")
const content = ref<string>("")
const show = ref(false)
const appStore = useAppStore()

const shareStore = useShareStore()

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const newList: any = computed(() => shareStore.getNewList())

const handleItemNew = async (url: string, title: string) => {
	loadingBar.start();
	newTitle.value = title;
	let fetchData = {
		urls: [url],
		id_value: '0'
	};

	fetchDetailData(fetchData).then((res: any) => {
		if (typeof res == "object") {
			if (res[0].error) {
				message.error(res[0].error);
			} else {
				content.value = res[0].translate_content;
				pid.value = res[0].Pid;
				show.value = true;
			}
		} else {
			message.warning("暂无数据！");
		}
		loadingBar.finish();
	}).catch((error) => {
		message.error("获取数据失败！");
		loadingBar.finish();
	});

}


const getMobileClass = computed(() => {
	if (isMobile.value)
		return ['rounded-none', 'shadow-none']
	return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

const getContainerClass = computed(() => {
	return [
		'h-full',
		{ 'pl-[260px]': !isMobile.value && !collapsed.value },
	]
})
</script>

<template>
	<div class="content dark:bg-[#24272e] transition-all flex flex-row" :class="[isMobile ? 'p-0' : 'px-4']">
		<div class="flex-1 overflow-hidden" :class="getMobileClass">
			<NLayout class="z-40 transition" :class="getContainerClass" has-sider>
				<Sider />
				<NLayoutContent class="h-full">
					<RouterView v-slot="{ Component, route }">
						<component :is="Component" :key="route.fullPath" />
					</RouterView>
				</NLayoutContent>
			</NLayout>
		</div>
		<div class="h-full transition-all overflow-y-scroll px-3" style="width:550px" v-if="newList.length > 0">
			<template v-for="item in newList">
				<transition name="fade" mode="out-in" appear>
					<div class="rounded border-2 border-slate-200 border-solid p-2 mb-3 cursor-pointer" @click="handleItemNew(item.link, item.title)">
						<div>{{ item.title }}</div>
						<div class="snippet">{{ item.snippet }}</div>
					</div>
				</transition>
			</template>
		</div>
		<PreviewModal v-model:visible="show" :newTitle="newTitle" :pid="pid" :content="content" />
	</div>
</template>

<style lang="less" scoped>
.content {
	height: calc(100% - 50px)
}

.snippet {
	height: 100px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease, transform 1s ease; // 添加 transform 过渡
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px); // 元素从上方开始
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0); // 元素过渡到正确位置
}
</style>
