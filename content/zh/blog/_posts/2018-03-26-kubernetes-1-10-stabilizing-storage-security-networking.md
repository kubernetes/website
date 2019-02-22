---
标题：'Kubernetes 1.10：稳定存储，安全和网络'
作者：kbarnard
标签：
日期：2018-03-26
modified_time：'2018-03-27T11：01：39.569-07：00'
blogger_id：tag：blogger.com，1999：blog-112706738355446097.post-6519705795358457586
blogger_orig_url：https：//kubernetes.io/blog/2018/03/kubernetes-1.10-stabilizing-storage-security-networking
slug：kubernetes-1.10-stabilizing-storage-security-networking
日期：2018-03-26
---

***编者注：今天的帖子是[1.10发布
团队]（https://github.com/kubernetes/sig-release/blob/master/releases/release-1.10/release_team.md）***

我们很高兴地宣布推出Kubernetes 1.10，这是我们的第一个版本
2018年！

今天的发布继续推进成熟度，可扩展性和可插拔性
Kubernetes。这个最新版本稳定了3个关键领域的功能，
包括存储，安全和网络。此版本中值得注意的补充
包括引入外部kubectl凭证提供程序（alpha），
能够在安装时（beta）将DNS服务切换到CoreDNS，以及移动
容器存储接口（CSI）和持久本地卷到beta。

让我们深入了解此版本的主要功能：

##存储 -  CSI和本地存储转向测试版

这对[存储特殊兴趣小组]来说是一个有影响力的版本
（SIG）]（https://github.com/kubernetes/community/tree/master/sig-storage），
标志着他们在多种功能方面的工作达到顶峰。 [Kubernetes
实施]（https://github.com/kubernetes/features/issues/178）
[集装箱存储
接口（https://github.com/container-storage-interface/spec/blob/master/spec.md）
（CSI）在此版本中转向测试版：现在安装新的卷插件
轻松部署pod。这反过来又使第三方存储提供商能够
在核心Kubernetes代码库之外独立开发他们的解决方案。
这继续了Kubernetes生态系统中的可扩展性。

[耐用（非共享）本地存储
管理]（https://github.com/kubernetes/features/issues/121）进展到
此版本中的测试版，使本地连接（非网络连接）存储
可用作持久卷源。这意味着更高的性能和
降低分布式文件系统和数据库的成本。

此版本还包括对Persistent Volumes的许多更新。 Kubernetes可以
自动[防止删除正在使用的持久性卷声明
一个吊舱]（https://github.com/kubernetes/features/issues/498）（测试版）和[预防
删除绑定到持久卷声明的持久卷
]（https://github.com/kubernetes/features/issues/499）（测试版）。这有助于确保
以正确的顺序删除存储API对象。

##安全性 - 外部凭据提供程序（alpha）

Kubernetes，是
已经高度可扩展，在1.10中获得了另一个扩展点
[外部kubectl凭证
提供者]（https://github.com/kubernetes/features/issues/541）（alpha）。云
提供商，供应商和其他平台开发者现在可以发布二进制文件
用于处理特定云提供商IAM服务的身份验证的插件，或
与不受支持的内部身份验证系统集成
in-tree，例如Active Directory。这补充了[云控制器
管理器]（https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/）
功能在1.9中添加。

## Networking  -  CoreDNS作为DNS提供商（测试版）

能够[切换DNS
服务]（https://github.com/kubernetes/website/pull/7638）到CoreDNS
[安装时间]（https://kubernetes.io/docs/tasks/administer-cluster/coredns/）
目前处于测试阶段。 CoreDNS具有更少的移动部件：它是一个可执行文件和一个
单个进程，并支持其他用例。

社区内的每个特殊兴趣小组（SIG）都在继续提供
各自要求最多的增强功能，修复程序和功能
专业领域。有关SIG包含的完整列表，请访问
[发布
音符]（https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.10.md#110-release-notes）。

＃＃ 可用性

Kubernetes 1.10可供[下载
GitHub的]（https://github.com/kubernetes/kubernetes/releases/tag/v1.10.0）。要得到
从Kubernetes开始，看看这些我[nteractive
教程]（https://kubernetes.io/docs/tutorials/）。

## 2天特色博客系列

如果您有兴趣探索这些功能
更深入，请回顾下周我们的2天Kubernetes系列
我们将重点介绍以下功能的详细演练：

第1天 -  Kubernetes的Beta容器存储接口（CSI）
第2天 -  Kubernetes的本地持续卷将进入Beta

##发布团队

