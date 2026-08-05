---
title: "kubectlの設定を検証する"
description: "kubectlを検証する方法。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

kubectlがKubernetesクラスターを探索し接続するために、[kubeconfigファイル](/ja/docs/concepts/configuration/organize-cluster-access-kubeconfig/)が必要です。
これは、[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)によりクラスターを作成した際や、Minikubeクラスターを正常にデプロイした際に自動生成されます。
デフォルトでは、kubectlの設定は`~/.kube/config`に格納されています。

クラスターの状態を取得し、kubectlが適切に設定されていることを確認してください:

```shell
kubectl cluster-info
```

URLのレスポンスが表示されている場合は、kubectlはクラスターに接続するよう正しく設定されています。

以下のようなメッセージが表示されている場合は、kubectlは正しく設定されていないか、Kubernetesクラスターに接続できていません。

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

たとえば、ラップトップ上(ローカル環境)でKubernetesクラスターを起動するような場合、[Minikube](https://minikube.sigs.k8s.io/docs/start/)などのツールを最初にインストールしてから、上記のコマンドを再実行する必要があります。

`kubectl cluster-info`がURLレスポンスを返したにもかかわらずクラスターにアクセスできない場合は、次のコマンドで設定が正しいことを確認してください:

```shell
kubectl cluster-info dump
```

### エラーメッセージ'No Auth Provider Found'のトラブルシューティング{#no-auth-provider-found}

Kubernetes 1.26にて、kubectlは以下のクラウドプロバイダーが提供するマネージドKubernetesのビルトイン認証を削除しました。
これらのプロバイダーは、クラウド固有の認証を提供するkubectlプラグインをリリースしています。
手順については以下のプロバイダーのドキュメントを参照してください:

* Azure AKS: [kubelogin plugin](https://azure.github.io/kubelogin/)
* Google Kubernetes Engine: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl?hl=ja#install_plugin)

(この変更とは関係なく、他の理由で同じエラーメッセージが表示される可能性もあります。)
