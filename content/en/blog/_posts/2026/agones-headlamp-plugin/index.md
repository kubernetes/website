---
layout: blog
title: "Inspect Agones game servers faster with Headlamp"
draft: true
slug: agones-headlamp-plugin
author: >
  [Ashwani Yadav](https://github.com/NAME-ASHWANIYADAV) (independent)
---

[Agones](https://agones.dev/) is an open source platform for running and scaling dedicated multiplayer game servers on Kubernetes. [Headlamp](https://headlamp.dev/) is an extensible Kubernetes web UI and a [Kubernetes SIG UI](https://github.com/kubernetes/community/tree/master/sig-ui) project. The [Agones plugin for Headlamp](https://github.com/agones-dev/headlamp-plugin) brings Agones resources into the Headlamp interface, so you can operate a game server platform without reconstructing its state from YAML in a terminal.

Watch this short walkthrough to see the Agones plugin in Headlamp:

{{< youtube id="9YVuXdYimUY" title="Agones Headlamp plugin walkthrough" >}}

## Game servers are not ordinary workloads

Kubernetes was designed around replaceable workloads: when a [Pod](/docs/concepts/workloads/pods/) managed by a [controller](/docs/concepts/architecture/controller/) dies, the controller replaces it and nobody notices. Dedicated game servers break that assumption. Each one holds a live play session, and deleting the wrong Pod disconnects real players in the middle of a match.

Agones models this with its own resources and a lifecycle that goes well beyond Pod phases:

- A GameServer is a single game server instance. It moves through states such as `Scheduled`, `Ready`, `Allocated` (assigned to a game session), and `Reserved`.
- A Fleet keeps a warm pool of identical, ready game servers waiting for players.
- A FleetAutoscaler grows or shrinks that pool, using buffer sizes, webhooks, counters and lists, or schedules.
- A GameServerAllocation picks a ready server out of the pool and hands it to a match.

Operating this from the command line means switching between `kubectl get gameservers`, `kubectl get fleets`, and `kubectl describe fleetautoscaler`, then cross-referencing their status blocks by hand. The questions operators actually ask are more concrete than that: which servers have players on them right now? Why is the fleet not scaling? Which Pod backs this game server?

## Fleet status at a glance

The plugin adds an **Agones** section to Headlamp's sidebar. The overview page shows game server counts grouped by lifecycle state, fleet replica health, and autoscaler activity for the whole cluster.

{{< figure src="agones-overview.png" alt="The Agones overview page in Headlamp, showing game server state counts and a fleet summary" caption="The Agones overview in Headlamp" >}}

List views cover fleets, game servers, and autoscalers. Game server rows carry color-coded lifecycle state chips, autoscaler rows show a scaling-status chip, and fleet rows show a replica-health bar. An `Unhealthy` server, or a batch of servers stuck in `Creating`, stands out immediately. Game servers link back to the fleet that owns them, so you can jump from a misbehaving server to its fleet in one click.

## A warning banner on allocated game servers

The game server detail page shows the state, node address and ports, counters and lists, and health-check configuration. When a server is `Allocated`, the plugin adds a prominent warning banner to the page: players may be connected, so operators should take care not to interrupt the session by editing or deleting the server.

{{< figure src="gameserver-allocated.png" alt="A GameServer detail page showing an Allocated state chip and a warning banner about an active game session" caption="An allocated game server, with a banner protecting the live session" >}}

## Autoscaler policies in plain terms

Agones supports several autoscaling policy types, each with its own nested configuration. The FleetAutoscaler detail view renders the policies it understands (Buffer, Webhook, Counter, List, Schedule, and Chain) as readable tables, and spells out the status: current versus desired replicas, whether the autoscaler can scale, and whether it has hit its limits.

{{< figure src="fleetautoscaler-detail.png" alt="A FleetAutoscaler detail page showing a Buffer policy table and current scaling status" caption="A FleetAutoscaler's policy and status, decoded" >}}

## Allocations without hand-written manifests

Writing a GameServerAllocation manifest by hand is error-prone, and a malformed one fails in unhelpful ways. The plugin includes an allocation dialog instead: pick label selectors, the required game server state, a scheduling strategy, counter and list filters, and priorities. The dialog drops empty or malformed entries before building the request.

{{< figure src="allocation-dialog.png" alt="The game server allocation dialog in Headlamp with fields for selectors, scheduling, and counter filters" caption="Creating a GameServerAllocation from the UI" >}}

## A map of fleets, game servers, and Pods

For the "which Pod backs this game server?" question, the plugin extends Headlamp's map view with Agones resources. Fleets, game servers, and their backing Pods appear as a connected graph, so ownership is something you see rather than something you query for.

## It stays out of the way

The plugin checks whether the Agones [custom resource definitions (CRDs)](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) are installed before rendering anything. On clusters without Agones, opening any of the plugin's pages shows a short banner linking to the [Agones installation guide](https://agones.dev/site/docs/installation/install-agones/) instead of empty tables, so you can keep the plugin enabled across every cluster you manage.

None of this replaces `kubectl` or the Agones SDK tooling. The plugin is for interactive work: checking fleet health, chasing a stuck server, allocating a test match. Automation and scripting still belong to the command line.

## Try it out

I built this plugin during an [LFX Mentorship](https://lfx.linuxfoundation.org/tools/mentorship/) with the Agones and Headlamp communities; as of publication, it is alpha software.

1. [Install Headlamp](https://headlamp.dev/docs/latest/installation/) (desktop or in-cluster).
2. [Install Agones](https://agones.dev/site/docs/installation/) in a cluster.
3. Install the plugin from Headlamp's **Plugin Catalog** (search for "Agones"), or build it from source using the steps in the plugin's [README](https://github.com/agones-dev/headlamp-plugin#readme).
4. Look for the **Agones** section in Headlamp's sidebar.

Bug reports and contributions are welcome on the plugin's [issue tracker](https://github.com/agones-dev/headlamp-plugin/issues), where the roadmap also lives. If you run game servers on Kubernetes, try it on a test cluster and tell us which views would save you the most time.

Thanks to Mark Mandel, René Dudfield, Thomas Lacroix, and Ashu Ghildiyal for their guidance and reviews throughout the mentorship.
