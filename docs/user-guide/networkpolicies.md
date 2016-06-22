---
---

* TOC
{:toc}

## What is a _Network Policy_?

A Network Policy is a specification of how groupings of pods are allowed to communicate with each other and other network endpoints.

NetworkPolicy resources use labels to select pods and define whitelist rules which allow traffic to the selected pods in addition to what is allowed by the ingress isolation policy for a given namespace.

## Prerequisites
Before you start using the NetworkPolicy resource, there are a few things to understand.  The NetworkPolicy resource is a beta resource and is 
not available in any Kubernetes release prior to 1.3.  

You must enable the `extensions/v1beta/networkpolicies` runtime config in your apiserver to enable this resource.

You must also be using a networking solution which supports Network Policy - simply creating the
resource without a controller to implement it will have no effect.

## Configuring Namespace Isolation Policy 
Ingress isolation can be configured on a per-namespace basis.  Once ingress isolation is configured on a namespace it will be applied to all pods in that namespace. 

Currently the following ingress isolation types are supported: 

- _DefaultDeny_: Pods in the namespace will be inaccessible from any source except the pod's local node. 

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

```
kubectl annotate ns <namespace> "net.beta.kubernetes.io/networkpolicy={\"ingress\": {\"isolation\": \"DefaultDeny\"}}"
```

## The NetworkPolicy Resource
A minimal `NetworkPolicy` might look like this:

```yaml
01. apiVersion: extensions/v1beta1
02. kind: NetworkPolicy
03. metadata:
04.  name: test-network-policy
05. spec:
06.  podSelector:
07.   matchLabels:
08.     role: db
09.  ingress:
10.   - from:
11.      podSelector:
12.       matchLabels:
13.        role: frontend
14.     ports:
15.      - protocol: tcp
16.        port: 6379
```

*POSTing this to the API server will have no effect unless your chosen networking solution supports network policy.*

__Lines 1-4__: As with all other Kubernetes config, a NetworkPolicy needs `apiVersion`, `kind`, and `metadata` fields.  For general information about working with config files, see [here](/docs/user-guide/simple-yaml), [here](/docs/user-guide/configuring-containers), and [here](/docs/user-guide/working-with-resources).

__Lines 5-9__: NetworkPolicy [spec](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api-conventions.md#spec-and-status) has all the information needed to configure a loadbalancer or proxy server. Most importantly, it contains a list of rules matched against all incoming requests. Currently the Ingress resource only supports http rules.

__Lines 6-8__: Each NetworkPolicy includes a `podSelector` which selects the grouping of pods to which the `ingress` rules in the policy apply. 

__Lines 9-16__: Each NetworkPolicy includes a list of whitelist `ingress` rules.  Each rule allows traffic which matches both the `from` and `ports` sections. 

__Complete Specification__: See the [api-reference](https://kubernetes.github.io/docs/api-reference/extensions/v1beta1/definitions/#_v1beta1_networkpolicy) for a full definition of the resource.
