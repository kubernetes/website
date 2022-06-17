---
title: 節點資源管理器
content_type: concept
weight: 50
---
<!-- 
---
reviewers:
- derekwaynecarr
- klueska
title: Node Resource Managers 
content_type: concept
weight: 50
---
-->

<!-- overview -->

<!-- 
In order to support latency-critical and high-throughput workloads, Kubernetes offers a suite of Resource Managers. The managers aim to co-ordinate and optimise node's resources alignment for pods configured with a specific requirement for CPUs, devices, and memory (hugepages) resources. 
-->
Kubernetes 提供了一組資源管理器，用於支援延遲敏感的、高吞吐量的工作負載。
資源管理器的目標是協調和最佳化節點資源，以支援對 CPU、裝置和記憶體（巨頁）等資源有特殊需求的 Pod。

<!-- body -->

<!-- 
The main manager, the Topology Manager, is a Kubelet component that co-ordinates the overall resource management process through its [policy](/docs/tasks/administer-cluster/topology-manager/).

The configuration of individual managers is elaborated in dedicated documents:
-->
主管理器，也叫拓撲管理器（Topology Manager），是一個 Kubelet 元件，
它透過[策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)，
協調全域性的資源管理過程。

各個管理器的配置方式會在專項文件中詳細闡述：

<!-- 
- [CPU Manager Policies](/docs/tasks/administer-cluster/cpu-management-policies/)
- [Device Manager](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
- [Memory Manager Policies](/docs/tasks/administer-cluster/memory-manager/)
-->
- [CPU 管理器策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)
- [裝置管理器](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
- [記憶體管理器策略](/zh-cn/docs/tasks/administer-cluster/memory-manager/)
