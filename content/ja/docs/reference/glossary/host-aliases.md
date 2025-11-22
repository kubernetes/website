---
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  HostAliasesは、Podのhostsファイルに注入されるIPアドレスとホスト名の間のマッピングです。

aka:
tags:
- operation
---
HostAliasesは、{{< glossary_tooltip text="Pod" term_id="pod" >}}のhostsファイルに注入されるIPアドレスとホスト名の間のマッピングです。

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core)は、指定された場合にPodのhostsファイルに注入されるホスト名とIPアドレスのオプションのリストです。
これはhostNetworkではないPodに対してのみ有効です。
