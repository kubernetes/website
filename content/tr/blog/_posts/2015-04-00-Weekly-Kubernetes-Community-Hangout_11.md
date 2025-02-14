---
title: " Weekly Kubernetes Community Hangout Notes - April 10 2015 "
date: 2015-04-11
slug: weekly-kubernetes-community-hangout_11
url: /blog/2015/04/Weekly-Kubernetes-Community-Hangout_11
---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.

Agenda:  

* kubectl tooling, rolling update, deployments, imperative commands.
* Downward API / env. substitution, and maybe preconditions/dependencies.


**Notes from meeting:**  

1\. kubectl improvements

* make it simpler to use, finish rolling update, higher-level deployment concepts.
* rolling update

    * today
        * can replace one rc by another rc specified by a file.

        * no explicit support for rollback, can sort of do it by doing rolling update to old version.

        * we keep annotations on rcs to keep track of desired # instances; won't work for rollback case b/c not symmetric.

    * need immutable image ids; currently no uuid that corresponds to image,version so if someone pushes on top you'll re-pull that; in API server we should translate images into uuids (as close to edge as possible).

    * would be nice to auto-gen new rc instead of having user update it (e.g. when change image tag for container, etc.; currently need to change rc name and label value; could automate generating new rc).

    * treating rcs as pets vs. cattle.

    * "roll me from v1 to v2" (or v2 to v1) - good enough for most people. don't care about record of what happened in the past.

    * we're providing the module ansible can call to make something happen.

    * how do you keep track of multiple templates; today we use multiple RCs.

    * if we had a deployment controller; deployment config spawns pos that runs rolling update; trigger is level-based update of image repository.

    * alternative short-term proposal: create new rc as clone of old one, futz with counts so new one is old one and vv, bring prev-named one (pet) down to zero and bring it back up with new template (this is very similar to how Borg does job updates).
        * is it worthwhile if we want to have the deployments anyway? Yes b/c we have lots of concepts already; need to simplify.

    * deployment controller keeps track of multiple templates which is what you need for rolling updates and canaries.

    * only reason for new thing is to move the process into the server instead of the client?

    * may not need to make it an API object; should provide experience where it's not an API object and is just something client side.

    * need an experience now so need to do it in client because object won't land before 1.0.

    * having simplified experience for people who only want to enageg w/ RCs.

    * how does rollback work: ctrl-c, rollout v2 v1. rollback pattern can be in person's head. 2 kinds of rollback: i'm at steady state and want to go back, and i've got canary deployment and hit ctrl-c how do i get rid of the canary deployment (e.g. new is failing). ctrl-c might not work. delete canary controller and its pods. wish there was a command to also delete pods (there is -- kbectl stop). argument for not reusing name: when you move fwd you can stop the new thing and you're ok, vs. if you replace the old one and you've created a copy if you hit ctrl-c you don't have anything you can stop. but you could wait to flip the name until the end, use naming convention so can figure out what is going on, etc.

    * two different experiences: (1) i'm using version control, have version history of last week rollout this week, rolling update with two files -> create v2, ??? v1, don't have a pet - moved into world of version control where have cumulative history and; (1) imperative kubectl v1 v2 where sys takes care of details, that's where we use the snapshot pattern.

* other imperative commands

    * run-container (or just run): spec command on command line which makes it more similar to docker run; but not multi-container pods.

    * \--forever vs. not (one shot exec via simple command).

    * would like it go interactive - run -it and runs in cluster but you have interactive terminal to your process.

    * how do command line args work. could say --image multiple times. will cobra support? in openshift we have clever syntax for grouping arguments together. doesn't work for real structured parameters.

    * alternative: create pod; add container add container ...; run pod -- build and don't run object until 'run pod'.

        * \-- to separate container args.

        * create a pod, mutate it before you run it - like initializer pattern.
