import Head from 'next/head';
import Link from 'next/link';
import Styles from './cart.module.scss';
import LoadStyles from '../../components/dashboard/kit/styles/Loading.module.scss';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { db } from '../../firebase/clientApp';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js/pure';
import { doc, setDoc } from "firebase/firestore";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartItems, AddOrder } from "../../types/Types";
import fetch from 'node-fetch';
import Image from 'next/image';
import * as CSS from "csstype";

type Style = {
  cursor: string;
  margin: string;
  fontSize: string;
  border: string;
  width: string;
  borderRadius: string;
  textAlign: string;
  padding: string;
  background: string;
  color: string;
  fontWeight: string;
  display: string;
}

const Cart: React.FC<Style> = () => {
  const [cartItem, setCartItem] = useState<CartItems | undefined>(undefined);
  const [total, setTotal] = useState<number>(0);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = sessionStorage.getItem('cartItem');
      if (item === null) {
        return;
      } else {
        const cartData = JSON.parse(item);
        setCartItem(cartData);
      }
    } else {
      return;
    }
  }, []);

  const addQuantity = (id: string, count: number, index: any, name: string, images: string, price: string, category: string) => {
    const newData = {
      id: id,
      count: count + 1,
      name: name,
      images: images,
      price: price,
      category: category,
    };
    // if (Object.keys(cartItem).length > 1) {
    if (cartItem.length > 1) {
      const deleteItem = cartItem.splice(index - 1, 1);
      const newCartItem = deleteItem;
      newCartItem.splice(index, 0, newData);
      sessionStorage.setItem('cartItem', JSON.stringify(newCartItem));
      setCartItem(newCartItem);
    } else {
      sessionStorage.clear();
      const newCartItem = [];
      newCartItem.push(newData);
      sessionStorage.setItem('cartItem', JSON.stringify(newCartItem));
      setCartItem(newCartItem);
    }
  };

  const deleteCartItem = (index:number) => {
    if (cartItem?.length > 1) {
      cartItem.splice(index, 1);
      sessionStorage.setItem('cartItem', JSON.stringify(cartItem));
      const item = sessionStorage.getItem('cartItem');
      const cartData = JSON.parse(item);
      setCartItem(cartData);
    } else {
      sessionStorage.clear();
      setCartItem([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    if (cartItem?.length > 0) {
      const totalPrice = cartItem.reduce((prev:any, current:any) => {
        return prev + (current.price * current.count);
      }, 0);
      setTotal(totalPrice);
    }
  }, [cartItem]);

  const [orderNumber, setOrderNumber] = useState<number>(0);
  const [addOrder, setAddOrder] = useState <AddOrder | null>(null);
  const [paymentLoad, setPaymentLoad] = useState<boolean>(false);

  console.log(addOrder)
  useEffect(() => {
    function order() {
      if (cartItem) {
        let items = [];
        for (let i = 0; i < cartItem?.length; i++) {
          items.push({name: cartItem[i].name, quantity: cartItem[i].count, id: cartItem[i].id, category: cartItem[i].category, images: cartItem[i].images, price: Number(cartItem[i].price)});
        }
        setAddOrder(items);
      }
    }
    order();
  }, [cartItem]);

  const pullQuantity = (id:string, count:number, index:number, name:string, images:string, price:string, category:string) => {
    const newData = {
      name: name,
      id: id,
      count: count - 1,
      category:category,
      images: images,
      price: price,
    }
    if (count === 1) {
      return;
    } else {
      if (cartItem?.length > 1) {
        const deleteItem = cartItem.splice(index - 1, 1);
        const newCartItem = deleteItem;
        newCartItem.splice(index, 0, newData);
        sessionStorage.setItem('cartItem', JSON.stringify(newCartItem));
        setCartItem(newCartItem);
      } else {
        sessionStorage.clear();
        const newCartItem = [];
        newCartItem.push(newData);
        sessionStorage.setItem('cartItem', JSON.stringify(newCartItem));
        setCartItem(newCartItem);
      }
    }
  };

  const InitializationCartItem = () => {
    sessionStorage.clear();
    setCartItem([]);
    setTotal(0);
  };

  const [cardErrorMessage, setCardErrorMessage] = useState<boolean>(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

  const cardStyles = {
    style: {
      base: {
        lineHeight: '45px',
        fontSize: '18px',
      },
    },
    placeholder: 'Card Number',
  };



  const CheckoutForm = ({ total }) => {
    const style: CSS.Properties = {
      cursor: 'pointer',
      margin: '0 auto',
      fontSize: '18px',
      border: 'none',
      width: '400px',
      borderRadius: '5px',
      textAlign: 'center',
      padding: '10px 0 9px',
      background: '#fa3d47',
      color: '#fff',
      fontWeight: 'bold',
      display: 'block'
    }
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async (event: any) => {
      event.preventDefault();
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)
      });
      setPaymentLoad(true)
      const headers = new Headers();
      headers.set('Content-type', 'application/json');
      if (!error) {
        const { id } = paymentMethod;
        try {
          const { data } = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stripePaymentMethods`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              id: id,
              amount: total
            })
          })
          let d = new Date();
          let year = d.getFullYear().toString();
          let month = d.getMonth() + 1;
          let day = d.getDate().toString();
          let Hour = d.getHours();
          let Min = d.getMinutes();
          let Sec = d.getSeconds();
          let time = `${Hour}時${Min}分${Sec}秒`;
          const S = '1234567890';
          const N = 3;
          const makeNumber = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join('')
          const addOrders = async () => {
            await setDoc(doc(db, "order", `${year}`, `${month}-${day}`, makeNumber), {
              addOrder: addOrder,
              orderTime: time,
              orderDay: `${month}-${day}`
            }, { merge: true }).then(() => {
              setOrderNumber(Number(makeNumber));
              setPaymentLoad(false);
              setPaymentCompleted(true);
            }).catch(() => {
              console.log('error')
            })
          }
          addOrders()
        } catch (error) {
          setPaymentLoad(false);
          setCardErrorMessage(true);
        }
      }
    }
    return <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <CardElement options={cardStyles} />
        <button type="submit" disabled={!stripe} style={style}>購入</button>
        </form>
  }

  return (
    <>
      <Head>
        <title>Tbilisi Burger | Cart</title>
        <meta name="description" content="Tbilisi Burger Cart page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={Styles.cartBx}>
        <h2>My Cart<Link href={'/'}><a>← トップページ</a></Link></h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>商品名</th>
              <th>数量</th>
              <th>価格(税込)</th>
            </tr>
          </thead>
          <tbody>
            {cartItem?.length > 0 &&
              cartItem.map((list, index) => (
                <tr key={index}>
                  <td className={Styles.right}>
                    <div className={Styles.imageBx}>
                      <Image src={list.images} alt="item" layout="fill" objectFit="contain" priority={true} />
                    </div>
                  </td>
                  <td>{list.name}</td>
                  <td><span onClick={() => pullQuantity(list.id, list.count, index, list.name, list.images, list.price, list.category)}>-</span><span>{list.count}</span><span onClick={() => addQuantity(list.id, list.count, index, list.name, list.images, list.price, list.category)}>+</span></td>
                  <td>{(list.price * list.count).toLocaleString()}<DeleteForeverIcon onClick={() => deleteCartItem(index)} /></td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className={Styles.totalPrice}>合計金額:<span>{total.toLocaleString()}</span>円</div>
        {cartItem?.length > 0 && (
          <div className={Styles.cardInfo}>
            <h3>カード情報</h3>
            <Elements stripe={stripePromise}>
              <CheckoutForm total={total} />
            </Elements>
          </div>
        )}
        {cardErrorMessage && (
          <div className={Styles.cardErrorMessage}>
            <div className={Styles.inner}>
              <h3>エラー</h3>
              <p>お支払いができませんでした。<br />通信環境をご確認下さい。</p>
              <div className={Styles.closeBtn} onClick={() => setCardErrorMessage(false)}>閉じる</div>
            </div>
          </div>
        )}
        {paymentCompleted && (
          <div className={Styles.paymentCompleted}>
            <div className={Styles.inner}>
              <h3>ご注文ありがとうございます。</h3>
              <p>お支払いが完了しました。</p>
              <p>あなたのご注文番号<br />「{orderNumber}」</p>
              <Link href={'/'}>
                <a className={Styles.closeBtn} onClick={() => {setPaymentCompleted(false);InitializationCartItem()}}>閉じる</a>
              </Link>
            </div>
          </div>
        )}
        {paymentLoad && (
          <div className={Styles.paymentLoadBx}>
            <div className={Styles.inner}>
              <h3>決済処理中...</h3>
              <div className={LoadStyles.loader}>Loading...</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart
