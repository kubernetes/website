---
title: DeviceClass
id: deviceclass
date: 2025-05-26
short_description: >
  Describes a category of devices in the cluster. Users can claim specific
  devices in a DeviceClass.

tags:
- extension
- core
---
 A DeviceClass describes a category of
{{< glossary_tooltip text="devices" term_id="device" >}} in the cluster that can
be used with
[dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

<!-- more -->

Administrators or device owners use DeviceClasses to define what devices can be
claimed and how to select specific attributes in a claim. Devices are claimed by
creating {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
that select specific parameters in a DeviceClass.
