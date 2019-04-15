import React from 'react';
import cardBack from '../assets/playing-card-back.png';
const Card = (props) => {
    let newClass = props.class + " empty"
    //if facedown, show back, else get image link
    let imagePath = props.facedown ? cardBack : props.imagePath;
    //no visual if taken out of play
    if ( props.matched ) { imagePath = "" }

    return( 
        //clicked unless nulled
        <div onClick={ props.matched ? null : props.clicked} className={newClass}>
        <img width="100" src={ imagePath } />
        </div>
    );
}

export default Card;
