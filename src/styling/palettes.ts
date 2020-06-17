export const PALETTES: {[key: string]: PaletteType}  = {
  'palette-0': {
    name: 'palette-0',
    colors: ['#AC98FB', '#6E89F8', '#81BEFA', '#C1E0F8', '#D1C3EB']
  },
  'palette-1': {
    name: 'palette-1',
    colors: ['#EB4559', '#F78259', '#66E4D7', '#AEEFEC', '#EBCD86']
  },
  'palette-2': {
    name: 'palette-2',
    colors: ['#9A2B44', '#6369A1', '#7AB3E2', '#3A4464', '#252943']
  },
  'palette-3': {
    name: 'palette-3',
    colors: ['#F35B04', '#F18701', '#F7B801', '#7678ED', '#3D348B']
  }
};

export const THEMES: {[key: string]: ThemeType} = {
  dark: {
    name: 'dark',
    emptyColor: '#494848',
    textColor: '#ffffff',
    background: '#22232d'
  },
  light: {
    name: 'light',
    emptyColor: '#DCDCDC',
    textColor: '#494a4f',
    background: '#F6F6F6'
  }
};

export interface ThemeType {
  name: string;
  emptyColor: string;
  textColor: string;
  background: string;
}

export interface PaletteType {
  name: string;
  colors: string[];
}
