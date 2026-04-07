"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const stops = [
  { lat: 22.3,  lon: 72.6,   label: "Gujarat, India",       year: "2007 — 2023",    desc: "Where it all began." },
  { lat: 37.5, lon: -121.9,label: "Fremont, California",  year: "2023 — 2024",     desc: "Grade 11 — first year in the US." },
  { lat: 42.0, lon: -87.8, label: "Park Ridge, Illinois", year: "2024 — 2025",     desc: "Graduated from Maine East High School." },
  { lat: 41.87,lon: -87.65,label: "UIC, Chicago",         year: "2025 — Present",  desc: "B.S. Computer Science, University of Illinois Chicago." },
];

const CAM_DEFAULT = 2.8;
const CAM_ZOOMED  = 1.75;

const ROTATIONS = [
  { x: 0.38995807575188424, y: 3.3103503368095946 }, // Gujarat, India ✓
  { x: 0.717105206240583,   y: 6.6 }, // USA ✓
  { x: 0.717105206240583,   y: 6.4134019117404355 }, // Park Ridge (same area)
  { x: 0.717105206240583,   y: 6.4134019117404355 }, // UIC, Chicago (same area)
];

function targetRotForStop(idx) { return ROTATIONS[idx]; }
function smoothstep(t) { return t * t * (3 - 2 * t); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function latLonToVec3(lat, lon, r = 1) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

export default function GlobeTimeline() {
  const mountRef   = useRef(null);
  const wrapperRef = useRef(null);
  const frameRef   = useRef(null);
  const stateRef   = useRef({
    rot:        { ...ROTATIONS[0] },
    targetRot:  { ...ROTATIONS[0] },
    camZ:       CAM_DEFAULT,
    targetCamZ: CAM_DEFAULT,
    dotOpacities:       new Array(stops.length).fill(0),
    targetDotOpacities: new Array(stops.length).fill(0),
    phase: -1,
    t: 0,
    autoSpinY: ROTATIONS[0].y,
  });

  const [activeIdx, setActiveIdx] = useState(-1);
  const [visible,   setVisible]   = useState(false);

  useEffect(() => {
    const el      = mountRef.current;
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const size = el.clientWidth;
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = CAM_DEFAULT;

    const globe = new THREE.Group();
    scene.add(globe);

    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x120a10, transparent: true, opacity: 0.22,
        shininess: 140, specular: new THREE.Color(0xe8a0b8),
      })
    ));

    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.07, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0xe8a0b8, transparent: true, opacity: 0.055, side: THREE.BackSide,
      })
    ));

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const pl = new THREE.PointLight(0xe8a0b8, 1.4, 10);
    pl.position.set(3, 2, 3); scene.add(pl);
    const fl = new THREE.PointLight(0x7864a0, 0.5, 10);
    fl.position.set(-3, -2, -2); scene.add(fl);

    const borderLines = [];
    fetch("/countries.geojson")
      .then(r => r.json())
      .then(data => {
        data.features.forEach(f => {
          const geoms = f.geometry.type === "Polygon"
            ? [f.geometry.coordinates]
            : f.geometry.coordinates;
          geoms.forEach(poly =>
            poly.forEach(ring => {
              for (let i = 0; i < ring.length - 1; i++) {
                const [lo1, la1] = ring[i];
                const [lo2, la2] = ring[i + 1];
                const a = latLonToVec3(la1, lo1, 1.001);
                const b = latLonToVec3(la2, lo2, 1.001);
                const mat = new THREE.LineBasicMaterial({
                  color: 0xe8a0b8, transparent: true, opacity: 0,
                });
                globe.add(new THREE.Line(
                  new THREE.BufferGeometry().setFromPoints([a, b]), mat
                ));
                borderLines.push({ mat, a, b });
              }
            })
          );
        });
      });

    const dotMeshes = stops.map((s, i) => {
      const pos = latLonToVec3(s.lat, s.lon, 1.018);
      const col = i === stops.length - 1 ? 0xffcee8 : 0xe8a0b8;

      const dotMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 });
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 16), dotMat);
      dot.position.copy(pos); globe.add(dot);

      const ringMat = new THREE.MeshBasicMaterial({
        color: col, transparent: true, opacity: 0, side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.034, 0.044, 32), ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globe.add(ring);

      return { dotMat, ringMat };
    });

    const INTRO_FRAC = 1 / (stops.length + 1);

    const onScroll = () => {
      const rect    = wrapper.getBoundingClientRect();
      const scrollH = wrapper.scrollHeight - window.innerHeight;
      const raw     = clamp(-rect.top / scrollH, 0, 1);
      const s       = stateRef.current;

      if (raw < INTRO_FRAC) {
        if (s.phase !== -1) { s.phase = -1; setActiveIdx(-1); }
        s.targetCamZ = CAM_DEFAULT;
        s.targetDotOpacities = s.targetDotOpacities.map(() => 0);
        return;
      }

      const afterIntro = (raw - INTRO_FRAC) / (1 - INTRO_FRAC);
      const stopIdx    = clamp(Math.floor(afterIntro * stops.length), 0, stops.length - 1);
      const fracIn     = (afterIntro * stops.length) - stopIdx;

      if (s.phase !== stopIdx) { s.phase = stopIdx; setActiveIdx(stopIdx); }

      const zoomIn  = smoothstep(clamp(fracIn / 0.35, 0, 1));
      const zoomOut = smoothstep(clamp((fracIn - 0.65) / 0.35, 0, 1));
      s.targetCamZ  = CAM_DEFAULT - (CAM_DEFAULT - CAM_ZOOMED) * (zoomIn - zoomOut);

      const rotT = smoothstep(clamp((fracIn - 0.65) / 0.35, 0, 1));
      const rotA = targetRotForStop(stopIdx);
      const rotB = stopIdx < stops.length - 1 ? targetRotForStop(stopIdx + 1) : rotA;
      s.targetRot.y = lerp(rotA.y, rotB.y, rotT);
      s.targetRot.x = lerp(rotA.x, rotB.x, rotT);

      stops.forEach((_, i) => {
        if (i === stopIdx)    s.targetDotOpacities[i] = fracIn > 0.2 && fracIn < 0.88 ? 1 : 0;
        else if (i < stopIdx) s.targetDotOpacities[i] = 0.28;
        else                  s.targetDotOpacities[i] = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const camDirVec = new THREE.Vector3();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const s = stateRef.current;
      s.t += 0.016;

      if (s.phase === -1) {
        s.autoSpinY += 0.004;
        // Keep spin anchored near India's Y so transition is short
        s.rot.y = ROTATIONS[0].y + Math.sin(s.autoSpinY) * 0.3;
        s.rot.x += (0 - s.rot.x) * 0.04;
      } else {
        s.rot.y += (s.targetRot.y - s.rot.y) * 0.055;
        s.rot.x += (s.targetRot.x - s.rot.x) * 0.055;
      }

      s.camZ += (s.targetCamZ - s.camZ) * 0.06;
      globe.rotation.y  = s.rot.y;
      globe.rotation.x  = s.rot.x;
      camera.position.z = s.camZ;

      dotMeshes.forEach(({ dotMat, ringMat }, i) => {
        s.dotOpacities[i] += (s.targetDotOpacities[i] - s.dotOpacities[i]) * 0.08;
        const pulse = i === s.phase
          ? s.dotOpacities[i] * (0.7 + Math.sin(s.t * 3) * 0.3)
          : s.dotOpacities[i];
        dotMat.opacity  = pulse;
        ringMat.opacity = pulse * 0.45;
      });

      camera.getWorldDirection(camDirVec);
      const invQ     = globe.quaternion.clone().invert();
      const localCam = camDirVec.clone().applyQuaternion(invQ);
      borderLines.forEach(({ mat, a, b }) => {
        const mid = a.clone().add(b).multiplyScalar(0.5).normalize();
        const d   = mid.dot(localCam.clone().negate());
        mat.opacity = clamp((d - 0.05) / 0.2, 0, 1) * 0.22;
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => { renderer.setSize(el.clientWidth, el.clientWidth); };
    window.addEventListener("resize", onResize);
    setTimeout(() => setVisible(true), 100);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

    return (
      <div ref={wrapperRef} style={{ position: "relative", height: `${(stops.length + 1) * 100}vh` }}>
        <div style={{
          position: "sticky", top: 0, height: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "clamp(24px, 6vw, 72px)",
          padding: "0 clamp(16px, 4vw, 48px)",
          paddingTop: "80px", // account for navbar height
        }}>

          {/* Globe */}
          <div ref={mountRef} style={{
            width: "min(460px, 44vw)",
            flexShrink: 0,
            borderRadius: "50%",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease",
          }} />

          {/* Text only — no progress bar here */}
          <div style={{ maxWidth: "300px", position: "relative", minHeight: "160px" }}>

            <div style={{
              position: "absolute", top: 0, left: 0,
              opacity: activeIdx === -1 ? 1 : 0,
              transform: activeIdx === -1 ? "translateY(0)" : "translateY(-12px)",
              transition: "opacity 0.55s ease, transform 0.55s ease",
              pointerEvents: "none",
            }}>
              <p className="page-eyebrow">My journey</p>
              <h3 style={{
                fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 200,
                color: "white", letterSpacing: "0.04em",
                marginTop: "12px", lineHeight: 1.3,
              }}>
                Across Globe.<br />One path.
              </h3>
            </div>

            {stops.map((s, i) => (
              <div key={i} style={{
                position: "absolute", top: 0, left: 0,
                opacity: activeIdx === i ? 1 : 0,
                transform: activeIdx === i ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 0.55s ease, transform 0.55s ease",
                pointerEvents: "none",
              }}>
                <p className="page-eyebrow">{s.year}</p>
                <h3 style={{
                  fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 200,
                  color: "white", letterSpacing: "0.04em",
                  marginTop: "12px", marginBottom: "14px", lineHeight: 1.2,
                }}>
                  {s.label}
                </h3>
                <p style={{
                  fontSize: "14px", fontWeight: 300,
                  color: "rgba(255,255,255,0.48)", lineHeight: 1.85,
                }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar — fixed to bottom of screen */}
        <div style={{
          position: "fixed",
          bottom: "36px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 999,
          pointerEvents: "none",
          opacity: activeIdx === -1 ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}>
          {stops.map((_, j) => (
            <div key={j} style={{
              width: j === activeIdx ? "24px" : "6px",
              height: "2px",
              borderRadius: "2px",
              background: j === activeIdx ? "#e8a0b8" : "rgba(255,255,255,0.18)",
              opacity: j === activeIdx ? 1 : j < activeIdx ? 0.45 : 0.18,
              transition: "width 0.4s ease, background 0.4s ease, opacity 0.4s ease",
            }} />
          ))}
        </div>
      </div>
    );
}