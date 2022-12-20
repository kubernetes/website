---
title: Limit Range
content_type: concept
weight: 10
---

<!-- overview -->

デフォルトでは、コンテナは、Kubernetesクラスター上の[計算リソース](/ja/docs/concepts/configuration/manage-resources-containers/)の消費を制限されずに実行されます。リソースクォータを利用すれば、クラスター管理者はリソースの消費と作成を{{< glossary_tooltip text="名前空間" term_id="namespace" >}}ベースで制限することができます。名前空間内では、Podやコンテナは名前空間のリソースクォータで定義された範囲内でできるだけ多くのCPUとメモリーを消費できてしまうため、1つのPodまたはコンテナが利用可能なすべてのリソースを専有してしまう恐れがあります。LimitRangeを利用すれば、このような名前空間内での(Podやコンテナへの)リソースの割り当てを制限するポリシーを定めることができます。

<!-- body -->

*LimitRange*を利用すると、次のような制約を課せるようになります。

- 名前空間内のPodまたはコンテナごとに、計算リソースの使用量の最小値と最大値を強制する。
- 名前空間内のPersistentVolumeClaimごとに、ストレージリクエストの最小値と最大値を強制する。
- 名前空間内で、リソースのrequestとlimitの割合を強制する。
- 名前空間内の計算リソースのデフォルトのrequest/limitの値を設定して、実行時にコンテナに自動的に注入する。

## LimitRangeを有効にする

Kubernetes 1.10以降では、LimitRangeのサポートはデフォルトで有効になりました。

LimitRangeが特定の名前空間内で強制されるのは、その名前空間内にLimitRangeオブジェクトが存在する場合です。

LimitRangeオブジェクトの名前は、有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)でなければなりません。

### Limit Rangeの概要

- 管理者は、1つの名前空間に1つのLimitRangeを作成します。
- ユーザーは、Pod、コンテナ、PersistentVolumeClaimのようなリソースを名前空間内に作成します。
- `LimitRanger`アドミッションコントローラーは、計算リソース要求が設定されていないすべてのPodとコンテナに対して、デフォルト値と制限値を強制します。そして、リソースの使用量を追跡し、名前空間内に存在するすべてのLimitRangeで定義された最小値、最大値、割合を外れないことを保証します。
- LimitRangeの制約を破るようなリソース(Pod、コンテナ、PersistentVolumeClaim)の作成や更新を行うと、APIサーバーへのリクエストがHTTPステータスコード`403 FORBIDDEN`で失敗し、破られた制約を説明するメッセージが返されます。
- 名前空間内でLimitRangeが`cpu`や`memory`などの計算リソースに対して有効になっている場合、ユーザーはrequestsやlimitsに値を指定しなければなりません。指定しなかった場合、システムはPodの作成を拒否する可能性があります。
- LimitRangeの検証は、Podのアドミッションステージでのみ発生し、実行中のPodでは発生しません。

以下は、LimitRangeを使用して作成できるポリシーの例です。

- 8GiBのRAMと16コアのCPUの容量がある2ノードのクラスター上で、名前空間内のPodに対して、CPUには100mのrequestと最大500mのlimitの制約を課し、メモリーには200Miのrequestと600Miのlimitの制約を課す。
- Spec内のrequestsにcpuやmemoryを指定せずに起動したコンテナに対して、CPUにはデフォルトで150mのlimitとrequestを、メモリーにはデフォルトで300Miのrequestをそれぞれ定義する。

名前空間のlimitの合計が、Podやコンテナのlimitの合計よりも小さくなる場合、リソースの競合が起こる可能性があります。その場合、コンテナやPodは作成されません。

LimitRangeに対する競合や変更は、すでに作成済みのリソースに対しては影響しません。

## {{% heading "whatsnext" %}}

より詳しい情報は、[LimitRangerの設計ドキュメント](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)を参照してください。

制限の使用例については、以下のページを読んでください。

- [名前空間ごとにCPUの最小値と最大値の制約を設定する方法](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)。
- [名前空間ごとにメモリーの最小値と最大値の制約を設定する方法](/ja/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)。
- [名前空間ごとにCPUのRequestとLimitのデフォルト値を設定する方法](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)。
- [名前空間ごとにメモリーのRequestとLimitのデフォルト値を設定する方法](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)。
- [名前空間ごとにストレージ消費量の最小値と最大値を設定する方法](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage)。
- [名前空間ごとのクォータを設定する詳細な例](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)。
