---
title: ローカルエフェメラルストレージ
content_type: concept
weight: 95
---

ノードは、ローカルに接続された書き込み可能なデバイス、または場合によってはRAMによって提供されるローカルエフェメラルストレージを持っています。
「エフェメラル」とは、耐久性に関する長期的な保証がないことを意味します。

Podは、スクラッチスペース、キャッシュ、およびログのためにエフェメラルローカルストレージを使用します。
kubeletは、ローカルエフェメラルストレージを使用してコンテナに[`emptyDir`](/docs/concepts/storage/volumes/#emptydir)
 {{< glossary_tooltip term_id="volume" text="ボリューム" >}}をマウントすることで、Podにスクラッチスペースを提供できます。

kubeletは、この種のストレージを[ノードレベルのコンテナログ](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)、コンテナイメージ、および実行中のコンテナの書き込み可能なレイヤーの保持にも使用します。

{{< caution >}}
ノードに障害が発生すると、そのエフェメラルストレージ内のデータは失われる可能性があります。
アプリケーションは、ローカルエフェメラルストレージに対してパフォーマンスSLA(例えばディスクIOPS)を期待することはできません。
{{< /caution >}}

{{< note >}}
エフェメラルストレージに対してリソースクォータを機能させるには、2つのことを行う必要があります:

* 管理者がNamespaceにephemeral-storageのリソースクォータを設定する。
* ユーザーがPod specでephemeral-storageリソースのlimitsを指定する。

ユーザーがPod specでephemeral-storageリソースのlimitsを指定しない場合、リソースクォータはephemeral-storageに対して適用されません。

{{< /note >}}

Kubernetesでは、Podが消費するエフェメラルローカルストレージの量を追跡、予約、制限できます。

## ローカルエフェメラルストレージの設定 {#configurations}

Kubernetesは、ノード上のローカルエフェメラルストレージを設定する2つの方法をサポートしています:
{{< tabs name="local_storage_configurations" >}}
{{% tab name="単一ファイルシステム" %}}
この設定では、すべての種類のエフェメラルローカルデータ(`emptyDir`ボリューム、書き込み可能なレイヤー、コンテナイメージ、ログ)を1つのファイルシステムに配置します。
kubeletを設定する最も効果的な方法は、このファイルシステムをKubernetes(kubelet)のデータ専用にすることです。

kubeletは[ノードレベルのコンテナログ](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)もファイルに書き込み、エフェメラルローカルストレージと同様に扱います。

kubeletは、設定されたログディレクトリ(デフォルトでは`/var/log`)内のファイルにログを書き込みます。
また、その他のローカルに保存されるデータのためのベースディレクトリ(デフォルトでは`/var/lib/kubelet`)を持っています。

通常、`/var/lib/kubelet`と`/var/log`はどちらもシステムのルートファイルシステム上にあり、kubeletはそのレイアウトを前提として設計されています。

ノードには、Kubernetesに使用されない他のファイルシステムをいくつでも持つことができます。
{{% /tab %}}
{{% tab name="2つのファイルシステム" %}}
ノード上に、実行中のPodから生成されるエフェメラルデータ(ログと`emptyDir`ボリューム)に使用するファイルシステムがあります。
このファイルシステムは他のデータ(例えばKubernetesに関連しないシステムログ)にも使用できます。ルートファイルシステムであっても構いません。

kubeletは[ノードレベルのコンテナログ](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)も最初のファイルシステムに書き込み、エフェメラルローカルストレージと同様に扱います。

また、異なる論理ストレージデバイスによって提供される、別のファイルシステムも使用します。
この設定では、コンテナイメージのレイヤーと書き込み可能なレイヤーを配置するようkubeletに指定するディレクトリが、この2番目のファイルシステム上にあります。

最初のファイルシステムには、イメージレイヤーや書き込み可能なレイヤーは保持されません。

ノードには、Kubernetesに使用されない他のファイルシステムをいくつでも持つことができます。
{{% /tab %}}
{{< /tabs >}}

kubeletは、使用しているローカルストレージの量を測定できます。
これは、ローカルエフェメラルストレージのサポートされた設定のいずれかを使用してノードをセットアップした場合に提供されます。

異なる設定を使用している場合、kubeletはエフェメラルローカルストレージに対するリソース制限を適用しません。

{{< note >}}
kubeletは、`tmpfs`のemptyDirボリュームをローカルエフェメラルストレージとしてではなく、コンテナのメモリ使用量として追跡します。
{{< /note >}}

{{< note >}}
kubeletは、エフェメラルストレージについてルートファイルシステムのみを追跡します。
`/var/lib/kubelet`または`/var/lib/containers`に別のディスクをマウントするOSレイアウトでは、エフェメラルストレージが正しく報告されません。
{{< /note >}}

## ローカルエフェメラルストレージのrequestsとlimitsの設定 {#requests-limits}

ローカルエフェメラルストレージを管理するために`ephemeral-storage`を指定できます。
Podの各コンテナは、以下のいずれかまたは両方を指定できます:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

`ephemeral-storage`のlimitsとrequestsはバイト単位で測定されます。
ストレージは、整数またはサフィックス(E、P、T、G、M、k)を使用した固定小数点数として表現できます。
また、2の累乗の等価表現(Ei、Pi、Ti、Gi、Mi、Ki)も使用できます。
例えば、以下の量はすべてほぼ同じ値を表します:

- `128974848`
- `129e6`
- `129M`
- `123Mi`

サフィックスの大文字小文字に注意してください。
ephemeral-storageに`400m`をリクエストした場合、これは0.4バイトのリクエストになります。
これを入力した人はおそらく400メビバイト(`400Mi`)または400メガバイト(`400M`)を要求するつもりだったでしょう。

以下の例では、Podに2つのコンテナがあります。
各コンテナには2GiBのローカルエフェメラルストレージのrequestがあります。
各コンテナには4GiBのローカルエフェメラルストレージのlimitがあります。
そのため、Podには4GiBのローカルエフェメラルストレージのrequestと、8GiBのローカルエフェメラルストレージのlimitがあります。
そのlimitのうち500Miは`emptyDir`ボリュームによって消費される可能性があります。

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
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  volumes:
    - name: ephemeral
      emptyDir:
        sizeLimit: 500Mi
```

## ephemeral-storageのrequestを持つPodがどのようにスケジュールされるか {#how-pods-with-ephemeral-storage-requests-are-scheduled}

Podを作成すると、KubernetesスケジューラーはPodを実行するノードを選択します。
各ノードには、Podに提供できるローカルエフェメラルストレージの最大量があります。
詳細については、[Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)を参照してください。

スケジューラーは、スケジュールされたコンテナのリソースrequestの合計がノードの容量より少ないことを保証します。

## エフェメラルストレージの消費量管理 {#resource-emphemeralstorage-consumption}

kubeletがローカルエフェメラルストレージをリソースとして管理している場合、kubeletは以下のストレージ使用量を測定します:

- _tmpfs_ の`emptyDir`ボリュームを除く、`emptyDir`ボリューム
- ノードレベルのログを保持するディレクトリ
- 書き込み可能なコンテナレイヤー

Podが許可された量を超えてエフェメラルストレージを使用している場合、kubeletはPodの退避をトリガーする退避シグナルを設定します。

コンテナレベルの分離では、コンテナの書き込み可能なレイヤーとログの使用量がストレージのlimitを超えた場合、kubeletはそのPodを退避対象としてマークします。

Podレベルの分離では、kubeletはそのPod内のコンテナのlimitsを合計することで、Pod全体のストレージlimitを算出します。
この場合、すべてのコンテナからのローカルエフェメラルストレージ使用量とPodの`emptyDir`ボリュームの合計がPod全体のストレージlimitを超えた場合、kubeletはそのPodを退避対象としてマークします。

{{< caution >}}
kubeletがローカルエフェメラルストレージを測定していない場合、ローカルストレージのlimitを超えたPodは、ローカルストレージリソースの制限違反によって退避されることはありません。

ただし、書き込み可能なコンテナレイヤー、ノードレベルのログ、または`emptyDir`ボリュームのファイルシステムの空き容量が少なくなると、ノードはローカルストレージが不足しているという{{< glossary_tooltip text="taint" term_id="taint" >}}を自身に付与し、このtaintを明示的に許容しないすべてのPodの退避をトリガーします。

エフェメラルローカルストレージのサポートされた[設定](#configurations)を参照してください。
{{< /caution >}}

kubeletは、Podのストレージ使用量を測定するための異なる方法をサポートしています:

{{< tabs name="resource-emphemeralstorage-measurement" >}}

{{% tab name="定期的なスキャン" %}}

kubeletは、各`emptyDir`ボリューム、コンテナログディレクトリ、および書き込み可能なコンテナレイヤーをスキャンする定期的なチェックを実行します。

スキャンは、使用されているスペースの量を測定します。

{{< note >}}
このモードでは、kubeletは削除されたファイルのオープンファイルディスクリプターを追跡しません。

`emptyDir`ボリューム内にファイルを作成(あなたまたはコンテナが)し、何かがそのファイルを開き、ファイルがまだ開いている間にそのファイルを削除した場合、削除されたファイルのinodeはそのファイルを閉じるまで残りますが、kubeletはそのスペースを使用中として分類しません。

{{< /note >}}

{{% /tab %}}

{{% tab name="ファイルシステムプロジェクトクォータ" %}}

{{< feature-state feature_gate_name="LocalStorageCapacityIsolationFSQuotaMonitoring" >}}

プロジェクトクォータは、ファイルシステム上のストレージ使用量を管理するためのオペレーティングシステムレベルの機能です。
Kubernetesでは、ストレージ使用量を監視するためにプロジェクトクォータを有効にできます。
ノード上で`emptyDir`ボリュームを提供するファイルシステムがプロジェクトクォータをサポートしていることを確認してください。
例えば、XFSとext4fsはプロジェクトクォータを提供しています。

{{< note >}}
プロジェクトクォータはストレージ使用量を監視しますが、制限を強制するものではありません。
{{< /note >}}

Kubernetesは`1048576`から始まるプロジェクトIDを使用します。
使用中のIDは`/etc/projects`と`/etc/projid`に登録されます。
この範囲のプロジェクトIDがシステム上の他の目的で使用されている場合、Kubernetesがそれらを使用しないように、それらのプロジェクトIDを`/etc/projects`と`/etc/projid`に登録する必要があります。

クォータはディレクトリスキャンよりも高速で正確です。
ディレクトリがプロジェクトに割り当てられると、そのディレクトリ配下に作成されたすべてのファイルはそのプロジェクト内に作成され、カーネルはそのプロジェクト内のファイルが使用しているブロック数を追跡するだけで済みます。
ファイルが作成されて削除されたが、オープンファイルディスクリプターを持っている場合、そのファイルはスペースを消費し続けます。
クォータの追跡はそのスペースを正確に記録しますが、ディレクトリスキャンでは削除されたファイルが使用しているストレージを見落とします。

クォータを使用してPodのリソース使用量を追跡するには、Podがユーザー名前空間内にある必要があります。
ユーザー名前空間内では、カーネルがファイルシステム上のprojectIDの変更を制限し、クォータによって計算されるストレージメトリクスの信頼性を保証します。

プロジェクトクォータを使用する場合は、以下を行う必要があります:

* [kubelet設定](/docs/reference/config-api/kubelet-config.v1beta1/)の`featureGates`フィールドを使用して、`LocalStorageCapacityIsolationFSQuotaMonitoring=true`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)を有効にする。

* `UserNamespacesSupport`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)が有効であり、カーネル、CRI実装、およびOCIランタイムがユーザー名前空間をサポートしていることを確認する。

* ルートファイルシステム(またはオプションのランタイムファイルシステム)でプロジェクトクォータが有効になっていることを確認する。
  すべてのXFSファイルシステムはプロジェクトクォータをサポートしています。
  ext4ファイルシステムの場合、ファイルシステムがマウントされていない状態でプロジェクトクォータの追跡機能を有効にする必要があります。

  ```bash
  # ext4の場合、/dev/block-deviceがマウントされていない状態で
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

* ルートファイルシステム(またはオプションのランタイムファイルシステム)がプロジェクトクォータを有効にしてマウントされていることを確認する。
  XFSとext4fsの両方で、マウントオプションは`prjquota`という名前です。

プロジェクトクォータを使用しない場合は:

* [kubelet設定](/docs/reference/config-api/kubelet-config.v1beta1/)の`featureGates`フィールドを使用して、`LocalStorageCapacityIsolationFSQuotaMonitoring`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)を無効にする。
{{% /tab %}}
{{< /tabs >}}


## {{% heading "whatsnext" %}}

* XFSの[プロジェクトクォータ](https://www.linux.org/docs/man8/xfs_quota.html)について読む
