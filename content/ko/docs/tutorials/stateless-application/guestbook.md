---
title: "예시: Redis를 사용한 PHP 방명록 애플리케이션 배포하기"
content_template: templates/tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "상태를 유지하지 않는 예제: Redis를 사용한 PHP 방명록"
---

{{% capture overview %}}
이 튜토리얼에서는 쿠버네티스와 [Docker](https://www.docker.com/)를 사용하여 간단한 멀티 티어 웹 애플리케이션을 빌드하고 배포하는 방법을 보여준다. 이 예제는 다음과 같은 구성으로 이루어져 있다.

* 방명록을 저장하는 단일 인스턴스 [Redis](https://redis.io/) 마스터
* 읽기를 제공하는 여러 개의 [복제된 Redis](https://redis.io/topics/replication) 인스턴스
* 여러 개의 웹 프론트엔드 인스턴스

{{% /capture %}}

{{% capture objectives %}}
* Redis 마스터를 시작
* Redis 슬레이브를 시작
* 방명록 프론트엔드를 시작
* 프론트엔드 서비스를 노출시키고 확인
* 정리 하기
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

{{% /capture %}}

{{% capture lessoncontent %}}

## Redis 마스터를 실행하기

방명록 애플리케이션은 Redis를 사용하여 데이터를 저장한다. Redis 마스터 인스턴스에 데이터를 기록하고 여러 Redis 슬레이브 인스턴스에서 데이터를 읽는다.

### Redis 마스터의 디플로이먼트를 생성하기

아래의 매니페스트 파일은 단일 복제본 Redis 마스터 파드를 실행하는 디플로이먼트 컨트롤러를 지정한다.

{{< codenew file="application/guestbook/redis-master-deployment.yaml" >}}

1. 매니페스트 파일을 다운로드한 디렉토리에서 터미널 창을 시작한다.
1. `redis-master-deployment.yaml` 파일을 통해 Redis 마스터의 디플로이먼트에 적용시킨다.

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-deployment.yaml
      ```

1. 파드의 목록을 질의하여 Redis 마스터 파드가 실행 중인지 확인한다.

      ```shell
      kubectl get pods
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```shell
      NAME                            READY     STATUS    RESTARTS   AGE
      redis-master-1068406935-3lswp   1/1       Running   0          28s
      ```

1. Redis 마스터 파드에서 로그를 보려면 다음 명령어를 실행한다.

     ```shell
     kubectl logs -f POD-NAME
     ```

{{< note >}}
POD-NAME을 해당 파드 이름으로 수정해야 한다.
{{< /note >}}

### Redis 마스터 서비스 생성하기

방명록 애플리케이션에서 데이터를 쓰려면 Redis 마스터와 통신해야 한다. Redis 마스터 파드로 트래픽을 프록시하려면 [서비스](/docs/concepts/services-networking/service/)를 적용해야 한다. 서비스는 파드에 접근하기 위한 정책을 정의한다.

{{< codenew file="application/guestbook/redis-master-service.yaml" >}}

1. `redis-master-service.yaml` 파일을 통해 Redis 마스터 서비스에 적용시킨다.

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-service.yaml
      ```

1. 서비스의 목록을 질의하여 Redis 마스터 서비스가 실행 중인지 확인한다.

      ```shell
      kubectl get service
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```shell
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    1m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP   8s
      ```

{{< note >}}
이 매니페스트 파일은 이전에 정의된 레이블과 일치하는 레이블 집합을 가진 `redis-master`라는 서비스를 생성하므로, 서비스는 네트워크 트래픽을 Redis 마스터 파드로 라우팅한다.
{{< /note >}}


## Redis 슬레이브 실행하기

Redis 마스터는 단일 파드이지만, 복제된 Redis 슬레이브를 추가하여 트래픽 요구 사항을 충족시킬 수 있다.

### Redis 슬레이브의 디플로이먼트 생성하기

디플로이먼트는 매니페스트 파일에 설정된 구성에 따라 확장된다. 이 경우, 디플로이먼트 오브젝트는 두 개의 복제본을 지정한다.

실행 중인 복제본이 없으면, 이 디플로이먼트는 컨테이너 클러스터에 있는 두 개의 복제본을 시작한다. 반대로 두 개 이상의 복제본이 실행 중이면, 두 개의 복제본이 실행될 때까지 축소된다.

{{< codenew file="application/guestbook/redis-slave-deployment.yaml" >}}

1. `redis-slave-deployment.yaml` 파일을 통해 Redis 슬레이브의 디플로이먼트에 적용시킨다.

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-deployment.yaml
      ```

1. 파드의 목록을 질의하여 Redis 슬레이브 파드가 실행 중인지 확인한다.

      ```shell
      kubectl get pods
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```shell
      NAME                            READY     STATUS              RESTARTS   AGE
      redis-master-1068406935-3lswp   1/1       Running             0          1m
      redis-slave-2005841000-fpvqc    0/1       ContainerCreating   0          6s
      redis-slave-2005841000-phfv9    0/1       ContainerCreating   0          6s
      ```

### Redis 슬레이브 서비스 생성하기

방명록 애플리케이션은 Redis 슬레이브와 통신하여 데이터를 읽는다. Redis 슬레이브를 확인할 수 있도록 하기 위해 서비스를 설정해야 한다. 서비스는 파드 집합에 투명한 로드 밸런싱을 제공한다.

{{< codenew file="application/guestbook/redis-slave-service.yaml" >}}

1. `redis-slave-service.yaml` 파일을 통해 Redis 슬레이브 서비스에 적용시킨다.

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-service.yaml
      ```

1. 서비스의 목록을 질의하여 Redis 슬레이브 서비스가 실행 중인지 확인한다.

      ```shell
      kubectl get services
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    2m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP   1m
      redis-slave    ClusterIP   10.0.0.223   <none>        6379/TCP   6s
      ```

## 방명록 프론트엔드를 설정하고 노출시키기

방명록 애플리케이션에는 PHP로 작성된 HTTP 요청을 처리하는 웹 프론트엔드가 있다. 쓰기 요청을 위한 `redis-master` 서비스와 읽기 요청을 위한 `redis-slave` 서비스에 연결하도록 설정된다.

### 방명록 프론트엔드의 디플로이먼트 생성하기

{{< codenew file="application/guestbook/frontend-deployment.yaml" >}}

1. `frontend-deployment.yaml` 파일을 통해 프론트엔드의 디플로이먼트에 적용시킨다.

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
      ```

1. 파드의 목록을 질의하여 세 개의 프론트엔드 복제본이 실행되고 있는지 확인한다.

      ```shell
      kubectl get pods -l app=guestbook -l tier=frontend
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      NAME                        READY     STATUS    RESTARTS   AGE
      frontend-3823415956-dsvc5   1/1       Running   0          54s
      frontend-3823415956-k22zn   1/1       Running   0          54s
      frontend-3823415956-w9gbt   1/1       Running   0          54s
      ```

### 프론트엔드 서비스 생성하기

서비스의 기본 유형은 [ClusterIP](/docs/concepts/services-networking/service/#publishing-services---service-types)이기 때문에 적용한 redis-slave 및 redis-master 서비스는 컨테이너 클러스터 내에서만 접근할 수 있다. `ClusterIP`는 서비스가 가리키는 파드 집합에 대한 단일 IP 주소를 제공한다. 이 IP 주소는 클러스터 내에서만 접근할 수 있다.

게스트가 방명록에 접근할 수 있도록 하려면, 외부에서 볼 수 있도록 프론트엔드 서비스를 구성해야 한다. 그렇게 하면 클라이언트가 컨테이너 클러스터 외부에서 서비스를 요청할 수 있다. Minikube는 `NodePort`를 통해서만 서비스를 노출할 수 있다.

{{< note >}}
Google Compute Engine 또는 Google Kubernetes Engine과 같은 일부 클라우드 공급자는 외부 로드 밸런서를 지원한다. 클라우드 공급자가 로드 밸런서를 지원하고 이를 사용하려면 `type : NodePort`를 삭제하거나 주석 처리하고 `type : LoadBalancer`의 주석을 제거해야 한다.
{{< /note >}}

{{< codenew file="application/guestbook/frontend-service.yaml" >}}

1. `frontend-service.yaml` 파일을 통해 프론트엔드 서비스에 적용시킨다.

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
      ```

1. 서비스의 목록을 질의하여 프론트엔드 서비스가 실행 중인지 확인한다.

      ```shell
      kubectl get services 
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
      frontend       NodePort    10.0.0.112   <none>       80:31323/TCP   6s
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP        4m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP       2m
      redis-slave    ClusterIP   10.0.0.223   <none>        6379/TCP       1m
      ```

### `NodePort`를 통해 프론트엔드 서비스 확인하기

애플리케이션을 Minikube 또는 로컬 클러스터에 배포한 경우, 방명록을 보려면 IP 주소를 찾아야 한다.

1. 프론트엔드 서비스의 IP 주소를 얻기 위해 아래 명령어를 실행한다.

      ```shell
      minikube service frontend --url
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      http://192.168.99.100:31323
      ```

1. IP 주소를 복사하고, 방명록을 보기 위해 브라우저에서 페이지를 로드한다.

### `LoadBalancer`를 통해 프론트엔드 서비스 확인하기

`frontend-service.yaml` 매니페스트를 `LoadBalancer`와 함께 배포한 경우, 방명록을 보기 위해 IP 주소를 찾아야 한다.

1. 프론트엔드 서비스의 IP 주소를 얻기 위해 아래 명령어를 실행한다.

      ```shell
      kubectl get service frontend
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      NAME       TYPE        CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
      frontend   ClusterIP   10.51.242.136   109.197.92.229     80:32372/TCP   1m
      ```

1. IP 주소를 복사하고, 방명록을 보기 위해 브라우저에서 페이지를 로드한다.

## 웹 프론트엔드 확장하기

서버가 디플로이먼트 컨트롤러를 사용하는 서비스로 정의되어 있기 때문에 확장 또는 축소가 쉽다.

1. 프론트엔드 파드의 수를 확장하기 위해 아래 명령어를 실행한다.

      ```shell
      kubectl scale deployment frontend --replicas=5
      ```

1. 파드의 목록을 질의하여 실행 중인 프론트엔드 파드의 수를 확인한다.

      ```shell
      kubectl get pods
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      NAME                            READY     STATUS    RESTARTS   AGE
      frontend-3823415956-70qj5       1/1       Running   0          5s
      frontend-3823415956-dsvc5       1/1       Running   0          54m
      frontend-3823415956-k22zn       1/1       Running   0          54m
      frontend-3823415956-w9gbt       1/1       Running   0          54m
      frontend-3823415956-x2pld       1/1       Running   0          5s
      redis-master-1068406935-3lswp   1/1       Running   0          56m
      redis-slave-2005841000-fpvqc    1/1       Running   0          55m
      redis-slave-2005841000-phfv9    1/1       Running   0          55m
      ```

1. 프론트엔드 파드의 수를 축소하기 위해 아래 명령어를 실행한다.

      ```shell
      kubectl scale deployment frontend --replicas=2
      ```

1. 파드의 목록을 질의하여 실행 중인 프론트엔드 파드의 수를 확인한다.

      ```shell
      kubectl get pods
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      NAME                            READY     STATUS    RESTARTS   AGE
      frontend-3823415956-k22zn       1/1       Running   0          1h
      frontend-3823415956-w9gbt       1/1       Running   0          1h
      redis-master-1068406935-3lswp   1/1       Running   0          1h
      redis-slave-2005841000-fpvqc    1/1       Running   0          1h
      redis-slave-2005841000-phfv9    1/1       Running   0          1h
      ```
        
{{% /capture %}}

{{% capture cleanup %}}
디플로이먼트 및 서비스를 삭제하면 실행 중인 모든 파드도 삭제된다. 레이블을 사용하여 하나의 명령어로 여러 자원을 삭제해보자.

1. 모든 파드, 디플로이먼트, 서비스를 삭제하기 위해 아래 명령어를 실행한다.

      ```shell
      kubectl delete deployment -l app=redis
      kubectl delete service -l app=redis
      kubectl delete deployment -l app=guestbook
      kubectl delete service -l app=guestbook
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      deployment.apps "redis-master" deleted
      deployment.apps "redis-slave" deleted
      service "redis-master" deleted
      service "redis-slave" deleted
      deployment.apps "frontend" deleted    
      service "frontend" deleted
      ```
       
1. 파드의 목록을 질의하여 실행 중인 파드가 없는지 확인한다.

      ```shell
      kubectl get pods
      ```

      결과는 아래와 같은 형태로 나타난다.

      ```
      No resources found.
      ```

{{% /capture %}}

{{% capture whatsnext %}}
* [ELK 로깅과 모니터링](/ko/docs/tutorials/stateless-application/guestbook-logs-metrics-with-elk/)을 방명록 애플리케이션에 추가하기
* [쿠버네티스 기초](/ko/docs/tutorials/kubernetes-basics/) 튜토리얼을 완료
* [MySQL과 Wordpress을 위한 퍼시스턴트 볼륨](/ko/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)을 사용하여 블로그 생성하는데 쿠버네티스 이용하기
* [애플리케이션 접속](/docs/concepts/services-networking/connect-applications-service/)에 대해 더 알아보기
* [자원 관리](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)에 대해 더 알아보기
{{% /capture %}}

