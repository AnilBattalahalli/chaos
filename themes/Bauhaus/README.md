# Bauhaus

A **Bauhaus**-inspired theme for Hugo: primary red / blue / yellow on warm paper, a circle–square–triangle
motif, flat colour blocks, thick black rules, lowercase geometric sans (Jost), numbered rows, no shadows.

It understands the same site config as PaperMod (`menu.main`, `params.profileMode`, `params.socialIcons`,
`ShowToc`, search, tags, archives, dark-mode toggle, cover images …), so switching is one line:

```toml
theme = ["Bauhaus"]
# theme = ["NeoBrutal"]
# theme = ["PaperModCustom", "PaperMod"]
```

## Options

```toml
[params.bauhaus]
palette = "classic"   # classic (red lead) | blue | yellow
```

The palette picks which primary leads (page-title bar, logo, active menu, first card, links on hover);
the other two follow. Override per page with front matter: `palette: blue`.

Dark mode follows `params.defaultTheme` exactly like PaperMod; `disableThemeToggle = true` removes the toggle.

## Customising

* Colours, rules and type are CSS variables in `assets/css/core/tokens.css`.
* Your own CSS in `assets/css/extended/*.css` is bundled last and wins.
* PaperMod-compatible variable names (`--theme --entry --primary --secondary --tertiary --content --code-bg
  --code-block-bg --border`) keep PaperMod-era site CSS working. `--theme` is the *surface* colour; the page
  colour is `--bh-page`.
* Markdown/HTML utilities: `bh-mark` (yellow highlighter), `bh-block` (a coloured block), `button`.

## Credits

Template structure (partials, shortcodes, fuse.js search) derived from PaperMod (MIT) by Aditya Telange and
nanxiaobei. Visual design by Anil Battalahalli.
