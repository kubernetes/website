---
title: コンテナのリソース管理
content_type: concept
weight: 40
feature:
  title: 自動ビンパッキング
  description: >
    可用性を犠牲にすることなく、リソース要件やその他の制約に基づいてコンテナを自動的に配置します。リソース利用率の向上と、リソースの節約のために、クリティカルなワークロードとベストエフォートなワークロードを混在させます。
---

<!-- overview -->

{{< glossary_tooltip term_id="pod" >}}を指定する際に、{{< glossary_tooltip text="コンテナ" term_id="container" >}}が必要とする各リソースの量をオプションで指定することができます。
指定する最も一般的なリソースはCPUとメモリ(RAM)ですが、他にもあります。

Pod内のコンテナのリソース*要求*を指定すると、スケジューラはこの情報を使用して、どのNodeにPodを配置するかを決定します。コンテナに*制限*ソースを指定すると、kubeletはその制限を適用し、実行中のコンテナが設定した制限を超えてリソースを使用することができないようにします。また、kubeletは、少なくともそのシステムリソースのうち、*要求*の量を、そのコンテナが使用するために特別に確保します。

<!-- body -->

## 要求と制限

Podが動作しているNodeに利用可能なリソースが十分にある場合、そのリソースの`要求`が指定するよりも多くのリソースをコンテナが使用することが許可されます
ただし、コンテナはそのリソースの`制限`を超えて使用することはできません。

たとえば、コンテナに256MiBの`メモリー`要求を設定し、そのコンテナが8GiBのメモリーを持つNodeにスケジュールされたPod内に存在し、他のPodが存在しない場合、コンテナはより多くのRAMを使用しようとする可能性があります。

そのコンテナに4GiBの`メモリー`制限を設定すると、kubelet(および{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}) が制限を適用します。ランタイムは、コンテナーが設定済みのリソース制限を超えて使用するのを防ぎます。例えば、コンテナ内のプロセスが、許容量を超えるメモリを消費しようとすると、システムカーネルは、メモリ不足(OOM)エラーで、割り当てを試みたプロセスを終了します。

制限は、違反が検出されるとシステムが介入するように事後的に、またはコンテナーが制限を超えないようにシステムが防ぐように強制的に、実装できます。
異なるランタイムは、同じ制限を実装するために異なる方法をとることができます。

{{< note >}}
コンテナが自身のメモリー制限を指定しているが、メモリー要求を指定していない場合、Kubernetesは制限に一致するメモリー要求を自動的に割り当てます。同様に、コンテナが自身のCPU制限を指定しているが、CPU要求を指定していない場合、Kubernetesは制限に一致するCPU要求を自動的に割り当てます。
{{< /note >}}

## リソースタイプ

*CPU*と*メモリー*はいずれも*リソースタイプ*です。リソースタイプには基本単位があります。
CPUは計算処理を表し、[Kubernetes CPUs](#meaning-of-cpu)の単位で指定されます。
メモリはバイト単位で指定されます。
Kubernetes v1.14以降を使用している場合は、*huge page*リソースを指定することができます。
Huge PageはLinux固有の機能であり、Nodeのカーネルはデフォルトのページサイズよりもはるかに大きいメモリブロックを割り当てます。

たとえば、デフォルトのページサイズが4KiBのシステムでは、`hugepages-2Mi: 80Mi`という制限を指定できます。
コンテナが40を超える2MiBの巨大ページ(合計80 MiB)を割り当てようとすると、その割り当ては失敗します。

{{< note >}}
`hugepages-*`リソースをオーバーコミットすることはできません。
これは`memory`や`cpu`リソースとは異なります。
{{< /note >}}

CPUとメモリーは、まとめて*コンピュートリソース*または単に*リソース*と呼ばれます。
コンピューティングリソースは、要求され、割り当てられ、消費され得る測定可能な量です。
それらは[API resources](/docs/concepts/overview/kubernetes-api/)とは異なります。
Podや[Services](/docs/concepts/services-networking/service/)などのAPIリソースは、Kubernetes APIサーバーを介して読み取りおよび変更できるオブジェクトです。

## Podとコンテナのリソース要求と制限

Podの各コンテナは、次の1つ以上を指定できます。

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.limits.hugepages-<size>`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`
* `spec.containers[].resources.requests.hugepages-<size>`

要求と制限はそれぞれのコンテナでのみ指定できますが、このPodリソースの要求と制限の関係性について理解すると便利です。
特定のリソースタイプの*Podリソース要求/制限*は、Pod内の各コンテナに対するそのタイプのリソース要求/制限の合計です。

## Kubernetesにおけるリソースの単位

### CPUの意味

CPUリソースの制限と要求は、*cpu*単位で測定されます。
Kuberenetesにおける1つのCPUは、クラウドプロバイダーの**1 vCPU/コア**およびベアメタルのインテルプロセッサーの**1 ハイパースレッド**に相当します。

要求を少数で指定することもできます。
`spec.containers[].resources.requests.cpu`が`0.5`のコンテナは、1CPUを要求するコンテナの半分のCPUが保証されます。
`0.1`という表現は`100m`という表現と同等であり、`100ミリCPU`と読み替えることができます。
`100ミリコア`という表現も、同じことを意味しています。
`0.1`のような小数点のある要求はAPIによって`100m`に変換され、`1m`より細かい精度は許可されません。
このため、`100m`の形式が推奨されます。

CPUは常に相対量としてではなく、絶対量として要求されます。
0.1は、シングルコア、デュアルコア、あるいは48コアマシンのどのCPUに対してでも、同一の量を要求します。

### メモリーの意味

`メモリー`の制限と要求はバイト単位で測定されます。
E、P、T、G、M、Kのいずれかのサフィックスを使用して、メモリーを整数または固定小数点数として表すことができます。
また、Ei、Pi、Ti、Gi、Mi、Kiのような2の累乗の値を使用することもできます。
たとえば、以下はほぼ同じ値を表しています。

```shell
128974848, 129e6, 129M, 123Mi
```

例を見てみましょう。
次のPodには2つのコンテナがあります。
各コンテナには、0.25cpuおよび64MiB(2<sup>26</sup>バイト)のメモリー要求と、0.5cpuおよび128MiBのメモリー制限があります
Podには0.5cpuと128MiBのメモリー要求があり、1cpuと256MiBのメモリ制限があると言えます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## リソース要求を含むPodがどのようにスケジュールされるか

Podを作成すると、KubernetesスケジューラーはPodを実行するNodeを選択します。
各Nodeには、リソースタイプごとに最大容量があります。それは、Podに提供できるCPUとメモリの量です。
スケジューラーは、リソースタイプごとに、スケジュールされたコンテナのリソース要求の合計がNodeの容量より少ないことを確認します。
Node上の実際のメモリーまたはCPUリソースの使用率は非常に低いですが、容量チェックが失敗した場合、スケジューラーはNodeにPodを配置しないことに注意してください。
これにより、例えば日々のリソース要求のピーク時など、リソース利用が増加したときに、Nodeのリソース不足から保護されます。

## リソース制限のあるPodがどのように実行されるか

kubeletがPodのコンテナを開始すると、CPUとメモリーの制限がコンテナランタイムに渡されます。

Dockerを使用する場合:

- `spec.containers[].resources.requests.cpu`は、潜在的に小数であるコア値に変換され、1024倍されます。
  `docker run`コマンドの[`--cpu-shares`](https://docs.docker.com/engine/reference/run/#cpu-share-constraint)フラグの値は、この数値と2のいずれか大きい方が用いられます。

- `spec.containers[].resources.limits.cpu`はミリコアの値に変換され、100倍されます。
  結果の値は、コンテナが100ミリ秒ごとに使用できるCPU時間の合計です。
  コンテナは、この間隔の間、CPU時間の占有率を超えて使用することはできません。

  {{< note >}}
  デフォルトのクォータ期間は100ミリ秒です。
  CPUクォータの最小分解能は1ミリ秒です。
  {{</ note >}}

- `spec.containers[].resources.limits.memory`は整数に変換され、`docker run`コマンドの[`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints)フラグの値として使用されます。

コンテナがメモリー制限を超過すると、終了する場合があります。
コンテナが再起動可能である場合、kubeletは他のタイプのランタイム障害と同様にコンテナを再起動します。

コンテナがメモリー要求を超過すると、Nodeのメモリーが不足するたびにそのPodが排出される可能性があります。

コンテナは、長時間にわたってCPU制限を超えることが許可される場合と許可されない場合があります。
ただし、CPUの使用量が多すぎるために、コンテナが強制終了されることはありません。

コンテナをスケジュールできないか、リソース制限が原因で強制終了されているかどうかを確認するには、[トラブルシューティング](#troubleshooting)のセクションを参照してください。

### コンピュートリソースとメモリーリソースの使用量を監視する

Podのリソース使用量は、Podのステータスの一部として報告されます。

オプションの[監視ツール](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)がクラスターにおいて利用可能な場合、Podのリソース使用量は[メトリクスAPI](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#the-metrics-api)から直接、もしくは監視ツールから取得できます。

## ローカルのエフェメラルストレージ

<!-- feature gate LocalStorageCapacityIsolation -->
{{< feature-state for_k8s_version="v1.10" state="beta" >}}

Nodeには、ローカルに接続された書き込み可能なデバイス、または場合によってはRAMによってサポートされるローカルのエフェメラルストレージがあります。
"エフェメラル"とは、耐久性について長期的な保証がないことを意味します。

Podは、スクラッチ領域、キャッシュ、ログ用にエフェメラルなローカルストレージを使用しています。
kubeletは、ローカルのエフェメラルストレージを使用して、Podにスクラッチ領域を提供し、[`emptyDir`](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) {{< glossary_tooltip term_id="volume" text="ボリューム" >}}をコンテナにマウントできます。

また、kubeletはこの種類のストレージを使用して、[Nodeレベルのコンテナログ](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)、コンテナイメージ、実行中のコンテナの書き込み可能なレイヤーを保持します。

{{< caution >}}
Nodeに障害が発生すると、そのエフェメラルストレージ内のデータが失われる可能性があります。
アプリケーションは、ローカルのエフェメラルストレージにパフォーマンスのサービス品質保証(ディスクのIOPSなど)を期待することはできません。
{{< /caution >}}

ベータ版の機能として、Kubernetesでは、Podが消費するローカルのエフェメラルストレージの量を追跡、予約、制限することができます。

### ローカルエフェメラルストレージの設定

Kubernetesは、Node上のローカルエフェメラルストレージを構成する2つの方法をサポートしています。
{{< tabs name="local_storage_configurations" >}}
{{% tab name="シングルファイルシステム" %}}
この構成では、さまざまな種類のローカルのエフェメラルデータ(`emptyDir`ボリュームや、書き込み可能なレイヤー、コンテナイメージ、ログなど)をすべて1つのファイルシステムに配置します。
kubeletを構成する最も効果的な方法は、このファイルシステムをKubernetes(kubelet)データ専用にすることです。

kubeletは[Nodeレベルのコンテナログ](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)も書き込み、これらをエフェメラルなローカルストレージと同様に扱います。

kubeletは、設定されたログディレクトリ(デフォルトでは`/var/log`)内のファイルにログを書き出し、ローカルに保存された他のデータのベースディレクトリ(デフォルトでは`/var/lib/kubelet`)を持ちます。

通常、`/var/lib/kubelet`と`/var/log`はどちらもシステムルートファイルシステムにあり、kubeletはそのレイアウトを考慮して設計されています。

Nodeには、Kubernetesに使用されていない他のファイルシステムを好きなだけ持つことができます。
{{% /tab %}}
{{% tab name="2ファイルシステム" %}}
Node上にファイルシステムがありますが、このファイルシステムは、ログや`emptyDir`ボリュームなど、実行中のPodの一時的なデータに使用されます。
このファイルシステムは、例えばKubernetesに関連しないシステムログなどの他のデータに使用することができ、ルートファイルシステムとすることさえ可能です。

また、kubeletは[ノードレベルのコンテナログ](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)を最初のファイルシステムに書き込み、これらをエフェメラルなローカルストレージと同様に扱います。

また、別の論理ストレージデバイスでバックアップされた別のファイルシステムを使用することもできます。
この設定では、コンテナイメージレイヤーと書き込み可能なレイヤーを配置するようにkubeletに指示するディレクトリは、この2番目のファイルシステム上にあります。

最初のファイルシステムは、コンテナイメージレイヤーや書き込み可能なレイヤーを保持していません。

Nodeには、Kubernetesに使用されていない他のファイルシステムを好きなだけ持つことができます。
{{% /tab %}}
{{< /tabs >}}

kubeletは、ローカルストレージの使用量を測定できます。
これは、以下の条件で提供されます。

- `LocalStorageCapacityIsolation`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効になっています。(デフォルトでオンになっています。)
- そして、ローカルのエフェメラルストレージ用にサポートされている構成の1つを使用してNodeをセットアップします。

別の構成を使用している場合、kubeletはローカルのエフェメラルストレージにリソース制限を適用しません。

{{< note >}}
kubeletは、`tmpfs`のemptyDirボリュームをローカルのエフェメラルストレージとしてではなく、コンテナメモリーとして追跡します。
{{< /note >}}

### ローカルのエフェメラルストレージの要求と制限設定

ローカルのエフェメラルストレージを管理するためには_ephemeral-storage_パラメーターを利用することができます。
Podの各コンテナは、次の1つ以上を指定できます。
* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

`ephemeral-storage`の制限と要求はバイト単位で記します。
ストレージは、次のいずれかの接尾辞を使用して、通常の整数または固定小数点数として表すことができます。
E、P、T、G、M、K。Ei、Pi、Ti、Gi、Mi、Kiの2のべき乗を使用することもできます。
たとえば、以下はほぼ同じ値を表しています。

```shell
128974848, 129e6, 129M, 123Mi
```

次の例では、Podに2つのコンテナがあります。
各コンテナには、2GiBのローカルのエフェメラルストレージ要求があります。
各コンテナには、4GiBのローカルのエフェメラルストレージ制限があります。
したがって、Podには4GiBのローカルのエフェメラルストレージの要求と、8GiBのローカルのエフェメラルストレージ制限があります。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
```

### エフェメラルストレージを要求するPodのスケジュール方法

Podを作成すると、KubernetesスケジューラーはPodを実行するNodeを選択します。
各Nodeには、Podに提供できるローカルのエフェメラルストレージの上限があります。
詳細については、[Node割り当て可能](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)を参照してください。

スケジューラーは、スケジュールされたコンテナのリソース要求の合計がNodeの容量より少なくなるようにします。

### エフェメラルストレージの消費管理 {#resource-emphemeralstorage-consumption}

kubeletがローカルのエフェメラルストレージをリソースとして管理している場合、kubeletはストレージの使用量を測定します

- _tmpfs_`emptyDir`ボリュームを除く`emptyDir`ボリューム
- Nodeレベルのログを保持するディレクトリ
- 書き込み可能なコンテナレイヤー

Podが許可するよりも多くのエフェメラルストレージを使用している場合、kubeletはPodの排出をトリガーするシグナルを設定します。

コンテナレベルの分離の場合、コンテナの書き込み可能なレイヤーとログ使用量がストレージの制限を超えると、kubeletはPodに排出のマークを付けます。

Podレベルの分離の場合、kubeletはPod内のコンテナの制限を合計し、Podの全体的なストレージ制限を計算します。
このケースでは、すべてのコンテナからのローカルのエフェメラルストレージの使用量とPodの`emptyDir`ボリュームの合計がPod全体のストレージ制限を超過する場合、
kubeletはPodをまた排出対象としてマークします。

{{< caution >}}
kubeletがローカルのエフェメラルストレージを測定していない場合、ローカルストレージの制限を超えるPodは、ローカルストレージのリソース制限に違反しても排出されません。

ただし、書き込み可能なコンテナレイヤー、Nodeレベルのログ、または`emptyDir`ボリュームのファイルシステムスペースが少なくなると、Nodeはローカルストレージが不足していると汚染{{< glossary_tooltip text="taints" term_id="taint" >}}し、この汚染は、汚染を特に許容しないPodの排出をトリガーします。

ローカルのエフェメラルストレージについては、サポートされている[設定](＃configurations-for-local-ephemeral-storage)をご覧ください。
{{< /caution >}}

kubeletはPodストレージの使用状況を測定するさまざまな方法をサポートしています

{{< tabs name="resource-emphemeralstorage-measurement" >}}
{{% tab name="定期スキャン" %}}
kubeletは、`emptyDir`ボリューム、コンテナログディレクトリ、書き込み可能なコンテナレイヤーをスキャンする定期的なスケジュールチェックを実行します。

スキャンは、使用されているスペースの量を測定します。

{{< note >}}
このモードでは、kubeletは削除されたファイルのために、開いているファイルディスクリプタを追跡しません。

あなた(またはコンテナ)が`emptyDir`ボリューム内にファイルを作成した後、何かがそのファイルを開き、そのファイルが開かれたままの状態でファイルを削除した場合、削除されたファイルのinodeはそのファイルを閉じるまで残りますが、kubeletはそのスペースを使用中として分類しません。
{{< /note >}}
{{% /tab %}}
{{% tab name="ファイルシステムプロジェクトクォータ" %}}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

プロジェクトクォータは、ファイルシステム上のストレージ使用量を管理するためのオペレーティングシステムレベルの機能です。
Kubernetesでは、プロジェクトクォータを有効にしてストレージの使用状況を監視することができます。
ノード上の`emptyDir`ボリュームをバックアップしているファイルシステムがプロジェクトクォータをサポートしていることを確認してください。
例えば、XFSやext4fsはプロジェクトクォータを提供しています。

{{< note >}}
プロジェクトクォータはストレージの使用状況を監視しますが、制限を強制するものではありません。
{{< /note >}}

Kubernetesでは、`1048576`から始まるプロジェクトIDを使用します。
使用するプロジェクトIDは`/etc/projects`と`/etc/projid`に登録されます。
この範囲のプロジェクトIDをシステム上で別の目的で使用する場合は、それらのプロジェクトIDを`/etc/projects`と`/etc/projid`に登録し、
Kubernetesが使用しないようにする必要があります。

クォータはディレクトリスキャンよりも高速で正確です。
ディレクトリがプロジェクトに割り当てられると、ディレクトリ配下に作成されたファイルはすべてそのプロジェクト内に作成され、カーネルはそのプロジェクト内のファイルによって使用されているブロックの数を追跡するだけです。
ファイルが作成されて削除されても、開いているファイルディスクリプタがあれば、スペースを消費し続けます。
クォータトラッキングはそのスペースを正確に記録しますが、ディレクトリスキャンは削除されたファイルが使用するストレージを見落としてしまいます。

プロジェクトクォータを使用する場合は、次のことを行う必要があります。

* kubelet設定で、`LocalocalStorpactionCapactionIsolationFSQuotaMonitoring=true`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gate/)を有効にします。

* ルートファイルシステム(またはオプションのランタイムファイルシステム))がプロジェクトクォータを有効にしていることを確認してください。
  すべてのXFSファイルシステムはプロジェクトクォータをサポートしています。
  ext4ファイルシステムでは、ファイルシステムがマウントされていない間は、プロジェクトクォータ追跡機能を有効にする必要があります。
  ```bash
  # ext4の場合、/dev/block-deviceがマウントされていません
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

* ルートファイルシステム(またはオプションのランタイムファイルシステム)がプロジェクトクォータを有効にしてマウントされていることを確認してください。
  XFSとext4fsの両方で、マウントオプションは`prjquota`という名前になっています。

{{% /tab %}}
{{< /tabs >}}

## 拡張リソース

拡張リソースは`kubernetes.io`ドメインの外で完全に修飾されたリソース名です。
これにより、クラスタオペレータはKubernetesに組み込まれていないリソースをアドバタイズし、ユーザはそれを利用することができるようになります。

拡張リソースを使用するためには、2つのステップが必要です。
第一に、クラスタオペレーターは拡張リソースをアドバタイズする必要があります。
第二に、ユーザーはPodで拡張リソースを要求する必要があります。

### 拡張リソースの管理

#### Nodeレベルの拡張リソース

Nodeレベルの拡張リソースはNodeに関連付けられています。

##### デバイスプラグイン管理のリソース
各Nodeにデバイスプラグインで管理されているリソースをアドバタイズする方法については、[デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)を参照してください。

##### その他のリソース
新しいNodeレベルの拡張リソースをアドバタイズするには、クラスタオペレータはAPIサーバに`PATCH`HTTPリクエストを送信し、クラスタ内のNodeの`status.capacity`に利用可能な量を指定します。
この操作の後、ノードの`status.capacity`には新しいリソースが含まれます。
`status.allocatable`フィールドは、kubeletによって非同期的に新しいリソースで自動的に更新されます。
スケジューラはPodの適合性を評価する際にNodeの`status.allocatable`値を使用するため、Nodeの容量に新しいリソースを追加してから、そのNodeでリソースのスケジューリングを要求する最初のPodが現れるまでには、短い遅延が生じる可能性があることに注意してください。

**例:**

以下は、`curl`を使用して、Masterが`k8s-master`であるNode`k8s-node-1`で5つの`example.com/foo`リソースを示すHTTPリクエストを作成する方法を示す例です。

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}
上記のリクエストでは、`~1`はパッチパス内の文字`/`のエンコーディングです。
JSON-Patchの操作パス値は、JSON-Pointerとして解釈されます。
詳細については、[IETF RFC 6901, section 3](https://tools.ietf.org/html/rfc6901#section-3)を参照してください。
{{< /note >}}

#### クラスターレベルの拡張リソース

クラスターレベルの拡張リソースはノードに関連付けられていません。
これらは通常、リソース消費とリソースクォータを処理するスケジューラー拡張機能によって管理されます。

[スケジューラーポリシー構成](https://github.com/kubernetes/kubernetes/blob/release-1.10/pkg/scheduler/api/v1/types.go#L31)では。スケジューラー拡張機能によって扱われる拡張リソースを指定できます。

**例:**

次のスケジューラーポリシーの構成は、クラスターレベルの拡張リソース"example.com/foo"がスケジューラー拡張機能によって処理されることを示しています。

- スケジューラーは、Podが"example.com/foo"を要求した場合にのみ、Podをスケジューラー拡張機能に送信します。
- `ignoredByScheduler`フィールドは、スケジューラがその`PodFitsResources`述語で"example.com/foo"リソースをチェックしないことを指定します。

```json
{
  "kind": "Policy",
  "apiVersion": "v1",
  "extenders": [
    {
      "urlPrefix":"<extender-endpoint>",
      "bindVerb": "bind",
      "managedResources": [
        {
          "name": "example.com/foo",
          "ignoredByScheduler": true
        }
      ]
    }
  ]
}
```

### 拡張リソースの消費

ユーザーは、CPUやメモリのようにPodのスペックで拡張されたリソースを消費できます。
利用可能な量以上のリソースが同時にPodに割り当てられないように、スケジューラーがリソースアカウンティングを行います。

APIサーバーは、拡張リソースの量を整数の値で制限します。
有効な数量の例は、`3`、`3000m`、`3Ki`です。
無効な数量の例は、`0.5`、`1500m`です。

{{< note >}}
拡張リソースは不透明な整数リソースを置き換えます。
ユーザーは、予約済みの`kubernetes.io`以外のドメイン名プレフィックスを使用できます。
{{< /note >}}

Podで拡張リソースを消費するには、コンテナ名の`spec.containers[].resources.limits`マップにキーとしてリソース名を含めます。

{{< note >}}
拡張リソースはオーバーコミットできないので、コンテナスペックに要求と制限の両方が存在する場合は等しくなければなりません。
{{< /note >}}

Podは、CPU、メモリ、拡張リソースを含むすべてのリソース要求が満たされた場合にのみスケジュールされます。
リソース要求が満たされない限り、Podは`PENDING`状態のままです。

**例:**

下のPodはCPUを2つ、"example.com/foo"(拡張リソース)を1つ要求しています。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        example.com/foo: 1
      limits:
        example.com/foo: 1
```

## トラブルシューティング

### failedSchedulingイベントメッセージが表示され、Podが保留中になる

スケジューラーがPodが収容されるNodeを見つけられない場合、場所が見つかるまでPodはスケジュールされないままになります。
スケジューラーがPodの場所を見つけられないたびに、次のようなイベントが生成されます。

```shell
kubectl describe pod frontend | grep -A 3 Events
```
```
Events:
  FirstSeen LastSeen   Count  From          Subobject   PathReason      Message
  36s   5s     6      {scheduler }              FailedScheduling  Failed for reason PodExceedsFreeCPU and possibly others
```

前述の例では、"frontend"という名前のPodは、Node上のCPUリソースが不足しているためにスケジューリングに失敗しています。
同様のエラーメッセージは、メモリー不足による失敗を示唆することもあります(PodExceedsFreeMemory)。
一般的に、このタイプのメッセージでPodが保留されている場合は、いくつか試すべきことがあります。

- クラスタにNodeを追加します。
- 不要なポッドを終了して、保留中のPodのためのスペースを空けます。
- PodがすべてのNodeよりも大きくないことを確認してください。
  例えば、すべてのNodeが`cpu: 1`の容量を持っている場合、`cpu: 1.1`を要求するPodは決してスケジューリングされません。

Nodeの容量や割り当て量は`kubectl describe nodes`コマンドで調べることができる。
例えば、以下のようになる。

```shell
kubectl describe nodes e2e-test-node-pool-4lw4
```
```
Name:            e2e-test-node-pool-4lw4
[ ... lines removed for clarity ...]
Capacity:
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 cpu:                               1800m
 memory:                            7474992Ki
 pods:                              110
[ ... lines removed for clarity ...]
Non-terminated Pods:        (5 in total)
  Namespace    Name                                  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------    ----                                  ------------  ----------  ---------------  -------------
  kube-system  fluentd-gcp-v1.38-28bv1               100m (5%)     0 (0%)      200Mi (2%)       200Mi (2%)
  kube-system  kube-dns-3297075139-61lj3             260m (13%)    0 (0%)      100Mi (1%)       170Mi (2%)
  kube-system  kube-proxy-e2e-test-...               100m (5%)     0 (0%)      0 (0%)           0 (0%)
  kube-system  monitoring-influxdb-grafana-v4-z1m12  200m (10%)    200m (10%)  600Mi (8%)       600Mi (8%)
  kube-system  node-problem-detector-v0.1-fj7m3      20m (1%)      200m (10%)  20Mi (0%)        100Mi (1%)
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests    CPU Limits    Memory Requests    Memory Limits
  ------------    ----------    ---------------    -------------
  680m (34%)      400m (20%)    920Mi (12%)        1070Mi (14%)
```

前述の出力では、Podが1120m以上のCPUや6.23Gi以上のメモリーを要求した場合、そのPodはNodeに収まらないことがわかります。

`Pods`セクションを見れば、どのPodがNode上でスペースを占有しているかがわかります。

システムデーモンが利用可能なリソースの一部を使用しているため、Podに利用可能なリソースの量はNodeの容量よりも少なくなっています。
`allocatable`フィールド[NodeStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#nodestatus-v1-core)は、Podに利用可能なリソースの量を与えます。
詳細については、[ノード割り当て可能なリソース](https://git.k8s.io/community/contributors/design-proposals/node/node-allocatable.md)を参照してください。

[リソースクォータ](/docs/concepts/policy/resource-quotas/)機能は、消費できるリソースの総量を制限するように設定することができます。
名前空間と組み合わせて使用すると、1つのチームがすべてのリソースを占有するのを防ぐことができます。

### コンテナが終了した

コンテナはリソース不足のため、終了する可能性があります。
コンテナがリソース制限に達したために強制終了されているかどうかを確認するには、対象のPodで`kubectl describe pod`を呼び出します。

```shell
kubectl describe pod simmemleak-hra99
```
```
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Replication Controllers:        simmemleak (1/1 replicas created)
Containers:
  simmemleak:
    Image:  saadali/simmemleak
    Limits:
      cpu:                      100m
      memory:                   50Mi
    State:                      Running
      Started:                  Tue, 07 Jul 2015 12:54:41 -0700
    Last Termination State:     Terminated
      Exit Code:                1
      Started:                  Fri, 07 Jul 2015 12:54:30 -0700
      Finished:                 Fri, 07 Jul 2015 12:54:33 -0700
    Ready:                      False
    Restart Count:              5
Conditions:
  Type      Status
  Ready     False
Events:
  FirstSeen                         LastSeen                         Count  From                              SubobjectPath                       Reason      Message
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {scheduler }                                                          scheduled   Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   pulled      Pod container image "k8s.gcr.io/pause:0.8.0" already present on machine
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   created     Created with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   started     Started with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    spec.containers{simmemleak}         created     Created with docker id 87348f12526a
```

上記の例では、`Restart Count：5`はPodの`simmemleak`コンテナが終了して、5回再起動したことを示しています。

`-o go-template=...`オプションを指定して、`kubectl get pod`を呼び出し、以前に終了したコンテナのステータスを取得できます。

```shell
kubectl get pod -o go-template='{{range.status.containerStatuses}}{{"Container Name: "}}{{.name}}{{"\r\nLastState: "}}{{.lastState}}{{end}}'  simmemleak-hra99
```
```
Container Name: simmemleak
LastState: map[terminated:map[exitCode:137 reason:OOM Killed startedAt:2015-07-07T20:58:43Z finishedAt:2015-07-07T20:58:43Z containerID:docker://0e4095bba1feccdfe7ef9fb6ebffe972b4b14285d5acdec6f0d3ae8a22fad8b2]]
```

`reason：OOM Killed`が原因でコンテナが終了したことがわかります。`OOM`はメモリー不足を表します。


## {{% heading "whatsnext" %}}

* [コンテナとPodへのメモリーリソースの割り当て](/docs/tasks/configure-pod-container/assign-memory-resource/)ハンズオンを行う

* [コンテナとPodへのCPUリソースの割り当て](/docs/tasks/configure-pod-container/assign-cpu-resource/)ハンズオンを行う

* 要求と制限の違いの詳細については、[リソースQoS](https://git.k8s.io/community/contributors/design-proposals/node/resource-qos.md)を参照する

* [コンテナ](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)APIリファレンスを読む

* [リソース要求](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcerequirements-v1-core)APIリファレンスを読む

* XFSの[プロジェクトクォータ](http://xfs.org/docs/xfsdocs-xml-dev/XFS_User_Guide/tmp/en-US/html/xfs-quotas.html)について読む
