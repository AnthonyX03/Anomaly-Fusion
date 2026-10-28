(() => {
"use strict";
const $ = id => document.getElementById(id);
const rarityNames = ["","COMÚN","POCO COMÚN","RARO","ÉPICO","LEGENDARIO"];
const rarityColors = ["","#b9c4cb","#72e48b","#55baff","#c18bff","#ffc857"];
const zones = [
 {id:"forest",name:"Bosque hundido",icon:"🌲",desc:"Vegetación densa, ruinas cubiertas de musgo y señales de movimiento entre los árboles.",risk:0,loot:["Madera","Ramas","Hojas","Seta luminosa","Resina"],enemy:0},
 {id:"mine",name:"Mina abandonada",icon:"⛏️",desc:"Galerías colapsadas con vetas metálicas. Se oyen golpes al fondo.",risk:1,loot:["Carbón","Mena de hierro","Mena de cobre","Piedra","Cristal agrietado"],enemy:0.2},
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
 "Hacha de ramas":{icon:"🪓",cat:"Herramienta",r:1,val:18,desc:"Aumenta un 20% la recolección en bosques.",slot:"axe",gather:20,damage:2},
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
mineralRoots.forEach((root,i)=>{const proper=root.charAt(0).toUpperCase()+root.slice(1);addGenerated(`Mena de ${root}`,{icon:["⛏️","🪨","💠"][i%3],cat:"Material",r:1+(i%4===0?1:0),val:5+(i%7)*3,desc:`Mineral bruto de ${root}, extraído de vetas geológicas. Se puede refinar en el horno.`});addGenerated(`Lingote de ${root}`,{icon:["🧱","🟫","🪙"][i%3],cat:"Lingote",r:2+(i%4===0?1:0),val:14+(i%8)*5,desc:`${proper} refinado a partir de mena de ${root}; útil para fabricar equipo y componentes.`});});
const toolBases=["Pico","Hacha","Taladro","Martillo","Sierra","Llave","Palanca","Cortador","Recolector","Sonda","Linterna","Detector","Arpón","Pinzas","Rastrillo","Cincel","Extractor","Soldador","Cuchilla","Brújula"];
const toolMaterials=["de basalto","de cobre","de titanio","de obsidiana","de cuarzo","de cobalto","de chatarra","de cristal","de níquel","de iridio"];
toolBases.forEach((base,i)=>toolMaterials.slice(0,6).forEach((mat,j)=>{const name=`${base} ${mat}`;const slot=/Pico|Taladro|Extractor|Sonda|Detector/.test(base)?"pick":/Hacha|Sierra|Cortador|Cuchilla/.test(base)?"axe":null;addGenerated(name,{icon:/Pico|Taladro|Extractor/.test(base)?"⛏️":/Hacha|Sierra/.test(base)?"🪓":/Linterna/.test(base)?"🔦":"🛠️",cat:"Herramienta",r:1+((i+j)%5),val:18+((i*7+j*11)%100),desc:`${base} fabricado ${mat}. Herramienta de campo para extracción, reparación o exploración.`,slot,gather:8+((i+j*3)%45),damage:2+((i+j)%16)});}));
const weaponBases=["Cuchillo","Espada","Lanza","Maza","Pistola","Rifle","Ballesta","Arco","Bastón","Guantelete","Daga","Hoz","Cañón","Látigo","Hacha de combate","Lanzador","Sable","Martillo de guerra","Rayo portátil","Disruptor"];
const weaponMats=["de cobre","de hierro","de titanio","de cristal","de neón","de obsidiana","de chatarra","de cuarzo","de tungsteno","de fase"];
weaponBases.forEach((base,i)=>weaponMats.slice(0,6).forEach((mat,j)=>{const name=`${base} ${mat}`;addGenerated(name,{icon:["⚔️","🗡️","🔫","🏹","🔨"][i%5],cat:"Arma",r:1+((i+j)%5),val:22+((i*9+j*13)%160),desc:`${base} construida ${mat}. Arma de combate con diseño y peso adaptados al material.`,slot:"weapon",damage:5+((i*3+j*4)%42)});}));
const gearBases=["Casco","Peto","Grebas","Guantes","Botas","Máscara","Traje","Escudo","Manto","Visor","Arnés","Exoesqueleto","Hombreras","Placa dorsal","Capa","Filtro","Brazalete","Amuleto","Cinturón","Blindaje"];
const gearMats=["de hierro","de titanio","de obsidiana","de esporas","de neón","de cuarzo","de cobalto","de fibra","de fase","de chatarra"];
gearBases.forEach((base,i)=>gearMats.slice(0,6).forEach((mat,j)=>{const name=`${base} ${mat}`;addGenerated(name,{icon:["🪖","🛡️","🥾","🧤","🧥"][i%5],cat:"Equipo",r:1+((i+j)%5),val:25+((i*11+j*9)%145),desc:`${base} ${mat}, preparado para proteger al operador en condiciones hostiles.`,slot:"armor",defense:3+((i*2+j*3)%35)});}));
const miscBases=["Kit médico","Ración compacta","Bengala","Baliza","Bomba de humo","Célula de energía","Batería","Módulo de datos","Cápsula de oxígeno","Filtro","Granada de pulso","Trampa magnética","Señuelo","Dron explorador","Llave de fase","Antídoto","Poción de blindaje","Carga térmica","Cartucho","Módulo de suerte"];
const miscQualities=["de campo","reforzado","experimental","anómalo","compacto","industrial"];
miscBases.forEach((base,i)=>miscQualities.forEach((qual,j)=>{const name=`${base} ${qual}`;addGenerated(name,{icon:["🧰","🧪","🔋","📡","💣","🤖"][j%6],cat:j===3?"Otro":"Consumible",r:1+((i+j)%5),val:12+((i*5+j*7)%95),desc:`${base} ${qual}, un objeto auxiliar con uso práctico durante expediciones y operaciones de campo.`});}));
// Distribuye los nuevos recursos en las zonas apropiadas; todas las entradas son descubribles jugando.
const lootFor=(id,filter,limit=14)=>{const z=zones.find(x=>x.id===id);if(z)z.loot.push(...generatedItems.filter(n=>filter(itemDB[n],n)).slice(0,limit))};
lootFor("mine",(d,n)=>d.cat==="Material"&&/Mena de/.test(n),30);lootFor("quarry",(d,n)=>d.cat==="Material"&&/Mena de/.test(n),30);lootFor("glacier",(d,n)=>/cobalto|titanio|níquel|litio|cuarzo|circonio/i.test(n),18);lootFor("volcano",(d,n)=>/basalto|obsidiana|wolframio|tungsteno|azufre|hematita/i.test(n),18);lootFor("neoncity",(d,n)=>/neón|circuito|batería|módulo|detector|visor/i.test(n),18);lootFor("reef",(d,n)=>/cuarzo|jade|paladio|perla|alga|gel/i.test(n),16);lootFor("dunes",(d,n)=>/aluminio|níquel|zinc|plomo|chatarra|rotor/i.test(n),16);lootFor("rift",(d,n)=>/iridio|uranio|fase|anómalo|paradoja|cuántico/i.test(n),18);
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
 {id:"pick",name:"Pico de chatarra",icon:"⛏️",desc:"Herramienta inicial para las minas.",cost:{"Madera":2,"Chatarra":2},out:"Pico de chatarra"},
 {id:"axe",name:"Hacha de ramas",icon:"🪓",desc:"Mejora la recolección vegetal.",cost:{"Madera":2,"Ramas":3},out:"Hacha de ramas"},
 {id:"knife",name:"Cuchillo oxidado",icon:"🔪",desc:"No es elegante, pero corta.",cost:{"Chatarra":3,"Ramas":1},out:"Cuchillo oxidado"},
 {id:"bat",name:"Bate claveteado",icon:"🏏",desc:"Más daño para encuentros hostiles.",cost:{"Madera":3,"Tornillo oxidado":3},out:"Bate claveteado"},
 {id:"ironpick",name:"Pico de hierro",icon:"⛏️",desc:"Una herramienta de minería mejorada.",cost:{"Lingote de hierro":3,"Madera":2},out:"Pico de hierro"},
 {id:"ironaxe",name:"Hacha de hierro",icon:"🪓",desc:"Herramienta robusta para el bosque.",cost:{"Lingote de hierro":2,"Madera":2,"Ramas":1},out:"Hacha de hierro"},
 {id:"armor",name:"Armadura de chatarra",icon:"🛡️",desc:"Reduce el daño recibido.",cost:{"Chatarra":5,"Cable de cobre":2},out:"Armadura de chatarra"},
 {id:"sword",name:"Espada de cobre",icon:"⚔️",desc:"Hoja con una buena relación peso-daño.",cost:{"Lingote de cobre":3,"Madera":1},out:"Espada de cobre"}
];


// Recetas de materiales base y componentes procesados.
[
 {id:"mat_fiber",name:"Fibra vegetal",icon:"🧵",desc:"Extrae y retuerce fibras útiles de hojas y ramas.",cost:{"Hojas":3,"Ramas":1},out:"Fibra vegetal",category:"Material"},
 {id:"mat_rope",name:"Cuerda de fibra",icon:"➰",desc:"Trenza fibras vegetales hasta formar un cordaje resistente.",cost:{"Fibra vegetal":3},out:"Cuerda de fibra",category:"Material"},
 {id:"mat_board",name:"Tabla reforzada",icon:"🪵",desc:"Corta y refuerza madera para fabricar estructuras y mangos.",cost:{"Madera":3,"Chatarra":1},out:"Tabla reforzada",category:"Material"},
 {id:"mat_brick",name:"Ladrillo de piedra",icon:"🧱",desc:"Compacta piedra triturada en un bloque uniforme.",cost:{"Piedra":4},out:"Ladrillo de piedra",category:"Material"},
 {id:"mat_glass",name:"Vidrio reciclado",icon:"🔹",desc:"Funde fragmentos de cristal para reutilizarlos en componentes.",cost:{"Cristal agrietado":2,"Carbón":1},out:"Vidrio reciclado",category:"Material"},
 {id:"mat_cable",name:"Cable trenzado",icon:"〰️",desc:"Une cable conductor y fibra para mejorar su resistencia.",cost:{"Cable de cobre":2,"Fibra vegetal":1},out:"Cable trenzado",category:"Material"},
 {id:"mat_plate",name:"Placa de aleación",icon:"⚙️",desc:"Prensa chatarra con metal refinado para obtener una placa industrial.",cost:{"Chatarra":3,"Lingote de hierro":1},out:"Placa de aleación",category:"Material"},
 {id:"mat_coal",name:"Polvo de carbón",icon:"⚫",desc:"Muele carbón para preparar mezclas y reactivos industriales.",cost:{"Carbón":2},out:"Polvo de carbón",category:"Material"},
 {id:"mat_compound",name:"Compuesto aislante",icon:"🧪",desc:"Combina resina y fibras para aislar calor y electricidad.",cost:{"Resina":2,"Fibra vegetal":2},out:"Compuesto aislante",category:"Material"},
 {id:"mat_crystal",name:"Cristal pulido",icon:"💎",desc:"Pule cristal bruto para fabricar lentes y piezas de precisión.",cost:{"Cristal agrietado":2,"Piedra":1},out:"Cristal pulido",category:"Material"},
 {id:"mat_core",name:"Núcleo de batería",icon:"🔋",desc:"Recupera las celdas útiles de una batería vieja.",cost:{"Batería vieja":1,"Cable de cobre":2},out:"Núcleo de batería",category:"Material"},
 {id:"mat_alloy",name:"Aleación ligera",icon:"🪙",desc:"Combina metal refinado y componentes reciclados en una mezcla ligera.",cost:{"Lingote de aluminio":2,"Chatarra":1},out:"Aleación ligera",category:"Material"}
].forEach(r=>recipes.push(r));

// Gran catálogo de recetas de materiales: 96 componentes nuevos, con costes coherentes
// con sus familias y materias primas disponibles en exploración o en el horno.
const materialRecipeFamilies = [
 {key:"bio",items:[
  ["Cordón de corteza","🧵","Madera","Ramas","Se extraen tiras flexibles de corteza y se trenzan."],
  ["Panel de corteza prensada","▤","Madera","Resina","Corteza compactada y sellada con resina."],
  ["Pasta de celulosa","🟩","Hojas","Ramas","Pulpa vegetal para papel técnico y filtros."],
  ["Tela de fibra silvestre","🧶","Fibra vegetal","Hojas","Fibras vegetales tejidas en una tela basta."],
  ["Fieltro de esporas","🍄","Hongo negro","Espora viva","Biomasa fúngica prensada en una lámina aislante."],
  ["Sellador de resina","🟤","Resina","Carbón","Resina estabilizada para sellar juntas."],
  ["Bioplástico de hojas","🌱","Hoja mutada","Resina","Polímero flexible de origen vegetal mutado."],
  ["Compost reactivo","♻️","Hojas","Hongo negro","Materia orgánica procesada para cultivos y reactivos."]]},
 {key:"stone",items:[
  ["Grava clasificada","🪨","Piedra","Piedra","Piedra triturada y cribada por tamaño."],
  ["Bloque de basalto","⬛","Mena de basalto","Carbón","Basalto compactado para estructuras resistentes."],
  ["Polvo de cuarzo","✨","Mena de cuarzo","Piedra","Cuarzo molido para abrasivos y circuitos."],
  ["Cerámica técnica","🧱","Piedra","Carbón","Mezcla mineral cocida para piezas resistentes al calor."],
  ["Mortero mineral","⚒️","Piedra","Resina","Aglutinante mineral para reparar estructuras."],
  ["Lámina de pizarra","🪨","Piedra","Chatarra","Piedra cortada en placas finas."],
  ["Abrasivo de cantera","🔸","Piedra","Mena de cuarzo","Granulado duro para pulir piezas metálicas."],
  ["Agregado refractario","🌋","Roca volcánica","Piedra","Mezcla mineral preparada para soportar altas temperaturas."]]},
 {key:"metal",items:[
  ["Remaches de hierro","📌","Lingote de hierro","Chatarra","Pequeños remaches estampados para ensamblajes."],
  ["Alambre de hierro","〰️","Lingote de hierro","Carbón","Metal trefilado para ataduras y mecanismos."],
  ["Malla de cobre","🕸️","Lingote de cobre","Cable de cobre","Trama conductora para blindaje electromagnético."],
  ["Lámina de cobre","🟠","Lingote de cobre","Chatarra","Cobre laminado para placas y contactos."],
  ["Polvo de oro","🟡","Lingote de oro","Piedra","Oro molido para contactos de alta precisión."],
  ["Pasta de soldadura","🧪","Lingote de estaño","Cable de cobre","Pasta metálica para unir circuitos."],
  ["Aleación de níquel","⚙️","Lingote de níquel","Lingote de hierro","Aleación resistente al desgaste y a la corrosión."],
  ["Placa de titanio","🛡️","Lingote de titanio","Chatarra","Titanio laminado para equipo ligero y resistente."]]},
 {key:"crystal",items:[
  ["Lente de cristal bruto","🔎","Cristal agrietado","Piedra","Cristal tallado para ampliar señales y detalles."],
  ["Prisma refractor","🔷","Cristal pulido","Cable de cobre","Prisma que separa y redirige haces de luz."],
  ["Polvo de geoda","💠","Geoda","Piedra","Fragmentos cristalinos molidos para mezclas técnicas."],
  ["Mosaico de cuarzo","💎","Mena de cuarzo","Resina","Piezas de cuarzo fijadas en una superficie estable."],
  ["Fibra óptica bruta","〰️","Vidrio reciclado","Cable de cobre","Filamento conductor de señales luminosas."],
  ["Cristal templado","🪟","Cristal pulido","Carbón","Cristal tratado para resistir impactos moderados."],
  ["Resonador de geoda","🔔","Geoda","Cable de cobre","Cavidad cristalina que vibra con frecuencias constantes."],
  ["Polvo fotónico","✨","Cristal de hielo azul","Cristal agrietado","Polvo luminoso recuperado de cristales energéticos."]]},
 {key:"toxic",items:[
  ["Gel neutralizante","🧪","Moco tóxico","Carbón","Gel tratado para estabilizar residuos corrosivos."],
  ["Filtro de esporas","😷","Hongo negro","Fibra vegetal","Malla vegetal que retiene partículas biológicas."],
  ["Extracto de hoja mutada","🌿","Hoja mutada","Resina","Extracto concentrado de flora alterada."],
  ["Membrana biológica","🫧","Espora viva","Moco tóxico","Película orgánica flexible y reactiva."],
  ["Polvo de quitina","🦴","Colmillo","Piedra","Fragmentos orgánicos triturados para compuestos duros."],
  ["Catalizador enzimático","🧬","Espora viva","Hongo negro","Cultivo estabilizado para acelerar reacciones orgánicas."],
  ["Resina antiséptica","🟢","Resina","Hoja mutada","Sellador tratado para descontaminar superficies."],
  ["Compuesto de quitina","🛡️","Colmillo","Resina","Biocompuesto rígido para placas y refuerzos."]]},
 {key:"electronics",items:[
  ["Contacto electrónico","🔌","Placa electrónica","Chatarra","Contacto recuperado para reparar dispositivos."],
  ["Circuito impreso simple","🧩","Placa electrónica","Cable de cobre","Pistas conductoras prensadas sobre una base aislante."],
  ["Bobina de cobre","🌀","Cable de cobre","Tornillo oxidado","Bobina para motores, sensores y electroimanes."],
  ["Celda de energía reparada","🔋","Batería vieja","Cable de cobre","Celda reacondicionada con capacidad limitada."],
  ["Módulo de sensores","📡","Placa electrónica","Cristal pulido","Conjunto de sensores ópticos y electrónicos."],
  ["Disipador metálico","❄️","Chatarra","Lingote de aluminio","Pieza que evacúa el calor de equipos electrónicos."],
  ["Conector blindado","🔗","Cable trenzado","Placa de aleación","Conector reforzado para entornos hostiles."],
  ["Microcontrolador recuperado","💾","Placa electrónica","Batería vieja","Unidad lógica rescatada de maquinaria abandonada."]]},
 {key:"volcanic",items:[
  ["Vidrio volcánico","🌋","Roca volcánica","Carbón","Roca fundida y enfriada en fragmentos cortantes."],
  ["Polvo de azufre","🟡","Mena de azufre","Piedra","Azufre molido para procesos químicos industriales."],
  ["Cerámica de magma","🔥","Núcleo de magma","Piedra","Cerámica sinterizada con calor extremo."],
  ["Escoria metálica","⚒️","Mena de tungsteno","Carbón","Residuo separado durante el tratamiento mineral."],
  ["Malla térmica","♨️","Lingote de tungsteno","Cable de cobre","Trama metálica diseñada para distribuir calor."],
  ["Aislante de ceniza","🌫️","Carbón","Roca volcánica","Mezcla porosa que reduce la transferencia térmica."],
  ["Núcleo refractario","🔴","Núcleo de magma","Lingote de hierro","Núcleo para hornos y herramientas de alta temperatura."],
  ["Compuesto de obsidiana","⬛","Mena de obsidiana","Resina","Fragmentos volcánicos unidos en un material duro."]]},
 {key:"ice",items:[
  ["Escama de permafrost","❄️","Fragmento de permafrost","Piedra","Muestra helada preservada para reactivos criogénicos."],
  ["Gel criogénico","🧊","Cristal de hielo azul","Moco tóxico","Gel frío estabilizado para contenedores térmicos."],
  ["Placa de hielo mineral","🔹","Cristal de hielo azul","Carbón","Cristal helado compactado en una placa."],
  ["Aislante criogénico","🥶","Fragmento de permafrost","Fibra vegetal","Revestimiento que frena el intercambio de calor."],
  ["Prisma glacial","💠","Cristal de hielo azul","Cristal pulido","Prisma transparente tallado en hielo mineral."],
  ["Polvo de escarcha","❄️","Fragmento de permafrost","Piedra","Partículas heladas para mezclas de refrigeración."],
  ["Cápsula térmica","🧊","Batería criogénica","Placa de aleación","Contenedor que conserva temperaturas extremas."],
  ["Compuesto anticongelante","🧪","Gel criogénico","Resina","Mezcla que evita la congelación de conductos."]]},
 {key:"ocean",items:[
  ["Fibra de alga","🌊","Alga conductora","Fibra vegetal","Fibra flexible extraída de algas abisales."],
  ["Perla triturada","⚪","Perla abisal","Piedra","Polvo mineral-orgánico para revestimientos."],
  ["Gel bioluminiscente estabilizado","🟢","Gel bioluminiscente","Resina","Gel luminoso encapsulado para balizas."],
  ["Placa de concha","🐚","Concha blindada","Resina","Concha cortada y sellada como protección ligera."],
  ["Conductor salino","〰️","Alga conductora","Cable de cobre","Material conductor para sensores húmedos."],
  ["Membrana impermeable","💧","Gel bioluminiscente","Fibra vegetal","Capa flexible resistente al agua."],
  ["Carbonato abisal","🪸","Concha blindada","Piedra","Mineral biogénico para cerámica y compuestos."],
  ["Catalizador de perla","✨","Perla abisal","Cristal pulido","Polvo perlado para procesos de precisión."]]},
 {key:"dimensional",items:[
  ["Polvo de fase estabilizado","🌀","Polvo cuántico","Carbón","Partículas de fase mezcladas con un soporte inerte."],
  ["Lámina de distorsión","🪞","Fragmento dimensional","Placa electrónica","Lámina que altera ligeramente la lectura de sensores."],
  ["Núcleo de fase sellado","🔮","Núcleo de fase","Resina","Núcleo dimensional encapsulado para evitar fugas."],
  ["Cristal de paradoja molido","💠","Cristal de paradoja","Piedra","Fragmentos de cristal que parecen cambiar de posición."],
  ["Conductor cuántico","⚡","Polvo cuántico","Cable de cobre","Conductor experimental para impulsos de fase."],
  ["Malla de contención","🕸️","Fragmento dimensional","Cable trenzado","Malla para contener pequeñas anomalías materiales."],
  ["Compuesto de iridio","🪙","Lingote de iridio","Placa electrónica","Material estable para dispositivos de alta energía."],
  ["Catalizador de paradoja","🧬","Cristal de paradoja","Núcleo energético","Catalizador raro para procesos anómalos controlados."]]},
 {key:"recycling",items:[
  ["Fragmentos metálicos clasificados","🔩","Chatarra","Tornillo oxidado","Chatarra separada por tamaño y composición."],
  ["Pasta de reparación","🧰","Chatarra","Resina","Pasta de emergencia para reparar carcasas y juntas."],
  ["Tornillería reutilizable","🔧","Tornillo oxidado","Chatarra","Tornillos limpiados y ordenados por medida."],
  ["Módulo de cableado","〰️","Cable de cobre","Cable trenzado","Haz de conductores preparado para maquinaria."],
  ["Plástico recuperado","♻️","Batería vieja","Resina","Carcasa polimérica separada de componentes usados."],
  ["Pieza mecánica calibrada","⚙️","Tornillo oxidado","Placa de aleación","Pieza mecánica revisada para mecanismos de precisión."],
  ["Lámina de blindaje reciclado","🛡️","Chatarra","Lingote de hierro","Lámina defensiva fabricada a partir de metal recuperado."],
  ["Compuesto de aislamiento eléctrico","🔌","Cable de cobre","Compuesto aislante","Aislamiento mejorado para cableado industrial."]]},
 {key:"advanced",items:[
  ["Aleación de cobalto","🪙","Lingote de cobalto","Lingote de hierro","Aleación resistente para herramientas y blindajes."],
  ["Aleación de tungsteno","⚙️","Lingote de tungsteno","Lingote de níquel","Mezcla de alta dureza para piezas industriales."],
  ["Aleación de paladio","✨","Lingote de paladio","Lingote de cobre","Aleación conductora para contactos delicados."],
  ["Lámina de aluminio","🔲","Lingote de aluminio","Chatarra","Aluminio laminado para carcasas ligeras."],
  ["Polvo de litio","🔋","Mena de litio","Carbón","Mineral procesado para celdas de energía."],
  ["Pasta conductora de paladio","⚡","Lingote de paladio","Cable de cobre","Pasta metálica para conexiones de baja resistencia."],
  ["Cerámica de circonio","🧱","Lingote de circonio","Piedra","Cerámica técnica para calor y desgaste."],
  ["Compuesto de bismuto","🧪","Lingote de bismuto","Resina","Material de baja fusión para componentes especializados."]]}
];
let materialRecipeCounter=0;
materialRecipeFamilies.forEach((family,fi)=>family.items.forEach(([out,icon,a,b,desc],j)=>{
 const rarity=Math.min(5,1+Math.floor(fi/3)+(j%2));
 addGenerated(out,{icon,cat:"Material",r:rarity,val:7+fi*4+j*2,desc});
 recipes.push({id:`mat_extra_${materialRecipeCounter++}`,name:out,icon,desc,cost:(a===b?{[a]:3}:{[a]:2,[b]:1}),out,category:"Material"});
 const rec=recipes[recipes.length-1]; if(rec.cost[b]===undefined)delete rec.cost[b];
}));

// Recetas de archivo: procesan hallazgos narrativos recuperados en zonas avanzadas.
[
 {id:"lore_ash_map",name:"Mapa de ceniza restaurado",icon:"🗺️",desc:"La Mesa reconstruye una ruta borrada a partir de los restos de un mapa quemado. El destino cambia con cada lectura, pero las marcas de campo son consistentes.",cost:{"Archivo de ceniza":2,"Cable de cobre":1},out:"Mapa de ceniza restaurado",category:"Material"},
 {id:"lore_cartographer_seal",name:"Sello de cartógrafo calibrado",icon:"🧭",desc:"Un sello antiguo estabilizado con cobre refinado. La aguja ya no señala el norte: marca rutas que el escáner de la Central puede verificar.",cost:{"Sello de cartógrafo":1,"Lingote de cobre":1},out:"Sello de cartógrafo calibrado",category:"Material"},
 {id:"lore_memory_vial",name:"Memoria de expedición sellada",icon:"🧪",desc:"La Ampolla de memoria se encapsula en un soporte energético. La grabación queda protegida para su análisis sin alterar el objeto original.",cost:{"Ampolla de memoria":1,"Núcleo energético":1},out:"Memoria de expedición sellada",category:"Material"}
].forEach(r=>{addGenerated(r.out,{icon:r.icon,cat:"Material",r:r.id==="lore_ash_map"?2:r.id==="lore_cartographer_seal"?3:4,val:r.id==="lore_ash_map"?27:r.id==="lore_cartographer_seal"?48:72,desc:r.desc});recipes.push(r)});

// Ampliación industrial: objetivo de 250 recetas de materiales en total.
// Cada receta convierte una mena/lingote en un derivado plausible de la misma familia mineral.
const materialForms = [
 {label:"Lámina técnica",icon:"🔲",desc:"Lámina mineral laminada para carcasas, refuerzos y ensamblajes.",cost:(root)=>({[`Lingote de ${root}`]:1,"Chatarra":1})},
 {label:"Polvo refinado",icon:"✨",desc:"Mineral molido y clasificado para mezclas técnicas y abrasivos.",cost:(root)=>({[`Mena de ${root}`]:2,"Piedra":1})},
 {label:"Compuesto mineral",icon:"🧪",desc:"Mezcla mineral estabilizada con resina para fabricar componentes resistentes.",cost:(root)=>({[`Lingote de ${root}`]:1,"Resina":2})},
 {label:"Malla metálica",icon:"🕸️",desc:"Trama de metal conductor para filtros, blindajes y estructuras flexibles.",cost:(root)=>({[`Lingote de ${root}`]:1,"Cable de cobre":1})},
 {label:"Núcleo mineral",icon:"💠",desc:"Núcleo compacto que conserva las propiedades del mineral de origen.",cost:(root)=>({[`Lingote de ${root}`]:1,"Batería vieja":1})},
 {label:"Bloque sinterizado",icon:"🧱",desc:"Bloque de mineral consolidado mediante calor para uso estructural.",cost:(root)=>({[`Mena de ${root}`]:2,"Carbón":1})}
];
let materialRecipeTarget=250;
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
const craftableGenerated=generatedItems.filter(n=>["Herramienta","Arma","Equipo","Consumible"].includes(itemDB[n].cat));
function generatedRecipeCost(name,cat){
 const n=name.toLocaleLowerCase("es");
 // Match the ingredients to the item's actual material/functional identity first.
 if(/madera|rama|corteza|tabla|fibra|cuerda|mango|arco/.test(n))return {"Madera":2,"Ramas":1};
 if(/hierro|acero|metal|placa|blindaje|armadura|escudo|casco|peto|malla/.test(n))return {"Lingote de hierro":1,"Chatarra":2};
 if(/cobre|cable|bobina|circuito|electr|sensor|chip|módulo|batería|conector/.test(n))return {"Cable de cobre":1,"Placa electrónica":1};
 if(/cristal|prisma|lente|ópt|cuarzo|geoda|fotón/.test(n))return {"Cristal agrietado":2,"Cable de cobre":1};
 if(/hongo|espora|tox|veneno|antídoto|biológ|gel|moco|enzim|resina|hoja|vegetal/.test(n))return {"Hojas":1,"Resina":1,"Carbón":1};
 if(/plasma|energ|fase|anomal|cuánt|fractal|dimensional|vacío|paradoja|neón/.test(n))return {"Núcleo energético":1,"Cable de cobre":1};
 if(cat==="Herramienta")return {"Madera":1,"Chatarra":2};
 if(cat==="Arma")return {"Lingote de hierro":1,"Chatarra":2};
 if(cat==="Equipo")return {"Lingote de hierro":1,"Cable de cobre":1};
 return {"Hojas":1,"Carbón":1};
}
craftableGenerated.forEach((name,i)=>{const d=itemDB[name];recipes.push({id:"gen_"+i,name,icon:d.icon,desc:d.desc,cost:generatedRecipeCost(name,d.cat),out:name,category:d.cat});});

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
 for(const r of recipes){
  const out=itemDB[r.out]||{};const tier=Math.max(1,Number(out.r)||1);const theme=recipeTheme(r.out,out.desc,r.category||out.cat);
  let pool=recipeMaterialPool.filter(n=>n!==r.out&&!recipeOutputs.has(n)&&(Number(itemDB[n].r)||1)===tier&&recipeTheme(n,itemDB[n].desc,itemDB[n].cat)===theme);
  if(pool.length<2)pool=recipeMaterialPool.filter(n=>n!==r.out&&!recipeOutputs.has(n)&&(Number(itemDB[n].r)||1)===tier);
  if(!pool.length)pool=recipeMaterialPool.filter(n=>n!==r.out&&(Number(itemDB[n].r)||1)===tier);
  if(!pool.length){r.cost={};continue}
  const hash=Array.from(r.id+"|"+r.out).reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
  // Recetas con más nivel exigen más componentes y más unidades por componente.
  const kinds=Math.min(pool.length,tier>=5?4:tier>=3?3:2), chosen=[];
  for(let i=0;i<kinds;i++)chosen.push(pool[(hash+i*7+i*i*3)%pool.length]);
  const cost={};chosen.forEach((n,i)=>{const quantity=Math.min(4,1+((hash>>>(i*3))&1)+(tier>=3?1:0)+(tier>=5?1:0));cost[n]=(cost[n]||0)+quantity});
  for(const n of Object.keys(cost))cost[n]=Math.min(4,cost[n]);r.cost=cost;
 }
}
rebuildRecipeCosts();

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

const stateDefault = () => ({credits:0,level:1,xp:0,expeditions:0,fusions:0,inventory:[],equipped:{pick:null,axe:null,weapon:null,armor:null,anomaly:null,companion:null},history:[],pendingFusion:null,pendingSupply:null,activity:[],seen:[],discovered:{},synthesisVariants:{},valueRanges:{},settings:{sound:true,soundVolume:75,scale:"1",motion:false,layoutMode:"auto"},version:9});
let state = loadState();
state.settings=state.settings||{};if(state.settings.soundVolume==null)state.settings.soundVolume=75;
let fusionHum=null, masterGain=null;
let selectedZone = "forest", zoneHudOpen=false, lootHudOpen=false, inventoryFilter="Todos", inventoryPage=1, inventorySort="rarity", zonePage=1, recipePage=1, recipeCategory="Todos", smeltPage=1, registryPage=1, registryFilter="Todos", registrySort="name", registryPageSize=10, registryMode="base", pickerPage=1, pickerMode=null, pickerSlot=null, pickerFilter="Todos", centralSaleFilter="Todos", centralSaleSelection={}, activeTask=null, currentEnemy=null, pendingExploreLoot=[], playerCombatHp=0, playerCombatMax=0, audioCtx=null, deferredInstallPrompt=null, pendingConfirmAction=null;
function loadState(){try{const s=JSON.parse(localStorage.getItem("anomalyFusionSave")||localStorage.getItem("joyaCeroSave"));if(s&&(s.version===2||s.version===3||s.version===4||s.version===5||s.version===6||s.version===7||s.version===8||s.version===9)&&s.inventory&&s.equipped)return Object.assign(stateDefault(),s,{version:9,equipped:{...stateDefault().equipped,...s.equipped},history:(s.history||[]).slice(0,3),pendingFusion:s.pendingFusion||null,pendingSupply:s.pendingSupply||null,seen:[...new Set([...(s.seen||[]),...(s.inventory||[]).map(x=>x.name)])],discovered:{...(s.discovered||{}),...Object.fromEntries((s.inventory||[]).map(x=>[x.name,x]))},synthesisVariants:{...(s.synthesisVariants||{})},valueRanges:{...(s.valueRanges||{})}})}catch(e){}return stateDefault()}
function save(){try{localStorage.setItem("anomalyFusionSave",JSON.stringify(state))}catch(e){toast("No se pudo guardar la partida. Comprueba el espacio disponible del navegador.",true)}}
function normalizeImportedState(raw){
 if(!raw||typeof raw!=="object"||!Array.isArray(raw.inventory)||!raw.equipped||typeof raw.equipped!=="object")throw new Error("El archivo no contiene una partida válida.");
 const base=stateDefault();
 const next={...base,...raw,version:9};
 next.credits=Math.max(0,Number(next.credits)||0);next.level=Math.max(1,Number(next.level)||1);next.xp=Math.max(0,Number(next.xp)||0);
 next.inventory=raw.inventory.filter(x=>x&&typeof x==="object"&&typeof x.name==="string").map(x=>({...x,qty:Math.max(1,Math.floor(Number(x.qty)||1))}));
 next.equipped={...base.equipped,...raw.equipped};next.history=Array.isArray(raw.history)?raw.history.slice(0,3):[];
 next.pendingFusion=raw.pendingFusion&&typeof raw.pendingFusion==="object"?raw.pendingFusion:null;next.pendingSupply=raw.pendingSupply&&typeof raw.pendingSupply==="object"?raw.pendingSupply:null;
 next.activity=Array.isArray(raw.activity)?raw.activity.slice(-100):[];next.seen=[...new Set([...(Array.isArray(raw.seen)?raw.seen.filter(x=>typeof x==="string"):[]),...next.inventory.map(x=>x.name)])];
 next.discovered={...(raw.discovered&&typeof raw.discovered==="object"?raw.discovered:{}),...Object.fromEntries(next.inventory.map(x=>[x.name,x]))};next.synthesisVariants=raw.synthesisVariants&&typeof raw.synthesisVariants==="object"?raw.synthesisVariants:{};next.valueRanges=raw.valueRanges&&typeof raw.valueRanges==="object"?raw.valueRanges:{};
 next.settings={...base.settings,...(raw.settings&&typeof raw.settings==="object"?raw.settings:{})};
 if(!["0.9","1","1.1"].includes(String(next.settings.scale)))next.settings.scale="1";
 next.settings.sound=next.settings.sound!==false;next.settings.soundVolume=Math.max(0,Math.min(100,Number(next.settings.soundVolume??75)||0));next.settings.motion=!!next.settings.motion;if(!["auto","mobile","pc16"].includes(next.settings.layoutMode))next.settings.layoutMode="auto";
 return next;
}
function exportSave(){try{const payload={app:"Anomaly Fusion",format:1,exportedAt:new Date().toISOString(),save:state};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`anomaly-fusion-partida-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Copia de seguridad exportada.")}catch(e){toast("No se pudo exportar la partida.",true)}}
async function clearAppCache(){try{if("caches" in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith("anomaly-fusion-")).map(k=>caches.delete(k)))}}catch(e){}try{if("serviceWorker" in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()))}}catch(e){}}
function uid(){return Math.random().toString(36).slice(2,10)}
function info(name){return itemDB[name]||{icon:"❔",cat:"Otro",r:2,val:12,desc:"Objeto no catalogado. Sus propiedades desafían el registro."}}
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
// Migra al registro los niveles de síntesis ya existentes en partidas anteriores.
Object.entries(state.discovered||{}).forEach(([name,item])=>{if(isSynthesisItem(item)&&!state.synthesisVariants?.[name]?.length)saveSynthesisVariant({...item,name});});
function valueRangeKey(item){const name=typeof item==="string"?item:item?.name||"";const data=typeof item==="string"?knownInfo(name):item;return isSynthesisItem(data)?`${name}::N${Math.max(1,Number(data.r)||1)}`:name}
function recordObservedValue(item){if(!item||!item.name)return;state.valueRanges=state.valueRanges||{};const key=valueRangeKey(item),v=Math.max(1,Number(item.val)||Number(info(item.name).val)||1),prior=state.valueRanges[key];state.valueRanges[key]=prior?{min:Math.min(Number(prior.min)||v,v),max:Math.max(Number(prior.max)||v,v)}:{min:v,max:v}}
function getObservedRange(item){const key=valueRangeKey(item),range=state.valueRanges?.[key];if(range)return {min:Number(range.min)||Number(item.val)||1,max:Number(range.max)||Number(item.val)||1};const v=Math.max(1,Number(item.val)||Number(info(item.name).val)||1);return {min:v,max:v}}
// Conserva los valores ya conocidos en partidas anteriores como primer rango observado.
state.valueRanges=state.valueRanges||{};state.inventory.forEach(recordObservedValue);Object.entries(state.discovered||{}).forEach(([name,item])=>{if(item&&item.name)recordObservedValue({...item,name})});Object.entries(state.synthesisVariants||{}).forEach(([name,variants])=>(Array.isArray(variants)?variants:[]).forEach(v=>recordObservedValue({...v,name,trait:v.trait||"Síntesis de convergencia"})));
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
 let existing=state.inventory.find(x=>x.name===name&&d.cat==="Material"&&!resolved.unique&&!isSynthesisItem(resolved)&&!isSynthesisItem(x)&&x.origin===(resolved.origin||"general")&&x.cat===(cat||d.cat)&&Number(x.val||d.val||5)===Number(resolved.val||d.val||5));
 if(existing)existing.qty+=qty;
 else state.inventory.push({...resolved,id:uid(),name,qty,cat:cat||d.cat,r:resolved.r||d.r||1,val:resolved.val||d.val||5,desc:resolved.desc||d.desc||"",icon:resolved.icon||d.icon||"❔",slot});
 state.discovered=state.discovered||{};state.discovered[name]={...d,...resolved,name,cat:cat||d.cat,r:resolved.r||d.r||1,val:resolved.val||d.val||5,desc:resolved.desc||d.desc||"",icon:resolved.icon||d.icon||"❔"};
 if(!state.seen.includes(name))state.seen.push(name);
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
function damage(){return 5+stat("damage")}
function defense(){return stat("defense")}
const zoneUnlockLevels={forest:1,mine:1,scrapyard:1,swamp:4,quarry:6,bunker:8,glacier:10,volcano:12,neoncity:14,reef:16,dunes:18,rift:20,lab:22,silica:24,station:26,cryo:29,vault:32,root:35,foundry:38,observatory:46,nullshore:50};
function operatorRank(level=state.level){if(level>=50)return "Singularidad viviente";if(level>=47)return "Nexo trascendente";if(level>=43)return "Arquitecto de convergencia";if(level>=39)return "Soberano de anomalías";if(level>=35)return "Custodio del umbral";if(level>=31)return "Estratega del vacío";if(level>=27)return "Maestro de expedición";if(level>=20)return "Vanguardia anómala";if(level>=16)return "Comandante de campo";if(level>=12)return "Especialista de ruptura";if(level>=9)return "Veterano de expedición";if(level>=6)return "Técnico de anomalías";if(level>=4)return "Explorador avanzado";if(level>=2)return "Operador de campo";return "Recluta de campo"}
function zoneRequiredLevel(z){return zoneUnlockLevels[z.id]||1}
function zoneUnlocked(z){return state.level>=zoneRequiredLevel(z)}
function xp(n){const baseGain=Math.max(0,Math.floor(Number(n)||0));const gain=baseGain?Math.max(1,Math.floor(baseGain*(1+Math.max(0,stat("experience"))/100))):0;if(!gain)return;if(state.level>=50){state.level=50;state.xp=0;toast("Nivel máximo alcanzado: 50.");return}state.xp+=gain;log(`Experiencia obtenida: <b>+${gain} XP</b>.`);while(state.level<50&&state.xp>=state.level*100){state.xp-=state.level*100;state.level++;const levelReward=20+state.level*5;const rankMilestone=[2,4,6,9,12,16,20,27,31,35,39,43,47,50].includes(state.level);const rankBonus=rankMilestone?state.level*10:0;const reward=levelReward+rankBonus;state.credits+=reward;log(`¡Nivel ${state.level} alcanzado! Rango: <b>${operatorRank()}</b>. +${levelReward} créditos${rankBonus?` y +${rankBonus} por rango`:""}.`);toast(`¡Nivel ${state.level}! <b>${operatorRank()}</b> · +${reward} créditos`)}if(state.level>=50)state.xp=0;renderStats();save()}
function log(msg){state.activity.unshift({msg,time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})});state.activity=state.activity.slice(0,8)}
function ensureAudio(){
 audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();
 if(!masterGain){
  masterGain=audioCtx.createGain();
  // techo suave para evitar picos
  masterGain.gain.value=Math.max(0,Math.min(100,Number(state.settings.soundVolume??75)))/100*0.85;
  masterGain.connect(audioCtx.destination);
 }
 if(audioCtx.state==="suspended")audioCtx.resume().catch(()=>{});
 return audioCtx;
}
function setSoundVolume(value){
 state.settings.soundVolume=Math.max(0,Math.min(100,Number(value)||0));
 if(masterGain&&audioCtx){
  const now=audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setTargetAtTime((state.settings.soundVolume/100)*0.85,now,.04);
 }
 const slider=$("soundVolume"),label=$("soundVolumeValue");
 if(slider)slider.value=state.settings.soundVolume;
 if(label)label.textContent=state.settings.soundVolume+"%";
 save();
}
// Beep suave con ataque/release lineales (sin saltos de ganancia = sin petardeo)
function sound(freq=520,dur=.07,type="sine"){
 if(!state.settings.sound||Number(state.settings.soundVolume)===0)return;
 try{
  ensureAudio();
  const now=audioCtx.currentTime;
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  const filter=audioCtx.createBiquadFilter();
  osc.type=(type==="triangle")?"triangle":"sine"; // nunca sierra
  osc.frequency.setValueAtTime(Math.max(80,Math.min(1800,Number(freq)||520)),now);
  filter.type="lowpass";
  filter.frequency.setValueAtTime(Math.min(2400,(Number(freq)||520)*2.8),now);
  filter.Q.value=0.4;
  const peak=0.07;
  const attack=0.015;
  const body=Math.max(0.05,Math.min(0.35,Number(dur)||.07));
  gain.gain.setValueAtTime(0,now);
  gain.gain.linearRampToValueAtTime(peak,now+attack);
  gain.gain.linearRampToValueAtTime(0,now+attack+body);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now+attack+body+0.03);
 }catch(e){}
}

// Sonido de venta / envío de suministro: arpegio corto ascendente, distinto a los beeps UI
function soundSale(){
 if(!state.settings.sound||Number(state.settings.soundVolume)===0)return;
 try{
  ensureAudio();
  const ctx=audioCtx;
  const now=ctx.currentTime;
  const notes=[523.25,659.25,783.99]; // C5 E5 G5
  notes.forEach((freq,i)=>{
   const t=now+i*0.07;
   const osc=ctx.createOscillator();
   const gain=ctx.createGain();
   const filter=ctx.createBiquadFilter();
   osc.type="sine";
   osc.frequency.setValueAtTime(freq,t);
   filter.type="lowpass";
   filter.frequency.setValueAtTime(1800,t);
   filter.Q.value=0.4;
   gain.gain.setValueAtTime(0,t);
   gain.gain.linearRampToValueAtTime(0.045,t+0.02);
   gain.gain.linearRampToValueAtTime(0,t+0.16);
   osc.connect(filter);filter.connect(gain);gain.connect(masterGain);
   osc.start(t);
   osc.stop(t+0.2);
  });
 }catch(e){}
}
function toast(msg,bad=false){const d=document.createElement("div");d.className="toast"+(bad?" bad":"");d.innerHTML=msg; $("toastArea").appendChild(d);sound(bad?180:620,.06,bad?"triangle":"sine");setTimeout(()=>d.remove(),3500)}
function showConfirm(title,message,acceptLabel,action,danger=false){pendingConfirmAction=action;$ ("confirmTitle").textContent=title;$ ("confirmMessage").textContent=message;$ ("confirmAccept").textContent=acceptLabel||"Confirmar";$ ("confirmAccept").classList.toggle("danger",!!danger);$ ("confirmAccept").classList.toggle("primary",!danger);$ ("confirmModal").classList.remove("hidden");$ ("confirmCancel").focus({preventScroll:true});}
function closeConfirm(){pendingConfirmAction=null;$ ("confirmModal").classList.add("hidden")}
function closeSortMenus(except){document.querySelectorAll(".sort-options").forEach(menu=>{if(menu.id!==except)menu.classList.add("hidden")});document.querySelectorAll(".sort-trigger").forEach(button=>{if(button.nextElementSibling?.id!==except)button.setAttribute("aria-expanded","false")})}
function setSortMenu(target,value){const options={inventory:{rarity:"Nivel: mayor primero",name:"Nombre A-Z",value:"Valor: mayor primero"},registry:{name:"Nombre A-Z",rarity:"Nivel: mayor primero",value:"Valor: mayor primero"}};if(target==="inventory"){inventorySort=value;$("sortInventoryLabel").textContent=options.inventory[value];inventoryPage=1;renderInventory()}else{registrySort=value;$("registrySortLabel").textContent=options.registry[value];registryPage=1;renderRegistry()}document.querySelectorAll(`[data-sort-target="${target}"]`).forEach(button=>button.setAttribute("aria-selected",String(button.dataset.sortValue===value)));closeSortMenus()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function inventoryDisplayName(x){const raw=String(x?.name||"Objeto desconocido");const cleaned=raw.replace(/\s*·\s*.+$/,"").trim();return cleaned||raw}
function objectTypeLabel(x){const name=String(x?.name||"");const m=name.match(/\s*·\s*(.+)$/);if(m&&m[1].trim())return m[1].trim();return x?.cat||info(x?.name||"").cat||"Otro"}
function itemCard(x,opts={}){const r=x.r||info(x.name).r||1;if(opts.compact){const fused=isSynthesisItem(x),desc=x.desc||info(x.name).desc||"Objeto sin descripción.";return `<button type="button" class="item-card inventory-tile rarity-${r}" data-inventory-detail="${escapeHtml(x.id)}" aria-label="Ver detalles de ${escapeHtml(x.name)}"><div class="item-top"><div class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</div><div class="inventory-tile-main"><h4 title="${escapeHtml(inventoryDisplayName(x))}">${escapeHtml(inventoryDisplayName(x))} ${x.qty>1?`<span class="muted">×${x.qty}</span>`:""}</h4><div class="rarity r${r}">${escapeHtml(rarityNames[r]||"COMÚN")} · N${r}</div></div></div><div class="inventory-tile-description">${escapeHtml(desc)}</div>${fused?`<div class="inventory-tile-trait">✦ Síntesis de convergencia</div>`:""}<div class="inventory-tile-meta"><span>${escapeHtml(x.cat||info(x.name).cat||"Otro")}</span><b>${Number(x.val||info(x.name).val||1)} cr.</b></div><span class="inventory-tile-open">Ver detalles ↗</span></button>`}const skills=Array.isArray(x.abilities)?x.abilities:(x.ability?[x.ability]:[]);
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
function nav(page){if(currentEnemy){toast("Hay un combate en curso. Resuélvelo antes de cambiar de pantalla.",true);return}const requestedSupplies=page==="supplies";if(requestedSupplies)page="central";document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));if(requestedSupplies){document.querySelectorAll("[data-central-tab]").forEach(b=>b.classList.toggle("active",b.dataset.centralTab==="supplies"));document.querySelectorAll("#page-central .central-section").forEach(x=>x.classList.toggle("active",x.id==="central-supplies"))}window.scrollTo({top:0,behavior:state.settings.motion?"auto":"smooth"});render()}
function bindNavigation(){document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.page)));document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.goto)))}
function renderStats(){if($("operatorRank"))$("operatorRank").textContent=operatorRank();if($("profileRank"))$("profileRank").textContent=operatorRank();$("credits").textContent=state.credits.toLocaleString("es-ES");$("level").textContent=state.level;const seenNames=[...new Set((state.seen||[]).filter(Boolean))];let baseCount=0,synthCount=0;seenNames.forEach(name=>{const item={name,...knownInfo(name)};if(isSynthesisItem(item))synthCount++;else baseCount++});if($("itemCountBase"))$("itemCountBase").textContent=baseCount;if($("itemCountSynth"))$("itemCountSynth").textContent=synthCount;if($("itemCount"))$("itemCount").textContent=baseCount+synthCount;$("expCount").textContent=state.expeditions;$("fusionCount").textContent=state.fusions;$("activityLog").innerHTML=state.activity.length?state.activity.map(a=>`<div class="activity"><span class="muted">[${a.time}]</span> ${a.msg}</div>`).join(""):'<div class="empty">Sin actividad registrada. Tu historia empieza ahora.</div>';$("profileLevel").textContent=state.level;$("xpText").textContent=`${state.xp} / ${state.level*100} XP`;$("xpBar").style.width=(state.xp/(state.level*100)*100)+"%";$("statDamage").textContent=damage();$("statDefense").textContent=defense();$("statGather").textContent=stat("gather")+"%";$("statLuck").textContent=Math.max(0,(state.level-1)*2+stat("luck"))+"%";$("statCredits").textContent=state.credits}
function openZoneHud(zoneId){const target=zones.find(z=>z.id===zoneId);if(!target)return;if(!zoneUnlocked(target)){toast(`Zona bloqueada. Necesitas nivel ${zoneRequiredLevel(target)} de Operador.`,true);return}selectedZone=zoneId;zoneHudOpen=true;lootHudOpen=false;renderZoneCards();renderZoneDetail();renderZoneLoot();sound(470,.07,"triangle");window.scrollTo({top:0,behavior:state.settings.motion?"auto":"smooth"})}
function closeZoneHud(){if(activeTask&&activeTask.type==="explore"){toast("La expedición sigue activa. Espera a que termine para salir de la zona.",true);return}if(currentEnemy){toast("Hay un combate en curso. Debes resolver el contacto hostil antes de salir.",true);return}zoneHudOpen=false;lootHudOpen=false;currentEnemy=null;pendingExploreLoot=[];$("combatPanel").classList.add("hidden");renderZoneCards();sound(340,.06,"sine")}
function renderZoneDetail(){const z=zones.find(x=>x.id===selectedZone)||zones[0];const risk=["BAJO","MODERADO","ALTO","EXTREMO"][z.risk]||"VARIABLE";const host=$("zoneHudDetail");if(!host)return;host.innerHTML=`<div class="eyebrow">DOSSIER DE CAMPO · ${escapeHtml(z.id.toUpperCase())}</div><div style="display:flex;align-items:flex-start;gap:14px;margin:12px 0"><div class="zone-art" style="width:88px;min-width:88px;height:88px">${itemIconMarkup(z.name,z.icon)}</div><div style="flex:1"><h3 style="margin:0 0 8px">${escapeHtml(z.name)}</h3><p class="small-note">${escapeHtml(z.desc)}</p><div class="small-note" style="margin-top:10px">Riesgo: <b>${risk}</b> · Probabilidad de contacto: ${Math.round(z.enemy*100)}% · Duración estimada: 10 s</div></div></div><div class="zone-hud-actions"><button id="zoneBackBtn">← Volver a exploración</button><button id="zoneLootBtn" aria-expanded="${lootHudOpen}" class="${lootHudOpen?"active":""}">▤ Loot de la zona (${z.loot.length})</button><button class="primary" id="exploreBtn" ${activeTask||currentEnemy?"disabled":""}>⌖ INICIAR EXPEDICIÓN · 10 S</button></div>`;const b=$("exploreBtn");if(b)b.onclick=beginExplore;const back=$("zoneBackBtn");if(back)back.onclick=closeZoneHud;const loot=$("zoneLootBtn");if(loot)loot.onclick=()=>{lootHudOpen=!lootHudOpen;renderZoneDetail();renderZoneLoot()}}
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
 if(!state.settings.sound||Number(state.settings.soundVolume)===0)return;
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

function beginTask(type,duration,onDone,els){if(activeTask)return;activeTask={type,start:Date.now(),duration,done:false,lastCue:0};stopFusionHum();sound(420,.1,"sine");els.panel.classList.remove("hidden");els.bar.style.width="0%";els.percent.textContent="0%";els.status&&(els.status.textContent=type==="explore"?"Explorando...":type==="craft"?"Fabricando...":"Fusionando...");els.button&&(els.button.disabled=true);const tick=()=>{if(!activeTask||activeTask.type!==type)return;const p=Math.min(1,(Date.now()-activeTask.start)/duration);els.bar.style.width=(p*100)+"%";els.percent.textContent=Math.floor(p*100)+"%";const step=Math.floor(p*5);if(step>activeTask.lastCue&&p<1){activeTask.lastCue=step;sound(620+step*25,.05,"sine")}if(p>=1){activeTask=null;sound(740,.12,"sine");onDone();return}setTimeout(tick,100)};tick()}
function beginExplore(){if(activeTask||currentEnemy)return;const z=zones.find(z=>z.id===selectedZone);if(!z||!zoneUnlocked(z))return toast(`Zona bloqueada. Necesitas nivel ${zoneRequiredLevel(z||zones[0])} de Operador.`,true);$("combatPanel").classList.add("hidden");$("exploreProgressPanel").classList.remove("hidden");beginTask("explore",10000,()=>{state.expeditions++;const foundItems=[];const primary=z.loot[Math.floor(Math.random()*z.loot.length)];foundItems.push(primary);const gatherChance=Math.min(.82,Math.max(0,(stat("gather")+stat("loot"))/100));if(Math.random()<gatherChance)foundItems.push(z.loot[Math.floor(Math.random()*z.loot.length)]);const rareChance=Math.min(.35,Math.max(0,stat("luck")/200));if(Math.random()<rareChance)foundItems.push(z.loot[Math.floor(Math.random()*z.loot.length)]);// Anomalías base: baja probabilidad en cualquier zona
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
 $("enemyCombatIcon").textContent=e.icon||"☠";
 $("playerCombatIcon").textContent="◎";
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
function renderFusionSelects(){["A","B"].forEach(k=>{const id=state.fusionSlots?.[k];const x=state.inventory.find(x=>x.id===id);const slot=$("slot"+k);slot.classList.toggle("filled",!!x);slot.querySelector(".slot-icon").innerHTML=x?itemIconMarkup(x.name,x.icon||info(x.name).icon):"＋";$("fusion"+k+"Label").textContent=x?inventoryDisplayName(x):`Objeto ${k}`;$("chooseFusion"+k).textContent=x?"Cambiar objeto":"Elegir del inventario"});$("fuseBtn").disabled=!!activeTask||!!state.pendingFusion||!state.inventory.some(x=>x.id===state.fusionSlots?.A)||!state.inventory.some(x=>x.id===state.fusionSlots?.B);$("chooseFusionA").disabled=!!state.pendingFusion||!!activeTask;$("chooseFusionB").disabled=!!state.pendingFusion||!!activeTask}
function openPicker(mode,slot=null){pickerMode=mode;pickerSlot=slot;pickerFilter="Todos";pickerPage=1;$("pickerSearch").value="";$("pickerTitle").textContent=mode==="fusion"?`▤ INVENTARIO · OBJETO ${slot}`:mode==="sell"?"▤ INVENTARIO · VENDER":"▤ INVENTARIO · EQUIPAR";$("pickerDescription").textContent=mode==="fusion"?"Selecciona un objeto propio del juego para la cámara de fusión.":mode==="sell"?"Selecciona el objeto que quieres vender.":"Selecciona una pieza compatible con el espacio de equipo.";$("pickerFilterMenu").classList.toggle("hidden",mode!=="fusion");$("pickerFilterLabel").textContent=pickerFilter;$("inventoryPicker").classList.remove("hidden");renderPicker()}
function renderPicker(){let list=state.inventory.filter(x=>x.qty>0&&x.name.toLowerCase().includes($("pickerSearch").value.toLowerCase()));if(pickerMode==="fusion"&&pickerFilter!=="Todos")list=list.filter(x=>pickerFilter==="Síntesis"?isSynthesisItem(x):pickerFilter==="Lingote"?(x.cat==="Lingote"||x.name.startsWith("Lingote de ")):pickerFilter==="Otro"?!( ["Material","Lingote","Herramienta","Arma","Equipo","Consumible","Criatura","Anomalía"].includes(x.cat)):x.cat===pickerFilter);if(pickerMode==="equip")list=list.filter(x=>pickerSlot==="anomaly"?x.cat==="Anomalía":pickerSlot==="companion"?x.cat==="Criatura":info(x.name).slot===pickerSlot||x.slot===pickerSlot);const pages=Math.max(1,Math.ceil(list.length/10));pickerPage=Math.min(pickerPage,pages);const shown=list.slice((pickerPage-1)*10,pickerPage*10);$("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span style="min-width:0"><b title="${escapeHtml(x.name)}">${escapeHtml(inventoryDisplayName(x))}</b><small>N${x.r} · ${escapeHtml(x.cat)} · ×${x.qty}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos disponibles en esta categoría.</div>';$ ("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;$("pickerPrev").disabled=pickerPage<=1;$("pickerNext").disabled=pickerPage>=pages;document.querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{const x=state.inventory.find(i=>i.id===b.dataset.pickId);if(!x)return;if(pickerMode==="fusion"){state.fusionSlots=state.fusionSlots||{A:null,B:null};state.fusionSlots[pickerSlot]=x.id;renderFusionSelects()}else if(pickerMode==="equip"){if(pickerSlot==="companion"&&!x.abilities?.length&&!x.ability){x.abilities=rollCompanionAbilities(x.r||1);x.ability=x.abilities[0];x.desc=`Compañero de campo. Habilidades procedurales: ${x.abilities.map(a=>a.name+" ("+a.desc+")").join(" · ")}.`}state.equipped[pickerSlot]=x.id;log(`Equipo actualizado: ${x.name}.`);renderEquipment();renderStats();renderBonus()}$("inventoryPicker").classList.add("hidden");save();sound(500)})}
function fusionOutcome(a,b){
 const da={...info(a.name),...a},db={...info(b.name),...b},text=(a.name+" "+b.name+" "+da.cat+" "+db.cat).toLowerCase();
 const creature=da.cat==="Criatura"||db.cat==="Criatura"||/zombie|mutante|ghoul|híbrido|infectado|merodeador|aberración|cosechador|dron biológico/.test(text);
 const plant=/madera|rama|hoja|resina|seta|hongo|espora|mutada|jardinero|fibra|vegetal/.test(text),metal=/chatarra|hierro|cobre|oro|lingote|tornillo|cable|placa|metal|pico|hacha|titanio|acero/.test(text),energy=/batería|núcleo|energético|cristal|geoda|eléctrica|solar|neón|cuántico|fase/.test(text);
 const weapon=[da.cat,db.cat].includes("Arma")||/espada|cuchillo|cañón|\bbate\b|colmillo|lanza|rifle/.test(text),tool=[da.cat,db.cat].includes("Herramienta"),gear=[da.cat,db.cat].includes("Equipo"),consumable=[da.cat,db.cat].includes("Consumible"),sameCat=da.cat===db.cat;let name,icon,cat,slot=null;
 const pools={
  plant:["Raíz prismática","Brote acorazado","Fibra viva","Coraza de savia","Jardín de espinas","Micelio soberano","Semilla de eclipse","Flor de ferrita","Enredadera cuántica","Espora de cristal","Corteza espectral","Pétalo de titanio","Núcleo fotosintético","Musgo abisal","Loto de plasma","Raíz de gravedad","Brote de obsidiana","Savia del vacío","Hiedra magnética","Coral terrestre","Trama micelar","Crisálida vegetal","Flor de tormenta","Médula botánica","Espina de neón","Polen dimensional","Rizoma errante","Copa de ceniza","Fronda reactiva","Semilla imposible"],
  metal:["Aleación de impacto","Nexo de ferrita","Módulo calibrado","Placa de titanio","Acero de eclipse","Engranaje abisal","Armazón de obsidiana","Malla gravitatoria","Núcleo de tungsteno","Lámina espectral","Pistón de vacío","Aleación fantasma","Chasis de neón","Crisol de cobalto","Cerámica cinética","Bobina de iridio","Yunque dimensional","Blindaje de osmio","Trama de mercurio","Relé de titanio","Placa metamórfica","Armadura de ferrita","Matriz de aleación","Cobre de tormenta","Estructura singular","Nervio mecánico","Perno de eclipse","Bastidor cuántico","Carcasa de plasma","Metal de frontera"],
  energy:["Núcleo resonante","Prisma de fase","Celda espectral","Bobina voltaica","Corazón de antimateria","Batería de eclipse","Condensador abisal","Orbe de taquiones","Cápsula de vacío","Cristal gravitatorio","Reactor de bolsillo","Pulso de neón","Geoda temporal","Dínamo fantasma","Matriz de plasma","Prisma de tormenta","Núcleo de singularidad","Célula de fotones","Bobina de horizonte","Cuarzo imposible","Acumulador cuántico","Esfera de entropía","Batería dimensional","Lente de radiancia","Cápsula de aurora","Cristal de marea","Reactor espectral","Nodo de energía oscura","Vórtice encapsulado","Fulgor mineral"],
  creature:["Quimera errante","Vástago anómalo","Bestia sintética","Simbionte mutado","Acechador de fase","Coloso micelar","Cérbero espectral","Parásito soberano","Devorador de ecos","Híbrido de ceniza","Lince de neón","Hidra de ferrita","Centinela orgánico","Nómada abisal","Quimera de eclipse","Larva gravitatoria","Depredador fractal","Vigía parasitario","Gólem biológico","Mímico de vacío","Rastreador cuántico","Titán de esporas","Espectro carnívoro","Bestia de frontera","Nexo viviente","Mutante de cristal","Corredor dimensional","Simbionte de plasma","Cosechador silente","Aberración coronada"],
  weapon:["Cortavacío","Filo de resonancia","Impactador cinético","Disruptor de fase","Sable de eclipse","Lanza gravitatoria","Martillo de singularidad","Rifle espectral","Guadaña de neón","Cañón de tormenta","Púa dimensional","Hacha de plasma","Filo de obsidiana","Perforador cuántico","Arco de fotones","Espada de entropía","Látigo magnético","Punzón de vacío","Lanza de ferrita","Cortador abisal","Fusil de taquiones","Maza de horizonte","Hoja de antimateria","Bastón de tormenta","Aguja de eclipse","Disyuntor cinético","Filo parasitario","Cañón de aurora","Sable fractal","Martillo del umbral"],
  tool:["Extractor adaptativo","Sonda de prospección","Taladro resonante","Recolector de precisión","Pico de horizonte","Cortador de fase","Analizador abisal","Sifón de plasma","Broca gravitatoria","Lector de anomalías","Perforador de titanio","Sonda espectral","Cosechador micelar","Llave dimensional","Taladro de eclipse","Pinza magnética","Extractor fantasma","Módulo cartográfico","Cortador cuántico","Recolector de vacío","Bastón de sondeo","Sonda de entropía","Separador de isótopos","Rastreador mineral","Matriz de prospección","Cizalla de neón","Compás gravitatorio","Núcleo perforador","Escáner de frontera","Herramienta imposible"],
  gear:["Blindaje reactivo","Bastión adaptable","Manto de dispersión","Escudo de fase","Coraza de eclipse","Visor espectral","Traje de vacío","Égida gravitatoria","Peto de obsidiana","Capa de neón","Arnés dimensional","Malla de plasma","Yelmo de taquiones","Escudo de horizonte","Blindaje micelar","Manto de entropía","Cúpula cinética","Traje abisal","Visor de singularidad","Coraza fantasma","Bastión de ferrita","Escudo parasitario","Malla de antimateria","Capa de tormenta","Peto cuántico","Sello de frontera","Égida de cristal","Traje de eclipse","Blindaje de aurora","Armadura imposible"],
  consumable:["Catalizador de pulso","Inyector estabilizado","Carga de sobrepresión","Baliza reactiva","Suero de eclipse","Ampolla gravitatoria","Dosis de neón","Elixir de fase","Carga de taquiones","Antídoto espectral","Estimulante abisal","Vial de plasma","Catalizador micelar","Inyector de vacío","Baliza dimensional","Cápsula de entropía","Suero de frontera","Carga de antimateria","Ampolla de aurora","Dosis cuántica","Antídoto de esporas","Elixir de singularidad","Vial de tormenta","Estimulante de eclipse","Carga de horizonte","Catalizador fantasma","Inyector de fotones","Baliza de obsidiana","Suero imposible","Ampolla de cristal"],
  other:["Artefacto de convergencia","Componente singular","Módulo de resonancia","Relé transmutador","Fragmento de eclipse","Ídolo de fase","Nexo de frontera","Reliquia de vacío","Prisma errante","Sello de entropía","Matriz imposible","Esquirla de horizonte","Cubo de taquiones","Orbe parasitario","Cifra dimensional","Eco mineral","Nódulo espectral","Cápsula de singularidad","Vestigio de plasma","Ancla gravitatoria","Fragmento de aurora","Dispositivo de obsidiana","Relicario cuántico","Pieza de antimateria","Símbolo abisal","Módulo de eclipse","Artefacto fractal","Nexo silente","Componente de tormenta","Vestigio imposible"]};
 const choose=list=>list[Math.floor(Math.random()*list.length)];
 const epithets=["del Umbral","de la Aurora Negra","del Horizonte Roto","de Entropía","del Vacío Vivo","de la Marea Cuántica","del Eclipse","de la Frontera","de los Ecos","de Plasma Frío","de la Tormenta Silente","del Abismo","de la Última Luz","de Fase Inversa","de la Singularidad","de la Noche Magnética","del Jardín Muerto","de la Corona Rota","de la Gravedad","del Tiempo Quieto","de Cristal Oscuro","de la Aurora Roja","de la Dimensión Ciega","del Pulso Eterno","de la Ceniza Viva","del Laberinto","de la Estrella Muerta","de la Resonancia","del Parpadeo","de la Marea Negra","del Eco Perdido","de la Ruptura"];
 const prefixes=["Proto","Neo","Ultra","Hiper","Meta","Cero","Omega","Alfa","Delta","Sigma","Épsilon","Nexo","Vórtice","Umbral","Fase","Nómada","Soberano","Errante","Silente","Fractal","Fantasma","Radiante","Abisal","Parásito"];
 if(creature){name=choose(pools.creature);icon=metal?"🤖":plant?"🧬":"🧟";cat="Criatura";}
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
  mineral:{nouns:["Prisma","Ferrita","Geoda","Cuarzo","Nexo","Aleación","Matriz","Fragmento","Nódulo","Cristal"],adjs:["Voltaico","Umbrío","Resonante","Fractal","Espectral","Gravitatorio","Prismático","Inestable"]},
  energia:{nouns:["Núcleo","Pulso","Bobina","Celda","Reactor","Prisma","Condensador","Matriz","Emisor","Lente"],adjs:["Voltaico","Cuántico","Espectral","Solar","Abisal","Resonante","Inestable","Singular"]},
  anomalia:{nouns:["Eco","Umbral","Nexo","Paradoja","Vórtice","Singularidad","Distorsión","Vestigio","Eclipse","Ancla"],adjs:["Temporal","Fractal","Viviente","Espectral","Inverso","Abisal","Errante","Inestable"]},
  biologico:{nouns:["Quimera","Simbionte","Vástago","Mímico","Crisálida","Coloso","Larva","Centinela","Híbrido","Acechador"],adjs:["Cristalino","Voltaico","Umbrío","Simbiótico","Espectral","Abisal","Mutante","Fractal"]},
  combate:{nouns:["Filo","Sable","Lanza","Martillo","Cortavacío","Disruptor","Guadaña","Impactador","Cañón","Ruptor"],adjs:["Resonante","Voltaico","Cuántico","Espectral","Gravitatorio","Umbrío","Fractal","Singular"]},
  tecnico:{nouns:["Extractor","Sonda","Taladro","Analizador","Módulo","Recolector","Cortador","Sifón","Escáner","Perforador"],adjs:["Adaptativo","Resonante","Cuántico","Espectral","Magnético","Voltaico","Abisal","Prismático"]},
  proteccion:{nouns:["Coraza","Égida","Blindaje","Manto","Bastión","Yelmo","Armazón","Peto","Escudo","Traje"],adjs:["Reactivo","Prismático","Voltaico","Espectral","Gravitatorio","Adaptativo","Abisal","Fractal"]},
  quimico:{nouns:["Suero","Ampolla","Catalizador","Inyector","Vial","Elixir","Dosis","Reactivo","Cápsula","Compuesto"],adjs:["Simbiótico","Voltaico","Cuántico","Regenerativo","Espectral","Inestable","Abisal","Prismático"]}
 };
 const catFamily=cat==="Criatura"?"biologico":cat==="Arma"?"combate":cat==="Herramienta"?"tecnico":cat==="Equipo"?"proteccion":cat==="Consumible"?"quimico":cat==="Anomalía"?"anomalia":(themes.includes("vegetal")?"vegetal":themes.includes("energia")?"energia":themes.includes("mineral")?"mineral":energy?"energia":metal?"mineral":"tecnico");
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
  const cores=["Eco","Nexo","Vórtice","Prisma","Matriz","Quimera","Umbral","Singularidad","Rizoma","Fulgor","Esquirla","Paradoja","Crisálida","Fragmento","Simbionte","Ancla","Mímico","Reactor","Trama","Eclipse","Nódulo","Espectro","Horizonte","Cifra","Loto","Cortavacío"];
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
 if(cat==="Arma"){out.damage=Math.max(4,Math.round(r*5+(Number(a.damage)||0)*.25+(Number(b.damage)||0)*.25+Math.random()*r*2));out.secondaryTrait=choose(["Filo resonante","Impacto brutal","Pulso estable","Carga residual"]);}
 if(cat==="Herramienta"){out.gather=Math.max(5,Math.round(r*7+(Number(a.gather)||0)*.2+(Number(b.gather)||0)*.2+Math.random()*r*2));out.damage=Math.round(r*2+Math.random()*r);out.secondaryTrait=choose(["Extracción fina","Agarre adaptativo","Lectura mineral","Corte limpio"]);}
 if(cat==="Equipo"){out.defense=Math.max(3,Math.round(r*6+(Number(a.defense)||0)*.25+(Number(b.defense)||0)*.25+Math.random()*r*2));out.secondaryTrait=choose(["Blindaje reactivo","Disipación térmica","Sello hermético","Malla cinética"]);}
 if(cat==="Criatura"){out.abilities=rollCompanionAbilities(r);out.ability=out.abilities[0];out.companion=true;}
 if(r>=3&&Math.random()<Math.min(.42,.12+r*.055)){cat="Anomalía";out.cat=cat;out.name=["Nexo de Singularidad","Umbral Espectral","Eco Temporal","Vórtice Fractal","Paradoja Cuántica","Eclipse Viviente","Marea Anómala","Prisma del Vacío"][stableHash(sourceKey+"::anomaly")%8];out.icon="🧬";const passives=[["Daño",`+${2+r*2} daño pasivo`],["Defensa",`+${r*2} defensa pasiva`],["Recolección",`+${r*5}% de recolección`],["Suerte",`+${r*3}% de hallazgos`],["Créditos",`+${r*2}% de créditos`],["Captura",`+${r*2}% de captura`]];const passive=passives[Math.floor(Math.random()*passives.length)];out.passive={type:passive[0],value:passive[1]};out.slot=null;out.desc=synthesisDescription("Anomalía");out.val+=20;}
 return out;
}
function doFuse(){if(activeTask||state.pendingFusion)return;if(!state.fusionSlots)return;const a=state.inventory.find(x=>x.id===state.fusionSlots?.A),b=state.inventory.find(x=>x.id===state.fusionSlots?.B);if(!a||!b)return toast("Selecciona dos objetos antes de fusionar.",true);if(a.id===b.id&&a.qty<2)return toast("Necesitas dos unidades si eliges el mismo objeto.",true);const aa={...a},bb={...b};beginTask("fusion",10000,()=>{if(aa.id===bb.id){takeById(aa.id,2)}else{takeById(aa.id,1);takeById(bb.id,1)}const out={...fusionOutcome(aa,bb),sourceA:aa.name,sourceB:bb.name,origin:"síntesis",trait:"Síntesis de convergencia",affix:"Síntesis de convergencia",unique:true};saveSynthesisVariant(out);/* No reemplazar el valor de esta fusión por el de una variante anterior con el mismo nombre: cada resultado conserva su propio valor calculado. */itemDB[out.name]=out;state.discovered=state.discovered||{};state.discovered[out.name]={...out,name:out.name};if(!state.seen.includes(out.name))state.seen.push(out.name);state.fusions++;xp(20);state.pendingFusion={a:aa.name,b:bb.name,out,createdAt:Date.now()};state.history.unshift({a:aa.name,b:bb.name,out:out.name,r:out.r,icon:out.icon});state.history=state.history.slice(0,3);log(`Fusión lista para reclamar: <b>${aa.name}</b> + <b>${bb.name}</b>.`);toast("Fusión terminada. Reclama el objeto para guardarlo.");render();save()}, {panel:$('fusionProgress'),bar:$('fusionBar'),percent:$('fusionPercent'),status:null,button:$('fuseBtn')});renderFusionSelects()}
function claimFusion(){if(!state.pendingFusion)return;const out=state.pendingFusion.out;itemDB[out.name]=out;addItem(out.name,1,{...out,origin:"síntesis",trait:"Síntesis de convergencia",affix:"Síntesis de convergencia",unique:true});state.pendingFusion=null;state.fusionSlots={A:null,B:null};$('fusionResult').innerHTML='';$('fusionProgress').classList.add('hidden');log(`Objeto de fusión reclamado: <b>${inventoryDisplayName(out)}</b>. Máquina reiniciada.`);toast(`Añadido al inventario: <b>${inventoryDisplayName(out)}</b>`);render();save()}
function recipePageSize(){const desktop=window.matchMedia("(min-width: 901px)").matches&&!document.body.classList.contains("layout-mobile");return desktop?6:4}
function renderRecipes(){const pageSize=recipePageSize();let filtered=recipes.filter(r=>recipeCategory==="Todos"||(r.category||info(r.out).cat)===recipeCategory).sort((a,b)=>info(a.out).r-info(b.out).r||a.name.localeCompare(b.name,"es"));const pages=Math.max(1,Math.ceil(filtered.length/pageSize));recipePage=Math.min(Math.max(1,recipePage),pages);const shown=filtered.slice((recipePage-1)*pageSize,(recipePage-1)*pageSize+pageSize);const canCraft=r=>Object.entries(r.cost).every(([n,q])=>count(n)>=q);$("recipesGrid").innerHTML=shown.length?shown.map(r=>{const can=canCraft(r);return `<div class="recipe-card"><div style="display:flex;gap:9px;align-items:center"><span class="recipe-icon">${itemIconMarkup(r.out,r.icon)}</span><div><h4>${escapeHtml(r.name)}</h4><div class="rarity r${info(r.out).r}">NIVEL ${info(r.out).r} · ${escapeHtml(r.category||info(r.out).cat)}</div></div></div><p>${escapeHtml(r.desc)}</p><div class="loot-chips">${Object.entries(r.cost).map(([n,q])=>`<span class="chip ${count(n)>=q?"common":""}">${itemIconMarkup(n,info(n).icon)} ${escapeHtml(n)} ${count(n)}/${q}</span>`).join("")}</div><button data-craft="${r.id}" ${can&&!activeTask?"":"disabled"}>Fabricar · 10 s</button></div>`}).join(""):'<div class="empty" style="grid-column:1/-1">No hay recetas en esta categoría.</div>';$("recipesPageInfo").textContent=`Página ${recipePage} / ${pages}`;$("recipesPrev").disabled=recipePage<=1;$("recipesNext").disabled=recipePage>=pages;document.querySelectorAll("[data-craft]").forEach(b=>b.onclick=()=>craft(b.dataset.craft))}
function craft(id){const r=recipes.find(x=>x.id===id);if(activeTask)return;if(!Object.entries(r.cost).every(([n,q])=>count(n)>=q))return toast("Faltan materiales para esa receta.",true);beginTask("craft",10000,()=>{Object.entries(r.cost).forEach(([n,q])=>take(n,q));addItem(r.out,1,{origin:"fabricación"});xp(8);log(`Fabricación completada: <b>${r.out}</b>.`);$("craftMessage").textContent=`Fabricado: ${r.out}. Ya está en el inventario.`;toast(`Objeto fabricado: <b>${r.out}</b>`);render();save()}, {panel:$("craftProgress"),bar:$("craftBar"),percent:$("craftPercent"),button:null})}
function renderSmelt(){const ores=Object.keys(itemDB).filter(n=>/^Mena de /.test(n)).sort((a,b)=>info(a.replace(/^Mena de /,"Lingote de ")).r-info(b.replace(/^Mena de /,"Lingote de ")).r||a.localeCompare(b,"es"));const pages=Math.max(1,Math.ceil(ores.length/3));smeltPage=Math.min(Math.max(1,smeltPage),pages);const shown=ores.slice((smeltPage-1)*3,smeltPage*3);$('smeltOptions').innerHTML=shown.map(ore=>{const bar=ore.replace(/^Mena de /,"Lingote de ");const qty=2,coal=1;return `<div class="equip-slot"><div><b>${itemIconMarkup(bar,info(bar).icon)} ${escapeHtml(bar)}</b><br><span>Fundir ${qty} ${escapeHtml(ore)} + ${coal} carbón → 1 lingote</span><br><small class="muted">Mena disponible: ${count(ore)} / Carbón: ${count("Carbón")}</small></div><button class="tiny" data-smelt="${escapeHtml(ore)}" ${count(ore)>=qty&&count("Carbón")>=coal&&!activeTask?"":"disabled"}>Fundir · 10 s</button></div>`}).join('');$('smeltPageInfo').textContent=`Página ${smeltPage} / ${pages}`;$('smeltPrev').disabled=smeltPage<=1;$('smeltNext').disabled=smeltPage>=pages;document.querySelectorAll('[data-smelt]').forEach(b=>b.onclick=()=>smelt(b.dataset.smelt))}
function smelt(ore){const bar=ore.replace(/^Mena de /,"Lingote de "),n=2;if(!itemDB[bar])return toast("Esta mena aún no tiene un proceso de refinado registrado.",true);if(activeTask||count(ore)<n||count("Carbón")<1)return toast("No hay suficiente mena o carbón.",true);beginTask("smelt",10000,()=>{take(ore,n);take("Carbón",1);addItem(bar,1,{origin:"fundición"});xp(6);log(`Horno industrial: ${ore} fundida y convertida en ${bar}.`);$('smeltMessage').textContent=`Proceso terminado: ${n} ${ore} + 1 carbón → ${bar}.`;toast(`Horno: <b>${bar}</b>`);render();save()}, {panel:$('smeltProgress'),bar:$('smeltBar'),percent:$('smeltPercent'),button:null})}
function renderBonus(){$("bonusPanel").innerHTML=`<div class="statline"><span>Bonificación de recolección equipada</span><b class="cyan">+${stat("gather")}%</b></div><div class="statline"><span>Probabilidad de botín adicional</span><b class="cyan">${Math.min(82,Math.max(0,stat("gather")+stat("loot")))}%</b></div><div class="statline"><span>Experiencia adicional</span><b class="cyan">+${stat("experience")}%</b></div><div class="statline"><span>Daño total de combate</span><b>${damage()}</b></div><div class="statline"><span>Defensa total</span><b>${defense()}</b></div><p class="small-note">Las herramientas aumentan los hallazgos. Las armas elevan el daño durante los encuentros. Las piezas fusionadas pueden tener efectos inesperados.</p>`}
function makeProceduralLoot(packId){
 const families=[
  {cat:"Material",heads:["Polvo","Núcleo","Lámina","Compuesto","Fragmento","Malla"],tails:["de basalto","de fase","de esporas","de neón","de cuarzo","de titanio"],icons:["💠","🧪","⚙️"]},
  {cat:"Herramienta",heads:["Pico","Sonda","Cortador","Extractor","Taladro","Recolector"],tails:["resonante","de campo","de fase","adaptativo","de titanio","compacto"],icons:["⛏️","🛠️","🔦"]},
  {cat:"Arma",heads:["Filo","Lanza","Disruptor","Maza","Cañón","Sable"],tails:["de neón","de fase","resonante","de obsidiana","compacto","de plasma"],icons:["⚔️","🔫","🗡️"]},
  {cat:"Equipo",heads:["Blindaje","Visor","Peto","Escudo","Traje","Manto"],tails:["reactivo","de titanio","de fase","aislante","de esporas","de neón"],icons:["🛡️","🪖","🧥"]},
  {cat:"Consumible",heads:["Inyector","Catalizador","Baliza","Carga","Antídoto","Estimulante"],tails:["de campo","reforzado","anómalo","compacto","industrial","de fase"],icons:["🧪","🔋","📡"]},
  {cat:"Anomalía",heads:["Eco","Umbral","Vórtice","Nexo","Latido","Paradoja"],tails:["errante","resonante","fracturado","parasitario","silente","inverso"],icons:["🧬","🔮","⚡"]}
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
function renderSupplies(){const cards=supplyPacks.map(p=>`<div class="supply-card"><div class="zone-art" style="height:95px">${itemIconMarkup(p.name,p.icon)}</div><h4>${p.name}</h4><div class="gold" style="font-weight:900">◈ ${p.price} créditos</div><p>${p.desc}</p><button class="primary" data-pack="${p.id}" ${state.credits>=p.price&&!state.pendingSupply&&!activeTask?"":"disabled"}>Solicitar suministro</button></div>`).join('');if($('suppliesGridCentral'))$('suppliesGridCentral').innerHTML=cards;document.querySelectorAll('[data-pack]').forEach(b=>b.onclick=()=>buyPack(b.dataset.pack))}
function buyPack(id){const p=supplyPacks.find(p=>p.id===id);if(activeTask||state.pendingSupply)return toast("Termina o reclama el suministro pendiente antes de pedir otro.",true);if(state.credits<p.price)return toast("Créditos insuficientes.",true);state.credits-=p.price;let pool;if(id==="field")pool=["Madera","Chatarra","Carbón","Mena de hierro","Mena de cobre","Cuchillo oxidado","Hacha de ramas","Batería vieja"];else if(id==="black")pool=["Pico de hierro","Hacha de hierro","Espada de cobre","Armadura de chatarra","Placa electrónica","Mena de oro","Zombie de bolsillo","Aleación extraña","Cañón de bolsillo"];else pool=["Espada de rayos","Pico de cristal","Hacha solar","Escudo de vacío","Núcleo energético","Gólem de carbón","Humano enlatado","Zombie jardinero","Traje de esporas","Tostadora mutante"];let n=id==="field"?2:id==="black"?3:4;let found=[];for(let i=0;i<n;i++){if(Math.random()<(id==="field"?.22:id==="black"?.38:.58)){found.push(makeProceduralLoot(id));continue;}let name=pool[Math.floor(Math.random()*pool.length)];if(id==="anomaly"&&Math.random()<.28){const heads=["Cuchilla","Núcleo","Martillo","Guante","Orbe","Pico","Motor","Escudo"];const tails=["de neón","paradójico","cuántico","del vacío","parasitario","solar","inestable","ancestral"];name=heads[Math.floor(Math.random()*heads.length)]+" "+tails[Math.floor(Math.random()*tails.length)]+" "+uid().slice(0,2).toUpperCase();const rr=3+Math.floor(Math.random()*3);const anomaly={name,icon:["🧬","⚡","🛡️","🔮","🪓"][Math.floor(Math.random()*5)],cat:"Anomalía",r:rr,val:rr*24,desc:`Hallazgo anómalo de la cápsula. Firma ${uid().toUpperCase()}.`,passive:[{type:"Daño",value:`+${rr*2} daño pasivo`},{type:"Defensa",value:`+${rr*2} defensa pasiva`},{type:"Suerte",value:`+${rr*3}% de hallazgos`},{type:"Créditos",value:`+${rr*2}% de créditos`},{type:"Recolección",value:`+${rr*4}% de recolección`},{type:"Captura",value:`+${rr*2}% de captura`}][Math.floor(Math.random()*6)],unique:true,procedural:true};itemDB[name]=anomaly;found.push(anomaly);}else found.push({name,...info(name)});}state.pendingSupply={pack:p.name,items:found,stage:"animating",startedAt:Date.now()};log(`Solicitud enviada: <b>${p.name}</b>. La Central está materializando una carga de procedencia incierta.`);render();save();sound(250,.12,"sine");setTimeout(()=>sound(390,.1,"triangle"),500);setTimeout(()=>{if(!state.pendingSupply)return;state.pendingSupply.stage="ready";renderSupplyDelivery();renderSupplies();save();sound(740,.16,"triangle");},3500)}
function renderSupplyDelivery(){const pending=state.pendingSupply,modal=$("supplyHud");if(!modal)return;modal.classList.toggle("hidden",!pending);if(!pending)return;const animating=pending.stage==="animating";$("supplyHudStatus").textContent=animating?"TRANSMISIÓN EN CURSO":"CARGA VERIFICADA";$("supplyHudScan").classList.toggle("hidden",!animating);$("supplyHudManifest").classList.toggle("hidden",animating);if(animating){$("supplyHudTitle").textContent="MATERIALIZANDO SUMINISTRO";$("supplyHudScanLabel").textContent="VERIFICANDO FIRMA · CARGA EN TRÁNSITO";$("supplyHudScanText").textContent=`La Central está preparando ${pending.items.length} objetos. Mantén abierto el canal hasta completar la transmisión.`;const meter=$("supplyHudMeter");meter.style.transition="none";meter.style.width="0%";requestAnimationFrame(()=>requestAnimationFrame(()=>{meter.style.transition="width 3.4s linear";meter.style.width="100%"}));}else{$("supplyHudTitle").textContent="SUMINISTRO MATERIALIZADO";$("supplyHudManifestText").textContent=`Paquete: ${pending.pack}. Se han recibido ${pending.items.length} objetos. Revísalos y pulsa Reclamar para añadirlos al inventario.`;$("supplyHudItems").innerHTML=pending.items.map((x,i)=>`<div class="supply-hud-reward" style="animation-delay:${Math.min(i*55,350)}ms"><span class="supply-hud-reward-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><span class="supply-hud-reward-info"><b>${escapeHtml(x.name)}</b><small>N${x.r||info(x.name).r} · ${escapeHtml(x.cat||info(x.name).cat)}</small></span></div>`).join("");$("claimSupply").disabled=false;}}
function claimSupply(){const pending=state.pendingSupply;if(!pending||pending.stage!=='ready')return;pending.items.forEach(x=>addItem(x.name,1,{origin:"suministro",icon:x.icon,cat:x.cat,r:x.r,val:x.val,desc:x.desc,damage:x.damage,defense:x.defense,gather:x.gather,slot:x.slot,unique:x.unique,passive:x.passive,procedural:x.procedural,ability:x.ability,abilities:x.abilities,affix:x.affix,companion:x.companion}));const names=pending.items.map(x=>x.name);state.pendingSupply=null;log(`Suministro reclamado: <b>${names.join(', ')}</b>.`);toast(`Añadido al inventario: <b>${names.join(', ')}</b>`);render();save()}

function centralSaleBaseValue(x){return Math.max(1,Number(x.val)||Number(info(x.name).val)||1)}
function centralSaleUnitPrice(x){return Math.max(1,Math.ceil(centralSaleBaseValue(x)*.9*(1+stat("credits")/100)));}
function renderCentralSales(){
 const box=$("centralSaleList");if(!box)return;
 const search=($("centralSaleSearch")?.value||"").trim().toLowerCase();
 const equipped=new Set(Object.values(state.equipped||{}).filter(Boolean));
 const sellable=state.inventory.filter(x=>x.qty>0&&!equipped.has(x.id));
 const matchesCategory=x=>centralSaleFilter==="Todos"||(centralSaleFilter==="Síntesis"?isSynthesisItem(x):centralSaleFilter==="Lingote"?(x.cat==="Lingote"||x.name.startsWith("Lingote de ")):centralSaleFilter==="Otro"?!( ["Material","Lingote","Herramienta","Arma","Equipo","Consumible","Criatura","Anomalía"].includes(x.cat)):x.cat===centralSaleFilter);
 const items=sellable.filter(x=>x.name.toLowerCase().includes(search)&&matchesCategory(x));
 const liveIds=new Set(sellable.map(x=>x.id));
 Object.keys(centralSaleSelection).forEach(id=>{const item=sellable.find(x=>x.id===id);if(!liveIds.has(id))delete centralSaleSelection[id];else centralSaleSelection[id]=Math.min(item.qty,Math.max(0,Number(centralSaleSelection[id])||0));if(!centralSaleSelection[id])delete centralSaleSelection[id];});
 box.innerHTML=items.length?items.map(x=>{const qty=Number(centralSaleSelection[x.id]||0),checked=qty>0;return `<div class="central-sale-row"><input type="checkbox" data-sale-check="${x.id}" aria-label="Seleccionar ${escapeHtml(x.name)}" ${checked?"checked":""}><span class="item-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</span><div><div class="sale-name">${escapeHtml(x.name)}</div><small>N${x.r||1} · ${escapeHtml(x.cat||info(x.name).cat)} · Base 100%: ${centralSaleBaseValue(x).toLocaleString("es-ES")} cr. · Venta 90%: ${Math.max(1,Math.ceil(centralSaleBaseValue(x)*.9)).toLocaleString("es-ES")} cr. · Pago final/unidad: ${centralSaleUnitPrice(x).toLocaleString("es-ES")} cr.</small></div><select class="sale-qty" data-sale-qty="${x.id}" aria-label="Cantidad de ${escapeHtml(x.name)}" ${checked?"":"disabled"}>${Array.from({length:x.qty},(_,i)=>`<option value="${i+1}" ${(qty||1)===i+1?"selected":""}>×${i+1}</option>`).join("")}</select></div>`}).join(""):'<div class="empty">No hay objetos en este filtro. Cambia la categoría o consigue nuevos objetos.</div>';
 const units=Object.values(centralSaleSelection).reduce((a,b)=>a+b,0);
 const total=sellable.reduce((sum,x)=>sum+(Number(centralSaleSelection[x.id]||0)*centralSaleUnitPrice(x)),0);
 $("centralSaleUnits").textContent=units;$("centralSaleTotal").textContent=`${total.toLocaleString("es-ES")} créditos`;$("centralSaleSubmit").disabled=units===0||!!activeTask;
 box.querySelectorAll("[data-sale-check]").forEach(el=>el.onchange=()=>{const x=state.inventory.find(i=>i.id===el.dataset.saleCheck);if(!x)return;if(el.checked)centralSaleSelection[x.id]=Math.max(1,Math.min(x.qty,Number(centralSaleSelection[x.id])||1));else delete centralSaleSelection[x.id];renderCentralSales()});
 box.querySelectorAll("[data-sale-qty]").forEach(el=>el.onchange=()=>{const x=state.inventory.find(i=>i.id===el.dataset.saleQty);if(!x)return;centralSaleSelection[x.id]=Math.max(1,Math.min(x.qty,Number(el.value)||1));renderCentralSales()});
}

function sellCentralSelection(){if(activeTask)return;const selected=Object.entries(centralSaleSelection).map(([id,qty])=>({x:state.inventory.find(i=>i.id===id),qty:Number(qty)})).filter(o=>o.x&&o.qty>0);if(!selected.length)return toast("Selecciona al menos un objeto para vender.",true);if(selected.some(({x,qty})=>Object.values(state.equipped||{}).includes(x.id)||qty>x.qty))return toast("La selección ha cambiado. Revísala antes de vender.",true);const total=selected.reduce((sum,{x,qty})=>sum+centralSaleUnitPrice(x)*qty,0),units=selected.reduce((sum,o)=>sum+o.qty,0);selected.forEach(({x,qty})=>takeById(x.id,qty));state.credits+=total;soundSale();centralSaleSelection={};log(`Envío de suministro vendido: ${units} unidad(es) en ${selected.length} tipo(s) de objeto por <b>${total.toLocaleString("es-ES")} créditos</b>.`);toast(`Venta completada: +${total.toLocaleString("es-ES")} créditos`);render();save();}
function renderInventory(){const search=$("inventorySearch").value.toLowerCase(),sort=inventorySort;let list=state.inventory.filter(x=>(inventoryFilter==="Todos"||(inventoryFilter==="Síntesis"?isSynthesisItem(x):x.cat===inventoryFilter))&&x.name.toLowerCase().includes(search));list.sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="value"?b.val-a.val:b.r-a.r);const pages=Math.max(1,Math.ceil(list.length/12));inventoryPage=Math.min(inventoryPage,pages);const shown=list.slice((inventoryPage-1)*12,inventoryPage*12);$("inventoryCountTag").textContent=`${list.reduce((s,x)=>s+x.qty,0)} OBJETOS`;$("inventoryGrid").innerHTML=shown.length?shown.map(x=>itemCard(x,{compact:true})).join(""):'<div class="empty" style="grid-column:1/-1">No se encontraron objetos en esta categoría.</div>';$("pageInfo").textContent=`Página ${inventoryPage} / ${pages}`; $("prevPage").disabled=inventoryPage<=1;$("nextPage").disabled=inventoryPage>=pages}
function optionsForSlot(slot){return state.inventory.filter(x=>slot==="anomaly"?x.cat==="Anomalía":info(x.name).slot===slot||x.slot===slot)}
function renderEquipment(){const map=[['pick','pickSlot','chooseEquipPick','unequipPick'],['axe','axeSlot','chooseEquipAxe','unequipAxe'],['weapon','weaponSlot','chooseEquipWeapon','unequipWeapon'],['armor','armorSlot','chooseEquipArmor','unequipArmor'],['anomaly','anomalySlot','chooseEquipAnomaly','unequipAnomaly'],['companion','companionSlot','chooseEquipCompanion','unequipCompanion']];map.forEach(([slot,label,button,unequipButton])=>{const x=state.inventory.find(x=>x.id===state.equipped[slot]);$(label).textContent=x?inventoryDisplayName(x):"Sin equipar";$(button).onclick=()=>openPicker("equip",slot);const ub=$(unequipButton);ub.classList.toggle('hidden',!x);ub.onclick=()=>{if(!state.equipped[slot])return;const old=state.inventory.find(i=>i.id===state.equipped[slot]);delete state.equipped[slot];log(`Objeto desequipado: ${inventoryDisplayName(old||{})}.`);renderEquipment();renderStats();renderBonus();save();sound(320)}});const eq=Object.values(state.equipped).map(id=>state.inventory.find(x=>x.id===id)).filter(Boolean);$("equippedCards").innerHTML=eq.length?eq.map(x=>itemCard(x)).join(""):'<div class="empty" style="grid-column:1/-1">Todavía no tienes equipo equipado. Fabrica o encuentra herramientas y armas.</div>'}
function renderPendingFusion(){const p=state.pendingFusion;if(!p){$('fusionResult').innerHTML='';$('fuseBtn').textContent='⟁ INICIAR FUSIÓN';return}const out=p.out;$('fusionResult').innerHTML=`<div class="result-box fusion-ready"><div class="eyebrow">RESULTADO · RECLAMACIÓN PENDIENTE</div><div style="display:flex;gap:14px;align-items:center;margin:12px 0"><div class="fusion-output-icon">${itemIconMarkup(out.name,out.icon)}</div><div><h3 style="margin:0 0 6px">${escapeHtml(inventoryDisplayName(out))}</h3><div class="rarity r${out.r}">NIVEL ${out.r} · ${rarityNames[out.r]}</div><p class="small-note">${escapeHtml(out.desc)}</p></div></div><div class="loot-chips"><span class="chip">${escapeHtml(out.cat)}</span><span class="chip">Valor: ${out.val} cr.</span><span class="chip">Síntesis de convergencia</span></div><button class="primary" id="claimFusion" style="width:100%;margin-top:14px">✓ RECLAMAR OBJETO Y REINICIAR MÁQUINA</button></div>`;$('claimFusion').onclick=claimFusion;$('fuseBtn').disabled=true;$('fuseBtn').textContent='RECLAMA EL RESULTADO';$('chooseFusionA').disabled=true;$('chooseFusionB').disabled=true}
function renderFusionHistory(){$("fusionHistory").innerHTML=state.history.length?state.history.map(h=>`<div class="activity">${itemIconMarkup(h.out,info(h.out).icon)} ${escapeHtml(inventoryDisplayName({name:h.a}))} + ${escapeHtml(inventoryDisplayName({name:h.b}))} → <b>${escapeHtml(inventoryDisplayName({name:h.out}))}</b> <span class="rarity r${h.r}">N${h.r}</span></div>`).join(""):'<div class="empty">Todavía no has fusionado nada.</div>';}
function obtainedHow(name){const sources=[];zones.forEach(z=>{if(z.loot.includes(name))sources.push("Exploración: "+z.name)});recipes.filter(r=>r.out===name).forEach(()=>sources.push("Mesa de creación: receta disponible"));if(/Lingote de /.test(name))sources.push("Horno industrial: funde la mena correspondiente con carbón");const d=knownInfo(name);if(d.cat==="Criatura")sources.push("Combate: derrota hostiles y consigue estabilizar una criatura tras el encuentro");if(d.cat==="Anomalía"||d.procedural||state.history.some(h=>h.out===name))sources.push("Fusión o recuperación procedural: resultado generado por procesos anómalos");if(!sources.length)sources.push("Exploración, fabricación o suministro; algunos ejemplares solo aparecen mediante procesos procedurales");return [...new Set(sources)]}
function renderRegistry(){
const search=$("registrySearch").value.trim().toLowerCase(),sort=registrySort;
if(registryFilter==="Síntesis")registryFilter="Todos";
let list=[...new Set(state.seen||[])].map(name=>({name,...knownInfo(name)}));
// Separar por modo: Base = sin rasgo de síntesis; Síntesis = solo con rasgo
list=list.filter(x=>registryMode==="synthesis"?isSynthesisItem(x):!isSynthesisItem(x));
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
function openRegistryItem(name,level=null){const base=knownInfo(name),variants=Array.isArray(state.synthesisVariants?.[name])?state.synthesisVariants[name]:[];const selectedLevel=level==null?(variants.length?Math.max(...variants.map(v=>Number(v.r)||1)):Number(base.r)||1):Number(level);const d=variants.find(v=>Number(v.r)===selectedLevel)||base;const how=obtainedHow(name);$('registryModalTitle').textContent="REGISTRO · "+inventoryDisplayName({name});const highestLevel=variants.length?Math.max(...variants.map(q=>Number(q.r)||1)):selectedLevel;const variantHtml=isSynthesisItem(base)&&variants.length?`<div class="section-title" style="margin-top:14px"><h3>NIVELES DESCUBIERTOS</h3><span class="small-note">${variants.length} desbloqueado${variants.length===1?"":"s"}</span></div><div class="sort-menu synthesis-level-select"><button type="button" class="sort-trigger" id="synthesisLevelTrigger" aria-haspopup="listbox" aria-expanded="false"><span>Consultar versión: <span class="sort-current">N${selectedLevel}${selectedLevel===highestLevel?" · Mejorado":""}</span></span><span aria-hidden="true">⌄</span></button><div class="sort-options hidden" id="synthesisLevelOptions" role="listbox" aria-label="Niveles de síntesis descubiertos">${variants.map(v=>`<button type="button" data-synthesis-level="${Number(v.r)}" aria-selected="${Number(v.r)===selectedLevel}">N${Number(v.r)}${Number(v.r)===highestLevel?" · Mejorado":""}</button>`).join("")}</div></div><p class="small-note">Solo aparecen niveles que ya has descubierto. Cada nivel conserva sus habilidades procedurales y su rango de valores observado. El Valor Base de cada ejemplar se mantiene en el inventario y determina su precio. Cambiar aquí solo consulta la variante, no modifica tu inventario ni el equipo.</p>`:"";$('registryModalBody').innerHTML=`<div class="registry-details"><div class="registry-big-icon">${itemIconMarkup(name,d.icon||info(name).icon)}</div><div><div class="rarity r${d.r}">NIVEL ${d.r} · ${rarityNames[d.r]}</div><p><b title="${escapeHtml(name)}">${escapeHtml(inventoryDisplayName({name}))}</b><br>${escapeHtml(d.desc||"Sin descripción disponible.")}</p><div class="loot-chips"><span class="chip">${escapeHtml(d.cat||"Otro")}</span>${isSynthesisItem(d)?`<span class="chip">Valor Aprox.: ${getObservedRange({...d,name,r:d.r}).min}CR – ${getObservedRange({...d,name,r:d.r}).max}CR</span>`:`<span class="chip">Valor Base: ${Math.max(1,Number(d.baseVal)||Number(d.val)||Number(info(name).val)||1)}</span>`}${isSynthesisItem(base)?`<span class="chip">Rasgo: Síntesis de convergencia</span>`:d.affix?`<span class="chip">Rasgo: ${escapeHtml(d.affix)}</span>`:""}${(d.abilities||[]).map(a=>`<span class="chip">${escapeHtml(a.name)}: ${escapeHtml(a.desc)}</span>`).join("")}${d.ability&&!d.abilities?.some(a=>a.name===d.ability.name)?`<span class="chip">${escapeHtml(d.ability.name)}: ${escapeHtml(d.ability.desc||"")}</span>`:""}${d.damage?`<span class="chip">Daño: +${d.damage}</span>`:""}${d.defense?`<span class="chip">Defensa: +${d.defense}</span>`:""}${d.gather?`<span class="chip">Recolección: +${d.gather}%</span>`:""}${d.passive?`<span class="chip">Pasiva: ${escapeHtml(d.passive.value||d.passive.type||"")}</span>`:""}${d.secondaryTrait?`<span class="chip">Rasgo adicional: ${escapeHtml(d.secondaryTrait)}</span>`:""}</div></div></div>${variantHtml}<div class="section-title"><h3>¿CÓMO SE OBTIENE?</h3></div>${how.map(x=>`<div class="activity">⌖ ${escapeHtml(x)}</div>`).join("")}`;const levelTrigger=$("synthesisLevelTrigger"),levelOptions=$("synthesisLevelOptions");if(levelTrigger&&levelOptions){levelTrigger.onclick=()=>{const opening=levelOptions.classList.contains("hidden");closeSortMenus(opening?levelOptions.id:null);levelOptions.classList.toggle("hidden",!opening);levelTrigger.setAttribute("aria-expanded",String(opening))};levelOptions.querySelectorAll("[data-synthesis-level]").forEach(b=>b.onclick=()=>{const chosen=Number(b.dataset.synthesisLevel);closeSortMenus();openRegistryItem(name,chosen)})}$('registryModal').classList.remove('hidden')}

function openInventoryItem(id){const x=state.inventory.find(i=>i.id===id);if(!x)return;const d={...info(x.name),...x};const skills=Array.isArray(d.abilities)?d.abilities:(d.ability?[d.ability]:[]);const chips=[`<span class="chip">Tipo: ${escapeHtml(d.cat||"Otro")}</span>`,`<span class="chip">Nivel ${Number(d.r)||1} · ${escapeHtml(rarityNames[Number(d.r)||1]||"Común")}</span>`,`<span class="chip">Valor base (100%): ${Number(d.val||info(d.name).val||1)} cr.</span>`];if(isSynthesisItem(d))chips.push(`<span class="chip">Rasgo de fusión: Síntesis de convergencia</span>`);else if(d.affix)chips.push(`<span class="chip">Rasgo: ${escapeHtml(d.affix)}</span>`);if(d.secondaryTrait)chips.push(`<span class="chip">Rasgo adicional: ${escapeHtml(d.secondaryTrait)}</span>`);if(d.passive)chips.push(`<span class="chip">Pasiva: ${escapeHtml(d.passive.value||d.passive.type||"")}</span>`);skills.forEach(a=>chips.push(`<span class="chip">Habilidad: ${escapeHtml(a.name)}${a.desc?" · "+escapeHtml(a.desc):""}</span>`));if(d.damage)chips.push(`<span class="chip">Daño: +${d.damage}</span>`);if(d.defense)chips.push(`<span class="chip">Defensa: +${d.defense}</span>`);if(d.gather)chips.push(`<span class="chip">Recolección: +${d.gather}%</span>`);if(d.health)chips.push(`<span class="chip">Salud: +${d.health}</span>`);if(d.speed)chips.push(`<span class="chip">Velocidad: +${d.speed}</span>`);if(d.crit)chips.push(`<span class="chip">Crítico: +${d.crit}</span>`);const slot=Object.entries(state.equipped||{}).find(([,eid])=>eid===x.id)?.[0];$("inventoryDetailTitle").textContent=inventoryDisplayName(x);$("inventoryDetailBody").innerHTML=`<div class="inventory-detail-head"><div class="registry-big-icon">${itemIconMarkup(x.name,x.icon||info(x.name).icon)}</div><div><div class="rarity r${Number(d.r)||1}">NIVEL ${Number(d.r)||1} · ${escapeHtml(rarityNames[Number(d.r)||1]||"COMÚN")}</div><h3 class="inventory-detail-name">${escapeHtml(inventoryDisplayName(x))}</h3><div class="small-note">Cantidad: ×${x.qty}${slot?` · Equipado en: ${escapeHtml(slot)}`:""}</div></div></div><p class="inventory-detail-description">${escapeHtml(d.desc||"Sin descripción disponible.")}</p><div class="loot-chips inventory-detail-chips">${chips.join("")}</div><div class="section-title"><h3>INFORMACIÓN DEL OBJETO</h3></div><div class="inventory-detail-stats">${[["Tipo de objeto",objectTypeLabel(d)],["Valor",`${Number(d.val||info(d.name).val||1)} cr.`],["Rareza",rarityNames[Number(d.r)||1]||"Común"],["Nivel",`N${Number(d.r)||1}`],...(d.origin?[["Origen",d.origin]]:[]),...(d.fusionDepth?[["Generación de fusión",d.fusionDepth]]:[])].map(([k,v])=>`<div class="statline"><span>${escapeHtml(k)}</span><b>${escapeHtml(String(v))}</b></div>`).join("")}</div>`;$("inventoryDetailModal").classList.remove("hidden")}

function applyLayoutMode(mode){const valid=["auto","mobile","pc16"].includes(mode)?mode:"auto";state.settings.layoutMode=valid;document.body.classList.toggle("layout-mobile",valid==="mobile");document.body.classList.toggle("layout-pc16",valid==="pc16");document.body.classList.toggle("layout-auto",valid==="auto");const select=$("layoutModeSelect");if(select&&select.value!==valid)select.value=valid;}
function render(){renderPendingFusion();renderSupplyDelivery();renderStats();renderZoneCards();renderZoneDetail();renderZoneLoot();renderFusionSelects();renderRecipes();renderSmelt();renderBonus();renderSupplies();renderCentralSales();renderInventory();renderEquipment();renderFusionHistory();renderRegistry();save()}
$("fuseBtn").addEventListener("click",doFuse);if($("claimSupply"))$("claimSupply").addEventListener("click",claimSupply);$("chooseFusionA").onclick=()=>openPicker("fusion","A");$("chooseFusionB").onclick=()=>openPicker("fusion","B");$("fightBtn").addEventListener("click",fight);$("closePicker").onclick=()=>$("inventoryPicker").classList.add("hidden");$("inventoryPicker").addEventListener("click",e=>{if(e.target===$("inventoryPicker"))$("inventoryPicker").classList.add("hidden")});$("pickerSearch").addEventListener("input",()=>{pickerPage=1;renderPicker()});$("pickerFilterTrigger").onclick=()=>{$("pickerFilterOptions").classList.toggle("hidden");$("pickerFilterTrigger").setAttribute("aria-expanded",!$("pickerFilterOptions").classList.contains("hidden"))};document.querySelectorAll("[data-picker-filter]").forEach(b=>b.onclick=()=>{pickerFilter=b.dataset.pickerFilter;$("pickerFilterLabel").textContent=pickerFilter;document.querySelectorAll("[data-picker-filter]").forEach(x=>x.setAttribute("aria-selected",x===b?"true":"false"));$("pickerFilterOptions").classList.add("hidden");pickerPage=1;renderPicker()});$("centralSaleSearch").addEventListener("input",renderCentralSales);$("centralSaleFilterTrigger").onclick=()=>{const menu=$("centralSaleFilterOptions"),opening=menu.classList.contains("hidden");closeSortMenus(opening?menu.id:null);menu.classList.toggle("hidden",!opening);$("centralSaleFilterTrigger").setAttribute("aria-expanded",String(opening))};document.querySelectorAll("[data-sale-filter]").forEach(b=>b.onclick=()=>{centralSaleFilter=b.dataset.saleFilter;$("centralSaleFilterLabel").textContent=centralSaleFilter;document.querySelectorAll("[data-sale-filter]").forEach(x=>x.setAttribute("aria-selected",x===b?"true":"false"));$("centralSaleFilterOptions").classList.add("hidden");$("centralSaleFilterTrigger").setAttribute("aria-expanded","false");renderCentralSales()});$("centralSaleSelectAll").onclick=()=>{const equipped=new Set(Object.values(state.equipped||{}).filter(Boolean)),search=$("centralSaleSearch").value.trim().toLowerCase();state.inventory.filter(x=>x.qty>0&&!equipped.has(x.id)&&x.name.toLowerCase().includes(search)&&(centralSaleFilter==="Todos"||(centralSaleFilter==="Síntesis"?isSynthesisItem(x):centralSaleFilter==="Lingote"?(x.cat==="Lingote"||x.name.startsWith("Lingote de ")):centralSaleFilter==="Otro"?!( ["Material","Lingote","Herramienta","Arma","Equipo","Consumible","Criatura","Anomalía"].includes(x.cat)):x.cat===centralSaleFilter))).forEach(x=>centralSaleSelection[x.id]=x.qty);renderCentralSales()};$("centralSaleClear").onclick=()=>{centralSaleSelection={};renderCentralSales()};$("centralSaleSubmit").onclick=sellCentralSelection;$("pickerPrev").onclick=()=>{pickerPage--;renderPicker()};$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};$("zonesPrev").onclick=()=>{zonePage--;renderZoneCards()};$("zonesNext").onclick=()=>{zonePage++;renderZoneCards()};$("recipesPrev").onclick=()=>{recipePage--;renderRecipes()};$("recipesNext").onclick=()=>{recipePage++;renderRecipes()};$("smeltPrev").onclick=()=>{smeltPage--;renderSmelt()};$("smeltNext").onclick=()=>{smeltPage++;renderSmelt()};document.querySelectorAll("[data-central-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-central-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("#page-central .central-section").forEach(x=>x.classList.toggle("active",x.id==="central-"+b.dataset.centralTab))});$("inventorySearch").addEventListener("input",()=>{inventoryPage=1;renderInventory()});$("inventoryGrid").addEventListener("click",e=>{const tile=e.target.closest("[data-inventory-detail]");if(tile)openInventoryItem(tile.dataset.inventoryDetail)});$("inventoryGrid").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const tile=e.target.closest("[data-inventory-detail]");if(tile){e.preventDefault();openInventoryItem(tile.dataset.inventoryDetail)}}});$("prevPage").onclick=()=>{inventoryPage--;renderInventory()};$("nextPage").onclick=()=>{inventoryPage++;renderInventory()};document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{inventoryFilter=b.dataset.filter;inventoryPage=1;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderInventory()});

$("closeInventoryDetail").onclick=()=>$("inventoryDetailModal").classList.add("hidden");$("inventoryDetailModal").addEventListener("click",e=>{if(e.target===$("inventoryDetailModal"))$("inventoryDetailModal").classList.add("hidden")});$("registrySearch").addEventListener("input",()=>{registryPage=1;renderRegistry()});document.querySelectorAll("[data-registry-filter]").forEach(b=>b.onclick=()=>{registryFilter=b.dataset.registryFilter;registryPage=1;document.querySelectorAll("[data-registry-filter]").forEach(x=>x.classList.toggle("active",x===b));renderRegistry()});document.querySelectorAll("[data-registry-mode]").forEach(b=>b.onclick=()=>{registryMode=b.dataset.registryMode;registryFilter="Todos";registryPage=1;document.querySelectorAll("[data-registry-filter]").forEach(x=>x.classList.toggle("active",x.dataset.registryFilter==="Todos"));renderRegistry()});$("registryPrev").onclick=()=>{registryPage--;renderRegistry()};$("registryNext").onclick=()=>{registryPage++;renderRegistry()};$("closeRegistry").onclick=()=>$("registryModal").classList.add("hidden");$("registryModal").addEventListener("click",e=>{if(e.target===$("registryModal"))$("registryModal").classList.add("hidden")});document.querySelectorAll("[data-recipe-category]").forEach(b=>b.onclick=()=>{recipeCategory=b.dataset.recipeCategory;recipePage=1;document.querySelectorAll("[data-recipe-category]").forEach(x=>x.classList.toggle("active",x===b));renderRecipes()});
$("installApp").onclick=async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();try{await deferredInstallPrompt.userChoice}catch(e){}deferredInstallPrompt=null;$("installApp").classList.add("hidden")}else{toast("Para instalar, publica Anomaly Fusion en HTTPS y usa el menú del navegador: «Instalar aplicación».");}};window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installApp").classList.remove("hidden")});window.addEventListener("appinstalled",()=>{$("installApp").textContent="✓ Instalada";$("installApp").disabled=true});
$("openSettings").onclick=()=>$("settingsModal").classList.remove("hidden");$("closeSettings").onclick=()=>$("settingsModal").classList.add("hidden");$("settingsModal").addEventListener("click",e=>{if(e.target===$("settingsModal"))$("settingsModal").classList.add("hidden")});
$("sortInventoryTrigger").onclick=()=>{const m=$("sortInventoryOptions"),opening=m.classList.contains("hidden");closeSortMenus(opening?m.id:null);m.classList.toggle("hidden",!opening);$("sortInventoryTrigger").setAttribute("aria-expanded",String(opening))};$("registrySortTrigger").onclick=()=>{const m=$("registrySortOptions"),opening=m.classList.contains("hidden");closeSortMenus(opening?m.id:null);m.classList.toggle("hidden",!opening);$("registrySortTrigger").setAttribute("aria-expanded",String(opening))};document.querySelectorAll("[data-sort-target]").forEach(b=>b.onclick=()=>setSortMenu(b.dataset.sortTarget,b.dataset.sortValue));document.addEventListener("click",e=>{if(!e.target.closest(".sort-menu"))closeSortMenus()});
$("confirmCancel").onclick=closeConfirm;$("confirmAccept").onclick=()=>{const action=pendingConfirmAction;closeConfirm();if(action)action()};$("confirmModal").addEventListener("click",e=>{if(e.target===$("confirmModal"))closeConfirm()});document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeConfirm();closeSortMenus();["settingsModal","inventoryPicker","registryModal","inventoryDetailModal"].forEach(id=>$(id)?.classList.add("hidden"))}});
$("soundToggle").onchange=e=>{state.settings.sound=e.target.checked;save();if(e.target.checked)sound(600)};$ ("soundVolume").addEventListener("input",e=>{setSoundVolume(e.target.value)});$ ("soundVolume").addEventListener("change",()=>sound(560,.08,"triangle"));$("scaleSelect").onchange=e=>{state.settings.scale=e.target.value;document.documentElement.style.setProperty("--scale",e.target.value);save()};$("layoutModeSelect").onchange=e=>{applyLayoutMode(e.target.value);save();sound(560)};$("motionToggle").onchange=e=>{state.settings.motion=e.target.checked;document.body.classList.toggle("reduce-motion",e.target.checked);save()};$("fullscreenToggle").onclick=async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();$("fullscreenToggle").textContent="Desactivar"}else{await document.exitFullscreen();$("fullscreenToggle").textContent="Activar"}}catch(e){toast("La pantalla completa no está disponible en este navegador.",true)}};document.addEventListener("fullscreenchange",()=>$("fullscreenToggle").textContent=document.fullscreenElement?"Desactivar":"Activar");
$("exportSave").onclick=exportSave;
$("importSave").onclick=()=>$("importSaveFile").click();
$("importSaveFile").addEventListener("change",async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;try{if(file.size>10*1024*1024)throw new Error("El archivo supera el límite de 10 MB.");const parsed=JSON.parse(await file.text());const raw=parsed&&parsed.save?parsed.save:parsed;const imported=normalizeImportedState(raw);showConfirm("IMPORTAR PARTIDA","Sustituirá el progreso actual de este dispositivo por los datos del archivo seleccionado. Esta acción no se puede deshacer.","Importar",()=>{state=imported;localStorage.removeItem("joyaCeroSave");save();$("settingsModal").classList.add("hidden");render();$("soundToggle").checked=state.settings.sound;$("scaleSelect").value=state.settings.scale;document.documentElement.style.setProperty("--scale",state.settings.scale);$("motionToggle").checked=state.settings.motion;document.body.classList.toggle("reduce-motion",state.settings.motion);applyLayoutMode(state.settings.layoutMode);toast("Partida importada correctamente.")});}catch(err){toast(err.message||"No se pudo importar el archivo.",true)}finally{e.target.value=""}});
$("resetGame").onclick=()=>showConfirm("REINICIAR PARTIDA","Se borrará el progreso local y se limpiará la caché de Anomaly Fusion. No se puede deshacer. Se recargará la aplicación al terminar.","Reiniciar",async()=>{localStorage.removeItem("joyaCeroSave");localStorage.removeItem("anomalyFusionSave");state=stateDefault();state.activity=[];save();await clearAppCache();location.reload()},true);
// Sonido corto de interfaz para botones, incluidos controles creados dinámicamente.
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||b.disabled||b.id==="soundToggle")return;if(b.id==="exploreBtn"||b.id==="zoneBackBtn")return;sound(380,.025,"sine")},true);
async function checkForAppUpdates(registration){try{await registration.update();if(registration.waiting&&navigator.serviceWorker.controller)registration.waiting.postMessage({type:"SKIP_WAITING"})}catch(e){}}
let recipeResizeTimer=null;window.addEventListener("resize",()=>{clearTimeout(recipeResizeTimer);recipeResizeTimer=setTimeout(()=>{recipePage=1;renderRecipes()},120)});
function init(){if(!state.version){state=stateDefault();log("Sistema inicializado. Inventario y créditos a cero.")}if(!state.activity.length&&!state.inventory.length&&state.credits===0)log("Sistema inicializado. Inventario vacío. Explora para conseguir tus primeros recursos.");bindNavigation();$("soundToggle").checked=state.settings.sound;$("scaleSelect").value=state.settings.scale||"1";document.documentElement.style.setProperty("--scale",state.settings.scale||"1");$("motionToggle").checked=!!state.settings.motion;document.body.classList.toggle("reduce-motion",!!state.settings.motion);applyLayoutMode(state.settings.layoutMode||"auto");setSoundVolume(state.settings.soundVolume??75);render();if(state.pendingSupply&&state.pendingSupply.stage==="animating"){setTimeout(()=>{if(state.pendingSupply&&state.pendingSupply.stage==="animating"){state.pendingSupply.stage="ready";renderSupplyDelivery();renderSupplies();save()}},1200)}if("serviceWorker"in navigator&&location.protocol.startsWith("http")){navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(reg=>{checkForAppUpdates(reg);setInterval(()=>checkForAppUpdates(reg),60000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkForAppUpdates(reg)});window.addEventListener("focus",()=>checkForAppUpdates(reg));}).catch(()=>{});}}
init();
})();