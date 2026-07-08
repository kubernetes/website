---
title: Kubeletの証明書のローテーションを設定する
content_type: task
---

<!-- overview -->
このページでは、kubeletの証明書のローテーションを設定する方法を説明します。

{{< feature-state for_k8s_version="v1.8" state="beta" >}}

## {{% heading "prerequisites" %}}

* Kubernetesはバージョン1.8.0以降である必要があります。

<!-- steps -->

## 概要

kubeletは、Kubernetes APIへの認証のために証明書を使用します。デフォルトでは、証明書は1年間の有効期限付きで発行されるため、頻繁に更新する必要はありません。

Kubernetes 1.8にはベータ機能の[kubelet certificate rotation](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)が含まれているため、現在の証明書の有効期限が近づいたときに自動的に新しい鍵を生成して、Kubernetes APIに新しい証明書をリクエストできます。新しい証明書が利用できるようになると、Kubernetes APIへの接続の認証に利用されます。

## クライアント証明書のローテーションを有効にする

`kubelet`プロセスは`--rotate-certificates`という引数を受け付けます。この引数によって、現在使用している証明書の有効期限が近づいたときに、kubeletが自動的に新しい証明書をリクエストするかどうかを制御できます。証明書のローテーションはベータ機能であるため、`--feature-gates=RotateKubeletClientCertificate=true`を使用してフィーチャーフラグを有効にする必要もあります。

`kube-controller-manager`プロセスは、`--experimental-cluster-signing-duration`という引数を受け付け、この引数で証明書が発行される期間を制御できます。

## 証明書のローテーションの設定を理解する

kubeletが起動すると、ブートストラップが設定されている場合(`--bootstrap-kubeconfig`フラグを使用した場合)、初期証明書を使用してKubernetes APIに接続して、証明書署名リクエスト(certificate signing request、CSR)を発行します。証明書署名リクエストのステータスは、次のコマンドで表示できます。

```sh
kubectl get csr
```

ノード上のkubeletから発行された証明書署名リクエストは、初めは`Pending`状態です。証明書署名リクエストが特定の条件を満たすと、コントローラーマネージャーに自動的に承認され、`Approved`状態になります。次に、コントローラーマネージャーは`--experimental-cluster-signing-duration`パラメーターで指定された有効期限で発行された証明書に署名を行い、署名された証明書が証明書署名リクエストに添付されます。

kubeletは署名された証明書をKubernetes APIから取得し、ディスク上の`--cert-dir`で指定された場所に書き込みます。その後、kubeletは新しい証明書を使用してKubernetes APIに接続するようになります。

署名された証明書の有効期限が近づくと、kubeletはKubernetes APIを使用して新しい証明書署名リクエストを自動的に発行します。再び、コントローラーマネージャーは証明書のリクエストを自動的に承認し、署名された証明書を証明書署名リクエストに添付します。kubeletは新しい署名された証明書をKubernetes APIから取得してディスクに書き込みます。その後、kubeletは既存のコネクションを更新して、新しい証明書でKubernetes APIに再接続します。
