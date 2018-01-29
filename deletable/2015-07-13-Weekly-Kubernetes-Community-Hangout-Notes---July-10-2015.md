---
layout: blog
title: " Weekly Kubernetes Community Hangout Notes - July 10 2015 "
date:  Tuesday, July 13, 2015 

---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.  
  
Here are the notes from today's meeting:  
  
  

- 
1.0 Release Plan

  - 
0.21.0 is basically 1.0 but we plan to cut another release branch today &nbsp;for 1.0.0
  - 
This will be the 1.0 release modulo any cherry picks
  - 
Please use the new cherry pick script to propose a cherry pick to the release-1.0 branch
  - 
The first binary will be built today to soak over the weekend
- 
Gabe / Josh from Engine Yard: Demo/Overview of Deis + Kubernetes

  - 
Deis is open source PAAS - make it easy to deploy and manage distributed apps on a CoreOS cluster (using docker and now kubernetes)

    - 
133 contributors
  - 
Looked at many orchestration layers (Fleet, Mesos, Swarm, Kubernetes)

    - 
Currently running on Mesos
    - 
k8s APIs feel right for an orchestration engine and k8s feels like a great building block for a PAAS
  - 
What does Deis add?

    - 
Integrated http routing with https
    - 
Builder (for push to deploy)
    - 
Integrated docker registry
    - 
Integrated ceph cluster for scale out storage
    - 
Log routing and aggregation
    - 
User management with LDAP and AD support
    - 
Providing a CLI workflow to drive k8s
  - 
Demo

    - 
deis create example-go
    - 
git push deis master

      - 
packaging via Heroku build-pack -\> Docker image
      - 
push to registry co-located with the cluster
      - 
done and deployed
    - 
deis scale web=4
    - 
deis logs …

      - 
aggregates logs
    - 
deis config

      - 
application is running a release
      - 
release is made up of config + build
      - 
effectively sets environment variables
    - 
deis config:set POWERD\_BY=k8s

      - 
tells example-go to print different output (based on the environment)
    - 
deis releases

      - 
ledger of changes that allows you to do rollbacks
    - 
deis rollback v2

      - 
actually a roll-forward to ‘v4’ with the old config
    - 
deis run ‘ls -la’
    - 
deisctl

      - 
shows components on a 5 node cluster on AWS using CoreOS
  - 
Future

    - 
Plan to embrace k8s on a deeper level
    - 
In the limit, run k8s with a small number of pods specific to Deis that turn the cluster into a heroku-like PAAS
- 
Working on HTTP Router post 1.0

  - 
Going to use nginx or HAProxy (or both)
  - 
Work on getting API right, then implement with existing solutions
- 
Google Intern Turbo Demos

  - 
Daemons (per-node controller)

    - 
Launch an application on every node of the cluster or on all nodes that have specific labels
    - 
kubectl create -f sample\_dc.json

      - 
kind: DaemonController
      - 
No label selection → runs on all nodes
    - 
kubectl describe dc redis-master-copy

      - 
Tells you that the daemon is supposed to run on 4 nodes and is running on 4 nodes
    - 
kubectl create -f sample\_dc\_nodeselector.json

      - 
spec: nodeSelector inside the template
      - 
Will run on nodes that match the selector
    - 
kubectl label node kubernetes-minion-f917 color=red

      - 
Will run the pod on this node as well
      - 
If the node is full, the pod will try to launch and will stay pending
      - 
In the future, we may bump existing pods to make space
    - 
kubectl label --overwrite node kubernetes-minion-f917 color=grey

      - 
Removes the pod from this node
    - 
If the daemon and replication controller overlap, then they will fight
    - 
Can use a node selector or node name to restrict where the daemon runs
    - 
Can it run on a % of nodes?

      - 
Not in the current implementation
  - 
DiurnalController (PR #[10881](https://github.com/GoogleCloudPlatform/kubernetes/pull/10881))

    - 
Varies the number of pod replicas that are running throughout the day
    - Specify the times when the number of replicas change and how many to run at each time (uses absolute time -- currently in UTC)
