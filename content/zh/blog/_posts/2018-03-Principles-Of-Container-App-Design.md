---
title: "Principles of Container-based Application Design"
date: 2018-03-15
slug: principles-of-container-app-design
url: /blog/2018/03/Principles-Of-Container-App-Design
---

<!-- It's possible nowadays to put almost any application in a container and run it. Creating cloud-native applications, however—containerized applications that are automated and orchestrated effectively by a cloud-native platform such as Kubernetes—requires additional effort. Cloud-native applications anticipate failure; they run and scale reliably even when their infrastructure experiences outages. To offer such capabilities, cloud-native platforms like Kubernetes impose a set of contracts and constraints on applications. These contracts ensure that applications they run conform to certain constraints and allow the platform to automate application management. -->

现如今，几乎所有的的应用程序都可以在容器中运行。但创建云原生应用，通过诸如 Kubernetes 的云原生平台更有效地自动化运行、管理容器化的应用却需要额外的工作。
云原生应用需要考虑故障；即使是在底层架构发生故障时也需要可靠地运行。
为了提供这样的功能，像 Kubernetes 这样的云原生平台需要向运行的应用程序强加一些契约和约束。
这些契约确保应用可以在符合某些约束的条件下运行，从而使得平台可以自动化应用管理。

<!-- I've outlined [seven principles][1]for containerized applications to follow in order to be fully cloud-native. -->

我已经为容器化应用如何之为云原生应用概括出了[七项原则][1]。

| ----- |
| ![][2]  |
| Container Design Principles |


<!-- These seven principles cover both build time and runtime concerns. -->

这里所述的七项原则涉及到构建时和运行时，两类关注点。

<!-- ####  Build time -->
#### 构建时

<!-- * **Single Concern:** Each container addresses a single concern and does it well.
* **Self-Containment:** A container relies only on the presence of the Linux kernel. Additional libraries are added when the container is built.
* **Image Immutability:** Containerized applications are meant to be immutable, and once built are not expected to change between different environments. -->

* **单一关注点：** 每个容器只解决一个关注点，并且完成的很好。
* **自包含：** 一个容器只依赖Linux内核。额外的库要求可以在构建容器时加入。
* **镜像不变性：** 容器化的应用意味着不变性，一旦构建完成，不需要根据环境的不同而重新构建。

<!-- ####  Runtime -->
#### 运行时

<!-- * **High Observability:** Every container must implement all necessary APIs to help the platform observe and manage the application in the best way possible.
* **Lifecycle Conformance:** A container must have a way to read events coming from the platform and conform by reacting to those events.
* **Process Disposability:** Containerized applications must be as ephemeral as possible and ready to be replaced by another container instance at any point in time.
* **Runtime Confinement:** Every container must declare its resource requirements and restrict resource use to the requirements indicated. -->

* **高可观测性：** 每个容器必须实现所有必要的 API 来帮助平台以最好的方式来观测、管理应用。
* **生命周期一致性：** 一个容器必须要能从平台中获取事件信息，并作出相应的反应。
* **进程易处理性：** 容器化应用的寿命一定要尽可能的短暂，这样，可以随时被另一个容器所替换。
* **运行时限制：** 每个容器都必须要声明自己的资源需求，并将资源使用限制在所需要的范围之内。

<!-- The build time principles ensure that containers have the right granularity, consistency, and structure in place. The runtime principles dictate what functionalities must be implemented in order for containerized applications to possess cloud-native function. Adhering to these principles helps ensure that your applications are suitable for automation in Kubernetes. -->

编译时原则保证了容器拥有合适的粒度，一致性以及结构。运行时原则明确了容器化必须要实现那些功能才能成为云原生函数。遵循这些原则可以帮助你的应用适应 Kubernetes 上的自动化。

<!-- The white paper is freely available for download: -->

白皮书可以免费下载：

<!-- To read more about designing cloud-native applications for Kubernetes, check out my [Kubernetes Patterns][3] book. -->

想要了解更多关于如何面向 Kubernetes 设计云原生应用，可以看看我的 [Kubernetes 模式][3] 一书。

<!-- — [Bilgin Ibryam][4], Principal Architect, Red Hat -->

— [Bilgin Ibryam][4], 首席架构师, Red Hat

Twitter:  
Blog: [http://www.ofbizian.com][5]
Linkedin:

<!-- Bilgin Ibryam (@bibryam) is a principal architect at Red Hat, open source committer at ASF, blogger, author, and speaker. He is the author of Camel Design Patterns and Kubernetes Patterns books. In his day-to-day job, Bilgin enjoys mentoring, training and leading teams to be successful with distributed systems, microservices, containers, and cloud-native applications in general. -->

Bilgin Ibryam (@bibryam) 是 Red Hat 的一名首席架构师， ASF 的开源贡献者，博主，作者以及演讲者。
他是 Camel 设计模式、 Kubernetes 模式的作者。在他的日常生活中，他非常享受指导、培训以及帮助各个团队更加成功地使用分布式系统、微服务、容器，以及云原生应用。

[1]: https://www.redhat.com/en/resources/cloud-native-container-design-whitepaper
[2]: https://lh5.googleusercontent.com/1XqojkVC0CET1yKCJqZ3-0VWxJ3W8Q74zPLlqnn6eHSJsjHOiBTB7EGUX5o_BOKumgfkxVdgBeLyoyMfMIXwVm9p2QXkq_RRy2mDJG1qEExJDculYL5PciYcWfPAKxF2-DGIdiLw
[3]: http://leanpub.com/k8spatterns/
[4]: http://twitter.com/bibryam
[5]: http://www.ofbizian.com/
