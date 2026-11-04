var e={id:`triad`,title:`Triad`,year:`2026`,order:0,status:`in-progress`,client:null,roles:{gamedev:7,frontend:2,motion:7,audioreactive:10,aidev:7},kicker:{en:`Audio-reactive · TouchDesigner · Unreal`,cs:`Audioreaktivní · TouchDesigner · Unreal`},headline:{en:`Audio-reactive lotus`,cs:`Audioreaktivní lotos`},summary:{en:`In Triad's lotus shot, Endless Blossom, a petal grows on every beat. Unreal plays Sand Reformation's 250,126 Vellum grains back as GPU instances.`,cs:`V lotosovém záběru Triadu, Endless Blossom, vyroste s každým beatem lístek. V Sand Reformation přehrává Unreal 250 126 zrn z Vellum jako GPU instance.`},highlights:[{en:`One causal numpy analyzer (470 lines) runs live in a TouchDesigner Script CHOP and offline at 48× real time, with SuperFlux onsets, comb-filtered tempo, a phase-locked beat grid and drop detection. The Anthropology take: 14,512 frames at 60 fps, 100.13 BPM, 4 drops.`,cs:`Jeden kauzální analyzátor v numpy (470 řádků) běží živě ve Script CHOPu v TouchDesigneru i offline, 48× rychleji než v reálném čase: nástupy metodou SuperFlux, tempo s hřebenovým filtrem, fázově zamčená rytmická mřížka a detekce dropů. Záznam Anthropology: 14 512 snímků při 60 fps, 100,13 BPM, 4 dropy.`},{en:`TriadLink, a ~2,000-line Unreal Engine 5.8 C++ plugin, runs a UDP receiver on its own thread with a hand-written OSC 1.0 decoder, feeding a Material Parameter Collection and a 32×1 float spectrum texture. Tested at 60 packets/s with 0 bad packets.`,cs:`TriadLink, C++ plugin pro Unreal Engine 5.8 o zhruba 2 000 řádcích, má UDP přijímač ve vlastním vlákně s ručně psaným dekodérem OSC 1.0 a plní Material Parameter Collection a float texturu spektra 32×1. Otestováno při 60 paketech/s bez vadného paketu.`},{en:`Endless Blossom: VEX builds each petal from its 'open' value, births land on the beat at the golden angle (137.5°), released petals fall as Vellum cloth, and the drop at frame 517 sheds 27 at once. A 901-line Unreal C++ studio actor captures it at a fixed step, frame-exact.`,cs:`Endless Blossom: VEX staví každý lístek z jeho hodnoty „open“, nové lístky se rodí na beat pod zlatým úhlem (137,5°), uvolněné padají jako Vellum cloth a drop na snímku 517 jich shodí naráz 27. Vlastní C++ studio actor v Unrealu (901 řádků) květ zachytává s pevným krokem, snímkově přesně.`},{en:`Sand Reformation: the take choreographs 250,126 Vellum grains (kick-gated pours, a drop curtain, 0.3 g for ~1.8× physically consistent slow motion). Unreal streams a custom TPC1 binary cache (float16 positions, 900 frames, 1.64 GB) into one Instanced Static Mesh via a per-frame float texture and HLSL vertex fetch.`,cs:`Sand Reformation: záznam analýzy choreografuje 250 126 zrn ve Vellum (proudy otevírané kopákem, opona písku při dropu, 0,3 g pro fyzikálně věrné zhruba 1,8× zpomalení). Unreal streamuje vlastní binární cache TPC1 (pozice ve float16, 900 snímků, 1,64 GB) do jediného Instanced Static Mesh přes float texturu pro každý snímek a HLSL vertex fetch.`},{en:`The TouchDesigner conductor builds itself from Python (69 operators in 163 ms, zero errors or warnings) and publishes a GLSL motion layer over NDI. Its self-test held 60.1 fps sending 39,000 OSC messages over 65 addresses in 10 s.`,cs:`Řídicí síť (conductor) v TouchDesigneru se sestaví sama z Pythonu (69 operátorů za 163 ms, bez chyb a varování) a GLSL motion vrstvu publikuje přes NDI. V self-testu držela 60,1 fps a za 10 s odeslala 39 000 OSC zpráv na 65 adres.`}],pitch:{gamedev:{en:`An Unreal C++ plugin with threaded UDP I/O, loss-tolerant triggers and Blueprint-exposed APIs.`,cs:`C++ plugin pro Unreal s UDP ve vlastním vlákně, triggery odolnými vůči ztrátě paketů a API pro Blueprinty.`},motion:{en:`One beat-locked 1080p shot, built procedurally in VEX, ships as an offline Karma render or real-time Unreal piece.`,cs:`Jeden záběr v 1080p přesně na beat, procedurálně postavený ve VEXu, lze dodat offline z Karmy nebo v reálném čase z Unrealu.`},audioreactive:{en:`Kicks, beats and drops from one analysis drive TouchDesigner, Houdini and Unreal under the same channel names.`,cs:`Kopáky, beaty a dropy z jedné analýzy řídí TouchDesigner, Houdini i Unreal pod stejnými názvy kanálů.`},aidev:{en:`Agent-written code passed its checks: zero TouchDesigner build errors, 60.1 fps in self-test, 0 bad UDP packets.`,cs:`Kód napsaný AI agentem prošel kontrolami: sestavení v TouchDesigneru bez chyb, 60,1 fps v self-testu a 0 vadných UDP paketů.`}},tools:[`touchdesigner`,`houdini`,`unreal`,`cpp`,`python`,`osc`,`karma`,`vex`,`hlsl`,`glsl`,`ndi`,`demucs`,`ffmpeg`,`powershell`],flow:[{from:`python`,to:`touchdesigner`,label:{en:`live analyzer (Script CHOP)`,cs:`živý analyzátor (Script CHOP)`}},{from:`touchdesigner`,to:`unreal`,label:{en:`OSC every frame: 65 channels incl. spectrum`,cs:`OSC každý snímek: 65 kanálů vč. spektra`}},{from:`python`,to:`houdini`,label:{en:`frame-exact take (.clip)`,cs:`záznam přesný na snímek (.clip)`}},{from:`houdini`,to:`karma`,label:{en:`USD stage, Karma XPU render`,cs:`USD scéna, render v Karma XPU`}},{from:`houdini`,to:`unreal`,label:{en:`Alembic petals, TPC1 grains`,cs:`Alembic lístků + TPC1 cache zrn`}},{from:`demucs`,to:`python`,label:{en:`vocal stem → voice channels`,cs:`vokální stopa → hlasové kanály`}}],media:{aspect:`16:9`,poster:`media/triad/poster.webp`,loop:`media/triad/loop.mp4`,full:`media/triad/full.mp4`,gallery:[{src:`media/triad/g2.webp`,aspect:`16:9`,caption:{en:`One flower, one Alembic frame: Karma XPU left, Unreal 5.8 right.`,cs:`Jedna květina, jeden snímek Alembicu: vlevo Karma XPU, vpravo Unreal 5.8.`}},{src:`media/triad/g1.webp`,aspect:`16:9`,caption:{en:`Translucent petals around a heart light that brightens on every kick (Unreal).`,cs:`Průsvitné lístky kolem světla v srdci květu, které se rozzáří s každým kopákem (Unreal).`}},{src:`media/triad/g3.webp`,aspect:`16:9`,caption:{en:`Drop curtain and kick-gated sand stream: Karma XPU (left, watermarked), Unreal (right).`,cs:`Opona při dropu a proud písku otevíraný kopákem: Karma XPU (vlevo, s vodoznakem), Unreal (vpravo).`}},{src:`media/triad/g4.webp`,aspect:`16:9`,caption:{en:`TouchDesigner conductor panel: tempo lock, beat clock, 8 bands and 32-bin spectrum.`,cs:`Panel řídicí sítě v TouchDesigneru: zamčené tempo, počítadlo dob, 8 pásem a 32pásmové spektrum.`}}]},audio:`muted`,credits:[{en:`Renders set to 'Anthropology' by Vladimir Cauchemar. Audio removed for licensing.`,cs:`Rendery na skladbu „Anthropology“ (Vladimir Cauchemar). Zvuk byl z licenčních důvodů odstraněn.`},{en:`Endless Blossom inspired by Entagma's 'Endless Blossom' (H20.5 Remake) tutorial; Sand Reformation inspired by andrewzhandarov's 'Reformation'.`,cs:`Endless Blossom je inspirován tutoriálem „Endless Blossom“ (H20.5 Remake) od Entagma, Sand Reformation prací „Reformation“ od andrewzhandarova.`},{en:`Sand simulation and its Karma render made with Houdini Apprentice (non-commercial licence, watermark visible); Endless Blossom scenes with Houdini Indie.`,cs:`Simulace písku a její render v Karmě vznikly v Houdini Apprentice (nekomerční licence, viditelný vodoznak); scény Endless Blossom v Houdini Indie.`},{en:`Vocal stems separated with the open-source Demucs (htdemucs) model.`,cs:`Vokální stopy byly odděleny open-source modelem Demucs (htdemucs).`},{en:`Design, art direction and development lead are mine; code implemented with an AI coding agent (Claude Code).`,cs:`Návrh, art direction a vedení vývoje jsou moje; kód vznikl s AI agentem (Claude Code).`}],tldr:{en:`One Python music analyzer drives TouchDesigner live, plus frame-exact Houdini simulations and Unreal renders offline. Result: two 30-second shots.`,cs:`Jeden analyzátor hudby v Pythonu řídí živě TouchDesigner a offline snímkově přesné simulace v Houdini a rendery v Unrealu. Výsledek: dva 30sekundové záběry.`},role:{en:`Solo project. Pipeline concept and architecture, art and technical direction; code written with Claude Code under my direction.`,cs:`Samostatný projekt. Koncept a architektura pipeline, art direction a technické vedení; kód vznikl v Claude Code pod mým vedením.`},code:[{title:{en:`Per-hop analysis: FFT, bands, SuperFlux onsets`,cs:`Analýza v každém kroku: FFT, pásma, nástupy SuperFlux`},lang:`python`,file:`td/scripts/triad_audio.py`,snippet:`	def _hop(self, chunk):
		dt = self.dt
		self.time += dt
		ring = self.ring
		ring[:-self.hop] = ring[self.hop:]
		ring[-self.hop:] = chunk
		mag = np.abs(np.fft.rfft(ring * self.win)) * self.mag_norm
		power = mag * mag

		# loudness
		ms = float(np.mean(chunk * chunk))
		self.db = db = 10.0 * math.log10(ms + 1e-12)
		gate = db > -62.0
		level = float(self.level_s(float(self.level_range(db))))

		# bands
		e = np.array([power[m].sum() for m in self.band_masks]) + 1e-12
		bands = self.band_s(self.band_range(10.0 * np.log10(e)) ** 1.3)

		# log-filterbank spectrum, SuperFlux difference against the max-filtered older spectrum
		fbm = self.fb @ mag
		S = np.log10(1.0 + 1000.0 * fbm).astype(np.float32)
		prev = self.S_hist[(self.si + 1) % len(self.S_hist)]         # lag hops back
		pm = prev.copy()
		pm[1:] = np.maximum(pm[1:], prev[:-1])
		pm[:-1] = np.maximum(pm[:-1], prev[1:])
		diff = np.maximum(S - pm, 0.0)
		self.si = (self.si + 1) % len(self.S_hist)
		self.S_hist[self.si] = S
		for d in self.det:
			d.step(float(diff @ d.w), dt, self.sensitivity, gate)`,note:{en:`_hop() runs a 2048-point FFT every 512 samples; SuperFlux counts the rise over the spectrum two hops back, and a −62 dB gate ignores silence.`,cs:`_hop() spustí každých 512 vzorků 2048bodovou FFT; SuperFlux počítá nárůst oproti o dva kroky staršímu spektru a práh −62 dB ignoruje ticho.`}},{title:{en:`Unreal C++ triggers that survive dropped packets`,cs:`Unreal C++: triggery odolné vůči ztrátě paketů`},lang:`cpp`,file:`ue/TriadUE/Plugins/TriadLink/Source/TriadLink/Private/TriadLinkSubsystem.cpp`,snippet:`void UTriadLinkSubsystem::CheckCounters()
{
	TArray<TPair<FName, float>, TInlineAllocator<8>> Fired;
	for (const TPair<FName, TArray<float>>& KV : Channels)
	{
		if (KV.Value.Num() == 0)
		{
			continue;
		}
		const FString S = KV.Key.ToString();
		if (!S.EndsWith(TEXT("_n")))
		{
			continue;
		}
		const int32 C = FMath::RoundToInt(KV.Value[0]);
		int32& Prev = Counters.FindOrAdd(KV.Key, C);
		if (C > Prev)
		{
			const FName Base(*S.LeftChop(2));
			Fired.Add({Base, GetValue(Base, 1.f)});
		}
		Prev = C;
	}
	// after the loop: a listener may read (or even change) the channels
	for (const TPair<FName, float>& F : Fired)
	{
		OnTrigger.Broadcast(F.Key, F.Value);
	}
}`,note:{en:`Hits arrive as running counters (kick_n, snare_n...), not one-frame pulses, so the packet after a lost one still shows the rise and OnTrigger fires.`,cs:`Údery přicházejí jako průběžné čítače (kick_n, snare_n…), ne jako jednosnímkové pulzy, takže paket po ztraceném stejně ukáže nárůst a OnTrigger se spustí.`}}],links:[]};export{e as default};