---
# reviewers:
# - davidopp
# - madhusudancs
title: 다중 스케줄러 설정
content_type: task
weight: 20
---

<!-- overview -->

쿠버네티스는 [여기](/docs/reference/command-line-tools-reference/kube-scheduler/)에서
설명한 스케줄러를 기본 스케줄러로 사용한다.
만일 기본 스케줄러가 사용자의 필요를 만족시키지 못한다면 직접 스케줄러를 구현하여 사용할 수 있다.
이에 더해, 기본 스케줄러와 함께 여러 스케줄러를 동시에 사용하여
쿠버네티스가 각 파드에 대해 어떤 스케줄러를 적용할지에 대한 설정도 할 수 있다.
예제와 함께 쿠버네티스에서 다중 스케줄러를 사용하는 방법에 대해 배워보도록 하자.

스케줄러를 구현하는 방법에 대한 자세한 설명은 해당 문서에서 다루지 않는다.
kube-scheduler 구현을 다루는 공식 예시는 쿠버네티스 소스 디렉토리에 있는
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)
를 참고한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## 스케줄러 패키징

스케줄러 바이너리를 컨테이너 이미지로 패키징한다. 해당 예제를 통해
기본 스케줄러 (kube-scheduler)를 두 번째 스케줄러로 사용할 수 있다.
[GitHub 쿠버네티스 소스코드](https://github.com/kubernetes/kubernetes)를 
클론하고 소스를 빌드하자.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

kube-scheduler 바이너리를 담은 컨테이너 이미지를 생성하자.
이미지를 빌드 하기 위한 `Dockerfile`은 다음과 같다.

```docker
FROM busybox
ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

파일을 `Dockerfile`로 저장하고 이미지를 빌드한 후 레지스트리로 푸시하자. 해당 예제에서는 이미지를
[Google Container Registry (GCR)](https://cloud.google.com/container-registry/)로
푸시하고 있다.
이에 대한 자세한 내용은 GCR
[문서](https://cloud.google.com/container-registry/docs/)를 참고하자.

```shell
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0
```

## 스케줄러에서 사용할 쿠버네티스 디플로이먼트 정의하기

이제 스케줄러 컨테이너 이미지가 있으니, 해당 이미지를 포함하는 파드 구성을 생성하고
쿠버네티스 클러스터 내에서 실행해보자. 해당 예제에서는, 클러스터 내에 직접 파드를 생성하는 대신에
[디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/)를 사용해도 된다.
[디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/)는
[레플리카 셋](/ko/docs/concepts/workloads/controllers/replicaset/)을 관리하며,
이는 또 파드를 관리하기 때문에 스케줄러에 대한 회복 탄력성을 제공한다.
다음은 디플로이먼트에 대한 구성 파일이다. 이 파일을 `my-scheduler.yaml`으로 저장한다.

{{< codenew file="admin/sched/my-scheduler.yaml" >}}

해당 매니페스트에서는 [KubeSchedulerConfiguration](/ko/docs/reference/scheduling/config/)을 
사용하여 구현할 스케줄러의 특성을 정의한다. 이러한 설정은 초기화 과정에서 `--config` 옵션을 통해 `kube-scheduler`에게 전달된다.
해당 구성 파일은 `my-scheduler-config` 컨피그맵에 저장된다. `my-scheduler` 디플로이먼트의 파드에서는 `my-scheduler-config` 컨피그맵을 볼륨으로 마운트 시킨다.

앞서 언급한 스케줄러 구성에서는, 구현한 스케줄러가
[KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile)의 형식으로 나타나게 된다.
{{< note >}}
스케줄러가 특정 파드에 대한 스케줄링을 수행하는지 판단하기 위해서는, PodTemplate 또는 파드 매니페스트의
`spec.schedulerName` 필드가 `KubeSchedulerProfile`의 `schedulerName` 필드와 일치하는지 확인해야 한다.
클러스터 내 실행되고 있는 모든 스케줄러는 고유한 이름을 가져야 한다.
{{< /note >}}

또한, `kube-scheduler`와 같은 권한을 부여받기 위해서는 전용 서비스 어카운트 `my-scheduler`를 생성하고
해당 서비스 어카운트를 클러스터롤 `system:kube-scheduler`와 바인딩해야 한다.

이외의 커맨드 라인 인자에 대한 자세한 설명은
[kube-scheduler 문서](/docs/reference/command-line-tools-reference/kube-scheduler/)에서 참고하고
이외의 사용자 정의 `kube-scheduler` 구성에 대한 자세한 설명은
[스케줄러 구성 레퍼런스](/docs/reference/config-api/kube-scheduler-config.v1beta3/)
에서 참고한다.

## 두 번째 스케줄러를 클러스터에서 실행하기

쿠버네티스 클러스터에서 스케줄러를 실행하기 위해서,
위의 구성 파일에서 명시한 디플로이먼트를 쿠버네티스 클러스터 내에 생성한다.

```shell
kubectl create -f my-scheduler.yaml
```

스케줄러 파드가 실행되고 있는지 확인한다.

```shell
kubectl get pods --namespace=kube-system
```

```
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

기본 kube-scheduler 파드와 더불어,
my-scheduler 파드가 실행("Running")되고 있다는 것을 목록에서 볼 수 있을 것이다.

### 리더 선출 활성화

리더 선출이 활성화된 상태로 다중 스케줄러를 실행하기 위해서는 다음과 같은 작업을 수행해야 한다.

`my-scheduler-config` 컨피그맵의 YAML 파일에서 KubeSchedulerConfiguration의 다음과 같은 필드들을 갱신한다.

* `leaderElection.leaderElect` 를 `true` 로
* `leaderElection.resourceNamespace` 를 `<lock-object-namespace>` 로
* `leaderElection.resourceName` 을 `<lock-object-name>` 으로

{{< note >}}
컨트롤 플레인이 잠금 오브젝트를 생성해 주지만, 해당 네임스페이스가 존재하는 상태이어야 한다.
`kube-system` 네임스페이스를 사용해도 된다.
{{< /note >}}

클러스터 내에 RBAC가 활성화되어 있는 상태라면, `system:kube-scheduler` 클러스터롤을 업데이트 해야 한다.
다음 예시와 같이, 구현한 스케줄러의 이름을 `endpoints`와 `leases` 리소스에 적용되는 룰의 resourceNames에 추가하자.

```shell
kubectl edit clusterrole system:kube-scheduler
```

{{< codenew file="admin/sched/clusterrole.yaml" >}}

## 파드의 스케줄러를 지정하기

이제 두 번째 스케줄러가 실행되고 있으니,
파드를 몇 개 생성하여 기본 스케줄러 또는 새로 배치한 스케줄러에 의해 스케줄링이 되도록 설정해 보자.
특정 스케줄러를 이용하여 파드를 스케줄링하기 위해서는
해당 파드의 명세에 해당 스케줄러의 이름을 명시해야 한다. 세 가지 예시를 참고해 보자.

- 스케줄러 이름을 명시하지 않은 파드 명세

  {{< codenew file="admin/sched/pod1.yaml" >}}

  스케줄러 이름을 제공받지 못했다면,
  파드는 자동으로 기본 스케줄러에 의해 스케줄링이 수행된다.

  해당 파일을 `pod1.yaml`로 저장하고 쿠버네티스 클러스터에 제출해 보자.

  ```shell
  kubectl create -f pod1.yaml
  ```

- `default-scheduler`를 명시한 파드 명세

  {{< codenew file="admin/sched/pod2.yaml" >}}

  `spec.schedulerName`의 값으로 스케줄러 이름을 제공함으로써 스케줄러가 정해진다.
  이와 같은 경우에서는, 기본 스케줄러의 이름인 `default-scheduler`를 명시하고 있다.

  해당 파일을 `pod2.yaml`로 저장하고 쿠버네티스 클러스터에 제출해 보자.

  ```shell
  kubectl create -f pod2.yaml
  ```

- `my-scheduler`를 명시한 파드 명세

  {{< codenew file="admin/sched/pod3.yaml" >}}

  이와 같은 경우에서는, 직접 배치한 스케줄러 - `my-scheduler`를 통해
  해당 파드의 스케줄링이 수행되어야 한다는 것을 명시하고 있다.
  `spec.schedulerName`의 값은 `KubeSchedulerProfile` 매핑의  `schedulerName` 필드와 일치해야 한다.

  해당 파일을 `pod3.yaml`로 저장하고 쿠버네티스 클러스터에 제출해 보자.

  ```shell
  kubectl create -f pod3.yaml
  ```

  세 개의 파드가 모두 실행되고 있는지 확인해 보자.

  ```shell
  kubectl get pods
  ```

<!-- discussion -->

### 파드가 원하는 스케줄러에 의해 스케줄링 되었는지 확인해보기

이번 예제들을 수월하게 진행하기 위해,
파드가 실제로 원하는 스케줄러에 의해 스케줄링되고 있는지 확인해 보지 않았다.
해당 사항은 파드와 디플로이먼트 구성 파일의 제출 순서를 바꿔보면 확인해 볼 수 있다.
만일 스케줄러 디플로이먼트 구성 파일을 제출하기 전에 모든 파드의 구성 파일을 쿠버네티스 클러스터에 제출한다면,
다른 두 개의 파드는 스케줄링 되는 와중에 `annotation-second-scheduler` 파드는
무기한 "Pending" 상태에 머무르는 것을 관찰할 수 있다.
스케줄러 디플로이먼트 구성 파일을 제출하여 새로운 스케줄러가 실행되기 시작하면,
`annotation-second-scheduler` 파드도 스케줄링 된다.

다른 방법으로는, 이벤트 로그에서 "Scheduled" 항목을 찾아
파드가 원하는 스케줄러에 의해 스케줄링 되었는지 확인해 볼 수 있다.

```shell
kubectl get events
```
또한, 관련된 컨트롤 플레인 노드들의 스태틱 파드 매니페스트를 수정하면 클러스터의 메인 스케줄러로
[사용자 정의 스케줄러 구성](/ko/docs/reference/scheduling/config/#여러-프로파일)
또는 사용자 정의 컨테이너 이미지를 사용할 수도 있다.

