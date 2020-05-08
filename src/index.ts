import fs from 'fs'
import { matchesLocation } from './consts'
import { runOversChecker, requiredRunRateData } from './entry'
import { processMatch } from './ops'
import { Ball } from 'types/app'

export const oversChecker = (order: boolean, different: boolean ) => {
  let matches = JSON.parse(fs.readFileSync(matchesLocation, 'utf8'))

  matches = matches
    .filter((match: string | null) => match !== null)
    .map((match: string) => parseInt(match, 10))

  runOversChecker(matches, order, different)
}

// Checks the overs against matches in matches.json
// oversChecker(false, false);
// @ts-ignore
export const getSingleGameData = async () => {
  let balls = await requiredRunRateData(1144530);
  console.log(balls)
  let str = '';
  balls.map((ball: Ball) => {
    // return [ball.ballId, parseFloat(ball.requiredRunRate)];
    str += `${ball.ballId}, ${ball.requiredRunRate}\r\n`;
  })

  fs.writeFileSync('./data/rrr.csv', str);
};

export const getBatsmenBowlerBreakdown = async (matchId: string) => {
  let balls = await processMatch(matchId);

  balls = balls
    .filter(b => b.battingTeam === 'ENG')
    .filter(b => !b.code.endsWith('w'))
    .filter(b => !b.code.endsWith('nb'))

  const bats: any = {}

  for (let ball of balls) {
    if (!Object.keys(bats).includes(ball.batsmanName)) {
      bats[ball.batsmanName] = {}
    }
    if (!Object.keys(bats[ball.batsmanName]).includes(ball.bowlerName)) {
      bats[ball.batsmanName][ball.bowlerName] = 0
    }
    if (ball.code)
    bats[ball.batsmanName][ball.bowlerName] += ball.score
  }

  console.log(bats)
};

export const getBatsmanBalls = async (matchId: string, batsman: string) => {
  let balls = await processMatch(matchId);
  const runs = balls.filter(b => b.batsmanName === batsman)
    .filter(b => !b.code.endsWith('w'))
    .map(b => {
      // @ts-ignore
      if (isNaN(b.code)) {
        return 0
      }
      return b.score
    })

  // const rrr = balls.filter(b => b.batsmanName === batsman)
  //   .filter(b => !b.code.endsWith('w'))
  //   .map(b => (parseFloat(b.requiredRunRate) / 6) * 100)

  // console.log(rrr.length)
  console.log(runs.join(","))
};

export const getBallsData = async (matchId: string) => {
  let balls = await processMatch(matchId);
  fs.writeFileSync(`./data/balls_${matchId}.json`, JSON.stringify(balls));
}

//getBatsmanBalls("1144528", "MS Dhoni")

getBallsData('1144528');