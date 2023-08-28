---
# reviewers:
# - verb
# - soltysh
title: 동작 중인 파드 디버그
content_type: task
---

<!-- overview -->

이 페이지는 노드에서 동작 중인(혹은 크래시된) 파드를 디버그하는 방법에 대해 설명한다.


## {{% heading "prerequisites" %}}


* 여러분의 {{< glossary_tooltip text="파드" term_id="pod" >}}는 이미 스케줄링 되어
  동작하고 있을 것이다. 만약 파드가 아직 동작중이지 않다면, [애플리케이션
  트러블슈팅](/ko/docs/tasks/debug/debug-application/)을 참고한다.
* 일부 고급 디버깅 과정에서는 해당 파드가 어떤 노드에서 동작하고 있는지
  알아야 하고, 해당 노드에서 쉘 명령어를 실행시킬 수 있어야 한다.
  `kubectl`을 사용하는 일반적인 디버깅 과정에서는 이러한 접근 권한이 필요하지 않다.

## `kubectl describe pod` 명령으로 파드 상세사항 가져오기

이 예제에서는 앞의 예제와 비슷하게 두 개의 파드를 생성하기 위해 디플로이먼트를 사용할 것이다.

{{< codenew file="application/nginx-with-request.yaml" >}}

다음 명령을 실행하여 디플로이먼트를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-with-request.yaml
```

```none
deployment.apps/nginx-deployment created
```

다음 명령을 실행하여 파드 상태를 확인한다.

```shell
kubectl get pods
```

```none
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-67d4bdd6f5-cx2nz   1/1     Running   0          13s
nginx-deployment-67d4bdd6f5-w6kd7   1/1     Running   0          13s
```

다음과 같이 `kubectl describe pod` 명령을 사용하여 각 파드에 대한 더 많은 정보를 가져올 수 있다.

```shell
kubectl describe pod nginx-deployment-67d4bdd6f5-w6kd7
```

```none
Name:         nginx-deployment-67d4bdd6f5-w6kd7
Namespace:    default
Priority:     0
Node:         kube-worker-1/192.168.0.113
Start Time:   Thu, 17 Feb 2022 16:51:01 -0500
Labels:       app=nginx
              pod-template-hash=67d4bdd6f5
Annotations:  <none>
Status:       Running
IP:           10.88.0.3
IPs:
  IP:           10.88.0.3
  IP:           2001:db8::1
