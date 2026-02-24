---
layout: blog
title: "Kubernetes v1.33: User Namespaces enabled by default!"
date: 2025-04-25T10:30:00-08:00
slug: userns-enabled-by-default
author: >
  Rodrigo Campos Catelin (Microsoft),
  Giuseppe Scrivano (Red Hat),
  Sascha Grunert (Red Hat)
---

In Kubernetes v1.33 support for user namespaces is enabled by default. This means
that, when the stack requirements are met, pods can opt-in to use user
namespaces. To use the feature there is no need to enable any Kubernetes feature
flag anymore!

In this blog post we answer some common questions about user namespaces. But,
before we dive into that, let's recap what user namespaces are and why they are
important.

## What is a user namespace?

Note: Linux user namespaces are a different concept from [Kubernetes
namespaces](/docs/concepts/overview/working-with-objects/namespaces/).
The former is a Linux kernel feature; the latter is a Kubernetes feature.

Linux provides different namespaces to isolate processes from each other. For
example, a typical Kubernetes pod runs within a network namespace to isolate the
network identity and a PID namespace to isolate the processes.

One Linux namespace that was left behind is the [user
namespace](https://man7.org/linux/man-pages/man7/user_namespaces.7.html). It
isolates the UIDs and GIDs of the containers from the ones on the host. The
identifiers in a container can be mapped to identifiers on the host in a way
where host and container(s) never end up in overlapping UID/GIDs. Furthermore,
the identifiers can be mapped to unprivileged, non-overlapping UIDs and GIDs on
the host. This brings three key benefits:

 * _Prevention of lateral movement_: As the UIDs and GIDs for different
containers are mapped to different UIDs and GIDs on the host, containers have a
harder time attacking each other, even if they escape the container boundaries.
For example, suppose container A runs with different UIDs and GIDs on the host
than container B. In that case, the operations it can do on container B's files and processes
are limited: only read/write what a file allows to others, as it will never
have permission owner or group permission (the UIDs/GIDs on the host are
guaranteed to be different for different containers).

 * _Increased host isolation_: As the UIDs and GIDs are mapped to unprivileged
users on the host, if a container escapes the container boundaries, even if it
runs as root inside the container, it has no privileges on the host. This
greatly protects what host files it can read/write, which process it can send
signals to, etc. Furthermore, capabilities granted are only valid inside the
user namespace and not on the host, limiting the impact a container
escape can have.

 * _Enablement of new use cases_: User namespaces allow containers to gain
certain capabilities inside their own user namespace without affecting the host.
This unlocks new possibilities, such as running applications that require
privileged operations without granting full root access on the host. This is
particularly useful for running nested containers.

{{< figure src="/images/blog/2024-04-22-userns-beta/image.svg" alt="Image showing IDs 0-65535 are reserved to the host, pods use higher IDs" title="User namespace IDs allocation" class="diagram-medium" >}}

If a pod running as the root user without a user namespace manages to breakout,
it has root privileges on the node.  If some capabilities were granted to the
container, the capabilities are valid on the host too. None of this is true when
using user namespaces (modulo bugs, of course 🙂).

## Demos

Rodrigo created demos to understand how some CVEs are mitigated when user
namespaces are used. We showed them here before (see [here][userns-alpha] and
[here][userns-beta]), but take a look if you haven't:

Mitigation of CVE 2024-21626 with user namespaces:

{{< youtube id="07y5bl5UDdA" title="Mitigation of CVE-2024-21626 on Kubernetes by enabling User Namespace support" class="youtube-quote-sm" >}}

Mitigation of CVE 2022-0492 with user namespaces:

{{< youtube id="M4a2b4KkXN8" title="Mitigation of CVE-2022-0492 on Kubernetes by enabling User Namespace support" class="youtube-quote-sm" >}}

[userns-alpha]: https://kubernetes.io/blog/2023/09/13/userns-alpha/
[userns-beta]: https://kubernetes.io/blog/2024/04/22/userns-beta/

## Everything you wanted to know about user namespaces in Kubernetes

Here we try to answer some of the questions we have been asked about user
namespaces support in Kubernetes.

**1. What are the requirements to use it?**

The requirements are documented [here][userns-req]. But we will elaborate a bit
more, in the following questions.

Note this is a Linux-only feature.

[userns-req]: /docs/concepts/workloads/pods/user-namespaces/#before-you-begin

**2. How do I configure a pod to opt-in?**

A complete step-by-step guide is available [here][task-userns]. But the short
version is you need to set the `hostUsers: false` field in the pod spec. For
example like this:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: userns
spec:
  hostUsers: false
  containers:
  - name: shell
    command: ["sleep", "infinity"]
    image: debian
```

Yes, it is that simple. Applications will run just fine, without any other
changes needed (unless your application needs the privileges).

User namespaces allows you to run as root inside the container, but not have
privileges in the host. However, if your application needs the privileges on the
host, for example an app that needs to load a kernel module, then you can't use
user namespaces.

**3. What are idmap mounts and why the file-systems used need to support it?**

Idmap mounts are a Linux kernel feature that uses a mapping of UIDs/GIDs when
accessing a mount. When combined with user namespaces, it greatly simplifies the
support for volumes, as you can forget about the host UIDs/GIDs the user
namespace is using.

In particular, thanks to idmap mounts we can:
 * Run each pod with different UIDs/GIDs on the host. This is key for the
   lateral movement prevention we mentioned earlier.
 * Share volumes with pods that don't use user namespaces.
 * Enable/disable user namespaces without needing to chown the pod's volumes.

Support for idmap mounts in the kernel is per file-system and different kernel
releases added support for idmap mounts on different file-systems.

To find which kernel version added support for each file-system, you can check
out the `mount_setattr` man page, or the online version of it
[here][mount_setattr].

Most popular file-systems are supported, the notable absence that isn't
supported yet is NFS.

[mount_setattr]: https://man7.org/linux/man-pages/man2/mount_setattr.2.html#NOTES

**4. Can you clarify exactly which file-systems need to support idmap mounts?**

The file-systems that need to support idmap mounts are all the file-systems used
by a pod in the `pod.spec.volumes` field.

This means: for PV/PVC volumes, the file-system used in the PV needs to support
idmap mounts; for hostPath volumes, the file-system used in the hostPath
needs to support idmap mounts.

What does this mean for secrets/configmaps/projected/downwardAPI volumes? For
these volumes, the kubelet creates a `tmpfs` file-system. So, you will need a
6.3 kernel to use these volumes (note that if you use them as env variables it
is fine).

And what about emptyDir volumes? Those volumes are created by the kubelet by
default in `/var/lib/kubelet/pods/`. You can also use a custom directory for
this. But what needs to support idmap mounts is the file-system used in that
directory.

The kubelet creates some more files for the container, like `/etc/hostname`,
`/etc/resolv.conf`, `/dev/termination-log`, `/etc/hosts`, etc. These files are
also created in `/var/lib/kubelet/pods/` by default, so it's important for the
file-system used in that directory to support idmap mounts.

Also, some container runtimes may put some of these ephemeral volumes inside a
`tmpfs` file-system, in which case you will need support for idmap mounts in
`tmpfs`.

**5. Can I use a kernel older than 6.3?**

Yes, but you will need to make sure you are not using a `tmpfs` file-system. If
you avoid that, you can easily use 5.19 (if all the other file-systems you use
support idmap mounts in that kernel).

It can be tricky to avoid using `tmpfs`, though, as we just described above. 
Besides having to avoid those volume types, you will also have to avoid mounting the
service account token. Every pod has it mounted by default, and it uses a
projected volume that, as we mentioned, uses a `tmpfs` file-system.

You could even go lower than 5.19, all the way to 5.12. However, your container
rootfs probably uses an overlayfs file-system, and support for overlayfs was
added in 5.19. We wouldn't recommend to use a kernel older than 5.19, as not
being able to use idmap mounts for the rootfs is a big limitation. If you
absolutely need to, you can check [this blog post][userns-tricks] Rodrigo wrote
some years ago, about tricks to use user namespaces when you can't support
idmap mounts on the rootfs.

[userns-tricks]: https://kinvolk.io/blog/2023/11/tips-and-tricks-for-user-namespaces-with-kubernetes-and-containerd

**6. If my stack supports user namespaces, do I need to configure anything else?**

No, if your stack supports it and you are using Kubernetes v1.33, there is
nothing you _need_ to configure. You should be able to follow the task: [Use a
user namespace with a pod][task-userns].

However, in case you have specific requirements, you may configure various
options. You can find more information [here][userns-k8s-conf]. You can also
enable a [feature gate to relax the PSS rules][userns-pss].

[userns-k8s-conf]: /docs/concepts/workloads/pods/user-namespaces/#set-up-a-node-to-support-user-namespaces
[task-userns]: /docs/tasks/configure-pod-container/user-namespaces/
[userns-pss]: /docs/concepts/workloads/pods/user-namespaces/#integration-with-pod-security-admission-checks

**7. The demos are nice, but are there more CVEs that this mitigates?**

Yes, quite a lot, actually! Besides the ones in the demo, the KEP has [more CVEs
you can check][kep-cve]. That list is not exhaustive, there are many more.

[kep-cve]: https://github.com/kubernetes/enhancements/blob/b8013bfbceb16843686aebbb2ccffce81a6e772d/keps/sig-node/127-user-namespaces/README.md#motivation

**8. Can you sum up why user namespaces is important?**

Think about running a process as root, maybe even an untrusted process. Do you
think that is secure? What if we limit it by adding seccomp and apparmor, mask
some files in /proc (so it can't crash the node, etc.) and some more tweaks?

Wouldn't it be better if we don't give it privileges in the first place, instead
of trying to play whack-a-mole with all the possible ways root can escape?

This is what user namespaces does, plus some other goodies:

 * **Run as an unprivileged user on the host without making changes to your application**.
Greg and Vinayak did a great talk on the pains you can face when trying to run
unprivileged without user namespaces. The pains part [starts in this minute][kubecon-nonroot-pains].

 * **All pods run with different UIDs/GIDs, we significantly improve the lateral
movement**. This is guaranteed with user namespaces (the kubelet chooses it for
you). In the same talk, Greg and Vinayak show that to achieve the same without
user namespaces, they went through a quite complex custom solution. This part
[starts in this minute][kubecon-nonroot-uids].

 * **The capabilities granted are only granted inside the user namespace**. That
 means that if a pod breaks out of the container, they are not valid on the
host. We can't provide that without user namespaces.

 * **It enables new use-cases in a _secure_ way**. You can run docker in docker,
unprivileged container builds, Kubernetes inside Kubernetes, etc all **in a secure
way**. Most of the previous solutions to do this required privileged containers or
putting the node at a high risk of compromise.

[kubecon-nonroot-pains]: https://youtu.be/uouH9fsWVIE?feature=shared&t=351
[kubecon-nonroot-uids]: https://youtu.be/uouH9fsWVIE?feature=shared&t=793

**9. Is there container runtime documentation for user namespaces?**

Yes, we have [containerd
documentation](https://github.com/containerd/containerd/tree/b22a302a75d9a7d7955780e54cc5b32de6c8525d/docs/user-namespaces).
This explains different limitations of containerd 1.7 and how to use
user namespaces in containerd without Kubernetes pods (using `ctr`). Note that
if you use containerd, you need containerd 2.0 or higher to use user namespaces
with Kubernetes.

CRI-O doesn't have special documentation for user namespaces, it works out of
the box.

**10. What about the other container runtimes?**

No other container runtime that we are aware of supports user namespaces with
Kubernetes. That sadly includes [cri-dockerd][cri-dockerd] too.

[cri-dockerd]: https://github.com/Mirantis/cri-dockerd/issues/74

**11. I'd like to learn more about it, what would you recommend?**

Rodrigo did an introduction to user namespaces at KubeCon 2022:
 * [Run As “Root”, Not Root: User Namespaces In K8s- Marga Manterola, Isovalent & Rodrigo Campos Catelin](https://sched.co/182K0)

Also, this aforementioned presentation at KubeCon 2023 can be
useful as a motivation for user namespaces:
 * [Least Privilege Containers: Keeping a Bad Day from Getting Worse - Greg Castle & Vinayak Goyal](https://sched.co/1HyX4)

Bear in mind the presentation are some years old, some things have changed since
then. Use the Kubernetes documentation as the source of truth.

If you would like to learn more about the low-level details of user namespaces,
you can check `man 7 user_namespaces` and `man 1 unshare`. You can easily create
namespaces and experiment with how they behave. Be aware that the `unshare` tool
has a lot of flexibility, and with that options to create incomplete setups.

If you would like to know more about idmap mounts, you can check [its Linux
kernel documentation](https://docs.kernel.org/filesystems/idmappings.html).

## Conclusions

Running pods as root is not ideal and running them as non-root is also hard
with containers, as it can require a lot of changes to the applications.
User namespaces are a unique feature to let you have the best of both worlds: run
as non-root, without any changes to your application.

This post covered: what are user namespaces, why they are important, some real
world examples of CVEs mitigated by user-namespaces, and some common questions.
Hopefully, this post helped you to eliminate the last doubts you had and you
will now try user-namespaces (if you didn't already!).

## How do I get involved?

You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact us directly:
- GitHub: @rata @giuseppe @saschagrunert
- Slack: @rata @giuseppe @sascha
