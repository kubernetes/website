---
layout: blog
title: " Weekly Kubernetes Community Hangout Notes - March 27 2015 "
date:  Sunday, March 28, 2015 

---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.

  

Agenda:

- Andy - demo remote execution and port forwarding

- Quinton - Cluster federation - Postponed

- Clayton - UI code sharing and collaboration around Kubernetes

  

Notes from meeting:

1. Andy from RedHat:

- 
Demo remote execution

  - 
kubectl exec -p $POD -- $CMD
  - 
Makes a connection to the master as proxy, figures out which node the pod is on, proxies connection to kubelet, which does the interesting bit. &nbsp;via nsenter.
  - 
Multiplexed streaming over HTTP using SPDY
  - 
Also interactive mode:

    - 
 kubectl exec -p $POD -it -- bash -il
  - 
Assumes first container. &nbsp;Can use -c $CONTAINER to pick a particular one.
  - 
If have gdb pre-installed in container, then can interactively attach it to running process

    - 
backtrace, symbol tbles, print, etc. &nbsp;Most things you can do with gdb.
  - 
Can also with careful flag crafting run rsync over this or set up sshd inside container.
  - 
Some feedback via chat:

    - 
UI feedback: things like kubectl log do not take a -p/-c they just expect it to be there.....

      - 
right
      - 
i think we would remove -p eventually
      - 
we were just trying to be cautious because we knew we needed to support CLI args afterwards
      - 
and everyone gets that wrong the first time
    - 
-- is hard

      - 
cobra had bugs with it
      - 
but that's what we support
      - 
also we want to bypass shell args in some cases
- 
Andy also demoed port forwarding

  - 
kubectl port-forward -p $POD $LOCALPORT:$REMOTEPORT &
  - 
localhost% http :$LOCALPORT
- 
nsenter vs. docker exec

  - 
want to inject a binary under control of the host, similar to pre-start hooks
  - 
socat, nsenter, whatever the pre-start hook needs
- 
would be nice to blog post on this

  - 
how to use it. &nbsp;or even a screencast?
  - 
we have a youtube channel and a blog for kubernetes.io
- 
version of nginx in wheezy is too old to support needed master-proxy functionality

  - 
but wheezy-backports seems to have an ok version, so we should pull that in.

2. Clayton: where are we wrt a community organization for e.g. kubernetes UI components?

- 
google-containers-ui IRC channel, mailing list.
- 
Tim: google-containers prefix is historical, should just do “kubernetes-ui”
- 
also want to put design resources in, and bower expects its own repo.
- 
General agreement

3. Brian Grant:

- 
Testing v1beta3, getting that ready to go in.
- 
Paul working on changes to commandline stuff.
- 
Early to mid next week, try to enable v1beta3 by default?
- 
For any other changes, file issue and CC thockin.

4. General consensus that 30 minutes is better than 60
  

- Shouldn’t artificially try to extend just to fill time.
