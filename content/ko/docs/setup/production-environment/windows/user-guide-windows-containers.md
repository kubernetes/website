---
reviewers:
title: 쿠버네티스에서 윈도우 컨테이너 스케줄링을 위한 가이드
content_template: templates/concept
weight: 75
---

{{% capture overview %}}

많은 조직에서 실행하는 서비스와 애플리케이션의 상당 부분이 윈도우 애플리케이션으로 구성된다. 이 가이드는 쿠버네티스에서 윈도우 컨테이너를 구성하고 배포하는 단계를 안내한다.

{{% /capture %}}

{{% capture body %}}

## 목표

* 윈도우 노드에서 윈도우 컨테이너를 실행하는 예시 디플로이먼트를 구성한다.
* (선택) 그룹 매니지드 서비스 어카운트(GMSA)를 이용한 사용자 파드를 위한 액티브 디렉터리 신원(Active Directory Identity)을 구성한다.

## 시작하기 전에

* [윈도우 서버에서 운영하는 마스터와 워커 노드](../user-guide-windows-nodes)를 포함한 쿠버네티스 클러스터를 생성한다.
* 쿠버네티스에서 서비스와 워크로드를 생성하고 배포하는 것은 리눅스나 윈도우 컨테이너 모두 비슷한 방식이라는 것이 중요하다. [Kubectl 커맨드](/docs/reference/kubectl/overview/)로 클러스터에 접속하는 것은 동일하다. 아래 단원의 예시는 윈도우 컨테이너를 경험하기 위해 제공한다.

## 시작하기: 윈도우 컨테이너 배포하기

쿠버네티스에서 윈도우 컨테이너를 배포하려면, 먼저 예시 애플리케이션을 생성해야 한다. 아래 예시 YAML 파일은 간단한 웹서버 애플리케이션을 생성한다. 아래 내용으로 채운 서비스 스펙을 `win-webserver.yaml`로 생성하자.

```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: win-webserver
      labels:
        app: win-webserver
    spec:
      ports:
      # 이 서비스에서 제공하는 포트
      - port: 80
        targetPort: 80
      selector:
        app: win-webserver
      type: NodePort
    ---
    apiVersion: extensions/v1beta1
    kind: Deployment
    metadata:
      labels:
        app: win-webserver
      name: win-webserver
    spec:
      replicas: 2
      template:
        metadata:
          labels:
            app: win-webserver
          name: win-webserver
        spec:
          containers:
          - name: windowswebserver
            image: mcr.microsoft.com/windows/servercore:ltsc2019
            command:
            - powershell.exe
            - -command
            - "<#code used from https://gist.github.com/wagnerandrade/5424431#> ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count += $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString+='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
          nodeSelector:
            beta.kubernetes.io/os: windows
```

{{< note >}}
포트 매핑도 지원하지만, 간략한 예시를 위해 컨테이너 포트 80을 직접 서비스로 노출한다.
{{< /note >}}

1. 모든 노드가 건강한지 확인한다.

    ```bash
    kubectl get nodes
    ```

1. 서비스를 배포하고 파드 갱신을 지켜보자.

    ```bash
    kubectl apply -f win-webserver.yaml
    kubectl get pods -o wide -w
    ```

    이 서비스가 정확히 배포되면 모든 파드는 Ready로 표기된다. 지켜보기를 중단하려면, Ctrl+C 를 누르자.

