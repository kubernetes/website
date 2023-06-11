---
title: Mapping from dockercli to crictl
content_type: reference
weight: 10
---

{{% thirdparty-content %}}

`crictl` is a command-line interface for {{<glossary_tooltip term_id="cri" text="CRI">}}-compatible container runtimes.
You can use it to inspect and debug container runtimes and applications on a
Kubernetes node. `crictl` and its source are hosted in the
[cri-tools](https://github.com/kubernetes-sigs/cri-tools) repository.

This page provides a reference for mapping common commands for the `docker`
command-line tool into the equivalent commands for `crictl`.

## Mapping from docker CLI to crictl

The exact versions for the mapping table are for `docker` CLI v1.40 and `crictl`
v1.19.0. This list is not exhaustive. For example, it doesn't include
experimental `docker` CLI commands.

{{< note >}}
The output format of `crictl` is similar to `docker` CLI, despite some missing
columns for some CLI. Make sure to check output for the specific command if your
command output is being parsed programmatically.
{{< /note >}}

### Retrieve debugging information

{{< table caption="mapping from docker cli to crictl - retrieve debugging information" >}}
docker cli | crictl | Description | Unsupported Features
-- | -- | -- | --
`attach` | `attach` | Attach to a running container | `--detach-keys`, `--sig-proxy`
`exec` | `exec` | Run a command in a running container | `--privileged`, `--user`, `--detach-keys`
`images` | `images` | List images |  
`info` | `info` | Display system-wide information |  
`inspect` | `inspect`, `inspecti` | Return low-level information on a container, image or task |  
`logs` | `logs` | Fetch the logs of a container | `--details`
`ps` | `ps` | List containers |  
`stats` | `stats` | Display a live stream of container(s) resource usage statistics | Column: NET/BLOCK I/O, PIDs
`version` | `version` | Show the runtime (Docker, ContainerD, or others) version information |  
{{< /table >}}

### Perform Changes

{{< table caption="mapping from docker cli to crictl - perform changes" >}}
docker cli | crictl | Description | Unsupported Features
-- | -- | -- | --
`create` | `create` | Create a new container |  
`kill` | `stop` (timeout = 0) | Kill one or more running container | `--signal`
`pull` | `pull` | Pull an image or a repository from a registry | `--all-tags`, `--disable-content-trust`
`rm` | `rm` | Remove one or more containers |  
`rmi` | `rmi` | Remove one or more images |  
`run` | `run` | Run a command in a new container |  
`start` | `start` | Start one or more stopped containers | `--detach-keys`
`stop` | `stop` | Stop one or more running containers |  
`update` | `update` | Update configuration of one or more containers | `--restart`, `--blkio-weight` and some other resource limit not supported by CRI.
{{< /table >}}

### Supported only in crictl

{{< table caption="mapping from docker cli to crictl - supported only in crictl" >}}
crictl | Description
-- | --
`imagefsinfo` | Return image filesystem info
`inspectp` | Display the status of one or more pods
`port-forward` | Forward local port to a pod
`pods` | List pods
`runp` | Run a new pod
`rmp` | Remove one or more pods
`stopp` | Stop one or more running pods
{{< /table >}}
