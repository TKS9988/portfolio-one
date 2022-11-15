/* eslint-disable react-hooks/exhaustive-deps */
import Box from '@mui/material/Box'
import { SelectBox, TextBox } from '../../../components/dashboard/kit'
import React, { useCallback, useEffect, useState } from 'react'
import Styles from '../Dashboard.module.scss'
import { ImageArea } from '../../../components/dashboard/kit';
import { DashboardLayout } from '../../../components/dashboard/dashboardLayout'
import { getDoc, doc, updateDoc, deleteDoc, collection, onSnapshot, query } from "firebase/firestore";
import { Images } from '../../../types/Types';
import { storage, db } from '../../../firebase/clientApp';
import { useRouter } from 'next/router';
import { ref, deleteObject } from "firebase/storage";

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

const Product = ({ edit }) => {
  const [categoryId, setCategoryId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const [price, setPrice] = useState<string>("");
  const [images, setImages] = useState<Images[]>([]);
  const [category, setCategory] = useState<string>("");
  const [registerBx, setRegisterBx] = useState<boolean>(false);
  const [priceValidation, setPriceValidation] = useState<boolean>(false);
  

  useEffect(() => {
    if (name !== "" && priceValidation !== false && category !== "") {
      setRegisterBx(true);
    } else {
      setRegisterBx(false);
    }
  }, [name, priceValidation, category])

  const inputName = useCallback((event: any) => {
    setName(event.target.value);
  }, [setName])
  const inputPrice = useCallback((event: any) => {
    setPrice(event.target.value);
  }, [setPrice])
  
  const [thumbnail, setThumbnail] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "category")), (querySnapshot) => {
      const categoryData = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.categoryId = doc.id;
        if (data.name === category) {
          setCategoryId(data.categoryId)
        }
          categoryData.push(data)
      });
      setCategories(categoryData);
    });
    return unsubscribe;
  }, []);

  const productCategory: string = String(id).substring(0, String(id).indexOf('-'));
  const productId: string = String(id).substring(String(id).indexOf('-') + 1);

  useEffect(() => {
    const isPrice = (price:string) => {
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
  
  useEffect(() => {
    async function getProductData() {
      if (productId !== "") {
        const docRef = doc(db, 'menu', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setPrice(data.price);
          setImages([data.images]);
          setCategory(data.category);
          setThumbnail(data.images?.path)
        } else {
          console.log("404");
        }
      }
    }
    getProductData()
  }, [productId]);
  
  const registerBtn = async (name: string, category: string, price: string, images: Images[]) => {
    let pattern = /^([1-9]\d*|0)$/;
    if (name === "" || category === "" || price === "") {
      alert('全て入力してください。');
    } else if (pattern.test(price) !== true) {
      alert('半角で入力してください。')
    } else if (category !== 'Drink' && images === null) {
      alert('画像を入力してください。');
    } else {
      const editProductRef = doc(db, 'menu', productId);
      if (category !== 'Drink') {
        let data: ProductItem = { name: name, category: category, price: price };
        await updateDoc(editProductRef, data).then(() => {
          toAddMenuCollection(productId, data, categoryId, category)
        }).catch(() => {
          console.log('error')
        })
      } else {
        let data: ProductItem = { name: name, category: category, price: price, images: images };
        await updateDoc(editProductRef, data).then(() => {
          toAddMenuCollection(productId, data, categoryId, category)
        }).catch(() => {
          console.log('error')
        })
      }
    }
  };

  const toAddMenuCollection = async(productId: string, data: ProductItem, categoryId: string, category: string) => {
    const categoryRef = doc(db, "category", categoryId, category, productId);
    await updateDoc(categoryRef, data).then(() => {
      setName("");
      setCategory("");
      setPrice("");
      setCategory("");
      setThumbnail("")
    }).catch(() => {
      console.log('error')
    })
  }

  const deleteProduct = async (productCategory: string, productId: string, images:Images[]) => {
    if (productCategory !== "" && productId !== "") {
      if (productCategory !== 'Drink') {
        const desertRef = ref(storage, `files/${images[0].id}`);
        deleteObject(desertRef);
      }
      await deleteDoc(doc(db, 'menu', productId)).then(async () => {
        await deleteDoc(doc(db, 'category', categoryId, category, productId)).then(() => {
          alert('削除しました。');
          router.replace('/dashboard/edit');
        })
      }).catch(() => {
        alert('削除に失敗しました。');
      });
    }
  }

  return (
    <DashboardLayout>
      <div className={Styles.inner}>
        <h2>商品編集</h2>
        <div className={Styles.left}>
          <ImageArea categoryName={category} setImages={setImages} images={images} thumbnail={thumbnail} setThumbnail={setThumbnail} />
        </div>
        <div className={Styles.right}>
          <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off" >
            <div className={Styles.input}>
              <TextBox fullWidth={true} label={'商品名'} multiline={false} required={true} onChange={inputName} rows={1} value={name} type={'text'} />
            </div>
            <div className={Styles.input}>
              <SelectBox label={'カテゴリ―'} required={true} options={categories} select={setCategory} value={category} /> {/*categoryId={categoryId}*/}
            </div>
            <div className={Styles.input}>
              <TextBox fullWidth={true} label={'価格（税込み）'} multiline={false} required={true} onChange={inputPrice} rows={1} value={price} type={'text'} />
              {priceValidation ? <></> : <span className={Styles.validation}>半角数字で入力してください。</span>}
            </div>
            {/* {registerBx ? <div className={Styles.registerBtn} onClick={() => registerBtn(name, category, price, images)}>登録</div> : <></>} */}
            {(() => {
              if (category === 'Drink') {
                return <>{registerBx ? <div className={Styles.registerBtn} onClick={() => registerBtn(name,category,price,images)}>登録</div> : <></>}</>
              } else {
                return <>{registerBx ? <div className={Styles.registerBtn} onClick={() => registerBtn(name,category,price,images)}>登録</div> : <></>}</>
              }
            })()}
            <p className={Styles.deleteProductBtn} onClick={() => deleteProduct(productCategory, productId, images)}>削除</p>
          </Box>
        </div>
      </div>
    </DashboardLayout>
  )
};
export default Product;