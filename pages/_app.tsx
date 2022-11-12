import '../styles/globals.css';
import HeadSettings from '../components/HeadSetting';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <HeadSettings />
      <Component {...pageProps} />
  </>
  );
}

export default MyApp
