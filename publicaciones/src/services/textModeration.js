import * as pkg from 'bad-words';
const Filter = pkg.default || pkg; // fallback para compatibilidad

const filtro = new Filter();


filtro.addWords(
  // Insultos comunes
  'idiota', 'imbécil', 'estúpido', 'inútil', 'burro', 'bestia', 'tonto', 'bobo',

  // Vulgaridades generales
  'mierda', 'puta', 'puto', 'putazo', 'joder', 'coño', 'gilipollas', 'pendejo', 'culero',
  'cabrón', 'chingar', 'chingado', 'verga', 'concha', 'forro', 'carajo', 'pelotudo',
  'boludo', 'culiado', 'pija', 'pedo', 'reverendo', 'reculiao', 'recagado',

  // Expresiones mexicanas vulgares
  'no mames', 'pinche', 'chingadera', 'huevos', 'me vale verga', 'a la verga',

  // Argentinas / Uruguay / Chile
  'pelotudo', 'boludo', 'la concha de tu madre', 'andate a la mierda', 'sos un forro',
  'garcha', 'reventado', 'recontra', 'orto', 'sorete',

  // Homofobia / transfobia / bullying
  'maricón', 'marica', 'trolo', 'putarraco', 'sidoso', 'trava', 'travesti de mierda',
  'gay de mierda', 'lesbiana asquerosa', 'trans de mierda',

  // Discriminación / racismo
  'negro de mierda', 'india', 'indio', 'gitano', 'sudaca', 'judío', 'judía', 'nazi',
  'terrorista', 'cholo', 'cabecita', 'villero', 'mojado',

  // Sexo / explícito
  'sexo', 'pornografía', 'porno', 'paja', 'masturbar', 'orgasmo', 'violación',
  'violador', 'coger', 'cojer', 'eyacular', 'vagina', 'pene', 'teta', 'culo', 'chota',
  'chuparla', 'lamer', 'hacer el amor', 'meterla', 'mojar', 'dura', 'venirse', 'tragar',

  // Drogas / alcohol
  'droga', 'drogas', 'cocaína', 'marihuana', 'porro', 'faso', 'éxtasis', 'paco',
  'alcohol', 'borracho', 'cerveza', 'trago', 'fumón', 'fumeta', 'perico', 'merca',

  // Amenazas o violencia
  'te voy a matar', 'matarte', 'romperte', 'pegarte', 'reventarte', 'desaparecerte',
  'sos boleta', 'te busco', 'te encuentro', 'hijo de puta', 'hdp', 'malparido',

  // Abreviaciones o cifradas
  'hpt', 'ptm', 'qlp', 'gfa', 'vrg', 'hdtm', 'ctm', 'lpm', 'mrd', 'tkmctm'
);

// Funciones exportadas
export const contienePalabrasOfensivas = (texto) => {
  return filtro.isProfane(texto);
};

export const censurarTexto = (texto) => {
  return filtro.clean(texto);
};
