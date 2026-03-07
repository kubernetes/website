---
title: HostAliases
id: HostAliases
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  HostAliases — це зіставлення між IP-адресою та імʼям хосту, яке додається у файл hosts {{< glossary_tooltip text="Podʼа" term_id="pod" >}}.

aka:
tags:
- operation
---

HostAliases — це зіставлення між IP-адресою та імʼям хосту, яке додається у файл hosts {{< glossary_tooltip text="Podʼа" term_id="pod" >}}.

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) — це опціональний список імен хостів та IP-адрес, які будуть вставлені в файл hosts {{< glossary_tooltip text="Podʼа" term_id="pod" >}}, якщо вказано. Це є дійсним лише для Podʼів non-hostNetwork.
