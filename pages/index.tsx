import { useEffect, useState } from 'react'
import styles from './styles/Top.module.scss'
import Image from 'next/image'
import Link from 'next/link';
import Kv from '../assets/images/berger.png'
import IconButton from '@mui/material/IconButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { Menu } from '../components/clientPage';
import { styled } from '@mui/material/styles';
import { GetStaticProps } from 'next';
import logo from '../assets/images/logo.png'
import { getMenuData,getCategoryData } from '../lib/fetch'

type Props = {
  menuData: any[];
  categoryData: any[];
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Home: React.FC<Props> = (props) => {
  const { menuData, categoryData } = props;
  const [cartItem, setCartItem] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = sessionStorage.getItem('cartItem');
      if (item === null) {
        return
      } else {
        const cartData = JSON.parse(item)
        setCartItem(cartData.length)
      }
    } else {
      return
    }
  }, [])

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const item = sessionStorage.getItem('cartItem')
      if (item === null) {
        return
      } else {
        const cartData = JSON.parse(item)
        setCartItem(cartData.length)
      }
    } else {
      return
    }
    }

  const [scrollY, setScrollY] = useState(0)
  const handleScroll = () => {
    setScrollY(window.scrollY)
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  }, [])

  const [windowSize, setWindowSize] = useState(0);
  useEffect(() => {
    const handleResize = () => {

      setWindowSize(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
  }, [])
  
  return (
    <div className={styles.container}>
      <div className={(() => { if (scrollY > windowSize) {return styles.headerMove;} else { return styles.header;}})()}>
        <div className={styles.logoBx}>
          <Image src={logo} alt="logo" width="35px" height="35px" />
        </div>
        <div className={styles.toCart}>
            <Link href={'/cart'}>
            <a>
              <IconButton aria-label="cart">
              <StyledBadge badgeContent={cartItem} color="secondary">
                            <ShoppingCartIcon className={styles.cartIcon} />
                        </StyledBadge>
                    </IconButton>
                </a>
            </Link>
        </div>
      </div>
      <div className={styles.kv}>
        <div className={styles.left}>
          <div className={styles.copyBx}>
            <h1>Tbilisi<br />burger</h1>
            <p>ヨーロッパのチーズと国産牛肉を１００％使用</p>
            <div className={styles.btn}><a href="#Hamburger">メニューへ</a></div>
          </div>
        </div>
        <div className={styles.right}><p>burger</p></div>
        <div className={styles.imagesBx}>
          <Image src={Kv} alt="kv" objectFit="contain" priority={true} />
        </div>
      </div>
      <section id="menu">
        <Menu handleClick={handleClick} menuData={menuData} categoryData={categoryData} />
      </section>
    </div>
  );
};
export default Home

export const getStaticProps: GetStaticProps = async () => {
  const menuData = await getMenuData()
  const categoryData = await getCategoryData()
  return {
    props: {
      menuData,
      categoryData,
    }
  }
}
