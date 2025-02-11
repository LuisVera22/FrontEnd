import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DocenteView } from 'src/sections/docente/view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Docentes - ${CONFIG.appName}`}</title>
            </Helmet>

            <DocenteView/>
        </>
    )
}