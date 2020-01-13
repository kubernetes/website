---
layout: blog
title: "Trying new tools for building and automate the deployment in Kubernetes"
date: 2020-01-11
---

**Author**: Andrei Kvapil (WEDOS) / kvaps

![Ideal pipeline](/images/blog/2020-01-11-try-new-deployment-tools/ideal-pipeline.png)

Hi!  
Recently, many cool automation tools have been released both for building Docker images and for deploying to Kubernetes. In this regard, I decided to play with the Gitlab a little, study its capabilities and, of course, configure the pipeline.

The source of inspiration for this work was the site [kubernetes.io](https://kubernetes.io/), which is automatically generated from [source code](github.com/kubernetes/website).  
For each new pullrequest the bot generates a preview version with your changes automatically and provides a link for review.

I tried to build a similar process from scratch, but entirely built on Gitlab CI and free tools that I used to use to deploy applications in Kubernetes. Today, I finally will tell you more about them.

The article will consider such tools as: **Hugo**, **QBEC**, **Kaniko**, **Git-crypt** and **GitLab CI** with dynamic environments feature.

---

# Contents

[**1.  Getting started with Hugo**](#hugo)
   
[**2.  Dockerfile preparation**](#dockerfile)
   
[**3.  Getting started with Kaniko**](#kaniko)
   
[**4.  Getting started with QBEC**](#qbec)
   
[**5.  Trying Gitlab-runner with Kubernetes-executor**](#gitlab-runner)
   
[**6.  Deploying Helm-charts with QBEC**](#qbec-helm)
   
[**7.  Getting started with git-crypt**](#git-crypt)
   
[**8.  Preparing toolbox image**](#toolbox)
   
[**9.  Our first pipeline and building images using tags**](#pipeline-build)
   
[**10. Deployment automation**](#pipeline-deploy)
   
[**11. Artifacts and building on push to master**](#artifacts)
   
[**12. Dynamic environments**](#dynamic-environments)
   
[**13. Review Apps**](#review-apps)

---

# 1. Getting started with Hugo

As an example of our project, we will try to create a website for publishing documentation built on Hugo. **[Hugo](https://gohugo.io/)** is a static site generator.

For those who are not familiar with static generators, I will tell you a little about them. Unlike regular site engines with database and some PHP which generate pages on the fly at the user's request, static generators are working a little different.  
They allow to take the source text, let's say set of files in **Markdown** markup and theme templates, and then compile them into a fully finished site.

That is, at the output you will get a directory structure and a set of generated HTML files that can be simply uploaded to any cheap hosting and get a working site.

Hugo can be installed locally and try it out:

Initialize the new site:
```bash
hugo new site docs.example.org
```

And also git-repository:
```bash
cd docs.example.org
git init
```

Right now our site is empty and if we want to make something appear on it first and foremost we need to connect a theme. Theme it is just a set of templates and preset rules for generate our site.

We will use [**Learn**](https://themes.gohugo.io/hugo-theme-learn/) theme, which, in my opinion, is the best suited for a site with documentation.

Pay attention we don't need to save theme files in our repository, instead we can simply connect it using **git submodule**:

```bash
git submodule add https://github.com/matcornic/hugo-theme-learn themes/learn
```

Thus, in our repository will be located only files directly related to our project, and nothing else. The connected theme will be just a link to specific repository and commit hash, so, it can always be pulled from the original source and without fear of incompatible changes.

Edit config `config.toml`:
```toml
baseURL = "http://docs.example.org/"
languageCode = "en-us"
title = "My Docs Site"
theme = "learn"
```

At this stage, you can run:
```bash
hugo server
```

Now we can go http://localhost:1313/ and check our newly created site. All changes made in the directory will automatically update the page in the browser, it is very convenient!

Let's try to create a title page `content/_index.md`:

```markdown
# My docs site

## Welcome to the docs!

You will be very smart :-)
```

>
> **[Screenshot of created page](https://habrastorage.org/webt/gb/yx/nv/gbyxnvagfs6bks4iqbwcrrovumu.png)**
>

To generate a site, just run:
```bash
hugo
```

The contents of the directory `public/` is your site.

By the way, let's add it to `.gitignore`:
```
echo /public > .gitignore
```

Do not forget to commit our changes:
```
git add .
git commit -m "New site created"
```

---

# 2. Dockerfile preparation {#dockerfile}

It is time to determine the structure of our repository. Usually I use something like:

```
.
├── deploy
│   ├── app1
│   └── app2
└── dockerfiles
    ├── image1
    └── image2
```
* `dockerfiles/` --- contain directories with Dockerfiles and everything need to build our docker images.
* `deploy/` --- contains directories for deploying our applications to Kubernetes

Thus, we will create our first Dockerfile along the path `dockerfiles/website/Dockerfile`

```Dockerfile
FROM alpine:3.11 as builder
ARG HUGO_VERSION=0.62.0
RUN wget -O- https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-64bit.tar.gz | tar -xz -C /usr/local/bin
ADD . /src
RUN hugo -s /src

FROM alpine:3.11
RUN apk add --no-cache darkhttpd
COPY --from=builder /src/public /var/www
ENTRYPOINT [ "/usr/bin/darkhttpd" ]
CMD [ "/var/www" ]
```

As you can see, the Dockerfile contains two `FROM`, this opportunity is called [**multi-stage build**](https://docs.docker.com/develop/develop-images/multistage-build/) and allows you to exclude everything unnecessary from the final docker image. Thus, the final image will contain only content of our staticly generated site and **darkhttpd** (lightweight HTTP-server).

Do not forget to commit our changes:
```
git add dockerfiles/website
git commit -m "Add Dockerfile for website"
```

---

# 3. Getting started with Kaniko {#kaniko}

I decided to use **[Kaniko](https://github.com/GoogleContainerTools/kaniko)** to build docker images, since it does not require running docker daemon. The build can be done on any host, the layers can be cached directly in docker-registry, getting rid of the need to have a full persistent storage.

To build the image, just start the container with **kaniko executor** and pass the current build context to it, you can do this locally, using docker:

```bash
docker run -ti --rm \
  -v $PWD:/workspace \
  -v ~/.docker/config.json:/kaniko/.docker/config.json:ro \
  gcr.io/kaniko-project/executor:v0.15.0 \
  --cache \
  --dockerfile=dockerfiles/website/Dockerfile \
  --destination=registry.gitlab.com/kvaps/docs.example.org/website:v0.0.1
```

Where `registry.gitlab.com/kvaps/docs.example.org/website` is the name of your docker image, after the build it will be automatically pushed to the docker registry.

Option `--cache` allows to cache the layers in docker registry, for the given example it will be saved in `registry.gitlab.com/kvaps/docs.example.org/website/cache`, but you can specify another using option `--cache-repo`.

>
> **[Screenshot of docker-registry](https://habrastorage.org/webt/0-/31/qx/0-31qxfta2gk7-colutf2l_qtmm.png)**
>

---

# 4. Getting started with QBEC {#qbec}

**[Qbec](https://qbec.io/)** is a deployment tool that allows you to declaratively describe the manifests of your application and deploy them to Kubernetes. Using Jsonnet as the main syntax allow to simplify the description of differences for several environments, and also almost completely eliminates code repeatability.

This can be really useful in cases where you need to deploy an application into several clusters with different parameters and you want to declaratively describe them in Git.

Qbec also allows you to render Helm charts by passing the necessary parameters to them and then operate them the same way as the usual manifestos. It allows you to add some mutations for them, and eliminates the need of using ChartMuseum. This way you can store and render charts directly from git, where they have the very place.

As I said before, we will store all deployments in a directory `deploy/`:
```bash
mkdir deploy
cd deploy
```

Let's initialize our first application:
```bash
qbec init website
cd website
```

Now the structure of our application looks like this:
```
.
├── components
├── environments
│   ├── base.libsonnet
│   └── default.libsonnet
├── params.libsonnet
└── qbec.yaml
```

look at the file `qbec.yaml`:
```yaml
apiVersion: qbec.io/v1alpha1
kind: App
metadata:
  name: website
spec:
  environments:
    default:
      defaultNamespace: docs
      server: https://kubernetes.example.org:8443
  vars: {}
```

Here we are primarily interested in `spec.environment`, qbec has already created a default environment and took our namespace and server address from our current kubeconfig.  
Now, when using **default** environment, qbec will always deploy to the specified Kubernetes cluster and the namespace. This way, you no longer need to switch namespace and context before applying configuration.  
You can always update the settings in this file, if necessary.

All your environments should be described in `qbec.yaml`, and in the `params.libsonnet` file, which is contain the information where to take parameters for them.

Next we see two directories:

* `components/` --- all the manifests for our application will be stored here, we can describe them both using jsonnet and as ordinary yaml files
* `environments/` --- here we will describe all the variables (parameters) for our environments.

By default, we have two files:
* `environments/base.libsonnet` --- contains general parameters for all environments
* `environments/default.libsonnet` --- contains parameter overrides for **default** environment

Let's open `environments/base.libsonnet` and add the parameters for our first component there:

```javascript
{
  components: {
    website: {
      name: 'example-docs',
      image: 'registry.gitlab.com/kvaps/docs.example.org/website:v0.0.1',
      replicas: 1,
      containerPort: 80,
      servicePort: 80,
      nodeSelector: {},
      tolerations: [],
      ingressClass: 'nginx',
      domain: 'docs.example.org',
    },
  },
}
```

Create also our first component `components/website.jsonnet`:
```javascript
local env = {
  name: std.extVar('qbec.io/env'),
  namespace: std.extVar('qbec.io/defaultNs'),
};
local p = import '../params.libsonnet';
local params = p.components.website;

[
  {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      labels: { app: params.name },
      name: params.name,
    },
    spec: {
      replicas: params.replicas,
      selector: {
        matchLabels: {
          app: params.name,
        },
      },
      template: {
        metadata: {
          labels: { app: params.name },
        },
        spec: {
          containers: [
            {
              name: 'darkhttpd',
              image: params.image,
              ports: [
                {
                  containerPort: params.containerPort,
                },
              ],
            },
          ],
          nodeSelector: params.nodeSelector,
          tolerations: params.tolerations,
          imagePullSecrets: [{ name: 'regsecret' }],
        },
      },
    },
  },
  {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      labels: { app: params.name },
      name: params.name,
    },
    spec: {
      selector: {
        app: params.name,
      },
      ports: [
        {
          port: params.servicePort,
          targetPort: params.containerPort,
        },
      ],
    },
  },
  {
    apiVersion: 'extensions/v1beta1',
    kind: 'Ingress',
    metadata: {
      annotations: {
        'kubernetes.io/ingress.class': params.ingressClass,
      },
      labels: { app: params.name },
      name: params.name,
    },
    spec: {
      rules: [
        {
          host: params.domain,
          http: {
            paths: [
              {
                backend: {
                  serviceName: params.name,
                  servicePort: params.servicePort,
                },
              },
            ],
          },
        },
      ],
    },
  },
]
```

In this file we described three Kubernetes entities, these are: **Deployment**, **Service** and **Ingress**. We could separate them into different components, but at this stage, one is enough for us.

The syntax **jsonnet** is very similar to regular json. In principle regular json is already valid jsonnet, so at first it might be easier for you to use some online services like **yaml2json** to convert your usual yaml manifests to json format, or if your components do not contain any variables, they can be completely placed as usual yaml file.

{{< note >}}
I highly recommend you to install a plugin for your editor for working with **jsonnet**.

For example, there is a nice plugin **vim-jsonnet** for vim, that turns on syntax highlighting and automatically runs `jsonnet fmt` during each save (it requires installed **jsonnet** binary).
{{< /note >}}

Everything is ready to start the deployment:

To see what exactly will be applied, just run:
```bash
qbec show default
```
In the output, you will see rendered yaml-manifests that will be applied to the default cluster.

Ok, now apply:
```bash
qbec apply default
```

In the output, you will always see what changes will be done in your cluster, qbec will ask you to accept the changes. By typing `y` you can confirm with that.

Done, now our application is deployed!

After any change in description, you can always do:
```bash
qbec diff default
```
to see how these changes will affect the current deployment

Do not forget to commit our changes:
```
cd ../..
git add deploy/website
git commit -m "Add deploy for website"
```

---

# 5. Trying Gitlab-runner with Kubernetes-executor {#gitlab-runner}

Until recently, I used only the usual gitlab-runner on a prepared machine (LXC-container) with the shell- or docker-executor.   
From the begining we had several of these runners defined globally in our Gitlab. They were building docker images for all our projects.

But as practice has shown, this case is not so ideal, in terms of both practicality and security. It is much better and ideologically more correct to have separate runners deployed per each project, or even per each environment.

Fortunately, this is not a problem at all, since now we will deploy **gitlab-runner** directly as part of our application directly to Kubernetes.

Gitlab provides a helm-chart ready for deploying gitlab-runner in Kubernetes. Thus, all you need to do is find out the **registration token** for our project in **Settings → CI / CD → Runners** and pass it to Helm:
```bash
helm repo add gitlab https://charts.gitlab.io

helm install gitlab-runner \
  --set gitlabUrl=https://gitlab.com \
  --set runnerRegistrationToken=yga8y-jdCusVDn_t4Wxc \
  --set rbac.create=true \
  gitlab/gitlab-runner
```

Where:
* `https://gitlab.com` --- is address of your Gitlab-server.
* `yga8y-jdCusVDn_t4Wxc` --- is registration token for your project.
* `rbac.create=true` --- provides all the necessary privileges to the runner for make it possible to create new pods and perform our jobs using the Kubernetes-executor.

If everything is done correctly, you should see the registered runner in the **Runners** section in the settings page of your project.

> 
> **[Screenshot of added runner](https://habrastorage.org/webt/at/lx/g_/atlxg_u6rjn4n0pkcpn8--2gare.png)**
>

Is it that simple? --- yes, so simple! No more hassle with manual runners registration, since now all the runners will be created and destroyed automatically.

---

# 6. Deploying Helm-charts with QBEC {#qbec-helm}

Since we decided to consider **gitlab-runner** as part of our project, it is time to describe it in our Git-repository.

We could describe it as a separate component of **website**, but in the future we plan to deploy different copies of **website** very often, unlike `gitlab-runner`, which will be deployed only once per each Kubernetes cluster. So let's initialize a separate application for it:

```bash
cd deploy
qbec init gitlab-runner
cd gitlab-runner
```

This time we will not describe Kubernetes entities manually, but take a ready Helm chart. One of the qbec's advantages is the ability to render Helm charts directly from the Git-repository.

Let's connect it using git submodule:

```bash
git submodule add https://gitlab.com/gitlab-org/charts/gitlab-runner vendor/gitlab-runner
```

Now the `vendor/gitlab-runner` directory contains link to repository with a chart for gitlab-runner.

{{< note >}}
Similar way, you can connect and other repositories, for example, the whole repository with official charts **https://github.com/helm/charts**
{{< /note >}}

Let's describe component `components/gitlab-runner.jsonnet`:

```javascript
local env = {
  name: std.extVar('qbec.io/env'),
  namespace: std.extVar('qbec.io/defaultNs'),
};
local p = import '../params.libsonnet';
local params = p.components.gitlabRunner;

std.native('expandHelmTemplate')(
  '../vendor/gitlab-runner',
  params.values,
  {
    nameTemplate: params.name,
    namespace: env.namespace,
    thisFile: std.thisFile,
    verbose: true,
  }
)
```

The first argument to `expandHelmTemplate` is path to the chart, then `params.values` which we take from the environment parameters, then an object with
- `nameTemplate` --- release name
- `namespace` --- namespace passing to the Helm
- `thisFile` --- required parameter passing the path to the current file
- `verbose` --- will show `helm template` command with all its arguments when rendering a chart

Now let's describe the parameters for our component in `environments/base.libsonnet`:

```javascript
local secrets = import '../secrets/base.libsonnet';

{
  components: {
    gitlabRunner: {
      name: 'gitlab-runner',
      values: {
        gitlabUrl: 'https://gitlab.com/',
        rbac: {
          create: true,
        },
        runnerRegistrationToken: secrets.runnerRegistrationToken,
      },
    },
  },
}
```

Pay attention we are taking `runnerRegistrationToken` from the external file `secrets/base.libsonnet`, let's create it:

```javascript
{
  runnerRegistrationToken: 'yga8y-jdCusVDn_t4Wxc',
}
```

Check if everything works:
```bash
qbec show default
```

if everything fine, then we can remove our early deployed Helm-release:
```bash
helm uninstall gitlab-runner
```

and deploy it again, but using qbec:
```bash
qbec apply default
```

---

# 7. Getting started with git-crypt {#git-crypt}

**[Git-crypt](https://github.com/AGWA/git-crypt)** is a tool that allows you to configure transparent encryption for your repository.

At the moment, the structure of our directory for gitlab-runner looks like this:

```
.
├── components
│   ├── gitlab-runner.jsonnet
├── environments
│   ├── base.libsonnet
│   └── default.libsonnet
├── params.libsonnet
├── qbec.yaml
├── secrets
│   └── base.libsonnet
└── vendor
    └── gitlab-runner (submodule)
```
But save secrets in Git is not safe, is it? So we need to encrypt them by proper way.

{{< note >}}
Usually it does not making much sense just for the single variable, as you can pass the secrets to **qbec** using environment variables of your CI-system.

But pay attention that there might be more complex projects which might contain much more secrets. It will be extremely difficult to pass all of them using environment variables.

Also in this case I would not be able to tell you about such a wonderful tool as **git-crypt**.
{{< /note >}}
{{< note >}}
**Git-crypt** is also quite convenient because it allows you to save the whole history of secrets, as well as compare, merge and resolve conflicts in the same way as when using standard Git.
{{< /note >}}

The first step after installing **git-crypt** we need to generate the keys for our repository:

```
git crypt init
```

If you have a PGP-key, then you can immediately add yourself as a collaborator for this project:

```
git-crypt add-gpg-user kvapss@gmail.com
```

Thus, you can always decrypt this repository using your private key.

If you don’t have a PGP-key and do not plan to have it, then you can go the other way and export the project key:

```
git crypt export-key /path/to/keyfile
```

That way, anyone who having the exported **keyfile** could decrypt your repository.

It is time to configure our first secret.  
Remember that we are still in the directory `deploy/gitlab-runner/`, where we have the directory `secrets/`, let's encrypt all the files inside it. To achieve this we should create the file `secrets/.gitattributes` with the following content:

```git
* filter=git-crypt diff=git-crypt
.gitattributes !filter !diff
```

As can be seen from the content, all files mask `*` will be run through **git-crypt**, with the exception of `.gitattributes` itself

We can verify this by executing:
```bash
git crypt status -e
```
In the output, we see a list of all files in the repository for which encryption is enabled

That's all, now we can bravely commit our changes:
```bash
cd ../..
git add .
git commit -m "Add deploy for gitlab-runner"
``` 

To lock the repository, just do:

```bash
git crypt lock
```

and all encrypted files will turn into a binary objects, it's will be impossible to read them.
To decrypt a repository, do:

```bash
git crypt unlock
```

---

# 8. Preparing toolbox image {#toolbox}

A toolbox image is such an image with all the tools needed to perform deploy operationg in our project. It will be used by the gitlab-runner to perform typical deployment tasks.

Everything is simple here, create a new `dockerfiles/toolbox/Dockerfile` with the following content:

```Dockerfile
FROM alpine:3.11

RUN apk add --no-cache git git-crypt

RUN QBEC_VER=0.10.3 \
 && wget -O- https://github.com/splunk/qbec/releases/download/v${QBEC_VER}/qbec-linux-amd64.tar.gz \
     | tar -C /tmp -xzf - \
 && mv /tmp/qbec /tmp/jsonnet-qbec /usr/local/bin/

RUN KUBECTL_VER=1.17.0 \
 && wget -O /usr/local/bin/kubectl \
      https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VER}/bin/linux/amd64/kubectl \
 && chmod +x /usr/local/bin/kubectl

RUN HELM_VER=3.0.2 \
 && wget -O- https://get.helm.sh/helm-v${HELM_VER}-linux-amd64.tar.gz \
     | tar -C /tmp -zxf - \
 && mv /tmp/linux-amd64/helm /usr/local/bin/helm
```

As you can see, this image contain all the tools we used to deploy our application. We don't need only **kubectl** here, but you might want to play with it at the pipeline setup stage.

Also, in order to be able to communicate with Kubernetes and perform a deployment operations, we need to configure the role for the pods created by gitlab-runner.

To do this, go to the directory with gitlab-runner:

```bash
cd deploy/gitlab-runner
```
and add new component `components/rbac.jsonnet`:

```javascript
local env = {
  name: std.extVar('qbec.io/env'),
  namespace: std.extVar('qbec.io/defaultNs'),
};
local p = import '../params.libsonnet';
local params = p.components.rbac;

[
  {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    metadata: {
      labels: {
        app: params.name,
      },
      name: params.name,
    },
  },
  {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'Role',
    metadata: {
      labels: {
        app: params.name,
      },
      name: params.name,
    },
    rules: [
      {
        apiGroups: [
          '*',
        ],
        resources: [
          '*',
        ],
        verbs: [
          '*',
        ],
      },
    ],
  },
  {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'RoleBinding',
    metadata: {
      labels: {
        app: params.name,
      },
      name: params.name,
    },
    roleRef: {
      apiGroup: 'rbac.authorization.k8s.io',
      kind: 'Role',
      name: params.name,
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: params.name,
        namespace: env.namespace,
      },
    ],
  },
]
```

We will also describe the new parameters in `environments/base.libsonnet`, which now will looks like:

```javascript
local secrets = import '../secrets/base.libsonnet';

{
  components: {
    gitlabRunner: {
      name: 'gitlab-runner',
      values: {
        gitlabUrl: 'https://gitlab.com/',
        rbac: {
          create: true,
        },
        runnerRegistrationToken: secrets.runnerRegistrationToken,
        runners: {
          serviceAccountName: $.components.rbac.name,
          image: 'registry.gitlab.com/kvaps/docs.example.org/toolbox:v0.0.1',
        },
      },
    },
    rbac: {
      name: 'gitlab-runner-deploy',
    },
  },
}
```

Note `$.components.rbac.name` refers to `name` for component `rbac`

Let's check what has changed:

```bash
qbec diff default
```

and apply our changes to Kubernetes:

```bash
qbec apply default
```

Also, don't forget to commit our changes to Git:
```
cd ../..
git add dockerfiles/toolbox
git commit -m "Add Dockerfile for toolbox"
git add deploy/gitlab-runner
git commit -m "Configure gitlab-runner to use toolbox"
```

---

# 9. Our first pipeline and building images using tags {#pipeline-build}

In the project's root we will create `.gitlab-ci.yml` with the following content:

```yaml
.build_docker_image:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:debug-v0.15.0
    entrypoint: [""]
  before_script:
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json

build_toolbox:
  extends: .build_docker_image
  script:
    - /kaniko/executor --cache --context $CI_PROJECT_DIR/dockerfiles/toolbox --dockerfile $CI_PROJECT_DIR/dockerfiles/toolbox/Dockerfile --destination $CI_REGISTRY_IMAGE/toolbox:$CI_COMMIT_TAG
  only:
    refs:
      - tags

build_website:
  extends: .build_docker_image
  variables:
    GIT_SUBMODULE_STRATEGY: normal
  script:
    - /kaniko/executor --cache --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/dockerfiles/website/Dockerfile --destination $CI_REGISTRY_IMAGE/website:$CI_COMMIT_TAG
  only:
    refs:
      - tags
```

Note that we use `GIT_SUBMODULE_STRATEGY: normal` for those jobs where you need to explicitly initialize the submodules before execution.

Do not forget to commit our changes:
```
git add .gitlab-ci.yml
git commit -m "Automate docker build"
```

I think we are brave enough to call it version `v0.0.1` and add a tag:

```bash
git tag v0.0.1
```

We will use tags whenever we need to release a new version. Tags in Docker images will be sticked to Git tags. Each push with a new tag will initialize image building with this tag.

Run `git push --tags`, and take a look at our first pipeline:

>
> **[Screenshot of first pipeline](https://habrastorage.org/webt/5u/ce/fg/5ucefgejcfjz7jpwvou206mwufy.png)**
>

{{< warning >}}
Pay attention that using tags is suitable for builing docker images, but it is not suitable for deploying an application in Kubernetes. Since new tags can be added to old commits, the pipeline for them will initiate the deployment process for the old version.

To solve this problem, usually the docker images building is connected to tags, and the application deployment to the **master** branch where images versions are hardcoded in the configuration. It is in this case that you will able to rollback by initializing a simple revert of **master** branch.
{{< /warning >}}

---

# 10. Deployment automation {#pipeline-deploy}

For allow Gitlab-runner to decrypt our secrets, we need to export the repository key and add it to our CI environment variables:

```
git crypt export-key /tmp/docs-repo.key
base64 -w0 /tmp/docs-repo.key; echo
```
the output string should be saved in Gitlab, let's go to the settings of our project:
 **Settings → CI / CD → Variables** 

And create a new variable:

| Type | Key          | Value           | Protected                              | Masked | Scope            |
|------|--------------|-----------------|----------------------------------------|--------|------------------|
| File | GITCRYPT_KEY | `<your string>` | true *(for the training can be false)* | true   | All environments |

>
> **[Screenshot of added variable](https://habrastorage.org/webt/vj/li/ea/vjliealfwwsmiy4-nvjfvcf89ig.png)**
>

Now update our `.gitlab-ci.yml` adding to it:

```yaml
.deploy_qbec_app:
  stage: deploy
  only:
    refs:
      - master

deploy_gitlab_runner:
  extends: .deploy_qbec_app
  variables:
    GIT_SUBMODULE_STRATEGY: normal
  before_script:
    - base64 -d "$GITCRYPT_KEY" | git-crypt unlock -
  script:
    - qbec apply default --root deploy/gitlab-runner --force:k8s-context __incluster__ --wait --yes

deploy_website:
  extends: .deploy_qbec_app
  script:
    - qbec apply default --root deploy/website --force:k8s-context __incluster__ --wait --yes
```
Here we have used several new options for qbec:

* `--root some/app` --- allows to define the directory with the application
* `--force:k8s-context __incluster__` --- this is a magic variable that says that forces deployment to the same cluster where gtilab-runner is running. This must be done, because otherwise qbec will try to seek a suitable Kubernetes server in the kubeconfig
* `--wait` --- makes qbec wait until the created resources become to Ready state then exit with a successful exit-code.
* `--yes` --- disables the interactive shell **Are you sure?** during deployment

Do not forget to commit our changes:
```
git add .gitlab-ci.yml
git commit -m "Automate deploy"
```

And after the `git push` we will see how our applications were deployed:

>
> **[Screenshot of second pipeline](https://habrastorage.org/webt/0p/aj/vs/0pajvs-a-lrxvfuw8zylnj6lleg.png)**
>

---

# 11. Artifacts and building on push to master {#artifacts}

Usually the above steps are enough to build and deliver almost any microservice, but we don’t want to add a tag every time we need to update the site.  
Therefore, we will go by the more dynamic way and configure the digest based deployment direct in the master branch.

The idea is simple: now the image of our **website** will rebuild each time you push to **master**, and after that it automatically deploy to Kubernetes.

Let's update these two jobs in our `.gitlab-ci.yml`:

```yaml
build_website:
  extends: .build_docker_image
  variables:
    GIT_SUBMODULE_STRATEGY: normal
  script:
    - mkdir -p $CI_PROJECT_DIR/artifacts
    - /kaniko/executor --cache --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/dockerfiles/website/Dockerfile --destination $CI_REGISTRY_IMAGE/website:$CI_COMMIT_REF_NAME --digest-file $CI_PROJECT_DIR/artifacts/website.digest
  artifacts:
    paths:
      - artifacts/
  only:
    refs:
      - master
      - tags

deploy_website:
  extends: .deploy_qbec_app
  script:
    - DIGEST="$(cat artifacts/website.digest)"
    - qbec apply default --root deploy/website --force:k8s-context __incluster__ --wait --yes --vm:ext-str digest="$DIGEST"
```

Note that we added our **master** branch to `refs` for the `build_website` job, also now we're using `$CI_COMMIT_REF_NAME` instead of `$CI_COMMIT_TAG`. This way we are stopping using Git tags for the docker images and now they will be created with the commit branch name for each pipeline. It also will work with the **tags**, which will allow us to save snapshots of specific site versions in docker-registry.

Option `--vm:ext-str digest="$DIGEST"` for qbec --- allows you to pass an external variable to jsonnet.

Since we want to apply every version of our application to the cluster, we can't use the tag names anymore, becaus they will be unchanged. We need to specify exact image version for the every deployment operation to trigger rolling-update when it changes.

Here, we will use the ability of Kaniko to save the digest of the image to a file (option `--digest-file`)  
Then we will passtrough this file and read it at the deployment stage.

Let's update the parameters for our `deploy/website/environments/base.libsonnet` which will now look like this:

```javascript
{
  components: {
    website: {
      name: 'example-docs',
      image: 'registry.gitlab.com/kvaps/docs.example.org/website@' + std.extVar('digest'),
      replicas: 1,
      containerPort: 80,
      servicePort: 80,
      nodeSelector: {},
      tolerations: [],
      ingressClass: 'nginx',
      domain: 'docs.example.org',
    },
  },
}
```

Done, now any commit to **master** will trigger the docker image builing for **website**, and then deploy it to Kubernetes.

Do not forget to commit our changes:

```bash
git add .
git commit -m "Configure dynamic build"
```

Let's check, after `git push` we should see something like this:

>
> **[Screenshot of pipeline for master](https://habrastorage.org/webt/7_/ry/nh/7_rynh5lgu_8hqnnl_gasx73zwq.png)**
>

We do not need to redeploy the gitlab-runner every time, unless, of course, nothing has changed in its configuration, so let's fix it in `.gitlab-ci.yml`:

```yaml
deploy_gitlab_runner:
  extends: .deploy_qbec_app
  variables:
    GIT_SUBMODULE_STRATEGY: normal
  before_script:
    - base64 -d "$GITCRYPT_KEY" | git-crypt unlock -
  script:
    - qbec apply default --root deploy/gitlab-runner --force:k8s-context __incluster__ --wait --yes
  only:
    changes:
      - deploy/gitlab-runner/**/*
```

`changes` allows you to monitor changes in `deploy/gitlab-runner/` and trigger job only in this case:

Do not forget to commit our changes:
```bash
git add .gitlab-ci.yml
git commit -m "Reduce gitlab-runner deploy"
```

`git push`, that's better:

* **[Screenshot of updated pipeline](https://habrastorage.org/webt/-t/9b/3m/-t9b3mtofbunu7xfogpmb0pacsm.png)**

---

# 12. Dynamic environments {#dynamic-environments}

It is time to diversify our pipeline with dynamic environments.

First, update the `build_website` job in our `.gitlab-ci.yml`, removing the `only` block from it, which will force Gitlab to trigger it on any commit in any branch:

```
build_website:
  extends: .build_docker_image
  variables:
    GIT_SUBMODULE_STRATEGY: normal
  script:
    - mkdir -p $CI_PROJECT_DIR/artifacts
    - /kaniko/executor --cache --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/dockerfiles/website/Dockerfile --destination $CI_REGISTRY_IMAGE/website:$CI_COMMIT_REF_NAME --digest-file $CI_PROJECT_DIR/artifacts/website.digest
  artifacts:
    paths:
      - artifacts/
```

Then update the job `deploy_website`, add the `environment` block there:

```yaml
deploy_website:
  extends: .deploy_qbec_app
  environment:
    name: prod
    url: https://docs.example.org
  script:
    - DIGEST="$(cat artifacts/website.digest)"
    - qbec apply default --root deploy/website --force:k8s-context __incluster__ --wait --yes --vm:ext-str digest="$DIGEST"
```

This will allow Gitlab to associate the job with the **prod** environment and display the correct link to it.

Now add two more jobs:

```
deploy_website:
  extends: .deploy_qbec_app
  environment:
    name: prod
    url: https://docs.example.org
  script:
    - DIGEST="$(cat artifacts/website.digest)"
    - qbec apply default --root deploy/website --force:k8s-context __incluster__ --wait --yes --vm:ext-str digest="$DIGEST"

deploy_review:
  extends: .deploy_qbec_app
  environment:
    name: review/$CI_COMMIT_REF_NAME
    url: http://$CI_ENVIRONMENT_SLUG.docs.example.org
    on_stop: stop_review
  script:
    - DIGEST="$(cat artifacts/website.digest)"
    - qbec apply review --root deploy/website --force:k8s-context __incluster__ --wait --yes --vm:ext-str digest="$DIGEST" --vm:ext-str subdomain="$CI_ENVIRONMENT_SLUG" --app-tag "$CI_ENVIRONMENT_SLUG"
  only:
    refs:
    - branches
  except:
    refs:
      - master

stop_review:
  extends: .deploy_qbec_app
  environment:
    name: review/$CI_COMMIT_REF_NAME
    action: stop
  stage: deploy
  before_script:
    - git clone "$CI_REPOSITORY_URL" master
    - cd master
  script:
    - qbec delete review --root deploy/website --force:k8s-context __incluster__ --yes --vm:ext-str digest="$DIGEST" --vm:ext-str subdomain="$CI_ENVIRONMENT_SLUG" --app-tag "$CI_ENVIRONMENT_SLUG"
  variables:
    GIT_STRATEGY: none
  only:
    refs:
    - branches
  except:
    refs:
      - master
  when: manual
```

They will run on push to any branch except master and will deploy a preview version of the site.

We see a new option for qbec: `--app-tag` --- it allows you to add specific tag for the deployed versions of the application and work only within context of this tag.  
Thus, we can do not create a separate environment for each review, but simply reuse the same one.

Here we also used `qbec apply review`, instead of `qbec apply default` --- this is how exactly we describe the differences for our environments (review and default):

Add **review** environment to `deploy/website/qbec.yaml`

```yaml
spec:
  environments:
    review:
      defaultNamespace: docs
      server: https://kubernetes.example.org:8443
```

Then declare it in `deploy/website/params.libsonnet`:
```javascript
local env = std.extVar('qbec.io/env');
local paramsMap = {
  _: import './environments/base.libsonnet',
  default: import './environments/default.libsonnet',
  review: import './environments/review.libsonnet',
};

if std.objectHas(paramsMap, env) then paramsMap[env] else error 'environment ' + env + ' not defined in ' + std.thisFile
```

And write the custom parameters for it in `deploy/website/environments/review.libsonnet`:

```javascript
// this file has the param overrides for the default environment
local base = import './base.libsonnet';
local slug = std.extVar('qbec.io/tag');
local subdomain = std.extVar('subdomain');

base {
  components+: {
    website+: {
      name: 'example-docs-' + slug,
      domain: subdomain + '.docs.example.org',
    },
  },
}
```

Let's also take a closer look at the **stop_review** job, it will be triggered when the branch is removed. To force Gitlab not try to checkout on it, we use `GIT_STRATEGY: none`, later we clone the **master** branch and using it to delete the review version deployment.  
This is little ugly, but I have not yet found more beautiful way.  
An alternative way would be to deploy each review version to separated namespace, and then remove whole namespace with the application.

Do not forget to commit our changes:
```
git add .
git commit -m "Enable automatic review"
```

`git push`, `git checkout -b test`, `git push origin test`, and check this:

>
> **[Screenshot of created environments in Gitlab](https://habrastorage.org/webt/wc/pz/ce/wcpzcedcwgfqvr0h_thgcw4ylqk.png)**
>

Everything works? --- excellent, delete our test branch: `git checkout master`, `git push origin :test`, check that the environment removal finished without errors.

{{< warning >}}
Here I want to clarify right away that any developer able to create branches in the project can also change `.gitlab-ci.yml` file in this branch and gain access to secret variables.  
Therefore, it is strongly recommended you to allow their use only for protected branches, for example in **master**, or provide a separated set of variables for each environment.
{{< /warning >}}

---

# 13. Review Apps {#review-apps}

**[Review Apps](https://docs.gitlab.com/ee/ci/review_apps/)** is such feature that allows you to add a button for each file in the repository to quickly view it in deployed environment.  
For these buttons to appear, you need to create a file `.gitlab/route-map.yml` and describe all the path transformations in it, in our case it will be very simple:

```yaml
# Indices
- source: /content\/(.+?)_index\.(md|html)/ 
  public: '\1'

# Pages
- source: /content\/(.+?)\.(md|html)/ 
  public: '\1/'
```

Do not forget to commit our changes:
```
git add .gitlab/
git commit -m "Enable review apps"
```

`git push`, and check:

>
> **[Screenshot of Review App button](https://habrastorage.org/webt/ns/wi/za/nswizajvjjozyoluazo21pzq7t8.png)**
>

# Job is done!

**Sources of this work:**
- on Gitlab: https://gitlab.com/kvaps/docs.example.org
- on GitHub: https://github.com/kvaps/docs.example.org

Thank you for your attention, I hope you enjoyed ![image](http://www.kolobok.us/smiles/standart/derisive.gif)
