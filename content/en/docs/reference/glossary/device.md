---
title: Device
id: device
date: 2025-05-13
short_description: >
  Any resource that's directly or indirectly attached your cluster's nodes, like
  GPUs or circuit boards.

tags:
- extension
- fundamental
---
 One or more
{{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}}
that are directly or indirectly attached to your
{{< glossary_tooltip text="nodes" term_id="node" >}}.

<!--more-->

Devices might be commercial products like GPUs, or custom hardware like
[ASIC boards](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit).
Attached devices usually require device drivers that let Kubernetes
{{< glossary_tooltip text="Pods" term_id="pod" >}} access the devices.
