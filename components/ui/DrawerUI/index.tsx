import React from 'react';
import Drawer from 'rc-drawer';
import Button from 'components/Buttons/Button';
import styles from "./drawer.module.scss";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
}

const DrawerUI: React.FC<DrawerProps> = ({ isOpen, onClose, children, width }) => {

  return (
    <>
      <Drawer open={isOpen} onClose={onClose} width={width}>
        <div className={styles.drawerContent}>
          <header className={styles.header}>
            <Button onClick={onClose} value="Закрыть" isBlue className={styles.button}/>
          </header>
          <div className={styles.drawerBody}>
            {children}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerUI;
