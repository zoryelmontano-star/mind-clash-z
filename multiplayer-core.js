/* Mind Clash Z multiplayer vote/count/score rules, shared by all categories. */
(function (root) {
  'use strict';
  const version = '2026-10-09-v4-600';
  function roundKey(state) {
    if (!state || !Number.isInteger(Number(state.round)) || Number(state.round) < 0) return null;
    const matchId = String(state.matchId || '').trim();
    return matchId ? matchId + '_r' + state.round : String(state.round);
  }
  function tally(answers, players) {
    const roster = Object.keys(players || {});
    const validAnswers = {};
    const counts = [0, 0, 0, 0];
    for (const playerId of roster) {
      const choice = answers && answers[playerId];
      if (Number.isInteger(choice) && choice >= 0 && choice < 4) {
        validAnswers[playerId] = choice;
        counts[choice]++;
      }
    }
    return { counts, total: Object.keys(validAnswers).length, players: roster.length, answers: validAnswers };
  }
  function award(players, answers, question, pointValues) {
    if (!question || !Number.isInteger(question.correct) || question.correct < 0 || question.correct > 3) {
      throw Error('Cannot score an invalid question');
    }
    const votes = tally(answers, players).answers;
    const points = Number(pointValues[question.diff]);
    if (!Number.isFinite(points) || points < 0) throw Error('Unrecognized question difficulty');
    const updates = {};
    for (const [id, player] of Object.entries(players || {})) {
      if (votes[id] === question.correct) {
        updates['players/' + id + '/score'] = Number(player.score || 0) + points;
      }
    }
    return updates;
  }
  function outOfDate(players) {
    return Object.entries(players || {}).filter(([, player]) => player.clientVersion !== version)
      .map(([id, player]) => ({ id, name: String(player.name || 'Unknown player') }));
  }
  root.MCZMulti = { version, roundKey, tally, award, outOfDate };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MCZMulti;
})(typeof window === 'undefined' ? globalThis : window);
