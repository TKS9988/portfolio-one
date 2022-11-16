/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head';
import { useRouter } from 'next/router';

const HeadSettings: React.FC = () => {
  const router = useRouter();
  const pathName = router.pathname;

  const titles = () => {
    if (pathName.indexOf('/dashboard') !== -1) {
      return 'ダッシュボード';
    } else if (pathName.indexOf('/cart') !== -1) {
      return 'カートページ';
    } else {
      return 'トビリシの人気料理店';
    }
  };

  const descriptionContents = () => {
    if (pathName.indexOf('/dashboard') !== -1) {
      return 'トビリシバーガー、スタッフ専用ページ';
    } else if (pathName.indexOf('/cart') !== -1) {
      return 'トビリシバーガー、カートページ';
    } else {
      return 'ジョージアで人気ナンバー１に輝いた幻のジョージア牛を使用したハンバーガーショップのトビリシバーガー！バトゥミやカヘティ地方で取れた新鮮な野菜を使用した１００％ジョージア産のハンバーガー。';
    }
  };

  const imageUrl =
    'https://firebasestorage.googleapis.com/v0/b/hamburger-shop-45f18.appspot.com/o/images%2Fhamburger-shop.png?alt=media&token=44b92581-10ac-4b01-9acf-07648735e6d3';
  const imgWidth = 1280;
  const imgHeight = 800;

  return (
    <Head>
      <title>{`Tbilisi Burger | ${titles()}`}</title>
      <meta name="description" content={descriptionContents()} />
      <link rel="icon" href="/favicon.ico" />
      <link href="https://fonts.googleapis.com/css2?family=Paytone+One&display=swap" rel="stylesheet" />
      <meta name="robots" content="noindex"></meta>
      <meta property="og:url" content="https://portfolio-virid-rho-27.vercel.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="ジョージア人気レストランバー第一位獲得|トビリシバーガー" />
      <meta property="og:description" content="ジョージアで人気ナンバー１に輝いた幻のジョージア牛を使用したハンバーガーショップ、トビリシバーガー！バトゥミやカヘティ地方で取れた新鮮な野菜を使用した１００％ジョージア産のハンバーガー。" />
      <meta property="og:site_name" content="トビリシの人気料理店|トビリシバーガー" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(imgWidth)} />
      <meta property="og:image:height" content={String(imgHeight)} />
    </Head>
  );
};
export default HeadSettings;
