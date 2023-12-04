---
title: Chat Completions Exercise
created: 2023-12-05
tags:
  - openai
  - course
---

# OpenAI API - Chat Completions Exercise

## Exercise 1: Basic Interaction with the Chat Model

Your first task is to have an introductory conversation with the model. Ask about its abilities, strengths, and limitations. This will give you a taste of basic interaction with OpenAI's chat model.

## Exercise 2: Exploring System and User Roles

In this exercise, try defining user and system roles in messages. Your task is to use 'system' and 'user' as roles.

Example:

```python
import openai

openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
    ]
)
```

## Exercise 3: System Role Constraints

Modify the system role further. Test how explicit and directive you must be. Create context where the model behaves as a Shakespearean character, a sci-fi novel writer, or a sports commentator.

Example:

```python
openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "You are an assistant that speaks like Shakespeare."},
        {"role": "user", "content": "Tell me about the weather today."},
    ]
)
```

Try with different characters and observe how the model responds.

## Exercise 4: Using Temperature and Top-P

Start configuring the model's response using `temperature` and `top_p`. Choose a fixed instruction and adjust these parameters for different outputs.

1. Try a high and a low temperature. What changes do you see in terms of diversity of output?
2. Next, adjust 'top_p'. What changes do you see in terms of focus and variability of output?

Document your findings.

## Exercise 5: Creative Control

Create a 'Choose your own adventure' story using the chat model. Begin the story by setting the adventure's context and let the model suggest the next events. Use the 'system' role to direct the storyline. This exercise will test your understanding of how to use the 'system' role creatively.
  
Remember, iterative learning and repeated experimenting with the parameters will provide the best understanding. Have fun!