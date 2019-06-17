import { Commentary, Item } from './types/cricinfo';
import { Ball } from './types/app';
import { CommentaryData } from './types/cricinfo';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { cacheLocation } from './consts';

export async function processMatch(id: string): Promise<Ball[]> {
  const periods = [1, 2];
  let balls: Ball[] = [];
  for (let period of periods) {
    let data = await getData(id, period, 1);
    let pages  = data.commentary.pageCount;
    for (let i = 1; i <= pages; i++) {
      if (i > 1) {
        data = await getData(id, period, i);
      }
      let newBalls = processCommentary(data.commentary, id, period.toString());
      balls = [ ...balls, ...newBalls];
    }
  }
  return balls;
}

export const processCommentary = (commentary: Commentary, matchId: string, periodId: string): Ball[] => {
  const balls: Ball[]= commentary.items.map(item => {
    if (!item.over.actual) {
      console.log(matchId, periodId);
    }
    return {
      ballId: item.over.unique.toString(),
      matchId,
      periodId,
      over: item.over.actual ? item.over.actual.toString().split('.')[0] : '',
      code: getCode(item),
    }
  }).filter(ball => ball.over !== '');
  return balls;
}

export const getCode = (ball: Item) => {
  let code: string = ball.scoreValue.toString();
  switch (ball.playType.description) {
    case 'wide':
      code = `${code}w`;
      break;
    case 'leg bye':
      code = `${code}lb`;
      break;
    case 'bye':
      code = `${code}b`;
      break;
    case 'out':
      code = `W`;
      break;
  }

  if (ball.over.noBall > 0) {
    code = `${ball.over.noBall}nb`;
  }

  return code;
}

const getURL = (id: string, period: number, page: number): string => {
  return `https://site.web.api.espn.com/apis/site/v2/sports/cricket/8039/playbyplay?contentorigin=espn&event=${id}&page=${page}&period=${period}&section=cricinfo`;
}


// https://site.web.api.espn.com/apis/site/v2/sports/cricket/8039/playbyplay?contentorigin=espn&event=65043&page=1&period=1&section=cricinfo

async function getCommentaryData(url: string): Promise<CommentaryData> {
  return await axios.get(url)
  .then(response => response.data)
  .then((data: CommentaryData) => data);
}

async function getData(id: string, period: number, page: number): Promise<CommentaryData> {
  const cacheName = path.resolve(cacheLocation, `./${id}-${period.toString()}-${page.toString()}.json`);
  let data: CommentaryData;
  if (fs.existsSync(cacheName)) {
    data = JSON.parse(fs.readFileSync(cacheName, 'utf8'));
  } else {
    let url = getURL(id, period, page);
    data = await getCommentaryData(url);
    fs.writeFileSync(cacheName, JSON.stringify(data));
  }
  return data;
}
