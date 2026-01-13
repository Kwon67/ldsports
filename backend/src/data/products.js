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
];

const products = teamsData.flatMap(teamData =>
  teamData.products.map(product => ({
    ...product,
    team: teamData.info.name,
  }))
);

const teams = teamsData.map(data => data.info);

module.exports = { products, teams };
