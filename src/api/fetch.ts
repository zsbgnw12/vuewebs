interface IFetchStreamOptions {
  url: string;
  requestInit: RequestInit;
  onmessage: (data: string[], index: number) => void;
  ondone?: () => void
  onerror?: (response: Response) => void
  ontimeout?: () => void
}

export default class FetchStream {
  url: string;
  requestInit: RequestInit;
  onmessage: IFetchStreamOptions['onmessage'];
  ondone: IFetchStreamOptions['ondone'];
  onerror: IFetchStreamOptions['onerror'];
  ontimeout?: () => void
  //手动终端查询
  controller: AbortController | null = null
  timer: number = 0

  constructor(options: IFetchStreamOptions) {
    this.url = options.url
    this.requestInit = options.requestInit
    this.onmessage = options.onmessage
    this.ondone = options.ondone
    this.onerror = options.onerror
    this.createFetchRequest()
  }

  createFetchRequest() {
    this.controller = new AbortController()
    this.timeout()
    fetch(this.url, {
      method: 'POST',
      signal: this.controller.signal, 
      ...this.requestInit
    }).then(response => {
      clearTimeout(this.timer); // 拿到结果，清除 timeout 计时器
      if (response.status === 200) {
        return response.body!
      } else {
        return Promise.reject(response)
      }
    }).then(async (readableStream) => {
      // 创建读取流
      const readr = readableStream.getReader()
      // 记录流队列中分块的索引
      let index: number = 0
      while (true) {
        const { value, done } = await readr.read()
        if (done) {
          this.ondone?.()
          break;
        } else {
          const dataText = new TextDecoder().decode(value)
          const data = dataText.split('\n\n').filter(Boolean) as string[]; // response 响应的消息可能存在多个，以 \n\n 分割
          this.onmessage(data, index++);
        }
      }
    }).catch(response => {
      this.onerror?.(response)
    })
  }
  
  // 终止请求的方法
  abort() {
    if (this.controller) this.controller.abort();
  }

  timeout(time: number = 60000) {
    this.timer = window.setTimeout(() => {
      this.abort();
      this.ontimeout?.(); // 外部若传入了监听超时回调，类似 onmessage
    }, time);
  }

}