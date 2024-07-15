---
title: "Cluster Architecture"
weight: 30
description: >
  The architectural concepts behind Kubernetes.
---

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="Components of Kubernetes" caption="**Note:** This diagram presents an example reference architecture of a Kubernetes cluster. The actual distribution of components can vary based on specific cluster setups and requirements." class="diagram-large" >}}

### Understanding Cluster Component Distribution

While the diagram provides a simplified overview, it's important to understand the flexibility of Kubernetes architecture:

- **Control Plane Components:** The control plane refers to a collection of critical components that manage the cluster's core functionality. These include the API server, scheduler, controller manager, and etcd (for cluster state storage).

- **Node Components:** Both control plane nodes and worker nodes typically run kubelet (the node agent) and kube-proxy (for network proxying). These components are essential for node operation but are not always considered part of the core control plane.

- **Deployment Variations:** In production environments, there are many possible setups:
  - Control plane components might run on dedicated nodes or be distributed across cluster nodes.
  - They could be deployed as static Pods, managed by systemd, or handled by cluster management tools.
  - In some cases, especially with managed Kubernetes services, the control plane might be abstracted away from direct user management.

- **Workload Placement:** Depending on the cluster's size and configuration, you might deploy workloads on control plane nodes, especially for cluster management tasks, monitoring, or trusted applications.

The flexibility of Kubernetes allows you to adapt the architecture to your specific needs, resource constraints, and business requirements.

