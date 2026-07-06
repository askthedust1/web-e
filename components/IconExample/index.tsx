import style from "./icon-example.module.scss";
import Icon from "components/Icon";
interface IconExample {
    item: string
}
const IconExample = ({item}: IconExample) => {

    const copyIconText = ({text}: { text: any }) => {
        navigator.clipboard.writeText(text).then(()=> {   
        })
    }
    return (
        <div className={style.item} onClick={()=> {copyIconText({text: item})}}>
            <Icon key={item} height={40} width={40} id={item}/>
            <div className={style.title}>{item}</div>
        </div>
    );
};

export default IconExample;