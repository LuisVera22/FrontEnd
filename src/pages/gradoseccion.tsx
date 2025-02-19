import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { GradoSeccionView } from 'src/sections/gradoseccion/view/gradoseccion-view';


export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Grado Seccion - ${CONFIG.appName}`}</title>
            </Helmet>

            <GradoSeccionView/>
        </>
    )
}