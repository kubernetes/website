---
title: Kubectlを用いたKubernetesノードのデバッグ
content_type: task
min-kubernetes-server-version: 1.20
---

<!-- overview -->
このページでは、Kubernetesクラスター上で動作している[ノード](/ja/docs/concepts/architecture/nodes/)を`kubectl debug`コマンドを使用してデバッグする方法について説明します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Podを作成し、それらの新しいPodを任意のノードに割り当てる権限が必要です。
また、ホストのファイルシステムにアクセスするPodを作成する権限も必要です。

<!-- steps -->

## `kubectl debug node`を用いてノードをデバッグする

`kubectl debug node`コマンドを使用して、トラブルシューティングしたいノードにPodをデプロイします。
このコマンドは、SSH接続を使用してノードにアクセスできないシナリオで役に立ちます。
Podが作成されると、そのPodはノード上で対話型シェルを開きます。
mynodeという名前のノード上で対話型シェルを作成するには、次のように実行します。

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```console
mynodeという名前のノード上に、コンテナデバッガーを持つデバッグの用Pod、node-debugger-mynode-pdx84を作成します。
コマンドプロンプトが表示されない場合は、エンターキーを押してみてください。
root@mynode:/#
```

デバッグコマンドは、情報を収集し、問題をトラブルシューティングするのに役立ちます。
使用する可能性のあるコマンドには、`ip`、`ifconfig`、`nc`、`ping`、`ps`などがあります。
また、`mtr`、`tcpdump`、`curl`などの他のツールもそれぞれのパッケージマネージャーからインストールすることができます。

{{< note >}}

デバッグコマンドは、デバッグ用のPodが使用しているイメージに基づいて異なる場合があり、これらのコマンドをインストールする必要があるかもしれません。

{{< /note >}}

デバッグ用のPodは、Pod内の`/host`にマウントされたノードのルートファイルシステムにアクセスできます。
kubeletをファイルシステムのネームスペースで実行している場合、デバッグ用のPodはそのネームスペースのルートを見ることになり、ノード全体のルートではありません。
典型的なLinuxノードの場合、関連するログを見つけるために以下のパスを確認できます。

`/host/var/log/kubelet.log`
: ノード上でコンテナを実行する責任がある`kubelet`からのログです。

`/host/var/log/kube-proxy.log`
: サービスのエンドポイントへのトラフィックを指示する責任がある`kube-proxy`からのログです。

`/host/var/log/containerd.log`
: ノード上で実行されている`containerd`プロセスからのログです。

`/host/var/log/syslog`
: システムに関する一般的なメッセージや情報です。

`/host/var/log/kern.log`
: カーネルログです。

ノード上でデバッグセッションを作成する際には、以下の点を考慮してください。

* `kubectl debug`は、新しいPodの名前をノードの名前に基づいて自動的に生成します。
* ノードのルートファイルシステムは`/host`にマウントされます。
* コンテナはホストのIPC、ネットワーク、PID Namespaceで実行されますが、Podは特権を持っていません。
  これは、一部のプロセス情報の読み取りが失敗する可能性があることを意味します。
  その情報へのアクセスはスーパーユーザーに制限されているためです。
  例えば、`chroot /host`は失敗します。
  特権Podが必要な場合は、手動で作成するか、`--profile=sysadmin`を使用してください。
* デバッグ用のPodに[デバッグプロファイル](/ja/docs/tasks/debug/debug-application/debug-running-pod/#debugging-profiles)を適用することで、[securityContext](/ja/docs/tasks/configure-pod-container/security-context/)などの特定のプロパティを設定できます。

## {{% heading "cleanup" %}}

デバッグ用のPodの使用が終了したら、それを削除してください。

```shell
kubectl get pods
```

```none
NAME                          READY   STATUS       RESTARTS   AGE
node-debugger-mynode-pdx84    0/1     Completed    0          8m1s
```

```shell
# Podの名前は適宜変更してください
kubectl delete pod node-debugger-mynode-pdx84 --now
```

```none
pod "node-debugger-mynode-pdx84" deleted
```

{{< note >}}

ノードがダウンしている場合(ネットワークから切断されている、kubeletが停止して再起動しないなど)、`kubectl debug node`コマンドは機能しません。
その場合は、[ダウンあるいは到達不能なノードのデバッグ](/ja/docs/tasks/debug/debug-cluster/#example-debugging-a-down-unreachable-node)を確認してください。

{{< /note >}}
