# NeoBrutal

A **neobrutalist** theme for Hugo — thick black borders, hard offset shadows, flat saturated
colour fields, heavy grotesque type, arrow-ended list rows, grainy gradient accents.

It is a sibling of [PaperMod](https://github.com/adityatelange/hugo-PaperMod): it understands the same
site config (`menu.main`, `params.profileMode`, `params.socialIcons`, `params.label`, `ShowToc`, search,
tags, archives, dark-mode toggle, cover images …), so you can switch between them by changing one line.

## Switching themes

In `config.toml`:

```toml
# Neobrutalism
theme = ["NeoBrutal"]

# Back to PaperMod (+ this site's PaperMod customisations)
# theme = ["PaperModCustom", "PaperMod"]
```

## Options

```toml
[params.neobrutal]
palette = "green"   # green | sky | yellow | pink | lilac | orange | white
```

A single page can override it in front matter: `palette: sky`.

Dark mode follows `params.defaultTheme` exactly like PaperMod (`light`, `dark`, or auto) and
the toggle in the header; set `disableThemeToggle = true` to remove it.

## Customising

* All colours, borders and shadows are CSS variables in `assets/css/core/tokens.css`.
* Put your own CSS in `assets/css/extended/*.css` of your site — it is bundled last, so it wins.
* The variable names `--theme --entry --primary --secondary --tertiary --content --code-bg
  --code-block-bg --border` match PaperMod's, so CSS written for PaperMod keeps working.
* Utility classes for Markdown/HTML: `nb-mark` (highlighter), `nb-card` (any block as a card),
  `button` (purple action button).

## Hooks

Same as PaperMod: override `layouts/partials/extend_head.html` and `extend_footer.html` in your site.

## Credits

Template structure (partials, shortcodes, fuse.js search) derived from PaperMod (MIT) by
Aditya Telange and nanxiaobei. Visual design by Anil Battalahalli.
