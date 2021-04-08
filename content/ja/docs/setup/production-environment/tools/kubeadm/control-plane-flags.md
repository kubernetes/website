---
title: kubeadmを使ったコントロールプレーンの設定のカスタマイズ
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="1.12" state="stable" >}}

kubeadmの`ClusterConfiguration`オブジェクトはAPIServer、ControllerManager、およびSchedulerのようなコントロールプレーンの構成要素に渡されたデフォルトのフラグを上書きすることができる `extraArgs`の項目があります。
その構成要素は次の項目で定義されています。

- `apiServer`
- `controllerManager`
- `scheduler`

`extraArgs` の項目は `キー: 値` のペアです。コントロールプレーンの構成要素のフラグを上書きするには:

1. 設定内容に適切な項目を追加
2. フラグを追加して項目を上書き
3. `--config <任意の設定YAMLファイル>`で`kubeadm init`を実行

各設定項目のより詳細な情報は[APIリファレンスのページ](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm#ClusterConfiguration)を参照してください。

{{< note >}}
`kubeadm config print init-defaults`を実行し、選択したファイルに出力を保存することで、デフォルト値で`ClusterConfiguration`オブジェクトを生成できます。
{{< /note >}}



<!-- body -->

## APIServerフラグ

詳細は[kube-apiserverのリファレンスドキュメント](/docs/reference/command-line-tools-reference/kube-apiserver/)を参照してください。

使用例:
```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
    advertise-address: 192.168.0.103
    anonymous-auth: "false"
    enable-admission-plugins: AlwaysPullImages,DefaultStorageClass
    audit-log-path: /home/johndoe/audit.log
```

## ControllerManagerフラグ

詳細は[kube-controller-managerのリファレンスドキュメント](/docs/reference/command-line-tools-reference/kube-controller-manager/)を参照してください。

使用例:
```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
    cluster-signing-key-file: /home/johndoe/keys/ca.key
    bind-address: 0.0.0.0
    deployment-controller-sync-period: "50"
```

## Schedulerフラグ

詳細は[kube-schedulerのリファレンスドキュメント](/docs/reference/command-line-tools-reference/kube-scheduler/)を参照してください。

使用例:
```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
    bind-address: 0.0.0.0
    config: /home/johndoe/schedconfig.yaml
    kubeconfig: /home/johndoe/kubeconfig.yaml
```


