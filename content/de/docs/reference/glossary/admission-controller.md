---
title: Zugangscontroller
id: admission-controller
date: 2019-06-28
full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >
  Ein Teil Code, das Anfragen an den Kubernetes API Server abfängt, vor der Persistenz eines Objekts.

aka:
tags:
- extension
- security
---
Ein Teil Code, das Anfragen an den Kubernetes API Server abfängt, vor der Persistenz eines Objekts.

<!--more-->

Zugangscontroller für den Kubernetes API Server sind konfigurierbar, und können "validierend", "verändernd", oder beides sein. Jeder Zugangscontroller kann die Anfrage ablehnen. Verändernde Controller können die Objekte ändern, die sie zulassen; validierende Controller dürfen das nicht.

* [Zugangscontroller in der Kubernetes Dokumentation](/docs/reference/access-authn-authz/admission-controllers/)
