---
title: Migrating telemetry and security agents from dockershim
content_type: task 
reviewers:
- SergeyKanzhelev
weight: 70
---

<!-- overview -->

Kubernetes' support for direct integration with Docker Engine is deprecated, and will be removed. Most apps do not have a direct dependency on runtime hosting containers. However, there are still a lot of telemetry and monitoring agents that has a dependency on docker to collect containers metadata, logs and metrics. This document aggregates information on how to detect these dependencies and links on how to migrate these agents to use generic tools or alternative runtimes.

## Telemetry and security agents

Within a Kubernetes cluster there are a few different ways to run telemetry or security agents.
Some agents have a direct dependency on Docker Engine when they run as DaemonSets or
directly on nodes.

### Why do some telemetry agents communicate with Docker Engine?

Historically, Kubernetes was written to work specifically with Docker Engine.
Kubernetes took care of networking and scheduling, relying on Docker Engine for launching
and running containers (within Pods) on a node. Some information that is relevant to telemetry,
such as a pod name, is only available from Kubernetes components. Other data, such as container
metrics, is not the responsibility of the container runtime. Early telemetry agents needed to query the
container runtime **and** Kubernetes to report an accurate picture. Over time, Kubernetes gained
the ability to support multiple runtimes, and now supports any runtime that is compatible with
the container runtime interface.

Some telemetry agents rely specifically on Docker Engine tooling. For example, an agent
might run a command such as
[`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)
or [`docker top`](https://docs.docker.com/engine/reference/commandline/top/) to list
containers and processes or [`docker logs`](https://docs.docker.com/engine/reference/commandline/logs/)
to receive streamed logs. If nodes in your existing cluster use
Docker Engine, and you switch to a different container runtime,
these commands will not work any longer.

### Identify DaemonSets that depend on Docker Engine {#identify-docker-dependency}

If a pod wants to make calls to the `dockerd` running on the node, the pod must either:

- mount the filesystem containing the Docker daemon's privileged socket, as a
  {{< glossary_tooltip text="volume" term_id="volume" >}}; or
- mount the specific path of the Docker daemon's privileged socket directly, also as a volume.

For example: on COS images, Docker exposes its Unix domain socket at
`/var/run/docker.sock` This means that the pod spec will include a
`hostPath` volume mount of `/var/run/docker.sock`.

Here's a sample shell script to find Pods that have a mount directly mapping the
Docker socket. This script outputs the namespace and name of the pod. You can
remove the `grep '/var/run/docker.sock'` to review other mounts.

```bash
kubectl get pods --all-namespaces \
-o=jsonpath='{range .items[*]}{"\n"}{.metadata.namespace}{":\t"}{.metadata.name}{":\t"}{range .spec.volumes[*]}{.hostPath.path}{", "}{end}{end}' \
| sort \
| grep '/var/run/docker.sock'
```

{{< note >}}
There are alternative ways for a pod to access Docker on the host. For instance, the parent
directory `/var/run` may be mounted instead of the full path (like in [this
example](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)).
The script above only detects the most common uses.
{{< /note >}}

### Detecting Docker dependency from node agents

In case your cluster nodes are customized and install additional security and
telemetry agents on the node, make sure to check with the vendor of the agent whether it has dependency on Docker.

### Telemetry and security agent vendors

We keep the work in progress version of migration instructions for various telemetry and security agent vendors
in [Google doc](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#).
Please contact the vendor to get up to date instructions for migrating from dockershim.

