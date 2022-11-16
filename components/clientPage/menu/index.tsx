import React, { useEffect, useState, memo } from 'react';
import Style from './Menu.module.scss';
import Image from 'next/image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Counter} from '../../counter';
import Drink from '../../../assets/images/cup.png';

type Props = {
  menuData: any[];
  categoryData: any[];
  handleClick: any;
}

const Menu: React.FC<Props> = (props) => {
  const { menuData, categoryData, handleClick } = props;
  const [viewData, setViewData] = useState([]);
  const [counter, setCounter] = useState(1);
  const images = Drink;

  console.log(viewData)
  useEffect(() => {
    const data = [];
    for (let i = 0; i < categoryData.length; i++){
      const categoryItem = menuData.filter((num) => num.category === categoryData[i].name);
      data.push({name: categoryData[i].name, data:categoryItem})
    }
    setViewData(data)
  }, [])

  const addCart = (id:string, name:string, images:string, price:string, counter:number, category:string) => {
    const cart = [];
    const data = {
      id: id,
      name: name,
      images: images,
      price: price,
      count: counter,
      category: category,
    };
    if (typeof window !== 'undefined') {
      const item = sessionStorage.getItem('cartItem');
      if (item === null) {
        cart.push(data);
        sessionStorage.setItem('cartItem', JSON.stringify(cart));
      } else {
        const cartData = JSON.parse(item);
        cartData.push(data);
        sessionStorage.setItem('cartItem', JSON.stringify(cartData));
      }
    } else {
    }
    };

  return (
    <>
      {viewData.map((list, index) => (
        <div key={index} className={Style.HamburgerBx} id={list.name}>
          <div className={Style.ttlBx}>
            <h2 className={Style.ttl}>
              {list.name}
            </h2>
          </div>
          <div className={Style.ovf}>
            <ul className={Style.productBx}>
              {viewData[index].data.length > 0 &&
                viewData[index].data.map((item, index: number) => (
                  <li key={index} className={Style.productList}>
                    {item.images !== undefined ? <span className={Style.imageBx}><Image src={item.images.path} alt="kv" layout="fill" objectFit="contain" priority={true} /></span> : <></>}
                    <h4 className={Style.productTtl}>{item.name}</h4>
                    <span className={Style.ovf}>
                      <Counter
                        value={item.counter}
                        onIncrement={() => {
                        const countersCopy = item.counter += 1;
                        setCounter(countersCopy);
                      }}
                      onDecrement={() => {
                        const countersCopy = item.counter -= 1;
                        setCounter(countersCopy);
                      }} 
                      />
                      <span className={Style.priceAndCartBx}>
                        <p>￥{(item.counter * item.price).toLocaleString()}</p>
                        {(item.category === 'Drink') ?
                          <span className={Style.cart} onClick={() => { addCart(item.id, item.name, images.src, item.price, counter, item.category); handleClick()}}>
                            <ShoppingCartIcon />
                          </span>
                          :
                          <span className={Style.cart} onClick={() => { addCart(item.id, item.name, item.images.path, item.price, counter, item.category); handleClick()}}>
                            <ShoppingCartIcon />
                          </span>
                        }
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};
export default memo(Menu);
