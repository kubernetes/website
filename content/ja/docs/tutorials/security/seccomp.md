---
title: seccompを使用してコンテナのシステムコールを制限する
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.22
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

seccomp(SECure COMPuting mode)はLinuxカーネル2.6.12以降の機能です。
この機能を用いると、ユーザー空間からカーネルに対して発行できるシステムコールを制限することで、プロセス権限のサンドボックスを構築することができます。
Kubernetesでは、{{< glossary_tooltip text="ノード" term_id="node" >}}上で読み込んだseccompプロファイルをPodやコンテナに対して自動で適用することができます。

あなたのワークロードが必要とする権限を特定するのは、実際には難しい作業になるかもしれません。
このチュートリアルでは、ローカルのKubernetesクラスターでseccompプロファイルを読み込むための方法を説明し、seccompプロファイルのPodへの適用方法について学んだ上で、コンテナプロセスに対して必要な権限のみを付与するためのseccompプロファイルを作成する方法を概観していきます。

## {{% heading "objectives" %}}  

* ノードでseccompプロファイルを読み込む方法を学ぶ。
* seccompプロファイルをコンテナに適用する方法を学ぶ。
* コンテナプロセスが生成するシステムコールの監査出力を確認する。
* seccompプロファイルが指定されない場合の挙動を確認する。
* seccompプロファイルの違反を確認する。
* きめ細やかなseccompプロファイルの作成方法を学ぶ。
* コンテナランタイムの標準seccompプロファイルを適用する方法を学ぶ。

## {{% heading "prerequisites" %}} 

