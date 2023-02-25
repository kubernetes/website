---
content_type: concept
title: GPUのスケジューリング
description: クラスター内のノードのリソースとしてGPUを設定してスケジューリングします
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.10" >}}

Kubernetesには、複数ノードに搭載されたAMDおよびNVIDIAのGPU(graphical processing unit)を管理するための**実験的な**サポートが含まれています。

このページでは、異なるバージョンのKubernetesを横断してGPUを使用する方法と、現時点での制限について説明します。

<!-- body -->

## デバイスプラグインを使用する

Kubernetesでは、GPUなどの特別なハードウェアの機能にPodがアクセスできるようにするために、{{< glossary_tooltip text="デバイスプラグイン" term_id="device-plugin" >}}が実装されています。

管理者として、ノード上に対応するハードウェアベンダーのGPUドライバーをインストールして、以下のような対応するGPUベンダーのデバイスプラグインを実行する必要があります。

* [AMD](#deploying-amd-gpu-device-plugin)
* [NVIDIA](#deploying-nvidia-gpu-device-plugin)

上記の条件を満たしていれば、Kubernetesは`amd.com/gpu`または`nvidia.com/gpu`をスケジュール可能なリソースとして公開します。

これらのGPUをコンテナから使用するには、`cpu`や`memory`をリクエストするのと同じように`<vendor>.com/gpu`というリソースをリクエストするだけです。ただし、GPUを使用するときにはリソースのリクエストの指定方法にいくつか制限があります。

- GPUは`limits`セクションでのみ指定されることが想定されている。この制限は、次のことを意味します。
  * Kubernetesはデフォルトでlimitの値をrequestの値として使用するため、GPUの`requests`を省略して`limits`を指定できる。
  * GPUを`limits`と`requests`の両方で指定できるが、これら2つの値は等しくなければならない。
  * GPUの`limits`を省略して`requests`だけを指定することはできない。
- コンテナ(およびPod)はGPUを共有しない。GPUのオーバーコミットは起こらない。
- 各コンテナは1つ以上のGPUをリクエストできる。1つのGPUの一部だけをリクエストすることはできない。

以下に例を示します。

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
          nvidia.com/gpu: 1 # 1 GPUをリクエストしています
```

### AMDのGPUデバイスプラグインをデプロイする {#deploying-amd-gpu-device-plugin}

[AMD公式のGPUデバイスプラグイン](https://github.com/RadeonOpenCompute/k8s-device-plugin)には以下の要件があります。

- Kubernetesのノードに、AMDのGPUのLinuxドライバーがあらかじめインストール済みでなければならない。

クラスターが起動して上記の要件が満たされれば、以下のコマンドを実行することでAMDのデバイスプラグインをデプロイできます。

```shell
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/v1.10/k8s-ds-amdgpu-dp.yaml
```

このサードパーティーのデバイスプラグインに関する問題は、[RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)で報告できます。

### NVIDIAのGPUデバイスプラグインをデプロイする {#deploying-nvidia-gpu-device-plugin}

現在、NVIDIAのGPU向けのデバイスプラグインの実装は2種類あります。

#### NVIDIA公式のGPUデバイスプラグイン

[NVIDIA公式のGPUデバイスプラグイン](https://github.com/NVIDIA/k8s-device-plugin)には以下の要件があります。

- Kubernetesのノードに、NVIDIAのドライバーがあらかじめインストール済みでなければならない。
- Kubernetesのノードに、[nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)があらかじめインストール済みでなければならない。
- KubeletはコンテナランタイムにDockerを使用しなければならない。
- runcの代わりにDockerの[デフォルトランタイム](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)として、`nvidia-container-runtime`を設定しなければならない。
- NVIDIAのドライバーのバージョンが次の条件を満たさなければならない ~= 384.81。

クラスターが起動して上記の要件が満たされれば、以下のコマンドを実行することでNVIDIAのデバイスプラグインがデプロイできます。

```shell
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/1.0.0-beta4/nvidia-device-plugin.yml
```

このサードパーティーのデバイスプラグインに関する問題は、[NVIDIA/k8s-device-plugin](https://github.com/NVIDIA/k8s-device-plugin)で報告できます。

#### GCEで使用されるNVIDIAのGPUデバイスプラグイン

[GCEで使用されるNVIDIAのGPUデバイスプラグイン](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)は、nvidia-dockerを必要としないため、KubernetesのContainer Runtime Interface(CRI)と互換性のある任意のコンテナランタイムで動作するはずです。このデバイスプラグインは[Container-Optimized OS](https://cloud.google.com/container-optimized-os/)でテストされていて、1.9以降ではUbuntu向けの実験的なコードも含まれています。

以下のコマンドを実行すると、NVIDIAのドライバーとデバイスプラグインをインストールできます。

```shell
# NVIDIAドライバーをContainer-Optimized OSにインストールする
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/daemonset.yaml

# NVIDIAドライバーをUbuntuにインストールする(実験的)
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/nvidia-driver-installer/ubuntu/daemonset.yaml

# デバイスプラグインをインストールする
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.14/cluster/addons/device-plugins/nvidia-gpu/daemonset.yaml
```

このサードパーティーのデバイスプラグインの使用やデプロイに関する問題は、[GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators)で報告できます。

Googleは、GKE上でNVIDIAのGPUを使用するための[手順](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus)も公開しています。

## 異なる種類のGPUを搭載するクラスター

クラスター上の別のノードに異なる種類のGPUが搭載されている場合、[NodeラベルとNodeセレクター](/ja/docs/tasks/configure-pod-container/assign-pods-nodes/)を使用することで、Podを適切なノードにスケジューリングできます。

以下に例を示します。

```shell
# アクセラレーターを搭載したノードにラベルを付けます。
kubectl label nodes <node-with-k80> accelerator=nvidia-tesla-k80
kubectl label nodes <node-with-p100> accelerator=nvidia-tesla-p100
```

## 自動的なNodeラベルの付加 {#node-labeller}

AMDのGPUデバイスを使用している場合、[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller)をデプロイできます。Node Labellerは{{< glossary_tooltip text="コントローラー" term_id="controller" >}}の1種で、GPUデバイスのプロパティを持つノードに自動的にラベルを付けてくれます。

現在は、このコントローラーは以下のプロパティに基づいてラベルを追加できます。

* デバイスID(-device-id)
* VRAMのサイズ(-vram)
* SIMDの数(-simd-count)
* Compute Unitの数(-cu-count)
* ファームウェアとフィーチャーのバージョン(-firmware)
* 2文字の頭字語で表されたGPUファミリー(-family)
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
                        beta.kubernetes.io/arch=amd64
                        beta.kubernetes.io/os=linux
                        kubernetes.io/hostname=cluster-node-23
    Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: /var/run/dockershim.sock
                        node.alpha.kubernetes.io/ttl: 0
    …
```

Node Labellerを使用すると、GPUの種類をPodのspec内で指定できます。

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
  nodeSelector:
    accelerator: nvidia-tesla-p100 # または nvidia-tesla-k80 など
```

これにより、指定した種類のGPUを搭載したノードにPodがスケジューリングされることを保証できます。
