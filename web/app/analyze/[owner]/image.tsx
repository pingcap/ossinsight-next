import { size } from '@/app/analyze/[owner]/twitter-image';
import { getOwnerInfo } from '@/components/Analyze/utils';
import { DateTime } from 'luxon';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/server';
import { FC, SVGAttributes } from 'react';

export default async function Image ({ params }: { params: { owner: string } }) {
  const owner = decodeURIComponent(params.owner);
  const info = await getOwnerInfo(owner);
  if (info.type !== 'Organization') {
    notFound();
  }

  const end = DateTime.now();
  const start = end.minus({ day: 28 });

  const [
    [stars, prs, issues, reviews],
    [activeParticipants, newParticipants],
  ] =
    await Promise.all([
      Promise.all(['stars', 'pull-requests', 'issues', 'reviews'].map(dim =>
        fetch(`https://api.ossinsight.io/q/orgs/${dim}/total?ownerId=${info.id}&period=past_28_days`)
          .then(res => res.json())
          .then(data => data.data[0]?.current_period_total ?? 0),
      )),
      Promise.all(['active', 'new'].map(dim =>
        fetch(`https://api.ossinsight.io/q/orgs/participants/${dim}/ranking?ownerId=${info.id}&activity=${dim}&period=past_28_days`)
          .then(res => res.json())
          .then(data => data.data.slice(0, 5)),
      )),
    ]);
  //

  // Font
  const poppinsMedium = fetch(
    new URL('./Poppins-Medium.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());
  const poppinsSemiBold = fetch(
    new URL('./Poppins-SemiBold.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: '#52099B',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins',
        }}
      >
        <Decorators />

        <img src={`https://github.com/${params.owner}.png`} width={90} height={90} style={{ position: 'absolute', left: 40, top: 53, borderRadius: 45, background: 'white', border: '1px solid white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.50)' }} />
        <div style={{ position: 'absolute', top: 53, left: 149, fontSize: 48, lineHeight: '57.6px', fontWeight: 600, color: 'white' }}>
          {info.name}
        </div>
        <div style={{ position: 'absolute', top: 116, left: 155, fontSize: 20, lineHeight: '24px', fontWeight: 500, color: 'white', opacity: 0.5 }}>
          {`${start.toFormat('yyyy/MM/dd')} - ${end.toFormat('yyyy/MM/dd')}`}
        </div>

        <Item left={40} top={185} text="Star Earned" Icon={StarIcon} color="#FF9C65" value={stars} />
        <Item left={263} top={185} text="Pull Requests" Icon={PrIcon} color="#FF6FB4" value={prs} />
        <Item left={500} top={185} text="Issues" Icon={IssuesIcon} color="#F3DD8F" value={issues} />
        <Item left={40} top={288} text="Code Reviews" Icon={ReviewIcon} color="#8BBAFF" value={reviews} />
        <Item left={263} top={288} text="Active/New participants" Icon={PeopleIcon} color="#F3E8AF"
              value={
                <div style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: -12.5, alignItems: 'center' }}>
                    {activeParticipants.map(({ login }: any) => <img key={login} src={`https://github.com/${login}.png`} width={36} height={36} style={{ borderRadius: 18, border: '1px solid white' }} />)}
                  </div>
                  <svg width="13" height="31" viewBox="0 0 13 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="11.7045" y1="0.175571" x2="0.467928" y2="30.1379" stroke="white" />
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: -12.5, alignItems: 'center' }}>
                    {newParticipants.map(({ login }: any) => <img key={login} src={`https://github.com/${login}.png`} width={36} height={36} style={{ borderRadius: 18, border: '1px solid white' }} />)}
                  </div>
                </div>
              }
        />

        <div style={{ position: 'absolute', left: 617, top: 363, fontSize: 24, lineHeight: '28.8px', color: 'white', opacity: 0.5 }}>
          ossinsight.io
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Poppins',
          data: await poppinsMedium,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'Poppins',
          data: await poppinsSemiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
}

