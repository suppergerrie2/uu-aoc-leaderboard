import OverviewTable from "components/overview/overview-table";
import { PageNav } from "components/page-nav/page-nav"
import React from "react";
import styles from "../page.module.scss";
function LandingPage() {
  return (
    <div className={styles["page-container"]}>
      <PageNav />
      <OverviewTable />
    </div>
  );
}

export default LandingPage;
