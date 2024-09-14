<script setup lang="ts" name="home">
import { ref } from "vue"
import { useMessage, useLoadingBar } from "naive-ui"
import { fetchHomeData, fetchDetailData } from "@/api/index"
import { formatDate1 } from "@/utils/format";
import { PreviewModal } from '@/components/common/'

interface IHomeData {
	Pid: string
	content: string
	content_html: string
	timestamp: string
	title: string
	translate_content: string
	url: string
}

const message = useMessage()
const loadingBar = useLoadingBar()
const newDatas = ref<IHomeData[]>([])
const newTitle = ref<string>("")
const pid = ref<string>("")
const content = ref<string>("")
const show = ref(false)
//获取数据
loadingBar.start()
fetchHomeData().then((res: any) => {
	if (res.length > 0) {
		res[0].map((item: any) => {
			newDatas.value.push(JSON.parse(item))
		})
		// for (const key in res) {
		// 	newDatas.value.push(res[key])
		// }
	} else {
		message.warning("暂无数据！")
	}
	loadingBar.finish()
}).catch((error) => {
	message.error("获取数据失败！")
	loadingBar.finish()
})

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
</script>

<template>
	<div class="news-content p-6 overflow-y-scroll grid grid-cols-5 gap-10">
		<template v-for="item in newDatas">
			<transition name="fade" mode="out-in" appear>
				<div class="item-new p-4 rounded-lg cursor-pointer drop-shadow-md shadow-lg"
					@click="handleItemNew(item.url, item.title)">
					<div class="title"><span>标题：</span>{{ item.title }}</div>
					<div class="time"><span>时间：</span>{{ formatDate1(item.timestamp, 'yyyy-MM-dd HH:mm:ss') }}</div>
					<div class="translate_content"><span>正文：</span>{{ item.translate_content }}</div>
				</div>
			</transition>
		</template>
		<PreviewModal v-model:visible="show" :newTitle="newTitle" :pid="pid" :content="content" />
	</div>
</template>

<style lang="less" scoped>
.news-content {
	width: 98%;
	height: calc(100% - 50px);
	// display: flex;
	// flex-direction: row;
	// flex-wrap: wrap;
	margin: 0 auto;
	border: 2px solid rgb(238, 234, 234);
	border-radius: 8px;

	.item-new {
		// width: 18%;
		height: 200px;
		border: 1px solid rgb(211, 211, 211);

		span {
			font-weight: 600;
		}

		.title {
			width: 100%;
			height: 40px;
			overflow: hidden;
		}

		.time {
			width: 100%;
			height: 24px;
			line-height: 24px;
		}

		.translate_content {
			width: 100%;
			height: calc(100% - 64px);
			overflow: hidden;
		}
	}


	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 1s ease, transform 1s ease; // 添加 transform 过渡
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
		transform: translateX(-30px); // 元素从上方开始
	}

	.fade-enter-to {
		opacity: 1;
		transform: translateX(0); // 元素过渡到正确位置
	}
}
</style>
