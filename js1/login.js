

async function login(){
    try {
        let err = verifyList(['username','password']);
        if (err === 0){
            let username = $("#username").val();
            let password = $("#password").val();
            let r = await ajax2('POST', `https://${location.hostname}:3030/api/login`, {username, password});
            if (r === null) {
                alert("Ha ocurrido un error en el proceso");
                return;
            }
            if (!r.status) alert(r.message);
            else {
                sessionStorage.setItem('token', r.token);
                location.href = "agenda.html";
            }
        }
    }
    catch (e) {
        console.log(e);
        alert("Ha ocurrido un error en el proceso");
    }
}