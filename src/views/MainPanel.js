import ContextualPopupButton from "../components/ContextualPopupButton/ContextualPopupButton";
import css from "./MainPanel.module.less";
const icons = ['sound','notification','download','bluetooth','wifi4']
const MainPanel = () => {
  console.log('MainPanel: MainPanel:',)
  return <div className={css.container}>
    <div className={css.statusBarBg}>
    {icons.map((v,index)=><ContextualPopupButton key={index} icon={v} />)}
    </div>
  </div>
}

export default MainPanel;
