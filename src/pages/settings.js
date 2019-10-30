import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"

const SettingsPage = () => (
  <Layout>
    <article class="page">
      <ul class="page__tabs">
        <li class="page-tab--selected"><a href="/settings">Settings</a></li>
        <li><a href="/likes">Likes</a></li>
        <li><a href="/history">History</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      <div class="page__content">
        Hello, world.
      </div>
    </article>
  </Layout>
)

export default SettingsPage;
