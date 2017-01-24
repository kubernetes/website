---
title: Tasks
redirect_from:
- "/docs/user-guide/production-pods/"
- "/docs/user-guide/production-pods.html"
- "/docs/user-guide/simple-nginx/"
- "/docs/user-guide/simple-nginx.html"
- "/docs/user-guide/pods/single-container/"
- "/docs/user-guide/pods/single-container.html"
- "/docs/user-guide/configuring-containers/"
- "/docs/user-guide/configuring-containers.html"
---

This section of the Kubernetes documentation contains pages that
show how to do individual tasks. A task page shows how to do a
single thing, typically by giving a short sequence of steps.

#### Configuring Pods and Containers

* [Defining Environment Variables for a Container](/docs/tasks/configure-pod-container/define-environment-variable-container/)
* [Defining a Command and Arguments for a Container](/docs/tasks/configure-pod-container/define-command-argument-container/)
* [Assigning CPU and RAM Resources to a Container](/docs/tasks/configure-pod-container/assign-cpu-ram-container/)
* [Configuring a Pod to Use a Volume for Storage](/docs/tasks/configure-pod-container/configure-volume-storage/)
* [Distributing Credentials Securely](/docs/tasks/configure-pod-container/distribute-credentials-secure/)
* [Pulling an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry/)
* [Configuring Liveness and Readiness Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
* [Communicating Between Pods Running in the Same Container](/docs/tasks/configure-pod-container/communicate-containers-same-pod/)
* [Configuring Pod Initialization](/docs/tasks/configure-pod-container/configure-pod-initialization/)
* [Attaching Handlers to Container Lifecycle Events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)

#### Accessing Applications in a Cluster

* [Using Port Forwarding to Access Applications in a Cluster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [Providing Load-Balanced Access to an Application in a Cluster](/docs/tasks/access-application-cluster/load-balance-access-application-cluster/)

#### Debugging Applications in a Cluster

* [Determining the Reason for Pod Failure](/docs/tasks/debug-application-cluster/determine-reason-pod-failure/)

#### Accessing the Kubernetes API

* [Using an HTTP Proxy to Access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api)

#### Administering a Cluster

* [Assigning Pods to Nodes](/docs/tasks/administer-cluster/assign-pods-nodes/)
* [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
* [Safely Draining a Node while Respecting Application SLOs](/docs/tasks/administer-cluster/safely-drain-node/)
* [Changing reclaim policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/)

#### Managing Stateful Applications

* [Upgrading from PetSets to StatefulSets](/docs/tasks/manage-stateful-set/upgrade-pet-set-to-stateful-set/)
* [Scaling a StatefulSet](/docs/tasks/manage-stateful-set/scale-stateful-set/)
* [Deleting a StatefulSet](/docs/tasks/manage-stateful-set/deleting-a-statefulset/)
* [Debugging a StatefulSet](/docs/tasks/manage-stateful-set/debugging-a-statefulset/)
* [Force Deleting StatefulSet Pods](/docs/tasks/manage-stateful-set/delete-pods/)

#### Troubleshooting

* [Debugging Init Containers](/docs/tasks/troubleshoot/debug-init-containers/)

### What's next

If you would like to write a task page, see
[Creating a Documentation Pull Request](/docs/contribute/create-pull-request/).
