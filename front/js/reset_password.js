function setPassword(){
    let user_email = document.getElementById("email").value;
    let user_password = document.getElementById("password").value;
    const user_json = {email: user_email,password: user_password};

    fetch("http://54.159.11.0:3050/password_change/",{
        method: 'POST',
        body: JSON.stringify(user_json),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(response => response.json())
        .then(data =>{
            console.log(data)
        })
        .catch(error => console.error('Error:',error));   
}

function load(){
    const input_password = document.getElementById("password").value;
    const input_repeat = document.getElementById("repeat-password").value;

    //input_password.addEventListener("input",password_correct);
    console.log(input_password);
}


function password_correct(){
    var p1 = document.getElementById("password").value;
    var p2 = document.getElementById("repeat-password").value;

    // campos vacios
    if(p1.length == 0 || p2.length == 0){
        alert("los campos no pueden quedar vacios")
        return false;
    }

    //contraseñas coincidan
    if(p1 != p2){
        alert("Las contraseñas deben coincidir");
        return false;
    }else{
        alert("Las contraseñas coinciden");
        return true;
    }
}

function cancel() {
    window.location = "index.html";
}
