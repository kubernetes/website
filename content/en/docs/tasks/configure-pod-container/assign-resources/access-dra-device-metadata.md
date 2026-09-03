---
title: Access DRA Device Metadata
content_type: task
min-kubernetes-server-version: v1.37
weight: 30
---

{{< feature-state state="beta" for_k8s_version="v1.37" >}}

<!-- overview -->

This page shows you how to access
[device metadata](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#device-metadata)
from containers that use _dynamic resource allocation (DRA)_. Device metadata
lets workloads discover information about allocated devices such as device
attributes or network interface details by reading JSON files at
well-known paths inside the container.

Before reading this page, familiarize yourself with
[Dynamic Resource Allocation (DRA)](/docs/concepts/resource-management/dynamic-resource-allocation/)
and how to
[allocate devices to workloads](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).

<!-- body -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

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

## Access device metadata with a ResourceClaim {#access-metadata-resourceclaim}

When you use a directly referenced ResourceClaim to allocate devices, the
device metadata files appear inside the container at:

```
/var/run/kubernetes.io/dra-device-attributes/resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json
```

1. Review the following example manifest:

   {{% code_sample file="dra/dra-device-metadata-pod.yaml" %}}

   This manifest creates a ResourceClaim named `gpu-claim` that requests a
   device from the `gpu.example.com` DeviceClass, and a Pod that reads the
   device metadata.

1. Create the ResourceClaim and Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-device-metadata-pod.yaml
   ```

1. After the Pod is running, view the container logs to see the metadata:

   ```shell
   kubectl logs gpu-metadata-reader
   ```

   The output is similar to:

   ```
   === DRA device metadata ===
   /var/run/kubernetes.io/dra-device-attributes/resourceclaims/gpu-claim/gpu/gpu.example.com-metadata.json
   {
     "kind": "DeviceMetadata",
     "apiVersion": "metadata.resource.k8s.io/v1beta1",
     ...
   }
   ```

1. To inspect the full metadata file, exec into the container:

   ```shell
   kubectl exec gpu-metadata-reader -- \
     cat /var/run/kubernetes.io/dra-device-attributes/resourceclaims/gpu-claim/gpu/gpu.example.com-metadata.json
   ```

   A metadata file is a JSON stream. It contains one object for each API
   version selected by the driver, in the order configured by the driver.
   Drivers should put the newest version first. The objects contain equivalent
   device metadata, so the command might print more than one JSON object.

   The output contains device attributes such as the model, driver version,
   and device UUID. Device capacities are not part of the metadata schema. See
   [metadata schema](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#device-metadata-schema)
   for details on the JSON structure.

## Access device metadata with a ResourceClaimTemplate {#access-metadata-template}

When you use a ResourceClaimTemplate, Kubernetes generates a ResourceClaim for
each Pod. Because the generated claim name is not predictable, the metadata
files appear at a path that uses the Pod's claim reference name instead:

```
/var/run/kubernetes.io/dra-device-attributes/resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json
```

The `<podClaimName>` corresponds to the `name` field in the Pod's
`spec.resourceClaims[]` entry. The JSON metadata also includes a
`podClaimName` field that records this mapping.

1. Review the following example manifest:

   {{% code_sample file="dra/dra-device-metadata-template-pod.yaml" %}}

   This manifest creates a ResourceClaimTemplate and a Pod. Each Pod gets its
   own generated ResourceClaim. The metadata path uses the Pod's claim
   reference name `my-gpu`.

1. Create the ResourceClaimTemplate and Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-device-metadata-template-pod.yaml
   ```

1. After the Pod is running, view the metadata:

   ```shell
   kubectl exec gpu-metadata-template-reader -- \
     cat /var/run/kubernetes.io/dra-device-attributes/resourceclaimtemplates/my-gpu/gpu/gpu.example.com-metadata.json
   ```

## Read metadata in your application {#read-metadata-application}

### Go applications

The
[`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata)
package provides ready-made functions for reading metadata files. These
functions handle version negotiation automatically, decoding the metadata
stream and converting it to internal types so your code works across schema
versions without manual version checks. They skip objects with unknown API
versions and return the first compatible object.

For a directly referenced ResourceClaim:

```go
import "k8s.io/dynamic-resource-allocation/devicemetadata"

dm, err := devicemetadata.ReadResourceClaimMetadata("gpu-claim", "gpu")
```

For a template-generated claim (using the Pod's claim reference name):

```go
dm, err := devicemetadata.ReadResourceClaimTemplateMetadata("my-gpu", "gpu")
```

If you know the specific driver name, you can read a single driver's metadata
file:

```go
dm, err := devicemetadata.ReadResourceClaimMetadataWithDriverName("gpu.example.com", "gpu-claim", "gpu")
```

The functions that read all drivers return a `*metadata.DeviceMetadata` with
merged requests and per-device attributes. The functions that accept a driver
name return the complete metadata object from that driver's file.

The read helper functions decode metadata without validating it. To opt in to
validation, open the file and use
[`DecodeMetadataFromStream`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#DecodeMetadataFromStream):

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

Decoding and validation have separate results. A validation error does not
prevent the decoder from populating `deviceMetadata`. Validation is useful when
metadata comes from a custom driver because the DRA kubelet plugin does not
validate objects before writing them.

Applications in other languages can decode the JSON stream one object at a
time, inspect each `apiVersion`, skip unknown versions, and use the first
version that they support.

## Clean up {#clean-up}

Delete the resources that you created:

```shell
kubectl delete -f https://k8s.io/examples/dra/dra-device-metadata-pod.yaml
kubectl delete -f https://k8s.io/examples/dra/dra-device-metadata-template-pod.yaml
```

## {{% heading "whatsnext" %}}

* [Learn more about DRA device metadata](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#device-metadata)
* [Allocate devices to workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
* For more information on the design, see
  [KEP-5304](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/5304-dra-attributes-downward-api).
