

-----------
# NetworkPolicy v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | NetworkPolicy









<aside class="notice">
Appears In <a href="#networkpolicylist-v1beta1">NetworkPolicyList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[NetworkPolicySpec](#networkpolicyspec-v1beta1)*  | Specification of the desired behavior for this NetworkPolicy.


### NetworkPolicySpec v1beta1

<aside class="notice">
Appears In <a href="#networkpolicy-v1beta1">NetworkPolicy</a> </aside>

Field        | Description
------------ | -----------
ingress <br /> *[NetworkPolicyIngressRule](#networkpolicyingressrule-v1beta1) array*  | List of ingress rules to be applied to the selected pods. Traffic is allowed to a pod if namespace.networkPolicy.ingress.isolation is undefined and cluster policy allows it, OR if the traffic source is the pod's local node, OR if the traffic matches at least one ingress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy does not affect ingress isolation. If this field is present and contains at least one rule, this policy allows any traffic which matches at least one of the ingress rules in this list.
podSelector <br /> *[LabelSelector](#labelselector-unversioned)*  | Selects the pods to which this NetworkPolicy object applies.  The array of ingress rules is applied to any pods selected by this field. Multiple network policies can select the same set of pods.  In this case, the ingress rules for each are combined additively. This field is NOT optional and follows standard label selector semantics. An empty podSelector matches all pods in this namespace.

### NetworkPolicyList v1beta1



Field        | Description
------------ | -----------
items <br /> *[NetworkPolicy](#networkpolicy-v1beta1) array*  | Items is a list of schema objects.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata





