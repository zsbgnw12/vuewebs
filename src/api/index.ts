import { get, post } from '@/utils/request'

//首页数据获取
export function fetchHomeData() {
	return get<any>({
		url: `/news?news_type=news&code=123123`,
	})
}

//获取详细数据
export function fetchDetailData(data: any) {
	return post<any>({
		url: `/scrape?code=123123`,
		headers: {
			'Content-Type': 'application/json'
		},
		data
	})
}

//登录接口
export function fetchLogin(data: any) {
	return post<any>({
		url: `/api/sysAuth/login`,
		data
	})
}

//获取用户信息
export function fetchUserInfo() {
	return get<any>({
		url: `/api/sysAuth/userInfo`,
		headers: {
			Authorization: localStorage.getItem('token')
		}
	})
}

//获取下载信息
export function fetchDownloadList() {
	return get<any>({
		url: `/data?code=123123`
	})
}

// 下载接口
export function fetchDownload(pid: string) {
	return post<any>({
		url: `/news/transfer?pid=${pid}&code=123123`,
	})
}


