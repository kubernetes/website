---
title: クラスターのトラブルシューティング
description: 一般的なクラスターの問題をデバッグします。
weight: 20
no_list: true
---

<!-- overview -->

このドキュメントはクラスターのトラブルシューティングに関するもので、あなたが経験している問題の根本原因として、アプリケーションをすでに除外していることを前提としています。
アプリケーションのデバッグのコツは、[アプリケーションのトラブルシューティングガイド](/ja/docs/tasks/debug/debug-application/)をご覧ください。
また、[トラブルシューティングドキュメント](/docs/tasks/debug/)にも詳しい情報があります。

{{<glossary_tooltip text="kubectl" term_id="kubectl">}}のトラブルシューティングについては、[kubectlのトラブルシューティング](/docs/tasks/debug/debug-cluster/troubleshoot-kubectl/)を参照してください。

<!-- body -->

## クラスターのリストアップ

クラスターで最初にデバッグするのは、ノードがすべて正しく登録されているかどうかです。

以下を実行します。

```shell
kubectl get nodes
```

そして、期待するノードがすべて存在し、それらがすべて `Ready` 状態であることを確認します。

クラスター全体の健全性に関する詳細な情報を得るには、以下を実行します。

```shell
kubectl cluster-info dump
```

### 例: ダウンあるいは到達不能なノードのデバッグ

デバッグを行う際、ノードの状態を見ることが有用なことがあります。
たとえば、そのノード上で動作しているPodが奇妙な挙動を示している場合や、なぜPodがそのノードにスケジュールされないのかを知りたい場合などです。
Podと同様に、`kubectl describe node`や`kubectl get node -o yaml`を使用してノードに関する詳細情報を取得できます。
例えば、ノードがダウンしている(ネットワークから切断されている、またはkubeletが停止して再起動しないなど)場合に見られる状況は以下の通りです。
ノードがNotReadyであることを示すイベントに注意し、また、Podが動作していないことにも注意してください(NotReady状態が5分間続くとPodは追い出されます)。

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kube-worker-1            NotReady     <none>    1h      v1.23.3
kubernetes-node-bols     Ready        <none>    1h      v1.23.3
kubernetes-node-st6x     Ready        <none>    1h      v1.23.3
kubernetes-node-unaj     Ready        <none>    1h      v1.23.3
```

```shell
kubectl describe node kube-worker-1
```

```none
Name:               kube-worker-1
Roles:              <none>
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=kube-worker-1
                    kubernetes.io/os=linux
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: /run/containerd/containerd.sock
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Thu, 17 Feb 2022 16:46:30 -0500
Taints:             node.kubernetes.io/unreachable:NoExecute
                    node.kubernetes.io/unreachable:NoSchedule
Unschedulable:      false
Lease:
  HolderIdentity:  kube-worker-1
  AcquireTime:     <unset>
  RenewTime:       Thu, 17 Feb 2022 17:13:09 -0500
Conditions:
  Type                 Status    LastHeartbeatTime                 LastTransitionTime                Reason              Message
  ----                 ------    -----------------                 ------------------                ------              -------
  NetworkUnavailable   False     Thu, 17 Feb 2022 17:09:13 -0500   Thu, 17 Feb 2022 17:09:13 -0500   WeaveIsUp           Weave pod has set this
  MemoryPressure       Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  DiskPressure         Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  PIDPressure          Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  Ready                Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
Addresses:
  InternalIP:  192.168.0.113
  Hostname:    kube-worker-1
Capacity:
  cpu:                2
  ephemeral-storage:  15372232Ki
  hugepages-2Mi:      0
  memory:             2025188Ki
  pods:               110
Allocatable:
  cpu:                2
  ephemeral-storage:  14167048988
  hugepages-2Mi:      0
  memory:             1922788Ki
  pods:               110
System Info:
  Machine ID:                 9384e2927f544209b5d7b67474bbf92b
  System UUID:                aa829ca9-73d7-064d-9019-df07404ad448
  Boot ID:                    5a295a03-aaca-4340-af20-1327fa5dab5c
  Kernel Version:             5.13.0-28-generic
  OS Image:                   Ubuntu 21.10
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  containerd://1.5.9
  Kubelet Version:            v1.23.3
  Kube-Proxy Version:         v1.23.3
