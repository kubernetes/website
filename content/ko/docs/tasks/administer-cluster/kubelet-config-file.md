---
#reviewers:
# - mtaufen
# - dawnchen
title: 구성 파일을 통해 Kubelet 파라미터 설정하기
content_type: task
---

<!-- overview -->

커맨드 라인 플래그 대신 디스크 상의 구성 파일을 통해
Kubelet의 구성 파라미터 하위 집합을 설정할 수 있다.

구성 파일을 통해 파라미터를 제공하는 것은
노드 배포 및 구성 관리를 간소화하기 때문에 권장되는 접근 방식이다.

<!-- steps -->

## 구성 파일 만들기

파일을 통해 구성할 수 있는
Kubelet 구성의 하위 집합은
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
구조체에 의해 정의된다.

구성 파일은 이 구조체의 파라미터를 반드시 JSON 또는 YAML로 표현한 파일이어야 한다.
Kubelet이 파일에 읽기 권한이 있는지 확인한다.

다음은 이러한 파일에 대한 예시를 보여준다.
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8",
port: 20250,
serializeImagePulls: false,
evictionHard:
    memory.available:  "200Mi"
```

이 예제에서, Kubelet은 192.168.0.8 IP 주소와 20250 포트에서 동작하고, 이미지를 병렬로 가져오고,
사용 가능 메모리가 200Mi 아래로 떨어지면 파드를 축출하도록 구성되어 있다.
플래그에 의해 재정의(overridden)되지 않는한, 다른 모든 Kubelet 구성은 기본 제공 기본값으로 유지된다.
구성 파일과 동일한 값을 대상으로 하는 커맨드 라인 플래그는 해당 값을 재정의 한다.

## 구성 파일을 통해 구성된 Kubelet 프로세스 시작하기

{{< note >}}
kubeadm을 사용하여 클러스터를 초기화하는 경우 `kubeadmin init`으로 클러스터를 생성하는 동안 kubelet-config를 사용해야 한다.
자세한 내용은 [kubeadm을 사용하여 kubelet 구성하기](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)를 참고한다.
{{< /note >}}

Kubelet의 구성 파일 경로로 설정된 `--config` 플래그를 사용하여 Kubelet을 시작하면
Kubelet이 이 파일에서 구성을 불러온다.

구성 파일과 동일한 값을 대상으로 하는 커맨드 라인 플래그는 해당 값을 재정의한다는 점을 유의한다.
이렇게 하면 커맨드 라인 API와의 이전 버전과의 호환성을 보장할 수 있다.

Kubelet 구성 파일의 상대 파일 경로는
Kubelet 구성 파일의 위치를 기준으로 확인되는 반면, 커맨드 라인 플래그의 상대 경로는
Kubelet의 현재 작업 디렉터리를 기준으로 확인된다는 점에 유의한다.

일부 기본값은 커맨드 라인 플래그와 Kubelet 구성 파일 간에 다르다는 점에 유의한다.
`--config`가 제공되고 명령줄을 통해 값을 지정하지 않은 경우,
`KubeletConfiguration` 버전의 기본값이 적용된다.
위 예제의 버전은 `kubelet.config.k8s.io/v1beta1`이다.

<!-- discussion -->

## {{% heading "whatsnext" %}}

- Kubelet 구성에 대한 자세한 내용은
  [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
  를 참고한다.
