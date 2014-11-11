Britannia
=========

This repository contains the code used to power the Britannia server on Strayegg.com

The ultimate aim of this project is to create a lightweight web-based Britannia game that is able to be played by players in multiple locations at the same time.  Additionally the game should be able to be observed and non-players interact with players.

As much as possible of the logic will be performed client-side to allow a responsive interface with server-side validation of moves to ensure fair play.  All dice rolls will be generated server-side to ensure fair play.

Additionally statistics will hopefully be able to be collected to show trends over time per-player / per-nation / per-user.

This implementation will be using the rules as detailed at http://www.fantasyflightgames.com/ffg_content/Britannia/Brittania_Revised_Rules.pdf

Installation
------------

This is intended to be deployed to Amazon OpsWorks.  It is able to run on a t2.micro within an OpsWorks Node layer.  To deploy all you need to do is put the details of this repository into the App and away you go.