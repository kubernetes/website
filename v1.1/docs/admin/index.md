---
title: "Kubernetes Cluster Admin Guide"
---
The cluster admin guide is for anyone creating or administering a Kubernetes cluster.
It assumes some familiarity with concepts in the [User Guide](../user-guide/README).

## Admin Guide Table of Contents

[Introduction](introduction)

1. [Components of a cluster](cluster-components)
  1. [Cluster Management](cluster-management)
  1. Administrating Master Components
    1. [The kube-apiserver binary](kube-apiserver)
      1. [Authorization](authorization)
      1. [Authentication](authentication)
      1. [Accessing the api](accessing-the-api)
      1. [Admission Controllers](admission-controllers)
      1. [Administrating Service Accounts](service-accounts-admin)
      1. [Resource Quotas](resource-quota)
    1. [The kube-scheduler binary](kube-scheduler)
    1. [The kube-controller-manager binary](kube-controller-manager)
  1. [Administrating Kubernetes Nodes](node)
    1. [The kubelet binary](kubelet)
      1. [Garbage Collection](garbage-collection)
    1. [The kube-proxy binary](kube-proxy)
  1. Administrating Addons
    1. [DNS](dns)
  1. [Networking](networking)
    1. [OVS Networking](ovs-networking)
  1. Example Configurations
    1. [Multiple Clusters](multi-cluster)
    1. [High Availability Clusters](high-availability)
    1. [Large Clusters](cluster-large)
    1. [Getting started from scratch](../getting-started-guides/scratch)
      1. [Kubernetes's use of salt](salt)
  1. [Troubleshooting](cluster-troubleshooting)