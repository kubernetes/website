---
reviewers:
- erictune
- thockin
title: Images
content_type: concept
weight: 10
---

<!-- overview -->

A container image represents binary data that encapsulates an application and all its
software dependencies. Container images are executable software bundles that can run
standalone and that make very well defined assumptions about their runtime environment.

You typically create a container image of your application and push it to a registry
before referring to it in a
{{< glossary_tooltip text="Pod" term_id="pod" >}}

This page provides an outline of the container image concept.

<!-- body -->

## Image names

Container images are usually given a name such as `pause`, `example/mycontainer`, or `kube-apiserver`.
Images can also include a registry hostname; for example: `fictional.registry.example/imagename`,
and possibly a port number as well; for example: `fictional.registry.example:10443/imagename`.

If you don't specify a registry hostname, Kubernetes assumes that you mean the Docker public registry.

After the image name part you can add a _tag_ (as also using with commands such
as `docker` and `podman`).
Tags let you identify different versions of the same series of images.

Image tags consist of lowercase and uppercase letters, digits, underscores (`_`),
periods (`.`), and dashes (`-`).  
There are additional rules about where you can place the separator
characters (`_`, `-`, and `.`) inside an image tag.  
If you don't specify a tag, Kubernetes assumes you mean the tag `latest`.

## Updating images

When you first create a {{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod, or other
object that includes a Pod template, then by default the pull policy of all
containers in that pod will be set to `IfNotPresent` if it is not explicitly
specified. This policy causes the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} to skip pulling an
image if it already exists.

### Image pull policy

The `imagePullPolicy` for a container and the tag of the image affect when the
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) attempts to pull (download) the specified image.

Here's a list of the values you can set for `imagePullPolicy` and the effects
these values have:

`IfNotPresent`
: the image is pulled only if it is not already present locally.

`Always`
: every time the kubelet launches a container, the kubelet queries the container
  image registry to resolve the name to an image
  [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier). If the kubelet has a
  container image with that exact digest cached locally, the kubelet uses its cached
  image; otherwise, the kubelet pulls the image with the resolved digest,
  and uses that image to launch the container.

