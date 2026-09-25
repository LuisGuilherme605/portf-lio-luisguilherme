/* ========================================
   ROBO MASCOTE 3D — Three.js / WebGL
   robo de verdade em 3D que segue o mouse.
   so roda no desktop (escondido no mobile pelo CSS).
   ======================================== */
import * as THREE from "three";

(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 820px)").matches;
  var container = document.getElementById("robo");
  var canvas = document.getElementById("robo-canvas");

  if (!container || !canvas) return;
  if (prefersReduced || isMobile) {
    container.style.display = "none";
    return;
  }

  var W = 120,
    H = 140;

  // cores do site
  var PURPLE = 0x7c5cfc;
  var TEAL = 0x00e5b4;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
  } catch (e) {
    // sem suporte a WebGL: esconde o canto, sem robo quebrado
    container.style.display = "none";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0.2, 7.2);

  // ---- luzes coloridas (dao a "vida"/brilho) ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  var keyLight = new THREE.PointLight(PURPLE, 110, 60, 2);
  keyLight.position.set(4, 4, 6);
  scene.add(keyLight);
  var rimLight = new THREE.PointLight(TEAL, 90, 60, 2);
  rimLight.position.set(-5, -1, 4);
  scene.add(rimLight);
  var topLight = new THREE.DirectionalLight(0xffffff, 1.1);
  topLight.position.set(0, 6, 3);
  scene.add(topLight);

  // ---- materiais ----
  var bodyMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a4d,
    metalness: 0.6,
    roughness: 0.35,
  });
  var trimMat = new THREE.MeshStandardMaterial({
    color: 0x141430,
    metalness: 0.75,
    roughness: 0.3,
  });
  var glassMat = new THREE.MeshStandardMaterial({
    color: 0x05050f,
    metalness: 0.3,
    roughness: 0.12,
  });
  var eyeMat = new THREE.MeshStandardMaterial({
    color: TEAL,
    emissive: TEAL,
    emissiveIntensity: 1.7,
    roughness: 0.2,
  });
  var coreMat = new THREE.MeshStandardMaterial({
    color: PURPLE,
    emissive: PURPLE,
    emissiveIntensity: 1.4,
    roughness: 0.2,
  });

  // ---- montagem do robo ----
  var robot = new THREE.Group();
  scene.add(robot);

  // cabeca
  var head = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.7, 1.5), bodyMat);
  head.position.y = 0.95;
  robot.add(head);

  // tela do rosto
  var face = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.2, 0.22), glassMat);
  face.position.set(0, 0.95, 0.78);
  robot.add(face);

  // olhos (grupo proprio pra piscar/seguir)
  var eyes = new THREE.Group();
  var eyeGeo = new THREE.SphereGeometry(0.22, 24, 24);
  var eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.46, 0.97, 0.95);
  var eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.46, 0.97, 0.95);
  eyes.add(eyeL, eyeR);
  robot.add(eyes);

  // antena + ponta brilhante
  var antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.62, 8),
    trimMat
  );
  antenna.position.set(0, 2.05, 0);
  robot.add(antenna);
  var antTip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), coreMat);
  antTip.position.set(0, 2.4, 0);
  robot.add(antTip);

  // orelhas laterais
  var earGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 18);
  var earL = new THREE.Mesh(earGeo, trimMat);
  earL.rotation.z = Math.PI / 2;
  earL.position.set(-1.32, 0.95, 0);
  var earR = new THREE.Mesh(earGeo, trimMat);
  earR.rotation.z = Math.PI / 2;
  earR.position.set(1.32, 0.95, 0);
  robot.add(earL, earR);

  // corpo
  var body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.35, 1.25), bodyMat);
  body.position.y = -0.75;
  robot.add(body);

  // core no peito
  var core = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), coreMat);
  core.position.set(0, -0.62, 0.66);
  robot.add(core);

  // bracos
  var armGeo = new THREE.CapsuleGeometry(0.17, 0.72, 6, 12);
  var armL = new THREE.Mesh(armGeo, bodyMat);
  armL.position.set(-1.18, -0.72, 0);
  var armR = new THREE.Mesh(armGeo, bodyMat);
  armR.position.set(1.18, -0.72, 0);
  robot.add(armL, armR);

  robot.scale.setScalar(0.92);

  // ---- seguir o mouse ----
  var targetRX = 0,
    targetRY = 0;
  window.addEventListener("mousemove", function (e) {
    var nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
    var ny = e.clientY / window.innerHeight - 0.5;
    targetRY = nx * 1.5; // gira esquerda/direita
    targetRX = ny * 1.0; // inclina cima/baixo
  });

  // ---- loop ----
  var clock = new THREE.Clock();
  var rafId = null;

  function frame() {
    rafId = requestAnimationFrame(frame);
    var t = clock.getElapsedTime();

    // segue o cursor de forma suave
    robot.rotation.y += (targetRY - robot.rotation.y) * 0.07;
    robot.rotation.x += (targetRX - robot.rotation.x) * 0.07;

    // flutuar + balancinho ocioso
    robot.position.y = Math.sin(t * 1.6) * 0.13;
    robot.rotation.z = Math.sin(t * 0.8) * 0.05;

    // pulso da antena e do core
    var pulse = Math.sin(t * 3) * 0.5 + 0.5;
    antTip.material.emissiveIntensity = 0.9 + pulse * 1.5;
    core.material.emissiveIntensity = 0.7 + pulse * 1.1;

    // piscar a cada ~4.2s
    var phase = t % 4.2;
    var blink = phase > 3.85 ? Math.sin((phase - 3.85) * (Math.PI / 0.35)) : 0;
    eyes.scale.y = 1 - blink * 0.9;

    renderer.render(scene, camera);
  }
  frame();

  // pausa quando a aba nao esta visivel (economiza recurso, sem loop duplicado)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (rafId === null) {
      clock.start();
      frame();
    }
  });
})();