このチュートリアルのステップを完了するためには、[kind](/docs/tasks/tools/#kind)と[kubectl](/docs/tasks/tools/#kubectl)をインストールしておく必要があります。

このチュートリアルで利用するコマンドは、[Docker](https://www.docker.com/)をコンテナランタイムとして利用していることを前提としています。
(`kind`が作成するクラスターは内部的に異なるコンテナランタイムを利用する可能性があります)。
[Podman](https://podman.io/)を使うこともできますが、チュートリアルを完了するためには、所定の[手順](https://kind.sigs.k8s.io/docs/user/rootless/)に従う必要があります。

このチュートリアルでは、現時点(v1.25以降)でのベータ機能を利用する設定例をいくつか示しますが、その他の例についてはGAなseccomp関連機能を用いています。
利用するKubernetesバージョンを対象としたクラスターの[正しい設定](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version)がなされていることを確認してください。

チュートリアル内では、サンプルをダウンロードするために`curl`を利用します。
この手順については、ほかの好きなツールを用いて実施してもかまいません。

{{< note >}}
`securityContext`に`privileged: true`が設定されているContainerに対しては、seccompプロファイルを適用することができません。
特権コンテナは常に`Unconfined`な状態で動作します。
{{< /note >}} 

<!-- steps --> 

## サンプルのseccompプロファイルをダウンロードする {#download-profiles}

プロファイルの内容については後で解説しますので、まずはクラスターで読み込むためのseccompプロファイルを`profiles/`ディレクトリ内にダウンロードしましょう。

{{< tabs name="tab_with_code" >}}
{{< tab name="audit.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/audit.json" %}}
{{< /tab >}}
{{< tab name="violation.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/violation.json" %}}
{{< /tab >}}
{{< tab name="fine-grained.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/fine-grained.json" %}}
{{< /tab >}}
{{< /tabs >}}

次のコマンドを実行してください:

```shell
mkdir ./profiles
curl -L -o profiles/audit.json https://k8s.io/examples/pods/security/seccomp/profiles/audit.json
curl -L -o profiles/violation.json https://k8s.io/examples/pods/security/seccomp/profiles/violation.json
curl -L -o profiles/fine-grained.json https://k8s.io/examples/pods/security/seccomp/profiles/fine-grained.json
ls profiles
```

最終的に3つのプロファイルが確認できるはずです:
```
audit.json  fine-grained.json  violation.json
```

## kindでローカルKubernetesクラスターを構築する {#create-a-local-kubernetes-cluster-with-kind}

手軽な方法として、[kind](https://kind.sigs.k8s.io/)を利用することで、seccompプロファイルを読み込んだ単一ノードクラスターを構築できます。
kindはKubernetesをDocker内で稼働させるため、クラスターの各ノードはコンテナとなります。
これにより、ノード上にファイルを展開するのと同じように、各コンテナのファイルシステムに対してファイルをマウントすることが可能です。

{{% code_sample file="pods/security/seccomp/kind.yaml" %}}

kindの設定サンプルをダウンロードして、`kind.yaml`の名前で保存してください:
```shell
curl -L -O https://k8s.io/examples/pods/security/seccomp/kind.yaml
```

ノードのコンテナイメージを設定する際には、特定のKubernetesバージョンを指定することもできます。
この設定方法の詳細については、kindのドキュメント内の、[ノード](https://kind.sigs.k8s.io/docs/user/configuration/#nodes)の項目を参照してください。
このチュートリアルではKubernetes {{< param "version" >}}を使用することを前提とします。

ベータ機能として、`Unconfined`にフォールバックするのではなく、{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}がデフォルトで推奨するプロファイルを利用するようにKubernetesを設定することもできます。
この機能を試したい場合、これ以降の手順に進む前に、[全ワークロードに対する標準seccompプロファイルとして`RuntimeDefault`を使用する](#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads)を参照してください。

kindの設定ファイルを設置したら、kindクラスターを作成します:

```shell
kind create cluster --config=kind.yaml
```

Kubernetesクラスターが準備できたら、単一ノードクラスターが稼働しているDockerコンテナを特定してください:

```shell
docker ps
```

`kind-control-plane`という名前のコンテナが稼働していることが確認できるはずです。
出力は次のようになるでしょう:

```
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
6a96207fed4b        kindest/node:v1.18.2   "/usr/local/bin/entr…"   27 seconds ago      Up 24 seconds       127.0.0.1:42223->6443/tcp   kind-control-plane
```

このコンテナのファイルシステムを観察すると、`profiles/`ディレクトリがkubeletのデフォルトのseccompパスとして正しく読み込まれていることを確認できるはずです。
Pod内でコマンドを実行するために`docker exec`を使います:

```shell
# 6a96207fed4bを"docker ps"で確認したコンテナIDに変更してください。
docker exec -it 6a96207fed4b ls /var/lib/kubelet/seccomp/profiles
```

```
audit.json  fine-grained.json  violation.json
```

kind内で稼働しているkubeletがseccompプロファイルを利用可能であることを確認しました。

## コンテナランタイムの標準seccompプロファイルを利用してPodを作成する {#create-a-pod-that-uses-the-container-runtime-default-seccomp-profile}

ほとんどのコンテナランタイムは、許可・拒否の対象とする標準的なシステムコールの集合を提供しています。

PodやContainerのセキュリティコンテキストでseccompタイプを`RuntimeDefault`に設定すると、コンテナランタイムが提供するデフォルトのプロファイルをワークロードに適用することができます。

{{< note >}}
`seccompDefault`の[設定](/docs/reference/config-api/kubelet-config.v1beta1/)を有効化している場合、他にseccompプロファイルを定義しなくても、Podは`RuntimeDefault` seccompプロファイルを使用します。
`seccompDefault`が無効の場合のデフォルトは`Unconfined`です。
{{< /note >}}

Pod内の全てのContainerに対して`RuntimeDefault` seccompプロファイルを要求するマニフェストは次のようなものです:

{{% code_sample file="pods/security/seccomp/ga/default-pod.yaml" %}}

このPodを作成してみます:
```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/default-pod.yaml
```

```shell
kubectl get pod default-pod
```

Podが正常に起動できていることを確認できるはずです:
```
NAME        READY   STATUS    RESTARTS   AGE
default-pod 1/1     Running   0          20s
```

次のセクションに進む前に、Podを削除します:

```shell
kubectl delete pod default-pod --wait --now
```

## システムコール監査のためのseccompプロファイルを利用してPodを作成する {#create-a-pod-with-a-seccomp-profile-for-syscall-auditing}

最初に、新しいPodにプロセスの全システムコールを記録するための`audit.json`プロファイルを適用します。

このPodのためのマニフェストは次の通りです:

{{% code_sample file="pods/security/seccomp/ga/audit-pod.yaml" %}}

{{< note >}}
過去のバージョンのKubernetesでは、{{< glossary_tooltip text="アノテーション" term_id="annotation" >}}を用いてseccompの挙動を制御することができました。
Kubernetes {{< skew currentVersion >}}におけるseccompの設定では`.spec.securityContext`フィールドのみをサポートしており、このチュートリアルではKubernetes {{< skew currentVersion >}}における手順を解説しています。
{{< /note >}}

クラスター内にPodを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/audit-pod.yaml
```

このプロファイルは、いかなるシステムコールも制限しないため、Podは正常に起動するはずです。

```shell
kubectl get pod audit-pod
```

```
NAME        READY   STATUS    RESTARTS   AGE
audit-pod   1/1     Running   0          30s
```

このコンテナが公開するエンドポイントとやりとりするために、kindのコントロールプレーンコンテナの内部からこのエンドポイントにアクセスできるように、NodePort {{< glossary_tooltip text="Service" term_id="service" >}}を作成します。

```shell
kubectl expose pod audit-pod --type NodePort --port 5678
```

どのポートがノード上のServiceに割り当てられたのかを確認しましょう。

```shell
kubectl get service audit-pod
```

次のような出力が得られます:
```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
audit-pod   NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

ここまで来れば、kindのコントロールプレーンコンテナの内部からエンドポイントに対して、Serviceが公開するポートを通じて`curl`で接続することができます。
`docker exec`を使って、コントロールプレーンコンテナに属するコンテナの中から`curl`を実行しましょう:

```shell
# 6a96207fed4bと32373を、それぞれ"docker ps"で確認したコンテナIDとポート番号に変更してください。
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

プロセスが実行されていることは確認できましたが、実際にどんなシステムコールが発行されているのでしょうか？
このPodはローカルクラスターで稼働しているため、発行されたシステムコールを`/var/log/syslog`で確認することができるはずです。
新しいターミナルを開いて、`http-echo`が発行するシステムコールを`tail`してみましょう:

```shell
# あなたのマシンのログは"/var/log/syslog"以外の場所にあるかもしれません。
tail -f /var/log/syslog | grep 'http-echo'
```

すでに`http-echo`が発行したいくつかのシステムコールのログが見えているはずです。
コントロールプレーンコンテナ内から再度`curl`を実行すると、新たにログに追記された内容が出力されます。

例えば、次のような出力が得られるでしょう:
```
Jul  6 15:37:40 my-machine kernel: [369128.669452] audit: type=1326 audit(1594067860.484:14536): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=51 compat=0 ip=0x46fe1f code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669453] audit: type=1326 audit(1594067860.484:14537): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=54 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669455] audit: type=1326 audit(1594067860.484:14538): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669456] audit: type=1326 audit(1594067860.484:14539): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=288 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669517] audit: type=1326 audit(1594067860.484:14540): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=0 compat=0 ip=0x46fd44 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669519] audit: type=1326 audit(1594067860.484:14541): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671648] audit: type=1326 audit(1594067920.488:14559): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671726] audit: type=1326 audit(1594067920.488:14560): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
```

各行の`syscall=`エントリに着目することで、`http-echo`プロセスが必要とするシステムコールを理解していくことができるでしょう。
このプロセスが利用する全てのシステムコールを網羅するものではないかもしれませんが、このコンテナのseccompプロファイルを作成する上での基礎とすることは可能です。

次のセクションに進む前にServiceとPodを削除します:

```shell
kubectl delete service audit-pod --wait
kubectl delete pod audit-pod --wait --now
```

## 違反が発生するseccompプロファイルでPodを作成する {#create-a-pod-with-a-seccomp-profile-that-causes-violation}


デモとして、いかなるシステムコールも許可しないseccompプロファイルをPodに適用してみましょう。

マニフェストは次の通りです:

{{% code_sample file="pods/security/seccomp/ga/violation-pod.yaml" %}}

クラスターにPodを作成してみます:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/violation-pod.yaml
```

