---
reviewers:
- derekwaynecarr
- klueska
title: Node Resource Managers 
content_type: concept
weight: 50
---

<!-- overview -->

In order to support latency-critical and high-throughput workloads, Kubernetes offers a suite of Resource Managers. The managers aim to co-ordinate and optimise node's resources alignment for pods configured with a specific requirement for CPUs, devices, and memory (hugepages) resources. 

<!-- body -->

The main manager, the Topology Manager, is a Kubelet component that co-ordinates the overall resource management process through its [policy](/docs/tasks/administer-cluster/topology-manager/).

The configuration of individual managers is elaborated in dedicated documents:

- [CPU Manager Policies](/docs/tasks/administer-cluster/cpu-management-policies/)
- [Device Manager](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
- [Memory Manger Policies](/docs/tasks/administer-cluster/memory-manager/)