---
title: 초기화 컨테이너
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
이 페이지는 초기화 컨테이너에 대한 개요를 제공한다. 초기화 컨테이너는 
앱 컨테이너들이 실행되기 전에 실행되는 특수한 컨테이너이며, 앱 이미지에는 없는 
유틸리티 또는 설정 스크립트 등을 포함할 수 있다.
{{% /capture %}}

이 특징은 1.6에서 베타를 빠져나왔다. 초기화 컨테이너는 앱 `containers` 배열과 나란히 
파드 스펙에 명시될 수 있다. 베타 어노테이션의 값은 여전히 존중되며 파드 스펙 필드 값을 덮어쓴다. 
하지만, 베타 어노테이션은 1.6과 1.7에서 사용 중단(deprecated)되었다.
1.8에서 어노테이션은 더는 지원되지 않으므로 파드 스펙 필드로 변환되어야 한다.

{{% capture body %}}
## 초기화 컨테이너 이해하기

[파드](/ko/docs/concepts/workloads/pods/pod-overview/)는 앱들을 실행하는 다수의 컨테이너를 
포함할 수 있다. 또한, 파드는 앱 컨테이너 실행 전에 동작되는 하나 이상의 
초기화 컨테이너도 포함할 수 있다. 

다음의 경우를 제외하면, 초기화 컨테이너는 일반적인 컨테이너와 매우 유사하다. 

* 초기화 컨테이너는 항상 완료를 목표로 실행된다.
* 각 초기화 컨테이너는 다음 초기화 컨테이너가 시작되기 전에 성공적으로 완료되어야 한다. 

만약 파드를 위한 초기화 컨테이너가 실패한다면, 쿠버네티스는 초기화 컨테이너가 성공할 때까지 파드를 
반복적으로 재시작한다. 그러나, 만약 파드가 `restartPolicy`을 절대 하지 않음(Never)으로 설정한다면, 파드는 재시작되지 않는다.

