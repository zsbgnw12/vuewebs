import { defineStore } from "pinia"

interface newList {
	title: string
	link: string
	snippet: string
}

export const useShareStore = defineStore("share-store", {
	state: () => ({
		//[] as newList[]
		newList: []
	}),
	actions: {
		setNewList(newList: any) {
			this.newList = newList
		},
		getNewList() {
			return this.newList
		},
	}
})
