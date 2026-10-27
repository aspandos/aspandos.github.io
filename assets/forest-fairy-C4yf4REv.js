var e={id:`forest-fairy`,title:`Forest Fairy`,year:`2026`,order:0,status:`finished`,client:null,roles:{gamedev:8,frontend:1,motion:4,audioreactive:0},kicker:{en:`Game character · Blender + Rigify`,cs:`Herní postava · Blender + Rigify`},headline:{en:`From raw AI mesh to rigged, game-ready character`,cs:`Od surového AI modelu k rigované herní postavě`},summary:{en:`A Tripo 'Generate in Parts' fairy (14 AI parts) rebuilt into a production character: 13 named parts with clean quad retopology (~597k quads), a fresh bake into five texture sets (up to 8K) and a Rigify rig with fingers and flapping wings. Apart from one deliberate manual click in Quad Remesher, every step runs as a headless script (part split, watertight shells, closest-point bake, measurement-driven rig fit, LOD export, QA renders), so the pipeline can rerun on the next AI mesh. The result is a 1.19M-triangle hero and a 90k-triangle game LOD sharing one 71-bone skeleton.`,cs:`Víla vygenerovaná v Tripu (Generate in Parts, 14 AI dílů), přestavěná na produkční postavu: 13 pojmenovaných dílů s čistou quad retopologií (~597 tis. quadů), nový bake do pěti texturových sad (až 8K) a rig v Rigify včetně prstů a mávajících křídel. Až na jedno záměrně ruční kliknutí v Quad Remesheru běží každý krok jako headless skript (rozdělení dílů, uzavřené skořepiny, closest-point bake, napasování rigu podle měření meshe, export LOD, QA rendery), takže pipeline lze znovu spustit na dalším AI modelu. Výsledkem je hero verze s 1,19 mil. trojúhelníků a herní LOD s 90 tis. trojúhelníků, které sdílejí jeden skelet se 71 kostmi.`},highlights:[{en:`Hero and game LOD from one source: 1,193,655 → 89,987 triangles (7.5 %), both with 13 parts, 71 deform bones and 5 texture sets, exported as GLB and FBX.`,cs:`Hero i herní LOD z jednoho zdroje: 1 193 655 → 89 987 trojúhelníků (7,5 %), obě verze se 13 díly, 71 deformačními kostmi a 5 texturovými sadami, export do GLB i FBX.`},{en:`Custom closest-point bake (cpbake.py): every texel samples the nearest point on its own high-poly part via BVH lookups, removing the wrong-surface hits and flipped normals of Cycles' ray bake (hair over skin, thin leaves). Normals bake at up to 8K, base colour is Real-ESRGAN-upscaled to 8K, face UVs get 2x texel density.`,cs:`Vlastní closest-point bake (cpbake.py): každý texel přebírá hodnotu z nejbližšího bodu svého high-poly dílu přes BVH dotazy, takže mizí chyby ray bake v Cycles, tedy snímání nesprávného povrchu a převrácené normály (vlasy přes kůži, tenké listy). Normály se pečou až v 8K, base color se na 8K zvětšuje pomocí Real-ESRGAN a UV ostrovy obličeje mají dvojnásobnou hustotu texelů.`},{en:`Procedural Rigify fit (rig_parts.py): arm lines from slab centres, five fingertips and knuckles detected from the hand's top-view outline, one chest-parented deform bone per wing; heat weights solved on a ~150k-face proxy, 20,585 seam vertices averaged, 0 mm rest-pose drift.`,cs:`Procedurální napasování Rigify (rig_parts.py): osy paží ze středů řezů, pět konečků prstů a jejich klouby rozpoznané z obrysu dlaně při pohledu shora, pro každé křídlo jedna deformační kost navázaná na hrudník; heat váhy spočítané na proxy s ~150 tis. plochami, zprůměrováno 20 585 vertexů na švech, posun v klidové póze 0 mm.`},{en:`~597k-quad retopology through an EULA-compliant Quad Remesher station: Geometry Nodes builds watertight, manifold shells (all 13 with 0 open or non-manifold edges), a human presses Remesh once, and a script splits the result back into 13 parts.`,cs:`Retopologie na ~597 tis. quadů přes vlastní stanici pro Quad Remesher v souladu s jeho EULA: Geometry Nodes postaví uzavřené manifold skořepiny (všech 13 bez jediné otevřené či non-manifold hrany), ručně se jen jednou stiskne Remesh a skript výsledek rozdělí zpět na 13 dílů.`},{en:`Automated QA pack in Cycles (review_pack.py): turnaround, joint-stress poses (squat, wave, twist-reach, flap) and macro close-ups, each close-up re-rendered on the Tripo source from the identical camera, plus a manifest.json of cameras and poses.`,cs:`Automatická QA sada v Cycles (review_pack.py): turnaround, zátěžové pózy kloubů (dřep, mávání, otočení s natažením paže, mávnutí křídly) a makro detaily; každý detail se renderuje i na zdrojovém meshi z Tripa ze stejné kamery a vše eviduje manifest.json s kamerami a pózami.`}],pitch:{gamedev:{en:`Shows I can take an unreliable AI asset all the way to a game-ready export (quad topology, a 90k-triangle LOD, clean bakes, a 71-bone skeleton with fingers) and script the QA, which is exactly the bottleneck once a team adopts generative 3D.`,cs:`Ukazuje, že umím nespolehlivý AI asset dotáhnout až k exportu připravenému pro hru (quad topologie, LOD s 90 tis. trojúhelníků, čistě zapečené textury, skelet se 71 kostmi včetně prstů) a QA zautomatizovat skripty, což je přesně úzké hrdlo, jakmile tým začne používat generativní 3D.`}},tools:[`blender`,`python`,`rigify`,`tripo`,`geometry-nodes`,`kimodo`,`pytorch`],flow:[{from:`tripo`,to:`geometry-nodes`,label:{en:`AI parts → watertight shells`,cs:`AI díly → uzavřené skořepiny`}},{from:`geometry-nodes`,to:`blender`,label:{en:`shells for quad retopo + bake`,cs:`skořepiny pro quad retopologii a bake`}},{from:`pytorch`,to:`blender`,label:{en:`Real-ESRGAN 8K base colour`,cs:`Real-ESRGAN 8K base color`}},{from:`python`,to:`rigify`,label:{en:`metarig fitted from mesh measurements`,cs:`metarig napasovaný z měření meshe`}},{from:`kimodo`,to:`rigify`,label:{en:`text-to-motion dance, retargeted`,cs:`tanec z text-to-motion, retargetovaný na rig`}}],media:{aspect:`9:16`,poster:`media/forest-fairy/poster.webp`,loop:`media/forest-fairy/loop.mp4`,full:`media/forest-fairy/full.mp4`,gallery:[{src:`media/forest-fairy/g1.webp`,aspect:`16:9`,caption:{en:`Cycles turnaround and rig test poses: wave + fist, walk, squat, wing flap.`,cs:`Turnaround v Cycles a testovací pózy rigu: mávání a sevřená pěst, chůze, dřep, mávnutí křídly.`}},{src:`media/forest-fairy/g2.webp`,aspect:`16:9`,caption:{en:`Before/after with identical cameras and lights: retopologised, rebaked asset (top) vs the Tripo source mesh (bottom).`,cs:`Srovnání před a po se stejnými kamerami i světly: retopologizovaný a znovu zapečený model (nahoře) vs. zdrojový mesh z Tripa (dole).`}},{src:`media/forest-fairy/g3.webp`,aspect:`16:9`,caption:{en:`Auto-fitted Rigify metarig: spine, limbs and wing bones placed from mesh measurements; all five fingers detected from the hand outline.`,cs:`Automaticky napasovaný Rigify metarig: páteř, končetiny a kosti křídel umístěné podle měření meshe; všech pět prstů rozpoznáno z obrysu dlaně.`}},{src:`media/forest-fairy/g4.webp`,aspect:`1:1`,caption:{en:`Source breakdown: Tripo's 14 generated parts, merged and renamed into the 13 parts that drive retopology, texture sets and the rig fit.`,cs:`Rozbor zdroje: 14 vygenerovaných dílů z Tripa, sloučených a přejmenovaných na 13 dílů, které řídí retopologii, texturové sady i napasování rigu.`}}]},audio:`muted`,credits:[{en:`Base mesh and source textures generated with Tripo ('Generate in Parts'); retopology, baking, rigging and the Blender pipeline are original work.`,cs:`Základní mesh a zdrojové textury vygenerovány v Tripu (Generate in Parts); retopologie, bake, rig i pipeline v Blenderu jsou vlastní práce.`},{en:`Dance motion generated with Kimodo text-to-motion and retargeted onto the Rigify controls; the wing flutter is procedural.`,cs:`Taneční pohyb vygenerovaný modelem Kimodo (text-to-motion) a retargetovaný na ovladače Rigify; třepotání křídel je procedurální.`},{en:`Base colour upscaled to 8K with Real-ESRGAN x4plus (BSD-3); retopology with the Quad Remesher add-on, run manually per its EULA.`,cs:`Textury base color zvětšeny na 8K pomocí Real-ESRGAN x4plus (licence BSD-3); retopologie v doplňku Quad Remesher, spouštěném ručně v souladu s jeho EULA.`}],tldr:{en:`A scripted Blender pipeline (code written with AI agents) rebuilds an AI-generated Tripo fairy as a game-ready character: a 1.19M-triangle hero and a 90k-triangle game LOD sharing one 71-bone skeleton.`,cs:`Skriptovaná pipeline v Blenderu (kód psaný s AI agenty) přestavuje AI vílu z Tripa na herní postavu: hero verze (1,19 mil. trojúhelníků) a herní LOD (90 tis.) se společným skeletem (71 kostí).`},role:{en:`Solo project: pipeline design and technical direction; the Blender/Python scripts were written with AI coding agents. The base mesh comes from Tripo, the dance from Kimodo.`,cs:`Sólový projekt: návrh pipeline a technická režie; pythonové skripty pro Blender vznikly s pomocí AI agentů pro programování. Základní mesh pochází z Tripa, tanec z modelu Kimodo.`},code:[{title:{en:`Closest-point bake: every texel reads its own high-poly part`,cs:`Closest-point bake: každý texel čte z vlastního high-poly dílu`},lang:`python`,file:`blender/cpbake.py`,snippet:`        for i, o in enumerate(objs):
            H_ = HIGH.get(o.name)
            sel = mask & (part_idx == i)
            if H_ is None or not sel.any():
                continue
            ys, xs = np.nonzero(sel)
            P = pos[ys, xs, :3]
            bvh = H_['bvh']
            fi = np.empty(len(P), np.int64)
            loc = np.empty((len(P), 3))
            t1 = time.time()
            for k in range(len(P)):
                l_, n_, f_, d_ = bvh.find_nearest(Vector(P[k]))
                if f_ is None:
                    fi[k] = -1
                    continue
                fi[k] = f_
                loc[k] = l_
            ok = fi >= 0
            ys, xs, fi, loc = ys[ok], xs[ok], fi[ok], loc[ok]
            tv, tl = H_['tv'][fi], H_['tl'][fi]
            A_, B_, C_ = H_['co'][tv[:, 0]], H_['co'][tv[:, 1]], H_['co'][tv[:, 2]]
            v0, v1, v2 = B_ - A_, C_ - A_, loc - A_
            d00, d01, d11 = (v0 * v0).sum(1), (v0 * v1).sum(1), (v1 * v1).sum(1)
            d20, d21 = (v2 * v0).sum(1), (v2 * v1).sum(1)
            den = d00 * d11 - d01 * d01
            den[np.abs(den) < 1e-20] = 1e-20
            bv = (d11 * d20 - d01 * d21) / den
            bw = (d00 * d21 - d01 * d20) / den
            bu = 1 - bv - bw
            Bc = np.clip(np.stack([bu, bv, bw], 1), 0, 1)
            Bc /= Bc.sum(1, keepdims=True) + 1e-12
            if kind_out == 'basecolor':
                uvs = (H_['uv'][tl[:, 0]] * Bc[:, :1] + H_['uv'][tl[:, 1]] * Bc[:, 1:2] + H_['uv'][tl[:, 2]] * Bc[:, 2:3])
                mi = H_['tm'][fi]
                for m_, tex in enumerate(H_['texs']):
                    sel_m = mi == m_
                    if tex is None or not sel_m.any():
                        continue
                    result[ys[sel_m], xs[sel_m]] = sample_bilinear(tex, uvs[sel_m, 0] % 1.0, uvs[sel_m, 1] % 1.0)`,note:{en:`Texels are grouped by the low-poly part that covers them, and each group searches only its own high-poly part's BVH, so a lookup never lands on a neighbouring part. Within the part, the nearest point (not a ray hit) is the surface the low mesh was retopologised from, so hair over skin and the two sides of a thin leaf are not confused. Barycentric weights of that point then interpolate the source UVs for a bilinear colour lookup.`,cs:`Texely se seskupují podle low-poly dílu, který je pokrývá, a každá skupina hledá jen v BVH vlastního high-poly dílu, takže dotaz nikdy neskončí na sousedním dílu. V rámci dílu je nejbližší bod (ne zásah paprsku) právě ten povrch, ze kterého retopologie vznikla, a tak se nezamění vlasy s kůží ani přední a zadní strana tenkého listu. Barycentrické váhy tohoto bodu pak interpolují zdrojové UV pro bilineární čtení barvy.`}},{title:{en:`Rig fit: fingertips found from the hand's top-view outline`,cs:`Napasování rigu: konečky prstů z obrysu dlaně při pohledu shora`},lang:`python`,file:`blender/rig_parts.py`,snippet:`def fit_hand(t):
    s = SIDE[t]
    A = arms[t]
    P = cat(*ARM[t])
    P = P[P[:, 0] * s > A['wrist_x'] - 0.002 * H]
    wrist = np.array(A['wrist_c'])
    hl = A['tip_x'] - A['wrist_x']
    palm = wrist + np.array([s * 0.33 * hl, 0, 0])
    d = P[:, :2] - palm[:2]
    r = np.linalg.norm(d, axis=1)
    ang = np.degrees(np.arctan2(d[:, 1], d[:, 0] * s))     # 0 = outward along the arm, -90 = front (-Y)
    keep = np.abs(ang) < 120
    bins = np.arange(-120, 121, 2.0)
    idx = np.digitize(ang[keep], bins)
    rmax = np.full(len(bins) + 1, 0.0)
    imax = np.full(len(bins) + 1, -1)
    kk = np.nonzero(keep)[0]
    for j, i in enumerate(idx):
        if r[kk[j]] > rmax[i]:
            rmax[i] = r[kk[j]]
            imax[i] = kk[j]
    prof = rmax[1:-1]
    # smooth a little, then pick the 5 most prominent maxima
    sm = np.convolve(prof, np.ones(3) / 3, mode='same')
    peaks = [i for i in range(1, len(sm) - 1) if sm[i] >= sm[i - 1] and sm[i] >= sm[i + 1] and sm[i] > 0.45 * hl]
    peaks = sorted(peaks, key=lambda i: -sm[i])
    chosen = []
    for i in peaks:
        if all(abs(i - j) >= 4 for j in chosen):
            chosen.append(i)
        if len(chosen) == 5:
            break
    chosen.sort()                                     # by angle: front (thumb, -Y) first ... pinky (+Y) last
    if len(chosen) < 5:
        log('hand', t, 'found only', len(chosen), 'fingertips; using proportional fingers')
        return None
    tips = [P[imax[i + 1]] for i in chosen]`,note:{en:`Hand vertices are binned by angle around the palm, and the farthest vertex in each 2° bin gives one point of a radius profile. After light smoothing, the five highest well-separated peaks become the fingertips, ordered thumb to pinky. With fewer than five peaks the function logs a warning and returns None; the caller then skips the finger fit and simply points the hand bone at the tip of the arm.`,cs:`Vertexy ruky se roztřídí podle úhlu kolem dlaně a nejvzdálenější vertex v každém intervalu 2° dává jeden bod profilu poloměru. Po mírném vyhlazení se z pěti nejvyšších, dostatečně oddělených vrcholů stanou konečky prstů, seřazené od palce po malíček. Když se vrcholů najde méně než pět, funkce zapíše varování do logu a vrátí None; volající kód pak prsty nenapasuje a kost ruky jen nasměruje ke špičce paže.`}}],links:[{label:`kimodo.cpp (GitHub)`,href:`https://github.com/localai-org/kimodo.cpp`}]};export{e as default};