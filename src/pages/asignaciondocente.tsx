import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AsignacionDocenteView } from 'src/sections/asignaciondocente/view/asignaciondocente-view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Asignacion Docente - ${CONFIG.appName}`}</title>
            </Helmet>

            <AsignacionDocenteView/>
        </>
    )
}