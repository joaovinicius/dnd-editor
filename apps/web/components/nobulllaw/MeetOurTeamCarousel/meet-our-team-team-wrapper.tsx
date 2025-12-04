'use client'

import dynamic from 'next/dynamic';

const MeetOurTeamTeamWrapper = (props) => {
  const LazyComponent = dynamic(
    () => import(/* webpackChunkName: "component-meet-our-team-carousel" */ './meet-our-team-carousel'),
    {
      ssr: false,
      loading: () => (
        <div className="h-[420px] w-full rounded-2xl bg-gray-200/40" />
      )
    }
  );
  return <LazyComponent {...props} />;
};

export default MeetOurTeamTeamWrapper;
