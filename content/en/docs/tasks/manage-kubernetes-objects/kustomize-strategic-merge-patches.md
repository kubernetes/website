---
title: Customize Kubernetes Objects with Strategic Merge Patches
description: Add, update, and delete items in Kubernetes object lists using Kustomize strategic merge patches.
content_type: task
weight: 30
---

<!-- overview -->

This task shows how to use [Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
strategic merge patches to add, update, and delete items in a list. The examples
customize the `containers` list in a Deployment's Pod template.

## {{% heading "prerequisites" %}}

Install [`kubectl`](/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Create a base

Create a directory for a Kustomize base and overlay:

```shell
mkdir -p kustomize/base kustomize/overlays/production
cd kustomize
```

Create `base/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
      - name: memcached
        image: memcached:1.6
```

Create `base/kustomization.yaml`:

```yaml
resources:
- deployment.yaml
```

## How strategic merge patches match list items

Some Kubernetes object lists use the strategic merge `merge` strategy. For these
lists, Kustomize matches an item using the list's merge key. The merge key for a
Pod's `containers` list is `name`.

An item omitted from a strategic merge patch is retained. Setting an item to
`null` also does not delete it. To remove a matched item, use the `$patch: delete`
directive.

The following sections create three patches: one to update the `nginx` container,
one to add a sidecar, and one to remove the `memcached` container.

## Update an item in a list

Create `overlays/production/update-nginx.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  template:
    spec:
      containers:
      - name: nginx
        image: nginx:1.28
```

Because `nginx` matches the name of a container in the base, this patch updates
that container's image. Fields not included in the patch remain unchanged.

## Add an item to a list

Create `overlays/production/add-sidecar.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  template:
    spec:
      containers:
      - name: log-sidecar
        image: busybox:1.37
        args:
        - /bin/sh
        - -c
        - tail -f /dev/null
```

The base does not have a container named `log-sidecar`, so Kustomize adds this
container to the list.

## Delete an item from a list

Create `overlays/production/delete-memcached.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  template:
    spec:
      containers:
      - $patch: delete
        name: memcached
```

The `$patch: delete` directive removes the container whose merge key is
`name: memcached`.

## Apply the patches

Create `overlays/production/kustomization.yaml`:

```yaml
resources:
- ../../base
patches:
- path: update-nginx.yaml
- path: add-sidecar.yaml
- path: delete-memcached.yaml
```

Build the overlay:

```shell
kubectl kustomize overlays/production
```

The resulting Deployment has an updated `nginx` container and the added
`log-sidecar` container. It does not have a `memcached` container:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  template:
    spec:
      containers:
      - args:
        - /bin/sh
        - -c
        - tail -f /dev/null
        image: busybox:1.37
        name: log-sidecar
      - image: nginx:1.28
        name: nginx
```

Apply the customized configuration to your cluster:

```shell
kubectl apply -k overlays/production
```

{{< note >}}
Strategic merge behavior depends on the patch strategy and merge key defined for
the field. Lists without a merge strategy are replaced as a whole. Strategic merge
patches are not supported for custom resources.
{{< /note >}}

## {{% heading "whatsnext" %}}

* [Declarative Management of Kubernetes Objects Using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
* [Update API Objects in Place Using kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
