# Contributing to Retain360

Thanks for building with us. The rules are short.

## Branching

```bash
git checkout dev                        # always start from dev
git checkout -b yourname/feature        # e.g. dilshaan/graph-export
```

## Before you open a PR

```bash
npm run dev      # the page you touched works, no console errors
npm run build    # production build passes
```

Checklist:

- [ ] No new dependencies unless truly required
- [ ] Shared state stays in `App.jsx` — pages keep only local UI state
- [ ] Styles go in that surface's own stylesheet (`notes.css`, `dashboard.css`, …)
- [ ] Palette stays `#F1E4CC` / `#798165` / `#2C2725`
- [ ] Every button does something real

## PR flow

1. Push your branch to origin
2. Open a Pull Request into **`dev`**
3. One teammate reviews, then merge
4. `dev → main` happens only for demo-ready builds

That's it. Keep it simple, keep it explainable.
