import Styles from './Counter.module.scss';
import { COUNTER } from "../../types/Types";

type Props = {
  value: number;
  onIncrement: any;
  onDecrement: any;
}

const Counter:React.FC<Props> = ({ value, onIncrement, onDecrement }) => {
  return (
    <ul className={Styles.productCounter}>
      {(() => {
        if (value <= 1) {
          return <li>-</li>;
        } else {
          return (
            <li
              onClick={() => {
                onDecrement();
              }}
            >
              -
            </li>
          );
        }
      })()}
      <li>{value}</li>
      <li
        onClick={() => {
          onIncrement();
        }}
      >
        +
      </li>
    </ul>
  );
};

export default Counter;
