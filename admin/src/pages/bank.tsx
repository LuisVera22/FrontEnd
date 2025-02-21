import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BankView } from 'src/sections/bank/view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Banks - ${CONFIG.appName}`}</title>
            </Helmet>

            <BankView/>
        </>
    )
}