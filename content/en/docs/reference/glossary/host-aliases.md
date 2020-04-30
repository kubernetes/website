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

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) is an optional list of hostnames and IP addresses that will be injected into the Pod's hosts file if specified. This is only valid for non-hostNetwork Pods.
