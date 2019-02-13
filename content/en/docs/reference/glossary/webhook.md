---
title: Webhook
id: webhook
date: 2019-02-13
full_link: /docs/reference/access-authn-authz/webhook/
short_description: >
  A way for one component to notify another component in real time, via HTTP.

aka:
tags:
- networking
---
 A notification message sent from one component to another component's unique URL,
 via HTTP.

<!--more-->

The two components need not be related, and often are not. The sender need only
know the URL of the recipient side. Typically, a webhook makes a `POST` request
that includes a payload in JSON format. On the recipient side, the webhook can
trigger further processing such as invalidating a cache and refetching.

In Kubernetes, “webhook mode” refers to calling an external service via HTTP.
For example, there are [admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
that intercept requests to the Kubernetes API server and send these to an
external service. These admission controllers stall the original request
until the external service has responded.

For more on webhooks in general, see [What Webhooks Are And Why You Should Care](http://timothyfitz.com/2009/02/09/what-webhooks-are-and-why-you-should-care/).
