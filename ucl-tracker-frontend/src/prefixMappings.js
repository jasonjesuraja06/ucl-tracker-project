export const natMap = [
  ['al ALB', 'Albania', 'albania'],
  ['am ARM', 'Armenia', 'armenia'],
  ['ao ANG', 'Angola', 'angola'],
  ['ar ARG', 'Argentina', 'argentina'],
  ['at AUT', 'Austria', 'austria'],
  ['au AUS', 'Australia', 'australia'],
  ['ba BIH', 'Bosnia', 'bosnia'],
  ['be BEL', 'Belgium', 'belgium'],
  ['bf BFA', 'Burkina Faso', 'burkina-faso'],
  ['br BRA', 'Brazil', 'brazil'],
  ['ca CAN', 'Canada', 'canada'],
  ['cg CGO', 'Republic of the Congo', 'republic-of-the-congo'],
  ['ch SUI', 'Switzerland', 'switzerland'],
  ['ci CIV', 'Ivory Coast', 'ivory-coast'],
  ['cl CHI', 'Chile', 'chile'],
  ['cm CMR', 'Cameroon', 'cameroon'],
  ['cd COD', 'DR Congo', 'dr-congo'],
  ['co COL', 'Colombia', 'colombia'],
  ['cr CRC', 'Costa Rica', 'costa-rica'],
  ['cz CZE', 'Czech Republic', 'czech-republic'],
  ['de GER', 'Germany', 'germany'],
  ['dk DEN', 'Denmark', 'denmark'],
  ['do DOM', 'Dominican Republic', 'dominican-republic'],
  ['dz ALG', 'Algeria', 'algeria'],
  ['ec ECU', 'Ecuador', 'ecuador'],
  ['eg EGY', 'Egypt', 'egypt'],
  ['es ESP', 'Spain', 'spain'],
  ['fi FIN', 'Finland', 'finland'],
  ['fr FRA', 'France', 'france'],
  ['ga GAB', 'Gabon', 'gabon'],
  ['gm GAM', 'Gambia', 'gambia'],
  ['ge GEO', 'Georgia', 'georgia'],
  ['gh GHA', 'Ghana', 'ghana'],
  ['gr GRE', 'Greece', 'greece'],
  ['gn GUI', 'Guinea', 'guinea'],
  ['gw GNB', 'Guinea-Bissau', 'guinea-bissau'],
  ['hn HON', 'Honduras', 'honduras'],
  ['hr CRO', 'Croatia', 'croatia'],
  ['hu HUN', 'Hungary', 'hungary'],
  ['id IDN', 'Indonesia', 'indonesia'],
  ['ie IRL', 'Ireland', 'ireland'],
  ['il ISR', 'Israel', 'israel'],
  ['ir IRN', 'Iran', 'iran'],
  ['is ISL', 'Iceland', 'iceland'],
  ['it ITA', 'Italy', 'italy'],
  ['jm JAM', 'Jamaica', 'jamaica'],
  ['jp JPN', 'Japan', 'japan'],
  ['kr KOR', 'South Korea', 'south-korea'],
  ['xk KVX', 'Kosovo', 'kosovo'],
  ['lu LUX', 'Luxembourg', 'luxembourg'],
  ['ly LBY', 'Libya', 'libya'],
  ['mg MAD', 'Madagascar', 'madagascar'],
  ['ma MAR', 'Morocco', 'morocco'],
  ['me MNE', 'Montenegro', 'montenegro'],
  ['ml MLI', 'Mali', 'mali'],
  ['mx MEX', 'Mexico', 'mexico'],
  ['mk MKD', 'North Macedonia', 'north-macedonia'],
  ['mz MOZ', 'Mozambique', 'mozambique'],
  ['nl NED', 'Netherlands', 'netherlands'],
  ['ng NGA', 'Nigeria', 'nigeria'],
  ['gb-nir NIR', 'Northern Ireland', 'northern-ireland'],
  ['no NOR', 'Norway', 'norway'],
  ['nz NZL', 'New Zealand', 'new-zealand'],
  ['pa PAN', 'Panama', 'panama'],
  ['py PAR', 'Paraguay', 'paraguay'],
  ['pe PER', 'Peru', 'peru'],
  ['pl POL', 'Poland', 'poland'],
  ['pt POR', 'Portugal', 'portugal'],
  ['ru RUS', 'Russia', 'russia'],
  ['gb-sct SCO', 'Scotland', 'scotland'],
  ['sn SEN', 'Senegal', 'senegal'],
  ['rs SRB', 'Serbia', 'serbia'],
  ['ch SUI', 'Switzerland', 'switzerland'],
  ['sk SVK', 'Slovakia', 'slovakia'],
  ['si SVN', 'Slovenia', 'slovenia'],
  ['se SWE', 'Sweden', 'sweden'],
  ['sr SUR', 'Suriname', 'suriname'],
  ['tn TUN', 'Tunisia', 'tunisia'],
  ['tr TUR', 'Turkey', 'turkey'],
  ['tz TAN', 'Tanzania', 'tanzania'],
  ['ua UKR', 'Ukraine', 'ukraine'],
  ['us USA', 'United States', 'united-states'],
  ['uy URU', 'Uruguay', 'uruguay'],
  ['uz UZB', 'Uzbekistan', 'uzbekistan'],
  ['ve VEN', 'Venezuela', 'venezuela'],
  ['zm ZAM', 'Zambia', 'zambia']
];

export const posMap = { 
  GK: 'Goalkeeper', 
  DF: 'Defender', 
  MF: 'Midfielder', 
  FW: 'Forward' 
};

export const parseNationality = (raw) => {
  const country = natMap.find(([code]) => code === raw || code.split(' ')[0] === raw);
  return country ? country[1] : raw;
};

export const getFlagSlug = (raw) => {
  const country = natMap.find(([code]) => code === raw || code.split(' ')[0] === raw);
  return country ? country[2] : slugify(raw);
};

export const parseTeam = (raw) => {
  const parts = raw.split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : raw;
};

export const parsePosition = (raw) => posMap[raw] || raw;

export const slugify = (str) => str ? str.toLowerCase().replace(/\s+/g, '-') : '';