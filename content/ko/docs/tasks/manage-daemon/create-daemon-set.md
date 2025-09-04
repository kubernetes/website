---
title: 기본 데몬셋(DaemonSet) 구축하기
content_type: task  
weight: 5  
---
<!-- overview -->

이 페이지에서는 쿠버네티스 클러스터의 모든 노드에서 파드를 실행하는 기본적인 {{< glossary_tooltip text="데몬셋" term_id="daemonset" >}}을 
구축하는 방법을 설명한다. 
호스트에서 파일을 마운트하고, 
[초기화 컨테이너](/ko/docs/concepts/workloads/pods/init-containers/)를 사용하여 해당 파일의 내용을 로깅하고, 일시 정지 컨테이너를 활용하는 간단한 사용 사례를 다룬다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

데몬셋의 동작을 확인하기 위해 최소 2개의 노드(컨트롤 플레인 노드 1개와 워커 노드 1개)를 가진 
쿠버네티스 클러스터가 필요하다.

## 데몬셋 정의

이 작업에서는 모든 노드에 파드의 복사본이 스케줄되도록 하는 기본적인 데몬셋을 생성한다.
파드는 초기화 컨테이너를 사용하여 호스트의 `/etc/machine-id` 내용을 읽고 로깅하며, 
메인 컨테이너는 파드를 계속 실행 상태로 유지하는 `pause` 컨테이너가 된다.

{{% code_sample file="application/basic-daemonset.yaml" %}}

1. (YAML) 매니페스트를 기반으로 데몬셋을 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/application/basic-daemonset.yaml
   ```

1. 적용된 후, 데몬셋이 클러스터의 모든 노드에서 파드를 실행하고 있는지 확인할 수 있다.

   ```shell
   kubectl get pods -o wide
   ```

   출력 결과는 다음과 유사하게 노드당 하나의 파드를 나열한다.

   ```
   NAME                                READY   STATUS    RESTARTS   AGE    IP       NODE
   example-daemonset-xxxxx             1/1     Running   0          5m     x.x.x.x  node-1
   example-daemonset-yyyyy             1/1     Running   0          5m     x.x.x.x  node-2
   ```

1. 호스트에서 마운트된 로그 디렉터리를 확인하여 로깅된 `/etc/machine-id` 파일의 
   내용을 살펴볼 수 있다.

   ```shell
   kubectl exec <pod-name> -- cat /var/log/machine-id.log
   ```

   여기서 `<pod-name>`은 파드 중 하나의 이름이다.

## {{% heading "cleanup" %}}

데몬셋을 삭제하려면 다음 명령을 실행한다.

```shell
kubectl delete --cascade=foreground --ignore-not-found --now daemonsets/example-daemonset
```

이 간단한 데몬셋 예제는 초기화 컨테이너와 호스트 패스 볼륨과 같은 주요 구성 요소를 소개하며,
이를 확장하여 더 고급 사용 사례에 활용할 수 있다. 더 자세한 내용은
[데몬셋](/ko/docs/concepts/workloads/controllers/daemonset/)을 참조한다.

## {{% heading "whatsnext" %}}

* [데몬셋(DaemonSet)에서 롤링 업데이트 수행](/ko/docs/tasks/manage-daemon/update-daemon-set/)을 참고한다.
* [기존 데몬셋 파드를 채택하기 위한 데몬셋 생성](/ko/docs/concepts/workloads/controllers/daemonset/)을 참고한다.
