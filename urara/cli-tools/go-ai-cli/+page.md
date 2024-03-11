---
title: Go OpenAI cli
created: 2023-05-27
updated: 2024-03-11
tags:
  - golang
  - cli
  - ai
  - ollama
---

As CLI tools gain popularity, more developers are creating new and innovative CLI applications that cater to specific needs. Go-ai-cli is one such tool that enables users to generate text using GPT service from the command line. This article provides a detailed guide on how to install and use Go-ai-cli, including configuration and usage, as well as the available commands within the prompt. Additionally, the article offers guidelines on how to contribute to the development of Go-ai-cli and outlines its licensing under the MIT License.

[Github Repo](https://github.com/MohammadBnei/go-ai-cli)

Go-ai-CLI is a command-line interface that provides access to GPT service. With this tool, users can send a prompt to the OpenAI API and receive a generated response, which can then be printed on the command-line or saved to a markdown file.

This project is useful for quickly generating text for various purposes such as creative writing, chatbots, virtual assistants, or content generation for websites.

## Installation

To install and use the Go-ai-CLI with golang :

```sh
go install github.com/MohammadBnei/go-ai-cli@latest
```

To install the compiled binaries, go to the the [release page](https://github.com/MohammadBnei/go-ai-cli/releases/) and select the exec matching your operating system.

Lastly, there is an unstable docker image. To run it, here is the code :

```sh
docker run -e OPENAI_KEY=<YOUR_OPENAI_KEY> -it mohammaddocker/go-ai-cli prompt
```

## Usage

First, set up your OpenAI API key :

```sh
go-ai-cli config --OPENAI_KEY=<YOUR_API_KEY>
```

To send a prompt to OpenAI GPT, run:

```sh
go-ai-cli prompt
```

You will be prompted to enter your text. After submitting your prompt, the model will process your input and generate a response.

## Configuration

To store your OpenAI API key and model, run the following command:

```sh
go-ai-cli config --OPENAI_KEY=<YOUR_API_KEY> --model=<MODEL>
```

To get a list of available models, run:

```sh
go-ai-cli config -l
```

### Flags

- `--OPENAI_KEY`: Your OpenAI API key.
- `--model`: The default model to use.
- `-l, --list-model`: List available models.
- `--config`: The config file location.

The configuration file is located in `$HOME/.go-ai-cli.yaml`.

## Contributing

To contribute to this project, fork the repository, make your changes, and submit a pull request. Please also ensure that your code adheres to the accepted [Go style guide](https://golang.org/doc/effective_go.html).

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
