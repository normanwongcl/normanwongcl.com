---
title: 'Writing an api in Next.js to send an email from a contact form'
date: '2022-03-01'
lastmod: '2022-03-01'
tags: ['typescript', 'next.js', 'sendgrid']
category: 'snippets'
draft: false
summary: Code snippet showing you how to santize form data and sending an email using SendGrid API.
authors: ['default']
---

```ts
import sendgrid from '@sendgrid/mail'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { NextApiRequest, NextApiResponse } from 'next'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

type contactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

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

  // Create email template
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
      to: 'myEmail@outlook.com', // Your email where you'll receive emails
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
