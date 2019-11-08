import React from "react"
import styles from "../styles/main.module.css"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <h4>Total number of posts: {data.allMarkdownRemark.totalCount} </h4>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <Link to={node.fields.slug} className={styles.index_link}>
              <h4 className={styles.index_link_h4}>
                {node.frontmatter.title}{" "}
                <span className={styles.index_link_h4_date}>
                  — {node.frontmatter.date}
                </span>
              </h4>
              <p>{node.excerpt}</p>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