Podを作成しても問題が発生します。
Podの状態を確認すると、起動に失敗していることが確認できるはずです。

```shell
kubectl get pod violation-pod
```

```
NAME            READY   STATUS             RESTARTS   AGE
violation-pod   0/1     CrashLoopBackOff   1          6s
```


直前の事例で見てきたように、`http-echo`プロセスは多くのシステムコールを必要とします。
ここでは`"defaultAction": "SCMP_ACT_ERRNO"`が設定されているため、あらゆるシステムコールに対してseccompがエラーを発生させました。

この構成はとてもセキュアですが、有意義な処理は何もできないことを意味します。
私たちが実際にやりたいのは、ワークロードが必要とする権限のみを付与することです。

次のセクションに進む前にPodを削除します。

```shell
kubectl delete pod violation-pod --wait --now
```

## 必要なシステムコールのみを許可するseccompプロファイルを用いてPodを作成する {#create-a-pod-with-a-seccomp-profile-that-only-allows-necessary-syscalls}

`fine-grained.json`プロファイルの内容を見れば、最初の例で`"defaultAction":"SCMP_ACT_LOG"`を設定していた際に、ログに表示されたシステムコールが含まれていることに気づくでしょう。
今回のプロファイルでも`"defaultAction": "SCMP_ACT_ERRNO"`を設定しているものの、`"action": "SCMP_ACT_ALLOW"`ブロックで明示的に一連のシステムコールを許可しています。
理想的な状況下であれば、コンテナが正常に稼働することに加え、`syslog`へのメッセージ送信を見ることはなくなるでしょう。

