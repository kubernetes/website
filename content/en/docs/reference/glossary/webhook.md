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
You can configure Kubernetes so that its API server makes a `POST` to an
external service when processing certain requests. The API server waits for
a response to that `POST` so that it can continue processing the original
request.
