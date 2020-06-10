---
title: 管理集群中的 TLS 认证
content_type: task
reviewers:
- mikedanese
- beacham
- liggit
---
<!--
---
title: Manage TLS Certificates in a Cluster
content_type: task
reviewers:
- mikedanese
- beacham
- liggit
---
-->

<!-- overview -->
<!--

Kubernetes provides a `certificates.k8s.io` API, which lets you provision TLS
certificates signed by a Certificate Authority (CA) that you control. These CA
and certificates can be used by your workloads to establish trust.

`certificates.k8s.io` API uses a protocol that is similar to the [ACME
draft](https://github.com/ietf-wg-acme/acme/).
-->

Kubernetes提供一个 `certificates.k8s.io` API，可让您配置
由您控制的证书颁发机构（CA）签名的TLS证书。 您的工作负载可以使用这些CA和证书来建立信任。

`certificates.k8s.io` API使用的协议类似于[ACME
草稿](https://github.com/ietf-wg-acme/acme/)。

{{< note >}}
<!--
Certificates created using the `certificates.k8s.io` API are signed by a
dedicated CA. It is possible to configure your cluster to use the cluster root
CA for this purpose, but you should never rely on this. Do not assume that
these certificates will validate against the cluster root CA.
-->

使用`certificates.k8s.io` API创建的证书由
指定 CA 颁发。 将集群配置为使用集群根目录
CA 可以达到这个目的，但是您永远不要依赖它。不要以为
这些证书将针对群根目录 CA 进行验证。
{{< /note >}}




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

<!--
## Trusting TLS in a Cluster


Trusting the cluster root CA from an application running as a pod usually
requires some extra application configuration. You will need to add the CA
certificate bundle to the list of CA certificates that the TLS client or server
trusts. For example, you would do this with a golang TLS config by parsing the
certificate chain and adding the parsed certificates to the `RootCAs` field
in the [`tls.Config`](https://godoc.org/crypto/tls#Config) struct.

The CA certificate bundle is automatically mounted into pods using the default
service account at the path `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`.
If you are not using the default service account, ask a cluster administrator to
build a configmap containing the certificate bundle that you have access to use.
-->
## 集群中的 TLS 信任

让 Pod 中运行的应用程序信任集群根 CA 通常需要一些额外的应用程序配置。您将需要将 CA 证书包添加到 TLS 客户端或服务器信任的 CA 证书列表中。例如，您可以使用 golang TLS 配置通过解析证书链并将解析的证书添加到 [`tls.Config`](https://godoc.org/crypto/tls#Config) 结构中的 `RootCAs` 字段中。

CA 证书捆绑包将使用默认服务账户自动加载到 pod 中，路径为 `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`。如果您没有使用默认服务账户，请请求集群管理员构建包含您有权访问使用的证书包的 configmap。

<!--
## Requesting a Certificate

The following section demonstrates how to create a TLS certificate for a
Kubernetes service accessed through DNS.

{{< note >}}
This tutorial uses CFSSL: Cloudflare's PKI and TLS toolkit [click here](https://blog.cloudflare.com/introducing-cfssl/) to know more.
{{< /note >}}
-->
## 请求认证

以下部分演示如何为通过 DNS 访问的 Kubernetes 服务创建 TLS 证书。

{{< note >}}
本教程使用 CFSSL：Cloudflare's PKI 和 TLS 工具包[点击此处](https://blog.cloudflare.com/introducing-cfssl/)了解更多信息。
{{< /note >}}

<!--
## Download and install CFSSL

The cfssl tools used in this example can be downloaded at
[https://pkg.cfssl.org/](https://pkg.cfssl.org/).
-->
## 下载并安装 CFSSL

本例中使用的 cfssl 工具可以在 [https://pkg.cfssl.org/](https://pkg.cfssl.org/) 下载。

<!--
## Create a Certificate Signing Request

Generate a private key and certificate signing request (or CSR) by running
the following command:

```shell
cat <<EOF | cfssl genkey - | cfssljson -bare server
{
  "hosts": [
    "my-svc.my-namespace.svc.cluster.local",
    "my-pod.my-namespace.pod.cluster.local",
    "172.168.0.24",
    "10.0.34.2"
  ],
  "CN": "my-pod.my-namespace.pod.cluster.local",
  "key": {
    "algo": "ecdsa",
    "size": 256
  }
}
EOF
```

Where `172.168.0.24` is the service's cluster IP,
`my-svc.my-namespace.svc.cluster.local` is the service's DNS name,
`10.0.34.2` is the pod's IP and `my-pod.my-namespace.pod.cluster.local`
is the pod's DNS name. You should see the following output:

```
2017/03/21 06:48:17 [INFO] generate received request
2017/03/21 06:48:17 [INFO] received CSR
2017/03/21 06:48:17 [INFO] generating key: ecdsa-256
2017/03/21 06:48:17 [INFO] encoded CSR
```

This command generates two files; it generates `server.csr` containing the PEM
encoded [pkcs#10](https://tools.ietf.org/html/rfc2986) certification request,
and `server-key.pem` containing the PEM encoded key to the certificate that
is still to be created.
-->
## 创建证书签名请求

通过运行以下命令生成私钥和证书签名请求（或 CSR）:

```shell
cat <<EOF | cfssl genkey - | cfssljson -bare server
{
  "hosts": [
    "my-svc.my-namespace.svc.cluster.local",
    "my-pod.my-namespace.pod.cluster.local",
    "172.168.0.24",
    "10.0.34.2"
  ],
  "CN": "my-pod.my-namespace.pod.cluster.local",
  "key": {
    "algo": "ecdsa",
    "size": 256
  }
}
EOF
```

其中 `172.168.0.24` 是服务的集群 IP，`my-svc.my-namespace.svc.cluster.local` 是服务的 DNS 名称，`10.0.34.2` 是 pod 的 IP 和 `my-pod.my-namespace.pod.cluster.local` 是 pod 的 DNS 名称。您能看到以下的输出：

```
2017/03/21 06:48:17 [INFO] generate received request
2017/03/21 06:48:17 [INFO] received CSR
2017/03/21 06:48:17 [INFO] generating key: ecdsa-256
2017/03/21 06:48:17 [INFO] encoded CSR
```

该命令生成两个文件；它生成包含 PEM 编码 [pkcs#10](https://tools.ietf.org/html/rfc2986) 认证请求的 `server.csr`，以及包含证书的 PEM 编码密钥的 `server-key.pem` 还有待生成。

<!--
## Create a Certificate Signing Request object to send to the Kubernetes API

Generate a CSR yaml blob and send it to the apiserver by running the following
command:

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1beta1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  groups:
  - system:authenticated
  request: $(cat server.csr | base64 | tr -d '\n')
  usages:
  - digital signature
  - key encipherment
  - server auth
EOF
```

Notice that the `server.csr` file created in step 1 is base64 encoded
and stashed in the `.spec.request` field. We are also requesting a
certificate with the "digital signature", "key encipherment", and "server
auth" key usages. We support all key usages and extended key usages listed
[here](https://godoc.org/k8s.io/api/certificates/v1beta1#KeyUsage)
so you can request client certificates and other certificates using this
same API.

The CSR should now be visible from the API in a Pending state. You can see
it by running:

```shell
kubectl describe csr my-svc.my-namespace
```

```none
Name:                   my-svc.my-namespace
Labels:                 <none>
Annotations:            <none>
CreationTimestamp:      Tue, 21 Mar 2017 07:03:51 -0700
Requesting User:        yourname@example.com
Status:                 Pending
Subject:
        Common Name:    my-svc.my-namespace.svc.cluster.local
        Serial Number:
Subject Alternative Names:
        DNS Names:      my-svc.my-namespace.svc.cluster.local
        IP Addresses:   172.168.0.24
                        10.0.34.2
Events: <none>
```
-->
## 创建证书签名请求对象发送到 Kubernetes API

使用以下命令创建 CSR yaml 文件，并发送到 API server：

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1beta1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  groups:
  - system:authenticated
  request: $(cat server.csr | base64 | tr -d '\n')
  usages:
  - digital signature
  - key encipherment
  - server auth
EOF
```

请注意，在步骤1中创建的 `server.csr` 文件是 base64 编码并存储在 `.spec.request` 字段中的，我们还要求提供 “数字签名”，“密钥加密” 和 “服务器身份验证” 密钥用途的证书。我们[这里](https://godoc.org/k8s.io/api/certificates/v1beta1#KeyUsage)支持列出的所有关键用途和扩展的关键用途，以便您可以使用相同的 API 请求客户端证书和其他证书。

在 API server 中可以看到这些 CSR 处于 pending 状态。执行下面的命令您将可以看到：

```shell
kubectl describe csr my-svc.my-namespace
```

```none
Name:                   my-svc.my-namespace
Labels:                 <none>
Annotations:            <none>
CreationTimestamp:      Tue, 21 Mar 2017 07:03:51 -0700
Requesting User:        yourname@example.com
Status:                 Pending
Subject:
        Common Name:    my-svc.my-namespace.svc.cluster.local
        Serial Number:
Subject Alternative Names:
        DNS Names:      my-svc.my-namespace.svc.cluster.local
        IP Addresses:   172.168.0.24
                        10.0.34.2
Events: <none>
```

<!--
## Get the Certificate Signing Request Approved

Approving the certificate signing request is either done by an automated
approval process or on a one off basis by a cluster administrator. More
information on what this involves is covered below.
-->
## 获取批准的证书签名请求

批准证书签名请求是通过自动批准过程完成的，或由集群管理员一次性完成。有关这方面涉及的更多信息，请参见下文。

<!--
## Download the Certificate and Use It

Once the CSR is signed and approved you should see the following:

```shell
kubectl get csr
```

```none
NAME                  AGE       REQUESTOR               CONDITION
my-svc.my-namespace   10m       yourname@example.com    Approved,Issued
```

You can download the issued certificate and save it to a `server.crt` file
by running the following:

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

Now you can use `server.crt` and `server-key.pem` as the keypair to start
your HTTPS server.
-->
## 下载证书并使用它

CSR 被签署并获得批准后，您应该看到以下内容：

```shell
kubectl get csr
```

```none
NAME                  AGE       REQUESTOR               CONDITION
my-svc.my-namespace   10m       yourname@example.com    Approved,Issued
```

您可以通过运行以下命令下载颁发的证书并将其保存到 `server.crt` 文件中：

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

现在您可以将 `server.crt` 和 `server-key.pem` 作为键值对来启动 HTTPS 服务器。

<!--
## Approving Certificate Signing Requests

A Kubernetes administrator (with appropriate permissions) can manually approve
(or deny) Certificate Signing Requests by using the `kubectl certificate
approve` and `kubectl certificate deny` commands. However if you intend
to make heavy usage of this API, you might consider writing an automated
certificates controller.

Whether a machine or a human using kubectl as above, the role of the approver is
to verify that the CSR satisfies two requirements:

1. The subject of the CSR controls the private key used to sign the CSR. This
   addresses the threat of a third party masquerading as an authorized subject.
   In the above example, this step would be to verify that the pod controls the
   private key used to generate the CSR.
2. The subject of the CSR is authorized to act in the requested context. This
   addresses the threat of an undesired subject joining the cluster. In the
   above example, this step would be to verify that the pod is allowed to
   participate in the requested service.

If and only if these two requirements are met, the approver should approve
the CSR and otherwise should deny the CSR.
-->
## 批准证书签名请求

Kubernetes 管理员（具有适当权限）可以使用 `kubectl certificate approve` 和 `kubectl certificate deny` 命令手动批准（或拒绝）证书签名请求。但是，如果您打算大量使用此 API，则可以考虑编写自动化的证书控制器。

无论上述机器或人使用 kubectl，批准者的作用是验证 CSR 满足如下两个要求：

 1. CSR 的主体控制用于签署 CSR 的私钥。这解决了伪装成授权主体的第三方的威胁。在上述示例中，此步骤将验证该 pod 控制了用于生成 CSR 的私钥。
 2. CSR 的主体被授权在请求的上下文中执行。这解决了我们加入群集的我们不期望的主体的威胁。在上述示例中，此步骤将是验证该 pod 是否被允许加入到所请求的服务中。

当且仅当满足这两个要求时，审批者应该批准 CSR，否则拒绝 CSR。

<!--
## A Word of Warning on the Approval Permission


The ability to approve CSRs decides who trusts who within the cluster. This
includes who the Kubernetes API trusts. The ability to approve CSRs should
not be granted broadly or lightly. The requirements of the challenge
noted in the previous section and the repercussions of issuing a specific
certificate should be fully understood before granting this permission. See
[here](/docs/reference/access-authn-authz/authentication/#x509-client-certs) for information on how
certificates interact with authentication.
-->
## 关于批准许可的警告

批准 CSR 的能力决定谁信任群集中的谁。这包括 Kubernetes API 信任的人。批准 CSR 的能力不能过于广泛和轻率。在给予本许可之前，应充分了解上一节中提到的挑战和发布特定证书的后果。有关证书与认证交互的信息，请参阅[此处](/docs/reference/access-authn-authz/authentication/#x509-client-certs)。


<!--
## A Note to Cluster Administrators

This tutorial assumes that a signer is setup to serve the certificates API. The
Kubernetes controller manager provides a default implementation of a signer. To
enable it, pass the `--cluster-signing-cert-file` and
`--cluster-signing-key-file` parameters to the controller manager with paths to
your Certificate Authority's keypair.

-->
## 给集群管理员的一个建议

本教程假设将签名者设置为服务证书 API。Kubernetes controller manager 提供了一个签名者的默认实现。 要启用它，请将`--cluster-signing-cert-file` 和 `--cluster-signing-key-file` 参数传递给 controller manager，并配置具有证书颁发机构的密钥对的路径。


