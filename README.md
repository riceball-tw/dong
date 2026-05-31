<div align="center">
  <img alt="logo" src="./src/assets/images/brand/logo.svg#gh-light-mode-only" width="64" />
  <img alt="logo" src="./src/assets/images/readme/logo-light.svg#gh-dark-mode-only" width="64" />
</div>
<h1 align="center">
  Dong Blog
</h1>

<div align="center">
  Feature-rich blog theme that's battle tested and easy to use, Powered by astro.js v6 
</div>

<br />

> [!TIP]
> I've building and improving [my blog](https://www.webdong.dev/zh-tw/) for years, so i decided to make it generic theme and open source it. <br/>
> You might be intrested in building personal site too! Check out [Letter Portfolio theme](https://github.com/riceball-tw/letter)!

## Key Features

Start your online [posts](https://riceball-tw.github.io/dong/zh-tw/post/) or [shortposts](https://riceball-tw.github.io/dong/zh-tw/shortpost/) through fully typed markdown and settings. Check out the [GitHub Pages Demo](https://riceball-tw.github.io/dong/en/).

- Astro v6 + Tailwind v4
- Optimize for speed (100% lighthouse score)
- Responsive & SEO-friendly
- Built-in i18n
- CI pipeline (TypeScript / [Biome linter](https://biomejs.dev/) / [Cypress E2E testing](https://www.cypress.io/) / [Lighthouse](https://github.com/GoogleChrome/lighthouse))
- CD pipeline ([Cloudflare Pages](https://pages.cloudflare.com/) or [GitHub Pages](https://pages.github.com/))
- Build time Open Graph image generation
- Build time Page search

## Getting Started

### Development

```bash
# 1. Clone the repository
git clone https://github.com/riceball-tw/letter.git .

# 2. Install dependencies
pnpm install

# 3. Run development server
pnpm run dev
```

## Customization

1. `astro.config.mjs`: Astro configs
    - `site`: Your final, deployed URL
2. `/src/content`: Site config, posts, shortposts
3. `/src/i18n`: Translation used in astro templates
4. `/public`: Assets used in the site (favicon, og image)
5. `/src/assets`: Assets used in the site (logo, logomark)
6. `/src/styles/global.css`: Styles
7. `/.github/workflows/testing-and-deploy-pipeline.yml`: GitHub CI/CD pipeline (You should setup env base on `.env.example`)

### Build

```bash
# a. Locally
# Deploy the contents of the `./dist` folder wherever you like.
pnpm install
pnpm build
pnpm preview

# b. Build docker image
docker build -t <your-astro-image-name> .
docker run -p <local-port>:<container-port> <your-astro-image-name>
```

## Helping out

For questions or support, please open an issue on GitHub.

## License

MIT
