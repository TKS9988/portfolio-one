import { ShowSalesData } from '../showSalesData';
import { DashBoardProduct,DashBoardDetailOption,CircleData, SelectNavBar, SetSelectNavBar, BooleanState, SetBooleanState } from '../../../../types/Types';
import Styles from './SalesView.module.scss';
import { useEffect, useState, memo } from 'react';
type Props = {
  allProduct?: DashBoardProduct[];
  hamburger?: DashBoardProduct[];
  combo?: DashBoardProduct[];
  sideMenu?: DashBoardProduct[];
  drink?: DashBoardProduct[];
  monthAllProduct?: DashBoardProduct[];
  monthHamburger?: DashBoardProduct[];
  monthCombo?: DashBoardProduct[];
  monthSideMenu?: DashBoardProduct[];
  monthDrink?: DashBoardProduct[];
  searchAllProduct?: DashBoardProduct[];
  searchHamburger?: DashBoardProduct[];
  searchCombo?: DashBoardProduct[];
  searchSideMenu?: DashBoardProduct[];
  searchDrink?: DashBoardProduct[];
  selectNavBar?: SelectNavBar;
  setSelectNavBar?: SetSelectNavBar;
  booleanState?: BooleanState;
  setBooleanState?: SetBooleanState;
}
type DataSets = {
  name: string;
  data: DashBoardProduct[];
}

type ShowData = {
  title: string;
  salesData: DashBoardProduct[];
  allData: DashBoardProduct[];
  data: CircleData;
  option: DashBoardDetailOption;
  booleanState: BooleanState;
  setBooleanState: SetBooleanState;
}

const SalesView: React.FC<Props> = (props) => {
  const { allProduct, hamburger, combo, sideMenu, drink, monthAllProduct, monthHamburger, monthCombo, monthSideMenu, monthDrink, searchAllProduct, searchHamburger, searchCombo, searchSideMenu, searchDrink, setBooleanState, booleanState, selectNavBar } = props;
  const categories = [
    { name: 'Total', todayData: allProduct, monthData: monthAllProduct, searchData: searchAllProduct},
    { name: 'Hamburger', todayData: hamburger, monthData: monthHamburger, searchData: searchHamburger},
    { name: 'Combo', todayData: combo, monthData: monthCombo, searchData: searchCombo},
    { name: 'SideMenu', todayData: sideMenu, monthData: monthSideMenu, searchData: searchSideMenu},
    { name: 'Drink', todayData: drink, monthData: monthDrink, searchData: searchDrink},
  ]

  const CircleLabels = (props:any) => props.map((material:any) => material.name);
  const CircleDatasets = (props:any) => {
    return [
      {
        label: 'Dataset',
        data: props.map((material) => material.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      },
    ]
  }

  const productData = selectNavBar.todaySales === true ? allProduct : selectNavBar.monthSales === true ? monthAllProduct : searchAllProduct;
  const totalPrice: number = Object.keys(productData).reduce(
    (sum, key) => sum + parseInt(productData[key].price || 0),
    0
  );

  const [showData, setShowData] = useState<ShowData[]>([]);
  const makeShowData = (dataSets:DataSets[]) => {
    const data: any[] = [];
    for (let i = 0; i < dataSets.length; i++){
      const title:string = dataSets[i].name;
      const categoryTotalPrice:number = Object.keys(dataSets[i].data).reduce(
        (sum, key) => sum + parseInt(dataSets[i].data[key].price || 0),
        0
      );
      const salesDataSort: DashBoardProduct[] = dataSets[i].data.slice(0, 5);
      salesDataSort.sort((a, b) => b.quantity - a.quantity);
      const optionPrice: string = (i === 0) ? '100%' : Math.round((categoryTotalPrice / totalPrice) * 100) + '%';
      const option:DashBoardDetailOption = {
        centerText: {
          value: optionPrice,
          color: '#FA8800',
          fontSizeAdjust: -0.2,
        },
        plugins: {legend: {display: false,},}
      };
      const circleData = {
        labels: CircleLabels(dataSets[i].data),
        datasets: CircleDatasets(dataSets[i].data)
      }
      data.push({ 'title': title, 'salesData': salesDataSort, 'allData': dataSets[i].data, 'data': circleData, 'option': option});
      if (i === dataSets.length - 1) {
        setShowData(data);
        return;
      }
    }
  }

  useEffect(() => {
    const data: any[] = [];
    for (let i = 0; i < categories.length; i++) {
      data.push({ name: categories[i].name, data: (selectNavBar.todaySales === true ? categories[i].todayData : selectNavBar.monthSales === true ? categories[i].monthData : searchAllProduct) });
      if (i === categories.length - 1) {
        makeShowData(data)
        return;
      }
    }
  }, [selectNavBar, categories[0].searchData]);

    return (
      <div className={Styles.salesBx}>
        {showData.length > 0 &&
          showData.map((list, index: number) => (
            <ShowSalesData
              key={index} title={list.title} salesData={list.salesData} allData={list.allData} data={list.data} option={list.option} setBooleanState={setBooleanState} selectNavBar={selectNavBar}/>
          ))}
      </div>
  );
};
export default memo(SalesView);
