import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"

const IndexPage = () => (
  <Layout>
    <article class="song">
      <a href="#" class="song__credits">
        <h1>Artist</h1>
        <h2>&ldquo;Song&rdquo;</h2>
        <h3>1 play &middot; 0 likes</h3>
      </a>
    </article>
  </Layout>
)

export default IndexPage
