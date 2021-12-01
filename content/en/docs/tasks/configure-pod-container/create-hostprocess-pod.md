---
title: Create a Windows HostProcess Pod
content_type: task
weight: 20
min-kubernetes-server-version: 1.22
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

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
log onto each Window node. HostProcess containers can run as any user that is
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
[volume mounts](./create-hostprocess-pod#volume-mounts) within the container volume.

### When should I use a Windows HostProcess container?

- When you need to perform tasks which require the networking namespace of the host.
HostProcess containers have access to the host's network interfaces and IP addresses.
- You need access to resources on the host such as the filesystem, event logs, etc.
- Installation of specific device drivers or Windows services.
- Consolidation of administrative tasks and security policies. This reduces the degree of
privileges needed by Windows nodes.


## {{% heading "prerequisites" %}}% version-check %}}

To enable HostProcess containers while in Alpha you need to
pass the following feature gate flag to
**kubelet** and **kube-apiserver**.
See [Features Gates](/docs/reference/command-line-tools-reference/feature-gates/#overview) 
documentation for more details.

```powershell
--feature-gates=WindowsHostProcessContainers=true
```

The kubelet will communicate with containerd directly by
passing the hostprocess flag via CRI. You can use the
latest version of containerd (v1.6+) to run HostProcess containers.
[How to install containerd.](/docs/setup/production-environment/container-runtimes/#containerd)

## Limitations

- HostProcess containers require containerd 1.6 or higher
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
- As of v1.22 HostProcess pods can only contain HostProcess containers. This is a current limitation
of the Windows OS; non-privileged Windows containers cannot share a vNIC with the host IP namespace.
- HostProcess containers run as a process on the host and do not have any degree of
isolation other than resource constraints imposed on the HostProcess user account. Neither
filesystem or Hyper-V isolation are supported for HostProcess containers.
- Volume mounts are supported and are mounted under the container volume. See [Volume Mounts](#volume-mounts)
- A limited set of host user accounts are available for HostProcess containers by default.
See [Choosing a User Account](#choosing-a-user-account).
- Resource limits (disk, memory, cpu count) are supported in the same fashion as processes
on the host.
- Both Named pipe mounts and Unix domain sockets are **not** currently supported and should instead
be accessed via their path on the host (e.g. \\\\.\\pipe\\\*)

## HostProcess Pod configuration requirements

Enabling a Windows HostProcess pod requires setting the right configurations in the pod security
configuration. Of the policies defined in the [Pod Security Standards](/docs/concepts/security/pod-security-standards)
HostProcess pods are disallowed by the baseline and restricted policies. It is therefore recommended
that HostProcess pods run in alignment with the privileged profile.

When running under the privileged policy, here are
the configurations which need to be set to enable the creation of a HostProcess pod:

<table>
	<caption style="display:none">Privileged policy specification</caption>
	<tbody>
		<tr>
			<td><strong>Control</strong></td>
			<td><strong>Policy</strong></td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards">Windows HostProcess</a></td>
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
			<td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards">Host Networking</a></td>
			<td>
				<p>Will be in host network by default initially. Support 
				to set network to a different compartment may be desirable in 
				the future.</p>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
			</td>
		</tr>
    <tr>
			<td style="white-space: nowrap"><a href="/docs/tasks/configure-pod-container/configure-runasusername/">runAsUsername</a></td>
			<td>
				<p>Specification of which user the HostProcess container should run as is required for the pod spec.</p>
				<p><strong>Allowed Values</strong></p>
				<ul>
          			<li><code>NT AUTHORITY\SYSTEM</code></li>
					<li><code>NT AUTHORITY\Local service</code></li>
					<li><code>NT AUTHORITY\NetworkService</code></li>
				</ul>
			</td>
		</tr>
    <tr>
			<td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards">runAsNonRoot</a></td>
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

### Example Manifest (excerpt)

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

## Volume Mounts

HostProcess containers support the ability to mount volumes within the container volume space.
Applications running inside the container can access volume mounts directly via relative or
absolute paths. An environment variable `$CONTAINER_SANDBOX_MOUNT_POINT` is set upon container
creation and provides the absolute host path to the container volume. Relative paths are based
upon the `Pod.containers.volumeMounts.mountPath` configuration.

### Example {#volume-mount-example}

To access service account tokens the following path structures are supported within the container:

`.\var\run\secrets\kubernetes.io\serviceaccount\`

`$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

## Resource Limits

Resource limits (disk, memory, cpu count) are applied to the job and are job wide.
For example, with a limit of 10MB set, the memory allocated for any HostProcess job object
will be capped at 10MB. This is the same behavior as other Windows container types.
These limits would be specified the same way they are currently for whatever orchestrator
or runtime is being used. The only difference is in the disk resource usage calculation
used for resource tracking due to the difference in how HostProcess containers are bootstrapped.

## Choosing a User Account

HostProcess containers support the ability to run as one of three supported Windows service accounts:

- **[LocalSystem](https://docs.microsoft.com/windows/win32/services/localsystem-account)**
- **[LocalService](https://docs.microsoft.com/windows/win32/services/localservice-account)**
- **[NetworkService](https://docs.microsoft.com/windows/win32/services/networkservice-account)**

You should select an appropriate Windows service account for each HostProcess
container, aiming to limit the degree of privileges so as to avoid accidental (or even
malicious) damage to the host. The LocalSystem service account has the highest level
of privilege of the three and should be used only if absolutely necessary. Where possible,
use the LocalService service account as it is the least privileged of the three options.
