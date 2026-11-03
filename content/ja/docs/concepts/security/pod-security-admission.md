---
title: Podのセキュリティアドミッション
description: >
  Podセキュリティの標準を強制するための、Podのセキュリティアドミッションコントローラーの概要
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Kubernetesの[Podセキュリティの標準](/docs/concepts/security/pod-security-standards/)はPodに対して異なる分離レベルを定義します。
これらの標準によって、Podの動作をどのように制限したいかを、明確かつ一貫した方法で定義することができます。

KubernetesはPodセキュリティの標準を強制するために、組み込みの _Pod Security_ {{< glossary_tooltip text="アドミッションコントローラー" term_id="admission-controller" >}}を提供しています。
Podセキュリティの制限は、Pod作成時に{{< glossary_tooltip text="名前空間" term_id="namespace" >}}レベルで適用されます。

### 組み込みのPodセキュリティアドミッションによる強制 {#built-in-pod-security-admission-enforcement}

このページは、Kubernetes v{{< skew currentVersion >}}のドキュメントの一部です。
異なるバージョンのKubernetesを利用している場合は、そのリリースのドキュメントを参照してください。

<!-- body -->

## Podのセキュリティレベル {#pod-security-levels}

Podのセキュリティアドミッションは、Podの[Security Context](/docs/tasks/configure-pod-container/security-context/)とその他の関連フィールドに、[Podセキュリティの標準](/docs/concepts/security/pod-security-standards/)で定義された3つのレベル、`privileged`、`baseline`、`restricted`に従って要件を設定するものです。
これらの要件の詳細については、[Podセキュリティの標準](/docs/concepts/security/pod-security-standards/)のページを参照してください。

## Podの名前空間に対するセキュリティアドミッションラベル {#pod-security-admission-labels-for-namespaces}

この機能を有効にするか、Webhookをインストールすると、名前空間を設定して、各名前空間でPodセキュリティに使用したいアドミッションコントロールモードを定義できます。
Kubernetesは、名前空間に使用したい定義済みのPodセキュリティの標準レベルのいずれかを適用するために設定できる{{< glossary_tooltip term_id="label" text="ラベル" >}}のセットを用意しています。
選択したラベルは、以下のように違反の可能性が検出された場合に{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}が取るアクションを定義します。

{{< table caption="Podのセキュリティアドミッションのモード" >}}
モード | 説明
:---------|:------------
**enforce** | ポリシーに違反した場合、Podは拒否されます。
**audit** | ポリシー違反は、[監査ログ](/docs/tasks/debug/debug-cluster/audit/)に記録されるイベントに監査アノテーションを追加するトリガーとなりますが、それ以外は許可されます。
**warn** | ポリシーに違反した場合は、ユーザーへの警告がトリガーされますが、それ以外は許可されます。
{{< /table >}}

名前空間は、任意のまたはすべてのモードを設定することができ、異なるモードに対して異なるレベルを設定することもできます。

各モードには、使用するポリシーを決定する2つのラベルがあります。

```yaml
# モードごとのレベルラベルは、そのモードに適用するポリシーレベルを示す。
#
# MODEは`enforce`、`audit`、`warn`のいずれかでなければならない。
# LEVELは`privileged`、`baseline`、`restricted`のいずれかでなければならない。
pod-security.kubernetes.io/<MODE>: <LEVEL>

# オプション: モードごとのバージョンラベルは、Kubernetesのマイナーバージョンに同梱される
# バージョンにポリシーを固定するために使用できる（例えばv{{< skew currentVersion >}}など）。
#
# MODEは`enforce`、`audit`、`warn`のいずれかでなければならない。
# VERSIONは有効なKubernetesのマイナーバージョンか`latest`でなければならない。
pod-security.kubernetes.io/<MODE>-version: <VERSION>
```

[名前空間のラベルを使用してPodセキュリティの標準を強制する](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)で使用例を確認できます。

## ワークロードリソースとPodテンプレート {#workload-resources-and-pod-templates}

