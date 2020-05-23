export const themes: {
  [key: string]: {
    [key: string]: string;
  };
} = {
  Random: {
    soft: '#f0f0f0',
    hard: '#d0d0d0',
    color: '#555555',
    contrast: '#222222'
  },
  Surf: {
    soft: '#f8f0e8',
    hard: '#ffcd6c',
    color: '#00709e',
    contrast: '#00223d',
    background: 'url("../seigaiha.png")'
  },
  Cyber: {
    soft: '#f6f4e4',
    hard: '#ffee00',
    color: '#1b7283',
    contrast: '#172126',
    background: 'url("../circuit.png")'
  },
  Bloom: {
    soft: '#f7f6ea',
    hard: '#dff28a',
    color: '#960954',
    contrast: '#2b191f',
    background: 'url("../symphony.png")'
  },
  Shed: {
    soft: '#faf1f0',
    hard: '#ffcfad',
    color: '#b34d00',
    contrast: '#2e1f0f',
    background: 'url("../leaves.jpg")'
  },
  Tartan: {
    soft: '#f9f3e7',
    hard: '#fcc97e',
    color: '#9b1403',
    contrast: '#361717',
    background: 'url("../vichy.png")'
  },
  Frost: {
    soft: '#f0f4fa',
    hard: '#b8e0ff',
    color: '#750dbf',
    contrast: '#1c172c',
    background: 'url("../escheresque.png")'
  },
  Synth: {
    soft: '#ffecff',
    hard: '#fc9eff',
    color: '#2e30e0',
    contrast: '#030a2f',
    background: 'url("../grid.jpg")'
  }
};

// const keys = ['soft', 'hard', 'color', 'contrast'];
// for (const themeId in themes) {
//   const ref = keys.map(x => themes[themeId][x].slice(1)).join('-');
//   console.log(`${themeId} - https://coolors.co/${ref}`);
// }

/* Reverse
var keys = ['soft', 'hard', 'color', 'contrast']; console.log(url.split('/')[3].split('-').map((x, i) => `    ${keys[i]}: '#${x}';`).join('\n'))
*/
