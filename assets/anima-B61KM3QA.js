var e={id:`anima`,title:`Anima`,year:`2026`,order:0,status:`finished`,client:null,roles:{gamedev:6,frontend:1,motion:8,audioreactive:10,aidev:5},kicker:{en:`Audio-reactive · TouchDesigner · GLSL`,cs:`Audioreaktivní · TouchDesigner · GLSL`},headline:{en:`A flower that hears music: 262,144 GPU particles`,cs:`Květina, která slyší hudbu: 262\xA0144 částic na GPU`},summary:{en:`In Anima, a real flower photo comes apart into hair, strands and dust as the song plays. Only selected cells of an 8×14 grid stay sharp, and a virtual relief camera films the particles that replace the rest. The vertical 1080×1920, 60 fps reel was rendered offline frame by frame.`,cs:`V Animě se skutečná fotografie květiny během písně rozpadá na vlákna, prameny a prach. Ostrá zůstává jen ve vybraných buňkách mřížky 8×14 a částice, které nahradí zbytek, snímá virtuální reliéfní kamera. Vertikální reel 1080×1920 v 60 fps byl vyrenderován offline snímek po snímku.`},tldr:{en:`A flower photo dissolves into GPU particles while the kick, drops, voice and melody each move their own layer, in a finished 60-second reel.`,cs:`Fotografie květiny se rozpadá na částice na GPU a kopák, dropy, zpěv i melodie řídí samostatné vrstvy; výsledkem je 60sekundový reel.`},role:{en:`Solo project. Concept, art direction and technical direction; code written with AI coding agents.`,cs:`Samostatný projekt. Koncept, art direction a technické vedení; kód vznikl s AI agenty pro programování.`},highlights:[{en:`The 262,144 particles each get a home from PCG-hash rejection sampling on the flower's alpha with a rim-proximity score, then ride a divergence-free curl-noise wind (a 512×512 rgba32float state fed back through a GLSL TOP every frame).`,cs:`Každá z 262 144 částic dostane domovskou pozici rejection samplingem s PCG hashem nad alfa kanálem květiny se skóre blízkosti okraje a pak ji unáší bezdivergenční curl-noise vítr (stav 512×512 v rgba32float se každý snímek vrací zpětnou vazbou přes GLSL TOP).`},{en:`The depth-relief camera, a single fragment shader, films the flat photo as if it were 3D, with 16-tap golden-angle depth of field and a moving focus, chromatic aberration as three per-channel unprojections, barrel distortion and a thin-lens black hole with a photon ring.`,cs:`Reliéfní kamera v jediném fragment shaderu snímá plochou fotografii, jako by byla ve 3D, s hloubkou ostrosti z 16 vzorků podle zlatého úhlu a putujícím ohniskem, chromatickou aberací ze tří zpětných projekcí po kanálech, soudkovitým zkreslením a černou dírou s fotonovým prstencem jako tenkou čočkou.`},{en:`Live, a 2048-point FFT drives kick, tempo and drop detection; offline, a background Demucs htdemucs job turns the vocal and melody stems into 60 fps loudness curves and a spectral-centroid pitch curve for the melody, read in sync with playback.`,cs:`Živě z 2048bodové FFT vychází detekce kopáku, tempa a dropů; offline úloha Demucs htdemucs na pozadí převede stopy zpěvu a melodie na křivky hlasitosti v 60 fps a u melodie na křivku výšky (spektrální centroid), čtené synchronně s přehráváním.`},{en:`On every open, build_anima.py regenerates the whole TouchDesigner network and keeps user control values; Anima.toe is a 946-byte bootstrap whose Execute DAT runs it. A prep script cuts each photo onto black with colour-heuristic mattes, then writes its depth map and QA contact sheet.`,cs:`Při každém otevření build_anima.py vygeneruje celou síť TouchDesigneru a zachová nastavení ovládacích prvků; Anima.toe je 946bajtový zavaděč, jehož Execute DAT skript spustí. Přípravný skript vyřízne každou fotografii na černé pozadí barevnými heuristickými maskami a vytvoří k ní hloubkovou mapu a kontaktní arch pro QA.`},{en:`An Xbox controller plays the piece live (LB shifts to an effects layer), while a shot-based camera director cycles push, pull, orbit, macro, roll and drift shots and punches in on drops. The 60 s reel has no dropped frames.`,cs:`Dílo se hraje živě na ovladači Xbox s přepínací vrstvou efektů na LB a režie kamery postavená na záběrech střídá najetí, odjezd, orbit, makro, rotaci a drift a na dropech přidává punch-in. Výsledný 60sekundový reel nemá jediný vynechaný snímek.`}],pitch:{audioreactive:{en:`Kick and drops come from the finished song through live DSP, voice and melody through ML stem separation; each part drives its own visual behaviour.`,cs:`Kopák a dropy z hotové skladby zachytí živé DSP, zpěv a melodii oddělí separace stop pomocí ML a každá složka pak má vlastní vizuální chování.`},motion:{en:`I choreograph the camera and motion procedurally: a shot library with punch-ins on drops, particle morphs between flowers and a finished 9:16 reel.`,cs:`Kameru i pohyb choreografuji procedurálně: knihovna záběrů s punch-iny na dropech, morfování částic mezi květinami a hotový reel 9:16.`},gamedev:{en:`The graphics-programming core a game team relies on: a 262k-particle GPU simulation, gamepad controls with a shift layer and iterative inverse projection in a fragment shader.`,cs:`Jádro grafického programování, na kterém herní tým staví: GPU simulace 262 tisíc částic, ovládání gamepadem s přepínací vrstvou a iterativní inverzní projekce ve fragment shaderu.`},aidev:{en:`On every open, Python regenerates the whole TouchDesigner network; a silent test probe logs frame-time gaps and operator errors in what the AI coding agents built.`,cs:`Při každém otevření Python znovu vygeneruje celou síť TouchDesigneru; testovací sonda běžící bez zvuku loguje prodlevy mezi snímky a chyby operátorů v práci AI agentů pro programování.`}},tools:[`touchdesigner`,`glsl`,`python`,`demucs`,`depth-anything`,`pytorch`],flow:[{from:`python`,to:`touchdesigner`,label:{en:`network generated on every open`,cs:`síť vygenerovaná při otevření`}},{from:`touchdesigner`,to:`python`,label:{en:`live 2048-point FFT spectrum`,cs:`živé spektrum z 2048bodové FFT`}},{from:`demucs`,to:`python`,label:{en:`60 fps voice and melody curves`,cs:`křivky zpěvu a melodie v 60 fps`}},{from:`depth-anything`,to:`glsl`,label:{en:`relief-camera depth maps`,cs:`hloubkové mapy reliéfní kamery`}},{from:`python`,to:`glsl`,label:{en:`kick, voice, dust-burst and camera uniforms`,cs:`uniformy kopáku, zpěvu, prachových výbuchů a kamery`}}],media:{aspect:`9:16`,poster:`media/anima/poster.webp`,loop:`media/anima/loop.mp4`,full:`media/anima/full.mp4`,gallery:[{src:`media/anima/g1.webp`,aspect:`16:9`,caption:{en:`Pipeline, left to right: source photo (Sean McGrath, CC BY 2.0), automatic cut-out, Depth Anything V2 depth map, final frame.`,cs:`Pipeline zleva doprava: zdrojová fotografie (Sean McGrath, CC BY 2.0), automatický výřez, hloubková mapa z Depth Anything V2, výsledný snímek.`}},{src:`media/anima/g2.webp`,aspect:`16:9`,caption:{en:`A Morph in four frames: particles leave the cherry blossom and pour into the lily in about 1.5 s.`,cs:`Přechod Morph ve čtyřech snímcích: částice opouštějí třešňový květ a zhruba za 1,5 s se přelijí do tvaru lilie.`}},{src:`media/anima/g3.webp`,aspect:`1:1`,caption:{en:`Native-resolution detail: photo cells, particle hair off the orchid and the live tracking overlay with bitmap-font readouts.`,cs:`Detail v nativním rozlišení: buňky s fotografií, vlákna částic z orchideje a živý trackingový overlay s čísly z bitmapového fontu.`}},{src:`media/anima/g4.webp`,aspect:`16:9`,caption:{en:`The reel's five flowers: Kanzan cherry, orange lily, pink orchid, white orchid and peony.`,cs:`Pět květin z reelu: sakura Kanzan, oranžová lilie, růžová orchidej, bílá orchidej a pivoňka.`}}]},audio:`muted`,credits:[{en:`Inspired by 'Anima' from Santiago Sares' Aura Series.`,cs:`Inspirováno dílem „Anima“ z cyklu Aura Series od Santiaga Sarese.`},{en:`Black-hole effect and 'aura' colour mode after Pablo Torri.`,cs:`Efekt černé díry a barevný režim „aura“ podle předlohy Pabla Torriho.`},{en:`Flower photos via Wikimedia Commons, edited (cut out, depth-mapped, re-rendered): Kanzan cherry by Marie-Lan Nguyen (CC BY 2.5), orange lily by Sean McGrath (CC BY 2.0), pink orchid by domdomegg (CC BY 4.0), peony by Mark Freeth (CC BY 2.0); white orchid by Mustang Joe (CC0).`,cs:`Fotografie květin z Wikimedia Commons, upravené (vyříznuté, doplněné o hloubkovou mapu a znovu vyrenderované): sakura Kanzan – Marie-Lan Nguyen (CC BY 2.5), oranžová lilie – Sean McGrath (CC BY 2.0), růžová orchidej – domdomegg (CC BY 4.0), pivoňka – Mark Freeth (CC BY 2.0); bílá orchidej – Mustang Joe (CC0).`},{en:`Original reel set to 'Goth'. Audio removed for licensing.`,cs:`Původní reel na skladbu „Goth“. Zvuk byl z licenčních důvodů odstraněn.`},{en:`Depth maps: Depth Anything V2 Small (Apache-2.0). Stem separation: Demucs htdemucs (MIT).`,cs:`Hloubkové mapy: Depth Anything V2 Small (Apache-2.0). Separace stop: Demucs htdemucs (MIT).`}],code:[{title:{en:`Relief camera: fixed-point inverse projection`,cs:`Reliéfní kamera: inverze projekce iterací pevného bodu`},lang:`glsl`,file:`td/shaders/anima_lens.glsl`,snippet:`const float F = 2.2;          // focal length of the relief camera (frame heights)

vec2 rot(vec2 p, float a)
{
	float c = cos(a), s = sin(a);
	return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

float depthAt(vec2 q)            // q: flower point, centred square units
{
	vec2 uv = q / vec2(uCam3.w, 1.0) + 0.5;
	return mix(texture(sTD2DInputs[2], uv).r, texture(sTD2DInputs[1], uv).r, clamp(uRelief.y, 0.0, 1.0));
}

// flower point (with its depth) -> where the turned camera sees it, before pan/zoom/roll
vec2 project(vec2 q, float d)
{
	vec3 p = vec3(q, (d - 0.5) * uRelief.x);
	float cy = cos(uCam2.x), sy = sin(uCam2.x);
	p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
	float cp = cos(uCam2.y), sp = sin(uCam2.y);
	p = vec3(p.x, cp * p.y - sp * p.z, sp * p.y + cp * p.z);
	return p.xy * F / (F - p.z);
}

// screen point (centred square units) -> flower point
vec2 unproject(vec2 s)
{
	vec2 t = rot(s + uCam1.xy - uCam3.xy, -uCam1.w) / max(uCam1.z, 0.05);
	vec2 q = t;
	for (int i = 0; i < 4; i++)
		q += t - project(q, depthAt(q));
	return q;
}`,note:{en:`project() turns each flower point by yaw and pitch using its own depth, read at the point being solved for, so there is no direct inverse; unproject() finds what each pixel sees in 4 fixed-point steps, re-reading the depth map at every guess.`,cs:`Funkce project() natáčí každý bod květiny o yaw a pitch podle jeho vlastní hloubky, čtené právě v hledaném bodě, takže přímá inverze neexistuje; unproject() najde, co vidí každý pixel, ve 4 krocích iterace pevného bodu a při každém odhadu znovu čte hloubkovou mapu.`}},{title:{en:`Live kick, tempo and drop detection`,cs:`Živá detekce kopáku, tempa a dropů`},lang:`python`,file:`td/scripts/anima_ctrl.py`,snippet:`def audio(dt, t):
	try:
		a = op('/project1/audio/spectrum').numpyArray()[0]
	except Exception:
		return
	raw = [float(a[1:7].mean()), float(a[10:60].mean()), float(a[90:200].mean())]
	bands = []
	for j, x in enumerate(raw):
		x = math.log1p(10.0 * max(x, 0.0)) / math.log(11.0)
		S['peak'][j] = max(S['peak'][j] * math.exp(-dt / 20.0), x, 1e-3)
		bands.append(min(1.0, x / S['peak'][j]))
	S['bands'] = bands
	low = bands[0]
	S['level'] = sum(bands) / 3.0
	S['slow_low'] = ema(S['slow_low'], low, dt, 0.45)
	S['kick'] *= math.exp(-dt / 0.12)
	if (low > S['slow_low'] * 1.25 + 0.05 and low - S['prev_low'] > 0.03
			and t - S['last_kick'] > 0.17 and low > 0.3):
		gap = t - S['last_kick']
		if 0.3 < gap < 1.0:                       # the tempo, learnt from the kicks
			S['beat'] = ema(S['beat'], gap, gap, 4.0)
		elif 0.6 < gap / 2.0 < 1.0 and gap < 2.0:  # a kick on every other beat
			S['beat'] = ema(S['beat'], gap / 2.0, gap, 6.0)
		S['last_kick'] = t
		S['kick'] = 1.0
		S['kicks'] += 1
		on_kick(t)
	S['prev_low'] = low
	S['fast'] = ema(S['fast'], S['level'], dt, 0.25)
	S['slow'] = ema(S['slow'], S['level'], dt, 3.0)
	S['energy'] = min(1.0, S['fast'] * 1.2)
	if S['fast'] < 0.25:
		S['quiet_since'] = S['quiet_since'] or t
	elif S['fast'] > 0.55 and t - S['started'] > 5.0:
		quiet = S['quiet_since'] is not None and t - S['quiet_since'] > 2.0
		if (quiet or S['fast'] > S['slow'] * 1.8) and t - S['last_drop'] > 8.0:
			S['last_drop'] = t
			on_drop(t)
		S['quiet_since'] = None`,note:{en:`The three bands are log-compressed and divided by slowly decaying peaks, so thresholds adapt to the mix. Kick gaps of 0.3–1 s (halved on every-other-beat kicks) teach the tempo. Drops fire at most every 8 s, when fast energy tops 1.8× the slow average or returns after over 2 s of quiet.`,cs:`Tři pásma se logaritmicky komprimují a dělí pomalu klesajícími špičkami, takže se prahy přizpůsobí mixu. Tempo se detektor učí z odstupů kopáků 0,3–1 s (u kopáku na každou druhou dobu z poloviny odstupu). Drop se spustí nejvýše jednou za 8 s, když rychlá energie překročí 1,8násobek pomalého průměru nebo se vrátí po více než 2 s ticha.`}}],links:[{label:`Kanzan cherry · Marie-Lan Nguyen (CC BY 2.5)`,href:`https://commons.wikimedia.org/wiki/File:Prunus_serrulata_Kanzan_blossom_Jardin_des_Plantes_2013-04-21.jpg`},{label:`Orange lily · Sean McGrath (CC BY 2.0)`,href:`https://commons.wikimedia.org/wiki/File:Lily_(2679492137).jpg`},{label:`Pink orchid · domdomegg (CC BY 4.0)`,href:`https://commons.wikimedia.org/wiki/File:White_and_pink_orchid_on_black_background.JPG`},{label:`White orchid · Mustang Joe (CC0)`,href:`https://commons.wikimedia.org/wiki/File:White_Orchid2.jpg`},{label:`Peony · Mark Freeth (CC BY 2.0)`,href:`https://commons.wikimedia.org/wiki/File:Bowl_of_beauty.jpg`}]};export{e as default};