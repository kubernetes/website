---
title: " 將端到端的 Kubernetes 測試引入 Azure （第二部分） "
date: 2016-07-18
slug: bringing-end-to-end-kubernetes-testing-to-azure-2
---
<!--
title: " Bringing End-to-End Kubernetes Testing to Azure (Part 2) "
date: 2016-07-18
slug: bringing-end-to-end-kubernetes-testing-to-azure-2
url: /blog/2016/07/Bringing-End-To-End-Kubernetes-Testing-To-Azure-2
-->

<!--
_Editor’s Note: Today’s guest post is Part II from a [series](https://kubernetes.io/blog/2016/06/bringing-end-to-end-testing-to-azure) by Travis Newhouse, Chief Architect at AppFormix, writing about their contributions to Kubernetes._  
-->
_作者標註：今天的邀請帖子是 Travis Newhouse 的 [系列](https://kubernetes.io/blog/2016/06/bringing-end-to-end-testing-to-azure) 中的第二部分，他是 AppFormix 的首席架構師，這篇文章介紹了他們對 Kubernetes 的貢獻。_


<!--
Historically, Kubernetes testing has been hosted by Google, running e2e tests on [Google Compute Engine](https://cloud.google.com/compute/) (GCE) and [Google Container Engine](https://cloud.google.com/container-engine/) (GKE). In fact, the gating checks for the submit-queue are a subset of tests executed on these test platforms. Federated testing aims to expand test coverage by enabling organizations to host test jobs for a variety of platforms and contribute test results to benefit the Kubernetes project. Members of the Kubernetes test team at Google and SIG-Testing have created a [Kubernetes test history dashboard](http://storage.googleapis.com/kubernetes-test-history/static/index.html) that publishes the results from all federated test jobs (including those hosted by Google).  

In this blog post, we describe extending the e2e test jobs for Azure, and show how to contribute a federated test to the Kubernetes project.  
-->
歷史上，Kubernetes 測試一直由谷歌託管，在 [谷歌計算引擎](https://cloud.google.com/compute/) (GCE) 和 [谷歌容器引擎](https://cloud.google.com/container-engine/) (GKE) 上運行端到端測試。實際上，提交隊列的選通檢查是在這些測試平臺上執行測試的子集。聯合測試旨在通過使組織託管各種平臺的測試作業並貢獻測試結果，從而讓 Kubernetes 項目受益來擴大測試範圍。谷歌和 SIG-Testing 的 Kubernetes 測試小組成員已經創建了一個 [Kubernetes 測試歷史記錄儀錶板](http://storage.googleapis.com/kubernetes-test-history/static/index.html)，可以發佈所有聯合測試作業（包括谷歌託管的作業）的全部結果。

在此博客文章中，我們介紹了擴展 Azure 的端到端測試工作，並展示瞭如何爲 Kubernetes 項目貢獻聯合測試。

<!--
**END-TO-END INTEGRATION TESTS FOR AZURE**  

After successfully implementing [“development distro” scripts to automate deployment of Kubernetes on Azure](https://kubernetes.io/blog/2016/06/bringing-end-to-end-testing-to-azure), our next goal was to run e2e integration tests and share the results with the Kubernetes community.  
-->
**Azure 的端到端集成測試**

成功實現 [在 Azure 上自動部署 Kubernetes 的 “development distro” 腳本](https://kubernetes.io/blog/2016/06/bringing-end-to-end-testing-to-azure) 之後，我們的下一個目標是運行端到端集成測試，並與 Kubernetes 社區共享結果。

<!--
We automated our workflow for executing e2e tests of Kubernetes on Azure by defining a nightly job in our private Jenkins server. Figure 2 shows the workflow that uses kube-up.sh to deploy Kubernetes on Ubuntu virtual machines running in Azure, then executes the e2e tests. On completion of the tests, the job uploads the test results and logs to a Google Cloud Storage directory, in a format that can be processed by the [scripts that produce the test history dashboard](https://github.com/kubernetes/test-infra/tree/master/jenkins/test-history). Our Jenkins job uses the hack/jenkins/e2e-runner.sh and hack/jenkins/upload-to-gcs.sh scripts to produce the results in the correct format.  
-->
通過在私有 Jenkins 伺服器中定義夜間工作，我們自動化了在 Azure 上執行 Kubernetes 端到端測試的工作流程。圖2顯示了使用 kube-up.sh 在運行於 Azure 的 Ubuntu 虛擬機上部署 Kubernetes，然後執行端到端測試的工作流程。測試完成後，該作業將測試結果和日誌上傳到 Google Cloud Storage 目錄中，其格式可以由 [生成測試歷史記錄儀錶板的腳本](https://github.com/kubernetes/test-infra/tree/master/jenkins/test-history) 進行處理。我們的 Jenkins 作業使用 hack/jenkins/e2e-runner.sh 和 hack/jenkins/upload-to-gcs.sh 腳本生成正確格式的結果。

<!--
| ![Kubernetes on Azure - Flow Chart - New Page.png](https://lh6.googleusercontent.com/TZiUu4sQ7G0XDvJgv9a1a4UEdxntOZDT9I3S42c8BOAyigxaysKmhJMen8vLaJ3UYaYKPIG9h-cyBOvTSI6kBgqnUQabe4xxZXhrUyVxinKGEaCDUnmNlBo__HNjzoYc_U7zM77_Dxe) |
| Figure 2 - Nightly test job workflow |
-->
| ![Kubernetes on Azure - Flow Chart - New Page.png](https://lh6.googleusercontent.com/TZiUu4sQ7G0XDvJgv9a1a4UEdxntOZDT9I3S42c8BOAyigxaysKmhJMen8vLaJ3UYaYKPIG9h-cyBOvTSI6kBgqnUQabe4xxZXhrUyVxinKGEaCDUnmNlBo__HNjzoYc_U7zM77_Dxe) |
| 圖 2 - 夜間測試工作流程 |

<!--
**HOW TO CONTRIBUTE AN E2E TEST**    

Throughout our work to create the Azure e2e test job, we have collaborated with members of [SIG-Testing](https://github.com/kubernetes/community/tree/master/sig-testing) to find a way to publish the results to the Kubernetes community. The results of this collaboration are documentation and a streamlined process to contribute results from a federated test job. The steps to contribute e2e test results can be summarized in 4 steps.  
-->
**如何進行端到端測試** 

在創建 Azure 端到端測試工作的整個過程中，我們與 [SIG-Testing](https://github.com/kubernetes/community/tree/master/sig-testing) 的成員進行了合作，找到了一種將結果發佈到 Kubernetes 社區的方法。合作的結果是以文檔和簡化的流程從聯合測試工作中貢獻結果。貢獻端到端測試結果的過程可以歸納爲4個步驟。

<!--
1. Create a [Google Cloud Storage](https://cloud.google.com/storage/) bucket in which to publish the results.
2. Define an automated job to run the e2e tests. By setting a few environment variables, hack/jenkins/e2e-runner.sh deploys Kubernetes binaries and executes the tests.
3. Upload the results using hack/jenkins/upload-to-gcs.sh.
4. Incorporate the results into the test history dashboard by submitting a pull-request with modifications to a few files in [kubernetes/test-infra](https://github.com/kubernetes/test-infra).
-->
1. 創建一個 [Google Cloud Storage](https://cloud.google.com/storage/) 空間用來發布結果。
2. 定義一個自動化作業來運行端到端測試，通過設置一些環境變量，使用 hack/jenkins/e2e-runner.sh 部署 Kubernetes 二進制檔案並執行測試。
3. 使用 hack/jenkins/upload-to-gcs.sh 上傳結果。
4. 通過提交對 [kubernetes/test-infra](https://github.com/kubernetes/test-infra) 中的幾個檔案進行修改的請求，將結果合併到測試歷史記錄儀錶板中。

<!--
The federated tests documentation describes these steps in more detail. The scripts to run e2e tests and upload results simplifies the work to contribute a new federated test job. The specific steps to set up an automated test job and an appropriate environment in which to deploy Kubernetes are left to the reader’s preferences. For organizations using Jenkins, the jenkins-job-builder configurations for GCE and GKE tests may provide helpful examples.  
-->
聯合測試文檔更詳細地描述了這些步驟。運行端到端測試並上傳結果的腳本簡化了貢獻新聯合測試作業的工作量。設置自動化測試作業的具體步驟以及在其中部署 Kubernetes 的合適環境將留給讀者進行選擇。對於使用 Jenkins 的組織，用於 GCE 和 GKE 測試的 jenkins-job-builder 設定可能會提供有用的示例。


<!--
**RETROSPECTIVE**  

The e2e tests on Azure have been running for several weeks now. During this period, we have found two issues in Kubernetes. Weixu Zhuang immediately published fixes that have been merged into the Kubernetes master branch.  
-->
**回顧**

Azure 上的端到端測試已經運行了幾周。在此期間，我們在 Kubernetes 中發現了兩個問題。Weixu Zhuang 立即發佈了修補程式並已合併到 Kubernetes master 分支中。

<!--
The first issue happened when we wanted to bring up the Kubernetes cluster using SaltStack on Azure using Ubuntu VMs. A commit (07d7cfd3) modified the OpenVPN certificate generation script to use a variable that was only initialized by scripts in the cluster/ubuntu. Strict checking on existence of parameters by the certificate generation script caused other platforms that use the script to fail (e.g. our changes to support Azure). We submitted a [pull-request that fixed the issue](https://github.com/kubernetes/kubernetes/pull/21357) by initializing the variable with a default value to make the certificate generation scripts more robust across all platform types.  
-->
當我們想用 Ubuntu VM 在 Azure 上用 SaltStack 打開 Kubernetes 叢集時，發生了第一個問題。一個提交 (07d7cfd3) 修改了 OpenVPN 證書生成腳本，使用了一個僅由叢集或者ubuntu中的腳本初始化的變量。證書生成腳本對參數是否存在進行嚴格檢查會導致其他使用該腳本的平臺失敗（例如，爲支持 Azure 而進行的更改）。我們提交了一個[解決問題的請求](https://github.com/kubernetes/kubernetes/pull/21357) ，通過使用預設值初始化變量讓證書生成腳本在所有平臺類型上都更加健壯，。

<!--
The second [pull-request cleaned up an unused import](https://github.com/kubernetes/kubernetes/pull/22321) in the Daemonset unit test file. The import statement broke the unit tests with golang 1.4. Our nightly Jenkins job helped us find this error and we promptly pushed a fix for it.  
-->
第二個 [清理未使用導入的請求](https://github.com/kubernetes/kubernetes/pull/22321) 在 Daemonset 單元測試檔案中。import 語句打破了 golang 1.4 的單元測試。我們的夜間 Jenkins 工作幫助我們找到錯誤並且迅速完成修復。

<!--
**CONCLUSION AND FUTURE WORK**  
-->
**結論與未來工作**  

<!--
The addition of a nightly e2e test job for Kubernetes on Azure has helped to define the process to contribute a federated test to the Kubernetes project. During the course of the work, we also saw the immediate benefit of expanding test coverage to more platforms when our Azure test job identified compatibility issues.  
-->
在 Azure 上爲 Kubernetes 添加了夜間端到端測試工作，這有助於定義爲 Kubernetes 項目貢獻聯合測試的過程。在工作過程中，當 Azure 測試工作發現兼容性問題時，我們還發現了將測試覆蓋範圍擴展到更多平臺的直接好處。

<!--
We want to thank Aaron Crickenberger, Erick Fejta, Joe Finney, and Ryan Hutchinson for their help to incorporate the results of our Azure e2e tests into the Kubernetes test history. If you’d like to get involved with testing to create a stable, high quality releases of Kubernetes, join us in the [Kubernetes Testing SIG (sig-testing)](https://github.com/kubernetes/community/tree/master/sig-testing).  
-->
我們要感謝 Aaron Crickenberger, Erick Fejta, Joe Finney 和 Ryan Hutchinson 的幫助，將我們的 Azure 端到端測試結果納入了 Kubernetes 測試歷史。如果您想參與測試來創建穩定的、高質量的 Kubernetes 版本，請加入我們的 [Kubernetes Testing SIG (sig-testing)](https://github.com/kubernetes/community/tree/master/sig-testing)。


<!--
_--Travis Newhouse, Chief Architect at AppFormix_
-->
_--Travis Newhouse, AppFormix 首席架構師_
