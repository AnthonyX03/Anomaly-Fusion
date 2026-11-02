(() => {
"use strict";
let centralSalePage=1,marketSellPage=1,marketBlackSellPage=1;

let marketBuyFilter="Todos",marketBlackBuyFilter="Todos",spawnAnomalyId=null;

let pendingConfirmAction=null;
let registrySort="Todos";
let spawnSelected={};
let smeltPage=1;
let recipeCategory="Todos";
let selectedZone=null;
let audioCtx=null,masterGain=null,lastSoundAt=0,fusionHum=null;
let zoneHudOpen=false,activeTask=null,currentEnemy=null;
let upgradeInputId=null,upgradeInputQty=1,upgradeTargetName=null,upgradeTargetQty=1,upgradeSpinning=false;
let exchangeBox={},exchangeBusy=false,exchangePending=null;
let refineInputId=null,refineTargetName=null,refineDustQty=0,refineBusy=false,refinePending=null,refineChanceLocked=null;
let slotMoneyBet=0,slotItemBet=0,slotSpinning=false,slotPrizeBox=[];

let pickerMode=null,pickerSlot=null,pickerFilter="Todos",pickerPage=1;
let centralSaleFilter="Todos",centralSaleSelection={};

let extractSelected={},marketBlackBuyMode="catalog";
let marketBuyPage=1,marketBlackBuyPage=1,extractOrgansPage=1;
let marketBlackSellSelection={};
let playerCombatHp=0,playerCombatMax=0,pendingExploreLoot=[];
let deferredInstallPrompt=null,recipePage=1;
let zonePage=1,inventoryPage=1,inventoryFilter="Todos",inventorySort="rarity",registryPage=1,registryFilter="Todos",registryMode="base",recipeFilter="Todos",lootHudOpen=false,marketBuyMode="catalog",marketSellSelection={};


const $ = id => document.getElementById(id);
const rarityNames = ["","COMÚN","POCO COMÚN","RARO","ÉPICO","LEGENDARIO"];
const rarityColors = ["","#b9c4cb","#72e48b","#55baff","#c18bff","#ffc857"];
const zones = [
 {id:"forest",name:"Bosque hundido",icon:"🌲",desc:"Vegetación densa, ruinas cubiertas de musgo y señales de movimiento entre los árboles.",risk:0,loot:["Madera","Ramas","Hojas","Seta luminosa","Resina"],enemy:0},
 {id:"mine",name:"Mina abandonada",icon:"⛏️",desc:"Galerías colapsadas con vetas metálicas. Se oyen golpes al fondo.",risk:1,loot:["Carbón","Mena de hierro","Mena de cobre","Piedra"],enemy:0.2},
 {id:"scrapyard",name:"Vertedero orbital",icon:"🛰️",desc:"Chatarra tecnológica, cables y maquinaria que aún conserva energía.",risk:1,loot:["Chatarra","Cable de cobre","Batería vieja","Placa electrónica","Tornillo oxidado"],enemy:0.2},
 {id:"swamp",name:"Pantano tóxico",icon:"☣️",desc:"Lodo fluorescente, flora mutada y criaturas que no deberían existir.",risk:2,loot:["Hoja mutada","Moco tóxico","Hongo negro","Espora viva","Colmillo"],enemy:0.55},
 {id:"quarry",name:"Cantera roja",icon:"🪨",desc:"Piedra dura y minerales expuestos. El terreno es inestable.",risk:1,loot:["Piedra","Mena de hierro","Mena de cobre","Mena de oro","Geoda"],enemy:0.25},
 {id:"bunker",name:"Búnker sellado",icon:"🚪",desc:"Un complejo militar clausurado. Hay cajas intactas y algo se mueve tras las puertas.",risk:3,loot:["Placa electrónica","Batería vieja","Aleación extraña","Núcleo energético","Tarjeta de acceso"],enemy:0.75},
 {id:"glacier",name:"Glaciar de vidrio",icon:"🧊",desc:"Una llanura helada de cristales minerales y máquinas congeladas bajo el hielo.",risk:2,loot:["Cristal de hielo azul","Mena de cobalto","Mena de titanio","Fragmento de permafrost","Batería criogénica"],enemy:0.35},
 {id:"volcano",name:"Caldera de ceniza",icon:"🌋",desc:"Ceniza caliente, vetas volcánicas y metales endurecidos por temperaturas imposibles.",risk:3,loot:["Mena de obsidiana","Mena de tungsteno","Mena de azufre","Roca volcánica","Núcleo de magma"],enemy:0.55},
 {id:"neoncity",name:"Distrito neón",icon:"🌃",desc:"Calles abandonadas iluminadas por anuncios que siguen vendiendo productos a nadie.",risk:2,loot:["Chip holográfico","Cable de fibra óptica","Batería de neón","Lente de realidad aumentada","Placa de circuito"],enemy:0.45},
 {id:"reef",name:"Arrecife abisal",icon:"🪸",desc:"Ruinas sumergidas y formas de vida bioluminiscentes que reaccionan a tu presencia.",risk:2,loot:["Perla abisal","Alga conductora","Mena de cobalto","Gel bioluminiscente","Concha blindada"],enemy:0.4},
 {id:"dunes",name:"Mar de chatarra",icon:"🏜️",desc:"Dunas metálicas, piezas corroídas y tormentas magnéticas que cambian el paisaje.",risk:1,loot:["Chatarra","Mena de aluminio","Mena de níquel","Rotor oxidado","Filtro de polvo"],enemy:0.3},
 {id:"rift",name:"Grieta dimensional",icon:"🌀",desc:"Un corte en el espacio donde la materia aparece duplicada, invertida o ligeramente equivocada.",risk:3,loot:["Fragmento dimensional","Polvo cuántico","Mena de iridio","Núcleo de fase","Cristal de paradoja"],enemy:0.8},
 {id:"lab",name:"Laboratorio sumergido",icon:"🧪",desc:"Un centro de investigación inundado. Las muestras siguen activas y los sistemas de contención fallan.",risk:3,loot:["Núcleo energético","Batería criogénica","Gel bioluminiscente","Moco tóxico","Placa electrónica"],enemy:0.7},
 {id:"silica",name:"Jardín de sílice",icon:"💎",desc:"Un bosque mineral donde los cristales crecen como ramas y almacenan ecos de energía antigua.",risk:2,loot:["Geoda","Cristal agrietado","Cristal de hielo azul","Perla abisal","Polvo cuántico"],enemy:0.45},
 {id:"station",name:"Estación de eco",icon:"📡",desc:"Un repetidor remoto atrapado en un bucle de señal. Algo responde desde canales que no existen.",risk:3,loot:["Chip holográfico","Cable de fibra óptica","Batería de neón","Fragmento dimensional","Núcleo de fase"],enemy:0.75},
 {id:"cryo",name:"Cámara criogénica",icon:"❄️",desc:"Módulos de conservación abiertos y conductos cubiertos de escarcha anómala.",risk:3,loot:["Núcleo criogénico","Vidrio de escarcha","Larva de hielo negro","Condensado térmico","Placa de aislamiento","Núcleo de marea","Tejido de sílice"],enemy:0.72},
 {id:"vault",name:"Archivo orbital",icon:"🗄️",desc:"Una bóveda de datos suspendida sobre un planeta sin señales de vida.",risk:3,loot:["Cinta de memoria","Chip de navegación","Centinela de archivo","Lámina de datos","Sello de cartógrafo","Placa de eco","Módulo de rastreo"],enemy:0.78},
 {id:"root",name:"Raíces de titanio",icon:"🌳",desc:"Raíces metálicas atraviesan las ruinas y transportan energía entre estructuras.",risk:3,loot:["Raíz metálica","Polen de espectro","Ciervo de ferrita","Resina conductora","Espora de cable","Tejido de sílice","Mantis de sílice"],enemy:0.7},
 {id:"foundry",name:"Fundición errante",icon:"⚙️",desc:"Una fábrica móvil continúa produciendo piezas para una orden desaparecida.",risk:3,loot:["Escoria viva","Lingote de osmio","Gólem de escoria","Catalizador térmico","Válvula de presión","Válvula de fase","Bobina fractal","Ingeniero errante"],enemy:0.82},
 {id:"observatory",name:"Observatorio fractal",icon:"🔭",desc:"Sus telescopios muestran rutas y objetos que todavía no existen en esta línea temporal.",risk:3,loot:["Lente fractal","Fragmento de órbita","Polvo de paradoja","Vigía orbital","Prisma de deriva","Cristal umbral","Bobina fractal","Custodio de deriva"],enemy:0.85},
 {id:"nullshore",name:"Costa nula",icon:"🌑",desc:"Una costa donde las señales desaparecen y la materia pierde parte de su masa.",risk:3,loot:["Arena nula","Perla de vacío","Medusa de eco","Membrana de fase","Ancla de realidad","Polímero abisal","Núcleo de marea","Peregrino nulo","Medusa de vacío"],enemy:0.9}
];
const itemDB = {
 "Madera":{icon:"🪵",cat:"Material",r:1,val:3,desc:"Madera recuperada. Base de muchas recetas."},
 "Ramas":{icon:"🌿",cat:"Material",r:1,val:2,desc:"Ramas flexibles para herramientas improvisadas."},
 "Hojas":{icon:"🍃",cat:"Material",r:1,val:2,desc:"Hojas resistentes de bosque."},
 "Carbón":{icon:"⬛",cat:"Material",r:1,val:4,desc:"Combustible para el horno industrial."},
 "Mena de hierro":{icon:"⛓️",cat:"Material",r:1,val:5,desc:"Mineral bruto con hierro aprovechable."},
 "Mena de cobre":{icon:"🟠",cat:"Material",r:1,val:5,desc:"Mineral cobrizo."},
 "Mena de oro":{icon:"🟡",cat:"Material",r:2,val:12,desc:"Veta dorada poco frecuente."},
 "Piedra":{icon:"🪨",cat:"Material",r:1,val:2,desc:"Piedra común de cantera."},
 "Seta luminosa":{icon:"🍄",cat:"Material",r:2,val:8,desc:"Brilla suavemente en la oscuridad."},
 "Resina":{icon:"🟤",cat:"Material",r:1,val:4,desc:"Resina pegajosa y combustible."},
 "Cristal agrietado":{icon:"💎",cat:"Material",r:2,val:10,desc:"Cristal con extrañas inclusiones."},
 "Chatarra":{icon:"🔩",cat:"Material",r:1,val:4,desc:"Piezas metálicas reutilizables."},
 "Cable de cobre":{icon:"〰️",cat:"Material",r:1,val:5,desc:"Cable conductor recuperado."},
 "Batería vieja":{icon:"🔋",cat:"Material",r:2,val:12,desc:"Aún guarda algo de carga."},
 "Placa electrónica":{icon:"🧩",cat:"Material",r:2,val:14,desc:"Circuitería de tecnología desconocida."},
 "Tornillo oxidado":{icon:"🔧",cat:"Material",r:1,val:2,desc:"Pequeño, pero útil."},
 "Hoja mutada":{icon:"🌱",cat:"Material",r:2,val:9,desc:"Flora alterada por contaminación."},
 "Moco tóxico":{icon:"🧪",cat:"Material",r:2,val:10,desc:"Sustancia viscosa con propiedades corrosivas."},
 "Hongo negro":{icon:"🍄",cat:"Material",r:2,val:8,desc:"Hongo que absorbe la luz."},
 "Espora viva":{icon:"🫧",cat:"Material",r:3,val:22,desc:"Organismo microscópico activo."},
 "Colmillo":{icon:"🦷",cat:"Material",r:2,val:9,desc:"Fragmento de una criatura hostil."},
 "Aleación extraña":{icon:"🪙",cat:"Material",r:3,val:25,desc:"Metal de composición desconocida."},
 "Núcleo energético":{icon:"🔮",cat:"Material",r:4,val:55,desc:"Un núcleo que vibra con energía contenida."},
 "Tarjeta de acceso":{icon:"🪪",cat:"Otro",r:3,val:28,desc:"Abre cerraduras de instalaciones antiguas."},
 "Geoda":{icon:"💠",cat:"Material",r:2,val:12,desc:"Piedra con un interior cristalino."},
 "Lingote de hierro":{icon:"🧱",cat:"Lingote",r:2,val:14,desc:"Hierro refinado en el horno."},
 "Lingote de cobre":{icon:"🟫",cat:"Lingote",r:2,val:14,desc:"Cobre refinado en el horno."},
 "Lingote de oro":{icon:"🟨",cat:"Lingote",r:3,val:35,desc:"Oro refinado y brillante."},
 "Pico de chatarra":{icon:"⛏️",cat:"Herramienta",r:1,val:18,desc:"Aumenta un 15% las probabilidades de obtener minerales.",slot:"pick",gather:15,damage:2},
 "Pico de hierro":{icon:"⛏️",cat:"Herramienta",r:2,val:40,desc:"Pico sólido. +30% hallazgos minerales.",slot:"pick",gather:30,damage:5},
 "Hacha de madera":{icon:"🪓",cat:"Herramienta",r:1,val:18,desc:"Aumenta un 20% la recolección en bosques.",slot:"axe",gather:20,damage:2},
 "Hacha de hierro":{icon:"🪓",cat:"Herramienta",r:2,val:42,desc:"Hacha resistente. +35% recolección vegetal.",slot:"axe",gather:35,damage:6},
 "Cuchillo oxidado":{icon:"🔪",cat:"Arma",r:1,val:16,desc:"Arma básica. +5 daño.",slot:"weapon",damage:5},
 "Bate claveteado":{icon:"🏏",cat:"Arma",r:2,val:35,desc:"Arma improvisada. +10 daño.",slot:"weapon",damage:10},
 "Espada de cobre":{icon:"⚔️",cat:"Arma",r:2,val:45,desc:"Hoja de cobre. +14 daño.",slot:"weapon",damage:14},
 "Cañón de bolsillo":{icon:"🔫",cat:"Arma",r:3,val:90,desc:"Un cañón ridículamente compacto. +24 daño.",slot:"weapon",damage:24},
 "Armadura de chatarra":{icon:"🛡️",cat:"Herramienta",r:2,val:42,desc:"Protección improvisada. +8 defensa.",slot:"armor",defense:8},
 "Traje de esporas":{icon:"🧥",cat:"Herramienta",r:3,val:85,desc:"Traje parcialmente vivo. +16 defensa.",slot:"armor",defense:16},
 "Zombie de bolsillo":{icon:"🧟",cat:"Criatura",r:3,val:50,desc:"Un zombie capturado en un contenedor demasiado pequeño."},
 "Zombie jardinero":{icon:"🧟‍♂️",cat:"Criatura",r:3,val:65,desc:"Mutación vegetal que insiste en cuidar plantas inexistentes."},
 "Gato de chatarra":{icon:"🐈‍⬛",cat:"Criatura",r:3,val:48,desc:"Felino mecánico con instinto para encontrar piezas."},
 "Gólem de carbón":{icon:"🪨",cat:"Criatura",r:4,val:90,desc:"Una criatura pesada nacida en las profundidades."},
 "Humano enlatado":{icon:"🧑‍🚀",cat:"Criatura",r:4,val:100,desc:"Una persona rescatada de una cápsula de conservación."},
 "Pico de cristal":{icon:"🔱",cat:"Herramienta",r:4,val:140,desc:"Herramienta resonante. +55% hallazgos minerales.",slot:"pick",gather:55,damage:12},
 "Hacha solar":{icon:"🌞",cat:"Herramienta",r:4,val:145,desc:"Corta incluso conceptos abstractos. +60% recolección vegetal.",slot:"axe",gather:60,damage:15},
 "Espada de rayos":{icon:"⚡",cat:"Arma",r:4,val:180,desc:"Una espada que discute con la física. +40 daño.",slot:"weapon",damage:40},
 "Escudo de vacío":{icon:"🛡️",cat:"Herramienta",r:4,val:160,desc:"El vacío absorbe golpes y malos comentarios. +30 defensa.",slot:"armor",defense:30}
};
// Catálogo ampliado: combina familias temáticas para mantener cientos de objetos base coherentes.
const generatedItems=[];
function addGenerated(name,data){if(!itemDB[name]){itemDB[name]=data;generatedItems.push(name)}}
// Contenido nuevo 1.3: materiales de campo y criaturas base capturables.
[
 ["Gel de presión","🫧","Material",2,13,"Gel elástico extraído de organismos que viven bajo presión extrema."],
 ["Escama ferrítica","🛡️","Material",3,24,"Escama mineralizada que conduce campos magnéticos."],
 ["Polen de espectro","✨","Material",3,26,"Polen luminoso que deja rastros visibles fuera del espectro normal."],
 ["Núcleo de nido","🥚","Material",4,42,"Cápsula orgánica que mantiene estable una colonia diminuta."],
 ["Lente de rastreo","🔎","Material",2,17,"Lente sensible a las firmas térmicas de criaturas y anomalías."],
 ["Membrana de fase","🪼","Material",4,48,"Tejido semitransparente que fluctúa entre estados de materia."],
 ["Caparazón de sílice","🐚","Material",3,29,"Placa protectora formada por cristal y materia orgánica."],
 ["Batería de esporas","🔋","Material",3,31,"Celda bioeléctrica alimentada por una colonia de esporas."],
 ["Dron polinizador","🛸","Herramienta",2,38,"Dron pequeño para rastrear flora y recolectar muestras.","pick",16,5],
 ["Trampa de feromonas","🪤","Consumible",2,22,"Dispositivo que atrae criaturas pequeñas durante una expedición."],
 ["Emisor de eco","📡","Consumible",3,34,"Pulso de corto alcance que revela firmas ocultas."],
 ["Cápsula de contención","🧫","Consumible",3,36,"Contenedor reforzado para estabilizar organismos recuperados."],
 ["Archivo de ceniza","📜","Material",2,19,"Lámina carbonizada con un registro parcial del día en que una colonia desapareció. Bajo luz ultravioleta, sus marcas forman coordenadas que ya no coinciden con el terreno."],
 ["Sello de cartógrafo","🧭","Otro",3,33,"Insignia de una orden de exploradores extinta. Su aguja no apunta al norte, sino hacia rutas que fueron borradas de los mapas oficiales."],
 ["Ampolla de memoria","🧪","Material",4,47,"Vial de vidrio oscuro que conserva unos segundos de sonido y luz de una instalación perdida. Abrirla sin estabilizarla puede destruir la grabación para siempre."]
].forEach(([name,icon,cat,r,val,desc,slot,gather,damage])=>addGenerated(name,{icon,cat,r,val,desc,slot,gather,damage}));
[
 ["Larva de ferrita","🪲",2,34,"Criatura mineral pequeña que detecta metales cercanos."],
 ["Polilla de fase","🦋",3,48,"Insecto anómalo capaz de desaparecer durante breves instantes."],
 ["Simbionte de presión","🪼",3,52,"Organismo gelatinoso que refuerza a su huésped bajo presión."],
 ["Vigía de sílice","🦎",3,58,"Reptil cristalino que detecta movimiento a gran distancia."],
 ["Cangrejo de chatarra","🦀",2,39,"Crustáceo mecánico que acumula tornillos y piezas brillantes."],
 ["Esporífero errante","🍄",3,55,"Criatura fúngica que dispersa esporas defensivas."],
 ["Gólem de escoria","🗿",4,82,"Coloso de roca fundida con una coraza de ceniza endurecida."],
 ["Medusa de eco","🪼",4,88,"Entidad flotante que imita señales de radio para atraer presas."],
 ["Sabueso de neón","🐺",3,63,"Depredador artificial que sigue rastros eléctricos."],
 ["Náufrago abisal","🐟",4,76,"Organismo adaptado a ruinas inundadas y oscuridad total."],
 ["Archivista hueco","🕯️",4,91,"Entidad que recorre bibliotecas derrumbadas y guarda fragmentos de recuerdos ajenos. Sus habilidades procedurales tienden a favorecer exploración, suerte o experiencia."],
 ["Cartógrafo de la grieta","🦑",5,118,"Criatura de extremidades translúcidas que dibuja rutas en el aire antes de que aparezcan. Sus habilidades procedurales pueden favorecer botín, captura o resistencia."]
].forEach(([name,icon,r,val,desc])=>addGenerated(name,{icon,cat:"Criatura",r,val,desc,companion:true,unique:true}));
// Catálogo base de la versión 2.0: recursos, artefactos y criaturas de nuevas regiones.
[
 ["Núcleo criogénico","🧊","Material",4,58,"Celda de frío estable recuperada de una cámara de conservación."],
 ["Vidrio de escarcha","❄️","Material",3,31,"Cristal que mantiene una temperatura inferior a la del entorno."],
 ["Larva de hielo negro","🪱","Criatura",4,84,"Organismo criogénico que se oculta en las juntas de los módulos."],
 ["Condensado térmico","💧","Material",3,27,"Fluido industrial que almacena calor durante unos segundos."],
 ["Placa de aislamiento","🧱","Material",3,29,"Panel técnico preparado para cámaras de presión y frío."],
 ["Cinta de memoria","📼","Material",3,35,"Cinta recuperada con fragmentos de telemetría."],
 ["Chip de navegación","🧭","Material",4,49,"Procesador que conserva coordenadas de rutas orbitales."],
 ["Centinela de archivo","🤖","Criatura",4,98,"Autómata de seguridad que protege registros de acceso restringido."],
 ["Lámina de datos","📄","Material",2,18,"Placa flexible con información parcialmente recuperable."],
 ["Raíz metálica","🌿","Material",3,32,"Filamento mineral vivo que transporta impulsos eléctricos."],
 ["Ciervo de ferrita","🦌","Criatura",4,96,"Criatura de placas magnéticas que detecta depósitos bajo tierra."],
 ["Resina conductora","🟠","Material",3,28,"Resina orgánica con alta conductividad eléctrica."],
 ["Espora de cable","🧬","Material",3,25,"Espora filamentosa capaz de crecer alrededor de conductores."],
 ["Escoria viva","🌋","Material",4,46,"Residuo metálico que mantiene actividad térmica propia."],
 ["Lingote de osmio","⬛","Lingote",5,105,"Metal extremadamente denso, apto para equipo de alto nivel."],
 ["Catalizador térmico","🔥","Consumible",4,44,"Reactivo que acelera el procesamiento de materiales resistentes."],
 ["Válvula de presión","🔩","Material",3,23,"Componente industrial para regular sistemas de alta presión."],
 ["Lente fractal","🔮","Material",4,61,"Óptica que divide una señal en múltiples trayectorias posibles."],
 ["Fragmento de órbita","🪐","Material",4,57,"Fragmento de aleación orbital con trayectoria registrada."],
 ["Polvo de paradoja","✨","Material",5,88,"Partículas que responden de forma distinta a mediciones repetidas."],
 ["Vigía orbital","👁️","Criatura",5,128,"Entidad mecánica que observa varias posiciones del mismo espacio."],
 ["Prisma de deriva","💠","Material",4,63,"Prisma que refracta señales procedentes de rutas alternativas."],
 ["Arena nula","⚫","Material",4,54,"Granulado que reduce temporalmente la lectura de masa."],
 ["Perla de vacío","🫧","Material",5,92,"Nódulo formado en zonas donde la materia se vuelve inestable."],
 ["Ancla de realidad","⚓","Otro",5,120,"Dispositivo pesado diseñado para estabilizar un área anómala."],
 ["Dron de prospección Mk-II","🛸","Herramienta",3,58,"Dron mejorado para escanear recursos en zonas de alto riesgo.","pick",28,9],
 ["Sierra de resonancia","🪚","Herramienta",3,62,"Sierra que corta materiales cristalinos sin fracturarlos.","axe",32,11],
 ["Pistola de arco","🔫","Arma",3,78,"Arma de pulsos eléctricos de corto alcance.","weapon",0,26],
 ["Lanza de contención","🔱","Arma",4,116,"Lanza reforzada para neutralizar organismos de gran tamaño.","weapon",0,34],
 ["Exotraje criogénico","🥶","Equipo",4,132,"Traje aislante con protección para entornos extremos.","armor",0,0],
 ["Módulo de botín avanzado","📦","Consumible",4,72,"Módulo de un solo uso que mejora la recuperación de objetos."]
].forEach(([name,icon,cat,r,val,desc,slot,gather,damage])=>addGenerated(name,{icon,cat,r,val,desc,slot,gather:gather||0,damage:damage||0,defense:cat==="Equipo"?24:0,companion:cat==="Criatura"}));
[
 ["Placa de eco","📡","Material",3,34,"Placa sensible a señales de radio residuales."],
 ["Polímero abisal","🫧","Material",4,48,"Polímero flexible que soporta presión extrema."],
 ["Bobina fractal","🌀","Material",4,60,"Bobina que mantiene varias frecuencias estables a la vez."],
 ["Módulo de rastreo","📍","Material",2,18,"Módulo que detecta movimiento y firmas térmicas."],
 ["Cristal umbral","💠","Material",5,90,"Cristal raro que responde a los límites entre regiones."],
 ["Válvula de fase","🔧","Material",4,51,"Válvula que regula el paso de materia inestable."],
 ["Núcleo de marea","🔵","Material",4,56,"Núcleo energético recuperado de sistemas de presión variable."],
 ["Tejido de sílice","🕸️","Material",3,33,"Fibra cristalina ligera para equipo protector."],
 ["Ingeniero errante","🦾","Criatura",4,103,"Autómata de mantenimiento que repara máquinas sin recibir órdenes."],
 ["Mantis de sílice","🦗","Criatura",4,94,"Depredador cristalino que se camufla entre minerales."],
 ["Custodio de deriva","🛡️","Criatura",5,132,"Guardián de rutas dimensionales que persigue intrusos."],
 ["Medusa de vacío","🪼","Criatura",5,137,"Entidad flotante que absorbe señales y energía."],
 ["Escarabajo de osmio","🪲","Criatura",5,141,"Artrópodo blindado que acumula metales densos."],
 ["Peregrino nulo","🌑","Criatura",5,145,"Forma de vida que deja zonas de silencio a su paso."]
].forEach(([name,icon,cat,r,val,desc])=>addGenerated(name,{icon,cat,r,val,desc,companion:cat==="Criatura",unique:cat==="Criatura"}));
const mineralRoots=["basalto","cobalto","titanio","níquel","aluminio","estaño","zinc","plomo","wolframio","tungsteno","litio","iridio","platino","paladio","uranio","obsidiana","azufre","cuarzo","jade","ónix","granito","hematita","manganeso","cromo","vanadio","magnesio","circonio","bismuto","antimonio","galena"];
const mineralQualities=["común","veteada","densa"];
mineralRoots.forEach((root,i)=>{
 const proper=root.charAt(0).toUpperCase()+root.slice(1);
 const lingoteR=({basalto:2,cobalto:3,titanio:3,níquel:2,aluminio:2,estaño:2,zinc:2,plomo:2,wolframio:4,tungsteno:4,litio:3,iridio:5,platino:5,paladio:4,uranio:5,obsidiana:4,azufre:2,cuarzo:2,jade:3,"ónix":3,granito:2,hematita:3,manganeso:2,cromo:3,vanadio:3,magnesio:2,circonio:3,bismuto:3,antimonio:2,galena:2})[root]||2;
 const menaR=Math.max(1,lingoteR-1);
 addGenerated(`Mena de ${root}`,{icon:["⛏️","🪨","💠"][i%3],cat:"Material",r:menaR,val:4+menaR*5+(i%4)*2,desc:`Mineral bruto de ${root}, extraído de vetas geológicas. Se puede refinar en el horno.`});
 addGenerated(`Lingote de ${root}`,{icon:["🧱","🟫","🪙"][i%3],cat:"Lingote",r:lingoteR,val:10+lingoteR*12+(i%5)*2,desc:`${proper} refinado a partir de mena de ${root}; útil para fabricar equipo y componentes.`});
});
// Niveles coherentes de lingotes/menas clave
[["iridio",5],["platino",5],["uranio",5],["paladio",4],["tungsteno",4],["wolframio",4],["obsidiana",4],["titanio",3],["cobalto",3],["níquel",3],["hierro",2],["cobre",2],["aluminio",2]].forEach(([root,r])=>{
  const mena=`Mena de ${root}`, ling=`Lingote de ${root}`;
  if(itemDB[mena])itemDB[mena].r=Math.max(1,r-1);
  if(itemDB[ling])itemDB[ling].r=r;
});
const toolBases=["Pico","Hacha","Pinzas"];
const toolMaterials=["de basalto","de cobre","de titanio","de obsidiana","de cuarzo","de cobalto","de chatarra","de cristal","de níquel","de iridio"];
toolBases.forEach((base,i)=>toolMaterials.slice(0,6).forEach((mat,j)=>{
 const name=`${base} ${mat}`;
 const slot=base==="Pico"?"pick":base==="Hacha"?"axe":base==="Pinzas"?"tongs":null;
 const icon=base==="Pico"?"⛏️":base==="Hacha"?"🪓":"⚕";
 const extractBonus=base==="Pinzas"?6+((i+j)%20):0;
 addGenerated(name,{icon,cat:"Herramienta",r:1+((i+j)%4),val:18+((i*7+j*11)%80),desc:base==="Pinzas"?`Instrumento de extracción ${mat}. +${extractBonus||6}% éxito.`:`${base} ${mat}. Herramienta de campo.`,slot,gather:base==="Pinzas"?0:10+((i+j*3)%40),damage:base==="Pinzas"?0:2+((i+j)%12),extractBonus:base==="Pinzas"?extractBonus:undefined});
}));
const weaponBases=["Cuchillo","Espada","Lanza","Maza","Pistola","Rifle","Ballesta","Arco","Bastón","Guantelete","Daga","Hoz","Cañón","Látigo","Hacha de combate","Lanzador","Sable","Martillo de guerra","Rayo portátil","Disruptor"];
const weaponMats=["de cobre","de hierro","de titanio","de cristal","de neón","de obsidiana","de chatarra","de cuarzo","de tungsteno","de fase"];
weaponBases.forEach((base,i)=>weaponMats.slice(0,6).forEach((mat,j)=>{const name=`${base} ${mat}`;addGenerated(name,{icon:["⚔️","🗡️","🔫","🏹","🔨"][i%5],cat:"Arma",r:1+((i+j)%5),val:22+((i*9+j*13)%160),desc:`Arma de combate con diseño y peso adaptados al material.`,slot:"weapon",damage:5+((i*3+j*4)%42)});}));
const gearBases=["Casco","Peto","Grebas","Guantes","Botas","Máscara","Traje","Escudo","Manto","Visor","Arnés","Exoesqueleto","Hombreras","Placa dorsal","Capa","Filtro","Brazalete","Amuleto","Cinturón","Blindaje"];
const gearMats=["de hierro","de titanio","de obsidiana","de esporas","de neón","de cuarzo","de cobalto","de fibra","de fase","de chatarra"];
gearBases.forEach((base,i)=>gearMats.slice(0,6).forEach((mat,j)=>{const name=`${base} ${mat}`;addGenerated(name,{icon:["🪖","🛡️","🥾","🧤","🧥"][i%5],cat:"Equipo",r:1+((i+j)%5),val:25+((i*11+j*9)%145),desc:`Preparado para proteger al operador en condiciones hostiles.`,slot:"armor",defense:3+((i*2+j*3)%35)});}));
// Consumibles claros y reducidos (sin explosión combinatorial)
[
 ["Kit médico de campo","Consumible",1,14,"Restaura integridad tras un combate. Uso de expedición."],
 ["Ración compacta","Consumible",1,8,"Comida densa para mantener la operación en zona."],
 ["Bengala de señal","Consumible",1,10,"Marca tu posición y facilita el regreso a base."],
 ["Antídoto estable","Consumible",2,22,"Neutraliza toxinas y esporas de zonas contaminadas."],
 ["Poción de blindaje","Consumible",2,28,"Aumenta temporalmente la defensa en el próximo combate."],
 ["Célula de energía","Consumible",2,24,"Recarga equipos y herramientas de campo."],
 ["Baliza de rescate","Consumible",3,36,"Mejora la tasa de hallazgos en la siguiente expedición."],
 ["Estimulante de combate","Consumible",3,40,"Aumenta temporalmente el daño en el próximo combate."],
 ["Filtro tóxico","Consumible",3,32,"Reduce el riesgo en zonas de alta contaminación."],
 ["Carga de reparación","Consumible",4,48,"Repara desgaste de herramientas tras uso intensivo."],
 ["Suero de claridad","Consumible",4,52,"Mejora la precisión y reduce fallos en extracción."],
 ["Catalizador de campo","Consumible",5,70,"Acelera procesos de fabricación durante un ciclo corto."]
].forEach(([name,cat,r,val,desc])=>{if(!itemDB[name])addGenerated(name,{icon:"🧪",cat,r,val,desc,consumable:true});});

// Distribuye los nuevos recursos en las zonas apropiadas; todas las entradas son descubribles jugando.
const lootFor=(id,filter,limit=14)=>{const z=zones.find(x=>x.id===id);if(z)z.loot.push(...generatedItems.filter(n=>filter(itemDB[n],n)).slice(0,limit))};
// Botín repartido: la mina ya no acapara menas; cada zona recibe pocas entradas temáticas.
lootFor("mine",(d,n)=>d.cat==="Material"&&/Mena de (hierro|cobre|carbón|piedra)/i.test(n)||n==="Carbón"||n==="Piedra",2);
lootFor("quarry",(d,n)=>d.cat==="Material"&&/Mena de (hierro|cobre|oro|zinc|plomo)/i.test(n),4);
lootFor("dunes",(d,n)=>d.cat==="Material"&&/Mena de (aluminio|níquel|zinc|plomo)/i.test(n),3);
lootFor("foundry",(d,n)=>d.cat==="Material"&&/Mena de (hierro|cobre|níquel)/i.test(n),3);
lootFor("root",(d,n)=>d.cat==="Material"&&/Mena de/.test(n),2);
lootFor("glacier",(d,n)=>/cobalto|titanio|níquel|litio|cuarzo|circonio/i.test(n),5);
lootFor("volcano",(d,n)=>/basalto|obsidiana|wolframio|tungsteno|azufre|hematita/i.test(n),5);
lootFor("neoncity",(d,n)=>/neón|circuito|batería|módulo|detector|visor/i.test(n),5);
lootFor("reef",(d,n)=>/cuarzo|jade|paladio|perla|alga|gel/i.test(n),4);
lootFor("dunes",(d,n)=>/aluminio|níquel|zinc|plomo|chatarra|rotor/i.test(n),4);
lootFor("rift",(d,n)=>/iridio|uranio|fase|anómalo|paradoja|cuántico/i.test(n),5);
lootFor("scrapyard",(d,n)=>/chatarra|cable|batería|tornillo|placa/i.test(n),3);
lootFor("bunker",(d,n)=>/placa|batería|aleación|núcleo|tarjeta/i.test(n),3);

// Botín adicional de la revisión 1.3, incluidos organismos base recuperables.
const addZoneLoot=(id,names)=>{const z=zones.find(x=>x.id===id);if(z)names.forEach(n=>{if(itemDB[n]&&!z.loot.includes(n))z.loot.push(n)})};
addZoneLoot("swamp",["Polen de espectro","Batería de esporas","Esporífero errante"]);addZoneLoot("mine",["Escama ferrítica","Larva de ferrita"]);addZoneLoot("glacier",["Membrana de fase","Polilla de fase"]);addZoneLoot("neoncity",["Lente de rastreo","Sabueso de neón"]);addZoneLoot("reef",["Gel de presión","Náufrago abisal"]);addZoneLoot("volcano",["Caparazón de sílice","Gólem de escoria"]);addZoneLoot("station",["Medusa de eco","Emisor de eco","Archivo de ceniza","Sello de cartógrafo"]);addZoneLoot("rift",["Ampolla de memoria"]);
// Cada recurso que aparece como botín de una zona tiene una ficha de catálogo real.
zones.forEach((z,zi)=>z.loot.forEach((name,j)=>{if(!itemDB[name])addGenerated(name,{icon:["🪨","🧊","🌋","🧬","⚙️"][zi%5],cat:"Material",r:Math.min(5,Math.max(1,z.risk+1)),val:5+z.risk*8+(j%4)*3,desc:`Recurso recuperado en ${z.name}. Presenta propiedades propias del entorno y puede emplearse en fabricación o investigación.`})}));

// Materiales procesados que se fabrican en la Mesa, no solo se encuentran explorando.
[
 ["Fibra vegetal", "🧵", 1, 4, "Fibras secas trenzadas para cordajes y tejidos básicos."],
 ["Cuerda de fibra", "➰", 1, 6, "Cuerda resistente creada con fibras vegetales."],
 ["Tabla reforzada", "🪵", 1, 7, "Madera cortada y reforzada para estructuras y mangos."],
 ["Ladrillo de piedra", "🧱", 1, 5, "Piedra triturada y prensada en un bloque uniforme."],
 ["Vidrio reciclado", "🔹", 2, 9, "Fragmentos de cristal fundidos en una lámina imperfecta."],
 ["Cable trenzado", "〰️", 2, 11, "Conductores de cobre y fibra unidos para soportar más carga."],
 ["Placa de aleación", "⚙️", 2, 16, "Chatarra y metal refinado prensados en una placa útil."],
 ["Polvo de carbón", "⚫", 1, 3, "Carbón molido para mezclas industriales y reactivos."],
 ["Compuesto aislante", "🧪", 3, 18, "Resina y fibras tratadas para aislar calor y electricidad."],
 ["Cristal pulido", "💎", 2, 14, "Cristal agrietado pulido para instrumentos y lentes."],
 ["Núcleo de batería", "🔋", 3, 22, "Celda energética reconstruida a partir de una batería usada."],
 ["Aleación ligera", "🪙", 3, 24, "Mezcla metálica ligera preparada para piezas de precisión."]
].forEach(([name,icon,r,val,desc])=>addGenerated(name,{icon,cat:"Material",r,val,desc}));
const recipes = [
 // === HERRAMIENTAS ===
 {id:"pick_wood",name:"Pico de madera",icon:"⛏️",desc:"Pico improvisado de madera y ramas.",cost:{"Madera":3,"Ramas":2},out:"Pico de madera",category:"Herramienta"},
 {id:"pick_scrap",name:"Pico de chatarra",icon:"⛏️",desc:"Cabeza de chatarra y mango de madera.",cost:{"Madera":2,"Chatarra":3},out:"Pico de chatarra",category:"Herramienta"},
 {id:"pick_stone",name:"Pico de piedra",icon:"⛏️",desc:"Punta de piedra ligada con resina.",cost:{"Piedra":4,"Madera":2,"Resina":1},out:"Pico de piedra",category:"Herramienta"},
 {id:"pick_iron",name:"Pico de hierro",icon:"⛏️",desc:"Pico de lingote de hierro con mango de madera.",cost:{"Lingote de hierro":3,"Madera":2},out:"Pico de hierro",category:"Herramienta"},
 {id:"pick_copper",name:"Pico de cobre",icon:"⛏️",desc:"Pico de lingote de cobre, más ligero.",cost:{"Lingote de cobre":3,"Madera":2,"Ramas":1},out:"Pico de cobre",category:"Herramienta"},
 {id:"pick_titanium",name:"Pico de titanio",icon:"⛏️",desc:"Pico de lingote de titanio para menas duras.",cost:{"Lingote de titanio":3,"Madera":2},out:"Pico de titanio",category:"Herramienta"},
 {id:"pick_cobalt",name:"Pico de cobalto",icon:"⛏️",desc:"Pico de lingote de cobalto, resistente al frío.",cost:{"Lingote de cobalto":3,"Cristal de hielo azul":1,"Madera":1},out:"Pico de cobalto",category:"Herramienta"},
 {id:"pick_obsidian",name:"Pico de obsidiana",icon:"⛏️",desc:"Filo volcánico de lingote de obsidiana.",cost:{"Lingote de obsidiana":3,"Roca volcánica":1,"Madera":1},out:"Pico de obsidiana",category:"Herramienta"},
 {id:"pick_tungsten",name:"Pico de tungsteno",icon:"⛏️",desc:"Pico de lingote de tungsteno, máxima dureza.",cost:{"Lingote de tungsteno":3,"Carbón":2,"Madera":1},out:"Pico de tungsteno",category:"Herramienta"},
 {id:"pick_nickel",name:"Pico de níquel",icon:"⛏️",desc:"Pico de lingote de níquel para vetas corrosivas.",cost:{"Lingote de níquel":3,"Chatarra":1,"Madera":1},out:"Pico de níquel",category:"Herramienta"},
 {id:"pick_quartz",name:"Pico de cuarzo",icon:"⛏️",desc:"Punta de cuarzo sobre mango reforzado.",cost:{"Cristal agrietado":3,"Madera":2,"Resina":1},out:"Pico de cuarzo",category:"Herramienta"},
 {id:"axe_wood",name:"Hacha de madera",icon:"🪓",desc:"Hacha de leñador: madera y ramas.",cost:{"Madera":2,"Ramas":3},out:"Hacha de madera",category:"Herramienta"},
 {id:"axe_scrap",name:"Hacha de chatarra",icon:"🪓",desc:"Filo de chatarra sobre mango de madera.",cost:{"Madera":2,"Chatarra":2,"Ramas":1},out:"Hacha de chatarra",category:"Herramienta"},
 {id:"axe_iron",name:"Hacha de hierro",icon:"🪓",desc:"Hacha de lingote de hierro y madera.",cost:{"Lingote de hierro":2,"Madera":2,"Ramas":1},out:"Hacha de hierro",category:"Herramienta"},
 {id:"axe_copper",name:"Hacha de cobre",icon:"🪓",desc:"Hacha de lingote de cobre para tala ligera.",cost:{"Lingote de cobre":2,"Madera":2},out:"Hacha de cobre",category:"Herramienta"},
 {id:"axe_titanium",name:"Hacha de titanio",icon:"🪓",desc:"Hacha de lingote de titanio, resistente y ligera.",cost:{"Lingote de titanio":2,"Madera":2,"Ramas":1},out:"Hacha de titanio",category:"Herramienta"},
 {id:"axe_obsidian",name:"Hacha de obsidiana",icon:"🪓",desc:"Hacha de lingote de obsidiana para corte extremo.",cost:{"Lingote de obsidiana":2,"Madera":1,"Resina":1},out:"Hacha de obsidiana",category:"Herramienta"},
 {id:"axe_cobalt",name:"Hacha de cobalto",icon:"🪓",desc:"Hacha de lingote de cobalto templada en frío.",cost:{"Lingote de cobalto":2,"Cristal de hielo azul":1,"Madera":1},out:"Hacha de cobalto",category:"Herramienta"},
 {id:"axe_tungsten",name:"Hacha de tungsteno",icon:"🪓",desc:"Hacha de lingote de tungsteno, corte industrial.",cost:{"Lingote de tungsteno":2,"Carbón":1,"Madera":2},out:"Hacha de tungsteno",category:"Herramienta"},
 {id:"tongs1",name:"Pinzas oxidadas",icon:"⚕",desc:"Pinzas de chatarra. +6% éxito de extracción.",cost:{"Chatarra":2,"Ramas":1},out:"Pinzas oxidadas",category:"Herramienta"},
 {id:"tongs_iron",name:"Pinzas de hierro",icon:"⚕",desc:"Pinzas de lingote de hierro. +12% éxito.",cost:{"Lingote de hierro":2,"Chatarra":1},out:"Pinzas de hierro",category:"Herramienta"},
 {id:"tongs_copper",name:"Pinzas de cobre",icon:"⚕",desc:"Pinzas de lingote de cobre. +16% éxito.",cost:{"Lingote de cobre":2,"Cable de cobre":1},out:"Pinzas de cobre",category:"Herramienta"},
 {id:"tongs_titanium",name:"Pinzas de titanio",icon:"⚕",desc:"Pinzas de lingote de titanio. +20% éxito.",cost:{"Lingote de titanio":2,"Cristal agrietado":1},out:"Pinzas de titanio",category:"Herramienta"},
 {id:"tongs_cobalt",name:"Pinzas de cobalto",icon:"⚕",desc:"Pinzas de lingote de cobalto. +22% éxito.",cost:{"Lingote de cobalto":2,"Cristal de hielo azul":1},out:"Pinzas de cobalto",category:"Herramienta"},
 
 {id:"driver1",name:"Destornillador oxidado",icon:"🔧",desc:"Destornillador de chatarra. +6% desmontaje.",cost:{"Chatarra":2,"Ramas":1},out:"Destornillador oxidado",category:"Herramienta"},
 {id:"driver_iron",name:"Destornillador de hierro",icon:"🔧",desc:"+12% desmontaje.",cost:{"Lingote de hierro":2,"Chatarra":1},out:"Destornillador de hierro",category:"Herramienta"},
 {id:"driver_copper",name:"Destornillador de cobre",icon:"🔧",desc:"+16% desmontaje.",cost:{"Lingote de cobre":2,"Cable de cobre":1},out:"Destornillador de cobre",category:"Herramienta"},
 {id:"driver_titanium",name:"Destornillador de titanio",icon:"🔧",desc:"+20% desmontaje.",cost:{"Lingote de titanio":2,"Cristal agrietado":1},out:"Destornillador de titanio",category:"Herramienta"},
 {id:"driver_cobalt",name:"Destornillador de cobalto",icon:"🔧",desc:"+22% desmontaje.",cost:{"Lingote de cobalto":2,"Cristal de hielo azul":1},out:"Destornillador de cobalto",category:"Herramienta"},
 {id:"driver_precision",name:"Destornillador de precisión",icon:"🔧",desc:"+25% desmontaje.",cost:{"Lingote de titanio":2,"Cristal pulido":1,"Cable de cobre":1},out:"Destornillador de precisión",category:"Herramienta"},
 {id:"driver_iridium",name:"Destornillador de iridio",icon:"🔧",desc:"+30% desmontaje. N5.",cost:{"Lingote de iridio":2,"Cristal pulido":1},out:"Destornillador de iridio",category:"Herramienta"},
 {id:"tongs_precision",name:"Pinzas de precisión",icon:"⚕",desc:"Pinzas de titanio y cristal pulido. +25% éxito.",cost:{"Lingote de titanio":2,"Cristal pulido":1,"Cable de cobre":1},out:"Pinzas de precisión",category:"Herramienta"},
 // === ARMAS ===
 {id:"knife_scrap",name:"Cuchillo oxidado",icon:"🔪",desc:"Hoja improvisada de chatarra y ramas.",cost:{"Chatarra":3,"Ramas":1},out:"Cuchillo oxidado",category:"Arma"},
 {id:"knife_iron",name:"Cuchillo de hierro",icon:"🔪",desc:"Hoja de lingote de hierro con mango de madera.",cost:{"Lingote de hierro":2,"Madera":1},out:"Cuchillo de hierro",category:"Arma"},
 {id:"knife_copper",name:"Cuchillo de cobre",icon:"🔪",desc:"Hoja de lingote de cobre.",cost:{"Lingote de cobre":2,"Madera":1},out:"Cuchillo de cobre",category:"Arma"},
 {id:"knife_obsidian",name:"Cuchillo de obsidiana",icon:"🔪",desc:"Hoja de lingote de obsidiana.",cost:{"Lingote de obsidiana":2,"Resina":1},out:"Cuchillo de obsidiana",category:"Arma"},
 {id:"bat_scrap",name:"Bate claveteado",icon:"🏏",desc:"Madera con tornillos oxidados clavados.",cost:{"Madera":3,"Tornillo oxidado":3},out:"Bate claveteado",category:"Arma"},
 {id:"bat_iron",name:"Bate de hierro",icon:"🏏",desc:"Mango de madera con cabezal de lingote de hierro.",cost:{"Lingote de hierro":2,"Madera":2,"Tornillo oxidado":1},out:"Bate de hierro",category:"Arma"},
 {id:"sword_copper",name:"Espada de cobre",icon:"⚔️",desc:"Hoja de lingote de cobre y mango de madera.",cost:{"Lingote de cobre":3,"Madera":1},out:"Espada de cobre",category:"Arma"},
 {id:"sword_iron",name:"Espada de hierro",icon:"⚔️",desc:"Hoja de lingote de hierro forjada.",cost:{"Lingote de hierro":3,"Madera":1,"Carbón":1},out:"Espada de hierro",category:"Arma"},
 {id:"sword_titanium",name:"Espada de titanio",icon:"⚔️",desc:"Hoja de lingote de titanio, ligera y cortante.",cost:{"Lingote de titanio":3,"Madera":1},out:"Espada de titanio",category:"Arma"},
 {id:"sword_obsidian",name:"Espada de obsidiana",icon:"⚔️",desc:"Filo de lingote de obsidiana volcánica.",cost:{"Lingote de obsidiana":3,"Resina":1,"Madera":1},out:"Espada de obsidiana",category:"Arma"},
 {id:"sword_cobalt",name:"Espada de cobalto",icon:"⚔️",desc:"Hoja de lingote de cobalto templada.",cost:{"Lingote de cobalto":3,"Cristal de hielo azul":1,"Madera":1},out:"Espada de cobalto",category:"Arma"},
 {id:"sword_tungsten",name:"Espada de tungsteno",icon:"⚔️",desc:"Hoja de lingote de tungsteno, pesada y letal.",cost:{"Lingote de tungsteno":3,"Carbón":2,"Madera":1},out:"Espada de tungsteno",category:"Arma"},
 {id:"spear_wood",name:"Lanza de madera",icon:"🗡️",desc:"Asta de madera y punta de piedra.",cost:{"Madera":3,"Piedra":2,"Ramas":1},out:"Lanza de madera",category:"Arma"},
 {id:"spear_iron",name:"Lanza de hierro",icon:"🗡️",desc:"Punta de lingote de hierro en asta de madera.",cost:{"Lingote de hierro":2,"Madera":3},out:"Lanza de hierro",category:"Arma"},
 {id:"spear_titanium",name:"Lanza de titanio",icon:"🗡️",desc:"Punta de lingote de titanio.",cost:{"Lingote de titanio":2,"Madera":3},out:"Lanza de titanio",category:"Arma"},
 {id:"mace_iron",name:"Maza de hierro",icon:"🔨",desc:"Cabeza de lingote de hierro sobre mango de madera.",cost:{"Lingote de hierro":3,"Madera":2,"Chatarra":1},out:"Maza de hierro",category:"Arma"},
 {id:"mace_tungsten",name:"Maza de tungsteno",icon:"🔨",desc:"Cabeza de lingote de tungsteno, impacto brutal.",cost:{"Lingote de tungsteno":3,"Madera":2,"Carbón":1},out:"Maza de tungsteno",category:"Arma"},
 {id:"mace_obsidian",name:"Maza de obsidiana",icon:"🔨",desc:"Cabeza de lingote de obsidiana.",cost:{"Lingote de obsidiana":3,"Madera":2,"Resina":1},out:"Maza de obsidiana",category:"Arma"},
 {id:"dagger_cobalt",name:"Daga de cobalto",icon:"🗡️",desc:"Hoja corta de lingote de cobalto.",cost:{"Lingote de cobalto":2,"Madera":1,"Cristal de hielo azul":1},out:"Daga de cobalto",category:"Arma"},
 {id:"dagger_nickel",name:"Daga de níquel",icon:"🗡️",desc:"Hoja de lingote de níquel.",cost:{"Lingote de níquel":2,"Madera":1},out:"Daga de níquel",category:"Arma"},
 {id:"bow_wood",name:"Arco de ramas",icon:"🏹",desc:"Arco de ramas y fibra vegetal.",cost:{"Ramas":4,"Fibra vegetal":2},out:"Arco de ramas",category:"Arma"},
 {id:"bow_iron",name:"Arco reforzado",icon:"🏹",desc:"Arco de madera reforzado con lingote de hierro.",cost:{"Madera":3,"Lingote de hierro":1,"Fibra vegetal":2},out:"Arco reforzado",category:"Arma"},
 {id:"crossbow_scrap",name:"Ballesta de chatarra",icon:"🏹",desc:"Mecanismo de chatarra y cable de cobre.",cost:{"Chatarra":4,"Cable de cobre":2,"Madera":2},out:"Ballesta de chatarra",category:"Arma"},
 {id:"crossbow_iron",name:"Ballesta de hierro",icon:"🏹",desc:"Ballesta de lingote de hierro y cable.",cost:{"Lingote de hierro":3,"Cable de cobre":2,"Madera":2},out:"Ballesta de hierro",category:"Arma"},
 {id:"whip_scrap",name:"Látigo de cable",icon:"〰️",desc:"Cable de cobre trenzado con agarre de chatarra.",cost:{"Cable de cobre":4,"Chatarra":1,"Resina":1},out:"Látigo de cable",category:"Arma"},
 {id:"hammer_iron",name:"Martillo de guerra",icon:"🔨",desc:"Martillo de lingote de hierro y madera.",cost:{"Lingote de hierro":4,"Madera":2,"Carbón":1},out:"Martillo de guerra",category:"Arma"},
 // === EQUIPO: solo trajes / armaduras completas (1 slot armor) ===
 {id:"suit_scrap",name:"Traje de chatarra",icon:"🛡️",desc:"Armadura completa improvisada de chatarra y cable.",cost:{"Chatarra":6,"Cable de cobre":2,"Tornillo oxidado":2},out:"Traje de chatarra",category:"Equipo"},
 {id:"suit_wood",name:"Traje de madera",icon:"🧥",desc:"Protección de tablas y fibra vegetal.",cost:{"Madera":5,"Fibra vegetal":3,"Resina":2},out:"Traje de madera",category:"Equipo"},
 {id:"suit_iron",name:"Armadura de hierro",icon:"🛡️",desc:"Armadura completa de lingote de hierro.",cost:{"Lingote de hierro":5,"Chatarra":2,"Cable de cobre":1},out:"Armadura de hierro",category:"Equipo"},
 {id:"suit_copper",name:"Armadura de cobre",icon:"🛡️",desc:"Armadura completa de lingote de cobre.",cost:{"Lingote de cobre":5,"Cable de cobre":2,"Madera":1},out:"Armadura de cobre",category:"Equipo"},
 {id:"suit_titanium",name:"Armadura de titanio",icon:"🛡️",desc:"Armadura completa de lingote de titanio, ligera.",cost:{"Lingote de titanio":5,"Cable de cobre":2},out:"Armadura de titanio",category:"Equipo"},
 {id:"suit_cobalt",name:"Armadura de cobalto",icon:"🛡️",desc:"Armadura completa de lingote de cobalto, aislante térmico.",cost:{"Lingote de cobalto":5,"Cristal de hielo azul":2,"Cable de cobre":1},out:"Armadura de cobalto",category:"Equipo"},
 {id:"suit_obsidian",name:"Armadura de obsidiana",icon:"🛡️",desc:"Armadura completa de lingote de obsidiana.",cost:{"Lingote de obsidiana":5,"Roca volcánica":2,"Resina":1},out:"Armadura de obsidiana",category:"Equipo"},
 {id:"suit_tungsten",name:"Armadura de tungsteno",icon:"🛡️",desc:"Armadura completa de lingote de tungsteno, máxima defensa.",cost:{"Lingote de tungsteno":5,"Carbón":2,"Cable de cobre":1},out:"Armadura de tungsteno",category:"Equipo"},
 {id:"suit_nickel",name:"Armadura de níquel",icon:"🛡️",desc:"Armadura completa de lingote de níquel, anticorrosión.",cost:{"Lingote de níquel":5,"Chatarra":2,"Resina":1},out:"Armadura de níquel",category:"Equipo"},
 {id:"suit_spore",name:"Traje de esporas",icon:"🧥",desc:"Traje completo con hojas mutadas y resina.",cost:{"Hoja mutada":4,"Resina":3,"Fibra vegetal":3},out:"Traje de esporas",category:"Equipo"},
 {id:"suit_filter",name:"Traje filtrante",icon:"🧥",desc:"Traje completo con filtros de carbón y fibra.",cost:{"Fibra vegetal":4,"Carbón":3,"Compuesto aislante":2},out:"Traje filtrante",category:"Equipo"},
 {id:"suit_quartz",name:"Armadura de cuarzo",icon:"🛡️",desc:"Armadura con placas de cristal y lingote de hierro.",cost:{"Cristal agrietado":4,"Lingote de hierro":3,"Resina":2},out:"Armadura de cuarzo",category:"Equipo"},
 {id:"suit_alloy",name:"Armadura de aleación",icon:"🛡️",desc:"Armadura de placa de aleación y lingote de hierro.",cost:{"Placa de aleación":3,"Lingote de hierro":2,"Cable de cobre":2},out:"Armadura de aleación",category:"Equipo"},
 {id:"suit_neon",name:"Traje de neón",icon:"🧥",desc:"Traje con batería de neón y cable de fibra óptica.",cost:{"Batería de neón":2,"Cable de fibra óptica":2,"Lingote de cobre":2},out:"Traje de neón",category:"Equipo"},
 {id:"suit_abyssal",name:"Traje abisal",icon:"🧥",desc:"Traje sellado con concha blindada y gel bioluminiscente.",cost:{"Concha blindada":2,"Gel bioluminiscente":2,"Fibra vegetal":2,"Resina":2},out:"Traje abisal",category:"Equipo"},
 // === NIVEL 5: materiales N5 (iridio, platino, uranio) → objeto N5 ===
 {id:"pick_iridium",name:"Pico de iridio",icon:"⛏️",desc:"Pico de lingote de iridio. Nivel 5.",cost:{"Lingote de iridio":3,"Madera":1,"Carbón":1},out:"Pico de iridio",category:"Herramienta"},
 {id:"pick_platinum",name:"Pico de platino",icon:"⛏️",desc:"Pico de lingote de platino. Nivel 5.",cost:{"Lingote de platino":3,"Madera":1},out:"Pico de platino",category:"Herramienta"},
 {id:"pick_uranium",name:"Pico de uranio",icon:"⛏️",desc:"Pico de lingote de uranio. Nivel 5.",cost:{"Lingote de uranio":3,"Carbón":2,"Madera":1},out:"Pico de uranio",category:"Herramienta"},
 {id:"axe_iridium",name:"Hacha de iridio",icon:"🪓",desc:"Hacha de lingote de iridio. Nivel 5.",cost:{"Lingote de iridio":2,"Madera":2,"Resina":1},out:"Hacha de iridio",category:"Herramienta"},
 {id:"axe_platinum",name:"Hacha de platino",icon:"🪓",desc:"Hacha de lingote de platino. Nivel 5.",cost:{"Lingote de platino":2,"Madera":2},out:"Hacha de platino",category:"Herramienta"},
 {id:"axe_uranium",name:"Hacha de uranio",icon:"🪓",desc:"Hacha de lingote de uranio. Nivel 5.",cost:{"Lingote de uranio":2,"Carbón":1,"Madera":1},out:"Hacha de uranio",category:"Herramienta"},
 {id:"tongs_iridium",name:"Pinzas de iridio",icon:"⚕",desc:"Pinzas de lingote de iridio. +30% éxito. Nivel 5.",cost:{"Lingote de iridio":2,"Cristal pulido":1},out:"Pinzas de iridio",category:"Herramienta"},
 {id:"tongs_platinum",name:"Pinzas de platino",icon:"⚕",desc:"Pinzas de lingote de platino. +28% éxito. Nivel 5.",cost:{"Lingote de platino":2,"Cable de cobre":1},out:"Pinzas de platino",category:"Herramienta"},
 {id:"sword_iridium",name:"Espada de iridio",icon:"⚔️",desc:"Hoja de lingote de iridio. Nivel 5.",cost:{"Lingote de iridio":3,"Madera":1,"Carbón":1},out:"Espada de iridio",category:"Arma"},
 {id:"sword_platinum",name:"Espada de platino",icon:"⚔️",desc:"Hoja de lingote de platino. Nivel 5.",cost:{"Lingote de platino":3,"Madera":1},out:"Espada de platino",category:"Arma"},
 {id:"sword_uranium",name:"Espada de uranio",icon:"⚔️",desc:"Hoja de lingote de uranio. Nivel 5.",cost:{"Lingote de uranio":3,"Carbón":2,"Madera":1},out:"Espada de uranio",category:"Arma"},
 {id:"mace_iridium",name:"Maza de iridio",icon:"🔨",desc:"Cabeza de lingote de iridio. Nivel 5.",cost:{"Lingote de iridio":3,"Madera":2},out:"Maza de iridio",category:"Arma"},
 {id:"mace_uranium",name:"Maza de uranio",icon:"🔨",desc:"Cabeza de lingote de uranio. Nivel 5.",cost:{"Lingote de uranio":3,"Madera":2,"Carbón":1},out:"Maza de uranio",category:"Arma"},
 {id:"spear_platinum",name:"Lanza de platino",icon:"🗡️",desc:"Punta de lingote de platino. Nivel 5.",cost:{"Lingote de platino":2,"Madera":3},out:"Lanza de platino",category:"Arma"},
 {id:"crossbow_iridium",name:"Ballesta de iridio",icon:"🏹",desc:"Ballesta de lingote de iridio y cable. Nivel 5.",cost:{"Lingote de iridio":3,"Cable de cobre":2,"Madera":2},out:"Ballesta de iridio",category:"Arma"},
 {id:"suit_iridium",name:"Armadura de iridio",icon:"🛡️",desc:"Armadura completa de lingote de iridio. Nivel 5.",cost:{"Lingote de iridio":5,"Cable de cobre":2,"Carbón":1},out:"Armadura de iridio",category:"Equipo"},
 {id:"suit_platinum",name:"Armadura de platino",icon:"🛡️",desc:"Armadura completa de lingote de platino. Nivel 5.",cost:{"Lingote de platino":5,"Cable de cobre":2},out:"Armadura de platino",category:"Equipo"},
 {id:"suit_uranium",name:"Armadura de uranio",icon:"🛡️",desc:"Armadura completa de lingote de uranio. Nivel 5.",cost:{"Lingote de uranio":5,"Carbón":2,"Cable de cobre":1},out:"Armadura de uranio",category:"Equipo"},
 // === MATERIALES BÁSICOS ===
 {id:"mat_fiber",name:"Fibra vegetal",icon:"🧵",desc:"Fibras de hojas y ramas para cordajes.",cost:{"Hojas":3,"Ramas":1},out:"Fibra vegetal",category:"Material"},
 {id:"mat_rope",name:"Cuerda de fibra",icon:"➰",desc:"Fibras trenzadas en cordaje.",cost:{"Fibra vegetal":3},out:"Cuerda de fibra",category:"Material"},
 {id:"mat_board",name:"Tabla reforzada",icon:"🪵",desc:"Madera reforzada con chatarra.",cost:{"Madera":3,"Chatarra":1},out:"Tabla reforzada",category:"Material"},
 {id:"mat_brick",name:"Ladrillo de piedra",icon:"🧱",desc:"Piedra compactada en bloque.",cost:{"Piedra":4},out:"Ladrillo de piedra",category:"Material"},
 {id:"mat_glass",name:"Cristal pulido",icon:"💎",desc:"Pule cristal agrietado con piedra.",cost:{"Cristal agrietado":2,"Piedra":1},out:"Cristal pulido",category:"Material"},
 {id:"mat_insulator",name:"Compuesto aislante",icon:"🧪",desc:"Resina y fibra para aislar calor.",cost:{"Resina":2,"Fibra vegetal":2},out:"Compuesto aislante",category:"Material"},
 {id:"mat_cable",name:"Cable trenzado",icon:"〰️",desc:"Cable de cobre reforzado con fibra.",cost:{"Cable de cobre":2,"Fibra vegetal":1},out:"Cable trenzado",category:"Material"},
 {id:"mat_plate",name:"Placa de aleación",icon:"⚙️",desc:"Chatarra prensada con lingote de hierro.",cost:{"Chatarra":3,"Lingote de hierro":1},out:"Placa de aleación",category:"Material"},
 {id:"mat_coal_dust",name:"Polvo de carbón",icon:"⚫",desc:"Carbón molido para mezclas.",cost:{"Carbón":2},out:"Polvo de carbón",category:"Material"},
 {id:"mat_battery_core",name:"Núcleo de batería",icon:"🔋",desc:"Celdas recuperadas de batería vieja.",cost:{"Batería vieja":1,"Cable de cobre":2},out:"Núcleo de batería",category:"Material"}
];

// Fichas de catálogo para recetas de mesa (trajes completos, no piezas sueltas)
[
 ["Pico de madera",{icon:"⛏️",cat:"Herramienta",r:1,val:14,slot:"pick",gather:10,damage:1}],
 ["Pico de chatarra",{icon:"⛏️",cat:"Herramienta",r:1,val:18,slot:"pick",gather:15,damage:2}],
 ["Pico de piedra",{icon:"⛏️",cat:"Herramienta",r:1,val:16,slot:"pick",gather:12,damage:2}],
 ["Pico de hierro",{icon:"⛏️",cat:"Herramienta",r:2,val:40,slot:"pick",gather:30,damage:5}],
 ["Pico de cobre",{icon:"⛏️",cat:"Herramienta",r:2,val:36,slot:"pick",gather:28,damage:4}],
 ["Pico de titanio",{icon:"⛏️",cat:"Herramienta",r:3,val:70,slot:"pick",gather:42,damage:8}],
 ["Pico de cobalto",{icon:"⛏️",cat:"Herramienta",r:3,val:68,slot:"pick",gather:40,damage:7}],
 ["Pico de obsidiana",{icon:"⛏️",cat:"Herramienta",r:4,val:110,slot:"pick",gather:55,damage:12}],
 ["Pico de tungsteno",{icon:"⛏️",cat:"Herramienta",r:4,val:120,slot:"pick",gather:58,damage:13}],
 ["Pico de níquel",{icon:"⛏️",cat:"Herramienta",r:3,val:65,slot:"pick",gather:38,damage:7}],
 ["Pico de cuarzo",{icon:"⛏️",cat:"Herramienta",r:2,val:34,slot:"pick",gather:26,damage:4}],
 ["Hacha de madera",{icon:"🪓",cat:"Herramienta",r:1,val:14,slot:"axe",gather:12,damage:1}],
 ["Hacha de chatarra",{icon:"🪓",cat:"Herramienta",r:1,val:22,slot:"axe",gather:22,damage:3}],
 ["Hacha de hierro",{icon:"🪓",cat:"Herramienta",r:2,val:42,slot:"axe",gather:35,damage:6}],
 ["Hacha de cobre",{icon:"🪓",cat:"Herramienta",r:2,val:38,slot:"axe",gather:32,damage:5}],
 ["Hacha de titanio",{icon:"🪓",cat:"Herramienta",r:3,val:75,slot:"axe",gather:45,damage:9}],
 ["Hacha de obsidiana",{icon:"🪓",cat:"Herramienta",r:4,val:115,slot:"axe",gather:58,damage:14}],
 ["Hacha de cobalto",{icon:"🪓",cat:"Herramienta",r:3,val:72,slot:"axe",gather:44,damage:8}],
 ["Hacha de tungsteno",{icon:"🪓",cat:"Herramienta",r:4,val:118,slot:"axe",gather:56,damage:13}],
 ["Pinzas oxidadas",{icon:"⚕",cat:"Herramienta",r:1,val:16,slot:"tongs",extractBonus:6}],
 ["Pinzas de hierro",{icon:"⚕",cat:"Herramienta",r:2,val:32,slot:"tongs",extractBonus:12}],
 ["Pinzas de cobre",{icon:"⚕",cat:"Herramienta",r:2,val:34,slot:"tongs",extractBonus:16}],
 ["Pinzas de titanio",{icon:"⚕",cat:"Herramienta",r:3,val:55,slot:"tongs",extractBonus:20}],
 ["Pinzas de cobalto",{icon:"⚕",cat:"Herramienta",r:3,val:58,slot:"tongs",extractBonus:22}],
 ["Pinzas de precisión",{icon:"⚕",cat:"Herramienta",r:4,val:80,slot:"tongs",extractBonus:25}],
 ["Cuchillo oxidado",{icon:"🔪",cat:"Arma",r:1,val:12,slot:"weapon",damage:4}],
 ["Cuchillo de hierro",{icon:"🔪",cat:"Arma",r:2,val:28,slot:"weapon",damage:8}],
 ["Cuchillo de cobre",{icon:"🔪",cat:"Arma",r:2,val:26,slot:"weapon",damage:7}],
 ["Cuchillo de obsidiana",{icon:"🔪",cat:"Arma",r:3,val:55,slot:"weapon",damage:15}],
 ["Bate claveteado",{icon:"🏏",cat:"Arma",r:1,val:15,slot:"weapon",damage:5}],
 ["Bate de hierro",{icon:"🏏",cat:"Arma",r:2,val:32,slot:"weapon",damage:10}],
 ["Espada de cobre",{icon:"⚔️",cat:"Arma",r:2,val:35,slot:"weapon",damage:10}],
 ["Espada de hierro",{icon:"⚔️",cat:"Arma",r:2,val:45,slot:"weapon",damage:14}],
 ["Espada de titanio",{icon:"⚔️",cat:"Arma",r:3,val:80,slot:"weapon",damage:20}],
 ["Espada de obsidiana",{icon:"⚔️",cat:"Arma",r:4,val:120,slot:"weapon",damage:28}],
 ["Espada de cobalto",{icon:"⚔️",cat:"Arma",r:3,val:78,slot:"weapon",damage:19}],
 ["Espada de tungsteno",{icon:"⚔️",cat:"Arma",r:4,val:130,slot:"weapon",damage:32}],
 ["Lanza de madera",{icon:"🗡️",cat:"Arma",r:1,val:14,slot:"weapon",damage:6}],
 ["Lanza de hierro",{icon:"🗡️",cat:"Arma",r:2,val:38,slot:"weapon",damage:12}],
 ["Lanza de titanio",{icon:"🗡️",cat:"Arma",r:3,val:70,slot:"weapon",damage:18}],
 ["Maza de hierro",{icon:"🔨",cat:"Arma",r:2,val:42,slot:"weapon",damage:15}],
 ["Maza de tungsteno",{icon:"🔨",cat:"Arma",r:4,val:125,slot:"weapon",damage:30}],
 ["Maza de obsidiana",{icon:"🔨",cat:"Arma",r:4,val:118,slot:"weapon",damage:27}],
 ["Daga de cobalto",{icon:"🗡️",cat:"Arma",r:3,val:65,slot:"weapon",damage:16}],
 ["Daga de níquel",{icon:"🗡️",cat:"Arma",r:2,val:40,slot:"weapon",damage:11}],
 ["Arco de ramas",{icon:"🏹",cat:"Arma",r:1,val:18,slot:"weapon",damage:7}],
 ["Arco reforzado",{icon:"🏹",cat:"Arma",r:2,val:40,slot:"weapon",damage:12}],
 ["Ballesta de chatarra",{icon:"🏹",cat:"Arma",r:2,val:48,slot:"weapon",damage:14}],
 ["Ballesta de hierro",{icon:"🏹",cat:"Arma",r:3,val:75,slot:"weapon",damage:20}],
 ["Látigo de cable",{icon:"〰️",cat:"Arma",r:2,val:30,slot:"weapon",damage:9}],
 ["Martillo de guerra",{icon:"🔨",cat:"Arma",r:3,val:85,slot:"weapon",damage:22}],
 ["Traje de chatarra",{icon:"🛡️",cat:"Equipo",r:1,val:28,slot:"armor",defense:8}],
 ["Traje de madera",{icon:"🧥",cat:"Equipo",r:1,val:22,slot:"armor",defense:6}],
 ["Armadura de hierro",{icon:"🛡️",cat:"Equipo",r:2,val:55,slot:"armor",defense:14}],
 ["Armadura de cobre",{icon:"🛡️",cat:"Equipo",r:2,val:50,slot:"armor",defense:12}],
 ["Armadura de titanio",{icon:"🛡️",cat:"Equipo",r:3,val:95,slot:"armor",defense:22}],
 ["Armadura de cobalto",{icon:"🛡️",cat:"Equipo",r:3,val:90,slot:"armor",defense:20}],
 ["Armadura de obsidiana",{icon:"🛡️",cat:"Equipo",r:4,val:130,slot:"armor",defense:28}],
 ["Armadura de tungsteno",{icon:"🛡️",cat:"Equipo",r:4,val:140,slot:"armor",defense:32}],
 ["Armadura de níquel",{icon:"🛡️",cat:"Equipo",r:3,val:85,slot:"armor",defense:18}],
 ["Traje de esporas",{icon:"🧥",cat:"Equipo",r:2,val:45,slot:"armor",defense:11}],
 ["Traje filtrante",{icon:"🧥",cat:"Equipo",r:2,val:42,slot:"armor",defense:10}],
 ["Armadura de cuarzo",{icon:"🛡️",cat:"Equipo",r:3,val:80,slot:"armor",defense:17}],
 ["Armadura de aleación",{icon:"🛡️",cat:"Equipo",r:3,val:88,slot:"armor",defense:19}],
 ["Traje de neón",{icon:"🧥",cat:"Equipo",r:3,val:92,slot:"armor",defense:16}],
 ["Traje abisal",{icon:"🧥",cat:"Equipo",r:3,val:86,slot:"armor",defense:15}]
].forEach(([name,data])=>{
  const prev=itemDB[name]||{};
  itemDB[name]={...prev,...data,name,desc:prev.desc||data.desc||`${name}. Fabricado en la mesa de creación.`};
});

[
 ["Pico de iridio",{icon:"⛏️",cat:"Herramienta",r:5,val:160,slot:"pick",gather:70,damage:18}],
 ["Pico de platino",{icon:"⛏️",cat:"Herramienta",r:5,val:155,slot:"pick",gather:68,damage:17}],
 ["Pico de uranio",{icon:"⛏️",cat:"Herramienta",r:5,val:165,slot:"pick",gather:72,damage:19}],
 ["Hacha de iridio",{icon:"🪓",cat:"Herramienta",r:5,val:158,slot:"axe",gather:70,damage:18}],
 ["Hacha de platino",{icon:"🪓",cat:"Herramienta",r:5,val:152,slot:"axe",gather:68,damage:17}],
 ["Hacha de uranio",{icon:"🪓",cat:"Herramienta",r:5,val:162,slot:"axe",gather:72,damage:19}],
 ["Pinzas de iridio",{icon:"⚕",cat:"Herramienta",r:5,val:120,slot:"tongs",extractBonus:30}],
 ["Pinzas de platino",{icon:"⚕",cat:"Herramienta",r:5,val:115,slot:"tongs",extractBonus:28}],
 ["Espada de iridio",{icon:"⚔️",cat:"Arma",r:5,val:180,slot:"weapon",damage:40}],
 ["Espada de platino",{icon:"⚔️",cat:"Arma",r:5,val:175,slot:"weapon",damage:38}],
 ["Espada de uranio",{icon:"⚔️",cat:"Arma",r:5,val:185,slot:"weapon",damage:42}],
 ["Maza de iridio",{icon:"🔨",cat:"Arma",r:5,val:178,slot:"weapon",damage:40}],
 ["Maza de uranio",{icon:"🔨",cat:"Arma",r:5,val:182,slot:"weapon",damage:41}],
 ["Lanza de platino",{icon:"🗡️",cat:"Arma",r:5,val:150,slot:"weapon",damage:34}],
 ["Ballesta de iridio",{icon:"🏹",cat:"Arma",r:5,val:170,slot:"weapon",damage:36}],
 ["Armadura de iridio",{icon:"🛡️",cat:"Equipo",r:5,val:200,slot:"armor",defense:40}],
 ["Armadura de platino",{icon:"🛡️",cat:"Equipo",r:5,val:195,slot:"armor",defense:38}],
 ["Armadura de uranio",{icon:"🛡️",cat:"Equipo",r:5,val:205,slot:"armor",defense:42}]
].forEach(([name,data])=>{const prev=itemDB[name]||{};itemDB[name]={...prev,...data,name,desc:prev.desc||data.desc||`${name}. Nivel ${data.r}.`};});



[
 ["Pico de madera",{icon:"⛏️",cat:"Herramienta",r:1,val:14,desc:"Pico improvisado de madera y ramas.",slot:"pick",gather:10,damage:1}],
 ["Pico de chatarra",{icon:"⛏️",cat:"Herramienta",r:1,val:18,desc:"Pico con cabeza de chatarra.",slot:"pick",gather:15,damage:2}],
 ["Pico de piedra",{icon:"⛏️",cat:"Herramienta",r:1,val:16,desc:"Pico de piedra y resina.",slot:"pick",gather:12,damage:2}],
 ["Pico de hierro",{icon:"⛏️",cat:"Herramienta",r:2,val:40,desc:"Pico de lingote de hierro.",slot:"pick",gather:30,damage:5}],
 ["Pico de cobre",{icon:"⛏️",cat:"Herramienta",r:2,val:36,desc:"Pico de lingote de cobre.",slot:"pick",gather:28,damage:4}],
 ["Pico de titanio",{icon:"⛏️",cat:"Herramienta",r:3,val:70,desc:"Pico de lingote de titanio.",slot:"pick",gather:42,damage:8}],
 ["Pico de cobalto",{icon:"⛏️",cat:"Herramienta",r:3,val:68,desc:"Pico de lingote de cobalto.",slot:"pick",gather:40,damage:7}],
 ["Pico de obsidiana",{icon:"⛏️",cat:"Herramienta",r:4,val:110,desc:"Pico de lingote de obsidiana.",slot:"pick",gather:55,damage:12}],
 ["Pico de tungsteno",{icon:"⛏️",cat:"Herramienta",r:4,val:120,desc:"Pico de lingote de tungsteno.",slot:"pick",gather:58,damage:13}],
 ["Hacha de madera",{icon:"🪓",cat:"Herramienta",r:1,val:14,desc:"Hacha de leñador.",slot:"axe",gather:12,damage:1}],
 ["Hacha de chatarra",{icon:"🪓",cat:"Herramienta",r:1,val:22,desc:"Hacha con filo de chatarra.",slot:"axe",gather:22,damage:3}],
 ["Hacha de hierro",{icon:"🪓",cat:"Herramienta",r:2,val:42,desc:"Hacha de lingote de hierro.",slot:"axe",gather:35,damage:6}],
 ["Hacha de cobre",{icon:"🪓",cat:"Herramienta",r:2,val:38,desc:"Hacha de lingote de cobre.",slot:"axe",gather:32,damage:5}],
 ["Hacha de titanio",{icon:"🪓",cat:"Herramienta",r:3,val:75,desc:"Hacha de lingote de titanio.",slot:"axe",gather:45,damage:9}],
 ["Hacha de obsidiana",{icon:"🪓",cat:"Herramienta",r:4,val:115,desc:"Hacha de lingote de obsidiana.",slot:"axe",gather:58,damage:14}],
 ["Hacha de cobalto",{icon:"🪓",cat:"Herramienta",r:3,val:72,desc:"Hacha de lingote de cobalto.",slot:"axe",gather:44,damage:8}],
 ["Pinzas oxidadas",{icon:"⚕",cat:"Herramienta",r:1,val:16,desc:"Pinzas de chatarra. +6% extracción.",slot:"tongs",extractBonus:6}],
 ["Pinzas de hierro",{icon:"⚕",cat:"Herramienta",r:2,val:32,desc:"Pinzas de lingote de hierro. +12% extracción.",slot:"tongs",extractBonus:12}],
 ["Pinzas de cobre",{icon:"⚕",cat:"Herramienta",r:2,val:34,desc:"Pinzas de lingote de cobre. +16% extracción.",slot:"tongs",extractBonus:16}],
 ["Pinzas de titanio",{icon:"⚕",cat:"Herramienta",r:3,val:55,desc:"Pinzas de lingote de titanio. +20% extracción.",slot:"tongs",extractBonus:20}],
 ["Pinzas de precisión",{icon:"⚕",cat:"Herramienta",r:4,val:80,desc:"Pinzas de titanio y cristal. +25% extracción.",slot:"tongs",extractBonus:25}],
 ["Cuchillo oxidado",{icon:"🔪",cat:"Arma",r:1,val:12,desc:"Hoja de chatarra.",slot:"weapon",damage:4}],
 ["Cuchillo de hierro",{icon:"🔪",cat:"Arma",r:2,val:28,desc:"Hoja de lingote de hierro.",slot:"weapon",damage:8}],
 ["Bate claveteado",{icon:"🏏",cat:"Arma",r:1,val:15,desc:"Madera con tornillos.",slot:"weapon",damage:5}],
 ["Espada de cobre",{icon:"⚔️",cat:"Arma",r:2,val:35,desc:"Hoja de lingote de cobre.",slot:"weapon",damage:10}],
 ["Espada de hierro",{icon:"⚔️",cat:"Arma",r:2,val:45,desc:"Hoja de lingote de hierro.",slot:"weapon",damage:14}],
 ["Espada de titanio",{icon:"⚔️",cat:"Arma",r:3,val:80,desc:"Hoja de lingote de titanio.",slot:"weapon",damage:20}],
 ["Espada de obsidiana",{icon:"⚔️",cat:"Arma",r:4,val:120,desc:"Filo de lingote de obsidiana.",slot:"weapon",damage:28}],
 ["Lanza de madera",{icon:"🗡️",cat:"Arma",r:1,val:14,desc:"Asta de madera y punta de piedra.",slot:"weapon",damage:6}],
 ["Lanza de hierro",{icon:"🗡️",cat:"Arma",r:2,val:38,desc:"Punta de lingote de hierro.",slot:"weapon",damage:12}],
 ["Maza de hierro",{icon:"🔨",cat:"Arma",r:2,val:42,desc:"Cabeza de lingote de hierro.",slot:"weapon",damage:15}],
 ["Maza de tungsteno",{icon:"🔨",cat:"Arma",r:4,val:125,desc:"Cabeza de lingote de tungsteno.",slot:"weapon",damage:30}],
 ["Daga de cobalto",{icon:"🗡️",cat:"Arma",r:3,val:65,desc:"Hoja de lingote de cobalto.",slot:"weapon",damage:16}],
 ["Arco de ramas",{icon:"🏹",cat:"Arma",r:1,val:18,desc:"Arco de ramas y fibra.",slot:"weapon",damage:7}],
 ["Ballesta de chatarra",{icon:"🏹",cat:"Arma",r:2,val:48,desc:"Ballesta de chatarra y cable.",slot:"weapon",damage:14}],
 ["Armadura de chatarra",{icon:"🛡️",cat:"Equipo",r:1,val:25,desc:"Placas de chatarra.",slot:"armor",defense:6}],
 ["Armadura de hierro",{icon:"🛡️",cat:"Equipo",r:2,val:55,desc:"Placas de lingote de hierro.",slot:"armor",defense:14}],
 ["Armadura de titanio",{icon:"🛡️",cat:"Equipo",r:3,val:95,desc:"Placas de lingote de titanio.",slot:"armor",defense:22}],
 ["Casco de chatarra",{icon:"🪖",cat:"Equipo",r:1,val:18,desc:"Casco de chatarra.",slot:"armor",defense:4}],
 ["Casco de hierro",{icon:"🪖",cat:"Equipo",r:2,val:35,desc:"Casco de lingote de hierro.",slot:"armor",defense:9}],
 ["Casco de cuarzo",{icon:"🪖",cat:"Equipo",r:2,val:40,desc:"Casco con visera de cristal.",slot:"armor",defense:10}],
 ["Botas de chatarra",{icon:"🥾",cat:"Equipo",r:1,val:16,desc:"Botas reforzadas con chatarra.",slot:"armor",defense:3}],
 ["Botas de hierro",{icon:"🥾",cat:"Equipo",r:2,val:32,desc:"Botas con lingote de hierro.",slot:"armor",defense:7}],
 ["Guantes de chatarra",{icon:"🧤",cat:"Equipo",r:1,val:14,desc:"Guantes con placas de chatarra.",slot:"armor",defense:3}],
 ["Guantes de hierro",{icon:"🧤",cat:"Equipo",r:2,val:28,desc:"Guantes con lingote de hierro.",slot:"armor",defense:6}],
 ["Escudo de madera",{icon:"🛡️",cat:"Equipo",r:1,val:20,desc:"Escudo de tablas de madera.",slot:"armor",defense:5}],
 ["Escudo de hierro",{icon:"🛡️",cat:"Equipo",r:2,val:50,desc:"Escudo de lingote de hierro.",slot:"armor",defense:12}],
 ["Escudo de titanio",{icon:"🛡️",cat:"Equipo",r:3,val:90,desc:"Escudo de lingote de titanio.",slot:"armor",defense:20}],
 ["Máscara filtrante",{icon:"😷",cat:"Equipo",r:2,val:30,desc:"Máscara con filtro de fibra y carbón.",slot:"armor",defense:4}],
 ["Traje de esporas",{icon:"🧥",cat:"Equipo",r:2,val:45,desc:"Traje con hojas mutadas y resina.",slot:"armor",defense:11}],
 ["Amuleto de esporas",{icon:"🔮",cat:"Equipo",r:3,val:60,desc:"Espora viva en resina.",slot:"armor",defense:5}],
 ["Cinturón de chatarra",{icon:"🪢",cat:"Equipo",r:1,val:15,desc:"Cinturón de chatarra y fibra.",slot:"armor",defense:2}],
 ["Placa dorsal de obsidiana",{icon:"🛡️",cat:"Equipo",r:4,val:100,desc:"Placa de lingote de obsidiana.",slot:"armor",defense:18}]
].forEach(([name,data])=>{if(!itemDB[name])itemDB[name]=data;else Object.assign(itemDB[name],data)});


// Recetas de archivo: procesan hallazgos narrativos recuperados en zonas avanzadas.
[
 {id:"lore_ash_map",name:"Mapa de ceniza restaurado",icon:"🗺️",desc:"La Mesa reconstruye una ruta borrada a partir de los restos de un mapa quemado. El destino cambia con cada lectura, pero las marcas de campo son consistentes.",cost:{"Archivo de ceniza":2,"Cable de cobre":1},out:"Mapa de ceniza restaurado",category:"Material"},
 {id:"lore_cartographer_seal",name:"Sello de cartógrafo calibrado",icon:"🧭",desc:"Un sello antiguo estabilizado con cobre refinado. La aguja ya no señala el norte: marca rutas que el escáner de la Central puede verificar.",cost:{"Sello de cartógrafo":1,"Lingote de cobre":1},out:"Sello de cartógrafo calibrado",category:"Material"},
 {id:"lore_memory_vial",name:"Memoria de expedición sellada",icon:"🧪",desc:"La Ampolla de memoria se encapsula en un soporte energético. La grabación queda protegida para su análisis sin alterar el objeto original.",cost:{"Ampolla de memoria":1,"Núcleo energético":1},out:"Memoria de expedición sellada",category:"Material"}
].forEach(r=>{addGenerated(r.out,{icon:r.icon,cat:"Material",r:r.id==="lore_ash_map"?2:r.id==="lore_cartographer_seal"?3:4,val:r.id==="lore_ash_map"?27:r.id==="lore_cartographer_seal"?48:72,desc:r.desc});recipes.push(r)});

// REWORK: recetas de materiales limitadas (máx. 40 de ampliación industrial).
// Cada receta convierte una mena/lingote en un derivado plausible de la misma familia mineral.
const materialForms = [
 {label:"Lámina técnica",icon:"🔲",desc:"Lámina mineral laminada para carcasas, refuerzos y ensamblajes.",cost:(root)=>({[`Lingote de ${root}`]:1,"Chatarra":1})},
 {label:"Polvo refinado",icon:"✨",desc:"Mineral molido y clasificado para mezclas técnicas y abrasivos.",cost:(root)=>({[`Mena de ${root}`]:2,"Piedra":1})},
 {label:"Compuesto mineral",icon:"🧪",desc:"Mezcla mineral estabilizada con resina para fabricar componentes resistentes.",cost:(root)=>({[`Lingote de ${root}`]:1,"Resina":2})},
 {label:"Malla metálica",icon:"🕸️",desc:"Trama de metal conductor para filtros, blindajes y estructuras flexibles.",cost:(root)=>({[`Lingote de ${root}`]:1,"Cable de cobre":1})},
 {label:"Núcleo mineral",icon:"💠",desc:"Núcleo compacto que conserva las propiedades del mineral de origen.",cost:(root)=>({[`Lingote de ${root}`]:1,"Batería vieja":1})},
 {label:"Bloque sinterizado",icon:"🧱",desc:"Bloque de mineral consolidado mediante calor para uso estructural.",cost:(root)=>({[`Mena de ${root}`]:2,"Carbón":1})}
];
let materialRecipeTarget=8;
let materialRecipesNow=recipes.filter(r=>r.category==="Material").length;
for(const root of mineralRoots){
 const proper=root.charAt(0).toUpperCase()+root.slice(1);
 for(const form of materialForms){
  if(materialRecipesNow>=materialRecipeTarget)break;
  const out=`${form.label} de ${root}`;
  if(recipes.some(r=>r.out===out))continue;
  const rarity=Math.min(5,1+Math.floor((mineralRoots.indexOf(root))/7)+(materialForms.indexOf(form)%2));
  const cost=form.cost(root);
  addGenerated(out,{icon:form.icon,cat:"Material",r:rarity,val:10+mineralRoots.indexOf(root)*2+materialForms.indexOf(form)*3,desc:`${form.desc} Materia prima: ${proper}.`});
  recipes.push({id:`mat_bulk_${materialRecipesNow}`,name:out,icon:form.icon,desc:`${form.desc} Materia prima: ${proper}.`,cost,out,category:"Material"});
  materialRecipesNow++;
 }
 if(materialRecipesNow>=materialRecipeTarget)break;
}

// Recetas generadas: categorías separadas y costes con materiales de acceso común.
recipes.forEach(r=>{if(!r.category)r.category=(itemDB[r.out]||{}).cat||"Otro"});
// REWORK: no se generan recetas masivas de herramientas/armas/equipo/consumibles.
// Solo las recetas definidas a mano (Pico, Hacha, Pinzas + básicos) y materiales de procesado.
const craftableGenerated=[];
function generatedRecipeCost(name,cat){return {"Madera":1,"Chatarra":1};}


// REWORK 3.0: cada receta usa materiales de la MISMA rareza/nivel que el objeto final.
// Primero busca afinidad semántica; solo amplía la familia si no hay suficientes ingredientes.
function recipeTheme(name,desc="",cat=""){
 const t=(name+" "+desc).toLocaleLowerCase("es");
 if(/anomal|paradoja|cuánt|dimensional|vacío|fase|fractal|umbral|nulo|neón|plasma|reson|eco|espectro|energ|cuánt/.test(t))return "anomaly";
 if(/hongo|espora|resina|hoja|fibra|madera|rama|corteza|vegetal|biológ|tox|veneno|moco|gel|orgán|colmillo|criatura|caparazón|tejido|polen/.test(t))return "bio";
 if(/cristal|prisma|lente|cuarzo|geoda|vidrio|sílice|perla|ópt|gema/.test(t))return "crystal";
 if(/cable|circuit|electr|chip|batería|bobina|sensor|módulo|placa de datos|navegación|rastreo|holográf|conector|memoria|dron|pulso/.test(t))return "tech";
 if(/hierro|acero|metal|mena|lingote|aleación|chatarra|titanio|cobre|níquel|cobalto|tungsteno|wolframio|blindaje|armadura|espada|pico|hacha|martillo|arma|casco|escudo|peto|grebas|herramienta|malla|válvula|rotor|tornillo|forja|mineral|metal|acero/.test(t)||["Arma","Herramienta","Equipo","Lingote"].includes(cat))return "metal";
 return "general";
}
const recipeOutputs=new Set(recipes.map(r=>r.out));
const recipeMaterialPool=Object.keys(itemDB).filter(n=>["Material","Lingote"].includes(itemDB[n].cat));
function rebuildRecipeCosts(){
 // Solo rellena costes vacíos de recetas auto-generadas. Las recetas manuales (herramientas, armas, materiales básicos) conservan sus costes con sentido.
 for(const r of recipes){
  if(r.cost && Object.keys(r.cost).length)continue;
  const out=itemDB[r.out]||{};const tier=Math.max(1,Number(out.r)||1);const theme=recipeTheme(r.out,out.desc,r.category||out.cat);
  let pool=recipeMaterialPool.filter(n=>n!==r.out&&!recipeOutputs.has(n)&&(Number(itemDB[n].r)||1)===tier&&recipeTheme(n,itemDB[n].desc,itemDB[n].cat)===theme);
  if(pool.length<2)pool=recipeMaterialPool.filter(n=>n!==r.out&&!recipeOutputs.has(n)&&(Number(itemDB[n].r)||1)===tier);
  if(!pool.length)pool=recipeMaterialPool.filter(n=>n!==r.out&&(Number(itemDB[n].r)||1)===tier);
  if(!pool.length){r.cost={};continue}
  const hash=Array.from(r.id+"|"+r.out).reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
  const kinds=Math.min(pool.length,tier>=5?3:tier>=3?2:2), chosen=[];
  for(let i=0;i<kinds;i++)chosen.push(pool[(hash+i*7+i*i*3)%pool.length]);
  const cost={};chosen.forEach((n,i)=>{const quantity=Math.min(3,1+((hash>>>(i*3))&1)+(tier>=4?1:0));cost[n]=(cost[n]||0)+quantity});
  for(const n of Object.keys(cost))cost[n]=Math.min(3,cost[n]);r.cost=cost;
 }
}
rebuildRecipeCosts();

// REWORK mesa: recortar recetas auto sin sentido. Conservar herramientas (Pico/Hacha/Pinzas),
// armas/equipo básicos y un número limitado de materiales procesados.
(function pruneRecipes(){
  const kept=recipes.filter(r=>["Herramienta","Arma","Equipo","Material"].includes(r.category));
  recipes.length=0;recipes.push(...kept);
})();

// Nivel del objeto fabricado = max nivel de sus materiales de coste (1–5).
// Si entra un material N5 (p. ej. Lingote de iridio), el resultado es N5 aunque el resto sea N4.
(function syncRecipeOutputLevels(){
  const baseTier={
    "Madera":1,"Ramas":1,"Hojas":1,"Piedra":1,"Carbón":1,"Resina":1,"Chatarra":1,"Tornillo oxidado":1,
    "Mena de hierro":1,"Mena de cobre":1,"Cable de cobre":1,"Fibra vegetal":1,"Cuerda de fibra":1,
    "Cristal agrietado":2,"Batería vieja":2,"Placa electrónica":2,"Geoda":2,"Hoja mutada":2,
    "Lingote de hierro":2,"Lingote de cobre":2,"Cristal pulido":2,"Compuesto aislante":2,"Tabla reforzada":2,
    "Ladrillo de piedra":1,"Polvo de carbón":1,"Cable trenzado":2,"Placa de aleación":2,"Núcleo de batería":2,
    "Lingote de titanio":3,"Lingote de cobalto":3,"Lingote de níquel":2,"Lingote de aluminio":2,
    "Cristal de hielo azul":3,"Roca volcánica":3,"Espora viva":3,"Aleación extraña":3,
    "Lingote de tungsteno":4,"Lingote de obsidiana":4,"Lingote de wolframio":4,"Lingote de paladio":4,
    "Núcleo energético":4,"Núcleo de magma":4,
    "Lingote de iridio":5,"Lingote de uranio":5,"Lingote de platino":5,
    "Batería de neón":3,"Cable de fibra óptica":3,"Concha blindada":3,"Gel bioluminiscente":3
  };
  function tierOf(name){
    if(baseTier[name]!=null)return baseTier[name];
    const d=itemDB[name];
    if(d&&d.r)return Math.max(1,Math.min(5,Number(d.r)||1));
    if(/^Lingote de /.test(name))return 2;
    if(/^Mena de /.test(name))return 1;
    return 1;
  }
  for(const r of recipes){
    if(!r.cost||!r.out)continue;
    let maxR=1;
    for(const mat of Object.keys(r.cost))maxR=Math.max(maxR,tierOf(mat));
    maxR=Math.max(1,Math.min(5,maxR));
    const prev=itemDB[r.out]||{icon:r.icon,cat:r.category||"Otro",desc:r.desc};
    const mult={1:1,2:1.6,3:2.4,4:3.5,5:5}[maxR]||1;
    const baseVal=Math.max(8,Number(prev.val)||12);
    const val=Math.round(8+maxR*14+(Object.keys(r.cost).length*3));
    itemDB[r.out]={...prev,name:r.out,r:maxR,val:val,desc:prev.desc||r.desc};
    // stats scale lightly with level
    if(itemDB[r.out].gather!=null)itemDB[r.out].gather=Math.round((Number(prev.gather)||10)*(0.7+maxR*0.25));
    if(itemDB[r.out].damage!=null)itemDB[r.out].damage=Math.round((Number(prev.damage)||4)*(0.7+maxR*0.3));
    if(itemDB[r.out].defense!=null)itemDB[r.out].defense=Math.round((Number(prev.defense)||4)*(0.7+maxR*0.3));
    if(itemDB[r.out].extractBonus!=null)itemDB[r.out].extractBonus=Math.min(40,Math.round((Number(prev.extractBonus)||6)*(0.75+maxR*0.2)));
  }
})();


// Nivel del objeto fabricado = max nivel de sus materiales (mín. el r ya definido)
recipes.forEach(rec=>{
  if(!rec.out||!rec.cost)return;
  let maxR=1;
  Object.keys(rec.cost).forEach(n=>{maxR=Math.max(maxR,Number(info(n).r)||1)});
  if(!itemDB[rec.out])return;
  // Si algún material es N5, el resultado es N5; si no, al menos el max de ingredientes
  itemDB[rec.out].r=Math.max(Number(itemDB[rec.out].r)||1, maxR);
});



// FINAL_LEVEL_SYNC: nivel del objeto = max nivel de materiales del coste (cap 5)
(function finalLevelSync(){
  const baseTier={
    "Madera":1,"Ramas":1,"Hojas":1,"Piedra":1,"Carbón":1,"Resina":1,"Chatarra":1,"Tornillo oxidado":1,
    "Mena de hierro":1,"Mena de cobre":1,"Cable de cobre":1,"Fibra vegetal":1,
    "Cristal agrietado":2,"Batería vieja":2,"Placa electrónica":2,
    "Lingote de hierro":2,"Lingote de cobre":2,"Cristal pulido":2,"Compuesto aislante":2,
    "Lingote de titanio":3,"Lingote de cobalto":3,"Lingote de níquel":2,"Lingote de aluminio":2,
    "Cristal de hielo azul":3,"Roca volcánica":3,"Espora viva":3,
    "Lingote de tungsteno":4,"Lingote de obsidiana":4,"Lingote de wolframio":4,"Lingote de paladio":4,
    "Núcleo energético":4,"Núcleo de magma":4,
    "Lingote de iridio":5,"Lingote de uranio":5,"Lingote de platino":5,
    "Batería de neón":3,"Cable de fibra óptica":3,"Concha blindada":3,"Gel bioluminiscente":3
  };
  const tierOf=name=>{
    if(baseTier[name]!=null)return baseTier[name];
    const d=itemDB[name];
    if(d&&d.r)return Math.max(1,Math.min(5,Number(d.r)||1));
    if(/^Lingote de /.test(name)){
      const root=name.replace(/^Lingote de /,'');
      const map={iridio:5,platino:5,uranio:5,tungsteno:4,wolframio:4,obsidiana:4,paladio:4,titanio:3,cobalto:3,níquel:2,hierro:2,cobre:2,aluminio:2};
      return map[root]||2;
    }
    return 1;
  };
  for(const r of recipes){
    if(!r||!r.cost||!r.out||!itemDB[r.out])continue;
    let maxR=1;
    for(const mat of Object.keys(r.cost))maxR=Math.max(maxR,tierOf(mat));
    maxR=Math.max(1,Math.min(5,maxR));
    itemDB[r.out].r=maxR;
  }
})();

const supplyPacks = [
 {id:"field",name:"Caja de campo",icon:"📦",price:35,desc:"Materiales variados y una pequeña posibilidad de equipo raro.",color:"common"},
 {id:"black",name:"Contenedor negro",icon:"🗃️",price:90,desc:"Mejores probabilidades de objetos de nivel 3 o superior.",color:"rare"},
 {id:"anomaly",name:"Cápsula anómala",icon:"🧬",price:180,desc:"Objetos extraños, criaturas capturadas y tecnología experimental.",color:"legendary"}
];
// Bestiario procedural: linajes base x 20 variantes cada uno; nombres y estadísticas se generan al iniciar cada encuentro.
const enemyFamilies = [
 {root:"Zombie",icon:"🧟",loot:"Colmillo",baseHp:18,desc:"No-muerto reanimado por residuos del Colapso."},
 {root:"Mutante",icon:"🧬",loot:"Moco tóxico",baseHp:22,desc:"Organismo alterado por radiación y sustancias anómalas."},
 {root:"Merodeador humano",icon:"🧑‍🚀",loot:"Chatarra",baseHp:20,desc:"Superviviente hostil que saquea las rutas de suministro."},
 {root:"Infectado",icon:"☣️",loot:"Espora viva",baseHp:21,desc:"Portador de una infección adaptativa."},
 {root:"Soldado desertor",icon:"🪖",loot:"Placa electrónica",baseHp:27,desc:"Combatiente abandonado por una cadena de mando extinta."},
 {root:"Ghoul",icon:"👹",loot:"Colmillo",baseHp:24,desc:"Depredador humanoide adaptado a zonas oscuras."},
 {root:"Híbrido",icon:"🧟‍♂️",loot:"Moco tóxico",baseHp:25,desc:"Cruce inestable entre materia orgánica y mutación."},
 {root:"Cosechador",icon:"🤖",loot:"Chatarra",baseHp:26,desc:"Autómata de recuperación que identifica al operador como intruso."},
 {root:"Aberración",icon:"👁️",loot:"Núcleo energético",baseHp:30,desc:"Forma de vida nacida de una anomalía persistente."},
 {root:"Dron biológico",icon:"🪲",loot:"Batería vieja",baseHp:19,desc:"Máquina orgánica que caza mediante impulsos eléctricos."},
 {root:"Larva de ferrita",icon:"🪲",loot:"Escama ferrítica",baseHp:23,desc:"Larva mineral que se alimenta de metales y campos magnéticos."},
 {root:"Polilla de fase",icon:"🦋",loot:"Membrana de fase",baseHp:20,desc:"Insecto anómalo que alterna entre presencia y ausencia."},
 {root:"Sabueso de neón",icon:"🐺",loot:"Batería de neón",baseHp:28,desc:"Depredador sintético que rastrea impulsos eléctricos."},
 {root:"Esporífero errante",icon:"🍄",loot:"Espora viva",baseHp:26,desc:"Colonia móvil de hongos que se defiende con nubes de esporas."},
 {root:"Gólem de escoria",icon:"🗿",loot:"Roca volcánica",baseHp:36,desc:"Masa de roca fundida que se ha endurecido en forma de guardián."},
 {root:"Medusa de eco",icon:"🪼",loot:"Gel bioluminiscente",baseHp:25,desc:"Entidad flotante que imita señales para confundir a sus presas."},
 {root:"Archivista hueco",icon:"🕯️",loot:"Archivo de ceniza",baseHp:31,desc:"Entidad que recorre bibliotecas derrumbadas y guarda fragmentos de recuerdos ajenos."},
 {root:"Cartógrafo de la grieta",icon:"🦑",loot:"Ampolla de memoria",baseHp:38,desc:"Criatura de extremidades translúcidas que dibuja rutas en el aire antes de que aparezcan."},
 {root:"Larva de hielo negro",icon:"🪱",loot:"Núcleo criogénico",baseHp:33,desc:"Organismo criogénico que se oculta en las juntas de los módulos."},
 {root:"Centinela de archivo",icon:"🤖",loot:"Cinta de memoria",baseHp:37,desc:"Autómata que protege registros de acceso restringido."},
 {root:"Ciervo de ferrita",icon:"🦌",loot:"Raíz metálica",baseHp:35,desc:"Criatura de placas magnéticas que detecta depósitos bajo tierra."},
 {root:"Vigía orbital",icon:"👁️",loot:"Fragmento de órbita",baseHp:42,desc:"Entidad mecánica que observa varias posiciones del mismo espacio."},
 {root:"Peregrino nulo",icon:"🌑",loot:"Arena nula",baseHp:44,desc:"Forma de vida que deja zonas de silencio a su paso."},
 {root:"Ingeniero errante",icon:"🦾",loot:"Válvula de presión",baseHp:39,desc:"Autómata de mantenimiento que sigue reparando una fábrica sin operadores."},
 {root:"Mantis de sílice",icon:"🦗",loot:"Vidrio de escarcha",baseHp:31,desc:"Depredador cristalino que se camufla entre estructuras minerales."},
 {root:"Custodio de deriva",icon:"🛡️",loot:"Prisma de deriva",baseHp:46,desc:"Guardián de rutas dimensionales que ataca a quienes alteran sus coordenadas."},
 {root:"Medusa de vacío",icon:"🪼",loot:"Perla de vacío",baseHp:41,desc:"Entidad flotante que absorbe señales y energía del entorno."},
 {root:"Escarabajo de osmio",icon:"🪲",loot:"Lingote de osmio",baseHp:48,desc:"Artrópodo blindado que acumula metales densos en su caparazón."}
];
const enemyVariants = ["Ceniza","Hundido","Errante","Rojo","Ciego","Roto","Veloz","Blindado","Hambriento","Silente","Radiactivo","Abisal","Óxido","Nocturno","Hueco","Feral","Marchito","Inestable","de la Grieta","de Cenagal"];
const enemyCatalog=[];
enemyFamilies.forEach((family,fi)=>enemyVariants.forEach((variant,vi)=>{
 const name=`${family.root} ${variant}`; const rank=Math.min(5,1+Math.floor(((fi+vi)%10)/2));
 const enemy={name,icon:family.icon,hp:family.baseHp+(vi%5)*3+Math.floor(fi/2)*2,loot:family.loot,family:family.root,rank,desc:family.desc}; enemyCatalog.push(enemy);
 addGenerated(name,{icon:family.icon,cat:"Criatura",r:rank,val:18+rank*13,desc:`${family.desc} Variante ${variant.toLowerCase()}. Puede adquirirse tras un combate y desarrollar una habilidad propia.`});
}));


// === Anomalías Base (contenido de campo, ~200) ===
// Aparecen en cualquier zona con probabilidad baja.
const anomalyPrefixes=["Eco","Fragmento","Núcleo","Prisma","Orbe","Velo","Sello","Grieta","Lente","Nodo","Célula","Relé","Semilla","Crisálida","Espejo","Ancla","Faro","Umbral","Vórtice","Hilo","Chispa","Marea","Bruma","Ceniza","Cristal","Pulso","Sombra","Destello","Ciclo","Marca","Rastro","Huella","Sustrato","Matriz","Cápsula","Filamento","Resonador","Catalizador","Espejismo","Paradoja","Eclipse","Aurora","Nébula","Quimera","Fase","Vacío","Entropía","Horizonte","Singularidad","Réplica"];
const anomalyCores=["de Fase","Abisal","Espectral","Cuántico","Temporal","Fractal","Resonante","Inestable","Silente","Radiante","Errante","Soberano","Mutante","Prismático","Gravitatorio","Fotónico","Nulo","Latente","Viviente","Anómalo","Dimensiónal","Cinético","Magnético","Criógeno","Voltaico","Orgánico","Mineral","Etéreo","Cíclico","Profundo"];
const anomalySuffixes=["Menor","Estable","Latente","Primario","Secundario","de Campo","de Bolsillo","Residual","Puro","Denso","Fino","Bruto","Pulido","Activado","Dormido","Despertar","de Umbral","de Borde","de Núcleo","Errático"];
const baseAnomalyNames=[];
(()=>{
  const seen=new Set();
  let i=0;
  while(baseAnomalyNames.length<200&&i<5000){
    i++;
    const a=anomalyPrefixes[i%anomalyPrefixes.length];
    const b=anomalyCores[(i*7)%anomalyCores.length];
    const c=anomalySuffixes[(i*13)%anomalySuffixes.length];
    // Variar estructura para más diversidad
    const patterns=[
      `${a} ${b}`,
      `${a} ${b} ${c}`,
      `${a} ${c}`,
      `${b.replace(/^de /,"")} ${a}`,
    ];
    const name=patterns[i%patterns.length];
    if(seen.has(name))continue;
    seen.add(name);
    baseAnomalyNames.push(name);
    const r=1+(i%5===0?2:i%3===0?1:0); // mayoría N1-N2, algunas N3
    const rarity=Math.min(5,Math.max(1,r));
    const val=18+rarity*14+(i%7)*3;
    addGenerated(name,{
      icon:"🧬",
      cat:"Anomalía",
      r:rarity,
      val,
      desc:`Anomalía de campo de grado ${rarity}. Se manifiesta de forma espontánea en zonas exploradas y emite una firma dimensional débil.`,
      slot:null,
      originHint:"exploración"
    });
  }
})();
const BASE_ANOMALY_DROP_CHANCE=0.08; // 8% base por expedición de encontrar una anomalía


// === EXPANSIÓN: TRÁFICO DE ÓRGANOS ===
const ORGAN_PARTS=["Corazón","Hígado","Pulmón","Riñón","Cerebro","Ojo","Médula","Glándula","Nervio","Vesícula","Bazo","Tejido","Ganglio","Cartílago","Plasma orgánico","Adrenalina cristalizada","Retina","Timo","Páncreas","Tráquea","Intestino","Piel quitinosa","Cuerno visceral","Saco de esporas","Núcleo biológico","Membrana","Fibras musculares","Médula espinal","Glándula de veneno","Saco biliar"];
const ORGAN_CREATURE_ROOTS=["Zombie","Mutante","Infectado","Ghoul","Híbrido","Aberración","Cosechador","Merodeador humano","Soldado desertor","Parásito","Bestia","Larva","Coloso","Simbionte","Vástago","Espectro carnal","Depredador","Titán menor","Engendro","Huésped","Rondador","Carroñero","Devorador","Semilla viva","Nido ambulante"];
const baseOrganNames=[];
(()=>{
 const seen=new Set();
 let n=0;
 ORGAN_CREATURE_ROOTS.forEach((root,ri)=>{
  ORGAN_PARTS.forEach((part,i)=>{
   const name=`${part} de ${root}`;
   if(seen.has(name))return;
   seen.add(name);
   baseOrganNames.push(name);
   const r=1+((i+ri)%5);
   addGenerated(name,{
    icon:"🫀",
    cat:"Órgano",
    r:Math.min(5,Math.max(1,r)),
    val:18+r*14+(i%7)*3,
    desc:`Órgano extraído de ${root.toLowerCase()}. Tejido ilegal de alto valor en el mercado negro.`,
    trait:"Ilegal",
    affix:"Ilegal",
    illegal:true,
    organPart:part,
    organRoot:root
   });
   n++;
  });
 });
 // 100+ órganos adicionales con nombres propios
 const extra=[
  "Corazón de umbral","Hígado de ceniza","Pulmón de niebla","Riñón prismático","Cerebro de eco","Ojo de grieta","Médula de vacío","Glándula de fase","Nervio cuántico","Vesícula tóxica",
  "Bazo espectral","Tejido de umbral","Ganglio abisal","Cartílago ferrítico","Plasma mutante","Retina de neón","Timo residual","Páncreas irradiado","Tráquea de esporas","Intestino de raíz",
  "Piel de quitina negra","Cuerno visceral menor","Saco de esporas vivas","Núcleo biológico inestable","Membrana dimensional","Fibras de titanio orgánico","Médula del Colapso","Glándula hipervenenosa","Saco biliar anómalo","Adrenalina solidificada",
  "Corazón gemelo","Hígado trilobulado","Pulmón de cristal","Riñón dual","Cerebro fragmentado","Ojo compuesto","Médula luminiscente","Glándula de control","Nervio de mando","Vesícula de ácido",
  "Bazo de reserva","Tejido regenerativo","Ganglio sensorial","Cartílago de impacto","Plasma negro","Retina térmica","Timo de inmunidad rota","Páncreas de azúcar anómalo","Tráquea blindada","Intestino filtrante",
  "Piel reflectante","Cuerno de carga","Saco de larva","Núcleo de colmena","Membrana parasitaria","Fibras de agarre","Médula de mando","Glándula de camuflaje","Saco de tinta","Adrenalina de combate",
  "Corazón de forja","Hígado de óxido","Pulmón de azufre","Riñón de cuarzo","Cerebro de archivo","Ojo de faro","Médula de estación","Glándula de ruido","Nervio de red","Vesícula de refrigerante",
  "Bazo de batería","Tejido de cable","Ganglio óptico","Cartílago de muelle","Plasma de reactor","Retina de escáner","Timo de filtro","Páncreas de catalizador","Tráquea de ventilación","Intestino de conducto",
  "Piel de aislamiento","Cuerno de antena","Saco de presión","Núcleo de servo","Membrana de sello","Fibras de tracción","Médula de protocolo","Glándula de cifrado","Saco de datos","Adrenalina de sobrecarga",
  "Corazón del pantano","Hígado del bosque","Pulmón del arrecife","Riñón del glaciar","Cerebro del búnker","Ojo del observatorio","Médula de la cantera","Glándula del vertedero","Nervio de la grieta","Vesícula del laboratorio"
 ];
 extra.forEach((name,i)=>{
  if(seen.has(name))return;
  seen.add(name);baseOrganNames.push(name);
  const r=1+(i%5);
  addGenerated(name,{icon:"🫀",cat:"Órgano",r,val:28+r*12+(i%9)*3,desc:"Órgano anómalo de procedencia incierta. Rasgo ilegal.",trait:"Ilegal",affix:"Ilegal",illegal:true,marketOrgan:i<18});
  n++;
 });
})();


function equippedExtractBonus(){
 const skillEx=skillBonus("extract");
 const id=state.equipped&&state.equipped.tongs;
 const x=id?state.inventory.find(i=>i.id===id):null;
 const tongs=x?Math.max(0,Number(x.extractBonus)||Number(info(x.name).extractBonus)||0):0;
 return tongs+skillEx;
}
function organExtractChance(organName,selectedCount){return extractionSuccessChance(selectedCount,1);}

function isIllegalItem(x){
 if(!x)return false;
 const name=String(x.name||"");
 const cat=x.cat||info(name).cat||"";
 const trait=String(x.trait||x.affix||"");
 // Piezas y autómatas (robóticos) NUNCA ilegales
 if(cat==="Pieza")return false;
 if(x.robotic||info(name).robotic)return false;
 if(trait==="Autómata"||trait==="Núcleo anómalo"||/aut[oó]mata/i.test(name))return false;
 // Solo: órganos, armas balísticas, Engendros orgánicos e Híbridos anómalos orgánicos
 if(cat==="Órgano")return true;
 if(isBallisticWeapon(name,x))return true;
 if(trait==="Engendro"||/engendro/i.test(name))return true;
 if((trait==="Hibridación anómala"||/hibridaci[oó]n an[oó]mala/i.test(trait)||/h[ií]brido an[oó]malo/i.test(name))&&!x.robotic)return true;
 return false;
}
function applyIllegalPolicy(item){
 if(!item||typeof item!=="object")return item;
 if(isIllegalItem(item)){
  item.illegal=true;
  if(!item.trait||item.trait==="Ilegal")item.trait=item.trait&&item.trait!=="Ilegal"?item.trait:"Ilegal";
  if(item.cat==="Órgano"){item.trait="Ilegal";item.affix="Ilegal";}
  return item;
 }
 // Pierde ilegalidad residual
 item.illegal=false;
 if(item.trait==="Ilegal")delete item.trait;
 if(item.affix==="Ilegal")delete item.affix;
 if(item.secondaryTrait){
  item.secondaryTrait=String(item.secondaryTrait).split("·").map(s=>s.trim()).filter(s=>s&&s!=="Ilegal").join(" · ");
  if(!item.secondaryTrait)delete item.secondaryTrait;
 }
 return item;
}

const ROBOT_PARTS=["Servo","Actuador","Placa base","Núcleo lógico","Sensor óptico","Módulo de potencia","Articulación hidráulica","Chasis parcial","Unidad de memoria","Antena de enlace","Disipador","Puerto de datos","Rodamiento","Cableado blindado","Celda energética","Procesador táctico","Lente de enfoque","Brazo auxiliar","Oruga compacta","Escudo térmico","Filtro de plasma","Bobina de inducción","Tarjeta de control","Junta magnética","Cámara térmica","Batería de reserva","Ventilador de flujo","Conector de fase","Estructura de titanio","Chip de navegación"];
const ROBOT_CREATURE_ROOTS=["Autómata","Dron","Androide","Servo","Centinela","Ensamblador","Centinela","Vigía","Ingeniero","Custodio"];
[
 ["Dron de patrulla",2,42,"Unidad aérea ligera de reconocimiento."],
 ["Servo de carga",2,46,"Brazo móvil de transporte industrial."],
 ["Androide de mantenimiento",3,68,"Técnico autónomo de pasillos sellados."],
 ["Centinela de muelle",3,72,"Torreta móvil con sensores de proximidad."],
 ["Ensamblador de línea",3,75,"Robot de producción con múltiples actuadores."],
 ["Autómata de archivo",4,98,"Guardián mecánico de registros."],
 ["Dron de asalto",4,105,"Unidad táctica con placas reforzadas."],
 ["Ingeniero errante",4,103,"Autómata de mantenimiento sin órdenes."],
 ["Vigía orbital",5,128,"Entidad mecánica de vigilancia múltiple."],
 ["Custodio de deriva",5,132,"Guardián de rutas dimensionales."],
 ["Coloso de chatarra",5,140,"Chasis pesado reconstruido con restos."],
 ["Araña de soldadura",3,70,"Multi-patas de ensamblaje preciso."],
 ["Perro mecánico",2,48,"Unidad cuadrúpeda de escolta."],
 ["Torreta errante",3,66,"Plataforma armada semi-autónoma."],
 ["Núcleo ambulante",4,110,"Procesador central con tren de orugas."]
].forEach(([name,r,val,desc])=>{
 if(!itemDB[name])addGenerated(name,{icon:"🤖",cat:"Criatura",r,val,desc,companion:true,robotic:true});
});
function isRoboticCreature(x){
 if(!x)return false;
 if(x.robotic||info(x.name||x).robotic)return true;
 const n=String(x?.name||"").toLocaleLowerCase("es");
 return /dron|robot|mec[aá]n|androide|aut[oó]mat|cibern|servo|unidad t[aá]ctica|ensambl|chasis|placa neuronal|coloso de chatarra|araña de soldadura|perro mecánico|torreta|n[uú]cleo ambulante|vig[ií]a orbital|centinela de/.test(n);
}
function pieceCandidatesForRobot(x){
 if(!x||x.cat!=="Criatura"||!isRoboticCreature(x))return [];
 const n=String(x.name||"");
 let root=ROBOT_CREATURE_ROOTS.find(r=>n.toLocaleLowerCase("es").includes(r.toLocaleLowerCase("es")));
 const baseName=root||n.split(" ")[0]||"unidad";
 return ROBOT_PARTS.map(part=>{
  const name=`${part} de ${baseName}`;
  if(!itemDB[name])addGenerated(name,{icon:"⚙️",cat:"Pieza",r:1,val:18,desc:`Componente robótico recuperado de ${baseName}.`,robotPart:true});
  return name;
 });
}
function equippedDriverBonus(){
 const id=state.equipped&&state.equipped.driver;
 const x=id?state.inventory.find(i=>i.id===id):null;
 const d=x?(Number(x.driverBonus)||Number(info(x.name).driverBonus)||0):0;
 return d+skillBonus("extract");
}
function dismantleSuccessChance(selectedCount,creatureLevel){
 const n=Math.max(1,selectedCount||1);
 const r=Math.max(1,Math.min(5,Number(creatureLevel)||1));
 let chance=88-(r*6)-((n-1)*10)+equippedDriverBonus();
 return Math.max(8,Math.min(92,Math.round(chance)));
}

function organCandidatesForCreature(x){
 if(!x||x.cat!=="Criatura"||isRoboticCreature(x))return [];
 const n=String(x.name||"");
 const maxR=Math.max(1,Math.min(5,Number(x.r)||1));
 let root=ORGAN_CREATURE_ROOTS.find(r=>n.toLocaleLowerCase("es").includes(r.toLocaleLowerCase("es")));
 const baseName=root||n.split(" ")[0]||"desconocido";
 const parts=root?ORGAN_PARTS:ORGAN_PARTS.slice(0,10);
 // Devuelve lista de nombres base de órgano (sin nivel fijo); el nivel se tira al extraer
 return parts.map(part=>{
  const name=`${part} de ${baseName}`;
  // plantilla base N1 en itemDB; las instancias tendrán su propio r al extraer
  if(!itemDB[name])addGenerated(name,{icon:"🫀",cat:"Órgano",r:1,val:20,desc:`Órgano extraído de criaturas. Rasgo ilegal. El nivel se determina al extraer (hasta N${maxR}).`,trait:"Ilegal",affix:"Ilegal",illegal:true,organPart:part});
  return name;
 });
}
function rollOrganLevel(creatureLevel){
 const maxR=Math.max(1,Math.min(5,Number(creatureLevel)||1));
 // distribución sesgada a niveles bajos, pero puede salir hasta maxR
 const weights=[];
 for(let i=1;i<=maxR;i++)weights.push(Math.max(1,maxR-i+2));
 const total=weights.reduce((a,b)=>a+b,0);
 let roll=Math.random()*total;
 for(let i=0;i<weights.length;i++){roll-=weights[i];if(roll<=0)return i+1}
 return maxR;
}
function extractionSuccessChance(selectedCount,creatureLevel){
 const n=Math.max(1,selectedCount||1);
 const r=Math.max(1,Math.min(5,Number(creatureLevel)||1));
 // Un solo % global: baja con más órganos y con nivel de criatura; bonus pinzas
 let chance=88-(r*6)-((n-1)*10)+equippedExtractBonus();
 return Math.max(8,Math.min(92,Math.round(chance)));
}

function recipeRequiredLevel(r){
 const lvl=Math.max(1,Math.min(5,Number(info(r.out).r||r.r||1)));
 return ({1:1,2:10,3:20,4:30,5:40})[lvl]||1;
}
function recipeUnlocked(r){return state.level>=recipeRequiredLevel(r)}

let extractCreatureId=null;


// Pinzas de extracción (equipo slot tongs)
const TONGS_CATALOG=[
 {name:"Pinzas oxidadas",r:1,val:22,extractBonus:6,desc:"Pinzas básicas de campo. Mejoran ligeramente el éxito de extracción."},
 {name:"Pinzas de chatarra",r:1,val:28,extractBonus:8,desc:"Soldadas con restos. Algo más firmes."},
 {name:"Pinzas de campo",r:2,val:45,extractBonus:12,desc:"Kit médico improvisado. Buen agarre en tejidos."},
 {name:"Pinzas quirúrgicas",r:2,val:55,extractBonus:15,desc:"Filo limpio. Ideal para órganos de nivel bajo-medio."},
 {name:"Pinzas de precisión",r:3,val:78,extractBonus:20,desc:"Microajuste manual. Sube el éxito en extracciones múltiples."},
 {name:"Pinzas de titanio",r:3,val:90,extractBonus:22,desc:"Resistentes a fluidos corrosivos."},
 {name:"Pinzas de fase",r:4,val:120,extractBonus:28,desc:"Estabilizan tejidos anómalos durante la extracción."},
 {name:"Pinzas de vacío",r:4,val:135,extractBonus:30,desc:"Succión controlada. Menos desperdicio de tejido."},
 {name:"Pinzas del umbral",r:5,val:180,extractBonus:36,desc:"Instrumento de contrabando de élite."},
 {name:"Pinzas de eclipse",r:5,val:200,extractBonus:40,desc:"Máxima precisión en extracciones de alto nivel."},
 {name:"Pinzas de neón",r:3,val:85,extractBonus:18,desc:"Iluminación integrada para trabajo en oscuridad."},
 {name:"Pinzas abisales",r:4,val:125,extractBonus:26,desc:"Diseñadas para tejidos de grieta dimensional."},
 {name:"Pinzas de cristal",r:2,val:50,extractBonus:11,desc:"Transparentes y frágiles, pero exactas."},
 {name:"Pinzas de ferrita",r:2,val:48,extractBonus:13,desc:"Mordaza magnética suave."},
 {name:"Pinzas simbióticas",r:4,val:140,extractBonus:32,desc:"Se adaptan al tejido objetivo."},
 {name:"Pinzas de contrabando",r:3,val:95,extractBonus:19,desc:"Marca negra del mercado clandestino."},
 {name:"Pinzas de operador",r:3,val:88,extractBonus:17,desc:"Estándar de clínicas ilegales."},
 {name:"Pinzas resonantes",r:4,val:130,extractBonus:27,desc:"Vibración que separa tejidos sin desgarrar."},
 {name:"Pinzas de singularidad",r:5,val:210,extractBonus:42,desc:"Extracción casi quirúrgica de órganos N5."},
 {name:"Pinzas del Colapso",r:5,val:220,extractBonus:45,desc:"Reliquia de quirófanos del Colapso."}
];
TONGS_CATALOG.forEach(t=>{
 addGenerated(t.name,{icon:"⚕",cat:"Herramienta",r:t.r,val:t.val,desc:t.desc,slot:"tongs",extractBonus:t.extractBonus,ability:`+${t.extractBonus}% éxito de extracción`});
});

// === MERCADO ===
const MARKET_RATES=[50,75,100,150,200];





// === MERCADO: armas balísticas (solo mercado negro) + contrabando ===
[
 ["Pistola oxidada",{icon:"🔫",cat:"Arma",r:1,val:28,desc:"Pistola de chatarra. Munición improvisada. Ilegal en zona civil.",slot:"weapon",damage:8,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Pistola de hierro",{icon:"🔫",cat:"Arma",r:2,val:55,desc:"Pistola mecanizada de lingote de hierro. Balística ilegal.",slot:"weapon",damage:14,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Revólver de cobre",{icon:"🔫",cat:"Arma",r:2,val:60,desc:"Revólver de cañón corto de cobre. Contrabando balístico.",slot:"weapon",damage:15,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Subfusil de chatarra",{icon:"🔫",cat:"Arma",r:3,val:95,desc:"SMG improvisado con piezas de vertedero. Ilegal.",slot:"weapon",damage:22,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Escopeta de hierro",{icon:"🔫",cat:"Arma",r:3,val:105,desc:"Escopeta de cañón recortado. Alto daño a corta distancia.",slot:"weapon",damage:26,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Rifle de titanio",{icon:"🔫",cat:"Arma",r:4,val:150,desc:"Rifle de precisión de lingote de titanio. Uso militar ilegal.",slot:"weapon",damage:34,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Fusil de asalto de cobalto",{icon:"🔫",cat:"Arma",r:4,val:160,desc:"Fusil de asalto reforzado con cobalto. Contrabando pesado.",slot:"weapon",damage:36,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Francotirador de tungsteno",{icon:"🔫",cat:"Arma",r:5,val:220,desc:"Rifle de francotirador de tungsteno. Arma de restricción máxima.",slot:"weapon",damage:48,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Ametralladora de iridio",{icon:"🔫",cat:"Arma",r:5,val:250,desc:"Ametralladora pesada de iridio. Contrabando de guerra.",slot:"weapon",damage:52,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 ["Lanzagranadas de chatarra",{icon:"💣",cat:"Arma",r:4,val:170,desc:"Lanzagranadas improvisado. Extremadamente ilegal.",slot:"weapon",damage:40,ballistic:true,illegal:true,trait:"Ilegal",affix:"Ilegal"}],
 // Contrabando (Otros ilegales)
 ["Fichero robado",{icon:"📁",cat:"Contrabando",r:1,val:22,desc:"Documentación clasificada extraída de un terminal. Contrabando de datos.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Chip de acceso negro",{icon:"💾",cat:"Contrabando",r:2,val:40,desc:"Chip que abre puertas de zonas restringidas. Ilegal.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Estupefaciente de espora",{icon:"💊",cat:"Contrabando",r:2,val:45,desc:"Dosis compacta de espora procesada. Contrabando químico.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Contrato de silenciador",{icon:"📜",cat:"Contrabando",r:3,val:70,desc:"Documento que autoriza un trabajo oscuro. Mercado negro.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Célula de contrabando",{icon:"🔋",cat:"Contrabando",r:3,val:75,desc:"Batería militar robada de un convoy. Ilegal.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Implante de memoria pirata",{icon:"🧠",cat:"Contrabando",r:4,val:110,desc:"Implante neural con datos robados. Contrabando tecnológico.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Llave de bóveda negra",{icon:"🗝️",cat:"Contrabando",r:4,val:120,desc:"Llave física de una bóveda de la red clandestina.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Núcleo de arma prohibida",{icon:"⚛️",cat:"Contrabando",r:5,val:180,desc:"Núcleo energético para armamento restringido. Máxima ilegalidad.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Manifiesto del Colapso",{icon:"📕",cat:"Contrabando",r:5,val:200,desc:"Texto prohibido sobre el día del Colapso. Censurado por la Central.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}],
 ["Valija diplomática falsa",{icon:"💼",cat:"Contrabando",r:3,val:80,desc:"Maletín con sellos falsificados para pasar controles.",illegal:true,trait:"Ilegal",affix:"Ilegal",contraband:true}]
].forEach(([name,data])=>{if(!itemDB[name])itemDB[name]={name,...data};else Object.assign(itemDB[name],data);});

function marketDayKey(){
 const d=new Date();
 return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function seededRand(seed){
 let s=seed>>>0;
 return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
}

function isBallisticWeapon(name,data){
 const n=String(name||"");
 const d=data||info(n)||{};
 if(d.ballistic)return true;
 if(d.cat!=="Arma"&&!/arma/i.test(String(d.cat||"")))return false;
 return /rifle|pistola|bala|bal[ií]st|fusil|escopeta|smg|rev[oó]lver|lanzagranadas|francotirador|ametralladora|subfusil/i.test(n);
}
function isMarketRecipeItem(name){
 try{return typeof recipes!=="undefined"&&recipes.some(r=>r.out===name);}catch(_){return false;}
}
function isLegalMarketItem(name,data){
 const d=data||info(name)||{};
 if(!d||!d.cat)return false;
 if(d.illegal||d.trait==="Ilegal"||d.cat==="Órgano"||d.cat==="Criatura"||d.cat==="Anomalía")return false;
 if(isBallisticWeapon(name,d)||d.ballistic)return false;
 // Solo catálogo sensato: recetas de la mesa + materiales/lingotes base + consumibles de campo
 const cat=d.cat;
 if(["Material","Lingote"].includes(cat))return true;
 if(cat==="Consumible"&&!d.procedural)return true;
 if(["Herramienta","Arma","Equipo"].includes(cat))return isMarketRecipeItem(name)||!!d.marketLegal;
 return false;
}

itemDB["Polvo de Refinita"]={icon:"✧",cat:"Otro",r:1,val:1,desc:"Residuo de un refinamiento fallido. Material común de la Refinadora. Cada unidad suma +5% de éxito y se consume al refinar.",name:"Polvo de Refinita",refineDust:true};
function isRefineDust(x){
  const n=typeof x==="string"?x:(x&&x.name)||"";
  const d=typeof x==="object"&&x?x:info(n);
  return n==="Polvo de Refinita"||!!(d&&d.refineDust);
}
function isContrabandItem(x){
  const d=typeof x==="object"&&x?{...info(x.name),...x}:info(x);
  return !!(d&&(d.contraband||d.cat==="Contrabando"));
}
function itemOriginZones(name){
  try{return (zones||[]).filter(z=>Array.isArray(z.loot)&&z.loot.includes(name)).map(z=>z.name);}catch(_){return []}
}
function isItemEquipped(id){
  return Object.values(state.equipped||{}).includes(id);
}
function equippedSlotOf(id){
  const e=Object.entries(state.equipped||{}).find(([,v])=>v===id);
  return e?e[0]:null;
}
function pickerPageSize(){
  try{
    const mobile=window.matchMedia("(max-width:900px)").matches||document.body.classList.contains("layout-mobile");
    return mobile?6:9;
  }catch(_){return 9}
}
function isOtroOnlyItem(x){
  const n=typeof x==="string"?x:(x&&x.name)||"";
  const d=typeof x==="object"&&x?{...info(n),...x}:info(n);
  // Categoría Otro (no contrabando): origen fijo, no entra en mejora/intercambio/suministros
  if(!d)return false;
  if(d.cat==="Contrabando"||d.contraband)return false;
  if(n==="Polvo de Refinita"||d.refineDust)return true;
  return d.cat==="Otro";
}

function isBlackMarketItem(name,data){
 const d=data||info(name)||{};
 if(!d||!d.cat)return false;
 // Sin criaturas en el mercado
 if(d.cat==="Criatura")return false;
 // Órganos: solo selección propia (sin raíz de criatura) para el catálogo; el diario puede usar marketOrgan
 if(d.cat==="Órgano")return !!(d.marketOrgan||(!d.organRoot&&d.illegal));
 if(d.contraband||d.cat==="Contrabando"||d.ballistic)return true;
 if(isBallisticWeapon(name,d))return true;
 if(d.illegal||d.trait==="Ilegal")return d.cat!=="Criatura";
 return false;
}
function marketBuyPageSize(){
 try{
  const mobile=window.matchMedia("(max-width:900px)").matches||document.body.classList.contains("layout-mobile");
  return mobile?4:6;
 }catch(_){return 6}
}
function ensureMarketDay(){
 state.market=state.market||{};
 const key=marketDayKey();
 if(state.market.day===key&&state.market.sellRate&&state.market.dailyLegal&&state.market.dailyBlack&&state.market.dailyLegal.length===12&&state.market.dailyBlack.length===12&&state.market.v===2)return;
 const seed=Array.from(key).reduce((h,ch)=>((h<<5)-h)+ch.charCodeAt(0)|0,0)>>>0;
 const rnd=seededRand(seed||1);
 const rate=MARKET_RATES[Math.floor(rnd()*MARKET_RATES.length)];
 const blackRate=MARKET_RATES[Math.floor(rnd()*MARKET_RATES.length)];
 // daily legal pool from non-illegal catalog
 const legalPool=Object.keys(itemDB).filter(n=>{const d=itemDB[n];return d&&d.val>0&&isLegalMarketItem(n,d)});
 const blackPool=Object.keys(itemDB).filter(n=>{const d=itemDB[n];return d&&d.val>0&&isBlackMarketItem(n,d)});
 const pickDaily=(pool,n)=>{
  const copy=pool.slice();
  const out=[];
  for(let i=0;i<n&&copy.length;i++){
   const idx=Math.floor(rnd()*copy.length);
   const name=copy.splice(idx,1)[0];
   const stock=1+Math.floor(rnd()*4);
   out.push({name,stock,maxStock:stock,price:Math.max(1,Math.ceil((itemDB[name].val||10)*(0.9+rnd()*0.5)))});
  }
  return out;
 };
 state.market={
  day:key,
  sellRate:rate,
  blackSellRate:blackRate,
  dailyLegal:pickDaily(legalPool,12),
  dailyBlack:pickDaily(blackPool.length?blackPool:legalPool,12),
  v:2
 };
}
function marketRequiredLevel(item){
 const r=Math.max(1,Math.min(5,Number(item.r)||1));
 return ({1:1,2:10,3:20,4:30,5:40})[r]||1;
}


function rarityClass(r){return "r"+Math.max(1,Math.min(5,Number(r)||1));}
function pickerMetaHtml(x){
  const r=Math.max(1,Math.min(5,Number(x.r)||Number(info(x.name).r)||1));
  const v=Math.max(1,Number(x.val)||Number(info(x.name).val)||1);
  const qty=Number(x.qty)||0;
  return `<span class="rarity ${rarityClass(r)}">N${r}</span> · ${formatCredits(v,13)}${qty>1?` · <span class="muted">×${qty}</span>`:""}`;
}

function formatCredits(amount,size=14){return `${creditsIconMarkup(size)}<span class="credits-amount">${Number(amount||0).toLocaleString("es-ES")}</span>`;}

function hudIconMarkup(kind,size=22){
 const s=Number(size)||22;
 const common=`class="hud-icon" width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"`;
 const stroke='#53f2d1', mute='#7a9aa8', gold='#f5c542', red='#ff6b7a', blue='#6ec8ff', purple='#c18bff';
 const icons={
  // skills
  printer:`<svg ${common}><rect x="14" y="22" width="36" height="24" rx="3" fill="none" stroke="#ffffff" stroke-width="3"/><path d="M20 22v-8h24v8M22 38h20M26 44h12" fill="none" stroke="#d0d8e0" stroke-width="2.5" stroke-linecap="round"/><circle cx="44" cy="30" r="2.5" fill="#ffffff"/></svg>`,
  explore_speed:`<svg ${common}><circle cx="32" cy="32" r="22" fill="none" stroke="${stroke}" stroke-width="3"/><path d="M32 18v16l10 6" fill="none" stroke="${gold}" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  base_damage:`<svg ${common}><path d="M38 8l10 10-22 30-12 4 4-12z" fill="none" stroke="${red}" stroke-width="3" stroke-linejoin="round"/><path d="M14 50l8-8" stroke="${mute}" stroke-width="3" stroke-linecap="round"/></svg>`,
  base_defense:`<svg ${common}><path d="M32 8l20 8v14c0 14-8 22-20 26C20 52 12 44 12 30V16z" fill="none" stroke="${blue}" stroke-width="3"/><path d="M24 32l6 6 12-14" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/></svg>`,
  loot_boost:`<svg ${common}><rect x="14" y="22" width="36" height="28" rx="4" fill="none" stroke="${gold}" stroke-width="3"/><path d="M14 30h36M26 22v-4h12v4" fill="none" stroke="${mute}" stroke-width="3"/></svg>`,
  findings:`<svg ${common}><circle cx="28" cy="28" r="14" fill="none" stroke="${stroke}" stroke-width="3"/><path d="M38 38l12 12" stroke="${gold}" stroke-width="4" stroke-linecap="round"/><circle cx="28" cy="28" r="4" fill="${stroke}"/></svg>`,
  extract_skill:`<svg ${common}><path d="M20 12h8l4 12 8-8 6 6-12 10 4 18h-8l-2-12-10 6z" fill="none" stroke="${stroke}" stroke-width="2.8" stroke-linejoin="round"/></svg>`,
  iron_lungs:`<svg ${common}><path d="M18 28c0-8 6-14 14-14s14 6 14 14c0 12-8 20-14 28-6-8-14-16-14-28z" fill="none" stroke="${red}" stroke-width="3"/><path d="M26 30h12M28 36h8" stroke="${mute}" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  combat_endurance:`<svg ${common}><path d="M20 40c4-16 8-24 12-28 4 4 8 12 12 28" fill="none" stroke="${gold}" stroke-width="3" stroke-linecap="round"/><path d="M16 40h32" stroke="${mute}" stroke-width="3" stroke-linecap="round"/></svg>`,
  anomaly_affinity:`<svg ${common}><circle cx="32" cy="32" r="10" fill="none" stroke="${purple}" stroke-width="3"/><path d="M32 8v10M32 46v10M8 32h10M46 32h10M14 14l8 8M42 42l8 8M50 14l-8 8M22 42l-8 8" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  steady_hands:`<svg ${common}><circle cx="32" cy="32" r="20" fill="none" stroke="${mute}" stroke-width="2"/><circle cx="32" cy="32" r="12" fill="none" stroke="${stroke}" stroke-width="2"/><circle cx="32" cy="32" r="3" fill="${gold}"/><path d="M32 8v6M32 50v6M8 32h6M50 32h6" stroke="${gold}" stroke-width="2.5"/></svg>`,
  pack_mule:`<svg ${common}><path d="M16 28h32l4 24H12z" fill="none" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/><path d="M24 28v-6c0-4 4-8 8-8s8 4 8 8v6" fill="none" stroke="${mute}" stroke-width="3"/></svg>`,
  scout:`<svg ${common}><path d="M8 40c8-16 16-24 24-24s16 8 24 24" fill="none" stroke="${stroke}" stroke-width="3"/><circle cx="32" cy="28" r="6" fill="none" stroke="${gold}" stroke-width="2.5"/><path d="M12 48h40" stroke="${mute}" stroke-width="3" stroke-linecap="round"/></svg>`,
  survivor:`<svg ${common}><path d="M32 52s-18-10-18-24c0-8 6-12 12-12 4 0 6 2 6 2s2-2 6-2c6 0 12 4 12 12 0 14-18 24-18 24z" fill="none" stroke="${red}" stroke-width="3"/></svg>`,
  craft_speed:`<svg ${common}><path d="M12 40l12-20h16l12 20z" fill="none" stroke="${gold}" stroke-width="3"/><path d="M32 20v28M24 36h16" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  smelt_master:`<svg ${common}><rect x="18" y="28" width="28" height="22" rx="2" fill="none" stroke="${mute}" stroke-width="3"/><path d="M24 28v-8h16v8M28 40h8" stroke="${gold}" stroke-width="3" stroke-linecap="round"/></svg>`,
  // city / casino
  casino:`<svg ${common}><rect x="12" y="16" width="40" height="32" rx="4" fill="none" stroke="${gold}" stroke-width="3"/><circle cx="24" cy="32" r="5" fill="${stroke}"/><circle cx="40" cy="32" r="5" fill="${red}"/><path d="M20 48h24" stroke="${mute}" stroke-width="3"/></svg>`,
  lock:`<svg ${common}><rect x="18" y="28" width="28" height="22" rx="3" fill="none" stroke="${mute}" stroke-width="3"/><path d="M24 28v-6c0-5 3-10 8-10s8 5 8 10v6" fill="none" stroke="${stroke}" stroke-width="3"/><circle cx="32" cy="40" r="3" fill="${gold}"/></svg>`,
  chip:`<svg ${common}><circle cx="32" cy="32" r="22" fill="none" stroke="${gold}" stroke-width="3"/><circle cx="32" cy="32" r="14" fill="none" stroke="${stroke}" stroke-width="2"/><path d="M32 12v6M32 46v6M12 32h6M46 32h6" stroke="${gold}" stroke-width="3"/></svg>`,
  coin:`<svg ${common}><circle cx="32" cy="32" r="20" fill="none" stroke="${gold}" stroke-width="3"/><path d="M32 18v28M24 24h12c4 0 6 2 6 5s-2 5-6 5H24" fill="none" stroke="${gold}" stroke-width="3"/></svg>`,
  gem:`<svg ${common}><path d="M32 8l16 16-16 32L16 24z" fill="none" stroke="${blue}" stroke-width="3" stroke-linejoin="round"/><path d="M16 24h32" stroke="${stroke}" stroke-width="2"/></svg>`,
  crown:`<svg ${common}><path d="M10 44h44L48 22l-10 8-6-14-6 14-10-8z" fill="none" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/><path d="M14 44h36" stroke="${mute}" stroke-width="3"/></svg>`,
  seven:`<svg ${common}><path d="M18 16h28l-16 36" fill="none" stroke="${red}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  star:`<svg ${common}><path d="M32 8l5 16h17l-14 10 5 17-13-9-13 9 5-17-14-10h17z" fill="none" stroke="${gold}" stroke-width="2.8" stroke-linejoin="round"/></svg>`,
  jackpot:`<svg ${common}><circle cx="32" cy="32" r="20" fill="none" stroke="${gold}" stroke-width="3"/><path d="M32 14v36M14 32h36M20 20l24 24M44 20L20 44" stroke="${stroke}" stroke-width="2.5"/></svg>`,
  fail:`<svg ${common}><path d="M18 18l28 28M46 18L18 46" stroke="${red}" stroke-width="5" stroke-linecap="round"/></svg>`,
  question:`<svg ${common}><circle cx="32" cy="32" r="22" fill="none" stroke="${mute}" stroke-width="3"/><path d="M24 24c0-6 4-10 8-10s8 4 8 10c0 4-3 6-6 8-2 1-2 2-2 4" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="46" r="2.5" fill="${stroke}"/></svg>`
 };
 return icons[kind]||icons.question;
}

function creditsIconMarkup(size=18){
 return `<svg class="credits-icon" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="28" fill="#f5c542" stroke="#c49212" stroke-width="3"/><circle cx="32" cy="32" r="20" fill="none" stroke="#ffe08a" stroke-width="2"/><path d="M32 16v32M24 24h12c4 0 7 2.5 7 6s-3 6-7 6H24" fill="none" stroke="#8a6410" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function marketItemStats(data){
 if(!data)return "";
 const bits=[];
 if(data.cat==="Arma"||data.damage)bits.push(`Daño ${data.damage??"—"}`);
 if(data.cat==="Equipo"||data.defense)bits.push(`Defensa ${data.defense??"—"}`);
 if(data.cat==="Herramienta"||data.gather)bits.push(`Recolección ${data.gather??"—"}`);
 if(data.extractBonus)bits.push(`Extracción +${data.extractBonus}%`);
 if(data.cat==="Consumible"){
  const eff=data.effect;
  // Nunca meter la descripción completa en el chip (evita texto duplicado)
  if(eff && typeof eff==="string" && eff.length<40 && eff!==data.desc)bits.push(eff);
  else bits.push("Uso único");
 }
 if(data.illegal||data.trait==="Ilegal")bits.push("Ilegal");
 return bits.filter(Boolean).slice(0,4).map(b=>`<span class="chip">${escapeHtml(String(b))}</span>`).join("");
}
function marketBuyPrice(item,daily){
 const base=Math.max(1,Number(item.val)||Number(info(item.name||item).val)||10);
 // Compra siempre al 400% del valor base (evita bucles de dinero)
 const price=Math.max(1,Math.ceil(base*4));
 return daily?Math.max(price,Math.ceil((Number(item.price)||base)*4)):price;
}
function renderMarketBuy(isBlack){
 ensureMarketDay();
 const box=$(isBlack?"marketBlackBuyList":"marketBuyList");
 if(!box)return;
 const search=((isBlack?$("marketBlackBuySearch"):$("marketBuySearch"))?.value||"").trim().toLowerCase();
 const mode=isBlack?marketBlackBuyMode:marketBuyMode;
 const daily=mode==="daily";
 const catFilter=isBlack?marketBlackBuyFilter:marketBuyFilter;
 let rows=[];
 if(daily){
  const list=isBlack?state.market.dailyBlack:state.market.dailyLegal;
  rows=list.filter(x=>{
   if(x.stock<=0||!x.name.toLowerCase().includes(search))return false;
   const data={...info(x.name),...x};
   if(catFilter==="Todos")return true;
   if(isBlack){
    if(catFilter==="Órgano")return data.cat==="Órgano";
    if(catFilter==="Arma")return isBallisticWeapon(x.name,data)||data.ballistic;
    if(catFilter==="Contrabando"||catFilter==="Otro")return !!(data.contraband||data.cat==="Contrabando"||(data.illegal&&(data.cat==="Otro"||data.cat==="Contrabando")));
    return data.cat!=="Criatura";
   }else{
    return data.cat===catFilter;
   }
   return true;
  }).map(x=>{
   const data={...info(x.name),...x};
   return {name:x.name,data,stock:x.stock,daily:true,price:marketBuyPrice(x,true),needLevel:1,unlocked:true};
  });
 }else{
  const pool=Object.keys(itemDB).filter(n=>{
   const d=itemDB[n];
   if(!d||!d.val)return false;
   if(isBlack){
    if(!isBlackMarketItem(n,d))return false;
    if(catFilter==="Órgano")return d.cat==="Órgano"&&(d.marketOrgan||!d.organRoot);
    if(catFilter==="Arma")return isBallisticWeapon(n,d)||d.ballistic;
    if(catFilter==="Contrabando"||catFilter==="Otro")return !!(d.contraband||d.cat==="Contrabando"||(d.illegal&&(d.cat==="Otro"||d.cat==="Contrabando")));
    // Todos: sin criaturas
    return d.cat!=="Criatura";
   }
   if(!isLegalMarketItem(n,d))return false;
   if(catFilter!=="Todos"&&d.cat!==catFilter)return false;
   return true;
  }).filter(n=>n.toLowerCase().includes(search));
  rows=pool.map(n=>{
   const data=itemDB[n];
   const need=marketRequiredLevel(data);
   return {name:n,data,stock:null,daily:false,price:marketBuyPrice(data,false),needLevel:need,unlocked:state.level>=need};
  }).sort((a,b)=>(Number(a.data.r)||1)-(Number(b.data.r)||1)||a.name.localeCompare(b.name,"es"));
 }
 // Diario también ordenado por nivel
 if(daily)rows.sort((a,b)=>(Number(a.data.r)||1)-(Number(b.data.r)||1)||a.name.localeCompare(b.name,"es"));
 
 const pageSize=marketBuyPageSize();
 const page=isBlack?marketBlackBuyPage:marketBuyPage;
 const pages=Math.max(1,Math.ceil(rows.length/pageSize));
 const cur=Math.min(Math.max(1,page),pages);
 if(isBlack)marketBlackBuyPage=cur;else marketBuyPage=cur;
 const shown=rows.slice((cur-1)*pageSize,cur*pageSize);
 const pager=$(isBlack?"marketBlackBuyPager":"marketBuyPager");
 if(pager){pager.classList.toggle("is-single",rows.length<=pageSize);pager.classList.remove("hidden");}
 const infoEl=$(isBlack?"marketBlackBuyPageInfo":"marketBuyPageInfo");
 const prev=$(isBlack?"marketBlackBuyPrev":"marketBuyPrev");
 const next=$(isBlack?"marketBlackBuyNext":"marketBuyNext");
 if(infoEl)infoEl.textContent=`Página ${cur} / ${pages}`;
 if(prev)prev.disabled=cur<=1;
 if(next)next.disabled=cur>=pages;
 // daily labels
 const dailyBtn=document.querySelector(isBlack?'[data-market-bbuy-mode="daily"]':'[data-market-buy-mode="daily"]');
 if(dailyBtn)dailyBtn.textContent=isBlack?"Diario negro (12)":"Diario (12)";
 const cardHtml=row=>{
  const locked=!row.unlocked;
  const noStock=row.daily&&row.stock<=0;
  const can=!locked&&!noStock&&state.credits>=row.price&&!activeTask;
  const rawDesc=String(row.data.desc||info(row.name).desc||"").replace(/\s+/g," ").trim();
  const desc=escapeHtml(rawDesc);
  const stats=marketItemStats(row.data);
  return `<div class="market-card"><div class="market-card-top"><span class="item-icon">${itemIconMarkup(row.name,row.data.icon)}</span><div style="min-width:0"><b title="${escapeHtml(row.name)}">${escapeHtml(inventoryDisplayName({name:row.name}))}</b><small>N${row.data.r||1} · ${escapeHtml(row.data.cat||"?")}</small></div></div><p class="market-card-desc">${desc||"Sin descripción."}</p>${stats?`<div class="loot-chips market-card-stats">${stats}</div>`:`<div class="market-card-stats" aria-hidden="true"></div>`}<div class="market-card-price">${creditsIconMarkup(16)}<b>${row.price.toLocaleString("es-ES")}</b>${row.daily?`<span class="muted"> · Stock ${row.stock}</span>`:""}${locked?`<span class="muted"> · 🔒 Nv ${row.needLevel}</span>`:""}</div><button class="tiny ${isBlack?"danger":""}" data-market-buy="${escapeHtml(row.name)}" data-black="${isBlack?"1":"0"}" data-daily="${row.daily?"1":"0"}" ${can?"":"disabled"}>Comprar</button></div>`;
 };
 const cards=shown.map(cardHtml);
 // Siempre rellenar la página completa: misma altura en todas las páginas
 while(cards.length<pageSize)cards.push(`<div class="market-card is-placeholder" aria-hidden="true"></div>`);
 box.innerHTML=shown.length?cards.join(""):'<div class="empty" style="grid-column:1/-1">No hay productos en este listado.</div>';
 box.querySelectorAll("[data-market-buy]").forEach(b=>b.onclick=()=>buyMarketItem(b.dataset.marketBuy,b.dataset.black==="1",b.dataset.daily==="1"));
 if($("marketDayTag"))$("marketDayTag").textContent="DÍA · "+(state.market.day||"—");
 if($("marketSellRateLabel"))$("marketSellRateLabel").textContent=(state.market.sellRate||"—")+"%";
 if($("marketBlackSellRateLabel"))$("marketBlackSellRateLabel").textContent=(state.market.blackSellRate||"—")+"%";
}

function buyMarketItem(name,isBlack,daily){
 ensureMarketDay();
 const data=info(name);
 if(!data)return toast("Producto no disponible.",true);
 if(!daily){
  const need=marketRequiredLevel(data);
  if(state.level<need)return toast(`Requiere Operador nivel ${need}.`,true);
 }
 let price=marketBuyPrice(data,false);
 if(daily){
  const list=isBlack?state.market.dailyBlack:state.market.dailyLegal;
  const entry=list.find(x=>x.name===name);
  if(!entry||entry.stock<=0)return toast("Sin stock en el diario.",true);
  price=marketBuyPrice(entry,true);
  if(state.credits<price)return toast("Créditos insuficientes.",true);
  entry.stock--;
 }else{
  if(state.credits<price)return toast("Créditos insuficientes.",true);
 }
 state.credits-=price;
 const extras={origin:isBlack?"mercado negro":"mercado"};
 // El mercado negro ya no marca ilegal todo: solo órganos, balísticas, engendros e híbridos anómalos
 const draft=applyIllegalPolicy({...info(name),...extras,name});
 if(isIllegalItem(draft)){extras.illegal=true;if(draft.cat==="Órgano"){extras.trait="Ilegal";extras.affix="Ilegal";}}
 else{extras.illegal=false;}
 addItem(name,1,{...data,...extras,name});
 log(`Compra ${isBlack?"negra":"legal"}: <b>${escapeHtml(name)}</b> por ${price} cr.`);
 toast(`Comprado: ${name} (−${price} cr.)`);
 if(typeof soundSale==="function")soundSale();
 renderMarketBuy(isBlack);renderStats();save();
}
function marketSellUnitPrice(x,isBlack){
 ensureMarketDay();
 const base=Math.max(1,Number(x.val)||Number(info(x.name).val)||1);
 const rate=(isBlack?state.market.blackSellRate:state.market.sellRate)||100;
 return Math.max(1,Math.ceil(base*(rate/100)*(1+(stat("credits")+skillBonus("credits"))/100)));
}
function renderMarketSell(isBlack){
 ensureMarketDay();
 const box=$(isBlack?"marketBlackSellList":"marketSellList");
 if(!box)return;
 const search=((isBlack?$("marketBlackSellSearch"):$("marketSellSearch"))?.value||"").trim().toLowerCase();
 const equipped=new Set(Object.values(state.equipped||{}).filter(Boolean));
 const sel=isBlack?marketBlackSellSelection:marketSellSelection;
 let sellable=state.inventory.filter(x=>x.qty>0&&!equipped.has(x.id)&&(isBlack?isIllegalItem(x):!isIllegalItem(x)));
 if(search)sellable=sellable.filter(x=>x.name.toLowerCase().includes(search));
 Object.keys(sel).forEach(id=>{const item=sellable.find(x=>x.id===id);if(!item)delete sel[id];else sel[id]=Math.min(item.qty,Math.max(0,Number(sel[id])||0));if(!sel[id])delete sel[id];});
 const pageSize=5;
 let page=isBlack?marketBlackSellPage:marketSellPage;
 const pages=Math.max(1,Math.ceil(sellable.length/pageSize));
 page=Math.min(Math.max(1,page),pages);
 if(isBlack)marketBlackSellPage=page;else marketSellPage=page;
 const shown=sellable.slice((page-1)*pageSize,page*pageSize);
 const msRows=shown.map(x=>{
  const qty=Number(sel[x.id]||0),checked=qty>0;
  const base=Math.max(1,Number(x.val)||Number(info(x.name).val)||1);
  const unit=marketSellUnitPrice(x,isBlack);
  const rate=isBlack?state.market.blackSellRate:state.market.sellRate;
  return `<div class="central-sale-row ${checked?"selected":""}" data-ms-row="${x.id}" data-black="${isBlack?"1":"0"}" role="button" tabindex="0" aria-pressed="${checked?"true":"false"}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><div><div class="sale-name">${escapeHtml(inventoryDisplayName(x))}</div><small>N${x.r||1} · ${escapeHtml(x.cat)} · Base: ${formatCredits(base,12)} · Hoy ${rate}%: ${formatCredits(unit,12)}/u</small></div><div class="qty-stepper ${checked?"":"is-disabled"}" data-ms-step="${x.id}" data-black="${isBlack?"1":"0"}"><button type="button" class="qty-btn" data-ms-minus="${x.id}" data-black="${isBlack?"1":"0"}" aria-label="Menos">‹</button><span class="qty-val">×${checked?qty:1}</span><button type="button" class="qty-btn" data-ms-plus="${x.id}" data-black="${isBlack?"1":"0"}" aria-label="Más">›</button></div></div>`;
 });
 while(msRows.length<pageSize)msRows.push(`<div class="central-sale-row is-placeholder" aria-hidden="true"></div>`);
 box.innerHTML=shown.length?msRows.join(""):`<div class="empty">${isBlack?"No hay mercancía ilegal.":"No hay objetos legales para vender."}</div>`;
 // pager
 let pager=$(isBlack?"marketBlackSellPager":"marketSellPager");
 if(!pager){
  pager=document.createElement("div");
  pager.id=isBlack?"marketBlackSellPager":"marketSellPager";
  pager.className="pagination sale-pager";
  pager.innerHTML=`<button type="button" class="tiny" data-sale-prev="${isBlack?"1":"0"}">← Anterior</button><span class="muted" data-sale-info="${isBlack?"1":"0"}">Página 1</span><button type="button" class="tiny" data-sale-next="${isBlack?"1":"0"}">Siguiente →</button>`;
  box.after(pager);
 }
 pager.classList.toggle("hidden",sellable.length<=pageSize);
 const infoEl=pager.querySelector("[data-sale-info]");
 const prev=pager.querySelector("[data-sale-prev]");
 const next=pager.querySelector("[data-sale-next]");
 if(infoEl)infoEl.textContent=`Página ${page} / ${pages}`;
 if(prev){prev.disabled=page<=1;prev.onclick=()=>{if(isBlack)marketBlackSellPage=Math.max(1,marketBlackSellPage-1);else marketSellPage=Math.max(1,marketSellPage-1);renderMarketSell(isBlack);};}
 if(next){next.disabled=page>=pages;next.onclick=()=>{if(isBlack)marketBlackSellPage++;else marketSellPage++;renderMarketSell(isBlack);};}
 const units=Object.values(sel).reduce((a,b)=>a+b,0);
 const total=sellable.reduce((sum,x)=>sum+(Number(sel[x.id]||0)*marketSellUnitPrice(x,isBlack)),0);
 const uEl=$(isBlack?"marketBlackSellUnits":"marketSellUnits");
 const tEl=$(isBlack?"marketBlackSellTotal":"marketSellTotal");
 const sEl=$(isBlack?"marketBlackSellSubmit":"marketSellSubmit");
 if(uEl)uEl.textContent=units;
 if(tEl)tEl.innerHTML=formatCredits(total,15);
 if(sEl)sEl.disabled=units===0||!!activeTask;
 box.querySelectorAll("[data-ms-row]").forEach(row=>{
  row.onclick=e=>{if(e.target.closest(".qty-stepper"))return;const black=row.dataset.black==="1";const S=black?marketBlackSellSelection:marketSellSelection;const id=row.dataset.msRow;if(S[id])delete S[id];else S[id]=1;renderMarketSell(black);};
 });
 const bumpMs=(id,black,delta)=>{
  const S=black?marketBlackSellSelection:marketSellSelection;
  const item=state.inventory.find(x=>x.id===id);
  const max=item?item.qty:1;
  let q=Number(S[id]||0);
  if(!q&&delta>0)q=1; else q=Math.max(0,Math.min(max,q+delta));
  if(q<=0)delete S[id]; else S[id]=q;
  renderMarketSell(black);
 };
 box.querySelectorAll("[data-ms-minus]").forEach(btn=>btn.onclick=e=>{e.stopPropagation();bumpMs(btn.dataset.msMinus,btn.dataset.black==="1",-1);});
 box.querySelectorAll("[data-ms-plus]").forEach(btn=>btn.onclick=e=>{e.stopPropagation();bumpMs(btn.dataset.msPlus,btn.dataset.black==="1",1);});
}

function submitMarketSell(isBlack){
 if(activeTask)return;
 const S=isBlack?marketBlackSellSelection:marketSellSelection;
 const selected=Object.entries(S).map(([id,qty])=>({x:state.inventory.find(i=>i.id===id),qty:Number(qty)})).filter(o=>o.x&&o.qty>0&&(isBlack?isIllegalItem(o.x):!isIllegalItem(o.x)));
 if(!selected.length)return toast("Selecciona objetos.",true);
 const total=selected.reduce((sum,{x,qty})=>sum+marketSellUnitPrice(x,isBlack)*qty,0);
 const units=selected.reduce((s,o)=>s+o.qty,0);
 selected.forEach(({x,qty})=>takeById(x.id,qty));
 state.credits+=total;
 if(isBlack)marketBlackSellSelection={};else marketSellSelection={};
 log(`${isBlack?"Mercado Negro":"Mercado"}: vendidas ${units} u. por <b>${total.toLocaleString("es-ES")} cr.</b>.`);
 toast(`Venta: +${total.toLocaleString("es-ES")} cr.`);
 if(typeof soundSale==="function")soundSale();
 renderMarketSell(isBlack);renderStats();save();
}
function renderSpawnTable(){
 if(typeof spawnSelected!=="object"||Array.isArray(spawnSelected))spawnSelected={};
 for(let i=0;i<5;i++){
  const id=spawnSelected[i];
  const x=id?state.inventory.find(it=>it.id===id):null;
  const slot=$("spawnSlot"+i);
  if(slot)slot.classList.toggle("filled",!!x);
  const icon=slot&&slot.querySelector(".slot-icon");
  if(icon)icon.innerHTML=x?itemIconMarkup(x.name,x.icon||info(x.name).icon):"＋";
  if($("spawnLabel"+i))$("spawnLabel"+i).textContent=x?inventoryDisplayName(x):("Órgano "+(i+1));
  const choose=$("chooseSpawn"+i),clear=$("clearSpawn"+i);
  if(choose){choose.textContent=x?"Cambiar":"Elegir";choose.disabled=!!activeTask}
  if(clear){clear.classList.toggle("hidden",!x);clear.disabled=!!activeTask}
 }
 // anomaly optional
 const ax=spawnAnomalyId?state.inventory.find(it=>it.id===spawnAnomalyId):null;
 if(!ax)spawnAnomalyId=null;
 const aSlot=$("spawnSlotAnomaly");
 if(aSlot)aSlot.classList.toggle("filled",!!ax);
 const aIcon=aSlot&&aSlot.querySelector(".slot-icon");
 if(aIcon)aIcon.innerHTML=ax?itemIconMarkup(ax.name,ax.icon||info(ax.name).icon):"＋";
 if($("spawnLabelAnomaly"))$("spawnLabelAnomaly").textContent=ax?inventoryDisplayName(ax):"Anomalía opcional";
 if($("chooseSpawnAnomaly")){$("chooseSpawnAnomaly").textContent=ax?"Cambiar anomalía":"Añadir anomalía";$("chooseSpawnAnomaly").disabled=!!activeTask}
 if($("clearSpawnAnomaly")){$("clearSpawnAnomaly").classList.toggle("hidden",!ax);$("clearSpawnAnomaly").disabled=!!activeTask}
 if($("spawnAnomalyNote"))$("spawnAnomalyNote").innerHTML=ax?`Anomalía lista: se consumirá y el resultado tendrá rasgo <b>Hibridación anómala</b>.`:`Una anomalía es opcional: consume la anomalía y otorga el rasgo <b>Hibridación anómala</b> en lugar de solo Engendro.`;
 const filled=[0,1,2,3,4].filter(i=>spawnSelected[i]).length;
 if($("spawnStartBtn"))$("spawnStartBtn").disabled=filled!==5||!!activeTask;
}

function startCreatureSpawn(){
 if(activeTask)return;
 const ids=[0,1,2,3,4].map(i=>spawnSelected[i]).filter(Boolean);
 if(ids.length!==5)return toast("Coloca exactamente 5 órganos.",true);
 if(new Set(ids).size!==5)return toast("Cada ranura debe usar un órgano distinto del inventario.",true);
 const organs=ids.map(id=>state.inventory.find(x=>x.id===id)).filter(Boolean);
 if(organs.length!==5||organs.some(o=>o.cat!=="Órgano"))return toast("Selección inválida.",true);
 const anomaly=spawnAnomalyId?state.inventory.find(x=>x.id===spawnAnomalyId):null;
 if(spawnAnomalyId&&(!anomaly||anomaly.cat!=="Anomalía"))return toast("La anomalía seleccionada ya no es válida.",true);
 const anomalyId=anomaly?anomaly.id:null;
 const anomalyName=anomaly?anomaly.name:null;
 beginTask("spawn",10000,()=>{
  for(const o of organs){if(!takeById(o.id,1)){toast("Faltan órganos.",true);return;}}
  if(anomalyId&&!takeById(anomalyId,1)){toast("La anomalía ya no está disponible.",true);return;}
  const avgR=Math.max(1,Math.min(5,Math.round(organs.reduce((s,o)=>s+(Number(o.r)||1),0)/5)+(anomaly?1:0)));
  const rFinal=Math.min(5,avgR);
  const useAnomaly=!!anomalyName;
  const trait=useAnomaly?"Hibridación anómala":"Engendro";
  const roots=useAnomaly?["Híbrido anómalo","Quimera de fase","Vástago resonante","Simbionte prismático","Coloso de umbral","Engendro híbrido"]:["Engendro","Quimera","Vástago sintético","Simbionte ilegal","Coloso menor","Híbrido de clínica"];
  const adjs=useAnomaly?["Anómalo","de FASE","Prismático","Resonante","del Umbral","Espectral"]:["Umbrío","Carmesí","Anómalo","de FASE","del Umbral","Clandestino","Resonante"];
  const name=roots[Math.floor(Math.random()*roots.length)]+" "+adjs[Math.floor(Math.random()*adjs.length)];
  const abilities=useAnomaly?[
   {name:"Hibridación anómala",effect:"+"+(12+rFinal*3)+"% hallazgos anómalos"},
   {name:"Inestabilidad controlada",effect:"+"+(6+rFinal)+" defensa residual"}
  ]:[
   {name:"Instinto de engendro",effect:"+"+(8+rFinal*2)+"% de botín en exploración"},
   {name:"Tejido inestable",effect:"+"+(5+rFinal)+" defensa residual"}
  ];
  const out={name,icon:useAnomaly?"🧬":"🧟",cat:"Criatura",r:rFinal,val:30+rFinal*25+(useAnomaly?40:0),desc:useAnomaly?`Criatura sintetizada con órganos y la anomalía ${anomalyName}. Rasgo Hibridación anómala e Ilegal.`:`Criatura sintetizada en clínica a partir de cinco órganos. Rasgo Engendro e Ilegal.`,trait,affix:trait,illegal:true,secondaryTrait:"Ilegal",abilities,companion:true,origin:"síntesis de criatura"};
  itemDB[name]=out;
  addItem(name,1,out);
  state.discovered=state.discovered||{};state.discovered[name]={...out};
  if(!state.seen.includes(name))state.seen.push(name);
  spawnSelected={};spawnAnomalyId=null;
  xp(15+rFinal*3+(useAnomaly?8:0));
  log(`Síntesis de criatura: <b>${escapeHtml(name)}</b> (N${rFinal}) · ${trait} / Ilegal${useAnomaly?" · anomalía consumida":""}.`);
  if($("spawnMessage"))$("spawnMessage").innerHTML=`Creado: <b>${escapeHtml(name)}</b> · N${rFinal} · ${escapeHtml(trait)} · Ilegal.`;
  toast(`Criatura creada: ${name}`);
  renderSpawnTable();render();save();
 },{panel:$("spawnProgress"),bar:$("spawnBar"),percent:$("spawnPercent"),status:null,button:$("spawnStartBtn")});
}


const stateDefault=()=>({
 credits:0,level:1,xp:0,expeditions:0,fusions:0,
 inventory:[],
 equipped:{pick:null,axe:null,tongs:null,driver:null,weapon:null,armor:null,anomaly:null,companion:null},
 history:[],pendingFusion:null,pendingSupply:null,activity:[],seen:[],discovered:{},synthesisVariants:{},valueRanges:{},organVariants:{},
 settings:{sound:true,soundVolume:75,soundMuted:false,musicVolume:40,musicMuted:false,scale:"1",motion:false,layoutMode:"auto"},
 market:null,
 skills:{},
 skillPoints:0,
 creditsEarned:0,
 stats:{crafted:0,smelted:0,anomalies:0},
 missionHistory:[],
 version:11
});
function loadState(){try{const s=JSON.parse(localStorage.getItem("anomalyFusionSave")||localStorage.getItem("joyaCeroSave"));if(s&&s.inventory&&s.equipped&&Number(s.version)>=2&&Number(s.version)<=30)return Object.assign(stateDefault(),s,{version:Math.max(11,Number(s.version)||11),equipped:{...stateDefault().equipped,...s.equipped},history:(s.history||[]).slice(0,3),pendingFusion:s.pendingFusion||null,pendingSupply:s.pendingSupply||null,seen:[...new Set([...(s.seen||[]),...(s.inventory||[]).map(x=>x.name)])],discovered:{...(s.discovered||{}),...Object.fromEntries((s.inventory||[]).map(x=>[x.name,x]))},synthesisVariants:{...(s.synthesisVariants||{})},valueRanges:{...(s.valueRanges||{})},organVariants:{...(s.organVariants||{})}})}catch(e){}return stateDefault()}
function save(){try{localStorage.setItem("anomalyFusionSave",JSON.stringify(state))}catch(e){toast("No se pudo guardar la partida. Comprueba el espacio disponible del navegador.",true)}}
let state=loadState();
// Migra al registro los niveles de síntesis ya existentes en partidas anteriores.
Object.entries(state.discovered||{}).forEach(([name,item])=>{if(isSynthesisItem(item)&&!state.synthesisVariants?.[name]?.length)saveSynthesisVariant({...item,name});});
// Conserva los valores ya conocidos en partidas anteriores como primer rango observado.
state.valueRanges=state.valueRanges||{};state.inventory.forEach(recordObservedValue);Object.entries(state.discovered||{}).forEach(([name,item])=>{if(item&&item.name)recordObservedValue({...item,name})});Object.entries(state.synthesisVariants||{}).forEach(([name,variants])=>(Array.isArray(variants)?variants:[]).forEach(v=>recordObservedValue({...v,name,trait:v.trait||"Síntesis de convergencia"})));

function normalizeImportedState(raw){
 if(!raw||typeof raw!=="object")throw new Error("El archivo no contiene una partida válida.");
 if(raw.save&&typeof raw.save==="object")raw=raw.save;
 const base=stateDefault();
 const inventory=Array.isArray(raw.inventory)?raw.inventory:Array.isArray(raw.items)?raw.items:[];
 const equipped=raw.equipped&&typeof raw.equipped==="object"?raw.equipped:{};
 const next={...base,...raw,version:10};
 next.credits=Math.max(0,Number(next.credits)||0);
 next.level=Math.max(1,Number(next.level)||1);
 next.xp=Math.max(0,Number(next.xp)||0);
 next.expeditions=Math.max(0,Number(next.expeditions)||0);
 next.fusions=Math.max(0,Number(next.fusions)||0);
 next.inventory=inventory.filter(x=>x&&typeof x==="object"&&typeof x.name==="string").map(x=>({...x,id:x.id||uid(),qty:Math.max(1,Math.floor(Number(x.qty)||1)),r:Math.max(1,Math.min(5,Number(x.r)||1))}));
 next.equipped={...base.equipped};
 Object.keys(base.equipped).forEach(slot=>{
  const id=equipped[slot];
  next.equipped[slot]=id&&next.inventory.some(i=>i.id===id)?id:null;
 });
 next.history=Array.isArray(raw.history)?raw.history.slice(0,3):[];
 next.pendingFusion=raw.pendingFusion&&typeof raw.pendingFusion==="object"?raw.pendingFusion:null;
 next.pendingSupply=raw.pendingSupply&&typeof raw.pendingSupply==="object"?raw.pendingSupply:null;
 next.activity=Array.isArray(raw.activity)?raw.activity.slice(-100):[];
 next.seen=[...new Set([...(Array.isArray(raw.seen)?raw.seen.filter(x=>typeof x==="string"):[]),...next.inventory.map(x=>x.name)])];
 next.discovered={...(raw.discovered&&typeof raw.discovered==="object"?raw.discovered:{}),...Object.fromEntries(next.inventory.map(x=>[x.name,x]))};
 next.synthesisVariants=raw.synthesisVariants&&typeof raw.synthesisVariants==="object"?raw.synthesisVariants:{};
 next.valueRanges=raw.valueRanges&&typeof raw.valueRanges==="object"?raw.valueRanges:{};
 next.market=raw.market&&typeof raw.market==="object"?raw.market:null;
 next.settings={...base.settings,...(raw.settings&&typeof raw.settings==="object"?raw.settings:{})};
 if(!["0.9","1","1.1"].includes(String(next.settings.scale)))next.settings.scale="1";
 next.settings.sound=next.settings.sound!==false;
 next.settings.soundVolume=Math.max(0,Math.min(100,Number(next.settings.soundVolume??75)||0));
 next.settings.soundMuted=!!next.settings.soundMuted||next.settings.sound===false;
 next.settings.musicVolume=Math.max(0,Math.min(100,Number(next.settings.musicVolume??40)||0));
 next.settings.musicMuted=!!next.settings.musicMuted;
 next.settings.motion=!!next.settings.motion;
 if(!["auto","mobile","pc16"].includes(next.settings.layoutMode))next.settings.layoutMode="auto";
 return next;
}
function exportSave(){try{const payload={app:"Anomaly Fusion",format:1,exportedAt:new Date().toISOString(),save:state};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`anomaly-fusion-partida-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Copia de seguridad exportada.")}catch(e){toast("No se pudo exportar la partida.",true)}}
async function clearAppCache(){try{if("caches" in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith("anomaly-fusion-")).map(k=>caches.delete(k)))}}catch(e){}try{if("serviceWorker" in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()))}}catch(e){}}
function uid(){return Math.random().toString(36).slice(2,10)}
function info(name){return itemDB[name]||{icon:"❔",cat:"Otro",r:2,val:12,desc:"Objeto no catalogado. Sus propiedades desafían el registro."}}
function operatorIconMarkup(){
 return `<svg class="item-svg-icon vector-item-icon icon-operator" viewBox="0 0 64 64" role="img" aria-label="Operador" xmlns="http://www.w3.org/2000/svg" focusable="false">
  <circle cx="32" cy="32" r="28" fill="#0d1a22" stroke="#53f2d1" stroke-width="2.5"/>
  <circle cx="32" cy="24" r="10" fill="#1a3a42" stroke="#53f2d1" stroke-width="2"/>
  <path d="M16 52c2-12 10-18 16-18s14 6 16 18" fill="#1a3a42" stroke="#53f2d1" stroke-width="2.2" stroke-linejoin="round"/>
  <circle cx="32" cy="24" r="3.5" fill="#53f2d1"/>
  <path d="M22 24h4M38 24h4" stroke="#53f2d1" stroke-width="2" stroke-linecap="round"/>
 </svg>`;
}
function itemIconMarkup(name,icon){
 // Iconos SVG semánticos: primero categoría del objeto y luego nombre; nunca depende de fuentes emoji.
 const raw=String(name||""),n=raw.toLocaleLowerCase("es");
 let data=(typeof itemDB!=="undefined"&&itemDB[raw])||{};
 if(typeof state!=="undefined"&&state){
  const fromInv=(state.inventory||[]).find(x=>x&&x.name===raw);
  const fromDisc=state.discovered&&state.discovered[raw];
  if(fromInv)data={...data,...fromInv};
  else if(fromDisc)data={...data,...fromDisc};
  if(state.synthesisVariants&&state.synthesisVariants[raw])data={...data,trait:"Síntesis de convergencia",affix:"Síntesis de convergencia",coherent:true};
 }
 const cat=String(data.cat||"").toLocaleLowerCase("es");
 const has=(...words)=>words.some(w=>n.includes(w));
 const isFusedIcon=!!(data.trait==="Síntesis de convergencia"||data.affix==="Síntesis de convergencia"||data.coherent===true||(data.sourceA&&data.sourceB)||(typeof isSynthesisItem==="function"&&isSynthesisItem({name:raw,...data})));
 let kind="artifact",main="#68d8c7",light="#c4fff1",dark="#245b55";
 // Las zonas tienen iconografía propia basada en su identidad, no en la primera palabra coincidente.
 const zoneKinds={"bosque hundido":"zone-forest","mina abandonada":"zone-mine","vertedero orbital":"zone-scrap","pantano tóxico":"zone-swamp","cantera roja":"zone-quarry","búnker sellado":"zone-bunker","glaciar de vidrio":"zone-glacier","caldera de ceniza":"zone-volcano","distrito neón":"zone-neon","arrecife abisal":"zone-reef","mar de chatarra":"zone-dunes","grieta dimensional":"zone-rift","laboratorio sumergido":"zone-lab","jardín de sílice":"zone-silica","estación de eco":"zone-station","cámara criogénica":"zone-cryo","archivo orbital":"zone-vault","raíces de titanio":"zone-root","fundición errante":"zone-foundry","observatorio fractal":"zone-observatory","costa nula":"zone-null"};
 if(zoneKinds[n]){kind=zoneKinds[n];main="#69cfc0";light="#d4fff5";dark="#245c59";}
 else if(cat.includes("arma")||has("fusil","pistola","espada","cuchilla","lanza","rifle","arco de","hoja sísmica","hoja sismica")){kind="weapon";main="#e6a36c";light="#ffe0b8";dark="#75452f";}
 else if(cat.includes("equipo")||has("armadura","coraza","casco","yelmo","greba","guantelete","hombrera","blindaje")){kind="equipment";main="#8eabc5";light="#e0f0ff";dark="#3c526c";}
 else if(cat.includes("anomalía")||cat.includes("anomalia")||has("dimensional","cuántico","cuantico","paradoja","fase","vacío","vacio","espectral","singularidad","umbral","distorsión","distorsion","fractal","órbita","orbita","nulo","eco temporal")){kind="anomaly";main="#ad8cff";light="#f0ddff";dark="#563b91";}
 else if(cat.includes("órgano")||cat.includes("organo")||has("corazón","corazon","hígado","higado","pulmón","pulmon","riñón","rinon","médula","medula","vesícula","vesicula","ganglio")){kind="organ";main="#e07a8a";light="#ffd0d6";dark="#6b2c40";}
 else if(cat.includes("criatura")||has("larva","colmillo","ciervo","mantis","gólem","golem","criatura","medusa","vigía","vigia","custodio","peregrino","ingeniero errante","centinela")){kind="creature";main="#b6a0df";light="#eee0ff";dark="#5b467d";}
 else if(cat.includes("lingote")||/^lingote\s/.test(n)){kind="ingot";main="#b5c3cd";light="#eef6fa";dark="#536573";if(has("cobre")){main="#c98654";light="#f7c29a";dark="#77472d"}else if(has("oro")){main="#d8b64c";light="#ffef9e";dark="#79601b"}else if(has("hierro","acero")){main="#9eabb7";light="#e4edf2";dark="#4b5b68"}}
 else if(cat.includes("herramienta")||has("martillo","pico","llave inglesa","taladro","sierra","pinza","sonda","herramienta")){kind="tool";main="#d3a36d";light="#ffe0b8";dark="#75452f";}
 else if(cat.includes("consumible")||has("botiquín","botiquin","poción","pocion","kit médico","kit medico","ración","racion","inyección","inyeccion")){kind="consumable";main="#7fd4a2";light="#d8ffe5";dark="#2d6a4c";}
 else if(has("madera","tronco","rama","tabla")){kind="wood";main="#b77a42";light="#e8bd82";dark="#704324";}
 else if(has("hongo","seta","hojas","hoja mutada","brote","raíz","raiz","savia","polen","espora","planta","flor","musgo","alga","helecho","resina","tejido vegetal")){kind="plant";main="#79bd72";light="#c8e8a0";dark="#315b3d";}
 else if(has("cristal","cuarzo","gema","geoda","prisma","ópal","opal","perla","lente","sílice","silice","diamante","fragmento de hielo","vidrio","obsidiana")){kind="crystal";main="#62bfe8";light="#c5f4ff";dark="#315e9b";}
 else if(has("moco","gel","líquido","liquido","condensado","veneno","tóxico","toxico","ácido","acido","fluido","sangre","bioluminiscente","simbiótico","simbiotico")){kind="fluid";main="#9bdf79";light="#e1ffb5";dark="#3c6b3b";}
 else if(has("batería","bateria","chip","electrón","electron","circuito","módulo","modulo","memoria","tarjeta","sensor","filtro","emisor","repetidor","motor","máquina","maquina","dispositivo","holográfico","holografico","fibra óptica","fibra optica","núcleo energético","nucleo energetico","cable","bobina")){kind="tech";main="#63cbdc";light="#c8fbff";dark="#275b7b";}
 else if(has("mena","hierro","cobre","oro","plata","titanio","níquel","niquel","cobalto","aluminio","tungsteno","osmio","iridio","ferrita","metal","aleación","aleacion","placa","tornillo","chatarra","válvula","valvula","engranaje","rotor","escoria","ancla")){kind="metal";main="#9daebc";light="#e4edf2";dark="#4b5b68";}
 else if(has("carbón","carbon","piedra","roca","arena","mineral","fragmento","ceniza","polvo")){kind="rock";main="#a6aeb5";light="#e4e8eb";dark="#535e68";}
 let art="";
 if(kind==="wood")art=`<path d="M10 19 43 10 55 17 21 27Z" fill="${light}" stroke="${dark}" stroke-width="2.5"/><path d="M21 27 55 17 55 40 21 50Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M10 19 21 27 21 50 10 42Z" fill="${light}" stroke="${dark}" stroke-width="2.5"/><ellipse cx="10" cy="30.5" rx="5" ry="11.5" fill="${light}" stroke="${dark}" stroke-width="2.5"/><ellipse cx="10" cy="30.5" rx="2.3" ry="6.5" fill="none" stroke="${dark}" stroke-width="1.8"/><path d="M28 29 48 23M28 37 48 31" stroke="${light}" stroke-width="2"/>`;
 else if(kind==="plant")art=`<path d="M32 54V29" stroke="${dark}" stroke-width="4" stroke-linecap="round"/><path d="M31 39C13 40 10 26 12 17 25 17 36 24 31 39Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M33 31C31 15 43 8 54 10 56 23 47 33 33 31Z" fill="${light}" stroke="${dark}" stroke-width="2.5"/><path d="M32 53 22 58M32 53 42 58" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>`;
 else if(kind==="crystal")art=`<path d="M32 5 49 22 43 48 31 59 16 42 13 22Z" fill="${main}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 5 31 59 16 42 24 23Z" fill="${light}"/><path d="M32 5 24 23 49 22M24 23 31 59M24 23 13 22" fill="none" stroke="${dark}" stroke-width="2"/>`;
 else if(kind==="ingot")art=`<path d="M12 22 22 10H46L56 22 49 49 15 49Z" fill="${main}" stroke="${dark}" stroke-width="2.8" stroke-linejoin="round"/><path d="M12 22H56L49 33H18Z" fill="${light}" stroke="${dark}" stroke-width="2"/><path d="M18 38H46" stroke="${dark}" stroke-width="2.5"/>`;
 else if(kind==="weapon"){if(isFusedIcon){main="#53f2d1";light="#c4fff1";dark="#1a5c52";}
art=`<path d="M15 49 43 21 49 15 55 9 55 21 49 27 21 55Z" fill="${main}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/><path d="M11 45 21 55 16 60 6 50Z" fill="${light}" stroke="${dark}" stroke-width="2.5"/><path d="M36 28 43 35" stroke="${light}" stroke-width="3"/>`;}
 else if(kind==="equipment"){if(isFusedIcon){main="#7ee0ff";light="#d9f6ff";dark="#2a5a72";}
art=`<path d="M22 10 32 16 42 10 54 22 47 31 45 53H19L17 31 10 22Z" fill="${main}" stroke="${dark}" stroke-width="2.8" stroke-linejoin="round"/><path d="M22 13 25 27 32 33 39 27 42 13M25 27 19 48M39 27 45 48" fill="none" stroke="${light}" stroke-width="3"/>`;}
 else if(kind==="creature"){if(isFusedIcon){main="#8bffd4";light="#e0fff5";dark="#1f6b5a";}
art=`<path d="M12 20 23 24 32 13 41 24 52 20 49 39 40 49 24 49 15 39Z" fill="${main}" stroke="${dark}" stroke-width="2.8" stroke-linejoin="round"/><path d="M20 21 13 10M44 21 51 10" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="32" r="3.5" fill="${light}"/><circle cx="40" cy="32" r="3.5" fill="${light}"/><path d="M26 41Q32 45 38 41" fill="none" stroke="${dark}" stroke-width="2.5"/>`;}
 else if(kind==="organ"){if(isFusedIcon){main="#ff9aab";light="#ffe0e5";dark="#7a3040";}
art=`<ellipse cx="32" cy="34" rx="18" ry="14" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M20 28Q32 12 44 28" fill="${light}" stroke="${dark}" stroke-width="2"/><path d="M32 20V12" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"/><circle cx="26" cy="34" r="3" fill="${dark}" opacity=".35"/>`;}
 else if(kind==="tool"){if(isFusedIcon){main="#6fe3c5";light="#d4fff2";dark="#1f5e52";}
art=`<path d="M38 9A14 14 0 0 0 23 27L9 41A6 6 0 0 0 18 50L32 36A14 14 0 0 0 50 21L40 29 31 20Z" fill="${main}" stroke="${dark}" stroke-width="2.8" stroke-linejoin="round"/>`;}
 else if(kind==="consumable")art=`<path d="M23 8H41V16L47 22V51Q32 58 17 51V22L23 16Z" fill="${main}" stroke="${dark}" stroke-width="2.8"/><path d="M23 8H41V16H23Z" fill="${light}" stroke="${dark}" stroke-width="2"/><path d="M23 35H41M32 26V44" stroke="${light}" stroke-width="4" stroke-linecap="round"/>`;
 else if(kind==="metal")art=`<path d="M15 9H43L54 20V48L43 56H15L8 48V17Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M16 17H40L47 24V43L40 49H16L15 42V23Z" fill="${light}" stroke="${dark}" stroke-width="2"/><path d="M21 25H39M21 32H43M21 39H35" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"/>`;
 else if(kind==="tech")art=`<rect x="12" y="12" width="40" height="40" rx="5" fill="${dark}" stroke="${main}" stroke-width="3"/><rect x="19" y="19" width="26" height="26" rx="2" fill="${main}"/><path d="M25 32H39M32 25V39" stroke="${light}" stroke-width="3" stroke-linecap="round"/><path d="M21 5V12M32 5V12M43 5V12M21 52V59M32 52V59M43 52V59M5 21H12M5 32H12M5 43H12M52 21H59M52 32H59M52 43H59" stroke="${light}" stroke-width="3" stroke-linecap="round"/>`;
 else if(kind==="fluid")art=`<path d="M32 7C27 18 13 31 15 42A17 17 0 0 0 49 42C51 31 37 18 32 7Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M24 39C24 45 28 48 33 48" fill="none" stroke="${light}" stroke-width="4" stroke-linecap="round"/><circle cx="42" cy="29" r="3" fill="${light}"/>`;
 else if(kind==="anomaly"){if(isFusedIcon){main="#b39cff";light="#f0e9ff";dark="#4a3a8a";}
art=`<path d="M32 5 39 21 57 13 49 30 60 38 43 42 48 59 32 48 17 59 21 42 4 38 16 28 7 13 25 21Z" fill="${main}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="32" cy="32" r="10" fill="${dark}"/><circle cx="32" cy="32" r="4" fill="${light}"/>`;}
 else if(kind.startsWith("zone-")){const paths={"zone-forest":`<path d="M32 5 13 31H23L12 44H27V58H37V44H52L41 31H51Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/>`,"zone-mine":`<path d="M9 50 18 20 31 35 43 12 56 50Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M16 43H48" stroke="${light}" stroke-width="3"/>`,"zone-scrap":`<path d="M10 16H54V48H10Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M18 24 27 34 20 42M43 23 35 32 43 41" fill="none" stroke="${light}" stroke-width="3"/>`,"zone-swamp":`<path d="M32 7C24 21 15 30 16 42A16 16 0 0 0 48 42C49 30 40 21 32 7Z" fill="#8bbd70" stroke="${dark}" stroke-width="2.5"/><circle cx="27" cy="38" r="3" fill="${light}"/><circle cx="39" cy="30" r="2.5" fill="${light}"/>`,"zone-quarry":`<path d="M8 49 19 22 31 35 43 13 56 49Z" fill="#c7775c" stroke="${dark}" stroke-width="2.5"/>`,"zone-bunker":`<path d="M12 54V20L32 8 52 20V54Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><rect x="25" y="30" width="14" height="24" fill="${dark}"/><circle cx="35" cy="42" r="1.5" fill="${light}"/>`,"zone-glacier":`<path d="M32 5 47 24 40 56 25 56 17 26Z" fill="#91dff4" stroke="${dark}" stroke-width="2.5"/><path d="M32 5 32 56M17 26 42 34" stroke="${light}" stroke-width="2.5"/>`,"zone-volcano":`<path d="M7 52 22 20 29 33 36 14 57 52Z" fill="#d06a4d" stroke="${dark}" stroke-width="2.5"/><path d="M27 25 36 14 43 28 36 25Z" fill="#ffd36b"/>`,"zone-neon":`<path d="M9 54V23H20V12H31V33H40V18H53V54Z" fill="${dark}" stroke="${main}" stroke-width="2.5"/><path d="M16 31H23M37 39H45M16 43H23" stroke="${light}" stroke-width="3"/>`,"zone-reef":`<path d="M32 55V25M32 39 17 28M32 34 45 18M32 47 47 39" stroke="${dark}" stroke-width="4" stroke-linecap="round"/><circle cx="17" cy="25" r="7" fill="#e68db6" stroke="${dark}" stroke-width="2"/><circle cx="47" cy="16" r="7" fill="#e68db6" stroke="${dark}" stroke-width="2"/>`,"zone-dunes":`<path d="M5 48Q18 27 32 42T59 37V55H5Z" fill="#d2b36d" stroke="${dark}" stroke-width="2.5"/><path d="M12 27 24 18 31 28 24 37Z" fill="${main}" stroke="${dark}" stroke-width="2"/>`,"zone-rift":`<path d="M33 5 23 24 36 28 22 43 32 59 39 39 29 33 42 19Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/>`,"zone-lab":`<path d="M24 8H40M28 8V28L15 49Q14 55 22 55H42Q50 55 48 49L36 28V8" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M21 44H43" stroke="${light}" stroke-width="4"/>`,"zone-silica":`<path d="M32 5 49 22 43 48 31 59 16 42 13 22Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M32 5 31 59 16 42 24 23Z" fill="${light}"/>`,"zone-station":`<circle cx="32" cy="33" r="7" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M20 21A17 17 0 0 0 20 45M44 21A17 17 0 0 1 44 45M12 13A28 28 0 0 0 12 53M52 13A28 28 0 0 1 52 53" fill="none" stroke="${light}" stroke-width="3"/>`,"zone-cryo":`<path d="M32 5V59M9 18 55 46M9 46 55 18M21 8 32 18 43 8M21 56 32 46 43 56" fill="none" stroke="${light}" stroke-width="4" stroke-linecap="round"/>`,"zone-vault":`<path d="M9 13H55V54H9Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M17 22H47M17 30H47M17 38H38M17 46H43" stroke="${light}" stroke-width="3"/>`,"zone-root":`<path d="M32 7V30M32 23 17 15M32 34 13 45M32 34 49 20M32 30 48 43M32 30V57" stroke="#9a784b" stroke-width="5" stroke-linecap="round"/><path d="M17 15 11 9M49 20 55 12" stroke="${light}" stroke-width="3"/>`,"zone-foundry":`<path d="M10 54V28L23 36V24L36 34V15H53V54Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M38 15V7H47V15" stroke="${light}" stroke-width="3"/>`,"zone-observatory":`<path d="M12 17 49 8 53 20 16 29Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M31 26 24 54M42 24 50 54M18 54H56" stroke="${light}" stroke-width="3"/>`,"zone-null":`<circle cx="32" cy="32" r="23" fill="${dark}" stroke="${main}" stroke-width="2.5"/><circle cx="32" cy="32" r="12" fill="none" stroke="${light}" stroke-width="3"/><path d="M8 52 56 12" stroke="${main}" stroke-width="3"/>`};art=paths[kind]||paths["zone-rift"];}
 else if(kind==="bio")art=`<path d="M32 8 39 18 51 17 47 29 55 39 42 43 37 55 27 48 15 52 16 39 8 31 19 24 20 12Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><circle cx="25" cy="29" r="4" fill="${light}"/><circle cx="40" cy="29" r="4" fill="${light}"/>`;
 else if(kind==="rock")art=`<path d="M8 45 15 20 32 9 49 18 57 42 43 55 18 53Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M15 20 31 32 57 42M31 32 18 53" fill="none" stroke="${light}" stroke-width="2.5"/>`;
 else art=`<path d="M32 6 53 18 53 43 32 57 11 43 11 18Z" fill="${main}" stroke="${dark}" stroke-width="2.5"/><path d="M32 15 44 22 44 39 32 48 20 39 20 22Z" fill="${light}" stroke="${dark}" stroke-width="2"/><path d="M20 22 32 29 44 22M32 29V48" fill="none" stroke="${dark}" stroke-width="2.5"/>`;
 const safe=raw.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
 return `<svg class="item-svg-icon vector-item-icon icon-${kind}" viewBox="0 0 64 64" role="img" aria-label="${safe}" xmlns="http://www.w3.org/2000/svg" focusable="false">${art}</svg>`;
}
function knownInfo(name){const base={...info(name),...(state.discovered?.[name]||{}),...(state.inventory.find(x=>x.name===name)||{})};const variants=state.synthesisVariants?.[name];if(isSynthesisItem(base)&&Array.isArray(variants)&&variants.length){const best=variants.reduce((a,b)=>(Number(b.r)||1)>(Number(a.r)||1)?b:a,variants[0]);return {...base,...best,name}}return base}
function isSynthesisItem(x){return !!(x&&(x.trait==="Síntesis de convergencia"||x.affix==="Síntesis de convergencia"||x.coherent===true||x.sourceA&&x.sourceB));}
// Fuente única del Registro Base. La Refinadora y la pantalla del Registro
// consultan exactamente estos mismos registros, nunca itemDB ni discovered por separado.
function getBaseRegistryItems(){
 const names=[...new Set((state.seen||[]).filter(n=>typeof n==="string"&&n.trim()))];
 return names.map(name=>({name,...knownInfo(name)})).filter(item=>item.name&&item.cat&&!isSynthesisItem(item));
}
function getRefineryRegistryCandidates(minValue){
 const floor=Math.max(1,Number(minValue)||1);
 return getBaseRegistryItems().filter(item=>{
  if(isSynthesisItem(item)||isRefineDust(item))return false;
  if(item.cat==="Otro"||item.cat==="Otros")return false;
  return Math.max(1,Number(item.val)||1)>floor;
 });
}

function saveOrganVariant(item){
 if(!item||item.cat!=="Órgano")return;
 state.organVariants=state.organVariants||{};
 const name=item.name;
 const variants=Array.isArray(state.organVariants[name])?[...state.organVariants[name]]:[];
 const r=Math.max(1,Math.min(5,Number(item.r)||1));
 const val=Math.max(1,Number(item.val)||Number(info(name).val)||20);
 const idx=variants.findIndex(v=>Number(v.r)===r);
 const snap={name,icon:item.icon||info(name).icon||"🫀",cat:"Órgano",r,val,desc:item.desc||info(name).desc||"",trait:"Ilegal",affix:"Ilegal",illegal:true};
 if(idx>=0){variants[idx]={...variants[idx],...snap,val:Math.max(Number(variants[idx].val)||0,val)};}
 else variants.push(snap);
 variants.sort((a,b)=>a.r-b.r);
 state.organVariants[name]=variants;
 return variants.find(v=>Number(v.r)===r);
}
function organVariantsFor(name){
 return Array.isArray(state.organVariants?.[name])?state.organVariants[name]:[];
}
function saveSynthesisVariant(item){
 if(!isSynthesisItem(item))return;
 state.synthesisVariants=state.synthesisVariants||{};
 const name=item.name,variants=Array.isArray(state.synthesisVariants[name])?[...state.synthesisVariants[name]]:[];
 const r=Math.max(1,Math.min(5,Number(item.r)||1)),idx=variants.findIndex(v=>Number(v.r)===r);
 // El valor base de una síntesis queda fijado por su primer registro; solo escala con el nivel.
 const priorBase=variants.find(v=>Number(v.r)===1)?.baseVal||variants.find(v=>Number(v.r)===1)?.val;
 const lowest=[...variants].sort((a,b)=>(Number(a.r)||1)-(Number(b.r)||1))[0];
 const baseVal=Math.max(1,Math.round(Number(priorBase||lowest?.baseVal||(lowest?Number(lowest.val||1)/(1+.35*((Number(lowest.r)||1)-1)):Number(item.val||info(name).val||5)/(1+.35*(r-1))))));
 const priceForLevel=level=>Math.max(1,Math.round(baseVal*(1+.35*(Math.max(1,Number(level)||1)-1))));
 const snapshot={name,icon:item.icon||info(name).icon,cat:item.cat||info(name).cat,r,val:priceForLevel(r),baseVal,desc:item.desc||info(name).desc||"",slot:item.slot||null,trait:"Síntesis de convergencia",affix:"Síntesis de convergencia",abilities:Array.isArray(item.abilities)?item.abilities.map(a=>({...a})):[],ability:item.ability?{...item.ability}:null,damage:item.damage||0,defense:item.defense||0,gather:item.gather||0,secondaryTrait:item.secondaryTrait||"",passive:item.passive?{...item.passive}:null,sourceA:item.sourceA||"",sourceB:item.sourceB||"",semanticThemes:Array.isArray(item.semanticThemes)?[...item.semanticThemes]:[],lineageConcepts:Array.isArray(item.lineageConcepts)?[...item.lineageConcepts]:[]};
 // La primera versión descubierta de cada nivel conserva sus habilidades procedurales; no se sobrescriben al repetir la fusión.
 if(idx>=0)variants[idx]={...variants[idx],baseVal,val:priceForLevel(r)};else variants.push(snapshot);
 variants.sort((a,b)=>a.r-b.r);variants.forEach(v=>{v.baseVal=baseVal;v.val=priceForLevel(v.r)});state.synthesisVariants[name]=variants;
 return variants.find(v=>Number(v.r)===r);
}
function valueRangeKey(item){const name=typeof item==="string"?item:item?.name||"";const data=typeof item==="string"?knownInfo(name):item;const cat=(data&&data.cat)||"";if(isSynthesisItem(data)||cat==="Órgano")return `${name}::N${Math.max(1,Number(data?.r)||1)}`;return name;}
function recordObservedValue(item){if(!item||!item.name)return;state.valueRanges=state.valueRanges||{};const key=valueRangeKey(item),v=Math.max(1,Number(item.val)||Number(info(item.name).val)||1),prior=state.valueRanges[key];state.valueRanges[key]=prior?{min:Math.min(Number(prior.min)||v,v),max:Math.max(Number(prior.max)||v,v)}:{min:v,max:v}}
function getObservedRange(item){const key=valueRangeKey(item),range=state.valueRanges?.[key];if(range)return {min:Number(range.min)||Number(item.val)||1,max:Number(range.max)||Number(item.val)||1};const v=Math.max(1,Number(item.val)||Number(info(item.name).val)||1);return {min:v,max:v}}
function addItem(name,qty=1,opts={}){
 const d=info(name),resolved={...opts};resolved.origin=resolved.origin||"general";const cat=resolved.cat||d.cat,slot=resolved.slot||d.slot,r=Math.max(1,Math.min(5,Number(resolved.r||d.r||1)));
 // Cada instancia de arma, herramienta o equipo recibe variaciones propias al entrar al inventario.
 const equipmentType=slot==="armor"||cat==="Equipo"?"Equipo":cat;
 if(["Arma","Herramienta","Equipo"].includes(equipmentType)&&!resolved.affix&&!resolved.abilities&&!resolved.ability){
  const choose=a=>a[Math.floor(Math.random()*a.length)];
  if(equipmentType==="Arma"){
   resolved.damage=Math.max(1,Number(resolved.damage??d.damage??(r*4))+Math.floor(Math.random()*(r*3+1)));
   resolved.affix=choose(["Filo resonante","Impacto brutal","Pulso estable","Carga residual"]);
   resolved.abilities=[{type:"Daño",name:resolved.affix,value:1+r+Math.floor(Math.random()*Math.max(1,r)),desc:`+${1+r} daño`}];
  }else if(equipmentType==="Equipo"){
   resolved.defense=Math.max(1,Number(resolved.defense??d.defense??(r*3))+Math.floor(Math.random()*(r*2+1)));
   resolved.affix=choose(["Blindaje reactivo","Disipación térmica","Sello hermético","Malla cinética"]);
   resolved.abilities=[{type:"Defensa",name:resolved.affix,value:Math.max(1,Math.floor(r/2)+Math.floor(Math.random()*Math.max(1,r))),desc:`+${Math.max(1,Math.floor(r/2))} defensa`}];
  }else{
   resolved.gather=Math.max(1,Number(resolved.gather??d.gather??(r*3))+Math.floor(Math.random()*(r*3+1)));
   resolved.affix=choose(["Extracción fina","Agarre adaptativo","Lectura mineral","Corte limpio"]);
   resolved.abilities=[{type:"Recolección",name:resolved.affix,value:2+r*2+Math.floor(Math.random()*Math.max(1,r)),desc:`+${2+r*2}% recolección`}];
  }
  if(r>=3&&Math.random()<.62){const second=choose([{type:"Suerte",name:"Instinto de élite",value:r*2,desc:`+${r*2}% hallazgos`},{type:"Créditos",name:"Recuperación eficiente",value:r*2,desc:`+${r*2}% créditos`},{type:"Botín",name:"Compartimento oculto",value:r*3,desc:`+${r*3}% probabilidad de botín adicional`},{type:"Experiencia",name:"Memoria de campo",value:r*2,desc:`+${r*2}% experiencia`},{type:"Recolección",name:"Recolector adaptativo",value:r*3,desc:`+${r*3}% recolección`}]);resolved.abilities.push(second);}
  resolved.ability=resolved.abilities[0];resolved.procedural=true;
 }
 applyIllegalPolicy(resolved);
  // Objetos base (Material/Lingote/Consumible no-síntesis): apilan por nombre + nivel, sin importar origen
  const baseStack=(["Material","Lingote","Consumible"].includes(cat||d.cat)||isRefineDust(name)||isRefineDust(resolved))&&!resolved.unique&&!isSynthesisItem(resolved)&&!resolved.procedural;
  let existing=null;
  if(baseStack){
    existing=state.inventory.find(x=>x.name===name&&!isSynthesisItem(x)&&!x.unique&&!x.procedural&&(x.cat||d.cat)===(cat||d.cat)&&Math.max(1,Number(x.r)||1)===r);
  }else if((cat||d.cat)==="Material"){
    existing=state.inventory.find(x=>x.name===name&&d.cat==="Material"&&!resolved.unique&&!isSynthesisItem(resolved)&&!isSynthesisItem(x)&&Number(x.val||d.val||5)===Number(resolved.val||d.val||5));
  }
 if(existing)existing.qty+=qty;
 else state.inventory.push({...resolved,id:uid(),name,qty,cat:cat||d.cat,r:resolved.r||d.r||1,val:resolved.val||d.val||5,desc:resolved.desc||d.desc||"",icon:resolved.icon||d.icon||"❔",slot});
 state.discovered=state.discovered||{};state.discovered[name]={...d,...resolved,name,cat:cat||d.cat,r:resolved.r||d.r||1,val:resolved.val||d.val||5,desc:resolved.desc||d.desc||"",icon:resolved.icon||d.icon||"❔"};
 if(!state.seen.includes(name))state.seen.push(name);
 if((cat||d.cat)==="Anomalía"||(resolved.cat==="Anomalía")){state.achievements=state.achievements||{};state.achievements.anomaly_fusion=true;ensureSkillsState();state.stats.anomalies=(state.stats.anomalies||0)+1;trackAchievement("anomaly_fusion")}
 recordObservedValue({...resolved,name,cat:cat||d.cat,r:resolved.r||d.r||1,val:resolved.val||d.val||5});
}
function takeById(id,n=1){const x=state.inventory.find(i=>i.id===id);if(!x||x.qty<n)return false;x.qty-=n;if(x.qty<=0){state.inventory=state.inventory.filter(i=>i.id!==id);for(const k of Object.keys(state.equipped||{}))if(state.equipped[k]===id)state.equipped[k]=null;}return true}
function count(name){return state.inventory.filter(x=>x.name===name).reduce((a,x)=>a+x.qty,0)}
function take(name,n=1){let left=n;for(let i=state.inventory.length-1;i>=0&&left>0;i--){let x=state.inventory[i];if(x.name===name){let amt=Math.min(x.qty,left);x.qty-=amt;left-=amt;if(x.qty<=0)state.inventory.splice(i,1)}}return left===0}
function equippedItem(slot){const id=state.equipped[slot];return state.inventory.find(x=>x.id===id)||null}
function stat(key){
 const gear=Object.values(state.equipped).map(id=>state.inventory.find(x=>x.id===id)).filter(Boolean);
 let total=gear.reduce((sum,x)=>sum+(Number(x[key])||Number(info(x.name)[key])||0),0);
 const keyTypes={damage:"Daño",defense:"Defensa",gather:"Recolección",luck:"Suerte",credits:"Créditos",capture:"Captura",loot:"Botín",experience:"Experiencia"};
 gear.forEach(x=>{
  if(x.cat==="Anomalía"&&x.passive&&keyTypes[key]===x.passive.type)total+=parseInt(String(x.passive.value).match(/\d+/)?.[0]||0,10);
  const skills=[...(Array.isArray(x.abilities)?x.abilities:[]),...(x.ability?[x.ability]:[])];
  const uniqueSkills=[...new Map(skills.filter(Boolean).map(skill=>[`${skill.type}|${skill.name}|${skill.value}`,skill])).values()];
  uniqueSkills.forEach(skill=>{if(skill.type===keyTypes[key])total+=Number(skill.value)||0});
 });
 return total;
}
function damage(){return 5+stat("damage")+skillBonus("damage")}
function defense(){return stat("defense")+skillBonus("defense")}
const zoneUnlockLevels={forest:1,mine:1,scrapyard:1,swamp:4,quarry:6,bunker:8,glacier:10,volcano:12,neoncity:14,reef:16,dunes:18,rift:20,lab:22,silica:24,station:26,cryo:29,vault:32,root:35,foundry:38,observatory:46,nullshore:50};
function operatorRank(level=state.level){if(level>=50)return "Singularidad viviente";if(level>=47)return "Nexo trascendente";if(level>=43)return "Arquitecto de convergencia";if(level>=39)return "Soberano de anomalías";if(level>=35)return "Custodio del umbral";if(level>=31)return "Estratega del vacío";if(level>=27)return "Maestro de expedición";if(level>=20)return "Vanguardia anómala";if(level>=16)return "Comandante de campo";if(level>=12)return "Especialista de ruptura";if(level>=9)return "Veterano de expedición";if(level>=6)return "Técnico de anomalías";if(level>=4)return "Explorador avanzado";if(level>=2)return "Operador de campo";return "Recluta de campo"}

const OPERATOR_SKILLS=[
 {id:"explore_speed",name:"Paso ligero",iconKey:"explore_speed",desc:"Reduce el tiempo de cada exploración.",max:5,unlockLevel:1,effect:"−1 s por nivel (mín. 5 s)",perLevel:{exploreTime:-1}},
 {id:"base_damage",name:"Golpe firme",iconKey:"base_damage",desc:"Aumenta el daño base del operador.",max:5,unlockLevel:1,effect:"+2 daño por nivel",perLevel:{damage:2}},
 {id:"base_defense",name:"Piel dura",iconKey:"base_defense",desc:"Aumenta la defensa base del operador.",max:5,unlockLevel:2,effect:"+1 defensa por nivel",perLevel:{defense:1}},
 {id:"loot_boost",name:"Ojo de carroñero",iconKey:"loot_boost",desc:"Más potencia de recolección en expediciones.",max:5,unlockLevel:3,effect:"+6% recolección por nivel",perLevel:{gather:6}},
 {id:"findings",name:"Sensor anómalo",iconKey:"findings",desc:"Mejora la bonificación de hallazgos.",max:4,unlockLevel:4,effect:"+4% hallazgos por nivel",perLevel:{luck:4}},
 {id:"craft_speed",name:"Taller ágil",iconKey:"craft_speed",desc:"Reduce el tiempo de fabricación en la mesa.",max:3,unlockLevel:5,effect:"−1 s de craft por nivel (mín. 5 s)",perLevel:{craftTime:-1}},
 {id:"extract_skill",name:"Mano firme",iconKey:"extract_skill",desc:"Mejora el éxito de extracción de órganos.",max:3,unlockLevel:6,effect:"+5% extracción por nivel",perLevel:{extract:5}},
 {id:"iron_lungs",name:"Pulmón de campo",iconKey:"iron_lungs",desc:"Más integridad máxima en combates de exploración.",max:4,unlockLevel:7,effect:"+4 HP de combate por nivel",perLevel:{combatHp:4}},
 {id:"smelt_master",name:"Maestro del crisol",iconKey:"smelt_master",desc:"Reduce el tiempo de fundición en el horno.",max:2,unlockLevel:8,effect:"−2 s de fundición por nivel (mín. 4 s)",perLevel:{smeltTime:-2}},
 {id:"combat_endurance",name:"Resistencia de campo",iconKey:"combat_endurance",desc:"Impulso de combate de élite.",max:2,unlockLevel:9,effect:"+3 defensa y +2 daño por nivel",perLevel:{defense:3,damage:2}},
 {id:"anomaly_affinity",name:"Afinidad anómala",iconKey:"anomaly_affinity",desc:"Más probabilidades de hallar anomalías en campo.",max:3,unlockLevel:10,effect:"+3% anomalía por nivel",perLevel:{anomalyFind:3}},
 {id:"steady_hands",name:"Manos firmes",iconKey:"steady_hands",desc:"Mejor precisión: más daño crítico en combate.",max:3,unlockLevel:11,effect:"+3% crítico por nivel",perLevel:{crit:3}},
 {id:"pack_mule",name:"Mula de carga",iconKey:"pack_mule",desc:"Más botín secundario en expediciones.",max:3,unlockLevel:12,effect:"+5% chance de botín extra por nivel",perLevel:{loot:5}},
 {id:"scout",name:"Explorador nato",iconKey:"scout",desc:"Menos encuentros hostiles en expediciones.",max:2,unlockLevel:14,effect:"−4% contacto hostil por nivel",perLevel:{enemyAvoid:4}},
 {id:"survivor",name:"Superviviente",iconKey:"survivor",desc:"Último recurso: bonus único de defensa y recolección.",max:1,unlockLevel:18,effect:"+6 defensa y +8% recolección",perLevel:{defense:6,gather:8}}
];

function ensureSkillPointsFromLevel(){
 ensureSkillsState();
 const spent=Object.values(state.skills||{}).reduce((a,n)=>a+(Number(n)||0),0);
 const expected=Math.max(0,(state.level||1)-1);
 // If player has fewer total points than levels-1, top up available (not spent)
 const total=spent+(Number(state.skillPoints)||0);
 if(total<expected)state.skillPoints=(Number(state.skillPoints)||0)+(expected-total);
}
function ensureSkillsState(){
 state.skills=state.skills||{};
 state.skillPoints=Math.max(0,Number(state.skillPoints)||0);
 state.creditsEarned=Math.max(Number(state.creditsEarned)||0,Number(state.credits)||0);
 state.stats=state.stats||{crafted:0,smelted:0,anomalies:0};
 state.missionHistory=state.missionHistory||[];
}
function skillLevel(id){ensureSkillsState();return Math.max(0,Number(state.skills[id])||0)}
function skillBonus(key){
 ensureSkillsState();
 let t=0;
 OPERATOR_SKILLS.forEach(sk=>{
  const lv=skillLevel(sk.id);
  if(lv>0&&sk.perLevel&&sk.perLevel[key]!=null)t+=sk.perLevel[key]*lv;
 });
 return t;
}
function exploreDurationMs(){
 const base=10; // segundos
 const red=Math.abs(Math.min(0,skillBonus("exploreTime"))); // perLevel is negative
 const sec=Math.max(5,base-red);
 return sec*1000;
}
function assignSkillPoint(id){
 ensureSkillsState();
 const sk=OPERATOR_SKILLS.find(s=>s.id===id);
 if(!sk)return;
 if(state.level<sk.unlockLevel)return toast(`Requiere nivel de Operador ${sk.unlockLevel}.`,true);
 const cur=skillLevel(id);
 if(cur>=sk.max)return toast("Habilidad al máximo.",true);
 if(state.skillPoints<1)return toast("No tienes puntos de habilidad.",true);
 state.skillPoints--;
 state.skills[id]=cur+1;
 log(`Habilidad mejorada: <b>${sk.name}</b> → N${cur+1}.`);
 toast(`${sk.name} N${cur+1}`);
 renderSkills();renderStats();renderEquipment();save();sound(620,.08,"triangle");
}
function renderSkills(){
 ensureSkillsState();
 if($("skillPointsTag"))$("skillPointsTag").textContent=state.skillPoints+" PUNTOS";
 if($("skillPointsLabel"))$("skillPointsLabel").textContent=String(state.skillPoints);
 const host=$("skillsGrid");
 if(!host)return;
 host.innerHTML=OPERATOR_SKILLS.map(sk=>{
  const cur=skillLevel(sk.id);
  const locked=state.level<sk.unlockLevel;
  const maxed=cur>=sk.max;
  const can=(!locked)&&(!maxed)&&(state.skillPoints>0);
  return `<div class="skill-card ${locked?"locked":""}">
   <div class="skill-head"><h4 class="skill-title">${hudIconMarkup(sk.iconKey||sk.id,20)}<span>${escapeHtml(sk.name)}</span></h4><span class="skill-lvl">N${cur}/${sk.max}</span></div>
   <p>${escapeHtml(sk.desc)}</p>
   <div class="skill-effect">${escapeHtml(sk.effect||"")}</div>
   ${locked?`<div class="skill-req">${hudIconMarkup("lock",12)} Requiere Operador N${sk.unlockLevel}</div>`:""}
   <div class="skill-actions">
    <button type="button" class="tiny primary" data-skill-up="${sk.id}" ${can?"":"disabled"}>${maxed?"Máximo":"Mejorar · 1 pt"}</button>
   </div>
  </div>`;
 }).join("");
 host.querySelectorAll("[data-skill-up]").forEach(b=>b.onclick=()=>assignSkillPoint(b.dataset.skillUp));
}

function zoneRequiredLevel(z){return zoneUnlockLevels[z.id]||1}
function zoneUnlocked(z){return state.level>=zoneRequiredLevel(z)}
function xp(n){const baseGain=Math.max(0,Math.floor(Number(n)||0));const gain=baseGain?Math.max(1,Math.floor(baseGain*(1+Math.max(0,stat("experience")+skillBonus("experience"))/100))):0;if(!gain)return;if(state.level>=50){state.level=50;state.xp=0;toast("Nivel máximo alcanzado: 50.");return}state.xp+=gain;log(`Experiencia obtenida: <b>+${gain} XP</b>.`);while(state.level<50&&state.xp>=state.level*100){state.xp-=state.level*100;state.level++;ensureSkillsState();state.skillPoints=(Number(state.skillPoints)||0)+1;const levelReward=20+state.level*5;const rankMilestone=[2,4,6,9,12,16,20,27,31,35,39,43,47,50].includes(state.level);const rankBonus=rankMilestone?state.level*10:0;const reward=levelReward+rankBonus;state.credits+=reward;ensureSkillsState();state.creditsEarned=(Number(state.creditsEarned)||0)+reward;log(`¡Nivel ${state.level} alcanzado! Rango: <b>${operatorRank()}</b>. +${levelReward} créditos${rankBonus?` y +${rankBonus} por rango`:""}.`);toast(`¡Nivel ${state.level}! <b>${operatorRank()}</b> · +${reward} créditos · +1 pt habilidad`)}if(state.level>=50)state.xp=0;renderStats();save()}
function log(msg){state.activity.unshift({msg,time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})});state.activity=state.activity.slice(0,8)}
function ensureAudio(){
 audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();
 if(!masterGain){
  masterGain=audioCtx.createGain();
  masterGain.gain.value=Math.max(0,Math.min(100,Number(state.settings.soundVolume??75)))/100*0.8;
  // Compresor suave: reduce picos que en móvil se oyen como petardeo
  try{
   const comp=audioCtx.createDynamicsCompressor();
   comp.threshold.value=-18;
   comp.knee.value=18;
   comp.ratio.value=6;
   comp.attack.value=0.003;
   comp.release.value=0.12;
   masterGain.connect(comp);
   comp.connect(audioCtx.destination);
   masterGain._comp=comp;
  }catch(e){
   masterGain.connect(audioCtx.destination);
  }
 }
 if(audioCtx.state==="suspended")audioCtx.resume().catch(()=>{});
 return audioCtx;
}

function getBgMusic(){return $("bgMusic")}
function applyMusicVolume(){
 const a=getBgMusic(); if(!a)return;
 const muted=!!state.settings.musicMuted;
 const vol=Math.max(0,Math.min(100,Number(state.settings.musicVolume??40)))/100;
 a.muted=muted;
 a.volume=muted?0:Math.max(0,Math.min(1,vol));
}
function ensureBgMusic(){
 const a=getBgMusic(); if(!a)return;
 // Rutas alternativas por si el mp3 está en otra carpeta
 if(a.error||!a.currentSrc){
  const candidates=["AnomalyFusion.mp3","./AnomalyFusion.mp3","main/AnomalyFusion.mp3","./main/AnomalyFusion.mp3"];
  if(!candidates.includes(a.getAttribute("src")))a.src=candidates[0];
 }
 applyMusicVolume();
 if(state.settings.musicMuted){try{a.pause()}catch(e){} return}
 const play=()=>{
  applyMusicVolume();
  a.loop=true;
  const p=a.play();
  if(p&&p.catch)p.catch(err=>{console.warn("Música:",err&&err.message);});
 };
 try{
  if(audioCtx&&audioCtx.state==="suspended")audioCtx.resume().then(play).catch(play);
  else play();
 }catch(e){play()}
}
function setMusicVolume(v){
 state.settings.musicVolume=Math.max(0,Math.min(100,Number(v)||0));
 if(state.settings.musicVolume>0)state.settings.musicMuted=false;
 applyMusicVolume();
 if(!state.settings.musicMuted)ensureBgMusic();
 syncSettingsUI();
 save();
}
function setMusicMuted(on){
 state.settings.musicMuted=!!on;
 applyMusicVolume();
 if(!on)ensureBgMusic();
 else{const a=getBgMusic();if(a)try{a.pause()}catch(e){}}
 syncSettingsUI();
 save();
}
function setSoundMuted(on){
 state.settings.soundMuted=!!on;
 state.settings.sound=!state.settings.soundMuted;
 const gain=state.settings.soundMuted?0:(Math.max(0,Math.min(100,Number(state.settings.soundVolume??75)))/100)*1.25;
 if(masterGain&&audioCtx){
  const now=audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setTargetAtTime(gain,now,.05);
 }
 syncSettingsUI();
 save();
}

function setSoundVolume(value){
 state.settings.soundVolume=Math.max(0,Math.min(100,Number(value)||0));
 if(state.settings.soundVolume>0){state.settings.soundMuted=false;state.settings.sound=true;}
 const gain=state.settings.soundMuted?0:(state.settings.soundVolume/100)*1.25;
 if(masterGain&&audioCtx){
  const now=audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setTargetAtTime(gain,now,.05);
 }
 syncSettingsUI();
 save();
}
// Anti-petardeo móvil: no solapar beeps, ataque/release más largos, nunca cortar con gain>0
let _lastBeepAt=0;
function sound(freq=520,dur=.08,type="sine"){
 if(state.settings.soundMuted||!state.settings.sound||Number(state.settings.soundVolume)===0)return;
 try{
  ensureAudio();
  const now=audioCtx.currentTime;
  // limitar solapes (principal causa de clics en Android/iOS)
  if(now-_lastBeepAt<0.045)return;
  _lastBeepAt=now;
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  const filter=audioCtx.createBiquadFilter();
  osc.type="sine"; // solo seno en móvil: el triángulo a veces introduce clicks
  const f0=Math.max(120,Math.min(1400,Number(freq)||520));
  osc.frequency.setValueAtTime(f0,now);
  filter.type="lowpass";
  filter.frequency.setValueAtTime(Math.min(1600,f0*2.2),now);
  filter.Q.value=0.3;
  const peak=0.16;
  const attack=0.028;
  const body=Math.max(0.06,Math.min(0.28,Number(dur)||.08));
  // envelope: 0.0001 -> peak -> 0.0001 (exponencial estable en WebAudio móvil)
  gain.gain.setValueAtTime(0.0001,now);
  gain.gain.exponentialRampToValueAtTime(peak,now+attack);
  gain.gain.exponentialRampToValueAtTime(0.0001,now+attack+body);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now+attack+body+0.04);
 }catch(e){}
}
function soundSale(){
 if(state.settings.soundMuted||!state.settings.sound||Number(state.settings.soundVolume)===0)return;
 try{
  ensureAudio();
  const ctx=audioCtx;
  const now=ctx.currentTime;
  const notes=[523.25,659.25,783.99];
  notes.forEach((freq,i)=>{
   const t=now+i*0.1;
   const osc=ctx.createOscillator();
   const gain=ctx.createGain();
   const filter=ctx.createBiquadFilter();
   osc.type="sine";
   osc.frequency.setValueAtTime(freq,t);
   filter.type="lowpass";
   filter.frequency.setValueAtTime(1600,t);
   filter.Q.value=0.3;
   gain.gain.setValueAtTime(0.0001,t);
   gain.gain.exponentialRampToValueAtTime(0.05,t+0.03);
   gain.gain.exponentialRampToValueAtTime(0.0001,t+0.18);
   osc.connect(filter);filter.connect(gain);gain.connect(masterGain);
   osc.start(t);
   osc.stop(t+0.22);
  });
 }catch(e){}
}
function toast(msg,bad=false){const d=document.createElement("div");d.className="toast"+(bad?" bad":"");d.innerHTML=msg; $("toastArea").appendChild(d);sound(bad?180:620,.06,bad?"triangle":"sine");setTimeout(()=>d.remove(),3500)}
function showConfirm(title,message,acceptLabel,action,danger=false){
 pendingConfirmAction=action;
 const t=$("confirmTitle"),m=$("confirmMessage"),a=$("confirmAccept"),modal=$("confirmModal");
 if(t)t.textContent=title;
 if(m)m.textContent=message;
 if(a){a.textContent=acceptLabel||"Confirmar";a.classList.toggle("danger",!!danger);a.classList.toggle("primary",!danger)}
 if(modal)modal.classList.remove("hidden");
 const cancel=$("confirmCancel");if(cancel)try{cancel.focus({preventScroll:true})}catch(_){}
}
function closeConfirm(){pendingConfirmAction=null;const modal=$("confirmModal");if(modal)modal.classList.add("hidden")}
function closeSortMenus(except){document.querySelectorAll(".sort-options").forEach(menu=>{if(menu.id!==except)menu.classList.add("hidden")});document.querySelectorAll(".sort-trigger").forEach(button=>{if(button.nextElementSibling?.id!==except)button.setAttribute("aria-expanded","false")})}
function setSortMenu(target,value){const options={inventory:{rarity:"Nivel: mayor primero",name:"Nombre A-Z",value:"Valor: mayor primero"},registry:{name:"Nombre A-Z",rarity:"Nivel: mayor primero",value:"Valor: mayor primero"}};if(target==="inventory"){inventorySort=value;$("sortInventoryLabel").textContent=options.inventory[value];inventoryPage=1;renderInventory()}else{registrySort=value;$("registrySortLabel").textContent=options.registry[value];registryPage=1;renderRegistry()}document.querySelectorAll(`[data-sort-target="${target}"]`).forEach(button=>button.setAttribute("aria-selected",String(button.dataset.sortValue===value)));closeSortMenus()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function inventoryDisplayName(x){const raw=String(x?.name||"Objeto desconocido");const cleaned=raw.replace(/\s*·\s*.+$/,"").trim()||raw;return cleaned.replace(/\s+N[1-5]$/,"").trim()||cleaned;}
function objectTypeLabel(x){const name=String(x?.name||"");const m=name.match(/\s*·\s*(.+)$/);if(m&&m[1].trim())return m[1].trim();return x?.cat||info(x?.name||"").cat||"Otro"}
function itemCard(x,opts={}){const r=x.r||info(x.name).r||1;if(opts.compact){const fused=isSynthesisItem(x),desc=x.desc||info(x.name).desc||"Objeto sin descripción.";const eq=isItemEquipped(x.id);const slot=eq?equippedSlotOf(x.id):null;const slotLabel=({weapon:"Arma",armor:"Armadura",tool:"Herramienta",tongs:"Pinzas",driver:"Destornillador",pick:"Pico",axe:"Hacha",anomaly:"Anomalía",companion:"Compañero"})[slot]||slot||"Equipo";return `<button type="button" class="item-card inventory-tile rarity-${r}${eq?" is-equipped is-locked":""}" data-inventory-detail="${escapeHtml(x.id)}" data-equipped="${eq?"1":"0"}" aria-label="Ver detalles de ${escapeHtml(x.name)}"><div class="item-top"><div class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}${eq?`<span class="equip-lock" title="Equipado">${typeof hudIconMarkup==="function"?hudIconMarkup("lock",14):"🔒"}</span>`:""}</div><div class="inventory-tile-main"><h4 title="${escapeHtml(inventoryDisplayName(x))}">${escapeHtml(inventoryDisplayName(x))} ${x.qty>1?`<span class="muted">×${x.qty}</span>`:""}</h4><div class="rarity r${r}">${escapeHtml(rarityNames[r]||"COMÚN")} · N${r}</div></div></div><div class="inventory-tile-description">${escapeHtml(desc)}</div>${fused?`<div class="inventory-tile-trait">✦ Síntesis de convergencia</div>`:""}${eq?`<div class="inventory-tile-equipped">${typeof hudIconMarkup==="function"?hudIconMarkup("lock",12):""}<span>Equipado · ${escapeHtml(slotLabel)}</span></div>`:""}<div class="inventory-tile-meta"><span>${escapeHtml(x.cat||info(x.name).cat||"Otro")}</span><b>${formatCredits(Number(x.val||info(x.name).val||1),13)}</b></div><span class="inventory-tile-open">${eq?"Bloqueado · Ver detalles ↗":"Ver detalles ↗"}</span></button>`}const skills=Array.isArray(x.abilities)?x.abilities:(x.ability?[x.ability]:[]);
const skillLines=[];
if(skills.length)skills.forEach(a=>skillLines.push(`${a.name}${a.desc?" · "+a.desc:""}`));
else if(x.secondaryTrait)skillLines.push(String(x.secondaryTrait));
else if(x.affix&&x.affix!=="Síntesis de convergencia")skillLines.push(String(x.affix));
if(x.gather)skillLines.push(`Recolección +${x.gather}%`);
if(x.damage&&(x.cat==="Arma"||x.cat==="Herramienta"||info(x.name).cat==="Arma"||info(x.name).cat==="Herramienta"))skillLines.push(`Daño +${x.damage}`);
if(x.defense)skillLines.push(`Defensa +${x.defense}`);
if(x.passive&&(x.passive.value||x.passive.type))skillLines.push(String(x.passive.value||x.passive.type));
const skillHtml=skillLines.length?`<div class="small-note" style="margin-top:7px;color:var(--cyan)">✦ ${skillLines.map(escapeHtml).join(" / ")}</div>`:"";
const synthesisHtml=isSynthesisItem(x)?`<div class="small-note" style="margin-top:5px;color:var(--cyan)">◇ Rasgo: Síntesis de convergencia</div>`:"";return `<div class="item-card rarity-${r}"><div class="item-top"><div class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</div><div style="min-width:0"><h4 title="${escapeHtml(inventoryDisplayName(x))}">${escapeHtml(inventoryDisplayName(x))} ${x.qty>1?`<span class="muted">×${x.qty}</span>`:""}</h4><div class="rarity r${r}">NIVEL ${r} · ${rarityNames[r]}</div></div></div><div class="desc">${escapeHtml(x.desc||info(x.name).desc||"Objeto sin descripción.")}</div>${skillHtml}${synthesisHtml}<div class="item-bottom"><span class="muted" style="font-size:.68rem">${escapeHtml(x.cat||info(x.name).cat)} · Valor base (100%): ${Number(x.val||info(x.name).val)} cr.</span>${opts.sell?`<span class="muted" style="font-size:.62rem">Envío de suministro</span>`:""}</div>${opts.equip?`<button class="tiny" style="width:100%;margin-top:8px" data-equip-id="${x.id}">Equipar</button>`:""}</div>`}

// === NEXO · MÁQUINA DE MEJORA ===
function isBaseRegistryItem(name){
  const d=info(name);
  if(!d||!d.cat)return false;
  if(isSynthesisItem({name,...d}))return false;
  // Solo objetos del registro base (vistos o en itemDB estándar)
  const seen=state.seen||[];
  const disc=state.discovered||{};
  return seen.includes(name)||!!disc[name]||!!itemDB[name];
}
function upgradeInputValue(){
  if(!upgradeInputId)return 0;
  const x=state.inventory.find(i=>i.id===upgradeInputId);
  if(!x)return 0;
  const base=Math.max(1,Number(x.val)||Number(info(x.name).val)||1);
  return base*Math.max(1,upgradeInputQty);
}
function upgradeTargetValue(){
  if(!upgradeTargetName)return 0;
  const base=Math.max(1,Number(info(upgradeTargetName).val)||1);
  return base*Math.max(1,upgradeTargetQty);
}
function upgradeChancePct(){
  const inn=upgradeInputValue(),out=upgradeTargetValue();
  if(!inn||!out)return 0;
  // Valor entrada >= valor objetivo → 90% (máximo). Si es menor, escala hacia abajo.
  const ratio=inn/out;
  if(ratio>=1)return 90;
  // ratio 0→5%, ratio 1→90%
  return Math.min(90,Math.max(5,Math.round(5+ratio*85)));
}
function renderUpgradeMachine(){
  const inItem=upgradeInputId?state.inventory.find(i=>i.id===upgradeInputId):null;
  if(upgradeInputId&&!inItem){upgradeInputId=null;upgradeInputQty=1}
  if(inItem)upgradeInputQty=Math.min(Math.max(1,upgradeInputQty),inItem.qty);
  const pick=$("upgradeInputPick"),infoEl=$("upgradeInputInfo"),inQty=$("upgradeInQty"),inVal=$("upgradeInValue");
  if(pick){
    if(inItem){pick.innerHTML=`<span class="item-icon">${itemIconMarkup(inItem.name,inItem.icon||info(inItem.name).icon)}</span> ${escapeHtml(inventoryDisplayName(inItem))} · ×${inItem.qty}`;}
    else pick.textContent="＋ Elegir objeto de entrada";
  }
  if($("upgradeInputClear"))$("upgradeInputClear").classList.toggle("hidden",!inItem||upgradeSpinning);
  if(infoEl)infoEl.textContent=inItem?`N${inItem.r||1} · ${inItem.cat||info(inItem.name).cat} · Base ${Math.max(1,Number(inItem.val)||Number(info(inItem.name).val)||1)} cr./u`:"Ningún objeto seleccionado.";
  if(inQty)inQty.textContent="×"+upgradeInputQty;
  if(inVal)inVal.innerHTML=formatCredits(upgradeInputValue(),14);

  const tInfo=$("upgradeTargetInfo"),tQty=$("upgradeOutQty"),tVal=$("upgradeOutValue"),tPick=$("upgradeTargetPick");
  if(tPick){
    if(upgradeTargetName){tPick.innerHTML=`<span class="item-icon">${itemIconMarkup(upgradeTargetName,info(upgradeTargetName).icon)}</span> ${escapeHtml(upgradeTargetName)}`;}
    else tPick.textContent="＋ Elegir del Registro Base";
  }
  if($("upgradeTargetClear"))$("upgradeTargetClear").classList.toggle("hidden",!upgradeTargetName||upgradeSpinning);
  if(tInfo)tInfo.textContent=upgradeTargetName?`N${info(upgradeTargetName).r||1} · ${info(upgradeTargetName).cat||"?"} · Base ${Math.max(1,Number(info(upgradeTargetName).val)||1)} cr./u`:"Ningún objetivo seleccionado.";
  if(tQty)tQty.textContent="×"+upgradeTargetQty;
  if(tVal)tVal.innerHTML=formatCredits(upgradeTargetValue(),14);

  const pct=upgradeChancePct();
  const chanceEl=$("upgradeChance"),arc=$("upgradeSuccessArc"),note=$("upgradeChanceNote"),btn=$("upgradeSpinBtn");
  if(chanceEl){
    chanceEl.textContent=pct?pct+"%":"—";
    chanceEl.classList.remove("chance-high","chance-mid","chance-low");
    if(pct>=50)chanceEl.classList.add("chance-high");
    else if(pct>=20)chanceEl.classList.add("chance-mid");
    else if(pct>0)chanceEl.classList.add("chance-low");
  }
  if(arc)arc.style.setProperty("--success-deg",(pct/100*360)+"deg");
  if(note){
    if(!upgradeInputId||!upgradeTargetName)note.textContent="Elige entrada y objetivo: el % sube si el valor que entregas iguala o supera el valor pedido (máx. 90%).";
    else if(pct>=90)note.textContent="Oferta máxima (90%). Siempre queda un 10% de riesgo de pérdida.";
    else if(pct>=70)note.textContent="Buena oferta. Alta probabilidad, pero no garantizada.";
    else if(pct>=40)note.textContent="Oferta intermedia. El riesgo de perder la entrada es notable.";
    else note.textContent="Oferta baja. Muy alto riesgo de perder lo entregado.";
  }
  if(btn)btn.disabled=upgradeSpinning||!upgradeInputId||!upgradeTargetName||pct<=0||!!activeTask||!!currentEnemy;
}
function openUpgradeTargetPicker(){
  if(upgradeSpinning)return;
  try{
    pickerMode="upgradeTarget";pickerSlot=null;pickerFilter="Todos";pickerPage=1;
    if($("pickerSearch"))$("pickerSearch").value="";
    if($("pickerTitle"))$("pickerTitle").textContent="▤ REGISTRO BASE · OBJETIVO";
    if($("pickerDescription"))$("pickerDescription").textContent="Solo objetos base descubiertos (sin síntesis ni criaturas). Elige lo que quieres obtener.";
    if($("pickerFilterMenu"))$("pickerFilterMenu").classList.remove("hidden");
    if($("pickerFilterLabel"))$("pickerFilterLabel").textContent=pickerFilter;
    const modal=$("inventoryPicker");
    if(modal)modal.classList.remove("hidden");
    renderPicker();
  }catch(err){console.error(err);toast("Error al abrir registro: "+err.message,true)}
}

function openUpgradeInputPicker(){
  if(upgradeSpinning)return;
  try{
    pickerMode="upgradeInput";pickerSlot=null;pickerFilter="Todos";pickerPage=1;
    if($("pickerSearch"))$("pickerSearch").value="";
    if($("pickerTitle"))$("pickerTitle").textContent="▤ INVENTARIO · ENTRADA";
    if($("pickerDescription"))$("pickerDescription").textContent="Elige un objeto base de tu inventario (no síntesis) para entregar.";
    if($("pickerFilterMenu"))$("pickerFilterMenu").classList.remove("hidden");
    if($("pickerFilterLabel"))$("pickerFilterLabel").textContent=pickerFilter;
    const modal=$("inventoryPicker");
    if(modal)modal.classList.remove("hidden");
    renderPicker();
  }catch(err){console.error(err);toast("Error al abrir selector: "+err.message,true)}
}

function spinUpgradeRoulette(){
  if(upgradeSpinning||!upgradeInputId||!upgradeTargetName)return;
  const item=state.inventory.find(i=>i.id===upgradeInputId);
  if(!item||item.qty<upgradeInputQty)return toast("No tienes suficientes unidades de entrada.",true);
  if(isSynthesisItem(item))return toast("No se admiten objetos de síntesis.",true);
  const pct=upgradeChancePct();
  if(pct<=0)return;
  upgradeSpinning=true;renderUpgradeMachine();
  // Consumir entrada YA (no se puede retirar)
  const removed=removeItemById(upgradeInputId,upgradeInputQty);
  if(!removed){upgradeSpinning=false;renderUpgradeMachine();return toast("Error al consumir la entrada.",true)}
  const needle=$("upgradeNeedle");
  const roulette=$("upgradeRoulette");
  const successSpan=pct/100*360; // grados amarillos (éxito)
  const failSpan=Math.max(0,360-successSpan); // grados grises (fallo)
  const win=Math.random()*100<pct;
  const spins=7+Math.floor(Math.random()*3); // 7-9 vueltas
  // Anillo: desde las 12, sentido horario → primero GRIS (fallo) failSpan°, luego AMARILLO (éxito) successSpan°
  // Amarillo = zona [(failSpan) .. 360] en rotación de la aguja (0° = arriba, CW+)
  let finalDeg;
  if(win){
    const pad=Math.min(4,Math.max(1,successSpan*0.04));
    finalDeg=360*spins + failSpan + pad + Math.random()*Math.max(2,successSpan-2*pad);
  }else{
    const pad=Math.min(4,Math.max(1,failSpan*0.04));
    finalDeg=360*spins + pad + Math.random()*Math.max(2,failSpan-2*pad);
  }
  // Reiniciar aguja sin transición, luego animar en el siguiente frame
  if(needle){
    needle.classList.remove("is-spinning");
    needle.style.transition="none";
    needle.style.transform="rotate(0deg)";
  }
  if(roulette)roulette.classList.add("is-spinning");
  const resultEl=$("upgradeResult");
  if(resultEl)resultEl.textContent="Ruleta en marcha… no se puede cancelar ni cambiar la apuesta.";
  try{
    sound(180,.06,"square");
    const tickIv=setInterval(()=>{if(!upgradeSpinning){clearInterval(tickIv);return}sound(240+Math.random()*100,.025,"square")},160);
    setTimeout(()=>clearInterval(tickIv),4000);
  }catch(e){}
  // Doble rAF para forzar repaint antes de la transición (móvil)
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      if(needle){
        needle.style.transition="transform 4.2s cubic-bezier(0.12, 0.75, 0.08, 1)";
        needle.classList.add("is-spinning");
        needle.style.transform="rotate("+finalDeg+"deg)";
      }
    });
  });
  setTimeout(()=>{
    if(roulette)roulette.classList.remove("is-spinning");
    if(win){
      state.achievements=state.achievements||{};state.achievements.upgrade_success=true;
      addItem(upgradeTargetName,upgradeTargetQty,{origin:"mejora"});
      log(`Mejora exitosa: entregaste entrada y obtuviste <b>${upgradeTargetQty}× ${escapeHtml(upgradeTargetName)}</b> (${pct}%).`);
      toast(`¡Éxito! +${upgradeTargetQty}× ${upgradeTargetName}`);
      if(resultEl)resultEl.innerHTML=`<span class="cyan">Éxito (${pct}%).</span> Has obtenido <b>${upgradeTargetQty}× ${escapeHtml(upgradeTargetName)}</b>.`;
      sound(660,.12,"sine"); setTimeout(()=>sound(880,.16,"triangle"),90);
    }else{
      log(`Mejora fallida (${pct}%): se perdieron los objetos de entrada.`);
      toast("Fallaste. Has perdido los objetos entregados.",true);
      if(resultEl)resultEl.innerHTML=`<span class="red">Fallo.</span> Fuera del rango del ${pct}%. Entrada perdida.`;
      sound(120,.22,"sawtooth"); setTimeout(()=>sound(90,.18,"square"),120);
    }
    upgradeSpinning=false;
    upgradeInputId=null;upgradeInputQty=1;
    // Dejar la aguja en el ángulo final sin saltar (no usar % 360 aquí)
    if(needle){
      needle.classList.remove("is-spinning");
      needle.style.transition="none";
      needle.style.transform="rotate("+finalDeg+"deg)";
    }
    renderUpgradeMachine();render();save();
  },4300);
}

function exchangeBoxCount(){return Object.values(exchangeBox).reduce((a,n)=>a+Number(n||0),0)}
function exchangeBoxValue(){
  let v=0;
  for(const [id,qty] of Object.entries(exchangeBox)){
    const x=state.inventory.find(i=>i.id===id);
    if(!x||!qty)continue;
    v+=(Math.max(1,Number(x.val)||Number(info(x.name).val)||1))*Number(qty);
  }
  return v;
}
function renderExchangeModule(){
  const list=$("exchangeBoxList"),valEl=$("exchangeBoxValue"),cntEl=$("exchangeBoxCount"),btn=$("exchangeSubmitBtn"),note=$("exchangeNote");
  const total=exchangeBoxCount();
  if(cntEl)cntEl.textContent=total+"/10";
  if(valEl)valEl.innerHTML=formatCredits(exchangeBoxValue(),14);
  if(list){
    const rows=Object.entries(exchangeBox).map(([id,qty])=>{
      const x=state.inventory.find(i=>i.id===id);
      if(!x||qty<=0)return "";
      return `<div class="exchange-row"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><div style="min-width:0;flex:1"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)}</small></div><button type="button" class="tiny" data-ex-remove="${id}">Retirar</button></div>`;
    }).filter(Boolean);
    list.innerHTML=rows.length?rows.join(""):'<div class="empty">La caja está vacía. Añade 1–10 objetos base.</div>';
    list.querySelectorAll("[data-ex-remove]").forEach(b=>b.onclick=()=>{delete exchangeBox[b.dataset.exRemove];renderExchangeModule()});
  }
  if(btn)btn.disabled=exchangeBusy||total<1||total>10||!!activeTask||!!currentEnemy;
  if(note)note.textContent=total?`Valor de la caja: ${exchangeBoxValue()} cr. Al cerrar recibirás un lote de objetos base del registro (~50% / 100% / 150% del valor).`:"Mínimo 1 objeto, máximo 10. Solo base (no síntesis).";
}
function openExchangePicker(){
  if(exchangeBusy)return;
  if(exchangeBoxCount()>=10)return toast("La caja ya tiene 10 unidades.",true);
  try{
    pickerMode="exchangeInput";pickerSlot=null;pickerFilter="Todos";pickerPage=1;
    if($("pickerSearch"))$("pickerSearch").value="";
    if($("pickerTitle"))$("pickerTitle").textContent="▤ CAJA DE INTERCAMBIO";
    if($("pickerDescription"))$("pickerDescription").textContent="Elige objetos base para la caja (máx. 10 unidades en total).";
    if($("pickerFilterMenu"))$("pickerFilterMenu").classList.remove("hidden");
    if($("pickerFilterLabel"))$("pickerFilterLabel").textContent=pickerFilter;
    const modal=$("inventoryPicker");
    if(modal)modal.classList.remove("hidden");
    renderPicker();
  }catch(err){console.error(err);toast("Error al abrir caja: "+err.message,true)}
}



function openPrintFuelQtyModal(itemId,maxQty){
  const x=state.inventory.find(i=>i.id===itemId);
  if(!x||maxQty<1)return;
  let qty=1;
  const modal=$("exchangeQtyModal");
  if(!modal)return;
  if($("exchangeQtyTitle"))$("exchangeQtyTitle").textContent="CANTIDAD · APORTE";
  const itemEl=$("exchangeQtyItem");
  if(itemEl)itemEl.innerHTML=`<span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><div style="min-width:0;flex:1"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)} · Máx. aporte ×${maxQty}</small></div>`;
  const sync=()=>{if($("exchangeQtyVal"))$("exchangeQtyVal").textContent="×"+qty;if($("exchangeQtyHint"))$("exchangeQtyHint").innerHTML=`Se añadirán <b>${qty}</b> unidad${qty===1?"":"es"} a la caja de aporte (${formatCredits(printItemValue(x)*qty,12)}).`;};
  sync();
  if($("exchangeQtyMinus"))$("exchangeQtyMinus").onclick=()=>{qty=Math.max(1,qty-1);sync()};
  if($("exchangeQtyPlus"))$("exchangeQtyPlus").onclick=()=>{qty=Math.min(maxQty,qty+1);sync()};
  const close=()=>modal.classList.add("hidden");
  if($("exchangeQtyClose"))$("exchangeQtyClose").onclick=close;
  if($("exchangeQtyCancel"))$("exchangeQtyCancel").onclick=close;
  if($("exchangeQtyOk"))$("exchangeQtyOk").onclick=()=>{
    const existing=printFuel.find(f=>f.id===x.id);
    const already=existing?existing.qty:0;
    if(already+qty>x.qty){toast("No hay suficientes.",true);return;}
    if(existing)existing.qty+=qty;
    else printFuel.push({id:x.id,name:x.name,qty:qty,val:x.val,r:x.r,cat:x.cat,icon:x.icon});
    close();renderPrintMachine();sound(500);
  };
  modal.classList.remove("hidden");
}

function openExchangeQtyModal(itemId,maxQty){
  const x=state.inventory.find(i=>i.id===itemId);
  if(!x||maxQty<1)return;
  let qty=1;
  const modal=$("exchangeQtyModal");
  if(!modal)return;
  const itemEl=$("exchangeQtyItem");
  if(itemEl)itemEl.innerHTML=`<span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><div style="min-width:0;flex:1"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)} · Disponible ×${x.qty} · Máx. ×${maxQty}</small></div>`;
  const sync=()=>{if($("exchangeQtyVal"))$("exchangeQtyVal").textContent="×"+qty;if($("exchangeQtyHint"))$("exchangeQtyHint").textContent=`Se añadirán ${qty} unidad${qty===1?"":"es"} a la caja (${exchangeBoxCount()+qty}/10).`;};
  sync();
  if($("exchangeQtyMinus"))$("exchangeQtyMinus").onclick=()=>{qty=Math.max(1,qty-1);sync()};
  if($("exchangeQtyPlus"))$("exchangeQtyPlus").onclick=()=>{qty=Math.min(maxQty,qty+1);sync()};
  const close=()=>modal.classList.add("hidden");
  if($("exchangeQtyClose"))$("exchangeQtyClose").onclick=close;
  if($("exchangeQtyCancel"))$("exchangeQtyCancel").onclick=close;
  if($("exchangeQtyOk"))$("exchangeQtyOk").onclick=()=>{
    const already=Number(exchangeBox[itemId]||0);
    const room=10-exchangeBoxCount();
    const add=Math.min(qty,maxQty,room);
    if(add<=0){toast("No cabe más en la caja.",true);close();return}
    exchangeBox[itemId]=already+add;
    close();
    renderExchangeModule();
    sound(500);
  };
  modal.classList.remove("hidden");
  sound(400,.05,"sine");
}

function runExchange(){
  if(exchangeBusy||exchangeBoxCount()<1)return;
  const inputVal=exchangeBoxValue();
  if(inputVal<=0)return toast("La caja no tiene valor.",true);
  const consumed=[];
  for(const [id,qty] of Object.entries(exchangeBox)){
    const x=state.inventory.find(i=>i.id===id);
    if(!x||x.qty<qty){toast("Faltan objetos en el inventario.",true);return}
    consumed.push({name:x.name,qty,val:Math.max(1,Number(x.val)||Number(info(x.name).val)||1)});
  }
  // Pool ANTES de consumir
  let pool=[...new Set([...(state.seen||[]),...Object.keys(state.discovered||{}),...consumed.map(c=>c.name)])]
    .filter(n=>{
      const d=info(n);
      if(!d||!d.cat)return false;
      if(isSynthesisItem({name:n,...d}))return false;
      if(["Criatura","Órgano","Pieza","Anomalía"].includes(d.cat))return false;
      if(d.illegal||d.trait==="Ilegal")return false;
      return ["Material","Lingote","Consumible","Herramienta","Arma","Equipo"].includes(d.cat);
    });
  if(!pool.length){
    // Fallback: materiales básicos del catálogo
    pool=Object.keys(itemDB).filter(n=>{const d=itemDB[n];return d&&d.cat==="Material"&&!d.illegal&&(d.r||1)<=2});
  }
  if(!pool.length){toast("No hay objetos base disponibles para el intercambio.",true);return}
  for(const [id,qty] of Object.entries(exchangeBox)){
    if(!removeItemById(id,qty)){toast("Error al consumir la caja.",true);return}
  }
  exchangeBox={};
  exchangeBusy=true;
  renderExchangeModule();
  const roll=Math.random();
  const mult=roll<0.33?0.5:roll<0.66?1:1.5;
  let targetVal=mult===1?inputVal:Math.max(1,Math.round(inputVal*mult));
  // Rellenar EXACTO al valor objetivo (50% / 100% / 150%)
  const unitOf=n=>Math.max(1,Number(info(n).val)||1);
  function packExact(target,names){
    const out={}; let left=target; let guard=0;
    const sorted=names.slice().sort((a,b)=>unitOf(a)-unitOf(b));
    while(left>0&&guard++<600){
      let fit=sorted.filter(n=>unitOf(n)<=left);
      if(!fit.length){
        // Relleno forzado con el más barato (ajustar unidades)
        const cheap=sorted[0]||names[0];
        if(!cheap)break;
        const u=unitOf(cheap);
        // si no cabe exacto, sumar y recortar otras entradas
        out[cheap]=(out[cheap]||0)+1;
        left-=u;
        if(left<0){
          // sobrepaso: intentar equilibrar quitando items caros
          left=0;
        }
        break;
      }
      // Preferir unidades que dividen el resto
      const divs=fit.filter(n=>left%unitOf(n)===0);
      const pick=(divs.length?divs:fit)[Math.floor(Math.random()*(divs.length?divs.length:fit.length))];
      out[pick]=(out[pick]||0)+1;
      left-=unitOf(pick);
    }
    // Si quedó resto por valores que no dividen, completar con el item de menor valor
    if(left>0){
      const cheap=sorted[0]||names[0];
      if(cheap){
        const u=unitOf(cheap);
        if(u===1){out[cheap]=(out[cheap]||0)+left;left=0;}
        else{
          // Añadir unidades hasta igualar o superar y luego aceptar solo si exacto
          while(left>0){out[cheap]=(out[cheap]||0)+1;left-=u;}
        }
      }
    }
    // Calcular valor real; si no coincide, reconstruir solo con el item más barato
    let total=Object.entries(out).reduce((s,[n,q])=>s+unitOf(n)*q,0);
    if(total!==target&&sorted.length){
      const cheap=sorted[0];
      const u=unitOf(cheap);
      if(target%u===0){
        return {[cheap]:target/u};
      }
      // Buscar combinación: item barato + ajustes
      // Último recurso: usar Hojas/Ramas/Madera si val 1-2
      const pads=["Hojas","Ramas","Madera","Resina","Piedra","Carbón"].filter(n=>names.includes(n)||info(n).cat==="Material");
      const pad=pads.find(n=>unitOf(n)===1)||pads[0]||cheap;
      const pu=unitOf(pad);
      if(target%pu===0)return {[pad]:Math.max(1,target/pu)};
      // Forzar: floor + remainder with next pad of 1 if exists in itemDB
      const ones=Object.keys(itemDB).filter(n=>itemDB[n].cat==="Material"&&Math.max(1,Number(itemDB[n].val)||1)===1);
      const one=ones[0];
      if(one){
        const main=cheap;
        const mu=unitOf(main);
        const mainQty=Math.floor(target/mu);
        const rest=target-mainQty*mu;
        const o={};
        if(mainQty>0)o[main]=mainQty;
        if(rest>0)o[one]=rest;
        return o;
      }
      return {[cheap]:Math.max(1,Math.round(target/u))};
    }
    return out;
  }
  const outItems=packExact(targetVal,pool);
  const filled=Object.entries(outItems).reduce((s,[n,q])=>s+unitOf(n)*q,0);
  exchangePending={inputVal,outVal:filled,mult,items:outItems};
  let modal=$("exchangeResultModal");
  if(!modal){
    modal=document.createElement("div");
    modal.id="exchangeResultModal";
    modal.className="modal-backdrop";
    modal.innerHTML='<div class="modal"><div class="modal-head"><h3>▣ RESULTADO DEL INTERCAMBIO</h3></div><div id="exchangeResultBody"></div></div>';
    document.body.appendChild(modal);
  }
  modal.classList.remove("hidden");
  const body=$("exchangeResultBody");
  if(body)body.innerHTML=`<div class="exchange-anim">▣ Empaquetando intercambio…</div>`;
  sound(200,.08,"sine");
  setTimeout(()=>{
    if(!exchangePending)return;
    const p=exchangePending;
    const lines=Object.entries(p.items).map(([n,q])=>`<div class="exchange-row"><span class="item-icon">${itemIconMarkup(n,info(n).icon)}</span><div><b>${escapeHtml(n)}</b><small>×${q} · ${Math.max(1,Number(info(n).val)||1)} cr./u</small></div></div>`).join("");
    const ratio=p.inputVal?p.outVal/p.inputVal:1;
    const outcome=ratio>=1.4?'<span class="cyan">Ganancia (+50%)</span>':ratio<=0.6?'<span class="red">Pérdida (−50%)</span>':'<span class="gold">Neutro</span>';
    if(body)body.innerHTML=`
      <div class="statline"><span>Valor entregado</span><b class="gold">${p.inputVal} cr.</b></div>
      <div class="statline"><span>Valor recibido</span><b class="gold">${p.outVal} cr.</b></div>
      <div class="statline"><span>Resultado</span><b>${outcome}</b></div>
      <div class="section-title" style="margin-top:12px"><h3>CONTENIDO DE LA CAJA</h3></div>
      <div class="exchange-result-list">${lines}</div>
      <button class="primary" id="exchangeClaimBtn" style="width:100%;margin-top:14px">⇢ Reclamar objetos</button>`;
    const claim=$("exchangeClaimBtn");
    if(claim)claim.onclick=claimExchangeResult;
    sound(520,.1,"triangle");
  },1600);
}
function claimExchangeResult(){
  if(!exchangePending)return;
  const p=exchangePending;
  Object.entries(p.items).forEach(([n,q])=>addItem(n,q,{origin:"intercambio"}));
  log(`Intercambio: entregaste ${p.inputVal} cr. y recibiste ${p.outVal} cr. en objetos base.`);
  toast(`Intercambio reclamado · ${p.outVal} cr. en objetos`);
  exchangePending=null;
  exchangeBusy=false;
  if($("exchangeResultModal"))$("exchangeResultModal").classList.add("hidden");
  renderExchangeModule();render();save();
  sound(700,.12,"triangle");
}


function refineChancePct(){return Math.min(100,20+Math.max(0,refineDustQty)*5)}
function countDust(){return count("Polvo de Refinita")}
function renderRefineMachine(){
  const inItem=refineInputId?state.inventory.find(i=>i.id===refineInputId):null;
  if(refineInputId&&!inItem){refineInputId=null}
  if(inItem&&isItemEquipped(inItem.id)){refineInputId=null}
  const pick=$("refineInputPick"),infoEl=$("refineInputInfo"),clr=$("refineInputClear");
  if(pick){
    if(inItem)pick.innerHTML=`<span class="item-icon">${itemIconMarkup(inItem.name,inItem.icon||info(inItem.name).icon)}</span> ${escapeHtml(inventoryDisplayName(inItem))}`;
    else pick.textContent="＋ Elegir objeto";
  }
  if(infoEl)infoEl.textContent=inItem?`N${inItem.r||1} · ${inItem.cat||"?"} · ${Math.max(1,Number(inItem.val)||Number(info(inItem.name).val)||1)} cr.`:"Ningún objeto.";
  if(clr)clr.classList.toggle("hidden",!inItem||refineBusy||!!refinePending);
  const dustInv=countDust();
  refineDustQty=Math.min(refineDustQty,dustInv,16);
  if($("refineDustInv"))$("refineDustInv").textContent=String(dustInv);
  if($("refineDustUse"))$("refineDustUse").textContent=String(refineDustQty);
  if($("refineDustQty"))$("refineDustQty").textContent="×"+refineDustQty;
  const pct=((refineBusy||refinePending)&&refineChanceLocked!==null)?refineChanceLocked:refineChancePct();
  const chanceLabel=$("refineChanceLabel");
  if(chanceLabel){
    chanceLabel.textContent=pct+"%";
    chanceLabel.style.color=pct>=50?"#00e676":pct>=25?"#ff7900":"#ff3b54";
    chanceLabel.style.textShadow=pct>=50?"0 0 12px #00e67666":pct>=25?"0 0 12px #ff790066":"0 0 10px #ff3b5466";
  }
  const btn=$("refineStartBtn");
  if(btn)btn.disabled=refineBusy||!inItem||!!activeTask||!!currentEnemy||!!refinePending;
  const out=$("refineOutputSlot"),tInfo=$("refineTargetInfo"),claim=$("refineClaimBtn");
  if(refinePending){
    const p=refinePending;
    if(out)out.innerHTML=`<span class="item-icon">${itemIconMarkup(p.name,info(p.name).icon)}</span> ${escapeHtml(p.name)}${p.qty>1?" ×"+p.qty:""}`;
    if(tInfo)tInfo.textContent=p.ok?`Éxito · ${Math.max(1,Number(info(p.name).val)||1)} cr.`:`Fallo · Polvo de Refinita`;
    if(claim)claim.classList.remove("hidden");
  }else{
    if(out)out.textContent="— Esperando resultado —";
    if(tInfo)tInfo.textContent="Aquí aparecerá el resultado al terminar el proceso.";
    if(claim)claim.classList.add("hidden");
  }
  if($("refineStatus")&&!refineBusy&&!refinePending)$("refineStatus").textContent="En espera";
}
function openRefineInputPicker(){
  if(refineBusy)return;
  if(refinePending)return toast("Reclama el resultado pendiente primero.",true);
  try{
    pickerMode="refineInput";pickerSlot=null;pickerFilter="Todos";pickerPage=1;
    if($("pickerSearch"))$("pickerSearch").value="";
    if($("pickerTitle"))$("pickerTitle").textContent="▤ REFINADORA · ENTRADA";
    if($("pickerDescription"))$("pickerDescription").textContent="Objeto a refinar (no equipado, no síntesis, no polvo).";
    if($("pickerFilterMenu"))$("pickerFilterMenu").classList.remove("hidden");
    if($("pickerFilterLabel"))$("pickerFilterLabel").textContent=pickerFilter;
    const modal=$("inventoryPicker");
    if(modal)modal.classList.remove("hidden");
    renderPicker();
  }catch(err){console.error(err);toast("Error al abrir selector: "+err.message,true)}
}

function openRefineTargetPicker(){/* salida automática — sin selector */}
function startRefine(){
  if(refineBusy||refinePending)return;
  const item=state.inventory.find(i=>i.id===refineInputId);
  if(!item)return;
  if(isItemEquipped(item.id))return toast("Desequipa el objeto primero.",true);
  if(isSynthesisItem(item)||isRefineDust(item))return toast("Objeto no válido para refinar.",true);
  const inVal=Math.max(1,Number(item.val)||Number(info(item.name).val)||1);
  const dustNeed=refineDustQty;
  if(dustNeed>countDust())return toast("No tienes suficiente Polvo de Refinita.",true);
  const pct=refineChancePct();
  refineChanceLocked=pct;
  if(!removeItemById(item.id,1)){refineChanceLocked=null;return toast("Error al consumir la entrada.",true);}
  if(dustNeed>0)take("Polvo de Refinita",dustNeed);
  refineBusy=true;refineInputId=null;
  if($("refineBarFill"))$("refineBarFill").style.width="0%";
  if($("refineStatus"))$("refineStatus").textContent="Refinando…";
  if($("refineArrow"))$("refineArrow").textContent="⟶";
  if($("refineOutputSlot"))$("refineOutputSlot").textContent="…";
  renderRefineMachine();
  sound(300,.08,"sine");
  const t0=Date.now();const dur=5000;
  const tick=()=>{
    if(!refineBusy)return;
    const p=Math.min(1,(Date.now()-t0)/dur);
    if($("refineBarFill"))$("refineBarFill").style.width=(p*100)+"%";
    if(p<1){requestAnimationFrame(tick);return}
    const win=Math.random()*100<pct;
    if(win){
      // Candidatos calculados desde la misma fuente que dibuja la pestaña Registro Base.
      // Se excluyen todos los tipos "Otro", polvo y objetos de Síntesis.
      const pool=getRefineryRegistryCandidates(inVal);
      const name=pool.length?pool[Math.floor(Math.random()*pool.length)].name:null;
      if(!name){
        // Si no existe un candidato registrado de mayor valor, se considera fallo:
        // la recompensa es Polvo de Refinita, nunca un objeto no descubierto.
        refinePending={ok:false,name:"Polvo de Refinita",qty:1};
      }else{
        state.achievements=state.achievements||{};state.achievements.refine_success=true;
        refinePending={ok:true,name,qty:1,sourceVal:inVal};
      }
      if($("refineStatus"))$("refineStatus").textContent=refinePending.ok?"Éxito · listo":"Sin candidatos · polvo";
      if($("refineResult"))$("refineResult").innerHTML=refinePending.ok?`<span class="cyan">Éxito (${pct}%).</span> Reclama el resultado.`:`<span class="red">Sin objeto superior.</span> Polvo listo.`;
      sound(720,.15,"triangle");
    }else{
      refinePending={ok:false,name:"Polvo de Refinita",qty:1};
      if($("refineStatus"))$("refineStatus").textContent="Fallo · polvo listo";
      if($("refineResult"))$("refineResult").innerHTML=`<span class="red">Fallo (${100-pct}%).</span> Obtienes <b>Polvo de Refinita</b>.`;
      sound(140,.2,"sawtooth");
    }
    refineBusy=false;
    // La probabilidad y el polvo seleccionado se conservan hasta reclamar el resultado.
    renderRefineMachine();save();
  };
  requestAnimationFrame(tick);
}
function claimRefine(){
  if(!refinePending)return;
  let p=refinePending;
  // Segunda validación justo antes de entregar: el resultado debe seguir apareciendo
  // en Registro Base y conservar un valor superior al objeto consumido.
  if(p.ok){
    const allowed=getRefineryRegistryCandidates(p.sourceVal);
    if(!allowed.some(item=>item.name===p.name))p={ok:false,name:"Polvo de Refinita",qty:1};
  }
  addItem(p.name,p.qty,{origin:"refinadora"});
  toast(p.ok?`Refinado: ${p.name}`:`+${p.qty}× Polvo de Refinita`);
  log(`Refinadora: ${p.ok?"éxito":"fallo"} → <b>${escapeHtml(p.name)}</b>.`);
  refinePending=null;refineTargetName=null;
  refineDustQty=0;refineChanceLocked=null;
  if($("refineBarFill"))$("refineBarFill").style.width="0%";
  if($("refineResult"))$("refineResult").textContent="";
  if($("refineStatus"))$("refineStatus").textContent="En espera";
  renderRefineMachine();render();save();sound(600,.1,"triangle");
}




// === CENTRO: ASISTENTE · MISIONES · LOGROS ===
const ASSISTANT_TOPICS=[
 {id:"mision",label:"Misión principal"},
 {id:"explorar",label:"Exploración"},
 {id:"central",label:"La Central"},
 {id:"fusion",label:"Fusión"},
 {id:"nexus",label:"Centro"},
 {id:"mercado",label:"Mercado"},
 {id:"clinica",label:"Clínica"},
 {id:"equipo",label:"Equipo e inventario"},
 {id:"misiones",label:"Misiones y logros"}
];
const ASSISTANT_TEXT={
 mision:"Tu misión principal es reunir recursos, sintetizar materiales y fabricar hasta poder generar anomalías. Cada anomalía es un hito: demuestra que controlas la materia inestable del Colapso. Explora zonas, funde menas, sigue recetas y usa la Fusión cuando estés listo.",
 explorar:"En Exploración eliges una zona desbloqueada según tu nivel de Operador. Gastas tiempo de expedición y obtienes botín del listado de esa zona. A veces hay combate: si ganas conservas el botín; si caes, lo pierdes. Sube de nivel para abrir zonas más peligrosas y rentables.",
 central:"La Central concentra la Mesa de creación (recetas con nivel), el Horno (lingotes), Solicitar suministros y el Envío de suministro. Fabrica solo lo que tengas desbloqueado. Los suministros dan un empujón diario de recursos básicos.",
 fusion:"La Máquina de fusión combina dos objetos propios. Puede crear materiales nuevos, equipos o, en el caso clave, anomalías. Es experimental: el resultado depende de lo que combines. Crear tu primera anomalía es un logro del operador.",
 nexus:"El Centro de máquinas tiene tres módulos activos: Máquina de Mejora (ruleta de riesgo entre objetos base), Intercambio (caja 1–10 unidades por un lote del registro) y Refinadora (subir de valor con riesgo y Polvo de Refinita). Usa solo objetos base descubiertos.",
 mercado:"El Mercado legal vende materiales, lingotes y recetas sensatas por nivel. El Mercado negro trafica órganos sueltos, armas balísticas y contrabando. El diario rota stock; el catálogo exige nivel de Operador.",
 clinica:"En la Clínica extraes órganos de criaturas orgánicas (riesgo de fallo) y puedes sintetizar engendros. Todo lo orgánico lleva rasgo ilegal y se mueve en el mercado negro.",
 equipo:"El inventario muestra todo lo que posees. Las armas, herramientas y equipos equipados quedan marcados y no puedes gastarlos hasta desequiparlos. Mira el origen de los materiales: si salen de una zona, verás su nombre.",
 misiones:"Las misiones son entregas radiales e infinitas: siempre tres activas, solo con objetos que ya puedes obtener. Al completar una nace otra. Los logros son hitos difíciles con recompensa en créditos."
};
function ensureProgressMeta(){
 state.missions=state.missions||[];
 state.missionHistory=state.missionHistory||[];
 state.achievements=state.achievements||{};
}
function unlockedMaterialPool(){
 const names=new Set();
 (zones||[]).forEach(z=>{
   if(typeof zoneUnlocked==="function"&&!zoneUnlocked(z))return;
   (z.loot||[]).forEach(n=>names.add(n));
 });
 (recipes||[]).forEach(r=>{
   if(typeof recipeUnlocked==="function"&&!recipeUnlocked(r))return;
   if(r.out)names.add(r.out);
   Object.keys(r.cost||{}).forEach(n=>names.add(n));
 });
 // lingotes de menas conocidas
 Object.keys(itemDB||{}).forEach(n=>{
   const d=itemDB[n];
   if(!d||d.cat!=="Lingote")return;
   const base=n.replace(/^Lingote de /,"");
   const mena="Mena de "+base;
   if(names.has(mena)||names.has(n)||names.has(base))names.add(n);
 });
 return [...names].filter(n=>{
   const d=info(n);
   if(!d||!d.cat)return false;
   if(["Criatura","Órgano","Pieza","Anomalía"].includes(d.cat))return false;
   if(d.illegal)return false;
   return ["Material","Lingote","Consumible"].includes(d.cat);
 });
}
function generateMission(){
 ensureProgressMeta();
 const pool=unlockedMaterialPool();
 if(pool.length<1)return null;
 const needTypes=1+Math.floor(Math.random()*2); // 1-2 tipos
 const reqs=[];
 const used=new Set();
 for(let i=0;i<needTypes;i++){
   let tries=0,name=null;
   while(tries++<30){
     name=pool[Math.floor(Math.random()*pool.length)];
     if(!used.has(name))break;
   }
   if(!name||used.has(name))continue;
   used.add(name);
   const unit=Math.max(1,Number(info(name).val)||1);
   const qty=1+Math.floor(Math.random()*(unit<=5?4:2));
   reqs.push({name,qty});
 }
 if(!reqs.length)return null;
 const value=reqs.reduce((s,r)=>s+Math.max(1,Number(info(r.name).val)||1)*r.qty,0);
 const reward=Math.max(1,Math.ceil(value*1.25));
 const id="m_"+Date.now().toString(36)+"_"+Math.floor(Math.random()*9999);
 const titles=["Contrato de campo","Pedido de la Central","Suministro radial","Encargo de archivo","Ruta de recogida"];
 return {
   id,
   title:titles[Math.floor(Math.random()*titles.length)],
   reqs,
   reward,
   created:Date.now()
 };
}
function ensureMissions(){
 ensureProgressMeta();
 // Validar que siguen siendo obtenibles; si no, regenerar
 state.missions=state.missions.filter(m=>{
   const pool=new Set(unlockedMaterialPool());
   return m.reqs.every(r=>pool.has(r.name));
 });
 while(state.missions.length<3){
   const m=generateMission();
   if(!m)break;
   state.missions.push(m);
 }
}
function missionProgress(m){
 return m.reqs.map(r=>({...r,have:count(r.name),ok:count(r.name)>=r.qty}));
}
function canCompleteMission(m){return missionProgress(m).every(r=>r.ok)}
function completeMission(id){
 ensureMissions();
 const m=state.missions.find(x=>x.id===id);
 if(!m||!canCompleteMission(m))return toast("No cumples los requisitos.",true);
 for(const r of m.reqs){
   if(!take(r.name,r.qty))return toast("Faltan objetos.",true);
 }
 state.credits+=m.reward;
 state.missionHistory.push({id:m.id,reward:m.reward,at:Date.now()});
 state.missions=state.missions.filter(x=>x.id!==id);
 const next=generateMission();
 if(next)state.missions.push(next);
 ensureMissions();
 toast(`Misión completada · +${m.reward} cr.`);
 log(`Misión completada: <b>${escapeHtml(m.title)}</b> · +${m.reward} créditos.`);
 sound(660,.12,"triangle");
 renderMissionsUI();render();save();
 trackAchievement("missions_done");
}
const ACHIEVEMENTS=[
 {id:"anomaly_fusion",name:"Anomaly Fusión",desc:"Crea tu primera anomalía en la Máquina de fusión.",reward:150,check:s=>!!s.achievements?.anomaly_fusion},
 {id:"first_explore",name:"Primera expedición",desc:"Completa al menos una exploración con botín.",reward:40,check:s=>(s.expeditions||0)>=1},
 {id:"level_5",name:"Operador N5",desc:"Alcanza el nivel de Operador 5.",reward:80,check:s=>(s.level||1)>=5},
 {id:"level_10",name:"Operador N10",desc:"Alcanza el nivel de Operador 10.",reward:120,check:s=>(s.level||1)>=10},
 {id:"missions_10",name:"Contratista radial",desc:"Completa 10 misiones de entrega.",reward:100,check:s=>(s.missionHistory||[]).length>=10},
 {id:"missions_25",name:"Logística del Colapso",desc:"Completa 25 misiones de entrega.",reward:200,check:s=>(s.missionHistory||[]).length>=25},
 {id:"smelt_5",name:"Fundidor",desc:"Funde 5 lingotes en el horno.",reward:60,check:s=>(s.stats?.smelted||0)>=5},
 {id:"craft_10",name:"Artesano de campo",desc:"Fabrica 10 objetos en la mesa de creación.",reward:90,check:s=>(s.stats?.crafted||0)>=10},
 {id:"refine_success",name:"Refinador",desc:"Completa un refinamiento exitoso en el Centro.",reward:70,check:s=>!!s.achievements?.refine_success},
 {id:"upgrade_success",name:"Mejora arriesgada",desc:"Gana una tirada en la Máquina de Mejora.",reward:70,check:s=>!!s.achievements?.upgrade_success},
 {id:"black_buy",name:"Contrabando",desc:"Compra un objeto en el mercado negro.",reward:50,check:s=>!!s.achievements?.black_buy},
 {id:"full_equip",name:"Operador armado",desc:"Equipa arma, herramienta y equipo a la vez.",reward:110,check:s=>{const e=s.equipped||{};return !!(e.weapon&&e.tool&&e.armor)}}
];
function trackAchievement(flag){
 ensureProgressMeta();
 if(flag&&!state.achievements[flag]){
   state.achievements[flag]=true;
 }
 // Auto-claim passive checks
 ACHIEVEMENTS.forEach(a=>{
   if(state.achievements[a.id+"_claimed"])return;
   let ok=false;
   try{ok=a.check(state)}catch(_){}
   if(ok&&!state.achievements[a.id+"_claimed"]){
     // mark unlocked for display; claim happens on open or auto
     state.achievements[a.id+"_ready"]=true;
   }
 });
}
function claimAchievement(id){
 ensureProgressMeta();
 const a=ACHIEVEMENTS.find(x=>x.id===id);
 if(!a)return;
 if(state.achievements[id+"_claimed"])return toast("Ya reclamado.",true);
 let ok=false;try{ok=a.check(state)}catch(_){}
 if(!ok)return toast("Logro no completado.",true);
 state.achievements[id+"_claimed"]=true;
 state.credits+=a.reward;
 toast(`Logro: ${a.name} · +${a.reward} cr.`);
 log(`Logro desbloqueado: <b>${escapeHtml(a.name)}</b> · +${a.reward} créditos.`);
 sound(800,.14,"triangle");
 renderAchievementsUI();render();save();
}
function renderMissionsUI(){
 ensureMissions();
 const box=$("missionsList");
 if(!box)return;
 box.innerHTML=state.missions.map(m=>{
   const prog=missionProgress(m);
   const can=prog.every(r=>r.ok);
   const reqHtml=prog.map(r=>`<span class="chip ${r.ok?"common":""}">${itemIconMarkup(r.name,info(r.name).icon)} ${escapeHtml(r.name)} ${r.have}/${r.qty}</span>`).join(" ");
   return `<div class="mission-card"><h4>${escapeHtml(m.title)}</h4><div class="loot-chips">${reqHtml}</div><div class="statline" style="margin-top:8px"><span>Recompensa</span><span class="mission-reward">${formatCredits(m.reward,14)}</span></div><button class="primary" style="width:100%;margin-top:10px" data-mission-complete="${m.id}" ${can?"":"disabled"}>Entregar</button></div>`;
 }).join("")||'<div class="empty">No hay misiones disponibles aún. Desbloquea zonas o recetas.</div>';
 box.querySelectorAll("[data-mission-complete]").forEach(b=>b.onclick=()=>completeMission(b.dataset.missionComplete));
 if($("missionsBadge"))$("missionsBadge").textContent=String(state.missions.length);
}
function renderAchievementsUI(){
 ensureProgressMeta();trackAchievement();
 const box=$("achievementsList");
 if(!box)return;
 box.innerHTML=ACHIEVEMENTS.map(a=>{
   let ok=false;try{ok=a.check(state)}catch(_){}
   const claimed=!!state.achievements[a.id+"_claimed"];
   return `<div class="ach-card ${claimed||ok?"done":""}"><h4>${escapeHtml(a.name)} ${claimed?"✓":ok?"●":""}</h4><p class="small-note">${escapeHtml(a.desc)}</p><div class="statline"><span>Recompensa</span><span class="ach-reward">${formatCredits(a.reward,14)}</span></div><button class="tiny" style="margin-top:8px" data-ach-claim="${a.id}" ${ok&&!claimed?"":"disabled"}>${claimed?"Reclamado":ok?"Reclamar":"Bloqueado"}</button></div>`;
 }).join("");
 box.querySelectorAll("[data-ach-claim]").forEach(b=>b.onclick=()=>claimAchievement(b.dataset.achClaim));
}
function assistantSay(text,who="bot"){
 const chat=$("assistantChat");if(!chat)return;
 const div=document.createElement("div");
 div.className="assistant-msg "+who;
 div.textContent=text;
 chat.appendChild(div);
 chat.scrollTop=chat.scrollHeight;
}
function openAssistant(){
 const modal=$("assistantModal");if(!modal)return;
 modal.classList.remove("hidden");
 const chat=$("assistantChat");
 if(chat)chat.innerHTML="";
 assistantSay("Operador, soy el Asistente AF. Puedo guiarte por cada sección del sistema. Tu misión principal: reunir recursos, sintetizar y crear anomalías.");
 const topics=$("assistantTopics");
 if(topics){
   topics.innerHTML=ASSISTANT_TOPICS.map(t=>`<button type="button" class="tiny" data-assistant-topic="${t.id}">${escapeHtml(t.label)}</button>`).join("");
   topics.querySelectorAll("[data-assistant-topic]").forEach(b=>b.onclick=()=>{
     const id=b.dataset.assistantTopic;
     const label=ASSISTANT_TOPICS.find(t=>t.id===id)?.label||id;
     assistantSay(label,"user");
     setTimeout(()=>assistantSay(ASSISTANT_TEXT[id]||"Sección en calibración."),280);
     sound(420,.05,"sine");
   });
 }
 sound(500,.08,"triangle");
}
function openMissions(){ensureMissions();renderMissionsUI();$("missionsModal")?.classList.remove("hidden");sound(480,.06,"sine")}
function openAchievements(){renderAchievementsUI();$("achievementsModal")?.classList.remove("hidden");sound(480,.06,"sine")}

function removeItemById(id,qty){
  const x=state.inventory.find(i=>i.id===id);
  if(!x||x.qty<qty)return false;
  x.qty-=qty;
  if(x.qty<=0)state.inventory=state.inventory.filter(i=>i.id!==id);
  return true;
}


// === CIUDAD · CASINO ===
const CITY_PLACES=[
 {id:"casino",name:"El Casino",iconKey:"casino",desc:"Mesas de azar y slots. Créditos y objetos en juego.",unlocked:true},
 {id:"lugar_b",name:"Lugar B",iconKey:"lock",desc:"Distrito sellado. Acceso restringido.",unlocked:false,req:"Bloqueado"},
 {id:"lugar_c",name:"Lugar C",iconKey:"lock",desc:"Distrito sellado. Acceso restringido.",unlocked:false,req:"Bloqueado"},
 {id:"lugar_d",name:"Lugar D",iconKey:"lock",desc:"Distrito sellado. Acceso restringido.",unlocked:false,req:"Bloqueado"},
 {id:"lugar_e",name:"Lugar E",iconKey:"lock",desc:"Distrito sellado. Acceso restringido.",unlocked:false,req:"Bloqueado"}
];
const SLOT_MONEY_SYMBOLS=[
 {id:"chip",iconKey:"chip",name:"Ficha",mult:2,weight:28},
 {id:"coin",iconKey:"coin",name:"Bolsa",mult:3,weight:22},
 {id:"gem",iconKey:"gem",name:"Gema",mult:5,weight:16},
 {id:"crown",iconKey:"crown",name:"Corona",mult:8,weight:10},
 {id:"seven",iconKey:"seven",name:"Siete",mult:12,weight:7},
 {id:"star",iconKey:"star",name:"Estrella",mult:20,weight:4},
 {id:"jackpot",iconKey:"jackpot",name:"Jackpot",mult:50,weight:1}
];
function renderCityPlaces(){
 const host=$("cityPlaces");
 if(!host)return;
 host.innerHTML=CITY_PLACES.map(p=>`
  <button type="button" class="city-place ${p.unlocked?"":"locked"}" data-city-place="${p.id}" ${p.unlocked?"":"disabled"}>
   <div class="place-ico">${hudIconMarkup(p.iconKey||"lock",28)}</div>
   <h4>${escapeHtml(p.name)}</h4>
   <p>${escapeHtml(p.desc)}</p>
   ${p.unlocked?"":`<span class="lock-tag">${hudIconMarkup("lock",12)} ${escapeHtml(p.req||"Bloqueado")}</span>`}
  </button>`).join("");
 host.querySelectorAll("[data-city-place]").forEach(b=>b.onclick=()=>{
  const id=b.dataset.cityPlace;
  const place=CITY_PLACES.find(x=>x.id===id);
  if(!place||!place.unlocked)return toast("Lugar bloqueado.",true);
  if(id==="casino")openCasino();
 });
}
function openCasino(){
 if($("cityPlaces"))$("cityPlaces").classList.add("hidden");
 if($("cityCasino"))$("cityCasino").classList.remove("hidden");
 if($("casinoTitleIcon"))$("casinoTitleIcon").innerHTML=hudIconMarkup("casino",26);
 if($("tabIcoMoney"))$("tabIcoMoney").innerHTML=hudIconMarkup("chip",18);
 if($("tabIcoItems"))$("tabIcoItems").innerHTML=hudIconMarkup("loot_boost",18);
 renderSlotMoneyPaytable();
 renderSlotPrizeBox();
 updateSlotBetsUI();
 ["slotMoneyGrid","slotItemGrid"].forEach(id=>{
  const grid=$(id); if(!grid)return;
  grid.querySelectorAll(".slot-cell").forEach(c=>{c.innerHTML=hudIconMarkup("question",28);c.classList.remove("spinning","win")});
 });
}
function closeCasino(){
 if($("cityCasino"))$("cityCasino").classList.add("hidden");
 if($("cityPlaces"))$("cityPlaces").classList.remove("hidden");
}
function renderSlotMoneyPaytable(){
 const host=$("slotMoneyPaytable");
 if(!host)return;
 host.innerHTML=SLOT_MONEY_SYMBOLS.slice().sort((a,b)=>a.mult-b.mult).map(s=>`
  <div class="paytable-row"><span class="sym">${hudIconMarkup(s.iconKey||s.id,24)}</span><span>${escapeHtml(s.name)}</span><b>×${s.mult}</b></div>
 `).join("");
}
function updateSlotBetsUI(){
 if($("slotMoneyBet"))$("slotMoneyBet").textContent=String(slotMoneyBet);
 if($("slotItemBet"))$("slotItemBet").textContent=String(slotItemBet);
 if($("slotMoneySpin"))$("slotMoneySpin").disabled=slotSpinning||slotMoneyBet<=0||state.credits<slotMoneyBet;
 if($("slotItemSpin"))$("slotItemSpin").disabled=slotSpinning||slotItemBet<=0||state.credits<slotItemBet;
}
function pickWeighted(list){
 const total=list.reduce((a,x)=>a+(x.weight||1),0);
 let r=Math.random()*total;
 for(const x of list){r-=(x.weight||1);if(r<=0)return x}
 return list[list.length-1];
}
function fillSlotGrid(gridId, symbols, spinning){
 const grid=$(gridId);
 if(!grid)return;
 grid.querySelectorAll(".slot-cell").forEach(cell=>{
  const s=symbols[Math.floor(Math.random()*symbols.length)];
  cell.innerHTML=typeof s==="string"?s:(s.icon||"?");
  cell.classList.toggle("spinning",!!spinning);
  cell.classList.remove("win");
 });
}
function setSlotPayline(gridId, three){
 const grid=$(gridId);
 if(!grid)return;
 [0,1,2].forEach((c,i)=>{
  const cell=grid.querySelector(`.slot-cell.payline[data-c="${c}"]`);
  if(!cell)return;
  const s=three[i];
  cell.innerHTML=typeof s==="string"?s:(s.html||s.icon||"?");
  cell.classList.remove("spinning");
 });
}
function animateSlot(gridId, duration, tickFn, done){
 const t0=Date.now();
 const tick=()=>{
  if(Date.now()-t0>=duration){done();return}
  tickFn();
  setTimeout(tick,70);
 };
 tick();
}
function spinMoneySlot(){
 if(slotSpinning)return;
 if(slotMoneyBet<=0)return toast("Elige una apuesta.",true);
 if(state.credits<slotMoneyBet)return toast("Créditos insuficientes.",true);
 slotSpinning=true;
 state.credits-=slotMoneyBet;
 ensureSkillsState();
 updateSlotBetsUI();renderStats();
 const resultEl=$("slotMoneyResult");
 if(resultEl)resultEl.textContent="Girando…";
 sound(220,.06,"square");
 // House edge: slightly bias toward low mult
 const pool=SLOT_MONEY_SYMBOLS;
 animateSlot("slotMoneyGrid",1600,()=>fillSlotGrid("slotMoneyGrid",pool.map(s=>hudIconMarkup(s.iconKey||s.id,28)),true),()=>{
  const line=[pickWeighted(pool),pickWeighted(pool),pickWeighted(pool)];
  // Extra house: 35% force mismatch if would have been triple high
  if(line[0].id===line[1].id&&line[1].id===line[2].id&&line[0].mult>=8&&Math.random()<0.35){
   line[2]=pickWeighted(pool.filter(s=>s.id!==line[0].id));
  }
  setSlotPayline("slotMoneyGrid", line.map(s=>({html:hudIconMarkup(s.iconKey||s.id,28)})));
  // Fill other rows random
  const grid=$("slotMoneyGrid");
  if(grid){
   grid.querySelectorAll(".slot-cell:not(.payline)").forEach(cell=>{
    const s=pickWeighted(pool);
    cell.innerHTML=hudIconMarkup(s.iconKey||s.id,28);
    cell.classList.remove("spinning");
   });
  }
  let payout=0;
  const a=line[0],b=line[1],c=line[2];
  if(a.id===b.id&&b.id===c.id){
   payout=Math.floor(slotMoneyBet*a.mult);
   grid.querySelectorAll(".slot-cell.payline").forEach(cell=>cell.classList.add("win"));
  }else if(a.id===b.id||b.id===c.id||a.id===c.id){
   const pair=a.id===b.id?a:(b.id===c.id?b:a);
   payout=Math.floor(slotMoneyBet*Math.max(0.5,pair.mult*0.25));
  }
  if(payout>0){
   state.credits+=payout;
   ensureSkillsState();
   state.creditsEarned=(Number(state.creditsEarned)||0)+payout;
   if(resultEl)resultEl.innerHTML=`<span class="cyan">Premio:</span> ${formatCredits(payout,14)} <span class="slot-result-icons">${hudIconMarkup(a.iconKey,18)}${hudIconMarkup(b.iconKey,18)}${hudIconMarkup(c.iconKey,18)}</span>`;
   toast(`+${payout} créditos`);
   sound(720,.12,"triangle");
  }else{
   if(resultEl)resultEl.innerHTML=`Sin premio. <span class="slot-result-icons">${hudIconMarkup(a.iconKey,18)}${hudIconMarkup(b.iconKey,18)}${hudIconMarkup(c.iconKey,18)}</span>`;
   toast("Sin premio",true);
   sound(140,.12,"sawtooth");
  }
  slotSpinning=false;
  updateSlotBetsUI();renderStats();save();
 });
}
function slotItemPool(){
 // Base registry items except Otro / Contrabando dust
 const names=[...new Set([...(state.seen||[]),...Object.keys(state.discovered||{}),...Object.keys(itemDB||{})])]
  .filter(n=>{
   const d=info(n);
   if(!d||!d.cat)return false;
   if(isSynthesisItem({name:n,...d}))return false;
   if(d.cat==="Otro"||d.cat==="Criatura"||d.refineDust)return false;
   if(["Material","Lingote","Herramienta","Arma","Equipo","Consumible","Anomalía","Órgano","Contrabando"].includes(d.cat))return true;
   return false;
  });
 // Prefer known; if few, use itemDB materials
 if(names.length<8){
  Object.keys(itemDB||{}).forEach(n=>{
   const d=itemDB[n];
   if(d&&["Material","Lingote","Consumible","Herramienta"].includes(d.cat)&&!names.includes(n))names.push(n);
  });
 }
 return names.map(n=>{
  const d=info(n);
  return {name:n,icon:d.icon||"❓",val:Math.max(1,Number(d.val)||1),r:d.r||1,cat:d.cat};
 });
}
function spinItemSlot(){
 if(slotSpinning)return;
 if(slotItemBet<=0)return toast("Elige una apuesta.",true);
 if(state.credits<slotItemBet)return toast("Créditos insuficientes.",true);
 const pool=slotItemPool();
 if(pool.length<3)return toast("Necesitas más objetos descubiertos en el registro.",true);
 slotSpinning=true;
 state.credits-=slotItemBet;
 updateSlotBetsUI();renderStats();
 const resultEl=$("slotItemResult");
 if(resultEl)resultEl.textContent="Girando…";
 sound(220,.06,"square");
 // Win chance scales with bet, house edge strong
 // bet 1 → ~18% win, bet 50 → ~42%, bet 100+ → ~48% cap
 const winChance=Math.min(0.48,0.16+Math.log10(slotItemBet+1)*0.14);
 const icons=pool.map(p=>itemIconMarkup(p.name,p.icon));
 animateSlot("slotItemGrid",1800,()=>{
  const grid=$("slotItemGrid");
  if(!grid)return;
  grid.querySelectorAll(".slot-cell").forEach(cell=>{
   const p=pool[Math.floor(Math.random()*pool.length)];
   cell.innerHTML=itemIconMarkup(p.name,p.icon);
   cell.classList.add("spinning");
   cell.classList.remove("win");
  });
 },()=>{
  const win=Math.random()<winChance;
  const grid=$("slotItemGrid");
  let line;
  if(win){
   // Value bias: higher bet → weight toward higher val items
   const maxVal=Math.max(...pool.map(p=>p.val));
   const target=Math.min(maxVal, Math.max(2, slotItemBet*(0.4+Math.random()*1.2)));
   const sorted=pool.slice().sort((a,b)=>Math.abs(a.val-target)-Math.abs(b.val-target));
   const pick=sorted[Math.floor(Math.random()*Math.min(6,sorted.length))];
   // 55% three of a kind visual for clarity, else mixed but still award pick
   if(Math.random()<0.55)line=[pick,pick,pick];
   else{
    const filler=pool[Math.floor(Math.random()*pool.length)];
    line=[pick,pick,filler];
   }
   setSlotPayline("slotItemGrid", line.map(p=>({html:itemIconMarkup(p.name,p.icon)})));
   grid&&grid.querySelectorAll(".slot-cell.payline").forEach(c=>c.classList.add("win"));
   slotPrizeBox.push({name:pick.name,qty:1});
   if(resultEl)resultEl.innerHTML=`<span class="cyan">Premio:</span> ${escapeHtml(pick.name)} (valor ${pick.val} cr.)`;
   toast(`Premio: ${pick.name}`);
   sound(720,.12,"triangle");
   renderSlotPrizeBox();
  }else{
   // XXX lose
   line=[{html:hudIconMarkup("fail",28)},{html:hudIconMarkup("fail",28)},{html:hudIconMarkup("fail",28)}];
   setSlotPayline("slotItemGrid", line);
   if(resultEl)resultEl.innerHTML=`Sin premio. <span class="slot-result-icons">${hudIconMarkup("fail",16)}${hudIconMarkup("fail",16)}${hudIconMarkup("fail",16)}</span>`;
   toast("Sin premio",true);
   sound(140,.12,"sawtooth");
  }
  if(grid){
   grid.querySelectorAll(".slot-cell:not(.payline)").forEach(cell=>{
    const p=pool[Math.floor(Math.random()*pool.length)];
    cell.innerHTML=itemIconMarkup(p.name,p.icon);
    cell.classList.remove("spinning");
   });
  }
  slotSpinning=false;
  updateSlotBetsUI();renderStats();save();
 });
}
function renderSlotPrizeBox(){
 const host=$("slotPrizeBox");
 const note=$("slotPrizeNote");
 const btn=$("slotPrizeClaim");
 if(!host)return;
 // merge counts
 const map={};
 slotPrizeBox.forEach(x=>{map[x.name]=(map[x.name]||0)+(x.qty||1)});
 const rows=Object.entries(map);
 host.innerHTML=rows.length?rows.map(([name,qty])=>{
  const d=info(name);
  return `<div class="prize-row"><span class="item-icon">${itemIconMarkup(name,d.icon)}</span><div style="flex:1;min-width:0"><b>${escapeHtml(name)}</b><small class="muted"> · ×${qty}</small></div></div>`;
 }).join(""):'<div class="empty">Sin premios pendientes.</div>';
 if(note)note.textContent=rows.length?`${rows.length} tipo(s) listos para reclamar.`:"Vacía.";
 if(btn)btn.disabled=!rows.length||slotSpinning;
}
function claimSlotPrizes(){
 if(!slotPrizeBox.length)return;
 const map={};
 slotPrizeBox.forEach(x=>{map[x.name]=(map[x.name]||0)+(x.qty||1)});
 Object.entries(map).forEach(([name,qty])=>addItem(name,qty,{origin:"casino"}));
 const names=Object.keys(map);
 log(`Casino · premios reclamados: <b>${names.join(", ")}</b>.`);
 toast(`Reclamado: ${names.join(", ")}`);
 slotPrizeBox=[];
 renderSlotPrizeBox();
 render();save();sound(600,.1,"triangle");
}
function bindCasinoUI(){
 if($("cityBackBtn"))$("cityBackBtn").onclick=closeCasino;
 document.querySelectorAll("[data-casino-tab]").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("[data-casino-tab]").forEach(x=>x.classList.toggle("active",x===b));
  document.querySelectorAll(".casino-section").forEach(x=>x.classList.toggle("active",x.id==="casino-"+b.dataset.casinoTab));
 });
 if($("slotMoneyBetMinus"))$("slotMoneyBetMinus").onclick=()=>{slotMoneyBet=Math.max(0,slotMoneyBet-1);updateSlotBetsUI()};
 if($("slotMoneyBetPlus"))$("slotMoneyBetPlus").onclick=()=>{slotMoneyBet=Math.min(state.credits,slotMoneyBet+1);updateSlotBetsUI()};
 if($("slotItemBetMinus"))$("slotItemBetMinus").onclick=()=>{slotItemBet=Math.max(0,slotItemBet-1);updateSlotBetsUI()};
 if($("slotItemBetPlus"))$("slotItemBetPlus").onclick=()=>{slotItemBet=Math.min(state.credits,slotItemBet+1);updateSlotBetsUI()};
 document.querySelectorAll("[data-bet-add]").forEach(b=>b.onclick=()=>{
  const n=Number(b.dataset.betAdd);
  if(n===0)slotMoneyBet=0; else slotMoneyBet=Math.min(state.credits,slotMoneyBet+n);
  updateSlotBetsUI();
 });
 document.querySelectorAll("[data-item-bet-add]").forEach(b=>b.onclick=()=>{
  const n=Number(b.dataset.itemBetAdd);
  if(n===0)slotItemBet=0; else slotItemBet=Math.min(state.credits,slotItemBet+n);
  updateSlotBetsUI();
 });
 if($("slotMoneySpin"))$("slotMoneySpin").onclick=spinMoneySlot;
 if($("slotItemSpin"))$("slotItemSpin").onclick=spinItemSlot;
 if($("slotPrizeClaim"))$("slotPrizeClaim").onclick=claimSlotPrizes;
}



// === RECICLADORA ===
let recycleInputId=null,recycleBusy=false,recycleBox=[];
function renderRecycleMachine(){
  const inItem=recycleInputId?state.inventory.find(i=>i.id===recycleInputId):null;
  if(recycleInputId&&!inItem)recycleInputId=null;
  const pick=$("recycleInputPick"),infoEl=$("recycleInputInfo"),clr=$("recycleInputClear");
  if(pick){
    if(inItem)pick.innerHTML=`<span class="item-icon">${itemIconMarkup(inItem.name,inItem.icon||info(inItem.name).icon)}</span> ${escapeHtml(inventoryDisplayName(inItem))}`;
    else pick.textContent="＋ Elegir objeto de síntesis";
  }
  if(infoEl)infoEl.innerHTML=inItem?`N${inItem.r||1} · ${inItem.cat||"?"} · ${formatCredits(Math.max(1,Number(inItem.val)||1),14)} · Síntesis`:"Ningún objeto.";
  if(clr)clr.classList.toggle("hidden",!inItem||recycleBusy||recycleBox.length>0);
  if($("recycleStartBtn"))$("recycleStartBtn").disabled=recycleBusy||!inItem||recycleBox.length>0||!!activeTask;
  const val=recycleBox.reduce((a,x)=>a+(Math.max(1,Number(info(x.name).val)||1)*(x.qty||1)),0);
  if($("recycleBoxValue"))$("recycleBoxValue").innerHTML=formatCredits(val,14);
  const list=$("recycleBoxList");
  if(list){
    if(!recycleBox.length)list.innerHTML='<div class="empty">Vacía.</div>';
    else{
      const map={};recycleBox.forEach(x=>{map[x.name]=(map[x.name]||0)+(x.qty||1)});
      list.innerHTML=Object.entries(map).map(([n,q])=>`<div class="prize-row"><span class="item-icon">${itemIconMarkup(n,info(n).icon)}</span><div><b>${escapeHtml(n)}</b><small> · ×${q}</small></div></div>`).join("");
    }
  }
  if($("recycleClaimBtn"))$("recycleClaimBtn").disabled=!recycleBox.length||recycleBusy;
  if($("recycleNote"))$("recycleNote").textContent=recycleBox.length?"Listo para reclamar.":"Vacía.";
  if($("recycleStatus")&&!recycleBusy)$("recycleStatus").textContent=recycleBox.length?"Completado":"En espera";
}
function openRecycleInputPicker(){
  if(recycleBusy||recycleBox.length)return toast("Reclama o espera el proceso.",true);
  pickerMode="recycleInput";pickerSlot=null;pickerFilter="Síntesis";pickerPage=1;
  if($("pickerSearch"))$("pickerSearch").value="";
  if($("pickerTitle"))$("pickerTitle").textContent="▤ RECICLADORA · SÍNTESIS";
  if($("pickerDescription"))$("pickerDescription").textContent="Solo objetos con rasgo Síntesis de convergencia (no criaturas).";
  if($("pickerFilterMenu"))$("pickerFilterMenu").classList.remove("hidden");
  if($("pickerFilterLabel"))$("pickerFilterLabel").textContent="Síntesis";
  $("inventoryPicker").classList.remove("hidden");renderPicker();
}
function recycleMaterialPool(){
  return Object.keys(itemDB).filter(n=>{
    const d=itemDB[n];
    return d&&(d.cat==="Material"||d.cat==="Lingote"||d.cat==="Consumible")&&!d.illegal&&n!=="Polvo de Refinita";
  }).map(n=>({name:n,val:Math.max(1,Number(itemDB[n].val)||1),r:itemDB[n].r||1}));
}
function buildRecycleLoot(targetVal){
  const pool=recycleMaterialPool().sort((a,b)=>a.val-b.val);
  if(!pool.length)return [{name:"Piedra",qty:1}];
  const out=[];
  let remaining=Math.max(1,Math.floor(targetVal*(0.85+Math.random()*0.3))); // ~85–115% del valor
  let guard=0;
  while(remaining>0&&guard++<20){
    const affordable=pool.filter(p=>p.val<=remaining);
    const pick=affordable.length?affordable[Math.floor(Math.random()*Math.min(affordable.length,8))]:pool[0];
    const maxQ=Math.max(1,Math.floor(remaining/Math.max(1,pick.val)));
    const qty=Math.min(maxQ,1+Math.floor(Math.random()*3));
    out.push({name:pick.name,qty});
    remaining-=pick.val*qty;
    if(remaining<3&&Math.random()<0.5)break;
  }
  // merge
  const map={};out.forEach(x=>{map[x.name]=(map[x.name]||0)+x.qty});
  return Object.entries(map).map(([name,qty])=>({name,qty}));
}
function startRecycle(){
  if(recycleBusy||recycleBox.length)return;
  const item=state.inventory.find(i=>i.id===recycleInputId);
  if(!item)return;
  if(!isSynthesisItem(item))return toast("Solo objetos de síntesis.",true);
  if(item.cat==="Criatura")return toast("No se pueden reciclar criaturas.",true);
  const val=Math.max(1,Number(item.val)||Number(info(item.name).val)||1);
  if(!removeItemById(item.id,1))return toast("Error al consumir.",true);
  recycleBusy=true;recycleInputId=null;
  if($("recycleBarFill"))$("recycleBarFill").style.width="0%";
  if($("recycleStatus"))$("recycleStatus").textContent="Reciclando…";
  if($("recycleArrow"))$("recycleArrow").textContent="⟶";
  renderRecycleMachine();sound(280,.08,"sine");
  const t0=Date.now(),dur=5000;
  const tick=()=>{
    if(!recycleBusy)return;
    const p=Math.min(1,(Date.now()-t0)/dur);
    if($("recycleBarFill"))$("recycleBarFill").style.width=(p*100)+"%";
    if(p<1){requestAnimationFrame(tick);return}
    recycleBox=buildRecycleLoot(val);
    recycleBusy=false;
    if($("recycleStatus"))$("recycleStatus").textContent="Completado";
    if($("recycleResult"))$("recycleResult").innerHTML=`<span class="cyan">Reciclaje listo.</span> Valor de origen ${val} cr.`;
    sound(620,.12,"triangle");
    renderRecycleMachine();save();
  };
  requestAnimationFrame(tick);
}
function claimRecycle(){
  if(!recycleBox.length||recycleBusy)return;
  recycleBox.forEach(x=>addItem(x.name,x.qty,{origin:"recicladora"}));
  const names=recycleBox.map(x=>`${x.qty}× ${x.name}`);
  log(`Recicladora: <b>${names.join(", ")}</b>.`);
  toast("Reciclaje reclamado");
  recycleBox=[];
  if($("recycleBarFill"))$("recycleBarFill").style.width="0%";
  if($("recycleResult"))$("recycleResult").textContent="";
  renderRecycleMachine();render();save();sound(560,.1,"triangle");
}




// === FÁBRICA ===
let dismantleRobotId=null,dismantleSelected={},dismantlePiecesPage=1;
let asmSelected={},asmAnomalyId=null;
function renderDismantleTable(){
 const host=$("dismantlePieceChoices");
 if(!host)return;
 const x=state.inventory.find(i=>i.id===dismantleRobotId);
 const icon=$("dismantleSlotIcon"),label=$("dismantleSlotLabel"),btn=$("dismantleStartBtn"),clearBtn=$("clearDismantleRobot");
 if(clearBtn){clearBtn.classList.toggle("hidden",!x);clearBtn.disabled=!!activeTask}
 if(!x){
  if(icon)icon.innerHTML="＋";
  if(label)label.textContent="Sin unidad";
  host.classList.remove('has-choices');if($('dismantleUnitArea'))$('dismantleUnitArea').classList.remove('has-choices');host.classList.remove('has-choices');if($('dismantleUnitArea'))$('dismantleUnitArea').classList.remove('has-choices');host.style.width='280px';host.style.display='block';host.innerHTML='<div class="empty" style="width:100%;box-sizing:border-box;margin:0;text-align:center;">Elige una criatura robótica del inventario.</div>';
  if(btn)btn.disabled=true;
  return;
 }
 if(icon)icon.innerHTML=itemIconMarkup(x.name,x.icon||info(x.name).icon);
 if(label)label.textContent=inventoryDisplayName(x)+" · N"+(x.r||1);
 if(!isRoboticCreature(x)){
  host.classList.remove('has-choices');host.innerHTML='<div class="empty">Esta criatura no es robótica: usa la Clínica para órganos.</div>';
  if(btn)btn.disabled=true;return;
 }
 const opts=pieceCandidatesForRobot(x);
 Object.keys(dismantleSelected).forEach(k=>{if(!opts.includes(k))delete dismantleSelected[k]});
 const selectedNames=Object.keys(dismantleSelected);
 const maxR=Math.max(1,Math.min(5,Number(x.r)||1));
 const globalChance=dismantleSuccessChance(selectedNames.length||1,maxR);
 const shown=opts; // sin paginación en la mesa
 
 host.innerHTML=shown.map(name=>{
  const on=!!dismantleSelected[name];
  const ic=itemIconMarkup(name,info(name).icon||"⚙️");
  return `<button type="button" class="extract-organ-opt ${on?"on":""}" data-piece="${escapeHtml(name)}"><span class="item-icon">${ic}</span><span>${escapeHtml(name)}</span></button>`;
 }).join("")||'<div class="empty">Sin piezas detectadas.</div>';
 host.classList.toggle('has-choices', !!shown.length);
 host.querySelectorAll("[data-piece]").forEach(b=>b.onclick=()=>{
  if(activeTask)return;
  const n=b.dataset.piece;
  if(dismantleSelected[n])delete dismantleSelected[n]; else dismantleSelected[n]=true;
  renderDismantleTable();
 });
 if(btn)btn.disabled=!selectedNames.length||!!activeTask;
 if($("dismantleMessage"))$("dismantleMessage").innerHTML=`Éxito global estimado: <b class="cyan">${globalChance}%</b> · Destornillador +${equippedDriverBonus()}%.`;
}
function startDismantle(){
 if(activeTask)return;
 const x=state.inventory.find(i=>i.id===dismantleRobotId);
 if(!x)return toast("Selecciona una unidad robótica.",true);
 if(!isRoboticCreature(x))return toast("Solo unidades robóticas.",true);
 const selected=Object.keys(dismantleSelected);
 if(!selected.length)return toast("Selecciona al menos una pieza.",true);
 const creatureName=x.name,creatureId=x.id,creatureLevel=Math.max(1,Math.min(5,Number(x.r)||1));
 const chance=dismantleSuccessChance(selected.length,creatureLevel);
 const pieceNames=selected.slice();
 beginTask("dismantle",10000,()=>{
  if(!takeById(creatureId,1)){toast("La unidad ya no está disponible.",true);return}
  if(Math.random()*100>=chance){
   dismantleSelected={};dismantleRobotId=null;
   log(`Desmontaje fallido sobre <b>${escapeHtml(creatureName)}</b>.`);
   toast("Desmontaje fallido",true);renderDismantleTable();save();return;
  }
  pieceNames.forEach(baseName=>{
   const r=Math.max(1,Math.min(5,creatureLevel));
   const val=Math.max(8,12+r*8+Math.floor(Math.random()*10));
   if(!itemDB[baseName])addGenerated(baseName,{icon:"⚙️",cat:"Pieza",r:1,val,desc:"Pieza robótica.",robotPart:true});
   addItem(baseName,1,{r,val,cat:"Pieza",robotPart:true,origin:"fabrica"});
  });
  log(`Desmontaje de <b>${escapeHtml(creatureName)}</b>: ${pieceNames.map(escapeHtml).join(", ")}.`);
  toast("Piezas recuperadas");
  dismantleSelected={};dismantleRobotId=null;renderDismantleTable();render();save();
 },{panel:$("dismantleProgress"),bar:$("dismantleBar"),percent:$("dismantlePercent"),status:null,button:$("dismantleStartBtn")});
}
function renderAssembleTable(){
 for(let i=0;i<5;i++){
  const id=asmSelected[i];
  const x=id?state.inventory.find(it=>it.id===id):null;
  const slot=$("asmSlot"+i);
  if(slot)slot.classList.toggle("filled",!!x);
  const icon=slot&&slot.querySelector(".slot-icon");
  if(icon)icon.innerHTML=x?itemIconMarkup(x.name,x.icon||info(x.name).icon):"＋";
  if($("asmLabel"+i))$("asmLabel"+i).textContent=x?inventoryDisplayName(x):("Pieza "+(i+1));
  const choose=$("chooseAsm"+i),clear=$("clearAsm"+i);
  if(choose){choose.textContent=x?"Cambiar":"Elegir";choose.disabled=!!activeTask}
  if(clear){clear.classList.toggle("hidden",!x);clear.disabled=!!activeTask}
 }
 const ax=asmAnomalyId?state.inventory.find(i=>i.id===asmAnomalyId):null;
 if($("asmAnomalyIcon"))$("asmAnomalyIcon").innerHTML=ax?itemIconMarkup(ax.name,ax.icon||info(ax.name).icon):"＋";
 if($("asmAnomalyLabel"))$("asmAnomalyLabel").textContent=ax?inventoryDisplayName(ax):"Anomalía (opcional)";
 if($("clearAsmAnomaly")){$("clearAsmAnomaly").classList.toggle("hidden",!ax);$("clearAsmAnomaly").disabled=!!activeTask}
 const filled=[0,1,2,3,4].every(i=>asmSelected[i]&&state.inventory.find(it=>it.id===asmSelected[i]));
 if($("asmStartBtn"))$("asmStartBtn").disabled=!filled||!!activeTask;
}
function startAssemble(){
 if(activeTask)return;
 const pieces=[];
 for(let i=0;i<5;i++){
  const it=state.inventory.find(x=>x.id===asmSelected[i]);
  if(!it||it.cat!=="Pieza")return toast("Necesitas 5 piezas robóticas.",true);
  pieces.push(it);
 }
 const anomaly=asmAnomalyId?state.inventory.find(x=>x.id===asmAnomalyId):null;
 if(asmAnomalyId&&!anomaly)return toast("Anomalía no disponible.",true);
 const ids=pieces.map(p=>p.id).concat(anomaly?[anomaly.id]:[]);
 beginTask("assemble",10000,()=>{
  for(const id of ids){if(!takeById(id,1)){toast("Faltan componentes.",true);return}}
  const avgR=Math.round(pieces.reduce((a,p)=>a+(Number(p.r)||1),0)/5);
  const r=Math.max(1,Math.min(5,avgR+(anomaly?1:0)));
  const val=Math.round(pieces.reduce((a,p)=>a+(Number(p.val)||10),0)*(anomaly?1.35:1.1));
  // Nombres propios (no ilegales). Con anomalía: serie "Núcleo anómalo"
  const baseNames=["Centinela de chasis","Vigía de engranajes","Operario de fase","Guardián de circuito","Patrulla de vacío"];
  const anomNames=["Centinela de fisura","Vigía de eco","Operario de umbral","Guardián de resonancia","Patrulla de distorsión"];
  const pool=anomaly?anomNames:baseNames;
  const seed=pieces.map(p=>p.name).join("|")+(anomaly?anomaly.name:"");
  let h=0;for(let i=0;i<seed.length;i++)h=(h*31+seed.charCodeAt(i))>>>0;
  const core=pool[h%pool.length];
  const name=anomaly?`${core} · N${r}`:`${core} · N${r}`;
  const trait=anomaly?"Núcleo anómalo":"Autómata";
  addGenerated(name,{icon:"🤖",cat:"Criatura",r,val,desc:`Unidad robótica ensamblada en Fábrica. Rasgo: ${trait}. No es contrabando.`,companion:true,robotic:true,trait,illegal:false});
  addItem(name,1,{r,val,cat:"Criatura",robotic:true,trait,illegal:false,origin:"fabrica"});
  log(`Ensamblaje: <b>${escapeHtml(name)}</b> (${trait}).`);
  toast(name);
  asmSelected={};asmAnomalyId=null;renderAssembleTable();render();save();
 },{panel:$("asmProgress"),bar:$("asmBar"),percent:$("asmPercent"),status:null,button:$("asmStartBtn")});
}



// === DESGUAZADORA ===
let scrapInputId=null,scrapBusy=false,scrapBox=[];
function findRecipeForItem(name){
  return (typeof recipes!=="undefined"?recipes:[]).find(r=>r&&r.out===name&&r.cost&&Object.keys(r.cost).length);
}
function isScrapEligible(item){
  if(!item||!item.name)return false;
  if(isItemEquipped(item.id))return false;
  const d=info(item.name);
  const cat=item.cat||d.cat||"";
  if(cat==="Criatura"||cat==="Órgano"||cat==="Pieza"||cat==="Anomalía"||cat==="Contrabando")return false;
  if(isBallisticWeapon(item.name,item))return false;
  // Must have a craft recipe with costs
  const rec=findRecipeForItem(item.name);
  if(rec)return true;
  // Lingotes: reverse to mena + carbon if smelt pattern
  if(cat==="Lingote"||/^Lingote de /.test(item.name))return true;
  // Origin fabricación hint
  if(item.origin==="fabricación"||item.origin==="fabricacion")return !!rec;
  return false;
}
function scrapOutputsFor(item){
  const rec=findRecipeForItem(item.name);
  if(rec&&rec.cost){
    return Object.entries(rec.cost).map(([name,qty])=>({name,qty:Math.max(1,Number(qty)||1)}));
  }
  // Lingote → Mena + Carbón
  const m=String(item.name).match(/^Lingote de (.+)$/i);
  if(m){
    const mena=`Mena de ${m[1]}`;
    const out=[{name:mena,qty:1}];
    if(itemDB["Carbón"]||itemDB["Carbon"]||true)out.push({name:itemDB["Carbón"]?"Carbón":"Carbón",qty:1});
    if(!itemDB[mena])addGenerated(mena,{icon:"⛏️",cat:"Material",r:Math.max(1,(item.r||1)-0),val:Math.max(4,(Number(item.val)||10)/2),desc:`Mineral bruto de ${m[1]}.`});
    return out;
  }
  return [];
}
function renderScrapMachine(){
  const inItem=scrapInputId?state.inventory.find(i=>i.id===scrapInputId):null;
  if(scrapInputId&&!inItem)scrapInputId=null;
  const pick=$("scrapInputPick"),infoEl=$("scrapInputInfo"),clr=$("scrapInputClear");
  if(pick){
    if(inItem)pick.innerHTML=`<span class="item-icon">${itemIconMarkup(inItem.name,inItem.icon||info(inItem.name).icon)}</span> ${escapeHtml(inventoryDisplayName(inItem))}`;
    else pick.textContent="＋ Elegir objeto";
  }
  if(infoEl){
    if(inItem){
      const outs=scrapOutputsFor(inItem);
      const preview=outs.map(o=>`<span class="scrap-mat">${itemIconMarkup(o.name,info(o.name).icon)} <b>×${o.qty}</b> ${escapeHtml(o.name)}</span>`).join(" ")||"—";
      infoEl.innerHTML=`N${inItem.r||1} · ${escapeHtml(inItem.cat||"?")} · ${formatCredits(Math.max(1,Number(inItem.val)||1),14)}<br><span class="muted">Devuelve:</span> <span class="scrap-mat-row">${preview}</span>`;
    } else infoEl.textContent="Ningún objeto.";
  }
  if(clr)clr.classList.toggle("hidden",!inItem||scrapBusy||scrapBox.length>0);
  if($("scrapStartBtn"))$("scrapStartBtn").disabled=scrapBusy||!inItem||scrapBox.length>0||!!activeTask;
  const list=$("scrapBoxList");
  if(list){
    if(!scrapBox.length)list.innerHTML='<div class="empty">Vacía.</div>';
    else{
      const map={};scrapBox.forEach(x=>{map[x.name]=(map[x.name]||0)+(x.qty||1)});
      list.innerHTML=Object.entries(map).map(([n,q])=>`<div class="prize-row"><span class="item-icon">${itemIconMarkup(n,info(n).icon)}</span><div><b>${escapeHtml(n)}</b><small> · ×${q}</small></div></div>`).join("");
    }
  }
  if($("scrapClaimBtn"))$("scrapClaimBtn").disabled=!scrapBox.length||scrapBusy;
  if($("scrapNote"))$("scrapNote").textContent=scrapBox.length?"Listo para reclamar.":"Vacía.";
  if($("scrapStatus")&&!scrapBusy)$("scrapStatus").textContent=scrapBox.length?"Completado":"En espera";
}
function openScrapInputPicker(){
  if(scrapBusy||scrapBox.length)return toast("Reclama o espera el proceso.",true);
  pickerMode="scrapInput";pickerSlot=null;pickerFilter="Todos";pickerPage=1;
  if($("pickerSearch"))$("pickerSearch").value="";
  if($("pickerTitle"))$("pickerTitle").textContent="⛓ DESGUAZADORA";
  if($("pickerDescription"))$("pickerDescription").textContent="Armas no balísticas, herramientas, equipo, lingotes y objetos con receta de fabricación.";
  if($("pickerFilterMenu"))$("pickerFilterMenu").classList.remove("hidden");
  $("inventoryPicker").classList.remove("hidden");renderPicker();
}
function startScrap(){
  if(scrapBusy||scrapBox.length)return;
  const item=state.inventory.find(i=>i.id===scrapInputId);
  if(!item)return;
  if(!isScrapEligible(item))return toast("Este objeto no se puede desguazar.",true);
  const outs=scrapOutputsFor(item);
  if(!outs.length)return toast("No hay plano de fabricación asociado.",true);
  if(!removeItemById(item.id,1)&&!takeById(item.id,1))return toast("Error al consumir.",true);
  scrapBusy=true;scrapInputId=null;
  if($("scrapBarFill"))$("scrapBarFill").style.width="0%";
  if($("scrapStatus"))$("scrapStatus").textContent="Desguazando…";
  if($("scrapArrow"))$("scrapArrow").textContent="⟶";
  renderScrapMachine();sound(260,.08,"sine");
  const t0=Date.now(),dur=5000;
  const tick=()=>{
    if(!scrapBusy)return;
    const p=Math.min(1,(Date.now()-t0)/dur);
    if($("scrapBarFill"))$("scrapBarFill").style.width=(p*100)+"%";
    if(p<1){requestAnimationFrame(tick);return}
    scrapBox=outs.map(o=>({name:o.name,qty:o.qty}));
    scrapBusy=false;
    if($("scrapStatus"))$("scrapStatus").textContent="Completado";
    if($("scrapResult"))$("scrapResult").innerHTML=`<span class="cyan">Desguace listo.</span> Materiales recuperados.`;
    sound(600,.12,"triangle");
    renderScrapMachine();save();
  };
  requestAnimationFrame(tick);
}
function claimScrap(){
  if(!scrapBox.length||scrapBusy)return;
  scrapBox.forEach(x=>addItem(x.name,x.qty,{origin:"desguace"}));
  log(`Desguazadora: <b>${scrapBox.map(x=>x.qty+"× "+x.name).join(", ")}</b>.`);
  toast("Materiales reclamados");
  scrapBox=[];
  if($("scrapBarFill"))$("scrapBarFill").style.width="0%";
  if($("scrapResult"))$("scrapResult").textContent="";
  renderScrapMachine();render();save();sound(560,.1,"triangle");
}




function applyHudCursors(){
  try{
    const finger='url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpath d=\'M12 28V14.5c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8V18h1.2V11c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v5.5h1.2V12c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v8.2c0 4.2-2.4 7.8-7.2 7.8H14c-1.1 0-2-.9-2-2z\' fill=\'%230d1a22\' stroke=\'%2353f2d1\' stroke-width=\'1.6\' stroke-linejoin=\'round\'/%3E%3Cpath d=\'M12 14.2V8.5c0-1.1.9-2 2-2s2 .9 2 2v5.7\' fill=\'none\' stroke=\'%2353f2d1\' stroke-width=\'1.6\'/%3E%3C/svg%3E") 10 4, pointer';
    document.querySelectorAll("input[type=range],#soundVolume,.settings-volume,.sidebar-scroll,aside.sidebar .sidebar-scroll").forEach(el=>{
      el.style.setProperty("cursor", finger, "important");
    });
    // WebKit range thumb
    const st=document.getElementById("hud-cursor-style");
    if(!st){
      const s=document.createElement("style");
      s.id="hud-cursor-style";
      s.textContent=`input[type=range],input[type=range]::-webkit-slider-thumb,input[type=range]::-moz-range-thumb,.sidebar-scroll{cursor:${finger} !important;}`;
      document.head.appendChild(s);
    }
  }catch(e){}
}

function fixSidebarScroll(){
  try{
    const sb=document.querySelector("aside.sidebar");
    const sc=document.querySelector("aside.sidebar .sidebar-scroll");
    if(!sb||!sc)return;
    const mobile=window.matchMedia("(max-width:900px)").matches||document.body.classList.contains("layout-mobile");
    if(mobile){
      // Quitar overrides PC y forzar oculto
      ["height","max-height","display","flex-direction","overflow","position","top"].forEach(p=>sb.style.removeProperty(p));
      ["flex","min-height","overflow-y","overflow-x","scrollbar-width","scrollbar-color"].forEach(p=>sc.style.removeProperty(p));
      sb.style.setProperty("display","none","important");
      return;
    }
    const top=sb.getBoundingClientRect().top;
    const h=Math.max(240, Math.floor(window.innerHeight - top - 16));
    sb.style.setProperty("height", h+"px", "important");
    sb.style.setProperty("max-height", h+"px", "important");
    sb.style.setProperty("display", "flex", "important");
    sb.style.setProperty("flex-direction", "column", "important");
    sb.style.setProperty("overflow", "hidden", "important");
    sc.style.setProperty("flex", "1 1 0%", "important");
    sc.style.setProperty("min-height", "0", "important");
    sc.style.setProperty("overflow-y", "auto", "important");
    sc.style.setProperty("overflow-x", "hidden", "important");
    sc.style.setProperty("scrollbar-width", "thin", "important");
    sc.style.setProperty("scrollbar-color", "#2ec4b0 #0a1218", "important");
    sc.style.colorScheme = "dark";
    try{applyHudCursors()}catch(e){}
  }catch(e){console.warn("fixSidebarScroll",e)}
}


// === IMPRESORA ===
let printTargetId=null,printFuel=[],printBusy=false,printOut=null;
function isPrintEligible(item){
  if(!item||!item.name||item.qty<=0)return false;
  if(isItemEquipped(item.id))return false;
  const cat=item.cat||info(item.name).cat||"";
  if(cat==="Criatura")return false;
  return true;
}
function printItemValue(item){
  return Math.max(1,Number(item.val)||Number(info(item.name).val)||1);
}
function printFuelTotal(){
  return printFuel.reduce((s,x)=>s+(printItemValue(x)*Math.max(1,Number(x.qty)||1)),0);
}
function printSuccessChance(){
  const t=printTargetId?state.inventory.find(i=>i.id===printTargetId):null;
  if(!t)return 0;
  const need=printItemValue(t);
  const have=printFuelTotal();
  if(need<=0)return 0;
  // Cap 100%. Exact match or above = 100%. Linear below.
  return Math.max(0,Math.min(100,Math.round((have/need)*100)));
}
function printChanceClass(pct){
  if(pct<=20)return "pct-low";
  if(pct<=49)return "pct-mid";
  return "pct-high";
}
function renderPrintMachine(){
  try{
    const ico=typeof hudIconMarkup==="function"?hudIconMarkup("printer",20):"";
    if($("printTitleIco")&&!$("printTitleIco").dataset.ready){$("printTitleIco").innerHTML=ico;$("printTitleIco").dataset.ready="1"}
    document.querySelectorAll('[data-hud-ico="printer"]').forEach(el=>{if(!el.dataset.ready){el.innerHTML=ico;el.dataset.ready="1"}});
    if($("printStartBtn")&&!$("printStartBtn").dataset.ico){
      $("printStartBtn").innerHTML=(ico?ico+" ":"")+"Imprimir · 5 s";
      $("printStartBtn").dataset.ico="1";
    }
  }catch(e){}

  const t=printTargetId?state.inventory.find(i=>i.id===printTargetId):null;
  if(printTargetId&&!t)printTargetId=null;
  const pick=$("printTargetPick"),infoEl=$("printTargetInfo"),clr=$("printTargetClear");
  if(pick){
    if(t)pick.innerHTML=`<span class="item-icon">${itemIconMarkup(t.name,t.icon||info(t.name).icon)}</span> ${escapeHtml(inventoryDisplayName(t))}`;
    else pick.textContent="＋ Elegir objeto";
  }
  if(infoEl){
    if(t){
      const syn=isSynthesisItem(t)?' · Síntesis':'';
      infoEl.innerHTML=`<span class="rarity r${Math.max(1,Math.min(5,Number(t.r)||1))}">N${t.r||1}</span> · ${escapeHtml(t.cat||"?")}${syn}<br>Valor base: ${formatCredits(printItemValue(t),14)}`;
    } else infoEl.textContent="Ningún objeto.";
  }
  if(clr)clr.classList.toggle("hidden",!t||printBusy||!!printOut);
  // fuel list
  const list=$("printFuelList");
  if(list){
    if(!printFuel.length)list.innerHTML='<div class="empty">Vacía.</div>';
    else list.innerHTML=printFuel.map((x,idx)=>{
      const v=printItemValue(x)*(x.qty||1);
      const r=Math.max(1,Math.min(5,Number(x.r)||1));
      return `<div class="print-fuel-row" style="display:flex;flex-direction:row;align-items:center;gap:10px;width:100%;box-sizing:border-box;padding:8px 10px;margin:0 0 6px;border:1px solid #2a3d48;border-radius:10px;background:#0c141a">
        <span class="item-icon" style="flex:0 0 28px;width:28px;height:28px;display:grid;place-items:center">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span>
        <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px">
          <b style="font-size:.85rem;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(inventoryDisplayName(x))}</b>
          <small style="opacity:.95"><span class="rarity r${r}">N${r}</span> · ×${x.qty||1} · ${formatCredits(v,12)}</small>
        </div>
        <button type="button" class="tiny print-fuel-rm" data-print-fuel-rm="${idx}" aria-label="Quitar" style="flex:0 0 36px;min-width:36px;height:36px">✕</button>
      </div>`;
    }).join("");
    list.querySelectorAll("[data-print-fuel-rm]").forEach(b=>b.onclick=()=>{
      if(printBusy||printOut)return;
      printFuel.splice(Number(b.dataset.printFuelRm),1);
      renderPrintMachine();
    });
  }
  const fuelVal=printFuelTotal();
  if($("printFuelValue"))$("printFuelValue").innerHTML=formatCredits(fuelVal,14);
  if($("printFuelClear"))$("printFuelClear").classList.toggle("hidden",!printFuel.length||printBusy||!!printOut);
  if($("printFuelAdd"))$("printFuelAdd").disabled=printBusy||!!printOut;
  const pct=printSuccessChance();
  const ch=$("printChance");
  if(ch){
    const cls=printChanceClass(pct);
    const col=cls==="pct-low"?"#ff2a3c":cls==="pct-mid"?"#ff8a00":"#1dff6a";
    ch.textContent=pct+"%";
    ch.className="print-chance "+cls;
    ch.style.cssText="font-size:2.4rem;font-weight:900;color:"+col+";text-shadow:0 0 18px "+col+"99;line-height:1.1;text-align:center;";
  }
  if($("printStartBtn"))$("printStartBtn").disabled=printBusy||!t||!printFuel.length||!!printOut||!!activeTask;
  // out
  const outList=$("printOutList");
  if(outList){
    if(!printOut)outList.innerHTML='<div class="empty">Vacía.</div>';
    else outList.innerHTML=`<div class="prize-row"><span class="item-icon">${itemIconMarkup(printOut.name,printOut.icon||info(printOut.name).icon)}</span><div><b>${escapeHtml(inventoryDisplayName(printOut))}</b><small> · ×${printOut.qty||1} · ${formatCredits(printItemValue(printOut),12)}</small></div></div>`;
  }
  if($("printClaimBtn"))$("printClaimBtn").disabled=!printOut||printBusy;
  if($("printNote"))$("printNote").textContent=printOut?"Copia lista.":"Vacía.";
  if($("printStatus")&&!printBusy)$("printStatus").textContent=printOut?"Completado":"En espera";
}
function openPrintTargetPicker(){
  if(printBusy||printOut)return toast("Reclama o espera el proceso.",true);
  pickerMode="printTarget";pickerSlot=null;pickerFilter="Todos";pickerPage=1;
  if($("pickerSearch"))$("pickerSearch").value="";
  if($("pickerTitle"))$("pickerTitle").innerHTML=(typeof hudIconMarkup==="function"?hudIconMarkup("printer",18)+" ":"")+"IMPRESORA · OBJETIVO";
  if($("pickerDescription"))$("pickerDescription").textContent="Elige el objeto a duplicar (no criaturas, no equipados).";
  if($("pickerFilterMenu"))$("pickerFilterMenu").classList.remove("hidden");
  $("inventoryPicker").classList.remove("hidden");renderPicker();
}
function openPrintFuelPicker(){
  if(printBusy||printOut)return;
  if(!printTargetId)return toast("Elige primero el objeto a duplicar.",true);
  pickerMode="printFuel";pickerSlot=null;pickerFilter="Todos";pickerPage=1;
  if($("pickerSearch"))$("pickerSearch").value="";
  if($("pickerTitle"))$("pickerTitle").innerHTML=(typeof hudIconMarkup==="function"?hudIconMarkup("printer",18)+" ":"")+"IMPRESORA · APORTE";
  if($("pickerDescription"))$("pickerDescription").textContent="Añade objetos para cubrir el valor del original. No criaturas.";
  if($("pickerFilterMenu"))$("pickerFilterMenu").classList.remove("hidden");
  $("inventoryPicker").classList.remove("hidden");renderPicker();
}
function startPrint(){
  if(printBusy||printOut)return;
  const t=state.inventory.find(i=>i.id===printTargetId);
  if(!t||!isPrintEligible(t))return toast("Objetivo no válido.",true);
  if(!printFuel.length)return toast("Añade aporte a la caja.",true);
  const pct=printSuccessChance();
  // Consume fuel items from inventory
  const fuelCopy=printFuel.map(x=>({...x}));
  for(const f of fuelCopy){
    const inv=state.inventory.find(i=>i.id===f.id);
    if(!inv||inv.qty<f.qty)return toast("Faltan objetos de aporte.",true);
  }
  for(const f of fuelCopy){
    if(!takeById(f.id,f.qty))return toast("Error al consumir aporte.",true);
  }
  printFuel=[];
  printBusy=true;
  if($("printBarFill"))$("printBarFill").style.width="0%";
  if($("printStatus"))$("printStatus").textContent="Imprimiendo…";
  if($("printArrow"))$("printArrow").textContent="⟶";
  renderPrintMachine();sound(280,.08,"sine");
  const t0=Date.now(),dur=5000;
  const tick=()=>{
    if(!printBusy)return;
    const p=Math.min(1,(Date.now()-t0)/dur);
    if($("printBarFill"))$("printBarFill").style.width=(p*100)+"%";
    if(p<1){requestAnimationFrame(tick);return}
    const ok=Math.random()*100<pct;
    printBusy=false;
    if(ok){
      // Duplicate with same stats
      const copy={
        name:t.name,qty:1,
        r:t.r,val:t.val,cat:t.cat||info(t.name).cat,
        icon:t.icon,desc:t.desc,
        trait:t.trait,affix:t.affix,secondaryTrait:t.secondaryTrait,
        origin:"impresora"
      };
      if(isSynthesisItem(t)){copy.affix=t.affix||"Síntesis de convergencia";}
      // preserve synthesis markers
      ["abilities","ability","damage","defense","gather","passive","ballistic","illegal","robotic"].forEach(k=>{if(t[k]!=null)copy[k]=t[k]});
      printOut=copy;
      if($("printResult"))$("printResult").innerHTML=`<span class="cyan">Impresión correcta (${pct}%).</span> Copia lista para reclamar.`;
      sound(620,.12,"triangle");
    }else{
      printOut=null;
      if($("printResult"))$("printResult").innerHTML=`<span class="red">Impresión fallida (${pct}%).</span> Se perdió el aporte. El original sigue en el inventario.`;
      sound(180,.12,"sawtooth");
    }
    if($("printStatus"))$("printStatus").textContent=ok?"Completado":"Fallido";
    if($("printBarFill"))$("printBarFill").style.width="100%";
    renderPrintMachine();save();
  };
  requestAnimationFrame(tick);
}
function claimPrint(){
  if(!printOut||printBusy)return;
  addItem(printOut.name,printOut.qty||1,{...printOut,origin:"impresora"});
  log(`Impresora: copia de <b>${escapeHtml(printOut.name)}</b>.`);
  toast("Copia reclamada");
  printOut=null;
  if($("printBarFill"))$("printBarFill").style.width="0%";
  if($("printResult"))$("printResult").textContent="";
  renderPrintMachine();render();save();sound(560,.1,"triangle");
}


function nav(page){
 // Combate activo: solo se permite volver a Exploración para no quedar atrapado fuera del HUD de combate
 if(currentEnemy){
  if(page!=="explore"&&page!=="supplies"){
   toast("Hay un combate en curso. Vuelve a Exploración para resolverlo.",true);
   return;
  }
  if(page==="supplies"){toast("Hay un combate en curso. Vuelve a Exploración para resolverlo.",true);return}
  // page === explore → permitir y reabrir el combate
 }
 const requestedSupplies=page==="supplies";if(requestedSupplies)page="central";document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));
if(page==="city"){closeCasino();renderCityPlaces();updateSlotBetsUI();}if(page==="skills")renderSkills();if(page==="stats")renderStats();document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));if(typeof closeMobileNavPanels==="function")closeMobileNavPanels();if(requestedSupplies){document.querySelectorAll("[data-central-tab]").forEach(b=>b.classList.toggle("active",b.dataset.centralTab==="supplies"));document.querySelectorAll("#page-central .central-section").forEach(x=>x.classList.toggle("active",x.id==="central-supplies"))}if(page==="clinic"){renderExtractTable();renderSpawnTable()}if(page==="factory"){renderDismantleTable();renderAssembleTable()}if(page==="nexus"){renderUpgradeMachine();renderExchangeModule();renderRefineMachine();renderRecycleMachine();renderScrapMachine();renderPrintMachine()}if(page==="market"){try{ensureMarketDay();renderMarketBuy(false);renderMarketBuy(true);renderMarketSell(false);renderMarketSell(true)}catch(err){console.error(err)}}
 // Si hay combate en curso, forzar HUD de zona + panel de combate visibles en Exploración
 if(currentEnemy&&page==="explore"){
  zoneHudOpen=true;
  const cp=$("combatPanel");
  if(cp)cp.classList.remove("hidden");
  if(selectedZone){renderZoneCards();renderZoneDetail();renderZoneLoot()}
 }
 window.scrollTo({top:0,behavior:state.settings.motion?"auto":"smooth"});render()}
function bindNavigation(){document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.page)));document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.goto)))}
function renderStats(){
 ensureSkillsState();
 if($("operatorRank"))$("operatorRank").textContent=operatorRank();
 if($("profileRank"))$("profileRank").textContent=operatorRank();
 if($("credits"))$("credits").innerHTML=creditsIconMarkup(14)+"<span>"+state.credits.toLocaleString("es-ES")+"</span>";
 if($("level"))$("level").textContent=state.level;
 const seenNames=[...new Set((state.seen||[]).filter(Boolean))];
 let baseCount=0,synthCount=0;
 seenNames.forEach(name=>{const item={name,...knownInfo(name)};if(isSynthesisItem(item))synthCount++;else baseCount++});
 if($("itemCountBase"))$("itemCountBase").textContent=baseCount;
 if($("itemCountSynth"))$("itemCountSynth").textContent=synthCount;
 if($("itemCount"))$("itemCount").textContent=baseCount+synthCount;
 if($("expCount"))$("expCount").textContent=state.expeditions;
 if($("fusionCount"))$("fusionCount").textContent=state.fusions;
 if($("activityLog"))$("activityLog").innerHTML=state.activity.length?state.activity.map(a=>`<div class="activity"><span class="muted">[${a.time}]</span> ${a.msg}</div>`).join(""):'<div class="empty">Sin actividad registrada. Tu historia empieza ahora.</div>';
 if($("profileLevel"))$("profileLevel").textContent=state.level;
 if($("xpText"))$("xpText").textContent=`${state.xp} / ${state.level*100} XP`;
 if($("xpBar"))$("xpBar").style.width=(state.xp/(state.level*100)*100)+"%";
 if($("statDamage"))$("statDamage").textContent=damage();
 if($("statDefense"))$("statDefense").textContent=defense();
 const gather=stat("gather")+skillBonus("gather");
 const luck=Math.max(0,(state.level-1)*2+stat("luck")+skillBonus("luck"));
 if($("statGather"))$("statGather").textContent=gather+"%";
 if($("statLuck"))$("statLuck").textContent=luck+"%";
 if($("statExtract"))$("statExtract").textContent=equippedExtractBonus()+"%";
 if($("statCredits"))$("statCredits").innerHTML=formatCredits(state.credits,14);
 // Estadísticas page
 if($("statsLevel"))$("statsLevel").textContent=state.level;
 if($("statsRank"))$("statsRank").textContent=operatorRank();
 if($("statsCreditsEarned"))$("statsCreditsEarned").innerHTML=formatCredits(state.creditsEarned||state.credits,14);
 if($("statsSkillPts"))$("statsSkillPts").textContent=String(state.skillPoints||0);
 if($("statsExpeditions"))$("statsExpeditions").textContent=state.expeditions||0;
 if($("statsFusions"))$("statsFusions").textContent=state.fusions||0;
 if($("statsAnomalies"))$("statsAnomalies").textContent=(state.stats&&state.stats.anomalies)||0;
 if($("statsMissions"))$("statsMissions").textContent=(state.missionHistory||[]).length;
 if($("statsCrafted"))$("statsCrafted").textContent=(state.stats&&state.stats.crafted)||0;
 if($("statsSmelted"))$("statsSmelted").textContent=(state.stats&&state.stats.smelted)||0;
 if($("statsRegBase"))$("statsRegBase").textContent=baseCount;
 if($("statsRegSynth"))$("statsRegSynth").textContent=synthCount;
 renderSkills();
}
function openZoneHud(zoneId){const target=zones.find(z=>z.id===zoneId);if(!target)return;if(!zoneUnlocked(target)){toast(`Zona bloqueada. Necesitas nivel ${zoneRequiredLevel(target)} de Operador.`,true);return}selectedZone=zoneId;zoneHudOpen=true;lootHudOpen=false;renderZoneCards();renderZoneDetail();renderZoneLoot();sound(470,.07,"triangle");window.scrollTo({top:0,behavior:state.settings.motion?"auto":"smooth"})}
function closeZoneHud(){if(activeTask&&activeTask.type==="explore"){toast("La expedición sigue activa. Espera a que termine para salir de la zona.",true);return}if(currentEnemy){toast("Hay un combate en curso. Debes resolver el contacto hostil antes de salir.",true);return}zoneHudOpen=false;lootHudOpen=false;currentEnemy=null;pendingExploreLoot=[];$("combatPanel").classList.add("hidden");renderZoneCards();sound(340,.06,"sine")}
function renderZoneDetail(){const z=zones.find(x=>x.id===selectedZone)||zones[0];const risk=["BAJO","MODERADO","ALTO","EXTREMO"][z.risk]||"VARIABLE";const host=$("zoneHudDetail");if(!host)return;host.innerHTML=`<div class="eyebrow">DOSSIER DE CAMPO · ${escapeHtml(z.id.toUpperCase())}</div><div style="display:flex;align-items:flex-start;gap:14px;margin:12px 0"><div class="zone-art" style="width:88px;min-width:88px;height:88px">${itemIconMarkup(z.name,z.icon)}</div><div style="flex:1"><h3 style="margin:0 0 8px">${escapeHtml(z.name)}</h3><p class="small-note">${escapeHtml(z.desc)}</p><div class="small-note" style="margin-top:10px">Riesgo: <b>${risk}</b> · Probabilidad de contacto: ${Math.round(z.enemy*100)}% · Duración estimada: ${Math.round(exploreDurationMs()/1000)} s</div></div></div><div class="zone-hud-actions"><button id="zoneBackBtn">← Volver a exploración</button><button id="zoneLootBtn" aria-expanded="${lootHudOpen}" class="${lootHudOpen?"active":""}">▤ Loot de la zona (${z.loot.length})</button><button class="primary" id="exploreBtn" ${activeTask||currentEnemy?"disabled":""}>⌖ INICIAR EXPEDICIÓN · ${Math.round(exploreDurationMs()/1000)} S</button></div>`;const b=$("exploreBtn");if(b)b.onclick=beginExplore;const back=$("zoneBackBtn");if(back)back.onclick=closeZoneHud;const loot=$("zoneLootBtn");if(loot)loot.onclick=()=>{lootHudOpen=!lootHudOpen;renderZoneDetail();renderZoneLoot()}}
function renderZoneLoot(){const host=$("zoneLootPanel");if(!host)return;const z=zones.find(x=>x.id===selectedZone)||zones[0];host.classList.toggle("hidden",!zoneHudOpen||!lootHudOpen);if(!zoneHudOpen||!lootHudOpen)return;host.innerHTML=`<div class="zone-loot-head"><div><h3>▤ LOOT DISPONIBLE</h3><p class="small-note">Objetos que puede revelar el escáner de ${escapeHtml(z.name)}. Desplázate por la lista; no tiene paginación.</p></div><span class="tag">${z.loot.length} OBJETOS</span></div><div class="zone-loot-list">${z.loot.map(n=>{const d=info(n);return `<div class="zone-loot-item"><span class="zone-loot-icon">${itemIconMarkup(n,d.icon)}</span><div><b>${escapeHtml(n)}</b><small>Nivel ${d.r||1} · ${escapeHtml(d.cat||"Otro")} · ${d.val||0} cr.</small><p>${escapeHtml(d.desc||"Objeto recuperable en esta zona.")}</p></div></div>`}).join("")}</div>`}
function renderZoneCards(){const overview=$("zonesOverview"),hud=$("zoneHud");if(overview)overview.classList.toggle("hidden",zoneHudOpen);if(hud)hud.classList.toggle("hidden",!zoneHudOpen);const start=(zonePage-1)*3,shown=zones.slice(start,start+3);$("zonesGrid").innerHTML=shown.map(z=>{const unlocked=zoneUnlocked(z),required=zoneRequiredLevel(z);return `<div class="zone-card ${selectedZone===z.id?"selected":""} ${unlocked?"":"zone-locked"}" data-zone-card="${z.id}"><div class="zone-art">${unlocked?itemIconMarkup(z.name,z.icon):'<span aria-label="Bloqueada">■</span>'}</div><h4>${escapeHtml(z.name)}</h4><p>${escapeHtml(z.desc)}</p><div class="loot-chips">${z.loot.slice(0,3).map(n=>`<span class="chip">${itemIconMarkup(n,info(n).icon)} ${escapeHtml(n)}</span>`).join("")}</div><div class="small-note">Riesgo: ${["BAJO","MODERADO","ALTO","EXTREMO"][z.risk]}${unlocked?"":` · BLOQUEADA · NIVEL ${required}`}</div><button data-zone="${z.id}" ${activeTask||!unlocked?"disabled":""}>${unlocked?"Entrar en zona →":`Desbloquea en nivel ${required}`}</button></div>`}).join("");$("zonesPageInfo").textContent=`Página ${zonePage} / ${Math.ceil(zones.length/3)}`;$("zonesPrev").disabled=zonePage<=1;$("zonesNext").disabled=zonePage>=Math.ceil(zones.length/3);document.querySelectorAll("[data-zone]").forEach(b=>b.onclick=e=>{e.stopPropagation();openZoneHud(b.dataset.zone)});document.querySelectorAll("[data-zone-card]").forEach(c=>c.onclick=e=>{if(e.target.closest("button"))return;openZoneHud(c.dataset.zoneCard)})}
function stopFusionHum(){
 if(!fusionHum)return;
 const hum=fusionHum;
 fusionHum=null; // permitir un nuevo hum solo tras liberar
 try{
  const now=audioCtx?.currentTime||0;
  if(hum.bus&&hum.bus.gain){
   hum.bus.gain.cancelScheduledValues(now);
   const cur=Math.max(0.00001,Number(hum.bus.gain.value)||0.00001);
   hum.bus.gain.setValueAtTime(cur,now);
   hum.bus.gain.linearRampToValueAtTime(0.00001,now+0.7);
  }
  for(const osc of (hum.oscs||[])){
   try{osc.stop(now+0.75)}catch(e){}
  }
 }catch(e){}
}

function startFusionHum(){
 if(state.settings.soundMuted||!state.settings.sound||Number(state.settings.soundVolume)===0)return;
 try{
  if(fusionHum)return;
  ensureAudio();
  const ctx=audioCtx;
  const now=ctx.currentTime;
  // Un solo tono medio muy suave + armónico leve; fades largos = sin petardeo
  const bus=ctx.createGain();
  bus.gain.setValueAtTime(0,now);
  bus.gain.linearRampToValueAtTime(0.028,now+1.8);
  bus.connect(masterGain);
  const lp=ctx.createBiquadFilter();
  lp.type="lowpass";
  lp.frequency.setValueAtTime(700,now);
  lp.Q.setValueAtTime(0.3,now);
  lp.connect(bus);
  const o1=ctx.createOscillator();
  const g1=ctx.createGain();
  o1.type="sine";
  o1.frequency.setValueAtTime(349.23,now); // F4
  g1.gain.setValueAtTime(0.7,now);
  o1.connect(g1);g1.connect(lp);
  const o2=ctx.createOscillator();
  const g2=ctx.createGain();
  o2.type="sine";
  o2.frequency.setValueAtTime(440,now); // A4 suave
  g2.gain.setValueAtTime(0.25,now);
  o2.connect(g2);g2.connect(lp);
  o1.start(now);o2.start(now);
  // deriva mínima
  o1.frequency.linearRampToValueAtTime(356,now+10);
  o2.frequency.linearRampToValueAtTime(448,now+10);
  fusionHum={oscs:[o1,o2],bus,startedAt:now};
 }catch(e){fusionHum=null}
}

function beginTask(type,duration,onDone,els){if(activeTask)return;activeTask={type,start:Date.now(),duration,done:false,lastCue:0};stopFusionHum();sound(420,.09,"sine");els.panel.classList.remove("hidden");els.bar.style.width="0%";els.percent.textContent="0%";els.status&&(els.status.textContent=type==="explore"?"Explorando...":type==="craft"?"Fabricando...":type==="extract"?"Extrayendo...":type==="spawn"?"Sintetizando engendro...":type==="dismantle"?"Desmontando...":type==="assemble"?"Ensamblando...":"Fusionando...");els.button&&(els.button.disabled=true);const tick=()=>{if(!activeTask||activeTask.type!==type)return;const p=Math.min(1,(Date.now()-activeTask.start)/duration);els.bar.style.width=(p*100)+"%";els.percent.textContent=Math.floor(p*100)+"%";const step=Math.floor(p*3);if(step>activeTask.lastCue&&p<1){activeTask.lastCue=step;sound(560+step*30,.07,"sine")}if(p>=1){activeTask=null;setTimeout(()=>{sound(700,.1,"sine");onDone()},40);return}setTimeout(tick,100)};tick()}
function beginExplore(){if(activeTask||currentEnemy)return;const z=zones.find(z=>z.id===selectedZone);if(!z||!zoneUnlocked(z))return toast(`Zona bloqueada. Necesitas nivel ${zoneRequiredLevel(z||zones[0])} de Operador.`,true);$("combatPanel").classList.add("hidden");$("exploreProgressPanel").classList.remove("hidden");const _expMs=exploreDurationMs();beginTask("explore",_expMs,()=>{state.expeditions++;const foundItems=[];const primary=z.loot[Math.floor(Math.random()*z.loot.length)];foundItems.push(primary);const gatherChance=Math.min(.82,Math.max(0,(stat("gather")+stat("loot")+skillBonus("gather"))/100));if(Math.random()<gatherChance)foundItems.push(z.loot[Math.floor(Math.random()*z.loot.length)]);const rareChance=Math.min(.35,Math.max(0,stat("luck")/200));if(Math.random()<rareChance)foundItems.push(z.loot[Math.floor(Math.random()*z.loot.length)]);// Anomalías base: baja probabilidad en cualquier zona
if(typeof baseAnomalyNames!=="undefined"&&baseAnomalyNames.length&&Math.random()<(BASE_ANOMALY_DROP_CHANCE+Math.min(0.08,stat("luck")/400))){
  const anom=baseAnomalyNames[Math.floor(Math.random()*baseAnomalyNames.length)];
  foundItems.push(anom);
}
foundItems.forEach(found=>addItem(found,1,{origin:"exploración"}));pendingExploreLoot=[...foundItems];xp(12+z.risk*4);log(`Exploración completada en <b>${z.name}</b>: ${foundItems.map(n=>escapeHtml(n)).join(", ")}.`);$("exploreStatus").textContent="Exploración completada";$("exploreHint").innerHTML=formatExploreLoot(foundItems);toast(`Botín recuperado (${foundItems.length}): <b>${foundItems.join(", ")}</b>`);const hostile=Math.random()<z.enemy;render();if(hostile)startEncounter(z);else{pendingExploreLoot=[];$("exploreStatus").textContent="Zona despejada";$("exploreHint").innerHTML=formatExploreLoot(foundItems)+`<div class="small-note" style="margin-top:8px">No se detectaron hostiles. Puedes volver a explorar.</div>`;renderZoneCards();renderZoneDetail()}save()}, {panel:$("exploreProgressPanel"),bar:$("exploreBar"),percent:$("explorePercent"),status:$("exploreStatus"),button:$("exploreBtn")});$("exploreHint").textContent="Escaneando señales, buscando materiales y comprobando amenazas...";renderZoneCards();renderZoneDetail()}

function playerMaxHp(){return Math.max(30,40+state.level*5+defense()*3)}
function formatExploreLoot(items){
 if(!items||!items.length)return "Sin hallazgos.";
 const chips=items.map(n=>`<span class="explore-loot-chip">${itemIconMarkup(n,info(n).icon)} <span>${escapeHtml(n)}</span></span>`).join("");
 return `Hallazgos (${items.length}): <div class="explore-loot-row">${chips}</div>`;
}
function loseExploreLoot(){
 if(!pendingExploreLoot.length)return [];
 const lost=[...pendingExploreLoot];
 lost.forEach(name=>take(name,1));
 pendingExploreLoot=[];
 return lost;
}

function startEncounter(z){
 const pool=enemyCatalog.filter(e=>e.rank<=Math.min(5,2+z.risk+Math.floor(state.level/8)));
 const template=pool[Math.floor(Math.random()*pool.length)]||enemyCatalog[Math.floor(Math.random()*enemyCatalog.length)];
 const rank=Math.max(template.rank,Math.min(5,1+z.risk+Math.floor((state.level-1)/7)+Math.floor(Math.random()*2)));
 const e={...template,rank,hp:Math.round(template.hp+z.risk*8+rank*4+state.level*1.5)};e.max=e.hp;currentEnemy=e;
 playerCombatMax=playerMaxHp();playerCombatHp=playerCombatMax;
 $("combatPanel").classList.remove("hidden");
 $("combatTitle").textContent=e.name+" · N"+rank;
 $("enemyCombatName").textContent=e.name;
 if(!itemDB[e.name])itemDB[e.name]={name:e.name,cat:"Criatura",icon:e.icon||"🧟",r:rank,val:5,desc:e.desc||"Amenaza de campo."};else if(!itemDB[e.name].cat)itemDB[e.name].cat="Criatura";
 $("enemyCombatIcon").innerHTML=itemIconMarkup(e.name,e.icon||"🧟");
 $("playerCombatIcon").innerHTML=operatorIconMarkup();
 $("combatText").textContent=`${e.name} (N${rank}) bloquea el camino en ${z.name}. Probabilidad de adquisición al vencer: ${captureChance(e)}%.`;
 $("combatLootNote").innerHTML=pendingExploreLoot.length?`Botín de esta expedición en riesgo: ${pendingExploreLoot.map(n=>escapeHtml(n)).join(", ")}. Si caes, lo perderás.`:"Sin botín pendiente en riesgo.";
 $("enemyHp").textContent=e.hp+" / "+e.max;$("enemyBar").style.width="100%";
 $("playerHp").textContent=playerCombatHp+" / "+playerCombatMax;$("playerBar").style.width="100%";
 $("playerDamage").textContent=damage();$("enemyRank").textContent="N"+rank;
 $("fightBtn").disabled=false;$("fightBtn").textContent="⚔ Enfrentarse";
 toast(`¡Contacto hostil! <b>${e.name}</b> · N${rank}`,true);renderZoneCards();renderZoneDetail();
}
function rollCompanionAbilities(rank){
 const choices=[
  {type:"Daño",name:"Instinto depredador",unit:"daño",base:1,gain:2},
  {type:"Defensa",name:"Piel endurecida",unit:"defensa",base:1,gain:2},
  {type:"Recolección",name:"Olfato de rastreador",unit:"% de recolección",base:3,gain:5},
  {type:"Suerte",name:"Presagio favorable",unit:"% de hallazgos",base:2,gain:3},
  {type:"Créditos",name:"Instinto carroñero",unit:"% de créditos extra",base:2,gain:3},
  {type:"Captura",name:"Llamada feromonal",unit:"% de captura",base:1,gain:2},
  {type:"Botín",name:"Mandíbula recolectora",unit:"% de probabilidad de botín adicional",base:4,gain:5},
  {type:"Botín",name:"Cazador de alijos",unit:"% de probabilidad de botín adicional",base:3,gain:4},
  {type:"Experiencia",name:"Resonancia de aprendizaje",unit:"% de experiencia extra",base:2,gain:2},
  {type:"Suerte",name:"Detector de rarezas",unit:"% de hallazgos adicionales",base:2,gain:3},
  {type:"Botín",name:"Cartógrafo de alijos",unit:"% de probabilidad de botín adicional",base:2,gain:4},
  {type:"Recolección",name:"Reciclador de campo",unit:"% de recolección",base:2,gain:4},
  {type:"Experiencia",name:"Memoria fractal",unit:"% de experiencia extra",base:1,gain:3},
  {type:"Créditos",name:"Tasador de anomalías",unit:"% de créditos extra",base:2,gain:2},
  {type:"Captura",name:"Vínculo de contención",unit:"% de captura",base:1,gain:3}
 ];
 const shuffled=choices.sort(()=>Math.random()-.5),count=rank>=3&&Math.random()<.75?2:1;
 return shuffled.slice(0,count).map(c=>{const value=c.base+rank*c.gain+Math.floor(Math.random()*Math.max(1,rank));return {type:c.type,name:c.name,value,desc:`+${value} ${c.unit}`}});
}
function captureChance(enemy){return Math.min(72,Math.max(8,20+enemy.rank*3+Math.floor(state.level/3)+Math.round(stat("luck")*.35)+stat("capture")))}
function fight(){
 if(!currentEnemy)return;const enemy=currentEnemy;const ally=equippedItem("companion");
 $("fightBtn").disabled=true;
 const d=damage()+Math.floor(Math.random()*5)+Math.floor((ally?.r||0)/2);enemy.hp=Math.max(0,enemy.hp-d);
 const retaliate=Math.max(0,Math.floor(5+Math.random()*7-(ally?Math.floor((ally.r||1)*.4):0)-defense()));
 playerCombatHp=Math.max(0,playerCombatHp-retaliate);
 $("enemyHp").textContent=enemy.hp+" / "+enemy.max;$("enemyBar").style.width=Math.max(0,(enemy.hp/enemy.max*100))+"%";
 $("playerHp").textContent=playerCombatHp+" / "+playerCombatMax;$("playerBar").style.width=Math.max(0,(playerCombatHp/playerCombatMax*100))+"%";
 if(enemy.hp<=0){
  $("combatText").textContent=`Golpeas por ${d} de daño. ${retaliate?`Recibes ${retaliate} de daño. `:""}Amenaza neutralizada.`;
  addItem(enemy.loot,1,{origin:"combate"});const bonusLootChance=Math.min(.8,Math.max(0,(stat("loot")+stat("luck"))/100));if(Math.random()<bonusLootChance){addItem(enemy.loot,1,{origin:"combate"});log(`Habilidad de botín activada: <b>botín duplicado</b>.`)}state.credits+=Math.round((5+Math.floor(Math.random()*8))*(1+stat("credits")/100));xp(18+enemy.rank*3);
  const chance=captureChance(enemy);
  if(Math.random()*100<chance){const abilities=rollCompanionAbilities(enemy.rank);const abilityText=abilities.map(a=>`${a.name} (${a.desc})`).join(" · ");
   addItem(enemy.name,1,{origin:"captura",cat:"Criatura",r:enemy.rank,val:info(enemy.name).val||25,icon:enemy.icon,desc:`Compañero de combate de nivel ${enemy.rank}. Sus habilidades varían entre ejemplares.`,abilities,ability:abilities[0],unique:true,companion:true});
   log(`Criatura adquirida: <b>${enemy.name}</b> · N${enemy.rank}. Habilidad: ${abilityText}.`);toast(`¡Adquiriste a ${enemy.name}! ${abilityText}`);
  }else toast(`Amenaza neutralizada. Probabilidad de adquisición: ${chance}%. La criatura no pudo ser estabilizada.`);
  log(`Amenaza neutralizada: <b>${enemy.name}</b>. Conservas el botín de la expedición.`);
  pendingExploreLoot=[];currentEnemy=null;
  setTimeout(()=>{$("combatPanel").classList.add("hidden");$("exploreStatus").textContent="Zona despejada";if($("exploreHint"))$("exploreHint").innerHTML='Combate ganado. El botín de la expedición está a salvo.';renderZoneCards();renderZoneDetail();render();save()},450);
  render();save();return;
 }
 if(playerCombatHp<=0){
  const lost=loseExploreLoot();
  $("combatText").textContent=`Golpeas por ${d} de daño, pero recibes ${retaliate}. Tu integridad llega a cero. Has sido derrotado.`;
  log(`Derrota ante <b>${enemy.name}</b>. Botín de expedición perdido${lost.length?": "+lost.join(", "):""}.`);
  toast(lost.length?`Derrota. Pierdes: ${lost.join(", ")}`:"Derrota. Sin botín que perder.",true);
  currentEnemy=null;
  setTimeout(()=>{$("combatPanel").classList.add("hidden");$("exploreStatus").textContent="Retirada forzada";if($("exploreHint"))$("exploreHint").innerHTML=lost.length?`Has perdido el botín de esta expedición: <b>${lost.map(escapeHtml).join(", ")}</b>.`:"Derrota sin botín pendiente.";renderZoneCards();renderZoneDetail();render();save()},600);
  render();save();return;
 }
 $("combatText").textContent=`Golpeas por ${d} de daño. Recibes ${retaliate} de daño. El enemigo sigue en pie.`;
 $("fightBtn").disabled=false;
 if(retaliate>0)toast(`Recibes ${retaliate} de daño. Integridad: ${playerCombatHp}/${playerCombatMax}`,true);
 render();save();
}
function renderFusionSelects(){["A","B"].forEach(k=>{const id=state.fusionSlots?.[k];const x=state.inventory.find(x=>x.id===id);const slot=$("slot"+k);slot.classList.toggle("filled",!!x);slot.querySelector(".slot-icon").innerHTML=x?itemIconMarkup(x.name,x.icon||info(x.name).icon):"＋";$("fusion"+k+"Label").textContent=x?inventoryDisplayName(x):`Objeto ${k}`;$("chooseFusion"+k).textContent=x?"Cambiar objeto":"Elegir del inventario";const clearBtn=$("clearFusion"+k);if(clearBtn){clearBtn.classList.toggle("hidden",!x);clearBtn.disabled=!!activeTask||!!state.pendingFusion}});$("fuseBtn").disabled=!!activeTask||!!state.pendingFusion||!state.inventory.some(x=>x.id===state.fusionSlots?.A)||!state.inventory.some(x=>x.id===state.fusionSlots?.B);$("chooseFusionA").disabled=!!state.pendingFusion||!!activeTask;$("chooseFusionB").disabled=!!state.pendingFusion||!!activeTask}
function openPicker(mode,slot=null){pickerMode=mode;pickerSlot=slot;pickerFilter="Todos";pickerPage=1;$("pickerSearch").value="";$("pickerTitle").textContent=mode==="fusion"?`▤ INVENTARIO · OBJETO ${slot}`:mode==="spawnAnomaly"?"▤ INVENTARIO · ANOMALÍA":mode==="spawn"?`▤ INVENTARIO · ÓRGANO ${Number(slot)+1}`:mode==="extract"?"▤ INVENTARIO · EXTRACCIÓN":mode==="sell"?"▤ INVENTARIO · VENDER":"▤ INVENTARIO · EQUIPAR";$("pickerDescription").textContent=mode==="fusion"?"Selecciona un objeto propio del juego para la cámara de fusión.":mode==="spawnAnomaly"?"Selecciona una anomalía del inventario (opcional).":mode==="spawn"?"Selecciona un órgano del inventario.":mode==="extract"?"Selecciona una criatura orgánica. Las unidades robóticas no sirven.":mode==="sell"?"Selecciona el objeto que quieres vender.":"Selecciona una pieza compatible con el espacio de equipo.";$("pickerFilterMenu").classList.toggle("hidden",mode!=="fusion");$("pickerFilterLabel").textContent=pickerFilter;$("inventoryPicker").classList.remove("hidden");renderPicker()}
function renderPicker(){
 if(pickerMode!=="exchangeInput"){const qb=$("pickerQtyBar"),qc=$("pickerQtyConfirm");if(qb)qb.classList.add("hidden");if(qc)qc.classList.add("hidden");}
 const search=(($("pickerSearch")&&$("pickerSearch").value)||"").trim().toLowerCase();
 // --- Máquina de Mejora: objetivo desde Registro Base ---
 if(pickerMode==="upgradeTarget"){
  const names=[...new Set([...(state.seen||[]),...Object.keys(state.discovered||{}),...Object.keys(itemDB||{})])]
   .filter(n=>{
     const d=info(n);
     if(!d||!d.cat)return false;
     if(isSynthesisItem({name:n,...d})||isRefineDust(n))return false;
     if(["Criatura"].includes(d.cat))return false;
     if(!["Material","Lingote","Herramienta","Arma","Equipo","Consumible","Anomalía","Contrabando","Órgano"].includes(d.cat))return false;
     if(isOtroOnlyItem(n))return false;
     // Objetivo de mejora: solo base descubierta o catálogo conocido no síntesis
     const known=(state.seen||[]).includes(n)||!!((state.discovered||{})[n])||state.inventory.some(i=>i.name===n);
     if(!known)return false;
     if(pickerFilter&&pickerFilter!=="Todos"){
       if(pickerFilter==="Síntesis")return false;
       if(d.cat!==pickerFilter)return false;
     }
     return true;
   })
   .filter(n=>n.toLowerCase().includes(search))
   .sort((a,b)=>(info(a).r||1)-(info(b).r||1)||a.localeCompare(b,"es"));
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(names.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=names.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(n=>`<button type="button" class="picker-item" data-upgrade-target="${escapeHtml(n)}"><span class="item-icon">${itemIconMarkup(n,info(n).icon)}</span><span style="min-width:0"><b title="${escapeHtml(n)}">${escapeHtml(n)}</b><small>N${info(n).r||1} · ${escapeHtml(info(n).cat||"?")}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos base descubiertos en el registro.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-upgrade-target]").forEach(b=>b.onclick=()=>{
    upgradeTargetName=b.dataset.upgradeTarget;upgradeTargetQty=1;
    $("inventoryPicker").classList.add("hidden");renderUpgradeMachine();sound(500);
  });
  return;
 }
 // --- Máquina de Mejora: entrada desde inventario (solo base) ---
 
 
 if(pickerMode==="dismantleRobot"){
  let list=state.inventory.filter(x=>x.qty>0&&x.cat==="Criatura"&&isRoboticCreature(x)&&!isItemEquipped(x.id)&&x.name.toLowerCase().includes(search));
  const pageSize=pickerPageSize();const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon)}</span><span><b>${escapeHtml(inventoryDisplayName(x))}</b><small>Robot · N${x.r||1}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay unidades robóticas.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{dismantleRobotId=b.dataset.pickId;dismantleSelected={};$("inventoryPicker").classList.add("hidden");renderDismantleTable();sound(500)});
  return;
 }
 if(pickerMode==="asmPiece"){
  const used=new Set(Object.values(asmSelected).filter(Boolean));
  let list=state.inventory.filter(x=>x.qty>0&&x.cat==="Pieza"&&!used.has(x.id)&&x.name.toLowerCase().includes(search));
  const pageSize=pickerPageSize();const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon)}</span><span><b>${escapeHtml(inventoryDisplayName(x))}</b><small>Pieza · N${x.r||1}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay piezas.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{asmSelected[pickerSlot]=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderAssembleTable();sound(500)});
  return;
 }
 if(pickerMode==="asmAnomaly"){
  let list=state.inventory.filter(x=>x.qty>0&&x.cat==="Anomalía"&&x.name.toLowerCase().includes(search));
  const pageSize=pickerPageSize();const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon)}</span><span><b>${escapeHtml(inventoryDisplayName(x))}</b></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay anomalías.</div>';
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{asmAnomalyId=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderAssembleTable();sound(500)});
  return;
 }

 
 if(pickerMode==="printTarget"||pickerMode==="printFuel"){
  const fuelIds=new Set(printFuel.map(x=>x.id));
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||isItemEquipped(x.id))return false;
    if(!isPrintEligible(x))return false;
    if(pickerMode==="printFuel"){
      if(printTargetId&&x.id===printTargetId)return false; // no usar el mismo stack objetivo como aporte opcionalmente allowed? allow other qty
      // can use same item type different stacks; allow if qty available beyond target
    }
    if(pickerFilter&&pickerFilter!=="Todos"){
      const cat=x.cat||info(x.name).cat||"";
      if(pickerFilter==="Síntesis"){if(!isSynthesisItem(x))return false;}
      else if(cat!==pickerFilter)return false;
    }
    const q=($("pickerSearch")&&$("pickerSearch").value||"").trim().toLowerCase();
    if(q&&!String(x.name).toLowerCase().includes(q)&&!inventoryDisplayName(x).toLowerCase().includes(q))return false;
    return true;
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>{
    const v=printItemValue(x);
    return `<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)}</small></span></button>`;
  }).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos válidos.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    const x=state.inventory.find(i=>i.id===b.dataset.pickId);
    if(!x)return;
    if(pickerMode==="printTarget"){
      printTargetId=x.id;$("inventoryPicker").classList.add("hidden");renderPrintMachine();sound(500);return;
    }
    const existing=printFuel.find(f=>f.id===x.id);
    const already=existing?existing.qty:0;
    const maxQty=Math.max(0,x.qty-already);
    if(maxQty<1)return toast("No hay más unidades.",true);
    $("inventoryPicker").classList.add("hidden");
    if(maxQty===1){
      if(existing)existing.qty+=1;
      else printFuel.push({id:x.id,name:x.name,qty:1,val:x.val,r:x.r,cat:x.cat,icon:x.icon});
      renderPrintMachine();sound(500);return;
    }
    openPrintFuelQtyModal(x.id,maxQty);
  });
  return;
 }
if(pickerMode==="scrapInput"){
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||isItemEquipped(x.id))return false;
    if(!isScrapEligible(x))return false;
    return x.name.toLowerCase().includes(search);
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>{
    const outs=scrapOutputsFor(x);
    const prev=outs.slice(0,3).map(o=>o.qty+"× "+o.name).join(", ");
    return `<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)} · ${escapeHtml(prev||"con receta")}</small></span></button>`;
  }).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos desguazables.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    scrapInputId=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderScrapMachine();sound(500);
  });
  return;
 }
if(pickerMode==="recycleInput"){
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||!isSynthesisItem(x)||x.cat==="Criatura"||isItemEquipped(x.id))return false;
    return x.name.toLowerCase().includes(search);
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos de síntesis (no criaturas).</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    recycleInputId=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderRecycleMachine();sound(500);
  });
  return;
 }
if(pickerMode==="upgradeInput"){
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||isSynthesisItem(x)||isItemEquipped(x.id)||isRefineDust(x)||isOtroOnlyItem(x))return false;
    if(["Criatura"].includes(x.cat||info(x.name).cat))return false;
    if(pickerFilter&&pickerFilter!=="Todos"){
      if(pickerFilter==="Síntesis")return false;
      if((x.cat||info(x.name).cat)!==pickerFilter)return false;
    }
    return x.name.toLowerCase().includes(search);
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b title="${escapeHtml(x.name)}">${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos base en el inventario.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    const x=state.inventory.find(i=>i.id===b.dataset.pickId);if(!x)return;
    if(isSynthesisItem(x)){toast("Solo objetos base (sin síntesis).",true);return}
    upgradeInputId=x.id;upgradeInputQty=1;$("inventoryPicker").classList.add("hidden");renderUpgradeMachine();save();sound(500);
  });
  return;
 }

 if(pickerMode==="refineInput"){
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||isSynthesisItem(x)||isItemEquipped(x.id)||isRefineDust(x)||isOtroOnlyItem(x))return false;
    if(pickerFilter&&pickerFilter!=="Todos"){
      if(pickerFilter==="Síntesis")return false;
      if((x.cat||info(x.name).cat)!==pickerFilter)return false;
    }
    return x.name.toLowerCase().includes(search);
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">Sin objetos válidos.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    refineInputId=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderRefineMachine();sound(500);
  });
  return;
 }
 if(pickerMode==="refineTarget"){
  const inItem=refineInputId?state.inventory.find(i=>i.id===refineInputId):null;
  const minVal=inItem?Math.max(1,Number(inItem.val)||Number(info(inItem.name).val)||1)+1:2;
  const names=[...new Set([...(state.seen||[]),...Object.keys(state.discovered||{})])]
   .filter(n=>{
     const d=info(n);
     if(!d||!d.cat)return false;
     if(isSynthesisItem({name:n,...d}))return false;
     if(["Criatura"].includes(d.cat))return false;
     if(Math.max(1,Number(d.val)||1)<minVal)return false;
     if(pickerFilter&&pickerFilter!=="Todos"){
       if(pickerFilter==="Síntesis")return false;
       if(d.cat!==pickerFilter)return false;
     }
     return true;
   })
   .filter(n=>n.toLowerCase().includes(search))
   .sort((a,b)=>(info(a).val||1)-(info(b).val||1)||a.localeCompare(b,"es"));
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(names.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=names.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(n=>`<button type="button" class="picker-item" data-refine-target="${escapeHtml(n)}"><span class="item-icon">${itemIconMarkup(n,info(n).icon)}</span><span style="min-width:0"><b>${escapeHtml(n)}</b><small>N${info(n).r||1} · ${Math.max(1,Number(info(n).val)||1)} cr.</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetivos de mayor valor descubiertos.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-refine-target]").forEach(b=>b.onclick=()=>{
    refineTargetName=b.dataset.refineTarget;$("inventoryPicker").classList.add("hidden");renderRefineMachine();sound(500);
  });
  return;
 }
 if(pickerMode==="exchangeInput"){
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||isSynthesisItem(x)||x.unique||isItemEquipped(x.id)||isRefineDust(x)||isOtroOnlyItem(x))return false;
    if(!["Material","Lingote","Consumible","Herramienta","Arma","Equipo","Contrabando"].includes(x.cat||info(x.name).cat))return false;
    if(pickerFilter&&pickerFilter!=="Todos"){
      if(pickerFilter==="Síntesis")return false;
      if((x.cat||info(x.name).cat)!==pickerFilter)return false;
    }
    return x.name.toLowerCase().includes(search);
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b title="${escapeHtml(x.name)}">${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos base disponibles.</div>';
  // Cantidad en HUD aparte (no dentro del picker)
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    const x=state.inventory.find(i=>i.id===b.dataset.pickId);if(!x)return;
    if(isSynthesisItem(x)){toast("Solo objetos base.",true);return}
    const used=exchangeBoxCount();
    const already=Number(exchangeBox[x.id]||0);
    const room=10-used;
    const can=Math.min(x.qty-already,room);
    if(can<=0){toast("Máximo 10 unidades en la caja.",true);return}
    // Cerrar picker e abrir modal de cantidad
    $("inventoryPicker").classList.add("hidden");
    openExchangeQtyModal(x.id,can);
  });
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  return;
 }
 let list=state.inventory.filter(x=>x.qty>0&&x.name.toLowerCase().includes(search)&&!isItemEquipped(x.id));
 if(pickerMode==="fusion"&&pickerFilter!=="Todos")list=list.filter(x=>pickerFilter==="Síntesis"?isSynthesisItem(x):pickerFilter==="Lingote"?(x.cat==="Lingote"||x.name.startsWith("Lingote de ")):pickerFilter==="Otro"?!( ["Material","Lingote","Herramienta","Arma","Equipo","Consumible","Criatura","Órgano","Pieza","Anomalía"].includes(x.cat)):x.cat===pickerFilter);
 if(pickerMode==="extract")list=list.filter(x=>x.cat==="Criatura"&&!isRoboticCreature(x));
 if(pickerMode==="spawn")list=list.filter(x=>x.cat==="Órgano"&&!Object.values(spawnSelected||{}).includes(x.id));
 if(pickerMode==="spawnAnomaly")list=list.filter(x=>x.cat==="Anomalía");
 if(pickerMode==="equip")list=list.filter(x=>pickerSlot==="anomaly"?x.cat==="Anomalía":pickerSlot==="companion"?x.cat==="Criatura":info(x.name).slot===pickerSlot||x.slot===pickerSlot);
 const pageSize=6;const pages=Math.max(1,Math.ceil(list.length/pageSize));pickerPage=Math.min(Math.max(1,pickerPage),pages);const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
 $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b title="${escapeHtml(x.name)}">${escapeHtml(inventoryDisplayName(x))}</b><small>N${x.r} · ${escapeHtml(x.cat)} · ×${x.qty}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos disponibles en esta categoría.</div>';
 if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
 if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
 if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
 document.querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{const x=state.inventory.find(i=>i.id===b.dataset.pickId);if(!x)return;if(pickerMode==="fusion"){state.fusionSlots=state.fusionSlots||{A:null,B:null};state.fusionSlots[pickerSlot]=x.id;renderFusionSelects()}else if(pickerMode==="extract"){extractCreatureId=x.id;extractSelected={};extractOrgansPage=1;renderExtractTable()}else if(pickerMode==="spawn"){spawnSelected[pickerSlot]=x.id;renderSpawnTable()}else if(pickerMode==="spawnAnomaly"){spawnAnomalyId=x.id;renderSpawnTable()}else 
 
 if(pickerMode==="dismantleRobot"){
  let list=state.inventory.filter(x=>x.qty>0&&x.cat==="Criatura"&&isRoboticCreature(x)&&!isItemEquipped(x.id)&&x.name.toLowerCase().includes(search));
  const pageSize=pickerPageSize();const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon)}</span><span><b>${escapeHtml(inventoryDisplayName(x))}</b><small>Robot · N${x.r||1}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay unidades robóticas.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{dismantleRobotId=b.dataset.pickId;dismantleSelected={};$("inventoryPicker").classList.add("hidden");renderDismantleTable();sound(500)});
  return;
 }
 if(pickerMode==="asmPiece"){
  const used=new Set(Object.values(asmSelected).filter(Boolean));
  let list=state.inventory.filter(x=>x.qty>0&&x.cat==="Pieza"&&!used.has(x.id)&&x.name.toLowerCase().includes(search));
  const pageSize=pickerPageSize();const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon)}</span><span><b>${escapeHtml(inventoryDisplayName(x))}</b><small>Pieza · N${x.r||1}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay piezas.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{asmSelected[pickerSlot]=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderAssembleTable();sound(500)});
  return;
 }
 if(pickerMode==="asmAnomaly"){
  let list=state.inventory.filter(x=>x.qty>0&&x.cat==="Anomalía"&&x.name.toLowerCase().includes(search));
  const pageSize=pickerPageSize();const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon)}</span><span><b>${escapeHtml(inventoryDisplayName(x))}</b></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay anomalías.</div>';
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{asmAnomalyId=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderAssembleTable();sound(500)});
  return;
 }

 
 if(pickerMode==="printTarget"||pickerMode==="printFuel"){
  const fuelIds=new Set(printFuel.map(x=>x.id));
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||isItemEquipped(x.id))return false;
    if(!isPrintEligible(x))return false;
    if(pickerMode==="printFuel"){
      if(printTargetId&&x.id===printTargetId)return false; // no usar el mismo stack objetivo como aporte opcionalmente allowed? allow other qty
      // can use same item type different stacks; allow if qty available beyond target
    }
    if(pickerFilter&&pickerFilter!=="Todos"){
      const cat=x.cat||info(x.name).cat||"";
      if(pickerFilter==="Síntesis"){if(!isSynthesisItem(x))return false;}
      else if(cat!==pickerFilter)return false;
    }
    const q=($("pickerSearch")&&$("pickerSearch").value||"").trim().toLowerCase();
    if(q&&!String(x.name).toLowerCase().includes(q)&&!inventoryDisplayName(x).toLowerCase().includes(q))return false;
    return true;
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>{
    const v=printItemValue(x);
    return `<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)}</small></span></button>`;
  }).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos válidos.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    const x=state.inventory.find(i=>i.id===b.dataset.pickId);
    if(!x)return;
    if(pickerMode==="printTarget"){
      printTargetId=x.id;$("inventoryPicker").classList.add("hidden");renderPrintMachine();sound(500);return;
    }
    const existing=printFuel.find(f=>f.id===x.id);
    const already=existing?existing.qty:0;
    const maxQty=Math.max(0,x.qty-already);
    if(maxQty<1)return toast("No hay más unidades.",true);
    $("inventoryPicker").classList.add("hidden");
    if(maxQty===1){
      if(existing)existing.qty+=1;
      else printFuel.push({id:x.id,name:x.name,qty:1,val:x.val,r:x.r,cat:x.cat,icon:x.icon});
      renderPrintMachine();sound(500);return;
    }
    openPrintFuelQtyModal(x.id,maxQty);
  });
  return;
 }
if(pickerMode==="scrapInput"){
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||isItemEquipped(x.id))return false;
    if(!isScrapEligible(x))return false;
    return x.name.toLowerCase().includes(search);
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>{
    const outs=scrapOutputsFor(x);
    const prev=outs.slice(0,3).map(o=>o.qty+"× "+o.name).join(", ");
    return `<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)} · ${escapeHtml(prev||"con receta")}</small></span></button>`;
  }).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos desguazables.</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    scrapInputId=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderScrapMachine();sound(500);
  });
  return;
 }
if(pickerMode==="recycleInput"){
  let list=state.inventory.filter(x=>{
    if(x.qty<=0||!isSynthesisItem(x)||x.cat==="Criatura"||isItemEquipped(x.id))return false;
    return x.name.toLowerCase().includes(search);
  });
  const pageSize=pickerPageSize();
  const pages=Math.max(1,Math.ceil(list.length/pageSize));
  pickerPage=Math.min(Math.max(1,pickerPage),pages);
  const shown=list.slice((pickerPage-1)*pageSize,pickerPage*pageSize);
  $("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button type="button" class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b>${escapeHtml(inventoryDisplayName(x))}</b><small>${pickerMetaHtml(x)}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos de síntesis (no criaturas).</div>';
  if($("pickerPageInfo"))$("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;
  if($("pickerPrev")){$("pickerPrev").disabled=pickerPage<=1;$("pickerPrev").onclick=()=>{pickerPage=Math.max(1,pickerPage-1);renderPicker()};}
  if($("pickerNext")){$("pickerNext").disabled=pickerPage>=pages;$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};}
  $("pickerGrid").querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{
    recycleInputId=b.dataset.pickId;$("inventoryPicker").classList.add("hidden");renderRecycleMachine();sound(500);
  });
  return;
 }
if(pickerMode==="upgradeInput"){
  if(isSynthesisItem(x)){toast("Solo objetos base (sin síntesis).",true);return}
  upgradeInputId=x.id;upgradeInputQty=1;$("inventoryPicker").classList.add("hidden");renderUpgradeMachine();save();return;
 }else if(pickerMode==="equip"){if(pickerSlot==="companion"&&!x.abilities?.length&&!x.ability){x.abilities=rollCompanionAbilities(x.r||1);x.ability=x.abilities[0];x.desc=`Compañero de campo. Habilidades procedurales: ${x.abilities.map(a=>a.name+" ("+a.desc+")").join(" · ")}.`}state.equipped[pickerSlot]=x.id;log(`Equipo actualizado: ${x.name}.`);renderEquipment();renderStats();renderBonus()}$("inventoryPicker").classList.add("hidden");save();sound(500)})}

function fusionOutcome(a,b){
 const da={...info(a.name),...a},db={...info(b.name),...b},text=(a.name+" "+b.name+" "+da.cat+" "+db.cat).toLowerCase();
 // Dos objetos de contrabando → siempre nuevo contrabando ilegal
 if(isContrabandItem(a)&&isContrabandItem(b)){
  const r=Math.min(5,Math.max(Number(da.r)||1,Number(db.r)||1)+((Math.random()<.45)?1:0));
  const val=Math.max(Number(da.val)||10,Number(db.val)||10)+8+r*6+Math.floor(Math.random()*12);
  const heads=["Paquete","Lote","Carga","Sello","Manifiesto","Célula","Valija","Núcleo","Chip","Implante"];
  const tails=["negro","oculto","robado","de sombra","clandestino","de contrabando","del mercado","prohibido","sellado","pirata"];
  const icons=["📦","📁","💾","🗝️","📕","💼","🔋","⚛️","🧠","💊"];
  const name=heads[Math.floor(Math.random()*heads.length)]+" "+tails[Math.floor(Math.random()*tails.length)]+" "+uid().slice(0,3).toUpperCase();
  return {
    name,
    icon:icons[Math.floor(Math.random()*icons.length)],
    cat:"Contrabando",
    r,
    val,
    desc:"Producto de contrabando fusionado. Rasgo ilegal. Procedencia: mercado negro.",
    illegal:true,
    trait:"Ilegal",
    affix:"Ilegal",
    contraband:true,
    unique:true,
    procedural:true,
    origin:"fusion"
  };
 }
 const creature=da.cat==="Criatura"||db.cat==="Criatura"||/zombie|mutante|ghoul|híbrido|infectado|merodeador|aberración|cosechador|dron biológico/.test(text);
 const organish=da.cat==="Órgano"||db.cat==="Órgano"||/corazón|higado|hígado|pulmón|riñón|médula|órgano|organo/.test(text);
 const plant=/madera|rama|hoja|resina|seta|hongo|espora|mutada|jardinero|fibra|vegetal/.test(text),metal=/chatarra|hierro|cobre|oro|lingote|tornillo|cable|placa|metal|pico|hacha|titanio|acero/.test(text),energy=/batería|núcleo|energético|cristal|geoda|eléctrica|solar|neón|cuántico|fase/.test(text);
 const weapon=[da.cat,db.cat].includes("Arma")||/espada|cuchillo|cañón|\bbate\b|colmillo|lanza|rifle/.test(text),tool=[da.cat,db.cat].includes("Herramienta"),gear=[da.cat,db.cat].includes("Equipo"),consumable=[da.cat,db.cat].includes("Consumible"),sameCat=da.cat===db.cat;let name,icon,cat,slot=null;
 const pools={
  plant:["Raíz prismática","Brote acorazado","Fibra viva","Coraza de savia","Jardín de espinas","Micelio soberano","Semilla de eclipse","Flor de ferrita","Enredadera cuántica","Espora de cristal","Corteza espectral","Pétalo de titanio","Núcleo fotosintético","Musgo abisal","Loto de plasma","Raíz de gravedad","Brote de obsidiana","Savia del vacío","Hiedra magnética","Coral terrestre","Trama micelar","Crisálida vegetal","Flor de tormenta","Médula botánica","Espina de neón","Polen dimensional","Rizoma errante","Copa de ceniza","Fronda reactiva","Semilla imposible"],
  metal:["Aleación de impacto","Centro de ferrita","Módulo calibrado","Placa de titanio","Acero de eclipse","Engranaje abisal","Armazón de obsidiana","Malla gravitatoria","Núcleo de tungsteno","Lámina espectral","Pistón de vacío","Aleación fantasma","Chasis de neón","Crisol de cobalto","Cerámica cinética","Bobina de iridio","Yunque dimensional","Blindaje de osmio","Trama de mercurio","Relé de titanio","Placa metamórfica","Armadura de ferrita","Matriz de aleación","Cobre de tormenta","Estructura singular","Nervio mecánico","Perno de eclipse","Bastidor cuántico","Carcasa de plasma","Metal de frontera"],
  energy:["Núcleo resonante","Prisma de fase","Celda espectral","Bobina voltaica","Corazón de antimateria","Batería de eclipse","Condensador abisal","Orbe de taquiones","Cápsula de vacío","Cristal gravitatorio","Reactor de bolsillo","Pulso de neón","Geoda temporal","Dínamo fantasma","Matriz de plasma","Prisma de tormenta","Núcleo de singularidad","Célula de fotones","Bobina de horizonte","Cuarzo imposible","Acumulador cuántico","Esfera de entropía","Batería dimensional","Lente de radiancia","Cápsula de aurora","Cristal de marea","Reactor espectral","Nodo de energía oscura","Vórtice encapsulado","Fulgor mineral"],
  creature:["Quimera errante","Vástago anómalo","Bestia sintética","Simbionte mutado","Acechador de fase","Coloso micelar","Cérbero espectral","Parásito soberano","Devorador de ecos","Híbrido de ceniza","Lince de neón","Hidra de ferrita","Centinela orgánico","Nómada abisal","Quimera de eclipse","Larva gravitatoria","Depredador fractal","Vigía parasitario","Gólem biológico","Mímico de vacío","Rastreador cuántico","Titán de esporas","Espectro carnívoro","Bestia de frontera","Centro viviente","Mutante de cristal","Corredor dimensional","Simbionte de plasma","Cosechador silente","Aberración coronada"],
  weapon:["Cortavacío","Filo de resonancia","Impactador cinético","Disruptor de fase","Sable de eclipse","Lanza gravitatoria","Martillo de singularidad","Rifle espectral","Guadaña de neón","Cañón de tormenta","Púa dimensional","Hacha de plasma","Filo de obsidiana","Perforador cuántico","Arco de fotones","Espada de entropía","Látigo magnético","Punzón de vacío","Lanza de ferrita","Cortador abisal","Fusil de taquiones","Maza de horizonte","Hoja de antimateria","Bastón de tormenta","Aguja de eclipse","Disyuntor cinético","Filo parasitario","Cañón de aurora","Sable fractal","Martillo del umbral"],
  tool:["Extractor adaptativo","Sonda de prospección","Taladro resonante","Recolector de precisión","Pico de horizonte","Cortador de fase","Analizador abisal","Sifón de plasma","Broca gravitatoria","Lector de anomalías","Perforador de titanio","Sonda espectral","Cosechador micelar","Llave dimensional","Taladro de eclipse","Pinza magnética","Extractor fantasma","Módulo cartográfico","Cortador cuántico","Recolector de vacío","Bastón de sondeo","Sonda de entropía","Separador de isótopos","Rastreador mineral","Matriz de prospección","Cizalla de neón","Compás gravitatorio","Núcleo perforador","Escáner de frontera","Herramienta imposible"],
  gear:["Blindaje reactivo","Bastión adaptable","Manto de dispersión","Escudo de fase","Coraza de eclipse","Visor espectral","Traje de vacío","Égida gravitatoria","Peto de obsidiana","Capa de neón","Arnés dimensional","Malla de plasma","Yelmo de taquiones","Escudo de horizonte","Blindaje micelar","Manto de entropía","Cúpula cinética","Traje abisal","Visor de singularidad","Coraza fantasma","Bastión de ferrita","Escudo parasitario","Malla de antimateria","Capa de tormenta","Peto cuántico","Sello de frontera","Égida de cristal","Traje de eclipse","Blindaje de aurora","Armadura imposible"],
  consumable:["Catalizador de pulso","Inyector estabilizado","Carga de sobrepresión","Baliza reactiva","Suero de eclipse","Ampolla gravitatoria","Dosis de neón","Elixir de fase","Carga de taquiones","Antídoto espectral","Estimulante abisal","Vial de plasma","Catalizador micelar","Inyector de vacío","Baliza dimensional","Cápsula de entropía","Suero de frontera","Carga de antimateria","Ampolla de aurora","Dosis cuántica","Antídoto de esporas","Elixir de singularidad","Vial de tormenta","Estimulante de eclipse","Carga de horizonte","Catalizador fantasma","Inyector de fotones","Baliza de obsidiana","Suero imposible","Ampolla de cristal"],
  organ:["Corazón de convergencia","Hígado del umbral","Pulmón de fase","Riñón espectral","Cerebro de tráfico","Ojo del mercado","Médula ilegal","Glándula de contrabando","Nervio clandestino","Vesícula prohibida","Bazo de subasta","Tejido negro","Ganglio de calle","Cartílago de precio","Plasma de soborno","Retina del tratante","Timo de silencio","Páncreas de deuda","Tráquea de fuga","Intestino de red","Piel de camuflaje","Cuerno de amenaza","Saco de botín","Núcleo carnal","Membrana de trato","Fibras de lealtad","Médula de imperio","Glándula de miedo","Saco de oro negro","Adrenalina de caza","Corazón de cuartel","Hígado de ruta","Pulmón de sótano","Riñón de puerto","Cerebro de cartel","Ojo de vigía","Médula de cámara","Glándula de tortura","Nervio de interrogatorio","Vesícula de amenaza"],
  other:["Artefacto de convergencia","Componente singular","Módulo de resonancia","Relé transmutador","Fragmento de eclipse","Ídolo de fase","Centro de frontera","Reliquia de vacío","Prisma errante","Sello de entropía","Matriz imposible","Esquirla de horizonte","Cubo de taquiones","Orbe parasitario","Cifra dimensional","Eco mineral","Nódulo espectral","Cápsula de singularidad","Vestigio de plasma","Ancla gravitatoria","Fragmento de aurora","Dispositivo de obsidiana","Relicario cuántico","Pieza de antimateria","Símbolo abisal","Módulo de eclipse","Artefacto fractal","Centro silente","Componente de tormenta","Vestigio imposible"]};
 const choose=list=>list[Math.floor(Math.random()*list.length)];
 const epithets=["del Umbral","de la Aurora Negra","del Horizonte Roto","de Entropía","del Vacío Vivo","de la Marea Cuántica","del Eclipse","de la Frontera","de los Ecos","de Plasma Frío","de la Tormenta Silente","del Abismo","de la Última Luz","de Fase Inversa","de la Singularidad","de la Noche Magnética","del Jardín Muerto","de la Corona Rota","de la Gravedad","del Tiempo Quieto","de Cristal Oscuro","de la Aurora Roja","de la Dimensión Ciega","del Pulso Eterno","de la Ceniza Viva","del Laberinto","de la Estrella Muerta","de la Resonancia","del Parpadeo","de la Marea Negra","del Eco Perdido","de la Ruptura"];
 const prefixes=["Proto","Neo","Ultra","Hiper","Meta","Cero","Omega","Alfa","Delta","Sigma","Épsilon","Centro","Vórtice","Umbral","Fase","Nómada","Soberano","Errante","Silente","Fractal","Fantasma","Radiante","Abisal","Parásito"];
 if(organish&&!(creature&&Math.random()<0.35)){name=choose(pools.organ);icon="🫀";cat="Órgano";}
 else if(creature){name=choose(pools.creature);icon=metal?"🤖":plant?"🧬":"🧟";cat="Criatura";}
 else if(weapon){name=choose(pools.weapon);icon=energy?"⚡":"⚔️";cat="Arma";slot="weapon";}
 else if(gear){name=choose(pools.gear);icon="🛡️";cat="Equipo";slot="armor";}
 else if(tool){name=choose(pools.tool);icon="🛠️";cat="Herramienta";slot=da.slot||db.slot||"pick";}
 else if(consumable){name=choose(pools.consumable);icon="🧪";cat="Consumible";}
 else if(energy){name=choose(pools.energy);icon="💎";cat="Material";}
 else if(metal&&plant){name="Herramienta híbrida";icon="🛠️";cat="Herramienta";slot="pick";}
 else if(metal){name=sameCat&&da.cat==="Lingote"?"Aleación mixta":choose(pools.metal);icon="⚙️";cat="Material";}
 else if(plant){name=choose(pools.plant);icon="🌿";cat="Material";}
 else{name=choose(pools.other);icon="🔧";cat="Material";}
 const ra=Math.max(1,Math.min(5,Number(a.r||da.r||1))),rb=Math.max(1,Math.min(5,Number(b.r||db.r||1))),avg=(ra+rb)/2,hi=Math.max(ra,rb),lo=Math.min(ra,rb);let r=Math.max(1,Math.min(5,Math.round(avg)));
 if(hi>=4&&Math.random()<(hi===5?.72:.58))r=Math.min(5,Math.max(r,hi-(lo<=2?1:0)));else if(hi>=3&&Math.random()<.18)r=Math.min(5,r+1);if(ra===5&&rb===5)r=Math.random()<.72?5:4;
 const combinedBase=Math.max(1,Number(a.val??da.val??1)+Number(b.val??db.val??1));const variation=Math.floor(Math.random()*61)-30;const val=Math.max(1,Math.ceil(combinedBase*(1+variation/100)));let desc=cat==="Criatura"?"Criatura procedural creada a partir de los dos objetos fusionados. Sus habilidades varían en cada ciclo.":"Objeto procedural formado por propiedades compatibles de la materia introducida. Su calidad y parámetros varían en cada ciclo.";
 // Nombres breves y con identidad: toman pistas de ambos ingredientes sin pegar
 // frases largas ni añadir epítetos aleatorios repetidos.
 // Nombre evolutivo: hereda conceptos semánticos, nunca fragmentos aleatorios de palabras.
 const normalizeWords=value=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const classifyThemes=item=>{
  const existing=Array.isArray(item.semanticThemes)?item.semanticThemes:[];
  if(existing.length)return existing;
  const raw=normalizeWords(`${item.name||""} ${item.cat||""} ${item.desc||""}`);
  const tags=[];
  if(/planta|vegetal|brote|raiz|hoja|hojas|flor|savia|resina|madera|rama|musgo|hongo|espora|micelio|rizoma|semilla|polen|jardin|verd|botanic|fibra viva/.test(raw))tags.push("vegetal");
  if(/cristal|mineral|geoda|cuarzo|gema|prisma|obsidiana|cobalto|ferrita|titanio|hierro|acero|metal|lingote|chatarra|placa|aleacion|cobre|oro|plata/.test(raw))tags.push("mineral");
  if(/energia|energetic|bateria|nucleo|pulso|volt|electr|solar|neon|cuant|fase|plasma|fotones|reactor|bobina|condensador/.test(raw))tags.push("energia");
  if(/anomalia|vacio|singularidad|fractura|dimensional|paradoja|umbral|eclipse|entropia|espectral|abismo|distorsion|eco temporal/.test(raw))tags.push("anomalia");
  if(/biologic|criatura|bestia|mutante|zombie|simbionte|quimera|organico|parasito|larva|hibrido|acechador/.test(raw)||item.cat==="Criatura")tags.push("biologico");
  if(/arma|espada|sable|rifle|pistola|lanza|martillo|hacha|cuchilla|filo|canon|fusil/.test(raw)||item.cat==="Arma")tags.push("combate");
  if(/herramienta|taladro|sonda|extractor|pico|cortador|recolector|analizador|sifon|perforador/.test(raw)||item.cat==="Herramienta")tags.push("tecnico");
  if(/armadura|coraza|yelmo|escudo|blindaje|manto|traje|guante|botas|equipo/.test(raw)||item.cat==="Equipo")tags.push("proteccion");
  if(item.cat==="Anomalía")tags.push("anomalia");
  if(item.cat==="Consumible")tags.push("quimico");
  return [...new Set(tags.length?tags:["tecnico"])];
 };
 const themesA=classifyThemes(da),themesB=classifyThemes(db);
 const themes=[...new Set([...themesA,...themesB])];
 const namingFamilies={
  vegetal:{nouns:["Brote","Raíz","Savia","Micelio","Rizoma","Flor","Espora","Fronda","Semilla","Enredadera"],adjs:["Umbrío","Cristalino","Voltaico","Espectral","Simbiótico","Prismático","Abisal","Mutante","Radiante"]},
  mineral:{nouns:["Prisma","Ferrita","Geoda","Cuarzo","Centro","Aleación","Matriz","Fragmento","Nódulo","Cristal"],adjs:["Voltaico","Umbrío","Resonante","Fractal","Espectral","Gravitatorio","Prismático","Inestable"]},
  energia:{nouns:["Núcleo","Pulso","Bobina","Celda","Reactor","Prisma","Condensador","Matriz","Emisor","Lente"],adjs:["Voltaico","Cuántico","Espectral","Solar","Abisal","Resonante","Inestable","Singular"]},
  anomalia:{nouns:["Eco","Umbral","Centro","Paradoja","Vórtice","Singularidad","Distorsión","Vestigio","Eclipse","Ancla"],adjs:["Temporal","Fractal","Viviente","Espectral","Inverso","Abisal","Errante","Inestable"]},
  biologico:{nouns:["Quimera","Simbionte","Vástago","Mímico","Crisálida","Coloso","Larva","Centinela","Híbrido","Acechador"],adjs:["Cristalino","Voltaico","Umbrío","Simbiótico","Espectral","Abisal","Mutante","Fractal"]},
  organico:{nouns:["Corazón","Hígado","Pulmón","Riñón","Cerebro","Ojo","Médula","Glándula","Nervio","Vesícula","Bazo","Tejido","Ganglio","Cartílago","Plasma","Retina","Saco","Membrana","Fibra","Núcleo"],adjs:["Ilegal","Clandestino","Prohibido","Anómalo","Irradiado","Umbrío","Mutante","Abisal","Espectral","Toxicado","Crimson","Viviente","Residual","Oscuro","Corruptido","Sintético","Primario","Secreto","Negro","Sangriento"]},
  combate:{nouns:["Filo","Sable","Lanza","Martillo","Cortavacío","Disruptor","Guadaña","Impactador","Cañón","Ruptor"],adjs:["Resonante","Voltaico","Cuántico","Espectral","Gravitatorio","Umbrío","Fractal","Singular"]},
  tecnico:{nouns:["Extractor","Sonda","Taladro","Analizador","Módulo","Recolector","Cortador","Sifón","Escáner","Perforador"],adjs:["Adaptativo","Resonante","Cuántico","Espectral","Magnético","Voltaico","Abisal","Prismático"]},
  proteccion:{nouns:["Coraza","Égida","Blindaje","Manto","Bastión","Yelmo","Armazón","Peto","Escudo","Traje"],adjs:["Reactivo","Prismático","Voltaico","Espectral","Gravitatorio","Adaptativo","Abisal","Fractal"]},
  quimico:{nouns:["Suero","Ampolla","Catalizador","Inyector","Vial","Elixir","Dosis","Reactivo","Cápsula","Compuesto"],adjs:["Simbiótico","Voltaico","Cuántico","Regenerativo","Espectral","Inestable","Abisal","Prismático"]}
 };
 const catFamily=cat==="Criatura"?"biologico":cat==="Órgano"?"organico":cat==="Arma"?"combate":cat==="Herramienta"?"tecnico":cat==="Equipo"?"proteccion":cat==="Consumible"?"quimico":cat==="Anomalía"?"anomalia":(themes.includes("vegetal")?"vegetal":themes.includes("energia")?"energia":themes.includes("mineral")?"mineral":energy?"energia":metal?"mineral":"tecnico");
 const secondaryTheme=themes.find(t=>t!==catFamily&&namingFamilies[t]);
 const stableHash=value=>{let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
 const sourceKey=[a.name,b.name].sort((x,y)=>String(x).localeCompare(String(y),"es")).join("::")+`::${cat}::${r}`;
 const familyPool=namingFamilies[catFamily]||namingFamilies.tecnico;
 const seed=stableHash(sourceKey);
 const noun=familyPool.nouns[seed%familyPool.nouns.length];
 const adjPool=secondaryTheme&&namingFamilies[secondaryTheme]?namingFamilies[secondaryTheme].adjs:familyPool.adjs;
 let adjective=adjPool[Math.floor(seed/familyPool.nouns.length)%adjPool.length];
 // Concordancia real en español: "Fronda Umbría", "Hojas Umbrías", no "Fronda Umbrio".
 const nounIsPlural=/s$/i.test(noun), nounIsFeminine=/(a|ción|sión|dad|tad|umbre|ie|ez)$/i.test(noun)&&!/(núcleo|sable|taladro|extractor|reactor)$/i.test(noun);
 const adjectiveForms={"Umbrío":["Umbría","Umbrío","Umbríos","Umbrías"],"Cristalino":["Cristalina","Cristalino","Cristalinos","Cristalinas"],"Voltaico":["Voltaica","Voltaico","Voltaicos","Voltaicas"],"Espectral":["Espectral","Espectral","Espectrales","Espectrales"],"Simbiótico":["Simbiótica","Simbiótico","Simbióticos","Simbióticas"],"Prismático":["Prismática","Prismático","Prismáticos","Prismáticas"],"Abisal":["Abisal","Abisal","Abisales","Abisales"],"Mutante":["Mutante","Mutante","Mutantes","Mutantes"],"Radiante":["Radiante","Radiante","Radiantes","Radiantes"],"Resonante":["Resonante","Resonante","Resonantes","Resonantes"],"Fractal":["Fractal","Fractal","Fractales","Fractales"],"Gravitatorio":["Gravitatoria","Gravitatorio","Gravitatorios","Gravitatorias"],"Inestable":["Inestable","Inestable","Inestables","Inestables"],"Cuántico":["Cuántica","Cuántico","Cuánticos","Cuánticas"],"Solar":["Solar","Solar","Solares","Solares"],"Singular":["Singular","Singular","Singulares","Singulares"],"Temporal":["Temporal","Temporal","Temporales","Temporales"],"Viviente":["Viviente","Viviente","Vivientes","Vivientes"],"Inverso":["Inversa","Inverso","Inversos","Inversas"],"Errante":["Errante","Errante","Errantes","Errantes"],"Adaptativo":["Adaptativa","Adaptativo","Adaptativos","Adaptativas"],"Magnético":["Magnética","Magnético","Magnéticos","Magnéticas"],"Reactivo":["Reactiva","Reactivo","Reactivos","Reactivas"],"Regenerativo":["Regenerativa","Regenerativo","Regenerativos","Regenerativas"]};
 const fusedNames={
  "vegetal|mineral":["Brote Cristalino","Savia de Prisma","Raíz de Cuarzo","Flor de Ferrita"],
  "energia|vegetal":["Brote Voltaico","Savia de Plasma","Núcleo Fotosintético","Flor de Pulso"],
  "anomalia|vegetal":["Brote de Singularidad","Raíz del Umbral","Savia Espectral","Flor de Eclipse"],
  "energia|mineral":["Núcleo de Fase","Prisma Voltaico","Geoda Resonante","Matriz de Plasma"],
  "anomalia|mineral":["Prisma de Singularidad","Geoda del Umbral","Fragmento Espectral","Nódulo Fractal"],
  "anomalia|energia":["Núcleo de Singularidad","Pulso del Umbral","Reactor Espectral","Eco Cuántico"],
  "biologico|vegetal":["Simbionte de Savia","Crisálida Vegetal","Quimera Micelar","Vástago Umbrío"],
  "biologico|energia":["Simbionte Voltaico","Quimera de Plasma","Núcleo Viviente","Crisálida de Fase"],
  "combate|mineral":["Filo de Ferrita","Sable de Obsidiana","Martillo Prismático","Lanza de Cuarzo"],
  "combate|energia":["Filo Voltaico","Sable de Fase","Lanza de Plasma","Disruptor Resonante"],
  "proteccion|mineral":["Coraza de Ferrita","Égida de Obsidiana","Blindaje Prismático","Bastión de Cuarzo"],
  "proteccion|energia":["Coraza Voltaica","Égida de Fase","Blindaje de Plasma","Manto Resonante"]
 };
 const pairPriority=["anomalia|vegetal","anomalia|mineral","anomalia|energia","vegetal|mineral","energia|vegetal","energia|mineral","biologico|vegetal","biologico|energia","combate|mineral","combate|energia","proteccion|mineral","proteccion|energia"];
 const pairKey=pairPriority.find(key=>{const [left,right]=key.split("|");return (themesA.includes(left)&&themesB.includes(right))||(themesA.includes(right)&&themesB.includes(left));});
 const themedNames=pairKey?fusedNames[pairKey]:null;
 name=themedNames?themedNames[seed%themedNames.length]:`${noun} ${adjective}`;
 // REWORK DE COHERENCIA: el nombre depende de lo que realmente se fusiona.
 // La energía/anomalía solo aparece si uno de los ingredientes la aporta.
 const na=normalizeWords(a.name), nb=normalizeWords(b.name), bothPlant=themesA.includes("vegetal")&&themesB.includes("vegetal"), bothMetal=themesA.includes("mineral")&&themesB.includes("mineral"), hasWood=/madera|leno|tronco|tabl/.test(na+" "+nb), hasBranch=/rama|ramas|ramaje|enredadera/.test(na+" "+nb), hasLeaf=/hoja|hojas|follaje/.test(na+" "+nb), hasEnergy=themes.includes("energia"), hasAnomaly=themes.includes("anomalia"), hasMineral=themes.includes("mineral");
 if(cat==="Material"){
  if(bothPlant){
   if(hasWood&&hasBranch)name="Trama Leñosa";
   else if(hasLeaf&&hasBranch)name="Follaje Entrelazado";
   else if(hasWood)name="Madera Reforzada";
   else if(hasLeaf)name="Manto de Hojas";
   else name="Compuesto Vegetal";
   if(hasEnergy)name=hasWood?"Madera Conductora":hasLeaf?"Follaje Electróforo":"Fibra Conductora";
   if(hasAnomaly)name=hasWood?"Madera de Fase":hasLeaf?"Follaje Anómalo":"Fibra de Fase";
  } else if(bothMetal){name=da.cat==="Lingote"&&db.cat==="Lingote"?"Aleación Mixta":"Compuesto Mineral";if(hasEnergy)name="Aleación Conductora";if(hasAnomaly)name="Aleación de Fase";}
  else if(themes.includes("vegetal")&&hasMineral)name=hasEnergy?"Fibra Mineral Conductora":hasAnomaly?"Raíz de Fase":"Raíz Mineralizada";
  else if(themes.includes("vegetal")&&hasEnergy)name="Biomasa Conductora";
  else if(themes.includes("vegetal")&&hasAnomaly)name="Biomasa Anómala";
  else if(hasEnergy)name=hasAnomaly?"Núcleo de Fase":"Núcleo Resonante";
  else if(hasAnomaly)name="Fragmento Anómalo";
 }
 // Los nombres de armas/equipo/herramientas no reciben adjetivos vegetales al azar.
 if(cat==="Arma"&&themes.includes("vegetal")&&!hasEnergy&&!hasAnomaly)name=hasMineral?"Filo de Raíz Mineralizada":"Filo de Madera";
 if(cat==="Herramienta"&&themes.includes("vegetal")&&!hasEnergy&&!hasAnomaly)name=hasMineral?"Extractor de Raíz Mineralizada":"Herramienta de Fibra";
 if(cat==="Equipo"&&themes.includes("vegetal")&&!hasEnergy&&!hasAnomaly)name=hasMineral?"Coraza de Fibra Mineralizada":"Arnés de Fibra Vegetal";
 // REWORK PROCEDURAL DE NOMBRES v2: vocabulario concreto, combinaciones por materia
 // y adjetivos tecnológicos únicamente cuando un ingrediente los justifica.
 const materialNameForFusion=()=>{
  if(cat!=="Material"&&cat!=="Lingote")return null;
  const rawA=normalizeWords(a.name),rawB=normalizeWords(b.name),rawBoth=rawA+" "+rawB;
  const woodA=/madera|tronco|tabl(on|a)?|le[nñ]o/.test(rawA),woodB=/madera|tronco|tabl(on|a)?|le[nñ]o/.test(rawB);
  const branchA=/rama|ramas|ramaje|enredadera/.test(rawA),branchB=/rama|ramas|ramaje|enredadera/.test(rawB);
  const leafA=/hoja|hojas|follaje|fronda/.test(rawA),leafB=/hoja|hojas|follaje|fronda/.test(rawB);
  const wood=woodA||woodB, branch=branchA||branchB, leaf=leafA||leafB;
  const bothWood=woodA&&woodB, bothLeaves=leafA&&leafB, woodBranch=(woodA&&branchB)||(woodB&&branchA), leafBranch=(leafA&&branchB)||(leafB&&branchA);
  const hasActualEnergy=/bateria|volt|electr|energia|energetic|plasma|bobina|condensador|reactor|solar|neon|cuantico/.test(rawBoth);
  const hasActualAnomaly=/anomalia|vacio|singularidad|dimensional|paradoja|espectral|fractura|entropia|umbral/.test(rawBoth);
  const hasCrystal=/cristal|cuarzo|geoda|gema|prisma|obsidiana/.test(rawBoth);
  const hasMetal=/metal|hierro|acero|cobre|titanio|ferrita|lingote|aleacion|chatarra|tornillo|placa/.test(rawBoth);
  if(da.cat==="Lingote"&&db.cat==="Lingote")return hasActualEnergy?"Aleación Conductora":hasActualAnomaly?"Aleación de Fase":"Aleación Mixta";
  if(bothWood)return hasActualEnergy?"Madera Conductora":hasActualAnomaly?"Madera de Fase":"Madera Reforzada";
  if(woodBranch)return hasActualEnergy?"Trama Leñosa Conductora":hasActualAnomaly?"Trama Leñosa de Fase":"Trama Leñosa";
  if(bothLeaves)return hasActualEnergy?"Follaje Conductor":hasActualAnomaly?"Follaje de Fase":"Manto de Hojas";
  if(leafBranch)return hasActualEnergy?"Follaje Conductor Entrelazado":hasActualAnomaly?"Follaje de Fase Entrelazado":"Follaje Entrelazado";
  if(wood&&leaf)return hasActualEnergy?"Fibra Leñosa Conductora":hasActualAnomaly?"Fibra Leñosa de Fase":"Fibra Leñosa";
  if(branch&&leaf)return hasActualEnergy?"Follaje Conductor":"Follaje Entrelazado";
  if(wood&&hasCrystal)return hasActualEnergy?"Madera Conductora":hasActualAnomaly?"Madera de Fase":"Madera Mineralizada";
  if(wood)return hasActualEnergy?"Madera Conductora":hasActualAnomaly?"Madera de Fase":"Madera Compuesta";
  if(leaf||branch)return hasActualEnergy?"Biomasa Conductora":hasActualAnomaly?"Biomasa de Fase":leaf?"Manto Vegetal":"Trama de Ramas";
  if(themes.includes("vegetal")&&hasCrystal)return hasActualEnergy?"Cristal Fotosensible":"Raíz Mineralizada";
  if(themes.includes("vegetal")&&hasMetal)return hasActualEnergy?"Fibra Metálica Conductora":"Fibra Mineralizada";
  if(bothMetal)return hasActualEnergy?"Aleación Conductora":hasActualAnomaly?"Aleación de Fase":"Compuesto Metálico";
  if(hasCrystal)return hasActualEnergy?"Prisma Conductor":hasActualAnomaly?"Prisma de Fase":"Compuesto Cristalino";
  if(hasActualEnergy)return hasActualAnomaly?"Núcleo de Fase":"Núcleo Resonante";
  if(hasActualAnomaly)return "Fragmento Anómalo";
  if(themes.includes("vegetal"))return "Compuesto Vegetal";
  if(themes.includes("mineral"))return "Compuesto Mineral";
  return null;
 };
 const proceduralMaterialName=materialNameForFusion();
 if(proceduralMaterialName)name=proceduralMaterialName;
 // Atributos energéticos/anómalos no se heredan de conceptos antiguos si los
 // ingredientes actuales no los contienen; la genealogía se conserva aparte.
 const inheritedThemes=themes;
 const inheritedConcepts=[...new Set([...(Array.isArray(a.lineageConcepts)?a.lineageConcepts:[a.name]),...(Array.isArray(b.lineageConcepts)?b.lineageConcepts:[b.name])])].slice(0,8);
 const synthesisDescription=category=>({
  "Material":"Material sintetizado. Útil para nuevas recetas.",
  "Lingote":"Aleación sintetizada. Base para fabricar componentes.",
  "Herramienta":"Herramienta sintetizada. Facilita la extracción y recolección.",
  "Arma":"Arma sintetizada. Sus parámetros determinan su rendimiento.",
  "Equipo":"Equipo sintetizado. Aporta protección y propiedades adicionales.",
  "Consumible":"Consumible sintetizado. Sus efectos dependen de sus parámetros.",
  "Criatura":"Criatura sintetizada. Sus habilidades varían en cada ciclo.",
  "Anomalía":"Anomalía sintetizada. Su efecto depende de la pasiva generada."
 }[category]||"Objeto sintetizado. Sus parámetros dependen de los materiales combinados.");
 desc=synthesisDescription(cat);
 // Evolución recursiva: al fusionar resultados sintetizados, el nombre vuelve a
 // mutar usando la identidad heredada y un sello procedural nuevo. No sustituye
 // el generador original: solo actúa sobre descendientes de una fusión.
 const fusionDepth=Math.max(Number(a.fusionDepth)||0,Number(b.fusionDepth)||0)+(isSynthesisItem(a)||isSynthesisItem(b)?1:0);
 let proceduralName=name;
 if(fusionDepth>0){
  const cores=["Eco","Centro","Vórtice","Prisma","Matriz","Quimera","Umbral","Singularidad","Rizoma","Fulgor","Esquirla","Paradoja","Crisálida","Fragmento","Simbionte","Ancla","Mímico","Reactor","Trama","Eclipse","Nódulo","Espectro","Horizonte","Cifra","Loto","Cortavacío"];
  const modifiers=["Errante","Fractal","Inverso","Soberano","Mutante","Resonante","Inestable","Espectral","Abisal","Cuántico","Viviente","Radiante","Silente","Imposible","de Fase","del Umbral","de Entropía","del Vacío"];
  const seedText=[a.name,b.name,Date.now(),Math.random(),fusionDepth].join("|");
  let hash=2166136261;for(const ch of seedText){hash^=ch.charCodeAt(0);hash=Math.imul(hash,16777619)}hash>>>=0;
  const core=cores[hash%cores.length],modifier=modifiers[Math.floor(hash/cores.length)%modifiers.length];
  const inheritedCore=String(name).split(/\s+/).slice(-3).join(" ");
  // Nombre limpio sin sufijo "· tipo": el tipo se muestra en «Tipo de objeto» de las estadísticas.
  proceduralName=`${core} ${modifier}`.trim();
  if(proceduralName.length>64)proceduralName=proceduralName.slice(0,64).trim();
  name=proceduralName;
  // No pisar un descubrimiento anterior: cada nueva anomalía obtiene identidad propia.
  const occupied=new Set([...(state.seen||[]),...Object.keys(state.discovered||{}),...Object.keys(itemDB)]);
  if(occupied.has(name)){const baseName=name;let serial=2;while(occupied.has(`${baseName} #${serial}`))serial++;name=`${baseName} #${serial}`;}
 }
 const out={name,icon,cat,r,val,desc,slot,unique:true,coherent:true,fusionDepth,semanticThemes:inheritedThemes,lineageConcepts:inheritedConcepts,trait:"Síntesis de convergencia",affix:"Síntesis de convergencia"};
 if(da.cat==="Órgano"||db.cat==="Órgano"){
  out.illegal=true;out.secondaryTrait=out.secondaryTrait?out.secondaryTrait+" · Ilegal":"Ilegal";
  if(cat!=="Órgano"&&Math.random()<0.35){out.cat="Órgano";cat="Órgano";}
 }else if(isIllegalItem(da)||isIllegalItem(db)){
  // Herencia: no fuerza ilegalidad permanente en criaturas/objetos que podrían existir legalmente
  if(cat==="Órgano"){out.illegal=true;out.secondaryTrait="Ilegal";}
  else{
   out.heritage=true;
   out.secondaryTrait=out.secondaryTrait?out.secondaryTrait+" · Herencia":"Herencia";
   // no marcar illegal:true — se puede vender en mercado normal
  }
 }
 if(cat==="Arma"){out.damage=Math.max(4,Math.round(r*5+(Number(a.damage)||0)*.25+(Number(b.damage)||0)*.25+Math.random()*r*2));out.secondaryTrait=choose(["Filo resonante","Impacto brutal","Pulso estable","Carga residual"]);}
 if(cat==="Herramienta"){out.gather=Math.max(5,Math.round(r*7+(Number(a.gather)||0)*.2+(Number(b.gather)||0)*.2+Math.random()*r*2));out.damage=Math.round(r*2+Math.random()*r);out.secondaryTrait=choose(["Extracción fina","Agarre adaptativo","Lectura mineral","Corte limpio"]);}
 if(cat==="Equipo"){out.defense=Math.max(3,Math.round(r*6+(Number(a.defense)||0)*.25+(Number(b.defense)||0)*.25+Math.random()*r*2));out.secondaryTrait=choose(["Blindaje reactivo","Disipación térmica","Sello hermético","Malla cinética"]);}
 if(cat==="Criatura"){out.abilities=rollCompanionAbilities(r);out.ability=out.abilities[0];out.companion=true;}
 if(r>=3&&Math.random()<Math.min(.42,.12+r*.055)){cat="Anomalía";out.cat=cat;out.name=["Centro de Singularidad","Umbral Espectral","Eco Temporal","Vórtice Fractal","Paradoja Cuántica","Eclipse Viviente","Marea Anómala","Prisma del Vacío"][stableHash(sourceKey+"::anomaly")%8];out.icon="🧬";const passives=[["Daño",`+${2+r*2} daño pasivo`],["Defensa",`+${r*2} defensa pasiva`],["Recolección",`+${r*5}% de recolección`],["Suerte",`+${r*3}% de hallazgos`],["Créditos",`+${r*2}% de créditos`],["Captura",`+${r*2}% de captura`]];const passive=passives[Math.floor(Math.random()*passives.length)];out.passive={type:passive[0],value:passive[1]};out.slot=null;out.desc=synthesisDescription("Anomalía");out.val+=20;}
 return out;
}
function doFuse(){if(activeTask||state.pendingFusion)return;if(!state.fusionSlots)return;const a=state.inventory.find(x=>x.id===state.fusionSlots?.A),b=state.inventory.find(x=>x.id===state.fusionSlots?.B);if(!a||!b)return toast("Selecciona dos objetos antes de fusionar.",true);if(a.id===b.id&&a.qty<2)return toast("Necesitas dos unidades si eliges el mismo objeto.",true);const aa={...a},bb={...b};beginTask("fusion",10000,()=>{if(aa.id===bb.id){takeById(aa.id,2)}else{takeById(aa.id,1);takeById(bb.id,1)}const out={...fusionOutcome(aa,bb),sourceA:aa.name,sourceB:bb.name,origin:"síntesis",trait:"Síntesis de convergencia",affix:"Síntesis de convergencia",unique:true};saveSynthesisVariant(out);/* No reemplazar el valor de esta fusión por el de una variante anterior con el mismo nombre: cada resultado conserva su propio valor calculado. */itemDB[out.name]=out;state.discovered=state.discovered||{};state.discovered[out.name]={...out,name:out.name};if(!state.seen.includes(out.name))state.seen.push(out.name);state.fusions++;xp(20);state.pendingFusion={a:aa.name,b:bb.name,out,createdAt:Date.now()};state.history.unshift({a:aa.name,b:bb.name,out:out.name,r:out.r,icon:out.icon});state.history=state.history.slice(0,3);log(`Fusión lista para reclamar: <b>${aa.name}</b> + <b>${bb.name}</b>.`);toast("Fusión terminada. Reclama el objeto para guardarlo.");render();save()}, {panel:$('fusionProgress'),bar:$('fusionBar'),percent:$('fusionPercent'),status:null,button:$('fuseBtn')});renderFusionSelects()}
function claimFusion(){if(!state.pendingFusion)return;const out=state.pendingFusion.out;itemDB[out.name]=out;addItem(out.name,1,{...out,origin:"síntesis",trait:"Síntesis de convergencia",affix:"Síntesis de convergencia",unique:true});state.pendingFusion=null;state.fusionSlots={A:null,B:null};$('fusionResult').innerHTML='';$('fusionProgress').classList.add('hidden');log(`Objeto de fusión reclamado: <b>${inventoryDisplayName(out)}</b>. Máquina reiniciada.`);toast(`Añadido al inventario: <b>${inventoryDisplayName(out)}</b>`);render();save()}
function recipePageSize(){const desktop=window.matchMedia("(min-width: 901px)").matches&&!document.body.classList.contains("layout-mobile");return desktop?6:4}
function renderRecipes(){const pageSize=recipePageSize();let filtered=recipes.filter(r=>recipeCategory==="Todos"||(r.category||info(r.out).cat)===recipeCategory).sort((a,b)=>info(a.out).r-info(b.out).r||a.name.localeCompare(b.name,"es"));const pages=Math.max(1,Math.ceil(filtered.length/pageSize));recipePage=Math.min(Math.max(1,recipePage),pages);const shown=filtered.slice((recipePage-1)*pageSize,(recipePage-1)*pageSize+pageSize);const canCraft=r=>recipeUnlocked(r)&&Object.entries(r.cost).every(([n,q])=>count(n)>=q);$("recipesGrid").innerHTML=shown.length?shown.map(r=>{const need=recipeRequiredLevel(r);const unlocked=recipeUnlocked(r);const can=canCraft(r);return `<div class="recipe-card ${unlocked?"":"recipe-locked"}"><div style="display:flex;gap:9px;align-items:center"><span class="recipe-icon">${itemIconMarkup(r.out,r.icon)}</span><div><h4>${escapeHtml(r.name)}</h4><div class="rarity r${info(r.out).r}">NIVEL ${info(r.out).r} · ${escapeHtml(r.category||info(r.out).cat)}</div></div></div><p>${escapeHtml(r.desc)}</p>${unlocked?`<div class="loot-chips">${Object.entries(r.cost).map(([n,q])=>`<span class="chip ${count(n)>=q?"common":""}">${itemIconMarkup(n,info(n).icon)} ${escapeHtml(n)} ${count(n)}/${q}</span>`).join("")}</div><button data-craft="${r.id}" ${can&&!activeTask?"":"disabled"}>Fabricar · 10 s</button>`:`<div class="small-note" style="color:#ff8098;margin-top:8px">🔒 Requiere Operador nivel ${need}. Tu nivel: ${state.level}.</div><button disabled>Bloqueada</button>`}</div>`}).join(""):'<div class="empty" style="grid-column:1/-1">No hay recetas en esta categoría.</div>';$("recipesPageInfo").textContent=`Página ${recipePage} / ${pages}`;$("recipesPrev").disabled=recipePage<=1;$("recipesNext").disabled=recipePage>=pages;document.querySelectorAll("[data-craft]").forEach(b=>b.onclick=()=>craft(b.dataset.craft))}

function craft(id){const r=recipes.find(x=>x.id===id);if(activeTask)return;if(!recipeUnlocked(r))return toast(`Receta bloqueada. Necesitas nivel de Operador ${recipeRequiredLevel(r)}.`,true);if(!Object.entries(r.cost).every(([n,q])=>count(n)>=q))return toast("Faltan materiales para esa receta.",true);beginTask("craft",Math.max(5000,10000+skillBonus("craftTime")*1000),()=>{Object.entries(r.cost).forEach(([n,q])=>take(n,q));addItem(r.out,1,{origin:"fabricación"});ensureSkillsState();state.stats.crafted=(state.stats.crafted||0)+1;xp(8);log(`Fabricación completada: <b>${r.out}</b>.`);$("craftMessage").textContent=`Fabricado: ${r.out}. Ya está en el inventario.`;toast(`Objeto fabricado: <b>${r.out}</b>`);render();save()}, {panel:$("craftProgress"),bar:$("craftBar"),percent:$("craftPercent"),button:null})}
function renderSmelt(){const ores=Object.keys(itemDB).filter(n=>/^Mena de /.test(n)).sort((a,b)=>info(a.replace(/^Mena de /,"Lingote de ")).r-info(b.replace(/^Mena de /,"Lingote de ")).r||a.localeCompare(b,"es"));const pages=Math.max(1,Math.ceil(ores.length/3));smeltPage=Math.min(Math.max(1,smeltPage),pages);const shown=ores.slice((smeltPage-1)*3,smeltPage*3);$('smeltOptions').innerHTML=shown.map(ore=>{const bar=ore.replace(/^Mena de /,"Lingote de ");const qty=2,coal=1;return `<div class="equip-slot"><div><b>${itemIconMarkup(bar,info(bar).icon)} ${escapeHtml(bar)}</b><br><span>Fundir ${qty} ${escapeHtml(ore)} + ${coal} carbón → 1 lingote</span><br><small class="muted">Mena disponible: ${count(ore)} / Carbón: ${count("Carbón")}</small></div><button class="tiny" data-smelt="${escapeHtml(ore)}" ${count(ore)>=qty&&count("Carbón")>=coal&&!activeTask?"":"disabled"}>Fundir · 10 s</button></div>`}).join('');$('smeltPageInfo').textContent=`Página ${smeltPage} / ${pages}`;$('smeltPrev').disabled=smeltPage<=1;$('smeltNext').disabled=smeltPage>=pages;document.querySelectorAll('[data-smelt]').forEach(b=>b.onclick=()=>smelt(b.dataset.smelt))}
function smelt(ore){const bar=ore.replace(/^Mena de /,"Lingote de "),n=2;if(!itemDB[bar])return toast("Esta mena aún no tiene un proceso de refinado registrado.",true);if(activeTask||count(ore)<n||count("Carbón")<1)return toast("No hay suficiente mena o carbón.",true);beginTask("smelt",Math.max(4000,10000+skillBonus("smeltTime")*1000),()=>{take(ore,n);take("Carbón",1);addItem(bar,1,{origin:"fundición"});ensureSkillsState();state.stats.smelted=(state.stats.smelted||0)+1;xp(6);log(`Horno industrial: ${ore} fundida y convertida en ${bar}.`);$('smeltMessage').textContent=`Proceso terminado: ${n} ${ore} + 1 carbón → ${bar}.`;toast(`Horno: <b>${bar}</b>`);render();save()}, {panel:$('smeltProgress'),bar:$('smeltBar'),percent:$('smeltPercent'),button:null})}
function renderBonus(){$("bonusPanel").innerHTML=`<div class="statline"><span>Bonificación de recolección equipada</span><b class="cyan">+${stat("gather")}%</b></div><div class="statline"><span>Probabilidad de botín adicional</span><b class="cyan">${Math.min(82,Math.max(0,stat("gather")+stat("loot")))}%</b></div><div class="statline"><span>Experiencia adicional</span><b class="cyan">+${stat("experience")}%</b></div><div class="statline"><span>Daño total de combate</span><b>${damage()}</b></div><div class="statline"><span>Defensa total</span><b>${defense()}</b></div><p class="small-note">Las herramientas aumentan los hallazgos. Las armas elevan el daño durante los encuentros. Las piezas fusionadas pueden tener efectos inesperados.</p>`}
function makeProceduralLoot(packId){
 const families=[
  {cat:"Material",heads:["Polvo","Núcleo","Lámina","Compuesto","Fragmento","Malla"],tails:["de basalto","de fase","de esporas","de neón","de cuarzo","de titanio"],icons:["💠","🧪","⚙️"]},
  {cat:"Herramienta",heads:["Pico","Sonda","Cortador","Extractor","Taladro","Recolector"],tails:["resonante","de campo","de fase","adaptativo","de titanio","compacto"],icons:["⛏️","🛠️","🔦"]},
  {cat:"Arma",heads:["Filo","Lanza","Disruptor","Maza","Cañón","Sable"],tails:["de neón","de fase","resonante","de obsidiana","compacto","de plasma"],icons:["⚔️","🔫","🗡️"]},
  {cat:"Equipo",heads:["Blindaje","Visor","Peto","Escudo","Traje","Manto"],tails:["reactivo","de titanio","de fase","aislante","de esporas","de neón"],icons:["🛡️","🪖","🧥"]},
  {cat:"Consumible",heads:["Inyector","Catalizador","Baliza","Carga","Antídoto","Estimulante"],tails:["de campo","reforzado","anómalo","compacto","industrial","de fase"],icons:["🧪","🔋","📡"]},
  {cat:"Anomalía",heads:["Eco","Umbral","Vórtice","Centro","Latido","Paradoja"],tails:["errante","resonante","fracturado","parasitario","silente","inverso"],icons:["🧬","🔮","⚡"]}
 ];
 const available=packId==="field"?families.filter(f=>["Material","Herramienta","Consumible"].includes(f.cat)):packId==="black"?families.filter(f=>f.cat!=="Consumible"):families;
 const f=available[Math.floor(Math.random()*available.length)],name=`${f.heads[Math.floor(Math.random()*f.heads.length)]} ${f.tails[Math.floor(Math.random()*f.tails.length)]}`;
 const r=packId==="field"?1+Math.floor(Math.random()*2):packId==="black"?2+Math.floor(Math.random()*3):3+Math.floor(Math.random()*3);
 const icon=f.icons[Math.floor(Math.random()*f.icons.length)],val=8+r*12;
 const out={name,icon,cat:f.cat,r,val,desc:`Objeto procedural de nivel ${r}. Su composición y parámetros se han generado mediante protocolos de recuperación de Anomaly Fusion.`,unique:true,procedural:true};
 const choose=a=>a[Math.floor(Math.random()*a.length)];
 if(f.cat==="Arma"){out.damage=3+r*2+Math.floor(Math.random()*r*3);out.affix=choose(["Filo resonante","Impacto brutal","Pulso estable","Carga residual"]);out.abilities=[{type:"Daño",name:out.affix,value:1+r+Math.floor(Math.random()*r),desc:`+${1+r} daño`}];}
 if(f.cat==="Equipo"){out.defense=r*2+Math.floor(Math.random()*r*2);out.slot="armor";out.affix=choose(["Blindaje reactivo","Disipación térmica","Sello hermético","Malla cinética"]);out.abilities=[{type:"Defensa",name:out.affix,value:Math.max(1,Math.floor(r/2)),desc:`+${Math.max(1,Math.floor(r/2))} defensa`}];}
 if(f.cat==="Herramienta"){out.gather=r*3+Math.floor(Math.random()*r*3);out.affix=choose(["Extracción fina","Agarre adaptativo","Lectura mineral","Corte limpio"]);out.abilities=[{type:"Recolección",name:out.affix,value:2+r*2,desc:`+${2+r*2}% recolección`}];}
 if(f.cat==="Anomalía"){const types=[["Daño",`+${r*2} daño pasivo`],["Defensa",`+${r*2} defensa pasiva`],["Suerte",`+${r*3}% de hallazgos`],["Créditos",`+${r*2}% de créditos`],["Recolección",`+${r*4}% de recolección`],["Captura",`+${r*2}% de captura`]];const passive=choose(types);out.passive={type:passive[0],value:passive[1]};out.name+=` ${uid().slice(0,2).toUpperCase()}`;}
 itemDB[out.name]=out;return out;
}
function renderSupplies(){const cards=supplyPacks.map(p=>`<div class="supply-card"><div class="zone-art" style="height:95px">${itemIconMarkup(p.name,p.icon)}</div><h4>${p.name}</h4><div class="gold credits-price" style="font-weight:900">${formatCredits(p.price,16)}</div><p>${p.desc}</p><button class="primary" data-pack="${p.id}" ${state.credits>=p.price&&!state.pendingSupply&&!activeTask?"":"disabled"}>Solicitar suministro</button></div>`).join('');if($('suppliesGridCentral'))$('suppliesGridCentral').innerHTML=cards;document.querySelectorAll('[data-pack]').forEach(b=>b.onclick=()=>buyPack(b.dataset.pack))}
function buyPack(id){const p=supplyPacks.find(p=>p.id===id);if(activeTask||state.pendingSupply)return toast("Termina o reclama el suministro pendiente antes de pedir otro.",true);if(state.credits<p.price)return toast("Créditos insuficientes.",true);state.credits-=p.price;let pool;if(id==="field")pool=["Madera","Chatarra","Carbón","Mena de hierro","Mena de cobre","Cuchillo oxidado","Hacha de madera","Batería vieja"];else if(id==="black")pool=["Pico de hierro","Hacha de hierro","Espada de cobre","Armadura de chatarra","Placa electrónica","Mena de oro","Zombie de bolsillo","Aleación extraña","Cañón de bolsillo"];else pool=["Espada de rayos","Pico de cristal","Hacha solar","Escudo de vacío","Núcleo energético","Gólem de carbón","Humano enlatado","Zombie jardinero","Traje de esporas","Tostadora mutante"];let n=id==="field"?2:id==="black"?3:4;let found=[];for(let i=0;i<n;i++){if(Math.random()<(id==="field"?.22:id==="black"?.38:.58)){found.push(makeProceduralLoot(id));continue;}let name=pool[Math.floor(Math.random()*pool.length)];if(id==="anomaly"&&Math.random()<.28){const heads=["Cuchilla","Núcleo","Martillo","Guante","Orbe","Pico","Motor","Escudo"];const tails=["de neón","paradójico","cuántico","del vacío","parasitario","solar","inestable","ancestral"];name=heads[Math.floor(Math.random()*heads.length)]+" "+tails[Math.floor(Math.random()*tails.length)]+" "+uid().slice(0,2).toUpperCase();const rr=3+Math.floor(Math.random()*3);const anomaly={name,icon:["🧬","⚡","🛡️","🔮","🪓"][Math.floor(Math.random()*5)],cat:"Anomalía",r:rr,val:rr*24,desc:`Hallazgo anómalo de la cápsula. Firma ${uid().toUpperCase()}.`,passive:[{type:"Daño",value:`+${rr*2} daño pasivo`},{type:"Defensa",value:`+${rr*2} defensa pasiva`},{type:"Suerte",value:`+${rr*3}% de hallazgos`},{type:"Créditos",value:`+${rr*2}% de créditos`},{type:"Recolección",value:`+${rr*4}% de recolección`},{type:"Captura",value:`+${rr*2}% de captura`}][Math.floor(Math.random()*6)],unique:true,procedural:true};itemDB[name]=anomaly;found.push(anomaly);}else found.push({name,...info(name)});}state.pendingSupply={pack:p.name,items:found,stage:"animating",startedAt:Date.now()};log(`Solicitud enviada: <b>${p.name}</b>. La Central está materializando una carga de procedencia incierta.`);render();save();sound(250,.12,"sine");setTimeout(()=>sound(390,.1,"triangle"),500);setTimeout(()=>{if(!state.pendingSupply)return;state.pendingSupply.stage="ready";renderSupplyDelivery();renderSupplies();save();sound(740,.16,"triangle");},3500)}
function renderSupplyDelivery(){const pending=state.pendingSupply,modal=$("supplyHud");if(!modal)return;modal.classList.toggle("hidden",!pending);if(!pending)return;const animating=pending.stage==="animating";$("supplyHudStatus").textContent=animating?"TRANSMISIÓN EN CURSO":"CARGA VERIFICADA";$("supplyHudScan").classList.toggle("hidden",!animating);$("supplyHudManifest").classList.toggle("hidden",animating);if(animating){$("supplyHudTitle").textContent="MATERIALIZANDO SUMINISTRO";$("supplyHudScanLabel").textContent="VERIFICANDO FIRMA · CARGA EN TRÁNSITO";$("supplyHudScanText").textContent=`La Central está preparando ${pending.items.length} objetos. Mantén abierto el canal hasta completar la transmisión.`;const meter=$("supplyHudMeter");meter.style.transition="none";meter.style.width="0%";requestAnimationFrame(()=>requestAnimationFrame(()=>{meter.style.transition="width 3.4s linear";meter.style.width="100%"}));}else{$("supplyHudTitle").textContent="SUMINISTRO MATERIALIZADO";$("supplyHudManifestText").textContent=`Paquete: ${pending.pack}. Se han recibido ${pending.items.length} objetos. Revísalos y pulsa Reclamar para añadirlos al inventario.`;$("supplyHudItems").innerHTML=pending.items.map((x,i)=>`<div class="supply-hud-reward" style="animation-delay:${Math.min(i*55,350)}ms"><span class="supply-hud-reward-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span class="supply-hud-reward-info"><b>${escapeHtml(x.name)}</b><small>N${x.r||info(x.name).r} · ${escapeHtml(x.cat||info(x.name).cat)}</small></span></div>`).join("");$("claimSupply").disabled=false;}}
function claimSupply(){const pending=state.pendingSupply;if(!pending||pending.stage!=='ready')return;pending.items.forEach(x=>addItem(x.name,1,{origin:"suministro",icon:x.icon,cat:x.cat,r:x.r,val:x.val,desc:x.desc,damage:x.damage,defense:x.defense,gather:x.gather,slot:x.slot,unique:x.unique,passive:x.passive,procedural:x.procedural,ability:x.ability,abilities:x.abilities,affix:x.affix,companion:x.companion}));const names=pending.items.map(x=>x.name);state.pendingSupply=null;log(`Suministro reclamado: <b>${names.join(', ')}</b>.`);toast(`Añadido al inventario: <b>${names.join(', ')}</b>`);render();save()}

function centralSaleBaseValue(x){return Math.max(1,Number(x.val)||Number(info(x.name).val)||1)}
function centralSaleUnitPrice(x){return Math.max(1,Math.ceil(centralSaleBaseValue(x)*.9*(1+stat("credits")/100)));}
function renderCentralSales(){
 const box=$("centralSaleList");if(!box)return;
 const search=($("centralSaleSearch")?.value||"").trim().toLowerCase();
 const equipped=new Set(Object.values(state.equipped||{}).filter(Boolean));
 const sellable=state.inventory.filter(x=>x.qty>0&&!equipped.has(x.id)&&!isIllegalItem(x));
 const matchesCategory=x=>centralSaleFilter==="Todos"||(centralSaleFilter==="Síntesis"?isSynthesisItem(x):centralSaleFilter==="Lingote"?(x.cat==="Lingote"||x.name.startsWith("Lingote de ")):centralSaleFilter==="Otro"?!( ["Material","Lingote","Herramienta","Arma","Equipo","Consumible","Criatura","Órgano","Pieza","Anomalía"].includes(x.cat)):x.cat===centralSaleFilter);
 const items=sellable.filter(x=>x.name.toLowerCase().includes(search)&&matchesCategory(x));
 const liveIds=new Set(sellable.map(x=>x.id));
 Object.keys(centralSaleSelection).forEach(id=>{const item=sellable.find(x=>x.id===id);if(!liveIds.has(id))delete centralSaleSelection[id];else centralSaleSelection[id]=Math.min(item.qty,Math.max(0,Number(centralSaleSelection[id])||0));if(!centralSaleSelection[id])delete centralSaleSelection[id];});
 const pageSize=5;
 const pages=Math.max(1,Math.ceil(items.length/pageSize));
 centralSalePage=Math.min(Math.max(1,centralSalePage||1),pages);
 const shown=items.slice((centralSalePage-1)*pageSize,centralSalePage*pageSize);
 const csRows=shown.map(x=>{const qty=Number(centralSaleSelection[x.id]||0),checked=qty>0;return `<div class="central-sale-row ${checked?"selected":""}" data-sale-row="${x.id}" role="button" tabindex="0" aria-pressed="${checked?"true":"false"}" aria-label="Seleccionar ${escapeHtml(x.name)}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><div><div class="sale-name">${escapeHtml(inventoryDisplayName(x))}</div><small>N${x.r||1} · ${escapeHtml(x.cat||info(x.name).cat)} · Base 100%: ${formatCredits(centralSaleBaseValue(x),12)} · Venta 90%: ${formatCredits(Math.max(1,Math.ceil(centralSaleBaseValue(x)*.9)),12)} · Pago/u: ${formatCredits(centralSaleUnitPrice(x),12)}</small></div><div class="qty-stepper ${checked?"":"is-disabled"}" data-sale-step="${x.id}"><button type="button" class="qty-btn" data-sale-minus="${x.id}" aria-label="Menos">‹</button><span class="qty-val">×${checked?qty:1}</span><button type="button" class="qty-btn" data-sale-plus="${x.id}" aria-label="Más">›</button></div></div>`;});
 while(csRows.length<pageSize)csRows.push(`<div class="central-sale-row is-placeholder" aria-hidden="true"></div>`);
 box.innerHTML=shown.length?csRows.join(""):'<div class="empty">No hay objetos legales para enviar.</div>';
 let pager=$("centralSalePager");
 if(!pager){
  pager=document.createElement("div");
  pager.id="centralSalePager";
  pager.className="pagination sale-pager";
  pager.innerHTML=`<button type="button" class="tiny" id="centralSalePrev">← Anterior</button><span class="muted" id="centralSalePageInfo">Página 1</span><button type="button" class="tiny" id="centralSaleNext">Siguiente →</button>`;
  box.after(pager);
 }
 pager.classList.toggle("hidden",items.length<=pageSize);
 if($("centralSalePageInfo"))$("centralSalePageInfo").textContent=`Página ${centralSalePage} / ${pages}`;
 if($("centralSalePrev")){$("centralSalePrev").disabled=centralSalePage<=1;$("centralSalePrev").onclick=()=>{centralSalePage=Math.max(1,centralSalePage-1);renderCentralSales();};}
 if($("centralSaleNext")){$("centralSaleNext").disabled=centralSalePage>=pages;$("centralSaleNext").onclick=()=>{centralSalePage++;renderCentralSales();};}
 const units=Object.values(centralSaleSelection).reduce((a,b)=>a+b,0);
 const total=sellable.reduce((sum,x)=>sum+(Number(centralSaleSelection[x.id]||0)*centralSaleUnitPrice(x)),0);
 if($("centralSaleUnits"))$("centralSaleUnits").textContent=units;
 if($("centralSaleTotal"))$("centralSaleTotal").innerHTML=formatCredits(total,15);
 if($("centralSaleSubmit"))$("centralSaleSubmit").disabled=units===0||!!activeTask;
 box.querySelectorAll("[data-sale-row]").forEach(row=>{
  row.onclick=e=>{if(e.target.closest(".qty-stepper"))return;const id=row.dataset.saleRow;if(centralSaleSelection[id])delete centralSaleSelection[id];else centralSaleSelection[id]=1;renderCentralSales();};
 });
 const bumpCs=(id,delta)=>{
  const item=state.inventory.find(x=>x.id===id);
  const max=item?item.qty:1;
  let q=Number(centralSaleSelection[id]||0);
  if(!q&&delta>0)q=1; else q=Math.max(0,Math.min(max,q+delta));
  if(q<=0)delete centralSaleSelection[id]; else centralSaleSelection[id]=q;
  renderCentralSales();
 };
 box.querySelectorAll("[data-sale-minus]").forEach(btn=>btn.onclick=e=>{e.stopPropagation();bumpCs(btn.dataset.saleMinus,-1);});
 box.querySelectorAll("[data-sale-plus]").forEach(btn=>btn.onclick=e=>{e.stopPropagation();bumpCs(btn.dataset.salePlus,1);});
}

function renderExtractTable(){
 const host=$("extractOrganChoices");
 if(!host)return;
 const x=state.inventory.find(i=>i.id===extractCreatureId);
 const icon=$("extractSlotIcon"),label=$("extractSlotLabel"),btn=$("extractStartBtn"),clearBtn=$("clearExtractCreature");
 if(clearBtn){clearBtn.classList.toggle("hidden",!x);clearBtn.disabled=!!activeTask}
 if(!x){
  if(icon)icon.innerHTML="＋";
  if(label)label.textContent="Sin criatura";
  host.classList.remove('has-choices');if($('extractUnitArea'))$('extractUnitArea').classList.remove('has-choices');host.classList.remove('has-choices');if($('extractUnitArea'))$('extractUnitArea').classList.remove('has-choices');host.style.width='280px';host.style.display='block';host.innerHTML='<div class="empty" style="width:100%;box-sizing:border-box;margin:0;text-align:center;">Elige una criatura orgánica del inventario.</div>';
  if(btn)btn.disabled=true;
  return;
 }
 if(icon)icon.innerHTML=itemIconMarkup(x.name,x.icon||info(x.name).icon);
 if(label)label.textContent=inventoryDisplayName(x)+" · N"+(x.r||1);
 if(isRoboticCreature(x)){
  host.classList.remove('has-choices');host.innerHTML='<div class="empty" style="width:100%;text-align:center;box-sizing:border-box">Esta unidad es mecánica/robótica: no tiene órganos extraíbles.</div>';if(btn)btn.disabled=true;
  return;
 }
 const opts=organCandidatesForCreature(x);
 if(!opts.length){
  host.classList.remove('has-choices');host.innerHTML='<div class="empty">No se detectan órganos extraíbles en esta criatura.</div>';
  if(btn)btn.disabled=true;
  return;
 }
 Object.keys(extractSelected).forEach(k=>{if(!opts.includes(k))delete extractSelected[k]});
 const selectedNames=Object.keys(extractSelected);
 const bonus=equippedExtractBonus();
 const maxR=Math.max(1,Math.min(5,Number(x.r)||1));
 const globalChance=extractionSuccessChance(selectedNames.length||1,maxR);
 const shown=opts; // sin paginación en la mesa; el picker de criatura sí pagina
 
 host.classList.add('has-choices');if($('extractUnitArea'))$('extractUnitArea').classList.add('has-choices');host.style.width='min(720px,100%)';host.style.display='grid';
host.innerHTML=shown.map(name=>{
  const on=!!extractSelected[name];
  const ic=itemIconMarkup(name,info(name).icon||"🫀");
  return `<button type="button" class="extract-organ-opt ${on?"on":""}" data-extract-organ="${escapeHtml(name)}" aria-pressed="${on?"true":"false"}"><span class="item-icon extract-organ-icon">${ic}</span><span class="extract-organ-text"><b>${escapeHtml(name)}</b><small>Órgano · nivel 1–${maxR}</small></span></button>`;
 }).join("")+`<div class="extract-summary" style="grid-column:1/-1">Seleccionados: <b>${selectedNames.length}</b> · Bonus pinzas: <b>+${bonus}%</b><br><b style="color:var(--cyan)">Éxito global: ${selectedNames.length?globalChance:0}%</b> · Si falla, no se obtiene ningún órgano. La criatura se consume siempre.<br><small>Nivel de órganos ≤ N${maxR} de la criatura.</small></div>`;
 host.querySelectorAll("[data-extract-organ]").forEach(btn=>{
  btn.onclick=()=>{
   const n=btn.dataset.extractOrgan;
   if(extractSelected[n])delete extractSelected[n];else extractSelected[n]=true;
   renderExtractTable();
  };
 });
 if(btn)btn.disabled=!selectedNames.length||!!activeTask;
}

function startExtraction(){
 if(activeTask)return;
 const x=state.inventory.find(i=>i.id===extractCreatureId);
 if(!x)return toast("Selecciona una criatura.",true);
 if(isRoboticCreature(x))return toast("No se pueden extraer órganos de unidades robóticas.",true);
 const selected=Object.keys(extractSelected);
 if(!selected.length)return toast("Selecciona al menos un órgano.",true);
 const creatureName=x.name;
 const creatureId=x.id;
 const creatureLevel=Math.max(1,Math.min(5,Number(x.r)||1));
 const chance=extractionSuccessChance(selected.length,creatureLevel);
 const organNames=selected.slice();
 beginTask("extract",10000,()=>{
  if(!takeById(creatureId,1)){toast("La criatura ya no está disponible.",true);return}
  // Un solo tirada: éxito o fracaso total
  if(Math.random()*100>=chance){
   extractSelected={};extractCreatureId=null;
   log(`Extracción fallida sobre <b>${escapeHtml(creatureName)}</b>. La criatura se pierde y no se obtiene ningún órgano.`);
   if($("extractMessage"))$("extractMessage").innerHTML=`Fallo de extracción (${chance}%). Criatura consumida. Sin órganos.`;
   toast("Extracción fallida. No se obtuvo nada.",true);
   renderExtractTable();render();save();
   return;
  }
  const got=[];
  organNames.forEach(name=>{
   const r=rollOrganLevel(creatureLevel);
   const base=info(name)||{};
   const val=Math.max(12,Math.round((20+(r*14))*(0.9+Math.random()*0.25)));
   addItem(name,1,{
    origin:"extracción",
    cat:"Órgano",
    r,
    val,
    trait:"Ilegal",
    affix:"Ilegal",
    illegal:true,
    unique:true,
    desc:`Órgano N${r} extraído de ${creatureName}. Rasgo ilegal.`,
    icon:base.icon||"🫀"
   });
   got.push(`${name} N${r}`);
  });
  extractSelected={};extractCreatureId=null;
  xp(8+creatureLevel*2+got.length*3);
  log(`Extracción exitosa (${chance}%) de <b>${escapeHtml(creatureName)}</b>: ${got.map(escapeHtml).join(", ")}.`);
  if($("extractMessage"))$("extractMessage").innerHTML=`Éxito (${chance}%). Obtenido: <b>${got.map(escapeHtml).join(", ")}</b>.`;
  toast(`Extracción OK: ${got.join(", ")}`);
  renderExtractTable();render();save();
 },{panel:$("extractProgress"),bar:$("extractBar"),percent:$("extractPercent"),status:null,button:$("extractStartBtn")});
}

function blackMarketUnitPrice(x){
 // mejor pago que el 90% legal
 const base=Math.max(1,Number(x.val)||Number(info(x.name).val)||1);
 return Math.max(1,Math.ceil(base*1.25*(1+stat("credits")/100)));
}
function renderBlackMarket(){/* movido a Mercado */}
function sellBlackSelection(){
 if(activeTask)return;
 const selected=Object.entries(blackSaleSelection).map(([id,qty])=>({x:state.inventory.find(i=>i.id===id),qty:Number(qty)})).filter(o=>o.x&&o.qty>0&&isIllegalItem(o.x));
 if(!selected.length)return toast("Selecciona mercancía ilegal.",true);
 if(selected.some(({x,qty})=>Object.values(state.equipped||{}).includes(x.id)||qty>x.qty))return toast("La selección ha cambiado.",true);
 const total=selected.reduce((sum,{x,qty})=>sum+blackMarketUnitPrice(x)*qty,0);
 const units=selected.reduce((s,o)=>s+o.qty,0);
 selected.forEach(({x,qty})=>takeById(x.id,qty));
 state.credits+=total;
 blackSaleSelection={};
 log(`Mercado Negro: vendidas ${units} unidad(es) ilegales por <b>${total.toLocaleString("es-ES")} cr.</b>.`);
 toast(`Mercado Negro: +${total.toLocaleString("es-ES")} cr.`);
 if(typeof soundSale==="function")soundSale();
 renderBlackMarket();render();save();
}

function sellCentralSelection(){if(activeTask)return;const selected=Object.entries(centralSaleSelection).map(([id,qty])=>({x:state.inventory.find(i=>i.id===id),qty:Number(qty)})).filter(o=>o.x&&o.qty>0&&!isIllegalItem(o.x));if(!selected.length)return toast("Selecciona al menos un objeto para vender.",true);if(selected.some(({x,qty})=>Object.values(state.equipped||{}).includes(x.id)||qty>x.qty))return toast("La selección ha cambiado. Revísala antes de vender.",true);const total=selected.reduce((sum,{x,qty})=>sum+centralSaleUnitPrice(x)*qty,0),units=selected.reduce((sum,o)=>sum+o.qty,0);selected.forEach(({x,qty})=>takeById(x.id,qty));state.credits+=total;soundSale();centralSaleSelection={};log(`Envío de suministro vendido: ${units} unidad(es) en ${selected.length} tipo(s) de objeto por <b>${total.toLocaleString("es-ES")} créditos</b>.`);toast(`Venta completada: +${total.toLocaleString("es-ES")} créditos`);render();save();}
function renderInventory(){const search=$("inventorySearch").value.toLowerCase(),sort=inventorySort;let list=state.inventory.filter(x=>(inventoryFilter==="Todos"||(inventoryFilter==="Síntesis"?isSynthesisItem(x):x.cat===inventoryFilter))&&x.name.toLowerCase().includes(search));list.sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="value"?b.val-a.val:b.r-a.r);const pages=Math.max(1,Math.ceil(list.length/12));inventoryPage=Math.min(inventoryPage,pages);const shown=list.slice((inventoryPage-1)*12,inventoryPage*12);$("inventoryCountTag").textContent=`${list.reduce((s,x)=>s+x.qty,0)} OBJETOS`;$("inventoryGrid").innerHTML=shown.length?shown.map(x=>itemCard(x,{compact:true})).join(""):'<div class="empty" style="grid-column:1/-1">No se encontraron objetos en esta categoría.</div>';$("pageInfo").textContent=`Página ${inventoryPage} / ${pages}`; $("prevPage").disabled=inventoryPage<=1;$("nextPage").disabled=inventoryPage>=pages}
function optionsForSlot(slot){return state.inventory.filter(x=>slot==="anomaly"?x.cat==="Anomalía":info(x.name).slot===slot||x.slot===slot)}
function renderEquipment(){const map=[['pick','pickSlot','chooseEquipPick','unequipPick'],['axe','axeSlot','chooseEquipAxe','unequipAxe'],['tongs','tongsSlot','chooseEquipTongs','unequipTongs'],['weapon','weaponSlot','chooseEquipWeapon','unequipWeapon'],['armor','armorSlot','chooseEquipArmor','unequipArmor'],['anomaly','anomalySlot','chooseEquipAnomaly','unequipAnomaly'],['companion','companionSlot','chooseEquipCompanion','unequipCompanion']];map.forEach(([slot,label,button,unequipButton])=>{const x=state.inventory.find(x=>x.id===state.equipped[slot]);$(label).textContent=x?inventoryDisplayName(x):"Sin equipar";$(button).onclick=()=>openPicker("equip",slot);const ub=$(unequipButton);ub.classList.toggle('hidden',!x);ub.onclick=()=>{if(!state.equipped[slot])return;const old=state.inventory.find(i=>i.id===state.equipped[slot]);delete state.equipped[slot];log(`Objeto desequipado: ${inventoryDisplayName(old||{})}.`);renderEquipment();renderStats();renderBonus();save();sound(320)}});const eq=Object.values(state.equipped).map(id=>state.inventory.find(x=>x.id===id)).filter(Boolean);$("equippedCards").innerHTML=eq.length?eq.map(x=>itemCard(x)).join(""):'<div class="empty" style="grid-column:1/-1">Todavía no tienes equipo equipado. Fabrica o encuentra herramientas y armas.</div>'}
function renderPendingFusion(){const p=state.pendingFusion;if(!p){$('fusionResult').innerHTML='';$('fuseBtn').textContent='⟁ INICIAR FUSIÓN';return}const out=p.out;$('fusionResult').innerHTML=`<div class="result-box fusion-ready"><div class="eyebrow">RESULTADO · RECLAMACIÓN PENDIENTE</div><div style="display:flex;gap:14px;align-items:center;margin:12px 0"><div class="fusion-output-icon">${itemIconMarkup(out.name,out.icon)}</div><div><h3 style="margin:0 0 6px">${escapeHtml(inventoryDisplayName(out))}</h3><div class="rarity r${out.r}">NIVEL ${out.r} · ${rarityNames[out.r]}</div><p class="small-note">${escapeHtml(out.desc)}</p></div></div><div class="loot-chips"><span class="chip">${escapeHtml(out.cat)}</span><span class="chip">Valor: ${out.val} cr.</span><span class="chip">Síntesis de convergencia</span></div><button class="primary" id="claimFusion" style="width:100%;margin-top:14px">✓ RECLAMAR OBJETO Y REINICIAR MÁQUINA</button></div>`;$('claimFusion').onclick=claimFusion;$('fuseBtn').disabled=true;$('fuseBtn').textContent='RECLAMA EL RESULTADO';$('chooseFusionA').disabled=true;$('chooseFusionB').disabled=true}
function renderFusionHistory(){$("fusionHistory").innerHTML=state.history.length?state.history.map(h=>`<div class="activity">${itemIconMarkup(h.out,info(h.out).icon)} ${escapeHtml(inventoryDisplayName({name:h.a}))} + ${escapeHtml(inventoryDisplayName({name:h.b}))} → <b>${escapeHtml(inventoryDisplayName({name:h.out}))}</b> <span class="rarity r${h.r}">N${h.r}</span></div>`).join(""):'<div class="empty">Todavía no has fusionado nada.</div>';}
function obtainedHow(name){const d0=knownInfo(name);if(d0.cat==="Órgano")return["Mesa de extracción (Clínica): se obtiene al procesar criaturas orgánicas.","Mercado Negro: compra de contrabando ilegal."];const sources=[];zones.forEach(z=>{if(z.loot.includes(name))sources.push("Exploración: "+z.name)});recipes.filter(r=>r.out===name).forEach(()=>sources.push("Mesa de creación: receta disponible"));if(/Lingote de /.test(name))sources.push("Horno industrial: funde la mena correspondiente con carbón");const d=knownInfo(name);if(d.cat==="Criatura")sources.push("Combate: derrota hostiles y consigue estabilizar una criatura tras el encuentro");if(d.cat==="Anomalía"||d.procedural||state.history.some(h=>h.out===name))sources.push("Fusión o recuperación procedural: resultado generado por procesos anómalos");if(!sources.length)sources.push("Exploración, fabricación o suministro; algunos ejemplares solo aparecen mediante procesos procedurales");return [...new Set(sources)]}
function renderRegistry(){
const search=$("registrySearch").value.trim().toLowerCase(),sort=registrySort;
if(registryFilter==="Síntesis")registryFilter="Todos";
let list=registryMode==="synthesis"
 ? [...new Set(state.seen||[])].map(name=>({name,...knownInfo(name)})).filter(isSynthesisItem)
 : getBaseRegistryItems();
// Base y Refinadora comparten la misma fuente de descubrimientos.
// Filtros de categoría (sin opción Síntesis; ya está separado por pestaña)
list=list.filter(x=>(registryFilter==="Todos"||x.cat===registryFilter)&&x.name.toLowerCase().includes(search));
list.sort((a,b)=>sort==="rarity"?b.r-a.r||a.name.localeCompare(b.name,"es"):sort==="value"?b.val-a.val||a.name.localeCompare(b.name,"es"):a.name.localeCompare(b.name,"es"));
const pages=Math.max(1,Math.ceil(list.length/10));
registryPage=Math.min(Math.max(1,registryPage),pages);
const shown=list.slice((registryPage-1)*10,registryPage*10);
const modeLabel=registryMode==="synthesis"?"SÍNTESIS":"BASE";
$("registryCount").textContent=`${list.length} ${modeLabel}`;
const emptyMsg=registryMode==="synthesis"
  ?'Aún no has registrado objetos de síntesis. Fusiona objetos en la Máquina de fusión para descubrirlos.'
  :'Aún no has registrado objetos base. Explora, fabrica o encuentra materiales para descubrirlos.';
$("registryGrid").innerHTML=shown.length?shown.map(x=>`<button class="registry-tile rarity-${x.r}" data-registry-item="${escapeHtml(x.name)}"><span class="registry-icon">${itemIconMarkup(x.name,x.icon)}</span><b title="${escapeHtml(x.name)}">${escapeHtml(inventoryDisplayName(x))}</b><small>N${x.r} · ${escapeHtml(x.cat)}</small></button>`).join(""):`<div class="empty" style="grid-column:1/-1">${emptyMsg}</div>`;
$("registryPageInfo").textContent=`Página ${registryPage} / ${pages}`;
$("registryPrev").disabled=registryPage<=1;
$("registryNext").disabled=registryPage>=pages;
// Actualizar pestañas de modo
document.querySelectorAll("[data-registry-mode]").forEach(b=>b.classList.toggle("active",b.dataset.registryMode===registryMode));
document.querySelectorAll("[data-registry-item]").forEach(b=>b.onclick=()=>openRegistryItem(b.dataset.registryItem));
}
function openRegistryItem(name,level=null){
 const base=knownInfo(name);
 const isOrgan=base.cat==="Órgano";
 const synthVariants=Array.isArray(state.synthesisVariants?.[name])?state.synthesisVariants[name]:[];
 const organVars=organVariantsFor(name);
 const variants=isOrgan?organVars:(isSynthesisItem(base)?synthVariants:[]);
 const selectedLevel=level==null?(variants.length?Math.max(...variants.map(v=>Number(v.r)||1)):Number(base.r)||1):Number(level);
 const d=variants.find(v=>Number(v.r)===selectedLevel)||{...base,r:selectedLevel};
 const how=obtainedHow(name);
 const titleName=inventoryDisplayName({name});
 $("registryModalTitle").textContent="REGISTRO · "+titleName;
 const highestLevel=variants.length?Math.max(...variants.map(q=>Number(q.r)||1)):selectedLevel;
 const showVersions=(isOrgan||isSynthesisItem(base))&&variants.length>0;
 const variantHtml=showVersions?`<div class="section-title" style="margin-top:14px"><h3>NIVELES DESCUBIERTOS</h3><span class="small-note">${variants.length} desbloqueado${variants.length===1?"":"s"}</span></div><div class="sort-menu synthesis-level-select"><button type="button" class="sort-trigger" id="synthesisLevelTrigger" aria-haspopup="listbox" aria-expanded="false"><span>Consultar versión: <span class="sort-current">N${selectedLevel}${selectedLevel===highestLevel?" · Mejorado":""}</span></span><span aria-hidden="true">⌄</span></button><div class="sort-options hidden" id="synthesisLevelOptions" role="listbox" aria-label="Niveles descubiertos">${variants.map(v=>`<button type="button" data-synthesis-level="${Number(v.r)}" aria-selected="${Number(v.r)===selectedLevel}">N${Number(v.r)}${Number(v.r)===highestLevel?" · Mejorado":""}</button>`).join("")}</div></div><p class="small-note">${isOrgan?"Niveles de órgano ya extraídos o comprados. Cada nivel tiene su propio valor. Consultar no cambia tu inventario.":"Solo aparecen niveles que ya has descubierto. Cambiar aquí solo consulta la variante."}</p>`:"";
 const range=getObservedRange({...d,name,cat:d.cat||base.cat});
 const valMin=range?Number(range.min):Math.max(1,Number(d.val)||Number(base.val)||0);
 const valMax=range?Number(range.max):valMin;
 // Precio fijo: objetos base del juego. Variables: síntesis, órganos, procedurales.
 // TODOS los de síntesis → Valor Aprox. Base y órganos no-síntesis → Valor Base fijo.
 const isSynth=isSynthesisItem(base)||isSynthesisItem(d)||!!(d&&d.trait==="Síntesis de convergencia");
 const fixedPrice=!isSynth&&!base.procedural&&!(d&&d.procedural);
 const approxChip=fixedPrice
  ?`<span class="chip">Valor Base: ${Math.max(1,Number(d.val)||Number(base.val)||0)}</span>`
  :`<span class="chip">Valor Aprox: ${valMin} - ${valMax}</span>`;
 const traitBits=[d.trait,d.secondaryTrait,d.affix].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);
 $("registryModalBody").innerHTML=`<div class="registry-details"><div class="registry-big-icon">${itemIconMarkup(name,d.icon||info(name).icon)}</div><div><div class="rarity r${d.r}">NIVEL ${d.r} · ${rarityNames[d.r]||""}</div><p><b title="${escapeHtml(name)}">${escapeHtml(titleName)}</b><br>${escapeHtml(d.desc||base.desc||"Sin descripción disponible.")}</p><div class="loot-chips"><span class="chip">${escapeHtml(d.cat||base.cat||"?")}</span>${approxChip}${traitBits.map(t=>`<span class="chip">Rasgo: ${escapeHtml(String(t))}</span>`).join("")}</div>${variantHtml}<div class="section-title" style="margin-top:16px"><h3>¿CÓMO SE OBTIENE?</h3></div><ul class="how-list">${(how||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join("")||"<li>Origen desconocido.</li>"}</ul></div></div>`;
 $("registryModal").classList.remove("hidden");
 const trig=$("synthesisLevelTrigger"),opts=$("synthesisLevelOptions");
 if(trig&&opts){
  trig.onclick=e=>{e.stopPropagation();const open=opts.classList.contains("hidden");closeSortMenus();if(open){opts.classList.remove("hidden");trig.setAttribute("aria-expanded","true")}}
  opts.querySelectorAll("[data-synthesis-level]").forEach(b=>b.onclick=e=>{e.stopPropagation();openRegistryItem(name,Number(b.dataset.synthesisLevel));});
 }
}

function openInventoryItem(id){const x=state.inventory.find(i=>i.id===id);if(!x)return;const d={...info(x.name),...x};const skills=Array.isArray(d.abilities)?d.abilities:(d.ability?[d.ability]:[]);const chips=[`<span class="chip">Tipo: ${escapeHtml(d.cat||"Otro")}</span>`,`<span class="chip">Nivel ${Number(d.r)||1} · ${escapeHtml(rarityNames[Number(d.r)||1]||"Común")}</span>`,`<span class="chip">Valor base (100%): ${Number(d.val||info(d.name).val||1)} cr.</span>`];if(isSynthesisItem(d))chips.push(`<span class="chip">Rasgo de fusión: Síntesis de convergencia</span>`);else if(d.affix)chips.push(`<span class="chip">Rasgo: ${escapeHtml(d.affix)}</span>`);if(d.secondaryTrait)chips.push(`<span class="chip">Rasgo adicional: ${escapeHtml(d.secondaryTrait)}</span>`);if(d.passive)chips.push(`<span class="chip">Pasiva: ${escapeHtml(d.passive.value||d.passive.type||"")}</span>`);skills.forEach(a=>chips.push(`<span class="chip">Habilidad: ${escapeHtml(a.name)}${a.desc?" · "+escapeHtml(a.desc):""}</span>`));if(d.damage)chips.push(`<span class="chip">Daño: +${d.damage}</span>`);if(d.defense)chips.push(`<span class="chip">Defensa: +${d.defense}</span>`);if(d.gather)chips.push(`<span class="chip">Recolección: +${d.gather}%</span>`);if(d.health)chips.push(`<span class="chip">Salud: +${d.health}</span>`);if(d.speed)chips.push(`<span class="chip">Velocidad: +${d.speed}</span>`);if(d.crit)chips.push(`<span class="chip">Crítico: +${d.crit}</span>`);const slot=Object.entries(state.equipped||{}).find(([,eid])=>eid===x.id)?.[0];$("inventoryDetailTitle").textContent=inventoryDisplayName(x);$("inventoryDetailBody").innerHTML=`<div class="inventory-detail-head"><div class="registry-big-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</div><div><div class="rarity r${Number(d.r)||1}">NIVEL ${Number(d.r)||1} · ${escapeHtml(rarityNames[Number(d.r)||1]||"COMÚN")}</div><h3 class="inventory-detail-name">${escapeHtml(inventoryDisplayName(x))}</h3><div class="small-note">Cantidad: ×${x.qty}${slot?` · <span class="equip-badge-inline">${typeof hudIconMarkup==="function"?hudIconMarkup("lock",12):""} Equipado (${escapeHtml(slot)}) — bloqueado hasta desequipar</span>`:""}</div></div></div><p class="inventory-detail-description">${escapeHtml(d.desc||"Sin descripción disponible.")}</p><div class="loot-chips inventory-detail-chips">${chips.join("")}</div><div class="section-title"><h3>INFORMACIÓN DEL OBJETO</h3></div><div class="inventory-detail-stats">${[["Tipo de objeto",objectTypeLabel(d)],["Valor",`${Number(d.val||info(d.name).val||1)} cr.`],["Rareza",rarityNames[Number(d.r)||1]||"Común"],["Nivel",`N${Number(d.r)||1}`],...(d.origin?[
      ["Origen", (()=>{
        const zonesFound=itemOriginZones(d.name||x.name);
        if(zonesFound.length)return zonesFound.join(", ");
        return String(d.origin);
      })()]
    ]:[] ),...(d.fusionDepth?[["Generación de fusión",d.fusionDepth]]:[])].map(([k,v])=>`<div class="statline"><span>${escapeHtml(k)}</span><b>${escapeHtml(String(v))}</b></div>`).join("")}</div>`;$("inventoryDetailModal").classList.remove("hidden")}

function applyLayoutMode(mode){const valid=["auto","mobile","pc16"].includes(mode)?mode:"auto";state.settings.layoutMode=valid;document.body.classList.toggle("layout-mobile",valid==="mobile");document.body.classList.toggle("layout-pc16",valid==="pc16");document.body.classList.toggle("layout-auto",valid==="auto");const select=$("layoutModeSelect");if(select&&select.value!==valid)select.value=valid;try{fixSidebarScroll()}catch(e){}}
function render(){if(document.querySelector("#page-city.active")){try{renderCityPlaces()}catch(e){}}renderPendingFusion();renderSupplyDelivery();renderStats();renderZoneCards();renderZoneDetail();renderZoneLoot();renderFusionSelects();renderRecipes();renderSmelt();renderBonus();renderSupplies();renderCentralSales();renderExtractTable();renderSpawnTable();renderInventory();renderEquipment();renderFusionHistory();renderRegistry();save()}
 try{ensureMissions();if($("missionsBadge"))$("missionsBadge").textContent=String((state.missions||[]).length);trackAchievement()}catch(_e){}
$("fuseBtn").addEventListener("click",doFuse);if($("claimSupply"))$("claimSupply").addEventListener("click",claimSupply);$("chooseFusionA").onclick=()=>openPicker("fusion","A");$("chooseFusionB").onclick=()=>openPicker("fusion","B");$("clearFusionA").onclick=()=>{if(state.fusionSlots)state.fusionSlots.A=null;renderFusionSelects();sound(400,.05,"sine")};$("clearFusionB").onclick=()=>{if(state.fusionSlots)state.fusionSlots.B=null;renderFusionSelects();sound(400,.05,"sine")};$("fightBtn").addEventListener("click",fight);$("closePicker").onclick=()=>{const qb=$("pickerQtyBar"),qc=$("pickerQtyConfirm");if(qb)qb.classList.add("hidden");if(qc)qc.classList.add("hidden");$("inventoryPicker").classList.add("hidden")};$("inventoryPicker").addEventListener("click",e=>{if(e.target===$("inventoryPicker"))$("inventoryPicker").classList.add("hidden")});$("pickerSearch").addEventListener("input",()=>{pickerPage=1;renderPicker()});$("pickerFilterTrigger").onclick=()=>{$("pickerFilterOptions").classList.toggle("hidden");$("pickerFilterTrigger").setAttribute("aria-expanded",!$("pickerFilterOptions").classList.contains("hidden"))};document.querySelectorAll("[data-picker-filter]").forEach(b=>b.onclick=()=>{pickerFilter=b.dataset.pickerFilter;$("pickerFilterLabel").textContent=pickerFilter;document.querySelectorAll("[data-picker-filter]").forEach(x=>x.setAttribute("aria-selected",x===b?"true":"false"));$("pickerFilterOptions").classList.add("hidden");pickerPage=1;renderPicker()});$("centralSaleSearch").addEventListener("input",renderCentralSales);$("centralSaleFilterTrigger").onclick=()=>{const menu=$("centralSaleFilterOptions"),opening=menu.classList.contains("hidden");closeSortMenus(opening?menu.id:null);menu.classList.toggle("hidden",!opening);$("centralSaleFilterTrigger").setAttribute("aria-expanded",String(opening))};document.querySelectorAll("[data-sale-filter]").forEach(b=>b.onclick=()=>{centralSaleFilter=b.dataset.saleFilter;$("centralSaleFilterLabel").textContent=centralSaleFilter;document.querySelectorAll("[data-sale-filter]").forEach(x=>x.setAttribute("aria-selected",x===b?"true":"false"));$("centralSaleFilterOptions").classList.add("hidden");$("centralSaleFilterTrigger").setAttribute("aria-expanded","false");renderCentralSales()});$("centralSaleSelectAll").onclick=()=>{const equipped=new Set(Object.values(state.equipped||{}).filter(Boolean)),search=$("centralSaleSearch").value.trim().toLowerCase();state.inventory.filter(x=>x.qty>0&&!equipped.has(x.id)&&x.name.toLowerCase().includes(search)&&(centralSaleFilter==="Todos"||(centralSaleFilter==="Síntesis"?isSynthesisItem(x):centralSaleFilter==="Lingote"?(x.cat==="Lingote"||x.name.startsWith("Lingote de ")):centralSaleFilter==="Otro"?!( ["Material","Lingote","Herramienta","Arma","Equipo","Consumible","Criatura","Órgano","Pieza","Anomalía"].includes(x.cat)):x.cat===centralSaleFilter))).forEach(x=>centralSaleSelection[x.id]=x.qty);renderCentralSales()};$("centralSaleClear").onclick=()=>{centralSaleSelection={};renderCentralSales()};$("centralSaleSubmit").onclick=sellCentralSelection;
if($("chooseExtractCreature"))$("chooseExtractCreature").onclick=()=>openPicker("extract");
if($("extractStartBtn"))$("extractStartBtn").onclick=startExtraction;

if($("spawnStartBtn"))$("spawnStartBtn").onclick=startCreatureSpawn;

if($("chooseSpawnAnomaly"))$("chooseSpawnAnomaly").onclick=()=>openPicker("spawnAnomaly");
if($("clearSpawnAnomaly"))$("clearSpawnAnomaly").onclick=()=>{spawnAnomalyId=null;renderSpawnTable();sound(400,.05,"sine")};
document.querySelectorAll("[data-market-buy-filter]").forEach(b=>b.onclick=()=>{marketBuyFilter=b.dataset.marketBuyFilter;marketBuyPage=1;document.querySelectorAll("[data-market-buy-filter]").forEach(x=>x.classList.toggle("active",x===b));renderMarketBuy(false)});
document.querySelectorAll("[data-market-bbuy-filter]").forEach(b=>b.onclick=()=>{marketBlackBuyFilter=b.dataset.marketBbuyFilter;marketBlackBuyPage=1;document.querySelectorAll("[data-market-bbuy-filter]").forEach(x=>x.classList.toggle("active",x===b));renderMarketBuy(true)});


if($("clearExtractCreature"))$("clearExtractCreature").onclick=()=>{extractCreatureId=null;extractSelected={};extractOrgansPage=1;renderExtractTable();sound(400,.05,"sine")};
for(let i=0;i<5;i++){
 const ii=i;
 if($("chooseSpawn"+ii))$("chooseSpawn"+ii).onclick=()=>openPicker("spawn",ii);
 if($("clearSpawn"+ii))$("clearSpawn"+ii).onclick=()=>{delete spawnSelected[ii];renderSpawnTable();sound(400,.05,"sine")};
}
if($("marketBuyPrev"))$("marketBuyPrev").onclick=()=>{marketBuyPage=Math.max(1,marketBuyPage-1);renderMarketBuy(false)};
if($("marketBuyNext"))$("marketBuyNext").onclick=()=>{marketBuyPage++;renderMarketBuy(false)};
if($("marketBlackBuyPrev"))$("marketBlackBuyPrev").onclick=()=>{marketBlackBuyPage=Math.max(1,marketBlackBuyPage-1);renderMarketBuy(true)};
if($("marketBlackBuyNext"))$("marketBlackBuyNext").onclick=()=>{marketBlackBuyPage++;renderMarketBuy(true)};
function closeMobileNavPanels(){["mobilePanelSystems","mobilePanelManage"].forEach(id=>{const p=$(id);if(p)p.classList.add("hidden")});["mobileGroupSystems","mobileGroupManage"].forEach(id=>{const b=$(id);if(b)b.setAttribute("aria-expanded","false")});}
if($("mobileGroupSystems"))$("mobileGroupSystems").onclick=()=>{const p=$("mobilePanelSystems");const open=p&&p.classList.contains("hidden");closeMobileNavPanels();if(open&&p){p.classList.remove("hidden");$("mobileGroupSystems").setAttribute("aria-expanded","true")}};
if($("mobileGroupManage"))$("mobileGroupManage").onclick=()=>{const p=$("mobilePanelManage");const open=p&&p.classList.contains("hidden");closeMobileNavPanels();if(open&&p){p.classList.remove("hidden");$("mobileGroupManage").setAttribute("aria-expanded","true")}};

document.querySelectorAll("[data-market-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-market-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("#page-market .market-section").forEach(x=>x.classList.toggle("active",x.id==="market-"+b.dataset.marketTab));if(b.dataset.marketTab==="buy")renderMarketBuy(false);if(b.dataset.marketTab==="buyBlack")renderMarketBuy(true);if(b.dataset.marketTab==="sell")renderMarketSell(false);if(b.dataset.marketTab==="sellBlack")renderMarketSell(true);});
document.querySelectorAll("[data-market-buy-mode]").forEach(b=>b.onclick=()=>{marketBuyMode=b.dataset.marketBuyMode;document.querySelectorAll("[data-market-buy-mode]").forEach(x=>x.classList.toggle("active",x===b));renderMarketBuy(false)});
document.querySelectorAll("[data-market-bbuy-mode]").forEach(b=>b.onclick=()=>{marketBlackBuyMode=b.dataset.marketBbuyMode;document.querySelectorAll("[data-market-bbuy-mode]").forEach(x=>x.classList.toggle("active",x===b));renderMarketBuy(true)});
if($("marketBuySearch"))$("marketBuySearch").addEventListener("input",()=>renderMarketBuy(false));
if($("marketBlackBuySearch"))$("marketBlackBuySearch").addEventListener("input",()=>renderMarketBuy(true));
if($("marketSellSearch"))$("marketSellSearch").addEventListener("input",()=>renderMarketSell(false));
if($("marketBlackSellSearch"))$("marketBlackSellSearch").addEventListener("input",()=>renderMarketSell(true));
if($("marketSellSelectAll"))$("marketSellSelectAll").onclick=()=>{const equipped=new Set(Object.values(state.equipped||{}).filter(Boolean));state.inventory.filter(x=>x.qty>0&&!equipped.has(x.id)&&!isIllegalItem(x)).forEach(x=>marketSellSelection[x.id]=x.qty);renderMarketSell(false)};
if($("marketSellClear"))$("marketSellClear").onclick=()=>{marketSellSelection={};renderMarketSell(false)};
if($("marketSellSubmit"))$("marketSellSubmit").onclick=()=>submitMarketSell(false);
if($("marketBlackSellSelectAll"))$("marketBlackSellSelectAll").onclick=()=>{const equipped=new Set(Object.values(state.equipped||{}).filter(Boolean));state.inventory.filter(x=>x.qty>0&&!equipped.has(x.id)&&isIllegalItem(x)).forEach(x=>marketBlackSellSelection[x.id]=x.qty);renderMarketSell(true)};
if($("marketBlackSellClear"))$("marketBlackSellClear").onclick=()=>{marketBlackSellSelection={};renderMarketSell(true)};
if($("marketBlackSellSubmit"))$("marketBlackSellSubmit").onclick=()=>submitMarketSell(true);

if($("blackSaleSearch"))$("blackSaleSearch").addEventListener("input",()=>renderBlackMarket());
if($("blackSaleFilterTrigger"))$("blackSaleFilterTrigger").onclick=()=>{const menu=$("blackSaleFilterOptions");if(!menu)return;const opening=menu.classList.contains("hidden");closeSortMenus(opening?menu.id:null);menu.classList.toggle("hidden",!opening);$("blackSaleFilterTrigger").setAttribute("aria-expanded",String(opening))};
document.querySelectorAll("[data-black-filter]").forEach(b=>b.onclick=()=>{blackSaleFilter=b.dataset.blackFilter;if($("blackSaleFilterLabel"))$("blackSaleFilterLabel").textContent=blackSaleFilter;document.querySelectorAll("[data-black-filter]").forEach(x=>x.setAttribute("aria-selected",x===b?"true":"false"));if($("blackSaleFilterOptions"))$("blackSaleFilterOptions").classList.add("hidden");if($("blackSaleFilterTrigger"))$("blackSaleFilterTrigger").setAttribute("aria-expanded","false");renderBlackMarket()});
if($("blackSaleSelectAll"))$("blackSaleSelectAll").onclick=()=>{const equipped=new Set(Object.values(state.equipped||{}).filter(Boolean));const search=($("blackSaleSearch")?.value||"").trim().toLowerCase();state.inventory.filter(x=>x.qty>0&&!equipped.has(x.id)&&isIllegalItem(x)&&x.name.toLowerCase().includes(search)&&(blackSaleFilter==="Todos"||(blackSaleFilter==="Órgano"?x.cat==="Órgano":blackSaleFilter==="Síntesis"?isSynthesisItem(x):blackSaleFilter==="Otro"?x.cat!=="Órgano"&&!isSynthesisItem(x):true))).forEach(x=>blackSaleSelection[x.id]=x.qty);renderBlackMarket()};
if($("blackSaleClear"))$("blackSaleClear").onclick=()=>{blackSaleSelection={};renderBlackMarket()};
if($("blackSaleSubmit"))$("blackSaleSubmit").onclick=sellBlackSelection;
$("pickerPrev").onclick=()=>{pickerPage--;renderPicker()};$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};
// Centro / Máquina de Mejora
document.querySelectorAll("[data-nexus-tab]").forEach(b=>b.onclick=()=>{
  if(b.disabled)return;
  document.querySelectorAll("[data-nexus-tab]").forEach(x=>x.classList.toggle("active",x===b));
  document.querySelectorAll("#page-nexus .nexus-section").forEach(x=>x.classList.toggle("active",x.id==="nexus-"+b.dataset.nexusTab));
  if(b.dataset.nexusTab==="upgrade")renderUpgradeMachine();
  if(b.dataset.nexusTab==="mod2")renderExchangeModule();
  if(b.dataset.nexusTab==="mod3")renderRefineMachine();if(b.dataset.nexusTab==="recycle")renderRecycleMachine();if(b.dataset.nexusTab==="scrap")renderScrapMachine();if(b.dataset.nexusTab==="print")renderPrintMachine();
});

if($("upgradeInputPick"))$("upgradeInputPick").onclick=()=>{if(!upgradeSpinning)openUpgradeInputPicker()};
if($("upgradeTargetPick"))$("upgradeTargetPick").onclick=()=>{if(!upgradeSpinning)openUpgradeTargetPicker()};
if($("upgradeInputClear"))$("upgradeInputClear").onclick=()=>{if(upgradeSpinning)return;upgradeInputId=null;upgradeInputQty=1;renderUpgradeMachine();sound(400,.05,"sine")};
if($("upgradeTargetClear"))$("upgradeTargetClear").onclick=()=>{if(upgradeSpinning)return;upgradeTargetName=null;upgradeTargetQty=1;renderUpgradeMachine();sound(400,.05,"sine")};

if($("upgradeInMinus"))$("upgradeInMinus").onclick=()=>{if(upgradeSpinning)return;upgradeInputQty=Math.max(1,upgradeInputQty-1);renderUpgradeMachine()};
if($("upgradeInPlus"))$("upgradeInPlus").onclick=()=>{if(upgradeSpinning)return;const it=state.inventory.find(i=>i.id===upgradeInputId);upgradeInputQty=Math.min(it?it.qty:1,upgradeInputQty+1);renderUpgradeMachine()};
if($("upgradeOutMinus"))$("upgradeOutMinus").onclick=()=>{if(upgradeSpinning)return;upgradeTargetQty=Math.max(1,upgradeTargetQty-1);renderUpgradeMachine()};
if($("upgradeOutPlus"))$("upgradeOutPlus").onclick=()=>{if(upgradeSpinning)return;upgradeTargetQty=Math.min(99,upgradeTargetQty+1);renderUpgradeMachine()};
if($("upgradeSpinBtn"))$("upgradeSpinBtn").onclick=spinUpgradeRoulette;
if($("exchangeAddBtn"))$("exchangeAddBtn").onclick=()=>openExchangePicker();
if($("exchangeClearBtn"))$("exchangeClearBtn").onclick=()=>{if(exchangeBusy)return;exchangeBox={};renderExchangeModule()};
if($("exchangeSubmitBtn"))$("exchangeSubmitBtn").onclick=runExchange;
if($("refineInputPick"))$("refineInputPick").onclick=()=>{if(!refineBusy)openRefineInputPicker()};
if($("recycleInputPick"))$("recycleInputPick").onclick=()=>openRecycleInputPicker();
if($("recycleInputClear"))$("recycleInputClear").onclick=()=>{if(recycleBusy)return;recycleInputId=null;renderRecycleMachine()};
if($("recycleStartBtn"))$("recycleStartBtn").onclick=startRecycle;

document.querySelectorAll("[data-factory-tab]").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("[data-factory-tab]").forEach(x=>x.classList.toggle("active",x===b));
  document.querySelectorAll("#page-factory .clinic-section").forEach(x=>x.classList.toggle("active",x.id==="factory-"+b.dataset.factoryTab));
});
if($("chooseDismantleRobot"))$("chooseDismantleRobot").onclick=()=>{
  pickerMode="dismantleRobot";pickerPage=1;pickerFilter="Criatura";
  if($("pickerTitle"))$("pickerTitle").textContent="⚙ UNIDAD ROBÓTICA";
  if($("pickerDescription"))$("pickerDescription").textContent="Solo criaturas robóticas.";
  $("inventoryPicker").classList.remove("hidden");renderPicker();
};
if($("clearDismantleRobot"))$("clearDismantleRobot").onclick=()=>{dismantleRobotId=null;dismantleSelected={};dismantlePiecesPage=1;renderDismantleTable();sound(400,.05,"sine")};
if($("dismantleStartBtn"))$("dismantleStartBtn").onclick=startDismantle;
for(let i=0;i<5;i++){
  const ii=i;
  if($("chooseAsm"+ii))$("chooseAsm"+ii).onclick=()=>{
    pickerMode="asmPiece";pickerSlot=ii;pickerPage=1;pickerFilter="Pieza";
    if($("pickerTitle"))$("pickerTitle").textContent="⚙ PIEZA "+(ii+1);
    $("inventoryPicker").classList.remove("hidden");renderPicker();
  };
  if($("clearAsm"+ii))$("clearAsm"+ii).onclick=()=>{delete asmSelected[ii];renderAssembleTable()};
}
if($("chooseAsmAnomaly"))$("chooseAsmAnomaly").onclick=()=>{
  pickerMode="asmAnomaly";pickerPage=1;pickerFilter="Anomalía";
  if($("pickerTitle"))$("pickerTitle").textContent="⚙ ANOMALÍA";
  $("inventoryPicker").classList.remove("hidden");renderPicker();
};
if($("clearAsmAnomaly"))$("clearAsmAnomaly").onclick=()=>{asmAnomalyId=null;renderAssembleTable()};
if($("asmStartBtn"))$("asmStartBtn").onclick=startAssemble;

if($("recycleClaimBtn"))$("recycleClaimBtn").onclick=claimRecycle;
if($("scrapInputPick"))$("scrapInputPick").onclick=()=>openScrapInputPicker();
if($("scrapInputClear"))$("scrapInputClear").onclick=()=>{if(scrapBusy)return;scrapInputId=null;renderScrapMachine()};
if($("scrapStartBtn"))$("scrapStartBtn").onclick=startScrap;
if($("scrapClaimBtn"))$("scrapClaimBtn").onclick=claimScrap;
if($("printTargetPick"))$("printTargetPick").onclick=()=>openPrintTargetPicker();
if($("printTargetClear"))$("printTargetClear").onclick=()=>{if(printBusy||printOut)return;printTargetId=null;renderPrintMachine()};
if($("printFuelAdd"))$("printFuelAdd").onclick=()=>openPrintFuelPicker();
if($("printFuelClear"))$("printFuelClear").onclick=()=>{if(printBusy||printOut)return;printFuel=[];renderPrintMachine()};
if($("printStartBtn"))$("printStartBtn").onclick=startPrint;
if($("printClaimBtn"))$("printClaimBtn").onclick=claimPrint;



if($("refineInputClear"))$("refineInputClear").onclick=()=>{if(refineBusy)return;refineInputId=null;renderRefineMachine()};
if($("refineDustMinus"))$("refineDustMinus").onclick=()=>{if(refineBusy||refinePending)return;refineDustQty=Math.max(0,refineDustQty-1);renderRefineMachine()};
if($("refineDustPlus"))$("refineDustPlus").onclick=()=>{if(refineBusy||refinePending)return;refineDustQty=Math.min(countDust(),16,refineDustQty+1);renderRefineMachine()};
if($("refineStartBtn"))$("refineStartBtn").onclick=startRefine;
if($("refineClaimBtn"))$("refineClaimBtn").onclick=claimRefine;

if($("openAssistantBtn"))$("openAssistantBtn").onclick=openAssistant;
if($("openMissionsBtn"))$("openMissionsBtn").onclick=openMissions;
if($("openAchievementsBtn"))$("openAchievementsBtn").onclick=openAchievements;
if($("closeAssistant"))$("closeAssistant").onclick=()=>$("assistantModal").classList.add("hidden");
if($("closeMissions"))$("closeMissions").onclick=()=>$("missionsModal").classList.add("hidden");
if($("closeAchievements"))$("closeAchievements").onclick=()=>$("achievementsModal").classList.add("hidden");


if($("exchangeResultModal"))$("exchangeResultModal").addEventListener("click",e=>{if(e.target===$("exchangeResultModal")&&!exchangePending){$("exchangeResultModal").classList.add("hidden")}});


$("zonesPrev").onclick=()=>{zonePage--;renderZoneCards()};$("zonesNext").onclick=()=>{zonePage++;renderZoneCards()};$("recipesPrev").onclick=()=>{recipePage--;renderRecipes()};$("recipesNext").onclick=()=>{recipePage++;renderRecipes()};$("smeltPrev").onclick=()=>{smeltPage--;renderSmelt()};$("smeltNext").onclick=()=>{smeltPage++;renderSmelt()};document.querySelectorAll("[data-central-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-central-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("#page-central .central-section").forEach(x=>x.classList.toggle("active",x.id==="central-"+b.dataset.centralTab))});
document.querySelectorAll("[data-clinic-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-clinic-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("#page-clinic .clinic-section").forEach(x=>x.classList.toggle("active",x.id==="clinic-"+b.dataset.clinicTab));if(b.dataset.clinicTab==="extract")renderExtractTable();if(b.dataset.clinicTab==="spawn")renderSpawnTable();});$("inventorySearch").addEventListener("input",()=>{inventoryPage=1;renderInventory()});$("inventoryGrid").addEventListener("click",e=>{const tile=e.target.closest("[data-inventory-detail]");if(tile)openInventoryItem(tile.dataset.inventoryDetail)});$("inventoryGrid").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const tile=e.target.closest("[data-inventory-detail]");if(tile){e.preventDefault();openInventoryItem(tile.dataset.inventoryDetail)}}});$("prevPage").onclick=()=>{inventoryPage--;renderInventory()};$("nextPage").onclick=()=>{inventoryPage++;renderInventory()};document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{inventoryFilter=b.dataset.filter;inventoryPage=1;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderInventory()});

$("closeInventoryDetail").onclick=()=>$("inventoryDetailModal").classList.add("hidden");$("inventoryDetailModal").addEventListener("click",e=>{if(e.target===$("inventoryDetailModal"))$("inventoryDetailModal").classList.add("hidden")});$("registrySearch").addEventListener("input",()=>{registryPage=1;renderRegistry()});document.querySelectorAll("[data-registry-filter]").forEach(b=>b.onclick=()=>{registryFilter=b.dataset.registryFilter;registryPage=1;document.querySelectorAll("[data-registry-filter]").forEach(x=>x.classList.toggle("active",x===b));renderRegistry()});document.querySelectorAll("[data-registry-mode]").forEach(b=>b.onclick=()=>{registryMode=b.dataset.registryMode;registryFilter="Todos";registryPage=1;document.querySelectorAll("[data-registry-filter]").forEach(x=>x.classList.toggle("active",x.dataset.registryFilter==="Todos"));renderRegistry()});$("registryPrev").onclick=()=>{registryPage--;renderRegistry()};$("registryNext").onclick=()=>{registryPage++;renderRegistry()};$("closeRegistry").onclick=()=>$("registryModal").classList.add("hidden");$("registryModal").addEventListener("click",e=>{if(e.target===$("registryModal"))$("registryModal").classList.add("hidden")});document.querySelectorAll("[data-recipe-category]").forEach(b=>b.onclick=()=>{recipeCategory=b.dataset.recipeCategory;recipePage=1;document.querySelectorAll("[data-recipe-category]").forEach(x=>x.classList.toggle("active",x===b));renderRecipes()});
$("installApp").onclick=async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();try{await deferredInstallPrompt.userChoice}catch(e){}deferredInstallPrompt=null;$("installApp").classList.add("hidden")}else{toast("Para instalar, publica Anomaly Fusion en HTTPS y usa el menú del navegador: «Instalar aplicación».");}};window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installApp").classList.remove("hidden")});window.addEventListener("appinstalled",()=>{$("installApp").textContent="✓ Instalada";$("installApp").disabled=true});

function syncSettingsUI(){
 const sfxMuted=!!state.settings.soundMuted||state.settings.sound===false;
 const musicMuted=!!state.settings.musicMuted;
 const motionOn=!!state.settings.motion;
 if($("soundToggle"))$("soundToggle").checked=!sfxMuted;
 if($("motionToggle"))$("motionToggle").checked=motionOn;
 const muteBtn=$("soundMuteBtn");
 if(muteBtn){
  muteBtn.textContent=sfxMuted?"🔊 Activar efectos":"🔇 Silenciar efectos";
  muteBtn.classList.toggle("on",sfxMuted);
  muteBtn.setAttribute("aria-pressed",sfxMuted?"true":"false");
 }
 const musicMuteBtn=$("musicMuteBtn");
 if(musicMuteBtn){
  musicMuteBtn.textContent=musicMuted?"🎵 Activar música":"🎵 Silenciar música";
  musicMuteBtn.classList.toggle("on",musicMuted);
  musicMuteBtn.setAttribute("aria-pressed",musicMuted?"true":"false");
 }
 const motionBtn=$("motionBtn");
 if(motionBtn){
  motionBtn.textContent=motionOn?"Animaciones reducidas":"Reducir animaciones";
  motionBtn.classList.toggle("on",motionOn);
  motionBtn.setAttribute("aria-pressed",motionOn?"true":"false");
 }
 if($("soundVolume")){
  $("soundVolume").value=state.settings.soundVolume??75;
  $("soundVolume").disabled=sfxMuted;
  const wrap=$("soundVolume").closest(".hud-volume"); if(wrap)wrap.classList.toggle("is-muted",sfxMuted);
 }
 if($("soundVolumeValue"))$("soundVolumeValue").textContent=(state.settings.soundVolume??75)+"%";
 if($("musicVolume")){
  $("musicVolume").value=state.settings.musicVolume??40;
  $("musicVolume").disabled=musicMuted;
  const wrap=$("musicVolume").closest(".hud-volume"); if(wrap)wrap.classList.toggle("is-muted",musicMuted);
 }
 if($("musicVolumeValue"))$("musicVolumeValue").textContent=(state.settings.musicVolume??40)+"%";
 if($("fullscreenToggle"))$("fullscreenToggle").textContent=document.fullscreenElement?"⛶ Desactivar":"⛶ Activar";
 applyMusicVolume();
}
$("openSettings").onclick=()=>{syncSettingsUI();try{ensureAudio();ensureBgMusic()}catch(e){};$("settingsModal").classList.remove("hidden")};$("closeSettings").onclick=()=>$("settingsModal").classList.add("hidden");$("settingsModal").addEventListener("click",e=>{if(e.target===$("settingsModal"))$("settingsModal").classList.add("hidden")});
$("sortInventoryTrigger").onclick=()=>{const m=$("sortInventoryOptions"),opening=m.classList.contains("hidden");closeSortMenus(opening?m.id:null);m.classList.toggle("hidden",!opening);$("sortInventoryTrigger").setAttribute("aria-expanded",String(opening))};$("registrySortTrigger").onclick=()=>{const m=$("registrySortOptions"),opening=m.classList.contains("hidden");closeSortMenus(opening?m.id:null);m.classList.toggle("hidden",!opening);$("registrySortTrigger").setAttribute("aria-expanded",String(opening))};document.querySelectorAll("[data-sort-target]").forEach(b=>b.onclick=()=>setSortMenu(b.dataset.sortTarget,b.dataset.sortValue));document.addEventListener("click",e=>{if(!e.target.closest(".sort-menu"))closeSortMenus()});
$("confirmCancel").onclick=closeConfirm;$("confirmAccept").onclick=()=>{const action=pendingConfirmAction;closeConfirm();if(action)action()};$("confirmModal").addEventListener("click",e=>{if(e.target===$("confirmModal"))closeConfirm()});document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeConfirm();closeSortMenus();["settingsModal","inventoryPicker","registryModal","inventoryDetailModal"].forEach(id=>$(id)?.classList.add("hidden"))}});
$("soundToggle").onchange=e=>{state.settings.sound=e.target.checked;save();syncSettingsUI();if(e.target.checked)sound(600)};
if($("soundMuteBtn"))$("soundMuteBtn").onclick=()=>{setSoundMuted(!(state.settings.soundMuted||state.settings.sound===false));};
if($("musicMuteBtn"))$("musicMuteBtn").onclick=()=>{setMusicMuted(!state.settings.musicMuted);};
if($("musicVolume"))$("musicVolume").addEventListener("input",e=>setMusicVolume(e.target.value));

$("soundVolume").addEventListener("input",e=>{setSoundVolume(e.target.value)});
$("soundVolume").addEventListener("change",()=>sound(560,.08,"sine"));
if($("volumeDownBtn"))$("volumeDownBtn").onclick=()=>{setSoundVolume(Math.max(0,(Number(state.settings.soundVolume)||0)-10));syncSettingsUI();sound(480,.06,"sine")};
if($("volumeUpBtn"))$("volumeUpBtn").onclick=()=>{setSoundVolume(Math.min(100,(Number(state.settings.soundVolume)||0)+10));syncSettingsUI();sound(640,.06,"sine")};
$("scaleSelect").onchange=e=>{state.settings.scale=e.target.value;document.documentElement.style.setProperty("--scale",e.target.value);save()};
$("layoutModeSelect").onchange=e=>{applyLayoutMode(e.target.value);save();sound(560)};
$("motionToggle").onchange=e=>{state.settings.motion=e.target.checked;document.body.classList.toggle("reduce-motion",e.target.checked);save();syncSettingsUI()};
if($("motionBtn"))$("motionBtn").onclick=()=>{state.settings.motion=!state.settings.motion;if($("motionToggle"))$("motionToggle").checked=state.settings.motion;document.body.classList.toggle("reduce-motion",state.settings.motion);save();syncSettingsUI();sound(500,.05,"sine")};
$("fullscreenToggle").onclick=async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen()}else{await document.exitFullscreen()}syncSettingsUI()}catch(e){toast("La pantalla completa no está disponible en este navegador.",true)}};
document.addEventListener("fullscreenchange",()=>syncSettingsUI());
$("exportSave").onclick=exportSave;
$("importSave").onclick=()=>$("importSaveFile").click();
$("importSaveFile").addEventListener("change",async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;try{if(file.size>10*1024*1024)throw new Error("El archivo supera el límite de 10 MB.");let text;try{text=await file.text()}catch(_){throw new Error("No se pudo leer el archivo.")}let parsed;try{parsed=JSON.parse(text)}catch(_){throw new Error("El archivo no es un JSON válido.")}const raw=parsed&&parsed.save?parsed.save:parsed;const imported=normalizeImportedState(raw);showConfirm("IMPORTAR PARTIDA","Sustituirá el progreso actual de este dispositivo por los datos del archivo seleccionado. Esta acción no se puede deshacer.","Importar",()=>{try{state=imported;localStorage.removeItem("joyaCeroSave");save();if($("settingsModal"))$("settingsModal").classList.add("hidden");render();if($("soundToggle"))$("soundToggle").checked=!!state.settings.sound;if($("scaleSelect"))$("scaleSelect").value=state.settings.scale||"1";document.documentElement.style.setProperty("--scale",state.settings.scale||"1");if($("motionToggle"))$("motionToggle").checked=!!state.settings.motion;document.body.classList.toggle("reduce-motion",!!state.settings.motion);applyLayoutMode(state.settings.layoutMode||"auto");setSoundVolume(state.settings.soundVolume??75);syncSettingsUI();toast("Partida importada correctamente.")}catch(err2){console.error(err2);toast(err2.message||"Error al aplicar la partida importada.",true)}});}catch(err){console.error(err);toast(err.message||"No se pudo importar el archivo.",true)}finally{e.target.value=""}});
$("resetGame").onclick=()=>showConfirm("REINICIAR PARTIDA","Se borrará el progreso local y se limpiará la caché de Anomaly Fusion. No se puede deshacer. Se recargará la aplicación al terminar.","Reiniciar",async()=>{try{localStorage.removeItem("joyaCeroSave");localStorage.removeItem("anomalyFusionSave");state=stateDefault();state.activity=[];save();if(typeof clearAppCache==="function")await clearAppCache();location.reload()}catch(err){console.error(err);toast(err.message||"No se pudo borrar la partida.",true)}},true);
// Sonido corto de interfaz para botones, incluidos controles creados dinámicamente.
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||b.disabled||b.id==="soundToggle")return;if(b.id==="exploreBtn"||b.id==="zoneBackBtn")return;sound(380,.025,"sine")},true);
async function checkForAppUpdates(registration){try{await registration.update();if(registration.waiting&&navigator.serviceWorker.controller)registration.waiting.postMessage({type:"SKIP_WAITING"})}catch(e){}}
let recipeResizeTimer=null;window.addEventListener("resize",()=>{clearTimeout(recipeResizeTimer);recipeResizeTimer=setTimeout(()=>{recipePage=1;renderRecipes()},120)});
function unlockAudioOnce(){try{ensureAudio();if(audioCtx&&audioCtx.state==="suspended")audioCtx.resume().catch(()=>{});}catch(e){}document.removeEventListener("touchstart",unlockAudioOnce,true);document.removeEventListener("click",unlockAudioOnce,true)}document.addEventListener("touchstart",unlockAudioOnce,true);document.addEventListener("click",unlockAudioOnce,true);

function updateHomeClock(){
 const el=$("homeClock");if(!el)return;
 const d=new Date();
 const pad=n=>String(n).padStart(2,"0");
 const days=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
 const months=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
 el.textContent=`${days[d.getDay()]} ${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}


function migrateIllegalPolicy(){
 (state.inventory||[]).forEach(it=>applyIllegalPolicy(it));
 Object.values(state.discovered||{}).forEach(it=>{if(it&&typeof it==="object")applyIllegalPolicy(it);});
}
function migrateOrganVariants(){
 state.organVariants=state.organVariants||{};
 (state.inventory||[]).forEach(it=>{if(it&&it.cat==="Órgano")saveOrganVariant(it)});
 Object.values(state.discovered||{}).forEach(it=>{if(it&&it.cat==="Órgano")saveOrganVariant(it)});
}
function init(){ensureSkillPointsFromLevel();
 try{applyHudCursors();fixSidebarScroll();window.addEventListener("resize",()=>{fixSidebarScroll();applyHudCursors()});window.addEventListener("orientationchange",fixSidebarScroll);}catch(e){}

 try{bindCasinoUI()}catch(e){console.warn(e)}

 if(!state.version){state=stateDefault();log("Sistema inicializado. Inventario y créditos a cero.")}
 if(!state.activity.length&&!state.inventory.length&&state.credits===0)log("Sistema inicializado. Inventario vacío. Explora para conseguir tus primeros recursos.");
 document.querySelectorAll("[data-settings-panel].settings-tab, .settings-tab[data-settings-panel]").forEach(b=>{
  b.addEventListener("click",()=>{
   const key=b.dataset.settingsPanel;
   document.querySelectorAll(".settings-tab").forEach(x=>x.classList.toggle("active",x===b));
   document.querySelectorAll(".settings-panel").forEach(x=>x.classList.toggle("active",x.dataset.settingsPanel===key));
  });
 });
 migrateOrganVariants();
 migrateIllegalPolicy();
 applyMusicVolume();
 bindNavigation();
 updateHomeClock();
 setInterval(updateHomeClock,1000);
 if($("soundToggle"))$("soundToggle").checked=state.settings.sound;
 if($("scaleSelect"))$("scaleSelect").value=state.settings.scale||"1";
 document.documentElement.style.setProperty("--scale",state.settings.scale||"1");
 if($("motionToggle"))$("motionToggle").checked=!!state.settings.motion;
 document.body.classList.toggle("reduce-motion",!!state.settings.motion);
 applyLayoutMode(state.settings.layoutMode||"auto");
 setSoundVolume(state.settings.soundVolume??75);
 try{syncSettingsUI()}catch(e){console.warn("syncSettingsUI",e)}
 try{render()}catch(e){console.error("render",e);toast("Error al iniciar interfaz.",true)}

 if(state.pendingSupply&&state.pendingSupply.stage==="animating"){
  setTimeout(()=>{
   if(state.pendingSupply&&state.pendingSupply.stage==="animating"){
    state.pendingSupply.stage="ready";
    renderSupplyDelivery();
    renderSupplies();
    save();
   }
  },1200);
 }
 if("serviceWorker"in navigator&&location.protocol.startsWith("http")){
  navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(reg=>{
   checkForAppUpdates(reg);
   setInterval(()=>checkForAppUpdates(reg),60000);
   document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkForAppUpdates(reg)});
   window.addEventListener("focus",()=>checkForAppUpdates(reg));
  }).catch(()=>{});
 }
}

// Delegación de clics Centro (por si el onclick directo falla)
document.addEventListener("click",function(ev){
  const t=ev.target.closest("#upgradeInputPick,#upgradeTargetPick,#exchangeAddBtn,#refineInputPick,#upgradeInputClear,#upgradeTargetClear,#refineInputClear");
  if(!t)return;
  if(t.id==="upgradeInputPick"){ev.preventDefault();if(!upgradeSpinning)openUpgradeInputPicker()}
  else if(t.id==="upgradeTargetPick"){ev.preventDefault();if(!upgradeSpinning)openUpgradeTargetPicker()}
  else if(t.id==="exchangeAddBtn"){ev.preventDefault();openExchangePicker()}
  else if(t.id==="refineInputPick"){ev.preventDefault();openRefineInputPicker()}
  else if(t.id==="upgradeInputClear"){ev.preventDefault();if(upgradeSpinning)return;upgradeInputId=null;upgradeInputQty=1;renderUpgradeMachine()}
  else if(t.id==="upgradeTargetClear"){ev.preventDefault();if(upgradeSpinning)return;upgradeTargetName=null;upgradeTargetQty=1;renderUpgradeMachine()}
  else if(t.id==="refineInputClear"){ev.preventDefault();if(refineBusy)return;refineInputId=null;renderRefineMachine()}
});

init();
})();
