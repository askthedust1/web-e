import React from "react";
import style from './container.module.scss'

interface Container {
    children: React.ReactNode;
}

const Container = ({ children }: Container) => {
    return (
        <div className={`${style.wrapper}`}>
            {children}
        </div>
    );
};

export default Container;
