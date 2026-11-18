import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface TerminalCore3DProps {
  accentColorHex: number;
  reducedMotion: boolean;
}

function createTerminalTexture(accentCss: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#09090d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Header bar
    ctx.fillStyle = '#14141c';
    ctx.fillRect(0, 0, canvas.width, 36);
    ctx.fillStyle = accentCss;
    ctx.fillRect(0, 34, canvas.width, 2);

    ctx.fillStyle = '#e4e4e7';
    ctx.font = '600 14px monospace';
    ctx.fillText('mac@workstation:~/portfolio', 16, 23);

    // Terminal lines
    const lines = [
      { text: '$ whoami --role', color: accentCss },
      { text: '  Ian Mc Lauren "Mac" Bobier', color: '#f4f4f5' },
      { text: '  BSCS · Software & IT Systems', color: '#a1a1aa' },
      { text: '$ ip route show default', color: accentCss },
      { text: '  default via 192.168.10.1 dev eth0', color: '#d4d4d8' },
      { text: '$ docker compose ps --services', color: accentCss },
      { text: '  frontend-ui  api-server  mysql-db', color: '#d4d4d8' },
    ];

    ctx.font = '500 13px monospace';
    lines.forEach((line, i) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 18, 68 + i * 28);
    });

    // Bottom waveform bars
    for (let i = 0; i < 24; i++) {
      const h = 10 + Math.abs(Math.sin(i * 0.65)) * 28;
      ctx.fillStyle = i % 3 === 0 ? accentCss : 'rgba(255,255,255,0.16)';
      ctx.fillRect(18 + i * 19.5, 298 - h, 12, h);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function TerminalCore3D({ accentColorHex, reducedMotion }: TerminalCore3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const accentRef = useRef<number>(accentColorHex);
  const reducedMotionRef = useRef<boolean>(reducedMotion);

  const accentMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const ringMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const screenMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    accentRef.current = accentColorHex;
    const hexCss = `#${accentColorHex.toString(16).padStart(6, '0')}`;
    accentMaterialsRef.current.forEach((mat) => {
      mat.color.setHex(accentColorHex);
      mat.emissive.setHex(accentColorHex);
    });
    if (ringMaterialRef.current) {
      ringMaterialRef.current.color.setHex(accentColorHex);
      ringMaterialRef.current.emissive.setHex(accentColorHex);
    }
    if (pointLightRef.current) {
      pointLightRef.current.color.setHex(accentColorHex);
    }
    if (screenMatRef.current) {
      const prevMap = screenMatRef.current.map;
      const nextMap = createTerminalTexture(hexCss);
      screenMatRef.current.map = nextMap;
      screenMatRef.current.needsUpdate = true;
      prevMap?.dispose();
    }
  }, [accentColorHex]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 5.25);
    camera.lookAt(0, 0.25, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTex = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTex;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // 3-point warm/cool studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0xd4dcff, 0x18181b, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 2.2);
    keyLight.position.set(3.5, 5.5, 4.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(accentRef.current, 2.4, 12);
    rimLight.position.set(-2.6, 1.8, -2.2);
    scene.add(rimLight);
    pointLightRef.current = rimLight;

    // Materials with clear roughness/metalness contrast
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x1b1c22,
      roughness: 0.42,
      metalness: 0.78,
    });
    const mattePolymerMat = new THREE.MeshStandardMaterial({
      color: 0x121217,
      roughness: 0.78,
      metalness: 0.14,
    });
    const brushedAluminumMat = new THREE.MeshStandardMaterial({
      color: 0x626675,
      roughness: 0.24,
      metalness: 0.92,
    });
    const accentLedMat = new THREE.MeshStandardMaterial({
      color: accentRef.current,
      emissive: accentRef.current,
      emissiveIntensity: 1.45,
      roughness: 0.25,
      metalness: 0.2,
    });
    accentMaterialsRef.current = [accentLedMat];

    const initialHexCss = `#${accentRef.current.toString(16).padStart(6, '0')}`;
    const screenTex = createTerminalTexture(initialHexCss);
    screenTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    screenMatRef.current = screenMat;

    // Root procedural assembly (bottom-centered inside floating group)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const terminalGroup = new THREE.Group();
    rootGroup.add(terminalGroup);

    // 1. Primary silhouette: Beveled wedge base (ExtrudeGeometry)
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-0.95, 0);
    baseShape.lineTo(0.95, 0);
    baseShape.lineTo(0.82, 0.34);
    baseShape.lineTo(-0.78, 0.22);
    baseShape.closePath();

    const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
      depth: 1.5,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.04,
      bevelSegments: 3,
    });
    baseGeo.center();
    const baseMesh = new THREE.Mesh(baseGeo, darkChassisMat);
    baseMesh.rotation.y = Math.PI / 2;
    baseMesh.position.set(0, 0.22, 0.12);
    baseMesh.castShadow = !isSoftwareGl;
    baseMesh.receiveShadow = !isSoftwareGl;
    terminalGroup.add(baseMesh);

    // 2. Display monitor housing
    const monitorHousingGeo = new THREE.BoxGeometry(1.52, 1.02, 0.34);
    const monitorHousing = new THREE.Mesh(monitorHousingGeo, mattePolymerMat);
    monitorHousing.position.set(0, 0.86, -0.18);
    monitorHousing.rotation.x = -0.1;
    monitorHousing.castShadow = !isSoftwareGl;
    terminalGroup.add(monitorHousing);

    // 3. Brushed aluminum monitor bezel frame
    const bezelGeo = new THREE.BoxGeometry(1.56, 1.06, 0.06);
    const bezelMesh = new THREE.Mesh(bezelGeo, brushedAluminumMat);
    bezelMesh.position.set(0, 0.86, -0.02);
    bezelMesh.rotation.x = -0.1;
    terminalGroup.add(bezelMesh);

    // 4. OLED terminal screen plane
    const screenGeo = new THREE.PlaneGeometry(1.36, 0.86);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.86, 0.015);
    screenMesh.rotation.x = -0.1;
    terminalGroup.add(screenMesh);

    // 5. Mechanical keyboard deck (InstancedMesh for 32 keycaps)
    const keyGeo = new THREE.BoxGeometry(0.11, 0.045, 0.1);
    const keyCount = 32;
    const keyInstanced = new THREE.InstancedMesh(keyGeo, mattePolymerMat, keyCount);
    const dummy = new THREE.Object3D();
    let k = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        dummy.position.set(-0.54 + col * 0.155, 0.34 - row * 0.025, 0.28 + row * 0.14);
        dummy.rotation.set(0.14, 0, 0);
        dummy.updateMatrix();
        keyInstanced.setMatrixAt(k++, dummy.matrix);
      }
    }
    keyInstanced.instanceMatrix.needsUpdate = true;
    keyInstanced.computeBoundingSphere();
    terminalGroup.add(keyInstanced);

    // 6. Accent LED front strip & rear cooling fin accent
    const ledStripGeo = new THREE.BoxGeometry(1.24, 0.032, 0.04);
    const ledStrip = new THREE.Mesh(ledStripGeo, accentLedMat);
    ledStrip.position.set(0, 0.16, 0.89);
    terminalGroup.add(ledStrip);

    // 7. Side heatsink rails (left & right)
    const finGeo = new THREE.BoxGeometry(0.08, 0.56, 0.42);
    [-0.82, 0.82].forEach((xPos) => {
      const fin = new THREE.Mesh(finGeo, brushedAluminumMat);
      fin.position.set(xPos, 0.72, -0.2);
      fin.rotation.x = -0.1;
      terminalGroup.add(fin);
    });

    // 8. Rear network patch ports (RJ45-style glowing indicators)
    const portGeo = new THREE.BoxGeometry(0.12, 0.09, 0.06);
    for (let p = 0; p < 4; p++) {
      const port = new THREE.Mesh(portGeo, p % 2 === 0 ? accentLedMat : brushedAluminumMat);
      port.position.set(-0.36 + p * 0.24, 0.25, -0.66);
      terminalGroup.add(port);
    }

    // 9. Orbiting network telemetry ring & 4 relay nodes
    const orbitalGroup = new THREE.Group();
    orbitalGroup.position.set(0, 0.62, 0);
    orbitalGroup.rotation.z = 0.18;
    orbitalGroup.rotation.x = 0.22;
    rootGroup.add(orbitalGroup);

    const ringGeo = new THREE.TorusGeometry(1.55, 0.016, 12, 72);
    const ringMat = new THREE.MeshStandardMaterial({
      color: accentRef.current,
      emissive: accentRef.current,
      emissiveIntensity: 0.9,
      roughness: 0.3,
      metalness: 0.6,
    });
    ringMaterialRef.current = ringMat;
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    orbitalGroup.add(ringMesh);

    const nodeGeo = new THREE.OctahedronGeometry(0.075, 0);
    for (let n = 0; n < 4; n++) {
      const angle = (n / 4) * Math.PI * 2;
      const node = new THREE.Mesh(nodeGeo, n % 2 === 0 ? accentLedMat : brushedAluminumMat);
      node.position.set(Math.cos(angle) * 1.55, 0, Math.sin(angle) * 1.55);
      orbitalGroup.add(node);
    }

    // 10. Grounding soft contact shadow beneath floating assembly
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -0.52, 0);
    scene.add(shadowPlane);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Interactive pointer drag & hover tilt
    let isDragging = false;
    let prevX = 0;
    let dragVelocityY = 0;
    let pointerTiltX = 0;
    let targetTiltX = 0;

    const canvasEl = renderer.domElement;
    canvasEl.style.cursor = 'grab';

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      canvasEl.style.cursor = 'grabbing';
      canvasEl.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetTiltX = THREE.MathUtils.clamp(ny * 0.14, -0.16, 0.16);
      if (isDragging) {
        const dx = e.clientX - prevX;
        prevX = e.clientX;
        dragVelocityY = dx * 0.012;
        rootGroup.rotation.y += dragVelocityY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      canvasEl.style.cursor = 'grab';
      if (canvasEl.hasPointerCapture(e.pointerId)) {
        canvasEl.releasePointerCapture(e.pointerId);
      }
    };

    const onPointerLeave = () => {
      targetTiltX = 0;
    };

    canvasEl.addEventListener('pointerdown', onPointerDown);
    canvasEl.addEventListener('pointermove', onPointerMove);
    canvasEl.addEventListener('pointerup', onPointerUp);
    canvasEl.addEventListener('pointerleave', onPointerLeave);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(160, entry.contentRect.width);
        const h = Math.max(160, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (!reducedMotionRef.current) {
        if (!isDragging) {
          rootGroup.rotation.y += delta * 0.42 + dragVelocityY;
          dragVelocityY = THREE.MathUtils.damp(dragVelocityY, 0, 5, delta);
        }
        rootGroup.position.y = Math.sin(elapsed * 1.45) * 0.085;
        orbitalGroup.rotation.y -= delta * 0.35;
        shadowMat.opacity = 0.52 - Math.sin(elapsed * 1.45) * 0.07;
      } else {
        rootGroup.position.y = 0;
      }

      pointerTiltX = THREE.MathUtils.damp(pointerTiltX, targetTiltX, 6, delta);
      rootGroup.rotation.x = pointerTiltX;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('pointermove', onPointerMove);
      canvasEl.removeEventListener('pointerup', onPointerUp);
      canvasEl.removeEventListener('pointerleave', onPointerLeave);

      baseGeo.dispose();
      monitorHousingGeo.dispose();
      bezelGeo.dispose();
      screenGeo.dispose();
      keyGeo.dispose();
      ledStripGeo.dispose();
      finGeo.dispose();
      portGeo.dispose();
      ringGeo.dispose();
      nodeGeo.dispose();
      shadowGeo.dispose();

      darkChassisMat.dispose();
      mattePolymerMat.dispose();
      brushedAluminumMat.dispose();
      accentLedMat.dispose();
      ringMat.dispose();
      screenMatRef.current?.map?.dispose();
      screenMat.dispose();
      shadowTex.dispose();
      shadowMat.dispose();
      envTex.dispose();

      renderer.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none">
      <div
        ref={mountRef}
        className="h-full w-full"
        aria-label="Interactive 3D rotating terminal workstation centerpiece"
      />
    </div>
  );
}
