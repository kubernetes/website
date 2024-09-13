---
title: Decrypt Confidential Data that is Already Encrypted at Rest
content_type: task
weight: 215
---

<!-- overview -->

All of the APIs in Kubernetes that let you write persistent API resource data support
at-rest encryption. For example, you can enable at-rest encryption for
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.
This at-rest encryption is additional to any system-level encryption for the
etcd cluster or for the filesystem(s) on hosts where you are running the
kube-apiserver.

This page shows how to switch from encryption of API data at rest, so that API data
are stored unencrypted. You might want to do this to improve performance; usually,
though, if it was a good idea to encrypt some data, it's also a good idea to leave them
encrypted.

{{< note >}}
This task covers encryption for resource data stored using the
{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}. For example, you can
encrypt Secret objects, including the key-value data they contain.

If you wanted to manage encryption for data in filesystems that are mounted into containers, you instead
need to either:

- use a storage integration that provides encrypted
  {{< glossary_tooltip text="volumes" term_id="volume" >}}
- encrypt the data within your own application
{{< /note >}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* This task assumes that you are running the Kubernetes API server as a
  {{< glossary_tooltip text="static pod" term_id="static-pod" >}} on each control
  plane node.

* Your cluster's control plane **must** use etcd v3.x (major version 3, any minor version).

* To encrypt a custom resource, your cluster must be running Kubernetes v1.26 or newer.

* You should have some API data that are already encrypted.

{{< version-check >}}


<!-- steps -->

## Determine whether encryption at rest is already enabled

By default, the API server uses an `identity` provider that stores plain-text representations
of resources.
**The default `identity` provider does not provide any confidentiality protection.**

The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that specifies a path to a configuration file. The contents of that file, if you specify one,
control how Kubernetes API data is encrypted in etcd.
If it is not specified, you do not have encryption at rest enabled.

The format of that configuration file is YAML, representing a configuration API kind named
[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-config.v1/).
You can see an example configuration
in [Encryption at rest configuration](/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration).

If `--encryption-provider-config` is set, check which resources (such as `secrets`) are
configured for encryption, and what provider is used.
Make sure that the preferred provider for that resource type is **not** `identity`; you
only set `identity` (_no encryption_) as default when you want to disable encryption at
rest.
Verify that the first-listed provider for a resource is something **other** than `identity`,
which means that any new information written to resources of that type will be encrypted as
configured. If you do see `identity` as the first-listed provider for any resource, this
means that those resources are being written out to etcd without encryption.

## Decrypt all data {#decrypting-all-data}

This example shows how to stop encrypting the Secret API at rest. If you are encrypting
other API kinds, adjust the steps to match.

### Locate the encryption configuration file

First, find the API server configuration files. On each control plane node, static Pod manifest
for the kube-apiserver specifies a command line argument, `--encryption-provider-config`.
You are likely to find that this file is mounted into the static Pod using a
[`hostPath`](/docs/concepts/storage/volumes/#hostpath) volume mount. Once you locate the volume
you can find the file on the node filesystem and inspect it.

### Configure the API server to decrypt objects

To disable encryption at rest, place the `identity` provider as the first
entry in your encryption configuration file.

For example, if your existing EncryptionConfiguration file reads:
```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            # Do not use this (invalid) example key for encryption
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
```

then change it to:

```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - identity: {} # add this line
      - aescbc:
          keys:
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
```

and restart the kube-apiserver Pod on this node.

### Reconfigure other control plane hosts {#api-server-config-update-more-1}

If you have multiple API servers in your cluster, you should deploy the changes in turn to each API server.

Make sure that you use the same encryption configuration on each control plane host.

### Force decryption

Then run the following command to force decryption of all Secrets:

```shell
# If you are decrypting a different kind of object, change "secrets" to match.
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

Once you have replaced **all** existing encrypted resources with backing data that
don't use encryption, you can remove the encryption settings from the
`kube-apiserver`.

The command line options to remove are:

- `--encryption-provider-config`
- `--encryption-provider-config-automatic-reload`

Restart the kube-apiserver Pod again to apply the new configuration.

### Reconfigure other control plane hosts {#api-server-config-update-more-2}

If you have multiple API servers in your cluster, you should again deploy the changes in turn to each API server.

Make sure that you use the same encryption configuration on each control plane host.

## {{% heading "whatsnext" %}}

* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-config.v1/).
