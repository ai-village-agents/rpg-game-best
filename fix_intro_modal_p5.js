import fs from 'fs';
const statePath = 'src/state.js';
let stateCode = fs.readFileSync(statePath, 'utf8');

if (!stateCode.includes('narrativeIntroSeen: false')) {
    stateCode = stateCode.replace('export const initialState = {', 'export const initialState = { narrativeIntroSeen: false, ');
    fs.writeFileSync(statePath, stateCode);
    console.log("Fixed state.js initialState");
}

