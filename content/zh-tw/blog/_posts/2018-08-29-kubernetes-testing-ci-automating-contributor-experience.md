---
layout: blog
title: '機器可以完成這項工作，一個關於 kubernetes 測試、CI 和自動化貢獻者體驗的故事'
date: 2019-08-29
slug: the-machines-can-do-the-work-a-story-of-kubernetes-testing-ci-and-automating-the-contributor-experience
---
<!--
layout: blog
title:  'The Machines Can Do the Work, a Story of Kubernetes Testing, CI, and Automating the Contributor Experience'
date:   2018-08-29
-->


<!--
**Author**: Aaron Crickenberger (Google) and Benjamin Elder (Google)
-->

**作者**：Aaron Crickenberger（谷歌）和 Benjamin Elder（谷歌）

<!--
_“Large projects have a lot of less exciting, yet, hard work. We value time spent automating repetitive work more highly than toil. Where that work cannot be automated, it is our culture to recognize and reward all types of contributions. However, heroism is not sustainable.”_ - [Kubernetes Community Values](https://git.k8s.io/community/values.md#automation-over-process)
-->

_”大型項目有很多不那麼令人興奮，但卻很辛苦的工作。比起辛苦工作，我們更重視把時間花在自動化重複性工作上，如果這項工作無法實現自動化，我們的文化就是承認並獎勵所有類型的貢獻。然而，英雄主義是不可持續的。“_ - [Kubernetes Community Values](https://git.k8s.io/community/values.md#automation-over-process)

<!--
Like many open source projects, Kubernetes is hosted on GitHub. We felt the barrier to participation would be lowest if the project lived where developers already worked, using tools and processes developers already knew. Thus the project embraced the service fully: it was the basis of our workflow, our issue tracker, our documentation, our blog platform, our team structure, and more.
-->

像許多開源項目一樣，Kubernetes 託管在 GitHub 上。 如果項目位於在開發人員已經工作的地方，使用的開發人員已經知道的工具和流程，那麼參與的障礙將是最低的。 因此，該項目完全接受了這項服務：它是我們工作流程，問題跟蹤，文檔，博客平臺，團隊結構等的基礎。

<!--
This strategy worked. It worked so well that the project quickly scaled past its contributors’ capacity as humans. What followed was an incredible journey of automation and innovation. We didn’t just need to rebuild our airplane mid-flight without crashing, we needed to convert it into a rocketship and launch into orbit. We needed machines to do the work.
-->

這個策略奏效了。 它運作良好，以至於該項目迅速超越了其貢獻者的人類能力。 接下來是一次令人難以置信的自動化和創新之旅。 我們不僅需要在飛行途中重建我們的飛機而不會崩潰，我們需要將其轉換爲火箭飛船併發射到軌道。 我們需要機器來完成這項工作。

<!--
## The Work
-->

## 工作

<!--
Initially, we focused on the fact that we needed to support the sheer volume of tests mandated by a complex distributed system such as Kubernetes. Real world failure scenarios had to be exercised via end-to-end (e2e) tests to ensure proper functionality. Unfortunately, e2e tests were susceptible to flakes (random failures) and took anywhere from an hour to a day to complete.
-->

最初，我們關注的事實是，我們需要支持複雜的分佈式系統（如 Kubernetes）所要求的大量測試。 真實世界中的故障場景必須通過端到端（e2e）測試來執行，確保正確的功能。 不幸的是，e2e 測試容易受到薄片（隨機故障）的影響，並且需要花費一個小時到一天才能完成。

<!--
Further experience revealed other areas where machines could do the work for us:
-->

進一步的經驗揭示了機器可以爲我們工作的其他領域：

<!--
* PR Workflow
  * Did the contributor sign our CLA?
  * Did the PR pass tests?
  * Is the PR mergeable?
  * Did the merge commit pass tests?
* Triage
  * Who should be reviewing PRs?
  * Is there enough information to route an issue to the right people?
  * Is an issue still relevant?
* Project Health
  * What is happening in the project?
  * What should we be paying attention to?
  -->

* Pull Request 工作流程
  * 貢獻者是否簽署了我們的 CLA？
  * Pull Request 通過測試嗎？
  * Pull Request 可以合併嗎？
  * 合併提交是否通過了測試？
* 鑑別分類
  * 誰應該審查 Pull Request？
  * 是否有足夠的信息將問題發送給合適的人？
  * 問題是否依舊存在？
* 項目健康
  * 項目中發生了什麼？
  * 我們應該注意什麼？

<!--
As we developed automation to improve our situation, we followed a few guiding principles:
-->

當我們開發自動化來改善我們的情況時，我們遵循了以下幾個指導原則：

<!--
* Follow the push/pull control loop patterns that worked well for Kubernetes
* Prefer stateless loosely coupled services that do one thing well
* Prefer empowering the entire community over empowering a few core contributors
* Eat our own dogfood and avoid reinventing wheels
-->

* 遵循適用於 Kubernetes 的推送/拉取控制循環模式
* 首選無狀態鬆散耦合服務
* 更傾向於授權整個社區權利，而不是賦予少數核心貢獻者權力
* 做好自己的事，而不要重新造輪子

<!--
## Enter Prow
-->

## 瞭解 Prow

<!--
This led us to create [Prow](https://git.k8s.io/test-infra/prow) as the central component for our automation. Prow is sort of like an [If This, Then That](https://ifttt.com/) for GitHub events, with a built-in library of [commands](https://prow.k8s.io/command-help), [plugins](https://prow.k8s.io/plugins), and utilities. We built Prow on top of Kubernetes to free ourselves from worrying about resource management and scheduling, and ensure a more pleasant operational experience.
-->

這促使我們創建 [Prow](https://git.k8s.io/test-infra/prow) 作爲我們自動化的核心組件。 Prow有點像 [If This, Then That](https://ifttt.com/) 用於 GitHub 事件， 內置 [commands](https://prow.k8s.io/command-help)， [plugins](https://prow.k8s.io/plugins)， 和實用程序。 我們在  Kubernetes 之上建立了 Prow，讓我們不必擔心資源管理和日程安排，並確保更愉快的運營體驗。

<!--
Prow lets us do things like:
-->

Prow 讓我們做以下事情：

<!--
* Allow our community to triage issues/PRs by commenting commands such as “/priority critical-urgent”, “/assign mary” or “/close”
* Auto-label PRs based on how much code they change, or which files they touch
* Age out issues/PRs that have remained inactive for too long
* Auto-merge PRs that meet our PR workflow requirements
* Run CI jobs defined as [Knative Builds](https://github.com/knative/build), Kubernetes Pods, or Jenkins jobs
* Enforce org-wide and per-repo GitHub policies like [branch protection](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/branchprotector) and [GitHub labels](https://github.com/kubernetes/test-infra/tree/master/label_sync)
-->

* 允許我們的社區通過評論諸如“/priority critical-urgent”，“/assign mary”或“/close”之類的命令對 issues/Pull Requests 進行分類
* 根據用戶更改的代碼數量或創建的文件自動標記 Pull Requests
* 標出長時間保持不活動狀態 issues/Pull Requests
* 自動合併符合我們PR工作流程要求的 Pull Requests
* 運行定義爲[Knative Builds](https://github.com/knative/build)的 Kubernetes Pods或 Jenkins jobs的 CI 作業
* 實施組織範圍和重構 GitHub 倉庫策略，如[Knative Builds](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/branchprotector)和[GitHub labels](https://github.com/kubernetes/test-infra/tree/master/label_sync)

<!--
Prow was initially developed by the engineering productivity team building Google Kubernetes Engine, and is actively contributed to by multiple members of Kubernetes SIG Testing. Prow has been adopted by several other open source projects, including Istio, JetStack, Knative and OpenShift. [Getting started with Prow](https://github.com/kubernetes/test-infra/tree/master/prow#getting-started) takes a Kubernetes cluster and `kubectl apply starter.yaml` (running pods on a Kubernetes cluster).
-->

Prow最初由構建 Google Kubernetes Engine 的工程效率團隊開發，並由 Kubernetes SIG Testing 的多個成員積極貢獻。 Prow 已被其他幾個開源項目採用，包括 Istio，JetStack，Knative 和 OpenShift。 [Getting started with Prow](https://github.com/kubernetes/test-infra/tree/master/prow#getting-started)需要一個 Kubernetes 集羣和 `kubectl apply starter.yaml`（在 Kubernetes 集羣上運行 pod）。

<!--
Once we had Prow in place, we began to hit other scaling bottlenecks, and so produced additional tooling to support testing at the scale required by Kubernetes, including:
-->

一旦我們安裝了 Prow，我們就開始遇到其他的問題，因此需要額外的工具以支持 Kubernetes 所需的規模測試，包括：

<!--
- [Boskos](https://github.com/kubernetes/test-infra/tree/master/boskos): manages job resources (such as GCP projects) in pools, checking them out for jobs and cleaning them up automatically ([with monitoring](http://velodrome.k8s.io/dashboard/db/boskos-dashboard?orgId=1))
- [ghProxy](https://github.com/kubernetes/test-infra/tree/master/ghproxy): a reverse proxy HTTP cache optimized for use with the GitHub API, to ensure our token usage doesn’t hit API limits ([with monitoring](http://velodrome.k8s.io/dashboard/db/github-cache?refresh=1m&orgId=1))
- [Greenhouse](https://github.com/kubernetes/test-infra/tree/master/greenhouse): allows us to use a remote bazel cache to provide faster build and test results for PRs ([with monitoring](http://velodrome.k8s.io/dashboard/db/bazel-cache?orgId=1))
- [Splice](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/splice): allows us to test and merge PRs in a batch, ensuring our merge velocity is not limited to our test velocity
- [Tide](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/tide): allows us to merge PRs selected via GitHub queries rather than ordered in a queue, allowing for significantly higher merge velocity in tandem with splice
-->

- [Boskos](https://github.com/kubernetes/test-infra/tree/master/boskos): 管理池中的作業資源（例如 GCP 項目），檢查它們是否有工作並自動清理它們 ([with monitoring](http://velodrome.k8s.io/dashboard/db/boskos-dashboard?orgId=1))
- [ghProxy](https://github.com/kubernetes/test-infra/tree/master/ghproxy): 優化用於 GitHub API 的反向代理 HTTP 緩存，以確保我們的令牌使用不會達到 API 限制 ([with monitoring](http://velodrome.k8s.io/dashboard/db/github-cache?refresh=1m&orgId=1))
- [Greenhouse](https://github.com/kubernetes/test-infra/tree/master/greenhouse): 允許我們使用遠程 bazel 緩存爲 Pull requests 提供更快的構建和測試結果 ([with monitoring](http://velodrome.k8s.io/dashboard/db/bazel-cache?orgId=1))
- [Splice](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/splice): 允許我們批量測試和合並 Pull requests，確保我們的合併速度不僅限於我們的測試速度
- [Tide](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/tide): 允許我們合併通過 GitHub 查詢選擇的 Pull requests，而不是在隊列中排序，允許顯着更高合併速度與拼接一起

<!--
## Scaling Project Health
-->

##　關注項目健康狀況

<!--
With workflow automation addressed, we turned our attention to project health. We chose to use Google Cloud Storage (GCS) as our source of truth for all test data, allowing us to lean on established infrastructure, and allowed the community to contribute results. We then built a variety of tools to help individuals and the project as a whole make sense of this data, including:
-->

隨着工作流自動化的實施，我們將注意力轉向了項目健康。我們選擇使用 Google Cloud Storage (GCS)作爲所有測試數據的真實來源，允許我們依賴已建立的基礎設施，並允許社區貢獻結果。然後，我們構建了各種工具來幫助個人和整個項目理解這些數據，包括：

<!--
* [Gubernator](https://github.com/kubernetes/test-infra/tree/master/gubernator): display the results and test history for a given PR
* [Kettle](https://github.com/kubernetes/test-infra/tree/master/kettle): transfer data from GCS to a publicly accessible bigquery dataset
* [PR dashboard](https://k8s-gubernator.appspot.com/pr): a workflow-aware dashboard that allows contributors to understand which PRs require attention and why
* [Triage](https://storage.googleapis.com/k8s-gubernator/triage/index.html): identify common failures that happen across all jobs and tests
* [Testgrid](https://k8s-testgrid.appspot.com/): display test results for a given job across all runs, summarize test results across groups of jobs
-->

* [Gubernator](https://github.com/kubernetes/test-infra/tree/master/gubernator): 顯示給定 Pull Request 的結果和測試歷史
* [Kettle](https://github.com/kubernetes/test-infra/tree/master/kettle): 將數據從 GCS 傳輸到可公開訪問的 bigquery 數據集
* [PR dashboard](https://k8s-gubernator.appspot.com/pr): 一個工作流程識別儀表板，允許參與者瞭解哪些 Pull Request 需要注意以及爲什麼
* [Triage](https://storage.googleapis.com/k8s-gubernator/triage/index.html): 識別所有作業和測試中發生的常見故障
* [Testgrid](https://k8s-testgrid.appspot.com/): 顯示所有運行中給定作業的測試結果，彙總各組作業的測試結果

<!--
We approached the Cloud Native Computing Foundation (CNCF) to develop DevStats to glean insights from our GitHub events such as:
-->

我們與雲計算本地計算基金會（CNCF）聯繫，開發 DevStats，以便從我們的 GitHub 活動中收集見解，例如：

<!--
* [Which prow commands are people most actively using](https://k8s.devstats.cncf.io/d/5/bot-commands-repository-groups?orgId=1)
* [PR reviews by contributor over time](https://k8s.devstats.cncf.io/d/46/pr-reviews-by-contributor?orgId=1&var-period=d7&var-repo_name=All&var-reviewers=All)
* [Time spent in each phase of our PR workflow](https://k8s.devstats.cncf.io/d/44/pr-time-to-approve-and-merge?orgId=1)
-->

* [Which prow commands are people most actively using](https://k8s.devstats.cncf.io/d/5/bot-commands-repository-groups?orgId=1)
* [PR reviews by contributor over time](https://k8s.devstats.cncf.io/d/46/pr-reviews-by-contributor?orgId=1&var-period=d7&var-repo_name=All&var-reviewers=All)
* [Time spent in each phase of our PR workflow](https://k8s.devstats.cncf.io/d/44/pr-time-to-approve-and-merge?orgId=1)

<!--
## Into the Beyond
-->

## Into the Beyond

<!--
Today, the Kubernetes project spans over 125 repos across five orgs. There are 31 Special Interests Groups and 10 Working Groups coordinating development within the project. In the last year the project has had [participation from over 13,800 unique developers](https://k8s.devstats.cncf.io/d/13/developer-activity-counts-by-repository-group?orgId=1&var-period_name=Last%20year&var-metric=contributions&var-repogroup_name=All) on GitHub.
-->

今天，Kubernetes 項目跨越了5個組織125個倉庫。有31個特殊利益集團和10個工作組在項目內協調發展。在過去的一年裏，該項目有 [來自13800多名獨立開發人員的參與](https://k8s.devstats.cncf.io/d/13/developer-activity-counts-by-repository-group?orgId=1&var-period_name=Last%20year&var-metric=contributions&var-repogroup_name=All)。

<!--
On any given weekday our Prow instance [runs over 10,000 CI jobs](http://velodrome.k8s.io/dashboard/db/bigquery-metrics?panelId=10&fullscreen&orgId=1&from=now-6M&to=now); from March 2017 to March 2018 it ran 4.3 million jobs. Most of these jobs involve standing up an entire Kubernetes cluster, and exercising it using real world scenarios. They allow us to ensure all supported releases of Kubernetes work across cloud providers, container engines, and networking plugins. They make sure the latest releases of Kubernetes work with various optional features enabled, upgrade safely, meet performance requirements, and work across architectures.
-->

在任何給定的工作日，我們的 Prow 實例[運行超過10,000個 CI 工作](http://velodrome.k8s.io/dashboard/db/bigquery-metrics?panelId=10&fullscreen&orgId=1&from=now-6M&to=now); 從2017年3月到2018年3月，它有430萬個工作崗位。 這些工作中的大多數涉及建立整個 Kubernetes 集羣，並使用真實場景來實施它。 它們使我們能夠確保所有受支持的 Kubernetes 版本跨雲提供商，容器引擎和網絡插件工作。 他們確保最新版本的 Kubernetes 能夠啓用各種可選功能，安全升級，滿足性能要求，並跨架構工作。

<!--
With today’s [announcement from CNCF](https://www.cncf.io/announcement/2018/08/29/cncf-receives-9-million-cloud-credit-grant-from-google) – noting that Google Cloud has begun transferring ownership and management of the Kubernetes project’s cloud resources to CNCF community contributors, we are excited to embark on another journey. One that allows the project infrastructure to be owned and operated by the community of contributors, following the same open governance model that has worked for the rest of the project. Sound exciting to you? Come talk to us at #sig-testing on kubernetes.slack.com.
-->

今天[來自CNCF的公告](https://www.cncf.io/announcement/2018/08/29/cncf-receives-9-million-cloud-credit-grant-from-google) - 注意到    Google Cloud 有開始將 Kubernetes 項目的雲資源的所有權和管理權轉讓給 CNCF 社區貢獻者，我們很高興能夠開始另一個旅程。 允許項目基礎設施由貢獻者社區擁有和運營，遵循對項目其餘部分有效的相同開放治理模型。 聽起來令人興奮。 請來 kubernetes.slack.com 上的 #sig-testing on kubernetes.slack.com 與我們聯繫。

<!--
Want to find out more? Come check out these resources:
-->

想了解更多？ 快來看看這些資源：

<!--
* [Prow: Testing the way to Kubernetes Next](https://elder.dev/posts/prow)
* [Automation and the Kubernetes Contributor Experience](https://www.youtube.com/watch?v=BsIC7gPkH5M)
-->

* [Prow: Testing the way to Kubernetes Next](https://elder.dev/posts/prow)
* [Automation and the Kubernetes Contributor Experience](https://www.youtube.com/watch?v=BsIC7gPkH5M)
