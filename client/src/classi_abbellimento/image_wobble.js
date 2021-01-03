import styles from './abbellimento.css'
import React from 'react'


const Image = () => {
    const [wobble, setWobble] = React.useState(0)
    return (
        <img
            className="image"
            src="./pizzasteve.png"
            alt="randomised!"
            onClick={() => setWobble(1)}
            onAnimationEnd={() => setWobble(0)}
            wobble={wobble}
        />
    )
}
export default Image