1. 이 디플로이먼트가 성공적인지 확인한다. 다음을 검토하자.

    * 윈도우 노드에 파드당 두 컨테이너, `docker ps`를 사용한다.
    * 리눅스 마스터에서 나열된 두 파드, `kubectl get pods`를 사용한다.
    * 네트워크를 통한 노드에서 파드 간에 통신, 리눅스 마스터에서 `curl`을 파드 IP 주소의 80 포트로 실행하여 웹 서버 응답을 확인한다.
    * 파드와 파드 간에 통신, `docker exec` 나 `kubectl exec`를 이용해 파드 간에 핑(ping)한다(윈도우 노드를 여럿가지고 있다면 호스트를 달리하며).
    * 서비스와 파드 간에 통신, 리눅스 마스터와 독립 파드에서 `curl`을 가상 서비스 IP 주소(`kubectl get services`로 보여지는)로 실행한다.
    * 서비스 검색(discovery), 쿠버네티스 [기본 DNS 접미사](/docs/concepts/services-networking/dns-pod-service/#services)와 서비스 이름으로 `curl`을 실행한다.
    * 인바운드 연결, 클러스터 외부 장비나 리눅스 마스터에서 NodePort로 `curl`을 실행한다.
    * 아웃바운드 연결, `kubectl exec`를 이용해서 파드에서 외부 IP 주소로 `curl`을 실행한다.

{{< note >}}
윈도우 컨테이너 호스트는 현재 윈도우 네트워킹 스택의 플랫폼 제한으로 인해, 그 안에서 스케줄링하는 서비스의 IP 주소로 접근할 수 없다. 윈도우 파드만 서비스 IP 주소로 접근할 수 있다.
{{< /note >}}

## 그룹 매니지드 서비스 어카운트를 이용하여 워크로드 신원 관리하기

쿠버네티스 v1.14부터 윈도우 컨테이너 워크로드는 그룹 매니지드 서비스 어카운트(GMSA, Group Managed Service Account)를 이용하여 구성할 수 있다. 그룹 매니지드 서비스 어카운트는 액티브 디렉터리 어카운트의 특정한 종류로 자동 암호 관리 기능, 단순화된 서비스 주체 이름(SPN, simplified service principal name), 여러 서버의 다른 관리자에게 관리를 위임하는 기능을 제공한다. GMSA로 구성한 컨테이너는 GMSA로 구성된 신원을 들고 있는 동안 외부 액티브 디렉터리 도메인 리소스를 접근할 수 있다. 윈도우 컨테이너를 위한 GMSA를 이용하고 구성하는 방법은 [여기](/docs/tasks/configure-pod-container/configure-gmsa/)에서 알아보자.

## 테인트(Taint)와 톨러레이션(Toleration)

오늘날 사용자는 리눅스와 윈도우 워크로드를 특정 OS 노드별로 보존하기 위해 테인트와 노드 셀렉터(nodeSelector)의 조합을 이용해야 한다. 이것은 윈도우 사용자에게만 부담을 줄 것으로 보인다. 아래는 권장되는 방식의 개요인데, 이것의 주요 목표 중에 하나는 이 방식이 기존 리눅스 워크로드와 호환되어야 한다는 것이다.

### 특정 OS 워크로드를 적절한 컨테이너 호스트에서 처리하도록 보장하기

사용자는 윈도우 컨테이너가 테인트와 톨러레이션을 이용해서 적절한 호스트에서 스케줄링되기를 보장할 수 있다. 오늘날 모든 쿠버네티스 노드는 다음 기본 레이블을 가지고 있다.

* beta.kubernetes.io/os = [windows|linux]
* beta.kubernetes.io/arch = [amd64|arm64|...]

파드 사양에 노드 셀렉터를 `"beta.kubernetes.io/os": windows`와 같이 지정하지 않았다면, 그 파드는 리눅스나 윈도우, 아무 호스트에나 스케줄링될 수 있다. 윈도우 컨테이너는 윈도우에서만 운영될 수 있고 리눅스 컨테이너는 리눅스에서만 운영될 수 있기 때문에 이는 문제를 일으킬 수 있다. 가장 좋은 방법은 노드 셀렉터를 사용하는 것이다.

그러나 많은 경우 사용자는 이미 존재하는 대량의 리눅스 컨테이너용 디플로이먼트를 가지고 있을 뿐만 아니라, 헬름(Helm) 차트 커뮤니티 같은 상용 구성의 에코시스템이나, 오퍼레이터(Operator) 같은 프로그래밍 방식의 파드 생성 사례가 있음을 알고 있다. 이런 상황에서는 노드 셀렉터를 추가하는 구성 변경을 망설일 수 있다. 이에 대한 대안은 테인트를 사용하는 것이다. Kubelet은 등록하는 동안 테인트를 설정할 수 있기 때문에, 윈도우에서만 운영할 때에 자동으로 테인트를 추가하기 쉽다.

예를 들면,  `--register-with-taints='os=Win1809:NoSchedule'`

모든 윈도우 노드에 테인트를 추가하여 아무 것도 거기에 스케줄링하지 않게 될 것이다(존재하는 리눅스 파드를 포함하여). 윈도우 파드가 윈도우 노드에 스케줄링되려면, 윈도우를 선택하기 위한 노드 셀렉터 및 적합하게 일치하는 톨러레이션이 모두 필요하다.

```yaml
nodeSelector:
    "beta.kubernetes.io/os": windows
tolerations:
    - key: "os"
      operator: "Equal"
      value: "Win1809"
      effect: "NoSchedule"
```

{{% /capture %}}
