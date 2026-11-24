// Liga as classes do Tailwind às variáveis de tema (definidas no tema.css de cada tenant).
// Ex.: bg-primaria → var(--cor-primaria). O layout é o mesmo; só as variáveis mudam.
// Lido pelo gerador (_gerador/gerar.mjs), que compila assets/vitrine.css: o navegador não carrega mais este arquivo.
module.exports = {
  // Roda a partir de prototipo/. Varre os HTML gerados e o app.js (que monta algumas classes na hora).
  content: ['./**/*.html', './assets/app.js', '!./_gerador/**', '!./docs/**', '!./_publicacao/**'],
  theme: {
    extend: {
      colors: {
        fundo: 'var(--cor-fundo)',
        superficie: 'var(--cor-superficie)',
        'superficie-2': 'var(--cor-superficie-2)',
        texto: 'var(--cor-texto)',
        suave: 'var(--cor-texto-suave)',
        borda: 'var(--cor-borda)',
        primaria: 'var(--cor-primaria)',
        'primaria-suave': 'var(--cor-primaria-suave)',
        'sobre-primaria': 'var(--cor-sobre-primaria)',
        secundaria: 'var(--cor-secundaria)',
      },
      fontFamily: {
        titulo: 'var(--fonte-titulo)',
        corpo: 'var(--fonte-corpo)',
      },
      borderRadius: {
        tema: 'var(--raio)',
        'tema-lg': 'var(--raio-grande)',
      },
    },
  },
};
