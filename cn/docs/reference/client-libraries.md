---
title: 客户端库
cn-approvers:
- tianshapjq
approvers:
- ahmetb
---
<!--
---
title: Client Libraries
approvers:
- ahmetb
---
-->

{% capture overview %}
<!--
This page contains an overview of the client libraries for using the Kubernetes
API from various programming languages.
-->
本页面概述如何在多种编程语言中通过客户端库来使用 Kubernetes API。
{% endcapture %}

{% capture body %}
<!--
To write applications using the [Kubernetes REST API](/docs/reference/api-overview/),
you do not need to implement the API calls and request/response types yourself.
You can use a client library for the programming language you are using.
-->
如果想要编写应用程序来使用 [Kubernetes REST API](/docs/reference/api-overview/)，您并不需要自己实现 API 调用或者请求（或者响应）的类型，使用与您正在使用的编程语言对应的客户端库即可。

<!--
Client libraries often handle common tasks such as authentication for you.
Most client libraries can discover and use the Kubernetes Service Account to 
authenticate if the API client is running inside the Kubernetes cluster, or can
understand the [kubeconfig file](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/)
format to read the credentials and the API Server address.
-->
客户端库通常已经帮您处理了一些常见的任务，例如身份验证。如果 API 客户端运行在 Kubernetes 集群内，那么大多数的客户端库能够发现并使用 Kubernetes 服务账号来进行身份验证，或者通过 [kubeconfig file](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/) 文件读取验证信息和 API Server 地址。

<!--
## Officially-supported Kubernetes client libraries
-->
## 官方支持的 Kubernetes 客户端库

<!--
The following client libraries are officially maintained by [Kubernetes SIG API
Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).
-->
以下是由 [Kubernetes SIG API
Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery) 提供官方维护的客户端库。

