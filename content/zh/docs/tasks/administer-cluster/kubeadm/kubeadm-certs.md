---
reviewers:
- sig-cluster-lifecycle
title: 使用 kubeadm 进行证书管理
content_template: templates/task
---
<!--
---
reviewers:
- sig-cluster-lifecycle
title: Certificate Management with kubeadm
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page explains how to manage certificates manually with kubeadm.
-->
本页介绍如何使用 kubeadm 手动管理证书。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
These are advanced topics for users who need to integrate their organization's certificate infrastructure into a kubeadm-built cluster. If kubeadm with the default configuration satisfies your needs, you should let kubeadm manage certificates instead.
-->
这些是需要将其组织的证书基础机构集成到 kubeadm 构建的集群中的用户的高级主题。如果具有默认配置的 kubeadm 满足您的需求，您应该让 kubeadm 管理证书。

<!--
You should be familiar with [PKI certificates and requirements in Kubernetes](/docs/setup/best-practices/certificates/).
-->
您应该熟悉[Kubernetes 中的 PKI 证书和要求](/docs/setup/best-practices/certificates/)。

{{% /capture %}}

{{% capture steps %}}

<!--
## Renew certificates with the certificates API
-->
## 使用证书 API 更新证书

<!--
The Kubernetes certificates normally reach their expiration date after one year.
-->
Kubernetes 证书通常在一年后到期。

<!--
Kubeadm can renew certificates with the `kubeadm alpha certs renew` commands; you should run these commands on control-plane nodes only.
-->
Kubeadm 可以使用`kubeadm alpha certs renew`命令更新证书；您应该只在控制平面节点上运行这些命令。

<!--
Typically this is done by loading on-disk CA certificates and keys and using them to issue new certificates.
This approach works well if your certificate tree is self-contained. However, if your certificates are externally
managed, you might need a different approach.
-->
通常，这是通过加载磁盘CA证书和密钥并使用它们来颁发新证书来完成的。
如果证书树是自包含的，则此方法很有效。
然而，如果您的证书是外部管理的，您可能需要一个不同的方法。

<!--
As an alternative, Kubernetes provides its own [API for managing certificates][manage-tls].
With kubeadm, you can use this API by running `kubeadm alpha certs renew --use-api`.
-->
作为替代方案，Kubernetes 提供了自己的[用于管理证书的 API][manage-tls]。
使用 kubeadm，您可以通过运行`kubeadm alpha certs renew --use-api`来使用此 API。

<!--
## Set up a signer
-->
## 设置签名者

<!--
The Kubernetes Certificate Authority does not work out of the box.
You can configure an external signer such as [cert-manager][cert-manager-issuer], or you can use the build-in signer.
The built-in signer is part of [`kube-controller-manager`][kcm].
To activate the build-in signer, you pass the `--cluster-signing-cert-file` and `--cluster-signing-key-file` arguments.
-->
Kubernetes 证书颁发机构不是开箱即用。
你可以配置外部签名者，例如[cert-manager][cert-manager-issuer]，也可以使用内置签名者。
内置签名者是[`kube-controller-manager`][kcm]的一部分。
要激活内置签名者，请传递`--cluster-signing-cert-file` 和 `--cluster-signing-key-file`参数。

<!--
You pass these arguments in any of the following ways:
-->
您可以通过以下任何方式传递这些参数：

<!--
* Edit `/etc/kubernetes/manifests/kube-controller-manager.yaml` to add the arguments to the command.
  Remember that your changes could be overwritten when you upgrade.
-->
* 编辑`/etc/kubernetes/manifests/kube-controller-manager.yaml`将参数添加到命令中。
 请记住，升级时可能会覆盖您的更改。

<!--
* If you're creating a new cluster, you can use a kubeadm [configuration file][config]:
-->
* 如果您要创建新集群，可以使用 kubeadm[配置文件][config]:

  ```yaml
  apiVersion: kubeadm.k8s.io/v1beta1
  kind: ClusterConfiguration
  controllerManager:
    extraArgs:
      cluster-signing-cert-file: /etc/kubernetes/pki/ca.crt
      cluster-signing-key-file: /etc/kubernetes/pki/ca.key
  ```

<!--
* You can also upload a config file using [`kubeadm config upload from-files`][config-upload]
-->
* 您也可以使用[`kubeadm config upload from-files`][config-upload]上传配置文件

[cert-manager-issuer]: https://cert-manager.readthedocs.io/en/latest/tutorials/ca/creating-ca-issuer.html
[kcm]: /docs/reference/command-line-tools-reference/kube-controller-manager/
[config]: https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta1
[config-upload]: /docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-from-file


<!--
### Approve requests
-->
### 批准请求

<!--
If you set up an external signer such as [cert-manager][cert-manager], certificate signing requests (CSRs) are automatically approved.
Otherwise, you must manually approve certificates with the [`kubectl certificate`][certs] command.
The following kubeadm command outputs the name of the certificate to approve, then blocks and waits for approval to occur:
-->
如果您设置例如[cert-manager][cert-manager]等外部签名者，则会自动批准证书签名请求（CSRs）。
否者，您必须使用[`kubectl certificate`][certs]命令手动批准证书。
以下 kubeadm 命令输出要批准的证书名称，然后缓慢等待批准发生：

