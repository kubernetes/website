---
title: 'Kubernetes, Cloud Native, and the Future of Software'
date: 2019-05-17
---

**Authors:** Brian Grant (Google), Jaice Singer DuMars (Google)

# Kubernetes, Cloud Native, and the Future of Software

Five years ago this June, Google Cloud announced a new application management technology called Kubernetes. It began with a [simple open source commit](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56), followed the next day by a [one-paragraph blog mention](https://cloudplatform.googleblog.com/2014/06/an-update-on-container-support-on-google-cloud-platform.html) around container support. Later in the week, Eric Brewer [talked about Kubernetes for the first time](https://www.youtube.com/watch?v=YrxnVKZeqK8) at DockerCon. And soon the world was watching. 

We’re delighted to see Kubernetes become core to the creation and operation of modern software, and thereby a key part of the global economy. To us, the success of Kubernetes represents even more: A business transition with truly worldwide implications, thanks to the unprecedented cooperation afforded by the open source software movement. 

Like any important technology, Kubernetes has become about more than just itself; it has positively affected the environment in which it arose, changing how software is deployed at scale, how work is done, and how corporations engage with big open-source projects.

Let’s take a look at how this happened, since it tells us a lot about where we are today, and what might be happening next.

**Beginnings**

The most important precursor to Kubernetes was the rise of application containers. Docker, the first tool to really make containers usable by a broad audience, began as an open source project in 2013. By containerizing an application, developers could achieve easier language runtime management, deployment, and scalability. This triggered a sea change in the application ecosystem. Containers made stateless applications easily scalable and provided an immutable deployment artifact that drastically reduced the number of variables previously encountered between test and production systems. 

While containers presented strong stand-alone value for developers, the next challenge was how to deliver and manage services, applications, and architectures that spanned multiple containers and multiple hosts. 

Google had already encountered similar issues within its own IT infrastructure. Running the world’s most popular search engine (and several other products with millions of users) lead to early innovation around, and adoption of, containers. Kubernetes was inspired by Borg, Google’s internal platform for scheduling and managing the hundreds of millions, and eventually billions, of containers that implement all of our services. 

Kubernetes is more than just “Borg, for everyone” It distills the most successful architectural and API patterns of prior systems and couples them with load balancing, authorization policies, and other features needed to run and manage applications at scale. This in turn provides the groundwork for cluster-wide abstractions that allow true portability across clouds.

The November 2014 [alpha launch](https://cloudplatform.googleblog.com/2014/11/google-cloud-platform-live-introducing-container-engine-cloud-networking-and-much-more.html) of Google Cloud’s [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/) introduced managed Kubernetes. There was an explosion of innovation around Kubernetes, and companies from the enterprise down to the startup saw barriers to adoption fall away. Google, Red Hat, and others in the community increased their investment of people, experience, and architectural know-how to ensure it was ready for increasingly mission-critical workloads. The response was a wave of adoption that swept it to the forefront of the crowded container management space. 

**The Rise of Cloud Native**

Every enterprise, regardless of its core business, is embracing more digital technology. The ability to rapidly adapt is fundamental to continued growth and competitiveness. Cloud-native technologies, and especially Kubernetes, arose to meet this need, providing the automation and observability necessary to manage applications at scale and with high velocity. Organizations previously constrained to quarterly deployments of critical applications can now deploy safely multiple times a day.

Kubernetes’s declarative, API-driven infrastructure empowers teams to operate independently, and enables them to focus on their business objectives. An inevitable cultural shift in the workplace has come from enabling greater autonomy and productivity and reducing the toil of development teams.

**Increased engagement with open source**

The ability for teams to rapidly develop and deploy new software creates a virtuous cycle of success for companies and technical practitioners alike. Companies have started to recognize that contributing back to the software projects they use not only improves the performance of the software for their use cases, but also builds critical skills and creates challenging opportunities that help them attract and retain new developers.

The Kubernetes project in particular curates a collaborative culture that encourages contribution and sharing of learning and development with the community. This fosters a positive-sum ecosystem that benefits both contributors and end-users equally.

**What’s Next?**

Where Kubernetes is concerned, five years seems like an eternity. That says much about the collective innovation we’ve seen in the community, and the rapid adoption of the technology. 

In other ways, it is just the start. New applications such as machine learning, edge computing, and the Internet of Things are finding their way into the cloud native ecosystem via projects like Kubeflow. Kubernetes is almost certain to be at the heart of their success.

Kubernetes may be most successful if it becomes an invisible essential of daily life, like urban plumbing or electrical grids. True standards are dramatic, but they are also taken for granted. As Googler and KubeCon co-chair Janet Kuo said in a [recent keynote](https://www.youtube.com/watch?v=LAO7RuWwfzA), Kubernetes is going to become boring, and that’s a good thing, at least for the majority of people who don’t have to care about container management. 

At Google Cloud, we’re still excited about the project, and we go to work on it every day. Yet it’s all of the solutions and extensions that expand from Kubernetes that will dramatically change the world as we know it.

So, as we all celebrate the continued success of Kubernetes, remember to take the time and thank someone you see helping make the community better. It’s up to all of us to foster a cloud-native ecosystem that prizes the efforts of everyone who helps maintain and nurture the work we do together.

And, to everyone who has been a part of the global success of Kubernetes, thank you. You have changed the world.
