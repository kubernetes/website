---
layout: blog
title: "Kubernetes v1.38: A Better Way to Configure File Owner of Volume Files"
slug: kubernetes-v1-38-atomic-write-volume-user-fields-beta
draft: true
author: >
  [Gavin Lam](https://github.com/gavinkflam)
---

In Kubernetes v1.38, file user ownership (UID) fields for `configMap`, `secret`, `downwardAPI`
and `projected` volumes are promoted to beta.

This feature is enabled by default via the `AtomicWriteVolumeUserFields` feature gate.

## The problem

Many popular software requires strict file ownerships, such as MongoDB replica set
[key files][mongodb-key-files] and SSHD [host keys][sshd-host-keys]. The existing implementation
creates files owned by root and therefore not satisfying such ownership requirements.
A known workaround involves running `initContainers` as root to perform `chown`.

However, this workaround is not feasible in clusters that enforce Pods to meet the [_restricted_][pss-restricted] Pod Security Standard.
Requiring that Pods meet the restricted standard means that all of their containers, even init containers and sidecars,
must run as non-root and drop all capabilities, therefore rendering the workaround impossible.

Even in less hardened clusters, this init containers workaround still adds unnecessary friction and maintenance overhead.

[mongodb-key-files]: https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/#enforce-keyfile-access-control-on-existing-replica-set
[sshd-host-keys]: https://man.openbsd.org/sshd_config#HostKey
[pss-restricted]: /docs/concepts/security/pod-security-standards/#restricted

## How it works

When `defaultUser` is specified at the volume level, it sets the owner UID for all its data files at creation time.
At the item level, the `user` field controls owner UID of an individual file and takes precedence over `defaultUser`.

The following example demonstrates how the file owner UIDs are determined by the new user fields.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-user-fields-example
spec:
  containers:
  - name: test
    image: busybox:1.28
    command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
    volumeMounts:
    - name: vol-a
      mountPath: /mnt/volA
    - name: vol-b
      mountPath: /mnt/volB
    - name: vol-c
      mountPath: /mnt/volC
  volumes:
  - name: vol-a
    configMap:
      defaultUser: 1000
      name: cm1
      items:
      - key: foo # Owner=defaultUser
        path: foo
      - key: bar # Owner=user
        path: bar
        user: 1001
  - name: vol-b
    secret: # Owner=defaultUser
      defaultUser: 1000
      secretName: secret1
  - name: vol-c
    projected:
      sources:
      - secret:
          name: secret2
          items:
          - key: moo # Owner=root
            path: moo
          - key: baa # Owner=user
            path: baa
            user: 1000
```

## How can I learn more?

You can also read the enhancement proposal, [KEP-5936](https://www.kubernetes.dev/resources/keps/5936/).
