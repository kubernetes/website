---
<!-- title: " Using Kubernetes Namespaces to Manage Environments "
 -->
title: " 使用Kubernetes命名空间管理环境 "
date: 2015-08-28
slug: using-kubernetes-namespaces-to-manage
url: /blog/2015/08/Using-Kubernetes-Namespaces-To-Manage
---
<!-- #####  One of the advantages that Kubernetes provides is the ability to manage various environments easier and better than traditional deployment strategies. For most nontrivial applications, you have test, staging, and production environments. You can spin up a separate cluster of resources, such as VMs, with the same configuration in staging and production, but that can be costly and managing the differences between the environments can be difficult. -->
##### Kubernetes提供的优势之一是能够比传统的部署策略更轻松，更好地管理各种环境。对于大多数重要的应用程序，您有测试，预发和生产环境。您可以在预发和生产中使用相同的配置启动单独的资源集群（例如VM），但这可能成本很高，并且管理环境之间的差异可能很困难。

<!-- #####  Kubernetes includes a cool feature called [namespaces][4], which enable you to manage different environments within the same cluster. For example, you can have different test and staging environments in the same cluster of machines, potentially saving resources. You can also run different types of server, batch, or other jobs in the same cluster without worrying about them affecting each other. -->
#####  kubernetes包含了一个被称作[namespace]很酷的功能。它使您能够管理同一群集中的不同环境。例如，您可以在同一台计算机集群中具有不同的测试和预发环境，从而可能节省资源。您还可以在同一群集中运行不同类型的服务器，批处理或其他作业，而无需担心它们相互影响。



<!-- ### The Default Namespace -->
### 默认命名空间

<!-- Specifying the namespace is optional in Kubernetes because by default Kubernetes uses the "default" namespace. If you've just created a cluster, you can check that the default namespace exists using this command: -->
命名空间是可选，默认情况下使用defalut。如果你创建了一个集群，你可以通过以下命令检查默认的命名空间是否存在:
```
$ kubectl get namespaces
NAME          LABELS    STATUS
default                  Active
kube-system              Active
```

<!-- Here you can see that the default namespace exists and is active. The status of the namespace is used later when turning down and deleting the namespace. -->
在这里，您可以看到默认命名空间存在且处于活动状态。稍后在关闭和删除命名空间时将使用命名空间的状态。

<!-- ####  Creating a New Namespace -->
####  创建新的命名空间

<!-- You create a namespace in the same way you would any other resource. Create a my-namespace.yaml file and add these contents: -->
您可以像创建任何其他资源一样创建命名空间。创建my-namespace.yaml文件并添加以下内容：

```
kind: Namespace
apiVersion: v1
metadata:
 name: my-namespace
 labels:
   name: my-namespace
```

<!-- Then you can run this command to create it: -->
执行以下命令创建:
```
$ kubectl create -f my-namespace.yaml
```
<!-- ####  Service Names -->
####  服务名称

<!-- With namespaces you can have your apps point to static service endpoints that don't change based on the environment. For instance, your MySQL database service could be named mysql in production and staging even though it runs on the same infrastructure. -->
使用命名空间，您可以让应用程序指向不随环境变化而更改的静态服务端点。例如，您的MySQL数据库服务可以在生产和预发中命名为MySQL，即使它运行在相同的基础设施上。

<!-- This works because each of the resources in the cluster will by default only "see" the other resources in the same namespace. This means that you can avoid naming collisions by creating pods, services, and replication controllers with the same names provided they are in separate namespaces. Within a namespace, short DNS names of services resolve to the IP of the service within that namespace. So for example, you might have an Elasticsearch service that can be accessed via the DNS name elasticsearch as long as the containers accessing it are located in the same namespace. -->
这是因为集群中的每个资源默认情况下只“查看”相同命名空间中的其他资源。这意味着，如果在单独的命名空间中创建具有相同名称的pod、服务和replicationControllers，就可以避免命名冲突。在命名空间中，服务的短DNS名称解析为该命名空间中的服务的IP。例如，您可能有一个Elasticsearch服务，只要访问它的容器位于相同的名称空间中，就可以通过DNS名称Elasticsearch访问它。

