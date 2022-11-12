import React from 'react';
import Image from 'next/image'
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { storage } from '../../../firebase/clientApp';
import noImage from '../../../assets/images/no-image.png'
import { Images } from '../../../types/Types';
import Styles from '../../../pages/dashboard/Dashboard.module.scss';

type Props = {
  setImages: React.Dispatch<React.SetStateAction<Images[]>>;
  images: Images[];
  thumbnail: string;
  setThumbnail: React.Dispatch<React.SetStateAction<string>>;
  categoryName: string;
} 

const ImageArea:React.FC<Props> = (props) => {
  const {categoryName, setImages, images, thumbnail, setThumbnail} = props;
  
  const deleteStorage = (images: Images[]) => {
    const desertRef = ref(storage, `files/${images[0].id}`);
    deleteObject(desertRef).then(() => {
      alert('削除しました。');
      setThumbnail("");
      setImages([]);;
      }).catch((error) => {
        alert('削除に失敗しました。');
        console.log(error)
      });
  }

  const onChange = async (e) => {
    const blobImage = e.target.files[0];
    if (blobImage !== undefined) {
      if (/image.*/.exec(blobImage.type)) {
        const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWSYZ0123456789';
        const N = 16;
        const fileName: string = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join('');
        const uploadRef = ref(storage, `files/${fileName}`);
        const uploadTask = uploadBytesResumable(uploadRef, blobImage);
        uploadTask.then(() => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setThumbnail(downloadURL);
            setImages([{ id: fileName, path: downloadURL }]);
          });
        });
      } else {
        console.log('データの読み込みに失敗しました。');
      }
    }
  }

  return (
    <>
      {(() => {
        if (categoryName === 'Drink') {
          return <div className={Styles.notSetImagesBx}><p>ドリンクメニュ―は画像登録できません。</p></div>
        } else {
          return <>
              {thumbnail ? 
                <>
                  <div className={Styles.setImagesBx}>
                    <span>
                      <Image src={thumbnail} alt={'A thumbnail of the question'} layout="fill" objectFit="contain" priority={true} />
                    </span>
                  </div>
                  <div className={Styles.Register_images_bx}>
                    <span onClick={() => deleteStorage(images)}>
                      <AddPhotoAlternateIcon />削除
                    </span>
                  </div>
                </> :
                <>
                  <div className={Styles.setImagesBx}>
                    <span>
                      <Image src={noImage} alt={'A thumbnail of the question'} layout="fill" objectFit="contain" priority={true} />
                    </span>
                  </div>
                  <div className={Styles.Register_images_bx}>
                    <label>
                      <input type="file" name="file" onChange={onChange} /><AddPhotoAlternateIcon />商品画像を登録
                    </label>
                  </div>
                </>
              }
            </>
         }
      })()}
    </>
  )
} 
export default ImageArea