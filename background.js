/**
 * Background script para la extensión Textify
 * Maneja eventos de la extensión, menú contextual y comunicación entre componentes
 */

class TextifyBackground {
  constructor() {
    this.generator = null;
    this.contextMenuId = 'textify-insert-lorem';
    this.init();
  }

  /**
   * Inicializa el background script
   */
  init() {
    this.setupEventListeners();
    this.createContextMenu();
    this.loadGenerator();
  }

  /**
   * Carga el generador de Lorem Ipsum
   */
  async loadGenerator() {
    try {
      // Importar el generador dinámicamente
      const module = await import(chrome.runtime.getURL('lorem-generator.js'));
      this.generator = new module.LoremGenerator();
    } catch (error) {
      console.error('Error loading Lorem generator:', error);
      // Fallback: crear una instancia básica
      this.generator = {
        generate: (type, count) => {
          const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
          return words.slice(0, Math.min(count, words.length)).join(' ');
        }
      };
    }
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Listener para instalación/actualización
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Listener para clics en el menú contextual
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });

    // Listener para mensajes de otros scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Indica respuesta asíncrona
    });

    // Listener para cambios en las pestañas
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabActivated(activeInfo);
    });

    // Listener para actualizaciones de pestañas
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdated(tabId, changeInfo, tab);
    });
  }

  /**
   * Maneja la instalación o actualización de la extensión
   * @param {Object} details - Detalles de la instalación
   */
  handleInstallation(details) {
    console.log('Textify extension installed/updated:', details.reason);
    
    if (details.reason === 'install') {
      // Primera instalación
      this.setDefaultSettings();
      this.showWelcomeNotification();
    } else if (details.reason === 'update') {
      // Actualización
      this.handleUpdate(details.previousVersion);
    }
  }

  /**
   * Establece la configuración por defecto
   */
  async setDefaultSettings() {
    try {
      await chrome.storage.sync.set({
        textType: 'sentences',
        textCount: 3,
        startWithLorem: true,
        showNotifications: true
      });
    } catch (error) {
      console.error('Error setting default settings:', error);
    }
  }

  /**
   * Muestra notificación de bienvenida
   */
  showWelcomeNotification() {
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.svg',
        title: 'Textify instalado correctamente',
        message: 'Haz clic en cualquier campo de texto y usa la extensión para insertar Lorem Ipsum.'
      });
    }
  }

  /**
   * Maneja actualizaciones de la extensión
   * @param {string} previousVersion - Versión anterior
   */
  handleUpdate(previousVersion) {
    console.log(`Textify updated from ${previousVersion} to ${chrome.runtime.getManifest().version}`);
    // Aquí se pueden manejar migraciones de datos si es necesario
  }

  /**
   * Crea el menú contextual
   */
  createContextMenu() {
    try {
      chrome.contextMenus.create({
        id: this.contextMenuId,
        title: 'Insertar Lorem Ipsum',
        contexts: ['editable'],
        documentUrlPatterns: ['http://*/*', 'https://*/*']
      });
    } catch (error) {
      console.error('Error creating context menu:', error);
    }
  }

  /**
   * Maneja clics en el menú contextual
   * @param {Object} info - Información del clic
   * @param {Object} tab - Pestaña activa
   */
  async handleContextMenuClick(info, tab) {
    if (info.menuItemId === this.contextMenuId) {
      try {
        // Obtener configuración del usuario
        const settings = await chrome.storage.sync.get({
          textType: 'sentences',
          textCount: 3,
          startWithLorem: true
        });

        // Generar texto
        let text = '';
        if (this.generator) {
          text = this.generator.generate(settings.textType, settings.textCount);
          
          // Aplicar "Comenzar con Lorem" si está habilitado
          if (settings.startWithLorem && settings.textType !== 'length') {
            if (settings.textType === 'words') {
              const words = text.split(' ');
              words[0] = 'Lorem';
              if (words.length > 1) words[1] = 'ipsum';
              text = words.join(' ');
            } else {
              text = text.replace(/^\w+/, 'Lorem').replace(/^Lorem\s+\w+/, 'Lorem ipsum');
            }
          }
        } else {
          text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        }

        // Enviar texto al content script
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'insertText',
          text: text
        });

        if (response && response.success) {
          this.showSuccessNotification();
        } else {
          throw new Error(response?.error || 'No se pudo insertar el texto');
        }
      } catch (error) {
        console.error('Error handling context menu click:', error);
        this.showErrorNotification(error.message);
      }
    }
  }

  /**
   * Maneja mensajes de otros scripts
   * @param {Object} message - Mensaje recibido
   * @param {Object} sender - Remitente del mensaje
   * @param {Function} sendResponse - Función para responder
   */
  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'generateText':
          const text = await this.generateText(message.options);
          sendResponse({ success: true, text });
          break;
          
        case 'getSettings':
          const settings = await chrome.storage.sync.get(message.keys);
          sendResponse({ success: true, settings });
          break;
          
        case 'saveSettings':
          await chrome.storage.sync.set(message.settings);
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, error: 'Acción no reconocida' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  /**
   * Genera texto Lorem Ipsum
   * @param {Object} options - Opciones de generación
   * @returns {Promise<string>} Texto generado
   */
  async generateText(options = {}) {
    const {
      type = 'sentences',
      count = 3,
      startWithLorem = true
    } = options;

    if (!this.generator) {
      await this.loadGenerator();
    }

    let text = this.generator.generate(type, count);

    // Aplicar "Comenzar con Lorem" si está habilitado
    if (startWithLorem && type !== 'length') {
      if (type === 'words') {
        const words = text.split(' ');
        words[0] = 'Lorem';
        if (words.length > 1) words[1] = 'ipsum';
        text = words.join(' ');
      } else {
        text = text.replace(/^\w+/, 'Lorem').replace(/^Lorem\s+\w+/, 'Lorem ipsum');
      }
    }

    return text;
  }

  /**
   * Maneja la activación de pestañas
   * @param {Object} activeInfo - Información de la pestaña activa
   */
  handleTabActivated(activeInfo) {
    // Aquí se puede implementar lógica específica para cuando cambia la pestaña activa
    console.log('Tab activated:', activeInfo.tabId);
  }

  /**
   * Maneja actualizaciones de pestañas
   * @param {number} tabId - ID de la pestaña
   * @param {Object} changeInfo - Información de los cambios
   * @param {Object} tab - Objeto de la pestaña
   */
  handleTabUpdated(tabId, changeInfo, tab) {
    // Reinyectar content script si es necesario
    if (changeInfo.status === 'complete' && tab.url && 
        (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
      // El content script se inyecta automáticamente según el manifest
      console.log('Tab updated:', tabId, tab.url);
    }
  }

  /**
   * Muestra notificación de éxito
   */
  showSuccessNotification() {
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.svg',
        title: 'Textify',
        message: 'Texto Lorem Ipsum insertado correctamente'
      });
    }
  }

  /**
   * Muestra notificación de error
   * @param {string} errorMessage - Mensaje de error
   */
  showErrorNotification(errorMessage) {
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.svg',
        title: 'Error - Textify',
        message: errorMessage || 'Ocurrió un error al insertar el texto'
      });
    }
  }
}

// Inicializar el background script
new TextifyBackground();

// Manejar errores globales
self.addEventListener('error', (event) => {
  console.error('Global error in background script:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in background script:', event.reason);
});