---


title: 스태틱(static) 파드 생성하기
weight: 170
content_template: task
---

<!-- overview -->


*스태틱 파드* 는 {{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}
없이 특정 노드에 있는 kubelet 데몬에 의해
직접 관리된다.
컨트롤 플레인에 의해 관리되는 파드(예를 들어 {{< glossary_tooltip text="디플로이먼트(Deployment)" term_id="deployment" >}})와는 달리,
kubelet 이 각각의 스태틱 파드를 감시한다.
(만약 실패할 경우 다시 구동한다.)

스태틱 파드는 항상 특정 노드에 있는 하나의 {{< glossary_tooltip term_id="kubelet" >}}에 매여 있다.

Kubelet 은 각각의 스태틱 파드에 대하여 쿠버네티스 API 서버에서 {{< glossary_tooltip text="미러 파드(mirror pod)" term_id="mirror-pod" >}}를
생성하려고 자동으로 시도한다.
즉, 노드에서 구동되는 파드는 API 서버에 의해서 볼 수 있지만,
API 서버에서 제어될 수는 없다.
파드 이름에는 노드 호스트 이름 앞에 하이픈을 붙여 접미사로 추가된다.

{{< note >}}
만약 클러스터로 구성된 쿠버네티스를 구동하고 있고, 스태틱 파드를 사용하여
모든 노드에서 파드를 구동하고 있다면,
스태틱 파드를 사용하는 대신 {{< glossary_tooltip text="데몬셋(DaemonSet)" term_id="daemonset" >}}
을 사용하는 것이 바람직하다.
{{< /note >}}



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

이 페이지는 파드를 실행하기 위해 {{< glossary_tooltip term_id="docker" >}}를 사용하며,
노드에서 Fedora 운영 체제를 구동하고 있다고 가정한다.
다른 배포판이나 쿠버네티스 설치 지침과는 다소 상이할 수 있다.





<!-- steps -->

## 스태틱 파드 생성하기 {#static-pod-creation}

[파일 시스템이 호스팅하는 구성 파일](/ko/docs/tasks/configure-pod-container/static-pod/#configuration-files)이나 [웹이 호스팅하는 구성 파일](/ko/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http)을 사용하여 스태틱 파드를 구성할 수 있다.

### 파일시스템이 호스팅 하는 스태틱 파드 매니페스트 {#configuration-files}

매니페스트는 특정 디렉터리에 있는 JSON 이나 YAML 형식의 표준 파드 정의이다. [kubelet 구성 파일](/docs/tasks/administer-cluster/kubelet-config-file)의 `staticPodPath: <the directory>` 필드를 사용하자. 이 디렉터리를 정기적으로 스캔하여, 디렉터리 안의 YAML/JSON 파일이 생성되거나 삭제되었을 때 스태틱 파드를 생성하거나 삭제한다.
Kubelet 이 특정 디렉터리를 스캔할 때 점(.)으로 시작하는 단어를 무시한다는 점을 유의하자.

예를 들어, 다음은 스태틱 파드로 간단한 웹 서버를 구동하는 방법을 보여준다.

1. 스태틱 파드를 실행할 노드를 선택한다. 이 예제에서는 `my-model` 이다.

    ```shell
    ssh my-node1
    ```

2. `/etc/kubelet.d` 와 같은 디렉터리를 선택하고 웹 서버 파드의 정의를 해당 위치에, 예를 들어 `/etc/kubelet.d/static-web.yaml` 에 배치한다.  

    ```shell
	  # kubelet 이 동작하고 있는 노드에서 이 명령을 수행한다.
    mkdir /etc/kubelet.d/
    cat <<EOF >/etc/kubelet.d/static-web.yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    EOF
    ```

3. 노드에서 kubelet 실행 시에 `--pod-manifest-path=/etc/kubelet.d/` 와 같이 인자를 제공하여 해당 디렉터리를 사용하도록 구성한다. Fedora 의 경우 이 줄을 포함하기 위하여 `/etc/kubernetes/kubelet` 파일을 다음과 같이 수정한다.

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
    ```
    혹은 [kubelet 구성 파일](/docs/tasks/administer-cluster/kubelet-config-file)에 `staticPodPath: <the directory>` 필드를 추가한다.

4. kubelet을 재시작한다. Fedora의 경우 아래와 같이 수행한다.

    ```shell
    # kubelet 이 동작하고 있는 노드에서 이 명령을 수행한다.
    systemctl restart kubelet
    ```

### 웹이 호스팅 하는 스태틱 파드 매니페스트 {#pods-created-via-http}

Kubelet은 `--manifest-url=<URL>` 의 인수로 지정된 파일을 주기적으로 다운로드하여
해당 파일을 파드의 정의가 포함된 JSON/YAML 파일로 해석한다.
[파일시스템이 호스팅 하는 매니페스트](#configuration-files) 의 작동 방식과
유사하게 kubelet은 스케줄에 맞춰 매니페스트 파일을 다시 가져온다. 스태틱 파드의 목록에
변경된 부분이 있을 경우, kubelet 은 이를 적용한다.

이 방법을 사용하기 위하여 다음을 수행한다.

1. kubelet 에게 파일의 URL을 전달하기 위하여 YAML 파일을 생성하고 이를 웹 서버에 저장한다.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    ```

2. 선택한 노드에서 `--manifest-url=<manifest-url>` 을 실행하여 웹 메니페스트를 사용하도록 kubelet을 구성한다. Fedora 의 경우 이 줄을 포함하기 위하여 `/etc/kubernetes/kubelet` 파일을 수정한다.

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<manifest-url>"
    ```

3. Kubelet을 재시작한다. Fedora의 경우 아래와 같이 수행한다.

    ```shell
    # kubelet 이 동작하고 있는 노드에서 이 명령을 수행한다.
    systemctl restart kubelet
    ```

## 스태틱 파드 행동 관찰하기 {#behavior-of-static-pods}

Kubelet 을 시작하면, 정의된 모든 스태틱 파드가 자동으로 시작된다.
스태틱 파드를 정의하고, kubelet을 재시작했으므로, 새로운 스태틱
파드가 이미 실행 중이어야 한다.

(노드에서) 구동되고 있는 (스태틱 파드를 포함한) 컨테이너들을 볼 수 있다.
```shell
# kubelet 이 동작하고 있는 노드에서 이 명령을 수행한다.
docker ps
```

결과는 다음과 유사하다.

```
CONTAINER ID IMAGE         COMMAND  CREATED        STATUS         PORTS     NAMES
f6d05272b57e nginx:latest  "nginx"  8 minutes ago  Up 8 minutes             k8s_web.6f802af4_static-web-fk-node1_default_67e24ed9466ba55986d120c867395f3c_378e5f3c
```

API 서버에서 미러 파드를 볼 수 있다.

```shell
kubectl get pods
```
```
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          2m
```

{{< note >}}
Kubelet에 API 서버에서 미러 파드를 생성할 수 있는 권한이 있는지 미리 확인해야 한다. 그렇지 않을 경우 API 서버에 의해서 생성 요청이 거부된다.
[파드시큐리티폴리시(PodSecurityPolicy)](/ko/docs/concepts/policy/pod-security-policy/) 에 대해 보기.
{{< /note >}}


스태틱 파드에 있는 {{< glossary_tooltip term_id="label" text="레이블" >}} 은
미러 파드로 전파된다.  {{< glossary_tooltip term_id="selector" text="셀렉터" >}} 등을
통하여 이러한 레이블을 사용할 수 있다.

만약 API 서버로부터 미러 파드를 지우기 위하여 `kubectl` 을 사용하려 해도,
kubelet 은 스태틱 파드를 지우지 _않는다._

```shell
kubectl delete pod static-web-my-node1
```
```
pod "static-web-my-node1" deleted
```
파드가 여전히 구동 중인 것을 볼 수 있다.
```shell
kubectl get pods
```
```
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          12s
```

kubelet 이 구동 중인 노드로 돌아가서 도커 컨테이너를 수동으로
중지할 수 있다.
일정 시간이 지나면, kubelet이 파드를 자동으로 인식하고 다시 시작하는
것을 볼 수 있다.

```shell
# kubelet 이 동작하고 있는 노드에서 이 명령을 수행한다.
docker stop f6d05272b57e # 예제를 수행하는 사용자의 컨테이너 ID로 변경한다.
sleep 20
docker ps
```
```
CONTAINER ID        IMAGE         COMMAND                CREATED       ...
5b920cbaf8b1        nginx:latest  "nginx -g 'daemon of   2 seconds ago ...
```

## 스태틱 파드의 동적 추가 및 제거

실행 중인 kubelet 은 주기적으로, 설정된 디렉터리(예제에서는 `/etc/kubelet.d`)에서 변경 사항을 스캔하고, 이 디렉터리에 새로운 파일이 생성되거나 삭제될 경우, 파드를 생성/삭제 한다.

```shell
# 예제를 수행하는 사용자가 파일시스템이 호스팅하는 스태틱 파드 설정을 사용한다고 가정한다.
# kubelet 이 동작하고 있는 노드에서 이 명령을 수행한다.
#
mv /etc/kubelet.d/static-web.yaml /tmp
sleep 20
docker ps
# 구동 중인 nginx 컨테이너가 없는 것을 확인한다.
mv /tmp/static-web.yaml  /etc/kubelet.d/
sleep 20
docker ps
```
```
CONTAINER ID        IMAGE         COMMAND                CREATED           ...
e7a62e3427f1        nginx:latest  "nginx -g 'daemon of   27 seconds ago
```
