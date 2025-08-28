/**
 * Generador de texto Lorem Ipsum con opciones personalizables
 */
class LoremGenerator {
  constructor() {
    this.words = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
      'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
      'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
      'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
      'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
      'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
      'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
      'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
      'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit',
      'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'ratione', 'sequi',
      'nesciunt', 'neque', 'porro', 'quisquam', 'qui', 'dolorem', 'adipisci',
      'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'magnam', 'quaerat'
    ];
  }

  /**
   * Genera palabras aleatorias de Lorem Ipsum
   * @param {number} count - Número de palabras a generar
   * @returns {string} Texto generado
   */
  generateWords(count) {
    const result = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.words.length);
      result.push(this.words[randomIndex]);
    }
    return result.join(' ');
  }

  /**
   * Genera oraciones de Lorem Ipsum
   * @param {number} count - Número de oraciones a generar
   * @returns {string} Texto generado
   */
  generateSentences(count) {
    const sentences = [];
    for (let i = 0; i < count; i++) {
      const wordsInSentence = Math.floor(Math.random() * 10) + 5; // 5-14 palabras por oración
      let sentence = this.generateWords(wordsInSentence);
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
      sentences.push(sentence);
    }
    return sentences.join(' ');
  }

  /**
   * Genera párrafos de Lorem Ipsum
   * @param {number} count - Número de párrafos a generar
   * @returns {string} Texto generado
   */
  generateParagraphs(count) {
    const paragraphs = [];
    for (let i = 0; i < count; i++) {
      const sentencesInParagraph = Math.floor(Math.random() * 5) + 3; // 3-7 oraciones por párrafo
      const paragraph = this.generateSentences(sentencesInParagraph);
      paragraphs.push(paragraph);
    }
    return paragraphs.join('\n\n');
  }

  /**
   * Genera texto Lorem Ipsum basado en el tipo y cantidad especificados
   * @param {string} type - Tipo de texto: 'words', 'sentences', 'paragraphs'
   * @param {number} count - Cantidad a generar
   * @returns {string} Texto generado
   */
  generate(type, count) {
    switch (type) {
      case 'words':
        return this.generateWords(count);
      case 'sentences':
        return this.generateSentences(count);
      case 'paragraphs':
        return this.generateParagraphs(count);
      default:
        return this.generateSentences(3); // Por defecto: 3 oraciones
    }
  }

  /**
   * Genera texto Lorem Ipsum con longitud aproximada en caracteres
   * @param {number} length - Longitud aproximada en caracteres
   * @returns {string} Texto generado
   */
  generateByLength(length) {
    let text = '';
    while (text.length < length) {
      const sentence = this.generateSentences(1);
      if (text.length + sentence.length <= length) {
        text += (text ? ' ' : '') + sentence;
      } else {
        // Agregar palabras hasta alcanzar la longitud deseada
        const remainingLength = length - text.length - 1;
        const words = this.generateWords(Math.ceil(remainingLength / 6));
        text += (text ? ' ' : '') + words.substring(0, remainingLength);
        break;
      }
    }
    return text;
  }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoremGenerator;
} else {
  window.LoremGenerator = LoremGenerator;
}