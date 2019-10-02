---
reviewers:
- nelvadas
title: Limit Ranges
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

By default, containers run with unbounded [compute resources](/docs/user-guide/compute-resources) on a Kubernetes cluster.
With Resource quotas, cluster administrators can restrict the resource consumption and creation on a namespace basis.
Within a namespace, a Pod or Container can consume as much CPU and memory as defined by the namespace's resource quota. There is a concern that one Pod or Container could monopolize all of the resources. Limit Range is a policy to constrain resource  by Pod or Container in a namespace.

{{% /capture %}}


{{% capture body %}}

A limit range, defined by a `LimitRange` object, provides constraints that can:

- Enforce minimum and maximum compute resources usage per Pod or Container in a namespace.
- Enforce minimum and maximum storage request per PersistentVolumeClaim in a namespace.
- Enforce a ratio between request and limit for a resource in a namespace.
- Set default request/limit for compute resources in a namespace and automatically inject them to Containers at runtime.

## Enabling Limit Range 

Limit Range support is enabled by default for many Kubernetes distributions.  It is
enabled when the apiserver `--enable-admission-plugins=` flag has `LimitRanger` admission controller as
one of its arguments.

A limit range is enforced in a particular namespace when there is a
`LimitRange` object in that namespace.

### Overview of Limit Range:

- The administrator creates one `LimitRange` in one namespace.
- Users create resources like Pods, Containers, and PersistentVolumeClaims in the namespace.
- The `LimitRanger` admission controller enforces defaults  limits for all Pods and Container that do not set compute resource requirements and tracks usage to ensure it does not exceed resource minimum , maximum and ratio defined in any  `LimitRange` present in the namespace.
- If creating or updating a resource (Pod, Container, PersistentVolumeClaim) violates a limit range  constraint, the request to the API server will fail with HTTP status code `403 FORBIDDEN` and a message explaining the constraint that would have been violated.
- If limit range is activated in a namespace for compute resources like `cpu` and `memory`, users must specify
  requests or limits for those values; otherwise, the system may reject pod creation. 
-  LimitRange validations occurs only at Pod Admission stage, not on Running pods.


Examples of policies that could be created using limit range are:

- In a 2 node cluster with a capacity of 8 GiB RAM, and 16 cores, constrain Pods in a namespace to request 100m and not exceeds 500m for CPU , request 200Mi and not exceed 600Mi
- Define default CPU limits and request to 150m and Memory default request to 300Mi for containers started with no cpu and memory requests in their spec.

In the case where the total limits of the namespace is less than the sum of the limits of the Pods/Containers,
there may be contention for resources; The Containers or Pods  will not be created.

Neither contention nor changes to limitrange will affect already created resources.

## Limiting Container compute resources 

The following section discusses the creation of a LimitRange acting at Container Level.
A Pod with 04 containers is first created; each container within the Pod has a specific `spec.resource` configuration  
each containerwithin the pod is handled differently by the LimitRanger admission controller.

 Create a namespace `limitrange-demo` using the following kubectl command

```shell
kubectl create namespace limitrange-demo
```

To avoid passing the target limitrange-demo in your kubectl commands, change your context with the following command 

```shell
kubectl config set-context --current --namespace=limitrange-demo
```

Here is the configuration file for a LimitRange object:
{{< codenew file="admin/resource/limit-mem-cpu-container.yaml" >}}

This object defines minimum and maximum Memory/CPU limits,  default cpu/Memory requests  and default limits for CPU/Memory resources to be apply to containers.

Create the `limit-mem-cpu-per-container` LimitRange in the `limitrange-demo` namespace with the following kubectl command.
```shell
kubectl create -f https://k8s.io/examples/admin/resource/limit-mem-cpu-container.yaml -n limitrange-demo
```


```shell
 kubectl describe limitrange/limit-mem-cpu-per-container -n limitrange-demo
 ```


```shell
Type        Resource  Min   Max   Default Request  Default Limit  Max Limit/Request Ratio
----        --------  ---   ---   ---------------  -------------  -----------------------
Container   cpu       100m  800m  110m             700m           -
Container   memory    99Mi  1Gi   111Mi            900Mi          -
```



Here is the configuration file for a Pod with 04 containers to demonstrate LimitRange features :
{{< codenew file="admin/resource/limit-range-pod-1.yaml" >}}

