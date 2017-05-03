---
assignees:
- jpeeler
- pmorie
title: Using Projected volumes
redirect_from:
- "/docs/user-guide/projected-volume/"
- "/docs/user-guide/projected-volume/index.html"
---

The _projected volume_ is a volume that projects several existing volume sources
into the same directory. Currently, one can project configmaps, downward API,
and secrets. The resulting pod spec is also shorter when projecting to a single
volume as opposed to multiple different locations. See [all-in-one volume design document](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/all-in-one-volume.md)
for more information.

* TOC
{:toc}

## Overview of a projected volume

The projected volume encapsulates multiple volumes to be projected, with each
volume source respecting nearly the same parameters as supported by each
individual type. Consider the following example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - secret:
          name: mysecret2
          items:
            - key: password
              path: my-group/my-password
              mode: 511
```

Each volume source is listed in the spec under `sources`. As stated above the
parameters are nearly the same with two exceptions:

* For secrets, the `secretName` field has been changed to `name` to be consistent
with config maps naming.
* The `defaultMode` can only be specified at the projected level and not for each
volume source. However, as illustrated above, you can explicitly set the `mode`
for each individual projection.

## Creating projections

A projected volume is created by passing in the pod spec to kubectl as normally
done to create a new pod:
```shell
kubectl create -f podspec.yaml
```

## Restrictions

Both secrets and config maps are required to be in the same namespace as the
pod.
