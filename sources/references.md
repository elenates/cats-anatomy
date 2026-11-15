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

## Vnější stavba těla (`data/vnejsi.js`)

Also used here: NAV (Partes corporis pp. 4–6, Integumentum commune p. 155: Pili tactiles incl. *Pili tactiles carpales* (fe), Tori, Unguicula), CSW-KD, CSW-KOC, CSW-SAV, LAWSON-SK, UMN-RUN, UMN-FEL, POL15, MUNI-OST, RANDAU17, TF-META, IMA-VERT (see above).

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| CSW-AKD | Czech Wikipedia: Anatomie kočky domácí | Tail used for balance; fur protects and its density depends on surroundings; stomach and intestines in the abdomen | https://cs.wikipedia.org/wiki/Anatomie_ko%C4%8Dky_dom%C3%A1c%C3%AD | verified (page text via search) |
| CSW-DRAP | Czech Wikipedia: Dráp | Claws used for defence, holding food, climbing; retractable in cats | https://cs.wikipedia.org/wiki/Dr%C3%A1p | verified (page text via search) |
| VFU-CHOV | Veterinary University Brno (VFU), course material "Chování koček" (PDF, no author shown) | Tactile hairs help cats hunt, especially at night; tapetum lucidum listed under sight | https://cit.vfu.cz/oz/Oz/mvdrcv9.pdf | verified |
| LAWSON-RIB | Lawson R. *Anatomy and Physiology of Animals*, 6.3 The Ribs (LibreTexts, CC BY-SA 3.0) | Rib cage protects the heart and lungs | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/06%3A_The_Skeleton/6.03%3A_The_Ribs | verified |

Notes:
- The NAV PDF (6th ed., 2017) was downloaded from wava-amav.org as `nav_6_2017.zip` (SHA-256 `9b0ca232…b684698c2`) and read as text; page numbers are the printed ones.
- CSW-KD figures used for a child (about 200 million olfactory cells, up to 20 000 hairs per cm², ears turning up to 180°) are textbook-level facts; they are marked in the review sheet for checking.

## Vnitřní orgány (`data/organy.js`)

