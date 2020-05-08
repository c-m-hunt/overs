import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'
import { matchesLocation, outputLocation, oversLocation } from './consts'
import { getMatchId } from './data'
import logger from './logger'
import { processMatch } from './ops'

export const getMatches = async () => {
  const urlBase = 'http://static.espncricinfo.com'
  const listURL =
    'http://static.espncricinfo.com/db/STATS/ODIS/MISC/COMPLETE_LIST.html'
  const listData = await axios.get(listURL).then(response => response.data)
  const $ = cheerio.load(listData)
  const matches: string[] = []
  $('pre a').each((_, elem) => {
    const url = $(elem).attr('href')
    if (url.startsWith('/db')) {
      matches.push(urlBase + url)
    }
  })
  // let matchPromises: Promise<string>[] = [];
  const matchIds = []
  for (const matchUrl of matches) {
    const matchId = await getMatchId(matchUrl)
    logger.debug(`Got match ID ${matchId}`)
    matchIds.push(matchId)
    fs.writeFileSync(matchesLocation, JSON.stringify(matchIds))
  }
}

export const requiredRunRateData = async (matchId: number) => {
  let balls = await processMatch(matchId.toString());
  balls = balls.filter(ball => ball.requiredRunRate !== undefined);
  return balls;
}

export const runOversChecker = async (
  matches: number[],
  order: boolean = false,
  different: boolean = false
) => {
  logger.info(
    `Running overs check with params - matches: ${matches.length}, order: ${order}, different: ${different}`
  )
  let balls: any[] = []
  for (const matchId of matches) {
    try {
      logger.debug(`Starting to process match ID ${matchId}`)
      const newBalls = await processMatch(matchId.toString())
      balls = [...balls, ...newBalls]
      logger.debug(`Data collected. Now got data for ${balls.length} balls`)
    } catch (err) {
      logger.error(err)
    }
  }
  const overs: { [key: string]: string[] } = {}
  balls.map(ball => {
    const idx = `${ball.matchId}-${ball.periodId}-${ball.over}`
    if (overs[idx] === undefined) {
      overs[idx] = []
    }
    overs[idx].push(ball.code)
  })

  const oversProcessed: { [key: string]: string } = {}
  Object.keys(overs).map(key => {
    const overString = order
      ? overs[key].join(' ')
      : overs[key].sort().join(' ')
    if (different) {
      if (overs[key].length === new Set(overs[key]).size) {
        oversProcessed[key] = overString
      }
    } else {
      oversProcessed[key] = overString
    }
  })

  fs.writeFileSync(oversLocation, JSON.stringify(oversProcessed));

  const uniqueOvers: { [key: string]: number } = {}
  Object.values(oversProcessed).map((over: string) => {
    if (uniqueOvers[over] === undefined) {
      uniqueOvers[over] = 0
    }
    uniqueOvers[over]++
  })

  const sortable: Array<[string, number]> = Object.keys(uniqueOvers).map(
    key => {
      return [key, uniqueOvers[key]]
    }
  )

  sortable.sort((a, b) => {
    return b[1] - a[1]
  })
  logger.info(`Writing output to ${outputLocation}`)
  fs.writeFileSync(outputLocation, JSON.stringify(sortable))
}
