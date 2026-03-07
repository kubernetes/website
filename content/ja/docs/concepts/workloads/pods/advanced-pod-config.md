---
title: 高度なPod設定
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 180
---

<!-- overview -->

このページでは、[PriorityClass](#priorityclasses)、[RuntimeClass](#runtimeclasses)、Pod内の[セキュリティコンテキスト](#security-context)を含む高度なPod設定に関するトピックを扱い、[スケジューリング](/docs/concepts/scheduling-eviction/#scheduling)との関連についても説明します。

<!-- body -->

## PriorityClass {#priorityclasses}

_PriorityClass_ を使用すると、他のPodと比較したPodの重要度を設定することができます。
PodにPriorityClassを割り当てると、Kubernetesは指定したPriorityClassに基づいて、そのPodの`.spec.priority`フィールドを設定します(ただし、`.spec.priority`を直接設定することはできません)。
Podがスケジュールできず、その問題がリソース不足によるものである場合、{{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}は、より高い優先度のPodのスケジューリングを可能にするため、より低い優先度のPodを{{< glossary_tooltip text="プリエンプト" term_id="preemption" >}}しようとします。

PriorityClassは、priorityClassNameを整数の優先度値にマッピングするクラスタースコープのAPIオブジェクトです。
数値が大きいほど高い優先度であることを示します。

### PriorityClassの定義 {#defining-a-priorityclass}

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 10000
globalDefault: false
description: "Priority class for high-priority workloads"
```

### PriorityClassを使用してPodの優先度を指定する {#specify-pod-priority-using-a-priorityclass}

{{< highlight yaml "hl_lines=9" >}}
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  priorityClassName: high-priority
{{< /highlight >}}

### ビルトインのPriorityClass {#built-in-priorityclasses}

Kubernetesは2つのビルトインのPriorityClassを提供します:
- `system-cluster-critical`: クラスターにとって重要なシステムコンポーネント用。
- `system-node-critical`: 個々のノードにとって重要なシステムコンポーネント用。
  これはKubernetesでPodが持つことができる最も高い優先度です。

詳細については、[Podの優先度とプリエンプション](/docs/concepts/scheduling-eviction/pod-priority-preemption/)を参照してください。

## RuntimeClass {#runtimeclasses}

_RuntimeClass_ を使用すると、Podの低レベルなコンテナランタイムを指定できます。
これは、異なる分離レベルやランタイム機能が必要な場合など、異なる種類のPodに対して異なるコンテナランタイムを指定したい場合に役立ちます。

### Pod定義の例 {#runtimeclass-pod-example}

{{< highlight yaml "hl_lines=6" >}}
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  containers:
  - name: mycontainer
    image: nginx
{{< /highlight >}}

[RuntimeClass](/docs/concepts/containers/runtime-class/)は、クラスター内の一部またはすべてのノードで利用可能なコンテナランタイムを表すクラスタースコープのオブジェクトです。

クラスター管理者は、RuntimeClassを支える具体的なランタイムをインストールおよび設定します。

管理者は、その特別なコンテナランタイム設定をすべてのノードに設定する場合もあれば、一部のノードのみに設定する場合もあります。

詳細については、[RuntimeClass](/docs/concepts/containers/runtime-class/)のドキュメントを参照してください。

## Podおよびコンテナレベルのセキュリティコンテキスト設定 {#security-context}

Pod仕様内の`securityContext`フィールドは、Podとコンテナのセキュリティ設定をきめ細かく制御できます。

### Pod全体の`securityContext` {#pod-level-security-context}

セキュリティ設定の中には、Pod全体に適用されるものがあります。
その他の設定については、コンテナレベルでオーバーライドせずにデフォルトを設定することもできます。

以下は、PodレベルでPod全体の`securityContext`を使用する例です:

#### Pod定義の例 {#pod-level-security-context-example}

{{< highlight yaml "hl_lines=5-9" >}}
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:  # この設定は、Pod全体に適用されます
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: ["sh", "-c", "sleep 1h"]
{{< /highlight >}}

### コンテナレベルのセキュリティコンテキスト {#container-level-security-context}

特定のコンテナに対してのみ、セキュリティコンテキストを指定できます。
以下はその例です:

#### Pod定義の例 {#container-level-security-context-example}

{{< highlight yaml "hl_lines=9-17" >}}
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo-2
spec:
  containers:
  - name: sec-ctx-demo-2
    image: gcr.io/google-samples/node-hello:1.0
    securityContext:
      allowPrivilegeEscalation: false
      runAsNonRoot: true
      runAsUser: 1000
      capabilities:
        drop:
        - ALL
      seccompProfile:
        type: RuntimeDefault
{{< /highlight >}}

### セキュリティコンテキストのオプション {#security-context-options}

- **ユーザーIDとグループID**: コンテナを実行するユーザー/グループを制御します
- **ケーパビリティ**: Linuxケーパビリティを追加または削除します
- **Seccompプロファイル**: セキュリティコンピューティングプロファイル(seccomp)を設定します
- **SELinuxオプション**: SELinuxコンテキストを設定します
- **AppArmor**: 追加のアクセス制御のためにAppArmorプロファイルを設定します
- **Windowsオプション**: Windows固有のセキュリティ設定を行います

{{< caution >}}
Podの`securityContext`を使用して、Linuxコンテナで[_特権モード_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)を許可することもできます。
特権モードは、`securityContext`の他の多くのセキュリティ設定を上書きします。
`securityContext`の他のフィールドを使用して同等の権限を付与できない場合を除き、この設定を使用することは避けてください。
Podレベルのセキュリティコンテキストで`windowsOptions.hostProcess`フラグを設定することで、同様の特権モードでWindowsコンテナを実行できます。
詳細とその手順については、[Windows HostProcess Podの作成](/docs/tasks/configure-pod-container/create-hostprocess-pod/)を参照してください。
{{< /caution >}}

詳細については、[Podまたはコンテナのセキュリティコンテキストの設定](/docs/tasks/configure-pod-container/security-context/)を参照してください。

## Podのスケジューリングを制御する {#scheduling}

Kubernetesは、Podがどのノードにスケジュールされるかを制御するためのいくつかのメカニズムを提供します。

### ノードセレクター {#node-selector}

最もシンプルな形式のノード選択制約:

{{< highlight yaml "hl_lines=9-11" >}}
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeSelector:
    disktype: ssd
{{< /highlight >}}

### ノードアフィニティ {#node-affinity}

ノードアフィニティを使用すると、Podをスケジュールできるノードを制約するルールを指定できます。
以下は、[`topology.kubernetes.io/zone`](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)ラベルの値に基づいて選択し、特定の大陸にあるとラベル付けされたノードでの実行を優先するPodの例です。

{{< highlight yaml "hl_lines=6-15" >}}
apiVersion: v1
kind: Pod
metadata:
  name: with-node-affinity
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - antarctica-east1
            - antarctica-west1
  containers:
  - name: with-node-affinity
    image: registry.k8s.io/pause:3.8
{{< /highlight >}}

### Podアフィニティとアンチアフィニティ {#pod-affinity-and-anti-affinity}

ノードアフィニティに加えて、ノード上ですでに実行されている _他のPod_ のラベルに基づいて、Podがスケジュールされるノードを制約することもできます。
Podアフィニティを使用すると、他のPodとの位置関係に基づいてPodを配置するルールを指定できます。

{{< highlight yaml "hl_lines=6-15" >}}
apiVersion: v1
kind: Pod
metadata:
  name: with-pod-affinity
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - database
        topologyKey: topology.kubernetes.io/zone
  containers:
  - name: with-pod-affinity
    image: registry.k8s.io/pause:3.8
{{< /highlight >}}

### Tolerations {#tolerations}

_Toleration_ を使用すると、一致するTaintを持つノードにPodをスケジュールできます:

{{< highlight yaml "hl_lines=9-13" >}}
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myapp
    image: nginx
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
{{< /highlight >}}

詳細については、[ノード上へのPodのスケジューリング](/docs/concepts/scheduling-eviction/assign-pod-node/)を参照してください。

## Podのオーバーヘッド {#pod-overhead}

Podのオーバーヘッドを使用すると、コンテナのリソース要求とリソース制限に加えて、Podのインフラストラクチャが消費するリソースを考慮できます。

{{< highlight yaml "hl_lines=7-10" >}}
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kvisor-runtime
handler: kvisor-runtime
overhead:
  podFixed:
    memory: "2Gi"
    cpu: "500m"
---
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: kvisor-runtime
  containers:
  - name: myapp
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
{{< /highlight >}}

## {{% heading "whatsnext" %}}

* [Podの優先度とプリエンプション](/docs/concepts/scheduling-eviction/pod-priority-preemption/)について読む
* [RuntimeClass](/docs/concepts/containers/runtime-class/)について読む
* [Podとコンテナにセキュリティコンテキストを設定する](/docs/tasks/configure-pod-container/security-context/)を参照する
* Kubernetesが[ノード上へPodをスケジューリングする](/docs/concepts/scheduling-eviction/assign-pod-node/)方法を学ぶ
* [Podのオーバーヘッド](/docs/concepts/scheduling-eviction/pod-overhead/)
