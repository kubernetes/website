---
layout: blog
title: "CRI-O: Applying seccomp profiles from OCI registries"
date: 2024-03-07
slug: cri-o-seccomp-oci-artifacts
author: >
  Sascha Grunert
---

Seccomp stands for secure computing mode and has been a feature of the Linux
kernel since version 2.6.12. It can be used to sandbox the privileges of a
process, restricting the calls it is able to make from userspace into the
kernel. Kubernetes lets you automatically apply seccomp profiles loaded onto a
node to your Pods and containers.

But distributing those seccomp profiles is a major challenge in Kubernetes,
because the JSON files have to be available on all nodes where a workload can
possibly run. Projects like the [Security Profiles
Operator](https://sigs.k8s.io/security-profiles-operator) solve that problem by
running as a daemon within the cluster, which makes me wonder which part of that
distribution could be done by the [container
runtime](/docs/setup/production-environment/container-runtimes).

Runtimes usually apply the profiles from a local path, for example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: container
      image: nginx:1.25.3
      securityContext:
        seccompProfile:
          type: Localhost
          localhostProfile: nginx-1.25.3.json
```

The profile `nginx-1.25.3.json` has to be available in the root directory of the
kubelet, appended by the `seccomp` directory. This means the default location
for the profile on-disk would be `/var/lib/kubelet/seccomp/nginx-1.25.3.json`.
If the profile is not available, then runtimes will fail on container creation
like this:

```shell
kubectl get pods
```

```console
NAME   READY   STATUS                 RESTARTS   AGE
pod    0/1     CreateContainerError   0          38s
```

```shell
kubectl describe pod/pod | tail
```

```console
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason     Age                 From               Message
  ----     ------     ----                ----               -------
  Normal   Scheduled  117s                default-scheduler  Successfully assigned default/pod to 127.0.0.1
  Normal   Pulling    117s                kubelet            Pulling image "nginx:1.25.3"
  Normal   Pulled     111s                kubelet            Successfully pulled image "nginx:1.25.3" in 5.948s (5.948s including waiting)
  Warning  Failed     7s (x10 over 111s)  kubelet            Error: setup seccomp: unable to load local profile "/var/lib/kubelet/seccomp/nginx-1.25.3.json": open /var/lib/kubelet/seccomp/nginx-1.25.3.json: no such file or directory
  Normal   Pulled     7s (x9 over 111s)   kubelet            Container image "nginx:1.25.3" already present on machine
```

The major obstacle of having to manually distribute the `Localhost` profiles
will lead many end-users to fall back to `RuntimeDefault` or even running their
workloads as `Unconfined` (with disabled seccomp).

## CRI-O to the rescue

The Kubernetes container runtime [CRI-O](https://github.com/cri-o/cri-o)
provides various features using custom annotations. The v1.30 release
[adds](https://github.com/cri-o/cri-o/pull/7719) support for a new set of
annotations called `seccomp-profile.kubernetes.cri-o.io/POD` and
`seccomp-profile.kubernetes.cri-o.io/<CONTAINER>`. Those annotations allow you
to specify:

- a seccomp profile for a specific container, when used as:
  `seccomp-profile.kubernetes.cri-o.io/<CONTAINER>` (example:
  `seccomp-profile.kubernetes.cri-o.io/webserver:
'registry.example/example/webserver:v1'`)
- a seccomp profile for every container within a pod, when used without the
  container name suffix but the reserved name `POD`:
  `seccomp-profile.kubernetes.cri-o.io/POD`
- a seccomp profile for a whole container image, if the image itself contains
  the annotation `seccomp-profile.kubernetes.cri-o.io/POD` or
  `seccomp-profile.kubernetes.cri-o.io/<CONTAINER>`.

CRI-O will only respect the annotation if the runtime is configured to allow it,
as well as for workloads running as `Unconfined`. All other workloads will still
use the value from the `securityContext` with a higher priority.

The annotations alone will not help much with the distribution of the profiles,
but the way they can be referenced will! For example, you can now specify
seccomp profiles like regular container images by using OCI artifacts:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
  annotations:
    seccomp-profile.kubernetes.cri-o.io/POD: quay.io/crio/seccomp:v2
spec: …
```

The image `quay.io/crio/seccomp:v2` contains a `seccomp.json` file, which
contains the actual profile content. Tools like [ORAS](https://oras.land) or
[Skopeo](https://github.com/containers/skopeo) can be used to inspect the
contents of the image:

```shell
oras pull quay.io/crio/seccomp:v2
```

```console
Downloading 92d8ebfa89aa seccomp.json
Downloaded  92d8ebfa89aa seccomp.json
Pulled [registry] quay.io/crio/seccomp:v2
Digest: sha256:f0205dac8a24394d9ddf4e48c7ac201ca7dcfea4c554f7ca27777a7f8c43ec1b
```

```shell
jq . seccomp.json | head
```

```yaml
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "defaultErrno": "ENOSYS",
  "archMap": [
    {
      "architecture": "SCMP_ARCH_X86_64",
      "subArchitectures": [
        "SCMP_ARCH_X86",
        "SCMP_ARCH_X32"
```

```shell
# Inspect the plain manifest of the image
skopeo inspect --raw docker://quay.io/crio/seccomp:v2 | jq .
```

```yaml
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config":
    {
      "mediaType": "application/vnd.cncf.seccomp-profile.config.v1+json",
      "digest": "sha256:ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356",
      "size": 3,
    },
  "layers":
    [
      {
        "mediaType": "application/vnd.oci.image.layer.v1.tar",
        "digest": "sha256:92d8ebfa89aa6dd752c6443c27e412df1b568d62b4af129494d7364802b2d476",
        "size": 18853,
        "annotations": { "org.opencontainers.image.title": "seccomp.json" },
      },
    ],
  "annotations": { "org.opencontainers.image.created": "2024-02-26T09:03:30Z" },
}
```

The image manifest contains a reference to a specific required config media type
(`application/vnd.cncf.seccomp-profile.config.v1+json`) and a single layer
(`application/vnd.oci.image.layer.v1.tar`) pointing to the `seccomp.json` file.
But now, let's give that new feature a try!

### Using the annotation for a specific container or whole pod

CRI-O needs to be configured adequately before it can utilize the annotation. To
do this, add the annotation to the `allowed_annotations` array for the runtime.
This can be done by using a drop-in configuration
`/etc/crio/crio.conf.d/10-crun.conf` like this:

```toml
[crio.runtime]
default_runtime = "crun"

[crio.runtime.runtimes.crun]
allowed_annotations = [
    "seccomp-profile.kubernetes.cri-o.io",
]
```

Now, let's run CRI-O from the latest `main` commit. This can be done by either
building it from source, using the [static binary bundles](https://github.com/cri-o/packaging?tab=readme-ov-file#using-the-static-binary-bundles-directly)
or [the prerelease packages](https://github.com/cri-o/packaging?tab=readme-ov-file#usage).

To demonstrate this, I ran the `crio` binary from my command line using a single
node Kubernetes cluster via [`local-up-cluster.sh`](https://github.com/cri-o/cri-o?tab=readme-ov-file#running-kubernetes-with-cri-o).
Now that the cluster is up and running, let's try a pod without the annotation
running as seccomp `Unconfined`:

```shell
cat pod.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: container
      image: nginx:1.25.3
      securityContext:
        seccompProfile:
          type: Unconfined
```

```shell
kubectl apply -f pod.yaml
```

The workload is up and running:

```shell
kubectl get pods
```

```console
NAME   READY   STATUS    RESTARTS   AGE
pod    1/1     Running   0          15s
```

And no seccomp profile got applied if I inspect the container using
[`crictl`](https://sigs.k8s.io/cri-tools):

```shell
export CONTAINER_ID=$(sudo crictl ps --name container -q)
sudo crictl inspect $CONTAINER_ID | jq .info.runtimeSpec.linux.seccomp
```

```console
null
```

Now, let's modify the pod to apply the profile `quay.io/crio/seccomp:v2` to the
container:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
  annotations:
    seccomp-profile.kubernetes.cri-o.io/container: quay.io/crio/seccomp:v2
spec:
  containers:
    - name: container
      image: nginx:1.25.3
```

I have to delete and recreate the Pod, because only recreation will apply a new
seccomp profile:

```shell
kubectl delete pod/pod
```

```console
pod "pod" deleted
```

```shell
kubectl apply -f pod.yaml
```

```console
pod/pod created
```

The CRI-O logs will now indicate that the runtime pulled the artifact:

```console
WARN[…] Allowed annotations are specified for workload [seccomp-profile.kubernetes.cri-o.io]
INFO[…] Found container specific seccomp profile annotation: seccomp-profile.kubernetes.cri-o.io/container=quay.io/crio/seccomp:v2  id=26ddcbe6-6efe-414a-88fd-b1ca91979e93 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Pulling OCI artifact from ref: quay.io/crio/seccomp:v2  id=26ddcbe6-6efe-414a-88fd-b1ca91979e93 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Retrieved OCI artifact seccomp profile of len: 18853  id=26ddcbe6-6efe-414a-88fd-b1ca91979e93 name=/runtime.v1.RuntimeService/CreateContainer
```

And the container is finally using the profile:

```shell
export CONTAINER_ID=$(sudo crictl ps --name container -q)
sudo crictl inspect $CONTAINER_ID | jq .info.runtimeSpec.linux.seccomp | head
```

```yaml
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "architectures": [
    "SCMP_ARCH_X86_64",
    "SCMP_ARCH_X86",
    "SCMP_ARCH_X32"
  ],
  "syscalls": [
    {
```

The same would work for every container in the pod, if users replace the
`/container` suffix with the reserved name `/POD`, for example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
  annotations:
    seccomp-profile.kubernetes.cri-o.io/POD: quay.io/crio/seccomp:v2
spec:
  containers:
    - name: container
      image: nginx:1.25.3
```

### Using the annotation for a container image

While specifying seccomp profiles as OCI artifacts on certain workloads is a
cool feature, the majority of end users would like to link seccomp profiles to
published container images. This can be done by using a container image
annotation; instead of being applied to a Kubernetes Pod, the annotation is some
metadata applied at the container image itself. For example,
[Podman](https://podman.io) can be used to add the image annotation directly
during image build:

```shell
podman build \
    --annotation seccomp-profile.kubernetes.cri-o.io=quay.io/crio/seccomp:v2 \
    -t quay.io/crio/nginx-seccomp:v2 .
```

The pushed image then contains the annotation:

```shell
skopeo inspect --raw docker://quay.io/crio/nginx-seccomp:v2 |
    jq '.annotations."seccomp-profile.kubernetes.cri-o.io"'
```

```console
"quay.io/crio/seccomp:v2"
```

If I now use that image in an CRI-O test pod definition:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
  # no Pod annotations set
spec:
  containers:
    - name: container
      image: quay.io/crio/nginx-seccomp:v2
```

Then the CRI-O logs will indicate that the image annotation got evaluated and
the profile got applied:

```shell
kubectl delete pod/pod
```

```console
pod "pod" deleted
```

```shell
kubectl apply -f pod.yaml
```

```console
pod/pod created
```

```console
INFO[…] Found image specific seccomp profile annotation: seccomp-profile.kubernetes.cri-o.io=quay.io/crio/seccomp:v2  id=c1f22c59-e30e-4046-931d-a0c0fdc2c8b7 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Pulling OCI artifact from ref: quay.io/crio/seccomp:v2  id=c1f22c59-e30e-4046-931d-a0c0fdc2c8b7 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Retrieved OCI artifact seccomp profile of len: 18853  id=c1f22c59-e30e-4046-931d-a0c0fdc2c8b7 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Created container 116a316cd9a11fe861dd04c43b94f45046d1ff37e2ed05a4e4194fcaab29ee63: default/pod/container  id=c1f22c59-e30e-4046-931d-a0c0fdc2c8b7 name=/runtime.v1.RuntimeService/CreateContainer
```

```shell
export CONTAINER_ID=$(sudo crictl ps --name container -q)
sudo crictl inspect $CONTAINER_ID | jq .info.runtimeSpec.linux.seccomp | head
```

```yaml
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "architectures": [
    "SCMP_ARCH_X86_64",
    "SCMP_ARCH_X86",
    "SCMP_ARCH_X32"
  ],
  "syscalls": [
    {
```

For container images, the annotation `seccomp-profile.kubernetes.cri-o.io` will
be treated in the same way as `seccomp-profile.kubernetes.cri-o.io/POD` and
applies to the whole pod. In addition to that, the whole feature also works when
using the container specific annotation on an image, for example if a container
is named `container1`:

```shell
skopeo inspect --raw docker://quay.io/crio/nginx-seccomp:v2-container |
    jq '.annotations."seccomp-profile.kubernetes.cri-o.io/container1"'
```

```console
"quay.io/crio/seccomp:v2"
```

The cool thing about this whole feature is that users can now create seccomp
profiles for specific container images and store them side by side in the same
registry. Linking the images to the profiles provides a great flexibility to
maintain them over the whole application's life cycle.

### Pushing profiles using ORAS

The actual creation of the OCI object that contains a seccomp profile requires a
bit more work when using ORAS. I have the hope that tools like Podman will
simplify the overall process in the future. Right now, the container registry
needs to be [OCI compatible](https://oras.land/docs/compatible_oci_registries/#registries-supporting-oci-artifacts),
which is also the case for [Quay.io](https://quay.io). CRI-O expects the seccomp
profile object to have a container image media type
(`application/vnd.cncf.seccomp-profile.config.v1+json`), while ORAS uses
`application/vnd.oci.empty.v1+json` per default. To achieve all of that, the
following commands can be executed:

```shell
echo "{}" > config.json
oras push \
    --config config.json:application/vnd.cncf.seccomp-profile.config.v1+json \
     quay.io/crio/seccomp:v2 seccomp.json
```

The resulting image contains the `mediaType` that CRI-O expects. ORAS pushes a
single layer `seccomp.json` to the registry. The name of the profile does not
matter much. CRI-O will pick the first layer and check if that can act as a
seccomp profile.

## Future work

CRI-O internally manages the OCI artifacts like regular files. This provides the
benefit of moving them around, removing them if not used any more or having any
other data available than seccomp profiles. This enables future enhancements in
CRI-O on top of OCI artifacts, but also allows thinking about stacking seccomp
profiles as part of having multiple layers in an OCI artifact. The limitation
that it only works for `Unconfined` workloads for v1.30.x releases is something
different CRI-O would like to address in the future. Simplifying the overall
user experience by not compromising security seems to be the key for a
successful future of seccomp in container workloads.

The CRI-O maintainers will be happy to listen to any feedback or suggestions on
the new feature! Thank you for reading this blog post, feel free to reach out
to the maintainers via the Kubernetes [Slack channel #crio](https://kubernetes.slack.com/messages/CAZH62UR1)
or create an issue in the [GitHub repository](https://github.com/cri-o/cri-o).
