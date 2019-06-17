import path from 'path'

export const cacheLocation: string = path.resolve(__dirname, './../cache')
export const matchesLocation: string = path.resolve(
  __dirname,
  './../data/wc.json'
)
export const outputLocation: string = path.resolve(
  __dirname,
  './../data/output.json'
)
export const oversLocation: string = path.resolve(
  __dirname,
  './../data/overs.json'
);

export const ballsLocation: string = path.resolve(
  __dirname,
  './../data/balls.json'
)