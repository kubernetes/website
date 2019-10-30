---
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/glossary/host-aliases.md

short_description: >
  HostAliases 是要注入 Pod 的 hosts 文件的 IP 地址和主机名之间的映射。
aka:
tags:
- operation
---

<!--
---
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/glossary/host-aliases.md

short_description: >

   A HostAliases is a mapping between the IP address and hostname to be injected into a Pod's hosts file.
aka:
tags:
- operation
---
-->
<!--
 A HostAliases is a mapping between the IP address and hostname to be injected into a Pod's hosts file.
-->

HostAliases 是要注入 Pod 的 hosts 文件的 IP 地址和主机名之间的映射。

<!--more-->

<!--
[HostAliases](/docs/reference/glossary/host-aliases.md) is an optional list of hostnames and IP addresses that will be injected into the Pod's hosts file if specified. This is only valid for non-hostNetwork Pods.
-->

[HostAliases](/docs/reference/generated/kubernetes-api/v1.13/#hostalias-v1-corev) 是一个可选的主机名和 IP 地址列表，如果指定，它们将被注入 Pod 的 hosts 文件中。 这仅适用于非 hostNetwork 的 Pod。
