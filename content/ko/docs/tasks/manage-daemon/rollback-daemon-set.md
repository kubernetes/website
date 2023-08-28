---
# reviewers:
# - janetkuo
title: 데몬셋(DaemonSet)에서 롤백 수행
content_type: task
weight: 20
min-kubernetes-server-version: 1.7
---

<!-- overview -->

이 페이지는 {{< glossary_tooltip text="데몬셋" term_id="daemonset" >}}에서 롤백을 수행하는 방법을 보여준다.


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

[데몬셋에서 롤링 업데이트를
  수행](/ko/docs/tasks/manage-daemon/update-daemon-set/)하는 방법을 이미 알고 있어야 한다.

<!-- steps -->

## 데몬셋에서 롤백 수행

### 1단계: 롤백할 데몬셋 리비전 찾기

마지막 리비전으로 롤백하려는 경우 이 단계를 건너뛸 수 있다.

데몬셋의 모든 리비전을 나열한다.

```shell
kubectl rollout history daemonset <daemonset-name>
```

이 명령은 데몬셋 리비전 목록을 반환한다.

```
daemonsets "<daemonset-name>"
REVISION        CHANGE-CAUSE
1               ...
2               ...
...
```

* 변경 원인은 데몬셋 어노테이션 `kubernetes.io/change-cause` 에서
  생성 시의 리비전으로 복사된다. 변경 원인 어노테이션에서 실행된 명령을 기록하도록
  `kubectl` 에 `--record=true` 를 지정할 수 있다.

특정 리비전의 세부 사항을 보려면 다음을 수행한다.

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

이 명령은 해당 리비전의 세부 사항을 반환한다.

```
daemonsets "<daemonset-name>" with revision #1
Pod Template:
Labels:       foo=bar
Containers:
app:
 Image:        ...
 Port:         ...
 Environment:  ...
 Mounts:       ...
Volumes:      ...
```

### 2단계: 특정 리비전으로 롤백

```shell
# --to-revision에 1단계에서 얻는 리비전 번호를 지정한다
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

성공하면, 명령은 다음을 반환한다.

```
daemonset "<daemonset-name>" rolled back
```

{{< note >}}
`--to-revision` 플래그를 지정하지 않은 경우, kubectl은 가장 최신의 리비전을 선택한다.
{{< /note >}}

### 3단계: 데몬셋 롤백 진행 상황 확인

`kubectl rollout undo daemonset` 은 서버에 데몬셋 롤백을 시작하도록
지시한다. 실제 롤백은 클러스터 {{< glossary_tooltip term_id="control-plane" text="컨트롤 플레인" >}}
내에서 비동기적으로 수행된다.

롤백 진행 상황을 보려면 다음의 명령을 수행한다.

```shell
kubectl rollout status ds/<daemonset-name>
```

롤백이 완료되면, 출력 결과는 다음과 비슷하다.

```
daemonset "<daemonset-name>" successfully rolled out
```


<!-- discussion -->

## 데몬셋 리비전의 이해

이전 `kubectl rollout history` 단계에서, 데몬셋 리비전 목록을
얻었다. 각 리비전은 ControllerRevision이라는 리소스에 저장된다.

각 리비전에 저장된 내용을 보려면, 데몬셋 리비전 원시 리소스를
찾는다.

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

이 명령은 ControllerRevision의 목록을 반환한다.

```
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

각 ControllerRevision은 데몬셋 리비전의 어노테이션과 템플릿을
저장한다.

`kubectl rollout undo` 는 특정 ControllerRevision을 가져와 데몬셋
템플릿을 ControllerRevision에 저장된 템플릿으로 바꾼다.
`kubectl rollout undo` 는 `kubectl edit` 또는 `kubectl apply` 와 같은 다른 명령을 통해
데몬셋 템플릿을 이전 리비전으로 업데이트하는 것과
같다.

{{< note >}}
데몬셋 리비전은 롤 포워드만 한다. 즉, 롤백이
완료된 후, 롤백될 ControllerRevision의
리비전 번호(`.revision` 필드)가 증가한다. 예를 들어,
시스템에 리비전 1과 2가 있고, 리비전 2에서 리비전 1으로 롤백하면,
ControllerRevision은 `.revision: 1` 에서 `.revision: 3` 이 된다.
{{< /note >}}

## 문제 해결

* [데몬셋 롤링 업데이트
  문제 해결](/ko/docs/tasks/manage-daemon/update-daemon-set/#문제-해결)을 참고한다.



