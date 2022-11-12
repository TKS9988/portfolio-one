import Styles from './ShowSalesData.module.scss';
import { DashBoardProduct, CircleData, DashBoardDetailOption, SetBooleanState, SelectNavBar } from '../../../../types/Types';
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-doughnut-innertext';
import { memo } from 'react';

type Props = {
    title: string;
    salesData: DashBoardProduct[];
    allData: DashBoardProduct[];
    data: CircleData;
    option: DashBoardDetailOption;
    setBooleanState:SetBooleanState;
    selectNavBar: SelectNavBar;
}

const ShowSalesData: React.FC<Props> = (props) => {
    const { title, salesData, data, option, allData, setBooleanState, selectNavBar } = props;
    const DisplayDetail = (props) => {
        const title = props.title;
        if (selectNavBar.todaySales === true) {
            if (title === 'Total') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showAllProduct: true }))
            } else if (title === 'Hamburger') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showHamburger: true }))
            } else if (title === 'SetMenu') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showSetMenu: true }))
            } else if (title === 'SideMenu') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showSideMenu: true }))
            } else if (title === 'Drink') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showDrink: true }))
            } else {
                return;
            }
        } else if (selectNavBar.monthSales === true) {
            if (title === 'Total') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showMonthAllProduct: true }))
            } else if (title === 'Hamburger') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showMonthHamburger: true }))
            } else if (title === 'SetMenu') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showMonthSetMenu: true }))
            } else if (title === 'SideMenu') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showMonthSideMenu: true }))
            } else if (title === 'Drink') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showMonthDrink: true }))
            } else {
                return;
            }
        } else {
            if (title === 'Total') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showSearchAllProduct: true }))
            } else if (title === 'Hamburger') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showSearchHamburger: true }))
            } else if (title === 'SetMenu') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showSearchSetMenu: true }))
            } else if (title === 'SideMenu') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showSearchSideMenu: true }))
            } else if (title === 'Drink') {
                setBooleanState((prevState) => ({ ...prevState, showAllSalesData: true, showSearchDrink: true }))
            } else {
                return;
            }
        }
    }
    return (
        <>
            {(() => {
                if (salesData.length > 0) {
                    return (
                        <div className={Styles.salesBxInner}>
                            <div className={Styles.salesGrid}>
                                <div className={Styles.SalesProductList}>
                                    <h3>{title}</h3>
                                    <ul>
                                        {salesData.map((list: DashBoardProduct, index: number) => (
                                            <li key={index}>
                                                <span className={Styles.ranking}>{index + 1}</span>&nbsp;{list.name}
                                                <span className={Styles.quantityBx}>{list.quantity}&nbsp;</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {allData.length > 5 ? <button className={Styles.moreBtn} onClick={() => DisplayDetail({title})}>more</button> : <></>}
                                </div>
                                <div className={Styles.SalesChart}>
                                    <Doughnut data={data} options={option} />
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (<></>);
                }
            })()}
        </>
    )
};
  
export default memo(ShowSalesData);