---
title: 기본 데몬셋(DaemonSet) 생성하기
content_type: task  
weight: 5  
---
<!-- overview -->

이 페이지는 쿠버네티스 클러스터의 모든 노드에서 파드를 실행하는 기본 {{< glossary_tooltip text="데몬셋" term_id="daemonset" >}}을 
만드는 방법을 보여준다.  
호스트로부터 파일을 마운트하고, [초기화 컨테이너](/ko/docs/concepts/workloads/pods/init-containers/)를 사용해 
그 내용을 로그로 남기며, pause 컨테이너를 이용하는 간단한 사용 사례를 다룬다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

데몬셋의 동작을 보여주기 위해서는 최소 두 개의 노드(하나의 컨트롤 플레인 노드와 하나의 워커 노드)를 
가진 쿠버네티스 클러스터가 필요하다.

## 데몬셋 정의하기

이 태스크에서는 기본 데몬셋을 생성하여 클러스터의 모든 노드에 파드가 하나씩 스케줄되도록 한다.  
파드는 초기화 컨테이너를 이용해 호스트의 `/etc/machine-id` 내용을 읽어 로그에 남기고, 
메인 컨테이너는 파드를 실행 상태로 유지하는 `pause` 컨테이너가 된다.

{{% code_sample file="application/basic-daemonset.yaml" %}}

1. (YAML) 매니페스트를 기반으로 데몬셋을 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/application/basic-daemonset.yaml
   ```

1. 적용 후, 클러스터의 모든 노드에서 데몬셋이 파드를 실행 중인지 확인할 수 있다.

   ```shell
   kubectl get pods -o wide
   ```

   출력은 다음과 같이 노드별로 하나의 파드를 보여줄 것이다.

   ```
   NAME                                READY   STATUS    RESTARTS   AGE    IP       NODE
   example-daemonset-xxxxx             1/1     Running   0          5m     x.x.x.x  node-1
   example-daemonset-yyyyy             1/1     Running   0          5m     x.x.x.x  node-2
   ```

1. 호스트에서 마운트한 로그 디렉터리를 확인하여 로그에 기록된 `/etc/machine-id`
   파일의 내용을 볼 수 있다.

   ```shell
   kubectl exec <pod-name> -- cat /var/log/machine-id.log
   ```

   `<pod-name>`은 사용자의 파드 중 하나의 이름이다.

## {{% heading "cleanup" %}}

데몬셋을 삭제하려면, 다음 명령어를 실행한다.

```shell
kubectl delete --cascade=foreground --ignore-not-found --now daemonsets/example-daemonset
```

이 간단한 데몬셋 예제는 초기화 컨테이너와 호스트 패스(host path) 볼륨 같은 핵심 컴포넌트를 소개하며, 
더 고급 사용 사례로 확장할 수 있다. 더 자세한 내용은
[데몬셋](/ko/docs/concepts/workloads/controllers/daemonset/)을 참고하자.

## {{% heading "whatsnext" %}}

* [데몬셋(DaemonSet)에서 롤링 업데이트 수행](/ko/docs/tasks/manage-daemon/update-daemon-set/)을 참고한다.
* [기존 데몬셋 파드를 인계받기 위한 데몬셋 생성](/ko/docs/concepts/workloads/controllers/daemonset/)을 참고한다.
