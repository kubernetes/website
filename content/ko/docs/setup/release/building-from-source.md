---
title: 소스로부터 빌드
---

소스로부터 빌드하거나 이미 빌드된 릴리즈를 다운받을 수 있다. 쿠버네티스를 자체를 개발할 계획이 없다면, [릴리즈 노트](/docs/setup/release/notes/)에 있는 현재 릴리즈 빌드 버전을 사용하는 것을 추천한다.

쿠버네티스 소스코드는 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 리포지토리에서 다운받을 수 있다.

## 소스로부터 빌드

소스코드를 빌드만 하려면, 모든 빌드 과정이 도커 컨테이너안에서 실행되기 때문에 golang 환경을 구축할 필요가 없다.

릴리즈를 빌드하는 것은 간단하다.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

릴리즈 절차에 대한 더 자세한 설명은 kubernetes/kubernetes [`빌드`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/) 디렉토리를 참조한다.
