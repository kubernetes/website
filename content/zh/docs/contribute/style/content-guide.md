---
title: 文档内容指南
linktitle: Content guide
content_template: templates/concept
weight: 10
card:
  name: contribute
  weight: 20
  title: Documentation Content Guide
---
<!--
---
title: Documentation Content Guide
linktitle: Content guide
content_template: templates/concept
weight: 10
card:
  name: contribute
  weight: 20
  title: Documentation Content Guide
---
-->

{{% capture overview %}}
<!--
This page contains guidelines for adding content to the Kubernetes documentation.
If you have questions about allowed content, join the [Kubernetes Slack](http://slack.k8s.io/) #sig-docs channel and ask! Use your best judgment, and feel free to
propose changes to this document in a pull request.
-->
本页包含将内容添加到 Kubernetes 文档的准则。
如果您对允许的内容有疑问，请加入[Kubernetes Slack](http://slack.k8s.io/) #sig-docs 频道并询问！
用你最好的判断力，随时在 pull request 中对这个文档提交修改。

<!--
For additional information on creating new content for the Kubernetes
docs, follow the instructions in the [Style guide](/docs/contribute/style/style-guide).
-->
更多为 Kubernetes 文档创建新内容的信息，请按照[样式指南](/docs/contribute/style/style-guide)中的说明进行操作。
{{% /capture %}}

{{% capture body %}}
<!--
## Contributing content
-->
## 贡献内容

<!--
The Kubernetes documentation comprises the content of the 
[kubernetes/website](https://github.com/kubernetes/website) source repository. 
Located in the `kubernetes/website/content/<language_code>/docs` folder, the 
majority of the Kubernetes documentation is specific to the [Kubernetes 
project](https://github.com/kubernetes/kubernetes). The Kubernetes 
documentation may also include content from projects in the 
[kubernetes](https://github.com/kubernetes) and 
[kubernetes-sigs](https://github.com/kubernetes-sigs) GitHub organizations if 
those projects do not have their own documentation. Linking to active kubernetes, 
kubernetes-sigs, and ({{< glossary_tooltip text="CNCF" term_id="cncf" >}}) projects from the Kubernetes documentation is always 
allowed, but linking to vendor-specific products is not. Check the CNCF project lists 
([Graduated/Incubating](https://www.cncf.io/projects/), 
[Sandbox](https://www.cncf.io/sandbox-projects/), 
[Archived](https://www.cncf.io/archived-projects/)) if you are unsure of a 
project's CNCF status. 
-->
Kubernetes 文档包含[kubernetes/website](https://github.com/kubernetes/website) 资源存储库的内容。
位于 `kubernetes/website/content/<language_code>/docs` 文件夹中，Kubernetes 文档的主要内容都特定于[Kubernetes 
项目](https://github.com/kubernetes/kubernetes)。
如果这些项目没有自己的文档，Kubernetes 文档中也可能包含 [kubernetes](https://github.com/kubernetes) 和
[kubernetes-sigs](https://github.com/kubernetes-sigs) 在 GitHub 组织中的项目。
链接到激活的 kubernetes，Kubernetes 文档中的 kubernetes-sigs 和  ({{< glossary_tooltip text="CNCF" term_id="cncf" >}}) 项目始终是被允许的，但是不允许链接到特定供应商的产品。
检查 CNCF 项目列表([已毕业/正在孵化](https://www.cncf.io/projects/)，
[沙盒](https://www.cncf.io/sandbox-projects/)，
[已存档](https://www.cncf.io/archived-projects/)) ，如果您不确定项目 CNCF 的状态。

<!--
### Dual-sourced content
-->
### 双重来源的内容

<!--
Kubernetes documentation does not include duplicate content sourced from multiple 
locations (*dual-sourced* content). Dual-sourced content requires duplicated 
effort from project maintainers and tends to become outdated more quickly. 
Before adding content, ask yourself this:
-->
Kubernetes 文档不包含来自多个网站的重复内容(*双重来源* 内容)。
双重来源的内容需要重复项目维护者的努力，而且往往会更快过时。
在添加内容之前，请先问自己一下：
<!-- 
- Is the content about an active CNCF project OR a project in the kubernetes or kubernetes-sigs GitHub organizations?
    - If yes, then:
        - Does the project have its own documentation?
            - if yes, link to the project's documention from the Kubernetes documentation 
            - if no, add the content to the project's repository if possible and then link to it from the Kubernetes documentation
    - If no, then:
        - Stop!
            - Adding content about vendor-specific products is not allowed
            - Linking to vendor-specific documentation and websites is not allowed
-->
- 内容是有关激活的 CNCF 项目或 kubernetes 或 kubernetes-sigs GitHub 组织中的项目的内容？
    - 如果是，则：
        - 项目是否有自己的文档？
            - 如果是，请从 Kubernetes 文档链接到该项目的文档 
            - 如果没有，将内容添加到项目的存储库中，然后从 Kubernetes 文档链接到该存储库
    - 如果否，则：
        - 停止！
            - 禁止添加有关厂商自定义产品的内容
            - 不允许链接到厂商自定义的文档和网站

<!--
### What is and isn't allowed
-->
### 什么是允许和不允许的

<!--
There are some scenarios in which the Kubernetes documentation includes content from non-Kubernetes projects. 
-->
在某些情况下，Kubernetes 文档包含非 Kubernetes 项目的内容。
<!--
Below are general categories of non-Kubernetes project content along with guidelines of what is and is not allowed:
-->
以下是非 Kubernetes 项目内容的一般类别以及允许和禁止的准则：
<!--
1. Instructional content involving non-Kubernetes projects during setup or operation of Kubernetes
    - Allowed:
        - Referring to or linking to existing documentation about a CNCF project or a project in the kubernetes or kubernetes-sigs GitHub organizations
            - Example: for installating Kubernetes in a learning environment, including a prerequisite stating that successful installation and configuration of minikube is required and linking to the relevant minikube documentation
        - Adding content for kubernetes or kubernetes-sigs projects that don't have their own instructional content
            - Example: including [kubadm](https://github.com/kubernetes/kubeadm) installation and troubleshooting instructions   
    - Not Allowed:
        - Adding content that duplicates documentation in another repository
            - Examples: 
                - Including minikube installation and configuration instructions; minikube has its own [documentation](https://minikube.sigs.k8s.io/docs/) that provides those instructions
                - Including instructions for installing Docker, CRI-O, containerd, and other container runtimes on various operating systems
                - Including instructions for installing Kubernetes on production environments using various projects:
                    - Kubernetes Rebar Integrated Bootstrap (KRIB) is a vendor-specific project and content belongs in the vendor's documentation
                    - [Kubernetes Operations (kops)](https://github.com/kubernetes/kops) has installation instructions and tutorials in its GitHub repository
                    - [Kubespray](https://kubespray.io) has its own documenation
        - Adding a tutorial that explains how to perform a task using a vendor-specific product or an open source project that is not a CNCF project or a project in the kubernetes or kubnetes-sigs GitHub organizations
        - Adding a tutorial on how to use a CNCF project or a project in the kubernetes or kubnetes-sigs GitHub organizations if the project has its own documentation
-->
1. 在 Kubernetes 的设置或操作过程中涉及非 Kubernetes 项目的教学内容
    - 允许：
        - 引用或链接到有关 CNCF 项目或 kubernetes 或 kubernetes-sigs GitHub 组织中的项目的现有文档
            - 示例：用于在学习环境中安装 Kubernetes ，包括成功安装和配置 minikube 并链接到相关 minikube 文档这个先决条件。  
        - 为没有自己的教学内容的 kubernetes 或 kubernetes-sigs 项目添加内容
            - 示例：包括 [kubadm](https://github.com/kubernetes/kubeadm) 安装和故障排除说明
    - 不允许:
        - 添加在其他存储库中的文档重复的内容
            - 例子：
                - 包括 minikube 安装和配置说明； minikube 有它自己的[文件](https://minikube.sigs.k8s.io/docs/) 提供了这些说明
                - 包括有关在各种操作系统上安装 Docker， CRI-O， 容器化和其他容器运行时的说明
                - 包括有关使用各种项目在生产环境中安装 Kubernetes 的说明：
                    - Kubernetes 钢筋集成引导程序（KRIB）是厂商自定义类型的项目，其内容属于厂商的文档
                    - [Kubernetes 操作 (kops)](https://github.com/kubernetes/kops) 在其 GitHub 存储库中具有安装说明和教程
                    - [Kubespray](https://kubespray.io) 有自己的文档
        - 添加一个教程来说明如何使用厂商自定义产品来执行任务，或不是 CNCF 项目或 kubernetes 或 kubnetes-sigs GitHub 组织中的项目的开源项目来执行任务
        - 添加了有关如何使用 CNCF 项目或 kubernetes 或kubnetes-sigs GitHub 组织中的项目的教程，如果该项目具有自己的文档
<!--
1. Detailed technical content about how to use a non-Kubernetes project or how that project is designed

    Adding this type of content to the Kubernetes documentation is not allowed. 
-->
1. 有关如何使用非 Kubernetes 项目或如何设计该项目的详细技术内容

    不允许将这种类型的内容添加到 Kubernetes 文档中。
<!--
1. Content that describes a non-Kubernetes project
    - Allowed:    
        - Adding a brief introductory paragraph about a CNCF project or a project in the kubernetes or kubernetes-sigs GitHub organizations; the paragraph may contain links to the project  
    - Not Allowed:    
        - Adding content describing a vendor-specific product
        - Adding content describing an open source project that is not a CNCF project or a project in the kubernetes or kubnetes-sigs GitHub organizations
        - Adding content that duplicates documentation from another project, regardless of source repository
            - Example: adding [Kubernetes in Docker (KinD)](https://kind.sigs.k8s.io) documentation to the Kubernetes documentation
            - Example: adding [Kubernetes in Docker (KinD)](https://kind.sigs.k8s.io) documentation to the Kubernetes documentation
-->
1. 描述非 Kubernetes 项目的内容
    - 允许：    
        - 添加有关 CNCF 项目或 kubernetes 或 kubernetes-sigs GitHub 组织中的项目的简短介绍性段落；段落可能包含项目链接
    - 不允许：    
        - 添加描述厂商自定义产品的内容
        - 添加内容描述开源项目，该项目不是 CNCF 项目，也不是 kubernetes 或 kubnetes-sigs GitHub 组织中的项目
        - 添加从其他项目中的文档重复的内容，不考虑源存储库
            - 示例：将[Docker (KinD) 中的 Kubernetes](https://kind.sigs.k8s.io) 文档添加到 Kubernetes 文档中
<!--
1. Content that simply links to information about a non-Kubernetes project
    - Allowed:    
        - Linking to projects in the kubernetes and kubernetes-sigs GitHub organizations
            - Example: linking to Kubernetes in Docker (KinD) [documentation](https://kind.sigs.k8s.io/docs/user/quick-start), which resides in the kubernetes-sigs GitHub organization
        - Linking to active CNCF projects
            - Example: linking to the Prometheus [documentation](https://prometheus.io/docs/introduction/overview/); Prometheus is an active CNCF project
    - Not Allowed:    
        - Linking to vendor-specific products
        - Linking to archived CNCF projects
        - Linking to inactive projects in the kubernetes and kubernetes-sigs GitHub organizations
        - Linking to open source projects that are not CNCF projects or do not reside in the kubernetes or kubernetes-sigs GitHub organizations
-->
1. 仅链接到有关非 Kubernetes 项目的信息的内容
    - 允许：    
        - 链接到 kubernetes 和 kubernetes-sigs GitHub 组织中的项目
            - 示例：链接到 Docker (KinD) 中的 Kubernetes[文档](https://kind.sigs.k8s.io/docs/user/quick-start)，该文件位于 kubernetes-sigs GitHub 组织中
        - 链接到有效的 CNCF 项目
            - 示例：链接到 Prometheus [文档](https://prometheus.io/docs/introduction/overview/)； Prometheus 是一个被激活的 CNCF 项目
    - 不允许：    
        - 链接到厂商自定义产品
        - 链接到已归档的 CNCF 项目
        - 链接到 kubernetes 和 kubernetes-sigs GitHub 组织中的非活动项目
        - 链接到不是 CNCF 项目或不在 kubernetes 或 kubernetes-sigs GitHub 组织中的开源项目
<!--
1. Content about training courses
    - Allowed:    
        - Linking to vendor-neutral Kubernetes training courses offered by the [CNCF](https://www.cncf.io/), the [Linux Foundation](https://www.linuxfoundation.org/), and the [Linux Academy](https://linuxacademy.com/), which is a partner of the Linux Foundation
             - Example: linking to Linux Academy courses such as [Kubernetes Quick Start](https://linuxacademy.com/course/kubernetes-quick-start/) and [Kubernetes Security](https://linuxacademy.com/course/kubernetes-security/) 
    - Not Allowed:    
        - Linking to online training outside of the CNCF, the Linux Foundation, or the Linux Academy; the Kubernetes documentation does not link to third-party content  
            - Example: linking to Kubernetes tutorials or courses on Medium, KodeKloud, Udacity, Coursera, learnk8s, and similar websites
        - Linking to vendor-specific tutorials regardless of the training provider
            - Example: linking to Linux Academy courses such as [Google Kubernetes Engine Deep Dive](https://linuxacademy.com/google-cloud-platform/training/course/name/google-kubernetes-engine-deep-dive) and [Amazon EKS Deep Dive](https://linuxacademy.com/course/amazon-eks-deep-dive/)
-->
1. 有关培训课程的内容
    - 允许：    
        - 链接到[CNCF](https://www.cncf.io/)， [Linux 基金会](https://www.linuxfoundation.org/)，和[Linux 学会](https://linuxacademy.com/),提供的和厂商自定义的 Kubernete 培训课程，他是 Linux 基金会的合作伙伴。
            - 示例：链接到 Linux 学院课程，例如[Kubernetes 快速入门](https://linuxacademy.com/course/kubernetes-quick-start/) 和 [Kubernetes 安全](https://linuxacademy.com/course/kubernetes-security/) 
    - 不允许：    
        - 链接到 CNCF，Linux 基金会或 Linux 学院之外的在线培训；Kubernetes 文档未链接到第三方内容
            - 示例：链接到 Medium，KodeKloud，Udacity，Coursera，learnk8s 和类似网站上的 Kubernetes 教程或课程
        - 链接到特定于厂商自定义的教程，与培训提供者无关
            - 示例：链接到 Linux 学院课程，例如[Google Kubernetes 引擎深度学习](https://linuxacademy.com/google-cloud-platform/training/course/name/google-kubernetes-engine-deep-dive) 和 [亚马逊 EKS 深潜](https://linuxacademy.com/course/amazon-eks-deep-dive/)

<!--
If you have questions about allowed content, join the [Kubernetes Slack](http://slack.k8s.io/) #sig-docs channel and ask! 
-->
如果您对允许的内容有疑问，加入[Kubernetes Slack](http://slack.k8s.io/) #sig-docs 频道并询问！ {{% /capture %}}

{{% capture whatsnext %}}
<!--
* Read the [Style guide](/docs/contribute/style/style-guide).
-->
* 阅读[样式指南](/docs/contribute/style/style-guide)。{{% /capture %}}

