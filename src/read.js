const KEY = "ShiningLiveData";

// class definition
class Idol {
    constructor(id){
        let str = localStorage.getItem(KEY);
        let idols = JSON.parse(str);
        let idol = idols[id];
        if (idol == null) return; 
        this.data = idol;
        this.Name = idol.Name;
        this.Attribute = idol.Attribute;
        this.Dance = Number(idol.Dance);
        this.Vocal = Number(idol.Vocal);
        this.Act = Number(idol.Act);
        this.Skill = idol.Skill;
        this.SkillLevel = idol.SkillLevel;
        this.SubSkill = idol.SubSkill;
        this.SubSkillLevel = idol.SubSkillLevel;
    }
}

// constant
const Attributes = ["Star", "Shine", "Dream"];
const Types = ["None", "Dance", "Vocal", "Act"];
const MainSkillLevels = ["50", "53", "56", "60", "63", "66", "70"];

// main
// drop down box
{
    SetOptions("type", Types);
    SetOptions("mainskilllevel", MainSkillLevels, "60");
    let elements = document.getElementsByTagName("select");
    for (let element of elements) {
        element.onchange = Caluculate;
    }
}
//radio button
{
    let elements = document.getElementsByClassName("attribute");
    for (let element of elements) {
        for (let attribute of Attributes) {
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "radio-" + element.id;
            radio.id = radio.name + "-" + attribute;
            radio.value = attribute;
            radio.onchange = Caluculate;
            element.appendChild(radio);
            let label = document.createElement("label");
            label.innerHTML = "<label for=\"" + radio.id + "\">" + attribute + "</label> ";
            element.appendChild(label);
        }
    }
}

function SetOptions(classname, array, defaultValue) {
    let elements = document.getElementsByClassName(classname);
    for (let element of elements) {
        let opt = "";
        for (let item of array) {
            if (item === defaultValue) {
                opt += "<option value='" + item + "' selected>" + item + "</option>";
            } else {
                opt += "<option value='" + item + "'>" + item + "</option>";
            }
        }
        element.innerHTML = opt;
    }
}

// sotable list
{
    Sortable.create(list, { group: "idol", animation: 100, onSort: Caluculate });
    let insert = "";
    let array = getIdolArray();
    for (let id = 0; id < array.length; id++) {
        insert += "<table><tr>"
        insert += "<td class=\"idolName\" id=" + id + ">" + array[id].Name + "</td>";
        insert += "<td class=\"td-at\">" + array[id].Attribute + "</td>";
        insert += "<td class=\"td-d\">" + array[id].Dance + "</td>";
        insert += "<td class=\"td-v\">" + array[id].Vocal + "</td>";
        insert += "<td class=\"td-a\">" + array[id].Act + "</td>";
        insert += "<td class=\"td-s\">" + array[id].Skill + "</td>";
        insert += "<td class=\"td-sl\">" + array[id].SkillLevel + "</td>";
        insert += "<td class=\"td-ss\">" + array[id].SubSkill + "</td>";
        insert += "<td class=\"td-ssl\">" + array[id].SubSkillLevel + "</td>";
        insert += "</tr></table>\n";
    }
    list.innerHTML = insert;
}

function getIdolArray() {
    let array = [];
    for (let id = 0; ; id++) {
        let idol = new Idol(id);
        if (idol.data == null) { break; }
        array.push(idol);
    }
    return array;
}

// button event
// {
//     var button = document.getElementById("button");
//     button.onclick = function () {
//         var result = document.getElementById('result');
//         var id = document.getElementById('id').value;

//         var idolData = new idol(id);
//         // tableで出力
//         var insert = '<table>';
//         insert += '<tr>';
//         for (item in idolData.data) {
//             insert += '<td>' + item + '</td>';
//             insert += '<td>' + idolData.data[item] + '</td>';
//         }
//         insert += '</tr>';
//         insert += '</table>';
//         result.innerHTML = insert;
//     }
// }

function saveReadData(result) {
    // 行単位で配列にする
    var lineArr = result.split('\n');
    // 行と列の二次元配列にする
    var keyArr = lineArr[0].split(',');
    var itemArr = [[]];
    for (var i = 1; i < lineArr.length; i++) {
        itemArr[i-1] = lineArr[i].split(',');
    }

    let id = 0;
    let str = "[ ";
    for (var item of itemArr) {
        if (item.length == keyArr.length) {
            str += "{\"ID\":" + id + ",  "
            for (var i=0; i<keyArr.length; i++) {
                str += JSON.stringify(keyArr[i]) + ":" + JSON.stringify(item[i]);
                if (i != keyArr.length - 1) { str += ", "; }
            }
            str += " }, ";
            id++;
        }
    }
    str = str.slice(0, -2) + " ]";
    localStorage.setItem(KEY, str);
}

// input file
if(window.File) {
    var select = document.getElementById('select');
 
    // ファイルが選択されたとき
    select.addEventListener('change', function(e) {
        // 選択されたファイルの情報を取得
        var fileData = e.target.files[0];
 
        var reader = new FileReader();
        reader.onerror = function() { alert('ファイル読み取りに失敗しました') }
        reader.onload = function() { saveReadData(reader.result) };
 
        // ファイル読み取りを実行
        reader.readAsText(fileData, 'Shift_JIS');
    }, false);
}

// calculate total
function Caluculate() {
    let elements = document.getElementsByClassName("idolName") ;
    let total = 0;
    for (let index = 0; index < 7;index++) {
        let idol = new Idol(elements[index].id)
        total += idol.Dance + idol.Vocal + idol.Act;
        total += getMainSkillBonus(idol);
        total += getFriendSkillBonus(idol);
        total += getAttributeBonus(idol);
        total += getEventBonus(idol);
    }
    let resultElement = document.getElementById("result");
    resultElement.innerHTML = "totalPoint : " + total;
}

function getMainSkillBonus(idol) {
    let reader = new Idol(0);
    if (reader.Attribute !== idol.Attribute) {
        return 0;
    }

    let skill = document.getElementById("main-skill");
    let bonus = Number(document.getElementById("main-skill-level").value);
    switch(skill.value) {
        case "Dance":
            return idol.Dance*bonus*0.01;
        case "Vocal":
            return idol.Vocal*bonus*0.01;
        case "Act":
            return idol.Act*bonus*0.01;
        default:
            return 0;
    }
}

function getFriendSkillBonus(idol) {
    const friend = getRadioAttribute("radio-friend");
    if (friend !== idol.Attribute) {
        return 0;
    }

    const skill = document.getElementById("friend-skill");
    const bonus = Number(document.getElementById("friend-skill-level").value);
    switch(skill.value) {
        case "Dance":
            return idol.Dance*bonus*0.01;
        case "Vocal":
            return idol.Vocal*bonus*0.01;
        case "Act":
            return idol.Act*bonus*0.01;
        default:
            return 0;
    }
}

function getAttributeBonus(idol) {
    const song = getRadioAttribute("radio-song");
    if (song !== idol.Attribute) {
        return 0;
    }
    return (idol.Dance + idol.Vocal + idol.Act) * 0.3;
}

function getRadioAttribute(name) {
    const radios = document.getElementsByName(name);
    for (const radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
}

function getEventBonus(idol) {
    const song = document.getElementById("event-bonus").value;

    switch(song) {
        case "Dance":
            return idol.Dance*2;
        case "Vocal":
            return idol.Vocal*2;
        case "Act":
            return idol.Act*2;
        default:
            return 0;
    }
}
Caluculate();
