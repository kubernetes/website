---
title: Kubernetes 棄用策略
content_type: concept
weight: 40
---
<!--
reviewers:
- bgrant0607
- lavalamp
- thockin
title: Kubernetes Deprecation Policy
content_type: concept
weight: 40
-->

<!-- overview -->
<!--
This document details the deprecation policy for various facets of the system.
-->
本文件詳細解釋系統中各個層面的棄用策略（Deprecation Policy）。

<!-- body -->
<!--
Kubernetes is a large system with many components and many contributors.  As
with any such software, the feature set naturally evolves over time, and
sometimes a feature may need to be removed. This could include an API, a flag,
or even an entire feature. To avoid breaking existing users, Kubernetes follows
a deprecation policy for aspects of the system that are slated to be removed.
-->
Kubernetes 是一個元件眾多、貢獻者人數眾多的大系統。
就像很多類似的軟體，所提供的功能特性集合會隨著時間推移而自然發生變化，
而且有時候某個功能特性可能需要被去除。被去除的可能是一個 API、一個引數標誌或者
甚至某整個功能特性。為了避免影響到現有使用者，Kubernetes 對於其中漸次移除
的各個方面規定了一種棄用策略並遵從此策略。

<!--
## Deprecating parts of the API

Since Kubernetes is an API-driven system, the API has evolved over time to
reflect the evolving understanding of the problem space. The Kubernetes API is
actually a set of APIs, called "API groups", and each API group is
independently versioned.  [API versions](/docs/reference/using-api/#api-versioning) fall
into 3 main tracks, each of which has different policies for deprecation:
-->
## 棄用 API 的一部分  {#deprecating-parts-of-the-api}

由於 Kubernetes 是一個 API 驅動的系統，API 會隨著時間推移而演化，以反映
人們對問題空間的認識的變化。Kubernetes API 實際上是一個 API 集合，其中每個
成員稱作“API 組（API Group）”，並且每個 API 組都是獨立管理版本的。
[API 版本](/zh-cn/docs/reference/using-api/#api-versioning)會有
三類，每類有不同的廢棄策略：

<!--
| Example  | Track                            |
|----------|----------------------------------|
| v1       | GA (generally available, stable) |
| v1beta1  | Beta (pre-release)               |
| v1alpha1 | Alpha (experimental)             |
-->
| 示例     | 分類                             |
|----------|----------------------------------|
| v1       | 正式釋出（Generally available，GA，穩定版本） |
| v1beta1  | Beta （預釋出）|
| v1alpha1 | Alpha （試驗性） |

<!--
A given release of Kubernetes can support any number of API groups and any
number of versions of each.

The following rules govern the deprecation of elements of the API.  This
includes:
-->
給定的 Kubernetes 釋出版本中可以支援任意數量的 API 組，且每組可以包含
任意個數的版本。

下面的規則負責指導 API 元素的棄用，具體元素包括：

<!--
   * REST resources (aka API objects)
   * Fields of REST resources
   * Annotations on REST resources, including "beta" annotations but not
     including "alpha" annotations.
   * Enumerated or constant values
   * Component config structures
-->
* REST 資源（也即 API 物件）
* REST 資源的欄位
* REST 資源的註解，包含“beta”類註解但不包含“alpha”類註解
* 列舉值或者常數值
* 元件配置結構

<!--
These rules are enforced between official releases, not between
arbitrary commits to master or release branches.

**Rule #1: API elements may only be removed by incrementing the version of the
API group.**

Once an API element has been added to an API group at a particular version, it
can not be removed from that version or have its behavior significantly
changed, regardless of track.
-->
以下是跨正式釋出版本時要實施的規則，不適用於對 master 或釋出分支上
不同提交之間的變化。

**規則 #1：只能在增加 API 組版本號時刪除 API 元素。**

一旦在某個特定 API 組版本中添加了 API 元素，則該元素不可從該版本中刪除，
且其行為也不能大幅度地變化，無論屬於哪一類（GA、Alpha 或 Beta）。

<!--
For historical reasons, there are 2 "monolithic" API groups - "core" (no
group name) and "extensions".  Resources will incrementally be moved from these
legacy API groups into more domain-specific API groups.
-->
{{< note >}}
由於歷史原因，Kubernetes 中存在兩個“單體式（Monolithic）”API 組 -
“core”（無組名）和“extensions”。這兩個遺留 API 組中的資源會被逐漸遷移到
更為特定領域的 API 組中。
{{< /note >}}

<!--
**Rule #2: API objects must be able to round-trip between API versions in a given
release without information loss, with the exception of whole REST resources
that do not exist in some versions.**
-->
**規則 #2：在給定的釋出版本中，API 物件必須能夠在不同的 API 版本之間來回
轉換且不造成資訊丟失，除非整個 REST 資源在某些版本中完全不存在。**

<!--
For example, an object can be written as v1 and then read back as v2 and
converted to v1, and the resulting v1 resource will be identical to the
original.  The representation in v2 might be different from v1, but the system
knows how to convert between them in both directions.  Additionally, any new
field added in v2 must be able to round-trip to v1 and back, which means v1
might have to add an equivalent field or represent it as an annotation.
-->
例如，一個物件可被用 v1 來寫入之後用 v2 來讀出並轉換為 v1，所得到的 v1 必須
與原來的 v1 物件完全相同。v2 中的表現形式可能與 v1 不同，但系統知道如何
在兩個版本之間執行雙向轉換。
此外，v2 中新增的所有新欄位都必須能夠轉換為 v1 再轉換回來。這意味著 v1 必須
新增一個新的等效欄位或者將其表現為一個註解。

<!--
**Rule #3: An API version in a given track may not be deprecated in favor of a less stable API version.**

  * GA API versions can replace beta and alpha API versions.
  * Beta API versions can replace earlier beta and alpha API versions, but *may not* replace GA API versions.
  * Alpha API versions can replace earlier alpha API versions, but *may not* replace GA or beta API versions.
-->
**規則 #3：給定類別的 API 版本不可被棄用以支援穩定性更差的 API 版本。**

  * 一個正式釋出的（GA）API 版本可替換 beta 或 alpha API 版本。
  * Beta API 版本可以替換早期的 beta 和 alpha API 版本，但 **不可以** 替換正式的 API 版本。
  * Alpha API 版本可以替換早期的 alpha API 版本，但 **不可以** 替換正式的或 beta API 版本。

<!--
**Rule #4a: minimum API lifetime is determined by the API stability level**

   * **GA API versions may be marked as deprecated, but must not be removed within a major version of Kubernetes**
   * **Beta API versions must be supported for 9 months or 3 releases (whichever is longer) after deprecation**
   * **Alpha API versions may be removed in any release without prior deprecation notice**

This ensures beta API support covers the [maximum supported version skew of 2 releases](/releases/version-skew-policy/).
-->
**規則 #4a：最短 API 生命週期由 API 穩定性級別決定**

   * **GA API 版本可以被標記為已棄用，但不得在 Kubernetes 的主要版本中刪除**
   * **Beta API 版本必須支援 9 個月或棄用後的 3 個版本（以較長者為準）**
   * **Alpha API 版本可能會在任何版本中被刪除，不另行通知**

這確保了 beta API 支援涵蓋了[最多 2 個版本的支援版本偏差](/zh-cn/releases/version-skew-policy/)。

{{< note >}}
<!--
There are no current plans for a major version revision of Kubernetes that removes GA APIs.
-->
目前沒有刪除正式版本 API 的 Kubernetes 主要版本修訂計劃。
{{< /note >}}

<!--
Until [#52185](https://github.com/kubernetes/kubernetes/issues/52185) is
resolved, no API versions that have been persisted to storage may be removed.
Serving REST endpoints for those versions may be disabled (subject to the
deprecation timelines in this document), but the API server must remain capable
of decoding/converting previously persisted data from storage.
-->
{{< note >}}
在 [#52185](https://github.com/kubernetes/kubernetes/issues/52185) 被解決之前，
已經被儲存到永續性儲存中的 API 版本都不可以被去除。
你可以禁止這些版本所對應的 REST 末端（在符合本文中棄用時間線的前提下），
但是 API 伺服器必須仍能解析和轉換儲存中以前寫入的資料。
{{< /note >}}

<!--
**Rule #4b: The "preferred" API version and the "storage version" for a given
group may not advance until after a release has been made that supports both the
new version and the previous version**
-->
**規則 #4b：標記為“preferred（優選的）” API 版本和給定 API 組的
“storage version（儲存版本）”在既支援老版本也支援新版本的 Kubernetes 釋出
版本出來以前不可以提升其版本號。**

<!--
Users must be able to upgrade to a new release of Kubernetes and then roll back
to a previous release, without converting anything to the new API version or
suffering breakages (unless they explicitly used features only available in the
newer version).  This is particularly evident in the stored representation of
objects.

All of this is best illustrated by examples.  Imagine a Kubernetes release,
version X, which introduces a new API group.  A new Kubernetes release is made
every approximately 4 months (3 per year).  The following table describes which
API versions are supported in a series of subsequent releases.
-->
使用者必須能夠升級到 Kubernetes 新的發行版本，之後再回滾到前一個發行版本，且
整個過程中無需針對新的 API 版本做任何轉換，也不允許出現功能損壞的情況，
除非使用者顯式地使用了僅在較新版本中才存在的功能特性。
就物件的儲存表示而言，這一點尤其是不言自明的。

以上所有規則最好透過例子來說明。假定現有 Kubernetes 發行版本為 X，其中引入了
新的 API 組。大約每隔 4 個月會有一個新的 Kubernetes 版本被髮布（每年 3 個版本）。
下面的表格描述了在一系列後續的釋出版本中哪些 API 版本是受支援的。

<table>
  <thead>
    <tr>
      <!-- th>Release</th>
      <th>API Versions</th>
      <th>Preferred/Storage Version</th>
      <th>Notes</th -->
      <th>釋出版本</th>
      <th>API 版本</th>
      <th>優選/儲存版本</th>
      <th>註釋</th>
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
           <!-- li>v1alpha1 is removed, "action required" relnote</li -->
           <li>v1alpha1 被去除，釋出說明中會包含 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+2</td>
      <td>v1beta1</td>
      <td>v1beta1</td>
      <td>
        <ul>
          <!-- li>v1alpha2 is removed, "action required" relnote</li -->
          <li>v1alpha2 被去除，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+3</td>
      <!-- td>v1beta2, v1beta1 (deprecated)</td -->
      <td>v1beta2、v1beta1（已棄用）</td>
      <td>v1beta1</td>
      <td>
        <ul>
          <!-- li>v1beta1 is deprecated, "action required" relnote</li -->
          <li>v1beta1 被棄用，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+4</td>
      <!-- td>v1beta2, v1beta1 (deprecated)</td -->
      <td>v1beta2、v1beta1（已棄用）</td>
      <td>v1beta2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+5</td>
      <!-- td>v1, v1beta1 (deprecated), v1beta2 (deprecated)</td -->
      <td>v1、v1beta1（已棄用）、v1beta2（已棄用）</td>
      <td>v1beta2</td>
      <td>
        <ul>
          <!-- li>v1beta2 is deprecated, "action required" relnote</li -->
          <li>v1beta2 被棄用，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+6</td>
      <!-- td>v1, v1beta2 (deprecated)</td -->
      <td>v1、v1beta2（已棄用）</td>
      <td>v1</td>
      <td>
        <ul>
          <!-- li>v1beta1 is removed, "action required" relnote</li -->
          <li>v1beta1 被去除，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+7</td>
      <!-- td>v1, v1beta2 (deprecated)</td -->
      <td>v1、v1beta2（已棄用）</td>
      <td>v1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+8</td>
      <td>v2alpha1、v1</td>
      <td>v1</td>
      <td>
        <ul>
          <!-- li>v1beta2 is removed, "action required" relnote</li -->
          <li>v1beta2 被去除，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+9</td>
      <td>v2alpha2、v1</td>
      <td>v1</td>
      <td>
        <ul>
           <!-- li>v2alpha1 is removed, "action required" relnote</li -->
           <li>v2alpha1 被刪除，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+10</td>
      <td>v2beta1、v1</td>
      <td>v1</td>
      <td>
        <ul>
          <!-- li>v2alpha2 is removed, "action required" relnote</li -->
          <li>v2alpha2 被刪除，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+11</td>
      <!-- td>v2beta2, v2beta1 (deprecated), v1</td -->
      <td>v2beta2、v2beta1（已棄用）、v1</td>
      <td>v1</td>
      <td>
        <ul>
          <!-- li>v2beta1 is deprecated, "action required" relnote</li -->
          <li>v2beta1 被棄用，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+12</td>
      <!-- td>v2, v2beta2 (deprecated), v2beta1 (deprecated), v1 (deprecated)</td -->
      <td>v2、v2beta2（已棄用）、v2beta1（已棄用）、v1（已棄用）</td>
      <td>v1</td>
      <td>
        <ul>
          <!-- li>v2beta2 is deprecated, "action required" relnote</li>
          <li>v1 is deprecated in favor of v2, but will not be removed</li -->
          <li>v2beta2 已被棄用，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
          <li>v1 已被棄用，取而代之的是 v2，但不會被刪除</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+13</td>
      <!-- td>v2, v2beta1 (deprecated), v2beta2 (deprecated), v1 (deprecated)</td -->
      <td>v2、v2beta1（已棄用）、v2beta2（已棄用）、v1（已棄用）</td>
      <td>v2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+14</td>
      <!-- td>v2, v2beta2 (deprecated), v1 (deprecated)</td -->
      <td>v2、v2beta2（已棄用）、v1（已棄用）</td>
      <td>v2</td>
      <td>
        <ul>
          <!-- li>v2beta1 is removed, "action required" relnote</li -->
          <li>v2beta1 被刪除，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+15</td>
      <!-- td>v2, v1 (deprecated)</td -->
      <td>v2、v1（已棄用）</td>
      <td>v2</td>
      <td>
        <ul>
          <!-- li>v2beta2 is removed, "action required" relnote</li -->
          <li>v2beta2 被刪除，釋出說明中包含對應的 "action required（採取行動）" 說明</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<!--
### REST resources (aka API objects)

Consider a hypothetical REST resource named Widget, which was present in API v1
in the above timeline, and which needs to be deprecated.  We document and
[announce](https://groups.google.com/forum/#!forum/kubernetes-announce) the
deprecation in sync with release X+1.  The Widget resource still exists in API
version v1 (deprecated) but not in v2alpha1.  The Widget resource continues to
exist and function in releases up to and including X+8.  Only in release X+9,
when API v1 has aged out, does the Widget resource cease to exist, and the
behavior get removed.
-->
### REST 資源（也即 API 物件）  {#rest-resources-aka-api-objects}

考慮一個假想的名為 Widget 的 REST 資源，在上述時間線中位於 API v1，
而現在打算將其棄用。
我們會在文件和
[宣告](https://groups.google.com/forum/#!forum/kubernetes-announce)
中與 X+1 版本的釋出同步記述此棄用決定。
Wdiget 資源仍會在 API 版本 v1（已棄用）中存在，但不會出現在 v2alpha1 中。
Widget 資源會 X+8 釋出版本之前（含 X+8）一直存在並可用。
只有在釋出版本 X+9 中，API v1 壽終正寢時，Widget
才徹底消失，相應的資源行為也被移除。

<!--
Starting in Kubernetes v1.19, making an API request to a deprecated REST API endpoint:

1. Returns a `Warning` header (as defined in [RFC7234, Section 5.5](https://tools.ietf.org/html/rfc7234#section-5.5)) in the API response.
2. Adds a `"k8s.io/deprecated":"true"` annotation to the [audit event](/docs/tasks/debug/debug-cluster/audit/) recorded for the request.
3. Sets an `apiserver_requested_deprecated_apis` gauge metric to `1` in the `kube-apiserver`
   process. The metric has labels for `group`, `version`, `resource`, `subresource` that can be joined
   to the `apiserver_request_total` metric, and a `removed_release` label that indicates the
   Kubernetes release in which the API will no longer be served. The following Prometheus query
   returns information about requests made to deprecated APIs which will be removed in v1.22:

   ```promql
   apiserver_requested_deprecated_apis{removed_release="1.22"} * on(group,version,resource,subresource) group_right() apiserver_request_total
   ```
-->
從 Kubernetes v1.19 開始，當 API 請求被髮送到一個已棄用的 REST API 末端時：

1. API 響應中會包含一個 `Warning` 頭部欄位（如 [RFC7234 5.5 節](https://tools.ietf.org/html/rfc7234#section-5.5)所定義）；
2. 該請求會導致對應的 
   [審計事件](/zh-cn/docs/tasks/debug/debug-cluster/audit/)
   中會增加一個註解 `"k8s.io/deprecated":"true"`。
3. `kube-apiserver` 程序的 `apiserver_requested_deprecated_apis` 度量值會被
   設定為 `1`。
   該度量值還附帶 `group`、`version`、`resource` 和 `subresource` 標籤
   （可供新增到度量值 `apiserver_request_total` 上），
   和一個 `removed_release` 標籤，標明該 API 將消失的 Kubernetes 釋出版本。
   下面的 Prometheus 查詢會返回對 v1.22 中將移除的、已棄用的 API
   的請求的資訊：
   
   ```promql
   apiserver_requested_deprecated_apis{removed_release="1.22"} * on(group,version,resource,subresource) group_right() apiserver_request_total
   ```

<!--
### Fields of REST resources

As with whole REST resources, an individual field which was present in API v1
must exist and function until API v1 is removed.  Unlike whole resources, the
v2 APIs may choose a different representation for the field, as long as it can
be round-tripped.  For example a v1 field named "magnitude" which was
deprecated might be named "deprecatedMagnitude" in API v2.  When v1 is
eventually removed, the deprecated field can be removed from v2.
-->
### REST 資源的欄位    {#fields-of-rest-resources}

就像整個 REST 資源一樣，在 API v1 中曾經存在的各個欄位在 API v1 被移除
之前必須一直存在且起作用。
與整個資源上的規定不同，v2 API 可以選擇為欄位提供不同的表示方式，
只要對應的資源物件可在不同版本之間來回轉換即可。
例如，v1 版本中一個名為 "magnitude" 的已棄用欄位可能在 API v2 中被命名
為 "deprecatedMagnitude"。當 v1 最終被移除時，廢棄的欄位也可以從 v2
中移除。

<!--
### Enumerated or constant values

As with whole REST resources and fields thereof, a constant value which was
supported in API v1 must exist and function until API v1 is removed.
-->
### 列舉值或常數值 {#enumerated-or-constant-values}

就像前文講述的 REST 資源及其中的單個欄位一樣，API v1 中所支援的常數值
必須在 API v1 被移除之前一直存在且起作用。

<!--
### Component config structures

Component configs are versioned and managed similar to REST resources.
-->
### 元件配置結構  {#component-config-structures}

元件的配置也是有版本的，並且按 REST 資源的方式來管理。

<!--
### Future work

Over time, Kubernetes will introduce more fine-grained API versions, at which
point these rules will be adjusted as needed.
-->
### 將來的工作    {#future-work}

隨著時間推移，Kubernetes 會引入粒度更細的 API 版本。
到那時，這裡的規則會根據需要進行調整。

<!--
## Deprecating a flag or CLI

The Kubernetes system is comprised of several different programs cooperating.
Sometimes, a Kubernetes release might remove flags or CLI commands
(collectively "CLI elements") in these programs.  The individual programs
naturally sort into two main groups - user-facing and admin-facing programs,
which vary slightly in their deprecation policies.  Unless a flag is explicitly
prefixed or documented as "alpha" or "beta", it is considered GA.
-->
## 棄用一個標誌或 CLI 命令

Kubernetes 系統中包含若干不同的、相互協作的程式。
有時，Kubernetes 可能會刪除這些程式的某些標誌或 CLI 命令（統稱“命令列元素”）。
這些程式可以天然地劃分到兩個大組中：面向使用者的和麵向管理員的程式。
二者之間的棄用策略略有不同。
除非某個標誌顯示地透過字首或文件來標明其為“alpha”或“beta”，
該標誌要被視作正式釋出的（GA）。

<!--
CLI elements are effectively part of the API to the system, but since they are
not versioned in the same way as the REST API, the rules for deprecation are as
follows:
-->
命令列元素相當於系統的 API 的一部分，不過因為它們並沒有採用 REST API
一樣的方式來管理版本，其棄用規則規定如下： 

<!--
**Rule #5a: CLI elements of user-facing components (e.g. kubectl) must function
after their announced deprecation for no less than:**

   * **GA: 12 months or 2 releases (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**
-->
**規則 #5a：面向使用者的命令列元素（例如，kubectl）必須在其宣佈被棄用其
在以下時長內仍能使用：**

   * **GA：12 個月或者 2 個釋出版本（取其較長者）**
   * **Beta：3 個月或者 1 個釋出版本（取其較長者）**
   * **Alpha：0 釋出版本**

<!--
**Rule #5b: CLI elements of admin-facing components (e.g. kubelet) must function
after their announced deprecation for no less than:**

   * **GA: 6 months or 1 release (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**
-->
**規則 #5b：面向管理員的命令列元素（例如，kubelet）必須在其被宣佈棄用
之後以下時長內保持可用：**

   * **GA：6 個月或 1 個發行版本（取其較長者）**
   * **Beta: 3 個月或 1 個發行版本（取其較長者）**
   * **Alpha: 0 個釋出版本**

<!--
**Rule #6: Deprecated CLI elements must emit warnings (optionally disable)
when used.**
-->
**規則 #6：被棄用的 CLI 元素在被用到時必須能夠產生警告，而警告的
產生是可以被禁止的。**

<!--
## Deprecating a feature or behavior

Occasionally a Kubernetes release needs to deprecate some feature or behavior
of the system that is not controlled by the API or CLI.  In this case, the
rules for deprecation are as follows:
-->
## 棄用某功能特性或行為  {#deprecating-a-feature-or-behavior}

在一些較偶然的情形下，某 Kubernetes 發行版本需要棄用系統的某項功能
特性或者行為，而對應的功能特性或行為並不受 API 或 CLI 控制。在這種情況下，
其棄用規則如下：

<!--
**Rule #7: Deprecated behaviors must function for no less than 1 year after their
announced deprecation.**
-->
**規則 #7：被棄用的行為必須在被宣佈棄用之後至少 1 年時間內必須保持能用。**

<!--
This does not imply that all changes to the system are governed by this policy.
This applies only to significant, user-visible behaviors which impact the
correctness of applications running on Kubernetes or that impact the
administration of Kubernetes clusters, and which are being removed entirely.
-->
這並不意味著對系統的所有更改都受此策略約束。
此規則僅適用於重大的、使用者可見的行為；這些行為會影響到在 Kubernetes
中執行的應用的正確性，或者影響到 Kubernetes 叢集的管理。
此規則也適用於那些被整個移除的功能特性或行為。

<!--
An exception to the above rule is _feature gates_. Feature gates are key=value
pairs that allow for users to enable/disable experimental features.

Feature gates are intended to cover the development life cycle of a feature - they
are not intended to be long-term APIs. As such, they are expected to be deprecated
and removed after a feature becomes GA or is dropped.
-->
上述規則的一個例外是 _特性門控（Feature Gates）_。特性門控是一些鍵值偶對，
允許使用者啟用或禁用一些試驗性的功能特性。

特性門控意在覆蓋功能特性的整個開發週期，它們無意成為長期的 API。
因此，它們會在某功能特性正式釋出或被拋棄之後被棄用和刪除。

<!--
As a feature moves through the stages, the associated feature gate evolves.
The feature life cycle matched to its corresponding feature gate is:

  * Alpha: the feature gate is disabled by default and can be enabled by the user.
  * Beta: the feature gate is enabled by default and can be disabled by the user.
  * GA: the feature gate is deprecated (see ["Deprecation"](#deprecation)) and becomes
  non-operational.
  * GA, deprecation window complete: the feature gate is removed and calls to it are
  no longer accepted.
-->
隨著一個功能特性經過不同的成熟階段，相關的特性門控也會演化。
與功能特性生命週期對應的特性門控狀態為：

* Alpha：特性門控預設被禁用，只能由使用者顯式啟用。
* Beta：特性門控預設被棄用，可被使用者顯式禁用。
* GA: 特性門控被棄用（參見[棄用](#deprecation)），並且不再起作用。
* GA，棄用視窗期結束：特性門控被刪除，不再接受呼叫。

<!--
### Deprecation

Features can be removed at any point in the life cycle prior to GA. When features are
removed prior to GA, their associated feature gates are also deprecated.

When an invocation tries to disable a non-operational feature gate, the call fails in order
to avoid unsupported scenarios that might otherwise run silently.
-->
### 棄用   {#deprecation}

功能特性在正式釋出之前的生命週期內任何時間點都可被移除。
當未正式釋出的功能特性被移除時，它們對應的特性門控也被棄用。

當嘗試禁用一個不再起作用的特性門控時，該呼叫會失敗，這樣可以避免
毫無跡象地執行一些不受支援的場景。

<!--
In some cases, removing pre-GA features requires considerable time. Feature gates can remain
operational until their associated feature is fully removed, at which point the feature gate
itself can be deprecated.

When removing a feature gate for a GA feature also requires considerable time, calls to
feature gates may remain operational if the feature gate has no effect on the feature,
and if the feature gate causes no errors.
-->
在某些場合，移除一個即將正式釋出的功能特性需要很長時間。特性門控
可以保持其功能，直到對應的功能特性被徹底去除，直到那時特性門控
自身才可被棄用。

由於移除一個已經正式釋出的功能特性對應的特性門控也需要一定時間，對特性
門控的呼叫可能一直被允許，前提是特性門控對功能本身無影響且特性門控不會
引發任何錯誤。

<!--
Features intended to be disabled by users should include a mechanism for disabling the
feature in the associated feature gate.

Versioning for feature gates is different from the previously discussed components,
therefore the rules for deprecation are as follows:
-->
意在允許使用者禁用的功能特性應該包含一個在相關聯的特性門控中禁用該功能的機制。

特性門控的版本管理與之前討論的元件版本管理不同，因此其對應的棄用策略如下：

<!--
**Rule #8: Feature gates must be deprecated when the corresponding feature they control
transitions a lifecycle stage as follows. Feature gates must function for no less than:**

   * **Beta feature to GA: 6 months or 2 releases (whichever is longer)**
   * **Beta feature to EOL: 3 months or 1 release (whichever is longer)**
   * **Alpha feature to EOL: 0 releases**
-->
**規則 #8：特性門控所對應的功能特性經歷下面所列的成熟性階段轉換時，特性門控
必須被棄用。特性門控棄用時必須在以下時長內保持其功能可用：**

   * **Beta 特性轉為 GA：6 個月或者 2 個釋出版本（取其較長者）**
   * **Beta 特性轉為丟棄：3 個月或者 1 個釋出版本（取其較長者）**
   * **Alpha 特性轉為丟棄：0 個釋出版本**

<!--
**Rule #9: Deprecated feature gates must respond with a warning when used. When a feature gate
is deprecated it must be documented in both in the release notes and the corresponding CLI help.
Both warnings and documentation must indicate whether a feature gate is non-operational.**
-->
**規則 #9：已棄用的特色門控再被使用時必須給出警告回應。當特性門控被
棄用時，必須在釋出說明和對應的 CLI 幫助資訊中透過文件宣佈。
警告資訊和文件都要標明是否某特性門控不再起作用。**

<!--
## Deprecating a metric

Each component of the Kubernetes control-plane exposes metrics (usually the
`/metrics` endpoint), which are typically ingested by cluster administrators.
Not all metrics are the same: some metrics are commonly used as SLIs or used
to determine SLOs, these tend to have greater import. Other metrics are more
experimental in nature or are used primarily in the Kubernetes development
process.

Accordingly, metrics fall under two stability classes (`ALPHA` and `STABLE`);
this impacts removal of a metric during a Kubernetes release. These classes
are determined by the perceived importance of the metric. The rules for
deprecating and removing a metric are as follows:
-->
### 棄用度量值    {#deprecating-a-metric}

Kubernetes 控制平面的每個元件都公開度量值（通常是 `/metrics` 端點），它們通常由叢集管理員使用。
並不是所有的度量值都是同樣重要的：一些度量值通常用作 SLIs 或被使用來確定 SLOs，這些往往比較重要。
其他度量值在本質上帶有實驗性，或者主要用於 Kubernetes 開發過程。

因此，度量值分為兩個穩定性類別（`ALPHA` 和 `STABLE`）;
此分類會影響在 Kubernetes 釋出版本中移除某度量值。
所對應的分類取決於對該度量值重要性的預期。
棄用和移除度量值的規則如下：

<!--
**Rule #9a: Metrics, for the corresponding stability class, must function for no less than:**

   * **STABLE: 4 releases or 12 months (whichever is longer)**
   * **ALPHA: 0 releases**

**Rule #9b: Metrics, after their _announced deprecation_, must function for no less than:**

   * **STABLE: 3 releases or 9 months (whichever is longer)**
   * **ALPHA: 0 releases**
-->
**規則 #9a: 對於相應的穩定性類別，度量值起作用的週期必須不小於：**

* **STABLE: 4 個釋出版本或者 12 個月 (取其較長者)**
* **ALPHA: 0 個釋出版本**

**規則 #9b: 在度量值被宣佈啟用之後，它起作用的週期必須不小於：**

* **STABLE: 3 個釋出版本或者 9 個月 (取其較長者)**
* **ALPHA: 0 個釋出版本**

<!--
Deprecated metrics will have their description text prefixed with a deprecation notice
string '(Deprecated from x.y)' and a warning log will be emitted during metric
registration. Like their stable undeprecated counterparts, deprecated metrics will
be automatically registered to the metrics endpoint and therefore visible.
-->
已棄用的度量值將在其描述文字前加上一個已棄用通知字串 '(Deprecated from x.y)'，
並將在度量值被記錄期間發出警告日誌。就像穩定的、未被棄用的度量指標一樣，
被棄用的度量值將自動註冊到 metrics 端點，因此被棄用的度量值也是可見的。

<!--
On a subsequent release (when the metric's `deprecatedVersion` is equal to
_current_kubernetes_version - 3_)), a deprecated metric will become a _hidden_ metric.
**_Unlike_** their deprecated counterparts, hidden metrics will _no longer_ be
automatically registered to the metrics endpoint (hence hidden). However, they
can be explicitly enabled through a command line flag on the binary
(`--show-hidden-metrics-for-version=`). This provides cluster admins an
escape hatch to properly migrate off of a deprecated metric, if they were not
able to react to the earlier deprecation warnings. Hidden metrics should be
deleted after one release.
-->
在隨後的版本中（當度量值 `deprecatedVersion` 等於_當前 Kubernetes 版本 - 3_），
被棄用的度量值將變成 _隱藏（Hidden）_ metric 度量值。
與被棄用的度量值不同，隱藏的度量值將不再被自動註冊到 metrics 端點（因此被隱藏）。
但是，它們可以透過可執行檔案的命令列標誌顯式啟用
（`--show-hidden-metrics-for-version=`）。
如果叢集管理員不能對早期的棄用警告作出反應，這一設計就為他們提供了抓緊遷移棄用度量值的途徑。
隱藏的度量值應該在再過一個發行版本後被刪除。

<!--
## Exceptions

No policy can cover every possible situation.  This policy is a living
document, and will evolve over time.  In practice, there will be situations
that do not fit neatly into this policy, or for which this policy becomes a
serious impediment.  Such situations should be discussed with SIGs and project
leaders to find the best solutions for those specific cases, always bearing in
mind that Kubernetes is committed to being a stable system that, as much as
possible, never breaks users. Exceptions will always be announced in all
relevant release notes.
-->
## 例外   {#exceptions}

沒有策略可以覆蓋所有情況。此策略文件是一個隨時被更新的文件，會隨著時間
推移演化。在實踐中，會有一些情況無法很好地匹配到這裡的棄用策略，或者
這裡的策略變成了很嚴重的羈絆。這類情形要與 SIG 和專案牽頭人討論，
尋求對應場景的最佳解決方案。請一直銘記，Kubernetes 承諾要成為一個
穩定的系統，至少會盡力做到不會影響到其使用者。此棄用策略的任何例外情況
都會在所有相關的釋出說明中公佈。

