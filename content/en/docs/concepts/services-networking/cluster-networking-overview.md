---
title: Cluster Networking IP Management
content_type: concept
weight: 10
---

Kubernetes networking relies on several layers of infrastructure to provide IP addresses to Pods and Services. Because Kubernetes is designed to be pluggable, the responsibility for managing these IP ranges depends on your cluster's configuration.

## IP Address Management (IPAM)

The ranges used for Pod and Service IPs (CIDRs) are generally managed in one of three ways:

* **Control Plane Managed:** The Kubernetes control plane manages allocation via flags like `--service-cluster-ip-range` and `--cluster-cidr`.
* **CNI Plugin Managed:** Networking add-ons (like Calico or Cilium) manage their own IP pools.
* **Cloud Provider Managed:** In managed environments (like EKS or GKE), the provider integrates networking directly into the cloud VPC.

Before changing network ranges, determine if the cluster, the CNI, or the cloud provider is the "source of truth" for your environment.
