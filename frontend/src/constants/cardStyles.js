// src/constants/cardStyles.js
//
// Named card style definitions. Cards reference these by name via `cardStyle: 'x'`.
// Definitions live here (shared); assignment lives on each card in its route config.
// Kept sparse/multiline on purpose so each style reads clearly and is easy to tune.

export const cardStyles = {

  // the standard select card (current coffeelog/adjustment look)
  default: {
    height: 320,
    width: 340,
    bg: '#2f2e2e',
    border: 'rgba(180, 140, 100, 0.5)',
  },

  // smaller card for dense menus (e.g. the 8-entity controls grid)
  compact: {
    height: 200,
    width: 220,
    bg: '#2f2e2e',
    border: 'rgba(180, 140, 100, 0.5)',
  },

  // wide banner-style card (borrowed from the homepage latest/daily bean look)
  wide: {
    height: 'fit-content',
    width: '70%',
    bg: '#2f2e2e',
    border: 'rgba(180, 140, 100, 0.5)',
  },

  // slim back-navigation card — intentionally rough for now, styled later
  back: {
    height: 'fit-content',
    width: 'fit-content',
    bg: '#262525',
    border: 'rgba(180, 140, 100, 0.35)',
  },

};

// fallback used when a card names a style that doesn't exist
export const DEFAULT_CARD_STYLE = 'default';