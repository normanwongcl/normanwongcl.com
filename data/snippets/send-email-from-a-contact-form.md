---
title: 'Writing an api in Next.js to send an email from a contact form'
date: '2022-03-02'
lastmod: '2022-03-02'
tags: ['typescript', 'next.js', 'sendgrid']
category: 'snippets'
draft: false
summary: Code snippet showing you how to sanitize form data and sending an email using SendGrid API.
authors: ['default']
---

# Introduction

In this article, I will show you how to sanitize your contact form data and send an email using SendGrid API in your Next.js project.

First, try to create a contact form similar to the one below.

![Picture of Contact Us Form](/static/images/contact-us-form.png)

We'll have 4 fields:

- Name (the name of the person who is sending the email)
- Email (the email of the person who is sending the email)
- Subject (The title of the email that we see when we open our email client: gmail, outlook, etc)
- Message (The message send to us)

```ts
// Contact form data types for readers who are using TypeScript
// Skip this code for those using JavaScript
export type contactFormData = {
  name: string
  email: string
  subject: string
  message: string
}
```

Then, add the following logic in your contact page for handling form submission.

```ts
const onSubmit = async (data: ContactData) => {
  // ...logic to set isLoading that you can set up

  // send the contact form data to the api
  await fetch('/api/contact', {
    body: JSON.stringify({
      email: data.email,
      name: data.name,
      subject: data.subject,
      message: data.message,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then(() => {
      // ...logic to set isLoading, provide success message and reset form
    })
    .catch((err) => {
      // ...logic to set isLoading, provide error message and reset form
    })
}
```

Now, we can create our api endpoint to handle the form submission.

```ts
// In your Next.js project. Place this file in the pages/api folder. Name it contact.ts
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { NextApiRequest, NextApiResponse } from 'next'
import { contactFormData } from 'types/contactFormData'

import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, subject, message } = req.body as contactFormData

  // In order for DOMPurify to work, we need to emulate the browser environment
  const windowEmulator = new JSDOM('').window
  const DOMPurify = createDOMPurify(windowEmulator as any)

  // Sanitize inputs
  const cleanName = DOMPurify.sanitize(name)
  const cleanEmail = DOMPurify.sanitize(email)
  const cleanSubject = DOMPurify.sanitize(subject)
  const cleanMessage = DOMPurify.sanitize(message)

  // Replace all new line in message with <br>
  const formattedMessage = cleanMessage.replace(/(?:\r\n|\r|\n)/g, '<br>')

  // Create email template. You can use https://stripo.email/ to generate your own email template
  const emailTemplate = (name: string, email: string, subject: string, message: string): string => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
          <meta charset="UTF-8">
          <meta content="width=device-width, initial-scale=1" name="viewport">
          <meta name="x-apple-disable-message-reformatting">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta content="telephone=no" name="format-detection">
          <title>[Contact Form] - ${subject}</title>
          <!--[if (mso 16)]>
          <style type="text/css">
          a {text-decoration: none;}
          </style>
          <![endif]-->
          <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
          <!--[if gte mso 9]>
      <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG></o:AllowPNG>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      </head>
      
      <body>
          <div class="es-wrapper-color">
              <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
              <v:fill type="tile" color="#fafafa"></v:fill>
            </v:background>
          <![endif]-->
              <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                      <tr>
                          <td class="esd-email-paddings" valign="top">
                              <table class="es-content es-visible-simple-html-only esd-footer-popover" cellspacing="0" cellpadding="0" align="center">
                                  <tbody>
                                      <tr>
                                          <td class="esd-stripe es-stripe-html" align="center">
                                              <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                  <tbody>
                                                      <tr>
                                                          <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                              <table width="100%" cellspacing="0" cellpadding="0">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td class="esd-block-text es-p5t es-p10b es-m-txt-l" align="left">
                                                                                              <h3>Name: ${name}, Email: ${email}</h3>
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td class="esd-block-text es-p5t es-p10b" align="left">
                                                                                              <p>
                                                                                              ${message}
                                                                                              </p> 
                                                                                          </td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </body>
      </html>`
  }

  try {
    await sendgrid.send({
      to: 'myemail@outlook.com', // Your email where you'll receive emails
      from: 'contact@domain.com', // Your website email address here
      subject: `[Contact Form] - ${cleanSubject}`,
      html: emailTemplate(cleanName, cleanEmail, cleanSubject, formattedMessage),
    })
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message })
  }
  return res.status(200).json({ error: '' })
}

export default sendEmail
```

Now, test your contact form by copy pasting the message to your message field.

```
It's been a year since you joined our team.
You had your ups and downs. But I am extremely happy you are one of us.

It's been a nice year together. You showed yourself as a skilled professional.

We hope to have a long-term relationship with you.

Regards,
Norman Wong
<img src="http://unsplash.it/100/100?random" onload="alert('you got hacked');" />
<script>window.open(`http://normanwongcl.com`)</script>
```

In your inbox, you will see your email.

![Sanitised Email](/static/images/sanitised-email.png)

Congrats for finishing the tutorial! Any feedback or suggestion is welcome.
