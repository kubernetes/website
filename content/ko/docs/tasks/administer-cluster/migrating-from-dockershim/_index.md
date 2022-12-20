---
title: "도커심으로부터 마이그레이션"
weight: 10
content_type: task
no_list: true
---

<!-- overview -->

이 섹션은 도커심에서 다른 컨테이너 런타임으로
마이그레이션할 때에 알아야 할 정보를 제공한다.

쿠버네티스 1.20에서의 [도커심 사용 중단(deprecation)](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation) 발표 이후,
이것이 다양한 워크로드와 쿠버네티스 설치에
어떻게 영향을 미칠지에 대한 질문이 많았다. [도커심 제거 FAQ](/blog/2022/02/17/dockershim-faq/)는
관련된 문제를 더 잘 이해할 수 있도록 도움을 준다.

도커심은 쿠버네티스 릴리스 v1.24부터 제거되었다.
컨테이너 런타임으로 도커 엔진을 통한 도커심을 사용하는 상황에서 v1.24로
업그레이드하려는 경우, 다른 런타임으로 마이그레이션하거나 다른 방법을 찾아 도커 엔진 지원을 받는 것이 좋다.
선택 가능한 옵션은 [컨테이너 런타임](/ko/docs/setup/production-environment/container-runtimes/) 섹션에서 확인한다.
마이그레이션 중 문제를 마주한다면
[문제를 보고](https://github.com/kubernetes/kubernetes/issues)하면 좋다. 이를 통해 문제를 시기적절하게
해결할 수 있으며, 클러스터도 도커심 제거에
대비할 수 있다.

클러스터는 두 종류 이상의 노드들을 포함할 수 있지만
이는 일반적인 구성은 아니다.

다음 작업을 통해 마이그레이션을 수행할 수 있다.

- [도커심 제거가 당신에게 영향을 미치는지 확인하기](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
- [도커 엔진 노드를 도커심에서 cri-dockerd로 마이그레이션하기](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
- [도커심으로부터 보안 및 텔레메트리 에이전트 마이그레이션하기](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)

## {{% heading "whatsnext" %}}

- 컨테이너 런타임에 대한 옵션을 이해하기 위해
  [컨테이너 런타임](/ko/docs/setup/production-environment/container-runtimes/)을 확인한다.
* 도커심의
  사용 중단 및 제거에 대한 논의를 추적하는
  [깃허브 이슈](https://github.com/kubernetes/kubernetes/issues/106917)가 있다.
* 도커심에서 마이그레이션하는 것에 관한
  결함이나 다른 기술적 문제를 발견한다면,
  쿠버네티스 프로젝트에 [이슈를 남길 수 있다.](https://github.com/kubernetes/kubernetes/issues/new/choose)