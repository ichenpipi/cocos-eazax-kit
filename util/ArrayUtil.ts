/**
 * 数组工具
 */
export default class ArrayUtil {

    /**
     * 复制二维数组
     * @param array 目标数组 
     */
    public static copy2DArray(array: any[][]): any[][] {
        let newArray: any[][] = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i].concat());
        }
        return newArray;
    }

    /**
    * Fisher-Yates Shuffle 随机置乱算法
    * @param array 目标数组
    */
    public static fisherYatesShuffle(array: any[]): any[] {
        let count = array.length;
        while (count) {
            let index = Math.floor(Math.random() * count--);
            let temp = array[count];
            array[count] = array[index];
            array[index] = temp;
        }
        return array;
    }

    /**
    * 混淆数组
    * @param array 目标数组
    */
    public static confound(array: []): any[] {
        let result = array.slice().sort(() => Math.random() - .5);
        return result;
    }

    /**
     * 数组扁平化
     * @param array 目标数组
     */
    public static flattening(array: any[]) {
        for (; array.some(v => Array.isArray(v));) {    // 判断 array 中是否有数组
            array = [].concat.apply([], array); // 压扁数组
        }
        return array;
    }

    // /**
    // * 数组去重
    // * @param array 目标数组
    // */
    // public static removeRepeated(array: []): any[] {
    //     let newArray = [...new Set(array)];
    //     return newArray;
    // }

    /**
    * 合并数组
    * @param array1 目标数组1
    * @param array2 目标数组2
    */
    public static combineArrays(array1: any[], array2: any[]): any[] {
        let newArray = [...array1, ...array2];
        return newArray;
    }

    /**
    * 获取随机数组成员
    * @param array 目标数组
    */
    public static getRandomValueInArray(array: any[]): any {
        let newArray = array[Math.floor(Math.random() * array.length)];
        return newArray;
    }
    
}