<!-- You can still access services in other namespaces by looking it up via the full DNS name which takes the form of SERVICE-NAME.NAMESPACE-NAME. So for example, elasticsearch.prod or elasticsearch.canary for the production and canary environments respectively. -->
您仍然可以通过使用SERVICE-NAME.NAMESPACE-NAME形式的完整DNS名称来访问其他命名空间中的服务。例如，elasticsearch.prod或者elasticsearch.canary分别用于生产和金丝雀环境。

<!-- ####  An Example -->
####  例子

<!-- Lets look at an example application. Let’s say you want to deploy your music store service MyTunes in Kubernetes. You can run the application production and staging environment as well as some one-off apps running in the same cluster. You can get a better idea of what’s going on by running some commands: -->
让我们看一个应用的示例。假如你想在kubernetes中部署音乐存储服务myTunes。你可以将应用部署到预发环境和生产环境在同一个集群中。为了更好的理解，继续以下命令:


```
~$ kubectl get namespaces
NAME                    LABELS    STATUS
default                     Active
mytunes-prod                Active
mytunes-staging             Active
my-other-app                Active
```

<!-- Here you can see a few namespaces running. Next let’s list the services in staging: -->
在这里你能看到存在的命名空间。接下来，让我们列出预发环境下的服务:

```
~$ kubectl get services --namespace=mytunes-staging
NAME          LABELS                    SELECTOR        IP(S)             PORT(S)
mytunes       name=mytunes,version=1    name=mytunes    10.43.250.14      80/TCP
                                                        104.185.824.125
mysql         name=mysql                name=mysql      10.43.250.63      3306/TCP
```
<!-- Next check production: -->
列出生产环境的服务:
```
~$ kubectl get services --namespace=mytunes-prod
NAME          LABELS                    SELECTOR        IP(S)             PORT(S)
mytunes       name=mytunes,version=1    name=mytunes    10.43.241.145     80/TCP
                                                        104.199.132.213
mysql         name=mysql                name=mysql      10.43.245.77      3306/TCP
```
<!-- Notice that the IP addresses are different depending on which namespace is used even though the names of the services themselves are the same. This capability makes configuring your app extremely easy—since you only have to point your app at the service name—and has the potential to allow you to configure your app exactly the same in your staging or test environments as you do in production. -->
注意，IP地址是不同的，这取决于使用的命名空间，即使服务本身的名称是相同的。这种功能使配置应用程序变得非常容易，因为您只需将应用程序指向服务名称，并且允许您在预发或测试环境中配置应用程序与在生产环境中配置应用程序完全相同。

<!-- ####  Caveats -->
####  注意事项

<!-- While you can run staging and production environments in the same cluster and save resources and money by doing so, you will need to be careful to set up resource limits so that your staging environment doesn't starve production for CPU, memory, or disk resources. Setting resource limits properly, and testing that they are working takes a lot of time and effort so unless you can measurably save money by running production in the same cluster as staging or test, you may not really want to do that. -->
虽然您可以在同一个集群中运行预发和生产环境，并通过这样做节省资源和金钱，但是您需要小心设置资源限制，以便预发环境不会侵占生产环境的CPU、内存或磁盘资源。正确地设置资源限制，并且测试它们是否正常工作需要花费大量的时间和精力，因此，除非您可以通过在预发或测试时在相同的集群中运行生产来节省成本，否则您可能不会真的想这样做。

<!-- Whether or not you run staging and production in the same cluster, namespaces are a great way to partition different apps within the same cluster. Namespaces will also serve as a level where you can apply resource limits so look for more resource management features at the namespace level in the future. -->
无论您是否在同一群集中运行预发和生产，命名空间都是在同一群集中对不同应用程序进行分区的好方法。命名空间还将作为对应用资源限制的级别，以便将来在命名空间级别查找更多资源管理功能。

\- Posted by Ian Lewis, Developer Advocate at Google
