import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
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

exports.getCategoryData = functions.https.onRequest(async (request, response) => {
  try {
    const categoryRef = await db.collection('category').get();
    if (categoryRef) {
      db.collection('category').get().then((query) => {
        console.log(query.docs.map((doc) => doc.id))
        const categoryData: any = [];
        query.forEach((doc) => {
          let data = doc.data();
          data.categoryId = doc.id;
          categoryData.push(data)
        })
        response.status(200).json(categoryData)
      }).catch((e) => {
        console.error(e);
        response.status(500).send(e);
      });
    } else {
      response.status(500).send('error categoryRef');
    }
  } catch (e) {
    console.error(e);
    response.status(500).send(e);
  }
});

exports.getMenuData = functions.https.onRequest(async (request, response) => {
  try {
    const menuRef = await db.collection("menu").get();
    if (menuRef) {
      db.collection("menu").get().then((query) => {
        console.log(query.docs.map((doc) => doc.id))
        const menuData:any = [];
        query.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          menuData.push(data)
        })
        response.status(200).json(menuData)
      }).catch((e) => {
            console.error(e);
            response.status(500).send(e);
          });
      } else {
        response.status(500).send('error menuRef');
      }
  } catch (e) {
      console.error(e);
      response.status(500).send(e);
  }
});

exports.stripePaymentMethods = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });
  corsHandler(req, res, () => {
      if (req.method !== 'POST') {
          sendResponse(res, 405, { error: "Invalid Request" })
      }
      return stripe.paymentIntents.create({
          amount:req.body.amount,
          currency: "JPY",
          description: "Tbilisi Burger",
          payment_method: req.body.id,
          confirm: true
      }).then(() => {
          sendResponse(res, 200, {confirm: "completed"});
      }).catch((error) => {
          console.error(error);
          sendResponse(res, 500, { error: error })
      })
  })
})