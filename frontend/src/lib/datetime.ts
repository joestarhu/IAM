import dayjs, { type Dayjs, type ManipulateType, type OpUnitType, type QUnitType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.locale('zh-cn')

export type TimeValue = string | number | Date | Dayjs | null | undefined

/**
 * 项目默认时区
 * 不传时按浏览器本地时区展示
 */
export const DEFAULT_TIMEZONE: string =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai'

/**
 * 判断是否为空值
 */
export function isEmptyTime(value: TimeValue): boolean {
    return value === null || value === undefined || value === ''
}

/**
 * 安全解析时间
 * 支持:
 * - ISO字符串: 2026-03-31T02:01:27.889477Z
 * - 时间戳
 * - Date
 * - dayjs对象
 */
export function parseTime(value: TimeValue): Dayjs | null {
    if (isEmptyTime(value)) return null

    const d = dayjs(value)
    return d.isValid() ? d : null
}

/**
 * 格式化时间
 */
export function formatTime(
    value: TimeValue,
    format: string = 'YYYY-MM-DD',
    fallback: string = '--'
): string {
    const d = parseTime(value)
    if (!d) return fallback
    return d.format(format)
}

/**
 * 按指定时区格式化
 * 适合后端UTC时间转本地时区展示
 */
export function formatTimeByTZ(
    value: TimeValue,
    format: string = 'YYYY-MM-DD HH:mm:ss',
    timezoneName: string = DEFAULT_TIMEZONE,
    fallback: string = '--'
): string {
    if (isEmptyTime(value)) return fallback

    const d = dayjs.utc(value)
    if (!d.isValid()) return fallback

    return d.tz(timezoneName).format(format)
}

/**
 * 日期格式：YYYY-MM-DD
 */
export function formatDate(value: TimeValue, fallback: string = '--'): string {
    return formatTimeByTZ(value, 'YYYY-MM-DD', DEFAULT_TIMEZONE, fallback)
}

/**
 * 日期时间格式：YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(value: TimeValue, fallback: string = '--'): string {
    return formatTimeByTZ(value, 'YYYY-MM-DD HH:mm:ss', DEFAULT_TIMEZONE, fallback)
}

/**
 * 日期时间格式：YYYY-MM-DD HH:mm
 */
export function formatMinute(value: TimeValue, fallback: string = '--'): string {
    return formatTimeByTZ(value, 'YYYY-MM-DD HH:mm', DEFAULT_TIMEZONE, fallback)
}

/**
 * 仅时间：HH:mm:ss
 */
export function formatClock(value: TimeValue, fallback: string = '--'): string {
    return formatTimeByTZ(value, 'HH:mm:ss', DEFAULT_TIMEZONE, fallback)
}


/**
 * 相对时间
 * 例：3分钟前 / 2小时前
 * 超过 3 天则显示 YYYY-MM-DD HH:mm:ss
 */
export function fromNow(
    value: TimeValue,
    fallback: string = "--"
): string {
    const d = parseTime(value)
    if (!d) return fallback

    const diffDays = dayjs().diff(d, "day", true)

    return diffDays <= 3
        ? d.fromNow()
        : d.format("YYYY-MM-DD HH:mm:ss")
}


/**
 * 是否合法时间
 */
export function isValidTime(value: TimeValue): boolean {
    return !!parseTime(value)
}

/**
 * 转为时间戳（毫秒）
 */
export function toTimestamp(value: TimeValue): number | null {
    const d = parseTime(value)
    return d ? d.valueOf() : null
}

/**
 * 获取开始时间
 */
export function startOf(
    value: TimeValue,
    unit: ManipulateType = 'day'
): string | null {
    const d = parseTime(value)
    return d ? d.startOf(unit).toISOString() : null
}

/**
 * 获取结束时间
 */
export function endOf(
    value: TimeValue,
    unit: ManipulateType = 'day'
): string | null {
    const d = parseTime(value)
    return d ? d.endOf(unit).toISOString() : null
}

/**
 * 时间差，单位可选:
 * day / hour / minute / second / month / year
 */
export function diffTime(
    start: TimeValue,
    end: TimeValue,
    unit: QUnitType | OpUnitType = 'day',
    float: boolean = false
): number | null {
    const s = parseTime(start)
    const e = parseTime(end)
    if (!s || !e) return null
    return e.diff(s, unit, float)
}