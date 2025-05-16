---
title: Kubernetes Self-Healing  
content_type: concept  
weight: 50  
feature:
  title: Self-healing
  anchor: Automated recovery from damage
  description: >
    Kubernetes restarts containers that crash, replaces entire Pods where needed,
    reattaches storage in response to wider failures, and can integrate with
    node autoscalers to self-heal even at the node level.
---
<!-- overview -->

Kubernetes is designed with self-healing capabilities that help maintain the health and availability of workloads. 
It automatically replaces failed containers, reschedules workloads when nodes become unavailable, and ensures that the desired state of the system is maintained.

<!-- body -->

## Self-Healing capabilities {#self-healing-capabilities} 

- **Container-level restarts:** If a container inside a Pod fails, Kubernetes restarts it based on the [`restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).

- **Replica replacement:** If a Pod in a [Deployment](/docs/concepts/workloads/controllers/deployment/) or [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) fails, Kubernetes creates a replacement Pod to maintain the specified number of replicas.
  If a Pod fails that is part of a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) fails, the control plane
  creates a replacement Pod to run on the same node.
  
- **Persistent storage recovery:** If a node is running a Pod with a PersistentVolume (PV) attached, and the node fails, Kubernetes can reattach the volume to a new Pod on a different node.

- **Load balancing for Services:** If a Pod behind a [Service](/docs/concepts/services-networking/service/) fails, Kubernetes automatically removes it from the Service's endpoints to route traffic only to healthy Pods.

Here are some of the key components that provide Kubernetes self-healing:

- **[kubelet](/docs/concepts/architecture/#kubelet):** Ensures that containers are running, and restarts those that fail.

- **ReplicaSet, StatefulSet and DaemonSet controller:** Maintains the desired number of Pod replicas.

- **PersistentVolume controller:** Manages volume attachment and detachment for stateful workloads.

## Considerations {#considerations} 

- **Storage Failures:** If a persistent volume becomes unavailable, recovery steps may be required.

- **Application Errors:** Kubernetes can restart containers, but underlying application issues must be addressed separately.

## {{% heading "whatsnext" %}} 

- Read more about [Pods](/docs/concepts/workloads/pods/)
- Learn about [Kubernetes Controllers](/docs/concepts/architecture/controller/)
- Explore [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
- Read about [node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/). Node autoscaling
  also provides automatic healing if or when nodes fail in your cluster.