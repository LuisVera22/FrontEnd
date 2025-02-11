import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LegalGuardianView } from 'src/sections/legalGuardian/view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Legal Guardians - ${CONFIG.appName}`}</title>
            </Helmet>

            <LegalGuardianView/>
        </>
    )
}