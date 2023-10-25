---
layout: blog
title: "Non-privileged kube-proxy container"
date: 0000-00-00
slug: kube-proxy-non-privileged
---

**Author**: Lars Ekman

This post describes how the `--init-only` flag added in K8s v1.29 can
be used to perform configuration that requires privileged mode in an
initContainer, while the main `kube-proxy` container may run with a
stricter securityContext.

Please note that `kube-proxy` can be installed in different ways, but
installers that installs `kube-proxy` as a POD, like `kubeadm`, can
now use this function for improved security.


## Background

It is undesirable to run a server container like `kube-proxy` in
privileged mode. Security aware users wants to [use capabilities instead](
https://github.com/kubernetes/kubernetes/issues/112171).

If `kube-proxy` is installed as a POD, the initialization requires
"privileged" mode, mostly for setting sysctl's. However, for some time
now `kube-proxy` doesn't alter sysctl's and other settings that
already have the desired value. In theory this can be used to do all
privileged configuration in an initContainer.

The problem is to know *what* to setup. Until now the only option has
been to read the source, but with `--init-only` the setup is done
*exactly* as on a normal start, and then `kube-proxy` exits.


## Initializing kube-proxy in an init container

Traditionally `kube-proxy` runs in "privileged mode (manifests
narrowed):

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  labels:
    k8s-app: kube-proxy
spec:
  template:
    spec:
      containers:
      - name: kube-proxy
        command:
        - /usr/local/bin/kube-proxy
        - --config=/var/lib/kube-proxy/config.conf
        - --hostname-override=$(NODE_NAME)
        securityContext:
          privileged: true
```

But now it is possible to use:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  labels:
    k8s-app: kube-proxy
spec:
  template:
    spec:
      initContainers:
      - name: kube-proxy-init
        command:
        - /usr/local/bin/kube-proxy
        - --config=/var/lib/kube-proxy/config.conf
        - --init-only
        securityContext:
          privileged: true
      containers:
      - name: kube-proxy
        command:
        - /usr/local/bin/kube-proxy
        - --config=/var/lib/kube-proxy/config.conf
        - --hostname-override=$(NODE_NAME)
        securityContext:
          capabilities:
            add: ["NET_ADMIN"]
```


## Improve security even more



## Summary

The `--init-only` flag can be used to perform privileged
initialization in an initContainer and run the main container with
"NET_ADMIN" capabilities only. Installers like `kubeadm` may be
altered to use this feature.
