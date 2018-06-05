---
reviewers:
- erictune
title: Pod概览
content_template: templates/concept
---

{{% capture overview %}}
该页面提供了`Pod`的概述,最小的可部署对象Kubernetes对象模型。
{{% /capture %}}

{{< toc >}}

{{% capture body %}}
## 理解Pod

*Pod* 是Kubernetes的基本构建块——是创建或部署的Kubernetes对象模型中最小和最简单的单元。Pod表示集群上正在运行的一个进程。

Pod封装了应用程序容器(在某些情况下，是多个容器)、存储资源、唯一的网络IP，以及控制容器应该如何运行的选项。Pod表示一个部署单元： *Kubernetes中应用程序的单个实例* ，它可能由单个容器或几个紧密耦合并共享资源的容器组成。

{{< note >}}
[Docker](https://www.docker.com) 是Kubernetes Pod中最常见的容器运行时，但是Pod也支持其他容器运行时。
{{< /note >}}

Kubernetes集群中的Pod有两种主要用途：

* **运行单个容器的Pod**。“一个容器对应一个Pod”模型是最常见的Kubernetes的用例；在这种情况下，你可以将Pod看作是容器的包装器，而Kubernetes直接管理Pod而不是容器。
* **运行多个需要一起工作的Pod**。Pod可以封装由多个共存容器组成的应用程序，这些容器紧密耦合，需要共享资源。这些共同定位的容器可能形成一个统一的服务单元——一个容器从共享卷向公众提供文件，而一个单独的“sidecar”容器刷新或更新这些文件。Pod将这些容器和存储资源打包为单个可管理实体。

[Kubernetes博客](http://blog.kubernetes.io) 有一些关于Pod用例的附加信息。有关更多信息,请参见:

* [The Distributed System Toolkit: Patterns for Composite Containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html)
* [Container Design Patterns](http://blog.kubernetes.io/2016/06/container-design-patterns.html)

每个Pod都要运行给定应用程序的单个实例。如果想要横向扩展应用程序(例如，运行多个实例)，应该使用多个pod，每个实例一个。在Kubernetes中，这通常被称为 _副本_ 。复制的Pod通常是由一个称为控制器的抽象创建并作为一个组进行管理的。有关更多信息，请参见[Pods and Controllers](#pods-and-controllers)。

### Pod如何管理多个容器

Pod设计用于支持多个协作过程(作为容器)，这些过程形成了一个内聚的服务单元。Pod中的容器将自动地在集群中的同一物理或虚拟机上共同定位和调度。容器可以共享资源和依赖项，相互通信，并协调何时以及如何终止它们。

注意，在单个Pod中分组多个共同定位和共同管理的容器是一个相对高级的用例。您应该只在容器紧密耦合的特定实例中使用此模式。例如，您可能有一个容器作为共享卷中的文件的web服务器，以及一个单独的“sidecar”容器，该容器从远程源更新这些文件，如下图所示:

{{< figure src="/images/docs/pod.svg" title="pod diagram" width="50%" >}}

Pods为其组成容器提供两种共享资源： *网络* 和 *存储* 。

#### 网络

每个Pod都被分配一个唯一的IP地址。Pod中的每个容器都共享网络命名空间，包括IP地址和网络端口。 *Pod内的容器* 可以使用`localhost`进行通信。当Pod中的容器与 *Pod之外的容器* 通信时，它们必须协调如何使用共享网络资源(例如端口)。

#### 存储

Pod可以指定一组共享存储 *卷* 。Pod中的所有容器都可以访问共享卷，允许这些容器共享数据。卷还允许Pod中的持久性数据在需要重新启动的容器中存活。有关Kubernetes如何在Pod中实现共享存储的更多信息，请参见 [volume](/docs/concept/storage/volume/)。

## 与Pod工作

很少会直接在Kubernetes中创建单独的Pod—即使是单例的Pod。这是因为Pod被设计成相对短暂的、可丢弃的实体。当Pod被创建(直接由您创建，或间接由控制器创建)时，它将计划在集群中的节点上运行。直到进程终止，Pod对象被删除，Pod缺乏资源而被 *逐出* ，或者节点失败。

{{< note >}}
**注意：** 在Pod中重新启动一个容器，不应与重新启动Pod混淆。Pod本身不运行，但它是容器运行并持续到删除的环境。
{{< /note >}}

Pod本身不会自我修复。如果一个Pod被调度到一个失败的节点上，或者调度操作本身失败，则该Pod被删除;同样，由于缺乏资源或节点维护，一个Pod无法在被逐出时存活。Kubernetes使用了一个更高层次的抽象，称为 *Controller* ，它处理管理相对可丢弃的Pod实例的工作。因此，虽然可以直接使用Pod，但在Kubernetes中使用控制器管理您的Pod要常见得多。有关Kubernetes如何使用控制器实现Pod伸缩和修复的更多信息，请参见[Pods and Controllers](#pods-and-controllers)。

### Pods and Controllers

控制器可以为您创建和管理多个pod，处理复制和更新，并在集群范围内提供自修复功能。例如，如果一个节点失败，控制器可以通过调度不同节点上相同的替换来自动替换Pod。

包含一个或多个Pod的一些控制器示例包括:

* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)

通常，控制器使用您提供的Pod模板来创建它负责的Pod。

## Pod模板

Pod模板是包含在其他对象中的Pod规范，例如
[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/)。控制器使用Pod模板来创建实际Pod。
下面的示例是一个包含打印一条简单消息容器的Pod。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```

Pod模板不是指定所有副本的当前期望状态，而是类似于饼干模型切割刀。一旦饼干被切开，饼干就与切饼人没有关系。没有“量子纠缠”。对模板的后续更改，甚至切换到新的模板，对已经创建的pod没有直接影响。类似地，由复制控制器创建的pod可能随后被直接更新。这与pod形成了有意的对比，后者确实指定了属于pod的所有容器的当前期望状态。这种方法从根本上简化了系统语义，增加了原语的灵活性。

{{% /capture %}}

{{% capture whatsnext %}}
* 了解更多关于Pod的行为:
  * [Pod终止](/docs/concepts/workloads/pods/pod/#termination-of-pods)
  * 其他Pod话题
{{% /capture %}}


