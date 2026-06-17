---
title: " Kubernetes Release: 0.15.0 "
date: 2015-04-16
slug: kubernetes-release-0150
---

<!--
Release Notes:
-->

Release 说明：

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

* 启用 1beta3 API 并将其设置为默认 API 版本 ([#6098][1])
* 增加了多端口服务([#6182][2])
    * 新入门指南
    * 多节点本地启动指南 ([#6505][3])
    * Google 云平台上的 Mesos ([#5442][4])
    * Ansible 安装说明 ([#6237][5])
* 添加了一个控制器框架 ([#5270][6], [#5473][7])
* Kubelet 现在监听一个安全的 HTTPS 端口 ([#6380][8])
* 使 kubectl 错误更加友好 ([#6338][9])
* apiserver 现在支持客户端 cert 身份验证 ([#6190][10])
* apiserver 现在限制了它处理的并发请求的数量 ([#6207][11])
* 添加速度限制删除 pod ([#6355][12])
* 将平衡资源分配算法作为优先级函数实现在调度程序包中 ([#6150][13])
* 从主服务器启用日志收集功能 ([#6396][14])
* 添加了一个 api 端口来从 Pod 中提取日志 ([#6497][15])
* 为调度程序添加了延迟指标 ([#6368][16])
* 为 REST 客户端添加了延迟指标 ([#6409][17])

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

* etcd 现在在 master 上的一个 pod 中运行 ([#6221][18])
* nginx 现在在 master上的容器中运行 ([#6334][19])
* 开始为主组件构建 Docker 镜像 ([#6326][20])
* 更新了 GCE 程序以使用 gcloud 0.9.54 ([#6270][21])
* 更新了 AWS 程序来修复区域与区域语义 ([#6011][22])
* 记录镜像 GC 失败时的事件 ([#6091][23])
* 为 kubernetes 客户端添加 QPS 限制器 ([#6203][24])
* 减少运行 make release 所需的时间 ([#6196][25])
* 新卷的支持
    * 添加 iscsi 卷插件 ([#5506][26])
    * 添加 glusterfs 卷插件 ([#6174][27])
    * AWS EBS 卷支持 ([#5138][28])
* 更新到 heapster 版本到 v0.10.0 ([#6331][29])
* 更新到 etcd 2.0.9 ([#6544][30])
* 更新到 Kibana 到 v1.2 ([#6426][31])
* 漏洞修复
    * 如果服务的公共 IP 发生变化，Kube-proxy现在会更新iptables规则 ([#6123][32])
    * 如果初始创建失败，则重试 kube-addons 创建 ([#6200][33])
    * 使 kube-proxy 对耗尽文件描述符更具弹性 ([#6727][34])

<!--
To download, please visit https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.15.0
-->
要下载，请访问 https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.15.0

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
[1]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6098 "在 master 中默认启用 v1beta3 api 版本"
[2]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6182 "实现多端口服务"
[3]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6505 "Docker 多节点"
[4]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5442 "谷歌云平台上 Mesos 入门指南"
[5]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6237 "示例 ansible 设置仓库"
[6]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5270 "控制器框架"
[7]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5473 "添加 DeltaFIFO（控制器框架块）"
[8]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6380 "将 kubelet 配置为使用 HTTPS (获得 2)"
[9]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6338 "返回用于配置验证的类型化错误，并简化错误"
[10]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6190 "添加客户端证书认证"
[11]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6207 "为服务器处理的正在运行的请求数量添加一个限制。"
[12]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6355 "添加速度限制删除 pod"
[13]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6150 "将均衡资源分配算法作为优先级函数实现在调度程序包中。"
[14]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6396 "启用主服务器收集日志。"
[15]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6497 "pod 子日志资源"
[16]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6368 "将基本延迟指标添加到调度程序。"
[17]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6409 "向 REST 客户端添加延迟指标"
[18]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6221 "在 pod 中运行 etcd 2.0.5"
[19]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6334 "添加一个 nginx docker 镜像用于主程序。"
[20]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6326 "为主组件创建 Docker 镜像"
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
[22]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6011 "修复 AWS 区域 与 zone"
[23]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6091 "记录镜像 GC 失败时的事件。"
[24]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6203 "向 kubernetes 客户端添加 QPS 限制器。"
[25]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6196 "在 `make release` 的构建和打包阶段并行化架构"
[26]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5506 "添加 iscsi 卷插件"
[27]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6174 "实现 glusterfs 卷插件"
[28]: https://github.com/GoogleCloudPlatform/kubernetes/pull/5138 "AWS EBS 卷支持"
[29]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6331 "将 heapster 版本更新到 v0.10.0"
[30]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6544 "构建 etcd 镜像(版本 2.0.9)，并将 kubernetes 集群升级到新版本"
[31]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6426 "更新 Kibana 到 v1.2，它对 Elasticsearch 的位置进行了参数化"
[32]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6123 "修复了 kube-proxy 中的一个错误，如果一个服务的公共 ip 发生变化，它不会更新 iptables 规则"
[33]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6200 "如果 kube-addons 创建失败，请重试 kube-addons 创建。"
[34]: https://github.com/GoogleCloudPlatform/kubernetes/pull/6727 "pkg/proxy: fd 用完后引起恐慌"

