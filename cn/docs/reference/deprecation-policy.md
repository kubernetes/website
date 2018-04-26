---
cn-approvers:
- tianshapjq
approvers:
- bgrant0607
- lavalamp
- thockin
title: Kubernetes 弃用策略
---
<!--
---
approvers:
- bgrant0607
- lavalamp
- thockin
title: Kubernetes Deprecation Policy
---
-->

<!--
Kubernetes is a large system with many components and many contributors.  As
with any such software, the feature set naturally evolves over time, and
sometimes a feature may need to be removed. This could include an API, a flag,
or even an entire feature. To avoid breaking existing users, Kubernetes follows
a deprecation policy for aspects of the system that are slated to be removed.
-->
Kubernetes 是一个拥有许多组件和许多贡献者的大型系统。对于这样的大型系统，其功能集会随时间不断地演变，有时也可能会删除一个功能。这可能包括删除一个 API、一个参数或者甚至是一整个功能。为了避免破坏现有用户的使用，Kubernetes 遵循一个弃用策略来移除系统的一些元素。

<!--
This document details the deprecation policy for various facets of the system. 
-->
本文档详细描述系统各方面的弃用策略。

<!--
## Deprecating parts of the API
-->
## 弃用部分 API

<!--
Since Kubernetes is an API-driven system, the API has evolved over time to
reflect the evolving understanding of the problem space. The Kubernetes API is
actually a set of APIs, called "API groups", and each API group is
independently versioned.  [API versions](/docs/reference/api-overview/#api-versioning) fall
into 3 main tracks, each of which has different policies for deprecation:
-->
由于 Kubernetes 是一个 API 驱动的系统，为了反映对问题域的深化理解，API 也会随着时间不断演变。Kubernetes API 实际上是一个 API 集合，称作 "API 组"，并且每个 API 组都是独立的版本。[API 版本](/docs/reference/api-overview/#api-versioning) 分为3个主要部分，每个都有不同的弃用策略：

<!--
| Example  | Track                            |
|----------|----------------------------------|
| v1       | GA (generally available, stable) |
| v1beta1  | Beta (pre-release)               |
| v1alpha1 | Alpha (experimental)             |
-->
| 示例     | 规划                            |
|----------|----------------------------------|
| v1       | GA (基本可用, stable)            |
| v1beta1  | Beta (预发布)                    |
| v1alpha1 | Alpha (实验性)                   |

<!--
A given release of Kubernetes can support any number of API groups and any
number of versions of each.
-->
一个给定的 Kubernetes 发布版本支持任意数量的 API 组和 API 版本。

<!--
The following rules govern the deprecation of elements of the API.  This
includes:

   * REST resources (aka API objects)
   * Fields of REST resources
   * Enumerated or constant values
   * Component config structures
-->
以下规则管理 API 元素的弃用。包括：

   * REST 资源 （也叫做 API 对象）
   * REST 资源的字段
   * 枚举或常量值
   * 组件配置结构

<!--
These rules are enforced between official releases, not between
arbitrary commits to master or release branches.
-->
这些规则只适用于官方正式版本，不适用 master 的任意提交或者分支版本。

<!--
**Rule #1: API elements may only be removed by incrementing the version of the
API group.**
-->
**规则 #1: 只能通过递增的 API 组版本来删除 API 元素。**

<!--
Once an API element has been added to an API group at a particular version, it
can not be removed from that version or have its behavior significantly
changed, regardless of track.
-->
一旦把一个 API 元素添加到 API 组的某个特定版本中，那么就不能在没有规划的情况下从该版本中移除或者对它的行为做出重大的改变。

<!--
Note: For historical reasons, there are 2 "monolithic" API groups - "core" (no
group name) and "extensions".  Resources will incrementally be moved from these
legacy API groups into more domain-specific API groups.
-->
注意：由于历史原因，目前有两个 "庞大的" API 组 - "core" （没有组名）和 "extensions"。资源将会逐渐从这些遗留 API 组转移到特定领域的 API 组中。

<!--
**Rule #2: API objects must be able to round-trip between API versions in a given
release without information loss, with the exception of whole REST resources
that do not exist in some versions.**
-->
**规则 #2: API 对象必须能够在一个发布版本的不同 API 版本中切换，而且不能有信息丢失，除非整个 REST 资源在某些版本中不存在。**

<!--
For example, an object can be written as v1 and then read back as v2 and
converted to v1, and the resulting v1 resource will be identical to the
original.  The representation in v2 might be different from v1, but the system
knows how to convert between them in both directions.  Additionally, any new
field added in v2 must be able to round-trip to v1 and back, which means v1
might have to add an equivalent field or represent it as an annotation.
-->
例如，一个对象可以写成 v1，然后回读为 v2 并且再转换为 v1，最终生成的 v1 资源必须和原来的 v1 相同。v2 中的表示可能与 v1 不同，但是系统知道如何在两个方向之间进行转换。另外，任何在 v2 中添加的新字段必须能够和 v1 相互转换，这意味着 v1 可能需要添加一个等效字段或将其表示为注解。

<!--
**Rule #3: An API version in a given track may not be deprecated until a new
API version at least as stable is released.**
-->
**规则 #3: 一个已规划的 API 版本可能至少要等到新的 API 版本稳定并且发布后才会弃用。**

<!--
GA API versions can replace GA API versions as well as beta and alpha API
versions.  Beta API versions *may not* replace GA API versions.
-->
GA API 版本能够替代另一个 GA API 版本或者 beta 和 alpha API 版本。Beta API 版本*可能不能*替代 GA API 版本。

<!--
**Rule #4: Other than the most recent API versions in each track, older API
versions must be supported after their announced deprecation for a duration of
no less than:**

   * **GA: 1 year or 2 releases (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**
-->
**规则 #4: 除了每个规划中的最新 API 版本，旧的 API 版本必须在宣布弃用后继续支持一段时间，时间不少于：**

   * **GA: 1年或者2个发布版本 (选择最长的一个)**
   * **Beta: 3个月或者1个发布版本 (选择最长的一个)**
   * **Alpha: 没有要求**

<!--
This is best illustrated by example.  Imagine a Kubernetes release, version X,
which supports a particular API group.  A new Kubernetes release is made every
approximately 3 months (4 per year).  The following table describes which API
versions are supported in a series of subsequent releases.
-->
这最好能够用一个例子来说明。想象有一个 Kubernetes 发布版本 X，其支持一个特定的 API 组。大约每3个月有一个新的 Kubernetes 发布版本（一年4次）。以下表格描述在一系列的后续发布版本中哪个 API 组仍被支持。

<!--
<table>
  <thead>
    <tr>
      <th>Release</th>
      <th>API Versions</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>X</td>
      <td>v1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+1</td>
      <td>v1, v2alpha1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+2</td>
      <td>v1, v2alpha2</td>
      <td>
        <ul>
           <li>v2alpha1 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+3</td>
      <td>v1, v2beta1</td>
      <td>
        <ul>
          <li>v2alpha2 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+4</td>
      <td>v1, v2beta1, v2beta2</td>
      <td>
        <ul>
          <li>v2beta1 is deprecated, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+5</td>
      <td>v1, v2, v2beta2</td>
      <td>
        <ul>
          <li>v2beta1 is removed, "action required" relnote</li>
          <li>v2beta2 is deprecated, "action required" relnote</li>
          <li>v1 is deprecated, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+6</td>
      <td>v1, v2</td>
      <td>
        <ul>
          <li>v2beta2 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+7</td>
      <td>v1, v2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+8</td>
      <td>v1, v2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+9</td>
      <td>v2</td>
      <td>
        <ul>
          <li>v1 is removed, "action required" relnote</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>
-->
<table>
  <thead>
    <tr>
      <th>发布版本</th>
      <th>API 版本</th>
      <th>注意事项</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>X</td>
      <td>v1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+1</td>
      <td>v1, v2alpha1</td>
      <td></td>
    </tr>
    <tr>
      <td>X+2</td>
      <td>v1, v2alpha2</td>
      <td>
        <ul>
           <li>移除 v2alpha1, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+3</td>
      <td>v1, v2beta1</td>
      <td>
        <ul>
          <li>移除 v2alpha2, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+4</td>
      <td>v1, v2beta1, v2beta2</td>
      <td>
        <ul>
          <li>弃用 v2beta1, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+5</td>
      <td>v1, v2, v2beta2</td>
      <td>
        <ul>
          <li>移除 v2beta1, "action required" relnote</li>
          <li>弃用 v2beta2, "action required" relnote</li>
          <li>弃用 v1, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+6</td>
      <td>v1, v2</td>
      <td>
        <ul>
          <li>移除 v2beta2, "action required" relnote</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>X+7</td>
      <td>v1, v2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+8</td>
      <td>v1, v2</td>
      <td></td>
    </tr>
    <tr>
      <td>X+9</td>
      <td>v2</td>
      <td>
        <ul>
          <li>移除 v1, "action required" relnote</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<!--
### REST resources (aka API objects)
-->
### REST 资源 （也叫做 API 对象）

<!--
Consider a hypothetical REST resource named Widget, which was present in API v1
in the above timeline, and which needs to be deprecated.  We
[document](/docs/reference/deprecation-policy/) and
[announce](https://groups.google.com/forum/#!forum/kubernetes-announce) the
deprecation in sync with release X+1.  The Widget resource still exists in API
version v1 (deprecated) but not in v2alpha1.  The Widget resource continues to
exist and function in releases up to and including X+8.  Only in release X+9,
when API v1 has aged out, does the Widget resource cease to exist, and the
behavior get removed.
-->
假定现在有一个需要被弃用的 REST 资源，名为 Widget，在以上的时间线中提供在 API v1 版本中。我们在 X+1 的发布中 [记录](/docs/reference/deprecation-policy/) 并且 [宣布](https://groups.google.com/forum/#!forum/kubernetes-announce) 其弃用。那么 Widget 资源将会继续存在 API v1 版本（已被弃用）但是不在 v2alpha1 中。Widget 必须存在并且保持可用直到 X+8（包含 X+8）。只有在 X+9 发布版本中，当 API v1 已经老化，Widget 资源才会被删除，同时其行为也被移除。

<!--
### Fields of REST resources
-->
### REST 资源的字段

<!--
As with whole REST resources, an individual field which was present in API v1
must exist and function until API v1 is removed.  Unlike whole resources, the
v2 APIs may choose a different representation for the field, as long as it can
be round-tripped.  For example a v1 field named "magnitude" which was
deprecated might be named "deprecatedMagnitude" in API v2.  When v1 is
eventually removed, the deprecated field can be removed from v2.
-->
与整个 REST 资源一样，API v1 中单独的字段必须要保持可用直到 API v1 版本被删除。但是和整个 REST 资源不同的是，API v2 可能对这个字段有不同的表达，只是这个表达要可以相互转化。例如，v1 中将要被弃用的名为 "magnitude" 的字段可能在 API v2 中命名为 "deprecatedMagnitude"。当 v1 被最终移除后，这个弃用字段才能从 v2 中移除。

<!--
### Enumerated or constant values
-->
### 枚举或常量值

<!--
As with whole REST resources and fields thereof, a constant value which was
supported in API v1 must exist and function until API v1 is removed.
-->
与整个 REST 资源及其字段一样，一个在 API v1 中支持的常量必须存在并且保持可用，直到 API v1 被移除。

<!--
### Component config structures
-->
### 组件配置结构

<!--
Component configs are versioned and managed just like REST resources.
-->
组件配置在版本和管理上和 RETS 资源是一样的。

<!--
### Future work
-->
### 未来的工作

<!--
Over time, Kubernetes will introduce more fine-grained API versions, at which
point these rules will be adjusted as needed.
-->
随着时间的推移，Kubernetes 将会出现更多细粒度的 API 版本，到时这些规则也需要做相应的适配。

<!--
## Deprecating a flag or CLI
-->
## 弃用一个参数或 CLI

<!--
The Kubernetes system is comprised of several different programs cooperating.
Sometimes, a Kubernetes release might remove flags or CLI commands
(collectively "CLI elements") in these programs.  The individual programs
naturally sort into two main groups - user-facing and admin-facing programs,
which vary slightly in their deprecation policies.  Unless a flag is explicitly
prefixed or documented as "alpha" or "beta", it is considered GA.
-->
Kubernetes 系统是由几个不同的部件相互协作组成的。有时一个 Kubernetes 发布版本可能会移除这些部件的一些参数或者 CLI 命令（统称 "CLI 元素"）。这些独立的部件自然被分为两个组 - 面向用户和面向管理员的组件，这两者在弃用策略上稍有不同。除非一个参数有明显的 "alpha" 或者 "beta" 前缀，或者被文档标识为 "alpha" 或者 "beta"，否则认为它是 GA 版本。

<!--
CLI elements are effectively part of the API to the system, but since they are
not versioned in the same way as the REST API, the rules for deprecation are as
follows:
-->
CLI 元素实际上是系统 API 的一部分，但是它们没有像 REST API 一样进行版本化，它们的弃用规则如下：

<!--
**Rule #5a: CLI elements of user-facing components (e.g. kubectl) must function
after their announced deprecation for no less than:**

   * **GA: 1 year or 2 releases (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**
-->
**规则 #5a: 面向用户组件的 CLI 元素（例如 kubectl）在它们宣布弃用后至少要保持：**

   * **GA: 1年或2个发布版本 (选择最长的一个)**
   * **Beta: 3个月或者1个发布版本 (选择最长的一个)**
   * **Alpha: 没有要求**

<!--
**Rule #5b: CLI elements of admin-facing components (e.g. kubelet) must function
after their announced deprecation for no less than:**

   * **GA: 6 months or 1 release (whichever is longer)**
   * **Beta: 3 months or 1 release (whichever is longer)**
   * **Alpha: 0 releases**
-->
**规则 #5b: 面向管理员组件的 CLI 元素（例如 kubelet）在它们宣布弃用后至少要保持：**

   * **GA: 6个月或者1个发布版本 (选择最长的一个)**
   * **Beta: 3个月或者1个发布版本 (选择最长的一个)**
   * **Alpha: 没有要求**

<!--
**Rule #6: Deprecated CLI elements must emit warnings (optionally disable)
when used.**
-->
**规则 #6: 在使用弃用的 CLI 元素时必须要发出警告（可选择禁用）**

<!--
## Deprecating a feature or behavior
-->
## 弃用一个功能或者行为

<!--
Occasionally a Kubernetes release needs to deprecate some feature or behavior
of the system that is not controlled by the API or CLI.  In this case, the
rules for deprecation are as follows:
-->
有时一个 Kubernetes 发布版本需要弃用一些非 API 或者 CLI 控制的系统功能或者行为。在这种情况下，弃用策略如下：

<!--
**Rule #7: Deprecated behaviors must function for no less than 1 year after their
announced deprecation.**
-->
**规则 #7: 被弃用的行为在宣布弃用后至少要保持一年可用。**

<!--
This does not imply that all changes to the system are governed by this policy.
This applies only to significant, user-visible behaviors which impact the
correctness of applications running on Kubernetes or that impact the
administration of Kubernetes clusters, and which are being removed entirely.
-->
这并不表示对系统的所有改变都遵循这个策略。这只适用于重大的、用户可见的行为，这些行为将会影响 Kubernetes 应用的正确性或者影响 Kubernetes 集群的管理，这些行为也在彻底清除中。

<!--
## Exceptions
-->
## 例外

<!--
No policy can cover every possible situation.  This policy is a living
document, and will evolve over time.  In practice, there will be situations
that do not fit neatly into this policy, or for which this policy becomes a
serious impediment.  Such situations should be discussed with SIGs and project
leaders to find the best solutions for those specific cases, always bearing in
mind that Kubernetes is committed to being a stable system that, as much as
possible, never breaks users. Exceptions will always be announced in all
relevant release notes.
-->
没有策略能够覆盖所有可能的情况。本文档的策略会随着时间不断演变。实际上，存在并不是完全契合本策略的情况，或者有时本策略变成了一个严重的阻碍。这些情况需要和 SIG 或者项目负责人进行讨论，以找到最好的解决方案。需要时刻记住，Kubernetes 致力于成为一个尽最大可能不破坏用户使用的稳定的系统。例外情况将会在相关的发布公告中宣布。
