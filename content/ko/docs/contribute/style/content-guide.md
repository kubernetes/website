---
title: 문서 콘텐츠 가이드
linktitle: Content guide
content_type: concept
weight: 10
---

<!-- overview -->

이 페이지는 쿠버네티스 문서에 대한 가이드라인을 포함한다.

허용되는 항목에 대한 질문이 있다면, [쿠버네티스 Slack](https://slack.k8s.io/)의 #sig-docs 채널에 가입하고
물어보자! 

https://slack.k8s.io/ 에서 쿠버네티스 Slack에 등록할 수 있다.

쿠버네티스 문서의 새 콘텐츠 생성에 대한 내용은 
[스타일 가이드](/docs/contribute/style/style-guide)를 따른다.



<!-- body -->

## 개요

문서를 포함한 쿠버네티스 웹사이트에 대한 소스는 
[Kubernetes/website](https://github.com/kubernetes/website) 레포지토리에 있다.

`kubernetes/website/content/<language_code>/docs`폴더에 있는 
대부분의 쿠버네티스 문서는
[쿠버네티스 프로젝트](https://github.com/kubernetes/kubernetes)에 한정된다.

## 허용되는 항목

쿠버네티스 문서는 다음과 같은 경우에만 타사(third-party) 프로젝트에 대한 콘텐츠를 허용한다.

- 쿠버네티스 프로젝트의 소프트웨어 콘텐츠 문서
- 프로젝트에 포함되지 않지만 쿠버네티스가 작동하는데 필요한 소프트웨어 문서 콘텐츠
- 콘텐츠가 kubernetes.io의 표준이거나 다른 곳의 표준 콘텐츠 링크

### 타사 콘텐츠

쿠버네티스 문서에는 쿠버네티스 프로젝트&mdash;[쿠버네티스](https://github.com/kubernetes)와 [쿠버네티스-sigs](https://github.com/kubernetes-sigs) Github 조직의 프로젝트
의 프로젝트에 적용된 예제가 포함되어 있다. 

쿠버네티스 프로젝트의 활성 콘텐츠에 대한 링크는 항상 허용된다.

쿠버네티스가 작동하려면 일부 타사 콘텐츠가 필요하다. 예제는 컨테이너 런타임(containerd, CRI-O, Docker),
[네트워킹 정책](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) (CNI 플러그인), [인그레스 컨트롤러](/ko/docs/concepts/services-networking/ingress-controllers/), 그리고 [로깅](/ko/docs/concepts/cluster-administration/logging/)을 포함한다.

문서는 쿠버네티스가 작동하는 데 필요한 경우에만 쿠버네티스 프로젝트 외부의 타사 오픈 소스 소프트웨어(OSS)에 연결할 수 있다. 

### 이중 소스 콘텐츠

가능하면, 쿠버네티스 문서는 이중 소스 콘텐츠를 호스팅하는 대신 표준 소스에
연결한다.

이중 소스 콘텐츠(Dual sourced)는 유지보수에 두 배(또는 그 이상의!) 노력이 필요하고
더 빨리 진부 해진다.

{{< note >}}

쿠버네티스 프로젝트의 관리자이고 문서를 호스팅하는 데 도움이 필요하다면, 
[쿠버네티스 Slack의 #sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/)에서 도움을 요청하자.

{{< /note >}}

### 추가 정보

허용되는 콘텐츠에 대해 질문이 있다면, [쿠버네티스 Slack](https://slack.k8s.io/) #sig-docs 채널에 가입하고 물어보자!



## {{% heading "whatsnext" %}}


* [스타일 가이드](/docs/contribute/style/style-guide)에 대해 읽어보기.
