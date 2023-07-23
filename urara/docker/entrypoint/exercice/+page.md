---
title: Exercice Docker entrypoint
created: 2023-07-22
tags:
  - docker
  - course
  - exercie
flags:
  - unlisted
---

# Dockerfile ENTRYPOINT and CMD - Exercises

Now that you have a better understanding of the Docker ENTRYPOINT and CMD instructions, let's put this knowledge to practical use via these exercises. These are meant to test your understanding and offer an opportunity to explore these concepts in a hands-on approach.

**Exercise 1: Basic Dockerfile**

Write a basic Dockerfile for an image that is based on Ubuntu 20.04, with a CMD instruction that shows a message "Welcome to Docker".

**Exercise 2: Using ENTRYPOINT**

Modify the above Dockerfile to include an ENTRYPOINT instruction, such that the Docker image can be run as an executable that simply echoes "Hello Docker". 

**Exercise 3: CMD as ENTRYPOINT’s parameter**

Modify the Dockerfile from Exercise 2, make CMD provide default command line parameters for the ENTRYPOINT command you specified. Set default parameters to be "-l" and swap "Hello Docker" to "ls". 

**Exercise 4: CMD and ENTRYPOINT Interaction**

Run Docker containers from the Dockerfiles created in the previous exercises. Then run a container while providing additional parameters at run time. Observe the behavior and compare it with your expectations based on your understanding of CMD and ENTRYPOINT interaction.

**Exercise 5: Shell form vs. Exec form**

Create separate Dockerfiles using the shell form and exec form for CMD and ENTRYPOINT instructions. Observe differences in behavior and discuss why such differences occur.

**Exercise 6: Overriding CMD and ENTRYPOINT**

Run Docker containers from Dockerfiles created in Exercise 5. Use command line to override CMD and ENTRYPOINT in different use cases. Observe the behavior, and compare it with your expectations.

**Exercise 7: Dealing with Signals**

Differently from earlier exercises, now create a Dockerfile with a running service (like a simple Python HTTP server). Run a container from this Dockerfile. Try to stop this container with `docker stop` command; see how container reacts to the SIGTERM signal. Repeat the exercise using CMD and ENTRYPOINT in shell and exec forms. Observe the differences and discuss how signal handling behavior is affected by ENTRYPOINT and CMD forms.

Remember, the key to these exercises is not just to complete them, but to understand why each step happens and the underlying principles.

<details class="ml-4">
<summary class="font-bold cursor-pointer -ml-4">Solutions</summary>

**Exercise 1 Solution: Basic Dockerfile**

Here is a Dockerfile with a CMD instruction:

```Dockerfile
FROM ubuntu:20.04
CMD echo "Welcome to Docker"
```

---

**Exercise 2 Solution: Using ENTRYPOINT**

Here is the Dockerfile modified to include the ENTRYPOINT instruction:

```Dockerfile
FROM ubuntu:20.04
ENTRYPOINT ["echo"]
CMD ["Welcome to Docker"]
```

In this Dockerfile, `echo` is the ENTRYPOINT, and "Welcome to Docker" is the CMD providing default parameters to `echo`.

---

**Exercise 3 Solution: CMD as ENTRYPOINT’s parameter**

Here is the Dockerfile with CMD providing default parameters to ENTRYPOINT:

```Dockerfile
FROM ubuntu:20.04
ENTRYPOINT ["ls"]
CMD ["-l"]
```

---

**Exercise 4 Solution: CMD and ENTRYPOINT Interaction**

To run a Docker container with the default parameters:

```bash
docker build -t myimage .
docker run myimage
```

To run a Docker container with additional parameters at runtime:

```bash
docker run myimage /bin
```

By providing additional parameters, CMD values will be overridden.

---

**Exercise 5 Solution: Shell form vs. Exec form**

Shell form:

```Dockerfile
FROM ubuntu:20.04
ENTRYPOINT echo "This is ENTRYPOINT"
CMD echo "This is CMD"
```

Exec form:

```Dockerfile
FROM ubuntu:20.04
ENTRYPOINT ["echo", "This is ENTRYPOINT"]
CMD ["echo", "This is CMD"]
```

You may notice that in the exec form, CMD does not get executed if ENTRYPOINT is set, because CMD's arguments are used as ENTRYPOINT's.

---

**Exercise 6 Solution: Overriding CMD and ENTRYPOINT**

To override the ENTRYPOINT and CMD at runtime:

```bash
docker run --entrypoint echo myimage "Override ENTRYPOINT"
docker run myimage echo "Override CMD"
```

---

**Exercise 7 Solution: Dealing with Signals**

Here's a simple Dockerfile with a Python HTTP server for this exercise:

```Dockerfile
FROM python:3.9-alpine
CMD ["python", "-m", "http.server"]
```

To run a Docker container from this Dockerfile:

```bash
docker build -t myimage .
docker run -p 8000:8000 myimage
```

To stop the container, in a new shell, run:
```bash
docker stop [container_id]
```

The container should stop immediately, meaning it receives the SIGTERM signal directly, as per the exec form used in the CMD instruction. 

If you change CMD instruction to shell form like `CMD python -m http.server`, `docker stop` will not take effect immediately, because the signal isn't reaching the Python process. It has to wait for the SIGKILL signal after a grace period.

---

Remember to replace `myimage` and `[container_id]` with the actual image name and container ID in your environment.
</details>