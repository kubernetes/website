---
title: 実行中のPodのデバッグ
content_type: task
---

<!-- overview -->

このページでは、ノード上で動作している(またはクラッシュしている)Podをデバッグする方法について説明します。


## {{% heading "prerequisites" %}}


* あなたの{{< glossary_tooltip text="Pod" term_id="pod" >}}は既にスケジュールされ、実行されているはずです。Pod がまだ実行されていない場合は、[Troubleshoot Applications](/docs/tasks/debug-application-cluster/debug-application/) から始めてください。

* いくつかの高度なデバッグ手順では、Podがどのノードで動作しているかを知り、そのノードでコマンドを実行するためのシェルアクセス権を持っていることが必要です。`kubectl` を使用する標準的なデバッグ手順の実行には、そのようなアクセスは必要ではありません。



<!-- steps -->

## Podログを調べます {#examine-pod-logs}

まず、影響を受けるコンテナのログを見ます。

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

コンテナが以前にクラッシュしたことがある場合、以前のコンテナのクラッシュログにアクセスすることができます。

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

## container execによるデバッグ {#container-exec}

もし{{< glossary_tooltip text="container image" term_id="image" >}}がデバッグユーティリティを含んでいれば、LinuxやWindows OSのベースイメージからビルドしたイメージのように、`kubectl exec` で特定のコンテナ内でコマンドを実行することが可能です。

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}`は省略可能です。コンテナを1つだけ含むPodの場合は省略できます。
{{< /note >}}

例として、実行中のCassandra Podからログを見るには、次のように実行します。

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

例えば`kubectl exec`の`-i`と`-t`引数を使って、端末に接続されたシェルを実行することができます。

```shell
kubectl exec -it cassandra -- sh
```

詳しくは、[実行中のコンテナのシェルを取得する](/docs/tasks/debug-application-cluster/get-shell-running-container/)を参照してください。

## エフェメラルコンテナによるデバッグ {#ephemeral-container}

{{< feature-state state="beta" for_k8s_version="v1.23" >}}

{{< glossary_tooltip text="エフェメラルコンテナ" term_id="ephemeral-container" >}}は、コンテナがクラッシュしたり、コンテナイメージにデバッグユーティリティが含まれていないなどの理由で`kubectl exec`が不十分な場合に、対話的にトラブルシューティングを行うのに便利です([ディストロ・イメージ](
https://github.com/GoogleContainerTools/distroless)の場合など)。

### エフェメラルコンテナを使用したデバッグ例 {#ephemeral-container-example}

実行中のPodにエフェメラルコンテナを追加するには、`kubectl debug`コマンドを使用することができます。
まず、サンプル用のPodを作成します。

```shell
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
```

このセクションの例では、デバッグユーティリティが含まれていない`pause`コンテナイメージを使用していますが、この方法はすべてのコンテナイメージで動作します。

もし、`kubectl exec`を使用してシェルを作成しようとすると、このコンテナイメージにはシェルが存在しないため、エラーが表示されます。

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

代わりに、`kubectl debug` を使ってデバッグ用のコンテナを追加することができます。
引数に`-i`/`--interactive`を指定すると、`kubectl`は自動的にエフェメラルコンテナのコンソールにアタッチされます。

```shell
kubectl debug -it ephemeral-demo --image=busybox --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

このコマンドは新しいbusyboxコンテナを追加し、それにアタッチします。`target`パラメーターは、他のコンテナのプロセス名前空間をターゲットにします。これは`kubectl run`が作成するPodで[process namespace sharing](/docs/tasks/configure-pod-container/share-process-namespace/)を有効にしないため、指定する必要があります。

{{< note >}}
`target` パラメーターは {{< glossary_tooltip text="Container Runtime" term_id="container-runtime" >}} でサポートされている必要があります。サポートされていない場合、エフェメラルコンテナは起動されないか、`ps`が他のコンテナ内のプロセスを表示しないように孤立したプロセス名前空間を使用して起動されます。
{{< /note >}}

新しく作成されたエフェメラルコンテナの状態は`kubectl describe`を使って見ることができます。

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

終了したら`kubectl delete`を使ってPodを削除してください。

```shell
kubectl delete pod ephemeral-demo
```

## Podのコピーを使ったデバッグ

Podの設定オプションによって、特定の状況でのトラブルシューティングが困難になることがあります。
例えば、コンテナイメージにシェルが含まれていない場合、またはアプリケーションが起動時にクラッシュした場合は、`kubectl exec`を実行してトラブルシューティングを行うことができません。
このような状況では、`kubectl debug` を使用してデバッグを支援するために設定値を変更したPodのコピーです。

