import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AccessDeniedView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`403 Forbidden! | Error - ${CONFIG.appName}`}</title>
      </Helmet>

      <AccessDeniedView />
    </>
  );
}