---
title: Apply Pod Security Standards at the Namespace Level
content_type: tutorial
weight: 20
---

{{% alert title="Note" %}}
This tutorial applies only for new clusters.
{{% /alert %}}

Pod Security Admission is an admission controller that applies 
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) 
when pods are created.  It is a feature GA'ed in v1.25.
In this tutorial, you will enforce the `baseline` Pod Security Standard,
one namespace at a time.

You can also apply Pod Security Standards to multiple namespaces at once at the cluster
level. For instructions, refer to
[Apply Pod Security Standards at the cluster level](/docs/tutorials/security/cluster-level-pss/).

## {{% heading "prerequisites" %}}

Install the following on your workstation:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

## Create cluster

1. Create a `kind` cluster as follows:

   ```shell
   kind create cluster --name psa-ns-level
   ```

   The output is similar to this:

   ```
   Creating cluster "psa-ns-level" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼 
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

1. Set the kubectl context to the new cluster:

   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```
   The output is similar to this:

   ```
   Kubernetes control plane is running at https://127.0.0.1:50996
   CoreDNS is running at https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    
   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

## Create a namespace

Create a new namespace called `example`:

```shell
kubectl create ns example
```

The output is similar to this:

```
namespace/example created
```

## Enable Pod Security Standards checking for that namespace

1. Enable Pod Security Standards on this namespace using labels supported by
   built-in Pod Security Admission. In this step you will configure a check to
   warn on Pods that don't meet the latest version of the _baseline_ pod
   security standard.

   ```shell
   kubectl label --overwrite ns example \
      pod-security.kubernetes.io/warn=baseline \
      pod-security.kubernetes.io/warn-version=latest
   ```

2. You can configure multiple pod security standard checks on any namespace, using labels.
   The following command will `enforce` the `baseline` Pod Security Standard, but
   `warn` and `audit` for `restricted` Pod Security Standards as per the latest
   version (default value)

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/enforce=baseline \
     pod-security.kubernetes.io/enforce-version=latest \
     pod-security.kubernetes.io/warn=restricted \
     pod-security.kubernetes.io/warn-version=latest \
     pod-security.kubernetes.io/audit=restricted \
     pod-security.kubernetes.io/audit-version=latest
   ```

## Verify the Pod Security Standard enforcement

1. Create a baseline Pod in the `example` namespace:

   ```shell
   kubectl apply -n example -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```
   The Pod does start OK; the output includes a warning. For example:

   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

1. Create a baseline Pod in the `default` namespace:

   ```shell
   kubectl apply -n default -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```
   Output is similar to this:

   ```
   pod/nginx created
   ```

The Pod Security Standards enforcement and warning settings were applied only
to the `example` namespace. You could create the same Pod in the `default`
namespace with no warnings.

## Clean up

Now delete the cluster which you created above by running the following command:

```shell
kind delete cluster --name psa-ns-level
```

## {{% heading "whatsnext" %}}

- Run a
  [shell script](/examples/security/kind-with-namespace-level-baseline-pod-security.sh)
  to perform all the preceding steps all at once.

  1. Create kind cluster
  2. Create new namespace
  3. Apply `baseline` Pod Security Standard in `enforce` mode while applying
     `restricted` Pod Security Standard also in `warn` and `audit` mode.
  4. Create a new pod with the following pod security standards applied

- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
- [Apply Pod Security Standards at the cluster level](/docs/tutorials/security/cluster-level-pss/)
