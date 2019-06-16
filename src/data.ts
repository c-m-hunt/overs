import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import logger from './logger';

export async function getMatches () {
  const urlBase = 'http://static.espncricinfo.com';
  const listURL = 'http://static.espncricinfo.com/db/STATS/ODIS/MISC/COMPLETE_LIST.html';
  const listData = await axios.get(listURL).then(response => response.data);
  const $ = cheerio.load(listData);
  let matches: string[] = [];
  $('pre a').each((_, elem) => {
    const url = $(elem).attr('href');
    if (url.startsWith('/db')) {
      matches.push(urlBase + url);
    }
  });
  // let matchPromises: Promise<string>[] = [];
  let matchIds = [];
  for (let matchUrl of matches) {
    // matchPromises.push(getMatchId(matchUrl));
    let matchId = await getMatchId(matchUrl);
    logger.info(matchId);
    matchIds.push(matchId);
    fs.writeFileSync(path.resolve(__dirname, './../data/matches.json'), JSON.stringify(matchIds));
  }

  // Promise.all(matchPromises)
  //   .then(matchIds => {
  //     fs.writeFileSync(path.resolve(__dirname, './../data/matches.json'), JSON.stringify(matchIds));
  //   });
}

async function getMatchId(url: string): Promise<string> {
  logger.debug(`Getting match ID for url ${url}`)
  return axios.get(url)
    .then(response => {
      const matchId = response.request.path.split('/')[4];
      logger.debug(`MatchID ${matchId} for url ${url}`);
      return matchId;
    })
    .catch(err => {
      logger.error(err);
    });
}
