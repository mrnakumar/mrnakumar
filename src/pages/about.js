import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => (
  <Layout>
    <h1>About {data.site.siteMetadata.title}</h1>
    <p>
      Welcome to my blog, my name is Narendra Kumar. Here I document what i learn.
    </p>
  </Layout>
)

export const queyr = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
