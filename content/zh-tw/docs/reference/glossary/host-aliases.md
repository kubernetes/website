---
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  主機別名 (HostAliases) 是一組 IP 地址和主機名的對映，用於注入到 Pod 內的 hosts 檔案。

aka:
tags:
- operation
---
 主機別名 (HostAliases) 是一組 IP 地址和主機名的對映，用於注入到 {{< glossary_tooltip text="Pod" term_id="pod" >}} 內的 hosts 檔案。

<!--
---
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  A HostAliases is a mapping between the IP address and hostname to be injected into a Pod's hosts file.

aka:
tags:
- operation
---
 A HostAliases is a mapping between the IP address and hostname to be injected into a {{< glossary_tooltip text="Pod" term_id="pod" >}}'s hosts file.
-->

<!--more-->

<!-- 
[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) is an optional list of hostnames and IP addresses that will be injected into the Pod's hosts file if specified. This is only valid for non-hostNetwork Pods.
-->
[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core)
是一個包含主機名和 IP 地址的可選列表，配置後將被注入到 Pod 內的 hosts 檔案中。
該選項僅適用於沒有配置 hostNetwork 的 Pod.
