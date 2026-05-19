---
title: "Namespaces and Names"
linkTitle: "Namespaces and Names"
weight: 5
type: docs
description: >
  Dealing with Namespaces and Names
---


{{< alert color="success" title="TL;DR" >}}
- Set the Namespace for all Resources within a Project with `namespace`
- Prefix the Names of all Resources within a Project with `namePrefix`
- Suffix the Names of all Resources within a Project with `nameSuffix`
{{< /alert >}}

# Setting Namespaces and Names

## Motivation

It may be useful to enforce consistency across the namespace and names of all Resources within
a Project.

- Ensure all Resources are in the correct Namespace
- Ensure all Resources share a common naming convention
- Copy or Fork an existing Project and change the Namespace / Names


## Setting Namespace

Reference: 

The Namespace for all namespaced Resources declared in the Resource Config may be set with `namespace`.
This sets the namespace for both generated Resources (e.g. ConfigMaps and Secrets) and non-generated
Resources.

{{% alert color="success" title="Command / Examples" %}}
Check out the [reference](/references/kustomize/kustomization/namespace/) for commands and examples for `setting namespace`
{{% /alert %}}

**Example:** Set the `namespace` specified in the `kustomization.yaml` on the namespaced Resources.

**Input:** The kustomization.yaml and deployment.yaml files

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: my-namespace
resources:
- deployment.yaml
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
```

**Applied:** The Resource that is Applied to the cluster

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-deployment
  # The namespace has been added
  namespace: my-namespace
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
```

***Overriding Namespaces:***
Setting the namespace will override the namespace on Resources if it is already set.

{{% alert color="success" title="Command / Examples" %}}
Check out the [nameprefix](/references/kustomize/kustomization/nameprefix/) / [namesuffix](/references/kustomize/kustomization/namesuffix/) for commands and examples for `setting nameprefix / namesuffix` to kubernetes resources
{{% /alert %}}



### Propagation of the Name to Object References
Resources such as Deployments and StatefulSets may reference other Resources such as
ConfigMaps and Secrets in the Pod Spec.

This sets a name prefix or suffix for both generated Resources (e.g. ConfigMaps 
and Secrets) and non-generated Resources.

The namePrefix or nameSuffix that is applied is propagated to references to updated resources 
- e.g. references to Secrets and ConfigMaps are updated with the namePrefix and nameSuffix.


{{< alert color="warning" title="References" >}}
Apply will propagate the `namePrefix` to any place Resources within the project are referenced by other Resources
including:

- Service references from StatefulSets
- ConfigMap references from PodSpecs
- Secret references from PodSpecs
{{< /alert >}}