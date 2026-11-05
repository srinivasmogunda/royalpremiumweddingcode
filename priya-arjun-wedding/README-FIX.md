# v17 local server fix

The local Node server uses CommonJS because server/index.js uses `require()` and `__dirname`.
The Netlify functions remain `.mjs` and continue to run as ES modules.

Run:

```bash
cd priya-arjun-wedding-v17
node server/index.js
```

Open http://localhost:3000/
