---
title: Webhook
id: webhook
date: 2019-02-13
full_link: /docs/reference/access-authn-authz/webhook/
short_description: >
  A way to notify a web service via HTTP, in real time.

aka:
tags:
- networking
---
 A de facto mechanism for sending event notifications to an external web service.

<!--more-->

The two components need not be related, and often are not. The sender need only
know the URL of the recipient side. Typically, the sending side makes a `POST`
request to a pre-arranged URL on the recipient component. The body of that `POST`
is either empty, or consists of machine-readable data such as JSON.
On the receiving side, the webhook's arrival can trigger further processing such
as invalidating a cache and refetching.

In Kubernetes, “webhook mode” refers to calling an external service via HTTP.
For example, there are [admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
that intercept requests to the Kubernetes API server and send these to an
external service. These admission controllers stall the original request
until the external service has responded.

For more on webhooks in general, see [What Webhooks Are And Why You Should Care](http://timothyfitz.com/2009/02/09/what-webhooks-are-and-why-you-should-care/).