Non-terminated Pods:          (4 in total)
  Namespace                   Name                                 CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                 ------------  ----------  ---------------  -------------  ---
  default                     nginx-deployment-67d4bdd6f5-cx2nz    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  default                     nginx-deployment-67d4bdd6f5-w6kd7    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  kube-system                 kube-proxy-dnxbz                     0 (0%)        0 (0%)      0 (0%)           0 (0%)         28m
  kube-system                 weave-net-gjxxp                      100m (5%)     0 (0%)      200Mi (10%)      0 (0%)         28m
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1100m (55%)  1 (50%)
  memory             456Mi (24%)  256Mi (13%)
  ephemeral-storage  0 (0%)       0 (0%)
  hugepages-2Mi      0 (0%)       0 (0%)
Events:
...
```

```shell
kubectl get node kube-worker-1 -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  annotations:
    kubeadm.alpha.kubernetes.io/cri-socket: /run/containerd/containerd.sock
    node.alpha.kubernetes.io/ttl: "0"
    volumes.kubernetes.io/controller-managed-attach-detach: "true"
  creationTimestamp: "2022-02-17T21:46:30Z"
  labels:
    beta.kubernetes.io/arch: amd64
    beta.kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    kubernetes.io/hostname: kube-worker-1
    kubernetes.io/os: linux
  name: kube-worker-1
  resourceVersion: "4026"
  uid: 98efe7cb-2978-4a0b-842a-1a7bf12c05f8
spec: {}
status:
  addresses:
  - address: 192.168.0.113
    type: InternalIP
  - address: kube-worker-1
    type: Hostname
  allocatable:
    cpu: "2"
    ephemeral-storage: "14167048988"
    hugepages-2Mi: "0"
    memory: 1922788Ki
    pods: "110"
  capacity:
    cpu: "2"
    ephemeral-storage: 15372232Ki
    hugepages-2Mi: "0"
    memory: 2025188Ki
    pods: "110"
  conditions:
  - lastHeartbeatTime: "2022-02-17T22:20:32Z"
    lastTransitionTime: "2022-02-17T22:20:32Z"
    message: Weave pod has set this
    reason: WeaveIsUp
    status: "False"
    type: NetworkUnavailable
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient memory available
    reason: KubeletHasSufficientMemory
    status: "False"
    type: MemoryPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has no disk pressure
    reason: KubeletHasNoDiskPressure
    status: "False"
    type: DiskPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient PID available
    reason: KubeletHasSufficientPID
    status: "False"
    type: PIDPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:15:15Z"
    message: kubelet is posting ready status. AppArmor enabled
    reason: KubeletReady
    status: "True"
    type: Ready
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10250
  nodeInfo:
    architecture: amd64
    bootID: 22333234-7a6b-44d4-9ce1-67e31dc7e369
    containerRuntimeVersion: containerd://1.5.9
    kernelVersion: 5.13.0-28-generic
    kubeProxyVersion: v1.23.3
    kubeletVersion: v1.23.3
    machineID: 9384e2927f544209b5d7b67474bbf92b
    operatingSystem: linux
    osImage: Ubuntu 21.10
    systemUUID: aa829ca9-73d7-064d-9019-df07404ad448
