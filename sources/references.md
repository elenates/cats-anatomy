# References

Scientific references used to verify Latin terms and anatomical facts.
Every item in `data/*.js` lists the IDs it was checked against in its `refs` field.

Status:
- **verified** — the source was opened in this project and the fact or term was checked in it.
- **planned** — intended for use; not yet opened in this project.

Notes:
- NAV was read through a text extraction of the PDF, not a direct download; NAV page numbers are the printed page numbers.
- `Ossa digitorum pedis` and the use of `Ossa metatarsalia II–V` for the cat were confirmed in review by the maintainer.
- Content decisions that depart from a source are recorded in the review sheet (e.g. caudal vertebrae shown as 20–23 while POL15 and IMA-VERT give 20–24).
- Where no cat-specific source was found, a general mammal source backs a general fact: UEN-AX (human), UMN-LA (general limb anatomy), UIUC-DISC (dog). These are marked in "Used for".

## Nomenclature (Latin and Czech terms)

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| NAV | ICVGAN. Nomina Anatomica Veterinaria, 6th ed. WAVA 2017 (Osteologia pp. 11–24, Arthrologia pp. 30–34, Dentes p. 50) | All Latin terms (with page numbers) | https://wava-amav.org/wava-documents.html | verified |
| MUNI-NAZ | Masaryk Univ. Anatomické názvosloví (nosič, čepovec) | Czech terms nosič, čepovec | https://is.muni.cz/el/phil/podzim2012/AEB_03/um/anatomickenazvoslovi.pdf | verified |
| MUNI-KOST | Masaryk Univ. Kosterní soustava (Czech bone names) | Czech bone names | https://is.muni.cz/el/phil/podzim2019/PSBA001/um/KOST.pdf | verified |
| SLU-NAZ | Slezská univ. Základy osteologie – anatomické názvosloví (týlní kost) | Czech term týlní kost | https://is.slu.cz/el/fpf/zima2025/ARCHSTN031/um/anatomickenazvoslovi.pdf | verified |
| LF2-DK | Charles Univ. 2nd Fac. Med. Kosti dolní končetiny (pánevní, kyčelní, sedací, stydká kost) | Czech pelvic and hind-limb bone names | https://www.lf2.cuni.cz/sites/anatomie/files/page/files/2022/kostidk.pdf | verified |
| NLK-MeSH | Národní lékařská knihovna, MeSH CZ: Zygoma (jařmový oblouk, kost lícní) | Czech terms jařmový oblouk, kost lícní | https://dev.nlk.cz/mdv/mesh/D015050?lib=ikem | verified |
| LF2-LEB | Charles Univ. 2nd Fac. Med. Lebka (Latin–Czech skull bone names) | Czech terms čelní, temenní, nosní, spánková, týlní kost | https://anatomie.lf2.cuni.cz/files/page/files/2018/lebka.pdf | verified |

