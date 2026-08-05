---
title: dockershim削除の影響範囲を確認する
content_type: task
weight: 50
---

<!-- overview -->
Kubernetesの`dockershim`コンポーネントは、DockerをKubernetesの{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}として使用することを可能にします。

Kubernetesの組み込みコンポーネントである`dockershim`はリリースv1.24で削除されました。

このページでは、あなたのクラスターがどのようにDockerをコンテナランタイムとして使用しているか、使用中の`dockershim`が果たす役割について詳しく説明し、`dockershim`の削除によって影響を受けるワークロードがあるかどうかをチェックするためのステップを示します。

## 自分のアプリがDockerに依存しているかどうかの確認 {#find-docker-dependencies}

アプリケーションコンテナの構築にDockerを使用している場合でも、これらのコンテナを任意のコンテナランタイム上で実行することができます。このようなDockerの使用は、コンテナランタイムとしてのDockerへの依存とはみなされません。

代替のコンテナランタイムが使用されている場合、Dockerコマンドを実行しても動作しないか、予期せぬ出力が得られる可能性があります。

このように、Dockerへの依存があるかどうかを調べることができます:

1. 特権を持つPodがDockerコマンド(`docker ps`など)を実行したり、Dockerサービスを再起動したり(`systemctl restart docker.service`などのコマンド)、Docker固有のファイル(`/etc/docker/daemon.json`など)を変更しないことを確認すること。
1. Dockerの設定ファイル(`/etc/docker/daemon.json` など)にプライベートレジストリやイメージミラーの設定がないか確認します。これらは通常、別のコンテナランタイムのために再設定する必要があります。
1. Kubernetesインフラストラクチャーの外側のノードで実行される以下のようなスクリプトやアプリがDockerコマンドを実行しないことを確認します。
   - トラブルシューティングのために人間がノードにSSHで接続
   - ノードのスタートアップスクリプト
   - ノードに直接インストールされた監視エージェントやセキュリティエージェント
1. 上記のような特権的な操作を行うサードパーティツール。詳しくは[Migrating telemetry and security agents from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents) を参照してください。
1. dockershimの動作に間接的な依存性がないことを確認します。
   これはエッジケースであり、あなたのアプリケーションに影響を与える可能性は低いです。ツールによっては、Docker固有の動作に反応するように設定されている場合があります。例えば、特定のメトリクスでアラートを上げたり、トラブルシューティングの指示の一部として特定のログメッセージを検索したりします。そのようなツールを設定している場合、移行前にテストクラスターで動作をテストしてください。

## Dockerへの依存について解説 {#role-of-dockershim}

[コンテナランタイム](/ja/docs/concepts/containers/#container-runtimes)とは、Kubernetes Podを構成するコンテナを実行できるソフトウェアです。

KubernetesはPodのオーケストレーションとスケジューリングを担当し、各ノードでは{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}がコンテナランタイムインターフェースを抽象化して使用するので、互換性があればどのコンテナランタイムでも使用することができます。
初期のリリースでは、Kubernetesは1つのコンテナランタイムと互換性を提供していました: Dockerです。
その後、Kubernetesプロジェクトの歴史の中で、クラスター運用者は追加のコンテナランタイムを採用することを希望しました。
CRIはこのような柔軟性を可能にするために設計され、kubeletはCRIのサポートを開始しました。
しかし、DockerはCRI仕様が考案される前から存在していたため、Kubernetesプロジェクトはアダプタコンポーネント「dockershim」を作成しました。

dockershimアダプターは、DockerがCRI互換ランタイムであるかのように、kubeletがDockerと対話することを可能にします。
[Kubernetes Containerd integration goes GA](/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/)ブログ記事で紹介されています。

![Dockershim vs. CRI with Containerd](/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/cri-containerd.png)

コンテナランタイムとしてContainerdに切り替えることで、中間マージンを排除することができます。
これまでと同じように、Containerdのようなコンテナランタイムですべてのコンテナを実行できます。
しかし今は、コンテナはコンテナランタイムで直接スケジュールするので、Dockerからは見えません。
そのため、これらのコンテナをチェックするために以前使っていたかもしれないDockerツールや派手なUIは、もはや利用できません。
`docker ps`や`docker inspect`を使用してコンテナ情報を取得することはできません。
コンテナを一覧表示できないので、ログを取得したり、コンテナを停止したり、`docker exec`を使用してコンテナ内で何かを実行したりすることもできません。

{{< note >}}

Kubernetes経由でワークロードを実行している場合、コンテナを停止する最善の方法は、コンテナランタイムを直接経由するよりもKubernetes APIを経由することです(このアドバイスはDockerだけでなく、すべてのコンテナランタイムに適用されます)。

{{< /note >}}

この場合でも、イメージを取得したり、`docker build`コマンドを使用してビルドすることは可能です。
しかし、Dockerによってビルドまたはプルされたイメージは、コンテナランタイムとKubernetesからは見えません。
Kubernetesで使用できるようにするには、何らかのレジストリにプッシュする必要がありました。
