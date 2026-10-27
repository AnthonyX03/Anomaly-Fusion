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
 {id:"rift",name:"Grieta dimensional",icon:"🌀",desc:"Un corte en el espacio donde la materia aparece duplicada, invertida o ligeramente equivocada.",risk:3,loot:["Fragmento dimensional","Polvo cuántico","Mena de iridio","Núcleo de fase","Cristal de paradoja"],enemy:0.8}
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
  ["Panel de corteza prensada","🪵","Madera","Resina","Corteza compactada y sellada con resina."],
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
craftableGenerated.forEach((name,i)=>{const d=itemDB[name];recipes.push({id:"gen_"+i,name,icon:d.icon,desc:d.desc,cost:d.cat==="Herramienta"?{"Madera":1,"Chatarra":2}:d.cat==="Arma"?{"Chatarra":3,"Lingote de hierro":1}:d.cat==="Equipo"?{"Lingote de hierro":2,"Cable de cobre":1}:{"Hojas":1,"Carbón":1},out:name,category:d.cat});});

const supplyPacks = [
 {id:"field",name:"Caja de campo",icon:"📦",price:35,desc:"Materiales variados y una pequeña posibilidad de equipo raro.",color:"common"},
 {id:"black",name:"Contenedor negro",icon:"🗃️",price:90,desc:"Mejores probabilidades de objetos de nivel 3 o superior.",color:"rare"},
 {id:"anomaly",name:"Cápsula anómala",icon:"🧬",price:180,desc:"Objetos extraños, criaturas capturadas y tecnología experimental.",color:"legendary"}
];
// Bestiario procedural: 10 linajes x 20 variantes = 200 enemigos base.
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
 {root:"Dron biológico",icon:"🪲",loot:"Batería vieja",baseHp:19,desc:"Máquina orgánica que caza mediante impulsos eléctricos."}
];
const enemyVariants = ["Ceniza","Hundido","Errante","Rojo","Ciego","Roto","Veloz","Blindado","Hambriento","Silente","Radiactivo","Abisal","Óxido","Nocturno","Hueco","Feral","Marchito","Inestable","de la Grieta","de Cenagal"];
const enemyCatalog=[];
enemyFamilies.forEach((family,fi)=>enemyVariants.forEach((variant,vi)=>{
 const name=`${family.root} ${variant}`; const rank=Math.min(5,1+Math.floor(((fi+vi)%10)/2));
 const enemy={name,icon:family.icon,hp:family.baseHp+(vi%5)*3+Math.floor(fi/2)*2,loot:family.loot,family:family.root,rank,desc:family.desc}; enemyCatalog.push(enemy);
 addGenerated(name,{icon:family.icon,cat:"Criatura",r:rank,val:18+rank*13,desc:`${family.desc} Variante ${variant.toLowerCase()}. Puede adquirirse tras un combate y desarrollar una habilidad propia.`});
}));

