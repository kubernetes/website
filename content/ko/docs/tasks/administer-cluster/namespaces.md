---
# reviewers:
# - derekwaynecarr
# - janetkuo
title: 네임스페이스를 사용해 클러스터 공유하기
content_type: task
---

<!-- overview -->
이 페이지는 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}를 살펴보고, 작업하고, 삭제하는 방법에 대해 다룬다. 또한 쿠버네티스 네임스페이스를 사용해 클러스터를 세분화하는 방법에 대해서도 다룬다.


## {{% heading "prerequisites" %}}

* [기존 쿠버네티스 클러스터](/ko/docs/setup/)가 있다.
* 쿠버네티스 {{< glossary_tooltip text="파드" term_id="pod" >}}, {{< glossary_tooltip term_id="service" text="서비스" >}}, 그리고 {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}에 대해 이해하고 있다.


<!-- steps -->

## 네임스페이스 보기

1. 아래 명령어를 사용해 클러스터의 현재 네임스페이스를 나열한다.

```shell
kubectl get namespaces
```
```
NAME          STATUS    AGE
default       Active    11d
kube-system   Active    11d
kube-public   Active    11d
```

쿠버네티스를 시작하면 세 개의 초기 네임스페이스가 있다.

   * `default` 다른 네임스페이스가 없는 오브젝트를 위한 기본 네임스페이스
   * `kube-system` 쿠버네티스 시스템에서 생성된 오브젝트의 네임스페이스
   * `kube-public` 이 네임스페이스는 자동으로 생성되며 모든 사용자(미인증 사용자를 포함)가 읽을 수 있다. 이 네임스페이스는 일부 리소스를 공개적으로 보고 읽을 수 있어야 하는 경우에 대비하여 대부분이 클러스터 사용을 위해 예약돼 있다. 그러나 이 네임스페이스의 공개적인 성격은 관례일 뿐 요구 사항은 아니다.
   
아래 명령을 실행해 특정 네임스페이스에 대한 요약 정보를 볼 수 있다.

```shell
kubectl get namespaces <name>
```

자세한 정보를 보는 것도 가능하다.

```shell
kubectl describe namespaces <name>
```
```
Name:           default
Labels:         <none>
Annotations:    <none>
Status:         Active

No resource quota.

Resource Limits
 Type       Resource    Min Max Default
 ----               --------    --- --- ---
 Container          cpu         -   -   100m
```

이러한 세부 정보에는 리소스 한도(limit) 범위 뿐만 아니라 리소스 쿼터(만약 있다면)까지 모두 표시된다.

리소스 쿼터는 *네임스페이스* 내 리소스의 집계 사용량을 추적하며, 
*네임스페이스*에서 사용할 수 있는 *하드(Hard)* 리소스 사용 제한을 클러스터 운영자가 정의할 수 있도록 해준다.

제한 범위는 하나의 엔티티(entity)가 하나의 *네임스페이스*에서 사용할 수 있는 
리소스 양에 대한 최대/최소 제약 조건을 정의한다.

[어드미션 컨트롤: 리밋 레인지(Limit Range)](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)를 참조하자.

네임스페이스는 다음 두 상태 중 하나에 있을 수 있다.

   * `Active` 네임스페이스가 사용 중이다.
   * `Terminating` 네임스페이스가 삭제 중이므로 새 오브젝트에 사용할 수 없다.

자세한 내용은 API 레퍼런스의 [네임스페이스](/docs/reference/kubernetes-api/cluster-resources/namespace-v1/)를
참조한다.

## 새 네임스페이스 생성하기

{{< note >}}
    `kube-` 접두사는 쿠버네티스 시스템 네임스페이스로 예약돼 있으므로 이를 사용해 네임스페이스를 생성하지 않도록 한다.
{{< /note >}}

1. `my-namespace.yaml`이라는 YAML 파일을 생성하고 아래 내용을 작성한다.

    ```yaml
    apiVersion: v1
    kind: Namespace
    metadata:
      name: <insert-namespace-name-here>
    ```
    다음 명령을 실행한다.
   
    ```
    kubectl create -f ./my-namespace.yaml
    ```

2. 아래 명령으로 네임스페이스를 생성할 수도 있다.

    ```
    kubectl create namespace <insert-namespace-name-here>
    ``` 

