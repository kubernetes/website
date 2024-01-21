---
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  主机别名 (HostAliases) 是一组 IP 地址和主机名的映射，用于注入到 Pod 内的 hosts 文件。

aka:
tags:
- operation
---
<!--
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  A HostAliases is a mapping between the IP address and hostname to be injected into a Pod's hosts file.

aka:
tags:
- operation
-->

<!--
 A HostAliases is a mapping between the IP address and hostname to be injected into a {{< glossary_tooltip text="Pod" term_id="pod" >}}'s hosts file.
-->
 主机别名 (HostAliases) 是一组 IP 地址和主机名的映射，用于注入到 {{< glossary_tooltip text="Pod" term_id="pod" >}} 内的 hosts 文件。


<!--more-->

<!-- 
[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) is an optional list of hostnames and IP addresses that will be injected into the Pod's hosts file if specified. This is only valid for non-hostNetwork Pods.
-->
[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core)
是一个包含主机名和 IP 地址的可选列表，配置后将被注入到 Pod 内的 hosts 文件中。
该选项仅适用于没有配置 hostNetwork 的 Pod。
