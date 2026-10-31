var e={id:`portfolio-site`,title:`Portfolio HQ`,year:`2026`,order:0,status:`in-progress`,client:null,roles:{gamedev:1,frontend:9,motion:3,audioreactive:5,aidev:10},kicker:{en:`Frontend · React · Claude Code`,cs:`Frontend · React · Claude Code`},headline:{en:`This site re-pitches itself for five roles`,cs:`Tento web se přizpůsobí pěti rolím`},summary:{en:`Portfolio HQ is this bilingual (EN/CZ) site, built with Claude Code under my direction. A role lens, carried in the link as ?for=, re-orders every project for one of five roles. A Ctrl/⌘K palette reaches every page, and a Web Audio engine (a generative synth or the visitor's microphone) drives the particle-ring background. It runs on Vite 8, React, TypeScript and Tailwind CSS 4, served by GitHub Pages at aspandos.github.io.`,cs:`Portfolio HQ je tento dvojjazyčný web (EN/CZ), který vzniká v Claude Code pod mým vedením. Pohled podle role, přenášený v odkazu jako ?for=, přeřadí všechny projekty pro jednu z pěti rolí. Paleta přes Ctrl/⌘K vede na kteroukoli stránku a zvukový engine ve Web Audio (generativní syntezátor nebo mikrofon návštěvníka) pohání částicové prstence v pozadí. Web běží na Vite 8, Reactu, TypeScriptu a Tailwind CSS 4 a hostují ho GitHub Pages na adrese aspandos.github.io.`},highlights:[{en:`The role lens writes its choice into the address (?for=frontend), so a recruiter can be sent a pre-filtered link. It sorts by the 0–10 role score in each project's JSON (ties go to the overall ranking) and leaves out anything under 4.`,cs:`Pohled podle role zapíše volbu do adresy (?for=frontend), takže recruiterovi stačí poslat předfiltrovaný odkaz. Projekty řadí podle skóre 0–10 pro danou roli v JSONu každého projektu (při shodě rozhoduje celkové pořadí) a vynechá vše pod 4.`},{en:`Each section, case study and tool gets its own static index.html (title, description, Open Graph image, plain-HTML fallback with real links), stamped by a Vite plugin (scripts/route-pages.ts) after bundling along with schema.org JSON-LD (WebSite, ProfilePage, CreativeWork, breadcrumbs), canonical links, robots.txt and a sitemap of the pages worth indexing. One React bundle boots on all of them; old #/ links still resolve.`,cs:`Každá sekce, případová studie i nástroj má vlastní statický index.html (titulek, popis, obrázek pro Open Graph, záložní HTML se skutečnými odkazy), vytvořený po buildu pluginem pro Vite (scripts/route-pages.ts) spolu s JSON-LD podle schema.org (WebSite, ProfilePage, CreativeWork, drobečková navigace), kanonickými odkazy, robots.txt a sitemapou stránek k indexaci. Na všech běží jeden bundle Reactu; staré odkazy s #/ fungují dál.`},{en:`src/lib/audio.ts synthesises a small generative track in the browser (pad, arpeggio, sub bass and drums, so there is nothing to license) and falls back to it if microphone permission is refused; its bands also pulse the data on the flow graphs. The Ring Field runs live on desktops and as a still frame on tablets until sound is on; phones keep a plain black background to save data and battery.`,cs:`src/lib/audio.ts syntetizuje v prohlížeči malou generativní skladbu (pad, arpeggio, sub bas a bicí, takže není co licencovat) a přepne na ni, když návštěvník nepovolí mikrofon; jeho pásma pohánějí i pulzy dat na grafech propojení. Ring Field běží na desktopu živě, na tabletu do zapnutí zvuku jako statický snímek a telefony mají kvůli datům a baterii čistě černé pozadí.`},{en:`The gzipped main bundle fell from 199 KB to under 160 KB, and a mobile Toolkit layout shift was traced and fixed (CLS 0.18 → 0). The feed ships light cards and loads case studies on demand; the first bundle carries only tool ids, and video loops and the three.js background wait for first paint (useAfterPaint). Inter is self-hosted as a 13 KB Czech subset (fontTools) instead of the 130 KB latin-ext file.`,cs:`Hlavní bundle se po gzipu zmenšil z 199 KB pod 160 KB a posun rozvržení na mobilní stránce Nástroje byl dohledán a opraven (CLS 0,18 → 0). Feed posílá odlehčené karty a případové studie stahuje až na vyžádání; první bundle nese jen ID nástrojů a videosmyčky i pozadí v three.js čekají na první vykreslení (useAfterPaint). Písmo Inter je hostované na webu jako 13KB česká podmnožina (fontTools) místo 130KB souboru latin-ext.`},{en:`Before publishing come visual checks in Chrome (desktop width and 390 px) and a leak scan for unpublished client work, licence keys, source maps and local paths. On the production build, Lighthouse gives mobile Home 91, Toolkit 87, CV 89 and case study 85. Desktop Home gets 95; accessibility, best practices and SEO get 100 everywhere. Review passes check every code excerpt line by line against its source file.`,cs:`Před zveřejněním následují vizuální kontroly v Chromu (šířka desktopu a 390 px) a kontrola úniků: nezveřejněná klientská práce, licenční klíč, source mapy, lokální cesty. Na produkčním buildu dává Lighthouse na mobilu úvodu 91, Nástrojům 87, CV 89 a případové studii 85. Úvod na desktopu má 95, přístupnost, osvědčené postupy i SEO všude 100. Revizní průchody porovnají každou ukázku kódu řádek po řádku se zdrojovým souborem.`},{en:`cv-src/build.py turns the site's own profile, tool and project files into one-page CVs for the Game Dev, Frontend, Motion, Audio-reactive and AI Dev roles in English and Czech, linking every project to its case study on the same lens. FFmpeg scripts make the thumbnails and 1200×630 share images. One command (scripts/deploy-pages.sh) builds the site and pushes only dist/ to the public GitHub Pages repository, so the source stays private.`,cs:`cv-src/build.py z profilu, nástrojů a projektů webu vytvoří jednostránková CV pro role Game Dev, Frontend, Motion, Audio-reactive a AI Dev v angličtině i češtině a každý projekt v nich odkáže na případovou studii se stejným pohledem podle role. Skripty s FFmpeg vyrábějí náhledy a obrázky 1200×630 pro sdílení. Jediný příkaz (scripts/deploy-pages.sh) web sestaví a do veřejného repozitáře GitHub Pages pošle jen dist/, takže zdrojový kód zůstává soukromý.`}],pitch:{frontend:{en:`Main bundle under 160 KB and CLS at 0 on phones: a production React and TypeScript site with path routing and a static, search-ready page per route.`,cs:`Hlavní bundle pod 160 KB a CLS 0 na telefonech: produkční web v Reactu a TypeScriptu s routingem přes cesty a statickou stránkou pro vyhledávače u každé adresy.`},audioreactive:{en:`The site's own synth or the visitor's microphone becomes bass, mid, high and beat every frame, driving the three.js particle background; turning sound off releases the microphone and audio device.`,cs:`Vlastní syntezátor webu nebo mikrofon návštěvníka se v každém snímku rozloží na basy, středy, výšky a beat a pohání částicové pozadí v three.js; po vypnutí zvuku se mikrofon i zvukové zařízení uvolní.`},aidev:{en:`Every change passes checks I define: Claude Code writes the code, typechecks it and builds it for production, then runs Lighthouse, visual and leak checks before publishing; I review and sign off.`,cs:`Každá změna projde kontrolami, které určuji: Claude Code píše kód, kontroluje typy, sestaví produkční build a před zveřejněním spustí Lighthouse, vizuální kontroly a kontrolu úniků; výsledky procházím a schvaluji já.`}},tools:[`claude-code`,`typescript`,`react`,`vite`,`tailwind`,`threejs`,`html-css`,`git`,`python`,`ffmpeg`],flow:[{from:`claude-code`,to:`typescript`,label:{en:`writes the code`,cs:`píše kód`}},{from:`claude-code`,to:`react`,label:{en:`builds the views`,cs:`staví pohledy`}},{from:`ffmpeg`,to:`react`,label:{en:`loops, thumbs, share images`,cs:`smyčky, náhledy, obrázky pro sdílení`}},{from:`typescript`,to:`vite`,label:{en:`typecheck + build`,cs:`typecheck + build`}},{from:`react`,to:`vite`,label:{en:`a page per route`,cs:`stránka pro každou cestu`}},{from:`vite`,to:`git`,label:{en:`dist/ to GitHub Pages`,cs:`dist/ na GitHub Pages`}},{from:`python`,to:`html-css`,label:{en:`CVs, PDF via Chrome`,cs:`CV, PDF přes Chrome`}}],media:{aspect:`16:9`,poster:`media/portfolio-site/poster.webp`,loop:`media/portfolio-site/loop.mp4`,full:null,gallery:[{src:`media/portfolio-site/g1.webp`,aspect:`16:9`,caption:{en:`The Motion lens (?for=motion) on Home: per-role counts in the strip, the strongest motion pieces as hero tiles, 'Motion Designer' under the name, the Motion CV on both buttons.`,cs:`Úvod v pohledu Motion (?for=motion): počty projektů pro každou roli v liště rolí, nejsilnější motion práce v dlaždicích úvodu, Motion Designer pod jménem a CV pro roli Motion na obou tlačítkách.`}},{src:`media/portfolio-site/g2.webp`,aspect:`16:9`,caption:{en:`The From the source section (AV Control): unedited excerpts of the project's own files, each with path, language and a note on the code, switched by tabs on the left.`,cs:`Sekce Ze zdrojového kódu (AV Control): needitované ukázky z vlastních souborů projektu, každá s cestou, jazykem a poznámkou ke kódu; přepínají se záložkami vlevo.`}},{src:`media/portfolio-site/g3.webp`,aspect:`16:9`,caption:{en:`Toolkit: signature pipelines as node graphs from the site's JSON (each node a tool, each wire the data passed along), with chips linking to the case studies that use them.`,cs:`Nástroje: typické pipeline jako grafy uzlů z vlastního JSONu webu (uzel je nástroj, spoj předávaná data) se štítky, které vedou na případové studie, jež je používají.`}},{src:`media/portfolio-site/g4.webp`,aspect:`16:9`,caption:{en:`Home, a case study's top and closing block (Write email, Copy email, Download CV) and the CV at 390 px. A floating icon pill replaces the dock, and the top bar with its Email button hides on scroll-down.`,cs:`Úvod, začátek a závěrečný blok případové studie (Napsat e-mail, Kopírovat e-mail, Stáhnout CV) a CV v šířce 390 px. Dock nahradí plovoucí lišta s ikonami a horní lišta s tlačítkem E-mail se při posouvání dolů schová.`}}]},audio:`none`,credits:[{en:`Code written with Claude Code (Anthropic's AI coding agent) under my direction; Claude Code also ran the checks. Concept, system design, design direction, content decisions, test criteria, review and sign-off are mine.`,cs:`Kód vznikl v Claude Code (AI agent pro programování od Anthropicu) pod mým vedením; Claude Code spouštěl i kontroly. Koncept, návrh systému, směr designu, rozhodnutí o obsahu, kritéria testů, kontrola výsledků i schválení jsou moje.`},{en:`Interface components from React Bits Pro (licensed), including the Ring Field background, command palette, project table and image loupe; the licence key and the source code stay private`,cs:`Komponenty rozhraní z React Bits Pro (licencované), mimo jiné pozadí Ring Field, příkazová paleta, tabulka projektů a lupa na obrázky; licenční klíč i zdrojový kód zůstávají soukromé`},{en:`Inter typeface by Rasmus Andersson (SIL Open Font License 1.1), self-hosted`,cs:`Písmo Inter od Rasmuse Anderssona (SIL Open Font License 1.1), hostované přímo na webu`},{en:`three.js (MIT licence)`,cs:`three.js (licence MIT)`},{en:`The shell (top bar with clock, role strip, card feed, dock, ⌘K) follows the HQ dashboard style of hq.easymachineai.com`,cs:`Rozvržení (horní lišta s hodinami, lišta rolí, feed karet, dock, ⌘K) vychází ze stylu dashboardu HQ na hq.easymachineai.com`},{en:`All stills and the loop are headless-Chrome screenshots of the live site: 1600 px wide for desktop, 390 px with touch emulation for the phone views; the loop crossfades between them`,cs:`Všechny obrázky i smyčka jsou snímky obrazovky živého webu pořízené v headless Chromu: v šířce 1600 px pro desktop a 390 px s emulací dotyku pro telefon; smyčka mezi nimi plynule prolíná`}],tldr:{en:`A bilingual React 19 and TypeScript portfolio with a static page per route and an audio-reactive background, scoring 100 in Lighthouse for accessibility, best practices and SEO.`,cs:`Dvojjazyčné portfolio v Reactu 19 a TypeScriptu se statickou stránkou pro každou cestu a audioreaktivním pozadím; v Lighthouse má 100 za přístupnost, osvědčené postupy i SEO.`},role:{en:`Personal project. Concept, system design, design direction, content, test criteria, review and sign-off; code written with Claude Code under my direction.`,cs:`Vlastní projekt. Koncept, návrh systému, směr designu, obsah, kritéria testů, kontrola a schválení; kód vznikl v Claude Code pod mým vedením.`},code:[{title:{en:`Structured data for every case study`,cs:`Strukturovaná data případových studií`},lang:`typescript`,file:`scripts/route-pages.ts`,snippet:`      const caseGraph = (p: ProjectJson, s: Seo.PageSeo, image: string) => {
        const url = abs(s.selfPath);
        return [
          pageNode("ItemPage", s, {
            description: p.tldr?.en || s.description,
            breadcrumb: { "@id": \`\${url}#breadcrumb\` },
            primaryImageOfPage: { "@id": \`\${url}#image\` },
            mainEntity: { "@id": \`\${url}#work\` },
          }),
          {
            "@type": "CreativeWork",
            "@id": \`\${url}#work\`,
            url,
            name: p.title,
            headline: p.headline.en,
            ...(p.tldr?.en ? { abstract: p.tldr.en } : {}),
            description: p.summary.en,
            genre: p.kicker.en,
            dateCreated: p.year,
            inLanguage: "en",
            keywords: p.tools.map(toolName),
            image: { "@id": \`\${url}#image\` },
            creator: personRef,
          },
          { "@type": "ImageObject", "@id": \`\${url}#image\`, url: abs(image), contentUrl: abs(image), width: 1200, height: 630, caption: p.headline.en },
          {
            "@type": "BreadcrumbList",
            "@id": \`\${url}#breadcrumb\`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: UI.work.en, item: abs("work/") },
              { "@type": "ListItem", position: 2, name: p.title },
            ],
          },
        ];
      };`,note:{en:`Each case study gets a schema.org graph: an ItemPage, a CreativeWork filled from the project JSON (the 30-second summary as abstract, tool names from tools.json), an ImageObject and a BreadcrumbList. The creator, the site's Person, is referenced by @id with name and URL repeated, because Google does not follow @id across pages. Tool pages are noindex and get none.`,cs:`Každá případová studie dostane graf podle schema.org: ItemPage, CreativeWork naplněný z JSONu projektu (shrnutí Ve zkratce jako abstrakt, názvy nástrojů z tools.json), ImageObject a BreadcrumbList. Autor, tedy Person celého webu, je odkázán přes @id a jméno i adresa se opakují, protože Google odkazy @id mezi stránkami nesleduje. Stránky nástrojů mají noindex a graf nedostanou.`}},{title:{en:`Bands and a beat from the analyser, every frame`,cs:`Pásma a beat z analyzátoru v každém snímku`},lang:`typescript`,file:`src/lib/audio.ts`,snippet:`  private analyse() {
    const a = this.analyser;
    const f = this.freq;
    const ctx = this.ctx;
    if (!a || !f || !ctx) return;
    a.getByteFrequencyData(f);
    const hz = ctx.sampleRate / a.fftSize;
    const band = (lo: number, hi: number) => {
      const i0 = Math.max(1, Math.floor(lo / hz));
      const i1 = Math.min(f.length - 1, Math.ceil(hi / hz));
      let s = 0;
      for (let i = i0; i <= i1; i++) s += f[i];
      return s / ((i1 - i0 + 1) * 255);
    };
    const raw = { bass: band(30, 160), mid: band(160, 2500), high: band(2500, 12000) };
    // Adaptive peak normalisation, so quiet microphones still drive the visuals.
    const norm = (k: keyof typeof raw) => {
      this.peaks[k] = Math.max(raw[k], this.peaks[k] * 0.996, 0.08);
      return Math.min(1, raw[k] / this.peaks[k]);
    };
    const bass = norm("bass");
    const mid = norm("mid");
    const high = norm("high");
    const b = this.bands;
    const ease = (prev: number, next: number) => (next > prev ? prev + (next - prev) * 0.55 : prev + (next - prev) * 0.12);
    b.bass = ease(b.bass, bass);
    b.mid = ease(b.mid, mid);
    b.high = ease(b.high, high);
    b.level = ease(b.level, (bass + mid + high) / 3);

    const now = ctx.currentTime;
    this.bassAvg = this.bassAvg * 0.94 + raw.bass * 0.06;
    if (raw.bass > this.bassAvg * 1.3 && raw.bass > 0.18 && now - this.lastBeat > 0.22) {
      this.lastBeat = now;
      b.beat = 1;
    } else {
      b.beat *= 0.9;
    }
    this.writeCss();
  }`,note:{en:`While sound is on, analyse() averages the spectrum each frame into 30–160 Hz, 160–2,500 Hz and 2.5–12 kHz bands and divides each by a slowly decaying peak (never below 0.08); values rise fast, fall slowly. A beat fires when raw bass is 30% above its running average and above 0.18, at most every 220 ms. Results go to CSS variables.`,cs:`Dokud je zapnutý zvuk, analyse() v každém snímku zprůměruje bajtové spektrum do pásem 30–160 Hz, 160–2 500 Hz a 2,5–12 kHz a každé vydělí pomalu klesající špičkou (nikdy pod 0,08); hodnoty rychle stoupají a pomalu klesají. Beat se spustí, když je surový bas o 30 % nad klouzavým průměrem a zároveň nad 0,18, nejvýš jednou za 220 ms. Výsledky se zapíšou do CSS proměnných.`}},{title:{en:`The one-page check on every CV`,cs:`Kontrola jedné strany u každého CV`},lang:`python`,file:`cv-src/build.py`,snippet:`def page_count(pdf: Path) -> int:
    data = pdf.read_bytes()
    return len(re.findall(rb"/Type\\s*/Page(?![s\\w])", data))


def print_pdfs() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    bad = 0
    with tempfile.TemporaryDirectory(prefix="cv-chrome-") as profile:
        for role in ROLES:
            for lang in LANGS:
                src = SRC / f"{role}-{lang}.html"
                out = OUT / f"Aspandiyar-Kurman-CV-{role}-{lang}.pdf"
                subprocess.run(
                    [
                        str(CHROME),
                        "--headless=new",
                        "--disable-gpu",
                        "--no-first-run",
                        "--no-default-browser-check",
                        f"--user-data-dir={profile}",
                        "--no-pdf-header-footer",
                        f"--print-to-pdf={out}",
                        src.as_uri(),
                    ],
                    check=True,
                    capture_output=True,
                    timeout=120,
                )
                n = page_count(out)
                flag = "" if n == 1 else "  <-- NOT ONE PAGE"
                bad += n != 1
                print(f"{out.name}: {n} page(s), {out.stat().st_size // 1024} KB{flag}")
    return bad`,note:{en:`page_count() counts the /Type /Page objects in the PDF bytes (the lookahead skips /Pages). print_pdfs() prints every role and language with headless Chrome into public/cv, sharing one throwaway browser profile, and flags and counts any PDF that is not exactly one page; the entry point turns a non-zero count into exit code 1.`,cs:`page_count() spočítá v bajtech PDF objekty /Type /Page (lookahead přeskočí /Pages). print_pdfs() vytiskne v headless Chromu do public/cv každou kombinaci role a jazyka se společným dočasným profilem prohlížeče a každé PDF, které nemá přesně jednu stranu, označí v logu a započítá; vstupní bod skriptu z nenulového počtu udělá návratový kód 1.`}}],links:[{label:`aspandos.github.io`,href:`https://aspandos.github.io/`}]};export{e as default};