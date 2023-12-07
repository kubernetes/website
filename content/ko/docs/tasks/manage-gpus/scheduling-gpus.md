---
# reviewers:
# - vishh
content_type: concept
title: GPU 스케줄링
description: 클러스터의 노드별로 리소스로 사용할 GPU를 구성하고 스케줄링한다.
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.26" >}}

쿠버네티스는 {{< glossary_tooltip text="디바이스 플러그인" term_id="device-plugin" >}}을 사용하여
AMD 및 NVIDIA GPU(그래픽 프로세싱 유닛)를 여러 노드들에 걸쳐 관리하기 위한
**안정적인** 지원을 포함한다.

이 페이지는 사용자가 GPU를 활용할 수 있는 방법과,
몇 가지 제한 사항에 대하여 설명한다.

<!-- body -->

## 디바이스 플러그인 사용하기

쿠버네티스는 디바이스 플러그인을 구현하여 파드가 GPU와 같이 특별한 하드웨어 기능에 접근할 수 있게 한다.

{{% thirdparty-content %}}

관리자는 해당하는 하드웨어 벤더의 GPU 드라이버를 노드에
설치해야 하며, GPU 벤더가 제공하는 디바이스 플러그인을
실행해야 한다. 다음은 몇몇 벤더의 지침에 대한 웹페이지이다.

* [AMD](https://github.com/RadeonOpenCompute/k8s-device-plugin#deployment)
* [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
* [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin#quick-start)

플러그인을 한 번 설치하고 나면, 클러스터는 `amd.com/gpu` 또는 `nvidia.com/gpu`를 스케줄 가능한 리소스로써 노출시킨다.

사용자는 이 GPU들을 `cpu`나 `memory`를 요청하는 방식과 동일하게
GPU 자원을 요청함으로써 컨테이너에서 활용할 수 있다.
그러나 리소스의 요구 사항을 명시하는 방식에
약간의 제약이 있다.

GPU는 `limits` 섹션에서만 명시되는 것을 가정한다. 그 의미는 다음과 같다.
* 쿠버네티스는 limits를 requests의 기본 값으로 사용하게 되므로
  사용자는 GPU `limits` 를 명시할 때 `requests` 명시하지 않아도 된다.
* 사용자는 `limits` 과 `requests` 를 모두 명시할 수 있지만, 두 값은
  동일해야 한다.
* 사용자는 `limits` 명시 없이는 GPU `requests` 를 명시할 수 없다.

다음은 GPU를 요청하는 파드에 대한 예제 매니페스트를 보여준다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-vector-add
spec:
  restartPolicy: OnFailure
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # 1 GPU 요청
```         

## 다른 타입의 GPU들을 포함하는 클러스터

만약 클러스터의 노드들이 서로 다른 타입의 GPU를 가지고 있다면, 사용자는
파드를 적합한 노드에 스케줄 하기 위해서
[노드 레이블과 노드 셀렉터](/ko/docs/tasks/configure-pod-container/assign-pods-nodes/)를 사용할 수 있다.

예를 들면,

```shell
# 노드가 가진 가속기 타입에 따라 레이블을 단다.
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```

`accelerator` 레이블 키를 `accelerator`로 지정한 것은 그저 예시일 뿐이며,
선호하는 다른 레이블 키를 사용할 수 있다.

## 노드 레이블링 자동화 {#node-labeller}

만약 AMD GPU 디바이스를 사용하고 있다면,
[노드 레이블러](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller)를 배치할 수 있다.
노드 레이블러는 GPU 디바이스의 속성에 따라서 노드에 자동으로 레이블을 달아 주는
{{< glossary_tooltip text="컨트롤러" term_id="controller" >}}이다.

현재 이 컨트롤러는 다음의 속성에 대해 레이블을 추가할 수 있다.

* 디바이스 ID (-device-id)
* VRAM 크기 (-vram)
* SIMD 개수 (-simd-count)
* 계산 유닛 개수 (-cu-count)
* 펌웨어 및 기능 버전 (-firmware)
* GPU 계열, 두 개 문자 형태의 축약어 (-family)
  * SI - Southern Islands
  * CI - Sea Islands
  * KV - Kaveri
  * VI - Volcanic Islands
  * CZ - Carrizo
  * AI - Arctic Islands
  * RV - Raven

```shell
kubectl describe node cluster-node-23
```

```
Name:               cluster-node-23
Roles:              <none>
Labels:             beta.amd.com/gpu.cu-count.64=1
                    beta.amd.com/gpu.device-id.6860=1
                    beta.amd.com/gpu.family.AI=1
                    beta.amd.com/gpu.simd-count.256=1
                    beta.amd.com/gpu.vram.16G=1
                    kubernetes.io/arch=amd64
                    kubernetes.io/os=linux
                    kubernetes.io/hostname=cluster-node-23
Annotations:        node.alpha.kubernetes.io/ttl: 0
…
```

노드 레이블러가 사용된 경우, GPU 타입을 파드 스펙에 명시할 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-vector-add
spec:
  restartPolicy: OnFailure
  containers:
    - name: cuda-vector-add
      # https://github.com/kubernetes/kubernetes/blob/v1.7.11/test/images/nvidia-cuda/Dockerfile
      image: "registry.k8s.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        – matchExpressions:
          – key: beta.amd.com/gpu.family.AI # Arctic Islands GPU family
            operator: Exist
```

이것은 사용자가 지정한 GPU 타입을 가진 노드에 파드가 스케줄 되도록
만든다.
