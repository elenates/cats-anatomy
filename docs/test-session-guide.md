# Test session with the child — Kostra v0.1

**Goal:** find out where the app is unclear, too hard or boring for a 9-year-old.
We are testing the app, not the child.

- **Time:** about 30 minutes, including the short talk at the end. Stop earlier if the child is tired or loses interest.
- **Who:** the child uses the tablet; one adult watches and takes notes. A second adult is a bonus, not a must.
- **Where to note things:** the *Test session log* tab of the QA sheet
  ([Kostra v0.1 – QA checklist and test session log](https://claude.ai/artifact/GcmqWwtULZxHNMB2cYxCjJ)),
  or paper, copied into the sheet afterwards.
- **Privacy:** do not put the child's name, photos or recordings in GitHub issues or the repo.
  Record audio or video only if the child agrees, and keep it private.

The Czech sentences below are suggestions for what to say. Adjust them to how you normally talk with your child.

## Before the session (10 minutes, without the child)

1. Charge the tablet, turn notifications off, set the brightness high and hold it in landscape.
2. Open https://elenates.github.io/cats-anatomy/ and check that the menu and Kostra load.
3. Reset the screen: in Kostra choose **Kosti**, switch **Popisky**, **Latinsky** and **Pro zvídavé** off,
   then go back to the menu. The child should start from the menu.
4. Open the log tab on your phone or laptop, or prepare paper with the columns
   *time · task · what the child did or said · type · severity · idea*.
5. Pick a quiet time when the child is rested, not right before a meal or bedtime.

## Starting

Say what this is, and that mistakes are the app's fault:

> „Zkoušíme novou aplikaci o kočičí kostře. Nezkoušíme tebe, ale aplikaci.
> Když něčemu nerozumíš nebo něco nefunguje, je to chyba aplikace a moc nám pomůžeš, když to řekneš.
> Zkus u toho nahlas říkat, co si myslíš."

## How to watch (the hardest part)

- **Do not help** unless the child is stuck for about a minute or getting upset. Note *where* they got stuck before you help.
- **Do not point** at the screen and do not name the bone they are looking for.
- If they go quiet, ask neutral questions: „Co teď hledáš?" „Co myslíš, že se stane, když na to klepneš?"
- Write down **their exact words**, especially words they do not understand and things they say are boring or fun.
- Watch the fingers: taps that land **next to** a bone, repeated taps, scrolling when nothing scrolls.
- Watch reading: do they read the card, read only the name, or skip it?

## Tasks

Give one task at a time. The times are rough guides; do not use a timer in front of the child.

| # | Task (what you say) | Time | What to watch |
|---|---------------------|------|---------------|
| 1 | „Prozkoumej aplikaci, jak chceš." | 5 min | Do they find Kostra without help? What do they tap first? Do they notice the buttons above the picture? |
| 2 | „Najdi lopatku. Co dělá?" | 2 min | Can they find it? Do they read *Co dělá?* and can they say it in their own words? |
| 3 | „Kde má kočka koleno?" | 2 min | **Key learning point:** do they point at the knee, or at the hock (the joint that bends backwards)? Do not correct them yet. |
| 4 | „Najdi kost, která je u kočky jiná než u tebe." | 3 min | Do they use *Zajímavost*? Which card do they pick? |
| 5 | „Dokážeš zapnout, aby u obrázku byla jména?" | 1 min | Do they find **Popisky**? Do they understand what the other two buttons do? |
| 6 | „Podívej se na klouby. Najdi hlezno." | 2 min | Do they find **Klouby**? Do they understand that the hock is the heel, not the knee (card *Kost patní* / *Hlezenní kloub*)? |
| 7 | „Zahraj si kvíz." One round of 10. | 6 min | Score; taps next to the right bone; reaction to a wrong answer; do they read the explanation or skip with *Další otázka*? |
| 8 | „Řekni mi tři věci, které ses o kočičí kostře dozvěděl(a)." | 2 min | What stuck? Is any of it wrong? |

## Short talk at the end (3 minutes)

- „Co se ti líbilo nejvíc?"
- „Co tě nebavilo nebo co bylo těžké?"
- „Bylo tam nějaké slovo, kterému jsi nerozuměl(a)?"
- „Chtěl(a) bys to hrát znovu? A co by tam ještě mělo být?"
- Optional: let them show on a 1–5 scale (fingers or smileys) how much fun it was.

## Filling in the log

Use one row per observation. The **Type** column has these values:

| Type | Use when |
|------|----------|
| Stuck | The child did not know how to go on (note where and for how long) |
| Text too long | They stopped reading, skimmed, or said it was long |
| Unknown word | They asked about a word or misread it (write the word) |
| Missed tap | The tap landed next to the intended bone, or needed several tries |
| Ignored | A feature they never noticed or never used |
| Liked it | Something they enjoyed or came back to |
| Other | Anything else, including anatomy they misunderstood |

**Severity:** *High* = blocked them or taught something wrong; *Medium* = slowed them down or confused them;
*Low* = small annoyance or polish.

## After the session

1. Fill in the log the same day while you remember the details.
2. Mark the 3–5 most important findings (all *High* first).
3. Send me the sheet link or tell me the findings. I will turn them into tasks for **Milestone 2** (#3):
   fixes, shorter texts, word changes, bigger tap targets.
4. Do not fix things during the session, and do not run a second session until the fixes are in.
   A second session with the same child shows whether the fixes worked.
