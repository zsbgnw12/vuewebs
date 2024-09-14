/**
 * 转义 HTML 字符
 * @param source
 */
export function encodeHTML(source: string) {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 判断是否为代码块
 * @param text
 */
export function includeCode(text: string | null | undefined) {
  const regexp = /^(?:\s{4}|\t).+/gm
  return !!(text?.includes(' = ') || text?.match(regexp))
}

/**
 * 复制文本
 * @param options
 */
export function copyText(options: { text: string; origin?: boolean }) {
  const props = { origin: true, ...options }

  let input: HTMLInputElement | HTMLTextAreaElement

  if (props.origin)
    input = document.createElement('textarea')
  else
    input = document.createElement('input')

  input.setAttribute('readonly', 'readonly')
  input.value = props.text
  document.body.appendChild(input)
  input.select()
  if (document.execCommand('copy'))
    document.execCommand('copy')
  document.body.removeChild(input)
}

/**
 * 时间格式化
 */
export function formatDate(date: Date) {
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let day = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);
	let second = ("0" + date.getSeconds()).slice(-2);

	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}


export function formatDate1(dateStr: string, fmt: string): string {
	const date = new Date(dateStr);
	const o: Record<string, number> = {
			'y+': date.getFullYear(),
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'H+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds(),
			'S+': date.getMilliseconds()
	};

	for (const k of Object.keys(o) as Array<keyof typeof o>) {
			if (new RegExp(`(${k})`).test(fmt)) {
					const str = o[k] + '';
					fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : str.padStart(RegExp.$1.length, '0'));
			}
	}

	return fmt;
}


