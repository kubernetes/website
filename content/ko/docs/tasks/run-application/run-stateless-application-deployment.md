---
title: 디플로이먼트(Deployment)로 스테이트리스 애플리케이션 실행하기
min-kubernetes-server-version: v1.9
content_type: tutorial
weight: 10
---

<!-- overview -->

이 페이지에서는 쿠버네티스 디플로이먼트 오브젝트를 사용하여 애플리케이션을 실행하는 방법을 설명한다.




## {{% heading "objectives" %}}


* nginx 디플로이먼트 생성하기
* kubectl을 사용하여 디플로이먼트 정보 나열하기
* 디플로이먼트 업데이트하기




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- lessoncontent -->

## nginx 디플로이먼트 생성하고 탐색하기

쿠버네티스 디플로이먼트 오브젝트를 생성하여 애플리케이션을 실행할 수 있으며,
디플로이먼트에 대한 명세를 YAML 파일에 기술할 수 있다. 예를 들어 이 YAML 파일은 
nginx:1.14.2 도커 이미지를 실행하는 디플로이먼트에 대한 명세를 담고 있다.

{{< codenew file="application/deployment.yaml" >}}


1. YAML 파일을 기반으로 디플로이먼트를 생성한다.

        kubectl apply -f https://k8s.io/examples/application/deployment.yaml

1. 디플로이먼트에 대한 정보를 살펴본다.

        kubectl describe deployment nginx-deployment

    출력은 다음과 유사하다.

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
            Image:              nginx:1.14.2
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

1. 디플로이먼트에 의해 생성된 파드를 나열한다.

        kubectl get pods -l app=nginx

    출력은 다음과 유사하다.

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h

1. 파드에 대한 정보를 살펴본다.

        kubectl describe pod <pod-name>

    `<pod-name>`은 파드 중 하나의 이름이다.

## 디플로이먼트 업데이트하기

새 YAML 파일을 적용하여 디플로이먼트를 업데이트할 수 있다. 이 YAML 파일은 
nginx 1.16.1을 사용하도록 디플로이먼트를 업데이트해야 함을 명시하고 있다.

{{< codenew file="application/deployment-update.yaml" >}}

1. 새 YAML 파일을 적용한다.

         kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml

1. 디플로이먼트가 새 이름으로 파드를 생성하고 이전 파드를 삭제하는 것을 확인한다.

         kubectl get pods -l app=nginx

## 레플리카 수를 늘려 애플리케이션 확장하기

새 YAML 파일을 적용하여 디플로이먼트의 파드 수를 늘릴 수 있다. 
이 YAML 파일은 `replicas`를 4로 설정하여 디플로이먼트에 
4개의 파드가 있어야 함을 명시하고 있다.

{{< codenew file="application/deployment-scale.yaml" >}}

1. 새 YAML 파일을 적용한다.

        kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml

1. 디플로이먼트에 4개의 파드가 있는지 확인한다.

        kubectl get pods -l app=nginx

    출력은 다음과 유사하다.

        NAME                               READY     STATUS    RESTARTS   AGE
        nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
        nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
        nginx-deployment-148880595-fxcez   1/1       Running   0          2m
        nginx-deployment-148880595-rwovn   1/1       Running   0          2m

## 디플로이먼트 삭제하기

이름으로 디플로이먼트를 삭제한다.

    kubectl delete deployment nginx-deployment

## ReplicationControllers -- 예전 방식

애플리케이션을 복제하여 생성하는 기본적인 방법은 내부적으로 레플리카셋(ReplicaSet)을 활용하는 디플로이먼트를
사용하는 것이다. 쿠버네티스에 디플로이먼트 및 레플리카셋이 도입되기 전에는
[레플리케이션컨트롤러(ReplicationController)](/ko/docs/concepts/workloads/controllers/replicationcontroller/)를 사용하여 복제 애플리케이션을
구성했었다.




## {{% heading "whatsnext" %}}


* [디플로이먼트 오브젝트](/ko/docs/concepts/workloads/controllers/deployment/)에 대해 더 배워보기




