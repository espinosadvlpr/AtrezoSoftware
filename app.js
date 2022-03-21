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
/*
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'tcampo'
});
*/

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

app.post('/validate_login',(req,res)=>{
    const sql = `select * from Persona where email="${req.body.email}" and password="${req.body.password}" and tipoPersona="A"`
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Empty');
        }
    });
});

app.post('/password_change',(req,res)=>{
    const sql = `update Persona set password=${req.body.password} where email =${req.body.email}`;
    connection.query(sql, error => {
        if (error) throw error;
        res.send('User password updated!');
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

/**
 * Deveulve un lista de usuarios
 * descriminado por categoria
 */
app.get('/users/:tipoPersona', (req, res) => {
    const { tipoPersona } = req.params;
    const sql = `select idPersona, nombres, Apellidos from Persona where tipoPersona = '${tipoPersona}';`;
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
    console.log("Cantidad a setear: " + req.body.cantidadDisponible);
    if (req.file == null) {
        const sql = `UPDATE Producto 
        SET codigoProducto = ${req.body.codigoProducto}, cantidadDisponible = ${req.body.cantidadDisponible},
        nombreProducto = '${req.body.nombreProducto}', precioDeCompra = ${req.body.precioDeCompra},
        precioDeVenta = ${req.body.precioDeVenta},descripcionProducto = '${req.body.descripcionProducto}', 
        idCategoria = ${req.body.Categoria}
        WHERE codigoProducto = ${req.body.codigoProducto}`;
        connection.query(sql, error => {
            if (error) throw error;
            res.send('Producto actualizado!');
        });
    } else {
        var rutaImagen = req.file.path + '.' + req.file.mimetype.split('/')[1];
        fs.renameSync(req.file.path, rutaImagen);
        const sql = `UPDATE Producto 
        SET codigoProducto = ${req.body.codigoProducto}, cantidadDisponible = ${req.body.cantidadDisponible},
        nombreProducto = '${req.body.nombreProducto}', precioDeCompra = ${req.body.precioDeCompra},
        precioDeVenta = ${req.body.precioDeVenta},descripcionProducto = '${req.body.descripcionProducto}', 
        idCategoria = ${req.body.Categoria}, imagenProducto = '${rutaImagen.split('/')[4]}'
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


/**
 * Lista de todos los productos
 */
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
    if (idCategoria == -1) {
        sql = `SELECT * FROM Producto`;
    } else {
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

/**
 * Lista de ventas en una fecha particular
 */
app.get('/ventas/:fecha', (req, res) => {
    const { fecha } = req.params;
    console.log('Fecha ventas: ' + fecha);
    var sql = `SELECT D.idFactura, P.nombreProducto, (D.cantidad * D.precioProducto) AS SubTotal, F.tipoTransaccion
    FROM Facturas F, Producto P, DetalleFactura D
    WHERE F.idFactura = D.idFactura
    AND D.idProducto = P.codigoProducto
    AND F.fecha = STR_TO_DATE('${fecha}', '%Y-%m-%d');`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            var toClient = res.json(result);
            console.log("ventas enviadas!!");
        } else {
            res.send('Not result');
        }
    });
});

/**
 * 
 */
app.get('/utilidades/:fecha/:tipoTransaccion', (req, res) => {
    let fecha = req.params.fecha;
    let tipoTransaccion = req.params.tipoTransaccion;
    console.log('UTILIDADES: ' + fecha, " Tipo T" + tipoTransaccion);
    var sql = `SELECT SUM(D.cantidad * D.precioProducto) AS Total
    FROM DetalleFactura D, Facturas F
    WHERE D.idFactura = F.idFactura
    AND F.tipoTransaccion = '${tipoTransaccion}'
    AND F.fecha = STR_TO_DATE('${fecha}', '%Y-%m-%d')`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            var toClient = res.json(result);
            console.log("utilidades enviadas!! " + toClient);
        } else {
            let array = `[{
                "Total": 0
            }]`;
            console.log("utilidades NO enviadas!! " + toClient);
            res.send(array);
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

//Categorias
app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM Categoria';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Empty');
        }
    });
});

app.post('/add_category', (req, res) => {
    const sql = 'INSERT INTO Categoria SET ?';

    const category_data = {
        codigoCategoria: req.body.id,
        nombreCategoria: req.body.name
    };
    connection.query(sql, category_data, error => {
        if (error) throw error;
        res.send('Category created!');
    });
});

app.delete('/delete_category/:category', (req, res) => {
    const { category } = req.params;
    const sql = `DELETE FROM Categoria WHERE nombreCategoria= ${category}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Categoria eliminada!');
    });
});

// Facturas
app.get('/bills', (req, res) => {
    const sql = 'SELECT * FROM Facturas';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Empty');
        }
    });
});

app.get('/bills_details', (req, res) => {
    const sql = 'SELECT * FROM Facturas a INNER JOIN  DetalleFactura b\
                on a.idFactura=b.idFactura';

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
 * Agregar una venta o compra requiere de:
 * Crear una factura
 * Insertar en DetalleFactura tantas veces como los porductos vendidos
 * Sincronizar el iventario
 */
app.post('/add_transaction/:idCliente/:tipoTransaccion', (req, res) => {
    let idCliente  = req.params.idCliente;
    let tipoTransaccion = req.params.tipoTransaccion;
    console.log("ADD TRANSACTION: " + idCliente + " -- " + tipoTransaccion);
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    var today = now.getFullYear() + '-' + month + '-' + day;

    var sql1 = '';

    if(idCliente != -1){
        sql1 = `INSERT INTO Facturas(idCliente, fecha, tipoTransaccion) 
        VALUES (${idCliente}  , STR_TO_DATE('${today}', '%Y-%m-%d'), '${tipoTransaccion}')`;
    }else {
        sql1 = `INSERT INTO Facturas(fecha, tipoTransaccion) 
        VALUES (STR_TO_DATE('${today}', '%Y-%m-%d'), '${tipoTransaccion}')`;
    }

    connection.query(sql1, (error, results) => {
        if (error) throw error;
    });

    var sql2 = 'INSERT INTO DetalleFactura(idFactura , idProducto, cantidad, precioProducto) VALUES ';
    listProdu = req.body;
    for (let i = 0; i < listProdu.length; i++) {
        const cProd = listProdu[i];
        sql2 += '((SELECT MAX(idFactura) FROM Facturas)';
        sql2 += ',' + cProd.codigoProducto;
        sql2 += ',' + cProd.cantidadAComprar;
        sql2 += ',' + cProd.precioProd + ')';
        if ((i + 1) == listProdu.length) {
            sql2 += ';';
        } else {
            sql2 += ',';
        }
    }
    console.log(sql2);
    connection.query(sql2, (error, results) => {
        if (error) throw error;
    });

    const sql3 = `call sincInventario('${tipoTransaccion}');`;
    connection.query(sql3, (error, results) => {
        if (error) throw error;
        res.send(`[{
            "respuesta": "Venta o compra agregada e inevtario sincronizado!!"
        }]`);
    });
});

connection.connect(error => {
    if (error) throw error;
    console.log('Database server running!');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
