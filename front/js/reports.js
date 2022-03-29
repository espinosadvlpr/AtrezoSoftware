window.onload = validateUser();

function validateUser(){
    if(window.sessionStorage){
        var user = sessionStorage.getItem("user")
        if(user == null){
            window.location = '../index.html'
        }else{
            getUser()
        }
    }
}

function getUser() {
    var h1 = document.getElementById("User")
    if (window.sessionStorage) {
        var user = sessionStorage.getItem("user");
        var bienvenida = "Hola " + user 
        h1.textContent = bienvenida
            //sessionStorage.removeItem("user");
    }
}

let reports = [];

function openReport(){ 
  if(reports[0]==undefined || reports[1]==undefined || reports[2]==undefined){
    alert("El reporte no puede ser cargado debido a que se necesitan seleccionar las 3 opciones.")
  }else{
    document.getElementById("generated_report").style.display="block";
    switch(reports[1]){
        case "categoria":
            getCategoryReport(reports);
          break;
        case "producto":
          break;
        case "venta":
          break;
        case "gasto":
          break;
      }
    }
  console.log(date.value)
  var selected = categories.options[categories.selectedIndex].text;
  console.log(selected)
  console.log(reports[0]+reports[1]+reports[2])
  
}

function getCategoryReport(reports){
  var url = ""
  var body_date = {}
  switch(reports[0]){
    case "diario":
        url="http://localhost:3050/category-report/"+date.value
      body_date = JSON.stringify({
                "end": "end"
            })
      break;
    case "semanal":
        console.log(date.value)
      url="http://localhost:3050/category-report/"+date.value
        body_date = JSON.stringify({
                "end-date": end_date.value
            })
        console.log(body_date)
      break;
    case "mensual":
      var month = date.value[5]+date.value[6]
      url="http://localhost:3050/category-report/"+month
      body_date = JSON.stringify({
                "end": "end"
            })

      break;
  }

    fetch(url, {
            method: 'POST',
            body: body_date,
            headers: {
                "Content-type": "application/json"
            }
        })
    .then(data => {
      for(let value of data) {
        console.log(value);
      }
    })
}

function getProductReport(reports){
  var url = ""
  var body_date = {}
  switch(reports[0]){
    case "diario":
        url="http://localhost:3050/product-report/"+date.value
      body_date = JSON.stringify({
                "end": "end"
            })
      break;
    case "semanal":
        console.log(date.value)
      url="http://localhost:3050/product-report/"+date.value
        body_date = JSON.stringify({
                "end-date": end_date.value
            })
        console.log(body_date)
      break;
    case "mensual":
      var month = date.value[5]+date.value[6]
      url="http://localhost:3050/product-report/"+month
      body_date = JSON.stringify({
                "end": "end"
            })

      break;
  }

    fetch(url, {
            method: 'POST',
            body: body_date,
            headers: {
                "Content-type": "application/json"
            }
        })
    .then(data => {
      for(let value of data) {
        console.log(value);
      }
    })

}

function getSalesReport(reports){
  var url = ""
  var body_date = {}
  switch(reports[0]){
    case "diario":
        url="http://localhost:3050/sale-report/"+date.value
      body_date = JSON.stringify({
                "end": "end"
            })
      break;
    case "semanal":
        console.log(date.value)
      url="http://localhost:3050/sale-report/"+date.value
        body_date = JSON.stringify({
                "end-date": end_date.value
            })
        console.log(body_date)
      break;
    case "mensual":
      var month = date.value[5]+date.value[6]
      url="http://localhost:3050/sale-report/"+month
      body_date = JSON.stringify({
                "end": "end"
            })

      break;
  }

    fetch(url, {
            method: 'POST',
            body: body_date,
            headers: {
                "Content-type": "application/json"
            }
        })
    .then(data => {
      for(let value of data) {
        console.log(value);
      }
    })

}

function getShopReport(reports){
  var url = ""
  var body_date = {}
  switch(reports[0]){
    case "diario":
        url="http://localhost:3050/shop-report/"+date.value
      body_date = JSON.stringify({
                "end": "end"
            })
      break;
    case "semanal":
        console.log(date.value)
      url="http://localhost:3050/shop-report/"+date.value
        body_date = JSON.stringify({
                "end-date": end_date.value
            })
        console.log(body_date)
      break;
    case "mensual":
      var month = date.value[5]+date.value[6]
      url="http://localhost:3050/shop-report/"+month
      body_date = JSON.stringify({
                "end": "end"
            })

      break;
  }

    fetch(url, {
            method: 'POST',
            body: body_date,
            headers: {
                "Content-type": "application/json"
            }
        })
    .then(data => {
      for(let value of data) {
        console.log(value);
      }
    })

}



