---
title: "Example: Deploying Cassandra with Stateful Sets"
title: “示例：使用 Stateful Sets 部署 Cassandra”
---

<!--
## Table of Contents

  - [Prerequisites](#prerequisites)
  - [Cassandra Docker](#cassandra-docker)
  - [Quickstart](#quickstart)
  - [Step 1: Create a Cassandra Headless Service](#step-1-create-a-cassandra-headless-service)
  - [Step 2: Use a StatefulSet to create Cassandra Ring](#step-2-use-a-statefulset-to-create-cassandra-ring)
  - [Step 3: Validate and Modify The Cassandra StatefulSet](#step-3-validate-and-modify-the-cassandra-statefulset)
  - [Step 4: Delete Cassandra StatefulSet](#step-4-delete-cassandra-statefulset)
  - [Step 5: Use a Replication Controller to create Cassandra node pods](#step-5-use-a-replication-controller-to-create-cassandra-node-pods)
  - [Step 6: Scale up the Cassandra cluster](#step-6-scale-up-the-cassandra-cluster)
  - [Step 7: Delete the Replication Controller](#step-7-delete-the-replication-controller)
  - [Step 8: Use a DaemonSet instead of a Replication Controller](#step-8-use-a-daemonset-instead-of-a-replication-controller)
  - [Step 9: Resource Cleanup](#step-9-resource-cleanup)
  - [Seed Provider Source](#seed-provider-source)
-->
## 目录

  - [准备工作](#prerequisites)
  - [Cassandra docker 镜像](#cassandra-docker)
  - [快速入门](#quickstart)
  - [步骤1：创建 Cassandra Headless Service](#step-1-create-a-cassandra-headless-service)
  - [步骤2：使用 StatefulSet 创建 Cassandra Ring环](#step-2-use-a-statefulset-to-create-cassandra-ring)
  - [步骤3：验证并修改 Cassandra StatefulSet](#step-3-validate-and-modify-the-cassandra-statefulset)
  - [步骤4：删除 Cassandra StatefulSet](#step-4-delete-cassandra-statefulset)
  - [步骤5：使用 Replication Controller 创建 Cassandra 节点 pods](#step-5-use-a-replication-controller-to-create-cassandra-node-pods)
  - [步骤6：Cassandra 集群扩容](#step-6-scale-up-the-cassandra-cluster)
  - [步骤7：删除 Replication Controller](#step-7-delete-the-replication-controller)
  - [步骤8：使用 DaemonSet 替换 Replication Controller](#step-8-use-a-daemonset-instead-of-a-replication-controller)
  - [步骤9：资源清理](#step-9-resource-cleanup)
  - [Seed Provider Source](#seed-provider-source)


<!--
The following document describes the development of a _cloud native_
[Cassandra](http://cassandra.apache.org/) deployment on Kubernetes.  When we say
_cloud native_, we mean an application which understands that it is running
within a cluster manager, and uses this cluster management infrastructure to
help implement the application.  In particular, in this instance, a custom
Cassandra `SeedProvider` is used to enable Cassandra to dynamically discover
new Cassandra nodes as they join the cluster.
-->
下文描述了在 Kubernetes 上部署一个_云原生_ [Cassandra](http://cassandra.apache.org/) 的过程。当我们说_云原生_时，指的是一个应用能够理解它运行在一个集群管理器内部，并且使用这个集群的管理基础设施来帮助实现这个应用。特别的，本例使用了一个自定义的 Cassandra `SeedProvider` 帮助 Cassandra 发现新加入集群 Cassandra 节点。

<!--
This example also uses some of the core components of Kubernetes:
-->
本示例也使用了Kubernetes的一些核心组件：

- [_Pods_](/docs/user-guide/pods)
- [ _Services_](/docs/user-guide/services)
- [_Replication Controllers_](/docs/user-guide/replication-controller)
- [_Stateful Sets_](/docs/concepts/workloads/controllers/statefulset/)
- [_Daemon Sets_](/docs/admin/daemons)


<!--
## Prerequisites
-->
## 准备工作

<!--
This example assumes that you have a Kubernetes version >=1.2 cluster installed and running,
and that you have installed the [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
command line tool somewhere in your path.  Please see the
[getting started guides](https://kubernetes.io/docs/getting-started-guides/)
for installation instructions for your platform.
-->
本示例假设你已经安装运行了一个 Kubernetes集群（版本 >=1.2），并且还在某个路径下安装了  [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) 命令行工具。请查看 [getting started guides](https://kubernetes.io/docs/getting-started-guides/) 获取关于你的平台的安装说明。

<!--
This example also has a few code and configuration files needed.  To avoid
typing these out, you can `git clone` the Kubernetes repository to your local
computer.
-->
本示例还需要一些代码和配置文件。为了避免手动输入，你可以 `git clone` Kubernetes 源到你本地。

<!--
## Cassandra Docker
-->
## Cassandra Docker镜像

<!--
The pods use the [```gcr.io/google-samples/cassandra:v12```](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile)
image from Google's [container registry](https://cloud.google.com/container-registry/docs/).
The docker is based on `debian:jessie` and includes OpenJDK 8. This image
includes a standard Cassandra installation from the Apache Debian repo.  Through the use of environment variables you are able to change values that are inserted into the `cassandra.yaml`.
-->
Pods 使用来自  Google 的 [container registry](https://cloud.google.com/container-registry/docs/) 的  [```gcr.io/google-samples/cassandra:v12```](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile) 镜像。这个 docker 镜像基于 `debian:jessie` 并包含 OpenJDK 8。该镜像包含一个从  Apache Debian 源中安装的标准 Cassandra。你可以通过使用环境变量改变插入到 `cassandra.yaml` 文件中的参数值。

| ENV VAR                | DEFAULT VALUE  |
| ---------------------- | :------------: |
| CASSANDRA_CLUSTER_NAME | 'Test Cluster' |
| CASSANDRA_NUM_TOKENS   |       32       |
| CASSANDRA_RPC_ADDRESS  |    0.0.0.0     |

<!--
## Quickstart
-->
## 快速入门

<!--
If you want to jump straight to the commands we will run,
here are the steps:
-->
如果你希望直接跳到我们使用的命令，以下是全部步骤：

```sh
#
# StatefulSet
#

# clone the example repository
git clone https://github.com/kubernetes/examples
cd examples

# create a service to track all cassandra statefulset nodes
kubectl create -f cassandra/cassandra-service.yaml

# create a statefulset
kubectl create -f cassandra/cassandra-statefulset.yaml

# validate the Cassandra cluster. Substitute the name of one of your pods.
kubectl exec -ti cassandra-0 -- nodetool status

# cleanup
grace=$(kubectl get po cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
  && kubectl delete statefulset,po -l app=cassandra \
  && echo "Sleeping $grace" \
  && sleep $grace \
  && kubectl delete pvc -l app=cassandra

#
# Resource Controller Example
#

# create a replication controller to replicate cassandra nodes
kubectl create -f cassandra/cassandra-controller.yaml

# validate the Cassandra cluster. Substitute the name of one of your pods.
kubectl exec -ti cassandra-xxxxx -- nodetool status

# scale up the Cassandra cluster
kubectl scale rc cassandra --replicas=4

# delete the replication controller
kubectl delete rc cassandra

#
# Create a DaemonSet to place a cassandra node on each kubernetes node
#

kubectl create -f cassandra/cassandra-daemonset.yaml --validate=false

# resource cleanup
kubectl delete service -l app=cassandra
kubectl delete daemonset cassandra
```

<!--
## Step 1: Create a Cassandra Headless Service
-->
## 步骤1：创建 Cassandra Headless Service

<!--
A Kubernetes _[Service](/docs/user-guide/services)_ describes a set of
[_Pods_](/docs/user-guide/pods) that perform the same task. In
Kubernetes, the atomic unit of an application is a Pod: one or more containers
that _must_ be scheduled onto the same host.
-->
Kubernetes _[Service](/docs/user-guide/services)_ 描述一组执行同样任务的 [_Pods_](/docs/user-guide/pods)。在Kubernetes中，一个应用的原子调度单位是一个 Pod：一个或多个_必须_调度到相同主机上的容器。

<!--
The Service is used for DNS lookups between Cassandra Pods, and Cassandra clients
within the Kubernetes Cluster.
-->
这个 Service 用于在Kubernetes 集群内部进行 Cassandra 客户端和 Cassandra Pods之间的 DNS 查找。

<!--
Here is the service description:
-->
以下为这个 service 的描述：

<!-- BEGIN MUNGE: EXAMPLE cassandra-service.yaml -->

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: cassandra
  name: cassandra
spec:
  clusterIP: None
  ports:
    - port: 9042
  selector:
    app: cassandra
```

<!--
[Download example](https://raw.githubusercontent.com/kubernetes/examples/master/cassandra-service.yaml)
-->
[下载示例](https://raw.githubusercontent.com/kubernetes/examples/master/cassandra-service.yaml)
<!-- END MUNGE: EXAMPLE cassandra-service.yaml -->

<!--
Create the service for the StatefulSet:
-->
为 StatefulSet 创建 service


```console
$ kubectl create -f cassandra/cassandra-service.yaml
```

<!--
The following command shows if the service has been created.
-->
以下命令显示了 service 是否被成功创建。

```console
$ kubectl get svc cassandra
```

<!--
The response should be like:
-->
命令的响应应该像这样：

```console
NAME        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   None         <none>        9042/TCP   45s
```

<!--
If an error is returned the service create failed.
-->
如果返回错误则表示 service 创建失败。

<!--
## Step 2: Use a StatefulSet to create Cassandra Ring
-->
## 步骤2：使用 StatefulSet 创建  Cassandra Ring环

<!--
StatefulSets (previously PetSets) are a feature that was upgraded to a <i>Beta</i> component in
Kubernetes 1.5.  Deploying stateful distributed applications, like Cassandra, within a clustered
environment can be challenging.  We implemented StatefulSet to greatly simplify this
process.  Multiple StatefulSet features are used within this example, but is out of
scope of this documentation.  [Please refer to the Stateful Set documentation.](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
-->
StatefulSets（以前叫做 PetSets）特性在 Kubernetes 1.5 中升级为一个 <i>Beta</i> 组件。在集群环境中部署类似于 Cassandra 的有状态分布式应用是一项具有挑战性的工作。我们实现了StatefulSet，极大的简化了这个过程。本示例使用了 StatefulSet 的多个特性，但其本身超出了本文的范围。[请参考 Stateful Set 文档。](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

<!--
The StatefulSet manifest that is included below, creates a Cassandra ring that consists
of three pods.
-->
以下是StatefulSet 的清单文件，用于创建一个由三个 pods 组成的 Cassandra ring环。

<!--
This example includes using a GCE Storage Class, please update appropriately depending
on the cloud you are working with. 
-->
本示例使用了 GCE Storage Class，请根据你运行的云平台做适当的修改。

<!-- BEGIN MUNGE: EXAMPLE cassandra-statefulset.yaml -->

```yaml
apiVersion: "apps/v1beta1"
kind: StatefulSet
metadata:
  name: cassandra
spec:
  serviceName: cassandra
  replicas: 3
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      containers:
      - name: cassandra
        image: gcr.io/google-samples/cassandra:v12
        imagePullPolicy: Always
        ports:
        - containerPort: 7000
          name: intra-node
        - containerPort: 7001
          name: tls-intra-node
        - containerPort: 7199
          name: jmx
        - containerPort: 9042
          name: cql
        resources:
          limits:
            cpu: "500m"
            memory: 1Gi
          requests:
           cpu: "500m"
           memory: 1Gi
        securityContext:
          capabilities:
            add:
              - IPC_LOCK
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "PID=$(pidof java) && kill $PID && while ps -p $PID > /dev/null; do sleep 1; done"]
        env:
          - name: MAX_HEAP_SIZE
            value: 512M
          - name: HEAP_NEWSIZE
            value: 100M
          - name: CASSANDRA_SEEDS
            value: "cassandra-0.cassandra.default.svc.cluster.local"
          - name: CASSANDRA_CLUSTER_NAME
            value: "K8Demo"
          - name: CASSANDRA_DC
            value: "DC1-K8Demo"
          - name: CASSANDRA_RACK
            value: "Rack1-K8Demo"
          - name: CASSANDRA_AUTO_BOOTSTRAP
            value: "false"
          - name: POD_IP
            valueFrom:
              fieldRef:
                fieldPath: status.podIP
        readinessProbe:
          exec:
            command:
            - /bin/bash
            - -c
            - /ready-probe.sh
          initialDelaySeconds: 15
          timeoutSeconds: 5
        # These volume mounts are persistent. They are like inline claims,
        # but not exactly because the names need to match exactly one of
        # the stateful pod volumes.
        volumeMounts:
        - name: cassandra-data
          mountPath: /cassandra_data
  # These are converted to volume claims by the controller
  # and mounted at the paths mentioned above.
  # do not use these in production until ssd GCEPersistentDisk or other ssd pd
  volumeClaimTemplates:
  - metadata:
      name: cassandra-data
      annotations:
        volume.beta.kubernetes.io/storage-class: fast
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
---
kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

<!--
[Download example](https://raw.githubusercontent.com/kubernetes/examples/master/cassandra-statefulset.yaml)
-->
[下载示例](https://raw.githubusercontent.com/kubernetes/examples/master/cassandra-statefulset.yaml)
<!-- END MUNGE: EXAMPLE cassandra-statefulset.yaml -->

<!--
Create the Cassandra StatefulSet as follows:
-->
创建  Cassandra StatefulSet 如下：

```console
$ kubectl create -f cassandra/cassandra-statefulset.yaml
```

<!--
## Step 3: Validate and Modify The Cassandra StatefulSet
-->
## 步骤3：验证和修改 Cassandra StatefulSet

<!--
Deploying this StatefulSet shows off two of the new features that StatefulSets provides.

1. The pod names are known
2. The pods deploy in incremental order
  -->
这个 StatefulSet 的部署展示了 StatefulSets 提供的两个新特性：

1. Pod 的名称已知
2. Pod 以递增顺序部署

<!--
First validate that the StatefulSet has deployed, by running `kubectl` command below.
-->
首先，运行下面的 `kubectl` 命令，验证 StatefulSet 已经被成功部署。

```console
$ kubectl get statefulset cassandra
```

<!--
The command should respond like:
-->
这个命令的响应应该像这样：

```console
NAME        DESIRED   CURRENT   AGE
cassandra   3         3         13s
```

<!--
Next watch the Cassandra pods deploy, one after another.  The StatefulSet resource
deploys pods in a number fashion: 1, 2, 3, etc.  If you execute the following
command before the pods deploy you are able to see the ordered creation.
-->
接下来观察 Cassandra pods 以一个接一个的形式部署。StatefulSet 资源按照数字序号的模式部署 pods：1, 2, 3 等。如果在 pods 部署前执行下面的命令，你就能够看到这种顺序的创建过程。

```console
$ kubectl get pods -l="app=cassandra"
NAME          READY     STATUS              RESTARTS   AGE
cassandra-0   1/1       Running             0          1m
cassandra-1   0/1       ContainerCreating   0          8s
```

<!--
The above example shows two of the three pods in the Cassandra StatefulSet deployed.
Once all of the pods are deployed the same command will respond with the full
StatefulSet.
-->
上面的示例显示了三个 Cassandra StatefulSet pods 中的两个已经部署。一旦所有的 pods 都部署成功，相同的命令会显示一个完整的StatefulSet。

```console
$ kubectl get pods -l="app=cassandra"
NAME          READY     STATUS    RESTARTS   AGE
cassandra-0   1/1       Running   0          10m
cassandra-1   1/1       Running   0          9m
cassandra-2   1/1       Running   0          8m
```

<!--
Running the Cassandra utility `nodetool` will display the status of the ring.
-->
运行 Cassandra 工具 `nodetool` 将显示 ring环的状态。

```console
$ kubectl exec cassandra-0 -- nodetool status
Datacenter: DC1-K8Demo
======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address   Load       Tokens       Owns (effective)  Host ID                               Rack
UN  10.4.2.4  65.26 KiB  32           63.7%             a9d27f81-6783-461d-8583-87de2589133e  Rack1-K8Demo
UN  10.4.0.4  102.04 KiB  32           66.7%             5559a58c-8b03-47ad-bc32-c621708dc2e4  Rack1-K8Demo
UN  10.4.1.4  83.06 KiB  32           69.6%             9dce943c-581d-4c0e-9543-f519969cc805  Rack1-K8Demo
```

<!--
You can also run `cqlsh` to describe the keyspaces in the cluster.
-->
你也可以运行 `cqlsh` 来显示集群的 keyspaces。

```console
$ kubectl exec cassandra-0 -- cqlsh -e 'desc keyspaces'

system_traces  system_schema  system_auth  system  system_distributed
```

<!--
In order to increase or decrease the size of the Cassandra StatefulSet, you must use
`kubectl edit`.  You can find more information about the edit command in the [documentation](/docs/user-guide/kubectl/kubectl_edit).
-->
你需要使用 `kubectl edit` 来增加或减小 Cassandra StatefulSet 的大小。你可以在 [文档](/docs/user-guide/kubectl/kubectl_edit) 中找到更多关于 edit 命令的信息。

<!--
Use the following command to edit the StatefulSet.
-->
使用以下命令编辑 StatefulSet。

```console
$ kubectl edit statefulset cassandra
```

<!--
This will create an editor in your terminal.  The line you are looking to change is
`replicas`. The example does on contain the entire contents of the terminal window, and
the last line of the example below is the replicas line that you want to change.
-->
这会在你的命令行中创建一个编辑器。你需要修改的行是 `replicas`。这个例子没有包含终端窗口的所有内容，下面示例中的最后一行就是你希望改变的 replicas 行。

```console
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  creationTimestamp: 2016-08-13T18:40:58Z
  generation: 1
  labels:
    app: cassandra
  name: cassandra
  namespace: default
  resourceVersion: "323"
  selfLink: /apis/apps/v1beta1/namespaces/default/statefulsets/cassandra
  uid: 7a219483-6185-11e6-a910-42010a8a0fc0
spec:
  replicas: 3
```

<!--
Modify the manifest to the following, and save the manifest.
-->
按下面的示例修改清单文件并保存。

```console
spec:
  replicas: 4
```

<!--
The StatefulSet will now contain four pods.
-->
这个 StatefulSet 现在将包含四个 pods。

```console
$ kubectl get statefulset cassandra
```

<!--
The command should respond like:
-->
这个command的响应应该像这样：

```console
NAME        DESIRED   CURRENT   AGE
cassandra   4         4         36m
```

<!--
For the Kubernetes 1.5 release, the beta StatefulSet resource does not have `kubectl scale`
functionality, like a Deployment, ReplicaSet, Replication Controller, or Job.
-->
对于 Kubernetes 1.5 发布版，beta StatefulSet 资源没有像 Deployment, ReplicaSet, Replication Controller或者 Job一样，包含 `kubectl scale` 功能，

<!--
## Step 4: Delete Cassandra StatefulSet
-->
## 步骤4：删除 Cassandra StatefulSet

<!--
Deleting and/or scaling a StatefulSet down will not delete the volumes associated with the StatefulSet. This is done to ensure safety first, your data is more valuable than an auto purge of all related StatefulSet resources. Deleting the Persistent Volume Claims may result in a deletion of the associated volumes, depending on the storage class and reclaim policy. You should never assume ability to access a volume after claim deletion.
-->
删除或者缩容 StatefulSet 时不会删除与之关联的 volumes。这样做是为了优先保证安全。你的数据比其它会被自动清除的 StatefulSet 关联资源更宝贵。删除 Persistent Volume Claims 可能会导致关联的 volumes 被删除，这种行为依赖 storage class 和 reclaim policy。永远不要期望能在 claim 删除后访问一个 volume。

<!--
Use the following commands to delete the StatefulSet.
-->
使用如下命令删除 StatefulSet。

```console
$ grace=$(kubectl get po cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
  && kubectl delete statefulset -l app=cassandra \
  && echo "Sleeping $grace" \
  && sleep $grace \
  && kubectl delete pvc -l app=cassandra
```

<!--
## Step 5: Use a Replication Controller to create Cassandra node pods
-->
## 步骤5：使用 Replication Controller 创建 Cassandra 节点 pods

<!--
A Kubernetes
_[Replication Controller](/docs/user-guide/replication-controller)_
is responsible for replicating sets of identical pods.  Like a
Service, it has a selector query which identifies the members of its set.
Unlike a Service, it also has a desired number of replicas, and it will create
or delete Pods to ensure that the number of Pods matches up with its
desired state.
-->
Kubernetes _[Replication Controller](/docs/user-guide/replication-controller)_ 负责复制一个完全相同的 pods 集合。像 Service 一样，它具有一个 selector query，用来识别它的集合成员。和 Service 不一样的是，它还具有一个期望的副本数，并且会通过创建或删除 Pods来保证 Pods 的数量满足它期望的状态。

<!--
The Replication Controller, in conjunction with the Service we just defined,
will let us easily build a replicated, scalable Cassandra cluster.
-->
和我们刚才定义的 Service 一起，Replication Controller 能够让我们轻松的构建一个复制的、可扩展的 Cassandra 集群。

<!--
Let's create a replication controller with two initial replicas.
-->
让我们创建一个具有两个初始副本的  replication controller。

<!-- BEGIN MUNGE: EXAMPLE cassandra-controller.yaml -->

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: cassandra
  # The labels will be applied automatically
  # from the labels in the pod template, if not set
  # labels:
    # app: cassandra
spec:
  replicas: 2
  # The selector will be applied automatically
  # from the labels in the pod template, if not set.
  # selector:
      # app: cassandra
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      containers:
        - command:
            - /run.sh
          resources:
            limits:
              cpu: 0.5
          env:
            - name: MAX_HEAP_SIZE
              value: 512M
            - name: HEAP_NEWSIZE
              value: 100M
            - name: CASSANDRA_SEED_PROVIDER
              value: "io.k8s.cassandra.KubernetesSeedProvider"
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          image: gcr.io/google-samples/cassandra:v12
          name: cassandra
          ports:
            - containerPort: 7000
              name: intra-node
            - containerPort: 7001
              name: tls-intra-node
            - containerPort: 7199
              name: jmx
            - containerPort: 9042
              name: cql
          volumeMounts:
            - mountPath: /cassandra_data
              name: data
      volumes:
        - name: data
          emptyDir: {}
```

<!--
[Download example](https://raw.githubusercontent.com/kubernetes/examples/master/cassandra-controller.yaml)
-->
[下载示例](https://raw.githubusercontent.com/kubernetes/examples/master/cassandra-controller.yaml)
<!-- END MUNGE: EXAMPLE cassandra-controller.yaml -->

<!--
There are a few things to note in this description.
-->
在这个描述中需要注意几件事情。

<!--
The `selector` attribute contains the controller's selector query. It can be
explicitly specified, or applied automatically from the labels in the pod
template if not set, as is done here.
-->
`selector` 属性包含了控制器的  selector query。它能够被显式指定，或者在没有设置时，像此处一样从 pod 模板中的 labels 中自动应用。

<!--
The pod template's label, `app:cassandra`, matches the Service selector
from Step 1. This is how pods created by this replication controller are picked up
by the Service."
-->
Pod 模板的标签 `app:cassandra` 匹配步骤1中的 Service selector。这就是 Service  如何选择 replication controller 创建的 pods 的原理。

<!--
The `replicas` attribute specifies the desired number of replicas, in this
case 2 initially.  We'll scale up to more shortly.
-->
`replicas` 属性指明了期望的副本数量，在本例中最开始为 2。我们很快将要扩容更多数量。

<!--
Create the Replication Controller:
-->
创建 Replication Controller：

```console

$ kubectl create -f cassandra/cassandra-controller.yaml

```

<!--
You can list the new controller:
-->
你可以列出新建的 controller：

```console

$ kubectl get rc -o wide
NAME        DESIRED   CURRENT   AGE       CONTAINER(S)   IMAGE(S)                             SELECTOR
cassandra   2         2         11s       cassandra      gcr.io/google-samples/cassandra:v12   app=cassandra

```

<!--
Now if you list the pods in your cluster, and filter to the label
`app=cassandra`, you should see two Cassandra pods. (The `wide` argument lets
you see which Kubernetes nodes the pods were scheduled onto.)
-->
现在，如果你列出集群中的 pods，并且使用 `app=cassandra` 标签过滤，你应该能够看到两个 Cassandra pods。（`wide` 参数使你能够看到 pods 被调度到了哪个 Kubernetes 节点上）

```console

$ kubectl get pods -l="app=cassandra" -o wide
NAME              READY     STATUS    RESTARTS   AGE       NODE
cassandra-21qyy   1/1       Running   0          1m        kubernetes-minion-b286
cassandra-q6sz7   1/1       Running   0          1m        kubernetes-minion-9ye5

```

<!--
Because these pods have the label `app=cassandra`, they map to the service we
defined in Step 1.
-->
因为这些 pods 拥有 `app=cassandra` 标签，它们被映射给了我们在步骤1中创建的 service。

<!--
You can check that the Pods are visible to the Service using the following service endpoints query:
-->
你可以使用下面的 service endpoint 查询命令来检查 Pods 是否对 Service 可用。

```console

$ kubectl get endpoints cassandra -o yaml
apiVersion: v1
kind: Endpoints
metadata:
  creationTimestamp: 2015-06-21T22:34:12Z
  labels:
    app: cassandra
  name: cassandra
  namespace: default
  resourceVersion: "944373"
  selfLink: /api/v1/namespaces/default/endpoints/cassandra
  uid: a3d6c25f-1865-11e5-a34e-42010af01bcc
subsets:
- addresses:
  - ip: 10.244.3.15
    targetRef:
      kind: Pod
      name: cassandra
      namespace: default
      resourceVersion: "944372"
      uid: 9ef9895d-1865-11e5-a34e-42010af01bcc
  ports:
  - port: 9042
    protocol: TCP

```

<!--
To show that the `SeedProvider` logic is working as intended, you can use the
`nodetool` command to examine the status of the Cassandra cluster.  To do this,
use the `kubectl exec` command, which lets you run `nodetool` in one of your
Cassandra pods.  Again, substitute `cassandra-xxxxx` with the actual name of one
of your pods.
-->
为了显示 `SeedProvider` 逻辑是按设想在运行，你可以使用 `nodetool` 命令来检查  Cassandra 集群的状态。为此，请使用 `kubectl exec` 命令，这样你就能在一个 Cassandra pod 上运行 `nodetool`。同样的，请替换 `cassandra-xxxxx` 为任意一个 pods的真实名字。

```console

$ kubectl exec -ti cassandra-xxxxx -- nodetool status
Datacenter: datacenter1
=======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address     Load       Tokens  Owns (effective)  Host ID                               Rack
UN  10.244.0.5  74.09 KB   256     100.0%            86feda0f-f070-4a5b-bda1-2eeb0ad08b77  rack1
UN  10.244.3.3  51.28 KB   256     100.0%            dafe3154-1d67-42e1-ac1d-78e7e80dce2b  rack1

```

<!--
## Step 6: Scale up the Cassandra cluster
-->
## 步骤6：Cassandra集群扩容

<!--
Now let's scale our Cassandra cluster to 4 pods.  We do this by telling the
Replication Controller that we now want 4 replicas.
-->
现在，让我们把 Cassandra 集群扩展到4个 pods。我们通过告诉 Replication Controller 现在我们需要4个副本来完成。

```sh

$ kubectl scale rc cassandra --replicas=4

```

<!--
You can see the new pods listed:
-->
你可以看到列出了新的 pods：

```console

$ kubectl get pods -l="app=cassandra" -o wide
NAME              READY     STATUS    RESTARTS   AGE       NODE
cassandra-21qyy   1/1       Running   0          6m        kubernetes-minion-b286
cassandra-81m2l   1/1       Running   0          47s       kubernetes-minion-b286
cassandra-8qoyp   1/1       Running   0          47s       kubernetes-minion-9ye5
cassandra-q6sz7   1/1       Running   0          6m        kubernetes-minion-9ye5

```

<!--
In a few moments, you can examine the Cassandra cluster status again, and see
that the new pods have been detected by the custom `SeedProvider`:
-->
一会儿你就能再次检查 Cassandra 集群的状态，你可以看到新的 pods 已经被自定义的 `SeedProvider` 检测到：

```console

$ kubectl exec -ti cassandra-xxxxx -- nodetool status
Datacenter: datacenter1
=======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address     Load       Tokens  Owns (effective)  Host ID                               Rack
UN  10.244.0.6  51.67 KB   256     48.9%             d07b23a5-56a1-4b0b-952d-68ab95869163  rack1
UN  10.244.1.5  84.71 KB   256     50.7%             e060df1f-faa2-470c-923d-ca049b0f3f38  rack1
UN  10.244.1.6  84.71 KB   256     47.0%             83ca1580-4f3c-4ec5-9b38-75036b7a297f  rack1
UN  10.244.0.5  68.2 KB    256     53.4%             72ca27e2-c72c-402a-9313-1e4b61c2f839  rack1

```

<!--
## Step 7: Delete the Replication Controller
-->
## 步骤7：删除 Replication Controller

<!--
Before you start Step 5, __delete the replication controller__ you created above:
-->
在你开始步骤5之前， __删除__你在上面创建的 __replication controller__。

```sh

$ kubectl delete rc cassandra

```

<!--
## Step 8: Use a DaemonSet instead of a Replication Controller
-->
## 步骤8：使用 DaemonSet 替换 Replication Controller

<!--
In Kubernetes, a [_Daemon Set_](/docs/admin/daemons) can distribute pods
onto Kubernetes nodes, one-to-one.  Like a _ReplicationController_, it has a
selector query which identifies the members of its set.  Unlike a
_ReplicationController_, it has a node selector to limit which nodes are
scheduled with the templated pods, and replicates not based on a set target
number of pods, but rather assigns a single pod to each targeted node.
-->
在 Kubernetes中，[_Daemon Set_](/docs/admin/daemons) 能够将 pods 一对一的分布到 Kubernetes 节点上。和  _ReplicationController_ 相同的是它也有一个用于识别它的集合成员的 selector query。但和 _ReplicationController_ 不同的是，它拥有一个节点 selector，用于限制基于模板的 pods 可以调度的节点。并且 pod 的复制不是基于一个设置的数量，而是为每一个节点分配一个 pod。

<!--
An example use case: when deploying to the cloud, the expectation is that
instances are ephemeral and might die at any time. Cassandra is built to
replicate data across the cluster to facilitate data redundancy, so that in the
case that an instance dies, the data stored on the instance does not, and the
cluster can react by re-replicating the data to other running nodes.
-->
示范用例：当部署到云平台时，预期情况是实例是短暂的并且随时可能终止。Cassandra 被搭建成为在各个节点间复制数据以便于实现数据冗余。这样的话，即使一个实例终止了，存储在它上面的数据却没有，并且集群会通过重新复制数据到其它运行节点来作为响应。

<!--
`DaemonSet` is designed to place a single pod on each node in the Kubernetes
cluster.  That will give us data redundancy. Let's create a
DaemonSet to start our storage cluster:
-->
`DaemonSet` 设计为在 Kubernetes 集群中的每个节点上放置一个 pod。那样就会给我们带来数据冗余度。让我们创建一个 DaemonSet 来启动我们的存储集群：

<!-- BEGIN MUNGE: EXAMPLE cassandra-daemonset.yaml -->

```yaml
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  labels:
    name: cassandra
  name: cassandra
spec:
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      # Filter to specific nodes:
      # nodeSelector:
      #  app: cassandra
      containers:
        - command:
            - /run.sh
          env:
            - name: MAX_HEAP_SIZE
              value: 512M
            - name: HEAP_NEWSIZE
              value: 100M
            - name: CASSANDRA_SEED_PROVIDER
              value: "io.k8s.cassandra.KubernetesSeedProvider"
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          image: gcr.io/google-samples/cassandra:v12
          name: cassandra
          ports:
            - containerPort: 7000
              name: intra-node
            - containerPort: 7001
              name: tls-intra-node
            - containerPort: 7199
              name: jmx
            - containerPort: 9042
              name: cql
              # If you need it it is going away in C* 4.0
              #- containerPort: 9160
              #  name: thrift
          resources:
            requests:
              cpu: 0.5
          volumeMounts:
            - mountPath: /cassandra_data
              name: data
      volumes:
        - name: data
          emptyDir: {}
```

<!--
[Download example](https://raw.githubusercontent.com/kubernetes/examples/master/cassandra-daemonset.yaml)
-->
[下载示例](https://raw.githubusercontent.com/kubernetes/examples/master/cassandra-daemonset.yaml)
<!-- END MUNGE: EXAMPLE cassandra-daemonset.yaml -->

<!--
Most of this DaemonSet definition is identical to the ReplicationController
definition above; it simply gives the daemon set a recipe to use when it creates
new Cassandra pods, and targets all Cassandra nodes in the cluster.
-->
这个 DaemonSet 绝大部分的定义和上面的 ReplicationController 完全相同；它只是简单的给 daemon set 一个创建新的 Cassandra pods 的方法，并且以集群中所有的 Cassandra 节点为目标。

<!--
Differentiating aspects are the `nodeSelector` attribute, which allows the
DaemonSet to target a specific subset of nodes (you can label nodes just like
other resources), and the lack of a `replicas` attribute due to the 1-to-1 node-
pod relationship.
-->
不同之处在于 `nodeSelector` 属性，它允许 DaemonSet 以全部节点的一个子集为目标（你可以向其他资源一样标记节点），并且没有 `replicas` 属性，因为它使用1对1的 node-pod 关系。

<!--
Create this DaemonSet:
-->
创建这个 DaemonSet：

```console

$ kubectl create -f cassandra/cassandra-daemonset.yaml

```

<!--
You may need to disable config file validation, like so:
-->
你可能需要禁用配置文件检查，像这样：

```console

$ kubectl create -f cassandra/cassandra-daemonset.yaml --validate=false

```

<!--
You can see the DaemonSet running:
-->
你可以看到 DaemonSet 已经在运行：

```console

$ kubectl get daemonset
NAME        DESIRED   CURRENT   NODE-SELECTOR
cassandra   3         3         <none>

```

<!--
Now, if you list the pods in your cluster, and filter to the label
`app=cassandra`, you should see one (and only one) new cassandra pod for each
node in your network.
-->
现在，如果你列出集群中的 pods，并且使用 `app=cassandra` 标签过滤，你应该能够看到你的网络中的每一个节点上都有一个（且只有一个）新的 cassandra pod。

```console

$ kubectl get pods -l="app=cassandra" -o wide
NAME              READY     STATUS    RESTARTS   AGE       NODE
cassandra-ico4r   1/1       Running   0          4s        kubernetes-minion-rpo1
cassandra-kitfh   1/1       Running   0          1s        kubernetes-minion-9ye5
cassandra-tzw89   1/1       Running   0          2s        kubernetes-minion-b286

```

<!--
To prove that this all worked as intended, you can again use the `nodetool`
command to examine the status of the cluster.  To do this, use the `kubectl exec` command to run `nodetool` in one of your newly-launched cassandra pods.
-->
为了证明这是按设想的在工作，你可以再次使用 `nodetool` 命令来检查集群的状态。为此，请使用 `kubectl exec` 命令在任何一个新建的 cassandra pods 上运行 `nodetool`。

```console

$ kubectl exec -ti cassandra-xxxxx -- nodetool status
Datacenter: datacenter1
=======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address     Load       Tokens  Owns (effective)  Host ID                               Rack
UN  10.244.0.5  74.09 KB   256     100.0%            86feda0f-f070-4a5b-bda1-2eeb0ad08b77  rack1
UN  10.244.4.2  32.45 KB   256     100.0%            0b1be71a-6ffb-4895-ac3e-b9791299c141  rack1
UN  10.244.3.3  51.28 KB   256     100.0%            dafe3154-1d67-42e1-ac1d-78e7e80dce2b  rack1

```

<!--
**Note**: This example had you delete the cassandra Replication Controller before
you created the DaemonSet.  This is because – to keep this example simple – the
RC and the DaemonSet are using the same `app=cassandra` label (so that their pods map to the
service we created, and so that the SeedProvider can identify them).
-->
**注意**：这个示例让你在创建 DaemonSet 前删除了 cassandra的Replication Controller。这是因为为了保持示例的简单，RC 和 DaemonSet 使用了相同的 `app=cassandra` 标签（如此它们的 pods 映射到了我们创建的 service，这样 SeedProvider 就能识别它们）。

<!--
If we didn't delete the RC first, the two resources would conflict with
respect to how many pods they wanted to have running. If we wanted, we could support running
both together by using additional labels and selectors.
-->
如果我们没有预先删除 RC，这两个资源在需要运行多少 pods 上将会发生冲突。如果希望的话，我们可以使用额外的标签和 selectors 来支持同时运行它们。

<!--
## Step 9: Resource Cleanup
-->
## 步骤9：资源清理

<!--
When you are ready to take down your resources, do the following:
-->
当你准备删除你的资源时，按以下执行：

```console

$ kubectl delete service -l app=cassandra
$ kubectl delete daemonset cassandra

```

<!--
### Custom Seed Provider
-->
### 自定义 Seed Provider

<!--
A custom [`SeedProvider`](https://svn.apache.org/repos/asf/cassandra/trunk/src/java/org/apache/cassandra/locator/SeedProvider.java)
is included for running Cassandra on top of Kubernetes.  Only when you deploy Cassandra
via a replication control or a daemonset, you will need to use the custom seed provider.
In Cassandra, a `SeedProvider` bootstraps the gossip protocol that Cassandra uses to find other
Cassandra nodes. Seed addresses are hosts deemed as contact points. Cassandra
instances use the seed list to find each other and learn the topology of the
ring. The [`KubernetesSeedProvider`](https://github.com/kubernetes/kubernetes/blob/master/examples/storage/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)
discovers Cassandra seeds IP addresses via the Kubernetes API, those Cassandra
instances are defined within the Cassandra Service.
-->
我们使用了一个自定义的  [`SeedProvider`](https://svn.apache.org/repos/asf/cassandra/trunk/src/java/org/apache/cassandra/locator/SeedProvider.java) 来在 Kubernetes 之上运行 Cassandra。仅当你通过 replication control 或者 daemonset 部署 Cassandra 时才需要使用自定义的 seed provider。在 Cassandra 中，`SeedProvider` 引导 Cassandra 使用 gossip 协议来查找其它 Cassandra 节点。Seed 地址是被视为连接端点的主机。Cassandra 实例使用 seed 列表来查找彼此并学习 ring环拓扑。[`KubernetesSeedProvider`](https://github.com/kubernetes/kubernetes/blob/master/examples/storage/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java) 通过 Kubernetes API 发现  Cassandra seeds IP 地址，那些 Cassandra 实例在 Cassandra Service 中定义。

<!--
Refer to the custom seed provider [README](https://git.k8s.io/examples/cassandra/java/README.md) for further
`KubernetesSeedProvider` configurations. For this example you should not need
to customize the Seed Provider configurations.
-->
请查阅自定义 seed provider 的 [README](https://git.k8s.io/examples/cassandra/java/README.md) 文档，获取 `KubernetesSeedProvider` 进阶配置。对于本示例来说，你应该不需要自定义 Seed Provider 的配置。

<!--
See the [image](https://github.com/kubernetes/examples/tree/master/cassandra/image) directory of this example for specifics on
how the container docker image was built and what it contains.
-->
查看本示例的 [image](https://github.com/kubernetes/examples/tree/master/cassandra/image) 目录，了解如何构建容器的 docker 镜像及其内容。

<!--
You may also note that we are setting some Cassandra parameters (`MAX_HEAP_SIZE`
and `HEAP_NEWSIZE`), and adding information about the
[namespace](/docs/user-guide/namespaces).
We also tell Kubernetes that the container exposes
both the `CQL` and `Thrift` API ports.  Finally, we tell the cluster
manager that we need 0.1 cpu (0.1 core).
-->
你可能还注意到我们设置了一些 Cassandra 参数（`MAX_HEAP_SIZE`和`HEAP_NEWSIZE`），并且增加了关于 [namespace](/docs/user-guide/namespaces) 的信息。我们还告诉 Kubernetes 容器暴露了 `CQL` 和 `Thrift` API 端口。最后，我们告诉集群管理器我们需要 0.1 cpu（0.1 核）。


<!-- BEGIN MUNGE: GENERATED_ANALYTICS -->
[!Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/cassandra/README.md?pixel)]()
<!-- END MUNGE: GENERATED_ANALYTICS -->
