# Biblioteca

Sistema desarrollado para el final de la asignatura Programación 3, del Instituto Nacional Superior del Profesorado Técnico - Universidad Tecnológica Nacional.  
Esta aplicación fue diseñada con una arquitectura API RESTful que permite ser consumida por un frontend web. En este caso se utilizó el stack MERN de JavaScript (Mongo, Express, React y Node).  
Algunas de las dependencias utilizadas fueron:
-  JWT (para autenticación y autorización)
-  Axios (para manejas las solicitudes HTTP desde el Front)
-  Ant Design (para los componentes del Front)
-  Dotenv (para manejar distintos entornos)

## Configuración
Para hacer funcionar tanto el front como el back, ejecutar el comando

`npm install`

en las carpetas _Front_ y _Back_. Luego, para poder realizar la migración de la base de datos (en la carpeta Back) ejecutar:

`npm run migrate up`

Para que corran los servidores, tanto del front como del back, ejecutar en cada carpeta:

`npm run dev`

Sin configurar un archivo .env, el front corre sobre el puerto 5176 y el back sobre el puerto 3000.