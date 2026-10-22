// Game State Controller & Narrative Orchestrator
class GameManager {
    constructor() {
        this.engine = null;
        this.currentChapterIndex = 0;
        this.stats = {
            knowledge: 3,        // Conhecimento sobre Vacinação (0 a 10)
            verification: 2,     // Hábito de Checagem (0 a 10)
            influence: 3,        // Influência Educativa Positiva (0 a 10)
            vaccineChecked: false // Situação Vacinal Conferida na UBS
        };
        this.flags = {};

        // Dialogue state
        this.activeDialogueQueue = [];
        this.currentDialogueIndex = 0;
        this.typewriterTimer = null;
        this.isTyping = false;
        this.currentFullText = "";

        this.initDOM();
    }

    start() {
        this.engine = new GameEngine('gameCanvas');
        this.engine.interactionCallback = this.handleInteraction.bind(this);
        this.updateHUD();
    }

    initDOM() {
        // Menu Play button
        const startBtn = document.getElementById('btn-start-game');
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startBtn.disabled = true;
            startBtn.blur();
            window.soundSystem.playClick();
            window.soundSystem.startBgm();
            this.hideScreen('menu-screen');
            this.startChapter(0);
        });

        // About / Controls Modal
        document.getElementById('btn-about').addEventListener('click', (e) => {
            e.stopPropagation();
            window.soundSystem.playClick();
            if (this.engine) this.engine.setMovementLock(true);
            document.getElementById('about-modal').classList.remove('hidden');
        });
        document.getElementById('btn-close-about').addEventListener('click', (e) => {
            e.stopPropagation();
            window.soundSystem.playClick();
            document.getElementById('about-modal').classList.add('hidden');
            if (this.engine) {
                this.engine.interactionCooldown = Date.now() + 300;
                // Only unlock movement if dialogue is not open
                if (document.getElementById('dialogue-box').classList.contains('hidden')) {
                    this.engine.setMovementLock(false);
                }
            }
        });

        // Audio Mute toggle
        document.getElementById('btn-audio-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            const muted = window.soundSystem.toggleMute();
            document.getElementById('btn-audio-toggle').textContent = muted ? '🔇 Mutado' : '🔊 Áudio ON';
        });

        // Dialogue advance button / click
        document.getElementById('dialogue-box').addEventListener('click', (e) => {
            // Don't advance if clicked on a choice button
            if (e.target.closest('.choice-card')) return;
            e.stopPropagation();
            this.advanceDialogue();
        });

        // Keydown advance for Space, Enter, or E while dialogue is open
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            const dialogueEl = document.getElementById('dialogue-box');
            const isDialogueActive = dialogueEl && !dialogueEl.classList.contains('hidden');

            if (isDialogueActive && (e.key === ' ' || e.key === 'Enter' || key === 'e')) {
                // If choices are displayed, don't advance blindly
                const choicesContainer = document.getElementById('dialogue-choices');
                if (!choicesContainer || choicesContainer.innerHTML.trim() === '') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.advanceDialogue();
                }
            }
        });

        // Did You Know Continue button
        document.getElementById('btn-continue-chapter').addEventListener('click', (e) => {
            e.stopPropagation();
            window.soundSystem.playSuccess();
            document.getElementById('did-you-know-modal').classList.add('hidden');
            this.nextChapter();
        });

        // Replay button on ending screen
        document.getElementById('btn-restart-game').addEventListener('click', (e) => {
            e.stopPropagation();
            window.soundSystem.playClick();
            this.restartGame();
        });
    }

    startChapter(index) {
        this.currentChapterIndex = index;
        const chapter = GAME_STORY.chapters[index];
        if (!chapter) {
            this.triggerEnding();
            return;
        }

        // Lock movement during chapter transition
        if (this.engine) {
            this.engine.setMovementLock(true);
        }

        // Show transition card
        const transCard = document.getElementById('chapter-transition-card');
        document.getElementById('trans-title').textContent = chapter.title;
        document.getElementById('trans-sub').textContent = chapter.subtitle;
        transCard.classList.remove('hidden');
        transCard.style.opacity = '1';

        window.soundSystem.playNotification();

        setTimeout(() => {
            transCard.style.opacity = '0';
            setTimeout(() => {
                transCard.classList.add('hidden');
                this.engine.loadChapter(chapter);
                this.updateObjective(chapter.objective);

                // Auto-trigger chapter introductory dialogue if Chapter 1
                if (chapter.id === 1) {
                    setTimeout(() => {
                        this.startDialogueSequence(GAME_STORY.dialogues.cap1_intro, () => {
                            // After intro, remind player to check phone
                            this.showToast("💡 O celular vibrou na escrivaninha! Aproxime-se e pressione [E].");
                        });
                    }, 500);
                }
            }, 500);
        }, 2200);
    }

    nextChapter() {
        this.startChapter(this.currentChapterIndex + 1);
    }

    updateObjective(text) {
        const objEl = document.getElementById('hud-objective-text');
        if (objEl) objEl.textContent = text;
    }

    updateHUD() {
        const clamp = (val) => Math.max(0, Math.min(10, val));
        this.stats.knowledge = clamp(this.stats.knowledge);
        this.stats.verification = clamp(this.stats.verification);
        this.stats.influence = clamp(this.stats.influence);

        // Progress bars
        document.getElementById('bar-knowledge').style.width = `${(this.stats.knowledge / 10) * 100}%`;
        document.getElementById('bar-verification').style.width = `${(this.stats.verification / 10) * 100}%`;
        document.getElementById('bar-influence').style.width = `${(this.stats.influence / 10) * 100}%`;

        document.getElementById('val-knowledge').textContent = `${this.stats.knowledge}/10`;
        document.getElementById('val-verification').textContent = `${this.stats.verification}/10`;
        document.getElementById('val-influence').textContent = `${this.stats.influence}/10`;

        const statusEl = document.getElementById('val-vaccine-status');
        if (this.stats.vaccineChecked) {
            statusEl.textContent = '✅ Conferida na UBS (Em Dia)';
            statusEl.className = 'status-badge status-good';
        } else {
            statusEl.textContent = '⏳ Não Conferida';
            statusEl.className = 'status-badge status-pending';
        }
    }

    showToast(message) {
        const toast = document.getElementById('game-toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('toast-active');
        setTimeout(() => {
            toast.classList.remove('toast-active');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3200);
    }

    applyStatsChange(changes) {
        if (!changes) return;
        let toastMessages = [];
        if (changes.knowledge) {
            this.stats.knowledge += changes.knowledge;
            toastMessages.push(`${changes.knowledge > 0 ? '+' : ''}${changes.knowledge} Conhecimento`);
        }
        if (changes.verification) {
            this.stats.verification += changes.verification;
            toastMessages.push(`${changes.verification > 0 ? '+' : ''}${changes.verification} Checagem de Fatos`);
        }
        if (changes.influence) {
            this.stats.influence += changes.influence;
            toastMessages.push(`${changes.influence > 0 ? '+' : ''}${changes.influence} Influência Positiva`);
        }
        if (changes.vaccineChecked !== undefined) {
            this.stats.vaccineChecked = changes.vaccineChecked;
            toastMessages.push(changes.vaccineChecked ? '💉 Caderneta Conferida!' : '⚠️ Situação Vacinal Pendente');
        }

        this.updateHUD();
        if (toastMessages.length > 0) {
            this.showToast(toastMessages.join(' • '));
        }
    }

    handleInteraction(interaction) {
        const { type, data } = interaction;

        if (type === 'npc') {
            this.handleNpcDialogue(data);
        } else if (type === 'interactable') {
            this.handleObjectInteraction(data);
        }
    }

    handleNpcDialogue(npc) {
        const dialogueId = npc.dialogueId;
        const dialogueTree = GAME_STORY.dialogues[dialogueId];

        if (dialogueTree) {
            this.startDialogueSequence(dialogueTree, () => {
                // If it's Chapter 2 and talked with Marina
                if (this.currentChapterIndex === 1 && npc.id === 'marina') {
                    this.showChapterCompletion();
                } else if (this.currentChapterIndex === 2 && npc.id === 'camila') {
                    this.showChapterCompletion();
                } else if (this.currentChapterIndex === 3 && npc.id === 'ana') {
                    this.showChapterCompletion();
                }
            });
        }
    }

    handleObjectInteraction(obj) {
        if (obj.type === 'phone') {
            if (this.flags.choice_cap1_a || this.flags.choice_cap1_b || this.flags.choice_cap1_c) {
                this.startDialogueSequence([
                    {
                        speaker: 'lucas',
                        emotion: 'pensativo',
                        text: "Já analisei a mensagem no celular e tomei minha decisão. Preciso descansar para a aula de amanhã!"
                    }
                ]);
                return;
            }
            this.openPhoneSimulator();
        } else if (obj.type === 'pc') {
            this.startDialogueSequence([
                {
                    speaker: 'lucas',
                    emotion: 'pensativo',
                    text: "No computador, eu costumo pesquisar os artigos e acessar a plataforma da faculdade."
                },
                {
                    speaker: 'lucas',
                    emotion: 'feliz',
                    text: "Também posso acessar o portal gov.br/saude para conferir o calendário nacional de vacinação a qualquer momento!"
                }
            ]);
        } else if (obj.type === 'guitar') {
            window.soundSystem.playChime();
            this.startDialogueSequence([
                {
                    speaker: 'lucas',
                    emotion: 'animado',
                    text: "Um acorde suave no violão para relaxar a cabeça antes de voltar aos estudos!"
                }
            ]);
        } else if (obj.type === 'mural') {
            this.startDialogueSequence([
                {
                    speaker: 'lucas',
                    emotion: 'pensativo',
                    text: "Mural do Centro Acadêmico: 'Atenção alunos: participe da campanha de verificação de cadernetas e saúde coletiva!'"
                }
            ]);
        } else if (obj.type === 'poster_sus') {
            this.startDialogueSequence([
                {
                    speaker: 'lucas',
                    emotion: 'feliz',
                    text: "Cartaz oficial do SUS: 'O sarampo é transmitido pelo ar. A vacina tríplice viral é gratuita e protege você e quem você ama.'"
                }
            ]);
        } else if (obj.type === 'leaflet') {
            this.startDialogueSequence([
                {
                    speaker: 'lucas',
                    emotion: 'pensativo',
                    text: "Folheto da UBS: 'Sintomas do sarampo: febre alta, tosse seca, coriza, conjuntivite e manchas avermelhadas pelo corpo. Na dúvida, procure atendimento.'"
                }
            ]);
        } else if (obj.type === 'family_photos') {
            this.startDialogueSequence([
                {
                    speaker: 'lucas',
                    emotion: 'feliz',
                    text: "Uma foto nossa em família no aniversário da Ana. Cuidar da saúde é proteger as pessoas que a gente mais ama no mundo."
                }
            ]);
        } else if (obj.type === 'coffee') {
            window.soundSystem.playClick();
            this.startDialogueSequence([
                {
                    speaker: 'lucas',
                    emotion: 'feliz',
                    text: "Café quentinho passado na hora... Nada melhor para uma conversa sincera em família."
                }
            ]);
        } else if (obj.type === 'booth') {
            this.startDialogueSequence([
                {
                    speaker: 'lucas',
                    emotion: 'animado',
                    text: "Estande 'Saúde e Ciência': dezenas de folhetos explicativos, espaço para tirar dúvidas e incentivo à vacinação consciente!"
                }
            ]);
        }
    }

    openPhoneSimulator() {
        this.engine.setMovementLock(true);
        const modal = document.getElementById('phone-modal');
        const phoneData = GAME_STORY.dialogues.cap1_phone_options;

        document.getElementById('phone-sender').textContent = phoneData.sender;
        document.getElementById('phone-time').textContent = phoneData.timestamp;
        document.getElementById('phone-bubble-text').textContent = phoneData.message;

        const choicesContainer = document.getElementById('phone-choices-container');
        choicesContainer.innerHTML = '';

        phoneData.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'phone-choice-btn';
            btn.innerHTML = `<strong>${choice.label}</strong><p>${choice.desc}</p>`;
            btn.addEventListener('click', () => {
                window.soundSystem.playClick();
                this.flags[choice.flag] = true;
                this.applyStatsChange(choice.statsChange);
                modal.classList.add('hidden');

                const reactionSequence = GAME_STORY.dialogues[choice.nextDialogue];
                this.startDialogueSequence(reactionSequence, () => {
                    this.showChapterCompletion();
                });
            });
            choicesContainer.appendChild(btn);
        });

        window.soundSystem.playNotification();
        modal.classList.remove('hidden');
    }

    startDialogueSequence(dialogueList, onComplete) {
        if (!dialogueList || dialogueList.length === 0) return;
        this.engine.setMovementLock(true);
        this.activeDialogueQueue = [...dialogueList];
        this.currentDialogueIndex = 0;
        this.onDialogueComplete = onComplete;

        document.getElementById('dialogue-box').classList.remove('hidden');
        this.renderCurrentDialogueNode();
    }

    renderCurrentDialogueNode() {
        const node = this.activeDialogueQueue[this.currentDialogueIndex];
        if (!node) {
            this.closeDialogue();
            return;
        }

        const charMeta = GAME_STORY.characters[node.speaker] || {
            name: node.speaker,
            role: "Personagem",
            portraits: {}
        };

        document.getElementById('dialogue-name').textContent = charMeta.name;
        document.getElementById('dialogue-role').textContent = charMeta.role;

        // Character portrait
        const portraitUrl = (charMeta.portraits && charMeta.portraits[node.emotion])
            ? charMeta.portraits[node.emotion]
            : charMeta.avatar;
        const portraitImg = document.getElementById('dialogue-portrait');
        portraitImg.src = portraitUrl;
        portraitImg.alt = `${charMeta.name} (${node.emotion || 'normal'})`;

        // Clear choices area
        const choicesContainer = document.getElementById('dialogue-choices');
        choicesContainer.innerHTML = '';

        // Text display with typewriter effect
        this.typewriterText(node.text, () => {
            // If this node presents interactive choices
            if (node.isChoice && node.choices) {
                node.choices.forEach(choice => {
                    const card = document.createElement('div');
                    card.className = 'choice-card';
                    card.innerHTML = `<h4>${choice.label}</h4><p>${choice.desc}</p>`;
                    card.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.soundSystem.playClick();
                        this.applyStatsChange(choice.statsChange);
                        if (choice.triggerEnding) {
                            this.closeDialogue();
                            this.triggerEnding();
                            return;
                        }
                        if (choice.dialogue) {
                            // Replace remainder of dialogue with choice consequence
                            this.activeDialogueQueue = [...choice.dialogue];
                            this.currentDialogueIndex = 0;
                            this.renderCurrentDialogueNode();
                        } else {
                            this.advanceDialogue();
                        }
                    });
                    choicesContainer.appendChild(card);
                });
            }
        });
    }

    typewriterText(text, onComplete) {
        const textEl = document.getElementById('dialogue-text');
        textEl.textContent = '';
        this.isTyping = true;
        this.currentFullText = text;
        this.onTypewriterComplete = onComplete;

        if (this.typewriterTimer) clearInterval(this.typewriterTimer);

        let i = 0;
        this.typewriterTimer = setInterval(() => {
            if (i < text.length) {
                textEl.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(this.typewriterTimer);
                this.typewriterTimer = null;
                this.isTyping = false;
                if (this.onTypewriterComplete) {
                    const cb = this.onTypewriterComplete;
                    this.onTypewriterComplete = null;
                    cb();
                }
            }
        }, 18);
    }

    advanceDialogue() {
        if (this.isTyping) {
            // Instant complete current line
            if (this.typewriterTimer) {
                clearInterval(this.typewriterTimer);
                this.typewriterTimer = null;
            }
            document.getElementById('dialogue-text').textContent = this.currentFullText;
            this.isTyping = false;
            // Execute typewriter completion callback so choices render immediately if skipped
            if (this.onTypewriterComplete) {
                const cb = this.onTypewriterComplete;
                this.onTypewriterComplete = null;
                cb();
            }
            return;
        }

        const currentNode = this.activeDialogueQueue[this.currentDialogueIndex];
        // If choices are waiting to be picked, don't advance blindly
        if (currentNode && currentNode.isChoice) return;

        this.currentDialogueIndex++;
        if (this.currentDialogueIndex < this.activeDialogueQueue.length) {
            window.soundSystem.playClick();
            this.renderCurrentDialogueNode();
        } else {
            this.closeDialogue();
        }
    }

    closeDialogue() {
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
            this.typewriterTimer = null;
        }
        this.isTyping = false;
        this.onTypewriterComplete = null;
        document.getElementById('dialogue-box').classList.add('hidden');

        // Apply a cooldown to prevent immediate re-triggering of interactions
        if (this.engine) {
            this.engine.interactionCooldown = Date.now() + 400;
            this.engine.setMovementLock(false);
        }

        if (this.onDialogueComplete) {
            const cb = this.onDialogueComplete;
            this.onDialogueComplete = null;
            cb();
        }
    }

    showChapterCompletion() {
        const chapter = GAME_STORY.chapters[this.currentChapterIndex];
        if (!chapter || !chapter.didYouKnow) return;

        // Keep movement locked while modal is preparing and active
        if (this.engine) {
            this.engine.setMovementLock(true);
        }

        setTimeout(() => {
            const modal = document.getElementById('did-you-know-modal');
            document.getElementById('did-you-know-title').textContent = chapter.didYouKnow.title;
            const listEl = document.getElementById('did-you-know-list');
            listEl.innerHTML = '';

            chapter.didYouKnow.facts.forEach(fact => {
                const li = document.createElement('li');
                li.innerHTML = `<span>🛡️</span> <div>${fact}</div>`;
                listEl.appendChild(li);
            });

            document.getElementById('did-you-know-source').textContent = `Fonte Confiável: ${chapter.didYouKnow.source}`;
            window.soundSystem.playSuccess();
            modal.classList.remove('hidden');
        }, 500);
    }

    triggerEnding() {
        this.engine.setMovementLock(true);
        window.soundSystem.playSuccess();

        // Calculate ending based on player journey
        let selectedEnding = GAME_STORY.endings.ending2; // Default hesitant

        const isGoodVerification = this.stats.verification >= 5;
        const sharedInCap1 = this.flags.choice_cap1_b;

        if (sharedInCap1 && this.stats.influence >= 4) {
            selectedEnding = GAME_STORY.endings.ending3; // Recognized error and corrected
        } else if (isGoodVerification && this.stats.vaccineChecked) {
            selectedEnding = GAME_STORY.endings.ending1; // Informed & Responsible
        } else if (isGoodVerification) {
            selectedEnding = GAME_STORY.endings.ending1;
        }

        // Render ending screen
        document.getElementById('ending-badge').textContent = selectedEnding.badge;
        document.getElementById('ending-title').textContent = selectedEnding.title;
        document.getElementById('ending-quote').textContent = selectedEnding.quote;
        document.getElementById('ending-desc').textContent = selectedEnding.description;

        const learningsList = document.getElementById('ending-learnings-list');
        learningsList.innerHTML = '';
        selectedEnding.learnings.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>✨</span> <div>${item}</div>`;
            learningsList.appendChild(li);
        });

        // Final score metrics
        document.getElementById('final-knowledge').textContent = `${this.stats.knowledge} / 10`;
        document.getElementById('final-verification').textContent = `${this.stats.verification} / 10`;
        document.getElementById('final-influence').textContent = `${this.stats.influence} / 10`;
        document.getElementById('final-vaccine-status').textContent = this.stats.vaccineChecked ? 'Conferida na UBS' : 'Pendente';

        // Render official references
        const refContainer = document.getElementById('official-references-container');
        refContainer.innerHTML = '';
        GAME_STORY.officialReferences.forEach(ref => {
            const card = document.createElement('a');
            card.className = 'reference-card';
            card.href = ref.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.innerHTML = `<h4>${ref.title} 🔗</h4><p>${ref.desc}</p>`;
            refContainer.appendChild(card);
        });

        document.getElementById('ending-screen').classList.remove('hidden');
    }

    restartGame() {
        this.stats = {
            knowledge: 3,
            verification: 2,
            influence: 3,
            vaccineChecked: false
        };
        this.flags = {};
        this.updateHUD();
        this.hideScreen('ending-screen');
        const startBtn = document.getElementById('btn-start-game');
        if (startBtn) startBtn.disabled = false;
        this.startChapter(0);
    }

    hideScreen(id) {
        document.getElementById(id).classList.add('hidden');
    }
}

// Instantiate and start after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameManager();
    window.game.start();
});
