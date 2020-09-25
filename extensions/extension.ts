// 类型扩展
// @see extension.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/extensions/extension.ts

String.prototype.clamp = function (start, threshold, suffix = '...') {
    if (this.replace(/[^\x00-\xff]/g, 'xx').length <= threshold) return this;
    let charCount = 0;
    let result = '';
    for (let i = start; i < this.length; i++) {
        charCount += /[^\x00-\xff]/.test(this[i]) ? 2 : 1;
        if (charCount > threshold) return result += suffix;
        result += this[i];
    }
    return result;
};

// String.prototype.translate = function () {
//     // TODO
//     return this;
// };
