import * as THREE from 'three';
import { VehicleType } from '../../types';

export interface CarInstance {
  group: THREE.Group;
  bodyMesh: THREE.Mesh;
  bodyMaterial: THREE.MeshPhysicalMaterial;
  dirtMaterial: THREE.MeshStandardMaterial;
  dirtMesh: THREE.Mesh;
  wheels: THREE.Group[];
  updateCleanliness: (cleanliness: number) => void;
  updateColor: (colorHex: string) => void;
  rotateWheels: (delta: number) => void;
}

export function createCarModel(type: VehicleType, colorHex: string, initialCleanliness: number = 0.3): CarInstance {
  const carGroup = new THREE.Group();

  // Color & materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colorHex),
    metalness: 0.75,
    roughness: 0.15 + (1 - initialCleanliness) * 0.4,
    clearcoat: initialCleanliness * 0.9,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9
  });

  // Dirt layer material
  const dirtTexture = createProceduralDirtTexture();
  const dirtMaterial = new THREE.MeshStandardMaterial({
    map: dirtTexture,
    transparent: true,
    opacity: Math.max(0, 1 - initialCleanliness) * 0.85,
    roughness: 0.95,
    metalness: 0.05,
    color: new THREE.Color('#5c4033')
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#1e293b'),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.6,
    transparent: true,
    opacity: 0.85
  });

  const blackTrimMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#090d16'),
    roughness: 0.8,
    metalness: 0.2
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e2e8f0'),
    metalness: 0.95,
    roughness: 0.1
  });

  const lightHeadMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    emissive: new THREE.Color('#e0f2fe'),
    emissiveIntensity: 0.9
  });

  const lightTailMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dc2626'),
    emissive: new THREE.Color('#ef4444'),
    emissiveIntensity: 0.8
  });

  // Geometry dimensions based on vehicle type
  let length = 4.4;
  let width = 1.9;
  let height = 1.35;
  let cabinHeight = 0.75;
  let cabinLength = 2.4;
  let wheelRadius = 0.36;

  if (type === 'suv') {
    length = 4.6;
    width = 2.05;
    height = 1.65;
    cabinHeight = 0.95;
    cabinLength = 2.9;
    wheelRadius = 0.42;
  } else if (type === 'coupe') {
    length = 4.3;
    width = 1.95;
    height = 1.22;
    cabinHeight = 0.62;
    cabinLength = 2.0;
    wheelRadius = 0.37;
  } else if (type === 'truck') {
    length = 5.2;
    width = 2.15;
    height = 1.75;
    cabinHeight = 0.98;
    cabinLength = 2.5;
    wheelRadius = 0.44;
  }

  // Lower chassis / main body
  const bodyGeo = new THREE.BoxGeometry(width, height * 0.45, length);
  // Soft chamfer / scale edges
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
  bodyMesh.position.y = wheelRadius + height * 0.25;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  carGroup.add(bodyMesh);

  // Dirt clone overlay
  const dirtGeo = new THREE.BoxGeometry(width * 1.002, height * 0.452, length * 1.002);
  const dirtMesh = new THREE.Mesh(dirtGeo, dirtMaterial);
  dirtMesh.position.copy(bodyMesh.position);
  carGroup.add(dirtMesh);

  // Cabin / Greenhouse
  let cabinGeo: THREE.BufferGeometry;
  if (type === 'truck') {
    // Truck cabin (front) + open bed (back)
    cabinGeo = new THREE.BoxGeometry(width * 0.92, cabinHeight, cabinLength * 0.8);
    const cabinMesh = new THREE.Mesh(cabinGeo, bodyMaterial);
    cabinMesh.position.set(0, bodyMesh.position.y + height * 0.22 + cabinHeight * 0.5, 0.4);
    cabinMesh.castShadow = true;
    carGroup.add(cabinMesh);

    // Bed walls
    const bedWallGeo = new THREE.BoxGeometry(width * 0.94, cabinHeight * 0.5, length * 0.4);
    const bedMesh = new THREE.Mesh(bedWallGeo, blackTrimMaterial);
    bedMesh.position.set(0, bodyMesh.position.y + height * 0.2 + cabinHeight * 0.25, -length * 0.25);
    carGroup.add(bedMesh);
  } else {
    // Sloped aerodynamic cabin
    cabinGeo = new THREE.BoxGeometry(width * 0.88, cabinHeight, cabinLength);
    const cabinMesh = new THREE.Mesh(cabinGeo, bodyMaterial);
    cabinMesh.position.set(0, bodyMesh.position.y + height * 0.22 + cabinHeight * 0.5, -0.15);
    cabinMesh.castShadow = true;
    carGroup.add(cabinMesh);

    // Windshield front & rear glass panels
    const windshieldGeo = new THREE.BoxGeometry(width * 0.86, cabinHeight * 0.9, cabinLength * 0.8);
    const windshieldMesh = new THREE.Mesh(windshieldGeo, glassMaterial);
    windshieldMesh.position.copy(cabinMesh.position);
    carGroup.add(windshieldMesh);
  }

  // Hood scoop / aerodynamic contour front
  const frontNoseGeo = new THREE.BoxGeometry(width * 0.96, height * 0.2, length * 0.35);
  const frontNose = new THREE.Mesh(frontNoseGeo, bodyMaterial);
  frontNose.position.set(0, bodyMesh.position.y - 0.05, length * 0.4);
  carGroup.add(frontNose);

  // Front Grille & Radiator
  const grilleGeo = new THREE.BoxGeometry(width * 0.7, height * 0.22, 0.1);
  const grille = new THREE.Mesh(grilleGeo, blackTrimMaterial);
  grille.position.set(0, bodyMesh.position.y, length * 0.5 + 0.02);
  carGroup.add(grille);

  // Headlights
  const headlightGeo = new THREE.BoxGeometry(width * 0.22, 0.1, 0.12);
  const leftLight = new THREE.Mesh(headlightGeo, lightHeadMaterial);
  leftLight.position.set(-width * 0.35, bodyMesh.position.y + 0.08, length * 0.49);
  const rightLight = new THREE.Mesh(headlightGeo, lightHeadMaterial);
  rightLight.position.set(width * 0.35, bodyMesh.position.y + 0.08, length * 0.49);
  carGroup.add(leftLight, rightLight);

  // Taillights
  const tailGeo = new THREE.BoxGeometry(width * 0.28, 0.08, 0.08);
  const leftTail = new THREE.Mesh(tailGeo, lightTailMaterial);
  leftTail.position.set(-width * 0.32, bodyMesh.position.y + 0.08, -length * 0.5 - 0.01);
  const rightTail = new THREE.Mesh(tailGeo, lightTailMaterial);
  rightTail.position.set(width * 0.32, bodyMesh.position.y + 0.08, -length * 0.5 - 0.01);
  carGroup.add(leftTail, rightTail);

  // Wheels creation (4 wheels with rotating rims)
  const wheels: THREE.Group[] = [];
  const wheelPositions = [
    { x: -width * 0.48, z: length * 0.3 }, // Front Left
    { x: width * 0.48, z: length * 0.3 },  // Front Right
    { x: -width * 0.48, z: -length * 0.3 }, // Rear Left
    { x: width * 0.48, z: -length * 0.3 }  // Rear Right
  ];

  wheelPositions.forEach((pos, idx) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(pos.x, wheelRadius, pos.z);

    // Tire rubber
    const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.24, 24);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeo, blackTrimMaterial);
    tireMesh.castShadow = true;
    wheelGroup.add(tireMesh);

    // Alloy Rim
    const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.68, wheelRadius * 0.68, 0.25, 16);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, chromeMaterial);
    wheelGroup.add(rimMesh);

    // Rim Spokes (5-spoke design)
    for (let s = 0; s < 5; s++) {
      const angle = (s * Math.PI * 2) / 5;
      const spokeGeo = new THREE.BoxGeometry(0.04, wheelRadius * 0.6, 0.05);
      const spoke = new THREE.Mesh(spokeGeo, chromeMaterial);
      spoke.rotation.x = angle;
      wheelGroup.add(spoke);
    }

    // Brake Caliper
    const caliperGeo = new THREE.BoxGeometry(0.08, 0.12, 0.08);
    const caliperMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.3 });
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(idx % 2 === 0 ? 0.05 : -0.05, wheelRadius * 0.25, 0);
    wheelGroup.add(caliper);

    carGroup.add(wheelGroup);
    wheels.push(wheelGroup);
  });

  // License plate front and back
  const plateGeo = new THREE.BoxGeometry(0.48, 0.14, 0.02);
  const plateMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 });
  const frontPlate = new THREE.Mesh(plateGeo, plateMat);
  frontPlate.position.set(0, bodyMesh.position.y - 0.1, length * 0.51);
  const backPlate = new THREE.Mesh(plateGeo, plateMat);
  backPlate.position.set(0, bodyMesh.position.y - 0.08, -length * 0.51);
  carGroup.add(frontPlate, backPlate);

  // Side mirrors
  const mirrorGeo = new THREE.BoxGeometry(0.18, 0.1, 0.1);
  const leftMirror = new THREE.Mesh(mirrorGeo, bodyMaterial);
  leftMirror.position.set(-width * 0.52, bodyMesh.position.y + cabinHeight * 0.4, length * 0.08);
  const rightMirror = new THREE.Mesh(mirrorGeo, bodyMaterial);
  rightMirror.position.set(width * 0.52, bodyMesh.position.y + cabinHeight * 0.4, length * 0.08);
  carGroup.add(leftMirror, rightMirror);

  return {
    group: carGroup,
    bodyMesh,
    bodyMaterial,
    dirtMaterial,
    dirtMesh,
    wheels,
    updateCleanliness: (cleanliness: number) => {
      const c = Math.max(0, Math.min(1, cleanliness));
      dirtMaterial.opacity = Math.max(0, (1 - c) * 0.85);
      bodyMaterial.roughness = 0.12 + (1 - c) * 0.4;
      bodyMaterial.clearcoat = c * 0.95;
      bodyMaterial.clearcoatRoughness = 0.18 - c * 0.12;
    },
    updateColor: (newColorHex: string) => {
      bodyMaterial.color.set(newColorHex);
    },
    rotateWheels: (delta: number) => {
      wheels.forEach(w => {
        w.rotation.x += delta * 4.0;
      });
    }
  };
}

// Generates an asphalt / dust canvas texture dynamically
function createProceduralDirtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#453229';
    ctx.fillRect(0, 0, 256, 256);

    // Random speckles / mud splashes
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 6 + 1;
      const alpha = Math.random() * 0.6 + 0.2;
      ctx.fillStyle = `rgba(60, 40, 25, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Streaks
    for (let j = 0; j < 30; j++) {
      const x = Math.random() * 256;
      const y = Math.random() * 200;
      const len = Math.random() * 40 + 15;
      ctx.strokeStyle = 'rgba(75, 50, 30, 0.4)';
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 8, y + len);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}
