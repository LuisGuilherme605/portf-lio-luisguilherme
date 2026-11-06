# Portfólio - Luis Guilherme

[Ver online](https://luisguilherme605.github.io/portf-lio-luisguilherme/)

Meu site pessoal. Fiz pra mostrar meus projetos, o que eu sei fazer e como me encontrar. HTML, CSS e JavaScript puro.

## O que tem

- Command palette (Ctrl/Cmd + K): busca pra navegar e agir — pular pra seção, abrir projeto, copiar e-mail, trocar idioma. Teclado completo (setas, Enter, Esc), busca sem acento e ARIA de combobox/listbox
- Robô 3D feito com Three.js que segue o cursor (só desktop)
- Troca de idioma PT/EN, detecta o idioma do navegador e lembra a escolha
- Barra de progresso de leitura no topo da página
- Scrollspy: o link da nav acende na seção que tá sendo lida (IntersectionObserver)
- Botão "voltar ao topo" que aparece depois de rolar
- Relógio de Brasília ao vivo no hero (Intl, fuso America/Sao_Paulo)
- Efeito de inclinação 3D nos cards no hover
- Animações no scroll com IntersectionObserver
- Menu mobile com focus trap e fechamento com Esc
- Marquee de stack em CSS puro
- Responsivo, respeita `prefers-reduced-motion`
- Acessibilidade: skip link, foco visível no teclado, aria sincronizado
- Segurança: CSP via meta, SRI no Three.js, referrer-policy

## Tecnologias

HTML5, CSS3, JavaScript (ES2015+), Three.js, Google Fonts (Sora + Space Mono).

## Estrutura

```
index.html           página principal
style.css            estilos
features.css         toggle de idioma e botão de WhatsApp
enhancements.css     estilos da command palette e dos detalhes em JS
script.js            menu, scroll, tilt 3D, contador de stats
features.js          lógica PT/EN
command-palette.js   command palette (Ctrl/Cmd + K)
enhancements.js      progresso de leitura, scrollspy, voltar ao topo, relógio
robot3d.js           robô 3D (Three.js)
robots.txt           diretiva pros crawlers
sitemap.xml          mapa do site
```

## Como rodar

```bash
git clone https://github.com/LuisGuilherme605/portf-lio-luisguilherme.git
cd portf-lio-luisguilherme
```

Abre `index.html` no navegador, ou usa o Live Server do VS Code pra pegar hot-reload.

## Deploy

Deploy automático via GitHub Pages em cada push na `main` (`.github/workflows/pages.yml`).

## Contato

Email: lg5104891@gmail.com
LinkedIn: [luis-guilherme-dev](https://www.linkedin.com/in/luis-guilherme-126072360)
WhatsApp: [(61) 99873-0501](https://wa.me/5561998730501)
