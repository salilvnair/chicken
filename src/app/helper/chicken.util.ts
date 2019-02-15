export class ChickenUtil {

    static remove(array:any[],element:any) {
        var index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    }
}