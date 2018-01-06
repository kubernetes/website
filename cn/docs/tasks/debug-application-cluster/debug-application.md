---
title: 应用故障排查
---

本指南帮助用户来调试kubernetes上那些没有正常运行的应用。
本指南*不能*调试集群。如果想调试集群的话，请参阅[这里](/docs/admin/cluster-troubleshooting)。

* TOC
{:toc}

## 诊断问题

故障排查的第一步是先给问题分下类。这个问题是什么？Pods，Replication Controller或者Service？

   * [Debugging Pods](#debugging-pods)
   * [Debugging Replication Controllers](#debugging-replication-controllers)
   * [Debugging Services](#debugging-services)

### Debugging Pods

调试pod的第一步是看一下这个pod的信息，用如下命令查看一下pod的当前状态和最近的事件：

```shell
$ kubectl describe pods ${POD_NAME}
```

查看一下pod中的容器所处的状态。这些容器的状态都是`Running`吗？最近有没有重启过？

后面的调试都是要依靠pods的状态的。

#### pod停留在pending状态

如果一个pod卡在`Pending`状态，则表示这个pod没有被调度到一个节点上。通常这是因为资源不足引起的。  
敲一下`kubectl describe ...`这个命令，输出的信息里面应该有显示为什么没被调度的原因。  
常见原因如下：

* **资源不足**:  
你可能耗尽了集群上所有的CPU和内存，此时，你需要删除pods，调整资源请求，或者增加节点。
更多信息请参阅[Compute Resources document](/docs/user-guide/compute-resources/#my-pods-are-pending-with-event-message-failedscheduling)

* **使用了`hostPort`**:
如果绑定一个pod到`hostPort`，那么能创建的pod个数就有限了。  
多数情况下，`hostPort`是非必要的，而应该采用服务来暴露pod。  
如果确实需要使用`hostPort`，那么能创建的pod的数量就是节点的个数。


#### pod停留在waiting状态

如果一个pod卡在`Waiting`状态，则表示这个pod已经调试到节点上，但是没有运行起来。  
再次敲一下`kubectl describe ...`这个命令来查看相关信息。  
最常见的原因是拉取镜像失败。可以通过以下三种方式来检查：

* 使用的镜像名字正确吗？
* 镜像仓库里有没有这个镜像？
* 用`docker pull <image>`命令手动拉下镜像试试。

#### pod处于crashing状态或者unhealthy

首先，看一下容器的log:

```shell
$ kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

如果容器是crashed的，用如下命令可以看到crash的log:

```shell
$ kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

或者，用`exec`在容器内运行一些命令：

```shell
$ kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

注意：当一个pod内只有一个容器时，可以不带参数`-c ${CONTAINER_NAME}`。

例如，名为Cassandra的pod，处于running态，要查看它的log，可运行如下命令：

```shell
$ kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

如果以上方法都不起作用，找到这个pod所在的节点并用SSH登录进去做进一步的分析。  
通常情况下，是不需要在Kubernetes API中再给出另外的工具的。  
因此，如果你发现需要ssh进一个主机来分析问题时，请在GitHub上提一个特性请求，描述一个你的场景并说明为什么已经提供的工具不能满足需求。


#### pod处于running态，但是没有正常工作

如果创建的pod不符合预期，那么创建pod的描述文件应该是存在某种错误的，并且这个错误在创建pod时被忽略掉。  
通常pod的定义中，章节被错误的嵌套，或者一个字段名字被写错，都可能会引起被忽略掉。  
例如，希望在pod中用命令行执行某个命令，但是将`command`写成`commnd`，pod虽然可以创建，但命令并没有执行。  

如何查出来哪里出错？  
首先，删掉这个pod再重新创建一个，重创时，像下面这样带着`--validate`这个参数：  
`kubectl create --validate -f mypod.yaml`，`command`写成`commnd`的拼写错误就会打印出来了。  

```shell
I0805 10:43:25.129850   46757 schema.go:126] unknown field: commnd
I0805 10:43:25.129973   46757 schema.go:129] this may be a false alarm, see https://github.com/kubernetes/kubernetes/issues/6842
pods/mypod
```

<!-- TODO: Now that #11914 is merged, this advice may need to be updated -->

如果上面方法没有看到相关异常的信息，那么接下来就要验证从apiserver获取到的pod是否与期望的一致，比如创建Pod的yaml文件是mypod.yaml。  

运行如下命令来获取apiserver创建的pod信息并保存成一个文件：  
`kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml`。

然后手动对这两个文件进行比较:  
apiserver获得的yaml文件中的一些行，不在创建pod的yaml文件内，这是正常的。  
如果创建Pod的yaml文件内的一些行，在piserver获得的yaml文件中不存在，可以说明创建pod的yaml中的定义有问题。


### Debugging Replication Controllers

RC相当简单。他们要么能创建pod，要么不能。如果不能创建pod，请参阅上述[Debugging Pods](#debugging-pods)。

也可以使用`kubectl describe rc ${CONTROLLER_NAME}`命令来监视RC相关的事件。

### Debugging Services

服务提供了多个Pod之间的负载均衡功能。  
有一些常见的问题可以造成服务无法正常工作。以下说明将有助于调试服务的问题。

首先，验证服务是否有端点。对于每一个Service对像，apiserver使`endpoints`资源可用。

通过如下命令可以查看endpoints资源：

```shell
$ kubectl get endpoints ${SERVICE_NAME}
```

确保endpoints与服务内容器个数一致。  
例如，如果你创建了一个nginx服务，它有3个副本，那么你就会在这个服务的endpoints中看到3个不同的IP地址。

#### 服务缺少endpoints

如果缺少endpoints，请尝试使用服务的labels列出所有的pod。  
假如有一个服务，有如下的label：

```yaml
...
spec:
  - selector:
     name: nginx
     type: frontend
```

你可以使用如下命令列出与selector相匹配的pod，并验证这些pod是否归属于创建的服务：

```shell
$ kubectl get pods --selector=name=nginx,type=frontend
```

如果pod列表附合预期，但是endpoints仍然为空，那么可能没有暴露出正确的端口。  
如果服务指定了`containerPort`，但是列表中的Pod没有列出该端口，则不会将其添加到端口列表。

验证该pod的`containerPort`与服务的`containerPort`是否匹配。

#### 网络业务不工作

如果可以连接到服务上，但是连接立即被断开了，并且在endpoints列表中有endpoints，可能是代理和pods之间不通。

确认以下3件事情：

   * Pods工作是否正常？ 看一下重启计数，并参阅[Debugging Pods](#debugging-pods)；
   * 可以直接连接到pod上吗？获取pod的IP地址，然后尝试直接连接到该IP上；
   * 应用是否在配置的端口上进行服务？Kubernetes不进行端口重映射，所以如果应用在8080端口上服务，那么`containerPort`字段就需要设定为8080。

#### 更多信息

如果上述都不能解决你的问题，请按照[Debugging Service document](/docs/user-guide/debugging-services)中的介绍来确保你的`Service`处于running态，有`Endpoints`，`Pods`真正的在服务；你有DNS在工作，安装了iptables规则，kube-proxy也没有异常行为。

你也可以访问[troubleshooting document](/docs/troubleshooting/)来获取更多信息。
