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

function openReport(){
    document.getElementById("generated_report").style.display="block";
}

function closeReport(){
    document.getElementById("generated_report").style.display="none";
}

// pendiente metodos para generar los reportes

// Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.

function drawChart() {

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
