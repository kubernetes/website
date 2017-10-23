---
title: 使用Deployment运行一个无状态应用
---

{% capture overview %}

本文介绍通过Kubernetes Deployment对象如何去运行一个应用.

{% endcapture %}


{% capture objectives %}

* 创建一个nginx deployment.
* 使用kubectl列举关于deployment信息.
* 更新deployment.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture lessoncontent %}

## 创建和探究一个nginx deployment

你可以通过创建一个Kubernetes Deployment对象来运行一个应用, 可以在一个YAML文件中描述Deployment. 例如, 下面这个YAML文件描述了一个运行nginx:1.7.9 Docker镜像的Deployment:

{% include code.html language="yaml" file="deployment.yaml" ghlink="/cn/docs/tasks/run-application/deployment.yaml" %}


1. 通过YAML文件创建一个Deployment:

       kubectl create -f https://k8s.io/docs/tasks/run-application/deployment.yaml

1. 展示Deployment相关信息:

       kubectl describe deployment nginx-deployment

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

1. 列出deployment创建的pods:

       kubectl get pods -l app=nginx

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h

1. 展示某一个pod信息:

       kubectl describe pod <pod-name>

    该处 `<pod-name>` 指某一pod的名称.

## 更新deployment

你可以通过更新一个新的YAML文件来更新deployment. 下面的YAML文件指定该deployment镜像更新为nginx 1.8.

{% include code.html language="yaml" file="deployment-update.yaml" ghlink="/cn/docs/tutorials/stateless-application/deployment-update.yaml" %}

1. 应用新的YAML:

       kubectl apply -f https://k8s.io/docs/tutorials/stateless-application/deployment-update.yaml

1. 查看该deployment创建的pods以新的名称同时删除旧的pods:

       kubectl get pods -l app=nginx

## 通过增加副本数来弹缩应用

你可以通过应用新的YAML文件来增加Deployment中pods的数量. 该YAML文件将`replicas`设置为4, 指定该Deployment应有4个pods:

{% include code.html language="yaml" file="deployment-scale.yaml" ghlink="/cn/docs/tutorials/stateless-application/deployment-scale.yaml" %}

1. 应用新的YAML文件:

       kubectl apply -f https://k8s.io/docs/tutorials/stateless-application/deployment-scale.yaml

1. 验证Deployment有4个pods:

       kubectl get pods -l app=nginx

    输出的结果类似于:

        NAME                               READY     STATUS    RESTARTS   AGE
        nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
        nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
        nginx-deployment-148880595-fxcez   1/1       Running   0          2m
        nginx-deployment-148880595-rwovn   1/1       Running   0          2m

## 删除deployment

通过名称删除deployment:

    kubectl delete deployment nginx-deployment

## ReplicationControllers -- 旧的方式

创建一个多副本应用首选方法是使用Deployment,反过来使用ReplicaSet. 在Deployment和ReplicaSet加入到Kubernetes之前, 多副本应用通过[ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)来配置.

{% endcapture %}


{% capture whatsnext %}

* 了解更多 [Deployment objects](/docs/concepts/workloads/controllers/deployment/).

{% endcapture %}

{% include templates/tutorial.md %}
