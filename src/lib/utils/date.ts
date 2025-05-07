/**
 * 日付を指定されたフォーマットで文字列に変換します
 * @param date 変換する日付
 * @param format フォーマット（デフォルト: 'YYYY-MM-DD'）
 * @param timezone タイムゾーン（デフォルト: 'Asia/Tokyo'）
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (
  date: Date,
  format: string = 'YYYY-MM-DD',
  timezone: string = 'Asia/Tokyo'
): string => {
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values: Record<string, string> = {};
  
  parts.forEach(({ type, value }) => {
    values[type] = value;
  });

  return format
    .replace('YYYY', values.year)
    .replace('MM', values.month)
    .replace('DD', values.day)
    .replace('HH', values.hour)
    .replace('mm', values.minute)
    .replace('ss', values.second);
};

/**
 * 日付が今日かどうかを判定します
 * @param date 判定する日付
 * @param timezone タイムゾーン（デフォルト: 'Asia/Tokyo'）
 * @returns 今日の場合はtrue
 */
export const isToday = (date: Date, timezone: string = 'Asia/Tokyo'): boolean => {
  const today = new Date();
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(date) === formatter.format(today);
};

/**
 * 日付の差分を計算します
 * @param date1 日付1
 * @param date2 日付2
 * @param unit 単位（'days' | 'hours' | 'minutes' | 'seconds'）
 * @returns 指定された単位での差分
 */
export const getDateDiff = (
  date1: Date,
  date2: Date,
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): number => {
  const diff = date1.getTime() - date2.getTime();
  const units = {
    days: 1000 * 60 * 60 * 24,
    hours: 1000 * 60 * 60,
    minutes: 1000 * 60,
    seconds: 1000,
  };
  return Math.floor(diff / units[unit]);
};

/**
 * 日付に指定された日数を加算します
 * @param date 基準日
 * @param amount 加算する量
 * @param unit 単位（'days' | 'hours' | 'minutes' | 'seconds'）
 * @returns 加算後の日付
 */
export const addTime = (
  date: Date,
  amount: number,
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): Date => {
  const result = new Date(date);
  const units = {
    days: (d: Date, a: number) => d.setDate(d.getDate() + a),
    hours: (d: Date, a: number) => d.setHours(d.getHours() + a),
    minutes: (d: Date, a: number) => d.setMinutes(d.getMinutes() + a),
    seconds: (d: Date, a: number) => d.setSeconds(d.getSeconds() + a),
  };
  units[unit](result, amount);
  return result;
};

/**
 * 日付の範囲を生成します
 * @param start 開始日
 * @param end 終了日
 * @param unit 単位（'days' | 'hours' | 'minutes' | 'seconds'）
 * @returns 日付の配列
 */
export const getDateRange = (
  start: Date,
  end: Date,
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): Date[] => {
  const dates: Date[] = [];
  let current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current = addTime(current, 1, unit);
  }

  return dates;
};

/**
 * 日付が有効かどうかを判定します
 * @param date 判定する日付
 * @returns 有効な場合はtrue
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * 日付を日本時間の文字列に変換します
 * @param date 変換する日付
 * @returns 日本時間の文字列
 */
export const toJapaneseDateString = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tokyo',
  }).format(date);
}; 