Create the `busybox1` Pod :

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-range-pod-1.yaml -n limitrange-demo
```

### Container spec with  valid CPU/Memory requests and limits
View the the `busybox-cnt01` resource configuration

```shell 
kubectl get  po/busybox1 -n limitrange-demo -o json | jq ".spec.containers[0].resources"
```

```json
{
  "limits": {
    "cpu": "500m",
    "memory": "200Mi"
  },
  "requests": {
    "cpu": "100m",
    "memory": "100Mi"
  }
}
```

- The `busybox-cnt01` Container inside `busybox` Pod defined `requests.cpu=100m` and `requests.memory=100Mi`.
-  `100m <= 500m <= 800m` , The container cpu limit (500m) falls inside the authorized CPU limit range. 
-  `99Mi <= 200Mi <= 1Gi` , The container memory limit (200Mi) falls inside the authorized Memory limit range.
-  No request/limits ratio validation for  CPU/Memory , thus the container is valid and created.


### Container spec with a valid  CPU/Memory requests but no limits

View the  `busybox-cnt02` resource configuration

```shell 
kubectl get  po/busybox1 -n limitrange-demo -o json | jq ".spec.containers[1].resources"
```

```json
{
  "limits": {
    "cpu": "700m",
    "memory": "900Mi"
  },
  "requests": {
    "cpu": "100m",
    "memory": "100Mi"
  }
}
```
-  The `busybox-cnt02` Container inside `busybox1` Pod defined `requests.cpu=100m` and `requests.memory=100Mi` but not limits for cpu and memory.
-  The container do not have a limits section, the default limits defined in the limit-mem-cpu-per-container LimitRange object are injected to this container `limits.cpu=700mi` and `limits.memory=900Mi`.
-  `100m <= 700m <= 800m` , The container cpu limit (700m) falls inside the authorized CPU limit range.  
-  `99Mi <= 900Mi <= 1Gi` , The container memory limit (900Mi) falls inside the authorized Memory limit range.
-  No request/limits ratio  set , thus the container is valid and created.


### Container spec with a valid  CPU/Memory limits but no requests
View the `busybox-cnt03` resource configuration

```shell 
kubectl get  po/busybox1 -n limitrange-demo -o json | jq ".spec.containers[2].resources"
```
```json 
{
  "limits": {
    "cpu": "500m",
    "memory": "200Mi"
  },
  "requests": {
    "cpu": "500m",
    "memory": "200Mi"
  }
}
```

-  The `busybox-cnt03` Container inside `busybox1` Pod defined `limits.cpu=500m` and `limits.memory=200Mi` but no `requests` for cpu and memory.
-  The container do not define a request section, the defaultRequest defined in the limit-mem-cpu-per-container LimitRange is not used to fill its limits section but the limits defined by the container are set as requests `limits.cpu=500m` and `limits.memory=200Mi`.
-  `100m <= 500m <= 800m` , The container cpu limit (500m) falls inside the authorized CPU limit range.  
-  `99Mi <= 200Mi <= 1Gi` , The container memory limit (200Mi) falls inside the authorized Memory limit range. 
-  No request/limits ratio  set , thus the container is valid and created.



### Container spec with no  CPU/Memory requests/limits
View the `busybox-cnt04` resource configuration
```shell 
kubectl get  po/busybox1 -n limitrange-demo -o json | jq ".spec.containers[3].resources"
```
```json 
{
  "limits": {
    "cpu": "700m",
    "memory": "900Mi"
  },
  "requests": {
    "cpu": "110m",
    "memory": "111Mi"
  }
}
```

-  The `busybox-cnt04` Container inside `busybox1` define neither `limits` nor  `requests`.
-  The container do not define a limit section, the default limit defined in the limit-mem-cpu-per-container LimitRange is used to fill its request 
   `limits.cpu=700m and` `limits.memory=900Mi` .
-  The container do not define a request section, the defaultRequest defined in the limit-mem-cpu-per-container LimitRange is used to fill its request section requests.cpu=110m and requests.memory=111Mi
-  `100m <= 700m <= 800m` , The container cpu limit (700m) falls inside the authorized CPU limit range.  
-  `99Mi <= 900Mi <= 1Gi` , The container memory limit (900Mi) falls inside the authorized Memory limitrange .
-  No request/limits ratio  set , thus the container is valid and created.

All containers defined in the `busybox` Pod passed  LimitRange validations, this the Pod is valid and create in the namespace.

## Limiting Pod compute resources 
The following section discusses how to constrain resources at Pod level.

{{< codenew file="admin/resource/limit-mem-cpu-pod.yaml" >}}

Without having to delete `busybox1` Pod, create the `limit-mem-cpu-pod` LimitRange in the `limitrange-demo` namespace 
```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-mem-cpu-pod.yaml -n limitrange-demo
```
The limitrange is created and limits CPU to 2 Core  and Memory to 2Gi per Pod.
```shell 
limitrange/limit-mem-cpu-per-pod created
```
Describe the `limit-mem-cpu-per-pod` limit object using the following kubectl command
```shell
kubectl describe limitrange/limit-mem-cpu-per-pod
```

```shell
Name:       limit-mem-cpu-per-pod
Namespace:  limitrange-demo
Type        Resource  Min  Max  Default Request  Default Limit  Max Limit/Request Ratio
----        --------  ---  ---  ---------------  -------------  -----------------------
Pod         cpu       -    2    -                -              -
Pod         memory    -    2Gi  -                -              -
``` 
Now create the `busybox2` Pod.

{{< codenew file="admin/resource/limit-range-pod-2.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-range-pod-2.yaml -n limitrange-demo
```
The `busybox2`  Pod definition  is identical to `busybox1` but an  error is reported since Pod's resources are now limited
```shell
Error from server (Forbidden): error when creating "limit-range-pod-2.yaml": pods "busybox2" is forbidden: [maximum cpu usage per Pod is 2, but limit is 2400m., maximum memory usage per Pod is 2Gi, but limit is 2306867200.]
```

