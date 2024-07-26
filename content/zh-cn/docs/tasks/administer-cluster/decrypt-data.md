---
title: 解密已静态加密的机密数据
content_type: task
weight: 215
---
<!--
title: Decrypt Confidential Data that is Already Encrypted at Rest
content_type: task
weight: 215
-->

<!-- overview -->

<!--
All of the APIs in Kubernetes that let you write persistent API resource data support
at-rest encryption. For example, you can enable at-rest encryption for
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.
This at-rest encryption is additional to any system-level encryption for the
etcd cluster or for the filesystem(s) on hosts where you are running the
kube-apiserver.
-->
Kubernetes 中允许允许你写入持久性 API 资源数据的所有 API 都支持静态加密。
例如，你可以为 {{< glossary_tooltip text="Secret" term_id="secret" >}} 启用静态加密。
此静态加密是对 etcd 集群或运行 kube-apiserver 的主机上的文件系统的所有系统级加密的补充。

<!--
This page shows how to switch from encryption of API data at rest, so that API data
are stored unencrypted. You might want to do this to improve performance; usually,
though, if it was a good idea to encrypt some data, it's also a good idea to leave them
encrypted.
-->
本文介绍如何停止静态加密 API 数据，以便 API 数据以未加密的形式存储。
你可能希望这样做以提高性能；但通常情况下，如果加密某些数据是个好主意，那么继续加密这些数据也是一个好主意。

{{< note >}}
<!--
This task covers encryption for resource data stored using the
{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}. For example, you can
encrypt Secret objects, including the key-value data they contain.
-->
此任务涵盖使用 {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}
存储的资源数据的加密。例如，你可以加密 Secret 对象，包括它们所包含的键值数据。

<!--
If you wanted to manage encryption for data in filesystems that are mounted into containers, you instead
need to either:

- use a storage integration that provides encrypted
  {{< glossary_tooltip text="volumes" term_id="volume" >}}
- encrypt the data within your own application
-->
如果要加密安装到容器中的文件系统中的数据，则需要：

