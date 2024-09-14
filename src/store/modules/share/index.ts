import { defineStore } from "pinia"



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
