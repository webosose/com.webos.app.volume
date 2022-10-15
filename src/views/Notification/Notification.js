import css from "./Notification.module.less";
import Heading from '@enact/sandstone/Heading'
import CheckboxItem from '@enact/sandstone/CheckboxItem';
const Notification = () => {
    return <div className={css.container}>
        <div className={css.headercnt}>
            <Heading size="small">
                Notifications
            </Heading>
            <CheckboxItem disabled onToggle={console.log} className={css.readall}>
               Read All
            </CheckboxItem>
        </div>
    </div>
}
export default Notification;