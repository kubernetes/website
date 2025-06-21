---
title: " Weekly Kubernetes Community Hangout Notes - July 31 2015 "
date: 2015-08-04
slug: weekly-kubernetes-community-hangout
url: /blog/2015/08/Weekly-Kubernetes-Community-Hangout
---

Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.  

Here are the notes from today's meeting:  



* Private Registry Demo - Muhammed

    * Run docker-registry as an RC/Pod/Service

    * Run a proxy on every node

    * Access as localhost:5000

    * Discussion:

        * Should we back it by GCS or S3 when possible?

        * Run real registry backed by $object_store on each node

        * DNS instead of localhost?

            * disassemble image strings?

            * more like DNS policy?
* Running Large Clusters - Joe

    * Samsung keen to see large scale O(1000)

        * Starting on AWS

    * RH also interested - test plan needed

    * Plan for next week: discuss working-groups

    * If you are interested in joining conversation on cluster scalability send mail to [joe@0xBEDA.com][4]
* Resource API Proposal - Clayton

    * New stuff wants more info on resources

    * Proposal for resources API - ask apiserver for info on pods

    * Send feedback to: #11951

    * Discussion on snapshot vs time-series vs aggregates
* Containerized kubelet - Clayton

    * Open pull

    * Docker mount propagation - RH carries patches

    * Big issues around whole bootstrap of the system

        * dual: boot-docker/system-docker

    * Kube-in-docker is really nice, but maybe not critical

        * Do the small stuff to make progress

        * Keep pressure on docker
* Web UI (preilly)

    * Where does web UI stand?

        * OK to split it back out

        * Use it as a container image

        * Build image as part of kube release process

        * Vendor it back in?  Maybe, maybe not.

    * Will DNS be split out?

        * Probably more tightly integrated, instead

    * Other potential spin-outs:

        * apiserver

        * clients
