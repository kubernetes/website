---
layout: post
title: Principles of Container-based Application Design
date: '2018-03-15T08:00:00.000-07:00'
author: kbarnard
tags: 
modified_time: '2018-03-15T08:00:35.309-07:00'
thumbnail: https://lh5.googleusercontent.com/1XqojkVC0CET1yKCJqZ3-0VWxJ3W8Q74zPLlqnn6eHSJsjHOiBTB7EGUX5o_BOKumgfkxVdgBeLyoyMfMIXwVm9p2QXkq_RRy2mDJG1qEExJDculYL5PciYcWfPAKxF2-DGIdiLw=s72-c
blogger_id: tag:blogger.com,1999:blog-112706738355446097.post-8685772604779578234
blogger_orig_url: http://blog.kubernetes.io/2018/03/principles-of-container-app-design.html
---

<div>It’s possible nowadays to put almost any application in a container and 
run it. Creating cloud-native applications, however—containerized applications 
that are automated and orchestrated effectively by a cloud-native platform 
such as Kubernetes—requires additional effort. Cloud-native applications 
anticipate failure; they run and scale reliably even when their infrastructure 
experiences outages. To offer such capabilities, cloud-native platforms like 
Kubernetes impose a set of contracts and constraints on applications. These 
contracts ensure that applications they run conform to certain constraints and 
allow the platform to automate application management. 

I’ve outlined [seven 
principles](https://www.redhat.com/en/resources/cloud-native-container-design-whitepaper) 
for containerized applications to follow in order to be fully cloud-native. 
<table align="center" cellpadding="0" cellspacing="0" 
class="tr-caption-container" style="margin-left: auto; margin-right: auto; 
text-align: center;"><td style="text-align: center;"><img height="197" 
src="https://lh5.googleusercontent.com/1XqojkVC0CET1yKCJqZ3-0VWxJ3W8Q74zPLlqnn6eHSJsjHOiBTB7EGUX5o_BOKumgfkxVdgBeLyoyMfMIXwVm9p2QXkq_RRy2mDJG1qEExJDculYL5PciYcWfPAKxF2-DGIdiLw" 
style="margin-left: auto; margin-right: auto;" width="400" /><td 
class="tr-caption" style="text-align: center;">Container Design Principles 
These seven principles cover both build time and runtime concerns. 
<div>## Build time1. **Single Concern:** Each container addresses a single 
concern and does it well. 
1. **Self-Containment:** A container relies only on the presence of the Linux 
kernel. Additional libraries are added when the container is built. 
1. **Image Immutability:** Containerized applications are meant to be 
immutable, and once built are not expected to change between different 
environments. 
<div>## Runtime1. **High Observability:** Every container must implement all 
necessary APIs to help the platform observe and manage the application in the 
best way possible. 
1. ****Lifecycle Conformance:** **A container must have a way to read events 
coming from the platform and conform by reacting to those events. 
1. ****Process Disposability:** **Containerized applications must be as 
ephemeral as possible and ready to be replaced by another container instance 
at any point in time. 
1. ****Runtime Confinement:** **Every container must declare its resource 
requirements and restrict resource use to the requirements indicated. 
The build time principles ensure that containers have the right granularity, 
consistency, and structure in place. The runtime principles dictate what 
functionalities must be implemented in order for containerized applications to 
possess cloud-native function. Adhering to these principles helps ensure that 
your applications are suitable for automation in Kubernetes. 

The white paper is freely available for download: 

[https://www.redhat.com/en/resources/cloud-native-container-design-whitepaper](https://www.redhat.com/en/resources/cloud-native-container-design-whitepaper) 

To read more about designing cloud-native applications for Kubernetes, check 
out my [Kubernetes Patterns](http://leanpub.com/k8spatterns/) book. 

— [Bilgin Ibryam](http://twitter.com/bibryam), Principal Architect, Red Hat 

Twitter: [https://twitter.com/bibryam](https://twitter.com/bibryam)  
Blog: [http://www.ofbizian.com](http://www.ofbizian.com/) 
Linkedin: 
[https://uk.linkedin.com/in/bibryam](https://uk.linkedin.com/in/bibryam) 

Bilgin Ibryam (@bibryam) is a principal architect at Red Hat, open source 
committer at ASF, blogger, author, and speaker. He is the author of Camel 
Design Patterns and Kubernetes Patterns books. In his day-to-day job, Bilgin 
enjoys mentoring, training and leading teams to be successful with distributed 
systems, microservices, containers, and cloud-native applications in general. 