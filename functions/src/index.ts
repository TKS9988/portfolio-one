const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
const cors = require('cors');
import Stripe from 'stripe';
const stripe = new Stripe('STRIPE_SECRET_KEY' , { apiVersion: '2022-08-01' });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'NEXT_PUBLIC_FIREBASE_APP_APIS',
});

const sendResponse = (response:any, statusCode:number, body:any) => {
  response.send({
    statusCode,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body)
  })
}

const db = admin.firestore();

exports.getCategoryData = functions.https.onRequest((request:any, response:any) => {
  const categoryRef = db.collection('category').get();
    if (categoryRef) {
      db.collection('category').get().then((query:any) => {
          const categoryData: any = [];
          query.forEach((doc:any) => {
            let data = doc.data();
            data.categoryId = doc.id;
            categoryData.push(data)
          });
          response.status(200).json(categoryData)
        })
        .catch((error:any) => {
          response.send(error);
          response.status(500).send(error);
        });
    } else {
      const categoryData: any[] = [];
      response.status(200).json(categoryData)
    }
});

exports.getMenuData = functions.https.onRequest((request:any, response:any) => {
  const menuRef = db.collection('menu').get();
    if (menuRef) {
      db.collection('menu').get().then((query:any) => {
          const menuData: any[] = [];
          query.forEach((doc:any) => {
            let data = doc.data();
            data.id = doc.id;
            menuData.push(data)
          });
          response.status(200).json(menuData)
        })
        .catch((error:any) => {
          response.send(error);
          response.status(500).send(error);
        });
    } else {
      const menuData: any[] = [];
      response.status(200).json(menuData)
    }
});

exports.stripePaymentMethods = functions.https.onRequest((req:any, res:any) => {
  const corsHandler = cors({ origin: true });
  corsHandler(req, res, () => {
    if (req.method !== 'POST') {
      sendResponse(res, 405, { error: 'Invalid Request' });
    }
    return stripe.paymentIntents
      .create({
        amount: req.body.amount,
        currency: 'JPY',
        description: 'Tbilisi Burger',
        payment_method: req.body.id,
        confirm: true,
      })
      .then(() => {
        sendResponse(res, 200, { confirm: 'completed' });
      })
      .catch((error) => {
        console.error(error);
        sendResponse(res, 500, { error: error });
      });
  });
});