function Decorators () {
  return (
    <div style={{ display: 'flex', position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', left: -596, top: -74, width: 1574, height: 1574, backgroundImage: 'radial-gradient(108.18% 108.18% at 52.79% 55.39%, rgba(255, 99, 174, 0.10) 0%, rgba(211, 93, 150, 0.08) 31%, rgba(163, 34, 135, 0) 100%)', borderRadius: 9999 }} />
      <div style={{ position: 'absolute', left: -54, top: -466, width: 1452, height: 1452, backgroundImage: 'radial-gradient(89.42% 89.42% at 45.38% 44.04%, rgba(217, 66, 255, 0.16) 0%, rgba(118, 0, 147, 0.08) 56%, rgba(163, 34, 127, 0) 100%)', borderRadius: 9999 }} />
      <div style={{ position: 'absolute', left: -343, top: -170, width: 942, height: 946, background: 'radial-gradient(74.08% 74.08% at 61.76% 37.13%, rgba(206, 98, 0, 0.06) 0%, rgba(47, 0, 147, 0.26) 42%, rgba(73, 26, 172, 0.05) 100%)', borderRadius: 9999 }} />
      <div style={{ position: 'absolute', left: 352, top: -85, width: 1048, height: 1014, background: 'radial-gradient(74.08% 74.08% at 61.76% 37.13%, rgba(255, 132, 228, 0.59) 0%, rgba(82.70, 0, 147, 0.19) 42%, rgba(189, 8, 252, 0.03) 100%)', borderRadius: 9999 }} />

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 14, backgroundColor: '#FA1EFF' }} />
    </div>
  );
}

const nf = new Intl.NumberFormat('en');

function Item ({ left, top, text, value, color, Icon }: { left: number, top: number, text: string, value: any, Icon: FC<SVGAttributes<SVGSVGElement>>, color: string }) {
  return (
    <div style={{ display: 'flex', position: 'absolute', flexDirection: 'row', gap: 8, left, top, color }}>
      <Icon />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 20, lineHeight: '24px', color, fontWeight: 500 }}>{text}</div>
        {typeof value === 'number'
          ? <div style={{ fontSize: 24, lineHeight: '28.8px', color: 'white', fontWeight: 600 }}>{nf.format(value)}</div>
          : value}
      </div>
    </div>
  );
}

function StarIcon () {
  return (
    <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M12.974 1.81704e-07C13.136 -0.00010464 13.2948 0.0451445 13.4324 0.130626C13.5701 0.216107 13.681 0.338408 13.7527 0.483685L17.2913 7.65448L25.2049 8.80468C25.3651 8.82812 25.5154 8.89588 25.6391 9.00029C25.7627 9.10469 25.8547 9.24159 25.9047 9.39553C25.9546 9.54946 25.9605 9.71429 25.9218 9.87141C25.883 10.0285 25.801 10.1717 25.6852 10.2847L19.9596 15.8655L21.3112 23.7468C21.3386 23.9064 21.3208 24.0705 21.2599 24.2206C21.1989 24.3706 21.0972 24.5006 20.9662 24.5958C20.8352 24.691 20.6802 24.7477 20.5187 24.7594C20.3571 24.7712 20.1956 24.7374 20.0522 24.6621L12.974 20.9408L5.89574 24.6621C5.75248 24.7373 5.59103 24.771 5.42964 24.7593C5.26824 24.7476 5.11333 24.6911 4.98239 24.596C4.85145 24.5009 4.7497 24.3711 4.68863 24.2213C4.62756 24.0714 4.6096 23.9075 4.63678 23.748L5.98832 15.8655L0.262787 10.2847C0.146571 10.1716 0.064336 10.0283 0.0254012 9.87095C-0.0135336 9.71358 -0.00761181 9.54845 0.0424954 9.39427C0.0926026 9.2401 0.184892 9.10304 0.308905 8.99863C0.432919 8.89421 0.583698 8.82663 0.744157 8.80352L8.65668 7.65448L12.1964 0.483685C12.268 0.338584 12.3788 0.216401 12.5162 0.130931C12.6536 0.045462 12.8122 0.000111248 12.974 1.81704e-07ZM12.974 2.82921L10.0117 8.83129C9.94935 8.95745 9.85726 9.06656 9.74336 9.14921C9.62947 9.23186 9.49718 9.28557 9.35791 9.30572L2.73328 10.2685L7.52731 14.941C7.62795 15.0393 7.70319 15.1606 7.74653 15.2945C7.78987 15.4283 7.80001 15.5707 7.7761 15.7093L6.64441 22.3073L12.5701 19.1923C12.6947 19.1268 12.8333 19.0926 12.974 19.0926C13.1147 19.0926 13.2533 19.1268 13.3778 19.1923L19.3024 22.3073L18.1718 15.7093C18.1479 15.5707 18.1581 15.4283 18.2014 15.2945C18.2448 15.1606 18.32 15.0393 18.4206 14.941L23.2147 10.2685L16.59 9.30688C16.4508 9.28673 16.3185 9.23302 16.2046 9.15037C16.0907 9.06772 15.9986 8.95861 15.9362 8.83245L12.974 2.82921Z"
            fill="currentColor" />
    </svg>
  );
}

