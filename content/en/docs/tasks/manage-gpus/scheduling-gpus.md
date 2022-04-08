---
revisores:
- vishh
content_type: concepto
título: Programar GPU
descripción: configure y programe las GPU para que las utilicen los nodos de un clúster como recurso.
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.10" >}}

Kubernetes incluye soporte **experimental** para administrar GPU AMD y NVIDIA
(unidades de procesamiento gráfico) a través de varios nodos.

Esta página describe cómo los usuarios pueden consumir GPU en diferentes versiones de Kubernetes
y las limitaciones actuales.




<!-- body -->

## Uso de complementos de dispositivos

Kubernetes implementa {{< glossary_tooltip text="Device Plugins" term_id="device-plugin" >}}
para permitir que los pods accedan a funciones de hardware especializadas, como las GPU.

Como administrador, debe instalar los controladores de GPU desde el correspondiente
proveedor de hardware en los nodos y ejecute el complemento de dispositivo correspondiente desde el
Proveedor de GPU:

* [AMD](#deploying-amd-gpu-device-plugin)
* [NVIDIA](#deploying-nvidia-gpu-device-plugin)

Cuando las condiciones anteriores son verdaderas, Kubernetes expondrá `amd.com/gpu` o
`nvidia.com/gpu` como un recurso programable.

Puede consumir estas GPU de sus contenedores solicitando
`<vendor>.com/gpu` de la misma manera que solicita `cpu` o `memory`.
Sin embargo, existen algunas limitaciones en la forma de especificar los requisitos de recursos
al usar GPU:

- Se supone que las GPU solo se especifican en la sección `límites`, lo que significa:
  * Puede especificar "límites" de GPU sin especificar "solicitudes" porque
    Kubernetes utilizará el límite como el valor de la solicitud de forma predeterminada.
  * Puede especificar GPU tanto en "límites" como en "solicitudes", pero estos dos valores
    debe ser igual.
  * No puede especificar `solicitudes` de GPU sin especificar `límites`.
- Los contenedores (y los pods) no comparten GPU. No hay compromiso excesivo de GPU.
- Cada contenedor puede solicitar una o más GPU. No es posible solicitar un
  fracción de una GPU.


Aquí hay un ejemplo:

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
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1 # requesting 1 GPU
```

### Implementación del complemento de dispositivo AMD GPU

El [official AMD GPU device plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin)
tiene los siguientes requisitos:

- Los nodos de Kubernetes deben estar preinstalados con el controlador AMD GPU Linux.

Para implementar el complemento del dispositivo AMD una vez que su clúster se esté ejecutando y lo anterior
se cumplen los requisitos:
```shell
kubectl create -f https://raw.githubusercontent.com/RadeonOpenCompute/k8s-device-plugin/v1.10/k8s-ds-amdgpu-dp.yaml
```

Puede informar problemas con este complemento de dispositivo de terceros iniciando sesión en
[RadeonOpenCompute/k8s-device-plugin](https://github.com/RadeonOpenCompute/k8s-device-plugin).

### Implementación del complemento de dispositivo NVIDIA GPU

Actualmente hay dos implementaciones de complementos de dispositivos para las GPU de NVIDIA:

#### Complemento oficial de dispositivo NVIDIA GPU

El [official NVIDIA GPU device plugin](https://github.com/NVIDIA/k8s-device-plugin)
tiene los siguientes requisitos:

- Los nodos de Kubernetes deben estar preinstalados con controladores NVIDIA.
- Los nodos de Kubernetes deben estar preinstalados con [nvidia-docker 2.0](https://github.com/NVIDIA/nvidia-docker)
- Kubelet debe usar Docker como tiempo de ejecución de su contenedor
- `nvidia-container-runtime` debe configurarse como el[default runtime](https://github.com/NVIDIA/k8s-device-plugin#preparing-your-gpu-nodes)
  para Docker, en lugar de runc.
- La versión de los controladores NVIDIA debe coincidir con la restricción ~= 384.81

Para implementar el complemento del dispositivo NVIDIA una vez que su clúster se esté ejecutando y lo anterior
se cumplen los requisitos:

```shell
kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/1.0.0-beta4/nvidia-device-plugin.yml
```

Puede informar problemas con este complemento de dispositivo de terceros iniciando sesión en
[NVIDIA/k8s-device-plugin](https://github.com/NVIDIA/k8s-device-plugin).

#### Complemento de dispositivo NVIDIA GPU utilizado por GCE

El [NVIDIA GPU device plugin used by GCE](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
no requiere el uso de nvidia-docker y debería funcionar con cualquier tiempo de ejecución de contenedor
que sea compatible con la interfaz de tiempo de ejecución del contenedor (CRI) de Kubernetes. esta probado
en [Container-Optimized OS](https://cloud.google.com/container-optimized-os/)
y tiene código experimental para Ubuntu desde 1.9 en adelante.

Puede usar los siguientes comandos para instalar los controladores NVIDIA y el complemento del dispositivo:

```shell
# Install NVIDIA drivers on Container-Optimized OS:
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/daemonset.yaml

# Instalar los controladores NVIDIA en Ubuntu (experimental):
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/stable/nvidia-driver-installer/ubuntu/daemonset.yaml

# Instale el complemento del dispositivo:
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.14/cluster/addons/device-plugins/nvidia-gpu/daemonset.yaml
```

Puede informar problemas con el uso o la implementación de este complemento de dispositivo de terceros iniciando sesión en un problema en
[GoogleCloudPlatform/container-engine-accelerators](https://github.com/GoogleCloudPlatform/container-engine-accelerators).

Google publica su propio [instructions](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus) for using NVIDIA GPUs on GKE .

## Clústeres que contienen diferentes tipos de GPU

Si diferentes nodos en su clúster tienen diferentes tipos de GPU, entonces
puede usar [Etiquetas de nodos y selectores de nodos](/docs/tasks/configure-pod-container/assign-pods-nodes/)
para programar los pods en los nodos apropiados.

Por ejemplo:

```shell
# Label your nodes with the accelerator type they have.
kubectl label nodes <node-with-k80> accelerator=nvidia-tesla-k80
kubectl label nodes <node-with-p100> accelerator=nvidia-tesla-p100
```

## Etiquetado automático de nodos {#node-labeller}

Si está utilizando dispositivos AMD GPU, puede implementar
[Node Labeller](https://github.com/RadeonOpenCompute/k8s-device-plugin/tree/master/cmd/k8s-node-labeller).
Node Labeller is a {{< glossary_tooltip text="controller" term_id="controller" >}} that automatically
etiqueta sus nodos con las propiedades del dispositivo GPU.

Por el momento, ese controlador puede agregar etiquetas para:

* ID del dispositivo (-id-dispositivo)
* Tamaño de VRAM (-vram)
* Número de SIMD (-simd-count)
* Número de Unidad de Cómputo (-cu-count)
* Versiones de firmware y funciones (-firmware)
* Familia GPU, en siglas de dos letras (-familia)
  * SI - Islas del Sur
  * CI - Islas del Mar
  * KV-Kaveri
  * VI - Islas Volcánicas
  * CZ - Carrizo
  * AI - Islas Árticas
  * RV - Cuervo

```shell
kubectl describe node cluster-node-23
```

```
    Nombre:               cluster-node-23
    Roles:              <none>
    Etiquetas:             beta.amd.com/gpu.cu-count.64=1
                        beta.amd.com/gpu.device-id.6860=1
                        beta.amd.com/gpu.family.AI=1
                        beta.amd.com/gpu.simd-count.256=1
                        beta.amd.com/gpu.vram.16G=1
                        beta.kubernetes.io/arch=amd64
                        beta.kubernetes.io/os=linux
                        kubernetes.io/hostname=cluster-node-23
    Anotaciones:        kubeadm.alpha.kubernetes.io/cri-socket: /var/run/dockershim.sock
                        node.alpha.kubernetes.io/ttl: 0
    …
```

Con el etiquetador de nodos en uso, puede especificar el tipo de GPU en la especificación del pod:

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
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100 # or nvidia-tesla-k80 etc.
```

Esto garantizará que el pod se programará en un nodo que tenga el tipo de GPU.
usted especificó.

