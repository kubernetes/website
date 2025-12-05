---
title: " Kubernetes Release: 0.15.0 "
date: 2015-04-16
slug: kubernetes-release-0150
---

<!--
Release Notes:
-->

Release 說明：

<!--

* Enables v1beta3 API and sets it to the default API version ([#6098][1])
* Added multi-port Services ([#6182][2])
    * New Getting Started Guides
    * Multi-node local startup guide ([#6505][3])
    * Mesos on Google Cloud Platform ([#5442][4])
    * Ansible Setup instructions ([#6237][5])
* Added a controller framework ([#5270][6], [#5473][7])
* The Kubelet now listens on a secure HTTPS port ([#6380][8])
* Made kubectl errors more user-friendly ([#6338][9])
* The apiserver now supports client cert authentication ([#6190][10])
* The apiserver now limits the number of concurrent requests it processes ([#6207][11])
* Added rate limiting to pod deleting ([#6355][12])
* Implement Balanced Resource Allocation algorithm as a PriorityFunction in scheduler package ([#6150][13])
* Enabled log collection from master ([#6396][14])
* Added an api endpoint to pull logs from Pods ([#6497][15])
* Added latency metrics to scheduler ([#6368][16])
* Added latency metrics to REST client ([#6409][17])

-->

* 啓用 1beta3 API 並將其設置爲預設 API 版本 ([#6098][1])
* 增加了多端口服務([#6182][2])
    * 新入門指南
    * 多節點本地啓動指南 ([#6505][3])
    * Google 雲平臺上的 Mesos ([#5442][4])
    * Ansible 安裝說明 ([#6237][5])
* 添加了一個控制器框架 ([#5270][6], [#5473][7])
* Kubelet 現在監聽一個安全的 HTTPS 端口 ([#6380][8])
* 使 kubectl 錯誤更加友好 ([#6338][9])
* apiserver 現在支持客戶端 cert 身份驗證 ([#6190][10])
* apiserver 現在限制了它處理的併發請求的數量 ([#6207][11])
* 添加速度限制刪除 pod ([#6355][12])
* 將平衡資源分配算法作爲優先級函數實現在調度程式包中 ([#6150][13])
* 從主伺服器啓用日誌收集功能 ([#6396][14])
* 添加了一個 api 端口來從 Pod 中提取日誌 ([#6497][15])
* 爲調度程式添加了延遲指標 ([#6368][16])
* 爲 REST 客戶端添加了延遲指標 ([#6409][17])

<!--

* etcd now runs in a pod on the master ([#6221][18])
* nginx now runs in a container on the master ([#6334][19])
* Began creating Docker images for master components ([#6326][20])
* Updated GCE provider to work with gcloud 0.9.54 ([#6270][21])
* Updated AWS provider to fix Region vs Zone semantics ([#6011][22])
* Record event when image GC fails ([#6091][23])
* Add a QPS limiter to the kubernetes client ([#6203][24])
* Decrease the time it takes to run make release ([#6196][25])
* New volume support
    * Added iscsi volume plugin ([#5506][26])
    * Added glusterfs volume plugin ([#6174][27])
    * AWS EBS volume support ([#5138][28])
* Updated to heapster version to v0.10.0 ([#6331][29])
* Updated to etcd 2.0.9 ([#6544][30])
* Updated to Kibana to v1.2 ([#6426][31])
* Bug Fixes
    * Kube-proxy now updates iptables rules if a service's public IPs change ([#6123][32])
    * Retry kube-addons creation if the initial creation fails ([#6200][33])
    * Make kube-proxy more resiliant to running out of file descriptors ([#6727][34])

-->

* etcd 現在在 master 上的一個 pod 中運行 ([#6221][18])
* nginx 現在在 master上的容器中運行 ([#6334][19])
* 開始爲主組件構建 Docker 映像檔 ([#6326][20])
* 更新了 GCE 程式以使用 gcloud 0.9.54 ([#6270][21])
* 更新了 AWS 程式來修復區域與區域語義 ([#6011][22])
* 記錄映像檔 GC 失敗時的事件 ([#6091][23])
* 爲 kubernetes 客戶端添加 QPS 限制器 ([#6203][24])
* 減少運行 make release 所需的時間 ([#6196][25])
* 新卷的支持
    * 添加 iscsi 卷插件 ([#5506][26])
    * 添加 glusterfs 卷插件 ([#6174][27])
    * AWS EBS 卷支持 ([#5138][28])
* 更新到 heapster 版本到 v0.10.0 ([#6331][29])
* 更新到 etcd 2.0.9 ([#6544][30])
* 更新到 Kibana 到 v1.2 ([#6426][31])
* 漏洞修復
    * 如果服務的公共 IP 發生變化，Kube-proxy現在會更新iptables規則 ([#6123][32])
    * 如果初始創建失敗，則重試 kube-addons 創建 ([#6200][33])
    * 使 kube-proxy 對耗盡檔案描述符更具彈性 ([#6727][34])

<!--
To download, please visit https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.15.0
-->
要下載，請訪問 https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.15.0

<!--
[1]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6098 "Enabling v1beta3 api version by default in master"
[2]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6182 "Implement multi-port Services"
[3]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6505 "Docker multi-node"
[4]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5442 "Getting started guide for Mesos on Google Cloud Platform"
[5]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6237 "example ansible setup repo"
[6]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5270 "Controller framework"
[7]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5473 "Add DeltaFIFO (a controller framework piece)"
[8]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6380 "Configure the kubelet to use HTTPS (take 2)"
[9]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6338 "Return a typed error for config validation, and make errors simple"
[10]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6190 "Add client cert authentication"
[11]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6207 "Add a limit to the number of in-flight requests that a server processes."
[12]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6355 "Added rate limiting to pod deleting"
[13]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6150 "Implement Balanced Resource Allocation (BRA) algorithm as a PriorityFunction in scheduler package."
[14]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6396 "Enable log collection from master."
[15]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6497 "Pod log subresource"
[16]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6368 "Add basic latency metrics to scheduler."
[17]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6409 "Add latency metrics to REST client"
[18]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6221 "Run etcd 2.0.5 in a pod"
[19]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6334 "Add an nginx docker image for use on the master."
[20]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6326 "Create Docker images for master components "
[21]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6270 "Updates for gcloud 0.9.54"
-->
[1]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6098 "在 master 中預設啓用 v1beta3 api 版本"
[2]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6182 "實現多端口服務"
[3]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6505 "Docker 多節點"
[4]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5442 "谷歌雲平臺上 Mesos 入門指南"
[5]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6237 "示例 ansible 設置倉庫"
[6]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5270 "控制器框架"
[7]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5473 "添加 DeltaFIFO（控制器框架塊）"
[8]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6380 "將 kubelet 設定爲使用 HTTPS (獲得 2)"
[9]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6338 "返回用於設定驗證的類型化錯誤，並簡化錯誤"
[10]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6190 "添加客戶端證書認證"
[11]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6207 "爲伺服器處理的正在運行的請求數量添加一個限制。"
[12]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6355 "添加速度限制刪除 pod"
[13]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6150 "將均衡資源分配算法作爲優先級函數實現在調度程式包中。"
[14]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6396 "啓用主伺服器收集日誌。"
[15]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6497 "pod 子日誌資源"
[16]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6368 "將基本延遲指標添加到調度程式。"
[17]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6409 "向 REST 客戶端添加延遲指標"
[18]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6221 "在 pod 中運行 etcd 2.0.5"
[19]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6334 "添加一個 nginx docker 映像檔用於主程式。"
[20]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6326 "爲主組件創建 Docker 映像檔"
[21]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6270 "gcloud 0.9.54 的更新"

<!--
[22]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6011 "Fix AWS region vs zone"
[23]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6091 "Record event when image GC fails."
[24]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6203 "Add a QPS limiter to the kubernetes client."
[25]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6196 "Parallelize architectures in both the building and packaging phases of `make release`"
[26]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5506 "add iscsi volume plugin"
[27]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6174 "implement glusterfs volume plugin"
[28]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5138 "AWS EBS volume support"
[29]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6331 "Update heapster version to v0.10.0"
[30]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6544 "Build etcd image (version 2.0.9), and upgrade kubernetes cluster to the new version"
[31]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6426 "Update Kibana to v1.2 which paramaterizes location of Elasticsearch"
[32]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6123 "Fix bug in kube-proxy of not updating iptables rules if a service's public IPs change"
[33]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6200 "Retry kube-addons creation if kube-addons creation fails."
[34]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6727 "pkg/proxy: panic if run out of fd"
-->
[22]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6011 "修復 AWS 區域 與 zone"
[23]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6091 "記錄映像檔 GC 失敗時的事件。"
[24]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6203 "向 kubernetes 客戶端添加 QPS 限制器。"
[25]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6196 "在 `make release` 的構建和打包階段並行化架構"
[26]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5506 "添加 iscsi 卷插件"
[27]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6174 "實現 glusterfs 卷插件"
[28]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5138 "AWS EBS 卷支持"
[29]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6331 "將 heapster 版本更新到 v0.10.0"
[30]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6544 "構建 etcd 映像檔(版本 2.0.9)，並將 kubernetes 叢集升級到新版本"
[31]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6426 "更新 Kibana 到 v1.2，它對 Elasticsearch 的位置進行了參數化"
[32]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6123 "修復了 kube-proxy 中的一個錯誤，如果一個服務的公共 ip 發生變化，它不會更新 iptables 規則"
[33]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6200 "如果 kube-addons 創建失敗，請重試 kube-addons 創建。"
[34]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6727 "pkg/proxy: fd 用完後引起恐慌"

