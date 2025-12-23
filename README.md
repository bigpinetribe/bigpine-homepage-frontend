# Big Pine Paiute Tribe - Website Frontend

Modern static website for the Big Pine Paiute Tribe of the Owens Valley, built with Astro + React.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) with React islands
- **Styling**: Bootstrap 5
- **Authentication**: Supabase Auth
- **CMS**: TinaCMS (separate repo)
- **Hosting**: Cloudflare Pages

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:4321

## Project Structure

```
/
├── public/
│   ├── img/              # Static images
│   ├── forms/            # Downloadable PDF forms
│   └── department_media/ # Department-specific files
├── src/
│   ├── config/           # Configuration (departments, etc.)
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utilities (Supabase client, etc.)
│   ├── pages/            # Astro pages
│   └── styles/           # Global CSS
└── package.json
```

## Pages

- `/` - Home page
- `/login` - Member login
- `/account` - Member account page (protected)
- `/contact` - Contact information
- `/news` - News and events
- `/department/[slug]` - Department pages

## Deployment

This site is deployed to Cloudflare Pages. Push to `main` to trigger a deployment.

### Environment Variables (Cloudflare Pages)

Set these in Cloudflare Pages dashboard:

- `PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## Related Repos

- [bigpine-homepage-cms](https://github.com/kubishi/bigpine-homepage-cms) - TinaCMS content management