const stateDefault = () => ({credits:0,level:1,xp:0,expeditions:0,fusions:0,inventory:[],equipped:{pick:null,axe:null,weapon:null,armor:null,anomaly:null,companion:null},history:[],pendingFusion:null,pendingSupply:null,activity:[],seen:[],discovered:{},settings:{sound:true,scale:"1",motion:false,layoutMode:"auto"},version:6});
let state = loadState();
let selectedZone = "forest", zoneHudOpen=false, inventoryFilter="Todos", inventoryPage=1, zonePage=1, recipePage=1, recipeCategory="Todos", smeltPage=1, registryPage=1, registryFilter="Todos", registryPageSize=10, pickerPage=1, pickerMode=null, pickerSlot=null, chosenSellId=null, activeTask=null, currentEnemy=null, audioCtx=null, deferredInstallPrompt=null;
function loadState(){try{const s=JSON.parse(localStorage.getItem("anomalyFusionSave")||localStorage.getItem("joyaCeroSave"));if(s&&(s.version===2||s.version===3||s.version===4||s.version===5||s.version===6)&&s.inventory&&s.equipped)return Object.assign(stateDefault(),s,{version:6,equipped:{...stateDefault().equipped,...s.equipped},history:(s.history||[]).slice(0,3),pendingFusion:s.pendingFusion||null,pendingSupply:s.pendingSupply||null,seen:[...new Set([...(s.seen||[]),...(s.inventory||[]).map(x=>x.name)])],discovered:{...(s.discovered||{}),...Object.fromEntries((s.inventory||[]).map(x=>[x.name,x]))}})}catch(e){}return stateDefault()}
function save(){try{localStorage.setItem("anomalyFusionSave",JSON.stringify(state))}catch(e){toast("No se pudo guardar la partida. Comprueba el espacio disponible del navegador.",true)}}
function normalizeImportedState(raw){
 if(!raw||typeof raw!=="object"||!Array.isArray(raw.inventory)||!raw.equipped||typeof raw.equipped!=="object")throw new Error("El archivo no contiene una partida válida.");
 const base=stateDefault();
 const next={...base,...raw,version:6};
 next.credits=Math.max(0,Number(next.credits)||0);next.level=Math.max(1,Number(next.level)||1);next.xp=Math.max(0,Number(next.xp)||0);
 next.inventory=raw.inventory.filter(x=>x&&typeof x==="object"&&typeof x.name==="string").map(x=>({...x,qty:Math.max(1,Math.floor(Number(x.qty)||1))}));
 next.equipped={...base.equipped,...raw.equipped};next.history=Array.isArray(raw.history)?raw.history.slice(0,3):[];
 next.pendingFusion=raw.pendingFusion&&typeof raw.pendingFusion==="object"?raw.pendingFusion:null;next.pendingSupply=raw.pendingSupply&&typeof raw.pendingSupply==="object"?raw.pendingSupply:null;
 next.activity=Array.isArray(raw.activity)?raw.activity.slice(-100):[];next.seen=[...new Set([...(Array.isArray(raw.seen)?raw.seen.filter(x=>typeof x==="string"):[]),...next.inventory.map(x=>x.name)])];
 next.discovered={...(raw.discovered&&typeof raw.discovered==="object"?raw.discovered:{}),...Object.fromEntries(next.inventory.map(x=>[x.name,x]))};
 next.settings={...base.settings,...(raw.settings&&typeof raw.settings==="object"?raw.settings:{})};
 if(!["0.9","1","1.1"].includes(String(next.settings.scale)))next.settings.scale="1";
 next.settings.sound=next.settings.sound!==false;next.settings.motion=!!next.settings.motion;if(!["auto","mobile","pc16"].includes(next.settings.layoutMode))next.settings.layoutMode="auto";
 return next;
}
function exportSave(){try{const payload={app:"Anomaly Fusion",format:1,exportedAt:new Date().toISOString(),save:state};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`anomaly-fusion-partida-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Copia de seguridad exportada.")}catch(e){toast("No se pudo exportar la partida.",true)}}
async function clearAppCache(){try{if("caches" in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith("anomaly-fusion-")).map(k=>caches.delete(k)))}}catch(e){}try{if("serviceWorker" in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()))}}catch(e){}}
function uid(){return Math.random().toString(36).slice(2,10)}
function info(name){return itemDB[name]||{icon:"❔",cat:"Otro",r:2,val:12,desc:"Objeto no catalogado. Sus propiedades desafían el registro."}}
function knownInfo(name){return {...info(name),...(state.discovered?.[name]||{}),...(state.inventory.find(x=>x.name===name)||{})}}
function addItem(name,qty=1,opts={}){
 const d=info(name),resolved={...opts};const cat=resolved.cat||d.cat,slot=resolved.slot||d.slot,r=Math.max(1,Math.min(5,Number(resolved.r||d.r||1)));
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
  if(r>=4&&Math.random()<.45){const second=choose([{type:"Suerte",name:"Instinto de élite",value:r*2,desc:`+${r*2}% hallazgos`},{type:"Créditos",name:"Recuperación eficiente",value:r*2,desc:`+${r*2}% créditos`}]);resolved.abilities.push(second);}
  resolved.ability=resolved.abilities[0];resolved.procedural=true;
 }
 let existing=state.inventory.find(x=>x.name===name&&d.cat==="Material"&&!resolved.unique);
 if(existing)existing.qty+=qty;
 else state.inventory.push({...resolved,id:uid(),name,qty,cat:cat||d.cat,r:resolved.r||d.r||1,val:resolved.val||d.val||5,desc:resolved.desc||d.desc||"",icon:resolved.icon||d.icon||"❔",slot});
 state.discovered=state.discovered||{};state.discovered[name]={...d,...resolved,name,cat:cat||d.cat,r:resolved.r||d.r||1,val:resolved.val||d.val||5,desc:resolved.desc||d.desc||"",icon:resolved.icon||d.icon||"❔"};
 if(!state.seen.includes(name))state.seen.push(name);
}
function count(name){return state.inventory.filter(x=>x.name===name).reduce((a,x)=>a+x.qty,0)}
function take(name,n=1){let left=n;for(let i=state.inventory.length-1;i>=0&&left>0;i--){let x=state.inventory[i];if(x.name===name){let amt=Math.min(x.qty,left);x.qty-=amt;left-=amt;if(x.qty<=0)state.inventory.splice(i,1)}}return left===0}
function equippedItem(slot){const id=state.equipped[slot];return state.inventory.find(x=>x.id===id)||null}
function stat(key){
 const gear=Object.values(state.equipped).map(id=>state.inventory.find(x=>x.id===id)).filter(Boolean);
 let total=gear.reduce((sum,x)=>sum+(Number(x[key])||Number(info(x.name)[key])||0),0);
 const keyTypes={damage:"Daño",defense:"Defensa",gather:"Recolección",luck:"Suerte",credits:"Créditos",capture:"Captura"};
 gear.forEach(x=>{
  if(x.cat==="Anomalía"&&x.passive&&keyTypes[key]===x.passive.type)total+=parseInt(String(x.passive.value).match(/\d+/)?.[0]||0,10);
  const skills=[...(Array.isArray(x.abilities)?x.abilities:[]),...(x.ability?[x.ability]:[])];
  skills.forEach(skill=>{if(skill&&skill.type===keyTypes[key])total+=Number(skill.value)||0});
 });
 return total;
}
function damage(){return 5+stat("damage")}
function defense(){return stat("defense")}
function xp(n){state.xp+=n;while(state.xp>=state.level*100){state.xp-=state.level*100;state.level++;state.credits+=15;log("¡Nivel "+state.level+" alcanzado! +15 créditos de recompensa.")}}
function log(msg){state.activity.unshift({msg,time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})});state.activity=state.activity.slice(0,8)}
function sound(freq=500,dur=.07,type="sine"){if(!state.settings.sound)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.045,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch(e){}}
function toast(msg,bad=false){const d=document.createElement("div");d.className="toast"+(bad?" bad":"");d.innerHTML=msg; $("toastArea").appendChild(d);sound(bad?180:620,.06,bad?"triangle":"sine");setTimeout(()=>d.remove(),3500)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function itemCard(x,opts={}){const r=x.r||info(x.name).r||1;const skills=Array.isArray(x.abilities)?x.abilities:(x.ability?[x.ability]:[]);const skillHtml=skills.length?`<div class="small-note" style="margin-top:7px;color:var(--cyan)">✦ ${skills.map(a=>escapeHtml(a.name+" · "+a.desc)).join(" / ")}</div>`:x.affix?`<div class="small-note" style="margin-top:7px;color:var(--cyan)">✦ ${escapeHtml(x.affix)}</div>`:"";return `<div class="item-card rarity-${r}"><div class="item-top"><div class="item-icon">${x.icon||info(x.name).icon}</div><div style="min-width:0"><h4>${escapeHtml(x.name)} ${x.qty>1?`<span class="muted">×${x.qty}</span>`:""}</h4><div class="rarity r${r}">NIVEL ${r} · ${rarityNames[r]}</div></div></div><div class="desc">${escapeHtml(x.desc||info(x.name).desc||"Objeto sin descripción.")}</div>${skillHtml}<div class="item-bottom"><span class="muted" style="font-size:.68rem">${escapeHtml(x.cat||info(x.name).cat)} · ${x.val||info(x.name).val} cr.</span>${opts.sell?`<span class="muted" style="font-size:.62rem">Envío de suministro</span>`:""}</div>${opts.equip?`<button class="tiny" style="width:100%;margin-top:8px" data-equip-id="${x.id}">Equipar</button>`:""}</div>`}
function nav(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));window.scrollTo({top:0,behavior:state.settings.motion?"auto":"smooth"});render()}
function bindNavigation(){document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.page)));document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.goto)))}
function renderStats(){$("credits").textContent=state.credits.toLocaleString("es-ES");$("level").textContent=state.level;$("itemCount").textContent=state.inventory.reduce((s,x)=>s+x.qty,0);$("itemMeter").style.width=Math.min(100,state.inventory.length/50*100)+"%";$("expCount").textContent=state.expeditions;$("fusionCount").textContent=state.fusions;$("activityLog").innerHTML=state.activity.length?state.activity.map(a=>`<div class="activity"><span class="muted">[${a.time}]</span> ${a.msg}</div>`).join(""):'<div class="empty">Sin actividad registrada. Tu historia empieza ahora.</div>';$("profileLevel").textContent=state.level;$("xpText").textContent=`${state.xp} / ${state.level*100} XP`;$("xpBar").style.width=(state.xp/(state.level*100)*100)+"%";$("statDamage").textContent=damage();$("statDefense").textContent=defense();$("statGather").textContent=stat("gather")+"%";$("statLuck").textContent=Math.max(0,(state.level-1)*2+stat("luck"))+"%";$("statCredits").textContent=state.credits}
function openZoneHud(zoneId){selectedZone=zoneId;zoneHudOpen=true;renderZoneCards();renderZoneDetail();sound(470,.07,"triangle");window.scrollTo({top:0,behavior:state.settings.motion?"auto":"smooth"})}
function closeZoneHud(){if(activeTask&&activeTask.type==="explore"){toast("La expedición sigue activa. Espera a que termine para salir de la zona.",true);return}zoneHudOpen=false;currentEnemy=null;$("combatPanel").classList.add("hidden");renderZoneCards();sound(340,.06,"sine")}
function renderZoneDetail(){const z=zones.find(x=>x.id===selectedZone)||zones[0];const risk=["BAJO","MODERADO","ALTO","EXTREMO"][z.risk]||"VARIABLE";const host=$("zoneHudDetail");if(!host)return;host.innerHTML=`<div class="eyebrow">DOSSIER DE CAMPO · ${escapeHtml(z.id.toUpperCase())}</div><div style="display:flex;align-items:flex-start;gap:14px;margin:12px 0"><div class="zone-art" style="width:96px;min-width:96px;height:96px;font-size:3rem">${z.icon}</div><div style="flex:1"><h3 style="margin:0 0 8px">${escapeHtml(z.name)}</h3><p class="small-note">${escapeHtml(z.desc)}</p><div class="loot-chips" style="margin-top:9px">${z.loot.map(n=>`<span class="chip">${info(n).icon||"❔"} ${escapeHtml(n)}</span>`).join("")}</div><div class="small-note" style="margin-top:10px">Riesgo: <b>${risk}</b> · Probabilidad de contacto: ${Math.round(z.enemy*100)}% · Duración estimada: 10 s</div></div></div><div class="zone-hud-actions"><button id="zoneBackBtn">← Volver a exploración</button><button class="primary" id="exploreBtn" ${activeTask||currentEnemy?"disabled":""}>⌖ INICIAR EXPEDICIÓN · 10 S</button></div>`;const b=$("exploreBtn");if(b)b.onclick=beginExplore;const back=$("zoneBackBtn");if(back)back.onclick=closeZoneHud;}
function renderZoneCards(){const overview=$("zonesOverview"),hud=$("zoneHud");if(overview)overview.classList.toggle("hidden",zoneHudOpen);if(hud)hud.classList.toggle("hidden",!zoneHudOpen);const start=(zonePage-1)*3,shown=zones.slice(start,start+3);$("zonesGrid").innerHTML=shown.map(z=>`<div class="zone-card ${selectedZone===z.id?"selected":""}" data-zone-card="${z.id}"><div class="zone-art">${z.icon}</div><h4>${escapeHtml(z.name)}</h4><p>${escapeHtml(z.desc)}</p><div class="loot-chips">${z.loot.slice(0,3).map(n=>`<span class="chip">${info(n).icon} ${escapeHtml(n)}</span>`).join("")}</div><div class="small-note">Riesgo: ${["BAJO","MODERADO","ALTO","EXTREMO"][z.risk]}</div><button data-zone="${z.id}" ${activeTask?"disabled":""}>Entrar en zona →</button></div>`).join("");$("zonesPageInfo").textContent=`Página ${zonePage} / ${Math.ceil(zones.length/3)}`;$("zonesPrev").disabled=zonePage<=1;$("zonesNext").disabled=zonePage>=Math.ceil(zones.length/3);document.querySelectorAll("[data-zone]").forEach(b=>b.onclick=e=>{e.stopPropagation();openZoneHud(b.dataset.zone)});document.querySelectorAll("[data-zone-card]").forEach(c=>c.onclick=e=>{if(e.target.closest("button"))return;openZoneHud(c.dataset.zoneCard)});}
function beginTask(type,duration,onDone,els){if(activeTask)return;activeTask={type,start:Date.now(),duration,done:false,lastCue:0};sound(260,.11,"sawtooth");els.panel.classList.remove("hidden");els.bar.style.width="0%";els.percent.textContent="0%";els.status&&(els.status.textContent=type==="explore"?"Explorando...":type==="craft"?"Fabricando...":"Fundiendo...");els.button&&(els.button.disabled=true);const tick=()=>{if(!activeTask||activeTask.type!==type)return;const p=Math.min(1,(Date.now()-activeTask.start)/duration);els.bar.style.width=(p*100)+"%";els.percent.textContent=Math.floor(p*100)+"%";const step=Math.floor(p*5);if(step>activeTask.lastCue&&p<1){activeTask.lastCue=step;sound(760+step*35,.035,"sine")}if(p>=1){activeTask=null;sound(920,.12,"triangle");onDone();return}setTimeout(tick,100)};tick()}
function beginExplore(){if(activeTask||currentEnemy)return;const z=zones.find(z=>z.id===selectedZone);$("combatPanel").classList.add("hidden");$("exploreProgressPanel").classList.remove("hidden");beginTask("explore",10000,()=>{state.expeditions++;let pool=z.loot.slice();let pickBonus=stat("gather")/100; if(Math.random()<Math.min(.45,pickBonus))pool=pool.concat(pool);let found=pool[Math.floor(Math.random()*pool.length)];addItem(found);xp(12+z.risk*4);log(`Exploración completada en <b>${z.name}</b>: ${info(found).icon} ${found}.`);$("exploreStatus").textContent="Exploración completada";$("exploreHint").textContent=`Hallazgo: ${info(found).icon} ${found}`;toast(`Hallazgo recuperado: <b>${found}</b>`);const hostile=Math.random()<z.enemy;render();if(hostile)startEncounter(z);else{$("exploreStatus").textContent="Zona despejada";$("exploreHint").textContent="No se detectaron hostiles. Puedes volver a explorar.";renderZoneCards();renderZoneDetail()}save()}, {panel:$("exploreProgressPanel"),bar:$("exploreBar"),percent:$("explorePercent"),status:$("exploreStatus"),button:$("exploreBtn")});$("exploreHint").textContent="Escaneando señales, buscando materiales y comprobando amenazas...";renderZoneCards();renderZoneDetail()}
function startEncounter(z){
 const pool=enemyCatalog.filter(e=>e.rank<=Math.min(5,2+z.risk+Math.floor(state.level/8)));
 const template=pool[Math.floor(Math.random()*pool.length)]||enemyCatalog[Math.floor(Math.random()*enemyCatalog.length)];
 const rank=Math.max(template.rank,Math.min(5,1+z.risk+Math.floor((state.level-1)/7)+Math.floor(Math.random()*2)));
 const e={...template,rank,hp:Math.round(template.hp+z.risk*8+rank*4+state.level*1.5)};e.max=e.hp;currentEnemy=e;
 $("combatPanel").classList.remove("hidden");$("combatText").textContent=`${e.icon} ${e.name} · NIVEL ${rank} bloquea el camino en ${z.name}. Probabilidad inicial de adquisición: ${captureChance(e)}%. Al vencerlo podrás intentar adquirirlo como compañero.`;
 $("enemyHp").textContent=e.hp+" / "+e.max;$("enemyBar").style.width="100%";$("playerDamage").textContent=damage();$("fightBtn").disabled=false;
 toast(`¡Contacto hostil! <b>${e.name}</b> · N${rank}`,true);renderZoneCards();renderZoneDetail();
}
function rollCompanionAbilities(rank){
 const choices=[{type:"Daño",name:"Instinto depredador",unit:"daño",base:1,gain:2},{type:"Defensa",name:"Piel endurecida",unit:"defensa",base:1,gain:2},{type:"Recolección",name:"Olfato de rastreador",unit:"% de recolección",base:3,gain:5},{type:"Suerte",name:"Presagio favorable",unit:"% de hallazgos",base:2,gain:3},{type:"Créditos",name:"Instinto carroñero",unit:"% de créditos",base:2,gain:3},{type:"Captura",name:"Llamada feromonal",unit:"% de captura",base:1,gain:2}];
 const shuffled=choices.sort(()=>Math.random()-.5),count=rank>=4&&Math.random()<.65?2:1;
 return shuffled.slice(0,count).map(c=>({type:c.type,name:c.name,value:c.base+rank*c.gain+Math.floor(Math.random()*Math.max(1,rank)),desc:`+${c.base+rank*c.gain} ${c.unit}`}));
}
function captureChance(enemy){return Math.min(72,Math.max(8,20+enemy.rank*3+Math.floor(state.level/3)+Math.round(stat("luck")*.35)+stat("capture")))}
function fight(){
 if(!currentEnemy)return;const enemy=currentEnemy;const ally=equippedItem("companion");
 const d=damage()+Math.floor(Math.random()*5)+Math.floor((ally?.r||0)/2);enemy.hp-=d;
 const retaliate=Math.max(0,Math.floor(5+Math.random()*7-(ally?Math.floor((ally.r||1)*.4):0)-defense()));
 $("combatText").textContent=`Golpeas por ${d} de daño. Recibes ${retaliate} de daño simulado. ${enemy.hp>0?"El enemigo sigue en pie.":"Amenaza neutralizada."}`;
 if(enemy.hp<=0){
  addItem(enemy.loot);state.credits+=Math.round((5+Math.floor(Math.random()*8))*(1+stat("credits")/100));xp(18+enemy.rank*3);
  const chance=captureChance(enemy);
  if(Math.random()*100<chance){const abilities=rollCompanionAbilities(enemy.rank);const abilityText=abilities.map(a=>`${a.name} (${a.desc})`).join(" · ");
   addItem(enemy.name,1,{cat:"Criatura",r:enemy.rank,val:info(enemy.name).val||25,icon:enemy.icon,desc:`Compañero de combate de nivel ${enemy.rank}. Sus habilidades varían entre ejemplares.`,abilities,ability:abilities[0],unique:true,companion:true});
   log(`Criatura adquirida: <b>${enemy.name}</b> · N${enemy.rank}. Habilidad: ${abilityText}.`);toast(`¡Adquiriste a ${enemy.name}! ${abilityText}`);
  }else toast(`Amenaza neutralizada. Probabilidad de adquisición: ${chance}%. La criatura no pudo ser estabilizada.`);
  log(`Amenaza neutralizada: <b>${enemy.name}</b>. Botín adicional recuperado.`);currentEnemy=null;$("combatPanel").classList.add("hidden");
 }else{$("enemyHp").textContent=enemy.hp+" / "+enemy.max;$("enemyBar").style.width=(enemy.hp/enemy.max*100)+"%";if(retaliate>0)toast(`Recibes ${retaliate} de daño. La defensa reduce el impacto.`,true)}
 render();save();
}
function renderFusionSelects(){["A","B"].forEach(k=>{const id=state.fusionSlots?.[k];const x=state.inventory.find(x=>x.id===id);const slot=$("slot"+k);slot.classList.toggle("filled",!!x);slot.querySelector(".slot-icon").textContent=x?(x.icon||info(x.name).icon):"＋";$("fusion"+k+"Label").textContent=x?x.name:`Objeto ${k}`;$("chooseFusion"+k).textContent=x?"Cambiar objeto":"Elegir del inventario"});$("fuseBtn").disabled=!!activeTask||!!state.pendingFusion||!state.inventory.some(x=>x.id===state.fusionSlots?.A)||!state.inventory.some(x=>x.id===state.fusionSlots?.B);$("chooseFusionA").disabled=!!state.pendingFusion||!!activeTask;$("chooseFusionB").disabled=!!state.pendingFusion||!!activeTask}
function openPicker(mode,slot=null){pickerMode=mode;pickerSlot=slot;pickerPage=1;$("pickerSearch").value="";$("pickerTitle").textContent=mode==="fusion"?`▤ INVENTARIO · OBJETO ${slot}`:mode==="sell"?"▤ INVENTARIO · VENDER":"▤ INVENTARIO · EQUIPAR";$("pickerDescription").textContent=mode==="fusion"?"Selecciona un objeto propio del juego para la cámara de fusión.":mode==="sell"?"Selecciona el objeto que quieres vender.":"Selecciona una pieza compatible con el espacio de equipo.";$("inventoryPicker").classList.remove("hidden");renderPicker()}
function renderPicker(){let list=state.inventory.filter(x=>x.qty>0&&x.name.toLowerCase().includes($("pickerSearch").value.toLowerCase()));if(pickerMode==="sell")list=list.filter(x=>!Object.values(state.equipped).includes(x.id));if(pickerMode==="equip")list=list.filter(x=>pickerSlot==="anomaly"?x.cat==="Anomalía":pickerSlot==="companion"?x.cat==="Criatura":info(x.name).slot===pickerSlot||x.slot===pickerSlot);const pages=Math.max(1,Math.ceil(list.length/9));pickerPage=Math.min(pickerPage,pages);const shown=list.slice((pickerPage-1)*9,pickerPage*9);$("pickerGrid").innerHTML=shown.length?shown.map(x=>`<button class="picker-item" data-pick-id="${x.id}"><span class="item-icon">${x.icon||info(x.name).icon}</span><span style="min-width:0"><b>${escapeHtml(x.name)}</b><small>N${x.r} · ${escapeHtml(x.cat)} · ×${x.qty}</small></span></button>`).join(""):'<div class="empty" style="grid-column:1/-1">No hay objetos disponibles en esta categoría.</div>';$ ("pickerPageInfo").textContent=`Página ${pickerPage} / ${pages}`;$("pickerPrev").disabled=pickerPage<=1;$("pickerNext").disabled=pickerPage>=pages;document.querySelectorAll("[data-pick-id]").forEach(b=>b.onclick=()=>{const x=state.inventory.find(i=>i.id===b.dataset.pickId);if(!x)return;if(pickerMode==="fusion"){state.fusionSlots=state.fusionSlots||{A:null,B:null};state.fusionSlots[pickerSlot]=x.id;renderFusionSelects()}else if(pickerMode==="sell"){chosenSellId=x.id;$("sellChosen").innerHTML=itemCard(x);$("sellInfo").textContent=`Precio de venta: ${Math.max(1,Math.round(x.val*.7))} créditos.`;$("sellBtn").disabled=false}else if(pickerMode==="equip"){if(pickerSlot==="companion"&&!x.abilities?.length&&!x.ability){x.abilities=rollCompanionAbilities(x.r||1);x.ability=x.abilities[0];x.desc=`Compañero de campo. Habilidades procedurales: ${x.abilities.map(a=>a.name+" ("+a.desc+")").join(" · ")}.`}state.equipped[pickerSlot]=x.id;log(`Equipo actualizado: ${x.name}.`);renderEquipment();renderStats();renderBonus()}$("inventoryPicker").classList.add("hidden");save();sound(500)})}
function fusionOutcome(a,b){
 const da={...info(a.name),...a},db={...info(b.name),...b},text=(a.name+" "+b.name+" "+da.cat+" "+db.cat).toLowerCase();
 const creature=da.cat==="Criatura"||db.cat==="Criatura"||/zombie|mutante|ghoul|híbrido|infectado|merodeador|aberración|cosechador|dron biológico/.test(text);
 const plant=/madera|rama|hoja|resina|seta|hongo|espora|mutada|jardinero|fibra|vegetal/.test(text),metal=/chatarra|hierro|cobre|oro|lingote|tornillo|cable|placa|batería|metal|pico|hacha|titanio|acero/.test(text),energy=/batería|núcleo|energético|cristal|geoda|eléctrica|solar|neón|cuántico|fase/.test(text);
 const weapon=[da.cat,db.cat].includes("Arma")||/espada|cuchillo|cañón|bate|colmillo|lanza|rifle/.test(text),tool=[da.cat,db.cat].includes("Herramienta"),gear=[da.cat,db.cat].includes("Equipo"),consumable=[da.cat,db.cat].includes("Consumible"),sameCat=da.cat===db.cat;let name,icon,cat,slot=null;
 const pools={plant:["Nexo fértil","Brote acorazado","Fibra viva","Raíz prismática"],metal:["Aleación mixta","Nexo férreo","Módulo reforzado","Pieza calibrada"],energy:["Núcleo resonante","Prisma de fase","Celda espectral","Módulo voltaico"],creature:["Híbrido errante","Vástago anómalo","Bestia sintética","Compañero mutado"],weapon:["Filo híbrido","Arma de fase","Impactador mixto","Disruptor compacto"],tool:["Herramienta modular","Extractor adaptativo","Sonda de fase","Recolector preciso"],gear:["Blindaje mixto","Bastión adaptable","Manto reactivo","Escudo de fase"],consumable:["Catalizador mixto","Inyector estable","Carga de pulso","Baliza reactiva"],other:["Artefacto mixto","Componente singular","Objeto convergente","Módulo compuesto"]};
 const choose=list=>list[Math.floor(Math.random()*list.length)];
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
 const val=Math.max(5,Math.round(((a.val||da.val||5)+(b.val||db.val||5))*.7));let desc=cat==="Criatura"?"Organismo procedural estabilizado en la cámara de fusión. Su comportamiento y potencial dependen de su nivel.":"Objeto procedural formado por propiedades compatibles de la materia introducida. Su calidad y parámetros varían en cada ciclo.";
 const out={name,icon,cat,r,val,desc,slot,unique:true,coherent:true};
 if(cat==="Arma"){out.damage=Math.max(4,Math.round(r*5+(Number(a.damage)||0)*.25+(Number(b.damage)||0)*.25+Math.random()*r*2));out.affix=choose(["Filo resonante","Impacto brutal","Pulso estable","Carga residual"]);out.desc+=` Rasgo: ${out.affix}.`;}
 if(cat==="Herramienta"){out.gather=Math.max(5,Math.round(r*7+(Number(a.gather)||0)*.2+(Number(b.gather)||0)*.2+Math.random()*r*2));out.damage=Math.round(r*2+Math.random()*r);out.affix=choose(["Extracción fina","Agarre adaptativo","Lectura mineral","Corte limpio"]);out.desc+=` Rasgo: ${out.affix}.`;}
 if(cat==="Equipo"){out.defense=Math.max(3,Math.round(r*6+(Number(a.defense)||0)*.25+(Number(b.defense)||0)*.25+Math.random()*r*2));out.affix=choose(["Blindaje reactivo","Disipación térmica","Sello hermético","Malla cinética"]);out.desc+=` Rasgo: ${out.affix}.`;}
 if(cat==="Criatura"){out.abilities=rollCompanionAbilities(r);out.ability=out.abilities[0];out.companion=true;out.desc+=` Rasgo procedural: ${out.ability.name} (${out.ability.desc}).`;}
 if(r>=3&&Math.random()<Math.min(.42,.12+r*.055)){cat="Anomalía";out.cat=cat;out.name="Anomalía "+choose(["Nexo","Umbral","Eco","Vórtice","Paradoja","Latido"])+" "+uid().slice(0,2).toUpperCase();out.icon="🧬";const passives=[["Daño",`+${2+r*2} daño pasivo`],["Defensa",`+${r*2} defensa pasiva`],["Recolección",`+${r*5}% de recolección`],["Suerte",`+${r*3}% de hallazgos`],["Créditos",`+${r*2}% de créditos`],["Captura",`+${r*2}% de captura`]];const passive=passives[Math.floor(Math.random()*passives.length)];out.passive={type:passive[0],value:passive[1]};out.slot=null;out.desc=`Anomalía procedural de nivel ${r}. Pasiva: ${passive[1]}.`;out.val+=20;}
 return out;
}
function doFuse(){if(activeTask||state.pendingFusion)return;if(!state.fusionSlots)return;const a=state.inventory.find(x=>x.id===state.fusionSlots?.A),b=state.inventory.find(x=>x.id===state.fusionSlots?.B);if(!a||!b)return toast("Selecciona dos objetos antes de fusionar.",true);if(a.id===b.id&&a.qty<2)return toast("Necesitas dos unidades si eliges el mismo objeto.",true);const aa={...a},bb={...b};beginTask("fusion",10000,()=>{take(aa.name,1);take(bb.name,1);const out={...fusionOutcome(aa,bb),sourceA:aa.name,sourceB:bb.name};itemDB[out.name]=out;state.discovered=state.discovered||{};state.discovered[out.name]={...out,name:out.name};if(!state.seen.includes(out.name))state.seen.push(out.name);state.fusions++;xp(20);state.pendingFusion={a:aa.name,b:bb.name,out,createdAt:Date.now()};state.history.unshift({a:aa.name,b:bb.name,out:out.name,r:out.r,icon:out.icon});state.history=state.history.slice(0,3);log(`Fusión lista para reclamar: <b>${aa.name}</b> + <b>${bb.name}</b>.`);toast("Fusión terminada. Reclama el objeto para guardarlo.");render();save()}, {panel:$('fusionProgress'),bar:$('fusionBar'),percent:$('fusionPercent'),status:null,button:$('fuseBtn')});renderFusionSelects()}
function claimFusion(){if(!state.pendingFusion)return;const out=state.pendingFusion.out;itemDB[out.name]=out;addItem(out.name,1,out);state.pendingFusion=null;state.fusionSlots={A:null,B:null};$('fusionResult').innerHTML='';$('fusionProgress').classList.add('hidden');log(`Objeto de fusión reclamado: <b>${out.name}</b>. Máquina reiniciada.`);toast(`Añadido al inventario: <b>${out.name}</b>`);render();save()}
function renderRecipes(){let filtered=recipes.filter(r=>recipeCategory==="Todos"||(r.category||info(r.out).cat)===recipeCategory).sort((a,b)=>info(a.out).r-info(b.out).r||a.name.localeCompare(b.name,"es"));const pages=Math.max(1,Math.ceil(filtered.length/3));recipePage=Math.min(Math.max(1,recipePage),pages);const shown=filtered.slice((recipePage-1)*3,recipePage*3);const canCraft=r=>Object.entries(r.cost).every(([n,q])=>count(n)>=q);$("recipesGrid").innerHTML=shown.length?shown.map(r=>{const can=canCraft(r);return `<div class="recipe-card"><div style="display:flex;gap:9px;align-items:center"><span style="font-size:1.6rem">${r.icon}</span><div><h4>${escapeHtml(r.name)}</h4><div class="rarity r${info(r.out).r}">NIVEL ${info(r.out).r} · ${escapeHtml(r.category||info(r.out).cat)}</div></div></div><p>${escapeHtml(r.desc)}</p><div class="loot-chips">${Object.entries(r.cost).map(([n,q])=>`<span class="chip ${count(n)>=q?"common":""}">${info(n).icon} ${escapeHtml(n)} ${count(n)}/${q}</span>`).join("")}</div><button data-craft="${r.id}" ${can&&!activeTask?"":"disabled"}>Fabricar · 10 s</button></div>`}).join(""):'<div class="empty" style="grid-column:1/-1">No hay recetas en esta categoría.</div>';$("recipesPageInfo").textContent=`Página ${recipePage} / ${pages} · ${filtered.length} recetas · ordenadas por nivel 1 → 5`;$("recipesPrev").disabled=recipePage<=1;$("recipesNext").disabled=recipePage>=pages;document.querySelectorAll("[data-craft]").forEach(b=>b.onclick=()=>craft(b.dataset.craft))}
function craft(id){const r=recipes.find(x=>x.id===id);if(activeTask)return;if(!Object.entries(r.cost).every(([n,q])=>count(n)>=q))return toast("Faltan materiales para esa receta.",true);beginTask("craft",10000,()=>{Object.entries(r.cost).forEach(([n,q])=>take(n,q));addItem(r.out);xp(8);log(`Fabricación completada: <b>${r.out}</b>.`);$("craftMessage").textContent=`Fabricado: ${r.out}. Ya está en el inventario.`;toast(`Objeto fabricado: <b>${r.out}</b>`);render();save()}, {panel:$("craftProgress"),bar:$("craftBar"),percent:$("craftPercent"),button:null})}
function renderSmelt(){const ores=Object.keys(itemDB).filter(n=>/^Mena de /.test(n)).sort((a,b)=>info(a.replace(/^Mena de /,"Lingote de ")).r-info(b.replace(/^Mena de /,"Lingote de ")).r||a.localeCompare(b,"es"));const pages=Math.max(1,Math.ceil(ores.length/3));smeltPage=Math.min(Math.max(1,smeltPage),pages);const shown=ores.slice((smeltPage-1)*3,smeltPage*3);$('smeltOptions').innerHTML=shown.map(ore=>{const bar=ore.replace(/^Mena de /,"Lingote de ");const qty=2,coal=1;return `<div class="equip-slot"><div><b>${info(bar).icon||"🧱"} ${escapeHtml(bar)}</b><br><span>Fundir ${qty} ${escapeHtml(ore)} + ${coal} carbón → 1 lingote</span><br><small class="muted">Mena disponible: ${count(ore)} / Carbón: ${count("Carbón")}</small></div><button class="tiny" data-smelt="${escapeHtml(ore)}" ${count(ore)>=qty&&count("Carbón")>=coal&&!activeTask?"":"disabled"}>Fundir · 10 s</button></div>`}).join('');$('smeltPageInfo').textContent=`Página ${smeltPage} / ${pages} · ${ores.length} tipos de mena`;$('smeltPrev').disabled=smeltPage<=1;$('smeltNext').disabled=smeltPage>=pages;document.querySelectorAll('[data-smelt]').forEach(b=>b.onclick=()=>smelt(b.dataset.smelt))}
function smelt(ore){const bar=ore.replace(/^Mena de /,"Lingote de "),n=2;if(!itemDB[bar])return toast("Esta mena aún no tiene un proceso de refinado registrado.",true);if(activeTask||count(ore)<n||count("Carbón")<1)return toast("No hay suficiente mena o carbón.",true);beginTask("smelt",10000,()=>{take(ore,n);take("Carbón",1);addItem(bar);xp(6);log(`Horno industrial: ${ore} fundida y convertida en ${bar}.`);$('smeltMessage').textContent=`Proceso terminado: ${n} ${ore} + 1 carbón → ${bar}.`;toast(`Horno: <b>${bar}</b>`);render();save()}, {panel:$('smeltProgress'),bar:$('smeltBar'),percent:$('smeltPercent'),button:null})}
function renderBonus(){$("bonusPanel").innerHTML=`<div class="statline"><span>Bonificación de recolección equipada</span><b class="cyan">+${stat("gather")}%</b></div><div class="statline"><span>Daño total de combate</span><b>${damage()}</b></div><div class="statline"><span>Defensa total</span><b>${defense()}</b></div><p class="small-note">Las herramientas aumentan los hallazgos. Las armas elevan el daño durante los encuentros. Las piezas fusionadas pueden tener efectos inesperados.</p>`}
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
function renderSupplies(){ const cards=supplyPacks.map(p=>`<div class="supply-card"><div class="zone-art" style="height:95px;font-size:2.5rem">${p.icon}</div><h4>${p.name}</h4><div class="gold" style="font-weight:900">◈ ${p.price} créditos</div><p>${p.desc}</p><button class="primary" data-pack="${p.id}" ${state.credits>=p.price&&!state.pendingSupply&&!activeTask?"":"disabled"}>Solicitar suministro</button></div>`).join('');$('suppliesGrid').innerHTML=cards;if($('suppliesGridCentral'))$('suppliesGridCentral').innerHTML=cards;document.querySelectorAll('[data-pack]').forEach(b=>b.onclick=()=>buyPack(b.dataset.pack));renderSupplyDelivery()}
function buyPack(id){const p=supplyPacks.find(p=>p.id===id);if(activeTask||state.pendingSupply)return toast("Termina o reclama el suministro pendiente antes de pedir otro.",true);if(state.credits<p.price)return toast("Créditos insuficientes.",true);state.credits-=p.price;let pool;if(id==="field")pool=["Madera","Chatarra","Carbón","Mena de hierro","Mena de cobre","Cuchillo oxidado","Hacha de ramas","Batería vieja"];else if(id==="black")pool=["Pico de hierro","Hacha de hierro","Espada de cobre","Armadura de chatarra","Placa electrónica","Mena de oro","Zombie de bolsillo","Aleación extraña","Cañón de bolsillo"];else pool=["Espada de rayos","Pico de cristal","Hacha solar","Escudo de vacío","Núcleo energético","Gólem de carbón","Humano enlatado","Zombie jardinero","Traje de esporas","Tostadora mutante"];let n=id==="field"?2:id==="black"?3:4;let found=[];for(let i=0;i<n;i++){if(Math.random()<(id==="field"?.22:id==="black"?.38:.58)){found.push(makeProceduralLoot(id));continue;}let name=pool[Math.floor(Math.random()*pool.length)];if(id==="anomaly"&&Math.random()<.28){const heads=["Cuchilla","Núcleo","Martillo","Guante","Orbe","Pico","Motor","Escudo"];const tails=["de neón","paradójico","cuántico","del vacío","parasitario","solar","inestable","ancestral"];name=heads[Math.floor(Math.random()*heads.length)]+" "+tails[Math.floor(Math.random()*tails.length)]+" "+uid().slice(0,2).toUpperCase();const rr=3+Math.floor(Math.random()*3);const anomaly={name,icon:["🧬","⚡","🛡️","🔮","🪓"][Math.floor(Math.random()*5)],cat:"Anomalía",r:rr,val:rr*24,desc:`Hallazgo anómalo de la cápsula. Firma ${uid().toUpperCase()}.`,passive:[{type:"Daño",value:`+${rr*2} daño pasivo`},{type:"Defensa",value:`+${rr*2} defensa pasiva`},{type:"Suerte",value:`+${rr*3}% de hallazgos`},{type:"Créditos",value:`+${rr*2}% de créditos`},{type:"Recolección",value:`+${rr*4}% de recolección`},{type:"Captura",value:`+${rr*2}% de captura`}][Math.floor(Math.random()*6)],unique:true,procedural:true};itemDB[name]=anomaly;found.push(anomaly);}else found.push({name,...info(name)});}state.pendingSupply={pack:p.name,items:found,stage:"animating",startedAt:Date.now()};log(`Solicitud enviada: <b>${p.name}</b>. La Central está materializando una carga de procedencia incierta.`);render();save();sound(250,.12,"sawtooth");setTimeout(()=>sound(390,.1,"triangle"),500);setTimeout(()=>{if(!state.pendingSupply)return;state.pendingSupply.stage="ready";renderSupplyDelivery();renderSupplies();save();sound(740,.16,"triangle");},3500)}
function renderSupplyDelivery(){const ids=[['supplyDelivery','supplyDeliveryTitle','supplyDeliveryText','supplyDeliveryItems','claimSupply'],['centralSupplyDelivery','centralSupplyDeliveryTitle','centralSupplyDeliveryText','centralSupplyDeliveryItems','claimCentralSupply']];const pending=state.pendingSupply;ids.forEach(([boxId,titleId,textId,itemsId,claimId])=>{const box=$(boxId);if(!box)return;box.classList.toggle('hidden',!pending);box.classList.toggle('supply-scanning',!!pending&&pending.stage==='animating');if(!pending)return;const animating=pending.stage==='animating';$(titleId).textContent=animating?'CONTENIDO DETECTADO · SINCRONIZANDO':'SUMINISTRO RECIBIDO';$(textId).textContent=animating?'El manifiesto ya identifica la carga. La Central está verificando los sellos; los objetos aparecerán aquí y quedarán en tu inventario cuando pulses Reclamar.':'La transmisión ha concluido. Comprueba los objetos y reclama la carga para incorporarlos al inventario.';$(itemsId).innerHTML=(animating?'<div class="supply-crate" style="grid-column:1/-1">▣<span>VERIFICANDO FIRMA · CARGA EN TRÁNSITO</span></div>':'')+pending.items.map(x=>`<div class="supply-reward"><span>${x.icon||info(x.name).icon}</span><b>${escapeHtml(x.name)}</b><small>N${x.r||info(x.name).r} · ${escapeHtml(x.cat||info(x.name).cat)}</small><small>${x.procedural?'HALLAZGO PROCEDURAL':'CONTENIDO DEL PAQUETE'}</small></div>`).join('');$(claimId).classList.toggle('hidden',animating);$(claimId).disabled=animating;})}
function claimSupply(){const pending=state.pendingSupply;if(!pending||pending.stage!=='ready')return;pending.items.forEach(x=>addItem(x.name,1,{icon:x.icon,cat:x.cat,r:x.r,val:x.val,desc:x.desc,damage:x.damage,defense:x.defense,gather:x.gather,slot:x.slot,unique:x.unique,passive:x.passive,procedural:x.procedural,ability:x.ability,abilities:x.abilities,affix:x.affix,companion:x.companion}));const names=pending.items.map(x=>x.name);state.pendingSupply=null;log(`Suministro reclamado: <b>${names.join(', ')}</b>.`);toast(`Añadido al inventario: <b>${names.join(', ')}</b>`);render();save()}
function sellItem(id){const x=state.inventory.find(x=>x.id===id);if(!x)return; if(Object.values(state.equipped).includes(id))return toast("No puedes vender un objeto equipado.",true);const val=Math.max(1,Math.round(x.val*.7*(1+stat("credits")/100)));state.credits+=val;take(x.name,1);chosenSellId=null;$("sellChosen").innerHTML="<div class=\"empty\">Ningún objeto seleccionado.</div>";$("sellBtn").disabled=true;log(`Vendiste <b>${x.name}</b> por ${val} créditos.`);toast(`Venta completada: +${val} créditos`);render();save()}
function renderInventory(){const search=$("inventorySearch").value.toLowerCase(),sort=$("sortInventory").value;let list=state.inventory.filter(x=>(inventoryFilter==="Todos"||x.cat===inventoryFilter)&&x.name.toLowerCase().includes(search));list.sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="value"?b.val-a.val:b.r-a.r);const pages=Math.max(1,Math.ceil(list.length/12));inventoryPage=Math.min(inventoryPage,pages);const shown=list.slice((inventoryPage-1)*12,inventoryPage*12);$("inventoryCountTag").textContent=`${list.reduce((s,x)=>s+x.qty,0)} OBJETOS`;$("inventoryGrid").innerHTML=shown.length?shown.map(x=>itemCard(x)).join(""):'<div class="empty" style="grid-column:1/-1">No se encontraron objetos en esta categoría.</div>';$("pageInfo").textContent=`Página ${inventoryPage} / ${pages} · ${list.length} tipos`; $("prevPage").disabled=inventoryPage<=1;$("nextPage").disabled=inventoryPage>=pages}
function optionsForSlot(slot){return state.inventory.filter(x=>slot==="anomaly"?x.cat==="Anomalía":info(x.name).slot===slot||x.slot===slot)}
function renderEquipment(){const map=[["pick","pickSlot","chooseEquipPick"],["axe","axeSlot","chooseEquipAxe"],["weapon","weaponSlot","chooseEquipWeapon"],["armor","armorSlot","chooseEquipArmor"],["anomaly","anomalySlot","chooseEquipAnomaly"],["companion","companionSlot","chooseEquipCompanion"]];map.forEach(([slot,label,button])=>{const x=state.inventory.find(x=>x.id===state.equipped[slot]);$(label).textContent=x?(slot==="companion"&&x.ability?`${x.name} · ${x.ability.name}`:x.name):"Sin equipar";$(button).onclick=()=>openPicker("equip",slot)});const eq=Object.values(state.equipped).map(id=>state.inventory.find(x=>x.id===id)).filter(Boolean);$("equippedCards").innerHTML=eq.length?eq.map(x=>itemCard(x)).join(""):'<div class="empty" style="grid-column:1/-1">Todavía no tienes equipo equipado. Fabrica o encuentra herramientas y armas.</div>'}
function renderPendingFusion(){const p=state.pendingFusion;if(!p){$('fusionResult').innerHTML='';$('fuseBtn').textContent='⟁ INICIAR FUSIÓN';return}const out=p.out;$('fusionResult').innerHTML=`<div class="result-box fusion-ready"><div class="eyebrow">RESULTADO · RECLAMACIÓN PENDIENTE</div><div style="display:flex;gap:14px;align-items:center;margin:12px 0"><div style="font-size:2.8rem">${out.icon}</div><div><h3 style="margin:0 0 6px">${escapeHtml(out.name)}</h3><div class="rarity r${out.r}">NIVEL ${out.r} · ${rarityNames[out.r]}</div><p class="small-note">${escapeHtml(out.desc)}</p></div></div><div class="loot-chips"><span class="chip">${escapeHtml(out.cat)}</span><span class="chip">Valor: ${out.val} cr.</span><span class="chip">Fusión coherente</span></div><button class="primary" id="claimFusion" style="width:100%;margin-top:14px">✓ RECLAMAR OBJETO Y REINICIAR MÁQUINA</button></div>`;$('claimFusion').onclick=claimFusion;$('fuseBtn').disabled=true;$('fuseBtn').textContent='RECLAMA EL RESULTADO';$('chooseFusionA').disabled=true;$('chooseFusionB').disabled=true}
function renderFusionHistory(){$("fusionHistory").innerHTML=state.history.length?state.history.map(h=>`<div class="activity">${h.icon||"⟁"} ${escapeHtml(h.a)} + ${escapeHtml(h.b)} → <b>${escapeHtml(h.out)}</b> <span class="rarity r${h.r}">N${h.r}</span></div>`).join(""):'<div class="empty">Todavía no has fusionado nada.</div>';}
function obtainedHow(name){const sources=[];zones.forEach(z=>{if(z.loot.includes(name))sources.push("Exploración: "+z.name)});recipes.filter(r=>r.out===name).forEach(()=>sources.push("Mesa de creación: receta disponible"));if(/Lingote de /.test(name))sources.push("Horno industrial: funde la mena correspondiente con carbón");const d=knownInfo(name);if(d.cat==="Criatura")sources.push("Combate: derrota hostiles y consigue estabilizar una criatura tras el encuentro");if(d.cat==="Anomalía"||d.procedural||state.history.some(h=>h.out===name))sources.push("Fusión o recuperación procedural: resultado generado por procesos anómalos");if(!sources.length)sources.push("Exploración, fabricación o suministro; algunos ejemplares solo aparecen mediante procesos procedurales");return [...new Set(sources)]}
function renderRegistry(){const search=$("registrySearch").value.trim().toLowerCase(),sort=$("registrySort")?.value||"name";let list=[...new Set(state.seen||[])].map(name=>({name,...knownInfo(name)}));list=list.filter(x=>(registryFilter==="Todos"||x.cat===registryFilter)&&x.name.toLowerCase().includes(search));list.sort((a,b)=>sort==="rarity"?b.r-a.r||a.name.localeCompare(b.name,"es"):sort==="value"?b.val-a.val||a.name.localeCompare(b.name,"es"):a.name.localeCompare(b.name,"es"));const pages=Math.max(1,Math.ceil(list.length/10));registryPage=Math.min(Math.max(1,registryPage),pages);const shown=list.slice((registryPage-1)*10,registryPage*10);$("registryCount").textContent=`${list.length} DESCUBIERTOS`;$ ("registryGrid").innerHTML=shown.length?shown.map(x=>`<button class="registry-tile rarity-${x.r}" data-registry-item="${escapeHtml(x.name)}"><span class="registry-icon">${x.icon}</span><b>${escapeHtml(x.name)}</b><small>N${x.r} · ${escapeHtml(x.cat)}</small></button>`).join(""):'<div class="empty" style="grid-column:1/-1">Aún no has registrado objetos. Explora, fabrica o fusiona para descubrirlos.</div>';$ ("registryPageInfo").textContent=`Página ${registryPage} / ${pages} · ${list.length} objetos`;$("registryPrev").disabled=registryPage<=1;$("registryNext").disabled=registryPage>=pages;document.querySelectorAll("[data-registry-item]").forEach(b=>b.onclick=()=>openRegistryItem(b.dataset.registryItem))}
function openRegistryItem(name){const d=knownInfo(name),how=obtainedHow(name);$("registryModalTitle").textContent="REGISTRO · "+name;$("registryModalBody").innerHTML=`<div class="registry-details"><div class="registry-big-icon">${d.icon||"❔"}</div><div><div class="rarity r${d.r}">NIVEL ${d.r} · ${rarityNames[d.r]}</div><p><b>${escapeHtml(name)}</b><br>${escapeHtml(d.desc||"Sin descripción disponible.")}</p><div class="loot-chips"><span class="chip">${escapeHtml(d.cat||"Otro")}</span><span class="chip">Valor base: ${d.val||0} cr.</span>${d.affix?`<span class="chip">Rasgo: ${escapeHtml(d.affix)}</span>`:""}${(d.abilities||[]).map(a=>`<span class="chip">${escapeHtml(a.name)}: ${escapeHtml(a.desc)}</span>`).join("")}${d.damage?`<span class="chip">Daño: +${d.damage}</span>`:""}${d.defense?`<span class="chip">Defensa: +${d.defense}</span>`:""}</div></div></div><div class="section-title"><h3>¿CÓMO SE OBTIENE?</h3></div>${how.map(x=>`<div class="activity">⌖ ${escapeHtml(x)}</div>`).join("")}`;$("registryModal").classList.remove("hidden")}

function applyLayoutMode(mode){const valid=["auto","mobile","pc16"].includes(mode)?mode:"auto";state.settings.layoutMode=valid;document.body.classList.toggle("layout-mobile",valid==="mobile");document.body.classList.toggle("layout-pc16",valid==="pc16");document.body.classList.toggle("layout-auto",valid==="auto");const select=$("layoutModeSelect");if(select&&select.value!==valid)select.value=valid;}
function render(){renderPendingFusion();renderSupplyDelivery();renderStats();renderZoneCards();renderZoneDetail();renderFusionSelects();renderRecipes();renderSmelt();renderBonus();renderSupplies();renderInventory();renderEquipment();renderFusionHistory();renderRegistry();save()}
$("fuseBtn").addEventListener("click",doFuse);if($("claimSupply"))$("claimSupply").addEventListener("click",claimSupply);if($("claimCentralSupply"))$("claimCentralSupply").addEventListener("click",claimSupply);$("chooseFusionA").onclick=()=>openPicker("fusion","A");$("chooseFusionB").onclick=()=>openPicker("fusion","B");$("fightBtn").addEventListener("click",fight);$("chooseSellItem").onclick=()=>openPicker("sell");$("sellBtn").addEventListener("click",()=>sellItem(chosenSellId));$("closePicker").onclick=()=>$("inventoryPicker").classList.add("hidden");$("inventoryPicker").addEventListener("click",e=>{if(e.target===$("inventoryPicker"))$("inventoryPicker").classList.add("hidden")});$("pickerSearch").addEventListener("input",()=>{pickerPage=1;renderPicker()});$("pickerPrev").onclick=()=>{pickerPage--;renderPicker()};$("pickerNext").onclick=()=>{pickerPage++;renderPicker()};$("zonesPrev").onclick=()=>{zonePage--;renderZoneCards()};$("zonesNext").onclick=()=>{zonePage++;renderZoneCards()};$("recipesPrev").onclick=()=>{recipePage--;renderRecipes()};$("recipesNext").onclick=()=>{recipePage++;renderRecipes()};$("smeltPrev").onclick=()=>{smeltPage--;renderSmelt()};$("smeltNext").onclick=()=>{smeltPage++;renderSmelt()};document.querySelectorAll("[data-central-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-central-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("#page-central .central-section").forEach(x=>x.classList.toggle("active",x.id==="central-"+b.dataset.centralTab))});document.querySelectorAll("[data-supply-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-supply-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("#page-supplies .central-section").forEach(x=>x.classList.toggle("active",x.id==="supply-"+b.dataset.supplyTab))});$("inventorySearch").addEventListener("input",()=>{inventoryPage=1;renderInventory()});$("sortInventory").addEventListener("change",()=>{inventoryPage=1;renderInventory()});$("prevPage").onclick=()=>{inventoryPage--;renderInventory()};$("nextPage").onclick=()=>{inventoryPage++;renderInventory()};document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{inventoryFilter=b.dataset.filter;inventoryPage=1;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderInventory()});

$("registrySearch").addEventListener("input",()=>{registryPage=1;renderRegistry()});$("registrySort").addEventListener("change",()=>{registryPage=1;renderRegistry()});document.querySelectorAll("[data-registry-filter]").forEach(b=>b.onclick=()=>{registryFilter=b.dataset.registryFilter;registryPage=1;document.querySelectorAll("[data-registry-filter]").forEach(x=>x.classList.toggle("active",x===b));renderRegistry()});$("registryPrev").onclick=()=>{registryPage--;renderRegistry()};$("registryNext").onclick=()=>{registryPage++;renderRegistry()};$("closeRegistry").onclick=()=>$("registryModal").classList.add("hidden");$("registryModal").addEventListener("click",e=>{if(e.target===$("registryModal"))$("registryModal").classList.add("hidden")});document.querySelectorAll("[data-recipe-category]").forEach(b=>b.onclick=()=>{recipeCategory=b.dataset.recipeCategory;recipePage=1;document.querySelectorAll("[data-recipe-category]").forEach(x=>x.classList.toggle("active",x===b));renderRecipes()});
$("installApp").onclick=async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();try{await deferredInstallPrompt.userChoice}catch(e){}deferredInstallPrompt=null;$("installApp").classList.add("hidden")}else{toast("Para instalar, publica Anomaly Fusion en HTTPS y usa el menú del navegador: «Instalar aplicación».");}};window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installApp").classList.remove("hidden")});window.addEventListener("appinstalled",()=>{$("installApp").textContent="✓ Instalada";$("installApp").disabled=true});
$("openSettings").onclick=()=>$("settingsModal").classList.remove("hidden");$("closeSettings").onclick=()=>$("settingsModal").classList.add("hidden");$("settingsModal").addEventListener("click",e=>{if(e.target===$("settingsModal"))$("settingsModal").classList.add("hidden")});
$("soundToggle").onchange=e=>{state.settings.sound=e.target.checked;save();sound(600)};$("scaleSelect").onchange=e=>{state.settings.scale=e.target.value;document.documentElement.style.setProperty("--scale",e.target.value);save()};$("layoutModeSelect").onchange=e=>{applyLayoutMode(e.target.value);save();sound(560)};$("motionToggle").onchange=e=>{state.settings.motion=e.target.checked;document.body.classList.toggle("reduce-motion",e.target.checked);save()};$("fullscreenToggle").onclick=async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();$("fullscreenToggle").textContent="Desactivar"}else{await document.exitFullscreen();$("fullscreenToggle").textContent="Activar"}}catch(e){toast("La pantalla completa no está disponible en este navegador.",true)}};document.addEventListener("fullscreenchange",()=>$("fullscreenToggle").textContent=document.fullscreenElement?"Desactivar":"Activar");
$("exportSave").onclick=exportSave;
$("importSave").onclick=()=>$("importSaveFile").click();
$("importSaveFile").addEventListener("change",async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;try{if(file.size>10*1024*1024)throw new Error("El archivo supera el límite de 10 MB.");const parsed=JSON.parse(await file.text());const raw=parsed&&parsed.save?parsed.save:parsed;const imported=normalizeImportedState(raw);if(!confirm("¿Importar esta partida? Sustituirá el progreso actual en este dispositivo."))return;state=imported;localStorage.removeItem("joyaCeroSave");save();$("settingsModal").classList.add("hidden");render();$("soundToggle").checked=state.settings.sound;$("scaleSelect").value=state.settings.scale;document.documentElement.style.setProperty("--scale",state.settings.scale);$("motionToggle").checked=state.settings.motion;document.body.classList.toggle("reduce-motion",state.settings.motion);applyLayoutMode(state.settings.layoutMode);toast("Partida importada correctamente.")}catch(err){toast(err.message||"No se pudo importar el archivo.",true)}finally{e.target.value=""}});
$("resetGame").onclick=async()=>{if(confirm("¿Reiniciar toda la partida y limpiar la caché de la aplicación? Esta acción no se puede deshacer. La página se recargará.")){localStorage.removeItem("joyaCeroSave");localStorage.removeItem("anomalyFusionSave");state=stateDefault();state.activity=[];save();await clearAppCache();location.reload()}};
// Sonido corto de interfaz para botones, incluidos controles creados dinámicamente.
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||b.disabled||b.id==="soundToggle")return;if(b.id==="exploreBtn"||b.id==="zoneBackBtn")return;sound(380,.025,"sine")},true);
async function checkForAppUpdates(registration){try{await registration.update();if(registration.waiting&&navigator.serviceWorker.controller)registration.waiting.postMessage({type:"SKIP_WAITING"})}catch(e){}}
function init(){if(!state.version){state=stateDefault();log("Sistema inicializado. Inventario y créditos a cero.")}if(!state.activity.length&&!state.inventory.length&&state.credits===0)log("Sistema inicializado. Inventario vacío. Explora para conseguir tus primeros recursos.");bindNavigation();$("soundToggle").checked=state.settings.sound;$("scaleSelect").value=state.settings.scale||"1";document.documentElement.style.setProperty("--scale",state.settings.scale||"1");$("motionToggle").checked=!!state.settings.motion;document.body.classList.toggle("reduce-motion",!!state.settings.motion);applyLayoutMode(state.settings.layoutMode||"auto");render();if(state.pendingSupply&&state.pendingSupply.stage==="animating"){setTimeout(()=>{if(state.pendingSupply&&state.pendingSupply.stage==="animating"){state.pendingSupply.stage="ready";renderSupplyDelivery();renderSupplies();save()}},1200)}if("serviceWorker"in navigator&&location.protocol.startsWith("http")){navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(reg=>{checkForAppUpdates(reg);setInterval(()=>checkForAppUpdates(reg),60000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkForAppUpdates(reg)});window.addEventListener("focus",()=>checkForAppUpdates(reg));}).catch(()=>{});}}
init();
})();