네임스페이스의 이름은 
유효한 [DNS 레이블](/ko/docs/concepts/overview/working-with-objects/names/#dns-label-names)이어야 한다.

옵션 필드인 `finalizer`는 네임스페이스가 삭제 될 때 관찰자가 리소스를 제거할 수 있도록 한다. 존재하지 않는 파이널라이저(finalizer)를 명시한 경우 네임스페이스는 생성되지만 사용자가 삭제하려 하면 `Terminating` 상태가 된다.

파이널라이저에 대한 자세한 내용은 네임스페이스 [디자인 문서](https://git.k8s.io/design-proposals-archive/architecture/namespaces.md#finalizers)에서 확인할 수 있다.

## 네임스페이스 삭제하기

다음 명령을 실행해 네임스페이스를 삭제한다.

```shell
kubectl delete namespaces <insert-some-namespace-name>
```

{{< warning >}}
이렇게 하면 네임스페이스의 _모든 것_ 이 삭제된다!
{{< /warning >}}

삭제는 비동기적이므로 삭제 후 한동안은 네임스페이스의 상태가 `Terminating`으로 보일 것이다.

## 쿠버네티스 네임스페이스를 사용해 클러스터 세분화하기

1. 기본 네임스페이스 이해하기

    기본적으로 쿠버네티스 클러스터는 클러스터에서 사용할 기본 파드, 서비스, 그리고 디플로이먼트(Deployment) 집합을 가지도록 
    클러스터를 프로비저닝 할 때 기본 네임스페이스를 인스턴스화한다.
    
    새 클러스터가 있다고 가정하고 아래 명령을 수행하면 사용 가능한 네임스페이스를 볼 수 있다.

    ```shell
    kubectl get namespaces
    ```
    ```
    NAME      STATUS    AGE
    default   Active    13m
    ```

2. 새 네임스페이스 생성하기

    이 예제에서는 내용을 저장할 쿠버네티스 네임스페이스를 추가로 두 개 생성할 것이다.

    개발과 프로덕션 유스케이스에서 공유 쿠버네티스 클러스터를 사용하는 조직이 있다고 가정하자.

    개발 팀은 애플리케이션을 구축하고 실행하는데 사용하는 파드, 서비스, 디플로이먼트의 목록을 볼 수 있는 공간을 클러스터에 유지하려 한다.
    이 공간에서는 쿠버네티스 리소스가 자유롭게 추가 및 제거되고, 
    누가 리소스를 수정할 수 있는지 없는지에 대한 제약이 완화돼 빠른 개발이 가능해진다.

    운영 팀은 운영 사이트를 실행하는 파드, 서비스, 디플로이먼트 집합을 조작할 수 있는 사람과 
    그렇지 않은 사람들에 대해 엄격한 절차를 적용할 수 있는 공간을 클러스터에 유지하려 한다.

    이 조직이 따를 수 있는 한 가지 패턴은 쿠버네티스 클러스터를 `development(개발)`와 `production(운영)`이라는 두 개의 네임스페이스로 분할하는 것이다.

    우리의 작업을 보존하기 위해 새로운 네임스페이스 두 개를 만들자.

    kubectl을 사용해 `development` 네임스페이스를 생성한다.

    ```shell
    kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
    ```

    그런 다음 kubectl을 사용해 `production` 네임스페이스를 생성한다.

    ```shell
    kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
    ```

    제대로 생성이 되었는지 확인하기 위해 클러스터 내의 모든 네임스페이스를 나열한다.

    ```shell
    kubectl get namespaces --show-labels
    ```
    ```
    NAME          STATUS    AGE       LABELS
    default       Active    32m       <none>
    development   Active    29s       name=development
    production    Active    23s       name=production
    ```

3. 네임스페이스마다 파드 생성

    쿠버네티스 네임스페이스는 클러스터의 파드, 서비스 그리고 디플로이먼트의 범위를 제공한다.

    하나의 네임스페이스와 상호 작용하는 사용자는 다른 네임스페이스의 내용을 볼 수 없다.

    이를 보여주기 위해 `development` 네임스페이스에 간단한 디플로이먼트와 파드를 생성하자.

    ```shell
    kubectl create deployment snowflake --image=registry.k8s.io/serve_hostname  -n=development --replicas=2
    ```
    단순히 호스트명을 제공해주는 `snowflake`라는 파드의 개수를 2개로 유지하는 디플로이먼트를 생성하였다.

    ```shell
    kubectl get deployment -n=development
    ```
    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    snowflake    2/2     2            2           2m
    ```
    ```shell
    kubectl get pods -l app=snowflake -n=development
    ```
    ```
    NAME                         READY     STATUS    RESTARTS   AGE
    snowflake-3968820950-9dgr8   1/1       Running   0          2m
    snowflake-3968820950-vgc4n   1/1       Running   0          2m
    ```

    개발자들은 `production` 네임스페이스의 내용에 영향을 끼칠 걱정 없이 하고 싶은 것을 할 수 있으니 대단하지 않은가.

    이제 `production` 네임스페이스로 전환해 한 네임스페이스의 리소스가 다른 네임스페이스에서는 어떻게 숨겨지는지 보자.

    `production` 네임스페이스는 비어있어야 하며 아래 명령은 아무 것도 반환하지 않아야 한다.

    ```shell
    kubectl get deployment -n=production
    kubectl get pods -n=production
    ```

    프로덕션이 가축 키우는 것을 좋아하듯이, 우리도 `production` 네임스페이스에 cattle(가축)이라는 이름의 파드를 생성한다.

    ```shell
    kubectl create deployment cattle --image=registry.k8s.io/serve_hostname -n=production
    kubectl scale deployment cattle --replicas=5 -n=production

    kubectl get deployment -n=production
    ```
    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    cattle       5/5     5            5           10s
    ```

    ```shell
    kubectl get pods -l app=cattle -n=production
    ```
    ```
    NAME                      READY     STATUS    RESTARTS   AGE
    cattle-2263376956-41xy6   1/1       Running   0          34s
    cattle-2263376956-kw466   1/1       Running   0          34s
    cattle-2263376956-n4v97   1/1       Running   0          34s
    cattle-2263376956-p5p3i   1/1       Running   0          34s
    cattle-2263376956-sxpth   1/1       Running   0          34s
    ```

지금 쯤이면 사용자가 한 네임스페이스에 생성한 리소스는 다른 네임스페이스에서 숨겨져 있어야 한다는 것을 잘 알고 있을 것이다.

쿠버네티스 정책 지원이 발전함에 따라, 이 시나리오를 확장해 각 네임스페이스에 
서로 다른 인증 규칙을 제공하는 방법을 보이도록 하겠다.



<!-- discussion -->

## 네임스페이스의 사용 동기 이해하기

단일 클러스터는 여러 사용자 및 사용자 그룹(이하 '사용자 커뮤니티')의 요구를 충족시킬 수 있어야 한다.

쿠버네티스 _네임스페이스_ 는 여러 프로젝트, 팀 또는 고객이 쿠버네티스 클러스터를 공유할 수 있도록 지원한다.

이를 위해 다음을 제공한다.

1. [이름](/ko/docs/concepts/overview/working-with-objects/names/)에 대한 범위
2. 인증과 정책을 클러스터의 하위 섹션에 연결하는 메커니즘

여러 개의 네임스페이스를 사용하는 것은 선택 사항이다.

각 사용자 커뮤니티는 다른 커뮤니티와 격리된 상태로 작업할 수 있기를 원한다.

각 사용자 커뮤니티는 다음을 가진다.

1. 리소스 (파드, 서비스, 레플리케이션 컨트롤러(replication controller) 등
2. 정책 (커뮤니티에서 조치를 수행할 수 있거나 없는 사람)
3. 제약 조건 (해당 커뮤니티에서는 어느 정도의 쿼터가 허용되는지 등)

클러스터 운영자는 각 사용자 커뮤니티 마다 네임스페이스를 생성할 수 있다.

네임스페이스는 다음을 위한 고유한 범위를 제공한다.

1. (기본 명명 충돌을 방지하기 위해) 명명된 리소스
2. 신뢰할 수 있는 사용자에게 관리 권한 위임
3. 커뮤니티 리소스 소비를 제한하는 기능

유스케이스는 다음을 포함한다.

1.  클러스터 운영자로서 단일 클러스터에서 여러 사용자 커뮤니티를 지원하려 한다.
2.  클러스터 운영자로서 클러스터 분할에 대한 권한을 
    해당 커뮤니티의 신뢰할 수 있는 사용자에게 위임하려 한다.
3.  클러스터 운영자로서 클러스터를 사용하는 다른 커뮤니티에 미치는 영향을 제한하기 위해 
    각 커뮤니티가 사용할 수 있는 리소스의 양을 제한하고자 한다.
4.  클러스터 사용자로서 다른 사용자 커뮤니티가 클러스터에서 수행하는 작업과는 별도로 
    사용자 커뮤니티와 관련된 리소스와 상호 작용하고 싶다.

## 네임스페이스와 DNS 이해하기

[서비스](/ko/docs/concepts/services-networking/service/)를 생성하면 상응하는 [DNS 엔트리(entry)](/ko/docs/concepts/services-networking/dns-pod-service/)가 생성된다.
이 엔트리는 `<서비스-이름><네임스페이스=이름>.svc.cluster.local` 형식을 갖는데, 
컨테이너가 `<서비스-이름>`만 갖는 경우에는 네임스페이스에 국한된 서비스로 연결된다.
이 기능은 개발, 스테이징 및 프로덕션과 같이 
여러 네임스페이스 내에서 동일한 설정을 사용할 때 유용하다. 
네임스페이스를 넘어서 접근하려면 전체 주소 도메인 이름(FQDN)을 사용해야 한다.



## {{% heading "whatsnext" %}}

* [네임스페이스 선호(preference)](/ko/docs/concepts/overview/working-with-objects/namespaces/#선호하는-네임스페이스-설정하기)에 대해 자세히 알아보기.
* [요청(request)에 대한 네임스페이스 설정](/ko/docs/concepts/overview/working-with-objects/namespaces/#요청에-네임스페이스-설정하기)에 대해 자세히 알아보기.
* [네임스페이스 설계](https://git.k8s.io/design-proposals-archive/architecture/namespaces.md) 참조하기.