function PrIcon () {
  return <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd"
          d="M3.83217 1.76869C3.56119 1.76869 3.29286 1.82207 3.04251 1.92577C2.79216 2.02947 2.56468 2.18146 2.37307 2.37307C2.18146 2.56468 2.02947 2.79216 1.92577 3.04251C1.82207 3.29286 1.76869 3.56119 1.76869 3.83217C1.76869 4.10315 1.82207 4.37148 1.92577 4.62183C2.02947 4.87218 2.18146 5.09966 2.37307 5.29127C2.56468 5.48288 2.79216 5.63487 3.04251 5.73857C3.29286 5.84227 3.56119 5.89565 3.83217 5.89565C4.37944 5.89565 4.90429 5.67824 5.29127 5.29127C5.67824 4.90429 5.89565 4.37944 5.89565 3.83217C5.89565 3.2849 5.67824 2.76005 5.29127 2.37307C4.90429 1.9861 4.37944 1.76869 3.83217 1.76869ZM0 3.83217C0 2.81582 0.403745 1.84109 1.12242 1.12242C1.84109 0.403745 2.81582 0 3.83217 0C4.84852 0 5.82325 0.403745 6.54192 1.12242C7.26059 1.84109 7.66434 2.81582 7.66434 3.83217C7.66434 4.84852 7.26059 5.82325 6.54192 6.54192C5.82325 7.26059 4.84852 7.66434 3.83217 7.66434C2.81582 7.66434 1.84109 7.26059 1.12242 6.54192C0.403745 5.82325 0 4.84852 0 3.83217ZM3.83217 18.8661C3.2849 18.8661 2.76005 19.0835 2.37307 19.4704C1.9861 19.8574 1.76869 20.3823 1.76869 20.9295C1.76869 21.4768 1.9861 22.0017 2.37307 22.3886C2.76005 22.7756 3.2849 22.993 3.83217 22.993C4.37944 22.993 4.90429 22.7756 5.29127 22.3886C5.67824 22.0017 5.89565 21.4768 5.89565 20.9295C5.89565 20.3823 5.67824 19.8574 5.29127 19.4704C4.90429 19.0835 4.37944 18.8661 3.83217 18.8661ZM0 20.9295C0 19.9132 0.403745 18.9385 1.12242 18.2198C1.84109 17.5011 2.81582 17.0974 3.83217 17.0974C4.84852 17.0974 5.82325 17.5011 6.54192 18.2198C7.26059 18.9385 7.66434 19.9132 7.66434 20.9295C7.66434 21.9459 7.26059 22.9206 6.54192 23.6393C5.82325 24.358 4.84852 24.7617 3.83217 24.7617C2.81582 24.7617 1.84109 24.358 1.12242 23.6393C0.403745 22.9206 0 21.9459 0 20.9295ZM20.9295 18.8661C20.3823 18.8661 19.8574 19.0835 19.4704 19.4704C19.0835 19.8574 18.8661 20.3823 18.8661 20.9295C18.8661 21.4768 19.0835 22.0017 19.4704 22.3886C19.8574 22.7756 20.3823 22.993 20.9295 22.993C21.4768 22.993 22.0017 22.7756 22.3886 22.3886C22.7756 22.0017 22.993 21.4768 22.993 20.9295C22.993 20.3823 22.7756 19.8574 22.3886 19.4704C22.0017 19.0835 21.4768 18.8661 20.9295 18.8661ZM17.0974 20.9295C17.0974 19.9132 17.5011 18.9385 18.2198 18.2198C18.9385 17.5011 19.9132 17.0974 20.9295 17.0974C21.9459 17.0974 22.9206 17.5011 23.6393 18.2198C24.358 18.9385 24.7617 19.9132 24.7617 20.9295C24.7617 21.9459 24.358 22.9206 23.6393 23.6393C22.9206 24.358 21.9459 24.7617 20.9295 24.7617C19.9132 24.7617 18.9385 24.358 18.2198 23.6393C17.5011 22.9206 17.0974 21.9459 17.0974 20.9295Z"
          fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd"
          d="M3.83161 6.77995C4.06616 6.77995 4.29109 6.87312 4.45694 7.03897C4.62279 7.20481 4.71596 7.42975 4.71596 7.66429V17.0973C4.71596 17.3319 4.62279 17.5568 4.45694 17.7227C4.29109 17.8885 4.06616 17.9817 3.83161 17.9817C3.59707 17.9817 3.37213 17.8885 3.20628 17.7227C3.04044 17.5568 2.94727 17.3319 2.94727 17.0973V7.66429C2.94727 7.42975 3.04044 7.20481 3.20628 7.03897C3.37213 6.87312 3.59707 6.77995 3.83161 6.77995ZM14.037 0.259363C14.2026 0.425178 14.2956 0.649948 14.2956 0.884301C14.2956 1.11865 14.2026 1.34342 14.037 1.50924L12.5984 2.94778H17.3916C18.5643 2.94778 19.689 3.41364 20.5182 4.24287C21.3475 5.07211 21.8133 6.19679 21.8133 7.36951V17.6869C21.8133 17.9214 21.7202 18.1464 21.5543 18.3122C21.3885 18.4781 21.1635 18.5712 20.929 18.5712C20.6944 18.5712 20.4695 18.4781 20.3037 18.3122C20.1378 18.1464 20.0446 17.9214 20.0446 17.6869V7.36951C20.0446 6.66588 19.7651 5.99107 19.2676 5.49353C18.77 4.99599 18.0952 4.71647 17.3916 4.71647H12.5996L14.0382 6.15501C14.1992 6.32187 14.2882 6.5453 14.2861 6.77718C14.284 7.00905 14.1908 7.23081 14.0268 7.3947C13.8628 7.55859 13.6409 7.65149 13.409 7.6534C13.1772 7.6553 12.9538 7.56606 12.7871 7.40489L9.83928 4.45706C9.67367 4.29125 9.58065 4.06648 9.58065 3.83212C9.58065 3.59777 9.67367 3.373 9.83928 3.20719L12.7871 0.259363C12.9529 0.0937535 13.1777 0.000732422 13.412 0.000732422C13.6464 0.000732422 13.8712 0.0937535 14.037 0.259363Z"
          fill="#FF6FB4" />
  </svg>;

}

