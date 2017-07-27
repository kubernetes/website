---
assignees:
- pwittrock
title: Object Configuration Architecture
redirect_from:
---

{% capture overview %}

This page describes techniques for constructing and managing Kubernetes
object configuration.

## Goals

It should be simple to:

- look at the object configuration and understand what will be created in the cluster
- maintain and audit common or cross-cutting configuration
- identify issues in the object configuration as early as possible

{% endcapture %}

{:toc}

{% capture body %}

## Processes

- Composition
- Audit
- Application
- Decomposition

## Composition

The composition process take a complete or partial object definition and merges
in object definitions from additional sources.

Composition does not add a new abstraction layer to build an object, but instead
authors an object using multiple sources.

### Strategic merge (Static)

Composition of raw configs can be done through *merging* configuration together.
Merges can be done be either merging 2 local configuration files together,
or by mering a local configuration into the remote cluster definition.

`kubectl apply` and `kubectl path` using a strategic merge patch to update
objects in the server while retaining configuration composed from other
sources.

#### Local

> /base/java/app.yaml

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  # +required
  name:
spec:
  template:
    metadata:
      # +required:
      labels:
    spec:
      containers:
      - name: hello-world
        # +required
        image:
        args:
        - $(MAX_HEAP)
        - $(MIN_HEAP)
        - $(JAR)
        resources:
         requests:
         cpu: 100m
           memory: 100Mi
        env:
        - name: MAX_HEAP
          value: Xmx2048m
        - name: MIN_HEAP
          value: Xms1028m
        ports:
        - containerPort: 8080
```

> /actual/myappl.yaml

```yaml
# +merge:/base/java/app.yaml
metadata:
  name: myjavaapp
spec:
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - name: hello-world
        image: hello-world:v0.1
        env:
        - name: MAX_HEAP
          value: Xmx4096m
        - name: JAR
          value: myapp.jar
      env:
```

> merged

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: myjavaapp
spec:
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - name: hello-world
        image: hello-world:v0.1
        args:
        - $(MAX_HEAP)
        - $(MIN_HEAP)
        - $(JAR)
        resources:
         requests:
         cpu: 100m
           memory: 100Mi
        env:
        - name: MAX_HEAP
          value: Xmx4096m
        - name: MIN_HEAP
          value: Xms1028m
        - name: JAR
          value: myapp.jar
        ports:
        - containerPort: 8080
```

#### Remote merge

- 2-way diff
- 3-way diff

### Pull (Static/Dynamic Hybrid)

- Configmap

### Push (Dynamic)

- Defaulting
- Admission Controllers
- Initializers
- Controllers
  - HPA
- Operators

## Audit

### Diff

### Schema validation

### Value validation

### Linting / Vetting

## Application


## Decomposition

### Static

- Templates

### Dynamic

- Controllers
  - Deployment
  - Replicaset
- Operators

Notes:
strict enforcement vs easy to do the right thing

{% endcapture %}

{% include templates/concept.md %}
