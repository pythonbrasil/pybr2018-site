import showdown from 'showdown';
import TransitionManager from 'app/TransitionManager';

export default class CodeOfConduct {
  constructor() {
    this.transitionManager = new TransitionManager();
    this.fetchCodeOfConduct();
  }

  fetchCodeOfConduct() {
    fetch('https://raw.githubusercontent.com/pythonbrasil/codigo-de-conduta/master/README.md')
    .then((response) => response.text())
    .then((markdown) => this.parseMarkdown(markdown))
    .catch(() => {
      setTimeout(this.fetchCodeOfConduct.bind(this), 3000);
    })
  }

  parseMarkdown(markdown) {
    const [portugueseCodeOfConduct, englishCodeOfConduct] = this.splitArticles(markdown);
    const converter = new showdown.Converter();
    const portugueseCodeOfConductHtml = converter.makeHtml(this.removeTitle(portugueseCodeOfConduct));
    const englishCodeOfConductHtml = converter.makeHtml(this.removeTitle(englishCodeOfConduct));
    this.renderCodeOfConduct('#codeOfConductEnglish', englishCodeOfConductHtml);
    this.renderCodeOfConduct('#codeOfConductPortuguese', portugueseCodeOfConductHtml);
  }

  renderCodeOfConduct(selector, content) {
    const container = document.querySelector(selector);
    if (container) {
      const parsedHtml = (new DOMParser).parseFromString(content, 'text/html')
      this.transitionManager.fadeContent(container, 'fade-out')
      .then(() => {
        container.innerHTML = '';
        for (const node of parsedHtml.body.childNodes) {
          container.appendChild(node);
        }
        this.transitionManager.fadeContent(container, 'fade-out');
      })
    }
  }

  splitArticles(markdown) {
    const articles = [];
    const lastArticleIndex = markdown.lastIndexOf('\n# ');
    if (lastArticleIndex < 0) {
      return [markdown];
    }
    const lastArticle = markdown.slice(lastArticleIndex, markdown.length);
    articles.push(lastArticle);
    const otherArticles = markdown.slice(0, markdown.length - lastArticle.length);
    if (otherArticles.indexOf('\n# ') > 0) {
      articles.append(this.splitArticles(otherArticles));
    } else {
      articles.push(otherArticles);
    }
    return articles.reverse();
  }

  removeTitle(markdown) {
    const titleIndex = markdown.indexOf('#');
    const markdownWithoutBlankLines =  markdown.slice(titleIndex, markdown.length);
    return markdownWithoutBlankLines.slice(markdownWithoutBlankLines.indexOf('\n'), markdownWithoutBlankLines.length);
  }
}