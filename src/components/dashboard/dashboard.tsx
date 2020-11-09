import React, { memo } from 'react';
import { useRouter } from '../../hooks/useRouter';

import { ReactComponent as ASRRouteIcon } from '../../assets/images/route__asr.svg';
import { ReactComponent as TTSRouteIcon } from '../../assets/images/route__tts.svg';

const Dashboard = memo(() => {
  const { push } = useRouter();

  return (
    <section className="flex items-center h-full w-full">
      <div
        onClick={() => push('/asr/')}
        className="dashboard__asr_item flex items-center justify-center h-full w-1/2 text-4xl cursor-pointer"
      >
        {/*    <h1 className="dashboard__asr-text z-50">ASR</h1> */}
        {/*      <ASRBackground className="dashboard__asr-background absolute" /> */}
        <ASRRouteIcon className="dashboard__asr-background absolute z-20" />
      </div>
      <div
        onClick={() => push('/tts/')}
        className="dashboard__tts_item flex items-center justify-center h-full w-1/2 text-4xl cursor-pointer"
      >
        {/*       <h1 className="dashboard__tts-text z-50">TTS</h1> */}
        {/*         <TTSBackground className="dashboard__tts-background absolute" /> */}
        <TTSRouteIcon className="dashboard__tts-background absolute z-20" />
      </div>
    </section>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
