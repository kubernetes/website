---
title: Linux kernel security constraints for Pods and containers
description: >
  Overview of Linux kernel security modules and constraints that you can use to
  harden your Pods and containers.
content_type: concept
weight: 100
---

<!-- overview -->

This page describes some of the security features that are built into the Linux
kernel that you can use in your Kubernetes workloads. To learn how to apply
these features to your Pods and containers, refer to
[Configure a SecurityContext for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).
You should already be familiar with Linux and with the basics of Kubernetes
workloads.

<!-- body -->

## Run workloads without root privileges {#run-without-root}

When you deploy a workload in Kubernetes, use the Pod specification to restrict
that workload from running as the root user on the node. You can use the Pod
`securityContext` to define the specific Linux user and group for the processes in
the Pod, and explicitly restrict containers from running as root users. Setting
these values in the Pod manifest takes precedence over similar values in the
container image, which is especially useful if you're running images that you
don't own.

{{< caution >}}
Ensure that the user or group that you assign to the workload has the permissions
required for the application to function correctly. Changing the user or group
to one that doesn't have the correct permissions could lead to file access
issues or failed operations.
{{< /caution >}}

Configuring the kernel security features on this page provides fine-grained
control over the actions that processes in your cluster can take, but managing
these configurations can be challenging at scale. Running containers as
non-root, or in user namespaces if you need root privileges, helps to reduce the
chance that you'll need to enforce your configured kernel security capabilities.

## Security features in the Linux kernel {#linux-security-features}

Kubernetes lets you configure and use Linux kernel features to improve isolation
and harden your containerized workloads. Common features include the following:

* **Secure computing mode (seccomp)**: Filter which system calls a process can
  make
* **AppArmor**: Restrict the access privileges of individual programs
* **Security Enhanced Linux (SELinux)**: Assign security labels to objects for
  more manageable security policy enforcement

To configure settings for one of these features, the operating system that you
choose for your nodes must enable the feature in the kernel. For example,
Ubuntu 7.10 and later enable AppArmor by default. To learn whether your OS
enables a specific feature, consult the OS documentation.

You use the `securityContext` field in your Pod specification to define the
constraints that apply to those processes. The `securityContext` field also
supports other security settings, such as specific Linux capabilities or file
access permissions using UIDs and GIDs. To learn more, refer to
[Configure a SecurityContext for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).

### seccomp

Some of your workloads might need privileges to perform specific actions as the
root user on your node's host machine. Linux uses *capabilities* to divide the
available privileges into categories, so that processes can get the privileges
required to perform specific actions without being granted all privileges. Each
capability has a set of system calls (syscalls) that a process can make. seccomp
lets you restrict these individual syscalls. <!--Copied from seccomp tutorial-->
It can be used to sandbox the privileges of a process, restricting the calls it
is able to make from userspace into the kernel.<!--End copy-->

In Kubernetes, you use a *container runtime* on each node to run your
containers. Example runtimes include CRI-O, Docker, or containerd. Each runtime
allows only a subset of Linux capabilities by default. You can further limit the
allowed syscalls individually by using a seccomp profile. Container runtimes
usually include a default seccomp profile. <!--Copied from seccomp tutorial-->
Kubernetes lets you automatically
apply seccomp profiles loaded onto a node to your Pods and containers.<!--End copy-->

{{<note>}}
Kubernetes also has the `allowPrivilegeEscalation` setting for Pods and
containers. When set to `false`, this prevents processes from gaining new
capabilities and restricts unprivileged users from changing the applied seccomp
profile to a more permissive profile.
{{</note>}}

To learn how to implement seccomp in Kubernetes, refer to
[Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/).

To learn more about seccomp, see
[Seccomp BPF](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html)
in the Linux kernel documentation.

#### Considerations for seccomp {#seccomp-considerations}

seccomp is a low-level security configuration that you should only configure
yourself if you require fine-grained control over Linux syscalls. Using
seccomp, especially at scale, has the following risks:

* Configurations might break during application updates
* Attackers can still use allowed syscalls to exploit vulnerabilities
* Profile management for individual applications becomes challenging at scale

**Recommendation**: Use the default seccomp profile that's bundled with your
container runtime. If you need a more isolated environment, consider using a
sandbox, such as gVisor. Sandboxes solve the preceding risks with custom
seccomp profiles, but require more compute resources on your nodes and might
have compatibility issues with GPUs and other specialized hardware.

### AppArmor and SELinux: policy-based mandatory access control {#policy-based-mac}

You can use Linux policy-based mandatory access control (MAC) mechanisms, such
as AppArmor and SELinux, to harden your Kubernetes workloads.

#### AppArmor

<!-- Original text from https://kubernetes.io/docs/tutorials/security/apparmor/ -->

[AppArmor](https://apparmor.net/) is a Linux kernel security module that
supplements the standard Linux user and group based permissions to confine
programs to a limited set of resources. AppArmor can be configured for any
application to reduce its potential attack surface and provide greater in-depth
defense. It is configured through profiles tuned to allow the access needed by a
specific program or container, such as Linux capabilities, network access, and
file permissions. Each profile can be run in either enforcing mode, which blocks
access to disallowed resources, or complain mode, which only reports violations.

AppArmor can help you to run a more secure deployment by restricting what
containers are allowed to do, and/or provide better auditing through system
logs. The container runtime that you use might ship with a default AppArmor
profile, or you can use a custom profile.

To learn how to use AppArmor in Kubernetes, refer to
[Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/).

#### SELinux

SELinux is a Linux kernel security module that lets you restrict the access
that a specific *subject*, such as a process, has to the files on your system.
You define security policies that apply to subjects that have specific SELinux
labels. When a process that has an SELinux label attempts to access a file, the
SELinux server checks whether that process' security policy allows the access
and makes an authorization decision.

In Kubernetes, you can set an SELinux label in the `securityContext` field of
your manifest. The specified labels are assigned to those processes. If you
have configured security policies that affect those labels, the host OS kernel
enforces these policies.

To learn how to use SELinux in Kubernetes, refer to
[Assign SELinux labels to a container](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container).

#### Differences between AppArmor and SELinux {#apparmor-selinux-diff}

The operating system on your Linux nodes usually includes one of either
AppArmor or SELinux. Both mechanisms provide similar types of protection, but
have differences such as the following:

* **Configuration**: AppArmor uses profiles to define access to resources.
  SELinux uses policies that apply to specific labels.
* **Policy application**: In AppArmor, you define resources using file paths.
  SELinux uses the index node (inode) of a resource to identify the resource.

### Summary of features {#summary}

The following table describes the use cases and scope of each security control.
You can use all of these controls together to build a more hardened system.

<table>
  <caption>Summary of Linux kernel security features</caption>
  <thead>
    <tr>
      <th>Security feature</th>
      <th>Description</th>
      <th>How to use</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>seccomp</td>
      <td>Restrict individual kernel calls in the userspace. Reduces the
      likelihood that a vulnerability that uses a restricted syscall would
      compromise the system.</td>
      <td>Specify a loaded seccomp profile in the Pod or container specification
      to apply its constraints to the processes in the Pod.</td>
      <td>Reject the <code>unshare</code> syscall, which was used in
      <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-0185">CVE-2022-0185</a>.</td>
    </tr>
    <tr>
      <td>AppArmor</td>
      <td>Restrict program access to specific resources. Reduces the attack
      surface of the program. Improves audit logging.</td>
      <td>Specify a loaded AppArmor profile in the container specification.</td>
      <td>Restrict a read-only program from writing to any file path
      in the system.</td>
    </tr>
    <tr>
      <td>SELinux</td>
      <td>Restrict access to resources such as files, applications, ports, and
      processes using labels and security policies.</td>
      <td>Specify access restrictions for specific labels. Tag processes with
      those labels to enforce the access restrictions related to the label.</td>
      <td>Restrict a container from accessing files outside its own filesystem.</td>
    </tr>
  </tbody>
</table>

{{< note >}}
Mechanisms like AppArmor and SELinux can provide protection that extends beyond
the container. For example, you can use SELinux to help mitigate
[CVE-2019-5736](https://access.redhat.com/security/cve/cve-2019-5736).
{{< /note >}}

### Considerations for managing custom configurations {#considerations-custom-configurations}

seccomp, AppArmor, and SELinux usually have a default configuration that offers
basic protections.  You can also create custom profiles and policies that meet
the requirements of your workloads. Managing and distributing these custom
configurations at scale might be challenging, especially if you use all three
features together. To help you to manage these configurations at scale, use a
tool like the
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator).

## Kernel-level security features and privileged containers {#kernel-security-features-privileged-containers}

Kubernetes lets you specify that some trusted containers can run in
*privileged* mode. Any container in a Pod can run in privileged mode to use
operating system administrative capabilities that would otherwise be
inaccessible. This is available for both Windows and Linux.

Privileged containers explicitly override some of the Linux kernel constraints
that you might use in your workloads, as follows:

* **seccomp**: Privileged containers run as the `Unconfined` seccomp profile,
  overriding any seccomp profile that you specified in your manifest.
* **AppArmor**: Privileged containers ignore any applied AppArmor profiles.
* **SELinux**: Privileged containers run as the `unconfined_t` domain.

### Privileged containers {#privileged-containers}

<!-- Content from https://kubernetes.io/docs/concepts/workloads/pods/#privileged-mode-for-containers  -->

Any container in a Pod can enable *Privileged mode* if you set the
`privileged: true` field in the
[`securityContext`](/docs/tasks/configure-pod-container/security-context/)
field for the container. Privileged containers override or undo many other hardening settings such as the applied seccomp profile, AppArmor profile, or
SELinux constraints. Privileged containers are given all Linux capabilities,
including capabilities that they don't require. For example, a root user in a
privileged container might be able to use the `CAP_SYS_ADMIN` and
`CAP_NET_ADMIN` capabilities on the node, bypassing the runtime seccomp
configuration and other restrictions.

In most cases, you should avoid using privileged containers, and instead grant
the specific capabilities required by your container using the `capabilities`
field in the `securityContext` field. Only use privileged mode if you have a
capability that you can't grant with the securityContext. This is useful for
containers that want to use operating system administrative capabilities such
as manipulating the network stack or accessing hardware devices.

In Kubernetes version 1.26 and later, you can also run Windows containers in a
similarly privileged mode by setting the `windowsOptions.hostProcess` flag on
the security context of the Pod spec. For details and instructions, see
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).

## Recommendations and best practices {#recommendations-best-practices}

* Before configuring kernel-level security capabilities, you should consider
  implementing network-level isolation. For more information, read the
  [Security Checklist](/docs/concepts/security/security-checklist/#network-security).
* Unless necessary, run Linux workloads as non-root by setting specific user and
  group IDs in your Pod manifest and by specifying `runAsNonRoot: true`.

Additionally, you can run workloads in user namespaces by setting
`hostUsers: false` in your Pod manifest. This lets you run containers as root
users in the user namespace, but as non-root users in the host namespace on the
node. This is still in early stages of development and might not have the level
of support that you need. For instructions, refer to
[Use a User Namespace With a Pod](/docs/tasks/configure-pod-container/user-namespaces/).

## {{% heading "whatsnext" %}}

* [Learn how to use AppArmor](/docs/tutorials/security/apparmor/)
* [Learn how to use seccomp](/docs/tutorials/security/seccomp/)
* [Learn how to use SELinux](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)
