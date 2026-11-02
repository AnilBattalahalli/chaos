# NeoBrutal

A calm **neobrutalist** theme for Hugo, modelled on the neobrutalism component kit: 2px black borders,
5px corner radius, a crisp 4px hard shadow that collapses when you hover/press, a soft tinted page,
white cards, one "main" accent colour, DM Sans.

It understands the same site config as PaperMod (`menu.main`, `params.profileMode`, `params.socialIcons`,
`ShowToc`, search, tags, archives, dark-mode toggle, cover images …), so switching is one line:

```toml
theme = ["NeoBrutal"]
# theme = ["Bauhaus"]
# theme = ["PaperModCustom", "PaperMod"]
```

## Options

```toml
[params.neobrutal]
palette = "blue"   # blue | green | yellow | pink | lilac | orange | white
```

The palette sets the page tint and the accent ("main") colour. Override per page with front matter:
`palette: yellow`. Dark mode follows `params.defaultTheme` exactly like PaperMod; `disableThemeToggle = true`
removes the toggle.

## Site applets

`assets/css/extended/applets.css` re-skins the site's full-page apps (Kali, Nakshe, Learn German — pages
with `layout: blank`, which get `body.applet`) with the theme's tokens so they look like the rest of the site.
It is bundled only with this theme; the apps' own CSS in the site's `assets/css/extended/` is untouched.

## Customising

* Everything visual is a CSS variable in `assets/css/core/tokens.css`.
* Your own CSS in `assets/css/extended/*.css` is bundled last and wins.
* PaperMod-compatible variable names (`--theme --entry --primary --secondary --tertiary --content --code-bg
  --code-block-bg --border`) keep PaperMod-era site CSS working. `--theme` is the *surface* colour; the page
  colour is `--nb-page`.
* Markdown/HTML utilities: `nb-mark` (highlighter), `nb-card` (any block as a card), `button`.

## Credits

Template structure (partials, shortcodes, fuse.js search) derived from PaperMod (MIT) by Aditya Telange and
nanxiaobei. Visual language follows the neobrutalism component kit. Theme by Anil Battalahalli.
