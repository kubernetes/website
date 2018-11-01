# WIP: Windows Doc Updates

This is the "user journey" layout from the [Kubernetes Docs](https://kubernetes.io/docs/home/). Only areas that we propose changing/adding are linked. The rest are there just to provide a complete overview.

- Users
  - Application Developer
    - Foundational
      - Get started with a cluster
      - Deploy an application
      - Understand basic Kubernetes architecture
      - Explore additional resources
    - Intermediate
      - Learn additional workload patterns
      - Deploy a production-ready workload
      - Improve your dev workflow with tooling
      - Explore additional resources
    - Advanced
      - Deploy an application with advanced features
      - Extend the Kubernetes API
      - Explore additional resources
  - Cluster Operator
    - Foundational
      - Get an overview of Kubernetes
      - Learn about Kubernetes basics
      - Get information about my cluster
      - Explore additional resources
    - Intermediate
      - Work with Ingress, Networking, Storage, Workloads
      - Implement security best practices
      - Implement custom logging and monitoring
      - Additional Resources
    - Advanced Topics
      - Connect to managed services using Service Catalog
      - Extend a Kubernetes cluster
      - Create a Pod Security Policy
      - Define a Resource Quota
- Contributors

- Browse Docs








- [Get Windows Binaries](#get-windows-binaries)
- [Prerequisites](#prerequisites)
- [Networking](#networking)
    - [Future CNI Plugins](#future-cni-plugins)
    - [Linux](#linux)
    - [Windows](#windows)
        - [Upstream L3 Routing Topology](#upstream-l3-routing-topology)
        - [Host-Gateway Topology](#host-gateway-topology)
        - [Using OVN with OVS](#using-ovn-with-ovs)
- [Setting up Windows Server Containers on Kubernetes](#setting-up-windows-server-containers-on-kubernetes)
    - [Host Setup](#host-setup)
        - [For 1. Upstream L3 Routing Topology and 2. Host-Gateway Topology](#for-1-upstream-l3-routing-topology-and-2-host-gateway-topology)
        - [For 3. Open vSwitch (OVS) & Open Virtual Network (OVN) with Overlay](#for-3-open-vswitch-ovs--open-virtual-network-ovn-with-overlay)
- [Starting the Cluster](#starting-the-cluster)
- [Starting the Linux-based Control Plane](#starting-the-linux-based-control-plane)
- [Support for kubeadm join](#support-for-kubeadm-join)
- [Supported Features](#supported-features)
    - [Scheduling Pods on Windows](#scheduling-pods-on-windows)
    - [Secrets and ConfigMaps](#secrets-and-configmaps)
    - [Volumes](#volumes)
    - [DaemonSets](#daemonsets)
    - [Metrics](#metrics)
    - [Container Resources](#container-resources)
    - [Hyper-V Containers](#hyper-v-containers)
    - [Kubelet and kube-proxy can now run as Windows services](#kubelet-and-kube-proxy-can-now-run-as-windows-services)
- [Known Limitations for Windows Server Containers with v1.9](#known-limitations-for-windows-server-containers-with-v19)
- [Next steps and resources](#next-steps-and-resources)
