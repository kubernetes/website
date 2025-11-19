---
layout: blog
title: “使用更新後的 Go 版本保持 Kubernetes 安全”
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

**譯者**：顧欣 (ICBC)

### 問題 {#the-problem}

<!--
Since v1.19 (released in 2020), the Kubernetes project provides 12-14 months of patch releases for each minor version.
This enables users to qualify and adopt Kubernetes versions in an annual upgrade cycle and receive security fixes for a year.
-->
從 2020 年發佈的 v1.19 版本以來，Kubernetes 項目爲每個次要版本提供 12-14 個月的補丁維護期。
這使得使用者可以按照年度升級週期來評估和選用 Kubernetes 版本，並持續一年獲得安全修復。

<!--
The [Go project](https://github.com/golang/go/wiki/Go-Release-Cycle#release-maintenance) releases new minor versions twice a year,
and provides security fixes for the last two minor versions, resulting in about a year of support for each Go version.
Even though each new Kubernetes minor version is built with a supported Go version when it is first released,
that Go version falls out of support before the Kubernetes minor version does,
and the lengthened Kubernetes patch support since v1.19 only widened that gap.
-->
[Go 項目](https://github.com/golang/go/wiki/Go-Release-Cycle#release-maintenance)每年發佈兩個新的次要版本，
併爲最近的兩個版本提供安全修復，每個 Go 版本的維護期約爲一年。
儘管每個新的 Kubernetes 次要版本在最初發布時都是使用受支持的 Go 版本編譯構建的，
但在這一 Kubernetes 次要版本被停止支持之前，對應的 Go 版本就已經不被支持，
並且由於 Kubernetes 從 v1.19 開始延長了補丁支持期，這個差距被進一步擴大。

<!--
At the time this was written, just over half of all [Go patch releases](https://go.dev/doc/devel/release) (88/171) have contained fixes for issues with possible security implications.
Even though many of these issues were not relevant to Kubernetes, some were, so it remained important to use supported Go versions that received those fixes.
-->
在編寫本文時，包含了可能對安全產生影響的問題修復的 [Go 補丁發佈版本](https://go.dev/doc/devel/release)
剛剛過半（88/171）。儘管這些問題中很多都與 Kubernetes 無關，但有些確實相關，
因此使用受支持的、已包含了這類修復的 Go 版本是非常重要的。

<!--
An obvious solution would be to simply update Kubernetes release branches to new minor versions of Go.
However, Kubernetes avoids [destabilizing changes in patch releases](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md#what-kind-of-prs-are-good-for-cherry-picks),
and historically, this prevented updating existing release branches to new minor versions of Go, due to changes that were considered prohibitively complex, risky, or breaking to include in a patch release.
Examples include:
-->
顯而易見的解決方案之一是直接更新 Kubernetes 的發佈分支，使用 Go 的新次要版本。
然而，Kubernetes 避免在[補丁發佈中引入破壞穩定性的變更](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md#what-kind-of-prs-are-good-for-cherry-picks)，
過去，因爲這些變更被認爲包含過高的複雜性、風險或破壞性，不適合包含在補丁發佈中，
所以不能將現有發佈分支更新到 Go 的新次要版本。
示例包括：

<!--
* Go 1.6: enabling http/2 by default
* Go 1.14: EINTR handling issues
* Go 1.17: dropping x509 CN support, ParseIP changes
* Go 1.18: disabling x509 SHA-1 certificate support by default
* Go 1.19: dropping current-dir LookPath behavior
-->
* Go 1.6: 默認支持 http/2
* Go 1.14: EINTR 問題處理
* Go 1.17: 取消 x509 CN 支持, ParseIP 更改
* Go 1.18: 默認禁用 x509 SHA-1 證書支持
* Go 1.19: 取消當前目錄 LookPath 行爲

<!--
Some of these changes could be easily mitigated in Kubernetes code,
some could only be opted out of via a user-specified `GODEBUG` envvar,
and others required invasive code changes or could not be avoided at all.
Because of this inconsistency, Kubernetes release branches have typically remained on a single Go minor version,
and risked being unable to pick up relevant Go security fixes for the last several months of each Kubernetes minor version's support lifetime.
-->
其中一些更改可以基本不會影響 Kubernetes 代碼，
有些只能通過使用者指定的 `GODEBUG` 環境變量來選擇放棄更新，
而其他變更則需要侵入式的代碼變更或完全無法避免。
由於這種不一致性，Kubernetes 的發佈分支通常保持使用某個固定的 Go 次要版本，
並在每個 Kubernetes 次要版本支持生命週期的最後幾個月內，面臨無法得到重要的 Go 安全修復的風險。

<!--
When a relevant Go security fix was only available in newer Kubernetes minor versions,
users would have to upgrade away from older Kubernetes minor versions before their 12-14 month support period ended, just to pick up those fixes.
If a user was not prepared to do that upgrade, it could result in vulnerable Kubernetes clusters.
Even if a user could accommodate the unexpected upgrade, the uncertainty made Kubernetes' annual support less reliable for planning.
-->
當某項重要的 Go 安全修復僅出現在較新的 Kubernetes 次要版本時，
使用者必須在舊的 Kubernetes 次要版本的 12-14 個月支持期結束之前完成升級，以獲取這些修復。
如果使用者沒有準備好升級，可能導致 Kubernetes 叢集的安全漏洞。
即使使用者可以接受這種意外升級，這種不確定性也使得 Kubernetes 在年度支持從規劃角度看變得不太可靠。

### 解決方案 {#the-solution}

<!--
We're happy to announce that the gap between supported Kubernetes versions and supported Go versions has been resolved as of January 2023.
-->
我們很高興地宣佈，自2023年1月起，受支持的 Kubernetes 版本與受支持的 Go 版本之間的差距已得到解決。

<!--
We worked closely with the Go team over the past year to address the difficulties adopting new Go versions.
This prompted a [discussion](https://github.com/golang/go/discussions/55090), [proposal](https://github.com/golang/go/issues/56986),
[talk at GopherCon](https://www.youtube.com/watch?v=v24wrd3RwGo), and a [design](https://go.dev/design/56986-godebug) for improving backward compatibility in Go,
ensuring new Go versions can maintain compatible runtime behavior with previous Go versions for a minimum of two years (four Go releases).
This allows projects like Kubernetes to update release branches to supported Go versions without exposing users to behavior changes.
-->
在過去的一年裏，我們與 Go 團隊密切合作，以解決採用新的 Go 版本的困難。
這些工作推動了一場[討論](https://github.com/golang/go/discussions/55090)、
[提案](https://github.com/golang/go/issues/56986)、
[GopherCon 演講](https://www.youtube.com/watch?v=v24wrd3RwGo)和[設計](https://go.dev/design/56986-godebug)，
以提高 Go 的向後兼容性，
確保新的 Go 版本至少在兩年（四個 Go 版本）內能夠與之前的 Go 版本保持兼容的運行時行爲。
這使得像 Kubernetes 這樣的項目能夠將發佈分支更新到受支持的 Go 版本，
而不是將行爲上的變更暴露給使用者。

<!--
The proposed improvements are on track to be [included in Go 1.21](https://tip.golang.org/doc/godebug), and the Go team already delivered targeted compatibility improvements in a Go 1.19 patch release in late 2022.
Those changes enabled Kubernetes 1.23+ to update to Go 1.19 in January of 2023, while avoiding any user-facing configuration or behavior changes.
All supported Kubernetes release branches now use supported Go versions, and can pick up new Go patch releases with available security fixes.
-->
所提議的改進正按計劃[包含在 Go 1.21 中](https://tip.golang.org/doc/godebug)，
而且 Go 團隊已經在 2022 年底的 Go 1.19 補丁發佈中提供了針對兼容性的改進。
這些更改使 Kubernetes 1.23+ 在 2023 年 1 月升級到 Go 1.19，並避免了任何使用者可見的設定或行爲變化。
現在所有受支持的 Kubernetes 發佈分支都使用受支持的 Go 版本，
並且可以使用包含可用的安全修復的、新的 Go 補丁發佈。

<!--
Going forward, Kubernetes maintainers remain committed to making Kubernetes patch releases as safe and non-disruptive as possible,
so there are several requirements a new Go minor version must meet before existing Kubernetes release branches will update to use it:
-->
展望未來，Kubernetes 維護者仍致力於使 Kubernetes 補丁發佈儘可能安全且不會造成破壞，
因此在現有的 Kubernetes 發佈分支更新使用新的 Go 次要版本之前，新的 Go 次要版本必須滿足幾個要求：

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
1. 新的 Go 版本必須至少已經推出 3 個月。
   這給了 Go 社區足夠的時間進行報告並解決問題。
2. 新的 Go 版本在新的 Kubernetes 次要版本中至少已經使用了 1 個月。
   這確保 Kubernetes 所有可能阻塞發佈的測試都需要能在新的 Go 版本下通過，
   並在早期爲 Kubernetes 社區對發佈候選版本和新次要版本提供反饋時間。
3. 與先前的 Go 版本相比，不能出現新的已知會影響 Kubernetes 的問題。
4. 默認情況下必須保持運行時行爲，而無需 Kubernetes 使用者/管理員採取任何操作。
5. Kubernetes 庫，如 `k8s.io/client-go` 必須與每個次要版本最初使用的 Go 版本保持兼容，
   以便在獲取庫補丁時，使用者不必更新 Go 版本（不過還是鼓勵他們使用受支持的 Go 版本構建，
   因爲 Go 1.21 計劃中的[兼容性改進](https://go.dev/design/56986-godebug)會使得這一操作變簡單）。

<!--
The goal of all of this work is to unobtrusively make Kubernetes patch releases safer and more secure,
and to make Kubernetes minor versions safe to use for the entire duration of their support lifetime.
-->
所有這些工作的目標是在不引人注意的情況下使 Kubernetes 補丁發佈更加安全可靠，
並確保在整個支持週期內 Kubernetes 次要版本用起來都是安全的。

<!--
Many thanks to the Go team, especially Russ Cox, for helping drive these improvements in ways that will benefit all Go users, not just Kubernetes.
-->
非常感謝 Go 團隊，尤其是 Russ Cox，他們推動了這些改進，
使所有 Go 使用者受益，而不僅僅是 Kubernetes。