### 新しいコンテナを追加しながらPodをコピーします

新しいコンテナを追加することは、アプリケーションが動作しているが期待通りの動作をせず、トラブルシューティングユーティリティをPodに追加したい場合に便利な場合があります。
例えば、アプリケーションのコンテナイメージは`busybox`上にビルドされているが、`busybox`に含まれていないデバッグユーティリティが必要な場合があります。このシナリオは `kubectl run` を使ってシミュレーションすることができます。

```shell
kubectl run myapp --image=busybox --restart=Never -- sleep 1d
```

このコマンドを実行すると、`myapp`のコピーに`myapp-debug`という名前が付き、デバッグ用の新しいUbuntuコンテナが追加されます。

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```

{{< note >}}
* `kubectl debug`は`--container`フラグでコンテナ名を選択しない場合、自動的にコンテナ名を生成します。

* `i`フラグを指定すると、デフォルトで`kubectl debug`が新しいコンテナにアタッチされます。これを防ぐには、`--attach=false`を指定します。セッションが切断された場合は、`kubectl attach`を使用して再接続することができます。

* `share-processes` を指定すると、Pod 内のコンテナからプロセスを参照することができます。この仕組みについて詳しくは、[Share Process Namespace between Containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/)を参照してください。
{{< /note >}}

デバッグが終わったら、Podの後始末をするのを忘れないでください。

```shell
kubectl delete pod myapp myapp-debug
```

### Podのコマンドを変更しながらコピーします

デバッグフラグを追加するためや、アプリケーションがクラッシュするためなど、コンテナのコマンドを変更すると便利な場合があります。
アプリケーションのクラッシュをシミュレートするには、`kubectl run`を使用して、すぐに終了するコンテナを作成します。

```
kubectl run --image=busybox myapp -- false
```

`kubectl describe pod myapp` を使用すると、このコンテナがクラッシュしていることがわかります。

```
Containers:
  myapp:
    Image:         busybox
    ...
    Args:
      false
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
```

`kubectl debug`を使うと、コマンドをインタラクティブシェルに変更したこのPodのコピーを作成することができます。

```
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```
If you don't see a command prompt, try pressing enter.
/ #
```

これで、ファイルシステムのパスのチェックやコンテナコマンドの手動実行などのタスクを実行するために使用できる対話型シェルが完成しました。

{{< note >}}
* 特定のコンテナのコマンドを変更するには、そのコンテナ名を`--container`で指定する必要があり、そうしないと`kubectl debug`が代わりに指定したコマンドを実行する新しいコンテナを作成します。

* ` i` フラグは、デフォルトで `kubectl debug` がコンテナにアタッチされるようにします。これを防ぐには、`--attach=false`を指定します。セッションが切断された場合は、`kubectl attach` を使用して再接続することができます。
{{< /note >}}

デバッグが終わったら、Podの後始末をするのを忘れないでください。

```shell
kubectl delete pod myapp myapp-debug
```

### コンテナイメージを変更してPodをコピーします

状況によっては、動作不良のPodを通常のプロダクション用のイメージから、デバッグ・ビルドや追加ユーティリティを含むイメージに変更したい場合があります。

例として、`kubectl run`を使用してPodを作成します。

```
kubectl run myapp --image=busybox --restart=Never -- sleep 1d
```

ここで、`kubectl debug`を使用してコピーを作成し、そのコンテナイメージを`ubuntu`に変更します。

```
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

`set-image`の構文は、`kubectl set image`と同じ`container_name=image`の構文を使用します。`*=ubuntu`は、全てのコンテナのイメージを`ubuntu`に変更することを意味します。

デバッグが終わったら、Podの後始末をするのを忘れないでください。

```shell
kubectl delete pod myapp myapp-debug
```

## ノード上のシェルによるデバッグ {#node-shell-session}

いずれの方法でもうまくいかない場合は、Podが動作しているノードを探し出し、ホストの名前空間で動作する特権Podを作成します。
ノード上で `kubectl debug` を使って対話型のシェルを作成するには、以下を実行します。

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

ノードでデバッグセッションを作成する場合、以下の点に注意してください:

* `kubectl debug`はノードの名前に基づいて新しい Pod の名前を自動的に生成します。
* コンテナはホストのIPC、Network、PIDネームスペースで実行されます。
* ノードのルートファイルシステムは`/host`にマウントされます。

デバッグが終わったら、Podの後始末をするのを忘れないでください。

```shell
kubectl delete pod node-debugger-mynode-pdx84
```
