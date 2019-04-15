import React, { Component } from 'react';
import Card from './components/Card';
import './App.css';

class App extends Component {

  state = {
    deckOfCards: [],
    lastClickedValue: null,
    lastClickedCard: null,
    blockclick: false
  }

  componentDidMount = () => {
    //Get a deck from API, unpack, and set up
    fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
    .then(res => res.json())
    .then(json => this.setUp( json.cards ));  
  }

  setUp = (cards) => {
    //put array in state, add variables not provided from api
    let array = [ ...cards ];
    array.forEach(function(e) { 
      e.facedown = true; 
      e.matched = false;
    });
    this.setState({ deckOfCards: array})
  }

  onCardClicked = ( event ) => {
    //null clicking the same card twice, or clicking cards out of play
    if ( event === this.state.lastClickedCard || this.state.blockclick ) { return }

    let currentCard = event;
    let prevCardClicked = this.state.lastClickedCard;
    let array = [ ...this.state.deckOfCards ];
    let card = { ...this.state.deckOfCards[currentCard] };

    if ( this.state.lastClickedValue === card.value  ) {
      //match
      card.facedown = false;
      array[currentCard] = card;
      this.setState({ deckOfCards: array, blockclick: true })
      this.matchDetected(currentCard, prevCardClicked, array )
    }
    else if ((this.state.lastClickedValue !== null ) 
&& ( this.state.lastClickedValue !== card.value )) {
      //not match
      card.facedown = false;
      array[currentCard] = card;
      this.setState({ deckOfCards: array, blockclick: true })
      //delay so you can see the cards
      setTimeout( this.noMatchDetected, 600, currentCard, prevCardClicked, array )
    }
    else { //first card clicked
      card.facedown = false;
      array[currentCard] = card;
      this.setState({ lastClickedValue: card.value,
         lastClickedCard: event,
         deckOfCards: array,
         blockclick: false })
    }
  }

  matchDetected = ( currentCard, prevCard, array ) => {
    let newCard = { ...array[currentCard] };
    let lastCard = { ...array[prevCard] };
    newCard.matched = true;
    array[currentCard] = newCard;
    if ( prevCard !== -1 ) {
      lastCard.matched = true;
      array[prevCard] = lastCard;
    }
    this.setState({ lastClickedValue: null,
       lastClickedCard: null,
       deckOfCards: array,
       blockclick: false })
  }

  noMatchDetected = ( currentCard, prevCard, array ) => {
      let newCard = { ...array[currentCard] };
      let lastCard = { ...array[prevCard] };
    
      newCard.matched = false;
      newCard.facedown = true;
      array[currentCard] = newCard;
      
      if ( this.state.lastClickedCard !== null ) {
        lastCard.matched = false;
        lastCard.facedown = true;
        array[prevCard] = lastCard;
      }

      this.setState({ lastClickedValue: null, 
        lastClickedCard: null, 
        deckOfCards: array, 
        blockclick: false })
  }

  render() {

    let cardField = '';
      cardField = this.state.deckOfCards.map(( card , currentCard ) => {
        return (
          <Card key={currentCard}
            class='col-1'
            imagePath={card.image}
            matched={card.matched}
            facedown={card.facedown}
            clicked={(e) => this.onCardClicked(currentCard, e) } />
        )
      });
    return (
     
        <div>
          {cardField}
        </div>
    
    );
  }
}

export default App;
