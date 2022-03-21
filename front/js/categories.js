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
                    if (window.confirm("Realmente desea eliminar este usuario?")) {
                        var retrievedObject = localStorage.getItem('usuarioActual');
                        var objetoUsuario = JSON.parse(retrievedObject)
                        fetch('http://localhost:3050/delete_category/' + event.target.textContent, {
                            method: 'DELETE'
            }).then(res => res.json());
                    event.target.remove()
                }, false);
                ul.appendChild(li)
            }
            categories_div.appendChild(ul)
        })
}

function deleteCategory(category) {
    if (window.confirm("¿Realmente desea eliminar esta categoria?")) {
        fetch('http://localhost:3050/delete_category/' + category, {
                method: 'DELETE',
            })
            .then(res => res.text()) // or res.json()
            .then(res => window.location = "./categories.html")
    }
}

function newCategory() {
    window.location = "./createCategory.html"
}

function cancel() {
    window.location = "../producto/productos/productos.html";
}