この事例のマニフェストは次の通りです:

{{% code_sample file="pods/security/seccomp/ga/fine-pod.yaml" %}}

クラスター内にPodを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/fine-pod.yaml
```

```shell
kubectl get pod fine-pod
```

Podは正常に起動しているはずです:

```
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s
```

新しいターミナルを開いて、`http-echo`からのシステムコールに関するログエントリを`tail`で監視しましょう:

```shell
# あなたのマシンのログは"/var/log/syslog"以外の場所にあるかもしれません。
tail -f /var/log/syslog | grep 'http-echo'
```

次のPodをNodePort Serviceで公開します:

```shell
kubectl expose pod fine-pod --type NodePort --port 5678
```

ノード上のServiceに割り当てられたポートを確認します:

```shell
kubectl get service fine-pod
```

出力は次のようになるでしょう:
```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

kindのコントロールプレーンコンテナの内部から、`curl`を用いてエンドポイントにアクセスします:

```shell
# 6a96207fed4bと32373を、それぞれ"docker ps"で確認したコンテナIDとポート番号に変更してください。
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

`syslog`には何も出力されないはずです。
なぜなら、このプロファイルは必要なシステムコールを全て許可しており、一覧にないシステムコールが呼び出された時にのみエラーを発生させるように構成しているためです。
これはセキュリティの観点からすると理想的なシチュエーションといえますが、seccompプロファイルを作成するためのプログラムの解析には多少の労力が必要です。
多くの労力を割かなくてもこれに近いセキュリティが得られるシンプルな手法があったなら、きっと素晴らしいものになるでしょう。

次のセクションに進む前にServiceとPodを削除します:

```shell
kubectl delete service fine-pod --wait
kubectl delete pod fine-pod --wait --now
```

## 全ワークロードに対する標準seccompプロファイルとして`RuntimeDefault`を使用する {#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads}

{{< feature-state state="stable" for_k8s_version="v1.27" >}}

標準seccompプロファイルを指定するためには、この機能を利用したい全てのノードで`--seccomp-default`[コマンドラインフラグ](/docs/reference/command-line-tools-reference/kubelet/)を用いてkubeletを起動する必要があります。

この機能を有効化すると、kubeletはコンテナランタイムが定義する`RuntimeDefault`のseccompプロファイルをデフォルトで使用するようになり、`Unconfined`モード(seccomp無効化)になることはありません。
コンテナランタイムが用意する標準プロファイルは、ワークロードの機能性を維持しつつ、強力な標準セキュリティルールの一式を用意することを目指しています。
標準のプロファイルはコンテナランタイムやリリースバージョンによって異なる可能性があります。
例えば、CRI-Oとcontainerdの標準プロファイルを比較してみるとよいでしょう。

{{< note >}}
この機能を有効化しても、PodやContainerなどの`securityContext.seccompProfile`フィールドは変更されず、非推奨のアノテーションがワークロードに追加されることもありません。
したがって、ユーザーはワークロードの設定を変更せずにロールバックすることが可能です。
[`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools)のようなツールを使うことで、コンテナがどのseccompプロファイルを利用しているのかを確認できます。
{{< /note >}}

