---
layout: blog
title: “使用更新后的 Go 版本保持 Kubernetes 安全”
date: 2023-04-06
slug: keeping-kubernetes-secure-with-updated-go-versions
---
<!--
layout: blog
title: "Keeping Kubernetes Secure with Updated Go Versions"
date: 2023-04-06
slug: keeping-kubernetes-secure-with-updated-go-versions
-->

<!--
**Author**: [Jordan Liggitt](https://github.com/liggitt) (Google)
-->

**作者**：[Jordan Liggitt](https://github.com/liggitt) (Google)

**译者**：顾欣 (ICBC)

### 问题 {#the-problem}

<!--
Since v1.19 (released in 2020), the Kubernetes project provides 12-14 months of patch releases for each minor version.
This enables users to qualify and adopt Kubernetes versions in an annual upgrade cycle and receive security fixes for a year.
-->
从 2020 年发布的 v1.19 版本以来，Kubernetes 项目为每个次要版本提供 12-14 个月的补丁维护期。
这使得用户可以按照年度升级周期来评估和选用 Kubernetes 版本，并持续一年获得安全修复。

<!--
The [Go project](https://github.com/golang/go/wiki/Go-Release-Cycle#release-maintenance) releases new minor versions twice a year,
and provides security fixes for the last two minor versions, resulting in about a year of support for each Go version.
Even though each new Kubernetes minor version is built with a supported Go version when it is first released,
that Go version falls out of support before the Kubernetes minor version does,
and the lengthened Kubernetes patch support since v1.19 only widened that gap.
-->
[Go 项目](https://github.com/golang/go/wiki/Go-Release-Cycle#release-maintenance)每年发布两个新的次要版本，
并为最近的两个版本提供安全修复，每个 Go 版本的维护期约为一年。
尽管每个新的 Kubernetes 次要版本在最初发布时都是使用受支持的 Go 版本编译构建的，
但在这一 Kubernetes 次要版本被停止支持之前，对应的 Go 版本就已经不被支持，
并且由于 Kubernetes 从 v1.19 开始延长了补丁支持期，这个差距被进一步扩大。

<!--
At the time this was written, just over half of all [Go patch releases](https://go.dev/doc/devel/release) (88/171) have contained fixes for issues with possible security implications.
Even though many of these issues were not relevant to Kubernetes, some were, so it remained important to use supported Go versions that received those fixes.
-->
在编写本文时，包含了可能对安全产生影响的问题修复的 [Go 补丁发布版本](https://go.dev/doc/devel/release)
刚刚过半（88/171）。尽管这些问题中很多都与 Kubernetes 无关，但有些确实相关，
因此使用受支持的、已包含了这类修复的 Go 版本是非常重要的。

<!--
An obvious solution would be to simply update Kubernetes release branches to new minor versions of Go.
However, Kubernetes avoids [destabilizing changes in patch releases](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md#what-kind-of-prs-are-good-for-cherry-picks),
and historically, this prevented updating existing release branches to new minor versions of Go, due to changes that were considered prohibitively complex, risky, or breaking to include in a patch release.
Examples include:
-->
显而易见的解决方案之一是直接更新 Kubernetes 的发布分支，使用 Go 的新次要版本。
然而，Kubernetes 避免在[补丁发布中引入破坏稳定性的变更](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md#what-kind-of-prs-are-good-for-cherry-picks)，
过去，因为这些变更被认为包含过高的复杂性、风险或破坏性，不适合包含在补丁发布中，
所以不能将现有发布分支更新到 Go 的新次要版本。
示例包括：

<!--
* Go 1.6: enabling http/2 by default
* Go 1.14: EINTR handling issues
* Go 1.17: dropping x509 CN support, ParseIP changes
* Go 1.18: disabling x509 SHA-1 certificate support by default
* Go 1.19: dropping current-dir LookPath behavior
-->
* Go 1.6: 默认支持 http/2
* Go 1.14: EINTR 问题处理
* Go 1.17: 取消 x509 CN 支持, ParseIP 更改
* Go 1.18: 默认禁用 x509 SHA-1 证书支持
* Go 1.19: 取消当前目录 LookPath 行为

<!--
Some of these changes could be easily mitigated in Kubernetes code,
some could only be opted out of via a user-specified `GODEBUG` envvar,
and others required invasive code changes or could not be avoided at all.
Because of this inconsistency, Kubernetes release branches have typically remained on a single Go minor version,
and risked being unable to pick up relevant Go security fixes for the last several months of each Kubernetes minor version's support lifetime.
-->
其中一些更改可以基本不会影响 Kubernetes 代码，
有些只能通过用户指定的 `GODEBUG` 环境变量来选择放弃更新，
而其他变更则需要侵入式的代码变更或完全无法避免。
由于这种不一致性，Kubernetes 的发布分支通常保持使用某个固定的 Go 次要版本，
并在每个 Kubernetes 次要版本支持生命周期的最后几个月内，面临无法得到重要的 Go 安全修复的风险。

<!--
When a relevant Go security fix was only available in newer Kubernetes minor versions,
users would have to upgrade away from older Kubernetes minor versions before their 12-14 month support period ended, just to pick up those fixes.
If a user was not prepared to do that upgrade, it could result in vulnerable Kubernetes clusters.
Even if a user could accommodate the unexpected upgrade, the uncertainty made Kubernetes' annual support less reliable for planning.
-->
当某项重要的 Go 安全修复仅出现在较新的 Kubernetes 次要版本时，
用户必须在旧的 Kubernetes 次要版本的 12-14 个月支持期结束之前完成升级，以获取这些修复。
如果用户没有准备好升级，可能导致 Kubernetes 集群的安全漏洞。
即使用户可以接受这种意外升级，这种不确定性也使得 Kubernetes 在年度支持从规划角度看变得不太可靠。

### 解决方案 {#the-solution}

<!--
We're happy to announce that the gap between supported Kubernetes versions and supported Go versions has been resolved as of January 2023.
-->
我们很高兴地宣布，自2023年1月起，受支持的 Kubernetes 版本与受支持的 Go 版本之间的差距已得到解决。

<!--
We worked closely with the Go team over the past year to address the difficulties adopting new Go versions.
This prompted a [discussion](https://github.com/golang/go/discussions/55090), [proposal](https://github.com/golang/go/issues/56986),
[talk at GopherCon](https://www.youtube.com/watch?v=v24wrd3RwGo), and a [design](https://go.dev/design/56986-godebug) for improving backward compatibility in Go,
ensuring new Go versions can maintain compatible runtime behavior with previous Go versions for a minimum of two years (four Go releases).
This allows projects like Kubernetes to update release branches to supported Go versions without exposing users to behavior changes.
-->
在过去的一年里，我们与 Go 团队密切合作，以解决采用新的 Go 版本的困难。
这些工作推动了一场[讨论](https://github.com/golang/go/discussions/55090)、
[提案](https://github.com/golang/go/issues/56986)、
[GopherCon 演讲](https://www.youtube.com/watch?v=v24wrd3RwGo)和[设计](https://go.dev/design/56986-godebug)，
以提高 Go 的向后兼容性，
确保新的 Go 版本至少在两年（四个 Go 版本）内能够与之前的 Go 版本保持兼容的运行时行为。
这使得像 Kubernetes 这样的项目能够将发布分支更新到受支持的 Go 版本，
而不是将行为上的变更暴露给用户。

<!--
The proposed improvements are on track to be [included in Go 1.21](https://tip.golang.org/doc/godebug), and the Go team already delivered targeted compatibility improvements in a Go 1.19 patch release in late 2022.
Those changes enabled Kubernetes 1.23+ to update to Go 1.19 in January of 2023, while avoiding any user-facing configuration or behavior changes.
All supported Kubernetes release branches now use supported Go versions, and can pick up new Go patch releases with available security fixes.
-->
所提议的改进正按计划[包含在 Go 1.21 中](https://tip.golang.org/doc/godebug)，
而且 Go 团队已经在 2022 年底的 Go 1.19 补丁发布中提供了针对兼容性的改进。
这些更改使 Kubernetes 1.23+ 在 2023 年 1 月升级到 Go 1.19，并避免了任何用户可见的配置或行为变化。
现在所有受支持的 Kubernetes 发布分支都使用受支持的 Go 版本，
并且可以使用包含可用的安全修复的、新的 Go 补丁发布。

<!--
Going forward, Kubernetes maintainers remain committed to making Kubernetes patch releases as safe and non-disruptive as possible,
so there are several requirements a new Go minor version must meet before existing Kubernetes release branches will update to use it:
-->
展望未来，Kubernetes 维护者仍致力于使 Kubernetes 补丁发布尽可能安全且不会造成破坏，
因此在现有的 Kubernetes 发布分支更新使用新的 Go 次要版本之前，新的 Go 次要版本必须满足几个要求：

<!--
1. The new Go version must be available for at least 3 months.
   This gives time for adoption by the Go community, and for reports of issues or regressions.
2. The new Go version must be used in a new Kubernetes minor release for at least 1 month.
   This ensures all Kubernetes release-blocking tests pass on the new Go version,
   and gives time for feedback from the Kubernetes community on release candidates and early adoption of the new minor release.
3. There must be no regressions from the previous Go version known to impact Kubernetes.
4. Runtime behavior must be preserved by default, without requiring any action by Kubernetes users / administrators.
5. Kubernetes libraries like `k8s.io/client-go` must remain compatible with the original Go version used for each minor release,
   so consumers won't *have* to update Go versions to pick up a library patch release (though they are encouraged to build with supported Go versions,
   which is made even easier with the [compatibility improvements](https://go.dev/design/56986-godebug) planned in Go 1.21).
-->
1. 新的 Go 版本必须至少已经推出 3 个月。
   这给了 Go 社区足够的时间进行报告并解决问题。
2. 新的 Go 版本在新的 Kubernetes 次要版本中至少已经使用了 1 个月。
   这确保 Kubernetes 所有可能阻塞发布的测试都需要能在新的 Go 版本下通过，
   并在早期为 Kubernetes 社区对发布候选版本和新次要版本提供反馈时间。
3. 与先前的 Go 版本相比，不能出现新的已知会影响 Kubernetes 的问题。
4. 默认情况下必须保持运行时行为，而无需 Kubernetes 用户/管理员采取任何操作。
5. Kubernetes 库，如 `k8s.io/client-go` 必须与每个次要版本最初使用的 Go 版本保持兼容，
   以便在获取库补丁时，用户不必更新 Go 版本（不过还是鼓励他们使用受支持的 Go 版本构建，
   因为 Go 1.21 计划中的[兼容性改进](https://go.dev/design/56986-godebug)会使得这一操作变简单）。

<!--
The goal of all of this work is to unobtrusively make Kubernetes patch releases safer and more secure,
and to make Kubernetes minor versions safe to use for the entire duration of their support lifetime.
-->
所有这些工作的目标是在不引人注意的情况下使 Kubernetes 补丁发布更加安全可靠，
并确保在整个支持周期内 Kubernetes 次要版本用起来都是安全的。

<!--
Many thanks to the Go team, especially Russ Cox, for helping drive these improvements in ways that will benefit all Go users, not just Kubernetes.
-->
非常感谢 Go 团队，尤其是 Russ Cox，他们推动了这些改进，
使所有 Go 用户受益，而不仅仅是 Kubernetes。

