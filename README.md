# Textify - Generador de Lorem Ipsum para Brave

![Textify Logo](icons/icon128.svg)

Textify es una extensión de navegador para Brave que permite generar e insertar texto Lorem Ipsum en cualquier campo de entrada de texto de manera rápida y sencilla.

## 🚀 Características

- **Inserción automática**: Inserta Lorem Ipsum directamente en campos de texto seleccionados
- **Opciones personalizables**: Genera palabras, oraciones, párrafos o texto de longitud específica
- **Interfaz intuitiva**: Popup moderno y fácil de usar
- **Menú contextual**: Acceso rápido mediante clic derecho en campos de texto
- **Compatibilidad amplia**: Funciona con input, textarea y elementos contenteditable
- **Configuración persistente**: Guarda tus preferencias automáticamente

## 📦 Instalación

### Instalación en Modo Desarrollador

1. **Descargar la extensión**:
   - Clona este repositorio o descarga los archivos
   - Asegúrate de tener todos los archivos en una carpeta

2. **Abrir Brave**:
   - Abre el navegador Brave
   - Ve a `brave://extensions/`

3. **Habilitar modo desarrollador**:
   - Activa el "Modo de desarrollador" en la esquina superior derecha

4. **Cargar la extensión**:
   - Haz clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta que contiene los archivos de la extensión
   - La extensión aparecerá en tu lista de extensiones

5. **Verificar instalación**:
   - Deberías ver el icono de Textify (T) en la barra de herramientas
   - Si no aparece, haz clic en el icono de extensiones y fija Textify

## 🎯 Uso

### Método 1: Usando el Popup

1. **Seleccionar campo de texto**:
   - Haz clic en cualquier campo de texto en una página web
   - El campo debe estar enfocado (cursor parpadeando)

2. **Abrir Textify**:
   - Haz clic en el icono de Textify en la barra de herramientas
   - Se abrirá el popup con las opciones

3. **Configurar opciones**:
   - **Tipo de texto**: Palabras, Oraciones, Párrafos o Longitud específica
   - **Cantidad**: Usa el slider o escribe el número directamente
   - **Comenzar con Lorem**: Activa para que el texto inicie con "Lorem ipsum"

4. **Insertar texto**:
   - Haz clic en "Generar e Insertar"
   - El texto se insertará automáticamente en el campo seleccionado

### Método 2: Menú Contextual

1. **Hacer clic derecho** en cualquier campo de texto
2. **Seleccionar "Insertar Lorem Ipsum"** del menú contextual
3. El texto se insertará usando la configuración guardada

### Atajos de Teclado

- **Ctrl+Enter** (o **Cmd+Enter** en Mac): Generar e insertar texto
- **Ctrl+Shift+C**: Copiar texto generado al portapapeles

## ⚙️ Opciones de Configuración

### Tipos de Texto

- **Palabras**: Genera una cantidad específica de palabras
- **Oraciones**: Genera oraciones completas (5-14 palabras cada una)
- **Párrafos**: Genera párrafos completos (3-7 oraciones cada uno)
- **Longitud específica**: Genera texto con una cantidad aproximada de caracteres

### Rangos de Cantidad

- **Palabras**: 1-100
- **Oraciones**: 1-20
- **Párrafos**: 1-10
- **Caracteres**: 1-1000

## 🔧 Estructura del Proyecto

```
Textify/
├── manifest.json          # Configuración de la extensión
├── popup.html             # Interfaz del popup
├── popup.css              # Estilos del popup
├── popup.js               # Lógica del popup
├── content.js             # Script de contenido
├── background.js          # Script de fondo
├── lorem-generator.js     # Generador de Lorem Ipsum
├── icons/                 # Iconos de la extensión
│   ├── icon16.svg
│   ├── icon32.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md              # Este archivo
```

## 🛠️ Desarrollo

### Tecnologías Utilizadas

- **Manifest V3**: Última versión del sistema de extensiones de Chrome/Brave
- **Vanilla JavaScript**: Sin dependencias externas
- **CSS3**: Estilos modernos con variables CSS
- **SVG**: Iconos vectoriales escalables

### Arquitectura

- **Background Script**: Maneja eventos globales y menú contextual
- **Content Script**: Se ejecuta en páginas web para detectar campos de texto
- **Popup**: Interfaz de usuario para configuración y control
- **Lorem Generator**: Clase independiente para generar texto

### Características Técnicas

- **Detección inteligente**: Identifica automáticamente campos de texto editables
- **Inserción robusta**: Maneja diferentes tipos de elementos (input, textarea, contenteditable)
- **Persistencia**: Guarda configuración en chrome.storage.sync
- **Manejo de errores**: Gestión completa de errores con feedback al usuario
- **Eventos sintéticos**: Dispara eventos para compatibilidad con frameworks

## 🔍 Compatibilidad

### Navegadores Soportados

- ✅ Brave Browser
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Opera
- ⚠️ Firefox (requiere adaptación menor)

### Tipos de Campos Soportados

- ✅ `<input type="text">`
- ✅ `<input type="email">`
- ✅ `<input type="search">`
- ✅ `<input type="url">`
- ✅ `<input type="tel">`
- ✅ `<textarea>`
- ✅ Elementos con `contenteditable="true"`
- ✅ Campos dinámicos (React, Vue, Angular)

## 🐛 Solución de Problemas

### La extensión no aparece

- Verifica que el modo desarrollador esté activado
- Recarga la extensión desde `brave://extensions/`
- Revisa la consola de errores en la página de extensiones

### No se inserta texto

- Asegúrate de que el campo de texto esté enfocado
- Verifica que el campo sea editable
- Prueba con el menú contextual como alternativa
- Revisa la consola del desarrollador (F12) para errores

### El popup no se abre

- Verifica que la extensión esté habilitada
- Intenta recargar la página web
- Reinicia el navegador si es necesario

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

- Abre un issue en GitHub
- Describe el problema detalladamente
- Incluye información del navegador y sistema operativo

---

**¡Disfruta generando Lorem Ipsum con Textify! 🎉**