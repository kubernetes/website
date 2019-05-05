---
title: 销毁
content_template: templates/task
---


<!-- ---
title: Decommissioning
content_template: templates/task
--- -->

{{% capture overview %}}
<!-- This page shows you how to properly decommission a cluster. -->
本页将展示如何销毁一个集群。
{{% /capture %}}


{{% capture prerequisites %}}
<!-- This page assumes you have a working Juju deployed cluster. -->
本页假设有一个使用 Juju 部署的、正在运行的集群。

{{< warning >}}
<!-- By the time you've reached this step you should have backed up your workloads and pertinent data; this section is for the complete destruction of a cluster. -->
当您到达这一步时，您应该已经对集群的相关内容进行了备份；这部分将彻底销毁一个集群。
{{< /warning >}}

{{% /capture %}}

{{% capture steps %}}
<!-- ## Destroy the Juju model -->
## 破坏 Juju 模型

<!-- It is recommended to deploy individual Kubernetes clusters in their own models, so that there is a clean separation between environments. To remove a cluster first find out which model it's in with `juju list-models`. The controller reserves an `admin` model for itself. If you have chosen to not name your model it might show up as `default`. -->

建议使用各自的模型来相应地部署 Kubernetes 集群，
以便各个环境之间能够界限分明。
如果想要删除一个集群，首先需要通过 `juju list-models` 命令找到其对应的模型。
控制器为其自身预留了 `admin` 这个模型。
如果没有命名模型，则模型名可能会显示为 `default`。

```
$ juju list-models
Controller: aws-us-east-2

Model       Cloud/Region   Status     Machines  Cores  Access  Last connection
controller  aws/us-east-2  available         1      2  admin   just now
my-kubernetes-cluster*    aws/us-east-2  available        12     22  admin   2 minutes ago
```

<!-- You can then destroy the model, which will in turn destroy the cluster inside of it: -->
销毁模型，模型内的集群也随之被销毁：

    juju destroy-model my-kubernetes-cluster

```
$ juju destroy-model my-kubernetes-cluster
WARNING! This command will destroy the "my-kubernetes-cluster" model.
This includes all machines, applications, data and other resources.

Continue [y/N]? y
Destroying model
Waiting on model to be removed, 12 machine(s), 10 application(s)...
Waiting on model to be removed, 12 machine(s), 9 application(s)...
Waiting on model to be removed, 12 machine(s), 8 application(s)...
Waiting on model to be removed, 12 machine(s), 7 application(s)...
Waiting on model to be removed, 12 machine(s)...
Waiting on model to be removed...
$
```

<!-- This will destroy and decommission all nodes. You can confirm all nodes are destroyed by running `juju status`. -->
这将会彻底破坏并销毁所有节点。
运行 `juju status` 命令可以确认所有节点是否已经被销毁。

<!-- If you're using a public cloud this will terminate the instances. If you're on bare metal using MAAS this will release the nodes, optionally wipe the disk, power off the machines, and return them to available pool of machines to deploy from. -->
如果使用的是公有云，命令将会终止所有的实例。
如果使用的是 MAAS 裸机，命令将会释放所有的节点，（可能）清空磁盘，关闭机器，
然后将节点资源返回到可用的机器池中。

<!-- ## Cleaning up the Controller -->
## 清理控制器

<!-- If you're not using the controller for anything else, you will also need to remove the controller instance: -->
如果控制器没有其它的用途，还需要删除控制器实例：

```
$ juju list-controllers
Use --refresh flag with this command to see the latest information.

Controller      Model  User   Access     Cloud/Region   Models  Machines    HA  Version
aws-us-east-2*  -      admin  superuser  aws/us-east-2       2         1  none  2.0.1

$ juju destroy-controller aws-us-east-2
WARNING! This command will destroy the "aws-us-east-2" controller.
This includes all machines, applications, data and other resources.

Continue? (y/N):y
Destroying controller
Waiting for hosted model resources to be reclaimed
All hosted models reclaimed, cleaning up controller machines
$
```
{{% /capture %}}
