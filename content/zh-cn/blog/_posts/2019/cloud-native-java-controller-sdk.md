---
layout: blog
title: "使用 Java 开发一个 Kubernetes controller"
date: 2019-11-26
slug: Develop-A-Kubernetes-Controller-in-Java
---
<!--
---
layout: blog
title: "Develop a Kubernetes controller in Java"
date: 2019-11-26
slug: Develop-A-Kubernetes-Controller-in-Java
---
-->

<!--
**Authors:** Min Kim (Ant Financial), Tony Ado (Ant Financial)
-->
**作者:** Min Kim (蚂蚁金服), Tony Ado (蚂蚁金服)
<!--
The official [Kubernetes Java SDK](https://github.com/kubernetes-client/java) project
recently released their latest work on providing the Java Kubernetes developers
a handy Kubernetes controller-builder SDK which is helpful for easily developing
advanced workloads or systems.  
-->
[Kubernetes Java SDK](https://github.com/kubernetes-client/java) 官方项目最近发布了他们的最新工作，为 Java Kubernetes 开发人员提供一个便捷的 Kubernetes 控制器-构建器 SDK，它有助于轻松开发高级工作负载或系统。
<!--
## Overall

Java is no doubt one of the most popular programming languages in the world but
it's been difficult for a period time for those non-Golang developers to build up
their customized controller/operator due to the lack of library resources in the 
community. In the world of Golang, there're already some excellent controller
frameworks, for example, [controller runtime](https://github.com/kubernetes-sigs/controller-runtime),
[operator SDK](https://github.com/operator-framework/operator-sdk). These
existing Golang frameworks are relying on the various utilities from the
[Kubernetes Golang SDK](https://github.com/kubernetes/client-go) proven to
be stable over years. Driven by the emerging need of further integration into
the platform of Kubernetes, we not only ported many essential toolings from the Golang
SDK into the kubernetes Java SDK including informers, work-queues, leader-elections,
etc. but also developed a controller-builder SDK which wires up everything into
a runnable controller without hiccups.
-->

## 综述 

Java 无疑是世界上最流行的编程语言之一，但由于社区中缺少库资源，一段时间以来，那些非 Golang 开发人员很难构建他们定制的 controller/operator。在 Golang 的世界里，已经有一些很好的 controller 框架了，例如，[controller runtime](https://github.com/kubernetes-sigs/controller-runtime)，[operator SDK](https://github.com/operator-framework/operator-sdk)。这些现有的 Golang 框架依赖于 [Kubernetes Golang SDK](https://github.com/kubernetes/client-go) 提供的各种实用工具，这些工具经过多年证明是稳定的。受进一步集成到 Kubernetes 平台的需求驱动，我们不仅将 Golang SDK 中的许多基本工具移植到 kubernetes Java SDK 中，包括 informers、work-queues、leader-elections 等，也开发了一个控制器构建 SDK，它可以将所有东西连接到一个可运行的控制器中，而不会产生任何问题。

<!--
## Backgrounds

Why use Java to implement Kubernetes tooling? You might pick Java for:

- __Integrating legacy enterprise Java systems__: Many companies have their legacy
systems or frameworks written in Java in favor of stability. We are not able to
move everything to Golang easily.

- __More open-source community resources__: Java is mature and has accumulated abundant open-source
libraries over decades, even though Golang is getting more and more fancy and
popular for developers. Additionally, nowadays developers are able to develop
their aggregated-apiservers over SQL-storage and Java has way better support on SQLs.
-->
## 背景 

为什么要使用 Java 实现 kubernetes 工具？选择 Java 的原因可能是：
- __集成遗留的企业级 Java 系统__：许多公司的遗留系统或框架都是用 Java 编写的，用以支持稳定性。我们不能轻易把所有东西搬到 Golang。

- __更多开源社区的资源__：Java 是成熟的，并且在过去几十年中累计了丰富的开源库，尽管 Golang 对于开发人员来说越来越具有吸引力，越来越流行。此外，现在开发人员能够在 SQL 存储上开发他们的聚合-apiserver，而 Java 在 SQL 上有更好的支持。

<!--
## How to use?

Take maven project as example, adding the following dependencies into your dependencies:
-->
## 如何去使用
以 maven 项目为例，将以下依赖项添加到您的依赖中：
```xml
<dependency>
    <groupId>io.kubernetes</groupId>
    <artifactId>client-java-extended</artifactId>
    <version>6.0.1</version>
</dependency>
```
<!--
Then we can make use of the provided builder libraries to write your own controller.
For example, the following one is a simple controller prints out node information
on watch notification, see complete example [here](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-13/src/main/java/io/kubernetes/client/examples/ControllerExample.java):
-->
然后我们可以使用提供的生成器库来编写自己的控制器。例如，下面是一个简单的控制，它打印出关于监视通知的节点信息，
在[此处](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-13/src/main/java/io/kubernetes/client/examples/ControllerExample.java)
查看完整的例子：
```java
...
    Reconciler reconciler = new Reconciler() {
      @Override
      public Result reconcile(Request request) {
        V1Node node = nodeLister.get(request.getName());
        System.out.println("triggered reconciling " + node.getMetadata().getName());
        return new Result(false);
      }
    };
    Controller controller =
        ControllerBuilder.defaultBuilder(informerFactory)
            .watch(
                (workQueue) -> ControllerBuilder.controllerWatchBuilder(V1Node.class, workQueue).build())
            .withReconciler(nodeReconciler) // required, set the actual reconciler
            .withName("node-printing-controller") // optional, set name for controller for logging, thread-tracing
            .withWorkerCount(4) // optional, set worker thread count
            .withReadyFunc( nodeInformer::hasSynced) // optional, only starts controller when the cache has synced up
            .build();
```
<!--
If you notice, the new Java controller framework learnt a lot from the design of
[controller-runtime](https://github.com/kubernetes-sigs/controller-runtime) which
successfully encapsulates the complex components inside controller into several
clean interfaces. With the help of Java Generics, we even move on a bit and simply
the encapsulation in a better way.
-->
如果您留意，新的 Java 控制器框架很多地方借鉴于 [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime) 的设计，它成功地将控制器内部的复杂组件封装到几个干净的接口中。在 Java 泛型的帮助下，我们甚至更进一步，以更好的方式简化了封装。

<!--
As for more advanced usage, we can wrap multiple controllers into a controller-manager
or a leader-electing controller which helps deploying in HA setup. In a word, we can
basically find most of the equivalence implementations here from Golang SDK and
more advanced features are under active development by us.
-->
我们可以将多个控制器封装到一个 controller-manager 或 leader-electing controller 中，这有助于在 HA 设置中进行部署。

<!--
## Future steps

The community behind the official Kubernetes Java SDK project will be focusing on
providing more useful utilities for developers who hope to program cloud native
Java applications to extend Kubernetes. If you are interested in more details,
please look at our repo [kubernetes-client/java](https://github.com/kubernetes-client/java).
Feel free to share also your feedback with us, through Issues or [Slack](http://kubernetes.slack.com/messages/kubernetes-client/).
-->
## 未来计划 

Kubernetes Java SDK 项目背后的社区将专注于为希望编写云原生 Java 应用程序来扩展 Kubernetes 的开发人员提供更有用的实用程序。如果您对更详细的信息感兴趣，请查看我们的仓库 [kubernetes-client/java](https://github.com/kubernetes-client/java)。请通过问题或 [Slack](http://kubernetes.slack.com/messages/kubernetes-client/) 与我们分享您的反馈。

