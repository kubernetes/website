---
title: ネットワークポリシーのためのWeave Net
content_type: task
weight: 60
---

<!-- overview -->
このページでは、ネットワークポリシーとしてWeave Netを使用する方法を説明します。

## {{% heading "prerequisites" %}}

Kubernetesクラスターが必要です。
クラスターをブートストラップするには、[kubeadmのスタートガイド](/docs/reference/setup-tools/kubeadm/)に従ってください。

<!-- steps -->

## Weave Netアドオンのインストール {#install-the-weave-net-addon}

[アドオン経由でのKubernetes統合](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#-installation)ガイドに従ってください。

Kubernetes用のWeave Netアドオンには[Network Policy Controller](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#network-policy)が付属しており、Kubernetesのすべての名前空間におけるNetworkPolicyのアノテーションを自動的に監視し、ポリシーの指示に従ってトラフィックを許可またはブロックする`iptables`ルールを設定します。

## インストールのテスト {#test-the-installation}

weaveが動作していることを検証してください。

次のコマンドを入力してください:

```shell
kubectl get pods -n kube-system -o wide
```

出力は次のようなものになります：

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    worknode3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

各ノードにweave Podが存在し、すべてのPodが`Running`かつ`2/2 READY`状態になっています(`2/2`は、各Podに`weave`と`weave-npc`が含まれていることを意味します)。

## {{% heading "whatsnext" %}}

Weave Netアドオンをインストールしたら、[ネットワークポリシーを宣言する](/docs/tasks/administer-cluster/declare-network-policy/)に従ってKubernetes NetworkPolicyを試すことができます。
ご質問がある場合は、[Slackの#weave-communityまたはWeave User Group](https://github.com/weaveworks/weave#getting-help)までお問い合わせください。