Also used here: NAV (Diaphragma p. 41; Splanchnologia pp. 49–59; Cor p. 73; Lien p. 106; Medulla spinalis p. 118; Encephalon p. 119) and RJ1901 (organ positions, intestine lengths, Fig. 136; see above).

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| LAWSON-NS | Lawson R. Anatomy and Physiology of Animals, 14.5 Parts of the Nervous System (LibreTexts, CC BY-SA 3.0) | Brain and spinal cord form the CNS; brain in the cranium; cerebrum (memory, learning, senses), cerebellum (balance) | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/14%3A_Nervous_System/14.05%3A_Parts_of_the_Nervous_System | verified |
| LAWSON-AIR | Lawson R. Anatomy and Physiology of Animals, 9.4 The Air Passages | Nasal cavity warms and moistens air; tracheal cartilage rings; epiglottis closes during swallowing | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/09%3A_Respiratory_System/9.04%3A_The_Air_Passages | verified |
| LAWSON-LUNG | Lawson R. Anatomy and Physiology of Animals, 9.5 The Lungs and Pleural Cavities | Lungs fill most of the thoracic cavity; diaphragm separates chest and abdomen | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/09%3A_Respiratory_System/9.05%3A_The_Lungs_and_Pleural_Cavities | verified |
| LAWSON-BR | Lawson R. Anatomy and Physiology of Animals, 9.6 Breathing | Breathing by the diaphragm and ribs | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/09%3A_Respiratory_System/9.06%3A_Breathing | verified |
| LAWSON-CARN | Lawson R. Anatomy and Physiology of Animals, 11.2 Carnivores | Carnivore guts are shorter than those of herbivores | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/11%3A_The_Gut_and_Digestion/11.02%3A_Carnivores | verified |
| LAWSON-OES | Lawson R. Anatomy and Physiology of Animals, 11.8 Oesophagus | Oesophagus carries food to the stomach by peristalsis | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/11%3A_The_Gut_and_Digestion/11.08%3A_Oesophagus | verified |
| LAWSON-ST | Lawson R. Anatomy and Physiology of Animals, 11.9 Stomach | Stomach stores and mixes food; gastric juice with acid digests protein and fat | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/11%3A_The_Gut_and_Digestion/11.09%3A_Stomach | verified |
| LAWSON-SI | Lawson R. Anatomy and Physiology of Animals, 11.10 Small Intestine | Small intestine: digestion and absorption into the blood | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/11%3A_The_Gut_and_Digestion/11.10%3A_Small_Intestine | verified |
| LAWSON-LI | Lawson R. Anatomy and Physiology of Animals, 11.12 Large Intestine | Colon absorbs water; rectum is part of the large intestine | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/11%3A_The_Gut_and_Digestion/11.12%3A_Large_Intestine | verified |
| LAWSON-LIV | Lawson R. Anatomy and Physiology of Animals, 11.19 The Liver | Liver: largest single organ, next to the diaphragm; bile, glycogen store, removes toxic substances | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/11%3A_The_Gut_and_Digestion/11.19%3A_The_Liver | verified |
| LAWSON-KID | Lawson R. Anatomy and Physiology of Animals, 12.5 The Kidneys and Urinary System | Kidneys bean-shaped, on either side of the spine; ureter, bladder, urethra | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/12%3A_Urinary_System/12.05%3A_The_Kidneys_and_Urinary_System | verified |
| MERCK-DESC | Merck Veterinary Manual (pet owner). Description and Physical Characteristics of Cats (Bukowski JA, Aiello S; rev. Jul 2011, mod. Sep 2024) | Tongue papillae, saliva; kidneys filter waste, urine path | https://www.merckvetmanual.com/veterinary/cat-owners/description-and-physical-characteristics-of-cats/description-and-physical-characteristics-of-cats | verified |
| MERCK-HEART | Merck Veterinary Manual (pet owner). Introduction to Heart and Blood Vessel Disorders in Cats (Cunningham SM, Roderick KV) | Heart: hollow muscle with 4 chambers, pumps blood; > 120 beats/min at rest; blood takes up oxygen in the lungs | https://merckvetmanual.com/cat-owners/heart-and-blood-vessel-disorders-of-cats/introduction-to-heart-and-blood-vessel-disorders-in-cats | verified |
| MERCK-RESP | Merck Veterinary Manual. Table: Resting Respiratory Rates (adapted from Dukes' Physiology of Domestic Animals, 12th ed.) | Resting respiratory rate of the cat: 16–40 breaths/min | https://www.merckvetmanual.com/multimedia/table/resting-respiratory-rates | verified |
| RICHTER24 | Richter J, Mülling CKW, Röhrmann N. A Morphometric Study on the Dimensions of the Vertebral Canal and Intervertebral Discs from Th1 to S1 in Cats. Vet Sci 2024;11(9):429. doi:10.3390/vetsci11090429 | Spinal cord ends at the level of the sacrum (conus medullaris in 90% of adult cats); cauda equina runs on to the tail | https://mdpi.com/2306-7381/11/9/429 | verified |
| VETHISTO | Jennings R, Premanandan C. Veterinary Histology, ch. 9 Hepatobiliary System (Ohio State Univ. Pressbooks, CC BY-NC 4.0) | Gallbladder stores and concentrates bile, releases it after a meal | https://ohiostate.pressbooks.pub/vethisto/?p=505 | verified |
| WIKIVET-GB | WikiVet. Gall Bladder – Anatomy & Physiology | Horses have no gallbladder | https://en.wikivet.net/Gall_Bladder_-_Anatomy_&_Physiology | verified |
| BRIT-SPL | Encyclopaedia Britannica: Spleen (anatomy) | Spleen filters the blood, removes old red blood cells, makes lymphocytes (general anatomy) | https://www.britannica.com/science/spleen-anatomy | verified |
| MERCK-CONG | Merck Veterinary Manual (pet owner). Congenital and Inherited Disorders of the Digestive System in Cats (Pearson LK; rev. Aug 2018, mod. Apr 2026) | Pyloric sphincter is the exit of the stomach (verified via search snippet of the page) | https://www.merckvetmanual.com/veterinary/cat-owners/digestive-disorders-of-cats/congenital-and-inherited-disorders-of-the-digestive-system-in-cats | verified |
| LAWSON-PJ | Lawson R. Anatomy and Physiology of Animals, 11.16 Pancreatic juice | Pancreatic juice flows into the duodenum; digests starch, fats, proteins | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/11%3A_The_Gut_and_Digestion/11.16%3A_Pancreatic_juice | verified |
| LAWSON-PAN | Lawson R. Anatomy and Physiology of Animals, 16.8 The Pancreas | Islets of Langerhans secrete insulin, which regulates blood glucose | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/16%3A_Endocrine_System/16.08%3A_The_Pancreas | verified |
| LAWSON-NEPH | Lawson R. Anatomy and Physiology of Animals, 12.6 Kidney Tubules or Nephrons | Glomeruli in the cortex; loops of Henle and collecting ducts in the medulla; urine formation | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/12%3A_Urinary_System/12.06%3A_Kidney_Tubules_or_Nephrons | verified |
| ALVITES23 | Alvites R et al. The Olfactory Bulb in Companion Animals—Anatomy, Physiology, and Clinical Importance. Brain Sci 2023;13(5):713. doi:10.3390/brainsci13050713 | Olfactory bulb links the olfactory epithelium of the nasal cavity with the brain | https://mdpi.com/2076-3425/13/5/713 | verified |
| LAWSON-NSY | Lawson R. Anatomy and Physiology of Animals, 14.2 The Nervous System | Sense organs send information that is processed; the response makes muscles contract; neurons carry high-speed nerve impulses (Tělesné soustavy) | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/14%3A_Nervous_System/14.02%3A_The_Nervous_System | verified |
| LAWSON-RO | Lawson R. Anatomy and Physiology of Animals, 9.1 Overview (Respiratory System) | Oxygen passes from the alveoli into the blood; carbon dioxide is a waste product removed where oxygen enters; cells need oxygen and glucose (Tělesné soustavy) | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/09%3A_Respiratory_System/9.01%3A_Overview | verified |
| MUNI-VYL | Masarykova univerzita, Pedagogická fakulta, VZkB21: Praktické cvičení č. 6 – Vylučovací soustava (2018) | Vylučovací soustava = kidneys and urinary tract (same organs as močová soustava); waste also leaves through the lungs, large intestine and sweat glands | https://is.muni.cz/el/ped/jaro2018/VZkB21/um/PL_5_Vylucovaci_soustava.pdf | verified (PDF, SHA-256 `2e66877d…fc563282`) |
| LAWSON-FR | Lawson R. Anatomy and Physiology of Animals, 13.4 The Female Reproductive Organs | Ovaries produce egg cells; the foetus grows in the uterus (Rozmnožovací soustava) | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/13%3A_Reproductive_System/13.04%3A_The_Female_Reproductive_Organs | verified |
| LAWSON-MR | Lawson R. Anatomy and Physiology of Animals, 13.3 The Male Reproductive Organs | A pair of testes produce sperm (Rozmnožovací soustava) | https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/13%3A_Reproductive_System/13.03%3A_The_Male_Reproductive_Organs | verified |
| MERCK-REPRO | Merck Veterinary Manual (pet owner). Management of Reproduction of Cats (Davidson AP; full review Aug 2018, upd. Aug 2025) | Pregnancy lasts 60 to 65 days | https://www.merckvetmanual.com/cat-owners/reproductive-disorders-of-cats/management-of-reproduction-of-cats | verified |
| RUTGERS-KIT | Sharma D (Rutgers Univ.). Basics of Pregnancy and Birth in the Cat. Companion Animals, extension.org | Pregnancy averages 63 days; litters of 1 to 10, average four; newborn kittens have eyes and ears sealed and find the teats by smell; nursing soon after birth | https://companion-animals.extension.org/?p=31 | verified |

Notes:
- Close-up parts (stage 5b) also use NAV pp. 52–59, 74, 119–124, RJ1901 (Figs. 97–137 and pp. 255, 274–275), LAWSON-SI, LAWSON-AIR, LAWSON-KID, LAWSON-NS, VETHISTO and MERCK-HEART.
- BRIT-SPL is general (human-based) anatomy: no cat-specific source on the spleen could be opened (a Tufts newsletter page redirects, PMC pages ask for a browser check).
- The small-intestine length (about three times the body) comes from RJ1901 only, so the app calls it an estimate from an old book. The large-intestine length was removed: no modern source confirms it.
- Tělesné soustavy (stage 6): system texts in `data/organy.js` (`soustavy`) use LAWSON-NS, LAWSON-NSY, LAWSON-AIR, LAWSON-RO, LAWSON-BR, MERCK-HEART, LAWSON-SI, LAWSON-OES, LAWSON-ST, LAWSON-LI, LAWSON-LIV, LAWSON-PJ, LAWSON-KID, MERCK-DESC and BRIT-SPL. Lawson files the spleen under the cardiovascular chapter (8.35 The Spleen), which supports grouping it with Oběhová soustava.
- Močová / vylučovací soustava (Lenka): "močová soustava" is the usual term for the organs, their diseases and urine tests; "vylučovací soustava" is the general term for getting rid of metabolic waste. The Močová soustava card mentions both names (MUNI-VYL).
- Rozmnožovací soustava (stage 7) uses LAWSON-FR, LAWSON-MR, MERCK-REPRO and RUTGERS-KIT. "Asi dva měsíce" rounds the 60–65 days (MERCK-REPRO) and the 63-day average (RUTGERS-KIT). Lenka asked for drawings: varle is now a hotspot on the whole-body drawing (the drawing's own testis label), and a close-up screen *Rozmnožovací orgány* uses RJ1901 Figs. 111–112 (pp. 258 and the female genital organs section) with NAV pp. 59, 61–62.
- Heart and breathing rates: sources differ (Merck table 120–140 bpm; clinic values 140–220). The app says only that it can be more than 120.

## Planned

| ID | Reference | Used for | Access | Status |
|----|-----------|----------|--------|--------|
| IVAN-CS | Constantinescu, G. M. *Ilustrovaná veterinární anatomická nomenklatura* (Czech edition of *Illustrated Veterinary Anatomical Nomenclature*, 4th ed., Thieme 2018). ISBN 978-80-271-5067-0 (print), 978-80-271-8419-4 (PDF); Czech publisher and year to be confirmed. | Czech ↔ Latin correspondence | Print / e-book | planned |
| UIUC | University of Illinois, veterinary imaging anatomy. | Verification only; images never copied | Online | planned |
