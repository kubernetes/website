# A Dockerfile for testing docs changes.
#
# Image available on Docker Hub: https://hub.docker.com/r/johndmulhausen/k8sdocs/
#
# Run with:
# docker run -ti --rm -v "$PWD":/k8sdocs -p 4000:4000 johndmulhausen/k8sdocs
# The site will be automatically updated as you make changes!

FROM starefossen/ruby-node:2-4

RUN gem install github-pages

VOLUME /k8sdocs

EXPOSE 4000

WORKDIR /k8sdocs

CMD jekyll clean && jekyll serve -H 0.0.0.0 -P 4000

# For more instructions, see http://kubernetes.io/editdocs/
