---
title: "노드의 컨테이너 런타임을 도커 엔진에서 containerd로 변경하기"
weight: 10
content_type: task 
---

이 작업은 컨테이너 런타임을 도커에서 containerd로 업데이트하는 데 필요한 단계를 간략하게 설명한다. 이
작업은 쿠버네티스 1.23 이하 버전을 실행하는 클러스터 운영자에게 해당된다. 또한 도커심(dockershim)에서
containerd로 마이그레이션하는 예시 시나리오도 다룬다. 대체 가능한 컨테이너 런타임은
이 [페이지](/ko/docs/setup/production-environment/container-runtimes/)에서 선택할 수 있다.

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

containerd를 설치한다. 더 자세한 정보는
[containerd 설치 문서](https://containerd.io/docs/getting-started/)를 확인하거나
구체적인 사전 요구 사항은
[containerd 가이드](/ko/docs/setup/production-environment/container-runtimes/#containerd)를 따른다.

## 노드 드레인하기

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

`<node-to-drain>`를 드레인하려는 노드의 이름으로 바꾼다.

## 도커 데몬 멈추기

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

## Containerd 설치하기

containerd를 설치하는 자세한 방법은
[가이드](/ko/docs/setup/production-environment/container-runtimes/#containerd)를 참조한다.

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. 공식 도커 리포지터리에서 `containerd.io` 패키지를 설치한다. 
   각 리눅스 배포판의 도커 리포지터리를 설정하고 `containerd.io` 패키지를 설치하는
   지침은 [containerd 시작하기](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) 
   에서 확인할 수 있다.

1. containerd 설정:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```
1. containerd 재시작:

   ```shell
   sudo systemctl restart containerd
   ```
{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

Powershell 세션을 시작하고, `$Version`을 원하는 버전으로 설정한 다음(예: `$Version="1.4.3"`),
다음 명령을 실행한다.

1. containerd 다운로드:

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz
   ```

2. 추출 및 설정:

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding ascii

   # Review the configuration. Depending on setup you may want to adjust:
   # - the sandbox_image (Kubernetes pause image)
   # - cni bin_dir and conf_dir locations
   Get-Content config.toml

   # (Optional - but highly recommended) Exclude containerd from Windows Defender Scans
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

3. containerd 시작:

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

## kubelet의 컨테이너 런타임으로 containerd를 사용하도록 구성하기

`/var/lib/kubelet/kubeadm-flags.env` 파일을 열어서 플래그에 containerd 런타임을 추가한다;
`--container-runtime-endpoint=unix:///run/containerd/containerd.sock`.

kubeadm을 사용하는 사용자는 `kubeadm` 도구가 각 호스트에 대한
CRI 소켓을 해당 호스트의 노드 오브젝트에 어노테이션으로 저장한다는 것을 알고 있어야 한다. 이를
변경하려면 `/etc/kubernetes/admin.conf` 파일이 있는 머신에서 다음 명령을 실행하면 된다.

```shell
kubectl edit no <node-name>
```

그러면 노드 오브젝트를 편집할 수 있는 텍스트 편집기가 시작된다.
`KUBE_EDITOR` 환경 변수를 설정하여 텍스트 편집기를 선택할 수 있다.

- `/var/run/dockershim.sock` 에서 `kubeadm.alpha.kubernetes.io/cri-socket` 값을
  원하는 CRI 소켓 경로로 변경한다 (예를 들어 `unix:///run/containerd/containerd.sock`).
   
  새로운 CRI 소켓 경로의 접두사는 `unix://`로 시작하는 것이 가장 이상적이다.

- 텍스트 편집기에서 변경 사항을 저장하면, 노드 오브젝트가 업데이트된다.

## kubelet 재시작하기

```shell
systemctl start kubelet
```

## 노드가 정상(healthy)인지 확인하기

`kubectl get nodes -o wide`를 실행하면 방금 변경한 노드의 런타임으로 containerd가 출력된다.

## 도커 엔진 제거하기

{{% thirdparty-content %}}

마지막으로 모든 작업이 순조롭게 진행되었다면, 도커를 제거한다.

{{< tabs name="tab-remove-docker-engine" >}}
{{% tab name="CentOS" %}}

```shell
sudo yum remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Debian" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Fedora" %}}

```shell
sudo dnf remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Ubuntu" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{< /tabs >}}

앞의 명령은 호스트의 이미지, 컨테이너, 볼륨 그리고 사용자 지정 설정 파일을 제거하지 않는다.
이를 삭제하려면 도커의 지침에 따라 [도커 엔진 제거](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine)를 수행한다.

{{< caution >}}
위 도커 엔진 제거 지침은 containerd를 삭제할 위험이 있다. 명령을 실행할 때 주의하자.
{{< /caution >}}
