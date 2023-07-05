# Open Books

Open Source Project sample built with Angular.

In this project you will find many commented lines of code. I've commented also some of the typical features of Angular trying to explain what they do. You need of course to know at least the basics in order to comprehend the components and how they interact.

**LIVE DEMO**: [Open Book Live](https://openbook-5b313.web.app/)

<hr>

### Open Book explained

I've created this project to practise mainly. But it could be useful to some people out there and that's why it is here available for you all.
A very simple project to retrieve informations about any book.

We'll be using the free Google Books API to get a list of books by entering a name and optionally the desired language (All - ITA - ENG are available as of now).

#### Main Point of Interest

1. _app.components.ts_
   - The HostListener
2. _app-routing.module.ts_
   - The lazy-loaded module management with a parameter passed to the route
3. _pages/_
   - There are many things inside this folder. Input/Output features, Subscription to the Observables from the Service (the API requests), HTML *ngIf and *ngFor and so on..
4. _components/_
   - Standalone components. Parts of the pages.

<hr>

### Using the Source code

> Assuming that you have already VSCode/or similar and the Angular CLI installed ..

To get your copy working and running you need to install the dependencies with the command **_npm i_**

Run locally your project by entering the command **_ng s -o_** on the root folder of the project.
