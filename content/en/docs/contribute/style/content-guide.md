---
title: Documentation Content Guide
linktitle: Content guide
content_template: templates/concept
weight: 10
card:
  name: contribute
  weight: 20
  title: Documentation Content Guide
---

{{% capture overview %}}
This page contains guidelines for adding content to the Kubernetes documentation.
If you have questions about allowed content, join the [Kubernetes Slack](http://slack.k8s.io/) #sig-docs channel and ask! Use your best judgment, and feel free to
propose changes to this document in a pull request.

For additional information on creating new content for the Kubernetes
docs, follow the instructions in the [Style guide](/docs/contribute/style/style-guide).
{{% /capture %}}

{{% capture body %}}
## Contributing content

The Kubernetes documentation comprises the content of the 
[kubernetes/website](https://github.com/kubernetes/website) source repository. 
Located in the `kubernetes/website/content/<language_code>/docs` folder, the 
majority of the Kubernetes documentation is specific to the [Kubernetes 
project](https://github.com/kubernetes/kubernetes). The Kubernetes 
documentation may also include content from projects in the 
[kubernetes](https://github.com/kubernetes) and 
[kubernetes-sigs](https://github.com/kubernetes-sigs) GitHub organizations if 
those projects do not have their own documentation. Linking to active kubernetes, 
kubernetes-sigs, and ({{< glossary_tooltip text="CNCF" term_id="cncf" >}}) projects from the Kubernetes documentation is always 
allowed, but linking to vendor-specific products is not. Check the CNCF project lists 
([Graduated/Incubating](https://www.cncf.io/projects/), 
[Sandbox](https://www.cncf.io/sandbox-projects/), 
[Archived](https://www.cncf.io/archived-projects/)) if you are unsure of a 
project's CNCF status. 

### Dual-sourced content

Kubernetes documentation does not include duplicate content sourced from multiple 
locations (*dual-sourced* content). Dual-sourced content requires duplicated 
effort from project maintainers and tends to become outdated more quickly. 
Before adding content, ask yourself this:

- Is the content about an active CNCF project OR a project in the kubernetes or kubernetes-sigs GitHub organizations?
    - If yes, then:
        - Does the project have its own documentation?
            - if yes, link to the project's documention from the Kubernetes documentation 
            - if no, add the content to the project's repository if possible and then link to it from the Kubernetes documentation
    - If no, then:
        - Stop!
            - Adding content about vendor-specific products is not allowed
            - Linking to vendor-specific documentation and websites is not allowed

### What is and isn't allowed

There are some scenarios in which the Kubernetes documentation includes content from non-Kubernetes projects. 
Below are general categories of non-Kubernetes project content along with guidelines of what is and is not allowed:

1. Instructional content involving non-Kubernetes projects during setup or operation of Kubernetes
    - Allowed:
        - Referring to or linking to existing documentation about a CNCF project or a project in the kubernetes or kubernetes-sigs GitHub organizations
            - Example: for installating Kubernetes in a learning environment, including a prerequisite stating that successful installation and configuration of minikube is required and linking to the relevant minikube documentation
        - Adding content for kubernetes or kubernetes-sigs projects that don't have their own instructional content
            - Example: including [kubadm](https://github.com/kubernetes/kubeadm) installation and troubleshooting instructions    
    - Not Allowed:
        - Adding content that duplicates documentation in another repository
            - Examples: 
                - Including minikube installation and configuration instructions; minikube has its own [documentation](https://minikube.sigs.k8s.io/docs/) that provides those instructions
                - Including instructions for installing Docker, CRI-O, containerd, and other container runtimes on various operating systems
                - Including instructions for installing Kubernetes on production environments using various projects:
                    - Kubernetes Rebar Integrated Bootstrap (KRIB) is a vendor-specific project and content belongs in the vendor's documentation
                    - [Kubernetes Operations (kops)](https://github.com/kubernetes/kops) has installation instructions and tutorials in its GitHub repository
                    - [Kubespray](https://kubespray.io) has its own documenation  
        - Adding a tutorial that explains how to perform a task using a vendor-specific product or an open source project that is not a CNCF project or a project in the kubernetes or kubnetes-sigs GitHub organizations
        - Adding a tutorial on how to use a CNCF project or a project in the kubernetes or kubnetes-sigs GitHub organizations if the project has its own documentation
1. Detailed technical content about how to use a non-Kubernetes project or how that project is designed

    Adding this type of content to the Kubernetes documentation is not allowed.     
1. Content that describes a non-Kubernetes project
    - Allowed:    
        - Adding a brief introductory paragraph about a CNCF project or a project in the kubernetes or kubernetes-sigs GitHub organizations; the paragraph may contain links to the project        
    - Not Allowed:    
        - Adding content describing a vendor-specific product
        - Adding content describing an open source project that is not a CNCF project or a project in the kubernetes or kubnetes-sigs GitHub organizations
        - Adding content that duplicates documentation from another project, regardless of source repository
            - Example: adding [Kubernetes in Docker (KinD)](https://kind.sigs.k8s.io) documentation to the Kubernetes documentation
1. Content that simply links to information about a non-Kubernetes project
    - Allowed:    
        - Linking to projects in the kubernetes and kubernetes-sigs GitHub organizations
            - Example: linking to Kubernetes in Docker (KinD) [documentation](https://kind.sigs.k8s.io/docs/user/quick-start), which resides in the kubernetes-sigs GitHub organization
        - Linking to active CNCF projects
            - Example: linking to the Prometheus [documentation](https://prometheus.io/docs/introduction/overview/); Prometheus is an active CNCF project
    - Not Allowed:    
        - Linking to vendor-specific products
        - Linking to archived CNCF projects
        - Linking to inactive projects in the kubernetes and kubernetes-sigs GitHub organizations
        - Linking to open source projects that are not CNCF projects or do not reside in the kubernetes or kubernetes-sigs GitHub organizations
1. Content about training courses
    - Allowed:    
        - Linking to vendor-neutral Kubernetes training courses offered by the [CNCF](https://www.cncf.io/), the [Linux Foundation](https://www.linuxfoundation.org/), and the [Linux Academy](https://linuxacademy.com/), which is a partner of the Linux Foundation
            - Example: linking to Linux Academy courses such as [Kubernetes Quick Start](https://linuxacademy.com/course/kubernetes-quick-start/) and [Kubernetes Security](https://linuxacademy.com/course/kubernetes-security/)      
    - Not Allowed:    
        - Linking to online training outside of the CNCF, the Linux Foundation, or the Linux Academy; the Kubernetes documentation does not link to third-party content 
            - Example: linking to Kubernetes tutorials or courses on Medium, KodeKloud, Udacity, Coursera, learnk8s, and similar websites
        - Linking to vendor-specific tutorials regardless of the training provider
            - Example: linking to Linux Academy courses such as [Google Kubernetes Engine Deep Dive](https://linuxacademy.com/google-cloud-platform/training/course/name/google-kubernetes-engine-deep-dive) and [Amazon EKS Deep Dive](https://linuxacademy.com/course/amazon-eks-deep-dive/)

If you have questions about allowed content, join the [Kubernetes Slack](http://slack.k8s.io/) #sig-docs channel and ask! 
{{% /capture %}}

{{% capture whatsnext %}}
* Read the [Style guide](/docs/contribute/style/style-guide).
{{% /capture %}}
