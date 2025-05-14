---
title: DeviceClass
id: deviceclass
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass
short_description: >
  A category of devices in the cluster. Users can claim specific
  devices in a DeviceClass.
tags:
- extension
---
 A category of {{< glossary_tooltip text="devices" term_id="device" >}} in the
 cluster that can be used with dynamic resource allocation (DRA).

<!--more-->

Administrators or device owners use DeviceClasses to define a set of devices
that can be claimed and used in workloads. Devices are claimed by creating
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
that filter for specific device parameters in a DeviceClass.

For more information, see
[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)