```shell
kubectl get  po/busybox1  -n limitrange-demo -o json | jq ".spec.containers[].resources.limits.memory" 
"200Mi"
"900Mi"
"200Mi"
"900Mi"
```
`busybox2` Pod will not be admitted on the cluster since the total memory limit of its container is greater than the limit defined in the LimitRange.
`busybox1` will not be evicted since it was created and admitted on the cluster before the LimitRange creation. 


## Limiting Storage resources

You can enforce  minimum and maximum  size  of [storage resources](/docs/concepts/storage/persistent-volumes/) that can be requested by each PersistentVolumeClaim in a namespace using a LimitRange.

{{< codenew file="admin/resource/storagelimits.yaml" >}}

Apply the YAML using `kubectl create`.

```shell
kubectl create -f https://k8s.io/examples/admin/resource/storagelimits.yaml -n limitrange-demo 
```

```shell
limitrange/storagelimits created
```
Describe the created object, 

```shell
kubectl describe limits/storagelimits  
```
the output should look like 

```shell
Name:                  storagelimits
Namespace:             limitrange-demo
Type                   Resource  Min  Max  Default Request  Default Limit  Max Limit/Request Ratio
----                   --------  ---  ---  ---------------  -------------  -----------------------
PersistentVolumeClaim  storage   1Gi  2Gi  -                -              -
```

{{< codenew file="admin/resource/pvc-limit-lower.yaml" >}}

```shell
kubectl create -f https://k8s.io/examples/admin/resource//pvc-limit-lower.yaml -n limitrange-demo
``` 

While creating a PVC with `requests.storage` lower than the Min value in the LimitRange, an Error thrown by the server 

```shell
Error from server (Forbidden): error when creating "pvc-limit-lower.yaml": persistentvolumeclaims "pvc-limit-lower" is forbidden: minimum storage usage per PersistentVolumeClaim is 1Gi, but request is 500Mi.
```

Same behaviour is noted if  the `requests.storage` is greater than the Max value  in the LimitRange 

{{< codenew file="admin/resource/pvc-limit-greater.yaml" >}}

```shell
kubectl create -f https://k8s.io/examples/admin/resource/pvc-limit-greater.yaml -n limitrange-demo
``` 

```shell
Error from server (Forbidden): error when creating "pvc-limit-greater.yaml": persistentvolumeclaims "pvc-limit-greater" is forbidden: maximum storage usage per PersistentVolumeClaim is 2Gi, but request is 5Gi.
```

## Limits/Requests Ratio 

If `LimitRangeItem.maxLimitRequestRatio` if specified in th `LimitRangeSpec`, the named resource must have a request and limit that are both non-zero where limit divided by request is less than or equal to the enumerated value

 the following `LimitRange` enforces memory limit to be at most twice the amount of the memory request for any pod in the namespace.

{{< codenew file="admin/resource/limit-memory-ratio-pod.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-memory-ratio-pod.yaml
```

Describe the <limit-memory-ratio-pod> LimitRange with the following kubectl command:

```shell
$ kubectl describe limitrange/limit-memory-ratio-pod
```

```shell 
Name:       limit-memory-ratio-pod
Namespace:  limitrange-demo
Type        Resource  Min  Max  Default Request  Default Limit  Max Limit/Request Ratio
----        --------  ---  ---  ---------------  -------------  -----------------------
Pod         memory    -    -    -                -              2
```


Let's create a pod with `requests.memory=100Mi` and `limits.memory=300Mi`
{{< codenew file="admin/resource/limit-range-pod-3.yaml" >}}


```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-range-pod-3.yaml
```

The pod creation failed as the ratio here (`3`) is greater than the enforced limit (`2`) in `limit-memory-ratio-pod` LimitRange


```shell
Error from server (Forbidden): error when creating "limit-range-pod-3.yaml": pods "busybox3" is forbidden: memory max limit to request ratio per Pod is 2, but provided ratio is 3.000000.
```


### Clean up 
Delete the `limitrange-demo` namespace to free all resources
```shell
kubectl delete ns limitrange-demo
```


## Examples

- See  [a tutorial on how to limit compute resources per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/) .
- Check [how to limit storage consumption](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- See a [detailed example on quota per namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/).

{{% /capture %}}

{{% capture whatsnext %}}

See [LimitRanger design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) for more information.

{{% /capture %}}
