var e={id:`audiovj`,title:`AudioVJ`,year:`2026`,order:0,status:`in-progress`,client:null,roles:{gamedev:10,frontend:1,motion:7,audioreactive:10,aidev:7},kicker:{en:`Real-time · Unreal Engine 5 · C++`,cs:`V reálném čase · Unreal Engine 5 · C++`},headline:{en:`Gamepad VJ engine led by beats, drops and vocals`,cs:`VJ engine ovládaný gamepadem sleduje beat, drop i zpěv`},summary:{en:`AudioVJ is a standalone app for playing live visuals to music on an Xbox gamepad. A director turns beats, drops and the singer's pitch into camera moves, post-processing and material parameters across six scenes: a 262k-particle swarm, a night drive under light arches, a temple of floating prism-lit shards, a flight through clouds, a character walking a tiny planet and four liquids. Nothing is wired by hand in the editor.`,cs:`AudioVJ je samostatná aplikace na živé vizuály k hudbě, ovládaná gamepadem Xbox. Režisér převádí beat, dropy a výšku zpěvu na pohyb kamer, post-processing a parametry materiálů v šesti scénách: roj 262 tisíc částic, noční jízda pod světelnými oblouky, chrám s levitujícími úlomky, které rozkládají světlo jako hranol, let mraky, postavička kráčející po miniaturní planetě a čtyři tekutiny. V editoru se nic nezapojuje ručně.`},highlights:[{en:`A custom analyzer hears songs (Windows Media Foundation) and mic or PC audio (WASAPI, including loopback). A 2048-point FFT (Hann window, 512-sample hops) yields 7 bands and kick/snare/hat onsets. A 64-bin log spectrum spans 30 Hz–16 kHz; onset autocorrelation and a PLL track BPM and beat/bar phase.`,cs:`Vlastní analyzátor slyší skladby (Windows Media Foundation) i zvuk z mikrofonu a PC (WASAPI včetně loopbacku). 2048bodová FFT (Hannovo okno, krok 512 vzorků) dává 7 pásem a nástupy kopáku, virblu a hi-hatu. Logaritmické spektrum o 64 binech pokrývá 30 Hz–16 kHz; autokorelace nástupů a PLL sledují BPM a fázi dob a taktů.`},{en:`Offline, Demucs (htdemucs) isolates the vocals; their loudness, pitch and onsets go into custom binary .vjv sidecars at 100 fps. Live, a detector (stereo centre, harmonic energy, YIN pitch tracker with octave check) finds roughly 70–80 % of sung frames against them, at about 0.05 ms a frame.`,cs:`Offline Demucs (htdemucs) oddělí vokály; jejich hlasitost, výška a nástupy se ukládají do sidecarů .vjv se 100 fps ve vlastním binárním formátu. Živý detektor (střed sterea, harmonická energie, YIN pitch tracker s kontrolou oktávy) proti nim zachytí asi 70–80 % zpívaných snímků a zabere zhruba 0,05 ms na snímek.`},{en:`The Swarm's 262,144 particles and the Sky's 65,536-bird flock simulate on the GPU in float render-target ping-pong passes. The flight model steps at a fixed 240 Hz; a headless -VJFlightSim run proves the trajectory bit-identical at 30, 60, 144 and 240 fps, then checks the autopilot's comfort limits.`,cs:`Swarm (262 144 částic) a hejno scény Sky (65 536 ptáků) se simulují na GPU v ping-pong průchodech přes float render targety. Letový model běží s pevným krokem 240 Hz; headless běh -VJFlightSim ověří bitově shodnou trajektorii při 30, 60, 144 i 240 fps a pak zkontroluje limity komfortu autopilota.`},{en:`A UE Python build script generates every material from tagged //@ name HLSL sections and fails the build if a shader doesn't compile. The project holds about 56k lines of C++ (86 files) and 7.8k of HLSL (33 files).`,cs:`Build skript v Unreal Pythonu generuje všechny materiály z označených HLSL sekcí //@ name a build selže, když se některý shader nezkompiluje. Projekt má zhruba 56 tisíc řádků C++ (86 souborů) a 7,8 tisíce řádků HLSL (33 souborů).`},{en:`Command-line self-tests cycle every scene and pattern with scripted gamepad timelines and log fps, GPU ms and pass/fail. NVIDIA DLSS 4.5 (DLAA, Super Resolution) is reached through reflection, so the app builds without the plugin. After a GPU page-fault fix for live mode switches (r.NGX.FramesUntilFeatureDestruction 120), 73 switches ran clean.`,cs:`Self-testy z příkazové řádky projdou všechny scény a vzory se skriptovanými sekvencemi gamepadu a zapíšou fps, GPU ms a pass/fail. NVIDIA DLSS 4.5 (DLAA, Super Resolution) je napojené přes reflexi, takže se aplikace sestaví i bez pluginu. Po opravě pádu GPU (page fault) při živém přepínání režimů (r.NGX.FramesUntilFeatureDestruction 120) proběhlo 73 přepnutí bez chyby.`}],pitch:{gamedev:{en:`One UE5 C++/HLSL codebase: gamepad controls, autopilot cameras and a fixed-step flight simulation proven deterministic across frame rates.`,cs:`Jeden kód v UE5 (C++/HLSL): ovládání gamepadem, kamery s autopilotem a letová simulace s pevným krokem, ověřeně deterministická při různých fps.`},audioreactive:{en:`Beats, bars, drops and the singer's pitch steer cameras, lights and materials, live from a song file, mic or PC loopback.`,cs:`Beat, takty, dropy i výška zpěvu řídí kamery, světla a materiály, živě ze souboru, z mikrofonu nebo ze zvuku počítače.`},motion:{en:`I time the camera to the music: beat-locked speed, long uncut glides, a dive out of the clouds on a bar line. Clean reels render offline at 4× supersampling.`,cs:`Kameru časuji podle hudby: rychlost v tempu beatu, dlouhé záběry bez střihů, střemhlavý let z mraků přesně na začátku taktu. Čisté reely se renderují offline se 4× supersamplingem.`},aidev:{en:`Self-tests cycle every scene; 73 clean live mode switches confirmed a GPU crash fix in the 56k-line C++/HLSL app that AI coding agents wrote under my direction.`,cs:`Self-testy procházejí každou scénu; 73 živých přepnutí bez chyby potvrdilo opravu pádu GPU v aplikaci o 56 tisících řádcích C++ a HLSL, kterou pod mým vedením napsali AI agenti.`}},tools:[`unreal`,`cpp`,`hlsl`,`python`,`demucs`,`powershell`,`ffmpeg`],flow:[{from:`demucs`,to:`unreal`,label:{en:`vocal sidecars (.vjv, 100 fps)`,cs:`sidecary s vokály (.vjv, 100 fps)`}},{from:`hlsl`,to:`python`,label:{en:`tagged //@ shader sections`,cs:`označené sekce shaderů //@`}},{from:`python`,to:`unreal`,label:{en:`generated materials + parameter collection`,cs:`generované materiály + kolekce parametrů`}},{from:`cpp`,to:`hlsl`,label:{en:`beat, band and drop parameters`,cs:`parametry beatu, pásem a dropů`}},{from:`powershell`,to:`unreal`,label:{en:`scripted self-tests → report.json`,cs:`skriptované self-testy → report.json`}},{from:`unreal`,to:`ffmpeg`,label:{en:`offline-rendered frames → reels`,cs:`offline renderované snímky → reely`}}],media:{aspect:`9:16`,poster:`media/audiovj/poster.webp`,loop:`media/audiovj/loop.mp4`,full:`media/audiovj/full.mp4`,gallery:[{src:`media/audiovj/g1.webp`,aspect:`16:9`,caption:{en:`Swarm, Galaxy pattern: each GPU particle owns a frequency band, bass in the core, highs on the rim.`,cs:`Swarm, vzor Galaxy: každá částice na GPU patří jednomu frekvenčnímu pásmu, basy v jádru, výšky na okraji.`}},{src:`media/audiovj/g2.webp`,aspect:`16:9`,caption:{en:`Corridor: a beat-locked night drive under light arches whose strips form a spectrum analyzer, mirrored in the wet road.`,cs:`Corridor: noční jízda v tempu beatu pod světelnými oblouky; jejich pásy tvoří spektrální analyzátor a odrážejí se v mokré silnici.`}},{src:`media/audiovj/g3.webp`,aspect:`16:9`,caption:{en:`Sky: the 65k-bird murmuration arcs around the flight path above volumetric clouds lit by a low sun.`,cs:`Sky: hejno 65 tisíc ptáků se ovíjí kolem letové dráhy nad volumetrickými mraky ozářenými nízkým sluncem.`}},{src:`media/audiovj/g4.webp`,aspect:`16:9`,caption:{en:`Liquid, Ferrofluid: a hexagonal forest of spikes grows over a hidden magnet with the bass and kicks.`,cs:`Liquid, Ferrofluid: šestiúhelníkový les hrotů roste nad skrytým magnetem v rytmu basů a kopáku.`}}]},audio:`muted`,credits:[{en:`Swarm take recorded in-engine to 'RIP HALLOWEEN 2020' by Vladimir Cauchemar feat. Scrufizzer. Audio removed for licensing.`,cs:`Záběr scény Swarm nahraný v enginu na skladbu „RIP HALLOWEEN 2020“ (Vladimir Cauchemar feat. Scrufizzer). Zvuk byl z licenčních důvodů odstraněn.`},{en:`Relic scene inspired by 'Duality / Money In Red' by stuz0r.`,cs:`Scéna Relic je inspirovaná dílem „Duality / Money In Red“ (stuz0r).`},{en:`Plants, rocks and ground textures (Corridor, Relic): Fab / Quixel Megascans. Corridor traffic cars and Fish scene props: CC BY 4.0 Sketchfab models, modified (full attribution in the project README).`,cs:`Rostliny, kameny a textury povrchu (Corridor, Relic): Fab / Quixel Megascans. Auta v Corridoru a rekvizity ve scéně Fish: modely ze Sketchfabu (CC BY 4.0), upravené (úplné uvedení autorů v README projektu).`},{en:`Code written with AI coding agents under my direction; the concept, system design, art direction, testing and look review are mine. The Fish scene's character is a Tripo AI 3D model made from my own picture, rigged and animated for the project.`,cs:`Kód vzniká s AI agenty pro programování pod mým vedením; koncept, návrh systému, art direction, testování a kontrola vizuálu jsou moje. Postavička ve scéně Fish je 3D model z Tripo AI vytvořený z mého obrázku, s rigem a animací pro projekt.`}],tldr:{en:`Live visuals for music: six real-time scenes, played on a gamepad, follow a custom audio analyzer; self-tests check frame time.`,cs:`Živé vizuály k hudbě: šest scén v reálném čase řídí vlastní analyzátor zvuku, hraje se na ně gamepadem a self-testy hlídají čas na snímek (frame time).`},role:{en:`Solo project. Concept, system design, art direction and testing; code written with AI coding agents under my direction.`,cs:`Samostatný projekt. Koncept, návrh systému, art direction a testování; kód vzniká s AI agenty pro programování pod mým vedením.`},code:[{title:{en:`Drop detection: build primes, bass fires`,cs:`Detekce dropu: připraví ji build-up, spustí ji basy`},lang:`cpp`,file:`Source/AudioVJ/VJAudioAnalyzer.cpp`,snippet:`	Follow(S.BassFast, BassPow, 0.03f);
	Follow(S.LevelFast, LevelPow, 0.03f);
	const float BassFastDb = PowDb(S.BassFast);
	if (!bQuiet && BassThin > 0.5f)
	{
		S.LowBeats += Beats;
	}
	else if (BassThin < 0.2f)
	{
		S.LowBeats = 0.f;
	}
	if (S.LowBeats >= 4.f || S.Build >= 0.3f)
	{
		S.PrimeTime = 4.f;
		S.PrimeStrength = FMath::Max(S.PrimeStrength, FMath::Max(S.Build, FMath::Clamp(S.LowBeats / 32.f, 0.f, 1.f)));
	}
	else
	{
		S.PrimeTime -= Dt;
		if (S.PrimeTime <= 0.f)
		{
			S.PrimeStrength = 0.f;
		}
	}
	S.BeatsSinceDrop += Beats;
	if (S.PrimeTime > 0.f && S.BeatsSinceDrop > 16.f && S.ActiveTime > 4.f)
	{
		const float Jump = BassFastDb - PowDb(S.BassRef);
		const bool bBassBack = Jump > 8.f && BassFastDb - PowDb(S.BassMid) > 5.f && BassFastDb > S.BassTopDb - 6.f;
		const bool bLouder = PowDb(S.LevelFast) > PowDb(S.LevelRef) + 1.f;
		if (bBassBack && bLouder)
		{
			S.bDrop = true;
			S.DropStrength = FMath::Clamp(0.5f * S.PrimeStrength + 0.5f * FMath::Clamp((Jump - 6.f) / 12.f, 0.f, 1.f), 0.f, 1.f);
			S.BeatsSinceDrop = 0.f;
			S.PrimeTime = S.PrimeStrength = S.LowBeats = 0.f;
		}
	}
	// the references follow after the test, so they hold the level from before the hit
	Follow(S.BassMid, BassPow, 0.25f);
	Follow(S.BassRef, BassPow, 1.5f);
	Follow(S.LevelRef, LevelPow, 1.5f);`,note:{en:`Priming needs a build-up or at least four bass-less beats and lasts 4 s; drops are more than 16 beats apart. The bass (30 ms time constant) must jump over 8 dB above its 1.5 s reference as the overall level rises. References update after the test, keeping the pre-hit level.`,cs:`Připravenost dá build-up nebo aspoň čtyři doby bez basů a vydrží 4 s; mezi dropy je víc než 16 dob. Basy (časová konstanta 30 ms) musí vyskočit o víc než 8 dB nad referenci 1,5 s a celková hlasitost přitom stoupat. Reference se aktualizují až po testu, takže drží úroveň před úderem.`}},{title:{en:`Swarm GPU pass: bass, kicks, snares as forces`,cs:`Průchod Swarmu na GPU: basy, kopák, virbl jako síly`},lang:`hlsl`,file:`Shaders/swarm.hlsl`,snippet:`// bloom: a breathing sphere shell; each particle leans toward a direction of its own, so the shell stays covered
// instead of collapsing into one ribbon
{
	float R0 = (4.5 + 1.5 * Bass + 1.5 * Kick + id * 1.2) * Form;
	float3 home = normalize(vj.Hash32(UV * 1337.0) * 2.0 - 1.0 + 1e-4);
	F += (-n * (r - R0) * 3.0 + cross(n, float3(0, 0, 1)) * 2.0 * Spin + (home - n * dot(home, n)) * 1.5) * w1;
}
// flow: long ribbons, loosely held near the centre
{
	F += (abc * 3.0 - p * (0.12 / Form)) * w2;
}
// helix: two strands climbing the vertical axis (wrapped in the position pass)
{
	float strand = step(0.5, id) * 3.14159;
	float ang = p.z * 0.55 - t * 1.4 + strand;
	float R0 = (3.5 + 2.5 * Bass) * Form;
	float3 target = float3(cos(ang) * R0, sin(ang) * R0, p.z);
	float3 hx = (target - p) * 4.0;
	hx.z += (3.0 + 4.0 * Energy) * Spin;
	F += hx * w3;
}

// kick rings: as a front passes, it shoves the particles outward (the same push at every radius, so they don't
// overtake each other and bunch up)
float d = w0 * rd + w1 * 8.0 * asin(saturate(abs(n.z))) + w2 * r + w3 * abs(p.z);
float3 o = nd * (w0 + w3) + n * (w1 + w2);
float3 x = (d - RingRad.xyz) / 1.6;
v += o * dot(exp(-x * x), RingPush.xyz) * 8.0 * Dt;

v += n * Impulse * (0.6 + 0.8 * id);         // kicks, drops, hits: a radial burst
// snares: a swirl around the vertical axis; the bloom and the flow twist, their halves turning opposite ways
v += tang * Swirl * (0.6 + 0.8 * id) * (w0 + w3 + (w1 + w2) * clamp(p.z * 0.5, -1.0, 1.0));
v += F * Dt;
v *= exp(-Dt * (1.4 - 0.6 * Drive));
float sp = length(v);
if (sp > 45.0) v *= 45.0 / sp;
if (any(isnan(v))) v = float3(0, 0, 0);
return v;`,note:{en:`Per particle, the swarm_vel custom node blends the Galaxy, Bloom, Flow and Helix patterns with weights w0–w3 set from Mode. Bass and kicks size the Bloom shell, kick rings push equally at every radius so particles don't overtake and bunch up, and snares swirl them around the vertical axis.`,cs:`Custom node swarm_vel pro každou částici prolíná vzory Galaxy, Bloom, Flow a Helix podle vah w0–w3 z parametru Mode. Basy a kopák určují velikost slupky Bloom, prstence od kopáku tlačí na všech poloměrech stejně, aby se částice nepředbíhaly a neshlukovaly, a virbl je roztáčí kolem svislé osy.`}}],links:[{label:`CC BY 4.0 licence`,href:`https://creativecommons.org/licenses/by/4.0/`},{label:`Polestar 1 · Martin Trafas`,href:`https://sketchfab.com/3d-models/free-polestar-1-4a368c71047c4eb0829525d933752828`},{label:`Toyota Corolla E180 · Armored Wave`,href:`https://sketchfab.com/3d-models/2014-toyota-corolla-e180-eu-with-interior-36f95efb0585464cae43a25a3b3392e8`},{label:`Fiat Punto GT · Lionsharp Studios`,href:`https://sketchfab.com/3d-models/free-1995-fiat-punto-gt-48db6facb4b64e99b60f36b8c01185e1`},{label:`Kiri '86 · Daniel Zhabotinsky`,href:`https://sketchfab.com/3d-models/kiri-86-low-poly-model-5c17c582ef9549798f694b660feea42a`},{label:`Kiri '10 · Daniel Zhabotinsky`,href:`https://sketchfab.com/3d-models/kiri-10-low-poly-model-7fd6e15785fa4aa9bfd6e31eb7c97ba6`},{label:`Urban '10 · Daniel Zhabotinsky`,href:`https://sketchfab.com/3d-models/urban-10-low-poly-model-2866efdfa943484391ef8313768e074d`},{label:`LCT 3000 '95 · Daniel Zhabotinsky`,href:`https://sketchfab.com/3d-models/lct-3000-95-low-poly-model-663a0953c038434a918cb85725c88ffa`}]};export{e as default};