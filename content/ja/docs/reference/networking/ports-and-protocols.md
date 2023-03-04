---
title: Ports and Protocols
content_type: reference
weight: 40
---

パブリッククラウドにおける仮想ネットワークや、物理ネットワークファイアウォールを持つオンプレミスのデータセンターのようなネットワークの境界が厳しい環境でKubernetsを実行する場合、
Kubernetesのコンポーネントが使用するポートやプロトコルを認識しておくと便利です。

## Control plane


| プロトコル | 通信の向き | ポート範囲  | 目的                    | 使用者                    |
|------------|------------|-------------|-------------------------|---------------------------|
| TCP        | Inbound    | 6443        | Kubernetes API server   | All                       |
| TCP        | Inbound    | 2379-2380   | etcd server client API  | kube-apiserver, etcd      |
| TCP        | Inbound    | 10250       | Kubelet API             | Self, Control plane       |
| TCP        | Inbound    | 10259       | kube-scheduler          | Self                      |
| TCP        | Inbound    | 10257       | kube-controller-manager | Self                      |

etcdポートはコントロールプレーンノードに含まれていますが、独自のetcdクラスターを外部またはカスタムポートでホストすることもできます。

## Worker node(s) {#node}

| プロトコル | 通信の向き | ポート範囲  | 目的                  | 使用者                  |
|------------|------------|-------------|-----------------------|-------------------------|
| TCP        | Inbound    | 10250       | Kubelet API           | Self, Control plane     |
| TCP        | Inbound    | 30000-32767 | NodePort Services†    | All                     |

† デフォルトポートの範囲は[NodePort Services](/ja/docs/concepts/services-networking/service/)を参照。


すべてのデフォルトのポート番号が書き換え可能です。
カスタムポートを使用する場合、ここに記載されているデフォルトではなく、それらのポートを開く必要があります。

よくある例としては、API Serverのポートを443に変更することがあります。
または、デフォルトポートをそのままにし、API Serverを443でリッスンしているロードバランサーの後ろに置き、APIサーバのデフォルトポートにリクエストをルーティングする方法もあります。