```

## ログの確認

今のところ、クラスターをより深く掘り下げるには、関連するマシンにログインする必要があります。
以下は、関連するログファイルの場所です。
(systemdベースのシステムでは、代わりに`journalctl`を使う必要があるかもしれないことに注意してください)

### コントロールプレーンノード

* `/var/log/kube-apiserver.log` - APIの提供を担当するAPIサーバーのログ
* `/var/log/kube-scheduler.log` - スケジューリング決定責任者であるスケジューラーのログ
* `/var/log/kube-controller-manager.log` - スケジューリングを除く、ほとんどのKubernetes組み込みの{{<glossary_tooltip text="コントローラー" term_id="controller">}}を実行するコンポーネントのログ(スケジューリングはkube-schedulerが担当します)

### ワーカーノード

* `/var/log/kubelet.log` - ノード上でコンテナの実行を担当するKubeletのログ
* `/var/log/kube-proxy.log` - サービスのロードバランシングを担うKube Proxyのログ

## クラスター障害モードの一般的な概要

これは、問題が発生する可能性のある事柄と、問題を軽減するためにクラスターのセットアップを調整する方法の不完全なリストです。

### 根本的な原因

- VMのシャットダウン
- クラスター内、またはクラスターとユーザー間のネットワークパーティション
- Kubernetesソフトウェアのクラッシュ
- データの損失や永続的ストレージ(GCE PDやAWS EBSボリュームなど)の使用不能
- Kubernetesソフトウェアやアプリケーションソフトウェアの設定ミスなど、オペレーターのミス

### 具体的なシナリオ

- apiserver VMのシャットダウンまたはapiserverのクラッシュ
  - その結果
    - 新しいPod、サービス、レプリケーションコントローラーの停止、更新、起動ができない
    - Kubernetes APIに依存していない限り、既存のPodやサービスは正常に動作し続けるはずです
- apiserverのバックアップストレージが失われた
  - その結果
    - apiserverが立ち上がらない
    - kubeletは到達できなくなりますが、同じPodを実行し、同じサービスのプロキシを提供し続けます
    - apiserverを再起動する前に、手動でapiserverの状態を回復または再現する必要がある
- サポートサービス(ノードコントローラー、レプリケーションコントローラーマネージャー、スケジューラーなど)VMのシャットダウンまたはクラッシュ
  - 現在、これらはapiserverとコロケーションしており、使用できない場合はapiserverと同様の影響があります
  - 将来的には、これらも複製されるようになり、同じ場所に配置されない可能性があります
  - 独自の永続的な状態を持っていない
- 個別ノード(VMまたは物理マシン)のシャットダウン
  - その結果
    - そのノード上のPodの実行を停止
- ネットワークパーティション
  - その結果
    - パーティションAはパーティションBのノードがダウンしていると考え、パーティションBはapiserverがダウンしていると考えています。(マスターVMがパーティションAで終了したと仮定)
- Kubeletソフトウェア障害
  - その結果
    - クラッシュしたkubeletがノード上で新しいPodを起動できない
    - kubeletがPodを削除するかどうか
    - ノードが不健全と判定される
    - レプリケーションコントローラーが別の場所で新しいPodを起動する
- クラスターオペレーターエラー
  - その結果
    - PodやServiceなどの損失
    - apiserverのバックエンドストレージの紛失
    - ユーザーがAPIを読めなくなる
    - その他

### 軽減策

- 対処法: IaaSプロバイダーの自動VM再起動機能をIaaS VMに使用する
  - 異常: Apiserver VMのシャットダウンまたはApiserverのクラッシュ
  - 異常: サポートサービスのVMシャットダウンまたはクラッシュ

- 対処法: IaaSプロバイダーの信頼できるストレージ(GCE PDやAWS EBSボリュームなど)をapiserver+etcdを使用するVMに使用する
  - 異常: Apiserverのバックエンドストレージが失われる

- 対処法: [高可用性](/docs/setup/production-environment/tools/kubeadm/high-availability/)構成を使用します
  - 異常: コントロールプレーンノードのシャットダウンまたはコントロールプレーンコンポーネント(スケジューラー、APIサーバー、コントローラーマネージャー)のクラッシュ
    - 1つ以上のノードまたはコンポーネントの同時故障に耐えることができる
  - 異常: APIサーバーのバックアップストレージ(etcdのデータディレクトリーなど)が消失
    - HA(高可用性)etcdの構成を想定しています

- 対処法: apiserver PDs/EBS-volumesを定期的にスナップショットする
  - 異常: Apiserverのバックエンドストレージが失われる
  - 異常: 操作ミスが発生する場合がある
  - 異常: Kubernetesのソフトウェアに障害が発生する場合がある

- 対処法：レプリケーションコントローラーとServiceをPodの前に使用する
  - 異常: ノードのシャットダウン
  - 異常: Kubeletソフトウェア障害

- 対処法: 予期せぬ再起動に耐えられるように設計されたアプリケーション(コンテナ)
  - 異常: ノードのシャットダウン
  - 異常: Kubeletソフトウェア障害

## {{% heading "whatsnext" %}}

* [リソースメトリクスパイプライン](/ja/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)で利用可能なメトリクスについて学ぶ
* [リソース使用状況の監視](/ja/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)に役立つ追加ツールを探す
* Node Problem Detectorを使用して[ノードの健康状態を監視する](/ja/docs/tasks/debug/debug-cluster/monitor-node-health/)
* `kubectl debug node`を使用して[Kubernetesノードをデバッグする](/docs/tasks/debug/debug-cluster/kubectl-node-debug)
* `crictl`を使用して[Kubernetesノードをデバッグする](/ja/docs/tasks/debug/debug-cluster/crictl/)
* [Kubernetesの監査](/ja/docs/tasks/debug/debug-cluster/audit/)に関する詳細な情報を得る
* `telepresence`を使用して[ローカルでサービスを開発・デバッグする](/ja/docs/tasks/debug/debug-cluster/local-debugging/)
