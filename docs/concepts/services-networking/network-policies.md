---
approvers:
- thockin
- caseydavenport
- danwinship
title: Network Policies
---

* TOC
{:toc}

A network policy is a specification of how groups of pods are allowed to communicate with each other and other network endpoints.

`NetworkPolicy` resources use labels to select pods and define rules which specify what traffic is allowed to the selected pods.

## Prerequisites

Network policies are implemented by the network plugin, so you must be using a networking solution which supports `NetworkPolicy` - simply creating the resource without a controller to implement it will have no effect.

## Isolated and Non-isolated Pods

By default, pods are non-isolated; they accept traffic from any source.

Pods become isolated by having a NetworkPolicy that selects them. Once there is any NetworkPolicy in a Namespace selecting a particular pod, that pod will reject any connections that are not allowed by any NetworkPolicy. (Other pods in the Namespace that are not selected by any NetworkPolicy will continue to accept all traffic.)

## The `NetworkPolicy` Resource

See the [api-reference](/docs/api-reference/{{page.version}}/#networkpolicy-v1-networking) for a full definition of the resource.

An example `NetworkPolicy` might look like this:

```yaml
apiVersion: networking.k8s.io/v1
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
    - protocol: TCP
      port: 6379
```

*POSTing this to the API server will have no effect unless your chosen networking solution supports network policy.*

__Mandatory Fields__: As with all other Kubernetes config, a `NetworkPolicy` needs `apiVersion`, `kind`, and `metadata` fields.  For general information about working with config files, see [here](/docs/user-guide/simple-yaml), [here](/docs/user-guide/configuring-containers), and [here](/docs/user-guide/working-with-resources).

__spec__: `NetworkPolicy` [spec](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) has all the information needed to define a particular network policy in the given namespace.

__podSelector__: Each `NetworkPolicy` includes a `podSelector` which selects the grouping of pods to which the policy applies. Since `NetworkPolicy` currently only supports defining `ingress` rules, this `podSelector` essentially defines the "destination pods" for the policy. The example policy selects pods with the label "role=db". An empty `podSelector` selects all pods in the namespace.

__ingress__: Each `NetworkPolicy` includes a list of whitelist `ingress` rules.  Each rule allows traffic which matches both the `from` and `ports` sections. The example policy contains a single rule, which matches traffic on a single port, from either of two sources, the first specified via a `namespaceSelector` and the second specified via a `podSelector`.

So, the example NetworkPolicy:

1. isolates "role=db" pods in the "default" namespace (if they weren't already isolated)
2. allows connections to tcp port 6379 of "role=db" pods in the "default" namespace from any pod in the "default" namespace with the label "role=frontend"
3. allows connections to tcp port 6379 of "role=db" pods in the "default" namespace from any pod in a namespace with the label "project=myproject"

See the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) for further examples.

## Default policies

You can create a "default" isolation policy for a Namespace by creating a NetworkPolicy that selects all pods but does not allow any traffic:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector:
```

This ensures that even pods that aren't selected by any other NetworkPolicy will still be isolated.

Alternatively, if you want to allow all traffic for all pods in a Namespace (even if policies are added that cause some pods to be treated as "isolated"), you can create a policy that explicitly allows all traffic:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all
spec:
  podSelector:
  ingress:
  - {}
```

## What's next?

- See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
  walkthrough for further examples.
