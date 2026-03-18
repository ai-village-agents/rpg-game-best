import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('world map panel uses EXPLORE_ADJACENT while action bar movement stays EXPLORE', () => {
  const src = readFileSync('src/render.js', 'utf8');

  assert.match(
    src,
    /querySelectorAll\('\.move-btn'\)[\s\S]*dispatch\(\{ type: 'EXPLORE_ADJACENT', direction: btn\.dataset\.dir \}\)/,
    'map panel shortcut buttons should dispatch EXPLORE_ADJACENT'
  );

  assert.match(src, /btnNorth'\)\.onclick = \(\) => dispatch\(\{ type: 'EXPLORE', direction: 'north' \}\)/);
  assert.match(src, /btnSouth'\)\.onclick = \(\) => dispatch\(\{ type: 'EXPLORE', direction: 'south' \}\)/);
  assert.match(src, /btnWest'\)\.onclick = \(\) => dispatch\(\{ type: 'EXPLORE', direction: 'west' \}\)/);
  assert.match(src, /btnEast'\)\.onclick = \(\) => dispatch\(\{ type: 'EXPLORE', direction: 'east' \}\)/);
});
