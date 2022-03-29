import mysql.connector


user=input('Digite el usuario de la BD: ')
password=input('Digite la contraseña de la BD: ')

cnx = mysql.connector.connect(user=user, password=password,
                              host='127.0.0.1')

print("Conexion creada correctamente!\n")

database=input('Digite el nombre de la base de datos a crear: ')

cursor = cnx.cursor()

database_sql = f"create database {database}"
use_db_sql=f"use {database}"

# Creacion de la base de datos
try:
    cursor.execute(database_sql)

except mysql.connector.Error as err:
        print("Error creando la base de datos: {}".format(err))
        exit(1)

cursor.execute(use_db_sql)

# Creacion de tablas

table_categoria = """CREATE TABLE Categoria (\
    codigoCategoria INT NOT NULL PRIMARY KEY,\
    nombreCategoria VARCHAR(50) NOT NULL);"""

table_producto = """CREATE TABLE Producto (\
    codigoProducto BigInt NOT NULL PRIMARY KEY,\
    cantidadDisponible INT NOT NULL,\
    nombreProducto VARCHAR(50) NOT NULL,\
    precioDeCompra DOUBLE,\
    precioDeVenta DOUBLE NOT NULL,\
    descripcionProducto VARCHAR(50),\
    imagenProducto VARCHAR(50),\
    idCategoria INT REFERENCES Categoria(codigoCategoria));"""

table_persona = """CREATE TABLE Persona (\
    idPersona INT NOT NULL PRIMARY KEY AUTO_INCREMENT,\
    nombres VARCHAR(50),\
    Apellidos VARCHAR(50),\
    tipoPersona CHAR(1),\
    telefono VARCHAR(19),\
    email VARCHAR(30),\
    direccion VARCHAR(30),\
    password VARCHAR(30));"""

table_facturas = """CREATE TABLE Facturas (\
    idFactura INT NOT NULL PRIMARY KEY AUTO_INCREMENT,\
    idCliente INT,\
    fecha DATE NOT NULL,\
    tipoTransaccion CHAR(1));"""

table_detalle = """CREATE TABLE DetalleFactura (\
    idDetalle INT NOT NULL AUTO_INCREMENT,\
    idFactura INT NOT NULL REFERENCES Facturas(idFactura),\
    idProducto BigInt NOT NULL REFERENCES Producto(codigoProducto),\
    cantidad INT NOT NULL,\
    precioProducto DOUBLE NOT NULL,\
    primary KEY (idDetalle,idFactura));"""


cursor.execute(table_categoria)
cursor.execute(table_producto)
cursor.execute(table_persona)
cursor.execute(table_facturas)
cursor.execute(table_detalle)


# Insertar datos del usuario de ingreso
print('Se realizara la creacion de un usuario por defecto para su ingreso a la app.')
name = input('Digite su(s) nombre(s): ')
last_name = input('Digite su(s) apellido(s): ')
phone = input('Digite su numero de telefono: ')
address = input('Digite su dirección: ')
email = input('Digite su email: ')
passwd = input('Digite su contraseña: ')

add_user = ("INSERT INTO Persona (nombres, Apellidos,tipoPersona,telefono,email,direccion,password) VALUES (%s, %s, %s, %s, %s,%s,%s)")

data_user = (name, last_name, 'A' ,phone,email, address,passwd)

cursor.execute(add_user,data_user)
print('Se creo correctamente el usuario en la BD.\n Gracias por instalar nuestro software.\n ¡Happy coding! :)')


cnx.commit()
cnx.close()
