import axios from 'axios';
import logger from './logger';

export const getMatchId = async (url: string): Promise<string> => {
  logger.debug(`Getting match ID for url ${url}`)
  return axios.get(url)
    .then(response => {
      const matchId = response.request.path.split('/')[4];
      logger.debug(`MatchID ${matchId} for url ${url}`);
      return matchId;
    })
    .catch(err => {
      logger.error(err);
    });
}
