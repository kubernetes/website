---
reviewers:
- bgrant0607
- lavalamp
- thockin
title: Kubernetes非推奨ポリシー
content_type: concept
weight: 40
---

<!-- overview -->
このドキュメントではシステムのさまざまな側面に関する非推奨ポリシーについて詳しく説明します。


<!-- body -->
Kubernetesは多くのコンポーネントと多くのコントリビュータを持つ大規模なシステムです。
このようなソフトウェアでは、機能セットは時間の経過とともに自然に進化し、時には機能を削除する必要がある場合があります。
これにはAPI、フラグ、または機能全体が含まれることもあります。
既存のユーザーへの影響を避けるため、Kubernetesは削除される予定のシステムの側面については非推奨ポリシーに従っています。

## API

KubernetesはAPI駆動型のシステムであるため、問題領域の理解の進化を反映して時間の経過とともに進化してきました。
Kubernetes APIは実際は「APIグループ」と呼ばれる一連のAPIであり、各APIグループは個別にバージョン管理されています。
[APIバージョン](/docs/ja/reference/using-api/#api-versioning)は主に3つのトラックに分類され、それぞれに異なる非推奨ポリシーがあります:

| 例       | トラック              |
|----------|-----------------------|
| v1       | GA (一般提供、安定版) |
| v1beta1  | Beta (プレリリース)   |
| v1alpha1 | Alpha (実験的)        |

Kubernetesの特定のリリースでは任意の数のAPIグループと任意の数のそれぞれのバージョンをサポートすることができます。

次のルールはAPIの要素の非推奨を管理します。これには以下が含まれます:

   * RESTリソース (別名 APIオブジェクト)
   * RESTリソースのフィールド
   * RESTリソースのアノテーション、「beta」アノテーションは含まれますが「alpha」アノテーションは含まれません
   * 列挙された値や定数値
   * コンポーネントの設定構造

これらのルールは、masterまたはリリースブランチへの任意のコミット間ではなく、公式リリース間に適用されます。

**ルール #1: APIの要素はAPIグループのバージョンをインクリメントすることでもに削除することができます。**

APIの要素が特定バージョンのAPIグループに追加されると、
トラックに関係なくそのバージョンから削除されたり、
大幅に挙動が変更されることはありません。

{{< note >}}
歴史的な理由により、「core」（グループ名なし）と「extentions」という2つの「monolithic」APIグループがあります。
リソースはこれらのレガシーなAPIグループからより特定のドメインに特化したAPIグループに段階的に移行されます。
{{< /note >}}

**ルール #2: APIオブジェクトはいくつかのバージョンに存在しないRESTリソース全体を除き、
任意のリリース内のAPIバージョン間で情報を失うことなくラウンドトリップできる必要があります**

例えば、あるオブジェクトがv1として書き込まれその後v2として読み取られv1に変換された場合、
結果として得られるv1リソースは元のリソースと同一である必要があります。
v2における表現はv1とは異なるかもしれませんが、システムは両方向にそれらを変換する方法を知っています。
さらに、v2で追加された新しいフィールドはv1にラウンドトリップできる必要があります。
つまりv1では同等のフィールドを追加するかアノテーションとして表現する必要があるかもしれません。

**ルール #3: 特定のトラックのAPIバージョンは安定性の低いAPIバージョンを優先して非推奨になることはありません。**

  * GA APIバージョンは、betaおよびalpha APIバージョンに置き換えることができます。
  * Beta APIバージョンは以前のbetaおよびalpha APIバージョンに置き換えることはできますが、GA APIバージョンに置き換えることは*できません*。
  * Alpha APIバージョンは以前のalpha APIバージョンに置き換えることはできますが、GAまたはbeta APIバージョンに置き換えることはできません。

**Rule #4a: APIの有効期間はAPIの安定性レベルによって決まります**

  * GA APIバージョンは非推奨としてマークされることがありますが、Kubernetesのメジャーバージョン内で削除されることはありません。
  * Beta APIバージョンは導入後9ヶ月または3つのマイナーリリース（いずれか長い方）以内に非推奨にされ、
      非推奨後9ヶ月または3つのマイナーリリース（いずれか長い方）以内に提供されなくなります。
  * Alpha APIバージョンは事前の非推奨通知なしにリリースから削除される場合があります。

これによりbeta APIバージョンのサポートは [最大2つのリリースのバージョンの差異](/ja/releases/version-skew-policy/)をカバーし、
APIが不安定なbetaバージョンで停滞し、beta APIのサポートが終了したときに本番稼働が中断されることはありません。

{{< note >}}
GA APIを削除するKubernetesのメジャーバージョン改訂の計画は現在ありません。
{{< /note >}}

{{< note >}}
[#52185](https://github.com/kubernetes/kubernetes/issues/52185)が解決されるまで、
ストレージに永続化されているAPIバージョンは削除されません。
これらのバージョンのAPIエンドポイントの提供は無効にできます（このドキュメントの非推奨タイムラインに従います）が、
APIサーバーはストレージから以前永続化されたデータをデコード/変換できる機能を維持する必要があります。
{{< /note >}}

**ルール #4b: 特定のグループの「優先」APIバージョンと「ストレージバージョン」は、
新しいバージョンと以前のバージョンの両方をサポートするリリースが行われるまで更新されない場合があります。**

ユーザーはKubernetesの新しいリリースにアップグレードした後、
（新しいバージョンでのみ利用可能な機能を明示的に使用していない限り）
何も新しいAPIバージョンに変換することなく、また破損が発生することなく、
以前のリリースにロールバックできる必要があります。
これはオブジェクトの保存された表現において特に顕著です。

これらはすべて例を挙げて説明するのが最も適切です。新しいAPIグループを導入する
Kubernetesリリース、バージョンXを想像してください。
新しいKubernetesリリースは約4ヶ月ごと（1年に3回）に行われます。
以下の表は一連の後続リリースでサポートされるAPIバージョンを示しています。

<table>
  <thead>
    <tr>
      <th>リリース</th>
      <th>APIバージョン</th>
      <th>優先/ストレージバージョン</th>
      <th>ノート</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>X</td>
      <td>v1alpha1</td>
      <td>v1alpha1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+1</td>
      <td>v1alpha2</td>
      <td>v1alpha2</td>
      <td>
        <ul>
           <li>v1alpha1は削除され、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+2</td>
      <td>v1beta1</td>
      <td>v1beta1</td>
      <td>
        <ul>
          <li>v1alpha2は削除され、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+3</td>
      <td>v1beta2, v1beta1 (非推奨)</td>
      <td>v1beta1</td>
      <td>
        <ul>
          <li>v1beta1は非推奨になり、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+4</td>
      <td>v1beta2, v1beta1 (deprecated)</td>
      <td>v1beta2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+5</td>
      <td>v1, v1beta1 (非推奨), v1beta2 (非推奨)</td>
      <td>v1beta2</td>
      <td>
        <ul>
          <li>v1beta2は非推奨になり、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+6</td>
      <td>v1, v1beta2 (非推奨)</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v1beta1は削除され、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+7</td>
      <td>v1, v1beta2 (非推奨)</td>
      <td>v1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+8</td>
      <td>v2alpha1, v1</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v1beta2は削除され、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+9</td>
      <td>v2alpha2, v1</td>
      <td>v1</td>
      <td>
        <ul>
           <li>v2alpha1は削除され、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+10</td>
      <td>v2beta1, v1</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v2alpha2は削除され、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+11</td>
      <td>v2beta2, v2beta1 (非推奨), v1</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v2beta1は非推奨になり、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+12</td>
      <td>v2, v2beta2 (非推奨), v2beta1 (非推奨), v1 (非推奨)</td>
      <td>v1</td>
      <td>
        <ul>
          <li>v2beta2は非推奨になり、リリースノートに"action required"と記載されます</li>
          <li>v1 is deprecated in favor of v2, but will not be removed</li>
          <li>v1はv2に置き換えられますが、削除はされません</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+13</td>
      <td>v2, v2beta1 (非推奨), v2beta2 (非推奨), v1 (非推奨)</td>
      <td>v2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+14</td>
      <td>v2, v2beta2 (非推奨), v1 (非推奨)</td>
      <td>v2</td>
      <td>
        <ul>
          <li>v2beta1は削除され、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+15</td>
      <td>v2, v1 (非推奨)</td>
      <td>v2</td>
      <td>
        <ul>
          <li>v2beta2は削除され、リリースノートに"action required"と記載されます</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### REST resources (aka API objects)

上記のタイムラインではAPI v1に存在し、非推奨化される必要があるWidgetという仮想のRESTリソースを考えてみましょう。
私たちはリリースX+1と同期して非推奨をドキュメント化と[アナウンス](https://groups.google.com/forum/#!forum/kubernetes-announce)を行います。
WidgetリソースはAPIバージョンv1（非推奨）にはまだ存在しますがv2alpha1には存在しません。
WidgetリソースはX+8までのリリースに引き続き存在して機能します。
API v1が期限切れになるX+9でのみ、Widgetリソースは存在しなくなり、その動作が削除されます。

Kubernetes v1.19以降は、非推奨のREST APIエンドポイントへのAPIリクエストを行うと、以下のようになります:

1. APIレスポンスにおいて`Warning`ヘッダー([RFC7234, Section 5.5](https://tools.ietf.org/html/rfc7234#section-5.5)で定義)を返します。
2. リクエストに対して記録された[監査イベント](/ja/docs/tasks/debug/debug-cluster/audit/)に`"k8s.io/deprecated":"true"`というアノテーションを追加します。
3. `kube-apiserver`プロセスで`apiserver_requested_deprecated_apis`ゲージメトリクスに`1`を設定します。
   このメトリクスには`apiserver_request_total`メトリクスに結合することができる `group`、`version`、`resource`、`subresource`ラベルと、APIが提供されなくなるKubernetesリリースを表す`removed_release`があります。
   次のPrometheusクエリはv1.22で削除される非推奨APIへのリクエストに関する情報を返します:

   ```promql
   apiserver_requested_deprecated_apis{removed_release="1.22"} * on(group,version,resource,subresource) group_right() apiserver_request_total
   ```

### RESTリソースのフィールド

すべてのRESTリソースと同様に、API v1に存在していた個々のフィールドはAPI v1が削除されるまで存在して機能する必要があります。
リソース全体と異なり、v2 APIはフィールドをラウンドトリップできる限り、異なる表現を選択することができます。
例えば非推奨になった「magnitude」という名前のv1フィールドは、API v2では「deprecatedMagnitude」という名前になる可能性があります。
最終的にv1が削除されると、v2から非推奨のフィールドも削除することができます。

### 列挙された値や定数値

すべてのRESTリソースとそのフィールドと同様にAPI v1でサポートされていた定数値はAPI v0が削除されるまで存在して機能する必要があります。

### コンポーネント設定の構造

コンポーネント設定はRESTリソースと同様にバージョン付けされて管理されています。

### 今後の取り組み

時間の経過とともに、Kubernetesはよりきめ細かいAPIバージョンを導入し、これらのルールは必要に応じて調整されます。

## フラグまたはCLIの非推奨化

Kubernetesシステムは複数の異なるプログラムが連携して構成されています。
KubernetesリリースではこれらのプログラムのフラグやCLIコマンド（総称して「CLI要素」）が削除されることがしばしばあります。
個々のプログラムは、非推奨ポリシーが若干異なる、ユーザー向けプログラムと管理者向けプログラムの2つの主要グループに分類されます。
フラグに明示的に接頭辞が付けられていないか、「alpha」または「beta」としてドキュメント化されない限り、そのフラグはGAとみなされます。

CLI要素は事実上システムに対するAPIの一部ですが、REST APIと同じ方法ではバージョン管理されておらず、非推奨のルールは次のようになっています:

**Rule #5a: CLI elements of user-facing components (e.g. kubectl) must function
after their announced deprecation for no less than:**

   * **GA: 12 months or 2 releases (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**

**Rule #5b: CLI elements of admin-facing components (e.g. kubelet) must function
after their announced deprecation for no less than:**

   * **GA: 6 months or 1 release (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**

**Rule #5c: Command line interface (CLI) elements cannot be deprecated in favor of
less stable CLI elements**

Similar to the Rule #3 for APIs, if an element of a command line interface is being replaced with an
alternative implementation, such as by renaming an existing element, or by switching to
use configuration sourced from a file 
instead of a command line argument, that recommended alternative must be of
the same or higher stability level.

**Rule #6: Deprecated CLI elements must emit warnings (optionally disable)
when used.**

## Deprecating a feature or behavior

Occasionally a Kubernetes release needs to deprecate some feature or behavior
of the system that is not controlled by the API or CLI.  In this case, the
rules for deprecation are as follows:

**Rule #7: Deprecated behaviors must function for no less than 1 year after their
announced deprecation.**

If the feature or behavior is being replaced with an alternative implementation
that requires work to adopt the change, there should be an effort to simplify
the transition whenever possible. If an alternative implementation is under
Kubernetes organization control, the following rules apply:

**Rule #8: The feature of behavior must not be deprecated in favor of an alternative
implementation that is less stable**

For example, a generally available feature cannot be deprecated in favor of a Beta
replacement.
The Kubernetes project does, however, encourage users to adopt and transitions to alternative
implementations even before they reach the same maturity level. This is particularly important
for exploring new use cases of a feature or getting an early feedback on the replacement.

Alternative implementations may sometimes be external tools or products,
for example a feature may move from the kubelet to container runtime
that is not under Kubernetes project control. In such cases, the rule cannot be
applied, but there must be an effort to ensure that there is a transition path
that does not compromise on components' maturity levels. In the example with
container runtimes, the effort may involve trying to ensure that popular container runtimes
have versions that offer the same level of stability while implementing that replacement behavior.

Deprecation rules for features and behaviors do not imply that all changes
to the system are governed by this policy.
These rules applies only to significant, user-visible behaviors which impact the
correctness of applications running on Kubernetes or that impact the
administration of Kubernetes clusters, and which are being removed entirely.

An exception to the above rule is _feature gates_. Feature gates are key=value
pairs that allow for users to enable/disable experimental features.

Feature gates are intended to cover the development life cycle of a feature - they
are not intended to be long-term APIs. As such, they are expected to be deprecated
and removed after a feature becomes GA or is dropped.

As a feature moves through the stages, the associated feature gate evolves.
The feature life cycle matched to its corresponding feature gate is:

  * Alpha: the feature gate is disabled by default and can be enabled by the user.
  * Beta: the feature gate is enabled by default and can be disabled by the user.
  * GA: the feature gate is deprecated (see ["Deprecation"](#deprecation)) and becomes
  non-operational.
  * GA, deprecation window complete: the feature gate is removed and calls to it are
  no longer accepted.

### Deprecation

Features can be removed at any point in the life cycle prior to GA. When features are
removed prior to GA, their associated feature gates are also deprecated.

When an invocation tries to disable a non-operational feature gate, the call fails in order
to avoid unsupported scenarios that might otherwise run silently.

In some cases, removing pre-GA features requires considerable time. Feature gates can remain
operational until their associated feature is fully removed, at which point the feature gate
itself can be deprecated.

When removing a feature gate for a GA feature also requires considerable time, calls to
feature gates may remain operational if the feature gate has no effect on the feature,
and if the feature gate causes no errors.

Features intended to be disabled by users should include a mechanism for disabling the
feature in the associated feature gate.

Versioning for feature gates is different from the previously discussed components,
therefore the rules for deprecation are as follows:

**Rule #9: Feature gates must be deprecated when the corresponding feature they control
transitions a lifecycle stage as follows. Feature gates must function for no less than:**

   * **Beta feature to GA: 6 months or 2 releases (whichever is longer)**
   * **Beta feature to EOL: 3 months or 1 release (whichever is longer)**
   * **Alpha feature to EOL: 0 releases**

**Rule #10: Deprecated feature gates must respond with a warning when used. When a feature gate
is deprecated it must be documented in both in the release notes and the corresponding CLI help.
Both warnings and documentation must indicate whether a feature gate is non-operational.**

## Deprecating a metric

Each component of the Kubernetes control-plane exposes metrics (usually the
`/metrics` endpoint), which are typically ingested by cluster administrators.
Not all metrics are the same: some metrics are commonly used as SLIs or used
to determine SLOs, these tend to have greater import. Other metrics are more
experimental in nature or are used primarily in the Kubernetes development
process.

Accordingly, metrics fall under three stability classes (`ALPHA`, `BETA` `STABLE`);
this impacts removal of a metric during a Kubernetes release. These classes
are determined by the perceived importance of the metric. The rules for
deprecating and removing a metric are as follows:

**Rule #11a: Metrics, for the corresponding stability class, must function for no less than:**

   * **STABLE: 4 releases or 12 months (whichever is longer)**
   * **BETA: 2 releases or 8 months (whichever is longer)**
   * **ALPHA: 0 releases**

**Rule #11b: Metrics, after their _announced deprecation_, must function for no less than:**

   * **STABLE: 3 releases or 9 months (whichever is longer)**
   * **BETA: 1 releases or 4 months (whichever is longer)**
   * **ALPHA: 0 releases**

Deprecated metrics will have their description text prefixed with a deprecation notice
string '(Deprecated from x.y)' and a warning log will be emitted during metric
registration. Like their stable undeprecated counterparts, deprecated metrics will
be automatically registered to the metrics endpoint and therefore visible.

On a subsequent release (when the metric's `deprecatedVersion` is equal to
_current_kubernetes_version - 3_)), a deprecated metric will become a _hidden_ metric.
**_Unlike_** their deprecated counterparts, hidden metrics will _no longer_ be
automatically registered to the metrics endpoint (hence hidden). However, they
can be explicitly enabled through a command line flag on the binary
(`--show-hidden-metrics-for-version=`). This provides cluster admins an
escape hatch to properly migrate off of a deprecated metric, if they were not
able to react to the earlier deprecation warnings. Hidden metrics should be
deleted after one release.


## Exceptions

No policy can cover every possible situation.  This policy is a living
document, and will evolve over time.  In practice, there will be situations
that do not fit neatly into this policy, or for which this policy becomes a
serious impediment.  Such situations should be discussed with SIGs and project
leaders to find the best solutions for those specific cases, always bearing in
mind that Kubernetes is committed to being a stable system that, as much as
possible, never breaks users. Exceptions will always be announced in all
relevant release notes.