function IssuesIcon () {
  return <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.3799 6.75317C12.6038 6.75317 12.8185 6.84211 12.9768 7.00042C13.1351 7.15873 13.2241 7.37344 13.2241 7.59732V12.6622C13.2241 12.8861 13.1351 13.1008 12.9768 13.2591C12.8185 13.4174 12.6038 13.5064 12.3799 13.5064C12.156 13.5064 11.9413 13.4174 11.783 13.2591C11.6247 13.1008 11.5358 12.8861 11.5358 12.6622V7.59732C11.5358 7.37344 11.6247 7.15873 11.783 7.00042C11.9413 6.84211 12.156 6.75317 12.3799 6.75317ZM13.5055 16.883C13.5055 17.1815 13.3869 17.4678 13.1758 17.6788C12.9647 17.8899 12.6784 18.0085 12.3799 18.0085C12.0814 18.0085 11.7951 17.8899 11.5841 17.6788C11.373 17.4678 11.2544 17.1815 11.2544 16.883C11.2544 16.5845 11.373 16.2982 11.5841 16.0871C11.7951 15.876 12.0814 15.7574 12.3799 15.7574C12.6784 15.7574 12.9647 15.876 13.1758 16.0871C13.3869 16.2982 13.5055 16.5845 13.5055 16.883Z"
      fill="#F3DD8F" />
    <path fillRule="evenodd" clipRule="evenodd"
          d="M12.3809 0C5.54325 0 0 5.54325 0 12.3809C0 19.2185 5.54325 24.7617 12.3809 24.7617C19.2185 24.7617 24.7617 19.2185 24.7617 12.3809C24.7617 5.54325 19.2185 0 12.3809 0ZM1.6883 12.3809C1.6883 9.54501 2.81483 6.82532 4.82008 4.82008C6.82532 2.81483 9.54501 1.6883 12.3809 1.6883C15.2167 1.6883 17.9364 2.81483 19.9416 4.82008C21.9469 6.82532 23.0734 9.54501 23.0734 12.3809C23.0734 15.2167 21.9469 17.9364 19.9416 19.9416C17.9364 21.9469 15.2167 23.0734 12.3809 23.0734C9.54501 23.0734 6.82532 21.9469 4.82008 19.9416C2.81483 17.9364 1.6883 15.2167 1.6883 12.3809Z"
          fill="currentColor" />
  </svg>;
}

