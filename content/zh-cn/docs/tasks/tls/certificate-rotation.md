---
title: 为 kubelet 配置证书轮换
content_type: task
---
<!--
reviewers:
- jcbsmpsn
- mikedanese
title: Configure Certificate Rotation for the Kubelet
content_type: task
-->

<!-- overview -->
<!--
This page shows how to enable and configure certificate rotation for the kubelet.
-->
本文展示如何在 kubelet 中启用并配置证书轮换。

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

## {{% heading "prerequisites" %}}

<!--
* Kubernetes version 1.8.0 or later is required
-->
* 要求 Kubernetes 1.8.0 或更高的版本

<!-- steps -->

<!--
## Overview

The kubelet uses certificates for authenticating to the Kubernetes API.  By
default, these certificates are issued with one year expiration so that they do
not need to be renewed too frequently.
-->
## 概述

Kubelet 使用证书进行 Kubernetes API 的认证。
默认情况下，这些证书的签发期限为一年，所以不需要太频繁地进行更新。

<!--
Kubernetes contains [kubelet certificate
rotation](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/),
that will automatically generate a new key and request a new certificate from
the Kubernetes API as the current certificate approaches expiration. Once the
new certificate is available, it will be used for authenticating connections to
the Kubernetes API.
-->
Kubernetes 包含特性
[kubelet 证书轮换](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)，
在当前证书即将过期时，
将自动生成新的秘钥，并从 Kubernetes API 申请新的证书。 一旦新的证书可用，它将被用于与
Kubernetes API 间的连接认证。

<!--
## Enabling client certificate rotation

The `kubelet` process accepts an argument `--rotate-certificates` that controls
if the kubelet will automatically request a new certificate as the expiration of
the certificate currently in use approaches.
-->
## 启用客户端证书轮换

 `kubelet` 进程接收 `--rotate-certificates` 参数，该参数决定 kubelet 在当前使用的
证书即将到期时，是否会自动申请新的证书。

<!--
The `kube-controller-manager` process accepts an argument
`--cluster-signing-duration`  (`--experimental-cluster-signing-duration` prior to 1.19)
that controls how long certificates will be issued for.
-->
`kube-controller-manager` 进程接收 `--cluster-signing-duration` 参数
（在 1.19 版本之前为 `--experimental-cluster-signing-duration`），用来
控制签发证书的有效期限。

<!--
## Understanding the certificate rotation configuration

When a kubelet starts up, if it is configured to bootstrap (using the
`--bootstrap-kubeconfig` flag), it will use its initial certificate to connect
to the Kubernetes API and issue a certificate signing request. You can view the
status of certificate signing requests using:
-->
## 理解证书轮换配置

当 kubelet 启动时，如被配置为自举（使用`--bootstrap-kubeconfig` 参数），kubelet
会使用其初始证书连接到 Kubernetes API ，并发送证书签名的请求。
可以通过以下方式查看证书签名请求的状态：

```shell
kubectl get csr
```

<!--
Initially a certificate signing request from the kubelet on a node will have a
status of `Pending`. If the certificate signing requests meets specific
criteria, it will be auto approved by the controller manager, then it will have
a status of `Approved`. Next, the controller manager will sign a certificate,
issued for the duration specified by the
`--cluster-signing-duration` parameter, and the signed certificate
will be attached to the certificate signing request.
-->
最初，来自节点上 kubelet 的证书签名请求处于 `Pending` 状态。 如果证书签名请求满足特定条件，
控制器管理器会自动批准，此时请求会处于 `Approved` 状态。 接下来，控制器管理器会签署证书，
证书的有效期限由 `--cluster-signing-duration` 参数指定，签署的证书会被附加到证书签名请求中。

<!--
The kubelet will retrieve the signed certificate from the Kubernetes API and
write that to disk, in the location specified by `--cert-dir`. Then the kubelet
will use the new certificate to connect to the Kubernetes API.
-->
Kubelet 会从 Kubernetes API 取回签署的证书，并将其写入磁盘，存储位置通过 `--cert-dir`
参数指定。
然后 kubelet 会使用新的证书连接到 Kubernetes API。

<!--
As the expiration of the signed certificate approaches, the kubelet will
automatically issue a new certificate signing request, using the Kubernetes API. 
This can happen at any point between 30% and 10% of the time remaining on the 
certificate. Again, the controller manager will automatically approve the certificate
request and attach a signed certificate to the certificate signing request. The
kubelet will retrieve the new signed certificate from the Kubernetes API and
write that to disk. Then it will update the connections it has to the
Kubernetes API to reconnect using the new certificate.
-->
当签署的证书即将到期时，kubelet 会使用 Kubernetes API，自动发起新的证书签名请求。
该请求会发生在证书的有效时间剩下 30% 到 10% 之间的任意时间点。
同样地，控制器管理器会自动批准证书请求，并将签署的证书附加到证书签名请求中。 Kubelet
会从 Kubernetes API 取回签署的证书，并将其写入磁盘。 然后它会更新与 Kubernetes API
的连接，使用新的证书重新连接到 Kubernetes API。

