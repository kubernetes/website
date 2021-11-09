---
title: Applying Pod Security Standards at Namespace level
content_type: tutorial
weight: 10
---

{{% alert title="Note" %}}
This tutorial applies only for new clusters. 
{{% /alert %}}

Pod Security admission (PSA) is enabled by default in v1.23 and later, as it [graduated
to beta](/blog/2021/12/15/pod-security-admission-beta/). Pod Security Admission
is an admission controller that applies Pod Security Standards when pods are
created. In this tutorial, we will enforce `baseline` Pod Security Standard, 
one namespace at a time.

# Pre-requisites

Install the following on your workstation:

- [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

# Create cluster

1. Create a `KinD` cluster as follows:

    ```shell
    kind create cluster --name psa-ns-level --image kindest/node:latest
    ```
    The output is similar to this:
    ```
    Creating cluster "psa-ns-level" ...
     ✓ Ensuring node image (kindest/node:latest) 🖼 
     ✓ Preparing nodes 📦  
     ✓ Writing configuration 📜 
     ✓ Starting control-plane 🕹️ 
     ✓ Installing CNI 🔌 
     ✓ Installing StorageClass 💾 
    Set kubectl context to "kind-psa-ns-level"
    You can now use your cluster with:
    
    kubectl cluster-info --context kind-psa-ns-level
    
    Not sure what to do next? 😅  Check out https://kind.sigs.k8s.io/docs/user/quick-start/
    ```

2. Set the kubectl context to the new cluster
    ```shell
    kubectl cluster-info --context kind-psa-ns-level
    ```
    The output is similar to this:
    ```
    Kubernetes control plane is running at https://127.0.0.1:50996
    CoreDNS is running at https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    
    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

# Create Namespace

Create a new namespace `example` for this tutorial:

```shell
kubectl create ns example
```
The output is similar to this:
```
namespace/example created
```

# Applying one Pod Security Standard

Enable Pod Security Standards on this namespace using labels supported by
built-in Pod Security Admission. In this step we will warn on baseline pod
security standard as per the latest version (default value)

```shell
kubectl label --overwrite ns example \
  pod-security.kubernetes.io/warn=baseline \
  pod-security.kubernetes.io/warn-version=latest
```

# Applying multiple Pod Security Standards

Multiple pod security standards can be enabled on any namespace, using labels.
Following command will `enforce` the `baseline` Pod Security Standard, but
`warn` and `audit` for `restricted` Pod Security Standards as per the latest
version (default value)

```
kubectl label --overwrite ns example \
  pod-security.kubernetes.io/enforce=baseline \
  pod-security.kubernetes.io/enforce-version=latest \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/warn-version=latest \
  pod-security.kubernetes.io/audit=restricted \
  pod-security.kubernetes.io/audit-version=latest
```

# Create Pod

1. Create a minimal pod in `example` namespace:

    ```shell
    cat <<EOF > /tmp/pss/nginx-pod.yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: nginx
    spec:
      containers:
        - image: nginx
          name: nginx
          ports:
            - containerPort: 80
    EOF
    ```
2. Apply the pod spec to the cluster in `example` namespace:
    ```shell
    kubectl apply -n example -f /tmp/pss/nginx-pod.yaml
    ```
    The output is similar to this:
    ```
    Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
    pod/nginx created
    ```
   
3. Apply the pod spec to the cluster in `default` namespace:
    ```shell
     kubectl apply -n default -f /tmp/pss/nginx-pod.yaml
    ```
    Output is similar to this:
    ```
    pod/nginx created
    ```

As you can see the Pod Security Standards were applied only to `example` 
namespace. For `default` namespace, pod was created without any warnings. 
To apply pod security standards to multiple namespaces at once at cluster 
level, please 
[follow this tutorial](/docs/tutorials/security/cluster-level-pss).

# Clean up

Run `kind delete cluster -name psa-ns-level` to delete the cluster created.

## {{% heading "whatsnext" %}}

- Run a
[gist](https://gist.github.com/PushkarJ/c694bac35c2d100f906861667474afb5)
to perform all the preceding steps all at once.
   1. Create KinD cluster
   2. Create new namespace
   3. Apply `baseline` Pod Security Standard in `enforce` mode while applying
      `restricted` Pod Security Standard also in `warn` and `audit` mode.
   4. Create a new pod with the following pod security standards applied
- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
- [Applying Pod Security Standards at the cluster level](/docs/tutorials/security/cluster-level-pss/)