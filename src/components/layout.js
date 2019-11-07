import React from "react"
import { Link } from "gatsby"

import styles from "../pages/main.module.css"

export default ({ children }) => (
  <div className={styles.layout}>
    <Link to={`/`}>
      <h3 className={styles.layout_h3}>Narendra Kumar's blog</h3>
    </Link>
    {children}
  </div>
)
