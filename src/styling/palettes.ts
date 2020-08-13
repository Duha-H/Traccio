export const PALETTES: {[key: string]: PaletteType}  = {
  'palette-0': {
    id: 'palette-0',
    name: 'Cosmos',
    colors: ['#AC98FB', '#6E89F8', '#81BEFA', '#ACE3EA',  '#C1E0F8', '#D1C3EB']
  },
  'palette-1': {
    id: 'palette-1',
    name: 'Superbubbles',
    colors: ['#EB4559', '#F78259', '#66E4D7', '#AEEFEC', '#EBCD86', '#F7B801']
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
    emptyColor: '#494848', // #22232D #262732
    textColor: '#ffffff',
    background: '#262732',
    transparent: '#00000000',
  },
  light: {
    name: 'light',
    emptyColor: '#DCDCDC',
    textColor: '#494a4f',
    background: '#FCFCFC',
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
