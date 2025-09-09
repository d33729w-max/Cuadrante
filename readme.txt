# Planificador de Turnos y Vacaciones para Grupos de Trabajo

Este es un planificador web interactivo diseñado para equipos que trabajan por turnos, como bomberos, policías, personal sanitario o cualquier grupo con horarios rotativos. La aplicación facilita la gestión de turnos, la visualización de calendarios y la solicitud de ausencias de forma sencilla y eficiente.

## Características Principales

* **Gestión de Cuadrantes**: Los administradores pueden crear y configurar cuadrantes con nombres, cadencias de turnos personalizadas (ej. Día, Noche, Libre, Libre) y la fecha de inicio.
* **Gestión de Miembros**: Un administrador puede añadir nuevos miembros al cuadrante, generando un enlace de invitación único para que se unan de forma segura.
* **Calendario Dinámico**: Todos los miembros del equipo pueden ver el calendario de turnos. El calendario se genera automáticamente en función de la cadencia de turnos configurada por el administrador.
* **Registro de Ausencias**: Los miembros pueden solicitar vacaciones, bajas, asuntos particulares, etc., directamente desde el calendario.
* **Visibilidad de Ausencias**: El calendario muestra visualmente las ausencias de los miembros, permitiendo a todo el equipo saber quién está de servicio.
* **Roles de Usuario**: El sistema diferencia entre administradores (que gestionan el cuadrante) y miembros regulares (que ven el calendario y gestionan sus propias ausencias).

## Tecnología

Este proyecto está construido con un enfoque de "Jamstack" y utiliza las siguientes tecnologías:

* **Frontend**: HTML5, CSS3 y JavaScript (ES6+).
* **Backend como Servicio (BaaS)**: **[Google Firebase](https://firebase.google.com/)**
    * **Firebase Authentication**: Para la gestión segura del acceso de los usuarios (inicio de sesión con email/contraseña).
    * **Firestore Database**: Como base de datos NoSQL para almacenar la información de cuadrantes, turnos, miembros y ausencias.
    * **Firebase Hosting**: Para desplegar la aplicación de forma rápida y segura en la web.
    * **Firebase CLI**: Para la gestión del proyecto y despliegues automatizados.

## Estructura del Proyecto

El proyecto sigue una estructura simple y clara:

/cuadrante-web/
|-- index.html          # La página principal de la aplicación.
|-- style.css           # Estilos de la aplicación.
|-- script.js           # Lógica principal de la aplicación (frontend y conexión a Firebase).
|-- README.md           # Este archivo.
|-- firebase.json       # Archivo de configuración para Firebase Hosting.
|-- .firebaserc         # Archivo de configuración del proyecto de Firebase.




## Configuración y Despliegue

Para poner en marcha esta aplicación en tu propia cuenta de Firebase, sigue estos pasos:

1.  **Clona el repositorio**:
    ```bash
    git clone [https://github.com/tu_usuario/cuadrante-web.git](https://github.com/tu_usuario/cuadrante-web.git)
    cd cuadrante-web
    ```
2.  **Configura un proyecto en Firebase**:
    * Ve a la [Consola de Firebase](https://console.firebase.google.com/).
    * Crea un nuevo proyecto y habilita **Authentication** (con Email/Contraseña) y **Firestore Database** (en modo de prueba).
3.  **Conecta tu proyecto**:
    * Abre la consola de Firebase de tu proyecto y registra una nueva "Web app".
    * Copia el objeto `firebaseConfig` que te proporciona la consola.
    * Pega este objeto en el archivo `script.js` para reemplazar la configuración de ejemplo.
4.  **Despliega la aplicación**:
    * Instala el CLI de Firebase si aún no lo tienes: `npm install -g firebase-tools`
    * Inicia sesión: `firebase login`
    * Inicializa tu proyecto local: `firebase init` y sigue las instrucciones para conectar con tu proyecto de Firebase.
    * Despliega en vivo: `firebase deploy`

## Contribuciones

Las contribuciones son bienvenidas. Siéntete libre de abrir un "issue" o enviar un "pull request" con mejoras.

