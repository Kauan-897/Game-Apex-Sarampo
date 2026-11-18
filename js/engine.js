// 3D First-Person & 2.5D Billboard Exploration Engine (Estilo Pokémon / HD-2D em 1ª Pessoa)
class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 960;
        this.height = 540;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Input state
        this.keys = {
            w: false, a: false, s: false, d: false,
            q: false, r: false,
            ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
            arrowup: false, arrowleft: false, arrowdown: false, arrowright: false,
            e: false, ' ': false
        };

        // Camera Mode: 'fp' (1ª Pessoa - Padrão) or 'tp' (3ª Pessoa 2.5D estilo Pokémon)
        this.cameraMode = 'fp';

        // 3D Player & Camera state (World units: meters, X = left/right, Y = up, Z = forward/depth)
        this.player = {
            x: 0,
            y: 0,
            z: -3.5,
            yaw: 0,          // Horizontal look angle in radians (0 = looking toward +Z)
            pitch: 0,        // Vertical look tilt in radians
            speed: 4.2,      // Walking speed (meters/sec)
            turnSpeed: 2.1,  // Rotation speed (rad/sec)
            facing: 1,       // Sprite flip for 3rd person
            isMoving: false,
            walkTimer: 0,
            stepSoundTimer: 0,
            eyeHeight: 1.62
        };

        this.focalLength = 520;
        this.zNear = 0.25;

        // Mouse look state
        this.isDraggingLook = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.isPointerLocked = false;

        this.currentChapter = null;
        this.scene3D = null;
        this.backgroundImg = new Image();
        this.playerStandImg = new Image();
        this.playerWalkImg = new Image();
        this.playerPhoneImg = new Image();

        this.playerStandImg.src = 'assets/characters/lucas_stand.png';
        this.playerWalkImg.src = 'assets/characters/lucas_walk.png';
        this.playerPhoneImg.src = 'assets/characters/lucas_phone.png';

        this.npcImages = {};
        this.isMovementLocked = false;
        this.activeInteractable = null;
        this.activeNpc = null;
        this.interactionCallback = null;
        this.interactionCooldown = 0;

        // 3D Blender Model Inspection State (13 modelos do Blender: Cap 1, Cap 2, Cap 3 e Cap 4)
        this.isInspectingPhone3D = false;
        this.inspectedModelId = 'CelularCap1';
        this.modelCatalog = [
            'CelularCap1',
            'CamaCap1',
            'EscrivaninhaCap1',
            'MonitorCap1',
            'ViolaoCap1',
            'BancoCap2',
            'Quadro-AvisosCap2',
            'MesaUBSCap3',
            'MesaPanfletosCap3',
            'SofaCap3',
            'MesaCentroCap3',
            'CafeteiraCap3',
            'RetratoCap3'
        ];
        this.inspectPhoneRot = {
            yaw: 0.42,
            pitch: 0.55,
            zoom: 1.0,
            autoSpin: true
        };
        this.tryLoadExternalOBJ('CelularCap1', 'assets/models/CelularCap1.obj');
        this.tryLoadExternalOBJ('CamaCap1', 'assets/models/CamaCap1.obj');
        this.tryLoadExternalOBJ('EscrivaninhaCap1', 'assets/models/EscrivaninhaCap1.obj');
        this.tryLoadExternalOBJ('MonitorCap1', 'assets/models/MonitorCap1.obj');
        this.tryLoadExternalOBJ('ViolaoCap1', 'assets/models/ViolaoCap1.obj');
        this.tryLoadExternalOBJ('BancoCap2', 'assets/models/BancoCap2.obj');
        this.tryLoadExternalOBJ('Quadro-AvisosCap2', 'assets/models/Quadro-AvisosCap2.obj');
        this.tryLoadExternalOBJ('MesaUBSCap3', 'assets/models/MesaUBSCap3.obj');
        this.tryLoadExternalOBJ('MesaPanfletosCap3', 'assets/models/MesaPanfletosCap3.obj');
        this.tryLoadExternalOBJ('SofaCap3', 'assets/models/SofaCap3.obj');
        this.tryLoadExternalOBJ('MesaCentroCap3', 'assets/models/MesaCentroCap3.obj');
        this.tryLoadExternalOBJ('CafeteiraCap3', 'assets/models/CafeteiraCap3.obj');
        this.tryLoadExternalOBJ('RetratoCap3', 'assets/models/RetratoCap3.obj');

        // Texturas 3D dos arquivos .mtl do Blender
        this.meshTextures = {};
        this.meshPatterns = {};
        this.loadMeshTexture('Materiais', [
            'assets/textures/Couro.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Texturas/Couro.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Nova%20pasta/Couro.jpeg'
        ]);
        this.loadMeshTexture('sofa_leather', [
            'assets/textures/Couro.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Nova%20pasta/Couro.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Texturas/Couro.jpeg'
        ]);
        this.loadMeshTexture('Material', [
            'assets/textures/Tecido.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Texturas/Tecido.jpeg'
        ]);
        this.loadMeshTexture('desk_wood', [
            'assets/textures/Madeira.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Texturas/Madeira.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Nova%20pasta/Madeira.jpeg'
        ]);
        this.loadMeshTexture('coffee_table_wood', [
            'assets/textures/Madeira.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Nova%20pasta/Madeira.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Texturas/Madeira.jpeg'
        ]);
        this.loadMeshTexture('frame_wood', [
            'assets/textures/Madeira.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Nova%20pasta/Madeira.jpeg'
        ]);
        this.loadMeshTexture('guitar_wood', [
            'assets/textures/Madeira.jpeg',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Texturas/Madeira.jpeg'
        ]);
        this.loadMeshTexture('monitor_body', [
            'assets/textures/plano-de-fundo-texturizado-em-tecido-cinza-guingao_53876-101702.avif',
            'file:///C:/Users/kauan/Desktop/Projeto%20Blender/Texturas/plano-de-fundo-texturizado-em-tecido-cinza-guingao_53876-101702.avif'
        ]);

        this.initInput();
        this.lastTime = performance.now();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    loadMeshTexture(roleName, urls, index = 0) {
        if (index >= urls.length) return;
        const img = new Image();
        img.onload = () => {
            this.meshTextures[roleName] = img;
            try {
                const patCanvas = document.createElement('canvas');
                patCanvas.width = 64;
                patCanvas.height = 64;
                const pCtx = patCanvas.getContext('2d');
                pCtx.drawImage(img, 0, 0, 64, 64);
                this.meshPatterns[roleName] = this.ctx.createPattern(patCanvas, 'repeat');
            } catch (e) {}
        };
        img.onerror = () => {
            this.loadMeshTexture(roleName, urls, index + 1);
        };
        img.src = urls[index];
    }

    tryLoadExternalOBJ(modelId, objUrl) {
        if (typeof fetch !== 'function' || typeof window.parseOBJModel !== 'function') return;
        if (window.location && window.location.protocol === 'file:') return;
        fetch(objUrl)
            .then(r => r.ok ? r.text() : null)
            .then(txt => {
                if (txt && txt.includes('v ')) {
                    const parsed = window.parseOBJModel(txt, modelId);
                    if (parsed && parsed.verts.length > 0 && (!window.MODELS_3D || !window.MODELS_3D[modelId])) {
                        window.MODELS_3D = window.MODELS_3D || {};
                        window.MODELS_3D[modelId] = parsed;
                    }
                }
            })
            .catch(() => {});
    }

    toggleInspectPhone3D(targetModelId) {
        if (targetModelId && this.isInspectingPhone3D && this.inspectedModelId !== targetModelId) {
            this.inspectedModelId = targetModelId;
            this.inspectPhoneRot.zoom = 1.0;
            this.inspectPhoneRot.autoSpin = true;
        } else if (!targetModelId && this.isInspectingPhone3D) {
            // Cycle through the 5 Blender models before closing if clicked on HUD button, or close on ESC
            const idx = this.modelCatalog.indexOf(this.inspectedModelId);
            if (idx >= 0 && idx < this.modelCatalog.length - 1) {
                this.inspectedModelId = this.modelCatalog[idx + 1];
                this.inspectPhoneRot.zoom = 1.0;
                this.inspectPhoneRot.autoSpin = true;
            } else {
                this.isInspectingPhone3D = false;
            }
        } else {
            this.inspectedModelId = targetModelId || 'CelularCap1';
            this.isInspectingPhone3D = !this.isInspectingPhone3D;
            if (this.isInspectingPhone3D) {
                this.inspectPhoneRot.zoom = 1.0;
                this.inspectPhoneRot.autoSpin = true;
            }
        }
        const btn = document.getElementById('btn-inspect-phone');
        if (btn) {
            btn.textContent = this.isInspectingPhone3D ? `📦 ${this.inspectedModelId} (Próx ▸)` : '📦 Modelos 3D';
        }
        if (window.game && window.game.showToast) {
            const labels = {
                CelularCap1: '📱 Inspecionando CelularCap1.obj! Use [1..9] para alternar entre seus 9 modelos do Blender.',
                CamaCap1: '🛏️ Inspecionando CamaCap1.obj (Couro.jpeg & Tecido.jpeg)! Use [1..9] para alternar.',
                EscrivaninhaCap1: '🪑 Inspecionando EscrivaninhaCap1.obj (Madeira.jpeg - 3 gavetas e passa-cabos)!',
                MonitorCap1: '🖥️ Inspecionando MonitorCap1.obj (Tela Curva + Base e Suporte)!',
                ViolaoCap1: '🎸 Inspecionando ViolaoCap1.obj (1021 vértices · Caixa, boca, cavalete e cordas 3D)!',
                BancoCap2: '🏛️ Inspecionando BancoCap2.obj (Banco do Pátio da Faculdade - Cap. 2)!',
                'Quadro-AvisosCap2': '📌 Inspecionando Quadro-AvisosCap2.obj (Mural Acadêmico com 5 avisos fixados - Cap. 2)!',
                MesaUBSCap3: '🏥 Inspecionando MesaUBSCap3.obj (Balcão da Recepção da UBS com caneca/dispenser - Cap. 3)!',
                MesaPanfletosCap3: '📄 Inspecionando MesaPanfletosCap3.obj (Mesa de Guias com 5 panfletos do SUS - Cap. 3)!',
                SofaCap3: '🛋️ Inspecionando SofaCap3.obj (Sofá da Sala com textura Couro.jpeg)!',
                MesaCentroCap3: '🪵 Inspecionando MesaCentroCap3.obj (Mesa de Centro com textura Madeira.jpeg)!',
                CafeteiraCap3: '☕ Inspecionando CafeteiraCap3.obj (Cafeteira / Garrafa Térmica 3D - 544 vértices)!',
                RetratoCap3: '🖼️ Inspecionando RetratoCap3.obj (Porta-Retratos da Família com apoio traseiro)!'
            };
            window.game.showToast(
                this.isInspectingPhone3D ? (labels[this.inspectedModelId] || labels.CelularCap1) : '📦 Modo de inspeção 3D fechado.'
            );
        }
    }

    initInput() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = true;
            }
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }

            // Shortcuts to inspect any of the 13 Blender 3D Models ([1]-[9], [0], [-], [=], [P])
            if (key === '1' || key === 'c') {
                this.toggleInspectPhone3D('CelularCap1');
                return;
            }
            if (key === '2' || key === 'b') {
                this.toggleInspectPhone3D('CamaCap1');
                return;
            }
            if (key === '3') {
                this.toggleInspectPhone3D('EscrivaninhaCap1');
                return;
            }
            if (key === '4') {
                this.toggleInspectPhone3D('MonitorCap1');
                return;
            }
            if (key === '5') {
                this.toggleInspectPhone3D('ViolaoCap1');
                return;
            }
            if (key === '6') {
                this.toggleInspectPhone3D('BancoCap2');
                return;
            }
            if (key === '7') {
                this.toggleInspectPhone3D('Quadro-AvisosCap2');
                return;
            }
            if (key === '8') {
                this.toggleInspectPhone3D('MesaUBSCap3');
                return;
            }
            if (key === '9') {
                this.toggleInspectPhone3D('MesaPanfletosCap3');
                return;
            }
            if (key === '0') {
                this.toggleInspectPhone3D('SofaCap3');
                return;
            }
            if (key === '-') {
                this.toggleInspectPhone3D('MesaCentroCap3');
                return;
            }
            if (key === '=') {
                this.toggleInspectPhone3D('CafeteiraCap3');
                return;
            }
            if (key === 'p') {
                this.toggleInspectPhone3D('RetratoCap3');
                return;
            }
            if (key === 'escape' && this.isInspectingPhone3D) {
                this.isInspectingPhone3D = false;
                const btn = document.getElementById('btn-inspect-phone');
                if (btn) btn.textContent = '📦 Modelos 3D';
                return;
            }

            // Camera toggle with [V]
            if (key === 'v' && !this.isMovementLocked) {
                this.toggleCameraMode();
            }

            // Interaction key trigger: strictly 'e' key only
            if (key === 'e' && !this.isMovementLocked && Date.now() > this.interactionCooldown) {
                this.triggerInteraction();
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = false;
            }
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });

        // Ao trocar de janela (Alt+Tab) o keyup nunca chega: solta todas as teclas
        window.addEventListener('blur', () => this.releaseAllKeys());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.releaseAllKeys();
        });

        // D-Pad virtual: pressiona enquanto o dedo/mouse estiver no botão e
        // solta ao levantar, sair do botão ou o toque ser cancelado
        document.querySelectorAll('.vpad-btn[data-key]').forEach(btn => {
            const k = btn.dataset.key;
            const press = (e) => { e.preventDefault(); this.keys[k] = true; };
            const release = () => { this.keys[k] = false; };
            btn.style.touchAction = 'none'; // evita que o navegador cancele o toque achando que é rolagem
            btn.addEventListener('pointerdown', press);
            btn.addEventListener('pointerup', release);
            btn.addEventListener('pointerleave', release);
            btn.addEventListener('pointercancel', release);
            btn.addEventListener('contextmenu', (e) => e.preventDefault());
        });

        // Mouse look: Pointer Lock OR Click-and-drag on canvas
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.isInspectingPhone3D) {
                this.isDraggingLook = true;
                this.inspectPhoneRot.autoSpin = false;
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                return;
            }
            if (this.isMovementLocked) return;
            this.isDraggingLook = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isInspectingPhone3D && this.isDraggingLook) {
                const dx = e.clientX - this.lastMouseX;
                const dy = e.clientY - this.lastMouseY;
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                this.inspectPhoneRot.yaw += dx * 0.012;
                this.inspectPhoneRot.pitch = Math.max(-1.45, Math.min(1.45, this.inspectPhoneRot.pitch + dy * 0.012));
                return;
            }
            if (this.isMovementLocked) return;

            if (document.pointerLockElement === this.canvas) {
                this.player.yaw += e.movementX * 0.0032;
                this.player.pitch = Math.max(-0.65, Math.min(0.65, this.player.pitch - e.movementY * 0.0025));
            } else if (this.isDraggingLook) {
                const dx = e.clientX - this.lastMouseX;
                const dy = e.clientY - this.lastMouseY;
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                this.player.yaw += dx * 0.0055;
                this.player.pitch = Math.max(-0.65, Math.min(0.65, this.player.pitch - dy * 0.004));
            }
        });

        this.canvas.addEventListener('wheel', (e) => {
            if (!this.isInspectingPhone3D) return;
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.inspectPhoneRot.zoom = Math.max(0.55, Math.min(2.2, this.inspectPhoneRot.zoom + delta));
        }, { passive: false });

        window.addEventListener('mouseup', () => {
            this.isDraggingLook = false;
        });

        const inspectBtn = document.getElementById('btn-inspect-phone');
        if (inspectBtn) {
            inspectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleInspectPhone3D();
            });
        }

        // Double click canvas to toggle Pointer Lock for FPS mouse look
        this.canvas.addEventListener('dblclick', () => {
            if (this.isMovementLocked) return;
            if (document.pointerLockElement !== this.canvas && this.canvas.requestPointerLock) {
                this.canvas.requestPointerLock();
            } else if (document.exitPointerLock) {
                document.exitPointerLock();
            }
        });

        // Touch drag to look around on mobile
        let lastTouchX = null;
        let lastTouchY = null;
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.isMovementLocked || e.touches.length !== 1) return;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (this.isMovementLocked || lastTouchX === null || e.touches.length !== 1) return;
            const tx = e.touches[0].clientX;
            const ty = e.touches[0].clientY;
            this.player.yaw += (tx - lastTouchX) * 0.006;
            this.player.pitch = Math.max(-0.65, Math.min(0.65, this.player.pitch - (ty - lastTouchY) * 0.004));
            lastTouchX = tx;
            lastTouchY = ty;
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            lastTouchX = null;
            lastTouchY = null;
        });

        // Click on in-world interaction indicator prompt
        const promptEl = document.getElementById('interaction-prompt');
        if (promptEl) {
            promptEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isMovementLocked && Date.now() > this.interactionCooldown) {
                    this.triggerInteraction();
                }
            });
        }
    }

    releaseAllKeys() {
        Object.keys(this.keys).forEach(k => { this.keys[k] = false; });
        this.isDraggingLook = false;
    }

    toggleCameraMode() {
        this.cameraMode = this.cameraMode === 'fp' ? 'tp' : 'fp';
        const camBtn = document.getElementById('btn-camera-toggle');
        if (camBtn) {
            camBtn.textContent = this.cameraMode === 'fp' ? '👁️ 1ª Pessoa (3D)' : '🎥 3ª Pessoa (2.5D)';
        }
        if (window.game && window.game.showToast) {
            window.game.showToast(
                this.cameraMode === 'fp'
                    ? '👁️ Visão em 1ª Pessoa ativada! Sprites 2D com Billboard ativo.'
                    : '🎥 Visão 2.5D (3ª Pessoa estilo Pokémon) ativada!'
            );
        }
        return this.cameraMode;
    }

    // Convert 2D story coordinates (x: 60..900, y: 490..580) to 3D space (wx: -6..6, wz: -4..4)
    map2Dto3D(x2d, y2d) {
        const wx = ((x2d - 480) / 420) * 5.2;
        const wz = ((540 - (y2d || 530)) / 60) * 2.5 + 1.2;
        return { wx, wz };
    }

    buildScene3DForChapter(chapter) {
        const id = chapter.id;
        // Default room dimensions: X from -6.5 to 6.5, Z from -5.0 to 5.5, Y from 0 to 3.6
        const bounds = { minX: -5.6, maxX: 5.6, minZ: -4.2, maxZ: 4.2, wallHeight: 3.6 };
        const props = [];
        let theme = {
            skyTop: '#0f172a',
            skyBottom: '#1e293b',
            floorColor1: '#3b281e',
            floorColor2: '#473125',
            wallColor: '#1e293b',
            wallSideColor: '#172033',
            ceilingColor: '#0f172a',
            hasCeiling: true,
            gridSize: 1.0
        };

        if (id === 1) {
            // Capítulo 1: Quarto de Lucas à noite
            theme = {
                skyTop: '#090d16',
                skyBottom: '#162038',
                floorColor1: '#4a3222',
                floorColor2: '#3d281a',
                wallColor: '#1e2b45',
                wallSideColor: '#162036',
                ceilingColor: '#111827',
                hasCeiling: true
            };
            // Cama de Solteiro 3D exportada do Blender (CamaCap1.obj com texturas Couro.jpeg e Tecido.jpeg)
            props.push(
                {
                    name: 'Cama de Solteiro',
                    type: 'mesh',
                    modelId: 'CamaCap1',
                    x: 3.8,
                    y: 0,
                    z: 2.15,
                    w: 1.9,
                    h: 1.5,
                    d: 3.1,
                    scaleX: 1.85,
                    scaleY: 1.35,
                    scaleZ: 1.62,
                    yOffset: 0.275, // Em CamaCap1.obj a base fica em Y = -0.275, então +0.275 apoia os pés no chão (Y=0)
                    tilt: 0,
                    yaw: Math.PI,   // Encosta a cabeceira de couro (+Z no Blender) na parede do fundo (+Z)
                    vibrate: false,
                    color: '#4a2c18',
                    topColor: '#d6c5b3'
                },
                // Escrivaninha 3D exportada do Blender (EscrivaninhaCap1.obj com textura Madeira.jpeg, 3 gavetas e passa-cabos)
                {
                    name: 'Escrivaninha',
                    type: 'mesh',
                    modelId: 'EscrivaninhaCap1',
                    x: -2.45,
                    y: 0,
                    z: 2.35,
                    w: 3.0,
                    h: 0.85,
                    d: 1.2,
                    scaleX: 2.15,
                    scaleY: 1.14,
                    scaleZ: 1.85,
                    yOffset: 0.375, // Base em Y = -0.375 -> apoia no chão (Y = 0), tampo em Y = 0.855
                    tilt: 0,
                    yaw: Math.PI,   // Gavetas (-Z no Blender) viradas para a frente do quarto
                    vibrate: false,
                    color: '#5c3a21',
                    topColor: '#7c4d2b'
                },
                // Monitor / PC 3D exportado do Blender (MonitorCap1.obj sobre a escrivaninha)
                {
                    name: 'Monitor PC',
                    type: 'mesh',
                    modelId: 'MonitorCap1',
                    x: -3.2,
                    y: 0.855,
                    z: 2.38,
                    w: 0.90,
                    h: 0.70,
                    d: 0.25,
                    scaleX: 1.65,
                    scaleY: 1.65,
                    scaleZ: 1.65,
                    yOffset: 0.210, // Base do suporte em Y = -0.210 -> apoia sobre o tampo da escrivaninha (Y = 0.855)
                    tilt: 0,
                    yaw: Math.PI - 0.15, // Tela (-Z no Blender) voltada para Lucas
                    vibrate: false,
                    color: '#0f172a',
                    topColor: '#38bdf8'
                },
                // Smartphone 3D (CelularCap1.blend - 2cm x 4cm x 0.5cm) vibrando sobre a escrivaninha
                {
                    name: 'Smartphone',
                    type: 'mesh',
                    modelId: 'CelularCap1',
                    x: -1.55,
                    y: 0.86,
                    z: 2.02,
                    w: 0.50,
                    h: 0.28,
                    d: 0.95,
                    scale: 24.0,
                    tilt: 0.62,
                    yaw: -0.35,
                    vibrate: true,
                    color: '#38bdf8',
                    topColor: '#e0f2fe'
                },
                // Estante de livros
                { name: 'Estante', x: -5.1, y: 0, z: 0.0, w: 0.7, h: 2.4, d: 2.2, color: '#451a03', topColor: '#5c2406' },
                // Violão Acústico 3D exportado do Blender (ViolaoCap1.obj com textura Madeira.jpeg)
                {
                    name: 'Violão Acústico',
                    type: 'mesh',
                    modelId: 'ViolaoCap1',
                    x: 4.35,
                    y: 0.02,
                    z: -1.15,
                    w: 0.65,
                    h: 1.45,
                    d: 0.35,
                    scaleX: 1.48,
                    scaleY: 1.48,
                    scaleZ: 1.48,
                    yOffset: 0.4332, // Base do corpo em Y = -0.4332 -> apoia no suporte no chão
                    tilt: -0.18,
                    yaw: Math.PI - 0.55, // Boca e cavalete (-Z no Blender) virados para o centro do quarto
                    vibrate: false,
                    color: '#92400e',
                    topColor: '#d97706'
                }
            );
        } else if (id === 2) {
            // Capítulo 2: Pátio da Faculdade
            theme = {
                skyTop: '#0284c7',
                skyBottom: '#bae6fd',
                floorColor1: '#475569',
                floorColor2: '#64748b',
                wallColor: '#334155',
                wallSideColor: '#1e293b',
                ceilingColor: '#0284c7',
                hasCeiling: false
            };
            props.push(
                // Mural / Quadro de Avisos 3D exportado do Blender (Quadro-AvisosCap2.obj) à esquerda
                {
                    name: 'Mural Acadêmico',
                    type: 'mesh',
                    modelId: 'Quadro-AvisosCap2',
                    x: -3.7,
                    y: 0.72,
                    z: 2.05,
                    w: 2.1,
                    h: 1.5,
                    d: 0.35,
                    scaleX: 1.35,
                    scaleY: 1.45,
                    scaleZ: 1.35,
                    yOffset: 0.225, // Base em Y = -0.225 -> começa na altura de mural (0.72m do chão)
                    tilt: 0,
                    yaw: 0.22,      // Frente do quadro (+Z no Blender -> -Z no mundo) virada em 180° para o pátio / Lucas
                    vibrate: false,
                    color: '#78350f',
                    topColor: '#b45309'
                },
                // Bancos do Pátio 3D exportados do Blender (BancoCap2.obj)
                {
                    name: 'Banco Pátio 1',
                    type: 'mesh',
                    modelId: 'BancoCap2',
                    x: -1.55,
                    y: 0,
                    z: 2.3,
                    w: 2.0,
                    h: 0.55,
                    d: 0.7,
                    scaleX: 1.25,
                    scaleY: 1.22,
                    scaleZ: 1.25,
                    yOffset: 0.225, // Base dos pés em Y = -0.225 -> apoia no chão do pátio (Y = 0)
                    tilt: 0,
                    yaw: 0,
                    vibrate: false,
                    color: '#94a3b8',
                    topColor: '#cbd5e1'
                },
                {
                    name: 'Banco Pátio 2',
                    type: 'mesh',
                    modelId: 'BancoCap2',
                    x: 2.45,
                    y: 0,
                    z: 2.3,
                    w: 2.0,
                    h: 0.55,
                    d: 0.7,
                    scaleX: 1.25,
                    scaleY: 1.22,
                    scaleZ: 1.25,
                    yOffset: 0.225,
                    tilt: 0,
                    yaw: 0,
                    vibrate: false,
                    color: '#94a3b8',
                    topColor: '#cbd5e1'
                },
                // Canteiros verdes / árvores estilizadas
                { name: 'Jardineira Esq', x: -4.8, y: 0, z: -1.5, w: 1.2, h: 0.6, d: 2.4, color: '#15803d', topColor: '#22c55e' },
                { name: 'Jardineira Dir', x: 4.8, y: 0, z: -1.5, w: 1.2, h: 0.6, d: 2.4, color: '#15803d', topColor: '#22c55e' }
            );
        } else if (id === 3) {
            // Capítulo 3: Unidade Básica de Saúde (UBS)
            theme = {
                skyTop: '#0f172a',
                skyBottom: '#1e293b',
                floorColor1: '#cbd5e1',
                floorColor2: '#94a3b8',
                wallColor: '#0f766e',
                wallSideColor: '#115e59',
                ceilingColor: '#f1f5f9',
                hasCeiling: true
            };
            props.push(
                // Balcão da Recepção da UBS 3D exportado do Blender (MesaUBSCap3.obj)
                {
                    name: 'Balcão UBS',
                    type: 'mesh',
                    modelId: 'MesaUBSCap3',
                    x: -1.7,
                    y: 0,
                    z: 1.4,
                    w: 2.6,
                    h: 1.15,
                    d: 0.85,
                    scaleX: 1.18,
                    scaleY: 1.05,
                    scaleZ: 1.18,
                    yOffset: 0.50, // Base em Y = -0.50 -> apoia no piso da UBS (Y = 0)
                    tilt: 0,
                    yaw: 0,        // Girado 180°: Frente sólida voltada para Lucas (-Z) e vão interno voltado para Camila (+Z)
                    vibrate: false,
                    color: '#0284c7',
                    topColor: '#e2e8f0'
                },
                // Totem / Painel Cartaz SUS
                { name: 'Painel SUS', x: -0.2, y: 0, z: 3.5, w: 1.4, h: 2.1, d: 0.2, color: '#0369a1', topColor: '#38bdf8' },
                // Mesa de Folhetos / Guias 3D exportada do Blender (MesaPanfletosCap3.obj com 5 panfletos sobre o tampo)
                {
                    name: 'Mesa de Guias',
                    type: 'mesh',
                    modelId: 'MesaPanfletosCap3',
                    x: 3.1,
                    y: 0,
                    z: 1.7,
                    w: 1.65,
                    h: 0.88,
                    d: 1.0,
                    scaleX: 1.32,
                    scaleY: 1.15,
                    scaleZ: 1.32,
                    yOffset: 0.375, // Base dos pés em Y = -0.375 -> apoia no piso da UBS (Y = 0)
                    tilt: 0,
                    yaw: -0.25,
                    vibrate: false,
                    color: '#0d9488',
                    topColor: '#5eead4'
                },
                // Cadeiras de espera
                { name: 'Assentos de Espera', x: 3.6, y: 0, z: -1.6, w: 2.2, h: 0.55, d: 0.7, color: '#1d4ed8', topColor: '#3b82f6' }
            );
        } else if (id === 4) {
            // Capítulo 4: Sala de Estar da Família
            theme = {
                skyTop: '#1e1b4b',
                skyBottom: '#312e81',
                floorColor1: '#5c3a21',
                floorColor2: '#4a2c18',
                wallColor: '#451a03',
                wallSideColor: '#3b1502',
                ceilingColor: '#271c19',
                hasCeiling: true
            };
            props.push(
                // Sofá da Sala 3D exportado do Blender (SofaCap3.obj com textura Couro.jpeg) onde Ana está sentada
                {
                    name: 'Sofá da Sala',
                    type: 'mesh',
                    modelId: 'SofaCap3',
                    x: 0.85,
                    y: 0,
                    z: 2.35,
                    w: 2.8,
                    h: 1.05,
                    d: 1.15,
                    scaleX: 1.42,
                    scaleY: 1.12,
                    scaleZ: 1.22,
                    yOffset: 0.40, // Base em Y = -0.40 -> apoia no piso da sala (Y = 0)
                    tilt: 0,
                    yaw: Math.PI,  // Encosto voltado para a parede do fundo (+Z) e assento voltado para Lucas (-Z)
                    vibrate: false,
                    color: '#9a3412',
                    topColor: '#c2410c'
                },
                // Mesa de Centro 3D exportada do Blender (MesaCentroCap3.obj com textura Madeira.jpeg)
                {
                    name: 'Mesa de Café',
                    type: 'mesh',
                    modelId: 'MesaCentroCap3',
                    x: -0.1,
                    y: 0,
                    z: 0.88,
                    w: 1.35,
                    h: 0.58,
                    d: 0.82,
                    scaleX: 1.35,
                    scaleY: 0.72,
                    scaleZ: 1.35,
                    yOffset: 0.40, // Base dos pés em Y = -0.40 -> apoia no piso (Y = 0), tampo em Y = 0.576
                    tilt: 0,
                    yaw: 0,
                    vibrate: false,
                    color: '#451a03',
                    topColor: '#78350f'
                },
                // Cafeteira 3D exportada do Blender (CafeteiraCap3.obj) sobre a Mesa de Centro
                {
                    name: 'Cafeteira',
                    type: 'mesh',
                    modelId: 'CafeteiraCap3',
                    x: -0.1,
                    y: 0.58,
                    z: 0.82,
                    w: 0.36,
                    h: 0.45,
                    d: 0.36,
                    scaleX: 1.85,
                    scaleY: 1.85,
                    scaleZ: 1.85,
                    yOffset: 0.12, // Base em Y = -0.12 -> apoia sobre o tampo da Mesa de Centro (Y = 0.58)
                    tilt: 0,
                    yaw: -0.4,
                    vibrate: false,
                    color: '#dc2626',
                    topColor: '#1e293b'
                },
                // Aparador onde fica o Porta-Retratos
                { name: 'Aparador de Fotos', x: -2.2, y: 0, z: 2.55, w: 1.6, h: 0.85, d: 0.65, color: '#5c2406', topColor: '#92400e' },
                // Porta-Retratos da Família 3D exportado do Blender (RetratoCap3.obj) sobre o aparador
                {
                    name: 'Porta-Retratos da Família',
                    type: 'mesh',
                    modelId: 'RetratoCap3',
                    x: -2.2,
                    y: 0.85,
                    z: 2.42,
                    w: 0.42,
                    h: 0.52,
                    d: 0.25,
                    scaleX: 2.25,
                    scaleY: 2.25,
                    scaleZ: 2.25,
                    yOffset: 0.12, // Base em Y = -0.12 -> apoia sobre o aparador (Y = 0.85)
                    tilt: 0,
                    yaw: Math.PI - 0.25, // Foto frontal (-Z no Blender) virada para Lucas
                    vibrate: false,
                    color: '#78350f',
                    topColor: '#fde047'
                },
                // Rack de TV
                { name: 'Rack da Sala', x: 4.5, y: 0, z: 0.0, w: 0.8, h: 0.7, d: 2.6, color: '#292524', topColor: '#44403c' }
            );
        } else {
            // Capítulo 5: Campanha na Faculdade
            theme = {
                skyTop: '#0369a1',
                skyBottom: '#7dd3fc',
                floorColor1: '#334155',
                floorColor2: '#475569',
                wallColor: '#1e3a8a',
                wallSideColor: '#172554',
                ceilingColor: '#0284c7',
                hasCeiling: false
            };
            props.push(
                // Estande central da campanha
                { name: 'Estande Saúde & Ciência', x: 0.3, y: 0, z: 2.0, w: 3.2, h: 0.95, d: 1.1, color: '#0284c7', topColor: '#38bdf8' },
                // Colunas da tenda do estande
                { name: 'Tenda Esq', x: -1.2, y: 0.95, z: 2.0, w: 0.15, h: 1.6, d: 0.15, color: '#e2e8f0', topColor: '#ffffff' },
                { name: 'Tenda Dir', x: 1.8, y: 0.95, z: 2.0, w: 0.15, h: 1.6, d: 0.15, color: '#e2e8f0', topColor: '#ffffff' },
                { name: 'Topo Estande', x: 0.3, y: 2.45, z: 2.0, w: 3.5, h: 0.35, d: 1.4, color: '#0369a1', topColor: '#0ea5e9' }
            );
        }

        // Convert NPCs and Interactables to 3D world positions
        const npcs3D = (chapter.npcs || []).map((npc, idx) => {
            const pos = this.map2Dto3D(npc.x, npc.y);
            // Spread slightly in Z so the 3D depth feels rich
            const zOffset = (idx % 2 === 0) ? 0.45 : 0.85;
            return {
                ...npc,
                wx: pos.wx,
                wy: 0,
                wz: pos.wz + zOffset,
                height3D: 1.68
            };
        });

        const interactables3D = (chapter.interactables || []).map((obj) => {
            let pos = this.map2Dto3D(obj.x, obj.y);
            // Snap specific Chapter 1/2/3/4/5 objects onto their matching 3D furniture
            if (id === 1 && obj.id === 'celular') pos = { wx: -1.6, wz: 1.7 };
            if (id === 1 && obj.id === 'computador') pos = { wx: -3.2, wz: 1.7 };
            if (id === 1 && obj.id === 'violao') pos = { wx: 4.2, wz: -1.2 };
            if (id === 2 && obj.id === 'mural') pos = { wx: -3.6, wz: 1.7 };
            if (id === 3 && obj.id === 'cartaz_ze_gota') pos = { wx: -0.2, wz: 2.9 };
            if (id === 3 && obj.id === 'panfletos') pos = { wx: 3.1, wz: 1.4 };
            if (id === 4 && obj.id === 'porta_retratos') pos = { wx: -2.2, wz: 2.3 };
            if (id === 4 && obj.id === 'cafeteira') pos = { wx: -0.1, wz: 0.6 };
            if (id === 5 && obj.id === 'estande') pos = { wx: 0.3, wz: 1.4 };

            return {
                ...obj,
                wx: pos.wx,
                wy: 0.85,
                wz: pos.wz
            };
        });

        return { bounds, theme, props, npcs3D, interactables3D };
    }

    loadChapter(chapter) {
        this.currentChapter = chapter;
        this.backgroundImg = new Image();
        this.backgroundImg.src = chapter.background;

        this.scene3D = this.buildScene3DForChapter(chapter);

        // Place player at the entrance of the 3D scene looking toward the main action
        if (chapter.id === 1) {
            this.player.x = 1.6;
            this.player.z = -2.6;
            this.player.yaw = -0.45; // Looking toward the desk and phone
        } else {
            this.player.x = -2.2;
            this.player.z = -2.8;
            this.player.yaw = 0.35; // Looking toward the center/NPCs
        }
        this.player.pitch = 0;
        this.player.facing = 1;
        this.isMovementLocked = false;
        this.activeInteractable = null;
        this.activeNpc = null;
        this.interactionCooldown = Date.now() + 400;

        // Preload NPC images
        if (chapter.npcs) {
            chapter.npcs.forEach(npc => {
                if (!this.npcImages[npc.sprite]) {
                    const img = new Image();
                    img.src = npc.sprite;
                    this.npcImages[npc.sprite] = img;
                }
            });
        }
    }

    setMovementLock(locked) {
        this.isMovementLocked = locked;
        if (locked) {
            this.player.isMoving = false;
            this.isDraggingLook = false;
            if (document.pointerLockElement === this.canvas && document.exitPointerLock) {
                document.exitPointerLock();
            }
        }
    }

    triggerInteraction() {
        if (this.isMovementLocked || Date.now() < this.interactionCooldown) return;

        if (this.activeNpc) {
            this.interactionCooldown = Date.now() + 400;
            if (window.soundSystem) window.soundSystem.playClick();
            if (this.interactionCallback) {
                this.interactionCallback({ type: 'npc', data: this.activeNpc });
            }
        } else if (this.activeInteractable) {
            this.interactionCooldown = Date.now() + 400;
            if (window.soundSystem) window.soundSystem.playClick();
            if (this.interactionCallback) {
                this.interactionCallback({ type: 'interactable', data: this.activeInteractable });
            }
        }
    }

    update(dt) {
        if (!this.currentChapter || !this.scene3D || this.isMovementLocked || this.isInspectingPhone3D) {
            this.player.isMoving = false;
            return;
        }

        // 1. Camera Rotation (Q/R or ArrowLeft/ArrowRight)
        let turn = 0;
        if (this.keys.q || this.keys.arrowleft || this.keys.ArrowLeft) turn -= 1;
        if (this.keys.r || this.keys.arrowright || this.keys.ArrowRight) turn += 1;
        this.player.yaw += turn * this.player.turnSpeed * dt;

        // 2. First-Person / 3D Movement relative to Camera Yaw
        let forward = 0;
        let strafe = 0;

        if (this.keys.w || this.keys.arrowup || this.keys.ArrowUp) forward += 1;
        if (this.keys.s || this.keys.arrowdown || this.keys.ArrowDown) forward -= 1;
        if (this.keys.a) strafe -= 1;
        if (this.keys.d) strafe += 1;

        if (forward !== 0 && strafe !== 0) {
            forward *= 0.7071;
            strafe *= 0.7071;
        }

        if (strafe < 0) this.player.facing = -1;
        else if (strafe > 0) this.player.facing = 1;

        const sinY = Math.sin(this.player.yaw);
        const cosY = Math.cos(this.player.yaw);

        const vx = (sinY * forward + cosY * strafe) * this.player.speed;
        const vz = (cosY * forward - sinY * strafe) * this.player.speed;

        this.player.isMoving = (Math.abs(forward) > 0.01 || Math.abs(strafe) > 0.01);

        if (this.player.isMoving) {
            this.player.walkTimer += dt * 9.5;
            this.player.stepSoundTimer += dt;
            if (this.player.stepSoundTimer > 0.34) {
                this.player.stepSoundTimer = 0;
                if (window.soundSystem) window.soundSystem.playStep();
            }
        } else {
            this.player.walkTimer = 0;
            this.player.stepSoundTimer = 0;
        }

        // Apply movement & room boundary collision
        const b = this.scene3D.bounds;
        const nextX = Math.max(b.minX + 0.5, Math.min(b.maxX - 0.5, this.player.x + vx * dt));
        const nextZ = Math.max(b.minZ + 0.5, Math.min(b.maxZ - 0.6, this.player.z + vz * dt));

        this.player.x = nextX;
        this.player.z = nextZ;

        // 3. Proximity + Look-angle detection for Billboarded NPCs & Interactables
        this.activeNpc = null;
        let bestNpcScore = Infinity;

        for (let npc of this.scene3D.npcs3D) {
            const dx = npc.wx - this.player.x;
            const dz = npc.wz - this.player.z;
            const dist = Math.hypot(dx, dz);
            // Dot product with camera look vector so looking at the NPC prioritizes it
            const lookDot = (dx * sinY + dz * cosY) / (dist || 1);
            if (dist < 2.6 && lookDot > 0.15) {
                const score = dist - lookDot * 0.8;
                if (score < bestNpcScore) {
                    bestNpcScore = score;
                    this.activeNpc = npc;
                }
            }
        }

        this.activeInteractable = null;
        if (!this.activeNpc) {
            let bestObjScore = Infinity;
            for (let obj of this.scene3D.interactables3D) {
                const dx = obj.wx - this.player.x;
                const dz = obj.wz - this.player.z;
                const dist = Math.hypot(dx, dz);
                const lookDot = (dx * sinY + dz * cosY) / (dist || 1);
                if (dist < 2.5 && lookDot > 0.1) {
                    const score = dist - lookDot * 0.8;
                    if (score < bestObjScore) {
                        bestObjScore = score;
                        this.activeInteractable = obj;
                    }
                }
            }
        }

        this.updatePromptDOM();
    }

    // Active camera pose (1st Person vs 3rd Person 2.5D)
    getCameraPose() {
        const bobY = this.player.isMoving ? Math.sin(this.player.walkTimer) * 0.045 : 0;
        const bobX = this.player.isMoving ? Math.cos(this.player.walkTimer * 0.5) * 0.025 : 0;
        const sinY = Math.sin(this.player.yaw);
        const cosY = Math.cos(this.player.yaw);

        if (this.cameraMode === 'tp') {
            // 3rd person Pokémon-style camera slightly behind and above Lucas
            return {
                x: this.player.x - sinY * 2.1,
                y: 2.15,
                z: this.player.z - cosY * 2.1,
                yaw: this.player.yaw,
                pitch: this.player.pitch - 0.12
            };
        }

        return {
            x: this.player.x + cosY * bobX,
            y: this.player.eyeHeight + bobY,
            z: this.player.z - sinY * bobX,
            yaw: this.player.yaw,
            pitch: this.player.pitch
        };
    }

    // Transform world point (wx, wy, wz) into camera space (rx, ry, rz)
    worldToCamera(wx, wy, wz, cam) {
        const dx = wx - cam.x;
        const dy = wy - cam.y;
        const dz = wz - cam.z;

        const sinY = Math.sin(cam.yaw);
        const cosY = Math.cos(cam.yaw);

        // Rotate around Y (yaw)
        const rx = dx * cosY - dz * sinY;
        const rzYaw = dx * sinY + dz * cosY;

        // Rotate around X (pitch): positive pitch looks UP, negative pitch looks DOWN
        const sinP = Math.sin(cam.pitch);
        const cosP = Math.cos(cam.pitch);
        const ry = dy * cosP - rzYaw * sinP;
        const rz = dy * sinP + rzYaw * cosP;

        return { rx, ry, rz };
    }

    // Project camera-space point onto 2D canvas pixels
    cameraToScreen(rx, ry, rz) {
        const scale = this.focalLength / Math.max(this.zNear, rz);
        return {
            sx: this.width * 0.5 + rx * scale,
            sy: this.height * 0.5 - ry * scale,
            scale,
            rz
        };
    }

    // Clip a 3D polygon against the near camera plane (rz >= zNear) and project to 2D
    projectPolygon3D(worldVerts, cam) {
        const camVerts = worldVerts.map(v => this.worldToCamera(v.x, v.y, v.z, cam));
        const clipped = [];

        for (let i = 0; i < camVerts.length; i++) {
            const curr = camVerts[i];
            const prev = camVerts[(i + camVerts.length - 1) % camVerts.length];

            const currIn = curr.rz >= this.zNear;
            const prevIn = prev.rz >= this.zNear;

            if (currIn !== prevIn) {
                const t = (this.zNear - prev.rz) / (curr.rz - prev.rz);
                clipped.push({
                    rx: prev.rx + t * (curr.rx - prev.rx),
                    ry: prev.ry + t * (curr.ry - prev.ry),
                    rz: this.zNear
                });
            }
            if (currIn) {
                clipped.push(curr);
            }
        }

        if (clipped.length < 3) return null;
        return clipped.map(v => this.cameraToScreen(v.rx, v.ry, v.rz));
    }

    drawPolygon3D(worldVerts, fillStyle, strokeStyle, cam, lineWidth = 1) {
        const pts = this.projectPolygon3D(worldVerts, cam);
        if (!pts) return false;

        this.ctx.beginPath();
        this.ctx.moveTo(pts[0].sx, pts[0].sy);
        for (let i = 1; i < pts.length; i++) {
            this.ctx.lineTo(pts[i].sx, pts[i].sy);
        }
        this.ctx.closePath();

        if (fillStyle) {
            this.ctx.fillStyle = fillStyle;
            this.ctx.fill();
        }
        if (strokeStyle) {
            this.ctx.strokeStyle = strokeStyle;
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
        }
        return true;
    }

    updatePromptDOM() {
        const promptEl = document.getElementById('interaction-prompt');
        if (!promptEl || !this.scene3D) return;

        const target = this.activeNpc || this.activeInteractable;
        if (target && !this.isMovementLocked) {
            const cam = this.getCameraPose();
            const cPos = this.worldToCamera(target.wx, (target.height3D || 1.2) + 0.25, target.wz, cam);

            if (cPos.rz > this.zNear) {
                const proj = this.cameraToScreen(cPos.rx, cPos.ry, cPos.rz);
                promptEl.style.display = 'flex';
                promptEl.innerHTML = `<span class="prompt-key">E</span> <span class="prompt-text">${target.label}</span>`;
                const screenX = (proj.sx / this.width) * 100;
                const screenY = (proj.sy / this.height) * 100;
                promptEl.style.left = `${Math.max(15, Math.min(85, screenX))}%`;
                promptEl.style.top = `${Math.max(12, Math.min(82, screenY))}%`;
                return;
            }
        }
        promptEl.style.display = 'none';
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (!this.scene3D) return;

        const cam = this.getCameraPose();
        const { bounds, theme, props, npcs3D, interactables3D } = this.scene3D;

        // 1. Sky / Horizon Gradient
        const horizonY = this.height * 0.5 + Math.tan(cam.pitch) * this.focalLength;
        const skyGrad = this.ctx.createLinearGradient(0, 0, 0, Math.max(10, horizonY));
        skyGrad.addColorStop(0, theme.skyTop);
        skyGrad.addColorStop(1, theme.skyBottom);
        this.ctx.fillStyle = skyGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Ground base fill below horizon
        this.ctx.fillStyle = theme.floorColor1;
        this.ctx.fillRect(0, Math.max(0, horizonY), this.width, this.height);

        // 2. Render 3D Floor Tiles
        const step = 1.6;
        let tileRow = 0;
        for (let x = bounds.minX; x < bounds.maxX - 0.01; x += step) {
            let tileCol = 0;
            const x2 = Math.min(bounds.maxX, x + step);
            for (let z = bounds.minZ; z < bounds.maxZ - 0.01; z += step) {
                const z2 = Math.min(bounds.maxZ, z + step);
                const isAlt = (tileRow + tileCol) % 2 === 0;
                this.drawPolygon3D(
                    [
                        { x: x, y: 0, z: z },
                        { x: x2, y: 0, z: z },
                        { x: x2, y: 0, z: z2 },
                        { x: x, y: 0, z: z2 }
                    ],
                    isAlt ? theme.floorColor1 : theme.floorColor2,
                    'rgba(255, 255, 255, 0.05)',
                    cam
                );
                tileCol++;
            }
            tileRow++;
        }

        // 3. Render 3D Ceiling (if indoor scene)
        if (theme.hasCeiling) {
            this.drawPolygon3D(
                [
                    { x: bounds.minX, y: bounds.wallHeight, z: bounds.minZ },
                    { x: bounds.maxX, y: bounds.wallHeight, z: bounds.minZ },
                    { x: bounds.maxX, y: bounds.wallHeight, z: bounds.maxZ },
                    { x: bounds.minX, y: bounds.wallHeight, z: bounds.maxZ }
                ],
                theme.ceilingColor,
                'rgba(255,255,255,0.06)',
                cam
            );
        }

        // 4. Render 3D Room Walls
        const wallH = theme.hasCeiling ? bounds.wallHeight : 2.5;
        const walls = [
            // North Wall (+Z, main backdrop wall)
            {
                verts: [
                    { x: bounds.minX, y: 0, z: bounds.maxZ },
                    { x: bounds.maxX, y: 0, z: bounds.maxZ },
                    { x: bounds.maxX, y: wallH, z: bounds.maxZ },
                    { x: bounds.minX, y: wallH, z: bounds.maxZ }
                ],
                color: theme.wallColor,
                isBackdrop: true
            },
            // South Wall (-Z)
            {
                verts: [
                    { x: bounds.maxX, y: 0, z: bounds.minZ },
                    { x: bounds.minX, y: 0, z: bounds.minZ },
                    { x: bounds.minX, y: wallH, z: bounds.minZ },
                    { x: bounds.maxX, y: wallH, z: bounds.minZ }
                ],
                color: theme.wallColor
            },
            // West Wall (-X)
            {
                verts: [
                    { x: bounds.minX, y: 0, z: bounds.minZ },
                    { x: bounds.minX, y: 0, z: bounds.maxZ },
                    { x: bounds.minX, y: wallH, z: bounds.maxZ },
                    { x: bounds.minX, y: wallH, z: bounds.minZ }
                ],
                color: theme.wallSideColor
            },
            // East Wall (+X)
            {
                verts: [
                    { x: bounds.maxX, y: 0, z: bounds.maxZ },
                    { x: bounds.maxX, y: 0, z: bounds.minZ },
                    { x: bounds.maxX, y: wallH, z: bounds.minZ },
                    { x: bounds.maxX, y: wallH, z: bounds.maxZ }
                ],
                color: theme.wallSideColor
            }
        ];

        walls.forEach(w => {
            this.drawPolygon3D(w.verts, w.color, 'rgba(255, 255, 255, 0.1)', cam, 1.5);
        });

        // 5. Collect Depth-Sorted 3D Elements (3D Furniture Boxes + Billboarded NPCs + Interactables + 3rd-Person Player)
        const renderQueue = [];

        // Add 3D Furniture / Props (tabletop items with y >= 0.5 get slight closer distance bias so desk/table never occludes them)
        props.forEach(p => {
            const rawDistSq = (p.x - cam.x) ** 2 + ((p.y + p.h * 0.5) - cam.y) ** 2 + (p.z - cam.z) ** 2;
            const distSq = p.y >= 0.5 ? Math.max(0.01, rawDistSq - 6.0) : rawDistSq;
            renderQueue.push({
                type: 'prop3d',
                distSq,
                data: p
            });
        });

        // Add Billboarded NPCs
        npcs3D.forEach(npc => {
            const distSq = (npc.wx - cam.x) ** 2 + (npc.wz - cam.z) ** 2;
            renderQueue.push({
                type: 'billboard_npc',
                distSq,
                data: npc
            });
        });

        // Add Billboarded Interactable Indicators
        interactables3D.forEach(obj => {
            const distSq = (obj.wx - cam.x) ** 2 + (obj.wz - cam.z) ** 2;
            renderQueue.push({
                type: 'billboard_interactable',
                distSq,
                data: obj
            });
        });

        // If in 3rd-person 2.5D mode, add Lucas as a Billboard Sprite too!
        if (this.cameraMode === 'tp') {
            const distSq = (this.player.x - cam.x) ** 2 + (this.player.z - cam.z) ** 2;
            renderQueue.push({
                type: 'billboard_player',
                distSq
            });
        }

        // Painter's Algorithm: sort from farthest to nearest in 3D space
        renderQueue.sort((a, b) => b.distSq - a.distSq);

        renderQueue.forEach(item => {
            if (item.type === 'prop3d') {
                if (item.data.type === 'mesh') {
                    this.renderMesh3D(item.data, cam);
                } else {
                    this.renderBox3D(item.data, cam);
                }
            } else if (item.type === 'billboard_npc') {
                this.renderBillboardNpc(item.data, cam);
            } else if (item.type === 'billboard_interactable') {
                this.renderBillboardInteractable(item.data, cam);
            } else if (item.type === 'billboard_player') {
                this.renderBillboardPlayer(cam);
            }
        });

        // 6. Render First-Person HUD Overlay (Hands + Crosshair + Compass Hint)
        if (this.cameraMode === 'fp') {
            this.renderFirstPersonOverlay();
        }

        // 7. Render 3D Blender Model Inspector Overlay (when toggled via [C] or HUD button)
        if (this.isInspectingPhone3D) {
            this.renderInspectPhone3DOverlay();
        }
    }

    // Draw panoramic scene artwork framed on the main 3D wall so the room feels super detailed
    renderWallMural(bounds, wallH, cam) {
        if (!this.backgroundImg.complete || this.backgroundImg.naturalWidth === 0) return;

        const pts = this.projectPolygon3D([
            { x: bounds.minX + 0.6, y: 0.35, z: bounds.maxZ - 0.02 },
            { x: bounds.maxX - 0.6, y: 0.35, z: bounds.maxZ - 0.02 },
            { x: bounds.maxX - 0.6, y: wallH - 0.25, z: bounds.maxZ - 0.02 },
            { x: bounds.minX + 0.6, y: wallH - 0.25, z: bounds.maxZ - 0.02 }
        ], cam);

        if (!pts || pts.length < 3) return;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(pts[0].sx, pts[0].sy);
        for (let i = 1; i < pts.length; i++) {
            this.ctx.lineTo(pts[i].sx, pts[i].sy);
        }
        this.ctx.closePath();
        this.ctx.clip();

        // Compute bounding box of projected wall frame
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        pts.forEach(p => {
            if (p.sx < minX) minX = p.sx;
            if (p.sx > maxX) maxX = p.sx;
            if (p.sy < minY) minY = p.sy;
            if (p.sy > maxY) maxY = p.sy;
        });

        this.ctx.globalAlpha = 0.72;
        this.ctx.drawImage(this.backgroundImg, minX, minY, Math.max(1, maxX - minX), Math.max(1, maxY - minY));
        this.ctx.restore();
    }

    // Render a 3D volumetric box (furniture, desks, sofas, beds, counters)
    renderBox3D(box, cam) {
        const hx = box.w * 0.5;
        const hz = box.d * 0.5;
        const x0 = box.x - hx, x1 = box.x + hx;
        const y0 = box.y, y1 = box.y + box.h;
        const z0 = box.z - hz, z1 = box.z + hz;

        const faces = [
            // Front (-Z)
            { cx: box.x, cy: y0 + box.h * 0.5, cz: z0, color: box.color, verts: [{ x: x0, y: y0, z: z0 }, { x: x1, y: y0, z: z0 }, { x: x1, y: y1, z: z0 }, { x: x0, y: y1, z: z0 }] },
            // Back (+Z)
            { cx: box.x, cy: y0 + box.h * 0.5, cz: z1, color: box.color, verts: [{ x: x1, y: y0, z: z1 }, { x: x0, y: y0, z: z1 }, { x: x0, y: y1, z: z1 }, { x: x1, y: y1, z: z1 }] },
            // Left (-X)
            { cx: x0, cy: y0 + box.h * 0.5, cz: box.z, color: box.color, verts: [{ x: x0, y: y0, z: z1 }, { x: x0, y: y0, z: z0 }, { x: x0, y: y1, z: z0 }, { x: x0, y: y1, z: z1 }] },
            // Right (+X)
            { cx: x1, cy: y0 + box.h * 0.5, cz: box.z, color: box.color, verts: [{ x: x1, y: y0, z: z0 }, { x: x1, y: y0, z: z1 }, { x: x1, y: y1, z: z1 }, { x: x1, y: y1, z: z0 }] },
            // Top (+Y)
            { cx: box.x, cy: y1, cz: box.z, color: box.topColor || box.color, verts: [{ x: x0, y: y1, z: z0 }, { x: x1, y: y1, z: z0 }, { x: x1, y: y1, z: z1 }, { x: x0, y: y1, z: z1 }] }
        ];

        // Sort box faces back-to-front relative to camera
        faces.sort((a, b) => {
            const da = (a.cx - cam.x) ** 2 + (a.cy - cam.y) ** 2 + (a.cz - cam.z) ** 2;
            const db = (b.cx - cam.x) ** 2 + (b.cy - cam.y) ** 2 + (b.cz - cam.z) ** 2;
            return db - da;
        });

        faces.forEach(f => {
            this.drawPolygon3D(f.verts, f.color, 'rgba(0, 0, 0, 0.35)', cam, 1);
        });
    }

    // Compute material color & directional lighting for 3D Blender mesh faces (CelularCap1 & CamaCap1)
    getMeshFaceColor(role, nx, ny, nz, time) {
        // Directional light coming from upper-front-left
        const lx = -0.35, ly = 0.78, lz = -0.52;
        const dot = Math.max(-1, Math.min(1, nx * lx + ny * ly + nz * lz));
        const light = 0.55 + 0.45 * Math.max(0, dot);

        // Materiais de CamaCap1.mtl:
        // - 'Materiais' -> map_Kd Couro.jpeg (Estrutura e cabeceira de couro marrom escuro)
        if (role === 'Materiais') {
            const r = Math.round(48 + 44 * light);
            const g = Math.round(31 + 28 * light);
            const b = Math.round(21 + 19 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        // - 'Material' -> map_Kd Tecido.jpeg (Colchão chanfrado de tecido linho bege/creme)
        if (role === 'Material') {
            const r = Math.round(145 + 78 * light);
            const g = Math.round(132 + 72 * light);
            const b = Math.round(115 + 64 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }

        // Materiais de EscrivaninhaCap1.mtl (map_Kd Madeira.jpeg):
        if (role === 'desk_wood') {
            const r = Math.round(74 + 62 * light);
            const g = Math.round(46 + 40 * light);
            const b = Math.round(26 + 24 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }

        // Materiais de MonitorCap1.mtl:
        if (role === 'monitor_screen') {
            const pulse = 0.92 + 0.08 * Math.sin(time * 2.5);
            const r = Math.round(22 * pulse);
            const g = Math.round(148 * pulse);
            const b = Math.round(225 * pulse);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'monitor_body') {
            const v = Math.round(28 + 38 * light);
            return `rgb(${v}, ${v + 4}, ${v + 12})`;
        }

        // Materiais de ViolaoCap1.mtl (map_Kd Madeira.jpeg):
        if (role === 'guitar_wood') {
            const r = Math.round(115 + 88 * light);
            const g = Math.round(64 + 54 * light);
            const b = Math.round(24 + 26 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'guitar_neck' || role === 'guitar_bridge') {
            const r = Math.round(42 + 34 * light);
            const g = Math.round(24 + 20 * light);
            const b = Math.round(14 + 12 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'guitar_hole') {
            return '#090604';
        }
        if (role === 'guitar_strings') {
            const v = Math.round(175 + 75 * light);
            return `rgb(${v}, ${v - 8}, ${v - 22})`;
        }

        // Materiais de BancoCap2.obj (Banco do Pátio da Faculdade):
        if (role === 'bench_seat') {
            const r = Math.round(145 + 75 * light);
            const g = Math.round(154 + 75 * light);
            const b = Math.round(168 + 75 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'bench_legs') {
            const r = Math.round(82 + 56 * light);
            const g = Math.round(92 + 60 * light);
            const b = Math.round(108 + 65 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }

        // Materiais de Quadro-AvisosCap2.obj (Mural Acadêmico com 5 avisos):
        if (role === 'board_frame') {
            const r = Math.round(88 + 64 * light);
            const g = Math.round(52 + 40 * light);
            const b = Math.round(24 + 20 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'board_cork') {
            const r = Math.round(115 + 62 * light);
            const g = Math.round(82 + 46 * light);
            const b = Math.round(48 + 28 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'board_note_yellow') {
            return '#fde047';
        }
        if (role === 'board_note_blue') {
            return '#38bdf8';
        }
        if (role === 'board_note_pink') {
            return '#f472b6';
        }
        if (role === 'board_note_green') {
            return '#4ade80';
        }
        if (role === 'board_note_white') {
            return '#f8fafc';
        }

        // Materiais de MesaUBSCap3.obj (Balcão da Recepção da UBS + Caneca/Dispenser):
        if (role === 'ubs_counter_top') {
            const r = Math.round(175 + 75 * light);
            const g = Math.round(188 + 65 * light);
            const b = Math.round(202 + 52 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'ubs_counter_body') {
            const r = Math.round(8 + 22 * light);
            const g = Math.round(105 + 68 * light);
            const b = Math.round(148 + 85 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'ubs_mug') {
            const r = Math.round(165 + 85 * light);
            const g = Math.round(210 + 42 * light);
            const b = Math.round(225 + 30 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }

        // Materiais de MesaPanfletosCap3.obj (Mesa de Panfletos/Guias da UBS):
        if (role === 'pamphlet_table_top') {
            const r = Math.round(15 + 45 * light);
            const g = Math.round(128 + 75 * light);
            const b = Math.round(118 + 70 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'pamphlet_table_body') {
            const r = Math.round(12 + 32 * light);
            const g = Math.round(92 + 56 * light);
            const b = Math.round(88 + 52 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }

        // Materiais de SofaCap3.obj (Couro.jpeg), MesaCentroCap3.obj (Madeira.jpeg), CafeteiraCap3.obj e RetratoCap3.obj:
        if (role === 'sofa_leather') {
            const r = Math.round(115 + 75 * light);
            const g = Math.round(48 + 38 * light);
            const b = Math.round(24 + 22 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'coffee_table_wood' || role === 'frame_wood') {
            const r = Math.round(82 + 64 * light);
            const g = Math.round(48 + 40 * light);
            const b = Math.round(22 + 20 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'frame_photo') {
            const r = Math.round(180 + 65 * light);
            const g = Math.round(155 + 65 * light);
            const b = Math.round(120 + 55 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'coffee_maker_body') {
            const r = Math.round(145 + 85 * light);
            const g = Math.round(22 + 24 * light);
            const b = Math.round(22 + 24 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'coffee_maker_carafe') {
            const r = Math.round(28 + 38 * light);
            const g = Math.round(32 + 42 * light);
            const b = Math.round(42 + 52 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }

        // Materiais de CelularCap1:
        if (role === 'screen') {
            const pulse = 0.88 + 0.12 * Math.sin(time * 4.5);
            const r = Math.round(14 * pulse);
            const g = Math.round(165 * pulse);
            const b = Math.round(233 * pulse);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'notch') {
            return '#020617';
        }
        if (role === 'bezel') {
            const v = Math.round(18 + 16 * light);
            return `rgb(${v}, ${v + 6}, ${v + 18})`;
        }
        if (role === 'button') {
            const r = Math.round(145 + 75 * light);
            const g = Math.round(160 + 75 * light);
            const b = Math.round(185 + 65 * light);
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (role === 'port_hole') {
            // Deep cutout for USB-C port and the 5 speaker holes
            return '#030712';
        }
        // Default 'body': anodized dark titanium / slate-blue metallic chassis
        const r = Math.round(32 + 48 * light);
        const g = Math.round(48 + 64 * light);
        const b = Math.round(76 + 88 * light);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Render 3D Blender Mesh (CelularCap1, CamaCap1, etc.) in the 3D scene
    renderMesh3D(prop, cam) {
        const model = window.MODELS_3D && window.MODELS_3D[prop.modelId];
        if (!model || !model.verts || !model.faces) {
            this.renderBox3D(prop, cam);
            return;
        }

        const time = performance.now() * 0.001;
        const scale = prop.scale || 1.0;
        const sxScale = prop.scaleX !== undefined ? prop.scaleX : scale;
        const syScale = prop.scaleY !== undefined ? prop.scaleY : scale;
        const szScale = prop.scaleZ !== undefined ? prop.scaleZ : scale;
        const yOffset = prop.yOffset || 0;

        const tilt = prop.tilt !== undefined ? prop.tilt : 0;
        const propYaw = prop.yaw !== undefined ? prop.yaw : 0;
        const vibX = prop.vibrate ? Math.sin(time * 38) * 0.012 * (Math.sin(time * 3.2) > 0.2 ? 1 : 0) : 0;
        const vibRotZ = prop.vibrate ? Math.cos(time * 42) * 0.045 * (Math.sin(time * 3.2) > 0.2 ? 1 : 0) : 0;

        const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
        const cosY = Math.cos(propYaw), sinY = Math.sin(propYaw);
        const cosZ = Math.cos(vibRotZ), sinZ = Math.sin(vibRotZ);

        // Elevate tilted objects or apply yOffset so the mesh base rests cleanly on the surface/floor
        const baseY = prop.y + (tilt !== 0 ? (0.02 * syScale * Math.sin(Math.abs(tilt)) + 0.03) : 0);
        const baseX = prop.x + vibX;
        const baseZ = prop.z;

        // Soft glowing notification halo underneath vibrating objects (e.g., Smartphone)
        if (prop.vibrate) {
            const haloPts = [
                { x: baseX - 0.34, y: prop.y + 0.01, z: baseZ - 0.48 },
                { x: baseX + 0.34, y: prop.y + 0.01, z: baseZ - 0.48 },
                { x: baseX + 0.34, y: prop.y + 0.01, z: baseZ + 0.48 },
                { x: baseX - 0.34, y: prop.y + 0.01, z: baseZ + 0.48 }
            ];
            const pulseAlpha = 0.28 + 0.16 * Math.sin(time * 4.0);
            this.drawPolygon3D(haloPts, `rgba(56, 189, 248, ${pulseAlpha.toFixed(2)})`, '#38bdf8', cam, 1.2);
        }

        // Transform all vertices of the Blender mesh into world space and camera space
        const camVerts = new Array(model.verts.length);
        for (let i = 0; i < model.verts.length; i++) {
            const v = model.verts[i];
            let lx = v[0] * sxScale;
            let ly = (v[1] + yOffset) * syScale;
            let lz = -v[2] * szScale;

            // Vibration roll around Z
            const rxZ = lx * cosZ - ly * sinZ;
            const ryZ = lx * sinZ + ly * cosZ;

            // Tilt around X
            const ty = ryZ * cosT + lz * sinT;
            const tz = -ryZ * sinT + lz * cosT;
            const tx = rxZ;

            // Rotate around Y (propYaw)
            const wx = tx * cosY - tz * sinY + baseX;
            const wz = tx * sinY + tz * cosY + baseZ;
            const wy = ty + baseY;

            camVerts[i] = this.worldToCamera(wx, wy, wz, cam);
        }

        const drawableFaces = [];
        for (let i = 0; i < model.faces.length; i++) {
            const f = model.faces[i];
            const idxs = f.v;
            let sumX = 0, sumY = 0, sumZ = 0;
            let allBehind = true;

            for (let k = 0; k < idxs.length; k++) {
                const cv = camVerts[idxs[k]];
                sumX += cv.rx;
                sumY += cv.ry;
                sumZ += cv.rz;
                if (cv.rz >= this.zNear) allBehind = false;
            }
            if (allBehind) continue;

            const invN = 1 / idxs.length;
            const cx = sumX * invN;
            const cy = sumY * invN;
            const cz = sumZ * invN;

            // Rotate normal in the same local->world space
            const fn = f.n || [0, 1, 0];
            const nkx = fn[0], nky = fn[1], nkz = -fn[2];
            const nrx = nkx * cosZ - nky * sinZ;
            const nry = nkx * sinZ + nky * cosZ;
            const nty = nry * cosT + nkz * sinT;
            const ntz = -nry * sinT + nkz * cosT;
            const ntx = nrx;
            const wnx = ntx * cosY - ntz * sinY;
            const wnz = ntx * sinY + ntz * cosY;
            const wny = nty;

            // Small depth bias for thin surface details (notices on board, pamphlets on table, guitar strings)
            // so the large backing quad never occludes off-center details in Painter's algorithm
            let depthBias = 0;
            if (f.r && f.r.startsWith('board_note_')) depthBias = -1.2;
            else if (f.r === 'guitar_strings' || f.r === 'monitor_screen' || f.r === 'notch') depthBias = -0.35;

            drawableFaces.push({
                idxs,
                role: f.r,
                distSq: Math.max(0.001, (cx * cx + cy * cy + cz * cz) + depthBias),
                color: this.getMeshFaceColor(f.r, wnx, wny, wnz, time)
            });
        }

        // Painter's algorithm: sort faces back-to-front
        drawableFaces.sort((a, b) => b.distSq - a.distSq);

        this.ctx.save();
        for (let i = 0; i < drawableFaces.length; i++) {
            const df = drawableFaces[i];
            const idxs = df.idxs;

            // Clip against zNear if needed
            const polyCam = [];
            for (let k = 0; k < idxs.length; k++) {
                polyCam.push(camVerts[idxs[k]]);
            }

            const clipped = [];
            for (let k = 0; k < polyCam.length; k++) {
                const curr = polyCam[k];
                const prev = polyCam[(k + polyCam.length - 1) % polyCam.length];
                const currIn = curr.rz >= this.zNear;
                const prevIn = prev.rz >= this.zNear;

                if (currIn !== prevIn) {
                    const t = (this.zNear - prev.rz) / (curr.rz - prev.rz);
                    clipped.push({
                        rx: prev.rx + t * (curr.rx - prev.rx),
                        ry: prev.ry + t * (curr.ry - prev.ry),
                        rz: this.zNear
                    });
                }
                if (currIn) clipped.push(curr);
            }
            if (clipped.length < 3) continue;

            const p0 = this.cameraToScreen(clipped[0].rx, clipped[0].ry, clipped[0].rz);
            this.ctx.beginPath();
            this.ctx.moveTo(p0.sx, p0.sy);
            for (let k = 1; k < clipped.length; k++) {
                const pk = this.cameraToScreen(clipped[k].rx, clipped[k].ry, clipped[k].rz);
                this.ctx.lineTo(pk.sx, pk.sy);
            }
            this.ctx.closePath();
            this.ctx.fillStyle = df.color;
            this.ctx.fill();

            // Apply real texture pattern from CamaCap1.mtl (Couro.jpeg / Tecido.jpeg) if loaded
            const pat = this.meshPatterns && this.meshPatterns[df.role];
            if (pat) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.35;
                this.ctx.fillStyle = pat;
                this.ctx.fill();
                this.ctx.restore();
            }

            this.ctx.strokeStyle = df.color;
            this.ctx.lineWidth = 0.55;
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    // =========================================================================
    // CYLINDRICAL BILLBOARD RENDERING (Estilo Pokémon / HD-2D)
    // A imagem 2D do personagem SEMPRE gira em direção à câmera em 360°,
    // evitando que o personagem fique fino, achatado ou invisível de lado!
    // =========================================================================
    renderBillboardNpc(npc, cam) {
        const baseCam = this.worldToCamera(npc.wx, npc.wy, npc.wz, cam);
        if (baseCam.rz <= this.zNear) return;

        const topCam = this.worldToCamera(npc.wx, npc.wy + (npc.height3D || 1.65), npc.wz, cam);
        const baseScreen = this.cameraToScreen(baseCam.rx, baseCam.ry, baseCam.rz);
        const topScreen = this.cameraToScreen(topCam.rx, topCam.ry, topCam.rz);

        const spriteH = Math.max(24, Math.abs(baseScreen.sy - topScreen.sy));
        const img = this.npcImages[npc.sprite];
        const aspect = (img && img.complete && img.naturalWidth > 0)
            ? (img.naturalWidth / img.naturalHeight)
            : 0.55;

        // Because the sprite is a Cylindrical Billboard perpendicular to the camera ray,
        // its projected horizontal width is ALWAYS spriteH * aspect regardless of yaw angle!
        const spriteW = spriteH * aspect;

        // Subtle idle breathing animation
        const breathe = 1 + Math.sin(performance.now() * 0.004 + npc.wx) * 0.015;
        const drawH = spriteH * breathe;
        const drawW = spriteW;

        this.ctx.save();

        // 1. 3D Ground Shadow + Base Ring (Estilo Pokémon)
        const shadowRadiusX = Math.max(10, spriteW * 0.44);
        const shadowRadiusY = Math.max(4, shadowRadiusX * 0.35);

        this.ctx.beginPath();
        this.ctx.ellipse(baseScreen.sx, baseScreen.sy, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        this.ctx.fill();

        const isNear = (this.activeNpc && this.activeNpc.id === npc.id);
        if (isNear) {
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.lineWidth = 2.5;
            this.ctx.stroke();
        }

        // 2. Draw Billboarded 2D Character Sprite facing camera 100% straight
        if (img && img.complete && img.naturalWidth > 0) {
            this.ctx.drawImage(
                img,
                baseScreen.sx - drawW * 0.5,
                baseScreen.sy - drawH,
                drawW,
                drawH
            );
        } else {
            this.ctx.fillStyle = '#ec4899';
            this.ctx.fillRect(baseScreen.sx - drawW * 0.5, baseScreen.sy - drawH, drawW, drawH);
        }

        // 3. Floating 3D Name Tag above the Billboard Character
        const floatY = Math.sin(performance.now() * 0.005) * 4;
        const tagY = baseScreen.sy - drawH - 18 + floatY;

        this.ctx.font = isNear ? 'bold 13px "Outfit", sans-serif' : '600 11px "Outfit", sans-serif';
        this.ctx.textAlign = 'center';
        const tagWidth = Math.max(76, this.ctx.measureText(npc.name).width + 28);

        this.ctx.fillStyle = isNear ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.72)';
        this.ctx.beginPath();
        this.ctx.roundRect(baseScreen.sx - tagWidth * 0.5, tagY - 18, tagWidth, 24, 8);
        this.ctx.fill();

        this.ctx.strokeStyle = isNear ? '#38bdf8' : 'rgba(255, 255, 255, 0.25)';
        this.ctx.lineWidth = isNear ? 1.8 : 1;
        this.ctx.stroke();

        this.ctx.fillStyle = isNear ? '#38bdf8' : '#f8fafc';
        this.ctx.fillText(isNear ? `💬 ${npc.name}` : npc.name, baseScreen.sx, tagY - 2);

        this.ctx.restore();
    }

    // Render Billboarded 3D Interactable Marker
    renderBillboardInteractable(obj, cam) {
        const cPos = this.worldToCamera(obj.wx, obj.wy, obj.wz, cam);
        if (cPos.rz <= this.zNear) return;

        const screen = this.cameraToScreen(cPos.rx, cPos.ry, cPos.rz);
        const time = performance.now() * 0.004;
        const pulse = Math.sin(time) * 4;
        const isSelected = (this.activeInteractable && this.activeInteractable.id === obj.id);

        const radius = Math.max(6, Math.min(22, (this.focalLength / cPos.rz) * 0.08));

        this.ctx.save();

        // Outer glowing halo (always spherical/billboarded)
        this.ctx.beginPath();
        this.ctx.arc(screen.sx, screen.sy + pulse, radius * (isSelected ? 2.1 : 1.5), 0, Math.PI * 2);
        this.ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.38)' : 'rgba(56, 189, 248, 0.2)';
        this.ctx.fill();

        // Inner diamond / orb
        this.ctx.beginPath();
        this.ctx.arc(screen.sx, screen.sy + pulse, radius * 0.7, 0, Math.PI * 2);
        this.ctx.fillStyle = isSelected ? '#fde047' : '#38bdf8';
        this.ctx.shadowColor = isSelected ? '#facc15' : '#0284c7';
        this.ctx.shadowBlur = 12;
        this.ctx.fill();

        // Label tag when close or looking near it
        if (cPos.rz < 4.5) {
            this.ctx.font = 'bold 11px "Outfit", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = isSelected ? '#fde047' : '#bae6fd';
            this.ctx.fillText(`✦ ${obj.name}`, screen.sx, screen.sy - radius * 2.2 + pulse);
        }

        this.ctx.restore();
    }

    // Render Lucas as a Billboarded 2D Sprite when in 3rd-Person 2.5D Mode
    renderBillboardPlayer(cam) {
        const baseCam = this.worldToCamera(this.player.x, 0, this.player.z, cam);
        if (baseCam.rz <= this.zNear) return;

        const topCam = this.worldToCamera(this.player.x, 1.68, this.player.z, cam);
        const baseScreen = this.cameraToScreen(baseCam.rx, baseCam.ry, baseCam.rz);
        const topScreen = this.cameraToScreen(topCam.rx, topCam.ry, topCam.rz);

        const currentImg = this.player.isMoving ? this.playerWalkImg : this.playerStandImg;
        if (!currentImg.complete || currentImg.naturalWidth === 0) return;

        const spriteH = Math.max(30, Math.abs(baseScreen.sy - topScreen.sy));
        const spriteW = (currentImg.naturalWidth / currentImg.naturalHeight) * spriteH;
        const bobbing = this.player.isMoving ? Math.abs(Math.sin(this.player.walkTimer)) * 6 : 0;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(baseScreen.sx, baseScreen.sy, spriteW * 0.42, spriteW * 0.15, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        this.ctx.fill();

        this.ctx.translate(baseScreen.sx, baseScreen.sy - bobbing);
        this.ctx.scale(this.player.facing, 1);
        this.ctx.drawImage(currentImg, -spriteW * 0.5, -spriteH, spriteW, spriteH);
        this.ctx.restore();
    }

    // Render 1st-Person View Overlay (Crosshair + Subtle 1st-Person Hands/Smartphone Sway)
    renderFirstPersonOverlay() {
        const cx = this.width * 0.5;
        const cy = this.height * 0.5;
        const hasTarget = !!(this.activeNpc || this.activeInteractable);

        this.ctx.save();

        // 1. Center Crosshair (Mira 1ª Pessoa)
        this.ctx.strokeStyle = hasTarget ? '#38bdf8' : 'rgba(255, 255, 255, 0.45)';
        this.ctx.lineWidth = hasTarget ? 2.2 : 1.5;

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, hasTarget ? 8 : 4, 0, Math.PI * 2);
        this.ctx.stroke();

        if (hasTarget) {
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 2. First-Person Hand holding the 3D CelularCap1 Smartphone at bottom right with walk bobbing
        if (!this.isMovementLocked) {
            const swayX = this.player.isMoving ? Math.cos(this.player.walkTimer * 0.5) * 10 : Math.sin(performance.now() * 0.002) * 2;
            const swayY = this.player.isMoving ? Math.abs(Math.sin(this.player.walkTimer)) * 12 : Math.cos(performance.now() * 0.002) * 2;

            const handX = this.width - 175 + swayX;
            const handY = this.height - 115 + swayY;

            // Forearm / sleeve
            this.ctx.fillStyle = '#1e3a8a';
            this.ctx.beginPath();
            this.ctx.roundRect(handX + 22, handY + 55, 68, 90, 18);
            this.ctx.fill();

            // Hand / fingers
            this.ctx.fillStyle = '#e0ac69';
            this.ctx.beginPath();
            this.ctx.roundRect(handX + 8, handY + 34, 58, 38, 14);
            this.ctx.fill();

            // Render 3D Blender Model (CelularCap1) held in Lucas's right hand
            const model = window.MODELS_3D && window.MODELS_3D['CelularCap1'];
            if (model) {
                this.renderScreenSpaceMesh3D(model, {
                    screenX: handX + 28,
                    screenY: handY - 6,
                    scalePx: 3600,
                    rotX: 1.22,
                    rotY: -0.28 + Math.sin(performance.now() * 0.0018) * 0.08,
                    rotZ: -0.12
                });
            }
        }

        // 3. Subtle 360° Look + 3D Models Inspector Hint at bottom right
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
        this.ctx.beginPath();
        this.ctx.roundRect(this.width - 460, this.height - 34, 446, 24, 12);
        this.ctx.fill();

        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = '11px "Inter", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🖱️ Arraste: Girar 360° | Botão [📦 Modelos 3D] ou [1..9, 0, -, =, P]: Ver 13 Modelos Blender', this.width - 237, this.height - 18);

        this.ctx.restore();
    }

    // Render a 3D mesh directly at a 2D screen anchor with perspective (used for 1st-person hand & 3D inspector)
    renderScreenSpaceMesh3D(model, opts) {
        const time = performance.now() * 0.001;
        const sxCenter = opts.screenX;
        const syCenter = opts.screenY;
        const scalePx = opts.scalePx || 7200;
        const rxA = opts.rotX || 0;
        const ryA = opts.rotY || 0;
        const rzA = opts.rotZ || 0;

        const cosX = Math.cos(rxA), sinX = Math.sin(rxA);
        const cosY = Math.cos(ryA), sinY = Math.sin(ryA);
        const cosZ = Math.cos(rzA), sinZ = Math.sin(rzA);

        const camDist = opts.camDist || 0.14;
        const centerY = opts.centerY !== undefined ? opts.centerY : 0.0025;
        const tVerts = new Array(model.verts.length);

        for (let i = 0; i < model.verts.length; i++) {
            const v = model.verts[i];
            let x = v[0];
            let y = v[1] - centerY;
            let z = v[2];

            // Rotate Y (yaw)
            let x1 = x * cosY - z * sinY;
            let z1 = x * sinY + z * cosY;
            let y1 = y;

            // Rotate X (pitch)
            let y2 = y1 * cosX - z1 * sinX;
            let z2 = y1 * sinX + z1 * cosX;
            let x2 = x1;

            // Rotate Z (roll)
            let x3 = x2 * cosZ - y2 * sinZ;
            let y3 = x2 * sinZ + y2 * cosZ;
            let z3 = z2;

            const depth = Math.max(0.04, camDist + z3);
            const persp = (camDist / depth) * scalePx;

            tVerts[i] = {
                x: x3,
                y: y3,
                z: depth,
                sx: sxCenter + x3 * persp,
                sy: syCenter - y3 * persp
            };
        }

        const drawable = [];
        for (let i = 0; i < model.faces.length; i++) {
            const f = model.faces[i];
            const idxs = f.v;
            let sumX = 0, sumY = 0, sumZ = 0;
            for (let k = 0; k < idxs.length; k++) {
                const tv = tVerts[idxs[k]];
                sumX += tv.x;
                sumY += tv.y;
                sumZ += tv.z;
            }
            const inv = 1 / idxs.length;
            const cx = sumX * inv, cy = sumY * inv, cz = sumZ * inv;

            const fn = f.n || [0, 1, 0];
            let nx1 = fn[0] * cosY - fn[2] * sinY;
            let nz1 = fn[0] * sinY + fn[2] * cosY;
            let ny1 = fn[1];

            let ny2 = ny1 * cosX - nz1 * sinX;
            let nz2 = ny1 * sinX + nz1 * cosX;
            let nx2 = nx1;

            let nx3 = nx2 * cosZ - ny2 * sinZ;
            let ny3 = nx2 * sinZ + ny2 * cosZ;
            let nz3 = nz2;

            drawable.push({
                idxs,
                role: f.r,
                distSq: cx * cx + cy * cy + cz * cz,
                color: this.getMeshFaceColor(f.r, nx3, ny3, nz3, time)
            });
        }

        drawable.sort((a, b) => b.distSq - a.distSq);

        this.ctx.save();
        for (let i = 0; i < drawable.length; i++) {
            const df = drawable[i];
            const idxs = df.idxs;
            this.ctx.beginPath();
            this.ctx.moveTo(tVerts[idxs[0]].sx, tVerts[idxs[0]].sy);
            for (let k = 1; k < idxs.length; k++) {
                this.ctx.lineTo(tVerts[idxs[k]].sx, tVerts[idxs[k]].sy);
            }
            this.ctx.closePath();
            this.ctx.fillStyle = df.color;
            this.ctx.fill();

            const pat = this.meshPatterns && this.meshPatterns[df.role];
            if (pat) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.35;
                this.ctx.fillStyle = pat;
                this.ctx.fill();
                this.ctx.restore();
            }

            this.ctx.strokeStyle = df.color;
            this.ctx.lineWidth = 0.65;
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    // Interactive 360° 3D Inspector for all 5 Blender models (CelularCap1, CamaCap1, EscrivaninhaCap1, MonitorCap1, ViolaoCap1)
    renderInspectPhone3DOverlay() {
        const id = this.inspectedModelId || 'CelularCap1';
        const model = window.MODELS_3D && window.MODELS_3D[id];
        if (!model) return;

        if (this.inspectPhoneRot.autoSpin && !this.isDraggingLook) {
            this.inspectPhoneRot.yaw += 0.012;
        }
        if (this.keys.q || this.keys.ArrowLeft || this.keys.arrowleft || this.keys.a) {
            this.inspectPhoneRot.autoSpin = false;
            this.inspectPhoneRot.yaw -= 0.035;
        }
        if (this.keys.r || this.keys.ArrowRight || this.keys.arrowright || this.keys.d) {
            this.inspectPhoneRot.autoSpin = false;
            this.inspectPhoneRot.yaw += 0.035;
        }
        if (this.keys.w || this.keys.ArrowUp || this.keys.arrowup) {
            this.inspectPhoneRot.autoSpin = false;
            this.inspectPhoneRot.pitch = Math.max(-1.45, this.inspectPhoneRot.pitch - 0.03);
        }
        if (this.keys.s || this.keys.ArrowDown || this.keys.arrowdown) {
            this.inspectPhoneRot.autoSpin = false;
            this.inspectPhoneRot.pitch = Math.min(1.45, this.inspectPhoneRot.pitch + 0.03);
        }

        const cx = this.width * 0.5;
        const cy = this.height * 0.52;

        const metaMap = {
            CelularCap1: {
                title: '📱 INSPEÇÃO 3D [1] — CelularCap1.obj (Smartphone - Cap. 1)',
                sub: 'Dimensões Blender: 2.0 cm (L) × 4.0 cm (C) × 0.5 cm (A)  |  484 vértices · 711 faces',
                scalePx: 9800,
                camDist: 0.14,
                centerY: 0.0025,
                left: ['✦ Tela com Notch Superior e Borda (Bezel)', '✦ Cantos Arredondados (Bevel 3D)', '✦ Botões Laterais de Volume e Power (+X)'],
                right: ['✦ Entrada USB-C Escavada na Base (+Z)', '✦ 5 Furos Cilíndricos de Alto-Falante', '✦ Teclas [1..5] alternam os 5 modelos']
            },
            CamaCap1: {
                title: '🛏️ INSPEÇÃO 3D [2] — CamaCap1.obj (Cama de Solteiro - Cap. 1)',
                sub: 'Dimensões Blender: 1.0 m (L) × 1.9 m (C) × 1.19 m (A)  |  252 vértices · 251 faces · 2 Texturas',
                scalePx: 175,
                camDist: 3.2,
                centerY: 0.30,
                left: ['✦ Estrutura & Cabeceira (o Cube)', '✦ Material: Couro.jpeg (usemtl Materiais)', '✦ Pés e Moldura Elevada da Cama'],
                right: ['✦ Colchão Chanfrado Bevel 3D (o Cube.001)', '✦ Material: Tecido.jpeg (usemtl Material)', '✦ Teclas [1..5] alternam os 5 modelos']
            },
            EscrivaninhaCap1: {
                title: '🪑 INSPEÇÃO 3D [3] — EscrivaninhaCap1.obj (Escrivaninha - Cap. 1)',
                sub: 'Dimensões Blender: 1.40 m (L) × 0.65 m (P) × 0.75 m (A)  |  251 vértices · 157 faces · Madeira.jpeg',
                scalePx: 230,
                camDist: 2.6,
                centerY: 0.0,
                left: ['✦ Tampo com Furo Passa-Cabos Cilíndrico', '✦ Material: Madeira.jpeg (EscrivaninhaCap1.mtl)', '✦ Painel Lateral Esquerdo & Traseiro'],
                right: ['✦ Gaveteiro Direito com 3 Gavetas', '✦ Puxadores Arredondados Modelados em 3D', '✦ Teclas [1..5] alternam os 5 modelos']
            },
            MonitorCap1: {
                title: '🖥️ INSPEÇÃO 3D [4] — MonitorCap1.obj (Monitor PC - Cap. 1)',
                sub: 'Dimensões Blender: 0.55 m (L) × 0.12 m (P) × 0.42 m (A)  |  48 vértices · 41 faces · MonitorCap1.mtl',
                scalePx: 520,
                camDist: 1.2,
                centerY: 0.0,
                left: ['✦ Painel Widescreen com Moldura Chanfrada', '✦ Tela Central Recuada (-Z) Iluminada', '✦ Material: Tecido Cinza Guingão (.avif)'],
                right: ['✦ Braço Traseiro Articulado (+Z)', '✦ Base Retangular Estável de Apoio', '✦ Teclas [1..5] alternam os 5 modelos']
            },
            ViolaoCap1: {
                title: '🎸 INSPEÇÃO 3D [5] — ViolaoCap1.obj (Violão Acústico - Cap. 1)',
                sub: 'Dimensões Blender: 0.38 m (L) × 0.14 m (P) × 0.97 m (A)  |  1021 vértices · 716 faces · Madeira.jpeg',
                scalePx: 330,
                camDist: 1.8,
                centerY: 0.05,
                left: ['✦ Caixa Acústica Curva em Formato de 8', '✦ Boca Central Circular & Cordas 3D (o Cube.001)', '✦ Material: Madeira.jpeg (ViolaoCap1.mtl)'],
                right: ['✦ Braço, Escala e Tróculo Curvo Superior', '✦ Mão (Headstock) Chanfrada & Cavalete', '✦ Teclas [1..7] alternam os 7 modelos']
            },
            BancoCap2: {
                title: '🏛️ INSPEÇÃO 3D [6] — BancoCap2.obj (Banco do Pátio - Cap. 2)',
                sub: 'Dimensões Blender: 1.60 m (L) × 0.55 m (P) × 0.45 m (A)  |  56 vértices · 38 faces · BancoCap2.mtl',
                scalePx: 220,
                camDist: 2.5,
                centerY: 0.0,
                left: ['✦ Assento Superior em Laje Retangular', '✦ Pés Laterais Duplos Recuados', '✦ Travessa Estrutural Inferior Central'],
                right: ['✦ Posicionado em Dupla no Pátio (Cap. 2)', '✦ Ponto de Encontro de Marina e Raphael', '✦ Teclas [1..7] alternam os 7 modelos']
            },
            'Quadro-AvisosCap2': {
                title: '📌 INSPEÇÃO 3D [7] — Quadro-AvisosCap2.obj (Mural - Cap. 2)',
                sub: 'Dimensões Blender: 1.60 m (L) × 0.05 m (P) × 0.96 m (A)  |  64 vértices · 47 faces · Quadro-AvisosCap2.mtl',
                scalePx: 230,
                camDist: 2.4,
                centerY: 0.25,
                left: ['✦ Moldura Externa Chanfrada (Bevel 3D)', '✦ Painel Interno de Cortiça Recuado (-Z)', '✦ 5 Folhetos/Avisos Modelados em 3D'],
                right: ['✦ Avisos Inclinados em Diferentes Ângulos', '✦ Objeto Interativo do Pátio (Cap. 2)', '✦ Teclas [1..9] alternam os 9 modelos']
            },
            MesaUBSCap3: {
                title: '🏥 INSPEÇÃO 3D [8] — MesaUBSCap3.obj (Balcão da UBS - Cap. 3)',
                sub: 'Dimensões Blender: 2.20 m (L) × 0.70 m (P) × 1.14 m (A)  |  339 vértices · 311 faces · MesaUBSCap3.mtl',
                scalePx: 185,
                camDist: 2.8,
                centerY: 0.05,
                left: ['✦ Balcão de Atendimento da Recepção SUS', '✦ Vão Interno Recuado p/ Profissional', '✦ Caneca / Dispenser Cilíndrico no Tampo'],
                right: ['✦ Alça Curva Modelada em Malha 3D', '✦ Posto da Enfermeira Camila (Cap. 3)', '✦ Teclas [1..9] alternam os 9 modelos']
            },
            MesaPanfletosCap3: {
                title: '📄 INSPEÇÃO 3D [9] — MesaPanfletosCap3.obj (Mesa de Guias - Cap. 3)',
                sub: 'Dimensões Blender: 1.25 m (L) × 0.73 m (P) × 0.76 m (A)  |  36 vértices · 19 faces · MesaPanfletosCap3.mtl',
                scalePx: 260,
                camDist: 2.2,
                centerY: 0.0,
                left: ['✦ Mesa de Apoio de Folhetos da UBS', '✦ 5 Panfletos do Sarampo Modelados no Tampo', '✦ Pés Chanfrados com Travessa Estrutural'],
                right: ['✦ Folhetos Espalhados em Ângulos Reais', '✦ Objeto Interativo Educativo (Cap. 3)', '✦ Clique em 📦 Modelos 3D p/ avançar (13 modelos)']
            },
            SofaCap3: {
                title: '🛋️ INSPEÇÃO 3D [0] — SofaCap3.obj (Sofá da Sala)',
                sub: 'Dimensões Blender: 2.00 m (L) × 0.95 m (P) × 0.96 m (A)  |  146 vértices · 106 faces · Couro.jpeg',
                scalePx: 195,
                camDist: 2.6,
                centerY: 0.05,
                left: ['✦ Assento Duplo Acolchoado com Braços', '✦ Encosto Superior Chanfrado (Bevel 3D)', '✦ Material: Couro.jpeg (SofaCap3.mtl)'],
                right: ['✦ Sofá Onde a Irmã Ana Está Sentada', '✦ Pés e Base Estrutural Modelados', '✦ Clique em 📦 Modelos 3D p/ avançar (13 modelos)']
            },
            MesaCentroCap3: {
                title: '🪵 INSPEÇÃO 3D [-] — MesaCentroCap3.obj (Mesa de Centro)',
                sub: 'Dimensões Blender: 1.00 m (L) × 0.60 m (P) × 0.80 m (A)  |  32 vértices · 22 faces · Madeira.jpeg',
                scalePx: 290,
                camDist: 2.0,
                centerY: 0.0,
                left: ['✦ Tampo Superior Retangular em Madeira', '✦ Material: Madeira.jpeg (MesaCentroCap3.mtl)', '✦ 4 Pés Estruturais com Vão Central'],
                right: ['✦ Apoio da Cafeteira no Centro da Sala', '✦ Proporção Fiel ao Guia do Blender', '✦ Clique em 📦 Modelos 3D p/ avançar (13 modelos)']
            },
            CafeteiraCap3: {
                title: '☕ INSPEÇÃO 3D [=] — CafeteiraCap3.obj (Cafeteira da Sala)',
                sub: 'Dimensões Blender: 19 cm (L) × 18 cm (P) × 24 cm (A)  |  544 vértices · 491 faces · CafeteiraCap3.mtl',
                scalePx: 1050,
                camDist: 0.55,
                centerY: 0.0,
                left: ['✦ Corpo Principal & Base de Aquecimento', '✦ Jarra / Reservatório Cilíndrico Detalhado', '✦ Alça Lateral Ergonômica em Malha 3D'],
                right: ['✦ Posicionada Sobre a Mesa de Centro', '✦ Objeto Interativo "Servir Café"', '✦ Clique em 📦 Modelos 3D p/ avançar (13 modelos)']
            },
            RetratoCap3: {
                title: '🖼️ INSPEÇÃO 3D [P] — RetratoCap3.obj (Porta-Retratos da Família)',
                sub: 'Dimensões Blender: 18 cm (L) × 10 cm (P) × 23 cm (A)  |  24 vértices · 17 faces · RetratoCap3.mtl',
                scalePx: 1150,
                camDist: 0.50,
                centerY: 0.0,
                left: ['✦ Moldura Retangular Inclinada', '✦ Painel Frontal Recuado para a Foto', '✦ Pé de Apoio Traseiro (Gravata) em 3D'],
                right: ['✦ Posicionado Sobre o Aparador da Sala', '✦ Objeto Interativo "Fotos de Família"', '✦ Clique em 📦 Modelos 3D p/ avançar (13 modelos)']
            }
        };

        const info = metaMap[id] || metaMap.CelularCap1;

        this.ctx.save();

        // Dark backdrop with subtle radial spotlight
        const grad = this.ctx.createRadialGradient(cx, cy, 30, cx, cy, 420);
        grad.addColorStop(0, 'rgba(15, 23, 42, 0.88)');
        grad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Header badge
        this.ctx.fillStyle = 'rgba(14, 165, 233, 0.16)';
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.roundRect(cx - 310, 22, 620, 58, 14);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#38bdf8';
        this.ctx.font = 'bold 16px "Outfit", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(info.title, cx, 46);

        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.font = '12px "Inter", sans-serif';
        this.ctx.fillText(info.sub, cx, 67);

        // Render the 3D mesh in the center
        this.renderScreenSpaceMesh3D(model, {
            screenX: cx,
            screenY: cy,
            scalePx: info.scalePx * this.inspectPhoneRot.zoom,
            camDist: info.camDist,
            centerY: info.centerY,
            rotX: this.inspectPhoneRot.pitch,
            rotY: this.inspectPhoneRot.yaw,
            rotZ: 0
        });

        this.ctx.font = '12px "Inter", sans-serif';
        this.ctx.textAlign = 'left';
        info.left.forEach((txt, idx) => {
            const by = 180 + idx * 44;
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
            this.ctx.beginPath();
            this.ctx.roundRect(28, by, 275, 34, 8);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = '#bae6fd';
            this.ctx.fillText(txt, 40, by + 21);
        });

        info.right.forEach((txt, idx) => {
            const by = 180 + idx * 44;
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
            this.ctx.beginPath();
            this.ctx.roundRect(this.width - 303, by, 275, 34, 8);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = '#bae6fd';
            this.ctx.fillText(txt, this.width - 291, by + 21);
        });

        // Footer controls bar
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        this.ctx.beginPath();
        this.ctx.roundRect(cx - 380, this.height - 52, 760, 34, 10);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#f8fafc';
        this.ctx.textAlign = 'center';
        this.ctx.font = '11.5px "Inter", sans-serif';
        this.ctx.fillText('🖱️ 360° • [1..5] Cap.1 • [6..7] Cap.2 • [8..9] UBS • [0] Sofá [-] Mesa [=] Cafeteira [P] Retrato • [ESC]', cx, this.height - 31);

        this.ctx.restore();
    }

    loop(timestamp) {
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame(this.loop);
    }
}
