const asyncForEach = async function forEach(array: any[], callback: (arg0: any, arg1: number, arg2: any) => void) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export default asyncForEach;
