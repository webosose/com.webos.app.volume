import css from "./Bluetooth.module.less";
import SwitchItem from '@enact/sandstone/SwitchItem';
const Bluetooth = () => {
    return <div className={css.container}>
        <div>
            <SwitchItem disabled>Bluetooth</SwitchItem>
        </div>
    </div>
}
export default Bluetooth;