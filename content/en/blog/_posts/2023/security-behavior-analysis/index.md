---
layout: blog
title: Consider All Microservices Vulnerable — And Monitor Their Behavior
date: 2023-01-20
slug: security-behavior-analysis
author: >
  David Hadas (IBM Research Labs)
---

_This post warns Devops from a false sense of security. Following security
best practices when developing and configuring microservices do not result
in non-vulnerable microservices. The post shows that although all deployed
microservices are vulnerable, there is much that can be done to ensure
microservices are not exploited. It explains how analyzing the behavior of
clients and services from a security standpoint, named here
**"Security-Behavior Analytics"**, can protect the deployed vulnerable microservices.
It points to [Guard](http://knative.dev/security-guard), an open source project offering
security-behavior monitoring and control of Kubernetes microservices presumed vulnerable._

As cyber attacks continue to intensify in sophistication, organizations deploying
cloud services continue to grow their cyber investments aiming to produce safe and
non-vulnerable services. However, the year-by-year growth in cyber investments does
not result in a parallel reduction in cyber incidents. Instead, the number of cyber
incidents continues to grow annually. Evidently, organizations are doomed to fail in
this struggle - no matter how much effort is made to detect and remove cyber weaknesses
from deployed services, it seems offenders always have the upper hand.

Considering the current spread of offensive tools, sophistication of offensive players,
and ever-growing cyber financial gains to offenders, any cyber strategy that relies on
constructing a non-vulnerable, weakness-free service in 2023 is clearly too naïve.
It seems the only viable strategy is to:

&#x27A5; **Admit that your services are vulnerable!**

In other words, consciously accept that you will never create completely invulnerable
services. If your opponents find even a single weakness as an entry-point, you lose!
Admitting that in spite of your best efforts, all your services are still vulnerable
is an important first step. Next, this post discusses what you can do about it...

## How to protect microservices from being exploited

Being vulnerable does not necessarily mean that your service will be exploited.
Though your services are vulnerable in some ways unknown to you, offenders still
need to identify these vulnerabilities and then exploit them. If offenders fail
to exploit your service vulnerabilities, you win! In other words, having a
vulnerability that can’t be exploited, represents a risk that can’t be realized.

{{< figure src="security_behavior_figure_1.svg" alt="Image of an example of offender gaining foothold in a service" class="diagram-large" caption="Figure 1. An Offender gaining foothold in a vulnerable service" >}}

The above diagram shows an example in which the offender does not yet have a
foothold in the service; that is, it is assumed that your service does not run
code controlled by the offender on day 1. In our example the service has
vulnerabilities in the API exposed to clients. To gain an initial foothold the
offender uses a malicious client to try and exploit one of the service API
vulnerabilities. The malicious client sends an exploit that triggers some
unplanned behavior of the service.

More specifically, let’s assume the service is vulnerable to an SQL injection.
The developer failed to sanitize the user input properly, thereby allowing clients
to send values that would change the intended behavior. In our example, if a client
sends a query string with key “username” and value of _“tom or 1=1”_, the client will
receive the data of all users. Exploiting this vulnerability requires the client to
send an irregular string as the value. Note that benign users will not be sending a
string with spaces or with the equal sign character as a username, instead they will
normally send legal usernames which for example may be defined as a short sequence of
characters a-z. No legal username can trigger service unplanned behavior.

In this simple example, one can already identify several opportunities to detect and
block an attempt to exploit the vulnerability (un)intentionally left behind by the
developer, making the vulnerability unexploitable. First, the malicious client behavior
differs from the behavior of benign clients, as it sends irregular requests. If such a
change in behavior is detected and blocked, the exploit will never reach the service.
Second, the service behavior in response to the exploit differs from the service behavior
in response to a regular request. Such behavior may include making subsequent irregular
calls to other services such as a data store, taking irregular time to respond, and/or
responding to the malicious client with an irregular response (for example, containing
much more data than normally sent in case of benign clients making regular requests).
Service behavioral changes, if detected, will also allow blocking the exploit in
different stages of the exploitation attempt.

More generally:

- Monitoring the behavior of clients can help detect and block exploits against
  service API vulnerabilities. In fact, deploying efficient client behavior
  monitoring makes many vulnerabilities unexploitable and others very hard to achieve.
  To succeed, the offender needs to create an exploit undetectable from regular requests.

- Monitoring the behavior of services can help detect services as they are being
  exploited regardless of the attack vector used. Efficient service behavior
  monitoring limits what an attacker may be able to achieve as the offender needs
  to ensure the service behavior is undetectable from regular service behavior.

Combining both approaches may add a protection layer to the deployed vulnerable services,
drastically decreasing the probability for anyone to successfully exploit any of the
deployed vulnerable services. Next, let us identify four use cases where you need to
use security-behavior monitoring.

## Use cases

One can identify the following four different stages in the life of any service
from a security standpoint. In each stage, security-behavior monitoring is required
to meet different challenges:

Service State | Use case | What do you need in order to cope with this use case?
------------- | ------------- | -----------------------------------------
**Normal**   | **No known vulnerabilities:** The service owner is normally not aware of any known vulnerabilities in the service image or configuration. Yet, it is reasonable to assume that the service has weaknesses. | **Provide generic protection against any unknown, zero-day, service vulnerabilities** - Detect/block irregular patterns sent as part of incoming client requests that may be used as exploits.
**Vulnerable** | **An applicable CVE is published:** The service owner is required to release a new non-vulnerable revision of the service. Research shows that in practice this process of removing a known vulnerability may take many weeks to accomplish (2 months on average).   |  **Add protection based on the CVE analysis** - Detect/block incoming requests that include specific patterns that may be used to exploit the discovered vulnerability. Continue to offer services, although the service has a known vulnerability.
**Exploitable**  | **A known exploit is published:** The service owner needs a way to filter incoming requests that contain the known exploit.   |  **Add protection based on a known exploit signature** - Detect/block incoming client requests that carry signatures identifying the exploit. Continue to offer services, although the presence of an exploit.  
**Misused**  | **An offender misuses pods backing the service:** The offender can follow an attack pattern enabling him/her to misuse pods. The service owner needs to restart any compromised pods while using non compromised pods to continue offering the service. Note that once a pod is restarted, the offender needs to repeat the attack pattern before he/she may again misuse it.  |  **Identify and restart instances of the component that is being misused** - At any given time, some backing pods may be compromised and misused, while others behave as designed. Detect/remove the misused pods while allowing other pods to continue servicing client requests.

Fortunately, microservice architecture is well suited to security-behavior monitoring as discussed next.

## Security-Behavior of microservices versus monoliths {#microservices-vs-monoliths}

Kubernetes is often used to support workloads designed with microservice architecture.
By design, microservices aim to follow the UNIX philosophy of "Do One Thing And Do It Well".
Each microservice has a bounded context and a clear interface. In other words, you can expect
the microservice clients to send relatively regular requests and the microservice to present
a relatively regular behavior as a response to these requests. Consequently, a microservice
architecture is an excellent candidate for security-behavior monitoring.

{{< figure src="security_behavior_figure_2.svg" alt="Image showing why microservices are well suited for security-behavior monitoring" class="diagram-large" caption="Figure 2. Microservices are well suited for security-behavior monitoring" >}}

The diagram above clarifies how dividing a monolithic service to a set of
microservices improves our ability to perform security-behavior monitoring
and control. In a monolithic service approach, different client requests are
intertwined, resulting in a diminished ability to identify irregular client
behaviors. Without prior knowledge, an observer of the intertwined client
requests will find it hard to distinguish between types of requests and their
related characteristics. Further, internal client requests are not exposed to
the observer. Lastly, the aggregated behavior of the monolithic service is a
compound of the many different internal behaviors of its components, making
it hard to identify irregular service behavior.

In a microservice environment, each microservice is expected by design to offer
a more well-defined service and serve better defined type of requests. This makes
it easier for an observer to identify irregular client behavior and irregular
service behavior. Further, a microservice design exposes the internal requests
and internal services which offer more security-behavior data to identify
irregularities by an observer. Overall, this makes the microservice design
pattern better suited for security-behavior monitoring and control.

## Security-Behavior monitoring on Kubernetes

Kubernetes deployments seeking to add Security-Behavior may use
[Guard](http://knative.dev/security-guard), developed under the CNCF project Knative.
Guard is integrated into the full Knative automation suite that runs on top of Kubernetes.
Alternatively, **you can deploy Guard as a standalone tool** to protect any HTTP-based workload on Kubernetes.

See:

- [Guard](https://github.com/knative-sandbox/security-guard)  on Github,
  for using Guard as a standalone tool.
- The Knative automation suite - Read about Knative, in the blog post
  [Opinionated Kubernetes](https://davidhadas.wordpress.com/2022/08/29/knative-an-opinionated-kubernetes)
  which describes how Knative simplifies and unifies the way web services are deployed on Kubernetes.
- You may contact Guard maintainers on the
  [SIG Security](https://kubernetes.slack.com/archives/C019LFTGNQ3) Slack channel
  or on the Knative community [security](https://knative.slack.com/archives/CBYV1E0TG)
  Slack channel. The Knative community channel will move soon to the
  [CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf) under the name `#knative-security`.

The goal of this post is to invite the Kubernetes community to action and introduce
Security-Behavior monitoring and control to help secure Kubernetes based deployments.
Hopefully, the community as a follow up will:

1. Analyze the cyber challenges presented for different Kubernetes use cases
1. Add appropriate security documentation for users on how to introduce Security-Behavior monitoring and control.
1. Consider how to integrate with tools that can help users monitor and control their vulnerable services.

## Getting involved

You are welcome to get involved and join the effort to develop security behavior monitoring
and control for Kubernetes; to share feedback and contribute to code or documentation;
and to make or suggest improvements of any kind.
