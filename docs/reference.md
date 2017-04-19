---
title: Reference Documentation
---

In the reference section, you can find reference documentation for Kubernetes APIs, CLIs, and tools, as well as our glossary and design docs. 

## API References

* [Kubernetes API Overview](/docs/concepts/overview/kubernetes-api/) - Conceptual overview of the API for Kubernetes.
* Versions
  * [1.6](/docs/api-reference/v1.6/)
  * [1.5](/docs/api-reference/v1.5/)

## CLI References

* [kubectl](/docs/user-guide/kubectl-overview/) - Runs commands against Kubernetes clusters.
    * [JSONPath](/docs/user-guide/jsonpath/) - Syntax     guide for using [JSONPath expressions](http://goessner.net/articles/JsonPath/) with kubectl.
* [kube-apiserver](/docs/admin/kube-apiserver/) - REST API that validates and configures data for API objects such as  pods, services, replication controllers.
* [kube-proxy](/docs/admin/kube-proxy/) - Can do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across a set of backends.
* [kubelet](/docs/admin/kubelet/) - The primary "node agent" that runs on each node. The kubelet takes a set of PodSpecs and ensures that the described containers are running and healthy.

## Glossary

Explore the glossary of essential Kubernetes concepts. Some good starting points are the entries for [Pods](/docs/concepts/workloads/pods/pod/), [Nodes](/docs/concepts/nodes/node/), [Services](/docs/concepts/services-networking/service/), and [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/).

## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are [Kubernetes Architecture](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture.md) and [Kubernetes Design Overview](https://github.com/kubernetes/kubernetes/tree/{{page.fullversion}}/docs/design).
