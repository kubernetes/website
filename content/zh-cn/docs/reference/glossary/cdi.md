---
title: 容器设备接口（CDI）
id: cdi
full_link: /zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  一种 CNCF 规范，用于描述容器运行时在创建容器时应用的设备配置。

aka:
tags:
- extension
---

<!--
The Container Device Interface (CDI) is a specification for how to configure
devices inside containers. Kubernetes uses CDI together with device plugins and
with Dynamic Resource Allocation so that workloads receive device setup such as
bind mounts or environment variables from the runtime.
-->
容器设备接口（CDI）是一种规范，用于配置容器内部的设备。
Kubernetes 使用 CDI 以及设备插件和动态资源分配，
以便工作负载可以从运行时接收设备设置，例如绑定挂载或环境变量。

<!--more-->

<!--
* [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* [Container Device Interface](https://github.com/cncf-tags/container-device-interface)
  specification repository
-->
* [设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* [容器设备接口](https://github.com/cncf-tags/container-device-interface)规范仓库
