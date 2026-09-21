import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { VehicleType, WashStageId } from '../../types';
import { createCarModel, CarInstance } from './CarModel';
import { createCarWashBayEnvironment, CarWashBayEnvironment } from './CarWashEnvironment';
import { createWashEffects, WashEffectsManager } from './CarWashEffects';
import { ThreeControlsOverlay } from './ThreeControlsOverlay';
import { soundManager } from '../../utils/audio';
import { WASH_STAGES } from '../../data/packages';
import { LiveBayVideoPlayer } from '../Video/LiveBayVideoPlayer';
import { X, Maximize2 } from 'lucide-react';

export interface CarWash3DProps {
  initialVehicle?: VehicleType;
  activeStage?: WashStageId;
  onStageChange?: (stage: WashStageId) => void;
  carColor?: string;
  isInteractive?: boolean;
}

export const CarWash3D: React.FC<CarWash3DProps> = ({
  initialVehicle = 'sedan',
  activeStage,
  onStageChange,
  carColor: initialColor = '#1e3a8a',
  isInteractive = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // States
  const [vehicleType, setVehicleType] = useState<VehicleType>(initialVehicle);
  const [carColor, setCarColor] = useState<string>(initialColor);
  const [currentStage, setCurrentStage] = useState<WashStageId>(activeStage || 'pre_soak');
  const [cleanliness, setCleanliness] = useState<number>(0.2);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isScrubbingActive, setIsScrubbingActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<'cinematic' | 'front' | 'side' | 'wheel' | 'top'>('cinematic');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isLiveVideoOpen, setIsLiveVideoOpen] = useState<boolean>(false);

  // Refs for 3D objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carInstanceRef = useRef<CarInstance | null>(null);
  const effectsRef = useRef<WashEffectsManager | null>(null);
  const envRef = useRef<CarWashBayEnvironment | null>(null);

  // Camera animation target refs
  const camTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.2, 5.8));
  const camLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.9, 0));
  const currentCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.2, 5.8));
  const currentCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.9, 0));
  const orbitAngle = useRef<number>(0);

  // User input tracking for rotation / scrubbing
  const isDragging = useRef<boolean>(false);
  const previousPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Keep cleanliness state synced with car instance
  useEffect(() => {
    if (carInstanceRef.current) {
      carInstanceRef.current.updateCleanliness(cleanliness);
    }
  }, [cleanliness]);

  // Sync external active stage if provided
  useEffect(() => {
    if (activeStage && activeStage !== currentStage) {
      setCurrentStage(activeStage);
      soundManager.playStageTransition(activeStage);
    }
  }, [activeStage]);

  // Handle stage selection
  const handleSelectStage = useCallback((stage: WashStageId) => {
    setCurrentStage(stage);
    soundManager.playStageTransition(stage);
    if (onStageChange) {
      onStageChange(stage);
    }
    // Boost cleanliness accordingly
    const stageIdx = WASH_STAGES.findIndex(s => s.id === stage);
    if (stageIdx > 0) {
      const newClean = Math.min(1.0, 0.2 + (stageIdx / (WASH_STAGES.length - 1)) * 0.8);
      setCleanliness(newClean);
    }
  }, [onStageChange]);

  // Auto-play simulation cycle
  useEffect(() => {
    if (!isAutoPlaying) return;

    const stagesList: WashStageId[] = [
      'pre_soak',
      'foam_cannon',
      'pressure_wash',
      'brush_scrub',
      'wheel_blast',
      'ceramic_wax',
      'turbo_dry',
      'completed'
    ];

    let currentIdx = stagesList.indexOf(currentStage);
    if (currentIdx === -1 || currentIdx === stagesList.length - 1) {
      currentIdx = 0;
      setCleanliness(0.15);
      handleSelectStage(stagesList[0]);
    }

    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % stagesList.length;
      const nextStage = stagesList[currentIdx];
      handleSelectStage(nextStage);

      // Interpolate cleanliness
      const targetClean = (currentIdx + 1) / stagesList.length;
      setCleanliness(prev => Math.min(1.0, prev + 0.15));

      if (nextStage === 'completed') {
        setIsAutoPlaying(false);
      }
    }, 4500 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentStage, handleSelectStage, simulationSpeed]);

  // Handle Camera Presets
  const handleSelectCamera = useCallback((preset: 'cinematic' | 'front' | 'side' | 'wheel' | 'top') => {
    setCameraPreset(preset);
    switch (preset) {
      case 'front':
        camTargetPos.current.set(0, 1.8, 5.6);
        camLookAt.current.set(0, 0.8, 0);
        break;
      case 'side':
        camTargetPos.current.set(-4.8, 1.6, 0.2);
        camLookAt.current.set(0, 0.9, 0);
        break;
      case 'wheel':
        camTargetPos.current.set(-2.2, 0.6, 1.8);
        camLookAt.current.set(-1.0, 0.4, 1.2);
        break;
      case 'top':
        camTargetPos.current.set(0, 7.8, 0.6);
        camLookAt.current.set(0, 0.4, 0);
        break;
      case 'cinematic':
      default:
        camTargetPos.current.set(3.5, 2.2, 4.2);
        camLookAt.current.set(0, 0.9, 0);
        break;
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.035);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.copy(camTargetPos.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Build Environment & Effects
    const env = createCarWashBayEnvironment(scene);
    envRef.current = env;

    const effects = createWashEffects(scene);
    effectsRef.current = effects;

    // Build Initial Car Model
    const car = createCarModel(vehicleType, carColor, cleanliness);
    carInstanceRef.current = car;
    scene.add(car.group);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Rotate wheels if car is in motion or washing
      if (carInstanceRef.current) {
        carInstanceRef.current.rotateWheels(delta);
      }

      // Update wash effects (particles, brushes, spray)
      if (effectsRef.current && carInstanceRef.current) {
        effectsRef.current.update(delta, currentStage, carInstanceRef.current.group.position);
      }

      // Update in-bay 3D telemetry jumbotron screen
      if (envRef.current?.update) {
        envRef.current.update(delta);
      }

      // Camera transitions / Orbit
      if (cameraRef.current) {
        if (cameraPreset === 'cinematic') {
          orbitAngle.current += delta * 0.18;
          const radius = 5.2;
          camTargetPos.current.x = Math.sin(orbitAngle.current) * radius;
          camTargetPos.current.z = Math.cos(orbitAngle.current) * radius;
          camTargetPos.current.y = 2.0 + Math.sin(orbitAngle.current * 0.5) * 0.4;
        }

        // Smooth camera lerp
        currentCamPos.current.lerp(camTargetPos.current, 0.05);
        currentCamLook.current.lerp(camLookAt.current, 0.05);

        cameraRef.current.position.copy(currentCamPos.current);
        cameraRef.current.lookAt(currentCamLook.current);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      if (envRef.current) envRef.current.dispose();
      if (effectsRef.current) effectsRef.current.dispose();
    };
  }, []);

  // Update vehicle chassis when vehicleType changes
  useEffect(() => {
    if (!sceneRef.current) return;
    if (carInstanceRef.current) {
      sceneRef.current.remove(carInstanceRef.current.group);
    }
    const newCar = createCarModel(vehicleType, carColor, cleanliness);
    carInstanceRef.current = newCar;
    sceneRef.current.add(newCar.group);
  }, [vehicleType]);

  // Update car paint color
  useEffect(() => {
    if (carInstanceRef.current) {
      carInstanceRef.current.updateColor(carColor);
    }
  }, [carColor]);

  // Pointer & Touch Handlers for Orbit & Sponge Scrubbing
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    previousPointerPos.current = { x: e.clientX, y: e.clientY };
    if (isScrubbingActive) {
      handleScrub(e);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    if (isScrubbingActive) {
      handleScrub(e);
      return;
    }

    // Camera free rotate
    const deltaX = e.clientX - previousPointerPos.current.x;
    const deltaY = e.clientY - previousPointerPos.current.y;
    previousPointerPos.current = { x: e.clientX, y: e.clientY };

    if (cameraPreset !== 'cinematic') {
      const radius = camTargetPos.current.distanceTo(camLookAt.current);
      const theta = Math.atan2(camTargetPos.current.x, camTargetPos.current.z) - deltaX * 0.008;
      const phi = Math.max(0.2, Math.min(Math.PI / 2.2, Math.acos(camTargetPos.current.y / radius) - deltaY * 0.008));

      camTargetPos.current.x = radius * Math.sin(phi) * Math.sin(theta);
      camTargetPos.current.z = radius * Math.sin(phi) * Math.cos(theta);
      camTargetPos.current.y = radius * Math.cos(phi);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.003;
    const dir = new THREE.Vector3().subVectors(camTargetPos.current, camLookAt.current);
    const dist = dir.length();
    if ((dist > 2.5 && zoomFactor > 0) || (dist < 12 && zoomFactor < 0)) {
      dir.multiplyScalar(1 + zoomFactor);
      camTargetPos.current.copy(camLookAt.current).add(dir);
    }
  };

  // Sponge Scrub Mechanic: cleans dirt when dragging over the car
  const handleScrub = (e: React.PointerEvent) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !carInstanceRef.current) return;

    const rect = container.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(carInstanceRef.current.group.children, true);

    if (intersects.length > 0) {
      soundManager.playScrubSound();
      setCleanliness(prev => Math.min(1.0, prev + 0.025));
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-950 overflow-hidden select-none">
      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* Interactive Controls & HUD */}
      {isInteractive && (
        <ThreeControlsOverlay
          currentStage={currentStage}
          onSelectStage={handleSelectStage}
          vehicleType={vehicleType}
          onSelectVehicle={setVehicleType}
          carColor={carColor}
          onChangeColor={setCarColor}
          cleanliness={cleanliness}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
          isScrubbingActive={isScrubbingActive}
          onToggleScrubbing={() => setIsScrubbingActive(!isScrubbingActive)}
          isMuted={isMuted}
          onToggleMute={() => {
            const next = !isMuted;
            setIsMuted(next);
            soundManager.setMuted(next);
          }}
          onResetCar={() => setCleanliness(0.1)}
          cameraPreset={cameraPreset}
          onSelectCamera={handleSelectCamera}
          speed={simulationSpeed}
          onChangeSpeed={setSimulationSpeed}
          isLiveVideoOpen={isLiveVideoOpen}
          onToggleLiveVideo={() => setIsLiveVideoOpen(!isLiveVideoOpen)}
        />
      )}

      {/* Floating Picture-in-Picture Live CCTV Camera Feed */}
      {isLiveVideoOpen && (
        <div 
          id="pip-cctv-video-container"
          className="absolute top-20 right-4 z-30 w-72 sm:w-96 shadow-2xl rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE CCTV CAMERA FEED</span>
            </div>
            <button
              onClick={() => setIsLiveVideoOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Close PiP Feed"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-1.5">
            <LiveBayVideoPlayer
              activeStage={currentStage}
              onSelectStage={handleSelectStage}
              isCompact={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
