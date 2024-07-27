---
layout: blog
title: "Kubernetesにおけるフォレンジックコンテナチェックポイント処理"
date: 2022-12-05
slug: forensic-container-checkpointing-alpha
author: >
  Adrian Reber (Red Hat)
---

フォレンジックコンテナチェックポイント処理は[Checkpoint/Restore In Userspace](https://criu.org/) (CRIU)に基づいており、コンテナがチェックポイントされていることを認識することなく、実行中のコンテナのステートフルコピーを作成することができます。
コンテナのコピーは、元のコンテナに気づかれることなく、サンドボックス環境で複数回の分析やリストアが可能です。
フォレンジックコンテナチェックポイント処理はKubernetes v1.25でalpha機能として導入されました。

## どのように機能しますか？

CRIUを使用してコンテナのチェックポイントやリストアを行うことが可能です。
CRIUはruncやcrun、CRI-O、containerdと統合されており、Kubernetesで実装されているフォレンジックコンテナチェックポイント処理は、既存のCRIU統合を使用します。

## なぜ重要なのか？

CRIUと対応する統合機能を使用することで、後でフォレンジック分析を行うために、ディスク上で実行中のコンテナに関する全ての情報と状態を取得することが可能です。
フォレンジック分析は、疑わしいコンテナを停止したり影響を与えることなく検査するために重要となる場合があります。
コンテナが本当に攻撃を受けている場合、攻撃者はコンテナを検査する処理を検知するかもしれません。
チェックポイントを取得しサンドボックス環境でコンテナを分析することは、元のコンテナや、おそらく攻撃者にも検査を認識されることなく、コンテナを検査することができる可能性があります。

フォレンジックコンテナチェックポイント処理のユースケースに加えて、内部状態を失うことなく、あるノードから他のノードにコンテナを移行することも可能です。
特に初期化時間の長いステートフルコンテナの場合、チェックポイントからリストアすることは再起動後の時間が節約されるか、起動時間がより早くなる可能性があります。

## コンテナチェックポイント処理を利用するには？

機能は[フィーチャーゲート][container-checkpoint-feature-gate]で制限されているため、新しい機能を使用する前に`ContainerCheckpoint`を有効にしてください。

ランタイムがコンテナチェックポイント処理をサポートしている必要もあります。

* containerd: サポートは現在検討中です。詳細はcontainerdプルリクエスト[#6965][containerd-checkpoint-restore-pr]を見てください。
* CRI-O: v1.25はフォレンジックコンテナチェックポイント処理をサポートしています。

[containerd-checkpoint-restore-pr]: https://github.com/containerd/containerd/pull/6965
[container-checkpoint-feature-gate]: https://kubernetes.io/ja/docs/reference/command-line-tools-reference/feature-gates/

### CRI-Oでの使用例

CRI-Oとの組み合わせでフォレンジックコンテナチェックポイント処理を使用するためには、ランタイムをコマンドラインオプション`--enable-criu-support=true`で起動する必要があります。
Kubernetesでは、`ContainerCheckpoint`フィーチャーゲートを有効にしたクラスターを実行する必要があります。
チェックポイント処理の機能はCRIUによって提供されているため、CRIUをインストールすることも必要となります。
通常、runcやcrunはCRIUに依存しているため、自動的にインストールされます。

執筆時点ではチェックポイント機能はCRI-OやKubernetesにおいてalpha機能としてみなされており、セキュリティ影響がまだ検討中であることに言及することも重要です。

コンテナとPodが実行されると、チェックポイントを作成することが可能になります。
[チェックポイント処理](https://kubernetes.io/docs/reference/node/kubelet-checkpoint-api/)は**kubelet**レベルでのみ公開されています。
コンテナをチェックポイントするためには、コンテナが実行されているノード上で`curl`を実行し、チェックポイントをトリガーします。

```shell
curl -X POST "https://localhost:10250/checkpoint/namespace/podId/container"
```

*default*名前空間内の*counters*と呼ばれるPod内の*counter*と呼ばれるコンテナに対し、**kubelet** APIエンドポイントが次の場所で到達可能です。

```shell
curl -X POST "https://localhost:10250/checkpoint/default/counters/counter"
```

厳密には、kubeletの自己署名証明書を許容し、kubeletチェックポイントAPIの使用を認可するために、下記のcurlコマンドのオプションが必要です。

```shell
--insecure --cert /var/run/kubernetes/client-admin.crt --key /var/run/kubernetes/client-admin.key
```

この**kubelet** APIが実行されると、CRI-Oからチェックポイントの作成をリクエストします。
CRI-Oは低レベルランタイム(例えば`runc`)からチェックポイントをリクエストします。
そのリクエストを確認すると、`runc`は実際のチェックポイントを行うために`criu`ツールを呼び出します。

チェックポイント処理が終了すると、チェックポイントは`/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`で利用可能になります。

その後、そのtarアーカイブを使用してコンテナを別の場所にリストアできます。

### Kubernetesの外部でチェックポイントしたコンテナをリストアする(CRI-Oを使用) {#restore-checkpointed-container-standalone}

チェックポイントtarアーカイブを使用すると、CRI-Oのサンドボックスインスタンス内のKubernetesの外部にコンテナをリストア可能です。
リストア中のより良いユーザエクスペリエンスのために、*main* CRI-O GitHubブランチからCRI-Oのlatestバージョンを使用することを推奨します。
CRI-O v1.25を使用している場合、コンテナを開始する前にKubernetesが作成する特定のディレクトリを手動で作成する必要があります。

Kubernetesの外部にコンテナをリストアするための最初のステップは、*crictl*を使用してPodサンドボックスを作成することです。

```shell
crictl runp pod-config.json
```

次に、さきほどチェックポイントしたコンテナを新しく作成したPodサンドボックスにリストアします。

```shell
crictl create <POD_ID> container-config.json pod-config.json
```

`container-config.json`のレジストリでコンテナイメージを指定する代わりに、前に作成したチェックポイントアーカイブへのパスを指定する必要があります。

```json
{
  "metadata": {
      "name": "counter"
  },
  "image":{
      "image": "/var/lib/kubelet/checkpoints/<checkpoint-archive>.tar"
  }
}
```

次に、そのコンテナを開始するために`crictl start <CONTAINER_ID>`を実行すると、さきほどチェックポイントしたコンテナのコピーが実行されているはずです。

### Kubernetes内でチェックポイントしたコンテナをリストアする {#restore-checkpointed-container-k8s}

先ほどチェックポイントしたコンテナをKubernetes内で直接リストアするためには、レジストリにプッシュできるイメージにチェックポイントアーカイブを変換する必要があります。

ローカルのチェックポイントアーカイブを変換するための方法として、[buildah](https://buildah.io/)を使用した下記のステップが考えられます。

```shell
newcontainer=$(buildah from scratch)
buildah add $newcontainer /var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar /
buildah config --annotation=io.kubernetes.cri-o.annotations.checkpoint.name=<container-name> $newcontainer
buildah commit $newcontainer checkpoint-image:latest
buildah rm $newcontainer
```

出来上がったイメージは標準化されておらず、CRI-Oとの組み合わせでのみ動作します。
このイメージはalphaにも満たないフォーマットであると考えてください。
このようなチェックポイントイメージのフォーマットを標準化するための[議論][image-spec-discussion]が進行中です。
これはまだ標準化されたイメージフォーマットではなく、CRI-Oを`--enable-criu-support=true`で起動した場合のみ動作することを忘れないでください。
CRIUサポートでCRI-Oを起動することのセキュリティ影響はまだ明確ではなく、そのため、イメージフォーマットだけでなく機能も気を付けて使用するべきです。

さて、そのイメージをコンテナイメージレジストリにプッシュする必要があります。
例えば以下のような感じです。

```shell
buildah push localhost/checkpoint-image:latest container-image-registry.example/user/checkpoint-image:latest
```

このチェックポイントイメージ(`container-image-registry.example/user/checkpoint-image:latest`)をリストアするために、イメージはPodの仕様(Specification)に記載する必要があります。
以下はマニフェストの例です。

```yaml
apiVersion: v1
kind: Pod
metadata:
  namePrefix: example-
spec:
  containers:
  - name: <container-name>
    image: container-image-registry.example/user/checkpoint-image:latest
  nodeName: <destination-node>
```

Kubernetesは新しいPodをノード上にスケジュールします。
そのノード上のKubeletは、`registry/user/checkpoint-image:latest`として指定されたイメージをもとに、コンテナを作成し開始するようにコンテナランタイム(この例ではCRI-O)に指示をします。
CRI-Oは`registry/user/checkpoint-image:latest`がコンテナイメージでなく、チェックポイントデータへの参照であることを検知します。
その時、コンテナを作成し開始する通常のステップの代わりに、CRI-Oはチェックポイントデータをフェッチし、指定されたチェックポイントからコンテナをリストアします。

Pod内のアプリケーションはチェックポイントを取得しなかったかのように実行し続けます。
コンテナ内では、アプリケーションはチェックポイントからリストアされず通常起動したコンテナのような見た目や動作をします。

これらのステップで、あるノードで動作しているPodを、別のノードで動作している新しい同等のPodに置き換えることができ、そのPod内のコンテナの状態を失うことはないです。

[image-spec-discussion]: https://github.com/opencontainers/image-spec/issues/962

## どのように参加すればよいですか？

SIG Nodeにはいくつかの手段でアクセスすることができます。
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [メーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

## さらなる読み物

コンテナチェックポイントの分析方法に関する詳細は後続のブログ[Forensic container analysis][forensic-container-analysis]を参照してください。

[forensic-container-analysis]: /blog/2023/03/10/forensic-container-analysis/
