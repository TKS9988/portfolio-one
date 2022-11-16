import { memo, useEffect,useState } from 'react';
import { DashBoardProduct, DataSet, BooleanState, SetBooleanState} from '../../../../types/Types';
import Styles from './Detail.module.scss';

type Props = {
  dataSet: DataSet;
  booleanState: BooleanState;
  setBooleanState: SetBooleanState;
}

const Detail: React.FC<Props> = (props) => {
  const { dataSet, booleanState, setBooleanState } = props;
  const SalesList = (props: any) => {
        const list: DashBoardProduct = props.list;
        const index: number = props.index;
        return (
            <li className={Styles.rankingLst}>
                <span className={Styles.ranking}>{index}</span>&nbsp;{list.name}
                <span className={Styles.quantityBx}>{list.quantity}&nbsp;</span>
            </li>
        )
  }

  const [data, setData] = useState([]);
  useEffect(() => {
    let result = [];
    for (let [key, value] of Object.entries(booleanState)) {
      if (value) {
        result.push(key);
      }
    }
    let removals = ['showAllSalesData'];
    result = result.filter(function (v) {
      return !removals.includes(v);
    });
    const sourceStr = result[0];
    const dataName = sourceStr.replace(/show/g, '').slice(0, 1).toLowerCase() + sourceStr.replace(/show/g, '').slice(1);
    const filteredusers = dataSet.filter(data => data.name === dataName)
    setData(filteredusers[0].data)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booleanState]);

  const closeBtn = () => {
    setBooleanState((prevState) => ({
      ...prevState,
      showAllSalesData: false,
      showAllProduct: false,
      showHamburger: false,
      showCombo: false,
      showSideMenu: false,
      showMonthAllProduct: false,
      showMonthHamburger: false,
      showMonthCombo: false,
      showMonthSideMenu: false,
      showMonthDrink: false,
      showSearchAllProduct: false,
      showSearchHamburger: false,
      showSearchCombo: false,
      showSearchSideMenu: false,
      showSearchDrink: false
    }));
  }
  
    return (
        <div className={Styles.showSaleDataBx}>
            <div className={Styles.inner}>
                {(() => {
                    if (booleanState.showAllProduct === true || booleanState.showMonthAllProduct === true || booleanState.showSearchAllProduct === true) {
                        return <h3>Total</h3>;
                    } else if (booleanState.showHamburger === true || booleanState.showMonthHamburger === true || booleanState.showSearchHamburger === true) {
                        return <h3>Hamburger</h3>;
                    } else if (booleanState.showCombo === true || booleanState.showMonthCombo === true || booleanState.showSearchCombo === true) {
                        return <h3>Combo</h3>;
                    } else if (booleanState.showSideMenu === true || booleanState.showMonthSideMenu === true || booleanState.showSearchSideMenu === true) {
                        return <h3>SideMenu</h3>;
                    } else if (booleanState.showDrink === true || booleanState.showMonthDrink === true || booleanState.showSearchDrink === true) {
                        return <h3>Drink</h3>;
                    } else {
                        return <></>;
                    }
                })()}
                  
          <ul>
            {data.map((list: DashBoardProduct, index: number) => (
              <SalesList key={index} index={index + 1} list={list} />
            ))}
          </ul>
          <button
            className={Styles.closeBtn}
            onClick={closeBtn}
          >
            close
          </button>
        </div>
      </div>
  );
};
export default memo(Detail);
