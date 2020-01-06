function compare(element) {
    return element !== null && element !== '' && typeof element !== "undefined";
}

function showFaltante(missing) {
    let str = 'Faltante: ';
    for(let [index, i] of missing.entries()){
        str += `${i.name}${index < missing.length - 1 ? ', ' : ''}`;
    }
    alert(str);
}

function verifyList(list){
    let status = 0, missing = [];
    for(let i of list){
        if (!compare(document.getElementById(i).value)) {
            status = 1;
            missing.push({name: document.getElementById(i).getAttribute('name')})
        }
    }
    if (status === 1) showFaltante(missing);
    return status;
}

function getPostStr(obj){
    try {
        let str = '';
        for(let i in obj){
            let s = JSON.stringify(obj[i]);
            str += `${i}=${s.substr(1, s.length - 2)}&`;
        }
        return str.substr(0, str.length - 1);
    }
    catch (e) {
        console.log(e);
        return "";
    }
}

function ajax(method, url, data){
    return new Promise(function (resolve) {
        try {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                try {
                    if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                    else resolve(null);
                }
                catch (e) {
                    console.log(e);
                    resolve(null);
                }
            };
            xhr.send(compare(data) ? getPostStr(data) : '');
        }
        catch (e) {
            console.log(e);
            resolve(null);
        }
    });
}

function ajax2(method, url, data) {
    return new Promise(function (resolve) {
        $.ajax ({
            type: method,
            url,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (jsonData, textStatus, xhr) {
                if (xhr.status === 401) location.href = "login.html";
                resolve(jsonData);
            },
            error: function(xhr) {
                if (xhr.status === 401) location.href = "login.html";
                resolve(null);
            }
        });
    });
}
