const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
require.extensions['.ts'] = (mod, filename) => {
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  }).outputText, filename);
};
const { buildRoleDeck, filterGames } = require('../src/utils/gameEngine.ts');
const { gamesData } = require('../src/data/games.ts');
const { legalCases } = require('../src/data/legalCases.ts');
const { auctionCategories } = require('../src/data/auction.ts');
test('role decks preserve player count and role composition for all supported groups', () => {
  for (let n = 5; n <= 20; n++) {
    const deck = buildRoleDeck(n);
    assert.equal(deck.length, n);
    assert.equal(deck.filter(r => r.colorKey === 'vampir').length, Math.floor(n / 4));
    assert.equal(deck.filter(r => r.colorKey === 'doktor').length, 1);
    assert.equal(deck.filter(r => r.colorKey === 'komiser').length, n >= 7 ? 1 : 0);
  }
  for (const n of [0, 4, 21, 5.5, NaN]) assert.throws(() => buildRoleDeck(n), RangeError);
});
test('Turkish search and filters intersect', () => {
  const filtered = filterGames(gamesData, { groupFilter: '1-2', categoryFilter: 'buz-kirici', searchQuery: ' BUZ KIRICI ' });
  assert.deepEqual(filtered.map(g => g.id), ['buz-kirici']);
  assert.equal(filterGames(gamesData, { groupFilter: '1-2', categoryFilter: 'gizli-rol', searchQuery: '' }).length, 0);
});
test('party-game catalog includes the simultaneous pointing game', () => {
  const game = gamesData.find(g => g.id === 'herkesin-gozu-birbirinde');
  assert.ok(game);
  assert.equal(game.engine, 'everyone');
  assert.equal(game.minPlayers, 3);
  assert.equal(game.vip, false);
});
test('legal game deck contains disclosed, https sources and staged evidence', () => {
  const game = gamesData.find(g => g.id === 'gercek-dosyalar');
  assert.equal(game.engine, 'legal');
  assert.ok(legalCases.length >= 5);
  for (const card of legalCases) {
    assert.match(card.source.url, /^https:\/\//);
    assert.ok(card.source.label.length > 10);
    assert.ok(card.tr.evidence.length > 30);
    assert.ok(card.tr.outcome.length > 30);
  }
});
test('fingers game supports a shared touch screen group', () => {
  const game = gamesData.find(g => g.id === 'kac-parmak');
  assert.equal(game.engine, 'fingers');
  assert.equal(game.minPlayers, 2);
  assert.equal(game.maxPlayers, 8);
  assert.equal(game.vip, false);
});
test('auction game has two balanced categories and a $20 two-player format', () => {
  const game = gamesData.find(g => g.id === 'son-teklif');
  assert.equal(game.engine, 'auction');
  assert.equal(game.minPlayers, 2);
  assert.equal(game.maxPlayers, 2);
  assert.equal(auctionCategories.animals.items.length, 6);
  assert.equal(auctionCategories.mythic.items.length, 6);
  for (const category of Object.values(auctionCategories)) {
    for (const item of category.items) assert.ok(item.power >= 3 && item.power <= 5);
  }
});
