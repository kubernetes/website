---
layout: blog
title: 'Using Go workspaces in Kubernetes'
date: 2024-03-19T08:30:00-08:00
slug: go-workspaces-in-kubernetes
canonicalUrl: https://www.kubernetes.dev/blog/2024/03/19/go-workspaces-in-kubernetes/
---

**Author:** Tim Hockin (Google)

The [Go programming language](https://go.dev/) has played a huge role in the
success of Kubernetes. As Kubernetes has grown, matured, and pushed the bounds
of what "regular" projects do, the Go project team has also grown and evolved
the language and tools. In recent releases, Go introduced a feature called
"workspaces" which was aimed at making projects like Kubernetes easier to
manage.

We've just completed a major effort to adopt workspaces in Kubernetes, and the
results are great. Our codebase is simpler and less error-prone, and we're no
longer off on our own technology island.

## GOPATH and Go modules

Kubernetes is one of the most visible open source projects written in Go. The
earliest versions of Kubernetes, dating back to 2014, were built with Go 1.3.
Today, 10 years later, Go is up to version 1.22 — and let's just say that a
_whole lot_ has changed.

In 2014, Go development was entirely based on
[`GOPATH`](https://go.dev/wiki/GOPATH). As a Go project, Kubernetes lived by the
rules of `GOPATH`. In the buildup to Kubernetes 1.4 (mid 2016), we introduced a
directory tree called `staging`. This allowed us to pretend to be multiple
projects, but still exist within one git repository (which had advantages for
development velocity). The magic of `GOPATH` allowed this to work.

Kubernetes depends on several code-generation tools which have to find, read,
and write Go code packages. Unsurprisingly, those tools grew to rely on
`GOPATH`. This all worked pretty well until Go introduced modules in Go 1.11
(mid 2018).

Modules were an answer to many issues around `GOPATH`. They gave more control to
projects on how to track and manage dependencies, and were overall a great step
forward. Kubernetes adopted them. However, modules had one major drawback —
most Go tools could not work on multiple modules at once. This was a problem
for our code-generation tools and scripts.

Thankfully, Go offered a way to temporarily disable modules (`GO111MODULE` to
the rescue). We could get the dependency tracking benefits of modules, but the
flexibility of `GOPATH` for our tools. We even wrote helper tools to create fake
`GOPATH` trees and played tricks with symlinks in our vendor directory (which
holds a snapshot of our external dependencies), and we made it all work.

And for the last 5 years it _has_ worked pretty well. That is, it worked well
unless you looked too closely at what was happening. Woe be upon you if you
had the misfortune to work on one of the code-generation tools, or the build
system, or the ever-expanding suite of bespoke shell scripts we use to glue
everything together.

## The problems

Like any large software project, we Kubernetes developers have all learned to
deal with a certain amount of constant low-grade pain. Our custom `staging`
mechanism let us bend the rules of Go; it was a little clunky, but when it
worked (which was most of the time) it worked pretty well. When it failed, the
errors were inscrutable and un-Googleable — nobody else was doing the silly
things we were doing. Usually the fix was to re-run one or more of the `update-*`
shell scripts in our aptly named `hack` directory.

As time went on we drifted farther and farher from "regular" Go projects. At
the same time, Kubernetes got more and more popular. For many people,
Kubernetes was their first experience with Go, and it wasn't always a good
experience.

Our eccentricities also impacted people who consumed some of our code, such as
our client library and the code-generation tools (which turned out to be useful
in the growing ecosystem of custom resources). The tools only worked if you
stored your code in a particular `GOPATH`-compatible directory structure, even
though `GOPATH` had been replaced by modules more than four years prior.

This state persisted because of the confluence of three factors:
1. Most of the time it only hurt a little (punctuated with short moments of
   more acute pain).
1. Kubernetes was still growing in popularity - we all had other, more urgent
   things to work on.
1. The fix was not obvious, and whatever we came up with was going to be both
   hard and tedious.

As a Kubernetes maintainer and long-timer, my fingerprints were all over the
build system, the code-generation tools, and the `hack` scripts. While the pain
of our mess may have been low _on_average_, I was one of the people who felt it
regularly.

## Enter workspaces

Along the way, the Go language team saw what we (and others) were doing and
didn't love it. They designed a new way of stitching multiple modules together
into a new _workspace_ concept. Once enrolled in a workspace, Go tools had
enough information to work in any directory structure and across modules,
without `GOPATH` or symlinks or other dirty tricks.

When I first saw this proposal I knew that this was the way out. This was how
to break the logjam. If workspaces was the technical solution, then I would
put in the work to make it happen.

## The work

Adopting workspaces was deceptively easy. I very quickly had the codebase
compiling and running tests with workspaces enabled. I set out to purge the
repository of anything `GOPATH` related. That's when I hit the first real bump -
the code-generation tools.

We had about a dozen tools, totalling several thousand lines of code. All of
them were built using an internal framework called
[gengo](https://github.com/kubernetes/gengo), which was built on Go's own
parsing libraries. There were two main problems:

1. Those parsing libraries didn't understand modules or workspaces.
1. `GOPATH` allowed us to pretend that Go _package paths_ and directories on
   disk were interchangeable in trivial ways. They are not.

Switching to a
[modules- and workspaces-aware parsing](https://pkg.go.dev/golang.org/x/tools/go/packages)
library was the first step. Then I had to make a long series of changes to
each of the code-generation tools. Critically, I had to find a way to do it
that was possible for some other person to review! I knew that I needed
reviewers who could cover the breadth of changes and reviewers who could go
into great depth on specific topics like gengo and Go's module semantics.
Looking at the history for the areas I was touching, I asked Joe Betz and Alex
Zielenski (SIG API Machinery) to go deep on gengo and code-generation, Jordan
Liggitt (SIG Architecture and all-around wizard) to cover Go modules and
vendoring and the `hack` scripts, and Antonio Ojea (wearing his SIG Testing
hat) to make sure the whole thing made sense. We agreed that a series of small
commits would be easiest to review, even if the codebase might not actually
work at each commit.

Sadly, these were not mechanical changes. I had to dig into each tool to
figure out where they were processing disk paths versus where they were
processing package names, and where those were being conflated. I made
extensive use of the [delve](https://github.com/go-delve/delve) debugger, which
I just can't say enough good things about.

One unfortunate result of this work was that I had to break compatibility. The
gengo library simply did not have enough information to process packages
outside of GOPATH. After discussion with gengo and Kubernetes maintainers, we
agreed to make [gengo/v2](https://github.com/kubernetes/gengo/tree/master/v2).
I also used this as an opportunity to clean up some of the gengo APIs and the
tools' CLIs to be more understandable and not conflate packages and
directories. For example you can't just string-join directory names and
assume the result is a valid package name.

Once I had the code-generation tools converted, I shifted attention to the
dozens of scripts in the `hack` directory. One by one I had to run them, debug,
and fix failures. Some of them needed minor changes and some needed to be
rewritten.

Along the way we hit some cases that Go did not support, like workspace
vendoring. Kubernetes depends on vendoring to ensure that our dependencies are
always available, even if their source code is removed from the internet (it
has happened more than once!). After discussing with the Go team, and looking
at possible workarounds, they decided the right path was to
[implement workspace vendoring](https://github.com/golang/go/issues/60056).

The eventual Pull Request contained over 200 individual commits.

## Results

Now that this work has been merged, what does this mean for Kubernetes users?
Pretty much nothing. No features were added or changed. This work was not
about fixing bugs (and hopefully none were introduced).

This work was mainly for the benefit of the Kubernetes project, to help and
simplify the lives of the core maintainers. In fact, it would not be a lie to
say that it was rather self-serving - my own life is a little bit better now.

This effort, while unusually large, is just a tiny fraction of the overall
maintenance work that needs to be done. Like any large project, we have lots of
"technical debt" — tools that made point-in-time assumptions and need
revisiting, internal APIs whose organization doesn't make sense, code which
doesn't follow conventions which didn't exist at the time, and tests which
aren't as rigorous as they could be, just to throw out a few examples. This
work is often called "grungy" or "dirty", but in reality it's just an
indication that the project has grown and evolved. I love this stuff, but
there's far more than I can ever tackle on my own, which makes it an
interesting way for people to get involved.  As our unofficial motto goes:
"chop wood and carry water".

Kubernetes used to be a case-study of how _not_ to do large-scale Go
development, but now our codebase is simpler (and in some cases faster!) and
more consistent. Things that previously seemed like they _should_ work, but
didn't, now behave as expected.

Our project is now a little more "regular". Not completely so, but we're
getting closer.

## Thanks

This effort would not have been possible without tons of support.

First, thanks to the Go team for hearing our pain, taking feedback, and solving
the problems for us.

Special mega-thanks goes to Michael Matloob, on the Go team at Google, who
designed and implemented workspaces. He guided me every step of the way, and
was very generous with his time, answering all my questions, no matter how
dumb.

Writing code is just half of the work, so another special thanks to my
reviewers: Jordan Liggitt, Joe Betz, Alexander Zielenski, and Antonio Ojea.
These folks brought a wealth of expertise and attention to detail, and made
this work smarter and safer.
