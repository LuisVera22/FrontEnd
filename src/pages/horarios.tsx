import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { HorariosView } from 'src/sections/horarios/view/horarios-view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Horarios - ${CONFIG.appName}`}</title>
            </Helmet>

            <HorariosView/>
        </>
    )
}