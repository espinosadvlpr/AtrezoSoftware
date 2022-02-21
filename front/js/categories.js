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
                    //TODO: llamar al metodo delete de app.js
                    console.log(event.target.textContent)
                    event.target.remove()
                }, false);
                ul.appendChild(li)
            }
            categories_div.appendChild(ul)
        })
}

function newCategory() {
    window.location = "./createCategory.html"
}

function cancel() {
    window.location = "../producto/productos/productos.html";
}