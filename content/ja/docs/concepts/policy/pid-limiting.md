---
title: プロセスIDの制限と予約
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Kubernetesでは、{{< glossary_tooltip term_id="Pod" text="Pod" >}}が使用できるプロセスID(PID)数を制限することができます。また、オペレーティングシステムやデーモンによる使用のために、Podだけではなく{{< glossary_tooltip term_id="node" text="ノード" >}}ごとに割り当て可能なPID数を予約することができます。

<!-- body -->

プロセスID(PID)はノードの基本的なリソースです。他のリソース制限に達することなくタスク制限に達することは容易であり、それがホストマシンの不安定性を引き起こす可能性があります。

クラスター管理者はクラスター内で実行しているPodがホストデーモン({{< glossary_tooltip text="kubelet" term_id="kubelet" >}}や{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}や場合によってはコンテナランタイムなど)の実行を妨げる、PIDの枯渇を引き起こさないことを保証するメカニズムを必要とします。それに加えて、同ノード上の他のワークロードへの影響を制限するためにPod間でPIDが制限されていることも重要です。

{{< note >}}
特定のLinuxのインストール時に、オペレーティングシステムはPID制限の値を`32768`のような低いデフォルト値に設定することがあります。`/proc/sys/kernel/pid_max`の値を上げることを検討してください。
{{< /note >}}

Podが使用できるPID数の制限をkubeletに設定できます。例えば、ノードのホストOSがPIDの最大値を`262144`に設定し、250未満のPodをホストします。この場合、各Podに`1000`PIDを割り当てることで、そのノードで利用可能なPIDを使い切ることを防ぐことができます。管理者がCPUやメモリのようにPIDでもオーバーコミットを行いたい場合、同様にいくつかの追加のリスクがあります。いずれにしても、単一のPodがマシン全体をダウンさせることはできません。このようなリソース制限は単純なフォーク爆弾がクラスター全体の運用に影響を与えるのを防ぐのに役立ちます。

PodごとのPID制限により、管理者はあるPodを他のPodから保護できますが、ホスト上にスケジュールされたすべてのPodがノード全体に影響を与えないことを保証するものではありません。Podごとの制限は、ノードエージェント自体をPID枯渇から保護するものでもありません。

また、Podへの割り当てとは別に、ノードのオーバーヘッドのために一定量のPIDを予約することもできます。これは、CPU、メモリ、その他のリソースをオペレーティングシステムやPodおよびコンテナ外の他の機能で使用するために予約する方法と似ています。

PID制限は、[コンピュータリソース](/ja/docs/concepts/configuration/manage-resources-containers/)のリクエストと制限と並んで重要な機能です。ただし、指定方法は異なります。Podのリソース制限をPodの`.spec`で定義するのではなく、kubeletの設定として制限を設定します。現在、Pod定義のPID制限はサポートされていません。

{{< caution >}}
これは、Podに適用される制限が、Podがスケジュールされる場所によって異なる可能性があることを意味します。簡単にするためには、すべてのノードが同じPIDリソースの制限と予約を使用するのが最も簡単です。
{{< /caution >}}

## ノードのPID制限

KubernetesはKubernetesシステムが利用するプロセスID数を予約することができます。予約を設定するために、kubeletのコマンドラインオプションで`--system-reserved`および`--kube-reserved`の`pid=<number>`パラメーターを使用します。指定された値は、システム全体およびKubernetesシステムデーモン用それぞれに、指定された数のプロセスIDが予約されることを宣言します。

## PodのPID制限

KubernetesはPodで実行するプロセス数を制限することができます。特定のPodのリソース制限として設定するのではなく、ノードレベルでこの制限を指定します。各ノードは異なるPID制限を持つことができます。制限を設定するために、kubeletに`--pod-max-pids`のコマンドラインパラメーターを指定するか、kubeletの[構成ファイル](/docs/tasks/administer-cluster/kubelet-config-file/)の`PodPidsLimit`に設定します。

## Evictionを基にしたPID

Podが誤操作していたり、異常なリソースを消費している時にPodの終了を実行することをkubeletに設定できます。この機能はEvictionと呼ばれています。様々なEvictionシグナルのために[リソース不足への対処の設定](/docs/concepts/scheduling-eviction/node-pressure-eviction/)ができます。`pid.available`Evictionシグナルを使用して、Podによって使用されるPIDの数の閾値を設定します。ソフトとハードのEvictionポリシーを設定できます。しかし、ハードEvictionポリシーを使用しても、PIDの数が非常に速く増加している場合、ノードはPID制限に達することで不安定な状態になる可能性があります。Evictionシグナルの値は定期的に計算されますが、この値は制限を強制するものではありません。

PIDの制限、つまりPod毎、ノード毎にハード制限を設定できます。一度制限に達すると、ワークロードは新しいPIDを取得しようとする際に失敗し始めます。これがPodの再スケジューリングにつながるかどうかは、ワークロードがこれらの失敗にどのように反応するか、PodのLiveness ProbeとReadiness Probeがどのように設定されているかに依存します。しかし、リミットが正しく設定されていれば、あるPodが誤動作している場合でも、他のPodのワークロードやシステムプロセスがPIDを使い果たすことはないと保証することができます。

## {{% heading "whatsnext" %}}

- [PID制限の強化に関するドキュメント](https://github.com/kubernetes/enhancements/blob/097b4d8276bc9564e56adf72505d43ce9bc5e9e8/keps/sig-node/20190129-pid-limiting.md)で詳細情報を確認できます。
- 歴史的背景について学ぶために、[Kubernetes 1.14での安定性向上のためのプロセスID制限](/blog/2019/04/15/process-id-limiting-for-stability-improvements-in-kubernetes-1.14/)をご覧ください。
- [コンテナのリソース管理](/ja/docs/concepts/configuration/manage-resources-containers/)についてご覧ください。
- [リソース不足時の対応設定](/docs/concepts/scheduling-eviction/node-pressure-eviction/)の方法について学ぶことができます。