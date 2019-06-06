---
reviewers:
- erictune
- thockin
title: Images
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

You create your Docker image and push it to a registry before referring to it in a Kubernetes pod.

The `image` property of a container supports the same syntax as the `docker` command does, including private registries and tags.

{{% /capture %}}


{{% capture body %}}

## Updating Images

The default pull policy is `IfNotPresent` which causes the Kubelet to skip
pulling an image if it already exists. If you would like to always force a pull,
you can do one of the following:

- set the `imagePullPolicy` of the container to `Always`.
- omit the `imagePullPolicy` and use `:latest` as the tag for the image to use.
- omit the `imagePullPolicy` and the tag for the image to use.
- enable the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller.

Note that you should avoid using `:latest` tag, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images) for more information.

## Building Multi-architecture Images with Manifests

Docker CLI now supports the following command `docker manifest` with sub commands like `create`, `annotate` and `push`. These commands can be used to build and push the manifests. You can use `docker manifest inspect` to view the manifest.

Please see docker documentation here:
https://docs.docker.com/edge/engine/reference/commandline/manifest/

See examples on how we use this in our build harness:
https://cs.k8s.io/?q=docker%20manifest%20(create%7Cpush%7Cannotate)&i=nope&files=&repos=

These commands rely on and are implemented purely on the Docker CLI. You will need to either edit the `$HOME/.docker/config.json` and set `experimental` key to `enabled` or you can just set `DOCKER_CLI_EXPERIMENTAL` environment variable to `enabled` when you call the CLI commands.

{{< note >}}
Please use Docker *18.06 or above*, versions below that either have bugs or do not support the experimental command line option. Example https://github.com/docker/cli/issues/1135 causes problems under containerd.
{{< /note >}}

If you run into trouble with uploading stale manifests, just clean up the older manifests in `$HOME/.docker/manifests` to start fresh.

For Kubernetes, we have typically used images with suffix `-$(ARCH)`. For backward compatibility, please generate the older images with suffixes. The idea is to generate say `pause` image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards compatible for older configurations or YAML files which may have hard coded the images with suffixes.

## Using a Private Registry

Private registries may require keys to read images from them.
Credentials can be provided in several ways:

  - Using Google Container Registry
    - Per-cluster
    - automatically configured on Google Compute Engine or Google Kubernetes Engine
    - all pods can read the project's private registry
  - Using AWS EC2 Container Registry (ECR)
    - use IAM roles and policies to control access to ECR repositories
    - automatically refreshes ECR login credentials
  - Using Oracle Cloud Infrastructure Registry (OCIR)
    - use IAM roles and policies to control access to OCIR repositories
  - Using Azure Container Registry (ACR)
  - Using IBM Cloud Container Registry
  - Configuring Nodes to Authenticate to a Private Registry
    - all pods can read any configured private registries
    - requires node configuration by cluster administrator
  - Pre-pulling Images
    - all pods can use any images cached on a node
    - requires root access to all nodes to setup
  - Specifying ImagePullSecrets on a Pod
    - only pods which provide own keys can access the private registry

Each option is described in more detail below.


### Using Google Container Registry