Controlled By:  ReplicaSet/nginx-deployment-67d4bdd6f5
Containers:
  nginx:
    Container ID:   containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    Image:          nginx
    Image ID:       docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 17 Feb 2022 16:51:05 -0500
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     500m
      memory:  128Mi
    Requests:
      cpu:        500m
      memory:     128Mi
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-bgsgp (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  kube-api-access-bgsgp:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Guaranteed
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  34s   default-scheduler  Successfully assigned default/nginx-deployment-67d4bdd6f5-w6kd7 to kube-worker-1
  Normal  Pulling    31s   kubelet            Pulling image "nginx"
  Normal  Pulled     30s   kubelet            Successfully pulled image "nginx" in 1.146417389s
  Normal  Created    30s   kubelet            Created container nginx
  Normal  Started    30s   kubelet            Started container nginx
```

위 예시에서 컨테이너와 파드에 대한 구성 정보(레이블, 리소스 요구사항 등) 및 상태 정보(상태(state), 준비성(readiness), 재시작 횟수, 이벤트 등)를 볼 수 있다.

컨테이너의 상태(state)값은 Waiting, Running, 또는 Terminated 중 하나이다. 각 상태에 따라, 추가 정보가 제공될 것이다. 위 예시에서 Running 상태의 컨테이너에 대해서는 컨테이너의 시작 시각을 시스템이 표시해 주는 것을 볼 수 있다.

Ready 값은 컨테이너의 마지막 준비성 프로브(readiness probe) 통과 여부를 알려 준다. (위 예시에서는 컨테이너에 준비성 프로브가 설정되어 있지 않다. 컨테이너에 준비성 프로브가 설정되어 있지 않으면, 컨테이너는 준비(ready) 상태로 간주된다.)

'재시작 카운트'는 컨테이너가 재시작된 횟수를 보여 준다. 이 정보는 재시작 정책이 'always'로 설정된 컨테이너의 반복적인 강제 종료를 알아차리는 데에 유용하다.

위 예시에서 파드와 연관된 유일한 컨디션(Condition)은 True 또는 False 값을 갖는 Ready 컨디션이며, 이 값이 True라는 것은 파드가 요청을 처리할 수 있으며 모든 동일한 서비스를 묶는 로드 밸런싱 풀에 추가되어야 함을 의미한다.

마지막으로, 파드와 관련된 최근 이벤트 로그가 표시된다. 시스템은 동일한 여러 이벤트를 처음/마지막 발생 시간 및 발생 횟수만 압축적으로 표시한다. "From"은 이벤트 로그를 발생하는 구성 요소를 가리키고, "SubobjectPath"는 참조되는 개체(예: 파드 내 컨테이너)를 나타내며, "Reason" 및 "Message"는 발생한 상황을 알려 준다.


## 예시: Pending 상태의 파드 디버깅하기

이벤트를 사용하여 감지할 수 있는 일반적인 시나리오는 노드에 할당될 수 없는 파드를 생성하는 경우이다. 예를 들어 파드가 노드에 사용 가능한 리소스보다 더 많은 리소스를 요청하거나, 또는 어떤 노드에도 해당되지 않는 레이블 셀렉터를 명시했을 수 있다. 예를 들어 4개 노드로 구성되며 각 (가상) 머신에 1 CPU가 있는 클러스터가 있는 상황에서, 위 예시 대신 2 레플리카가 아니라 5 레플리카를, 500 밀리코어가 아니라 600 밀리코어를 요청하는 디플로이먼트를 배포했다고 해 보자. 이러한 경우 5개의 파드 중 하나는 스케줄링될 수 없을 것이다. (각 노드에는 fluentd, skydns 등의 클러스터 애드온도 실행되고 있으므로, 만약 1000 밀리코어를 요청했다면 파드가 하나도 스케줄될 수 없었을 것이다.)

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          7m
nginx-deployment-1006230814-fmgu3   1/1       Running   0          7m
nginx-deployment-1370807587-6ekbw   1/1       Running   0          1m
nginx-deployment-1370807587-fg172   0/1       Pending   0          1m
nginx-deployment-1370807587-fz9sd   0/1       Pending   0          1m
```

nginx-deployment-1370807587-fz9sd 파드가 왜 실행되지 않는지를 알아 보려면, pending 상태의 파드에 대해 `kubectl describe pod` 명령을 실행하고 이벤트(event) 항목을 확인해 볼 수 있다.

```shell
kubectl describe pod nginx-deployment-1370807587-fz9sd
```

```none
  Name:		nginx-deployment-1370807587-fz9sd
  Namespace:	default
  Node:		/
  Labels:		app=nginx,pod-template-hash=1370807587
  Status:		Pending
  IP:
  Controllers:	ReplicaSet/nginx-deployment-1370807587
  Containers:
    nginx:
      Image:	nginx
      Port:	80/TCP
      QoS Tier:
        memory:	Guaranteed
        cpu:	Guaranteed
      Limits:
        cpu:	1
        memory:	128Mi
      Requests:
        cpu:	1
        memory:	128Mi
      Environment Variables:
  Volumes:
    default-token-4bcbi:
      Type:	Secret (a volume populated by a Secret)
      SecretName:	default-token-4bcbi
  Events:
    FirstSeen	LastSeen	Count	From			        SubobjectPath	Type		Reason			    Message
    ---------	--------	-----	----			        -------------	--------	------			    -------
    1m		    48s		    7	    {default-scheduler }			        Warning		FailedScheduling	pod (nginx-deployment-1370807587-fz9sd) failed to fit in any node
  fit failure on node (kubernetes-node-6ta5): Node didn't have enough resource: CPU, requested: 1000, used: 1420, capacity: 2000
  fit failure on node (kubernetes-node-wul5): Node didn't have enough resource: CPU, requested: 1000, used: 1100, capacity: 2000
```

여기서 스케줄러가 기록한 이벤트를 통해, 파드가 `FailedScheduling` 사유로 인해 스케줄링되지 않았음을 알 수 있다(다른 이유도 있을 수 있음). 이 메시지를 통해 어떤 노드에도 이 파드를 실행하기 위한 충분한 리소스가 없었음을 알 수 있다.

이 상황을 바로잡으려면, `kubectl scale` 명령으로 디플로이먼트의 레플리카를 4 이하로 줄일 수 있다. (또는 한 파드를 pending 상태로 두어도 되며, 이렇게 해도 문제는 없다.)

`kubectl describe pod` 출력의 마지막에 있는 것과 같은 이벤트는 etcd에 기록되어 보존되며 클러스터에 어떤 일이 일어나고 있는지에 대한 높은 차원의 정보를 제공한다. 모든 이벤트의 목록을 보려면 다음 명령을 실행한다.

```shell
kubectl get events
```

그런데 이벤트는 네임스페이스 스코프 객체라는 것을 기억해야 한다. 즉 네임스페이스 스코프 객체에 대한 이벤트(예: `my-namespace` 네임스페이스의 파드에 어떤 일이 발생했는지)가 궁금하다면, 다음과 같이 커맨드에 네임스페이스를 명시해야 한다.

```shell
kubectl get events --namespace=my-namespace
```

모든 네임스페이스에 대한 이벤트를 보려면, `--all-namespaces` 인자를 사용할 수 있다.

`kubectl describe pod` 명령 외에도, `kubectl get pod` 이상의 정보를 얻는 다른 방법은 `kubectl get pod` 명령에 출력 형식 플래그 `-o yaml` 인자를 추가하는 것이다. 이렇게 하면 `kubectl describe pod` 명령보다 더 많은 정보, 원천적으로는 시스템이 파드에 대해 알고 있는 모든 정보를 YAML 형식으로 볼 수 있다. 여기서 어노테이션(레이블 제한이 없는 키-밸류 메타데이터이며, 쿠버네티스 시스템 구성 요소가 내부적으로 사용함), 재시작 정책, 포트, 볼륨과 같은 정보를 볼 수 있을 것이다.

```shell
kubectl get pod nginx-deployment-1006230814-6winp -o yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2022-02-17T21:51:01Z"
  generateName: nginx-deployment-67d4bdd6f5-
  labels:
    app: nginx
    pod-template-hash: 67d4bdd6f5
  name: nginx-deployment-67d4bdd6f5-w6kd7
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: nginx-deployment-67d4bdd6f5
    uid: 7d41dfd4-84c0-4be4-88ab-cedbe626ad82
  resourceVersion: "1364"
  uid: a6501da1-0447-4262-98eb-c03d4002222e
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: nginx
    ports:
    - containerPort: 80
      protocol: TCP
    resources:
      limits:
        cpu: 500m
        memory: 128Mi
      requests:
        cpu: 500m
        memory: 128Mi
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: kube-api-access-bgsgp
      readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  nodeName: kube-worker-1
  preemptionPolicy: PreemptLowerPriority
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - name: kube-api-access-bgsgp
    projected:
      defaultMode: 420
      sources:
      - serviceAccountToken:
          expirationSeconds: 3607
          path: token
      - configMap:
          items:
          - key: ca.crt
            path: ca.crt
          name: kube-root-ca.crt
      - downwardAPI:
          items:
          - fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
            path: namespace
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:01Z"
    status: "True"
    type: Initialized
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:06Z"
    status: "True"
    type: Ready
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:06Z"
    status: "True"
    type: ContainersReady
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:01Z"
    status: "True"
    type: PodScheduled
  containerStatuses:
  - containerID: containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    image: docker.io/library/nginx:latest
    imageID: docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    lastState: {}
    name: nginx
    ready: true
    restartCount: 0
    started: true
    state:
      running:
        startedAt: "2022-02-17T21:51:05Z"
  hostIP: 192.168.0.113
  phase: Running
  podIP: 10.88.0.3
  podIPs:
  - ip: 10.88.0.3
  - ip: 2001:db8::1
  qosClass: Guaranteed
  startTime: "2022-02-17T21:51:01Z"
```

## 파드의 로그 확인하기 {#examine-pod-logs}

먼저, 확인하고자 하는 컨테이너의 로그를 확인한다.

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

만약 컨테이너가 이전에 크래시 되었다면, 다음의 명령을 통해 컨테이너의 크래시 로그를 살펴볼 수 있다.

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

## exec를 통해 컨테이너 디버깅하기 {#container-exec}

만약 {{< glossary_tooltip text="컨테이너 이미지" term_id="image" >}}에
디버깅 도구가 포함되어 있다면, `kubectl exec`을 통해 특정 컨테이너에서 해당 명령들을
실행할 수 있다. (리눅스나 윈도우 OS를 기반으로 만들어진 이미지에는 대부분 디버깅 도구를 포함하고
있다.)

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}` 인자는 선택적이다. 만약 하나의 컨테이너만 포함된 파드라면 해당 옵션을 생략할 수 있다.
{{< /note >}}

예를 들어, 동작 중인 카산드라 파드의 로그를 살펴보기 위해서는 다음과 같은 명령을 실행할 수 있다.

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

`kubectl exec`에 `-i`와 `-t` 옵션을 사용해서 터미널에서 접근할 수 있는 쉘을 실행시킬 수도 있다.
예를 들면 다음과 같다.

```shell
kubectl exec -it cassandra -- sh
```

더욱 상세한 내용은 
[동작중인 컨테이너의 쉘에 접근하기](/ko/docs/tasks/debug/debug-application/get-shell-running-container/)를 참고한다.

## 임시(ephemeral) 디버그 컨테이너를 사용해서 디버깅하기 {#ephemeral-container}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

컨테이너가 크래시 됐거나 
[distroless 이미지](https://github.com/GoogleContainerTools/distroless)처럼
컨테이너 이미지에 디버깅 도구를 포함하고 있지 않아 `kubectl exec`로는 충분하지 않은 경우에는
{{< glossary_tooltip text="임시(Ephemeral) 컨테이너" term_id="ephemeral-container" >}}를 사용하는 것이
인터랙티브한 트러블슈팅에 유용하다.

### 임시 컨테이너를 사용한 디버깅 예시 {#ephemeral-container-example}

`kubectl debug` 명령어를 사용해서 동작 중인 파드에 임시 컨테이너를 추가할 수 있다.
먼저, 다음과 같이 파드를 추가한다.

```shell
kubectl run ephemeral-demo --image=registry.k8s.io/pause:3.1 --restart=Never
```

이 섹션의 예시에서는 디버깅 도구가 포함되지 않은 이미지의 사례를 보여드리기 위해
`pause` 컨테이너 이미지를 사용했는데, 이 대신 어떠한 이미지를 사용해도
될 것이다.

만약 `kubectl exec`을 통해 쉘을 생성하려 한다면 다음과 같은 에러를
확인할 수 있을 텐데, 그 이유는 이 이미지에 쉘이 존재하지 않기 때문이다.

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

이 명령어 대신 `kubectl debug`을 사용해서 디버깅 컨테이너를 생성할 수 있다.
만약 `-i`/`--interactive` 인자를 사용한다면, `kubectl`은 임시
컨테이너의 콘솔에 자동으로 연결할 것이다.

```shell
kubectl debug -it ephemeral-demo --image=busybox --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

