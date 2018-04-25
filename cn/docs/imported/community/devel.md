---
title: Kubernetes开发者指南
cn-approvers:
- fatalc
---

<!---
title: Kubernetes Developer Guide
--->

<!-- The developer guide is for anyone wanting to either write code which directly accesses the
Kubernetes API, or to contribute directly to the Kubernetes project.
It assumes some familiarity with concepts in the [User Guide](http://kubernetes.io/docs/user-guide/) and the [Cluster Admin
Guide](http://kubernetes.io/docs/admin/). -->
开发人员指南适用于希望编写直接访问Kubernetes API的代码或直接为Kubernetes项目贡献的人员。


<!-- ## The process of developing and contributing code to the Kubernetes project -->
## 为Kubernetes项目开发和贡献代码的流程

<!-- 
* **Contributor Guide**
  ([Please start here](https://github.com/kubernetes/community/tree/master/contributors/guide/README.md)) to learn about how to contribute to Kubernetes

* **GitHub Issues** ([issues.md](https://github.com/kubernetes/community/tree/master/contributors/devel/issues.md)): How incoming issues are triaged.

* **Pull Request Process** ([/contributors/guide/pull-requests.md](https://github.com/kubernetes/community/tree/master/contributors/guide/pull-requests.md)): When and why pull requests are closed.

* **Getting Recent Builds** ([getting-builds.md](https://github.com/kubernetes/community/tree/master/contributors/devel/getting-builds.md)): How to get recent builds including the latest builds that pass CI.

* **Automated Tools** ([automation.md](https://github.com/kubernetes/community/tree/master/contributors/devel/automation.md)): Descriptions of the automation that is running on our github repository.
-->
* **贡献者指南**
  (请从[这里](https://github.com/kubernetes/community/tree/master/contributors/guide/README.md)) 了解如何为Kubernetes做出贡献。

* **GitHub Issues** ([issues.md](https://github.com/kubernetes/community/tree/master/contributors/devel/issues.md)): 新Issues如何归类。

* **Pull Request 流程** ([/contributors/guide/pull-requests.md](https://github.com/kubernetes/community/tree/master/contributors/guide/pull-requests.md)):  何时/为何pull request被关闭。

* **获取最新的构建** ([getting-builds.md](https://github.com/kubernetes/community/tree/master/contributors/devel/getting-builds.md)): 如何获得最近的构建 ，包括通过CI生成的最新构建 。

* **自动化工具** ([automation.md](https://github.com/kubernetes/community/tree/master/contributors/devel/automation.md)): 在我们的github库上运行的自动化工具介绍。


<!-- ## Setting up your dev environment, coding, and debugging -->
## 设置您的开发环境，编码 以及 调试

<!-- 
* **Development Guide** ([development.md](https://github.com/kubernetes/community/tree/master/contributors/devel/development.md)): Setting up your development environment.

* **Testing** ([testing.md](https://github.com/kubernetes/community/tree/master/contributors/devel/testing.md)): How to run unit, integration, and end-to-end tests in your development sandbox.

* **Hunting flaky tests** ([flaky-tests.md](https://github.com/kubernetes/community/tree/master/contributors/devel/flaky-tests.md)): We have a goal of 99.9% flake free tests.
  Here's how to run your tests many times.

* **Logging Conventions** ([logging.md](https://github.com/kubernetes/community/tree/master/contributors/devel/logging.md)): Glog levels.

* **Profiling Kubernetes** ([profiling.md](https://github.com/kubernetes/community/tree/master/contributors/devel/profiling.md)): How to plug in go pprof profiler to Kubernetes.

* **Instrumenting Kubernetes with a new metric**
  ([instrumentation.md](https://github.com/kubernetes/community/tree/master/contributors/devel/instrumentation.md)): How to add a new metrics to the
  Kubernetes code base.

* **Coding Conventions** ([coding-conventions.md](https://github.com/kubernetes/community/tree/master/contributors/devel/../guide/coding-conventions.md)):
  Coding style advice for contributors.

* **Document Conventions** ([how-to-doc.md](https://github.com/kubernetes/community/tree/master/contributors/devel/how-to-doc.md))
  Document style advice for contributors.

* **Running a cluster locally** ([running-locally.md](https://github.com/kubernetes/community/tree/master/contributors/devel/running-locally.md)):
  A fast and lightweight local cluster deployment for development.
  -->
  * **开发指南** ([development.md](https://github.com/kubernetes/community/tree/master/contributors/devel/development.md)): 设置你的开发环境。
  
  * **测试** ([testing.md](https://github.com/kubernetes/community/tree/master/contributors/devel/testing.md)): 如何在开发沙箱中运行单元测试，集成测试和端到端测试。
  
  * **定位 失败的测试(Hunting flaky tests)** ([flaky-tests.md](https://github.com/kubernetes/community/tree/master/contributors/devel/flaky-tests.md)): 我们有99.9％的无失败测试(flake free tests)目标。
    以下是如何多次运行测试。
  
  * **Logging约定** ([logging.md](https://github.com/kubernetes/community/tree/master/contributors/devel/logging.md)): Glog日志等级。
  
  * **Kubernetes性能分析** ([profiling.md](https://github.com/kubernetes/community/tree/master/contributors/devel/profiling.md)): 如何在Kubernetes里配置go pprof性能监视器
  
  * **用新的标准来度量 Kubernetes**
    ([instrumentation.md](https://github.com/kubernetes/community/tree/master/contributors/devel/instrumentation.md)): 如何向Kubernetes代码库添加新的度量标准。
  
  * **编码约定** ([coding-conventions.md](https://github.com/kubernetes/community/tree/master/contributors/devel/../guide/coding-conventions.md)):
   对贡献者编码风格的建议。
  
  * **文档约定** ([how-to-doc.md](https://github.com/kubernetes/community/tree/master/contributors/devel/how-to-doc.md))
   对贡献者文档风格的建议。
  
  * **在本地运行一个集群** ([running-locally.md](https://github.com/kubernetes/community/tree/master/contributors/devel/running-locally.md)):
   用于开发的快速且轻量级的本地群集部署。

<!-- ## Developing against the Kubernetes API -->
## 针对 Kubernetes API 的开发

<!-- 
* The [REST API documentation](http://kubernetes.io/docs/reference/) explains the REST
  API exposed by apiserver.

* **Annotations** ([Annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)): are for attaching arbitrary non-identifying metadata to objects.
  Programs that automate Kubernetes objects may use annotations to store small amounts of their state.

* **API Conventions** ([api-conventions.md](https://github.com/kubernetes/community/tree/master/contributors/devel/api-conventions.md)):
  Defining the verbs and resources used in the Kubernetes API.

* **API Client Libraries** ([client-libraries.md](https://github.com/kubernetes/community/tree/master/contributors/devel/client-libraries.md)):
  A list of existing client libraries, both supported and user-contributed.
-->

* [REST API 文档](http://kubernetes.io/docs/reference/)解释了API服务器暴露出的REST API。

* **注解** ([Annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)):用于将任意非标识的元数据附加到对象，
  使Kubernetes对象自动化的程序可以使用注释来存储少量的状态数据。

* **API 约定** ([api-conventions.md](https://github.com/kubernetes/community/tree/master/contributors/devel/api-conventions.md)):
  定义了Kubernetes API中使用的动词和资源。

* **API 客户端库** ([client-libraries.md](https://github.com/kubernetes/community/tree/master/contributors/devel/client-libraries.md)):
  现有客户端库列表，包含支持库和用户贡献的库。

<!-- ## Writing plugins -->
## 编写插件

<!-- 
* **Authentication** ([Authentication](http://kubernetes.io/docs/admin/authentication/)):
  The current and planned states of authentication tokens.

* **Authorization Plugins** ([Authorization](http://kubernetes.io/docs/admin/authorization/)):
  Authorization applies to all HTTP requests on the main apiserver port.
  This doc explains the available authorization implementations.

* **Admission Control Plugins** ([admission_control](https://github.com/kubernetes/community/tree/master/contributors/design-proposals/api-machinery/admission_control.md))
-->

* **认证** ([Authentication](http://kubernetes.io/docs/admin/authentication/)):
  令牌(token)认证的目前状况和计划情况。

* **授权插件** ([Authorization](http://kubernetes.io/docs/admin/authorization/)):
   授权适应用于主api服务器端口上的所有HTTP请求，本文解释了可用的授权实现。

* **准入控制插件** ([admission_control](https://github.com/kubernetes/community/tree/master/contributors/design-proposals/api-machinery/admission_control.md))

<!-- ## Building releases -->
## 构建版本

<!-- See the [kubernetes/release](https://github.com/kubernetes/release) repository for details on creating releases and related tools and helper scripts. -->
查看 [kubernetes/release](https://github.com/kubernetes/release) 目录以获取有关版本构建和相关工具以及帮助程序脚本的详细信息。
