import Image from 'next/image';
import CheckIcon from '@mui/icons-material/Check';
import Styles from '../../../pages/dashboard/Dashboard.module.scss';
import { useRouter } from 'next/router';
import { Images } from '../../../types/Types';

type Props = {
  categoryName: string;
  images: Images;
  category: string;
  nameRef: React.MutableRefObject<HTMLInputElement>;
  priceRef: React.MutableRefObject<HTMLInputElement>;
  registerCloseBtn: any;
  setRegisterComplete?: React.Dispatch<React.SetStateAction<boolean>>
}

const CompleteView: React.FC<Props> = (props) => {
  const { categoryName, images, category, nameRef, priceRef, registerCloseBtn } = props; 
  const name = nameRef.current.value;
  const price = priceRef.current.value;
  const router = useRouter();
  const CloseBtn = () => <button onClick={() => registerCloseBtn()}>close</button>
  const GotoEditBtn = () => <button onClick={() => router.replace('/dashboard/edit')}>close</button>

  return (
    <div className={Styles.showAlertBx}>
      <div className={Styles.inner}>
        <div className={Styles.completeBx}>
          <span className={Styles.icons}>
            <CheckIcon />
          </span>
          <h3>Complete!</h3>
          {(() => {
            if (categoryName === "Drink") {
              return <></>
            } else {
              return (
                <div className={Styles.productPreviewBx}>
                    <Image
                      src={images.path}
                      alt={'A thumbnail of the question'}
                      layout="fill"
                      objectFit="contain"
                      priority={true}
                    />
                </div>
              )
            }
          })()}
          <div className={Styles.ovf}>
            <p>{name}</p>
            <p>{price}€</p>
          </div>
          <p className={Styles.categoryName}>category : {category}</p>
          {(() => {
            if (router.query.id) {
              return <GotoEditBtn />
            } else {
              return <CloseBtn />
            }
          })()}
        </div>
      </div>
    </div>
  )
}
export default CompleteView;