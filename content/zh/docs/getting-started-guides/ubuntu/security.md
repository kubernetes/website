---
title: 安全考虑
content_template: templates/task
---
<!--
---
title: Security Considerations
content_template: templates/task
---
-->

{{% capture overview %}}
<!--
By default all connections between every provided node are secured via TLS by easyrsa, including the etcd cluster.

This page explains the security considerations of a deployed cluster and production recommendations.
-->
默认情况下，所有提供的节点之间的所有连接（包括 etcd 集群）都通过 easyrsa 的 TLS 进行保护。

本文介绍已部署集群的安全注意事项和生产环境建议。
{{% /capture %}}
{{% capture prerequisites %}}
<!--
This page assumes you have a working Juju deployed cluster.
-->
本文假定您拥有一个使用 Juju 部署的正在运行的集群。
{{% /capture %}}


{{% capture steps %}}
<!--
## Implementation

The TLS and easyrsa implementations use the following [layers](https://jujucharms.com/docs/2.2/developer-layers).

[layer-tls-client](https://github.com/juju-solutions/layer-tls-client)
[layer-easyrsa](https://github.com/juju-solutions/layer-easyrsa)
-->
## 实现

TLS 和 easyrsa 的实现使用以下 [layers](https://jujucharms.com/docs/2.2/developer-layers)。

[layer-tls-client](https://github.com/juju-solutions/layer-tls-client)
[layer-easyrsa](https://github.com/juju-solutions/layer-easyrsa)

<!--
## Limiting ssh access

By default the administrator can ssh to any deployed node in a cluster. You can mass disable ssh access to the cluster nodes by issuing the following command.

    juju model-config proxy-ssh=true

Note: The Juju controller node will still have open ssh access in your cloud, and will be used as a jump host in this case.

Refer to the [model management](https://jujucharms.com/docs/2.2/models) page in the Juju documentation for instructions on how to manage ssh keys.
-->
## 限制 ssh 访问

默认情况下，管理员可以 ssh 到集群中的任意已部署节点。您可以通过以下命令来批量禁用集群节点的 ssh 访问权限。

    juju model-config proxy-ssh=true

注意：Juju 控制器节点在您的云中仍然有开放的 ssh 访问权限，并且在这种情况下将被用作跳板机。

有关如何管理 ssh 密钥的说明，请参阅 Juju 文档中的 [模型管理](https://jujucharms.com/docs/2.2/models) 页面。
{{% /capture %}}


