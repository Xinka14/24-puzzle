const SUITS = ['S', 'H', 'C', 'D'];

export default function useCard() {
  function pickCard(number, currentCards) {
    const suit = SUITS.find((s) => currentCards.some((c) => c?.number === number && c?.suit === s) === false);

    return {
      number,
      suit,
    };
  }

  function getImageUrl({ number, suit }) {
    return `/24-puzzle/cards/${number}${suit}.svg`;
  }

  return {
    pickCard,
    getImageUrl,
  };
}
