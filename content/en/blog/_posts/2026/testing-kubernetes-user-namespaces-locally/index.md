---
layout: blog
title: Testing Kubernetes User Namespaces Locally and Overcoming Container Runtime & Driver Constraints
draft: true
slug: testing-kubernetes-user-namespaces-locally
author: >
  Chielo
---

Kubernetes User Namespaces reached General Availability in Kubernetes v1.36. The feature provides an additional isolation boundary by mapping the user and group IDs inside a Pod to different IDs on the host. [Kubernetes User Namespaces documentation](https://kubernetes.io/docs/concepts/workloads/pods/user-namespaces/)

In a normal container, a process running as root inside the container is also seen as root from the host's perspective. With User Namespaces enabled, root inside the container can instead be mapped to an unprivileged user on the host.

A Pod can opt into this isolation by setting:

```yaml
hostUsers: false
```

This allows a process to remain UID 0 inside the container while being mapped to a different, unprivileged UID range from the node's perspective.

For developers, however, testing this feature locally can be surprisingly difficult.

A Pod that uses `hostUsers: false` can succeed in one Minikube setup and fail in another. The difference is not necessarily Kubernetes itself. It can come from **how the Kubernetes node is running and what environment the container runtime has available to it**.

The key relationship is:

**Minikube driver → Kubernetes node → container runtime → OCI runtime → Linux kernel**

The Minikube driver determines how the Kubernetes node is provisioned. That, in turn, determines the environment in which the container runtime and OCI runtime operate.

This article examines two Minikube configurations that failed during testing, identifies the layer responsible for each failure, and shows how a VM-backed driver can provide a working environment for testing `hostUsers: false` locally.

## What you need to understand before testing

Before troubleshooting `hostUsers: false`, there are two parts of the local Kubernetes environment to look at:

1. **The Minikube driver:** How the Kubernetes node itself is running.
2. **The container runtime:** The software responsible for creating and running the containers inside that node.


### The Minikube driver determines where the Kubernetes node runs

When you start Minikube, you choose a driver.

For example:

```bash
minikube start --driver=docker
```

With the Docker driver, Minikube creates the Kubernetes node as a **Docker container on your host**.

The Kubernetes node is therefore itself running inside a container.

A simplified view looks like this:

{{< figure src="docker-driver-node.svg" alt="Docker Driver to Kubernetes Node" >}}



This additional container boundary matters because the container runtime inside the Minikube node may need to perform Linux namespace and mount operations when creating a Pod.

A different option is the `kvm2` driver:

```bash
minikube start --driver=kvm2
```

With `kvm2`, Minikube runs the Kubernetes node inside a **virtual machine** rather than a Docker container.

The VM has its own guest operating system and Linux kernel, so the Kubernetes node is no longer itself a container nested inside the host's container environment.

The environment looks more like this:

{{< figure src="kvm2-driver-node.svg" alt="KVM2 Driver to Kubernetes Node" >}}



This difference in the **node boundary** is central to the behavior observed in the tests.

### What are KVM and libvirt?

**KVM (Kernel-based Virtual Machine)** is the Linux virtualization technology that allows a Linux system to run virtual machines using hardware virtualization support.

**libvirt** is a management layer and set of tools used to create and manage virtual machines and their resources.

You do not need to manually manage the virtual machine for this test. Minikube uses these components through the `kvm2` driver to create the Kubernetes node inside a VM.

The important point is that `kvm2` gives the Kubernetes node a VM boundary instead of making the node itself a Docker container.

### The container runtime creates the Pod containers

Inside the Kubernetes node, the `kubelet` needs a container runtime to create and manage Pods.

Kubernetes communicates with the container runtime through the **Container Runtime Interface (CRI)**.

For example, a Minikube node can use containerd:

```bash
minikube start --driver=kvm2 --container-runtime=containerd
```

The relationship looks like this:
{{< figure src="cri-integration-flow.svg" alt="Container Runtime Interface Flow" >}}



The distinction between the layers matters because User Namespaces depend on support from the container runtime and OCI runtime, while those runtimes ultimately depend on the Linux environment in which they operate.

So testing User Namespaces locally is not simply checking whether Kubernetes supports the feature.

You are testing a chain:

**Kubernetes → kubelet → CRI → container runtime → OCI runtime → Linux kernel**

A limitation at any relevant layer can affect whether a Pod using `hostUsers: false` can be created.

## What happens when `hostUsers: false` fails?

During testing, two Docker-driver configurations produced different failures.

The important thing is not memorizing the exact error messages. They are specific to the tested environment.

Instead, the errors help identify **which layer prevents the Pod sandbox from being created**.

### Failure mode 1: Docker driver with Docker runtime

The first configuration was:

```bash
minikube start --driver=docker --container-runtime=docker
```

Here, the Kubernetes node is a Docker container, and Docker is also selected as the container runtime inside that node.

When a Pod uses:

```yaml
hostUsers: false
```

the kubelet asks the container runtime to create the Pod sandbox with User Namespace isolation.

In the tested configuration, sandbox creation failed because the runtime did not support the requested User Namespace configuration.

The observed event was:

```
Warning  FailedCreatePodSandBox  3s (x3 over 29s)  kubelet
Failed to create pod sandbox: can't set `spec.hostUsers: false`, runtime does not support user namespaces
```

**What happened:**

The Pod never reached application-container startup. Sandbox creation failed first.

**Why:**

The selected container runtime rejected the requested User Namespace configuration.

**Responsible layer:**

The container runtime capability exposed to Kubernetes in this configuration.

This does **not** mean that Kubernetes User Namespaces are unsupported. It means this particular runtime configuration could not satisfy the request.

### Failure mode 2: Docker driver with containerd

The next test changed the container runtime:

```bash
minikube start --driver=docker --container-runtime=containerd
```

The Minikube node was still a Docker container, but containerd was now used inside the node.

This time, the request got further. However, sandbox creation eventually failed at the OCI runtime during a mount operation.

The observed error was:

```
Warning  FailedCreatePodSandBox  12s  kubelet
Failed to create pod sandbox: rpc error: code = Unknown desc = failed to start sandbox "...": failed to create containerd task: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting "sysfs" to rootfs at "/sys": mount src=sysfs, dst=/sys, ...: operation not permitted
```

**What happened:**

containerd accepted the request, but the OCI runtime failed while initializing the sandbox.

**Why:**

The OCI runtime was still operating inside the Docker container that hosted the Minikube node. In the tested environment, the nested container setup restricted the mount operation required during sandbox initialization.

**Responsible layer:**

The OCI runtime and the kernel capabilities available through the Docker-backed node environment.

This illustrates why simply changing the container runtime is not always enough.

You changed:

**Docker runtime → containerd**

but you did not change:

**Docker-backed Kubernetes node → VM-backed Kubernetes node**

The runtime was still operating inside a Docker container.

## Comparing the configurations

The configurations tested in this article can be summarized as follows:

| Minikube configuration | Container runtime | Result | Failure or behavior |
| --- | --- | --- | --- |
| `--driver=docker --container-runtime=docker` | Docker | ❌ Failed | Runtime rejected the requested User Namespace configuration |
| `--driver=docker --container-runtime=containerd` | containerd | ❌ Failed in the tested environment | `runc` failed during sandbox initialization with a `sysfs` mount error |
| `--driver=kvm2 --container-runtime=containerd` | containerd | ✅ Worked in the tested environment | Kubernetes node ran inside a VM instead of a Docker container |

The significant change in the working configuration is therefore not simply the choice of container runtime.

It is the **boundary around the Kubernetes node**.

## Running user namespaces with a VM-backed Minikube driver

A VM-backed driver places the Kubernetes node inside a virtual machine rather than inside a container on the host.

For Linux, Minikube provides the `kvm2` driver, which uses KVM and libvirt.

This gives the node its own guest kernel and avoids the additional nesting introduced when the Kubernetes node itself is a Docker container.

### Step 1: Start a VM-backed Minikube cluster

For this test, use the kvm2 driver with containerd. This runs the Minikube node inside a virtual machine instead of a Docker container.

Start Minikube with:

```bash
minikube start --driver=kvm2 --container-runtime=containerd --nodes=2 -p userns-dev
```

### Step 2: Deploy a Pod with user namespaces enabled

Create `userns-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: userns-nginx
  namespace: default
spec:
  hostUsers: false
  containers:
  - name: web
    image: busybox:1.36
    command: ["sleep", "infinity"]
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
```

Apply the manifest:

```bash
kubectl apply -f userns-pod.yaml
```

Wait for the Pod to become `Running`:

```bash
kubectl get pod userns-nginx
```

### Step 3: Verify the user namespace mapping

You can inspect the UID mapping from inside the container:

```bash
kubectl exec userns-nginx -- cat /proc/self/uid_map
```

A mapping will look similar to:

```
0 2144206848      65536
```

The important part is not the exact host UID shown above. The mapping demonstrates that UID 0 inside the container is mapped to a different, unprivileged UID range from the node's perspective.

You can also inspect the process from the Minikube node:

```bash
minikube ssh -p userns-dev --node userns-dev-m02 ps aux | grep sleep
```

Output:

```
1947205632    2128  0.0  0.0   4552  2432 ?        Ss   15:00   0:00 sleep infinity
```

The node's process table confirms that container root (UID 0) is running as unprivileged UID 1947205632 on the VM node, isolated from root privileges.

This provides a second way to verify that the User Namespace mapping is taking effect.

## A common issue: capabilities inside User Namespaces

Getting the User Namespace itself to work does not mean every application will start successfully.

User Namespaces change how user IDs and capabilities are scoped. Some applications perform operations such as changing file ownership or switching user IDs during startup.

Database images are one example where this can matter.

If an application requires capabilities such as `CHOWN`, `SETUID`, `SETGID`, or `FOWNER`, dropping every capability can cause the application to fail even though User Namespaces are working correctly.

For example:

```yaml
securityContext:
  capabilities:
    add:
      - CHOWN
      - SETUID
      - SETGID
      - FOWNER
    drop:
      - ALL
```

The capabilities required depend on the application.

Therefore, an application startup failure should not automatically be interpreted as a User Namespace failure. First establish whether the namespace itself is working, then troubleshoot the application's capability requirements.

## Troubleshooting checklist

When `hostUsers: false` fails in a local Kubernetes environment, work through the layers rather than assuming Kubernetes itself is the problem.

-   Check the Kubernetes version and confirm that User Namespaces are available in the version you are testing.
-   Check the Minikube driver with `minikube profile list` or the configuration used to start the cluster.
-   Determine whether the Kubernetes node is running directly on a VM or inside another container.
-   Check which container runtime the Minikube node is using.
-   Identify the OCI runtime used by that container runtime, such as `runc`.
-   Read the Pod events and identify whether failure occurs at the runtime, OCI runtime, or sandbox initialization stage.
-   Distinguish a runtime capability error from a namespace or mount restriction.
-   If using a container-backed Minikube driver, test whether a VM-backed driver changes the result.
-   Once the Pod starts, inspect `/proc/self/uid_map` to verify the User Namespace mapping.
-   If the namespace works but the application fails, check its required capabilities and startup behavior.

The goal is to identify **which layer cannot provide the capability**, rather than treating every `hostUsers: false` failure as a Kubernetes feature limitation.

## Conclusion

User namespaces can be enabled with `hostUsers: false`, but testing them locally involves more than the Kubernetes API and the container runtime.

The environment in which the Kubernetes node runs also matters.

With a Docker-backed Minikube node, the container runtime is itself nested inside another container environment. That can introduce mount and namespace restrictions that are not present when the node runs inside a VM.

The configurations therefore fail at different points:

- **Docker + Docker runtime:** CRI/runtime capability limitation.
- **Docker + containerd:** Nested runtime followed by an OCI/kernel mount restriction.
- **KVM2 + containerd:** VM-backed Kubernetes node where the user namespace workload can start.

For local testing, a VM-backed driver such as `kvm2` provides a practical environment for validating `hostUsers: false` without the additional container nesting of the Docker driver. Minikube documents both the `kvm2` driver and explicit container-runtime selection.

For additional details on User Namespaces, their requirements, limitations, and the `hostUsers` field, see the [Kubernetes User Namespaces documentation](https://kubernetes.io/docs/concepts/workloads/pods/user-namespaces/) and the [Kubernetes guide for using a User Namespace with a Pod](https://kubernetes.io/docs/tasks/configure-pod-container/user-namespaces/).