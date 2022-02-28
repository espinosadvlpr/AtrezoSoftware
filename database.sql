CREATE DATABASE tcampo;
USE tcampo;
-- Database tCampo

CREATE TABLE Categoria (
    codigoCategoria INT NOT NULL PRIMARY KEY,
    nombreCategoria VARCHAR(50) NOT NULL
);
INSERT INTO Categoria VALUES(1, 'Limpiadores');
INSERT INTO Categoria VALUES(1, 'Aceites');

CREATE TABLE Producto (
    codigoProducto BigInt NOT NULL PRIMARY KEY,
    cantidadDisponible INT NOT NULL,
    nombreProducto VARCHAR(50) NOT NULL,
    precioDeCompra DOUBLE,
    precioDeVenta DOUBLE NOT NULL,
    descripcionProducto VARCHAR(50),
    imagenProducto VARCHAR(50),
    idCategoria INT REFERENCES Categoria(codigoCategoria)
);

CREATE TABLE Persona (
    idPersona INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(50),
    Apellidos VARCHAR(50),
    tipoPersona CHAR(1),/*C cliente, A administrador, E empleado*/
    telefono VARCHAR(19),
    email VARCHAR(30),
    direccion VARCHAR(30),
    password VARCHAR(30)
);

INSERT INTO Persona VALUES 
(2,'David Leonardo','Espinosa Ochoa','A','123456','david.espinosa@uptc.edu.co','Clle 1 #2-3','12345');
INSERT INTO Persona VALUES
(1,'Santiago','Sosa Reyes','A','3115078547','santiago.sosa@uptc.edu.co','Clle 1 #2-3','123');
INSERT INTO Persona VALUES
(3,'Lorena','Rios','A','3115078547','lorena.rios@uptc.edu.co','Clle 1 #2-3','123');

DROP TABLE Categoria;
DROP TABLE Producto;
DROP TABLE Persona;

INSERT INTO Categoria VALUES
(3,'Lubricante');

/**
Se puede utilizar para generar una factura
*/
CREATE TABLE Facturas (
    idFactura INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    idCliente INT,
    fecha_hora_factura DATETIME NOT NULL   
);

CREATE TABLE DetalleFactura (
    idDetalle INT NOT NULL AUTO_INCREMENT,
    idFactura INT NOT NULL REFERENCES Facturas(idFactura),
    idProducto INT NOT NULL REFERENCES Producto(codigoProducto),
    cantidad INT NOT NULL,
    precioTotalProducto DOUBLE NOT NULL,
    primary KEY (idDetalle,idFactura)
);