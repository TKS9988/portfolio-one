import React, { useState, useCallback, useEffect } from 'react';
import { db } from '../../../firebase/clientApp';
import Styles from '../Dashboard.module.scss'
import SearchIcon from '@mui/icons-material/Search';
import { DashboardLayout } from '../../../components/dashboard/dashboardLayout'
import { SearchSalesData } from '../../../components/dashboard/searchSalesData'
import { collection, getDocs, query } from "firebase/firestore";
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);
import { DashBoardProduct, CircleData, DashBoardDetailOption } from '../../../types/Types';
import { Doughnut } from 'react-chartjs-2';
import "chartjs-plugin-doughnut-innertext";
import { GetStaticProps } from 'next';

type Categories = {
  name: string;
  id: string;
}

type SearchSalesProduct = {
  name: string;
  quantity: number;
  category: string;
  price: number
}

type Props = {
  categories: Categories[];
  allProduct: DashBoardProduct[];
  monthAllProduct: DashBoardProduct[];
  searchSalesData: SearchSalesProduct[];
}

const Sales:React.FC<Props> = (props) => {
  const { categories, allProduct, monthAllProduct } = props;
  const [s_year, setS_year] = useState("");
  const [s_month, setS_month] = useState("");
  const [s_day, setS_day] = useState("");
  const inputYear = useCallback((event) => { setS_year(event.target.value) }, [setS_year]);
  const inputMonth = useCallback((event) => { setS_month(event.target.value) }, [setS_month]);
  const inputDay = useCallback((event) => { setS_day(event.target.value) }, [setS_day]);
  const totalSalesPrice: number = Object.keys(allProduct).reduce((sum, key) => sum + parseInt(allProduct[key].price || 0), 0);
  const monthTotalSalesPrice:number = Object.keys(monthAllProduct).reduce((sum, key) => sum + parseInt(monthAllProduct[key].price || 0),0);
  const CircleLabels = (props) => props.map((material) => material.name);
  const CircleDatasets = (props) => {
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

  const OptionsCenterText = (props: number) => {
    return {
      value: Math.round((props / totalSalesPrice) * 100) + '%',
      color: '#FA8800',
      fontSizeAdjust: -0.2,
    }
  }
  const monthOptionsCenterText = (props: number) => {
    return {
      value: Math.round((props / monthTotalSalesPrice) * 100) + '%',
      color: '#FA8800',
      fontSizeAdjust: -0.2,
    }
  }
  const OptionPlugin = () => {
    return {
      legend: {
        display: false,
      },
    }
  }

  const [monthSalesData, setMonthSalesData] = useState([]);
  const allMonthSortData: any[] = allProduct.slice(0, 5);
  const allMonthCircleData: CircleData = {
    labels: CircleLabels(allProduct),
    datasets: CircleDatasets(allProduct)
  };
  const allMonthTotalPrice:number = Object.keys(allProduct).reduce((sum, key) => sum + parseInt(allProduct[key].price || 0),0);
  const allMonthSalesDtaOption:DashBoardDetailOption = {
    centerText: OptionsCenterText(allMonthTotalPrice),
    plugins: OptionPlugin()
  };
  useEffect(() => {
    const monthData:any[] = [{name: 'All Sales', sortData: allMonthSortData, data: monthAllProduct, circleData: allMonthCircleData, options: allMonthSalesDtaOption}];
    for (let i = 0; i < categories.length; i++){
      let searchData:DashBoardProduct[] = monthAllProduct.filter(function (list) {
        return list.category === categories[i].name;
      });
      searchData.sort(function (a, b) {
        if (a.quantity > b.quantity) return -1;
        if (a.quantity < b.quantity) return 1;
        return 0;
      });
      const sortData: any[] = searchData.slice(0, 5);
      const circleData: CircleData = {
        labels: CircleLabels(searchData),
        datasets: CircleDatasets(searchData)
      };
      const totalPrice:number = Object.keys(searchData).reduce((sum, key) => sum + parseInt(searchData[key].price || 0),0);
      const option:DashBoardDetailOption = {
        centerText: monthOptionsCenterText(totalPrice),
        plugins: OptionPlugin()
      };
      monthData.push({
        name: categories[i].name.slice( 0, 1 ).toUpperCase() + categories[i].name.slice( 1 ),
        sortData: sortData,
        data: searchData,
        circleData: circleData,
        options: option
      });
    }
    setMonthSalesData(monthData);
  }, [])

  const [daySalesData, setDaySalesData] = useState([]);
  const allSortData: any[] = allProduct.slice(0, 5);
  const allCircleData: CircleData = {
    labels: CircleLabels(allProduct),
    datasets: CircleDatasets(allProduct)
  };
  const allTotalPrice:number = Object.keys(allProduct).reduce((sum, key) => sum + parseInt(allProduct[key].price || 0),0);
  const allSalesDtaOption:DashBoardDetailOption = {
    centerText: OptionsCenterText(allTotalPrice),
    plugins: OptionPlugin()
  };
  useEffect(() => {
    const dayData:any[] = [{name: 'All Sales', sortData: allSortData, data: allProduct, circleData: allCircleData, options: allSalesDtaOption}];
    for (let i = 0; i < categories.length; i++){
      let searchData:DashBoardProduct[] = allProduct.filter(function (list) {
        return list.category === categories[i].name;
      });
      searchData.sort(function (a, b) {
        if (a.quantity > b.quantity) return -1;
        if (a.quantity < b.quantity) return 1;
        return 0;
      });
      const sortData: any[] = searchData.slice(0, 5);
      const circleData: CircleData = {
        labels: CircleLabels(searchData),
        datasets: CircleDatasets(searchData)
      };
      const totalPrice:number = Object.keys(searchData).reduce((sum, key) => sum + parseInt(searchData[key].price || 0),0);
      const option:DashBoardDetailOption = {
        centerText: OptionsCenterText(totalPrice),
        plugins: OptionPlugin()
      };
      dayData.push({
        name: categories[i].name.slice( 0, 1 ).toUpperCase() + categories[i].name.slice( 1 ),
        sortData: sortData,
        data: searchData,
        circleData: circleData,
        options: option
      });
    }
    setDaySalesData(dayData);
  }, [])

  const [categoryName, setCategoryName] = useState<string>("");
  const [salesData, setSalesData] = useState<any[]>([]);

  const getSearchData = useCallback(async(s_year: string, s_month: string, s_day: string) => {
    let pattern = /^([1-9]\d*|0)$/;
    if (s_year === "" || s_month === "" || s_year.length < 4) {
      alert('「年」または「月」が未入力です。')
    }
    if (searchSales === true && (s_year !== "" && s_month !== "" && s_day !== "")) {
      if (pattern.test(s_year) !== true || pattern.test(s_month) !== true || pattern.test(s_day) !== true) {
        alert('半角数字で入力してください。')
      }
      try {
        const getSalesDataRef = query(collection(db, "sales", `${s_year}`, `${s_month}-${s_day}`));
        const querySnapshot = await getDocs(getSalesDataRef);
        const allProduct: SearchSalesProduct[] = [];
        querySnapshot.forEach(doc => {
          const data = { name: doc.data().name, quantity: doc.data().quantity, category: doc.data().category, price: (doc.data().price * doc.data().quantity) }
          allProduct.push(data);
        });
        setSalesData(allProduct)
        setShowSearchSalesData(true)
      } catch (error) {
        setErrorText(true)
      }
    } else if (searchSales === true && (s_year !== "" && s_month !== "" && s_day === "")) {
      if (pattern.test(s_year) !== true || pattern.test(s_month) !== true) {
        alert('半角数字で入力してください。')
      }
      try {
        const getSalesDataRef = query(collection(db, "sales", `${s_year}`, `${s_month}`));
        const querySnapshot = await getDocs(getSalesDataRef);
        const allProduct: SearchSalesProduct[] = [];
        querySnapshot.forEach(doc => {
          const data = { name: doc.data().name, quantity: doc.data().quantity, category: doc.data().category, price: (doc.data().price * doc.data().quantity) }
          allProduct.push(data);
        });
        setSalesData(allProduct)
        setShowSearchSalesData(true)
      } catch (error) {
        setErrorText(true)
      }
    } else {
      return
    }
  }, [s_year, s_month, s_day])

  const ShowSalesData = (props: any) => {
    const { title, salesData, circleData, options, categoryName } = props;
    if (salesData.length > 0) {
      return <div className={Styles.salesBxInner}>
      <div className={Styles.salesGrid}>
        <div className={Styles.SalesProductList}>
          <h3>{title}</h3>
          <ul>
            {salesData.map((list, index: number) => (
              <li key={index}><span className={Styles.ranking}>{index + 1}</span>&nbsp;{list.name}<span className={Styles.quantityBx}>{list.quantity}&nbsp;個</span></li>
            ))}
          </ul>
            {salesData.length > 5 ? <button className={Styles.moreBtn} onClick={() => { setShowAllSalesData(true); setCategoryName(categoryName);  setSalesData(salesData)}}>もっと見る</button> : <></>}
        </div>
        <div className={Styles.SalesChart}>
          <Doughnut data={circleData} options={options} />
          </div>
        </div>
      </div>
    } else {
      return <></>
    }
  }

  const ShowData = (props) => {
    const { categoryName, salesData } = props;
    return (
      <>
        <h3>{categoryName}</h3>
        <ul>
          {salesData.length > 0 && (
            salesData.map((list, index) => (
              <li key={index}><span className={Styles.ranking}>{index + 1}</span>&nbsp;{list.name}<span className={Styles.quantityBx}>{list.quantity}&nbsp;個</span></li>
            ))
          )}
        </ul>
        <button className={Styles.closeBtn} onClick={() => setShowAllSalesData(false)}>閉じる</button>
      </>
    )
  }

  const [showAllSalesData, setShowAllSalesData] = useState(false);
  const [choiceToday, setChoiceToday] = useState(true);
  const [choiceMonth, setChoiceMonth] = useState(false);
  const [choiceSearch, setChoiceSearch] = useState(false);
  const [todaySales, setTodaySales] = useState(true);
  const [monthSales, setMonthSales] = useState(false);
  const [searchSales, setSearchSales] = useState(false);
  const [errorText, setErrorText] = useState(false)
  const [showSearchSalesData, setShowSearchSalesData] = useState(false)

  return (
    <DashboardLayout>
      <div className={Styles.inner}>
        <h2>販売数</h2>
        <ul className={Styles.salesTabBtn}>
          <li className={choiceToday ? Styles.choiceToday : ""} onClick={() => { setTodaySales(true); setMonthSales(false); setSearchSales(false); setChoiceToday(true); setChoiceMonth(false); setChoiceSearch(false) }}>今日</li>
          <li className={choiceMonth ? Styles.choiceMonth : ""} onClick={() => { setTodaySales(false); setMonthSales(true); setSearchSales(false); setChoiceToday(false);setChoiceMonth(true);setChoiceSearch(false)}}>今月</li>
          <li className={choiceSearch ? Styles.choiceSearch : ""} onClick={() => { setTodaySales(false); setMonthSales(false); setSearchSales(true); setChoiceToday(false);setChoiceMonth(false);setChoiceSearch(true)}}>検索</li>
        </ul>
        <div className={Styles.salesList}>
          {(() => {
            if (todaySales === true) {
              return <div className={Styles.salesBx}>
                {daySalesData.length > 0 &&
                  daySalesData.map((list, index: number) => (
                    <ShowSalesData key={index} title={list.name} salesData={list.sortData} circleData={list.circleData} options={list.options} categoryName={list.name} />
                  ))
                } 
              </div>
            } else if (monthSales === true) {
              return <div className={Styles.salesBx}>
                {monthSalesData.length > 0 &&(
                  monthSalesData.map((list, index: number) => (
                    <ShowSalesData key={index} title={list.name} salesData={list.sortData} circleData={list.circleData} options={list.options} categoryName={list.name} />
                  ))
                )}
              </div>
            } else if (searchSales === true) {
              return <>
                <div className={Styles.searchBox}>
                  <div className={Styles.searchInputBx}>
                    <input value={s_year} onChange={inputYear} />&nbsp;年&nbsp;&nbsp;
                    <input value={s_month} onChange={inputMonth} />&nbsp;月&nbsp;&nbsp;
                    <input value={s_day} onChange={inputDay} />&nbsp;日&nbsp;&nbsp;
                    <SearchIcon onClick={() => getSearchData(s_year,s_month,s_day)} />
                  </div>
                </div>
                <div className={Styles.salesBx}>
                  {showSearchSalesData ? <SearchSalesData searchSalesProduct={salesData} categories={categories} setShowAllSalesData={setShowAllSalesData} /> : <></>}
                </div>
              </>
            } else {
              return <></>
            }
          })()}
        </div>
        {showAllSalesData ? <div className={Styles.showSaleDataBx}><div className={Styles.inner}><ShowData categoryName={categoryName} salesData={salesData} /></div></div> :<></> }
      </div>
    </DashboardLayout>
  )
}

export default Sales

export const getStaticProps:GetStaticProps = async() => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const lastDate:Date = new Date(year, month, 0);
  const days:number = Number(lastDate.getDate());
  const a5:number[] = Array(days);
  a5.fill(0);
  let categories = [];
  let allProduct = [];
  let monthAllProduct = [];

  const categoryRef = await getDocs(collection(db, "category"));
    categoryRef.forEach((doc) => {
      const data: Categories = {
        name: doc.data().name,
        id: doc.id
      };
      categories.push(data);
  });

  const allProductRef = await getDocs(collection(db, "sales", `${year}`, `${month}-${date}`));
  allProductRef.forEach((doc) => {
    const data: DashBoardProduct = {
      name: doc.data().name,
      quantity: doc.data().quantity,
      category: doc.data().category,
      price: doc.data().price * doc.data().quantity,
    };
    allProduct.push(data);
  });
    
  const monthAllProductRef = await getDocs(collection(db, "sales", `${year}`, `${month}`));
    monthAllProductRef.forEach((doc) => {
      const data: DashBoardProduct = {
        name: doc.data().name,
        quantity: doc.data().quantity,
        category: doc.data().category,
        price: doc.data().price * doc.data().quantity,
      };
    monthAllProduct.push(data);
  });

  allProduct.sort(function (a, b) {
    if (a.quantity > b.quantity) return -1;
    if (a.quantity < b.quantity) return 1;
    return 0;
  });

  monthAllProduct.sort(function (a, b) {
    if (a.quantity > b.quantity) return -1;
    if (a.quantity < b.quantity) return 1;
    return 0;
  });

  return {
    props: {
      categories,
      allProduct,
      monthAllProduct,
    },
  };
}