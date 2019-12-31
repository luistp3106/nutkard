
function generateDate(){
    try{
        let fechaActual = new Date(document.getElementById('date').value);
        fechaActual.setMinutes(fechaActual.getMinutes() + new Date().getTimezoneOffset());
        let horaInicial = parseInt(document.getElementById('hour1').value);
        let minutoInicial = parseInt(document.getElementById('hour2').value);
        let meridianoHora = document.getElementById('hour3').value;
        if (horaInicial === 12 && meridianoHora === 'am') fechaActual.setHours(0);
        else if (horaInicial === 12 && meridianoHora === 'pm') fechaActual.setHours(12);
        else fechaActual.setHours(horaInicial+(meridianoHora==='am'?0:12));
        fechaActual.setMinutes(minutoInicial);
        fechaActual.setSeconds(0);
        return fechaActual;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

function getData(){
    try {
        let list = ['fullName','hour1','hour2','hour3'], state = 0, data = null, missing = [];
        for(let i of list){
            if (!compare(document.getElementById(i).value)) {
                state = 1;
                missing.push({name: document.getElementById(i).getAttribute('name')})
            }
        }
        if (state === 0){
            data = {
                name: document.getElementById('fullName').value,
                date: generateDate()
            }
        }
        else showFaltante(missing);
        return {
            state,
            data
        };
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

function setCita(){
    let result = getData();
    if (result === null) {
        alert('Ha ocurrido un error en el proceso');
        return;
    }
    if (result.state === 0){
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `http://${location.hostname}:3030/api/setCita`, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                let result = JSON.parse(xhr.responseText);
                if (!result.status) alert(result.message);
                else {
                    alert('Cita creada correctamente');
                    setTimeout(function () {
                        location.reload();
                    },3000);
                }
            }
            else {
                alert('Ha ocurrido un error en el proceso');
            }
        };
        xhr.send(getPostStr(result.data));
    }

}