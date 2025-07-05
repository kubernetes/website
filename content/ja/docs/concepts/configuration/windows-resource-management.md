---
title: Windowsノードにおけるリソース管理
content_type: concept
weight: 75
---

<!-- overview -->

このページでは、LinuxとWindowsにおけるリソース管理の違いについて説明します。

<!-- body -->

Linuxノードでは、{{< glossary_tooltip text="cgroups" term_id="cgroup" >}} がリソース管理のPodの境界として使われています。
コンテナはネットワーク、プロセス、ファイルシステムが分離された境界内に作成されます。
Linux cgroup APIを利用して、CPU、IO、メモリの統計情報を収集することができます。

対照的に、Windowsは、システム名前空間フィルターを使用してコンテナごとに[_ジョブオブジェクト_](https://learn.microsoft.com/ja-jp/windows/win32/procthread/job-objects)を利用し、すべてのプロセスをコンテナ内に含めて、ホストからの論理的な分離を実現しています。
(ジョブオブジェクトはWindowsのプロセス分離のための機構であり、Kubernetesの{{< glossary_tooltip term_id="job" text="Job" >}}とは異なります。)

Windowsコンテナでは名前空間のフィルタリングを行わずに実行する方法はありません。
つまり、システム権限はホストのコンテキストでは宣言することが出来ません。
そのため、Windows上で特権コンテナは利用出来ません。
Security Account Manager(SAM)が分離されているため、コンテナはホストからの認証情報を受け取ることはできません。

## メモリ管理 {#resource-management-memory}

WindowsではLinuxのようなOut-Of-Memoryによるプロセスの終了は提供されていません。
Windowsではすべてのユーザモードでのメモリアロケーションを仮想的に取り扱います。
そのためpagefilesが必ず必要になります。

Windowsノードではプロセスのメモリオーバーコミットを行いません。
そのため、WindowsではプロセスはLinuxのようにメモリ不足状態になる事はなく、Out-Of-Memory(OOM)により終了するのではなくディスクへのページングを行います。
メモリが過剰に確保され物理メモリが使い果たされた場合に、ページングによりパフォーマンスが低下する可能性があります。

## CPU管理 {#resource-management-cpu}

Windowsは様々なプロセスに割り当てるCPU時間を制限することは出来ますが、最小限のCPU時間を保証することは出来ません。

Windowsでは、kubeletプロセスの`--windows-priorityclass`コマンドラインフラグによる[scheduling priority](https://learn.microsoft.com/ja-jp/windows/win32/procthread/scheduling-priorities)の設定をサポートしています。
このフラグによりkubeletプロセスは同じWindowsホスト上で動作している他のプロセスと比べて多くのCPU時間のスライスを得ることが出来ます。
許容される値とその意味に関する詳細は[Windows Priority Classes](https://docs.microsoft.com/ja-jp/windows/win32/procthread/scheduling-priorities#priority-class)を参照して下さい。
実行中のPodによりkubeletのCPUサイクルが不足しないためには、このフラグを`ABOVE_NORMAL_PRIORITY_CLASS`以上に設定して下さい。


## リソースの予約 {#resource-reservation}

オペレーティングシステムやコンテナランタイム、kubeletのようなKubernetesのホストプロセスによって利用されるCPUやメモリを考慮するために、kubeletの`--kube-reserved`や`--system-reserved`フラグを利用して、リソースを予約することが出来ます(また、予約する必要もあります)。
Windowsではこれらの値はノードの[allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)リソースの計算のみに利用されます。

{{< caution >}}
ワークロードをデプロイする時に、コンテナにメモリとCPUの制限を設定して下さい。
これにより、`NodeAllocatable`が減少し、クラスタ全体のスケジューラーがどのPodをどのノードに配置するかの決定に役立ちます。

制限なしでPodをスケジューリングするとWindowsノードに過剰にプロビジョニングされ、極端な場合にはノードの健全性が低下する可能性があります。
{{< /caution >}}

Windowsでは少なくとも2GiBのメモリを予約する事を推奨します。

どの程度、CPUを予約すればよいのか決定するには、各ノードでのPodの密度を特定し、ノードで実行されるシステムサービスのCPU利用率を監視し、ワークロードのニーズを満たす値を選択します。
