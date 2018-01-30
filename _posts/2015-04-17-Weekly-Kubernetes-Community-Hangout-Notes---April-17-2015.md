---
layout: blog
title: " Weekly Kubernetes Community Hangout Notes - April 17 2015 "
date:  Saturday, April 17, 2015 

---
  
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.  
  
Agenda  

- Mesos Integration
- High Availability (HA)
- Adding performance and profiling details to e2e to track regressions
- Versioned clients
  
Notes  
  

- 
Mesos integration

  - 
Mesos integration proposal: [https://github.com/GoogleCloudPlatform/kubernetes/issues/6676](https://github.com/GoogleCloudPlatform/kubernetes/issues/6676)
  - 
No blockers to integration.
  - 
Documentation needs to be updated.
- 
HA

  - 
Proposal should land today.
  - 
Etcd cluster.
  - 
Load-balance apiserver.
  - 
Cold standby for controller manager and other master components.
- 
Adding performance and profiling details to e2e to track regression

  - 
Want red light for performance regression
  - 
Need a public DB to post the data

    - 
See [https://github.com/GoogleCloudPlatform/kubernetes/issues/3118](https://github.com/GoogleCloudPlatform/kubernetes/issues/3118)
  - 
Justin working on multi-platform e2e dashboard
- 
Versioned clients

  - 
[https://github.com/GoogleCloudPlatform/kubernetes/issues/4874](https://github.com/GoogleCloudPlatform/kubernetes/issues/4874)
  - 
[https://github.com/GoogleCloudPlatform/kubernetes/issues/3955](https://github.com/GoogleCloudPlatform/kubernetes/issues/3955)
  - 
Client library currently uses internal API objects.
  - 
Nobody reported that frequent changes to types.go have been painful, but we are worried about it.
  - 
Structured types are useful in the client. Versioned structs would be ok.
  - 
If start with json/yaml (kubectl), shouldn’t convert to structured types. Use swagger.
- 
Security context

  - 
[https://github.com/GoogleCloudPlatform/kubernetes/pull/6287](https://github.com/GoogleCloudPlatform/kubernetes/pull/6287)
  - 
Administrators can restrict who can run privileged containers or require specific unix uids
  - 
Kubelet will be able to get pull credentials from apiserver
  - 
Policy proposal coming in the next week or so
- 
Discussing upstreaming of users, etc. into Kubernetes, at least as optional
- 
1.0 Roadmap

  - 
Focus is performance, stability, cluster upgrades
  - 
TJ has been making some edits to [roadmap.md](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/roadmap.md) but hasn’t sent out a PR yet
- 
Kubernetes UI

  - 
Dependencies broken out into third-party
  - @lavalamp is reviewer
