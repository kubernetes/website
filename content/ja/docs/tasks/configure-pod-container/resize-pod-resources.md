---
title: Podに割り当てるCPUとメモリリソースを変更する
content_type: task
weight: 30
min-kubernetes-server-version: 1.35
---

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodLevelResourcesVerticalScaling" >}}

このページでは、Podを再作成することなく、Podレベルで設定されたCPUリソースやメモリリソースを変更する方法を説明します。

インプレースPodリサイズ機能を使用すると、アプリケーションを中断することなく実行中のPodのリソース割り当てを変更することができます。個別のコンテナのリソースをリサイズする手順については、[コンテナに割り当てるCPUとメモリ容量を変更する](/docs/tasks/configure-pod-container/resize-container-resources)で取り上げています。

このページは、インプレースなPodレベルリソースのリサイズに焦点を当てています。Podレベルのリソースは `spec.resources` で定義され、Pod内の各コンテナが消費するリソースの合計の上限として機能します。インプレースPodレベルリソースリサイズ機能により、実行中のPodに対して、Pod全体のCPUとメモリの割り当て量を直接変更できます。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

コントロールプレーンおよびクラスター内のすべてのノードで、以下の[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)を有効化する必要があります:

* [`InPlacePodLevelResourcesVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodLevelResourcesVerticalScaling)
* [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources)
* [`InPlacePodVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScaling)
* [`NodeDeclaredFeatures`](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)

`--subresource=resize` フラグを使用するには、kubectlクライアントのバージョンがv1.32以上である必要があります。

## Podのリサイズステータスと再試行ロジック {#pod-resize-status-and-retry-logic}

`kubelet` がリソースの変更を追跡および再試行するために使用するメカニズムは、コンテナレベルとPodレベルのリサイズ要求で共通です。

ステータス、理由、および再試行の優先度は、コンテナのリサイズで定義されているものと同様で、以下のとおりです。

* ステータス条件: `kubelet` は、要求の状態を伝えるためにPodResizePending(InfeasibleやDeferredなどの理由を伴う)およびPodResizeInProgressを使用します。

* 再試行優先度: 保留された(Deferred)リサイズは、PriorityClass、次いでQoSクラス(BurstableよりGuaranteedを優先)、そして最後に保留されている期間に基づいて再試行されます。

* 追跡: `observedGeneration` フィールドを使用することで、直近で処理されたリサイズ要求のステータスがどのPod仕様(metadata.generation)に対応しているかを追跡できます。

これらの条件および再施行ロジックの完全な説明については、コンテナのリサイズに関するドキュメントの[Podリサイズステータス](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status)セクションを参照してください。

## コンテナリサイズポリシーとPodレベルのリサイズ {#container-resize-policy-and-pod-level-resize}

Podレベルのリソースリサイズは、独自の再起動ポリシーをサポートしておらず、必要ともしません。

* Podレベルのポリシーは不要: Podの合計リソース(spec.resources)に対する変更は、再起動を発生させることなく、常にインプレースで適用されます。これは、PodレベルのリソースがPodのcgroupに対する全体的な制約として機能するものであり、コンテナ内のアプリケーションランタイムを直接管理するわけではないからです。

* [コンテナのポリシー](/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-policies)が引き続き適用される: `resizePolicy` は、引き続きコンテナレベル(spec.containers[*].resizePolicy)で設定する必要があります。このポリシーは、リソース要求や制限が変更されたときに個々のコンテナが再起動されるかどうかを制御します。これは、その変更がコンテナレベルの直接的なリサイズによるものか、Podレベル全体のリソース枠の更新によるものかを問いません。

## 制限事項 {#limitations}

