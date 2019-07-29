---
reviewers:
- bprashanth
- davidopp
- lavalamp
- liggitt
title: Managing ServiceAccounts
content_template: templates/task
weight: 50
---

{{% capture overview %}}

A _ServiceAccount_ provides an identity for processes that run in a Pod.

A process inside a Pod can use the identiy of its associated service account to
authenticate to the cluster's API server.

For an introduction to service accounts, read [configure service accounts](/docs/tasks/configure-pod-container/configure-service-account/).

This guide explains how to add and remove tokens from ServiceAccounts.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}}


To be able to follow these steps exactly, ensure you have a namespace named
`examplens`.
If you don't, create one by running:

```shell
kubectl create namespace examplens
```

You can clean it up when you're done by running:

```shell
kubectl delete namespace examplens
```
{{% /capture %}}

{{% capture steps %}}

## Create additional API tokens {#create-token}

The control plane ensures that a Secret with a current API token exists for each
ServiceAccount. To create additional API tokens for a service account, you
can create a Secret of type `ServiceAccountToken` with an annotation referencing
the ServiceAccount. The _token controller_ then updates the relevant
ServiceAccount with a generated token.

{{< codenew file="secret/serviceaccount/mysecretname.yaml" >}}

To create a Secret based on this example, run:

```shell
kubectl -n examplens create -f https://k8s.io/examples/secret/serviceaccount/mysecretname.yaml
kubectl -n examplens describe secret mysecretname
```

The output is similar to:
```
Name:           mysecretname
Namespace:      examplens
Labels:         <none>
Annotations:    kubernetes.io/service-account.name=myserviceaccount
                kubernetes.io/service-account.uid=8a85c4c4-8483-11e9-bc42-526af7764f64

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1362 bytes
namespace:      9 bytes
token:          ...
```

If you launch a new Pod into the `examplens` namespace, it can use the `myserviceaccount`
service-account-token Secret that you just created.

## Delete/invalidate a ServiceAccount token {#delete-token}

If you know the name of the Secret that contains the token you want to remove:

```shell
kubectl delete secret name-of-secret
```

Otherwise, first find the Secret for the ServiceAccount.

```shell
# This assumes that you already have a namespace named 'examplens'
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```
The output is similar to:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"ServiceAccount","metadata":{"annotations":{},"name":"example-automated-thing","namespace":"examplens"}}
  creationTimestamp: "2019-07-21T07:07:07Z"
  name: example-automated-thing
  namespace: examplens
  resourceVersion: "777"
  selfLink: /api/v1/namespaces/examplens/serviceaccounts/example-automated-thing
  uid: f23fd170-66f2-4697-b049-e1e266b7f835
secrets:
- name: example-automated-thing-token-zyxwv
```
Then, delete the Secret you now know the name of:
```shell
kubectl -n examplens delete secret/example-automated-thing-token-zyxwv
```

The control plane spots that the ServiceAccount is missing its Secret,
and creates a replacement:

```shell
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"ServiceAccount","metadata":{"annotations":{},"name":"example-automated-thing","namespace":"examplens"}}
  creationTimestamp: "2019-07-21T07:07:07Z"
  name: example-automated-thing
  namespace: examplens
  resourceVersion: "1026"
  selfLink: /api/v1/namespaces/examplens/serviceaccounts/example-automated-thing
  uid: f23fd170-66f2-4697-b049-e1e266b7f835
secrets:
- name: example-automated-thing-token-4rdrh
```

You can see that there is now a new associated Secret with a different name. The
old Secret is no longer valid.
{{% /capture %}}
