import fs from 'fs'
import { matchesLocation } from './consts'
import { runOversChecker } from './entry'

export const oversChecker = (order: boolean, different: boolean ) => {
  let matches = JSON.parse(fs.readFileSync(matchesLocation, 'utf8'))

  matches = matches
    .filter((match: string | null) => match !== null)
    .map((match: string) => parseInt(match, 10))
  
  runOversChecker(matches, order, different)
}

// Gets matches
// import { getMatches } from './entry'
// getMatches();

// Checks the overs against matches in matches.json
oversChecker(true, true);

