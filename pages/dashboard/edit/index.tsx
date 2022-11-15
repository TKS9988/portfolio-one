import React,{ useEffect, useState, useRef, ComponentProps } from "react";
import { GetStaticProps } from 'next';
import { getCategoryData, getMenuData } from '../../../lib/fetch';
import { Images } from '../../../types/Types';
import Styles from '../Dashboard.module.scss'
import { DashboardLayout } from '../../../components/dashboard/dashboardLayout';
import Link from 'next/link'
import Image from 'next/image'
import { doc, query, collection, where, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../firebase/clientApp';

function moveItem<T = any>(
  arr: T[],
  currentIndex: number,
  targetIndex: number
) {
  const targetItem = arr[currentIndex];
  let resArr = arr.map((target, i) => (i === currentIndex ? null : target));
  resArr.splice(targetIndex, 0, targetItem);
  return resArr.flatMap((target) => (target !== null ? [target] : []));
}

type CategoryData = {
  name: string;
  categoryId: string;
  orderBy: number;
}

type MenuData = {
  category: string;
  orderBy: number;
  counter: number;
  images: Images;
  name: string;
  price: string;
  id: string;
}

type Item<T = any> = {
  category: string;
  orderBy: number;
  counter: number;
  images: Images;
  name: string;
  price: string;
  id: string;
};

type Props<T extends any> = {
  initItems: MenuData[];
  onChange?: (newItems: MenuData[]) => void;
  categories: CategoryData[];
  menuData: MenuData[];
};

  export function Edit<T = any>({ onChange, categories,menuData }: Props<T>) {
    const list = menuData;
  const [items, setItems] = useState([...list]);
  const $refs = useRef<Map<string, HTMLElement>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [targetIndex, setTargetIndex] = useState(-1);

useEffect(() => {
  setItems([...list]);
}, [list]);

const setElement = (id: string, elm: HTMLElement | null) => {
  if (elm) {
    $refs.current.set(id, elm);
  } else {
    $refs.current.delete(id);
  }
};

const [dragEndItemId, setDragEndItemId] = useState("")

const getHandle = (
  item: Item<any>,
  index: number
): ComponentProps<"li"> => {
  return {
    onDragStart(event) {
      setActiveId(item.id);
      event.dataTransfer.setData("text/plain", item.id);
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      const element = $refs.current.get(item.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const posX = event.clientX - rect.left;
        const posY = event.clientY - rect.top;
        event.dataTransfer.setDragImage(element, posX, posY);
      }
    },
    onDragEnd(event) {
      const currentIndex = items.findIndex(
        (target) => target.id === activeId
      );
      if (currentIndex >= 0 && targetIndex >= 0) {
        const newItems = moveItem(items, currentIndex, targetIndex);
        setItems(newItems);
        onChange?.(newItems);
      }
      setActiveId(null);
      setTargetIndex(-1);
      setDragEndItemId(activeId)
    }
  };
};

const [changeOrderbyCategory, setChangeOrderbyCategory] = useState("");
useEffect(() => {
  (async () => {
    if (dragEndItemId !== "") {
      const docRef = doc(db, "menu", dragEndItemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setChangeOrderbyCategory(docSnap.data().category)
      } else {
        console.log("No such document!");
      } 
    } else {
      return;
    }
  })()
}, [dragEndItemId])

const [registerItems, setRegisterItems] = useState([])
useEffect(() => {
  (async () => {
    if (changeOrderbyCategory !== "") {
      const data = [];
      const q = query(collection(db, "menu"), where("category", "==", changeOrderbyCategory));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let item = doc.data();
        item.id = doc.id;
        data.push(item)
      });
      setRegisterItems(data);
    } else {
      return;
    }
  })()
}, [changeOrderbyCategory])

const getItem = (item: Item<any>, index: number): ComponentProps<"li"> => {
  return {
    draggable: true,
    ref(elm) {
      setElement(item.id, elm);
    },
    onDragOver(event) {
      event.preventDefault();
      const elm = $refs.current.get(item.id);
      if (!elm) return;
      const rect = elm.getBoundingClientRect();
      const posY = event.clientY - rect.top;
      const ratioY = Math.min(1, Math.max(0, posY / rect.height));
      setTargetIndex(index + Math.round(ratioY));
    },
    onDragEnter(event) {
      event.preventDefault();
    },
    onDragLeave(event) {
      event.preventDefault();
    },
    onDrop(event) {
      event.preventDefault();
    }
  };
};

const newOrderByItems = items.filter(item => item.category === changeOrderbyCategory);
const registerBtn = async(items,registerItems) => {
  if (items !== "" && registerItems !== "") {
    for (let i = 0; i < newOrderByItems.length; i++){
      const updateRef = doc(db, "menu", newOrderByItems[i].id);
      await updateDoc(updateRef, {
        orderBy: Number([i])
      }).then(() => {
        if (i === newOrderByItems.length - 1) {
          alert('登録が完了しました。');
          setChangeOrderbyCategory("");
        }
      }).catch(() => {
        console.log('error')
      })
    }
  } else {
    return;
  }
}
  
  return (
    <DashboardLayout>
      <div className={Styles.inner}>
        <h2>商品編集</h2>
        {categories.length > 0 && (
          categories.map((list, index) => (
          <div key={index} className={Styles.categoryBx}>
            <h3 id={list.name}>{list.name}</h3>
            <ul className={Styles.productListBx}>
              {items.length > 0 && (
                  items.map((item, index) => (
                    <React.Fragment key={index}>
                    {(() => {
                      if (list.name === item.category) {
                        return <li
                        key={index}
                        {...getHandle(item, index)}
                        {...getItem(item, index)}
                        >
                          <Link href={`/dashboard/edit/${list.name}-${item.id}`}>
                          <a>
                            {item.category !== 'Drink' ? <span><Image src={item.images.path} alt={"A thumbnail of the question"} layout="fill" objectFit="contain" priority={true} /></span> : <></>}
                            <h4>{item.name}</h4>
                            <p>{Number(item.price).toLocaleString()}円（税込）</p>
                          </a>
                          </Link>
                          </li>
                      } else {
                        return <></>
                      }
                    })()}
                  </React.Fragment>
                ))
              )}
            </ul>
            {(() => {
              if (list.name === changeOrderbyCategory) {
                return <div className={Styles.registerOrderBy} onClick={() => registerBtn(items,registerItems)}>新しい順番を登録</div>
              } else {
                return;
              }
            })()}
        </div>
        ))
      )}
      </div>
    </DashboardLayout>
  );
}
export default Edit

export const getStaticProps: GetStaticProps = async () => {
  const menuData = await getMenuData()
  const categories = await getCategoryData()
  return {
    props: {
      menuData,
      categories,
    }
  }
}