Podは、{{< glossary_tooltip term_id="deployment" >}}や{{< glossary_tooltip term_id="job" >}}のような[ワークロードオブジェクト](/docs/concepts/workloads/controllers/)を作成することによって、しばしば間接的に生成されます。
ワークロードオブジェクトは _Pod template_ を定義し、ワークロードリソースの{{< glossary_tooltip term_id="controller" text="コントローラー" >}}はそのテンプレートに基づきPodを作成します。
違反の早期発見を支援するために、auditモードとwarningモードは、ワークロードリソースに適用されます。
ただし、enforceモードはワークロードリソースには**適用されず**、結果としてのPodオブジェクトにのみ適用されます。

## 適用除外(Exemption) {#exemptions}

Podセキュリティの強制に対し _適用除外_ を定義することで、特定の名前空間に関連するポリシーのために禁止されていたPodの作成を許可することができます。
Exemptionは[アドミッションコントローラーの設定](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)で静的に設定することができます。

Exemptionは明示的に列挙する必要があります。
Exemptionを満たしたリクエストは、アドミッションコントローラーによって _無視_ されます（`enforce`、`audit`、`warn`のすべての動作がスキップされます）。
Exemptionの次元は以下の通りです。

- **Usernames:** 除外対象に設定された、認証済み（あるいは偽装された）ユーザー名を持つユーザーからのリクエストは無視されます。
- **RuntimeClassNames:** Podと[ワークロードリソース](#workload-resources-and-pod-templates)で指定された除外ランタイムクラス名は、無視されます。
- **Namespaces:** 除外された名前空間のPodと[ワークロードリソース](#workload-resources-and-pod-templates)は、無視されます。

{{< caution >}}

ほとんどのPodは、[ワークロードリソース](#workload-resources-and-pod-templates)に対応してコントローラーが作成します。
つまり、エンドユーザーを適用除外にするのはPodを直接作成する場合のみで、ワークロードリソースを作成する場合は適用除外になりません。
コントローラーサービスアカウント（`system:serviceaccount:kube-system:replicaset-controller`など）は通常、除外してはいけません。
そうした場合、対応するワークロードリソースを作成できるすべてのユーザーを暗黙的に除外してしまうためです。

{{< /caution >}}

以下のPodフィールドに対する更新は、ポリシーチェックの対象外です。
つまり、Podの更新要求がこれらのフィールドを変更するだけであれば、Podが現在のポリシーレベルに違反していても拒否されることはありません。

- すべてのメタデータの更新（seccompまたはAppArmorアノテーションへの変更を**除く**）
  - `seccomp.security.alpha.kubernetes.io/pod`（非推奨）
  - `container.seccomp.security.alpha.kubernetes.io/*`（非推奨）
  - `container.apparmor.security.beta.kubernetes.io/*`（非推奨）
- `.spec.activeDeadlineSeconds`に対する有効な更新
- `.spec.tolerations`に対する有効な更新

## メトリクス

kube-apiserverによって公開されるPrometheusのメトリクスは以下の通りです。

- `pod_security_errors_total`: 通常の評価処理を妨げるエラーの件数を示すメトリクスです。
  エラーが致命的でない場合、最新の`restricted`プロファイルが使用されることがあります。
- `pod_security_evaluations_total`: ポリシーの評価の件数を示すメトリクスで、エクスポート中に無視または適用除外されたリクエストはカウントされません。
- `pod_security_exemptions_total`: 適用除外されたリクエストの件数を示すメトリクスで、無視またはスコープ外のリクエストはカウントされません。

## {{% heading "whatsnext" %}}

- [Podセキュリティの標準](/docs/concepts/security/pod-security-standards/)
- [Podセキュリティの標準の強制](/docs/setup/best-practices/enforcing-pod-security-standards/)
- [組み込みのアドミッションコントローラーを設定してPodセキュリティの標準を強制する](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)
- [名前空間のラベルを使用してPodセキュリティの標準を強制する](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)

Kubernetesを古いバージョンからPodSecurityPolicyを含まないバージョンに更新したい場合、[PodSecurityPolicyから組み込みのPodセキュリティアドミッションコントローラーに移行する](/docs/tasks/configure-pod-container/migrate-from-psp/)を参照してください。
