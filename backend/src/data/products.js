const brasil = require('./teams/brasil');
const realMadrid = require('./teams/real-madrid');
const psg = require('./teams/psg');
const flamengo = require('./teams/flamengo');
const palmeiras = require('./teams/palmeiras');
const barcelona = require('./teams/barcelona');
const arsenal = require('./teams/arsenal');
const liverpool = require('./teams/liverpool');
const manCity = require('./teams/man-city');
const corinthians = require('./teams/corinthians');
const saoPaulo = require('./teams/sao-paulo');
const gremio = require('./teams/gremio');
const internacional = require('./teams/internacional');
const botafogo = require('./teams/botafogo');
const fluminense = require('./teams/fluminense');
const atleticoMg = require('./teams/atletico-mg');
const bayern = require('./teams/bayern');
const juventus = require('./teams/juventus');
const milan = require('./teams/milan');
const manUnited = require('./teams/man-united');
const chelsea = require('./teams/chelsea');

const teamsData = [
  brasil,
  realMadrid,
  psg,
  flamengo,
  palmeiras,
  barcelona,
  arsenal,
  liverpool,
  manCity,
  corinthians,
  saoPaulo,
  gremio,
  internacional,
  botafogo,
  fluminense,
  atleticoMg,
  bayern,
  juventus,
  milan,
  manUnited,
  chelsea,
];

const products = teamsData.flatMap(teamData =>
  teamData.products.map(product => ({
    ...product,
    team: teamData.info.name,
  }))
);

const teams = teamsData.map(data => data.info);

module.exports = { products, teams };
