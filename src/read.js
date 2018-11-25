const KEY = "ShiningLiveData";

// class definition
class Idol {
    constructor(id){
        const str = localStorage.getItem(KEY);
        if (str == null) return; 
        const idols = JSON.parse(str);
        const idol = idols[id];
        if (idol == null) return; 
        this.data = idol;
        this.ID = idol.ID;
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
const TeamNumber = 7;
const Attributes = ["Star", "Shine", "Dream"];
const Types = ["None", "Dance", "Vocal", "Act"];
const MainSkillLevels = ["50", "53", "56", "60", "63", "66", "70"];

// main
// drop down box
{
    SetOptions("type", Types);
    SetOptions("mainskilllevel", MainSkillLevels, "60");
    let elements = Array.from(document.getElementsByTagName("select"));
    elements.forEach(n => n.onchange = Caluculate);
}
//radio button
{
    let elements = document.getElementsByClassName("attribute");
    for (let element of elements) {
        Attributes.forEach(attribute => {
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
        });
    }
}

function SetOptions(classname, array, defaultValue) {
    let elements = document.getElementsByClassName(classname);
    for (let element of elements) {
        let opt = "";
        array.forEach(item => {
            if (item === defaultValue) {
                opt += "<option value='" + item + "' selected>" + item + "</option>";
            } else {
                opt += "<option value='" + item + "'>" + item + "</option>";
            }
        });
        element.innerHTML = opt;
    }
}

// sotable list
function Start() {
    Sortable.create(list1, {
        group: "idol", animation: 100,
        onSort: _ => {
            Sort();
            Caluculate();
            CaluculateSkills();
        }
    });

    Sortable.create(list2, {
        group: "idol", animation: 100,
        onSort: _ => {
            Sort();
            Caluculate();
            CaluculateSkills();
        }
    });

    const array = getIdolArray();
    let insert = "";
    array.forEach(item => {
        insert += "<table><tr>"
        insert += "<td><input type=\"checkbox\" name=remove value=\"" + item.ID + "\"></td>";
        insert += "<td class=\"idolName\" id=" + item.ID + ">" + item.Name + "</td>";
        insert += "<td>" + item.Attribute + "</td>";
        insert += "<td>" + item.Dance + "</td>";
        insert += "<td>" + item.Vocal + "</td>";
        insert += "<td>" + item.Act + "</td>";
        insert += "<td class=\"idolSkill\">" + item.Skill + "</td>";
        insert += "<td>" + item.SkillLevel + "</td>";
        insert += "<td class=\"idolSkill\">" + item.SubSkill + "</td>";
        insert += "<td>" + item.SubSkillLevel + "</td>";
        insert += "</tr></table>\n";
    });
    list1.innerHTML = insert;
    list2.innerHTML = "";
    Sort();
}

function Sort() {
    let list1 = document.getElementById("list1");
    let list2 = document.getElementById("list2");
    const all = Array.from(list1.children).concat(Array.from(list2.children));
    let str = "";
    for (let index = 0; index < TeamNumber; index++) {
        str += "<table>" + all[index].innerHTML + "</table>\n";
    }
    list1.innerHTML = str;
    str = "";
    for (let index = TeamNumber; index < all.length; index++) {
        str += "<table>" + all[index].innerHTML + "</table>\n";
    }
    list2.innerHTML = str;
}

function getIdolArray() {
    let array = [];
    for (let id = 0; ; id++) {
        const idol = new Idol(id);
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

// create button
{
    const createBtn = document.getElementById("createBtn");
    createBtn.onclick = function () {
        const getStr = localStorage.getItem(KEY);
        let idols = JSON.parse(getStr);

        let newIdol = {};
        newIdol["ID"] = idols.length;
        newIdol["Name"] = document.getElementById("create-name").value;
        newIdol["Attribute"] = document.getElementById("create-attribute").value;
        newIdol["Dance"] = String(document.getElementById("create-dance").value);
        newIdol["Vocal"] = String(document.getElementById("create-vocal").value);
        newIdol["Act"] = String(document.getElementById("create-act").value);
        newIdol["Skill"] = document.getElementById("create-skill").value;
        newIdol["SkillLevel"] = String(document.getElementById("create-skilllevel").value);
        newIdol["SubSkill"] = document.getElementById("create-subskill").value;
        newIdol["SubSkillLevel"] = String(document.getElementById("create-subskilllevel").value);
        
        idols.push(newIdol);
        const setStr = JSON.stringify(idols)
        localStorage.setItem(KEY, setStr);
        Start();
    };
}

// delete button
{
    const removeBtn = document.getElementById("removeBtn");
    removeBtn.onclick = function () {
        const removeIdols = Array.from(document.getElementsByName("remove"))
                               .filter( value => value.checked === true );
        const getStr = localStorage.getItem(KEY);
        let idols = JSON.parse(getStr);

        removeIdols.forEach(removeIdol => { 
            idols = idols.filter(n => n.ID !== Number(removeIdol.value));
        });
        idols.forEach((idol, index) => idol.ID = index);
        const setStr = JSON.stringify(idols)
        localStorage.setItem(KEY, setStr);
        Start();
    };
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
        reader.onload = function() { 
            saveReadData(reader.result);
            Start();
        };
 
        // ファイル読み取りを実行
        reader.readAsText(fileData, 'Shift_JIS');
    }, false);
}

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

// skills
function CaluculateSkills() {
    const elements = Array.from(document.getElementsByClassName("idolName")).filter((n, i) => i < 7);
    let skills = [], subskills = [];
    elements.forEach(element => {
        const idol = new Idol(element.id)
        if (idol.Skill in skills == true) {
            skills[idol.Skill] += Number(idol.SkillLevel);
        } else {
            skills[idol.Skill] = Number(idol.SkillLevel);
        }
        if (idol.SubSkill in subskills == true) {
            subskills[idol.SubSkill] += Number(idol.SubSkillLevel);
        } else {
            subskills[idol.SubSkill] = Number(idol.SubSkillLevel);
        }
    });
    let str = "";
    for (let skill in skills) {
        str += "<div>" + skill + ":" + skills[skill] + "</div>\n";
    }
    document.getElementById("skills").innerHTML = str;
    str = "";
    for (let skill in subskills) {
        str += "<div>" + skill + ":" + subskills[skill] + "</div>\n";
    }
    document.getElementById("subskills").innerHTML = str;
}

// calculate total
function Caluculate() {
    let elements = Array.from(document.getElementsByClassName("idolName")).filter((n, i) => i < 7);
    let total = 0;
    elements.forEach(element => {
        let idol = new Idol(element.id)
        total += idol.Dance + idol.Vocal + idol.Act;
        total += getMainSkillBonus(idol);
        total += getFriendSkillBonus(idol);
        total += getAttributeBonus(idol);
        total += getEventBonus(idol);
    });
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

Start();
Caluculate();
CaluculateSkills();

//TODO: スキル、サブスキル合計を表示
//TODO: ブロマイドの追加・削除
//TODO: フィルター機能