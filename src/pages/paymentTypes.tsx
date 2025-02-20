import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaymentTypesView } from 'src/sections/paymentTypes/view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Tipos de Pago - ${CONFIG.appName}`}</title>
            </Helmet>

            <PaymentTypesView/>
        </>
    )
}