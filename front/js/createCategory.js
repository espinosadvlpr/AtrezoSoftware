function createCategory() {
    fetch('http://localhost:3050/categories')
        .then(response => response.json())
        .then(data => {
            for (let value of data) {
                id = value.codigoCategoria;
            }
            id += 1;
            let name = document.getElementById("category").value;
            sendData(id, name);
        })

    //
}

function sendData(idCategory, nameCategory) {
    fetch('http://localhost:3050/add_category', {
            method: 'POST',
            body: JSON.stringify({
                id: idCategory,
                name: nameCategory
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(function() {
            window.location = "./categories.html";
        })
}

function cancel() {
    window.location = "./categories.html";
}