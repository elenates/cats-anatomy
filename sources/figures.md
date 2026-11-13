# Figure keys

Original label keys of the figures used in the app, copied from the captions in
Reighard & Jennings (1901), Project Gutenberg eBook #58394, with the matching
`data/kostra.js` item ids. Used for drawing hotspots (stage 4) and for deciding
which original labels to hide or translate.

Terminology in the 1901 captions is historical (BNA era); the app uses NAV terms.

## Fig. 1 — Skeleton of Cat (`images/kostra/skeleton.webp`, 1500×804)

Left side view, head to the right. Both fore- and both hind limbs are drawn, so
some letters appear twice.

| Label | 1901 caption | Item id(s) | Notes |
|-------|--------------|------------|-------|
| a | skull | `lebka` | Mandible drawn but not labelled separately → `dolni-celist` is on Fig. 1 too |
| b | hyoid | — | Not in the Kostra list |
| c | cervical vertebræ | `krcni-obratle` | Atlas and axis are the first two (`nosic`, `cepovec`) |
| d | clavicle | `klicni-kost` | Visible: answers the open question in the review sheet (row 25) |
| e | scapula | `lopatka` | |
| f | sternum | `hrudni-kost` | |
| g | humerus | `kost-pazni` | |
| h | radius | `kost-vretenni` | |
| i | ulna | `kost-loketni` | |
| j | carpus | `kosti-zapestni` | |
| k | metacarpus | `kosti-zaprstni` | |
| l | phalanges (fore) | `prsty-predni` | |
| m | thoracic vertebræ | `hrudni-obratle` | |
| n | ribs | `zebra` | |
| o | lumbar vertebræ | `bederni-obratle` | |
| p | innominate bones | `panev` | Ilium / ischium / pubis not separated on this figure |
| q | femur | `kost-stehenni` | |
| r | patella | `ceska` | |
| s | fibula | `kost-lytkova` | |
| t | tibia | `kost-holenni` | |
| u | tarsus | `kosti-zanartni` | Calcaneus is the backward projection at u → `kost-patni` |
| v | metatarsus | `kosti-nartni` | |
| w | phalanges (hind) | `prsty-zadni` | |
| x | sacrum | `kost-krizova` | |
| y | caudal vertebræ | `ocasni-obratle` | |

Joints (`ramenni-kloub`, `loketni-kloub`, `zapestni-kloub`, `kycelni-kloub`,
`kolenni-kloub`, `hlezenni-kloub`) are not labelled but their positions are
clear on Fig. 1. `pater` = c + m + o + x + y together.

## Fig. 40 — Skull, Side View (`images/kostra/skull.webp`, 1250×691)

Cranium **without the mandible**. Numbers are bones and teeth; letters are
features.

| Label | 1901 caption | Item id | Notes |
|-------|--------------|---------|-------|
| 1 | occipital bone | `kost-tylni` | |
| 2 | interparietal | — | |
| 3 | parietal | `kost-temenni` | |
| 4 | temporal | `kost-spankova` | |
| 5, 5′ | frontal | `kost-celni` | |
| 6 | malar | `kost-licni` | Malar = zygomatic bone |
| 7 | sphenoid | — | |
| 8 | palatine | — | |
| 9 | presphenoid | — | |
| 10 | maxillary | `horni-celist` | |
| 11 | nasal | `kost-nosni` | |
| 12 | premaxillary | — | = os incisivum, mentioned in `horni-celist` text |
| 13 | incisor teeth | `zuby` | Upper teeth only |
| 14 | canine | `spicak` | |
| 15–17 | premolars | `zuby` | |
| 18 | molar | `zuby` | |
| k | zygomatic process of temporal bone | `jarmovy-oblouk` | Arch = 6 + k |
| l | mandibular fossa | `celistni-kloub` | Jaw joint socket; the mandible itself is not drawn |
| n, o | zygomatic process of frontal, supraorbital margin | `ocnice` | Rim of the orbit |
| a–j, m, p–y | other features (condyle, crests, bulla, foramina, fossae) | — | Too detailed for the app |

Not on Fig. 40: `dolni-celist` (mandible). Use Fig. 1, or add the 1901 mandible
figure later.
