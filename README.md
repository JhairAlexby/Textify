Textify - Generador de Lorem Ipsum para Brave
Textify es una extensión de navegador para Brave y otros navegadores que permite generar e insertar texto Lorem Ipsum en cualquier campo de entrada de texto de manera rápida y sencilla.

Características
Inserción automática: Inserta Lorem Ipsum directamente en campos de texto seleccionados.

Opciones personalizables: Genera palabras, oraciones, párrafos o texto de longitud específica.

Interfaz intuitiva: Popup moderno y fácil de usar.

Menú contextual: Acceso rápido mediante clic derecho en campos de texto.

Compatibilidad amplia: Funciona con input, textarea y elementos contenteditable.

Configuración persistente: Guarda sus preferencias automáticamente.

Instalación
Instalación en Modo Desarrollador
Descargar la extensión:

Clone este repositorio o descargue los archivos.

Asegúrese de tener todos los archivos en una carpeta.

Abrir Brave:

Abra el navegador Brave.

Navegue a brave://extensions/.

Habilitar modo desarrollador:

Active el "Modo de desarrollador" en la esquina superior derecha.

Cargar la extensión:

Haga clic en "Cargar extensión sin empaquetar".

Seleccione la carpeta que contiene los archivos de la extensión.

La extensión aparecerá en su lista de extensiones.

Verificar instalación:

Debería ver el icono de Textify (T) en la barra de herramientas.

Si no aparece, haga clic en el icono de extensiones y fije Textify.

Uso
Método 1: Usando el Popup
Seleccionar campo de texto:

Haga clic en cualquier campo de texto en una página web.

El campo debe estar enfocado (cursor parpadeando).

Abrir Textify:

Haga clic en el icono de Textify en la barra de herramientas.

Se abrirá el popup con las opciones.

Configurar opciones:

Tipo de texto: Palabras, Oraciones, Párrafos o Longitud específica.

Cantidad: Use el control deslizante o escriba el número directamente.

Comenzar con Lorem: Active para que el texto inicie con "Lorem ipsum".

Insertar texto:

Haga clic en "Generar e Insertar".

El texto se insertará automáticamente en el campo seleccionado.

Método 2: Menú Contextual
Hacer clic derecho en cualquier campo de texto.

Seleccionar "Insertar Lorem Ipsum" del menú contextual.

El texto se insertará utilizando la configuración guardada.

Atajos de Teclado
Ctrl+Enter (o Cmd+Enter en Mac): Generar e insertar texto.

Ctrl+Shift+C: Copiar texto generado al portapapeles.

Opciones de Configuración
Tipos de Texto
Palabras: Genera una cantidad específica de palabras.

Oraciones: Genera oraciones completas (5-14 palabras cada una).

Párrafos: Genera párrafos completos (3-7 oraciones cada uno).

Longitud específica: Genera texto con una cantidad aproximada de caracteres.

Rangos de Cantidad
Palabras: 1-100

Oraciones: 1-20

Párrafos: 1-10

Caracteres: 1-1000

Estructura del Proyecto
Textify/
├── manifest.json         # Configuración de la extensión
├── popup.html            # Interfaz del popup
├── popup.css             # Estilos del popup
├── popup.js              # Lógica del popup
├── content.js            # Script de contenido
├── background.js         # Script de fondo
├── lorem-generator.js    # Generador de Lorem Ipsum
├── icons/                # Iconos de la extensión
│   ├── icon16.svg
│   ├── icon32.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md             # Este archivo

Desarrollo
Tecnologías Utilizadas
Manifest V3: Última versión del sistema de extensiones de Chrome/Brave.

Vanilla JavaScript: Sin dependencias externas.

CSS3: Estilos modernos con variables CSS.

SVG: Iconos vectoriales escalables.

Arquitectura
Background Script: Maneja eventos globales y menú contextual.

Content Script: Se ejecuta en páginas web para detectar campos de texto.

Popup: Interfaz de usuario para configuración y control.

Lorem Generator: Clase independiente para generar texto.

Características Técnicas
Detección inteligente: Identifica automáticamente campos de texto editables.

Inserción robusta: Maneja diferentes tipos de elementos (input, textarea, contenteditable).

Persistencia: Guarda configuración en chrome.storage.sync.

Manejo de errores: Gestión completa de errores con retroalimentación al usuario.

Eventos sintéticos: Dispara eventos para compatibilidad con frameworks.

Compatibilidad
Navegadores Soportados
Brave Browser

Google Chrome

Microsoft Edge

Opera

Firefox (requiere adaptación menor)

Tipos de Campos Soportados
<input type="text">

<input type="email">

<input type="search">

<input type="url">

<input type="tel">

<textarea>

Elementos con contenteditable="true"

Campos dinámicos (React, Vue, Angular)

Solución de Problemas
La extensión no aparece
Verifique que el modo desarrollador esté activado.

Recargue la extensión desde brave://extensions/.

Revise la consola de errores en la página de extensiones.

No se inserta texto
Asegúrese de que el campo de texto esté enfocado.

Verifique que el campo sea editable.

Pruebe con el menú contextual como alternativa.

Revise la consola del desarrollador (F12) para errores.

El popup no se abre
Verifique que la extensión esté habilitada.

Intente recargar la página web.

Reinicie el navegador si es necesario.

Licencia
Este proyecto está bajo la Licencia MIT. Consulte el archivo LICENSE para más detalles.

Contribuciones
Las contribuciones son bienvenidas. Para contribuir, por favor siga estos pasos:

Realice un fork del proyecto.

Cree una rama para su nueva característica (git checkout -b feature/AmazingFeature).

Confirme sus cambios (git commit -m 'Add some AmazingFeature').

Envíe sus cambios a la rama (git push origin feature/AmazingFeature).

Abra un Pull Request.

Soporte
Si encuentra algún problema o tiene sugerencias, por favor:

Abra un issue en GitHub.

Describa el problema detalladamente.

Incluya información del navegador y sistema operativo.

Gracias por utilizar Textify.