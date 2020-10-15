---
title: A front-end journey into XState
date: '2020-05-14'
tags:
  - javascript
  - front-end
  - x-state
  - blog
---

It’s been a while since I picked up a development pattern on the front-end that fundamentally changed the way that work. The last time that comes to mind was about 5 years ago with my early endeavors in to React. For me, David Piano’s fantastic [XState](https://xstate.js.org/) has been doing just that over the last couple of months.

XState is a [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine) for the web. Every user interaction provides predictable application state. When starting a new application or feature, it’s always tempting to jump right in and start developing. This model forces you to step back a diagram out each input and output along the user journey before you write a single line of code.

I put together an example application to help teach myself XState and wanted to share a bit of my process with you.
I’ve seen lots of demos for things like a sample traffic light or a basic API call, but I wanted to plug it all together and see what we could achieve. We starting a “for fun” project these days, my first data choice is [NASA’s wonderful Open APIs](https://api.nasa.gov/). For this example, I’m using the API that powers their [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) website.

Here are the basic requirements for this application:
* We want date pickers to define a start and end date used to pull images from.
* After loading the API successfully, you’ll see a gallery page with all of the images loaded and their titles.
* Clicking on one of the image cards, you go to an “image details” page with more information about the image.
* There’s a back button at the top to go back to the “gallery” view
* When you click on the image, you should see a higher resolution version.
* Clicking on the hi-res version of the image takes youback to the “image details” page.

This level of detail helps you easily map out what the state machine should look like.

```bash
STATE
  -> ACTIONS POSSIBLE
-----------------------------------------
Start
  -> Fetch (call the API, change state to loading)
Loading
  -> Success (change state to gallery)
  -> Failure
    -> Retry (change state to loading)
Gallery
  -> Fetch (change state to loading)
  -> Select Photo (change state to photo)
Photo
  -> Zoom photo (change state to hdphoto)
  -> Leave photo (change state to gallery)
HdPhoto
  -> Leave hdphoto (change state to photo)
```

As you can see, each state has a predictable set of accepted follow-up events.

```js
import { actions, Machine } from 'xstate';
import axios from 'axios';

const { assign } = actions;

const apiKey = process.env.VUE_APP_NASA_API_KEY || 'DEMO_KEY';

const fetchPicture = (date) =>
  axios(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
    .then(
      res => {
        if (!res.statusText === 'OK') {
          throw new Error('Something went wrong');
        }
        return res.data;
      },
      err => {
        throw err;
      }
    );


const fetchPictures = (_, { dates }) => {
  return Promise.all(
    dates.map(date =>
      fetchPicture(date).then(response => response)
    )
  );
};

export const apodMachine = Machine(
  {
    id: 'apod',
    initial: 'start',
    context: {
      currentPhoto: null,
      errorMessage: null,
      isHd: false,
      photos: [],
    },
    states: {
      start: {
        on: {
          FETCH: 'loading',
        },
      },
      loading: {
        invoke: {
          id: 'fetchPictures',
          src: fetchPictures,
          onDone: {
            target: 'gallery',
            actions: ['setPhotos']
          },
          onError: {
            target: 'failure',
            actions: ['setErrorMessage']
          },
        },
      },
      failure: {
        on: {
          RETRY: 'loading',
        },
      },
      gallery: {
        on: {
          FETCH: 'loading',
          SELECT_PHOTO: {
            target: 'photo',
            actions: ['setCurrentPhoto'],
          }
        }
      },
      photo: {
        on: {
          ZOOM_PHOTO: {
            target: 'hdphoto',
            actions: ['toggleIsHd'],
          },
          LEAVE_PHOTO: {
            target: 'gallery',
            actions: ['clearCurrentPhoto'],
          }
        }
      },
      hdphoto: {
        on: {
          LEAVE_HD_PHOTO: {
            target: 'photo',
            actions: ['toggleIsHd'], 
          }
        }
      }
    }
  }, 
  {
    actions: {
      clearCurrentPhoto: assign({ currentPhoto: null }),
      setCurrentPhoto: assign({ currentPhoto: (_, event) => event.currentPhoto }),
      setErrorMessage: assign({ errorMessage: (_, event) => event.data }),
      setPhotos: assign({ photos: (_, event) => event.data }),
      toggleIsHd: assign({ isHd: (context) => !context.isHd }),
    },
  }
);
```

This is our machine setup.

Up top is the setup for our API fetch. Because the service expects a single date, we are rolling them all up in a single `Promise.all()`. In a production application, we’d want to handle the errors that this service might throw a little more gracefully, but this will get us up and running for now.

What follows is the `apodMachine` variable… the meat of the demo. A javascript representation of our finite state machine leveraging some of XState’s helper functions. This example only has a single “machine”, but your application can have as many as you feel is appropriate to sort out your logic.

We setup the `context` here. This is very similar to `data` in Vue or `state` in React. These variables can change when actions assign new values to them.

There is a list of our machine’s available “events” below under the `states` key. You’ll see that these map out neatly to our original list from above. When your application is in the `start` state for instance, you have the `FETCH` event available.

There are some helper functions listed in here like `onDone` and `onError` that are part of the [invoke property](https://xstate.js.org/docs/guides/communication.html#the-invoke-property) that we use for our `loading` state.

`SELECT_PHOTO` both updates your state to `photo` and calls our `setCurrentPhoto` function below to change the machine’s context.

Actions are set as a second parameter inside of the Machine. Each event has the ability to trigger actions defined here.

You’ll see that we’ve set multiple actions that help change the `context` of our machine. We can leverage both the current event and our context in our UI as you’ll see next.

```js
<template>
  <div id="x-state-example" class="viewport">
    <DateSelect
      v-if="current.value === 'gallery' || current.value === 'loading' || current.value === 'start'"
      :apod-service-action="apodServiceAction"
      :change-date="changeDate"
      :beginDate="beginDate"
      :endDate="endDate"
      :getDates="getDates"
      :state="current.value"
    />
    <Gallery
      v-if="current.value === 'gallery'"
      :photos="context.photos"
      :apod-service-action="apodServiceAction"
      :state="current.value"
    />
    <PhotoDetails
      v-if="current.value === 'photo' || current.value === 'hdphoto'"
      :photo="context.currentPhoto"
      :apod-service-action="apodServiceAction"
      :state="current.value"
    />
    {{ context.errorMessage }}
  </div>
</template>

<script>
import { interpret } from 'xstate';
import { apodMachine } from './machine';
import DateSelect from './views/DateSelect.vue';
import Gallery from './views/Gallery.vue';
import PhotoDetails from './views/PhotoDetails.vue';
export default {
  name: 'x-state-example',
  components: {
    DateSelect,
    Gallery,
    PhotoDetails,
  },
  data() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    return {
      // Interpret machine and store in data
      apodService: interpret(apodMachine),
      // Start with the machine's initial state
      current: apodMachine.initialState,
      // Start with the machine's initial context
      context: apodMachine.context,
      beginDate: tenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    }
  },            
  created: function () {
    this.apodService
      .onTransition(state => {
        // Keep current state and context in sync
        this.current = state;
        this.context = state.context;
      })
      .start();
  },
  methods: {
    apodServiceAction: function(key, params) {
      this.apodService.send(key, params);
    },
    changeDate: function(key, value) {
      this[key] = value;
    },
    getDates: function() {
      const dates = [];
      const currentDate = new Date(this.beginDate);
      const stopDate = new Date(this.endDate);
      while (currentDate <= stopDate) {
        dates.push(new Date (currentDate).toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    },
  }
}
</script>
```

Now we pull the machine in to our Vue application. It’s very similar to how you’d do it in React or anywhere else.

The machine is imported and set up inside of App’s `data`. This allows us to call our events via `apodService.send()`. I set that up as a method called `apodServiceAction` for easy reuse. It’s passed as a prop to the application’s children so they can leverage it.

The `current.value` provided shows the machine’s current state. We use this to selectively show components in the UI.

I’ve got a [full working demo](https://github.com/bunnyhawk/apod-xstate-example) up on Github if you want to play around with the application.

There is plenty more to learn about xstate (I’m still working through all of it myself). Here’s a list of helpful resources:

* [XState Visualizer](https://xstate.js.org/viz/)
* [Introduction to State Machines Using XState](https://egghead.io/courses/introduction-to-state-machines-using-xstate)
* [Learning State Machines with David Piano (video)](https://www.youtube.com/watch?v=czi24DqUfSA)
* [XState Documentation](https://xstate.js.org/docs/)