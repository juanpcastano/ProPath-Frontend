import { ReactElement, useState } from "react";
import styles from "./TabLayout.module.css";

export interface tab {
  name: string;
  content: ReactElement
}

interface TabLayoutProps {
  tabs: tab[];
  initialActiveTab: string;
  footer?: ReactElement
  mainContainer?: boolean
}

const TabLayout = ({ tabs, initialActiveTab, footer, mainContainer = true }: TabLayoutProps) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  return (
    <div className={`${mainContainer && styles.mainContainer}`}>
      <div className={styles.container}>
        <div className={styles.tabList}>
          {tabs.map((tab, index) => {
            return (
              <div 
                key={index}
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

        <div className={styles.content}>
          {tabs.find(tab => tab.name === activeTab)?.content}
        </div>
        {footer}
      </div>
    </div>
  );
};
export default TabLayout;
