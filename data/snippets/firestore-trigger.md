---
title: 'Firestore trigger'
date: '2022-02-28'
lastmod: '2022-03-01'
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
 * Firestore trigger that update documents in another collection
 * that consist of the product id when the product is updated
 */
export const dbTriggerToUpdateAllDocuments = functions
  .region(regionId)
  .firestore.document(`products/{productId}`) // the document to watch
  .onUpdate(async (snap, context) => {
    // watch for "update" event
    try {
      const payload = snap.after.data() // data from the product document
      const id = context.params.productId
      await db
        .collection(`bookingHistory`) // documents within the collection to update
        .where('productId', '==', id) // get only documents that have their productId field matching the id
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // the "doc" object come with an id property that we can use to update specific bookings
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

## Example usage

Let's said that you have a few users, who had booked "ABC Training" on your website. "ABC Training" data came from a product document in the "products" collection, and the new booking data is stored in a collection called "bookingHistory".

Your business admin recently decided to updated the trainers who will be teaching "ABC Training" course.

![Admin form](/static/images/admin-form.png)

Now, the "ABC Training" data in your products document have the **new data** entered by the admin.

But your users still have **stale data** (old data), where originally, the trainer was set to **Van** in their "bookingHistory" collection, as seen in the picture below.

![User booking data](/static/images/user-booking-example.png)

In order to update all of the user bookings for "ABC Training", you need to write a cloud function to watch for an "update" event on the "products" collection.
