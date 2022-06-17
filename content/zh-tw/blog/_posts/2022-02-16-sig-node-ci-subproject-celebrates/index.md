---
layout: blog
title: 'SIG Node CI 子專案慶祝測試改進兩週年'
date: 2022-02-16
slug: sig-node-ci-subproject-celebrates
canonicalUrl: https://www.kubernetes.dev/blog/2022/02/16/sig-node-ci-subproject-celebrates-two-years-of-test-improvements/
---
<!--
---
layout: blog
title: 'SIG Node CI Subproject Celebrates Two Years of Test Improvements'
date: 2022-02-16
slug: sig-node-ci-subproject-celebrates
canonicalUrl: https://www.kubernetes.dev/blog/2022/02/16/sig-node-ci-subproject-celebrates-two-years-of-test-improvements/
url: /zh-cn/blog/2022/02/sig-node-ci-subproject-celebrates
---
-->

**作者：** Sergey Kanzhelev (Google), Elana Hashman (Red Hat)
<!--**Authors:** Sergey Kanzhelev (Google), Elana Hashman (Red Hat)-->

<!--Ensuring the reliability of SIG Node upstream code is a continuous effort
that takes a lot of behind-the-scenes effort from many contributors.
There are frequent releases of Kubernetes, base operating systems,
container runtimes, and test infrastructure that result in a complex matrix that
requires attention and steady investment to "keep the lights on."
In May 2020, the Kubernetes node special interest group ("SIG Node") organized a new
subproject for continuous integration (CI) for node-related code and tests. Since its
inauguration, the SIG Node CI subproject has run a weekly meeting, and even the full hour
is often not enough to complete triage of all bugs, test-related PRs and issues, and discuss all
related ongoing work within the subgroup.-->
保證 SIG 節點上游程式碼的可靠性是一項持續的工作，需要許多貢獻者在幕後付出大量努力。
Kubernetes、基礎作業系統、容器執行時和測試基礎架構的頻繁釋出，導致了一個複雜的矩陣，
需要關注和穩定的投資來“保持燈火通明”。2020 年 5 月，Kubernetes Node 特殊興趣小組
（“SIG Node”）為節點相關程式碼和測試組織了一個新的持續整合（CI）子專案。自成立以來，SIG Node CI
子專案每週舉行一次會議，即使一整個小時通常也不足以完成對所有缺陷、測試相關的 PR 和問題的分類，
並討論組內所有相關的正在進行的工作。

<!--Over the past two years, we've fixed merge-blocking and release-blocking tests, reducing time to merge Kubernetes contributors' pull requests thanks to reduced test flakes. When we started, Node test jobs only passed 42% of the time, and through our efforts, we now ensure a consistent >90% job pass rate. We've closed 144 test failure issues and merged 176 pull requests just in kubernetes/kubernetes. And we've helped subproject participants ascend the Kubernetes contributor ladder, with 3 new org members, 6 new reviewers, and 2 new approvers.-->
在過去兩年中，我們修復了阻塞合併和阻塞釋出的測試，由於減少了測試缺陷，縮短了合併 Kubernetes 
貢獻者的拉取請求的時間。透過我們的努力，任務透過率由開始時 42% 提高至穩定大於 90% 。我們已經解決了 144 個測試失敗問題，
並在 kubernetes/kubernetes 中合併了 176 個拉取請求。
我們還幫助子專案參與者提升了 Kubernetes 貢獻者的等級，新增了 3 名組織成員、6 名評審員和 2 名審批員。


<!--The Node CI subproject is an approachable first stop to help new contributors
get started with SIG Node. There is a low barrier to entry for new contributors
to address high-impact bugs and test fixes, although there is a long
road before contributors can climb the entire contributor ladder:
it took over a year to establish two new approvers for the group.
The complexity of all the different components that power Kubernetes nodes
and its test infrastructure requires a sustained investment over a long period
for developers to deeply understand the entire system,
both at high and low levels of detail.-->
Node CI 子專案是一個可入門的第一站，幫助新參與者開始使用 SIG Node。對於新貢獻者來說，
解決影響較大的缺陷和測試修復的門檻很低，儘管貢獻者要攀登整個貢獻者階梯還有很長的路要走：
為該團隊培養了兩個新的審批人花了一年多的時間。為 Kubernetes 節點及其測試基礎設施提供動力的所有
不同元件的複雜性要求開發人員在很長一段時間內進行持續投資，
以深入瞭解整個系統，從宏觀到微觀。

