import { useState, useEffect } from 'react';
import Styles from './Dashboard.module.scss';
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);
import { Line, Doughnut } from 'react-chartjs-2';
import { db } from '../../firebase/clientApp';
import { DashboardLayout } from '../../components/dashboard/dashboardLayout';
import { collection, getDocs } from "firebase/firestore";
import "chartjs-plugin-doughnut-innertext";
import {DashBoardProduct, DoughnutCartOption, CircleData, DashBoardDetailOption, ShowInner, DashBoardRankingData } from '../../types/Types';
import { GetStaticProps } from 'next';

type Category = {
  id: string;
  name: string
}

type Props = {
  allProduct: DashBoardProduct[];
  byDayTotalPrice: number[];
  categories: Category[];
}
  
const Dashboard: React.FC<Props> = (props) => {
  const { allProduct, byDayTotalPrice, categories } = props;
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const lastDate:Date = new Date(year, month, 0);
  const days:number[] = [...Array(lastDate.getDate())].map((_, i) => ++i);

  const option:DoughnutCartOption = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const totalSalesPrice:number = Object.keys(allProduct).reduce(
    (sum, key) => sum + parseInt(allProduct[key].price || 0),
    0
  );

  const AllProductSalesDataSort:DashBoardProduct[] = allProduct.slice(0, 5);
  const rankingData:DashBoardRankingData = {
    labels: days,
    datasets: [
      {
        label: '今月の売り上げ',
        data: byDayTotalPrice,
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

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
  const OptionPlugin = () => {
    return {
      legend: {
        display: false,
      },
    }
  }

  const [showMoreList, setShowMoreList] = useState(false);
  const [showTitle, setShowTitle] = useState('');
  const [showInner, setShowInner] = useState<DashBoardProduct[]>([]);
  const handleClick = (name:string, sortData: DashBoardProduct[]) => {
    setShowMoreList(true);
    setShowTitle(name);
    setShowInner(sortData);
  };

  const ShowData = (props:any) => {
    const { showInner } = props;
    return (
      <>
        {showInner.length > 0 &&
          showInner.map((list:ShowInner, index:number) => (
            <li key={index} className={Styles.showMoreListBx}>
              <span className={Styles.ranking}>{index + 1}</span>&nbsp;{list.name}
              <span className={Styles.quantityBx}>{list.quantity}&nbsp;</span>
            </li>
          ))}
      </>
    );
  };

  const ShowCategoryData = (props: any) => {
    const { name, sortData, data, circleData, options } = props;
    return (
      <li>
      <span className={Styles.ovf}>
        <span className={Styles.left}>
            <h4>{name}</h4>
          {(() => {
            if (sortData.length === 0) {
              return <p className={Styles.noneData}>データがありません。</p>;
            } else {
              return (
                <span className={Styles.productBx}>
                  {sortData.length > 0 &&
                    sortData.map((list:{name:string,quantity:number}, index:number) => (
                      <p key={index}>
                        <span className={Styles.colorBx}></span>&nbsp;{list.name}
                        <span className={Styles.quantityBx}>{list.quantity}&nbsp;</span>
                      </p>
                    ))}
                   {(() => {
                     if (data.length > 5) {
                       return (
                         <p className={Styles.moreBtn} onClick={() => handleClick(name, sortData)}>more</p>
                       );
                     } else {
                       return <></>;
                     }
                   })()}      
                </span>
              );
            }
          })()}
        </span>
        <span className={Styles.right}>
          <Doughnut data={circleData} options={options} />
        </span>
      </span>
    </li>
    )
  }

  const [monthSalesData, setMonthSalesData] = useState([]);
  useEffect(() => {
    const monthData = [];
    for (let i = 0; i < categories.length; i++){
      let searchData:DashBoardProduct[] = allProduct.filter(function (list) {
        return list.category === categories[i].name;
      });
      searchData.sort(function (a, b) {
        if (a.quantity > b.quantity) return -1;
        if (a.quantity < b.quantity) return 1;
        return 0;
      });
      const sortData: DashBoardProduct[] = searchData.slice(0, 5);
      const circleData: CircleData = {
        labels: CircleLabels(searchData),
        datasets: CircleDatasets(searchData)
      };
      const totalPrice:number = Object.keys(searchData).reduce(
        (sum, key) => sum + parseInt(searchData[key].price || 0),
        0
      );
      const option:DashBoardDetailOption = {
        centerText: OptionsCenterText(totalPrice),
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
  const sortData = allProduct;
  const name = '今月の人気商品';

  return (
    <DashboardLayout>
      <div className={Styles.inner}>
        <h2>Dashboard</h2>
        <div className={Styles.saleCart}>
          <div className={Styles.borderChart}>
            <Line data={rankingData} options={option} />
          </div>
          <div className={Styles.AllDataCart}>
            <div className={Styles.totalSales}>
              <h3>
                <span className={Styles.monthTotalSales}>今月の総売上げ</span><span className={Styles.priceBx}>￥<span className={Styles.totalSalesPrice}>{totalSalesPrice.toLocaleString()}</span></span>
              </h3>
            </div>
            <h3>今月の人気商品</h3>
            <ul>
              {(() => {
                if (AllProductSalesDataSort.length === 0) {
                  return <p className={Styles.noneData}>データがありません。</p>;
                } else {
                  return (
                    <>
                      {AllProductSalesDataSort.length > 0 &&
                        AllProductSalesDataSort.map((list, index) => (
                          <li key={index}>
                            <span className={Styles.ranking}>{index + 1}</span>&nbsp;{list.name}<span className={Styles.quantityBx}>{list.quantity}&nbsp;個</span>
                          </li>
                        ))}
                    </>
                  );
                }
              })()}
            </ul>
            {(() => {
              if (allProduct.length > 5) {
                return (
                  <p className={Styles.moreBtn} onClick={() => handleClick(name, sortData)}>もっと見る</p>
                );
              } else {
                return <></>;
              }
            })()}
          </div>
        </div>
        <ul className={Styles.chartBx}>
          {monthSalesData.length > 0 &&
            monthSalesData.map((list, index: number) => (
              <ShowCategoryData key={index} name={list.name} sortData={list.sortData} data={list.data} circleData={list.circleData} options={list.options} />
          ))} 
        </ul>
      </div>
      {showMoreList ? (
        <div className={Styles.showMoreList}>
          <div className={Styles.showMoreListInner}>
            <h2>{showTitle}</h2>
            <ul>
              <ShowData showInner={showInner} />
            </ul>
            <div className={Styles.closeBtn} onClick={() => { setShowMoreList(false); setShowTitle(''); setShowInner([])}}>閉じる</div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;

export const getStaticProps:GetStaticProps = async () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const lastDate:Date = new Date(year, month, -1);
  const days:number = Number(lastDate.getDate());
  let a5:number[] = Array(days + 1);
  a5.fill(0);
  let categories = [];
  let allProduct:DashBoardProduct[] = [];
  let byDayTotalPrice:number[] = a5;

  const categoryRef = await getDocs(collection(db, "category"));
  categoryRef.forEach((doc) => {
    const id: string = doc.id;
    const name: string = doc.data().name;
    categories.push({id: id, name: name});
  });

  const byDayTotalPriceRef = await getDocs(collection(db, "monthTotalPrice", `${year}`, `${month}`));
  byDayTotalPriceRef.docs.map((doc) => {
    const data = doc.data().price;
    byDayTotalPrice[doc.id] = (data);
  });

  const allProductRef = await getDocs(collection(db, "sales", `${year}`, `${month}`));
  allProductRef.docs.map((doc) => {
    const data = { name: doc.data().name, quantity: doc.data().quantity, category: doc.data().category, price: (doc.data().price * doc.data().quantity) }
    allProduct.push(data);
  });

  
  return {
    props: {
      categories,
      allProduct,
      byDayTotalPrice,
    },
  };
}

