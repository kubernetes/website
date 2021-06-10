---
layout: blog
title: 'A Better Way to Provision Kubernetes Resources Using Terraform'
date: 2021-06-28
slug: a-better-way-to-provision-kubernetes-resources-using-terraform
---

**Author:** Philipp Strube (Kubestack)

Terraform is immensely powerful when it comes to defining and maintaining infrastructure as code.
In combination with a declarative API, like a cloud provider API, it can determine, preview, and apply changes to the codeified infrastructure.

Consequently, it is common for teams to use Terraform to define the infrastructure of their Kubernetes clusters.
And as a platform to build platforms, Kubernetes commonly requires a number of additional services before workloads can be deployed.
Think of ingress controllers or logging and monitoring agents and so on.
But despite Kubernetes' own declarative API, and the obvious benefits of maintaining a cluster's infrastructure and services from the same infrastructure as code repository, Terraform is far from the first choice to provision Kubernetes resources.

With [Kubestack](https://www.kubestack.com/), the open-source Terraform framework I maintain, I'm on a mission to provide the best developer experience for teams working with Terraform and Kubernetes.
And unified provisioning of all platform components, from cluster infrastructure to cluster services, is something I consider crucial in my relentless pursuit of said developer experience.

Because of that, the two common approaches to provision Kuberentes resources using Terraform never really appealed to me.

On the one hand, there's the Kubernetes provider.
And while it integrates Kubernetes resources into Terraform, maintaining the Kubernetes resources in HCL is a lot of effort.
Especially for Kubernetes YAML you consume from upstream.
On the other hand, there are the [Helm provider](https://registry.terraform.io/providers/hashicorp/helm/latest) and the [Kubectl provider](https://registry.terraform.io/providers/gavinbunney/kubectl/latest).
These two use native YAML instead of HCL, but do not integrate the Kubernetes resources into the Terraform state and, as a consequence, lifecycle.

I believe my [Kustomization provider](https://registry.terraform.io/providers/kbst/kustomization/latest) based modules are a better alternative because of three distinct benefits:

1. Like Kustomize, the upstream YAML is left untouched, meaning upstream updates require minimal maintenance effort.
2. By defining the Kustomize overlay in HCL, all Kubernetes resources are fully customizable using values from Terraform.
3. Each Kubernetes resource is tracked individually in Terraform state, so diffs and plans show the changes to the actual Kubernetes resources.

To make these benefits less abstract, let's compare my [Nginx ingress module](https://www.kubestack.com/catalog/nginx) with [one using the Helm provider](https://registry.terraform.io/modules/terraform-module/release/helm/latest) to provision [Nginx ingress](https://github.com/kubernetes/ingress-nginx).

The Terraform configuration for both examples is available in [this repository](https://github.com/kbst/terraform-helm-vs-kustomize). Let's take a look at the Helm module first.

## The Helm-based module

Usage of the module is straightforward. First, configure the Kubernetes and Helm providers.

```hcl
provider "kubernetes" {
  config_path    = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}
```

Then define a `kubernetes_namespace` and call the `release/helm` module.

```hcl
resource "kubernetes_namespace" "nginx_ingress" {
  metadata {
    name = "ingress-nginx"
  }
}

module "nginx_ingress" {
  source  = "terraform-module/release/helm"
  version = "2.6.10"

  namespace  = kubernetes_namespace.nginx_ingress.metadata.0.name
  repository =  "https://kubernetes.github.io/ingress-nginx"

  app = {
    name          = "ingress-nginx"
    version       = "3.33.0"
    chart         = "ingress-nginx"
    force_update  = true
    wait          = false
    recreate_pods = false
    deploy        = 1
  }

  set = [
    {
      name = "replicaCount"
      value = 2
    }
  ]
}
```

If you now run a `terraform plan` for this configuration, you see the resources to be created.

```hcl
Terraform will perform the following actions:

  # kubernetes_namespace.nginx_ingress will be created
  + resource "kubernetes_namespace" "nginx_ingress" {
      + id = (known after apply)

      + metadata {
          + generation       = (known after apply)
          + name             = "ingress-nginx"
          + resource_version = (known after apply)
          + uid              = (known after apply)
        }
    }

  # module.nginx_ingress.helm_release.this[0] will be created
  + resource "helm_release" "this" {
      + atomic                     = false
      + chart                      = "ingress-nginx"
      + cleanup_on_fail            = false
      + create_namespace           = false
      + dependency_update          = false
      + disable_crd_hooks          = false
      + disable_openapi_validation = false
      + disable_webhooks           = false
      + force_update               = true
      + id                         = (known after apply)
      + lint                       = true
      + manifest                   = (known after apply)
      + max_history                = 0
      + metadata                   = (known after apply)
      + name                       = "ingress-nginx"
      + namespace                  = "ingress-nginx"
      + recreate_pods              = false
      + render_subchart_notes      = true
      + replace                    = false
      + repository                 = "https://kubernetes.github.io/ingress-nginx"
      + reset_values               = false
      + reuse_values               = false
      + skip_crds                  = false
      + status                     = "deployed"
      + timeout                    = 300
      + values                     = []
      + verify                     = false
      + version                    = "3.33.0"
      + wait                       = false
      + wait_for_jobs              = false

      + set {
          + name  = "replicaCount"
          + value = "2"
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.
```

And this is the key issue with how Helm is integrated into the Terraform workflow.
The plan does not tell you what Kubernetes resources will be created for the Nginx ingress controller.
And neither are the Kubernetes resources tracked in Terraform state, as shown by the apply output.

```hcl
kubernetes_namespace.nginx_ingress: Creating...
kubernetes_namespace.nginx_ingress: Creation complete after 0s [id=ingress-nginx]
module.nginx_ingress.helm_release.this[0]: Creating...
module.nginx_ingress.helm_release.this[0]: Creation complete after 6s [id=ingress-nginx]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

Similarly, if planning a change, there's again no way to tell what the changes to the Kubernetes resources will be.

So if you increase the `replicaCount` value of the Helm chart, the `terraform plan` will merely show the change to the `helm_release` resource.

```hcl
set = [
  {
    name = "replicaCount"
    value = 2
  }
]
```

What will the changes to the Kubernetes resources be?
And more importantly, is it a simple in-place update, or does it require a destroy-and-recreate?
Looking at the plan, you have no way of knowing.

```hcl
Terraform will perform the following actions:

  # module.nginx_ingress.helm_release.this[0] will be updated in-place
  ~ resource "helm_release" "this" {
        id                         = "ingress-nginx"
        name                       = "ingress-nginx"
        # (27 unchanged attributes hidden)

      - set {
          - name  = "replicaCount" -> null
          - value = "2" -> null
        }
      + set {
          + name  = "replicaCount"
          + value = "3"
        }
    }

Plan: 0 to add, 1 to change, 0 to destroy.
```

## The Kustomize-based module

Now, let's take a look at the same steps for the Kustomize-based module.
Usage is similar.
First require the `kbst/kustomization` provider and configure it.

```hcl
terraform {
  required_providers {
    kustomization = {
      source = "kbst/kustomization"
    }
  }
}

provider "kustomization" {
  kubeconfig_path = "~/.kube/config"
}
```

Then call the `nginx/kustomization` module.

```hcl
module "nginx_ingress" {
  source = "kbst.xyz/catalog/nginx/kustomization"
  version = "0.46.0-kbst.1"

  configuration_base_key = "default"
  configuration = {
    default = {
      replicas = [{
        name = "ingress-nginx-controller"
        count = 2
      }]
    }
  }
}
```

Unlike for the Helm-based module though, when you run `terraform plan` now you will see each Kubernetes resource and its actual configuration individually.
To keep this blog post palatable, I show the details for the namespace only.

```hcl
Terraform will perform the following actions:

  # module.nginx_ingress.kustomization_resource.p0["~G_v1_Namespace|~X|ingress-nginx"] will be created
  + resource "kustomization_resource" "p0" {
      + id       = (known after apply)
      + manifest = jsonencode(
            {
              + apiVersion = "v1"
              + kind       = "Namespace"
              + metadata   = {
                  + annotations = {
                      + app.kubernetes.io/version      = "v0.46.0"
                      + catalog.kubestack.com/heritage = "kubestack.com/catalog/nginx"
                      + catalog.kubestack.com/variant  = "base"
                    }
                  + labels      = {
                      + app.kubernetes.io/component  = "ingress-controller"
                      + app.kubernetes.io/instance   = "ingress-nginx"
                      + app.kubernetes.io/managed-by = "kubestack"
                      + app.kubernetes.io/name       = "nginx"
                    }
                  + name        = "ingress-nginx"
                }
            }
        )
    }
    # module.nginx_ingress.kustomization_resource.p1["apps_v1_Deployment|ingress-nginx|ingress-nginx-controller"] will be created
    # module.nginx_ingress.kustomization_resource.p1["batch_v1_Job|ingress-nginx|ingress-nginx-admission-create"] will be created
    # module.nginx_ingress.kustomization_resource.p1["batch_v1_Job|ingress-nginx|ingress-nginx-admission-patch"] will be created
    # module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_ClusterRoleBinding|~X|ingress-nginx"] will be created
    # module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_ClusterRoleBinding|~X|ingress-nginx-admission"] will be created
    # module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_ClusterRole|~X|ingress-nginx"] will be created
    # module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_ClusterRole|~X|ingress-nginx-admission"] will be created
    # module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_RoleBinding|ingress-nginx|ingress-nginx"] will be created
    # module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_RoleBinding|ingress-nginx|ingress-nginx-admission"] will be created
    # module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_Role|ingress-nginx|ingress-nginx"] will be created
    # module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_Role|ingress-nginx|ingress-nginx-admission"] will be created
    # module.nginx_ingress.kustomization_resource.p1["~G_v1_ConfigMap|ingress-nginx|ingress-nginx-controller"] will be created
    # module.nginx_ingress.kustomization_resource.p1["~G_v1_ServiceAccount|ingress-nginx|ingress-nginx"] will be created
    # module.nginx_ingress.kustomization_resource.p1["~G_v1_ServiceAccount|ingress-nginx|ingress-nginx-admission"] will be created
    # module.nginx_ingress.kustomization_resource.p1["~G_v1_Service|ingress-nginx|ingress-nginx-controller"] will be created
    # module.nginx_ingress.kustomization_resource.p1["~G_v1_Service|ingress-nginx|ingress-nginx-controller-admission"] will be created
    # module.nginx_ingress.kustomization_resource.p2["admissionregistration.k8s.io_v1_ValidatingWebhookConfiguration|~X|ingress-nginx-admission"] will be created
```

Applying, again, has all the individual Kubernetes resources.
And because the modules use explicit `depends_on` to handle namespaces and CRDs first and webhooks last, resources are reliably applied in the correct order.

```hcl
module.nginx_ingress.kustomization_resource.p0["~G_v1_Namespace|~X|ingress-nginx"]: Creating...
module.nginx_ingress.kustomization_resource.p0["~G_v1_Namespace|~X|ingress-nginx"]: Creation complete after 0s [id=aaed3f03-8a4b-481e-b6f0-d01e1701cf2f]
module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_ClusterRoleBinding|~X|ingress-nginx"]: Creating...
module.nginx_ingress.kustomization_resource.p1["apps_v1_Deployment|ingress-nginx|ingress-nginx-controller"]: Creating...
module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_Role|ingress-nginx|ingress-nginx-admission"]: Creating...
module.nginx_ingress.kustomization_resource.p1["~G_v1_ServiceAccount|ingress-nginx|ingress-nginx-admission"]: Creating...
module.nginx_ingress.kustomization_resource.p1["rbac.authorization.k8s.io_v1_RoleBinding|ingress-nginx|ingress-nginx"]: Creating...

...

module.nginx_ingress.kustomization_resource.p1["batch_v1_Job|ingress-nginx|ingress-nginx-admission-create"]: Creation complete after 3s [id=a12aea4c-c92c-4655-912e-e8a0ca9bb67a]
module.nginx_ingress.kustomization_resource.p2["admissionregistration.k8s.io_v1_ValidatingWebhookConfiguration|~X|ingress-nginx-admission"]: Creating...
module.nginx_ingress.kustomization_resource.p2["admissionregistration.k8s.io_v1_ValidatingWebhookConfiguration|~X|ingress-nginx-admission"]: Creation complete after 0s [id=b1046e97-bfa7-4427-96d7-c83137da2f8a]

Apply complete! Resources: 18 added, 0 changed, 0 destroyed.
```

Naturally, it also means that if you increase the replica count like this...

```hcl
replicas = [{
  name = "ingress-nginx-controller"
  count = 3
}]
```

...the `terraform plan` shows which Kubernetes resources will change and what the diff is.

```hcl
Terraform will perform the following actions:

  # module.nginx_ingress.kustomization_resource.p1["apps_v1_Deployment|ingress-nginx|ingress-nginx-controller"] will be updated in-place
  ~ resource "kustomization_resource" "p1" {
        id       = "366bd10d-745e-4172-9153-35ff5fad53d8"
      ~ manifest = jsonencode(
          ~ {
              ~ spec       = {
                  ~ replicas             = 2 -> 3
                    # (4 unchanged elements hidden)
                }
                # (3 unchanged elements hidden)
            }
        )
    }

Plan: 0 to add, 1 to change, 0 to destroy.
```

Maybe more importantly even, the Kustomization provider will also correctly show if a resource can be changed using an in-place update.
Or if a destroy-and-recreate is required because there is a change to an immutable field, for example.

This is the result of two things:

1. That, as you've just seen, every Kubernetes resource is handled individually in Terraform state, and
2. that the Kustomization provider uses Kubernetes' server-side dry-runs to determine the diff of each resource.

Based on the result of that dry-run, the provider instructs Terraform to create an in-place or a destroy-and-recreate plan.

So, as an example of such a change, imagine you need to change `spec.selector.matchLabels`.
Since `matchLabels` is an immutable field, you will see a plan that states that the Deployment resource must be replaced.
And you will see 1 to add and 1 to destroy in the plan's summary.

```hcl
Terraform will perform the following actions:

  # module.nginx_ingress.kustomization_resource.p1["apps_v1_Deployment|ingress-nginx|ingress-nginx-controller"] must be replaced
-/+ resource "kustomization_resource" "p1" {
      ~ id       = "d47635ae-16fd-4126-a07c-a9dca0b472c1" -> (known after apply)
      ~ manifest = jsonencode(
          ~ {
              ~ spec       = {
                  ~ selector             = {
                      ~ matchLabels = {
                          + example-selector             = "example"
                            # (4 unchanged elements hidden)
                        }
                    }
                  ~ template             = {
                      ~ metadata = {
                          ~ labels      = {
                              + example-selector             = "example"
                                # (4 unchanged elements hidden)
                            }
                            # (1 unchanged element hidden)
                        }
                        # (1 unchanged element hidden)
                    }
                    # (3 unchanged elements hidden)
                }
                # (2 unchanged elements hidden)
            } # forces replacement
        )
    }

Plan: 1 to add, 0 to change, 1 to destroy.
```

## Try it yourself

If you want to try the modules yourself, you can either use one of the modules from the catalog that bundle upstream YAML, like the [Prometheus operator](https://www.kubestack.com/catalog/prometheus), [Cert-Manager](https://www.kubestack.com/catalog/cert-manager), [Sealed secrets](https://www.kubestack.com/catalog/sealed-secrets), or [Tekton](https://www.kubestack.com/catalog/tektoncd), for example.

But there is also a module that can be used to [provision any Kubernetes YAML](https://www.kubestack.com/framework/documentation/cluster-service-modules#custom-manifests) in the exact same way as the catalog modules.

## Get involved

Currently, the number of services available from the catalog is still limited.

If you want to get involved, you can find the [source repository on GitHub](https://github.com/kbst/catalog).
