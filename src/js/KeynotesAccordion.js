const content = [
  {
    title: 'Daniela Petruzalek',
    subtitle: 'Consultora de Desenvolvimento sênior na Thoughtworks',
    text: '<p>Daniela Petruzalek é formada em Análise e Desenvolvimento de Sistemas. Ao longo de 14 anos de carreira já trabalhou com diversos tipos de sistemas, de firmware em sistemas embarcados a aplicações web, mas hoje atua principalmente com Big Data e Machine Learning. Também é reconhecida pelo Google como Google Developer Expert (GDE) em Google Cloud Platform e é uma das líderes do Women Who Go, iniciativa voltada a inclusão de mulheres na comunidade Go. Nas horas vagas gosta de praticar corrida de rua, video games e apertar os seus dois gatos pretos =^.^=</p>',
    externalLink: {name: 'LinkedIn', url: 'https://www.linkedin.com/in/petruzalek/'}
  },
  {
    title: 'Painel sobre dados abertos e tecnologias cívicas',
    subtitle: 'Mediação: Mário Sérgio',
    text: '<p>Não é novidade que o tema transparência está em pauta há algum tempo. A tecnologia e a sociedade evoluíram e demandam ainda mais do poder publico que informações e dados estejam disponíveis, e não só disponíveis, mas acessíveis de uma forma que possam se tornar úteis.</p><p>Isso acontece hoje? Temos visibilidade real de como somos governados? O que acontece com o dinheiro de nossos impostos? Quais são as dificuldades encontradas nesse processo?</p><p>A Python Brasil vai unir profissionais que estão trabalhando nessa área, buscando dados e transformando-os em informação diariamente e promovendo iniciativas de controle social na comunidade. Teremos a oportunidade de conhecer a realidade das pessoas que trabalham diariamente em uma missão que não e fácil.</p><p>O que você gostaria de saber?</p>',
    externalLink: {name: 'Facebook Post', url: 'https://www.facebook.com/pythonbrasil/photos/a.582882565067606/2059147497441098/?type=3&theater'}
  },
  {
    title: 'Judite Cypreste',
    subtitle: 'Repórter no Aos Fatos',
    text: 'Judite Cypreste é repórter do Aos Fatos. Formada em letras pela PUC-RJ, está no 8º semestre de jornalismo na Uerj, onde também cursa pós-graduação em jornalismo cultural. Ex-trainee de jornalismo de dados da Folha de S.Paulo, realizou reportagens usando Python e raspagens de dados. É também autora do Projeto Coração Radiante, onde fez análise de sentimentos dos torcedores brasileiros durante a Copa do Mundo.',
    externalLink: {name: 'Medium', url: 'https://medium.com/projeto-cora%C3%A7%C3%A3o-radiante'}
  },
  {
    title: 'Aisha Bello',
    subtitle: 'Virtual Systems Engineer at Cisco',
    text: '<p>Em 2015 Aisha ganhou o prêmio <i>Malcolm Tredinnick Memorial Django</i> por sua contribuição para a comunidade por meio do seu trabalho no DjangoGirls. Em 2017 ela foi honrada pela Python Software Foundation como PSF Fellow.</p><p>Além de ser vice presidente da Python Users Nigeria Group, Aisha organizou o primeiro evento de Django Girls na Nigéria e ajudou a organizar muitos workshops em Namíbia e na Nigéria. Atualmente atua como membro de uma equipe de suporte para DjangoGirls. Foi uma das fundadoras e co-organizadoras do PyLadies Nigeria, onde ensina meninas e mulheres a codar em Python. Também co-organiza e atua como presidente de conferência da PyCon Nigeria.</p><p>Aisha é uma entusiasta da comunidade Python com uma forte paixão por mudança social, educação tecnológica e empoderamento das mulheres na África.</p><p>Atualmente Aisha trabalha como Engenheira de Sistemas Virtuais na Cisco Systems Nigeria, como Especialista em DataCenter para clientes corporativos.</p>',
    externalLink: {name: 'LinkedIn', url: 'https://www.linkedin.com/in/aishaobello/'}
  }
];

// class KeynotesAccordion {
//   constructor() {
//     this.container = document.querySelector('#keynotes');
//     this.articleDOMObjects = {
//       flag: this.container.querySelector('.keynote_flag'),
//       picture: this.container.querySelector('.keynote_picture'),
//       title: this.container.querySelector('.keynote-title'),
//       subtitle: this.container.querySelector('.keynote-subtitle'),
//       text: this.container.querySelector('.keynote-text'),
//       externalLink: this.container.querySelector('.keynote-button-area a')
//     };
//     this.initializeMenu();
//     this.changeCurrentKeynote(0);
//   }
//
//   initializeMenu() {
//     const menuContainer = Array.from(this.container.querySelectorAll('.accordion-tabs li'));
//     menuContainer.forEach((menuItem, index) => {
//       menuItem.querySelector('.tab-link').addEventListener('click', this.changeCurrentKeynote.bind(this, index));
//     })
//   }
//
//   changeCurrentKeynote(index, e) {
//
//     if (e)
//       e.preventDefault();
//     const { flag, picture, externalLink, text, ...article } = this.articleDOMObjects;
//     flag.setAttribute('class', `keynote_flag flag-${index+1}`);
//     picture.setAttribute('class', `keynote_picture keynote_picture-${index+1}`);
//     externalLink.setAttribute('href', content[index].externalLink.url);
//     externalLink.innerText = content[index].externalLink.name;
//     const textHtml = (new DOMParser).parseFromString(content[index].text, 'text/html');
//     text.innerHTML = '';
//     for (const node of Array.from(textHtml.body.childNodes)) {
//       text.appendChild(node);
//     }
//     for (const articleProperty in article) {
//       article[articleProperty].innerText = content[index][articleProperty];
//     }
//   }
// }
//
// export default KeynotesAccordion;