这个版本是通过数百个的努力实现的
贡献技术和非技术内容的个人。 特别
感谢[发布
团队（https://github.com/kubernetes/sig-release/blob/master/releases/release-1.10/release_team.md）
由Kubernetes微软大使Jaice Singer DuMars领导。 10
发布团队中的个人协调发布的许多方面，来自
文档到测试，验证和功能完整性。

随着Kubernetes社区的发展，我们的发布过程代表了一个
在开源软件开发中进行合作的惊人演示。
Kubernetes继续迅速获得新用户。这种增长创造了一个
积极的反馈循环，更多的贡献者提交代码创建更多
生机勃勃。

## Project Velocity

CNCF继续完善一个雄心勃勃的项目
可视化进入项目的无数贡献。 [K8S
DevStats]（https://devstats.k8s.io/）说明了贡献的细分
来自主要公司贡献者，以及一套令人印象深刻的预配置
报告从个人贡献者到拉取请求生命周期的所有内容
倍。由于自动化程度提高，因此在发布结束时会出现问题
仅略高于开始时的水平。这标志着一个专业
转向问题可管理性。 Kubernetes留下了75,000多条评论
GitHub上讨论最激烈的项目之一。

##用户亮点

根据[最近的CNCF
调查]（https://www.cncf.io/blog/2018/03/26/cncf-survey-china/），超过49％
亚洲受访者使用Kubernetes进行生产，另外49％
评估它用于生产。已建立的全球性组织
使用[Kubernetes in production]（https://kubernetes.io/case-studies/）at
规模庞大。最近发布的社区用户故事包括：
1. **华为**，是中国最大的电信设备制造商
世界，[移动其内部IT部门的应用程序继续运行
Kubernetes]（https://kubernetes.io/case-studies/huawei/）。这导致了
全球部署周期从一周减少到几分钟，以及效率
应用程序交付提高了十倍。
1. **锦江之旅国际**，五大OTA和酒店之一
公司，使用Kubernetes [加速他们的软件发布
速度（https://www.linux.com/blog/managing-production-systems-kubernetes-chinese-enterprises）
从几小时到几分钟。此外，他们利用Kubernetes增加
其在线工作负载的可扩展性和可用性。
1. **使用德国媒体和软件公司Haufe Group **
Kubernetes [以半年内发布新版本
小时]（https://kubernetes.io/case-studies/haufegroup/）而不是几天。该
公司也可以在夜间缩减到大约一半的容量，
节省30％的硬件成本。
1. **世界上最大的资产管理公司贝莱德**能够迅速采取行动
使用Kubernetes并建立一个投资者研究网络应用程序从[开始到
在100天以内交货]（https://kubernetes.io/case-studies/blackrock/）。
Kubernetes能帮助你的团队吗？ [分享你的
故事]（https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform）
与社区。

##生态系统更新

1. CNCF正在将其认证产品扩展到
包括认证的Kubernetes Application Developer考试。 CKAD考试
证明个人设计，构建，配置和公开的能力
Kubernetes的云原生应用程序。 CNCF正在寻找beta测试人员
这个新节目。可以找到更多信息
[这里]（https://www.cncf.io/blog/2018/03/16/cncf-announces-ckad-exam/）。
1. Kubernetes文档现在具有[用户
旅程]（https://k8s.io/docs/home/）：基于学习的特定途径
读者是谁，读者想做什么。学习Kubernetes更容易
对于初学者来说，比以往任何时候都更有经验，用户可以找到任务旅程
特定于集群管理员和应用程序开发人员。
1. CNCF还提供[在线
训练]（https://www.cncf.io/certification/training/）教授技能
需要创建和配置真实世界的Kubernetes集群。

## KubeCon

世界上最大的Kubernetes聚会，[KubeCon +
CloudNativeCon]（https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/）
将于2018年5月2日至4日前往哥本哈根，并将以技术为特色
课程，案例研究，开发者深度潜水，沙龙等等！看看
[日程]（https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/program/schedule/）
发言者和
[注册]（https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/attend/register/）
今天！

##网络研讨会

4月10日加入Kubernetes 1.10发布团队的成员
上午10点PDT了解此版本的主要功能，包括Local
持久卷和容器存储接口（CSI）。寄存器
[这里]（https://www.cncf.io/event/webinar-kubernetes-1-10/）。

＃＃ 参与其中

参与Kubernetes最简单的方法就是加入
众多[特别兴趣之一]
基团]（https://github.com/kubernetes/community/blob/master/sig-list.md）
（SIGs）符合您的兴趣。 有你想播放的东西
到Kubernetes社区？ 在我们的每周[社区]分享您的声音
会议]（https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting），
并通过以下渠道。

感谢您的持续反馈和支持。
1.在[Stack]上发布问题（或回答问题）
溢出（http://stackoverflow.com/questions/tagged/kubernetes）
1.加入[K8sPort]（http://k8sport.org/）的倡导者社区门户网站
1.在Twitter上关注我们[@Kubernetesio]（https://twitter.com/kubernetesio）
最新更新
1.在[Slack]上与社区聊天（http://slack.k8s.io/）
1.分享你的Kubernetes
[故事]（https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform）。