## Feline anatomy

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| POL15 | Pollard RE et al. Japanese Bobtail: vertebral morphology... J Feline Med Surg 2015;17(8):719–26 (normal feline formula C7 T13 L7 S3 Cd20–24) | Vertebral formula | https://escholarship.org/uc/item/44q61304 | verified |
| UMN-FEL | Gallant EM, rev. Clarkson CE. Appendix A: Supplemental Feline Notes, Guide to the Dissection of the Dog (UMN Pressbooks) | Cat-specific features (teeth, clavicle, humerus, claws, patella, fibula, orbit, spine) | https://pressbooks.umn.edu/dogcatanatomylabguide/back-matter/appendix | verified |
| UMN-RUN | Univ. of Minnesota Veterinary Anatomy. Designed for Running: Carnivore & Ungulate Locomotion | Digitigrade stance, hind limbs in jumping | https://vanat.ahc.umn.edu/run/ | verified |
| UMN-LAB7 | Univ. of Minnesota. Carnivore dissection Lab 07 (pelvic limb joints) | Stifle (knee) joint | https://vanat.ahc.umn.edu/carnLabs/Lab07/Lab07.html | verified |
| WIKIVET-FL | WikiVet. Forelimb – Anatomy & Physiology | Scapula attachment, clavicle, olecranon | https://en.wikivet.net/Forelimb_-_Anatomy_&_Physiology | verified |
| NCSU-PL | NC State Unit 2 Musculoskeletal, Lab 1: Pelvic limb osteology and arthrology | Hock = tarsus, calcaneus, patella; fibula muscle origins; carnivore metatarsal I may be rudimentary | https://ncstate.pressbooks.pub/unit2musculoskeletal/?p=775 | verified |
| MERCK-TEETH | Merck Veterinary Manual (pet owner). Dental Development of Cats (upd. Jun 2025) | Number of teeth | https://www.merckvetmanual.com/cat-owners/digestive-disorders-of-cats/dental-development-of-cats | verified |
| MERCK-JOINT | Merck Veterinary Manual (pet owner). Joint Disorders in Cats | Joint names (wrist, knee, ankle) | https://www.merckvetmanual.com/cat-owners/bone-joint-and-muscle-disorders-of-cats/joint-disorders-in-cats | verified |
| LAWSON | Lawson R. Anatomy and Physiology of Animals, 6.16 Locomotion (LibreTexts, CC BY-SA 3.0) | Digitigrade stance | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/06%3A_The_Skeleton/6.16%3A_Locomotion | verified |
| TF-META | Hillson S. Mammal Bones and Teeth. Routledge 2016 (orig. 1992), ch. 25 Metapodials of Cats, Dogs, Pigs and Humans | Number of metacarpals / metatarsals | https://www.taylorfrancis.com/books/9781315425016/chapters/10.4324/9781315425016-24 | verified |
| MUNI-OST | Masaryk Univ. Osteologie pro archeology 5: srovnávací anatomie (vertebral counts incl. human; nosič; kost křížová) | Human vertebral counts; Czech terms nosič, kost křížová | https://is.muni.cz/el/phil/jaro2011/AEB_03/um/5._Osteologie_pro_archeology.pdf | verified |
| ELS-ZYG | Elsevier Complete Anatomy: Zygomatic arch (human; masseter origin) | Masseter origin on the zygomatic arch (human) | https://www.elsevier.com/resources/anatomy/skeletal-system/axial-skeleton/zygomatic-arch-temporal-part/20699 | verified |
| LAWSON-VC | Lawson R. *Anatomy and Physiology of Animals*, 6.1 The vertebral column (LibreTexts, CC BY-SA 3.0) | Spinal cord runs through the vertebrae; atlas and axis let the head nod and shake | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/06%3A_The_Skeleton/6.01%3A_The_vertebral_column | verified |
| LAWSON-SK | Lawson R. *Anatomy and Physiology of Animals*, 6.2 The Skull (LibreTexts, CC BY-SA 3.0) | Skull protects brain and sense organs; skull bones grow together; foramen magnum | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/06%3A_The_Skeleton/6.02%3A_The_Skull | verified |
| LAWSON-J | Lawson R. *Anatomy and Physiology of Animals*, 6.14 Joints (LibreTexts, CC BY-SA 3.0) | Hip is a ball-and-socket joint; joints between vertebrae are slightly moveable | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/06%3A_The_Skeleton/6.14%3A_Joints | verified |
| CSU-AX | Charles Sturt Univ. *The Organised Life of Animals*, 4.2 Divisions of the Skeletal System | Atlas named after the Titan who held up the heavens | https://opentext.csu.edu.au/organisedlifeofanimals/?p=501 | verified |
| UEN-AX | Utah Education Network. *Anatomy & Physiology*, Axial Skeleton (human) | Atlas rotates around the dens of the axis | https://uen.pressbooks.pub/anatomyphysiology/?p=1993 | verified |
| RANDAU17 | Randau M, Goswami A. Morphological modularity in the vertebral column of Felidae (Mammalia, Carnivora). *BMC Evol Biol* 2017;17:133. doi:10.1186/s12862-017-0975-2 (CC BY 4.0) | Felid lumbar region bends in the sagittal plane during locomotion (arching the back) | https://discovery-pp.ucl.ac.uk/1559697/1/Randau_s12862-017-0975-2.pdf | verified |
| REITER14 | Reiter AM, Soltero-Rivera MM. Applied feline oral anatomy and tooth extraction techniques. *J Feline Med Surg* 2014;16(11):900–913 | Upper incisors sit in the incisive bone; canines, premolars and molars in the maxilla | https://pmc.ncbi.nlm.nih.gov/articles/PMC11044610/ | verified |
| UMN-LA | Univ. of Minnesota. *Large Animal Anatomy*, 1 Thoracic Limb (general limb anatomy) | Radius is the primary weight-bearing bone of the forearm; carnivore radius and ulna | https://pressbooks.umn.edu/largeanimalanatomy/chapter/thoracic-limb-forelimb | verified |
| NCSU-THIGH | NC State Unit 2 Musculoskeletal, Lab 2: Muscles of the pelvis and thigh – caudal and medial thigh | Hamstring muscles arise from the ischiatic tuberosity (cat has no sacrotuberous ligament) | https://ncstate.pressbooks.pub/unit2musculoskeletal/?p=816 | verified |
| WIKIVET-EAR | WikiVet. Ear – Anatomy & Physiology | Inner ear lies in the petrous part of the temporal bone | https://en.wikivet.net/Ear_-_Anatomy_&_Physiology | verified |
| UIUC-DISC | Netisingha H. Big Dogs, Little Dogs Get Disc Disease. Univ. of Illinois College of Veterinary Medicine, 6 May 2019 (dog) | Intervertebral disc cushions movement; nucleus pulposus acts as a shock absorber | https://vetmed.illinois.edu/pet-health-columns/intervertebral-disc-disease-dogs/ | verified |