이 명령어는 새로운 busybox 컨테이너를 추가하고 해당 컨테이너로 연결한다. `--target`
파라미터를 사용하면 다른 컨테이너의 프로세스 네임스페이스를 대상으로 하게 된다. 여기서는
이 옵션이 꼭 필요한데, `kubectl run`이 생성하는 파드에 대해
[프로세스 네임스페이스 공유](/docs/tasks/configure-pod-container/share-process-namespace/)를
활성화하지 않기 때문이다.

{{< note >}}
`--target` 파라미터는 사용 중인 
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}에서
지원해야지만 사용할 수 있다. 만일 지원되지 않는다면,
임시 컨테이너가 시작되지 않을 수 있거나 독립적인 프로세스
네임스페이스를 가지고 시작될 수 있다.
{{< /note >}}

`kubectl describe` 명령을 사용하면 새롭게 생성된 임시 컨테이너의 상태를 확인할 수 있다.

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

디버깅이 다 끝나면 `kubectl delete`을 통해 파드를 제거할 수 있다.

```shell
kubectl delete pod ephemeral-demo
```

## 파드의 복제본을 이용해서 디버깅하기

때때로 파드의 설정 옵션에 따라 특정 상황에서 트러블슈팅을 하기가 어려울 수 있다.
예를 들어, 만일 여러분의 컨테이너 이미지가 쉘을 포함하고 있지 않거나, 여러분의
애플리케이션이 컨테이너 시작에서 크래시가 발생한다면 `kubectl exec`을 이용해서
컨테이너를 트러블슈팅할 수 없을 수 있다. 이러한 상황에서는 `kubectl debug`을 사용해서
파드의 복제본을 디버깅을 위한 추가적인 설정 옵션과 함께 생성할 수 있다.

