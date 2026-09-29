# BHMMS Paddle Sandbox build

This is the full BHMMS application with the existing login, dashboard, meals, expenses, members, reports and subscription pages.

Paddle Sandbox configuration is already included for the subscription page:
- Monthly: `pri_01m3q9knsr63ggzncr0q69vcn3`
- Yearly: `pri_01m3q9n8wmc5bfs9bpv42fexvs`
- Client-side token is loaded from `.env.production`.

## Deploy
Upload this folder as a Vercel project. Vercel should detect Vite and run `npm run build`.

The Paddle Sandbox account must still have a Default Payment Link configured. Paddle controls that account-side setting, so application code cannot replace it.
