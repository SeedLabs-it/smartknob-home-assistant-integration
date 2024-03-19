# Smartknob

This is an integration for Home Assistant. It provides a user interface for setting up and using ur Smartknob with Home Assistant.

- [Smartknob](#smartknob)
  - [Introduction](#introduction)
    - [Current Features](#current-features)
  - [Installation](#installation)
  - [Updating](#updating)
  - [Development](#development)
  - [Trello Board](#trello-board)

## Introduction
This is an integration for <a href="https://www.seedlabs.it">Seedlabs.it´s</a> Smart Knob. 
It allows for usage and setup of multiple SmartKnobs with Home Assistant. Through an easy to use user interface.
The hardware is inspired by <a href="https://github.com/scottbez1/smartknob">scottbez1´s</a> Smartknob project, but its functionalities are substantially different, as such, Scott's knob is not compatible with this project.


### Current Features
* Control and setup single Smartknob
* No yaml or automation setup neccessary all configurable from UI

<br/>

## Installation
<details>
<summary>Click to show installation instructions for Home Assistant</summary>

<br>

Easiest install is via [HACS](https://hacs.xyz/):

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=SeedLabs-it&repository=smartknob-home-assistant-integration&category=integration)

`HACS -> Integrations -> Three dots in the top right corner -> Custom repositories -> Add: `

Notes:

- HACS does not "configure" the integration for you. You must go to `Configuration -> Integrations` and add `Smart Knob` after installing via HACS.
- The `mqtt` integration must be installed and configured in order for the `Smart Knob` integration to work. As manual configuration is required for the `mqtt` setup, this cannot happen automatically.

For manual installation for advanced users, copy `custom_components/smartknob` to
your `custom_components` folder in Home Assistant.

</details>

## Updating
<details>
<summary>Instructions on how to update will eventually be available here</summary>
</details>

## Development
<details>
<summary>Click to show instructions for setting up ur Development  Environment</summary>

If you are interestd in developing Home Assistant's Smart Knob Integration you will need three things:

1) A working version of Home Assistant Core. We will use a local dockerized version.
2) A MQTT Broker. We will use Mosquitto
3) This repo, checked out locally, and all the building tools needed to compile it.


Pre-requirements
<ol>
<li> Install <a href="https://www.docker.com/products/docker-desktop/"> Docker Desktop</a>. Alternatively you can install docker, and make sure it's linked in your shell enviroment. </li>
<li> We will be using <a href="https://code.visualstudio.com/"> Microsoft Visual Studio Code </a> as the IDE of choice.</li>
<li> Install <a href="https://classic.yarnpkg.com/en/docs/install#mac-stable">Yarn </a>. You will need it to compile the UI in this integration.
</li>
</ol>


Set-up

<ol>
<li>
  **INSTALL HOME ASSISTANT CORE**. Follow the instructions to install <a href="https://developers.home-assistant.io/docs/development_environment"> Home Assistant Core</a> This will setup a local dockerized version of Home Assistant Core. A Visual Studio projet will also be initialized based on the clone Home Assistant Core repo.
  From Visual Studio menu select Terminal -> Run Task -> Run Home Assistant Core to start your docker instance of Home Assistant.
  You should now be able to see the instance running in Docker Desktop or by running <code>doker ps</code>
</li>
<li>
  **MQTT BROKER**: We recommend <a href="https://mosquitto.org/download/">Mosquitto</a>.
  Once installed, you can start the broker, with something along those lines : <code>/usr/local/opt/mosquitto/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf</code>.
  By default, Mosquitto runs unencrypted and unauthenticated.
  You can test the installation and ensure the server is running successfully by typing on a new terminal window
<code> mosquitto_sub -t topic/state </code> to subscribe to a new topic/state, and in a third window, send a message by typing
   <code>mosquitto_pub -t topic/state -m "Hello World"</code>
</li>

<li>
  **SETUP INTEGRATION CODEBASE**. Checkout this codebase. [TODO] include here all the comments that are needed to compile the code.
</li>
<li>
  **UPDATE HOME ASSISTANT WITH THE SMART KNOB INTEGRATION**.
  <ul> This repository generates a custom components, that needs to be moved to the home assistant running instance.
  To do so, you can type from command line <code> docker cp path_to/smart-knob-home-assistant-integration/custom_components docker_name_instance:/workspaces/core/config </code>, where docker name instance is the identifier that docker uses when booting a new image. This command will copy the content of the custom_components folder in this repo to the dockerized home assistant instance.</ul>
  <ul>
  Restart home assitant. From Visual Studio menu select Terminal -> Run Task -> Run Home Assistant Core to restart your instance.
  </ul>
  <ul> Login to home assistant (usually available at <code>http://localhost:8123/</code>). Go to Settings -> Devices and Services, and from the Integrations Tab, press the button 'Add Integration'. Select MQTT from the list, and when prompted use the following informations: <code>host: host.docker.internal</code> (or the ip of the machine where the MQTT broker is running) and <code>port: 1883.</code> (or the custom port used by the MQTT broker)
  </ul>
  <ul>
  From Setting -> Device and Services, select the tab Devices, and press the <code>Add Device</code> button. From the list select <code> Smart Knob </code>
  </ul>
  <ul>
    On the main menu on the right, you should see a new item called 'Smart Knob'.
  </ul>
</li>


<li>Done!</li>
<ul>
<li>You have now everything you need to start developing for this integration.</li>
</ul>
<ol>
</details>

## Trello Board
https://trello.com/b/u4zme4hK/smartknob
