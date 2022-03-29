# AtrezoSoftware

El software implementado se trata de una plataforma web, que se encarga de realizar las diferentes gestiones a nivel de inventario y ventas en la empresa, ademas cuenta con funcionalidades como gestión de usuarios, gestión de compras a proveedores y gestión de reportes.


## Manual de instalación
Los siguientes programas son necesarios para la instalación del programa:

	• Node
	• Python3
	• MySQL o MariaDB


## Clonar el repositorio

Para clonar el repositorio ejecute el siguiente comando en la terminal de su equipo:

	git clone https://github.com/espinosadvlpr/AtrezoSoftware.git


## Instalacion de node JS

Se debe realizar la instalación de los paquetes de node js con el comando: 

	npm install  
	npm i


De forma opcional se puede instalar el paquete **"nodemon"** de forma global para las pruebas del servidor en desarrollo:

	npm install -g nodemon


## Instalacion de la BD

Para la instalacion de la base de datos se realizara mediante un procedimiento en **Python** para el que se usa la libreria **mysql-connector-python** y se instala con el siguiente comando:

	pip install mysql-connector-python


Teniendo en cuenta que ya debe tener instalado un motor de base de datos como se menciono anteriormente, ejecutar el archivo para la instalación de la base de datos con el comando y siga los pasos: 

	python3 create_database.py


**NOTA:** Debe guardar la configuración que realice en el procedimiento para configurar el servidor posteriormente.


## Configuracion del servidor Express

En el archivo **app.js** debe realizar el cambio de los parametros de conexión con la base de datos:

	const connection = mysql.createConnection({
    	host: 'localhost',
    	user: '', // usuario
    	password: '', // contraseña
    	database: '' // nombre asignado a la base de datos
	});


También puede cambiar el puerto en el cual se ejecuta el servidor:

	const PORT = process.env.PORT || 3050;


Para ejecutar el servidor debe correr el comando: 

	node app.js o nodemon


**NOTA:** Para revisar que el programa se está ejecutando correctamente en el navegador abra el URL <http://localhost:3050/> o con el puerto que le asignó y debera aparecer el inicio de sesión del aplicativo. Debe ingresar los datos de prueba creados en la configuración de la base de datos.


## Continuando con el desarrollo

Para realizar la edición de los archivos de HTML, CSS y JS debe ingresar a la carpeta del proyecto [/front/](https://github.com/espinosadvlpr/AtrezoSoftware/tree/main/front).


**¡Happy coding! :)**
