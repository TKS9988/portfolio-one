 import React,{useState,useCallback} from 'react'
import Image from "next/image"
import Router from "next/router"
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { isValidEmailFormat,isValidRequiredInput,} from "../../lib/validation"
import { auth } from "../../firebase/clientApp"
import logo from '../../assets/images/logo2.png'
import styles from './Sign.module.scss';

const Signin:React.FC = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  const inputEmail = useCallback((event) => { setEmail(event.target.value) }, [setEmail]);
  const inputPassword = useCallback((event) => { setPassword(event.target.value) }, [setPassword]);

  const toLogin = (email, password) => {
    if (!isValidRequiredInput(email, password)) {
      alert('メールアドレスかパスワードが未入力です。')
      return false
    }
    if (!isValidEmailFormat(email)) {
      alert('メールアドレスの形式が不正です。')
      return false
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Router.push("/dashboard");
      })
      .catch(() => {
        alert("ログインできませんでした。。。");
      });
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
          <div className={styles.loginBx}>
            <h1>Sign in</h1>
            <input className={styles.inputBx} placeholder='Email（メールアドレス）' type={"email"} onChange={inputEmail} value={email} />
            <input className={styles.inputBx} placeholder='Password（パスワード）' type={"password"} onChange={inputPassword} value={password} />
            <button onClick={() => toLogin(email, password)}>ログイン</button>
            <Link href={'/dashboard/signup'}>
              <a>
                <p>登録はこちら</p>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Signin