<!--
| Language | Client Library | Sample Programs |
|----------|----------------|-----------------|
| Go       | [github.com/kubernetes/client-go/](https://github.com/kubernetes/client-go/) | [浏览](https://github.com/kubernetes/client-go/tree/master/examples)
| Python       | [github.com/kubernetes-client/python/](https://github.com/kubernetes-client/python/) | [浏览](https://github.com/kubernetes-client/python/tree/master/examples)
| Java     | [github.com/kubernetes-client/java](https://github.com/kubernetes-client/java/) | [浏览](https://github.com/kubernetes-client/java#installation)
| dotnet   | [github.com/kubernetes-client/csharp](https://github.com/kubernetes-client/csharp) | [浏览](https://github.com/kubernetes-client/csharp/tree/master/examples/simple)
-->
|   语言   |     用户库     |     代码示例    |
|----------|----------------|-----------------|
| Go       | [github.com/kubernetes/client-go/](https://github.com/kubernetes/client-go/) | [浏览](https://github.com/kubernetes/client-go/tree/master/examples)
| Python       | [github.com/kubernetes-client/python/](https://github.com/kubernetes-client/python/) | [浏览](https://github.com/kubernetes-client/python/tree/master/examples)
| Java     | [github.com/kubernetes-client/java](https://github.com/kubernetes-client/java/) | [浏览](https://github.com/kubernetes-client/java#installation)
| dotnet   | [github.com/kubernetes-client/csharp](https://github.com/kubernetes-client/csharp) | [浏览](https://github.com/kubernetes-client/csharp/tree/master/examples/simple)

<!--
## Community-maintained client libraries
-->
## 社区维护的客户端库

<!--
The following Kubernetes API client libraries are provided and maintained by
their authors, not the Kubernetes team.
-->
以下的 Kubernetes API 客户端库是由其作者自己提供和维护的，并不是由 Kubernetes 团队提供和维护。

<!--
| Language             | Client Library                           |
| -------------------- | ---------------------------------------- |
| Clojure              | [github.com/yanatan16/clj-kubernetes-api](https://github.com/yanatan16/clj-kubernetes-api) |
| Go                   | [github.com/ericchiang/k8s](https://github.com/ericchiang/k8s) |
| Java (OSGi)          | [bitbucket.org/amdatulabs/amdatu-kubernetes](https://bitbucket.org/amdatulabs/amdatu-kubernetes) |
| Java (Fabric8, OSGi) | [github.com/fabric8io/kubernetes-client](https://github.com/fabric8io/kubernetes-client) |
| Lisp                 | [github.com/brendandburns/cl-k8s](https://github.com/brendandburns/cl-k8s) |
| Node.js (TypeScript) | [github.com/Goyoo/node-k8s-client](https://github.com/Goyoo/node-k8s-client) |
| Node.js              | [github.com/tenxcloud/node-kubernetes-client](https://github.com/tenxcloud/node-kubernetes-client) |
| Node.js              | [github.com/godaddy/kubernetes-client](https://github.com/godaddy/kubernetes-client) |
| Perl                 | [metacpan.org/pod/Net::Kubernetes](https://metacpan.org/pod/Net::Kubernetes) |
| PHP                  | [github.com/devstub/kubernetes-api-php-client](https://github.com/devstub/kubernetes-api-php-client) |
| PHP                  | [github.com/maclof/kubernetes-client](https://github.com/maclof/kubernetes-client) |
| Python               | [github.com/eldarion-gondor/pykube](https://github.com/eldarion-gondor/pykube) |
| Python               | [github.com/mnubo/kubernetes-py](https://github.com/mnubo/kubernetes-py) |
| Ruby                 | [github.com/Ch00k/kuber](https://github.com/Ch00k/kuber) |
| Ruby                 | [github.com/abonas/kubeclient](https://github.com/abonas/kubeclient) |
| Scala                | [github.com/doriordan/skuber](https://github.com/doriordan/skuber) |
| dotNet               | [https://github.com/tonnyeremin/kubernetes_gen](https://github.com/tonnyeremin/kubernetes_gen)
-->
| 语言                 | 客户端库                                 |
| -------------------- | ---------------------------------------- |
| Clojure              | [github.com/yanatan16/clj-kubernetes-api](https://github.com/yanatan16/clj-kubernetes-api) |
| Go                   | [github.com/ericchiang/k8s](https://github.com/ericchiang/k8s) |
| Java (OSGi)          | [bitbucket.org/amdatulabs/amdatu-kubernetes](https://bitbucket.org/amdatulabs/amdatu-kubernetes) |
| Java (Fabric8, OSGi) | [github.com/fabric8io/kubernetes-client](https://github.com/fabric8io/kubernetes-client) |
| Lisp                 | [github.com/brendandburns/cl-k8s](https://github.com/brendandburns/cl-k8s) |
| Node.js (TypeScript) | [github.com/Goyoo/node-k8s-client](https://github.com/Goyoo/node-k8s-client) |
| Node.js              | [github.com/tenxcloud/node-kubernetes-client](https://github.com/tenxcloud/node-kubernetes-client) |
| Node.js              | [github.com/godaddy/kubernetes-client](https://github.com/godaddy/kubernetes-client) |
| Perl                 | [metacpan.org/pod/Net::Kubernetes](https://metacpan.org/pod/Net::Kubernetes) |
| PHP                  | [github.com/devstub/kubernetes-api-php-client](https://github.com/devstub/kubernetes-api-php-client) |
| PHP                  | [github.com/maclof/kubernetes-client](https://github.com/maclof/kubernetes-client) |
| Python               | [github.com/eldarion-gondor/pykube](https://github.com/eldarion-gondor/pykube) |
| Python               | [github.com/mnubo/kubernetes-py](https://github.com/mnubo/kubernetes-py) |
| Ruby                 | [github.com/Ch00k/kuber](https://github.com/Ch00k/kuber) |
| Ruby                 | [github.com/abonas/kubeclient](https://github.com/abonas/kubeclient) |
| Scala                | [github.com/doriordan/skuber](https://github.com/doriordan/skuber) |
| dotNet               | [https://github.com/tonnyeremin/kubernetes_gen](https://github.com/tonnyeremin/kubernetes_gen)
{% endcapture %}

{% include templates/concept.md %}
