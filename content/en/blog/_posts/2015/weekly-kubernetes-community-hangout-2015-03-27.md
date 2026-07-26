---
title: " Weekly Kubernetes Community Hangout Notes - March 27 2015 "
date: 2015-03-28
slug: weekly-kubernetes-community-hangout
url: /blog/2015/03/Weekly-Kubernetes-Community-Hangout
---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.

Agenda:

\- Andy - demo remote execution and port forwarding

\- Quinton - Cluster federation - Postponed

\- Clayton - UI code sharing and collaboration around Kubernetes

Notes from meeting:

1\. Andy from RedHat:

* Demo remote execution

    * kubectl exec -p $POD -- $CMD

    * Makes a connection to the master as proxy, figures out which node the pod is on, proxies connection to kubelet, which does the interesting bit.  via nsenter.

    * Multiplexed streaming over HTTP using SPDY

    * Also interactive mode:

    * Assumes first container.  Can use -c $CONTAINER to pick a particular one.

    * If have gdb pre-installed in container, then can interactively attach it to running process

        * backtrace, symbol tbles, print, etc.  Most things you can do with gdb.

    * Can also with careful flag crafting run rsync over this or set up sshd inside container.

    * Some feedback via chat:
* Andy also demoed port forwarding
* nsenter vs. docker exec

    * want to inject a binary under control of the host, similar to pre-start hooks

    * socat, nsenter, whatever the pre-start hook needs
* would be nice to blog post on this
* version of nginx in wheezy is too old to support needed master-proxy functionality

2\. Clayton: where are we wrt a community organization for e.g. kubernetes UI components?

* google-containers-ui IRC channel, mailing list.
* Tim: google-containers prefix is historical, should just do "kubernetes-ui"
* also want to put design resources in, and bower expects its own repo.
* General agreement

3\. Brian Grant:

* Testing v1beta3, getting that ready to go in.
* Paul working on changes to commandline stuff.
* Early to mid next week, try to enable v1beta3 by default?
* For any other changes, file issue and CC thockin.

4\. General consensus that 30 minutes is better than 60



* Shouldn't artificially try to extend just to fill time.
