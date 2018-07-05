---
reviewers:
- davidopp
title: Troubleshoot Clusters
content_template: templates/concept
---

{{% capture overview %}}

This doc is about cluster troubleshooting; we assume you have already ruled out your application as the root cause of the
problem you are experiencing. See
the [application troubleshooting guide](/docs/tasks/debug-application-cluster/debug-application) for tips on application debugging.
You may also visit [troubleshooting document](/docs/troubleshooting/) for more information.

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Listing your cluster

The first thing to debug in your cluster is if your nodes are all registered correctly.

Run

```shell
kubectl get nodes
```

And verify that all of the nodes you expect to see are present and that they are all in the `Ready` state.

## Looking at logs

For now, digging deeper into the cluster requires logging into the relevant machines.  Here are the locations
of the relevant log files.  (note that on systemd-based systems, you may need to use `journalctl` instead)

### Master

   * /var/log/kube-apiserver.log - API Server, responsible for serving the API
   * /var/log/kube-scheduler.log - Scheduler, responsible for making scheduling decisions
   * /var/log/kube-controller-manager.log - Controller that manages replication controllers

### Worker Nodes

   * /var/log/kubelet.log - Kubelet, responsible for running containers on the node
   * /var/log/kube-proxy.log - Kube Proxy, responsible for service load balancing

## A general overview of cluster failure modes

This is an incomplete list of things that could go wrong, and how to adjust your cluster setup to mitigate the problems.

Root causes:

  - VM(s) shutdown
  - Network partition within cluster, or between cluster and users
  - Crashes in Kubernetes software
  - Data loss or unavailability of persistent storage (e.g. GCE PD or AWS EBS volume)
  - Operator error, e.g. misconfigured Kubernetes software or application software

Specific scenarios:

  - Apiserver VM shutdown or apiserver crashing
    - Results
      - unable to stop, update, or start new pods, services, replication controller
      - existing pods and services should continue to work normally, unless they depend on the Kubernetes API
  - Apiserver backing storage lost
    - Results
      - apiserver should fail to come up
      - kubelets will not be able to reach it but will continue to run the same pods and provide the same service proxying
      - manual recovery or recreation of apiserver state necessary before apiserver is restarted
  - Supporting services (node controller, replication controller manager, scheduler, etc) VM shutdown or crashes
    - currently those are colocated with the apiserver, and their unavailability has similar consequences as apiserver
    - in future, these will be replicated as well and may not be co-located
    - they do not have their own persistent state
  - Individual node (VM or physical machine) shuts down
    - Results
      - pods on that Node stop running
  - Network partition
    - Results
      - partition A thinks the nodes in partition B are down; partition B thinks the apiserver is down. (Assuming the master VM ends up in partition A.)
  - Kubelet software fault
    - Results
      - crashing kubelet cannot start new pods on the node
      - kubelet might delete the pods or not
      - node marked unhealthy
      - replication controllers start new pods elsewhere
  - Cluster operator error
    - Results
      - loss of pods, services, etc
      - lost of apiserver backing store
      - users unable to read API
      - etc.

Mitigations:

- Action: Use IaaS provider's automatic VM restarting feature for IaaS VMs
  - Mitigates: Apiserver VM shutdown or apiserver crashing
  - Mitigates: Supporting services VM shutdown or crashes

- Action: Use IaaS providers reliable storage (e.g. GCE PD or AWS EBS volume) for VMs with apiserver+etcd
  - Mitigates: Apiserver backing storage lost

- Action: Use (experimental) [high-availability](/docs/admin/high-availability) configuration
  - Mitigates: Master VM shutdown or master components (scheduler, API server, controller-managing) crashing
    - Will tolerate one or more simultaneous node or component failures
  - Mitigates: Apiserver backing storage (i.e., etcd's data directory) lost
    - Assuming you used clustered etcd.

- Action: Snapshot apiserver PDs/EBS-volumes periodically
  - Mitigates: Apiserver backing storage lost
  - Mitigates: Some cases of operator error
  - Mitigates: Some cases of Kubernetes software fault

- Action: use replication controller and services in front of pods
  - Mitigates: Node shutdown
  - Mitigates: Kubelet software fault

- Action: applications (containers) designed to tolerate unexpected restarts
  - Mitigates: Node shutdown
  - Mitigates: Kubelet software fault

- Action: [Multiple independent clusters](/docs/concepts/cluster-administration/federation/) (and avoid making risky changes to all clusters at once)
  - Mitigates: Everything listed above.

{{% /capture %}}
