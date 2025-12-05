---
title: 使用 CertificateSigningRequest 爲 Kubernetes API 客戶端頒發證書 
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
weight: 80

# 文檔維護說明
#
# 如果將來新增頁面 /docs/tasks/tls/certificate-issue-client-manually/
# 那麼需要在此頁面添加新的交叉引用鏈接，而新增的頁面也應鏈接回此頁面
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
Kubernetes 允許你使用公鑰基礎設施 (PKI) 對你的叢集進行身份認證，這類似於對客戶端進行身份認證。

爲了能夠對普通使用者進行身份認證並調用 API，需要執行幾個步驟。首先，此使用者必須擁有由你的
Kubernetes 叢集所信任的權威機構頒發的 [X.509](https://www.itu.int/rec/T-REC-X.509)
證書。之後客戶端必須向 Kubernetes API 提交該證書。

<!--
You use a [CertificateSigningRequest](/concepts/security/certificate-signing-requests/)
as part of this process, and either you or some other principal must approve the request.

You will create a private key, and then get a certificate issued, and finally configure
that private key for a client.
-->
在這個過程中，你需要使用
[CertificateSigningRequest](/zh-cn/concepts/security/certificate-signing-requests/)，並且你或其他主體必須批准此請求。

你將創建私鑰，然後獲取頒發的證書，最後爲客戶端設定該私鑰。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!--
* You need the `kubectl`, `openssl` and `base64` utilities.

This page assumes you are using Kubernetes {{< glossary_tooltip term_id="rbac" text="role based access control" >}} (RBAC).
If you have alternative or additional security mechanisms around authorization, you need to account for those as well.
-->
* 你需要 `kubectl`、`openssl` 和 `base64` 等工具。

此頁面假設你使用的是 Kubernetes {{< glossary_tooltip term_id="rbac" text="基於角色的訪問控制" >}} (RBAC)。
如果你在鑑權方面有替代的或額外的安全機制，也需要將其考慮在內。

<!-- steps -->

<!--
## Create private key

In this step, you create a private key. You need to keep this document secret; anyone who has it can impersonate the user.

```shell
# Create a private key
openssl genrsa -out myuser.key 3072
```
-->
## 創建私鑰   {#create-private-key}

在這一步中，你將創建一個私鑰。你將此檔案作爲祕密保管起來，因爲任何擁有該私鑰的人都可以僞裝成對應的使用者。

```shell
# 創建一個私鑰
openssl genrsa -out myuser.key 3072
```

<!--
## Create an X.509 certificate signing request {#create-x.509-certificatessigningrequest}
-->
## 創建 X.509 證書籤名請求   {#create-x.509-certificatessigningrequest}

{{< note >}}
<!--
This is not the same as the similarly-named CertificateSigningRequest API; the file you generate here goes into the
CertificateSigningRequest.
-->
這與類似名稱的 CertificateSigningRequest API 不同；
你在此處生成的檔案將被放入 CertificateSigningRequest 對象中。
{{< /note >}}

<!--
It is important to set CN and O attribute of the CSR. CN is the name of the user and O is the group that this user will belong to.
You can refer to [RBAC](/docs/reference/access-authn-authz/rbac/) for standard groups.

```shell
# Change the common name "myuser" to the actual username that you want to use
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```
-->
設置 CSR 的 CN 和 O 屬性非常重要。CN 是使用者的名稱，O 是此使用者所屬的羣組。
你可以參閱 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 瞭解標準的羣組。

```shell
# 將通用名稱 "myuser" 更改爲你要使用的實際用戶名
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```

<!--
## Create a Kubernetes CertificateSigningRequest {#create-k8s-certificatessigningrequest}

Encode the CSR document using this command:
-->
## 創建 Kubernetes CertificateSigningRequest   {#create-k8s-certificatessigningrequest}

使用以下命令對 CSR 文檔進行編碼：

```shell
cat myuser.csr | base64 | tr -d "\n"
```

<!--
Create a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
and submit it to a Kubernetes Cluster via kubectl. Below is a snippet of shell that you can use to generate the
CertificateSigningRequest.
-->
創建 [CertificateSigningRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
並通過 kubectl 將其提交到 Kubernetes 叢集。以下是你可以用於生成 CertificateSigningRequest 的 Shell 片段。

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
  # 這是已編碼的 CSR。將此更改爲 myuser.csr 的經 base64 編碼的內容
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
一些注意點：

- `usages` 必須是 `client auth`
- `expirationSeconds` 可以設置得更長（例如 `864000` 表示十天）或更短（例如 `3600` 表示一小時）。
  你所請求的時長不能短於 10 分鐘。
- `request` 值是 CSR 檔案內容的 base64 編碼值。

<!--
## Approve the CertificateSigningRequest {#approve-certificate-signing-request}

Use kubectl to find the CSR you made, and manually approve it.

Get the list of CSRs:
-->
## 批准 CertificateSigningRequest   {#approve-certificate-signing-request}

使用 kubectl 找到你創建的 CSR，並手動批准它。

獲取 CSR 列表：

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
## 獲取證書   {#get-the-certificate}

從 CSR 中檢索證書，以檢查其是否正常。

```shell
kubectl get csr/myuser -o yaml
```

<!--
The certificate value is in Base64-encoded format under `.status.certificate`.

Export the issued certificate from the CertificateSigningRequest.
-->
證書值以 Base64 編碼格式顯示在 `.status.certificate` 下。

從 CertificateSigningRequest 導出已頒發的證書。

```shell
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

<!--
## Configure the certificate into kubeconfig

The next step is to add this user into the kubeconfig file.

First, you need to add new credentials:
-->
## 將證書設定到 kubeconfig 中   {#configure-the-certificate-into-kubeconfig}

下一步是將此使用者添加到 kubeconfig 檔案中。

首先，你需要添加新的憑證：

```shell
kubectl config set-credentials myuser --client-key=myuser.key --client-certificate=myuser.crt --embed-certs=true
```

<!--
Then, you need to add the context:
-->
然後，你需要添加上下文：

```shell
kubectl config set-context myuser --cluster=kubernetes --user=myuser
```

<!--
To test it:
-->
對其執行測試：

```shell
kubectl --context myuser auth whoami
```

<!--
You should see output confirming that you are “myuser“.

## Create Role and RoleBinding
-->
你應該看到確認你是 “myuser” 的輸出。

## 創建 Role 和 RoleBinding   {#create-role-and-rolebinding}

{{< note >}}
<!--
If you don't use Kubernetes RBAC, skip this step and make the appropriate changes for the authorization mechanism
your cluster actually uses.
-->
如果你不使用 Kubernetes RBAC，請跳過這一步，並對叢集實際使用的鑑權機制進行適當更改。
{{< /note >}}

<!--
With the certificate created it is time to define the Role and RoleBinding for
this user to access Kubernetes cluster resources.

This is a sample command to create a Role for this new user:
-->
創建證書之後，就可以爲此使用者定義 Role 和 RoleBinding，以訪問 Kubernetes 叢集資源。

這是爲新使用者創建 Role 的示例命令：

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

<!--
This is a sample command to create a RoleBinding for this new user:
-->
這是爲新使用者創建 RoleBinding 的示例命令：

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
* 閱讀[管理叢集中的 TLS 證書](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/)
* 有關 X.509 本身的細節，參閱 [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) 第 3.1 節
* 有關 PKCS#10 證書籤名請求的語法資訊，請參閱 [RFC 2986](https://tools.ietf.org/html/rfc2986)
* 參閱 [ClusterTrustBundles](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
