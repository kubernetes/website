---
title: 단일 인스턴스 스테이트풀 애플리케이션 실행하기
content_type: tutorial
weight: 20
---

<!-- overview -->

이 페이지에서는 쿠버네티스 클러스터에서 퍼시스턴트볼륨(PersistentVolume)과 디플로이먼트(Deployment)를 
사용하여, 단일 인스턴스 스테이트풀 애플리케이션을 실행하는 방법을 보인다.
해당 애플리케이션은 MySQL이다.




## {{% heading "objectives" %}}


* 사용자 환경의 디스크를 참조하는 퍼시스턴트볼륨 생성하기
* MySQL 디플로이먼트 생성하기
* 알려진 DNS 이름으로 클러스터의 다른 파드에 MySQL 서비스 노출하기




## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* {{< include "default-storage-class-prereqs.md" >}}





<!-- lessoncontent -->

## MySQL 배포하기

쿠버네티스 디플로이먼트를 생성하고 퍼시스턴트볼륨클레임(PersistentVolumeClaim)을 
사용하는 기존 퍼시스턴트볼륨에 연결하여 스테이트풀 
애플리케이션을 실행할 수 있다. 예를 들어, 다음 YAML 파일은 
MySQL을 실행하고 퍼시스턴트볼륨클레임을 참조하는 디플로이먼트를 기술한다. 
이 파일은 /var/lib/mysql에 대한 볼륨 마운트를 정의한 후에, 
20G의 볼륨을 요청하는 퍼시트턴트볼륨클레임을 생성한다.
이 클레임은 요구 사항에 적합한 기존 볼륨이나
동적 프로비저너에 의해서 충족된다.

참고: config yaml 파일에 정의된 비밀번호는 안전하지 않다. 더 안전한 해결방법을 위해 
[쿠버네티스 시크릿](/ko/docs/concepts/configuration/secret/)
을 보자

{{< codenew file="application/mysql/mysql-deployment.yaml" >}}
{{< codenew file="application/mysql/mysql-pv.yaml" >}}

1. YAML 파일의 PV와 PVC를 배포한다.

        kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml

1. YAML 파일의 다른 오브젝트들을 배포한다.

        kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml

1. 디플로이먼트에 관한 정보를 확인한다.

        kubectl describe deployment mysql

    출력은 다음과 유사하다.

        Name:                 mysql
        Namespace:            default
        CreationTimestamp:    Tue, 01 Nov 2016 11:18:45 -0700
        Labels:               app=mysql
        Annotations:          deployment.kubernetes.io/revision=1
        Selector:             app=mysql
        Replicas:             1 desired | 1 updated | 1 total | 0 available | 1 unavailable
        StrategyType:         Recreate
        MinReadySeconds:      0
        Pod Template:
          Labels:       app=mysql
          Containers:
           mysql:
            Image:      mysql:5.6
            Port:       3306/TCP
            Environment:
              MYSQL_ROOT_PASSWORD:      password
            Mounts:
              /var/lib/mysql from mysql-persistent-storage (rw)
          Volumes:
           mysql-persistent-storage:
            Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
            ClaimName:  mysql-pv-claim
            ReadOnly:   false
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     False   MinimumReplicasUnavailable
          Progressing   True    ReplicaSetUpdated
        OldReplicaSets:       <none>
        NewReplicaSet:        mysql-63082529 (1/1 replicas created)
        Events:
          FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
          ---------    --------    -----    ----                -------------    --------    ------            -------
          33s          33s         1        {deployment-controller }             Normal      ScalingReplicaSet Scaled up replica set mysql-63082529 to 1

1. 디플로이먼트로 생성된 파드를 나열한다.

        kubectl get pods -l app=mysql

    출력은 다음과 유사하다.

        NAME                   READY     STATUS    RESTARTS   AGE
        mysql-63082529-2z3ki   1/1       Running   0          3m

1. 퍼시스턴트볼륨클레임을 살펴본다.

        kubectl describe pvc mysql-pv-claim

    출력은 다음과 유사하다.

        Name:         mysql-pv-claim
        Namespace:    default
        StorageClass:
        Status:       Bound
        Volume:       mysql-pv-volume
        Labels:       <none>
        Annotations:    pv.kubernetes.io/bind-completed=yes
                        pv.kubernetes.io/bound-by-controller=yes
        Capacity:     20Gi
        Access Modes: RWO
        Events:       <none>

## MySQL 인스턴스 접근하기

이전의 YAML 파일은 클러스터의 다른 파드가 데이터베이스에 
접근할 수 있는 서비스를 생성한다. `clusterIP: None` 
서비스 옵션을 사용하면 서비스의 DNS 이름을 직접 파드의 IP 주소로 
해석하도록 처리한다. 이 방법은 서비스에서 연결되는 파드가 오직 하나 뿐이고, 
파드의 수를 더 늘릴 필요가 없는 경우에 가장 적합하다.

서버에 접속하기 위하여 MySQL 클라이언트를 실행한다.

```
kubectl run -it --rm --image=mysql:5.6 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

이 명령어는 MySQL 클라이언트를 실행하는 파드를 클러스터에 생성하고, 
서비스를 통하여 서버에 연결한다. 연결된다면, 스테이트풀 
MySQL 데이터베이스가 실행 중임을 알 수 있다.

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## 업데이트하기

`kubectl apply` 명령을 사용하여 기존과 동일한 방식으로 디플로이먼트의 
이미지나 다른 부분을 변경할 수 있다. 스테이트풀 애플리케이션과 관련하여 몇 가지 
주의 사항이 있다.

* 애플리케이션을 스케일링하지 않는다. 이 설정은 단일 인스턴스 애플리케이션 전용이다. 
  기본적인 퍼시스턴트볼륨은 하나의 파드에서만 마운트할 수 있다. 
  클러스터 형태의 스테이트풀 애플리케이션에 대해서는
  [스테이트풀셋](/ko/docs/concepts/workloads/controllers/statefulset/)을 보자.
* 디플로이먼트 구성 YAML 파일에서 `strategy:` 
  `type: Recreate` 를 사용한다. 이는 쿠버네티스가 
  롤링 업데이트를 사용하지 _않도록_ 지시한다. 동시에 두 개 이상의 파드를 생성할 
  수 없으므로, 롤링 업데이트는 일어나지 않게 된다. `Recreate` 전략을 사용하면
  변경된 구성으로 새로운 파드를 생성하기에 앞서 기존의 파드를 중단한다.

## 디플로이먼트 삭제하기

이름으로 배포된 오브젝트를 삭제한다.

```
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

퍼시스턴트볼륨을 수동으로 프로비저닝한 경우라면,
동일하게 수동으로 삭제하고 기본 리소스도 해제해야 한다.
동적 프로비저너를 사용한 경우, 퍼시스턴트볼륨클레임이 
삭제되었을 때에 퍼시스턴트볼륨 또한 자동으로 삭제된다.
일부 동적 프로비저너(EBS 와 PD와 같은)는 
퍼시스턴트볼륨을 삭제할 때에 기본 리소스도 해제한다.




## {{% heading "whatsnext" %}}


* [디플로이먼트 오브젝트](/ko/docs/concepts/workloads/controllers/deployment/)에 대해 더 배워 보기

* [애플리케이션 배포하기](/docs/tasks/run-application/run-stateless-application-deployment/)에 대해 더 배워보기

* [kubectl run 문서](/docs/reference/generated/kubectl/kubectl-commands/#run)

* [볼륨](/ko/docs/concepts/storage/volumes/)과 [퍼시스턴트 볼륨](/ko/docs/concepts/storage/persistent-volumes/)




