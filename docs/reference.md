---
title: Reference Documentation
---

In the reference section, you can find reference documentation for Kubernetes APIs, CLIs, and tools, as well as our glossary and design docs. 

## API References

* [Kubernetes API](/docs/api/) - The core API for Kubernetes.
* [Autoscaling API](/docs/api-reference/autoscaling/v1/operations/) - Manages autoscaling resources such as HorizontalPodAutoscalers.
* [Batch API](/docs/api-reference/batch/v1/operations/) - Manages batch resources such as Jobs.
* [Apps API](/docs/api-reference/apps/v1beta1/operations/) - Manages apps resources such as StatefulSets.
* [Extensions API](/docs/api-reference/extensions/v1beta1/operations/) - Manages extensions resources such as Ingress, Deployments, and ReplicaSets.


## CLI References

* [kubectl](/docs/user-guide/kubectl-overview/) - Runs commands against Kubernetes clusters.
	* [JSONPath](/docs/user-guide/jsonpath/) - Syntax 	guide for using [JSONPath expressions](http://goessner.net/articles/JsonPath/) with kubectl.
* [kube-apiserver](/docs/admin/kube-apiserver/) - REST API that validates and configures data for API objects such as  pods, services, replication controllers.
* [kube-proxy](/docs/admin/kube-proxy/) - Can do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across a set of backends.
* [kube-scheduler](/docs/admin/kube-scheduler/) - A policy-rich, topology-aware, workload-specific function that significantly impacts availability, performance, and capacity.
* [kubelet](/docs/admin/kubelet/) - The primary "node agent" that runs on each node. The kubelet takes a set of PodSpecs and ensures that the described containers are running and healthy.

## Glossary

Explore the glossary of essential Kubernetes concepts. Some good starting points are the entries for [Pods](/docs/user-guide/pods/), [Nodes](/docs/admin/node/), [Services](/docs/user-guide/services/), and [ReplicaSets](/docs/user-guide/replicasets/).

## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are [Kubernetes Architecture](https://github.com/kubernetes/kubernetes/blob/{{page.version}}/docs/design/architecture.md) and [Kubernetes Design Overview](https://github.com/kubernetes/kubernetes/tree/{{page.version}}/docs/design).
