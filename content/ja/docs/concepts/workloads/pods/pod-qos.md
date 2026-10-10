---
title: Pod Quality of Serviceクラス
content_type: concept
weight: 85
---

<!-- overview -->

このページでは、Kubernetesにおける _Quality of Service(QoS)クラス_ を紹介し、Pod内のコンテナに指定したリソース制約に応じて、KubernetesがどのようにPodにQoSクラスを割り当てるのかについて説明します。
Kubernetesは、ノード上で利用可能なリソースが不足した際に、どのPodを退避させるかを決定するために、このクラスを利用します。

<!-- body -->

## Quality of Serviceクラス {#quality-of-service-classes}

Kubernetesは、実行中のPodを分類し、各Podを特定の _Quality of Service(QoS)クラス_ に割り当てます。
Kubernetesは、このクラスを用いてそれぞれのPodの扱い方を決定します。
分類は、Pod内の{{< glossary_tooltip text="コンテナ" term_id="container" >}}の[リソース要求](/docs/concepts/configuration/manage-resources-containers/)と、それらの要求とリソース制限との関連性に基づいて行われます。
これは{{< glossary_tooltip text="Quality of Service" term_id="qos-class" >}}(QoS)クラスと呼ばれます。
Kubernetesは、Podのコンポーネントであるコンテナのリソース要求と制限に基づいて、すべてのPodにQoSクラスを割り当てます。
QoSクラスは、[ノードの圧迫](/docs/concepts/scheduling-eviction/node-pressure-eviction/)が発生しているノードからどのPodを退避させるかを決定する際に使用されます。
QoSクラスには`Guaranteed`、`Burstable`、`BestEffort`があります。
ノードのリソースが不足すると、Kubernetesはまず`BestEffort` Podを退避し、次に`Burstable`、最後に`Guaranteed` Podを退避させます。
リソースの圧迫による退避の場合、リソース要求を超過しているPodのみが退避の候補となります。

### Guaranteed {#guaranteed}

`Guaranteed`のPodは最も厳しいリソース制限を持ち、退避される可能性が最も低いです。
制限を超過するか、ノードからプリエンプト可能なより低い優先度のPodが存在しない限り、強制終了されることはありません。
ただし、指定された制限を超えてリソースを取得することはできません。
これらのPodは、[`static`](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-configuration) CPU管理ポリシーを使って、排他的にCPUを利用することもできます。

#### 条件 {#criteria-1}

Podが`Guaranteed` QoSクラスとして分類されるための条件は以下の通りです:

* Pod内のすべてのコンテナが、メモリ制限とメモリ要求を持っていること。
* Pod内のすべてのコンテナで、メモリ制限がメモリ要求と等しいこと。
* Pod内のすべてのコンテナが、CPU制限とCPU要求を持っていること。
* Pod内のすべてのコンテナで、CPU制限がCPU要求と等しいこと。

