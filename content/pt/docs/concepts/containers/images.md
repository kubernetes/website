---
reviewers:
- femrtnz
- jcjesus
title: Imagens
content_type: concept
weight: 10
---

<!-- overview -->

A imagem de um contêiner representa informações binárias que encapsulam uma aplicação e todas as suas depêndencias. Imagens de contêineres são pacotes de softwares executáveis que podem ser executados de maneira independente e que fazem suposições bem definidas sobre o agente de execução do ambiente.

Tipicamente você cria a imagem de um contêiner da sua aplicação e realiza um push para um registro antes de referiá-la em um {{< glossary_tooltip text="Pod" term_id="pod" >}}

Esta página fornece um resumo sobre o conceito de imagens de contêiner. 

<!-- body -->

## Nomes das imagens

Imagens de contêineres, normalmente, recebem nomes como `pause`, `exemplo/meuconteiner`, ou `kube-apiserver`.
Imagens também podem incluir um hostname de algum registro; por exemplo: `exemplo.registro.ficticio/nomeimagem`, e possivelmente um número de porta também; por exemplo: `exemplo.registro.ficticio:10443/nomeimagem`.

<!-- Container images are usually given a name such as `pause`, `example/mycontainer`, or `kube-apiserver`.
Images can also include a registry hostname; for example: `fictional.registry.example/imagename`,
and possible a port number as well; for example: `fictional.registry.example:10443/imagename`. -->

Se você não especificar um hostname de registro, Kubernetes assumirá que você quer o registro público do Docker.
<!-- If you don't specify a registry hostname, Kubernetes assumes that you mean the Docker public registry. -->

Depois da parte do nome da imagem, você pode adicionar a _tag_ (como também usando com comandos como 
`docker` e `podman`).
Tags também deixam você identificar versões diferentes da mesma série de imagens.
<!-- After the image name part you can add a _tag_ (as also using with commands such
as `docker` and `podman`).
Tags let you identify different versions of the same series of images. -->

Tags da imagem consiste de letras maiusculas e minisculas, digitos e underscores (`_`),
pontos finais (`.`) e traços (`-`)
Existem regras adicionais onde será possível colocar caractéres (`_`, `-`, `.`) dentro de uma tag de imagem.
Se você não especificar a tag, Kubernetes assumirá que você quer o a tag definida como `latest`.
<!-- Image tags consist of lowercase and uppercase letters, digits, underscores (`_`),
periods (`.`), and dashes (`-`).  
There are additional rules about where you can place the separator
characters (`_`, `-`, and `.`) inside an image tag.  
If you don't specify a tag, Kubernetes assumes you mean the tag `latest`. -->

{{< caution >}}
Você deve evitar de usar a tag `latest` quando estiver realizando o deploy de containers em produção, 
pois dificulta a visualização de qual imagem está sendo rodada, além de tornar mais difícil
o processo de reverter para uma versão funcional. 

No lugar, especifique uma tag significativa como `v1.42.0`
{{< /caution >}}
<!-- {{< caution >}}
You should avoid using the `latest` tag when deploying containers in production,
as it is harder to track which version of the image is running and more difficult
to roll back to a working version.

Instead, specify a meaningful tag such as `v1.42.0`.
{{< /caution >}} -->

## Atualizando imagens
<!-- ## Updating images -->

A política de *pull* padrão é `ifNotPresent` que faz com que o 
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} ignore 
o processo de *pull* da imagem, caso a mesma já exista. Se você prefere sempre forçar o processo de *pull*, 
você pode fazer um como demonstrado: 
<!-- The default pull policy is `IfNotPresent` which causes the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} to skip
pulling an image if it already exists. If you would like to always force a pull,
you can do one of the following: -->

- defina a `imagePullPolicy` do contêiner para `Always`
- omita a `imagePullPolicy` e use `:latest` como a tag para a imagem usar.
- omita a `imagePullPolicy` e a tag para a imagem usar. 
- habilite o [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) controlador de admissão.
<!-- - set the `imagePullPolicy` of the container to `Always`.
- omit the `imagePullPolicy` and use `:latest` as the tag for the image to use.
- omit the `imagePullPolicy` and the tag for the image to use.
- enable the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller. -->

Quando `imagePullPolicy` é definia sem nenhum valor, também será definido como `Always`.
<!-- When `imagePullPolicy` is defined without a specific value, it is also set to `Always`. -->

## Multi-arquitetura de imagens com índice de imagens
<!-- ## Multi-architecture images with image indexes -->

Além de fornecer o binário das imagens, um registro de contêiner também pode servir um [container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md). Um índice de imagem pode apontar para multiplos [manifestos da imagem](https://github.com/opencontainers/image-spec/blob/master/manifest.md) para versões específicas de arquiteturas de um contêiner. A ideia é que você consiga ter um nome para uma imagem (por exemplo: `pause`, `exemple/meuconteiner`, `kube-apiserver`) e permitir que diferentes sistemas possam baixar o binário da imagem correto para a arquitetura da maquina que estão usando.  
<!-- As well as providing binary images, a container registry can also serve a [container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md). An image index can point to multiple [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md) for architecture-specific versions of a container. The idea is that you can have a name for an image (for example: `pause`, `example/mycontainer`, `kube-apiserver`) and allow different systems to fetch the right binary image for the machine architecture they are using. -->

Tipicamente o próprio Kubernetes nomeia as imagens dos contêineres com o sufixo `-$(ARCH)`.
<!-- Kubernetes itself typically names container images with a suffix `-$(ARCH)`. For backward compatibility, please generate the older images with suffixes. The idea is to generate say `pause` image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards compatible for older configurations or YAML files which may have hard coded the images with suffixes. -->

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
   1. View `$HOME/.docker/config.json` in an editor to ensure it contains just the credentials you want to use.
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

* Read the [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
