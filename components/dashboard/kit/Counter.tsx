import Styles from './styles/Counter.module.scss';

const Counter = ({ value, onIncrement, onDecrement }) => {

  return (
    <ul className={Styles.productCounter}>
      {(() => {
        if (value <= 1) {
          return <li>-</li>
        } else {
          return <li onClick={() => {onDecrement()}}>-</li>
        }
      })()}
      <li>{value}</li>
      <li onClick={() => {onIncrement()}}>+</li>
    </ul>
  )
}

export default Counter