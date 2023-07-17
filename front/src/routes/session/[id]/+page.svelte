<script lang="ts">
 import store from "$store";
 import type { State } from "$state";
 import { initialState } from "$state";

 import Header from "$components/Header.svelte";

 import * as rx from "rxjs/operators";
 const st = store.start(initialState);

</script>

<section class="topics">
  <ul>
    <li class="topic-item">
      <p class="topic-item-title">Creating an AI-driven chatbot
      </p>
      <p class="topic-item-description">Create a chatbot that uses artificial intelligence to provide useful and efficient customer service. The chatbot could be used on websites, social media platforms, or mobile apps.
      </p>
      <p class="topic-item-keywords">AI · Chatbot · Customer Service
      </p>
    </li>
    <li class="topic-item">
      <p class="topic-item-title">Developing a Virtual Reality App
      </p>
      <p class="topic-item-description">Develop an application that allows users to experience virtual reality in their everyday lives. Utilize the latest technologies like 3D modeling, motion capture, augmented reality and more to create engaging experiences for customers.
      </p>
      <p class="topic-item-keywords">VR · 3D Modeling · Motion Capture
      </p>
    </li>
    <li class="topic-item">
      <p class="topic-item-title">Developing an Augmented Reality Platform
      </p>
      <p class="topic-item-description">Develop an augmented reality platform that can be used by businesses to showcase their products or services in a unique way. This platform can also be used by developers to create interactive games or educational applications using AR technology.
      </p>
      <p class="topic-item-keywords">AR · Interactive Games · Educational Applications
      </p>
    </li>
    <li class="topic-item">
      <p class="topic-item-title">Creating Wearable Technology Solutions
      </p>
      <p class="topic-item-description">Create wearable technology solutions for different industries such as healthcare, manufacturing, retail etc. These solutions should help companies increase efficiency and reduce costs while providing better user experiences at the same time.
      </p>
      <p class="topic-item-keywords">Wearables · Efficiency· User Experience
      </p>
    </li>
    <li class="topic-item">
      <p class="topic-item-title">Building Smart Home Devices
      </p>
      <p class="topic-item-description">Build smart home devices such as connected thermostats, security systems and other intelligent appliances which allow users to control their home environment remotely from any device with internet access. Integrate these devices into existing home automation systems for added convenience and functionality .
      </p>
      <p class="topic-item-keywords">IoT· Automation· Connected Devices
      </p>
    </li>
  </ul>
  <div class="topic-more">
    <button class="primary-button">+ More ideas
    </button>
  </div>
</section>

<style lang="postcss">
 .topics {
   min-width: 335px;
   background: white;
   border-radius: 4px;
   padding-bottom: 1rem;
 }

 ul {
   height: calc(100% - 45px);
   overflow-y: auto;
   overflow-x: hidden;
   padding: 1rem;
 }

 .topic-more {
   width: 100%;
   text-align: center;
   padding: 0 1rem;
   position: relative;
 }

 .topic-item {
   padding: 1rem;
   border-radius: 4px;
   position: relative;
   border: 2px solid var(--anti-flash-white);
   width: 300px;
   margin-bottom: calc(1rem + 1px);
   cursor: pointer;
 }

 .topic-item-title {
   font-size: 20px;
   font-weight: 700;
 }

 .topic-item-description {
   font-size: 16px;
   line-height: 1.2;
   margin: 0.5rem 0;
 }

 .topic-item-keywords {
   font-size: 14px;
   line-height: 1.2;
   margin: 0.5rem 0;
   font-weight: 700;
   color: var(--robin-egg-blue);
 }
 
 .primary-button {
   width: 100%;
   display: block;
   height: 45px;
   background: var(--robin-egg-blue);
   color: white;
   font-family: Lato;
   font-weight: 700;
   font-size: 16px;
   border: none;
   border-radius: 4px;
   padding: 0 1rem;
   cursor: pointer;
 }
</style>
