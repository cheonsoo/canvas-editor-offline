import { useCallback, useState, useEffect } from 'react'
import update from 'immutability-helper'
import { Layer } from './Layer.js'
const style = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  overflow: 'auto'
}
export const Container = ({ data = [], handler = () => {} }) => {
  {
    const [cards, setCards] = useState(data);

    useEffect(() => {
      setCards(data);
    }, [data]);

    useEffect(() => {
      handler(cards);
    }, [cards]);

    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),
      )

      // handler();
    }, []);

    const renderCard = useCallback((card, index) => {
      return (
        <Layer
          key={index}
          index={index}
          id={index}
          item={card}
          moveCard={moveCard}
        />
      )
    }, []);

    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  }
}
