---
layout: blog
title: 'Updates to Ingress Nginx with network v1'
date: 2021-05-30
slug: update-with-ingress-nginx
---

**Authors:** James Strong, Richardo Katz 

With all Kubernetes APIs, there is a process to creating, maintaining, and
ultimately deprecating them once they become GA. The network API is no
different. With the release of Kubernetes 1.22, the network API goes from
v1beta1 to v1, with v1beta is deprecated. This move has been in discussion
since [2017](https://github.com/kubernetes/kubernetes/issues/43214),
[2019](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) with 1.16 Kubernetes API deprecations,
and most recently in KEP-1453: [Graduate Ingress API to GA](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/1453-ingress-api#122).

During our last community meeting the group has decided to continue to 
support Kubernetes versions older than 1.22 with ingress version 0.46.0 
for six months after the release of Kubernetes 1.22 with only CVE and 
crashes only fixes, on a rolling basis. There will be a separate branch and 
release of Ingress-NGINX to support this very similar to how Kubernetes 
project proper does. As we advance the Ingress-NGINX project, the mainline 
will support Kubernetes 1.22 and above, similar to the maintainers of the 
Kubernetes project as a whole.

{{< table caption="Ingress NGINX supported version with Kubernetes Versions" >}}
Kubernetes Version  | Ingress-NGINX version | Support Notes
:-------------------|:----------------------|:------------
`1.22`              | TBD                   | On Going
`1.21`              | `v0.46.0`             | On Going but only CVE and crashes
`1.20`              | `v0.46.0`             | On Going but only CVE and crashes
`1.19`              | `v0.46.0`             | Support will drop 6 months after 1.22 release
{{< /table >}}    

Because of the networking v1 update going GA in Kubernetes 1.22, `v0.46.0` will 
not work with Kubernetes 1.22. 

# What do I need to do

The team is currently in the process of upgrading ingress-nginx to support 
the v1 migration, you can track the progress 
[here](https://github.com/kubernetes/ingress-nginx/pull/7156).  This also 
means the feature requests are being frozen until the v1 update is completed. 

In the meantime to ensure no compatibility issues: 

* Update to the latest version of Ingress-NGINX, currently [v0.46.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v0.46.0) 
* After Kubernetes 1.22 is released, ensure you are using the latest version of 
  Ingress-NGINX that supports v1 networking api.

The community’s feedback and support in this effort is welcome. The
Ingress-Nginx Sub-project regularly hold community meetings where we discuss
this and other issues facing the project, meeting notes and details are
[here](https://github.com/kubernetes/community/tree/master/sig-network)
