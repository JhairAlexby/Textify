/**
 * Content script para la extensión Textify
 * Se ejecuta en todas las páginas web para detectar campos de texto
 * y manejar la inserción de Lorem Ipsum
 */

class TextifyContent {
  constructor() {
    this.lastFocusedElement = null;
    this.textFieldSelectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="search"]',
      'input[type="url"]',
      'input[type="tel"]',
      'input[type="password"]',
      'input:not([type])',
      'textarea',
      '[contenteditable="true"]',
      '[contenteditable=""]'
    ];
    this.init();
  }

  /**
   * Inicializa el content script
   */
  init() {
    this.setupEventListeners();
    this.setupMessageListener();
    this.trackFocusedElements();
  }

  /**
   * Configura los event listeners para rastrear elementos enfocados
   */
  setupEventListeners() {
    // Rastrear elementos enfocados
    document.addEventListener('focusin', (event) => {
      if (this.isTextInput(event.target)) {
        this.lastFocusedElement = event.target;
      }
    }, true);

    // Rastrear clics en elementos de texto
    document.addEventListener('click', (event) => {
      if (this.isTextInput(event.target)) {
        this.lastFocusedElement = event.target;
      }
    }, true);

    // Limpiar referencia cuando el elemento pierde el foco
    document.addEventListener('focusout', (event) => {
      // Pequeño delay para permitir que otros elementos reciban el foco
      setTimeout(() => {
        if (!document.activeElement || !this.isTextInput(document.activeElement)) {
          // Solo limpiar si no hay otro campo de texto enfocado
          if (this.lastFocusedElement === event.target) {
            this.lastFocusedElement = null;
          }
        }
      }, 100);
    }, true);
  }

  /**
   * Configura el listener para mensajes del popup
   */
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'insertText') {
        this.handleInsertText(message.text)
          .then(result => sendResponse(result))
          .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Indica que la respuesta será asíncrona
      }
      
      if (message.action === 'getActiveElement') {
        sendResponse({
          success: true,
          hasActiveElement: !!this.getTargetElement(),
          elementType: this.getElementType(this.getTargetElement())
        });
        return true;
      }
    });
  }

  /**
   * Rastrea elementos enfocados dinámicamente
   */
  trackFocusedElements() {
    // Verificar elemento activo al cargar
    if (document.activeElement && this.isTextInput(document.activeElement)) {
      this.lastFocusedElement = document.activeElement;
    }

    // Observer para elementos añadidos dinámicamente
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Verificar si el nuevo elemento es un campo de texto
            if (this.isTextInput(node)) {
              this.setupElementTracking(node);
            }
            // Verificar elementos hijos
            const textInputs = node.querySelectorAll?.(this.textFieldSelectors.join(','));
            textInputs?.forEach(input => this.setupElementTracking(input));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Configura el rastreo para un elemento específico
   * @param {Element} element - Elemento a rastrear
   */
  setupElementTracking(element) {
    element.addEventListener('focus', () => {
      this.lastFocusedElement = element;
    });

    element.addEventListener('click', () => {
      this.lastFocusedElement = element;
    });
  }

  /**
   * Verifica si un elemento es un campo de texto
   * @param {Element} element - Elemento a verificar
   * @returns {boolean} True si es un campo de texto
   */
  isTextInput(element) {
    if (!element || !element.tagName) return false;

    const tagName = element.tagName.toLowerCase();
    
    // Textarea
    if (tagName === 'textarea') return true;
    
    // Elementos contenteditable
    if (element.contentEditable === 'true' || element.contentEditable === '') return true;
    
    // Input fields
    if (tagName === 'input') {
      const type = (element.type || 'text').toLowerCase();
      const textTypes = ['text', 'email', 'search', 'url', 'tel', 'password'];
      return textTypes.includes(type) || !element.type;
    }
    
    return false;
  }

  /**
   * Obtiene el elemento objetivo para insertar texto
   * @returns {Element|null} Elemento objetivo
   */
  getTargetElement() {
    // Priorizar elemento actualmente enfocado
    if (document.activeElement && this.isTextInput(document.activeElement)) {
      return document.activeElement;
    }
    
    // Usar último elemento enfocado si aún es válido
    if (this.lastFocusedElement && 
        document.contains(this.lastFocusedElement) && 
        this.isTextInput(this.lastFocusedElement)) {
      return this.lastFocusedElement;
    }
    
    return null;
  }

  /**
   * Obtiene el tipo de elemento
   * @param {Element} element - Elemento a analizar
   * @returns {string} Tipo de elemento
   */
  getElementType(element) {
    if (!element) return 'none';
    
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'textarea') return 'textarea';
    if (element.contentEditable === 'true' || element.contentEditable === '') return 'contenteditable';
    if (tagName === 'input') return `input[${element.type || 'text'}]`;
    
    return 'unknown';
  }

  /**
   * Maneja la inserción de texto en el elemento objetivo
   * @param {string} text - Texto a insertar
   * @returns {Promise<Object>} Resultado de la operación
   */
  async handleInsertText(text) {
    try {
      const targetElement = this.getTargetElement();
      
      if (!targetElement) {
        throw new Error('No se encontró ningún campo de texto activo. Haz clic en un campo de texto e intenta de nuevo.');
      }

      // Enfocar el elemento antes de insertar
      targetElement.focus();
      
      // Insertar texto según el tipo de elemento
      const success = await this.insertTextInElement(targetElement, text);
      
      if (!success) {
        throw new Error('No se pudo insertar el texto en el elemento seleccionado.');
      }

      // Trigger events para notificar cambios
      this.triggerChangeEvents(targetElement);
      
      return {
        success: true,
        elementType: this.getElementType(targetElement),
        textLength: text.length
      };
    } catch (error) {
      console.error('Error inserting text:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Inserta texto en un elemento específico
   * @param {Element} element - Elemento donde insertar
   * @param {string} text - Texto a insertar
   * @returns {Promise<boolean>} True si la inserción fue exitosa
   */
  async insertTextInElement(element, text) {
    try {
      // Para elementos contenteditable
      if (element.contentEditable === 'true' || element.contentEditable === '') {
        return this.insertInContentEditable(element, text);
      }
      
      // Para input y textarea
      if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
        return this.insertInInputElement(element, text);
      }
      
      return false;
    } catch (error) {
      console.error('Error in insertTextInElement:', error);
      return false;
    }
  }

  /**
   * Inserta texto en elementos contenteditable
   * @param {Element} element - Elemento contenteditable
   * @param {string} text - Texto a insertar
   * @returns {boolean} True si la inserción fue exitosa
   */
  insertInContentEditable(element, text) {
    try {
      // Usar execCommand si está disponible
      if (document.execCommand) {
        document.execCommand('insertText', false, text);
        return true;
      }
      
      // Fallback: insertar en la posición del cursor
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        return true;
      }
      
      // Último recurso: reemplazar todo el contenido
      element.textContent = text;
      return true;
    } catch (error) {
      console.error('Error inserting in contenteditable:', error);
      return false;
    }
  }

  /**
   * Inserta texto en elementos input/textarea
   * @param {Element} element - Elemento input/textarea
   * @param {string} text - Texto a insertar
   * @returns {boolean} True si la inserción fue exitosa
   */
  insertInInputElement(element, text) {
    try {
      const startPos = element.selectionStart || 0;
      const endPos = element.selectionEnd || 0;
      const currentValue = element.value || '';
      
      // Insertar texto en la posición del cursor
      const newValue = currentValue.substring(0, startPos) + text + currentValue.substring(endPos);
      element.value = newValue;
      
      // Posicionar cursor al final del texto insertado
      const newCursorPos = startPos + text.length;
      element.setSelectionRange(newCursorPos, newCursorPos);
      
      return true;
    } catch (error) {
      console.error('Error inserting in input element:', error);
      // Fallback: reemplazar todo el valor
      try {
        element.value = text;
        return true;
      } catch (fallbackError) {
        console.error('Fallback insertion failed:', fallbackError);
        return false;
      }
    }
  }

  /**
   * Dispara eventos de cambio para notificar a la página
   * @param {Element} element - Elemento que cambió
   */
  triggerChangeEvents(element) {
    try {
      // Eventos estándar
      const events = ['input', 'change', 'keyup'];
      
      events.forEach(eventType => {
        const event = new Event(eventType, {
          bubbles: true,
          cancelable: true
        });
        element.dispatchEvent(event);
      });
      
      // Evento personalizado para frameworks
      const customEvent = new CustomEvent('textify-insert', {
        bubbles: true,
        detail: { source: 'textify-extension' }
      });
      element.dispatchEvent(customEvent);
    } catch (error) {
      console.error('Error triggering change events:', error);
    }
  }
}

// Inicializar el content script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TextifyContent();
  });
} else {
  new TextifyContent();
}

// Manejar errores globales
window.addEventListener('error', (event) => {
  console.error('Global error in content script:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in content script:', event.reason);
});