window.onload = function getCategories() {
    fetch('http://localhost:3050/categories')
        .then(response => response.json())
        .then(data => {
            categories_div = document.getElementById("categories")
            ul = document.createElement("ul")
            for (let value of data) {
                li = document.createElement("li")
                li.textContent = value.nombreCategoria
                li.addEventListener("click", function(event) {
                    console.log(event.target.textContent)
                    // Revisar metodo eliminar cuando la categoria esta asignada
                    if (window.confirm("Realmente desea eliminar esta categoria?")) {
                        var retrievedObject = localStorage.getItem('usuarioActual');
                        var objetoUsuario = JSON.parse(retrievedObject)
                        fetch('http://localhost:3050/delete_category/' + event.target.textContent, {
                            method: 'DELETE'
                        }).then(res => res.json())
                        .catch(error=>console.log(error));
                            event.target.remove()
                    }
            });
            ul.appendChild(li)
            categories_div.appendChild(ul)
        }
    })
}   

function newCategory() {
    window.location = "./createCategory.html"
}

function cancel() {
    window.location = "../producto/productos/productos.html";
}
