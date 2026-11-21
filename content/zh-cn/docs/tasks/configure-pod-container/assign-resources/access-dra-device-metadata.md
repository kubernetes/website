---
title: 访问 DRA 设备元数据
content_type: task
min-kubernetes-server-version: v1.37
weight: 30
---
<!--
title: Access DRA Device Metadata
content_type: task
min-kubernetes-server-version: v1.37
weight: 30
-->

{{< feature-state state="alpha" for_k8s_version="v1.37" >}}

<!-- overview -->

<!--
This page shows you how to access
[device metadata](/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#device-metadata)
from containers that use _dynamic resource allocation (DRA)_. Device metadata
lets workloads discover information about allocated devices such as device
attributes or network interface details by reading JSON files at
well-known paths inside the container.

Before reading this page, familiarize yourself with
[Dynamic Resource Allocation (DRA)](/docs/concepts/resource-management/dynamic-resource-allocation/)
and how to
[allocate devices to workloads](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).
-->
本页面展示如何从使用动态资源分配（DRA）的容器中访问
[设备元数据](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#device-metadata)。
设备元数据让工作负载能够发现有关已分配设备的信息（如设备属性或网络接口详细信息），
具体方式是在容器内的已知路径读取 JSON 文件。

在阅读本页面之前，你应该熟悉
[动态资源分配（DRA）](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/)
以及如何[为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)。

<!-- body -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Ensure that your cluster admin has set up DRA, attached devices, and installed
  drivers. For more information, see
  [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).
* Ensure that the DRA driver deployed in your cluster supports device metadata.
  Driver authors who use the
  [DRA kubelet plugin](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
  enable support with
  [`EnableDeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#EnableDeviceMetadata)
  and must include `metadata.resource.k8s.io/v1beta1` in the selected versions.
  A driver can also emit `v1alpha1` for compatibility with older consumers.
-->
* 确保集群管理员已安装配置了 DRA、挂接了设备并安装了驱动程序。
  更多信息请参阅[在集群中设置 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)。
* 确保集群中部署的 DRA 驱动程序支持设备元数据。
  使用 [DRA kubelet 插件](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)的驱动开发者，
  可通过 [`EnableDeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#EnableDeviceMetadata)
  启用该支持，并且必须在所选版本中包含 `metadata.resource.k8s.io/v1beta1`。
  驱动还可以发出 `v1alpha1` 以兼容旧版使用方。

<!--
## Access device metadata with a ResourceClaim {#access-metadata-resourceclaim}
-->
## 通过 ResourceClaim 访问设备元数据    {#access-metadata-resourceclaim}

<!--
When you use a directly referenced ResourceClaim to allocate devices, the
device metadata files appear inside the container at:
-->
当你使用直接引用的 ResourceClaim 来分配设备时，
设备元数据文件会出现在容器内的以下路径：

```
/var/run/kubernetes.io/dra-device-attributes/resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json
```

<!--
1. Review the following example manifest:

   {{% code_sample file="dra/dra-device-metadata-pod.yaml" %}}

   This manifest creates a ResourceClaim named `gpu-claim` that requests a
   device from the `gpu.example.com` DeviceClass, and a Pod that reads the
   device metadata.
-->
1. 查看以下示例清单：

   {{% code_sample file="dra/dra-device-metadata-pod.yaml" %}}

   此清单创建一个名为 `gpu-claim` 的 ResourceClaim，
   请求从 `gpu.example.com` DeviceClass 获取设备，以及一个读取设备元数据的 Pod。

<!--
1. Create the ResourceClaim and Pod:
-->
2. 创建 ResourceClaim 和 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-device-metadata-pod.yaml
   ```

<!--
1. After the Pod is running, view the container logs to see the metadata:
-->
3. Pod 运行后，查看容器日志以查看元数据：

   ```shell
   kubectl logs gpu-metadata-reader
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```
   === DRA device metadata ===
   /var/run/kubernetes.io/dra-device-attributes/resourceclaims/gpu-claim/gpu/gpu.example.com-metadata.json
   {
     "kind": "DeviceMetadata",
     "apiVersion": "metadata.resource.k8s.io/v1beta1",
     ...
   }
   ```

<!--
1. To inspect the full metadata file, exec into the container:
-->
4. 要检查完整的元数据文件，请在容器中执行命令：

   ```shell
   kubectl exec gpu-metadata-reader -- \
     cat /var/run/kubernetes.io/dra-device-attributes/resourceclaims/gpu-claim/gpu/gpu.example.com-metadata.json
   ```

   <!--
   A metadata file is a JSON stream. It contains one object for each API
   version selected by the driver, in the order configured by the driver.
   Drivers should put the newest version first. The objects contain equivalent
   device metadata, so the command might print more than one JSON object.
   -->
   元数据文件是一个 JSON 流。它包含驱动所选择的每个 API 版本对应的一个对象，
   顺序与驱动配置的顺序一致。驱动应将最新版本放在最前面。
   这些对象包含等价的设备元数据，因此该命令可能输出多个 JSON 对象。

   <!--
   The output contains device attributes such as the model, driver version,
   and device UUID. Device capacities are not part of the metadata schema. See
   [metadata schema](/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#device-metadata-schema)
   -->
   输出包含设备属性，例如型号、驱动版本和设备 UUID。
   设备容量不属于元数据模式的一部分。
   参见[元数据模式](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#device-metadata-schema)。

<!--
## Access device metadata with a ResourceClaimTemplate {#access-metadata-template}
-->
## 通过 ResourceClaimTemplate 访问设备元数据    {#access-metadata-template}

<!--
When you use a ResourceClaimTemplate, Kubernetes generates a ResourceClaim for
each Pod. Because the generated claim name is not predictable, the metadata
files appear at a path that uses the Pod's claim reference name instead:
-->
当你使用 ResourceClaimTemplate 时，Kubernetes 会为每个 Pod 生成一个 ResourceClaim。
由于生成的 claim 名称不可预测，元数据文件出现在使用 Pod 的 claim 引用名称的路径中：

```
/var/run/kubernetes.io/dra-device-attributes/resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json
```

<!--
The `<podClaimName>` corresponds to the `name` field in the Pod's
`spec.resourceClaims[]` entry. The JSON metadata also includes a
`podClaimName` field that records this mapping.
-->
`<podClaimName>` 对应 Pod 的 `spec.resourceClaims[]` 条目中的 `name` 字段。
JSON 元数据还包括一个 `podClaimName` 字段，用于记录此映射。

<!--
1. Review the following example manifest:

   {{% code_sample file="dra/dra-device-metadata-template-pod.yaml" %}}

   This manifest creates a ResourceClaimTemplate and a Pod. Each Pod gets its
   own generated ResourceClaim. The metadata path uses the Pod's claim
   reference name `my-gpu`.
-->
1. 查看以下示例清单：

   {{% code_sample file="dra/dra-device-metadata-template-pod.yaml" %}}

   此清单创建一个 ResourceClaimTemplate 和一个 Pod。
   每个 Pod 获得自己生成的 ResourceClaim。元数据路径使用 Pod 的 claim 引用名称 `my-gpu`。

<!--
1. Create the ResourceClaimTemplate and Pod:
-->
1. 创建 ResourceClaimTemplate 和 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-device-metadata-template-pod.yaml
   ```

<!--
1. After the Pod is running, view the metadata:
-->
1. Pod 运行后，查看元数据：

   ```shell
   kubectl exec gpu-metadata-template-reader -- \
     cat /var/run/kubernetes.io/dra-device-attributes/resourceclaimtemplates/my-gpu/gpu/gpu.example.com-metadata.json
   ```

<!--
## Read metadata in your application {#read-metadata-application}
-->
## 在应用程序中读取元数据    {#read-metadata-application}

<!--
### Go applications
-->
### Go 应用程序

<!--
The
[`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/evicemetadata)
package provides ready-made functions for reading metadata files. These
functions handle version negotiation automatically, decoding the metadata
stream and converting it to internal types so your code works across schema
versions without manual version checks. They skip objects with unknown API
versions and return the first compatible object.
-->
[`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/evicemetadata)
包提供了用于读取元数据文件的现成函数。这些函数会自动完成版本协商，
对元数据流进行解码并转换为内部类型，因此你的代码无需手动检查版本，
即可在不同模式版本之间正常工作。它们会跳过 API 版本未知的对象，并返回第一个兼容的对象。

<!--
For a directly referenced ResourceClaim:
-->
对于直接引用的 ResourceClaim：

```go
import "k8s.io/dynamic-resource-allocation/devicemetadata"

dm, err := devicemetadata.ReadResourceClaimMetadata("gpu-claim", "gpu")
```

<!--
For a template-generated claim (using the Pod's claim reference name):
-->
对于模板生成的 claim（使用 Pod 的 claim 引用名称）：

```go
dm, err := devicemetadata.ReadResourceClaimTemplateMetadata("my-gpu", "gpu")
```

<!--
If you know the specific driver name, you can read a single driver's metadata
file:
-->
如果你知道特定的驱动程序名称，可以读取单个驱动程序的元数据文件：

```go
dm, err := devicemetadata.ReadResourceClaimMetadataWithDriverName("gpu.example.com", "gpu-claim", "gpu")
```

<!--
The functions that read all drivers return a `*metadata.DeviceMetadata` with
merged requests and per-device attributes. The functions that accept a driver
name return the complete metadata object from that driver's file.

The read helper functions decode metadata without validating it. To opt in to
validation, open the file and use
[`DecodeMetadataFromStream`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#DecodeMetadataFromStream):
-->
读取所有驱动信息的函数返回一个 `*metadata.DeviceMetadata`，
其中合并了请求与各设备的属性。接受驱动名称的函数则返回该驱动文件中的完整元数据对象。

这些读取辅助函数只解码元数据，不做校验。如需启用校验，请打开文件并使用
[`DecodeMetadataFromStream`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#DecodeMetadataFromStream)：

```go
import (
       "encoding/json"
       "os"

       "k8s.io/dynamic-resource-allocation/api/metadata"
       "k8s.io/dynamic-resource-allocation/devicemetadata"
)

func readMetadata(path string) (*metadata.DeviceMetadata, error) {
       file, err := os.Open(path)
       if err != nil {
               return nil, err
       }
       defer file.Close()

       var deviceMetadata metadata.DeviceMetadata
       var validationErr error
       err = devicemetadata.DecodeMetadataFromStream(
               json.NewDecoder(file),
               &deviceMetadata,
               devicemetadata.DecodeMetadataWithValidationResult(&validationErr),
       )
       if err != nil {
               return nil, err
       }
       if validationErr != nil {
               return nil, validationErr
       }
       return &deviceMetadata, nil
}
```

<!--
Decoding and validation have separate results. A validation error does not
prevent the decoder from populating `deviceMetadata`. Validation is useful when
metadata comes from a custom driver because the DRA kubelet plugin does not
validate objects before writing them.
  
Applications in other languages can decode the JSON stream one object at a
time, inspect each `apiVersion`, skip unknown versions, and use the first
version that they support.
-->
解码与校验的结果相互独立。校验错误不会阻止解码器填充 `deviceMetadata`。
当元数据来自自定义驱动时，校验非常有用，因为 DRA kubelet 插件在写出对象之前不会对其进行校验。

使用其他语言编写的应用可以逐个解码 JSON 流中的对象，检查每个
`apiVersion`，跳过未知版本，并使用其支持的第一个版本。

<!--
## Clean up {#clean-up}
-->
## 清理    {#clean-up}

<!--
Delete the resources that you created:
-->
删除你创建的资源：

```shell
kubectl delete -f https://k8s.io/examples/dra/dra-device-metadata-pod.yaml
kubectl delete -f https://k8s.io/examples/dra/dra-device-metadata-template-pod.yaml
```

## {{% heading "whatsnext" %}}

<!--
* [Learn more about DRA device metadata](/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#device-metadata)
* [Allocate devices to workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
* For more information on the design, see
  [KEP-5304](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/5304-dra-attributes-downward-api).
-->
* [进一步了解 DRA 设备元数据](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/#device-metadata)
* [使用 DRA 为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
* 有关设计的更多信息，请参阅
  [KEP-5304](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/5304-dra-attributes-downward-api)。
