---
layout: blog
title: "聚焦 SIG Testing"
slug: sig-testing-spotlight-2023
date: 2023-11-24
---
<!--
layout: blog
title: "Spotlight on SIG Testing"
slug: sig-testing-spotlight-2023
date: 2023-11-24
canonicalUrl: https://www.kubernetes.dev/blog/2023/11/24/sig-testing-spotlight-2023/
-->

**作者:** Sandipan Panda

**譯者:** [Michael Yao](https://github.com/windsonsea)

<!--
Welcome to another edition of the _SIG spotlight_ blog series, where we
highlight the incredible work being done by various Special Interest
Groups (SIGs) within the Kubernetes project. In this edition, we turn
our attention to [SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing#readme),
a group interested in effective testing of Kubernetes and automating
away project toil. SIG Testing focus on creating and running tools and
infrastructure that make it easier for the community to write and run
tests, and to contribute, analyze and act upon test results.
-->
歡迎閱讀又一期的 “SIG 聚光燈” 系列博客，這些博客重點介紹 Kubernetes
項目中各個特別興趣小組（SIG）所從事的令人讚歎的工作。這篇博客將聚焦
[SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing#readme)，
這是一個致力於有效測試 Kubernetes，讓此項目的繁瑣工作實現自動化的興趣小組。
SIG Testing 專注於創建和運行工具和基礎設施，使社區更容易編寫和運行測試，並對測試結果做貢獻、分析和處理。

<!--
To gain some insights into SIG Testing, [Sandipan
Panda](https://github.com/sandipanpanda) spoke with [Michelle Shepardson](https://github.com/michelle192837),
a senior software engineer at Google and a chair of SIG Testing, and
[Patrick Ohly](https://github.com/pohly), a software engineer and architect at
Intel and a SIG Testing Tech Lead.
-->
爲了深入瞭解 SIG Testing 的情況，
[Sandipan Panda](https://github.com/sandipanpanda)
採訪了 Google 高級軟件工程師兼 SIG Testing 主席
[Michelle Shepardson](https://github.com/michelle192837)
以及英特爾軟件工程師、架構師兼 SIG Testing 技術負責人
[Patrick Ohly](https://github.com/pohly)。

<!--
## Meet the contributors

**Sandipan:** Could you tell us a bit about yourself, your role, and
how you got involved in the Kubernetes project and SIG Testing?
-->
## 會見貢獻者   {#meet-the-contributors}

**Sandipan:** 你能簡單介紹一下自己嗎，談談你的職責角色以及你是如何參與
Kubernetes 項目和 SIG Testing 的？

<!--
**Michelle:** Hi! I'm Michelle, a senior software engineer at
Google. I first got involved in Kubernetes through working on tooling
for SIG Testing, like the external instance of TestGrid. I'm part of
oncall for TestGrid and Prow, and am now a chair for the SIG.
-->
**Michelle:** 嗨！我是 Michelle，是 Google 高級軟件工程師。
我最初是爲 SIG Testing 開發工具（如 TestGrid 的外部實例）而參與到 Kubernetes 項目的。
我是 TestGrid 和 Prow 的輪值人員，現在也是這個 SIG 的主席。

<!--
**Patrick:** Hello! I work as a software engineer and architect in a
team at Intel which focuses on open source Cloud Native projects. When
I ramped up on Kubernetes to develop a storage driver, my very first
question was "how do I test it in a cluster and how do I log
information?" That interest led to various enhancement proposals until
I had (re)written enough code that also took over official roles as
SIG Testing Tech Lead (for the [E2E framework](https://github.com/kubernetes-sigs/e2e-framework)) and
structured logging WG lead.
-->
**Patrick:** 你好！我在英特爾的一個團隊中擔任軟件工程師和架構師，專注於開源雲原生項目。
當我開始學習 Kubernetes 開發存儲驅動時，我最初的問題是“如何在叢集中進行測試以及如何記錄信息？”
這個興趣點引發了各種增強提案，直到我（重新）編寫了足夠多的代碼，也正式擔任了 SIG Testing 技術負責人
（負責 [E2E 框架](https://github.com/kubernetes-sigs/e2e-framework)）兼結構化日誌工作組負責人。

<!--
## Testing practices and tools

**Sandipan:** Testing is a field in which multiple approaches and
tools exist; how did you arrive at the existing practices?
-->
## 測試實踐和工具    {#testing-practices-and-tools}

**Sandipan:** 測試是一個存在多種方法和工具的領域，你們是如何形成現有實踐方式的？

<!--
**Patrick:** I can’t speak about the early days because I wasn’t
around yet 😆, but looking back at some of the commit history it’s
pretty obvious that developers just took what was available and
started using it. For E2E testing, that was
[Ginkgo+Gomega](https://github.com/onsi/ginkgo). Some hacks were
necessary, for example around cleanup after a test run and for
categorising tests. Eventually this led to Ginkgo v2 and [revised best
practices for E2E testing](https://www.kubernetes.dev/blog/2023/04/12/e2e-testing-best-practices-reloaded/).
Regarding unit testing opinions are pretty diverse: some maintainers
prefer to use just the Go standard library with hand-written
checks. Others use helper packages like stretchr/testify. That
diversity is okay because unit tests are self-contained - contributors
just have to be flexible when working on many different areas.
Integration testing falls somewhere in the middle. It’s based on Go
unit tests, but needs complex helper packages to bring up an apiserver
and other components, then runs tests that are more like E2E tests.
-->
**Patrick:** 我沒法談論早期情況，因爲那時我還未參與其中 😆，但回顧一些提交歷史可以明顯看出，
當時開發人員只是看看有什麼可用的工具並開始使用這些工具。對於 E2E 測試來說，使用的是
[Ginkgo + Gomega](https://github.com/onsi/ginkgo)。集成一些黑科技是必要的，
例如在測試運行後進行清理和對測試進行分類。最終形成了 Ginkgo v2
和[重新修訂的 E2E 測試最佳實踐](https://www.kubernetes.dev/blog/2023/04/12/e2e-testing-best-practices-reloaded/)。
關於單元測試，意見非常多樣化：一些維護者傾向於只使用 Go 標準庫和手動檢查。
而其他人使用 stretchr/testify 這類輔助工具包。這種多樣性是可以接受的，因爲單元測試是自包含的：
貢獻者只需在處理許多不同領域時保持靈活。集成測試介於二者之間，它基於 Go 單元測試，
但需要複雜的輔助工具包來啓動 API 伺服器和其他組件，然後運行更像是 E2E 測試的測試。

<!--
## Subprojects owned by SIG Testing

**Sandipan:** SIG Testing is pretty diverse. Can you give a brief
overview of the various subprojects owned by SIG Testing?
-->
## SIG Testing 擁有的子項目    {#subprojects-owned-by-sig-testing}

**Sandipan:** SIG Testing 非常多樣化。你能簡要介紹一下 SIG Testing 擁有的各個子項目嗎？

<!--
**Michelle:** Broadly, we have subprojects related to testing
frameworks, and infrastructure, though they definitely overlap.  So
for the former, there's
[e2e-framework](https://pkg.go.dev/sigs.k8s.io/e2e-framework) (used
externally),
[test/e2e/framework](https://pkg.go.dev/k8s.io/kubernetes/test/e2e/framework)
(used for Kubernetes itself) and kubetest2 for end-to-end testing,
as well as boskos (resource rental for e2e tests),
[KIND](https://kind.sigs.k8s.io/) (Kubernetes-in-Docker, for local
testing and development), and the cloud provider for KIND.  For the
latter, there's [Prow](https://docs.prow.k8s.io/) (K8s-based CI/CD and
chatops), and a litany of other tools and utilities for triage,
analysis, coverage, Prow/TestGrid config generation, and more in the
test-infra repo.
-->
**Michelle:** 廣義上來說，我們擁有與測試框架相關的子項目和基礎設施，儘管它們肯定存在重疊。
我們的子項目包括：

- [e2e-framework](https://pkg.go.dev/sigs.k8s.io/e2e-framework)（外部使用）
- [test/e2e/framework](https://pkg.go.dev/k8s.io/kubernetes/test/e2e/framework)
  （用於 Kubernetes 本身）
- kubetest2（用於端到端測試）
- boskos（用於 e2e 測試的資源租賃）
- [KIND](https://kind.sigs.k8s.io/)（在 Docker 中運行 Kubernetes，用於本地測試和開發）
- 以及 KIND 的雲驅動。

我們的基礎設施包括：

- [Prow](https://docs.prow.k8s.io/)（基於 K8s 的 CI/CD 和 chatops）
- test-infra 倉庫中用於分類、分析、覆蓋率、Prow/TestGrid 設定生成等的其他工具和實用程序。

<!--
*If you are willing to learn more and get involved with any of the SIG
Testing subprojects, check out the [SIG Testing README](https://github.com/kubernetes/community/tree/master/sig-testing#subprojects).*
-->
**如果你有興趣瞭解更多並參與到 SIG Testing 的任何子項目中，查閱
[SIG Testing 的 README](https://github.com/kubernetes/community/tree/master/sig-testing#subprojects)。**

<!--
## Key challenges and accomplishments

**Sandipan:** What are some of the key challenges you face?
-->
## 主要挑戰和成就    {#key-challenges-and-accomplishments}

**Sandipan:** 你們面臨的一些主要挑戰是什麼？

<!--
**Michelle:** Kubernetes is a gigantic project in every aspect, from
contributors to code to users and more. Testing and infrastructure
have to meet that scale, keeping up with every change from every repo
under Kubernetes while facilitating developing, improving, and
releasing the project as much as possible, though of course, we're not
the only SIG involved in that.  I think another other challenge is
staffing subprojects. SIG Testing has a number of subprojects that
have existed for years, but many of the original maintainers for them
have moved on to other areas or no longer have the time to maintain
them. We need to grow long-term expertise and owners in those
subprojects.
-->
**Michelle:** Kubernetes 從貢獻者到代碼再到使用者等各方面看都是一個龐大的項目。
測試和基礎設施必須滿足這種規模，跟上 Kubernetes 每個倉庫的所有變化，
同時儘可能地促進開發、改進和發佈項目，儘管當然我們並不是唯一參與其中的 SIG。
我認爲另一個挑戰是子項目的人員設定。SIG Testing 有一些已經存在多年的子項目，
但其中許多最初的維護者已經轉到其他領域或者沒有時間繼續維護它們。
我們需要在這些子項目中培養長期的專業知識和 Owner。

<!--
**Patrick:** As Michelle said, the sheer size can be a challenge. It’s
not just the infrastructure, also our processes must scale with the
number of contributors. It’s good to document best practices, but not
good enough: we have many new contributors, which is good, but having
reviewers explain best practices doesn’t scale - assuming that the
reviewers even know about them! It also doesn’t help that existing
code cannot get updated immediately because there is so much of it, in
particular for E2E testing. The initiative to [apply stricter linting to new or modified code](https://groups.google.com/a/kubernetes.io/g/dev/c/myGiml72IbM/m/QdO5bgQiAQAJ)
while accepting that existing code doesn’t pass those same linter
checks helps a bit.
-->
**Patrick:** 正如 Michelle 所說，規模本身可能就是一個挑戰。
不僅基礎設施要與之匹配，我們的流程也必須與貢獻者數量相匹配。
記錄最佳實踐是好的，但還不夠好：我們有許多新的貢獻者，這是好事，
但是讓 Reviewer 靠人工解釋最佳實踐並不可行，這前提是 Reviewer 瞭解這些最佳實踐！
如果現有代碼不能被立即更新也無濟於事，因爲代碼實在太多了，特別是對於 E2E 測試來說更是如此。
在接受現有代碼無法通過同樣的 linter 檢查的同時，
[爲新代碼或代碼修改應用更嚴格的 lint 檢查](https://groups.google.com/a/kubernetes.io/g/dev/c/myGiml72IbM/m/QdO5bgQiAQAJ)對於改善情況會有所幫助。

<!--
**Sandipan:** Any SIG accomplishments that you are proud of and would
like to highlight?
-->
**Sandipan:** 有沒有一些 SIG 成就使你感到自豪，想要重點說一下？

<!--
**Patrick:** I am biased because I have been driving this, but I think
that the [E2E framework](https://github.com/kubernetes-sigs/e2e-framework) and linting are now in a much better shape than
they used to be. We may soon be able to run integration tests with
race detection enabled, which is important because we currently only
have that for unit tests and those tend to be less complex.
-->
**Patrick:** 我有一些拙見，因爲我一直在推動這個項目，但我認爲現在
[E2E 框架](https://github.com/kubernetes-sigs/e2e-framework)和 lint 機制比以前好得多。
我們可能很快就能在啓用競爭檢測的情況下運行集成測試，這很重要，
因爲目前我們只能對單元測試進行競爭檢測，而那些往往不太複雜。

<!--
**Sandipan:** Testing is always important, but is there anything
specific to your work in terms of the Kubernetes release process?
-->
**Sandipan:** 測試始終很重要，但在 Kubernetes 發佈過程中，你的工作是否有任何特殊之處？

<!--
**Patrick:** [test flakes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-testing/flaky-tests.md)…
if we have too many of those, development velocity goes down because
PRs cannot be merged without clean test runs and those become less
likely. Developers also lose trust in testing and just "retest" until
they have a clean run, without checking whether failures might indeed
be related to a regression in their current change.
-->
**Patrick:** [測試不穩定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-testing/flaky-tests.md)……
如果我們有太多這樣的不穩定測試，開發速度就會下降，因爲我們無法在沒有乾淨測試運行環境的情況下合併 PR，
並且這些環境會越來越少。開發者也會失去對測試的信任，只是“重新測試”直到有了一個乾淨的運行環境爲止，
而不會檢查失敗是否確實與當前更改中的迴歸有關。

<!--
## The people and the scope

**Sandipan:** What are some of your favourite things about this SIG?
-->
## 人員和範圍    {#the-people-and-the-scope}

**Sandipan:** 這個 SIG 中有哪些讓你熱愛的？

<!--
**Michelle:** The people, of course 🙂. Aside from that, I like the
broad scope SIG Testing has. I feel like even small changes can make a
big difference for fellow contributors, and even if my interests
change over time, I'll never run out of projects to work on.
-->
**Michelle:** 當然是人 🙂。除此之外，我喜歡 SIG Testing 的寬廣範圍。
我覺得即使是小的改動也可以對其他貢獻者產生重大影響，即使隨着時間的推移我的興趣發生變化，
我也永遠不會缺少項目可供我參與。

<!--
**Patrick:** I can work on things that make my life and the life of my
fellow developers better, like the tooling that we have to use every
day while working on some new feature elsewhere.

**Sandipan:** Are there any funny / cool / TIL anecdotes that you
could tell us?
-->
**Patrick:** 我的工作是爲了讓我和其他開發人員的工作變得更好，
比如建設在其他地方開發新特性時每天必須使用的工具。

**Sandipan:** 你們有沒有任何好玩/酷炫/日常趣事可以告訴我們？

<!--
**Patrick:** I started working on E2E framework enhancements five
years ago, then was less active there for a while. When I came back
and wanted to test some new enhancement, I asked about how to write
unit tests for the new code and was pointed to some existing tests
which looked vaguely familiar, as if I had *seen* them before. I
looked at the commit history and found that I had *written* them! I’ll
let you decide whether that says something about my failing long-term
memory or simply is normal… Anyway, folks, remember to write good
commit messages and comments; someone will need them at some point -
it might even be yourself!
-->
**Patrick:** 五年前，我開始致力於 E2E 框架的增強，然後在一段時間內參與活動較少。
當我回來並想要測試一些新的增強功能時，我詢問如何爲新代碼編寫單元測試，
並被指向了一些看起來有些熟悉的、好像以前**見過**的現有測試。
我查看了提交歷史，發現這些測試是我自己**編寫的**！
你可以決定這是否說明了我的長期記憶力衰退還是這很正常...
無論如何，夥計們，要謹記讓每個 Commit 的消息和註釋明確、友好；
某一刻會有人需要看這些消息和註釋 - 甚至可能就是你自己！

<!--
## Looking ahead

**Sandipan:** What areas and/or subprojects does your SIG need help with?
-->
## 展望未來    {#looking-ahead}

**Sandipan:** 在哪些領域和/或子項目上，你們的 SIG 需要幫助？

<!--
**Michelle:** Some subprojects aren't staffed at the moment and could
use folks willing to learn more about
them. [boskos](https://github.com/kubernetes-sigs/boskos#boskos) and
[kubetest2](https://github.com/kubernetes-sigs/kubetest2#kubetest2)
especially stand out to me, since both are important for testing but
lack dedicated owners.
-->
**Michelle:** 目前有一些子項目沒有人員設定，需要有意願瞭解更多的人蔘與進來。
[boskos](https://github.com/kubernetes-sigs/boskos#boskos) 和
[kubetest2](https://github.com/kubernetes-sigs/kubetest2#kubetest2) 對我來說尤其突出，
因爲它們對於測試非常重要，但卻缺乏專門的負責人。

<!--
**Sandipan:** Are there any useful skills that new contributors to SIG
Testing can bring to the table? What are some things that people can
do to help this SIG if they come from a background that isn’t directly
linked to programming?
-->
**Sandipan:** 新的 SIG Testing 貢獻者可以帶來哪些有用的技能？
如果他們的背景與編程沒有直接關聯，有哪些方面可以幫助到這個 SIG？

<!--
**Michelle:** I think user empathy, writing clear feedback, and
recognizing patterns are really useful. Someone who uses the test
framework or tooling and can outline pain points with clear examples,
or who can recognize a wider issue in the project and pull data to
inform solutions for it.
-->
**Michelle:** 我認爲具備使用者共情、清晰反饋和識別模式的能力非常有用。
有人使用測試框架或工具，並能用清晰的示例概述痛點，或者能夠識別項目中的更廣泛的問題並提供數據來支持解決方案。

<!--
**Sandipan:** What’s next for SIG Testing?

**Patrick:** Stricter linting will soon become mandatory for new
code. There are several E2E framework sub-packages that could be
modernised, if someone wants to take on that work. I also see an
opportunity to unify some of our helper code for E2E and integration
testing, but that needs more thought and discussion.
-->
**Sandipan:** SIG Testing 的下一步是什麼？

**Patrick:** 對於新代碼，更嚴格的 lint 檢查很快將成爲強制要求。
如果有人願意承擔這項工作，我們可以對一些 E2E 框架的子工具包進行現代化改造。
我還看到一個機會，可以統一一些 E2E 和集成測試的輔助代碼，但這需要更多的思考和討論。

<!--
**Michelle:** I'm looking forward to making some usability
improvements for some of our tools and infra, and to supporting more
long-term contributions and growth of contributors into long-term
roles within the SIG. If you're interested, hit us up!
-->
**Michelle:** 我期待爲我們的工具和基礎設施進行一些可用性改進，
並支持更多長期貢獻者的貢獻和成長，使他們在 SIG 中擔任長期角色。如果你有興趣，請聯繫我們！

<!--
Looking ahead, SIG Testing has exciting plans in store. You can get in
touch with the folks at SIG Testing in their [Slack channel](https://kubernetes.slack.com/messages/sig-testing) or attend
one of their regular [bi-weekly meetings on Tuesdays](https://github.com/kubernetes/community/tree/master/sig-testing#meetings). If
you are interested in making it easier for the community to run tests
and contribute test results, to ensure Kubernetes is stable across a
variety of cluster configurations and cloud providers, join the SIG
Testing community today!
-->
展望未來，SIG Testing 有令人興奮的計劃。你可以通過他們的
[Slack 頻道](https://kubernetes.slack.com/messages/sig-testing)與 SIG Testing 的人員取得聯繫，
或參加他們定期舉行的[每兩週的週二會議](https://github.com/kubernetes/community/tree/master/sig-testing#meetings)。
如果你有興趣爲社區更輕鬆地運行測試並貢獻測試結果，確保 Kubernetes
在各種叢集設定和雲驅動中保持穩定，請立即加入 SIG Testing 社區！
