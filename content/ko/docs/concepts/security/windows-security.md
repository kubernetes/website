---
# reviewers:
# - jayunit100
# - jsturtevant
# - marosset
# - perithompson
title: 윈도우 노드에서의 보안
content_type: concept
weight: 40
---

<!-- overview -->

이 페이지에서는 윈도우 운영 체제에서의 보안 고려 사항 및 추천 사례에 대해 기술한다.

<!-- body -->

## 노드의 시크릿 데이터 보호

윈도우에서는 시크릿 데이터가 노드의 로컬 스토리지에 
평문으로 기록된다(리눅스는 tmpfs 또는 인메모리 파일시스템에 기록). 
클러스터 운영자로서, 다음 2 가지의 추가 사항을 고려해야 한다.

1. 파일 ACL을 사용하여 시크릿의 파일 위치를 보호한다.
1. [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server)를 사용하여
  볼륨 수준의 암호화를 적용한다.

## 컨테이너 사용자

윈도우 파드 또는 컨테이너에 
[RunAsUsername](/ko/docs/tasks/configure-pod-container/configure-runasusername/)을 설정하여 
해당 컨테이너 프로세스를 실행할 사용자를 지정할 수 있다. 
이는 [RunAsUser](/ko/docs/concepts/security/pod-security-policy/#사용자-및-그룹)와 대략적으로 동등하다.

윈도우 컨테이너는 ContainerUser와 ContainerAdministrator라는 기본 사용자 계정을 2개 제공한다. 
이 두 사용자 계정이 어떻게 다른지는 마이크로소프트의 _안전한 윈도우 컨테이너_ 문서 내의 
[언제 ContainerAdmin 및 ContainerUser 사용자 계정을 사용해야 하는가](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts)를
참고한다.

컨테이너 빌드 과정에서 컨테이너 이미지에 로컬 사용자를 추가할 수 있다.

{{< note >}}

* [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) 기반 이미지는
  기본적으로 `ContainerUser`로 실행된다
* [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) 기반 이미지는
  기본적으로 `ContainerAdministrator`로 실행된다

{{< /note >}}

[그룹 관리 서비스 어카운트](/ko/docs/tasks/configure-pod-container/configure-gmsa/)를 활용하여
윈도우 컨테이너를 Active Directory 사용자로 실행할 수도 있다.

## 파드-수준 보안 격리

리눅스 특유의 파드 보안 컨텍스트 메커니즘(예: SELinux, AppArmor, Seccomp, 
또는 커스텀 POSIX 기능)은 윈도우 노드에서 지원되지 않는다.

특권을 가진(Privileged) 컨테이너는
윈도우에서 [지원되지 않는다](/ko/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext). 
대신, 리눅스에서 권한 있는 컨테이너가 할 수 있는 작업 중 많은 부분을 윈도우에서 수행하기 위해
[HostProcess 컨테이너](/docs/tasks/configure-pod-container/create-hostprocess-pod)를 사용할 수 있다.
