window.onload = function(){
    document.getElementById("email").focus();
}

function login(){ 
    let user_email = document.getElementById("email").value;
    let user_password = document.getElementById("password").value;
    if(!user_email.includes('@')){
        const user_json = {aceg_jjde_x:user_email,mcor_pdls_x:user_password}
        sendLoginInt(user_json,user_email).then(data=>{
            for(let value of data){
                console.log(value)
            }
        }).catch(error => {
            
        });

    }else {
        const user_json = {email: user_email,password: user_password};
        sendLogin(user_json).then(data => {
            for (let value of data){
                sesion(value.nombres);
                window.location = 'home/index.html';
            }
        }).catch(error => {
            alert("El usuario o la contraseña son incorrectos, por favor intente nuevamente")
            cleanLogin()
        });
    }
 
}

async function sendLoginInt(user_json,user_email){
    const response = await fetch("http://localhost:3050/api/login/",{
        method: 'POST',
        body: JSON.stringify(user_json),
        headers: {
            'Content-Type':'application/json'
        }
    });

    console.log(response.status);
    if(response.status===200){
        sesion(user_email);
        window.location = 'home/index.html';
    }

    const data = await response;
    console.log(data);
    return data;
}



function cleanLogin(){
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

async function sendLogin(user_json){
    const response = await fetch("http://ec2-54-159-11-0.compute-1.amazonaws.com:3050/validate_login/",{
        method: 'POST',
        body: JSON.stringify(user_json),
        headers: {
            'Content-Type':'application/json'
        }
    });

    console.log(response.status);

    const data = await response.json();
    return data;
}

function sesion(user) {
    sessionStorage.clear()
    if (window.sessionStorage) {
        sessionStorage.setItem("user", user);
        var user = sessionStorage.getItem("user");
        //sessionStorage.removeItem("user");
    }
}
