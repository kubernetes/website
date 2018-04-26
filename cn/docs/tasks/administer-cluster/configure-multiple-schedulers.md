<!--
---
assignees:
- davidopp
- madhusudancs
title: Configure Multiple Schedulers
redirect_from:
- "/docs/admin/multiple-schedulers/"
- "/docs/admin/multiple-schedulers.html"
- "/docs/tutorials/clusters/multiple-schedulers/"
- "/docs/tutorials/clusters/multiple-schedulers.html"
---
-->
---
assignees:
- davidopp
- madhusudancs
title: 配置多个调度器  
redirect_from:
- "/docs/admin/multiple-schedulers/"
- "/docs/admin/multiple-schedulers.html"
- "/docs/tutorials/clusters/multiple-schedulers/"
- "/docs/tutorials/clusters/multiple-schedulers.html"
---

<!--
Kubernetes ships with a default scheduler that is described [here](/docs/admin/kube-scheduler/).
If the default scheduler does not suit your needs you can implement your own scheduler.
Not just that, you can even run multiple schedulers simultaneously alongside the default
scheduler and instruct Kubernetes what scheduler to use for each of your pods. Let's
learn how to run multiple schedulers in Kubernetes with an example.

A detailed description of how to implement a scheduler is outside the scope of this
document. Please refer to the kube-scheduler implementation in
[plugin/pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/plugin/pkg/scheduler)
in the Kubernetes source directory for a canonical example.
-->
Kubernetes 配有一个默认的调度器，描述在[这里](/docs/admin/kube-scheduler/)。  
如果这个默认的调度器不符合你的需求你可以实现自己的调度器。  
不仅如此，你甚至可以同时运行多个调度器，并且指示Kubernetes为你的每个pod该使用什么调度器。  
让我们通过一个示例来了解一下在Kubernetes中如何运行多个调度器。  

如何实现一个调度器的详细说明不在本文的范围内，一个标准样例，请参考在Kubernetes源码文件夹[plugin/pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/plugin/pkg/scheduler)下kube-scheduler的实现。  

<!--
### 1. Package the scheduler

