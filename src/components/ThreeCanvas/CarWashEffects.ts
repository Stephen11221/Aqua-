import * as THREE from 'three';
import { WashStageId } from '../../types';

export interface WashEffectsManager {
  update: (delta: number, stage: WashStageId, carPosition: THREE.Vector3) => void;
  dispose: () => void;
  group: THREE.Group;
  leftBrush: THREE.Group;
  rightBrush: THREE.Group;
  topBrush: THREE.Group;
  archLedMaterial: THREE.MeshBasicMaterial;
}

export function createWashEffects(scene: THREE.Scene): WashEffectsManager {
  const effectsGroup = new THREE.Group();

  // 1. LED Gantry Arch
  const archGroup = new THREE.Group();
  archGroup.position.set(0, 0, 0);

  // Arch frame
  const archMaterial = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.8,
    roughness: 0.2
  });

  const archLedMaterial = new THREE.MeshBasicMaterial({
    color: '#38bdf8'
  });

  // Vertical gantry columns
  const colGeo = new THREE.BoxGeometry(0.35, 4.0, 0.4);
  const leftCol = new THREE.Mesh(colGeo, archMaterial);
  leftCol.position.set(-2.8, 2.0, 0);
  const rightCol = new THREE.Mesh(colGeo, archMaterial);
  rightCol.position.set(2.8, 2.0, 0);

  // Top beam
  const beamGeo = new THREE.BoxGeometry(6.0, 0.4, 0.4);
  const topBeam = new THREE.Mesh(beamGeo, archMaterial);
  topBeam.position.set(0, 4.0, 0);

  // LED Strip around inner frame
  const ledTopGeo = new THREE.BoxGeometry(5.6, 0.1, 0.42);
  const ledTop = new THREE.Mesh(ledTopGeo, archLedMaterial);
  ledTop.position.set(0, 3.8, 0);

  const ledColGeo = new THREE.BoxGeometry(0.1, 3.6, 0.42);
  const ledLeft = new THREE.Mesh(ledColGeo, archLedMaterial);
  ledLeft.position.set(-2.6, 1.9, 0);
  const ledRight = new THREE.Mesh(ledColGeo, archLedMaterial);
  ledRight.position.set(2.6, 1.9, 0);

  archGroup.add(leftCol, rightCol, topBeam, ledTop, ledLeft, ledRight);
  effectsGroup.add(archGroup);

  // 2. Soft-Cloth Roller Brushes (Vertical left & right + Top horizontal)
  const brushClothMaterial = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    roughness: 0.8,
    metalness: 0.1
  });

  // Left Vertical Brush
  const leftBrush = new THREE.Group();
  leftBrush.position.set(-2.2, 1.5, 0);
  const brushGeo = new THREE.CylinderGeometry(0.45, 0.45, 2.8, 16);
  const leftBrushMesh = new THREE.Mesh(brushGeo, brushClothMaterial);
  leftBrush.add(leftBrushMesh);

  // Add decorative soft-cloth strips
  for (let b = 0; b < 12; b++) {
    const stripGeo = new THREE.BoxGeometry(0.08, 2.6, 0.35);
    const stripMat = new THREE.MeshStandardMaterial({
      color: b % 2 === 0 ? '#38bdf8' : '#0284c7',
      roughness: 0.9
    });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.rotation.y = (b * Math.PI) / 6;
    leftBrush.add(strip);
  }

  // Right Vertical Brush
  const rightBrush = new THREE.Group();
  rightBrush.position.set(2.2, 1.5, 0);
  const rightBrushMesh = new THREE.Mesh(brushGeo, brushClothMaterial);
  rightBrush.add(rightBrushMesh);
  for (let b = 0; b < 12; b++) {
    const stripGeo = new THREE.BoxGeometry(0.08, 2.6, 0.35);
    const stripMat = new THREE.MeshStandardMaterial({
      color: b % 2 === 0 ? '#38bdf8' : '#0284c7',
      roughness: 0.9
    });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.rotation.y = (b * Math.PI) / 6;
    rightBrush.add(strip);
  }

  // Top Horizontal Brush
  const topBrush = new THREE.Group();
  topBrush.position.set(0, 3.2, 0);
  const topBrushGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.0, 16);
  topBrushGeo.rotateZ(Math.PI / 2);
  const topBrushMesh = new THREE.Mesh(topBrushGeo, brushClothMaterial);
  topBrush.add(topBrushMesh);
  for (let b = 0; b < 10; b++) {
    const stripGeo = new THREE.BoxGeometry(2.8, 0.08, 0.3);
    const stripMat = new THREE.MeshStandardMaterial({
      color: b % 2 === 0 ? '#38bdf8' : '#0369a1',
      roughness: 0.9
    });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.rotation.x = (b * Math.PI) / 5;
    topBrush.add(strip);
  }

  effectsGroup.add(leftBrush, rightBrush, topBrush);

  // 3. Water Spray Particle System (Hydro blast / pre-soak)
  const sprayCount = 1200;
  const sprayGeometry = new THREE.BufferGeometry();
  const sprayPositions = new Float32Array(sprayCount * 3);
  const sprayVelocities = new Float32Array(sprayCount * 3);

  for (let i = 0; i < sprayCount; i++) {
    resetSprayParticle(i, sprayPositions, sprayVelocities);
  }

  sprayGeometry.setAttribute('position', new THREE.BufferAttribute(sprayPositions, 3));
  const sprayMaterial = new THREE.PointsMaterial({
    color: '#67e8f9',
    size: 0.08,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const sprayParticles = new THREE.Points(sprayGeometry, sprayMaterial);
  sprayParticles.visible = false;
  effectsGroup.add(sprayParticles);

  // 4. Snow Foam Particles (Tri-color thick foam curtain)
  const foamCount = 800;
  const foamGeometry = new THREE.BufferGeometry();
  const foamPositions = new Float32Array(foamCount * 3);
  const foamColors = new Float32Array(foamCount * 3);
  const foamSizes = new Float32Array(foamCount);

  const foamColorPalette = [
    new THREE.Color('#f472b6'), // Pink foam
    new THREE.Color('#38bdf8'), // Blue foam
    new THREE.Color('#facc15'), // Yellow foam
    new THREE.Color('#ffffff')  // Snow white
  ];

  for (let i = 0; i < foamCount; i++) {
    resetFoamParticle(i, foamPositions, foamColors, foamSizes, foamColorPalette);
  }

  foamGeometry.setAttribute('position', new THREE.BufferAttribute(foamPositions, 3));
  foamGeometry.setAttribute('color', new THREE.BufferAttribute(foamColors, 3));
  const foamMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.16,
    transparent: true,
    opacity: 0.85,
    blending: THREE.NormalBlending
  });
  const foamParticles = new THREE.Points(foamGeometry, foamMaterial);
  foamParticles.visible = false;
  effectsGroup.add(foamParticles);

  // 5. High-Velocity Dryer Air Streaks (Turbo dry)
  const dryerStreakCount = 350;
  const dryerGeo = new THREE.BufferGeometry();
  const dryerPositions = new Float32Array(dryerStreakCount * 3);
  for (let i = 0; i < dryerStreakCount; i++) {
    dryerPositions[i * 3] = (Math.random() - 0.5) * 3.5;
    dryerPositions[i * 3 + 1] = Math.random() * 3.0 + 0.5;
    dryerPositions[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
  }
  dryerGeo.setAttribute('position', new THREE.BufferAttribute(dryerPositions, 3));
  const dryerMat = new THREE.PointsMaterial({
    color: '#e0f2fe',
    size: 0.12,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const dryerParticles = new THREE.Points(dryerGeo, dryerMat);
  dryerParticles.visible = false;
  effectsGroup.add(dryerParticles);

  // 6. Sparkle Glints (Ceramic wax & Completed shine)
  const sparkleCount = 60;
  const sparkleGeo = new THREE.BufferGeometry();
  const sparklePositions = new Float32Array(sparkleCount * 3);
  for (let i = 0; i < sparkleCount; i++) {
    sparklePositions[i * 3] = (Math.random() - 0.5) * 2.2;
    sparklePositions[i * 3 + 1] = Math.random() * 1.5 + 0.4;
    sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 4.4;
  }
  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
  const sparkleMat = new THREE.PointsMaterial({
    color: '#fef08a',
    size: 0.18,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const sparkleParticles = new THREE.Points(sparkleGeo, sparkleMat);
  sparkleParticles.visible = false;
  effectsGroup.add(sparkleParticles);

  scene.add(effectsGroup);

  let animTime = 0;

  return {
    group: effectsGroup,
    leftBrush,
    rightBrush,
    topBrush,
    archLedMaterial,
    update: (delta: number, stage: WashStageId) => {
      animTime += delta;

      // Update LED colors based on stage
      switch (stage) {
        case 'pre_soak':
          archLedMaterial.color.set('#f59e0b'); // amber
          break;
        case 'foam_cannon':
          archLedMaterial.color.set('#ec4899'); // pink
          break;
        case 'pressure_wash':
          archLedMaterial.color.set('#06b6d4'); // cyan
          break;
        case 'brush_scrub':
          archLedMaterial.color.set('#10b981'); // emerald
          break;
        case 'wheel_blast':
          archLedMaterial.color.set('#6366f1'); // indigo
          break;
        case 'ceramic_wax':
          archLedMaterial.color.set('#eab308'); // gold
          break;
        case 'turbo_dry':
          archLedMaterial.color.set('#38bdf8'); // sky
          break;
        case 'completed':
          archLedMaterial.color.set('#22c55e'); // green
          break;
        default:
          archLedMaterial.color.set('#64748b'); // slate
          break;
      }

      // 1. Handle Brush Animations
      const isBrushActive = stage === 'brush_scrub';
      if (isBrushActive) {
        // Move brushes in towards car sides
        leftBrush.position.x = THREE.MathUtils.lerp(leftBrush.position.x, -1.35, 0.08);
        rightBrush.position.x = THREE.MathUtils.lerp(rightBrush.position.x, 1.35, 0.08);

        // Lower top brush onto hood & roof
        const targetTopY = 1.6 + Math.sin(animTime * 1.5) * 0.25;
        topBrush.position.y = THREE.MathUtils.lerp(topBrush.position.y, targetTopY, 0.08);

        // Move gantry / brushes forward & backward along car length
        const zShift = Math.sin(animTime * 2.2) * 1.6;
        leftBrush.position.z = zShift;
        rightBrush.position.z = zShift;
        topBrush.position.z = zShift;

        // Rapidly spin brushes
        leftBrush.rotation.y += delta * 18.0;
        rightBrush.rotation.y -= delta * 18.0;
        topBrush.rotation.x += delta * 18.0;
      } else {
        // Retract brushes to sides & parking height
        leftBrush.position.x = THREE.MathUtils.lerp(leftBrush.position.x, -2.4, 0.05);
        rightBrush.position.x = THREE.MathUtils.lerp(rightBrush.position.x, 2.4, 0.05);
        topBrush.position.y = THREE.MathUtils.lerp(topBrush.position.y, 3.4, 0.05);
        leftBrush.position.z = THREE.MathUtils.lerp(leftBrush.position.z, 0, 0.05);
        rightBrush.position.z = THREE.MathUtils.lerp(rightBrush.position.z, 0, 0.05);
        topBrush.position.z = THREE.MathUtils.lerp(topBrush.position.z, 0, 0.05);
      }

      // 2. Water Spray Particles (pre_soak, pressure_wash, wheel_blast)
      const isSprayActive = stage === 'pressure_wash' || stage === 'pre_soak' || stage === 'wheel_blast';
      sprayParticles.visible = isSprayActive;
      if (isSprayActive) {
        const positions = sprayGeometry.attributes.position.array as Float32Array;
        const count = sprayPositions.length / 3;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          // Apply velocity
          positions[idx] += sprayVelocities[idx] * delta * 2.5;
          positions[idx + 1] += sprayVelocities[idx + 1] * delta * 2.5;
          positions[idx + 2] += sprayVelocities[idx + 2] * delta * 2.5;

          // If reached floor or car surface, reset
          if (positions[idx + 1] <= 0.08 || Math.abs(positions[idx]) > 3.0) {
            resetSprayParticle(i, positions, sprayVelocities);
          }
        }
        sprayGeometry.attributes.position.needsUpdate = true;
      }

      // 3. Snow Foam Particles (foam_cannon)
      const isFoamActive = stage === 'foam_cannon';
      foamParticles.visible = isFoamActive;
      if (isFoamActive) {
        const positions = foamGeometry.attributes.position.array as Float32Array;
        const count = foamPositions.length / 3;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          // Falling gently with air drift
          positions[idx + 1] -= delta * (1.2 + Math.random() * 0.8);
          positions[idx] += Math.sin(animTime * 3.0 + i) * 0.005;

          if (positions[idx + 1] <= 0.15) {
            positions[idx] = (Math.random() - 0.5) * 2.6;
            positions[idx + 1] = 3.6 + Math.random() * 0.4;
            positions[idx + 2] = (Math.random() - 0.5) * 4.6;
          }
        }
        foamGeometry.attributes.position.needsUpdate = true;
      }

      // 4. Turbo Dryer (turbo_dry)
      const isDryerActive = stage === 'turbo_dry';
      dryerParticles.visible = isDryerActive;
      if (isDryerActive) {
        const positions = dryerGeo.attributes.position.array as Float32Array;
        const count = dryerStreakCount;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          // Blast downward and rearward
          positions[idx + 1] -= delta * 12.0;
          positions[idx + 2] -= delta * 6.0;

          if (positions[idx + 1] <= 0.2 || positions[idx + 2] < -3.0) {
            positions[idx] = (Math.random() - 0.5) * 3.0;
            positions[idx + 1] = 3.2 + Math.random() * 0.5;
            positions[idx + 2] = 2.0 + Math.random() * 1.5;
          }
        }
        dryerGeo.attributes.position.needsUpdate = true;
      }

      // 5. Sparkles (ceramic_wax, completed)
      const isSparkleActive = stage === 'ceramic_wax' || stage === 'completed';
      sparkleParticles.visible = isSparkleActive;
      if (isSparkleActive) {
        const positions = sparkleGeo.attributes.position.array as Float32Array;
        const count = sparkleCount;
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          positions[idx + 1] += delta * 0.4;
          if (positions[idx + 1] > 2.6) {
            positions[idx] = (Math.random() - 0.5) * 2.2;
            positions[idx + 1] = 0.5 + Math.random() * 0.4;
            positions[idx + 2] = (Math.random() - 0.5) * 4.2;
          }
        }
        sparkleGeo.attributes.position.needsUpdate = true;
      }
    },
    dispose: () => {
      scene.remove(effectsGroup);
      sprayGeometry.dispose();
      sprayMaterial.dispose();
      foamGeometry.dispose();
      foamMaterial.dispose();
      dryerGeo.dispose();
      dryerMat.dispose();
      sparkleGeo.dispose();
      sparkleMat.dispose();
    }
  };
}

