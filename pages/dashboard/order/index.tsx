import Styles from '../Dashboard.module.scss'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase/clientApp';
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, increment, setDoc, deleteDoc } from "firebase/firestore";
import { DashboardLayout } from '../../../components/dashboard/dashboardLayout'
import { Data, OrderData } from '../../../types/Types';

const Order:React.FC = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const [lastDayOrders, setLastDayOrders] = useState<OrderData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [completed, setCompleted] = useState<OrderData[]>([]);

  useEffect(() => {
    function order() {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 1);
      const yesterdayData = query(collection(db, "order", `${year}`, `${month}-${day - 1}`), orderBy("orderTime"));
      onSnapshot(yesterdayData, (querySnapshot) => {
        const orders: any = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data().addOrder;
          const id = doc.id;
          const orderTime = doc.data().orderTime;
          const orderDay = doc.data().orderDay;
          orders.push({ data, id, orderTime, orderDay });
        });
        if (orders) {
          setLastDayOrders(orders)
        } else {
          return
        }
      });
      const lastDateData = query(collection(db, "order", `${lastDate.getFullYear()}`, `${lastDate.getMonth() + 1}-${lastDate.getDate()}`), orderBy("orderTime"));
      onSnapshot(lastDateData, (querySnapshot) => {
        const orders: any = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data().addOrder;
          const id = doc.id;
          const orderTime = doc.data().orderTime;
          const orderDay = doc.data().orderDay;
          orders.push({ data, id, orderTime, orderDay });
        });
        if (orders) {
            setOrders(orders)
        } else {
            return
        }
      })
    }
    order()
  }, [year, month, day])

  useEffect(() => {
    function order(){
      const orderRef = query(collection(db, "order", `${year}`, `${month}-${day}`), orderBy("orderTime"));
      onSnapshot(orderRef, (querySnapshot) => {
        const orders: any = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data().addOrder;
          const id = doc.id;
          const orderTime = doc.data().orderTime;
          const orderDay = doc.data().orderDay;
          orders.push({ data, id, orderTime, orderDay });
        });
        if (orders) {
          setOrders(orders)
        } else {
          return
        }
      })
    }
    order()
  }, [year, month, day])

  useEffect(() => {
    function complete() {
      const completeRef = query(collection(db, "order", `${year}`, `${month}-${day}_completed`), orderBy("completedTime", "desc"));
        onSnapshot(completeRef, (querySnapshot) => {
          const complete:any = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data().data;
            const id = doc.id;
            const time = doc.data().completedTime;
            const orderDay = doc.data().orderDay;
            complete.push({ data, id, time, orderDay });
          });
          if (complete) {
            setCompleted(complete)
          } else {
            return
          }
        })
      }
    complete()
  }, [year, month, day])

  const handleClick = (async (data: Data[], id: string, orderDay: string) => {
    let now = new Date();
    let Hour = now.getHours();
    let Min = now.getMinutes();
    let Sec = now.getSeconds();
    let time = `${Hour}:${Min}:${Sec}`;
    for (let i = 0; i < data.length; i++) {
      data[i].price
      const dayRef = doc(db, "sales", `${year}`, `${month}-${day}`, data[i].id)
      const dayRefDoc = await getDoc(dayRef);
      if (dayRefDoc.exists()) {
        await updateDoc(dayRef, {quantity: increment(data[i].quantity)});
      } else {
        await setDoc(dayRef, {
          name: data[i].name,
          quantity: data[i].quantity,
          category: data[i].category,
          images: data[i].images,
          price: Number(data[i].price),
        });
      }
      const monthRef = doc(db, "sales", `${year}`, `${month}`, data[i].id)
      const monthRefDoc = await getDoc(monthRef);
        if (monthRefDoc.exists()) {
          await updateDoc(monthRef, {quantity: increment(data[i].quantity)});
        } else {
          await setDoc(monthRef, {
            name: data[i].name,
            quantity: data[i].quantity,
            category: data[i].category,
            images: data[i].images,
            price: Number(data[i].price),
          });
      }
      const monthTotalPriceRef = doc(db, "monthTotalPrice", `${year}`, `${month}`, `${day}`);
      const monthTotalPriceRefDoc = await getDoc(monthTotalPriceRef);
      if (monthTotalPriceRefDoc.exists()) {
        await updateDoc(monthTotalPriceRef, {price: increment(data[i].price)})
      } else {
        await setDoc(monthTotalPriceRef, {
          price: data[i].price,
        }, { merge: true })
      }
      if (i + 1 === data.length) {
        await setDoc(doc(db, "order", `${year}`, `${month}-${day}_completed`, id), {
          data, completedTime: time
        }).then(async () => {
          await deleteDoc(doc(db, "order", `${year}`, `${orderDay}`, id)).then(() => {
            alert('ご提供済み')
          }).catch((error) => {
            alert(`失敗しました (${error})`);
          })
        }).catch((error) => {
          alert(`失敗しました (${error})`);
        })
      }
    }
  })
  
  const [newOrder, setNewOrder] = useState<boolean>(true),
    [newOrderActive, setNewOrderActive] = useState<boolean>(true);
  const [offer, setOffer] = useState<boolean>(false),
    [notOfferActive, setNotOfferActive] = useState<boolean>(false);

  return (
    <DashboardLayout>
      <div className={Styles.inner}>
        <h2>注文管理</h2>
        <ul className={Styles.orderTabBtn}>
          <li onClick={() => { setNewOrder(true); setOffer(false); setNewOrderActive(true); setNotOfferActive(false);}} className={newOrderActive ? Styles.n_active : ""}>ご新規</li>
          <li onClick={() => { setOffer(true); setNewOrder(false); setNewOrderActive(false); setNotOfferActive(true);}} className={notOfferActive ? Styles.o_active : ""}>提供済</li>
        </ul>
        <div className={Styles.orderList}>
          {newOrder ? 
            <>
              {lastDayOrders.length > 0 && (
                lastDayOrders.map((list, index) => (
                  <div key={index} className={Styles.orderListInner}>
                    <h3>{list.id}番</h3>
                    {list.data.length > 0 && (
                      list.data.map((lst, index) => (
                        <div key={index} className={Styles.ovf}><span className={Styles.productName}>{lst.name}</span><span className={Styles.quantity}>{lst.quantity}個</span></div>
                      )))}
                    <div>ご注文時間：{list.time}</div>
                    <div className={Styles.provide} onClick={() => handleClick(list.data, list.id, list.orderDay)}>提供</div>
                  </div>
                )))}
              {orders.length > 0 && (
                orders.map((list, index) => (
                  <div key={index} className={Styles.orderListInner}>
                    <h3>{list.id}番</h3>
                    {list.data.length > 0 && (
                      list.data.map((lst, index) => (
                        <div key={index} className={Styles.ovf}><span className={Styles.productName}>{lst.name}</span><span className={Styles.quantity}>{lst.quantity}個</span></div>
                      ))
                    )}
                    <div>ご注文時間：{list.time}</div>
                    <div className={Styles.provide} onClick={() => handleClick(list.data, list.id, list.orderDay)}>提供</div>
                  </div>
                )))}
            </> : <></>
          }
          {offer ? 
            <>
              {completed.length > 0 && (
                completed.map((list, index) => (
                  <div key={index} className={Styles.orderListInner}>
                    <h3>{list.id}番</h3>
                    {list.data.length > 0 && (
                      list.data.map((lst, index) => (
                        <div key={index} className={Styles.ovf}><span className={Styles.productName}>{lst.name}</span><span className={Styles.quantity}>{lst.quantity}個</span></div>
                      )))}
                    <div>提供時間：{list.time}</div>
                  </div>
                )))}
            </> : <></>
          }
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Order
