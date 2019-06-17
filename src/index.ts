import fs from 'fs'
import { matchesLocation } from './consts'
import { runOversChecker } from './entry'

let matches = JSON.parse(fs.readFileSync(matchesLocation, 'utf8'))

matches = matches
  .filter((match: string | null) => match !== null)
  .map((match: string) => parseInt(match, 10))

runOversChecker(matches, false, false)
