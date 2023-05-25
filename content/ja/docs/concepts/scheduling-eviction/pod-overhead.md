---
title: Podのオーバーヘッド
content_type: concept
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}


PodをNode上で実行する時に、Pod自身は大量のシステムリソースを消費します。これらのリソースは、Pod内のコンテナ(群)を実行するために必要なリソースとして追加されます。Podのオーバーヘッドは、コンテナの要求と制限に加えて、Podのインフラストラクチャで消費されるリソースを計算するための機能です。




<!-- body -->

Kubernetesでは、Podの[RuntimeClass](/docs/concepts/containers/runtime-class/)に関連するオーバーヘッドに応じて、[アドミッション](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)時にPodのオーバーヘッドが設定されます。

Podのオーバーヘッドを有効にした場合、Podのスケジューリング時にコンテナのリソース要求の合計に加えて、オーバーヘッドも考慮されます。同様に、Kubeletは、Podのcgroupのサイズ決定時およびPodの退役の順位付け時に、Podのオーバーヘッドを含めます。

## Podのオーバーヘッドの有効化　{#set-up}

クラスター全体で`PodOverhead`の[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効になっていること（1.18時点ではデフォルトでオンになっています）と、`overhead`フィールドを定義する`RuntimeClass`が利用されていることを確認する必要があります。

## 使用例

Podのオーバーヘッド機能を使用するためには、`overhead`フィールドが定義されたRuntimeClassが必要です。例として、仮想マシンとゲストOSにPodあたり約120MiBを使用する仮想化コンテナランタイムで、次のようなRuntimeClassを定義できます。

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata-fc
handler: kata-fc
overhead:
  podFixed:
    memory: "120Mi"
    cpu: "250m"
```

`kata-fc`RuntimeClassハンドラーを指定して作成されたワークロードは、リソースクォータの計算や、Nodeのスケジューリング、およびPodのcgroupのサイズ決定にメモリーとCPUのオーバーヘッドが考慮されます。

次のtest-podのワークロードの例を実行するとします。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox:1.28
    stdin: true
    tty: true
    resources:
      limits:
        cpu: 500m
        memory: 100Mi
  - name: nginx-ctr
    image: nginx
    resources:
      limits:
        cpu: 1500m
        memory: 100Mi
```

アドミッション時、RuntimeClass[アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/)は、RuntimeClass内に記述された`オーバーヘッド`を含むようにワークロードのPodSpecを更新します。もし既にPodSpec内にこのフィールドが定義済みの場合、そのPodは拒否されます。この例では、RuntimeClassの名前しか指定されていないため、アドミッションコントローラーは`オーバーヘッド`を含むようにPodを変更します。

RuntimeClassのアドミッションコントローラーの後、更新されたPodSpecを確認できます。

```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

出力は次の通りです:
```
map[cpu:250m memory:120Mi]
```
ResourceQuotaが定義されている場合、コンテナ要求の合計と`オーバーヘッド`フィールドがカウントされます。

kube-schedulerが新しいPodを実行すべきNodeを決定する際、スケジューラーはそのPodの`オーバーヘッド`と、そのPodに対するコンテナ要求の合計を考慮します。この例だと、スケジューラーは、要求とオーバーヘッドを追加し、2.25CPUと320MiBのメモリを持つNodeを探します。

PodがNodeにスケジュールされると、そのNodeのkubeletはPodのために新しい{{< glossary_tooltip text="cgroup" term_id="cgroup" >}}を生成します。基盤となるコンテナランタイムがコンテナを作成するのは、このPod内です。

リソースにコンテナごとの制限が定義されている場合(制限が定義されているGuaranteed QoSまたはBustrable QoS)、kubeletはそのリソース(CPUはcpu.cfs_quota_us、メモリはmemory.limit_in_bytes)に関連するPodのcgroupの上限を設定します。この上限は、コンテナの制限とPodSpecで定義された`オーバーヘッド`の合計に基づきます。

CPUについては、PodがGuaranteedまたはBurstable QoSの場合、kubeletはコンテナの要求の合計とPodSpecに定義された`オーバーヘッド`に基づいて`cpu.share`を設定します。

次の例より、ワークロードに対するコンテナの要求を確認できます。
```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

コンテナの要求の合計は、CPUは2000m、メモリーは200MiBです。
```
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

Nodeで観測される値と比較してみましょう。
```bash
kubectl describe node | grep test-pod -B2
```

出力では、2250mのCPUと320MiBのメモリーが要求されており、Podのオーバーヘッドが含まれていることが分かります。
```
  Namespace    Name       CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------    ----       ------------  ----------   ---------------  -------------  ---
  default      test-pod   2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

## Podのcgroupの制限を確認

ワークロードで実行中のNode上にある、Podのメモリーのcgroupを確認します。次に示す例では、CRI互換のコンテナランタイムのCLIを提供するNodeで[`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)を使用しています。これはPodのオーバーヘッドの動作を示すための高度な例であり、ユーザーがNode上で直接cgroupsを確認する必要はありません。

まず、特定のNodeで、Podの識別子を決定します。

```bash
# PodがスケジュールされているNodeで実行
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

ここから、Podのcgroupのパスが決定します。
```bash
# PodがスケジュールされているNodeで実行
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

結果のcgroupパスにはPodの`ポーズ中`コンテナも含まれます。Podレベルのcgroupは１つ上のディレクトリです。
```
  "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

今回のケースでは、Podのcgroupパスは、`kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`となります。メモリーのPodレベルのcgroupの設定を確認しましょう。
```bash
# PodがスケジュールされているNodeで実行
# また、Podに割り当てられたcgroupと同じ名前に変更
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

予想通り320MiBです。
```
335544320
```

### Observability

Podのオーバヘッドが利用されているタイミングを特定し、定義されたオーバーヘッドで実行されているワークロードの安定性を観察するため、[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)には`kube_pod_overhead`というメトリクスが用意されています。この機能はv1.9のkube-state-metricsでは利用できませんが、次のリリースで期待されています。それまでは、kube-state-metricsをソースからビルドする必要があります。



## {{% heading "whatsnext" %}}


* [RuntimeClass](/ja/docs/concepts/containers/runtime-class/)
* [Podのオーバーヘッドの設計](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
