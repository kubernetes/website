---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "PodAntiAffinity"
content_type: "api_reference"
description: "Pod anti affinity is a group of inter pod anti affinity scheduling rules."
title: "PodAntiAffinity"
weight: 17
---



`import "k8s.io/api/core/v1"`


Pod anti affinity is a group of inter pod anti affinity scheduling rules.

<hr>

- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.

  <a name="WeightedPodAffinityTerm"></a>
  *The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)*

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), required

    Required. A pod affinity term, associated with the corresponding weight.

    <a name="PodAffinityTerm"></a>
    *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods.

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

    namespaces specifies which namespaces the labelSelector applies to (matches against); null or empty list means "this pod's namespace"

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    weight associated with matching the corresponding podAffinityTerm, in the range 1-100.

- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.

  <a name="PodAffinityTerm"></a>
  *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    namespaces specifies which namespaces the labelSelector applies to (matches against); null or empty list means "this pod's namespace"





