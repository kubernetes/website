---
title: 使用 CertificateSigningRequest 为 Kubernetes API 客户端颁发证书 
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
weight: 80

# 文档维护说明
#
# 如果将来新增页面 /docs/tasks/tls/certificate-issue-client-manually/
# 那么需要在此页面添加新的交叉引用链接，而新增的页面也应链接回此页面
---
<!--
title: Issue a Certificate for a Kubernetes API Client Using A CertificateSigningRequest
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
weight: 80

# Docs maintenance note
#
# If there is a future page /docs/tasks/tls/certificate-issue-client-manually/ then this page
# should link there, and the new page should link back to this one.
-->

<!-- overview -->

<!--
Kubernetes lets you use a public key infrastructure (PKI) to authenticate to your cluster
as a client.

A few steps are required in order to get a normal user to be able to
authenticate and invoke an API. First, this user must have an [X.509](https://www.itu.int/rec/T-REC-X.509) certificate
issued by an authority that your Kubernetes cluster trusts. The client must then present that certificate to the Kubernetes API.
-->
Kubernetes 允许你使用公钥基础设施 (PKI) 对你的集群进行身份认证，这类似于对客户端进行身份认证。

为了能够对普通用户进行身份认证并调用 API，需要执行几个步骤。首先，此用户必须拥有由你的
Kubernetes 集群所信任的权威机构颁发的 [X.509](https://www.itu.int/rec/T-REC-X.509)
证书。之后客户端必须向 Kubernetes API 提交该证书。

<!--
You use a [CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/)
as part of this process, and either you or some other principal must approve the request.

You will create a private key, and then get a certificate issued, and finally configure
that private key for a client.
-->
在这个过程中，你需要使用
[CertificateSigningRequest](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)，并且你或其他主体必须批准此请求。

你将创建私钥，然后获取颁发的证书，最后为客户端配置该私钥。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!--
* You need the `kubectl`, `openssl` and `base64` utilities.

This page assumes you are using Kubernetes {{< glossary_tooltip term_id="rbac" text="role based access control" >}} (RBAC).
If you have alternative or additional security mechanisms around authorization, you need to account for those as well.
-->
* 你需要 `kubectl`、`openssl` 和 `base64` 等工具。

此页面假设你使用的是 Kubernetes {{< glossary_tooltip term_id="rbac" text="基于角色的访问控制" >}} (RBAC)。
如果你在鉴权方面有替代的或额外的安全机制，也需要将其考虑在内。

<!-- steps -->

<!--
## Create private key

In this step, you create a private key. You need to keep this document secret; anyone who has it can impersonate the user.

```shell
# Create a private key
openssl genrsa -out myuser.key 3072
```
-->
## 创建私钥   {#create-private-key}

在这一步中，你将创建一个私钥。你将此文件作为秘密保管起来，因为任何拥有该私钥的人都可以伪装成对应的用户。

```shell
# 创建一个私钥
openssl genrsa -out myuser.key 3072
```

<!--
## Create an X.509 certificate signing request {#create-x.509-certificatessigningrequest}
-->
## 创建 X.509 证书签名请求   {#create-x.509-certificatessigningrequest}

{{< note >}}
<!--
This is not the same as the similarly-named CertificateSigningRequest API; the file you generate here goes into the
CertificateSigningRequest.
-->
这与类似名称的 CertificateSigningRequest API 不同；
你在此处生成的文件将被放入 CertificateSigningRequest 对象中。
{{< /note >}}

<!--
It is important to set CN and O attribute of the CSR. CN is the name of the user and O is the group that this user will belong to.
You can refer to [RBAC](/docs/reference/access-authn-authz/rbac/) for standard groups.

```shell
# Change the common name "myuser" to the actual username that you want to use
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```
-->
设置 CSR 的 CN 和 O 属性非常重要。CN 是用户的名称，O 是此用户所属的群组。
你可以参阅 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 了解标准的群组。

```shell
# 将通用名称 "myuser" 更改为你要使用的实际用户名
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```

<!--
## Create a Kubernetes CertificateSigningRequest {#create-k8s-certificatessigningrequest}

Encode the CSR document using this command:
-->
## 创建 Kubernetes CertificateSigningRequest   {#create-k8s-certificatessigningrequest}

使用以下命令对 CSR 文档进行编码：

```shell
cat myuser.csr | base64 | tr -d "\n"
```

<!--
Create a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
and submit it to a Kubernetes Cluster via kubectl. Below is a snippet of shell that you can use to generate the
CertificateSigningRequest.
-->
创建 [CertificateSigningRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
并通过 kubectl 将其提交到 Kubernetes 集群。以下是你可以用于生成 CertificateSigningRequest 的 Shell 片段。

<!--
# example
# This is an encoded CSR. Change this to the base64-encoded contents of myuser.csr
# one day
-->
```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: myuser # 示例
spec:
  # 这是已编码的 CSR。将此更改为 myuser.csr 的经 base64 编码的内容
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ1ZqQ0NBVDRDQVFBd0VURVBNQTBHQTFVRUF3d0dZVzVuWld4aE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQTByczhJTHRHdTYxakx2dHhWTTJSVlRWMDNHWlJTWWw0dWluVWo4RElaWjBOCnR2MUZtRVFSd3VoaUZsOFEzcWl0Qm0wMUFSMkNJVXBGd2ZzSjZ4MXF3ckJzVkhZbGlBNVhwRVpZM3ExcGswSDQKM3Z3aGJlK1o2MVNrVHF5SVBYUUwrTWM5T1Nsbm0xb0R2N0NtSkZNMUlMRVI3QTVGZnZKOEdFRjJ6dHBoaUlFMwpub1dtdHNZb3JuT2wzc2lHQ2ZGZzR4Zmd4eW8ybmlneFNVekl1bXNnVm9PM2ttT0x1RVF6cXpkakJ3TFJXbWlECklmMXBMWnoyalVnald4UkhCM1gyWnVVV1d1T09PZnpXM01LaE8ybHEvZi9DdS8wYk83c0x0MCt3U2ZMSU91TFcKcW90blZtRmxMMytqTy82WDNDKzBERHk5aUtwbXJjVDBnWGZLemE1dHJRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBR05WdmVIOGR4ZzNvK21VeVRkbmFjVmQ1N24zSkExdnZEU1JWREkyQTZ1eXN3ZFp1L1BVCkkwZXpZWFV0RVNnSk1IRmQycVVNMjNuNVJsSXJ3R0xuUXFISUh5VStWWHhsdnZsRnpNOVpEWllSTmU3QlJvYXgKQVlEdUI5STZXT3FYbkFvczFqRmxNUG5NbFpqdU5kSGxpT1BjTU1oNndLaTZzZFhpVStHYTJ2RUVLY01jSVUyRgpvU2djUWdMYTk0aEpacGk3ZnNMdm1OQUxoT045UHdNMGM1dVJVejV4T0dGMUtCbWRSeEgvbUNOS2JKYjFRQm1HCkkwYitEUEdaTktXTU0xMzhIQXdoV0tkNjVoVHdYOWl4V3ZHMkh4TG1WQzg0L1BHT0tWQW9FNkpsYWFHdTlQVmkKdjlOSjVaZlZrcXdCd0hKbzZXdk9xVlA3SVFjZmg3d0drWm89Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 86400  # 一天
  usages:
  - client auth
EOF
```

<!--
Some points to note:

- `usages` has to be `client auth`
- `expirationSeconds` could be made longer (i.e. `864000` for ten days) or shorter (i.e. `3600` for one hour).
  You cannot request a duration shorter than 10 minutes.
- `request` is the base64 encoded value of the CSR file content.
-->
一些注意点：

- `usages` 必须是 `client auth`
- `expirationSeconds` 可以设置得更长（例如 `864000` 表示十天）或更短（例如 `3600` 表示一小时）。
  你所请求的时长不能短于 10 分钟。
- `request` 值是 CSR 文件内容的 base64 编码值。

<!--
## Approve the CertificateSigningRequest {#approve-certificate-signing-request}

Use kubectl to find the CSR you made, and manually approve it.

Get the list of CSRs:
-->
## 批准 CertificateSigningRequest   {#approve-certificate-signing-request}

使用 kubectl 找到你创建的 CSR，并手动批准它。

获取 CSR 列表：

```shell
kubectl get csr
```

<!--
Approve the CSR:
-->
批准 CSR：

```shell
kubectl certificate approve myuser
```

<!--
## Get the certificate

Retrieve the certificate from the CSR, to check it looks OK.
-->
## 获取证书   {#get-the-certificate}

从 CSR 中检索证书，以检查其是否正常。

```shell
kubectl get csr/myuser -o yaml
```

<!--
The certificate value is in Base64-encoded format under `.status.certificate`.

Export the issued certificate from the CertificateSigningRequest.
-->
证书值以 Base64 编码格式显示在 `.status.certificate` 下。

从 CertificateSigningRequest 导出已颁发的证书。

```shell
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

<!--
## Configure the certificate into kubeconfig

The next step is to add this user into the kubeconfig file.

First, you need to add new credentials:
-->
## 将证书配置到 kubeconfig 中   {#configure-the-certificate-into-kubeconfig}

下一步是将此用户添加到 kubeconfig 文件中。

首先，你需要添加新的凭证：

```shell
kubectl config set-credentials myuser --client-key=myuser.key --client-certificate=myuser.crt --embed-certs=true
```

<!--
Then, you need to add the context:
-->
然后，你需要添加上下文：

```shell
kubectl config set-context myuser --cluster=kubernetes --user=myuser
```

<!--
To test it:
-->
对其执行测试：

```shell
kubectl --context myuser auth whoami
```

<!--
You should see output confirming that you are “myuser“.

## Create Role and RoleBinding
-->
你应该看到确认你是 “myuser” 的输出。

## 创建 Role 和 RoleBinding   {#create-role-and-rolebinding}

{{< note >}}
<!--
If you don't use Kubernetes RBAC, skip this step and make the appropriate changes for the authorization mechanism
your cluster actually uses.
-->
如果你不使用 Kubernetes RBAC，请跳过这一步，并对集群实际使用的鉴权机制进行适当更改。
{{< /note >}}

<!--
With the certificate created it is time to define the Role and RoleBinding for
this user to access Kubernetes cluster resources.

This is a sample command to create a Role for this new user:
-->
创建证书之后，就可以为此用户定义 Role 和 RoleBinding，以访问 Kubernetes 集群资源。

这是为新用户创建 Role 的示例命令：

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

<!--
This is a sample command to create a RoleBinding for this new user:
-->
这是为新用户创建 RoleBinding 的示例命令：

```shell
kubectl create rolebinding developer-binding-myuser --role=developer --user=myuser
```

## {{% heading "whatsnext" %}}

<!--
* Read [Manage TLS Certificates in a Cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
* For details of X.509 itself, refer to [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) section 3.1
* For information on the syntax of PKCS#10 certificate signing requests, refer to [RFC 2986](https://tools.ietf.org/html/rfc2986)
* Read about [ClusterTrustBundles](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
-->
* 阅读[管理集群中的 TLS 证书](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/)
* 有关 X.509 本身的细节，参阅 [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) 第 3.1 节
* 有关 PKCS#10 证书签名请求的语法信息，请参阅 [RFC 2986](https://tools.ietf.org/html/rfc2986)
* 参阅 [ClusterTrustBundles](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
