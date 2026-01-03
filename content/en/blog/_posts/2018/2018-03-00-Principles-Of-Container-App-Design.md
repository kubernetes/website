---
title: "Principles of Container-based Application Design"
date: 2018-03-15
slug: principles-of-container-app-design
url: /blog/2018/03/Principles-Of-Container-App-Design
author: >
   [Bilgin Ibryam](http://twitter.com/bibryam) (Red Hat)
---

It's possible nowadays to put almost any application in a container and run it. Creating cloud-native applications, however—containerized applications that are automated and orchestrated effectively by a cloud-native platform such as Kubernetes—requires additional effort. Cloud-native applications anticipate failure; they run and scale reliably even when their infrastructure experiences outages. To offer such capabilities, cloud-native platforms like Kubernetes impose a set of contracts and constraints on applications. These contracts ensure that applications they run conform to certain constraints and allow the platform to automate application management.

I've outlined [seven principles][1]for containerized applications to follow in order to be fully cloud-native.   

| ----- |
| ![][2]  |
| Container Design Principles |


These seven principles cover both build time and runtime concerns.  

####  Build time

* **Single Concern:** Each container addresses a single concern and does it well.
* **Self-Containment:** A container relies only on the presence of the Linux kernel. Additional libraries are added when the container is built.
* **Image Immutability:** Containerized applications are meant to be immutable, and once built are not expected to change between different environments.

####  Runtime

* **High Observability:** Every container must implement all necessary APIs to help the platform observe and manage the application in the best way possible.
* **Lifecycle Conformance:** A container must have a way to read events coming from the platform and conform by reacting to those events.
* **Process Disposability:** Containerized applications must be as ephemeral as possible and ready to be replaced by another container instance at any point in time.
* **Runtime Confinement:** Every container must declare its resource requirements and restrict resource use to the requirements indicated.
The build time principles ensure that containers have the right granularity, consistency, and structure in place. The runtime principles dictate what functionalities must be implemented in order for containerized applications to possess cloud-native function. Adhering to these principles helps ensure that your applications are suitable for automation in Kubernetes.

The white paper is freely available for download:   


To read more about designing cloud-native applications for Kubernetes, check out my [Kubernetes Patterns][3] book.

Twitter:    
Blog: [http://www.ofbizian.com][5]  
Linkedin:

Bilgin Ibryam (@bibryam) is a principal architect at Red Hat, open source committer at ASF, blogger, author, and speaker. He is the author of Camel Design Patterns and Kubernetes Patterns books. In his day-to-day job, Bilgin enjoys mentoring, training and leading teams to be successful with distributed systems, microservices, containers, and cloud-native applications in general.

[1]: https://www.redhat.com/en/resources/cloud-native-container-design-whitepaper
[2]: https://lh5.googleusercontent.com/1XqojkVC0CET1yKCJqZ3-0VWxJ3W8Q74zPLlqnn6eHSJsjHOiBTB7EGUX5o_BOKumgfkxVdgBeLyoyMfMIXwVm9p2QXkq_RRy2mDJG1qEExJDculYL5PciYcWfPAKxF2-DGIdiLw
[3]: http://leanpub.com/k8spatterns/
[4]: http://twitter.com/bibryam
[5]: http://www.ofbizian.com/
