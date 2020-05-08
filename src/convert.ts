import util from 'util';

const testData: any = { 'Jason Roy': { 'Trent Boult': 6, 'Matt Henry': 11 },
'Jonny Bairstow':
 { 'Trent Boult': 17,
   'Matt Henry': 10,
   'Colin de Grandhomme': 4,
   'Lockie Ferguson': 5 },
'Joe Root':
 { 'Matt Henry': 1,
   'Trent Boult': 1,
   'Colin de Grandhomme': 4,
   'Lockie Ferguson': 1 },
'Eoin Morgan':
 { 'Colin de Grandhomme': 5,
   'Lockie Ferguson': 7,
   'James Neesham': 0 },
'Ben Stokes':
 { 'Lockie Ferguson': 12,
   'Colin de Grandhomme': 7,
   'James Neesham': 27,
   'Trent Boult': 23,
   'Mitchell Santner': 5,
   'Matt Henry': 10 },
'Jos Buttler':
 { 'James Neesham': 12,
   'Colin de Grandhomme': 6,
   'Trent Boult': 13,
   'Mitchell Santner': 5,
   'Matt Henry': 8,
   'Lockie Ferguson': 17 },
'Chris Woakes': { 'James Neesham': 2, 'Lockie Ferguson': 0 },
'Liam Plunkett':
 { 'Lockie Ferguson': 4, 'Trent Boult': 5, 'James Neesham': 1 },
'Jofra Archer': { 'James Neesham': 0 } }

let data: any = {
  teamName: "England",
  score: "241/10",
  batsmen: {}
}

for (let bat of Object.keys(testData)) {
  data.batsmen[bat] = {
    notOut: false,
    bowlers: {}
  }
  for (let bowler of Object.keys(testData[bat])) {
    data.batsmen[bat].bowlers[bowler] = testData[bat][bowler]
  }
}


console.log(util.inspect(data, {showHidden: false, depth: null}))