# Overs checker

To check overs combinations from Cricinfo

## To run

Create a file `./data/matches.json` with a stringified array of match IDs e.g.
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
* `order` (`true`) - if `true`, will order the balls in the over meaning. Used for looking for combinations of balls rather than precise over
* `different` (`false`) - if `true`, will only detect overs with different values for every ball. 

Then `yarn run`.

App will collect commentary from the matches and extract the ball information.

It will return the output into `./data/output.json`.