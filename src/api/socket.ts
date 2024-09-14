class WebSocketInit {
	private socket: WebSocket
	constructor(url: string) {
		this.socket = new WebSocket(url)
	}

	onOpen(callback: () => void) {
		this.socket.onopen = callback
	}
	onMessage(callback:(msg:any) => void) {
		this.socket.onmessage = callback
	}
	onError(callback: () => void) {
		this.socket.onerror = callback
	}
	onClose(callback: () => void) {
		this.socket.onclose = callback
	}
	send(data: string) {
		this.socket.send(data)
	}

}

export default WebSocketInit
