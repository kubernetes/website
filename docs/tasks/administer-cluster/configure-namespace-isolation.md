---
assignees:
- thockin
- caseydavenport
- danwinship
title: Configuring Namespace Isolation
---

* TOC
{:toc}

## Prerequisites

Network policies are implemented by the network plugin, so you must be using a networking solution which supports `NetworkPolicy` - simply creating the resource without a controller to implement it will have no effect.

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

## The `NetworkPolicy` Resource

See the [api-reference](/docs/api-reference/networking/v1/definitions/#_v1_networkpolicy) for a full definition of the resource.

An example `NetworkPolicy` might look like this:

```yaml
apiVersion: networking/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: tcp
      port: 6379
```

*POSTing this to the API server will have no effect unless your chosen networking solution supports network policy.*

__Mandatory Fields__: As with all other Kubernetes config, a `NetworkPolicy` needs `apiVersion`, `kind`, and `metadata` fields.  For general information about working with config files, see [here](/docs/user-guide/simple-yaml), [here](/docs/user-guide/configuring-containers), and [here](/docs/user-guide/working-with-resources).

__spec__: `NetworkPolicy` [spec](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api-conventions.md#spec-and-status) has all the information needed to define a particular network policy in the given namespace.

__podSelector__: Each `NetworkPolicy` includes a `podSelector` which selects the grouping of pods to which the `ingress` rules in the policy apply. The example policy selects pods with the label "role=db".

__ingress__: Each `NetworkPolicy` includes a list of whitelist `ingress` rules.  Each rule allows traffic which matches both the `from` and `ports` sections. The example policy contains a single rule, which matches traffic on a single port, from either of two sources, the first specified via a `namespaceSelector` and the second specified via a `podSelector`.

So, the example NetworkPolicy:

1. allows connections to tcp port 6379 of "role=db" pods in the "default" namespace from any pod in the "default" namespace with the label "role=frontend"
2. allows connections to tcp port 6379 of "role=db" pods in the "default" namespace from any pod in a namespace with the label "project=myproject"

See the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) for further examples.
