---
layout: blog
title: 'Increasing the security bar in Ingress-NGINX'
date: 2022-04-15
slug: ingress-nginx-security-release
---

**Authors:** Ricardo Katz (VMware), James Strong (Chainguard)

Ingress may be one of the most targeted components of Kubernetes. In fact, it usually is an HTTP Proxy, exposed to the Internet, containing multiple websites, and with some privileged access to Kubernetes API (mainly secret access for TLS certificates).

While it is a risky component in your architecture, it is still required to properly expose your services.

Ingress NGINX has been part of security assessments that figured out we have a big problem: we don't do all proper sanitization before turning the configuration into an nginx.conf file, which may lead to users being able to extract information.

While we understand this risk and the real need to fix this, it's not an easy process to do, so we took another approach to reduce (but not remove!) this risk in the next release.

## Meet Ingress NGINX v1.2.0 and the chrooted NGINX process

One of the main problems is that we run our proxy server (NGINX) together with the controller (the component that has access to Kubernetes API Server and created the nginx.conf file). 

So, NGINX does have the same access to the filesystem of the controller (and Kubernetes service account token, and other configurations from the container). While splitting those components is our end goal, we needed a fast response, that lead to the chroot idea.

Let's take a look into what an Ingress Controller container looked like before this change:

![Ingress NGINX pre chroot](ingress-pre-chroot.png)

As we can see, the same container (not the Pod, the container!) that provides HTTP Proxy is the one that watches Ingress objects and writes the Container Volume

Now, meet the new architecture:

![Ingress NGINX post chroot](ingress-post-chroot.png)

What does all of this mean? A good summary is: that we are running a new container inside our own container.

While this is not actually true, to understand what was done here, it's good to understand how Linux Containers (and kernel namespaces) work, and we recommend you read the article <https://www.nginx.com/blog/what-are-namespaces-cgroups-how-do-they-work/>.

## Skip the talk, what do I need to use this new approach?

While this increases the security, we made this feature an opt-in in this release so users may have time to make the right adjustments in their environments. This feature is only available from release v1.2.0

There are two required changes in your deployments to use this feature:
* In the image name, add the suffix "-chroot" as the following: gcr.io/k8s-staging-ingress-nginx/controller-chroot:v1.2.0
* In your manifest, with the capability NET_BIND_SERVICE add the capability SYS_CHROOT so this configuration in the manifest will be like:

```yaml
capabilities:
  drop:
  - ALL
  add:
  - NET_BIND_SERVICE
  - SYS_CHROOT
```

If you use the Helm Chart, in your `values.yaml`, change the following:

```yaml
controller:
  image:
    chroot: true
```

** Check with your cluster admin if you can use "SYS_CHROOT" capability before enabling it in your deployment! **

## OK, but how does this increase the security of my Ingress Controller?

Take the following configuration snippet and imagine, for some reason it was added to your nginx.conf:
```
location /randomthing/ {
      alias /;
      autoindex on;
}
```

With this configuration, one can call "http://website.com/randomthing" and get some listing (and access) to the whole filesystem.

Now, can you spot the difference between chrooted and non chrooted Nginx on the listings below?

| not chrooted             | chrooted |
|--------------------------|------|
| bin                      | bin  |
| dev                      | dev  |
| etc                      | etc  |
| home                     |      |
| lib                      | lib  |
| media                    |      |
| mnt                      |      |
| opt                      | opt  |
| proc                     | proc |
| root                     |      |
| run                      | run  |
| sbin                     |      |
| srv                      |      |
| sys                      |      |
| tmp                      | tmp  |
| usr                      | usr  |
| var                      | var  |
| dbg                      |      |
| nginx-ingress-controller |      |
| wait-shutdown            |      |

The one in left side is not chrooted. So NGINX has full access to the filesystem. The one in right side is chrooted, so a new filesystem with only the required files to make NGINX work is created.

## What about other security improvements in this release?

We know that the chroot improvement solves some portion of the risk, but still, someone can try to inject commands to read, for example, nginx.conf file and extract sensitive information.

So, another change in this release (this is opt-out!) is the deep inspector. We know some directives and regexes may be dangerous to NGINX, so the deep inspector will check all fields from an Ingress object (during its reconciliation, and also with admission webhook!) to verify if some field contains these dangerous directives.

We already do this for annotations, and the plan/goal is to move this validation to inside deep inspection in future releases.

You can take a look into the existing rules in <https://github.com/kubernetes/ingress-nginx/blob/main/internal/ingress/inspector/rules.go>

Due to the nature of inspecting and matching all strings in all objects, this new feature may consume a bit more CPU, and can be disabled with the flag --deep-inspect=false

## What's next?

This is not our final goal. Our final goal is to split the control plane and the data plane processes. In fact, doing so will help us also achieve the GatewayAPI implementation, as we may have a different controller as soon as it "knows" what to provide to the Data Plane (we need some help here!!)

Some other projects in Kubernetes already take this approach (like [KPNG, the new Kube Proxy](​​https://github.com/kubernetes-sigs/kpng) and we plan to align with them and get the same experience for Ingress NGINX

## References

References

If you want to take a look into how chrooting was done in Ingress NGINX, take a look into <https://github.com/kubernetes/ingress-nginx/pull/8337>
The release v1.2.0 containing all the changes can be found at <https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.2.0>
