import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaymentStatusView } from 'src/sections/paymentStatus/view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Estados de Pago - ${CONFIG.appName}`}</title>
            </Helmet>

            <PaymentStatusView/>
        </>
    )
}