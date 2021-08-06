---
layout: blog
title: 'Updating Ingress-Nginx-Controller, to use the stable Ingress API'
date: 2021-07-26
slug: update-with-ingress-nginx
---

**Authors:** James Strong, Ricardo Katz

With all Kubernetes APIs, there is a process to creating, maintaining, and
ultimately deprecating them once they become GA. The networking.k8s.io API group is no
different. The upcoming Kubernetes 1.22 release will remove several deprecated APIs
that are relevant to networking:

- the `networking.k8s.io/v1beta1` API version of [IngressClass](/docs/concepts/services-networking/ingress/#ingress-class)
- all beta versions of [Ingress](/docs/concepts/services-networking/ingress/): `extensions/v1beta1` and `networking.k8s.io/v1beta1`

On a v1.22 Kubernetes cluster, you'll be able to access Ingress and IngressClass
objects through the stable (v1) APIs, but access via their beta APIs won't be possible.
This change has been in
in discussion since
[2017](https://github.com/kubernetes/kubernetes/issues/43214),
[2019](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) with 
1.16 Kubernetes API deprecations, and most recently in
KEP-1453: 
[Graduate Ingress API to GA](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/1453-ingress-api#122).

Because of this deprecation of older api versions, the current code-base & release of the Ingress-Nginx-Controller, will not work on Kubernetes clusters running  K8s v1.22 and above.
Hence there will be newer releases of the Ingress-Nginx-Controller, with changed code-base to handle this deprecation.
Unfortunately, the change in the code-base will break backward compatibility, of the Ingress-Nginx-Controller.
The newer releases of the Ingress-Nginx-Controller, will not work on Kubernetes versions older than v1.19.

To manage this break in backward compatibility, during the community meetings, the networking Special Interest Group, has decided to begin maintaining/releasing two different editions of the Ingress-Nginx-Controller.

- One edition of the ingress-nginx-controller will continue supporting Kubernetes versions older than 1.19.
  - This support will be available for a perod of 6 months, from the date of release, of Kubernetes version 1.22.
  - This edition of the Ingress-NGINX-Controller releases will be versions 0.X.X (but NOT 1.X.X)
  - Any additional code changes will be limited to critical bug fixes and CVEs fixes, on a need-by-need basis.


- Another edition of the ingress-nginx-controller will only support Kubernetes versions 1.19.X and above
  - This other edition of the Ingress-Nginx-Controller, will jump ahead in the sem-versioning, so as to make it distinct
  - The first release with this newer code-base, will be version 1.0.0
  - Most future releases of the Ingress-Nginx project will track and support the latest versions of Kubernetes.


## "Ingress NGINX supported version with Kubernetes Versions"
Kubernetes version  | Ingress-NGINX version | Notes
:-------------------|:----------------------|:------------
v1.22              | v1.0.0+        | New features, plus bug fixes.
v1.21              | v0.48+         | Bugfixes only, and just for security issues or crashes. No end-of-support date announced.
v1.20              | v0.48+         | Bugfixes only, and just  for security issues or crashes. No end-of-support date announced.
v1.19              | v0.48+         | Bugfixes only, and just  for security issues or crashes. Fixes only provided until 6 months after Kubernetes v1.22.0 is released.
{{< /table >}}    

Because of the deprecations of older api versions in Kubernetes v1.22, Ingress-Nginx-Controller **v0.X.X** will not work with Kubernetes v1.22. 

# What you need to do

Please check  https://kubernetes.github.io/ingress-nginx/ for updated information related to Ingress-Nginx-Controller v1.0.0 and the related migration documentation.

The team is currently in the process of upgrading ingress-nginx to support the v1 migration, you can track the progress [here](https://github.com/kubernetes/ingress-nginx/pull/7156).  
We're not making feature improvements to  the `Ingress-Nginx-Controller`, until after the support for Ingress v1 is complete.

In the meantime to ensure no compatibility issues: 

* Update to the latest version of Ingress-NGINX; at the time of writing this blog, it is  [v0.48.1](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v0.48.1) 
* After Kubernetes 1.22 is released, ensure you are using the latest version of Ingress-NGINX that supports the stable APIs for Ingress and IngressClass.
* Test Ingress-NGINX version v1.X.X+ with Kubernetes Cluster versions >= 1.19 and report any issues to the projects Github page. 

The community’s feedback and support in this effort is welcome. The Ingress-NGINX Sub-project regularly holds community meetings where we discuss
this and other issues facing the project. For more information on the sub-project, please see [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
