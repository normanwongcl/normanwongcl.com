---
title: 'How to automatically create a new customer account in Stripe using firestore trigger'
date: '2022-03-01'
lastmod: '2022-03-01'
tags: ['javascript', 'firestore', 'firebase', 'stripe']
category: 'snippets'
draft: false
summary: Code snippet to show you how to create a customer account in Stripe using firestore trigger
authors: ['default']
---

```js
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import Stripe from 'stripe'

const regionId = 'asia-southeast1'
const usersCollection = 'users'
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2020-08-27' })

/**
 * Create a new customer in Stripe when a user document is created.
 */
const createUserRecord = async ({ email, name, uid }) => {
  try {
    if (email) userData.email = email
    if (name) userData.name = name

    // Create a new customer in Stripe.
    const customer = await stripe.customers.create(userData)

    // Add a mapping of their stripe account
    const customerRecord = {
      email: customer.email,
      name: customer.name,
      stripeId: customer.id,
      stripeLink: `https://dashboard.stripe.com${customer.livemode ? '' : '/test'}/customers/${
        customer.id
      }`,
    }

    // update the user's document in firestore
    await admin
      .firestore()
      .collection(usersCollection)
      .doc(uid)
      .set(customerRecord, { merge: true })
  } catch (error) {
    console.error(`Failed to create user record ${uid}: `, error.message)
  }
}

/**
 * Firestore trigger that run when a new user document is created.
 */
export const createCustomer = functions
  .region(regionId)
  .firestore.document('/users/{documentId}')
  .onCreate(async (snap) => {
    const user = snap.data()

    const { email, name, uid } = user

    await createCustomerRecord({ email, name, uid })
  })
```

# Introduction

This code snippet shows the general idea for creating a new customer account in stripe after a new user document is created in firestore.
