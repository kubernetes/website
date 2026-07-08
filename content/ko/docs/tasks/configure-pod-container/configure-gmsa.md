---
title: 윈도우 파드와 컨테이너용 GMSA 구성
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

이 페이지는 윈도우 노드에서 실행되는 파드와 컨테이너용으로 [그룹 관리 서비스 어카운트(Group Managed Service Accounts,](https://docs.microsoft.com/ko-kr/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) GMSA)를 구성하는 방법을 소개한다. 그룹 관리 서비스 어카운트는 자동 암호 관리, 단순화된 서비스 사용자 이름(service principal name, SPN) 관리, 여러 서버에 걸쳐 다른 관리자에게 관리를 위임하는 기능을 제공하는 특정한 유형의 액티브 디렉터리(Active Directory) 계정이다.

쿠버네티스에서 GMSA 자격 증명 사양은 쿠버네티스 클러스터 전체 범위에서 사용자 정의 리소스(Custom Resources)로 구성된다. 윈도우 파드 및 파드 내의 개별 컨테이너들은 다른 윈도우 서비스와 상호 작용할 때 도메인 기반 기능(예: Kerberos 인증)에 GMSA를 사용하도록 구성할 수 있다.

## {{% heading "prerequisites" %}}

쿠버네티스 클러스터가 있어야 하며 클러스터와 통신하도록 `kubectl` 커맨드라인 툴을 구성해야 한다. 클러스터에는 윈도우 워커 노드가 있어야 한다. 이 섹션에서는 각 클러스터에 대해 한 번씩 필요한 일련의 초기 단계를 다룬다.

### GMSACredentialSpec CRD 설치

GMSA 자격 증명 사양 리소스에 대한 [커스텀리소스데피니션(CustomResourceDefinition,](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) CRD)을 클러스터에서 구성하여 사용자 정의 리소스 유형 `GMSACredentialSpec`을 정의해야 한다. GMSA CRD [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml)을 다운로드하고 gmsa-crd.yaml로 저장한다.
다음, `kubectl apply -f gmsa-crd.yaml` 로 CRD를 설치한다.

### GMSA 사용자를 검증하기 위해 웹훅 설치

쿠버네티스 클러스터에서 두 개의 웹훅을 구성하여 파드 또는 컨테이너 수준에서 GMSA 자격 증명 사양 참조를 채우고 검증한다.

1. 변형(mutating) 웹훅은 (파드 사양의 이름별로) GMSA에 대한 참조를 파드 사양 내 JSON 형식의 전체 자격 증명 사양으로 확장한다.

1. 검증(validating) 웹훅은 GMSA에 대한 모든 참조가 파드 서비스 어카운트에서 사용하도록 승인되었는지 확인한다.

위의 웹훅 및 관련 오브젝트를 설치하려면 다음 단계가 필요하다.

1. 인증서 키 쌍 생성 (웹훅 컨테이너가 클러스터와 통신할 수 있도록 하는데 사용됨)

1. 위의 인증서로 시크릿을 설치

1. 핵심 웹훅 로직에 대한 디플로이먼트(deployment)를 생성

1. 디플로이먼트를 참조하여 검증 및 변경 웹훅 구성을 생성

[스크립트](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh)를 사용하여 GMSA 웹훅과 위에서 언급한 관련 오브젝트를 배포 및 구성할 수 있다. 스크립트는 ```--dry-run=server``` 옵션으로 실행되어 클러스터에 대한 변경 사항을 검토할 수 있다.

스크립트에서 사용하는 [YAML 템플릿](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl)을 사용하여 웹훅 및 (파라미터를 적절히 대체하여) 관련 오브젝트를 수동으로 배포할 수도 있다. 

<!-- steps -->

## 액티브 디렉터리에서 GMSA 및 윈도우 노드 구성

쿠버네티스의 파드가 GMSA를 사용하도록 구성되기 전에 [윈도우 GMSA 문서](https://docs.microsoft.com/ko-kr/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1)에 설명된 대로 액티브 디렉터리에서 원하는 GMSA를 프로비저닝해야 한다. [윈도우 GMSA 문서](https://docs.microsoft.com/ko-kr/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet)에 설명된 대로 원하는 GMSA와 연결된 시크릿 자격 증명에 접근하려면 (쿠버네티스 클러스터의 일부인) 윈도우 워커 노드를 액티브 디렉터리에서 구성해야 한다.

## GMSA 자격 증명 사양 리소스 생성

(앞에서 설명한 대로) GMSACredentialSpec CRD를 설치하면 GMSA 자격 증명 사양이 포함된 사용자 정의 리소스를 구성할 수 있다. GMSA 자격 증명 사양에는 시크릿 또는 민감한 데이터가 포함되어 있지 않다. 이것은 컨테이너 런타임이 원하는 윈도우 컨테이너 GMSA를 설명하는 데 사용할 수 있는 정보이다. GMSA 자격 증명 사양은 [PowerShell 스크립트](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1) 유틸리티를 사용하여 YAML 형식으로 생성할 수 있다.

다음은 JSON 형식으로 GMSA 자격 증명 사양 YAML을 수동으로 생성한 다음 변환하는 단계이다.

1. CredentialSpec [모듈](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1) 가져오기(import): `ipmo CredentialSpec.psm1`

1. `New-CredentialSpec`을 사용하여 JSON 형식의 자격 증명 사양을 만든다. WebApp1이라는 GMSA 자격 증명 사양을 만들려면 `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`를 호출한다.

1. `Get-CredentialSpec`을 사용하여 JSON 파일의 경로를 표시한다.

1. credspec 파일을 JSON에서 YAML 형식으로 변환하고 필요한 헤더 필드 `apiVersion`, `kind`, `metadata`, `credspec`을 적용하여 쿠버네티스에서 구성할 수 있는 GMSACredentialSpec 사용자 정의 리소스로 만든다.

다음 YAML 구성은 `gmsa-WebApp1`이라는 GMSA 자격 증명 사양을 설명한다.

```yaml
apiVersion: windows.k8s.io/v1
kind: GMSACredentialSpec
metadata:
  name: gmsa-WebApp1  #임의의 이름이지만 참조로 사용된다.
credspec:
  ActiveDirectoryConfig:
    GroupManagedServiceAccounts:
    - Name: WebApp1   #GMSA 계정의 사용자 이름
      Scope: CONTOSO  #NETBIOS 도메인 명
    - Name: WebApp1   #GMSA 계정의 사용자 이름
      Scope: contoso.com #DNS 도메인 명
  CmsPlugins:
  - ActiveDirectory
  DomainJoinConfig:
    DnsName: contoso.com  #DNS 도메인 명
    DnsTreeName: contoso.com #DNS 도메인 명 루트
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  #GUID
    MachineAccountName: WebApp1 #GMSA 계정의 사용자 이름
    NetBiosName: CONTOSO  #NETBIOS 도메인 명
    Sid: S-1-5-21-2126449477-2524075714-3094792973 #SID of GMSA
```

위의 자격 증명 사양 리소스는 `gmsa-Webapp1-credspec.yaml`로 저장되고 `kubectl apply -f gmsa-Webapp1-credspec.yml`을 사용하여 클러스터에 적용될 수 있다.

## 특정 GMSA 자격 증명 사양에서 RBAC를 활성화하도록 cluster role 구성

각 GMSA 자격 증명 사양 리소스에 대해 cluster role을 정의해야 한다. 이것은 일반적으로 서비스 어카운트인 주체에 의해 특정 GMSA 리소스에 대한 `use` 동사를 승인한다. 다음 예는 위에서 `gmsa-WebApp1` 자격 증명 사양의 사용을 승인하는 클러스터 롤(cluster role)을 보여준다. 파일을 gmsa-webapp1-role.yaml로 저장하고 `kubectl apply -f gmsa-webapp1-role.yaml`을 사용하여 적용한다.

```yaml
#credspec을 읽을 Role 생성
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: webapp1-role
rules:
- apiGroups: ["windows.k8s.io"]
  resources: ["gmsacredentialspecs"]
  verbs: ["use"]
  resourceNames: ["gmsa-WebApp1"]
```

## 특정 GMSA credspecs를 사용하도록 서비스 어카운트에 롤 할당

(파드가 사용하게 되는) 서비스 어카운트는 위에서 생성한 클러스터 롤에 바인딩되어야 한다. 이렇게 하면 서비스 어카운트가 원하는 GMSA 자격 증명 사양 리소스를 사용할 수 있다. 다음은 위에서 생성한 `gmsa-WebApp1` 자격 증명 사양 리소스를 사용하기 위해 `webapp1-role` 클러스터 롤에 바인딩되는 기본(default) 서비스 어카운트이다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: allow-default-svc-account-read-on-gmsa-WebApp1
  namespace: default
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: webapp1-role
  apiGroup: rbac.authorization.k8s.io
```

## 파드 사양에서 GMSA 자격 증명 사양 참조 구성

파드 사양 필드 `securityContext.windowsOptions.gmsaCredentialSpecName`은 파드 사양에서 원하는 GMSA 자격 증명 사양 사용자 정의 리소스에 대한 참조를 지정하는 데 사용된다. 이렇게 하면 지정된 GMSA를 사용하도록 파드 사양의 모든 컨테이너가 구성된다. 다음은 `gmsa-WebApp1`을 참조하도록 채워진 어노테이션이 있는 샘플 파드 사양이다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      securityContext:
        windowsOptions:
          gmsaCredentialSpecName: gmsa-webapp1
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
      nodeSelector:
        kubernetes.io/os: windows
```

파드 사양의 개별 컨테이너는 컨테이너별 `securityContext.windowsOptions.gmsaCredentialSpecName` 필드를 사용하여 원하는 GMSA credspec을 지정할 수도 있다. 다음은 예이다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
        securityContext:
          windowsOptions:
            gmsaCredentialSpecName: gmsa-Webapp1
      nodeSelector:
        kubernetes.io/os: windows
```

(위에서 설명한 대로) GMSA 필드가 채워진 파드 사양이 클러스터에 적용되면 다음과 같은 일련의 이벤트가 발생한다.

1. 변형 웹훅은 GMSA 자격 증명 사양 리소스에 대한 모든 참조를 확인하고 GMSA 자격 증명 사양의 내용으로 확장한다.

1. 검증 웹훅은 파드와 연결된 서비스 어카운트가 지정된 GMSA 자격 증명 사양의 `use` 동사에 대해 승인되었는지 확인한다.

1. 컨테이너 런타임은 컨테이너가 액티브 디렉터리에서 GMSA의 ID를 가정하고 해당 ID를 사용하여 도메인의 서비스에 접근할 수 있도록 지정된 GMSA 자격 증명 사양으로 각 윈도우 컨테이너를 구성한다.

## 호스트네임 또는 FQDN을 사용하는 경우에 네트워크 공유에 인증하기

파드에서 호스트네임 또는 FQDN을 사용하여 SMB 공유에 연결할 때 문제를 겪고 있으나, IPv4 주소로는 해당 공유에 접속이 가능한 상황이라면, 윈도우 노드에 다음 레지스트리 키를 등록했는지 확인한다.

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\hns\State" /v EnableCompartmentNamespace /t REG_DWORD /d 1
```

그런 다음 동작 변경 사항을 적용하려면 실행 중인 파드를 다시 생성해야 한다.
이 레지스트리 키가 어떻게 사용되는지에 대한 자세한 정보는 
[여기](https://github.com/microsoft/hcsshim/blob/885f896c5a8548ca36c88c4b87fd2208c8d16543/internal/uvm/create.go#L74-L83)에서 볼 수 있다.

## 문제 해결

GMSA가 사용자 환경에서 작동하도록 하는 데 어려움이 있는 경우 취할 수 있는 몇 가지 문제 해결 단계가 있다.

먼저 credspec이 파드에 전달되었는지 확인한다. 이렇게 하려면 파드 중 하나에서 `exec`를 실행하고 `nltest.exe /parentdomain` 명령의 출력을 확인해야 한다.

아래 예에서 파드는 credspec을 올바르게 가져오지 못했다.

```PowerShell
kubectl exec -it iis-auth-7776966999-n5nzr powershell.exe
```

`nltest.exe /parentdomain` 는 다음과 같은 오류를 발생시킨다.

```output
Getting parent domain failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

파드가 credspec을 올바르게 가져오면 다음으로 도메인과의 통신을 확인한다. 먼저 파드 내부에서 nslookup을 빠르게 수행하여 도메인의 루트를 찾는다.

이것은 다음의 세 가지를 의미한다.

1. 파드는 DC에 도달할 수 있다.
1. DC는 파드에 도달할 수 있다.
1. DNS가 올바르게 작동하고 있다.

DNS 및 통신 테스트를 통과하면 다음으로 파드가 도메인과 보안 채널 통신을 설정했는지 확인해야 한다. 이렇게 하려면 파드에서 다시 `exec`를 실행하고 `nltest.exe /query` 명령을 실행한다.

```PowerShell
nltest.exe /query
```

결과는 다음과 같다.

```output
I_NetLogonControl failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

이것은 어떤 이유로 파드가 credspec에 지정된 계정을 사용하여 도메인에 로그온할 수 없음을 알려준다. 다음을 실행하여 보안 채널 복구를 시도할 수 있다.

```PowerShell
nltest /sc_reset:domain.example
```

명령이 성공하면 다음과 유사한 출력이 표시된다.

```output
Flags: 30 HAS_IP  HAS_TIMESERV
Trusted DC Name \\dc10.domain.example
Trusted DC Connection Status Status = 0 0x0 NERR_Success
The command completed successfully
```

위의 방법으로 오류가 수정되면 다음 수명 주기 훅(hook)을 파드 사양에 추가하여 단계를 자동화할 수 있다. 오류가 수정되지 않은 경우 credspec을 다시 검사하여 정확하고 완전한지 확인해야 한다.

```yaml
        image: registry.domain.example/iis-auth:1809v1
        lifecycle:
          postStart:
            exec:
              command: ["powershell.exe","-command","do { Restart-Service -Name netlogon } while ( $($Result = (nltest.exe /query); if ($Result -like '*0x0 NERR_Success*') {return $true} else {return $false}) -eq $false)"]
        imagePullPolicy: IfNotPresent
```

위의 `lifecycle` 섹션을 파드 사양에 추가하면, 파드는 `nltest.exe /query` 명령이 오류 없이 종료될 때까지 나열된 명령을 실행하여 `netlogon` 서비스를 다시 시작한다.
