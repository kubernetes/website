---
title: 主题备用名称（Subject Alternative Name）
id: san
full_link: https://datatracker.ietf.org/doc/html/rfc4985
short_description: >
  X.509 证书的扩展字段，用于标识证书所适用的主机名或 IP 地址。

aka:
tags:
- security
---
<!--
title: Subject Alternative Name
id: san
full_link: https://datatracker.ietf.org/doc/html/rfc4985
short_description: >
   An X.509 certificate extension to identify what hostname or IP address the certificate applies to.

aka:
tags:
- security
-->

<!--
Subject Alternative Name is an {{< glossary_tooltip text="X.509 certificate" term_id="certificate" >}}
extension that allows identities to be bound to the subject of the certificate.
-->
主题备用名称（Subject Alternative Name）是 {{< glossary_tooltip text="X.509 证书" term_id="certificate" >}}
的扩展字段，允许将身份标识绑定到证书的主体。

<!--more-->

<!--
The [standard](https://datatracker.ietf.org/doc/html/rfc4985) defines identities represented
as an email address, a DNS name, an IP address or a Uniform Resource Identifier (URI).
-->
该[标准](https://datatracker.ietf.org/doc/html/rfc4985)定义了多种身份标识表示形式，
包括电子邮件地址、DNS 名称、IP 地址或统一资源标识符（URI）。
