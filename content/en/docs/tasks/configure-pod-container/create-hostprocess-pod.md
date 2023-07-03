---
title: Create a Windows HostProcess Pod
content_type: task
weight: 50
min-kubernetes-server-version: 1.23
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Windows HostProcess containers enable you to run containerized
workloads on a Windows host. These containers operate as
normal processes but have access to the host network namespace,
storage, and devices when given the appropriate user privileges.
HostProcess containers can be used to deploy network plugins,
storage configurations, device plugins, kube-proxy, and other
components to Windows nodes without the need for dedicated proxies or
the direct installation of host services.

Administrative tasks such as installation of security patches, event
log collection, and more can be performed without requiring cluster operators to
log onto each Windows node. HostProcess containers can run as any user that is
available on the host or is in the domain of the host machine, allowing administrators
to restrict resource access through user permissions. While neither filesystem or process
isolation are supported, a new volume is created on the host upon starting the container
to give it a clean and consolidated workspace. HostProcess containers can also be built on
top of existing Windows base images and do not inherit the same
[compatibility requirements](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility)
as Windows server containers, meaning that the version of the base images does not need
to match that of the host. It is, however, recommended that you use the same base image
version as your Windows Server container workloads to ensure you do not have any unused
images taking up space on the node. HostProcess containers also support
[volume mounts](#volume-mounts) within the container volume.

### When should I use a Windows HostProcess container?

- When you need to perform tasks which require the networking namespace of the host.
HostProcess containers have access to the host's network interfaces and IP addresses.
- You need access to resources on the host such as the filesystem, event logs, etc.
- Installation of specific device drivers or Windows services.
- Consolidation of administrative tasks and security policies. This reduces the degree of
privileges needed by Windows nodes.

## {{% heading "prerequisites" %}}

<!-- change this when graduating to stable -->

This task guide is specific to Kubernetes v{{< skew currentVersion >}}.
If you are not running Kubernetes v{{< skew currentVersion >}}, check the documentation for
that version of Kubernetes.

In Kubernetes {{< skew currentVersion >}}, the HostProcess container feature is enabled by default. The kubelet will
communicate with containerd directly by passing the hostprocess flag via CRI. You can use the
latest version of containerd (v1.6+) to run HostProcess containers.
[How to install containerd.](/docs/setup/production-environment/container-runtimes/#containerd)

## Limitations

These limitations are relevant for Kubernetes v{{< skew currentVersion >}}:

- HostProcess containers require containerd 1.6 or higher
  {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} and
  containerd 1.7 is recommended.
- HostProcess pods can only contain HostProcess containers. This is a current limitation
  of the Windows OS; non-privileged Windows containers cannot share a vNIC with the host IP namespace.
- HostProcess containers run as a process on the host and do not have any degree of
  isolation other than resource constraints imposed on the HostProcess user account. Neither
  filesystem or Hyper-V isolation are supported for HostProcess containers.
- Volume mounts are supported and are mounted under the container volume. See
  [Volume Mounts](#volume-mounts)
- A limited set of host user accounts are available for HostProcess containers by default.
  See [Choosing a User Account](#choosing-a-user-account).
- Resource limits (disk, memory, cpu count) are supported in the same fashion as processes
  on the host.
- Both Named pipe mounts and Unix domain sockets are **not** supported and should instead
  be accessed via their path on the host (e.g. \\\\.\\pipe\\\*)

## HostProcess Pod configuration requirements

Enabling a Windows HostProcess pod requires setting the right configurations in the pod security
configuration. Of the policies defined in the [Pod Security Standards](/docs/concepts/security/pod-security-standards)
HostProcess pods are disallowed by the baseline and restricted policies. It is therefore recommended
that HostProcess pods run in alignment with the privileged profile.

When running under the privileged policy, here are
the configurations which need to be set to enable the creation of a HostProcess pod:

<table>
  <caption style="display: none">Privileged policy specification</caption>
  <thead>
    <tr>
      <th>Control</th>
      <th>Policy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards"><tt>securityContext.windowsOptions.hostProcess</tt></a></td>
      <td>
        <p>Windows pods offer the ability to run <a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">
        HostProcess containers</a> which enables privileged access to the Windows node. </p>
        <p><strong>Allowed Values</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards"><tt>hostNetwork</tt></a></td>
      <td>
        <p>Pods container HostProcess containers must use the host's network namespace.</p>
        <p><strong>Allowed Values</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/docs/tasks/configure-pod-container/configure-runasusername/"><tt>securityContext.windowsOptions.runAsUserName</tt></a></td>
      <td>
        <p>Specification of which user the HostProcess container should run as is required for the pod spec.</p>
        <p><strong>Allowed Values</strong></p>
        <ul>
          <li><code>NT AUTHORITY\SYSTEM</code></li>
          <li><code>NT AUTHORITY\Local service</code></li>
          <li><code>NT AUTHORITY\NetworkService</code></li>
          <li>Local usergroup names (see below)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards"><tt>runAsNonRoot</tt></a></td>
      <td>
        <p>Because HostProcess containers have privileged access to the host, the <tt>runAsNonRoot</tt> field cannot be set to true.</p>
        <p><strong>Allowed Values</strong></p>
        <ul>
          <li>Undefined/Nil</li>
          <li><code>false</code></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### Example manifest (excerpt) {#manifest-example}

```yaml
spec:
  securityContext:
    windowsOptions:
      hostProcess: true
      runAsUserName: "NT AUTHORITY\\Local service"
  hostNetwork: true
  containers:
  - name: test
    image: image1:latest
    command:
      - ping
      - -t
      - 127.0.0.1
  nodeSelector:
    "kubernetes.io/os": windows
```

## Volume mounts

HostProcess containers support the ability to mount volumes within the container volume space.
Volume mount behavior differs depending on the version of containerd runtime used by on the node.

### Containerd v1.6

Applications running inside the container can access volume mounts directly via relative or
absolute paths. An environment variable `$CONTAINER_SANDBOX_MOUNT_POINT` is set upon container
creation and provides the absolute host path to the container volume. Relative paths are based
upon the `.spec.containers.volumeMounts.mountPath` configuration.

To access service account tokens (for example) the following path structures are supported within the container:

- `.\var\run\secrets\kubernetes.io\serviceaccount\`
- `$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

### Containerd v1.7 (and greater)

Applications running inside the container can access volume mounts directly via the volumeMount's
specified `mountPath` (just like Linux and non-HostProcess Windows containers).

For backwards compatibility volumes can also be accessed via using the same relative paths configured
by containerd v1.6.

As an example, to access service account tokens within the container you would use one of the following paths:

- `c:\var\run\secrets\kubernetes.io\serviceaccount`
- `/var/run/secrets/kubernetes.io/serviceaccount/`
- `$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

## Resource limits

Resource limits (disk, memory, cpu count) are applied to the job and are job wide.
For example, with a limit of 10MB set, the memory allocated for any HostProcess job object
will be capped at 10MB. This is the same behavior as other Windows container types.
These limits would be specified the same way they are currently for whatever orchestrator
or runtime is being used. The only difference is in the disk resource usage calculation
used for resource tracking due to the difference in how HostProcess containers are bootstrapped.

## Choosing a user account

### System accounts

By default, HostProcess containers support the ability to run as one of three supported Windows service accounts:

- **[LocalSystem](https://docs.microsoft.com/windows/win32/services/localsystem-account)**
- **[LocalService](https://docs.microsoft.com/windows/win32/services/localservice-account)**
- **[NetworkService](https://docs.microsoft.com/windows/win32/services/networkservice-account)**

You should select an appropriate Windows service account for each HostProcess
container, aiming to limit the degree of privileges so as to avoid accidental (or even
malicious) damage to the host. The LocalSystem service account has the highest level
of privilege of the three and should be used only if absolutely necessary. Where possible,
use the LocalService service account as it is the least privileged of the three options.

### Local accounts {#local-accounts}

If configured, HostProcess containers can also run as local user accounts which allows for node operators to give
fine-grained access to workloads.

To run HostProcess containers as a local user; A local usergroup must first be created on the node
and the name of that local usergroup must be specified in the `runAsUserName` field in the deployment.
Prior to initializing the HostProcess container, a new **ephemeral** local user account to be created and joined to the specified usergroup, from which the container is run.
This provides a number a benefits including eliminating the need to manage passwords for local user accounts.
An initial HostProcess container running as a service account can be used to
prepare the user groups for later HostProcess containers.

{{< note >}}
Running HostProcess containers as local user accounts requires containerd v1.7+
{{< /note >}}

Example:

1. Create a local user group on the node (this can be done in another HostProcess container).

    ```cmd
    net localgroup hpc-localgroup /add
    ```

1. Grant access to desired resources on the node to the local usergroup.
   This can be done with tools like [icacls](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls).

1. Set `runAsUserName` to the name of the local usergroup for the pod or individual containers.

    ```yaml
    securityContext:
      windowsOptions:
        hostProcess: true
        runAsUserName: hpc-localgroup
    ```

1. Schedule the pod!

## Base Image for HostProcess Containers

HostProcess containers can be built from any of the existing [Windows Container base images](https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images).

Additionally a new base mage has been created just for HostProcess containers!
For more information please check out the [windows-host-process-containers-base-image github project](https://github.com/microsoft/windows-host-process-containers-base-image#overview).

## Troubleshooting HostProcess containers

- HostProcess containers fail to start with `failed to create user process token: failed to logon user: Access is denied.: unknown`

  Ensure containerd is running as `LocalSystem` or `LocalService` service accounts. User accounts (even Administrator accounts) do not have permissions to create logon tokens for any of the supported [user accounts](#choosing-a-user-account).
  