Kubernetes {{< skew currentVersion >}} において、Podレベルのリソースをインプレースでリサイズする際には、コンテナレベルのリソースリサイズで説明されているすべての制限事項が適用されます。これらは[コンテナに割り当てるCPUとメモリ容量を変更する: 制限事項](/docs/tasks/configure-pod-container/resize-container-resources/#limitations)で確認できます。

さらに、Podレベルのリソースのリサイズに固有の制約として以下のようなものがあります。

* コンテナの要求の検証: リサイズ後のPodレベルのリソース要求(spec.resources.requests)が、Pod内の各コンテナの対応するリソース要求の合計以上である場合にのみ、リサイズが許可されます。これにより、Podに対して最低限保証されるリソースの可用性が維持されます。

* コンテナの制限の検証: 各コンテナの制限がPodレベルのリソース制限(spec.resources.limits)以下である場合に、リサイズが許可されます。Podレベルの制限は単一のコンテナが超えてはならない上限として機能しますが、コンテナ制限の合計がPodレベルの制限を超えることは許可されており、これによってPod内のコンテナ間でリソースの共有が可能になります。

## 例: Podレベルリソースのリサイズ {#example-resizing-pod-level-resources}

First, create a Pod designed for in-place CPU resize and restart-required memory resize.

{{% code_sample file="pods/resource/pod-level-resize.yaml" %}}

Create the pod:

```shell
kubectl create -f pod-level-resize.yaml
```

This pod starts in the Guaranteed QoS class as pod-level requests are equal to limits. Verify its initial state:

```shell
# Wait a moment for the pod to be running
kubectl get pod pod-level-resize-demo --output=yaml
```

Observe the `spec.resources`(200m CPU, 200Mi memory). Note the
`status.containerStatuses[0].restartCount` (should be 0) and
`status.containerStatuses[1].restartCount` (should be 0).

Now, increase the pod-level CPU request and limit to `300m`. You use `kubectl patch` with the `--subresource resize` command line argument.

```shell
kubectl patch pod pod-level-resize-demo --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"300m"}, "limits":{"cpu":"300m"}}}}'

# Alternative methods:
# kubectl edit pod pod-level-resize-demo --subresource resize
# kubectl apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
The `--subresource resize` command line argument requires `kubectl` client version v1.32.0 or later.
Older versions will report an `invalid subresource` error.
{{< /note >}}

Check the pod status again after patching:

```shell
kubectl get pod pod-level-resize-demo --output=yaml
```

You should see:

* `spec.resources.requests` and `spec.resources.limits` now show `cpu: 300m`.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU
  `resizePolicy` was `NotRequired`.
* `status.containerStatuses[1].restartCount` increased to `1` indicating the
  container was restarted to apply the CPU change. The restart occurred in Container 1 despite the resize being applied at the Pod level, due to the intricate relationship between Pod-level limits and container-level policies. Because Container 1 did not specify an explicit CPU limit, its underlying resource configuration (For example, cgroups) implicitly adopted the Pod's overall CPU limit as its effective maximum consumption boundary. When the Pod-level CPU limit was patched from 200m to 300m, this action consequently changed the implicit limit enforced on Container 1. Since Container 1 had its resizePolicy explicitly set to RestartContainer for CPU, the `kubelet` was obligated to restart the container to correctly apply this change in the underlying resource enforcement mechanism, thus confirming that altering Pod-level limits can trigger container restart policies even when container limits are not directly defined.

## クリーンアップ {#clean-up}

Delete the pod:

```shell
kubectl delete pod pod-level-resize-demo
```

## {{% heading "whatsnext" %}}

### アプリケーション開発者向け {#for-application-developers}

* [コンテナおよびPodへのメモリーリソースの割り当て](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [コンテナおよびPodへのCPUリソースの割り当て](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [PodレベルでのCPUとメモリリソースの割り当て](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

### クラスター管理者向け {#for-cluster-administrators}

* [Namespaceのデフォルトのメモリ要求と制限を設定する](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [NamespaceのデフォルトのCPU要求と制限を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Namespaceに対する最小および最大メモリー制約の構成](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Namespaceの最小および最大CPU制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [NamespaceのメモリおよびCPUクォータを設定する](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
