---
# reviewers:
# - bprashanth
# - enisoc
# - erictune
# - foxish
# - janetkuo
# - kow3ns
# - smarterclayton
title: 스테이트풀셋 디버깅하기
content_type: task
weight: 30
---

<!-- overview -->
이 문서에서는 스테이트풀셋을 디버깅 방법에 대해 설명한다.

## {{% heading "prerequisites" %}}

* 쿠버네티스 클러스터가 준비되어 있어야 하고, kubectl 커맨드 라인 도구가 클러스터와 통신할 수 있게 사전에 설정되어 있어야 한다.
* 조사하고자 하는 스테이트풀셋이 사전에 준비되어 있어야 한다.

<!-- steps -->

## 스테이트풀셋 디버깅하기

레이블이 `app.kubernetes.io/name=MyApp`으로 지정된 스테이트풀셋 파드를 전부 나열하기 위해서는
다음의 명령을 사용할 수 있다.

```shell
kubectl get pods -l app.kubernetes.io/name=MyApp
```

만약 오랜 시간동안 `Unknown`이나 `Terminating` 상태에 있는
파드들을 발견하였다면, 이러한 파드들을 어떻게 다루는지 알아보기 위해 
[스테이트풀셋 파드 삭제하기](/ko/docs/tasks/run-application/delete-stateful-set/)를 참고하길 바란다.
스테이트풀셋에 포함된 개별 파드들을 디버깅하기 위해서는
[파드 디버그하기](/ko/docs/tasks/debug/debug-application/debug-pods/) 가이드를 참고하길 바란다.

## {{% heading "whatsnext" %}}

[초기화 컨테이너(Init container) 디버그하기](/ko/docs/tasks/debug/debug-application/debug-init-containers/)를 참고하길 바란다.
