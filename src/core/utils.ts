/**
 * 根据最大值和最小值返回范围内随机数值
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