Package your scheduler binary into a container image. For the purposes of this example,
let's just use the default scheduler (kube-scheduler) as our second scheduler as well.
Clone the [Kubernetes source code from Github](https://github.com/kubernetes/kubernetes)
and build the source.
-->
### 1. 打包调度器

打包你的调度器二进制文件到一个容器镜像。为了示例的目的，让我们也仅使用默认的调度器（kube-scheduler）作为我们的第二个调度器。
从github上克隆[Kubernetes源码](https://github.com/kubernetes/kubernetes)，编译。  

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

<!--
Create a container image containing the kube-scheduler binary. Here is the `Dockerfile`
to build the image:
-->
创建一个包含调度器二进制文件的容器镜像。下面是`Dockerfile`来构建这个镜像。

```docker
FROM busybox
ADD ./_output/dockerized/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

<!--
Save the file as `Dockerfile`, build the image and push it to a registry. This example
pushes the image to
[Google Container Registry (GCR)](https://cloud.google.com/container-registry/).
For more details, please read the GCR
[documentation](https://cloud.google.com/container-registry/docs/).
-->
作为`Dokcerfile`保存该文件，构建镜像并把它推到仓库。该示例把镜像推到了[Google Container Registry (GCR)](https://cloud.google.com/container-registry/)。  
更多细节，请阅读[GCR文档](https://cloud.google.com/container-registry/docs/)。

```shell
docker build -t my-kube-scheduler:1.0 .
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0
```

<!--
### 2. Define a Kubernetes Deployment for the scheduler

Now that we have our scheduler in a container image, we can just create a pod
config for it and run it in our Kubernetes cluster. But instead of creating a pod
directly in the cluster, let's use a [Deployment](/docs/concepts/workloads/controllers/deployment/)
for this example. A [Deployment](/docs/concepts/workloads/controllers/deployment/) manages a
[Replica Set](/docs/concepts/workloads/controllers/replicaset/) which in turn manages the pods,
thereby making the scheduler resilient to failures. Here is the deployment
config. Save it as `my-scheduler.yaml`:

{% include code.html language="yaml" file="my-scheduler.yaml" ghlink="/docs/tutorials/clusters/my-scheduler.yaml" %}
-->
### 2. 为调度器定义一个Kubernetes Deployment
注意我们的调度器在一个容器镜像内， 我们只需为它创建一个pod配置并在我们的Kubernetes集群中运行它。  
但是对于这个示例，让我们使用一个[Deployment](/docs/concepts/workloads/controllers/deployment/)而不是在集群内直接创建一个pod。  
一个[Deployment](/docs/concepts/workloads/controllers/deployment/)管理一个[Replica Set](/docs/concepts/workloads/controllers/replicaset/)，反过来又管理这些pods,
从而使调度器适应故障。这里是部署配置，保存为`my-scheduler.yaml`文件：

<!--
An important thing to note here is that the name of the scheduler specified as an
argument to the scheduler command in the container spec should be unique. This is the name that is matched against the value of the optional `spec.schedulerName` on pods, to determine whether this scheduler is responsible for scheduling a particular pod.

Please see the
[kube-scheduler documentation](/docs/admin/kube-scheduler/) for
detailed description of other command line arguments.
-->
这里要注意一件重要的事情，在容器spec域的调度器命令行中指定的调度器名称应该是唯一的。  
这个名称匹配pods上可选的`spec.schedulerName`域的值，来决定该调度器是否负责调度特定的pod。  
关于其它命令行参数的详细描述请参考[kube-scheduler documentation](/docs/admin/kube-scheduler/)。

<!--
### 3. Run the second scheduler in the cluster

In order to run your scheduler in a Kubernetes cluster, just create the deployment
specified in the config above in a Kubernetes cluster:
-->
### 3. 在集群中运行第二个调度器

为了在Kubernetes集群中运行你的调度器，仅需要在Kubernetes集群的上述配置中创建指定的部署：
```shell
kubectl create -f my-scheduler.yaml
```

<!--
Verify that the scheduler pod is running:
-->
验证调度器的pod是否正在运行：

```shell
$ kubectl get pods --namespace=kube-system
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

<!--
You should see a "Running" my-scheduler pod, in addition to the default kube-scheduler
pod in this list.

To run multiple-scheduler with leader election enabled, you must do the following:

First, update the following fields in your YAML file:
-->
在此列表中除了默认的kube-scheduler pod之外，你应该还能看到一个"Running"状态的my-scheduler pod。  

要运行带有选举的多个调度器，你必须执行以下操作：

首先，在你的YAML文件中更新以下的域：

* `--leader-elect=true`
* `--lock-object-namespace=lock-object-namespace`
* `--lock-object-name=lock-object-name`

<!--
If RBAC is enabled on your cluster, you must update the `system:kube-scheduler` cluster role. Add you scheduler name to the resourceNames of the rule applied for endpoints resources, as in the following example:
-->
如果你的集群中开启了RBAC,你必须更新`system:kube-scheduler`集群角色。添加你的调度器名称到端点资源规则的resourceNames,如下面的例子所示：
  
$ kubectl edit clusterrole system:kube-scheduler
```yaml
- apiVersion: rbac.authorization.k8s.io/v1beta1
  kind: ClusterRole
  metadata:
    annotations:
      rbac.authorization.kubernetes.io/autoupdate: "true"
    labels:
      kubernetes.io/bootstrapping: rbac-defaults
    name: system:kube-scheduler
  rules:
  - apiGroups:
    - ""
    resourceNames:
    - kube-scheduler
    - my-scheduler
    resources:
    - endpoints
    verbs:
    - delete
    - get
    - patch
    - update
```

<!--
### 4. Specify schedulers for pods

Now that our second scheduler is running, let's create some pods, and direct them to be scheduled by either the default scheduler or the one we just deployed. In order to schedule a given pod using a specific scheduler, we specify the name of the
scheduler in that pod spec. Let's look at three examples.
-->
### 4. 为pods指定调度器

现在我们的第二个调度器正在运行，让我们创建一些pods，并指示它们是由默认的调度器还是由我们刚部署的调度器调度。  
为了使用指定调度器调度一个给定的pod, 我们在pod的spec域指定了该调度器的名称。让我们看一下这三个例子。

<!--
- Pod spec without any scheduler name

  {% include code.html language="yaml" file="pod1.yaml" ghlink="/docs/tutorials/clusters/pod1.yaml" %}

  When no scheduler name is supplied, the pod is automatically scheduled using the
  default-scheduler.

  Save this file as `pod1.yaml` and submit it to the Kubernetes cluster.
-->
- Pod spec域不指定任何调度器名字  
  
  当没有没有提供调度器名称时，将使用默认调度器。  
  
  保存为`pod1.yaml`文件，并提交给Kubernetes集群。    
  ```shell
  kubectl create -f pod1.yaml
  ```

<!--
- Pod spec with `default-scheduler`

  {% include code.html language="yaml" file="pod2.yaml" ghlink="/docs/tutorials/clusters/pod2.yaml" %}

  A scheduler is specified by supplying the scheduler name as a value to `spec.schedulerName`. In this case, we supply the name of the
  default scheduler which is `default-scheduler`.

  Save this file as `pod2.yaml` and submit it to the Kubernetes cluster.
-->
- Pod spec域含有默认调度器  
  
  通过提供调度器名称作为`spec.schedulerName`的值来指定一个调度器。在本示例，我们提供了默认调度器的值。  
  
  保存为`pod2.yaml`文件，并提交给Kubernetes集群。  
  
  ```shell
  kubectl create -f pod2.yaml
  ```

<!--
- Pod spec with `my-scheduler`

  {% include code.html language="yaml" file="pod3.yaml" ghlink="/docs/tutorials/clusters/pod3.yaml" %}

  In this case, we specify that this pod should be scheduled using the scheduler that we
  deployed - `my-scheduler`. Note that the value of `spec.schedulerName` should match the name supplied to the scheduler
  command as an argument in the deployment config for the scheduler.

  Save this file as `pod3.yaml` and submit it to the Kubernetes cluster.
-->
- Pod spec域是`my-scheduler`

  {% include code.html language="yaml" file="pod3.yaml" ghlink="/docs/tutorials/clusters/pod3.yaml" %}

  在本示例，我们指定这个pod使用我们部署的`my-scheduler`调度器调度。  
  注意这个`spec.schedulerName`的值应该与我们在部署调度器配置中调度器命令中的调度器名称相匹配。

```shell
kubectl create -f pod3.yaml
```

<!--
  Verify that all three pods are running.
-->
验证这三个pods是否正在运行。

```shell
kubectl get pods
```

<!--
### Verifying that the pods were scheduled using the desired schedulers

In order to make it easier to work through these examples, we did not verify that the
pods were actually scheduled using the desired schedulers. We can verify that by
changing the order of pod and deployment config submissions above. If we submit all the
pod configs to a Kubernetes cluster before submitting the scheduler deployment config,
we see that the pod `second-scheduler` remains in "Pending" state forever
while the other two pods get scheduled. Once we submit the scheduler deployment config
and our new scheduler starts running, the `second-scheduler` pod gets
scheduled as well.

Alternatively, one could just look at the "Scheduled" entries in the event logs to
verify that the pods were scheduled by the desired schedulers.
-->
### 验证所有的pods是否使用所期望的调度器调度

为了使这些例子更加容易理解，实际上我们并没有验证这些pods是否使用了所期望的调度器调度。  
我们可以通过改变上述的pod的顺序和提交配置部署来验证它。  
如果我们在提交调度器配置部署之前提交所有的pod配置给Kubernetes集群，
我们将会看到这个使用`second-scheduler`的pod一直停留在"Pending"状态，而另外两个pod已经被调度好了。
一旦我们提交了调度器配置部署并且我们的新调度器开始运行，这个使用`second-scheduler`的pod也将会被调度。

或者，可以在事件记录中查看"Schedulerd"记录来验证这些pods是否是被所期望的调度器调度的。

```shell
kubectl get events
```
