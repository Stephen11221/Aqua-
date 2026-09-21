import * as THREE from 'three';
import { REAL_ASSETS } from '../../assets/images';

export interface CarWashBayEnvironment {
  group: THREE.Group;
  update: (delta: number) => void;
  dispose: () => void;
}

export function createCarWashBayEnvironment(scene: THREE.Scene): CarWashBayEnvironment {
  const envGroup = new THREE.Group();

  // 1. Bay Floor (Glossy epoxy tiled floor with subtle water reflections)
  const floorGeo = new THREE.PlaneGeometry(16, 24);
  floorGeo.rotateX(-Math.PI / 2);

  const floorTexture = createEpoxyFloorTexture();
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.12,
    metalness: 0.25,
    color: '#334155'
  });
  const floor = new THREE.Mesh(floorGeo, floorMaterial);
  floor.receiveShadow = true;
  envGroup.add(floor);

  // 2. Real Photorealistic Wash Tunnel Backdrop Arch (Real 3D Image Backdrop)
  const textureLoader = new THREE.TextureLoader();
  const tunnelTexture = textureLoader.load(REAL_ASSETS.tunnelBay);
  tunnelTexture.generateMipmaps = true;
  tunnelTexture.minFilter = THREE.LinearMipmapLinearFilter;

  // Curved panoramic tunnel portal at the back of the bay
  const tunnelBackdropGeo = new THREE.CylinderGeometry(11, 11, 8.5, 32, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
  const tunnelBackdropMat = new THREE.MeshBasicMaterial({
    map: tunnelTexture,
    side: THREE.BackSide,
    toneMapped: false
  });
  const tunnelBackdrop = new THREE.Mesh(tunnelBackdropGeo, tunnelBackdropMat);
  tunnelBackdrop.position.set(0, 3.8, -7);
  tunnelBackdrop.rotation.y = Math.PI;
  envGroup.add(tunnelBackdrop);

  // Tunnel entrance glow arch frame
  const portalArchGeo = new THREE.TorusGeometry(5.2, 0.15, 16, 32, Math.PI);
  const portalArchMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8'
  });
  const portalArch = new THREE.Mesh(portalArchGeo, portalArchMat);
  portalArch.position.set(0, 0, -9.5);
  portalArch.rotation.z = 0;
  envGroup.add(portalArch);

  // 3. In-Bay 3D Live Jumbotron Telemetry Screen
  const monitorWidth = 3.2;
  const monitorHeight = 1.8;
  const monitorGeo = new THREE.PlaneGeometry(monitorWidth, monitorHeight);
  
  // Live animated canvas texture for the 3D in-scene jumbotron
  const monitorCanvas = document.createElement('canvas');
  monitorCanvas.width = 512;
  monitorCanvas.height = 288;
  const monitorCtx = monitorCanvas.getContext('2d');
  const monitorTexture = new THREE.CanvasTexture(monitorCanvas);

  const monitorMat = new THREE.MeshBasicMaterial({
    map: monitorTexture,
    side: THREE.DoubleSide
  });
  const monitorMesh = new THREE.Mesh(monitorGeo, monitorMat);
  // Mount on the left gantry wall angled toward the vehicle
  monitorMesh.position.set(-3.2, 3.2, -1.5);
  monitorMesh.rotation.y = Math.PI / 3.8;
  envGroup.add(monitorMesh);

  // Monitor frame casing
  const casingGeo = new THREE.BoxGeometry(monitorWidth + 0.15, monitorHeight + 0.15, 0.1);
  const casingMat = new THREE.MeshStandardMaterial({ color: '#090d16', metalness: 0.8, roughness: 0.3 });
  const casingMesh = new THREE.Mesh(casingGeo, casingMat);
  casingMesh.position.copy(monitorMesh.position);
  casingMesh.rotation.copy(monitorMesh.rotation);
  casingMesh.position.z -= 0.05;
  envGroup.add(casingMesh);

  // Yellow vehicle guide rails
  const railMat = new THREE.MeshStandardMaterial({
    color: '#eab308',
    roughness: 0.4,
    metalness: 0.2
  });
  const leftRailGeo = new THREE.BoxGeometry(0.12, 0.08, 16);
  const leftRail = new THREE.Mesh(leftRailGeo, railMat);
  leftRail.position.set(-1.45, 0.04, 0);
  const rightRail = new THREE.Mesh(leftRailGeo, railMat);
  rightRail.position.set(1.45, 0.04, 0);
  envGroup.add(leftRail, rightRail);

  // Central floor drain trench
  const drainMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.9,
    metalness: 0.7
  });
  const drainGeo = new THREE.BoxGeometry(0.8, 0.02, 16);
  const drain = new THREE.Mesh(drainGeo, drainMat);
  drain.position.set(0, 0.005, 0);
  envGroup.add(drain);

  // Drainage grate slats
  const grateMat = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.8, roughness: 0.3 });
  for (let g = -7; g <= 7; g += 0.5) {
    const slatGeo = new THREE.BoxGeometry(0.76, 0.03, 0.06);
    const slat = new THREE.Mesh(slatGeo, grateMat);
    slat.position.set(0, 0.015, g);
    envGroup.add(slat);
  }

  // 4. Ceiling Structural Trusses & Wash Tunnel Canopy
  const steelMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.85,
    roughness: 0.3
  });

  for (let z = -8; z <= 8; z += 4) {
    // Arch Truss
    const trussBeamGeo = new THREE.BoxGeometry(7.0, 0.18, 0.18);
    const truss = new THREE.Mesh(trussBeamGeo, steelMat);
    truss.position.set(0, 4.8, z);
    envGroup.add(truss);

    // Industrial overhead LED lights
    const lightFixtGeo = new THREE.BoxGeometry(2.0, 0.1, 0.3);
    const lightMat = new THREE.MeshBasicMaterial({ color: '#f8fafc' });
    const lightMesh = new THREE.Mesh(lightFixtGeo, lightMat);
    lightMesh.position.set(0, 4.7, z);
    envGroup.add(lightMesh);
  }

  // Side Splash Curtain Walls (frosted glass / corrugated acrylic)
  const splashWallMat = new THREE.MeshPhysicalMaterial({
    color: '#0284c7',
    transmission: 0.7,
    opacity: 0.35,
    transparent: true,
    roughness: 0.2
  });

  const leftWallGeo = new THREE.BoxGeometry(0.1, 3.2, 16);
  const leftWall = new THREE.Mesh(leftWallGeo, splashWallMat);
  leftWall.position.set(-3.5, 1.6, 0);
  const rightWall = new THREE.Mesh(leftWallGeo, splashWallMat);
  rightWall.position.set(3.5, 1.6, 0);
  envGroup.add(leftWall, rightWall);

  // 5. Lighting Setup
  // Ambient fill
  const ambientLight = new THREE.AmbientLight('#e2e8f0', 1.2);
  envGroup.add(ambientLight);

  // Key directional light with soft shadow
  const keyLight = new THREE.DirectionalLight('#ffffff', 2.2);
  keyLight.position.set(5, 8, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.camera.left = -5;
  keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 5;
  keyLight.shadow.camera.bottom = -5;
  envGroup.add(keyLight);

  // Fill directional light with cool tint
  const fillLight = new THREE.DirectionalLight('#38bdf8', 1.6);
  fillLight.position.set(-5, 6, -4);
  envGroup.add(fillLight);

  // Subtle ground bounce light
  const groundBounce = new THREE.HemisphereLight('#f8fafc', '#0f172a', 0.8);
  envGroup.add(groundBounce);

  scene.add(envGroup);

  let monitorTick = 0;

  return {
    group: envGroup,
    update: (delta: number) => {
      monitorTick += delta;
      // Update the 3D in-scene jumbotron screen every few frames
      if (monitorCtx && monitorTick % 0.05 < delta) {
        renderMonitorContent(monitorCtx, monitorCanvas.width, monitorCanvas.height);
        monitorTexture.needsUpdate = true;
      }
    },
    dispose: () => {
      scene.remove(envGroup);
      floorGeo.dispose();
      floorMaterial.dispose();
      tunnelBackdropGeo.dispose();
      tunnelBackdropMat.dispose();
      monitorGeo.dispose();
      monitorMat.dispose();
      monitorTexture.dispose();
    }
  };
}

function renderMonitorContent(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Dark cybernetic monitor background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  // Top header bar
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, w, 32);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('AQUAGLOW 3D TELEMETRY • BAY 01', 14, 22);

  // REC dot
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(w - 24, 16, 5, 0, Math.PI * 2);
  ctx.fill();

  // Metrics grid
  ctx.fillStyle = '#38bdf8';
  ctx.font = '13px monospace';
  ctx.fillText('STATUS: WASH CYCLE IN PROGRESS', 16, 64);
  ctx.fillText('PRESSURE: 1,480 PSI [OPTIMAL]', 16, 88);
  ctx.fillText('WATER FLOW: 14.2 GPM', 16, 112);
  ctx.fillText('CHEM: CITRUS + SNOW FOAM', 16, 136);

  // Mini radar waveform
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const time = Date.now() * 0.005;
  for (let x = 16; x < w - 16; x += 4) {
    const y = 190 + Math.sin(time + x * 0.05) * 18 + Math.cos(time * 0.5 + x * 0.02) * 8;
    if (x === 16) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Scanline overlay
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }
}

function createEpoxyFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Slate background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    // Grid lines for tiles
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    const tileSize = 64;
    for (let x = 0; x <= 512; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Speckles
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 6);
  return texture;
}