```shell
sudo kubeadm alpha certs renew apiserver --use-api &
```
```
[1] 2890
[certs] certificate request "kubeadm-cert-kube-apiserver-ld526" created
```
```shell
kubectl certificate approve kubeadm-cert-kube-apiserver-ld526
certificatesigningrequest.certificates.k8s.io/kubeadm-cert-kube-apiserver-ld526 approved
[1]+  Done                    sudo kubeadm alpha certs renew apiserver --use-api
```

<!--
You can view a list of pending certificates with `kubectl get csr`.
-->
您可以使用`kubectl get csr`查看待处理证书列表。

[manage-tls]: /docs/tasks/tls/managing-tls-in-a-cluster/
[cert-manager]: https://github.com/jetstack/cert-manager
[certs]: /docs/reference/generated/kubectl/kubectl-commands#certificate

<!--
## Certificate requests with kubeadm
-->
## 使用 kubeadm 的证书请求

<!--
To better integrate with external CAs, kubeadm can also produce certificate signing requests (CSRs).
A CSR represents a request to a CA for a signed certificate for a client.
In kubeadm terms, any certificate that would normally be signed by an on-disk CA can be produced as a CSR instead. A CA, however, cannot be produced as a CSR.
-->
为了更好的与外部 CA 集成，kubeadm 还可以生成证书签名请求（CSR）。
CSR 表示向 CA 请求客户的签名证书。
在 kubeadm 术语中，通常由磁盘 CA 签名的任何证书都可以作为 CSR 生成。但是，CA 不能作为 CSR 生成。

<!--
You can create an individual CSR with `kubeadm init phase certs apiserver --csr-only`.
The `--csr-only` flag can be applied only to individual phases. After [all certificates are in place][certs], you can run `kubeadm init --external-ca`.
-->
您可以使用`kubeadm init phase certs apiserver --csr-only`创建单独的 CSR。
`--csr-only`标志只能应用于各个阶段。在[所有证书到位][证书]之后, 您可以运行`kubeadm init --external-ca`。

<!--
You can pass in a directory with `--csr-dir` to output the CSRs to the specified location.
If `--csr-dir` is not specified, the default certificate directory (`/etc/kubernetes/pki`) is used.
Both the CSR and the accompanying private key are given in the output. After a certificate is signed, the certificate and the private key must be copied to the PKI directory (by default `/etc/kubernetes/pki`).
-->
您可以传入一个带有`--csr-dir`的目录，将 CRS 输出到指定位置。
如果未指定`--csr-dir`，则使用默认证书目录(`/etc/kubernetes/pki`)。
CSR 和随附的私钥都在输出中给出。签署证书后，必须将证书和私钥复制到 PKI 目录（默认情况下为`/etc/kubernetes/pki`）。

<!--
### Renew certificates
-->
### 更新证书

<!--
Certificates can be renewed with `kubeadm alpha certs renew --csr-only`.
As with `kubeadm init`, an output directory can be specified with the `--csr-dir` flag.
To use the new certificates, copy the signed certificate and private key into the PKI directory (by default `/etc/kubernetes/pki`)
-->
可以使用`kubeadm alpha certs renew --csr-only`更新证书。
与`kubeadm init`一样，可以使用`--csr-dir`标志指定输出目录。
要使用新证书，请将签名证书和私钥复制到 PKI 目录中（默认情况下为`/etc/kubernetes/pki`）

<!--
## Cert usage
-->
## 证书使用

<!--
A CSR contains a certificate's name, domains, and IPs, but it does not specify usages.
It is the responsibility of the CA to specify [the correct cert usages][cert-table] when issuing a certificate.
-->
CSR 包含证书的名称、域和 IP，但不指定用法。
CA 颁发证书时，有责任指定[正确的证书用法][证书表] 。

<!--
* In `openssl` this is done with the [`openssl ca` command][openssl-ca].
* In `cfssl` you specify [usages in the config file][cfssl-usages]
-->
* 在 `openssl`中，这是通过 [`openssl ca` command][openssl-ca]完成的。
* 在 `cfssl` 中指定 [配置文件中的用法][cfssl-usages]

<!--
## CA selection
-->
## CA 选择

<!--
Kubeadm sets up [three CAs][cert-cas] by default. Make sure to sign the CSRs with a corresponding CA.
-->
Kubeadm 默认设置[三个 CA][cert-cas]。确保使用相应的 CA 对 CSR 进行签名。

<!--
[openssl-ca]: https://superuser.com/questions/738612/openssl-ca-keyusage-extension
[cfssl-usages]: https://github.com/cloudflare/cfssl/blob/master/doc/cmd/cfssl.txt#L170
[certs]: /docs/setup/best-practices/certificates/
[cert-cas]: /docs/setup/best-practices/certificates/#single-root-ca
[cert-table]: /docs/setup/best-practices/certificates/#all-certificates
-->
[openssl-ca]: https://superuser.com/questions/738612/openssl-ca-keyusage-extension
[cfssl-usages]: https://github.com/cloudflare/cfssl/blob/master/doc/cmd/cfssl.txt#L170
[证书]: /docs/setup/best-practices/certificates/
[cert-cas]: /docs/setup/best-practices/certificates/#single-root-ca
[cert-table]: /docs/setup/best-practices/certificates/#all-certificates

{{% /capture %}}