`Never`
: the kubelet does not try fetching the image. If the image is somehow already present
  locally, the kubelet attempts to start the container; otherwise, startup fails.
  See [pre-pulled images](#pre-pulled-images) for more details.

The caching semantics of the underlying image provider make even
`imagePullPolicy: Always` efficient, as long as the registry is reliably accessible.
Your container runtime can notice that the image layers already exist on the node
so that they don't need to be downloaded again.

{{< note >}}
You should avoid using the `:latest` tag when deploying containers in production as
it is harder to track which version of the image is running and more difficult to
roll back properly.

Instead, specify a meaningful tag such as `v1.42.0`.
{{< /note >}}

To make sure the Pod always uses the same version of a container image, you can specify
the image's digest;
replace `<image-name>:<tag>` with `<image-name>@<digest>`
(for example, `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`).

When using image tags, if the image registry were to change the code that the tag on that image represents, you might end up with a mix of Pods running the old and new code. An image digest uniquely identifies a specific version of the image, so Kubernetes runs the same code every time it starts a container with that image name and digest specified. Specifying an image fixes the code that you run so that a change at the registry cannot lead to that mix of versions.

There are third-party [admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
that mutate Pods (and pod templates) when they are created, so that the
running workload is defined based on an image digest rather than a tag.
That might be useful if you want to make sure that all your workload is
running the same code no matter what tag changes happen at the registry.

#### Default image pull policy {#imagepullpolicy-defaulting}

When you (or a controller) submit a new Pod to the API server, your cluster sets the
`imagePullPolicy` field when specific conditions are met:

- if you omit the `imagePullPolicy` field, and the tag for the container image is
  `:latest`, `imagePullPolicy` is automatically set to `Always`;
- if you omit the `imagePullPolicy` field, and you don't specify the tag for the
  container image, `imagePullPolicy` is automatically set to `Always`;
- if you omit the `imagePullPolicy` field, and you specify the tag for the
  container image that isn't `:latest`, the `imagePullPolicy` is automatically set to
  `IfNotPresent`.

{{< note >}}
The value of `imagePullPolicy` of the container is always set when the object is
first _created_, and is not updated if the image's tag later changes.

For example, if you create a Deployment with an image whose tag is _not_
`:latest`, and later update that Deployment's image to a `:latest` tag, the
`imagePullPolicy` field will _not_ change to `Always`. You must manually change
the pull policy of any object after its initial creation.
{{< /note >}}

#### Required image pull

If you would like to always force a pull, you can do one of the following:

- Set the `imagePullPolicy` of the container to `Always`.
- Omit the `imagePullPolicy` and use `:latest` as the tag for the image to use;
  Kubernetes will set the policy to `Always` when you submit the Pod.
- Omit the `imagePullPolicy` and the tag for the image to use;
  Kubernetes will set the policy to `Always` when you submit the Pod.
- Enable the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller.


### ImagePullBackOff

When a kubelet starts creating containers for a Pod using a container runtime,
it might be possible the container is in [Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)
state because of `ImagePullBackOff`.

The status `ImagePullBackOff` means that a container could not start because Kubernetes
could not pull a container image (for reasons such as invalid image name, or pulling
from a private registry without `imagePullSecret`). The `BackOff` part indicates
that Kubernetes will keep trying to pull the image, with an increasing back-off delay.

Kubernetes raises the delay between each attempt until it reaches a compiled-in limit,
which is 300 seconds (5 minutes).

## Multi-architecture images with image indexes

As well as providing binary images, a container registry can also serve a [container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md). An image index can point to multiple [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md) for architecture-specific versions of a container. The idea is that you can have a name for an image (for example: `pause`, `example/mycontainer`, `kube-apiserver`) and allow different systems to fetch the right binary image for the machine architecture they are using.

Kubernetes itself typically names container images with a suffix `-$(ARCH)`. For backward compatibility, please generate the older images with suffixes. The idea is to generate say `pause` image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards compatible for older configurations or YAML files which may have hard coded the images with suffixes.

## Using a private registry

Private registries may require keys to read images from them.  
Credentials can be provided in several ways:
  - Configuring Nodes to Authenticate to a Private Registry
    - all pods can read any configured private registries
    - requires node configuration by cluster administrator
  - Pre-pulled Images
    - all pods can use any images cached on a node
    - requires root access to all nodes to setup
  - Specifying ImagePullSecrets on a Pod
    - only pods which provide own keys can access the private registry
  - Vendor-specific or local extensions
    - if you're using a custom node configuration, you (or your cloud
      provider) can implement your mechanism for authenticating the node
      to the container registry.

These options are explained in more detail below.

### Configuring nodes to authenticate to a private registry

If you run Docker on your nodes, you can configure the Docker container
runtime to authenticate to a private container registry.

This approach is suitable if you can control node configuration.

{{< note >}}
Default Kubernetes only supports the `auths` and `HttpHeaders` section in Docker configuration.
Docker credential helpers (`credHelpers` or `credsStore`) are not supported.
{{< /note >}}


Docker stores keys for private registries in the `$HOME/.dockercfg` or `$HOME/.docker/config.json` file.  If you put the same file
in the search paths list below, kubelet uses it as the credential provider when pulling images.

* `{--root-dir:-/var/lib/kubelet}/config.json`
* `{cwd of kubelet}/config.json`
* `${HOME}/.docker/config.json`
* `/.docker/config.json`
* `{--root-dir:-/var/lib/kubelet}/.dockercfg`
* `{cwd of kubelet}/.dockercfg`
* `${HOME}/.dockercfg`
* `/.dockercfg`

{{< note >}}
You may have to set `HOME=/root` explicitly in the environment of the kubelet process.
{{< /note >}}

Here are the recommended steps to configuring your nodes to use a private registry.  In this
example, run these on your desktop/laptop:

   1. Run `docker login [server]` for each set of credentials you want to use.  This updates `$HOME/.docker/config.json` on your PC.
   1. View `$HOME/.docker/config.json` in an editor to ensure it contains only the credentials you want to use.
   1. Get a list of your nodes; for example:
      - if you want the names: `nodes=$( kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}' )`
      - if you want to get the IP addresses: `nodes=$( kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}' )`
   1. Copy your local `.docker/config.json` to one of the search paths list above.
      - for example, to test this out: `for n in $nodes; do scp ~/.docker/config.json root@"$n":/var/lib/kubelet/config.json; done`

{{< note >}}
For production clusters, use a configuration management tool so that you can apply this
setting to all the nodes where you need it.
{{< /note >}}

Verify by creating a Pod that uses a private image; for example:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: private-image-test-1
spec:
  containers:
    - name: uses-private-image
      image: $PRIVATE_IMAGE_NAME
      imagePullPolicy: Always
      command: [ "echo", "SUCCESS" ]
EOF
```
```
pod/private-image-test-1 created
```

If everything is working, then, after a few moments, you can run:

```shell
kubectl logs private-image-test-1
```
and see that the command outputs:
```
SUCCESS
```

If you suspect that the command failed, you can run:
```shell
kubectl describe pods/private-image-test-1 | grep 'Failed'
```
In case of failure, the output is similar to:
```
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```


You must ensure all nodes in the cluster have the same `.docker/config.json`.  Otherwise, pods will run on
some nodes and fail to run on others.  For example, if you use node autoscaling, then each instance
template needs to include the `.docker/config.json` or mount a drive that contains it.

All pods will have read access to images in any private registry once private
registry keys are added to the `.docker/config.json`.

### Interpretation of config.json {#config-json}

The interpretation of `config.json` varies between the original Docker
implementation and the Kubernetes interpretation. In Docker, the `auths` keys
can only specify root URLs, whereas Kubernetes allows glob URLs as well as
prefix-matched paths. This means that a `config.json` like this is valid:

```json
{
    "auths": {
        "*my-registry.io/images": {
            "auth": "…"
        }
    }
}
```

The root URL (`*my-registry.io`) is matched by using the following syntax:

```
pattern:
    { term }

term:
    '*'         matches any sequence of non-Separator characters
    '?'         matches any single non-Separator character
    '[' [ '^' ] { character-range } ']'
                character class (must be non-empty)
    c           matches character c (c != '*', '?', '\\', '[')
    '\\' c      matches character c

character-range:
    c           matches character c (c != '\\', '-', ']')
    '\\' c      matches character c
    lo '-' hi   matches character c for lo <= c <= hi
```

Image pull operations would now pass the credentials to the CRI container
runtime for every valid pattern. For example the following container image names
would match successfully:

- `my-registry.io/images`
- `my-registry.io/images/my-image`
- `my-registry.io/images/another-image`
- `sub.my-registry.io/images/my-image`
- `a.sub.my-registry.io/images/my-image`

The kubelet performs image pulls sequentially for every found credential. This
means, that multiple entries in `config.json` are possible, too:

```json
{
    "auths": {
        "my-registry.io/images": {
            "auth": "…"
        },
        "my-registry.io/images/subpath": {
            "auth": "…"
        }
    }
}
```

If now a container specifies an image `my-registry.io/images/subpath/my-image`
to be pulled, then the kubelet will try to download them from both
authentication sources if one of them fails.

### Pre-pulled images

{{< note >}}
This approach is suitable if you can control node configuration.  It
will not work reliably if your cloud provider manages nodes and replaces
them automatically.
{{< /note >}}

By default, the kubelet tries to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).

If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.

This can be used to preload certain images for speed or as an alternative to authenticating to a private registry.

All pods will have read access to any pre-pulled images.

### Specifying imagePullSecrets on a Pod

{{< note >}}
This is the recommended approach to run containers based on images
in private registries.
{{< /note >}}

Kubernetes supports specifying container image registry keys on a Pod.

#### Creating a Secret with a Docker config

Run the following command, substituting the appropriate uppercase values:

```shell
kubectl create secret docker-registry <name> --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```

If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.  
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) explains how to set this up.

This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that
only works with a single private registry.

{{< note >}}
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
{{< /note >}}

#### Referring to an imagePullSecrets on a Pod

Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a Pod definition.

For example:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

This needs to be done for each pod that is using a private registry.

However, setting of this field can be automated by setting the imagePullSecrets
in a [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/) resource.

Check [Add ImagePullSecrets to a Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) for detailed instructions.

You can use this in conjunction with a per-node `.docker/config.json`.  The credentials
will be merged.

## Use cases

There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.

1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images on the Docker hub.
     - No configuration required.
     - Some cloud providers automatically cache or mirror public images, which improves availability and reduces the time to pull images.
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private [Docker registry](https://docs.docker.com/registry/).
     - It may be hosted on the [Docker Hub](https://hub.docker.com/signup), or elsewhere.
     - Manually configure .docker/config.json on each node as described above.
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Use a hosted container image registry service that controls image access
     - It will work better with cluster autoscaling than manual node configuration.
   - Or, on a cluster where changing the node configuration is inconvenient, use `imagePullSecrets`.
1. Cluster with proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a "Secret" resource, instead of packaging it in an image.
1. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credential for each tenant, put into secret, and populate secret to each tenant namespace.
   - The tenant adds that secret to imagePullSecrets of each namespace.


If you need access to multiple registries, you can create one secret for each registry.
Kubelet will merge any `imagePullSecrets` into a single virtual `.docker/config.json`


## {{% heading "whatsnext" %}}

* Read the [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md).
* Learn about [container image garbage collection](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection).
* Learn more about [pulling an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry).
