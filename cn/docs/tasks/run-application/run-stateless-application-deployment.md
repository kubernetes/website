---
title: 使用 Deployment 运行无状态应用
min-kubernetes-server-version: v1.8
cn-approvers:
- chentao1596
---
<!--
---
title: Run a Stateless Application Using a Deployment
min-kubernetes-server-version: v1.8
---
-->

{% capture overview %}

<!--
This page shows how to run an application using a Kubernetes Deployment object.
-->
本页演示如何使用 Kubernetes Deployment 对象运行应用。

{% endcapture %}


{% capture objectives %}

<!--
* Create an nginx deployment.
* Use kubectl to list information about the deployment.
* Update the deployment.
-->
* 创建一个 nginx deployment。
* 使用 kubectl 列出关于该 deployment 的信息。
* 更新这个 deployment。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture lessoncontent %}

<!--
## Creating and exploring an nginx deployment
-->
## 创建并探索 nginx deployment

<!--
You can run an application by creating a Kubernetes Deployment object, and you
can describe a Deployment in a YAML file. For example, this YAML file describes
a Deployment that runs the nginx:1.7.9 Docker image:
-->
您能够通过创建 Kubernetes Deployment 对象来运行应用，还可以在 YAML 文件中描述 Deployment。例如，这个 YAML 文件描述了运行 nginx：1.7.9 Docker 镜像的 Deployment：

{% include code.html language="yaml" file="deployment.yaml" ghlink="/docs/tasks/run-application/deployment.yaml" %}


<!--
1. Create a Deployment based on the YAML file:
-->
1. 基于 YAML 文件创建 Deployment：

       kubectl apply -f https://k8s.io/docs/tasks/run-application/deployment.yaml

<!--
1. Display information about the Deployment:

       kubectl describe deployment nginx-deployment
	   
    The output is similar to this:

        user@computer:~/website$ kubectl describe deployment nginx-deployment
        Name:     nginx-deployment
        Namespace:    default
        CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
        Labels:     app=nginx
        Annotations:    deployment.kubernetes.io/revision=1
        Selector:   app=nginx
        Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
        StrategyType:   RollingUpdate
        MinReadySeconds:  0
        RollingUpdateStrategy:  1 max unavailable, 1 max surge
        Pod Template:
          Labels:       app=nginx
          Containers:
           nginx:
            Image:              nginx:1.7.9
            Port:               80/TCP
            Environment:        <none>
            Mounts:             <none>
          Volumes:              <none>
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     True    MinimumReplicasAvailable
          Progressing   True    NewReplicaSetAvailable
        OldReplicaSets:   <none>
        NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
        No events.
-->
1. 显示有关 Deployment 的信息：

       kubectl describe deployment nginx-deployment
	   
    输出类似如下内容：

        user@computer:~/website$ kubectl describe deployment nginx-deployment
        Name:     nginx-deployment
        Namespace:    default
        CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
        Labels:     app=nginx
        Annotations:    deployment.kubernetes.io/revision=1
        Selector:   app=nginx
        Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
        StrategyType:   RollingUpdate
        MinReadySeconds:  0
        RollingUpdateStrategy:  1 max unavailable, 1 max surge
        Pod Template:
          Labels:       app=nginx
          Containers:
           nginx:
            Image:              nginx:1.7.9
            Port:               80/TCP
            Environment:        <none>
            Mounts:             <none>
          Volumes:              <none>
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     True    MinimumReplicasAvailable
          Progressing   True    NewReplicaSetAvailable
        OldReplicaSets:   <none>
        NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
        No events.
		
<!--
1. List the pods created by the deployment:

       kubectl get pods -l app=nginx

    The output is similar to this:

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h
-->
1. 列出通过这个 deployment 创建的 pod：

       kubectl get pods -l app=nginx

    输出类似如下内容：

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h
		
<!--
1. Display information about a pod:
-->
1. 显示有关 pod 的信息：

       kubectl describe pod <pod-name>

<!--
    where `<pod-name>` is the name of one of your pods.
-->
   这里 `<pod-name>` 是您其中一个 pod 的名称。

<!--
## Updating the deployment
-->
## 更新 deployment

<!--
You can update the deployment by applying a new YAML file. This YAML file
specifies that the deployment should be updated to use nginx 1.8.
-->
您能够通过应用新的 YAML 文件来更新 deployment。此 YAML 文件指定应更新 deployment 以使用 nginx 1.8。

{% include code.html language="yaml" file="deployment-update.yaml" ghlink="/docs/tasks/run-application/deployment-update.yaml" %}

<!--
1. Apply the new YAML file:
-->
1. 应用新的 YAML 文件：

       kubectl apply -f https://k8s.io/docs/tasks/run-application/deployment-update.yaml

<!--
1. Watch the deployment create pods with new names and delete the old pods:
-->
1. 查看 deployment，它使用新的名称创建了 pod，并且删除了旧的 pod：

       kubectl get pods -l app=nginx

<!--
## Scaling the application by increasing the replica count
-->
## 通过增加复本数量来扩展应用

<!--
You can increase the number of pods in your Deployment by applying a new YAML
file. This YAML file sets `replicas` to 4, which specifies that the Deployment
should have four pods:
-->
您能够通过应用新的 YAML 文件来增加 Deployment 中的 pod 数。这个 YAML 文件将复本设置为 4，这指定 Deployment 应该有四个pod：

{% include code.html language="yaml" file="deployment-scale.yaml" ghlink="/docs/tasks/run-application/deployment-scale.yaml" %}

<!--
1. Apply the new YAML file:
-->
1. 应用新的 YAML 文件：

       kubectl apply -f https://k8s.io/docs/tasks/run-application/deployment-scale.yaml

<!--
1. Verify that the Deployment has four pods:

       kubectl get pods -l app=nginx

    The output is similar to this:

        NAME                               READY     STATUS    RESTARTS   AGE
        nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
        nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
        nginx-deployment-148880595-fxcez   1/1       Running   0          2m
        nginx-deployment-148880595-rwovn   1/1       Running   0          2m
-->
1. 验证 Deployment 有四个 pod：

       kubectl get pods -l app=nginx

    输出类似如下内容：

        NAME                               READY     STATUS    RESTARTS   AGE
        nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
        nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
        nginx-deployment-148880595-fxcez   1/1       Running   0          2m
        nginx-deployment-148880595-rwovn   1/1       Running   0          2m
		
<!--
## Deleting a deployment
-->
## 删除 deployment

<!--
Delete the deployment by name:
-->
通过名称删除 deployment：

    kubectl delete deployment nginx-deployment

<!--
## ReplicationControllers -- the Old Way
-->
## ReplicationControllers（复本控制器）- 老的方式

<!--
The preferred way to create a replicated application is to use a Deployment,
which in turn uses a ReplicaSet. Before the Deployment and ReplicaSet were
added to Kubernetes, replicated applications were configured by using a
[ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).
-->
创建复本应用的首选方法是使用 Deployment，它使用的是 ReplicaSet。在将 Deployment 和 ReplicaSet 添加到 Kubernetes 以前，复本应用是通过 [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/) 配置的。

{% endcapture %}


{% capture whatsnext %}

<!--
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
-->
* 了解关于 [Deployment 对象](/docs/concepts/workloads/controllers/deployment/) 的更多内容。

{% endcapture %}

{% include templates/tutorial.md %}
