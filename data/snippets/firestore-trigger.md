---
title: 'Firestore trigger'
date: '2022-02-28'
lastmod: '2022-02-28'
tags: ['javascript', 'firestore', 'firebase']
category: 'snippets'
draft: false
summary: Using firestore trigger to update multiple documents within another collection, when the value of a field changes in a document.
authors: ['default']
---

# Introduction

Here's a scenario where this code snippet is useful.

Let's said that you have a few users, who had booked "ABC Training" on your website. "ABC Training" data came from a product document in the "products" collection, and the new booking data is stored in a collection called "bookingHistory".

Your admin recently decided to update "ABC Training" course's starting date and ending date.

Now, your "ABC Training" product in your products document have the **new data** entered by the admin.

But your users still have **stale data** (old data) in their "bookingHistory" collection.

In order to update all of the booking data that have "ABC Training", you need a write a cloud function to watch for an "update" event on the "products" collection.

This code snippet can be customized to use a different collection and update multiple documents of whatever collection you want.

```javascript
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

// As an admin, the app has read and write access to all data,
// regardless of Security Rules
const db = admin.firestore()

/**
 * Firestore trigger that update all documents in another collection
 * that consist of the product id when the product is updated
 */
export const dbTriggerToUpdateAllDocuments = functions
  .region(process.env.REGION)
  .firestore.document(`products/{productId}`) // the document to watch
  .onUpdate(async (snap, context) => {
    try {
      const payload = snap.after.data() // data from the product document
      const id = context.params.productId
      await db
        .collection(`bookingHistory`) // documents within the collection to update
        .where('productId', '==', id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            db.doc(`bookingHistory/${doc.id}`).update({
              ...payload,
            })
          })
        })
    } catch (e) {
      console.error(e)
    }
  })
```