もしくは、Podが[Podレベルのリソース](/docs/concepts/configuration/manage-resources-containers/#pod-level-resource-specification)を使用する場合は以下の通りです:

{{< feature-state feature_gate_name="PodLevelResources" >}}

* PodがPodレベルのメモリ制限とメモリ要求を持ち、それらの値が等しいこと。
* PodがPodレベルのCPU制限とCPU要求を持ち、それらの値が等しいこと。

### Burstable {#burstable}

`Burstable`のPodは、要求に基づく下限のリソース保証を持ちますが、特定の制限は必要としません。
制限が指定されていない場合、デフォルトでノードの容量と同等の制限となり、リソースが利用可能であればPodは柔軟にリソースを増やすことができます。
ノードのリソース圧迫によるPod退避の際、これらのPodは、すべての`BestEffort` Podが退避されてから退避されます。
`Burstable` Podには、リソース制限や要求を持たないコンテナを含めることができるため、`Burstable`なPodは任意の量のノードリソースを使おうとする可能性があります。

#### 条件 {#criteria-2}

以下の場合、Podは`Burstable` QoSクラスとして分類されます:

* Podが`Guaranteed` QoSクラスの条件を満たさないこと。
* Pod内の少なくとも1つのコンテナがメモリまたはCPUの要求または制限を持つか、PodがPodレベルのメモリまたはCPUの要求または制限を持つこと。

### BestEffort {#besteffort}

`BestEffort` QoSクラスのPodは、他のQoSクラスのPodに明示的に割り当てられていないノードリソースを使用できます。
たとえば、kubeletで利用可能な16個のCPUコアを持つノードがあり、`Guaranteed` Podに4個のCPUコアを割り当てた場合、`BestEffort` QoSクラスのPodは、残りの12個のCPUコアのうち任意の量を使うことができます。

kubeletは、ノードがリソース圧迫を受けた場合、`BestEffort` Podを優先的に退避させます。

#### 条件 {#criteria-3}

Podは、`Guaranteed`または`Burstable`のいずれの条件も満たさない場合、`BestEffort` QoSクラスになります。
つまり、Pod内のどのコンテナもメモリ制限またはメモリ要求を持たず、Pod内のどのコンテナもCPU制限またはCPU要求を持たず、PodがPodレベルのメモリまたはCPUの制限または要求を持たない場合にのみ、Podは`BestEffort`となります。
Pod内のコンテナは、(CPUまたはメモリ以外の)他のリソースを要求していても、`BestEffort`として分類されます。

## cgroup v2を使用したメモリQoS {#memory-qos-with-cgroup-v2}

{{< feature-state feature_gate_name="MemoryQoS" >}}

メモリQoSは、cgroup v2のメモリコントローラーを使用して、Kubernetesでメモリリソースを保証します。
Pod内のコンテナのメモリ要求と制限は、メモリコントローラーが提供する`memory.min`と`memory.high`インターフェースの設定に使用されます。
`memory.min`がメモリ要求に設定されると、メモリリソースは予約され、カーネルによって回収されることはありません。
これが、メモリQoSがKubernetes Podのメモリ可用性を保証する仕組みです。
また、コンテナでメモリ制限が設定されている場合、システムはコンテナのメモリ使用量を制限する必要があります。
メモリQoSは、`memory.high`を使用してメモリ制限に近づいているワークロードの動作を抑制し、瞬間的なメモリ割り当てによってシステムが圧迫されないようにします。

メモリQoSは、QoSクラスに基づいてどの設定を適用するか決定しますが、これらは異なるメカニズムであり、どちらもQuality of Serviceに対する制御を提供します。

## QoSクラスに依存しない動作 {#class-independent-behavior}

Kubernetesによって割り当てられたQoSクラスとは無関係な動作もあります。
例えば、以下が該当します:

* リソース制限を超過したコンテナは、そのPod内の他のコンテナに影響を与えることなく、kubeletによって強制終了され、再起動されます。

* コンテナがリソース要求を超過し、実行しているノードがリソース圧迫に直面している場合、そのコンテナが含まれるPodは[退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/)の候補となります。
  このような場合、Pod内のすべてのコンテナが終了されます。
  Kubernetesは、通常は別のノード上に、置き換えとなるPodを作成する可能性があります。

* Podのリソース要求は、コンポーネントであるコンテナのリソース要求の合計に等しく、Podのリソース制限は、コンポーネントであるコンテナのリソース制限の合計に等しくなります。

* kube-schedulerは、どのPodを[プリエンプト](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)するかを選択する際に、QoSクラスを考慮しません。
  プリエンプションは、クラスター内に、定義したすべてのPodを実行するのに十分なリソースがない場合に発生する可能性があります。

## {{% heading "whatsnext" %}}

* [Podとコンテナのリソース管理](/docs/concepts/configuration/manage-resources-containers/)について学ぶ。
* [ノードの圧迫による退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/)について学ぶ。
* [Podの優先度とプリエンプション](/docs/concepts/scheduling-eviction/pod-priority-preemption/)について学ぶ。
* [Pod Disruption](/docs/concepts/workloads/pods/disruptions/)について学ぶ。
* [コンテナおよびPodにメモリリソースを割り当てる](/docs/tasks/configure-pod-container/assign-memory-resource/)方法を学ぶ。
* [コンテナおよびPodにCPUリソースを割り当てる](/docs/tasks/configure-pod-container/assign-cpu-resource/)方法を学ぶ。
* [PodにQuality of Serviceを設定する](/docs/tasks/configure-pod-container/quality-service-pod/)方法を学ぶ。
