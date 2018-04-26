---
title: 本地化 Kubernetes 文档
approvers:
- chenopis
- zacharysarah
cn-approvers:
- chentao1596
---
<!--
---
title: Localizing Kubernetes Documentation
approvers:
- chenopis
- zacharysarah
---
-->

<!--
We're happy to add localizations (l10n) of Kubernetes documentation to the website!
-->
我们很高兴将 Kubernetes 文档的本地化（l10n）添加到 website！

<!--
Localizations must meet the following requirements for _workflow_ (how to localize) and _output_ (what to localize).
-->
本地化必须满足以下 _工作流程_ 要求（如何本地化）和 _输出_（本地化的内容）。

<!--
## Workflow 
-->
## 工作流程 

<!--
All l10n work must be stored and tracked within the [Kubernetes organization](https://github.com/kubernetes).
-->
所有 l10n 工作必须在 [Kubernetes 组织](https://github.com/kubernetes) 内进行存储和跟踪.

<!--
### Basis for localizations
-->
### 本地化的基础

<!--
Localizations must source from the English files for the [most recent major release](https://kubernetes.io/docs/home/supported-doc-versions/#current-version).
-->
本地化必须从 [最近发布的主要版本](https://kubernetes.io/docs/home/supported-doc-versions/#current-version) 的英文文件中获得。

<!--
**Note:** To find the most recent release's documentation source files:
1. Navigate to https://github.com/kubernetes/website.
2. Select the `release-1.X` branch for the most recent version.
-->
**注意：** 想要查找最新发布版本的文档的源文件：
1. 导航到 https://github.com/kubernetes/website。
2. 选择  `release-1.X`  最新版本的分支。

<!--
    For example, the branch for Kubernetes v1.9 docs is `release-1.9`.
-->
    例如，Kubernetes v1.9 文档的分支是 `release-1.9`。


<!--
Source files reside in the `/docs/` directory.
-->
源文件驻留在 `/docs/` 目录中。
{: .note}

<!--
### Repository
-->
### 仓库

<!--
A l10n team will have a repository specifically dedicated to its work, for example: [kubernetes/kubernetes-docs-cn](https://github.com/kubernetes/kubernetes-docs-cn).
-->
一个 l10n 团队将有一个专门用于其工作的仓库，例如：[kubernetes/kubernetes-docs-cn](https://github.com/kubernetes/kubernetes-docs-cn)。

<!--
**Note:** To open a l10n repository, [contact the SIG docs lead](https://kubernetes.slack.com/messages/C1J0BPD2M) on Slack for assistance.
-->
**注：** 想要打开一个 l10n 仓库，请在 Slack 上 [联系 SIG docs 的负责人](https://kubernetes.slack.com/messages/C1J0BPD2M) 寻求帮助。

{: .note}

<!--
### Project
-->
### 项目

<!--
Teams must track their overall progress with a [GitHub project](https://help.github.com/articles/creating-a-project-board/).
-->
团队必须使用 [GitHub 项目](https://help.github.com/articles/creating-a-project-board/) 来跟踪他们的整体进度。

<!--
Projects must include columns for:
- To do
- In progress
- Done

For example: the [Chinese localization project](https://github.com/kubernetes/kubernetes-docs-cn/projects/1).
-->
项目必须包含以下列：
- 需要做
- 进行中
- 已完成

例如：[中文本地化项目](https://github.com/kubernetes/kubernetes-docs-cn/projects/1)。

<!--
### Team function
-->
### 团队功能

<!--
L10n teams must provide a single point of contact: the name and contact information of a person who can respond to or redirect questions or concerns.
-->
l10n 团队必须提供单点联系人：可以回应或重定向问题或疑虑的人员的姓名和联系信息。

<!--
L10n teams must provide their own repository maintainers.
-->
l10n 团队必须提供自己的仓库维护人员。

<!--
All l10n work must be self-sustaining with the team's own resources.
-->
所有 l10n 的工作必须能够与团队自身的资源保持一致

<!--
Wherever possible, every localized page must be approved by a reviewer from a different company than the translator.
-->
只要有可能，每个本地化页面都必须由来自不同公司的翻译人员批准。

<!--
### Upstream contributions
-->
### 上游捐款

<!--
Upstream contributions are welcome and encouraged!
-->
上游捐款受到欢迎和鼓励！

<!--
For the sake of efficiency, limit upstream contributions to a single pull request per week, containing a single squashed commit.
-->
为了提高效率，将上游贡献限制为每周一个 pull 请求，其中包含一个压缩的提交。

<!--
## Output
-->
## 输出

<!--
All localizations must include the following documentation at a minimum:
-->
所有本地化必须至少包含以下文档：

<!--
Description | URLs
-----|-----
Home | [All heading and subheading URLs](https://kubernetes.io/docs/home/)
Setup | [All heading and subheading URLs](https://kubernetes.io/docs/setup/)
Tutorials | [Kubernetes Basics](https://kubernetes.io/docs/tutorials/), [Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)
-->
描述 | URL
-----|-----
Home | [所有标题和次标题的 URL](https://kubernetes.io/docs/home/)
Setup | [所有标题和次标题的 URL](https://kubernetes.io/docs/setup/)
Tutorials | [Kubernetes 基础](https://kubernetes.io/docs/tutorials/)，[Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

<!--
## Next steps
-->
## 下一步

<!--
Once a l10n meets requirements for workflow and minimum output, SIG docs will:
- Work with the localization team to implement language selection on the website
- Publicize availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels.
-->
一旦 l10n 满足工作流程和最低输出要求，SIG docs 将会：
- 与本地化团队合作，在网站上实施语言选择。
- 通过 [云计算基金会](https://www.cncf.io/)（CNCF）渠道宣传可用性。

<!--
**Note:** Implementation of language selection is pending Kubernetes' first completed localization project.
-->
**注意：** 语言选择的实施正在等待 Kubernetes 完成的第一个本地化项目。
{: .note}