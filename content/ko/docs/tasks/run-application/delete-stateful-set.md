---
# reviewers:
# - bprashanth
# - erictune
# - foxish
# - janetkuo
# - smarterclayton
title: 스테이트풀셋(StatefulSet) 삭제하기
content_type: task
weight: 60
---

<!-- overview -->

이 작업은 {{< glossary_tooltip term_id="StatefulSet"text="스테이트풀셋">}}을 삭제하는 방법을 설명한다.



## {{% heading "prerequisites" %}}


* 이 작업은 클러스터에 스테이트풀셋으로 표시되는 애플리케이션이 있다고 가정한다.



<!-- steps -->

## 스테이트풀셋 삭제

쿠버네티스에서 다른 리소스를 삭제하는 것과 같은 방식으로 스테이트풀셋을 삭제할 수 있다. `kubectl delete` 명령어를 사용하고 파일 또는 이름으로 스테이트풀셋을 지정하자.

```shell
kubectl delete -f <file.yaml>
```

```shell
kubectl delete statefulsets <statefulset-name>
```

스테이트풀셋 자체를 삭제한 후 연결된 헤드리스 서비스는 별도로 삭제해야 할 수도 있다.

```shell
kubectl delete service <service-name>
```

kubectl을 통해 스테이트풀셋을 삭제하면, 스테이트풀셋의 크기가 0으로 설정되고 이로 인해 스테이트풀셋에 포함된 모든 파드가 삭제된다. 파드가 아닌 스테이트풀셋만 삭제하려면, `--cascade=orphan` 옵션을 사용한다.
예시는 다음과 같다.

```shell
kubectl delete -f <file.yaml> --cascade=orphan
```

`kubectl delete` 에 `--cascade=orphan` 를 사용하면 스테이트풀셋 오브젝트가 삭제된 후에도 스테이트풀셋에 의해 관리된 파드는 남게 된다. 만약 파드가 `app.kubernetes.io/name=MyApp` 레이블을 갖고 있다면, 다음과 같이 파드를 삭제할 수 있다.

```shell
kubectl delete pods -l app.kubernetes.io/name=MyApp
```

### 퍼시스턴트볼륨(PersistentVolume)

스테이트풀셋의 파드들을 삭제하는 것이 연결된 볼륨을 삭제하는 것은 아니다. 이것은 볼륨을 삭제하기 전에 볼륨에서 데이터를 복사할 수 있는 기회를 준다. 파드가 종료된 후 PVC를 삭제하면 스토리지 클래스와 반환 정책에 따라 백업 퍼시스턴트볼륨 삭제가 트리거될 수 있다. 클레임 삭제 후 볼륨에 접근할 수 있다고 가정하면 안된다.

{{< note >}}
PVC를 삭제할 때 데이터 손실될 수 있음에 주의하자.
{{< /note >}}

### 스테이트풀셋의 완벽한 삭제

연결된 파드를 포함해서 스테이트풀셋의 모든 것을 삭제하기 위해 다음과 같이 일련의 명령을 실행한다.

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app.kubernetes.io/name=MyApp
sleep $grace
kubectl delete pvc -l app.kubernetes.io/name=MyApp

```

위의 예에서 파드에는 `app.kubernetes.io/name=MyApp` 라는 레이블이 있다. 사용자에게 적절한 레이블로 대체하자.

### 스테이트풀셋 파드의 강제 삭제

스테이트풀셋의 일부 파드가 오랫동안 'Terminating' 또는 'Unknown' 상태에 있는 경우, apiserver에 수동적으로 개입하여 파드를 강제 삭제할 수도 있다. 이것은 잠재적으로 위험한 작업이다. 자세한 설명은 [스테이트풀셋 파드 강제 삭제하기](/ko/docs/tasks/run-application/force-delete-stateful-set-pod/)를 참고한다.



## {{% heading "whatsnext" %}}


[스테이트풀셋 파드 강제 삭제하기](/ko/docs/tasks/run-application/force-delete-stateful-set-pod/)에 대해 더 알아보기.
