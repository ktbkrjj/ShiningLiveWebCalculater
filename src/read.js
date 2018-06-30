import { KEY } from "./define.js";
import { idol } from "./idolData.js";

// File APIに対応しているか確認
if(window.File) {
    var select = document.getElementById('select');
 
    // ファイルが選択されたとき
    select.addEventListener('change', function(e) {
        // 選択されたファイルの情報を取得
        var fileData = e.target.files[0];
 
        var reader = new FileReader();
        // ファイル読み取りに失敗したとき
        reader.onerror = function() {
            alert('ファイル読み取りに失敗しました')
        }
        // ファイル読み取りに成功したとき
        reader.onload = function() {
            // 行単位で配列にする
            var lineArr = reader.result.split('\n');
            // 行と列の二次元配列にする
            var keyArr = lineArr[0].split(',');
            var itemArr = [[]];
            for (var i = 1; i < lineArr.length; i++) {
                itemArr[i-1] = lineArr[i].split(',');
            }

            var str="";
            for (var item of itemArr) {
                for (var i=0; i<keyArr.length; i++) {
                  var str = JSON.stringify({ [keyArr[i]]: item[i] }, null, 2);
                  localStorage.setItem(KEY + i, str);
                  console.log(str);
                }
            }
        }
 
        // ファイル読み取りを実行
        reader.readAsText(fileData, 'Shift_JIS');
    }, false);
}

var button = document.getElementById("button");
button.onclick = function() {
    var result = document.getElementById('result');
    var id = document.getElementById('id').value;

    var idolData = new idol(id);
    // tableで出力
    var insert = '<table>';
    insert += '<tr>';
    for (const item of idolData.data) {
        insert += '<td>';
        insert += item;
        insert += '</td>';
    }
    insert += '</tr>';
    insert += '</table>';
    result.innerHTML = insert;
}
