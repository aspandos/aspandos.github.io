var e={id:`banana-heaven`,title:`Banana Party in Heaven`,year:`2026`,order:0,status:`finished`,client:null,roles:{gamedev:9,frontend:1,motion:7,audioreactive:8,aidev:5},kicker:{en:`Real-time crowd · Unreal Engine 5`,cs:`Dav v reálném čase · Unreal Engine 5`},headline:{en:`Sixty beat-locked bananas, a self-directing camera`,cs:`Šedesát banánů tančí do beatu, kamera se režíruje sama`},summary:{en:`Banana Party in Heaven is a comedy music-video mode of AudioVJ's Sky scene. The cartoon bananas party on raymarched clouds, and every bounce lands on the beat at any tempo. The crowd follows the song's structure (a cheering wave on drops, crouch-and-shake through build-ups, phone lights in breakdowns) while an automatic crowd cam cuts on the beat, strobes, ramps into slow motion and dolly-zooms like phone footage from inside a rave.`,cs:`Banana Party in Heaven je komediální klipový režim scény Sky z AudioVJ. Kreslené banány paří na raymarchovaných oblacích a každé pohupnutí padne do rytmu v jakémkoli tempu. Dav reaguje na stavbu skladby (při dropu vlna jásotu, v build-upu přikrčení a třes, v breakdownu rozsvícené mobily) a automatická crowd cam střihá do beatu, bliká stroboskopem, zpomaluje a dělá dolly zoom jako video z mobilu uprostřed tančícího davu.`},highlights:[{en:`The crowd stays in sync without moving in unison: each banana draws its own 3–4 of the 11 dances, and each dance loops a whole number of beats, timed every frame from the integrated beat phase.`,cs:`Dav drží rytmus, a přesto se nehýbe unisono: každý banán si vylosuje vlastní 3–4 z 11 tanců a každý tanec je smyčka o celém počtu dob, časovaná v každém snímku z integrované fáze beatu.`},{en:`Shy and wild dancers come from the same clips with no extra assets. A blueprint-free C++ UAnimInstance proxy samples a dance and one of 12 one-shot clips (cheers, slips, faints, conga line, mosh pit, crowd surfing), blends them on the animation worker thread, mirrors left-right from bone names at runtime and scales each dancer's amplitude.`,cs:`Stydliví i divocí tanečníci vznikají ze stejných klipů bez assetů navíc. Proxy UAnimInstance v C++ bez blueprintů vzorkuje tanec a jeden z 12 jednorázových klipů (jásot, uklouznutí, mdloba, conga, mosh pit, crowd surfing), prolíná je na animačním worker vlákně, za běhu prohazuje levou a pravou stranu podle názvů kostí a škáluje amplitudu každého tanečníka.`},{en:`The crowd cam cuts between 7 shot types, each with its own FOV and f-stop. Strobe cuts (22–55 ms) hit at most one cut in three. About every other drop gets 0.3× slow motion, its catch-up armed one frame ahead to hide the pose jump; build-ups get a 46°→16° dolly zoom.`,cs:`Crowd cam střídá 7 typů záběrů, každý s vlastním FOV a clonovým číslem. Stroboskopický (22–55 ms) je nanejvýš každý třetí střih. Zhruba každý druhý drop se zpomalí na 0,3× a dohnání dob se připraví o snímek dřív, aby skok v pózách nebyl vidět; build-up dostane dolly zoom ze 46° na 16°.`},{en:`The faces are original procedural HLSL, with 25 expression presets driven by 24 animated channels. A numpy twin parses the shader's 214 '@const' values to render approval sheets and run 10 automated originality checks, so one tuned constant updates the engine and the sheets alike.`,cs:`Originální procedurální obličeje v HLSL mají 25 přednastavených výrazů řízených 24 animovanými kanály. Replika v numpy načítá 214 konstant z bloku „@const“ v shaderu, kreslí z nich schvalovací archy a spouští 10 automatických kontrol originality, takže jedna doladěná konstanta změní engine i archy zároveň.`},{en:`Hats, glasses, chains, bow ties, mustaches and sneakers are dealt so all 60 outfits differ; face and neck pieces stay glued in big bends by replaying the skin's three-bone linear blend skinning every frame. The reel records offline (fixed step, 200% screen percentage) as the analyzer hears the real song: 1,200 of 1,200 frames.`,cs:`Klobouky, brýle, řetězy, motýlky, kníry a tenisky se rozdělí tak, že se žádný z 60 outfitů neopakuje; kusy na obličeji a krku drží i při velkých ohybech, protože se v každém snímku přepočítají stejným linear blend skinningem tří kostí jako kůže. Reel se nahrává offline (pevný krok, screen percentage 200 %), zatímco analyzér poslouchá skutečnou skladbu: 1 200 z 1 200 snímků.`}],pitch:{gamedev:{en:`A blueprint-free C++ AnimInstance blends 60 dancers on the worker thread; a director picks subjects, frames and cuts on its own.`,cs:`UAnimInstance v C++ bez blueprintů prolíná na worker vlákně pózy 60 tanečníků; režisér automaticky volí subjekt, výřez i střih.`},motion:{en:`I define the camera's shot grammar and editing rules, so it films a watchable music video without a single hand-placed shot.`,cs:`Kameře určuji filmovou gramatiku záběrů a pravidla střihu, takže natočí klip, na který se dá dívat, bez jediného ručně nastaveného záběru.`},audioreactive:{en:`The beat phase sets every dancer's animation clock; drops, build-ups and breakdowns trigger crowd behaviour, facial reactions and camera moves across 60 characters at any tempo.`,cs:`Fáze beatu nastavuje animační hodiny každého tanečníka; dropy, build-upy a breakdowny spouštějí chování davu, reakce obličejů i pohyby kamery u 60 postav v jakémkoli tempu.`},aidev:{en:`10 originality checks run on a numpy twin of the face shader that AI coding agents wrote under my direction; none of the 1,200 recorded frames was dropped or duplicated.`,cs:`10 kontrol originality běží na numpy replice shaderu obličejů, který pod mým vedením napsali AI agenti; z 1 200 nahraných snímků žádný nevypadl ani se nezdvojil.`}},tools:[`unreal`,`cpp`,`hlsl`,`python`,`blender`,`rigify`,`tripo`,`kimodo`,`ffmpeg`,`powershell`],flow:[{from:`tripo`,to:`blender`,label:{en:`AI base mesh + accessories`,cs:`AI základní mesh + doplňky`}},{from:`kimodo`,to:`blender`,label:{en:`text-to-motion dances`,cs:`tance z text-to-motion`}},{from:`blender`,to:`unreal`,label:{en:`Rigify rig + whole-beat loops`,cs:`Rigify rig + smyčky na celé doby`}},{from:`hlsl`,to:`unreal`,label:{en:`procedural faces + raymarched clouds`,cs:`procedurální obličeje + raymarchované mraky`}},{from:`hlsl`,to:`python`,label:{en:`@const block → approval sheets`,cs:`blok @const → schvalovací archy`}},{from:`unreal`,to:`ffmpeg`,label:{en:`fixed-step 1080×1920 frames`,cs:`snímky 1080×1920 s pevným krokem`}}],media:{aspect:`9:16`,poster:`media/banana-heaven/poster.webp`,loop:`media/banana-heaven/loop.mp4`,full:`media/banana-heaven/full.mp4`,gallery:[{src:`media/banana-heaven/g1.webp`,aspect:`4:5`,caption:{en:`Contact sheet of the 40 s reel, a frame every 0.5 s; orange marks cuts, red the drop. All auto-directed: face close-ups, low hero angles, wide floor shots.`,cs:`Kontaktní arch 40sekundového reelu, snímek každých 0,5 s; oranžově střihy, červeně drop. Vše vybral automatický režisér: detaily obličejů, podhledy i celky parketu.`}},{src:`media/banana-heaven/g2.webp`,aspect:`16:9`,caption:{en:`Face presets rendered by the numpy twin: 18 expressions plus blink and arc grin, close up and at 150, 120 and 85 px banana heights, a crowd-distance legibility check.`,cs:`Presety obličejů vykreslené numpy replikou: 18 výrazů plus mrknutí a obloukový úsměv, zblízka a při výšce banánu 150, 120 a 85 px, ke kontrole čitelnosti na vzdálenost davu.`}},{src:`media/banana-heaven/g3.webp`,aspect:`16:9`,caption:{en:`The drop gag: cool behind sunglasses, shock on the drop, glasses flying off to reveal shocked eyes, then a grin half a second later.`,cs:`Gag s brýlemi při dropu: v klidu za slunečními brýlemi, šok při dropu, brýle odletí a odhalí vyděšené oči, o půl sekundy později úsměv.`}},{src:`media/banana-heaven/g4.webp`,aspect:`4:5`,caption:{en:`30 crowd face styles dealt from one shader: eye shape, scale, spacing, brow style, mouth width, blush and freckles vary from banana to banana.`,cs:`30 stylů obličejů davu z jednoho shaderu: tvar, velikost a rozestup očí, typ obočí, šířka úst, ruměnec i pihy se liší banán od banánu.`}}]},audio:`muted`,credits:[{en:`Set to 'RIP HALLOWEEN 2020' by Vladimir Cauchemar feat. Scrufizzer. Audio removed for licensing.`,cs:`Na skladbu „RIP HALLOWEEN 2020“ (Vladimir Cauchemar feat. Scrufizzer). Zvuk byl z licenčních důvodů odstraněn.`},{en:`AI-assisted assets: Tripo generated the banana base mesh and wardrobe accessories, Kimodo text-to-motion the dances and reaction clips; rigging (Rigify) and accessory fitting were done in Blender. The face design, crowd behaviour and camera direction are original; the C++/HLSL code was written for the project with AI coding agents under my direction.`,cs:`Assety vytvořené s pomocí AI: základní mesh banánu a doplňky šatníku vygeneroval Tripo, tance a reakční klipy Kimodo (text-to-motion); rigging (Rigify) a usazení doplňků proběhly v Blenderu. Design obličejů, chování davu a režie kamery jsou původní; kód v C++ a HLSL vznikl pro projekt s AI agenty pro programování pod mým vedením.`}],tldr:{en:`A real-time music-video mode: cartoon bananas dance on the beat while the camera picks its own shots, finished as a 40-second vertical reel.`,cs:`Klipový režim v reálném čase: kreslené banány tančí do beatu a kamera si záběry vybírá automaticky. Výsledkem je 40sekundový vertikální reel.`},role:{en:`Solo project. Concept, creative brief, art direction (faces, wardrobe, crowd, camera) and approval-sheet review. AI coding agents wrote the code and design specs; Tripo and Kimodo generated mesh and motion.`,cs:`Samostatný projekt. Koncept, kreativní zadání, art direction (obličeje, šatník, dav, kamera) a kontrola schvalovacích archů. Kód a návrhové specifikace napsali AI agenti pro programování, mesh a pohyby vygenerovaly Tripo a Kimodo.`},code:[{title:{en:`The lead banana's beat clock`,cs:`Beatové hodiny hlavního banánu`},lang:`cpp`,file:`Source/AudioVJ/VJSkyBanana.cpp`,snippet:`	// ---- the beat clock: follow its phase (wrapping), halved / doubled into a danceable range
	const float Phase = FMath::Frac(A.BeatPhase);
	double Step = 0.0;
	if (A.BPM > 40.f && BananaPrevPhase >= 0.f)
	{
		float D = Phase - BananaPrevPhase;
		D += D < -0.5f ? 1.f : 0.f;
		// one dance beat per music beat while that is 0.8..1.6x the dance's own tempo (a cartoon may hurry);
		// otherwise half / double time, whichever lands nearer to it
		const int32 Cur = BananaPlaying >= 0 ? BananaPlaying : 0;
		const double Native = 60.0 * BananaBeats[Cur] / FMath::Max(double(BananaDances[Cur]->GetPlayLength()), 0.1);
		double Fold = 1.0;
		const double R = A.BPM / Native;
		if (R < 0.8 || R > 1.6)
		{
			Fold = FMath::Abs(FMath::Loge(R * 0.5)) < FMath::Abs(FMath::Loge(R * 2.0)) ? 0.5 : 2.0;
		}
		Step = (FMath::Clamp(double(D), 0.0, 0.5) * CrowdTimeScale + CrowdBeatCatchUp) * Fold;   // (slowed, and caught up after)
	}
	else
	{
		// no tempo yet (silence, a live input still listening): its own pace
		const int32 Cur = BananaPlaying >= 0 ? BananaPlaying : 0;
		Step = Dt * BananaBeats[Cur] / FMath::Max(double(BananaDances[Cur]->GetPlayLength()), 0.1);
	}
	if (BananaPrevPhase < 0.f && A.BPM > 40.f)
	{
		BananaBeat = Phase;       // start on the music's beat
	}
	BananaPrevPhase = Phase;
	const double Before = BananaBeat;
	BananaBeat += Step;`,note:{en:`The dance never runs at a playback rate: each frame its clock advances by the wrapped change in beat phase, folded to half or double time when the song is outside 0.8–1.6× the dance's own tempo. CrowdTimeScale and CrowdBeatCatchUp are the camera's slow motion and its catch-up under the next cut.`,cs:`Tanec se nikdy nepřehrává nastavenou rychlostí: jeho hodiny se v každém snímku posunou o přírůstek fáze beatu (i přes přelom dob), a když je skladba mimo 0,8–1,6× vlastního tempa tance, přejdou na poloviční či dvojnásobné tempo. CrowdTimeScale a CrowdBeatCatchUp jsou zpomalení od kamery a dohnání dob pod dalším střihem.`}},{title:{en:`Crowd cam: who gets the next shot`,cs:`Crowd cam: kdo dostane další záběr`},lang:`cpp`,file:`Source/AudioVJ/VJSkyCrowdCam.cpp`,snippet:`	for (int32 i = 0; i < Crowd.Num(); ++i)
	{
		const FCrowdBanana& B = Crowd[i];
		if (!B.Mesh)
		{
			continue;
		}
		const float Waited = float(FMath::Clamp((Clock - CamLastShown[i]) / 25.0, 0.0, 2.0));
		float Score = 1.f + 3.f * Waited;
		int32 Type = RandomType();
		switch (B.Act)
		{
		case ASlip: case AFaint: Score += 7.f; Type = TBody; break;
		case ALaunch: Score += 7.f; Type = THero; break;
		case ASurfer: Score += 5.f; Type = TBody; break;
		case ADuelist: Score += 6.f; Type = CamRand.FRand() < 0.5f ? TWaist : THero; break;
		case AConga: Score += B.Off.X < 0.5f ? 3.f : 0.5f; break;
		case AMosh: Score += 1.5f; break;
		default: break;
		}
		for (const FWearItem& It : B.Dress.Items)
		{
			if (It.Toss == 1 || It.Toss == 2)
			{
				Score += 8.f;                // sunglasses about to fly / flying
				Type = TWaist;
			}
		}
		if (B.Clip >= 0 && B.ClipW > 0.3f)
		{
			Score += 1.5f;
		}
		if (B.Face.IsReacting())
		{
			Score += 1.f;
		}
		if (B.Root != 0)
		{
			Score -= 2.5f;                   // the satellites are far: rarely
		}
		Consider(KBanana, i, Score, Type);
	}`,note:{en:`Each banana's score for the next shot grows with its time off screen; gags, crowd stunts, a dance-off duel or sunglasses about to fly add points and mostly pick the shot type, while far satellite-cloud bananas lose points. Consider() keeps the best, with random jitter and a repeat-subject penalty.`,cs:`Skóre banánu pro další záběr roste s dobou mimo obraz; gagy, akce davu, souboj v dance-offu nebo sluneční brýle těsně před odletem přidávají body a většinou určí i typ záběru, banány na vzdálených satelitních mracích body ztrácejí. Consider() ponechá nejlepšího kandidáta s trochou náhody a penalizací za opakovaný subjekt.`}}],links:[]};export{e as default};