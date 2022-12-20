---
title: 윈도우 파드 및 컨테이너에서 RunAsUserName 구성
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

이 페이지에서는 윈도우 노드에서 실행될 파드 및 컨테이너에 `runAsUserName` 설정을 사용하는 방법을 소개한다. 이는 리눅스 관련 `runAsUser` 설정과 거의 동일하여, 컨테이너의 기본값과 다른 username으로 애플리케이션을 실행할 수 있다.



## {{% heading "prerequisites" %}}


쿠버네티스 클러스터가 있어야 하며 클러스터와 통신하도록 kubectl 명령줄 도구를 구성해야 한다. 클러스터에는 윈도우 워커 노드가 있어야 하고, 해당 노드에서 윈도우 워크로드를 실행하는 컨테이너의 파드가 스케쥴 된다.



<!-- steps -->

## 파드의 username 설정

파드의 컨테이너 프로세스를 실행할 username을 지정하려면 파드 명세에 `securityContext` 필드 ([PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)) 를 포함시키고, 그 안에 `runAsUserName` 필드를 포함하는 `windowsOptions` ([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)) 필드를 추가한다.

파드에 지정하는 윈도우 보안 컨텍스트 옵션은 파드의 모든 컨테이너 및 초기화 컨테이너에 적용된다.

다음은 `runAsUserName` 필드가 설정된 윈도우 파드의 구성 파일이다.

{{< codenew file="windows/run-as-username-pod.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-pod.yaml
```

파드의 컨테이너가 실행 중인지 확인한다.

```shell
kubectl get pod run-as-username-pod-demo
```

실행 중인 컨테이너의 셸에 접근한다.

```shell
kubectl exec -it run-as-username-pod-demo -- powershell
```

셸이 올바른 username인 사용자로 실행 중인지 확인한다.

```powershell
echo $env:USERNAME
```

결과는 다음과 같다.

```
ContainerUser
```

## 컨테이너의 username 설정

컨테이너의 프로세스를 실행할 username을 지정하려면, 컨테이너 매니페스트에 `securityContext` 필드 ([SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)) 를 포함시키고 그 안에 `runAsUserName` 필드를 포함하는 `windowsOptions` ([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)) 필드를 추가한다.

컨테이너에 지정하는 윈도우 보안 컨텍스트 옵션은 해당 개별 컨테이너에만 적용되며 파드 수준에서 지정한 설정을 재정의한다.

다음은 한 개의 컨테이너에 `runAsUserName` 필드가 파드 수준 및 컨테이너 수준에서 설정되는 파드의 구성 파일이다.

{{< codenew file="windows/run-as-username-container.yaml" >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-container.yaml
```

파드의 컨테이너가 실행 중인지 확인한다.

```shell
kubectl get pod run-as-username-container-demo
```

실행 중인 컨테이너의 셸에 접근한다.

```shell
kubectl exec -it run-as-username-container-demo -- powershell
```

셸이 사용자에게 올바른 username(컨테이너 수준에서 설정된 사용자)을 실행 중인지 확인한다.

```powershell
echo $env:USERNAME
```

결과는 다음과 같다.

```
ContainerAdministrator
```

## 윈도우 username 제약사항

이 기능을 사용하려면 `runAsUserName` 필드에 설정된 값이 유효한 username이어야 한다. 형식은 `DOMAIN\USER` 여야하고, 여기서 `DOMAIN\`은 선택 사항이다. 윈도우 username은 대소문자를 구분하지 않는다. 또한 `DOMAIN` 및 `USER` 와 관련된 몇 가지 제약사항이 있다.

- `runAsUserName` 필드는 비워 둘 수 없으며 제어 문자를 포함할 수 없다. (ASCII 값: `0x00-0x1F`, `0x7F`)
- `DOMAIN`은 NetBios 이름 또는 DNS 이름이어야 하며 각각 고유한 제한이 있다.
  - NetBios 이름: 최대 15 자, `.`(마침표)으로 시작할 수 없으며 다음 문자를 포함할 수 없다. `\ / : * ? " < > |`
  - DNS 이름: 최대 255 자로 영숫자, 마침표(`.`), 대시(`-`)로만 구성되며, 마침표 또는 대시로 시작하거나 끝날 수 없다.
- `USER`는 최대 20자이며, *오직* 마침표나 공백들로는 구성할 수 없고, 다음 문자는 포함할 수 없다. `" / \ [ ] : ; | = , + * ? < > @`.

`runAsUserName` 필드에 허용되는 값의 예 : `ContainerAdministrator`,`ContainerUser`, `NT AUTHORITY\NETWORK SERVICE`, `NT AUTHORITY\LOCAL SERVICE`.

이러한 제약사항에 대한 자세한 내용은 [여기](https://support.microsoft.com/en-us/help/909264/naming-conventions-in-active-directory-for-computers-domains-sites-and) 와 [여기](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1)를 확인한다.



## {{% heading "whatsnext" %}}


* [쿠버네티스에서 윈도우 컨테이너 스케줄링을 위한 가이드](/ko/docs/concepts/windows/user-guide/)
* [그룹 매니지드 서비스 어카운트를 이용하여 워크로드 신원 관리하기](/ko/docs/concepts/windows/user-guide/#그룹-매니지드-서비스-어카운트를-이용하여-워크로드-신원-관리하기)
* [윈도우 파드와 컨테이너의 GMSA 구성](/ko/docs/tasks/configure-pod-container/configure-gmsa/)