Kubernetes has native support for the [Google Container
Registry (GCR)](https://cloud.google.com/tools/container-registry/), when running on Google Compute
Engine (GCE).  If you are running your cluster on GCE or Google Kubernetes Engine, simply
use the full image name (e.g. gcr.io/my_project/image:tag).

All pods in a cluster will have read access to images in this registry.

The kubelet will authenticate to GCR using the instance's
Google service account.  The service account on the instance
will have a `https://www.googleapis.com/auth/devstorage.read_only`,
so it can pull from the project's GCR, but not push.

### Using AWS EC2 Container Registry

Kubernetes has native support for the [AWS EC2 Container
Registry](https://aws.amazon.com/ecr/), when nodes are AWS EC2 instances.

Simply use the full image name (e.g. `ACCOUNT.dkr.ecr.REGION.amazonaws.com/imagename:tag`)
in the Pod definition.

All users of the cluster who can create pods will be able to run pods that use any of the
images in the ECR registry.

The kubelet will fetch and periodically refresh ECR credentials.  It needs the following permissions to do this:

- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:GetRepositoryPolicy`
- `ecr:DescribeRepositories`
- `ecr:ListImages`
- `ecr:BatchGetImage`

Requirements:

- You must be using kubelet version `v1.2.0` or newer.  (e.g. run `/usr/bin/kubelet --version=true`).
- If your nodes are in region A and your registry is in a different region B, you need version `v1.3.0` or newer.
- ECR must be offered in your region

Troubleshooting:

- Verify all requirements above.
- Get $REGION (e.g. `us-west-2`) credentials on your workstation. SSH into the host and run Docker manually with those creds. Does it work?
- Verify kubelet is running with `--cloud-provider=aws`.
- Check kubelet logs (e.g. `journalctl -u kubelet`) for log lines like:
  - `plugins.go:56] Registering credential provider: aws-ecr-key`
  - `provider.go:91] Refreshing cache for provider: *aws_credentials.ecrProvider`

### Using Azure Container Registry (ACR)
When using [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/)
you can authenticate using either an admin user or a service principal.
In either case, authentication is done via standard Docker authentication.  These instructions assume the
[azure-cli](https://github.com/azure/azure-cli) command line tool.

You first need to create a registry and generate credentials, complete documentation for this can be found in
the [Azure container registry documentation](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli).

Once you have created your container registry, you will use the following credentials to login:

   * `DOCKER_USER` : service principal, or admin username
   * `DOCKER_PASSWORD`: service principal password, or admin user password
   * `DOCKER_REGISTRY_SERVER`: `${some-registry-name}.azurecr.io`
   * `DOCKER_EMAIL`: `${some-email-address}`

Once you have those variables filled in you can
[configure a Kubernetes Secret and use it to deploy a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).

### Using IBM Cloud Container Registry
IBM Cloud Container Registry provides a multi-tenant private image registry that you can use to safely store and share your Docker images. By default, images in your private registry are scanned by the integrated Vulnerability Advisor to detect security issues and potential vulnerabilities. Users in your IBM Cloud account can access your images, or you can create a token to grant access to registry namespaces.

To install the IBM Cloud Container Registry CLI plug-in and create a namespace for your images, see [Getting started with IBM Cloud Container Registry](https://cloud.ibm.com/docs/services/Registry?topic=registry-index#index).

You can use the IBM Cloud Container Registry to deploy containers from [IBM Cloud public images](https://cloud.ibm.com/docs/services/Registry?topic=registry-public_images#public_images) and your private images into the `default` namespace of your IBM Cloud Kubernetes Service cluster. To deploy a container into other namespaces, or to use an image from a different IBM Cloud Container Registry region or IBM Cloud account, create a Kubernetes `imagePullSecret`. For more information, see [Building containers from images](https://cloud.ibm.com/docs/containers?topic=containers-images#images).

### Configuring Nodes to Authenticate to a Private Registry

{{< note >}}
If you are running on Google Kubernetes Engine, there will already be a `.dockercfg` on each node with credentials for Google Container Registry.  You cannot use this approach.
{{< /note >}}

{{< note >}}
If you are running on AWS EC2 and are using the EC2 Container Registry (ECR), the kubelet on each node will
manage and update the ECR login credentials. You cannot use this approach.
{{< /note >}}

{{< note >}}
This approach is suitable if you can control node configuration.  It
will not work reliably on GCE, and any other cloud provider that does automatic
node replacement.
{{< /note >}}

{{< note >}}
Kubernetes as of now only supports the `auths` and `HttpHeaders` section of docker config. This means credential helpers (`credHelpers` or `credsStore`) are not supported.
{{< /note >}}


Docker stores keys for private registries in the `$HOME/.dockercfg` or `$HOME/.docker/config.json` file.  If you put the same file
in the search paths list below, kubelet uses it as the credential provider when pulling images.

*   `{--root-dir:-/var/lib/kubelet}/config.json`
*   `{cwd of kubelet}/config.json`
*   `${HOME}/.docker/config.json`
*   `/.docker/config.json`
*   `{--root-dir:-/var/lib/kubelet}/.dockercfg`
*   `{cwd of kubelet}/.dockercfg`
*   `${HOME}/.dockercfg`
*   `/.dockercfg`

{{< note >}}
You may have to set `HOME=/root` explicitly in your environment file for kubelet.
{{< /note >}}

Here are the recommended steps to configuring your nodes to use a private registry.  In this
example, run these on your desktop/laptop:

   1. Run `docker login [server]` for each set of credentials you want to use.  This updates `$HOME/.docker/config.json`.
   1. View `$HOME/.docker/config.json` in an editor to ensure it contains just the credentials you want to use.
   1. Get a list of your nodes, for example:
      - if you want the names: `nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`
      - if you want to get the IPs: `nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`
   1. Copy your local `.docker/config.json` to one of the search paths list above.
      - for example: `for n in $nodes; do scp ~/.docker/config.json root@$n:/var/lib/kubelet/config.json; done`

Verify by creating a pod that uses a private image, e.g.:

```yaml
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
pod/private-image-test-1 created
```

If everything is working, then, after a few moments, you should see:

```shell
kubectl logs private-image-test-1
SUCCESS
```

If it failed, then you will see:

```shell
kubectl describe pods/private-image-test-1 | grep "Failed"
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```


You must ensure all nodes in the cluster have the same `.docker/config.json`.  Otherwise, pods will run on
some nodes and fail to run on others.  For example, if you use node autoscaling, then each instance
template needs to include the `.docker/config.json` or mount a drive that contains it.

All pods will have read access to images in any private registry once private
registry keys are added to the `.docker/config.json`.

### Pre-pulling Images

{{< note >}}
If you are running on Google Kubernetes Engine, there will already be a `.dockercfg` on each node with credentials for Google Container Registry.  You cannot use this approach.
{{< /note >}}

{{< note >}}
This approach is suitable if you can control node configuration.  It
will not work reliably on GCE, and any other cloud provider that does automatic
node replacement.
{{< /note >}}

By default, the kubelet will try to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).

If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.

This can be used to preload certain images for speed or as an alternative to authenticating to a private registry.

All pods will have read access to any pre-pulled images.

### Specifying ImagePullSecrets on a Pod

{{< note >}}
This approach is currently the recommended approach for Google Kubernetes Engine, GCE, and any cloud-providers
where node creation is automated.
{{< /note >}}

Kubernetes supports specifying registry keys on a pod.

#### Creating a Secret with a Docker Config

Run the following command, substituting the appropriate uppercase values:

```shell
cat <<EOF > ./kustomization.yaml
secretGenerator:
- name: myregistrykey
  type: docker-registry
  literals:
  - docker-server=DOCKER_REGISTRY_SERVER
  - docker-username=DOCKER_USER
  - docker-password=DOCKER_PASSWORD
  - docker-email=DOCKER_EMAIL
EOF

kubectl apply -k .
secret/myregistrykey-66h7d4d986 created
```

If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes secret.
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) explains how to set this up.
This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that will
only work with a single private registry.

{{< note >}}
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
{{< /note >}}

#### Referring to an imagePullSecrets on a Pod

Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a pod definition.

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
in a [serviceAccount](/docs/user-guide/service-accounts) resource.
Check [Add ImagePullSecrets to a Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) for detailed instructions.

You can use this in conjunction with a per-node `.docker/config.json`.  The credentials
will be merged.  This approach will work on Google Kubernetes Engine.

### Use Cases

There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.

1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images on the Docker hub.
     - No configuration required.
     - On GCE/Google Kubernetes Engine, a local mirror is automatically used for improved speed and availability.
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private [Docker registry](https://docs.docker.com/registry/).
     - It may be hosted on the [Docker Hub](https://hub.docker.com/signup), or elsewhere.
     - Manually configure .docker/config.json on each node as described above.
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Or, when on GCE/Google Kubernetes Engine, use the project's Google Container Registry.
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

{{% /capture %}}

If you need access to multiple registries, you can create one secret for each registry.
Kubelet will merge any `imagePullSecrets` into a single virtual `.docker/config.json`
