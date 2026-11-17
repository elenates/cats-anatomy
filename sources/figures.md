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

## Organ close-ups (Milestone 4, `images/organy/`)

Letter keys from the captions, or from the text where the caption has none. Which labels get a hotspot is decided with the content in stage 5b; the 1901 letters stay on the figures, as on the Kostra detail figures.

- **Fig. 97** (`stomach.webp`, 350×321): Stomach, Ventral View. a, œsophagus; b, cardiac end of the stomach; c, lesser curvature; d, greater curvature; e, fundus; f, pyloric valve; g, part of duodenum.
- **Fig. 102** (`pancreas-spleen.webp`, 1000×809): Pancreas and Spleen (stomach turned caudad). a, pancreas (duodenal and gastric portion); b, pancreatic duct; c, duodenum; d, stomach; e, spleen.
- **Fig. 106** (`lungs.webp`, 450×441): Ramifications of the Bronchi, with Outlines of the Lobes of the Lungs, Ventral View. 1–4, lobes of the right lung; 1′–3′, lobes of the left lung; a, trachea; b, eparterial bronchus.
- **Fig. 108** (`kidney.webp`, 531×500): Left Kidney, Ventral Surface. a, renal artery; b, renal vein; c, ureter (key in the text, p. 255).
- **Fig. 109** (`kidney-section.webp`, 461×500): Median Longitudinal Section of Kidney. a, medullary portion; b, cortical portion; c, papilla; d, pelvis; e, renal artery; f, renal vein; g, ureter (key in the text, p. 255).
- **Fig. 115** (`heart.webp`, 558×1250): Heart, Ventral View. Key in the text (pp. 274–275): a, right ventricle; b, left ventricle; c, right auricular appendage; d, left auricular appendage; f, pulmonary artery; g, aorta; q, coronary artery; other letters are vessels.
- **Fig. 117** (`heart-open.webp`, 878×750): Heart, with Right Ventricle laid open to show the Tricuspid Valve. a, trabeculæ; b, columnæ carneæ; c, chordæ tendineæ; d, d′, d″, the three flaps of the tricuspid valve; e, aorta; f, conus arteriosus, laid open; g, semilunar valves of the pulmonary artery.
- **Fig. 137** (`brain.webp`, 500×548): Dorsal Surface of the Brain. I, olfactory bulbs; II, cerebral hemispheres; III, cerebellum; IV, medulla; a–i sulci; j, vermis; k, cerebellar hemispheres; l, roof of fourth ventricle; m, first cervical nerve; 1–8 gyri.
- **Fig. 111** (`repro-male.webp`, 350×523): Male Genital Organs. a, bladder; b, b′, ureters; c, vasa deferentia; d, spermatic cord; e, spermatic artery and vein; f, neck of bladder; g, prostate gland; h, urethra; i, bulbourethral (Cowper's) gland; j, corpus cavernosum penis; k, ischiocavernosus muscle (cut); l, penis; m, glans penis; n, testis.
- **Fig. 112** (`repro-female.webp`, 566×900, cropped from 566×1250): Female Urogenital Organs, Obliquely Ventral View. a, kidney; b, ureter; c, ovary; d, ostium tubae abdominale; e, uterine (Fallopian) tube; f, cornua of the uterus; g, cranial edge of broad ligament; h, round ligament of the uterus; i, body of the uterus; j, bladder; k, neck of the bladder; l–p (cervix, vagina, vestibule) are below the crop; 1–8 are vessels and nerves.

## Svaly (Milestone 5)

Keys copied from the figure captions on the Gutenberg page. Which letters become hotspots, and under which Czech name, is decided in stage 2 (content) and stage 3 (hotspots).

- **Fig. 68** (`images/svaly/muscles-superficial.webp`, 1250×705): First Layer of Body-muscles, beneath the Skin and Skin-muscles. a, M. frontoscutularis; b, M. masseter; c, M. sternomastoideus; d, M. clavotrapezius; e, M. clavobrachialis; f, M. levator scapulæ ventralis; g, M. acromiodeltoideus; h, M. acromiotrapezius; i, M. spinodeltoideus; j, M. spinotrapezius; k, caput longum of M. triceps brachii; l, caput laterale of M. triceps brachii; m, M. latissimus dorsi; n, M. xiphihumeralis; o, M. pectoralis minor; p, M. obliquus abdominis externus; q, M. sartorius; r, M. tensor fasciæ latæ; s, M. caudofemoralis; t, M. biceps femoris; u, M. semitendinosus; v, M. extensor caudæ lateralis; w, M. abductor caudæ externus; x, M. flexor caudæ longus; y, lumbodorsal fascia, superficial layer; z, fascia lata. 1, parotid gland; 2, submaxillary gland.
- **Fig. 73** (`images/svaly/muscles-deep.webp`, 1500×507): Body Muscles exposed after Removal of the Forelimb and the Muscles shown in Fig. 68. a, M. occipitoscapularis (cut); b, M. splenius; c, M. levator scapulæ ventralis (cut); d, M. cleidomastoideus (cut); e, M. longus capitis; f, M. scalenus (f′, middle division; f″, dorsal division; f‴, ventral division; f, cervical portion); g, M. longissimus capitis; h, M. levator scapulæ (cut); i, M. serratus anterior (cut); j, M. transversus costarum; k, M. rectus abdominis (k′, its tendon); l, M. serratus posterior superior; m, M. intercostales externi; n, M. serratus posterior inferior; o, M. obliquus abdominis internus; p, lumbodorsal fascia.
- **Fig. 90** (`images/svaly/muscles-hindleg.webp`, 506×1250): Muscles on the Lateral Side of the Leg, after Removal of the Muscles shown in Fig. 68 (Biceps, Tensor fasciæ latæ, Caudofemoralis, and Gluteus maximus). a, M. sartorius; b, M. gluteus medius; c, M. rectus femoris; d, M. vastus lateralis; e, M. obturator internus; f, M. quadratus femoris; g, M. tenuissimus; h, M. adductor femoris; i, M. semimembranosus; j, M. semitendinosus; k, M. vastus intermedius; l, M. plantaris; m, m′, m″, M. gastrocnemius, outer head (m, part from the external sesamoid bone; m′, from the plantaris; m″, from the superficial fascia); n, M. tibialis anterior; o, M. soleus; p, M. extensor longus digitorum; q, M. peroneus longus; r, M. peroneus tertius (r′, its tendon); s, M. peroneus brevis; t, tendon of Achilles; u, M. extensor brevis digitorum. 1, great trochanter of femur; 2, tuberosity of ischium, with cut origin of M. biceps femoris; 3, patella; 4, calcaneus; 5, transverse ligaments; 6, lateral malleolus.

## Smysly (Milestone 6, `images/smysly/`)

Keys copied from the figure captions (Gutenberg page, checked against the 1901 scan). Which letters become hotspots, and under which Czech name, is decided in stage 2 (content) and stage 3 (hotspots).

- **Fig. 167** (`eye.webp`, 560×661): Diagram of a Section of the Eye. a, optic nerve; b, sclerotic (b′, thickened "white zone"); c, cornea; d, choroid; e, iris; f, ciliary body; g, retina; h, crystalline lens; i, zonula ciliaris; j, anterior chamber of eye; k, vitreous humor.
- **Fig. 173** (`inner-ear.webp`, 432×333): Membranous Labyrinth. a, vestibule; b, cochlea; c, external semicircular canal; d, superior semicircular canal; e, posterior semicircular canal; f, scala tympani; g, scala vestibuli; h, fenestra cochleæ; i, fenestra vestibuli.
- **Fig. 170** (`eardrum.webp`, 667×468): Tympanic Membrane, Viewed from the Inner Side (outer wall of the bulla removed with the membrane, malleus and incus). a, bony ring forming inner end of external auditory meatus; b, b′, malleus; c, tympanic membrane; d, incus; e, lenticular process; f, chorda tympani nerve; g, cartilaginous support for chorda tympani nerve.
- **Fig. 95** (`tongue.webp`, 728×1653): Tongue, Epiglottis, and Opening of Larynx. a, filiform papillæ; b, fungiform papillæ; b′, very large papillæ at the sides of the tongue; c, circumvallate papillæ; d, tonsils; e, epiglottis; f, plica aryepiglottica; g, arytenoid cartilages (covered with mucosa); h, glottis; i, false vocal cords; j, true vocal cords.
- **Fig. 165** (`third-eyelid.webp`, 293×238): Inner Surface of Membrana nictitans, showing the supporting cartilage and Harderian glands. a, supporting cartilage; b, Harderian glands; c, outer edge. Picture for a fact card, no hotspots.
- Not used: Fig. 166 (eye muscles), Figs. 168–169 (ear cartilage and its muscles; Lenka: leave out), Figs. 171–172 (malleus, incus, stapes alone).