## Verification only (text checked, images never copied)

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| IMA-RIB | IMAIOS vet-Anatomy: Ribs / True ribs / False ribs (text only, verification) | Ribs: 13 pairs, 9 sternal / 4 asternal | https://www.imaios.cn/en/vet-anatomy/anatomical-structures/ribs-11073892696 | verified |
| IMA-VERT | IMAIOS vet-Anatomy: Vertebral numbering (text only, verification) | Caudal vertebra count | https://www.imaios.cn/en/vet-anatomy/anatomical-structures/vertebral-numbering-11073892640 | verified |
| IMA-CLAV | IMAIOS vet-Anatomy: Clavicle (text only, verification) | Reduced clavicle | https://www.imaios.cn/en/vet-anatomy/anatomical-structures/clavicle-11073897868 | verified |
| IMA-MASS | IMAIOS vet-Anatomy: Masseter muscle (text only, verification) | Masseter arises from the zygomatic arch (cat) | https://www.imaios.cn/en/vet-anatomy/anatomical-structures/masseter-muscle-11077962884 | verified |
| IMA-FIB | IMAIOS vet-Anatomy: Fibula (text only, verification) | Tibia carries most of the weight; fibula thin in carnivores | https://www.imaios.cn/en/vet-anatomy/anatomical-structures/fibula-11073899860 | verified |

## Figures

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| RJ1901 | Reighard, J., Jennings, H. S. *Anatomy of the Cat*. New York: Henry Holt, 1901. Figures drawn by Louise Burridge Jennings. Project Gutenberg eBook #58394 (2018). | Figures (see `image-licenses.md`, `figures.md`); historical captions, always cross-checked against NAV | https://www.gutenberg.org/ebooks/58394 | verified |
| SIA-JEN | Smithsonian Institution Archives, SIA Acc. 90-105: "Herbert Spencer Jennings (1868-1947) and his Wife" (Mary Louise Burridge Jennings died before H. S. Jennings remarried in 1939) | Copyright term of the figures in the EU | https://siarchives.si.edu/collections/siris_arc_297399 | verified |

## Classification card ("Zařazení kočky v přírodě", `data/zarazeni.js`)

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| GBIF-FC | GBIF Backbone Taxonomy: *Felis catus* Linnaeus, 1758 | Kingdom → species: Animalia, Chordata, Mammalia, Carnivora, Felidae, Felis, *Felis catus* | https://www.gbif.org/species/2435035 | verified |
| MDD-FC | Mammal Diversity Database: *Felis catus* Linnaeus, 1758 | Valid name *Felis catus*; domestic form of *F. lybica* | https://mammaldiversity.org/taxon/1005985 | verified |
| CSW-KD | Czech Wikipedia: Kočka domácí (taxobox and intro) | Czech rank names and group names (živočichové, strunatci, savci, šelmy, kočkovití, kočka); domesticated form of kočka plavá, living with people for millennia | https://cs.wikipedia.org/wiki/Ko%C4%8Dka_dom%C3%A1c%C3%AD | verified |
| CSW-OBR | Czech Wikipedia: Obratlovci | Podkmen obratlovci (Vertebrata): skull and vertebrae; strunatci have a notochord (chorda) | https://cs.wikipedia.org/wiki/Obratlovci | verified |
| CSW-SAV | Czech Wikipedia: Savci | Savci: young fed with milk, body covered with fur; class under obratlovci | https://cs.wikipedia.org/wiki/Savci | verified |
| CSW-SEL | Czech Wikipedia: Šelmy | Šelmy: mostly predators eating meat; canines used on prey | https://cs.wikipedia.org/wiki/%C5%A0elmy | verified |
| CSW-KOC | Czech Wikipedia: Kočkovití | Species of the genus *Felis* incl. kočka divoká, plavá, domácí | https://cs.wikipedia.org/wiki/Ko%C4%8Dkovit%C3%AD | verified |
| CSW-POR | Czech Wikipedia: Portál:Kočky | Lion and tiger are Felidae | https://cs.wikipedia.org/wiki/Port%C3%A1l:Ko%C4%8Dky | verified |

Notes:
- The scientific classification follows GBIF and MDD. Wikipedia is used only for the standard Czech group names and for basic, textbook-level facts; nothing is copied.
- BioLib.cz (Czech) still lists the domestic cat as *Felis silvestris* f. *catus*. The app uses *Felis catus*, as GBIF, MDD and Czech Wikipedia do.

## Planned

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| IVAN-CS | Constantinescu, G. M. *Ilustrovaná veterinární anatomická nomenklatura* (Czech edition of *Illustrated Veterinary Anatomical Nomenclature*, 4th ed., Thieme 2018). ISBN 978-80-271-5067-0 (print), 978-80-271-8419-4 (PDF); Czech publisher and year to be confirmed. | Czech ↔ Latin correspondence | Print / e-book | planned |
| UIUC | University of Illinois, veterinary imaging anatomy. | Verification only; images never copied | Online | planned |
