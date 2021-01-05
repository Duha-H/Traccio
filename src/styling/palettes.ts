export const PALETTES: {[key: string]: PaletteType}  = {
  'palette-0': {
    id: 'palette-0',
    name: 'Cosmos',
    colors: ['#AC98FB', '#6E89F8', '#81BEFA', '#ACE3EA',  '#C1E0F8', '#D1C3EB']
  },
  'palette-1': {
    id: 'palette-1',
    name: 'Superbubbles',
    colors: ['#EB4559', '#F78259', '#F7B801', '#EBCD86', '#AEEFEC', '#66E4D7']
  },
  'palette-2': {
    id: 'palette-2',
    name: 'Shockwave',
    colors: ['#9A2B44', '#6369A1', '#C5B4ED', '#7AB3E2', '#3A4464', '#252943']
  },
  'palette-3': {
    id: 'palette-3',
    name: 'Dave',
    colors: ['#F35B04', '#F18701', '#F7B801', '#81BEFA', '#7678ED', '#3D348B']
  }
};

export const THEMES: {[key: string]: ThemeType} = {
  dark: {
    name: 'dark',
    emptyColor: '#4d545e78', // #22232D #262732
    textColor: '#ffffff',
    background: '#121217',
    transparent: '#00000000',
  },
  light: {
    name: 'light',
    emptyColor: '#f0f0f0',
    textColor: '#494a4f',
    background: '#F7F7F7',
    transparent: '#00000000',
  }
};

export interface ThemeType {
  name: string;
  emptyColor: string;
  textColor: string;
  background: string;
  transparent?: string;
}

export interface PaletteType {
  id: string;
  name: string;
  colors: string[];
}
