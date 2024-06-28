---
title: Podスケジューリング準備状態
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.30" state="stable" >}}

Podは1度作成されると、スケジュールの準備ができたとみなされます。Kubernetesのスケジューラーは、すべての保留中のPodを配置するためのノードを見つけることに最善を尽くします。しかし実際のケースでは、一部のPodが「必要なリソースを満たさない」状態に長期間とどまることがあります。このようなPodは、実際にはスケジューラー（およびCluster AutoScalerのようなダウンストリームのインテグレーター）を不必要に混乱させます。

Podの`.spec.schedulingGates`を指定したり削除することで、Podがスケジューリングの対象になるタイミングを制御できます。

<!-- body -->

## PodにschedulingGatesを設定する

`schedulingGates`のフィールドは、文字列のリストで構成されており、各文字列はPodがスケジューリング可能とみなされる前に満たすべき条件を表します。このフィールドは、Pod 作成時のみ初期化できます(クライアントによる作成時、または Admission webhook による変更時)。作成後、個々のschedulingGateは順序不同で削除できますが、新しいschedulingGateを追加することはできません。

{{< figure src="/docs/images/podSchedulingGates.svg" alt="pod-scheduling-gates-diagram" caption="Figure. Pod SchedulingGates" class="diagram-large" link="https://mermaid.live/edit#pako:eNplkktTwyAUhf8KgzuHWpukaYszutGlK3caFxQuCVMCGSDVTKf_XfKyPlhxz4HDB9wT5lYAptgHFuBRsdKxenFMClMYFIdfUdRYgbiD6ItJTEbR8wpEq5UpUfnDTf-5cbPoJjcbXdcaE61RVJIiqJvQ_Y30D-OCt-t3tFjcR5wZayiVnIGmkv4NiEfX9jijKTmmRH5jf0sRugOP0HyHUc1m6KGMFP27cM28fwSJDluPpNKaXqVJzmFNfHD2APRKSjnNFx9KhIpmzSfhVls3eHdTRrwG8QnxKfEZUUNeYTDBNbiaKRF_5dSfX-BQQQ0FpnEqQLJWhwIX5hyXsjbYl85wTINrgeC2EZd_xFQy7b_VJ6GCdd-itkxALE84dE3fAqXyIUZya6Qqe711OspVCI2ny2Vv35QqVO3-htt66ZWomAvVcZcv8yTfsiSFfJOydZoKvl_ttjLJVlJsblcJw-czwQ0zr9ZeqGDgeR77b2jD8xdtjtDn" >}}

## 使用例

Podをスケジューリングする準備ができていないと示すには、次のように1つ以上のスケジューリングゲートを使って作成します。

{{% code_sample file="pods/pod-with-scheduling-gates.yaml" %}}

Podの作成後、Podの状態を確認するには、以下のようにします。

```bash
kubectl get pod test-pod
```

出力から`SchedulingGated`状態であることがわかります。

```none
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          7s
```

また、`schedulingGates`フィールドを実行して確認することもできます。

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

出力は以下のようになります。

```none
[{"name":"example.com/foo"},{"name":"example.com/bar"}]
```

このPodがスケジューリング可能であることをスケジューラに通知するには、変更したマニフェストを再適用することで、その`schedulingGates`を完全に削除できます。

{{% code_sample file="pods/pod-without-scheduling-gates.yaml" %}}

`schedulingGates`が削除されているかどうかは、実行することで確認できます。

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

出力は、空であることが期待されます。そして、以下のように実行することで最新の状態をチェックすることができます。

```bash
kubectl get pod test-pod -o wide
```

test-podがCPU/メモリーリソースを要求していないのであれば、予想通り、このポッドのステータスは、以前の`SchedulingGated`から`Running`に遷移するでしょう。

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

## Observability

The metric `scheduler_pending_pods` comes with a new label `"gated"` to distinguish whether a Pod
has been tried scheduling but claimed as unschedulable, or explicitly marked as not ready for
scheduling. You can use `scheduler_pending_pods{queue="gated"}` to check the metric result.

## Mutable Pod scheduling directives

You can mutate scheduling directives of Pods while they have scheduling gates, with certain constraints.
At a high level, you can only tighten the scheduling directives of a Pod. In other words, the updated
directives would cause the Pods to only be able to be scheduled on a subset of the nodes that it would
previously match. More concretely, the rules for updating a Pod's scheduling directives are as follows:

1. For `.spec.nodeSelector`, only additions are allowed. If absent, it will be allowed to be set.

2. For `spec.affinity.nodeAffinity`, if nil, then setting anything is allowed.

3. If `NodeSelectorTerms` was empty, it will be allowed to be set.
   If not empty, then only additions of `NodeSelectorRequirements` to `matchExpressions`
   or `fieldExpressions` are allowed, and no changes to existing `matchExpressions`
   and `fieldExpressions` will be allowed. This is because the terms in
   `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`, are ORed
   while the expressions in `nodeSelectorTerms[].matchExpressions` and
   `nodeSelectorTerms[].fieldExpressions` are ANDed.

4. For `.preferredDuringSchedulingIgnoredDuringExecution`, all updates are allowed.
   This is because preferred terms are not authoritative, and so policy controllers
   don't validate those terms.


## {{% heading "whatsnext" %}}

* Read the [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) for more details
