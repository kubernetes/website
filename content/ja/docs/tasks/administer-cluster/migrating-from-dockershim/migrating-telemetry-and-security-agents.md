---
title: dockershimからテレメトリーやセキュリティエージェントを移行する
content_type: task
weight: 60
---

<!-- overview -->

Kubernetes 1.20でdockershimは非推奨になりました。

[dockershimの削除に関するFAQ](/ja/dockershim)から、ほとんどのアプリがコンテナをホストするランタイムに直接依存しないことは既にご存知かもしれません。
しかし、コンテナのメタデータやログ、メトリクスを収集するためにDockerに依存しているテレメトリーやセキュリティエージェントはまだ多く存在します。
この文書では、これらの依存関係を検出する方法と、これらのエージェントを汎用ツールまたは代替ランタイムに移行する方法に関するリンクを集約しています。

## テレメトリーとセキュリティエージェント

Kubernetesクラスター上でエージェントを実行するには、いくつかの方法があります。エージェントはノード上で直接、またはDaemonSetとして実行することができます。

### テレメトリーエージェントがDockerに依存する理由とは？

歴史的には、KubernetesはDockerの上に構築されていました。
Kubernetesはネットワークとスケジューリングを管理し、Dockerはコンテナをノードに配置して操作していました。
そのため、KubernetesからはPod名などのスケジューリング関連のメタデータを、Dockerからはコンテナの状態情報を取得することができます。
時が経つにつれ、コンテナを管理するためのランタイムも増えてきました。
また、多くのランタイムにまたがるコンテナ状態情報の抽出を一般化するプロジェクトやKubernetesの機能もあります。

いくつかのエージェントはDockerツールに関連しています。
エージェントは[`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)や[`docker top`](https://docs.docker.com/engine/reference/commandline/top/)といったコマンドを実行し、コンテナやプロセスの一覧を表示します。
または[docker logs](https://docs.docker.com/engine/reference/commandline/logs/)を使えば、dockerログを購読することができます。

Dockerがコンテナランタイムとして非推奨になったため、これらのコマンドはもう使えません。

### Dockerに依存するDaemonSetの特定 {#identify-docker-dependency}

Podがノード上で動作している`dockerd`を呼び出したい場合、Podは以下のいずれかを行う必要があります。

- Dockerデーモンの特権ソケットがあるファイルシステムを{{< glossary_tooltip text="volume" term_id="volume" >}}のようにマウントする。

- Dockerデーモンの特権ソケットの特定のパスを直接ボリュームとしてマウントします。

例: COSイメージでは、DockerはそのUnixドメインソケットを`/var/run/docker.sock`に公開します。
つまり、Pod仕様には`/var/run/docker.sock`の`hostPath`ボリュームマウントが含まれることになります。

以下は、Dockerソケットを直接マッピングしたマウントを持つPodを探すためのシェルスクリプトのサンプルです。

このスクリプトは、Podの名前空間と名前を出力します。

`grep '/var/run/docker.sock'`を削除して、他のマウントを確認することもできます。

```bash
kubectl get pods --all-namespaces \
-o=jsonpath='{range .items[*]}{"\n"}{.metadata.namespace}{":\t"}{.metadata.name}{":\t"}{range .spec.volumes[*]}{.hostPath.path}{", "}{end}{end}' \
| sort \
| grep '/var/run/docker.sock'
```

{{< note >}}
Podがホスト上のDockerにアクセスするための代替方法があります。
例えば、フルパスの代わりに親ディレクトリ`/var/run`をマウントすることができます([この例](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd) のように)。
上記のスクリプトは、最も一般的な使用方法のみを検出します。
{{< /note >}}

### ノードエージェントからDockerの依存性を検出する

クラスターノードをカスタマイズし、セキュリティやテレメトリーのエージェントをノードに追加インストールする場合、エージェントのベンダーにDockerへの依存性があるかどうかを必ず確認してください。

### テレメトリーとセキュリティエージェントのベンダー

様々なテレメトリーおよびセキュリティエージェントベンダーのための移行指示の作業中バージョンを[Google doc](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#)に保管しています。
dockershimからの移行に関する最新の手順については、各ベンダーにお問い合わせください。
