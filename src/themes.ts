export const themes: {
  [key: string]: {
    [key: string]: string;
  };
} = {
  Random: {},
  Surf: {
    keybg: '#ffcd6c',
    keyfg: 'var(--backlightbg)',
    rimbg: '#00709e',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f8f0e8',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#00223d',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff88',
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
    overlaybg: '#ffffff88',
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
    overlaybg: '#ffffff88',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../symphony.png")'
  },
  Shed: {
    keybg: '#ffcfad',
    keyfg: 'var(--backlightbg)',
    rimbg: '#b34d00',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#faf1f0',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#2e1f0f',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff88',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../leaves.jpg")'
  },
  Tartan: {
    keybg: '#fcc97e',
    keyfg: 'var(--backlightbg)',
    rimbg: '#9b1403',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f9f3e7',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#361717',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff88',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../vichy.png")'
  },
  Frost: {
    keybg: '#b8e0ff',
    keyfg: 'var(--backlightbg)',
    rimbg: '#750dbf',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#f0f4fa',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#1c172c',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff88',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../escheresque.png")'
  },
  Synth: {
    keybg: '#fc9eff',
    keyfg: 'var(--backlightbg)',
    rimbg: '#2e30e0',
    rimfg: 'var(--highlightbg)',
    highlightbg: '#ffecff',
    highlightfg: 'var(--backlightbg)',
    backlightbg: '#030a2f',
    backlightfg: 'var(--highlightbg)',
    overlaybg: '#ffffff88',
    overlayfg: 'var(--backlightbg)',
    background: 'url("../grid.jpg")'
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
  //   overlaybg: '#00000088',
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