- 使用提供{{< glossary_tooltip text="存储卷" term_id="volume" >}}加密的存储集成方案
- 在你自己的应用中加密数据
{{< /note >}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!--
* This task assumes that you are running the Kubernetes API server as a
  {{< glossary_tooltip text="static pod" term_id="static-pod" >}} on each control
  plane node.

* Your cluster's control plane **must** use etcd v3.x (major version 3, any minor version).
-->
* 此任务假设你将 Kubernetes API 服务器组件以{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}
  方式运行在每个控制平面节点上。

* 集群的控制平面**必须**使用 etcd v3.x（主版本 3，任何次要版本）。

<!--
* To encrypt a custom resource, your cluster must be running Kubernetes v1.26 or newer.

* You should have some API data that are already encrypted.
-->
* 要加密自定义资源，你的集群必须运行 Kubernetes v1.26 或更高版本。

* 你应该有一些已加密的 API 数据。

{{< version-check >}}

<!-- steps -->

<!--
## Determine whether encryption at rest is already enabled

By default, the API server uses an `identity` provider that stores plain-text representations
of resources.
**The default `identity` provider does not provide any confidentiality protection.**
-->
## 确定静态加密是否已被启用   {#determine-whether-encryption-at-rest-is-already-enabled}

默认情况下，API 服务器使用一个名为 `identity` 的提供程序来存储资源的明文表示。
**默认的 `identity` 提供程序不提供任何机密性保护。**

<!--
The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that specifies a path to a configuration file. The contents of that file, if you specify one,
control how Kubernetes API data is encrypted in etcd.
If it is not specified, you do not have encryption at rest enabled.

The format of that configuration file is YAML, representing a configuration API kind named
[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-encryption.v1/).
You can see an example configuration
in [Encryption at rest configuration](/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration).
-->
`kube-apiserver` 进程接受参数 `--encryption-provider-config`，该参数指定了配置文件的路径。
如果你指定了一个路径，那么该文件的内容将控制 Kubernetes API 数据在 etcd 中的加密方式。
如果未指定，则表示你未启用静态加密。

该配置文件的格式是 YAML，表示名为
[`EncryptionConfiguration`](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/) 的配置 API 类别。
你可以在[静态加密配置](/zh-cn/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration)中查看示例配置。

<!--
If `--encryption-provider-config` is set, check which resources (such as `secrets`) are
configured for encryption, and what provider is used.
Make sure that the preferred provider for that resource type is **not** `identity`; you
only set `identity` (_no encryption_) as default when you want to disable encryption at
rest.
Verify that the first-listed provider for a resource is something **other** than `identity`,
which means that any new information written to resources of that type will be encrypted as
configured. If you do see `identity` as the first-listed provider for any resource, this
means that those resources are being written out to etcd without encryption.
-->
如果设置了 `--encryption-provider-config`，检查哪些资源（如 `secrets`）已配置为进行加密，
并查看所适用的是哪个提供程序。确保该资源类型首选的提供程序 **不是** `identity`；
只有在想要禁用静态加密时，才可将 `identity`（**无加密**）设置为默认值。
验证资源首选的提供程序是否不是 `identity`，这意味着写入该类型资源的任何新信息都将按照配置被加密。
如果在任何资源的首选提供程序中看到 `identity`，这意味着这些资源将以非加密的方式写入 etcd 中。

<!--
## Decrypt all data {#decrypting-all-data}

This example shows how to stop encrypting the Secret API at rest. If you are encrypting
other API kinds, adjust the steps to match.
-->
## 解密所有数据 {#decrypting-all-data}

本例展示如何停止对 Secret API 进行静态加密。如果你正在加密其他 API 类别，可以相应调整以下步骤。

<!--
### Locate the encryption configuration file

First, find the API server configuration files. On each control plane node, static Pod manifest
for the kube-apiserver specifies a command line argument, `--encryption-provider-config`.
You are likely to find that this file is mounted into the static Pod using a
[`hostPath`](/docs/concepts/storage/volumes/#hostpath) volume mount. Once you locate the volume
you can find the file on the node filesystem and inspect it.
-->
### 找到加密配置文件   {#locate-encryption-configuration-file}

首先，找到 API 服务器的配置文件。在每个控制平面节点上，kube-apiserver 的静态 Pod
清单指定了一个命令行参数 `--encryption-provider-config`。你很可能会发现此文件通过
[`hostPath`](/zh-cn/docs/concepts/storage/volumes/#hostpath) 卷挂载到静态 Pod 中。
一旦你找到到此卷，就可以在节点文件系统中找到此文件并对其进行检查。

<!--
### Configure the API server to decrypt objects

To disable encryption at rest, place the `identity` provider as the first
entry in your encryption configuration file.

For example, if your existing EncryptionConfiguration file reads:
-->
### 配置 API 服务器以解密对象   {#configure-api-server-to-decrypt-objects}

要禁用静态加密，将 `identity` 提供程序设置为加密配置文件中的第一个条目。

例如，如果你现有的 EncryptionConfiguration 文件内容如下：

<!--
# Do not use this (invalid) example key for encryption
-->
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
            # 你加密时不要使用这个（无效）的示例密钥
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
```

<!--
then change it to:
-->
然后将其更改为：

<!--
# add this line
-->
```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - identity: {} # 增加这一行
      - aescbc:
          keys:
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
```

<!--
and restart the kube-apiserver Pod on this node.

### Reconfigure other control plane hosts {#api-server-config-update-more-1}

If you have multiple API servers in your cluster, you should deploy the changes in turn to each API server.

Make sure that you use the same encryption configuration on each control plane host.
-->
并重启此节点上的 kube-apiserver Pod。

### 重新配置其他控制平面主机 {#api-server-config-update-more-1}

如果你的集群中有多个 API 服务器，应轮流对每个 API 服务器部署这些更改。

确保在每个控制平面主机上使用相同的加密配置。

<!--
### Force decryption

Then run the following command to force decryption of all Secrets:
-->
### 强制解密   {#force-decryption}

然后运行以下命令强制解密所有 Secret：

<!--
# If you are decrypting a different kind of object, change "secrets" to match.
-->
```shell
# 如果你正在解密不同类别的对象，请相应更改 "secrets"
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
Once you have replaced **all** existing encrypted resources with backing data that
don't use encryption, you can remove the encryption settings from the
`kube-apiserver`.

The command line options to remove are:
-->
一旦你用未加密的后台数据替换了**所有**现有的已加密资源，即可从 `kube-apiserver` 中删除这些加密设置。

要移除的命令行选项为：

- `--encryption-provider-config`
- `--encryption-provider-config-automatic-reload`

<!--
Restart the kube-apiserver Pod again to apply the new configuration.

### Reconfigure other control plane hosts {#api-server-config-update-more-2}

If you have multiple API servers in your cluster, you should again deploy the changes in turn to each API server.

Make sure that you use the same encryption configuration on each control plane host.
-->
再次重启 kube-apiserver Pod 以应用新的配置。

### 重新配置其他控制平面主机   {#api-server-config-update-more-2}

如果你的集群中有多个 API 服务器，应再次轮流对每个 API 服务器部署这些更改。

确保在每个控制平面主机上使用相同的加密配置。

## {{% heading "whatsnext" %}}

<!--
* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-config.v1/).
-->
* 更多细节参阅 [EncryptionConfiguration configuration API (v1)](/zh-cn/docs/reference/config-api/apiserver-config.v1/)。
