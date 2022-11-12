import CheckIcon from '@mui/icons-material/Check';
import Styles from '../../../pages/dashboard/Dashboard.module.scss';

type Props = {
  newCategoryName: string;
  createCategoryName: string;
  closeBtn:any;
  productIdLst:any[]
}

const CategoryCompleteView: React.FC<Props> = (props) => {
  const { newCategoryName,createCategoryName, closeBtn, productIdLst  } = props;
  const categoryName = createCategoryName ? createCategoryName : newCategoryName ? newCategoryName : '';
  return (
    <div className={Styles.showAlertBx}>
      <div className={Styles.inner}>
        <div className={Styles.completeBx}>
          <span className={Styles.icons}>
            <CheckIcon />
          </span>
          <h3>Complete!</h3>
          <div className={Styles.ovf}>
            <h4>「{categoryName}」</h4>
            {productIdLst.length > 0 ? <p className={Styles.center}>The menu registered in this category have also been updated.</p> : <></>}
          </div>
          <button onClick={() => closeBtn()}>close</button>
        </div>
      </div>
    </div>
  )
}
export default CategoryCompleteView;