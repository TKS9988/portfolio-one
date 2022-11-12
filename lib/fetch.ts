import fetch from 'node-fetch'

type Product = {
  id: string
  category: string
  images?: string
  name: string
  orderBy: number
  price: string
}
type Category = {
  id: string
  name: string
  orderBy: number
}

export const getCategoryData = async () => {
  const res = await fetch(new URL(process.env.NEXT_PUBLIC_API_BASE_URL + "/getCategoryData"))
  let category = await res.json() as Category[];
  category.sort((a, b) => a.orderBy - b.orderBy)
  return category
}

export const getMenuData = async () => {
  const res = await fetch(new URL(process.env.NEXT_PUBLIC_API_BASE_URL + "/getMenuData"))
  let menu = await res.json() as Product[];
  menu.sort((a, b) => a.orderBy - b.orderBy)
  return menu
}