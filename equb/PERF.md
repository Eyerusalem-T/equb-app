# Performance (fill from the DEPLOYED build, Lighthouse mobile, throttled)

| Metric | Target | Before | After | Cause of change |
|---|---|---|---|---|
| LCP | under 2.5 s | | | |
| CLS | under 0.1 | | | |
| INP | under 200 ms | | | |
| Largest image | about 150 kB | none (no raster images) | none | Design uses CSS and SVG only |

Built-in choices: no web fonts (system stacks), no images, one tiny client island on the landing page, SVG progress ring rendered on the server, static landing page.
