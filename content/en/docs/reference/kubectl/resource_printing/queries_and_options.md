---
title: "Queries and Options"
linkTitle: "Queries and Options"
weight: 5
type: docs
description: >
    Prints result of queries
---


Match Resources with Queries when Getting or Describing them.

## Resource Config By `kustomization.yaml`

Get all Resources provided by the `kustomization.yaml` in project/.

```bash
kubectl get -k project/
```

## Resource Config By Dir

Get all Resources present in the Resource Config for a directory.

```bash
kubectl get -f configs/
```

## Resource Types

Get **all** Resources in a namespace for a given type.

The Group and Version for the Resource are determined by the apiserver discovery service.

The Singular, Plural, Short Name also apply to *Types with Name* and *Types with Selectors*.

```bash
# Plural
kubectl get deployments
```

```bash
# Singular
kubectl get deployment
```

```bash
# Short name
kubectl get deploy
```

## Resource Types with Group / Version

Get **all** Resources in a namespace for a given type.

The Group and Version for the Resource are explicit.

```bash
kubectl get deployments.apps
```

```bash
kubectl get deployments.v1.apps
```

## Resource Types with Name

Get named Resources in a namespace for a given type.

```bash
kubectl get deployment nginx
```

## Label Selector

Get **all** Resources in a namespace **matching a label select** for a given type.

```bash
kubectl get deployments -l app=nginx
```

## Namespaces

By default Get and Describe will fetch resource in the default namespace or the namespace specified
with `--namespace`.

The `--all-namespaces` flag will **fetch Resources from all namespaces**.

```bash
kubectl get deployments --all-namespaces
```

## List multiple Resource types

Get and Describe can accept **multiple Resource types**, and it will print them both in separate sections.

```bash
kubectl get deployments,services
```

## List multiple Resource types by name

Get and Describe can accept **multiple Resource types and names**.

```bash
kubectl get rc/web service/frontend pods/web-pod-13je7
```

## Not Found

By default, Get or Describe **will return an error if an object is requested and doesn't exist**.
The `--ignore-not-found` flag will cause kubectl to exit 0 if the Resource is not found

```bash
kubectl get deployment nginx --ignore-not-found
```
