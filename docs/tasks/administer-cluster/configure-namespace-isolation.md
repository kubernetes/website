---
assignees:
- thockin
- caseydavenport
- danwinship
title: Configuring Namespace Isolation
---
{% capture overview %}
This page shows how to add `NetworkPolicy` objects to an isolated namespace to specify what traffic should be allowed.
{% endcapture %}

{% capture prerequisites %}
Network policies are implemented by the network plugin, so you must be using a networking solution which supports `NetworkPolicy` - simply creating the resource without a controller to implement it will have no effect.
{% endcapture %}

{% capture steps %}
## Configuring Namespace Isolation

By default, all traffic is allowed between all pods (and `NetworkPolicy` resources have no effect).

Isolation can be configured on a per-namespace basis. Currently, only isolation on inbound traffic (ingress) can be defined. When a namespace has been configured to isolate inbound traffic, all traffic to pods in that namespace (even from other pods in the same namespace) will be blocked. `NetworkPolicy` objects can then be added to the isolated namespace to specify what traffic should be allowed.

Isolation is enabled via the `NetworkPolicy` field of the `Namespace` object. To enable isolation via `kubectl`:

```shell
{% raw %}
kubectl patch ns <namespace> -p '{"spec": {"networkPolicy": {"ingress": {"isolation": "DefaultDeny"}}}}'
{% endraw %}
```

To disable it:

```shell
{% raw %}
kubectl patch ns <namespace> -p '{"spec": {"networkPolicy": null}}'
{% endraw %}
```

NOTE: older network plugins may instead require the v1beta1 syntax, using an annotation:

```shell
{% raw %}
kubectl annotate ns <namespace> "net.beta.kubernetes.io/network-policy={\"ingress\": {\"isolation\": \"DefaultDeny\"}}"
{% endraw %}
```
{% endcapture %}

{% capture whatsnext %}
* For conceptual information about Network Policies, see [Network Policies](/docs/concepts/services-networking/networkpolicies).
{% endcapture %}