function closeReport(){
    document.getElementById("generated_report").style.display="none";
  window.location.reload();
}

// pendiente metodos para generar los reportes

google.charts.load('current', {'packages':['corechart']});
google.charts.load('current', {'packages':['line']});

function drawBarChart() {

        // Create the data table.
        var data = google.visualization.arrayToDataTable([
          ['Producto','Cantidad'],
          ['Aceite liqui molly', 35],
          ['Aceite 10w-40', 12],
          ['Limpiador filtro de aire', 11],
          ['Liquidos para motor', 16],
          ['Liquidos refrigerantes', 22]
        ]);


        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,{ calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" }]);
        
        // Set chart options
        var options = {'title':'Reporte productos febrero',
                       'width':700,
                       'height':400
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(view, options);
}

function drawPieChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Producto');
        data.addColumn('number', 'Cantidad');
        data.addRows([
          ['Aceite liqui molly', 35],
          ['Aceite 10w-40', 12],
          ['Limpiador filtro de aire', 11],
          ['Liquidos para motor', 16],
          ['Liquidos refrigerantes', 22]
        ]);

        // Set chart options
        var options = {'title':'Reporte productos febrero',
                       'width':700,
                       'height':400};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
}

function drawLineChart() {

        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses'],
          ['2004',  1000,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ]);

        var options = {
        chart: {
          title: 'Reporte de ventas'
        },
        width: 700,
        height: 400
      };
    

        var chart = new google.charts.Line(document.getElementById('chart_div'));
        chart.draw(data,  google.charts.Line.convertOptions(options));
}

function getCategories(){
  fetch('http://localhost:3050/categories')
        .then(response => response.json())
        .then(data => {
            for (let value of data) {
                li = document.createElement("option")
                li.textContent = value.nombreCategoria
                li.value = value.nombreCategoria
                categories.appendChild(li) 
        }
    })
}

const objetivo = document.querySelector("#chart_div"); 
const categories_div = document.getElementById("choose-category")
const date = document.createElement("input");
const end_date = document.createElement("input");
const categories = document.createElement("select");

// Manejo de seleccion de reportes
$(document).ready(function(){

  getCategories();

  $("#btnCapturar").click(function(){
  html2canvas(objetivo) 
    .then(canvas => {
      let enlace = document.createElement('a');
      enlace.download = "Reporte_generado.png";
      enlace.href = canvas.toDataURL();
      enlace.click();
    });
  });
  $("#diario").click(function () {	 
		  reports[0]="diario";
      date.remove()
      end_date.remove()
      end_date.setAttribute("type","date");
      date.setAttribute("type","date");
      document.getElementById("date-type").append(date);
    });
  $("#semanal").click(function () {	 
			reports[0]="semanal";
      date.remove()
      end_date.remove()
      end_date.setAttribute("type","date");
      date.setAttribute("type","date");
      document.getElementById("date-type").append(date);
      document.getElementById("date-type").append(end_date);
    });
  $("#mensual").click(function () {	 
			reports[0]="mensual";
      date.remove()
      date.setAttribute("type","month");
      end_date.remove();
      document.getElementById("date-type").append(date);
    });
  $("#categoria").click(function () {	 
		  reports[1]="categoria";
    });
  $("#producto").click(function () {	 
			reports[1]="producto";
      categories.remove();
    });
  $("#venta").click(function () {	 
			reports[1]="venta";
      categories.remove();
    });
  $("#gasto").click(function () {	 
			reports[1]="gasto";
      categories.remove();
    });
  $("#pie").click(function () {	 
		  reports[2]="pie";
      google.charts.setOnLoadCallback(drawPieChart);
    });
  $("#bar").click(function () {	 
			reports[2]="bar";
      google.charts.setOnLoadCallback(drawBarChart);
    });
  $("#line").click(function () {	 
			reports[2]="line";
      google.charts.setOnLoadCallback(drawLineChart);
    });
});

