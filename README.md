# Overs checker

To check overs combinations from Cricinfo

## To get matches
To create a `matches.json` file based on matches in  http://static.espncricinfo.com/db/STATS/ODIS/MISC/COMPLETE_LIST.html, run
```
yarn getMatches
```
The reason this step takes a long time is that the links in the above list go to a page without a match ID (e.g. http://static.espncricinfo.com/db/ARCHIVE/1970S/1970-71/ENG_IN_AUS/ENG_AUS_ODI_05JAN1971.html) which then gets `302` redirected to another page (e.g.http://www.espncricinfo.com/series/17265/scorecard/64148/australia-vs-england-only-odi-england-marylebone-cricket-club-tour-of-australia-1970-71)with the match ID so we need to follow that link to get the match ID.

## To run
A full run will use `./data/matches.json` which expects stringified array of match IDs e.g.
```
[
  1144483,
  1144484,
  1144485,
  1144486,
  1144487,
  1144488,
  1144489,
  1144490,
  1144491,
  1144492,
  1144493,
  1144494,
  1144495,
  1144496,
  1144497,
  1144498,
  1144499,
  1144500,
  1144501,
  1144502,
  1144503,
  1144504
]
```

Adjust the 2nd and 3rd paramters of the `runOversChecker` in `./src/index.ts`:
* `order` (`true`) - if `true`, will maintain the order the balls were bowled in. If `false`, will sort balls of over in order. Used for looking for combinations of balls rather than precise over
* `different` (`false`) - if `true`, will only detect overs with different values for every ball. 

Then `yarn run`.

App will collect commentary from the matches and extract the ball information.

It will return the output into `./data/output.json`.