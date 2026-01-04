---
title: " Kubernetes 社區會議記錄 - 20160204 "
date: 2016-02-09
slug: kubernetes-community-meeting-notes
---
<!--
title: " Kubernetes community meeting notes - 20160204 "
date: 2016-02-09
slug: kubernetes-community-meeting-notes
url: /blog/2016/02/Kubernetes-Community-Meeting-Notes
-->

<!--
####  February 4th - rkt demo (congratulations on the 1.0, CoreOS!), eBay puts k8s on Openstack and considers Openstack on k8s, SIGs, and flaky test surge makes progress.
-->
####  2 月 4 日 - rkt 演示（祝賀 1.0 版本，CoreOS！），eBay 將 k8s 放在 Openstack 上並認爲 Openstack 在 k8s，SIG 和片狀測試激增方面取得了進展。

<!--
The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via a videoconference. Here are the notes from the latest meeting.
-->
Kubernetes 貢獻社區在每週四 10:00 PT 開會,通過影片會議討論項目狀態。以下是最近一次會議的筆記。

<!--
* Note taker: Rob Hirschfeld
* Demo (20 min): CoreOS rkt + Kubernetes [Shaya Potter]
    * expect to see integrations w/ rkt & k8s in the coming months ("rkt-netes"). not integrated into the v1.2 release.
    * Shaya gave a demo (8 minutes into meeting for video reference)
        * CLI of rkt shown spinning up containers
        * [note: audio is garbled at points]
        * Discussion about integration w/ k8s & rkt
        * rkt community sync next week: https://groups.google.com/forum/#!topic/rkt-dev/FlwZVIEJGbY
        * Dawn Chen:
            * The remaining issues of integrating rkt with kubernetes: 1) cadivsor 2) DNS 3) bugs related to logging
            * But need more work on e2e test suites
-->
* 書記員：Rob Hirschfeld
* 演示影片（20 分鐘）：CoreOS rkt + Kubernetes [Shaya Potter]
    * 期待在未來幾個月內看到與rkt和k8s的整合（“rkt-netes”）。 還沒有集成到 v1.2 版本中。
    * Shaya 做了一個演示（8分鐘的會議影片參考）
        * rkt 的 CLI 顯示了旋轉容器
        * [注意：音頻在點數上是亂碼]
        * 關於 k8s&rkt 整合的討論
        * 下週 rkt 社區同步： https://groups.google.com/forum/#!topic/rkt-dev/FlwZVIEJGbY
        * Dawn Chen:
            * 將 rkt 與 kubernetes 集成的其餘問題：1）cadivsor 2） DNS 3）與日誌記錄相關的錯誤
            * 但是需要在 e2e 測試套件上做更多的工作
<!--
* Use Case (10 min): eBay k8s on OpenStack and OpenStack on k8s [Ashwin Raveendran]
    * eBay is currently running Kubernetes on OpenStack
    * Goal for eBay is to manage the OpenStack control plane w/ k8s.  Goal would be to achieve upgrades
    * OpenStack Kolla creates containers for the control plane.  Uses Ansible+Docker for management of the containers.
    * Working on k8s control plan management - Saltstack is proving to be a management challenge at the scale they want to operate.  Looking for automated management of the k8s control plane.
-->
* 用例（10分鐘）：在 OpenStack 上的 eBay k8s 和 k8s 上的 OpenStack [Ashwin Raveendran]
    * eBay 目前正在 OpenStack 上運行 Kubernetes
    * eBay 的目標是管理帶有 k8s 的 OpenStack 控制平面。目標是實現升級。
    * OpenStack Kolla 爲控制平面創建容器。使用 Ansible+Docker 來管理容器。
    * 致力於 k8s 控制計劃管理 - Saltstack 被證明是他們想運營的規模的管理挑戰。尋找 k8s 控制平面的自動化管理。
<!--
* SIG Report
* Testing update [Jeff, Joe, and Erick]
    * Working to make the workflow about contributing to K8s easier to understanding
        * [pull/19714][1] has flow chart of the bot flow to help users understand
    * Need a consistent way to run tests w/ hacking config scripts (you have to fake a Jenkins process right now)
    * Want to create necessary infrastructure to make test setup less flaky
    * want to decouple test start (single or full) from Jenkins
    * goal is to get to point where you have 1 script to run that can be pointed to any cluster
    * demo included Google internal views - working to try get that external.
    * want to be able to collect test run results
    * Bob Wise calls for testing infrastructure to be a blocker on v1.3
    * Long discussion about testing practices…
        * consensus that we want to have tests work over multiple platforms.
        * would be helpful to have a comprehensive state dump for test reports
        * "phone-home" to collect stack traces - should be available
-->
*  SIG 報告
*  測試更新 [Jeff, Joe, 和 Erick]
    *  努力使有助於 K8s 的工作流程更容易理解
        * [pull/19714][1]有 bot 流程圖來幫助使用者理解
    *  需要一種一致的方法來運行測試 w/hacking 設定腳本（你現在必須僞造一個 Jenkins 進程）
    *  想要創建必要的基礎設施，使測試設置不那麼薄弱
    *  想要將測試開始（單次或完整）與 Jenkins分離
    *  目標是指出你有一個可以指向任何叢集的腳本
    *  演示包括 Google 內部視圖 - 努力嘗試獲取外部視圖。
    *  希望能夠收集測試運行結果
    *  Bob Wise 不贊同在 v1.3 版本進行測試方面的基礎設施建設。
    *  關於測試實踐的長期討論…
       * 我們希望在多個平臺上進行測試的共識。
       * 爲測試報告提供一個全面轉儲會很有幫助
       * 可以使用"phone-home"收集異常


<!--
* 1.2 Release Watch
* CoC [Sarah]
* GSoC [Sarah]
-->
* 1.2發佈觀察
* CoC [Sarah]
* GSoC [Sarah]

<!--
To get involved in the Kubernetes community consider joining our [Slack channel][2], taking a look at the [Kubernetes project][3] on GitHub, or join the [Kubernetes-dev Google group][4]. If you're really excited, you can do all of the above and join us for the next community conversation -- February 11th, 2016. Please add yourself or a topic you want to know about to the [agenda][5] and get a calendar invitation by joining [this group][6].
-->
要參與 Kubernetes 社區，請考慮加入我們的 [Slack 頻道][2]，查看 GitHub 上的
[Kubernetes 項目][3]，或加入 [Kubernetes-dev Google 小組][4]。
如果你真的很興奮，你可以完成上述所有工作並加入我們的下一次社區對話 - 2016 年 2 月 11 日。
請將你自己或你想要了解的主題添加到[議程][5]並通過加入[此組][6]來獲取日曆邀請。

 "https://youtu.be/IScpP8Cj0hw?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ"


[1]: https://github.com/kubernetes/kubernetes/pull/19714
[2]: https://slack.k8s.io/
[3]: https://github.com/kubernetes/
[4]: https://groups.google.com/forum/#!forum/kubernetes-dev
[5]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[6]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
