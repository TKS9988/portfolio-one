/* eslint-disable react-hooks/exhaustive-deps */
import Styles from '../Dashboard.module.scss'
import Link from 'next/link'
import { getMenuData, getCategoryData } from '../../../lib/fetch';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { DashboardLayout } from '../../../components/dashboard/dashboardLayout'
import React, { useEffect, useState } from 'react'

type Props = {
  name: string;
  orderBy: number;
  id: string;
  categories: any[];
  menuData: any[];
}

const Edit: React.FC<Props> = (props) => {
  const [categoryByMenuData, setCategoryByMenuData] = useState<any[]>([]);
 const {categories, menuData} = props
  const [viewContents, setViewContents] = useState(false)

  useEffect(() => {
    setViewContents(true)
    const data = [];
    for (let i = 0; i < categories.length; i++){
      const categoryItem = menuData.filter((num) => num.category === categories[i].name);
      data.push({name: categories[i].name, data:categoryItem})
    }
    setCategoryByMenuData(data)
    setViewContents(false)
  }, [])

  return (
    <DashboardLayout>
      <div className={Styles.inner}>
        <h2>商品編集</h2>
        <div className={Styles.categoryList}>
          <ul className={Styles.edit}>
            {categories.length > 0 && (
              categories.map((list, index:number) => (
                <li key={index}><a href={`#${list.name}`}>{list.name}</a></li>
              ))
            )}
          </ul>
         </div>
         {viewContents ?
          <></>
          : 
          <div>
          {categoryByMenuData.length > 0 && (
            categoryByMenuData.map((list, index:number) => (
              <div key={index} className={Styles.categoryBx}>
                <h3 id={`${list.name}`}>{list.name}</h3>
                <ul className={Styles.productListBx}>
                  {list.data.length > 0 && (
                    list.data.map((item, index) => (
                      <li key={index} className={Styles.itemBx}>
                        <div className={Styles.item}>
                          <Link href={`/dashboard/edit/${item.category}-${item.id}`}>
                            <a>
                              {item.images ? <span className={Styles.imageBx}><Image src={item.images.path} layout='fill' objectFit="contain" alt={'A thumbnail of the question'} /></span> : <></>}
                              <h4>{item.name}</h4>
                              <p>{Number(item.price).toLocaleString()}円（税込）</p>
                            </a>
                          </Link>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))
          )}
          </div>
          }
      </div>
    </DashboardLayout>
  );
};
export default Edit

export const getStaticProps: GetStaticProps = async () => {
  const menuData = await getMenuData();
  const categories = await getCategoryData();
  return {
    props: {
      menuData,
      categories
    }
  }
}