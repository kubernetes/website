---
reviewers:
- erictune
- thockin
title: इमेजेज (Images)
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

एक कंटेनर इमेज बाइनरी डेटा को दर्शाती है जो एक एप्लिकेशन और उसकी सभी सॉफ्टवेयर डिपेंडेंसियों को एनकैप्सुलेट करता है। कंटेनर इमेजेज स्वतंत्र रूप से चल सकने वाले सॉफ्टवेयर बंडल होते हैं जो अपने रनटाइम एनवायरनमेंट के बारे में बहुत अच्छी परिभाषा करते हैं।

आप अपने एप्लिकेशन की एक कंटेनर इमेज बनाते हैं और इसे रजिस्ट्री में पुश करते हैं पहले इससे संबंधित करते हुए {{< glossary_tooltip text="पॉड" term_id="pod" >}}।

यह पृष्ठ कंटेनर इमेज कॉन्सेप्ट की एक आउटलाइन प्रदान करता है।


{{< note >}}
यदि आप कुबरनेटीज़ रिलीज के लिए कंटेनर इमेज ढूंढ रहे हैं (जैसे v{{< skew latestVersion >}}, नवीनतम माइनर रिलीज), तो [कुबरनेटीज़ डाउनलोड](https://kubernetes.io/releases/download/) करें पर जाएं।
{{< /note >}}

<!-- body -->

## Image names


कंटेनर इमेजेज आमतौर पर `pause`, `example/mycontainer`, या `kube-apiserver` जैसे नाम दिए जाते हैं।
इमेजयों में एक रजिस्ट्री होस्टनाम भी शामिल हो सकता है; उदाहरण के लिए: `fictional.registry.example/imagename`,
और संभवतः एक पोर्ट नंबर भी हो सकता है; उदाहरण के लिए: `fictional.registry.example:10443/imagename`।

यदि आप एक रजिस्ट्री होस्टनाम निर्दिष्ट नहीं करते हैं, तो कुबरनेटीज़ कुबेरनेटीज़ को मानते हैं कि आपका मतलब डॉकर सार्वजनिक रजिस्ट्री है।

इमेज नाम भाग के बाद आप टैग जोड़ सकते हैं (जैसा कि आप दृष्टिगत कमांड का उपयोग करते हुए करेंगे
`docker` या `podman`). टैग आपको एकीकृत इमेज सीरीज के विभिन्न संस्करणों की पहचान करने देते हैं।



इमेज टैग कम से कम अक्षरों के लिए निम्नलिखित चरित्रों में से किसी एक का उपयोग करते हुए बनाए जाते हैं: छोटे और बड़े अक्षर,
अंक, अंडरस्कोर (_), डॉट (.) और डैश (-)। इमेज टैग के भीतर विभाजक वर्णों (_, -, और .) को कहाँ रखा जा सकता है
इसके लिए अतिरिक्त नियम होते हैं। यदि आप टैग निर्दिष्ट नहीं करते हैं, तो Kubernetes आपका मतलब `latest` टैग से मानता है।



## इमेज अपडेट करना

जब आप पहली बार एक {{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod या किसी अन्य ऑब्जेक्ट को
बनाते हैं जो एक पॉड टेम्पलेट शामिल करता है, तो दरअसल उस पॉड में सभी कंटेनरों की खींचने की नीति डिफ़ॉल्ट रूप से `IfNotPresent`
पर सेट की जाती है अगर यह उज्ज्वल रूप से निर्दिष्ट नहीं है। यह नीति कुबेलेट को इमेज को छोड़ने के लिए प्रेरित करती है अगर वह पहले से
मौजूद होता है।


### इमेज खींचने की नीति

The `imagePullPolicy` for a container and the tag of the image affect when the
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) attempts to pull (download) the specified image.

Here's a list of the values you can set for `imagePullPolicy` and the effects
these values have:

`IfNotPresent`
: the image is pulled only if it is not already present locally.

`Always`
: every time the kubelet launches a container, the kubelet queries the container
  image registry to resolve the name to an image
  [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier).
  If the kubelet has a container image with that exact digest cached locally, the kubelet uses its
  cached image; otherwise, the kubelet pulls the image with the resolved digest, and uses that image
  to launch the container.

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

When using image tags, if the image registry were to change the code that the tag on that image
represents, you might end up with a mix of Pods running the old and new code. An image digest
uniquely identifies a specific version of the image, so Kubernetes runs the same code every time
it starts a container with that image name and digest specified. Specifying an image by digest
fixes the code that you run so that a change at the registry cannot lead to that mix of versions.

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
- Enable the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  admission controller.

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

As well as providing binary images, a container registry can also serve a
[container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md).
An image index can point to multiple [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
for architecture-specific versions of a container. The idea is that you can have a name for an image
(for example: `pause`, `example/mycontainer`, `kube-apiserver`) and allow different systems to
fetch the right binary image for the machine architecture they are using.

Kubernetes itself typically names container images with a suffix `-$(ARCH)`. For backward
compatibility, please generate the older images with suffixes. The idea is to generate say `pause`
image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards
compatible for older configurations or YAML files which may have hard coded the images with
suffixes.

## Using a private registry

Private registries may require keys to read images from them.  
Credentials can be provided in several ways:

- Configuring Nodes to Authenticate to a Private Registry
  - all pods can read any configured private registries
  - requires node configuration by cluster administrator
- Kubelet Credential Provider to dynamically fetch credentials for private registries
  - kubelet can be configured to use credential provider exec plugin 
    for the respective private registry.
- Pre-pulled Images
  - all pods can use any images cached on a node
  - requires root access to all nodes to set up
- Specifying ImagePullSecrets on a Pod
  - only pods which provide own keys can access the private registry
- Vendor-specific or local extensions
  - if you're using a custom node configuration, you (or your cloud
    provider) can implement your mechanism for authenticating the node
    to the container registry.

These options are explained in more detail below.

### Configuring nodes to authenticate to a private registry

Specific instructions for setting credentials depends on the container runtime and registry you
chose to use. You should refer to your solution's documentation for the most accurate information.

For an example of configuring a private container image registry, see the
[Pull an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry)
task. That example uses a private registry in Docker Hub.

### Kubelet credential provider for authenticated image pulls {#kubelet-credential-provider}

{{< note >}}
This approach is especially suitable when kubelet needs to fetch registry credentials dynamically.
Most commonly used for registries provided by cloud providers where auth tokens are short-lived. 
{{< /note >}}

You can configure the kubelet to invoke a plugin binary to dynamically fetch registry credentials for a container image.
This is the most robust and versatile way to fetch credentials for private registries, but also requires kubelet-level configuration to enable.

See [Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/) for more details.

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

This can be used to preload certain images for speed or as an alternative to authenticating to a
private registry.

All pods will have read access to any pre-pulled images.

### Specifying imagePullSecrets on a Pod

{{< note >}}
This is the recommended approach to run containers based on images
in private registries.
{{< /note >}}

Kubernetes supports specifying container image registry keys on a Pod.
`imagePullSecrets` must all be in the same namespace as the Pod. The referenced
Secrets must be of type `kubernetes.io/dockercfg` or `kubernetes.io/dockerconfigjson`.

#### Creating a Secret with a Docker config

You need to know the username, registry password and client email address for authenticating
to the registry, as well as its hostname.
Run the following command, substituting the appropriate uppercase values:

```shell
kubectl create secret docker-registry <name> \
  --docker-server=DOCKER_REGISTRY_SERVER \
  --docker-username=DOCKER_USER \
  --docker-password=DOCKER_PASSWORD \
  --docker-email=DOCKER_EMAIL
```

If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.  
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
explains how to set this up.

This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that
only works with a single private registry.

{{< note >}}
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
{{< /note >}}

#### Referring to an imagePullSecrets on a Pod

Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a Pod definition. Each item in the `imagePullSecrets` array can only
reference a Secret in the same namespace.

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

Check [Add ImagePullSecrets to a Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
for detailed instructions.

You can use this in conjunction with a per-node `.docker/config.json`.  The credentials
will be merged.

## Use cases

There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.

1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images from a public registry
     - No configuration required.
     - Some cloud providers automatically cache or mirror public images, which improves
       availability and reduces the time to pull images.
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private registry
     - Manual configuration may be required on the nodes that need to access to private registry
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Use a hosted container image registry service that controls image access
     - It will work better with cluster autoscaling than manual node configuration.
   - Or, on a cluster where changing the node configuration is inconvenient, use `imagePullSecrets`.
1. Cluster with proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a "Secret" resource, instead of packaging it in an image.
1. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credential for each tenant, put into secret, and populate secret to each
     tenant namespace.
   - The tenant adds that secret to imagePullSecrets of each namespace.

If you need access to multiple registries, you can create one secret for each registry.

## {{% heading "whatsnext" %}}

* Read the [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md).
* Learn about [container image garbage collection](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection).
* Learn more about [pulling an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry).

