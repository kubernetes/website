---
title: " Cloud Native Application Interfaces "
date: 2016-09-01
slug: cloud-native-application-interfaces
url: /blog/2016/09/Cloud-Native-Application-Interfaces
author: >
  Brian Grant (Google),
  Craig Mcluckie (Google)
---

**Standard Interfaces (or, the Thirteenth Factor)**

When you say we need ‘software standards’ in erudite company, you get some interesting looks. Most concede that software standards have been central to the success of the boldest and most successful projects out there (like the Internet). Most are also skeptical about how they apply to the innovative world we live in today. Our projects are executed in week increments, not years. Getting bogged down behind mega-software-corporation-driven standards practices would be the death knell in this fluid, highly competitive world.  

This isn’t about ‘those’ standards. The ones that emerge after years of deep consideration and negotiation that are eventually published by a body with a four-letter acronym for a name. This is about a different approach: finding what is working in the real world, and acting as a community to embrace it.  

Let’s go back to first principles. To describe Cloud Native in one word, we'd choose "automatable".  

Most existing applications are not.&nbsp;  

Applications have many interfaces with their environment, whether with management infrastructure, shared services, or other applications. For us to remove the operator from patching, scaling, migrating an app from one environment to another, changing out dependencies, and handling of failure conditions, a set of well structured common interfaces is essential. It goes without saying that these interfaces must be designed for machines, not just humans. Machine-friendly interfaces allow automation systems to understand the systems under management, and create the loose coupling needed for applications to live in automated environments.&nbsp;  



As containerized infrastructure gets built there are a set of critical interfaces available to applications that go far beyond what is available to a single node today. The adoption of ‘serverless patterns’ (meaning ephemeral, event driven function execution) will further compound the need to make sense of running code in an environment that is completely decoupled from the node. The services needed will start with application configuration and extend to monitoring, logging, autoscaling and beyond. The set of capabilities will only grow as applications continue to adapt to be fuller citizens in a "cloud native" world.



Exploring one example a little further, a number of service-discovery solutions have been developed but are often tied to a particular storage implementation, a particular programming language, a non-standard protocol, and/or are opinionated in some other way (e.g., dictating application naming structure). This makes them unsuitable for general-purpose use. While DNS has limitations (that will eventually need to be addressed), it's at least a standard protocol with room for innovation in its implementation. This is demonstrated by CoreDNS and other cloud-native DNS implementations.&nbsp;



When we look inside the systems at Google, we have been able to achieve very high levels of automation without formal interface definitions thanks to a largely homogeneous software and hardware environment. Adjacent systems can safely make assumptions about interfaces, and by providing a set of universally used libraries we can skirt the issue. A good example of this is our log format doesn’t need to be formally specified because the libraries that generate logs are maintained by the teams that maintain the logs processing systems. This means that we have been able to get by to date without something like fluentd (which is solving the problem in the community of interfacing with logging systems).



Even though Google has managed to get by this way, it hurts us. One way is when we acquire a company. Porting their technology to run in our automation systems requires a spectacular amount of work. Doing that work while continuing to innovate is particularly tough. Even more significant though, there’s a lot of innovation happening in the open source world that isn’t easy for us to tap into.&nbsp;When new technology emerges, we would like to be able to experiment with it, adopt it piecemeal, and perhaps contribute back to it. When you run a vertically integrated, bespoke stack, that is a hard thing to do.  


The lack of standard interfaces leaves customers with three choices:&nbsp;

- Live with high operations cost (the status quo), and accept that your developers in many cases will spend the majority of their time dealing with the care and feeding of applications.
- Sign-up to be like Google (build your own everything, down to the concrete in the floor).&nbsp;
- Rely on a single, or a small collection of vendors to provide a complete solution and accept some degree of lock-in. Few in companies of any size (from enterprise to startup) find this appealing.
It is our belief that an open community is more powerful and that customers benefit when there is competition at every layer of the stack. It should be possible to pull together a stack with best-of-breed capabilities at every level -- logging, monitoring, orchestration, container runtime environment, block and file-system storage, SDN technology, etc.&nbsp;



Standardizing interfaces (at least by convention) between the management system and applications is critical.&nbsp;One might consider the use of common conventions for interfaces as a thirteenth factor (expanding on the [12-factor methodology](https://12factor.net/)) in creating modern systems that work well in the cloud and at scale.



Kubernetes and Cloud Native Computing Foundation ([CNCF](https://cncf.io/)) represent a great opportunity to support the emergence of standard interfaces, and to support the emergence of a fully automated software world. We’d love to see this community embrace the ideal of promoting standard interfaces from working technology. The obvious first step is to identify the immediate set of critical interfaces, and establish working groups in CNCF to start assess what exists in this area as candidates, and to sponsor work to start developing standard interfaces that work across container formats, orchestrators, developer tools and the myriad other systems that are needed to deliver on the Cloud Native vision.
