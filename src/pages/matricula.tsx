import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';

import { MatriculaView } from 'src/sections/matricula/view/matricula-view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Matriculas - ${CONFIG.appName}`}</title>
            </Helmet>

            <MatriculaView />
        </>
    );
}
