import { KEY } from './define.js';

export class idol {
    constructor(id){
        var str = localStorage.getItem(KEY + id);
        var obj = JSON.parse(str);

        console.log(obj.Name);
        console.log(obj.Attribute);
        
        this.data = obj;
    }
}
