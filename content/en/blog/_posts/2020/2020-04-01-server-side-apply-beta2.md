---
layout: blog
title: Kubernetes 1.18 Feature Server-side Apply Beta 2
date: 2020-04-01
slug: Kubernetes-1.18-Feature-Server-side-Apply-Beta-2
author: >
  Antoine Pelisse (Google)
---

## What is Server-side Apply?
Server-side Apply is an important effort to migrate “kubectl apply” to the apiserver. It was started in 2018 by the Apply working group.

The use of kubectl to declaratively apply resources has exposed the following challenges:

- One needs to use the kubectl go code, or they have to shell out to kubectl.

- Strategic merge-patch, the patch format used by kubectl, grew organically and was challenging to fix while maintaining compatibility with various api-server versions.

- Some features are hard to implement directly on the client, for example, unions.


Server-side Apply is a new merging algorithm, as well as tracking of field ownership, running on the Kubernetes api-server. Server-side Apply enables new features like conflict detection, so the system knows when two actors are trying to edit the same field.

## How does it work, what’s managedFields?
Server-side Apply works by keeping track of which actor of the system has changed each field of an object. It does so by diffing all updates to objects, and recording all the fields that have changed as well the time of the operation. All this information is stored in the managedFields in the metadata of objects. Since objects can have many fields, this field can be quite large.

When someone applies, we can then use the information stored within managedFields to report relevant conflicts and help the merge algorithm to do the right thing.

## Wasn’t it already Beta before 1.18?
Yes, Server-side Apply has been Beta since 1.16, but it didn’t track the owner for fields associated with objects that had not been applied. This means that most objects didn’t have the managedFields metadata stored, and conflicts for these objects cannot be resolved. With Kubernetes 1.18, all new objects will have the managedFields attached to them and provide accurate information on conflicts.

## How do I use it?
The most common way to use this is through kubectl: `kubectl apply --server-side`. This is likely to show conflicts with other actors, including client-side apply. When that happens, conflicts can be forced by using the `--force-conflicts` flag, which will grab the ownership for the fields that have changed.

## Current limitations
We have two important limitations right now, especially with sub-resources. The first is that if you apply with a status, the status is going to be ignored. We are still going to try and acquire the fields, which may lead to invalid conflicts. The other is that we do not update the managedFields on some sub-resources, including scale, so you may not see information about a horizontal pod autoscaler changing the number of replicas.

## What’s next?
We are working hard to improve the experience of using server-side apply with kubectl, and we are trying to make it the default. As part of that, we want to improve the migration from client-side to server-side.

## Can I help?
Of course! The working-group apply is available on slack #wg-apply, through the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-wg-apply) and we also meet every other Tuesday at 9.30 PT on Zoom. We have lots of exciting features to build and can use all sorts of help.

We would also like to use the opportunity to thank the hard work of all the contributors involved in making this new beta possible:

* Daniel Smith
* Jenny Buckley
* Joe Betz
* Julian Modesto
* Kevin Wiesmüller
* Maria Ntalla
