# AFTER

> An AI financial decision companion built for everyday people.

AFTER helps people understand the financial consequences of decisions before they make them.

Instead of requiring users to understand financial terminology or navigate complicated financial tools, AFTER lets users simply talk naturally about their situation.

## The Problem

Everyday financial decisions are often made without understanding their long-term consequences.

People ask questions like:

- Can I afford this car?
- Should I move into this apartment?
- Can I take this loan?
- Should I buy this phone?
- Can I afford this trip?
- How much should I spend?
- Is there a cheaper alternative?

Traditional financial tools require users to manually enter structured information and understand financial concepts.

AFTER starts with conversation.

## What AFTER Does

AFTER:

1. Understands natural language financial questions.
2. Extracts relevant financial information.
3. Builds a persistent financial profile.
4. Remembers relevant conversation history.
5. Analyzes financial decisions.
6. Identifies financial risk.
7. Recommends safer alternatives.
8. Can prepare actions for the user.
9. Exposes financial capabilities to AI agents through WebMCP.

## Why WebMCP?

WebMCP allows AFTER to expose structured capabilities that AI agents can use directly.

Instead of an agent attempting to navigate the UI and guess how AFTER works, AFTER exposes explicit tools for actions such as:

- analyzing a financial decision
- retrieving a user's financial context
- comparing financial options
- calculating affordability
- preparing a financial action

This creates a collaboration between the human, AFTER, and external AI agents.

## Architecture

```text
User
 |
 v
AFTER Web App
 |
 +--> Conversation
 |
 +--> Financial Profile
 |
 +--> Financial Analysis Engine
 |
 +--> AI Agent
 |
 +--> WebMCP Tools
 |
 v
Actions / Recommendations