### 새 컨테이너와 함께 파드의 복제본 생성하기

만일 여러분의 애플리케이션이 동작은 하고 있지만 예상과는 다르게 동작하는 경우,
파드의 복제본에 새로운 컨테이너를 추가함으로써 추가적인 트러블슈팅 도구들을
파드에 함께 추가할 수 있다.

가령, 여러분의 애플리케이션 컨테이너 이미지는 `busybox`를 기반으로 하고 있는데
여러분은 `busybox`에는 없는 디버깅 도구를 필요로 한다고 가정해 보자. 이러한
시나리오는 `kubectl run` 명령을 통해 시뮬레이션 해볼 수 있다.

```shell
kubectl run myapp --image=busybox --restart=Never -- sleep 1d
```

다음의 명령을 실행시켜 디버깅을 위한 새로운 우분투 컨테이너와 함께 `myapp-debug`이란
이름의 `myapp` 컨테이너 복제본을 생성할 수 있다.

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```

{{< note >}}
* 만일 여러분이 새로 생성되는 컨테이너의 이름을 `--container` 플래그와 함께 지정하지 않는다면,
  `kubectl debug`는 자동으로 새로운 컨테이너 이름을 생성한다.
* `-i` 플래그를 사용하면 `kubectl debug` 명령이 새로운 컨테이너에 기본적으로 연결되게 된다.
  이러한 동작은 `--attach=false`을 지정하여 방지할 수 있다. 만일 여러분의 세션이
  연결이 끊어진다면 `kubectl attach`를 사용해서 다시 연결할 수 있다.
* `--share-processes` 옵션은 이 파드에 있는 컨테이너가 해당 파드에 속한 다른 컨테이너의
  프로세스를 볼 수 있도록 한다. 이 옵션이 어떻게 동작하는지에 대해 더 알아보기 위해서는
  다음의 [파드의 컨테이너 간 프로세스 네임스페이스 공유](
  /docs/tasks/configure-pod-container/share-process-namespace/)를 참고하라.
{{< /note >}}

사용이 모두 끝나면, 디버깅에 사용된 파드를 잊지 말고 정리한다.

```shell
kubectl delete pod myapp myapp-debug
```

### 명령어를 변경하며 파드의 복제본 생성하기

때때로 컨테이너의 명령어를 변경하는 것이 유용한 경우가 있는데, 예를 들면 디버그 플래그를 추가하기
위해서나 애플리케이션이 크래시 되는 경우이다.

다음의 `kubectl run` 명령을 통해 즉각적으로 크래시가 발생하는 애플리케이션의
사례를 시뮬레이션해 볼 수 있다.

```
kubectl run --image=busybox myapp -- false
```

`kubectl describe pod myapp` 명령을 통해 이 컨테이너에 크래시가 발생하고 있음을 확인할 수 있다.

```
Containers:
  myapp:
    Image:         busybox
    ...
    Args:
      false
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
```

이러한 경우에 `kubectl debug`을 통해 명령어를 지정함으로써 해당 파드의
복제본을 인터랙티브 쉘로 생성할 수 있다.

```
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```
If you don't see a command prompt, try pressing enter.
/ #
```

