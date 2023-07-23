---
title: Docker entrypoint
created: 2023-07-22
tags:
  - docker
  - course
---

# Dockerfile ENTRYPOINT and CMD explained

Before delving into the differences between the `ENTRYPOINT` and `CMD` instructions in a Dockerfile, it's important to first understand what each of these instructions actually does.

The ENTRYPOINT and CMD directives in a Dockerfile serve to define the command and default parameters, which should be executed when a container is run from the resulting Docker image. These instructions give us the ability to set a container's default behavior.

- **ENTRYPOINT**: This Dockerfile instruction allows you to configure a container that can be run as an executable. In essence, ENTRYPOINT is the command that gets executed when a Docker container starts. 

- **CMD**: The CMD instruction provides defaults for an executing container. It can include an executable or they can omit the executable, in which case, the ENTRYPOINT instruction must be specified. CMD allows you to set default command and default parameters which can be overwritten from command line when docker container runs.

Consider them as the starting point for your container's execution.

In the following sections, we will explore ENTRYPOINT and CMD in more detail, discussing the subtle differences, how they interact with one another, and their working in conjunction with the docker run command.

## Understanding ENTRYPOINT

The `ENTRYPOINT` instruction in a Dockerfile sets the command and parameters that will be executed first when a container is run. This command will not be ignored, even if there are arguments that are passed during the `docker run` command. 

The `ENTRYPOINT` could be seen as the main command or purpose of your docker image. For example, if you have created a docker image for a Python application, the `ENTRYPOINT` would be `python app.py` since that command essentially represents the purpose of the image.

## Understanding CMD

On the other hand, `CMD` in a Dockerfile provides defaults for executing a Docker container. These defaults can include an executable or they can omit the executable, in which case you must specify an `ENTRYPOINT` instruction as well.

`CMD` is used for any arguments that are expected to be easily overridden. It's important to remember that if `CMD` is used to provide default arguments for the `ENTRYPOINT` instruction, both `CMD` and `ENTRYPOINT` should be stated in the JSON array format.

## Differences between ENTRYPOINT and CMD

Now that we understand the individual roles of `ENTRYPOINT` and `CMD`, let's deep dive into their difference.

In a Dockerfile, both `ENTRYPOINT` and `CMD` instructions are used to specify commands that should be executed when a Docker container is run. However, how they're written has certain implications.

The syntax for both commands can either be a shell form or an exec form. The shell form does not include square brackets, while exec form uses square brackets.

<details class="ml-4">
<summary class="font-bold cursor-pointer -ml-4">More on shell and exec form</summary>
In Docker's ENTRYPOINT and CMD instructions, two forms can be used - the Shell form or the Exec form.

- **Shell Form**:

  The shell form is specified without the usage of square brackets. It uses the shell to execute the command, which translates into `/bin/sh -c your_command`. This form will initiate a new shell process, which is slightly more resource-intensive than the exec form.

  In Docker, the ENTRYPOINT shell form could be like `ENTRYPOINT command param1 param2` and CMD shell form would be `CMD command param1 param2`.

  For example:
  ```
  ENTRYPOINT echo "Hello, World!"
  CMD echo "Welcome to the Docker World!"
  ```

- **Exec Form**:

  The exec form is specified using JSON array syntax (i.e., it uses square brackets). This form does not initiate a new shell process and is performed directly. Thus, it is slightly more efficient in terms of resource usage. 

  In Docker, the ENTRYPOINT and CMD exec forms are: `ENTRYPOINT ["executable", "param1", "param2"]` and `CMD ["executable", "param1", "param2"]`. 

  For example:
  ```
  ENTRYPOINT ["echo", "Hello, World!"]
  CMD ["echo", "Welcome to the Docker World!"]
  ```

In most cases, when using CMD, it's often more advantageous to use the Exec form because it allows for signal handling. The application you run will receive Unix signals directly. Generally, when using ENTRYPOINT, the Exec form should also be used, otherwise signal handling doesn't work properly as only the shell process would be terminated. 

<details class="ml-4">
<summary class="font-bold cursor-pointer -ml-4">More on signals</summary>
Let's talk a bit about Unix signals. Unix signals are software interrupts that provide a way to handle asynchronous events. It's a form of communication between processes, allowing a process to be notified of events like termination requests (SIGTERM), keyboard interrupts (SIGINT) and many others.

Now, when you start a Docker container, it starts a single process specified by the CMD or ENTRYPOINT. This single process inside the Docker container is assigned a PID (Process ID) of 1 and any Unix signals that Docker receives will be passed to this PID 1 process. This is particularly important when stopping a container because Docker will send a SIGTERM signal, and after a grace period, a SIGKILL to stop the process.

- **CMD and Signals**: If you use the shell form of CMD, like `CMD command param1 param2` then Docker starts a shell (`/bin/sh -c`) as PID 1 and executes the command inside this shell. The shell doesn't pass signals along to the command. So, if Docker sends a SIGTERM signal, it reaches the shell but doesn't reach your command.

- **ENTRYPOINT and Signals**: The exact same logic applies to the ENTRYPOINT command. When you use the Shell form `ENTRYPOINT command param1 param2`, the SIGTERM signal will only terminate the shell but won't terminate the process inside the shell.

This explains why signal handling doesn't work properly when the shell form of CMD or ENTRYPOINT is used in a Dockerfile.

However, when the Exec form of CMD or ENTRYPOINT is used, i.e., `CMD ["executable", "param1", "param2"]` or `ENTRYPOINT ["executable", "param1", "param2"]`, Docker can directly run the command without involving a shell, and thus, the started process with PID 1 is the command itself and not the shell. In this case, Unix signals like SIGTERM are delivered directly to the application, enabling it to stop gracefully.

Therefore, unless there's a specific need to use the Shell form, it's recommended to use the Exec form of CMD and ENTRYPOINT in Docker as it ensures proper signal handling and a graceful shutdown of containers.
</details>

Please note the CMD parameters in exec form will be typically used as additional parameters in ENTRYPOINT command if ENTRYPOINT is specified.
</details>

When command and arguments are specified without square brackets `[]`, they're processed via `/bin/sh -c`.

1. `ENTRYPOINT command`

       `CMD arg1 arg2`

   Unless the command is a binary executable, it will be run via the shell.

When command and arguments are within square brackets `['...']` , they're executed without shell interpretation. 

2. `ENTRYPOINT ['command']`

       `CMD ['arg1', 'arg2']`

   It will require full path to the binary unless it exists in the `PATH` and does not allow for shell functionality like variable substitution and wild cards.

In addition, it's important to note that `CMD` will provide arguments to `ENTRYPOINT` and these will get overwritten if the docker container is run with alternate command line arguments.

For example:
`docker run -it <image> /bin/bash`

In this command, `/bin/bash` will replace `['arg1', 'arg2']` in `CMD`.

[Exercices](exercice)