* kind discovery

    * if we have run and sometimes it creates an rc and sometimes it doesn't, how does user know what to delete if they want to delete whatever they created with run.

    * bburns has proposal for don't specify kind if you do command like stop, delete; let kubectl figure it out.

    * alternative: allow you to define alias from name to set of resource types, eg. delete all which would follow that alias (all could mean everything in some namespace, or unscoped, etc.) - someone explicitly added something to a set vs. accidentally showed up like nodes.

    * would like to see extended to allow tools to specify their own aliases (not just users); e.g. resize can say i can handle RCs, delete can say I can handle everything, et.c so we can automatically do these things w/o users have to specify stuff. but right mechanism.

    * resourcebuilder has concept of doing that kind of expansion depending on how we fit in targeted commands. for instance if you want to add a volume to pods and rcs, you need something to go find the pod template and change it. there's the search part of it (delete nginx -> you have to figure out what object they are referring to) and then command can say i got a pod i know what to do with a pod.

    * alternative heuristic: what if default target of all commands was deployments. kubectl run -> deployment. too much work, easier to clean up existing CLI. leave door open for that. macro objects OK but a lot more work to make that work. eventually will want index to make these efficient. could rely more on swagger to tell us types.

2\. paul/downward api: env substitution

  * create ad-hoc env var like strings, e.g. k8s_pod_name that would get sub'd by system in objects.
  * allow people to create env vars that refer to fields of k8s objects w/o query api from inside their container; in some cases enables query api from their container (e.g. pass obj names, namespaces); e.g. sidecar containers need this for pulling things from api server.
  * another proposal similar: instead of env var like names, have JSON-path-like syntax for referring to object field names; e.g. $.[metadata.name][1] to refer to name of current object, maybe have some syntax for referring to related objects like node that a pod is on. advantage of JSON path-like syntax is that it's less ad hoc. disadvantage is that you can only refer to things that are fields of objects.
  * for both, if you populate env vars then you have drawback that fields only set when container is created. but least degree of coupling -- off the shelf containers, containers don't need to know how to talk to k8s API. keeps the k8s concepts in the control plane.
  * we were converging on JSON path like approach. but need prototype or at least deeper proposal to demo.
  * paul: one variant is for env vars in addition to value field have different sources which is where you would plug in e.g. syntax you use to describe a field of an object; another source would be a source that described info about the host. have partial prototype. clean separation between what's in image vs. control plane. could use source idea for volume plugin.
  * use case: provide info for sidecar container to contact API server.
  * use case: pass down unique identifiers or things like using UID as unique identifier.
  * clayton: for rocket or gce metadata service being available for every pod for more sophisticated things; most containers want to find endpoint of service.

3\. preconditions/dependencies

* when you create pods that talk to services, the service env vars only get populated if you create the objs in the right order. if you use dns it's less of a problem but some apps are fragile. may crash if svc they depend on is not there, may take a long time to restart. proposal to have preconds that block starting pods until objs they depend on exist.
* infer automatically if we ask people to declare which env vars they wanted, or have dep mech at pod or rc or obj level to say this obj doesn't become active until this other thing exists.
* can use event hook? only app owner knows their dependency or when service is ready to serve.
* one proposal is to use pre-start hook. another is precondition probe - pre-start hook could do a probe. does anything respond when i hit this svc address or ip, then probe fails. could be implemented in pre-start hook. more useful than post-start. is part of rkt spec. has stages 0, 1, 2. hard to do in docker today, easy in rocket.
* pre-start hook in container: how will affect readiness probe since the container might have a lock until some arbitrary condition is met if you implement with prestart hook. there has to be some compensation on when kubelet runs readiness/liveness probes if you have a hook. Systemd has timeouts around the stages of process lifecycle.
* if we go to black box model of container pre-start makes sense; if container spec becomes more descriptive of process model like systemd, then does kubelet need to know more about process model to do the right thing.
* ideally msg from inside the container to say i've done all of my pre-start actions. sdnotify for systemd does this. you tell systemd that you're done, it will communicate to other deps that you're alive.
* but... someone could just implement preconds inside their container. makes it easier to adapt an app w/o having to change their image. alternative is just have a pattern how they do it themselves but we don't do it for them.

[1]: http://metadata.name/
