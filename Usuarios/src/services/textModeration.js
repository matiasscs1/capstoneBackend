import * as pkg from 'bad-words';
const Filter = pkg.default || pkg;

const filtro = new Filter();

// Lista ofensiva personalizada (como ya tienes)
filtro.addWords(
  'idiota', 'imbécil', 'estúpido', 'inútil', 'burro', 'bestia', 'tonto', 'bobo',
  'mierda', 'puta', 'puto', 'putazo', 'joder', 'coño', 'gilipollas', 'pendejo', 'culero',
  'cabrón', 'chingar', 'chingado', 'verga', 'concha', 'forro', 'carajo', 'pelotudo',
  'boludo', 'culiado', 'pija', 'pedo', 'reverendo', 'reculiao', 'recagado',
  'no mames', 'pinche', 'chingadera', 'huevos', 'me vale verga', 'a la verga',
  'la concha de tu madre', 'sos un forro', 'garcha', 'orto', 'sorete',
  'maricón', 'marica', 'trolo', 'putarraco', 'sidoso', 'trava', 'gay de mierda',
  'negro de mierda', 'sudaca', 'terrorista', 'villero',
  'sexo', 'pornografía', 'porno', 'paja', 'masturbar', 'violador', 'coger', 'vagina',
  'droga', 'cocaína', 'marihuana', 'alcohol', 'borracho', 'cerveza',
  'te voy a matar', 'romperte', 'desaparecerte', 'sos boleta', 'hijo de puta',
  'hpt', 'ptm', 'qlp', 'gfa', 'vrg', 'hdtm', 'ctm', 'lpm', 'mrd'
);

// Normaliza texto para detectar trampas
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')                           // quitar tildes
    .replace(/[\u0300-\u036f]/g, '')           // quitar acentos
    .replace(/[^a-z0-9]/gi, '')                // eliminar símbolos y espacios
    .replace(/[|@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?!~`°•·]/g, '') // extra symbols
    .replace(/1/g, 'i')                        // reemplazar números comunes
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/7/g, 't');
}

// Funciones exportadas
export const contienePalabrasOfensivas = (texto) => {
  const limpio = normalizarTexto(texto);
  return filtro.isProfane(limpio);
};

export const censurarTexto = (texto) => {
  return filtro.clean(texto);
};
