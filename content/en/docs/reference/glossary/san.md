---
title: Subject Alternative Name
id: san
date: 2024-11-25
full_link: https://datatracker.ietf.org/doc/html/rfc4985
short_description: >
   An X.509 certificate extension to identify what hostname or IP address the certificate applies to.

aka:
tags:
- security
---
Subject Alternative Name is an {{< glossary_tooltip text="X.509 certificate" term_id="certificate" >}}
extension that allows identities to be bound to the subject of the certificate.

<!--more-->
The [standard](https://datatracker.ietf.org/doc/html/rfc4985) defines identities represented
as an email address, a DNS name, an IP address or a Uniform Resource Identifier (URI).