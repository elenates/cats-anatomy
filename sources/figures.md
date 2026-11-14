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

## Detail figures (Milestone 2)

All seven are the large versions linked from the 1901 figures in the Gutenberg
HTML edition. The original letters are **kept** (decision in #3). Captions
are quoted from the eBook; where a figure has no letter key in its caption, the
letters are taken from the body text.

### Fig. 47 — Humerus, Ventral Side (`images/kostra/humerus.webp`, 257×1000)

| Label | 1901 text | Item id | Notes |
|-------|-----------|---------|-------|
| whole bone | humerus | `kost-pazni` | |
| q | supracondyloid foramen | `kost-pazni` | The hole named in the *Zajímavost* text (cat has it, dog does not) |
| other letters | head, tubercles, fossae, condyles | — | Too detailed for the app |

### Fig. 49 — Radius and Ulna, Dorsolateral View (`images/kostra/radius-ulna.webp`, 336×1500)

| Label | 1901 text | Item id | Notes |
|-------|-----------|---------|-------|
| I | radius | `kost-vretenni` | |
| II | ulna | `kost-loketni` | Upper end of II is the olecranon (point of the elbow) |
| other letters | notches, processes | — | Too detailed for the app |

### Fig. 51 — Carpus, Metacarpus and Phalanges, Dorsal Surface (`images/kostra/forepaw.webp`, 499×1000)

| Label | 1901 caption | Item id | Notes |
|-------|--------------|---------|-------|
| a–g | scapholunar, cuneiform, pisiform, trapezium, trapezoid, os magnum, unciform | `kosti-zapestni` | Carpal bones |
| h | radial sesamoid | — | |
| 1–5 | metacarpals, from the radial side | `kosti-zaprstni` | 1 is the short first metacarpal |
| i, j | proximal and second phalanges | `prsty-predni` | Digit 1 (dewclaw) has no second phalanx |
| k | distal phalanges | `clanek-drapovy` | With the claws |

### Fig. 55 — Innominate Bone of Adult Cat, Ventrolateral View (`images/kostra/pelvis.webp`, 683×1250)

| Label | 1901 caption | Item id | Notes |
|-------|--------------|---------|-------|
| whole bone | innominate bone | `panev` | = Os coxae, *Pánevní kost* |
| I | ilium | `kost-kycelni` | |
| II | ischium | `kost-sedaci` | g = tuberosity of the ischium (hamstring origin, see NCSU-THIGH) |
| III | pubis | `kost-stydka` | |
| d | acetabulum | `kycelni-kloub` | The "socket" of the ball-and-socket hip |
| other letters | spines, notches, foramen, lines | — | Too detailed for the app |

### Fig. 56 — Left Femur, Ventral Side (`images/kostra/femur.webp`, 353×1250)

| Label | 1901 caption | Item id | Notes |
|-------|--------------|---------|-------|
| whole bone | femur | `kost-stehenni` | |
| a | head | `kost-stehenni` | The "ball" of the hip joint |
| other letters | neck, trochanters, condyles, fossae | — | Too detailed for the app |

### Fig. 57 — Tibia and Fibula of Left Leg, Dorsal View (`images/kostra/tibia-fibula.webp`, 281×1250)

| Label | 1901 caption | Item id | Notes |
|-------|--------------|---------|-------|
| I | tibia | `kost-holenni` | e = tubercle for the patellar ligament |
| II | fibula | `kost-lytkova` | h = head, i = lateral malleolus |
| other letters | condyles, spine, crest, malleoli | — | Too detailed for the app |

### Fig. 58 — Tarsus, Metatarsus and Phalanges of Left Foot, Ventral View (`images/kostra/hindpaw.webp`, 371×1250)

| Label | 1901 caption | Item id | Notes |
|-------|--------------|---------|-------|
| a | calcaneus | `kost-patni` | |
| b–g | astragalus, cuboid, scaphoid, lateral and medial cuneiform | `kosti-zanartni` | Tarsal bones |
| 1 | rudimentary first (medial) metatarsal | `kosti-nartni` | Matches the review note on MT I |
| 2–5 | the other metatarsals | `kosti-nartni` | The 4 developed metatarsals |
| i, j, k | proximal, second, distal phalanges | `prsty-zadni` | |
| h, l | peroneal groove, sesamoid bones | — | |
