---
title: Device Plugin
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  Software extensions to let Pods access devices that need vendor-specific initialization or setup
aka:
tags:
- fundamental
- extension
---
 Device plugins run on worker
{{< glossary_tooltip term_id="node" text="Nodes">}} and provide
{{< glossary_tooltip term_id="pod" text="Pods">}} with access to resources,
such as local hardware, that require vendor-specific initialization or setup
steps.

<!--more-->

Device plugins advertise resources to the
{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, so that workload
Pods can access hardware features that relate to the Node where that Pod is running.
You can deploy a device plugin as a {{< glossary_tooltip term_id="daemonset" >}},
or install the device plugin software directly on each target Node.

See
[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
for more information.
