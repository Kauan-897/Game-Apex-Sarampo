// Story data, script, characters, and decision nodes
const GAME_STORY = {
    characters: {
        lucas: {
            name: "Lucas",
            role: "Protagonista (21 anos)",
            description: "Universitário curioso, às vezes impulsivo ao receber mensagens em redes sociais, mas disposto a refletir e aprender.",
            avatar: "assets/portraits/lucas_feliz.png",
            portraits: {
                feliz: "assets/portraits/lucas_feliz.png",
                preocupado: "assets/portraits/lucas_preocupado.png",
                animado: "assets/portraits/lucas_animado.png",
                surpreso: "assets/portraits/lucas_surpreso.png",
                serio: "assets/portraits/lucas_serio.png",
                pensativo: "assets/portraits/lucas_pensativo.png"
            }
        },
        marina: {
            name: "Marina",
            role: "Colega de Faculdade",
            description: "Estudante extrovertida que costuma compartilhar o que vê nas redes sociais. Não tem má intenção, mas repassa sem checar.",
            avatar: "assets/portraits/marina_feliz.png",
            portraits: {
                feliz: "assets/portraits/marina_feliz.png",
                preocupado: "assets/portraits/marina_preocupado.png",
                animado: "assets/portraits/marina_animado.png",
                surpreso: "assets/portraits/marina_surpreso.png",
                serio: "assets/portraits/marina_serio.png",
                pensativo: "assets/portraits/marina_pensativo.png"
            }
        },
        raphael: {
            name: "Raphael",
            role: "Colega de Faculdade (20 anos)",
            description: "Estudioso, tranquilo e apaixonado por tecnologia e verificação de dados. Valoriza a amizade e boas decisões informadas.",
            avatar: "assets/portraits/raphael_feliz.png",
            portraits: {
                feliz: "assets/portraits/raphael_feliz.png",
                preocupado: "assets/portraits/raphael_preocupado.png",
                animado: "assets/portraits/raphael_animado.png",
                surpreso: "assets/portraits/raphael_surpreso.png",
                serio: "assets/portraits/raphael_serio.png",
                pensativo: "assets/portraits/raphael_pensativo.png"
            }
        },
        ana: {
            name: "Ana",
            role: "Irmã de Lucas (19 anos)",
            description: "Muito atenciosa e protetora com a família. Fica insegura e com medo quando vê mensagens alarmistas na internet.",
            avatar: "assets/portraits/ana_feliz.png",
            portraits: {
                feliz: "assets/portraits/ana_feliz.png",
                preocupado: "assets/portraits/ana_preocupado.png",
                animado: "assets/portraits/ana_animado.png",
                surpreso: "assets/portraits/ana_surpreso.png",
                serio: "assets/portraits/ana_serio.png",
                pensativo: "assets/portraits/ana_pensativo.png"
            }
        },
        camila: {
            name: "Camila",
            role: "Profissional de Saúde (UBS)",
            description: "Enfermeira atenciosa na Unidade Básica de Saúde. Esclarece dúvidas sem julgar e orienta sobre prevenção de forma acessível.",
            avatar: "assets/portraits/camila_feliz.png",
            portraits: {
                feliz: "assets/portraits/camila_feliz.png",
                preocupado: "assets/portraits/camila_preocupado.png",
                animado: "assets/portraits/camila_animado.png",
                surpreso: "assets/portraits/camila_surpreso.png",
                serio: "assets/portraits/camila_serio.png",
                pensativo: "assets/portraits/camila_pensativo.png"
            }
        }
    },

    chapters: [
        {
            id: 1,
            title: "Capítulo 1 — A Mensagem no Grupo",
            subtitle: "Uma noite comum, um boato na tela",
            background: "assets/backgrounds/quarto.jpg",
            objective: "Aproxime-se da escrivaninha usando [W A S D] e aperte [E] para examinar o celular.",
            playerStart: { x: 700, y: 530, facing: -1 },
            walkBounds: { minX: 100, maxX: 850, minY: 490, maxY: 580 },
            interactables: [
                {
                    id: "celular",
                    name: "Celular Notificando",
                    x: 330,
                    y: 530,
                    label: "E - Olhar o Celular",
                    type: "phone"
                },
                {
                    id: "computador",
                    name: "Computador de Lucas",
                    x: 200,
                    y: 520,
                    label: "E - Ligar Computador",
                    type: "pc"
                },
                {
                    id: "violao",
                    name: "Violão",
                    x: 850,
                    y: 520,
                    label: "E - Tocar Cordas",
                    type: "guitar"
                }
            ],
            didYouKnow: {
                title: "O que você descobriu no Capítulo 1?",
                facts: [
                    "O sarampo é uma doença infecciosa aguda grave e extremamente contagiosa, transmitida pelo ar ao tossir, espirrar ou respirar.",
                    "Uma pessoa doente pode transmitir o vírus para até 18 pessoas não vacinadas.",
                    "Mensagens alarmistas com selos de 'encaminhado com frequência' costumam apelar para o medo e raramente citam artigos científicos ou órgãos oficiais de saúde."
                ],
                source: "Ministério da Saúde (MS) & Organização Mundial da Saúde (OMS)"
            }
        },
        {
            id: 2,
            title: "Capítulo 2 — Em quem confiar?",
            subtitle: "Dilemas no pátio da faculdade",
            background: "assets/backgrounds/faculdade.jpg",
            objective: "Explore o pátio com [W A S D] e converse com Marina [E] e Raphael [E] perto dos bancos.",
            playerStart: { x: 120, y: 530 },
            walkBounds: { minX: 80, maxX: 900, minY: 490, maxY: 580 },
            npcs: [
                {
                    id: "marina",
                    name: "Marina",
                    sprite: "assets/characters/marina_talk.png",
                    x: 350,
                    y: 530,
                    label: "E - Falar com Marina",
                    dialogueId: "cap2_marina"
                },
                {
                    id: "raphael",
                    name: "Raphael",
                    sprite: "assets/characters/raphael_laptop.png",
                    x: 680,
                    y: 520,
                    label: "E - Falar com Raphael",
                    dialogueId: "cap2_raphael"
                }
            ],
            interactables: [
                {
                    id: "mural",
                    name: "Mural de Avisos",
                    x: 170,
                    y: 520,
                    label: "E - Olhar Mural Acadêmico",
                    type: "mural"
                }
            ],
            didYouKnow: {
                title: "O que você descobriu no Capítulo 2?",
                facts: [
                    "Como checar uma informação de saúde: verifique a fonte (.gov.br, Fiocruz, OMS), data de publicação, autoria e se a notícia cita dados verificáveis.",
                    "A vacina tríplice viral (sarampo, caxumba e rubéola) é segura, utilizada há décadas no Brasil e no mundo, salvando milhões de vidas.",
                    "Uma mensagem não é verdadeira só porque veio de um amigo de confiança — amigos também podem ser enganados pela desinformação."
                ],
                source: "Programa Nacional de Imunizações (PNI) & Fiocruz"
            }
        },
        {
            id: 3,
            title: "Capítulo 3 — Uma dúvida sobre a própria saúde",
            subtitle: "A visita à Unidade Básica de Saúde (UBS)",
            background: "assets/backgrounds/ubs.jpg",
            objective: "Lucas chegou ao postinho de saúde. Aproxime-se da recepção para conversar com Camila [E].",
            playerStart: { x: 100, y: 530 },
            walkBounds: { minX: 60, maxX: 880, minY: 490, maxY: 580 },
            npcs: [
                {
                    id: "camila",
                    name: "Camila",
                    sprite: "assets/characters/camila_stand.png",
                    x: 340,
                    y: 530,
                    label: "E - Conversar com Camila",
                    dialogueId: "cap3_camila"
                }
            ],
            interactables: [
                {
                    id: "cartaz_ze_gota",
                    name: "Cartaz de Vacinação",
                    x: 440,
                    y: 520,
                    label: "E - Ler Cartazes do SUS",
                    type: "poster_sus"
                },
                {
                    id: "panfletos",
                    name: "Mesa de Guias",
                    x: 740,
                    y: 530,
                    label: "E - Olhar Folheto do Sarampo",
                    type: "leaflet"
                }
            ],
            didYouKnow: {
                title: "O que você descobriu no Capítulo 3?",
                facts: [
                    "Adultos jovens também precisam de vacina! No Brasil, pessoas de 12 meses até 29 anos devem ter o registro de 2 doses da tríplice viral.",
                    "Pessoas de 30 a 59 anos precisam de pelo menos 1 dose comprovada na caderneta.",
                    "Se você perdeu o cartão ou não sabe se tomou, procure a UBS mais próxima: os profissionais de saúde avaliam seu histórico e orientam sem qualquer julgamento."
                ],
                source: "Ministério da Saúde — Calendário Nacional de Vacinação do Adulto"
            }
        },
        {
            id: 4,
            title: "Capítulo 4 — A conversa com a família",
            subtitle: "Esclarecendo receios em casa",
            background: "assets/backgrounds/sala.jpg",
            objective: "Caminhe pela sala e converse com sua irmã Ana [E] no sofá sobre as dúvidas de saúde.",
            playerStart: { x: 120, y: 530 },
            walkBounds: { minX: 80, maxX: 850, minY: 490, maxY: 580 },
            npcs: [
                {
                    id: "ana",
                    name: "Ana",
                    sprite: "assets/characters/ana_sit.png",
                    x: 520,
                    y: 530,
                    label: "E - Conversar com Ana",
                    dialogueId: "cap4_ana"
                }
            ],
            interactables: [
                {
                    id: "porta_retratos",
                    name: "Porta-Retratos da Família",
                    x: 340,
                    y: 520,
                    label: "E - Olhar Fotos de Família",
                    type: "family_photos"
                },
                {
                    id: "cafeteira",
                    name: "Café Quentinho",
                    x: 470,
                    y: 540,
                    label: "E - Servir Café",
                    type: "coffee"
                }
            ],
            didYouKnow: {
                title: "O que você descobriu no Capítulo 4?",
                facts: [
                    "O combate à desinformação funciona com acolhimento e respeito, nunca com agressividade ou humilhação.",
                    "Reconhecer um erro e corrigir uma notícia falsa enviada no grupo familiar demonstra maturidade e responsabilidade.",
                    "Compartilhar links de órgãos oficiais e se colocar à disposição para tirar dúvidas ajuda os familiares a se sentirem seguros."
                ],
                source: "Manual de Comunicação Não-Violenta em Saúde & OPAS"
            }
        },
        {
            id: 5,
            title: "Capítulo 5 — A campanha na faculdade",
            subtitle: "União estudantil e conscientização coletiva",
            background: "assets/backgrounds/campanha.jpg",
            objective: "Chegue até o estande da campanha e fale com seus colegas e Camila [E] para definir a ação!",
            playerStart: { x: 100, y: 530 },
            walkBounds: { minX: 80, maxX: 900, minY: 490, maxY: 580 },
            npcs: [
                {
                    id: "marina",
                    name: "Marina",
                    sprite: "assets/characters/marina_talk.png",
                    x: 460,
                    y: 530,
                    label: "E - Falar com Marina",
                    dialogueId: "cap5_marina"
                },
                {
                    id: "camila",
                    name: "Camila",
                    sprite: "assets/characters/camila_stand.png",
                    x: 560,
                    y: 530,
                    label: "E - Falar com Camila",
                    dialogueId: "cap5_camila"
                },
                {
                    id: "raphael",
                    name: "Raphael",
                    sprite: "assets/characters/raphael_stand.png",
                    x: 720,
                    y: 530,
                    label: "E - Falar com Raphael",
                    dialogueId: "cap5_raphael"
                }
            ],
            interactables: [
                {
                    id: "estande",
                    name: "Estande de Informações",
                    x: 510,
                    y: 520,
                    label: "E - Ajudar no Estande",
                    type: "booth"
                }
            ],
            didYouKnow: {
                title: "O que você descobriu no Capítulo 5?",
                facts: [
                    "Imunidade Coletiva (Efeito Rebanho): Quando a grande maioria da população está imunizada, o vírus não consegue circular, protegendo quem ainda não pode se vacinar (como bebês com menos de 6 meses e pessoas com alergias severas).",
                    "A vacinação é um pacto de cidadania e amor ao próximo: cuidar de si é cuidar da sua família e de toda a sociedade.",
                    "O SUS disponibiliza as vacinas gratuitamente em todas as salas de vacinação do Brasil."
                ],
                source: "Ministério da Saúde do Brasil — Programa Nacional de Imunizações"
            }
        }
    ],

    // Complete Branching Dialogue Scripts
    dialogues: {
        // CAP 1: Interactions and Phone Decision
        cap1_intro: [
            {
                speaker: "lucas",
                emotion: "pensativo",
                text: "Mais uma noite terminando os trabalhos da faculdade... Amanhã tenho aula cedo."
            },
            {
                speaker: "lucas",
                emotion: "surpreso",
                text: "Opa, meu celular acabou de vibrar. Parece que é mensagem no grupo dos amigos da faculdade."
            }
        ],

        cap1_phone_options: {
            sender: "Marina (Grupo Turma da Faculdade)",
            timestamp: "21:44",
            message: "“Gente, vocês viram isso?! Me mandaram essa mensagem num grupo dizendo que a vacina contra o sarampo é perigosa e que ninguém deveria tomar. Fiquei muito na dúvida e resolvi compartilhar aqui com vocês...”",
            suspiciousBanner: "⚠️ Mensagem encaminhada com frequência • Sem fonte citada",
            choices: [
                {
                    id: "A",
                    label: "Escolha A: Acreditar no boato e deixar de lado",
                    desc: "Lucas fica receoso com a mensagem e decide não procurar mais informações agora.",
                    statsChange: { knowledge: 0, verification: -1, influence: -1 },
                    flag: "choice_cap1_a",
                    nextDialogue: "cap1_reaction_a"
                },
                {
                    id: "B",
                    label: "Escolha B: Encaminhar para o grupo da família",
                    desc: "Lucas repassa a mensagem para alertar os parentes antes de verificar se é verdade.",
                    statsChange: { knowledge: 0, verification: -2, influence: -2 },
                    flag: "choice_cap1_b",
                    nextDialogue: "cap1_reaction_b"
                },
                {
                    id: "C",
                    label: "Escolha C: Não compartilhar e pesquisar em fontes oficiais",
                    desc: "Lucas desconfia do alarme, não repassa o texto e abre o site do Ministério da Saúde para checar.",
                    statsChange: { knowledge: 2, verification: 3, influence: 2 },
                    flag: "choice_cap1_c",
                    nextDialogue: "cap1_reaction_c"
                }
            ]
        },

        cap1_reaction_a: [
            {
                speaker: "lucas",
                emotion: "preocupado",
                text: "Poxa... se a Marina mandou isso, será que tem fundamento? Fiquei com receio agora."
            },
            {
                speaker: "lucas",
                emotion: "pensativo",
                text: "Melhor deixar isso quieto por enquanto. Amanhã vejo isso... ou nem penso mais nisso."
            }
        ],

        cap1_reaction_b: [
            {
                speaker: "lucas",
                emotion: "preocupado",
                text: "Nossa, se for perigoso mesmo, minha família precisa saber logo! Vou mandar no grupo da casa agora mesmo."
            },
            {
                speaker: "lucas",
                emotion: "serio",
                text: "Mensagem encaminhada para o grupo 'Família Unida'..."
            },
            {
                speaker: "lucas",
                emotion: "pensativo",
                text: "Espero não ter causado pânico à toa... Nem cheguei a olhar quem escreveu isso."
            }
        ],

        cap1_reaction_c: [
            {
                speaker: "lucas",
                emotion: "serio",
                text: "Calma... esse texto tem cara típica de corrente de desinformação. Tom alarmista, sem nome de médico, sem link de estudo..."
            },
            {
                speaker: "lucas",
                emotion: "animado",
                text: "Vou ligar o computador e entrar direto no portal do Ministério da Saúde e da Fiocruz para ver o que a ciência diz."
            },
            {
                speaker: "lucas",
                emotion: "feliz",
                text: "Olha só: a tríplice viral tem eficácia altíssima e segurança comprovada por décadas no mundo todo. Não vou repassar esse boato de jeito nenhum."
            }
        ],

        // CAP 2: Campus Dialogue
        cap2_marina: [
            {
                speaker: "marina",
                emotion: "preocupada",
                text: "Oi, Lucas! Viu a mensagem que eu mandei ontem à noite no grupo? Acordei pensando naquilo..."
            },
            {
                speaker: "marina",
                emotion: "pensativa",
                text: "Encontrei tanta gente falando coisas diferentes na internet que estou perdida. Não sei em quem acreditar!"
            },
            {
                speaker: "lucas",
                emotion: "pensativo",
                text: "Como devo responder à Marina agora?",
                isChoice: true,
                choices: [
                    {
                        id: "m_fake",
                        label: "Repetir o que leu na mensagem alarmista",
                        desc: "Dizer que também viu boatos e que talvez seja perigoso.",
                        statsChange: { knowledge: -1, verification: -1, influence: -2 },
                        dialogue: [
                            {
                                speaker: "lucas",
                                emotion: "preocupado",
                                text: "Olha, Marina, eu vi aquilo e fiquei meio encanado também. Dizem que pode fazer mal..."
                            },
                            {
                                speaker: "marina",
                                emotion: "preocupada",
                                text: "Pois é... agora fico ainda mais confusa. Se você também acha isso, fico até com medo."
                            },
                            {
                                speaker: "lucas",
                                emotion: "pensativo",
                                text: "(Será que eu devia ter afirmado algo que nem sequer pesquisei direito?)"
                            }
                        ]
                    },
                    {
                        id: "m_leave",
                        label: "Encerrar a conversa rapidamente",
                        desc: "Dizer que o assunto é complicado demais e mudar de assunto.",
                        statsChange: { knowledge: 0, verification: 0, influence: 0 },
                        dialogue: [
                            {
                                speaker: "lucas",
                                emotion: "pensativo",
                                text: "Ih, Marina, esse assunto é muito complicado. Não entendo nada disso, melhor nem esquentar a cabeça."
                            },
                            {
                                speaker: "marina",
                                emotion: "pensativa",
                                text: "É, pode ser... Mas fico com uma sensação ruim de não saber o que é verdade."
                            }
                        ]
                    },
                    {
                        id: "m_verify",
                        label: "Explicar como checar fontes oficiais com empatia",
                        desc: "Mostrar o site do Ministério da Saúde e explicar que compartilhar muito não torna algo real.",
                        statsChange: { knowledge: 3, verification: 3, influence: 3 },
                        dialogue: [
                            {
                                speaker: "lucas",
                                emotion: "feliz",
                                text: "Marina, eu entendo a sua dúvida! É normal ficar insegura quando chegam mensagens assim. Mas eu fui pesquisar no portal do Ministério da Saúde e na Fiocruz."
                            },
                            {
                                speaker: "lucas",
                                emotion: "serio",
                                text: "A vacina contra o sarampo é a tríplice viral. Ela previne três doenças graves e é testada com rigor extremo. Uma mensagem não vira verdade só porque muita gente repassa."
                            },
                            {
                                speaker: "marina",
                                emotion: "surpresa",
                                text: "Puxa, Lucas! Você tem toda razão... Eu me assustei e repassei no impulso. Da próxima vez vou olhar primeiro o site oficial da saúde antes de espalhar."
                            },
                            {
                                speaker: "marina",
                                emotion: "feliz",
                                text: "Obrigada por me explicar com calma, sem me julgar. Foi muito importante!"
                            }
                        ]
                    }
                ]
            }
        ],

        cap2_raphael: [
            {
                speaker: "raphael",
                emotion: "feliz",
                text: "E aí, Lucas! Estava lendo sobre ferramentas de checagem de fatos aqui no notebook."
            },
            {
                speaker: "raphael",
                emotion: "animado",
                text: "Sabia que o Ministério da Saúde tem um canal exclusivo chamado 'Saúde com Ciência' justamente para desmentir boatos de vacinação?"
            },
            {
                speaker: "lucas",
                emotion: "pensativo",
                text: "Que legal, Rapha! O que você mais olha quando vê uma notícia suspeita?"
            },
            {
                speaker: "raphael",
                emotion: "serio",
                text: "Três regrinhas de ouro: 1) Quem assinou? 2) Tem data recente ou é recorte antigo fora de contexto? 3) O link é oficial (.gov.br ou universidade)? Se não tiver isso, desconfie!"
            },
            {
                speaker: "lucas",
                emotion: "feliz",
                text: "Boas dicas, cara! Isso ajuda muito a não cair em armadilhas digitais."
            }
        ],

        // CAP 3: UBS Dialogue with Camila
        cap3_camila: [
            {
                speaker: "camila",
                emotion: "feliz",
                text: "Olá! Boa tarde. Sou a Camila, enfermeira aqui da UBS. Em que posso te ajudar hoje?"
            },
            {
                speaker: "lucas",
                emotion: "pensativo",
                text: "Oi, Camila! Então... andei conversando sobre sarampo na faculdade e percebi algo: passei tanto tempo discutindo na internet que nem parei para verificar minha própria caderneta!"
            },
            {
                speaker: "camila",
                emotion: "animada",
                text: "Que atitude excelente, Lucas! Muita gente acha que sarampo é doença só de criança, mas jovens adultos também precisam conferir se o esquema vacinal está em dia."
            },
            {
                speaker: "lucas",
                emotion: "preocupado",
                text: "Qual decisão devo tomar agora?",
                isChoice: true,
                choices: [
                    {
                        id: "c_ignore",
                        label: "Deixar de lado e dizer que volta outro dia",
                        desc: "Achar que é perda de tempo e ir embora sem checar.",
                        statsChange: { knowledge: 0, verification: -1, vaccineChecked: false },
                        dialogue: [
                            {
                                speaker: "lucas",
                                emotion: "pensativo",
                                text: "Pensando bem, Camila, acho que não preciso ver isso agora não. Se eu não estiver doente, tá tudo certo, né?"
                            },
                            {
                                speaker: "camila",
                                emotion: "preocupada",
                                text: "Entendo seu ponto, Lucas, mas a vacina serve justamente para prevenir antes que o vírus chegue. Nossas portas estão sempre abertas se quiser voltar!"
                            }
                        ]
                    },
                    {
                        id: "c_ask_social",
                        label: "Dizer que vai perguntar no Instagram ou Twitter",
                        desc: "Achar que conselhos de seguidores são suficientes.",
                        statsChange: { knowledge: 1, verification: 0, vaccineChecked: false },
                        dialogue: [
                            {
                                speaker: "lucas",
                                emotion: "pensativo",
                                text: "Acho que vou abrir uma enquete nas minhas redes sociais pra ver o que meus amigos fizeram."
                            },
                            {
                                speaker: "camila",
                                emotion: "pensativa",
                                text: "Cuidado, Lucas! A situação vacinal é individual e médica. Seus seguidores não têm acesso ao seu prontuário ou histórico. O lugar certo para avaliar isso é aqui no serviço de saúde."
                            }
                        ]
                    },
                    {
                        id: "c_check_properly",
                        label: "Pedir para Camila conferir o histórico vacinal",
                        desc: "Consultar os registros e entender a recomendação para jovens até 29 anos.",
                        statsChange: { knowledge: 4, verification: 3, vaccineChecked: true },
                        dialogue: [
                            {
                                speaker: "lucas",
                                emotion: "feliz",
                                text: "Camila, trouxe minha caderneta antiga e meu documento com o Cartão SUS. Você pode conferir para mim?"
                            },
                            {
                                speaker: "camila",
                                emotion: "feliz",
                                text: "Com certeza! Deixa eu verificar aqui no sistema Conecte SUS... Veja só: para pessoas até 29 anos de idade, a recomendação oficial do Ministério da Saúde são 2 doses da tríplice viral."
                            },
                            {
                                speaker: "camila",
                                emotion: "animada",
                                text: "Você tomou uma dose quando era criança e aqui consta a segunda dose no reforço escolar! Sua caderneta está perfeitamente em dia contra o sarampo, caxumba e rubéola!"
                            },
                            {
                                speaker: "lucas",
                                emotion: "animado",
                                text: "Nossa, que alívio! Agora tenho certeza com base em registros reais, e não em achismos!"
                            },
                            {
                                speaker: "camila",
                                emotion: "feliz",
                                text: "Parabéns pela responsabilidade, Lucas. Buscar informação e cuidar da saúde nunca é fraqueza, é um ato de cidadania!"
                            }
                        ]
                    }
                ]
            }
        ],

        // CAP 4: Home with sister Ana
        cap4_ana: [
            {
                speaker: "ana",
                emotion: "preocupada",
                text: "Lucas... ainda bem que você chegou. Eu estou agoniada aqui no sofá olhando meu celular."
            },
            {
                speaker: "ana",
                emotion: "pensativa",
                text: "Começou a circular aquele texto sobre a vacina do sarampo... Fiquei com muito medo pelos nossos pais e por mim."
            },
            {
                speaker: "lucas",
                emotion: "pensativo",
                text: "Como você deve responder à sua irmã Ana?",
                isChoice: true,
                choices: [
                    {
                        id: "a_dismiss",
                        label: "Dizer para ela não se preocupar e mudar de assunto",
                        desc: "Desconsiderar o medo da irmã sem explicar com fatos.",
                        statsChange: { knowledge: 0, verification: 0, influence: -1 },
                        dialogue: [
                            {
                                speaker: "lucas",
                                emotion: "pensativo",
                                text: "Relaxa, Ana. Você se preocupa demais com essas coisas da internet. Deixa isso pra lá."
                            },
                            {
                                speaker: "ana",
                                emotion: "preocupada",
                                text: "Mas Lucas, como vou relaxar se todo mundo tá falando nisso? Queria que você me explicasse em vez de me dispensar..."
                            }
                        ]
                    },
                    {
                        id: "a_admit_and_correct",
                        label: "Acolher com empatia, esclarecer e corrigir informações",
                        desc: "Explicar calmamente o que aprendeu na UBS e nas fontes oficiais, transmitindo segurança.",
                        statsChange: { knowledge: 3, verification: 3, influence: 4 },
                        dialogue: [
                            {
                                speaker: "lucas",
                                emotion: "feliz",
                                text: "Vem cá, Ana. É super compreensível você sentir medo quando lê algo tão assustador. Mas eu pesquisei a fundo e conversei com a enfermeira Camila na UBS hoje."
                            },
                            {
                                speaker: "lucas",
                                emotion: "serio",
                                text: "Aquele texto é falso. O sarampo é que é uma doença de verdade e muito perigosa. A vacina é feita há décadas pelo SUS, com segurança comprovada por cientistas do mundo inteiro."
                            },
                            {
                                speaker: "ana",
                                emotion: "surpresa",
                                text: "Sério, Lucas?! Nossa... que peso saiu das minhas costas agora. Como você descobriu isso?"
                            },
                            {
                                speaker: "lucas",
                                emotion: "animado",
                                text: "Olhei o site do Ministério da Saúde e conferi a caderneta lá no postinho. Amanhã a gente pode ir lá juntos dar uma olhada na sua também!"
                            },
                            {
                                speaker: "ana",
                                emotion: "feliz",
                                text: "Obrigada, Lucas! Me sinto muito mais segura conversando com você."
                            }
                        ]
                    }
                ]
            }
        ],

        // CAP 5: Campaign & Finale
        cap5_marina: [
            {
                speaker: "marina",
                emotion: "animada",
                text: "Lucas! Que bom que você veio! Olha a quantidade de estudantes que pararam aqui no estande para saber sobre o sarampo!"
            },
            {
                speaker: "marina",
                emotion: "feliz",
                text: "Muitos tinham recebido aquele mesmo boato e não sabiam o que fazer. Estamos distribuindo os panfletos oficiais da campanha!"
            }
        ],

        cap5_raphael: [
            {
                speaker: "raphael",
                emotion: "feliz",
                text: "E aí, Lucas! Montamos um QR Code na faixa que leva direto para a checagem oficial da Fiocruz e do Ministério da Saúde."
            },
            {
                speaker: "raphael",
                emotion: "animado",
                text: "A tecnologia quando usada para espalhar informação de qualidade faz uma diferença gigante na comunidade!"
            }
        ],

        cap5_camila: [
            {
                speaker: "camila",
                emotion: "animada",
                text: "Lucas! Que alegria te ver aqui no estande universitário! A equipe da UBS veio apoiar a campanha."
            },
            {
                speaker: "camila",
                emotion: "feliz",
                text: "Sua trajetória nos últimos dias mostrou algo fundamental: quando os jovens se mobilizam com responsabilidade, toda a sociedade fica mais protegida."
            },
            {
                speaker: "lucas",
                emotion: "pensativo",
                text: "Como você deseja finalizar sua participação na campanha?",
                isChoice: true,
                choices: [
                    {
                        id: "camp_lead",
                        label: "Discursar e compartilhar o que aprendeu sobre imunidade e diálogo",
                        desc: "Inspirar os colegas universitários a checarem seus cartões e combaterem a desinformação com empatia.",
                        statsChange: { knowledge: 3, verification: 3, influence: 5 },
                        triggerEnding: true
                    }
                ]
            }
        ]
    },

    // 3 Distinct Endings based on player performance & choices
    endings: {
        ending1: {
            id: 1,
            title: "FINAL 1 — INFORMAÇÃO E RESPONSABILIDADE",
            badge: "🏆 O Maior Impacto Positivo",
            quote: "“O conhecimento compartilhado com respeito é o melhor escudo para a nossa comunidade.”",
            background: "assets/backgrounds/menu.jpg",
            description: "Lucas aprendeu a verificar informações em fontes oficiais, procurou a Unidade Básica de Saúde para checar seu histórico vacinal e conversou pacientemente com Marina e sua irmã Ana. Ao invés de julgar quem tinha dúvidas, ele acolheu e orientou. A campanha na faculdade foi um sucesso retumbante, e a conscientização sobre a tríplice viral se espalhou por toda a comunidade acadêmica.",
            learnings: [
                "Você construiu um sólido hábito de verificação científica.",
                "Sua atitude acolhedora evitou o pânico familiar e fortaleceu os laços afetivos.",
                "A caderneta de vacinação foi conferida com orientação profissional na UBS.",
                "Você demonstrou que a vacinação é um compromisso ético e coletivo."
            ]
        },
        ending2: {
            id: 2,
            title: "FINAL 2 — DÚVIDAS QUE CONTINUAM",
            badge: "🌱 Uma Janela para o Aprendizado",
            quote: "“Reconhecer as próprias dúvidas é o primeiro passo para encontrar caminhos seguros.”",
            background: "assets/backgrounds/faculdade.jpg",
            description: "Durante a jornada, Lucas hesitou e não desenvolveu plenamente o hábito de verificar dados oficiais, deixando de conferir sua situação na UBS a tempo. Embora a desinformação ainda gere incertezas em sua rotina, o jogo não o pune: uma porta sempre permanece aberta. Ao ver o empenho de seus amigos na campanha, Lucas percebe que procurar uma unidade de saúde é um direito e uma oportunidade acessível a qualquer momento.",
            learnings: [
                "Você experimentou como o receio e a procrastinação mantêm as dúvidas vivas.",
                "Ninguém adoece como 'castigo moral': a saúde pública existe para acolher a todos sem julgamento.",
                "Buscar o SUS e conversar com profissionais capacitados é uma decisão responsável que pode ser tomada a qualquer hora."
            ]
        },
        ending3: {
            id: 3,
            title: "FINAL 3 — RECONHECER O ERRO E RECOMEÇAR",
            badge: "✨ Coragem, Humildade e Transformação",
            quote: "“Mudar de opinião diante de novas evidências não é fraqueza: é maturidade e respeito.”",
            background: "assets/backgrounds/sala.jpg",
            description: "No primeiro momento, Lucas compartilhou a mensagem alarmista no calor da emoção e sentiu o peso de ver sua família assustada. No entanto, ao invés de se defender com teimosia, ele teve a dignidade de reconhecer o erro, retificar a informação com fontes confiáveis e pedir desculpas à irmã Ana. Essa honestidade abriu espaço para um diálogo sincero e inspirou os demais a também conferirem o que compartilham.",
            learnings: [
                "Você demonstrou que errar ao repassar um boato pode acontecer com qualquer um.",
                "A verdadeira responsabilidade está em admitir, corrigir com fontes seguras e evitar julgamentos agressivos.",
                "O diálogo familiar com carinho é o remédio mais eficaz contra o medo."
            ]
        }
    },

    officialReferences: [
        {
            title: "Ministério da Saúde — Calendário Nacional de Vacinação",
            url: "https://www.gov.br/saude/pt-br/vacinacao/calendario",
            desc: "Orientações oficiais sobre as doses de tríplice viral para crianças, adolescentes, adultos e idosos."
        },
        {
            title: "Fiocruz — O que você precisa saber sobre o Sarampo",
            url: "https://portal.fiocruz.br",
            desc: "Informações científicas detalhadas sobre transmissão, sintomas, complicações e prevenção."
        },
        {
            title: "Programa Nacional de Imunizações (PNI)",
            url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/p/pni",
            desc: "Histórico de erradicação, vigilância epidemiológica e segurança das vacinas no Brasil."
        },
        {
            title: "Saúde com Ciência — Checagem de Fatos do Ministério da Saúde",
            url: "https://www.gov.br/saude/pt-br/assuntos/saude-com-ciencia",
            desc: "Canal oficial dedicado a desmentir notícias falsas e boatos sobre imunização."
        }
    ]
};
