---
reviewers:
- stclair
title: Restrict a Container's Access to Resources with AppArmor
content_type: tutorial
weight: 30
---

<!-- overview -->

{{< feature-state feature_gate_name="AppArmor" >}}

This page shows you how to load AppArmor profiles on your nodes and enforce
those profiles in Pods. To learn more about how Kubernetes can confine Pods using
AppArmor, see
[Linux kernel security constraints for Pods and containers](/docs/concepts/security/linux-kernel-security-constraints/#apparmor).

## {{% heading "objectives" %}}


* See an example of how to load a profile on a Node
* Learn how to enforce the profile on a Pod
* Learn how to check that the profile is loaded
* See what happens when a profile is violated
* See what happens when a profile cannot be loaded



## {{% heading "prerequisites" %}}


AppArmor is an optional kernel module and Kubernetes feature, so verify it is supported on your
Nodes before proceeding:

1. AppArmor kernel module is enabled -- For the Linux kernel to enforce an AppArmor profile, the
   AppArmor kernel module must be installed and enabled. Several distributions enable the module by
   default, such as Ubuntu and SUSE, and many others provide optional support. To check whether the
   module is enabled, check the `/sys/module/apparmor/parameters/enabled` file:

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   The kubelet verifies that AppArmor is enabled on the host before admitting a pod with AppArmor
   explicitly configured.

1. Container runtime supports AppArmor -- All common Kubernetes-supported container
   runtimes should support AppArmor, including {{< glossary_tooltip term_id="containerd" >}} and
   {{< glossary_tooltip term_id="cri-o" >}}. Please refer to the corresponding runtime
   documentation and verify that the cluster fulfills the requirements to use AppArmor.

1. Profile is loaded -- AppArmor is applied to a Pod by specifying an AppArmor profile that each
   container should be run with. If any of the specified profiles are not loaded in the
   kernel, the kubelet will reject the Pod. You can view which profiles are loaded on a
   node by checking the `/sys/kernel/security/apparmor/profiles` file. For example:

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```
   ```
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   For more details on loading profiles on nodes, see
   [Setting up nodes with profiles](#setting-up-nodes-with-profiles).

<!-- lessoncontent -->

## Securing a Pod

{{< note >}}
Prior to Kubernetes v1.30, AppArmor was specified through annotations. Use the documentation version
selector to view the documentation with this deprecated API.
{{< /note >}}

AppArmor profiles can be specified at the pod level or container level. The container AppArmor
profile takes precedence over the pod profile.

```yaml
securityContext:
  appArmorProfile:
    type: <profile_type>
```

Where `<profile_type>` is one of:

* `RuntimeDefault` to use the runtime's default profile
* `Localhost` to use a profile loaded on the host (see below)
* `Unconfined` to run without AppArmor

See [Specifying AppArmor Confinement](#specifying-apparmor-confinement) for full details on the AppArmor profile API.

To verify that the profile was applied, you can check that the container's root process is
running with the correct profile by examining its proc attr:

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```

The output should look something like this:

```
cri-containerd.apparmor.d (enforce)
```

## Example

*This example assumes you have already set up a cluster with AppArmor support.*

First, load the profile you want to use onto your Nodes. This profile blocks all file write operations:

```
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
```

The profile needs to loaded onto all nodes, since you don't know where the pod will be scheduled.
For this example you can use SSH to install the profiles, but other approaches are
discussed in [Setting up nodes with profiles](#setting-up-nodes-with-profiles).

```shell
# This example assumes that node names match host names, and are reachable via SSH.
NODES=($(kubectl get nodes -o name))

for NODE in ${NODES[*]}; do ssh $NODE 'sudo apparmor_parser -q <<EOF
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
EOF'
done
```

Next, run a simple "Hello AppArmor" Pod with the deny-write profile:

{{% code_sample file="pods/security/hello-apparmor.yaml" %}}

```shell
kubectl create -f hello-apparmor.yaml
```

You can verify that the container is actually running with that profile by checking `/proc/1/attr/current`:

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```

The output should be:
```
k8s-apparmor-example-deny-write (enforce)
```

Finally, you can see what happens if you violate the profile by writing to a file:

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```
```
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

To wrap up, see what happens if you try to specify a profile that hasn't been loaded:

```shell
kubectl create -f /dev/stdin <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor-2
spec:
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-allow-write
  containers:
  - name: hello
    image: busybox:1.28
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
EOF
```
```
pod/hello-apparmor-2 created
```

Although the Pod was created successfully, further examination will show that it is stuck in pending:

```shell
kubectl describe pod hello-apparmor-2
```
```
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/10.128.0.27
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   container.apparmor.security.beta.kubernetes.io/hello=localhost/k8s-apparmor-example-allow-write
Status:        Pending
... 
Events:
  Type     Reason     Age              From               Message
  ----     ------     ----             ----               -------
  Normal   Scheduled  10s              default-scheduler  Successfully assigned default/hello-apparmor to gke-test-default-pool-239f5d02-x1kf
  Normal   Pulled     8s               kubelet            Successfully pulled image "busybox:1.28" in 370.157088ms (370.172701ms including waiting)
  Normal   Pulling    7s (x2 over 9s)  kubelet            Pulling image "busybox:1.28"
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found k8s-apparmor-example-allow-write
  Normal   Pulled     7s               kubelet            Successfully pulled image "busybox:1.28" in 90.980331ms (91.005869ms including waiting)
```

An Event provides the error message with the reason, the specific wording is runtime-dependent:
```
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found 
```

## Administration

### Setting up Nodes with profiles

Kubernetes {{< skew currentVersion >}} does not provide any built-in mechanisms for loading AppArmor profiles onto
Nodes. Profiles can be loaded through custom infrastructure or tools like the
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator).

The scheduler is not aware of which profiles are loaded onto which Node, so the full set of profiles
must be loaded onto every Node.  An alternative approach is to add a Node label for each profile (or
class of profiles) on the Node, and use a
[node selector](/docs/concepts/scheduling-eviction/assign-pod-node/) to ensure the Pod is run on a
Node with the required profile.

## Authoring Profiles

Getting AppArmor profiles specified correctly can be a tricky business. Fortunately there are some
tools to help with that:

* `aa-genprof` and `aa-logprof` generate profile rules by monitoring an application's activity and
  logs, and admitting the actions it takes. Further instructions are provided by the
  [AppArmor documentation](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools).
* [bane](https://github.com/jfrazelle/bane) is an AppArmor profile generator for Docker that uses a
  simplified profile language.

To debug problems with AppArmor, you can check the system logs to see what, specifically, was
denied. AppArmor logs verbose messages to `dmesg`, and errors can usually be found in the system
logs or through `journalctl`. More information is provided in
[AppArmor failures](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures).


## Specifying AppArmor confinement

{{< caution >}}
Prior to Kubernetes v1.30, AppArmor was specified through annotations. Use the documentation version
selector to view the documentation with this deprecated API.
{{< /caution >}}

### AppArmor profile within security context {#appArmorProfile}

You can specify the `appArmorProfile` on either a container's `securityContext` or on a Pod's
`securityContext`. If the profile is set at the pod level, it will be used as the default profile
for all containers in the pod (including init, sidecar, and ephemeral containers). If both a pod & container
AppArmor profile are set, the container's profile will be used.

An AppArmor profile has 2 fields:

`type` _(required)_ - indicates which kind of AppArmor profile will be applied. Valid options are:

`Localhost`
: a profile pre-loaded on the node (specified by `localhostProfile`).

`RuntimeDefault`
: the container runtime's default profile.

`Unconfined`
: no AppArmor enforcement.

`localhostProfile` - The name of a profile loaded on the node that should be used.
The profile must be preconfigured on the node to work.
This option must be provided if and only if the `type` is `Localhost`.


## {{% heading "whatsnext" %}}


Additional resources:

* [Quick guide to the AppArmor profile language](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [AppArmor core policy reference](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
