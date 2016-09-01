## Instructions for Contributing to the Docs/Website

Welcome! We are very pleased you want to contribute to the documentation and/or website for Kubernetes.

You can click the "Fork" button in the upper-right area of the screen to create a copy of our site on your GitHub account called a "fork." Make any changes you want in your fork, and when you are ready to send those changes to us, go to the index page for your fork and click "New Pull Request" to let us know about it.

## Staging the site on GitHub Pages

If you want to see your changes staged without having to install anything locally, remove the CNAME file in this directory and
change the name of the fork to be:

    YOUR_GITHUB_USERNAME.github.io

Then make your changes. 

When you visit [http://YOUR_GITHUB_USERNAME.github.io](http://YOUR_GITHUB_USERNAME.github.io) you should see a special-to-you version of the site that contains the changes you just made.

## Staging the site locally (using Docker)

Don't like installing stuff? Download and run a local staging server with a single `docker run` command. 

    git clone https://github.com/kubernetes/kubernetes.github.io.git
    cd kubernetes.github.io
    docker run -ti --rm -v "$PWD":/k8sdocs -p 4000:4000 johndmulhausen/k8sdocs

Then visit [http://localhost:4000](http://localhost:4000) to see our site. Any changes you make on your local machine will be automatically staged.

If you're interested you can view [the Dockerfile for this image](https://gist.github.com/johndmulhausen/f8f0ab8d82d2c755af3a4709729e1859).

## Staging the site locally (from scratch setup)

The below commands to setup your environment for running GitHub pages locally. Then, any edits you make will be viewable
on a lightweight webserver that runs on your local machine.

This will typically be the fastest way (by far) to iterate on docs changes and see them staged, once you get this set up, but it does involve several install steps that take awhile to complete, and makes system-wide modifications.

Install Ruby 2.2 or higher. If you're on Linux, run these commands:

    apt-get install software-properties-common
    apt-add-repository ppa:brightbox/ruby-ng
    apt-get install ruby2.2
    apt-get install ruby2.2-dev

* If you're on a Mac, follow [these instructions](https://gorails.com/setup/osx/). 
* If you're on a Windows machine you can use the [Ruby Installer](http://rubyinstaller.org/downloads/). During the installation make sure to check the option for *Add Ruby executables to your PATH*.

The remainder of the steps should work the same across operating systems.

To confirm you've installed Ruby correctly, at the command prompt run `gem --version` and you should get a response with your version number. Likewise you can confirm you have Git installed properly by running `git --version`, which will respond with your version of Git.

Install the GitHub Pages package, which includes Jekyll:

	gem install github-pages

Clone our site:

	git clone https://github.com/kubernetes/kubernetes.github.io.git

Make any changes you want. Then, to see your changes locally:

	cd kubernetes.github.io
	jekyll serve

Your copy of the site will then be viewable at: [http://localhost:4000](http://localhost:4000)
(or wherever Jekyll tells you).


## GitHub help

If you're a bit rusty with git/GitHub, you might wanna read
[this](http://readwrite.com/2013/10/02/github-for-beginners-part-2) for a refresher.

## Common Tasks

### Edit Page Titles or Change the Left Navigation

Edit the yaml files in `/_data/` for the Guides, Reference, Samples, or Support areas.

You may have to exit and `jekyll clean` before restarting the `jekyll serve` to
get changes to files in `/_data/` to show up.

### Add Images

Put the new image in `/images/docs/` if it's for the documentation, and just `/images/` if it's for the website.

**For diagrams, we greatly prefer SVG files!**

### Include code from another file

To include a file that is hosted on this GitHub repo, insert this code:

<pre>&#123;% include code.html language="&lt;LEXERVALUE&gt;" file="&lt;RELATIVEPATH&gt;" ghlink="&lt;PATHFROMROOT&gt;" %&#125;</pre>

* `LEXERVALUE`: The language in which the file was written; must be [a value supported by Rouge](https://github.com/jneen/rouge/wiki/list-of-supported-languages-and-lexers).
* `RELATIVEPATH`: The path to the file you're including, relative to the current file.
* `PATHFROMROOT`: The path to the file relative to root, e.g. `/docs/admin/foo.yaml`

To include a file that is hosted in the external, main Kubernetes repo, make sure it's added to [/update-imported-docs.sh](https://github.com/kubernetes/kubernetes.github.io/blob/master/update-imported-docs.sh), and run it so that the file gets downloaded, then enter:

<pre>&#123;% include code.html language="&lt;LEXERVALUE&gt;" file="&lt;RELATIVEPATH&gt;" k8slink="&lt;PATHFROMK8SROOT&gt;" %&#125;</pre>

* `PATHFROMK8SROOT`: The path to the file relative to the root of [the Kubernetes repo](https://github.com/kubernetes/kubernetes/tree/release-1.2), e.g. `/examples/rbd/foo.yaml`

## Using tabs for multi-language examples

By specifying some inline CSV in a varable called `tabspec`, you can include a file
called `tabs.html` that generates tabs showing code examples in multiple langauges.

<pre>&#123;% capture tabspec %&#125;servicesample
JSON,json,service-sample.json,/docs/user-guide/services/service-sample.json
YAML,yaml,service-sample.yaml,/docs/user-guide/services/service-sample.yaml&#123;% endcapture %&#125;
&#123;% include tabs.html %&#125;</pre>

In English, this would read: "Create a set of tabs with the alias `servicesample`,
and have tabs visually labeled "JSON" and "YAML" that use `json` and `yaml` Rouge syntax highlighting, which display the contents of
`service-sample.{extension}` on the page, and link to the file in GitHub at (full path)."

Example file: [Pods: Multi-Container](http://kubernetes.io/docs/user-guide/pods/multi-container/).

## Use a global variable

The `/_config.yml` file defines some useful variables you can use when editing docs.

* `page.githubbranch`: The name of the GitHub branch on the Kubernetes repo that is associated with this branch of the docs. e.g. `release-1.2`
* `page.version` The version of Kubernetes associated with this branch of the docs. e.g. `v1.2`
* `page.docsbranch` The name of the GitHub branch on the Docs/Website repo that you are currently using. e.g. `release-1.1` or `master`

This keeps the docs you're editing aligned with the Kubernetes version you're talking about. For example, if you define a link like so, you'll never have to worry about it going stale in future doc branches:

<pre>View the README [here](http://releases.k8s.io/&#123;&#123;page.githubbranch&#125;&#125;/cluster/addons/README.md).</pre>

That, of course, will send users to:

[http://releases.k8s.io/release-1.2/cluster/addons/README.md](http://releases.k8s.io/release-1.2/cluster/addons/README.md)

(Or whatever Kubernetes release that docs branch is associated with.)

## Branch structure

The current version of the website is served out of the `master` branch.

All versions of the site that relate to past and future versions will be named after their Kubernetes release number. For example, [the old branch for the 1.1 docs is called `release-1.1`](https://github.com/kubernetes/kubernetes.github.io/tree/release-1.1).

Changes in the "docsv2" branch (where we are testing a revamp of the docs) are automatically staged here:
http://k8sdocs.github.io/docs/tutorials/

Changes in the "release-1.1" branch (for k8s v1.1 docs) are automatically staged here:
http://kubernetes-v1-1.github.io/

Changes in the "release-1.3" branch (for k8s v1.3 docs) are automatically staged here:
http://kubernetes-v1-3.github.io/

Editing of these branches will kick off a build using Travis CI that auto-updates these URLs; you can monitor the build progress at [https://travis-ci.org/kubernetes/kubernetes.github.io](https://travis-ci.org/kubernetes/kubernetes.github.io).

## Partners
Kubernetes partners refers to the companies who contribute to the Kubernetes core codebase and/or extend their platform to support Kubernetes. Partners can get their logos added to the partner section of the [community page](http://k8s.io/community) by following the below steps and meeting the below logo specifications. Partners will also need to have a URL that is specific to integrating with Kubernetes ready; this URL will be the destination when the logo is clicked.

* The partner product logo should be a transparent png image centered in a 215x125 px frame. (look at the existing logos for reference)
* The logo must link to a URL that is specific to integrating with Kubernetes, hosted on the partner's site.
* The logo should be named *product-name*_logo.png and placed in the `/images/community_logos` folder.
* The image reference (including the link to the partner URL) should be added in `community.html` under `<div class="partner-logos" > ...</div>`.
* Please do not change the order of the existing partner images. Append your logo to the end of the list.
* Once completed and tested the look and feel, submit the pull request.

## Thank you!

Kubernetes thrives on community participation and we really appreciate your
contributions to our site and our documentation!
