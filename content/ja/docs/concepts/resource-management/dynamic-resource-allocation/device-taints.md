---
title: デバイスTaintとToleration
content_type: concept
weight: 50
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1"
  kind: "DeviceTaintRule"
---

<!-- overview -->

このページでは、DRAにおけるデバイスのtaintとtolerationについて説明します。
これらを使用すると、ドライバーや管理者は特定のデバイス上でPodが実行されないようにしたり、すでにそれを使用しているPodを退避したりできます。

<!-- body -->

## デバイスTaintとToleration {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

デバイスのtaintはノードのtaintと似ています:
taintには文字列のキーと文字列の値、および効果があります。
効果は、taintされたデバイスを使用しているResourceClaimと、そのResourceClaimを参照しているすべてのPodに適用されます。
"NoSchedule"の効果は、それらのPodがスケジューリングされないようにします。
taintされたデバイスは、それを使用するPodのスケジューリングが妨げられるため、ResourceClaimを割り当てる際に無視されます。

"NoExecute"の効果は、"NoSchedule"を意味するのに加えて、すでにスケジュールされているすべてのPodを退避させます。
この退避は、kube-controller-managerのデバイスtaint退避コントローラーが影響を受けるPodを削除することで実装されています。

"None"の効果は、スケジューラーと退避コントローラーによって無視されます。
DRAドライバーはこれを使用して、デバイスの健全性が低下している場合など、管理者やその他のコントローラーに例外を通知できます。
管理者は、DeviceTaintRuleによってPod退避のdry-runを行うために使用することもできます(詳細は後述)。

