---
title: 管理集羣中的 TLS 認證
content_type: task
---
<!--
title: Manage TLS Certificates in a Cluster
content_type: task
reviewers:
- mikedanese
- beacham
- liggit
-->

<!-- overview -->
<!--
Kubernetes provides a `certificates.k8s.io` API, which lets you provision TLS
certificates signed by a Certificate Authority (CA) that you control. These CA
and certificates can be used by your workloads to establish trust.

`certificates.k8s.io` API uses a protocol that is similar to the [ACME
draft](https://github.com/ietf-wg-acme/acme/).
-->
Kubernetes 提供 `certificates.k8s.io` API，可讓你配置由你控制的證書頒發機構（CA）
簽名的 TLS 證書。 你的工作負載可以使用這些 CA 和證書來建立信任。

`certificates.k8s.io` API使用的協議類似於
[ACME 草案](https://github.com/ietf-wg-acme/acme/)。

{{< note >}}
<!--
Certificates created using the `certificates.k8s.io` API are signed by a
[dedicated CA](#configuring-your-cluster-to-provide-signing). It is possible to configure your cluster to use the cluster root
CA for this purpose, but you should never rely on this. Do not assume that
these certificates will validate against the cluster root CA.
-->
使用 `certificates.k8s.io` API 創建的證書由指定 [CA](#configuring-your-cluster-to-provide-signing) 頒發。
將集羣配置爲使用集羣根目錄 CA 可以達到這個目的，但是你永遠不要依賴這一假定。
不要以爲這些證書將針對羣根目錄 CA 進行驗證。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
You need the `cfssl` tool. You can download `cfssl` from
[https://github.com/cloudflare/cfssl/releases](https://github.com/cloudflare/cfssl/releases).

Some steps in this page use the `jq` tool. If you don't have `jq`, you can
install it via your operating system's software sources, or fetch it from
[https://jqlang.github.io/jq/](https://jqlang.github.io/jq/).
-->
你需要 `cfssl` 工具。
你可以從 [https://github.com/cloudflare/cfssl/releases](https://github.com/cloudflare/cfssl/releases)
下載 `cfssl`。

本文中某些步驟使用 `jq` 工具。如果你沒有 `jq`，你可以通過操作系統的軟件源安裝，
或者從 [https://jqlang.github.io/jq/](https://jqlang.github.io/jq/) 獲取。

<!-- steps -->

<!--
## Trusting TLS in a cluster

Trusting the [custom CA](#configuring-your-cluster-to-provide-signing) from an application running as a pod usually requires
some extra application configuration. You will need to add the CA certificate
bundle to the list of CA certificates that the TLS client or server trusts. For
example, you would do this with a golang TLS config by parsing the certificate
chain and adding the parsed certificates to the `RootCAs` field in the
[`tls.Config`](https://pkg.go.dev/crypto/tls#Config) struct.
-->
## 集羣中的 TLS 信任

信任 Pod 中運行的應用程序所提供的[自定義 CA](#configuring-your-cluster-to-provide-signing) 通常需要一些額外的應用程序配置。
你需要將 CA 證書包添加到 TLS 客戶端或服務器信任的 CA 證書列表中。
例如，你可以使用 Golang TLS 配置通過解析證書鏈並將解析的證書添加到
[`tls.Config`](https://pkg.go.dev/crypto/tls#Config) 結構中的 `RootCAs`
字段中。

{{< note >}}
<!-- 
Even though the custom CA certificate may be included in the filesystem (in the
ConfigMap `kube-root-ca.crt`),
you should not use that certificate authority for any purpose other than to verify internal
Kubernetes endpoints. An example of an internal Kubernetes endpoint is the
Service named `kubernetes` in the default namespace.

If you want to use a custom certificate authority for your workloads, you should generate
that CA separately, and distribute its CA certificate using a 
[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap) that your pods 
have access to read.
-->
即使自定義 CA 證書可能包含在文件系統中（在 ConfigMap `kube-root-ca.crt` 中），
除了驗證內部 Kubernetes 端點之外，你不應將該證書頒發機構用於任何目的。
內部 Kubernetes 端點的一個示例是默認命名空間中名爲 `kubernetes` 的服務。

如果你想爲你的工作負載使用自定義證書頒發機構，你應該單獨生成該 CA，
並使用你的 Pod 有讀權限的 [ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap)
分發該 CA 證書。
{{< /note >}}

<!--
## Requesting a certificate

The following section demonstrates how to create a TLS certificate for a
Kubernetes service accessed through DNS.

{{< note >}}
This tutorial uses CFSSL: Cloudflare's PKI and TLS toolkit [click here](https://blog.cloudflare.com/introducing-cfssl/) to know more.
{{< /note >}}
-->
## 請求證書

以下部分演示如何爲通過 DNS 訪問的 Kubernetes 服務創建 TLS 證書。

{{< note >}}
本教程使用 CFSSL：Cloudflare's PKI 和 TLS 工具包
[點擊此處](https://blog.cloudflare.com/introducing-cfssl/)瞭解更多信息。
{{< /note >}}

<!--
## Create a certificate signing request

Generate a private key and certificate signing request (or CSR) by running
the following command:
-->
## 創建證書籤名請求

通過運行以下命令生成私鑰和證書籤名請求（或 CSR）:

```shell
cat <<EOF | cfssl genkey - | cfssljson -bare server
{
  "hosts": [
    "my-svc.my-namespace.svc.cluster.local",
    "my-pod.my-namespace.pod.cluster.local",
    "192.0.2.24",
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

<!--
Where `192.0.2.24` is the service's cluster IP,
`my-svc.my-namespace.svc.cluster.local` is the service's DNS name,
`10.0.34.2` is the pod's IP and `my-pod.my-namespace.pod.cluster.local`
is the pod's DNS name. You should see the output similar to:
-->
其中 `192.0.2.24` 是服務的集羣 IP，`my-svc.my-namespace.svc.cluster.local`
是服務的 DNS 名稱，`10.0.34.2` 是 Pod 的 IP，而
`my-pod.my-namespace.pod.cluster.local` 是 Pod 的 DNS 名稱。
你能看到的輸出類似於：

```
2022/02/01 11:45:32 [INFO] generate received request
2022/02/01 11:45:32 [INFO] received CSR
2022/02/01 11:45:32 [INFO] generating key: ecdsa-256
2022/02/01 11:45:32 [INFO] encoded CSR
```

<!--
This command generates two files; it generates `server.csr` containing the PEM
encoded [PKCS#10](https://tools.ietf.org/html/rfc2986) certification request,
and `server-key.pem` containing the PEM encoded key to the certificate that
is still to be created.
-->
此命令生成兩個文件；它生成包含 PEM 編碼
[PKCS#10](https://tools.ietf.org/html/rfc2986) 證書請求的 `server.csr`，
以及 PEM 編碼密鑰的 `server-key.pem`，用於待生成的證書。

<!--
## Create a CertificateSigningRequest object to send to the Kubernetes API

Generate a CSR manifest (in YAML), and send it to the API server. You can do that by
running the following command:
-->
## 創建證書籤名請求（CSR）對象發送到 Kubernetes API

你可以使用以下命令創建 CSR 清單（YAML 格式），併發送到 API 服務器：

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  request: $(cat server.csr | base64 | tr -d '\n')
  signerName: example.com/serving
  usages:
  - digital signature
  - key encipherment
  - server auth
EOF
```

<!--
Notice that the `server.csr` file created in step 1 is base64 encoded
and stashed in the `.spec.request` field. You are also requesting a
certificate with the "digital signature", "key encipherment", and "server
auth" key usages, signed by an example `example.com/serving` signer.
A specific `signerName` must be requested.
View documentation for [supported signer names](/docs/reference/access-authn-authz/certificate-signing-requests/#signers)
for more information.

The CSR should now be visible from the API in a Pending state. You can see
it by running:
-->
請注意，在步驟 1 中創建的 `server.csr` 文件是 base64 編碼並存儲在
`.spec.request` 字段中的。你還要求提供 “digital signature（數字簽名）”，
“密鑰加密（key encipherment）” 和 “服務器身份驗證（server auth）” 密鑰用途，
由 `example.com/serving` 示例簽名程序簽名的證書。
你也可以要求使用特定的 `signerName`。更多信息可參閱
[支持的簽署者名稱](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#signers)。

在 API server 中可以看到這些 CSR 處於 Pending 狀態。執行下面的命令你將可以看到：

```shell
kubectl describe csr my-svc.my-namespace
```

```none
Name:                   my-svc.my-namespace
Labels:                 <none>
Annotations:            <none>
CreationTimestamp:      Tue, 01 Feb 2022 11:49:15 -0500
Requesting User:        yourname@example.com
Signer:                 example.com/serving
Status:                 Pending
Subject:
        Common Name:    my-pod.my-namespace.pod.cluster.local
        Serial Number:
Subject Alternative Names:
        DNS Names:      my-pod.my-namespace.pod.cluster.local
                        my-svc.my-namespace.svc.cluster.local
        IP Addresses:   192.0.2.24
                        10.0.34.2
Events: <none>
```

<!--
## Get the CertificateSigningRequest approved {#get-the-certificate-signing-request-approved}

Approving the [certificate signing request](/docs/reference/access-authn-authz/certificate-signing-requests/)
is either done by an automated approval process or on a one off basis by a cluster
administrator. If you're authorized to approve a certificate request, you can do that
manually using `kubectl`; for example:
-->
## 批准證書籤名請求（CSR）  {#get-the-certificate-signing-request-approved}

[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
的批准或者是通過自動批准過程完成的，或由集羣管理員一次性完成。
如果你被授權批准證書請求，你可以使用 `kubectl` 來手動完成此操作；例如：

```shell
kubectl certificate approve my-svc.my-namespace
```

```none
certificatesigningrequest.certificates.k8s.io/my-svc.my-namespace approved
```

<!-- You should now see the following: -->
你現在應該能看到如下輸出：

```shell
kubectl get csr
```

```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   10m   example.com/serving   yourname@example.com   <none>              Approved
```

<!-- 
This means the certificate request has been approved and is waiting for the
requested signer to sign it.
-->
這意味着證書請求已被批准，並正在等待請求的簽名者對其簽名。

<!--  
## Sign the CertificateSigningRequest {#sign-the-certificate-signing-request}

Next, you'll play the part of a certificate signer, issue the certificate, and upload it to the API.

A signer would typically watch the CertificateSigningRequest API for objects with its `signerName`,
check that they have been approved, sign certificates for those requests,
and update the API object status with the issued certificate.
-->
## 簽名證書籤名請求（CSR） {#sign-the-certificate-signing-request}

接下來，你將扮演證書籤署者的角色，頒發證書並將其上傳到 API 服務器。

簽名者通常會使用其 `signerName` 查看對象的 CertificateSigningRequest API，
檢查它們是否已被批准，爲這些請求籤署證書，並使用已頒發的證書更新 API 對象狀態。

<!-- 
### Create a Certificate Authority

You need an authority to provide the digital signature on the new certificate.

First, create a signing certificate by running the following:
-->
### 創建證書頒發機構

你需要授權在新證書上提供數字簽名。

首先，通過運行以下命令創建簽名證書：

```shell
cat <<EOF | cfssl gencert -initca - | cfssljson -bare ca
{
  "CN": "My Example Signer",
  "key": {
    "algo": "rsa",
    "size": 2048
  }
}
EOF
```

<!-- You should see output similar to: -->
你應該看到類似於以下的輸出：

```none
2022/02/01 11:50:39 [INFO] generating a new CA key and certificate from CSR
2022/02/01 11:50:39 [INFO] generate received request
2022/02/01 11:50:39 [INFO] received CSR
2022/02/01 11:50:39 [INFO] generating key: rsa-2048
2022/02/01 11:50:39 [INFO] encoded CSR
2022/02/01 11:50:39 [INFO] signed certificate with serial number 263983151013686720899716354349605500797834580472
```

<!-- 
This produces a certificate authority key file (`ca-key.pem`) and certificate (`ca.pem`).
-->
這會產生一個證書頒發機構密鑰文件（`ca-key.pem`）和證書（`ca.pem`）。


<!-- ### Issue a certificate -->
### 頒發證書

{{% code_sample file="tls/server-signing-config.json" %}}

<!-- 
Use a `server-signing-config.json` signing configuration and the certificate authority key file 
and certificate to sign the certificate request:
-->
使用 `server-signing-config.json` 簽名配置、證書頒發機構密鑰文件和證書來簽署證書請求：

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.spec.request}' | \
  base64 --decode | \
  cfssl sign -ca ca.pem -ca-key ca-key.pem -config server-signing-config.json - | \
  cfssljson -bare ca-signed-server
```

<!--
You should see the output similar to:
-->
你應該看到類似於以下的輸出：

```
2022/02/01 11:52:26 [INFO] signed certificate with serial number 576048928624926584381415936700914530534472870337
```

<!--
This produces a signed serving certificate file, `ca-signed-server.pem`.
-->
這會生成一個簽名的服務證書文件，`ca-signed-server.pem`。

<!-- 
### Upload the signed certificate

Finally, populate the signed certificate in the API object's status:
-->

### 上傳簽名證書

最後，在 API 對象的狀態中填充簽名證書：

```shell
kubectl get csr my-svc.my-namespace -o json | \
  jq '.status.certificate = "'$(base64 ca-signed-server.pem | tr -d '\n')'"' | \
  kubectl replace --raw /apis/certificates.k8s.io/v1/certificatesigningrequests/my-svc.my-namespace/status -f -
```

{{< note >}}
<!-- 
This uses the command line tool [`jq`](https://jqlang.github.io/jq/) to populate the base64-encoded
content in the `.status.certificate` field.
If you do not have `jq`, you can also save the JSON output to a file, populate this field manually, and
upload the resulting file.
-->
這使用命令行工具 [`jq`](https://jqlang.github.io/jq/)
在 `.status.certificate` 字段中填充 base64 編碼的內容。
如果你沒有 `jq` 工具，你還可以將 JSON 輸出保存到文件中，手動填充此字段，然後上傳結果文件。
{{< /note >}}

<!-- 
Once the CSR is approved and the signed certificate is uploaded, run:
-->
批准 CSR 並上傳簽名證書後，運行：

```shell
kubectl get csr
```

<!-- The output is similar to: -->
輸入類似於：

```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   20m   example.com/serving   yourname@example.com   <none>              Approved,Issued
```

<!--
## Download the certificate and use it

Now, as the requesting user, you can download the issued certificate
and save it to a `server.crt` file by running the following:
-->
## 下載證書並使用它

現在，作爲請求用戶，你可以通過運行以下命令下載頒發的證書並將其保存到 `server.crt` 文件中：

CSR 被簽署並獲得批准後，你應該看到以下內容：

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

<!--
Now you can populate `server.crt` and `server-key.pem` in a
{{< glossary_tooltip text="Secret" term_id="secret" >}}
that you could later mount into a Pod (for example, to use with a webserver
that serves HTTPS).
-->
現在你可以將 `server.crt` 和 `server-key.pem` 填充到
{{<glossary_tooltip text="Secret" term_id="secret" >}} 中，
稍後你可以將其掛載到 Pod 中（例如，用於提供 HTTPS 的網絡服務器）。

```shell
kubectl create secret tls server --cert server.crt --key server-key.pem
```

```none
secret/server created
```

<!-- 
Finally, you can populate `ca.pem` into a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
and use it as the trust root to verify the serving certificate:
-->
最後，你可以將 `ca.pem` 填充到
{{<glossary_tooltip text="ConfigMap" term_id="configmap" >}}
並將其用作信任根來驗證服務證書：

```shell
kubectl create configmap example-serving-ca --from-file ca.crt=ca.pem
```

```none
configmap/example-serving-ca created
```

<!--
## Approving CertificateSigningRequests {#approving-certificate-signing-requests}

A Kubernetes administrator (with appropriate permissions) can manually approve
(or deny) CertificateSigningRequests by using the `kubectl certificate
approve` and `kubectl certificate deny` commands. However if you intend
to make heavy usage of this API, you might consider writing an automated
certificates controller.
-->
## 批准證書籤名請求（CSR）  {#approving-certificate-signing-requests}

Kubernetes 管理員（具有適當權限）可以使用 `kubectl certificate approve` 和
`kubectl certificate deny` 命令手動批准（或拒絕）證書籤名請求（CSR）。
但是，如果你打算大量使用此 API，則可以考慮編寫自動化的證書控制器。

{{< caution >}}
<!-- 
The ability to approve CSRs decides who trusts whom within your environment. The
ability to approve CSRs should not be granted broadly or lightly.

You should make sure that you confidently understand both the verification requirements
that fall on the approver **and** the repercussions of issuing a specific certificate
before you grant the `approve` permission.
-->
批准證書 CSR 的能力決定了在你的環境中誰信任誰。
不應廣泛或輕率地授予批准 CSR 的能力。

在授予 `approve` 權限之前，你應該確保自己充分了解批准人的驗證要求**和**頒發特定證書的後果。
{{< /caution >}}

<!--
Whether a machine or a human using kubectl as above, the role of the _approver_ is
to verify that the CSR satisfies two requirements:
-->
無論上述機器或人使用 kubectl，“批准者”的作用是驗證 CSR 滿足如下兩個要求：

<!--
1. The subject of the CSR controls the private key used to sign the CSR. This
   addresses the threat of a third party masquerading as an authorized subject.
   In the above example, this step would be to verify that the pod controls the
   private key used to generate the CSR.
2. The subject of the CSR is authorized to act in the requested context. This
   addresses the threat of an undesired subject joining the cluster. In the
   above example, this step would be to verify that the pod is allowed to
   participate in the requested service.
-->
1. CSR 的 subject 控制用於簽署 CSR 的私鑰。這解決了僞裝成授權主體的第三方的威脅。
   在上述示例中，此步驟將驗證該 Pod 控制了用於生成 CSR 的私鑰。
2. CSR 的 subject 被授權在請求的上下文中執行。
   這點用於處理不期望的主體被加入集羣的威脅。
   在上述示例中，此步驟將是驗證該 Pod 是否被允許加入到所請求的服務中。

<!--
If and only if these two requirements are met, the approver should approve
the CSR and otherwise should deny the CSR.

For more information on certificate approval and access control, read
the [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
reference page.
-->
當且僅當滿足這兩個要求時，審批者應該批准 CSR，否則拒絕 CSR。

有關證書批准和訪問控制的更多信息，
請閱讀[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)參考頁。

<!--
## Configuring your cluster to provide signing

This page assumes that a signer is set up to serve the certificates API. The
Kubernetes controller manager provides a default implementation of a signer. To
enable it, pass the `--cluster-signing-cert-file` and
`--cluster-signing-key-file` parameters to the controller manager with paths to
your Certificate Authority's keypair.
-->
## 給集羣管理員的一個建議

本頁面假設已經爲 certificates API 配置了簽名者。
Kubernetes 控制器管理器提供了一個簽名者的默認實現。要啓用它，請爲控制器管理器設置
`--cluster-signing-cert-file` 和 `--cluster-signing-key-file` 參數，
使之取值爲你的證書機構的密鑰對的路徑。
