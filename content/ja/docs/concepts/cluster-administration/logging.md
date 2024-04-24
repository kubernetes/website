---
title: ロギングのアーキテクチャ
content_type: concept
weight: 60
---

<!-- overview -->

アプリケーションログは、アプリケーション内で何が起こっているかを理解するのに役立ちます。ログは、問題のデバッグとクラスターアクティビティの監視に特に役立ちます。最近のほとんどのアプリケーションには、何らかのロギングメカニズムがあります。同様に、コンテナエンジンはロギングをサポートするように設計されています。コンテナ化されたアプリケーションで、最も簡単で最も採用されているロギング方法は、標準出力と標準エラーストリームへの書き込みです。

ただし、コンテナエンジンまたはランタイムによって提供されるネイティブ機能は、たいていの場合、完全なロギングソリューションには十分ではありません。

たとえば、コンテナがクラッシュした場合やPodが削除された場合、またはノードが停止した場合に、アプリケーションのログにアクセスしたい場合があります。

クラスターでは、ノードやPod、またはコンテナに関係なく、ノードに個別のストレージとライフサイクルが必要です。この概念は、_クラスターレベルロギング_ と呼ばれます。

<!-- body -->

クラスターレベルロギングのアーキテクチャでは、ログを保存、分析、およびクエリするための個別のバックエンドが必要です。Kubernetesは、ログデータ用のネイティブストレージソリューションを提供していません。代わりに、Kubernetesに統合される多くのロギングソリューションがあります。次のセクションでは、ノードでログを処理および保存する方法について説明します。

## Kubernetesでの基本的なロギング {#basic-logging-in-kubernetes}

この例では、1秒に1回標準出力ストリームにテキストを書き込むコンテナを利用する、`Pod` specificationを使います。

{{% codenew file="debug/counter-pod.yaml" %}}

このPodを実行するには、次のコマンドを使用します:

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```

出力は次のようになります:

```console
pod/counter created
```

ログを取得するには、以下のように`kubectl logs`コマンドを使用します:

```shell
kubectl logs counter
```

出力は次のようになります:

```console
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

コンテナの以前のインスタンスからログを取得するために、`kubectl logs --previous`を使用できます。Podに複数のコンテナがある場合は、次のように-cフラグでコマンドにコンテナ名を追加することで、アクセスするコンテナのログを指定します。

```console
kubectl logs counter -c count
```

