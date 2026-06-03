const contacts = {
    qg: {
        id: "qg",
        name: "QG Kairos Detectives",
        role: "Operations Desk",
        avatar: "KD",
        photo: "assets/KD.png",
        status: "operational",
        unlocked: true,

        messages: [
            {
                from: "contact",
                text: "OnionChat secure line active. Keep this channel clean. If you need some kind of information, type help in this chat",
                time: "09:12"
            },
            {
                from: "contact",
                text: "A new client may become relevant soon: Giulia Verra. If you obtain her number, add it manually.",
                time: "09:14"
            },
            {
                from: "contact",
                text: "Translation layer enabled for Spanish contacts. Tap TRANSLATE under Javier's messages when needed.",
                time: "09:16"
            }
        ],

        fallbackReplies: [
            "Stay focused. Use OnionChat only for relevant case contacts.",
            "Unverified numbers waste operational time.",
            "If you have a real lead, proceed. Otherwise, keep the channel clear."
        ],

        triggers: [
            {
                keywords: ["giulia", "verra"],
                reply: "Giulia Verra is connected to Nathan Verra. If you have her number, add it manually."
            },
            {
                keywords: ["nathan"],
                reply: "Nathan Verra is the core subject. Cross-check all statements with external evidence."
            },
            {
                keywords: ["javier", "police", "policia"],
                reply: "Javier Morales is a local police contact. Useful, but not clean. He will probably ask for a one-time operational payment after first contact."
            }
        ]
    },

    marco: {
        id: "marco",
        name: "Marco Rinaldi",
        role: "IT Infrastructure Consultant",
        avatar: "MR",
        photo: "assets/marco.png",
        status: "online",
        unlocked: true,

        messages: [
            {
                from: "player",
                text: "Marco, we may need help reading logs and backup inconsistencies.",
                time: "10:04"
            },
            {
                from: "contact",
                text: "Send me structured data, not screenshots if possible. Logs, timestamps, server names, export files.",
                time: "10:05"
            },
            {
                from: "contact",
                text: "If a system has been cleaned after the incident, check what changed before the cleanup, not after.",
                time: "10:07"
            }
        ],

        fallbackReplies: [
            "I need technical context. What system, what timestamp, what file?",
            "That could mean nothing or everything. Send me data.",
            "Look for gaps, overwritten logs, missing IDs, mismatched timestamps."
        ],

        triggers: [
            {
                keywords: ["log", "logs", "server"],
                reply: "Logs are useful only if the timeline is intact. Look for gaps, rotations, missing entries, or records created after the event."
            },
            {
                keywords: ["backup", "database"],
                reply: "If the backup is too clean, that is suspicious. Real systems leave noise."
            },
            {
                keywords: ["veyra"],
                reply: "If Veyra controls the infrastructure, assume the exported report is curated. Ask for raw data."
            }
        ]
    },

    javier: {
        id: "javier",
        name: "Lt. Javier Morales",
        role: "Policía Provincial",
        avatar: "JM",
        photo: "assets/javier.png",
        status: "last seen recently",
        unlocked: true,
        accessPaid: false,

        accessFee: {
            amountUSD: 200,
            amountARS: "200.000 ARS",
            requestText: "Miren, si quieren que revise cosas por ustedes, les paso un link. Está armado con el monto exacto. La confirmación vuelve sola por el canal seguro.",
            requestTranslation: "Look, if you want me to check things for you, I will send you a link. It already has the exact amount. The confirmation comes back automatically through the secure channel.",
            paidText: "Recibido. Ahora sí podemos trabajar.",
            paidTranslation: "Received. Now we can work."
        },

        messages: [
            {
                from: "contact",
                text: "Buenas. Me dijeron que necesitan información sobre Veyra.",
                translation: "Hello. I was told you need information about Veyra.",
                time: "10:32"
            }
        ],

        fallbackReplies: [
            {
                text: "Capo, con eso no puedo hacer nada. Pregunten algo concreto.",
                translation: "Boss, I cannot do anything with that. Ask something concrete."
            },
            {
                text: "No me manden teoría. Díganme qué quieren saber.",
                translation: "Do not send me theories. Tell me what you want to know."
            },
            {
                text: "Eso suena a charla de oficina, no a investigación.",
                translation: "That sounds like office talk, not an investigation."
            },
            {
                text: "Hay cosas que puedo mirar y cosas que mejor ni tocar. Sean precisos.",
                translation: "There are things I can check and things I should not touch. Be precise."
            }
        ],

        intelligenceQuestions: [
            {
                keywords: [
                    "Why do local authorities allow Veyra to manage its own incidents?",
                    "¿Por qué las autoridades locales permiten que Veyra gestione sus propios incidentes?",
                    "authorities", "local authorities", "manage its own incidents", "autoridades", "incidentes"
                ],
                text: "Porque Veyra paga infraestructura, patrullas, combustible y donaciones públicas. Nadie lo llama corrupción porque viene con facturas limpias.",
                translation: "Because Veyra pays for infrastructure, patrols, fuel and public donations. Nobody calls it corruption because it comes with clean invoices."
            },
            {
                keywords: [
                    "Can an independent autopsy be requested?",
                    "¿Se puede solicitar una autopsia independiente?",
                    "autopsy", "autopsia", "independent autopsy"
                ],
                text: "La autopsia oficial no se mueve. Pero un médico privado puede mirar fotos, informes y lesiones visibles. Eso sí se puede.",
                translation: "The official autopsy will not move. But a private doctor can review photos, reports and visible injuries. That can be done."
            },
            {
                keywords: [
                    "Did the autonomous vehicle really lose control?",
                    "¿El vehículo autónomo realmente perdió el control?",
                    "vehicle", "autonomous", "lose control", "vehículo", "control"
                ],
                text: "Oficialmente perdió el control. El reporte técnico habla de desviación de trayectoria. Eso puede ser falla, orden, corrección de ruta o intervención externa.",
                translation: "Officially it lost control. The technical report mentions a trajectory deviation. That could mean failure, an order, a route correction or external intervention."
            },
            {
                keywords: [
                    "Were there cameras near the impact area?",
                    "¿Había cámaras cerca de la zona del impacto?",
                    "cameras", "camera", "impact area", "cámaras", "zona del impacto"
                ],
                text: "Sí, había cámaras. Una lateral quedó sin señal justo en los minutos importantes. Qué casualidad, ¿no?",
                translation: "Yes, there were cameras. One side camera had no signal exactly during the key minutes. What a coincidence, right?"
            },
            {
                keywords: [
                    "Was Nathan alone before the accident?",
                    "¿Nathan estaba solo antes del accidente?",
                    "Nathan alone", "alone before", "solo antes", "accidente"
                ],
                text: "En el resumen final, sí. En los registros de movimiento aparece otra presencia cerca del eje de tránsito. Esa presencia no aparece en el resumen.",
                translation: "In the final summary, yes. In the movement logs, another presence appears near the transit axis. That presence does not appear in the summary."
            },
            {
                keywords: [
                    "Who reached the scene first?",
                    "¿Quién llegó primero a la escena?",
                    "scene first", "reached first", "llegó primero", "escena"
                ],
                text: "Primero llegó personal interno de Veyra: seguridad y movilidad. La policía llegó cuando ya estaba todo embalado.",
                translation: "Veyra internal personnel arrived first: security and mobility. The police arrived when everything was already packed."
            },
            {
                keywords: [
                    "Can Veyra modify reports before local police receive them?",
                    "Veyra puede modificar informes antes de que lleguen a la policía local?",
                    "modify reports", "raw data", "local police", "modificar informes", "policía local"
                ],
                text: "La policía recibe paquetes ya procesados, no datos crudos. Si algo cambia antes, nadie lo ve. O nadie quiere verlo.",
                translation: "The police receive already processed packages, not raw data. If something changes before that, nobody sees it. Or nobody wants to see it."
            },
            {
                keywords: [
                    "Who signed the closure of the case?",
                    "¿Quién firmó el cierre del caso?",
                    "signed", "closure", "case closure", "firmó", "cierre del caso"
                ],
                text: "Firma visible de oficina local. Pero la validación técnica externa ya venía lista. El cierre estaba preparado antes de que alguien hiciera demasiadas preguntas.",
                translation: "The visible signature belongs to a local office. But the external technical validation was already ready. The closure was prepared before anyone asked too many questions."
            }
        ]
    },

    "5491132219981": {
        id: "giulia",
        name: "Giulia Verra",
        role: "Client",
        avatar: "GV",
        photo: "assets/giulia.png",
        status: "online",
        unlocked: false,

        messages: [],

        fallbackReplies: [
            "Please, just tell me if you found something.",
            "I know it sounds irrational. I know that.",
            "I don't need comfort. I need the truth."
        ],

        triggers: [
            {
                keywords: ["hello", "hi", "giulia", "nathan", "verra"],
                reply: "This is Giulia. Tell me you are working on Nathan’s case."
            },
            {
                keywords: ["accident", "crash", "vehicle"],
                reply: "They keep calling it an accident. I don't believe that anymore."
            },
            {
                keywords: ["Veyra", "company"],
                reply: "Veyra controls everything here. Records, access, people. Everything."
            },
            {
                keywords: ["truth", "help", "case"],
                reply: "I hired Kairos because no one else would listen."
            }
        ],

        periodicMessages: [
            "I found an old message from Nathan. He said Veyra was hiding something from the public logs.",
            "Nathan was scared before the accident. He tried to make it sound like stress, but it wasn’t.",
            "There is one name he kept avoiding. I don’t know why yet."
        ]
    }
};
