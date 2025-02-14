---
layout: blog
title: "Working with Terraform and Kubernetes"
date: 2020-06-29
slug: working-with-terraform-and-kubernetes
url: /blog/2020/06/working-with-terraform-and-kubernetes
author: >
  [Philipp Strube](https://twitter.com/pst418) (Kubestack) 
---

Maintaining Kubestack, an open-source [Terraform GitOps Framework](https://www.kubestack.com/lp/terraform-gitops-framework) for Kubernetes, I unsurprisingly spend a lot of time working with Terraform and Kubernetes. Kubestack provisions managed Kubernetes services like AKS, EKS and GKE using Terraform but also integrates cluster services from Kustomize bases into the GitOps workflow. Think of cluster services as everything that's required on your Kubernetes cluster, before you can deploy application workloads.

Hashicorp recently announced [better integration between Terraform and Kubernetes](https://www.hashicorp.com/blog/deploy-any-resource-with-the-new-kubernetes-provider-for-hashicorp-terraform/). I took this as an opportunity to give an overview of how Terraform can be used with Kubernetes today and what to be aware of.

In this post I will however focus only on using Terraform to provision Kubernetes API resources, not Kubernetes clusters.

[Terraform](https://www.terraform.io/intro/index.html) is a popular infrastructure as code solution, so I will only introduce it very briefly here. In a nutshell, Terraform allows declaring a desired state for resources as code, and will determine and execute a plan to take the infrastructure from its current state, to the desired state.

To be able to support different resources, Terraform requires providers that integrate the respective API. So, to create Kubernetes resources we need a Kubernetes provider. Here are our options:

## Terraform `kubernetes` provider (official)

First, the [official Kubernetes provider](https://github.com/hashicorp/terraform-provider-kubernetes). This provider is undoubtedly the most mature of the three. However, it comes with a big caveat that's probably the main reason why using Terraform to maintain Kubernetes resources is not a popular choice.

Terraform requires a schema for each resource and this means the maintainers have to translate the schema of each Kubernetes resource into a Terraform schema. This is a lot of effort and was the reason why for a long time the supported resources where pretty limited. While this has improved over time, still not everything is supported. And especially [custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) are not possible to support this way.

This schema translation also results in some edge cases to be aware of. For example, `metadata` in the Terraform schema is a list of maps. Which means you have to refer to the `metadata.name` of a Kubernetes resource like this in Terraform: `kubernetes_secret.example.metadata.0.name`.

On the plus side however, having a Terraform schema means full integration between Kubernetes and other Terraform resources. Like for [example](https://github.com/kbst/terraform-kubestack/blob/e5caa6d20926d546a045144ebe79c7cc8c0b4c8a/aws/_modules/eks/ingress.tf#L37), using Terraform to create a Kubernetes service of type `LoadBalancer` and then use the returned ELB hostname in a Route53 record to configure DNS.

The biggest benefit when using Terraform to maintain Kubernetes resources is integration into the Terraform plan/apply life-cycle. So you can review planned changes before applying them. Also, using `kubectl`, purging of resources from the cluster is not trivial without manual intervention. Terraform does this reliably.

## Terraform `kubernetes-alpha` provider

Second, the new [alpha Kubernetes provider](https://github.com/hashicorp/terraform-provider-kubernetes-alpha). As a response to the limitations of the current Kubernetes provider the Hashicorp team recently released an alpha version of a new provider.

This provider uses dynamic resource types and server-side-apply to support all Kubernetes resources. I personally think this provider has the potential to be a game changer - even if [managing Kubernetes resources in HCL](https://github.com/hashicorp/terraform-provider-kubernetes-alpha#moving-from-yaml-to-hcl) may still not be for everyone. Maybe the Kustomize provider below will help with that.

The only downside really is, that it's explicitly discouraged to use it for anything but testing. But the more people test it, the sooner it should be ready for prime time. So I encourage everyone to give it a try.

## Terraform `kustomize` provider

Last, we have the [`kustomize` provider](https://github.com/kbst/terraform-provider-kustomize). Kustomize provides a way to do customizations of Kubernetes resources using inheritance instead of templating. It is designed to output the result to `stdout`, from where you can apply the changes using `kubectl`. This approach means that `kubectl` edge cases like no purging or changes to immutable attributes still make full automation difficult.

Kustomize is a popular way to handle customizations. But I was looking for a more reliable way to automate applying changes. Since this is exactly what Terraform is great at the Kustomize provider was born.

Not going into too much detail here, but from Terraform's perspective, this provider treats every Kubernetes resource as a JSON string. This way it can handle any Kubernetes resource resulting from the Kustomize build. But it has the big disadvantage that Kubernetes resources can not easily be integrated with other Terraform resources. Remember the load balancer example from above.

Under the hood, similarly to the new Kubernetes alpha provider, the Kustomize provider also uses the dynamic Kubernetes client and server-side-apply. Going forward, I plan to deprecate this part of the Kustomize provider that overlaps with the new Kubernetes provider and only keep the Kustomize integration.

## Conclusion

For teams that are already invested into Terraform, or teams that are looking for ways to replace `kubectl` in automation, Terraform's plan/apply life-cycle has always been a promising option to automate changes to Kubernetes resources. However, the limitations of the official Kubernetes provider resulted in this not seeing significant adoption.

The new alpha provider removes the limitations and has the potential to make Terraform a prime option to automate changes to Kubernetes resources.

Teams that have already adopted Kustomize, may find integrating Kustomize and Terraform using the Kustomize provider beneficial over `kubectl` because it avoids common edge cases. Even if in this set up, Terraform can only easily be used to plan and apply the changes, not to adapt the Kubernetes resources. In the future, this issue may be resolved by combining the Kustomize provider with the new Kubernetes provider.

If you have any questions regarding these three options, feel free to reach out to me on the Kubernetes Slack in either the [#kubestack](https://app.slack.com/client/T09NY5SBT/CMBCT7XRQ) or the [#kustomize](https://app.slack.com/client/T09NY5SBT/C9A5ALABG) channel. If you happen to give any of the providers a try and encounter a problem, please file a GitHub issue to help the maintainers fix it.
