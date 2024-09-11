---
title: " SIG-UI: the place for building awesome user interfaces for Kubernetes "
date: 2016-04-20
slug: building-awesome-user-interfaces-for-kubernetes
url: /blog/2016/04/Building-Awesome-User-Interfaces-For-Kubernetes
author: >
  Piotr Bryk (Google) 
---
_**Editor's note:** This week we’re featuring [Kubernetes Special Interest Groups](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs)); Today’s post is by the SIG-UI team describing their mission and showing the cool projects they work on._  

Kubernetes has been handling production workloads for a long time now (see [case studies](http://kubernetes.io/#talkToUs)). It runs on public, private and hybrid clouds as well as bare metal. It can handle all types of workloads (web serving, batch and mixed) and enable [zero-downtime rolling updates](https://www.youtube.com/watch?v=9C6YeyyUUmI). It abstracts service discovery, load balancing and storage so that applications running on Kubernetes aren’t restricted to a specific cloud provider or environment.  

The abundance of features that Kubernetes offers is fantastic, but implementing a user-friendly, easy-to-use user interface is quite challenging. How shall all the features be presented to users? How can we gradually expose the Kubernetes concepts to newcomers, while empowering experts? There are lots of other challenges like these that we’d like to solve. This is why we created a special interest group for Kubernetes user interfaces.  

**Meet SIG-UI: the place for building awesome user interfaces for Kubernetes**  
The SIG UI mission is simple: we want to radically improve the user experience of all Kubernetes graphical user interfaces. Our goal is to craft UIs that are used by devs, ops and resource managers across their various environments, that are simultaneously intuitive enough for newcomers to Kubernetes to understand and use.  

SIG UI members have been independently working on a variety of UIs for Kubernetes. So far, the projects we’ve seen have been either custom internal tools coupled to their company workflows, or specialized API frontends. We have realized that there is a need for a universal UI that can be used standalone or be a standard base for custom vendors. That’s how we started the [Dashboard UI](http://github.com/kubernetes/dashboard) project. Version 1.0 has been recently released and is included with Kubernetes as a cluster addon. The Dashboard project was recently featured in a [talk at KubeCon EU](https://www.youtube.com/watch?v=sARH5zQhovE), and we have ambitious plans for the future!  

| ![](https://lh4.googleusercontent.com/jsHjTjFstXaq17Axu0xduW6Dd5g3EkEUmtStNsPmhvw5pxGuYxnhSRSkspHnpExKd0lBnhkD_F58sM7DVfjlYsGZLOYcKJghhK0cTxAdgk2Cun02RY-hSuUztugHJG8MmTmH8OPM) |
| Dashboard UI v1.0 home screen showing applications running in a Kubernetes cluster. |


Since the initial release of the Dashboard UI we have been thinking hard about what to do next and what users of UIs for Kubernetes think about our plans. We’ve had many internal discussions on this topic, but most importantly, reached out directly to our users. We created a questionnaire asking a few demographic questions as well as questions for prioritizing use cases. We received more than 200 responses from a wide spectrum of user types, which in turn helped to shape the Dashboard UI’s [current roadmap](https://github.com/kubernetes/dashboard/blob/master/docs/devel/roadmap.md). Our members from LiveWyer summarised the results in a [nice infographic](http://static.lwy.io/img/kubernetes_dashboard_infographic.png).&nbsp;  

**Connect with us**    

We believe that collaboration is the key to SIG UI success, so we invite everyone to connect with us. Whether you’re a Kubernetes user who wants to provide feedback, develop your own UIs, or simply want to collaborate on the Dashboard UI project, feel free to get in touch. There are many ways you can contact us:  

- Email us at the [sig-ui mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-ui)
- Chat with us on the [Kubernetes Slack](http://slack.k8s.io/): #[sig-ui channel](https://kubernetes.slack.com/messages/sig-ui/)
- Join our meetings: biweekly on Wednesdays 9AM PT (US friendly) and weekly 10AM CET (Europe friendly). See the [SIG-UI calendar](https://calendar.google.com/calendar/embed?src=google.com_52lm43hc2kur57dgkibltqc6kc%40group.calendar.google.com&ctz=Europe/Warsaw) for details.
