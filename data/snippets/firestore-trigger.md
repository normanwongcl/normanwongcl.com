---
title: 'Firestore trigger'
date: '2022-02-28'
lastmod: '2022-02-28'
tags: ['javascript', 'firestore', 'firebase']
category: 'snippets'
draft: false
summary: Update multiple documents when a field in a document changed
authors: ['default']
---

```javascript
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

// As an admin, the app has read and write access to all data,
// regardless of Security Rules
const db = admin.firestore()
const regionId = 'asia-southeast1'

/**
 * Firestore trigger that update all documents in another collection
 * that consist of the product id when the product is updated
 */
export const dbTriggerToUpdateAllDocuments = functions
  .region(regionId)
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
    } catch (error) {
      console.error('Failed to update user bookings:', error.message)
    }
  })
```

# Introduction

This code snippet can be customized to use a different collection as a source and update multiple documents of whatever collection you want.

I will explain the code snippet and its usage using the following scenario:

Let's said that you have a few users, who had booked "ABC Training" on your website. "ABC Training" data came from a product document in the "products" collection, and the new booking data is stored in a collection called "bookingHistory".

Your admin recently decided to update "ABC Training" course's starting date and ending date.

Now, your "ABC Training" product in your products document have the **new data** entered by the admin.

But your users still have **stale data** (old data) in their "bookingHistory" collection.

In order to update all of the user bookings for "ABC Training", you need a write a cloud function to watch for an "update" event on the "products" collection.
