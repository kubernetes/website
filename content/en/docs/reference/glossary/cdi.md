---
title: Container Device Interface (CDI)
id: cdi
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  A CNCF specification for describing device configuration that container runtimes
  apply when creating containers.

aka:
tags:
- extension
---
The Container Device Interface (CDI) is a specification for how to configure
devices inside containers. Kubernetes uses CDI together with device plugins and
with Dynamic Resource Allocation so that workloads receive device setup such as
bind mounts or environment variables from the runtime.

<!--more-->

* [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* [Container Device Interface](https://github.com/cncf-tags/container-device-interface)
  specification repository
