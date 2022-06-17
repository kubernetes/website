---
layout: blog
title: "使用 Java 開發一個 Kubernetes controller"
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
**作者:** Min Kim (螞蟻金服), Tony Ado (螞蟻金服)
<!--
The official [Kubernetes Java SDK](https://github.com/kubernetes-client/java) project
recently released their latest work on providing the Java Kubernetes developers
a handy Kubernetes controller-builder SDK which is helpful for easily developing
advanced workloads or systems.  
-->
[Kubernetes Java SDK](https://github.com/kubernetes-client/java) 官方專案最近釋出了他們的最新工作，為 Java Kubernetes 開發人員提供一個便捷的 Kubernetes 控制器-構建器 SDK，它有助於輕鬆開發高階工作負載或系統。
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

## 綜述 

Java 無疑是世界上最流行的程式語言之一，但由於社群中缺少庫資源，一段時間以來，那些非 Golang 開發人員很難構建他們定製的 controller/operator。在 Golang 的世界裡，已經有一些很好的 controller 框架了，例如，[controller runtime](https://github.com/kubernetes-sigs/controller-runtime)，[operator SDK](https://github.com/operator-framework/operator-sdk)。這些現有的 Golang 框架依賴於 [Kubernetes Golang SDK](https://github.com/kubernetes/client-go) 提供的各種實用工具，這些工具經過多年證明是穩定的。受進一步整合到 Kubernetes 平臺的需求驅動，我們不僅將 Golang SDK 中的許多基本工具移植到 kubernetes Java SDK 中，包括 informers、work-queues、leader-elections 等，也開發了一個控制器構建 SDK，它可以將所有東西連線到一個可執行的控制器中，而不會產生任何問題。

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

為什麼要使用 Java 實現 kubernetes 工具？選擇 Java 的原因可能是：
- __整合遺留的企業級 Java 系統__：許多公司的遺留系統或框架都是用 Java 編寫的，用以支援穩定性。我們不能輕易把所有東西搬到 Golang。

- __更多開源社群的資源__：Java 是成熟的，並且在過去幾十年中累計了豐富的開源庫，儘管 Golang 對於開發人員來說越來越具有吸引力，越來越流行。此外，現在開發人員能夠在 SQL 儲存上開發他們的聚合-apiserver，而 Java 在 SQL 上有更好的支援。

<!--
## How to use?

Take maven project as example, adding the following dependencies into your dependencies:
-->
## 如何去使用
以 maven 專案為例，將以下依賴項新增到您的依賴中：
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
然後我們可以使用提供的生成器庫來編寫自己的控制器。例如，下面是一個簡單的控制，它打印出關於監視通知的節點資訊，
在[此處](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-13/src/main/java/io/kubernetes/client/examples/ControllerExample.java)
檢視完整的例子：
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
如果您留意，新的 Java 控制器框架很多地方借鑑於 [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime) 的設計，它成功地將控制器內部的複雜元件封裝到幾個乾淨的介面中。在 Java 泛型的幫助下，我們甚至更進一步，以更好的方式簡化了封裝。

<!--
As for more advanced usage, we can wrap multiple controllers into a controller-manager
or a leader-electing controller which helps deploying in HA setup. In a word, we can
basically find most of the equivalence implementations here from Golang SDK and
more advanced features are under active development by us.
-->
我們可以將多個控制器封裝到一個 controller-manager 或 leader-electing controller 中，這有助於在 HA 設定中進行部署。

<!--
## Future steps

The community behind the official Kubernetes Java SDK project will be focusing on
providing more useful utilities for developers who hope to program cloud native
Java applications to extend Kubernetes. If you are interested in more details,
please look at our repo [kubernetes-client/java](https://github.com/kubernetes-client/java).
Feel free to share also your feedback with us, through Issues or [Slack](http://kubernetes.slack.com/messages/kubernetes-client/).
-->
## 未來計劃 

Kubernetes Java SDK 專案背後的社群將專注於為希望編寫雲原生 Java 應用程式來擴充套件 Kubernetes 的開發人員提供更有用的實用程式。如果您對更詳細的資訊感興趣，請檢視我們的倉庫 [kubernetes-client/java](https://github.com/kubernetes-client/java)。請透過問題或 [Slack](http://kubernetes.slack.com/messages/kubernetes-client/) 與我們分享您的反饋。

