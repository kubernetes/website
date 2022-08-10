---
reviewers:
- stclair
title: Restrict a Container's Access to Resources with AppArmor
content_type: tutorial
weight: 10
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}


AppArmor is a Linux kernel security module that supplements the standard Linux user and group based
permissions to confine programs to a limited set of resources. AppArmor can be configured for any
application to reduce its potential attack surface and provide greater in-depth defense. It is
configured through profiles tuned to allow the access needed by a specific program or container,
such as Linux capabilities, network access, file permissions, etc. Each profile can be run in either
*enforcing* mode, which blocks access to disallowed resources, or *complain* mode, which only reports
violations.

AppArmor can help you to run a more secure deployment by restricting what containers are allowed to
do, and/or provide better auditing through system logs. However, it is important to keep in mind
that AppArmor is not a silver bullet and can only do so much to protect against exploits in your
application code. It is important to provide good, restrictive profiles, and harden your
applications and cluster from other angles as well.



## {{% heading "objectives" %}}


* See an example of how to load a profile on a node
* Learn how to enforce the profile on a Pod
* Learn how to check that the profile is loaded
* See what happens when a profile is violated
* See what happens when a profile cannot be loaded



## {{% heading "prerequisites" %}}


Make sure:

1. Kubernetes version is at least v1.4 -- Kubernetes support for AppArmor was added in
   v1.4. Kubernetes components older than v1.4 do not support the AppArmor API, and
   will **reject** any worloads with AppArmor settings provided. To ensure that your Pods are
   receiving the expected protections, it is important to verify the Kubelet version of your nodes:

   ```shell
   kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {@.status.nodeInfo.kubeletVersion}\n{end}'
   ```
   ```
   gke-test-default-pool-239f5d02-gyn2: v1.26.0
   gke-test-default-pool-239f5d02-x1kf: v1.26.0
   gke-test-default-pool-239f5d02-xwux: v1.26.0
   ```

2. AppArmor kernel module is enabled -- For the Linux kernel to enforce an AppArmor profile, the
   AppArmor kernel module must be installed and enabled. Several distributions enable the module by
   default, such as Ubuntu and SUSE, and many others provide optional support. To check whether the
   module is enabled, check the `/sys/module/apparmor/parameters/enabled` file:

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   If the Kubelet contains AppArmor support (>= v1.4), it will refuse to run a Pod with AppArmor
   options if the kernel module is not enabled.

  {{< note >}}
  Ubuntu carries many AppArmor patches that have not been merged into the upstream Linux
  kernel, including patches that add additional hooks and features. Kubernetes has only been
  tested with the upstream version, and does not promise support for other features.
  {{< /note >}}

3. Container runtime supports AppArmor -- Currently all common Kubernetes-supported container
   runtimes should support AppArmor, like {{< glossary_tooltip term_id="docker">}},
   {{< glossary_tooltip term_id="cri-o" >}} or {{< glossary_tooltip term_id="containerd" >}}.
   Please refer to the corresponding runtime documentation and verify that the cluster fulfills
   the requirements to use AppArmor.

