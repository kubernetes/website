---
assignees:
- erictune
- mikedanese
- thockin
title: Configure a Security Context for a Pod or Container
redirect_from:
- "/docs/user-guide/security-context/"
- "/docs/concepts/policy/container-capabilities/" 
---

{% capture overview %}

A security context defines privilege and access control settings for
a Pod or Container. Security context settings include:

* Discretionary Access Control: Permission to access an object, like a file, is based on
[user ID (UID) and group ID (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [Security Enhanced Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux): Objects are assigned security labels.

* Running as privileged or unprivileged.

* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): Give a process some privileges, but not all the privileges of the root user.

* [AppArmor](/docs/tutorials/clusters/apparmor/): Use program profiles to restrict the capabilities of individual programs.

* [Seccomp](https://en.wikipedia.org/wiki/Seccomp): Limit a process's access to open file descriptors.

For more information about security mechanisms in Linux, see
[Overview of Linux Kernel Security Features](https://www.linux.com/learn/overview-linux-kernel-security-features)

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Set the security context for a Pod

To specify security settings for a Pod, include the `securityContext` field
in the Pod specification. The `securityContext` field is a
[PodSecurityContext](/docs/api-reference/v1.6/#podsecuritycontext-v1-core) object.
The security settings that you specify for a Pod apply to all Containers in the Pod.
Here is a configuration file for a Pod that has a `securityContext` and an `emptyDir` volume:

{% include code.html language="yaml" file="security-context.yaml" ghlink="/docs/tasks/configure-pod-container/security-context.yaml" %}

In the configuration file, the `runAsUser` field specifies that for any Containers in
the Pod, the first process runs with user ID 1000. The `fsGroup` field specifies that
group ID 2000 is associated with all Containers in the Pod. Group ID 2000 is also
associated with the volume mounted at `/data/demo` and with any files created in that
volume.

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/security-context.yaml
```

Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo
```

Get a shell to the running Container:

```shell
kubectl exec -it security-context-demo -- sh
```

In your shell, list the running processes:

```shell
ps aux
```

The output shows that the processes are running as user 1000, which isithub.io
   68dc8932..69f5ba31  qos-experiment -> qos-experi
the value of `runAsUser`:

```shell
USER   PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
1000     1  0.0  0.0   4336   724 ?     Ss   18:16   0:00 /bin/sh -c node server.js
1000     5  0.2  0.6 772124 22768 ?     Sl   18:16   0:00 node server.js
...
```

In your shell, navigate to `/data`, and list the one directory:

```shell
cd /data
ls -l
```

The output shows that the `/data/demo` directory has group ID 2000, which is
the value of `fsGroup`.

```shell
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

In your shell, navigate to `/data/demo`, and create a file:

```shell
cd demo
echo hello > testfile
```

List the file in the `/data/demo` directory:

```shell
ls -l
```

The output shows that `testfile` has group ID 2000, which is the value of `fsGroup`.

```shell
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

Exit your shell:

```shell
exit
```

## Set the security context for a Container

To specify security settings for a Container, include the `securityContext` field
in the Container manifest. The `securityContext` field is a
[SecurityContext](/docs/api-reference/v1.6/#securitycontext-v1-core) object.
Security settings that you specify for a Container apply only to
the individual Container, and they override settings made at the Pod level when
there is overlap. Container settings do not affect the Pod's Volumes.

Here is the configuration file for a Pod that has one Container. Both the Pod
and the Container have a `securityContext` field:

{% include code.html language="yaml" file="security-context-2.yaml" ghlink="/docs/tasks/configure-pod-container/security-context-2.yaml" %}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/security-context-2.yaml
```

Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo-2
```

Get a shell into the running Container:

```shell
kubectl exec -it security-context-demo-2 -- sh
```

In your shell, list the running processes:

```
ps aux
```

The output shows that the processes are running as user 2000. This is the value
of `runAsUser` specified for the Container. It overrides the value 1000 that is
specified for the Pod.

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

Exit your shell:

```shell
exit
```

## Set capabilities for a Container

With [Linux capabilities](http://man7.org/linux/man-pages/man7/capabilities.7.html),
you can grant certain privileges to a process without granting all the privileges
of the root user. To add or remove Linux capabilities for a Container, include the
`capabilities` field in the `securityContext` section of the Container manifest.

First, see what happens when you don't include a `capabilities` field.
Here is configuration file that does not add or remove any Container capabilities:

{% include code.html language="yaml" file="security-context-3.yaml" ghlink="/docs/tasks/configure-pod-container/security-context-3.yaml" %}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/security-context-3.yaml
```

Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo-3
```

Get a shell into the running Container:

```shell
kubectl exec -it security-context-demo-3 -- sh
```

In your shell, list the running processes:

```shell
ps aux
```

The output shows the process IDs (PIDs) for the Container:

```shell
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

In your shell, view the status for process 1:

```shell
cd /proc/1
cat status
```

The output shows the capabilities bitmap for the process:

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

Make a note of the capabilities bitmap, and then exit your shell:

```shell
exit
```

Next, run a Container that is the same as the preceding container, except
that it has additional capabilities set.

Here is the configuration file for a Pod that runs one Container. The configuration
adds the `CAP_NET_ADMIN` and `CAP_SYS_TIME` capabilities:

{% include code.html language="yaml" file="security-context-4.yaml" ghlink="/docs/tasks/configure-pod-container/security-context-4.yaml" %}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/security-context-4.yaml
```

Get a shell into the running Container:

```shell
kubectl exec -it security-context-demo-4 -- sh
```

In your shell, view the capabilities for process 1:

```shell
cd /proc/1
cat status
```

The output shows capabilities bitmap for the process:

```shell
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

Compare the capabilities of the two Containers:

```
00000000a80425fb
00000000aa0435fb 
```

In the capability bitmap of the first container, bits 12 and 25 are clear. In the second container,
bits 12 and 25 are set. Bit 12 is `CAP_NET_ADMIN`, and bit 25 is `CAP_SYS_TIME`.
See [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
for definitions of the capability constants.

**Note**: Linux capability constants have the form `CAP_XXX`. But when you list capabilities
in your Container manifest, you must omit the `CAP_` portion of the constant. For example,
to add `CAP_SYS_TIME`, include `SYS_TIME` in your list of capabilities.

## Assign SELinux labels to a Container

To assign SELinux labels to a Container, include the `seLinuxOptions` field in
the `securityContext` section of your Pod or Container manifest. The
`seLinuxOptions` field is an
[SELinuxOptions](/docs/api-reference/v1.6/#selinuxoptions-v1-core)
object. Here's an example that applies an SELinux level:

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

**Note**: To assign SELinux labels, the SELinux security module must be loaded
on the host operating system.

## Discussion

The security context for a Pod applies to the Pod's Containers and also to
the Pod's Volumes when applicable. Specifically `fsGroup` and `seLinuxOptions` are
applied to Volumes as follows:

* `fsGroup`: Volumes that support ownership management are modified to be owned
and writable by the GID specified in `fsGroup`. See the
[Ownership Management design document](https://git.k8s.io/community/contributors/design-proposals/volume-ownership-management.md)
for more details.

* `seLinuxOptions`: Volumes that support SELinux labeling are relabeled to be accessible
by the label specified under `seLinuxOptions`. Usually you only
need to set the `level` section. This sets the
[Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS)
label given to all Containers in the Pod as well as the Volumes.

**Warning**: After you specify an MCS label for a Pod, all Pods with the same
label will able to access the Volume. So if you need inter-Pod
protection, you must ensure each Pod is assigned a unique MCS label.

{% endcapture %}

{% capture whatsnext %}

* [PodSecurityContext](/docs/api-reference/v1.6/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/api-reference/v1.6/#securitycontext-v1-core)
* [Tuning Docker with the newest security enhancements](https://opensource.com/business/15/3/docker-security-tuning)
* [Security Contexts design document](https://git.k8s.io/community/contributors/design-proposals/security_context.md)
* [Ownership Management design document](https://git.k8s.io/community/contributors/design-proposals/volume-ownership-management.md)
* [Pod Security Policies](/docs/concepts/policy/pod-security-policy/)


{% endcapture %}

{% include templates/task.md %}