詳細については、[`kubectl logs`ドキュメント](/docs/reference/generated/kubectl/kubectl-commands#logs)を参照してください。

## ノードレベルでのロギング {#logging-at-the-node-level}

![Node level logging](/images/docs/user-guide/logging/logging-node-level.png)

コンテナエンジンは、生成された出力を処理して、コンテナ化されたアプリケーションの`stdout`と`stderr`ストリームにリダイレクトします。たとえば、Dockerコンテナエンジンは、これら2つのストリームを[ロギングドライバー](https://docs.docker.com/engine/admin/logging/overview)にリダイレクトします。ロギングドライバーは、JSON形式でファイルに書き込むようにKubernetesで設定されています。

{{< note >}}
Docker JSONロギングドライバーは、各行を個別のメッセージとして扱います。Dockerロギングドライバーを使用する場合、複数行メッセージを直接サポートすることはできません。ロギングエージェントレベルあるいはそれ以上のレベルで、複数行のメッセージを処理する必要があります。
{{< /note >}}

デフォルトでは、コンテナが再起動すると、kubeletは1つの終了したコンテナをログとともに保持します。Podがノードから削除されると、対応する全てのコンテナが、ログとともに削除されます。

ノードレベルロギングでの重要な考慮事項は、ノードで使用可能な全てのストレージをログが消費しないように、ログローテーションを実装することです。Kubernetesはログのローテーションを担当しませんが、デプロイツールでそれに対処するソリューションを構築する必要があります。たとえば、`kube-up.sh`スクリプトによってデプロイされたKubernetesクラスターには、1時間ごとに実行するように構成された[`logrotate`](https://linux.die.net/man/8/logrotate)ツールがあります。アプリケーションのログを自動的にローテーションするようにコンテナランタイムを構築することもできます。

例として、[`configure-helper` script](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh)に対応するスクリプトである`kube-up.sh`が、どのようにGCPでCOSイメージのロギングを構築しているかについて、詳細な情報を見つけることができます。

**CRIコンテナランタイム**を使用する場合、kubeletはログのローテーションとログディレクトリ構造の管理を担当します。kubeletはこの情報をCRIコンテナランタイムに送信し、ランタイムはコンテナログを指定された場所に書き込みます。2つのkubeletパラメーター、[`container-log-max-size`と`container-log-max-files`](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)を[kubelet設定ファイル](/docs/tasks/administer-cluster/kubelet-config-file/)で使うことで、各ログファイルの最大サイズと各コンテナで許可されるファイルの最大数をそれぞれ設定できます。

基本的なロギングの例のように、[`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs)を実行すると、ノード上のkubeletがリクエストを処理し、ログファイルから直接読み取ります。kubeletはログファイルの内容を返します。

{{< note >}}
外部システムがローテーションを実行した場合、またはCRIコンテナランタイムが使用されている場合は、最新のログファイルの内容のみが`kubectl logs`で利用可能になります。例えば、10MBのファイルがある場合、`logrotate`によるローテーションが実行されると、2つのファイルが存在することになります: 1つはサイズが10MBのファイルで、もう1つは空のファイルです。この例では、`kubectl logs`は最新のログファイルの内容、つまり空のレスポンスを返します。
{{< /note >}}

### システムコンポーネントログ {#system-component-logs}

システムコンポーネントには、コンテナ内で実行されるものとコンテナ内で実行されないものの2種類があります。例えば以下のとおりです。

* Kubernetesスケジューラーとkube-proxyはコンテナ内で実行されます。
* kubeletとコンテナランタイムはコンテナ内で実行されません。

systemdを搭載したマシンでは、kubeletとコンテナランタイムがjournaldに書き込みます。systemdが存在しない場合、kubeletとコンテナランタイムは`var/log`ディレクトリ内の`.log`ファイルに書き込みます。コンテナ内のシステムコンポーネントは、デフォルトのロギングメカニズムを迂回して、常に`/var/log`ディレクトリに書き込みます。それらは[`klog`](https://github.com/kubernetes/klog)というロギングライブラリを使用します。これらのコンポーネントのロギングの重大性に関する規則は、[development docs on logging](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)に記載されています。

コンテナログと同様に、`/var/log`ディレクトリ内のシステムコンポーネントログはローテーションする必要があります。`kube-up.sh`スクリプトによって生成されたKubernetesクラスターでは、これらのログは、`logrotate`ツールによって毎日、またはサイズが100MBを超えた時にローテーションされるように設定されています。

## クラスターレベルロギングのアーキテクチャ {#cluster-level-logging-architectures}

Kubernetesはクラスターレベルロギングのネイティブソリューションを提供していませんが、検討可能な一般的なアプローチがいくつかあります。ここにいくつかのオプションを示します:

* 全てのノードで実行されるノードレベルのロギングエージェントを使用します。
* アプリケーションのPodにログインするための専用のサイドカーコンテナを含めます。
* アプリケーション内からバックエンドに直接ログを送信します。

### ノードロギングエージェントの使用 {#using-a-node-logging-agent}

![Using a node level logging agent](/images/docs/user-guide/logging/logging-with-node-agent.png)

各ノードに _ノードレベルのロギングエージェント_ を含めることで、クラスターレベルロギングを実装できます。ロギングエージェントは、ログを公開したり、ログをバックエンドに送信したりする専用のツールです。通常、ロギングエージェントは、そのノード上の全てのアプリケーションコンテナからのログファイルを含むディレクトリにアクセスできるコンテナです。

ロギングエージェントは全てのノードで実行する必要があるため、エージェントを`DaemonSet`として実行することをおすすめします。

ノードレベルのロギングは、ノードごとに1つのエージェントのみを作成し、ノードで実行されているアプリケーションに変更を加える必要はありません。

コンテナはstdoutとstderrに書き込みますが、合意された形式はありません。ノードレベルのエージェントはこれらのログを収集し、集約のために転送します。

### ロギングエージェントでサイドカーコンテナを使用する {#sidecar-container-with-logging-agent}

サイドカーコンテナは、次のいずれかの方法で使用できます:

* サイドカーコンテナは、アプリケーションログを自身の`stdout`にストリーミングします。
* サイドカーコンテナは、アプリケーションコンテナからログを取得するように設定されたロギングエージェントを実行します。

#### ストリーミングサイドカーコンテナ {#streaming-sidecar-container}

![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

サイドカーコンテナに自身の`stdout`や`stderr`ストリームへの書き込みを行わせることで、各ノードですでに実行されているkubeletとロギングエージェントを利用できます。サイドカーコンテナは、ファイル、ソケット、またはjournaldからログを読み取ります。各サイドカーコンテナは、ログを自身の`stdout`または`stderr`ストリームに出力します。

このアプローチにより、`stdout`または`stderr`への書き込みのサポートが不足している場合も含め、アプリケーションのさまざまな部分からいくつかのログストリームを分離できます。ログのリダイレクトの背後にあるロジックは最小限であるため、大きなオーバーヘッドにはなりません。さらに、`stdout`と`stderr`はkubeletによって処理されるため、`kubectl logs`のような組み込みツールを使用できます。

たとえば、Podは単一のコンテナを実行し、コンテナは2つの異なる形式を使用して2つの異なるログファイルに書き込みます。Podの構成ファイルは次のとおりです:

{{% codenew file="admin/logging/two-files-counter-pod.yaml" %}}

両方のコンポーネントをコンテナの`stdout`ストリームにリダイレクトできたとしても、異なる形式のログエントリを同じログストリームに書き込むことはおすすめしません。代わりに、2つのサイドカーコンテナを作成できます。各サイドカーコンテナは、共有ボリュームから特定のログファイルを追跡し、ログを自身の`stdout`ストリームにリダイレクトできます。

2つのサイドカーコンテナを持つPodの構成ファイルは次のとおりです:

{{% codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" %}}

これで、このPodを実行するときに、次のコマンドを実行して、各ログストリームに個別にアクセスできます:

```shell
kubectl logs counter count-log-1
```

出力は次のようになります:

```console
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

```shell
kubectl logs counter count-log-2
```

出力は次のようになります:

```console
Mon Jan  1 00:00:00 UTC 2001 INFO 0
Mon Jan  1 00:00:01 UTC 2001 INFO 1
Mon Jan  1 00:00:02 UTC 2001 INFO 2
...
```

クラスターにインストールされているノードレベルのエージェントは、それ以上の設定を行わなくても、これらのログストリームを自動的に取得します。必要があれば、ソースコンテナに応じてログをパースするようにエージェントを構成できます。

CPUとメモリーの使用量が少ない(CPUの場合は数ミリコアのオーダー、メモリーの場合は数メガバイトのオーダー)にも関わらず、ログをファイルに書き込んでから`stdout`にストリーミングすると、ディスクの使用量が2倍になる可能性があることに注意してください。単一のファイルに書き込むアプリケーションがある場合は、ストリーミングサイドカーコンテナアプローチを実装するのではなく、`/dev/stdout`を宛先として設定することをおすすめします。

サイドカーコンテナを使用して、アプリケーション自体ではローテーションできないログファイルをローテーションすることもできます。このアプローチの例は、`logrotate`を定期的に実行する小さなコンテナです。しかし、`stdout`と`stderr`を直接使い、ローテーションと保持のポリシーをkubeletに任せることをおすすめします。

#### ロギングエージェントを使用したサイドカーコンテナ {#sidecar-container-with-a-logging-agent}

![Sidecar container with a logging agent](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

ノードレベルロギングのエージェントが、あなたの状況に必要なだけの柔軟性を備えていない場合は、アプリケーションで実行するように特別に構成した別のロギングエージェントを使用してサイドカーコンテナを作成できます。

{{< note >}}
サイドカーコンテナでロギングエージェントを使用すると、大量のリソースが消費される可能性があります。さらに、これらのログはkubeletによって制御されていないため、`kubectl logs`を使用してこれらのログにアクセスすることができません。
{{< /note >}}

ロギングエージェントを使用したサイドカーコンテナを実装するために使用できる、2つの構成ファイルを次に示します。最初のファイルには、fluentdを設定するための[`ConfigMap`](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)が含まれています。

{{% codenew file="admin/logging/fluentd-sidecar-config.yaml" %}}

{{< note >}}
fluentdの構成については、[fluentd documentation](https://docs.fluentd.org/)を参照してください。
{{< /note >}}

2番目のファイルは、fluentdを実行しているサイドカーコンテナを持つPodを示しています。Podは、fluentdが構成データを取得できるボリュームをマウントします。

{{% codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" %}}

サンプル構成では、fluentdを任意のロギングエージェントに置き換えて、アプリケーションコンテナ内の任意のソースから読み取ることができます。

### アプリケーションから直接ログを公開する {#exposing-logs-directly-from-the-application}

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)

すべてのアプリケーションから直接ログを公開または送信するクラスターロギングは、Kubernetesのスコープ外です。