컨테이너를 초기화 컨테이너로 지정하기 위해서는, 파드 스펙에 앱 `containers` 배열과 나란히 
`initContainers` 필드를 
[컨테이너](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
타입 오브젝트들의 JSON 배열로서 추가한다.
초기화 컨테이너의 상태는 `.status.initContainerStatuses` 필드를 
통해서 컨테이너 상태 배열로 반환된다 (`.status.containerStatuses`와 
유사하게). 

### 일반적인 컨테이너와의 차이점

초기화 컨테이너는 앱 컨테이너의 리소스 상한, 볼륨, 보안 세팅을 포함한 
모든 필드와 특징을 지원한다. 그러나, 초기화 컨테이너를 위한 리소스 요청량과 상한은
약간 다르게 처리된다. 이것에 대해서는 아래 [리소스](#리소스)에 문서화되어 있다. 또한, 초기화 컨테이너는 
준비성 프로브(readiness probe)를 지원하지 않는다. 왜냐하면 초기화 컨테이너는 
파드가 준비 상태가 되기 전에 완료를 목표로 실행되어야 하기 
때문이다.

만약 다수의 초기화 컨테이너가 파드에 지정되어 있다면, 해당 초기화 컨테이너들은 순차적으로 
한 번에 하나씩 실행된다. 각 초기화 컨테이너들은 다음 초기화 컨테이너가 실행되기 전에 성공되어야 한다.
모든 초기화 컨테이너들이 실행 완료되었을 때, 쿠버네티스는 파드를 초기화하고 
애플리케이션 컨테이너를 평소와 같이 실행한다.

## 초기화 컨테이너는 무엇을 위해서 사용될 수 있는가?

초기화 컨테이너는 앱 컨테이너와는 별도의 이미지를 가지고 있기 때문에, 시동(start-up)에 
관련된 코드에 몇 가지 이점을 가진다.

* 보안 상 앱 컨테이너 이미지에서는 바람직하지 않은 유틸리티를 포함하고 
  실행시킬 수 있다.
* 앱 이미지에는 없는 셋업을 위한 유틸리티 또는 맞춤 코드를 포함한다.
  예를 들어, 셋업 중에 단지 `sed`, `awk`, `python`, 또는 `dig`와 같은 도구를 사용하기 위해서
  다른 이미지로부터(`FROM`) 새로운 이미지를 만들 필요가 없다.
* 애플리케이션 이미지 빌더와 디플로이어 역할은 독립적으로 동작될 수 있어서
  공동의 단일 앱 이미지 형태로 빌드될 필요가 없다.
* 초기화 컨테이너는 앱 컨테이너와 다른 파일 시스템 뷰를 가지도록 Linux 네임스페이스를 사용한다.
  결과적으로, 초기화 컨테이너에는 앱 컨테이너가 가질 수 없는 시크릿에 접근 권한이 주어질 수 있다.
* 앱 컨테이너들은 병렬로 실행되는 반면, 초기화 컨테이너들은 어떠한 앱 
  컨테이너라도 시작되기 전에 실행 완료되어야 하므로, 초기화 컨테이너는 사전 조건들이 
  충족될 때까지 앱 컨테이너가 시동되는 것을 막거나 지연시키는 간편한 방법을 제공한다.

### 예제
초기화 컨테이너를 사용하는 방법에 대한 몇 가지 아이디어는 다음과 같다.

* 다음과 같은 셀 커맨드로, 서비스가 생성될 때까지 기다리기.

      for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; done; exit 1

* 다음과 같은 커맨드로, 다운워드 API(Downward API)를 통한 원격 서버에 해당 파드를 등록하기.

      `curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'`

* `sleep 60`와 같은 커맨드로 앱 컨테이너가 시작되기 전에 일정 시간 기다리기.
* git 저장소를 볼륨 안에 클론하기.
* 설정 파일에 값을 지정하고 메인 앱 컨테이너를 위한 설정 파일을 동적으로 생성하기 위한 템플릿 도구를 실행하기.
  예를 들어, 설정에 POD_IP 값을 지정하고 메인 앱 설정 파일을 Jinja를 통해서 생성.

더 자세한 사용 예제는 [스테이트풀 셋 문서](/docs/concepts/workloads/controllers/statefulset/)
과 [프로덕션 파드 가이드](/docs/tasks/configure-pod-container/configure-pod-initialization/)에서 확인한다.

### 사용되고 있는 초기화 컨테이너

쿠버네티스 1.5에 대한 다음의 yaml 파일은 두 개의 초기화 컨테이너를 포함한 간단한 파드에 대한 개요를 보여준다. 
첫 번째는 `myservice`를 기다리고 두 번째는 `mydb`를 기다린다. 두 컨테이너들이 
완료되면, 파드가 시작될 것이다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
  annotations:
    pod.beta.kubernetes.io/init-containers: '[
        {
            "name": "init-myservice",
            "image": "busybox:1.28",
            "command": ["sh", "-c", "until nslookup myservice; do echo waiting for myservice; sleep 2; done;"]
        },
        {
            "name": "init-mydb",
            "image": "busybox:1.28",
            "command": ["sh", "-c", "until nslookup mydb; do echo waiting for mydb; sleep 2; done;"]
        }
    ]'
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
```

쿠버네티스 1.6에는 새로운 구문이 있다. 다만, 예전 어노테이션 구문도 1.6과 1.7에서는 여전히 동작한다. 새로운 구문은 
1.8 또는 더 높은 버전에서 사용되어야 한다. 초기화에 대한 선언은 `spec`으로 옮겨졌다. 

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', 'until nslookup myservice; do echo waiting for myservice; sleep 2; done;']
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', 'until nslookup mydb; do echo waiting for mydb; sleep 2; done;']
```

1.5 구문도 1.6에서 여전히 동작하지만, 1.6 구문 사용을 추천한다. 쿠버네티스 1.6에서는, 초기화 컨테이너가 API에서 필드로 
만들어졌었다. 베타 어노테이션은 1.6과 1.7에서 여전히 지원되지만, 1.8이나 더 높은 버전에서는 지원되지 않는다.

아래의 yaml file은 `mydb`와 `myservice` 서비스의 개요를 보여준다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

다음 커맨드들을 이용하여 파드를 시작하거나 디버깅할 수 있다.

```shell
kubectl apply -f myapp.yaml
```
```
pod/myapp-pod created
```

```shell
kubectl get -f myapp.yaml
```
```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

```shell
kubectl describe -f myapp.yaml
```
```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app=myapp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container with docker id 5ced34a04634; Security:[seccomp=unconfined]
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container with docker id 5ced34a04634
```
```shell
kubectl logs myapp-pod -c init-myservice # Inspect the first init container
kubectl logs myapp-pod -c init-mydb      # Inspect the second init container
```

`mydb` 및 `myservice` 서비스를 시작하고 나면, 초기화 컨테이너가 완료되고 
`myapp-pod`가 생성된 것을 볼 수 있다.

```shell
kubectl apply -f services.yaml
```
```
service/myservice created
service/mydb created
```

```shell
kubectl get -f myapp.yaml
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

이 예제는 매우 단순하지만 사용자만의 초기화 컨테이너를 생성하는데
영감을 줄 것이다.

## 자세한 동작

파드 시동 시, 네트워크와 볼륨이 초기화되고 나면, 초기화 컨테이너가 
순서대로 시작된다. 각 초기화 컨테이너는 다음 컨테이너가 시작되기 전에 성공적으로 
종료되어야 한다. 만약 런타임 문제나 실패 상태로 종료되는 문제로인하여 초기화 컨테이너의 시작이 
실패된다면, 초기화 컨테이너는 파드의 `restartPolicy`에 따라서 재시도 된다. 다만, 
파드의 `restartPolicy`이 항상(Always)으로 설정된 경우, 해당 초기화 컨테이너는 
`restartPolicy`을 실패 시(OnFailure)로 사용한다.

파드는 모든 초기화 컨테이너가 성공되기 전까지 `Ready`될 수 없다. 초기화 컨테이너의 포트는
서비스 하에 합쳐지지 않는다. 초기화 중인 파드는 `Pending` 상태이지만 
`Initializing`이 참이 되는 조건을 가져야 한다.

만약 파드가 [재시작](#파드-재시작-이유)되었다면, 모든 초기화 컨테이너는
반드시 다시 실행된다.

초기화 컨테이너 스펙 변경은 컨테이너 이미지 필드에서만 한정적으로 가능하다.
초기화 컨테이너 이미지 필드를 변경하는 것은 파드를 재시작하는 것과 같다.

초기화 컨테이너는 재시작되거나, 재시도, 또는 재실행 될 수 있기 때문에, 초기화 컨테이너
코드는 멱등성(indempotent)을 유지해야 한다. 특히, `EmptyDirs`에 있는 파일에 쓰기를 수행하는 코드는
출력 파일이 이미 존재할 가능성에 대비해야 한다.

초기화 컨테이너는 앱 컨테이너의 필드를 모두 가지고 있다. 그러나, 쿠버네티스는 
`readinessProbe`가 사용되는 것을 금지한다. 초기화 컨테이너가 완료 상태와 준비성을 
구분해서 정의할 수 없기 때문이다. 이것은 유효성 검사 중에 시행된다.

초기화 컨테이너들이 실패를 영원히 지속하는 상황을 방지하기 위해서 
파드의 `activeDeadlineSeconds`와 컨테이너의 `livenessProbe`를 
사용한다.

파드 내의 각 앱과 초기화 컨테이너의 이름은 유일해야 한다. 어떤 
컨테이너가 다른 컨테이너와 같은 이름을 공유하는 경우 유효성 오류가 발생한다.

### 리소스

초기화 컨테이너에게 명령과 실행이 주어진 경우, 리소스 사용에 대한 
다음의 규칙이 적용된다.

* 모든 컨테이너에 정의된 특정 리소스 요청량 또는 상한 중 가장 
  높은 것은 *유효한 초기화 요청량/상한* 이다.
* 리소스를 위한 파드의 *유효한 초기화 요청량/상한* 은 다음 보다 더 높다.
  * 모든 앱 컨테이너의 리소스에 대한 요청량/상한의 합계
  * 리소스에 대한 유효한 초기화 요청량/상한
* 스케줄링은 유효한 요청/상한에 따라 이루어진다. 즉, 
  초기화 컨테이너는 파드의 삶에서는 사용되지 않는 초기화를 위한 리소스를 
  예약할 수 있다. 
* 파드의 *유효한 QoS 계층* 에서 QoS 계층은 초기화 컨테이너들과 
  앱 컨테이너들의 QoS 계층과 같다.

쿼터 및 상한은 유효한 파드의 요청량 및 상한에 따라 
적용된다.

파드 레벨 cgroup은 유효한 파드 요청량 및 상한을 기반으로 한다. 이는 스케줄러와 같다.

### 파드 재시작 이유

파드는 다음과 같은 사유로, 초기화 컨테이너들의 재-실행을 일으키는, 재시작을 수행할 수 
있다.

* 사용자가 초기화 컨테이너 이미지의 변경을 일으키는 파드 스펙 업데이트를 수행했다. 
  Init Container 이미지를 변경하면 파드가 다시 시작된다. 앱 컨테이너 
  이미지의 변경은 앱 컨테이너만 재시작시킨다. 
* 파드 인프라스트럭처 컨테이너가 재시작되었다. 이는 일반적인 상황이 아니며 노드에 
  대해서 root 접근 권한을 가진 누군가에 의해서 수행됐을 것이다.
* 파드 내의 모든 컨테이너들이, 재시작을 강제하는 `restartPolicy`이 항상으로 설정되어 있는, 
  동안 종료되었다. 그리고 초기화 컨테이너의 완료 기록이 가비지 수집 
  때문에 유실되었다.

## 지원 및 호환성

Api서버 버전 1.6.0 또는 더 높은 버전으로 구성된 클러스터는 `.spec.initContainers` 
필드를 사용하여 초기화 컨테이너를 지원한다. 이전 버전들은 초기화 컨테이너를 알파 또는 
베타 어노테이션을 사용하여 지원한다. `.spec.initContainers` 필드는 알파 또는 베타 
어노테이션에도 반영되어 있어서 버전 1.3.0 이상의 Kubelet이 초기화 컨테이너를 실행할 수 
있도록 한다. 따라서, 버전 1.6 api서버가 기존에 생성된 파드들의 초기화 컨테이너 기능 손실 없이 
안전하게 버전 1.5.x로 롤백할 수 있게 한다.

Api서버 및 Kubelet 버전 1.8.0 이상에서는, 사용 중단된 어노테이션을 
`.spec.initContainers` 필드로 변환하는 것이 필요한, 알파 및 베타 어노테이션의 지원이 중단되었다.

{{% /capture %}}


{{% capture whatsnext %}}

* [초기화 컨테이너를 가진 파드 생성하기](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container)

{{% /capture %}}
