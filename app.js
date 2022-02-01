const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3050;
const app = express();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'front/producto/productos/images' });
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/front"));

// Conexion MySql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Santiago',
    password: 'a123',
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
app.get('/users', (req, res) => {
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
        nombres: req.body.nombres,
        Apellidos: req.body.Apellidos,
        tipoPersona: req.body.Tipo_usuario,
        telefono: req.body.telefono,
        email: req.body.Email,
        direccion: req.body.direccion,
        password: req.body.password
    };
    connection.query(sql, user_data, error => {
        if (error) throw error;
        res.send('User created!');
    });
});

app.post('/update_user', (req, res) => {
    const sql = `UPDATE Persona 
        SET nombres = '${req.body.nombres}', Apellidos = '${req.body.Apellidos}', tipoPersona = '${req.body.Tipo_usuario}',
        telefono = ${req.body.telefono},email = '${req.body.Email}', direccion = '${req.body.direccion}',
        password = '${req.body.password}'
        WHERE idPersona = ${req.body.userID}`; 
        connection.query(sql, error => {
        if (error) throw error;
        res.send('User updated!');
    });
});

app.post('/actualizar_producto', upload.single('imagenProducto'), (req, res) => {
    if(req.file == null){
        const sql = `UPDATE Producto 
        SET codigoProducto = ${req.body.codigoProducto}, cantidadDisponible = ${req.body.cantidadDisponible}, nombreProducto = '${req.body.nombreProducto}', precioDeCompra = ${req.body.precioDeCompra},
        precioDeVenta = ${req.body.precioDeVenta},descripcionProducto = '${req.body.descripcionProducto}', idCategoria = ${req.body.Categoria}
        WHERE codigoProducto = ${req.body.codigoProducto}`; 
        connection.query(sql, error => {
            if (error) throw error;
            res.send('Producto actualizado!');
        });
    }else {
        var rutaImagen = req.file.path + '.' + req.file.mimetype.split('/')[1];
        fs.renameSync(req.file.path, rutaImagen);
        const sql = `UPDATE Producto 
        SET codigoProducto = ${req.body.codigoProducto}, cantidadDisponible = ${req.body.cantidadDisponible}, nombreProducto = '${req.body.nombreProducto}', precioDeCompra = ${req.body.precioDeCompra},
        precioDeVenta = ${req.body.precioDeVenta},descripcionProducto = '${req.body.descripcionProducto}', idCategoria = ${req.body.Categoria}, imagenProducto = '${rutaImagen.split('/')[4]}'
        WHERE codigoProducto = ${req.body.codigoProducto}`; 
        connection.query(sql, error => {
            if (error) throw error;
            res.send('Producto actualizado!');
        });
    }
    
});

app.post('/add_product', upload.single('imagenProducto'), (req, res) => {
    var rutaImagen = req.file.path + '.' + req.file.mimetype.split('/')[1];
    fs.renameSync(req.file.path, rutaImagen);
    const sql = 'INSERT INTO Producto SET ?';
    const product_data = {
        codigoProducto: req.body.codigoProducto,
        cantidadDisponible: req.body.cantidadDisponible,
        nombreProducto: req.body.nombreProducto,
        precioDeCompra: req.body.precioDeCompra,
        precioDeVenta: req.body.precioDeVenta,
        descripcionProducto: req.body.descripcionProducto,
        imagenProducto: rutaImagen.split('/')[4],
        idCategoria: req.body.Categoria
    };

    connection.query(sql, product_data, error => {
        if (error) throw error;
        res.send('Product creado!');
    });
});


app.delete('/delete_user/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Persona WHERE idPersona= ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('User deleted!');
    });
});


// Productos
app.get('/product', (req, res) => {
    const sql = 'SELECT * from Producto;';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Empty');
        }
    });
});

/**
 * Obtener lista de productos pero solo por una categoria
 */
app.get('/product/:idCategoria', (req, res) => {
    const { idCategoria } = req.params;
    var sql = "";
    if(idCategoria == -1){
        sql = `SELECT * FROM Producto`;
    }else {
        sql = `SELECT * FROM Producto WHERE idCategoria = ${idCategoria}`;
    }
    connection.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    });
});

app.delete('/delete_product/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Producto WHERE codigoProducto= ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Producto eliminado!');
    });
});

connection.connect(error => {
    if (error) throw error;
    console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));