function ReviewIcon () {
  return <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.8943 5.24941C10.9772 5.33883 11.0417 5.44371 11.0841 5.55807C11.1265 5.67242 11.1459 5.794 11.1413 5.91587C11.1367 6.03774 11.1082 6.15752 11.0573 6.26835C11.0064 6.37918 10.9342 6.4789 10.8447 6.56182L7.24429 9.90473L10.8447 13.2477C10.9342 13.3306 11.0064 13.4303 11.0573 13.5411C11.1081 13.652 11.1367 13.7717 11.1413 13.8936C11.1459 14.0155 11.1264 14.137 11.0841 14.2514C11.0417 14.3657 10.9772 14.4706 10.8943 14.5601C10.8113 14.6495 10.7116 14.7217 10.6008 14.7726C10.4899 14.8235 10.3702 14.852 10.2483 14.8566C10.1264 14.8612 10.0049 14.8418 9.89051 14.7994C9.77616 14.757 9.67128 14.6925 9.58185 14.6096L5.24844 10.5857C5.15468 10.4988 5.07988 10.3934 5.02873 10.2762C4.97758 10.1591 4.95117 10.0326 4.95117 9.90473C4.95117 9.77688 4.97758 9.6504 5.02873 9.53322C5.07988 9.41605 5.15468 9.31069 5.24844 9.22377L9.58185 5.19989C9.67127 5.11696 9.77615 5.05245 9.8905 5.01006C10.0049 4.96766 10.1264 4.94821 10.2483 4.95281C10.3702 4.95741 10.49 4.98597 10.6008 5.03686C10.7116 5.08775 10.8113 5.15998 10.8943 5.24941ZM15.1534 6.56182C14.9728 6.39435 14.8661 6.162 14.8568 5.91587C14.8475 5.66975 14.9364 5.43002 15.1039 5.24941C15.2713 5.06881 15.5037 4.96213 15.7498 4.95284C15.9959 4.94356 16.2357 5.03242 16.4163 5.19989L20.7497 9.22377C20.8434 9.31069 20.9182 9.41605 20.9694 9.53322C21.0205 9.6504 21.0469 9.77688 21.0469 9.90473C21.0469 10.0326 21.0205 10.1591 20.9694 10.2762C20.9182 10.3934 20.8434 10.4988 20.7497 10.5857L16.4163 14.6096C16.2357 14.777 15.9959 14.8659 15.7498 14.8566C15.5037 14.8473 15.2713 14.7407 15.1039 14.5601C14.9364 14.3795 14.8475 14.1397 14.8568 13.8936C14.8661 13.6475 14.9728 13.4151 15.1534 13.2477L18.7538 9.90473L15.1534 6.56182Z"
      fill="#8BBAFF" />
    <path fillRule="evenodd" clipRule="evenodd"
          d="M0 2.1667C0 0.970684 0.970684 0 2.1667 0H23.8338C25.0298 0 26.0005 0.970684 26.0005 2.1667V17.6432C26.0005 18.2178 25.7722 18.7689 25.3658 19.1753C24.9595 19.5816 24.4084 19.8099 23.8338 19.8099H11.8364L7.41261 24.2337C7.16032 24.4858 6.83895 24.6575 6.4891 24.7271C6.13926 24.7966 5.77664 24.7609 5.44709 24.6244C5.11755 24.4879 4.83586 24.2568 4.63763 23.9603C4.4394 23.6637 4.33353 23.3151 4.33341 22.9584V19.8099H2.1667C1.59206 19.8099 1.04095 19.5816 0.634613 19.1753C0.228277 18.7689 0 18.2178 0 17.6432V2.1667ZM2.1667 1.85718C2.08461 1.85718 2.00588 1.88979 1.94783 1.94783C1.88979 2.00588 1.85718 2.08461 1.85718 2.1667V17.6432C1.85718 17.814 1.99584 17.9527 2.1667 17.9527H5.262C5.50827 17.9527 5.74446 18.0505 5.91861 18.2247C6.09275 18.3988 6.19058 18.635 6.19059 18.8813V22.8309L10.7964 18.2251C10.9704 18.0509 11.2064 17.9529 11.4526 17.9527H23.8338C23.9158 17.9527 23.9946 17.9201 24.0526 17.862C24.1107 17.804 24.1433 17.7253 24.1433 17.6432V2.1667C24.1433 2.08461 24.1107 2.00588 24.0526 1.94783C23.9946 1.88979 23.9158 1.85718 23.8338 1.85718H2.1667Z"
          fill="currentColor" />
  </svg>;
}

