
import { getCategoryData } from '../../../lib/fetch';
import React,{ useCallback, useEffect, useState } from 'react'
import { SelectBox, TextBox } from '../../../components/dashboard/kit'
import { db } from '../../../firebase/clientApp';
import Box from '@mui/material/Box'
import { collection, addDoc, setDoc, doc, query, onSnapshot, updateDoc,getDocs,deleteDoc, where } from "firebase/firestore";
import { Images } from '../../../types/Types';
import { DashboardLayout } from '../../../components/dashboard/dashboardLayout'
import { ImageArea } from '../../../components/dashboard/kit'
import { GetStaticProps } from 'next';
import Styles from '../Dashboard.module.scss'
import AddIcon from '@mui/icons-material/Add';

type CategoryData = {
  name: string;
  orderBy: number;
  categoryId: string;
}

type ProductItem = {
  name: string;
  category: string;
  price: string;
  images?: Images[];
}

const Register: React.FC = () => {
  const [registerBx, setRegisterBx] = useState<boolean>(false);
  const [images, setImages] = useState<Images[]>([{id:'',path: ''}]);
  const [priceValidation, setPriceValidation] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    if (name !== "" && priceValidation !== false && category !== "") {
      setRegisterBx(true);
    } else {
      setRegisterBx(false);
    }
  }, [name, priceValidation, category])
      
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "category")), (querySnapshot) => {
      const categoryData = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.categoryId = doc.id;
        categoryData.push(data)
      });
      setCategories(categoryData);
    });
    return unsubscribe;
  }, []);

  const inputName = useCallback((event: any) => {
    setName(event.target.value)
  }, [setName])
  const inputPrice = useCallback((event: any) => {
    setPrice(event.target.value)
  }, [setPrice])

  useEffect(() => {
    const isPrice = (price: string) => {
      const regexp = new RegExp(/^[+]?([1-9]\d*|0)$/);
      return regexp.test(price);
    }
    if (isPrice(price) === true && price !== "") {
      setPriceValidation(true)
    } else if (isPrice(price) === false && price !== "") {
      setPriceValidation(false)
    } else {
      setPriceValidation(false)
    }
  }, [price])

  const registerBtn = async (name: string, category: string, price: string, images: Images[]) => {
    let pattern = /^([1-9]\d*|0)$/;
    if (name === "" || category === "" || price === "") {
      alert('すべて入力してください。');
    } else if (pattern.test(price) !== true) {
      alert('半角数字で入力してください。')
    } else if (category !== 'Drink' && images === null) {
      alert('画像が未入力です。');
    } else {
      let data: ProductItem = { name: name, category: category, price: price };
      if (category !== 'Drink') {
        data.images = images
      }
      await addDoc(collection(db, "menu"), data).then((doc) => {
        toAddCategoryCollection(doc.id, data, category)      
      }).catch((error) => {
        alert(`更新に失敗しました(${error})`);
      })
    }
  };

  const toAddCategoryCollection = async(id: string, data: ProductItem, category: string) => {
    const categoryId: string = categories.find(e => e.name === category).categoryId;
    await setDoc(doc(db, "category", categoryId, category, id), data).then(() => {
      alert("登録しました");
      setName("");
      setCategory("");
      setPrice("");
      setThumbnail("");
    }).catch((error) => {
      alert(`更新に失敗しました(${error})`);
    })
  }

  const [addCategory, setAddCategory] = useState(false)
  const [editCategory, setEditCategory] = useState(false);
  const [detailCategory, setDetailCategory] = useState(false);
  const [registerCategoryBx, setRegisterCategoryBx] = useState(false);
  const [nowCategoryName, setNowCategoryName] = useState<string>("");
  const [inAddNewCategoryName, setInAddNewCategoryName] = useState<string>("");
  const [inAddCategoryName, setInAddCategoryName] = useState<string>("");
  const [inAddCategoryId, setInAddCategoryId] = useState<string>("");
  const [nowData, setNowData] = useState<any[]>([]);
  
  const inputAddCategoryName = useCallback((event: any) => {
    setInAddCategoryName(event.target.value)
  }, [setInAddCategoryName])
  const inputAddNewCategoryName = useCallback((event: any) => {
    setInAddNewCategoryName(event.target.value)
  }, [setInAddNewCategoryName])

  const closeBtn = () => {
    setInAddNewCategoryName("")
    setInAddCategoryName("")
    setInAddCategoryId("")
    setAddCategory(false)
    setDetailCategory(false)
    setEditCategory(false) 
    setRegisterCategoryBx(false)
    setNowData([]);
  }

  const addNewCategory = async(inAddNewCategoryName: string) => {
    const docRef = await addDoc(collection(db, "category"), {
      name: inAddNewCategoryName,
      orderBy: 0
    }).then(() => {
      closeBtn()
      alert('登録が完了しました。')
    }).catch(() => {
      alert('登録が失敗しました。')
    })
  }

  const RegisterNewCategory = () => {
    return (
      <div className={Styles.addCategoryBx}>
      <div className={Styles.inner}>
        <h3>カテゴリー登録</h3>
        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
            <div className={Styles.input}>
              <TextBox fullWidth={true} label={"カテゴリー名"} multiline={false} required={true} onChange={inputAddNewCategoryName} rows={1} value={inAddNewCategoryName} className={Styles.inputCategory} type={"text"} />
          </div>
        </Box>
        <button className={Styles.registerCategory} onClick={() => addNewCategory(inAddNewCategoryName)}>登録</button>
          <p onClick={() => closeBtn()} className={Styles.closeBtn}>閉じる</p>
      </div>
    </div>
    )
  }

  const categoryDelete = async(inAddCategoryId: string) => {
    await deleteDoc(doc(db, "category", inAddCategoryId)).then(() => {
      closeBtn();
    })
  }

  const nowCategorySubCollectionDelete = async (data,inAddCategoryId, nowCategoryName) => {
    for (let i = 0; i < data.length; i++){
      await deleteDoc(doc(db, "category", inAddCategoryId, nowCategoryName, data[i].id));
      if (i === data.length - 1) {
        console.log('SubCollection delete complete')
      }
    }
  }

  const getNowCategoryCollectionData = async(inAddCategoryId, nowCategoryName) => {
    const querySnapshot = await getDocs(collection(db, "category", inAddCategoryId, nowCategoryName));
    const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      nowCategorySubCollectionDelete(data, inAddCategoryId, nowCategoryName)
  }

  const [innerCategoryData, setInnerCategoryData] = useState<any[]>([])  
  const changeCategoryData = async (innerCategoryData,inAddCategoryId, inAddCategoryName,nowCategoryName) => {
    for (let i = 0; i < innerCategoryData.length; i++){
      await setDoc(doc(db, "category", inAddCategoryId, inAddCategoryName, innerCategoryData[i].id), innerCategoryData[i]);
      if (i === innerCategoryData.length - 1) {
        console.log('create new sub collection!')
        getNowCategoryCollectionData(inAddCategoryId, nowCategoryName)
      }
    } 
  }

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "menu"), where("category", "==", nowCategoryName));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        let item = doc.data();
        item.id = doc.id;
        data.push(item);
      });
      setInnerCategoryData(data)
    })()
  },[nowCategoryName])

  const registerMenu = (nowData, inAddCategoryName, nowCategoryName) => {
    const data = nowData.filter(item => item.data.category === nowCategoryName);
    for (let i = 0; i < data.length; i++) {
      const menuCollectionRef = doc(db, "menu", data[i].id);
      updateDoc(menuCollectionRef, {
        category: inAddCategoryName
      });
      if (i === data.length - 1) {
        changeCategoryData(innerCategoryData,inAddCategoryId, inAddCategoryName,nowCategoryName)
        alert('このカテゴリーに登録されているすべての商品情報も変更されています。')
        closeBtn()
      }
    }
  }

  const getNowCategoryData = async (nowCategoryName: string) => {
    const q = query(collection(db, "menu"), where("category", "==", nowCategoryName));
    const data:any[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data.push(doc.data())
    });
    setNowData(data)
  }

  const getMenuData = async() => {
    const querySnapshot = await getDocs(collection(db, "menu"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({id:doc.id, data:doc.data()})
    })
    setNowData(data)
  }

  const registerCategory = async(inAddCategoryId: string,inAddCategoryName: string) => {
    const categoryRef = doc(db, "category", inAddCategoryId);
    await updateDoc(categoryRef, {
      name: inAddCategoryName
    }).then(async() => {
      registerMenu(nowData, inAddCategoryName,nowCategoryName)
      alert('登録が完了しました。')
    }).catch(() => {
      alert('登録が失敗しました。')
    })
  }

  const DetailCategoryBx = () => {
    return (
      <div className={Styles.addCategoryBx}>
      <div className={Styles.inner}>
          <h3>カテゴリー詳細</h3>
             <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
                <div className={Styles.input}>
                  <TextBox fullWidth={true} label={"カテゴリー名"} multiline={false} required={true} onChange={inputAddCategoryName} rows={1} value={inAddCategoryName} type={"text"} className={Styles.inputCategory} />
                </div>
              </Box>
          <button className={Styles.registerCategory} onClick={() => registerCategory(inAddCategoryId, inAddCategoryName)}>登録</button>
          <p className={Styles.deleteBtn} onClick={()=> categoryDelete(inAddCategoryId)}>削除</p>
        <p onClick={() => closeBtn()} className={Styles.closeBtn}>閉じる</p>
      </div>
    </div>
    )
  }

  const EditCategoryList = () => {
    return (
      <div className={Styles.addCategoryBx}>
        <div className={Styles.inner}>
          <h3>どれを編集しますか？</h3>
            <ul className={Styles.categoryList}>
              {categories.length > 0 && (
                categories.map((list, index) => (
                  <li key={index} onClick={() => { setDetailCategory(true); setEditCategory(false); setInAddCategoryName(list.name); setInAddCategoryId(list.categoryId); setNowCategoryName(list.name); getNowCategoryData(nowCategoryName); getMenuData(); }}>{list.name}</li>
                ))
              )}
            </ul>
          <p onClick={() => closeBtn()} className={Styles.closeBtn}>閉じる</p>
        </div>
      </div>
    )
  }

  const AddCategoryBx = () => {
    return (
      <div className={Styles.addCategoryBx}>
      <div className={Styles.inner}>
        <h3>カテゴリー編集</h3>
        <div className={Styles.ovf}>
          <div className={Styles.left} onClick={() => { setAddCategory(false); setEditCategory(true);setDetailCategory(false) }}>編集</div>
          <div className={Styles.right} onClick={() => { setRegisterCategoryBx(true); setAddCategory(false); setEditCategory(false);setDetailCategory(false) }}>登録</div>
        </div>
        <p onClick={() => closeBtn()} className={Styles.closeBtn}>閉じる</p>
      </div>
    </div>
    )
  }

  return (
    <DashboardLayout>
      <div className={Styles.inner}>
        <h2>商品登録</h2>
        <div className={Styles.left}>
          <ImageArea categoryName={category} setImages={setImages} images={images} thumbnail={thumbnail} setThumbnail={setThumbnail} />
        </div>
        <div className={Styles.right}>
          <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
            <div className={Styles.input}>
              <TextBox fullWidth={true} label={"商品名"} multiline={false} required={true} onChange={inputName} rows={1} value={name} type={"text"} />
            </div>
            <div className={Styles.input}>
              <SelectBox label={"カテゴリ―"} required={true} options={categories} select={setCategory} value={category} />
            </div>
            <div className={Styles.addCategory} onClick={() => setAddCategory(true)}><AddIcon /><span>カテゴリー追加</span></div>
            <div className={Styles.input}>
              <TextBox fullWidth={true} label={"価格（税込み）"} multiline={false} required={true} onChange={inputPrice} rows={1} value={price} type={"text"} />
              {priceValidation ? <></> : <span className={Styles.validation}>半角数字で入力してください。</span>}
            </div>
            {registerBx ? <div className={Styles.registerBtn} onClick={() => registerBtn(name, category, price, images)}>登録</div> : <></>}
          </Box>
        </div>
      </div>
      {addCategory ? <AddCategoryBx /> : <></>}
      {editCategory ? <EditCategoryList /> : <></>}
      {detailCategory ? <DetailCategoryBx /> : <></>}
      {registerCategoryBx ? <RegisterNewCategory /> : <></>}
    </DashboardLayout>
  );
};
export default Register;

export const getStaticProps: GetStaticProps = async () => {
  const categoryData = await getCategoryData();
  return {
    props: {
      categoryData,
    },
  };
};