---
title: 도커심 제거 및 CRI 호환 런타임 사용에 대한 기사
content_type: reference
weight: 20
---
<!-- overview -->
이 문서는 쿠버네티스의 _도커심_
사용 중단(deprecation) 및 제거, 또는
해당 제거를 고려한 CRI 호환 컨테이너 런타임
사용에 관한 기사 및 기타 페이지 목록을 제공한다.

<!-- body -->

## 쿠버네티스 프로젝트

* 쿠버네티스 블로그: [도커심 제거 FAQ](/blog/2020/12/02/dockershim-faq/) (originally published 2020/12/02)

* 쿠버네티스 블로그: [업데이트: 도커심 제거 FAQ](/blog/2022/02/17/dockershim-faq/) (updated published 2022/02/17)

* 쿠버네티스 블로그: [도커심에서 움직이는 쿠버네티스: 약속과 다음 단계](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/) (published 2022/01/07)

* 쿠버네티스 블로그: [도커심 제거가 다가오고 있다. 준비됐는가?](/blog/2021/11/12/are-you-ready-for-dockershim-removal/) (published 2021/11/12)

* 쿠버네티스 문서: [도커심에서 마이그레이션하기](/ko/docs/tasks/administer-cluster/migrating-from-dockershim/)

* 쿠버네티스 문서: [컨테이너 런타임](/ko/docs/setup/production-environment/container-runtimes/)

* 쿠버네티스 개선 제안 이슈: [KEP-2221: kubelet에서 도커심 제거하기](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2221-remove-dockershim/README.md)

* 쿠버네티스 개선 제안 이슈: [kubelet에서 도커심 제거하기](https://github.com/kubernetes/enhancements/issues/2221) (_k/enhancements#2221_)


GitHub 이슈를 통해 피드백을 제공할 수 있다. [**도커심 제거 피드백 및 이슈**](https://github.com/kubernetes/kubernetes/issues/106917). (_k/kubernetes/#106917_)

## 외부 소스 {#third-party}

<!-- sort these alphabetically -->

* 아마존 웹 서비스 EKS 문서: [아마존 EKS 도커심 지원 종료](https://docs.aws.amazon.com/eks/latest/userguide/dockershim-deprecation.html)

* CNCF 컨퍼런스 영상: [도커에서 containerd 런타임으로 마이그레이션하며 얻은 교훈](https://www.youtube.com/watch?v=uDOu6rK4yOk) (Ana Caylin, at KubeCon Europe 2019)

* 도커닷컴 블로그: [개발자가 도커, 도커 엔진 및 쿠버네티스 v1.20에 관해 알아야 할 사항](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/) (published 2020/12/04)

* "_구글 오픈소스_" 유튜브 채널: [구글과 함께 쿠버네티스 배우기 - 도커심에서 containerd로 마이그레이션하기](https://youtu.be/fl7_4hjT52g)

* Azure의 Microsoft 앱 블로그: [도커심 지원 중단 및 AKS](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/dockershim-deprecation-and-aks/ba-p/3055902) (published 2022/01/21)

* Mirantis 블로그: [도커심의 미래는 cri-dockerd](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/) (published 2021/04/21)

* Mirantis: [Mirantis/cri-dockerd](https://github.com/Mirantis/cri-dockerd) Git 리포지터리 (깃허브)

* Tripwire: [곧 다가올 도커심의 지원 중단이 당신의 쿠버네티스에 미칠 영향](https://www.tripwire.com/state-of-security/security-data-protection/cloud/how-dockershim-forthcoming-deprecation-affects-your-kubernetes/) (published 2021/07/01)
