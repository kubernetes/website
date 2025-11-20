---
title: " Kubernetes 社區會議記錄 - 20160114 "
date: 2016-01-28
slug: kubernetes-community-meeting-notes
---
<!--
---
title: " Kubernetes Community Meeting Notes - 20160114 "
date: 2016-01-28
slug: kubernetes-community-meeting-notes
url: /zh/blog/2016/01/Kubernetes-Community-Meeting-Notes
---
-->
<!--
#####  January 14 - RackN demo, testing woes, and KubeCon EU CFP.
---
 Note taker: Joe Beda
---
-->
#####  1 月 14 日 - RackN 演示、測試問題和 KubeCon EU CFP。
---
 記錄者：Joe Beda
---
<!--
* Demonstration: Automated Deploy on Metal, AWS and others w/ Digital Rebar, Rob Hirschfeld  and Greg Althaus from RackN

    * Greg Althaus. CTO.  Digital Rebar is the product.  Bare metal provisioning tool.

    * Detect hardware, bring it up, configure raid, OS and get workload deployed.

    * Been working on Kubernetes workload.

    * Seeing trend to start in cloud and then move back to bare metal.

    * New provider model to use provisioning system on both cloud and bare metal.

    * UI, REST API, CLI

    * Demo: Packet -- bare metal as a service

        * 4 nodes running grouped into a "deployment"

        * Functional roles/operations selected per node.

        * Decomposed the kubernetes bring up into units that can be ordered and synchronized.  Dependency tree -- things like wait for etcd to be up before starting k8s master.

        * Using the Ansible playbook under the covers.

        * Demo brings up 5 more nodes -- packet will build those nodes

        * Pulled out basic parameters from the ansible playbook.  Things like the network config, dns set up, etc.

        * Hierarchy of roles pulls in other components -- making a node a master brings in a bunch of other roles that are necessary for that.

        * Has all of this combined into a command line tool with a simple config file.

    * Forward: extending across multiple clouds for test deployments.  Also looking to create split/replicated across bare metal and cloud.

    * Q: secrets?   
A: using ansible playbooks.  Builds own certs and then distributes them.  Wants to abstract them out and push that stuff upstream.

    * Q: Do you support bringing up from real bare metal with PXE boot?   
A: yes -- will discover bare metal systems and install OS, install ssh keys, build networking, etc.
-->
* 演示：在 Metal，AWS 和其他平臺上使用 Digital Rebar 自動化部署，來自 RackN 的 Rob Hirschfeld 和 Greg Althaus。

    * Greg Althaus。首席技術官。Digital Rebar 是產品。裸機置備工具。

    * 檢測硬件，啓動硬件，設定 RAID、操作系統並部署工作負載。

    * 處理 Kubernetes 的工作負載。

    * 看到始於雲，然後又回到裸機的趨勢。

    * 新的提供商模型可以在雲和裸機上使用預設定系統。

    * UI, REST API, CLI

    * 演示：資料包--裸機即服務

        * 4個正在運行的節點歸爲一個“部署”

        * 每個節點選擇的功能性角色/操作。

        * 分解的 kubernetes 帶入可以訂購和同步的單元。依賴關係樹--諸如在啓動 k8s master 之前等待 etcd 啓動的事情。

        * 在封面下使用 Ansible。

        * 演示帶來了另外5個節點--資料包將構建這些節點

        * 從 ansible 中提取基本參數。諸如網路設定，DNS 設置等內容。

        * 角色層次結構引入了其他組件--使節點成爲主節點會帶來一系列其他必要的角色。

        * 通過簡單的設定檔案將所有這些組合到命令列工具中。

    * 轉發：擴展到多個雲以進行測試部署。還希望在裸機和雲之間創建拆分/複製。

    * 問：祕密？  
答：使用 Ansible。構建自己的證書，然後分發它們。想要將它們抽象出來並將其推入上游。

    * 問：您是否支持使用 PXE 引導從真正的裸機啓動？   
答：是的--將發現裸機系統並安裝操作系統，安裝 ssh 密鑰，建立網路等。
<!--
* [from SIG-scalability] Q: What is the status of moving to golang 1.5?  
A: At HEAD we are 1.5 but will support 1.4 also. Some issues with flakiness but looks like things are stable now.  

    * Also looking to use the 1.5 vendor experiment.  Move away from godep.  But can't do that until 1.5 is the baseline.

    * Sarah: one of the things we are working on is rewards for doing stuff like this.  Cloud credits, tshirts, poker chips, ponies.
* [from SIG-scalability] Q: What is the status of cleaning up the jenkins based submit queue? What can the community do to help out?  
A: It has been rocky the last few days.  There should be issues associated with each of these. There is a [flake label][1] on those issues.  

    * Still working on test federation.  More test resources now.  Happening slowly but hopefully faster as new people come up to speed.  Will be great to having lots of folks doing e2e tests on their environments.

    * Erick Fjeta is the new test lead

    * Brendan is happy to help share details on Jenkins set up but that shouldn't be necessary.

    * Federation may use Jenkins API but doesn't require Jenkins itself.

    * Joe bitches about the fact that running the e2e tests in the way Jenkins is tricky.  Brendan says it should be runnable easily.  Joe will take another look.

    * Conformance tests? etune did this but he isn't here.  - revisit 20150121
