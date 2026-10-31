var e={id:`audiovisualizer`,title:`AudioVisualizer`,year:`2026`,order:0,status:`finished`,client:null,roles:{gamedev:7,frontend:7,motion:9,audioreactive:10,aidev:7},kicker:{en:`Real-time · TouchDesigner · GLSL`,cs:`Real-time · TouchDesigner · GLSL`},headline:{en:`Eighteen GPU worlds that find the drop themselves`,cs:`Osmnáct GPU světů, které si drop najdou samy`},summary:{en:`AudioVisualizer is a live music visualizer built in TouchDesigner. Its GPU-shaded styles range from a hyperbolic Circle Limit floor and a Gothic rose window to a 65,000-domino cascade. An auto director reacts to breakdowns, build-ups and drops; performers steer it live with Kinect gestures, MIDI or a phone panel.`,cs:`AudioVisualizer je živý hudební vizualizér postavený v TouchDesigneru. Jeho styly renderované shadery na GPU sahají od hyperbolické podlahy Circle Limit a gotické rozety po kaskádu 65 000 kostek domina. Automatický režisér reaguje na breakdown, build-up i drop a performer ho naživo řídí gesty přes Kinect, přes MIDI nebo panelem v telefonu.`},tldr:{en:`A TouchDesigner music visualizer whose 18 shader worlds react to spectrum and kick, finished as five vertical reels.`,cs:`Hudební vizualizér v TouchDesigneru: 18 shaderových světů reaguje na spektrum a kopák a výsledkem je pět vertikálních reelů.`},role:{en:`Solo project. Concept, art direction and technical direction; code written with AI coding agents.`,cs:`Samostatný projekt. Koncept, art direction a technické vedení; kód vznikl s AI agenty pro programování.`},highlights:[{en:`Python build scripts generate the whole operator network (the .toe is only a bootstrap) and rebuilds keep control values; one params.json (258 controls) drives TouchDesigner's parameters and the auto-built phone UI.`,cs:`Celou síť operátorů generují build skripty v Pythonu (soubor .toe je jen zavaděč) a rebuild zachová hodnoty ovladačů; jediný params.json (258 ovladačů) řídí parametry v TouchDesigneru i automaticky sestavené rozhraní v telefonu.`},{en:`The GLSL (about 15,300 lines, 96 files) rests on exact maths: a {p,q} tiling where each kick step is an exact symmetry, an endless Penrose zoom, Chladni figures picked by a 4096-point FFT and 4,000 RK4-integrated strange-attractor threads with a live Lyapunov verdict. Five offline Python tests verify it.`,cs:`GLSL (zhruba 15 300 řádků v 96 souborech) stojí na přesné matematice: {p,q} dláždění, kde je každý posun na kopák přesnou symetrií, nekonečný zoom Penroseova dláždění, Chladniho obrazce vybírané 4096bodovou FFT a 4 000 vláken podivných atraktorů (integrace RK4) s živým Ljapunovovým exponentem. Matematiku ověřuje pět offline testů v Pythonu.`},{en:`Analysis yields a 256-bin spectrum, low/mid/high bands and kick detection; the kick-based tempo tracker's flywheel keeps time through breaks. On a breakdown, build-up or drop, the auto director switches style, fires a flash, cuts the beat-driven camera and shifts colour.`,cs:`Analýza dává spektrum o 256 binech, úrovně basů, středů a výšek a detekci kopáku; „setrvačník“ odhadu tempa z kopáků drží rytmus i během pauz. Při breakdownu, build-upu nebo dropu automatický režisér přepne styl, spustí záblesk, přestřihne rytmickou kameru a změní barevnost.`},{en:`Local GPU AI lyric pipeline in a separate WebSocket worker: Demucs isolates the vocals and faster-whisper large-v3-turbo returns word timestamps (about 5 s for a 3-minute song); live recognition runs about 1 s behind the singer.`,cs:`Lokální AI pipeline pro texty písní na GPU v samostatném WebSocket workeru: Demucs oddělí vokál a faster-whisper large-v3-turbo vrátí časování slov (asi 5 s na tříminutovou skladbu); živé rozpoznávání se za zpěvem opožďuje asi o 1 s.`},{en:`Kinect v1 body control (gestures, silhouette compositing) and MIDI learn with soft takeover serve the stage. Styles render at 1920×1080 and NVENC records 1080p60, with background 9:16, 1:1 and GIF exports. The five Anthropology reels (1080×1920, 60 fps) came from this pipeline, each in clean and text-hook versions.`,cs:`Ovládání tělem přes Kinect v1 (gesta, vkládání siluety do obrazu) a MIDI learn se soft takeoverem slouží na pódiu. Styly se renderují v 1920×1080, NVENC nahrává v 1080p60 a na pozadí běží exporty do 9:16, 1:1 a GIF. Touto cestou vzniklo pět reelů Anthropology (1080×1920, 60 fps), každý v čisté verzi i s textovým hookem.`}],pitch:{gamedev:{en:`Real-time GPU scenes generated end to end from code: a 65,000-domino cascade, a beat-driven camera rig.`,cs:`Scény na GPU v reálném čase generované celé z kódu: kaskáda 65 000 kostek domina, rytmický kamerový rig.`},frontend:{en:`A vanilla-JS phone panel builds itself from a 258-control schema: echo-suppressed two-way WebSocket sync, a live preview stream and a backend-free mock server.`,cs:`Panel do telefonu ve vanilla JS se sestaví ze schématu 258 ovladačů: obousměrná synchronizace přes WebSocket s filtrováním ozvěn, živý náhled a mock server pro vývoj bez backendu.`},motion:{en:`I turn the system into finished social reels whose cuts, flashes and camera moves follow the song's structure.`,cs:`Ze systému dělám hotové reely pro sociální sítě, v nichž střihy, záblesky i pohyby kamery sledují stavbu skladby.`},audioreactive:{en:`Drops, build-ups, tempo and AI-timed lyrics steer the shader worlds live, from a file or live input.`,cs:`Dropy, build-upy, tempo i texty časované pomocí AI řídí shaderové světy naživo, ze souboru i ze živého vstupu.`},aidev:{en:`Offline tests cover the maths, MIDI and Kinect logic of code written with AI coding agents, without TouchDesigner or hardware.`,cs:`Offline testy pokrývají matematiku, MIDI i logiku Kinectu v kódu od AI agentů pro programování, bez TouchDesigneru i hardwaru.`}},tools:[`touchdesigner`,`glsl`,`python`,`javascript`,`websocket`,`html-css`,`demucs`,`whisper`,`kinect`,`midi`,`ffmpeg`,`depth-anything`],flow:[{from:`python`,to:`touchdesigner`,label:{en:`generates the operator network`,cs:`generuje síť operátorů`}},{from:`touchdesigner`,to:`glsl`,label:{en:`spectrum, bands, kick as uniforms`,cs:`spektrum, pásma, kopák jako uniformy`}},{from:`demucs`,to:`whisper`,label:{en:`isolated vocal stem`,cs:`oddělená vokální stopa`}},{from:`whisper`,to:`touchdesigner`,label:{en:`word timestamps for kinetic lyrics`,cs:`časování slov pro kinetické texty`}},{from:`touchdesigner`,to:`javascript`,label:{en:`live levels + control schema over WebSocket`,cs:`živé úrovně + schéma ovladačů přes WebSocket`}},{from:`touchdesigner`,to:`ffmpeg`,label:{en:`NVENC recordings → 9:16 reels via PyAV`,cs:`NVENC záznamy převedené přes PyAV na reely 9:16`}}],media:{aspect:`9:16`,poster:`media/audiovisualizer/poster.webp`,loop:`media/audiovisualizer/loop.mp4`,full:`media/audiovisualizer/full.mp4`,gallery:[{src:`media/audiovisualizer/g1.webp`,aspect:`4:5`,caption:{en:`Six worlds from the Anthropology reels: Indra's Pearls, Rose Window, Penrose Inlay, Circle Limit, Galaxy and Domino Cascade.`,cs:`Šest světů ze série Anthropology: Indra's Pearls, Rose Window, Penrose Inlay, Circle Limit, Galaxy a Domino Cascade.`}},{src:`media/audiovisualizer/g2.webp`,aspect:`16:9`,caption:{en:`The phone panel's Perform, Look and Audio tabs (mock-server capture); Look shows only the current style's controls.`,cs:`Záložky Perform, Look a Audio panelu v telefonu (snímek z mock serveru); Look ukazuje jen ovladače aktuálního stylu.`}},{src:`media/audiovisualizer/g3.webp`,aspect:`16:9`,caption:{en:`16 of the 18 styles as panel tiles: ornament and science on top, 3D below, then Ring, Particles, Bars and Art Slideshow.`,cs:`16 z 18 stylů jako dlaždice panelu: nahoře ornamentální a vědecké, pod nimi 3D a dole Ring, Particles, Bars a Art Slideshow.`}},{src:`media/audiovisualizer/g4.webp`,aspect:`16:9`,caption:{en:`Effect shaders on Galaxy in reel 02: Leonardo Ink before the drop, Gold Relief on it, Gold Engraving later.`,cs:`Efektové shadery na Galaxy v reelu 02: Leonardo Ink před dropem, Gold Relief na dropu, Gold Engraving později.`}}]},audio:`muted`,credits:[{en:`Set to 'Anthropology' by Vladimir Cauchemar. Audio removed for licensing.`,cs:`Na skladbu „Anthropology“ (Vladimir Cauchemar). Zvuk byl z licenčních důvodů odstraněn.`},{en:`Art Slideshow inspired by uisato's work for Max Cooper; 3D Splats after Gemos_Dodo's MLSharp-TD-Bridge; Frequency Fields after Pablo Torri's tutorial`,cs:`Art Slideshow inspirovaný prací uisato pro Maxe Coopera; 3D Splats podle MLSharp-TD-Bridge (Gemos_Dodo); Frequency Fields podle tutoriálu Pabla Torriho`},{en:`Circle Limit inspired by M. C. Escher's Circle Limit prints, with strapwork after Hankin's Islamic star patterns`,cs:`Circle Limit inspirovaný grafikami M. C. Eschera z cyklu Circle Limit, proplétaný ornament podle Hankinových islámských hvězdicových vzorů`},{en:`Domino-face and Art Slideshow paintings are public-domain works from Wikimedia Commons`,cs:`Malby na kostkách domina a v Art Slideshow jsou volná díla (public domain) z Wikimedia Commons`},{en:`3D Splats depth maps: Depth Anything V2 (Large model, CC BY-NC 4.0)`,cs:`Hloubkové mapy pro 3D Splats: Depth Anything V2 (Large, licence CC BY-NC 4.0)`}],code:[{title:{en:`Folding every pixel into the hyperbolic tiling`,cs:`Skládání každého pixelu do hyperbolického dláždění`},lang:`glsl`,file:`td/shaders/circle_tiling.glsl`,snippet:`	float rho2 = rho * rho;
	for (int i = 0; i < 24; i++) {
		float ang = atan(z.y, z.x);
		float k = floor(ang / sect);
		ang -= k * sect;
		vec2 r = vec2(cos(k * sect), -sin(k * sect));
		z = cmul(z, r);
		D = cmul(D, r);
		vec2 f = manti ? r : conj(r);
		ma = cmul(ma, f);
		mc = cmul(mc, f);
		if (ang > 0.5 * sect) {
			z = cmul(ph, conj(z));
			D = cmul(ph, conj(D));
			anti = !anti;
			par = !par;
			vec2 g = manti ? conj(ph) : ph;
			ma = cmul(ma, g);
			mc = cmul(mc, g);
			manti = !manti;
		}
		vec2 d = z - vec2(x0, 0.0);
		float r2 = dot(d, d);
		if (r2 >= rho2) { conv = true; break; }
		// reflection in the edge: z -> x0 + rho^2 (z - x0) / |z - x0|^2
		vec2 cd = conj(d);
		D = -rho2 * cdiv(conj(D), cmul(cd, cd));
		z = vec2(x0, 0.0) + d * (rho2 / r2);
		anti = !anti;
		par = !par;
		gen++;
		vec2 na = ma * x0 + mb, nb = -ma - mb * x0;
		vec2 nc = mc * x0 + md, nd = -mc - md * x0;
		ma = na; mb = nb; mc = nc; md = nd;
		manti = !manti;
		if (e / length(D) < 0.3) break;                   // under a third of a pixel: rim gold
	}
	float pxs = 1.0 / length(D);              // pixels per folded unit
	float tpx = e * pxs;                      // the tile's inradius in pixels
	if (!conv) tpx = min(tpx, 0.3);`,note:{en:`Rotations, a mirror and reflections in the edge circle fold each pixel into one triangle of the {p,q} tiling, with D carrying the map's derivative. 1/|D| then turns folded distances into exact screen pixels, so each edge is antialiased analytically with one sample.`,cs:`Otáčení, zrcadlení a inverze vzhledem ke kružnici hrany složí každý pixel do jednoho trojúhelníku dláždění {p,q} a D přitom nese derivaci zobrazení. Výraz 1/|D| pak převede složené vzdálenosti na přesné pixely obrazovky, takže každou hranu stačí vyhladit analyticky jediným vzorkem.`}},{title:{en:`Auto director: breakdowns, drops, new sections`,cs:`Automatický režisér: breakdown, drop a nová část`},lang:`python`,file:`td/scripts/director.py`,snippet:`	settled = now - S['started'] > 6.0                        # averages need a moment
	cooldown = now - S['event_at'] > max(6.0, 4 * bar)         # at least 4 bars between changes
	performer = now - GEST['at'] < max(6.0, 4 * bar)          # a body cue holds the floor as long

	# breaks: no kick for a while, or energy sunk well under the average
	quiet = now - S['kick_at'] > 1.6 or S['slow'] < S['long'] * (0.5 + 0.25 * sens)
	min_break = 2.5 - 1.5 * sens
	if quiet and settled:
		if S['break_s'] == 0.0:
			S['ref'] = S['long']                              # how loud the song was before
		S['break_s'] += dt
		if S['break_s'] >= min_break:
			S['armed'] = True
	elif not quiet:
		S['break_s'] = max(0.0, S['break_s'] - dt * 2)
		if S['break_s'] == 0.0:
			S['calm_done'] = False

	if mode != 'off' and settled:
		if S['armed'] and S['kick_now'] and S['fast'] > max(S['long'] * 1.05, S['ref'] * (0.75 - 0.25 * sens)):
			if not performer:          # else the performer already called this drop
				fire('drop', now)
			S.update(armed=False, break_s=0.0, calm_done=False, section_wait=False, bars_wait=False)
		elif S['armed'] and not S['calm_done'] and S['break_s'] > min_break + 2.5 and cooldown:
			fire('break', now)
			S['calm_done'] = True
		else:
			# a section: energy rising well above the song's average, once per rise,
			# and not in the 8 bars after a drop (the average is still catching up)
			ratio = S['slow'] / S['long']
			if ratio < 1.1:
				S['rise_ready'] = True
			if S['rise_ready'] and cooldown and not S['armed'] and now - S['drop_at'] > 8 * bar \\
					and ratio > 1.5 - 0.3 * sens:
				S['section_wait'] = True
				S['rise_ready'] = False
			if mode == 'bars' and now - S['style_at'] > par('Autobars', 16) * bar:
				S['bars_wait'] = True
			if (S['section_wait'] or S['bars_wait']) and cooldown and \\
					(S['kick_now'] or now - S['kick_at'] > 2.0):
				fire('section' if S['section_wait'] else 'bars', now)
				S.update(section_wait=False, bars_wait=False)`,note:{en:`Energy is tracked over 0.25 s, 1.5 s and a 12 s song average. A long enough quiet stretch arms the director; the kick that restores energy fires the drop. A big rise with no break is a new section, at least 6 s and four bars after the last change.`,cs:`Energie se sleduje v úsecích 0,25 s, 1,5 s a jako dvanáctisekundový průměr skladby. Dost dlouhé ztišení přepne režiséra do pohotovosti a kopák, který energii vrátí, spustí drop. Výrazný nárůst bez pauzy je nová část skladby, nejdříve 6 s a čtyři takty po předchozí změně.`}}],links:[{label:`Cinzel font (SIL OFL 1.1)`,href:`https://github.com/NDISCOVER/Cinzel`}]};export{e as default};