---
reviewers:
- dchen1107
- egernst
- tallclair
title: Pod Overhead
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}


When you run a Pod on a Node, the Pod itself takes an amount of system resources. These
resources are additional to the resources needed to run the container(s) inside the Pod.
_Pod Overhead_ is a feature for accounting for the resources consumed by the pod infrastructure
on top of the container requests & limits.


{{% /capture %}}


{{% capture body %}}

## Pod Overhead

In Kubernetes, the pod's overhead is set at
[admission](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
time according to the overhead associated with the pod's
[RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/).

When Pod Overhead is enabled, the overhead is considered in addition to the sum of container
resource requests when scheduling a pod. Similarly, Kubelet will include the pod overhead when sizing
the pod cgroup, and when carrying out pod eviction ranking.

### Set Up

You need to make sure that the `PodOverhead`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled (it is off by default)
across your cluster. This means:

- in {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
- in {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}
- in the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on each Node
- in any custom API servers that use feature gates

{{< note >}}
Users who can write to RuntimeClass resources are able to have cluster-wide impact on
workload performance. You can limit access to this ability using Kubernetes access controls.
See [Authorization Overview](/docs/reference/access-authn-authz/authorization/) for more details.
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [RuntimeClass](/docs/concepts/containers/runtime-class/)
* [PodOverhead Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)

{{% /capture %}}
