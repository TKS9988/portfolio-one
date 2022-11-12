import React, { useEffect, useState } from 'react';
import Styles from '../../../pages/dashboard/Dashboard.module.scss';
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-doughnut-innertext';

type SearchSalesProduct = {
    name: string;
    quantity: number;
    category: string;
    price: number
}

type Categories = {
    name: string;
    id: string;
  }
  
type Props = {
    searchSalesProduct: SearchSalesProduct[];
    categories: Categories[];
    setShowAllSalesData: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchSalesData:React.FC<Props> = (props) => {
    const {searchSalesProduct, categories, setShowAllSalesData} = props;
    const [showData, setShowData] = useState([])

  const searchTotalPrice = Object.keys(searchSalesProduct).reduce(
    (sum, key) => sum + parseInt(searchSalesProduct[key].price || 0),
    0
    );
    
    searchSalesProduct.sort(function (a, b) {
        if (a.quantity > b.quantity) return -1;
        if (a.quantity < b.quantity) return 1;
          return 0;
      });

  const searchAllProductSalesDataSort = searchSalesProduct.slice(0, 5);
  const allSalesSort = searchSalesProduct.slice(0, 5);
  const searchAllProductOption = {
    centerText: {
      value: '100%',
      color: '#FA8800',
      fontSizeAdjust: -0.2,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const searchCircleAllProductData = {
    labels: searchAllProductSalesDataSort.map((material) => material.name),
    datasets: [
      {
        label: 'Dataset',
        data: searchAllProductSalesDataSort.map((material) => material.quantity),
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
    ],
    };

    useEffect(() => {
        const data = [{ 'categoryName': 'All Sales', 'salesData': allSalesSort, 'totalPrice': searchTotalPrice, 'ratio': '100%', 'sort': searchSalesProduct, 'option': searchAllProductOption, 'circleData': searchCircleAllProductData}]
        for (let i = 0; i < categories.length; i++){
            let salesData = searchSalesProduct.filter(function (list) {
                return list.category === categories[i].name;
            });
            salesData.sort(function (a, b) {
              if (a.quantity > b.quantity) return -1;
              if (a.quantity < b.quantity) return 1;
                return 0;
            });
            const categoryName = categories[i].name;
            const totalPrice = Object.keys(salesData).reduce((sum, key) => sum + parseInt(salesData[key].price || 0), 0);
            const ratio = Math.round((totalPrice / searchTotalPrice) * 100) + '%';
            const sort = salesData.slice(0, 5);
            const option = {
                centerText: {
                  value: ratio,
                  color: '#FA8800',
                  fontSizeAdjust: -0.2,
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
            };
            const circleData = {
                labels: salesData.map((material) => material.name),
                datasets: [
                  {
                    label: 'Dataset',
                    data: salesData.map((material) => material.quantity),
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
                ],
            };
            data.push({ 'categoryName': categoryName, 'salesData': salesData, 'totalPrice': totalPrice, 'ratio': ratio, 'sort': sort, 'option': option, 'circleData': circleData})
        }
        setShowData(data)
    },[])
    
    const ShowSalesData = ((props) => {
        const { title, salesData, data, option, onClick } = props;
        if (salesData.length > 0) {
          return (
            <div className={Styles.salesBxInner}>
              <div className={Styles.salesGrid}>
                <div className={Styles.SalesProductList}>
                  <h3>{title}</h3>
                  <ul>
                    {salesData.map((list, index) => (
                      <li key={index}>
                        <span className={Styles.ranking}>{index + 1}</span>&nbsp;{list.name}
                        <span className={Styles.quantityBx}>{list.quantity}&nbsp;個</span>
                      </li>
                    ))}
                  </ul>
                  {salesData.length > 3 ? (
                    <button className={Styles.moreBtn} onClick={onClick}>
                      もっと見る
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <div className={Styles.SalesChart}>
                  <Doughnut data={data} options={option} />
                </div>
              </div>
            </div>
          );
        } else {
          return <></>;
        }
      });


  return (
    <>
      {(() => {
        if (searchSalesProduct) {
          return (
              <>
                  {showData.length > 0 && (
                      showData.map((list, index) => (
                          <ShowSalesData
                              key={index}
                              title={list.categoryName}
                              salesData={list.salesData}
                              data={list.circleData}
                              option={list.option}
                              onClick={() => setShowAllSalesData(true)}
                          />
                      ))
                  )}
            </>
          );
        } else {
          return <></>;
        }
      })()}
    </>
  );
};

export default SearchSalesData;