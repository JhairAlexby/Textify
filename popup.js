/**
 * Popup script para la extensión Textify
 * Maneja la interfaz del usuario y la comunicación con el content script
 */

class TextifyPopup {
  constructor() {
    this.generator = new LoremGenerator();
    this.elements = {};
    this.currentText = '';
    this.init();
  }

  /**
   * Inicializa el popup y configura los event listeners
   */
  init() {
    this.cacheElements();
    this.loadSettings();
    this.setupEventListeners();
    this.updatePreview();
    this.updateUI();
  }

  /**
   * Cachea las referencias a los elementos del DOM
   */
  cacheElements() {
    this.elements = {
      textType: document.getElementById('textType'),
      textCount: document.getElementById('textCount'),
      textRange: document.getElementById('textRange'),
      unitLabel: document.getElementById('unitLabel'),
      maxLabel: document.getElementById('maxLabel'),
      startWithLorem: document.getElementById('startWithLorem'),
      preview: document.getElementById('preview'),
      generateBtn: document.getElementById('generateBtn'),
      copyBtn: document.getElementById('copyBtn'),
      status: document.getElementById('status')
    };
  }

  /**
   * Carga la configuración guardada del usuario
   */
  async loadSettings() {
    try {
      const settings = await chrome.storage.sync.get({
        textType: 'sentences',
        textCount: 3,
        startWithLorem: true
      });

      this.elements.textType.value = settings.textType;
      this.elements.textCount.value = settings.textCount;
      this.elements.textRange.value = settings.textCount;
      this.elements.startWithLorem.checked = settings.startWithLorem;
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  /**
   * Guarda la configuración del usuario
   */
  async saveSettings() {
    try {
      await chrome.storage.sync.set({
        textType: this.elements.textType.value,
        textCount: parseInt(this.elements.textCount.value),
        startWithLorem: this.elements.startWithLorem.checked
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    // Cambio de tipo de texto
    this.elements.textType.addEventListener('change', () => {
      this.updateUI();
      this.updatePreview();
      this.saveSettings();
    });

    // Cambio de cantidad (input numérico)
    this.elements.textCount.addEventListener('input', () => {
      this.syncInputs();
      this.updatePreview();
      this.saveSettings();
    });

    // Cambio de cantidad (slider)
    this.elements.textRange.addEventListener('input', () => {
      this.syncInputs();
      this.updatePreview();
      this.saveSettings();
    });

    // Checkbox de "Comenzar con Lorem"
    this.elements.startWithLorem.addEventListener('change', () => {
      this.updatePreview();
      this.saveSettings();
    });

    // Botón generar e insertar
    this.elements.generateBtn.addEventListener('click', () => {
      this.generateAndInsert();
    });

    // Botón copiar
    this.elements.copyBtn.addEventListener('click', () => {
      this.copyToClipboard();
    });

    // Teclas de acceso rápido
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.generateAndInsert();
      } else if (e.key === 'c' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        this.copyToClipboard();
      }
    });
  }

  /**
   * Sincroniza el input numérico con el slider
   */
  syncInputs() {
    const value = parseInt(this.elements.textCount.value) || 1;
    this.elements.textRange.value = Math.min(value, parseInt(this.elements.textRange.max));
    this.elements.textCount.value = this.elements.textRange.value;
  }

  /**
   * Actualiza la interfaz según el tipo de texto seleccionado
   */
  updateUI() {
    const textType = this.elements.textType.value;
    let maxValue, unitText;

    switch (textType) {
      case 'words':
        maxValue = 100;
        unitText = 'palabras';
        break;
      case 'sentences':
        maxValue = 20;
        unitText = 'oraciones';
        break;
      case 'paragraphs':
        maxValue = 10;
        unitText = 'párrafos';
        break;
      case 'length':
        maxValue = 1000;
        unitText = 'caracteres';
        break;
      default:
        maxValue = 20;
        unitText = 'oraciones';
    }

    this.elements.textRange.max = maxValue;
    this.elements.textCount.max = maxValue;
    this.elements.unitLabel.textContent = unitText;
    this.elements.maxLabel.textContent = maxValue;

    // Ajustar valor si excede el máximo
    const currentValue = parseInt(this.elements.textCount.value);
    if (currentValue > maxValue) {
      this.elements.textCount.value = maxValue;
      this.elements.textRange.value = maxValue;
    }
  }

  /**
   * Actualiza la vista previa del texto
   */
  updatePreview() {
    const textType = this.elements.textType.value;
    const count = parseInt(this.elements.textCount.value) || 1;
    const startWithLorem = this.elements.startWithLorem.checked;

    try {
      let generatedText;
      
      if (textType === 'length') {
        generatedText = this.generator.generateByLength(count);
      } else {
        generatedText = this.generator.generate(textType, count);
      }

      // Aplicar "Comenzar con Lorem" si está habilitado
      if (startWithLorem && textType !== 'length') {
        if (textType === 'words') {
          const words = generatedText.split(' ');
          words[0] = 'Lorem';
          if (words.length > 1) words[1] = 'ipsum';
          generatedText = words.join(' ');
        } else {
          generatedText = generatedText.replace(/^\w+/, 'Lorem').replace(/^Lorem\s+\w+/, 'Lorem ipsum');
        }
      }

      this.currentText = generatedText;
      this.elements.preview.textContent = generatedText;
      
      // Actualizar estado
      this.updateStatus('Listo para generar texto', 'ready');
    } catch (error) {
      console.error('Error generating preview:', error);
      this.updateStatus('Error al generar vista previa', 'error');
    }
  }

  /**
   * Genera texto e inserta en el campo activo
   */
  async generateAndInsert() {
    try {
      this.updateStatus('Insertando texto...', 'loading');
      this.elements.generateBtn.disabled = true;

      // Obtener la pestaña activa
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No se pudo obtener la pestaña activa');
      }

      // Enviar mensaje al content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'insertText',
        text: this.currentText
      });

      if (response && response.success) {
        this.updateStatus('Texto insertado correctamente', 'ready');
        // Cerrar popup después de insertar
        setTimeout(() => window.close(), 1000);
      } else {
        throw new Error(response?.error || 'No se pudo insertar el texto');
      }
    } catch (error) {
      console.error('Error inserting text:', error);
      this.updateStatus('Error: ' + error.message, 'error');
    } finally {
      this.elements.generateBtn.disabled = false;
    }
  }

  /**
   * Copia el texto generado al portapapeles
   */
  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.currentText);
      this.updateStatus('Texto copiado al portapapeles', 'ready');
      
      // Feedback visual temporal
      const originalText = this.elements.copyBtn.innerHTML;
      this.elements.copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Copiado
      `;
      
      setTimeout(() => {
        this.elements.copyBtn.innerHTML = originalText;
      }, 1500);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      this.updateStatus('Error al copiar texto', 'error');
    }
  }

  /**
   * Actualiza el mensaje de estado
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de estado: 'ready', 'loading', 'error'
   */
  updateStatus(message, type = 'ready') {
    this.elements.status.textContent = message;
    this.elements.status.className = `status ${type}`;
  }
}

// Inicializar el popup cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new TextifyPopup();
});

// Manejar errores globales
window.addEventListener('error', (event) => {
  console.error('Global error in popup:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in popup:', event.reason);
});