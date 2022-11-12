export interface ALLPRODUCT {
    name: string
    quantity: number
    category: string
    price: number
}
  
export interface COUNTER {
    value: number
    onIncrement: any
    onDecrement: any
}

export type PRODUCT = {
    burgerProduct: {
        id: string
        category: string
        images: string
        name: string
        orderBy: number
        price: string
        length: undefined | number
        fill:number
    },
    hamburgerCounter:number
}

export type CardStyles = {
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

export type Product = {
    category: string;
    id: string;
    images: string;
    name: string;
    orderBy: number | null;
    price: string;
}

export type DrinkProduct = {
    category: string;
    id: string;
    name: string;
    orderBy: number | null;
    price: string;
}
export type Props = {
    burgerProduct: Product[];
    hamburgerCounter: number[];
    comboProduct: Product[];
    comboCounter: number[];
    sideMenuProduct: Product[];
    sideMenuCounter: number[];
    drinkProduct: DrinkProduct[];
    drinkCounter: number[];
}
export type TopProps = {
    burgerProduct: Product[];
    comboProduct: Product[];
    sideMenuProduct: Product[];
    drinkProduct: DrinkProduct[];
}

export type SideMenuProps = {
    handleClick: any;
    sideMenuProduct: Product[];
    sideMenuCounter: number[];
    id: string;
}
export type HamburgerProps = {
    handleClick: any;
    burgerProduct: Product[];
    hamburgerCounter: number[];
    id: string;
}
export type ComboProps = {
    handleClick: any;
    menuProduct: Product[];
    comboCounter: number[];
    id: string;
}
export type DrinkProps = {
    handleClick: any;
    drinkProduct: DrinkProduct[];
    drinkCounter: number[];
    id: string;
}
  
type CartItem = {
    id: string;
    count: number;
    name: string;
    images: string;
    price: number | string | any;
    category?: string;
    quantity?: number;
}
export type CartItems = CartItem[];

type CartPageAddOrder = {
    name: string;
    quantity: number;
    id: string;
    category: string;
    images: string;
    price: number;
}
export type AddOrder = CartPageAddOrder[];

export type DashBoardProduct = {
    name: string;
    quantity: number;
    category: string;
    price: number;
  }
export type DashBoardProps = {
    allProduct: DashBoardProduct[];
    byDayTotalPrice: DashBoardProduct[];
    hamburger: DashBoardProduct[];
    combo: DashBoardProduct[];
    drink: DashBoardProduct[];
    sideMenu: DashBoardProduct[];
  }
export type DoughnutCartOption = {
    responsive: boolean,
    maintainAspectRatio: boolean,
  }
export type DashBoardRankingData = {
    labels: number[];
    datasets: {
        label: string;
        data: number[];
        fill: boolean;
        backgroundColor: string;
        borderColor: string;
    }[];
  }
export type CircleData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}
export type SalesProps = {
    allProduct: DashBoardProduct[];
    hamburger: DashBoardProduct[];
    combo: DashBoardProduct[];
    sideMenu: DashBoardProduct[];
    drink: DashBoardProduct[];
    monthAllProduct: DashBoardProduct[];
    monthHamburger: DashBoardProduct[];
    monthCombo: DashBoardProduct[];
    monthSideMenu: DashBoardProduct[];
    monthDrink: DashBoardProduct[];
}
export type DashBoardDetailOption = {
    centerText: {
        value: string;
        color: string;
        fontSizeAdjust: number;
    };
    plugins: {
        legend: {
            display: boolean;
        };
    };
  }
export type ShowInner = {
    name: string;
    quantity: number;
}
export type Images = {
    id: string;
    path: string;
}
export type Data = {
    category: string;
    id: string;
    images: string;
    name: string;
    price: number;
    quantity: number;
}
export type OrderData = {
    data: Data[];
    id: string;
    time: string;
    orderDay: string;
}
export type SortData = {
    key: number;
    number: number;
    list: any;
    category: string;
}
export type EditProduct = {
    category: string;
    id: string;
    images: string;
    name: string;
    orderBy: string | null;
    price: string;
    length: number;
}
export type EditDrinkProduct = {
    category: string;
    id: string;
    name: string;
    orderBy: string | null;
    price: string;
    length: number;
}
export type EditCategories = {
    id: number;
    name: string;
    category: string
}
export type CompleteView = {
    categoryName: string;
    images: Images;
    category: string;
    setRegisterComplete: React.Dispatch<React.SetStateAction<boolean>>;
    nameRef: React.MutableRefObject<HTMLInputElement>;
    priceRef: React.MutableRefObject<HTMLInputElement>;
}
export type ImagesBxProps = {
    categoryName: string;
    setImages: React.Dispatch<React.SetStateAction<Images>>;
    images: Images;
    thumbnail: string;
    setThumbnail: React.Dispatch<React.SetStateAction<string>>
}
  
export type DataSet = {
    name: string;
    data: DashBoardProduct[];
}[]

export type AllProduct = {
    allProduct: DashBoardProduct[];
    hamburger: DashBoardProduct[];
    combo: DashBoardProduct[];
    sideMenu: DashBoardProduct[];
    drink: DashBoardProduct[];
    monthAllProduct: DashBoardProduct[];
    monthHamburger: DashBoardProduct[];
    monthCombo: DashBoardProduct[];
    monthSideMenu: DashBoardProduct[];
    monthDrink: DashBoardProduct[];
    searchAllProduct: DashBoardProduct[];
    searchHamburger: DashBoardProduct[];
    searchCombo: DashBoardProduct[];
    searchSideMenu: DashBoardProduct[];
    searchDrink: DashBoardProduct[];
}

export type BooleanState = {
    showAllSalesData: boolean;
    showAllProduct: boolean;
    showHamburger: boolean;
    showCombo: boolean;
    showSideMenu: boolean;
    showDrink: boolean;
    showMonthAllProduct: boolean;
    showMonthHamburger: boolean;
    showMonthCombo: boolean;
    showMonthSideMenu: boolean;
    showMonthDrink: boolean;
    showSearchAllProduct: boolean;
    showSearchHamburger: boolean;
    showSearchCombo: boolean;
    showSearchSideMenu: boolean;
    showSearchDrink: boolean;
}
export type SetBooleanState =  React.Dispatch<React.SetStateAction<{
    showAllSalesData: boolean;
    showAllProduct: boolean;
    showHamburger: boolean;
    showCombo: boolean;
    showSideMenu: boolean;
    showMonthAllProduct: boolean;
    showMonthHamburger: boolean;
    showMonthCombo: boolean;
    showMonthSideMenu: boolean;
  showMonthDrink: boolean;
  showSearchAllProduct: boolean;
  showSearchHamburger: boolean;
  showSearchCombo: boolean;
  showSearchSideMenu: boolean;
  showSearchDrink: boolean;
}>>
export type SelectNavBar = {
    todaySales: boolean;
    monthSales: boolean;
    searchSales: boolean;
    choiceToday: boolean;
    choiceMonth: boolean;
    choiceSearch: boolean;
}
export type SetSelectNavBar = React.Dispatch<React.SetStateAction<{
    todaySales: boolean;
    monthSales: boolean;
    searchSales: boolean;
    choiceToday: boolean;
    choiceMonth: boolean;
    choiceSearch: boolean;
  }>>