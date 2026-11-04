var e={id:`portfolio-site`,title:`Portfolio HQ`,year:`2026`,order:0,status:`in-progress`,client:null,roles:{gamedev:1,frontend:9,motion:3,audioreactive:5,aidev:10},kicker:{en:`Frontend · React · Claude Code`,cs:`Frontend · React · Claude Code`},headline:{en:`Portfolio website`,cs:`Portfoliový web`},summary:{en:`I built this site myself, with help from Claude.`,cs:`Tento web vznikl vlastními silami, za pomoci Clauda.`},highlights:[{en:`The role lens writes its choice into the address (?for=frontend), so a recruiter can be sent a pre-filtered link. It sorts by the 0–10 role score in each project's JSON (ties go to the overall ranking) and leaves out anything under 4.`,cs:`Pohled podle role zapíše volbu do adresy (?for=frontend), takže recruiterovi stačí poslat předfiltrovaný odkaz. Projekty řadí podle skóre 0–10 pro danou roli v JSONu každého projektu (při shodě rozhoduje celkové pořadí) a vynechá vše pod 4.`},{en:`Each section, case study and tool gets its own static index.html (title, description, Open Graph image, plain-HTML fallback with real links). A Vite plugin (scripts/route-pages.ts) stamps them after bundling and adds schema.org JSON-LD (WebSite, ProfilePage, CreativeWork, breadcrumbs), canonical links, robots.txt and a sitemap of the pages worth indexing. One React bundle boots on all of them; old #/ links still resolve.`,cs:`Každá sekce, případová studie i nástroj má vlastní statický index.html (titulek, popis, obrázek pro Open Graph, záložní HTML se skutečnými odkazy). Po buildu je vytvoří plugin pro Vite (scripts/route-pages.ts) a doplní JSON-LD podle schema.org (WebSite, ProfilePage, CreativeWork, drobečková navigace), kanonické odkazy, robots.txt a sitemapu stránek k indexaci. Na všech běží jeden bundle Reactu; staré odkazy s #/ fungují dál.`},{en:`src/lib/audio.ts synthesises a small generative track in the browser (pad, arpeggio, sub bass and drums, so there is nothing to license) and falls back to it if microphone permission is refused; its bands drive the Ring Field and pulse the data on the flow graphs. The field runs live on desktops and as a still frame on tablets until sound is on; phones keep a plain black background to save data and battery.`,cs:`src/lib/audio.ts syntetizuje v prohlížeči malou generativní skladbu (pad, arpeggio, sub bas a bicí, takže není co licencovat) a přepne na ni, když návštěvník nepovolí mikrofon; jeho pásma pohánějí Ring Field i pulzy dat na grafech propojení. Na desktopu pole běží živě, na tabletu do zapnutí zvuku jako statický snímek a telefony mají kvůli datům a baterii čistě černé pozadí.`},{en:`The gzipped main bundle fell from 199 KB to under 160 KB, and a mobile Toolkit layout shift was traced and fixed (CLS 0.18 → 0). The feed ships light cards and loads case studies on demand; the first bundle carries only tool ids, and video loops and the three.js background wait for first paint (useAfterPaint). Inter is self-hosted as a 13 KB Czech subset (fontTools) instead of the 130 KB latin-ext file.`,cs:`Hlavní bundle se po gzipu zmenšil z 199 KB pod 160 KB a posun rozvržení na mobilní stránce Nástroje byl dohledán a opraven (CLS 0,18 → 0). Feed posílá odlehčené karty a případové studie stahuje až na vyžádání; první bundle nese jen ID nástrojů a videosmyčky i pozadí v three.js čekají na první vykreslení (useAfterPaint). Písmo Inter je hostované na webu jako 13KB česká podmnožina (fontTools) místo 130KB souboru latin-ext.`},{en:`Before anything is published, Chrome visual checks run at desktop width and 390 px, and a leak scan looks for unpublished client work, the licence key, source maps and local paths. On the production build, Lighthouse gives mobile Home 91, Toolkit 87, CV 89 and case study 85. Desktop Home gets 95; accessibility, best practices and SEO get 100 on every page tested. Review passes check every code excerpt line by line against its source file.`,cs:`Před každým zveřejněním proběhnou vizuální kontroly v Chromu v šířce desktopu i 390 px a kontrola úniků, která hledá nezveřejněnou klientskou práci, licenční klíč, source mapy a lokální cesty. Na produkčním buildu dává Lighthouse na mobilu úvodu 91, Nástrojům 87, CV 89 a případové studii 85. Úvod na desktopu má 95; přístupnost, osvědčené postupy i SEO mají na každé testované stránce 100. Revizní průchody porovnají každou ukázku kódu řádek po řádku se zdrojovým souborem.`},{en:`cv-src/build.py turns the site's own profile, tool and project files into a one-page CV in English and Czech, linking the projects it names to their case studies. FFmpeg scripts make the thumbnails and 1200×630 share images. One command (scripts/deploy-pages.sh) builds the site and pushes only dist/ to the public GitHub Pages repository, so the source stays private.`,cs:`cv-src/build.py z profilu, nástrojů a projektů webu vytvoří jednostránkové CV v angličtině a češtině a projekty, které v něm uvádí, odkáže na jejich případové studie. Skripty s FFmpeg vyrábějí náhledy a obrázky 1200×630 pro sdílení. Jediný příkaz (scripts/deploy-pages.sh) web sestaví a do veřejného repozitáře GitHub Pages pošle jen dist/, takže zdrojový kód zůstává soukromý.`}],pitch:{frontend:{en:`A gzipped main bundle under 160 KB and phone CLS cut to 0, with path routing and content in JSON.`,cs:`Hlavní bundle pod 160 KB po gzipu a CLS na telefonech snížené na 0, s routingem přes cesty a obsahem v JSONu.`},audioreactive:{en:`Bass, mid, high and beat from the site's synth or a visitor's microphone drive the three.js background every frame.`,cs:`Basy, středy, výšky a beat ze syntezátoru webu nebo z mikrofonu návštěvníka pohánějí v každém snímku pozadí v three.js.`},aidev:{en:`Every change passes Lighthouse, visual and leak checks that I define and Claude Code runs, then I sign off.`,cs:`Každá změna projde kontrolami Lighthouse, vizuálu a úniků, které určuji a spouští Claude Code; pak ji schvaluji.`}},tools:[`claude-code`,`typescript`,`react`,`vite`,`tailwind`,`threejs`,`html-css`,`git`,`python`,`ffmpeg`],flow:[{from:`claude-code`,to:`typescript`,label:{en:`writes the code`,cs:`píše kód`}},{from:`claude-code`,to:`react`,label:{en:`builds the views`,cs:`staví pohledy`}},{from:`ffmpeg`,to:`react`,label:{en:`loops, thumbs, share images`,cs:`smyčky, náhledy, obrázky pro sdílení`}},{from:`typescript`,to:`vite`,label:{en:`typecheck + build`,cs:`typecheck + build`}},{from:`react`,to:`vite`,label:{en:`a page per route`,cs:`stránka pro každou cestu`}},{from:`vite`,to:`git`,label:{en:`dist/ to GitHub Pages`,cs:`dist/ na GitHub Pages`}},{from:`python`,to:`html-css`,label:{en:`CVs, PDF via Chrome`,cs:`CV, PDF přes Chrome`}}],media:{aspect:`16:9`,poster:`media/portfolio-site/poster.webp`,focus:`15% 50%`,loop:`media/portfolio-site/loop.mp4`,full:null,gallery:[{src:`media/portfolio-site/g1.webp`,aspect:`16:9`,caption:{en:`Motion lens on Home: motion pieces first.`,cs:`Úvod v pohledu Motion: nejdřív motion práce.`}},{src:`media/portfolio-site/g2.webp`,aspect:`16:9`,caption:{en:`From the source: unedited excerpts from a project's files, switched by tabs.`,cs:`Ze zdrojového kódu: needitované ukázky ze souborů projektu, přepínané záložkami.`}},{src:`media/portfolio-site/g3.webp`,aspect:`16:9`,caption:{en:`Toolkit pipelines as node graphs: tools as nodes, data on the wires.`,cs:`Pipeline na stránce Nástroje jako grafy uzlů: uzly jsou nástroje, spoje data.`}},{src:`media/portfolio-site/g4.webp`,aspect:`16:9`,caption:{en:`At 390 px phone width: Home, a case study, its closing contact block and the CV.`,cs:`V šířce telefonu (390 px): úvod, případová studie, její závěrečný kontaktní blok a CV.`}}]},audio:`none`,credits:[{en:`Code written with Claude Code (Anthropic's AI coding agent) under my direction; Claude Code also ran the checks. Concept, system design, design direction, content decisions, test criteria, review and sign-off are mine.`,cs:`Kód vznikl v Claude Code (AI agent pro programování od Anthropicu) pod mým vedením; Claude Code spouštěl i kontroly. Koncept, návrh systému, směr designu, rozhodnutí o obsahu, kritéria testů, kontrola výsledků i schválení jsou moje.`},{en:`Interface components from React Bits Pro (licensed), including the Ring Field background, command palette and image loupe; the licence key and the source code stay private`,cs:`Komponenty rozhraní z React Bits Pro (licencované), mimo jiné pozadí Ring Field, příkazová paleta a lupa na obrázky; licenční klíč i zdrojový kód zůstávají soukromé`},{en:`Inter typeface by Rasmus Andersson (SIL Open Font License 1.1), self-hosted`,cs:`Písmo Inter od Rasmuse Anderssona (SIL Open Font License 1.1), hostované přímo na webu`},{en:`three.js (MIT licence)`,cs:`three.js (licence MIT)`},{en:`The card feed and ⌘K palette follow the HQ dashboard style of hq.easymachineai.com; the top bar follows the React Bits Pro SaaS template`,cs:`Feed karet a paleta ⌘K vycházejí ze stylu dashboardu HQ na hq.easymachineai.com; horní lišta vychází ze šablony SaaS od React Bits Pro`},{en:`All stills and the loop are headless-Chrome screenshots of the live site: 1600 px wide for desktop, 390 px with touch emulation for the phone views; the loop crossfades between them`,cs:`Všechny obrázky i smyčka jsou snímky obrazovky živého webu pořízené v headless Chromu: v šířce 1600 px pro desktop a 390 px s emulací dotyku pro telefon; smyčka mezi nimi plynule prolíná`}],tldr:{en:`A bilingual React 19 and TypeScript portfolio with a static page per route; every page tested scores 100 for Lighthouse accessibility, best practices and SEO.`,cs:`Dvojjazyčné portfolio v Reactu 19 a TypeScriptu se statickou stránkou pro každou cestu; každá testovaná stránka má v Lighthouse 100 za přístupnost, osvědčené postupy i SEO.`},role:{en:`Personal project. Concept, system design, content and publishing rules, test criteria, review and sign-off; code written with Claude Code under my direction.`,cs:`Vlastní projekt. Koncept, návrh systému, obsah a pravidla zveřejňování, kritéria testů, kontrola a schválení; kód vznikl v Claude Code pod mým vedením.`},code:[{title:{en:`Structured data for every case study`,cs:`Strukturovaná data případových studií`},lang:`typescript`,file:`scripts/route-pages.ts`,snippet:`      const caseGraph = (p: ProjectJson, s: Seo.PageSeo, image: string) => {
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
      };`,note:{en:`Each case study gets a schema.org graph from its JSON, and the creator node repeats name and URL because Google won't follow @id across pages.`,cs:`Každá případová studie dostane z JSONu graf podle schema.org a uzel creator v něm opakuje jméno i adresu, protože Google odkazy @id mezi stránkami nesleduje.`}},{title:{en:`Bands and a beat from the analyser, every frame`,cs:`Pásma a beat z analyzátoru v každém snímku`},lang:`typescript`,file:`src/lib/audio.ts`,snippet:`  private analyse() {
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
  }`,note:{en:`Each frame, analyse() writes three peak-normalised bands and a beat to CSS variables. The beat fires only when bass is 30% above its running average.`,cs:`analyse() v každém snímku zapíše do CSS proměnných tři pásma normalizovaná podle špičky a beat. Beat se spustí, jen když je bas o 30 % nad klouzavým průměrem.`}},{title:{en:`The one-page check on the CV`,cs:`Kontrola jedné strany u CV`},lang:`python`,file:`cv-src/build.py`,snippet:`def page_count(pdf: Path) -> int:
    data = pdf.read_bytes()
    return len(re.findall(rb"/Type\\s*/Page(?![s\\w])", data))


def print_cv() -> int:
    """Print the CV in each language to public/cv/ (each must be one page), then copy the English one to
    public/cv.pdf for old /cv.pdf links."""
    CV_OUT.mkdir(parents=True, exist_ok=True)
    bad = 0
    with tempfile.TemporaryDirectory(prefix="cv-chrome-") as profile:
        for lang in LANGS:
            src = SRC / f"cv-{lang}.html"
            out = CV_OUT / f"Aspandiyar-Kurman-CV-{lang}.pdf"
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
            print(f"{out.name}: {n} page(s), {out.stat().st_size // 1024} KB{flag}")`,note:{en:`page_count() counts /Type /Page objects (the lookahead skips /Pages); print_cv() prints the English and Czech CV with headless Chrome and flags any PDF that is not exactly one page.`,cs:`page_count() spočítá objekty /Type /Page (lookahead přeskočí /Pages); print_cv() vytiskne anglické a české CV v headless Chromu a označí každé PDF, které nemá přesně jednu stranu.`}}],links:[{label:`aspandos.github.io`,href:`https://aspandos.github.io/`}]};export{e as default};