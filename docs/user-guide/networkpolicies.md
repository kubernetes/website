---
assignees:
- thockin

---

* TOC
{:toc}

A network policy is a specification of how selections of pods are allowed to communicate with each other and other network endpoints.

`NetworkPolicy` resources use labels to select pods and define whitelist rules which allow traffic to the selected pods in addition to what is allowed by the isolation policy for a given namespace.

## Prerequisites

You must enable the `extensions/v1beta1/networkpolicies` runtime config in your apiserver to enable this resource.

You must also be using a networking solution which supports `NetworkPolicy` - simply creating the
resource without a controller to implement it will have no effect.

## Configuring Namespace Isolation Policy

Isolation can be configured on a per-namespace basis.  Once isolation is configured on a namespace it will be applied to all pods in that namespace. Currently, only isolation policy on inbound traffic (ingress) can be defined.

The following ingress isolation types being supported:

- `DefaultDeny`: Pods in the namespace will be inaccessible from any source except the pod's local node.

Ingress isolation can be enabled using an annotation on the Namespace.

```yaml
kind: Namespace
apiVersion: v1
metadata:
  annotations:
    net.beta.kubernetes.io/network-policy: |
      {
        "ingress": {
          "isolation": "DefaultDeny"
        }
      }
```

To configure the annotation via `kubectl`:

```shell{% raw %}
kubectl annotate ns <namespace> "net.beta.kubernetes.io/network-policy={\"ingress\": {\"isolation\": \"DefaultDeny\"}}"
{% endraw %}```

## The `NetworkPolicy` Resource

See the [api-reference](/docs/api-reference/extensions/v1beta1/definitions/#_v1beta1_networkpolicy) for a full definition of the resource.

A minimal `NetworkPolicy` might look like this:

```yaml
apiVersion: extensions/v1beta1
kind: NetworkPolicy
metadata:
 name: test-network-policy
spec:
 podSelector:
  matchLabels:
    role: db
 ingress:
  - from:
     - podSelector:
        matchLabels:
         role: frontend
    ports:
     - protocol: tcp
       port: 6379
```

*POSTing this to the API server will have no effect unless your chosen networking solution supports network policy.*

__Mandatory Fields__: As with all other Kubernetes config, a `NetworkPolicy` needs `apiVersion`, `kind`, and `metadata` fields.  For general information about working with config files, see [here](/docs/user-guide/simple-yaml), [here](/docs/user-guide/configuring-containers), and [here](/docs/user-guide/working-with-resources).

__spec__: `NetworkPolicy` [spec](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api-conventions.md#spec-and-status) has all the information needed to define a network isolation policy in the deployed controller.

__podSelector__: Each `NetworkPolicy` includes a `podSelector` which selects the grouping of pods to which the `ingress` rules in the policy apply.

__ingress__: Each `NetworkPolicy` includes a list of whitelist `ingress` rules.  Each rule allows traffic which matches both the `from` and `ports` sections.
