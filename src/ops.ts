import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { cacheLocation } from './consts'
import logger from './logger'
import { Ball } from './types/app'
import { Commentary, Item } from './types/cricinfo'
import { CommentaryData } from './types/cricinfo'

export const processMatch = async (id: string): Promise<Ball[]> {
  const periods = [1, 2]
  let balls: Ball[] = []
  for (const period of periods) {
    let data = await getData(id, period, 1)
    const pages = data.commentary.pageCount
    for (let i = 1; i <= pages; i++) {
      if (i > 1) {
        data = await getData(id, period, i)
      }
      const newBalls = processCommentary(data.commentary, id, period.toString())
      balls = [...balls, ...newBalls]
    }
  }
  return balls
}

export const processCommentary = (
  commentary: Commentary,
  matchId: string,
  periodId: string
): Ball[] => {
  let prevOver = 0;
  let currentBall = 0;
  const balls: Ball[] = commentary.items
    .map(item => {
      if (!item.over.actual) {
        logger.error(
          `Problem with match and period - no actual over returned: ${matchId}, ${periodId}`
        )
      }
      const over = parseInt(item.over.actual ? item.over.actual.toString().split('.')[0] : '')
      let ball;
      if (over === prevOver) {
        currentBall += 1;
      } else {
        currentBall = 0
        prevOver = over
      }
      ball = currentBall
      return {
        ballId: item.over.unique.toString(),
        code: getCode(item),
        matchId,
        over,
        ball,
        periodId: parseInt(periodId),
        bowlingTeam: item.bowler.team.abbreviation,
        battingTeam: item.batsman.team.abbreviation,
        batsmanName: item.batsman.athlete.name,
        bowlerName: item.bowler.athlete.name,
        score: item.scoreValue,
        playType: item.playType.description,
        requiredRunRate: item.innings.requiredRunRate
      }
    })
    //.filter(ball => ball.over !== '')
  return balls
}

export const getCode = (ball: Item) => {
  let code: string = ball.scoreValue.toString()
  switch (ball.playType.description) {
    case 'wide':
      code = `${code}w`
      break
    case 'leg bye':
      code = `${code}lb`
      break
    case 'bye':
      code = `${code}b`
      break
    case 'out':
      code = `W`
      break
  }

  if (ball.over.noBall > 0) {
    code = `${ball.over.noBall}nb`
  }

  return code
}

const getURL = (id: string, period: number, page: number): string => {
  return `https://site.web.api.espn.com/apis/site/v2/sports/cricket/8039/playbyplay?contentorigin=espn&event=${id}&page=${page}&period=${period}&section=cricinfo`
}

// https://site.web.api.espn.com/apis/site/v2/sports/cricket/8039/playbyplay?contentorigin=espn&event=65043&page=1&period=1&section=cricinfo

async function getCommentaryData(url: string): Promise<CommentaryData> {
  return await axios
    .get(url)
    .then(response => response.data)
    .then((data: CommentaryData) => data)
}

async function getData(
  id: string,
  period: number,
  page: number
): Promise<CommentaryData> {
  const cacheName = path.resolve(
    cacheLocation,
    `./${id}-${period.toString()}-${page.toString()}.json`
  )
  let data: CommentaryData
  if (fs.existsSync(cacheName)) {
    data = JSON.parse(fs.readFileSync(cacheName, 'utf8'))
  } else {
    const url = getURL(id, period, page)
    data = await getCommentaryData(url)
    fs.writeFileSync(cacheName, JSON.stringify(data))
  }
  return data
}
