# Image preparation scripts

- `m6_figures.py`: Smysly figures (Milestone 6). Crops Figs. 95, 165, 167, 170 and 173 from the Internet Archive page scans of the 1901 edition (`anatomyofcat00reig`, leaves 0251, 0434, 0437, 0446, 0449), turns them gray, maps the paper to white and saves lossless WebP into `images/smysly/`. The page scans are not in the repo; their URLs and SHA-256 are in `sources/image-licenses.md`.

  ```
  python3 tools/images/m6_figures.py <folder with anatomyofcat00reig_NNNN.jpg> images/smysly
  ```