-->
* [來自 SIG-scalability]問：轉到 golang 1.5 的狀態如何？  
答：在 HEAD，我們是1.5，但也會支持1.4。有一些跟穩定性相關的問題，但看起來現在情況穩定了。  

    * 還希望使用1.5供應商實驗。不再使用 godep。但只有在基線爲1.5之前，才能這樣做。

    * Sarah：現在我們正在工作的事情之一就是提供做這些事的小獎品。雲積分，T恤，撲克籌碼，小馬。
* [來自可伸縮性興趣小組]問：清理基於 jenkins 的提交隊列的狀態如何？社區可以做些什麼來幫助您？  
答：最近幾天一直很艱難。每個方面都應該有相關的問題。在這些問題上有一個[片狀標籤][1]。  

    * 仍在進行聯盟測試。現在有更多測試資源。隨着新人們的進步，事情有希望進展的更快。這對讓很多人在他們的環境中進行端到端測試非常有用。

    * Erick Fjeta 是新的測試負責人

    * Brendan很樂意幫助分享有關 Jenkins 設置的詳細資訊，但這不是必須的。

    * 聯盟可以使用 Jenkins API，但不需要 Jenkins 本身。

    * Joe 嘲笑以 Jenkins 的方式運行 e2e 測試是一件棘手的事實。布倫丹說，它應該易於運行。喬再看一眼。

    * 符合性測試？ etune 做到了，但他不在。 -重新訪問20150121
<!--
*     * March 10-11 in London.  Venue to be announced this week.

    * Please send talks!  CFP deadline looks to be Feb 5.

    * Lots of excitement.  Looks to be 700-800 people.  Bigger than SF version (560 ppl).

    * Buy tickets early -- early bird prices will end soon and price will go up 100 GBP.

    * Accommodations provided for speakers?

    * Q from Bob @ Samsung: Can we get more warning/planning for stuff like this:

        * A: Sarah -- I don't hear about this stuff much in advance but will try to pull together a list.  Working to make the events page on kubernetes.io easier to use.

        * A: JJ -- we'll make sure we give more info earlier for the next US conf.
-->
*     * 3月10日至11日在倫敦舉行。地點將於本週宣佈。

    * 請發送講話！CFP 截止日期爲2月5日。

    * 令人興奮。看起來是700-800人。比SF版本大（560 人）。

    * 提前購買門票--早起的鳥兒價格將很快結束，價格將上漲到100英鎊。

    * 爲演講者提供住宿嗎？

    * 三星 Bob 的提問：我們可以針對以下問題獲得更多警告/計劃嗎：

        * 答：Sarah -- 我不太早就聽說過這些東西，但會嘗試整理一下清單。努力使 kubernetes.io 上的事件頁面更易於使用。

        * 答：JJ -- 我們將確保我們早日爲下屆美國會議提供更多資訊。
<!--
* Scale tests [Rob Hirschfeld from RackN] -- if you want to help coordinate on scale tests we'd love to help.

    * Bob invited Rob to join the SIG-scale group.

    * There is also a big bare metal cluster through the CNCF (from Intel) that will be useful too.  No hard dates yet on that.
* Notes/video going to be posted on k8s blog. (Video for 20150114 wasn't recorded.  Fail.)

To get involved in the Kubernetes community consider joining our [Slack channel][2], taking a look at the [Kubernetes project][3] on GitHub, or join the [Kubernetes-dev Google group][4]. If you're really excited, you can do all of the above and join us for the next community conversation - January 27th, 2016. Please add yourself or a topic you want to know about to the [agenda][5] and get a calendar invitation by joining [this group][6].
-->
* 規模測試[RackN 的 Rob Hirschfeld] -- 如果您想幫助進行規模測試，我們將非常樂意爲您提供幫助。

    * Bob 邀請 Rob 加入規模特別興趣小組。

    * 還有一個大型的裸機叢集，通過 CNCF（來自 Intel）也很有用。尚無確切日期。
* 筆記/影片將發佈在 k8s 博客上。（未錄製20150114的影片。失敗。）

要加入 Kubernetes 社區，請考慮加入我們的[Slack 頻道][2]，看看GitHub上的[Kubernetes 項目][3]，或加入[Kubernetes-dev Google 論壇][4]。如果您真的對此感到興奮，則可以完成上述所有操作，並加入我們的下一次社區對話-2016年1月27日。請將您自己或您想了解的話題添加到[議程][5]中，並獲得一個加入[此羣組][6]進行日曆邀請。    



[1]: https://github.com/kubernetes/kubernetes/labels/kind%2Fflake
[2]: http://slack.k8s.io/
[3]: https://github.com/kubernetes/
[4]: https://groups.google.com/forum/#!forum/kubernetes-dev
[5]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[6]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
