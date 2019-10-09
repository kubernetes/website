---
title: Device Plugin
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  Containers running in Kubernetes that provide access to a vendor specific resource.
aka:
tags:
- fundamental
- extension
---
 Device Plugins are containers running in Kubernetes that provide access to a vendor specific resource.

<!--more-->

[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) are containers running in Kubernetes that provide access to a vendor-specific resource. Device Plugins advertise these resources to {{< glossary_tooltip term_id="kubelet" >}}. They can be deployed manually or as a {{< glossary_tooltip term_id="daemonset" >}}, rather than writing custom Kubernetes code.
