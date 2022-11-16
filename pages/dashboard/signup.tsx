import React,{useState,useCallback} from 'react'
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { isValidEmailFormat } from "../../lib/validation";
import logo from '../../assets/images/logo2.png'
import { auth } from "../../firebase/clientApp";
import styles from './Sign.module.scss';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../../firebase/clientApp';
const SignUp = () => {
  const [name, setName] = useState(""),
  [email, setEmail] = useState(""),
  [password, setPassword] = useState(""),
  [confirmPassword, setConfirmPassword] = useState("");
  const inputName = useCallback((event) => { setName(event.target.value) }, [setName]);
  const inputEmail = useCallback((event) => { setEmail(event.target.value) }, [setEmail]);
  const inputPassword = useCallback((event) => { setPassword(event.target.value) }, [setPassword]); 
  const inputConfirmPassword = useCallback((event) => { setConfirmPassword(event.target.value) }, [setConfirmPassword]);
  
  const toSignUp = (name: string,email: string,password: string,confirmPassword: string) => {
    if (name === "" || email === "" || password === "" || confirmPassword === "") {
      alert("必須項目が未入力です。");
      return false
    }
    if (password !== confirmPassword) {
      alert("パスワードが一致しません。");
      return false
    }
    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください。");
      return false
    }
    if (!isValidEmailFormat(email)) {
      alert('メールアドレスの形式が不正です。もう1度お試しください。');
      return false
    }
    createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const user = userCredential.user;
      if (user.uid) {
        const docRef = doc(db, "user", user.uid);
        const data = {
          name: name,
          email: email
        }
        await setDoc(docRef, data).then(() => {
          alert('登録が完了しました。')
          Router.push('/dashboard')
        }).catch(async () => {
          alert("登録できませんでした。");
        });
      }
    })
}
  return (
    <div className={styles.container}>
      <div className={styles.signInInner}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <div className={styles.logoBx}>
              <Image src={logo} alt="logo" width="35px" height="35px" />
            </div>
            <p>Tbilisi Burger</p>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.signUpBx}>
            <h1>Sign up</h1>
            <input className={styles.inputBx} placeholder='Full Name（フルネーム）' type={"text"} onChange={inputName} value={name} />
            <input className={styles.inputBx} placeholder='Email（メールアドレス）' type={"email"} onChange={inputEmail} value={email} />
            <input className={styles.inputBx} placeholder='Password（パスワード）' type={"password"} onChange={inputPassword} value={password} />
            <input className={styles.inputBx} placeholder='confirmPassword（確認用パスワード）' type={"password"} onChange={inputConfirmPassword} value={confirmPassword} />
            <button onClick={() => toSignUp(name, email, password, confirmPassword)}>登録</button>
            <Link href={'/dashboard/signin'}>
              <a>
                <p>ログインはこちら</p>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignUp