---
layout: blog
title: "Kubernetes v1.37: Hardening Container Storage with Bind Mount Options and EmptyDir Permissions"
date: 2026-08-07
slug: kubernetes-v1-37-hardening-container-storage
draft: true
author: >
  [Nispriha Jagan](https://github.com/nispriha) (Red Hat),
  [Neeraj Krishna Gopalakrishna](https://github.com/ngopalak-redhat) (Red Hat)
---

Kubernetes v1.37 brings important storage security features: emptyDir permission modes and bind mounts options. It helps application programmers and security professionals to implement rigorous security policies, for example, prohibiting deletion of files across containers or execution of arbitrary binaries from writable volumes, directly in Kubernetes without any complicated circumvention.

## Linux Storage & Permission Fundamentals

Before diving into the new Kubernetes features, let us briefly review the low-level Linux security mechanisms that make them possible.

### Bind Mount Flags

When Linux mounts or remounts a directory, Virtual File System (VFS) flags control what actions are permitted on that filesystem:

- **`noexec`**: Do not permit direct execution of any binaries on the mounted filesystem.
- **`nosuid`**: Do not allow set-user-identifier or set-group-identifier bits to take effect.
- **`nodev`**: Do not interpret character or block special devices on the file system.

### Directory Permissions and the Sticky Bit

Standard Unix permissions regulate access across three scopes: Owner, Group, and Others (e.g., `0755` or `0777`).

Beyond standard read, write, and execute bits, Linux supports the **sticky bit** (represented by a leading `1` in octal mode, such as `01777`). When applied to a directory, the sticky bit ensures that a file inside that directory can only be deleted or renamed by the file's owner or root. This is essential for shared writable directories like `/tmp`.

## Why Do We Need Bind Mount Options and EmptyDir Permissions?

The primary goal of these features is to increase the security of Kubernetes workloads by allowing security-related bind mount options on volume mounts. Currently, volumes are bind-mounted into containers by the container runtime and kubelet without `noexec`, `nosuid`, or `nodev` flags. This default can undermine security. For example, with `noexec` missing, a compromised process can use any writable volume (emptyDir, PersistentVolume, projected, etc.) to download, `chmod +x`, and execute arbitrary binaries even when the container has a read-only root filesystem (`readOnlyRootFilesystem: true`). Supporting `noexec`, `nodev`, and `nosuid` gives users a native way to harden volume mounts to match security benchmarks and policy.

The gap is most visible with emptyDir volumes, which are the most common writable volume type and have been the subject of multiple security findings:

- [Issue #48912](https://github.com/kubernetes/kubernetes/issues/48912): Recognized security gap - the inability to set mount options on emptyDir was flagged in an audit but remains unresolved as of 2026.
- [Issue #119627](https://github.com/kubernetes/kubernetes/issues/119627): Kubernetes 1.24 Security Audit (Finding NCC-E003660-7HM) - external auditors specifically noted that the inability to mount emptyDir with `noexec` represents a security failure.

However, the same gap applies to all volume types. PersistentVolumes have a `mountOptions` field, but those options are filesystem-level flags applied by the CSI driver at the node, so they do not reliably translate into bind mount flags inside the container. There is currently no mechanism to set `noexec`, `nosuid`, or `nodev` on the bind mount that the container runtime creates for any volume type.

Additionally, the emptyDir volume creates directories with a hardcoded mode of `0777`. This means any process with access can read, write, and delete anything in the volume, regardless of who created it. There is no way to change this today.

This causes real problems:

- Multi-container pods sharing an emptyDir cannot prevent one container from deleting another's files. The sticky bit (`01777`) solves this, but previously there was no way to set it.
- For containerized applications (e.g., Ruby apps), `/tmp` directories without a sticky bit are rejected for security reasons. This means emptyDir cannot reliably serve as `/tmp`, forcing users to resort to ephemeral volumes or RWX volumes, both of which are significantly more complex to manage and not well supported across providers.
- Platform engineers who want tighter permissions (e.g., `0750` for owner and group only) have to use init containers running `chmod`, which adds unnecessary complexity.

EmptyDir was a notable gap. Secret, ConfigMap, and DownwardAPI volumes all support a `defaultMode` field, but emptyDir had no equivalent.

## Real-World Use Cases

Application developers, working closely with security engineers, are responsible for maintaining the security posture of their applications and ensuring workloads do not pose risks to the wider infrastructure. These features allow development teams to confidently address critical security scenarios:

**Preventing Privilege Escalation on Writable Mounts:** An application developer configuring temporary workspace volumes (like emptyDir or `/tmp` mounts) can ensure they are mounted with `nosuid` and `noexec`. This guarantees that even if the application is compromised and a malicious payload is downloaded, the workload cannot execute the payload or use it to escalate privileges on the node.

**Securing Shared Scratch Space in Multi-Container Pods:** A developer configuring CI/CD pipeline pods often needs multiple containers (e.g., a builder container and a sidecar logger) to share a workspace. By setting `mode: 01777` on an emptyDir, the developer ensures the shared workspace behaves like a traditional Unix `/tmp` directory. Each container can write files independently, but a compromised process in one container cannot delete the build artifacts produced by another.

**Enforcing Principle of Least Privilege for Application Data:** An application developer deploying a database pod can lock down access to the database's temporary storage. By setting `mode: 0750` on the emptyDir, the developer ensures that only the specific database user and group can read or write to the volume, explicitly denying access to any other processes or sidecars in the same pod.

## Example 1: Enforcing Bind Mount Options

This full Pod manifest mounts an emptyDir volume at `/tmp` with `bindMountOptions: [noexec, nosuid]`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hardened-bindmount-pod
  namespace: default
spec:
  containers:
    - name: hardened-app
      image: alpine:latest
      command: ["sleep", "3600"]
      securityContext:
        readOnlyRootFilesystem: true
      volumeMounts:
        - name: temp-storage
          mountPath: /tmp
          bindMountOptions:
            - noexec
            - nosuid
  volumes:
    - name: temp-storage
      emptyDir: {}
```

## Example 2: EmptyDir Volume Permission Mode with Sticky Bit

This full Pod manifest creates an emptyDir volume using `mode: 01777` to enforce standard Unix `/tmp` sticky bit protections across containers.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hardened-emptydir-pod
  namespace: default
spec:
  containers:
    - name: app-container
      image: alpine:latest
      command: ["sleep", "3600"]
      volumeMounts:
        - name: shared-tmp
          mountPath: /tmp
  volumes:
    - name: shared-tmp
      emptyDir:
        mode: 01777
```

## Verifying the Features in Linux

To verify that these features are actively enforcing restrictions, you can run `kubectl exec` into the container. The following examples simulate attempts to perform actions that are successfully blocked by these features.

### Verifying noexec

Attempt to write and run a script on a volume mounted with `noexec`:

```shell
# 1. Exec into the pod
kubectl exec -it hardened-bindmount-pod -- sh

# 2. Create an executable script on the mounted volume
cd /tmp
echo '#!/bin/sh' > test.sh
echo 'echo "Executing untrusted code..."' >> test.sh
chmod +x test.sh

# 3. Attempt to run the script
./test.sh
```

Expected result:

```none
sh: ./test.sh: Permission denied
```

Even if an executable file is created, the Linux kernel refuses execution because `MS_NOEXEC` is enforced at the bind mount level.

### Verifying the Sticky Bit

Attempt to delete another user's file in an emptyDir with `01777` permission mode:

```shell
# 1. Exec into the pod
kubectl exec -it hardened-emptydir-pod -- sh

# 2. Verify directory permissions on /tmp
ls -ld /tmp
# Output: drwxrwxrwt 2 root root ... /tmp (Notice the 't' indicating sticky bit)

# 3. Create a file as the guest user
su -s /bin/sh -c "touch /tmp/guest_file" guest

# 4. Attempt to delete that file as nobody
su -s /bin/sh -c "rm /tmp/guest_file" nobody
```

Expected result:

```none
rm: can't remove '/tmp/guest_file': Operation not permitted
```

The kernel blocks deletion because the sticky bit (`01777`) restricts file removal strictly to the owner of the file.

## Things to Know

Keep these key details in mind as you begin using these features. Full details are available in the official documentation.

- **Default unchanged:** If you omit `bindMountOptions` or do not set an emptyDir `mode`, you get standard default behaviors (like `0777` permissions) exactly as before.
- **Broad volume support:** `bindMountOptions` works with emptyDir, PersistentVolumes, CSI volumes, projected volumes, configMaps, secrets, and more. The only exception is image volumes, which are explicitly unsupported. The `mode` field works with all emptyDir medium types: default (disk-backed), `Memory` (tmpfs), and `HugePages`.
- **Runtime capabilities matter (for bindMountOptions):** The container runtime must support the CRI `mount_options` field and advertise it via `runtimeFeatures`. The scheduler uses Node Declared Features to avoid placing pods on incompatible nodes. If a pod reaches such a node anyway, the kubelet rejects it. There is no silent degradation. EmptyDir `mode` does not require runtime support.
- **Not the same as PV mountOptions:** PersistentVolume `mountOptions` apply at the storage layer via the CSI driver. The new `bindMountOptions` controls bind mount flags applied inside the container by the runtime. They operate at different layers and do not conflict.
- **fsGroup interaction:** If `fsGroup` is set in the pod's security context, the group permissions applied by `fsGroup` will override the emptyDir `mode` specified. This is the same behavior that exists for `defaultMode` on Secret and ConfigMap volumes.
- **Linux only:** Flags like `noexec`, `nosuid`, `nodev`, and Unix permission modes are Linux concepts. `bindMountOptions` has no effect on Windows nodes. The emptyDir `mode` field is also skipped on Windows since Windows does not support Unix-style file permissions.
- **Version skew safety:** Both features are additive. For emptyDir `mode`: if the API server has the gate enabled but the kubelet does not, the field is accepted but ignored - the kubelet falls back to `0777`. For `bindMountOptions`: the scheduler uses Node Declared Features to prevent placing pods on nodes without runtime support; if a pod reaches such a node, the kubelet rejects it rather than silently ignoring the options.
- **Feature Gates:** Both capabilities are available as alpha features in Kubernetes v1.37:
  - `VolumeBindMountOptions`: Controls bind mount flags on volume mounts.
  - `EmptyDirVolumeMode`: Controls creation permission modes on emptyDir volumes.

## How Do I Get Involved?

These features are driven by [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md) and [SIG Storage](https://github.com/kubernetes/community/blob/master/sig-storage/README.md). You can find more details in the KEP tracking issues for [KEP-5855](https://github.com/kubernetes/enhancements/issues/5855) (bind mount options) and [KEP-5502](https://github.com/kubernetes/enhancements/issues/5502) (emptyDir permission mode).

Reach out to SIG Node:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

Reach out to SIG Storage:
- Slack: [#sig-storage](https://kubernetes.slack.com/messages/sig-storage)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-storage)

Contact us directly:
- GitHub: [@nispriha](https://github.com/nispriha) / [@ngopalak-redhat](https://github.com/ngopalak-redhat)
