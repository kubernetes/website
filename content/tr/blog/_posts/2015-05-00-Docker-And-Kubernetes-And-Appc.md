---
title: " Docker and Kubernetes and AppC  "
date: 2015-05-18
slug: docker-and-kubernetes-and-appc
url: /blog/2015/05/Docker-And-Kubernetes-And-Appc
author: >
   Craig McLuckie (Google)
---
Recently we announced the intent in Kubernetes, our open source cluster manager, to support AppC and RKT, an alternative container format that has been driven by CoreOS with input from many companies (including Google). &nbsp;This announcement has generated a surprising amount of buzz and has been construed as a move from Google to support Appc over Docker. &nbsp;Many have taken it as signal that Google is moving away from supporting Docker. &nbsp;I would like to take a moment to clarify Google’s position in this.


Google has consistently supported the Docker initiative and has invested heavily in Docker. In the early days of containers, we decided to de-emphasize our own open source offering (LMCTFY) and to instead focus on Docker. &nbsp;As a result of that we have two engineers that are active maintainers of LibContainer, a critical piece of the Docker ecosystem and are working closely with Docker to add many additional features and capabilities. &nbsp;Docker is currently the only supported runtime in GKE (Google Container Engine) our commercial containers product, and in GAE (Google App Engine), our Platform-as-a-Service product. &nbsp;


While we may introduce AppC support at some point in the future to GKE based on our customers demand, we intend to continue to support the Docker project and product, and Docker the company indefinitely. &nbsp;To date Docker is by far the most mature and widely used container offering in the market, with over 400 million downloads. &nbsp;It has been production ready for almost a year and seen widespread use in industry, and also here inside Google.


Beyond the obvious traction Docker has in the market, we are heartened by many of Docker’s recent initiatives to open the project and support ‘batteries included, but swappable options across the stack and recognize that it offers a great developer experience for engineers new to the containers world. &nbsp;We are encouraged, for example, by the separation of the Docker Machine and Swarm projects from the core runtime, and are glad to see support for Docker Machine emerging for Google Compute Engine.


Our intent with our announcement for AppC and RKT support was to establish Kubernetes (our open source project) as a neutral ground in the world of containers. &nbsp;Customers should be able to pick their container runtime and format based solely on its technical merits, and we do see AppC as offering some legitimate potential merits as the technology matures. &nbsp;Somehow this was misconstrued as an ‘a vs b’ selection which is simply untrue. &nbsp;The world is almost always better for having choice, and it is perfectly natural that different tools should be available for different purposes. &nbsp;


Stepping back a little, one must recognize that Docker has done remarkable work in democratizing container technologies and making them accessible to everyone. &nbsp;We believe that Docker will continue to drive great experiences for developers looking to use containers and plan to support this technology and its burgeoning community indefinitely. &nbsp;We, for one, &nbsp;are looking forward to the upcoming Dockercon where Brendan Burns (a Kubernetes co-founder) will be talking about the role of Docker in modern distributed systems design.
