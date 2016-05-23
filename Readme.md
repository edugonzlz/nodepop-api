Ejercicio práctico realizado con Javascript, Node.js, Express.js y MongoDB para el Master de KeepCoding

##Acceso a este documento
Con la api corriendo, se puede acceder a este documento readme desde cualquier navegador en:

- Ruta
  - /apiv1 (localhost:3000/apiv1)

##Descripción
Esta api da servicio a una app de venta de articulos de segunda mano. Se comunicará con versiones de iOS como Android y también Web.

Realiza las siguientes tareas
- Entrega de lista de anuncios, paginada, ordenada, con filtros por tag, tipo de anuncio (venta o búsqueda), rango de precio (minimo y máximo) y nombre del articulo.
- Entrega de lista de tags.
- Almacenamiento de token de push.
- Almacenamiento de anuncios con nombre, precio, tags, tipo de anuncio (venta o búsqueda).

Usa los siguientes módulos para su funcionamiento
- jsonwebtoken, para realizar la autenticación
- async, librería con funcionalidades asíncronas
- hash, para guardar la contraseña del usuario mediante un hash
- mobile-detect, para detectar la plataforma móvil del usuario
- express-markdown-router, para renderizar archivos readme en html (actualmente no se está usando)

Esta construida con Node.js, sobre Express.js, con una base de datos MongoDB sobre Mongoose.

##Uso de la api
*****
**La api necesita una base de datos de MongoDB corriendo y se conecta en el puerto 27017.**
Se pueden realizar peticiones locales desde un navegador o aplicaciones como Postman en localhost:3000/
*****
###Instalar modulos npm
Es necesario instalar los módulos y dependencias antes de ejecutar la aplicación

    npm install
    
###Carga de anuncios y usuarios
La aplicación del api dispone de un script que instala varios elementos en la base de datos desde un archivo json para poder probarla.
Dentro de la carpeta raiz de usuario escribe:
  
    npm run installdb

Si se desean cargar otros anuncios o usuarios, se pueden añadir en formato `json` en los archivos:
- articlesData.json - para cargar anuncios
- usersData.json - para cargar usuarios

####Formato de un anuncio
- Requiere formato json
- Propiedades de un anuncio: 
    - name(String), 
    - forSale(boolean), 
    - price(Number) *precio exacto*
      - price(Number-) *precio mínimo*
      - price(-Number) *precio máximo*
      - price(Number-Number) *precio entre dos valores*
    - photo(String)
    - tags(Array)

Ejemplo de un archivo `articlesData.json`
    
    {
    "articles": [ {
    "name": "Bicicleta", 
    "forSale": true,
    "price": 230.15,
    "photo": "bici.jpg",
    "tags": [ "lifestyle", "motor"]
    }, {
    "name": "iPhone 3GS", 
    "forSale": false,
    "price": 50.00,
    "photo": "iphone.png",
    "tags": [ "lifestyle", "mobile"]
    } ]
    }

####Formato de un usuario
- Requiere formato json
- Propiedades de un anuncio: 
    - name(String), 
    - email(String), 
    - passw(String)

Ejemplo de un archivo `usersData.json`

    {
      "users":[
        {
          "name":"Edu",
          "email":"edu@mail.com",
          "passw":"1234"
        }
      ]
    }

###Arrancar la api
Escribe en la linea de comando:

    npm run start

###Idiomas del api
La api genera mensajes de error en español e inglés.
Es necesario especificar el idioma en cada petición. El lenguaje por defecto es español.
####Enviar el lenguaje de uso deseado
- Donde
  - Headers
- Parámetros opcionales
  - x-lang
- Posibles valores
  - es (idioma español)
  - eng (idioma inglés)
  

###Registro de usuario
El usuario debe registrarse para poder realizar peticiones a la api
####Registrar un usuario
- Método
  - POST
- Ruta
  - /apiv1/users/register
- Donde
  - Body
- Formato
  - x-www-form-urlencoded
- Parámetros posibles y obligatorios
  - name(String), email(String), passw(String)
- Respuesta

      {
      "success": true,
      "saved": {
        "name": "Jose",
        "email": "jose@mail.com"
      }
      }

###Autenticación de usuario
El usuario registrado debe solicitar un token que deberá usar en todas las peticiones de anuncios. 


####Autenticar un usuario
- Método
  - POST
- Ruta
  - /apiv1/users/authenticate
- Parámetros posibles y obligatorios
  - name(String), email(String), passw(String)
- Donde
  - Body
- Formato
  - x-www-form-urlencoded
- Respuesta

      {
        "success": true,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3MmUzYjQ5NGM1OWQ3NDM2ZjE0YzkzNSIsImlhdCI6MTQ2MjY5ODM5OSwiZXhwIjoxNDYyODcxMTk5fQ.nnZzi7cwfXT-gE3cGqDJzLR-GerbUuNMHf5jGEfpVp0"
      }