ResourceClaimはtaintを許容することができます。
taintが許容される場合、その効果は適用されません。
空のtolerationはすべてのtaintに合致します。
tolerationは、特定の効果に限定したり、特定のキーと値の組み合わせに一致させたりできます。
tolerationでは、値に関係なく特定のキーが存在することを確認したり、キーの特定の値をチェックすることができます。
このマッチングについての詳細は、[ノードのtaintに関するコンセプト](/docs/concepts/scheduling-eviction/taint-and-toleration#concepts)を参照してください。

特定の期間にわたってtaintを許可することで、退避を遅延させることができます。
この遅延は、デバイスにtaintが追加された時点から開始され、taintのフィールドに記録されます。

上で説明した通り、taintはノード上の"すべて"のデバイスを割り当てるResourceClaimにも適用されます。
すべてのデバイスにtaintがついていないか、すべてのtaintが許容されている必要があります。
管理者アクセスを使用してデバイスを割り当てる場合([前述](#admin-access))も例外ではありません。
このモードを使用する管理者がtaintされたデバイスにアクセスするためには、すべてのtaintを明示的に許容する必要があります。

DeviceTaintRule API kindを使用して、次のようにデバイスにtaintを追加できます。

### ドライバーによって設定されるtaint {#taints-set-by-the-driver}

DRAドライバーは、ResourceSliceで公開されるデバイス情報にtaintを追加できます。
ドライバーがtaintを使用するかどうか、およびどのようなキーと値にするかについては、DRAドライバーのドキュメントを参照してください。

### 管理者によって設定されるtaint {#taints-set-by-an-admin}

{{< feature-state feature_gate_name="DRADeviceTaintRules" >}}

管理者またはコントロールプレーンのコンポーネントは、ResourceSliceのデバイス情報にtaintを含めるようDRAドライバーへ指示することなく、デバイスにtaintを設定できます。
これにはDeviceTaintRuleを作成します。
各DeviceTaintRuleは、デバイスセレクターに一致するデバイスに対して1つのtaintを追加します。
セレクターを指定しない場合、どのデバイスにもtaintは設定されません。
これにより、セレクターの指定を誤って省略した時に、ResourceClaimを使用しているすべてのPodが誤って退避されることを防ぎやすくします。

デバイスは、DeviceClass、ドライバー、プール、デバイスの名前のいずれか、またはそれらの組み合わせを指定して選択できます。
DeviceClassを指定すると、そのDeviceClassのセレクターによって選ばれたすべてのデバイスが選択されます。
ドライバー名だけの場合、例えばクラスター全体でそのドライバーのなんらかのメンテナンスを行う場合のように、管理者は、そのドライバーによって管理されるすべてのデバイスにtaintを設定できます。
プール名を追加すると、ドライバーがノードローカルデバイスを管理している場合に、taintを単一のノードに限定できます。

最後に、デバイス名を追加すると、特定の1つのデバイスを選択できます。
必要に応じて、デバイス名またはプール名だけを使用することもできます。
例えば、ノードローカルデバイス用のドライバーでは、プール名としてノード名を使用することが推奨されています。
このとき、そのプール名を指定したtaintを設定すると、自動的にノード上のすべてのデバイスにtaintが設定されます。

ドライバーによっては、現在どの具体的なデバイスがその名前に割り当てられているかを隠すために、"gpu-0"のような固定の名前を使用する場合があります。
特定のハードウェアインスタンスでtaintをサポートするために、ドライバーがそのハードウェアに対してベンダー固有の一意なID属性をサポートしている場合は、DeviceTaintRule内でCELセレクターを使用してその属性に一致させることができます。

taintは、DeviceTaintRuleが存在する限り適用されます。
それはいつでも変更または削除できます。
以下は、架空のDRAドライバーに対するDeviceTaintRuleの例です:

```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceTaintRule
metadata:
  name: example
spec:
  # この特定のドライバーに対応するハードウェアのすべてのインストールが破損しています。
  # すべてのPodを退避させ、新しいPodをスケジュールさせないようにします。
  deviceSelector:
    driver: dra.example.com
  taint:
    key: dra.example.com/unhealthy
    value: Broken
    effect: NoExecute
```

kube-apiserverは、`spec`の`timeAdded`フィールドを設定することで、このtaintが作成された日時を自動的に追跡します。
tolerationの期間は、このタイムスタンプから開始されます。
効果が変更されるアップデート(後述する擬似的な退避フローを参照)の間、kube-apiserverはタイムスタンプを自動的に更新します。
ユーザーは、DeviceTaintRuleの作成時にこのフィールドを設定し、アップデート時に別の値へ変更することで、タイムスタンプを明示的に制御できます。

statusには退避コントローラーによって追加された条件が含まれます:

```
kubectl describe devicetaintrules
```

```
Name:         example
...
Spec:
  Device Selector:
    Driver:  dra.example.com
  Taint:
    Effect:      NoExecute
    Key:         dra.example.com/unhealthy
    Time Added:  2025-11-05T18:15:37Z
    Value:       Broken
Status:
  Conditions:
    Last Transition Time:  2025-11-05T18:15:37Z
    Message:               1 pod evicted since starting the controller.
    Observed Generation:   1
    Reason:                Completed
    Status:                False
    Type:                  EvictionInProgress
Events:                    <none>
```

Podは削除によって退避されます。
通常これは、taintに対するtolerationによって一定期間遅延する場合や、退避する必要のあるPodが大量にある場合を除き、非常に短時間で行われます。
処理に時間がかかる場合、messageに現在の状態に関する情報が提供されます:

    2 pods need to be evicted in 2 different namespaces. 1 pod evicted since starting the controller.

conditionを使用すると、現在退避の実行中かどうかを確認できます:

    kubectl wait --for=condition=EvictionInProgress=false DeviceTaintRule/example

スケジューラーとコントローラーが新しいtaintを異なるタイミングで認識することで、競合状態が発生し、コントローラーが退避の必要なPodはないと判断してconditionを`False`に設定しても、Podがスケジュールされてしまう可能性があることに注意してください。
実際には、意図的に数秒間待ってからstatusを更新するため、この競合が発生する可能性は非常に低いです。

`effect: None`の場合、messageには、影響を受けるデバイスの数、そのうちの割り当て済みデバイスの数、効果が`NoExecute`である場合に退避されるPodの数に関する情報が提供されます。
これを使用して、実際に退避が開始される前にdry-runを実行できます:

- 目的のセレクターと`effect: None`を指定してDeviceTaintRuleを作成します。

- messageを確認します:

  ```
  3 published devices selected. 1 allocated device selected.
  1 pod would be evicted in 1 namespace if the effect was NoExecute.
  This information will not be updated again. Recreate the DeviceTaintRule to trigger an update.
  ```

  公開済みデバイスとは、ResourceSliceに一覧表示されているデバイスです。
  これらのデバイスにtaintを設定すると、新しいPodへの割り当てが妨げられます。
  割り当て済みのデバイスだけが、それらを使用しているPodの退避を引き起こします。

- DeviceTaintRuleを編集し、効果を`NoExecute`に変更します。

