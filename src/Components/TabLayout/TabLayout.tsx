import { ReactElement, useState } from "react";
import styles from "./TabLayout.module.css";

interface tab {
  name: string;
  content: ReactElement
}

interface TabLayoutProps {
  tabs: tab[];
  initialActiveTab: string;
}

const TabLayout = ({ tabs, initialActiveTab }: TabLayoutProps) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.tabList}>
          {tabs.map((tab) => {
            return (
              <div
                className={`${styles.tab} ${
                  activeTab === tab.name ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab(tab.name)}
              >
                <span className={styles.span}>{tab.name}</span>
                <div
                  className={`${styles.decorator} ${
                    activeTab === tab.name ? styles.decoratorActive : ""
                  }`}
                ></div>
              </div>
            );
          })}
        </div>

        <div className="content">
          {tabs.find(tab => tab.name === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};
export default TabLayout;