####Usar el token
El token recibido se debe enviar a la api en una query en cada petición de anuncios.
Por ejemplo
`/apiv1/articles?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3MmUzYjQ5NGM1OWQ3NDM2ZjE0YzkzNSIsImlhdCI6MTQ2MjY5ODM5OSwiZXhwIjoxNDYyODcxMTk5fQ.nnZzi7cwfXT-gE3cGqDJzLR-GerbUuNMHf5jGEfpVp0`

###Obtener una lista de anuncios
La api permite peticiones de listas de anuncios con filtros de búsqueda y paginación.

- Método
 - GET
- Ruta
  - /apiv1/articles
- Parámetros de búsqueda posibles y opcionales
  - name(String), 
  - forSale(boolean), 
  - price(Number) ó price(Number-) ó price(-Number) ó price(Number-Number)
  - tags(Array) 
- Paginación
  - sort (orden de presentación)
  - start (posición desde la que se entrega el primer anuncio)
  - limit (cantidad de anuncios entregada)
- Donde
  - query
- Ejemplo
`/apiv1/articles/?price=50-300&forSale=true&limit=2&sort=name&start=0&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3MmUzYjQ5NGM1OWQ3NDM2ZjE0YzkzNSIsImlhdCI6MTQ2MjY5ODM5OSwiZXhwIjoxNDYyODcxMTk5fQ.nnZzi7cwfXT-gE3cGqDJzLR-GerbUuNMHf5jGEfpVp0`
- Respuesta

        {"success":true,
            "rows":[{"_id":"572e3b494c59d7436f14c933",
            "name":"Bicicleta",
            "forSale":true,
            "price":230.15,
            "photo":"bicycle.jpg",
            "__v":0,
            "tags":["lifestyle","motor"]}
      ]}

###Obtener imágenes de los anuncios
Para obtener las imágenes que corresponde a cada anuncio debemos usar la propiedad `photo`del objeto recibido en la petición de anuncios.

- Método
 - GET
- Ruta
  - /apiv1/images/articles
- Parámetros obligatorios
  - nombre de recurso
- Donde
  - ruta /apiv1/images/articles
- Ejemplo
`/apiv1/images/articles/iphone.jpg`
- Respuesta
  - Imagen requerida en formato .jpg


###Guardar Anuncios
La api permite guardar anuncios. 
*Aún no es posible guardar la imagen de un anuncio*

- Método
 - POST
- Ruta
  - /apiv1/articles
- Parámetros posibles y temporalmente opcionales
  - name(String), 
  - forSale(boolean), 
  - price(Number) ó price(Number-) ó price(-Number) ó price(Number-Number)
  - tags(Array) 
  - Aún no es posible enviar una foto del articulo.
- Donde
  - Body
- Formato
  - x-www-form-urlencoded
- Respuesta
      
      {"success":true,
      "rows":[{"_id":"572e3b494c59d7436f14c933",
              "name":"Bicicleta",
              "forSale":true,
              "price":230.15,
              "photo":"bicycle.jpg",
              "__v":0,
              "tags":["lifestyle","motor"]}
      ]}

###Obtener una lista de tags
La api devuelve una lista de todas las tags usadas en los articulos.
- Método
 - GET
- Ruta
  - /apiv1/articles/tags
- Ejemplo
`/apiv1/articles/tags?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3MmUzYjQ5NGM1OWQ3NDM2ZjE0YzkzNSIsImlhdCI6MTQ2MjY5ODM5OSwiZXhwIjoxNDYyODcxMTk5fQ.nnZzi7cwfXT-gE3cGqDJzLR-GerbUuNMHf5jGEfpVp0`
- Respuesta

      {"success":true,
      "rows":["lifestyle","motor","mobile"]}

###Guardar un push token
La api permite el almacenamiento de un push token, enviado por el usuario.
Si el usuario está registrado se guardará en relación a el, y si ya tenía un push token guardado, lo actualizará.
Si el usuario no está registrado se guarda también el push token.

- Método
 - PUT
- Ruta
  - /apiv1/articles
- Parámetros posibles y opcionales
  - name(String)
  - email(String)
- Donde
  - Body
- Formato
  - x-www-form-urlencoded
- Ejemplo
`/apiv1/users/pushtoken?pushtoken=kjasdfkljsadf98asdf`
- Respuesta

       {
        "success": true,
        "saved": {
          "__v": 0,
          "token": "sdfsdfsdfsdf234",
          "_id": "572f6224a36c9f2d7a2a675e"
        }
      }

###Errores
Ejemplos de respuesta de error

      {
        "success": false,
        "message": "La contraseña introducida es incorrecta",
        "error": {}
      }
      
      

      {
        "ok": false,
        "error": {
          "code": 403,
          "message": "No token provided."
        }
      }

      {
        "success": false,
        "error": {
          "message": "User validation failed",
          "name": "ValidationError",
          "errors": {
            "email": {
              "message": "Path `email` is required.",
              "name": "ValidatorError",
              "properties": {
                "type": "required",
                "message": "Path `{PATH}` is required.",
                "path": "email"
              },
              "kind": "required",
              "path": "email"
            }
          }
        }
      }
