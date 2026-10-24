---
layout: blog
title: "Kubernetes v1.38: A Better Way to Configure File Owner of Volume Files"
slug: kubernetes-v1-38-atomic-write-volume-user-fields-beta
draft: true
author: >
  [Gavin Lam](https://github.com/gavinkflam)
---

Kubernetes v1.38 introduces the ability for configuring file user ownership (UID) of
`configMap`, `secret`, `downwardAPI` and `projected` volumes.

Currently in beta, this feature is enabled by default via the `AtomicWriteVolumeUserFields` feature flag.

## The problem

Many popular software requires strict file ownerships, such as MongoDB replica set
[key files][mongodb-key-files] and SSHD [host keys][sshd-host-keys]. The existing implementation
creates files owned by root and therefore not satisfying such ownership requirements.
A known workaround involves running `initContainers` as root to perform `chown`.

However, this workaround is not possible in clusters implementing the [restricted][restricted-policy] pod
security standards policy that follow the current pod hardening best practices. The policy requires pods to
run as non-root and drop all capabilities, therefore rending this workaround impossible. Moreover, even in
less hardened clusters, the workaround creates unnecessary friction and maintenance overhead.

[mongodb-key-files]: https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/#enforce-keyfile-access-control-on-existing-replica-set
[sshd-host-keys]: https://man.openbsd.org/sshd_config#HostKey
[restricted-policy]: https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted

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
    - name: volA
      mountPath: /mnt/volA
    - name: volB
      mountPath: /mnt/volB
    - name: volC
      mountPath: /mnt/volC
  volumes:
  - name: volA
    configMap:
      defaultUser: 1000
      name: cm1
      items:
      - key: foo # Owner=defaultUser
        path: foo
      - key: bar # Owner=user
        path: bar
        user: 1001
  - name: volB
    secret: # Owner=defaultUser
      defaultUser: 1000
      secretName: secret1
  - name: volC
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

For more details, refer to [KEP-5936](https://github.com/kubernetes/enhancements/issues/5936).