4. Profile is loaded -- AppArmor is applied to a Pod by specifying an AppArmor profile that each
   container should be run with. If any of the specified profiles is not already loaded in the
   kernel, the Kubelet (>= v1.4) will reject the Pod. You can view which profiles are loaded on a
   node by checking the `/sys/kernel/security/apparmor/profiles` file. For example:

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```
   ```
   apparmor-deny-write (enforce)
   apparmor-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   For more details on loading profiles on nodes, see
   [Setting up nodes with profiles](#setting-up-nodes-with-profiles).

As long as the Kubelet version includes AppArmor support (>= v1.4), the Kubelet will reject a Pod
with AppArmor options if any of the prerequisites are not met. You can also verify AppArmor support
on nodes by checking the node ready condition message (though this is likely to be removed in a
later release):

```shell
kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {.status.conditions[?(@.reason=="KubeletReady")].message}\n{end}'
```
```
gke-test-default-pool-239f5d02-gyn2: kubelet is posting ready status. AppArmor enabled
gke-test-default-pool-239f5d02-x1kf: kubelet is posting ready status. AppArmor enabled
gke-test-default-pool-239f5d02-xwux: kubelet is posting ready status. AppArmor enabled
```



<!-- lessoncontent -->

## Loading AppArmor profiles onto nodes

*This example assumes you have already set up a cluster with AppArmor support.*

Kubernetes AppArmor enforcement works by first checking that all the prerequisites have been
met, and then forwarding the profile selection to the container runtime for enforcement. If the
prerequisites have not been met, the Pod will be rejected, and will not run.

To verify that the profile was applied, you can look for the AppArmor security option listed in the container created event:

```shell
kubectl get events | grep Created
```
```
22s        22s         1         hello-apparmor     Pod       spec.containers{hello}   Normal    Created     {kubelet e2e-test-stclair-node-pool-31nt}   Created container with docker id 269a53b202d3; Security:[seccomp=unconfined apparmor=k8s-apparmor-deny-write]
```

You can also verify directly that the container's root process is running with the correct profile by checking its proc attr:

```shell
kubectl exec <pod_name> cat /proc/1/attr/current
```
```
k8s-apparmor-deny-write (enforce)
```

First, we need to load the profile we want to use onto our nodes. This profile denies all file writes:

```shell
#include <tunables/global>

profile k8s-apparmor-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
```

Since we don't know where the Pod will be scheduled, we'll need to load the profile on all our
nodes. For this example we'll use SSH to install the profiles, but other approaches are
discussed in [Setting up nodes with profiles](#setting-up-nodes-with-profiles).

```shell
NODES=(
    # The SSH-accessible domain names of your nodes
    gke-test-default-pool-239f5d02-gyn2.us-central1-a.my-k8s
    gke-test-default-pool-239f5d02-x1kf.us-central1-a.my-k8s
    gke-test-default-pool-239f5d02-xwux.us-central1-a.my-k8s)
for NODE in ${NODES[*]}; do ssh $NODE 'sudo apparmor_parser -q <<EOF
#include <tunables/global>

profile k8s-apparmor-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
EOF'
done
```

## Running a pod with an AppArmor profile

We can run a simple "Hello AppArmor" pod using a "deny-write" profile loaded on the host by 
specifying it in the pod or container's `securityContext`:

{{< codenew file="pods/security/apparmor/hello-apparmor.yaml" >}}

{{< note >}}
The functional support for the deprecated AppArmor annotation
`container.apparmor.security.beta.kubernetes.io/[container_name]`
is going to be removed with the release of Kubernetes v1.30. Please always use
the native API fields in favor of the annotations.
{{< /note >}}


```shell
kubectl create -f ./hello-apparmor.yaml
```

If we look at the pod events, we can see that the Pod container was created with the AppArmor
profile "k8s-apparmor-deny-write":

```shell
kubectl get events | grep hello-apparmor
```
```
14s        14s         1         hello-apparmor   Pod                                Normal    Scheduled   {default-scheduler }                           Successfully assigned hello-apparmor to gke-test-default-pool-239f5d02-gyn2
14s        14s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Pulling     {kubelet gke-test-default-pool-239f5d02-gyn2}   pulling image "busybox"
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Pulled      {kubelet gke-test-default-pool-239f5d02-gyn2}   Successfully pulled image "busybox"
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Created     {kubelet gke-test-default-pool-239f5d02-gyn2}   Created container with docker id 06b6cd1c0989; Security:[seccomp=unconfined apparmor=k8s-apparmor-deny-write]
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Started     {kubelet gke-test-default-pool-239f5d02-gyn2}   Started container with docker id 06b6cd1c0989
```

We can verify that the container is actually running with that profile by checking its proc attr:

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```
```
k8s-apparmor-deny-write (enforce)
```

Finally, we can see what happens if we try to violate the profile by writing to a file:

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```
```
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

To wrap up, let's look at what happens if we try to specify a profile that hasn't been loaded:

```shell
kubectl create -f /dev/stdin <<EOF
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor-2
spec:
  securityContext:
    apparmorProfile:
      type: Localhost
      localHost: profiles/k8s-apparmor-allow-write
  containers:
  - name: hello
    image: busybox:1.28
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
EOF
pod/hello-apparmor-2 created
```

```shell
kubectl describe pod hello-apparmor-2
```
```
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   
Status:        Pending
Reason:        AppArmor
Message:       Pod Cannot enforce AppArmor: profile "k8s-apparmor-allow-write" is not loaded
IP:
Controllers:   <none>
Containers:
  hello:
    Container ID:
    Image:     busybox
    Image ID:
    Port:
    Command:
      sh
      -c
      echo 'Hello AppArmor!' && sleep 1h
    State:              Waiting
      Reason:           Blocked
    Ready:              False
    Restart Count:      0
    Environment:        <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-dnz7v (ro)
Conditions:
  Type          Status
  Initialized   True
  Ready         False
  PodScheduled  True
Volumes:
  default-token-dnz7v:
    Type:    Secret (a volume populated by a Secret)
    SecretName:    default-token-dnz7v
    Optional:   false
QoS Class:      BestEffort
Node-Selectors: <none>
Tolerations:    <none>
Events:
  FirstSeen    LastSeen    Count    From                        SubobjectPath    Type        Reason        Message
  ---------    --------    -----    ----                        -------------    --------    ------        -------
  23s          23s         1        {default-scheduler }                         Normal      Scheduled     Successfully assigned hello-apparmor-2 to e2e-test-stclair-node-pool-t1f5
  23s          23s         1        {kubelet e2e-test-stclair-node-pool-t1f5}             Warning        AppArmor    Cannot enforce AppArmor: profile "k8s-apparmor-allow-write" is not loaded
```

Note the pod status is Pending, with a helpful error message: `Pod Cannot enforce AppArmor: profile
"k8s-apparmor-allow-write" is not loaded`. An event was also recorded with the same message.

## Create a Pod that runs with the runtime default AppArmor profile

Most container runtimes provide a sane set of default syscalls that are allowed
or not. You can adopt these defaults for your workload by setting the apparmor
type in the security context of a pod or container to `RuntimeDefault`.

Here's a manifest for a Pod that specifies the `RuntimeDefault` AppArmor profile 
for all of its containers:

{{< codenew file="pods/security/apparmor/default-pod.yaml" >}}

Create that Pod:
```shell
kubectl apply -f https://k8s.io/examples/pods/security/apparmor/default-pod.yaml
```

```shell
kubectl get pod default-pod
```

The Pod should be showing as having started successfully:
```
NAME        READY   STATUS    RESTARTS   AGE
default-pod 1/1     Running   0          20s
```

Clean up the pod:

```shell
kubectl delete pod default-pod --wait --now
```

## Administration

### Setting up nodes with profiles

Kubernetes does not currently provide any native mechanisms for loading AppArmor profiles onto
nodes. There are lots of ways to setup the profiles though, such as:

* Through a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) that runs a Pod on each node to
  ensure the correct profiles are loaded. An example implementation can be found
  [here](https://git.k8s.io/kubernetes/test/images/apparmor-loader).
* At node initialization time, using your node initialization scripts (e.g. Salt, Ansible, etc.) or
  image.
* By copying the profiles to each node and loading them through SSH, as demonstrated in the
  [example](#running-a-pod-with-an-apparmor-profile).

The scheduler is not aware of which profiles are loaded onto which node, so the full set of profiles
must be loaded onto every node.  An alternative approach is to add a node label for each profile (or
class of profiles) on the node, and use a
[node selector](/docs/concepts/scheduling-eviction/assign-pod-node/) to ensure the Pod is run on a
node with the required profile.

### Authoring Profiles

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

## {{% heading "whatsnext" %}}


Additional resources:

* [Quick guide to the AppArmor profile language](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [AppArmor core policy reference](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
