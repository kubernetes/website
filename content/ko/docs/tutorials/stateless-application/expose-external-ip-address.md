---
title: 외부 IP 주소를 노출하여 클러스터의 애플리케이션에 접속하기
content_template: templates/tutorial
weight: 10
---

{{% capture overview %}}

이 페이지에서는 외부 IP 주소를 노출하는 쿠버네티스 서비스 오브젝트를 생성하는 방법에 대해 설명한다.

{{% /capture %}}


{{% capture prerequisites %}}

 * [kubectl](/docs/tasks/tools/install-kubectl/)을 설치한다.

 * Google Kubernetes Engine 또는 Amazon Web Services와 같은 클라우드 공급자를 사용하여 쿠버네티스 클러스터를 생성한다. 이 튜토리얼은 [외부 로드 밸런서](/docs/tasks/access-application-cluster/create-external-load-balancer/)를 생성하는데, 클라우드 공급자가 필요하다.

 * `kubectl`이 쿠버네티스 API 서버와 통신하도록 설정한다. 자세한 내용은 클라우드 공급자의 설명을 참고한다.

{{% /capture %}}


{{% capture objectives %}}

* Hello World 애플리케이션을 다섯 개의 인스턴스로 실행한다.
* 외부 IP 주소를 노출하는 서비스를 생성한다.
* 실행 중인 애플리케이션에 접근하기 위해 서비스 오브젝트를 사용한다.

{{% /capture %}}


{{% capture lessoncontent %}}

## 다섯 개의 파드에서 실행되는 애플리케이션에 대한 서비스 만들기

1. 클러스터에서 Hello World 애플리케이션을 실행한다.

        kubectl run hello-world --replicas=5 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080

    위의 명령어는 [디플로이먼트](/docs/concepts/workloads/controllers/deployment/)
    오브젝트와 관련된
    [레플리카 셋](/docs/concepts/workloads/controllers/replicaset/)
    오브젝트를 생성한다. 레플리카 셋은 다섯 개의 
    [파드](/docs/concepts/workloads/pods/pod/)가 있으며,
    각 파드는 Hello World 애플리케이션을 실행한다.

1. 디플로이먼트에 대한 정보를 확인한다.

        kubectl get deployments hello-world
        kubectl describe deployments hello-world

1. 레플리카 셋 오브젝트에 대한 정보를 확인한다.

        kubectl get replicasets
        kubectl describe replicasets

1. 디플로이먼트를 외부로 노출시키는 서비스 오브젝트를 생성한다.

        kubectl expose deployment hello-world --type=LoadBalancer --name=my-service

1. 서비스에 대한 정보를 확인한다.

        kubectl get services my-service

    결과는 아래와 같은 형태로 나타난다.

        NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
        my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s

    참고: 만약 외부 IP 주소가 \<pending\>으로 표시되면 잠시 기다린 다음, 동일한 명령어를 다시 입력한다.

1. 서비스에 대한 자세한 정보를 확인한다.

        kubectl describe services my-service

    결과는 아래와 같은 형태로 나타난다.

        Name:           my-service
        Namespace:      default
        Labels:         run=load-balancer-example
        Annotations:    <none>
        Selector:       run=load-balancer-example
        Type:           LoadBalancer
        IP:             10.3.245.137
        LoadBalancer Ingress:   104.198.205.71
        Port:           <unset> 8080/TCP
        NodePort:       <unset> 32377/TCP
        Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
        Session Affinity:   None
        Events:         <none>

    서비스에 의해 노출된 외부 IP 주소 (`LoadBalancer Ingress`)를 기억해두자.
    예시에서 외부 IP 주소는 104.198.205.71이다.
    그리고 `Port`와`NodePort`의 값을 기억해두자. 예시에서 `Port`는 8080이고 `NodePort`는 32377이다.

1. 위의 출력 결과를 통해, 서비스에 여러 엔드포인트가 있음을 알 수 있다.
   10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2. 이 주소는 Hello World 애플리케이션을 실행 중인 파드의 내부 주소다. 해당 주소가 파드 주소인지 확인하려면, 아래 명령어를 입력하면 된다.

        kubectl get pods --output=wide

    결과는 아래와 같은 형태로 나타난다.

        NAME                         ...  IP         NODE
        hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
        hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc

1. Hello World 애플리케이션에 접근하기 위해 외부 IP 주소 (`LoadBalancer Ingress`)를 사용한다.

        curl http://<external-ip>:<port>

    `<external-ip>`는 서비스의 외부 IP 주소 (`LoadBalancer Ingress`)를 의미하며,
    `<port>`는 서비스 정보에서 `Port` 값을 의미한다.
    만약 minikube를 사용하고 있다면, `minikube service my-service` 명령어를 통해 자동으로 브라우저 내에서 Hello World 애플리케이션에 접근할 수 있다.

    성공적인 요청에 대한 응답으로 hello 메세지가 나타난다.

        Hello Kubernetes!

{{% /capture %}}


{{% capture cleanup %}}

서비스를 삭제하려면, 아래의 명령어를 입력한다.

        kubectl delete services my-service

Hello World 애플리케이션을 실행 중인 디플로이먼트, 레플리카 셋, 파드를 삭제하려면, 아래의 명령어를 입력한다.

        kubectl delete deployment hello-world

{{% /capture %}}


{{% capture whatsnext %}}

[애플리케이션과 서비스 연결하기](/docs/concepts/services-networking/connect-applications-service/)에 대해 더 배워 본다.
{{% /capture %}}
