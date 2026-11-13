# Image licences

Every image file in `images/` must have a row here **before** it is used in the app.

Rules:
- *Source URL* is the page the file was actually downloaded from, opened and checked.
- *Licence* records the status as stated on the source page (and why it applies, e.g. publication year).
- *Changes made* lists every edit: crop, contrast, denoise, label removal/translation, format conversion, resize.
- Images from verification-only sources (IMAIOS, University of Minnesota, University of Illinois) are never added.

| File | Structure / content | Source URL (verified) | Author | Licence | Changes made | Used where |
|------|---------------------|-----------------------|--------|---------|--------------|------------|
| `images/kostra/skeleton.webp` | Fig. 1, "Skeleton of Cat." Whole skeleton, left side view, head to the right; original letter labels a–y kept | File: https://www.gutenberg.org/cache/epub/58394/images/illo002lg.png (PNG, 1500×804, SHA-256 `18f506ea…94f263e9`). Page: https://www.gutenberg.org/ebooks/58394 (Project Gutenberg eBook #58394, figure at https://www.gutenberg.org/cache/epub/58394/pg58394-images.html#Fig1) | Drawn by Louise Burridge Jennings, in J. Reighard & H. S. Jennings, *Anatomy of the Cat*, New York: Henry Holt, 1901 | Public domain. Gutenberg page states "Public domain in the USA" (published 1901). Czech Republic/EU (life + 70 years): Reighard d. 1942, H. S. Jennings d. 1947, Louise Burridge Jennings d. before 1939 (Smithsonian Institution Archives, SIA Acc. 90-105) | Levels: paper ≥ 225 → white, ink ≤ 40 → black, linear between; speck removal (no specks found); crop to content + 16 px (no effective change); PNG → lossless WebP (55 KB). Size unchanged 1500×804, so hotspot pixel coordinates match the original | Kostra overview (stage 5), hotspots (stage 4), quiz (stage 6) |
| `images/kostra/skull.webp` | Fig. 40, "Skull, Side View." Cranium only, **without the mandible**; original number/letter labels 1–18 and a–y kept | File: https://www.gutenberg.org/cache/epub/58394/images/illo053lg.jpg (JPEG, 1250×691, SHA-256 `7ceb8e77…44ad9fde27c`). Page: https://www.gutenberg.org/ebooks/58394 (figure at https://www.gutenberg.org/cache/epub/58394/pg58394-images.html#Fig40) | as above | as above | Levels as above (also removes JPEG grey haze around the drawing); speck removal (none found); crop to content + 16 px (no effective change); JPEG → lossless WebP (286 KB). Size unchanged 1250×691 | Part screen "Lebka a čelisti" (stage 5) |

Note: the Project Gutenberg licence applies to the eBook as a whole and to the "Project Gutenberg" trademark; the 1901 figures themselves are public domain. The app does not use the Gutenberg name except in attribution.
