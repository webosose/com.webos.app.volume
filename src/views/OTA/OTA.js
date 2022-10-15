import css from "./OTA.module.less";
import SwitchItem from '@enact/sandstone/SwitchItem';
import release_logo from '../../../assets/release_logo.png';
import Image from "@enact/sandstone/Image";
import Heading from "@enact/sandstone/Heading";
import { useSelector } from "react-redux";
const OTA = () => {
    const osinfo = useSelector(state=>state.osinfo);
    return <div className={css.container}>
        <div>
            <SwitchItem disabled>Automatic software updates</SwitchItem>
            <div className={css.subCnt}>
                <Image className={css.logo} src={release_logo}/>
                <Heading>webOS OSE {osinfo.webos_release}</Heading>
            </div>
        </div>
    </div>
}
export default OTA;