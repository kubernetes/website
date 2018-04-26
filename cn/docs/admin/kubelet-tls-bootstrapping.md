---
assignees:
- ericchiang
- mikedanese
- jcbsmpsn
cn-approvers:
- rootsongjc
cn-reviewers:
- rootsongjc
title: TLS 引导程序
---

* TOC
{:toc}
<!--

## Overview

This document describes how to set up TLS client certificate bootstrapping for kubelets.
Kubernetes 1.4 introduced an API for requesting certificates from a cluster-level Certificate Authority (CA). The original intent of this API is to enable provisioning of TLS client certificates for kubelets. The proposal can be found [here](https://github.com/kubernetes/kubernetes/pull/20439)
and progress on the feature is being tracked as [feature #43](https://github.com/kubernetes/features/issues/43).

-->

## 概览

本文档介绍如何为 kubelet 设置 TLS 客户端证书引导（bootstrapping）。

Kubernetes 1.4 引入了一个用于从集群级证书颁发机构（CA）请求证书的 API。此 API 的原始目的是为 kubelet 提供 TLS 客户端证书。可以在 [这里](https://github.com/kubernetes/kubernetes/pull/20439) 找到该提议，在 [feature #43](https://github.com/kubernetes/features/issues/43) 追踪该功能的进度。

<!--

## kube-apiserver configuration

You must provide a token file which specifies at least one "bootstrap token" assigned to a kubelet bootstrap-specific group.
This group will later be used in the controller-manager configuration to scope approvals in the default approval
controller. As this feature matures, you should ensure tokens are bound to a Role-Based Access Control (RBAC) policy which limits requests
(using the bootstrap token) strictly to client requests related to certificate provisioning. With RBAC in place, scoping the tokens to a group allows for great flexibility (e.g. you could disable a particular bootstrap group's access when you are done provisioning the nodes).

-->

## kube-apiserver 配置

您必须提供一个 token 文件，该文件中指定了至少一个分配给 kubelet 特定 bootstrap 组的 “bootstrap token”。

该组将作为 controller manager 配置中的默认批准控制器而用于审批。随着此功能的成熟，您应该确保 token 被绑定到基于角色的访问控制（RBAC）策略上，该策略严格限制了与证书配置相关的客户端请求（使用 bootstrap token）。使用 RBAC，将 token 范围划分为组可以带来很大的灵活性（例如，当您配置完成节点后，您可以禁用特定引导组的访问）。

<!--

### Token authentication file
Tokens are arbitrary but should represent at least 128 bits of entropy derived from a secure random number
generator (such as /dev/urandom on most modern systems). There are multiple ways you can generate a token. For example:

`head -c 16 /dev/urandom | od -An -t x | tr -d ' '`

will generate tokens that look like `02b50b05283e98dd0fd71db496ef01e8`

The token file should look like the following example, where the first three values can be anything and the quoted group
name should be as depicted:

```
02b50b05283e98dd0fd71db496ef01e8,kubelet-bootstrap,10001,"system:kubelet-bootstrap"
```

Add the `--token-auth-file=FILENAME` flag to the kube-apiserver command (in your systemd unit file perhaps) to enable the token file.
See docs [here](/docs/admin/authentication/#static-token-file) for further details.

-->

### Token 认证文件

Token 可以是任意的，但应该可以表示为从安全随机数生成器（例如大多数现代操作系统中的 /dev/urandom）导出的至少128位熵。生成 token 有很多中方式。例如：

`head -c 16 /dev/urandom | od -An -t x | tr -d ' '`

产生的 token 类似于这样： `02b50b05283e98dd0fd71db496ef01e8`。

Token 文件应该类似于以下示例，其中前三个值可以是任何值，引用的组名称应如下所示：

```
02b50b05283e98dd0fd71db496ef01e8,kubelet-bootstrap,10001,"system:kubelet-bootstrap"
```

在 kube-apiserver 命令中添加 `--token-auth-file=FILENAME` 标志（可能在您的 systemd unit 文件中）来启用 token 文件。

查看 [该文档](/docs/admin/authentication/#static-token-file) 获取更多详细信息。

<!--

### Client certificate CA bundle

Add the `--client-ca-file=FILENAME` flag to the kube-apiserver command to enable client certificate authentication,
referencing a certificate authority bundle containing the signing certificate (e.g. `--client-ca-file=/var/lib/kubernetes/ca.pem`).

-->

### 客户端证书 CA 包

在 kube-apiserver 命令中添加 `--client-ca-file=FILENAME` 标志启用客户端证书认证，指定包含签名证书的证书颁发机构包（例如 `--client-ca-file=/var/lib/kubernetes/ca.pem`）。

<!--

## kube-controller-manager configuration
The API for requesting certificates adds a certificate-issuing control loop to the Kubernetes Controller Manager. This takes the form of a
[cfssl](https://blog.cloudflare.com/introducing-cfssl/) local signer using assets on disk. Currently, all certificates issued have one year validity and a default set of key usages.

-->

### kube-controller-manager 配置

请求证书的 API 向 Kubernetes controller manager 中添加证书颁发控制循环。使用磁盘上的 [cfssl](https://blog.cloudflare.com/introducing-cfssl/) 本地签名文件的形式。目前，所有发行的证书均为一年有效期并具有一系列关键用途。

<!--

### Signing assets

You must provide a Certificate Authority in order to provide the cryptographic materials necessary to issue certificates.
This CA should be trusted by kube-apiserver for authentication with the `--client-ca-file=FILENAME` flag. The management
of the CA is beyond the scope of this document but it is recommended that you generate a dedicated CA for Kubernetes.
Both certificate and key are assumed to be PEM-encoded.

The kube-controller-manager flags are:

```
--cluster-signing-cert-file="/etc/path/to/kubernetes/ca/ca.crt" --cluster-signing-key-file="/etc/path/to/kubernetes/ca/ca.key"
```

-->

### 签名文件

您必须提供证书颁发机构，这样才能提供颁发证书所需的密码资料。

kube-apiserver 通过指定的 `--client-ca-file=FILENAME` 标志来认证和采信该 CA。CA 的管理超出了本文档的范围，但建议您为 Kubernetes 生成专用的 CA。

假定证书和密钥都是 PEM 编码的。

Kube-controller-manager 标志为：

```
--cluster-signing-cert-file="/etc/path/to/kubernetes/ca/ca.crt" --cluster-signing-key-file="/etc/path/to/kubernetes/ca/ca.key"
```

<!--

### Approval controller

In 1.7 the experimental "group auto approver" controller is dropped in favor of the new `csrapproving` controller
that ships as part of [kube-controller-manager](/docs/admin/kube-controller-manager/) and is enabled by default.
The controller uses the [`SubjectAccessReview` API](/docs/admin/authorization/#checking-api-access) to determine
if a given user is authorized to request a CSR, then approves based on the authorization outcome. To prevent
conflicts with other approvers, the builtin approver doesn't explicitly deny CSRs, only ignoring unauthorized requests.

The controller categorizes CSRs into three subresources:

1. `nodeclient` - a request by a user for a client certificate with `O=system:nodes` and `CN=system:node:(node name)`.
2. `selfnodeclient` - a node renewing a client certificate with the same `O` and `CN`.
3. `selfnodeserver` - a node renewing a serving certificate. (ALPHA, requires feature gate)

The checks to determine if a CSR is a `selfnodeserver` request is currently tied to the kubelet's credential rotation
implementation, an __alpha__ feature. As such, the definition of `selfnodeserver` will likely change in a future and
requires the `RotateKubeletServerCertificate` feature gate on the controller manager. The feature progress can be
tracked at [kubernetes/features#267](https://github.com/kubernetes/features/issues/267).

-->

### 审批控制器

在 kubernetes 1.7 版本中，实验性的 “组自动批准” 控制器被弃用，新的 `csrapproving` 控制器将作为 [kube-controller-manager](/docs/admin/kube-controller-manager/) 的一部分，被默认启用。

控制器使用 [`SubjectAccessReview` API](/docs/admin/authorization/#checking-api-access) 来确定给定用户是否已被授权允许请求 CSR，然后根据授权结果进行批准。为了防止与其他批准者冲突，内置审批者没有明确地拒绝 CSR，只是忽略未经授权的请求。

控制器将 CSR 分为三个子资源：

1. `nodeclient` ：用户的客户端认证请求 `O=system:nodes`， `CN=system:node:(node name)`。
2. `selfnodeclient`：更新具有相同 `O` 和 `CN` 的客户端证书的节点。
3. `selfnodeserver`：更新服务证书的节点（ALPHA，需要 feature gate）。

当前，确定 CSR 是否为 `selfnodeserver` 请求的检查与 kubelet 的凭据轮换实现（Alpha 功能）相关联。因此，`selfnodeserver` 的定义将来可能会改变，并且需要 Controller Manager 上的`RotateKubeletServerCertificate`  feature gate。该功能的进展可以在 [kubernetes/feature/#267](https://github.com/kubernetes/features/issues/267) 上追踪。

```
--feature-gates=RotateKubeletServerCertificate=true
```

<!--

The following RBAC `ClusterRoles` represent the `nodeclient`, `selfnodeclient`, and `selfnodeserver` capabilities. Similar roles
may be automatically created in future releases.

-->

以下 RBAC `ClusterRoles` 代表 `nodeClient`、`selfnodeclient` 和 `selfnodeserver` 功能。在以后的版本中可能会自动创建类似的角色。

```yml
# A ClusterRole which instructs the CSR approver to approve a user requesting
# node client credentials.
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: approve-node-client-csr
rules:
- apiGroups: ["certificates.k8s.io"]
  resources: ["certificatesigningrequests/nodeclient"]
  verbs: ["create"]
---
# A ClusterRole which instructs the CSR approver to approve a node renewing its
# own client credentials.
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: approve-node-client-renewal-csr
rules:
- apiGroups: ["certificates.k8s.io"]
  resources: ["certificatesigningrequests/selfnodeclient"]
  verbs: ["create"]
---
# A ClusterRole which instructs the CSR approver to approve a node requesting a
# serving cert matching its client cert.
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: approve-node-server-renewal-csr
rules:
- apiGroups: ["certificates.k8s.io"]
  resources: ["certificatesigningrequests/selfnodeserver"]
  verbs: ["create"]
```

<!--

These powers can be granted to credentials, such as bootstrapping tokens. For example, to replicate the behavior
provided by the removed auto-approval flag, of approving all CSRs by a single group:

-->

这些权力可以授予给凭证，如 bootstrap token。例如，要复制由已被移除的自动批准标志提供的行为，由单个组批准所有的 CSR：

```
# REMOVED: This flag no longer works as of 1.7.
--insecure-experimental-approve-all-kubelet-csrs-for-group="kubelet-bootstrap-token"
```

<!--

An admin would create a `ClusterRoleBinding` targeting that group.

-->

管理员将创建一个 `ClusterRoleBinding` 来定位该组。

```yml
# Approve all CSRs for the group "kubelet-bootstrap-token"
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: auto-approve-csrs-for-group
subjects:
- kind: Group
  name: kubelet-bootstrap-token
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: approve-node-client-csr
  apiGroup: rbac.authorization.k8s.io
```

<!--

To let a node renew its own credentials, an admin can construct a `ClusterRoleBinding` targeting
that node's credentials:

-->

要让节点更新自己的凭据，管理员可以构造一个 `ClusterRoleBinding` 来定位该节点的凭据。

```yml
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: node1-client-cert-renewal
subjects:
- kind: User
  name: system:node:node-1 # Let "node-1" renew its client certificate.
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: approve-node-client-renewal-csr
  apiGroup: rbac.authorization.k8s.io
```

<!--

Deleting the binding will prevent the node from renewing its client credentials, effectively
removing it from the cluster once its certificate expires.

-->

删除该绑定将会阻止节点更新客户端凭据，一旦其证书到期，实际上就会将其从集群中删除。

<!--

## kubelet configuration
To request a client certificate from kube-apiserver, the kubelet first needs a path to a kubeconfig file that contains the
bootstrap authentication token. You can use `kubectl config set-cluster`, `set-credentials`, and `set-context` to build this kubeconfig. Provide the name `kubelet-bootstrap` to `kubectl config set-credentials` and include `--token=<token-value>` as follows:

```
kubectl config set-credentials kubelet-bootstrap --token=${BOOTSTRAP_TOKEN} --kubeconfig=bootstrap.kubeconfig
```

When starting the kubelet, if the file specified by `--kubeconfig` does not exist, the bootstrap kubeconfig is used to request a client certificate from the API server. On approval of the certificate request and receipt back by the kubelet, a kubeconfig file referencing the generated key and obtained certificate is written to the path specified by `--kubeconfig`. The certificate and key file will be placed in the directory specified by `--cert-dir`.

The flag to enable this bootstrapping when starting the kubelet is:

```
--experimental-bootstrap-kubeconfig="/path/to/bootstrap/kubeconfig"
```

Additionally, in 1.7 the kubelet implements __alpha__ features for enabling rotation of both its client and/or serving certs.
These can be enabled through the respective `RotateKubeletClientCertificate` and `RotateKubeletServerCertificate` feature
flags on the kubelet, but may change in backward incompatible ways in future releases.

```
--feature-gates=RotateKubeletClientCertificate=true,RotateKubeletServerCertificate=true
```

`RotateKubeletClientCertificate` causes the kubelet to rotate its client certificates by creating new CSRs as its existing
credentials expire. `RotateKubeletServerCertificate` causes the kubelet to both request a serving certificate after
bootstrapping its client credentials and rotate the certificate. The serving cert currently does not request DNS or IP
SANs.

-->

## kubelet 配置

要向 kube-apiserver 请求客户端证书，kubelet 首先需要一个包含 bootstrap 身份验证 token 的 kubeconfig 文件路径。您可以使用 `kubectl config set-cluster`，`set-credentials` 和 `set-context` 来构建此 kubeconfig 文件。为 `kubectl config set-credentials` 提供 `kubelet-bootstrap` 的名称，并包含 `--token = <token-value>`，如下所示：

```
kubectl config set-credentials kubelet-bootstrap --token=${BOOTSTRAP_TOKEN} --kubeconfig=bootstrap.kubeconfig
```

启动 kubelet 时，如果 `--kubeconfig` 指定的文件不存在，则使用 bootstrap kubeconfig 向 API server 请求客户端证书。在批准 `kubelet` 的证书请求和回执时，将包含了生成的密钥和证书的 kubeconfig 文件写入由 `-kubeconfig` 指定的路径。证书和密钥文件将被放置在由 `--cert-dir` 指定的目录中。

启动 kubelet 时启用 bootstrap 用到的标志：

```
--experimental-bootstrap-kubeconfig="/path/to/bootstrap/kubeconfig"
```

此外，在1.7中，kubelet 实现了 **Alpha** 功能，使其客户端和/或服务器都能轮转提供证书。

可以分别通过 kubelet 中的 `RotateKubeletClientCertificate` 和 `RotateKubeletServerCertificate` 功能标志启用此功能，但在未来版本中可能会以向后兼容的方式发生变化。

```
--feature-gates=RotateKubeletClientCertificate=true,RotateKubeletServerCertificate=true
```

`RotateKubeletClientCertificate` 可以让 kubelet 在其现有凭据到期时通过创建新的 CSR 来轮换其客户端证书。 `RotateKubeletServerCertificate` 可以让 kubelet 在其引导客户端凭据后还可以请求服务证书，并轮换该证书。服务证书目前不要求 DNS 或 IP SANs。

<!--

## kubectl approval
The signing controller does not immediately sign all certificate requests. Instead, it waits until they have been flagged with an
"Approved" status by an appropriately-privileged user. This is intended to eventually be an automated process handled by an external
approval controller, but for the alpha version of the API it can be done manually by a cluster administrator using kubectl.
An administrator can list CSRs with `kubectl get csr` and describe one in detail with `kubectl describe csr <name>`. Before the 1.6 release there were
[no direct approve/deny commands](https://github.com/kubernetes/kubernetes/issues/30163) so an approver had to update
the Status field directly ([rough how-to](https://github.com/gtank/csrctl)). Later versions of Kubernetes offer `kubectl certificate approve <name>` and `kubectl certificate deny <name>` commands.

-->

## kubectl 审批

签名控制器不会立即签署所有证书请求。相反，它会一直等待直到适当特权的用户被标记为 “已批准” 状态。这最终将是由外部审批控制器来处理的自动化过程，但是对于 alpha 版本的 API 来说，可以由集群管理员通过 kubectl 命令手动完成。

管理员可以使用 `kubectl get csr` 命令列出所有的 CSR，使用 `kubectl describe csr <name>` 命令描述某个 CSR的详细信息。在 1.6 版本以前，[没有直接的批准/拒绝命令](https://github.com/kubernetes/kubernetes/issues/30163) ，因此审批者需要直接更新 Status 信息（[查看如何实现](https://github.com/gtank/csrctl)）。此后的 Kubernetes 版本中提供了 `kubectl certificate approve <name>` 和 `kubectl certificate deny <name>` 命令。
