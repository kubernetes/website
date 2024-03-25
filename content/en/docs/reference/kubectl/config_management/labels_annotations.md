---
title: "Labels and Annotations"
linkTitle: "Labels and Annotations"
weight: 6
type: docs
description: >
  Dealing with Labels and Annotations
---


{{< alert color="success" title="TL;DR" >}}
- Set Labels for all Resources declared within a Project with `commonLabels`
- Set Annotations for all Resources declared within a Project with `commonAnnotations`
{{< /alert >}}

# Setting Labels and Annotations

## Motivation

Users may want to define a common set of labels or annotations for all the Resource in a project.

- Identify the Resources within a project by querying their labels.
- Set metadata for all Resources within a project (e.g. environment=test).
- Copy or Fork an existing Project and add or change labels and annotations.


## Setting Labels

**Example:** Add the labels declared in `commonLabels` to all Resources in the project.

**Important:** Once set, commonLabels should not be changed so as not to change the Selectors for Services
or Workloads.

**Input:** The kustomization.yaml and deployment.yaml files

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
commonLabels:
  app: foo
  environment: test
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
    bar: baz
spec:
  selector:
    matchLabels:
      app: nginx
      bar: baz
  template:
    metadata:
      labels:
        app: nginx
        bar: baz
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
    app: foo # Label was changed
    environment: test # Label was added
    bar: baz # Label was ignored
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: foo # Selector was changed
      environment: test # Selector was added
      bar: baz # Selector was ignored
  template:
    metadata:
      labels:
        app: foo # Label was changed
        environment: test # Label was added
        bar: baz # Label was ignored
    spec:
      containers:
      - image: nginx
        name: nginx
```

{{% alert color="success" title="Command / Examples" %}}
Check out the [reference](/references/kustomize/kustomization/commonlabels/) for commands and examples for `setting labels`
{{% /alert %}}

### Propagating Labels to Selectors
In addition to updating the labels for each Resource, any selectors will also be updated to target the
labels.  e.g. the selectors for Services in the project will be updated to include the commonLabels
*in addition* to the other labels.

**Note:** Once set, commonLabels should not be changed so as not to change the Selectors for Services
or Workloads.

{{< alert color="success" title="Common Labels" >}}
The k8s.io documentation defines a set of [Common Labeling Conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)
that may be applied to Applications.

**Note:** commonLabels should only be set for **immutable** labels, since they will be applied to Selectors.

Labeling Workload Resources makes it simpler to query Pods - e.g. for the purpose of getting their logs.
{{< /alert >}}


## Setting Annotations 

Setting Annotations is very similar to setting labels as seen above. Check out the [reference](/references/kustomize/kustomization/commonannotations/) for commands and examples.

{{< alert color="warning" title="Propagating Annotations" >}}
In addition to updating the annotations for each Resource, any fields that contain ObjectMeta
(e.g. PodTemplate) will also have the annotations added.
{{< /alert >}}