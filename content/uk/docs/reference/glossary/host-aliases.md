---
title: HostAliases
id: HostAliases
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  HostAliases — це зіставлення між IP-адресою та імʼям хоста, яке додається у файл hosts Podʼа.

aka:
tags:
- operation
---

HostAliases — це зіставлення між IP-адресою та імʼям хоста, яке додається у файл hosts {{< glossary_tooltip text="Podʼа" term_id="pod" >}}.

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) — це опціональний список імен хостів та IP-адрес, які буде додано у файл hosts Podʼа, якщо їх вказано. Це діє лише для Podʼів, які не використовують hostNetwork.
