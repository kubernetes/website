---
title: "쿠버네티스에서의 윈도우"
simple_list: true
weight: 200
description: >-
  쿠버네티스는 마이크로소프트 윈도우를 실행하는 노드를 지원한다.
---

쿠버네티스는 리눅스 또는 마이크로소프트 윈도우를 실행하는 워커
{{< glossary_tooltip text="노드" term_id="node" >}}를 지원한다.

{{% thirdparty-content single="true" %}}

CNCF와 상위 조직인 Linux Foundation은 호환성에 대해 벤더 중립적인 접근 방식을 취한다.
[윈도우 서버](https://www.microsoft.com/en-us/windows-server)를 쿠버네티스 클러스터의
워커 노드로 참여시킬 수 있다.

클러스터 내부에서 어떤 운영 체제를 사용하든
[윈도우에 kubectl을 설치하고 설정할 수 있다](/docs/tasks/tools/install-kubectl-windows/).

윈도우 노드를 사용하는 경우, 다음 문서를 참고한다.

* [윈도우에서의 네트워킹](/docs/concepts/services-networking/windows-networking/)
* [쿠버네티스에서의 윈도우 스토리지](/docs/concepts/storage/windows-storage/)
* [윈도우 노드의 자원 관리](/docs/concepts/configuration/windows-resource-management/)
* [윈도우 파드 및 컨테이너에서 RunAsUserName 구성](/docs/tasks/configure-pod-container/configure-runasusername/)
* [윈도우 HostProcess 파드 생성하기](/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* [윈도우 파드 및 컨테이너용 그룹 관리 서비스 어카운트 구성](/docs/tasks/configure-pod-container/configure-gmsa/)
* [윈도우 노드에서의 보안](/docs/concepts/security/windows-security/)
* [윈도우 디버깅 팁](/docs/tasks/debug/debug-cluster/windows/)
* [쿠버네티스에서 윈도우 컨테이너 스케줄링을 위한 가이드](/docs/concepts/windows/user-guide)

또는 개요를 확인하려면 다음 문서를 참고한다.
