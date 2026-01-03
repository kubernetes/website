---
layout: blog
title: "Forensic container checkpointing in Kubernetes"
date: 2022-12-05
slug: forensic-container-checkpointing-alpha
author: >
  Adrian Reber (Red Hat)
---

Forensic container checkpointing is based on [Checkpoint/Restore In
Userspace](https://criu.org/) (CRIU) and allows the creation of stateful copies
of a running container without the container knowing that it is being
checkpointed.  The copy of the container can be analyzed and restored in a
sandbox environment multiple times without the original container being aware
of it. Forensic container checkpointing was introduced as an alpha feature in
Kubernetes v1.25.

## How does it work?

With the help of CRIU it is possible to checkpoint and restore containers.
CRIU is integrated in runc, crun, CRI-O and containerd and forensic container
checkpointing as implemented in Kubernetes uses these existing CRIU
integrations.

## Why is it important?

With the help of CRIU and the corresponding integrations it is possible to get
all information and state about a running container on disk for later forensic
analysis. Forensic analysis might be important to inspect a suspicious
container without stopping or influencing it. If the container is really under
attack, the attacker might detect attempts to inspect the container. Taking a
checkpoint and analysing the container in a sandboxed environment offers the
possibility to inspect the container without the original container and maybe
attacker being aware of the inspection.

In addition to the forensic container checkpointing use case, it is also
possible to migrate a container from one node to another node without loosing
the internal state. Especially for stateful containers with long initialization
times restoring from a checkpoint might save time after a reboot or enable much
faster startup times.

## How do I use container checkpointing?

The feature is behind a [feature gate][container-checkpoint-feature-gate], so
make sure to enable the `ContainerCheckpoint` gate before you can use the new
feature.

The runtime must also support container checkpointing:

* containerd: support is currently under discussion. See containerd
  pull request [#6965][containerd-checkpoint-restore-pr] for more details.

* CRI-O: v1.25 has support for forensic container checkpointing.

[containerd-checkpoint-restore-pr]: https://github.com/containerd/containerd/pull/6965
[container-checkpoint-feature-gate]: https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/

### Usage example with CRI-O

To use forensic container checkpointing in combination with CRI-O, the runtime
needs to be started with the command-line option `--enable-criu-support=true`.
For Kubernetes, you need to run your cluster with the `ContainerCheckpoint`
feature gate enabled. As the checkpointing functionality is provided by CRIU it
is also necessary to install CRIU.  Usually runc or crun depend on CRIU and
therefore it is installed automatically.

It is also important to mention that at the time of writing the checkpointing functionality is
to be considered as an alpha level feature in CRI-O and Kubernetes and the
security implications are still under consideration.

Once containers and pods are running it is possible to create a checkpoint.
[Checkpointing](/docs/reference/node/kubelet-checkpoint-api/)
is currently only exposed on the **kubelet** level. To checkpoint a container,
you can run `curl` on the node where that container is running, and trigger a
checkpoint:

```shell
curl -X POST "https://localhost:10250/checkpoint/namespace/podId/container"
```

For a container named *counter* in a pod named *counters* in a namespace named
*default* the **kubelet** API endpoint is reachable at:

```shell
curl -X POST "https://localhost:10250/checkpoint/default/counters/counter"
```

For completeness the following `curl` command-line options are necessary to
have `curl` accept the *kubelet*'s self signed certificate and authorize the
use of the *kubelet* `checkpoint` API:

```shell
--insecure --cert /var/run/kubernetes/client-admin.crt --key /var/run/kubernetes/client-admin.key
```

Triggering this **kubelet** API will request the creation of a checkpoint from
CRI-O. CRI-O requests a checkpoint from your low-level runtime (for example,
`runc`). Seeing that request, `runc` invokes the `criu` tool
to do the actual checkpointing.

Once the checkpointing has finished the checkpoint should be available at
`/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`

You could then use that tar archive to restore the container somewhere else.

### Restore a checkpointed container outside of Kubernetes (with CRI-O) {#restore-checkpointed-container-standalone}

With the checkpoint tar archive it is possible to restore the container outside
of Kubernetes in a sandboxed instance of CRI-O. For better user experience
during restore, I recommend that you use the latest version of CRI-O from the
*main* CRI-O GitHub branch. If you're using CRI-O v1.25, you'll need to
manually create certain directories Kubernetes would create before starting the
container.

The first step to restore a container outside of Kubernetes is to create a pod sandbox
using *crictl*:
```shell
crictl runp pod-config.json
```

Then you can restore the previously checkpointed container into the newly created pod sandbox:
```shell
crictl create <POD_ID> container-config.json pod-config.json
```

Instead of specifying a container image in a registry in `container-config.json`
you need to specify the path to the checkpoint archive that you created earlier:
```json
{
  "metadata": {
      "name": "counter"
  },
  "image":{
      "image": "/var/lib/kubelet/checkpoints/<checkpoint-archive>.tar"
  }
}
```

Next, run `crictl start <CONTAINER_ID>` to start that container, and then a
copy of the previously checkpointed container should be running.

### Restore a checkpointed container within of Kubernetes {#restore-checkpointed-container-k8s}

To restore the previously checkpointed container directly in Kubernetes it is
necessary to convert the checkpoint archive into an image that can be pushed to
a registry.

One possible way to convert the local checkpoint archive consists of the
following steps with the help of [buildah](https://buildah.io/):
```shell
newcontainer=$(buildah from scratch)
buildah add $newcontainer /var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar /
buildah config --annotation=io.kubernetes.cri-o.annotations.checkpoint.name=<container-name> $newcontainer
buildah commit $newcontainer checkpoint-image:latest
buildah rm $newcontainer
```

The resulting image is not standardized and only works in combination with
CRI-O.  Please consider this image format as pre-alpha. There are ongoing
[discussions][image-spec-discussion] to standardize the format of checkpoint
images like this. Important to remember is that this not yet standardized image
format only works if CRI-O has been started with `--enable-criu-support=true`.
The security implications of starting CRI-O with CRIU support are not yet clear
and therefore the functionality as well as the image format should be used with
care.

Now, you'll need to push that image to a container image registry. For example:
```shell
buildah push localhost/checkpoint-image:latest container-image-registry.example/user/checkpoint-image:latest
```

To restore this checkpoint image (`container-image-registry.example/user/checkpoint-image:latest`), the
image needs to be listed in the specification for a Pod. Here's an example
manifest:
```yaml
apiVersion: v1
kind: Pod
metadata:
  namePrefix: example-
spec:
  containers:
  - name: <container-name>
    image: container-image-registry.example/user/checkpoint-image:latest
  nodeName: <destination-node>
```

Kubernetes schedules the new Pod onto a node. The kubelet on that node
instructs the container runtime (CRI-O in this example) to create and start a
container based on an image specified as `registry/user/checkpoint-image:latest`.
CRI-O detects that `registry/user/checkpoint-image:latest`
is a reference to checkpoint data rather than a container image. Then,
instead of the usual steps to create and start a container,
CRI-O fetches the checkpoint data and restores the container from that
specified checkpoint.

The application in that Pod would continue running as if the checkpoint had not been taken;
within the container, the application looks and behaves like any other container that had been
started normally and not restored from a checkpoint.

With these steps, it is possible to replace a Pod running on one node
with a new equivalent Pod that is running on a different node,
and without losing the state of the containers in that Pod.

[image-spec-discussion]: https://github.com/opencontainers/image-spec/issues/962

## How do I get involved?
You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

## Further reading

Please see the follow-up article [Forensic container
analysis][forensic-container-analysis] for details on how a container checkpoint
can be analyzed.

[forensic-container-analysis]: /blog/2023/03/10/forensic-container-analysis/
