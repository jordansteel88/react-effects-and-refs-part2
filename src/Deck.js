import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import './Deck.css';
import axios from 'axios';

const BASE_URL = "https://deckofcardsapi.com/api/deck";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [currCard, setCurrCard] = useState(null);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);
  
  useEffect(() => {
    const shuffleDeck = async () => {
      let newDeck = await axios.get(`${BASE_URL}/new/shuffle`);
      setDeck(newDeck.data);
    }
    shuffleDeck();
  }, [setDeck]);

  useEffect(() => {
    const drawCard = async () => {
      let { deck_id } = deck;

      try{
        let res = await axios.get(`${BASE_URL}/${deck_id}/draw/`);

        // console.log(`remaining: ${res.data.remaining}`);
        // console.log(`deck_id: ${res.data.deck_id}`);
        console.log(`timerRef.current: ${timerRef.current}`);


        if(res.data.remaining === 0) {
          setAutoDraw(false)
          throw new Error('no cards remaining!')
        }

        setCurrCard(res.data.cards[0]);
        console.log(currCard);

      } catch (err) {
        alert(err);
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await drawCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck, currCard])

  const toggleAutoDraw = () => {
    setAutoDraw(t => !t);
  }

  return (
    <div>

      <button onClick={toggleAutoDraw}>
        {autoDraw ? 'Stop Drawing' : 'Start Drawing' }
      </button>       

      {currCard ? 
        (<div>
          <Card
            key={currCard.code}
            name={currCard.value + 'of' + currCard.suit}
            image={currCard.image}
          />
        </div>) 
      : null}

    </div>
  );
}

export default Deck;