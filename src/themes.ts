export const themes: {
  [key: string]: {
    [key: string]: string;
  };
} = {
  Random: {
    keybg: '#aaaaaa',
    rimbg: '#555555',
    highlightbg: '#eeeeee',
    backlightbg: '#222222'
  },
  Surf: {
    keybg: '#ffcd6c',
    keyfg: 'var(--backlightbg)',
    rimbg: '#00709e',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f8f0e8',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#00223d',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../seigaiha.png")'
  },
  Cyber: {
    keybg: '#ffee00',
    keyfg: 'var(--backlightbg)',
    rimbg: '#1b7283',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f6f4e4',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#172126',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../circuit.png")'
  },
  Bloom: {
    keybg: '#dff28a',
    keyfg: 'var(--backlightbg)',
    rimbg: '#960954',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f7f6ea',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#2b191f',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../symphony.png")'
  },
  Shed: {
    keybg: '#ebd6c6',
    keyfg: 'var(--backlightbg)',
    rimbg: '#b77733',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f7f7ee',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#3b2e2a',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../leaves.jpg")'
  },
  Tartan: {
    keybg: '#ffc673',
    keyfg: 'var(--backlightbg)',
    rimbg: '#af2a01',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f9f3e7',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#361717',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../vichy.png")'
  },
  Abyss: {
    keybg: '#c1e9fc',
    keyfg: 'var(--backlightbg)',
    rimbg: '#3e2acd',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f0f4fa',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#221c4a',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../escheresque.png")'
  },
  Synth: {
    keybg: '#b9d5ff',
    keyfg: 'var(--backlightbg)',
    rimbg: '#da007b',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f6f3fe',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#31014c',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../grid.jpg")'
  },
  Skies: {
    keybg: '#eff6ff',
    keyfg: '#000000',
    rimbg: '#1762c2',
    rimfg: 'var(--keybg)',
    highlightbg: '#dcecff',
    highlightfg: 'var(--keyfg)',
    backlightbg: '#b1d2ff',
    backlightfg: 'var(--keyfg)',
    overlaybg: '#d4e7ff',
    overlayfg: 'var(--keyfg)',
    background: 'url("../escheresque.png")'
  }
  // Night: {
  //   keybg: '#1e2f4a',
  //   keyfg: '#eeeeee',
  //   rimbg: '#116bbb',
  //   rimfg: '#eeeeee',
  //   highlightbg: '#1b1b1b',
  //   highlightfg: '#eeeeee',
  //   backlightbg: '#111111',
  //   backlightfg: '#cccccc',
  //   overlaybg: '#000000',
  //   overlayfg: '#eeeeee',
  //   background: 'none'
  // }
};

// const keys = ['highlightbg', 'keybg', 'rimbg', 'backlightbg'];
// for (const themeId in themes) {
//   const ref = keys.map(x => themes[themeId][x].slice(1)).join('-');
//   console.log(`${themeId} - https://coolors.co/${ref}`);
// }

/* Reverse
var keys = ['highlightbg', 'keybg', 'rimbg', 'backlightbg']; console.log(url.split('/')[3].split('-').map((x, i) => `    ${keys[i]}: '#${x}';`).join('\n'))
*/