function resetSprayParticle(
  idx: number,
  positions: Float32Array,
  velocities: Float32Array
) {
  const i = idx * 3;
  // Emitters around the gantry arch
  const side = Math.random() > 0.4 ? (Math.random() > 0.5 ? 1 : -1) : 0;
  if (side === 0) {
    // Top spray bar
    positions[i] = (Math.random() - 0.5) * 2.4;
    positions[i + 1] = 3.6;
    positions[i + 2] = (Math.random() - 0.5) * 0.6;

    velocities[i] = (Math.random() - 0.5) * 0.8;
    velocities[i + 1] = - (3.5 + Math.random() * 2.0);
    velocities[i + 2] = (Math.random() - 0.5) * 1.5;
  } else {
    // Side nozzle columns
    positions[i] = side * 2.4;
    positions[i + 1] = 0.5 + Math.random() * 2.0;
    positions[i + 2] = (Math.random() - 0.5) * 0.8;

    velocities[i] = -side * (3.0 + Math.random() * 1.5);
    velocities[i + 1] = (Math.random() - 0.5) * 1.0;
    velocities[i + 2] = (Math.random() - 0.5) * 1.5;
  }
}

function resetFoamParticle(
  idx: number,
  positions: Float32Array,
  colors: Float32Array,
  sizes: Float32Array,
  palette: THREE.Color[]
) {
  const i = idx * 3;
  positions[i] = (Math.random() - 0.5) * 2.8;
  positions[i + 1] = 3.5 + Math.random() * 0.5;
  positions[i + 2] = (Math.random() - 0.5) * 4.6;

  const col = palette[Math.floor(Math.random() * palette.length)];
  colors[i] = col.r;
  colors[i + 1] = col.g;
  colors[i + 2] = col.b;

  sizes[idx] = 0.12 + Math.random() * 0.12;
}
