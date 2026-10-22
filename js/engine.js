// 2D Canvas & Exploration Engine with WASD Movement
class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 960;
        this.height = 540;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.keys = {
            w: false, a: false, s: false, d: false,
            ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
            e: false, ' ': false
        };

        this.player = {
            x: 180,
            y: 530,
            vx: 0,
            vy: 0,
            speed: 3.2,
            facing: 1, // 1 for right, -1 for left
            isMoving: false,
            walkTimer: 0,
            stepSoundTimer: 0,
            width: 72,
            height: 140
        };

        this.currentChapter = null;
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

        this.initInput();
        this.lastTime = performance.now();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    initInput() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = true;
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.keys[e.key] = true;
            }
            // Interaction key trigger: strictly 'e' key only (Space & Enter are reserved for dialogue/UI)
            if (key === 'e' && !this.isMovementLocked && Date.now() > this.interactionCooldown) {
                this.triggerInteraction();
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = false;
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.keys[e.key] = false;
            }
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

        // Click / Touch canvas to interact if near an item
        this.canvas.addEventListener('click', (e) => {
            if (!this.isMovementLocked && Date.now() > this.interactionCooldown && (this.activeNpc || this.activeInteractable)) {
                this.triggerInteraction();
            }
        });
    }

    loadChapter(chapter) {
        this.currentChapter = chapter;
        this.backgroundImg = new Image();
        this.backgroundImg.src = chapter.background;

        this.player.x = chapter.playerStart.x;
        this.player.y = chapter.playerStart.y;
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
        if (!this.currentChapter || this.isMovementLocked) {
            this.player.isMoving = false;
            return;
        }

        let dx = 0;
        let dy = 0;

        if (this.keys.a || this.keys.arrowleft) dx -= 1;
        if (this.keys.d || this.keys.arrowright) dx += 1;
        if (this.keys.w || this.keys.arrowup) dy -= 1;
        if (this.keys.s || this.keys.arrowdown) dy += 1;

        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        if (dx < 0) this.player.facing = -1;
        else if (dx > 0) this.player.facing = 1;

        this.player.isMoving = (dx !== 0 || dy !== 0);

        if (this.player.isMoving) {
            this.player.walkTimer += dt * 10;
            this.player.stepSoundTimer += dt;
            if (this.player.stepSoundTimer > 0.3) {
                this.player.stepSoundTimer = 0;
                if (window.soundSystem) window.soundSystem.playStep();
            }
        } else {
            this.player.walkTimer = 0;
            this.player.stepSoundTimer = 0;
        }

        const nextX = this.player.x + dx * this.player.speed * (dt * 60);
        const nextY = this.player.y + dy * this.player.speed * (dt * 60);

        const bounds = this.currentChapter.walkBounds || { minX: 50, maxX: 900, minY: 480, maxY: 580 };
        this.player.x = Math.max(bounds.minX, Math.min(bounds.maxX, nextX));
        this.player.y = Math.max(bounds.minY, Math.min(bounds.maxY, nextY));

        // Proximity detection for NPCs
        this.activeNpc = null;
        if (this.currentChapter.npcs) {
            for (let npc of this.currentChapter.npcs) {
                const dist = Math.hypot(this.player.x - npc.x, this.player.y - npc.y);
                if (dist < 80) {
                    this.activeNpc = npc;
                    break;
                }
            }
        }

        // Proximity detection for interactables
        this.activeInteractable = null;
        if (!this.activeNpc && this.currentChapter.interactables) {
            for (let obj of this.currentChapter.interactables) {
                const dist = Math.hypot(this.player.x - obj.x, this.player.y - obj.y);
                if (dist < 80) {
                    this.activeInteractable = obj;
                    break;
                }
            }
        }

        // Update interaction prompt in DOM
        this.updatePromptDOM();
    }

    updatePromptDOM() {
        const promptEl = document.getElementById('interaction-prompt');
        if (!promptEl) return;

        if ((this.activeNpc || this.activeInteractable) && !this.isMovementLocked) {
            const item = this.activeNpc || this.activeInteractable;
            promptEl.style.display = 'flex';
            promptEl.innerHTML = `<span class="prompt-key">E</span> <span class="prompt-text">${item.label}</span>`;
            // Position prompt relative to target or center bottom
            const screenX = (item.x / this.width) * 100;
            const screenY = ((item.y - 130) / this.height) * 100;
            promptEl.style.left = `${Math.max(15, Math.min(85, screenX))}%`;
            promptEl.style.top = `${Math.max(10, Math.min(80, screenY))}%`;
        } else {
            promptEl.style.display = 'none';
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw background
        if (this.backgroundImg.complete && this.backgroundImg.naturalWidth > 0) {
            this.ctx.drawImage(this.backgroundImg, 0, 0, this.width, this.height);
        } else {
            this.ctx.fillStyle = '#1e1c2e';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Subtle ground shadow for objects & characters
        const renderList = [];

        // Add interactable indicators
        if (this.currentChapter && this.currentChapter.interactables) {
            this.currentChapter.interactables.forEach(obj => {
                renderList.push({
                    type: 'interactable',
                    y: obj.y,
                    data: obj
                });
            });
        }

        // Add NPCs
        if (this.currentChapter && this.currentChapter.npcs) {
            this.currentChapter.npcs.forEach(npc => {
                renderList.push({
                    type: 'npc',
                    y: npc.y,
                    data: npc
                });
            });
        }

        // Add Player
        renderList.push({
            type: 'player',
            y: this.player.y
        });

        // Depth sort by Y coordinate
        renderList.sort((a, b) => a.y - b.y);

        renderList.forEach(item => {
            if (item.type === 'interactable') {
                this.renderInteractable(item.data);
            } else if (item.type === 'npc') {
                this.renderNpc(item.data);
            } else if (item.type === 'player') {
                this.renderPlayer();
            }
        });
    }

    renderInteractable(obj) {
        const time = performance.now() * 0.004;
        const pulse = Math.sin(time) * 4;

        // Ground highlight
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.ellipse(obj.x, obj.y + 10, 24 + pulse, 10 + pulse * 0.4, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        this.ctx.fill();

        // Pulsing sparkle icon above
        this.ctx.beginPath();
        this.ctx.arc(obj.x, obj.y - 40 + pulse, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.shadowColor = '#0284c7';
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.restore();
    }

    renderNpc(npc) {
        const img = this.npcImages[npc.sprite];
        this.ctx.save();

        // Ground contact shadow
        this.ctx.beginPath();
        this.ctx.ellipse(npc.x, npc.y + 12, 26, 9, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        this.ctx.fill();

        if (img && img.complete && img.naturalWidth > 0) {
            const h = 130;
            const w = (img.naturalWidth / img.naturalHeight) * h;
            this.ctx.drawImage(img, npc.x - w / 2, npc.y - h + 15, w, h);
        } else {
            // Fallback placeholder shape
            this.ctx.fillStyle = '#ec4899';
            this.ctx.fillRect(npc.x - 20, npc.y - 110, 40, 110);
        }

        // Name tag & Speech bubble prompt if near
        const isNear = (this.activeNpc === npc);
        const floatY = Math.sin(performance.now() * 0.005) * 3;

        this.ctx.font = 'bold 12px "Outfit", sans-serif';
        this.ctx.textAlign = 'center';

        if (isNear) {
            // Glowing bubble
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            this.ctx.beginPath();
            this.ctx.roundRect(npc.x - 45, npc.y - 145 + floatY, 90, 26, 6);
            this.ctx.fill();
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            this.ctx.fillStyle = '#38bdf8';
            this.ctx.fillText(`💬 ${npc.name}`, npc.x, npc.y - 128 + floatY);
        }

        this.ctx.restore();
    }

    renderPlayer() {
        this.ctx.save();

        // Ground shadow
        this.ctx.beginPath();
        this.ctx.ellipse(this.player.x, this.player.y + 14, 28, 10, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        this.ctx.fill();

        const currentImg = this.player.isMoving ? this.playerWalkImg : this.playerStandImg;

        if (currentImg.complete && currentImg.naturalWidth > 0) {
            const h = 135;
            const w = (currentImg.naturalWidth / currentImg.naturalHeight) * h;
            const bobbing = this.player.isMoving ? Math.sin(this.player.walkTimer) * 4 : 0;

            this.ctx.translate(this.player.x, this.player.y + bobbing);
            this.ctx.scale(this.player.facing, 1);
            this.ctx.drawImage(currentImg, -w / 2, -h + 16, w, h);
        }

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
