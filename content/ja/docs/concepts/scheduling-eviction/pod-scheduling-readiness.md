---
title: Podのスケジューリング準備
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.30" state="stable" >}}

Podは1度作成されると、スケジュールの準備ができたとみなされます。Kubernetesのスケジューラーは、すべての保留中のPodを配置するためにノードを見つけることに最善を尽くします。しかし実際のケースでは、一部のPodが「必要なリソースを満たさない」状態に長期間とどまることがあります。このようなPodは、実際にはスケジューラー(およびCluster AutoScalerのようなダウンストリームのインテグレーター)を不必要に混乱させます。

Podの`.spec.schedulingGates`を指定したり削除したりすることで、Podがスケジューリングの対象になるタイミングを制御できます。

<!-- body -->

## PodにschedulingGatesを設定する

`schedulingGates`のフィールドは、文字列のリストで構成されており、各文字列はPodがスケジューリング可能とみなされる前に満たすべき条件を表します。このフィールドは、Pod作成時のみ初期化できます(クライアントによる作成時、またはアドミッション中の変更時)。作成後、個々のschedulingGateは順序不同で削除できますが、新しいschedulingGateを追加することはできません。

{{< figure src="/docs/images/podSchedulingGates.svg" alt="pod-scheduling-gates-diagram" caption="Pod スケジューリングゲートの図" class="diagram-large" link="https://mermaid.live/edit#pako:eNplkktTwyAUhf8KgzuHWpukaYszutGlK3caFxQuCVMCGSDVTKf_XfKyPlhxz4HDB9wT5lYAptgHFuBRsdKxenFMClMYFIdfUdRYgbiD6ItJTEbR8wpEq5UpUfnDTf-5cbPoJjcbXdcaE61RVJIiqJvQ_Y30D-OCt-t3tFjcR5wZayiVnIGmkv4NiEfX9jijKTmmRH5jf0sRugOP0HyHUc1m6KGMFP27cM28fwSJDluPpNKaXqVJzmFNfHD2APRKSjnNFx9KhIpmzSfhVls3eHdTRrwG8QnxKfEZUUNeYTDBNbiaKRF_5dSfX-BQQQ0FpnEqQLJWhwIX5hyXsjbYl85wTINrgeC2EZd_xFQy7b_VJ6GCdd-itkxALE84dE3fAqXyIUZya6Qqe711OspVCI2ny2Vv35QqVO3-htt66ZWomAvVcZcv8yTfsiSFfJOydZoKvl_ttjLJVlJsblcJw-czwQ0zr9ZeqGDgeR77b2jD8xdtjtDn" >}}

## 使用例

Podがスケジューリングされる準備ができていないと示すには、次のように1つ以上のスケジューリングゲートを使って作成します。

{{% code_sample file="pods/pod-with-scheduling-gates.yaml" %}}

Podの作成後、状態を確認するには以下のようにします。

```bash
kubectl get pod test-pod
```

出力から`SchedulingGated`状態であることがわかります。

```none
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          7s
```

また、`schedulingGates`フィールドから確認することもできます。

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

出力は以下のようになります。

```none
[{"name":"example.com/foo"},{"name":"example.com/bar"}]
```

このPodがスケジューリング可能であることをスケジューラーに知らせるには、変更したマニフェストを再適用することで、`schedulingGates`を完全に削除できます。

{{% code_sample file="pods/pod-without-scheduling-gates.yaml" %}}

`schedulingGates`が削除されているかどうかは、以下のように確認できます。

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

出力は、空であることが期待されます。そして、以下のように実行することで最新の状態を確認することができます。

```bash
kubectl get pod test-pod -o wide
```

test-podがCPU/メモリリソースを要求しないため、このPodのステータスは、以前の`SchedulingGated`から`Running`に遷移することが予想されます。

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

## 可観測性

`scheduler_pending_pods`メトリックには、Podがスケジューリングされようとしているがスケジューリング不可能とされているのか、それとも明示的にスケジューリングの準備ができておらずマークされているのかを区別する新しいラベル`"gated"`があります。`scheduler_pending_pods{queue="gated"}`でメトリックの結果を確認できます。

## 変更可能なPodのスケジューリング命令

Podにスケジューリングゲートが設定されている間、Podのスケジューリング命令は、一定の制約のもとで変更できます。高いレベルでは、Podのスケジューリング命令を厳格にすることしかできません。言い換えると、更新された命令は、Podが以前マッチしていたノードのサブセットでしかスケジューリングできなくなります。より具体的には、Podのスケジューリング命令を更新するルールは以下のようになります。

1. `.spec.nodeSelector`は、追加のみが許可されます。 存在しない場合は設定が許可されます。

2. `spec.affinity.nodeAffinity`は、空の場合、何でも設定できます。

3. `NodeSelectorTerms`が空の場合、設定が許可されます。 空でない場合は、`matchExpressions`または`fieldExpressions`への`NodeSelectorRequirements`の追加のみが許可され、既存の`matchExpressions`および`fieldExpressions`への変更は許可されません。これは、`.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`の項目がORで結合されるのに対し、`nodeSelectorTerms[].matchExpressions`および`nodeSelectorTerms[].fieldExpressions`の項目はANDで結合されるためです。

4. `.preferredDuringSchedulingIgnoredDuringExecution`は、すべての更新が許可されます。これは、優先項目の権威がないため、ポリシーコントローラーがこれらの項目を検証しないためです。


## {{% heading "whatsnext" %}}

* 詳しくは[PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness)をお読みください。