function PeopleIcon () {
  return <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd"
          d="M4.04826 6.36746C4.04849 5.26961 4.3325 4.19047 4.87275 3.23475C5.41299 2.27903 6.19111 1.47918 7.13161 0.912843C8.0721 0.346501 9.14302 0.0328924 10.2404 0.00244952C11.3379 -0.0279933 12.4245 0.225764 13.395 0.739095C14.3654 1.25243 15.1867 2.0079 15.7791 2.9322C16.3715 3.8565 16.7149 4.91824 16.776 6.01439C16.8371 7.11054 16.6138 8.20386 16.1277 9.18826C15.6417 10.1727 14.9095 11.0147 14.0021 11.6327C15.9562 12.3494 17.651 13.6345 18.8686 15.3226C20.0861 17.0106 20.7707 19.0244 20.8341 21.1048C20.8375 21.2189 20.8184 21.3325 20.7779 21.4392C20.7374 21.5458 20.6763 21.6435 20.5981 21.7266C20.4401 21.8943 20.222 21.9924 19.9916 21.9994C19.7613 22.0063 19.5377 21.9214 19.3699 21.7634C19.2022 21.6054 19.104 21.3873 19.0971 21.1569C19.0282 18.9006 18.0834 16.7598 16.463 15.1881C14.8425 13.6165 12.6739 12.7375 10.4165 12.7375C8.15907 12.7375 5.99038 13.6165 4.36997 15.1881C2.74956 16.7598 1.80477 18.9006 1.73581 21.1569C1.72422 21.3837 1.62427 21.5969 1.45739 21.7509C1.2905 21.9049 1.06996 21.9874 0.84299 21.9807C0.616024 21.974 0.400693 21.8787 0.243129 21.7152C0.0855642 21.5518 -0.00170209 21.333 2.51599e-05 21.106C0.0631935 19.0254 0.747613 17.0113 1.96518 15.323C3.18276 13.6347 4.87775 12.3495 6.832 11.6327C5.97361 11.0488 5.27115 10.2637 4.78592 9.34596C4.3007 8.42819 4.04744 7.40561 4.04826 6.36746ZM10.417 1.73561C9.1886 1.73561 8.01048 2.22361 7.14184 3.09225C6.2732 3.96089 5.7852 5.13902 5.7852 6.36746C5.7852 7.5959 6.2732 8.77403 7.14184 9.64267C8.01048 10.5113 9.1886 10.9993 10.417 10.9993C11.6455 10.9993 12.8236 10.5113 13.6923 9.64267C14.5609 8.77403 15.0489 7.5959 15.0489 6.36746C15.0489 5.13902 14.5609 3.96089 13.6923 3.09225C12.8236 2.22361 11.6455 1.73561 10.417 1.73561Z"
          fill="#F3E8AF" />
    <path
      d="M20.0168 6.36755C19.8454 6.36755 19.6787 6.37913 19.5142 6.40229C19.3994 6.42284 19.2816 6.42006 19.1679 6.39412C19.0542 6.36817 18.9469 6.31959 18.8524 6.25127C18.7579 6.18295 18.6781 6.09629 18.6178 5.99647C18.5575 5.89664 18.5179 5.78569 18.5014 5.67023C18.4849 5.55478 18.4918 5.43718 18.5218 5.32446C18.5517 5.21174 18.6041 5.10621 18.6757 5.01415C18.7473 4.9221 18.8367 4.84541 18.9386 4.78867C19.0405 4.73192 19.1528 4.69628 19.2687 4.68387C20.4204 4.51736 21.5948 4.73852 22.607 5.31256C23.6192 5.88659 24.4118 6.7809 24.8601 7.85475C25.3083 8.9286 25.3868 10.121 25.0831 11.2443C24.7795 12.3677 24.1109 13.3581 23.1826 14.0599C24.5472 14.6709 25.7057 15.6637 26.5186 16.9185C27.3314 18.1733 27.7638 19.6365 27.7635 21.1316C27.7635 21.3619 27.672 21.5828 27.5092 21.7457C27.3463 21.9085 27.1254 22 26.8951 22C26.6647 22 26.4438 21.9085 26.281 21.7457C26.1181 21.5828 26.0266 21.3619 26.0266 21.1316C26.0265 19.8394 25.6101 18.5817 24.8393 17.5447C24.0684 16.5078 22.984 15.7467 21.7468 15.3742L21.1284 15.1889V13.2482L21.6032 13.0061C22.3069 12.6497 22.87 12.0664 23.2015 11.3505C23.533 10.6347 23.6136 9.82798 23.4302 9.06069C23.2469 8.29339 22.8103 7.61029 22.191 7.12164C21.5716 6.633 20.8057 6.36734 20.0168 6.36755Z"
      fill="currentColor" />
  </svg>;
}