이제 인터랙티브 쉘에 접근할 수 있으니 파일 시스템 경로를 확인하거나
동작 중인 컨테이너의 명령어를 직접 확인하는 등의 작업이 가능하다.

{{< note >}}
* 특정 컨테이너의 명령어를 변경하기 위해서는 `--container` 옵션을 통해 해당 컨테이너의
  이름을 지정해야만 한다. 이름을 지정하지 않는다면 `kubectl debug`은 이전에 지정한 명령어를
  그대로 사용해서 컨테이너를 생성할 것이다.
* 기본적으로 `-i` 플래그는 `kubectl debug` 명령이 컨테이너에 바로 연결되도록 한다.
  이러한 동작을 방지하기 위해서는 `--attach=false` 옵션을 지정할 수 있다. 만약 여러분이 세션이
  종료된다면 `kubectl attach` 명령을 통해 다시 연결할 수 있다.
{{< /note >}}

사용이 모두 끝나면, 디버깅에 사용된 파드들을 잊지 말고 정리한다.

```shell
kubectl delete pod myapp myapp-debug
```

### 컨테이너 이미지를 변경하며 파드의 복제본 생성하기

특정한 경우에 여러분은 제대로 동작하지 않는 파드의 이미지를
기존 프로덕션 컨테이너 이미지에서 디버깅 빌드나 추가적인 도구를 포함한
이미지로 변경하고 싶을 수 있다.

