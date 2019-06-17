import path from 'path'

export const cacheLocation: string = path.resolve(__dirname, './../cache')
export const matchesLocation: string = path.resolve(
  __dirname,
  './../data/matches.json'
)
export const outputLocation: string = path.resolve(
  __dirname,
  './../data/output.json'
)
