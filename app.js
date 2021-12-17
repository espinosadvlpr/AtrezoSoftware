const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3050;
const app = express();
//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/front"));

// Conexion MySql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'santiago',
    password: 'abC@1534',
    database: 'tcampo'
});

app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

//CORS-Access
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

// Usuarios
app.get('/user', (req, res) => {
    const sql = 'SELECT * FROM Persona';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Empty');
        }
    });
});

app.get('/categorias', (req, res) => {
    const sql = 'select * from Categoria';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Empty');
        }
    });
});

app.get('/admin', (req, res) => {
    const sql = 'SELECT * FROM Persona WHERE tipoPersona = "A"';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Empty');
        }
    });
});

app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Persona WHERE idPersona = ${id}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    });
});

app.post('/add_user', (req, res) => {
    const sql = 'INSERT INTO Persona SET ?';

    const user_data = {
        name: req.body.name // faltan datos
    };

    connection.query(sql, user_data, error => {
        if (error) throw error;
        res.send('User created!');
    });
});

app.put('/update_user/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sql = `UPDATE Persona SET nombres = '${name}'`; //mejorar query

    connection.query(sql, error => {
        if (error) throw error;
        res.send('User updated!');
    });
});

app.post('/actualizar_producto', (req, res) => {
    console.log(req.body);
    console.log(req.body.codigoProducto);
    console.log(req.body.cantidadDisponible);
    console.log(req.body.nombreProducto);
    console.log(req.body.precioDeCompra);
    console.log(req.body.precioDeVenta);
    console.log(req.body.descripcionProducto);
    console.log(req.body.Categoria);
    console.log(req.body.urlImagen);
    
    const sql = `UPDATE Producto 
    SET codigoProducto = ${req.body.codigoProducto}, cantidadDisponible = ${req.body.cantidadDisponible}, nombreProducto = '${req.body.nombreProducto}', precioDeCompra = ${req.body.precioDeCompra},
    precioDeVenta = ${req.body.precioDeVenta},descripcionProducto = '${req.body.descripcionProducto}', idCategoria = ${req.body.Categoria}, urlImagen = '${req.body.urlImagen}'
    WHERE codigoProducto = ${req.body.codigoProducto}`; 
    connection.query(sql, error => {
        if (error) throw error;
        res.send('Producto actualizado!');
    });
});

app.post('/add_product', (req, res) => {
    const sql = 'INSERT INTO Producto SET ?';

    const product_data = {
        codigoProducto: req.body.codigoProducto,
        cantidadDisponible: req.body.cantidadDisponible,
        nombreProducto: req.body.nombreProducto,
        precioDeCompra: req.body.precioDeCompra,
        precioDeVenta: req.body.precioDeVenta,
        descripcionProducto: req.body.descripcionProducto,
        idCategoria: req.body.Categoria,
        urlImagen: req.body.urlImagen
    };

    connection.query(sql, product_data, error => {
        if (error) throw error;
        res.send('Product creado!');
    });
});


app.delete('/delete_user/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Persona WHERE id= ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('User deleted!');
    });
});


// Productos
app.get('/product', (req, res) => {
    const sql = 'SELECT * FROM Producto';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Empty');
        }
    });
});



app.delete('/delete_product/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Producto WHERE codigoProducto= ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('User deleted!');
    });
});

connection.connect(error => {
    if (error) throw error;
    console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));