<!--We have several regular contributors at our meetings, however; our reviewers
and approvers pool is still small. It is our goal to continue to grow
contributors to ensure a sustainable distribution of work
that does not just fall to a few key approvers.-->
雖然在我們的會議上有幾個比較固定的貢獻者；但是我們的評審員和審批員仍然很少。
我們的目標是繼續增加貢獻者，以確保工作的可持續分配，而不僅僅是少數關鍵批准者。

<!--It's not always obvious how subprojects within SIGs are formed, operate,
and work. Each is unique to its sponsoring SIG and tailored to the projects
that the group is intended to support. As a group that has welcomed many
first-time SIG Node contributors, we'd like to share some of the details and
accomplishments over the past two years,
helping to demystify our inner workings and celebrate the hard work
of all our dedicated contributors!-->
SIG 中的子專案如何形成、執行和工作並不總是顯而易見的。每一個都是其背後的 SIG 所獨有的，
並根據該小組打算支援的專案量身定製。作為一個歡迎了許多第一次 SIG Node 貢獻者的團隊，
我們想分享過去兩年的一些細節和成就，幫助揭開我們內部工作的神秘面紗，並慶祝我們所有專注貢獻者的辛勤工作！

<!--## Timeline-->
## 時間線

<!--***May 2020.*** SIG Node CI group was formed on May 11, 2020, with more than
[30 volunteers](https://docs.google.com/document/d/1fb-ugvgdSVIkkuJ388_nhp2pBTy_4HEVg5848Xy7n5U/edit#bookmark=id.vsb8pqnf4gib)
signed up, to improve SIG Node CI signal and overall observability.
Victor Pickard focused on getting
[testgrid jobs](https://testgrid.k8s.io/sig-node) passing
when Ning Liao suggested forming a group around this effort and came up with
the [original group charter document](https://docs.google.com/document/d/1yS-XoUl6GjZdjrwxInEZVHhxxLXlTIX2CeWOARmD8tY/edit#heading=h.te6sgum6s8uf).
The SIG Node chairs sponsored group creation with Victor as a subproject lead.
Sergey Kanzhelev joined Victor shortly after as a co-lead.-->
***2020 年 5 月*** SIG Node CI 組於 2020 年 5 月 11 日成立，超過
[30 名志願者](https://docs.google.com/document/d/1fb-ugvgdSVIkkuJ388_nhp2pBTy_4HEVg5848Xy7n5U/edit#bookmark=id.vsb8pqnf4gib)
註冊，以改進 SIG Node CI 訊號和整體可觀測性。
Victor Pickard 專注於讓 [testgrid 可以執行](https://testgrid.k8s.io/sig-node) ，
當時 Ning Liao 建議圍繞這項工作組建一個小組，並提出 
[最初的小組章程檔案](https://docs.google.com/document/d/1yS-XoUl6GjZdjrwxInEZVHhxxLXlTIX2CeWOARmD8tY/edit#heading=h.te6sgum6s8uf) 。
SIG Node 贊助成立以 Victor 作為子專案負責人的小組。Sergey Kanzhelev 不久後就加入 Victor，擔任聯合領導人。

<!--At the kick-off meeting, we discussed which tests to concentrate on fixing first
and discussed merge-blocking and release-blocking tests, many of which were failing due
to infrastructure issues or buggy test code.-->
在啟動會議上，我們討論了應該首先集中精力修復哪些測試，並討論了阻塞合併和阻塞釋出的測試，
其中許多測試由於基礎設施問題或錯誤的測試程式碼而失敗。

<!--The subproject launched weekly hour-long meetings to discuss ongoing work
discussion and triage.-->
該子專案每週召開一小時的會議，討論正在進行的工作會談和分類。

<!--***June 2020.*** Morgan Bauer, Karan Goel, and Jorge Alarcon Ochoa were
recognized as reviewers for the SIG Node CI group for their contributions,
helping significantly with the early stages of the subproject.
David Porter and Roy Yang also joined the SIG test failures GitHub team.-->
***2020 年 6 月*** Morgan Bauer 、 Karan Goel 和 Jorge Alarcon Ochoa 
因其貢獻而被公認為 SIG Node CI 小組的評審員，為該子專案的早期階段提供了重要幫助。
David Porter 和 Roy Yang 也加入了 SIG 檢測失敗的 GitHub 測試團隊。

<!--***August 2020.*** All merge-blocking and release-blocking tests were passing,
with some flakes. However, only 42% of all SIG Node test jobs were green, as there
were many flakes and failing tests.-->
***2020 年 8 月*** 所有的阻塞合併和阻塞釋出的測試都通過了，伴有一些邏輯問題。
然而，只有 42% 的 SIG Node 測試作業是綠色的，
因為有許多邏輯錯誤和失敗的測試。

<!--***October 2020.*** Amim Knabben becomes a Kubernetes org member for his
contributions to the subproject.-->
***2020 年 10 月*** Amim Knabben 因對子專案的貢獻成為 Kubernetes 組織成員。

<!--***January 2021.*** With healthy presubmit and critical periodic jobs passing,
the subproject discussed its goal for cleaning up the rest of periodic tests
and ensuring they passed without flakes.-->
***2021 年 1 月*** 隨著健全的預提交和關鍵定期工作的透過，子專案討論了清理其餘定期測試並確保其順利透過的目標。

<!--Elana Hashman joined the subproject, stepping up to help lead it after
Victor's departure.-->
Elana Hashman 加入了這個子專案，在 Victor 離開後幫助領導該專案。

<!--***February 2021.*** Artyom Lukianov becomes a Kubernetes org member for his
contributions to the subproject.-->
***2021 年 2 月*** Artyom Lukianov 因其對子專案的貢獻成為 Kubernetes 組織成員。

<!--***August 2021.*** After SIG Node successfully ran a [bug scrub](https://groups.google.com/g/kubernetes-dev/c/w2ghO4ihje0/m/VeEql1LJBAAJ)
to clean up its bug backlog, the scope of the meeting was extended to
include bug triage to increase overall reliability, anticipating issues
before they affect the CI signal.-->
***2021 年 8 月*** 在 SIG Node 成功執行 [bug scrub](https://groups.google.com/g/kubernetes-dev/c/w2ghO4ihje0/m/VeEql1LJBAAJ)
以清理其累積的缺陷之後，會議的範圍擴大到包括缺陷分類以提高整體可靠性，
在問題影響 CI 訊號之前預測問題。

<!--Subproject leads Elana Hashman and Sergey Kanzhelev are both recognized as
approvers on all node test code, supported by SIG Node and SIG Testing.-->
子專案負責人 Elana Hashman 和 Sergey Kanzhelev 都被認為是所有節點測試程式碼的審批人，由 SIG node 和 SIG Testing 支援。

<!--***September 2021.*** After significant deflaking progress with serial tests in
the 1.22 release spearheaded by Francesco Romani, the subproject set a goal
for getting the serial job fully passing by the 1.23 release date.-->
***2021 年 9 月*** 在 Francesco Romani 牽頭的 1.22 版本系列測試取得重大進展後，
該子專案設定了一個目標，即在 1.23 釋出日期之前讓序列任務完全透過。

<!--Mike Miranda becomes a Kubernetes org member for his contributions
to the subproject.-->
Mike Miranda 因其對子專案的貢獻成為 Kubernetes 組織成員。

<!--***November 2021.*** Throughout 2021, SIG Node had no merge or
release-blocking test failures. Many flaky tests from past releases are removed
from release-blocking dashboards as they had been fully cleaned up.-->
***2021 年 11 月*** 在整個 2021 年， SIG Node 沒有合併或釋出的測試失敗。
過去版本中的許多古怪測試都已從阻止釋出的儀表板中刪除，因為它們已被完全清理。

<!--Danielle Lancashire was recognized as a reviewer for SIG Node's subgroup, test code.-->
Danielle Lancashire 被公認為 SIG Node 子組測試程式碼的評審員。

<!--The final node serial tests were completely fixed. The serial tests consist of
many disruptive and slow tests which tend to be flakey and are hard
to troubleshoot. By the 1.23 release freeze, the last serial tests were
fixed and the job was passing without flakes.-->
最終節點系列測試已完全修復。系列測試由許多中斷性和緩慢的測試組成，這些測試往往是碎片化的，很難排除故障。
到 1.23 版本凍結時，最後一次系列測試已修復，作業順利透過。

<!--[![Slack announcement that Serial tests are green](serial-tests-green.png)](https://kubernetes.slack.com/archives/C0BP8PW9G/p1638211041322900)-->
[![宣佈系列測試為綠色](serial-tests-green.png)](https://kubernetes.slack.com/archives/C0BP8PW9G/p1638211041322900)

<!--The 1.23 release got a special shout out for the tests quality and CI signal.
The SIG Node CI subproject was proud to have helped contribute to such
a high-quality release, in part due to our efforts in identifying
and fixing flakes in Node and beyond.-->
1.23 版本在測試質量和 CI 訊號方面得到了特別的關注。SIG Node CI 子專案很自豪能夠為這樣一個高質量的釋出做出貢獻，
部分原因是我們在識別和修復節點內外的碎片方面所做的努力。

<!--[![Slack shoutout that release was mostly green](release-mostly-green.png)](https://kubernetes.slack.com/archives/C92G08FGD/p1637175755023200)-->
[![Slack 大聲宣佈釋出的版本大多是綠色的](release-mostly-green.png)](https://kubernetes.slack.com/archives/C92G08FGD/p1637175755023200)

<!--***December 2021.*** An estimated 90% of test jobs were passing at the time of
the 1.23 release (up from 42% in August 2020).-->
***2021 年 12 月*** 在 1.23 版本釋出時，估計有 90% 的測試工作通過了測試（2020 年 8 月為 42%）。

<!--Dockershim code was removed from Kubernetes. This affected nearly half of SIG Node's
test jobs and the SIG Node CI subproject reacted quickly and retargeted all the
tests. SIG Node was the first SIG to complete test migrations off dockershim,
providing examples for other affected SIGs. The vast majority of new jobs passed
at the time of introduction without further fixes required. The [effort of
removing dockershim](https://k8s.io/dockershim)) from Kubernetes is ongoing.
There are still some wrinkles from the dockershim removal as we uncover more
dependencies on dockershim, but we plan to stabilize all test jobs
by the 1.24 release.-->
Dockershim 程式碼已從 Kubernetes 中刪除。這影響了 SIG Node 近一半的測試作業，
SIG Node CI 子專案反應迅速，並重新確定了所有測試的目標。
SIG Node 是第一個完成 dockershim 外測試遷移的 SIG ，為其他受影響的 SIG 提供了示例。
絕大多數新工作在引入時都已透過，無需進一步修復。
從 Kubernetes 中[將 dockershim 除名的工作](https://k8s.io/dockershim) 正在進行中。
隨著我們發現 dockershim 對 dockershim 的依賴性越來越大，dockershim 的刪除仍然存在一些問題，
但我們計劃在 1.24 版本之前確保所有測試任務穩定。

<!--## Statistics-->
## 統計資料

<!--Our regular meeting attendees and subproject participants for the past few months:-->
我們過去幾個月的定期會議與會者和子專案參與者：

- Aditi Sharma
- Artyom Lukianov
- Arnaud Meukam
- Danielle Lancashire
- David Porter
- Davanum Srinivas
- Elana Hashman
- Francesco Romani
- Matthias Bertschy
- Mike Miranda
- Paco Xu
- Peter Hunt
- Ruiwen Zhao
- Ryan Phillips
- Sergey Kanzhelev
- Skyler Clark
- Swati Sehgal
- Wenjun Wu

<!--The [kubernetes/test-infra](https://github.com/kubernetes/test-infra/) source code repository contains test definitions. The number of
Node PRs just in that repository:
- 2020 PRs (since May): [183](https://github.com/kubernetes/test-infra/pulls?q=is%3Apr+is%3Aclosed+label%3Asig%2Fnode+created%3A2020-05-01..2020-12-31+-author%3Ak8s-infra-ci-robot+)
- 2021 PRs: [264](https://github.com/kubernetes/test-infra/pulls?q=is%3Apr+is%3Aclosed+label%3Asig%2Fnode+created%3A2021-01-01..2021-12-31+-author%3Ak8s-infra-ci-robot+)-->
[kubernetes/test-infra](https://github.com/kubernetes/test-infra/) 原始碼儲存庫包含測試定義。該儲存庫中的節點 PR 數：
- 2020 年 PR（自 5 月起）：[183](https://github.com/kubernetes/test-infra/pulls?q=is%3Apr+is%3Aclosed+label%3Asig%2Fnode+created%3A2020-05-01..2020-12-31+-author%3Ak8s-infra-ci-robot+)
- 2021 年 PR：[264](https://github.com/kubernetes/test-infra/pulls?q=is%3Apr+is%3Aclosed+label%3Asig%2Fnode+created%3A2021-01-01..2021-12-31+-author%3Ak8s-infra-ci-robot+)

<!--Triaged issues and PRs on CI board (including triaging away from the subgroup scope):

- 2020 (since May)：[132](https://github.com/issues?q=project%3Akubernetes%2F43+created%3A2020-05-01..2020-12-31)
- 2021: [532](https：//github.com/issues?q=project%3Akubernetes%2F43+created%3A2021-01-01..2021-12-31+)-->

CI 委員會上的問題和 PRs 分類（包括子組範圍之外的分類）：

- 2020 年（自 5 月起）：[132](https://github.com/issues?q=project%3Akubernetes%2F43+created%3A2020-05-01..2020-12-31)
- 2021 年：[532](https://github.com/issues?q=project%3Akubernetes%2F43+created%3A2021-01-01..2021-12-31+)

<!--## Future-->
## 未來

<!--Just "keeping the lights on" is a bold task and we are committed to improving this experience.
We are working to simplify the triage and review processes for SIG Node.

Specifically, we are working on better test organization, naming,
and tracking:-->

只是“保持燈亮”是一項大膽的任務，我們致力於改善這種體驗。
我們正在努力簡化 SIG Node 的分類和審查流程。

具體來說，我們正在致力於更好的測試組織、命名和跟蹤：

<!-- - https://github.com/kubernetes/enhancements/pull/3042
- https://github.com/kubernetes/test-infra/issues/24641
- [Kubernetes SIG-Node CI Testgrid Tracker](https://docs.google.com/spreadsheets/d/1IwONkeXSc2SG_EQMYGRSkfiSWNk8yWLpVhPm-LOTbGM/edit#gid=0)-->

- https://github.com/kubernetes/enhancements/pull/3042
- https://github.com/kubernetes/test-infra/issues/24641
- [Kubernetes SIG Node CI 測試網格跟蹤器](https://docs.google.com/spreadsheets/d/1IwONkeXSc2SG_EQMYGRSkfiSWNk8yWLpVhPm-LOTbGM/edit#gid=0)

<!--We are also constantly making progress on improved tests debuggability and de-flaking.

If any of this interests you, we'd love for you to join us!
There's plenty to learn in debugging test failures, and it will help you gain
familiarity with the code that SIG Node maintains.-->
我們還在改進測試的可除錯性和去剝落方面不斷取得進展。

如果你對此感興趣，我們很樂意您能加入我們！
在除錯測試失敗中有很多東西需要學習，它將幫助你熟悉 SIG Node 維護的程式碼。

<!--You can always find information about the group on the
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) page.
We give group updates at our maintainer track sessions, such as
[KubeCon + CloudNativeCon Europe 2021](https://kccnceu2021.sched.com/event/iE8E/kubernetes-sig-node-intro-and-deep-dive-elana-hashman-red-hat-sergey-kanzhelev-google) 和
[KubeCon + CloudNative North America 2021](https://kccncna2021.sched.com/event/lV9D/kubenetes-sig-node-intro-and-deep-dive-elana-hashman-derek-carr-red-hat-sergey-kanzhelev-dawn-chen-google?iframe=no&w=100%&sidebar=yes&bg=no)。
Join us in our mission to keep the kubelet and other SIG Node components reliable and ensure smooth and uneventful releases!-->

你可以在 [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 頁面上找到有關該組的資訊。
我們在我們的維護者軌道會議上提供組更新，例如：
[KubeCon + CloudNativeCon Europe 2021](https://kccnceu2021.sched.com/event/iE8E/kubernetes-sig-node-intro-and-deep-dive-elana-hashman-red-hat-sergey-kanzhelev-google) 和
[KubeCon + CloudNative North America 2021](https://kccncna2021.sched.com/event/lV9D/kubenetes-sig-node-intro-and-deep-dive-elana-hashman-derek-carr-red-hat-sergey-kanzhelev-dawn-chen-google?iframe=no&w=100%&sidebar=yes&bg=no)。
加入我們的使命，保持 kubelet 和其他 SIG Node 元件的可靠性，確保順順利利釋出！