いくつかのワークロードでは、他のワークロードよりもシステムコール制限を少なくすることが必要な場合があります。
つまり、`RuntimeDefault`を適用する場合、こうしたワークロードの実行が失敗する可能性があります。
このような障害を緩和するために、次のような対策を講じることができます:

- ワークロードを明示的に`Unconfined`として稼働させる。
- `SeccompDefault`機能をノードで無効化する。
また、機能を無効化したノードに対してワークロードが配置されていることを確認しておく。
- ワークロードを対象とするカスタムseccompプロファイルを作成する。

実運用環境に近いクラスターに対してこの機能を展開する場合、クラスター全体に対して変更をロールアウトする前に、一部ノードのみを対象にしてこのフィーチャーゲートを有効化し、ワークロードが実行できることを検証しておくことをお勧めします。

クラスターに対してとりうるアップグレード・ダウングレード戦略について更に詳細な情報を知りたい場合は、関連するKubernetes Enhancement Proposal (KEP)である[Enable seccomp by default](https://github.com/kubernetes/enhancements/tree/9a124fd29d1f9ddf2ff455c49a630e3181992c25/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy)を参照してください。

Kubernetes {{< skew currentVersion >}}では、specで特定のseccompプロファイルを指定していないPodに対して、デフォルトで適用するseccompプロファイルを設定することができます。
ただし、この標準seccompプロファイルを利用する場合、対象とする全ノードでこの機能を有効化しておく必要があります。

稼働中のKubernetes {{< skew currentVersion >}}クラスターでこの機能を有効化する場合、kubeletに`--seccomp-default`コマンドラインフラグを付与して起動するか、[Kubernetesの設定ファイル](/docs/tasks/administer-cluster/kubelet-config-file/)でこの機能を有効化する必要があります。
このフィーチャーゲートを[kind](https://kind.sigs.k8s.io)で有効化する場合、`kind`が最低限必要なKubernetesバージョンを満たしていて、かつ[kindの設定ファイル](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster)で`SeccompDefault`を有効化してください:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
  - role: worker
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
```

クラスターの準備ができたら、Podを実行します:

```shell
kubectl run --rm -it --restart=Never --image=alpine alpine -- sh
```

このコマンドで標準のseccompプロファイルを紐付けられるはずです。
この結果を確認するには、`docker exec`経由で`crictl inspect`を実行することで、kindワーカー上のコンテナを確認します:

```shell
docker exec -it kind-worker bash -c \
    'crictl inspect $(crictl ps --name=alpine -q) | jq .info.runtimeSpec.linux.seccomp'
```

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_X86", "SCMP_ARCH_X32"],
  "syscalls": [
    {
      "names": ["..."]
    }
  ]
}
```

## {{% heading "whatsnext" %}}

Linuxのseccompについて更に学びたい場合は、次の記事を参考にすると良いでしょう:

* [A seccomp Overview](https://lwn.net/Articles/656307/)
* [Seccomp Security Profiles for Docker](https://docs.docker.com/engine/security/seccomp/)