이 사례를 보여주기 위해 `kubectl run` 명령을 통해 파드를 생성하였다.

```
kubectl run myapp --image=busybox --restart=Never -- sleep 1d
```

여기서는 `kubectl debug` 명령을 통해 해당 컨테이너 이미지를 `ubuntu`로 변경하며
복제본을 생성하였다.

```
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

`--set-image`의 문법은 `kubectl set image`와 동일하게 `container_name=image`
형식의 문법을 사용한다. `*=ubuntu`라는 의미는 모든 컨테이너의 이미지를 `ubuntu`로
변경하겠다는 의미이다.

사용이 모두 끝나면, 디버깅에 사용된 파드를 잊지 말고 정리한다.

```shell
kubectl delete pod myapp myapp-debug
```

## 노드의 쉘을 사용해서 디버깅하기 {#node-shell-session}

만약 위의 어떠한 방법도 사용할 수 없다면, 파드가 현재 동작 중인 노드를 찾아
해당 노드에서 실행되는 파드를 생성할 수 있다.
다음 `kubectl debug` 명령을 통해 해당 노드에서 인터랙티브한 쉘을 생성할 수 있다.

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

노드에서 디버깅 세션을 생성할 때 유의해야 할 점은 다음과 같다.

* `kubectl debug`는 노드의 이름에 기반해 새로운 파드의 이름을
  자동으로 생성한다.
* 노드의 루트 파일시스템은 `/host`에 마운트된다.
* 파드가 특권을 가지고 있지 않더라도, 컨테이너는 호스트 네임스페이스(IPC, 네트워크, PID 네임스페이스)에서 동작한다. 따라서 몇몇 프로세스 정보를 읽어오거나, `chroot /host` 등의 작업은 수행될 수 없다.
* 특권을 가진 파드가 필요한 경우에는 직접 생성한다.

사용이 모두 끝나면, 디버깅에 사용된 파드를 잊지 말고 정리한다.

```shell
kubectl delete pod node-debugger-mynode-pdx84
```
